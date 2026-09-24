package com.m4mental.forklite.ui.screens

import android.content.Intent
import android.view.View
import android.webkit.CookieManager
import android.widget.Toast
import androidx.activity.compose.BackHandler
import androidx.activity.compose.LocalActivity
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.asPaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.systemBars
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalResources
import androidx.core.graphics.ColorUtils
import androidx.core.net.toUri
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import androidx.lifecycle.viewmodel.compose.viewModel
import com.multiplatform.webview.web.LoadingState
import com.multiplatform.webview.web.WebView
import com.multiplatform.webview.web.rememberSaveableWebViewState
import com.multiplatform.webview.web.rememberWebViewNavigator
import com.m4mental.forklite.R
import com.m4mental.forklite.ui.components.NetworkErrorDialog
import com.m4mental.forklite.ui.components.settings.SettingsDialog
import com.m4mental.forklite.ui.viewmodel.MainViewModel
import com.m4mental.forklite.ui.viewmodel.SettingsViewModel
import com.m4mental.forklite.utils.DESKTOP_USER_AGENT
import com.m4mental.forklite.utils.ExternalRequestInterceptor
import com.m4mental.forklite.utils.fileChooserWebViewParams
import com.m4mental.forklite.utils.jsBridge.ClipboardBridge
import com.m4mental.forklite.utils.jsBridge.DownloadBridge
import com.m4mental.forklite.utils.jsBridge.NobookSettings
import com.m4mental.forklite.utils.jsBridge.ThemeChange
import com.m4mental.forklite.utils.rememberAutoDesktop
import com.m4mental.forklite.utils.rememberImeHeight
import kotlinx.coroutines.delay

@Composable
fun NobookWebView(
    url: String,
    settingsVM: SettingsViewModel = viewModel()
) {
    val context = LocalContext.current
    val activity = LocalActivity.current
    val resources = LocalResources.current

    val state = rememberSaveableWebViewState(url)
    val navigator = rememberWebViewNavigator(
        requestInterceptor = ExternalRequestInterceptor { externalUrl ->
            val intent = Intent(Intent.ACTION_VIEW, externalUrl.toUri())
            runCatching {
                context.startActivity(intent)
            }.onFailure {
                Toast.makeText(
                    context,
                    resources.getString(R.string.not_supported),
                    Toast.LENGTH_SHORT
                ).show()
            }
        }
    )

    LaunchedEffect(navigator) {
        val bundle = state.viewState
        if (bundle == null) {
            navigator.loadUrl(url)
        }
    }

    // allow exiting while scrolling to top.
    var exitScroll by remember { mutableStateOf(false) }
    BackHandler {
        if (exitScroll) {
            activity?.finish()
        } else {
            navigator.evaluateJavaScript("backHandlerNB();") {
                val backHandled = it.removeSurrounding("\"")
                when (backHandled) {
                    "false" -> {
                        if (navigator.canGoBack) {
                            navigator.navigateBack()
                        } else {
                            activity?.finish()
                        }
                    }
                    "exit" -> activity?.finish()
                    "scrolling" -> exitScroll = true
                }
            }
        }
    }

    LaunchedEffect(exitScroll) {
        if (exitScroll) {
            delay(800)
            exitScroll = false
        }
    }

    val isDesktop by settingsVM.desktopLayout.collectAsState()
    val isAutoRevert by settingsVM.isRevertDesktop.collectAsState()
    val isAutoDesktop = rememberAutoDesktop()

    LaunchedEffect(Unit) {
        if (isAutoDesktop && !isDesktop) {
            settingsVM.setRevertDesktop(true)
            settingsVM.setDesktopLayout(true)
        }
        else if (!isAutoDesktop && isAutoRevert) {
            settingsVM.setRevertDesktop(false)
            settingsVM.setDesktopLayout(false)
        }
    }

    var isLoading by rememberSaveable { mutableStateOf(true) }
    val isError = state.errorsForCurrentRequest.lastOrNull()?.isFromMainFrame == true

    val viewModel: MainViewModel = viewModel {
        MainViewModel(
            resources = resources,
            settings = settingsVM
        )
    }

    val rawThemeColor by viewModel.themeColor
    val isAmoled by settingsVM.amoledBlack.collectAsState()
    val themeColor = if (isAmoled && rawThemeColor != Color.White) Color.Black else rawThemeColor

    // Manual handling to fix visual & padding bug on settings dialog.
    var isImmersiveMode by rememberSaveable { mutableStateOf(settingsVM.immersiveMode.value) }

    fun setWindow(immersive: Boolean) {
        val window = activity?.window ?: return
        val windowInsetsController = WindowInsetsControllerCompat(window, window.decorView)

        if (immersive) {
            windowInsetsController.hide(WindowInsetsCompat.Type.systemBars())
            windowInsetsController.systemBarsBehavior =
                WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        } else {
            val isLight = ColorUtils.calculateLuminance(themeColor.toArgb()) > 0.5
            windowInsetsController.show(WindowInsetsCompat.Type.systemBars())
            windowInsetsController.isAppearanceLightStatusBars = isLight
            windowInsetsController.isAppearanceLightNavigationBars = isLight
        }
        isImmersiveMode = immersive
    }

    LaunchedEffect(isImmersiveMode, themeColor.value, isAmoled) {
        setWindow(isImmersiveMode)
    }

    val userScripts by viewModel.scripts
    val loadingState = state.loadingState

    LaunchedEffect(loadingState, userScripts) {
        when (loadingState) {
            is LoadingState.Loading -> {
                if (loadingState.progress >= 0.35f) {
                    userScripts?.let { scripts ->
                        navigator.evaluateJavaScript(scripts) {}
                    }
                    isLoading = false
                }
            }
            is LoadingState.Finished -> {
                userScripts?.let { scripts ->
                    navigator.evaluateJavaScript(scripts) {}
                }
                isLoading = false
            }
            else -> {}
        }
    }

    // Safety fast-dismiss: Never show splash logo for more than 1000ms on startup
    LaunchedEffect(Unit) {
        delay(1000)
        userScripts?.let { scripts ->
            navigator.evaluateJavaScript(scripts) {}
        }
        isLoading = false
    }

    if (isError && isLoading) {
        NetworkErrorDialog { activity?.finish() }
        return
    }

    var settingsToggle by rememberSaveable { mutableStateOf(false) }
    if (settingsToggle) {
        setWindow(false)
        SettingsDialog(
            themeColor = themeColor,
            onDismiss = {
                setWindow(settingsVM.immersiveMode.value)
                settingsToggle = false
            },
            onReload = {
                isLoading = true
                viewModel.setThemeColor(Color.Transparent)
                setWindow(settingsVM.immersiveMode.value)
                viewModel.refresh(
                    resources = resources,
                    settings = settingsVM
                )
                navigator.reload()
            }
        )
    }

    if (isLoading) {
        SplashLoading(
            if (loadingState is LoadingState.Loading) {
                loadingState.progress
            } else {
                0.8F
            }
        )
    }


    LaunchedEffect(isDesktop) {
        val userAgent = if (isDesktop) DESKTOP_USER_AGENT else ""
        state.nativeWebView.settings.userAgentString = userAgent
    }

    // needed to consume extra padding when keyboard is open
    val barsInsets = WindowInsets.systemBars.asPaddingValues()
    val imeHeight = rememberImeHeight()

    WebView(
        modifier = Modifier
            .fillMaxSize()
            .background(themeColor)
            .then(
                if (isImmersiveMode) {
                    Modifier.padding(bottom = imeHeight)
                } else {
                    Modifier.padding(
                        top = barsInsets.calculateTopPadding(),
                        bottom = maxOf(barsInsets.calculateBottomPadding(), imeHeight)
                    )
                }
            ),
        state = state,
        navigator = navigator,
        platformWebViewParams = fileChooserWebViewParams(),
        captureBackPresses = false,
        onCreated = { webView ->

            val cookieManager = CookieManager.getInstance()
            cookieManager.setAcceptCookie(true)
            cookieManager.setAcceptThirdPartyCookies(webView, true)

            state.webSettings.apply {
                isJavaScriptEnabled = true

                androidWebSettings.apply {
                    domStorageEnabled = true
                    hideDefaultVideoPoster = true
                    mediaPlaybackRequiresUserGesture = false
                }
            }

            webView.apply {
                addJavascriptInterface(
                    NobookSettings { settingsToggle = true },
                    "SettingsBridge"
                )
                addJavascriptInterface(
                    ThemeChange { 
                        val color = Color(it)
                        val isAmoledActive = settingsVM.amoledBlack.value
                        if (isAmoledActive && color != Color.White && color != Color.Transparent) {
                            viewModel.setThemeColor(Color.Black)
                        } else {
                            viewModel.setThemeColor(color)
                        }
                    },
                    "ThemeBridge"
                )
                addJavascriptInterface(
                    DownloadBridge(context),
                    "DownloadBridge"
                )
                addJavascriptInterface(
                    ClipboardBridge(context),
                    "ClipboardBridge"
                )

                setLayerType(View.LAYER_TYPE_HARDWARE, null)
                setBackgroundColor(0xFF000000.toInt())

                overScrollMode = View.OVER_SCROLL_NEVER
                isVerticalScrollBarEnabled = false
                isHorizontalScrollBarEnabled = false

                settings.apply {
                    setSupportZoom(true)
                    builtInZoomControls = true
                    displayZoomControls = false
                    cacheMode = android.webkit.WebSettings.LOAD_DEFAULT
                    databaseEnabled = true
                    useWideViewPort = true
                    loadWithOverviewMode = true
                    loadsImagesAutomatically = true
                    setOffscreenPreRaster(true)
                    mediaPlaybackRequiresUserGesture = false
                    mixedContentMode = android.webkit.WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
                }
            }
        }
    )
}
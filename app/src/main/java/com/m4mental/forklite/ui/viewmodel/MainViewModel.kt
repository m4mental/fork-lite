package com.m4mental.forklite.ui.viewmodel

import android.content.res.Resources
import androidx.compose.runtime.State
import androidx.compose.runtime.mutableStateOf
import androidx.compose.ui.graphics.Color
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.m4mental.forklite.R
import com.m4mental.forklite.utils.Script
import com.m4mental.forklite.utils.fetchScripts
import com.m4mental.forklite.utils.loadLocalScripts
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch


class MainViewModel(
    resources: Resources,
    settings: SettingsViewModel
): ViewModel() {

    private val _themeColor = mutableStateOf(Color.Transparent)
    val themeColor: State<Color> = _themeColor

    private val _scripts = mutableStateOf<String?>(null)
    val scripts: State<String?> = _scripts

    init {
        loadScripts(
            resources,
            settings
        )

        // Observe settings changes from DataStore disk read and user toggles
        viewModelScope.launch {
            combine(
                settings.removeAds,
                settings.enableDownloadContent,
                settings.enableCopyToClipboard,
                settings.stickyNavbar,
                settings.pinchToZoom,
                settings.amoledBlack,
                settings.hideSuggested,
                settings.hideReels,
                settings.hideStories,
                settings.hidePeopleYouMayKnow,
                settings.hideGroups
            ) { _ ->
                loadScripts(resources, settings)
            }.collect()
        }
    }

    fun setThemeColor(color: Color) {
        _themeColor.value = color
    }

    private fun loadScripts(
        resources: Resources,
        settings: SettingsViewModel
    ) {
        val scripts = listOf(
            Script(true, R.raw.scripts, "scripts.js"), // always apply
            Script(settings.removeAds.value, R.raw.adblock, "adblock.js"),
            Script(settings.enableDownloadContent.value, R.raw.download_content, "download_content.js"),
            Script(settings.enableCopyToClipboard.value, R.raw.copy_to_clipboard, "copy_to_clipboard.js"),
            Script(settings.stickyNavbar.value, R.raw.sticky_navbar, "sticky_navbar.js"),
            Script(!settings.pinchToZoom.value, R.raw.pinch_to_zoom, "pinch_to_zoom.js"),
            Script(settings.amoledBlack.value, R.raw.amoled_black, "amoled_black.js"),
            Script(settings.hideSuggested.value, R.raw.hide_suggested, "hide_suggested.js"),
            Script(settings.hideReels.value, R.raw.hide_reels, "hide_reels.js"),
            Script(settings.hideStories.value, R.raw.hide_stories, "hide_stories.js"),
            Script(settings.hidePeopleYouMayKnow.value, R.raw.hide_pymk, "hide_pymk.js"),
            Script(settings.hideGroups.value, R.raw.hide_groups, "hide_groups.js")
        )

        val fallbackContent: (Int) -> String = { resId ->
            resources.openRawResource(resId).bufferedReader().use { it.readText() }
        }

        // 1. Immediately provide local scripts for instant startup (0ms delay)
        _scripts.value = loadLocalScripts(scripts, fallbackContent)

        // 2. Background silent check for remote updates without blocking UI
        viewModelScope.launch(Dispatchers.IO) {
            val remoteScripts = fetchScripts(scripts, fallbackContent)
            if (remoteScripts.isNotEmpty() && remoteScripts != _scripts.value) {
                _scripts.value = remoteScripts
            }
        }
    }

    fun refresh(
        resources: Resources,
        settings: SettingsViewModel
    ) {
        clearScripts()
        loadScripts(resources, settings)
    }

    private fun clearScripts() {
        _scripts.value = null
    }
}
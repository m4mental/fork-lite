package com.m4mental.forklite

import android.os.Bundle
import android.webkit.CookieManager
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.core.view.WindowCompat
import com.m4mental.forklite.ui.screens.NobookWebView
import com.m4mental.forklite.ui.theme.NobookTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        WindowCompat.setDecorFitsSystemWindows(window, false)
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)

        // Pre-warm Chromium engine asynchronously so it loads concurrently with Compose UI
        Thread {
            try {
                CookieManager.getInstance()
            } catch (_: Exception) {}
        }.start()

        setContent {
            val intentUrl = intent?.data?.toString()
            NobookTheme {
                NobookWebView(
                    url = intentUrl
                        ?: "https://facebook.com/"
                )
            }
        }
    }
}
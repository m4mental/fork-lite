package com.m4mental.forklite.utils.jsBridge

import android.webkit.JavascriptInterface

class NobookSettings (
    private val toggleSettings: () -> Unit,
) {
    @JavascriptInterface
    fun onSettingsToggle() = toggleSettings()
}
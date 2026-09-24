package com.m4mental.forklite.utils.jsBridge

import android.webkit.JavascriptInterface
import androidx.core.graphics.toColorInt

class ThemeChange(
    private val setThemeColor: (Int) -> Unit
) {
    @JavascriptInterface
    fun onThemeColorChanged(newColor: String?) {
        if (newColor.isNullOrBlank()) return
        runCatching { setThemeColor(newColor.toColorInt()) }
    }
}
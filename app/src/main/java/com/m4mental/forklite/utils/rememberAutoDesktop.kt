package com.m4mental.forklite.utils

import androidx.compose.runtime.Composable

@Composable
fun rememberAutoDesktop(): Boolean {
    // Keep app strictly in mobile layout (never auto-switch to desktop mode on rotate)
    return false
}
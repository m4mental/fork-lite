package com.m4mental.forklite.utils

import androidx.annotation.RawRes
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.engine.okhttp.OkHttp
import io.ktor.client.request.get
import io.ktor.http.HttpStatusCode


import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.coroutineScope

const val SCRIPT_SRC = "https://raw.githubusercontent.com/m4mental/fork-lite/refs/heads/main/app/src/main/res/raw/"

private val sharedHttpClient by lazy { HttpClient(OkHttp) }

data class Script(
    val isEnabled: Boolean,
    @param:RawRes val resourceId:  Int,
    val scriptTitle: String
)

fun loadLocalScripts(
    scripts: List<Script>,
    fallbackContent: (Int) -> String
): String {
    return buildString {
        scripts.filter { it.isEnabled }.forEach { script ->
            append(fallbackContent(script.resourceId))
        }
    }
}

suspend fun fetchScripts(
    scripts: List<Script>,
    fallbackContent: (Int) -> String
): String {
    val enabledScripts = scripts.filter { it.isEnabled }
    if (enabledScripts.isEmpty()) return ""

    return coroutineScope {
        enabledScripts.map { script ->
            async {
                runCatching {
                    val res = sharedHttpClient.get(SCRIPT_SRC + script.scriptTitle)
                    if (res.status == HttpStatusCode.OK) {
                        res.body() as String
                    } else {
                        fallbackContent(script.resourceId)
                    }
                }.getOrElse {
                    fallbackContent(script.resourceId)
                }
            }
        }.awaitAll().joinToString(separator = "")
    }
}

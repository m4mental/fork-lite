# Fork Lite

<div align="center">

**Fork Lite** is a high-performance, lightweight, and privacy-focused Android client for Facebook built with Jetpack Compose, hardware-accelerated Chromium WebView, and a native optimization engine.

[![Platform](https://img.shields.io/badge/Platform-Android-green.svg)](https://developer.android.com)
[![Target SDK](https://img.shields.io/badge/Target%20SDK-36-blue.svg)](https://developer.android.com/about/versions/16)
[![License](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)
[![Branch](https://img.shields.io/badge/Branch-main-success.svg)](https://github.com/m4mental/fork-lite)

</div>

---

## 🌟 Key Features

### ⚡ Video Turbo Engine
- **Predictive Buffer-Ahead**: Automatically preloads the next 5 reels and upcoming videos directly into memory and disk cache.
- **Zero-Buffering Transitions**: Swiping between reels triggers instantaneous playback with no loading spinners or playback delays.
- **Gesture Stall Prevention**: Overrides artificial web gestures to ensure media playback begins seamlessly.

### 📱 100% Native App Look & Feel
- **Zero Web Browser Artifacts**: Completely eliminates browser tap-highlight boxes (`-webkit-tap-highlight-color: transparent`).
- **Hidden Scrollbars**: Native presentation without visible horizontal or vertical web scrollbars.
- **Smooth Momentum Touch**: Fluid inertial touch scrolling (`-webkit-overflow-scrolling: touch`) and locked portrait orientation.
- **No Accidental Text Selection**: Text and UI cards resist accidental web selection popups while keeping input fields fully functional.
- **Sub-Second Fast Launch**: Early splash dismissal kicks in within 1 second, removing the 5-6s cold-start delay.

### 🖤 Persistent AMOLED Pure Black Theme
- **True Pitch Black (#000000)**: Enforces pure black on all pagelets, cards, backgrounds, headers, and comments for maximum OLED battery savings.
- **Persistent Lock**: Prevents color regression or reverting to dark grey on client-side SPA route changes and page navigations.
- **System Bar Synchronization**: System status bar and navigation bar seamlessly match the pure black canvas.

### 🛡️ Privacy & Content Filtering
- **Ad Blocker**: Automatically removes sponsored posts, carousel ads, and sponsored reels from feeds.
- **Customizable Feed Filters**: Toggle visibility of suggested posts, reels, stories, groups, and people you may know.
- **Data Saver Engine**: Unlocks video data saver controls and spoofs network hints to permit low-bandwidth mode even on Wi-Fi.

### 📥 Native Utilities
- **One-Tap Media Downloader**: Download photos, videos, and media files directly to device storage.
- **Copy to Clipboard**: Quick extraction of image and text content directly to Android clipboard.
- **Desktop Mode Switcher**: Optional user-agent switcher for power users who need full desktop web capabilities.

---

## 🛠️ Architecture & Tech Stack

```
com.m4mental.forklite
├── ui
│   ├── screens
│   │   ├── NobookWV.kt        # Compose WebView wrapper, hardware acceleration & system bars
│   │   └── SplashLoading.kt   # Ultra-fast animated startup splash
│   ├── components
│   │   └── settings           # Material 3 settings dialogs and feed filters
│   ├── viewmodel
│   │   ├── MainViewModel.kt   # Script management, instant local cache, background sync
│   │   └── SettingsViewModel.kt # DataStore preferences flow
│   └── theme                  # Material 3 themes & color tokens
├── utils
│   ├── jsBridge               # JavascriptInterface bridges (Theme, Settings, Clipboard, Download)
│   └── fetchScripts.kt        # Local raw script resolver & remote update fetcher
└── res/raw
    ├── scripts.js             # Native app styling, Video Turbo Engine, Data Saver unlock
    ├── amoled_black.js        # Pure #000000 AMOLED CSS engine & SPA observer
    └── adblock.js             # High-speed sponsored content & reel ad remover
```

| Layer | Technology |
|---|---|
| **UI Framework** | Jetpack Compose + Material 3 |
| **Language** | Kotlin 2.3+ |
| **WebView Core** | Compose WebView Multiplatform (`multiplatform-webview`) |
| **Local Storage** | Jetpack DataStore Preferences (Non-blocking eager state flows) |
| **Networking** | Ktor Client (OkHttp engine) |
| **Build Tooling** | Gradle 9.4.1 / Android Gradle Plugin 9.1.0 |
| **SDK Levels** | Min SDK 23 (Android 6.0) • Target SDK 36 (Android 16) |

---

## 🚀 Building & Installing

### Prerequisites
- JDK 17 or JDK 21 (e.g. Android Studio JBR: `C:\Program Files\Android\Android Studio\jbr`)
- Android SDK Platform 36 & Build-Tools 36.0.0
- Git

### Build Debug APK
```bash
# Set JAVA_HOME (Windows PowerShell)
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"

# Build debug APK
./gradlew.bat assembleDebug

# Output: app/build/outputs/apk/debug/app-debug.apk
```

### Install on Device via ADB
```bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

---

## 📄 License & Acknowledgements

- **License**: Licensed under the [GNU General Public License v3.0](LICENSE).
- **Upstream Foundation**: Forked and modernized from [Nobook](https://github.com/ycngmn/Nobook) by `@ycngmn`.
- **Special Thanks**: [@KevinnZou/compose-webview-multiplatform](https://github.com/KevinnZou/compose-webview-multiplatform).
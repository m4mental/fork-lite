# Fork Lite

<div align="center">

**Fork Lite** is a lightweight, privacy-focused, and highly customizable Android browser client for Facebook built with Jetpack Compose.

</div>

---

## 🌟 Key Features

- 🚫 **Blocks Sponsored Ads**: Clean feed browsing experience without disruptive advertisements.
- 🎯 **Blocks Suggested Posts & Reels**: Filter out suggestions, stories, groups, and unwanted feed clutter.
- 📥 **Media Downloader**: Download photos, videos, and media directly to your device.
- 📋 **Copy to Clipboard**: Quick copying of media and content.
- 🌓 **AMOLED Pure Black Mode**: True black dark theme designed for battery saving on OLED screens.
- 🖥️ **Desktop Mode Support**: Force desktop layout with seamless user-agent switching.
- ⚡ **Lightweight & High Performance**: Minimal battery and memory footprint.

---

## 🛠️ Architecture & Tech Stack

- **UI Framework**: Android Jetpack Compose + Material 3
- **Language**: Kotlin 2.3+
- **WebView Core**: Compose WebView Multiplatform
- **Networking**: Ktor Client (OkHttp engine)
- **Local Storage**: Jetpack DataStore Preferences
- **Build System**: Gradle 9.4+ / Android Gradle Plugin 9.1+ (Target SDK 36, Min SDK 23)

---

## 🚀 Building From Source

### Prerequisites
- Android Studio Ladybug / Meerkat (or newer)
- JDK 17+ or 21+ (Compatible with Android Studio JBR)
- Android SDK Platform 36

### Build Steps
```bash
# Clone the repository
git clone https://github.com/m4mental/fork-lite.git
cd fork-lite

# Build debug APK
./gradlew assembleDebug

# Output APK location:
# app/build/outputs/apk/debug/app-debug.test.apk
```

---

## 📄 License & Acknowledgements

- **License**: Licensed under the [GNU General Public License v3.0](LICENSE).
- **Upstream Base**: Originally based on [Nobook](https://github.com/ycngmn/Nobook) by `@ycngmn`.
- **Special Thanks**: [@KevinnZou/compose-webview-multiplatform](https://github.com/KevinnZou/compose-webview-multiplatform).
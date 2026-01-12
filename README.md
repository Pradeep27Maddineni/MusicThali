# MusicThali 🎵

MusicThali is a feature-rich music streaming application built with **React Native** and **Expo**. It leverages the JioSaavn API to provide a vast library of songs, trending charts, and artist details, offering a seamless and immersive listening experience.

## ✨ Features

-   **Home Feed**: Discover trending songs, top charts, and new releases.
-   **Music Player**: Full-featured player with play/pause, skip, seeking, and background playback support.
-   **Search**: Powerful search functionality to find songs, albums, and artists.
-   **My Library**: Manage your favorite songs and playlists.
-   **Offline Support**: Download songs for offline listening (powered by `expo-file-system`).
-   **Modern UI**: Sleek and responsive design using `react-native-svg` and custom components.
-   **State Management**: Efficient state handling with **Zustand**.

## 📸 Screenshots

View the app output and screenshots here: [Project Screenshots](https://drive.google.com/drive/folders/1s2Fw7_4ywvC1tA3v6l2Y14H9jMJuxlNe?usp=sharing)

## 📱 Download App (APK)

You can download the latest Android APK from the link below:

👉 **[Download MusicThali APK](https://expo.dev/accounts/pradeepmaddineni27/projects/MusicThali/builds/f44433ce-7974-482e-b8c5-7668fd0af0fa)**

*Click the link to download directly or view the QR code to scan with your device.*
<img width="308" height="305" alt="Screenshot 2026-01-12 at 7 14 35 PM" src="https://github.com/user-attachments/assets/f86078da-2be9-4db0-b5aa-c164c604206f" />


## 🛠 Tech Stack

-   **Framework**: [React Native](https://reactnative.dev/) (via [Expo](https://expo.dev/))
-   **Language**: TypeScript
-   **Navigation**: [React Navigation](https://reactnavigation.org/) (v7)
-   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
-   **Audio**: [expo-audio](https://docs.expo.dev/versions/latest/sdk/audio/)
-   **Storage**: [react-native-mmkv](https://github.com/morousg/react-native-mmkv) (High-performance storage)
-   **Networking**: [Axios](https://axios-http.com/)
-   **Icons**: [Lucide React Native](https://lucide.dev/guide/packages/lucide-react-native)

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

-   [Node.js](https://nodejs.org/) (LTS recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   [Xcode](https://developer.apple.com/xcode/) (for iOS simulator) - *Mac only*
-   [Android Studio](https://developer.android.com/studio) (for Android emulator)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Pradeep27Maddineni/MusicThali.git
    cd MusicThali
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Install iOS Pods** (Mac only):
    ```bash
    npx expo run:ios
    # This automatically handles pod installation.
    # Alternatively: cd ios && pod install && cd ..
    ```

### Running the App

Start the development server:

```bash
npx expo start
```

-   **Run on iOS Simulator**: Press `i` in the terminal.
-   **Run on Android Emulator**: Press `a` in the terminal.
-   **Run on Physical Device**: Scan the QR code with the Expo Go app (Android) or Camera app (iOS).

*Note: If you encounter network issues, try running with tunnel mode:*
```bash
npx expo start --tunnel
```

## 📂 Project Structure

```
MusicThali/
├── App.tsx             # Application entry point
├── app.json            # Expo configuration
├── package.json        # Dependencies and scripts
├── src/
│   ├── api/            # API service calls (JioSaavn)
│   ├── components/     # Reusable UI components
│   ├── constants/      # App constants, theme, colors
│   ├── hooks/          # Custom React hooks
│   ├── navigation/     # Navigation stacks and tab configuration
│   ├── screens/        # Main application screens (Home, Player, etc.)
│   ├── store/          # Zustand stores for global state
│   ├── types/          # TypeScript interface definitions
│   └── utils/          # Helper functions and storage utilities
└── ios/                # Native iOS project files
```

## 🐞 Common Issues & Troubleshooting

-   **"Could not connect to the server"**:
    -   Ensure your computer and device are on the same Wi-Fi.
    -   Try running `npx expo start --tunnel`.

-   **Build Failures**:
    -   Try cleaning the build folder: `cd ios && rm -rf build && pod install && cd ..`
    -   Restart the development server with `npx expo start -c` (clear cache).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

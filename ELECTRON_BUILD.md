# Building the Electron Desktop App

This guide explains how to build and distribute the OpenGraph Viewer desktop application.

## Quick Start

### Running in Development Mode

```bash
npm run electron
```

This will launch the app with hot-reload enabled for development.

### Building for Distribution

```bash
# Build for your current platform
npm run electron:build

# Build for specific platforms
npm run electron:build:mac    # macOS (.dmg, .zip)
npm run electron:build:win    # Windows (.exe, portable)
npm run electron:build:linux  # Linux (.AppImage, .deb)
```

## Application Icons

Before building for distribution, you should create proper application icons:

1. Create a 1024x1024 PNG image for your app icon
2. Convert to platform-specific formats:
   - **macOS**: `build/icon.icns` (use online converter or `iconutil`)
   - **Windows**: `build/icon.ico` (256x256 with multiple sizes)
   - **Linux**: `build/icon.png` (512x512)

See `build/ICON_README.md` for detailed instructions.

## Build Output

Built applications will be placed in the `dist/` directory:

- **macOS**: `dist/OpenGraph Viewer-1.0.0.dmg` and `.zip`
- **Windows**: `dist/OpenGraph Viewer Setup 1.0.0.exe` and portable version
- **Linux**: `dist/OpenGraph Viewer-1.0.0.AppImage` and `.deb`

## Code Signing (macOS)

For macOS distribution, you'll need to sign the app with an Apple Developer certificate:

1. Join the [Apple Developer Program](https://developer.apple.com/programs/)
2. Create a Developer ID Application certificate
3. Set environment variables:
   ```bash
   export CSC_LINK=/path/to/certificate.p12
   export CSC_KEY_PASSWORD=your_certificate_password
   ```
4. Build: `npm run electron:build:mac`

## Auto-Updates (Optional)

To enable auto-updates:

1. Install `electron-updater`: `npm install electron-updater`
2. Configure update server in `package.json` under `build.publish`
3. Implement update checking in `main.js`

## Distribution

### GitHub Releases

1. Create a new release on GitHub
2. Upload the built files from `dist/`
3. Users can download and install

### App Stores

- **macOS App Store**: Requires additional configuration and Apple Developer account
- **Microsoft Store**: Requires Windows Developer account
- **Snap Store (Linux)**: Configure snap target in electron-builder

## Troubleshooting

### Build Fails on macOS

- Ensure Xcode Command Line Tools are installed: `xcode-select --install`
- Check that you have sufficient disk space

### Build Fails on Windows

- Install Windows Build Tools: `npm install --global windows-build-tools`
- Run PowerShell as Administrator

### Build Fails on Linux

- Install required dependencies:
  ```bash
  sudo apt-get install -y rpm
  ```

## File Structure

```
OpenGraphViewer/
├── main.js              # Electron main process
├── server.js            # Express server (refactored for Electron)
├── public/              # Web UI files
├── build/               # Build resources (icons)
├── dist/                # Build output (gitignored)
└── package.json         # App configuration and build settings
```

## Platform-Specific Notes

### macOS
- App uses `hiddenInset` titlebar style for native look
- Dark mode is automatically supported
- Menu bar includes standard macOS menus

### Windows
- NSIS installer allows custom installation directory
- Portable version requires no installation

### Linux
- AppImage is self-contained and runs on most distributions
- .deb package for Debian/Ubuntu-based systems

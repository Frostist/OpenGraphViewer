# Application Icons

To build the Electron app with proper icons, you need to create the following icon files:

## Required Icon Files

### macOS (icon.icns)
- Create a 1024x1024 PNG image
- Use an online converter or `iconutil` to convert to .icns format
- Place at: `build/icon.icns`

### Windows (icon.ico)
- Create a 256x256 PNG image
- Use an online converter to create .ico with multiple sizes (256, 128, 64, 32, 16)
- Place at: `build/icon.ico`

### Linux (icon.png)
- Create a 512x512 PNG image
- Place at: `build/icon.png`

## Quick Icon Creation

You can use online tools like:
- https://cloudconvert.com/png-to-icns (for macOS)
- https://cloudconvert.com/png-to-ico (for Windows)
- Or use the `electron-icon-builder` npm package

## Temporary Solution

For now, the app will build without icons. The electron-builder will use default Electron icons.
To add proper branding, create the icon files mentioned above before running the build commands.

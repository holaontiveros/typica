#!/bin/bash

# Create DMG installer for Typica
# This makes it easier to distribute the app with instructions

APP_NAME="typica"
APP_PATH="src-tauri/target/release/bundle/macos/typica.app"
DMG_NAME="Typica-Installer"
TEMP_DMG="temp.dmg"
FINAL_DMG="${DMG_NAME}.dmg"

echo "📦 Creating DMG installer for Typica..."

# Check if app exists
if [ ! -d "$APP_PATH" ]; then
    echo "❌ App not found at $APP_PATH"
    echo "   Please run 'npm run build:signed' first"
    exit 1
fi

# Create temporary directory
TEMP_DIR=$(mktemp -d)
echo "📁 Using temporary directory: $TEMP_DIR"

# Copy app to temp directory
cp -R "$APP_PATH" "$TEMP_DIR/"

# Create instructions file
cat > "$TEMP_DIR/README.txt" << EOF
Typica Font Explorer

Installation Instructions:
1. Drag the typica.app to your Applications folder
2. Right-click the app and select "Open"
3. Click "Open" when macOS asks for confirmation

This is required because the app is not code-signed with an Apple Developer certificate.

For more information, visit: https://github.com/your-repo/typica
EOF

# Create DMG
echo "💿 Creating DMG..."
hdiutil create -volname "$DMG_NAME" -srcfolder "$TEMP_DIR" -ov -format UDBZ "$FINAL_DMG"

# Clean up
rm -rf "$TEMP_DIR"

echo "✅ DMG created: $FINAL_DMG"
echo "📤 You can now distribute this DMG file"
echo "   It includes the app and installation instructions"
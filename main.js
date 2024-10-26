// main.js

const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev'); // Ensure this line is present
const fs = require('fs');

// Create the main window
let mainWindow; // Declare the mainWindow variable globally

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 500,
        height: 400,
        webPreferences: {
            contextIsolation: true, // Recommended for security
            enableRemoteModule: false,
            preload: path.join(__dirname, 'preload.js'), // Create a preload script for additional security if needed
            webSecurity: true, // Ensure web security is enabled
            allowRunningInsecureContent: false // Disallow insecure content
        },
    });

    // Load the ChatGPT website
    mainWindow.loadURL('https://chatgpt.com/');

    // Open the DevTools only if in development mode
    if (isDev) {
        // Optionally, you can comment this out if you want to avoid opening DevTools at all
        // mainWindow.webContents.openDevTools(); 
    }

    // Register the Ctrl+L shortcut
    globalShortcut.register('Control+L', () => {
        if (mainWindow.isVisible()) {
            mainWindow.hide();
        } else {
            mainWindow.show();
        }
    });

    // Handle window close event
    mainWindow.on('closed', () => {
        globalShortcut.unregisterAll(); // Unregister all shortcuts on close
        mainWindow = null; // Set mainWindow to null to avoid memory leaks
    });
}

// Create a desktop shortcut for the app
function createDesktopShortcut() {
    const shortcutPath = path.join(app.getPath('desktop'), 'ChatGPT App.desktop');
    const shortcut = `
[Desktop Entry]
Version=1.0
Type=Application
Name=ChatGPT
Exec=${app.getPath('exe')} --start-in-tray
Icon=${path.join(__dirname, 'icon.png')}
Terminal=false
`;
    fs.writeFileSync(shortcutPath, shortcut);
}

// Auto-start functionality
function setAutoLaunch() {
    const autoLaunch = require('auto-launch');
    const appAutoLauncher = new autoLaunch({ name: 'ChatGPT App' });

    appAutoLauncher.isEnabled().then((isEnabled) => {
        if (!isEnabled) appAutoLauncher.enable();
    });
}

app.whenReady().then(() => {
    createWindow();
    createDesktopShortcut();
    setAutoLaunch();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Remove redundant call to createWindow() on ready
// app.on('ready', createWindow); // This line is not needed as createWindow() is called in the whenReady() promise

// src/main.js

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window with custom properties.
  const mainWindow = new BrowserWindow({
    width: 280,
    height: 350,
    frame: false,
    transparent: true,
    alwaysOnTop: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), 
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, 'icon.ico')
  });

  
  mainWindow.setMenu(null);

  
  if (!app.isPackaged) { 
    mainWindow.loadURL('http://localhost:3000'); 
    // Buka DevTools hanya di mode development
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    // Muat file hasil build dari React untuk mode produksi
    mainWindow.loadFile(path.join(__dirname, '..', 'build', 'index.html'));
  }

};

// --- Listener untuk Tombol Custom dari React ---
ipcMain.on('minimize-app', () => {
  BrowserWindow.getFocusedWindow().minimize();
});

ipcMain.on('close-app', () => {
  BrowserWindow.getFocusedWindow().close();
});


app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


// preload.js - Securely exposes IPC to the Renderer process

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('minimize-app'),
  close: () => ipcRenderer.send('close-app'),
});
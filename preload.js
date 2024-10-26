// preload.js
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    // Expose any methods you need from the main process here
});

const { app, BrowserWindow, dialog, autoUpdater} = require('electron');
// const {autoUpdater} = require('electron-updater');
const path = require('node:path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  const server = 'https://update.electronjs.org';
  const feed = `${server}/codeitmywaywithHarsh07/Auto-Update-5/${process.platform}-${process.arch}/${app.getVersion()}`;

  autoUpdater.setFeedURL({
    url:feed
  });

  setInterval(() => {
    autoUpdater.checkForUpdates();
  }, 10 * 60 * 1000); // Check every 10 minutes

  autoUpdater.on('update-available', () => {
    const response = dialog.showMessageBoxSync(mainWindow, {
      type: 'info',
      buttons: ['Download', 'Later'],
      title: 'Update Available',
      message: 'A new update is available. Do you want to download it now?',
    });

    if (response === 0) {
      autoUpdater.downloadUpdate();
    }
  });

  autoUpdater.on('update-downloaded', () => {
    const response = dialog.showMessageBoxSync(mainWindow, {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Update Ready',
      message: 'Update downloaded. Restart the app to apply the update.',
    });

    if (response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});


// On OS X it's common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

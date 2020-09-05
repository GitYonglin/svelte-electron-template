/*
 * @Author: your name
 * @Date: 2020-08-08 08:11:05
 * @LastEditTime: 2020-08-31 12:23:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \sd-client\src\electron.js
 */
/*
 * @Author: your name
 * @Date: 2020-08-08 08:11:05
 * @LastEditTime: 2020-08-19 20:48:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \sd-client\src\electron.js
 */
import { app, BrowserWindow, ipcMain, Menu } from "electron";
const path = require('path')

/** 热加载 */
let watcher;
if (process.env.NODE_ENV === 'development') {
    watcher = require('chokidar').watch(path.join(__dirname, '../public/build'), { ignoreInitial: true });
    watcher.on('change', () => {
        mainWindow.reload();
    });
}
/** 热加载 */

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    const mode = process.env.NODE_ENV;
    /*隐藏electron创听的菜单栏*/
    Menu.setApplicationMenu(null);
    mainWindow = new BrowserWindow({
        // show: false,
        width: 1024,
        height: 768,
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            backgroundThrottling: false
        }
    });
    console.log(__dirname); //H:\LQ\DS\sd-client\public\electron
    mainWindow.loadURL(`file://${path.join(__dirname, '../index.html')}`);
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    console.log('51', mode);
    if (mode == 'development') {
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.webContents.on('devtools-opened', () => {
            mainWindow.webContents.closeDevTools();
        });
    }
}

// app.allowRendererProcessReuse = true;
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
    if (watcher) {
        watcher.close();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
        // mainWindow.once('ready-to-show', () => {
        //     mainWindow.show();
        //     // tslint:disable-next-line:max-line-length
        // });
    }
});

// app.on('closed', function () {
//     if (watcher) {
//         watcher.close();
//     }
// })

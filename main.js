const { app, BrowserWindow, ipcMain } = require("electron");
const Store = require("electron-store");
const store = new Store();

function createWindow () {
    let screenSettings = { w: 1024, h: 896, fullscreen: false, zoom: 1 };
    const lastScreenSettings = store.get("screenSettings", null);
    if(lastScreenSettings !== null) {
        screenSettings = lastScreenSettings;
    }

    const mainWindow = new BrowserWindow({
        width: screenSettings.width,
        height: screenSettings.height,
        setFullScreen: screenSettings.fullscreen,
        zoomFactor: screenSettings.zoom,
        icon: "ff.png", // TODO: won't work on macs
        autoHideMenuBar: true,
        useContentSize: true,
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: false
        }
    });
    mainWindow.loadFile("indexapp.html");
    //mainWindow.webContents.openDevTools();

    ipcMain.on("resize-window", (e, args) => {
        mainWindow.setFullScreen(args.fullscreen);
        mainWindow.setContentSize(args.width, args.height);
        mainWindow.webContents.zoomFactor = args.zoom;
        store.set("screenSettings", args);
    });
    ipcMain.on("quit-game", () => { app.quit(); });
}

app.whenReady().then(() => {
    createWindow();
    app.on("activate", function () {
        if(BrowserWindow.getAllWindows().length === 0) { createWindow(); }
    });
});

app.on("window-all-closed", function () {
    if(process.platform !== "darwin") { app.quit(); }
});
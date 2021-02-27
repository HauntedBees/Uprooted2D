const fs = require("fs");
const path = require("path");
async function CopyFiles() {
    
    const files = ["../out.js", "../js/lib/pixi.js", "../js/lib/virtpad.js", 
        "../styles/PressStart2P.ttf", "../styles/JuraBold-rmpL.ttf", "../styles/nevis.ttf", "../styles/OpenDyslexic3-Regular.ttf"];
    for(let i = 0; i < files.length; i++) {
        const f = files[i];
        await fs.promises.copyFile(path.join(__dirname, f), path.join(__dirname, f.replace("../", "../cordova/www/")));
    }

    //await fs.promises.copyFile(path.join(__dirname, "../indexcordova.html"), path.join(__dirname, "../cordova/www/index.html"));
    fs.readFile(path.join(__dirname, "../indexcordova.html"), "utf-8", (err, data) => {
        if(err) { throw err; }
        const newval = data.replace("DOMContentLoaded", "deviceready");
        fs.writeFile(path.join(__dirname, "../cordova/www/index.html"), newval, "utf-8", () => {});
    });
}

CopyFiles();
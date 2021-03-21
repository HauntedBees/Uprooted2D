const ClampPalette = require("clamp-palette").default;
const path = require("path");
const fs = require("fs");

const inPath = path.join(__dirname, "../img"), outPath = path.join(__dirname, "../imggb");

const MonochromeImage = (foldername, filename, inFilePath, outFolderPath) => {
    const outFile = path.join(outFolderPath, filename);
    ClampPalette({
        imagePath: inFilePath,
        colors: ["#081820", "#346856", "#88C070", "#E0F8D0"],
        errorcallback: err => console.log(err),
        callback: buffer => { fs.writeFileSync(outFile, buffer); console.log(`Finished ${foldername}/${filename}`); }
    })
};

const MonochromeFolder = foldername => {
    const inFolderPath = path.join(inPath, foldername);
    const outFolderPath = path.join(outPath, foldername);
    if(!fs.existsSync(outFolderPath)) { fs.mkdirSync(outFolderPath); }
    const files = fs.readdirSync(inFolderPath);
    files.forEach(filename => {
        const inFilePath = path.join(inFolderPath, filename);
        if(fs.lstatSync(inFilePath).isDirectory()) {
            MonochromeFolder(filename);
        } else {
            MonochromeImage(foldername, filename, inFilePath, outFolderPath);
        }
    });
};

const args = process.argv.slice(2);
if(!args.length) {
    MonochromeFolder("");
} else {
    args.forEach(folderFilePath => {
        const splitpath = folderFilePath.split("/");
        const foldername = splitpath.length === 1 ? "" : splitpath[0];
        const filename = splitpath.length === 1 ? splitpath[0] : splitpath[1];
        MonochromeImage(foldername, filename, path.join(inPath, folderFilePath), path.join(outPath, foldername));
    });
}
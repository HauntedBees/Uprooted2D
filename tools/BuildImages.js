const StreamZip = require("node-stream-zip");
const parseString = require("xml2js").parseString;
const sharp = require("sharp");
const imagemin = require("imagemin");
const imageminPngquant = require("imagemin-pngquant");
const path = require("path");
const fs = require("fs");

const imgPath = path.join(__dirname, "ora");
const args = process.argv.slice(2);
const HasArg = s => args.indexOf(s) >= 0;

const GetBackgrounds = async function() {
    console.log("Extracting backgrounds");
    const zip = new StreamZip.async({file: `${imgPath}/combatbg.ora`});
    const xmlStr = await zip.entryData("stack.xml");
    const rawpath = path.join(__dirname, "temp/combatbg"), finalpath = path.join(__dirname, "../img/bgs");
    if(!fs.existsSync(rawpath)) { fs.mkdirSync(rawpath); }
    parseString(xmlStr, async function(err, xmlObj) {
        const layers = xmlObj.image.stack[0].layer;
        
        const images = [];
        const promises = layers.map(e => {
            const name = e.$.name, src = e.$.src;
            if(name[0] === "_") { return true; }
            console.log(`Extracting ${name}`);
            const filename = `${name}.png`;
            images.push(filename);
            return zip.extract(src, `${rawpath}/${filename}`);
        });
        await Promise.all(promises);
        console.log("All Backgrounds extracted");
        images.forEach(async filename => {
            const img = sharp(`${rawpath}/${filename}`);
            const imgPath = `${finalpath}/${filename}`;
            return img.metadata().then(metadata => {
                img.resize({ width: metadata.width * 4, kernel: sharp.kernel.nearest }).toFile(imgPath, () => {
                    imagemin([imgPath], {
                        destination: finalpath,
                        plugins: [imageminPngquant()]
                    })
                });
            });
        });
        console.log("All Backgrounds resized");
        await zip.close();
    });
}
const RipImage = async function(img) {
    const filename = `${img}.png`;
    console.log("Extracting Image " + filename);
    const zip = new StreamZip.async({file: `${imgPath}/${img}.ora`});
    const xmlStr = await zip.entryData("stack.xml");
    const rawpath = path.join(__dirname, "temp"), finalpath = path.join(__dirname, "../img/");
    parseString(xmlStr, async function(err, xmlObj) {
        const contentLayer = xmlObj.image.stack[0].layer.findIndex(f => f.$.name === "Content");
        const layerPath = xmlObj.image.stack[0].layer[contentLayer].$.src;
        await zip.extract(layerPath, `${rawpath}/${filename}`);
        console.log(filename + " extracted");
        const img = sharp(`${rawpath}/${filename}`);
        const imgPath = `${finalpath}/${filename}`;
        img.metadata().then(metadata => {
            img.resize({ width: metadata.width * 4, kernel: sharp.kernel.nearest }).toFile(imgPath, () => {
                imagemin([imgPath], {
                    destination: finalpath,
                    plugins: [imageminPngquant()]
                })
            });
        });
        console.log(filename + " resized");
        await zip.close();
    });
}
const RipProfiles = async function() {
    console.log("Extracting profiles");
    const zip = new StreamZip.async({file: `${imgPath}/portraits.ora`});
    const xmlStr = await zip.entryData("stack.xml");
    const rawpath = path.join(__dirname, "temp/profiles"), finalpath = path.join(__dirname, "../img/profiles");
    if(!fs.existsSync(rawpath)) { fs.mkdirSync(rawpath); }
    parseString(xmlStr, async function(err, xmlObj) {
        const layers = xmlObj.image.stack[0].layer;
        
        const images = [];
        const promises = layers.map(e => {
            const name = e.$.name, src = e.$.src;
            
            if(name[0] === "_") { return true; }
            console.log(`Extracting ${name}`);
            const filename = `${name}.png`;
            images.push({
                filename: filename,
                left: parseInt(e.$.x),
                top: parseInt(e.$.y)
            });
            return zip.extract(src, `${rawpath}/${filename}`);
        });
        await Promise.all(promises);
        console.log("All Portraits extracted");
        const resStr = [];
        images.forEach(async obj => {
            const img = sharp(`${rawpath}/${obj.filename}`);
            const imgPath = `${finalpath}/${obj.filename}`;
            resStr.push(`profiles/${obj.filename.split(".")[0]}`);
            return img.metadata().then(metadata => {
                img.extend({ top: obj.top * 4, left: obj.left * 4, right: 0, bottom: 0, background:"#00000000" })
                    .resize({ width: metadata.width * 4, kernel: sharp.kernel.nearest }).toFile(imgPath, () => {
                    imagemin([imgPath], {
                        destination: finalpath,
                        plugins: [imageminPngquant()]
                    })
                });
            });
        });
        console.log("All Portraits resized");
        console.log(`"${resStr.join('", "')}",`);
        await zip.close();
    });
}

const noArgs = args.length === 0;
const filters = args.length === 1 && args[0] === "filters";
if(noArgs || HasArg("bg")) {
    GetBackgrounds();
}
if(noArgs || HasArg("sheet")) {
    RipImage("sheet");
}
if(noArgs || HasArg("mapChar")) {
    RipImage("mapChar");
}
if(noArgs || HasArg("challenge")) {
    RipImage("challengeBG");
}
if(noArgs || HasArg("onion")) {
    RipImage("calsotte");
}
if(noArgs || HasArg("cs")) {
    RipImage("combatSheet");
}
if(noArgs || HasArg("profile")) {
    RipProfiles();
}

if(filters || HasArg("hqx")) {
    console.log("TODO");
}
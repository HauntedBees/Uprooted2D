const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");
const { spawn } = require("child_process");

const tempPath = path.join(__dirname, "/temp");
if(!fs.existsSync(tempPath)) { fs.mkdirSync(tempPath); }
const partPath = path.join(__dirname, "/parts");
if(!fs.existsSync(partPath)) { fs.mkdirSync(partPath); }

function RipFile(filename, outfile, requireKeys) {
    console.log(`Extracting ${filename}`);
    const filepath = path.join(__dirname, "../ods/", filename + ".ods");
    const soffice = spawn("soffice", [
        "--headless", 
        "--convert-to", "csv",
        "--outdir", tempPath,
        filepath
    ]);
    soffice.stderr.on("data", data => { console.log("ERROR: " + data); });
    soffice.on("close", res => { 
        if(res !== 0) { return; }
        const outpath = path.join(partPath, `${outfile}.js`);
        const data = [];
        fs.createReadStream(path.join(tempPath, filename + ".csv"))
        .pipe(csv())
        .on("data", row => data.push(row))
        .on("end", () => {
            if(requireKeys) {
                const lines = data.map(l => (!l.Key || l.Key === "*" ? "" : `"${l.Key}": ${JSON.stringify(l)}`)).filter(l => l);
                console.log(`Processed ${lines.length} records.`);
                fs.writeFileSync(outpath, `module.exports = {
    ${lines.join(",\n\t")}
};`);
            } else {
                if(filename === "Details_Crops") {
                    const idx = data.findIndex(l => l.Name === "Enemy-Only");
                    data.splice(idx, data.length - idx);
                }
                const lines = data.map(l => (!l.Id || l.Id === "*" ? "" : JSON.stringify(l))).filter(l => l);
                console.log(`Processed ${lines.length} records.`);
                fs.writeFileSync(outpath, `module.exports = [
    ${lines.join(",\n\t")}
];`);
            }
        });
    });
}

const args = process.argv.slice(2), types = args[0];
const HasArg = s => types === "_" || types.indexOf(s) >= 0;

if(!types) {
    console.log(`Options:
- _: Everything
- T: Text
- C: Crops
- Q: Equipment
- F: Fixtures
- E: Enemies
- P: Spritesheets
- S: Shops`);
    return;
}

if(HasArg("T")) { RipFile("Details_Text", "text", true); }
if(HasArg("C")) { RipFile("Details_Crops", "veggies"); }
if(HasArg("Q")) { RipFile("Details_Equipment", "equipment"); }
if(HasArg("F")) { RipFile("Details_Fixtures", "fixtures"); }
if(HasArg("E")) { RipFile("Details_Enemies", "enemies"); }
if(HasArg("P")) {
    const RipSpriteFile = (size, arr) => {
        return new Promise((resolve, reject) => {
            console.log(`Extracting ${size} Sprites`);
            const isSmall = size === "Small";
            const filepath = path.join(__dirname, `../ods/Details_${size}Sprites.ods`);
            const soffice = spawn("soffice", [
                "--headless", 
                "--convert-to", "csv",
                "--outdir", tempPath,
                filepath
            ]);
            soffice.stderr.on("data", data => { console.log("ERROR: " + data); reject(); });
            soffice.on("close", res => { 
                console.log(`Processed ${size} Sprites`);
                if(res !== 0) { return; }
                const data = [];
                fs.createReadStream(path.join(tempPath, `Details_${size}Sprites.csv`))
                .pipe(csv({ headers: false }))
                .on("data", row => data.push(row))
                .on("end", () => {
                    const aliases = {}, addFives = {};
                    let row = isSmall ? 33 : 10;
                    while(true) {
                        if(!data[row]) { break; }
                        const key = data[row][1];
                        if(aliases[key]) {
                            aliases[key].push(data[row][0]);
                        } else {
                            aliases[key] = [data[row][0]];
                        }
                        if(data[row][2]) {
                            addFives[data[row][3]] = data[row][2];
                        }
                        row++;
                    }
                    const maxY = isSmall ? 34 : 8;
                    const maxX = isSmall ? 31 : 9;
                    const suffix = isSmall ? "" : ", true";
                    for(let y = 0; y < maxY; y++) {
                        for(let x = 0; x < maxX; x++) {
                            const val = data[y][x];
                            if(!val) { continue; }
                            arr.push(`"${val}": [${x}, ${y}${suffix}]`);
                            if(aliases[val]) {
                                arr.push(...aliases[val].map(a => `"${a}": [${x}, ${y}${suffix}]`));
                            }
                            if(addFives[val]) {
                                arr.push(`"${addFives[val]}": [${x + 0.5}, ${y}${suffix}]`);
                            }
                        }
                    }
                    resolve(true);
                });
            });
        });
    };
    const Finish = async function() {
        const bgsp = [], smsp = [];
        await RipSpriteFile("Small", smsp);
        await RipSpriteFile("Big", bgsp);
        fs.writeFileSync(path.join(__dirname, "parts/spritedata.js"), `module.exports = {
    ${bgsp.join(",\n\t")},
    ${smsp.join(",\n\t")}
};`);
    }
    Finish();
}
if(HasArg("S")) {
    const shops = fs.readFileSync(path.join(__dirname, "../../js/gamedata/shops.js"), "utf8");
    fs.writeFileSync(path.join(partPath, "shops.js"), shops.replace("const stores", "module.exports"));
    console.log("Generated Shops");
}
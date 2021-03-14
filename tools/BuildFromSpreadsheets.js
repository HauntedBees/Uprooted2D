const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");
const { spawn } = require("child_process");

const tempPath = path.join(__dirname, "/temp");
function RipFile(filename, outfile, prefix, lineFunc, suffix, joinChar, afterFunc) {
    console.log(`Extracting ${filename}`);
    suffix = suffix || "};";
    joinChar = joinChar === undefined  ? "," : joinChar;
    const filepath = path.join(__dirname, "ods/", filename + ".ods");
    const soffice = spawn("soffice", [
        "--headless", 
        "--convert-to", "csv",
        "--outdir", tempPath,
        filepath
    ]);
    soffice.stderr.on("data", data => { console.log("ERROR: " + data); });
    soffice.on("close", res => { 
        if(res !== 0) { return; }
        const outpath = path.join(__dirname, `../js/gamedata/${outfile}.js`);
        const data = [];
        fs.createReadStream(path.join(tempPath, filename + ".csv"))
        .pipe(csv())
        .on("data", row => data.push(row))
        .on("end", () => {
            const lines = data.map((l, i) => lineFunc(l, i)).filter(l => l);
            console.log(`Processed ${lines.length} records.`);
            const afterData = afterFunc ? ("\n" + afterFunc(data)) : "";
            fs.writeFileSync(outpath, `${prefix}
    ${lines.join(joinChar)}
${suffix}${afterData}`);
        });
    });
}

const args = process.argv.slice(2), types = args[0];
const HasArg = s => types === "_" || types.indexOf(s) >= 0;

if(!types) {
    console.log(`Options:
- _: Everything
- T: Text
- S: Cutscenes
- C: Crops
- Q: Equipment
- F: Fixtures
- E: Enemies`);
    return;
}

if(HasArg("T")) {
    RipFile("Details_Text", "text", "const fulltext = {", row => {
        if(row.Key === "") { return ""; }
        if(row.Key === "*") { return "\n\t// " + row["en-us"]; }
        let us = row["en-us"].replace(/"/g, `\\"`), sfw = row["en-us-sfw"].replace(/"/g, `\\"`);
        if(!row.noTrim) {
            us = us.trimEnd();
            sfw = sfw.trimEnd();
        }
        let str = `
    "${row.Key}": {
        "en-us": "${us}",`;
        if(sfw) {
            str += `
        "en-us-sfw": "${sfw}",`;
        }
        if(row.profile) {
            str += `
        "profile": "${row.profile}",`;
        }
        str += `
        "type": "${row.type}"
    }`;
        return str;
    });
}
if(HasArg("S")) {
    RipFile("Details_Cutscenes", "cutscenes", "const scripts = {", row => {
        if(row.Key === "") { return ""; }
        if(row.Key === "*") { return "\n\t// " + row.Action; }
        return `
        "${row.Key}": "${row.Action.trim().replace(/"/g, `\\"`)}"`;
    });
}
if(HasArg("C")) {
    RipFile("Details_Crops", "veggies", `function CropDetail(name, price, type, size, time, frames, power, re, sp, su, au, wi, addtl) {
    this.name = name;
    this.type = type;
    this.price = price;
    this.displayname = GetText("nm." + name);
    this.size = size;
    this.time = time;
    this.frames = frames;
    this.power = power;
    this.initpower = power;
    this.health = power * 5;
    this.maxhealth = this.health;
    this.defense = power * power * 0.4;
    this.respawn = re;
    this.seasons = [sp || 0, su || 0, au || 0, wi || 0];
    if(addtl !== undefined) { for(const key in addtl) { this[key] = addtl[key]; } }
}
function GetCrop(name) {
    switch(name) {`, (row, idx) => {
        if(!row.Id) { return ""; }
        if(row.Id === "*") { return (idx === 0 ? "\t" : "\n\t\t") + "/* " + row.Name + " */"; }
        let resStr = `
		case "${row.Id}": return new CropDetail(name, ${row.Price}, "${row.Type}", `;
        resStr += `${row.Size}, ${row.Time}, ${row.AnimFrames}, ${row.Power}, ${row.Re || 0}, `;
        resStr += `${row.Sp || 0}, ${row.Su || 0}, ${row.Au || 0}, ${row.Wi || 0}`;
        const addtl = [];
        const AppendAddtl = (csvKey, jsKey) => { if(row[csvKey]) { addtl.push(`${jsKey}: ${row[csvKey]}`); } };
        const AppendAddtlStr = (csvKey, jsKey) => { if(row[csvKey]) { addtl.push(`${jsKey}: "${row[csvKey]}"`); } };
        const AppendAddtlBool = (csvKey, jsKey) => { if(row[csvKey]) { addtl.push(`${jsKey}: true`); } };
        AppendAddtl("WaterR", "waterResist");
        AppendAddtl("FireR", "fireResist");
        AppendAddtl("SaltR", "saltResist");
        AppendAddtlBool("SaltClean", "saltClean");
        AppendAddtl("Stick", "stickChance");
        AppendAddtlBool("ShowSeed", "showSeed");
        AppendAddtlStr("Animal", "animal");
        AppendAddtlBool("Rot", "rotten"); // TODO: why are these
        AppendAddtlBool("NoRot", "noRot"); // TODO: why are these
        AppendAddtlStr("Baby", "baby");
        AppendAddtl("SaltChance", "saltChance");
        AppendAddtl("BurnChance", "burnChance");
        AppendAddtlStr("AltTree", "treeSprite");
        AppendAddtlStr("Sound", "sound");
        if(addtl.length) {
            resStr += `, { ${addtl.join(", ")} }`;
        }
        resStr += ");";
        return resStr;
    }, "\t}\n}", "", rows => {
    const myVeggies = [];
    for(let i = 0; i < rows.length; i++) {
        if(rows[i].Name === "Enemy-Only") { break; }
        if(rows[i].Id === "*") { continue; }
        myVeggies.push(`"${rows[i].Id}"`);
    }
    return `debug.AllCrops = [${myVeggies.join(", ")}];`;
});
}
if(HasArg("Q")) {
    RipFile("Details_Equipment", "equipment", `function EquipmentDetail(name, price, type, addtl) {
    this.name = name;
    this.type = type;
    this.price = price;
    this.displayname = GetText(name);
    if(addtl !== undefined) { for(const key in addtl) { this[key] = addtl[key]; } }
}
function GetEquipmentDesc(equipInfo, minified) {
    let str = "";
    if(equipInfo.type === "weapon") {
        str += GetTextSmall("eq.power", minified) + " " + equipInfo.power;
        if(equipInfo.targetCrops) { str += "\\n " + GetTextSmall("eq.hitCrops", minified); }
        if(!equipInfo.noEnemies) { str += "\\n " + GetTextSmall("eq.hitEnemies", minified); }
        if(equipInfo.sp) { str += "\\n " + GetTextSmall("eq.su", minified); }
        if(equipInfo.su) { str += "\\n " + GetTextSmall("eq.sp", minified); }
        if(equipInfo.au) { str += "\\n " + GetTextSmall("eq.au", minified); }
        if(equipInfo.wi) { str += "\\n " + GetTextSmall("eq.wi", minified); }
        if(equipInfo.tech) { str += "\\n " + GetTextSmall("eq.sickle2", minified); }
        if(equipInfo.attacks) { 
            if(equipInfo.attacks === 999) { str += "\\n " + GetTextSmall("eq.attackall", minified); }
            else { str += "\\n " + GetTextSmall("eq.attacksome", minified).replace(/\\{0\\}/g, equipInfo.attacks); }
        }
    } else if(equipInfo.type === "compost") {
        str += GetTextSmall("eq.holds", minified) + " "  + equipInfo.amount;
        if(equipInfo.canAttack) { str += "\\n " + GetTextSmall("eq.compattack", minified); }
        if(equipInfo.rotOnly) { str += "\\n " + GetTextSmall("eq.rotten", minified); }
        if(equipInfo.bonus) { str += "\\n " + GetTextSmall("eq.bonus", minified) + " " + (equipInfo.bonus * 100) + "%"; }
        if(equipInfo.tech) { str += "\\n " + GetTextSmall("eq.backfire", minified); }
    } else if(equipInfo.type === "gloves") {
        str += GetTextSmall("eq.spturn", minified) + " "  + equipInfo.amount;
        if(equipInfo.canAttack) { str += "\\n " + GetTextSmall("eq.actafter", minified); }
        if(equipInfo.def) { str += "\\n " + GetTextSmall("eq.dmgresist", minified) + " " + (equipInfo.def * 100) + "%"; }
        if(equipInfo.tech) { str += "\\n " + GetTextSmall("eq.mayshock1", minified) + " " + GetTextSmall("eq.mayshock2", minified); }
    } else if(equipInfo.type === "soil") {
        if(equipInfo.speed) { str += GetTextSmall("eq.growth", minified) + " " + (equipInfo.speed * 100) + "%"; }
        if(equipInfo.boost) { str += (str === "" ? "" : "\\n ") + GetTextSmall("eq.sres", minified) + " " + (equipInfo.boost * 100) + "%"; }
        if(equipInfo.amplify) { str += (str === "" ? "" : "\\n ") + GetTextSmall("eq.sstr", minified) + " " + (equipInfo.amplify * 100) + "%"; }
        if(equipInfo.tech) { str += (str === "" ? "" : "\\n ") + GetTextSmall("eq.willkill1", minified) + " " + GetTextSmall("eq.willkill2", minified); }
    }
    return str;
}
function GetEquipment(name) {
    switch(name) {`, (row, idx) => {
        if(!row.Id || row.Id === "nope") { return ""; }
        if(row.Id === "*") { return (idx === 0 ? "\t" : "\n\t\t") + "/* " + row.Type + " */"; }
        let resStr = `
		case "${row.Id}": return new EquipmentDetail(name, ${row.Price}, "${row.Type}"`;
        const addtl = [];
        const AppendAddtl = (csvKey, jsKey) => { if(row[csvKey]) { addtl.push(`${jsKey}: ${row[csvKey]}`); } };
        const AppendAddtlV = (csvKey, jsKey) => { addtl.push(`${jsKey}: ${row[csvKey] || 0}`); };
        const AppendAddtlBool = (csvKey, jsKey) => { if(row[csvKey]) { addtl.push(`${jsKey}: true`); } };
        const AppendAddtlBoolV = (jsKey, val) => { addtl.push(`${jsKey}: ${val ? "true" : "false"}`); };
        AppendAddtlBool("Tech", "tech");
        // Weapons
        AppendAddtlBoolV("noEnemies", !row.Foes);
        AppendAddtlBool("Crops", "targetCrops");
        AppendAddtl("Pow", "power");
        AppendAddtl("Num", "attacks");
        AppendAddtl("SP", "sp");
        AppendAddtl("SU", "su");
        AppendAddtl("AU", "au");
        AppendAddtl("WI", "wi");
        // Compost
        AppendAddtl("Amt", "amount");
        AppendAddtlBool("Rot", "rotOnly");
        AppendAddtlBool("Atk", "canAttack");
        AppendAddtlV("Bns", "bonus");
        // Gloves
        AppendAddtlV("Def", "def");
        // Watering Cans
        AppendAddtlV("Spd", "speed");
        AppendAddtlV("Bst", "boost");
        AppendAddtlV("Amp", "amplify");
        
        if(addtl.length) {
            resStr += `, { ${addtl.join(", ")} }`;
        }
        resStr += ");";
        return resStr;
    }, "\t}\n}", "");
}
if(HasArg("F")) {
    RipFile("Details_Fixtures", "fixtures", `function FixtureDetail(name, price, displaySprite) {
    this.name = name;
	const textname = name.substring(1);
    this.displayname = GetText(textname);
    this.price = price;
    this.shortdesc = GetText(textname + ".sdesc");
    this.desc = GetText(textname + ".ldesc");
    if(displaySprite) {
        this.size = 2;
        this.displaySprite = displaySprite;
    }
}
function GetFarmInfo(name) {
    switch(name) {`, (row, idx) => {
        if(!row.Id) { return ""; }
        if(row.Id === "*") { return (idx === 0 ? "\t" : "\n\t\t") + "/* " + row.Name + " */"; }
        let resStr = `
		case "${row.Id}": return new FixtureDetail(name, ${row.Price}`;
        if(row.DisplaySprite) {
            resStr += `, "${row.DisplaySprite}"`;
        }
        resStr += ");";
        return resStr;
    }, "\t}\n}", "")
}
if(HasArg("E")) {
    RipFile("Details_Enemies", "enemies", `function EnemyDetail(id, name, size, spriteidx, cursorinfo, health, atk, def, fieldheight, fieldwidth, boss, seasonDistribution, atkType, args, drops, addtl) {
    this.id = id;
	this.name = name;
    this.health = GetEnemyHealthMult(health);
	this.maxhealth = this.health;
    this.atk = atk;
	this.baseatk = atk;
    this.def = def;
	this.basedef = def;
    this.cursorinfo = cursorinfo;
    this.fieldheight = fieldheight;
    this.fieldwidth = fieldwidth;
    this.size = size;
    this.spriteidx = spriteidx;
    this.stickTurns = 0;
    this.seasonDistribution = seasonDistribution;
    this.attackType = atkType;
	this.args = (args || "").split(",");
	if(player.noFunDiffMod !== 0) { AdjustEnemyStats(this, player.noFunDiffMod); }
	this.exp = Math.ceil(health/10 + atk + def/2);
    if(this.name === "Discussly" || this.name.indexOf("beeQueen") === 0) { this.exp = 0; }
    this.drops = drops;
	this.boss = boss;
	if(this.boss) { this.exp = Math.floor(this.exp * 2.5); }
    if(addtl !== undefined) { for(const key in addtl) { this[key] = addtl[key]; } }
	this.GetRandomArg = function() { return RandomArrayItem(this.args); };
}
function AdjustEnemyStats(enemy, diff) {
	if(diff === 0) { return; }
	if(diff > 0) { // make strongker
		while(diff-- > 0) {
			enemy.maxhealth *= 1.75;
			enemy.baseatk *= 1.5;
			enemy.basedef *= 1.5;
		}
		enemy.maxhealth = Math.round(enemy.maxhealth);
		enemy.health = enemy.maxhealth;
		enemy.baseatk = Math.round(enemy.baseatk);
		enemy.atk = enemy.baseatk;
		enemy.basedef = Math.round(enemy.basedef);
		enemy.def = enemy.basedef;
	} else { // make weakger
		while(diff++ < 0) {
			enemy.maxhealth *= 0.5;
			enemy.baseatk *= 0.75;
			enemy.basedef *= 0.75;
		}
		enemy.maxhealth = Math.max(5, Math.round(enemy.maxhealth));
		enemy.health = enemy.maxhealth;
		enemy.baseatk = Math.max(1, Math.round(enemy.baseatk));
		enemy.atk = enemy.baseatk;
		enemy.basedef = Math.max(1, Math.round(enemy.basedef));
		enemy.def = enemy.basedef;
	}
}
function GetDisplayName(enemyname, max) { return GetText("e." + enemyname + Math.floor(Math.random() * max)); }
function GetEnemy(name) {
    switch(name) {`, (row, idx) => {
        if(!row.Id) { return ""; }
        if(row.Id === "*") { return (idx === 0 ? "\t" : "\n\t\t") + "/* " + row.Names + " */"; }
        let resStr = `
		case "${row.Id}": return new EnemyDetail(name, GetDisplayName(name, ${row.Names}), `;
        resStr += `"${row.Size}", [${row.sI}], { dx: ${row.cdx}, dy: ${row.cdy}, w: ${row.cw}, h: ${row.ch} }, `;
        resStr += `${row.HP}, ${row.Atk}, ${row.Def}, ${row.FH}, ${row.FW}, ${row.Boss === "Y" ? "true" : "false"}, `;
        resStr += `[${row.Sp || 0}, ${row.Su || 0}, ${row.Au || 0}, ${row.Wi || 0}], "${row.atkId}", "${row.args}"`;
        const drops = [], addtl = [];
        if(row.money) {
            const m = row.money.split(",");
            drops.push(`{ money: true, min: ${m[0]}, max: ${m[1]} }`);
        }
        for(let i = 0; i <= 2; i++) {
            if(row["drop" + i]) {
                const m = row["drop" + i].split(",");
                drops.push(`{ seed: "${m[0]}", min: ${m[1]}, max: ${m[2]} }`);
            }
        }
        resStr += `, [ ${drops.join(", ")} ]`;

        const AppendAddtl = (csvKey, jsKey) => { if(row[csvKey]) { addtl.push(`${jsKey}: ${row[csvKey]}`); } };
        const AppendAddtlStr = (csvKey, jsKey) => { if(row[csvKey]) { addtl.push(`${jsKey}: "${row[csvKey]}"`); } };
        const AppendAddtlV = (csvKey, jsKey) => { addtl.push(`${jsKey}: ${row[csvKey] || 0}`); };
        const AppendAddtlBool = (csvKey, jsKey) => { if(row[csvKey]) { addtl.push(`${jsKey}: true`); } };
        
        AppendAddtlStr("Tile", "tile");
        AppendAddtlBool("soleKill", "soleKill");
        AppendAddtl("wkSn", "weakSeason");
        AppendAddtlStr("postHit", "postHit");
        AppendAddtlStr("addtlHitCheck", "addtlHitCheck");
        AppendAddtlStr("initFunc", "initFunc");
        AppendAddtlStr("turnFunc", "turnFunc");
        AppendAddtlV("RCC", "rotClearChance");
        AppendAddtlV("stickRes", "stickRes");
        AppendAddtlStr("killKey", "killKey");
        AppendAddtlStr("Sound", "sound");

        if(addtl.length) {
            resStr += `, { ${addtl.join(", ")} }`;
        }
        resStr += ");";
        return resStr;
    }, `
    }
}`, "", rows => {
    const myEnemies = [];
    for(let i = 0; i < rows.length; i++) {
        if(!rows[i].Id || rows[i].Id === "*") { continue; }
        myEnemies.push(`"${rows[i].Id}"`);
    }
    return `debug.AllEnemies = [${myEnemies.join(", ")}];`;
});
}
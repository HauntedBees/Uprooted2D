function EquipmentDetail(name, price, type, addtl) {
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
        if(equipInfo.targetCrops) { str += "\n " + GetTextSmall("eq.hitCrops", minified); }
        if(!equipInfo.noEnemies) { str += "\n " + GetTextSmall("eq.hitEnemies", minified); }
        if(equipInfo.sp) { str += "\n " + GetTextSmall("eq.su", minified); }
        if(equipInfo.su) { str += "\n " + GetTextSmall("eq.sp", minified); }
        if(equipInfo.au) { str += "\n " + GetTextSmall("eq.au", minified); }
        if(equipInfo.wi) { str += "\n " + GetTextSmall("eq.wi", minified); }
        if(equipInfo.tech) { str += "\n " + GetTextSmall("eq.sickle2", minified); }
        if(equipInfo.attacks) { 
            if(equipInfo.attacks === 999) { str += "\n " + GetTextSmall("eq.attackall", minified); }
            else { str += "\n " + GetTextSmall("eq.attacksome", minified).replace(/\{0\}/g, equipInfo.attacks); }
        }
    } else if(equipInfo.type === "compost") {
        str += GetTextSmall("eq.holds", minified) + " "  + equipInfo.amount;
        if(equipInfo.canAttack) { str += "\n " + GetTextSmall("eq.compattack", minified); }
        if(equipInfo.rotOnly) { str += "\n " + GetTextSmall("eq.rotten", minified); }
        if(equipInfo.bonus) { str += "\n " + GetTextSmall("eq.bonus", minified) + " " + (equipInfo.bonus * 100) + "%"; }
        if(equipInfo.tech) { str += "\n " + GetTextSmall("eq.backfire", minified); }
    } else if(equipInfo.type === "gloves") {
        str += GetTextSmall("eq.spturn", minified) + " "  + equipInfo.amount;
        if(equipInfo.canAttack) { str += "\n " + GetTextSmall("eq.actafter", minified); }
        if(equipInfo.def) { str += "\n " + GetTextSmall("eq.dmgresist", minified) + " " + (equipInfo.def * 100) + "%"; }
        if(equipInfo.tech) { str += "\n " + GetTextSmall("eq.mayshock1", minified) + " " + GetTextSmall("eq.mayshock2", minified); }
    } else if(equipInfo.type === "soil") {
        if(equipInfo.speed) { str += GetTextSmall("eq.growth", minified) + " " + (equipInfo.speed * 100) + "%"; }
        if(equipInfo.boost) { str += (str === "" ? "" : "\n ") + GetTextSmall("eq.sres", minified) + " " + (equipInfo.boost * 100) + "%"; }
        if(equipInfo.amplify) { str += (str === "" ? "" : "\n ") + GetTextSmall("eq.sstr", minified) + " " + (equipInfo.amplify * 100) + "%"; }
        if(equipInfo.tech) { str += (str === "" ? "" : "\n ") + GetTextSmall("eq.willkill1", minified) + " " + GetTextSmall("eq.willkill2", minified); }
    }
    return str;
}
function GetEquipment(name) {
    switch(name) {
		/* Weapons */
		case "!babySickle": return new EquipmentDetail(name, 50, "weapon", { noEnemies: false, power: 0, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!baseSickle": return new EquipmentDetail(name, 100, "weapon", { noEnemies: false, power: 2, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!goodSickle": return new EquipmentDetail(name, 200, "weapon", { noEnemies: false, targetCrops: true, power: 5, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!dblSickle": return new EquipmentDetail(name, 250, "weapon", { noEnemies: false, targetCrops: true, power: 8, attacks: 2, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!hvySickle": return new EquipmentDetail(name, 250, "weapon", { noEnemies: false, targetCrops: true, power: 20, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!hoe": return new EquipmentDetail(name, 300, "weapon", { noEnemies: true, targetCrops: true, power: 35, attacks: 3, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!salthoe": return new EquipmentDetail(name, 300, "weapon", { noEnemies: true, targetCrops: true, power: 32, attacks: 2, wi: 15, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!sicklerang": return new EquipmentDetail(name, 50, "weapon", { noEnemies: false, power: 20, attacks: 999, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!sunSickle": return new EquipmentDetail(name, 50, "weapon", { noEnemies: false, targetCrops: true, power: 25, sp: 10, su: 10, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!pltSickle": return new EquipmentDetail(name, 50, "weapon", { noEnemies: false, power: 30, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!sickle2": return new EquipmentDetail(name, 50, "weapon", { tech: true, noEnemies: false, targetCrops: true, power: 60, attacks: 2, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!sickle2_weak": return new EquipmentDetail(name, 50, "weapon", { tech: true, noEnemies: true, power: 0, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0 });
		/* Compost */
		case "!weakCompost": return new EquipmentDetail(name, 50, "compost", { noEnemies: true, amount: 1, rotOnly: true, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!baseCompost": return new EquipmentDetail(name, 150, "compost", { noEnemies: true, amount: 3, rotOnly: true, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!strongCompost": return new EquipmentDetail(name, 200, "compost", { noEnemies: true, amount: 4, rotOnly: true, canAttack: true, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!sturdyCompost": return new EquipmentDetail(name, 200, "compost", { noEnemies: true, amount: 4, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!jumboCompost": return new EquipmentDetail(name, 50, "compost", { noEnemies: true, amount: 50, canAttack: true, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!vitaminCompost": return new EquipmentDetail(name, 50, "compost", { noEnemies: true, amount: 8, bonus: 0.3, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!compost2": return new EquipmentDetail(name, 50, "compost", { tech: true, noEnemies: true, amount: 50, canAttack: true, bonus: 0.2, def: 0, speed: 0, boost: 0, amplify: 0 });
		/* Gloves */
		case "!weakGloves": return new EquipmentDetail(name, 400, "gloves", { noEnemies: true, amount: 3, bonus: 0, def: 0.25, speed: 0, boost: 0, amplify: 0 });
		case "!pairGloves": return new EquipmentDetail(name, 50, "gloves", { noEnemies: true, amount: 2, canAttack: true, bonus: 0, def: 0.25, speed: 0, boost: 0, amplify: 0 });
		case "!gardenGloves": return new EquipmentDetail(name, 50, "gloves", { noEnemies: true, amount: 6, bonus: 0, def: 0.5, speed: 0, boost: 0, amplify: 0 });
		case "!sbGloves": return new EquipmentDetail(name, 50, "gloves", { noEnemies: true, amount: 4, canAttack: true, bonus: 0, def: 0.5, speed: 0, boost: 0, amplify: 0 });
		case "!gloves2": return new EquipmentDetail(name, 50, "gloves", { tech: true, noEnemies: true, amount: 6, canAttack: true, bonus: 0, def: 0.5, speed: 0, boost: 0, amplify: 0 });
		/* Watering Cans */
		case "!weakSoil": return new EquipmentDetail(name, 200, "soil", { noEnemies: true, bonus: 0, def: 0, speed: 0.15, boost: 0, amplify: 0 });
		case "!speedSoil": return new EquipmentDetail(name, 300, "soil", { noEnemies: true, bonus: 0, def: 0, speed: 0.3, boost: 0, amplify: 0 });
		case "!sturdSoil": return new EquipmentDetail(name, 300, "soil", { noEnemies: true, bonus: 0, def: 0, speed: 0, boost: 0.4, amplify: 0 });
		case "!minSoil": return new EquipmentDetail(name, 300, "soil", { noEnemies: true, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 1 });
		case "!waterfall": return new EquipmentDetail(name, 50, "soil", { noEnemies: true, bonus: 0, def: 0, speed: 0.5, boost: 0, amplify: 0 });
		case "!immunity": return new EquipmentDetail(name, 50, "soil", { noEnemies: true, bonus: 0, def: 0, speed: 0, boost: 0.65, amplify: 0 });
		case "!seasonal": return new EquipmentDetail(name, 50, "soil", { noEnemies: true, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 2 });
		case "!pesticide2": return new EquipmentDetail(name, 50, "soil", { tech: true, noEnemies: true, bonus: 0, def: 0, speed: 0.45, boost: 0.5, amplify: 0 });
	}
}
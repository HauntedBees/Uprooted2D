function EquipmentDetail(name, displayname, price, sprite, type, addtl) {
    this.name = name;
    this.type = type;
    this.price = price;
    this.displayname = displayname;
    this.sprite = sprite;
    if(addtl !== undefined) { for(const key in addtl) { this[key] = addtl[key]; } }
}
function GetEquipmentDesc(equipInfo) {
    let str = "";
    if(equipInfo.type === "weapon") {
        str += GetText("eq.power") + " " + equipInfo.power;
        if(equipInfo.targetCrops) { str += "\n " + GetText("eq.hitCrops"); }
        if(!equipInfo.noEnemies) { str += "\n " + GetText("eq.hitEnemies"); }
        if(equipInfo.sp) { str += "\n " + GetText("eq.su"); }
        if(equipInfo.su) { str += "\n " + GetText("eq.sp"); }
        if(equipInfo.au) { str += "\n " + GetText("eq.au"); }
        if(equipInfo.wi) { str += "\n " + GetText("eq.wi"); }
        if(equipInfo.tech) { str += "\n " + GetText("eq.sickle2"); }
        if(equipInfo.attacks) { 
            if(equipInfo.attacks === 999) { str += "\n " + GetText("eq.attackall"); }
            else { str += "\n " + GetText("eq.attacksome").replace(/\{0\}/g, equipInfo.attacks); }
        }
    } else if(equipInfo.type === "compost") {
        str += GetText("eq.holds") + " "  + equipInfo.amount;
        if(equipInfo.canAttack) { str += "\n " + GetText("eq.compattack"); }
        if(equipInfo.rotOnly) { str += "\n " + GetText("eq.rotten"); }
        if(equipInfo.bonus) { str += "\n " + GetText("eq.bonus") + " " + (equipInfo.bonus * 100) + "%"; }
        if(equipInfo.tech) { str += "\n " + GetText("eq.backfire"); }
    } else if(equipInfo.type === "gloves") {
        str += GetText("eq.spturn") + " "  + equipInfo.amount;
        if(equipInfo.canAttack) { str += "\n " + GetText("eq.actafter"); }
        if(equipInfo.def) { str += "\n " + GetText("eq.dmgresist") + " " + (equipInfo.def * 100) + "%"; }
        if(equipInfo.tech) { str += "\n " + GetText("eq.mayshock1") + " " + GetText("eq.mayshock2"); }
    } else if(equipInfo.type === "soil") {
        if(equipInfo.speed) { str += GetText("eq.growth") + " " + (equipInfo.speed * 100) + "%"; }
        if(equipInfo.boost) { str += "\n " + GetText("eq.sres") + " " + (equipInfo.boost * 100) + "%"; }
        if(equipInfo.amplify) { str += "\n " + GetText("eq.sstr") + " " + (equipInfo.amplify * 100) + "%"; }
        if(equipInfo.tech) { str += "\n " + GetText("eq.willkill1") + " " + GetText("eq.willkill2"); }
    }
    return str;
}
function GetEquipment(name) {
    switch(name) {
		/* Weapons */
		case "!babySickle": return new EquipmentDetail(name, "Small Sickle", 50, "sickle_0", "weapon", { noEnemies: false, power: 0, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!baseSickle": return new EquipmentDetail(name, "Sickle", 50, "sickle", "weapon", { noEnemies: false, power: 2, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!goodSickle": return new EquipmentDetail(name, "Crop Sickle", 50, "sickle_1", "weapon", { noEnemies: false, targetCrops: true, power: 5, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!spSickle": return new EquipmentDetail(name, "Spring Sickle", 50, "sickle_2", "weapon", { noEnemies: false, targetCrops: true, power: 10, sp: 5, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!suSickle": return new EquipmentDetail(name, "Summer Sickle", 50, "sickle_3", "weapon", { noEnemies: false, targetCrops: true, power: 10, su: 5, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!auSickle": return new EquipmentDetail(name, "Autumn Sickle", 50, "sickle_4", "weapon", { noEnemies: false, targetCrops: true, power: 10, au: 5, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!wiSickle": return new EquipmentDetail(name, "Winter Sickle", 50, "sickle_5", "weapon", { noEnemies: false, targetCrops: true, power: 10, wi: 5, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!dblSickle": return new EquipmentDetail(name, "Double Sickle", 50, "sickle_6", "weapon", { noEnemies: false, targetCrops: true, power: 8, attacks: 2, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!hvySickle": return new EquipmentDetail(name, "Heavy Sickle", 50, "sickle_7", "weapon", { noEnemies: false, targetCrops: true, power: 20, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!hoe": return new EquipmentDetail(name, "Hoe", 50, "hoe", "weapon", { noEnemies: true, targetCrops: true, power: 35, attacks: 3, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!salthoe": return new EquipmentDetail(name, "Salty Hoe", 50, "sickle_8", "weapon", { noEnemies: true, targetCrops: true, power: 32, attacks: 2, wi: 15, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!sicklerang": return new EquipmentDetail(name, "Sicklerang", 50, "sickle_9", "weapon", { noEnemies: false, power: 20, attacks: 999, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!sunSickle": return new EquipmentDetail(name, "Sickle of Light", 50, "sickle_10", "weapon", { noEnemies: false, targetCrops: true, power: 25, sp: 10, su: 10, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!pltSickle": return new EquipmentDetail(name, "Platinum Sickle", 50, "sickle_11", "weapon", { noEnemies: false, power: 30, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!sickle2": return new EquipmentDetail(name, "Sickle2", 50, "sickle_12", "weapon", { tech: true, noEnemies: false, targetCrops: true, power: 60, attacks: 2, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!sickle2_weak": return new EquipmentDetail(name, "Sickle2", 50, "sickle_12", "weapon", { tech: true, noEnemies: true, power: 0, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0 });
		/* Compost */
		case "!weakCompost": return new EquipmentDetail(name, "Small Compost Bin", 50, "compost_0", "compost", { noEnemies: true, amount: 1, rotOnly: true, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!baseCompost": return new EquipmentDetail(name, "Compost Bin", 50, "compost", "compost", { noEnemies: true, amount: 3, rotOnly: true, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!strongCompost": return new EquipmentDetail(name, "Battle Compost Bin", 50, "compost_1", "compost", { noEnemies: true, amount: 4, rotOnly: true, canAttack: true, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!sturdyCompost": return new EquipmentDetail(name, "Sturdy Compost Bin", 50, "compost_2", "compost", { noEnemies: true, amount: 4, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!fortCompost": return new EquipmentDetail(name, "Fortified Compost Bin", 50, "compost_3", "compost", { noEnemies: true, amount: 6, rotOnly: true, canAttack: true, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!healthyCompost": return new EquipmentDetail(name, "Healthy Compost Bin", 50, "compost_4", "compost", { noEnemies: true, amount: 8, bonus: 0.1, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!frothCompost": return new EquipmentDetail(name, "Frothy Compost Bin", 50, "compost_5", "compost", { noEnemies: true, amount: 8, rotOnly: true, canAttack: true, bonus: 0.25, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!jumboCompost": return new EquipmentDetail(name, "Jumbo Compost Bin", 50, "compost_6", "compost", { noEnemies: true, amount: 50, canAttack: true, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!vitaminCompost": return new EquipmentDetail(name, "Vitamin-Enriched Compost Bin", 50, "compost_7", "compost", { noEnemies: true, amount: 8, bonus: 0.3, def: 0, speed: 0, boost: 0, amplify: 0 });
		case "!compost2": return new EquipmentDetail(name, "Compost2", 50, "compost_8", "compost", { tech: true, noEnemies: true, amount: 50, canAttack: true, bonus: 0.2, def: 0, speed: 0, boost: 0, amplify: 0 });
		/* Gloves */
		case "!weakGloves": return new EquipmentDetail(name, "Gloves", 50, "glove_0", "gloves", { noEnemies: true, amount: 3, bonus: 0, def: 0.25, speed: 0, boost: 0, amplify: 0 });
		case "!pairGloves": return new EquipmentDetail(name, "Slapping Gloves", 50, "glove_1", "gloves", { noEnemies: true, amount: 2, canAttack: true, bonus: 0, def: 0.25, speed: 0, boost: 0, amplify: 0 });
		case "!gardenGloves": return new EquipmentDetail(name, "Gardening Gloves", 50, "glove_2", "gloves", { noEnemies: true, amount: 6, bonus: 0, def: 0.5, speed: 0, boost: 0, amplify: 0 });
		case "!sbGloves": return new EquipmentDetail(name, "Boxing Gloves", 50, "glove_3", "gloves", { noEnemies: true, amount: 4, canAttack: true, bonus: 0, def: 0.5, speed: 0, boost: 0, amplify: 0 });
		case "!gloves2": return new EquipmentDetail(name, "Gloves2", 50, "glove_4", "gloves", { tech: true, noEnemies: true, amount: 6, canAttack: true, bonus: 0, def: 0.5, speed: 0, boost: 0, amplify: 0 });
		/* Watering Cans */
		case "!weakSoil": return new EquipmentDetail(name, "Watering Can", 50, "can", "soil", { noEnemies: true, bonus: 0, def: 0, speed: 0.15, boost: 0, amplify: 0 });
		case "!fortSoil": return new EquipmentDetail(name, "Fortifying Water", 50, "can_0", "soil", { noEnemies: true, bonus: 0, def: 0, speed: 0, boost: 0.2, amplify: 0 });
		case "!ampSoil": return new EquipmentDetail(name, "Amplifying Water", 50, "can_1", "soil", { noEnemies: true, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0.4 });
		case "!speedSoil": return new EquipmentDetail(name, "Speedy Water", 50, "can_2", "soil", { noEnemies: true, bonus: 0, def: 0, speed: 0.3, boost: 0, amplify: 0 });
		case "!sturdSoil": return new EquipmentDetail(name, "Sturdy Water", 50, "can_3", "soil", { noEnemies: true, bonus: 0, def: 0, speed: 0, boost: 0.4, amplify: 0 });
		case "!minSoil": return new EquipmentDetail(name, "Minmax Water", 50, "can_4", "soil", { noEnemies: true, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 1 });
		case "!sturdSpeed": return new EquipmentDetail(name, "Sturdy Speedy", 50, "can_5", "soil", { noEnemies: true, bonus: 0, def: 0, speed: 0.25, boost: 0.35, amplify: 0 });
		case "!fastAmp": return new EquipmentDetail(name, "Fast Amplifier", 50, "can_6", "soil", { noEnemies: true, bonus: 0, def: 0, speed: 0.25, boost: 0, amplify: 0.5 });
		case "!waterfall": return new EquipmentDetail(name, "Waterfall Can", 50, "can_7", "soil", { noEnemies: true, bonus: 0, def: 0, speed: 0.5, boost: 0, amplify: 0 });
		case "!immunity": return new EquipmentDetail(name, "Immunity Can", 50, "can_8", "soil", { noEnemies: true, bonus: 0, def: 0, speed: 0, boost: 0.65, amplify: 0 });
		case "!seasonal": return new EquipmentDetail(name, "Seasonal Can", 50, "can_9", "soil", { noEnemies: true, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 2 });
		case "!pesticide2": return new EquipmentDetail(name, "Pesticide2", 50, "can_10", "soil", { tech: true, noEnemies: true, bonus: 0, def: 0, speed: 0.45, boost: 0.5, amplify: 0 });
	}
}
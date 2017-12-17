function EquipmentDetail(name, displayname, price, sprite, type, addtl) {
    this.name = name;
    this.type = type;
    this.price = price;
    this.displayname = displayname;
    this.sprite = sprite;
    if(addtl !== undefined) { for(var key in addtl) { this[key] = addtl[key]; } }
}
function GetEquipmentDesc(equipInfo) {
    var str = "";
    if(equipInfo.type === "weapon") {
        str += "Power: " + equipInfo.power;
        if(equipInfo.targetCrops) { str += "\n Can target enemy Crops."; }
        if(equipInfo.noEnemies) { str += "\n Cannot target enemies."; }
        if(equipInfo.sp) { str += "\n Stronger in Spring."; }
        if(equipInfo.su) { str += "\n Stronger in Summer."; }
        if(equipInfo.au) { str += "\n Stronger in Autumn."; }
        if(equipInfo.wi) { str += "\n Stronger in Winter."; }
        if(equipInfo.tech) { str += "\n Requires Sickle2 Charger on field."; }
        if(equipInfo.attacks) { 
            if(equipInfo.attacks === 999) { str += "\n Attacks all enemies."; }
            else { str += "\n Attacks "+ equipInfo.attacks + " enemies."; }
        }
    } else if(equipInfo.type === "compost") {
        str += "Holding Amount: " + equipInfo.amount;
        if(equipInfo.canAttack) { str += "\n Can attack enemies with Compost."; }
        if(equipInfo.rotOnly) { str += "\n Can only compost rotten crops."; }
        if(equipInfo.bonus) { str += "\n Bonus Effect: " + (equipInfo.bonus * 100) + "%"; }
        if(equipInfo.tech) { str += "\n May backfire."; }
    } else if(equipInfo.type === "gloves") {
        str += "Seeds Per Turn: " + equipInfo.amount;
        if(equipInfo.canAttack) { str += "\n Can Attack or Compost after planting seeds."; }
        if(equipInfo.def) { str += "\n Damage Resistance: " + (equipInfo.def * 100) + "%"; }
        if(equipInfo.tech) { str += "\n May shock saplings and tech when planted. Will shock you when touching water."; }
    } else if(equipInfo.type === "soil") {
        if(equipInfo.speed) { str += "\n Growth Speed Boost: " + (equipInfo.speed * 100) + "%"; }
        if(equipInfo.boost) { str += "\n Seasonal Resistance: " + (equipInfo.boost * 100) + "%"; }
        if(equipInfo.amplify) { str += "\n Seasonal Strength: " + (equipInfo.amplify * 100) + "%"; }
        if(equipInfo.tech) { str += "\n Will kill crops that are too weak or grow too quickly. Bees will fly away."; }
    }
    return str;
}
function GetEquipment(name) {
    switch(name) {
		/* Weapons */
		case "!babySickle": return new EquipmentDetail(name, "Small Sickle", 50, "sickle_0", "weapon", { power: 0 });
		case "!baseSickle": return new EquipmentDetail(name, "Sickle", 50, "sickle", "weapon", { power: 2 });
		case "!goodSickle": return new EquipmentDetail(name, "Crop Sickle", 50, "sickle_1", "weapon", { targetCrops: true, power: 5 });
		case "!spSickle": return new EquipmentDetail(name, "Spring Sickle", 50, "sickle_2", "weapon", { targetCrops: true, power: 10, sp: 5 });
		case "!suSickle": return new EquipmentDetail(name, "Summer Sickle", 50, "sickle_3", "weapon", { targetCrops: true, power: 10, su: 5 });
		case "!auSickle": return new EquipmentDetail(name, "Autumn Sickle", 50, "sickle_4", "weapon", { targetCrops: true, power: 10, au: 5 });
		case "!wiSickle": return new EquipmentDetail(name, "Winter Sickle", 50, "sickle_5", "weapon", { targetCrops: true, power: 10, wi: 5 });
		case "!dblSickle": return new EquipmentDetail(name, "Double Sickle", 50, "sickle_6", "weapon", { targetCrops: true, power: 8, attacks: 2 });
		case "!hvySickle": return new EquipmentDetail(name, "Heavy Sickle", 50, "sickle_7", "weapon", { targetCrops: true, power: 20 });
		case "!hoe": return new EquipmentDetail(name, "Hoe", 50, "hoe", "weapon", { noEnemies: true, targetCrops: true, power: 35, attacks: 3 });
		case "!salthoe": return new EquipmentDetail(name, "Salty Hoe", 50, "sickle_8", "weapon", { noEnemies: true, targetCrops: true, power: 32, attacks: 2, wi: 15 });
		case "!sicklerang": return new EquipmentDetail(name, "Sicklerang", 50, "sickle_9", "weapon", { power: 20, attacks: 999 });
		case "!sunSickle": return new EquipmentDetail(name, "Sickle of Light", 50, "sickle_10", "weapon", { targetCrops: true, power: 25, sp: 10, su: 10 });
		case "!pltSickle": return new EquipmentDetail(name, "Platinum Sickle", 50, "sickle_11", "weapon", { power: 30 });
		case "!sickle2": return new EquipmentDetail(name, "Sickle2", 50, "sickle_12", "weapon", { tech: true, targetCrops: true, power: 60, attacks: 2 });
		case "!sickle2_weak": return new EquipmentDetail(name, "Sickle2", 50, "sickle_12", "weapon", { tech: true, noEnemies: true, power: 0 });
		/* Compost */
		case "!weakCompost": return new EquipmentDetail(name, "Small Compost Bin", 50, "compost_0", "compost", { noEnemies: true, amount: 1, rotOnly: true });
		case "!baseCompost": return new EquipmentDetail(name, "Compost Bin", 50, "compost", "compost", { noEnemies: true, amount: 3, rotOnly: true });
		case "!strongCompost": return new EquipmentDetail(name, "Battle Compost Bin", 50, "compost_1", "compost", { noEnemies: true, amount: 4, rotOnly: true, canAttack: true });
		case "!sturdyCompost": return new EquipmentDetail(name, "Sturdy Compost Bin", 50, "compost_2", "compost", { noEnemies: true, amount: 4 });
		case "!fortCompost": return new EquipmentDetail(name, "Fortified Compost Bin", 50, "compost_3", "compost", { noEnemies: true, amount: 6, rotOnly: true, canAttack: true });
		case "!healthyCompost": return new EquipmentDetail(name, "Healthy Compost Bin", 50, "compost_4", "compost", { noEnemies: true, amount: 8, bonus: 0.1 });
		case "!frothCompost": return new EquipmentDetail(name, "Frothy Compost Bin", 50, "compost_5", "compost", { noEnemies: true, amount: 8, rotOnly: true, canAttack: true, bonus: 0.25 });
		case "!jumboCompost": return new EquipmentDetail(name, "Jumbo Compost Bin", 50, "compost_6", "compost", { noEnemies: true, amount: 50, canAttack: true });
		case "!vitaminCompost": return new EquipmentDetail(name, "Vitamin-Enriched Compost Bin", 50, "compost_7", "compost", { noEnemies: true, amount: 8, bonus: 0.3 });
		case "!compost2": return new EquipmentDetail(name, "Compost2", 50, "compost_8", "compost", { tech: true, noEnemies: true, amount: 50, canAttack: true, bonus: 0.2 });
		/* Gloves */
		case "!weakGloves": return new EquipmentDetail(name, "Gloves", 50, "glove_0", "gloves", { noEnemies: true, amount: 3, def: 0.25 });
		case "!pairGloves": return new EquipmentDetail(name, "Slapping Gloves", 50, "glove_1", "gloves", { noEnemies: true, amount: 2, canAttack: true, def: 0.25 });
		case "!gardenGloves": return new EquipmentDetail(name, "Gardening Gloves", 50, "glove_2", "gloves", { noEnemies: true, amount: 6, def: 0.5 });
		case "!sbGloves": return new EquipmentDetail(name, "Boxing Gloves", 50, "glove_3", "gloves", { noEnemies: true, amount: 3, canAttack: true, def: 0.5 });
		case "!gloves2": return new EquipmentDetail(name, "Gloves2", 50, "glove_4", "gloves", { tech: true, noEnemies: true, amount: 5, canAttack: true, def: 0.5 });
		/* Watering Cans */
		case "!weakSoil": return new EquipmentDetail(name, "Watering Can", 50, "can", "soil", { noEnemies: true, speed: 0.15 });
		case "!fortSoil": return new EquipmentDetail(name, "Fortifying Water", 50, "can_0", "soil", { noEnemies: true, boost: 0.2 });
		case "!ampSoil": return new EquipmentDetail(name, "Amplifying Water", 50, "can_1", "soil", { noEnemies: true, amplify: 0.4 });
		case "!speedSoil": return new EquipmentDetail(name, "Speedier Water", 50, "can_2", "soil", { noEnemies: true, speed: 0.3 });
		case "!sturdSoil": return new EquipmentDetail(name, "Sturdy Water", 50, "can_3", "soil", { noEnemies: true, boost: 0.4 });
		case "!minSoil": return new EquipmentDetail(name, "Minmax Water", 50, "can_4", "soil", { noEnemies: true, amplify: 0.6 });
		case "!sturdSpeed": return new EquipmentDetail(name, "Sturdy Speedy", 50, "can_5", "soil", { noEnemies: true, speed: 0.25, boost: 0.35 });
		case "!fastAmp": return new EquipmentDetail(name, "Fast Amplifier", 50, "can_6", "soil", { noEnemies: true, speed: 0.25, amplify: 0.5 });
		case "!waterfall": return new EquipmentDetail(name, "Waterfall Can", 50, "can_7", "soil", { noEnemies: true, speed: 0.5 });
		case "!immunity": return new EquipmentDetail(name, "Immunity Can", 50, "can_8", "soil", { noEnemies: true, boost: 0.65 });
		case "!seasonal": return new EquipmentDetail(name, "Seasonal Can", 50, "can_9", "soil", { noEnemies: true, amplify: 0.9 });
		case "!pesticide2": return new EquipmentDetail(name, "Pesticide2", 50, "can_10", "soil", { tech: true, noEnemies: true, speed: 0.45, boost: 0.5 });
	}
}
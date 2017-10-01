function CropDetail(name, displayname, price, type, size, time, frames, power, re, sp, su, au, wi, addtl) {
    this.name = name;
    this.type = type;
    this.price = price;
    this.displayname = displayname;
    this.size = size;
    this.time = time;
    this.frames = frames;
    this.power = power;
    this.respawn = re;
    this.seasons = [sp || 0.2, su || 0.2, au || 0.2, wi || 0.2];
    if(addtl !== undefined) {
        for(var key in addtl) { this[key] = addtl[key]; }
    }
}

function GetCropDesc(cropInfo) {
    var text = "Power: " + cropInfo.power;
    if(cropInfo.type === "spear") {
        text += "\n Catch Chance: " + (cropInfo.req * 100) + "%";
        return text;
    }
    if(cropInfo.time > 0) { text += "\n Growth Time: " + Math.ceil(cropInfo.time / player.getCropSpeedMultiplier()); }
    if(cropInfo.respawn > 0) { text += "\n Regrowth Time: " + cropInfo.respawn; }
    text += "\n Seasons:";
    if(cropInfo.seasons[0] > 0.5) { text += " SP"; }
    if(cropInfo.seasons[1] > 0.5) { text += " SU"; }
    if(cropInfo.seasons[2] > 0.5) { text += " AU"; }
    if(cropInfo.seasons[3] > 0.5) { text += " WI"; }
    return text;
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
        case "!babySickle": return {name: name, displayname: "Small Sickle", price: 50, sprite: "sickle_0", type: "weapon", power: 0, targetCrops: false };
        case "!baseSickle": return {name: name, displayname: "Sickle", price: 50, sprite: "sickle", type: "weapon", power: 2, targetCrops: false };
        case "!goodSickle": return {name: name, displayname: "Crop Sickle", price: 50, sprite: "sickle_1", type: "weapon", power: 5, targetCrops: true };
        case "!spSickle": return {name: name, displayname: "Spring Sickle", price: 50, sprite: "sickle_2", type: "weapon", power: 10, targetCrops: true, sp: 5 };
        case "!suSickle": return {name: name, displayname: "Summer Sickle", price: 50, sprite: "sickle_3", type: "weapon", power: 10, targetCrops: true, su: 5 };
        case "!auSickle": return {name: name, displayname: "Autumn Sickle", price: 50, sprite: "sickle_4", type: "weapon", power: 10, targetCrops: true, au: 5 };
        case "!wiSickle": return {name: name, displayname: "Winter Sickle", price: 50, sprite: "sickle_5", type: "weapon", power: 10, targetCrops: true, wi: 5 };
        case "!dblSickle": return {name: name, displayname: "Double Sickle", price: 50, sprite: "sickle_6", type: "weapon", power: 8, targetCrops: true, attacks: 2 };
        case "!hvySickle": return {name: name, displayname: "Heavy Sickle", price: 50, sprite: "sickle_7", type: "weapon", power: 20, targetCrops: false };
        case "!hoe": return {name: name, displayname: "Hoe", price: 50, sprite: "hoe", type: "weapon", power: 35, targetCrops: true, noEnemies: true };
        case "!salthoe": return {name: name, displayname: "Salty Hoe", price: 50, sprite: "sickle_8", type: "weapon", power: 32, targetCrops: true, noEnemies: true, wi: 15 };
        case "!sicklerang": return {name: name, displayname: "Sickle-Rang", price: 50, sprite: "sickle_9", type: "weapon", power: 20, targetCrops: false, attacks: 999 };
        case "!sunSickle": return {name: name, displayname: "Sickle of Light", price: 50, sprite: "sickle_10", type: "weapon", power: 25, targetCrops: true, sp: 10, su: 10 };
        case "!pltSickle": return {name: name, displayname: "Platinum Sickle", price: 50, sprite: "sickle_11", type: "weapon", power: 30, targetCrops: false };
        case "!sickle2": return {name: name, displayname: "Sickle2", price: 50, sprite: "sickle_12", type: "weapon", power: 60, targetCrops: true, attacks: 2, tech: true };
        case "!sickle2_weak": return {name: name, displayname: "Sickle2", price: 50, sprite: "sickle_12", type: "weapon", power: 0, targetCrops: false, noEnemies: true, tech: true };

        case "!weakCompost": return {name: name, displayname: "Small Compost Bin", price: 50, sprite: "compost_0", type: "compost", amount: 1, rotOnly: true };
        case "!baseCompost": return {name: name, displayname: "Compost Bin", price: 50, sprite: "compost", type: "compost", amount: 3, rotOnly: true };
        case "!strongCompost": return {name: name, displayname: "Battle Compost Bin", price: 50, sprite: "compost_1", type: "compost", amount: 4, canAttack: true, rotOnly: true };
        case "!sturdyCompost": return {name: name, displayname: "Sturdy Compost Bin", price: 50, sprite: "compost_2", type: "compost", amount: 4 };
        case "!fortCompost": return {name: name, displayname: "Fortified Compost Bin", price: 50, sprite: "compost_3", type: "compost", amount: 6, canAttack: true, rotOnly: true };
        case "!healthyCompost": return {name: name, displayname: "Healthy Compost Bin", price: 50, sprite: "compost_4", type: "compost", amount: 8, bonus: 0.1 };
        case "!frothCompost": return {name: name, displayname: "Frothy Compost Bin", price: 50, sprite: "compost_5", type: "compost", amount: 8, canAttack: true, rotOnly: true, bonus: 0.25 };
        case "!jumboCompost": return {name: name, displayname: "Jumbo Compost Bin", price: 50, sprite: "compost_6", type: "compost", amount: 50, canAttack: true };
        case "!vitaminCompost": return {name: name, displayname: "Vitamin-Enriched Compost Bin", price: 50, sprite: "compost_7", type: "compost", amount: 8, bonus: 0.3 };
        case "!compost2": return {name: name, displayname: "Compost2", price: 50, sprite: "compost_8", type: "compost", amount: 50, canAttack: true, bonus: 0.2, tech: true };

        case "!weakGloves": return {name: name, displayname: "Gloves", price: 50, sprite: "glove_0", type: "gloves", amount: 3, def: 0.25 };
        case "!pairGloves": return {name: name, displayname: "Slapping Gloves", price: 50, sprite: "glove_1", type: "gloves", amount: 2, canAttack: true, def: 0.25 };
        case "!gardenGloves": return {name: name, displayname: "Gardening Gloves", price: 50, sprite: "glove_2", type: "gloves", amount: 6, def: 0.5 };
        case "!sbGloves": return {name: name, displayname: "Boxing Gloves", price: 50, sprite: "glove_3", type: "gloves", amount: 3, canAttack: true, def: 0.5 };
        case "!gloves2": return {name: name, displayname: "Gloves2", price: 50, sprite: "glove_4", type: "gloves", amount: 5, canAttack: true, def: 0.5, tech: true };

        case "!weakSoil": return {name: name, displayname: "Watering Can", price: 50, sprite: "can", type: "soil", speed: 0.15 };
        case "!fortSoil": return {name: name, displayname: "Fortifying Water", price: 50, sprite: "can_0", type: "soil", boost: 0.2 };
        case "!ampSoil": return {name: name, displayname: "Amplifying Water", price: 50, sprite: "can_1", type: "soil", amplify: 0.4 };
        case "!speedSoil": return {name: name, displayname: "Speedier Water", price: 50, sprite: "can_2", type: "soil", speed: 0.3 };
        case "!sturdSoil": return {name: name, displayname: "Sturdy Water", price: 50, sprite: "can_3", type: "soil", boost: 0.4 };
        case "!minSoil": return {name: name, displayname: "Minmax Water", price: 50, sprite: "can_4", type: "soil", amplify: 0.6 };
        case "!sturdSpeed": return {name: name, displayname: "Sturdy Speedy", price: 50, sprite: "can_5", type: "soil", speed: 0.25, boost: 0.35 };
        case "!fastAmp": return {name: name, displayname: "Fast Amplifier", price: 50, sprite: "can_6", type: "soil", speed: 0.25, amplify: 0.5 };
        case "!waterfall": return {name: name, displayname: "Waterfall Can", price: 50, sprite: "can_7", type: "soil", speed: 0.5 };
        case "!immunity": return {name: name, displayname: "Immunity Can", price: 50, sprite: "can_8", type: "soil", boost: 0.65 };
        case "!seasonal": return {name: name, displayname: "Seasonal Can", price: 50, sprite: "can_9", type: "soil", amplify: 0.9 };
        case "!pesticide2": return {name: name, displayname: "Pesticide2", price: 50, sprite: "can_10", type: "soil", speed: 0.45, boost: 0.5, tech: true };
    }
}

function GetCrop(name) {
    switch(name) {
        /* Bees */
        case "beeR": return new CropDetail(name, "Killer Bee", 10, "bee", 1, 999, 2, 5, 999, 1, 1, 0, 1, { req: 0.1, stickChance: 1, stickRange: [1, 2] });
        case "beeG": return new CropDetail(name, "Stingless Bee", 10, "bee", 1, 999, 2, 5, 999, 1, 1, 0, 1, { req: 0.1, stickChance: 1, stickRange: [1, 2] });
        case "beeB": return new CropDetail(name, "Honey Bee", 10, "bee", 1, 999, 2, 5, 999, 1, 1, 0, 1, { req: 0.1, stickChance: 1, stickRange: [1, 2] });
        case "hbee": return new CropDetail(name, "Haunted Bee", 10, "bee", 1, 999, 2, 5, 999, 1, 1, 0, 1, { req: 0.1, stickChance: 1, stickRange: [1, 2] });
        /* Rice */
        case "rice": return new CropDetail(name, "Rice", 10, "rice", 1, 5, 4, 5, 0, 1, 1, 0, 1);
        case "arborio": return new CropDetail(name, "Arborio Rice", 10, "rice", 1, 5, 4, 5, 0, 1, 1, 0, 1);
        case "blackrice": return new CropDetail(name, "Black Rice", 10, "rice", 1, 5, 4, 5, 0, 0, 1, 1, 1);
        /* Fishing */
        case "spear": return new CropDetail(name, "Fish Spear", 10, "spear", 1, 0, 2, 5, 0, 0, 0, 0, 0, { catchLuck: 0.99, req: 0.5 });
        case "rod": return new CropDetail(name, "Fish Rod", 10, "rod", 1, 10, 2, 5, 0, 0, 0, 0, 0, { catchLuck: 0.99, req: 0.15 });
        case "goodrod": return new CropDetail(name, "Better Rod", 10, "rod", 1, 10, 2, 5, 0, 0, 0, 0, 0, { catchLuck: 0.7, req: 0.2 });
        case "metalrod": return new CropDetail(name, "Metal Rod", 10, "rod", 1, 20, 2, 5, 0, 0, 0, 0, 0, { catchLuck: 0.8, req: 0.175 });
        case "net": return new CropDetail(name, "Fish Net", 10, "water", 1, -1, 2, 10, 0, 0, 0, 0, 0, { rotten: true, req: 0.05 });
        case "bignet": return new CropDetail(name, "Big Net", 10, "water", 2, -1, 2, 10, 0, 0, 0, 0, 0, { rotten: true, req: 0.05 });
        /* Cow */
        case "fodder": return new CropDetail(name, "Fodder", 10, "food", 1, 0, 1, 4, 0, 0, 0, 0, 0);
        /* Veg */
        case "beet": return new CropDetail(name, "Beet", 10, "veg", 1, 1, 2, 5, 0, 0, 0.66, 1, 1, { waterResist: 0.5 });
        case "apple": return new CropDetail(name, "Apple", 10, "tree", 2, 5, 5, 2, 2, 0.75, 0.75, 1, 0.75);
        case "carrot": return new CropDetail(name, "Carrot", 10, "veg", 1, 2, 2, 3, 0, 1, 0.66, 1, 0.66, { animal: "Rabbit", animalChance: 0.01, animalDamageMult: 2 });
        case "leek": return new CropDetail(name, "Leek", 10, "veg", 1, 2, 3, 8, 0, 0, 0, 0, 1);
        case "lemon": return new CropDetail(name, "Lemon", 10, "tree", 2, 5, 5, 4, 2, 1, 1, 1);
        case "rhubarb": return new CropDetail(name, "Rhubarb", 10, "veg", 1, 20, 4, 15, 0, 1);
        case "pineapple": return new CropDetail(name, "Pineapple", 10, "veg", 1, 12, 4, 10, 0, 1, 0, 0.66, 0.66);
        case "grapes": return new CropDetail(name, "Grapes", 10, "tree", 2, 20, 5, 6, 4, 0, 0, 1);
        case "ginger": return new CropDetail(name, "Ginger", 10, "veg", 1, 5, 4, 4, 0, 0, 0, 1);
        case "specialgrapes": return new CropDetail(name, "Grapes+", 10, "tree", 2, 4, 5, 6, 3, 0, 0, 1);
        /* only for enemies */
        case "algae": return new CropDetail(name, "Algae", 10, "rice", 1, 2, 2, 3, 0, 1, 1, 1, 1, { noRot: true });
        case "kelp": return new CropDetail(name, "Kelp", 10, "rice", 1, 5, 5, 3, 0, 1, 1, 1, 1, { noRot: true });
        case "rock": return new CropDetail(name, "Rock", 10, "rock", 1, 5, 1, 0, 0);
        case "salt": return new CropDetail(name, "Salt", 10, "rock", 1, 30, 1, 0, 0);
        /* Mushrooms */
        case "shiitake": return new CropDetail(name, "Shiitake", 10, "mush", 1, 5, 3, 5, 3, 1, 1, 1, 1);
        case "milkcap": return new CropDetail(name, "Milk Cap", 10, "mush", 1, 5, 3, 5, 3, 1, 1, 1, 1);
        case "portobello": return new CropDetail(name, "Portobello", 10, "mush", 1, 5, 3, 5, 3, 1, 1, 1, 1);
        case "greenshroom": return new CropDetail(name, "Parrot Toadstool", 10, "mush", 1, 5, 3, 5, 3, 1, 1, 1, 1);
        case "blackshroom": return new CropDetail(name, "Black Mushroom", 10, "mush", 1, 5, 3, 5, 3, 1, 1, 1, 1);
        case "poisnshroom": return new CropDetail(name, "Definitely Poisonous Mushroom", 10, "mush", 1, 5, 3, 5, 3, 1, 1, 1, 1);
        /* Eggs */
        case "egg": return new CropDetail(name, "Chicken Egg", 10, "egg", 1, 4, 4, 8, 0, 1, 1, 1, 1);
        case "quail": return new CropDetail(name, "Quail Egg", 10, "egg", 1, 4, 4, 8, 0, 1, 1, 1, 1);
        case "goose": return new CropDetail(name, "Goose Egg", 10, "egg", 1, 4, 4, 8, 0, 1, 1, 1, 1);
        case "turkey": return new CropDetail(name, "Turkey Egg", 10, "egg", 1, 4, 4, 8, 0, 1, 1, 1, 1);
        case "platypus": return new CropDetail(name, "Platypus Egg", 10, "egg", 1, 4, 4, 8, 0, 1, 1, 1, 1);
        /* Tech */
        case "battery": return new CropDetail(name, "Battery", 10, "tech", 1, 5, 5, 3, 0, 1, 1, 1, 1);
        case "headphones": return new CropDetail(name, "Earbuds", 10, "tech", 1, 5, 3, 3, 0, 1, 1, 1, 1);
        case "printer": return new CropDetail(name, "3D Printer", 10, "tech", 1, 5, 6, 3, 4, 1, 1, 1, 1);
        case "app": return new CropDetail(name, "App", 10, "tech", 1, 3, 4, 3, 0, 1, 1, 1, 1);
        case "drone": return new CropDetail(name, "Drone", 10, "tech", 1, 5, 3, 3, 0, 1, 1, 1, 1);
        case "frogbot": return new CropDetail(name, "Fwoggybot", 10, "tech", 2, 5, 4, 3, 0, 1, 1, 1, 1);
        case "coffee": return new CropDetail(name, "Coffee Machine", 10, "tech", 2, 5, 5, 3, 3, 1, 1, 1, 1);
        case "sicklebattery": return new CropDetail(name, "Sickle2 Battery", 10, "sickle2", 1, 5, 4, 0, 0);
    }
}
function GetFarmInfo(name) {
    switch(name) {
        case "_log": return { name: name, displayname: "Mshrm Log", price: 100, shortdesc: "Allows Mushrooms to be grown.",
            desc: "Allows Mushrooms to be grown. Mushrooms regrow after harvest and do not rot after being grown."
        }; // Area 1: Farm/Town
        case "_modulator": return { name: name, displayname: "Modulator", price: 100, shortdesc: "Changes seasons when fed seeds.", size: 2, displaySprite: "mod0",
            desc: "If vegetable seeds are planted in this, it will return the seeds and change the season based on the seed."
        }; // Area 1: BOSS: Big Robot
        case "_sprinkler": return { name: name, displayname: "Sprinkler", price: 100, shortdesc: "Makes crops around it grow faster.",
            desc: "Vegetables and trees planted in the 8 tiles around a sprinkler will grow 25% faster."
        }; // Area 1: Town
        case "_coop": return { name: name, displayname: "Incubator", price: 100, shortdesc: "Allows Eggs to be hatched.",
            desc: "Allows Eggs to be hatched. Hatched eggs do not rot and do more damage the longer they are left on the Field."
        }; // Area 1: Forest/Town
        case "_shooter": return { name: name, displayname: "Seed Shooter", price: 100, shortdesc: "Immediately shoots seeds it is fed.",
            desc: "If seeds are planted in this, it will immediately shoot seeds at all enemies."
        }; // Area 1: BOSS: Mad Scientist
        case "_lake": return { name: name, displayname: "Lake", price: 100, shortdesc: "Allows fishing tools to be placed.",
            desc: "Allows sea creatures to be caught with appropriate equipment."
        }; // Area 2: Bridge
        case "_paddy": return { name: name, displayname: "Rice Paddy", price: 100, shortdesc: "Allows rice to be grown.",
            desc: "Allows rice to be grown. Can only be placed on the bottom row of a Field."
        }; // Area 2: Bridge
        case "_cow": return { name: name, displayname: "Cow", price: 100, shortdesc: "Produces healing Milk when fed.", size: 2, displaySprite: "cow",
            desc: "Produces healing Milk when fed fodder or vegetable seeds. Milk can be collected by Composting."
        }; // Area 3: Totally Real Farm
        case "_strongsoil": return { name: name, displayname: "Strong Soil", price: 100, shortdesc: "Makes crops more resistant to damage.",
            desc: "Vegetables and trees planted on Strong Soil will take less damage from fire and water damage as well as standard attacks. The soil itself is also more resistant to burning and flooding."
        }; // Area 3: Totally Real Farm
        case "_hotspot": return { name: name, displayname: "Hotspot", price: 100, shortdesc: "Allows electronics to be placed.", size: 2, displaySprite: "hotspot",
            desc: "Allows electronic devices to be 'planted.'"
        }; // Area 3: BOSS: Totally Real Farm
        case "_beehive": return { name: name, displayname: "Beehive", price: 100, shortdesc: "Holds bees.",
            desc: "Allows Bees to be placed. Bees will randomly produce honey, which can recover lots of health or stun enemies."
        };
        case "_charger": return { name: name, displayname: "Sickle2 Charger", price: 100, shortdesc: "Charges Sickle2.", size: 2, displaySprite: "chargerplaced",
            desc: "This must be present in your field in order to use your Sickle2 effectively."
        };
    }
}
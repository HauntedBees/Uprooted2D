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
    } else if(equipInfo.type === "compost") {
        str += "Holding Amount: " + equipInfo.amount;
        if(equipInfo.canAttack) { str += "\n Can attack enemies with Compost."; }
        if(equipInfo.name === "!weakCompost") { str += "\n Can only compost rotten crops."; }
    } else if(equipInfo.type === "gloves") {
        str += "Seeds Per Turn: " + equipInfo.amount;
        if(equipInfo.canAttack) { str += "\n Can Attack or Compost after planting seeds."; }
    } else if(equipInfo.type === "soil") {
        str += "Speed Boost: " + (equipInfo.boost * 100) + "%";
        if(equipInfo.rotResist !== undefined) { str += "\n Rot Resistance Turns: " + equipInfo.rotResist; }
    } else if(equipInfo.type === "armor") {
        str += player.getArmorDisplayString(equipInfo);
    }
    return str;
}

function GetEquipment(name) {
    switch(name) {
        case "!baseSickle": return {name: name, displayname: "Sickle", price: 50, sprite: "sickle", type: "weapon", power: 1, targetCrops: false };
        case "!goodSickle": return {name: name, displayname: "Focused Sickle", price: 50, sprite: "sickle", type: "weapon", power: 5, targetCrops: true };
        case "!weakCompost": return {name: name, displayname: "Weak Compost Bin", price: 50, sprite: "compost", type: "compost", amount: 3 };
        case "!baseCompost": return {name: name, displayname: "Compost Bin", price: 50, sprite: "compost", type: "compost", amount: 3 };
        case "!strongCompost": return {name: name, displayname: "Focused Compost Bin", price: 50, sprite: "compost", type: "compost", amount: 6, canAttack: true };
        case "!weakGloves": return {name: name, displayname: "Standard Gloves", price: 50, sprite: "glove", type: "gloves", amount: 2 };
        case "!pairGloves": return {name: name, displayname: "Combat Gloves", price: 50, sprite: "glove", type: "gloves", amount: 2, canAttack: true };
        case "!weakSoil": return {name: name, displayname: "Good Soil", price: 50, sprite: "can", type: "soil", boost: 0.2 };
        case "!fortSoil": return {name: name, displayname: "Fortified Soil", price: 50, sprite: "can", type: "soil", boost: 0.2, rotResist: 1 };
        case "!balancedGreenhouse": return {name: name, displayname: "Balanced Greenhouse", price: 50, sprite: "fertilizer", type: "armor", boost: 0.1 };
        case "!amplifyingGreenhouse": return {name: name, displayname: "Amplifying Greenhouse", price: 50, sprite: "fertilizer", type: "armor", amplify: 0.4 };
    }
}

function GetCrop(name) {
    switch(name) {
        case "beeB": return new CropDetail(name, "Honeybee", 10, "bee", 1, 999, 2, 5, 0, 1, 1, 0, 1, { req: 0.1, stickChance: 1, stickRange: [1, 2] });
        case "rice": return new CropDetail(name, "Rice", 10, "rice", 1, 5, 4, 5, 0, 1, 1, 0, 1);
        case "arborio": return new CropDetail(name, "Arborio Rice", 10, "rice", 1, 5, 4, 5, 0, 1, 1, 0, 1);
        case "blackrice": return new CropDetail(name, "Black Rice", 10, "rice", 1, 5, 4, 5, 0, 0, 1, 1, 1);
        case "spear": return new CropDetail(name, "Fish Spear", 10, "spear", 1, 0, 2, 5, 0, 0, 0, 0, 0, { catchLuck: 0.99, req: 0.5 });
        case "rod": return new CropDetail(name, "Fish Rod", 10, "rod", 1, 10, 2, 5, 0, 0, 0, 0, 0, { catchLuck: 0.99, req: 0.15 });
        case "goodrod": return new CropDetail(name, "Better Rod", 10, "rod", 1, 10, 2, 5, 0, 0, 0, 0, 0, { catchLuck: 0.7, req: 0.2 });
        case "metalrod": return new CropDetail(name, "Metal Rod", 10, "rod", 1, 20, 2, 5, 0, 0, 0, 0, 0, { catchLuck: 0.8, req: 0.175 });
        case "net": return new CropDetail(name, "Fish Net", 10, "water", 1, -1, 2, 10, 0, 0, 0, 0, 0, { rotten: true, req: 0.05 });
        case "fodder": return new CropDetail(name, "Fodder", 10, "food", 1, 0, 1, 4, 0, 0, 0, 0, 0);
        case "egg": return new CropDetail(name, "Egg", 10, "egg", 1, 4, 4, 8, 0, 1, 1, 1, 1);
        case "shiitake": return new CropDetail(name, "Shiitake", 10, "mush", 1, 5, 3, 5, 3, 1, 1, 1, 1);
        case "milkcap": return new CropDetail(name, "Milk Cap", 10, "mush", 1, 5, 3, 5, 3, 1, 1, 1, 1);
        case "portobello": return new CropDetail(name, "Portobello", 10, "mush", 1, 5, 3, 5, 3, 1, 1, 1, 1);
        case "beet": return new CropDetail(name, "Beet", 10, "veg", 1, 1, 2, 5, 0, 0, 0.66, 1, 1);
        case "apple": return new CropDetail(name, "Apple", 10, "tree", 2, 5, 5, 2, 2, 0.75, 0.75, 1, 0.75);
        case "carrot": return new CropDetail(name, "Carrot", 10, "veg", 1, 2, 2, 3, 0, 1, 0.66, 1, 0.66, { animal: "Rabbit", animalChance: 1, animalDamageMult: 2 });
        case "leek": return new CropDetail(name, "Leek", 10, "veg", 1, 2, 3, 8, 0, 0, 0, 0, 1);
        case "lemon": return new CropDetail(name, "Lemon", 10, "tree", 2, 5, 5, 4, 2, 1, 1, 1);
        case "rhubarb": return new CropDetail(name, "Rhubarb", 10, "veg", 1, 20, 4, 15, 0, 1);
        case "pineapple": return new CropDetail(name, "Pineapple", 10, "veg", 1, 12, 4, 10, 0, 1, 0, 0.66, 0.66);
        case "grapes": return new CropDetail(name, "Grapes", 10, "tree", 2, 20, 5, 6, 4, 0, 0, 1);
        case "ginger": return new CropDetail(name, "Ginger", 10, "veg", 1, 5, 4, 4, 0, 0, 0, 1);
        case "specialgrapes": return new CropDetail(name, "Grapes+", 10, "tree", 2, 4, 5, 6, 3, 0, 0, 1);
        case "battery": return new CropDetail(name, "Battery", 10, "tech", 1, 5, 5, 3, 0, 1, 1, 1, 1);
    }
}
function GetFarmInfo(name) {
    switch(name) {
        case "_log": return { name: name, displayname: "Mshrm Log", price: 100, shortdesc: "Allows Mushrooms to be grown.",
            desc: "Allows Mushrooms to be grown. Mushrooms regrow after harvest and do not rot after being grown."
        };
        case "_coop": return { name: name, displayname: "Incubator", price: 100, shortdesc: "Allows Eggs to be hatched.",
            desc: "Allows Eggs to be hatched. Hatched eggs do not rot and do more damage the longer they are left on the Field."
        };
        case "_cow": return { name: name, displayname: "Cow", price: 100, shortdesc: "Produces healing Milk when fed.", size: 2, displaySprite: "cow",
            desc: "Produces healing Milk when fed fodder or vegetable seeds. Milk can be collected by Composting."
        };
        case "_lake": return { name: name, displayname: "Lake", price: 100, shortdesc: "Allows fishing tools to be placed.",
            desc: "Allows sea creatures to be caught with appropriate equipment."
        };
        case "_paddy": return { name: name, displayname: "Rice Paddy", price: 100, shortdesc: "Allows rice to be grown.",
            desc: "Allows rice to be grown. Can only be placed on the bottom row of a Field."
        };
        case "_shooter": return { name: name, displayname: "Seed Shooter", price: 100, shortdesc: "Immediately shoots seeds it is fed.",
            desc: "If seeds are planted in this, it will immediately shoot seeds at all enemies."
        };
        case "_hotspot": return { name: name, displayname: "Hotspot", price: 100, shortdesc: "Allows electronics to be placed.", size: 2, displaySprite: "hotspot",
            desc: "Allows electronic devices to be 'planted.'"
        };
        case "_modulator": return { name: name, displayname: "Modulator", price: 100, shortdesc: "Changes seasons when fed seeds.", size: 2, displaySprite: "mod0",
            desc: "If vegetable seeds are planted in this, it will return the seeds and change the season based on the seed."
        };
        case "_beehive": return { name: name, displayname: "Beehive", price: 100, shortdesc: "Holds bees.",
            desc: "Allows Bees to be placed. Bees will randomly produce honey, which can recover lots of health or stun enemies."
        };
    }
}
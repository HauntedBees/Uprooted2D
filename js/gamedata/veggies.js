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
    if(addtl !== undefined) { for(var key in addtl) { this[key] = addtl[key]; } }
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
function GetCrop(name) {
    switch(name) {
		/* Veggies */
		case "asparagus": return new CropDetail(name, "Asparagus", 10, "veg", 1, 18, 4, 12, 3, 1, 0, 0, 0);
		case "beet": return new CropDetail(name, "Beet", 10, "veg", 1, 1, 2, 5, 0, 0, 0.66, 1, 1, { waterResist: 0.5 });
		case "bellpepper": return new CropDetail(name, "Bell Pepper", 10, "veg", 1, 2, 3, 3, 0, 0, 0.66, 1, 0);
		case "carrot": return new CropDetail(name, "Carrot", 10, "veg", 1, 2, 2, 3, 0, 1, 0.66, 1, 0.66, { animal: "Rabbit", animalChance: 0.01, animalDamageMult: 2 });
		case "corn": return new CropDetail(name, "Corn", 10, "veg", 1, 5, 3, 4, 0, 0, 1, 0, 0);
		case "garlic": return new CropDetail(name, "Garlic", 10, "veg", 1, 6, 3, 15, 0, 1, 1, 1, 0);
		case "ginger": return new CropDetail(name, "Ginger", 10, "veg", 1, 5, 4, 4, 0, 0, 0, 1, 0);
		case "leek": return new CropDetail(name, "Leek", 10, "veg", 1, 3, 3, 8, 0, 0, 0, 0, 1);
		case "pineapple": return new CropDetail(name, "Pineapple", 10, "veg", 1, 12, 4, 10, 0, 1, 0, 0.66, 0.66);
		case "radish": return new CropDetail(name, "Radish", 10, "veg", 1, 1, 2, 3, 0, 1, 0, 0.75, 0);
		case "rhubarb": return new CropDetail(name, "Rhubarb", 10, "veg", 1, 20, 4, 1000, 0, 1, 0, 0, 0);
		case "spinach": return new CropDetail(name, "Spinach", 10, "veg", 1, 1, 2, 2, 0, 0.66, 0, 1, 0);
		case "tomato": return new CropDetail(name, "Tomato", 10, "veg", 1, 1, 2, 2, 0, 0, 1, 0, 0);
		/* Trees */
		case "apple": return new CropDetail(name, "Apple", 10, "tree", 2, 5, 5, 2, 2, 0.75, 0.75, 1, 0.75);
		case "apricot": return new CropDetail(name, "Apricot", 10, "tree", 2, 24, 5, 12, 5, 1, 0.75, 0, 0);
		case "avocado": return new CropDetail(name, "Avocado", 10, "tree", 2, 24, 5, 8, 5, 1, 1, 0, 0.66);
		case "banana": return new CropDetail(name, "Banana", 10, "tree", 2, 7, 5, 3, 3, 1, 1, 1, 1);
		case "blackberry": return new CropDetail(name, "Blackberry", 10, "tree", 2, 14, 5, 5, 1, 0, 1, 0, 0);
		case "grapes": return new CropDetail(name, "Grapes", 10, "tree", 2, 20, 5, 6, 4, 0, 0, 1, 0);
		case "specialgrapes": return new CropDetail(name, "Grapes+", 10, "tree", 2, 4, 5, 6, 3, 0, 0, 1, 0);
		case "kiwi": return new CropDetail(name, "Kiwi", 10, "tree", 2, 50, 5, 15, 4, 0, 1, 0, 0.75);
		case "lemon": return new CropDetail(name, "Lemon", 10, "tree", 2, 5, 5, 4, 2, 1, 1, 1, 0);
		case "mango": return new CropDetail(name, "Mango", 10, "tree", 2, 3, 5, 3, 2, 0, 1, 0.75, 0);
		/* Bees */
		case "beeR": return new CropDetail(name, "Killer Bee", 10, "bee", 1, 999, 2, 5, 999, 1, 1, 1, 0, { req: 0.1, stickChance: 1, stickRange: [1, 2] });
		case "beeG": return new CropDetail(name, "Stingless Bee", 10, "bee", 1, 999, 2, 5, 999, 1, 1, 1, 0, { req: 0.1, stickChance: 1, stickRange: [1, 2] });
		case "beeB": return new CropDetail(name, "Honey Bee", 10, "bee", 1, 999, 2, 5, 999, 1, 1, 1, 0, { req: 0.1, stickChance: 1, stickRange: [1, 2] });
		case "hbee": return new CropDetail(name, "Haunted Bee", 10, "bee", 1, 999, 2, 5, 999, 1, 1, 1, 0, { req: 0.1, stickChance: 1, stickRange: [1, 2] });
		/* Rice */
		case "rice": return new CropDetail(name, "Rice", 10, "rice", 1, 5, 4, 5, 0, 1, 1, 0, 1);
		case "arborio": return new CropDetail(name, "Arborio Rice", 10, "rice", 1, 5, 4, 5, 0, 1, 1, 0, 1);
		case "blackrice": return new CropDetail(name, "Black Rice", 10, "rice", 1, 5, 4, 5, 0, 1, 1, 0, 1);
		case "shortgrain": return new CropDetail(name, "Short-Grain Rice", 10, "rice", 1, 5, 4, 5, 0, 1, 1, 0, 1);
		case "chestnut": return new CropDetail(name, "Water Chestnut", 10, "rice", 1, 5, 4, 5, 0, 0, 1, 1, 1);
		/* Fishing */
		case "spear": return new CropDetail(name, "Fish Spear", 10, "spear", 1, 0, 2, 5, 0, 0, 0, 0, 0, { catchLuck: 0.99, req: 0.5 });
		case "rod": return new CropDetail(name, "Fish Rod", 10, "rod", 1, 10, 2, 5, 0, 0, 0, 0, 0, { catchLuck: 0.99, req: 0.15 });
		case "goodrod": return new CropDetail(name, "Better Rod", 10, "rod", 1, 10, 2, 5, 0, 0, 0, 0, 0, { catchLuck: 0.7, req: 0.2 });
		case "metalrod": return new CropDetail(name, "Metal Rod", 10, "rod", 1, 10, 2, 5, 0, 0, 0, 0, 0, { catchLuck: 0.8, req: 0.175 });
		case "net": return new CropDetail(name, "Fish Net", 10, "water", 1, -1, 2, 10, 0, 0, 0, 0, 0, { rotten: true, req: 0.05 });
		case "bignet": return new CropDetail(name, "Big Net", 10, "water", 2, -1, 2, 10, 0, 0, 0, 0, 0, { rotten: true, req: 0.05 });
		/* Cow */
		case "fodder": return new CropDetail(name, "Fodder", 10, "food", 1, 0, 1, 4, 0, 0, 0, 0, 0);
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
		/* Technology */
		case "battery": return new CropDetail(name, "Battery", 10, "tech", 1, 5, 5, 3, 0, 1, 1, 1, 1);
		case "headphones": return new CropDetail(name, "Earbuds", 10, "tech", 1, 5, 3, 3, 0, 1, 1, 1, 1);
		case "printer": return new CropDetail(name, "3D Printer", 10, "tech", 1, 5, 6, 3, 0, 1, 1, 1, 1);
		case "app": return new CropDetail(name, "App", 10, "tech", 1, 3, 4, 3, 0, 1, 1, 1, 1);
		case "drone": return new CropDetail(name, "Drone", 10, "tech", 1, 5, 3, 3, 0, 1, 1, 1, 1);
		case "frogbot": return new CropDetail(name, "Fwoggybot", 10, "tech", 2, 5, 4, 3, 0, 1, 1, 1, 1);
		case "coffee": return new CropDetail(name, "Coffee Machine", 10, "tech", 2, 5, 5, 3, 0, 1, 1, 1, 1);
		case "sicklebattery": return new CropDetail(name, "Sickle2 Battery", 10, "sickle2", 1, 5, 4, 0, 0, 1, 1, 1, 1);
		/* Rare */
		case "goldegg": return new CropDetail(name, "Golden Egg", 500, "egg", 1, 4, 4, 9999, 0, 1, 1, 1, 1);
		case "coconut": return new CropDetail(name, "Coconut", 500, "tree", 2, 10, 5, 200, 3, 0, 1, 0, 0);
		case "gmocorn": return new CropDetail(name, "GMO Corn", 500, "veg", 1, 5, 3, 200, 0, 1, 1, 1, 1);
		case "ultrarod": return new CropDetail(name, "Master Bait", 500, "rod", 1, 20, 2, 5000, 0, 1, 1, 1, 1, { catchLuck: 0.99, req: 0.5 });
		case "goodfood": return new CropDetail(name, "Delicious Food", 500, "food", 1, 0, 1, 5000, 0, 0, 0, 0, 0);
		case "notdrugs": return new CropDetail(name, "Funny Mushroom", 500, "mush", 1, 5, 3, 200, 3, 1, 1, 1, 1, { stickChance: 0.25, stickRange: [1, 4] });
		/* Enemy-Only */
		case "algae": return new CropDetail(name, "Algae", 0, "rice", 1, 2, 2, 10, 0, 0.6, 1, 0.2, 0, { noRot: true });
		case "kelp": return new CropDetail(name, "Kelp", 0, "rice", 1, 5, 5, 30, 0, 1, 1, 0.5, 0.05, { noRot: true });
		case "rock": return new CropDetail(name, "Rock", 0, "rock", 1, 5, 1, 0, 0, 1, 1, 1, 1);
		case "salt": return new CropDetail(name, "Salt", 0, "rock", 1, 30, 1, 0, 0, 1, 1, 1, 1);
		case "acorn": return new CropDetail(name, "Acorn", 0, "tree", 2, 6, 4, 6, 2, 0, 1, 1, 0);
		case "robobabby": return new CropDetail(name, "Byte Baby", 0, "babby", 1, 4, 4, 0, 0, 1, 1, 1, 1, { baby: "robo" });
		case "bpermit": return new CropDetail(name, "Building Permit", 0, "veg", 1, 4, 4, 10, 0, 1, 1, 1, 1);
		case "house": return new CropDetail(name, "House", 0, "veg", 2, 12, 5, 50, 0, 1, 1, 1, 1);
	}
}
debug.AllCrops = ["asparagus", "beet", "bellpepper", "carrot", "corn", "garlic", "ginger", "leek", "pineapple", "radish", "rhubarb", "spinach", "tomato", "apple", "apricot", "avocado", "banana", "blackberry", "grapes", "specialgrapes", "kiwi", "lemon", "mango", "beeR", "beeG", "beeB", "hbee", "rice", "arborio", "blackrice", "shortgrain", "chestnut", "spear", "rod", "goodrod", "metalrod", "net", "bignet", "fodder", "shiitake", "milkcap", "portobello", "greenshroom", "blackshroom", "poisnshroom", "egg", "quail", "goose", "turkey", "platypus", "battery", "headphones", "printer", "app", "drone", "frogbot", "coffee", "sicklebattery", "goldegg", "coconut", "gmocorn", "ultrarod", "goodfood", "notdrugs"];
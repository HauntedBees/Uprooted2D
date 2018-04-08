function CropDetail(name, price, type, size, time, frames, power, re, sp, su, au, wi, addtl) {
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
    switch(name) {
		/* Veggies */
		case "asparagus": return new CropDetail(name, 30, "veg", 1, 10, 4, 3, 3, 2, 1, 1, 0, { saltResist: 1 });
		case "beet": return new CropDetail(name, 15, "veg", 1, 1, 2, 1, 0, 0, 1, 2, 2, { waterResist: 1, saltResist: 2, saltClean: true, saltChance: 0.5 });
		case "bellpepper": return new CropDetail(name, 120, "veg", 1, 2, 3, 6, 0, 0, 1, 2, 0, { fireResist: 2, burnChance: 0.25 });
		case "carrot": return new CropDetail(name, 15, "veg", 1, 2, 2, 2, 0, 2, 1, 2, 1, { saltResist: 1, animal: "Rabbit" });
		case "corn": return new CropDetail(name, 45, "veg", 1, 5, 3, 5, 0, 0, 2, 1, 0, { saltResist: 2, saltClean: true, saltChance: 0.25 });
		case "garlic": return new CropDetail(name, 60, "veg", 1, 6, 3, 6, 0, 2, 1, 1, 0, { saltResist: 2, saltClean: true, saltChance: 0.1 });
		case "ginger": return new CropDetail(name, 30, "veg", 1, 5, 4, 4, 0, 1, 1, 2, 0, { fireResist: 2, burnChance: 0.5 });
		case "leek": return new CropDetail(name, 90, "veg", 1, 3, 3, 6, 0, 0, 0, 0, 2, { fireResist: 2, animal: "Duck" });
		case "pineapple": return new CropDetail(name, 75, "veg", 1, 12, 4, 8, 0, 1, 2, 0, 0, { waterResist: 2, fireResist: 1, burnChance: 0.1 });
		case "radish": return new CropDetail(name, 30, "veg", 1, 1, 2, 3, 0, 2, 0, 1, 0, { fireResist: 1 });
		case "rhubarb": return new CropDetail(name, 75, "veg", 1, 8, 4, 7, 0, 1, 0, 0, 0, { fireResist: 2, burnChance: 0.25 });
		case "spinach": return new CropDetail(name, 15, "veg", 1, 1, 2, 1, 0, 1, 0, 2, 0, { saltResist: 2, saltClean: true, saltChance: 0.5 });
		case "tomato": return new CropDetail(name, 15, "veg", 1, 3, 2, 2, 0, 0, 2, 0, 0, { fireResist: 2, saltClean: true, burnChance: 0.25 });
		/* Trees */
		case "apple": return new CropDetail(name, 30, "tree", 2, 5, 5, 2, 2, 1, 1, 2, 1, { waterResist: 2, saltResist: 1, animal: "Worm", saltChance: 0.25 });
		case "apricot": return new CropDetail(name, 180, "tree", 2, 24, 5, 9, 5, 2, 1, 0, 0, { waterResist: 1, fireResist: 1 });
		case "avocado": return new CropDetail(name, 240, "tree", 2, 21, 5, 8, 4, 2, 2, 0, 1, { fireResist: 1, saltResist: 1 });
		case "banana": return new CropDetail(name, 45, "tree", 2, 7, 5, 3, 3, 1, 1, 1, 1, { waterResist: 1, fireResist: 2, animal: "Monkey", burnChance: 0.25, treeSprite: "tropictree" });
		case "blackberry": return new CropDetail(name, 90, "tree", 2, 14, 5, 4, 1, 0, 2, 0, 0, { waterResist: 2 });
		case "grapes": return new CropDetail(name, 45, "tree", 2, 20, 5, 5, 4, 0, 0, 2, 0, { waterResist: 1, fireResist: 1 });
		case "specialgrapes": return new CropDetail(name, 90, "tree", 2, 4, 5, 5, 3, 0, 0, 2, 0, { waterResist: 1, fireResist: 1 });
		case "kiwi": return new CropDetail(name, 795, "tree", 2, 40, 5, 10, 1, 0, 2, 0, 1, { waterResist: 1, fireResist: 1 });
		case "lemon": return new CropDetail(name, 105, "tree", 2, 5, 5, 4, 2, 1, 2, 1, 0, { waterResist: 2, saltResist: 2, saltChance: 0.25 });
		case "mango": return new CropDetail(name, 15, "tree", 2, 3, 5, 1, 2, 0, 2, 1, 0, { waterResist: 1, fireResist: 1, burnChance: 0.25 });
		/* Bees */
		case "beeR": return new CropDetail(name, 420, "bee", 1, 999, 2, 7, 999, 1, 1, 2, 0, { stickChance: 1, showSeed: true, animal: "Bear" });
		case "beeG": return new CropDetail(name, 45, "bee", 1, 999, 2, 3, 999, 1, 2, 1, 0, { stickChance: 2, showSeed: true, animal: "Bear" });
		case "beeB": return new CropDetail(name, 180, "bee", 1, 999, 2, 5, 999, 2, 1, 1, 0, { stickChance: 3, showSeed: true, animal: "Bear" });
		/* Rice */
		case "rice": return new CropDetail(name, 90, "rice", 1, 9, 4, 8, 0, 1, 1, 0, 1, { animal: "Duck", saltChance: 0.15 });
		case "arborio": return new CropDetail(name, 105, "rice", 1, 11, 4, 9, 0, 1, 1, 0, 1, { animal: "Duck" });
		case "blackrice": return new CropDetail(name, 75, "rice", 1, 7, 4, 7, 0, 1, 1, 0, 1, { animal: "Duck", burnChance: 0.15 });
		case "shortgrain": return new CropDetail(name, 75, "rice", 1, 4, 4, 6, 0, 2, 1, 0, 1, { animal: "Duck" });
		case "chestnut": return new CropDetail(name, 120, "rice", 1, 14, 4, 10, 0, 0, 1, 1, 2);
		/* Fishing */
		case "spear": return new CropDetail(name, 210, "spear", 1, 0, 2, 5, 0, 1, 1, 1, 1, { animal: "Bear" });
		case "rod": return new CropDetail(name, 15, "rod", 1, 10, 2, 2, 0, 1, 1, 1, 0, { animal: "Bear" });
		case "goodrod": return new CropDetail(name, 15, "rod", 1, 10, 2, 4, 0, 1, 1, 1, 0, { animal: "Bear" });
		case "metalrod": return new CropDetail(name, 45, "rod", 1, 10, 2, 6, 0, 1, 1, 1, 0, { animal: "Bear" });
		case "net": return new CropDetail(name, 105, "water", 1, -1, 2, 5, 0, 1, 1, 1, 0, { animal: "Bear", rotten: true });
		case "bignet": return new CropDetail(name, 840, "water", 2, -1, 2, 10, 0, 1, 1, 1, 0, { animal: "Bear", rotten: true });
		/* Cow */
		case "fodder": return new CropDetail(name, 120, "food", 1, 0, 1, 4, 0, 1, 1, 1, 1, { saltClean: true });
		/* Mushrooms */
		case "shiitake": return new CropDetail(name, 75, "mush", 1, 6, 3, 5, 3, 1, 1, 1, 1, { animal: "Slug" });
		case "milkcap": return new CropDetail(name, 375, "mush", 1, 20, 3, 8, 1, 1, 1, 1, 1, { animal: "Slug" });
		case "portobello": return new CropDetail(name, 60, "mush", 1, 3, 3, 4, 3, 1, 1, 1, 1, { animal: "Slug", saltChance: 0.25 });
		case "greenshroom": return new CropDetail(name, 90, "mush", 1, 7, 3, 6, 4, 1, 1, 1, 1, { animal: "Slug" });
		case "blackshroom": return new CropDetail(name, 180, "mush", 1, 10, 3, 7, 2, 1, 1, 1, 1, { animal: "Slug" });
		case "poisnshroom": return new CropDetail(name, 345, "mush", 1, 6, 3, 10, 5, 1, 1, 1, 1, { animal: "Slug", saltChance: 0.75, burnChance: 0.75 });
		/* Eggs */
		case "egg": return new CropDetail(name, 15, "egg", 1, 7, 4, 3, 0, 1, 1, 1, 1);
		case "quail": return new CropDetail(name, 15, "egg", 1, 6, 4, 2, 0, 1, 1, 1, 1);
		case "goose": return new CropDetail(name, 30, "egg", 1, 11, 4, 5, 0, 1, 1, 1, 1);
		case "turkey": return new CropDetail(name, 15, "egg", 1, 10, 4, 4, 0, 1, 1, 1, 1);
		case "platypus": return new CropDetail(name, 255, "egg", 1, 4, 4, 9, 0, 1, 1, 1, 1);
		/* Technology */
		case "battery": return new CropDetail(name, 45, "tech", 1, 5, 5, 5, 0, 2, 2, 2, 2);
		case "headphones": return new CropDetail(name, 15, "tech", 1, 3, 3, 2, 0, 2, 2, 2, 2);
		case "printer": return new CropDetail(name, 60, "tech", 1, 6, 6, 4, 4, 2, 2, 2, 2, { showSeed: true });
		case "app": return new CropDetail(name, 15, "tech", 1, 3, 4, 3, 0, 2, 2, 2, 2);
		case "drone": return new CropDetail(name, 105, "tech", 1, 5, 3, 7, 0, 2, 2, 2, 2);
		case "frogbot": return new CropDetail(name, 135, "tech", 2, 8, 4, 9, 0, 2, 2, 2, 2, { animal: "Frog" });
		case "coffee": return new CropDetail(name, 165, "tech", 2, 10, 5, 10, 0, 2, 2, 2, 2, { showSeed: true });
		case "sicklebattery": return new CropDetail(name, 100, "sickle2", 1, 5, 4, 0, 0, 2, 2, 2, 2);
		/* Water */
		case "holywater": return new CropDetail(name, 1000, "moist", 1, 0, 1, 2, 0, 2, 2, 2, 2);
		case "holyjug": return new CropDetail(name, 6000, "moist", 2, 0, 1, 3, 0, 2, 2, 2, 2);
		/* Rare */
		case "goldegg": return new CropDetail(name, 500, "egg", 1, 4, 4, 11, 0, 1, 1, 1, 1);
		case "coconut": return new CropDetail(name, 500, "tree", 2, 10, 5, 11, 3, 1, 2, 0, 0, { waterResist: 2, fireResist: 2, treeSprite: "tropictree" });
		case "gmocorn": return new CropDetail(name, 500, "veg", 1, 5, 3, 11, 0, 1, 1, 1, 2, { waterResist: 2, fireResist: 2, saltResist: 2, saltClean: true });
		case "ultrarod": return new CropDetail(name, 500, "rod", 1, 20, 2, 11, 0, 1, 1, 1, 1, { animal: "Bear" });
		case "goodfood": return new CropDetail(name, 500, "food", 1, 0, 1, 11, 0, 1, 1, 1, 1);
		case "notdrugs": return new CropDetail(name, 500, "mush", 1, 5, 3, 11, 3, 1, 1, 2, 1, { stickChance: 2, animal: "Slug" });
		case "lotus": return new CropDetail(name, 500, "rice", 1, 30, 5, 11, 0, 2, 2, 1, 0);
		case "hbee": return new CropDetail(name, 500, "bee", 1, 999, 2, 11, 999, 1, 1, 1, 2, { stickChance: 3, animal: "Bear" });
		/* Enemy-Only */
		case "algae": return new CropDetail(name, 0, "rice", 1, 2, 2, 1, 0, 1, 2, 1, 0, { noRot: true, saltChance: 0.5 });
		case "kelp": return new CropDetail(name, 0, "rice", 1, 5, 5, 3, 0, 2, 2, 1, 1, { noRot: true, saltChance: 0.5 });
		case "rock": return new CropDetail(name, 0, "rock", 1, 5, 1, 0, 0, 1, 1, 1, 1);
		case "tire": return new CropDetail(name, 0, "rock", 1, 8, 1, 0, 0, 1, 1, 1, 1);
		case "engine": return new CropDetail(name, 0, "rock", 1, 10, 1, 0, 0, 1, 1, 1, 1);
		case "salt": return new CropDetail(name, 0, "rock", 1, 30, 1, 0, 0, 1, 1, 1, 1);
		case "acorn": return new CropDetail(name, 0, "tree", 2, 6, 4, 3, 2, 0, 1, 1, 0);
		case "robobabby": return new CropDetail(name, 0, "babby", 1, 4, 4, 0, 0, 1, 1, 1, 1, { baby: "robo" });
		case "bpermit": return new CropDetail(name, 0, "veg", 1, 4, 4, 6, 0, 1, 1, 1, 1);
		case "house": return new CropDetail(name, 0, "veg", 2, 12, 5, 8, 0, 1, 1, 1, 1);
		case "lightbulb": return new CropDetail(name, 0, "tech", 1, 1, 2, 4, 0, 1, 1, 1, 1);
		case "download": return new CropDetail(name, 0, "tech", 1, 10, 5, 5, 0, 1, 1, 1, 1);
		case "cloud": return new CropDetail(name, 0, "cloud", 2, 100, 1, 6, 0, 1, 1, 1, 1);
		case "porcini": return new CropDetail(name, 0, "mush", 1, 5, 3, 5, 3, 1, 1, 1, 1);
		case "arborioB": return new CropDetail(name, 0, "rice", 1, 5, 4, 5, 0, 1, 1, 0, 1);
		case "timebomb": return new CropDetail(name, 0, "veg", 1, 12, 4, 10, 0, 1, 1, 1, 1);
		case "shotgun": return new CropDetail(name, 0, "veg", 1, 5, 4, 9, 0, 1, 1, 1, 1);
		case "burrito": return new CropDetail(name, 0, "veg", 1, 10, 1, 7, 0, 1, 1, 1, 1);
		case "dango": return new CropDetail(name, 0, "veg", 1, 5, 1, 6, 0, 1, 1, 1, 1);
		case "taco": return new CropDetail(name, 0, "veg", 1, 8, 1, 8, 0, 1, 1, 1, 1);
		case "kombucha": return new CropDetail(name, 0, "veg", 1, 30, 1, 10, 0, 1, 1, 1, 1);
		case "cheese": return new CropDetail(name, 0, "veg", 1, 4, 1, 5, 0, 1, 1, 1, 1);
		case "batterysalt": return new CropDetail(name, 0, "veg", 1, 6, 3, 7, 0, 1, 1, 1, 1, { saltChance: 0.5 });
		case "gastank": return new CropDetail(name, 0, "tech", 1, 6, 4, 7, 0, 1, 1, 1, 1, { burnChance: 0.25 });
		case "airfilter": return new CropDetail(name, 0, "tech", 1, 6, 5, 7, 0, 1, 1, 1, 1);
		case "dipstick": return new CropDetail(name, 0, "tech", 1, 3, 3, 7, 0, 1, 1, 1, 1);
		case "cacao": return new CropDetail(name, 0, "tree", 2, 10, 5, 7, 3, 1, 1, 1, 1);
		case "bananaPill": return new CropDetail(name, 0, "veg", 1, 4, 4, 7, 0, 0, 1, 0, 0);
		/* Beckett Nerfs */
		case "mushNerf": return new CropDetail(name, 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1);
		case "riceNerf": return new CropDetail(name, 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1);
		case "treeNerf": return new CropDetail(name, 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1);
		case "vegNerf": return new CropDetail(name, 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1);
		case "fishNerf": return new CropDetail(name, 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1);
		case "beeNerf": return new CropDetail(name, 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1);
		case "eggNerf": return new CropDetail(name, 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1);
		case "reNerf": return new CropDetail(name, 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1);
		/* WACG Cards */
		case "char0": return new CropDetail(name, 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1);
		case "char1": return new CropDetail(name, 0, "card", 1, 999, 1, 9, 0, 1, 1, 1, 1);
		case "char2": return new CropDetail(name, 0, "card", 1, 999, 1, 8, 0, 1, 1, 1, 1);
		case "char3": return new CropDetail(name, 0, "card", 1, 999, 1, 7, 0, 1, 1, 1, 1);
		case "char4": return new CropDetail(name, 0, "card", 1, 999, 1, 6, 0, 1, 1, 1, 1);
		case "elem0": return new CropDetail(name, 0, "card", 1, 999, 1, 5, 0, 1, 1, 1, 1);
		case "elem1": return new CropDetail(name, 0, "card", 1, 999, 1, 5, 0, 1, 1, 1, 1);
		case "elem2": return new CropDetail(name, 0, "card", 1, 999, 1, 5, 0, 1, 1, 1, 1);
		case "elem3": return new CropDetail(name, 0, "card", 1, 999, 1, 5, 0, 1, 1, 1, 1);
		case "fx0": return new CropDetail(name, 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1);
		case "fx1": return new CropDetail(name, 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1);
		case "fx2": return new CropDetail(name, 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1);
		case "fx3": return new CropDetail(name, 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1);
		case "fx4": return new CropDetail(name, 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1);
		/* Food2 */
		case "food2orig": return new CropDetail(name, 0, "food2", 1, 4, 5, 7, 0, 1, 1, 1, 1);
		case "food2classic": return new CropDetail(name, 0, "food2", 1, 4, 5, 7, 0, 1, 1, 1, 1);
		case "food2kelp": return new CropDetail(name, 0, "food2", 1, 4, 5, 7, 0, 1, 1, 1, 1, { saltChance: 0.25 });
		case "food2coffee": return new CropDetail(name, 0, "food2", 1, 4, 5, 8, 0, 1, 1, 1, 1, { burnChance: 0.15 });
		case "food2salsa": return new CropDetail(name, 0, "food2", 1, 4, 5, 9, 0, 1, 1, 1, 1, { burnChance: 0.75 });
		case "food2gamer": return new CropDetail(name, 0, "food2", 1, 4, 5, 7, 0, 1, 1, 1, 1, { saltChance: 0.25 });
		case "food2cookie": return new CropDetail(name, 0, "food2", 1, 4, 5, 8, 0, 1, 1, 1, 1);
		case "food2black": return new CropDetail(name, 0, "food2", 1, 4, 5, 9, 0, 1, 1, 1, 1);
		case "food2purple": return new CropDetail(name, 0, "food2", 1, 4, 5, 9, 0, 1, 1, 1, 1);
		case "food2crystal": return new CropDetail(name, 0, "food2", 1, 4, 5, 10, 0, 1, 1, 1, 1);
		case "food2powder": return new CropDetail(name, 0, "food2", 1, 1, 1, 5, 0, 1, 1, 1, 1);
		case "food2bar": return new CropDetail(name, 0, "food2", 1, 5, 3, 8, 0, 1, 1, 1, 1);
		case "food2barChoc": return new CropDetail(name, 0, "food2", 1, 5, 3, 9, 0, 1, 1, 1, 1);
		case "soybean": return new CropDetail(name, 0, "veg", 1, 10, 5, 8, 0, 0, 1, 1, 0);
		case "conveyorEnd": return new CropDetail(name, 0, "card", 1, 999, 1, 10, 0, 0, 0, 0, 0);
		case "soybaby": return new CropDetail(name, 0, "babby", 1, 5, 5, 0, 0, 1, 1, 1, 1, { baby: "soyChild" });
	}
}
debug.AllCrops = ["asparagus", "beet", "bellpepper", "carrot", "corn", "garlic", "ginger", "leek", "pineapple", "radish", "rhubarb", "spinach", "tomato", "apple", "apricot", "avocado", "banana", "blackberry", "grapes", "specialgrapes", "kiwi", "lemon", "mango", "beeR", "beeG", "beeB", "rice", "arborio", "blackrice", "shortgrain", "chestnut", "spear", "rod", "goodrod", "metalrod", "net", "bignet", "fodder", "shiitake", "milkcap", "portobello", "greenshroom", "blackshroom", "poisnshroom", "egg", "quail", "goose", "turkey", "platypus", "battery", "headphones", "printer", "app", "drone", "frogbot", "coffee", "sicklebattery", "holywater", "holyjug", "goldegg", "coconut", "gmocorn", "ultrarod", "goodfood", "notdrugs", "lotus", "hbee"];
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
		case "asparagus": return new CropDetail(name, 30, "veg", 1, 10, 4, 3, 3, 2, 1, 1, 0, { saltResist: 1, sound: "light" });
		case "beet": return new CropDetail(name, 15, "veg", 1, 1, 2, 1, 0, 0, 1, 2, 2, { waterResist: 1, saltResist: 2, saltClean: true, saltChance: 0.5, sound: "hard" });
		case "bellpepper": return new CropDetail(name, 120, "veg", 1, 2, 3, 6, 0, 0, 1, 2, 0, { fireResist: 2, burnChance: 0.25, sound: "hollow" });
		case "carrot": return new CropDetail(name, 15, "veg", 1, 2, 2, 2, 0, 2, 1, 2, 1, { saltResist: 1, animal: "Rabbit", sound: "hard" });
		case "corn": return new CropDetail(name, 45, "veg", 1, 5, 3, 5, 0, 0, 2, 1, 0, { saltResist: 2, saltClean: true, saltChance: 0.25, sound: "hard" });
		case "garlic": return new CropDetail(name, 60, "veg", 1, 6, 3, 6, 0, 2, 1, 1, 0, { saltResist: 2, saltClean: true, saltChance: 0.1, sound: "hard" });
		case "ginger": return new CropDetail(name, 30, "veg", 1, 5, 4, 4, 0, 1, 1, 2, 0, { fireResist: 2, burnChance: 0.5, sound: "hard" });
		case "leek": return new CropDetail(name, 90, "veg", 1, 3, 3, 6, 0, 0, 0, 0, 2, { fireResist: 2, animal: "Duck", sound: "light" });
		case "pineapple": return new CropDetail(name, 75, "veg", 1, 12, 4, 8, 0, 1, 2, 0, 0, { waterResist: 2, fireResist: 1, burnChance: 0.1, sound: "hard" });
		case "radish": return new CropDetail(name, 30, "veg", 1, 1, 2, 3, 0, 2, 0, 1, 0, { fireResist: 1, sound: "light" });
		case "rhubarb": return new CropDetail(name, 75, "veg", 1, 8, 4, 7, 0, 1, 0, 0, 0, { fireResist: 2, burnChance: 0.25, sound: "light" });
		case "spinach": return new CropDetail(name, 15, "veg", 1, 1, 2, 1, 0, 1, 0, 2, 0, { saltResist: 2, saltClean: true, saltChance: 0.5, sound: "light" });
		case "tomato": return new CropDetail(name, 15, "veg", 1, 3, 2, 2, 0, 0, 2, 0, 0, { fireResist: 2, saltClean: true, burnChance: 0.25, sound: "squishy" });
		/* Trees */
		case "apple": return new CropDetail(name, 30, "tree", 2, 5, 5, 2, 2, 1, 1, 2, 1, { waterResist: 2, saltResist: 1, animal: "Worm", saltChance: 0.25, sound: "hard" });
		case "apricot": return new CropDetail(name, 180, "tree", 2, 24, 5, 9, 5, 2, 1, 0, 0, { waterResist: 1, fireResist: 1, sound: "hard" });
		case "avocado": return new CropDetail(name, 240, "tree", 2, 21, 5, 8, 4, 2, 2, 0, 1, { fireResist: 1, saltResist: 1, sound: "squishy" });
		case "banana": return new CropDetail(name, 45, "tree", 2, 7, 5, 3, 3, 1, 1, 1, 1, { waterResist: 1, fireResist: 2, animal: "Monkey", burnChance: 0.25, treeSprite: "tropictree", sound: "squishy" });
		case "blackberry": return new CropDetail(name, 90, "tree", 2, 14, 5, 4, 1, 0, 2, 0, 0, { waterResist: 2, sound: "squishy" });
		case "grapes": return new CropDetail(name, 45, "tree", 2, 20, 5, 5, 4, 0, 0, 2, 0, { waterResist: 1, fireResist: 1, sound: "squishy" });
		case "specialgrapes": return new CropDetail(name, 90, "tree", 2, 4, 5, 5, 3, 0, 0, 2, 0, { waterResist: 1, fireResist: 1, sound: "squishy" });
		case "kiwi": return new CropDetail(name, 795, "tree", 2, 40, 5, 10, 1, 0, 2, 0, 1, { waterResist: 1, fireResist: 1, sound: "squishy" });
		case "lemon": return new CropDetail(name, 105, "tree", 2, 5, 5, 4, 2, 1, 2, 1, 0, { waterResist: 2, saltResist: 2, saltChance: 0.25, sound: "squishy" });
		case "mango": return new CropDetail(name, 15, "tree", 2, 3, 5, 1, 2, 0, 2, 1, 0, { waterResist: 1, fireResist: 1, burnChance: 0.25, sound: "hard" });
		/* Bees */
		case "beeR": return new CropDetail(name, 420, "bee", 1, 999, 2, 7, 999, 1, 1, 2, 0, { stickChance: 1, showSeed: true, animal: "Bear", sound: "bee" });
		case "beeG": return new CropDetail(name, 45, "bee", 1, 999, 2, 3, 999, 1, 2, 1, 0, { stickChance: 2, showSeed: true, animal: "Bear", sound: "bee" });
		case "beeB": return new CropDetail(name, 180, "bee", 1, 999, 2, 5, 999, 2, 1, 1, 0, { stickChance: 3, showSeed: true, animal: "Bear", sound: "bee" });
		/* Rice */
		case "rice": return new CropDetail(name, 90, "rice", 1, 9, 4, 8, 0, 1, 1, 0, 1, { animal: "Duck", saltChance: 0.15, sound: "light" });
		case "arborio": return new CropDetail(name, 105, "rice", 1, 11, 4, 9, 0, 1, 1, 0, 1, { animal: "Duck", sound: "light" });
		case "blackrice": return new CropDetail(name, 75, "rice", 1, 7, 4, 7, 0, 1, 1, 0, 1, { animal: "Duck", burnChance: 0.15, sound: "light" });
		case "shortgrain": return new CropDetail(name, 75, "rice", 1, 4, 4, 6, 0, 2, 1, 0, 1, { animal: "Duck", sound: "light" });
		case "chestnut": return new CropDetail(name, 120, "rice", 1, 14, 4, 10, 0, 0, 1, 1, 2, { sound: "light" });
		/* Fishing */
		case "spear": return new CropDetail(name, 210, "spear", 1, 0, 2, 5, 0, 1, 1, 1, 1, { animal: "Bear", sound: "wet" });
		case "rod": return new CropDetail(name, 15, "rod", 1, 10, 2, 2, 0, 1, 1, 1, 0, { animal: "Bear", sound: "wet" });
		case "goodrod": return new CropDetail(name, 15, "rod", 1, 10, 2, 4, 0, 1, 1, 1, 0, { animal: "Bear", sound: "wet" });
		case "metalrod": return new CropDetail(name, 45, "rod", 1, 10, 2, 6, 0, 1, 1, 1, 0, { animal: "Bear", sound: "wet" });
		case "net": return new CropDetail(name, 105, "water", 1, -1, 2, 5, 0, 1, 1, 1, 0, { animal: "Bear", rotten: true, sound: "wet" });
		case "bignet": return new CropDetail(name, 840, "water", 2, -1, 2, 10, 0, 1, 1, 1, 0, { animal: "Bear", rotten: true, sound: "wet" });
		/* Cow */
		case "fodder": return new CropDetail(name, 120, "food", 1, 0, 1, 4, 0, 1, 1, 1, 1, { saltClean: true, sound: "none" });
		/* Mushrooms */
		case "shiitake": return new CropDetail(name, 75, "mush", 1, 6, 3, 5, 3, 1, 1, 1, 1, { animal: "Slug", sound: "light" });
		case "milkcap": return new CropDetail(name, 375, "mush", 1, 20, 3, 8, 1, 1, 1, 1, 1, { animal: "Slug", sound: "light" });
		case "portobello": return new CropDetail(name, 60, "mush", 1, 3, 3, 4, 3, 1, 1, 1, 1, { animal: "Slug", saltChance: 0.25, sound: "light" });
		case "greenshroom": return new CropDetail(name, 90, "mush", 1, 7, 3, 6, 4, 1, 1, 1, 1, { animal: "Slug", sound: "light" });
		case "blackshroom": return new CropDetail(name, 180, "mush", 1, 10, 3, 7, 2, 1, 1, 1, 1, { animal: "Slug", sound: "light" });
		case "poisnshroom": return new CropDetail(name, 345, "mush", 1, 6, 3, 10, 5, 1, 1, 1, 1, { animal: "Slug", saltChance: 0.75, burnChance: 0.75, sound: "light" });
		/* Eggs */
		case "egg": return new CropDetail(name, 15, "egg", 1, 7, 4, 3, 0, 1, 1, 1, 1, { sound: "bird" });
		case "quail": return new CropDetail(name, 15, "egg", 1, 6, 4, 2, 0, 1, 1, 1, 1, { sound: "bird" });
		case "goose": return new CropDetail(name, 30, "egg", 1, 11, 4, 5, 0, 1, 1, 1, 1, { sound: "bird" });
		case "turkey": return new CropDetail(name, 15, "egg", 1, 10, 4, 4, 0, 1, 1, 1, 1, { sound: "bird" });
		case "platypus": return new CropDetail(name, 255, "egg", 1, 4, 4, 9, 0, 1, 1, 1, 1, { sound: "bird" });
		/* Technology */
		case "battery": return new CropDetail(name, 45, "tech", 1, 5, 5, 5, 0, 2, 2, 2, 2, { sound: "light" });
		case "headphones": return new CropDetail(name, 15, "tech", 1, 3, 3, 2, 0, 2, 2, 2, 2, { sound: "light" });
		case "printer": return new CropDetail(name, 60, "tech", 1, 6, 6, 4, 4, 2, 2, 2, 2, { showSeed: true, sound: "hollow" });
		case "app": return new CropDetail(name, 15, "tech", 1, 3, 4, 3, 0, 2, 2, 2, 2, { sound: "beep" });
		case "drone": return new CropDetail(name, 105, "tech", 1, 5, 3, 7, 0, 2, 2, 2, 2, { sound: "beep" });
		case "frogbot": return new CropDetail(name, 135, "tech", 2, 8, 4, 9, 0, 2, 2, 2, 2, { animal: "Frog", sound: "beep" });
		case "coffee": return new CropDetail(name, 165, "tech", 2, 10, 5, 10, 0, 2, 2, 2, 2, { showSeed: true, sound: "wet" });
		case "sicklebattery": return new CropDetail(name, 100, "sickle2", 1, 5, 4, 0, 0, 2, 2, 2, 2, { sound: "none" });
		/* Water */
		case "holywater": return new CropDetail(name, 1000, "moist", 1, 0, 1, 2, 0, 2, 2, 2, 2, { sound: "none" });
		case "holyjug": return new CropDetail(name, 6000, "moist", 2, 0, 1, 3, 0, 2, 2, 2, 2, { sound: "none" });
		/* Rare */
		case "goldegg": return new CropDetail(name, 500, "egg", 1, 4, 4, 11, 0, 1, 1, 1, 1, { sound: "bird" });
		case "coconut": return new CropDetail(name, 500, "tree", 2, 10, 5, 11, 3, 1, 2, 0, 0, { waterResist: 2, fireResist: 2, treeSprite: "tropictree", sound: "hard" });
		case "gmocorn": return new CropDetail(name, 500, "veg", 1, 5, 3, 11, 0, 1, 1, 1, 2, { waterResist: 2, fireResist: 2, saltResist: 2, saltClean: true, sound: "hard" });
		case "ultrarod": return new CropDetail(name, 500, "rod", 1, 20, 2, 11, 0, 1, 1, 1, 1, { animal: "Bear", sound: "wet" });
		case "goodfood": return new CropDetail(name, 500, "food", 1, 0, 1, 11, 0, 1, 1, 1, 1, { sound: "none" });
		case "notdrugs": return new CropDetail(name, 500, "mush", 1, 5, 3, 11, 3, 1, 1, 2, 1, { stickChance: 2, animal: "Slug", sound: "light" });
		case "lotus": return new CropDetail(name, 500, "rice", 1, 30, 5, 11, 0, 2, 2, 1, 0, { sound: "hollow" });
		case "hbee": return new CropDetail(name, 500, "bee", 1, 999, 2, 11, 999, 1, 1, 1, 2, { stickChance: 3, animal: "Bear", sound: "bee" });
		case "saffron": return new CropDetail(name, 10000, "veg", 1, 3, 3, 11, 0, 2, 2, 2, 2, { waterResist: 2, fireResist: 2, saltResist: 2, stickChance: 1, sound: "light" });
		/* Enemy-Only */
		case "algae": return new CropDetail(name, 0, "rice", 1, 2, 2, 1, 0, 1, 2, 1, 0, { noRot: true, saltChance: 0.5, sound: "light" });
		case "kelp": return new CropDetail(name, 0, "rice", 1, 5, 5, 3, 0, 2, 2, 1, 1, { noRot: true, saltChance: 0.5, sound: "light" });
		case "rock": return new CropDetail(name, 0, "rock", 1, 5, 1, 0, 0, 1, 1, 1, 1, { sound: "hard" });
		case "tire": return new CropDetail(name, 0, "rock", 1, 8, 1, 0, 0, 1, 1, 1, 1, { sound: "hard" });
		case "engine": return new CropDetail(name, 0, "rock", 1, 10, 1, 0, 0, 1, 1, 1, 1, { sound: "hard" });
		case "salt": return new CropDetail(name, 0, "rock", 1, 30, 1, 0, 0, 1, 1, 1, 1, { sound: "light" });
		case "acorn": return new CropDetail(name, 0, "tree", 2, 6, 4, 6, 2, 0, 1, 1, 0, { sound: "light" });
		case "robobabby": return new CropDetail(name, 0, "babby", 1, 4, 4, 0, 0, 1, 1, 1, 1, { baby: "robo", sound: "beep" });
		case "bpermit": return new CropDetail(name, 0, "veg", 1, 4, 4, 6, 0, 1, 1, 1, 1, { sound: "light" });
		case "house": return new CropDetail(name, 0, "veg", 2, 12, 5, 8, 0, 1, 1, 1, 1, { sound: "hollow" });
		case "lightbulb": return new CropDetail(name, 0, "tech", 1, 1, 2, 4, 0, 1, 1, 1, 1, { sound: "light" });
		case "download": return new CropDetail(name, 0, "tech", 1, 10, 5, 5, 0, 1, 1, 1, 1, { sound: "beep" });
		case "cloud": return new CropDetail(name, 0, "cloud", 2, 100, 1, 6, 0, 1, 1, 1, 1, { sound: "beep" });
		case "porcini": return new CropDetail(name, 0, "mush", 1, 5, 3, 5, 3, 1, 1, 1, 1, { sound: "light" });
		case "arborioB": return new CropDetail(name, 0, "rice", 1, 5, 4, 5, 0, 1, 1, 0, 1, { sound: "light" });
		case "timebomb": return new CropDetail(name, 0, "veg", 1, 12, 4, 10, 0, 1, 1, 1, 1, { sound: "hard" });
		case "shotgun": return new CropDetail(name, 0, "veg", 1, 5, 4, 9, 0, 1, 1, 1, 1, { sound: "hollow" });
		case "burrito": return new CropDetail(name, 0, "veg", 1, 10, 1, 7, 0, 1, 1, 1, 1, { sound: "light" });
		case "dango": return new CropDetail(name, 0, "veg", 1, 5, 1, 6, 0, 1, 1, 1, 1, { sound: "light" });
		case "taco": return new CropDetail(name, 0, "veg", 1, 8, 1, 8, 0, 1, 1, 1, 1, { sound: "light" });
		case "kombucha": return new CropDetail(name, 0, "veg", 1, 30, 1, 10, 0, 1, 1, 1, 1, { sound: "light" });
		case "cheese": return new CropDetail(name, 0, "veg", 1, 4, 1, 5, 0, 1, 1, 1, 1, { sound: "light" });
		case "batterysalt": return new CropDetail(name, 0, "veg", 1, 6, 3, 7, 0, 1, 1, 1, 1, { saltChance: 0.5, sound: "hard" });
		case "gastank": return new CropDetail(name, 0, "tech", 1, 6, 4, 7, 0, 1, 1, 1, 1, { burnChance: 0.25, sound: "wet" });
		case "airfilter": return new CropDetail(name, 0, "tech", 1, 6, 5, 7, 0, 1, 1, 1, 1, { sound: "light" });
		case "dipstick": return new CropDetail(name, 0, "tech", 1, 3, 3, 7, 0, 1, 1, 1, 1, { sound: "light" });
		case "cacao": return new CropDetail(name, 0, "tree", 2, 10, 5, 7, 3, 1, 1, 1, 1, { sound: "hard" });
		case "bananaPill": return new CropDetail(name, 0, "veg", 1, 4, 4, 7, 0, 0, 1, 0, 0, { sound: "light" });
		/* Beckett Nerfs */
		case "mushNerf": return new CropDetail(name, 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1, { sound: "beep" });
		case "riceNerf": return new CropDetail(name, 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1, { sound: "beep" });
		case "treeNerf": return new CropDetail(name, 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1, { sound: "beep" });
		case "vegNerf": return new CropDetail(name, 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1, { sound: "beep" });
		case "fishNerf": return new CropDetail(name, 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1, { sound: "beep" });
		case "beeNerf": return new CropDetail(name, 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1, { sound: "beep" });
		case "eggNerf": return new CropDetail(name, 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1, { sound: "beep" });
		case "reNerf": return new CropDetail(name, 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1, { sound: "beep" });
		/* WACG Cards */
		case "char0": return new CropDetail(name, 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1, { sound: "light" });
		case "char1": return new CropDetail(name, 0, "card", 1, 999, 1, 9, 0, 1, 1, 1, 1, { sound: "light" });
		case "char2": return new CropDetail(name, 0, "card", 1, 999, 1, 8, 0, 1, 1, 1, 1, { sound: "light" });
		case "char3": return new CropDetail(name, 0, "card", 1, 999, 1, 7, 0, 1, 1, 1, 1, { sound: "light" });
		case "char4": return new CropDetail(name, 0, "card", 1, 999, 1, 6, 0, 1, 1, 1, 1, { sound: "light" });
		case "elem0": return new CropDetail(name, 0, "card", 1, 999, 1, 5, 0, 1, 1, 1, 1, { sound: "light" });
		case "elem1": return new CropDetail(name, 0, "card", 1, 999, 1, 5, 0, 1, 1, 1, 1, { sound: "light" });
		case "elem2": return new CropDetail(name, 0, "card", 1, 999, 1, 5, 0, 1, 1, 1, 1, { sound: "light" });
		case "elem3": return new CropDetail(name, 0, "card", 1, 999, 1, 5, 0, 1, 1, 1, 1, { sound: "light" });
		case "fx0": return new CropDetail(name, 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1, { sound: "light" });
		case "fx1": return new CropDetail(name, 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1, { sound: "light" });
		case "fx2": return new CropDetail(name, 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1, { sound: "light" });
		case "fx3": return new CropDetail(name, 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1, { sound: "light" });
		case "fx4": return new CropDetail(name, 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1, { sound: "light" });
		/* Food2 */
		case "food2orig": return new CropDetail(name, 0, "food2", 1, 4, 5, 7, 0, 1, 1, 1, 1, { sound: "wet" });
		case "food2classic": return new CropDetail(name, 0, "food2", 1, 4, 5, 7, 0, 1, 1, 1, 1, { sound: "wet" });
		case "food2kelp": return new CropDetail(name, 0, "food2", 1, 4, 5, 7, 0, 1, 1, 1, 1, { saltChance: 0.25, sound: "wet" });
		case "food2coffee": return new CropDetail(name, 0, "food2", 1, 4, 5, 8, 0, 1, 1, 1, 1, { burnChance: 0.15, sound: "wet" });
		case "food2salsa": return new CropDetail(name, 0, "food2", 1, 4, 5, 9, 0, 1, 1, 1, 1, { burnChance: 0.75, sound: "wet" });
		case "food2gamer": return new CropDetail(name, 0, "food2", 1, 4, 5, 7, 0, 1, 1, 1, 1, { saltChance: 0.25, sound: "wet" });
		case "food2cookie": return new CropDetail(name, 0, "food2", 1, 4, 5, 8, 0, 1, 1, 1, 1, { sound: "wet" });
		case "food2black": return new CropDetail(name, 0, "food2", 1, 4, 5, 9, 0, 1, 1, 1, 1, { sound: "wet" });
		case "food2purple": return new CropDetail(name, 0, "food2", 1, 4, 5, 9, 0, 1, 1, 1, 1, { sound: "wet" });
		case "food2crystal": return new CropDetail(name, 0, "food2", 1, 4, 5, 10, 0, 1, 1, 1, 1, { sound: "wet" });
		case "food2powder": return new CropDetail(name, 0, "food2", 1, 1, 1, 5, 0, 1, 1, 1, 1, { sound: "hollow" });
		case "food2bar": return new CropDetail(name, 0, "food2", 1, 5, 3, 8, 0, 1, 1, 1, 1, { sound: "hard" });
		case "food2barChoc": return new CropDetail(name, 0, "food2", 1, 5, 3, 9, 0, 1, 1, 1, 1, { sound: "hard" });
		case "soybean": return new CropDetail(name, 0, "veg", 1, 10, 5, 8, 0, 1, 2, 2, 0, { sound: "light" });
		case "conveyorEnd": return new CropDetail(name, 0, "card", 1, 999, 1, 10, 0, 0, 0, 0, 0, { sound: "none" });
		case "soybaby": return new CropDetail(name, 0, "babby", 1, 5, 5, 0, 0, 1, 1, 1, 1, { baby: "soyChild", sound: "light" });
		/* Cave */
		case "trapple": return new CropDetail(name, 150, "tree", 1, 3, 3, 7, 0, 2, 2, 2, 2, { saltChance: 0.25, sound: "hard" });
		case "trapricot": return new CropDetail(name, 330, "tree", 1, 6, 3, 11, 0, 2, 2, 2, 2, { sound: "hard" });
		case "travocado": return new CropDetail(name, 330, "tree", 1, 6, 3, 11, 0, 2, 2, 2, 2, { sound: "squishy" });
		case "trbanana": return new CropDetail(name, 225, "tree", 1, 3, 3, 8, 0, 2, 2, 2, 2, { burnChance: 0.25, sound: "light" });
		case "trgrapes": return new CropDetail(name, 285, "tree", 1, 5, 3, 10, 0, 2, 2, 2, 2, { sound: "squishy" });
		case "trkiwi": return new CropDetail(name, 210, "tree", 1, 10, 3, 11, 0, 2, 2, 2, 2, { sound: "squishy" });
		case "trlemon": return new CropDetail(name, 315, "tree", 1, 3, 3, 9, 0, 2, 2, 2, 2, { saltChance: 0.25, sound: "squishy" });
		case "trmango": return new CropDetail(name, 90, "tree", 1, 3, 3, 6, 0, 2, 2, 2, 2, { burnChance: 0.25, sound: "hard" });
		case "trcoconut": return new CropDetail(name, 500, "tree", 1, 3, 3, 11, 0, 2, 2, 2, 2, { sound: "hard" });
		case "dodo": return new CropDetail(name, 500, "egg", 1, 20, 4, 11, 0, 2, 2, 2, 2, { saltChance: 0.5, burnChance: 0.5, sound: "bird" });
	}
}
debug.AllCrops = ["asparagus", "beet", "bellpepper", "carrot", "corn", "garlic", "ginger", "leek", "pineapple", "radish", "rhubarb", "spinach", "tomato", "apple", "apricot", "avocado", "banana", "blackberry", "grapes", "specialgrapes", "kiwi", "lemon", "mango", "beeR", "beeG", "beeB", "rice", "arborio", "blackrice", "shortgrain", "chestnut", "spear", "rod", "goodrod", "metalrod", "net", "bignet", "fodder", "shiitake", "milkcap", "portobello", "greenshroom", "blackshroom", "poisnshroom", "egg", "quail", "goose", "turkey", "platypus", "battery", "headphones", "printer", "app", "drone", "frogbot", "coffee", "sicklebattery", "holywater", "holyjug", "goldegg", "coconut", "gmocorn", "ultrarod", "goodfood", "notdrugs", "lotus", "hbee", "saffron"];
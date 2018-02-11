function CropDetail(name, displayname, price, type, size, time, frames, power, re, sp, su, au, wi, addtl) {
    this.name = name;
    this.type = type;
    this.price = price;
    this.displayname = displayname;
    this.size = size;
    this.time = time;
    this.frames = frames;
    this.power = power;
	this.health = power * 5;
	this.maxhealth = this.health;
	this.defense = power * power * 0.4;
    this.respawn = re;
    this.seasons = [sp || 0, su || 0, au || 0, wi || 0];
    if(addtl !== undefined) { for(var key in addtl) { this[key] = addtl[key]; } }
}
function GetCrop(name) {
    switch(name) {
		/* Veggies */
		case "asparagus": return new CropDetail(name, "Asparagus", 30, "veg", 1, 10, 4, 3, 3, 2, 1, 1, 0);
		case "beet": return new CropDetail(name, "Beet", 15, "veg", 1, 1, 2, 1, 0, 0, 1, 2, 2, { waterResist: 1, saltChance: 0.5 });
		case "bellpepper": return new CropDetail(name, "Bell Pepper", 120, "veg", 1, 2, 3, 6, 0, 0, 1, 2, 0);
		case "carrot": return new CropDetail(name, "Carrot", 15, "veg", 1, 2, 2, 2, 0, 2, 1, 2, 1, { animal: "Rabbit", animalChance: 0.03, animalDamageMult: 4 });
		case "corn": return new CropDetail(name, "Corn", 45, "veg", 1, 5, 3, 5, 0, 0, 2, 1, 0, { saltClean: true });
		case "garlic": return new CropDetail(name, "Garlic", 180, "veg", 1, 6, 3, 9, 0, 2, 1, 1, 0);
		case "ginger": return new CropDetail(name, "Ginger", 30, "veg", 1, 5, 4, 4, 0, 1, 1, 2, 0, { burnChance: 0.5 });
		case "leek": return new CropDetail(name, "Leek", 90, "veg", 1, 3, 3, 6, 0, 0, 0, 0, 2);
		case "pineapple": return new CropDetail(name, "Pineapple", 75, "veg", 1, 12, 4, 8, 0, 1, 2, 0, 0, { fireResist: 1 });
		case "radish": return new CropDetail(name, "Radish", 30, "veg", 1, 1, 2, 3, 0, 2, 0, 1, 0);
		case "rhubarb": return new CropDetail(name, "Rhubarb", 75, "veg", 1, 8, 4, 7, 0, 1, 0, 0, 0, { burnChance: 0.25 });
		case "spinach": return new CropDetail(name, "Spinach", 15, "veg", 1, 1, 2, 1, 0, 1, 0, 2, 0, { saltChance: 0.5 });
		case "tomato": return new CropDetail(name, "Tomato", 15, "veg", 1, 3, 2, 2, 0, 0, 2, 0, 0, { saltClean: true, burnChance: 0.25 });
		/* Trees */
		case "apple": return new CropDetail(name, "Apple", 30, "tree", 2, 5, 5, 2, 2, 1, 1, 2, 1, { saltChance: 0.25 });
		case "apricot": return new CropDetail(name, "Apricot", 180, "tree", 2, 24, 5, 9, 5, 2, 1, 0, 0);
		case "avocado": return new CropDetail(name, "Avocado", 240, "tree", 2, 21, 5, 8, 4, 2, 2, 0, 1);
		case "banana": return new CropDetail(name, "Banana", 45, "tree", 2, 7, 5, 3, 3, 1, 1, 1, 1, { animal: "Monkey", animalChance: 0.01, animalDamageMult: 10, burnChance: 0.25, treeSprite: "tropictree" });
		case "blackberry": return new CropDetail(name, "Blackberry", 90, "tree", 2, 14, 5, 4, 1, 0, 2, 0, 0);
		case "grapes": return new CropDetail(name, "Grapes", 45, "tree", 2, 20, 5, 5, 4, 0, 0, 2, 0);
		case "specialgrapes": return new CropDetail(name, "Grapes+", 90, "tree", 2, 4, 5, 5, 3, 0, 0, 2, 0);
		case "kiwi": return new CropDetail(name, "Kiwi", 795, "tree", 2, 40, 5, 10, 1, 0, 2, 0, 1);
		case "lemon": return new CropDetail(name, "Lemon", 105, "tree", 2, 5, 5, 4, 2, 1, 2, 1, 0);
		case "mango": return new CropDetail(name, "Mango", 15, "tree", 2, 3, 5, 1, 2, 0, 2, 1, 0, { burnChance: 0.25 });
		/* Bees */
		case "beeR": return new CropDetail(name, "Killer Bee", 420, "bee", 1, 999, 2, 7, 999, 1, 1, 2, 0, { stickChance: 1 });
		case "beeG": return new CropDetail(name, "Stingless Bee", 45, "bee", 1, 999, 2, 3, 999, 1, 2, 1, 0, { stickChance: 2 });
		case "beeB": return new CropDetail(name, "Honey Bee", 180, "bee", 1, 999, 2, 5, 999, 2, 1, 1, 0, { stickChance: 3 });
		/* Rice */
		case "rice": return new CropDetail(name, "Rice", 90, "rice", 1, 9, 4, 8, 0, 1, 1, 0, 1);
		case "arborio": return new CropDetail(name, "Arborio Rice", 105, "rice", 1, 11, 4, 9, 0, 1, 1, 0, 1);
		case "blackrice": return new CropDetail(name, "Black Rice", 75, "rice", 1, 7, 4, 7, 0, 1, 1, 0, 1);
		case "shortgrain": return new CropDetail(name, "Short-Grain Rice", 75, "rice", 1, 4, 4, 6, 0, 2, 1, 0, 1, { saltClean: true });
		case "chestnut": return new CropDetail(name, "Water Chestnut", 120, "rice", 1, 14, 4, 10, 0, 0, 1, 1, 2);
		/* Fishing */
		case "spear": return new CropDetail(name, "Fish Spear", 210, "spear", 1, 0, 2, 5, 0, 1, 1, 1, 1);
		case "rod": return new CropDetail(name, "Fish Rod", 15, "rod", 1, 10, 2, 2, 0, 1, 1, 1, 0);
		case "goodrod": return new CropDetail(name, "Better Rod", 15, "rod", 1, 10, 2, 4, 0, 1, 1, 1, 0);
		case "metalrod": return new CropDetail(name, "Metal Rod", 45, "rod", 1, 10, 2, 6, 0, 1, 1, 1, 0);
		case "net": return new CropDetail(name, "Fish Net", 105, "water", 1, -1, 2, 5, 0, 1, 1, 1, 0, { rotten: true });
		case "bignet": return new CropDetail(name, "Big Net", 840, "water", 2, -1, 2, 10, 0, 1, 1, 1, 0, { rotten: true });
		/* Cow */
		case "fodder": return new CropDetail(name, "Fodder", 120, "food", 1, 0, 1, 4, 0, 1, 1, 1, 1, { saltClean: true });
		/* Mushrooms */
		case "shiitake": return new CropDetail(name, "Shiitake", 75, "mush", 1, 6, 3, 5, 3, 1, 1, 1, 1);
		case "milkcap": return new CropDetail(name, "Milk Cap", 375, "mush", 1, 20, 3, 8, 1, 1, 1, 1, 1);
		case "portobello": return new CropDetail(name, "Portobello", 60, "mush", 1, 3, 3, 4, 3, 1, 1, 1, 1);
		case "greenshroom": return new CropDetail(name, "Parrot Toadstool", 90, "mush", 1, 7, 3, 6, 4, 1, 1, 1, 1);
		case "blackshroom": return new CropDetail(name, "Black Mushroom", 180, "mush", 1, 10, 3, 7, 2, 1, 1, 1, 1);
		case "poisnshroom": return new CropDetail(name, "Definitely Poisonous Mushroom", 345, "mush", 1, 6, 3, 10, 5, 1, 1, 1, 1);
		/* Eggs */
		case "egg": return new CropDetail(name, "Chicken Egg", 15, "egg", 1, 7, 4, 3, 0, 1, 1, 1, 1);
		case "quail": return new CropDetail(name, "Quail Egg", 15, "egg", 1, 6, 4, 2, 0, 1, 1, 1, 1);
		case "goose": return new CropDetail(name, "Goose Egg", 30, "egg", 1, 11, 4, 5, 0, 1, 1, 1, 1);
		case "turkey": return new CropDetail(name, "Turkey Egg", 15, "egg", 1, 10, 4, 4, 0, 1, 1, 1, 1);
		case "platypus": return new CropDetail(name, "Platypus Egg", 255, "egg", 1, 4, 4, 9, 0, 1, 1, 1, 1);
		/* Technology */
		case "battery": return new CropDetail(name, "Battery", 45, "tech", 1, 5, 5, 5, 0, 2, 2, 2, 2);
		case "headphones": return new CropDetail(name, "Earbuds", 15, "tech", 1, 3, 3, 2, 0, 2, 2, 2, 2);
		case "printer": return new CropDetail(name, "3D Printer", 60, "tech", 1, 6, 6, 4, 4, 2, 2, 2, 2);
		case "app": return new CropDetail(name, "App", 15, "tech", 1, 3, 4, 3, 0, 2, 2, 2, 2);
		case "drone": return new CropDetail(name, "Drone", 105, "tech", 1, 5, 3, 7, 0, 2, 2, 2, 2);
		case "frogbot": return new CropDetail(name, "Fwoggybot", 135, "tech", 2, 8, 4, 9, 0, 2, 2, 2, 2);
		case "coffee": return new CropDetail(name, "Coffee Machine", 165, "tech", 2, 10, 5, 10, 0, 2, 2, 2, 2);
		case "sicklebattery": return new CropDetail(name, "Sickle2 Battery", 100, "sickle2", 1, 5, 4, 0, 0, 2, 2, 2, 2);
		/* Rare */
		case "goldegg": return new CropDetail(name, "Golden Egg", 500, "egg", 1, 4, 4, 11, 0, 1, 1, 1, 1);
		case "coconut": return new CropDetail(name, "Coconut", 500, "tree", 2, 10, 5, 11, 3, 1, 2, 0, 0, { treeSprite: "tropictree" });
		case "gmocorn": return new CropDetail(name, "GMO Corn", 500, "veg", 1, 5, 3, 11, 0, 1, 1, 1, 2);
		case "ultrarod": return new CropDetail(name, "Master Bait", 500, "rod", 1, 20, 2, 11, 0, 1, 1, 1, 1);
		case "goodfood": return new CropDetail(name, "Delicious Food", 500, "food", 1, 0, 1, 11, 0, 1, 1, 1, 1);
		case "notdrugs": return new CropDetail(name, "Funny Mushroom", 500, "mush", 1, 5, 3, 11, 3, 1, 1, 2, 1, { stickChance: 2 });
		case "lotus": return new CropDetail(name, "Sacred Lotus", 500, "rice", 1, 30, 5, 11, 0, 2, 2, 1, 0);
		case "hbee": return new CropDetail(name, "Haunted Bee", 500, "bee", 1, 999, 2, 11, 999, 1, 1, 1, 2, { stickChance: 3 });
		/* Enemy-Only */
		case "algae": return new CropDetail(name, "Algae", 0, "rice", 1, 2, 2, 1, 0, 1, 2, 1, 0, { noRot: true });
		case "kelp": return new CropDetail(name, "Kelp", 0, "rice", 1, 5, 5, 3, 0, 2, 2, 1, 1, { noRot: true });
		case "rock": return new CropDetail(name, "Rock", 0, "rock", 1, 5, 1, 0, 0, 1, 1, 1, 1);
		case "tire": return new CropDetail(name, "Tire", 0, "rock", 1, 8, 1, 0, 0, 1, 1, 1, 1);
		case "engine": return new CropDetail(name, "Engine", 0, "rock", 1, 10, 1, 0, 0, 1, 1, 1, 1);
		case "salt": return new CropDetail(name, "Salt", 0, "rock", 1, 30, 1, 0, 0, 1, 1, 1, 1);
		case "acorn": return new CropDetail(name, "Acorn", 0, "tree", 2, 6, 4, 3, 2, 0, 1, 1, 0);
		case "robobabby": return new CropDetail(name, "Byte Baby", 0, "babby", 1, 4, 4, 0, 0, 1, 1, 1, 1, { baby: "robo" });
		case "bpermit": return new CropDetail(name, "Building Permit", 0, "veg", 1, 4, 4, 6, 0, 1, 1, 1, 1);
		case "house": return new CropDetail(name, "House", 0, "veg", 2, 12, 5, 8, 0, 1, 1, 1, 1);
		case "lightbulb": return new CropDetail(name, "Smart Lightbulb", 0, "tech", 1, 1, 2, 4, 0, 1, 1, 1, 1);
		case "download": return new CropDetail(name, "Download", 0, "tech", 1, 10, 5, 5, 0, 1, 1, 1, 1);
		case "cloud": return new CropDetail(name, "The Cloud", 0, "cloud", 2, 100, 1, 6, 0, 1, 1, 1, 1);
		case "porcini": return new CropDetail(name, "Porcini", 0, "mush", 1, 5, 3, 5, 3, 1, 1, 1, 1);
		case "arborioB": return new CropDetail(name, "Arborio Rice", 0, "rice", 1, 5, 4, 5, 0, 1, 1, 0, 1);
		case "timebomb": return new CropDetail(name, "Time Bomb", 0, "veg", 1, 12, 4, 10, 0, 1, 1, 1, 1);
		case "shotgun": return new CropDetail(name, "Shotgun", 0, "veg", 1, 5, 4, 9, 0, 1, 1, 1, 1);
		case "burrito": return new CropDetail(name, "Burrito", 0, "veg", 1, 10, 1, 7, 0, 1, 1, 1, 1);
		case "dango": return new CropDetail(name, "Dango", 0, "veg", 1, 5, 1, 6, 0, 1, 1, 1, 1);
		case "taco": return new CropDetail(name, "Taco", 0, "veg", 1, 8, 1, 8, 0, 1, 1, 1, 1);
		case "kombucha": return new CropDetail(name, "Kombucha", 0, "veg", 1, 30, 1, 10, 0, 1, 1, 1, 1);
		case "cheese": return new CropDetail(name, "Cheese", 0, "veg", 1, 4, 1, 5, 0, 1, 1, 1, 1);
		case "batterysalt": return new CropDetail(name, "Smart Salt", 0, "veg", 1, 6, 3, 7, 0, 1, 1, 1, 1, { saltChance: 0.5 });
		case "gastank": return new CropDetail(name, "Gas Tank", 0, "tech", 1, 6, 4, 7, 0, 1, 1, 1, 1, { burnChance: 0.25 });
		case "airfilter": return new CropDetail(name, "Air Filter", 0, "tech", 1, 6, 5, 7, 0, 1, 1, 1, 1);
		case "dipstick": return new CropDetail(name, "Dip Stick", 0, "tech", 1, 3, 3, 7, 0, 1, 1, 1, 1);
		case "cacao": return new CropDetail(name, "Cacao", 0, "tree", 2, 10, 5, 7, 3, 1, 1, 1, 1);
		case "bananaPill": return new CropDetail(name, "Banana Pill", 0, "veg", 1, 4, 4, 7, 0, 0, 1, 0, 0);
		/* Beckett Nerfs */
		case "mushNerf": return new CropDetail(name, "Mushrooms", 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1);
		case "riceNerf": return new CropDetail(name, "Paddy Crops", 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1);
		case "treeNerf": return new CropDetail(name, "Tree Crops", 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1);
		case "vegNerf": return new CropDetail(name, "Veggies", 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1);
		case "fishNerf": return new CropDetail(name, "Fishes", 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1);
		case "beeNerf": return new CropDetail(name, "Bees", 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1);
		case "eggNerf": return new CropDetail(name, "Eggs", 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1);
		case "reNerf": return new CropDetail(name, "Regrowing Crops", 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1);
		/* WACG Cards */
		case "char0": return new CropDetail(name, "Pale Blood Horse", 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1);
		case "char1": return new CropDetail(name, "Mabingy the Elf", 0, "card", 1, 999, 1, 9, 0, 1, 1, 1, 1);
		case "char2": return new CropDetail(name, "Pagan Cave Bat", 0, "card", 1, 999, 1, 8, 0, 1, 1, 1, 1);
		case "char3": return new CropDetail(name, "Just a Slime", 0, "card", 1, 999, 1, 7, 0, 1, 1, 1, 1);
		case "char4": return new CropDetail(name, "Trash Lobster", 0, "card", 1, 999, 1, 6, 0, 1, 1, 1, 1);
		case "elem0": return new CropDetail(name, "Fire", 0, "card", 1, 999, 1, 5, 0, 1, 1, 1, 1);
		case "elem1": return new CropDetail(name, "Earth", 0, "card", 1, 999, 1, 5, 0, 1, 1, 1, 1);
		case "elem2": return new CropDetail(name, "Water", 0, "card", 1, 999, 1, 5, 0, 1, 1, 1, 1);
		case "elem3": return new CropDetail(name, "Tech", 0, "card", 1, 999, 1, 5, 0, 1, 1, 1, 1);
		case "fx0": return new CropDetail(name, "Gobulin Shield", 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1);
		case "fx1": return new CropDetail(name, "Wand of Ps'ghetti", 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1);
		case "fx2": return new CropDetail(name, "Infernal Doug", 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1);
		case "fx3": return new CropDetail(name, "Regular Baseball", 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1);
		case "fx4": return new CropDetail(name, "The Blue Winter", 0, "card", 1, 999, 1, 10, 0, 1, 1, 1, 1);
		/* Food2 */
		case "food2orig": return new CropDetail(name, "Food2 Original", 0, "food2", 1, 4, 5, 7, 0, 1, 1, 1, 1);
		case "food2classic": return new CropDetail(name, "Food2 Classic", 0, "food2", 1, 4, 5, 7, 0, 1, 1, 1, 1);
		case "food2kelp": return new CropDetail(name, "Food2 Crispy", 0, "food2", 1, 4, 5, 7, 0, 1, 1, 1, 1, { saltChance: 0.25 });
		case "food2coffee": return new CropDetail(name, "Food2 WH", 0, "food2", 1, 4, 5, 8, 0, 1, 1, 1, 1, { burnChance: 0.15 });
		case "food2salsa": return new CropDetail(name, "Food2 SP", 0, "food2", 1, 4, 5, 9, 0, 1, 1, 1, 1, { burnChance: 0.75 });
		case "food2gamer": return new CropDetail(name, "Food2 Epic", 0, "food2", 1, 4, 5, 7, 0, 1, 1, 1, 1, { saltChance: 0.25 });
		case "food2cookie": return new CropDetail(name, "Food2 RR", 0, "food2", 1, 4, 5, 8, 0, 1, 1, 1, 1);
		case "food2black": return new CropDetail(name, "Food2 Midnite", 0, "food2", 1, 4, 5, 9, 0, 1, 1, 1, 1);
		case "food2purple": return new CropDetail(name, "Food2 Purple", 0, "food2", 1, 4, 5, 9, 0, 1, 1, 1, 1);
		case "food2crystal": return new CropDetail(name, "Crystal Food2", 0, "food2", 1, 4, 5, 10, 0, 1, 1, 1, 1);
		case "food2powder": return new CropDetail(name, "Food2 Powder", 0, "food2", 1, 1, 1, 5, 0, 1, 1, 1, 1);
		case "food2bar": return new CropDetail(name, "Foobar2", 0, "food2", 1, 5, 3, 8, 0, 1, 1, 1, 1);
		case "food2barChoc": return new CropDetail(name, "Chocky Foobar2", 0, "food2", 1, 5, 3, 9, 0, 1, 1, 1, 1);
		case "soybean": return new CropDetail(name, "Soybean", 0, "veg", 1, 10, 5, 8, 0, 0, 1, 1, 0);
		case "conveyorEnd": return new CropDetail(name, "Food2 Conveyor", 0, "card", 1, 999, 1, 10, 0, 0, 0, 0, 0);
		case "soybaby": return new CropDetail(name, "Soy Baby", 0, "babby", 1, 5, 5, 0, 0, 1, 1, 1, 1, { baby: "soyChild" });
	}
}
debug.AllCrops = ["asparagus", "beet", "bellpepper", "carrot", "corn", "garlic", "ginger", "leek", "pineapple", "radish", "rhubarb", "spinach", "tomato", "apple", "apricot", "avocado", "banana", "blackberry", "grapes", "specialgrapes", "kiwi", "lemon", "mango", "beeR", "beeG", "beeB", "rice", "arborio", "blackrice", "shortgrain", "chestnut", "spear", "rod", "goodrod", "metalrod", "net", "bignet", "fodder", "shiitake", "milkcap", "portobello", "greenshroom", "blackshroom", "poisnshroom", "egg", "quail", "goose", "turkey", "platypus", "battery", "headphones", "printer", "app", "drone", "frogbot", "coffee", "sicklebattery", "goldegg", "coconut", "gmocorn", "ultrarod", "goodfood", "notdrugs", "lotus", "hbee"];
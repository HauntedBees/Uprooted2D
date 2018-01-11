var debugAllMaps = ["farm", "producestand", "firstvillage", "belowvillage", "researchfacility", "bridge", "underwater", "fakefarm", "southcity", "northcity", "hq_1"]; // forest is big
var smallMaps = ["farm"];
var namesToIgnore = ["Sign", "Chair", "SeedShotArea2", "SeedShotArea3", "SeedShotArea4"];
var mapNames = {
    "farm": "Your Farm", "producestand": "Produce Stand", "forest": "Agrios Forest", "firstvillage": "San Ambrosio", "belowvillage": "South of Town",
    "researchfacility": "Mysterious Research Lab", "bridge": "Bridge Crossing", "underwater": "Underwater", "fakefarm": "Jeff's Farm",
    "southcity": "South Las Abejas", "northcity": "Central Las Abejas", "hq_1": "Food2 Headquarters 1F"
};
var shopNames = {
    "coop": "Chicken Coop", "inn0": "Your House", "equip1": "Dave's Hoes and Sickles", "fixture1": "Fuckster's Fixtures", "seed1": "Seedy Pete's Petey Seeds",
    "upgrade1": "Andrew D's Farm Expansions", "inn1": "Frothybarf Inn", "mermaidinn": "The Mermaid Inn", "mermaid": "Ye Mermaid Shoppe",
    "cworker": "Lazy Construction Worker's Shop", "upgrade2": "The Upgrade Barn", "fixture2": "The Fixture Stall", "skumpys": "Skumpy's Pub", "mantools": "MAN TOOLS",
    "seedshack": "The Seed Shack", "catalinas": "Catalina's Fixtures", "tinker": "Tinker Tierra", "pawn": "Pawn Shop", "church": "Las Abejas Church",
    "trout": "crazy4trout", "cityInn": "Hotel", "cityFixtures": "Fixtures", "gordonsFarming": "Gordon's Farming", "cityTech": "Tech Supplies",
    "cityExpansions": "Farm Expansions"
};
function GetEnemyName(name) { 
    switch(name) {
        case "Jeff": name = "ScienceMan"; break;
        case "Fucker": name = "bigBot"; break;
        case "research": name = "robo2"; break;
        case "fish": name = "fishFace"; break;
        case "seamonk": name = "seaMonk"; break;
        case "chickbot": name = "chickBot"; break;
        case "pig": name = "piggun"; break;
        case "wildmobsty": return "Mobster"; break;
        case "MobBoss": name = "mobBoss"; break;
        case "HOUSEKEEPER": name = "housekeeper"; break;
        case "carBr": name = "brownCar"; break;
        case "carBl": name = "blueCar"; break;
        case "carRe": name = "redCar"; break;
    }
    return GetText("e." + name + "0");
}
function GetBossHTML(enemyKey) {
    var $template = $("#bossTemplate").clone();
    $template.removeClass("template").removeAttr("id");
    $template.find(".txt_name").text("Boss: " + GetEnemyName(enemyKey));
    return $template;
}


function GetMapObjData(e, $details) {
    if(e.name === "hungryboy") {
        return { order: 5, type: "NPC", badgeclass: "badge-info", text: "Hungry Boy", infoText: "He'll share some of his fruits and veggies with you if you keep his secret safe." };
    } else if(e.name === "fuzurusenpai") {
        return { order: 5, type: "NPC", badgeclass: "badge-info", text: "Marty" };
    } else if(e.name === "EggBoy") {
        return { order: 5, type: "NPC", badgeclass: "badge-info", text: "Egg Dealer", infoText: "Sells 2 eggs for 250G. The eggs you get are random, and can be quite rare!" };
    } else if(e.name === "CityMonk") {
        return { order: 5, type: "NPC", badgeclass: "badge-info", text: "Big City Sea Monk" };
    } else if(e.name === "UndergroundMan") {
        return { order: 5, type: "NPC", badgeclass: "badge-warning", text: "???", infoText: "???" };
    } else if(e.name === "OfficeLady") {
        return { order: 5, type: "NPC", badgeclass: "badge-info", text: "Susantha" };
    } else if(e.name === "KeycardTrap") {
        // TODO
        return { order: 4, sortCount: 9999, type: "Boss", badgeclass: "badge-danger", dispCount: "X", text: "Dweeblord" };
    } else if(e.name === "Keycard") {
        return { order: 5, type: "NPC", badgeclass: "badge-info", text: "Food2 Keycard", infoText: "You need this to get into the Food2 Building." };
    } else if(e.name.indexOf("Robber") >= 0) {
        return { order: 4, sortCount: 9998, type: "enemy", subtype: "robber", badgeclass: "badge-danger", dispCount: "R", text: "Bank Robber" };
    } else if(e.name === "freeRadish") {
        return { order: 5, type: "NPC", badgeclass: "badge-info", text: "Radish", infoText: "You can harvest some Radish Seeds from this." };
    } else if(e.name === "brandt") {
        return { order: 5, type: "NPC", badgeclass: "badge-info", text: "Brandt", infoText: "This man will give you lots of Spinach Seeds." };
    } else if(e.name.indexOf("crazy4trout") === 0) {
        stores["trout"] = {
            wares: [
                { product: "metalrod", price: 200, type: "seed" },
                { product: "net", price: 50, type: "seed" },
                { product: "bignet", price: 100, type: "seed" },
                { product: "spear", price: 200, type: "seed" }
            ], buyMult: 1
        };
        $details.append(GetShopHTML("trout"));
        return { order: 3, type: "Shop", badgeclass: "badge-success", text: "crazy4trout" };
    } else if(e.name.indexOf("SomeNerd") === 0) {
        return { order: 5, type: "nerd", subtype: "nerd", dispCount: "N", badgeclass: "badge-info", text: "Nerd" };
    } else if(e.name === "MushMan") {
        return { order: 0, type: "NPC", badgeclass: "badge-info", dispCount: "Q", text: "Daveothy",
        infoText: "This man will give you Water Chestnut seeds in exchange for Mushroom Seeds, or Sacred Lotus Seeds in exchange for Funny Mushoom Seeds." };
    } else if(e.name.indexOf("atm") === 0) {
        return { order: 5, type: "atm", subtype: "atm", badgeclass: "badge-warning", dispCount: "A", text: "Cash2 ATM" };
    } else if(e.name.indexOf("cashboy") === 0) {
        return { order: 5, type: "cashboy", subtype: "cashboy", badgeclass: "badge-info", dispCount: "I", text: "Cash2 Investor" };
    } else if(e.name.indexOf("Officer") === 0) {
        return { order: 5, type: "cop", subtype: "cop", badgeclass: "badge-info", dispCount: "C", text: "Police Officer" };
    } else if(e.name === "Abuela") {
        return { order: 0, type: "NPC", badgeclass: "badge-info", dispCount: "Q", text: "Old Lady",
        infoText: "This lady will reward you for giving her bird feed like Fodder, Corn, or Rice. If you give her Delicious Food she will give you Funny Mushroom Seeds." };
    } else if(e.name.indexOf("LawnMower") === 0) {
        // TODO
        return { order: 4, type: "Enemy", subtype: "lawnmower", badgeclass: "badge-danger", text: "Lawnmower" };
    } else if(e.name === "Crouton") {
        return { order: 0, type: "NPC", badgeclass: "badge-info", dispCount: "Q", text: "Crouton",
        infoText: "This dog will give you Fodder in exchange for fishing supplies, or Delicious Food in exchange for Master Bait." };
    } else if(e.name === "Hotbox") {
        return { order: 4, sortCount: 9998, type: "NPC", badgeclass: "badge-danger", dispCount: "H", text: "Insidious Machine",
        infoText: "To power down the gate blocking the staircase, this machine must be defeated in combat." };
    } else if(e.name === "TireRack") {
        return { order: 5, type: "NPC", badgeclass: "badge-info", dispCount: "T", text: "Tire Rack",
        infoText: "This rack contains a spare tire you can use to fix your truck." };
    } else if(e.name === "Outlet") {
        return { order: 5, type: "NPC", badgeclass: "badge-info", dispCount: "O", text: "Power Outlet",
        infoText: "Unplugging this will power down everything in the barn." };
    } else if(e.name.indexOf("CoveredDoor") === 0) {
        return { order: 11, sortCount: 9999, type: "LockedDoor", subtype: "LockedDoor", badgeclass: "badge-info", dispCount: "L", text: "Locked Door",
        infoText: "These doors will be unlocked after Farmer Jeff tells you about his plan." };
    } else if(e.name === "SeaCreatureMiddle") {
        return { order: 4, sortCount: 9999, type: "Boss", badgeclass: "badge-danger", dispCount: "X", text: "Sea Monster",
        infoText: "You can choose to help the help the Sea Monster and fight the Construction Workers, or help the Workers and kill the Sea Monster." };
    } else if(e.name === "PirateFriend") {
        return { order: 0, type: "NPC", badgeclass: "badge-info", dispCount: "Q", text: "Dowel",
        infoText: "This pirate will give you seeds in exchange for Paddy Crop Seeds, or the Sea Monk Key in exchange for GMO Corn Seeds." };
    } else if(e.name === "PiratesTreasure") {
        return { order: 11, type: "NPC", badgeclass: "badge-warning", dispCount: "D", text: "Dowel's Treasure",
        infoText: "The Sea Monk Key can be used to unlock this chest, which contains 4 pieces of Master Bait." };
    } else if(e.name === "KelpBoy") {
        return { order: 4, sortCount: 9998, type: "NPC", badgeclass: "badge-danger", dispCount: "KB", text: "Kelp Boy",
        infoText: "You must beat this weird underwater man in combat to get his Beehive." };
    } else if(e.name === "HeadWorker") {
        // TODO
        return { order: 4, sortCount: 9999, type: "Boss", badgeclass: "badge-danger", dispCount: "X", text: "Head Construction Worker",
        infoText: "You can choose to help the Construction Workers and kill the Sea Monster, or help the Sea Monster and fight the Workers." };
    } else if(e.name.indexOf("Worker") === 0) {
        // TODO
        return { order: 4, type: "Enemy", subtype: "worker", badgeclass: "badge-danger", text: "Construction Worker" };
    } else if(e.name.indexOf("Falcon") === 0) {
        return { order: 0, type: "Falcon", badgeclass: "badge-warning", dispCount: "F", text: "Falcon" };
    } else if(e.name === "ConvinceATron") {
        return { order: 0, type: "Enemy", badgeclass: "badge-danger", dispCount: "C", text: "Tutorial",
        infoText: "If you run away from the tutorial battle in the opening cutscene, you can come back to it later here." };
    } else if(e.name === "EggFairy") {
        return { order: 0, type: "NPC", badgeclass: "badge-info", dispCount: "Q", text: "Egg Fairy",
        infoText: "Dropping an egg in the lake here will summon the Egg Fairy. Lying to them  will lead to all of your eggs being taken, while telling the truth will give you a Golden Egg." };
    } else if(e.name === "RAPBATTLE") {
        return { order: 0, type: "NPC", badgeclass: "badge-info", dispCount: "Q", text: "RAPBATTLE",
        infoText: "This robot will give you batteries in exchange for Garlic or Rice Seeds, or GMO Corn in exchange for Coconut Seeds." };
    } else if(e.name === "SeedShotArea1") {
        return { order: 4, type: "NPC", sortCount: 9998, badgeclass: "badge-danger", dispCount: "S", text: "Seed Shooter Trap",
        infoText: "Walking into this trap will result in seeds being shot at you, doing 2 damage per seed." };
    } else if(e.rfd) {
        var dC = ["R", "B", "G"][e.type] + (e.initActive ? "O" : "X");
        return { order: 9, type: "RFDoor", subtype: dC, badgeclass: "badge-secondary", dispCount: dC, text: (["Red", "Blue", "Green"][e.type] + " Door (" + (e.initActive ? "Open)" : "Closed)")) };
    } else if(e.rf === true) {
        var dC = ["RB", "BB", "GB"][e.type];
        return { order: 8, type: "RFButton", subtype: dC, badgeclass: "badge-primary", dispCount: dC, text: ["Red", "Blue", "Green"][e.type] + " Switch" };
    } else if(e.isChest) {
        // TODO
        return { order: 11, type: "Treasure", badgeclass: "badge-warning", text: "Treasure Chest" };
    } else if(e.boss) {
        $details.append(GetBossHTML(e.name));
        return { order: 4, sortCount: 9999, type: "Boss", badgeclass: "badge-danger", dispCount: "X", text: GetEnemyName(e.name) };
    } else if(e.isBeehive) {
        return { order: 0, type: "Beehive", badgeclass: "badge-warning", dispCount: "B", text: "Beehive" };
    } else if(e.enemies !== undefined) {
        // TODO
        return { order: 4, type: "Enemy", subtype: e.interactname, badgeclass: "badge-danger", text: GetEnemyName(e.interactname) };
    } else if(e.isMapSwitch) {
        return { order: 2, type: "Move", subtype: e.destination, badgeclass: "badge-dark", text: "To " + mapNames[e.destination] };
    } else if(e.isShop) {
        $details.append(GetShopHTML(e.shopName));
        return { order: 3, type: "Shop", badgeclass: "badge-success", text: shopNames[e.shopName] };
    } else if(e.isWaterfall) {
        return { order: 6, type: "Waterfall", subtype: "WF", badgeclass: "badge-primary", dispCount: "W", text: "Water Current" };
    } else if(e.isRock) {
        return { order: 7, type: "Rock", subtype: "WFR", badgeclass: "badge-info", dispCount: "R", text: "Rock" };
    } else if(e.name === "AFuckingTruckL") {
        return { order: 1, type: "Truck", badgeclass: "badge-dark", dispCount: "T", text: "Truck" };
    } else {
        return { order: 5, type: "NPC", badgeclass: "badge-info", text: e.name };
    }
    return { type: "?" };
}

function GetEnemyHTML(enemyKey) {
    var $template = $("#innerEnemyTemplate").clone();
    $template.removeClass("template").removeAttr("id");
    $template.find(".txt_name").text(GetEnemyName(enemyKey));
    if(enemyKey === "research") { enemyKey = "robo2"; }
    if(enemyMetadata[enemyKey] !== undefined) {
        var enemyData = enemyMetadata[enemyKey];
        var amt = enemyData.min + (enemyData.max === enemyData.min ? "" : "-" + enemyData.max);
        $template.find(".txt_amount").text(amt);
        var typ = [];
        for(var i = 0; i < enemyData.enemies.length; i++) {
            var myName = GetEnemyName(enemyData.enemies[i]);
            if(typ.indexOf(myName) < 0) { typ.push(myName); }
        }
        $template.find(".txt_types").text(typ.join(", "));
    } else { console.log(enemyKey); }
    return $template;
}
function GetShopHTML(shopKey) {
    var $template = $("#shopTemplate").clone();
    $template.removeClass("template").removeAttr("id");
    $template.find(".txt_name").text(shopNames[shopKey]);
    var shopInfo = stores[shopKey];
    if(shopInfo.innId !== undefined) {
        $template.find(".price").text(shopInfo.wares[0].price);
        $template.find(".wares,.sell").remove();
    } else {
        $template.find(".inn").remove();
        var $wares = $template.find(".wares");
        if(shopInfo.doesSell) {
            $template.find(".percent").text(shopInfo.sellMult * 100);
        } else {
            $template.find(".sell").remove();
        }
        for(var i = 0; i < shopInfo.wares.length; i++) {
            var name = "ass";
            var price = shopInfo.wares[i].price * (shopInfo.buyMult || 1);
            switch(shopInfo.wares[i].type) {
                case "seed": name = "<span class='spriteTiny st" + shopInfo.wares[i].product + "'></span>" + GetCrop(shopInfo.wares[i].product).displayname; break;
                case "farm": name = "<span class='spriteTiny st" + shopInfo.wares[i].product + "'></span>" + GetFarmInfo(shopInfo.wares[i].product).displayname; break;
                case "equipment": name = "<span class='spriteTiny st" + GetEquipment(shopInfo.wares[i].product).sprite + "'></span>" + GetEquipment(shopInfo.wares[i].product).displayname; break;
                case "upgrade": name = "Field Size Upgrade"; break;
            }
            $wares.append($("<div class='shopItem'>" + name + " (" + price + "G)</div>"));
        }
    }
    return $template;
}
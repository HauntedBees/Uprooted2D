var debugAllMaps = ["farm", "producestand", "firstvillage", "belowvillage", "researchfacility", "bridge", "underwater", "fakefarm"]; // forest is big
var smallMaps = ["farm"];
var namesToIgnore = ["Sign", "Chair", "SeedShotArea2", "SeedShotArea3", "SeedShotArea4"];
var mapNames = {
    "farm": "Your Farm",
    "producestand": "Produce Stand",
    "forest": "Forest",
    "firstvillage": "San Ambrosio",
    "belowvillage": "South of Town",
    "researchfacility": "Mysterious Research Lab",
    "bridge": "Bridge Crossing",
    "underwater": "Underwater",
    "fakefarm": "Jeff's Farm"
};
var shopNames = {
    "coop": "Chicken Coop",
    "inn0": "Your House",
    "equip1": "Dave's Hoes and Sickles",
    "fixture1": "Fuckster's Fixtures",
    "seed1": "Seedy Pete's Questionable Seeds",
    "upgrade1": "Andrew D's Farm Expansions",
    "inn1": "Frothybarf Inn"
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
    }
    return GetText("e." + name + "0");
}
function GetBossHTML(enemyKey) {
    var $template = $("#bossTemplate").clone();
    $template.removeClass("template").removeAttr("id");
    $template.find(".txt_name").text("Boss: " + GetEnemyName(enemyKey));
    return $template;
}

function DoSpecialProcessing(obj) {
    if(obj.name === "ConvinceATron") {
        return {
            type: "Enemy",
            badgeclass: "badge-danger",
            dispCount: "C"
        };
    } else if(obj.name === "EggFairy") {
        return {
            type: "NPC",
            badgeclass: "badge-info",
            dispCount: "Q"
        };
    } else if(obj.name === "RAPBATTLE") {
        return {
            type: "NPC",
            badgeclass: "badge-info",
            dispCount: "Q"
        };
    } else if(obj.name === "SeedShotArea1") {
        return {
            type: "NPC",
            badgeclass: "badge-danger",
            dispCount: "S"
        };
    }
    return null;
}
function GetSpecialMapObject(obj) {
    if(obj.name === "ConvinceATron") {
        return { type: 4, num: -1, badgeclass: "badge-danger", disp: "C", text: "Tutorial" };
    } else if(obj.name === "EggFairy") {
        return { type: 5, num: -1, badgeclass: "badge-info", disp: "Q", text: "Egg Fairy" };
    } else if(obj.name === "RAPBATTLE") {
        return { type: 5, num: -1, badgeclass: "badge-info", disp: "Q", text: "RAPBATTLE" };
    } else if(obj.name === "SeedShotArea1") {
        return { type: 5, num: -2, badgeclass: "badge-danger", disp: "S", text: "Seed Shooter Trap" };
    }
}
function GetSpecialHTML(obj) {
    var $template = $("#specialTemplate").clone();
    $template.removeClass("template").removeAttr("id");
    var title = "";
    var text = "";
    if(obj.name === "ConvinceATron") {
        title = "Tutorial";
        text = "If you run away from the tutorial battle in the opening cutscene, you can come back to it later here.";
    } else if(obj.name === "EggFairy") {
        title = "Egg Fairy";
        text = "Dropping an egg in the lake here will summon the Egg Fairy. Lying to them  will lead to all of your eggs being taken, while telling the truth will give you a Golden Egg.";
    } else if(obj.name === "RAPBATTLE") {
        title = "RAPBATTLE";
        text = "This robot will give you batteries in exchange for Garlic or Rice Seeds, or GMO Corn in exchange for Coconut Seeds.";
    } else if(obj.name === "SeedShotArea1") {
        title = "Seed Shooter Trap";
        text = "Walking into this trap will result in seeds being shot at you, doing 2 damage per seed.";
    }
    $template.find(".txt_name").text(title);
    $template.find(".txt_info").text(text);
    return $template;
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
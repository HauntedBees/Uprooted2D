var debugAllMaps = ["farm", "producestand", "firstvillage", "belowvillage", "researchfacility", "bridge", "underwater", "fakefarm", "southcity", "northcity", 
                    "hq_1", "hq_2", "hq_3", "hq_4", "hq_5"]; // TODO: forest is too big
var smallMaps = ["farm"];
var namesToIgnore = ["Sign", "Chair", "SeedShotArea2", "SeedShotArea3", "SeedShotArea4"];
var mapNames = {
    "farm": "Your Farm", "producestand": "Produce Stand", "forest": "Agrios Forest", "firstvillage": "San Ambrosio", "belowvillage": "South of Town",
    "researchfacility": "Mysterious Research Lab", "bridge": "Bridge Crossing", "underwater": "Underwater", "fakefarm": "Jeff's Farm",
    "southcity": "South Las Abejas", "northcity": "Central Las Abejas", "hq_1": "Food2 Headquarters 1F", "hq_2": "Food2 Headquarters 2F",
    "hq_3": "Food2 Headquarters 3F", "hq_4": "Food2 Headquarters 4F", "hq_5": "Food2 Headquarters 5F"
};
var shopNames = {
    "coop": "Chicken Coop", "inn0": "Your House", "equip1": "Dave's Hoes and Sickles", "fixture1": "Fuckster's Fixtures", "seed1": "Seedy Pete's Petey Seeds",
    "upgrade1": "Andrew D's Farm Expansions", "inn1": "Frothybarf Inn", "mermaidinn": "The Mermaid Inn", "mermaid": "Ye Mermaid Shoppe",
    "cworker": "Lazy Construction Worker's Shop", "upgrade2": "The Upgrade Barn", "fixture2": "The Fixture Stall", "skumpys": "Skumpy's Pub", "mantools": "MAN TOOLS",
    "seedshack": "The Seed Shack", "catalinas": "Catalina's Fixtures", "tinker": "Tinker Tierra", "pawn": "Pawn Shop", "church": "Las Abejas Church",
    "trout": "crazy4trout", "cityInn": "Hotel", "cityFixtures": "Fixtures", "gordonsFarming": "Gordon's Farming", "cityTech": "Tech Supplies",
    "cityExpansions": "Farm Expansions", "vendo_veg": "Veggie Vendo", "vendo_tree": "Fruity Vendo", "vendo_mush": "Fungy Vendo", "vendo_paddy": "Paddy Vendo",
    "vendo_coop": "Eggy Vendo", "vendo_water": "Fishy Vendo", "vendo_tech": "Vendy Vendo"
};

function DoEnemyGen() {
    var $enemies = $("#enemies > .content");
    for(var i = 0; i < debug.AllEnemies.length; i++) {
        var $template = $("#enemyTemplate").clone();
        $template.removeClass("template").removeAttr("id");
        var enemy = GetEnemy(debug.AllEnemies[i]);
        $template.find(".txt_name").text(enemy.name);
        
        if(enemy.size === "xl") {
            $template.find(".sp_final").addClass("enemySpriteBig huge").css("background-position", "-" + (enemy.spriteidx * 64) + "px 0");
        } else if(enemy.size === "lg") {
            $template.find(".sp_final").addClass("enemySpriteBig").css("background-position", "-" + (enemy.spriteidx * 64) + "px 0");
        } else {
            $template.find(".sp_final").addClass("enemySprite").css("background-position", "-" + (enemy.spriteidx * 48) + "px 0");
        }
        
        $template.find(".sp_sp").addClass( enemy.seasonDistribution[0] > 0.5 ? "stspring" : "stnoSeason" ).attr("title", "Spring Chance: " + enemy.seasonDistribution[0]);
        $template.find(".sp_su").addClass( enemy.seasonDistribution[1] > 0.5 ? "stsummer" : "stnoSeason" ).attr("title", "Summer Chance: " + enemy.seasonDistribution[1]);
        $template.find(".sp_au").addClass( enemy.seasonDistribution[2] > 0.5 ? "stautumn" : "stnoSeason" ).attr("title", "Autumn Chance: " + enemy.seasonDistribution[2]);
        $template.find(".sp_wi").addClass( enemy.seasonDistribution[3] > 0.5 ? "stwinter" : "stnoSeason" ).attr("title", "Winter Chance: " + enemy.seasonDistribution[3]);
        
        $template.find(".txt_hp").text(enemy.health);
        $template.find(".txt_atk").text(enemy.atk);
        $template.find(".txt_def").text(enemy.def);
        $template.find(".txt_size").text(enemy.fieldwidth + "x" + enemy.fieldheight);
        $template.find(".txt_exp").text(enemy.exp);
        
        var drops = [];
        if(enemy.drops !== undefined) {
            for(var j = 0; j < enemy.drops.length; j++) {
                var drop = enemy.drops[j];
                if(drop.money) {
                    if(drop.min === drop.max) {
                        drops.push(drop.min + "G");
                    } else {
                        drops.push(drop.min + "-" + drop.max + "G");
                    }
                } else {
                    var name = GetCrop(drop.seed).displayname;
                    if(drop.min === drop.max) {
                        drops.push(drop.min + " " + name);
                    } else {
                        drops.push(drop.min + "-" + drop.max + " " + name);
                    }
                }
            }
        }
        $template.find(".txt_attacks").text(GetDocumentationAttackPatterns(enemy.attackType));
        if(drops.length === 0) {
            $template.find(".txt_drops").text("None");
        } else {
            $template.find(".txt_drops").text(drops.join(", "));
        }
        
        $enemies.append($template);
    }
}
function GetEnemyName(name) { 
    switch(name) {
        case "Jeff": name = "ScienceMan"; break;
        case "Fucker": name = "bigBot"; break;
        case "research": name = "robo2"; break;
        case "fish": name = "fishFace"; break;
        case "seamonk": name = "seaMonk"; break;
        case "chickbot": name = "chickBot"; break;
        case "pig": name = "piggun"; break;
        case "mobsty1": 
        case "wildmobsty": 
        return "Mobster"; break;
        case "mobsty2": return "Stronger Mobster"; break;
        case "MobBoss": name = "mobBoss"; break;
        case "HOUSEKEEPER": name = "housekeeper"; break;
        case "carBr": name = "brownCar"; break;
        case "carBl": name = "blueCar"; break;
        case "carRe": name = "redCar"; break;
    }
    return GetText("e." + name + "0");
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
function DoCropGen() {
    var $crops = $("#crops > .content");
    for(var i = 0; i < debug.AllCrops.length; i++) {
        if(debug.AllCrops[i] === "specialgrapes") { continue; }
        var $template = $("#cropTemplate").clone();
        $template.removeClass("template").removeAttr("id");
        var crop = GetCrop(debug.AllCrops[i]);
        $template.find(".txt_name").text(crop.displayname);
        $template.find(".txt_info").text(GetText(crop.name));
        var typeName = ""; var typeClass = "";
        switch(crop.type) {
            case "veg": typeName = "Vegetable"; typeClass = "dirt"; break;
            case "tree": typeName = "Fruit"; typeClass = "dirt"; break;
            case "bee": typeName = "Bee"; typeClass = "_beehive"; break;
            case "rice": typeName = "Paddy Crop"; typeClass = "_paddy"; break;
            case "spear":
            case "rod": 
            case "water": typeName = "Water"; typeClass = "_lake"; break;
            case "food": typeName = "Feed"; typeClass = "_cow"; break;
            case "mush": typeName = "Mushroom"; typeClass = "_log"; break;
            case "egg": typeName = "Egg"; typeClass = "_coop"; break;
            case "tech": 
            case "sickle2": typeName = "Technology"; typeClass = "_hotspot"; break;
        }
        $template.find(".txt_type").text(typeName);
        $template.find(".txt_size").text(crop.size === 1 ? "Small" : "Large");
        $template.find(".txt_size").attr("title", crop.size === 1 ? "1x1 tiles" : "2x2 tiles");
        $template.find(".sp_type").addClass("st" + typeClass);
        
        if(SameSprites(crop.name, crop.name + "seed")) {
            $template.find(".sp_seed").remove();
        } else {
            $template.find(".sp_seed").addClass("s" + crop.name + "seed");
        }
        $template.find(".sp_final").addClass("s" + crop.name);
        
        if(["veg", "tree", "rice", "water", "mush", "egg", "tech"].indexOf(crop.type) >= 0) {
            var $stages = $template.find(".txt_stages");
            if(crop.type === "tree") {
                var treeType = crop.treeSprite || "tree";
                $stages.append($("<span class = 'spriteTiny spriteTinyDouble st" + treeType + "0'></span>"));
                $stages.append($("<span class = 'spriteTiny spriteTinyDouble st" + treeType + "1'></span>"));
                $stages.append($("<span class = 'spriteTiny spriteTinyDouble st" + treeType + "2'></span>"));
                for(var j = 3; j < crop.frames; j++) {
                    $stages.append($("<span class='treeFill'><span class = 'spriteTiny spriteTinyDouble st" + treeType + "2'></span><span class = 'spriteTiny spriteTinyDouble st" + crop.name + (j - 3) + "'></span></span>"));
                }
            } else {
                for(var j = 0; j < crop.frames; j++) {
                    if(crop.size === 2) {
                        $stages.append($("<span class = 'spriteTiny spriteTinyDouble st" + crop.name + j + "'></span>"));
                    } else {
                        $stages.append($("<span class = 'spriteTiny st" + crop.name + j + "'></span>"));
                    }
                }
            }
        }

        $template.find(".sp_sp").addClass( crop.seasons[0] > 0.5 ? "stspring" : "stnoSeason" ).attr("title", "Spring Power: " + crop.seasons[0]);
        $template.find(".sp_su").addClass( crop.seasons[1] > 0.5 ? "stsummer" : "stnoSeason" ).attr("title", "Summer Power: " + crop.seasons[1]);
        $template.find(".sp_au").addClass( crop.seasons[2] > 0.5 ? "stautumn" : "stnoSeason" ).attr("title", "Autumn Power: " + crop.seasons[2]);
        $template.find(".sp_wi").addClass( crop.seasons[3] > 0.5 ? "stwinter" : "stnoSeason" ).attr("title", "Winter Power: " + crop.seasons[3]);

        $template.find(".txt_price").text(crop.price + "G");
        $template.find(".txt_power").text(crop.power);
        $template.find(".txt_time").text(crop.time);
        if(crop.respawn === 0) {
            $template.find(".txt_regrow").parent().remove();
        } else {
            $template.find(".txt_regrow").text(crop.respawn);
        }
            
        var locations = GetNonstandardLocationsForItem(crop.name);
        for(var key in stores) {
            var wares = stores[key].wares;
            for(var j = 0; j < wares.length; j++) {
                if(wares[j].product !== crop.name) { continue; }
                locations.push(shopNames[key]);
                break;
            }
        }
        for(var key in mapentities) {
            var entities = mapentities[key];
            for(var j = 0; j < entities.length; j++) {
                if(entities[j].isChest !== true) { continue; }
                var contents = entities[j].contents;
                for(var k = 0; k < contents.length; k++) {
                    if(contents[k][0] !== crop.name) { continue; }
                    var name = mapNames[key] + " (Chest)";
                    if(locations.indexOf(name) < 0) { locations.push(name); }
                    break;
                }
            }
        }
        for(var k = 2; k <= 50; k++) {
            player.level = k;
            player.inventory = [];
            player.getLevelUpItemBonuses();
            for(var j = 0; j < player.inventory.length; j++) {
                if(player.inventory[j][0] === crop.name) { if(locations.indexOf("Level Up Bonuses") < 0) { locations.push("Level Up Bonuses"); break; } }
            }
        }
        for(var j = 0; j < debug.AllEnemies.length; j++) {
            var enemy = GetEnemy(debug.AllEnemies[j]);
            var drops = enemy.drops;
            for(var k = 0; k < drops.length; k++) {
                if(drops[k].seed === crop.name) { locations.push("Enemy: " + GetEnemyName(debug.AllEnemies[j])); }
            }
        }
        for(var c in scripts) {
            var vals = scripts[c].split("&");
            for(var j = 0; j < vals.length; j++) {
                if(vals[j].indexOf("_GIVE:") < 0) { continue; }
                var givey = vals[j].replace("_GIVE:", "").split(",")[0];
                if(givey === crop.name) { 
                    var val = GetCutsceneIdentifier(c);
                    if(locations.indexOf(val) < 0) { locations.push(val); }
                }
            }
        }

        var $ul = $template.find(".txt_locations");
        if(locations.length === 0) {
            $ul.append("<li class='warning'>NOWHERE</li>");
        } else {
            for(var j = 0; j < locations.length; j++) { $ul.append("<li>" + locations[j] + "</li>"); }
        }
        $crops.append($template);
    }
}
function GetCutsceneIdentifier(c) {
    if(c.match(/abuela\d+/) !== null) { return "South Las Abejas (Old Lady)"; }
    if(c.match(/bigBotW\d+/) !== null) { return "Your Farm (MegaByte Buddy)"; }
    if(c.match(/piratemonk\d+/) !== null) { return "Underwater (Dowel)"; }
    if(c.match(/lime\d+/) !== null) { return "Agrios Forest (Lime)"; }
    if(c.match(/theHappening\d+/) !== null) { return "Produce Stand (Nathan)"; }
    if(c.match(/freeRadish\d+/) !== null) { return "Central Las Abejas"; }
    if(c.match(/brandt\d+/) !== null) { return "Central Las Abejas (Brandt)"; }
    if(c.match(/jeffW\d+/) !== null) { return "Mysterious Research Lab (Dr. Jeff)"; }
    if(c.match(/OfficeHive\d+/) !== null) { return "Central Las Abejas (Beehive)"; }
    if(c.match(/kelpBoy\d+/) !== null || c.match(/kelpHive\d+/) !== null || c.match(/kelpDeadBee\d+/) !== null) { return "Underwater (Kelp Boy)"; }
    if(c.match(/FarmHive\d+/) !== null) { return "Your Farm (Beehive)"; }
    if(c.match(/ForestHive\d+/) !== null) { return "Agrios Forest (Beehive)"; }
    if(c.match(/BelowHive\d+/) !== null) { return "South of Town (Beehive)"; }
    if(c.match(/lotus\d+/) !== null) { return "Food2 Headquarters 4F"; }
    if(c.match(/mushman\d+/) !== null) { return "Central Las Abejas (Daveothy)"; }
    if(c.match(/crazy4trout\d+/) !== null) { return "Central Las Abejas (Jeromy)"; }
    if(c.match(/crouton\d+/) !== null) { return "Fake Farm (Crouton)"; }
    if(c.match(/rap\d+/) !== null) { return "Mysterious Research Lab (RAPBATTLE)"; }
    if(c.match(/eggfairy\d+/) !== null) { return "Produce Stand (Egg Fairy)"; }
    console.log(c);
    return c;
}
function GetNonstandardLocationsForItem(name) {
    switch(name) {
        case "egg":
        case "quail":
        case "goose":
        case "turkey":
        case "platypus":
        case "goldegg": return ["Central Las Abejas (Egg Dealer)"];
        case "ultrarod": return ["Underwater (Dowel)"];
        default: return [];
    }
}

function DoCropTierGen() {
    for(var i = 0; i < debug.AllCrops.length; i++) {
        var crop = GetCrop(debug.AllCrops[i]);
        var $c = $("<span class='sprite s" + crop.name + "' title='" + crop.displayname + "'></span>");
        if(crop.power > 10) {
            $("#tierX").append($c);
        } else {
            $("#tier" + crop.power).append($c);
        }
    }
}

function DoLevelGen() {
    var $maps = $("#maps > .content");
    for(var i = 0; i < debugAllMaps.length; i++) {
        var $template = $("#mapTemplate").clone();
        $template.removeClass("template").removeAttr("id");
        var mapName = debugAllMaps[i];
        var mapData = mapentities[mapName];
        $template.find(".sp_final").attr("src", "guide_assets/map_" + mapName + ".png");
        $template.find(".txt_name").text(mapNames[mapName]);
        var $details = $template.find(".additionalDetails");
        
        var $mapDad = $template.find(".mapContainer");
        var counts = {};
        var existingObjs = {};
        var lastObj = { name: "" };
        var mapObjects = [];
        for(var j = 0; j < mapData.length; j++) {
            var obj = mapData[j];
            if(obj.name === undefined) { continue; }
            if(obj.name.replace("R", "L") === lastObj.name) { continue; }
            lastObj = obj;
            if(obj.name.indexOf("H_") === 0) { continue; }
            if(namesToIgnore.indexOf(obj.name) >= 0) { continue; }
            if(obj.pos.x < 0 && obj.pos.y < 0) { continue; }
            if(obj.boring === true || obj.jumbo === true) { continue; }
            if(obj.name.indexOf("waterfall") === 0 && obj.name[obj.name.length - 1] !== "0") { continue; }
            
            var mapObj = GetMapObjData(obj, $details, counts);
            if(mapObj.type === "?") { console.log(obj); continue; }
            
            var count = 1;
            if(counts[mapObj.type] === undefined) {
                if(mapObj.subtype === undefined) {
                    counts[mapObj.type] = 2;
                } else {
                    counts["full"] = 2;
                    counts[mapObj.type] = {};
                    counts[mapObj.type][mapObj.subtype] = 1;
                }
            } else {
                if(mapObj.subtype === undefined) {
                    count = counts[mapObj.type]++;
                    if(mapObj.type === "Treasure") { mapObj.dontShowOnBottom = true; }
                } else if(counts[mapObj.type][mapObj.subtype] === undefined) {
                    count = counts["full"]++;
                    counts[mapObj.type][mapObj.subtype] = count;
                } else {
                    count = counts[mapObj.type][mapObj.subtype];
                    mapObj.dontShowOnBottom = true;
                }
            }
            if(mapObj.dispCount === undefined) { mapObj.dispCount = count; }
            if(mapObj.sortCount === undefined) { mapObj.sortCount = count; }
            if(!mapObj.dontShowOnBottom) { mapObjects.push(mapObj); }
            
            if(mapObj.infoText !== undefined && !mapObj.dontShowOnBottom) {
                var $specialTemplate = $("#specialTemplate").clone();
                $specialTemplate.removeClass("template").removeAttr("id");
                $specialTemplate.find(".txt_name").text(mapObj.text);
                $specialTemplate.find(".txt_info").text(mapObj.infoText);
                $details.append($specialTemplate);
            }
            var $md = $("<div class='badge badge-pill " + mapObj.badgeclass + " mapDetail'>" + mapObj.dispCount + "</div>");
            $md.css("top", (16 * (obj.big ? (obj.pos.y + 1) : obj.pos.y)) + "px").css("left", (16 * obj.pos.x) + "px").attr("title", obj.name);
            $mapDad.append($md);
        }
        mapObjects = mapObjects.sort(function(x, y) {
            if(x.order < y.order) { return -1; }
            if(x.order > y.order) { return 1; }
            if(x.sortCount < y.sortCount) { return -1; }
            if(x.sortCount > y.sortCount) { return 1; }
            return 0;
        });
        
        var numCols = 2;
        //if(smallMaps.indexOf(mapName) >= 0) {
        $template.find(".row.wide").remove();
        /*} else {
        $template.find(".row.narrow").remove();
        numCols = 3;
        }*/
        var breakPoint = mapObjects.length / numCols;
        var $l = $template.find(".left");
        var $m = $template.find(".mid");
        var $r = $template.find(".right");
        for(var j = 0; j < mapObjects.length; j++) {
            var obj = mapObjects[j];
            if(obj.dontShowOnBottom) { continue; }
            if(obj.type === "Treasure") { obj.dispCount = "#"; }
            var $obj = $("<div><label><div class='badge badge-pill " + obj.badgeclass + "'>" + obj.dispCount + "</div></label> <span>" + obj.text + "</span></div>");
            if(j < breakPoint) {
                $l.append($obj);
            } else if(numCols === 3 && j < (breakPoint * 2)) {
                $m.append($obj);
            } else {
                $r.append($obj);
            }
        }
        
        $maps.append($template);
    }
}
function GetMapObjData(e, $details, counts) {
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
        var $template = $("#treasureTemplate").clone();
        $template.removeClass("template");
        $template.find(".txt_num").text(counts["Treasure"] || 1);
        var items = e.contents;
        var $wares = $template.find(".wares");
        for(var ii = 0; ii < items.length; ii++) {
            var item = items[ii];
            $wares.append($("<div class='shopItem'><span class='spriteTiny st" + item[0] + "'></span>" + GetCrop(item[0]).displayname + " x"  + item[1] + "</div>"));
        }
        $details.append($template);
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
function GetBossHTML(enemyKey) {
    var $template = $("#bossTemplate").clone();
    $template.removeClass("template").removeAttr("id");
    $template.find(".txt_name").text("Boss: " + GetEnemyName(enemyKey));
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

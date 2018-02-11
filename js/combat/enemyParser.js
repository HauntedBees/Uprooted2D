const enemyHelpers = {
    GetNode: function(name) { for(let i = 0; i < EnemyParser.nodes.length; i++) { if(EnemyParser.nodes[i].id === name) { return EnemyParser.nodes[i]; } } },
    GetSideEffect: function(e, tile) {
        if(tile.saltChance === undefined && tile.burnChance === undefined) { return ""; }
        if(tile.saltChance !== undefined && tile.saltChance > Math.random()) { 
            var res = enemyHelpers.TryDisturbTile(Math.floor(Math.random() * player.gridWidth), Math.floor(Math.random() * player.gridHeight), "salt");
            return res ? "SALT" : "";
        }
        if(tile.burnChance !== undefined && tile.burnChance > Math.random()) { 
            var res = enemyHelpers.BurnTile(e, Math.floor(Math.random() * player.gridWidth), Math.floor(Math.random() * player.gridHeight));
            return res ? "BURN" : "";
        }
    },
    BurnTile: function(e, x, y) {
        var itemTile = player.itemGrid[x][y];
        var crop = combat.grid[x][y];
        var effect = combat.effectGrid[x][y];
        if(effect !== null && effect.type === "splashed") { return { status: false, wet: true }; }
        if(itemTile !== null && itemTile.x !== undefined) { itemTile = player.itemGrid[itemTile.x][itemTile.y]; }
        if(["_cow", "_lake", "_paddy", "_shooter", "_hotspot", "_modulator", "_sprinkler"].indexOf(itemTile) >= 0) { return { status: false }; }
        if(itemTile === "_strongsoil" && (Math.random() * player.luck) > 0.4) { return { status: false }; }

        combat.effectGrid[x][y] = { type: "burned", duration: Math.ceil(Math.log2(e.atk)) };
        if(["_log", "_coop", "_beehive"].indexOf(itemTile) >= 0) {
            var hadTile = (crop !== null);
            if(hadTile) { combat.grid[x][y] = null; }
            return { status: true, crop: hadTile, destroyed: true, special: itemTile };
        }
        if(crop === null) { return { status: true, crop: false, destroyed: false }; }
        var dmg = enemyHelpers.GetCropDamage(e, x, y, 1);

        crop.health -= dmg;
        if(crop.rotten) { crop.health = 0; }
        if(crop.health <= 0) {
            combat.grid[x][y] = null;
            combat.animHelper.DrawCrops();
            return { status: true, crop: true, destroyed: true, special: "" };
        } else {
            return { status: true, crop: true, destroyed: false, special: "" };
        }
    },
    GetEnemyCropAttackDataObj: function(e, targs) {
        var crops = [], elems = [-1], animCrops = [];
        for(var x = 0; x < combat.enemyGrid.length; x++) {
            for(var y = 0; y < combat.enemyGrid[0].length; y++) {
                var tile = combat.enemyGrid[x][y];
                if(tile === null || tile.x !== undefined || tile.type === "card") { continue; }
                if(tile.activeTime > 0 || tile.rotten || tile.type === "babby") { continue; }
                crops.push({crop: tile, x: x, y: y });
                animCrops.push([tile.name, x, y, tile.type, enemyHelpers.GetSideEffect(e, tile)]);
                if(tile.burnChance !== undefined && elems.indexOf(1) < 0) { elems.push(1); }
                if(tile.saltChance !== undefined && elems.indexOf(2) < 0) { elems.push(2); }
            }
        }
        var res = dmgCalcs.CropAttack(false, combat.season, e.atk, crops, targs, elems);
        res[0].animCrops = animCrops;
        return res[0];
    },
    GetEnemyFieldData: function(e, justBabies, includeInactive) {
        var dmg = 0;
        var crops = [];
        for(var x = 0; x < combat.enemyGrid.length; x++) {
            for(var y = 0; y < combat.enemyGrid[0].length; y++) {
                var tile = combat.enemyGrid[x][y];
                if(tile === null || tile.x !== undefined || tile.type === "card") { continue; }
                if(!includeInactive && (tile.activeTime > 0 || tile.rotten)) { continue; }
                if(justBabies) {
                    if(tile.type !== "babby") { continue; }
                } else {
                    if(tile.type === "babby") { continue; }
                }
                dmg += tile.power * Math.max(0.75, Math.log10(e.atk));
                crops.push([tile.name, x, y, tile.type, enemyHelpers.GetSideEffect(e, tile)]);
            }
        }
        if(dmg === 0) { dmg = (e.atk / 1.5); }
        dmg = Math.max(1, Math.round(dmg - player.def));
        return { crops: crops, damage: dmg };
    },
    CanPlantInSpot: function(x, y, isLarge) {
        if(combat.enemyGrid[x][y] !== null) { return false; }
        if(!isLarge) { return true; } 
        if(combat.enemywidth === (x + 1)) { return false; }
        if(combat.enemyheight === (y + 1)) { return false; }
        if(combat.enemyGrid[x + 1][y] !== null) { return false; }
        if(combat.enemyGrid[x][y + 1] !== null) { return false; }
        if(combat.enemyGrid[x + 1][y + 1] !== null) { return false; }
        return true;
    },
    GetAttackData: function(dmg, secondArg, thirdArg, fourthArg) {
        secondArg = secondArg || "";
        const node = EnemyParser.current;
        let outputText = GetText(node.data.textID).replace(/\{0\}/g, EnemyParser.enemy.name).replace(/\{1\}/g, dmg)
                            .replace(/\{2\}/g, secondArg).replace(/\{3\}/g, thirdArg).replace(/\{4\}/g, fourthArg);
        outputText = HandleArticles(outputText, secondArg);
        return { text: outputText, animFPS: node.data.animFPS, animData: node.data.animData };
    },
    TryDisturbTile: function(x, y, type) {
        var itemTile = player.itemGrid[x][y];
        if(itemTile !== null && itemTile.x !== undefined) { itemTile = player.itemGrid[itemTile.x][itemTile.y]; }
        if((itemTile !== null && itemTile !== "_hotspot") || combat.grid[x][y] !== null) { return false; }
        // TODO: destroy crops with rocks and salt (salt resistance!)
        var newCrop = GetCrop(type);
        newCrop.activeTime = newCrop.time;
        combat.grid[x][y] = newCrop;
        return true;
    },
    TrySplashTile: function(e, x, y, noRecursion) {
        var itemPos = player.itemGrid[x][y];
        var initx = x, inity = y;
        if(itemPos !== null && itemPos.x !== undefined) {
            initx = itemPos.x; inity = itemPos.y;
            itemPos = player.itemGrid[itemPos.x][itemPos.y];
        }
        if(["_sprinkler", "_paddy", "_lake", "_cow", "_log", "_coop", "_beehive"].indexOf(itemPos) >= 0) { return { status: false }; }
        if(itemPos === "_strongsoil" && (Math.random() * player.luck) > 0.4) { return { status: false }; }

        if(["_shooter", "_hotspot", "_modulator"].indexOf(itemPos) >= 0) {
            if(!noRecursion && itemPos !== "_shooter") {
                combat.effectGrid[initx][inity] = { type: "shocked", duration: Math.max(1, Math.round(e.atk)) };
                enemyHelpers.TrySplashTile(e, initx + 1, inity, true);
                enemyHelpers.TrySplashTile(e, initx, inity + 1, true);
                enemyHelpers.TrySplashTile(e, initx + 1, inity + 1, true);
            } else {
                combat.effectGrid[x][y] = { type: "shocked", duration: Math.max(1, Math.round(e.atk)) };
            }
        } else {
            combat.effectGrid[x][y] = { type: "splashed", duration: Math.max(1, Math.round(e.atk)) };
        }
        combat.animHelper.DrawBackground();
        var crop = combat.grid[x][y];
        if(crop === null || crop.type === "rock") { return { status: true, crop: false }; }

        return enemyHelpers.DoDamageCrop(e, x, y, 0);
    },
    DoDamageCrop: function(e, x, y, type, useDamage) { // 0 = water, 1 = fire, 2 = salt, -1 = general
        let crop = combat.grid[x][y];
        if(crop === null) { return { status: false }; }
        const dmg = enemyHelpers.GetCropDamage(e, x, y, type, useDamage);
        crop.health -= dmg;
        if(crop.rotten) { crop.health = 0; }
        if(crop.health <= 0) { crop.flagged = true; }
        return { status: true, crop: true, destroyed: (crop.health <= 0) };
    },
    GetCropDamage: function(e, x, y, type, useDamage) { // type: 0 = water, 1 = fire, salt = 2, -1 = general
        let crop = combat.grid[x][y];
        const isBig = (crop.x !== undefined);
        if(isBig) { crop = combat.grid[crop.x][crop.y]; }

        const attackInfo = dmgCalcs.MeleeAttack(false, combat.season, (useDamage === undefined ? e.atk : useDamage), [crop], type)[0];
        let dmg = attackInfo.damage;
        if(isBig) { dmg /= 2; }
        const itemTile = player.itemGrid[x][y];
        if(itemTile === "_strongsoil") { dmg /= 2; }
        const d = isBig ? 1 : 0;
        EnemyParser.targets.push({ x: x + d, y: y + d, type: type });
        return Math.ceil(dmg);
    },
    GetWeakestPlayerCrop: function() {
        var pos = { x: -1, y: -1 };
        var weakestCrop = 999;
        for(var x = 0; x < combat.grid.length; x++) {
            for(var y = 0; y < combat.grid[0].length; y++) {
                var tile = combat.grid[x][y];
                if(tile === null || tile === undefined || tile.x !== undefined || tile.type === "rock") { continue; }
                if(tile.power < weakestCrop) {
                    weakestCrop = tile.power;
                    pos = { x: x, y: y };
                }
            }
        }
        return pos;
    },
    GetPlayerRowWithMostCrops: function() {
        var busiestRow = -1;
        var busiestCount = -1;
        for(var y = 0; y < combat.grid[0].length; y++) {
            var thisRowCount = 0;
            for(var x = 0; x < combat.grid.length; x++) {
                var tile = combat.grid[x][y];
                if(tile === null || tile === undefined || tile.x !== undefined || tile.type === "rock") { continue; }
                thisRowCount++;
            }
            if(thisRowCount > busiestCount) {
                busiestCount = thisRowCount;
                busiestRow = y;
            }
        }
        return busiestRow;
    },
    TryDisturbRandomTile: function(type) {
        var res = enemyHelpers.TryDisturbTile(Math.floor(Math.random() * player.gridWidth), Math.floor(Math.random() * player.gridHeight), type);
        if(!res) { return false; }
        EnemyParser.outputData = enemyHelpers.GetAttackData(0);
        return true;
    },
    DoSomethingToBusiestRow: function(e, somethingFunc, killText, dmgText, regText) {
        var busiestRow = enemyHelpers.GetPlayerRowWithMostCrops();
        var hasDamage = false, hasKills = false;
        for(var x = 0; x < player.gridWidth; x++) {
            var res = somethingFunc(e, x, busiestRow);
            if(!res.status) { continue; }
            else if(!res.crop) { continue; }
            else if(!res.destroyed) { hasDamage = true; }
            else { hasKills = true; }
        }
        if(hasKills) { EnemyParser.current.data.textID = killText; }
        else if(hasDamage) { EnemyParser.current.data.textID = dmgText; }
        else { EnemyParser.current.data.textID = regText; }
        EnemyParser.outputData = enemyHelpers.GetAttackData(0);
        return true;
    },
    HasRottenCrops: function() {
        for(var x = 0; x < combat.enemyGrid.length; x++) {
            for(var y = 0; y < combat.enemyGrid[0].length; y++) {
                var tile = combat.enemyGrid[x][y];
                if(tile === null || tile.x !== undefined || tile.type === "card") { continue; }
                if(tile.rotten) { return true; }
            }
        }
        return false;
    },
    RemoveWeeds: function() {
        for(var x = 0; x < combat.enemyGrid.length; x++) {
            for(var y = 0; y < combat.enemyGrid[0].length; y++) {
                var tile = combat.enemyGrid[x][y];
                if(tile === null || tile.x !== undefined || tile.type === "card") { continue; }
                if(tile.rotten) { combat.enemyGrid[x][y] = null; }
            }
        }
        return false;
    }
};
const EnemyParser = {
    nodes: [], current: null, enemy: null, done: false, outputData: null, targets: [],
    Parse: function(enemy) {
        EnemyParser.nodes = enemyPatterns[enemy.attackType].nodes;
        EnemyParser.current = enemyHelpers.GetNode("node0");
        EnemyParser.enemy = enemy;
        EnemyParser.done = false;
        EnemyParser.outputData = null;
        EnemyParser.targets = [];
        if(enemyHelpers.HasRottenCrops() && Math.random() < enemy.rotClearChance) {
            enemyHelpers.RemoveWeeds();
            EnemyParser.outputData = { text: GetText("enemyRemoveWeeds").replace(/\{0\}/g, enemy.name), animFPS: 4, animData: [[0, 4], [0, 5]] };
        } else {
            EnemyParser.ParseCurrentNode();
        }
        EnemyParser.outputData.targets = EnemyParser.targets;
        return EnemyParser.outputData;
    },
    ParseCurrentNode: function() {
        const nodeContent = EnemyParser.current.data.message;
        let actionResult = true;
        if(nodeContent !== undefined && nodeContent !== "") { actionResult = actions[nodeContent](EnemyParser.enemy, EnemyParser.current.data.action); }
        const conds = EnemyParser.current.next;
        if(conds === undefined) { EnemyParser.done = true; return; }
        let nextNodeId = "";
        if(conds.condition === "random") {
            let rand = Math.random();
            for(var i = 0; i < conds.data.length; i++) {
                const rval = conds.data[i];
                const weight = parseFloat(rval.weight);
                if(rand <= weight) {
                    nextNodeId = rval.next;
                    //console.log("randomly picked " + nextNodeId);
                    break;
                } else { rand -= weight; }
            }
        } else if(conds.data !== undefined) {
            for(let i = 0; i < conds.data.length; i++) {
                const val = conds.data[i];
                const success = conditions[val.condition](EnemyParser.enemy, actionResult);
                if(success) { 
                    //console.log("picked " + nextNodeId + " because it passed the '" + val.condition + "' condition");
                    nextNodeId = val.next;
                    break;
                }
            }
        } else { nextNodeId = conds; }
        EnemyParser.current = enemyHelpers.GetNode(nextNodeId);
        EnemyParser.ParseCurrentNode();
    }
};
const conditions = {
    "HAS_CLOUD": function(e) {
        var crops = enemyHelpers.GetEnemyFieldData(e, false, true).crops;
        if(crops.length === 0) { return false; }
        for(var i = 0; i < crops.length; i++) {
            if(crops[i][3] === "cloud") { return true; }
        }
        return false;
    },
    "PLAYER_HAS_CROPS": function() {
        for(var x = 0; x < combat.grid.length; x++) {
            for(var y = 0; y < combat.grid[0].length; y++) {
                var tile = combat.grid[x][y];
                if(tile !== null && tile !== undefined && tile.x === undefined && tile.type !== "rock") { return true; }
            }
        }
        return false;
    },
    "HURT_BEES": function(e) { return worldmap.angryBees; },
    "HAS_CROPS_READY": function(e) { return enemyHelpers.GetEnemyFieldData(e, false).crops.length > 0; },
    "HAS_BABIES_READY": function(e) { return enemyHelpers.GetEnemyFieldData(e, true).crops.length > 0; },
    "SUCCESS": function(e, condition) { return (condition === true); },
    "WHOPPY_MACHINE_BROKE": function(e) {
        for(var y = 1; y < combat.enemyheight; y++) {
            if(combat.enemyGrid[combat.enemywidth - 1][y] === null)  { return true; }
        }
        return false;
    },
    "BECKETT_MACHINE_BROKE": function(e) {
        for(var y = 0; y < 3; y++) {
            if(combat.enemyGrid[combat.enemywidth - 1][y] === null)  { return true; }
        }
        return false;
    },
    "NOT_SPRING": function(e) { return combat.season != 0; },
    "HAS_LOW_HP": function(e) { return (e.health / e.maxhealth) < 0.5; },
    "UNPLUGGED": function(e) {
        for(var i = 0; i < combat.enemies.length; i++) {
            if(combat.enemies[i].unplugged === true) { return true; }
        }
        return false;
    },
    "ELSE": function(e) { return true; }
};
const actions = {
    "INIT": () => true,
    "END": () => true,
    "SKIP": function() { EnemyParser.outputData = { skip: true }; return true; },
    "TESTSKILL": function(e) { 
        switch(debug.testEnemyState) {
            case "attack":
                EnemyParser.current.data.animData = "ATTACK";
                EnemyParser.current.data.textID = "standardAttack";
                return actions["WEAK_ATTACK"](e);
            case "plantandattack":
                combat.enemyGrid[0][0] = GetCrop("kelp");
                combat.enemyGrid[0][0].activeTime = 0;
                EnemyParser.current.data.animData = "THROW_ENEMY";
                EnemyParser.current.data.textID = "standardAttack";
                return actions["LAUNCH_CROPS"](e);
            case "plantandattackcrop":
                combat.enemyGrid[0][0] = GetCrop("kelp");
                combat.enemyGrid[0][0].activeTime = 0;
                EnemyParser.current.data.animData = "THROW_ENEMY";
                EnemyParser.current.data.textID = "standardAttack";
                return actions["LAUNCH_CROPS_AT_CROPS"](e);
        }
        console.log("could not find " + debug.testEnemyState);
    },
    "NATHAN_PLANT": function(e) {
        var cropsToGrow = [ // these should only be 4 star or higher crops in the end, with a 2 for the season, if possible
            { // spring
                crops: ["asparagus", "carrot", "garlic", "pineapple", "radish", "food2crystal"],
                trees: ["apricot", "avocado"],
                fishs: ["spear", "goodrod", "net"],
                mushs: ["poisnshroom", "blackshroom", "greenshroom"],
                eggie: ["platypus", "turkey", "goose", "quail"],
                abeee: ["beeR", "beeG", "beeB"],
                paddy: ["arborio", "blackrice", "shortgrain", "kelp"]
            },
            { // summer
                crops: ["corn", "tomato", "soybean", "food2crystal"],
                trees: ["avocado", "blackberry", "kiwi", "lemon", "mango", "cacao"],
                fishs: ["spear", "goodrod", "net"],
                mushs: ["poisnshroom", "blackshroom", "greenshroom"],
                eggie: ["platypus", "turkey", "goose", "quail"],
                abeee: ["beeR", "beeG", "beeB"],
                paddy: ["arborio", "blackrice", "shortgrain", "chestnut", "algae", "kelp"]
            },
            { // autumn
                crops: ["beet", "bellpepper", "carrot", "ginger", "spinach", "soybean", "food2crystal"],
                trees: ["apple", "grapes", "cacao"],
                fishs: ["spear", "goodrod", "net"],
                mushs: ["poisnshroom", "blackshroom", "greenshroom", "porcini"],
                eggie: ["platypus", "turkey", "goose", "quail"],
                abeee: ["beeR", "beeG", "beeB"],
                paddy: ["chestnut"]
            },
            { // winter
                crops: ["beet", "leek", "food2crystal"],
                trees: ["apple"],
                fishs: ["spear", "goodrod", "net"],
                mushs: ["poisnshroom", "blackshroom", "porcini"],
                eggie: ["platypus", "turkey", "goose", "quail"],
                abeee: ["beeR", "beeG", "beeB"],
                paddy: ["arborio", "blackrice", "shortgrain", "chestnut"]
            }
        ];
        var availableSpots = [];
        for(var x = 0; x < 3; x++) {
            if(combat.enemyGrid[x][0] === null) { availableSpots.push({ x: x, y: 0, type: "eggie" }); }
            if(combat.enemyGrid[x][1] === null) { availableSpots.push({ x: x, y: 1, type: "fishs" }); }
            for(var y = 2; y < 6; y++) {
                if(combat.enemyGrid[x][y] === null) { availableSpots.push({ x: x, y: y, type: "crops" }); }
                if(y < 5 && combat.enemyGrid[x + 1][y] === null && combat.enemyGrid[x][y + 1] === null && combat.enemyGrid[x + 1][y + 1] === null) {
                    availableSpots.push({ x: x, y: y, type: "trees" });
                }
            }
            if(combat.enemyGrid[x][6] === null) { availableSpots.push({ x: x, y: 6, type: "paddy" }); }
        }
        for(var x = 3; x < 5; x++) {
            if(combat.enemyGrid[x][0] === null) { availableSpots.push({ x: x, y: 0, type: "mushs" }); }
            if(combat.enemyGrid[x][1] === null) { availableSpots.push({ x: x, y: 1, type: "mushs" }); }
            for(var y = 2; y < 6; y++) {
                if(y < 5 && x === 4) {
                    if(combat.enemyGrid[x][y] === null) { availableSpots.push({ x: x, y: y, type: "abeee" }); }
                } else {
                    if(combat.enemyGrid[x][y] === null) { availableSpots.push({ x: x, y: y, type: "crops" }); }
                }
            }
            if(combat.enemyGrid[x][6] === null) { availableSpots.push({ x: x, y: 6, type: "paddy" }); }
        }
        if(availableSpots.length === 0) { return false; }

        var pos = availableSpots[Math.floor(Math.random() * availableSpots.length)];
        var finalCropArr = cropsToGrow[combat.season][pos.type];
        var crop = finalCropArr[Math.floor(Math.random() * finalCropArr.length)];

        var newCrop = GetCrop(crop);
        newCrop.activeTime = newCrop.time;
        combat.enemyGrid[pos.x][pos.y] = newCrop;
        if(newCrop.size === 2) {        
            combat.enemyGrid[pos.x + 1][pos.y] = pos;
            combat.enemyGrid[pos.x][pos.y + 1] = pos;
            combat.enemyGrid[pos.x + 1][pos.y + 1] = pos;
        }
        EnemyParser.outputData = enemyHelpers.GetAttackData(0, newCrop.displayname);
        combat.animHelper.DrawCrops(); // TODO: should this be here?
        combat.animHelper.DrawBottom();
        return true;
    },
    "RETRACT_CROPS": function(e) {
        var dmg = 0;
        var crops = [];
        for(var x = 0; x < 4; x++) {
            for(var y = 2; y < 6; y++) {
                var tile = combat.enemyGrid[x][y];
                if(tile === null || tile.x !== undefined || tile.type === "card") { continue; }
                if(crops.length === 0 || Math.random() > 0.25) { crops.push([tile.name, x, y, tile.type, ""]); }
            }
        }
        if(dmg === 0 || crops.length === 0) { return false; }
        var prevHealth = e.health;
        e.health = Math.min(e.maxhealth, (e.health + dmg));
        var adjustedAmountToHeal = (e.health - prevHealth);
        EnemyParser.outputData = enemyHelpers.GetAttackData(adjustedAmountToHeal);
        EnemyParser.outputData.throwables = fieldData.crops;
        return true;
    },
    "FUCKING_MAIM": function(e) {
        worldmap.angryBees = false;
        for(var x = 0; x < player.gridWidth; x++) {
            for(var y = 0; y < player.gridHeight; y++) {
                enemyHelpers.BurnTile(e, x, y);
                enemyHelpers.BurnTile(e, x, y);
                enemyHelpers.BurnTile(e, x, y);
            }
        }
        var damage = combat.damagePlayer(e.atk * 500);
        EnemyParser.outputData = enemyHelpers.GetAttackData(damage);
        return true;
    },
    "REPAIR_BECK_MACHINE": function(e, crop) {
        var pos = {x: combat.enemywidth - 1, y: 0 };
        var newCrop = GetCrop("conveyorEnd");
        
        for(var y = 0; y < 3; y++) {
            if(combat.enemyGrid[pos.x][y] !== null) { continue; }
            pos.y = y;
            break;
        }
        
        newCrop.activeTime = newCrop.time;
        combat.enemyGrid[pos.x][pos.y] = newCrop;
        EnemyParser.outputData = enemyHelpers.GetAttackData(0, newCrop.displayname);
        combat.animHelper.DrawCrops(); // TODO: should this be here?
        combat.animHelper.DrawBottom();
        return true;
    },
    "REPAIR_MACHINE": function(e, crop) {
        var pos = {x: combat.enemywidth - 1, y: 0 };
        var newCrop = GetCrop("conveyorEnd");
        
        for(var y = 1; y < combat.enemyheight; y++) {
            if(combat.enemyGrid[pos.x][y] !== null) { continue; }
            pos.y = y;
            break;
        }
        
        newCrop.activeTime = newCrop.time;
        combat.enemyGrid[pos.x][pos.y] = newCrop;
        EnemyParser.outputData = enemyHelpers.GetAttackData(0, newCrop.displayname);
        combat.animHelper.DrawCrops(); // TODO: should this be here?
        combat.animHelper.DrawBottom();
        return true;
    },
    "TRY_PLUG": function(e) {
        var plugged = (--e.plugTimer <= 0);
        if(plugged) {
            EnemyParser.current.data.textID = "plugSuccess";
            e.spriteidx = 26;
            e.unplugged = false;
            e.health = e.maxhealth;
            e.def = 50;
        } else {
            EnemyParser.current.data.textID = "plugAttempt";
        }
        EnemyParser.outputData = enemyHelpers.GetAttackData(0);
        return true;
    },
    "CARDGAME": function(e) {
        EnemyParser.current.data.textID = "plantAttack";
        if(e.wacg === undefined) { e.wacg = new ChildrensCardGame(e); }
        var cardData = e.wacg.MakeMove();
        var attackAgain = e.wacg.HandleStatusEffectsAndReturnIfCanAttackAgain();
        EnemyParser.current.data.textID = cardData.textID;
        var damage = 0;
        if(cardData.isAttack) { // TODO: add messages for when crops are damaged/destroyed?
            damage = e.atk;
            if(cardData.action === "attack1") {
                switch(cardData.argval) {
                    case "elem0":
                        if(Math.random() < 0.25) { enemyHelpers.BurnTile(e, Math.floor(Math.random() * player.gridWidth), Math.floor(Math.random() * player.gridHeight)); }
                        break;
                    case "elem1":
                        if(Math.random() < 0.25) { enemyHelpers.TryDisturbTile(Math.floor(Math.random() * player.gridWidth), Math.floor(Math.random() * player.gridHeight), "rock"); }
                        break;
                    case "elem2":
                        if(Math.random() < 0.25) { enemyHelpers.TrySplashTile(e, Math.floor(Math.random() * player.gridWidth), Math.floor(Math.random() * player.gridHeight)); }
                        break;
                    case "elem3":
                        if(Math.random() < 0.25) { enemyHelpers.DoDamageCrop(e, Math.floor(Math.random() * player.gridWidth), Math.floor(Math.random() * player.gridHeight), -1); }
                        break;
                }
            } else if(cardData.action === "attack2") {
                if(cardData.argval === cardData.arg2val) {
                    switch(cardData.argval) {
                        case "elem0":
                            if(Math.random() < 0.25) { 
                                var row = Math.floor(Math.random() * player.gridHeight);
                                for(var x = 0; x < player.gridWidth; x++) { enemyHelpers.BurnTile(e, x, row); }
                            }
                            break;
                        case "elem1":
                            enemyHelpers.TryDisturbTile(Math.floor(Math.random() * player.gridWidth), Math.floor(Math.random() * player.gridHeight), "rock");
                            break;
                        case "elem2":
                            if(Math.random() < 0.25) { 
                                var row = Math.floor(Math.random() * player.gridHeight);
                                for(var x = 0; x < player.gridWidth; x++) { enemyHelpers.TrySplashTile(e, x, row); }
                            }
                            break;
                        case "elem3":
                            enemyHelpers.DoDamageCrop(e, Math.floor(Math.random() * player.gridWidth), Math.floor(Math.random() * player.gridHeight), -1);
                            break;
                    }
                } else {
                    var first = (cardData.argval < cardData.arg2val ? cardData.argval : cardData.arg2val);
                    var second = (cardData.argval < cardData.arg2val ? cardData.arg2val : cardData.argval);
                    if(first === "elem0") {
                        switch(second) {
                            case "elem1": // fire + earth
                                if(Math.random() < 0.10) {
                                    enemyHelpers.TryDisturbTile(Math.floor(Math.random() * player.gridWidth), Math.floor(Math.random() * player.gridHeight), "rock");
                                    enemyHelpers.BurnTile(e, Math.floor(Math.random() * player.gridWidth), Math.floor(Math.random() * player.gridHeight));
                                }
                                break;
                            case "elem2": damage = Math.floor(damage * 0.5); break; // fire + water
                            case "elem3": // fire + tech
                                if(Math.random() < 0.25) {
                                    enemyHelpers.DoDamageCrop(e, Math.floor(Math.random() * player.gridWidth), Math.floor(Math.random() * player.gridHeight), -1);
                                    enemyHelpers.DoDamageCrop(e, Math.floor(Math.random() * player.gridWidth), Math.floor(Math.random() * player.gridHeight), -1);
                                    enemyHelpers.BurnTile(e, Math.floor(Math.random() * player.gridWidth), Math.floor(Math.random() * player.gridHeight));
                                    enemyHelpers.BurnTile(e, Math.floor(Math.random() * player.gridWidth), Math.floor(Math.random() * player.gridHeight));
                                }
                                break;
                        }
                    } else if(first === "elem1") {
                        switch(second) {
                            case "elem2": // earth + water
                                if(Math.random() < 0.5) { enemyHelpers.TryDisturbTile(Math.floor(Math.random() * player.gridWidth), Math.floor(Math.random() * player.gridHeight), "salt"); }
                                break;
                            case "elem3": damage = Math.floor(damage * 1.5); break; // earth + tech
                        }
                    } else if(first === "elem2") { // water + tech
                        if(Math.random() < 0.25) {
                            var row = Math.floor(Math.random() * player.gridHeight);
                            for(var x = 0; x < player.gridWidth; x++) { enemyHelpers.DoDamageCrop(e, x, row, -1); }
                        }
                    }
                }
            }
        }
        if(damage > 0) { damage = combat.damagePlayer(damage); }
        EnemyParser.outputData = enemyHelpers.GetAttackData(damage, cardData.cardName, cardData.arg, cardData.arg2);
        if(attackAgain) { EnemyParser.outputData.attackAgain = true; }
        return true;
    },
    "HOUSEKEEPER": function(e) {
        var cropData = enemyHelpers.GetEnemyFieldData(e, false, false);
        var hasCrops = cropData.crops.length > 0;
        var attackAnim = [[0,2],[0,3],[0,4],[0,5,true]];
        var stdAnim = [[0,2],[0,3],[0,4],[0,5]];
        EnemyParser.current.data.animData = attackAnim;
        if(conditions["HAS_CLOUD"](e)) {
            if(hasCrops && Math.random() > 0.75) {
                EnemyParser.current.data.textID = "hkAtkAttack";
                return actions["LAUNCH_CROPS"](e);
            }
            var cloudPower = 0;
            var crops = enemyHelpers.GetEnemyFieldData(e, false, true).crops;
            for(var i = 0; i < crops.length; i++) {
                if(crops[i][3] === "cloud") {
                    var x = crops[i][1];
                    var y = crops[i][2];
                    cloudPower = combat.enemyGrid[x][y].power;
                    break;
                }
            }
            var abilities = ["rock"];
            if(cloudPower > 5) { abilities.push("splash"); }
            if(cloudPower > 10) { abilities.push("splashrow"); }
            if(cloudPower > 15) { abilities.push("plantmult"); }
            if(cloudPower > 20) { abilities.push("attackweak"); }
            if(cloudPower > 25) { abilities.push("season"); }
            if(cloudPower > 30) { abilities.push("heal"); }
            if(cloudPower > 35) { abilities.push("threaten"); }
            var attack = abilities[Math.floor(Math.random() * abilities.length)];
            if(attack === "rock") {
                EnemyParser.current.data.textID = "hkAtkRock";
                if(actions["TRY_THROW_ROCK"](e)) { return true; }
                EnemyParser.current.data.animData = stdAnim;
                EnemyParser.current.data.textID = "hkAtkError1";
                EnemyParser.outputData = enemyHelpers.GetAttackData(0);
                return true;
            } else if(attack === "splash") {
                var weakestPos = enemyHelpers.GetWeakestPlayerCrop();
                if(weakestPos.x < 0) {
                    EnemyParser.current.data.textID = "hkAtkError2";
                    EnemyParser.current.data.animData = stdAnim;
                    EnemyParser.outputData = enemyHelpers.GetAttackData(0);
                    return true;
                } else {
                    var res = enemyHelpers.TrySplashTile(e, weakestPos.x, weakestPos.y);
                    if(!res.status) { EnemyParser.current.data.textID = "splashFail"; }
                    else if(!res.crop) { EnemyParser.current.data.textID = "splashSucc"; }
                    else if(!res.destroyed) { EnemyParser.current.data.textID = "splashDamage"; }
                    else { EnemyParser.current.data.textID = "splashKill"; }
                    EnemyParser.outputData = enemyHelpers.GetAttackData(0);
                    return true;
                }
            } else if(attack === "splashrow") {
                var busiestRow = enemyHelpers.GetPlayerRowWithMostCrops();
                var hasDamage = false, hasKills = false;
                for(var x = 0; x < player.gridWidth; x++) {
                    var res = enemyHelpers.TrySplashTile(e, x, busiestRow);
                    if(!res.status) { continue; }
                    else if(!res.crop) { continue; }
                    else if(!res.destroyed) { hasDamage = true; }
                    else { hasKills = true; }
                }
                if(hasKills) {
                    EnemyParser.current.data.textID = "splashRowKill";
                } else if(hasDamage) {
                    EnemyParser.current.data.textID = "splashRowDamage";
                } else {
                    EnemyParser.current.data.textID = "splashRow";
                }
                EnemyParser.outputData = enemyHelpers.GetAttackData(0);
                return true;
            } else if(attack === "plantmult") {
                EnemyParser.current.data.animData = stdAnim;
                EnemyParser.current.data.textID = "hkAtkPlantOne";
                var canPlantOne = actions["TRY_PLANT_CROP"](e, "lightbulb");
                if(!canPlantOne) {
                    EnemyParser.current.data.textID = "hkAtkCantPlant";
                    EnemyParser.outputData = enemyHelpers.GetAttackData(0);
                    return true;
                } 
                EnemyParser.current.data.textID = "hkAtkPlantTwo";
                if(actions["TRY_PLANT_CROP"](e, "lightbulb")) { return true; }
                return true;
            } else if(attack === "attackweak") {
                var weakestPos = enemyHelpers.GetWeakestPlayerCrop();
                if(weakestPos.x < 0) {
                    EnemyParser.current.data.animData = stdAnim;
                    EnemyParser.current.data.textID = "hkAtkError3";
                    EnemyParser.outputData = enemyHelpers.GetAttackData(0);
                    return true;
                } else {
                    var res = enemyHelpers.DoDamageCrop(e, weakestPos.x, weakestPos.y, -1);
                    if(res.destroyed) {
                        EnemyParser.current.data.textID = "hkCropKill";
                    } else {
                        EnemyParser.current.data.textID = "hkCropAttack";
                    }
                    EnemyParser.outputData = enemyHelpers.GetAttackData(0);
                    return true;
                }
            } else if(attack === "season") {
                EnemyParser.current.data.animData = stdAnim;
                var seasons = [0, 0, 0, 0];
                for(var x = 0; x < combat.grid.length; x++) {
                    for(var y = 0; y < combat.grid[0].length; y++) {
                        var tile = combat.grid[x][y];
                        if(tile === null || tile === undefined || tile.x !== undefined || tile.type === "rock") { continue; }
                        for(var i = 0; i < 4; i++) { seasons[i] += tile.seasons[i]; }
                    }
                }
                var weakestSeason = 0;
                var lowestNum = 1000;
                for(var s = 0; s < 4; s++) {
                    if(seasons[s] < lowestNum) {
                        weakestSeason = s;
                        lowestNum = seasons[s];
                    }
                }
                var seasonStr = "Spring";
                switch(weakestSeason) {
                    case 1: seasonStr = "Summer"; break;
                    case 2: seasonStr = "Autumn"; break;
                    case 3: seasonStr = "Winter"; break;
                }
                combat.season = weakestSeason;
                combat.adjustEnemyStatsWeather();
                EnemyParser.current.data.textID = "hkSeasonChange";
                EnemyParser.outputData = enemyHelpers.GetAttackData(0, seasonStr);
                return true;
            } else if(attack === "heal") {
                var weakestEnemy = combat.enemies[0];
                var lowestHP = weakestEnemy.health;
                for(var i = 1; i < combat.enemies.length; i++) {
                    if(combat.enemies[i].health < lowestHP) {
                        weakestEnemy = combat.enemies[i];
                        lowestHP = weakestEnemy.health;
                    }
                }
                EnemyParser.current.data.textID = "hkHeal";
                var base = 30;
                var rangeSize = 25;
                var amountToHeal = (base - rangeSize) + Math.floor(Math.random() * rangeSize * 2);
                var prevHealth = weakestEnemy.health;
                weakestEnemy.health = Math.min(weakestEnemy.maxhealth, (weakestEnemy.health + amountToHeal));
                var adjustedAmountToHeal = (weakestEnemy.health - prevHealth);
                EnemyParser.outputData = enemyHelpers.GetAttackData(adjustedAmountToHeal, weakestEnemy.name);
            } else {
                EnemyParser.current.data.animData = stdAnim;
                EnemyParser.current.data.textID = "hkCreepy" + Math.floor(Math.random() * 6);
                EnemyParser.outputData = enemyHelpers.GetAttackData(0);
                return true;
            }
        } else {
            if(hasCrops) {
                EnemyParser.current.data.textID = "hkAtkAttack";
                return actions["LAUNCH_CROPS"](e);
            } else {
                if(Math.random() > 0.5) {
                    EnemyParser.current.data.animData = stdAnim;
                    EnemyParser.current.data.textID = "hkAtkPlantOne";
                    if(actions["TRY_PLANT_CROP"](e, "lightbulb")) { return true; }
                    EnemyParser.current.data.textID = "hkAtkCantPlant";
                    EnemyParser.outputData = enemyHelpers.GetAttackData(0);
                    return true;
                } else {
                    EnemyParser.current.data.textID = "hkAtkAttack";
                    var damage = combat.damagePlayer(cropData.damage);
                    EnemyParser.outputData = enemyHelpers.GetAttackData(cropData.damage);
                    return true; 
                }
            }
        }
    },
    "BOOST_CLOUD": function(e) {
        EnemyParser.outputData = enemyHelpers.GetAttackData(0); 
        var crops = enemyHelpers.GetEnemyFieldData(e, false, true).crops;
        for(var i = 0; i < crops.length; i++) {
            if(crops[i][3] === "cloud") {
                var x = crops[i][1];
                var y = crops[i][2];
                combat.enemyGrid[x][y].power++;
                return true;
            }
        }
        return true;
    },
    "CONVINCEATRON": function(e) {
        var damage = 0;
        if(tutorial.state === 23) {
            damage = combat.damagePlayer(1);
            EnemyParser.current.data = {
                textID: "tutEnemy" + tutorial.state,
                animFPS: 12,
                animData: [ [0, 2], [0, 2], [0, 3], [0, 0, true] ]
            };
        } else {
            EnemyParser.current.data = {
                textID: "tutEnemy" + tutorial.state,
                animFPS: 4,
                animData: [ [0, 4], [0, 5] ]
            }
        }
        EnemyParser.outputData = enemyHelpers.GetAttackData(damage);
        EnemyParser.current.data = { message: "CONVINCEATRON" };
        return true;
    },
    "CONVINCEATRON2": function(e) {
        var damage = 0;
        if(e.convinceState === undefined) {
            e.convinceState = 1;
            EnemyParser.current.data = { textID: "convince2.0", animFPS: 4, animData: [ [0, 4], [0, 5] ] };
        } else if(e.convinceState === 4) {
            EnemyParser.current.data = { textID: "convince2.4", animFPS: 24, animData: [ [0, 0], [0, 2], [0, 3], [0, 2], [0, 3] ] };
            e.convinceState = 5;
        } else {
            EnemyParser.current.data = { textID: "convince2." + e.convinceState, animFPS: 4, animData: [ [0, 4], [0, 5] ] };
            e.convinceState++;
        }
        EnemyParser.outputData = enemyHelpers.GetAttackData(0);
        EnemyParser.current.data = { message: "CONVINCEATRON2" };
        return true;
    },
    "HEAL_FROM_CROPS": function(e) {
        var fieldData = enemyHelpers.GetEnemyFieldData(e, false);
        var amountToHeal = Math.ceil(fieldData.damage / 3);
        var prevHealth = e.health;
        e.health = Math.min(e.maxhealth, (e.health + amountToHeal));
        var adjustedAmountToHeal = (e.health - prevHealth);
        EnemyParser.outputData = enemyHelpers.GetAttackData(adjustedAmountToHeal);
        EnemyParser.outputData.throwables = fieldData.crops;
        return true;
    },
    "LAUNCH_CROPS": function(e) {
        var fieldData = enemyHelpers.GetEnemyCropAttackDataObj(e, [dmgCalcs.GetPlayerCombatDefense()]);
        var damage = combat.damagePlayer(fieldData.damage);
        EnemyParser.outputData = enemyHelpers.GetAttackData(damage);
        EnemyParser.outputData.throwables = fieldData.animCrops;
        return true;
    },
    "LAUNCH_CROPS_AT_CROPS": function(e) {
        let attempts = 5, pos = null;
        while(attempts-- > 0) {
            const x = Math.floor(Math.random() * player.gridWidth);
            const y = Math.floor(Math.random() * player.gridHeight);
            const tile = combat.grid[x][y];
            if(tile === null || tile.x !== undefined || tile.type === "rock") { continue; }
            pos = { x: x, y: y };
        }
        if(pos === null) {
            for(let x = 0; x < player.gridWidth; x++) {
                if(pos !== null) { break; }
                for(let y = 0; y < player.gridHeight; y++) {
                    const tile = combat.grid[x][y];
                    if(tile === null || tile.x !== undefined || tile.type === "rock") { continue; }
                    pos = { x: x, y: y };
                    break;
                }
            }
        }
        if(pos === null) { return false; }
        const fieldData = enemyHelpers.GetEnemyCropAttackDataObj(e, [combat.grid[pos.x][pos.y]]);
        const res = enemyHelpers.DoDamageCrop(e, pos.x, pos.y, -1, fieldData.damage);
        if(res.destroyed) {
            EnemyParser.current.data.textID = "cropKill";
        } else {
            EnemyParser.current.data.textID = "cropAttack";
        }
        EnemyParser.outputData = enemyHelpers.GetAttackData(0);
        EnemyParser.outputData.throwables = fieldData.animCrops;
        return true;
    },
    "TRY_THROW_ROCK": (e) => enemyHelpers.TryDisturbRandomTile("rock"),
    "TECH_THROW_ROCK": (e) => enemyHelpers.TryDisturbRandomTile("engine"),
    "TIRE_CHUCK": (e) => enemyHelpers.TryDisturbRandomTile("tire"),
    "BECKETT_WATER": (e) => enemyHelpers.DoSomethingToBusiestRow(e, enemyHelpers.TrySplashTile, "splashRowKill", "splashRowDamage", "splashRow"),
    "BECK_FIRE_ROW": (e) => enemyHelpers.DoSomethingToBusiestRow(e, enemyHelpers.BurnTile, "burnKill", "burnDamage", "burnSucc"),
    "BECK_THROW_SALT": function(e) { 
        var row = Math.floor(Math.random() * player.gridHeight);
        var hasKills = false;
        for(var x = 0; x < player.gridWidth; x++) {
            var tile = combat.grid[x][row];
            if(tile === null) {
                if(Math.random() < 0.33) {
                    enemyHelpers.TryDisturbTile(x, row, "salt");
                }
            } else {
                if(tile.x !== undefined || tile.type === "rock") { continue; }
                var res = enemyHelpers.DoDamageCrop(e, x, row, -1);
                if(res && Math.random() < 0.45) {
                    enemyHelpers.TryDisturbTile(x, row, "salt");
                }
                hasKills = hasKills || res;
            }
        }
        if(hasKills) {
            EnemyParser.current.data.textID = "beckettSaltKill";
        } else {
            EnemyParser.current.data.textID = "beckettSalt";
        }
        EnemyParser.outputData = enemyHelpers.GetAttackData(0);
        return true;
    },
    "BECKETT_PLANT": function(e) {
        var pos = {x: -1, y: -1};
        var attempts = 5;

        var potentialCrops = ["bananaPill", "lightbulb", "food2bar", "food2barChoc", "food2powder", "gastank", "timebomb", "shotgun", "download", "drone", "battery"];
        var crop = potentialCrops[Math.floor(Math.random() * potentialCrops.length)];
        var newCrop = GetCrop(crop);
        console.log("getting " + crop);
        console.log(newCrop);
        
        while(attempts-- >= 0 && pos.x < 0) {
            var x = Math.floor(Math.random() * 3);
            var y = 3 + Math.floor(Math.random() * 2);
            if(enemyHelpers.CanPlantInSpot(x, y, false)) {
                pos = { x: x, y: y };
                break;
            }
        }
        if(pos.x < 0) { // random selection didn't work - just go in order
            for(var x = 0; x < 3; x++) {
                if(pos.x >= 0) { break; }
                for(var y = 3; y < 5; y++) {
                    if(enemyHelpers.CanPlantInSpot(x, y, false)) {
                        pos = { x: x, y: y };
                        break;
                    }
                }
            }
        }
        if(pos.x < 0) { return false; }
        newCrop.activeTime = newCrop.time;
        combat.enemyGrid[pos.x][pos.y] = newCrop;
        EnemyParser.outputData = enemyHelpers.GetAttackData(0, newCrop.displayname);
        combat.animHelper.DrawCrops(); // TODO: should this be here?
        combat.animHelper.DrawBottom();
        return true;
    },
    "NERF_THIS": function(e) {
        var pos = {x: -1, y: -1};

        var potentialCrops = ["mushNerf", "riceNerf", "treeNerf", "vegNerf", "fishNerf", "beeNerf", "eggNerf", "reNerf"];
        var crop = potentialCrops[Math.floor(Math.random() * potentialCrops.length)];
        var newCrop = GetCrop(crop);
        
        for(var x = 3; x < 5; x++) {
            if(pos.x >= 0) { break; }
            for(var y = 3; y < 5; y++) {
                if(enemyHelpers.CanPlantInSpot(x, y, false)) {
                    pos = { x: x, y: y };
                    break;
                }
            }
        }
        if(pos.x < 0) { return false; }
        newCrop.activeTime = newCrop.time;
        combat.enemyGrid[pos.x][pos.y] = newCrop;
        EnemyParser.outputData = enemyHelpers.GetAttackData(0, newCrop.displayname);
        combat.animHelper.DrawCrops(); // TODO: should this be here?
        combat.animHelper.DrawBottom();
        return true;
    },
    "REV_ENGINE": function(e) {
        e.atk += 2;
        EnemyParser.outputData = enemyHelpers.GetAttackData(0);
        return true;
    },
    "CLEAR_CACHE": function(e) {
        for(var x = 0; x < combat.enemyGrid.length; x++) {
            for(var y = 0; y < combat.enemyGrid[0].length; y++) {
                var tile = combat.enemyGrid[x][y];
                if(tile === null || tile.x !== undefined) { continue; }
                if(tile.size === 2) { continue; }
                var kill = tile.rotten || Math.random() > 0.75;
                if(!kill) { continue; }
                combat.enemyGrid[x][y] = null;
            }
        }
        combat.animHelper.DrawCrops();
        EnemyParser.outputData = enemyHelpers.GetAttackData(0);
        return true;
    },
    "ATTACK_CROP": function(e) {
        var attempts = 5;
        var pos = null;
        while(attempts-- > 0) {
            var x = Math.floor(Math.random() * player.gridWidth);
            var y = Math.floor(Math.random() * player.gridHeight);
            var tile = combat.grid[x][y];
            if(tile === null || tile.x !== undefined || tile.type === "rock") { continue; }
            pos = { x: x, y: y };
        }
        if(pos === null) {
            for(var x = 0; x < player.gridWidth; x++) {
                if(pos !== null) { break; }
                for(var y = 0; y < player.gridHeight; y++) {
                    var tile = combat.grid[x][y];
                    if(tile === null || tile.x !== undefined || tile.type === "rock") { continue; }
                    pos = { x: x, y: y };
                    break;
                }
            }
        }
        if(pos === null) { return false; }
        var res = enemyHelpers.DoDamageCrop(e, pos.x, pos.y, -1);
        if(res.destroyed) {
            EnemyParser.current.data.textID = "cropKill";
        } else {
            EnemyParser.current.data.textID = "cropAttack";
        }
        EnemyParser.outputData = enemyHelpers.GetAttackData(0);
        return true;
    },
    "HULK_PUNCH": function(e) {
        var row = Math.floor(Math.random() * player.gridHeight);
        var hasKills = false;
        for(var x = 0; x < player.gridWidth; x++) {
            var tile = combat.grid[x][row];
            if(tile === null || tile.x !== undefined || tile.type === "rock") { continue; }
            var res = enemyHelpers.DoDamageCrop(e, x, row, -1);
            hasKills = hasKills || res;
        }
        if(hasKills) {
            EnemyParser.current.data.textID = "hulkPunchKill";
        } else {
            EnemyParser.current.data.textID = "hulkPunch";
        }
        EnemyParser.outputData = enemyHelpers.GetAttackData(0);
        return true;
    },
    "VINE_SMACK": function(e) {
        var row = Math.floor(Math.random() * player.gridHeight);
        var hasKills = false;
        for(var x = 0; x < player.gridWidth; x++) {
            var tile = combat.grid[x][row];
            if(tile === null) {
                if(Math.random() < 0.33) {
                    enemyHelpers.TryDisturbTile(x, row, "salt");
                }
            } else {
                if(tile.x !== undefined || tile.type === "rock") { continue; }
                var res = enemyHelpers.DoDamageCrop(e, x, row, -1);
                if(res && Math.random() < 0.33) {
                    enemyHelpers.TryDisturbTile(x, row, "salt");
                }
                hasKills = hasKills || res;
            }
        }
        if(hasKills) {
            EnemyParser.current.data.textID = "vineSmackKill";
        } else {
            EnemyParser.current.data.textID = "vineSmack";
        }
        EnemyParser.outputData = enemyHelpers.GetAttackData(0);
        return true;
    },
    "SPLASH_TILE": function(e) {
        var res = enemyHelpers.TrySplashTile(e, Math.floor(Math.random() * player.gridWidth), Math.floor(Math.random() * player.gridHeight));
        if(!res.status) { EnemyParser.current.data.textID = "splashFail"; }
        else if(!res.crop) { EnemyParser.current.data.textID = "splashSucc"; }
        else if(!res.destroyed) { EnemyParser.current.data.textID = "splashDamage"; }
        else { EnemyParser.current.data.textID = "splashKill"; }
        EnemyParser.outputData = enemyHelpers.GetAttackData(0);
        return true;
    },
    "IDLE": function(e) {
        EnemyParser.outputData = enemyHelpers.GetAttackData(0);
        return true;
    },
    "THROW_BABY": function(e) {
        var fieldData = enemyHelpers.GetEnemyFieldData(e, true);
        EnemyParser.outputData = enemyHelpers.GetAttackData(0, GetText("e." + GetCrop(fieldData.crops[0][0]).baby + "0"));
        EnemyParser.outputData.throwables = fieldData.crops;
        for(var i = 0; i < fieldData.crops.length; i++) {
            var baby = GetCrop(fieldData.crops[0][0]).baby;
            if(combat.enemies.length < 5) {
                combat.enemies.push(GetEnemy(baby));
            } else if(baby === "soyChild") {
                var enemiesRemoved = 0;
                for(var j = combat.enemies.length - 1; j >= 0; j--) {
                    if(combat.enemies[j].id === baby) {
                        combat.enemies.splice(j, 1);
                        enemiesRemoved++;
                        if(enemiesRemoved === 2) { break; }
                    }
                }
                if(enemiesRemoved === 2) {
                    combat.enemies.push(GetEnemy("soyStack"));
                    combat.animHelper.ResetEnemyAnimHelper(combat.enemies);
                }
            }
        }
    },
    "MODULATE": function (e, season) {
        if(season === "args") {
            var attempts = 5;
            season = parseInt(e.GetRandomArg());
            while(attempts-- > 0 && season === combat.season) {
                season = parseInt(e.GetRandomArg());
            }
        } else if(season.indexOf(",") >= 0) {
            var ssns = season.split(",");
            season = parseInt(Math.floor(Math.random() * ssns.length));
            while(attempts-- > 0 && parseInt(season) === combat.season) {
                season = parseInt(Math.floor(Math.random() * ssns.length));
            }
        } else { season = parseInt(season); }
        var seasonStr = "Spring";
        switch(season) {
            case 1: seasonStr = "Summer"; break;
            case 2: seasonStr = "Autumn"; break;
            case 3: seasonStr = "Winter"; break;
        }
        combat.season = season;
        combat.adjustEnemyStatsWeather();
        EnemyParser.outputData = enemyHelpers.GetAttackData(0, seasonStr);
    },
    "RANDOM_GT": (e, amt) => (Math.random() > parseFloat(amt)),
    "WRITE_TEXT": (e) => EnemyParser.outputData = enemyHelpers.GetAttackData(0),
    "HEAL_RANGE": function(e, amountRange) {
        var rangeVals = amountRange.split(",");
        var base = parseInt(rangeVals[0]);
        var rangeSize = parseInt(rangeVals[1]);
        var amountToHeal = (base - rangeSize) + Math.floor(Math.random() * rangeSize * 2);
        var prevHealth = e.health;
        e.health = Math.min(e.maxhealth, (e.health + amountToHeal));
        var adjustedAmountToHeal = (e.health - prevHealth);
        EnemyParser.outputData = enemyHelpers.GetAttackData(adjustedAmountToHeal);
    },
    "TRY_PLANT_CROP_NERD": function(e, crop) {
        var pos = { x: -1, y: 0 };
        var attempts = 5;
        if(crop === "args") { crop = e.GetRandomArg(); }
        else if(crop.indexOf(",") >= 0) {
            var crops = crop.split(",");
            crop = crops[Math.floor(Math.random() * crops.length)];
        }
        var newCrop = GetCrop(crop);
        var delta = newCrop.size === 2 ? 1 : 0;
        while(attempts-- >= 0 && pos.x < 0) {
            var x = Math.floor(Math.random() * (combat.enemyGrid.length - delta));
            if(enemyHelpers.CanPlantInSpot(x, 0, false)) {
                pos = { x: x, y: 0 };
                break;
            }
        }
        if(pos.x < 0) { // random selection didn't work - just go in order
            for(var x = 0; x < combat.enemyGrid.length - delta; x++) {
                if(pos.x >= 0) { break; }
                if(enemyHelpers.CanPlantInSpot(x, 0, false)) {
                    pos = { x: x, y: 0 };
                    break;
                }
            }
        }
        if(pos.x < 0) { return false; }
        newCrop.activeTime = newCrop.time;
        combat.enemyGrid[pos.x][pos.y] = newCrop;
        EnemyParser.outputData = enemyHelpers.GetAttackData(0, newCrop.displayname);
        combat.animHelper.DrawCrops(); // TODO: should this be here?
        combat.animHelper.DrawBottom();
        return true;
    },
    "TRY_PLANT_CROP": function(e, crop) {
        var pos = {x: -1, y: -1};
        var attempts = 5;
        if(crop === "args") { crop = e.GetRandomArg(); }
        else if(crop.indexOf(",") >= 0) {
            var crops = crop.split(",");
            crop = crops[Math.floor(Math.random() * crops.length)];
        }
        var newCrop = GetCrop(crop);
        var delta = newCrop.size === 2 ? 1 : 0;
        while(attempts-- >= 0 && pos.x < 0) {
            var x = Math.floor(Math.random() * (combat.enemyGrid.length - delta));
            var y = Math.floor(Math.random() * (combat.enemyGrid[0].length - delta));
            if(enemyHelpers.CanPlantInSpot(x, y, newCrop.size === 2)) {
                pos = { x: x, y: y };
                break;
            }
        }
        if(pos.x < 0) { // random selection didn't work - just go in order
            for(var x = 0; x < combat.enemyGrid.length - delta; x++) {
                if(pos.x >= 0) { break; }
                for(var y = 0; y < combat.enemyGrid[0].length - delta; y++) {
                    if(enemyHelpers.CanPlantInSpot(x, y, newCrop.size === 2)) {
                        pos = { x: x, y: y };
                        break;
                    }
                }
            }
        }
        if(pos.x < 0) { return false; }
        newCrop.activeTime = newCrop.time;
        combat.enemyGrid[pos.x][pos.y] = newCrop;
        if(newCrop.size === 2) {        
            combat.enemyGrid[pos.x + 1][pos.y] = pos;
            combat.enemyGrid[pos.x][pos.y + 1] = pos;
            combat.enemyGrid[pos.x + 1][pos.y + 1] = pos;
        }
        EnemyParser.outputData = enemyHelpers.GetAttackData(0, newCrop.displayname);
        combat.animHelper.DrawCrops(); // TODO: should this be here?
        combat.animHelper.DrawBottom();
        return true;
    },
    "MAYBE_TRY_DRINK_KOMBUCHA": function(e) {
        var kombuchaData = null;
        for(var x = 0; x < combat.enemyGrid.length; x++) {
            if(kombuchaData !== null) { break; }
            for(var y = 0; y < combat.enemyGrid[0].length; y++) {
                var tile = combat.enemyGrid[x][y];
                if(tile === null || tile.x !== undefined) { continue; }
                if(tile.name !== "kombucha") { continue; }
                tile.flagged = true;
                tile.activeTime = 0;
                kombuchaData = [tile.name, x, y, tile.type];
                break;
            }
        }
        if(kombuchaData === null) { return false; }
        actions["HEAL_RANGE"](e, "60,35");
        EnemyParser.outputData.throwables = [kombuchaData];
        return true;
    },
    "TRY_PLANT_THREE_CROPS": function(e, crop) {
        var placeholderTitle = EnemyParser.current.data.textID;
        if(!actions["TRY_PLANT_CROP"](e, crop)) { return false; }
        EnemyParser.current.data.textID = placeholderTitle + "2";
        if(!actions["TRY_PLANT_CROP"](e, crop)) {
            EnemyParser.current.data.textID = placeholderTitle;
            return true;
        }
        EnemyParser.current.data.textID = placeholderTitle + "3";
        actions["TRY_PLANT_CROP"](e, crop);
        EnemyParser.current.data.textID = placeholderTitle;
        return true;
    },
    "WEAK_ATTACK": function(e) {
        var damage = dmgCalcs.MeleeAttack(false, combat.season, e.atk, [dmgCalcs.GetPlayerCombatDefense()])[0].damage;
        damage = combat.damagePlayer(damage);
        EnemyParser.outputData = enemyHelpers.GetAttackData(damage);
        return true;
    },
    "WEAKEST_ATTACK": function(e) {
        var damage = combat.damagePlayer(1);
        EnemyParser.outputData = enemyHelpers.GetAttackData(damage);
        return true;
    },
    "PIG_GUN": function(e) {
        var damage = combat.damagePlayer(300);
        EnemyParser.outputData = enemyHelpers.GetAttackData(damage);
        return true;
    }
}
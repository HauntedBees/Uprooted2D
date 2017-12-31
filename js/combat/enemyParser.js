var enemyHelpers = {
    GetNode: function(name) { for(var i = 0; i < EnemyParser.nodes.length; i++) { if(EnemyParser.nodes[i].id === name) { return EnemyParser.nodes[i]; } } },
    GetEnemyFieldData: function(e, justBabies) {
        var dmg = 0;
        var crops = [];
        for(var x = 0; x < combat.enemyGrid.length; x++) {
            for(var y = 0; y < combat.enemyGrid[0].length; y++) {
                var tile = combat.enemyGrid[x][y];
                if(tile === null || tile.x !== undefined) { continue; }
                if(tile.activeTime > 0 || tile.rotten) { continue; }
                if(justBabies) {
                    if(tile.type !== "babby") { continue; }
                } else {
                    if(tile.type === "babby") { continue; }
                }
                dmg += tile.power;
                crops.push([tile.name, x, y, tile.type]);
            }
        }
        dmg += dmg == 0 ? (e.atk / 1.5) : e.atk;
        dmg = Math.max(1, Math.round(dmg - player.def));
        return { crops: crops, damage: dmg };
    },
    CanPlantInSpot: function(x, y, isLarge) {
        if(combat.enemyGrid[x][y] !== null) { return false; }
        if(!isLarge) { return true; } 
        if(combat.enemyGrid[x + 1][y] !== null) { return false; }
        if(combat.enemyGrid[x][y + 1] !== null) { return false; }
        if(combat.enemyGrid[x + 1][y + 1] !== null) { return false; }
        return true;
    },
    GetAttackData: function(dmg, secondArg, thirdArg) {
        secondArg = secondArg || "";
        var node = EnemyParser.current;
        var outputText = GetText(node.data.textID).replace(/\{0\}/g, EnemyParser.enemy.name).replace(/\{1\}/g, dmg).replace(/\{2\}/g, secondArg).replace(/\{3\}/g, thirdArg);
        return { text: outputText, animFPS: node.data.animFPS, animData: node.data.animData };
    },
    TryDisturbTile: function(x, y, type) {
        var itemTile = player.itemGrid[x][y];
        if(itemTile !== null && itemTile.x !== undefined) { itemTile = player.itemGrid[itemTile.x][itemTile.y]; }
        if((itemTile !== null && itemTile !== "_hotspot") || combat.grid[x][y] !== null) { return false; }
        // TODO: destroy weaker crops with rocks?
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
        if(itemPos === "_strongsoil" && (Math.random() * player.luck) > 0.75) { return { status: false }; }

        if(["_shooter", "_hotspot", "_modulator"].indexOf(itemPos) >= 0) {
            if(!noRecursion && itemPos !== "_shooter") {
                combat.effectGrid[initx][inity] = { type: "shocked", duration: e.atk };
                enemyHelpers.TrySplashTile(e, initx + 1, inity, true);
                enemyHelpers.TrySplashTile(e, initx, inity + 1, true);
                enemyHelpers.TrySplashTile(e, initx + 1, inity + 1, true);
            } else {
                combat.effectGrid[x][y] = { type: "shocked", duration: e.atk };
            }
        } else {
            combat.effectGrid[x][y] = { type: "splashed", duration: e.atk };
        }
        combat.animHelper.DrawBackground();
        var crop = combat.grid[x][y];
        if(crop === null) { return { status: true, crop: false }; }

        var dmg = enemyHelpers.GetCropDamage(e, x, y, 0);
        crop.power -= dmg;
        if(crop.rotten) { crop.power = 0; }
        if(crop.power <= 0) {
            combat.grid[x][y] = null;
            combat.animHelper.DrawCrops();
            return { status: true, crop: true, destroyed: true };
        } else {
            return { status: true, crop: true, destroyed: false };
        }
    },
    GetCropDamage: function(e, x, y, type) { // type: 0 = water, 1 = fire
        var crop = combat.grid[x][y];
        var itemTile = player.itemGrid[x][y];
        var dmg = Math.ceil(e.atk / 2);
        if(type === 0 && crop.waterResist) { dmg *= crop.waterResist; }
        else if(type === 1 && crop.fireResist) { dmg *= crop.fireResist; }
        if(crop.x !== undefined) { crop = combat.grid[crop.x][crop.y]; dmg = Math.ceil(dmg / 2); }
        if(itemTile === "_strongsoil") { dmg = Math.round(dmg / 2); }
        return dmg;
    }
};
var EnemyParser = {
    nodes: [], current: null, enemy: null, done: false, outputData: null,
    Parse: function(enemy) {
        EnemyParser.nodes = enemyPatterns[enemy.attackType].nodes;
        EnemyParser.current = enemyHelpers.GetNode("node0");
        EnemyParser.enemy = enemy;
        EnemyParser.done = false;
        EnemyParser.outputData = null;
        EnemyParser.ParseCurrentNode();
        return EnemyParser.outputData;
    },
    ParseCurrentNode: function() {
        var nodeContent = EnemyParser.current.data.message;
        var actionResult = true;
        if(nodeContent !== undefined && nodeContent !== "") { actionResult = actions[nodeContent](EnemyParser.enemy, EnemyParser.current.data.action); }
        var conds = EnemyParser.current.next;
        if(conds === undefined) { EnemyParser.done = true; return; }
        var nextNodeId = "";
        if(conds.condition === "random") {
            var rand = Math.random();
            for(var i = 0; i < conds.data.length; i++) {
                var rval = conds.data[i];
                var weight = parseFloat(rval.weight);
                if(rand <= weight) {
                    nextNodeId = rval.next;
                    break;
                } else { rand -= weight; }
            }
        } else if(conds.data !== undefined) {
            for(var i = 0; i < conds.data.length; i++) {
                var val = conds.data[i];
                var success = conditions[val.condition](EnemyParser.enemy, actionResult);
                if(success) { 
                    nextNodeId = val.next;
                    break;
                }
            }
        } else { nextNodeId = conds; }
        EnemyParser.current = enemyHelpers.GetNode(nextNodeId);
        EnemyParser.ParseCurrentNode();
    }
};
var conditions = {
    "HAS_CROPS_READY": function(e) { return enemyHelpers.GetEnemyFieldData(e, false).crops.length > 0; },
    "HAS_BABIES_READY": function(e) { return enemyHelpers.GetEnemyFieldData(e, true).crops.length > 0; },
    "SUCCESS": function(e, condition) { return (condition === true); },
    "ELSE": function(e) { return true; }
};
var actions = {
    "INIT": function() { return true; },
    "END": function() { return true; },
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
    "LAUNCH_CROPS": function(e) {
        var fieldData = enemyHelpers.GetEnemyFieldData(e, false);
        var damage = combat.damagePlayer(fieldData.damage);
        EnemyParser.outputData = enemyHelpers.GetAttackData(damage);
        EnemyParser.outputData.throwables = fieldData.crops;
        return true;
    },
    "TRY_THROW_ROCK": function(e) { 
        var res = enemyHelpers.TryDisturbTile(Math.floor(Math.random() * player.gridWidth), Math.floor(Math.random() * player.gridHeight), "rock");
        if(!res) { return false; }
        EnemyParser.outputData = enemyHelpers.GetAttackData(0);
        return true;
    },
    "SPLASH_TILE": function(e) {
        var res = enemyHelpers.TrySplashTile(e, Math.floor(Math.random() * player.gridWidth), Math.floor(Math.random() * player.gridHeight));
        if(!res.status) {
            EnemyParser.current.data.textID = "splashFail";
        } else if(!res.crop) {
            EnemyParser.current.data.textID = "splashSucc";
        } else if(!res.destroyed) {
            EnemyParser.current.data.textID = "splashDamage";
        } else {
            EnemyParser.current.data.textID = "splashKill";
        }
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
            combat.enemies.push(GetEnemy(baby));
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
        }
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
    "RANDOM_GT": function(e, amt) { return (Math.random() > parseFloat(amt)); },
    "WRITE_TEXT": function(e) { EnemyParser.outputData = enemyHelpers.GetAttackData(0); },
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
    "TRY_PLANT_CROP": function(e, crop) {
        var pos = {x: -1, y: -1};
        var attempts = 5;
        if(crop === "args") { crop = e.GetRandomArg(); }
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
    "WEAK_ATTACK": function(e) {
        var damage = combat.damagePlayer(e.atk);
        EnemyParser.outputData = enemyHelpers.GetAttackData(damage);
        return true;
    },
    "PIG_GUN": function(e) {
        var damage = combat.damagePlayer(300);
        EnemyParser.outputData = enemyHelpers.GetAttackData(damage);
        return true;
    }
}
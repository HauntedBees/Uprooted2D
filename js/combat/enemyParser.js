const enemyHelpers = {
    GetNode: function(name) { for(let i = 0; i < EnemyParser.nodes.length; i++) { if(EnemyParser.nodes[i].id === name) { return EnemyParser.nodes[i]; } } },
    // Basic Attack Info
    GetAttackData: function(dmg, secondArg, thirdArg, fourthArg) {
        secondArg = secondArg || "";
        const node = EnemyParser.current;
        let outputText = GetText(node.data.textID).replace(/\{0\}/g, EnemyParser.enemy.name).replace(/\{1\}/g, dmg)
                            .replace(/\{2\}/g, secondArg).replace(/\{3\}/g, thirdArg).replace(/\{4\}/g, fourthArg);
        outputText = HandleArticles(outputText, secondArg);
        return { text: outputText, animData: node.data.animData };
    },
    GetSideEffect: function(e, tile) {
        if(tile.saltChance === undefined && tile.burnChance === undefined) { return ""; }
        if(tile.saltChance !== undefined && tile.saltChance > Math.random()) { 
            const res = enemyHelpers.TryDisturbTile(Range(0, player.gridWidth), Range(0, player.gridHeight), "salt");
            return res ? "SALT" : "";
        }
        if(tile.burnChance !== undefined && tile.burnChance > Math.random()) { 
            const res = enemyHelpers.BurnTile(e, Range(0, player.gridWidth), Range(0, player.gridHeight));
            return res ? "BURN" : "";
        }
    },

    // Damaging Tiles
    DoSomethingToBusiestRow: function(e, somethingFunc, killText, dmgText, regText) {
        const busiestRow = enemyHelpers.GetPlayerRowWithMostCrops();
        let hasDamage = false, hasKills = false;
        let affectedTiles = [];
        for(let x = 0; x < player.gridWidth; x++) {
            const res = somethingFunc(e, x, busiestRow);
            affectedTiles.push({ killed: res.destroyed || false, special: res.special || null, groundAffected: res.groundAffected || false });
            if(!res.status) { continue; }
            else if(!res.crop) { continue; }
            else if(!res.destroyed) { hasDamage = true; }
            else { hasKills = true; }
        }
        if(hasKills) { EnemyParser.current.data.textID = killText; }
        else if(hasDamage) { EnemyParser.current.data.textID = dmgText; }
        else { EnemyParser.current.data.textID = regText; }
        EnemyParser.outputData = enemyHelpers.GetAttackData(0);
        EnemyParser.outputData.bonusArgs = { row: busiestRow, tiles: affectedTiles };
        return true;
    },
    TryDisturbRandomTile: function(type) {
        const x = Range(0, player.gridWidth), y = Range(0, player.gridHeight);
        const res = enemyHelpers.TryDisturbTile(x, y, type);
        if(!res) { return false; }
        EnemyParser.outputData = enemyHelpers.GetAttackData(0);
        EnemyParser.outputData.bonusArgs = { type: type, x: x, y: y };
        return true;
    },
    TryDisturbTile: function(x, y, type) {
        let itemTile = player.itemGrid[x][y];
        if(itemTile !== null && itemTile.x !== undefined) { itemTile = player.itemGrid[itemTile.x][itemTile.y]; }
        if((itemTile !== null && itemTile !== "_hotspot" && itemTile !== "_strongsoil")) { return false; }
        if(combat.grid[x][y] !== null) {
            const crop = combat.grid[x][y];
            if(crop.size === 2 || crop.x !== undefined) { return false; }
            let failChance = player.luck + 0.05; // 0.75 to 0.95 (or 0.83 to 1.03 on easy mode)
            if(type === "salt") {
                const saltResist = crop.saltResist || 0;
                switch(saltResist) {
                    case 0: failChance -= 0.3; break; // at best, 0.95 to 0.65
                    case 1: failChance -= 0.05; break; // at best, 0.95 to 0.9
                    case 2: failChance = 1; break; // will always fail
                }
            } else {
                if(crop.rotten || crop.health === 0) { failChance = 0; }
                else { failChance -= (1 - crop.health / crop.maxhealth) / 2; } // assuming the lowest, 0.75, this ranges from 0.75 to ~0.25 for crops about to die
            }
            if(Math.random() <= failChance) { return false; }
        }
        let newCrop = GetCrop(type);
        newCrop.activeTime = newCrop.time;
        combat.grid[x][y] = newCrop;
        return true;
    },
    TrySplashTile: function(e, x, y, noRecursion) {
        let itemPos = player.itemGrid[x][y];
        let initx = x, inity = y;
        if(itemPos !== null && itemPos.x !== undefined) {
            initx = itemPos.x; inity = itemPos.y;
            itemPos = player.itemGrid[itemPos.x][itemPos.y];
        }
        if(["_sprinkler", "_paddy", "_lake", "_cow", "_log", "_coop", "_beehive"].indexOf(itemPos) >= 0) { return { status: false }; }
        if(itemPos === "_strongsoil" && (Math.random() * player.luck) > 0.4) { return { status: false }; }

        let doesWet = Math.random() > (player.luck / 2.5);
        if(["_shooter", "_hotspot", "_modulator"].indexOf(itemPos) >= 0) {
            if(!noRecursion && itemPos !== "_shooter") {
                combat.effectGrid[initx][inity] = { type: "shocked", duration: Math.ceil(Math.log2(e.atk)) };
                enemyHelpers.TrySplashTile(e, initx + 1, inity, true);
                enemyHelpers.TrySplashTile(e, initx, inity + 1, true);
                enemyHelpers.TrySplashTile(e, initx + 1, inity + 1, true);
            } else {
                doesWet = true;
                combat.effectGrid[x][y] = { type: "shocked", duration: Math.ceil(Math.log2(e.atk)) };
            }
        } else if(doesWet) {
            combat.effectGrid[x][y] = { type: "splashed", duration: Math.ceil(Math.log2(e.atk)) };
        }
        const crop = combat.grid[x][y];
        if(crop === null || crop.type === "rock") { return { status: true, crop: false, groundAffected: doesWet }; }

        let res = enemyHelpers.DoDamageCrop(e, x, y, 0);
        res.groundAffected = doesWet;
        return res;
    },
    BurnTile: function(e, x, y) {
        let itemTile = player.itemGrid[x][y];
        let crop = combat.grid[x][y];
        let effect = combat.effectGrid[x][y];
        if(effect !== null && effect.type === "splashed") { return { status: false, wet: true }; }
        if(itemTile !== null && itemTile.x !== undefined) { itemTile = player.itemGrid[itemTile.x][itemTile.y]; }
        if(["_cow", "_lake", "_paddy", "_shooter", "_hotspot", "_modulator", "_sprinkler"].indexOf(itemTile) >= 0) { return { status: false }; }
        if(itemTile === "_strongsoil" && (Math.random() * player.luck) > 0.4) { return { status: false }; }

        let doesBurn = Math.random() > (player.luck / 2.5);
        if(doesBurn) { combat.effectGrid[x][y] = { type: "burned", duration: Math.ceil(Math.log2(e.atk)) }; }
        if(["_log", "_coop", "_beehive"].indexOf(itemTile) >= 0) {
            const hadTile = (crop !== null);
            if(!doesBurn) { doesBurn = Math.random() > (player.luck / 2.5); }
            if(doesBurn && hadTile) { crop.health = 0; crop.flagged = true; }
            return { status: true, crop: hadTile, destroyed: doesBurn && hadTile, special: itemTile, groundAffected: doesBurn };
        }
        if(crop === null) { return { status: true, crop: false, destroyed: false, groundAffected: doesBurn }; }
        let res = enemyHelpers.DoDamageCrop(e, x, y, 1);
        if(res.destroyed) {
            combat.animHelper.DrawCrops();
            return { status: true, crop: true, destroyed: true, special: "", groundAffected: doesBurn };
        } else {
            return { status: true, crop: true, destroyed: false, special: "", groundAffected: doesBurn };
        }
    },
    DoDamageCrop: function(e, x, y, type, useDamage) { // 0 = water, 1 = fire, 2 = salt, -1 = general
        let crop = combat.grid[x][y];
        if(crop === null) { return { status: false }; }
        if(crop.x !== undefined) { crop = combat.grid[crop.x][crop.y]; }
        const dmg = enemyHelpers.GetCropDamage(e, crop, x, y, type, useDamage);
        crop.health -= dmg;
        if(crop.rotten) { crop.health = 0; }
        if(crop.health <= 0) { console.log(`killed ${crop.name} at ${x}, ${y}`); crop.flagged = true; }
        return { status: true, crop: true, destroyed: (crop.health <= 0) };
    },
    GetCropDamage: function(e, crop, x, y, type, useDamage) { // type: 0 = water, 1 = fire, salt = 2, -1 = general
        const isBig = (crop.size === 2);
        const attackInfo = dmgCalcs.MeleeAttack(false, combat.season, (useDamage === undefined ? e.atk : useDamage), [crop], type)[0];
        let dmg = attackInfo.damage;
        console.log(dmg);
        if(isBig) { dmg /= 2; }
        const itemTile = player.itemGrid[x][y];
        if(itemTile === "_strongsoil") { dmg /= 2; }
        const d = isBig ? 1 : 0;
        EnemyParser.targets.push({ x: x + d, y: y + d, type: type });
        return Math.ceil(dmg);
    },

    // Queries
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
    GetEnemyCropAttackDataObj: function(e, targs) {
        let crops = [], elems = [-1], animCrops = [];
        for(let x = 0; x < combat.enemyGrid.length; x++) {
            for(let y = 0; y < combat.enemyGrid[0].length; y++) {
                const tile = combat.enemyGrid[x][y];
                if(tile === null || tile.x !== undefined || tile.type === "card") { continue; }
                if(tile.activeTime > 0 || tile.rotten || tile.type === "babby") { continue; }
                crops.push({crop: tile, x: x, y: y });
                animCrops.push([tile.name, x, y, tile.type, enemyHelpers.GetSideEffect(e, tile)]);
                if(tile.burnChance !== undefined && elems.indexOf(1) < 0) { elems.push(1); }
                if(tile.saltChance !== undefined && elems.indexOf(2) < 0) { elems.push(2); }
            }
        }
        let res = dmgCalcs.CropAttack(false, combat.season, e.atk, crops, targs, elems);
        res[0].animCrops = animCrops;
        return res[0];
    },
    GetEnemyFieldData: function(e, justBabies, includeInactive, forHealing) {
        let dmg = 0, crops = [];
        for(let x = 0; x < combat.enemyGrid.length; x++) {
            for(let y = 0; y < combat.enemyGrid[0].length; y++) {
                const tile = combat.enemyGrid[x][y];
                if(tile === null || tile.x !== undefined || tile.type === "card") { continue; }
                if(!includeInactive && (tile.activeTime > 0 || tile.rotten)) { continue; }
                if(justBabies) {
                    if(tile.type !== "babby") { continue; }
                } else {
                    if(tile.type === "babby") { continue; }
                    if(forHealing && tile.type === "egg") { continue; }
                }
                dmg += tile.power * Math.max(0.75, Math.log10(e.atk));
                crops.push([tile.name, x, y, tile.type, enemyHelpers.GetSideEffect(e, tile)]);
            }
        }
        if(dmg === 0) { dmg = (e.atk / 1.5); }
        dmg = Math.max(1, Math.round(dmg - player.def));
        return { crops: crops, damage: dmg };
    },
    GetWeakestPlayerCrop: function() {
        let pos = { x: -1, y: -1 }, weakestCrop = 999;
        for(let x = 0; x < combat.grid.length; x++) {
            for(let y = 0; y < combat.grid[0].length; y++) {
                const tile = combat.grid[x][y];
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
        let busiestRow = -1, busiestCount = -1;
        for(let y = 0; y < combat.grid[0].length; y++) {
            let thisRowCount = 0;
            for(let x = 0; x < combat.grid.length; x++) {
                const tile = combat.grid[x][y];
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
    HasRottenCrops: function() {
        for(let x = 0; x < combat.enemyGrid.length; x++) {
            for(let y = 0; y < combat.enemyGrid[0].length; y++) {
                const tile = combat.enemyGrid[x][y];
                if(tile === null || tile.x !== undefined || tile.type === "card") { continue; }
                if(tile.rotten && tile.type !== "water") { return true; }
            }
        }
        return false;
    },
    RemoveWeeds: function() {
        for(let x = 0; x < combat.enemyGrid.length; x++) {
            for(let y = 0; y < combat.enemyGrid[0].length; y++) {
                const tile = combat.enemyGrid[x][y];
                if(tile === null || tile.x !== undefined || tile.type === "card") { continue; }
                if(tile.rotten && tile.type !== "water") { combat.enemyGrid[x][y] = null; }
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
            EnemyParser.outputData = { text: GetText("enemyRemoveWeeds").replace(/\{0\}/g, enemy.name), animData: "PLANT" };
        } else {
            EnemyParser.ParseCurrentNode();
        }
        EnemyParser.outputData.targets = EnemyParser.targets;
        return EnemyParser.outputData;
    },
    ParseCurrentNode: function() {
        const nodeContent = EnemyParser.current.data.message;
        let actionResult = true;
        console.log(EnemyParser.current);
        if(nodeContent !== undefined && nodeContent !== "") { actionResult = actions[nodeContent](EnemyParser.enemy, EnemyParser.current.data.action); }
        const conds = EnemyParser.current.next;
        if(conds === undefined) { EnemyParser.done = true; return; }
        let nextNodeId = "";
        if(conds.condition === "random") {
            let rand = Math.random();
            for(let i = 0; i < conds.data.length; i++) {
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
    "ELSE": e => true,
    "HURT_BEES": e => worldmap.angryBees,
    "HAS_CROPS_READY": e => enemyHelpers.GetEnemyFieldData(e, false).crops.length > 0,
    "HAS_BABIES_READY": e => enemyHelpers.GetEnemyFieldData(e, true).crops.length > 0,
    "SUCCESS": (e, condition) => condition === true,
    "NOT_SPRING": e => combat.season != 0,
    "HAS_LOW_HP": e => (e.health / e.maxhealth) < 0.5,
    "UNPLUGGED": e => combat.enemies.some(enemy => enemy.unplugged === true),
    "HAS_CLOUD": e => enemyHelpers.GetEnemyFieldData(e, false, true).crops.some(crop => crop[3] === "cloud"),
    "PLAYER_HAS_CROPS": e => combat.grid.some(arry => arry.some(tile => tile !== null && tile !== undefined && tile.x === undefined && tile.type !== "rock")),
    "WHOPPY_MACHINE_BROKE": function(e) {
        for(let y = 1; y < combat.enemyheight; y++) {
            if(combat.enemyGrid[combat.enemywidth - 1][y] === null) { return true; }
        }
        return false;
    },
    "BECKETT_MACHINE_BROKE": function(e) {
        for(let y = 0; y < 3; y++) {
            if(combat.enemyGrid[combat.enemywidth - 1][y] === null) { return true; }
        }
        return false;
    }
};
const actions = {
    "INIT": e => true, "END": e => true,
    "SKIP": e => { EnemyParser.outputData = { skip: true }; return true; },
    "IDLE": e => { EnemyParser.outputData = enemyHelpers.GetAttackData(0); return true; },
    
    // ---------------- MULTIPURPOSE
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
            case "burnRow":
                EnemyParser.current.data.animData = "ROW_FIRE";
                EnemyParser.current.data.textID = "burnSucc";
                return actions["BECK_FIRE_ROW"](e);
            case "wetRow":
                EnemyParser.current.data.animData = "HEAD_ON_SPLASH_ATTACK";
                EnemyParser.current.data.textID = "splashRow";
                return actions["BECKETT_WATER"](e);
            case "saltRow":
                EnemyParser.current.data.animData = "SALT_TOSS";
                EnemyParser.current.data.textID = "splashRow";
                return actions["BECK_THROW_SALT"](e);
            case "wetOne":
                EnemyParser.current.data.animData = "ROCK_TOSS";
                EnemyParser.current.data.textID = "splashRow";
                return actions["SPLASH_TILE"](e);
            case "rock":
                EnemyParser.current.data.animData = "ROCK_TOSS";
                EnemyParser.current.data.textID = "beckettRock";
                return actions["TRY_THROW_ROCK"](e);
            case "vine":
                EnemyParser.current.data.animData = "VINE_SMACK";
                EnemyParser.current.data.textID = "beckettRock";
                return actions["VINE_SMACK"](e);
            case "hulk":
                EnemyParser.current.data.animData = "HULK_PUNCH";
                EnemyParser.current.data.textID = "beckettRock";
                return actions["HULK_PUNCH"](e);
            case "plantThree":
                EnemyParser.current.data.animData = "PLANT";
                EnemyParser.current.data.textID = "plantAttack";
                return actions["TRY_PLANT_THREE_CROPS"](e, "kelp");
            case "modulate":
                EnemyParser.current.data.animData = "PLANT";
                EnemyParser.current.data.textID = "plantAttack";
                return actions["MODULATE"](e, "0,1,2,3");
            case "fuckyou":
                EnemyParser.current.data.animData = "FUCKING_MAIM";
                EnemyParser.current.data.textID = "standardAttack";
                return actions["FUCKING_MAIM"](e);
            case "crophit":
                EnemyParser.current.data.animData = "ATTACK_CROP";
                EnemyParser.current.data.textID = "standardAttack";
                return actions["ATTACK_CROP"](e);
            case "plantandretract":
                combat.enemyGrid[0][2] = GetCrop("kelp");
                combat.enemyGrid[0][2].activeTime = 4;
                combat.enemyGrid[1][3] = GetCrop("kelp");
                combat.enemyGrid[1][3].activeTime = 4;
                combat.enemyGrid[2][4] = GetCrop("kelp");
                combat.enemyGrid[2][4].activeTime = 4;
                EnemyParser.current.data.animData = "PLANT";
                EnemyParser.current.data.textID = "standardAttack";
                return actions["RETRACT_CROPS"](e);
            case "plantandcache":
                for(let x = 0; x < combat.enemyGrid.length; x++) {
                    for(let y = 0; y < combat.enemyGrid[0].length; y++) {
                        let tile = GetCrop("kelp");
                        tile.activeTime = 4;
                        combat.enemyGrid[x][y] = tile;
                    }
                }
                EnemyParser.current.data.animData = "PLANT";
                EnemyParser.current.data.textID = "standardAttack";
                return actions["CLEAR_CACHE"](e);
            case "cloud":
                combat.enemyGrid[2][2] = GetCrop("cloud");
                combat.enemyGrid[2][2].activeTime = 50;
                EnemyParser.current.data.animData = "PLANT";
                EnemyParser.current.data.textID = "standardAttack";
                return actions["BOOST_CLOUD"](e);
            case "kombuch":
                combat.enemyGrid[2][2] = GetCrop("kombucha");
                combat.enemyGrid[2][2].activeTime = 50;
                EnemyParser.current.data.animData = "SLURP_KOMBUCH";
                EnemyParser.current.data.textID = "standardAttack";
                return actions["MAYBE_TRY_DRINK_KOMBUCHA"](e);
            case "heal":
                EnemyParser.current.data.animData = "PLANT";
                EnemyParser.current.data.textID = "standardAttack";
                return actions["HEAL_RANGE"](e, "50,25");
            case "cropHeal":
                for(let x = 0; x < combat.enemyGrid.length; x++) {
                    for(let y = 0; y < combat.enemyGrid[0].length; y++) {
                        let tile = GetCrop("kelp");
                        tile.activeTime = 0;
                        combat.enemyGrid[x][y] = tile;
                    }
                }
                EnemyParser.current.data.animData = "SLURP_KOMBUCH";
                EnemyParser.current.data.textID = "standardAttack";
                return actions["HEAL_FROM_CROPS"](e);
            default:
                EnemyParser.current.data.animData = "PLANT";
                EnemyParser.current.data.textID = "standardAttack";
                return actions[debug.testEnemyState](e);
        }
    },
    "CONVINCEATRON": function(e) {
        let damage = 0;
        if(tutorial.state >= 36) {
            EnemyParser.current.data = { textID: "tutEnemy36", animData: "PLANT" }
        } else if(tutorial.state === 23) {
            damage = combat.damagePlayer(1);
            EnemyParser.current.data = { textID: "tutEnemy" + tutorial.state, animData: "ATTACK" };
        } else {
            EnemyParser.current.data = { textID: "tutEnemy" + tutorial.state, animData: "PLANT" }
        }
        EnemyParser.outputData = enemyHelpers.GetAttackData(damage);
        EnemyParser.current.data = { message: "CONVINCEATRON" };
        return true;
    },
    "TRY_PLUG": function(e) {
        if(--e.plugTimer <= 0) {
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
        const cardData = e.wacg.MakeMove();
        const attackAgain = e.wacg.HandleStatusEffectsAndReturnIfCanAttackAgain();
        EnemyParser.current.data.textID = cardData.textID;
        let damage = 0, bonusArgs = {};
        if(cardData.isAttack) {
            damage = e.atk;
            const x = Range(0, player.gridWidth), y = Range(0, player.gridHeight);
            if(cardData.action === "attack1" && Math.random() < 0.45) {
                switch(cardData.argval) {
                    case "elem0":
                        bonusArgs = { type: "fireDiag", x: x, y: y };
                        cardData.animData = "ROCK_TOSS";
                        enemyHelpers.BurnTile(e, x, y);
                        break;
                    case "elem1":
                        bonusArgs = { type: "rock", x: x, y: y };
                        cardData.animData = "ROCK_TOSS";
                        enemyHelpers.TryDisturbTile(x, y, "rock");
                        break;
                    case "elem2":
                        bonusArgs = { type: "waterDiag", x: x, y: y };
                        cardData.animData = "ROCK_TOSS";
                        enemyHelpers.TrySplashTile(e, x, y);
                        break;
                    case "elem3":
                        bonusArgs = { crop: [ { x: x, y: y } ] };
                        cardData.animData = "ATTACK_CROP";
                        enemyHelpers.DoDamageCrop(e, x, y, -1);
                        break;
                }
            } else if(cardData.action === "attack2") {
                if(cardData.argval === cardData.arg2val) {
                    switch(cardData.argval) {
                        case "elem0":
                            if(Math.random() < 0.45) { 
                                let affectedTiles = [];
                                for(let x = 0; x < player.gridWidth; x++) {
                                    const res = enemyHelpers.BurnTile(e, x, y);
                                    affectedTiles.push({ killed: res.destroyed || false, special: res.special || null, groundAffected: res.groundAffected || false });
                                }
                                cardData.animData = "ROW_FIRE";
                                bonusArgs = { row: y, tiles: affectedTiles };
                            }
                            break;
                        case "elem1":
                            bonusArgs = { type: "rock", x: x, y: y };
                            cardData.animData = "ROCK_TOSS";
                            enemyHelpers.TryDisturbTile(x, y, "rock");
                            break;
                        case "elem2":
                            if(Math.random() < 0.45) { 
                                let affectedTiles = [];
                                for(let x = 0; x < player.gridWidth; x++) {
                                    const res = enemyHelpers.TrySplashTile(e, x, y);
                                    affectedTiles.push({ killed: res.destroyed || false, special: res.special || null, groundAffected: res.groundAffected || false });
                                }
                                cardData.animData = "HEAD_ON_SPLASH_ATTACK";
                                bonusArgs = { row: y, tiles: affectedTiles };
                            }
                            break;
                        case "elem3":
                            enemyHelpers.DoDamageCrop(e, x, y, -1);
                            const x2 = Range(0, player.gridWidth), y2 = Range(0, player.gridHeight);
                            enemyHelpers.DoDamageCrop(e, x2, y2, -1);
                            bonusArgs = { crop: [ { x: x, y: y }, { x: x2, y: y2 } ] };
                            cardData.animData = "ATTACK_CROP";
                            break;
                    }
                } else {
                    const first = (cardData.argval < cardData.arg2val ? cardData.argval : cardData.arg2val);
                    const second = (cardData.argval < cardData.arg2val ? cardData.arg2val : cardData.argval);
                    if(first === "elem0") {
                        switch(second) {
                            case "elem1": // fire + earth
                                if(Math.random() < 0.4) {
                                    const x2 = Range(0, player.gridWidth), y2 = Range(0, player.gridHeight);
                                    enemyHelpers.TryDisturbTile(x, y, "rock");
                                    enemyHelpers.BurnTile(e, x2, y2);
                                    bonusArgs = { crop: [ { x: x, y: y }, { x: x2, y: y2, effect: ["fireBurn0", "fireBurn1"] } ] };
                                    cardData.animData = "ATTACK_CROP";
                                }
                                break;
                            case "elem2": damage = Math.floor(damage * 0.5); break; // fire + water
                            case "elem3": // fire + tech
                                if(Math.random() < 0.6) {
                                    const x2 = Range(0, player.gridWidth), y2 = Range(0, player.gridHeight);
                                    const x3 = Range(0, player.gridWidth), y3 = Range(0, player.gridHeight);
                                    const x4 = Range(0, player.gridWidth), y4 = Range(0, player.gridHeight);
                                    enemyHelpers.DoDamageCrop(e, x, y, -1);
                                    enemyHelpers.DoDamageCrop(e, x2, y2, -1);
                                    enemyHelpers.BurnTile(e, x3, y3);
                                    enemyHelpers.BurnTile(e, x4, y4);
                                    bonusArgs = { crop: [ { x: x, y: y }, { x: x2, y: y2 }, { x: x3, y: y3, effect: ["fireBurn0", "fireBurn1"] }, 
                                                                                        { x: x4, y: y4, effect: ["fireBurn0", "fireBurn1"] } ] };
                                    cardData.animData = "ATTACK_CROP";
                                }
                                break;
                        }
                    } else if(first === "elem1") {
                        switch(second) {
                            case "elem2": // earth + water
                                if(Math.random() < 0.65) {
                                    bonusArgs = { type: "saltDiag", x: x, y: y };
                                    cardData.animData = "ROCK_TOSS";
                                    enemyHelpers.TryDisturbTile(x, y, "salt");
                                }
                                break;
                            case "elem3": damage = Math.floor(damage * 1.5); break;
                        }
                    } else if(first === "elem2") { // water + tech
                        let affectedTiles = [];
                        for(let x = 0; x < player.gridWidth; x++) {
                            const res = enemyHelpers.DoDamageCrop(e, x, y);
                            affectedTiles.push({ x: x, y: y });
                        }
                        cardData.animData = "ATTACK_CROP";
                        bonusArgs = { row: y, crop: affectedTiles };
                        for(let x = 0; x < player.gridWidth; x++) { enemyHelpers.DoDamageCrop(e, x, y, -1); }
                    }
                }
            }
        }
        if(damage > 0) { damage = combat.damagePlayer(damage); }
        EnemyParser.outputData = enemyHelpers.GetAttackData(damage, cardData.cardName, cardData.arg, cardData.arg2);
        if(attackAgain) { EnemyParser.outputData.attackAgain = true; }
        EnemyParser.outputData.animData = cardData.animData;
        EnemyParser.outputData.bonusArgs = bonusArgs;
        return true;
    },
    "HOUSEKEEPER": function(e) {
        const cropData = enemyHelpers.GetEnemyFieldData(e, false, false);
        const hasCrops = cropData.crops.length > 0;
        EnemyParser.current.data.animData = "HOUSEKEEPER";
        if(conditions["HAS_CLOUD"](e)) {
            if(hasCrops && Math.random() > 0.75) {
                EnemyParser.current.data.textID = "hkAtkAttack";
                EnemyParser.current.data.animData = "HOUSEKEEPER_HARVEST";
                return actions["LAUNCH_CROPS"](e);
            }
            let cloudPower = 0;
            const crops = enemyHelpers.GetEnemyFieldData(e, false, true).crops;
            for(let i = 0; i < crops.length; i++) {
                if(crops[i][3] === "cloud") {
                    const x = crops[i][1], y = crops[i][2];
                    cloudPower = combat.enemyGrid[x][y].power;
                    break;
                }
            }
            let abilities = ["rock"];
            if(cloudPower > 5) { abilities.push("splash"); }
            if(cloudPower > 10) { abilities.push("splashrow"); }
            if(cloudPower > 15) { abilities.push("plantmult"); }
            if(cloudPower > 20) { abilities.push("attackweak"); }
            if(cloudPower > 25) { abilities.push("season"); }
            if(cloudPower > 30) { abilities.push("heal"); }
            if(cloudPower > 35) { abilities.push("threaten"); }
            const attack = RandomArrayItem(abilities);
            if(attack === "rock") {
                EnemyParser.current.data.textID = "hkAtkRock";
                EnemyParser.current.data.animData = "HOUSEKEEPER_ROCK";
                if(actions["TRY_THROW_ROCK"](e)) { return true; }
                EnemyParser.current.data.animData = "HOUSEKEEPER_ERROR";
                EnemyParser.current.data.textID = "hkAtkError1";
                EnemyParser.outputData = enemyHelpers.GetAttackData(0);
                return true;
            } else if(attack === "splash") {
                const weakestPos = enemyHelpers.GetWeakestPlayerCrop();
                if(weakestPos.x < 0) {
                    EnemyParser.current.data.textID = "hkAtkError2";
                    EnemyParser.current.data.animData = "HOUSEKEEPER_ERROR";
                    EnemyParser.outputData = enemyHelpers.GetAttackData(0);
                    return true;
                } else {
                    const res = enemyHelpers.TrySplashTile(e, weakestPos.x, weakestPos.y);
                    if(!res.status) { EnemyParser.current.data.textID = "splashFail"; }
                    else if(!res.crop) { EnemyParser.current.data.textID = "splashSucc"; }
                    else if(!res.destroyed) { EnemyParser.current.data.textID = "splashDamage"; }
                    else { EnemyParser.current.data.textID = "splashKill"; }
                    EnemyParser.current.data.animData = "HOUSEKEEPER_ROCK";
                    EnemyParser.outputData = enemyHelpers.GetAttackData(0);
                    EnemyParser.outputData.bonusArgs = { type: "waterDiag", x: weakestPos.x, y: weakestPos.y };
                    return true;
                }
            } else if(attack === "splashrow") {
                EnemyParser.current.data.animData = "HOUSEKEEPER_SPLASH";
                return enemyHelpers.DoSomethingToBusiestRow(e, enemyHelpers.TrySplashTile, "splashRowKill", "splashRowDamage", "splashRow");
            } else if(attack === "plantmult") {
                EnemyParser.current.data.animData = "HOUSEKEEPER";
                EnemyParser.current.data.textID = "hkAtkPlantOne";
                const canPlantOne = actions["TRY_PLANT_CROP"](e, "lightbulb");
                if(!canPlantOne) {
                    EnemyParser.current.data.textID = "hkAtkCantPlant";
                    EnemyParser.outputData = enemyHelpers.GetAttackData(0);
                    return true;
                }
                EnemyParser.current.data.textID = "hkAtkPlantTwo";
                if(actions["TRY_PLANT_CROP"](e, "lightbulb")) { return true; }
                return true;
            } else if(attack === "attackweak") {
                const weakestPos = enemyHelpers.GetWeakestPlayerCrop();
                if(weakestPos.x < 0) {
                    EnemyParser.current.data.animData = "HOUSEKEEPER_ERROR";
                    EnemyParser.current.data.textID = "hkAtkError3";
                    EnemyParser.outputData = enemyHelpers.GetAttackData(0);
                    return true;
                } else {
                    const res = enemyHelpers.DoDamageCrop(e, weakestPos.x, weakestPos.y, -1);
                    EnemyParser.current.data.animData = "HOUSEKEEPER_WHAPOWCROP";
                    if(res.destroyed) {
                        EnemyParser.current.data.textID = "hkCropKill";
                    } else {
                        EnemyParser.current.data.textID = "hkCropAttack";
                    }
                    EnemyParser.outputData = enemyHelpers.GetAttackData(0);
                    EnemyParser.outputData.bonusArgs = { crop: [ weakestPos ] };
                    return true;
                }
            } else if(attack === "season") {
                EnemyParser.current.data.animData = "HOUSEKEEPER";
                let seasons = [0, 0, 0, 0];
                for(let x = 0; x < combat.grid.length; x++) {
                    for(let y = 0; y < combat.grid[0].length; y++) {
                        const tile = combat.grid[x][y];
                        if(tile === null || tile === undefined || tile.x !== undefined || tile.type === "rock") { continue; }
                        for(let i = 0; i < 4; i++) { seasons[i] += tile.seasons[i]; }
                    }
                }
                let weakestSeason = 0;
                let lowestNum = 1000;
                for(let s = 0; s < 4; s++) {
                    if(seasons[s] < lowestNum) {
                        weakestSeason = s;
                        lowestNum = seasons[s];
                    }
                }
                let seasonStr = "Spring";
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
                let weakestEnemy = combat.enemies[0];
                let lowestHP = weakestEnemy.health;
                for(let i = 1; i < combat.enemies.length; i++) {
                    if(combat.enemies[i].health < lowestHP) {
                        weakestEnemy = combat.enemies[i];
                        lowestHP = weakestEnemy.health;
                    }
                }
                EnemyParser.current.data.animData = "HOUSEKEEPER";
                EnemyParser.current.data.textID = "hkHeal";
                const amountToHeal = InclusiveRange(5, 55);
                const prevHealth = weakestEnemy.health;
                weakestEnemy.health = Math.min(weakestEnemy.maxhealth, (weakestEnemy.health + amountToHeal));
                const adjustedAmountToHeal = (weakestEnemy.health - prevHealth);
                EnemyParser.outputData = enemyHelpers.GetAttackData(adjustedAmountToHeal, weakestEnemy.name);
            } else {
                EnemyParser.current.data.animData = "HOUSEKEEPER2";
                EnemyParser.current.data.textID = "hkCreepy" + Math.floor(Math.random() * 6);
                EnemyParser.outputData = enemyHelpers.GetAttackData(0);
                return true;
            }
        } else {
            if(hasCrops) {
                EnemyParser.current.data.textID = "hkAtkAttack";
                EnemyParser.current.data.animData = "HOUSEKEEPER_HARVEST";
                return actions["LAUNCH_CROPS"](e);
            } else {
                if(Math.random() > 0.5) {
                    EnemyParser.current.data.animData = "HOUSEKEEPER";
                    EnemyParser.current.data.textID = "hkAtkPlantOne";
                    if(actions["TRY_PLANT_CROP"](e, "lightbulb")) { return true; }
                    EnemyParser.current.data.textID = "hkAtkCantPlant";
                    EnemyParser.outputData = enemyHelpers.GetAttackData(0);
                    return true;
                } else {
                    EnemyParser.current.data.textID = "hkAtkAttack";
                    EnemyParser.current.data.animData = "HOUSEKEEPER_WHAPOW";
                    const damage = combat.damagePlayer(cropData.damage);
                    EnemyParser.outputData = enemyHelpers.GetAttackData(damage);
                    return true; 
                }
            }
        }
    },
    "CONVINCEATRON2": function(e) {
        let damage = 0;
        if(e.convinceState === undefined) {
            e.convinceState = 1;
            EnemyParser.current.data = { textID: "convince2.0", animData: "PLANT" };
        } else if(e.convinceState === 4) {
            EnemyParser.current.data = { textID: "convince2.4", animData: "ATTACK" };
            e.convinceState = 5;
        } else {
            EnemyParser.current.data = { textID: "convince2." + e.convinceState, animData: "PLANT" };
            e.convinceState++;
        }
        EnemyParser.outputData = enemyHelpers.GetAttackData(0);
        EnemyParser.current.data = { message: "CONVINCEATRON2" };
        return true;
    },

    // ---------------- CLEANING
    "CLEAR_CACHE": function(e) {
        for(let x = 0; x < combat.enemyGrid.length; x++) {
            for(let y = 0; y < combat.enemyGrid[0].length; y++) {
                const tile = combat.enemyGrid[x][y];
                if(tile === null || tile.x !== undefined) { continue; }
                if(tile.size === 2) { continue; }
                const kill = tile.rotten || Math.random() > 0.75;
                if(!kill) { continue; }
                combat.enemyGrid[x][y] = null;
            }
        }
        combat.animHelper.DrawCrops();
        EnemyParser.outputData = enemyHelpers.GetAttackData(0);
        return true;
    },
    "RETRACT_CROPS": function(e) {
        let dmg = 0, crops = [];
        for(let x = 0; x < 4; x++) {
            for(let y = 2; y < 6; y++) {
                const tile = combat.enemyGrid[x][y];
                if(tile === null || tile.x !== undefined || tile.type === "card") { continue; }
                if(crops.length === 0 || Math.random() > 0.25) {
                    dmg += tile.power * tile.power;
                    crops.push([tile.name, x, y, tile.type, ""]);
                }
            }
        }
        if(dmg === 0 || crops.length === 0) { return false; }
        let prevHealth = e.health;
        e.health = Math.min(e.maxhealth, (e.health + dmg));
        const adjustedAmountToHeal = (e.health - prevHealth);
        EnemyParser.outputData = enemyHelpers.GetAttackData(adjustedAmountToHeal);
        EnemyParser.outputData.throwables = crops;
        return true;
    },

    // ---------------- STATUS EFFECTS
    "MODULATE": function (e, season) {
        let attempts = 5;
        if(season === "args") {
            season = parseInt(e.GetRandomArg());
            while(attempts-- > 0 && season === combat.season) {
                season = parseInt(e.GetRandomArg());
            }
        } else if(season.indexOf(",") >= 0) {
            const ssns = season.split(",");
            season = parseInt(RandomArrayItem(ssns));
            while(attempts-- > 0 && season === combat.season) {
                season = parseInt(RandomArrayItem(ssns));
            }
        } else { season = parseInt(season); }
        let seasonStr = "Spring";
        switch(season) {
            case 1: seasonStr = "Summer"; break;
            case 2: seasonStr = "Autumn"; break;
            case 3: seasonStr = "Winter"; break;
        }
        combat.season = season;
        combat.adjustEnemyStatsWeather();
        EnemyParser.outputData = enemyHelpers.GetAttackData(0, seasonStr);
    },
    "REV_ENGINE": function(e) {
        e.atk += 2;
        EnemyParser.outputData = enemyHelpers.GetAttackData(0);
        return true;
    },
    "BOOST_CLOUD": function(e) {
        EnemyParser.outputData = enemyHelpers.GetAttackData(0); 
        const crops = enemyHelpers.GetEnemyFieldData(e, false, true).crops;
        for(let i = 0; i < crops.length; i++) {
            if(crops[i][3] === "cloud") {
                const x = crops[i][1], y = crops[i][2];
                combat.enemyGrid[x][y].power++;
                return true;
            }
        }
        return true;
    },
    "THROW_BABY": function(e) {
        const fieldData = enemyHelpers.GetEnemyFieldData(e, true);
        EnemyParser.current.data.textID = "babyToss";
        const baby = GetCrop(fieldData.crops[0][0]).baby;
        if(baby === "soyChild") {
            if(combat.enemies.length < 3) {
                combat.enemies.push(GetEnemy(baby));
            } else if(combat.enemies.length === 3) {
                const lastEnemy = combat.enemies[combat.enemies.length - 1];
                const secondToLastEnemy = combat.enemies[combat.enemies.length - 2];
                if(lastEnemy.id === baby && secondToLastEnemy.id === baby) {
                    combat.enemies.splice(combat.enemies.length - 2, 2);
                    combat.enemies.push(GetEnemy("soyStack"));
                    combat.animHelper.ResetEnemyAnimHelper(combat.enemies);
                } else {
                    combat.enemies.push(GetEnemy(baby));
                }
            } else if(combat.enemies.length === 4) {
                const lastEnemy = combat.enemies[combat.enemies.length - 1];
                const secondToLastEnemy = combat.enemies[combat.enemies.length - 2];
                if(lastEnemy.id === baby && secondToLastEnemy.id === baby) {
                    combat.enemies.splice(combat.enemies.length - 2, 2);
                    combat.enemies.push(GetEnemy("soyStack"));
                    combat.animHelper.ResetEnemyAnimHelper(combat.enemies);
                } else {
                    EnemyParser.current.data.textID = "babyTossFail";
                }
            }
        } else if(combat.enemies.length < 4) {
            combat.enemies.push(GetEnemy(baby));
        } else {
            EnemyParser.current.data.textID = "babyTossFail";
        }
        EnemyParser.outputData = enemyHelpers.GetAttackData(0, GetText("e." + GetCrop(fieldData.crops[0][0]).baby + "0"));
        EnemyParser.outputData.throwables = fieldData.crops;
        return true;
    },

    // ---------------- HEALING
    "HEAL_RANGE": function(e, amountRange) {
        const rangeVals = amountRange.split(",");
        const base = parseInt(rangeVals[0]);
        const rangeSize = parseInt(rangeVals[1]);
        const amountToHeal = InclusiveRange(base - rangeSize, base + rangeSize);
        const prevHealth = e.health;
        e.health = Math.min(e.maxhealth, (e.health + amountToHeal));
        const adjustedAmountToHeal = (e.health - prevHealth);
        EnemyParser.outputData = enemyHelpers.GetAttackData(adjustedAmountToHeal);
        return true;
    },
    "MAYBE_TRY_DRINK_KOMBUCHA": function(e) {
        let kombuchaData = null;
        for(let x = 0; x < combat.enemyGrid.length; x++) {
            if(kombuchaData !== null) { break; }
            for(let y = 0; y < combat.enemyGrid[0].length; y++) {
                let tile = combat.enemyGrid[x][y];
                if(tile === null || tile.name !== "kombucha") { continue; }
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
    "HEAL_FROM_CROPS": function(e) {
        const fieldData = enemyHelpers.GetEnemyFieldData(e, false, true, true);
        const amountToHeal = Math.ceil(fieldData.damage / 3);
        const prevHealth = e.health;
        e.health = Math.min(e.maxhealth, (e.health + amountToHeal));
        const adjustedAmountToHeal = (e.health - prevHealth);
        EnemyParser.outputData = enemyHelpers.GetAttackData(adjustedAmountToHeal);
        EnemyParser.outputData.throwables = fieldData.crops;
        return true;
    },

    // ---------------- ATTACKING
    "WEAK_ATTACK": function(e) {
        let damage = dmgCalcs.MeleeAttack(false, combat.season, e.atk, [dmgCalcs.GetPlayerCombatDefense()])[0].damage;
        damage = combat.damagePlayer(damage);
        EnemyParser.outputData = enemyHelpers.GetAttackData(damage);
        return true;
    },
    "WEAKEST_ATTACK": function(e) {
        const damage = combat.damagePlayer(1);
        EnemyParser.outputData = enemyHelpers.GetAttackData(damage);
        return true;
    },
    "PIG_GUN": function(e) {
        const damage = combat.damagePlayer(300);
        EnemyParser.outputData = enemyHelpers.GetAttackData(damage);
        return true;
    },
    "LAUNCH_CROPS": function(e) {
        const fieldData = enemyHelpers.GetEnemyCropAttackDataObj(e, [dmgCalcs.GetPlayerCombatDefense()]);
        const damage = combat.damagePlayer(fieldData.damage);
        EnemyParser.outputData = enemyHelpers.GetAttackData(damage);
        EnemyParser.outputData.throwables = fieldData.animCrops;
        return true;
    },
    "FUCKING_MAIM": function(e) {
        worldmap.angryBees = false;
        for(let x = 0; x < player.gridWidth; x++) {
            for(let y = 0; y < player.gridHeight; y++) {
                if(player.itemGrid[x][y] === "_beehive") { continue; }
                enemyHelpers.BurnTile(e, x, y);
                enemyHelpers.BurnTile(e, x, y);
                enemyHelpers.BurnTile(e, x, y);
            }
        }
        const damage = combat.damagePlayer(e.atk * 500);
        EnemyParser.outputData = enemyHelpers.GetAttackData(damage);
        return true;
    },

    // ---------------- CROP HARM
    "LAUNCH_CROPS_AT_CROPS": function(e) {
        const pos = GetPlayerCrop();
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
    "ATTACK_CROP": function(e) {
        const pos = GetPlayerCrop();
        if(pos === null) { return false; }
        const res = enemyHelpers.DoDamageCrop(e, pos.x, pos.y, -1);
        if(res.destroyed) {
            EnemyParser.current.data.textID = "cropKill";
        } else {
            EnemyParser.current.data.textID = "cropAttack";
        }
        EnemyParser.outputData = enemyHelpers.GetAttackData(0);
        EnemyParser.outputData.bonusArgs = { crop: [ pos ] };
        return true;
    },
    "HULK_PUNCH": function(e) {
        const row = Range(0, player.gridHeight - 1);
        let hasKills = false;
        let hurtCrops = [];
        for(let y = row; y <= (row + 1); y++) {
            for(let x = 0; x < player.gridWidth; x++) {
                let tile = combat.grid[x][y];
                if(tile === null || tile.type === "rock") { continue; }
                if(tile.x !== undefined) { tile = combat.grid[tile.x][tile.y]; }
                const res = enemyHelpers.DoDamageCrop(e, x, y, -1);
                hurtCrops.push({x: x, y: y});
                hasKills = hasKills || (res.status && res.destroyed);
            }
        }
        if(hasKills) { EnemyParser.current.data.textID = "hulkPunchKill"; }
        else { EnemyParser.current.data.textID = "hulkPunch"; }
        EnemyParser.outputData = enemyHelpers.GetAttackData(0);
        EnemyParser.outputData.bonusArgs = { punchRow: row, crops: hurtCrops };
        return true;
    },
    "VINE_SMACK": function(e) {
        let numCols = (Math.random() > player.luck) ? Range(1, 5) : Range(1, 3);
        let cols = [];
        while(numCols-- > 0) {
            const col = Range(0, player.gridWidth);
            if(cols.indexOf(col) < 0) { cols.push(col); }
        }
        let hasKills = false, crops = [];
        for(let colIdx = 0; colIdx < cols.length; colIdx++) {
            const x = cols[colIdx];
            for(let y = 0; y < player.gridHeight; y++) {
                const tile = combat.grid[x][y];
                if(tile === null) {
                    if(Math.random() < 0.33) {
                        enemyHelpers.TryDisturbTile(x, y, "salt");
                    }
                } else {
                    if(tile.x !== undefined || tile.type === "rock") { continue; }
                    const res = enemyHelpers.DoDamageCrop(e, x, y, -1);
                    const didKill = res.status && res.destroyed;
                    if(didKill && Math.random() < 0.33) {
                        enemyHelpers.TryDisturbTile(x, y, "salt");
                    }
                    crops.push({x: x, y: y});
                    hasKills = hasKills || didKill;
                }
            }
        }
        if(hasKills) { EnemyParser.current.data.textID = "vineSmackKill"; }
        else { EnemyParser.current.data.textID = "vineSmack"; }
        EnemyParser.outputData = enemyHelpers.GetAttackData(0);
        EnemyParser.outputData.bonusArgs = { columns: cols, crops: crops };
        return true;
    },
    "TRY_THROW_ROCK": e => enemyHelpers.TryDisturbRandomTile("rock"),
    "TECH_THROW_ROCK": e => enemyHelpers.TryDisturbRandomTile("engine"),
    "TIRE_CHUCK": e => enemyHelpers.TryDisturbRandomTile("tire"),
    "BECKETT_WATER": e => enemyHelpers.DoSomethingToBusiestRow(e, enemyHelpers.TrySplashTile, "splashRowKill", "splashRowDamage", "splashRow"),
    "BECK_FIRE_ROW": e => enemyHelpers.DoSomethingToBusiestRow(e, enemyHelpers.BurnTile, "burnKill", "burnDamage", "burnSucc"),
    "SPLASH_TILE": function(e) {
        const x = Range(0, player.gridWidth), y = Range(0, player.gridHeight);
        const res = enemyHelpers.TrySplashTile(e, x, y);
        if(!res.status) { EnemyParser.current.data.textID = "splashFail"; }
        else if(!res.crop) { EnemyParser.current.data.textID = "splashSucc"; }
        else if(!res.destroyed) { EnemyParser.current.data.textID = "splashDamage"; }
        else { EnemyParser.current.data.textID = "splashKill"; }
        EnemyParser.outputData = enemyHelpers.GetAttackData(0);
        if(res.status) { EnemyParser.outputData.bonusArgs = { type: "waterDiag", x: x, y: y }; }
        return true;
    },
    "BECK_THROW_SALT": function(e) { 
        const row = Range(0, player.gridHeight);
        let hasKills = false;
        let affectedTiles = [];
        for(let x = 0; x < player.gridWidth; x++) {
            const tile = combat.grid[x][row];
            if(tile === null) {
                affectedTiles.push({ killed: false, special: null, groundAffected: false });
                if(Math.random() < 0.25) {
                    enemyHelpers.TryDisturbTile(x, row, "salt");
                }
            } else {
                if(tile.x !== undefined || tile.type === "rock") { affectedTiles.push({ killed: false, special: null, groundAffected: false }); continue; }
                const res = enemyHelpers.DoDamageCrop(e, x, row, -1);
                if(res.destroyed && Math.random() < 0.45) {
                    enemyHelpers.TryDisturbTile(x, row, "salt");
                }
                affectedTiles.push({ killed: res.destroyed || false, special: res.special || null, groundAffected: res.groundAffected || false });
                hasKills = hasKills || res.destroyed;
            }
        }
        EnemyParser.current.data.textID = hasKills ? "beckettSaltKill" : "beckettSalt";
        EnemyParser.outputData = enemyHelpers.GetAttackData(0);
        EnemyParser.outputData.bonusArgs = { row: row, tiles: affectedTiles };
        return true;
    },

    // ---------------- PLANTING
    "TRY_PLANT_CROP": function(e, crop) {
        if(crop === "args") { crop = e.GetRandomArg(); }
        else if(crop.indexOf(",") >= 0) { crop = RandomArrayItem(crop.split(",")); }
        let newCrop = GetCrop(crop);
        const delta = newCrop.size === 2 ? 1 : 0;
        const pos = GetEnemyPlantablePosition(0, combat.enemyGrid.length, 0, combat.enemyGrid[0].length, delta === 1);
        if(pos === null) { return false; }

        newCrop.activeTime = newCrop.time;
        combat.enemyGrid[pos.x][pos.y] = newCrop;
        if(newCrop.size === 2) {        
            combat.enemyGrid[pos.x + 1][pos.y] = pos;
            combat.enemyGrid[pos.x][pos.y + 1] = pos;
            combat.enemyGrid[pos.x + 1][pos.y + 1] = pos;
        }
        EnemyParser.outputData = enemyHelpers.GetAttackData(0, newCrop.displayname);
        combat.animHelper.DrawCrops();
        return true;
    },
    "TRY_PLANT_CROP_NERD": function(e, crop) {
        if(crop === "args") { crop = e.GetRandomArg(); }
        else if(crop.indexOf(",") >= 0) { crop = RandomArrayItem(crop.split(",")); }
        let newCrop = GetCrop(crop);
        const delta = newCrop.size === 2 ? 1 : 0;
        const pos = GetEnemyPlantablePosition(0, combat.enemyGrid.length, 0, 1, delta === 1);
        if(pos === null) { return false; }

        newCrop.activeTime = newCrop.time;
        combat.enemyGrid[pos.x][pos.y] = newCrop;
        EnemyParser.outputData = enemyHelpers.GetAttackData(0, newCrop.displayname);
        combat.animHelper.DrawCrops();
        return true;
    },
    "TRY_PLANT_THREE_CROPS": function(e, crop) {
        const placeholderTitle = EnemyParser.current.data.textID;
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
    "NERF_THIS": function(e) {
        const pos = GetFirstWithMatch(3, 5, 3, 5, (x, y) => enemyHelpers.CanPlantInSpot(x, y, false));
        if(pos === null) { return false; }
        let newCrop = GetCrop(RandomArrayItem(["mushNerf", "riceNerf", "treeNerf", "vegNerf", "fishNerf", "beeNerf", "eggNerf", "reNerf"]));
        newCrop.activeTime = newCrop.time;
        combat.enemyGrid[pos.x][pos.y] = newCrop;
        EnemyParser.outputData = enemyHelpers.GetAttackData(0, newCrop.displayname);
        combat.animHelper.DrawCrops();
        return true;
    },
    "REPAIR_MACHINE": function(e, crop) {
        let pos = {x: combat.enemywidth - 1, y: 0 };
        let newCrop = GetCrop("conveyorEnd");
        for(let y = 1; y < combat.enemyheight; y++) {
            if(combat.enemyGrid[pos.x][y] !== null) { continue; }
            pos.y = y;
            break;
        }
        newCrop.activeTime = newCrop.time;
        combat.enemyGrid[pos.x][pos.y] = newCrop;
        EnemyParser.outputData = enemyHelpers.GetAttackData(0, newCrop.displayname);
        combat.animHelper.DrawCrops();
        return true;
    },
    "REPAIR_BECK_MACHINE": function(e, crop) {
        let pos = {x: combat.enemywidth - 1, y: 0 };
        let newCrop = GetCrop("conveyorEnd");
        for(let y = 0; y < 3; y++) {
            if(combat.enemyGrid[pos.x][y] !== null) { continue; }
            pos.y = y;
            break;
        }
        newCrop.activeTime = newCrop.time;
        combat.enemyGrid[pos.x][pos.y] = newCrop;
        EnemyParser.outputData = enemyHelpers.GetAttackData(0, newCrop.displayname);
        combat.animHelper.DrawCrops();
        return true;
    },
    "BECKETT_PLANT": function(e) {
        const pos = GetEnemyPlantablePosition(0, 3, 3, 5, false);
        if(pos === null) { return false; }

        const potentialCrops = ["bananaPill", "lightbulb", "food2bar", "food2barChoc", "food2powder", "gastank", "timebomb", "shotgun", "download", "drone", "battery"];
        const crop = RandomArrayItem(potentialCrops);
        let newCrop = GetCrop(crop);
        console.log("getting " + crop);
        console.log(newCrop);
        
        newCrop.activeTime = newCrop.time;
        combat.enemyGrid[pos.x][pos.y] = newCrop;
        EnemyParser.outputData = enemyHelpers.GetAttackData(0, newCrop.displayname);
        combat.animHelper.DrawCrops();
        return true;
    },
    "NATHAN_PLANT": function(e) {
        const cropsToGrow = [ // these should only be 4 star or higher crops in the end, with a 2 for the season, if possible
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
        let availableSpots = [];
        for(let x = 0; x < 3; x++) {
            if(combat.enemyGrid[x][0] === null) { availableSpots.push({ x: x, y: 0, type: "eggie" }); }
            if(combat.enemyGrid[x][1] === null) { availableSpots.push({ x: x, y: 1, type: "fishs" }); }
            for(let y = 2; y < 6; y++) {
                if(combat.enemyGrid[x][y] === null) { availableSpots.push({ x: x, y: y, type: "crops" }); }
                if(y < 5 && combat.enemyGrid[x + 1][y] === null && combat.enemyGrid[x][y + 1] === null && combat.enemyGrid[x + 1][y + 1] === null) {
                    availableSpots.push({ x: x, y: y, type: "trees" });
                }
            }
            if(combat.enemyGrid[x][6] === null) { availableSpots.push({ x: x, y: 6, type: "paddy" }); }
        }
        for(let x = 3; x < 5; x++) {
            if(combat.enemyGrid[x][0] === null) { availableSpots.push({ x: x, y: 0, type: "mushs" }); }
            if(combat.enemyGrid[x][1] === null) { availableSpots.push({ x: x, y: 1, type: "mushs" }); }
            for(let y = 2; y < 6; y++) {
                if(y < 5 && x === 4) {
                    if(combat.enemyGrid[x][y] === null) { availableSpots.push({ x: x, y: y, type: "abeee" }); }
                } else {
                    if(combat.enemyGrid[x][y] === null) { availableSpots.push({ x: x, y: y, type: "crops" }); }
                }
            }
            if(combat.enemyGrid[x][6] === null) { availableSpots.push({ x: x, y: 6, type: "paddy" }); }
        }
        if(availableSpots.length === 0) { return false; }

        const pos = RandomArrayItem(availableSpots);
        const finalCropArr = cropsToGrow[combat.season][pos.type];
        let newCrop = GetCrop(RandomArrayItem(finalCropArr));
        if(newCrop.name === "spear") {
            if(Math.random() > 0.33) {
                newCrop.ready = true;
                newCrop.activeTime = 0;
                newCrop.fishNum = combat.GetFish(newCrop, 1);
                newCrop.power += newCrop.fishNum;
                newCrop.type = "rod";
                combat.enemyGrid[pos.x][pos.y] = newCrop;
                EnemyParser.current.data.textID = "nSpearYes";
            } else {
                EnemyParser.current.data.textID = "nSpearNo";
            }
        } else {
            newCrop.activeTime = newCrop.time;
            combat.enemyGrid[pos.x][pos.y] = newCrop;
            if(newCrop.size === 2) {        
                combat.enemyGrid[pos.x + 1][pos.y] = pos;
                combat.enemyGrid[pos.x][pos.y + 1] = pos;
                combat.enemyGrid[pos.x + 1][pos.y + 1] = pos;
            }
            switch(newCrop.type) {
                case "egg": EnemyParser.current.data.textID = "nEgg"; break;
                case "water":
                case "rod": EnemyParser.current.data.textID = "nFish"; break;
                case "bee": EnemyParser.current.data.textID = "nBee"; break;
                default: EnemyParser.current.data.textID = "plantAttack"; break;
            }
        }
        EnemyParser.outputData = enemyHelpers.GetAttackData(0, newCrop.displayname);
        combat.animHelper.DrawCrops();
        return true;
    }
}
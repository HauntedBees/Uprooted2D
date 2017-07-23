function EnemyDetail(name, size, spriteidx, cursorinfo, health, atk, def, fieldheight, fieldwidth, boss, seasonDistribution, attacks, drops, addtl) {
    this.name = name;
    this.health = health;
    this.atk = atk;
    this.def = def;
    this.cursorinfo = cursorinfo;
    this.fieldheight = fieldheight;
    this.fieldwidth = fieldwidth;
    this.size = size;
    this.spriteidx = spriteidx;
    switch(this.size) {
        case "sm": 
        case "md": this.sheet = "charsheet"; break;
        case "lg": this.sheet = "charsheetbig"; break;
    }
    this.stickTurns = 0;
    this.seasonDistribution = seasonDistribution;
    this.attacks = attacks;
    this.exp = Math.ceil(health/10 + atk + def/2 + attacks.length*2);
    this.drops = drops;
    this.boss = boss;
    if(addtl !== undefined) { for(var key in addtl) { this[key] = addtl[key]; } }
}
function GetDisplayName(name) {
    if(name === "Worker") {
        return ["Chet", "Brett", "Jeromy", "Chad", "Clung"][Math.floor(Math.random() * 5)];
    } else { return name; }
}
function GetEnemy(name) {
    switch(name) {
        case "Discussly": return new EnemyDetail(name, "sm", 0, { dx: 0, dy: 0.25, w: 0, h: 0.25 }, 10, 1, 1, 3, 2, true, [0, 0, 1, 0], [["dumbbattery", 0.75], ["babySlap", 0.8], ["app", 1]], [
                { money: true, min: 10, max: 10 },
                { seed: "carrot", min: 2, max: 2 }
            ]);
        case "Beckett": return new EnemyDetail(name, "sm", 7, { dx: 0, dy: 0, w: 0, h: 0 }, 10, 1, 1, 3, 2, true, [0, 0, 1, 0], [["dumbbattery", 0.75], ["babySlap", 0.8], ["app", 1]], [
                { money: true, min: 10, max: 10 },
                { seed: "carrot", min: 2, max: 2 }
            ]);
        case "Worker": return new EnemyDetail(GetDisplayName(name), "md", 4, { dx: 0.25, dy: 0.5, w: 0, h: 0.25 }, 10, 1, 1, 3, 1, false, [0, 1, 0, 0], [["dumbbattery", 0.75], ["babySlap", 0.8], ["app", 1]], [{ money: true, min: 5, max: 10 }]);
        case "ScienceMan": return new EnemyDetail(name, "md", 3, { dx: 0.25, dy: 0.15, w: 0, h: 0.6 }, 10, 1, 1, 3, 1, false, [0, 1, 0, 0], [["dumbbattery", 0.75], ["babySlap", 0.8], ["app", 1]], [{ money: true, min: 5, max: 10 }]);
        case "robo": return new EnemyDetail(name, "sm", 1, { dx: 0, dy: 0, w: 0, h: 0 }, 8, 2, 1, 3, 2, false, [0, 0, 1, 0], [["dumbbattery", 1], ["gear"]], [
                { money: true, min: 0, max: 5 },
                { seed: "carrot", min: -1, max: 1 }
            ]);
        case "bigBot":
            return new EnemyDetail(name, "lg", 0, { dx: 0, dy: 0, w: 1, h: 1.5 }, 60, 5, 2, 3, 3, true, [0, 0, 1, 0], [["dumbbattery", 1], ["standardAttack"]], [
                { money: true, min: 20, max: 50 },
                { seed: "carrot", min: 8, max: 10 },
                { seed: "beet", min: 8, max: 10 },
                { seed: "pineapple", min: 2, max: 3 },
                { seed: "grapes", min: 2, max: 3 },
                { seed: "ginger", min: 4, max: 6 }
            ]);
        case "robo2": return new EnemyDetail(name, "sm", 2, { dx: 0, dy: 0, w: 0, h: 0 }, 24, 4, 3, 3, 2, false, [0, 1, 1, 0], [["dumbbattery", 1], ["gear"]], [
                { money: true, min: 0, max: 5 },
                { seed: "carrot", min: -1, max: 1 }
            ]);
        case "fishFace": return new EnemyDetail(name, "md", 5, { dx: 0.25, dy: 0.2, w: 0, h: 0.55 }, 24, 4, 3, 3, 2, false, [0, 1, 1, 0],
            [["wellAlgae", 0.45], ["kelpKelpKelpKELPKELPKELP", 0.95], ["harvestOrAttack", 1]], 
            [
                { money: true, min: 0, max: 5 },
                { seed: "carrot", min: -1, max: 1 }
            ], { tile: "watertile" });
        case "seaMonk": return new EnemyDetail(name, "md", 6, { dx: 0, dy: -0.2, w: 0.5, h: 1.1 }, 60, 4, 3, 3, 2, false, [0, 1, 1, 0],
            [["splashAttack", 0.15], ["wellAlgae", 0.45], ["kelpKelpKelpKELPKELPKELP", 0.95], ["harvestOrAttack", 1]],
            [
                { money: true, min: 0, max: 5 },
                { seed: "carrot", min: -1, max: 1 }, 
            ], { tile: "watertile" });
        case "seaHandR":
            return new EnemyDetail(name, "lg", 1, { dx: 0, dy: 0, w: 1, h: 1.5 }, 60, 5, 2, 3, 3, true, [0, 0, 1, 0], [["dumbbattery", 1], ["standardAttack"]], [
                { money: true, min: 20, max: 50 }
            ], { tile: "watertile" });
        case "seaMan":
            return new EnemyDetail(name, "lg", 2, { dx: 0, dy: 0, w: 1, h: 1.5 }, 60, 5, 2, 3, 3, true, [0, 0, 1, 0], [["wellAlgae", 1], ["standardAttack"]], [
                { money: true, min: 20, max: 50 }
            ], { tile: "watertile" });
        case "seaHandL":
            return new EnemyDetail(name, "lg", 3, { dx: 0, dy: 0, w: 1, h: 1.5 }, 60, 5, 2, 3, 3, true, [0, 0, 1, 0], [["dumbbattery", 1], ["standardAttack"]], [
                { money: true, min: 20, max: 50 }
            ], { tile: "watertile" });
    }
}
var enemyFuncs = {
    GetAvailableCropsAndDamage: function(e) {
        var dmg = 0;
        var crops = [];
        for(var x = 0; x < combat.enemyGrid.length; x++) {
            for(var y = 0; y < combat.enemyGrid[0].length; y++) {
                var tile = combat.enemyGrid[x][y];
                if(tile === null || tile.x !== undefined) { continue; }
                if(tile.activeTime > 0 || tile.rotten) { continue; }
                dmg += tile.power;
                crops.push([tile.name, x, y]);
            }
        }
        dmg += dmg == 0 ? (e.atk / 1.5) : e.atk;
        dmg = Math.max(1, Math.round(dmg - player.def));
        return { crops: crops, damage: dmg };
    },
    TryPlantCrop: function(cropName) {
        var pos = {x: -1, y: -1};
        var attempts = 5;
        while(attempts-- >= 0 && pos.x < 0) {
            var x = Math.floor(Math.random() * combat.enemyGrid.length);
            var y = Math.floor(Math.random() * combat.enemyGrid[0].length);
            if(combat.enemyGrid[x][y] === null) {
                pos = { x: x, y: y };
            }
        }
        if(pos.x < 0) { return false; }
        var newCrop = GetCrop(cropName);
        newCrop.activeTime = newCrop.time;
        combat.enemyGrid[pos.x][pos.y] = newCrop;
        combat.animHelper.DrawCrops();
        combat.animHelper.DrawBottom();
        return true;
    },
    GetGenericStandbyAttack: function(str) { return { text: str, animFPS: 4, animData: [ [0, 4], [0, 5] ] }; },
    SplashTile: function(e, x, y, noRecursion) {
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
                enemyFuncs.SplashTile(e, initx + 1, inity, true);
                enemyFuncs.SplashTile(e, initx, inity + 1, true);
                enemyFuncs.SplashTile(e, initx + 1, inity + 1, true);
            } else {
                combat.effectGrid[x][y] = { type: "shocked", duration: e.atk };
            }
        } else {
            combat.effectGrid[x][y] = { type: "splashed", duration: e.atk };
        }
        combat.animHelper.DrawBackground();
        var crop = combat.grid[x][y];
        if(crop === null) { return { status: true, crop: false }; }

        var dmg = enemyFuncs.GetCropDamage(e, x, y);
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
    DisturbTile: function(x, y, type) {
        var itemTile = player.itemGrid[x][y];
        if(itemTile !== null && itemTile.x !== undefined) { itemTile = player.itemGrid[itemTile.x][itemTile.y]; }
        if((itemTile !== null && itemTile !== "_hotspot") || combat.grid[x][y] !== null) { return false; }
        var newCrop = GetCrop(type);
        newCrop.activeTime = newCrop.time;
        combat.grid[x][y] = newCrop;
        return true;
    },
    BurnTile: function(e, x, y) {
        var itemTile = player.itemGrid[x][y];
        var crop = combat.grid[x][y];
        var effect = combat.effectGrid[x][y];
        if(effect !== null && effect.type === "splashed") { return { status: false, wet: true }; }
        if(itemTile !== null && itemTile.x !== undefined) { itemTile = player.itemGrid[itemTile.x][itemTile.y]; }
        if(["_cow", "_lake", "_paddy", "_shooter", "_hotspot", "_modulator", "_sprinkler"].indexOf(itemTile) >= 0) { return { status: false }; }
        if(itemPos === "_strongsoil" && (Math.random() * player.luck) > 0.75) { return { status: false }; }

        combat.effectGrid[x][y] = { type: "burned", duration: e.atk };
        if(["_log", "_coop", "_beehive"].indexOf(itemTile) >= 0) {
            var hadTile = (crop !== null);
            if(hadTile) { combat.grid[x][y] = null; }
            return { status: true, crop: hadTile, destroyed: true, special: itemTile };
        }
        if(crop === null) { return { status: true, crop: false }; }
        var dmg = enemyFuncs.GetCropDamage(e, x, y);

        crop.power -= dmg;
        if(crop.rotten) { crop.power = 0; }
        if(crop.power <= 0) {
            combat.grid[x][y] = null;
            combat.animHelper.DrawCrops();
            return { status: true, crop: true, destroyed: true, special: "" };
        } else {
            return { status: true, crop: true, destroyed: false, special: "" };
        }
    },
    GetCropDamage: function(e, x, y) {
        var crop = combat.grid[x][y];
        var itemTile = player.itemGrid[x][y];
        var dmg = Math.ceil(e.atk / 2); // TODO: water/fire resistance
        if(crop.x !== undefined) {
            crop = combat.grid[crop.x][crop.y];
            dmg = Math.ceil(dmg / 2);
        }
        if(itemTile === "_strongsoil") { dmg = Math.round(dmg / 2); }
        return dmg;
    }
};
var enemyAttacks = {
    app: function(e) { return enemyFuncs.GetGenericStandbyAttack(e.name + " is distracted by a hot new App."); },
    gear: function(e) { return enemyFuncs.GetGenericStandbyAttack(e.name + " is thinking about the concept of gears."); },
    babySlap: function(e) {
        combat.damagePlayer(1);
        return { text: e.name + " slaps for 1 damage.", animFPS: 12, animData: [ [0, 2], [0, 2], [0, 3], [0, 0, true] ] };
    },
    standardAttack: function(e) {
        combat.damagePlayer(e.atk);
        return { text: e.name + " attacks for " + e.atk + " damage.", animFPS: 12, animData: [ [0, 2], [0, 2], [0, 3], [0, 0, true] ] };
    },
    dumbbattery: function(e) {
        var atkData = enemyFuncs.GetAvailableCropsAndDamage(e);
        if(atkData.crops.length === 0) {
            var doAttack = (Math.random() > 0.95) ? true : !enemyFuncs.TryPlantCrop("battery");
            if(doAttack) { return enemyAttacks[e.attacks[1][0]](e); }
            return enemyFuncs.GetGenericStandbyAttack(e.name + " started charging a battery.");
        } else {
            combat.damagePlayer(atkData.damage);
            combat.flagFreshCrops(false);
            return {
                text: e.name + " attacks for " + atkData.damage + " damage.",
                animFPS: 12, animData: [ [0, 2], [0, 2], [0, 3], [0, 0, true] ],
                throwables: atkData.crops
            };
        }
    },
    wellAlgae: function(e) {
        if(enemyFuncs.GetAvailableCropsAndDamage(e).crops.length * Math.random() > 0.75) { return enemyAttacks.harvestOrAttack(e); }
        var planted = enemyFuncs.TryPlantCrop("algae");
        if(planted) {
            return enemyFuncs.GetGenericStandbyAttack(e.name + " plants some algae.");
        } else if(Math.random() > 0.5) {
            return enemyAttacks.harvestOrAttack(e);
        } else {
            return enemyFuncs.GetGenericStandbyAttack(e.name + " tries to plant some algae, but fails.");
        }
    },
    kelpKelpKelpKELPKELPKELP: function(e) {
        if(enemyFuncs.GetAvailableCropsAndDamage(e).crops.length * Math.random() > 0.75) { return enemyAttacks.harvestOrAttack(e); }
        var planted = enemyFuncs.TryPlantCrop("kelp");
        if(planted) {
            return enemyFuncs.GetGenericStandbyAttack(e.name + " plants some algae.");
        } else if(Math.random() > 0.5) {
            return enemyAttacks.harvestOrAttack(e);
        } else {
            return enemyFuncs.GetGenericStandbyAttack(e.name + " tries to plant some algae, but fails.");
        }
    }, 
    harvestOrAttack: function(e) {
        var atkData = enemyFuncs.GetAvailableCropsAndDamage(e);
        var dmg = atkData.crops.length === 0 ? Math.max(1, e.atk - player.def) : atkData.damage;
        combat.damagePlayer(dmg);
        return {
            text: e.name + " attacks for " + dmg + " damage.",
            animFPS: 12, animData: [ [0, 2], [0, 2], [0, 3], [0, 0, true] ],
            throwables: atkData.crops
        };
    },
    splashAttack: function(e) {
        var res = enemyFuncs.SplashTile(e, Math.floor(Math.random() * player.gridWidth), Math.floor(Math.random() * player.gridHeight));
        if(!res.status) { return { text: e.name + " splashes some water, but it does nothing.", animFPS: 12, animData: [ [0, 2], [0, 2], [0, 3], [0, 0, true] ] }; }
        if(!res.crop) { return { text: e.name + " splashes some water on your field.", animFPS: 12, animData: [ [0, 2], [0, 2], [0, 3], [0, 0, true] ] }; }
        if(res.destroyed) {
            return { text: e.name + " splashes some water on your field, destroying a crop!", animFPS: 12, animData: [ [0, 2], [0, 2], [0, 3], [0, 0, true] ] };
        } else {
            return { text: e.name + " splashes some water on your field, damaging a crop!",  animFPS: 12, animData: [ [0, 2], [0, 2], [0, 3], [0, 0, true] ] };
        }
    },
    floodRow: function(e) {
        var y = Math.floor(Math.random() * player.gridHeight);
        for(var x = 0; x < player.gridWidth; x++) {
            enemyFuncs.SplashTile(e, x, y);
        }
        return { text: e.name + " pours water all over your field!", animFPS: 12, animData: [ [0, 2], [0, 2], [0, 3], [0, 0, true] ] };
    },
    rockToss: function(e) {
        var res = enemyFuncs.DisturbTile(Math.floor(Math.random() * player.gridWidth), Math.floor(Math.random() * player.gridHeight), "rock");
        if(res) {
            return { text: e.name + " throws a rock onto your field.", animFPS: 12, animData: [ [0, 2], [0, 2], [0, 3], [0, 0, true] ] };
        } else {
            return { text: e.name + " tries throwing a rock, but misses.", animFPS: 12, animData: [ [0, 2], [0, 2], [0, 3], [0, 0, true] ] };
        }
    },
    saltToss: function(e) {
        var res = enemyFuncs.DisturbTile(Math.floor(Math.random() * player.gridWidth), Math.floor(Math.random() * player.gridHeight), "salt");
        if(res) {
            return { text: e.name + " throws salt onto your field.", animFPS: 12, animData: [ [0, 2], [0, 2], [0, 3], [0, 0, true] ] };
        } else {
            return { text: e.name + " tries throwing salt, but the wind blows it away.", animFPS: 12, animData: [ [0, 2], [0, 2], [0, 3], [0, 0, true] ] };
        }
    },
    burnAttack: function(e) {
        var res = enemyFuncs.BurnTile(e, Math.floor(Math.random() * player.gridWidth), Math.floor(Math.random() * player.gridHeight));
        if(!res.status) { return { text: e.name + " tries to set a fire, but fails.", animFPS: 12, animData: [ [0, 2], [0, 2], [0, 3], [0, 0, true] ] }; }
        if(!res.crop) {
            if(res.special === undefined || res.special === "") {
                return { text: e.name + " sets a fire on your field.", animFPS: 12, animData: [ [0, 2], [0, 2], [0, 3], [0, 0, true] ] };
            } else {
                return { text: e.name + " sets a fire on your field, burning your " + GetFarmInfo(res.special).displayname, animFPS: 12, animData: [ [0, 2], [0, 2], [0, 3], [0, 0, true] ] };
            }
        }
        if(res.destroyed) {
            if(res.special === undefined || res.special === "") {
                return { text: e.name + " sets a fire on your field, destroying a crop.", animFPS: 12, animData: [ [0, 2], [0, 2], [0, 3], [0, 0, true] ] };
            } else {
                return { text: e.name + " sets a fire on your field, burning your " + GetFarmInfo(res.special).displayname, animFPS: 12, animData: [ [0, 2], [0, 2], [0, 3], [0, 0, true] ] };
            }
        } else {
            if(res.special === undefined || res.special === "") {
                return { text: e.name + " sets a fire on your field, damaging a crop.", animFPS: 12, animData: [ [0, 2], [0, 2], [0, 3], [0, 0, true] ] };
            } else {
                return { text: e.name + " sets a fire on your field, burning your " + GetFarmInfo(res.special).displayname, animFPS: 12, animData: [ [0, 2], [0, 2], [0, 3], [0, 0, true] ] };
            }
        }
    }
};
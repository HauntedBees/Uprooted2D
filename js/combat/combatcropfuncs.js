combat.getUsedShooterIndex = function(x, y) { return combat.getArrIdx(combat.usedShooters, x, y); };
combat.getCowIndex = function(x, y) { return combat.getArrIdx(combat.happyCows, x, y); };
combat.getArrIdx = function(arr, x, y) {
    for(var i = 0; i < arr.length; i++) {
        if(arr[i].x === x && arr[i].y === y) {
            return i;
        }
    }
    return -1;
};

combat.GetEnemyCatchChance = function(crop) {
    if(crop.type === "bee" && ["beeQueenA", "beeQueenB", "beeQueenC"].indexOf(combat.enemies[0].id) >= 0) { return 0.65; }
    else { return combat.GetCatchChance(crop); }
};
combat.GetCatchChance = function(crop) { // rods, nets, bees, spears
    if(crop.type === "water") { return 0.2; }
    if(crop.type === "spear") { return 0.65; }
    var val = 0.3;
    if(crop.power < 2) { val = 0.15; }
    else if(crop.power < 6) { val = 0.175; }
    else if(crop.power < 10) { val = 0.2; }
    if(crop.type === "bee") { val *= 0.75; }
    return val;
};
combat.GetFish = function(crop, luck) { // rods & spears
    var fishArr = [0, 1, 2];
    switch(crop.name) {
        case "rod": fishArr = [0, 0, 1]; break;
        case "goodrod": fishArr = [0, 1, 1, 2]; break;
        case "metalrod": fishArr = [1, 1, 1, 2]; break;
        case "ultrarod": fishArr = [2, 4, 4, 4]; break; // 3 = net
    }
    return fishArr[Math.floor(fishArr.length * Math.random() * luck)];
};

combat.ageCrops = function() {
    for(var x = 0; x < this.grid.length; x++) {
        for(var y = 0; y < this.grid[0].length; y++) {
            if(this.grid[x][y] === null || this.grid[x][y].name === undefined) { continue; }
            var crop = this.grid[x][y];
            if(crop.type === "water" || crop.type === "rod") {
                var success = Math.random() <= (combat.GetCatchChance(crop) * player.luck);
                if(success) {
                    if((crop.name === "net" || crop.name === "bignet") && crop.rotten) {
                        crop.rotten = false;
                        var range = InclusiveRange(-2, 2);
                        crop.power += range;
                        crop.fishNum = crop.name === "bignet" ? 5 : 3;
                        crop.activeTime = crop.time;
                    } else if(crop.type === "rod" && !crop.ready && !crop.rotten) {
                        crop.ready = true;
                        crop.activeTime = 0;
                        crop.fishNum = combat.GetFish(crop, player.luck);
                        crop.power += crop.fishNum;
                    }
                }
            } else if(crop.type === "bee" && Math.random() <= (combat.GetCatchChance(crop) * player.luck)) {
                crop.rotten = false;
                crop.activeTime = 0;   
            }
            if(crop.activeTime > 0) {
                crop.activeTime -= 1;
                if(crop.activeTime === 0 && (crop.type === "sickle2" || crop.type === "rock" || (crop.type === "rod" && !crop.ready))) { this.removeCrop({x: x, y: y}); }
            } else if(crop.activeTime === 0) {
                if(crop.respawn > 0 && (crop.type === "veg" || crop.type === "tree")) { crop.activeTime = crop.respawn; }
                else if(crop.type === "veg") { crop.rotten = true; }
                else if(crop.type === "egg") { crop.power += 1; }
                else if(crop.type === "rod" && !crop.ready) { this.removeCrop({x: x, y: y}); }
            }
        }
    }
    if(!conditions["UNPLUGGED"]()) {
        for(var x = 0; x < this.enemyGrid.length; x++) {
            for(var y = 0; y < this.enemyGrid[0].length; y++) {
                if(this.enemyGrid[x][y] === null || this.enemyGrid[x][y].name === undefined) { continue; }
                var crop = this.enemyGrid[x][y];
                if(crop.activeTime > 0) {
                    if(crop.type === "water" || crop.type === "rod") {
                        var success = Math.random() < combat.GetCatchChance(crop);
                        if((crop.name === "net" || crop.name === "bignet") && crop.rotten && success) {
                            crop.rotten = false;
                            crop.power += Range(0, 5);
                            crop.activeTime = crop.time;
                        } else if(crop.type === "rod" && !crop.ready && !crop.rotten && success) {
                            crop.ready = true;
                            crop.activeTime = 0;
                            crop.fishNum = combat.GetFish(crop, 0.8);
                            crop.power += crop.fishNum;
                        }
                    } else if(crop.type === "bee" && Math.random() < combat.GetEnemyCatchChance(crop)) {
                        crop.rotten = false;
                        crop.activeTime = 0;
                    } else {
                        crop.activeTime -= 1;
                    }
                } else if(crop.activeTime == 0) {
                    if(crop.respawn > 0) {
                        crop.activeTime = crop.respawn;
                    } else if(!crop.noRot && crop.type !== "tech" && crop.type !== "babby") {
                        crop.rotten = true;
                    }
                }
            }
        }
    }
    combat.animHelper.DrawCrops();
};
combat.FlagFreshCrops = function(isPlayer, isCritical) { // TODO: this probably shun't even exist
    var grid = (isPlayer ? this.grid : this.enemyGrid);
    for(var x = 0; x < grid.length; x++) {
        for(var y = 0; y < grid[0].length; y++) {
            if(grid[x][y] === null || grid[x][y].name === undefined) { continue; }
            var crop = grid[x][y];
            if(crop.name === "app") { if(crop.activeTime > 2) { continue; } }
            else if(crop.rotten || crop.activeTime > 0) { continue; }
            crop.flagged = true;
            if(!isPlayer) { continue; }
            var seedChance = (Math.random() * (1 - player.luck)) * (isCritical ? 0.5 : 1); // TODO: move to somewhere else probably
            if(crop.name.indexOf("special") === 0) { seedChance = 1; }
            if(seedChance < 0.05) {
                crop.seedDrop = crop.name + "seed";
                player.increaseItem(crop.name);
            }
        }
    }
};
combat.FlagFreshCropsAndReturnAnimData = function(isPlayer, isCritical, animals, additionalTargets) {
    var grid = (isPlayer ? this.grid : this.enemyGrid);
    var res = [];
    for(var x = 0; x < grid.length; x++) {
        for(var y = 0; y < grid[0].length; y++) {
            if(grid[x][y] === null || grid[x][y].name === undefined) { continue; }
            var crop = grid[x][y];
            if(crop.name === "app") { if(crop.activeTime > 2) { continue; } }
            else if(crop.rotten || crop.activeTime > 0) { continue; }
            crop.flagged = true;
            if(!isPlayer) { continue; }
            var animal = undefined;
            for(var i = animals.length - 1; i >= 0; i--) {
                if(animals[i].crop !== crop.name) { continue; }
                animal = animals[i].animal;
                animals.splice(i, 1);
                break;
            }
            res.push([x, y]);
            var seedChance = (Math.random() * (1 - player.luck)) * (isCritical ? 0.5 : 1);
            if(crop.name.indexOf("special") === 0) { seedChance = 1; }
            if(seedChance < 0.05) {
                crop.seedDrop = crop.name + "seed";
                player.increaseItem(crop.name);
            }
        }
    }
    return res;
};
combat.ClearAndReturnCrop = function(pos) {
    var crop = this.grid[pos.x][pos.y];
    this.grid[pos.x][pos.y] = null;
    crop.flagged = true;
    return crop;
};
combat.cleanFlaggedCrops = function() {
    for(var x = 0; x < this.grid.length; x++) {
        for(var y = 0; y < this.grid[0].length; y++) {
            if(this.grid[x][y] === null || this.grid[x][y].name === undefined || !this.grid[x][y].flagged) { continue; }
            combat.purgeFlaggedCrop(this.grid, x, y);
        }
    }
    for(var x = 0; x < combat.enemywidth; x++) {
        for(var y = 0; y < combat.enemyheight; y++) {
            if(this.enemyGrid[x][y] === null || this.enemyGrid[x][y].name === undefined || !this.enemyGrid[x][y].flagged) { continue; }
            combat.purgeFlaggedCrop(this.enemyGrid, x, y);
        }
    }
};
combat.purgeFlaggedCrop = function(grid, x, y) {
    if(grid[x][y] === null || grid[x][y].name === undefined) { return false; }
    var crop = grid[x][y];
    //if(crop.name !== "app" && (crop.rotten || crop.activeTime > 0)) { return false; } // TODO: why was this even here
    if(crop.respawn > 0) {
        crop.activeTime = crop.respawn;
        crop.flagged = false;
    } else {
        grid[x][y] = null;
        if(crop.size === 2 && crop.type !== "tree") {
            grid[x+1][y] = null;
            grid[x][y+1] = null;
            grid[x+1][y+1] = null;
        }
    }
    combat.animHelper.DrawCrops();
    return (crop.size === 2);
};
combat.removeCrop = function(pos) {
    var crop = this.grid[pos.x][pos.y];
    this.grid[pos.x][pos.y] = null;
    if(crop.size == 2) {
        this.grid[pos.x + this.dx][pos.y] = null;
        this.grid[pos.x][pos.y + 1] = null;
        this.grid[pos.x + this.dx][pos.y + 1] = null;
    }
    return crop;
};
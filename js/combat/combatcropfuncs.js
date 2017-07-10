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

combat.ageCrops = function() {
    for(var x = 0; x < this.grid.length; x++) {
        for(var y = 0; y < this.grid[0].length; y++) {
            if(this.grid[x][y] === null || this.grid[x][y].name === undefined) { continue; }
            var crop = this.grid[x][y];
            if(crop.type === "water" || crop.type === "rod") {
                var success = (Math.random() * player.luck) < crop.req;
                if(crop.name === "net" && crop.rotten && success) {
                    crop.rotten = false;
                    crop.power += Range(0, 5);
                    crop.activeTime = crop.time;
                } else if(crop.type === "rod" && !crop.ready && !crop.rotten && success) {
                    crop.ready = true;
                    crop.activeTime = 0;
                    var fishNum = 0;
                    while(fishNum < 2 && Math.random() > (crop.catchLuck * player.luck)) { fishNum++; }
                    crop.power = 10 + fishNum * 10;
                    crop.fishNum = fishNum;
                }
            } else if(crop.type === "bee" && (Math.random() * player.luck) < crop.req) {
                crop.rotten = false;
                crop.activeTime = 0;   
            }
            if(crop.activeTime > 0) {
                crop.activeTime -= 1;
            } else if(crop.activeTime == 0) {
                var rotResist = player.getRotResist();
                if(rotResist > 0) {
                    if(crop.delay === undefined) {
                        crop.delay = rotResist;
                    } else {
                        crop.delay--;
                    }
                    if(crop.delay > 0) { continue; }
                }
                if(crop.respawn > 0 && (crop.type === "veg" || crop.type === "tree")) { crop.activeTime = crop.respawn; }
                else if(crop.type === "veg") { crop.rotten = true; }
                else if(crop.type === "egg") { crop.power += 1; }
                else if(crop.type === "rod" && !crop.ready) { this.removeCrop({x: x, y: y}); }
            }
        }
    }
    for(var x = 0; x < this.enemyGrid.length; x++) {
        for(var y = 0; y < this.enemyGrid[0].length; y++) {
            if(this.enemyGrid[x][y] === null || this.enemyGrid[x][y].name === undefined) { continue; }
            var crop = this.enemyGrid[x][y];
            if(crop.activeTime > 0) {
                crop.activeTime -= 1;
            } else if(crop.activeTime == 0) {
                if(crop.respawn > 0) {
                    crop.activeTime = crop.respawn;
                } else {
                    crop.rotten = true;
                }
            }
        }
    }
    combat.animHelper.DrawCrops();
};
combat.flagFreshCrops = function(isPlayer, isCritical) {
    var grid = (isPlayer ? this.grid : this.enemyGrid);
    for(var x = 0; x < grid.length; x++) {
        for(var y = 0; y < grid[0].length; y++) {
            if(grid[x][y] === null || grid[x][y].name === undefined) { continue; }
            var crop = grid[x][y];
            if(crop.rotten || crop.activeTime > 0) { continue; }
            crop.flagged = true;
            if(!isPlayer) { continue; }
            combat.animHelper.AddPlayerThrowable([crop.name, x, y]);
            var seedChance = Math.random() * player.luck * (isCritical ? 0.5 : 1);
            if(crop.name.indexOf("special") === 0) { seedChance = 1; }
            if(seedChance < 0.05) {
                crop.seedDrop = crop.name + "seed";
                player.increaseItem(crop.name);
            }
        }
    }
};
combat.flagCrop = function(pos) {
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
    for(var x = 0; x < this.enemyGrid.length; x++) {
        for(var y = 0; y < this.enemyGrid[0].length; y++) {
            if(this.enemyGrid[x][y] === null || this.enemyGrid[x][y].name === undefined || !this.enemyGrid[x][y].flagged) { continue; }
            combat.purgeFlaggedCrop(this.enemyGrid, x, y);
        }
    }
};
combat.purgeFlaggedCrop = function(grid, x, y) {
    if(grid[x][y] === null || grid[x][y].name === undefined) { return false; }
    var crop = grid[x][y];
    if(crop.rotten || crop.activeTime > 0) { return false; }
    if(crop.respawn > 0) {
        crop.activeTime = crop.respawn;
        crop.flagged = false;
    } else {
        grid[x][y] = null;
    }
    combat.animHelper.DrawCrops();
    return (crop.size == 2);
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
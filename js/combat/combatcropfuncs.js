combat.getUsedShooterIndex = (x, y) => combat.getArrIdx(combat.usedShooters, x, y);
combat.getCowIndex = (x, y) => combat.getArrIdx(combat.happyCows, x, y);
combat.getArrIdx = function(arr, x, y) {
    for(let i = 0; i < arr.length; i++) {
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
    let val = 0.3;
    if(crop.power < 2) { val = 0.15; }
    else if(crop.power < 6) { val = 0.175; }
    else if(crop.power < 10) { val = 0.2; }
    if(crop.type === "bee") { val *= 0.75; }
    return val;
};
combat.GetFish = function(crop, luck) { // rods & spears
    let fishArr = [0, 1, 2];
    switch(crop.name) {
        case "rod": fishArr = [0, 0, 1]; break;
        case "goodrod": fishArr = [0, 1, 1, 2]; break;
        case "metalrod": fishArr = [1, 1, 1, 2]; break;
        case "ultrarod": fishArr = [2, 4, 4, 4]; break; // 3 = net
    }
    return fishArr[Math.floor(fishArr.length * Math.random() * luck)];
};

combat.ageCrops = function() {
    for(let x = 0; x < player.gridWidth; x++) {
        for(let y = 0; y < player.gridHeight; y++) {
            combat.AgeCrop(combat.grid, x, y, combat.GetCatchChance);
        }
    }
    if(!conditions["UNPLUGGED"]()) {
        for(let x = 0; x < this.enemywidth; x++) {
            for(let y = 0; y < this.enemyheight; y++) {
                combat.AgeCrop(combat.enemyGrid, x, y, combat.GetEnemyCatchChance);
            }
        }
    }
    combat.animHelper.DrawCrops();
};
combat.AgeCrop = function(grid, x, y, catchFunc) {
    if(grid[x][y] === null || grid[x][y].name === undefined) { return; }
    const crop = grid[x][y];
    if(crop.type === "water" || crop.type === "rod") {
        const success = Math.random() <= (combat.GetCatchChance(crop) * player.luck);
        if(success) {
            if((crop.name === "net" || crop.name === "bignet") && crop.rotten) {
                crop.rotten = false;
                const range = InclusiveRange(-2, 2);
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
    } else if(crop.type === "bee" && Math.random() <= (catchFunc(crop) * player.luck)) {
        crop.rotten = false;
        crop.activeTime = 0;
    }
    if(crop.activeTime > 0) {
        crop.activeTime -= 1;
        if(crop.activeTime === 0 && (crop.type === "sickle2" || crop.type === "rock" || (crop.type === "rod" && !crop.ready))) { crop.health = 0; this.PurgeCrop(grid, x, y); }
    } else if(crop.activeTime === 0) {
        if(crop.respawn > 0 && (crop.type === "veg" || crop.type === "tree")) { crop.activeTime = combat.plant.GetGrowthTime(crop, x, y, true); }
        else if(crop.type === "veg") { crop.rotten = true; }
        else if(crop.type === "egg") { crop.power += 1; }
        else if(crop.type === "rod" && !crop.ready) { crop.health = 0; this.PurgeCrop(grid, x, y); }
    }
};
combat.FlagFreshCropsAndGetSeedDrops = function(isPlayer, isCritical) {
    const grid = (isPlayer ? this.grid : this.enemyGrid);
    for(let x = 0; x < grid.length; x++) {
        for(let y = 0; y < grid[0].length; y++) {
            if(grid[x][y] === null || grid[x][y].name === undefined) { continue; }
            const crop = grid[x][y];
            if(crop.name === "app") { if(crop.activeTime > 2) { continue; } }
            else if(crop.rotten || crop.activeTime > 0) { continue; }
            crop.flagged = true;
            if(!isPlayer) { continue; }
            const seedChance = (Math.random() * (1 - player.luck)) * (isCritical ? 0.5 : 1);
            if(crop.name.indexOf("special") === 0) { seedChance = 1; }
            if(seedChance <= 0.05) {
                player.increaseItem(crop.name);
                crop.seedDrop = true;
            }
        }
    }
};
combat.ClearAndReturnCrop = function(pos) {
    const crop = this.grid[pos.x][pos.y];
    this.grid[pos.x][pos.y] = null;
    if(crop.size === 2) {
        this.grid[pos.x + 1][pos.y] = null;
        this.grid[pos.x][pos.y + 1] = null;
        this.grid[pos.x + 1][pos.y + 1] = null;
    }
    crop.flagged = true;
    return crop;
};
combat.RemoveFlaggedCrops = function() {
    for(let x = 0; x < player.gridWidth; x++) {
        for(let y = 0; y < player.gridHeight; y++) {
            if(this.grid[x][y] === null || this.grid[x][y].name === undefined || !this.grid[x][y].flagged) { continue; }
            combat.PurgeCrop(this.grid, x, y);
        }
    }
    for(let x = 0; x < combat.enemywidth; x++) {
        for(let y = 0; y < combat.enemyheight; y++) {
            if(this.enemyGrid[x][y] === null || this.enemyGrid[x][y].name === undefined || !this.enemyGrid[x][y].flagged) { continue; }
            combat.PurgeCrop(this.enemyGrid, x, y);
        }
    }
};
combat.PurgeCrop = function(grid, x, y) {
    if(grid[x][y] === null || grid[x][y].name === undefined) { return false; }
    const crop = grid[x][y];
    //if(crop.name !== "app" && (crop.rotten || crop.activeTime > 0)) { return false; } // TODO: why was this even here
    if(crop.respawn > 0 && crop.health > 0) {
        crop.activeTime = combat.plant.GetGrowthTime(crop, x, y, true);
        crop.flagged = false;
    } else {
        grid[x][y] = null;
        if(crop.size === 2) {
            grid[x + 1][y] = null;
            grid[x][y + 1] = null;
            grid[x + 1][y + 1] = null;
        }
    }
    combat.animHelper.DrawCrops();
    return (crop.size === 2);
};
var combat = {
    enemies: [], state: 0, season: 0, numPlantTurns: 0, dt: 50,
    lastTarget: 0, lastTargetCrop: false, 
    expEarned: 0, moniesEarned: 0, itemsEarned: [], happyCows: [], usedShooters: [],
    grid: [], enemyGrid: [], enemywidth: 0, enemyheight: 0,
    isBossBattle: false, dx: 0, dy: 0, enemydx: 0, enemydy: 0,
    animHelper: null, 
    startBattle: function(enemies) {
        worldmap.clean();
        gfx.clearAll();
        player.initGridDimensions();
        this.grid = this.getGrid(player.gridWidth, player.gridHeight);
        game.currentInputHandler = this.menu;
        this.lastTargetCrop = false;
        this.lastTarget = 0;
        this.setSeason(enemies);
        this.enemies = [];
        this.expEarned = 0;
        this.moniesEarned = 0;
        this.itemsEarned = [];
        this.happyCows = [];
        this.usedShooters = [];
        switch(player.gridWidth) {  // 3, 4, 6, 8, 10
            case 4: this.dx = 2; break;
            case 6: this.dx = 1; break;
            case 8: this.dx = 0.5; break;
            case 10: this.dx = 0; break;
            default: this.dx = 2; break;
        }
        switch(player.gridHeight) {  // 3, 4, 5, 6
            case 4: this.dy = 0.5; break;
            case 5: this.dy = 0.5; break;
            case 6: this.dy = 0.25; break;
            default: this.dy = 1.5; break;
        }
        this.enemywidth = 0;
        this.enemyheight = 0;
        this.isBossBattle = false;
        for(var i = 0; i < enemies.length; i++) {
            var enemy = GetEnemy(enemies[i]);
            this.isBossBattle = this.isBossBattle || enemy.boss;
            this.enemywidth += enemy.fieldwidth;
            this.enemyheight = Math.max(this.enemyheight, enemy.fieldheight);
            this.enemies.push(enemy);
        }
        this.animHelper = new CombatAnimHelper(enemies);
        this.enemyGrid = this.getGrid(this.enemywidth, this.enemyheight);
        this.enemydx = 10 + Math.floor((5 - this.enemywidth) / 2);
        this.enemydy = this.dy + Math.floor((player.gridHeight - this.enemyheight) / 2);
        combat.animHelper.DrawBackground();
        combat.animHelper.DrawCrops();
        combat.charAnimIdx = setInterval(function() { combat.animHelper.Animate() }, this.dt);
        this.startRound();
        this.menu.setup();
    },
    setSeason: function(enemies) {
        var dist = [0, 0, 0, 0];
        for(var i = 0; i < enemies.length; i++) {
            var sd = GetEnemy(enemies[i]).seasonDistribution;
            for(var j = 0; j < 4; j++) {
                dist[j] += sd[j];
            }
        }
        var season = Math.random();
        for(var j = 0; j < 4; j++) {
            dist[j] /= enemies.length;
            if(season <= dist[j]) {
                this.season = j;
                break;
            }
            season -= dist[j];
        }
    },
    setAnim: function (idx, anim, fr, throwables) {
        combat.animHelper.SetEnemyAnimInfo(idx, anim, fr, throwables);
        combat.animHelper.Animate();
    },
    clearAnimsAndRemoveCorpses: function() {
        combat.animHelper.CleanAnims();
        combat.animHelper.CleanEntities();
        combat.cleanFlaggedCrops();
        for(var i = combat.enemies.length - 1; i >= 0; i--) {
            if(combat.enemies[i].health <= 0) {
                combat.animHelper.RemoveEnemy(i);
                combat.enemies.splice(i, 1);
            }
        }
    },
    getUsedShooterIndex: function(x, y) {
        for(var i = 0; i < this.usedShooters.length; i++) {
            if(this.usedShooters[i].x === x && this.usedShooters[i].y === y) {
                return i;
            }
        }
        return -1;
    },
    getCowIndex: function(x, y) {
        for(var i = 0; i < this.happyCows.length; i++) {
            if(this.happyCows[i].x === x && this.happyCows[i].y === y) {
                return i;
            }
        }
        return -1;
    },
    damagePlayer: function(damage) { player.health = Math.max(0, player.health - damage); },
    damageEnemy: function(enemyidx, damage) {
        this.enemies[enemyidx].health -= damage;
        if(this.enemies[enemyidx].health <= 0) {
            var e = this.enemies[enemyidx];
            this.expEarned += e.exp;
            for(var i = 0; i < e.drops.length; i++) {
                var dropInfo = e.drops[i];
                if(dropInfo.money) {
                    this.moniesEarned += Range(dropInfo.min, dropInfo.max);
                } else {
                    this.addDroppedSeedToItemsEarned(dropInfo.seed, Math.max(0, Range(dropInfo.min, dropInfo.max)));
                }
            }
        }
    },
    displayEnemyDamage: function(enemyidx) {
        if(enemyidx >= this.enemies.length) { return; }
        if(this.enemies[enemyidx].health <= 0) {
            combat.animHelper.MakeEnemyACorpse(enemyidx);
        } else {
            combat.animHelper.GiveEnemyAHit(enemyidx);
        }
    },
    addDroppedSeedToItemsEarned: function(seed, amount) {
        if(amount === 0) { return; }
        for(var i = 0; i < this.itemsEarned; i++) {
            if(this.itemsEarned[i][0] == seed) {
                this.itemsEarned[i][1] += amount;
                return;
            }
        }
        this.itemsEarned.push([seed, amount]);
    },
    startRound: function() {
        this.numPlantTurns = player.getPlantingTurns();
        if(this.usedShooters.length > 0) {
            this.usedShooters = [];
            combat.animHelper.DrawBackground();
        }
        this.ageCrops();
        this.state = 0;
    },
    checkForLevelUp: function() {
        if(player.exp >= player.nextExp) {
            player.levelUp();
            game.transition(game.currentInputHandler, combat.inbetween, {
                next: combat.checkForLevelUp,
                text: "Whoah [gamer voice] nice! You hit level " + player.level + "!"
            });
        } else {
            var postCombat = game.target.postBattle;
            worldmap.clearTarget();
            clearInterval(combat.charAnimIdx);
            game.transition(combat.inbetween, worldmap, {
                init: worldmap.pos,
                map: worldmap.mapName,
                noEntityUpdate: true,
                postCombat: postCombat
            });
        }
    },
    fuckingDead: function() {
        var inn = inns[player.lastInn];
        if(game.target !== null) {
            game.target.failed = true;
            game.target = null;
        }
        player.health = player.maxhealth;
        clearInterval(combat.charAnimIdx);
        game.transition(game.currentInputHandler, worldmap, {  init: { x: inn.x,  y: inn.y }, map: inn.map });
    },
    endTurn: function(caller) {
        this.clearAnimsAndRemoveCorpses();
        combat.animHelper.DrawBackground();
        combat.animHelper.DrawCrops();
        if(player.health <= 0 && !game.currentInputHandler.isTutorial) {
            game.transition(game.currentInputHandler, combat.inbetween, {
                next: combat.fuckingDead,
                text: "i can't believe the protagonist is fucking dead."
            });
            return;
        } else if(this.enemies.length == 0) {
            player.addExp(this.expEarned);
            var text = "You did a the win.! You's's " + this.expEarned + "EXP";
            player.monies += this.moniesEarned;
            for(var i = 0; i < this.itemsEarned.length; i++) {
                player.increaseItem(this.itemsEarned[i][0], this.itemsEarned[i][1]);
            }
            if(this.moniesEarned > 0 && this.itemsEarned.length > 0) {
                text += ", " + this.moniesEarned + " coins";
                if(this.itemsEarned.length > 2) {
                    var count = 0;
                    for(var i = 0; i < this.itemsEarned.length; i++) { count += this.itemsEarned[i][1]; }
                    text += ", and " + count + " seeds!";
                } else {
                    for(var i = 0; i < this.itemsEarned.length; i++) {
                        var t = (i == (this.itemsEarned.length - 1) ? " and " : ", ");
                        t += this.itemsEarned[i][1] + " " + this.itemsEarned[i][0] + " seed" + (this.itemsEarned[i][1] > 1 ? "s" : "");
                        text += t;
                    }
                    text += "!";
                }
            } else if(this.moniesEarned > 0) {
                text += " and " + this.moniesEarned + " coins!";
            } else if(this.itemsEarned.length > 0) {
                if(this.itemsEarned.length > 2) {
                    var count = 0;
                    for(var i = 0; i < this.itemsEarned.length; i++) { count += this.itemsEarned[i][1]; }
                    text += " and " + count + " seeds!";
                } else {
                    for(var i = 0; i < this.itemsEarned.length; i++) {
                        var t = (i == (this.itemsEarned.length - 1) ? " and " : ", ");
                        t += this.itemsEarned[i][1] + " " + this.itemsEarned[i][0] + " seed" + (this.itemsEarned[i][1] > 1 ? "s" : "");
                        text += t;
                    }
                    text += "!";
                }
            } else {
                text += "!";
            }
            game.transition(game.currentInputHandler, combat.inbetween, {
                next: combat.checkForLevelUp,
                text: text
            });
            return;
        }
        this.state++;
        if(this.state > combat.enemies.length) {
            this.startRound();
            game.transition(caller, combat.menu);
        } else {
            var idx = this.state - 1;
            game.transition(caller, combat.enemyTurn, { enemy: this.enemies[idx], idx: idx });
        }
    },
    getGrid: function(w, h) {
        var g = [];
        for(var x = 0; x < w; x++) {
            var row = [];
            for(var y = 0; y < h; y++) { row.push(null); }
            g.push(row);
        }
        return g;
    },
    ageCrops: function() {
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
    },
    flagFreshCrops: function(isPlayer, isCritical) {
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
    },
    flagCrop: function(pos) {
        var crop = this.grid[pos.x][pos.y];
        this.grid[pos.x][pos.y] = null;
        crop.flagged = true;
        return crop;
    },
    cleanFlaggedCrops: function() {
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
    },
    purgeFlaggedCrop: function(grid, x, y) {
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
    },
    removeCrop: function(pos) {
        var crop = this.grid[pos.x][pos.y];
        this.grid[pos.x][pos.y] = null;
        if(crop.size == 2) {
            this.grid[pos.x + this.dx][pos.y] = null;
            this.grid[pos.x][pos.y + 1] = null;
            this.grid[pos.x + this.dx][pos.y + 1] = null;
        }
        return crop;
    }
};
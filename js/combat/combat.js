var combat = {
    enemies: [], state: 0, season: 0, numPlantTurns: 0,
    lastTarget: 0, lastTargetCrop: false,
    expEarned: 0, moniesEarned: 0, itemsEarned: [], happyCows: [], usedShooters: [],
    grid: [], effectGrid: [], enemyGrid: [], enemywidth: 0, enemyheight: 0, enemyTile: "tech", 
    isBossBattle: false, dx: 0, dy: 0, enemydx: 0, enemydy: 0,
    animHelper: null, 
    startBattle: function(enemies) {
        worldmap.clean();
        gfx.clearAll();
        player.initGridDimensions();
        this.grid = this.getGrid(player.gridWidth, player.gridHeight);
        this.effectGrid = this.getGrid(player.gridWidth, player.gridHeight);
        game.currentInputHandler = this.menu;
        this.lastTargetCrop = false;
        this.lastTarget = 0;
        this.setSeason(enemies);
        this.expEarned = 0;
        this.moniesEarned = 0;
        this.itemsEarned = [];
        this.happyCows = [];
        this.usedShooters = [];
        if(player.equipment.weapon !== null && GetEquipment(player.equipment.weapon).tech) {
            var hasCharger = false;
            for(var x = 0; x < player.gridWidth; x++) {
                if(hasCharger) { break; }
                for(var y = 0; y < player.gridHeight; y++) {
                    var item = combat.grid[x][y]
                    if(item !== null && item.type === "sickle2") {
                        hasCharger = true;
                        break;
                    }
                }
            }
            if(!hasCharger) { player.equipment.weapon = "!sickle2_weak"; }
        }
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
        this.enemies = [];
        for(var i = 0; i < enemies.length; i++) {
            var enemy = GetEnemy(enemies[i]);
            this.isBossBattle = this.isBossBattle || enemy.boss;
            this.enemywidth += enemy.fieldwidth;
            this.enemyheight = Math.max(this.enemyheight, enemy.fieldheight);
            if(enemy.tile) { this.enemyTile = enemy.tile; }
            this.enemies.push(enemy);
        }
        this.animHelper = new CombatAnimHelper(this.enemies);
        this.enemyGrid = this.getGrid(this.enemywidth, this.enemyheight);
        this.enemydx = 10 + Math.floor((5 - this.enemywidth) / 2);
        this.enemydy = this.dy + Math.floor((player.gridHeight - this.enemyheight) / 2);
        combat.animHelper.DrawBackground();
        combat.animHelper.DrawCrops();
        combat.charAnimIdx = setInterval(function() { combat.animHelper.Animate() }, timers.CHARANIM);
        this.startRound();
        this.menu.setup();
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
    setSeason: function(enemies) {
        var dist = [0, 0, 0, 0];
        for(var i = 0; i < enemies.length; i++) {
            var sd = GetEnemy(enemies[i]).seasonDistribution;
            for(var j = 0; j < 4; j++) { dist[j] += sd[j]; }
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
    startRound: function() {
        this.cleanUpEffects();
        this.numPlantTurns = player.getPlantingTurns();
        for(var i = 0; i < combat.enemies.length; i++) {
            combat.enemies[i].stickTurns = Math.max(0, combat.enemies[i].stickTurns - 1);
        }
        if(this.usedShooters.length > 0) {
            this.usedShooters = [];
            combat.animHelper.DrawBackground();
        }
        this.ageCrops();
        this.state = 0;
    },
    damagePlayer: function(damage) {
        if(player.equipment.gloves !== null) {
            var g = GetEquipment(player.equipment.gloves);
            var mult = (g.def === undefined) ? 1 : (1 - g.def);
            damage = Math.max(1, Math.floor(damage * mult));
        }
        player.health = Math.max(0, player.health - damage);
        return damage;
    },
    damageEnemy: function(enemyidx, damage) {
        this.enemies[enemyidx].health -= damage;
        var isFinalKill = false;
        if(this.enemies[enemyidx].health <= 0) {
            var e = this.enemies[enemyidx];
            this.expEarned += e.exp;
            if(e.soleKill) { isFinalKill = true; }
            for(var i = 0; i < e.drops.length; i++) {
                var dropInfo = e.drops[i];
                if(dropInfo.money) {
                    this.moniesEarned += Range(dropInfo.min, dropInfo.max);
                } else {
                    this.addDroppedSeedToItemsEarned(dropInfo.seed, Math.max(0, Range(dropInfo.min, dropInfo.max)));
                }
            }
        }
        if(isFinalKill) {
            for(var i = 0; i < this.enemies.length; i++) {
                if(i === enemyidx) { continue; }
                this.damageEnemy(i, this.enemies[i].health + 1);
            }
        }
    },
    stickEnemy: function(enemyidx, turns) {
        if(this.enemies[enemyidx].stickTurns === 0) { this.enemies[enemyidx].justStuck = true; }
        this.enemies[enemyidx].stickTurns = Math.min(this.enemies[enemyidx].stickTurns + turns, 8);
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
    endTurn: function(caller) {
        this.clearAnimsAndRemoveCorpses();
        combat.animHelper.DrawBackground();
        combat.animHelper.DrawCrops();
        if(player.health <= 0 && !game.currentInputHandler.isTutorial) {
            combat.animHelper.SetPlayerAnimInfo([[3, 1, false, true]]);
            game.innerTransition(game.currentInputHandler, combat.inbetween, {
                next: combat.fuckingDead,
                text: "i can't believe the protagonist is fucking dead."
            });
            return;
        } else if(this.enemies.length == 0) {
            player.addExp(this.expEarned);
            combat.animHelper.SetPlayerAnimInfo([[1, 1]]);
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
            game.innerTransition(game.currentInputHandler, combat.inbetween, {
                next: combat.checkForLevelUp,
                text: text
            });
            return;
        }
        this.state++;
        if(this.state > combat.enemies.length) {
            this.startRound();
            game.innerTransition(caller, combat.menu);
        } else {
            var idx = this.state - 1;
            game.innerTransition(caller, combat.enemyTurn, { enemy: this.enemies[idx], idx: idx });
        }
    },
    cleanUpEffects: function() {
        var redraw = false;
        for(var x = 0; x < player.gridWidth; x++) {
            for(var y = 0; y < player.gridHeight; y++) {
                var obj = combat.effectGrid[x][y];
                if(obj === null) { continue; }
                if(--obj.duration <= 0) { redraw = true; combat.effectGrid[x][y] = null; }
            }
        }
        if(redraw) { combat.animHelper.DrawBackground(); }
    },
    clearAnimsAndRemoveCorpses: function() {
        combat.animHelper.CleanAnims();
        combat.animHelper.CleanEntities();
        combat.cleanFlaggedCrops();
        for(var i = combat.enemies.length - 1; i >= 0; i--) {
            combat.enemies[i].justStuck = false;
            if(combat.enemies[i].health <= 0) {
                combat.animHelper.RemoveEnemy(i);
                combat.enemies.splice(i, 1);
            }
        }
        for(var i = 0; i < combat.enemies.length; i++) {
            combat.animHelper.SetEnemyAnimInfo(i, [[combat.enemies[i].spriteidx, 0]]);
        }
    },
    wrapUpCombat: function() {
        if(player.equipment.weapon === "!sickle2_weak") { player.equipment.weapon = "!sickle2"; }
    },
    fuckingDead: function() {
        var inn = inns[player.lastInn];
        if(game.target !== null) {
            if(game.target.nonStandardGameOver !== undefined) {
                combat.wrapUpCombat();
                var postCombat = game.target.nonStandardGameOver;
                worldmap.clearTarget();
                clearInterval(combat.charAnimIdx);
                game.transition(combat.inbetween, worldmap, {
                    init: { x: 8.5, y: 9 },
                    map: "gameover",
                    noEntityUpdate: true,
                    postCombat: postCombat
                });
                return;
            }
            game.target.failed = true;
            game.target = null;
        }
        player.health = player.maxhealth;
        clearInterval(combat.charAnimIdx);
        combat.wrapUpCombat();
        game.transition(game.currentInputHandler, worldmap, {  init: { x: inn.x,  y: inn.y }, map: inn.map, isInn: true });
    },
    checkForLevelUp: function() {
        if(player.exp >= player.nextExp) {
            player.levelUp();
            combat.animHelper.SetPlayerAnimInfo([[2, 2], [2, 3]]);
            game.innerTransition(game.currentInputHandler, combat.inbetween, {
                next: combat.checkForLevelUp,
                text: "Whoah [gamer voice] nice! You hit level " + player.level + "!"
            });
        } else {
            combat.wrapUpCombat();
            var postCombat = (game.target !== null ? game.target.postBattle : undefined);
            if(game.target !== null && !game.target.dontClearTarget) { worldmap.clearTarget(); }
            clearInterval(combat.charAnimIdx);
            game.transition(combat.inbetween, worldmap, {
                init: worldmap.pos,
                map: worldmap.mapName,
                noEntityUpdate: true,
                postCombat: postCombat
            });
        }
    }
};
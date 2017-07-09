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
        this.enemies = [];
        for(var i = 0; i < enemies.length; i++) {
            var enemy = GetEnemy(enemies[i]);
            this.isBossBattle = this.isBossBattle || enemy.boss;
            this.enemywidth += enemy.fieldwidth;
            this.enemyheight = Math.max(this.enemyheight, enemy.fieldheight);
            this.enemies.push(enemy);
        }
        this.animHelper = new CombatAnimHelper(this.enemies);
        this.enemyGrid = this.getGrid(this.enemywidth, this.enemyheight);
        this.enemydx = 10 + Math.floor((5 - this.enemywidth) / 2);
        this.enemydy = this.dy + Math.floor((player.gridHeight - this.enemyheight) / 2);
        combat.animHelper.DrawBackground();
        combat.animHelper.DrawCrops();
        combat.charAnimIdx = setInterval(function() { combat.animHelper.Animate() }, this.dt);
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
        this.numPlantTurns = player.getPlantingTurns();
        if(this.usedShooters.length > 0) {
            this.usedShooters = [];
            combat.animHelper.DrawBackground();
        }
        this.ageCrops();
        this.state = 0;
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
    }
};
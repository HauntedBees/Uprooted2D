var combat = {
    enemies: [], state: 0, season: 0, numPlantTurns: 0, dt: 50, 
    playerAnimInfo: { animState: 0, anim: [[0, 0]], x: 4, y: 5.75, throwables: [] },
    expEarned: 0, moniesEarned: 0, itemsEarned: [], happyCows: [], usedShooters: [],
    grid: [], enemyGrid: [], enemywidth: 0, enemyheight: 0, throwables: [], 
    isBossBattle: false, dx: 0, dy: 0, enemydx: 0, enemydy: 0,
    startBattle: function(enemies) {
        worldmap.clean();
        gfx.clearAll();
        player.initGridDimensions();
        this.grid = this.getGrid(player.gridWidth, player.gridHeight);
        game.currentInputHandler = this.menu;
        this.setPlayerAnim();
        this.throwables = [];
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
        this.enemyGrid = this.getGrid(this.enemywidth, this.enemyheight);
        this.drawMainElements();
        combat.charAnimIdx = setInterval(combat.drawCharacters, this.dt);
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
    drawCharacters: function() {
        gfx.clearSome(["characters", "menucursorC"]);
        combat.animateEntity(combat.playerAnimInfo, 4, 5.75, true);
        var initx = 11 - combat.enemies.length;
        for(var i = 0; i < combat.enemies.length; i++) { // enemies
            if(combat.enemies[i].isBig) {
                gfx.drawBigCharacter(combat.enemies[i].spriteidx, 0, initx + i, 5.75);
            } else {
                if(combat.enemies[i].dead) {
                    gfx.drawDitheredCharacter(combat.enemies[i].spriteidx, 1, initx + i, 5.75, (combat.enemies[i].deadFrame++));
                } else if(combat.enemies[i].hit) {
                    var dx = Math.random() > 0.5 ? 0.125 : (Math.random() > 0.5 ? -0.125 : 0);
                    var dy = Math.random() > 0.5 ? -0.25 : (Math.random() > 0.5 ? -0.125 : 0);
                    gfx.drawCharacter(combat.enemies[i].spriteidx, 1, initx + i + dx, 5.75 + dy);
                } else if(combat.enemies[i].anim) {
                    combat.animateEntity(combat.enemies[i], initx + i, 5.75);
                } else {
                    gfx.drawCharacter(combat.enemies[i].spriteidx, 0, initx + i, 5.75);
                }
            }
        }
        combat.drawThrowables();
    },
    setPlayerAnim: function(anims, x, y, top) {
        combat.playerAnimInfo.animState = 0;
        combat.playerAnimInfo.anim = anims || [[0, 0]];
        combat.playerAnimInfo.timePerFrame = anim.timePerFrame;
        combat.playerAnimInfo.x = x || 4; 
        combat.playerAnimInfo.y = y || 5.75; 
        combat.playerAnimInfo.onTop = top; 
        combat.playerAnimInfo.lastThrownFrame = -1;
    },
    setAnim: function (idx, anim, fr, throwables) {
        combat.enemies[idx].animState = 0;
        combat.enemies[idx].timePerFrame = fr;
        combat.enemies[idx].lastRan = +new Date();
        combat.enemies[idx].anim = anim;
        combat.enemies[idx].throwables = throwables || [];
        combat.enemies[idx].lastThrownFrame = -1;
        combat.drawCharacters();
    },
    drawThrowables: function() {
        if(combat.throwables.length === 0) { return; }
        for(var i = combat.throwables.length - 1; i >= 0; i--) {
            var t = combat.throwables[i];
            if(t.frame >= t.time) {
                t.target.hit = true;
                combat.throwables.splice(i, 1);
                continue;
            }
            var radians = Math.PI * (t.dir < 0 ? (t.frame / t.time) : (1 - (t.frame / t.time)));
            var x = t.c + (0.4 * t.c) * Math.cos(radians);
            var y = t.y + t.b * Math.sin(-radians);
            gfx.drawTileToGrid(t.obj, x, y, "characters");
            if(t.frame > t.time) { continue; }
            t.frame += combat.dt;
        }
    },
    animateEntity: function (e, x, y, isPlayer) {
        var dt = (+new Date()) - e.lastRan;
        if(dt >= e.timePerFrame) {
            if(e.anim[e.animState][2]) {
                if(e.throwables.length > 0) {
                    e.lastRan = +new Date();
                    e.animState = 0;
                    e.lastThrownFrame = -1;
                } else if(e.lastThrownFrame < 0) {
                    if(!isPlayer) {
                        combat.playerAnimInfo.hit = true;
                    }
                }
            } else {
                e.lastRan = +new Date();
                e.animState = (e.animState + 1) % e.anim.length;
            }
        }
        var animData = e.anim[e.animState];
        if(isPlayer) {
            if(combat.playerAnimInfo.hit) {
                var dx = Math.random() > 0.5 ? 0.125 : (Math.random() > 0.5 ? -0.125 : 0);
                var dy = Math.random() > 0.5 ? -0.25 : (Math.random() > 0.5 ? -0.125 : 0);
                gfx.drawPlayer(0, 1, e.x + dx, e.y + dy);
            } else {
                gfx.drawPlayer(animData[0], animData[1], e.x, e.y, e.onTop ? "menucursorC" : "characters");
            }
        } else {
            gfx.drawCharacter(e.spriteidx, animData[1], x, y);
        }
        if(e.throwables.length > 0 && e.lastThrownFrame < e.animState && e.animState === 0) {
            e.lastThrownFrame = e.animState;
            var c = (4 + x + 0.5) / 2;
            var b = 2 + Math.random() * 1;
            combat.throwables.push({
                obj: e.throwables[0],
                frame: 0, time: 500, 
                b: b, c: c, y: y - 0.5, dir: -1,
                target: combat.playerAnimInfo
            });
            e.throwables.splice(0, 1);
        }
    },
    clearAnimsAndRemoveCorpses: function() {
        combat.playerAnimInfo.hit = false;
        for(var i = combat.enemies.length - 1; i >= 0; i--) {
            combat.enemies[i].hit = false;
            combat.enemies[i].animState = 0;
            combat.enemies[i].anim = null;
            if(combat.enemies[i].dead) {
                combat.enemies.splice(i, 1);
            }
        }
    },
    drawMainElements: function() {
        gfx.clearLayer("background");
        this.drawCharacters();
        this.enemydx = 10 + Math.floor((5 - this.enemywidth) / 2);
        this.enemydy = this.dy + Math.floor((player.gridHeight - this.enemyheight) / 2);
        for(var x = 0; x < this.enemywidth; x++) { // enemy field
            for(var y = 0; y < this.enemyheight; y++) {
                gfx.drawTileToGrid("tech", this.enemydx + x, y + this.enemydy, "background");
            }
        }
        var toDrawAfterwards = [];
        gfx.drawTileToGrid("edgeWA", this.dx - 1, this.dy - 1, "background");
        gfx.drawTileToGrid("edgeWD", this.dx + player.gridWidth, this.dy - 1, "background");
        gfx.drawTileToGrid("edgeSA", this.dx - 1, this.dy + player.gridHeight, "background");
        gfx.drawTileToGrid("edgeSD", this.dx + player.gridWidth, this.dy + player.gridHeight, "background");
        for(var y = 0; y < player.gridHeight; y++) {
            gfx.drawTileToGrid("edgeA", this.dx - 1, y + this.dy, "background");
            gfx.drawTileToGrid("edgeD", this.dx + player.gridWidth, y + this.dy, "background");
        }
        for(var x = 0; x < player.gridWidth; x++) { // player field
            gfx.drawTileToGrid("edgeW", x + this.dx, this.dy - 1, "background");
            gfx.drawTileToGrid("edgeS", x + this.dx, this.dy + player.gridHeight, "background");
            for(var y = 0; y < player.gridHeight; y++) {
                gfx.drawTileToGrid("dirt", x + this.dx, y + this.dy, "background");
                var item = player.itemGrid[x][y];
                if(item !== null && !item.coord) { 
                    var iteminfo = GetFarmInfo(item);
                    if(item === "_cow") {
                        if(this.getCowIndex(x, y) >= 0) {
                            toDrawAfterwards.push({ sprite: "cowready", x: (x + this.dx), y: (y + this.dy) });
                        } else {
                            toDrawAfterwards.push({ sprite: "cow", x: (x + this.dx), y: (y + this.dy) });
                        }
                    } else if(item === "_modulator") {
                        toDrawAfterwards.push({ sprite: "mod" + combat.season, x: (x + this.dx), y: (y + this.dy) });
                    } else if(iteminfo.displaySprite !== undefined) {
                        toDrawAfterwards.push({ sprite: iteminfo.displaySprite, x: (x + this.dx), y: (y + this.dy) });
                    } else if(item === "_lake") {
                        gfx.drawTileToGrid(pausemenu.farmmod.getWaterFrame(x, y), x + this.dx, y + this.dy, "background");
                    //} else if(item[0] === "_" && GetFarmInfo(item).size == 2) {
                    //    toDrawAfterwards.push({ sprite: "cow", x: (x + this.dx), y: (y + this.dy) });
                    } else if(item === "_shooter") {
                        if(this.getUsedShooterIndex(x, y) >= 0) {
                            gfx.drawTileToGrid("_shooterClosed", x + this.dx, y + this.dy, "background");
                        } else {
                            gfx.drawTileToGrid(item, x + this.dx, y + this.dy, "background");
                        }
                    } else {
                        gfx.drawTileToGrid(item, x + this.dx, y + this.dy, "background");
                    }
                 }
            }
        }
        for(var i = 0; i < toDrawAfterwards.length; i++) {
            var item = toDrawAfterwards[i];
            gfx.drawTileToGrid(item.sprite, item.x, item.y, "background");
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
            e.dead = true;
            e.deadFrame = 0;
            this.expEarned += e.exp;
            for(var i = 0; i < e.drops.length; i++) {
                var dropInfo = e.drops[i];
                if(dropInfo.money) {
                    this.moniesEarned += Range(dropInfo.min, dropInfo.max);
                } else {
                    this.addDroppedSeedToItemsEarned(dropInfo.seed, Math.max(0, Range(dropInfo.min, dropInfo.max)));
                }
            }
        } else {
            this.enemies[enemyidx].hit = true;
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
            this.drawMainElements();
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
        player.health = player.maxhealth;
        game.transition(game.currentInputHandler, worldmap, {  init: { x: inn.x,  y: inn.y }, map: inn.map });
    },
    endTurn: function(caller) {
        this.drawMainElements();
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
    drawBottom: function() {
        for(var x = 0; x < gfx.tileWidth; x++) {
             gfx.drawSprite("sheet", 15, 11, x * 16, 9.25 * 16, "menuA");
        }
        gfx.drawText("HP:" + player.health + "/" + player.maxhealth, 4, 9.9 * 16);
        var season = "";
        switch(this.season) {
            case 0: season = "Spring"; break;
            case 1: season = "Summer"; break;
            case 2: season = "Autumn"; break;
            case 3: season = "Winter"; break;
        }
        gfx.drawSprite("sheet", 12 + this.season, 10, 12 * 16 - 3, 9 * 16 + 1, "menuA");
        gfx.drawText(season, 13 * 16 - 1, 9.9 * 16);
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
        this.drawCrops();
    },
    removeFreshCrops: function(isCritical) {
        for(var x = 0; x < this.grid.length; x++) {
            for(var y = 0; y < this.grid[0].length; y++) {
                if(this.grid[x][y] === null || this.grid[x][y].name === undefined) { continue; }
                var crop = this.grid[x][y];
                if(crop.rotten || crop.activeTime > 0) { continue; }
                var seedChance = Math.random() * player.luck * (isCritical ? 0.5 : 1);
                if(crop.respawn > 0) {
                    crop.activeTime = crop.respawn;
                    seedChance *= 1.5;
                } else {
                    this.grid[x][y] = null;
                }
                if(crop.name.indexOf("special") === 0) { seedChance = 1; }
                if(seedChance < 0.05) {
                    console.log("Got a " + crop.name + " seed!");
                    player.increaseItem(crop.name);
                }
            }
        }
        this.drawCrops();
    },
    removeFreshEnemyCrops: function() {
        for(var x = 0; x < this.enemyGrid.length; x++) {
            for(var y = 0; y < this.enemyGrid[0].length; y++) {
                if(this.enemyGrid[x][y] === null || this.enemyGrid[x][y].name === undefined) { continue; }
                var crop = this.enemyGrid[x][y];
                if(crop.rotten || crop.activeTime > 0) { continue; }
                if(crop.respawn > 0) {
                    crop.activeTime = crop.respawn;
                } else {
                    this.enemyGrid[x][y] = null;
                }
            }
        }
        this.drawCrops();
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
    },
    drawCrops: function() {
        gfx.clearLayer("foreground");
        for(var x = 0; x < this.grid.length; x++) { // player grid
            for(var y = 0; y < this.grid[0].length; y++) {
                if(this.grid[x][y] === null || this.grid[x][y].name === undefined) { continue; }
                var crop = this.grid[x][y];
                var newFrame = Math.floor((crop.frames - 1) * ((crop.time - crop.activeTime) / crop.time));
                if(crop.size == 2) {
                    if(newFrame < 3) {
                        gfx.drawTileToGrid("tree" + newFrame, x + this.dx, y + this.dy, "foreground");
                    } else {
                        gfx.drawTileToGrid("tree2", x + this.dx, y + this.dy, "foreground");
                        newFrame -= 3;
                        gfx.drawTileToGrid(crop.name + newFrame, x + this.dx, y + this.dy, "foreground");
                    }
                    gfx.drawItemNumber(crop.rotten ? "x" : Math.ceil(crop.activeTime), x + this.dx + 1, y + this.dy, "foreground", true);
                } else if(crop.type === "water") {
                    if(crop.name === "net") {
                        if(crop.rotten) {
                            gfx.drawTileToGrid(crop.name + "0", x + this.dx, y + this.dy, "foreground");
                        } else {
                            gfx.drawTileToGrid(crop.name + "1", x + this.dx, y + this.dy, "foreground");
                            gfx.drawItemNumber(0, x + this.dx, y + this.dy, "foreground", true);
                        }
                    }
                } else if(crop.type === "rod") {
                    if(crop.fishNum === undefined) {
                        gfx.drawTileToGrid(crop.name + "0", x + this.dx, y + this.dy, "foreground");
                    } else {
                        gfx.drawTileToGrid("fish" + crop.fishNum, x + this.dx, y + this.dy, "foreground");
                    }
                    gfx.drawItemNumber(crop.rotten ? "x" : Math.ceil(crop.activeTime), x + this.dx, y + this.dy, "foreground", true);
                } else {
                    gfx.drawTileToGrid(crop.rotten ? "weed" : (crop.name + newFrame), x + this.dx, y + this.dy, "foreground");
                    gfx.drawItemNumber(crop.rotten ? "x" : Math.ceil(crop.activeTime), x + this.dx, y + this.dy, "foreground", true);
                }
            }
        }
        for(var x = 0; x < this.enemyGrid.length; x++) { // enemy grid
            for(var y = 0; y < this.enemyGrid[0].length; y++) {
                if(this.enemyGrid[x][y] === null || this.enemyGrid[x][y].name === undefined) { continue; }
                var crop = this.enemyGrid[x][y];
                var newFrame = Math.floor((crop.frames - 1) * ((crop.time - crop.activeTime) / crop.time));
                if(crop.size == 2) {
                    if(newFrame < 3) {
                        gfx.drawTileToGrid("tree" + newFrame, this.enemydx + x, y + this.enemydy, "foreground");
                    } else {
                        gfx.drawTileToGrid("tree2", this.enemydx + x, y + this.enemydy, "foreground");
                        newFrame -= 3;
                        gfx.drawTileToGrid(crop.name + newFrame, this.enemydx + x, y + this.enemydy, "foreground");
                    }
                    gfx.drawItemNumber(crop.rotten ? "x" : Math.ceil(crop.activeTime), this.enemydx + x, y + this.enemydy, "foreground", true);
                } else {
                    gfx.drawTileToGrid(crop.name + newFrame, this.enemydx + x, y + this.enemydy, "foreground");
                    gfx.drawItemNumber(crop.rotten ? "x" : Math.ceil(crop.activeTime), this.enemydx + x, y + this.enemydy, "foreground", true);
                }
            }
        }
    }
};
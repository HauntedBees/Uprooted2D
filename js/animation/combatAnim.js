function EntityAnimInfo(ani, x, y, fr) {
    this.animState = 0;
    this.animArray = ani || [[0, 0]];
    this.x = x || 4;
    this.y = y || 5.75;
    this.initX = this.x;
    this.initY = this.y;
    this.throwables = [];
    this.timePerFrame = fr || anim.timePerFrame;
    this.lastRan = +new Date();
    this.lastThrownFrame = -1;
    this.hit = false;
}
EntityAnimInfo.prototype.Animate = function() { };
EntityAnimInfo.prototype.Reset = function() {
    this.throwables = [];
    this.hit = false;
    this.animState = 0;
};

function EnemyAnimInfo(ani, x, y, fr, size, spriteidx, sheet) {
    EntityAnimInfo.call(this, ani, x, y, fr);
    this.spriteidx = spriteidx;
    this.sheet = sheet;
    this.size = size;
}
EnemyAnimInfo.prototype = Object.create(EntityAnimInfo.prototype);
EnemyAnimInfo.prototype.constructor = EnemyAnimInfo;
EnemyAnimInfo.prototype.Reset = function() {
    EntityAnimInfo.prototype.Reset.call(this);
    this.animArray = [[this.spriteidx, 0]];
};
EnemyAnimInfo.prototype.InnerAnimate = function() {
    var dt = (+new Date()) - this.lastRan;
    if(dt >= this.timePerFrame) {
        if(this.animArray[this.animState][2]) {
            if(this.throwables.length > 0) {
                this.lastRan = +new Date();
                this.animState = 0;
                this.lastThrownFrame = -1;
            } else if(this.lastThrownFrame < 0) {
                combat.animHelper.GivePlayerAHit();
                this.lastThrownFrame = 0;
            }
        } else {
            this.lastRan = +new Date();
            this.animState = (this.animState + 1) % this.animArray.length;
        }
    }
    var animData = this.animArray[this.animState];
    gfx.drawCharacter(this.spriteidx, animData[1], this.sheet, this.size, this.x, this.y);
    if(this.throwables.length > 0 && this.lastThrownFrame < this.animState && this.animState === 0) {
        var b = 2 + Math.random() * 1, c = (4 + this.x + 0.5) / 2;
        var gx = this.throwables[0][1], gy = this.throwables[0][2];
        var isTree = combat.purgeFlaggedCrop(combat.enemyGrid, gx, gy);
        if(isTree) { gx += 0.5; gy += 0.5; }
        combat.animHelper.AddAnim(new SheetAnim(combat.enemydx + gx, combat.enemydy + gy, 250, "puff", 5));
        combat.animHelper.AddAnim(new EnemyThrowAnim(this.y - 0.5, 500, this.throwables[0][0], b, c, combat.playerAnimInfo));
        this.lastThrownFrame = this.animState;
        this.throwables.splice(0, 1);
    }
};
EnemyAnimInfo.prototype.Animate = function() {
    if(this.dead) {
        gfx.drawDitheredCharacter(this.spriteidx, 1, this.sheet, this.size, this.x, this.y, (this.deadFrame++));
    } else if(this.hit) {
        var dx = Math.random() > 0.5 ? 0.125 : (Math.random() > 0.5 ? -0.125 : 0);
        var dy = Math.random() > 0.5 ? -0.25 : (Math.random() > 0.5 ? -0.125 : 0);
        gfx.drawCharacter(this.spriteidx, 1, this.sheet, this.size, this.x + dx, this.y + dy);
    } else {
        this.InnerAnimate();
    }
};

function PlayerAnimInfo(ani, x, y, fr, top) {
    EntityAnimInfo.call(this, ani, x, y, fr);
    this.onTop = top;
}
PlayerAnimInfo.prototype = Object.create(EntityAnimInfo.prototype);
PlayerAnimInfo.prototype.constructor = PlayerAnimInfo;
PlayerAnimInfo.prototype.Animate = function() {
    var dt = (+new Date()) - this.lastRan;
    if(dt >= this.timePerFrame) {
        if(this.animArray[this.animState][2]) {
            if(this.throwables.length > 0) {
                this.lastRan = +new Date();
                this.animState = 0;
                this.lastThrownFrame = -1;
            } else if(this.lastThrownFrame < 0 && !this.isRun) {
                if(combat.lastTargetCrop) {
                    // TODO: targeting crops
                } else if(Array.isArray(combat.lastTarget)) {
                    for(var q = 0; q < combat.lastTarget.length; q++) {
                        combat.animHelper.DisplayEnemyDamage(combat.lastTarget[q]);
                    }
                } else {
                    combat.animHelper.DisplayEnemyDamage(combat.lastTarget);
                }
                this.lastThrownFrame = 0;
            }
        } else {
            this.lastRan = +new Date();
            this.animState = (this.animState + 1) % this.animArray.length;
        }
    } else if(this.isRun && !this.animArray[this.animState][2]) {
        this.x -= 0.1;
    }
    var animData = this.animArray[this.animState];
    if(this.hit) {
        var dx = Math.random() > 0.5 ? 0.125 : (Math.random() > 0.5 ? -0.125 : 0);
        var dy = Math.random() > 0.5 ? -0.25 : (Math.random() > 0.5 ? -0.125 : 0);
        gfx.drawPlayer(0, (player.health <= 0) ? 2 : 1, this.x + dx, this.y + dy);
    } else if(animData[3] !== undefined) {
        gfx.drawWidePlayer(animData[0], animData[1], this.x, this.y, this.onTop ? "menucursorC" : "characters");
    } else {
        gfx.drawPlayer(animData[0], animData[1], this.x, this.y, this.onTop ? "menucursorC" : "characters");
    }
    if(this.throwables.length > 0 && this.lastThrownFrame < this.animState && this.animState === 0) {
        var b = 2 + Math.random();
        var initx = 11 - combat.enemies.length;
        var customtarget = this.throwables[0].customtarget !== undefined;
        var targetidx = (this.throwables[0].customtarget === undefined ? combat.lastTarget: this.throwables[0].customtarget);
        var realtarget = targetidx;
        if(Array.isArray(targetidx)) {
            realtarget = targetidx;
            targetidx = targetidx[0];
        }
        var c = (initx + targetidx + this.x - 0.5) / 2;
        var gx = this.throwables[0].x, gy = this.throwables[0].y;
        if(gx >= 0) {
            var seedDrop = combat.grid[gx][gy].seedDrop;
            if(seedDrop !== undefined) {
                combat.animHelper.AddAnim(new MoveAnim(combat.dx + gx, combat.dy + gy, this.x, this.y, 250, seedDrop));
            }
            var isTree = combat.purgeFlaggedCrop(combat.grid, gx, gy);
            if(isTree) { gx += 0.5; gy += 0.5; }
            combat.animHelper.AddAnim(new SheetAnim(combat.dx + gx, combat.dy + gy, 250, "puff", 5));
        }
        var throwAnim = new PlayerThrowAnim(this.y - 0.5, 500, this.throwables[0].name, b, c, realtarget, customtarget || this.throwables.length === 1, this.throwables[0].stickChance);
        throwAnim.additionalFinishes = [];
        if(this.throwables[0].animal !== undefined) {
            var sprite = "animal" + this.throwables[0].animal;
            var yPos = this.y;
            throwAnim.additionalFinishes.push(function() {
                var numAnimals = Range(2, 10);
                while(numAnimals-- > 0) {
                    var yP = yPos - 2 + 2 * Math.random();
                    combat.animHelper.AddAnim(new MoveAnim(-1, yP, 16, yP, 1000, sprite));
                }
            });
        }
        if(this.throwables[0].bonusTarget !== undefined) {
            var sprite2 = this.throwables[0].name;
            var b2 = 0.5 + Math.random();
            var secondX = this.throwables[0].bonusTarget;
            var c2 = (Math.min(secondX, targetidx) + targetidx + secondX) / 2;
            var y2 = this.y - 0.5;
            var dir2 = (secondX > targetidx) ? 1 : - 1;
            throwAnim.additionalFinishes.push(function() {
                var secanim = new PlayerThrowAnim(y2, 500, sprite2, b2, c2, secondX, true, false);
                secanim.dir = dir2;
                secanim.xmult = initx + 1;
                combat.animHelper.AddAnim(secanim);
            });
        }
        combat.animHelper.AddAnim(throwAnim);
        this.lastThrownFrame = this.animState;
        this.throwables.splice(0, 1);
    }
};

function CombatAnimHelper(enemies) {
    var playerAnimInfo = new PlayerAnimInfo();
    var enemyAnimInfos = [];
    var currentx = 11 - enemies.length;
    for(var i = 0; i < enemies.length; i++) {
        var e = enemies[i];
        var y = e.size == "lg" ? 5 : 5.75;
        enemyAnimInfos.push(new EnemyAnimInfo([[e.spriteidx, 0]], currentx, y, 0, e.size, e.spriteidx, e.sheet));
        switch(e.size) {
            case "sm": currentx += 1; break;
            case "md": currentx += 1.5; break;
            case "lg": currentx += 2; break;
        }
    }
    var anims = [];

    this.GetCursorInfo = function(x) {
        var currentx = 11 - combat.enemies.length;
        for(var i = 0; i < combat.enemies.length; i++) {
            if(x === i) {
                var info = combat.enemies[i].cursorinfo;
                var size = combat.enemies[i].size;
                var y = 0, posy = 5.75;
                switch(size) {
                    case "sm": y = 5.25; break;
                    case "md": y = 5.0; break;
                    case "lg": y = 4.5; posy = 5; break;
                }
                return { x: currentx + info.dx, rawX: currentx, y: y + info.dy, rawY: posy, w: info.w, h: info.h };
            }
            switch(combat.enemies[i].size) {
                case "sm": currentx += 1; break;
                case "md": currentx += 1.5; break;
                case "lg": currentx += 2; break;
            }
        }
    };

    this.DrawBottom = function() {
        for(var x = 0; x < gfx.tileWidth; x++) { gfx.drawSprite("sheet", 15, 11, x * 16, 9.25 * 16, "menuA"); }
        gfx.drawText("HP:" + player.health + "/" + player.maxhealth, 4, 9.9 * 16);
        var season = "";
        switch(combat.season) {
            case 0: season = "Spring"; break;
            case 1: season = "Summer"; break;
            case 2: season = "Autumn"; break;
            case 3: season = "Winter"; break;
        }
        gfx.drawSprite("sheet", 12 + combat.season, 10, 12 * 16 - 3, 9 * 16 + 1, "menuA");
        gfx.drawText(season, 13 * 16 - 1, 9.9 * 16);
    };

    this.GetPlayerPos = function() { return { x: playerAnimInfo.x, y: playerAnimInfo.y }; };

    this.SetPlayerAnimInfo = function(anims, x, y, top, fr) { playerAnimInfo = new PlayerAnimInfo(anims, x, y, fr, top); };
    this.SetUpPlayerForRun = function() { playerAnimInfo.isRun = true; }
    this.SetEnemyAnimInfo = function(idx, anims, fr, throwables) {
        var e = combat.enemies[idx];
        var pos = this.GetCursorInfo(idx);
        enemyAnimInfos[idx] = new EnemyAnimInfo(anims, pos.rawX, pos.rawY, fr, e.size, e.spriteidx, e.sheet);
        enemyAnimInfos[idx].throwables = throwables || [];
        this.Animate();
    };

    this.GetEnemyPos = function(idx) { return { x: enemyAnimInfos[idx].x, y: enemyAnimInfos[idx].y } };

    this.GivePlayerAHit = function() { playerAnimInfo.hit = true; };
    this.GiveEnemyAHit = function(idx) { enemyAnimInfos[idx].hit = true; };
    this.MakeEnemyACorpse = function(idx) {
        var e = enemyAnimInfos[idx];
        e.dead = true;
        e.deadFrame = 0;
    };
    this.DisplayEnemyDamage = function(idx) {
        if(idx.x !== undefined) { return; }
        if(idx >= combat.enemies.length) { return; }
        if(combat.enemies[idx].health <= 0) {
            this.MakeEnemyACorpse(idx);
        } else {
            this.GiveEnemyAHit(idx);
        }
    };

    this.AddPlayerThrowable = function(t) { playerAnimInfo.throwables.push(t); };
    var AnimateEntities = function() {
        playerAnimInfo.Animate();
        for(var i = 0; i < enemyAnimInfos.length; i++) { enemyAnimInfos[i].Animate(); }
        for(var i = 0; i < combat.enemies.length; i++) {
            if(combat.enemies[i].stickTurns > 0 && !combat.enemies[i].justStuck) {
                if(combat.enemies[i].size === "lg") {
                    gfx.drawTileToGrid("hgoop", enemyAnimInfos[i].x + 0.5, enemyAnimInfos[i].y + 1, "characters");
                } else {
                    gfx.drawTileToGrid("hgoop", enemyAnimInfos[i].x + combat.enemies[i].cursorinfo.dx, enemyAnimInfos[i].y, "characters");
                }
            }
        }
    };
    var AnimateParticles = function() {
        for(var i = anims.length - 1; i >= 0; i--) {
            var t = anims[i];
            if(t.current >= t.time) {
                t.finish();
                anims.splice(i, 1);
            } else {
                t.getFrame(timers.CHARANIM);
            }
        }
    };
    this.CleanEntities = function() {
        playerAnimInfo.Reset();
        for(var i = 0; i < enemyAnimInfos.length; i++) { enemyAnimInfos[i].Reset(); }
    };
    this.RemoveEnemy = function(idx) { enemyAnimInfos.splice(idx, 1); };

    this.AddAnim = function(a) { anims.push(a); };
    this.CleanAnims = function() { anims = []; };
    this.Animate = function() {
        gfx.clearSome(["characters", "menucursorC"]);
        AnimateEntities();
        AnimateParticles();
    };
    var DrawCropGrid = function(grid, dx, dy, drawWeed) {
        for(var x = 0; x < grid.length; x++) {
            var xdx = x + dx;
            for(var y = 0; y < grid[0].length; y++) {
                if(grid[x][y] === null || grid[x][y].name === undefined || grid[x][y].hidden) { continue; }
                var crop = grid[x][y];
                var ydy = y + dy;
                var newFrame = Math.floor((crop.frames - 1) * ((crop.time - crop.activeTime) / crop.time));
                if(crop.size == 2) {
                    var drawItemNum = true;
                    if(crop.name === "bignet") {
                        if(crop.rotten) {
                            gfx.drawTileToGrid(crop.name + "0", xdx, ydy, "foreground");
                        } else {
                            gfx.drawTileToGrid(crop.name + "1", xdx, ydy, "foreground");
                            gfx.drawItemNumber(0, xdx + 1, ydy, "foreground", true);
                        }
                        drawItemNum = false;
                    } else if(crop.type !== "tree") {
                        gfx.drawTileToGrid(crop.name + newFrame, xdx, ydy, "foreground");
                    } else if(newFrame < 3) {
                        gfx.drawTileToGrid("tree" + newFrame, xdx, ydy, "foreground");
                    } else {
                        gfx.drawTileToGrid("tree2", xdx, ydy, "foreground");
                        newFrame -= 3;
                        gfx.drawTileToGrid(crop.name + newFrame, xdx, ydy, "foreground");
                    }
                    if(drawItemNum) { gfx.drawItemNumber(crop.rotten ? "x" : Math.ceil(crop.activeTime), xdx + 1, ydy, "foreground", true); }
                } else if(crop.type === "water") {
                    if(crop.name === "net") {
                        if(crop.rotten) {
                            gfx.drawTileToGrid(crop.name + "0", xdx, ydy, "foreground");
                        } else {
                            gfx.drawTileToGrid(crop.name + "1", xdx, ydy, "foreground");
                            gfx.drawItemNumber(0, xdx, ydy, "foreground", true);
                        }
                    }
                } else if(crop.type === "bee") {
                    gfx.drawTileToGrid(crop.name + newFrame, xdx, ydy, "foreground");
                } else if(crop.type === "rod") {
                    gfx.drawTileToGrid(crop.fishNum === undefined ? (crop.name + "0") : ("fish" + crop.fishNum), xdx, ydy, "foreground");
                    gfx.drawItemNumber(crop.rotten ? "x" : Math.ceil(crop.activeTime), xdx, ydy, "foreground", true);
                } else {
                    gfx.drawTileToGrid((crop.rotten && drawWeed) ? "weed" : (crop.name + newFrame), xdx, ydy, "foreground");
                    gfx.drawItemNumber(crop.rotten ? "x" : Math.ceil(crop.activeTime), xdx, ydy, "foreground", true);
                }
            }
        }
    };
    this.DrawCrops = function() {
        gfx.clearLayer("foreground");
        DrawCropGrid(combat.grid, combat.dx, combat.dy, true);
        DrawCropGrid(combat.enemyGrid, combat.enemydx, combat.enemydy);
    };
    this.DrawBackground = function() {
        gfx.clearLayer("background");
        for(var x = 0; x < combat.enemywidth; x++) { // enemy field
            for(var y = 0; y < combat.enemyheight; y++) {
                gfx.drawTileToGrid(combat.enemyTile, combat.enemydx + x, y + combat.enemydy, "background");
            }
        }
        var toDrawAfterwards = [];
        gfx.drawTileToGrid("edgeWA", combat.dx - 1, combat.dy - 1, "background");
        gfx.drawTileToGrid("edgeWD", combat.dx + player.gridWidth, combat.dy - 1, "background");
        gfx.drawTileToGrid("edgeSA", combat.dx - 1, combat.dy + player.gridHeight, "background");
        gfx.drawTileToGrid("edgeSD", combat.dx + player.gridWidth, combat.dy + player.gridHeight, "background");
        for(var y = 0; y < player.gridHeight; y++) {
            gfx.drawTileToGrid("edgeA", combat.dx - 1, y + combat.dy, "background");
            gfx.drawTileToGrid("edgeD", combat.dx + player.gridWidth, y + combat.dy, "background");
        }
        for(var x = 0; x < player.gridWidth; x++) { // player field
            gfx.drawTileToGrid("edgeW", x + combat.dx, combat.dy - 1, "background");
            gfx.drawTileToGrid("edgeS", x + combat.dx, combat.dy + player.gridHeight, "background");
            for(var y = 0; y < player.gridHeight; y++) {
                gfx.drawTileToGrid("dirt", x + combat.dx, y + combat.dy, "background");
                var item = player.itemGrid[x][y];
                var effect = combat.effectGrid[x][y];
                if(item !== null && !item.coord) { 
                    var iteminfo = GetFarmInfo(item);
                    if(item === "_cow") {
                        if(combat.getCowIndex(x, y) >= 0) {
                            toDrawAfterwards.push({ sprite: "cowready", x: (x + combat.dx), y: (y + combat.dy) });
                        } else {
                            toDrawAfterwards.push({ sprite: "cow", x: (x + combat.dx), y: (y + combat.dy) });
                        }
                    } else if(item === "_charger") {
                        toDrawAfterwards.push({ sprite: "chargerplaced", x: (x + combat.dx), y: (y + combat.dy) });
                    } else if(item === "_modulator") {
                        toDrawAfterwards.push({ sprite: "mod" + combat.season, x: (x + combat.dx), y: (y + combat.dy) });
                    } else if(iteminfo.displaySprite !== undefined) {
                        toDrawAfterwards.push({ sprite: iteminfo.displaySprite, x: (x + combat.dx), y: (y + combat.dy) });
                    } else if(item === "_lake") {
                        gfx.drawTileToGrid(pausemenu.farmmod.getWaterFrame(x, y), x + combat.dx, y + combat.dy, "background");
                    } else if(item === "_shooter") {
                        if(combat.getUsedShooterIndex(x, y) >= 0) {
                            gfx.drawTileToGrid("_shooterClosed", x + combat.dx, y + combat.dy, "background");
                        } else {
                            gfx.drawTileToGrid(item, x + combat.dx, y + combat.dy, "background");
                        }
                    } else {
                        if(["_log", "_coop", "_beehive"].indexOf(item) >= 0 && (effect !== null && effect.type === "burned")) {
                            effect = null;
                            gfx.drawTileToGrid(item + "Burned", x + combat.dx, y + combat.dy, "background");
                        } else {
                            gfx.drawTileToGrid(item, x + combat.dx, y + combat.dy, "background");
                        }
                    }
                }
                if(effect !== null) {
                    toDrawAfterwards.push({ sprite: effect.type, x: (x + combat.dx), y: (y + combat.dy) });
                }
            }
        }
        for(var i = 0; i < toDrawAfterwards.length; i++) {
            var item = toDrawAfterwards[i];
            gfx.drawTileToGrid(item.sprite, item.x, item.y, "background");
        }
    };
}
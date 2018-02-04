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

function FalconAnimInfo(ani, x, y, fr, top) {
    EntityAnimInfo.call(this, ani, x || 3.5, y || 5, fr);
    this.onTop = top;
}
FalconAnimInfo.prototype = Object.create(EntityAnimInfo.prototype);
FalconAnimInfo.prototype.constructor = FalconAnimInfo;
FalconAnimInfo.prototype.Animate = function() {
    var dt = (+new Date()) - this.lastRan;
    if(dt >= this.timePerFrame) {
        if(this.animArray[this.animState][2]) {
            if(this.lastThrownFrame < 0 && !this.isRun) {
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
    gfx.drawFalcon(animData[0], animData[1], this.x - 1, this.y, this.onTop ? "menucursorC" : "characters");
};

function CombatAnimHelper(enemies) {
    var playerPos = { x: 3, y: 9.25 };

    var playerAnimInfo = new CombatAnimPlayer(playerPos.x, playerPos.y);
    var enemyAnimInfos = [];
    var birdAnimInfo = (player.hasFalcon ? new FalconAnimInfo() : null);
    var currentx = 11 - enemies.length;
    var anims = [];

    this.ResetEnemyAnimHelper = function(enemies) {
        enemyAnimInfos = [];
        var currentx = 11 - enemies.length;
        for(var i = 0; i < enemies.length; i++) {
            var e = enemies[i];
            if(e.size === "xl") { currentx -= 4; } // TODO: this shit
            enemyAnimInfos.push(GetEnemyCombatAnim(currentx, playerPos.y, e.spriteidx, e.size));
            switch(e.size) {
                case "sm": currentx += 1; break;
                case "md": currentx += 1.5; break;
                case "lg": currentx += 2; break;
                case "xl": currentx += 4; break;
            }
        }
    }
    this.ResetEnemyAnimHelper(enemies);


    this.GetCursorInfo = function(x) {
        var currentx = 11 - combat.enemies.length;
        for(var i = 0; i < combat.enemies.length; i++) {
            if(x === i) {
                var info = combat.enemies[i].cursorinfo;
                var size = combat.enemies[i].size;
                var y = playerPos.y;
                var rawy = y - GetEnemyCombatDims(combat.enemies[i].size).h;
                if(combat.enemies[i].size === "xl") { currentx -= 4; }
                return { x: currentx + info.dx, rawX: currentx, y: y + info.dy, rawY: rawy, w: info.w, h: info.h };
            }
            switch(combat.enemies[i].size) {
                case "sm": currentx += 1; break;
                case "md": currentx += 1.5; break;
                case "lg": currentx += 2; break;
                case "xl": currentx += 4; break;
            }
        }
    };

    this.DrawBottom = function() {
        var y = game.tileh - 0.75;
        var texty = y + 0.65;
        for(var x = 0; x < gfx.tileWidth; x++) { gfx.drawSprite("sheet", 15, 11, x * 16, y * 16, "menuA"); }
        gfx.drawText("HP:" + player.health + "/" + player.maxhealth, 4, texty * 16);
        var season = GetText("season" + combat.season);
        gfx.drawSprite("sheet", 12 + combat.season, 10, 13 * 16 - 3, (y - 0.25) * 16 + 1, "menuA");
        gfx.drawText(season, 14 * 16 - 1, texty * 16);
    };


    this.SetEnemyAnimState = function(idx, name) { enemyAnimInfos[idx].SetAnim(name); }
    this.MakeEnemyACorpse = function(idx) { // TODO
        var e = enemyAnimInfos[idx];
        e.dead = true;
        e.deadFrame = 0;
    };


    this.AddPlayerAttackAnim = function(caa) { playerAnimInfo.animQueue.push(caa); };
    this.StartPlayerAnimSequence = function() { playerAnimInfo.StartAnimQueue(); };
    
    this.GetPlayerTopPos = function() { return { x: playerPos.x, y: playerPos.y - 1 }; };
    this.PushPlayerOverlay = function(name) { playerAnimInfo.PushOverlayAnim(weaponAnims[name]); };
    this.SetPlayerAnimArg = function(key, val) { playerAnimInfo.PushArg(key, val); };
    this.SetPlayerAnimState = function(name, resetPos) { playerAnimInfo.SetAnim(name); if(resetPos) { this.ResetPlayerAnimPos(); } };
    this.SetPlayerAnimLayer = function(layer) { playerAnimInfo.layer = layer; }
    this.ResetPlayerAnimState = function() {
        if(player.health < (player.maxhealth / 4)) { playerAnimInfo.SetAnim("STAND_WEAK"); }
        else { playerAnimInfo.SetAnim("STAND"); }
        playerAnimInfo.layer = "characters";
        playerAnimInfo.ClearAnimQueue();
        this.ResetPlayerAnimPos();
    };
    this.ResetPlayerAnimPos = function() { this.SetPlayerAnimPos(playerPos.x, playerPos.y); };
    this.SetPlayerAnimPos = function(x, y) { playerAnimInfo.dims.x = x; playerAnimInfo.dims.y = y; };
    this.GivePlayerAHit = function() {
        // TODO: account for crop attacks
        if(player.health <= 0) {
            this.SetPlayerAnimState("FATALBLOW");
        } else {
            this.SetPlayerAnimState("HURT");
        }
    };

    this.AddEnemyAttackAnim = function(idx, caa) { enemyAnimInfos[idx].animQueue.push(caa); }
    this.StartEnemyAnimSequence = function(idx) { enemyAnimInfos[idx].StartAnimQueue(); };
    this.GetEnemyTopPos = function(idx) {
        var edims = enemyAnimInfos[idx].dims;
        return { x: edims.x + (edims.w / 16) / 2, y: edims.y - (edims.h / 16) };
    };

    this.SetBirdAnimInfo = function(anims, x, y, top, fr) { if(birdAnimInfo === null) { return; } birdAnimInfo = new FalconAnimInfo(anims, x, y, fr, top); };
    this.GetEnemyPos = function(idx) { return { x: enemyAnimInfos[idx].x, y: enemyAnimInfos[idx].y } };

    this.DEBUG_DrawEnemy = function(idx) { enemyAnimInfos[idx].Animate(idx); };

    var AnimateEntities = function() {
        if(birdAnimInfo !== null) { birdAnimInfo.Animate(); }
        playerAnimInfo.Animate();
        for(var i = 0; i < enemyAnimInfos.length; i++) { enemyAnimInfos[i].Animate(i); }
        for(var i = 0; i < combat.enemies.length; i++) { // TODO: probably shouldn't be this
            if(combat.enemies[i].stickTurns > 0 && !combat.enemies[i].justStuck) {
                if(combat.enemies[i].size === "lg" || combat.enemies[i].size === "xl") {
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
        this.ResetPlayerAnimState();
        for(var i = 0; i < enemyAnimInfos.length; i++) { enemyAnimInfos[i].SetAnim("STAND"); }
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
                        gfx.drawTileToGrid((crop.treeSprite || "tree") + newFrame, xdx, ydy, "foreground");
                    } else {
                        gfx.drawTileToGrid((crop.treeSprite || "tree") + "2", xdx, ydy, "foreground");
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
                } else if(crop.type === "card") {
                    gfx.drawTileToGrid((crop.inDefensePosition ? "def" : "") + crop.name, xdx, ydy, "foreground");
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

    this.GetActualTile = function(tile, x, y) {
        var rightmost = combat.enemywidth - 1;
        var bottommost = combat.enemyheight - 1;
        switch(tile) {
            case "nathan":
                if(y === 0) {
                    if(x < 3) { return "_coop"; }
                    else { return "_log"; }
                } else if(y === 1) {
                    switch(x) {
                        case 0: return "lakeD";
                        case 1: return "lakeAD";
                        case 2: return "lakeA";
                        default: return "_log";
                    }
                } else if(y >= 2 && y <= 4 && x === 4) {
                    return "_beehive";
                } else if(y === 6) { return "_paddy"; }
                return "dirt";
            case "beckett":
                if(y < 3) {
                    if(x === 0) { return "conveyorL"; }
                    else if(x === rightmost) { return "conveyorR"; }
                    else { return "conveyorM"; }    
                } else {
                    var rightCorner = (x === rightmost);
                    var bottomCorner = (y === bottommost);
                    if(rightCorner && bottomCorner) { return "chargingBayLR"; }
                    else if(rightCorner && y === (bottommost - 1)) { return "chargingBayUR"; }
                    else if(bottomCorner && x === (rightmost - 1)) { return "chargingBayLL"; }
                    else if(x === (rightmost - 1) && y === (bottommost - 1)) { return "chargingBayUL"; }
                    else { return "tech"; }
                }
            case "conveyor":
                if(y === 0) { return "tech"; }
                if(x === 0) { return "conveyorL"; }
                else if(x === rightmost) { return "conveyorR"; }
                else { return "conveyorM"; }    
        }
        return tile;
    };

    this.DrawWrapper = function(x, y, w, h, name) {
        name = name || "edge";
        gfx.drawTileToGrid(name + "WA", x - 1, y - 1, "background");
        gfx.drawTileToGrid(name + "WD", x + w, y - 1, "background");
        gfx.drawTileToGrid(name + "SA", x - 1, y + h, "background");
        gfx.drawTileToGrid(name + "SD", x + w, y + h, "background");
        for(var yy = 0; yy < h; yy++) {
            gfx.drawTileToGrid(name + "A", x - 1, y + yy, "background");
            gfx.drawTileToGrid(name + "D", x + w, y + yy, "background");
        }
        for(var xx = 0; xx < w; xx++) {
            gfx.drawTileToGrid(name + "W", x + xx, y - 1, "background");
            gfx.drawTileToGrid(name + "S", x + xx, y + h, "background");
        }
    };

    this.DrawBackground = function() {
        gfx.clearLayer("background");

        gfx.drawFullImage("bgs/outside");
        var top = Math.min(combat.enemydy, combat.dy);
        var bottom = Math.max(combat.enemydy + combat.enemyheight, combat.dy + player.gridHeight);
        for(var x = 0; x < game.tilew; x++) {
            gfx.drawTileToGrid("grassTop", x, top - 1, "background");
            gfx.drawTileToGrid("grassBottom", x, bottom, "background");
            for(var y = top; y < bottom; y++) {
                gfx.drawTileToGrid("grass", x, y, "background");
            }
        }
        
        if(combat.enemyTile === "dirt" || combat.enemyTile === "nathan") { this.DrawWrapper(combat.enemydx, combat.enemydy, combat.enemywidth, combat.enemyheight); }
        for(var x = 0; x < combat.enemywidth; x++) { // enemy field
            for(var y = 0; y < combat.enemyheight; y++) {
                if(combat.enemyTile === "nathan") { gfx.drawTileToGrid("dirt", combat.enemydx + x, y + combat.enemydy, "background"); }
                gfx.drawTileToGrid(this.GetActualTile(combat.enemyTile, x, y), combat.enemydx + x, y + combat.enemydy, "background");
            }
        }
        var toDrawAfterwards = [];
        this.DrawWrapper(combat.dx, combat.dy, player.gridWidth, player.gridHeight);
        for(var x = 0; x < player.gridWidth; x++) { // player field
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
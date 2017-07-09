function EntityAnimInfo(ani, x, y, fr) {
    this.animState = 0;
    this.animArray = ani || [[0, 0]];
    this.x = x || 4;
    this.y = y || 5.75;
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

function EnemyAnimInfo(ani, x, y, fr, big, spriteidx) {
    EntityAnimInfo.call(this, ani, x, y, fr);
    this.spriteidx = spriteidx;
    this.isBig = big;
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
    if(this.isBig) {
        gfx.drawBigCharacter(this.spriteidx, animData[1], this.x, this.y);
    } else {
        gfx.drawCharacter(this.spriteidx, animData[1], this.x, this.y);
    }
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
    if(this.isBig) {
        if(this.dead) {
            gfx.drawDitheredBigCharacter(this.spriteidx, 1, this.x, 5, (this.deadFrame++));
        } else if(this.hit) {
            var dx = Math.random() > 0.5 ? 0.125 : (Math.random() > 0.5 ? -0.125 : 0);
            var dy = Math.random() > 0.5 ? -0.25 : (Math.random() > 0.5 ? -0.125 : 0);
            gfx.drawBigCharacter(this.spriteidx, 1, this.x + dx, this.y + dy);
        } else {
            this.InnerAnimate();
        }
    } else {
        if(this.dead) {
            gfx.drawDitheredCharacter(this.spriteidx, 1, this.x, this.y, (this.deadFrame++));
        } else if(this.hit) {
            var dx = Math.random() > 0.5 ? 0.125 : (Math.random() > 0.5 ? -0.125 : 0);
            var dy = Math.random() > 0.5 ? -0.25 : (Math.random() > 0.5 ? -0.125 : 0);
            gfx.drawCharacter(this.spriteidx, 1, this.x + dx, this.y + dy);
        } else {
            this.InnerAnimate();
        }
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
            } else if(this.lastThrownFrame < 0) {
                if(combat.lastTargetCrop) {
                    // TODO: targeting crops
                } else {
                    combat.displayEnemyDamage(combat.lastTarget);
                }
                this.lastThrownFrame = 0;
            }
        } else {
            this.lastRan = +new Date();
            this.animState = (this.animState + 1) % this.animArray.length;
        }
    }
    var animData = this.animArray[this.animState];
    if(this.hit) {
        var dx = Math.random() > 0.5 ? 0.125 : (Math.random() > 0.5 ? -0.125 : 0);
        var dy = Math.random() > 0.5 ? -0.25 : (Math.random() > 0.5 ? -0.125 : 0);
        gfx.drawPlayer(0, 1, this.x + dx, this.y + dy);
    } else {
        gfx.drawPlayer(animData[0], animData[1], this.x, this.y, this.onTop ? "menucursorC" : "characters");
    }
    if(this.throwables.length > 0 && this.lastThrownFrame < this.animState && this.animState === 0) {
        var b = 2 + Math.random() * 1;
        var initx = 11 - combat.enemies.length;
        var c = (initx + combat.lastTarget + this.x - 0.5) / 2;
        var gx = this.throwables[0][1], gy = this.throwables[0][2];
        var seedDrop = combat.grid[gx][gy].seedDrop;
        if(seedDrop !== undefined) {
            this.animHelper.AddAnim(new MoveAnim(this.dx + gx, this.dy + gy, this.x, this.y, 250, seedDrop));
        }
        var isTree = combat.purgeFlaggedCrop(combat.grid, gx, gy);
        if(isTree) { gx += 0.5; gy += 0.5; }
        combat.animHelper.AddAnim(new SheetAnim(combat.dx + gx, combat.dy + gy, 250, "puff", 5));
        combat.animHelper.AddAnim(new PlayerThrowAnim(this.y - 0.5, 500, this.throwables[0][0], b, c, combat.lastTarget, this.throwables.length === 1));
        this.lastThrownFrame = this.animState;
        this.throwables.splice(0, 1);
    }
};


function CombatAnimHelper(enemies) {
    var playerAnimInfo = new PlayerAnimInfo();
    var enemyAnimInfos = [];
    var initx = 11 - enemies.length;
    for(var i = 0; i < enemies.length; i++) {
        var e = GetEnemy(enemies[i]);
        enemyAnimInfos.push(new EnemyAnimInfo([[e.spriteidx, 0]], initx + i, e.isBig ? 5 : 5.75, 0, e.isBig, e.spriteidx));
    }
    var anims = [];
    
    this.SetPlayerAnimInfo = function(anims, x, y, top, fr) { playerAnimInfo = new PlayerAnimInfo(anims, x, y, fr, top); };
    this.SetEnemyAnimInfo = function(idx, anims, fr, throwables) {
        var e = combat.enemies[idx];
        var initx = 11 - combat.enemies.length;
        enemyAnimInfos[idx] = new EnemyAnimInfo(anims, initx + idx, e.isBig ? 5 : 5.75, fr, e.isBig, e.spriteidx);
        enemyAnimInfos[idx].throwables = throwables || [];
    };

    this.GivePlayerAHit = function() { playerAnimInfo.hit = true; };
    this.GiveEnemyAHit = function(idx) { enemyAnimInfos[idx].hit = true; };
    this.MakeEnemyACorpse = function(idx) {
        var e = enemyAnimInfos[idx];
        e.dead = true;
        e.deadFrame = 0;
    };

    this.AddPlayerThrowable = function(t) { playerAnimInfo.throwables.push(t); };
    this.AnimateEntities = function() {
        playerAnimInfo.Animate();
        for(var i = 0; i < enemyAnimInfos.length; i++) { enemyAnimInfos[i].Animate(); }
    };
    this.CleanEntities = function() {
        playerAnimInfo.Reset();
        for(var i = 0; i < enemyAnimInfos.length; i++) { enemyAnimInfos[i].Reset(); }
    };
    this.RemoveEnemy = function(idx) { enemyAnimInfos.splice(idx, 1); };

    this.AddAnim = function(a) { anims.push(a); };
    this.CleanAnims = function() { anims = []; };
    this.Animate = function() {
        for(var i = anims.length - 1; i >= 0; i--) {
            var t = anims[i];
            if(t.current >= t.time) {
                t.finish();
                anims.splice(i, 1);
            } else {
                t.getFrame(combat.dt);
            }
        }
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
                    if(newFrame < 3) {
                        gfx.drawTileToGrid("tree" + newFrame, xdx, ydy, "foreground");
                    } else {
                        gfx.drawTileToGrid("tree2", xdx, ydy, "foreground");
                        newFrame -= 3;
                        gfx.drawTileToGrid(crop.name + newFrame, xdx, ydy, "foreground");
                    }
                    gfx.drawItemNumber(crop.rotten ? "x" : Math.ceil(crop.activeTime), xdx + 1, ydy, "foreground", true);
                } else if(crop.type === "water") {
                    if(crop.name === "net") {
                        if(crop.rotten) {
                            gfx.drawTileToGrid(crop.name + "0", xdx, ydy, "foreground");
                        } else {
                            gfx.drawTileToGrid(crop.name + "1", xdx, ydy, "foreground");
                            gfx.drawItemNumber(0, xdx, ydy, "foreground", true);
                        }
                    }
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
}
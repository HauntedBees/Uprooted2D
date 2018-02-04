function TileAnim(x, y, tileArray, shake, fps, loop) {
    var pos = { x: x, y: y };
    var tiles = tileArray, doShake = shake, doLoop = loop, isDone = false;
    var frame = 0, timePerFrame = 1000 / fps, numFrames = tileArray.length - 1;
    var lastRan = +new Date();
    var frameFuncs = [];
    this.AddFrameFunc = function(idx, func) { frameFuncs[idx] = func; };
    this.Animate = function() {
        if(isDone) { return; }
        var now = +new Date();
        if((now - lastRan) >= timePerFrame) {
            if(frame < numFrames) {
                frame++;
                if(frameFuncs[frame] !== undefined) { frameFuncs[frame](); }
            } else if(doLoop) {
                frame = 0;
            } else {
                isDone = true;
                return;
            }
            lastRan = now;
        }
        var x = pos.x; var y = pos.y;
        if(doShake) {
            x += Math.random() < 0.33 ? 0.125 : (Math.random() > 0.5 ? -0.125 : 0);
            y += Math.random() < 0.33 ? -0.125 : (Math.random() > 0.5 ? -0.125 : 0);
        }
        gfx.drawTileToGrid(tiles[frame], x, y, "menucursorC");
    }
}
function MovingLinearAnim(sprites, start, end, dy, fps, animfps, doneFunc) {
    var dir = (start.x < end.x) ? 1 : -1;
    var startPos = dir === 1 ? start : end, endPos = dir === 1 ? end : start, DoneFunction = doneFunc;
    var diffX = endPos.x - startPos.x;
    var diffY = endPos.y - startPos.y;
    var GetY = function(x) { return startPos.y + ((x - startPos.x) / diffX) * diffY; };
    var dt = 0.25;
    var frame = 0, timePerFrame = 1000 / fps, numFrames = (endPos.x - startPos.x) / dt;
    var animframe = 0, timePerAnimFrame = 1000 / animfps;
    var lastRan = +new Date(), lastAnimRan = +new Date(), isDone = false;
    var spriteLen = sprites.length;
    this.Animate = function() {
        if(isDone) { return; }
        var now = +new Date();
        if((now - lastAnimRan) >= timePerAnimFrame) {
            animframe = (animframe + 1) % spriteLen;
            lastAnimRan = now;
        }
        if((now - lastRan) >= timePerFrame) {
            if(frame < numFrames) {
                frame++;
            } else {
                if(DoneFunction !== undefined) { DoneFunction(); }
                isDone = true;
                return;
            }
            lastRan = now;
        }
        var x = dir === 1 ? (startPos.x + (frame * dt)) : (endPos.x - (frame * dt));
        var y = GetY(x);
        gfx.drawTileToGrid(sprites[animframe], x, y - dy, "menucursorC");
    }
}
function ParabolicThrowAnim(crop, start, end, fps, doneFunc) {
    var dir = (start.x < end.x) ? 1 : -1;
    var startPos = dir === 1 ? start : end, endPos = dir === 1 ? end : start, DoneFunction = doneFunc;
    var midPoint = { x: (endPos.x + startPos.x) / 2, y: startPos.y - 3 };

    var A1 = -(startPos.x * startPos.x) + (midPoint.x * midPoint.x);
    var B1 = -startPos.x + midPoint.x;
    var D1 = -startPos.y + midPoint.y;
    var A2 = -(midPoint.x * midPoint.x) + (endPos.x * endPos.x);
    var B2 = -midPoint.x + endPos.x;
    var D2 = -midPoint.y + endPos.y;
    var Bm = -(B2/B1);
    var A3 = Bm * A1 + A2;
    var D3 = Bm * D1 + D2;

    var a = D3 / A3;
    var b = (D1 - A1 * a)/B1;
    var c = startPos.y - a * (startPos.x * startPos.x) - b * startPos.x;
    var GetY = function(x) { return (a*x*x + b*x + c); };
    var dt = 1;
    var frame = 0, timePerFrame = 1000 / fps, numFrames = (endPos.x - startPos.x) * dt;
    var lastRan = +new Date(), isDone = false;

    this.Animate = function() {
        if(isDone) { return; }
        var now = +new Date();
        if((now - lastRan) >= timePerFrame) {
            if(frame < numFrames) {
                frame++;
            } else {
                if(DoneFunction !== undefined) { DoneFunction(); }
                isDone = true;
                return;
            }
            lastRan = now;
        }
        var x = dir === 1 ? (startPos.x + (frame / dt)) : (endPos.x - (frame / dt));
        var y = GetY(x);
        gfx.drawTileToGrid(crop, x, y, "menucursorC");
    }
}
function AnimProcess(ae, as, babies) {
    var animentity = ae, animset = as;
    var frame = 0, timePerFrame = 1000 / animset.fps;
    var lastRan = +new Date();
    var callbacksCalled = [];
    var doShake = animset.doShake;
    this.animBabies = babies || [];
    var overlays = [];
    this.SetNewFPS = function(fps) { timePerFrame = 1000 / fps; };
    this.SetShake = function(val) { doShake = val; };
    this.AddBaby = function(baby) { this.animBabies.push(baby); };
    this.ClearBabies = function() { this.animBabies = []; }
    this.AddOverlay = function(overlay) { overlays.push(overlay); }
    this.Animate = function() {
        var now = +new Date(), isEnd = false;
        if((now - lastRan) >= timePerFrame) {
            if(frame < animset.lastFrame) { frame++; }
            else { isEnd = true; if(animset.loop) { frame = 0; } }
            lastRan = now;
        }
        var animInfo = animset.anims[frame];
        if(animInfo.callback && callbacksCalled.indexOf(frame) < 0) {
            callbacksCalled.push(frame);
            animCallbacks[animInfo.callback](this, animentity);
        }
        var dx = 0, dy = 0;
        if(doShake) {
            dx = Math.random() < 0.33 ? 0.125 : (Math.random() > 0.5 ? -0.125 : 0);
            dy = Math.random() < 0.33 ? -0.125 : (Math.random() > 0.5 ? -0.125 : 0);
        }
        gfx.drawCombatWhatsit(animentity.sheet, animInfo.x + animentity.dx, animInfo.y, animentity.dims, animentity.layer, dx, dy);
        overlays.forEach(function(e) {
            if(frame <= e.length) {
                var f = e.frames[frame];
                gfx.drawCombatWhatsit(e.sheet, f.x, f.y, animentity.dims, animentity.layer, dx + f.dx / 16, dy + f.dy / 16);
            }
        });
        this.animBabies.forEach(function(e) { e.Animate(); });
        return isEnd;
    };
    this.Finish = function() {
        // TODO: maybe.
    };
}

function CropAttackAnim(targtype, grid, x, y) {
    this.targtype = targtype; // _ENEMY or _CROP // TODO: might not even be useful
    this.grid = grid; this.x = x; this.y = y;
    this.crop = grid[x][y];
    if(this.crop.fishNum !== undefined) {
        if(this.crop.fishNum >= 3) { this.animset = "FISH_TOSS"; }
        else { this.animset = "FISH_SLAP"; }
    } else if(this.crop.type === "egg") {
        this.animset = "THROW_BIRD";
    } else {// TODO: more different anims
        this.animset = "THROW" + this.targtype; 
    }
}

function CombatAnimEntity(sheet, w, h, x, y, anims, initAnim, dx) {
    var currentName = initAnim, runningFromQueue = false;
    this.sheet = sheet;
    this.dims = { x: x, y: y, w: w, h: h };
    this.anims = anims;
    this.dx = dx || 0;
    this.currentAnim = new AnimProcess(this, this.anims[initAnim]);
    this.bonusArgs = {};
    this.layer = "characters";
    this.animQueue = [];
    this.Animate = function() {
        if(!runningFromQueue) { this.currentAnim.Animate(); return; }
        var animEnded = this.currentAnim.Animate();
        if(animEnded) {
            var ongoingAnims = this.currentAnim.animBabies;
            this.animQueue.shift();
            if(this.animQueue.length) {
                this.currentAnim = new AnimProcess(this, this.anims[this.animQueue[0].animset], ongoingAnims);
            } else {
                runningFromQueue = false;
                this.currentAnim = new AnimProcess(this, this.anims["STAND"], ongoingAnims);
            }
        }
    };
    this.StartAnimQueue = function() {
        runningFromQueue = true;
        this.currentAnim = new AnimProcess(this, this.anims[this.animQueue[0].animset]);
    };
    this.ClearAnimQueue = function() { this.animQueue = []; runningFromQueue = false; }
    this.PushArg = function(key, val) { this.bonusArgs[key] = val; };
    this.PushOverlayAnim = function(overlay) { this.currentAnim.AddOverlay(overlay); }
    this.SetAnim = function(newName) {
        if(currentName === newName) { return; }
        currentName = newName;
        this.currentAnim.Finish();
        this.throwables = [];
        this.currentAnim = new AnimProcess(this, this.anims[newName]);
        this.bonusArgs = {};
    };
}

function CombatAnimPlayer(x, y) { CombatAnimEntity.call(this, "combat_player", 32, 30, x, y, playerCombatAnims, "STAND"); }
CombatAnimPlayer.prototype = Object.create(CombatAnimEntity.prototype);

function CombatAnimEnemy(sheet, w, h, x, y, dx) { CombatAnimEntity.call(this, sheet, w, h, x, y, enemyCombatAnims, "STAND", dx); }
CombatAnimEnemy.prototype = Object.create(CombatAnimEntity.prototype);

function GetEnemyCombatAnim(x, y, dx, size) {
    var dims = GetEnemyCombatDims(size);
    var eca = new CombatAnimEnemy(dims.sheet, dims.w, dims.h, x, y, dx);
    if(dims.dw > 0) { eca.dims.dw = dims.dw; }
    return eca;
}
function GetEnemyCombatDims(size) {
    var w = 24, h = 30, dw = 0, sheet = "charsheet";
    switch(size) {
        case "md": w = 24; h = 30; break;
        case "lg": w = 32; h = 40; sheet = "charsheetbig"; break;
        case "xl": w = 96; h = 80; dw = 32; sheet = "charsheetbig"; break;
    }
    return { w: w, h: h, dw: dw, sheet: sheet };
}

function GetHPFrame(enemy) {
    var hp = Math.round(enemy.health / enemy.maxhealth * 14);
    if(hp > 14) { hp = 14; } else if(hp < 1) { hp = 1; }
    return "hp" + hp;
}
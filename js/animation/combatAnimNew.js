function TileAnim(x, y, tileArray, shake, fps, loop) {
    const pos = { x: x, y: y };
    const tiles = tileArray, doShake = shake, doLoop = loop;
    let isDone = false;
    let frame = 0, timePerFrame = 1000 / fps, numFrames = tileArray.length - 1;
    let lastRan = +new Date();
    let frameFuncs = [];
    this.AddFrameFunc = function(idx, func) { frameFuncs[idx] = func; };
    this.Animate = function() {
        if(isDone) { return; }
        const now = +new Date();
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
        let x = pos.x, y = pos.y;
        if(doShake) {
            x += Math.random() < 0.33 ? 0.125 : (Math.random() > 0.5 ? -0.125 : 0);
            y += Math.random() < 0.33 ? -0.125 : (Math.random() > 0.5 ? -0.125 : 0);
        }
        gfx.drawTileToGrid(tiles[frame], x, y, "menucursorC");
    }
}
function MovingLinearAnim(sprites, start, end, dt, dy, fps, animfps, doneFunc) {
    const dir = (start.x < end.x) ? 1 : -1;
    const startPos = dir === 1 ? start : end, endPos = dir === 1 ? end : start, DoneFunction = doneFunc;
    const diffX = endPos.x - startPos.x;
    const diffY = endPos.y - startPos.y;
    const GetY = function(x) { return startPos.y + ((x - startPos.x) / diffX) * diffY; };
    let frame = 0, timePerFrame = 1000 / fps, numFrames = (endPos.x - startPos.x) / dt;
    let animframe = 0, timePerAnimFrame = 1000 / animfps;
    let lastRan = +new Date(), lastAnimRan = +new Date(), isDone = false;
    const spriteLen = sprites.length;
    this.Animate = function() {
        if(isDone) { return; }
        const now = +new Date();
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
        const x = dir === 1 ? (startPos.x + (frame * dt)) : (endPos.x - (frame * dt));
        const y = GetY(x);
        gfx.drawTileToGrid(sprites[animframe], x, y - dy, "menucursorC");
    }
}
function ParabolicThrowAnim(crop, start, end, fps, doneFunc, tiny) {
    const dir = (start.x < end.x) ? 1 : -1;
    const startPos = dir === 1 ? start : end, endPos = dir === 1 ? end : start, DoneFunction = doneFunc;
    const midPoint = { x: (endPos.x + startPos.x) / 2, y: startPos.y - (tiny === true ? 1 : 3) };

    const A1 = -(startPos.x * startPos.x) + (midPoint.x * midPoint.x);
    const B1 = -startPos.x + midPoint.x;
    const D1 = -startPos.y + midPoint.y;
    const A2 = -(midPoint.x * midPoint.x) + (endPos.x * endPos.x);
    const B2 = -midPoint.x + endPos.x;
    const D2 = -midPoint.y + endPos.y;
    const Bm = -(B2/B1);
    const A3 = Bm * A1 + A2;
    const D3 = Bm * D1 + D2;

    const a = D3 / A3;
    const b = (D1 - A1 * a)/B1;
    const c = startPos.y - a * (startPos.x * startPos.x) - b * startPos.x;
    const GetY = function(x) { return (a*x*x + b*x + c); };
    const dt = tiny ? 3 : 1;
    let frame = 0, timePerFrame = 1000 / fps, numFrames = (endPos.x - startPos.x) * dt;
    let lastRan = +new Date(), isDone = false;

    this.Animate = function() {
        if(isDone) { return; }
        const now = +new Date();
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
        const x = dir === 1 ? (startPos.x + (frame / dt)) : (endPos.x - (frame / dt));
        const y = GetY(x);
        gfx.drawTileToGrid(crop, x, y, "menucursorC");
    }
}
function AnimProcess(ae, as, babies) {
    const animentity = ae, animset = as;
    let frame = 0, timePerFrame = 1000 / animset.fps;
    let lastRan = +new Date();
    let callbacksCalled = [];
    let doShake = animset.doShake;
    this.animBabies = babies || [];
    let overlays = [];
    this.SetNewFPS = function(fps) { timePerFrame = 1000 / fps; };
    this.SetShake = function(val) { doShake = val; };
    this.AddBaby = function(baby) { this.animBabies.push(baby); };
    this.ClearBabies = function() { this.animBabies = []; }
    this.AddOverlay = function(overlay) { overlays.push(overlay); }
    this.Animate = function() {
        const now = +new Date();
        let isEnd = false;
        if((now - lastRan) >= timePerFrame) {
            if(frame < animset.lastFrame) { frame++; }
            else { isEnd = true; if(animset.loop) { frame = 0; } }
            lastRan = now;
        }
        const animInfo = animset.anims[frame];
        if(animInfo.callback && callbacksCalled.indexOf(frame) < 0) {
            callbacksCalled.push(frame);
            animCallbacks[animInfo.callback](this, animentity);
        }
        let dx = 0, dy = 0;
        if(doShake) {
            dx = Math.random() < 0.33 ? 0.125 : (Math.random() > 0.5 ? -0.125 : 0);
            dy = Math.random() < 0.33 ? -0.125 : (Math.random() > 0.5 ? -0.125 : 0);
        }
        gfx.DrawCombatWhatsit(animentity.sheet, animInfo.x + animentity.dx, animInfo.y, animentity.dims, animentity.layer, dx, dy);
        overlays.forEach(function(e) {
            if(frame <= e.length) {
                const f = e.frames[frame];
                gfx.DrawCombatWhatsit(e.sheet, f.x, f.y, animentity.dims, animentity.layer, dx + f.dx / 16, dy + f.dy / 16);
            }
        });
        this.animBabies.forEach(function(e) { e.Animate(); });
        return isEnd;
    };
    this.Finish = function() {
        // TODO: might be useless.
    };
}

function CropAttackAnim(targtype, grid, x, y, idx) {
    this.targtype = targtype; // _ENEMY or _CROP // TODO: might not even be useful
    this.grid = grid; this.x = x; this.y = y;
    this.crop = grid[x][y];
    this.idx = idx || 0;
    if(this.crop.fishNum !== undefined) {
        if(this.crop.fishNum >= 4) { this.animset = "FISH_TOSS"; }
        else { this.animset = "FISH_SLAP"; }
    } else if(this.crop.name === "frogbot") {
        this.animset = "THROW_ROBO";
    } else if(this.crop.type === "egg") {
        this.animset = "THROW_BIRD";
    } else { // TODO: maybe one for rice?
        this.animset = "THROW" + targtype; 
    }
}

function CombatAnimEntity(sheet, w, h, x, y, anims, initAnim, dx) {
    let currentName = initAnim, runningFromQueue = false;
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
        const animEnded = this.currentAnim.Animate();
        if(animEnded) {
            let ongoingAnims = this.currentAnim.animBabies;
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

function CombatAnimFalcon(x, y) { CombatAnimEntity.call(this, "combat_player", 32, 30, x, y, falconAnims, "STAND"); }
CombatAnimPlayer.prototype = Object.create(CombatAnimEntity.prototype);

function CombatAnimEnemy(sheet, w, h, x, y, dx) { CombatAnimEntity.call(this, sheet, w, h, x, y, enemyCombatAnims, "STAND", dx); }
CombatAnimEnemy.prototype = Object.create(CombatAnimEntity.prototype);
CombatAnimEnemy.prototype.CorpseItUp = function (d, size) { gfx.DrawDitheredWhatsit(this.sheet, this.dx, 1, this.dims, this.layer, d, size); };

function GetEnemyCombatAnim(x, y, dx, size) {
    const dims = GetEnemyCombatDims(size);
    let eca = new CombatAnimEnemy(dims.sheet, dims.w, dims.h, x, y, dx);
    if(dims.dw > 0) { eca.dims.dw = dims.dw; }
    return eca;
}
function GetEnemyCombatDims(size) {
    let w = 24, h = 30, dw = 0, sheet = "charsheet";
    switch(size) {
        case "md": w = 24; h = 30; break;
        case "lg": w = 32; h = 40; sheet = "charsheetbig"; break;
        case "xl": w = 96; h = 80; dw = 32; sheet = "charsheetbig"; break;
    }
    return { w: w, h: h, dw: dw, sheet: sheet };
}

function GetHPFrame(enemy) {
    let hp = Math.round(enemy.health / enemy.maxhealth * 14);
    if(hp > 14) { hp = 14; } else if(hp < 1) { hp = 1; }
    return "hp" + hp;
}
function WalkAnim(animal, info, animProcess) {
    const baseY = RoundNear(FloatRange(info.minY, info.maxY), 8);
    const layer = (baseY < 8.375) ? "background2" : "menucursorC";
    this.requiredY = Math.floor(baseY * 8);
    const startX = RoundNear(FloatRange((info.closeStart ? -8 : -20), (info.closeStart ? -1 : -3)), 8), endX = RoundNear(gfx.tileWidth + FloatRange(0.5, 2), 8);
    let lastAnimRan = +new Date(), animState = InclusiveRange(0, 1), animLength = Range(80, 140);
    let frame = 0, lastCleanX = startX, speed = RoundNear(FloatRange(info.minSpeed, info.maxSpeed), 8);
    this.Animate = function() {
        const now = +new Date();
        if((now - lastAnimRan) >= 100) {
            animState = (animState === 1 ? 0 : 1);
            lastAnimRan = now;
        }
        if(!info.isWorm || animState === 0) { frame += speed; }
        const x = startX + frame;
        if(x > endX) { frame = 0; }
        gfx.drawTileToGrid("animal" + animal + animState, x, baseY, layer);
        if(info.trail !== undefined && x >= 0 && Math.floor(x) > lastCleanX) {
            lastCleanX = Math.floor(x);
            animProcess.AddBaby(new TileAnim(lastCleanX, baseY, [info.trail], false, 12, true), `${lastCleanX}, ${baseY}`);
        }
    }
}
function HoppingAnim(animal) {
    const hopMult = FloatRange(0.01, 1.5), hopHeight = FloatRange(3, 6);
    const baseY = RoundNear(FloatRange(8.125, 8.5), 8);
    this.requiredY = Math.floor(baseY * 8);
    const layer = (baseY < 8.375) ? "background2" : "menucursorC";
    const startX = RoundNear(FloatRange(-20, -3), 8), endX = RoundNear(gfx.tileWidth + FloatRange(0.5, 2), 8);
    const radian = Math.PI / 180, period = 2 * Math.PI / hopMult;
    let frame = 0, pauseTime = 0;
    const GetY = x => baseY - FloorNear(Math.abs(hopHeight * Math.sin(x * hopMult)), 4);
    this.Animate = function() {
        if(pauseTime > 0) {
            pauseTime--;
            const x = startX + frame, y = GetY(x);
            gfx.drawTileToGrid("animal" + animal + "1", RoundNear(x, 8), y, layer);
            return;
        }
        frame += period * radian;
        const x = startX + frame, y = GetY(x);
        if(x > endX) { frame = 0; }
        if(y === baseY) { pauseTime = 12; }
        gfx.drawTileToGrid("animal" + animal + "0", RoundNear(x, 8), y, layer);
    }
}

function TileAnim(x, y, tileArray, shake, fps, loop) {
    const pos = { x: x, y: y };
    const layer = "menucursorC"; //(pos.y < 8.375) ? "background2" : "menucursorC"; why did i do this
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
        gfx.drawTileToGrid(tiles[frame], x, y, layer);
    }
}
function VineAnim(column, bottomy, delay, callback) {
    const x = column, by = bottomy;
    let timerBeforeStart = delay;
    let frame = 0, timePerFrame = 1000 / 24, timePerAnimFrame = 100;
    let lastRan = +new Date(), lastAnimRan = +new Date();
    let animState = 0, height = 0, done = false;
    this.Animate = function() {
        if(timerBeforeStart-- > 0) { return; }
        const now = +new Date();
        if((now - lastAnimRan) >= timePerAnimFrame) {
            animState = (animState === 1 ? 0 : 1);
            lastAnimRan = now;
        }
        if((now - lastRan) >= timePerFrame) {
            if(height < by) {
                height += 0.25;
            } else if(!done) {
                done = true;
                if(callback !== undefined) { callback(); }
            }
            lastRan = now;
        }
        for(let y = 0; y < by; y++) {
            gfx.DrawYMaskedSprite("vineAnim" + (y % 4) + "." + animState, x, by + y + 1 - height, "menucursorC", by);
        }
        gfx.drawTileToGrid("vineAnimT." + animState, x, by - height, "menucursorC");
        gfx.drawTileToGrid("vineBottom" + animState, x, by, "menucursorC");
    }
}
function MovingLinearAnim(sprites, start, end, dt, dy, fps, animfps, doneFunc) {
    if(sprites[0] === "printer") { sprites[0] = "printerB" + Range(0, 7); }
    const dir = (start.x <= end.x) ? 1 : -1;
    const startPos = dir === 1 ? start : end, endPos = dir === 1 ? end : start, DoneFunction = doneFunc;
    const diffX = endPos.x - startPos.x;
    const diffY = endPos.y - startPos.y;
    const isVertical = diffX === 0;
    const GetY = function(x) { return startPos.y + ((x - startPos.x) / diffX) * diffY; };
    let frame = 0, timePerFrame = 1000 / fps, numFrames = Math.abs(isVertical ? (endPos.y - startPos.y) : (endPos.x - startPos.x)) / dt;
    console.log(`numFrames: ${numFrames}`);
    let animframe = 0, timePerAnimFrame = 1000 / animfps;
    let lastRan = +new Date(), lastAnimRan = +new Date(), isDone = false;
    let prevX = start.x;
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
                if(DoneFunction !== undefined) { DoneFunction(this); }
                isDone = true;
                return;
            }
            lastRan = now;
        }
        const x = isVertical ? startPos.x : (dir === 1 ? (startPos.x + (frame * dt)) : (endPos.x - (frame * dt)));
        if(prevX !== Math.floor(x) && this.xFunc !== undefined) {
            prevX = Math.floor(x);
            this.xFunc(prevX);
        }
        const y = isVertical ? (startPos.y + (frame * dt)) : GetY(x);
        gfx.drawTileToGrid(sprites[animframe], x, y - dy, "menucursorC");
    }
}
function ParabolicThrowAnim(crop, start, end, fps, doneFunc, tiny) {
    if(crop === "printer") { crop = "printerB" + Range(0, 7); }
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
    this.AddBaby = function(baby, id, front) {
        if(id !== undefined) {
            if(this.animBabies.some(e => e.id === id)) { return; }
            baby.id = id;
        }
        if(front === true) { this.animBabies.unshift(baby); }
        else { this.animBabies.push(baby); }
    };
    this.ClearBabies = function() { this.animBabies = []; }
    this.AddOverlay = function(overlay) { overlays.push(overlay); }
    if(as.startSound) {
        //if(typeof as.startSound === "function") {
        //} else {
            Sounds.PlaySound(as.startSound);
        //}
    }
    this.Animate = function(isStuckInGoop) {
        const now = +new Date();
        let isEnd = false;
        if((now - lastRan) >= timePerFrame) {
            if(frame < animset.lastFrame) { frame++; }
            else { isEnd = true; if(animset.loop) { frame = 0; } }
            lastRan = now;
        }
        const animInfo = animset.anims[frame];
        if(animInfo.stopPrevSound) { Sounds.EndAll(); }
        if(animInfo.sound) { Sounds.PlaySound(animInfo.sound); }
        if(animInfo.callback && callbacksCalled.indexOf(frame) < 0) {
            callbacksCalled.push(frame);
            animCallbacks[animInfo.callback](this, animentity);
        }
        let dx = 0, dy = 0;
        if(doShake) {
            dx = Math.random() < 0.33 ? 0.125 : (Math.random() > 0.5 ? -0.125 : 0);
            dy = Math.random() < 0.33 ? -0.125 : (Math.random() > 0.5 ? -0.125 : 0);
        }
        gfx.DrawCombatWhatsit(animentity.sheet, animInfo.x + animentity.dx, animInfo.y + animentity.dy, animentity.dims, animentity.layer, dx, dy);
        overlays.forEach(function(e) {
            if(frame <= e.length) {
                const f = e.frames[frame];
                gfx.DrawCombatWhatsit(e.sheet, f.x, f.y, animentity.dims, animentity.layer, dx + f.dx / 16, dy + f.dy / 16);
            }
        });
        if(isStuckInGoop) {
            if(animentity.dims.w <= 32) {
                gfx.drawTileToGrid("hgoop", animentity.dims.x + animentity.cursorinfo.dx + 0.25, 8.25, "characters");
            } else {
                gfx.drawTileToGrid("goopBig", animentity.dims.x + animentity.cursorinfo.dx + 0.25, 7.25, "characters");
            }
        }
        const layerMatters = [];
        this.animBabies.forEach(e => {
            if(e.requiredY) {
                if(layerMatters[e.requiredY] === undefined) { layerMatters[e.requiredY] = [e]; }
                else { layerMatters[e.requiredY].push(e); }
            } else { e.Animate(); }
        });
        layerMatters.forEach(arr => arr.forEach(e => e.Animate()));
        return isEnd;
    };
}

function CropAttackAnim(targtype, grid, x, y, idx, forcedAnimSet, animal) {
    this.grid = grid; this.x = x; this.y = y;
    this.crop = grid[x][y];
    this.idx = idx || 0;
    if(forcedAnimSet !== undefined) {
        this.animset = forcedAnimSet;
    } else if(this.crop.fishNum !== undefined) {
        if(this.crop.fishNum >= 4) { this.animset = "FISH_TOSS"; }
        else { this.animset = "FISH_SLAP"; }
    } else if(this.crop.name === "frogbot") {
        this.animset = "THROW_ROBO";
    } else if(this.crop.type === "egg") {
        this.animset = "THROW_BIRD";
    } else {
        this.animset = "THROW" + targtype; 
    }
    if(animal !== undefined) { this.animal = animal; }
}

function CombatAnimEntity(sheet, w, h, x, y, anims, initAnim, dx, dy) {
    let currentName = initAnim, runningFromQueue = false;
    this.sheet = sheet;
    this.dims = { x: x, y: y, w: w, h: h };
    this.anims = anims;
    this.dx = dx || 0;
    this.dy = dy || 0;
    this.currentAnim = new AnimProcess(this, this.anims[initAnim]);
    this.bonusArgs = {};
    this.layer = "characters";
    this.animQueue = [];
    this.Animate = function(isStuckInGoop) {
        if(!runningFromQueue) { this.currentAnim.Animate(isStuckInGoop); return; }
        const animEnded = this.currentAnim.Animate(isStuckInGoop);
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
        this.throwables = [];
        this.currentAnim = new AnimProcess(this, this.anims[newName]);
        this.bonusArgs = {};
    };
}

function CombatAnimPlayer(x, y) { CombatAnimEntity.call(this, "combatPlayer", 32, 30, x, y, playerCombatAnims, "STAND"); }
CombatAnimPlayer.prototype = Object.create(CombatAnimEntity.prototype);

function CombatAnimFalcon(x, y) { CombatAnimEntity.call(this, "combatPlayer", 32, 30, x, y, falconAnims, "STAND"); }
CombatAnimPlayer.prototype = Object.create(CombatAnimEntity.prototype);

function CombatAnimEnemy(sheet, w, h, x, y, dx, dy) { CombatAnimEntity.call(this, sheet, w, h, x, y, enemyCombatAnims, "STAND", dx, dy); }
CombatAnimEnemy.prototype = Object.create(CombatAnimEntity.prototype);
CombatAnimEnemy.prototype.CorpseItUp = function(d, size) { gfx.DrawDitheredWhatsit(this.sheet, this.dx, this.dy + 1, this.dims, this.layer, d, size); };

function GetEnemyCombatAnim(x, y, spriteidx, size, cursorinfo) {
    const dims = GetEnemyCombatDims(size);
    if(size === "xl") {
        if(spriteidx[0] === 3) { x += 0.5; y += 0.5; }
        else if(spriteidx[0] === 8) { y += 0.75; }
    }
    const eca = new CombatAnimEnemy(dims.sheet, dims.w, dims.h, x, y, spriteidx[0], spriteidx[1]);
    eca.cursorinfo = cursorinfo;
    return eca;
}
function GetEnemyCombatDims(size) {
    let w = 32, h = 37, sheet = "combatSheet";
    switch(size) {
        case "lg": w = 44; h = 50; sheet = "combatSheetBig"; break;
        case "xl": w = 102; h = 86; sheet = "combatSheetHuge"; break;
    }
    return { w: w, h: h, sheet: sheet };
}

function GetHPFrame(enemy) {
    let hp = Math.round(enemy.health / enemy.maxhealth * 14);
    if(hp > 14) { hp = 14; } else if(hp < 1) { hp = 1; }
    return "hp" + hp;
}
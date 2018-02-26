function CombatAnim(x, y, time, sprite) {
    this.x = x;
    this.y = y;
    this.current = 0;
    this.time = time;
    this.sprite = sprite;
}
CombatAnim.prototype.getFrame = function(dt) { this.current += dt; };
CombatAnim.prototype.finish = function() {};

function NotAnAnim(x, y, time, sprite) {
    CombatAnim.call(this, x, y, time, sprite);
}
NotAnAnim.prototype = Object.create(CombatAnim.prototype);
NotAnAnim.prototype.constructor = NotAnAnim;
NotAnAnim.prototype.getFrame = function(dt) {
    gfx.drawTileToGrid(this.sprite, this.x, this.y, "characters");
    this.current += dt;
};

function ShakeAnim(x, y, time, sprite, variance, numShakes) {
    CombatAnim.call(this, x, y, time, sprite);
    this.delta = variance / 2;
    this.numShakes = numShakes;
    this.lastShake = -1;
    this.dx = 0;
    this.dy = 0;
}
ShakeAnim.prototype = Object.create(CombatAnim.prototype);
ShakeAnim.prototype.constructor = ShakeAnim;
ShakeAnim.prototype.getFrame = function(dt) {
    const shakeNum = Math.floor((this.current / this.time) * this.numShakes);
    if(shakeNum > this.lastShake) {
        const a = Math.floor(16 * Math.random());
        this.dx = this.delta * ((a & 4) == 0 ? 1 : -1);
        this.dy = this.delta * ((a & 8) == 0 ? 1 : -1);
        this.lastShake = shakeNum;
    }
    gfx.drawTileToGrid(this.sprite, this.x + this.dx, this.y + this.dy, "characters");
    this.current += dt;
};

function MoveAnim(x1, y1, x2, y2, time, sprite) {
    CombatAnim.call(this, x1, y1, time, sprite);
    this.x2 = x2;
    this.y2 = y2;
}
MoveAnim.prototype = Object.create(CombatAnim.prototype);
MoveAnim.prototype.constructor = MoveAnim;
MoveAnim.prototype.getFrame = function(dt) {
    const completion = this.current / this.time;
    const newx = this.x + (this.x2 - this.x) * completion;
    const newy = this.y + (this.y2 - this.y) * completion;
    gfx.drawTileToGrid(this.sprite, newx, newy, "menucursorC");
    this.current += dt;
};

function SheetAnim(x, y, time, sprite, frames, looping) {
    CombatAnim.call(this, x, y, time, sprite);
    this.frames = frames;
    this.loop = looping || false;
}
SheetAnim.prototype = Object.create(CombatAnim.prototype);
SheetAnim.prototype.constructor = SheetAnim;
SheetAnim.prototype.getFrame = function(dt) {
    const idx = Math.floor(this.frames * this.current / this.time);
    gfx.drawTileToGrid(this.sprite + idx, this.x, this.y, "menucursorC");
    this.current += dt;
};

function MapAnim(sheet, sx, sy, w, h, dir, sheetlen, dontDoThat) {
    this.sheet = sheet;
    this.topx = sx * w;
    this.topy = sy * h;
    this.width = w;
    this.height = h;
    this.state = 0;
    this.big = false;
    this.lastDir = dir || 2;
    this.lastRan = +new Date();
    this.sheetlen = sheetlen || 4;
    this.frameRate = anim.timePerFrame;
    this.other = {};
    this.dontDoThat = dontDoThat || false;
    this.setFPS = function(fps) { this.frameRate = ((fps === undefined || fps < 0) ? anim.timePerFrame : GetFrameRate(fps)); return this; };
    this.shiftX = function(newX, newLen) {
        this.topx = newX * this.width;
        this.sheetlen = newLen || this.sheetlen;
        return this;
    };
    this.shiftY = function(newY) { this.topy = newY * this.height; return this; };
    this.forceFrame = function(pos, sx, sy) {
        return {
            sheet: this.sheet,
            sx: this.topx + (this.width * sx),
            sy: this.topy + (this.height * sy),
            pos: pos, dir: dir, big: this.big,
            w: this.width, h: this.height,
            other: this.other
        };
    }
    this.getFrame = function(pos, dir, moving) {
        const curTime = +new Date();
        const update = (curTime - this.lastRan) >= this.frameRate;
        let frame = 0;
        if(dir === undefined) { dir = this.lastDir; }
        if(dir !== this.lastDir) {
            this.state = 0;
            this.lastDir = dir;
        } else if(moving) {
            if(update) {
                this.state = (this.state + 1) % this.sheetlen;
                this.lastRan = curTime;
            }
            if(this.sheetlen == 4 && !this.dontDoThat) {
                frame = 1 + ((this.state === 3) ? 1 : this.state);
            } else {
                frame = this.state;
            }
        }
        return {
            sheet: this.sheet,
            sx: this.topx + (this.width * this.lastDir),
            sy: this.topy + (this.height * frame),
            pos: pos, dir: dir, big: this.big,
            w: this.width, h: this.height,
            other: this.other
        };
    };
}
function GetFrameRate(fps) { return 1000 / fps; }
const anim = { fps: 6 };
anim.timePerFrame = GetFrameRate(anim.fps);
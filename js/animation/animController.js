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

function GetFrameRate(fps) { return 1000 / fps; }
const anim = { fps: 6 };
anim.timePerFrame = GetFrameRate(anim.fps);
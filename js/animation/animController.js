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
    gfx.drawTileToGrid(this.sprite, this.x, this.y, "menucursorC");
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
    var shakeNum = Math.floor((this.current / this.time) * this.numShakes);
    if(shakeNum > this.lastShake) {
        var a = Math.floor(16 * Math.random());
        this.dx = this.delta * ((a & 4) == 0 ? 1 : -1);
        this.dy = this.delta * ((a & 8) == 0 ? 1 : -1);
        this.lastShake = shakeNum;
    }
    gfx.drawTileToGrid(this.sprite, this.x + this.dx, this.y + this.dy, "menucursorC");
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
    var completion = this.current / this.time;
    var newx = this.x + (this.x2 - this.x) * completion;
    var newy = this.y + (this.y2 - this.y) * completion;
    gfx.drawTileToGrid(this.sprite, newx, newy, "menucursorC");
    this.current += dt;
};

function SheetAnim(x, y, time, sprite, frames) {
    CombatAnim.call(this, x, y, time, sprite);
    this.frames = frames;
}
SheetAnim.prototype = Object.create(CombatAnim.prototype);
SheetAnim.prototype.constructor = SheetAnim;
SheetAnim.prototype.getFrame = function(dt) {
    var idx = Math.floor(this.frames * this.current / this.time);
    gfx.drawTileToGrid(this.sprite + idx, this.x, this.y, "menucursorC");
    this.current += dt;
};

function ThrowAnim(y, time, sprite, b, c, dir) {
    CombatAnim.call(this, 0, y, time, sprite);
    this.b = b;
    this.c = c;
    this.dir = dir;
    this.xmult = c;
}
ThrowAnim.prototype = Object.create(CombatAnim.prototype);
ThrowAnim.prototype.constructor = ThrowAnim;
ThrowAnim.prototype.getFrame = function(dt) {
    var radians = Math.PI * (this.dir < 0 ? (this.current / this.time) : (1 - (this.current / this.time)));
    var x = this.xmult + (0.4 * this.c) * Math.cos(radians);
    var y = this.y + this.b * Math.sin(-radians);
    gfx.drawTileToGrid(this.sprite, x, y, "characters");
    this.current += dt;
};

function EnemyThrowAnim(y, time, sprite, b, c) { ThrowAnim.call(this, y, time, sprite, b, c, -1); }
EnemyThrowAnim.prototype = Object.create(ThrowAnim.prototype);
EnemyThrowAnim.prototype.constructor = EnemyThrowAnim;
EnemyThrowAnim.prototype.finish = function() { combat.animHelper.GivePlayerAHit(); }

function PlayerThrowAnim(y, time, sprite, b, c, tidx, last, stick) {
    ThrowAnim.call(this, y, time, sprite, b, c, 1);
    this.tidx = tidx;
    this.last = last;
    this.stick = stick;
}
PlayerThrowAnim.prototype = Object.create(ThrowAnim.prototype);
PlayerThrowAnim.prototype.constructor = PlayerThrowAnim;
PlayerThrowAnim.prototype.finish = function() {
    if(this.stick) {
        var pos = combat.animHelper.GetEnemyPos(this.tidx);
        var anim = new MoveAnim(pos.x, pos.y - 0.25, pos.x, pos.y + 0.25, 1000, "goopdrop");
        anim.tidx = this.tidx;
        anim.finish = function() { combat.enemies[this.tidx].justStuck = false; };
        combat.animHelper.AddAnim(anim);
    }
    if(this.additionalFinishes !== undefined) { 
        for(var i = 0; i < this.additionalFinishes.length; i++) {
            this.additionalFinishes[i]();
        }
    }
    if(this.last) {
        combat.animHelper.DisplayEnemyDamage(this.tidx);
    } else {
        combat.animHelper.GiveEnemyAHit(this.tidx);
    } 
}


function MapAnim(sheet, sx, sy, w, h, dir, sheetlen) {
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
    this.setFPS = function(fps) { this.frameRate = (fps === undefined ? animController.frameRate : GetFrameRate(fps)); return this; };
    this.shiftX = function(newX, newLen) {
        this.topx = newX * this.width;
        this.sheetlen = newLen || this.sheetlen;
        return this;
    };
    this.shiftY = function(newY) { this.topy = newY * this.height; return this; };
    this.getFrame = function(pos, dir, moving) {
        var curTime = +new Date();
        var update = (curTime - this.lastRan) >= this.frameRate;
        var frame = 0;
        if(dir === undefined) { dir = this.lastDir; }
        if(dir !== this.lastDir) {
            this.state = 0;
            this.lastDir = dir;
        } else if(moving) {
            if(update) {
                this.state = (this.state + 1) % this.sheetlen;
                this.lastRan = curTime;
            }
            if(this.sheetlen == 4) {
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
            w: this.width, h: this.height
        };
    };
}
function GetFrameRate(fps) { return 1000 / fps; }
var anim = { fps: 6 };
anim.timePerFrame = GetFrameRate(anim.fps);
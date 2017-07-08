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
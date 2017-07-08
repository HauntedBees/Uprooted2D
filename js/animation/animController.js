function MapAnim(sheet, sx, sy, w, h, dir) {
    this.sheet = sheet;
    this.topx = sx * w;
    this.topy = sy * h;
    this.width = w;
    this.height = h;
    this.state = 0;
    this.big = false;
    this.lastDir = dir || 2;
    this.lastRan = +new Date();
    this.getFrame = function(pos, dir, moving) {
        var curTime = +new Date();
        var update = (curTime - this.lastRan) >= anim.timePerFrame;
        var frame = 0;
        if(dir !== this.lastDir) {
            this.state = 0;
            this.lastDir = dir;
        } else if(moving) {
            if(update) {
                this.state = (this.state + 1) % 4;
                this.lastRan = curTime;
            }
            frame = 1 + ((this.state === 3) ? 1 : this.state);
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

var anim = { fps: 6 };
anim.timePerFrame = 1000 / anim.fps;
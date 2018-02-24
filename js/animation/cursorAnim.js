function Cursor(initX, initY, initWidth, initHeight, initType, initLayer) {
    const frameMax = (initType === "xcursor" ? 1 : 2);
    let x = initX, y = initY, w = initWidth, h = initHeight;
    let type = initType, layer = initLayer;
    let frame = 0;
    this.SetType = newType => type = newType;
    this.Move = (newX, newY) => { x = newX; y = newY };
    this.Resize = (newW, newH) => { w = newW; h = newH };
    this.Animate = function(advanceFrame) {
        gfx.DrawCursor(x, y, w, h, type, frame, layer);
        if(advanceFrame) { frame = (frame + 1) % frameMax; }
    };
}
function CursorAnimSet(cursorArray, autoStart) {
    let cursors = {}, animIdx = -1;
    cursorArray.forEach(e => cursors[e.key] = new Cursor(e.x, e.y, e.w, e.h, e.type, e.layer));
    let layers = [...new Set(cursorArray.map(e => e.layer))]; // gets only distinct layers
    this.ReTypeCursor = (key, type) => cursors[key].SetType(type);
    this.MoveCursor = (key, x, y) => cursors[key].Move(x, y);
    this.ResizeCursor = (key, w, h) => cursors[key].Resize(x, y);
    this.RedimCursor = (key, x, y, w, h) => { cursors[key].Move(x, y); cursors[key].Resize(w, h); };
    let timeElapsed = 0;
    const Animate = function() {
        gfx.clearSome(layers);
        let changeFrame = false;
        if(++timeElapsed >= 35) { timeElapsed = 0; changeFrame = true; }
        for(const key in cursors) { cursors[key].Animate(changeFrame); }
    }
    this.Start = function() {
        if(animIdx >= 0) { return; }
        animIdx = setInterval(Animate, 10);
        Animate();
    }
    this.Stop = function() {
        if(animIdx < 0) { return; }
        clearInterval(animIdx);
        gfx.clearSome(layers);
        animIdx = -1;
    };
    this.Perish = function() { this.Stop(); cursors = {}; layers = []; };
    if(autoStart) { this.Start(); }
}
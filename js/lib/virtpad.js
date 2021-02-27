const vi = {
    app: null, 
    dpad: null, action: null, cancel: null, pause: null,
    btn: {}, ddown: 0, lastDirs: [], dpadstart: null,
    setup: function() {
        const plr = vi.app.loader.resources;
        vi.dpad = new PIXI.Sprite(plr["js/lib/gamepad/dpad.png"].texture);
        vi.action = new PIXI.Sprite(plr["js/lib/gamepad/action.png"].texture);
        vi.cancel = new PIXI.Sprite(plr["js/lib/gamepad/cancel.png"].texture);
        vi.pause = new PIXI.Sprite(plr["js/lib/gamepad/pause.png"].texture);
        
        vi.redim(vi.dpad, 40, 100, 3.5);
        vi.redim(vi.action, 550, 160, 3.25);
        vi.redim(vi.cancel, 780, 50, 2.5);
        vi.redim(vi.pause, 420, 600, 2);
        
        vi.down = function(key) {
            vi.btn[key] = +new Date();
            input.keyDown(new KeyboardEvent("keydown", {"key": key }));
            console.log("down");
        }
        vi.up = function(key) {
            const n = +new Date(), delta = n - vi.btn[key];
            if(delta < 200) {
                input.justPressed[key] = 0;
                input.keyPress(new KeyboardEvent("keyup", {"key": key }));
                console.log("tap");
            }
            input.keyUp(new KeyboardEvent("keyup", {"key": key }));
            console.log("up");
        }

        vi.action.on("pointerdown", function() { vi.down(player.controls.confirm); });
        vi.action.on("pointerup", function() { vi.up(player.controls.confirm); });
        vi.action.on("pointerupoutside", function() { vi.up(player.controls.confirm); });

        vi.cancel.on("pointerdown", function() { vi.down(player.controls.cancel); });
        vi.cancel.on("pointerup", function() { vi.up(player.controls.cancel); });
        vi.cancel.on("pointerupoutside", function() { vi.up(player.controls.cancel); });

        vi.pause.on("pointerdown", function() { vi.down(player.controls.pause); });
        vi.pause.on("pointerup", function() { vi.up(player.controls.pause); });
        vi.pause.on("pointerupoutside", function() { vi.up(player.controls.pause); });

        vi.dpad.on("pointerdown", function(e) {
            vi.ddown = -1;//game.currentInputHandler.freeMovement ? setInterval(vi.UpdateDPad, 100) : -1;//setInterval(vi.UpdateDPad, 100);
            vi.dpadstart = +new Date();
            vi.GetPositionInDirPad(e);
            vi.UpdateDPad("down");
        });
        vi.dpad.on("pointermove", function(e) {
            if(!vi.ddown) { return; }
            vi.GetPositionInDirPad(e, true);
            vi.UpdateDPad("down");
        });
        vi.dpad.on("pointerup", function(e) {
            if(vi.ddown > 0) { clearInterval(vi.ddown); }
            vi.ddown = 0;
            vi.dpad.texture = plr["js/lib/gamepad/dpad.png"].texture;
            vi.UpdateDPad("up");
        });
        vi.dpad.on("pointerupoutside", function(e) {
            if(vi.ddown > 0) { clearInterval(vi.ddown); }
            vi.ddown = 0;
            vi.dpad.texture = plr["js/lib/gamepad/dpad.png"].texture;
            vi.UpdateDPad("up");
        });

        vi.app.stage.addChild(vi.dpad);
        vi.app.stage.addChild(vi.action);
        vi.app.stage.addChild(vi.cancel);
        vi.app.stage.addChild(vi.pause);
    },
    UpdateDPad(action) {
        for(let i = 0; i < vi.lastDirs.length; i++) {
            if(action==="down") {
                input.keyDown(vi.Key("keydown", vi.lastDirs[i]));
            } else if(action==="up") {
                input.keyUp(vi.Key("keyup", vi.lastDirs[i]));
                const dx = +new Date() - vi.dpadstart;
                if(dx < 200) {
                    input.keyPress(vi.Key("keyup", vi.lastDirs[i]));
                }
            }
        }
    }, 
    Key: function(t, k) { return new KeyboardEvent(t, {"key": k }); },
    GetPositionInDirPad(e, allowOutOfBounds) {
        const plr = vi.app.loader.resources;

        const c = e.data.global;
        const dp = vi.dpad;
        const left = dp.x, right = left + dp.width;
        const top = dp.y, bottom = top + dp.height;
        if(!allowOutOfBounds && (c.x < left || c.x > right || c.y < top || c.y > bottom)) {
            dp.texture = plr["js/lib/gamepad/dpad.png"].texture;
            return;
        }
        const ix = c.x - left, iy = c.y - top;
        const px = ix / dp.width, py = iy / dp.height;
        const w = py < 0.3333 ? "w" : "", a = px < 0.3333 ? "a" : "", s = py > 0.6667 ? "s" : "", d = px > 0.6667 ? "d" : "";

        const oldLastDirs = vi.lastDirs;
        vi.lastDirs = [];
        if(w) { vi.lastDirs.push(player.controls.up); } else if(oldLastDirs.indexOf(player.controls.up)) { input.keyUp(vi.Key("keyup", player.controls.up)); }
        if(a) { vi.lastDirs.push(player.controls.left); } else if(oldLastDirs.indexOf(player.controls.left)) { input.keyUp(vi.Key("keyup", player.controls.left)); }
        if(s) { vi.lastDirs.push(player.controls.down); } else if(oldLastDirs.indexOf(player.controls.up)) { input.keyUp(vi.Key("keyup", player.controls.down)); }
        if(d) { vi.lastDirs.push(player.controls.right); } else if(oldLastDirs.indexOf(player.controls.up)) { input.keyUp(vi.Key("keyup", player.controls.right)); }

        dp.texture = plr[`js/lib/gamepad/dpad${w}${a}${s}${d}.png`].texture;
    },
    redim: function(o, x, y, s) {
        s = s || 1;
        o.x = x;
        o.y = y;
        o.scale.x = s;
        o.scale.y = s;
        o.interactive = true;
    }
};
document.addEventListener("DOMContentLoaded", function() {
    const app = new PIXI.Application({
        width: 1024,
        height: 800,
        backgroundAlpha: 0
    });
    app.view.id = "gamepad";
    document.body.appendChild(app.view);

    vi.app = app;

    app.loader.add([
        "js/lib/gamepad/action.png",
        "js/lib/gamepad/cancel.png",
        "js/lib/gamepad/pause.png",
        "js/lib/gamepad/dpad.png",
        "js/lib/gamepad/dpadw.png",
        "js/lib/gamepad/dpadwa.png",
        "js/lib/gamepad/dpadwd.png",
        "js/lib/gamepad/dpada.png",
        "js/lib/gamepad/dpadas.png",
        "js/lib/gamepad/dpads.png",
        "js/lib/gamepad/dpadsd.png",
        "js/lib/gamepad/dpadd.png"
    ]).load(vi.setup);
});
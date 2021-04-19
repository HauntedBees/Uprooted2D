const vi = {
    app: null, 
    dpad: null, action: null, cancel: null, pause: null, // sprites
    optSave: null, optReset: null, optCancel: null, optDefault: null, optInfo: null,
    scaleX: null, scaleY: null, move: null, scaleD: null, // textures
    btn: {}, ddown: 0, lastDirs: [], dpadstart: null,
    resizeOptions: {},
    defaultSettings: {
        portrait: {
            dpad: { x: 40, y: 1010, scalex: 3.5, scaley: 3.5 },
            action: { x: 550, y: 1070, scalex: 3.25, scaley: 3.25 },
            cancel: { x: 780, y: 960, scalex: 2.5, scaley: 2.5 },
            pause: { x: 420, y: 1510, scalex: 2, scaley: 2 },
        },
        landscape: {
            dpad: { x: 0, y: 115, scalex: 1.6, scaley: 1.6 },
            action: { x: 530, y: 80, scalex: 1.4, scaley: 1.4 },
            cancel: { x: 540, y: 230, scalex: 1, scaley: 1 },
            pause: { x: 10, y: 3, scalex: 1, scaley: 1 },
        }
    },
    settings: {},
    loaded: false,
    setup: function() {
        const savedSettings = localStorage.getItem("gamepad2");
        if(savedSettings) {
            vi.settings = JSON.parse(savedSettings);
        } else {
            vi.settings = JSON.parse(JSON.stringify(vi.defaultSettings));
        }

        vi.loaded = true;
        const curSettings = Mobile.IsLandscape() ? vi.settings.landscape : vi.settings.portrait;

        const plr = vi.app.loader.resources;
        vi.dpad = new PIXI.Sprite(plr["js/gamepad/dpad.png"].texture);
        vi.action = new PIXI.Sprite(plr["js/gamepad/action.png"].texture);
        vi.cancel = new PIXI.Sprite(plr["js/gamepad/cancel.png"].texture);
        vi.pause = new PIXI.Sprite(plr["js/gamepad/pause.png"].texture);

        vi.optSave = new PIXI.Sprite(plr["js/gamepad/save.png"].texture);
        vi.optSave.x = 50;
        vi.optSave.on("pointertap", function() {
            ["dpad", "action", "cancel", "pause"].forEach(b => {
                curSettings[b].x = vi[b].x;
                curSettings[b].y = vi[b].y;
                curSettings[b].scalex = vi[b].scale.x;
                curSettings[b].scaley = vi[b].scale.y;
            });
            localStorage.setItem("gamepad2", JSON.stringify(vi.settings));
            vi.ExitOptions();
        });

        vi.optReset = new PIXI.Sprite(plr["js/gamepad/reset.png"].texture);
        vi.optReset.x = 300;
        vi.optReset.on("pointertap", function() {
            vi.redim(vi.dpad, curSettings.dpad);
            vi.redim(vi.action, curSettings.action);
            vi.redim(vi.cancel, curSettings.cancel);
            vi.redim(vi.pause, curSettings.pause);
            vi.RedimOptionButtons("dpad");
            vi.RedimOptionButtons("action");
            vi.RedimOptionButtons("cancel");
            vi.RedimOptionButtons("pause");
        });

        vi.optDefault = new PIXI.Sprite(plr["js/gamepad/resetdefault.png"].texture);
        vi.optDefault.x = 550;
        vi.optDefault.on("pointertap", function() {
            const defaultSettings = Mobile.IsLandscape() ? vi.settings.landscape : vi.settings.portrait;
            i.RepositionButtons(defaultSettings);
            vi.RedimOptionButtons("dpad");
            vi.RedimOptionButtons("action");
            vi.RedimOptionButtons("cancel");
            vi.RedimOptionButtons("pause");
        });

        vi.optCancel = new PIXI.Sprite(plr["js/gamepad/cancelopt.png"].texture);
        vi.optCancel.x = 800;
        vi.optCancel.on("pointertap", function() {
            vi.RepositionButtons(curSettings);
            vi.ExitOptions();
        });
        
        [vi.optSave, vi.optReset, vi.optCancel, vi.optDefault].forEach(e => { 
            e.y = 685;
            e.interactive = true;
        });

        vi.optInfo = new PIXI.Sprite(plr["js/gamepad/info.png"].texture);
        vi.optInfo.y = 1;

        vi.scaleX = plr["js/gamepad/dragH.png"].texture;
        vi.scaleY = plr["js/gamepad/dragV.png"].texture;
        vi.scaleD = plr["js/gamepad/dragD.png"].texture;
        vi.move = plr["js/gamepad/move.png"].texture;
        
        vi.RepositionButtons(curSettings);
        
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

        vi.app.stage.addChild(vi.dpad);
        vi.app.stage.addChild(vi.action);
        vi.app.stage.addChild(vi.cancel);
        vi.app.stage.addChild(vi.pause);

        vi.SetUpGameplayButtons();
    },
    SwitchMode(landscape) {
        vi.RepositionButtons(landscape ? vi.settings.landscape : vi.settings.portrait);
        vi.ExitOptions();
    },
    RepositionButtons(curSettings) {
        if(!vi.loaded) { return; }
        vi.redim(vi.dpad, curSettings.dpad);
        vi.redim(vi.action, curSettings.action);
        vi.redim(vi.cancel, curSettings.cancel);
        vi.redim(vi.pause, curSettings.pause);
    },
    ResetGameplayButtons() {
        [vi.action, vi.cancel, vi.pause, vi.dpad].forEach(e => {
            e.off("pointerdown");
            e.off("pointerup");
            e.off("pointerupoutside");
            e.off("pointermove");
        });
    },
    RedimOptionButtons(key) {
        const obj = vi[key];
        const info = vi.resizeOptions[key];

        info.sX.x = obj.x + obj.width - info.sX.width / 2;
        info.sX.y = obj.y + obj.height / 2 - info.sX.height / 2;

        info.sY.x = obj.x + obj.width / 2 - info.sY.width / 2;
        info.sY.y = obj.y + obj.height - info.sY.height / 2;

        info.sD.x = obj.x + obj.width - info.sD.width / 1.4;
        info.sD.y = obj.y + obj.height - info.sD.height / 1.4;
        
        info.move.x = obj.x + obj.width / 2 - info.move.width / 2;
        info.move.y = obj.y + obj.height / 2 - info.move.height / 2;
    },
    AddResizeOptions(key) {
        const obj = vi[key];
        if(!vi.resizeOptions[key]) { vi.resizeOptions[key] = {}; }
        const info = vi.resizeOptions[key];
        let initialW = obj.width, initialH = obj.height, initialX = obj.x, initialY = obj.y;

        const resizeX = new PIXI.Sprite(vi.scaleX);
        info.sX = resizeX;
        resizeX.interactive = true;
        vi.app.stage.addChild(resizeX);
        resizeX.on("pointerdown", function(e) { resizeX.initialDown = e.data.global.x; });
        resizeX.on("pointermove", function(e) {
            if(!resizeX.initialDown) { return; }
            const dx = e.data.global.x - resizeX.initialDown;
            if((initialW + dx) < 10) { return; }
            obj.width = initialW + dx;
            vi.RedimOptionButtons(key);
        });
        resizeX.on("pointerup", function() { delete resizeX.initialDown; initialW = obj.width; });
        resizeX.on("pointerupoutside", function() { delete resizeX.initialDown; initialW = obj.width; });

        const resizeY = new PIXI.Sprite(vi.scaleY);
        info.sY = resizeY;
        resizeY.interactive = true;
        vi.app.stage.addChild(resizeY);
        resizeY.on("pointerdown", function(e) { resizeY.initialDown = e.data.global.y; });
        resizeY.on("pointermove", function(e) {
            if(!resizeY.initialDown) { return; }
            const dy = e.data.global.y - resizeY.initialDown;
            if((initialH + dy) < 10) { return; }
            obj.height = initialH + dy;
            vi.RedimOptionButtons(key);
        });
        resizeY.on("pointerup", function() { delete resizeY.initialDown; initialH = obj.height; });
        resizeY.on("pointerupoutside", function() { delete resizeY.initialDown; initialH = obj.height; });

        const resizeD = new PIXI.Sprite(vi.scaleD);
        info.sD = resizeD;
        resizeD.interactive = true;
        vi.app.stage.addChild(resizeD);
        resizeD.on("pointerdown", function(e) { resizeD.initialDown = { x: e.data.global.x, y: e.data.global.y }; });
        resizeD.on("pointermove", function(e) {
            if(!resizeD.initialDown) { return; }
            const dx = e.data.global.x - resizeD.initialDown.x;
            const dy = e.data.global.y - resizeD.initialDown.y;
            if((initialW + dx) >= 10) { obj.width = initialW + dx; }
            if((initialH + dy) >= 10) { obj.height = initialH + dy; }
            vi.RedimOptionButtons(key);
        });
        resizeD.on("pointerup", function() { delete resizeD.initialDown; initialH = obj.height; initialW = obj.width; });
        resizeD.on("pointerupoutside", function() { delete resizeD.initialDown; initialH = obj.height; initialW = obj.width; });

        const move = new PIXI.Sprite(vi.move);
        info.move = move;
        move.interactive = true;
        vi.app.stage.addChild(move);
        move.on("pointerdown", function(e) { move.initialDown = { x: e.data.global.x, y: e.data.global.y }; });
        move.on("pointermove", function(e) {
            if(!move.initialDown) { return; }
            const dx = e.data.global.x - move.initialDown.x;
            const dy = e.data.global.y - move.initialDown.y;
            obj.x = initialX + dx;
            obj.y = initialY + dy;
            vi.RedimOptionButtons(key);
        });
        move.on("pointerup", function() { delete move.initialDown; initialX = obj.x; initialY = obj.y; });
        move.on("pointerupoutside", function() { delete move.initialDown; initialX = obj.x; initialY = obj.y; });

        vi.RedimOptionButtons(key);
    },
    SetUpResizeButtons() {
        vi.ResetGameplayButtons();
        vi.AddResizeOptions("dpad");
        vi.AddResizeOptions("action");
        vi.AddResizeOptions("cancel");
        vi.AddResizeOptions("pause");

        vi.app.stage.addChild(vi.optInfo);
        vi.app.stage.addChild(vi.optSave);
        vi.app.stage.addChild(vi.optReset);
        vi.app.stage.addChild(vi.optCancel);
        vi.app.stage.addChild(vi.optDefault);

        if(Mobile.IsLandscape()) {
            const scale = screen.availHeight / vi.optInfo.texture.height;
            vi.optInfo.scale.y = scale;
            vi.optInfo.scale.x = scale;
            vi.optInfo.x = screen.availWidth / 2 - vi.optInfo.width / 2;
            [vi.optSave, vi.optReset, vi.optCancel, vi.optDefault].forEach((e, i) => { 
                e.scale.x = 0.5;
                e.scale.y = 0.5;
                e.x = 50 + 150 * i;
                e.y = screen.availHeight - e.height - 10;
            });
        } else if(vi.optInfo.scale.y < 1) {
            vi.optInfo.scale.y = 1;
            vi.optInfo.scale.x = 1;
            vi.optInfo.x = 0;
            [vi.optSave, vi.optReset, vi.optCancel, vi.optDefault].forEach((e, i) => {
                e.scale.x = 1;
                e.scale.y = 1;
                e.x = 50 + 250 * i;
                e.y = 685;
            });
        }
    },
    ExitOptions() {
        if(!vi.loaded) { return; }
        [vi.optInfo, vi.optReset, vi.optCancel, vi.optSave, vi.optDefault].forEach(e => vi.app.stage.removeChild(e));
        const events = ["pointerup", "pointerupoutside", "pointerdown", "pointermove"];
        for(const key in vi.resizeOptions) {
            const data = vi.resizeOptions[key];
            [data.sX, data.sY, data.sD, data.move].forEach(e => {
                events.forEach(ev => e.off(ev));
                vi.app.stage.removeChild(e);
            });
            delete vi.resizeOptions[key];
        }
        vi.SetUpGameplayButtons();
    },
    SetUpGameplayButtons() {
        vi.ResetGameplayButtons();
        
        const plr = vi.app.loader.resources;
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
            vi.dpad.texture = plr["js/gamepad/dpad.png"].texture;
            vi.UpdateDPad("up");
        });
        vi.dpad.on("pointerupoutside", function(e) {
            if(vi.ddown > 0) { clearInterval(vi.ddown); }
            vi.ddown = 0;
            vi.dpad.texture = plr["js/gamepad/dpad.png"].texture;
            vi.UpdateDPad("up");
        });
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
            dp.texture = plr["js/gamepad/dpad.png"].texture;
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

        dp.texture = plr[`js/gamepad/dpad${w}${a}${s}${d}.png`].texture;
    },
    redim: function(obj, settings) {
        obj.x = settings.x;
        obj.y = settings.y;
        obj.scale.x = settings.scalex;
        obj.scale.y = settings.scaley;
        obj.interactive = true;
    }
};
document.addEventListener("DOMContentLoaded", function() {
    const app = new PIXI.Application({
        width: 1024,
        height: 2000,
        backgroundAlpha: 0
    });
    app.view.id = "gamepad";
    document.body.appendChild(app.view);

    vi.app = app;

    app.loader.add([
        "js/gamepad/action.png",
        "js/gamepad/cancel.png",
        "js/gamepad/pause.png",
        "js/gamepad/dpad.png",
        "js/gamepad/dpadw.png",
        "js/gamepad/dpadwa.png",
        "js/gamepad/dpadwd.png",
        "js/gamepad/dpada.png",
        "js/gamepad/dpadas.png",
        "js/gamepad/dpads.png",
        "js/gamepad/dpadsd.png",
        "js/gamepad/dpadd.png",
        "js/gamepad/dragD.png",
        "js/gamepad/dragH.png",
        "js/gamepad/dragV.png",
        "js/gamepad/move.png",
        "js/gamepad/resetdefault.png",
        "js/gamepad/reset.png",
        "js/gamepad/save.png",
        "js/gamepad/cancelopt.png",
        "js/gamepad/info.png"
    ]).load(vi.setup);
});
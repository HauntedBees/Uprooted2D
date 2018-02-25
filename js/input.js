var input = {
    click: function(e) {
        if(game.currentInputHandler.click(p)) { return; }
        const p = input.getMousePos(e);
    },
    moveMouse: function(e) {
        const p = input.getMousePos(e);
        if(game.currentInputHandler.mouseMove(p)) { return; }
    },
    justPressed: {}, keys: {}, mainKey: undefined,
    IsFreshPauseOrConfirmPress: () => (input.justPressed[player.controls.pause] === 0) || (input.justPressed[player.controls.confirm] === 0),
    setMainKey: function(key) {
        if(key === undefined) {
            if(input.keys[player.controls.up] !== undefined) { input.mainKey = 0; }
            else if(input.keys[player.controls.left] !== undefined) { input.mainKey = 1; }
            else if(input.keys[player.controls.down] !== undefined) { input.mainKey = 2; }
            else if(input.keys[player.controls.right] !== undefined) { input.mainKey = 3; }
            else { input.mainKey = undefined; }
        } else if(input.mainKey === undefined) {
            input.mainKey = [player.controls.up, player.controls.left, player.controls.down, player.controls.right].indexOf(key);
        }
    },
    clearAllKeys: function() {
        input.mainKey = undefined;
        for(const key in input.keys) {
            clearInterval(input.keys[key]);
            input.keys[key] = undefined;
        }
    },
    IsIgnoredByKeyPress(key) {
        if(key.indexOf("Arrow") === 0) { return true; }
        if(key[0] === "F" && key.length > 1) { return true; }
        return ["Alt", "Shift", "Control", "CapsLock", "Tab", "Escape", "Backspace", "NumLock",
                "Delete", "End", "PageDown", "PageUp", "Home", "Insert", "ScrollLock", "Pause"].indexOf(key) >= 0;
    },
    keyDown: function(e) {
        input.justPressed[e.key] = input.justPressed[e.key] === undefined ? 0 : input.justPressed[e.key] + 1;
        if([player.controls.up, player.controls.left, player.controls.down, player.controls.right].indexOf(e.key) >= 0 && game.currentInputHandler.freeMovement) {
            input.setMainKey(e.key);
            if(input.keys[e.key] !== undefined) { return; }
            input.keys[e.key] = setInterval(function() {
                game.currentInputHandler.keyPress(e.key);
            }, 50);
        } else if(input.IsIgnoredByKeyPress(e.key)) { game.currentInputHandler.keyPress(e.key); }
    },
    keyUp: function(e) {
        input.justPressed[e.key] = -1;
        if([player.controls.up, player.controls.left, player.controls.down, player.controls.right].indexOf(e.key) >= 0 && game.currentInputHandler.freeMovement) {
            clearInterval(input.keys[e.key]);
            input.keys[e.key] = undefined;
            input.setMainKey();
        }
    },
    keyPress: function(e) {
        if([player.controls.up, player.controls.left, player.controls.down, player.controls.right].indexOf(e.key) >= 0 && game.currentInputHandler.freeMovement) {
            return;
        }
        game.currentInputHandler.keyPress(e.key);
        input.justPressed[e.key]++;
    },
    getMousePos: function(e) {
        const rect = gfx.canvas["menutext"].getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        return {
            x: Math.floor(x / 16 / gfx.scale), 
            y: Math.floor(y / 16 / gfx.scale)
        };
    }
};
var input = {
    click: function(e) {
        var p = input.getMousePos(e);
        if(game.currentInputHandler.click(p)) { return; }
    },
    moveMouse: function(e) {
        var p = input.getMousePos(e);
        if(game.currentInputHandler.mouseMove(p)) { return; }
    },

    keys: {}, mainKey: undefined,
    setMainKey: function(key) {
        if(key === undefined) {
            if(input.keys["w"] !== undefined) { input.mainKey = 0; }
            else if(input.keys["a"] !== undefined) { input.mainKey = 1; }
            else if(input.keys["s"] !== undefined) { input.mainKey = 2; }
            else if(input.keys["d"] !== undefined) { input.mainKey = 3; }
            else { input.mainKey = undefined; }
        } else if(input.mainKey === undefined) {
            input.mainKey = ["w", "a", "s", "d"].indexOf(key);
        }
    },
    clearAllKeys: function() {
        for(var key in input.keys) {
            clearInterval(input.keys[key]);
            input.keys[key] = undefined;
        }
    },
    keyDown: function(e) {
        if(["w", "a", "s", "d"].indexOf(e.key) >= 0 && game.currentInputHandler.freeMovement) {
            input.setMainKey(e.key);
            if(input.keys[e.key] !== undefined) { return; }
            input.keys[e.key] = setInterval(function() {
                game.currentInputHandler.keyPress(e.key);
            }, 50);
        }
    },
    keyUp: function(e) {
        if(["w", "a", "s", "d"].indexOf(e.key) >= 0 && game.currentInputHandler.freeMovement) {
            clearInterval(input.keys[e.key]);
            input.keys[e.key] = undefined;
            input.setMainKey();
        }
    },
    keyPress: function(e) {
        if(["w", "a", "s", "d"].indexOf(e.key) >= 0 && game.currentInputHandler.freeMovement) {
            return;
        }
        game.currentInputHandler.keyPress(e.key);
    },
    getMousePos: function(e) {
        var rect = gfx.canvas["menutext"].getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        return {
            x: Math.floor(x / 16 / gfx.scale), 
            y: Math.floor(y / 16 / gfx.scale)
        };
    }
};
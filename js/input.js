let gpVals = {
    triggerMin: 0.5,
    deadZones: [0.25, 0.25, 0.25, 0.25]
};
let input = {
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
    },
    gamepads: {}, gamepadQueryIdx: -1,
    gamepadButtons: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // buttons 0 - 15
        0, 0, 0, 0, // negative axes Lx Ly Rx Ry
        0, 0, 0, 0], // positive axes Lx Ly Rx Ry
    gamepadConnected: function(e) {
        input.gamepads[e.gamepad.index] = e.gamepad;
        console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.", e.gamepad.index, e.gamepad.id, e.gamepad.buttons.length, e.gamepad.axes.length);
        input.gamepadQueryIdx = setInterval(input.QueryGamepads, 10);
    },
    gamepadDisconnected: function(e) {
        delete input.gamepads[e.gamepad.index];
        let hasKeys = false;
        for(const key in input.gamepads) { hasKeys = true; }
        if(!hasKeys) {
            clearInterval(input.gamepadQueryIdx);
            input.gamepadQueryIdx = -1;
        }
    },
    QueryGamepads: function() {
        const gamepads = navigator.getGamepads();
        if(gamepads === undefined || gamepads === null) { return; }
        const buttonsDown = [];
        for(const gp in gamepads) {
            if(gamepads[gp] === null || gamepads[gp].id === undefined) { continue; }
            gamepads[gp].buttons.forEach((e, i) => {
                if(e.pressed && e.value >= gpVals.triggerMin && i < 16) { buttonsDown.push(i); }
            });
            gamepads[gp].axes.forEach((e, i) => {
                if(e <= -gpVals.deadZones[i]) {
                    buttonsDown.push(16 + i);
                } else if(e >= gpVals.deadZones[i]) {
                    buttonsDown.push(20 + i);
                }
            });
        }
        for(let i = 0; i < input.gamepadButtons.length; i++) {
            const prevState = input.gamepadButtons[i];
            const btn = (i < 16) ? ("Gamepad" + i) : ("GamepadA" + (i - 16));
            if(buttonsDown.indexOf(i) < 0 && buttonsDown.indexOf(-i) < 0) { // not pressed
                if(prevState > 0) { // just released
                    input.gamepadButtons[i] = -1;
                    input.justPressed[btn] = -1;
                    if([player.controls.up, player.controls.left, player.controls.down, player.controls.right].indexOf(btn) >= 0 && game.currentInputHandler.freeMovement) {
                        clearInterval(input.keys[btn]);
                        input.keys[btn] = undefined;
                        input.setMainKey();
                    }
                } else { input.gamepadButtons[i] = 0; } // not pressed
            } else { // pressed
                input.gamepadButtons[i]++;
                const btnVal = input.gamepadButtons[i];
                if(btnVal === 1 || (btnVal >= 45 && btnVal % 15 === 0)) {
                    input.justPressed[btn] = input.justPressed[btn] === undefined ? 0 : input.justPressed[btn] + 1;
                    if([player.controls.up, player.controls.left, player.controls.down, player.controls.right].indexOf(btn) >= 0 && game.currentInputHandler.freeMovement) {
                        input.setMainKey(btn);
                        if(input.keys[btn] !== undefined) { return; }
                        input.keys[btn] = setInterval(function() {
                            game.currentInputHandler.keyPress(btn);
                        }, 50);
                    } else { game.currentInputHandler.keyPress(btn); }
                }
            }
        }
    }
};
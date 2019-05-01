let gpVals = {
    triggerMin: 0.5,
    deadZones: [0.25, 0.25, 0.25, 0.25]
};
let speaker = {
    voices: [], timeout: null, lastSpeaker: null, playerVoice: null, attempts: 0, failed: false, voiceMap: {},
    Init: function() {
        speaker.voices = speechSynthesis.getVoices();
        if(speaker.voices.length === 0) {
            if(++speaker.attempts > 20) {
                console.log("Couldn't find any voices!");
                speaker.failed = true;
                return;
            }
            setTimeout(speaker.Init, 100);
            return;
        }
        const eng = speaker.voices.filter(e => e.lang.indexOf("en") === 0);
        if(eng.length > 0) { speaker.voices = eng; }
        
        speaker.playerVoice = speaker.TryGetVoice("Zira");
        if(speaker.playerVoice === null) { speaker.playerVoice = speaker.TryGetVoice("Hazel"); }
        if(speaker.playerVoice === null) { speaker.playerVoice = speaker.TryGetVoice("Female"); }
        if(speaker.playerVoice === null) { speaker.playerVoice = speaker.voices[0]; }
    },
    TryGetVoice: function(key) {
        for(let i = 0; i < speaker.voices.length; i++) {
            if(speaker.voices[i].name.indexOf(key) >= 0) { return speaker.voices[i]; }
        }
        return null;
    },
    GetVoice: function(s) {
        if(speaker.voiceMap[s] !== undefined) { return speaker.voiceMap[s]; }
        if(s === "" || s === null || s === undefined) { return speaker.playerVoice; }
        const v = s.split("").map(e => e.charCodeAt(0)).reduce((a, c) => a + c) % speaker.voices.length;
        speaker.voiceMap[s] = speaker.voices[v];
        return speaker.voiceMap[s];
    },
    SayThing: function(t, isDialogue) {
        if(speaker.failed) { return; }
        if(speaker.timeout !== null) { clearTimeout(speaker.timeout); }
        const wasSpeaking = speechSynthesis.speaking;
        if(wasSpeaking) { speechSynthesis.cancel(); }
        if(isDialogue) {
            if(speaker.lastSpeaker !== null && t.indexOf(speaker.lastSpeaker) === 0) {
                t = t.replace(speaker.lastSpeaker, "");
            } else {
                if(t.indexOf(": ") > 0) { speaker.lastSpeaker = t.substring(0, t.indexOf(": ") + 2); }
                else { t.lastSpeaker = null; }
                t = t.replace(": ", " says, ");
            }
        }
        t = t.replace(/Food2/g, "Food Two").replace(/ emo /g, " eemo ").replace(/\?\?\?/g, "unknown").replace(/Iii/g, "E");
        const phrase = new SpeechSynthesisUtterance(t);
        phrase.voice = speaker.GetVoice(speaker.lastSpeaker);
        if(wasSpeaking) {
            speaker.timeout = setTimeout(() => { speechSynthesis.speak(phrase); speaker.timeout = null; }, 500);
        } else {
            speechSynthesis.speak(phrase);
        }
    }
};
let consoleCmd = {
    Process: function(str) {
        const args = str.split(" ");
        const cmd = args.shift();
        switch(cmd) {
            case "iii": player.hasFalcon = true; return;
            case "ni": player.hasFalcon = false; return;
            case "levelup": player.levelUp(); return;
            case "setmonies": return consoleCmd.SetPlayerInt("monies", args);
            case "setatk": return consoleCmd.SetPlayerInt("atk", args);
            case "setdef": return consoleCmd.SetPlayerInt("def", args);
            case "sethealth": return consoleCmd.SetPlayerInt("health", args);
            case "setmaxhealth": {
                consoleCmd.SetPlayerInt("health", args);
                return consoleCmd.SetPlayerInt("maxhealth", args);
            }
            case "setluck": {
                const v = parseFloat(args[0]);
                if(!isNaN(v)) { player.luck = v; }
                return;
            }
            case "noclip": {
                if(args.length === 0) { return; }
                if(args[0] === "on") {
                    worldmap.noClip = true;
                } else if(args[0] === "off") {
                    worldmap.noClip = false;
                }
                return;
            }
            case "get": {
                if(args.length !== 2) { return; }
                const amount = parseInt(args[0]);
                if(isNaN(amount)) { return; }
                const item = args[1];
                if((GetCrop(item) || GetFarmInfo(item) || GetEquipment(item) || false) === false) { return; }
                player.increaseItem(item, amount);
                return;
            }
            case "fight": {
                if(args.length === 0) { return; }
                for(let i = 0; i < args.length; i++) {
                    if((GetEnemy(args[i]) || false) === false) { return; }
                }
                return combat.startBattle(args);
            }
            case "nocutscene": {
                if(args.length === 0) { return; }
                if(args[0] === "on") {
                    worldmap.ignoreAutoplay = true;
                } else if(args[0] === "off") {
                    worldmap.ignoreAutoplay = false;
                }
                return;
            }
            case "goto": {
                if(args.length === 0) { return; }
                let pathTo = null;
                switch(args[0]) {
                    case "farmintro": pathTo = { init: { x: 17,  y: 9 }, map: "farm" }; break;
                    case "farm": pathTo = { init: { x:  12,  y: 4 }, map: "farm" }; break;
                    case "village": pathTo = { init: { x: 19, y: 5}, map: "firstvillage" }; break;
                    case "drjeff": pathTo = { init: { x: 7, y: 2 }, map: "researchfacility", playerDir: 0 }; break;
                    case "bridge": pathTo = { init: { x: 27, y: 5 }, map: "bridge" }; break;
                    case "fakefarmopen": pathTo = { init: { x: 24.75, y: 35.5 }, map: "fakefarm", stayBlack: true, playerDir: 0 }; break;
                    case "fakefarm": pathTo = { init: { x: 24.75, y: 35.5 }, map: "fakefarm" }; break;
                    case "southcity": pathTo = { init: { x: 44, y: 44 }, map: "southcity" }; break;
                    case "northcity": pathTo = { init: { x: 25, y: 44 }, map: GetPostGameMapName("northcity") }; break;
                    case "hq": pathTo = { init: { x: 12, y: 10 }, map: "hq_4" }; break;
                    case "hqend": pathTo = { init: { x: 8, y: 51 }, map: "hq_5" }; break;
                    case "cave": pathTo = { init: { x: 3, y: 3 }, map: "cave", floor: 0 }; break;
                }
                if(pathTo === null) { return; }
                return game.transition(game.currentInputHandler, worldmap, pathTo);
            }
            case "unsafe": return eval(args.join(" "));
        }
    },
    SetPlayerInt: function(prop, args) {
        const v = parseInt(args[0]);
        if(!isNaN(v)) { player[prop] = v; }
    }
};
let input = {
    inConsole: false, flickerIdx: -1, consoleString: "", 
    ConsoleKeyPress: function(key) {
        if(key === "Backspace") {
            input.consoleString = input.consoleString.substring(0, input.consoleString.length - 1);
        } else if(key === "Enter") {
            consoleCmd.Process(input.consoleString);
            input.consoleString = "";
            input.HandleConsole();
        } else {
            input.consoleString += key;
        }
        document.getElementById("consoleText").innerText = input.consoleString.toUpperCase();
    },
    HandleConsole: function() {
        if(!input.inConsole) {
            console.log("WA!");
            input.inConsole = true;
            input.flickerIdx = setInterval(function() {
                const chorp = document.getElementById("chorp");
                chorp.style.display = (chorp.style.display === "") ? "none" : "";
            }, 750);
            document.getElementById("garfield").setAttribute("style", "display: block");
        } else {
            clearInterval(input.flickerIdx);
            input.inConsole = false;
            document.getElementById("garfield").setAttribute("style", "display: none");
        }
    },
    FloorPoint: p => { p.x = Math.floor(p.x); p.y = Math.floor(p.y); },
    click: function(e) {
        if(player.options.ignoreMouse === 1) { return; }
        const p = input.getMousePos(e); console.log(p);
        if(game.currentInputHandler.click(p, true)) { return; }
    },
    moveMouse: function(e) {
        if(player.options.ignoreMouse === 1) { return; }
        const p = input.getMousePos(e);
        if(game.currentInputHandler.mouseMove(p)) { return; }
    },
    getMousePos: function(e) {
        const rect = gfx.canvas["menutext"].getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        return { x: Math.floor(x / 16) / gfx.scale, y: Math.floor(y / 16) / gfx.scale, rawX: x / gfx.scale, rawY: y / gfx.scale };
    },
    onWheel: function(e) {
        if(player.options.ignoreMouse === 1) { return; }
        if(e.deltaY === 0) { return; }
        if(game.currentInputHandler.MouseWheel === undefined) { return; }
        game.currentInputHandler.MouseWheel(e.deltaY > 0);
    },

    VirtDirections: [0, 0, 0, 0], // UP LEFT DOWN RIGHT
    GetKeyEvent: key => ({ key: key }),
    ButtonPress: function(b) {
        console.log(b);
    },
    ButtonRelease: function(b) {
        if(b.btn === "dpad") {
            const arr = [player.controls.up, player.controls.left, player.controls.down, player.controls.right];
            for(let i = 0; i < 4; i++) {
                if(input.VirtDirections[i] > 0) {
                    const dS = (+new Date()) - input.VirtDirections[i];
                    if(dS < 100) { input.keyPress(input.GetKeyEvent(arr[i])); }
                    input.keyUp(input.GetKeyEvent(arr[i]));
                    input.VirtDirections[i] = 0;
                }
            }
        } else if(b.btn === "confirm") {
            input.justPressed[player.controls.confirm] = 0;
            input.keyPress(input.GetKeyEvent(player.controls.confirm));
        } else if(b.btn === "cancel") {
            input.justPressed[player.controls.cancel] = 0;
            input.keyPress(input.GetKeyEvent(player.controls.cancel));
        } else if(b.btn === "pause") {
            input.justPressed[player.controls.pause] = 0;
            input.keyPress(input.GetKeyEvent(player.controls.pause));
        }
    },
    ButtonMove: function(b) {
        if(b.btn === "dpad") {
            if(b.y === 1) {
                if(input.VirtDirections[2] === 0) { input.keyDown(input.GetKeyEvent(player.controls.down)); }
                if(input.VirtDirections[0] > 0) { input.VirtDirections[0] = 0; input.keyUp(input.GetKeyEvent(player.controls.up)); }
                input.VirtDirections[2] = +new Date();
            } else if(b.y === -1) {
                if(input.VirtDirections[0] === 0) { input.keyDown(input.GetKeyEvent(player.controls.up)); }
                if(input.VirtDirections[2] > 0) { input.VirtDirections[2] = 0; input.keyUp(input.GetKeyEvent(player.controls.down)); }
                input.VirtDirections[0] = +new Date();
            } else {
                if(input.VirtDirections[2] > 0) { input.VirtDirections[2] = 0; input.keyUp(input.GetKeyEvent(player.controls.down)); }
                if(input.VirtDirections[0] > 0) { input.VirtDirections[0] = 0; input.keyUp(input.GetKeyEvent(player.controls.up)); }
            }
            if(b.x === 1) {
                if(input.VirtDirections[3] === 0) { input.keyDown(input.GetKeyEvent(player.controls.right)); }
                if(input.VirtDirections[1] > 0) { input.VirtDirections[1] = 0; input.keyUp(input.GetKeyEvent(player.controls.left)); }
                input.VirtDirections[3] = +new Date();
            } else if(b.x === -1) {
                if(input.VirtDirections[1] === 0) { input.keyDown(input.GetKeyEvent(player.controls.left)); }
                if(input.VirtDirections[3] > 0) { input.VirtDirections[3] = 0; input.keyUp(input.GetKeyEvent(player.controls.right)); }
                input.VirtDirections[1] = +new Date();
            } else {
                if(input.VirtDirections[3] > 0) { input.VirtDirections[3] = 0; input.keyUp(input.GetKeyEvent(player.controls.right)); }
                if(input.VirtDirections[1] > 0) { input.VirtDirections[1] = 0; input.keyUp(input.GetKeyEvent(player.controls.left)); }
            }
        }
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
    GetKey: e => e.key.length === 1 ? e.key.toLowerCase() : e.key,
    keyDown: function(e) {
        const key = input.GetKey(e);
        if(input.inConsole) { 
            if(key === "Backspace" || key === "Delete") {
                return input.ConsoleKeyPress("Backspace");
            } else { return; }
        }
        input.justPressed[key] = input.justPressed[key] === undefined ? 0 : input.justPressed[key] + 1;
        if(player.options.controltype === 1) { input.SwitchControlType(0); }
        if([player.controls.up, player.controls.left, player.controls.down, player.controls.right].indexOf(key) >= 0 && game.currentInputHandler.freeMovement) {
            if(player.options.stickyMovement === 1) { return; }
            input.setMainKey(key);
            if(input.keys[key] !== undefined) { return; }
            input.keys[key] = setInterval(function() {
                game.currentInputHandler.keyPress(key);
            }, 50);
        } else if(input.IsIgnoredByKeyPress(key)) { game.currentInputHandler.keyPress(key); }
    },
    keyUp: function(e) {
        const key = input.GetKey(e);
        if(input.inConsole) { return; }
        input.justPressed[key] = -1;
        if([player.controls.up, player.controls.left, player.controls.down, player.controls.right].indexOf(key) >= 0 && game.currentInputHandler.freeMovement) {
            if(player.options.stickyMovement === 1) { return; }
            clearInterval(input.keys[key]);
            input.keys[key] = undefined;
            input.setMainKey();
        }
        if(game.currentInputHandler.freeMovement) {
            if(input.keys[player.controls.up] === undefined 
                && input.keys[player.controls.left] === undefined 
                && input.keys[player.controls.right] === undefined 
                && input.keys[player.controls.down] === undefined) {
                    worldmap.refreshMap();
                }
        }
    },
    keyPress: function(e) {
        const key = input.GetKey(e);
        if(key === "`") { return input.HandleConsole(); }
        if(input.inConsole) { return input.ConsoleKeyPress(key); }
        if([player.controls.up, player.controls.left, player.controls.down, player.controls.right].indexOf(key) >= 0 && game.currentInputHandler.freeMovement) {
            if(player.options.stickyMovement === 1) {
                input.StickyKeyPress(key);
            }
            return;
        }
        game.currentInputHandler.keyPress(key);
        input.justPressed[key]++;
    },
    StickyKeyPress: function(key) {
        if(input.keys[key] !== undefined) { // turn off
            clearInterval(input.keys[key]);
            input.keys[key] = undefined;
            input.setMainKey();
        } else { // turn on
            input.mainKey = undefined;
            if(input.keys[player.controls.down] !== undefined && key === player.controls.up) {
                clearInterval(input.keys[player.controls.down]);
                input.keys[player.controls.down] = undefined;
            } else if(input.keys[player.controls.up] !== undefined && key === player.controls.down) {
                clearInterval(input.keys[player.controls.up]);
                input.keys[player.controls.up] = undefined;
            } else if(input.keys[player.controls.left] !== undefined && key === player.controls.right) {
                clearInterval(input.keys[player.controls.left]);
                input.keys[player.controls.left] = undefined;
            } else if(input.keys[player.controls.right] !== undefined && key === player.controls.left) {
                clearInterval(input.keys[player.controls.right]);
                input.keys[player.controls.right] = undefined;
            }
            input.setMainKey(key);
            input.keys[key] = setInterval(function() {
                game.currentInputHandler.keyPress(key);
            }, 50);
        }
    },
    SwitchControlType: function(newType) {
        player.options.controltype = newType;
        switch(newType) {
            case 1: player.controls = player.gamepadcontrols; break;
            case 0: player.controls = player.keyboardcontrols; break;
        }
    },
    gamepads: {}, gamepadQueryIdx: -1,
    gamepadButtons: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // buttons 0 - 15
        0, 0, 0, 0, // negative axes Lx Ly Rx Ry
        0, 0, 0, 0], // positive axes Lx Ly Rx Ry
    gamepadConnected: function(e) {
        input.gamepads[e.gamepad.index] = e.gamepad;
        console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.", e.gamepad.index, e.gamepad.id, e.gamepad.buttons.length, e.gamepad.axes.length);
        input.SwitchControlType(1);
        input.gamepadQueryIdx = setInterval(input.QueryGamepads, 10);
    },
    gamepadDisconnected: function(e) {
        delete input.gamepads[e.gamepad.index];
        let hasKeys = false;
        for(const key in input.gamepads) { hasKeys = true; break; }
        if(!hasKeys) {
            console.log("no controllers left!");
            clearInterval(input.gamepadQueryIdx);
            input.gamepadQueryIdx = -1;
            input.SwitchControlType(0);
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
        if(buttonsDown.length > 0 && player.options.controltype === 0) { input.SwitchControlType(1); }
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
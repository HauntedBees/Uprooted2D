worldmap.optionsMenu = {
    soundNums: ["opOff", "10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"],
    specialPos: -1, cursory: 1, options: [], localOptions: {}, fromPause: false, invalidControls: [],
    headingSize: 36, optionSize: 22, tileSize: 16, optionInfoSize: 12, inChange: false, origFont: 0,
    usingMouse: false, view: 0, views: [0, 15, 20], mouseoffsets: [0, 40, 120], maxView: 1,
    setup: function(fromPause) {
        this.usingMouse = false;
        this.view = 0;
        this.fromPause = fromPause;
        this.localKeyboardControls = Object.assign({}, player.keyboardcontrols);
        this.localGamepadControls = Object.assign({}, player.gamepadcontrols);
        this.localOptions = Object.assign({}, player.options);
        this.options = []; this.cursory = 1; this.inChange = false;
        this.specialPos = -1;
        this.origFont = player.options.font;
        this.invalidControls = [];
        this.RedimOptions();
    },
    GetBadControls: function(controls) {
        const inputsAlreadyUsed = [];
        const letsReverseItIGuess = {};
        for(const key in controls) {
            const val = controls[key];
            if(inputsAlreadyUsed.indexOf(val) >= 0) {
                letsReverseItIGuess[val].push(key);
            } else {
                inputsAlreadyUsed.push(val);
                letsReverseItIGuess[val] = [key];
            }
        }
        this.invalidControls = [];
        for(const key in letsReverseItIGuess) {
            if(letsReverseItIGuess[key].length > 1) {
                this.invalidControls.push(...letsReverseItIGuess[key]);
            }
        }
    },
    RedimOptions: function() {
        this.options = [];
        let y = 0;
        y = this.addHeading(y, "opGameOps");
        y = this.addOption(y, "opDifficulty", this.localOptions.difficulty, "difficulty", ["diffEasy", "diffNormal", "diffHard"], true);
        y = this.addOption(y, "opFont", this.localOptions.font, "font", ["fontStandard", "fontDyslexic"], false);
        y = this.addOption(y, "opGameplay", 0, false, ["opOff"]);
        y = this.addOption(y, "opPottywords", this.localOptions.canSayFuck, "canSayFuck", ["opNo", "opYes"], false);
        y = this.addOption(y, "opStickyControls", this.localOptions.stickyMovement, "stickyMovement", ["opNo", "opYes"], true);
        y = this.addOption(y, "opIgnoreMouse", this.localOptions.ignoreMouse, "ignoreMouse", ["opNo", "opYes"], false);
        y = this.addOption(y, "opVirtualDpad", this.localOptions.virtualController, "virtualController", ["opNo", "opYes"], false);
        if(this.localOptions.virtualController) {
            virtualControls.Show();
            y = this.addVirtualControllerOptions(y, "opVirtualCustom");
        } else {
            virtualControls.Hide();
        }
        y = this.addOption(y, "opControlScheme", this.localOptions.controltype, "controltype", ["opKeyboard", "opGamepad"], true);
        y = this.addHeading(y, "opControls");
        const keysToUse = this.localOptions.controltype === 1 ? this.localGamepadControls : this.localKeyboardControls;
        this.GetBadControls(keysToUse);
        y = this.addButton(y, "ctrlUp", keysToUse.up, "up");
        y = this.addButton(y, "ctrlLeft", keysToUse.left, "left");
        y = this.addButton(y, "ctrlDown", keysToUse.down, "down");
        y = this.addButton(y, "ctrlRight", keysToUse.right, "right");
        y = this.addButton(y, "ctrlConfirm", keysToUse.confirm, "confirm");
        y = this.addButton(y, "ctrlCancel", keysToUse.cancel, "cancel");
        y = this.addButton(y, "ctrlPause", keysToUse.pause, "pause");
        y = this.addHeading(y, "opAudio");
        y = this.addOption(y, "opMusic", this.localOptions.music, "music", worldmap.optionsMenu.soundNums);
        y = this.addOption(y, "opSound", this.localOptions.sound, "sound", worldmap.optionsMenu.soundNums);
        y = this.addHeading(y, "opGraphics");
        y = this.addOption(y, "opResolution", this.localOptions.resolution, "resolution", ["opRes0", "opRes1", "opRes2"]);
        y = this.addOption(y, "opFullScreen", this.localOptions.fullscreen, "fullscreen", ["opNo", "opYes"]);
        y = this.addOption(y, "opFilter", this.localOptions.gfxfilter, "gfxfilter", ["opNone", "opS4X", "opHQ4X"]); //, "opGlitch"]);
        /*y = this.addOption(y, "opPlacehold", 1, false, ["opOff", "opOn"]);*/
        y += 5;
        y = this.addFinal(y, (this.invalidControls.length > 0 ? "opFixControls" : "opSaveQuit"), this.SaveAndQuit);
        y = this.addFinal(y, "opQuit", this.QuitWithoutSaving);
        this.maxView = this.localOptions.controltype === 1 ? 2 : 1;
        this.drawEverything();
    },
    drawEverything: function() {
        gfx.clearAll();
        gfx.TileBackground("optTile");
        const y = this.usingMouse ? this.views[this.view] : (this.options[this.cursory].y + this.optionSize - 4) / 16 - 1.8;
        const acty = (this.options[this.cursory].y + this.optionSize - 4) / 16 - 1.8;
        const yMax = (this.options[this.options.length - 1].y + this.optionSize - 4) / 16 - 1.8;
        let yoffset = 0, tileyoffset = 0;
        if(y > 12.7) {
            tileyoffset = y - 12.5;
            yoffset = 16 * tileyoffset;
        }
        if(yMax > 12.7 && y < this.views[this.maxView]) {
            gfx.drawTileToGrid("opArrDown", 0.5, gfx.tileHeight - 1.25, "menutext");
        }
        if(yoffset > 0) {
            gfx.drawTileToGrid("opArrUp", 0.5, 0.25, "menutext");
        }
        for(let i = 0; i < this.options.length; i++) {
            const op = this.options[i];
            switch(op.type) {
                case "heading":
                    gfx.drawText(op.text, op.x, op.y - yoffset, "#000000", this.headingSize);
                    break;
                case "customvirt":
                    const w = gfx.getTextWidth(op.text, this.optionSize);
                    gfx.drawText(op.text, op.x + (w / 16) + 4, op.y - yoffset, "#000000", this.optionSize);
                    if(this.cursory === i) {
                        gfx.drawTileToGrid("carrotSel", (op.x / 24) + 1, acty - tileyoffset, "menutext");
                    }
                    break;
                case "option":
                    gfx.drawText(op.text, op.x, op.y - yoffset, "#000000", this.optionSize);
                    const opval = op.choices[op.val];
                    const optext =  opval.match(/^\d+%$/) === null ? GetText(opval) : opval;
                    gfx.drawText(optext, op.optx, op.y - yoffset, "#000000", this.optionSize);
                    if(this.cursory === i) {
                        gfx.drawTileToGrid("carrotSel", op.x / 24, acty - tileyoffset, "menutext");
                        gfx.drawTileToGrid((op.val === 0 ? "nopL" : "opL"), (op.optx / 16) - 1, acty - tileyoffset, "menutext");
                        const len = gfx.getTextWidth(optext, this.optionSize);
                        gfx.drawTileToGrid((op.val === (op.choices.length - 1) ? "nopR" : "opR"), (op.optx + len / 4) / 16, acty - tileyoffset, "menutext");
                    }
                    if(op.hasInfo) {
                        const infotext = op.textId === "opControlScheme" ? GetText("opControlNote") : GetText(op.choices[op.val] + ".i");
                        const infox = gfx.getTextFractionX(infotext, this.optionInfoSize);
                        gfx.drawText(infotext, infox, op.y2 - yoffset, "#000000", this.optionInfoSize);
                    }
                    break;
                case "button":
                    gfx.drawText(op.text, op.x, op.y - yoffset, "#000000", this.optionSize);
                    let val = this.formatKeyName(op.val);
                    if(this.cursory === i) { 
                        gfx.drawTileToGrid("carrotSel", op.x / 24, acty - tileyoffset, "menutext");
                        if(this.inChange) { val = "?"; }
                    }
                    if(val.indexOf("Gamepad") === 0) {
                        if(val.indexOf("GamepadA") === 0) {
                            gfx.drawTile(val, op.optx - 4, op.y - yoffset - 8, "menutext");
                        } else {
                            const padId = parseInt(val.replace("Gamepad", ""));
                            gfx.drawTile("GP" + padId, op.optx - 4, op.y - yoffset - 8, "menutext");
                        }
                        if(this.invalidControls.indexOf(op.idx) >= 0) {
                            gfx.drawTile("x", op.optx - 4, op.y - yoffset - 8, "menutext");
                        }
                    } else {
                        const color = this.invalidControls.indexOf(op.idx) >= 0 ? "#FF0000" : "#000000";
                        gfx.drawText(val, op.optx, op.y - yoffset, color, this.optionSize);
                    }
                    break;
                case "final":
                    gfx.drawText(op.text, op.x, op.y - yoffset, "#000000", this.optionSize);
                    if(this.cursory === i) { gfx.drawTileToGrid("carrotSel", op.x / 24, acty - tileyoffset, "menutext"); }
                    break;
            }
        }
    },
    formatKeyName: function(keyName) {
        if(keyName === " ") { return "Space"; }
        if(keyName.length === 1) { return keyName.toUpperCase(); }
        return keyName;
    },
    addHeading: function(y, text) {
        y += 10;
        text = GetText(text);
        this.options.push({
            type: "heading",
            text: text, 
            x: gfx.getTextFractionX(text, this.headingSize),
            y: y
        });
        return y + (this.headingSize / 3.3333);
    },
    addVirtualControllerOptions: function(y, text) {
        y += 5;
        text = GetText(text);
        this.options.push({
            type: "customvirt",
            text: text, 
            x: gfx.getTextFractionX(text, this.headingSize),
            y: y
        });
        return y + (this.headingSize / 3.3333);
    },
    addFinal: function(y, text, action) {
        text = GetText(text);
        this.options.push({
            type: "final",
            text: text, 
            action: action, 
            x: gfx.getTextFractionX(text, this.optionSize),
            y: y
        });
        return y + (this.optionSize / 3.3333);
    },
    addOption: function(y, text, initVal, idx, options, hasInfo) {
        const acttext = GetText(text);
        this.options.push({ 
            type: "option",
            x: gfx.getTextRightAlignedX(acttext, this.optionSize, gfx.canvasWidth / 2) / gfx.scale - 5,
            optx: gfx.canvasWidth / 8 + 5,
            y: y,
            y2: y + (this.optionSize / 3.3333) - 2,
            text: acttext, 
            val: initVal,
            choices: options,
            hasInfo: hasInfo,
            textId: text,
            idx: idx
        });
        return y + (this.optionSize / 3.3333) * (hasInfo ? 2 : 1);
    },
    addButton: function(y, text, initVal, idx) {
        text = GetText(text);
        this.options.push({
            type: "button",
            x: gfx.getTextRightAlignedX(text, this.optionSize, gfx.canvasWidth / 2) / gfx.scale - 5,
            optx: gfx.canvasWidth / 8 + 5,
            y: y,
            text: text, 
            val: initVal,
            idx: idx
        });
        return y + (initVal.indexOf("Gamepad") === 0 ? this.tileSize : (this.optionSize / 3.3333));
    },
    mouseMove: function(pos) {
        this.UpdateMouse(true);
        const y = this.usingMouse ? this.views[this.view] : (this.options[this.cursory].y + this.optionSize - 4) / 16 - 1.8;
        const yMax = (this.options[this.options.length - 1].y + this.optionSize - 4) / 16 - 1.8;
        let yoffset = 0, tileyoffset = 0;
        if(y > 12.7) {
            tileyoffset = y - 12.5;
            yoffset = 16 * tileyoffset;
        }
        const hasDownArrow = (yMax > 12.7 && this.cursory !== (this.options.length - 1));
        const hasUpArrow = (yoffset > 0);
        if(hasDownArrow && Between(pos.x, 0.5, 1.5) && Between(pos.y, 12.5, 13.5)) {
            this.specialPos = 1;
            return true;
        } else if(hasUpArrow && Between(pos.x, 0.5, 1.5) && Between(pos.y, 0.25, 1.25)) {
            this.specialPos = 2;
            return true;
        }
        this.specialPos = -1;
        const actY = pos.rawY + 8 + this.mouseoffsets[this.view];
        if(pos.x > 2.25 && pos.x < 12.5) {
            for(let i = this.options.length - 1; i >= 0; i--) {
                const opt = this.options[i];
                if(opt.type === "heading") { continue; }
                if(actY > opt.y) { return this.CursorMove({ x: 0, y: i }); }
            }
        }
        return false;
    },
    CursorMove: function(pos) {
        if(this.options[this.cursory].type === "option") {
            if(pos.x !== 0) { // option change
                const newOp = this.options[this.cursory].val + pos.x;
                if(this.options[this.cursory].textId === "opControlScheme" && this.invalidControls.length > 0) { return false; }
                const oldVal = this.options[this.cursory].val;
                const newVal = Math.min(Math.max(newOp, 0), this.options[this.cursory].choices.length - 1)
                this.options[this.cursory].val = newVal;
                if(oldVal === newVal) {
                    Sounds.PlaySound("navNok", false, this.localOptions.sound);
                } else {
                    Sounds.PlaySound("navOk", false, this.localOptions.sound);
                }
                if(this.options[this.cursory].idx) {
                    this.localOptions[this.options[this.cursory].idx] = newVal;
                    if(this.options[this.cursory].idx === "font") { player.options.font = newVal; }
                }
                this.RedimOptions();
                return true;
            } else if(pos.y !== this.cursory) {
                return this.moveToNext(pos.y);
            }
        } else if(this.options[this.cursory].type === "button" || this.options[this.cursory].type === "final" || this.options[this.cursory].type === "customvirt") {
            if(this.inChange) {

            } else if(pos.y !== this.cursory) { return this.moveToNext(pos.y); }
        }
        return false;
    },
    moveToNext: function(newY) {
        const dir = newY - this.cursory;
        while(newY >= 0 && newY < this.options.length && this.options[newY].type === "heading") {
            newY += dir;
        }
        if(newY < 0 || newY >= this.options.length) { return false; }
        this.cursory = newY;
        this.drawEverything();
        return true;
    },
    click: function(pos) {
        if(this.specialPos > 0) {
            this.MouseWheel(this.specialPos === 1);
            this.specialPos = -1;
            this.mouseMove(pos);
            return true;
        }
        const opt = this.options[this.cursory];
        if(pos.fromKeyboard) {
            if(opt.type === "final") {
                opt.action();
            } else if(opt.type === "option") {
                this.cursory = this.options.length - 2;
                this.drawEverything();
                return true;
            } else if(opt.type === "button") {
                this.inChange = !this.inChange;
                Sounds.PlaySound(this.inChange ? "navOk" : "navNok", false, this.localOptions.sound);
                this.drawEverything();
                return true;
            }
        } else {
            if(opt.type === "final") {
                opt.action();
            } if(opt.type === "option") {
                const left = (opt.optx / 16) - 1;
                const opval = opt.choices[opt.val];
                const optext =  opval.match(/^\d+%$/) === null ? GetText(opval) : opval;
                const len = gfx.getTextWidth(optext, this.optionSize);
                const right = (opt.optx + len / 4) / 16;
                const middle = (right + left) / 2;
                if(pos.x < middle) { 
                    return this.CursorMove({ x: -1, y: this.cursory });
                } else {
                    return this.CursorMove({ x: 1, y: this.cursory });
                }
            } else if(opt.type === "button") {
                this.inChange = !this.inChange;
                Sounds.PlaySound(this.inChange ? "navOk" : "navNok", false, this.localOptions.sound);
                this.drawEverything();
                return true;
            }
        }
        return true;
    },
    SaveAndQuit: function() {
        if(worldmap.optionsMenu.invalidControls.length > 0) { return false; }
        const oldFilter = player.options.gfxfilter;
        player.keyboardcontrols = Object.assign(player.keyboardcontrols, worldmap.optionsMenu.localKeyboardControls);
        player.gamepadcontrols = Object.assign(player.gamepadcontrols, worldmap.optionsMenu.localGamepadControls);
        player.options = Object.assign(player.options, worldmap.optionsMenu.localOptions);
        input.SwitchControlType(player.options.controltype);
        const newFilter = player.options.gfxfilter;
        if(player.options.virtualController === 1) {
            virtualControls.Show();
        } else {
            virtualControls.Hide();
        }
        if(oldFilter != newFilter) {
            gfx.loadSpriteSheets(player.getSheetPath(), game.sheetsToLoad, worldmap.optionsMenu.ContinueSaveAndQuit);
        } else {
            worldmap.optionsMenu.ContinueSaveAndQuit();
        }
    },
    ContinueSaveAndQuit: function() {
        UpdateStatsForCurrentDifficulty();
        nwHelpers.AdjustScreenSettings();
        Sounds.PlaySound("confirm", true);
        worldmap.optionsMenu.QuitWithoutSaving(true);
    },
    QuitWithoutSaving: function(dontFont) {
        if(!dontFont) { player.options.font = worldmap.optionsMenu.origFont; Sounds.PlaySound("cancel", true); }
        if(worldmap.optionsMenu.fromPause) {
            game.innerTransition(worldmap.optionsMenu, pausemenu, 3);
        } else {
            game.innerTransition(worldmap.optionsMenu, worldmap.title, 2);
        }
        return true;
    },
    SaveNewButton: function(key)  {
        if(key !== "Escape") {
            const newKey = this.options[this.cursory].idx;
            if(this.localOptions.controltype === 0) {
                if(key.indexOf("Gamepad") === 0) { return false; }
                this.localKeyboardControls[newKey] = key;
                this.options[this.cursory].val = key;
            } else {
                if(key.indexOf("Gamepad") < 0) { return false; }
                this.localGamepadControls[newKey] = key;
                this.options[this.cursory].val = key;
            }
            Sounds.PlaySound("navOk", false, this.localOptions.sound);
        } else {
            Sounds.PlaySound("navNok", false, this.localOptions.sound);
        }
        this.inChange = false;
        this.RedimOptions();
    },
    cancel: function() { return this.QuitWithoutSaving(); },
    keyPress: function(key) {
        const pos = { x: 0, y: this.cursory, fromKeyboard: true };
        if(this.inChange) {
            this.SaveNewButton(key);
            return true;
        }
        this.UpdateMouse(false);
        let isEnter = false;
        switch(key) {
            case player.controls.up: pos.y--; break;
            case player.controls.left: pos.x--; break;
            case player.controls.down: pos.y++; break;
            case player.controls.right: pos.x++; break;
            case player.controls.confirm:
            case player.controls.pause: isEnter = true; break;
            case player.controls.cancel: return this.cancel();
        }
        if(pos.y < 0 || pos.y >= this.options.length) { return false; }
        if(isEnter) { return this.click(pos); }
        else { return this.CursorMove(pos); }
    },
    MouseWheel: function(isDown) {
        this.UpdateMouse(true);
        if(isDown) {
            this.view = Math.min(this.view + 1, this.maxView);
        } else {
            this.view = Math.max(this.view - 1, 0);
        }
        this.drawEverything();
    },
    UpdateMouse: function(newMouseCondition) {
        if(!newMouseCondition) {
            this.usingMouse = false;
            return;
        }
        if(this.usingMouse) { return; }
        this.usingMouse = true;
        const y = (this.options[this.cursory].y + this.optionSize - 4) / 16 - 1.8;
        for(let i = 0; i < this.views.length; i++) {
            if(this.views[i] >= y) { continue; }
            this.view = Math.max(0, i - 1);
            return;
        } 
    }
};
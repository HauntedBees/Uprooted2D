worldmap.optionsMenu = {
    cursory: 1, options: [], localOptions: {}, fromPause: false, invalidControls: [],
    headingSize: 36, optionSize: 22, tileSize: 16, optionInfoSize: 12, inChange: false, origFont: 0,
    setup: function(fromPause) {
        this.fromPause = fromPause;
        this.localKeyboardControls = Object.assign({}, player.keyboardcontrols);
        this.localGamepadControls = Object.assign({}, player.gamepadcontrols);
        this.localOptions = Object.assign({}, player.options);
        this.options = []; this.cursory = 1; this.inChange = false;
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
        y = this.addOption(y, "opMusic", this.localOptions.music, "music", ["opOff", "opOn"]);
        y = this.addOption(y, "opSound", this.localOptions.sound, "sound", ["opOff", "opOn"]);
        y = this.addHeading(y, "opGraphics");
        y = this.addOption(y, "opResolution", this.localOptions.resolution, "resolution", ["opRes0", "opRes1", "opRes2"]);
        y = this.addOption(y, "opFullScreen", this.localOptions.fullscreen, "fullscreen", ["opNo", "opYes"]);
        /*y = this.addOption(y, "opPlacehold", 1, false, ["opOff", "opOn"]);*/
        y += 5;
        y = this.addFinal(y, (this.invalidControls.length > 0 ? "opFixControls" : "opSaveQuit"), this.SaveAndQuit);
        y = this.addFinal(y, "opQuit", this.QuitWithoutSaving);
        this.drawEverything();
    },
    drawEverything: function() {
        gfx.clearAll();
        const y = (this.options[this.cursory].y + this.optionSize - 4) / 16 - 1.8;
        let yoffset = 0, tileyoffset = 0;
        if(y > 12.5) {
            tileyoffset = y - 12.5;
            yoffset = 16 * tileyoffset;
        }
        for(let i = 0; i < this.options.length; i++) {
            const op = this.options[i];
            switch(op.type) {
                case "heading":
                    gfx.drawText(op.text, op.x, op.y - yoffset, "#000000", this.headingSize);
                    break;
                case "option":
                    gfx.drawText(op.text, op.x, op.y - yoffset, "#000000", this.optionSize);
                    const optext = GetText(op.choices[op.val]);
                    gfx.drawText(optext, op.optx, op.y - yoffset, "#000000", this.optionSize);
                    if(this.cursory === i) {
                        gfx.drawTileToGrid("carrotSel", op.x / 24, y - tileyoffset, "menutext");
                        gfx.drawTileToGrid((op.val === 0 ? "nopL" : "opL"), (op.optx / 16) - 1, y - tileyoffset, "menutext");
                        const len = gfx.getTextWidth(optext, this.optionSize);
                        gfx.drawTileToGrid((op.val === (op.choices.length - 1) ? "nopR" : "opR"), (op.optx + len / 4) / 16, y - tileyoffset, "menutext");
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
                        gfx.drawTileToGrid("carrotSel", op.x / 24, y - tileyoffset, "menutext");
                        if(this.inChange) { val = "?"; }
                    }
                    if(val.indexOf("Gamepad") === 0) {
                        if(val.indexOf("GamepadA") === 0) {
                            const spritePos = spriteData.names[val];
                            gfx.drawSprite("sheet", spritePos[0], spritePos[1], op.optx - 4, op.y - yoffset - 8, "menutext");
                        } else {
                            const padId = parseInt(val.replace("Gamepad", ""));
                            const spritePos = spriteData.names["firstButton"];
                            gfx.drawSprite("sheet", padId, spritePos[1], op.optx - 4, op.y - yoffset - 8, "menutext");
                        }
                        if(this.invalidControls.indexOf(op.idx) >= 0) {
                            const spritePos = spriteData.names["x"];
                            gfx.drawSprite("sheet", spritePos[0], spritePos[1], op.optx - 4, op.y - yoffset - 8, "menutext");
                        }
                    } else {
                        const color = this.invalidControls.indexOf(op.idx) >= 0 ? "#FF0000" : "#000000";
                        gfx.drawText(val, op.optx, op.y - yoffset, color, this.optionSize);
                    }
                    break;
                case "final":
                    gfx.drawText(op.text, op.x, op.y - yoffset, "#000000", this.optionSize);
                    if(this.cursory === i) { gfx.drawTileToGrid("carrotSel", op.x / 24, y - tileyoffset, "menutext"); }
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
            x: gfx.getTextRightAlignedX(acttext, this.optionSize, gfx.canvasWidth / 2) / 4 - 5,
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
            x: gfx.getTextRightAlignedX(text, this.optionSize, gfx.canvasWidth / 2) / 4 - 5,
            optx: gfx.canvasWidth / 8 + 5,
            y: y,
            text: text, 
            val: initVal,
            idx: idx
        });
        return y + (initVal.indexOf("Gamepad") === 0 ? this.tileSize : (this.optionSize / 3.3333));
    },
    mouseMove: function(pos) {
        if(this.options[this.cursory].type === "option") {
            if(pos.x !== 0) {
                const newOp = this.options[this.cursory].val + pos.x;
                if(this.options[this.cursory].textId === "opControlScheme" && this.invalidControls.length > 0) { return false; }
                const newVal = Math.min(Math.max(newOp, 0), this.options[this.cursory].choices.length - 1)
                this.options[this.cursory].val = newVal;
                if(this.options[this.cursory].idx) {
                    this.localOptions[this.options[this.cursory].idx] = newVal;
                    if(this.options[this.cursory].idx === "font") { player.options.font = newOp; }
                }
                this.RedimOptions();
                return true;
            } else if(pos.y !== this.cursory) {
                return this.moveToNext(pos.y);
            }
        } else if(this.options[this.cursory].type === "button" || this.options[this.cursory].type === "final") {
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
        if(this.options[this.cursory].type === "final") {
            this.options[this.cursory].action();
        } else if(this.options[this.cursory].type === "option") {
            this.cursory = this.options.length - 2;
            this.drawEverything();
            return true;
        } else if(this.options[this.cursory].type === "button") {
            this.inChange = !this.inChange;
            this.drawEverything();
            return true;
        }
        return true;
    },
    SaveAndQuit: function() {
        if(worldmap.optionsMenu.invalidControls.length > 0) { return false; }
        player.keyboardcontrols = Object.assign(player.keyboardcontrols, worldmap.optionsMenu.localKeyboardControls);
        player.gamepadcontrols = Object.assign(player.gamepadcontrols, worldmap.optionsMenu.localGamepadControls);
        player.options = Object.assign(player.options, worldmap.optionsMenu.localOptions);
        input.SwitchControlType(player.options.controltype);
        UpdateStatsForCurrentDifficulty();
        nwHelpers.AdjustScreenSettings();
        worldmap.optionsMenu.QuitWithoutSaving(true);
    },
    QuitWithoutSaving: function(dontFont) {
        if(!dontFont) { player.options.font = this.origFont; }
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
        }
        this.inChange = false;
        this.RedimOptions();
    },
    cancel: function() { return this.QuitWithoutSaving(); },
    keyPress: function(key) {
        const pos = { x: 0, y: this.cursory };
        if(this.inChange) {
            this.SaveNewButton(key);
            return true;
        }
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
        else { return this.mouseMove(pos); }
    }
};
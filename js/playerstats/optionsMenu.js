worldmap.optionsMenu = {
    soundNums: ["opOff", "5%", "10%", "15%", "20%", "25%", "30%", "35%", "40%", "45%", "50%", "55%", "60%", "65%", "70%", "75%", "80%", "85%", "90%", "95%", "100%"],
    specialPos: -1, cursory: 1, options: [], localOptions: {}, fromPause: false, invalidControls: [],
    headingSize: 36, optionSize: 22, tileSize: 16, optionInfoSize: 18, inChange: false, origFont: 0,
    usingMouse: false, view: 0, views: [0, 15, 20], mouseoffsets: [0, 40, 120], maxView: 1,
    setup: function(fromPause) {
        this.usingMouse = false;
        this.view = 0;
        this.fromPause = fromPause;
        this.localKeyboardControls = Object.assign({}, player.keyboardcontrols);
        this.localGamepadControls = Object.assign({}, player.gamepadcontrols);
        player.options.fullscreen = universalSettings.fullscreen;
        player.options.resolution = universalSettings.resolution;
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
            if(key.indexOf("2") > 0) { continue; }
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
        y = this.addOption(y, "opFontSize", this.localOptions.fontSize, "fontSize", ["opFontSize1", "opFontSize2", "opFontSize3"], false);
        y = this.addOption(y, "opGameplay", 0, false, ["opOff"]);
        y = this.addOption(y, "opPottywords", this.localOptions.canSayFuck, "canSayFuck", ["opNo", "opYes"], false);
        y = this.addOption(y, "opStickyControls", this.localOptions.stickyMovement, "stickyMovement", ["opNo", "opYes"], true);
        if(game.type === 2) {
            y = this.addFinal(y, "opVirtualCustom", vi.SetUpResizeButtons);
        } else {
            y = this.addOption(y, "opIgnoreMouse", this.localOptions.ignoreMouse, "ignoreMouse", ["opNo", "opYes"], false);
            y = this.addOption(y, "opControlScheme", this.localOptions.controltype, "controltype", ["opKeyboard", "opGamepad"], true);
            if(this.localOptions.controltype === 1) {
                y = this.addOption(y, "opDeadzone", this.localOptions.deadZone, "deadZone", ["0.25", "0.33", "0.50", "0.66", "0.75"], false);
                y = this.addOption(y, "opAnalogDPad", this.localOptions.analogDPad, "analogDPad", ["opBelow", "opBoth"], true);
            }
            y = this.addHeading(y, "opControls");
            const keysToUse = this.localOptions.controltype === 1 ? this.localGamepadControls : this.localKeyboardControls;
            this.GetBadControls(keysToUse);
            if(this.localOptions.controltype === 0 || this.localOptions.analogDPad === 0) {
                y = this.addButton(y, "ctrlUp", keysToUse.up, "up");
                y = this.addButton(y, "ctrlLeft", keysToUse.left, "left");
                y = this.addButton(y, "ctrlDown", keysToUse.down, "down");
                y = this.addButton(y, "ctrlRight", keysToUse.right, "right");
            } else {
                y = this.addButtonLie(y);
            }
            y = this.addButton(y, "ctrlConfirm", keysToUse.confirm, "confirm");
            y = this.addButton(y, "ctrlCancel", keysToUse.cancel, "cancel");
            y = this.addButton(y, "ctrlPause", keysToUse.pause, "pause");
        }
        y = this.addHeading(y, "opAudio");
        y = this.addOption(y, "opMusic", this.localOptions.music, "music", worldmap.optionsMenu.soundNums);
        y = this.addOption(y, "opSound", this.localOptions.sound, "sound", worldmap.optionsMenu.soundNums);
        y = this.addHeading(y, "opGraphics");
        if(game.type === 1) {
            const arr = ["opRes0"], opts = Desktop.MaxSize();
            for(let i = 1; i < opts; i++) {
                arr.push(`opRes${i}`);
            }
            arr.push("opRes7");
            y = this.addOption(y, "opResolution", this.localOptions.resolution, "resolution", arr);
            y = this.addOption(y, "opFullScreen", this.localOptions.fullscreen, "fullscreen", ["opNo", "opYes"]);
        }
        y = this.addOption(y, "opFilter", this.localOptions.gfxfilter, "gfxfilter", ["opNone", "opS4X", "opHQ4X", "opGB"]); //, "opGlitch"]);
        if(this.localOptions.gfxfilter === 3) {
            y = this.addOption(y, "opColorH", this.localOptions.coverMode, "coverMode", ["opColor0", "opColor1", "opColor2", "opColor3", "opColor4"]);
            if(this.localOptions.coverMode === 0) {
                y = this.addOption(y, "opMonoH", this.localOptions.coverColor, "coverColor", ["opMono0", "opMono1", "opMono2", "opMono3", "opMono4"]);
            }
        }
        /*y = this.addOption(y, "opPlacehold", 1, false, ["opOff", "opOn"]);*/
        y += 5;
        y = this.addFinal(y, (this.invalidControls.length > 0 ? "opFixControls" : "opSaveQuit"), this.SaveAndQuit);
        y = this.addFinal(y, "opQuit", this.QuitWithoutSaving);
        this.maxView = this.localOptions.controltype === 1 ? 2 : 1;
        this.DrawEverything();
    },
    DrawEverything: function() {
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
            gfx.drawTileToGrid(this.specialPos === 1 ? "opArrDown2" : "opArrDown", 0.5, gfx.tileHeight - 1.25, "menutext");
        }
        if(yoffset > 0) {
            gfx.drawTileToGrid(this.specialPos === 2 ? "opArrUp2" : "opArrUp", 0.5, 0.25, "menutext");
        }
        for(let i = 0; i < this.options.length; i++) {
            const op = this.options[i];
            switch(op.type) {
                case "buttonLie":
                    gfx.drawText(op.text, op.x, op.y - yoffset, gfx.GetBlack(), this.optionSize);
                    gfx.drawTile("analogMain", op.optx - 4, op.y - yoffset - 8, "menutext");
                    gfx.drawTile("dpadMain", op.optx + 16, op.y - yoffset - 8, "menutext");
                    break;
                case "heading":
                    gfx.drawText(op.text, op.x, op.y - yoffset, gfx.GetBlack(), this.headingSize);
                    break;
                case "customvirt":
                    const w = gfx.getTextWidth(op.text, this.optionSize);
                    gfx.drawText(op.text, op.x + (w / 16) + 4, op.y - yoffset, gfx.GetBlack(), this.optionSize);
                    if(this.cursory === i) {
                        gfx.drawTileToGrid("carrotSel", (op.x / 24) + 1, acty - tileyoffset, "menutext");
                    }
                    break;
                case "option":
                    gfx.drawText(op.text, op.x, op.y - yoffset, gfx.GetBlack(), this.optionSize);
                    const opval = op.choices[op.val];
                    const optext =  opval.match(/^(0\.)?\d+%?$/) === null ? GetText(opval) : opval;
                    gfx.drawText(optext, op.optx, op.y - yoffset, gfx.GetBlack(), this.optionSize);
                    let srText;
                    if(this.cursory === i) {
                        gfx.drawTileToGrid("carrotSel", op.x / 24, acty - tileyoffset, "menutext");
                        gfx.drawTileToGrid((op.val === 0 ? "nopL" : "opL"), (op.optx / 16) - 1, acty - tileyoffset, "menutext");
                        const len = gfx.getTextWidth(optext, this.optionSize);
                        gfx.drawTileToGrid((op.val === (op.choices.length - 1) ? "nopR" : "opR"), (op.optx + len / 4) / 16, acty - tileyoffset, "menutext");
                        srText = op.text + ", " + optext;
                    }
                    if(op.hasInfo) {
                        const infotext = "+ " + (op.textId === "opControlScheme" ? GetText("opControlNote") : GetText(op.choices[op.val] + ".i"));
                        gfx.drawWrappedText(infotext, 10, op.y2 - yoffset, 236, gfx.GetBlack(), "menutext", this.optionInfoSize);
                        if(srText) { srText += ". " + infotext; }
                    }
                    if(srText) { screenReaderHelper.SayFresh(srText, "info"); }
                    break;
                case "button":
                    gfx.drawText(op.text, op.x, op.y - yoffset, gfx.GetBlack(), this.optionSize);
                    let val = this.formatKeyName(op.val);
                    if(this.cursory === i) { 
                        gfx.drawTileToGrid("carrotSel", op.x / 24, acty - tileyoffset, "menutext");
                        if(this.inChange) {
                            val = "?";
                            screenReaderHelper.SayFresh("Press any key to assign it to " + op.text, "info");
                        } else {
                            let srVal = val;
                            switch(val) {
                                case "Gamepad0": srVal = "A Button"; break;
                                case "Gamepad1": srVal = "B Button"; break;
                                case "Gamepad2": srVal = "X Button"; break;
                                case "Gamepad3": srVal = "Y Button"; break;
                                case "Gamepad4": srVal = "L Button"; break;
                                case "Gamepad5": srVal = "R Button"; break;
                                case "Gamepad6": srVal = "L Trigger"; break;
                                case "Gamepad7": srVal = "R Trigger"; break;
                                case "Gamepad8": srVal = "Back Button"; break;
                                case "Gamepad9": srVal = "Start Button"; break;
                                case "Gamepad10": srVal = "L Joystick"; break;
                                case "Gamepad11": srVal = "R Joystick"; break;
                                case "Gamepad12": srVal = "Directional Pad Up"; break;
                                case "Gamepad13": srVal = "Directional Pad Down"; break;
                                case "Gamepad14": srVal = "Directional Pad Left"; break;
                                case "Gamepad15": srVal = "Directional Pad Right"; break;
                                case "GamepadA0": srVal = "L Joystick Left"; break;
                                case "GamepadA1": srVal = "L Joystick Up"; break;
                                case "GamepadA4": srVal = "L Joystick Right"; break;
                                case "GamepadA5": srVal = "L Joystick Down"; break;
                                case "GamepadA2": srVal = "R Joystick Left"; break;
                                case "GamepadA3": srVal = "R Joystick Up"; break;
                                case "GamepadA6": srVal = "R Joystick Right"; break;
                                case "GamepadA7": srVal = "R Joystick Down"; break;
                            }
                            screenReaderHelper.SayFresh(op.text + ", " + srVal, "info");
                        }
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
                        const color = this.invalidControls.indexOf(op.idx) >= 0 ? (player.IsMonochrome() ? "#346856" : "#FF0000") : gfx.GetBlack();
                        gfx.drawText(val, op.optx, op.y - yoffset, color, this.optionSize);
                    }
                    break;
                case "final":
                    gfx.drawText(op.text, op.x, op.y - yoffset, gfx.GetBlack(), this.optionSize);
                    if(this.cursory === i) {
                        gfx.drawTileToGrid("carrotSel", op.x / 24, acty - tileyoffset, "menutext");
                        screenReaderHelper.SayFresh(op.text, "option");
                    }
                    break;
            }
        }
        this.DrawColorPreview();
    },
    DrawColorPreview: function(isClosing) {
        const meOpt = this.options[this.cursory];
        if(isClosing === true || ["gfxfilter", "coverMode", "coverColor"].indexOf(meOpt.idx) < 0) {
            document.getElementById("prev_img").style["display"] = "none";
            document.getElementById("prev_imgs4x").style["display"] = "none";
            document.getElementById("prev_imghq4x").style["display"] = "none";
            document.getElementById("prev_imggb").style["display"] = "none";
            document.getElementById("prev_cover").style["display"] = "none";
            return;
        }
        document.getElementById("prev_img").style["display"] = (this.localOptions.gfxfilter === 0 || (this.localOptions.gfxfilter === 3 && this.localOptions.coverMode !== 0)) ? "block" : "none";
        document.getElementById("prev_imgs4x").style["display"] = (this.localOptions.gfxfilter === 1) ? "block" : "none";
        document.getElementById("prev_imghq4x").style["display"] = (this.localOptions.gfxfilter === 2) ? "block" : "none";
        document.getElementById("prev_imggb").style["display"] = (this.localOptions.gfxfilter === 3 && this.localOptions.coverMode === 0) ? "block" : "none";
        if(this.localOptions.gfxfilter === 3) { // Color Shift
            document.getElementById("prev_cover").style["display"] = "block";
            switch(this.localOptions.coverMode) {
                case 0: // monochrome
                    document.getElementById("prev_cover").style["mix-blend-mode"] = "hue";
                    switch(this.localOptions.coverColor) {
                        case 0: // retro
                            document.getElementById("prev_cover").style["background-color"] = "";
                            break;
                        case 1: // gray
                            document.getElementById("prev_cover").style["background-color"] = "#FFFFFF";
                            break;
                        case 2: // amber
                            document.getElementById("prev_cover").style["background-color"] = "#FFBF00";
                            break;
                        case 3: // blue
                            document.getElementById("prev_cover").style["background-color"] = "#0000FF";
                            break;
                        case 4: // pink
                            document.getElementById("prev_cover").style["background-color"] = "#FFCCCC";
                            break;
                    }
                    break;
                case 1: // pastel
                    document.getElementById("prev_cover").style["mix-blend-mode"] = "soft-light";
                    document.getElementById("prev_cover").style["background-color"] = "#FFE5E5";
                    break;
                case 2: // faded
                    document.getElementById("prev_cover").style["mix-blend-mode"] = "saturation";
                    document.getElementById("prev_cover").style["background-color"] = "#FFCCCC";
                    break;
                case 3: // dark
                    document.getElementById("prev_cover").style["mix-blend-mode"] = "hard-light";
                    document.getElementById("prev_cover").style["background-color"] = "#666666";
                    break;
                case 4: // bright
                    document.getElementById("prev_cover").style["mix-blend-mode"] = "soft-light";
                    document.getElementById("prev_cover").style["background-color"] = "#FFFFFF";
                    break;
            }
        } else {
            document.getElementById("prev_cover").style["display"] = "none";
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
            y2: y + (this.optionSize / 3.3333),
            text: acttext, 
            val: initVal,
            choices: options,
            hasInfo: hasInfo,
            textId: text,
            idx: idx
        });
        return y + (this.optionSize / 3.3333) * (hasInfo ? 4 : 1);
    },
    addButtonLie: function(y) {
        const text = GetText("opBtnMove");
        this.options.push({
            type: "buttonLie",
            x: gfx.getTextRightAlignedX(text, this.optionSize, gfx.canvasWidth / 2) / gfx.scale - 5,
            optx: gfx.canvasWidth / 8 + 5,
            y: y,
            text: text
        });
        return y + this.tileSize;
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
            this.DrawEverything();
            return true;
        } else if(hasUpArrow && Between(pos.x, 0.5, 1.5) && Between(pos.y, 0.25, 1.25)) {
            this.specialPos = 2;
            this.DrawEverything();
            return true;
        }
        const doRedraw = this.specialPos > 0;
        this.specialPos = -1;
        const actY = pos.rawY + 8 + this.mouseoffsets[this.view];
        if(pos.x > 2.25 && pos.x < 12.5) {
            for(let i = this.options.length - 1; i >= 0; i--) {
                const opt = this.options[i];
                if(opt.type === "heading") { continue; }
                if(actY > opt.y) { return this.CursorMove({ x: 0, y: i }); }
            }
        }
        if(doRedraw) { this.DrawEverything(); }
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
        while(newY >= 0 && newY < this.options.length && (this.options[newY].type === "heading" || this.options[newY].type === "buttonLie")) {
            newY += dir;
        }
        if(newY < 0 || newY >= this.options.length) { return false; }
        Sounds.PlaySound("menuMove", false, this.localOptions.sound);
        this.cursory = newY;
        this.DrawEverything();
        return true;
    },
    click: function(pos) {
        if(this.specialPos > 0) {
            this.MouseJump(this.specialPos === 1);
            this.mouseMove(pos);
            return true;
        }
        const opt = this.options[this.cursory];
        if(pos.fromKeyboard) {
            if(opt.type === "final") {
                opt.action();
            } else if(opt.type === "option") {
                this.cursory = this.options.length - 2;
                this.DrawEverything();
                return true;
            } else if(opt.type === "button") {
                this.inChange = !this.inChange;
                Sounds.PlaySound(this.inChange ? "navOk" : "navNok", false, this.localOptions.sound);
                this.DrawEverything();
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
                this.DrawEverything();
                return true;
            }
        }
        return true;
    },
    SaveAndQuit: function() {
        if(worldmap.optionsMenu.invalidControls.length > 0) { return false; }
        const oldFilter = player.options.gfxfilter;
        const oldFilterMode = player.options.coverMode;
        player.keyboardcontrols = Object.assign(player.keyboardcontrols, worldmap.optionsMenu.localKeyboardControls);
        player.gamepadcontrols = Object.assign(player.gamepadcontrols, worldmap.optionsMenu.localGamepadControls);
        player.options = Object.assign(player.options, worldmap.optionsMenu.localOptions);
        input.SwitchControlType(player.options.controltype);
        universalSettings.fullscreen = player.options.fullscreen;
        universalSettings.resolution = player.options.resolution;
        localStorage.setItem("universalSettings", game.obj2str(universalSettings));
        const newFilter = player.options.gfxfilter;
        const newFilterMode = player.options.coverMode;
        game.ApplyBlendFilter();
        worldmap.optionsMenu.DrawColorPreview(true);
        if(oldFilter != newFilter || oldFilterMode != newFilterMode) {
            gfx.loadSpriteSheets(player.getSheetPath(), game.sheetsToLoad, worldmap.optionsMenu.ContinueSaveAndQuit);
        } else {
            worldmap.optionsMenu.ContinueSaveAndQuit();
        }
    },
    ContinueSaveAndQuit: function() {
        UpdateStatsForCurrentDifficulty();
        Desktop.AdjustScreenSettings();
        Sounds.PlaySound("confirm", true);
        worldmap.optionsMenu.QuitWithoutSaving(true);
    },
    QuitWithoutSaving: function(dontFont) {
        if(!dontFont) { player.options.font = worldmap.optionsMenu.origFont; Sounds.PlaySound("cancel", true); }
        worldmap.optionsMenu.DrawColorPreview(true);
        if(worldmap.optionsMenu.fromPause) {
            game.innerTransition(worldmap.optionsMenu, pausemenu, player.onion ? 4 : 3);
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
        if(isDown) {
           this.keyPress(player.controls.down);
        } else {
           this.keyPress(player.controls.up);
        }
        this.DrawEverything();
    },
    MouseJump: function(isDown) {
        if(isDown) {
            this.keyPress(player.controls.down);
            this.keyPress(player.controls.down);
            this.keyPress(player.controls.down);
            this.keyPress(player.controls.down);
            this.keyPress(player.controls.down);
            this.keyPress(player.controls.down);
        } else {
            this.keyPress(player.controls.up);
            this.keyPress(player.controls.up);
            this.keyPress(player.controls.up);
            this.keyPress(player.controls.up);
            this.keyPress(player.controls.up);
            this.keyPress(player.controls.up);
        }
        this.DrawEverything();
    }
};
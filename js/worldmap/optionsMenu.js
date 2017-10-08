worldmap.optionsMenu = {
    cursory: 1, options: [], localControls: {}, localOptions: {}, fromPause: false,
    headingSize: 36, optionSize: 22, optionInfoSize: 12, inChange: false, 
    setup: function(fromPause) {
        this.fromPause = fromPause;
        this.localControls = Object.assign({}, player.controls);
        this.localOptions = Object.assign({}, player.options);
        this.options = []; this.cursory = 1; this.inChange = false;
        var y = 0;
        y = this.addHeading(y, "opGameOps");
        y = this.addOption(y, "opDifficulty", player.options.difficulty, "difficulty", ["diffEasy", "diffNormal", "diffHard"], true);
        y = this.addOption(y, "opGameplay", 0, false, ["opOff"]);
        y = this.addHeading(y, "opControls");
        y = this.addButton(y, "ctrlUp", player.controls.up, "up");
        y = this.addButton(y, "ctrlLeft", player.controls.left, "left");
        y = this.addButton(y, "ctrlDown", player.controls.down, "down");
        y = this.addButton(y, "ctrlRight", player.controls.right, "right");
        y = this.addButton(y, "ctrlConfirm", player.controls.confirm, "confirm");
        y = this.addButton(y, "ctrlCancel", player.controls.cancel, "cancel");
        y = this.addButton(y, "ctrlPause", player.controls.pause, "pause");
        y = this.addHeading(y, "opAudio");
        y = this.addOption(y, "opMusic", player.options.music, "music", ["opOff", "opOn"]);
        y = this.addOption(y, "opSound", player.options.sound, "sound", ["opOff", "opOn"]);
        y = this.addHeading(y, "opGraphics");
        /*y = this.addOption(y, "opPlacehold", 1, false, ["opOff", "opOn"]);*/
        y += 5;
        y = this.addFinal(y, "opSaveQuit", this.SaveAndQuit);
        y = this.addFinal(y, "opQuit", this.QuitWithoutSaving);
        this.drawEverything();
    },
    drawEverything: function() {
        gfx.clearAll();
        var y = (this.options[this.cursory].y + this.optionSize - 4) / 16 - 1.8;
        var yoffset = 0, tileyoffset = 0;
        if(y > 7.5) {
            tileyoffset = y - 7.5;
            yoffset = 16 * tileyoffset;
        }
        for(var i = 0; i < this.options.length; i++) {
            var op = this.options[i];
            switch(op.type) {
                case "heading":
                    gfx.drawText(op.text, op.x, op.y - yoffset, "#000000", this.headingSize);
                    break;
                case "option":
                    gfx.drawText(op.text, op.x, op.y - yoffset, "#000000", this.optionSize);
                    var optext = GetText(op.choices[op.val]);
                    gfx.drawText(optext, op.optx, op.y - yoffset, "#000000", this.optionSize);
                    if(this.cursory === i) {
                        gfx.drawTileToGrid("carrotSel", op.x / 24, y - tileyoffset, "menutext");
                        gfx.drawTileToGrid((op.val === 0 ? "nopL" : "opL"), (op.optx / 16) - 1, y - tileyoffset, "menutext");
                        var len = gfx.getTextWidth(optext, this.optionSize);
                        gfx.drawTileToGrid((op.val === (op.choices.length - 1) ? "nopR" : "opR"), (op.optx + len / 4) / 16, y - tileyoffset, "menutext");
                    }
                    if(op.hasInfo) {
                        var infotext = GetText(op.choices[op.val] + "_i");
                        var infox = gfx.getTextFractionX(infotext, this.optionInfoSize);
                        gfx.drawText(infotext, infox, op.y2 - yoffset, "#000000", this.optionInfoSize);
                    }
                    break;
                case "button":
                    gfx.drawText(op.text, op.x, op.y - yoffset, "#000000", this.optionSize);
                    var val = this.formatKeyName(op.val);
                    if(this.cursory === i) { 
                        gfx.drawTileToGrid("carrotSel", op.x / 24, y - tileyoffset, "menutext");
                        if(this.inChange) { val = "?"; }
                    }
                    gfx.drawText(val, op.optx, op.y - yoffset, "#000000", this.optionSize);
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
        text = GetText(text);
        this.options.push({ 
            type: "option",
            x: gfx.getTextRightAlignedX(text, this.optionSize, gfx.canvasWidth / 2) / 4 - 5,
            optx: gfx.canvasWidth / 8 + 5,
            y: y,
            y2: y + (this.optionSize / 3.3333) - 2,
            text: text, 
            val: initVal,
            choices: options,
            hasInfo: hasInfo,
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
        return y + (this.optionSize / 3.3333);
    },
    clean: function() { gfx.clearAll(); },
    mouseMove: function(pos) {
        if(this.options[this.cursory].type === "option") {
            if(pos.x !== 0) {
                var newOp = this.options[this.cursory].val + pos.x;
                this.options[this.cursory].val = Math.min(Math.max(newOp, 0), this.options[this.cursory].choices.length - 1);
                if(this.options[this.cursory].idx) {
                    this.localOptions[this.options[this.cursory].idx] = newOp;
                }
                this.drawEverything();
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
        var dir = newY - this.cursory;
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
        player.controls = Object.assign(player.controls, worldmap.optionsMenu.localControls);
        player.options = Object.assign(player.options, worldmap.optionsMenu.localOptions);
        worldmap.optionsMenu.QuitWithoutSaving();
    },
    QuitWithoutSaving: function() {
        if(this.fromPause) {
            game.transition(this, pausemenu, 3);
        } else {
            game.transition(worldmap.optionsMenu, worldmap.title, 2);
        }
        return true;
    },
    SaveNewButton: function(key)  {
        var newKey = this.options[this.cursory].idx;
        this.localControls[newKey] = key;
        this.options[this.cursory].val = key;
        this.inChange = false;
        this.drawEverything();
    },
    cancel: function() { return this.QuitWithoutSaving(); },
    keyPress: function(key) {
        var pos = { x: 0, y: this.cursory };
        if(this.inChange) {
            this.SaveNewButton(key);
            return true;
        }
        var isEnter = false;
        switch(key) {
            case this.localControls.up: pos.y--; break;
            case this.localControls.left: pos.x--; break;
            case this.localControls.down: pos.y++; break;
            case this.localControls.right: pos.x++; break;
            case this.localControls.confirm:
            case this.localControls.pause: isEnter = true; break;
            case this.localControls.cancel: return this.cancel();
        }
        if(pos.y < 0 || pos.y >= this.options.length) { return false; }
        if(isEnter) {
            return this.click(pos);
        } else {
            return this.mouseMove(pos);
        }
    }
};
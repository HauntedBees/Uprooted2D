pausemenu.savemenu = {
    options: [], cursorY: 0, confirm: false, isSave: false, 
    layersToClear: ["menuA", "menutext"],
    setup: function(args) {
        gfx.clearSome(this.layersToClear);
        if(args === undefined) { args = {}; }
        this.isSave = args.saving;
        this.options = [];
        this.cursorY = args.sel || 0;
        this.confirm = args.confirm;
        this.cursors = new CursorAnimSet([
            { key: "main", x: 0, y: this.cursorY, w: 0, h: 0, type: "cursor", layer: "menucursorA" }
        ]);
        this.DrawAll();
        this.cursors.Start();
    },
    DrawAll: function() {
        gfx.clearSome(this.layersToClear);
        const slotStr = GetText("saveSlotDisp") + " ";
        for(let i = 0; i < game.numSaveSlots; i++) {
            this.drawOption(slotStr + (i + 1), i, this.cursorY === i);
        }
        gfx.drawInfobox(12, 2.5);
        this.cursors.RedimCursor("main", 0, this.cursorY, this.options[this.cursorY], 0);
        if(this.confirm) {
            gfx.drawWrappedText(GetText("eraseSave"), 4.5 * 16, 11, 155);
        } else {
            this.displaySaveDataInfo(this.cursorY);
        }
    },
    displaySaveDataInfo: function(savenum) {
        const slotData = localStorage.getItem("player" + savenum);
        if(slotData === null) { return this.drawSaveDataText(GetText("noSave")); }
        const loadedPlayer = game.str2obj(slotData);
        let text = "Lv." + loadedPlayer.level + " HP: " + loadedPlayer.health + "/" + loadedPlayer.maxhealth;
        text += "\n Coins: " + loadedPlayer.monies + "\n Time: " + player.getPlayTimeString(loadedPlayer.playTime);
        const image = localStorage.getItem("fileImg" + savenum);
        if(image !== null) { gfx.drawSaveFileImage(image); }
        return this.drawSaveDataText(text);
    },
    drawSaveDataText: t => { gfx.drawWrappedText(t, 4.5 * 16, 11, 155); return true; },
    drawOption: function (text, y, selected) { this.options.push(gfx.drawOption(text, y, selected)); },
    mouseMove: function(pos) {
        if(this.confirm) { return false; }
        if(pos.y >= this.options.length) { return false; }
        this.cursorY = pos.y;
        this.DrawAll();
        return true;
    },
    click: function(pos) {
        if(localStorage.getItem("player" + this.cursorY) === null || this.confirm) {
            if(this.isSave) {
                game.save(pos.y);
                this.saving = true;
                this.confirm = false;
                this.DrawAll();
            }
        } else {
            if(this.isSave) {
                this.saving = true;
                this.confirm = true;
                this.DrawAll();
            } else {
                game.load(this.cursorY);
            }
        }
        return true;
    },
    cancel: function() {
        if(this.confirm) {
            this.saving = true;
            this.confirm = false;
            this.DrawAll();
        } else if(this.isSave) {
            game.innerTransition(this, pausemenu, 5);
        } else {
            game.innerTransition(this, worldmap.title, 1);
        }
    },
    keyPress: function(key) {
        const pos = { x: 0, y: this.cursorY };
        let isEnter = false;
        switch(key) {
            case player.controls.up: pos.y--; break;
            case player.controls.down: pos.y++; break;
            case player.controls.confirm:
            case player.controls.pause: isEnter = true; break;
            case player.controls.cancel: return this.cancel();
        }
        if(pos.y < 0) { return false; }
        if(isEnter) { return this.click(pos); }
        else { return this.mouseMove(pos); }
    }
};
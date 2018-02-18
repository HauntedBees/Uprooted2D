pausemenu.savemenu = {
    options: [], cursorY: 0, confirm: false, isSave: false, 
    layersToClear: ["menuA", "menucursorA", "menutext"],
    setup: function(args) {
        gfx.clearSome(this.layersToClear);
        if(args === undefined) { args = {}; }
        this.isSave = args.saving;
        this.options = [];
        this.cursorY = args.sel || 0;
        const slotStr = GetText("saveSlotDisp") + " ";
        for(let i = 0; i < game.numSaveSlots; i++) {
            this.drawOption(slotStr + (i + 1), i, this.cursorY === i);
        }
        gfx.drawInfobox(12, 2.5);
        gfx.drawCursor(0, this.cursorY, this.options[this.cursorY], 0);
        if(args.confirm) {
            this.confirm = true;
            gfx.drawWrappedText(GetText("eraseSave"), 4.5 * 16, 11, 155);
        } else {
            this.confirm = false;
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
    drawSaveDataText: t =>  { gfx.drawWrappedText(t, 4.5 * 16, 11, 155); return true; },
    clean: () => gfx.clearAll(),
    drawOption: function(text, y, selected) {
        let xi = 1;
        const tile = selected ? 9 : 7;
        gfx.drawSprite("sheet", tile, 11, 0, 2 + y * 16, "menuA");
        let width = gfx.getTextWidth(text);
        while(width > 128) {
            width -= 64;
            gfx.drawSprite("sheet", tile, 11, 16 * xi++, 2 + y * 16, "menuA");
        }
        gfx.drawSprite("sheet", tile + 1, 11, 16 * xi, 2 + y * 16, "menuA");
        gfx.drawText(text, 2, 10.5 + y * 16);
        this.options.push(xi);
    },
    mouseMove: function(pos) {
        if(this.confirm) { return false; }
        if(pos.y >= this.options.length) { return false; }
        this.setup({ saving: this.isSave, sel: pos.y });
        return true;
    },
    click: function(pos) {
        if(localStorage.getItem("player" + this.cursorY) === null || this.confirm) {
            if(this.isSave) {
                game.save(pos.y);
                this.setup({ saving: true, sel: this.cursorY });
            }
        } else {
            if(this.isSave) {
                this.setup({ saving: true, sel: this.cursorY, confirm: true });
            } else {
                game.load(this.cursorY);
            }
        }
        return true;
    },
    cancel: function() {
        if(this.confirm) {
            this.setup({ saving: true, sel: this.cursorY });
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
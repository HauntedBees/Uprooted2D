pausemenu.savemenu = {
    options: [], cursorY: 0, confirm: false, isSave: false, 
    layersToClear: ["menuA", "menucursorA", "menutext"],
    setup: function(args) {
        gfx.clearSome(this.layersToClear);
        if(args === undefined) { args = {}; }
        this.isSave = args.saving;
        this.options = [];
        this.cursorY = args.sel || 0;
        this.drawOption("Slot 1", 0, this.cursorY === 0);
        this.drawOption("Slot 2", 1, this.cursorY === 1);
        this.drawOption("Slot 3", 2, this.cursorY === 2);
        this.drawOption("Slot 4", 3, this.cursorY === 3);
        this.drawOption("Slot 5", 4, this.cursorY === 4);
        gfx.drawInfobox(11, 2.5);
        gfx.drawCursor(0, this.cursorY, this.options[this.cursorY], 0);
        if(args.confirm) {
            this.confirm = true;
            gfx.drawWrappedText("Existing save data will be lost. Are you sure?", 4.5 * 16, 11, 155);
        } else {
            this.confirm = false;
            this.displaySaveDataInfo(this.cursorY);
        }
    },
    displaySaveDataInfo: function(savenum) {
        var slotData = localStorage.getItem("file" + savenum);
        if(slotData === null) { return this.drawSaveDataText("No Save Data"); }
        var loadedPlayer = JSON.parse(localStorage.getItem("file" + savenum));
        var text = "Lv." + loadedPlayer.level + " HP: " + loadedPlayer.health + "/" + loadedPlayer.maxhealth;
        text += "\n Coins: " + loadedPlayer.monies + "\n Time: " + player.getPlayTimeString(loadedPlayer.playTime);
        var image = localStorage.getItem("fileImg" + savenum);
        if(image !== null) { gfx.drawSaveFileImage(image); }
        return this.drawSaveDataText(text);
    },
    drawSaveDataText: function(t) { gfx.drawWrappedText(t, 4.5 * 16, 11, 155); return true; },
    clean: function() { gfx.clearAll(); },
    drawOption: function(text, y, selected) {
        var xi = 1;
        var tile = 7;
        if(selected) { tile = 9; }
        gfx.drawSprite("sheet", tile, 11, 0, 2 + y * 16, "menuA");
        var width = gfx.getTextWidth(text);
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
        if(pos.x > 4) { return false; }
        this.setup({ saving: this.isSave, sel: pos.y });
        return true;
    },
    click: function(pos) {
        if(pos.x > 4) { return false; }
        if(localStorage.getItem("file" + this.cursorY) === null || this.confirm) {
            game.save(pos.y);
            this.setup({ saving: true, sel: this.cursorY });
        } else {
            if(this.isSave) {
                this.setup({ saving: true, sel: this.cursorY, confirm: true });
            } else {
                game.load(this.cursorY);
                game.transition(this, worldmap, {  init: player.mapPos, map: player.mapName });
            }
        }
        return true;
    },
    cancel: function() {
        if(this.confirm) {
            this.setup({ saving: true, sel: this.cursorY });
        } else if(this.isSave) {
            game.transition(this, pausemenu, 3);
        } else {
            game.transition(this, worldmap.title, 1);
        }
    },
    keyPress: function(key) {
        var pos = { x: 0, y: this.cursorY };
        var isEnter = false;
        switch(key) {
            case "w": pos.y--; break;
            case "s": pos.y++; break;
            case " ":
            case "Enter": isEnter = true; break;
            case "q": return this.cancel();
        }
        if(pos.y < 0) { return false; }
        if(isEnter) {
            return this.click(pos);
        } else {
            return this.mouseMove(pos);
        }
    }
};
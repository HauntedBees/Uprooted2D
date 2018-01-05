worldmap.falconSelect = {
    cursor: { x: 0, y: 0 }, cropsToSend: [], options: [],
    layersToClean: ["menuA", "menuB", "menucursorA", "menucursorB", "menutext"],
    actualIndexes: [], inventoryWidth: 9, dy: 6, addHalf: true,
    setup: function() {
        this.options = [];
        this.cursor = { x: 0, y: 0 };
        this.cropsToSend = [];
        this.actualIndexes = [];
        var validTypes = ["veg", "tree", "mush", "rice"];
        for(var i = 0; i < player.inventory.length; i++) {
            if(player.inventory[i][0][0] === "_" || player.inventory[i][0][0] === "!") { continue; }
            if(validTypes.indexOf(GetCrop(player.inventory[i][0]).type) < 0) { continue; }
            this.actualIndexes.push(i);
        }
        this.drawAll();
    },

    drawAll: function() {
        gfx.clearSome(this.layersToClean);
        var cursorX = this.cursor.x, cursorY = this.cursor.y + 6;
        worldmap.writeText("falconSelect");
        this.setText();
        gfx.drawInfobox(16, 3, this.dy + 1);
        gfx.drawInfobox(6, 3, this.dy + 1);
        gfx.drawInfobox(16, 2, 1.5);
        gfx.drawFullText(GetText("falconSeeds"), 32);
        gfx.drawCursor(cursorX, cursorY + 1, 0, 0);
        for(var i = 0; i < this.actualIndexes.length; i++) {
            var actItem = player.inventory[this.actualIndexes[i]];
            gfx.drawInventoryItem(actItem, i % this.inventoryWidth, this.dy + 1 + Math.floor(i / this.inventoryWidth), "menuA");
        }
        for(var i = 0; i < this.cropsToSend.length; i++) {
            gfx.drawTileToGrid(this.cropsToSend[i] + "seed", 2.5 + i, 2, "menuA");
        }
        this.options = [];
        this.drawOption(GetText("falconConfirm"), 3.25);
    },
    drawOption: function(text, y, selected) {
        var xi = 1, tile = 7;
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
    setText: function() {
        var idx = this.cursor.y * this.inventoryWidth + this.cursor.x;
        var item = player.inventory[this.actualIndexes[idx]];
        if(item === null || item === undefined) { return; }
        var iteminfo = GetCrop(item[0]);
        var str = iteminfo.displayname + " (" + item[1] + ")\n";
        str += " Power: " + iteminfo.power + "\n";
        if(iteminfo.time > 0) { str += " Time: " + Math.ceil(iteminfo.time / player.getCropSpeedMultiplier()) + "\n"; }
        if(iteminfo.respawn > 0) { str += " Regrowth: " + iteminfo.respawn + "\n"; }
        if(iteminfo.seasons[0] > 0.5) { str += " SP"; }
        if(iteminfo.seasons[1] > 0.5) { str += " SU"; }
        if(iteminfo.seasons[2] > 0.5) { str += " AU"; }
        if(iteminfo.seasons[3] > 0.5) { str += " WI"; }
        gfx.drawWrappedText(str, 9.5 * 16, 11 + (16 * (this.dy + 1)), 85);
    },

    mouseMove: function(pos) {
        if(pos.x < 0 || pos.y < 0) { return false; }
        if(pos.x >= this.inventoryWidth) { return false; }
        var idx = pos.y * this.inventoryWidth + pos.x;
        if(idx < 0 || idx >= this.actualIndexes.length) { return false; }
        this.cursor = { x: pos.x, y: pos.y };
        this.drawAll();
        return true;
    },
    click: function(pos) {
        if(this.cropsToSend.length === 5) { return false; }
        var idx = this.cursor.y * this.inventoryWidth + this.cursor.x;
        var item = player.inventory[this.actualIndexes[idx]];
        if(item[1] === 0) { return false; }
        player.inventory[this.actualIndexes[idx]][1]--;
        this.cropsToSend.push(item[0]);
        this.drawAll();
        return true;
    },
    cancel: function() {
        var last = this.cropsToSend.pop();
        if(last === undefined) { return false; }
        player.increaseItem(last);
        this.drawAll();
        return true;
    },
    keyPress: function(key) {
        var pos = { x: this.cursor.x, y: this.cursor.y };
        var isEnter = false;
        switch(key) {
            case player.controls.up: pos.y--; break;
            case player.controls.left: pos.x--; break;
            case player.controls.down: pos.y++; break;
            case player.controls.right: pos.x++; break;
            case player.controls.confirm:
            case player.controls.pause: isEnter = true; break;
            case player.controls.cancel: return this.cancel();
        }
        if(pos.y < 0 || pos.x < 0) { return false; }
        if(isEnter) { return this.click(pos); }
        else { return this.mouseMove(pos); }
    }
};
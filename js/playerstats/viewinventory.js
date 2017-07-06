pausemenu.inventory = {
    cursor: { x: 0, y: 0 }, inventoryWidth: 15,
    layersToClear: ["menuA", "menucursorA", "menutext"],
    actualIndexes: [],
    setup: function() {
        this.cursor = {x: 0, y: 0};
        this.drawAll();
    },
    drawAll: function() {
        gfx.clearSome(this.layersToClear);
        this.actualIndexes = [];
        gfx.drawInfobox(16, 5, 5);
        var j = 0;
        for(var i = 0; i < player.inventory.length; i++) {
            if(player.inventory[i][0][0] === "_" || player.inventory[i][0][0] === "!") { continue; }
            gfx.drawInventoryItem(player.inventory[i], j % this.inventoryWidth, Math.floor(j / this.inventoryWidth), "menuA");
            this.actualIndexes.push(i);
            j++;
        }
        gfx.drawCursor(this.cursor.x, this.cursor.y, 0, 0);
        this.setText();
    },
    clean: function() { gfx.clearSome(this.layersToClear); },
    cancel: function() { game.transition(this, pausemenu); },
    mouseMove: function(pos) {
        if(pos.x < 0 || pos.y < 0 || pos.x >= this.inventoryWidth) { return false; }
        var idx = pos.y * this.inventoryWidth + pos.x;
        if(idx >= this.actualIndexes.length) { return false; }
        this.cursor = { x: pos.x, y: pos.y };
        this.drawAll();
        return true;
    },
    click: function(pos) { return true; },
    keyPress: function(key) {
        var pos = { x: this.cursor.x, y: this.cursor.y };
        var isEnter = false;
        switch(key) {
            case "w": pos.y--; break;
            case "a": pos.x--; break;
            case "s": pos.y++; break;
            case "d": pos.x++; break;
            case " ":
            case "Enter": isEnter = true; break;
            case "q": return this.cancel();
        }
        if(pos.y < 0 || pos.x < 0) { return false; }
        if(isEnter) {
            return this.click(pos);
        } else {
            return this.mouseMove(pos);
        }
    },
    setText: function() {
        var idx = this.cursor.y * this.inventoryWidth + this.cursor.x;
        var actIdx = this.actualIndexes[idx];
        var item = player.inventory[actIdx];
        var iteminfo = GetCrop(item[0]);
        var str = iteminfo.displayname + " (" + item[1] + ")\n " + GetCropDesc(iteminfo);
        gfx.drawWrappedText(str, 4, 100, 235);
    }
};
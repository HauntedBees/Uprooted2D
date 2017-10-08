pausemenu.equipment = {
    cursor: { x: 0, y: 0 }, inventoryWidth: 15,
    layersToClear: ["menuA", "menucursorA", "menucursorB", "menutext"],
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
            if(player.inventory[i][0][0] !== "!") { continue; }
            gfx.drawInventoryItem(player.inventory[i], j % this.inventoryWidth, Math.floor(j / this.inventoryWidth), "menuA");
            if(player.isEquipped(player.inventory[i][0])) {
                gfx.drawCursor(j % this.inventoryWidth, Math.floor(j / this.inventoryWidth), 0, 0, "xcursor");
            }
            this.actualIndexes.push(i);
            j++;
        }
        if(this.actualIndexes.length === 0) { return; }
        gfx.drawCursor(this.cursor.x, this.cursor.y, 0, 0);
        this.setText();
    },
    clean: function() { gfx.clearSome(this.layersToClear); },
    cancel: function() { game.transition(this, pausemenu, 1); },
    mouseMove: function(pos) {
        if(pos.x < 0 || pos.y < 0 || pos.x >= this.inventoryWidth) { return false; }
        var idx = pos.y * this.inventoryWidth + pos.x;
        if(idx >= this.actualIndexes.length) { return false; }
        this.cursor = { x: pos.x, y: pos.y };
        this.drawAll();
        return true;
    },
    click: function(pos) {
        if(pos.x < 0 || pos.y < 0 || pos.x >= this.inventoryWidth) { return false; }
        var idx = pos.y * this.inventoryWidth + pos.x;
        if(idx >= this.actualIndexes.length) { return false; }
        var item = player.inventory[this.actualIndexes[idx]];
        var equipInfo = GetEquipment(item[0]);
        if(player.equipment[equipInfo.type] === item[0]) {
            player.equipment[equipInfo.type] = null;
        } else {
            player.equipment[equipInfo.type] = item[0];
        }
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
        var equipInfo = GetEquipment(item[0]);
        var str = equipInfo.displayname + "\n " + GetEquipmentDesc(equipInfo);
        gfx.drawWrappedText(str, 4, 100, 235);
    }
};
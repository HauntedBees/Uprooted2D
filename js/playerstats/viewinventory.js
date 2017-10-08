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
        var j = 0;
        for(var i = 0; i < player.inventory.length; i++) {
            if(player.inventory[i][0][0] === "_" || player.inventory[i][0][0] === "!") { continue; }
            gfx.drawInventoryItem(player.inventory[i], j % this.inventoryWidth, Math.floor(j / this.inventoryWidth), "menuA");
            this.actualIndexes.push(i);
            j++;
        }
        gfx.drawCursor(this.cursor.x, this.cursor.y, 0, 0);
        this.setCrop();
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
    setCrop: function() {
        gfx.drawInfobox(16, 5, 5);
        var idx = this.cursor.y * this.inventoryWidth + this.cursor.x;
        var actIdx = this.actualIndexes[idx];
        var item = player.inventory[actIdx];
        var crop = GetCrop(item[0]);
        gfx.drawText(crop.displayname, 4, 105, undefined, 32);
        
        gfx.drawTileToGrid(crop.name, 0, 5, "menutext");

        gfx.drawTileToGrid("inv_power", 2, 5, "menutext");
        gfx.drawText(crop.power, 50, 93.5, undefined, 42);

        gfx.drawTileToGrid("inv_time", 4.5, 5, "menutext");
        var timeNum = crop.time;
        if(crop.time === 999 || crop.time === -1) { timeNum = "?"; } // what is 999 for??
        gfx.drawText(timeNum, 90, 93.5, undefined, 42);

        if(crop.respawn > 0) {
            timeNum = crop.respawn;
            if(crop.respawn === 999) { timeNum = "?"; }
            gfx.drawTileToGrid("inv_regrow", 7, 5, "menutext");
            gfx.drawText(timeNum, 130, 93.5, undefined, 42);
        }

        var cropSprite = "dirt";
        switch(crop.type) {
            case "bee": cropSprite = "_beehive"; break;
            case "spear":
            case "water":
            case "rod": cropSprite = "_lake"; break;
            case "mush": cropSprite = "_log"; break;
            case "egg": cropSprite = "_coop"; break;
            case "food": cropSprite = "_cow"; break;
            case "rice": cropSprite = "_paddy"; break;
            case "tech": cropSprite = "_hotspot"; break;
            case "sickle2": cropSprite = "_charger"; break;
        }
        gfx.drawTileToGrid(cropSprite, 9, 5, "menutext");

        var seasons = ["spring", "summer", "autumn", "winter"];
        for(var i = 0; i < 4; i++) {
            gfx.drawTileToGrid((crop.seasons[i] > 0.5 ? seasons[i] : "noSeason"), 11 + i, 5, "menutext");
        }
        
        gfx.drawWrappedText(GetText(crop.name), 4, 115, 235);
    }
};
pausemenu.farmmod = {
    grid: [], cursor: {x: 0, y: 0}, dx: 0, dy: 0, 
    selectedItem: null, selectedItemPos: null, selectedItemSize: 0, 
    layersToClear: ["background", "characters", "menuA", "menucursorA", "menucursorB", "menutext"],
    actualIndexes: [], inventoryWidth: 5, 
    setup: function() {
        this.cursor = {x: 0, y: 0};
        player.initGridDimensions();
        this.dx = Math.floor((15 - player.gridWidth) / 2);
        this.dy = 4 + Math.floor((6 - player.gridHeight) / 2);
        this.grid = combat.getGrid(player.gridWidth, player.gridHeight);
        this.drawEverything();
    },
    drawEverything: function() {
        gfx.clearSome(this.layersToClear);
        this.drawFarm();
        this.displayItems();
        gfx.drawInfobox(10, 4);
        var size = (this.selectedItem === null || this.cursor.y < 3) ? 0 : this.selectedItemSize;
        if(this.canPlant()) {
            gfx.drawCursor(this.cursor.x, this.cursor.y, size, size);
        } else {
            gfx.drawCursor(this.cursor.x, this.cursor.y, size, size, "bcursor");
        }
        if(this.selectedItem !== null) {
            gfx.drawCursor(this.selectedItemPos.x, this.selectedItemPos.y, 0, 0, "xcursor");
        }
        this.drawText();
    },
    drawText: function() {
        var text = "";
        if(this.cursor.y >= 3) {
            var gridX = this.cursor.x - this.dx;
            var gridY = this.cursor.y - this.dy;
            if(player.itemGrid[gridX][gridY] === null) {
                var speed = player.getCropSpeedMultiplier() * 100;
                text = "Dirt\n Growth Speed: " + speed + "%\n ";
            } else {
                var item = player.itemGrid[gridX][gridY];
                if(item.coord) { item = player.itemGrid[item.x][item.y]; }
                var itemData = GetFarmInfo(item);
                text = itemData.displayname + "\n " + itemData.shortdesc;
            }
        } else if(this.cursor.x < this.inventoryWidth) {
            var idx = this.cursor.y * this.inventoryWidth + this.cursor.x;
            if(idx < this.actualIndexes.length) {
                var invIdx = this.actualIndexes[idx];
                var item = GetFarmInfo(player.inventory[invIdx][0]);
                text += item.displayname + "\n " + item.shortdesc;
            }
        }
        gfx.drawWrappedText(text, 5.5 * 16, 11, 105);
    },
    displayItems: function() {
        var j = 0;
        this.actualIndexes = [];
        for(var i = 0; i < player.inventory.length; i++) {
            if(player.inventory[i][0][0] !== "_") { continue; }
            gfx.drawInventoryItem(player.inventory[i], j % this.inventoryWidth, Math.floor(j / this.inventoryWidth), "menuA");
            this.actualIndexes.push(i);
            j++;
        }
    },
    drawFarm: function() {
        for(var x = 0; x < player.gridWidth; x++) {
            for(var y = 0; y < player.gridHeight; y++) {
                gfx.drawTileToGrid("dirt", x + this.dx, y + this.dy, "background");
                var item = player.itemGrid[x][y];
                if(item !== null && !item.coord) {
                    var iteminfo = GetFarmInfo(item);
                    if(iteminfo.displaySprite !== undefined) {
                        gfx.drawTileToGrid(iteminfo.displaySprite, x + this.dx, y + this.dy, "characters");
                    } else if(item === "_lake") {
                        gfx.drawTileToGrid(this.getWaterFrame(x, y), x + this.dx, y + this.dy, "characters");
                    } else {
                        gfx.drawTileToGrid(item, x + this.dx, y + this.dy, "characters");
                    }
                }
            }
        }
    },
    canPlant: function() {
        if(this.selectedItem !== "_paddy" || (this.cursor.y < this.dy)) { return true; }
        return (this.cursor.y - this.dy) === (player.gridHeight - 1);
    },
    getWaterFrame: function(x, y) {
        var res = 0;
        if(y > 0 && player.itemGrid[x][y - 1] == "_lake") { res += 1; } // W
        if(x > 0 && player.itemGrid[x - 1][y] == "_lake") { res += 2; } // A
        if(y < (player.gridHeight - 1) && player.itemGrid[x][y + 1] == "_lake") { res += 4; } // S
        if(x < (player.gridWidth - 1) && player.itemGrid[x + 1][y] == "_lake") { res += 8; } // D
        switch(res) {
            case 1: return "lakeW";
            case 2: return "lakeA";
            case 3: return "lakeWA";
            case 4: return "lakeS";
            case 5: return "lakeWS";
            case 6: return "lakeAS";
            case 7: return "lakeWAS";
            case 8: return "lakeD";
            case 9: return "lakeWD";
            case 10: return "lakeAD";
            case 11: return "lakeWAD";
            case 12: return "lakeDS";
            case 13: return "lakeWSD";
            case 14: return "lakeASD";
            case 15: return "lakeWASD";
            default: return "_lake";
        }
    },
    clean: function() { gfx.clearAll(); },
    cancel: function() { game.transition(this, pausemenu, 2); },
    removeFromField: function(x, y) {
        var item = player.itemGrid[x][y];
        if(item === null) { return null; }
        if(item.coord) {
            x = item.x; y = item.y;
            item = player.itemGrid[item.x][item.y];
        }
        var size = (GetFarmInfo(item).size) || 1;
        for(var xi = 0; xi < size; xi++) {
            for(var yi = 0; yi < size; yi++) {
                player.itemGrid[x + xi][y + yi] = null;
            }
        }
        return item;
    },
    mouseMove: function(pos) {
        if(pos.y < 0 || pos.x < 0) { return false; }
        if(pos.y < 4) { // item selection
            if(pos.x >= this.inventoryWidth) { return false; }
            var idx = pos.y * this.inventoryWidth + pos.x;
            if(idx >= this.actualIndexes.length) { return false; }
        } else {
            if(pos.y < this.dy || pos.x < this.dx || pos.y >= (this.dy + player.gridHeight - this.selectedItemSize) || pos.x >= (this.dx + player.gridWidth - this.selectedItemSize)) { return false; }
        }
        this.cursor = pos;
        this.drawEverything();
        return true;
    },
    click: function(pos) {
        if(pos.y < 4) { // item selection
            if(pos.x >= this.inventoryWidth) { return false; }
            var idx = pos.y * this.inventoryWidth + pos.x;
            if(idx >= this.actualIndexes.length) { return false; }
            var invIdx = this.actualIndexes[idx];
            var item = player.inventory[invIdx][0];
            this.selectedItem = (this.selectedItem === item ? null : item);
            this.selectedItemPos = pos;
            this.selectedItemSize = (GetFarmInfo(item).size - 1) || 0;
        } else {
            if(pos.y < this.dy || pos.x < this.dx || pos.y >= (this.dy + player.gridHeight - this.selectedItemSize) || pos.x >= (this.dx + player.gridWidth - this.selectedItemSize)) { return false; }
            var gridX = this.cursor.x - this.dx;
            var gridY = this.cursor.y - this.dy;
            if(!this.canPlant()) { return false; }
            var selItem = player.itemGrid[gridX][gridY];
            var isSameItem = this.selectedItem == selItem;
            if(!isSameItem && this.selectedItemSize > 0 && this.selectedItem !== null) {
                for(var x = 0; x <= this.selectedItemSize; x++) {
                    for(var y = 0; y <= this.selectedItemSize; y++) {
                        var item = this.removeFromField(gridX + x, gridY + y);
                        if(item !== null) { player.increaseItem(item, 1); }
                        player.itemGrid[gridX + x][gridY + y] = { coord: true, x: gridX, y: gridY };
                    }
                }
                player.itemGrid[gridX][gridY] = this.selectedItem;
                player.itemGrid[gridX + this.selectedItemSize][gridY + this.selectedItemSize].corner = this.selectedItem;
            } else {
                var item = this.removeFromField(gridX, gridY);
                if(item !== null) { player.increaseItem(item, 1); }
                if(this.selectedItem === null || isSameItem) {
                    this.drawEverything();
                    return true;
                }
                player.itemGrid[gridX][gridY] = this.selectedItem;
            }
            var stillHasAny = player.decreaseItem(this.selectedItem);
            if(!stillHasAny) { this.selectedItem = null; }
        }
        this.drawEverything();
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
        
        if(this.cursor.y < 4 && pos.y > this.cursor.y) {
            if(pos.x < this.inventoryWidth) {
                var idx = pos.y * this.inventoryWidth + pos.x;
                if(idx >= this.actualIndexes.length) {
                    pos.x = this.dx;
                    pos.y = this.dy;
                }
            }
        } else if(this.cursor.y == this.dy && this.cursor.y > pos.y) {
            pos.y = Math.floor(this.actualIndexes.length / (this.inventoryWidth + 1));
            pos.x = this.actualIndexes.length - (this.inventoryWidth * pos.y) - 1;
        }

        if(isEnter) {
            return this.click(pos);
        } else {
            return this.mouseMove(pos);
        }
    }
};
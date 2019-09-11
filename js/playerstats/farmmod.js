pausemenu.farmmod = {
    grid: [], cursor: { x: 0, y: 0 }, animHelper: null,
    dx: 0, dy: 0, cropdx: 0.5, cropdy: 1.125,
    selectedItem: null, selectedItemPos: null, selectedItemSize: 0, 
    layersToClear: ["background", "characters", "menuA", "menutext"],
    actualIndexes: [], inventoryWidth: 4, backStartX: 0, backButtonW: 0, 
    setup: function() { 
        this.animHelper = new CombatAnimHelper([]);
        this.cursor = { x: 0, y: 0 };
        this.selectedItem = null;
        this.selectedItemPos = null;
        this.selectedItemSize = 0;
        this.cursors = new CursorAnimSet([
            { key: "main", x: this.cursor.x, y: this.cursor.y, w: 0, h: 0, type: "cursor", layer: "menucursorA" },
            { key: "alt", x: -1, y: -1, w: 0, h: 0, type: "xcursor", layer: "menucursorB" }
        ]);
        player.initGridDimensions();
        this.dx = ((16 - player.gridWidth) / 2);
        this.dy = 7 + Math.floor((6 - player.gridHeight) / 2);
        this.grid = combat.getGrid(player.gridWidth, player.gridHeight);
        this.backStartX = 0.125;
        this.backButtonW = gfx.drawInfoText(GetText("menu.Back"), this.backStartX, -0.0625, false, "menuA", "menutext");
        this.drawEverything();
        this.cursors.Start();
    },
    drawEverything: function() {
        gfx.clearSome(this.layersToClear);
        gfx.TileBackground("invTile");
        pausemenu.DrawInnerHeading("fx.Heading");

        this.drawFarm();
        this.displayItems();
        gfx.drawInfobox(11, 5, this.cropdy);
        gfx.drawInfoText(GetText("menu.Back"), this.backStartX, -0.0625, this.cursor.y === -1 && this.cursor.x === 0, "menuA", "menutext");

        const size = (this.selectedItem === null || this.cursor.y < 3) ? 0 : this.selectedItemSize;
        const dx = this.cursor.y < 3 ? this.cropdx : 0;
        const dy = this.cursor.y < 3 ? this.cropdy : 0;
        if(this.cursor.y === -1) {
            this.cursors.RedimCursor("main", this.backStartX, 0, this.backButtonW, -0.25);
            gfx.drawWrappedText(GetText("inv.BackInfo"), 5.5 * 16, 30, 155);
        } else {
            this.cursors.RedimCursor("main", dx + this.cursor.x, dy + this.cursor.y, size, size);
            this.cursors.ReTypeCursor("main", this.canPlant() ? "cursor" : "bcursor");
            if(this.selectedItem !== null) {
                this.cursors.MoveCursor("alt", this.cropdx + this.selectedItemPos.x, this.cropdy + this.selectedItemPos.y);
            } else {
                this.cursors.MoveCursor("alt", -1, -1);
            }
            this.drawText();
        }
    },
    drawText: function() {
        let text = "";
        if(this.cursor.y >= 3) {
            const gridX = this.cursor.x - this.dx, gridY = this.cursor.y - this.dy;
            let speed = 100;
            if(player.itemGrid[gridX][gridY] === null) {
                text = GetText("farmModDirt");
                speed = Math.round(player.getCropSpeedMultiplier() * (1 / combat.plant.getSprinklerMultiplier(gridX, gridY, 1)) * 100);
            } else {
                let item = player.itemGrid[gridX][gridY];
                if(item.coord) { item = player.itemGrid[item.x][item.y]; }
                const itemData = GetFarmInfo(item);
                text = itemData.displayname + "\n " + itemData.shortdesc;
                if(itemData.name !== "_hotspot") {
                    speed = Math.round(player.getCropSpeedMultiplier() * (1 / combat.plant.getSprinklerMultiplier(gridX, gridY, itemData.size)) * 100);
                } else {
                    speed = Math.round(player.getCropSpeedMultiplier() * 100);
                }
            }
            text = text.replace(/\{0\}/g, speed);
        } else if(this.cursor.x < this.inventoryWidth) {
            const idx = this.cursor.y * this.inventoryWidth + this.cursor.x;
            if(idx < this.actualIndexes.length) {
                const invIdx = this.actualIndexes[idx];
                const item = GetFarmInfo(player.inventory[invIdx][0]);
                text += item.displayname + "\n " + item.desc;
            }
        }
        gfx.drawWrappedText(text, 5.5 * 16, 30, 155);
    },
    displayItems: function() {
        let j = 0;
        this.actualIndexes = [];
        for(let i = 0; i < player.inventory.length; i++) {
            if(player.inventory[i][0][0] !== "_") { continue; }
            const thisX = this.cropdx + j % this.inventoryWidth;
            const thisY = this.cropdy + Math.floor(j / this.inventoryWidth);
            gfx.drawTileToGrid("invBox", thisX, thisY, "menuA");
            gfx.drawInventoryItem(player.inventory[i], thisX, thisY, "menuA");
            this.actualIndexes.push(i);
            j++;
        }
        for(let i = j; i < 12; i++) {
            const thisX = this.cropdx + i % this.inventoryWidth;
            const thisY = this.cropdy + Math.floor(i / this.inventoryWidth);
            gfx.drawTileToGrid("invBox", thisX, thisY, "menuA");
        }
    },
    drawFarm: function() {
        this.animHelper.DrawWrapper(this.dx, this.dy, player.gridWidth, player.gridHeight);
        for(let x = 0; x < player.gridWidth; x++) {
            for(let y = 0; y < player.gridHeight; y++) {
                gfx.drawTileToGrid("dirt", x + this.dx, y + this.dy, "background");
                const item = player.itemGrid[x][y];
                if(item !== null && !item.coord) {
                    const iteminfo = GetFarmInfo(item);
                    if(iteminfo.displaySprite !== undefined) {
                        gfx.drawTileToGrid(iteminfo.displaySprite, x + this.dx, y + this.dy, "characters");
                    } else if(item === "_lake") {
                        this.DrawWaterFrame(x, y, x + this.dx, y + this.dy, "characters");
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
    DrawWaterFrame: function(gx, gy, vx, vy, layer) {
        let res = this.GetWaterInfo(gx, gy), sprite = "_lake";
        switch(res) {
            case 1: sprite = "lakeW"; break;
            case 2: sprite = "lakeA"; break;
            case 3: sprite = "lakeWA"; break;
            case 4: sprite = "lakeS"; break;
            case 5: sprite = "lakeWS"; break;
            case 6: sprite = "lakeAS"; break;
            case 7: sprite = "lakeWAS"; break;
            case 8: sprite = "lakeD"; break;
            case 9: sprite = "lakeWD"; break;
            case 10: sprite = "lakeAD"; break;
            case 11: sprite = "lakeWAD"; break;
            case 12: sprite = "lakeDS"; break;
            case 13: sprite = "lakeWSD"; break;
            case 14: sprite = "lakeASD"; break;
            case 15: sprite = "lakeWASD"; break;
            default: sprite = "_lake"; break;
        }
        gfx.drawTileToGrid(sprite, vx, vy, layer);
        if(this.GetWaterInfo(gx - 1, gy - 1) < 0) { gfx.drawTileToGrid("clakeWA", vx, vy, layer); }
        if(this.GetWaterInfo(gx + 1, gy - 1) < 0) { gfx.drawTileToGrid("clakeWD", vx, vy, layer); }
        if(this.GetWaterInfo(gx - 1, gy + 1) < 0) { gfx.drawTileToGrid("clakeSA", vx, vy, layer); }
        if(this.GetWaterInfo(gx + 1, gy + 1) < 0) { gfx.drawTileToGrid("clakeSD", vx, vy, layer); }
    },
    GetWaterInfo: function(x, y) {
        let res = 0;
        if(x < 0 || y < 0 || x >= player.gridWidth || y >= player.gridHeight) { return 0; }
        if(player.itemGrid[x][y] !== "_lake") { return - 1; }
        if(y > 0 && player.itemGrid[x][y - 1] === "_lake") { res += 1; } // W
        if(x > 0 && player.itemGrid[x - 1][y] === "_lake") { res += 2; } // A
        if(y < (player.gridHeight - 1) && player.itemGrid[x][y + 1] === "_lake") { res += 4; } // S
        if(x < (player.gridWidth - 1) && player.itemGrid[x + 1][y] === "_lake") { res += 8; } // D
        return res;
    },
    cancel: function() { game.innerTransition(this, pausemenu, 2); Sounds.PlaySound("cancel"); },
    removeFromField: function(x, y) {
        let item = player.itemGrid[x][y];
        if(item === null) { return null; }
        if(item.coord) {
            x = item.x; y = item.y;
            item = player.itemGrid[item.x][item.y];
        }
        const size = (GetFarmInfo(item).size) || 1;
        for(let xi = 0; xi < size; xi++) {
            for(let yi = 0; yi < size; yi++) {
                player.itemGrid[x + xi][y + yi] = null;
            }
        }
        return item;
    },
    mouseMove: function(pos) {
        const dpos = { x: pos.x, y: pos.y };
        if(dpos.y < 1) {
            dpos.y = -1;
            if(dpos.x >= this.backStartX && dpos.x < (this.backButtonW + 1)) {
                dpos.x = 0;
            } else { return false; }
        } else if(dpos.y > 4) {
            dpos.x = Math.floor(dpos.x - this.dx) + this.dx;
            dpos.y = Math.floor(dpos.y);
        } else {
            dpos.x -= this.cropdx;
            dpos.y -= this.cropdy;
            input.FloorPoint(dpos);
        }
        this.CursorMove(dpos);
    },
    click: function() {
        if(this.cursor.y === -1) {
            this.cancel();
            return true;
        }
        if(this.cursor.y < 4) { // item selection
            if(this.cursor.x >= this.inventoryWidth) { return false; }
            const idx = this.cursor.y * this.inventoryWidth + this.cursor.x;
            if(idx >= this.actualIndexes.length) { return false; }
            const invIdx = this.actualIndexes[idx];
            const item = player.inventory[invIdx][0];
            this.selectedItem = (this.selectedItem === item ? null : item);
            Sounds.PlaySound(this.selectedItem === null ? "cancel" : "confirm");
            this.selectedItemPos = this.cursor;
            this.selectedItemSize = (GetFarmInfo(item).size - 1) || 0;
        } else {
            if(this.cursor.y < this.dy || this.cursor.x < this.dx || this.cursor.y >= (this.dy + player.gridHeight - this.selectedItemSize) || this.cursor.x >= (this.dx + player.gridWidth - this.selectedItemSize)) { return false; }
            const gridX = this.cursor.x - this.dx;
            const gridY = this.cursor.y - this.dy;
            if(!this.canPlant()) { return false; }
            const selItem = player.itemGrid[gridX][gridY];
            const isSameItem = this.selectedItem == selItem;
            if(!isSameItem && this.selectedItemSize > 0 && this.selectedItem !== null) {
                for(let x = 0; x <= this.selectedItemSize; x++) {
                    for(let y = 0; y <= this.selectedItemSize; y++) {
                        const item = this.removeFromField(gridX + x, gridY + y);
                        if(item !== null) { player.increaseItem(item, 1); }
                        player.itemGrid[gridX + x][gridY + y] = { coord: true, x: gridX, y: gridY };
                    }
                }
                player.itemGrid[gridX][gridY] = this.selectedItem;
                player.itemGrid[gridX + this.selectedItemSize][gridY + this.selectedItemSize].corner = this.selectedItem;
                Sounds.PlaySound("confirm");
            } else {
                const item = this.removeFromField(gridX, gridY);
                if(item !== null) { player.increaseItem(item, 1); }
                if(this.selectedItem === null || isSameItem) {
                    if(selItem !== null) { Sounds.PlaySound("cancel"); }
                    this.drawEverything();
                    return true;
                }
                Sounds.PlaySound("confirm");
                player.itemGrid[gridX][gridY] = this.selectedItem;
            }
            const stillHasAny = player.decreaseItem(this.selectedItem);
            if(!stillHasAny) { this.selectedItem = null; this.selectedItemSize = 0; }
        }
        this.drawEverything();
        return true;
    },
    keyPress: function(key) {
        const pos = { x: this.cursor.x, y: this.cursor.y };
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
        if(pos.y < -1 || pos.x < 0) { return false; }
        
        if(pos.y === -1) {
            pos.x = 0;
        } else if(this.cursor.y < 4 && pos.y > this.cursor.y) {
            if(pos.x < this.inventoryWidth) {
                const idx = pos.y * this.inventoryWidth + pos.x;
                if(idx >= this.actualIndexes.length) {
                    pos.x = this.dx;
                    pos.y = this.dy;
                }
            }
        } else if(this.cursor.y == this.dy && this.cursor.y > pos.y) {
            pos.y = Math.floor(this.actualIndexes.length / (this.inventoryWidth + 1));
            pos.x = this.actualIndexes.length - (this.inventoryWidth * pos.y) - 1;
            if(pos.x < 0) { pos.y = -1; pos.x = 0; }
        }

        if(isEnter) { return this.click(); }
        else { return this.CursorMove(pos); }
    },
    CursorMove: function(pos) {
        if(pos.y < -1 || pos.x < 0) { return false; }
        if(pos.y === -1) { // back button
            pos.x = 0;
        } if(pos.y < 4) { // item selection
            if(pos.x >= this.inventoryWidth) { return false; }
            const idx = pos.y * this.inventoryWidth + pos.x;
            if(idx >= this.actualIndexes.length) { return false; }
        } else { // crop placement
            if(pos.y < this.dy || pos.x < this.dx || pos.y >= (this.dy + player.gridHeight - this.selectedItemSize) || pos.x >= (this.dx + player.gridWidth - this.selectedItemSize)) { return false; }
        }
        if(SamePoints(this.cursor, pos)) { return false; }
        Sounds.PlaySound("menuMove");
        this.cursor = pos;
        this.drawEverything();
        return true;
    }
};
worldmap.falconSelect = {
    cursor: { x: 0, y: 0 }, cropsToSend: [], 
    layersToClean: ["menuA", "menuB", "menucursorA", "menucursorB", "menutext"],
    actualIndexes: [], inventoryWidth: 9, dy: 9.5,
    setup: function() {
        this.cursor = { x: 0, y: 0 };
        this.cropsToSend = [];
        this.actualIndexes = [];
        const validTypes = ["veg", "tree", "mush", "rice"];
        for(let i = 0; i < player.inventory.length; i++) {
            if(player.inventory[i][0][0] === "_" || player.inventory[i][0][0] === "!") { continue; }
            if(validTypes.indexOf(GetCrop(player.inventory[i][0]).type) < 0) { continue; }
            this.actualIndexes.push(i);
        }
        this.drawAll();
    },

    drawAll: function() {
        gfx.clearSome(this.layersToClean);
        const cursorX = this.cursor.x, cursorY = this.cursor.y + this.dy;
        worldmap.writeText("falconSelect");
        this.setText();
        // top
        gfx.drawInfobox(17, 2, 1.5);
        gfx.drawFullText(GetText("falconSeeds"), 32);
        for(let i = 0; i < this.cropsToSend.length; i++) {
            gfx.drawTileToGrid(this.cropsToSend[i] + "seed", 2.5 + i, 2, "menuA");
        }
        // bottom
        gfx.drawInfobox(17, 5, this.dy);
        gfx.drawInfobox(7, 5, this.dy);
        for(let i = 0; i < this.actualIndexes.length; i++) {
            const actItem = player.inventory[this.actualIndexes[i]];
            gfx.drawInventoryItem(actItem, i % this.inventoryWidth, this.dy + Math.floor(i / this.inventoryWidth), "menuA");
        }

        const xi = this.drawOption(GetText("falconConfirm"), 3.25);
        if(this.cursor.y < 0) {
            gfx.drawCursor(0, 3.25, xi, 0);
        } else {
            gfx.drawCursor(cursorX, cursorY, 0, 0);
        }
    },
    drawOption: function(text, y, selected) {
        let xi = 1, width = gfx.getTextWidth(text);
        const tile = (selected ? 9 : 7);
        gfx.drawSprite("sheet", tile, 11, 0, 2 + y * 16, "menuA");
        while(width > 128) {
            width -= 64;
            gfx.drawSprite("sheet", tile, 11, 16 * xi++, 2 + y * 16, "menuA");
        }
        gfx.drawSprite("sheet", tile + 1, 11, 16 * xi, 2 + y * 16, "menuA");
        gfx.drawText(text, 2, 10.5 + y * 16);
        return xi;
    },
    setText: function() {
        if(this.cursor.y < 0) {
            const sendText = HandlePlurals(GetText("falconConfirmX"), this.cropsToSend.length).replace("{0}", this.cropsToSend.length);
            gfx.drawWrappedText(sendText, 9.5 * 16, 11 + (16 * (this.dy + 1)), 85);
            return;
        }
        const idx = this.cursor.y * this.inventoryWidth + this.cursor.x;
        const item = player.inventory[this.actualIndexes[idx]];
        if(item === null || item === undefined) { return; }

        const crop = GetCrop(item[0]);
        let str = "x" + item[1] + " " + crop.displayname;
        pausemenu.inventory.DrawCropPower(crop, 9.5, 10.5, "menutext");
        const row2y = 11.5;
        let leftMostX = 9.5;
        if(crop.time > 0) {
            gfx.drawTileToGrid("inv_time", leftMostX, row2y, "menutext");
            if(crop.time === 999) { // TODO: -1 vs 999 what is the diff?
                gfx.drawTileToGrid("bigNum?", leftMostX + 1, row2y, "menutext");
            }  else {
                gfx.drawBigNumber(crop.time, leftMostX + 1, row2y, "menutext");
            }
            leftMostX += 2;
        }
        let maxBonuses = 4;
        if(crop.respawn > 0) {
            gfx.drawTileToGrid("inv_regrow", leftMostX, row2y, "menutext");
            if(crop.respawn === 999 || crop.respawn === -1) {
                gfx.drawTileToGrid("bigNum?", leftMostX + 1, row2y, "menutext");
            }  else {
                gfx.drawBigNumber(crop.respawn, leftMostX + 1, row2y, "menutext");
            }
            leftMostX += 2;
            maxBonuses = 2;
        }
        let bonusesToPush = [];
        if(crop.waterResist) { bonusesToPush.push("waterIco" + crop.waterResist); }
        if(crop.fireResist) { bonusesToPush.push("fireIco" + crop.fireResist); }
        if(crop.stickChance) { bonusesToPush.push("stunIco" + crop.stickChance); }
        if(crop.saltResist) { bonusesToPush.push("saltIco" + crop.saltResist); }
        if(crop.saltClean) { bonusesToPush.push("saltIcoX"); }
        if(crop.animal) { bonusesToPush.push("animal" + crop.animal); }
        leftMostX += 0.5;
        for(let i = 0; i < Math.min(bonusesToPush.length, maxBonuses); i++) {
            gfx.drawTileToGrid(bonusesToPush[i], leftMostX + i, row2y, "menutext");
        }
        const seasons = ["spring", "summer", "autumn", "winter"];
        for(let i = 0; i < 4; i++) {
            gfx.drawTileToGrid(seasons[i] + crop.seasons[i], 9.5 + i, 12.75, "menutext");
        }
        gfx.drawWrappedText(str, 9.5 * 16, 11 + (16 * this.dy), 115);
    },

    mouseMove: function(pos) {
        if(pos.x < 0 || pos.y < -1) { return false; }
        if(pos.x >= this.inventoryWidth) { return false; }
        if(pos.y >= 0) {
            const idx = pos.y * this.inventoryWidth + pos.x;
            if(idx < 0 || idx >= this.actualIndexes.length) { return false; }
        }
        this.cursor = { x: pos.x, y: pos.y };
        this.drawAll();
        return true;
    },
    confirmSeeds: function() {
        player.nathanSeeds = [];
        for(let i = 0; i < this.cropsToSend.length; i++) {
            const crop = this.cropsToSend[i];
            player.nathanSeeds.push([crop, this.GetSeedAmountForCrop(crop)]);
            player.clearItemIfEmpty(crop);
        }
        game.currentInputHandler = worldmap;
        gfx.clearSome(this.layersToClean);
        iHandler.Advance();
        return true;
    },
    GetSeedAmountForCrop: function(crop) {
        if(["coconut", "gmocorn", "notdrugs", "lotus"].indexOf(crop) >= 0) { return 4; }
        return 10; // TODO: probably shouldn't be this for EVERY standard crop (should this be in the spreadsheet?)
    },
    click: function(pos) {
        if(this.cursor.y < 0) {
            return this.confirmSeeds();
        } else {
            if(this.cropsToSend.length === 5) { return false; }
            const idx = this.cursor.y * this.inventoryWidth + this.cursor.x;
            const item = player.inventory[this.actualIndexes[idx]];
            if(item[1] === 0) { return false; }
            player.inventory[this.actualIndexes[idx]][1]--;
            this.cropsToSend.push(item[0]);
            this.drawAll();
            return true;
        }
    },
    cancel: function() {
        const last = this.cropsToSend.pop();
        if(last === undefined) { return false; }
        player.increaseItem(last);
        this.drawAll();
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
        if(isEnter) { return this.click(pos); }
        else { return this.mouseMove(pos); }
    }
};
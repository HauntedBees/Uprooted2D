worldmap.falconSelect = {
    cursor: { x: 0, y: 0 }, cropsToSend: [], 
    layersToClean: ["menuA", "menuB", "menutext"],
    actualIndexes: [], inventoryWidth: 9, dy: 9.5,
    setup: function() {
        this.cursor = { x: 0, y: 0 };
        this.cursors = new CursorAnimSet([
            { key: "main", x: this.cursor.x, y: this.cursor.y, w: 0, h: 0, type: "cursor", layer: "menucursorA" }
        ]);
        this.cropsToSend = [];
        this.actualIndexes = [];
        const validTypes = ["veg", "tree", "mush", "rice"];
        for(let i = 0; i < player.inventory.length; i++) {
            if(player.inventory[i][0][0] === "_" || player.inventory[i][0][0] === "!") { continue; }
            if(validTypes.indexOf(GetCrop(player.inventory[i][0]).type) < 0) { continue; }
            this.actualIndexes.push(i);
        }
        this.drawAll();
        worldmap.cursors.Stop();
        this.cursors.Start();
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
            this.cursors.RedimCursor("main", 0, 3.25, xi, 0);
        } else {
            this.cursors.RedimCursor("main", cursorX, cursorY, 0, 0);
        }
    },
    drawOption: function(text, y, selected) { return gfx.drawOption(text, y, selected); },
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
            if(crop.time === 999) { // NOTE: -1 vs 999 what is the diff?
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
        if(crop.animal) { bonusesToPush.push(animalInfo[crop.animal].invSprite); }
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
        if(pos.y >= this.dy) {
            return this.CursorMove({ x: Math.floor(pos.x), y: Math.floor(pos.y - this.dy) });
        }
        if(pos.y >= 3 && pos.y <= 4 && pos.x < 3.5) {
            return this.CursorMove({ x: 0, y: -1 });
        }
        if(pos.y >= 1.75 && pos.y <= 3 && pos.x >= 2.5) {
            const newx = Math.floor(pos.x - 2.5);
            if(newx >= this.cropsToSend.length) { return false; }
            this.drawAll();
            gfx.drawTileToGrid("x", 2.5 + newx, 2, "menuA");
            return true;
        }
        console.log(`MouseMove: ${pos.x}, ${pos.y}`);
    },
    CursorMove: function(pos) {
        if(pos.x < 0 || pos.y < -1) { return false; }
        if(pos.x >= this.inventoryWidth) { return false; }
        if(pos.y >= 0) {
            const idx = pos.y * this.inventoryWidth + pos.x;
            if(idx < 0 || idx >= this.actualIndexes.length) { return false; }
        }
        if(SamePoints(this.cursor, pos)) { return false; }
        Sounds.PlaySound("menuMove");
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
        this.cursors.Perish();
        worldmap.cursors.Start();
        iHandler.Advance();
        return true;
    },
    GetSeedAmountForCrop: function(crop) {
        if(["coconut", "gmocorn", "notdrugs", "lotus"].indexOf(crop) >= 0) { return 4; }
        const cropObj = GetCrop(crop);
        return 16 - cropObj.power; // 6 for the strongest crops, 15 for the weakest
    },
    click: function(pos) {
        if(pos !== undefined && pos.y >= 1.75 && pos.y <= 3 && pos.x >= 2.5) { // unselecting a seed
            const newx = Math.floor(pos.x - 2.5);
            if(newx >= this.cropsToSend.length) { return false; }
            const seed = this.cropsToSend.splice(newx, 1)[0];
            if(seed === undefined) { return false; }
            player.increaseItem(seed);
            this.drawAll();
            Sounds.PlaySound("navOk");
            return true;
        }
        if(this.cursor.y < 0) {
            return this.confirmSeeds();
            Sounds.PlaySound("navOk");
        } else {
            if(this.cropsToSend.length === 5) { Sounds.PlaySound("navNok"); return false; }
            const idx = this.cursor.y * this.inventoryWidth + this.cursor.x;
            const item = player.inventory[this.actualIndexes[idx]];
            if(item[1] === 0) { return false; }
            player.inventory[this.actualIndexes[idx]][1]--;
            this.cropsToSend.push(item[0]);
            Sounds.PlaySound("navOk");
            this.drawAll();
            return true;
        }
    },
    cancel: function() {
        const last = this.cropsToSend.pop();
        if(last === undefined) { Sounds.PlaySound("navNok"); return false; }
        player.increaseItem(last);
        this.drawAll();
        Sounds.PlaySound("navOk");
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
        if(isEnter) { return this.click(); }
        else { return this.CursorMove(pos); }
    }
};
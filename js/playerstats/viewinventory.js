pausemenu.inventory = {
    cursor: { x: 0, y: 0 }, inventoryWidth: 3,
    layersToClear: ["menuA", "menutext", "tutorial", "menuOverBlack", "menutextOverBlack"],
    actualIndexes: [], selectedCrop: -1, trashInfo: [], trashIdx: 0,
    setup: function() {
        this.cursor = { x: 0, y: 0 };
        this.cursors = new CursorAnimSet([
            { key: "main", x: this.cursor.x, y: this.cursor.y, w: 0, h: 0, type: "cursor", layer: "menucursorA" },
            { key: "alt", x: -1, y: -1, w: 0, h: 0, type: "xcursor", layer: "menucursorB" }
        ]);
        this.selectedCrop = -1;
        this.trashInfo = [];
        this.trashIdx = setInterval(this.HandleTrashCan, 50);
        this.DrawAll();
        this.cursors.Start();
    },
    DrawAll: function() {
        gfx.clearSome(this.layersToClear);
        this.actualIndexes = [];
        let j = 0;
        if(this.selectedCrop < 0) { this.cursors.MoveCursor("alt", -1, -1); }
        for(let i = 0; i < player.inventory.length; i++) {
            if(player.inventory[i][0][0] === "_" || player.inventory[i][0][0] === "!") { continue; }
            gfx.drawInventoryItem(player.inventory[i], j % this.inventoryWidth + 0.25, Math.floor(j / this.inventoryWidth) + 0.5, "menuA");
            this.actualIndexes.push(i);
            if(i === this.selectedCrop) {
                this.cursors.MoveCursor("alt", j % this.inventoryWidth + 0.25, Math.floor(j / this.inventoryWidth) + 0.5);
            }
            j++;
        }
        if(this.cursor.x < this.inventoryWidth) {
            this.cursors.MoveCursor("main", this.cursor.x + 0.25, this.cursor.y + 0.5);
        } else {
            this.cursors.MoveCursor("main", this.cursor.x + 0.5, this.cursor.y + 0.5);
        }
        if(this.selectedCrop >= 0) { this.DrawSelectInfo(); }
        this.HandleTrashCan(true);
        this.setCrop();
    },
    clean: function() {
        clearInterval(this.trashIdx);
        this.cursors.Perish();
        gfx.clearAll(true);
    },
    cancel: function() {
        if(this.selectedCrop < 0) { game.innerTransition(this, pausemenu); }
        else { this.selectedCrop = -1; if(this.cursor.x >= this.inventoryWidth) { this.cursor.x = this.inventoryWidth - 1; } this.DrawAll(); }
    },
    mouseMove: function(pos) {
        if(pos.x < 0 || pos.y < 0) { return false; }
        if(this.selectedCrop < 0) {
            if(pos.x >= this.inventoryWidth) { return false; }
            const idx = pos.y * this.inventoryWidth + pos.x;
            if(idx >= this.actualIndexes.length) { return false; }
        } else {
            if(pos.x > this.inventoryWidth) { return false; }
        }
        this.cursor = { x: pos.x, y: pos.y };
        this.DrawAll();
        return true;
    },
    HandleTrashCan: function(fromDrawAll) {
        gfx.clearLayer("tutorial");
        if(pausemenu.inventory.selectedCrop < 0 && pausemenu.inventory.trashInfo.length === 0) { return; }
        if(pausemenu.inventory.selectedCrop >= 0) { gfx.drawTileToGrid("animBin0", 3.5, pausemenu.inventory.cursor.y + 0.5, "tutorial"); }
        if(pausemenu.inventory.trashInfo.length > 0) {
            for(let i = pausemenu.inventory.trashInfo.length - 1; i >= 0; i--) {
                const ti = pausemenu.inventory.trashInfo[i];
                const trashFrame = ti.frame > 5 ? 0 : ti.frame;
                gfx.drawTileToGrid("animBin" + trashFrame, ti.x, ti.y, "tutorial");
                if(!fromDrawAll) { ti.frame++; }
                if(ti.numCoins > 0 && ti.frame % 3 === 0) {
                    ti.numCoins -= 1;
                    ti.coinStates.push({ frame: 0, x: ti.x, y: ti.y, done: false });
                }
                let allCoinsDone = true;
                for(let j = 0; j < ti.coinStates.length; j++) {
                    const coin = ti.coinStates[j];
                    if(coin.done) { continue; }
                    allCoinsDone = false;
                    const coinFrame = coin.frame > 3 ? 0 : coin.frame;
                    coin.done = (coin.frame > 4);
                    coin.y -= 0.25;
                    coin.frame++;
                    gfx.drawTileToGrid("animCoin" + coinFrame, coin.x, coin.y, "tutorial");
                }
                if(allCoinsDone && ti.frame > 6) { pausemenu.inventory.trashInfo.splice(i, 1); }
            }
        }
    },
    DrawSelectInfo: function() {
        const idx = this.cursor.y * this.inventoryWidth + this.cursor.x;
        const actIdx = this.actualIndexes[idx];
        let text = "";
        if(actIdx === this.selectedCrop) {
            text = GetText("inv.unselect");
        } else if(this.cursor.x === this.inventoryWidth) {
            text = GetText("inv.drop");
            const invfo = player.inventory[this.selectedCrop];
            const price = Math.ceil(GetCrop(invfo[0]).price * invfo[1] * 0.1);
            text = text.replace(/\{0\}/g, price);
        } else {
            text = GetText("inv.swap");
        }

        const y = this.cursor.y + 0.5, x = 4.5;
        let xi = 1;
        let width = gfx.getTextWidth(text) + 20;
        let xiimax = x + Math.ceil(width / 64);
        while(xiimax > 14) { x -= 1; xiimax = x + Math.ceil(width / 64); }
        gfx.drawTile("recSelL", x * 16, 2 + y * 16, "menuOverBlack");
        while(width > 128) {
            width -= 64;
            gfx.drawTile("recSelM", x * 16 + 16 * xi++, 2 + y * 16, "menuOverBlack");
        }
        gfx.drawTile("recSelR", x * 16 + 16 * xi, 2 + y * 16, "menuOverBlack");
        gfx.drawText(text, 7 + x * 16, 10.5 + y * 16, undefined, undefined, "menutextOverBlack");
    },
    click: function(pos) {
        if(this.cursor.x === this.inventoryWidth) {
            const invfo = player.inventory[this.selectedCrop];
            const price = Math.ceil(GetCrop(invfo[0]).price * invfo[1] * 0.1);
            player.monies += price;
            player.inventory.splice(this.selectedCrop, 1);
            this.trashInfo.push({ frame: 0, coinStates: [], x: 3.5, y: (pausemenu.inventory.cursor.y + 0.5), numCoins: Math.min(10, Math.ceil(price / 30)) });
            this.selectedCrop = -1;
            this.cursor.x = this.inventoryWidth - 1;
        } else {
            const idx = this.cursor.y * this.inventoryWidth + this.cursor.x;
            const actIdx = this.actualIndexes[idx];
            if(actIdx === undefined) { return false; }
            if(this.selectedCrop < 0) {
                this.selectedCrop = actIdx;
            } else if(this.selectedCrop === this.actIdx) {
                this.selectedCrop = -1;
                if(this.cursor.x >= this.inventoryWidth) { this.cursor.x = this.inventoryWidth - 1; }
            } else {
                const temp = player.inventory[actIdx];
                player.inventory[actIdx] = player.inventory[this.selectedCrop];
                player.inventory[this.selectedCrop] = temp;
                this.selectedCrop = -1;
            }
        }
        this.DrawAll();
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
        if(pos.y < 0 || pos.x < 0) { return false; }
        if(isEnter) {
            return this.click(pos);
        } else {
            return this.mouseMove(pos);
        }
    },
    setCrop: function() {
        const rowYs = [0.25, 1.5, 2.75];
        const rowTextYs = [16, 32, 57, 72];
        const leftMostX = 4.75;
        const rightMostX = 14;
        const leftMostTextX = 92;
        
        gfx.drawInfobox(12, 10, 0);

        const idx = this.cursor.y * this.inventoryWidth + this.cursor.x;
        const actIdx = this.actualIndexes[idx];
        const item = player.inventory[actIdx];
        if(item === undefined) { return; }
        const crop = GetCrop(item[0]);

        // Row 0
        gfx.drawText(crop.displayname, leftMostTextX + 4, rowTextYs[0], undefined, 32);
        gfx.drawTileToGrid(crop.showSeed ? crop.name + "seed" : crop.name, leftMostX, rowYs[0], "menutext");

        let cropSprite = "dirt";
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
        gfx.drawTileToGrid(cropSprite, leftMostX + 9.25, rowYs[0], "menutext");
        gfx.drawItemNumber(crop.size, leftMostX + 9.5, rowYs[0], "menutext", true);

        // Row 1
        const seasons = ["spring", "summer", "autumn", "winter"];
        for(let i = 0; i < 4; i++) {
            gfx.drawTileToGrid(seasons[i] + crop.seasons[i], leftMostX + 6.75 + i, rowYs[1], "menutext");
        }
        this.DrawCropPower(crop, leftMostX, rowYs[1], "menutext");

        // Row 2
        gfx.drawTileToGrid("inv_time", leftMostX, rowYs[2], "menutext");
        if(crop.time === 999 || crop.time === -1) { // TODO: -1 vs 999 what is the diff?
            gfx.drawTileToGrid("bigNum?", leftMostX + 1, rowYs[2], "menutext");
        } else {
            gfx.drawBigNumber(crop.time, leftMostX + 1, rowYs[2], "menutext");
        }
        if(crop.respawn > 0) {
            gfx.drawTileToGrid("inv_regrow", leftMostX + 2, rowYs[2], "menutext");
            if(crop.respawn === 999 || crop.respawn === -1) {
                gfx.drawTileToGrid("bigNum?", leftMostX + 3, rowYs[2], "menutext");
            }  else {
                gfx.drawBigNumber(crop.respawn, leftMostX + 3, rowYs[2], "menutext");
            }
        }

        let bonusesToPush = [];
        if(crop.waterResist) { bonusesToPush.push("waterIco" + crop.waterResist); }
        if(crop.fireResist) { bonusesToPush.push("fireIco" + crop.fireResist); }
        if(crop.stickChance) { bonusesToPush.push("stunIco" + crop.stickChance); }
        if(crop.saltResist) { bonusesToPush.push("saltIco" + crop.saltResist); }
        if(crop.saltClean) { bonusesToPush.push("saltIcoX"); }
        if(crop.animal) { bonusesToPush.push("animal" + crop.animal); }
        for(let i = 0; i < bonusesToPush.length; i++) {
            gfx.drawTileToGrid(bonusesToPush[i], rightMostX - 0.25 - i, rowYs[2], "menutext");
        }
        
        // Row 3
        gfx.drawWrappedText(GetText(crop.name), leftMostTextX - 16, rowTextYs[3], 170);
    },
    DrawCropPower: function(crop, x, y, layer, ignoreSun) {
        if(!ignoreSun) { gfx.drawTileToGrid("inv_power", x, y, layer); }
        const numStars = crop.power / 2, starDx = 1;
        if(numStars > 5) {
            for(let i = 0; i < 5; i++) {
                gfx.drawTileToGrid("starMax", x + 1 + i * starDx, y, layer);
            }
        } else {
            for(let i = 0; i < numStars; i++) {
                gfx.drawTileToGrid("starFull", x + 1 + i * starDx, y, layer);
            }
            if(numStars % 1 !== 0) { gfx.drawTileToGrid("starHalf", x + 1 + (numStars - 0.5) * starDx, y, layer); }
            for(let i = Math.ceil(numStars); i < 5; i++) {
                gfx.drawTileToGrid("starNone", x + 1 + i * starDx, y, layer);
            }
        }
    }
};
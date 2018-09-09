worldmap.invClean = {
    cursor: { x: 0, y: 0 }, inventoryWidth: 4, 
    topCrops: [], topPrice: 0, didConfirm: false,
    layersToClear: ["menuA", "menucursorB", "menutext", "tutorial", "menuOverBlack", "menutextOverBlack"],
    actualIndexes: [], selectedCrop: -1, trashInfo: [], trashIdx: 0,
    setup: function(newItems) {
        this.cursor = { x: 0, y: 0 };
        this.selectedCrop = -1;
        this.cursors = new CursorAnimSet([
            { key: "main", x: this.cursor.x, y: this.cursor.y, w: 0, h: 0, type: "cursor", layer: "menucursorA" }
        ]);
        this.trashInfo = [];
        this.topCrops = newItems;
        this.topPrice = 0;
        this.didConfirm = false;
        this.trashIdx = setInterval(this.HandleTrashCan, 50);
        gfx.TileBackground("invTile");
        this.DrawAll();
        this.cursors.Start();
    },
    DrawAll: function() {
        gfx.clearSome(this.layersToClear);
        this.actualIndexes = [];
        let j = 0;
        for(let i = 0; i < player.inventory.length; i++) {
            if(player.inventory[i][0][0] === "_" || player.inventory[i][0][0] === "!") { continue; }
            gfx.drawInventoryItem(player.inventory[i], j % this.inventoryWidth, Math.floor(j / this.inventoryWidth), "menuA");
            this.actualIndexes.push(i);
            if(i === this.selectedCrop) { gfx.DrawXCursor(j % this.inventoryWidth, Math.floor(j / this.inventoryWidth), 0, 0); }
            j++;
        }
        this.topPrice = 0;
        for(let i = 0; i < this.topCrops.length; i++) {
            gfx.drawInventoryItem(this.topCrops[i], i % this.inventoryWidth, 12 + Math.floor(i / this.inventoryWidth), "menuA");
            if(i === (this.selectedCrop - 100)) { gfx.DrawXCursor(i % this.inventoryWidth, 12 + Math.floor(i / this.inventoryWidth), 0, 0); }
            this.topPrice += GetCrop(this.topCrops[i][0]).price * this.topCrops[i][1];
        }
        if(this.cursor.x < this.inventoryWidth) { this.cursors.RedimCursor("main", this.cursor.x, this.cursor.y, 0, 0); }
        if(this.selectedCrop >= 0) { this.DrawSelectInfo(); }
        this.HandleTrashCan(true);
        this.SetCrops();
    },
    clean: function() { this.cursors.Perish(); clearInterval(this.trashIdx); gfx.clearAll(); },
    cancel: function() {
        if(this.selectedCrop < 0) { this.cursor.x = this.inventoryWidth; }
        else { this.selectedCrop = -1; }
        this.DrawAll();
    },
    mouseMove: function(pos) {
        this.CursorMove({x: Math.floor(pos.x), y: Math.floor(pos.y)});
    },
    CursorMove: function(pos) {
        if(pos.x < 0 || pos.y < 0 || pos.y > 13) { return false; }
        if(pos.y === 9) { pos.y = 12; }
        else if(pos.y === 11) {  pos.y = 8; }
        if(pos.x === 4) { pos.y = this.cursor.y; }
        if(this.selectedCrop < 0) {
            if(pos.x > this.inventoryWidth) { return false; }
        } else {
            if(pos.x >= this.inventoryWidth) { return false; }
        }
        this.cursor = { x: pos.x, y: pos.y };
        this.DrawAll();
        return true;
    },
    HandleTrashCan: function(fromDrawAll) {
        gfx.clearLayer("tutorial");
        if(worldmap.invClean.trashInfo.length > 0) {
            for(let i = worldmap.invClean.trashInfo.length - 1; i >= 0; i--) {
                const ti = worldmap.invClean.trashInfo[i];
                const trashFrame = ti.frame > 5 ? 0 : ti.frame;
                gfx.drawTileToGrid("animBin" + trashFrame, ti.x, ti.y, "tutorial");
                if(!fromDrawAll) { ti.frame++; }
                if(ti.numCoins > 0 && ti.frame % 3 === 0) {
                    ti.numCoins -= 1;
                    ti.coinStates.push({ frame: 0, x: ti.x, y: ti.y, done: false });
                }
                let allCoinsDone = true;
                for(var j = 0; j < ti.coinStates.length; j++) {
                    var coin = ti.coinStates[j];
                    if(coin.done) { continue; }
                    allCoinsDone = false;
                    const coinFrame = coin.frame > 3 ? 0 : coin.frame;
                    coin.done = (coin.frame > 4);
                    coin.y -= 0.25;
                    coin.frame++;
                    gfx.drawTileToGrid("animCoin" + coinFrame, coin.x, coin.y, "tutorial");
                }
                if(allCoinsDone && ti.frame > 6) { worldmap.invClean.trashInfo.splice(i, 1); }
            }
        } else {
            gfx.drawTileToGrid("animBin0", 4, 13, "tutorial");
            if(worldmap.invClean.didConfirm) {
                clearInterval(worldmap.invClean.trashIdx);
                game.transition(worldmap.invClean, worldmap, { init: worldmap.pos, map: worldmap.mapName, noEntityUpdate: true });
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
        let xi = 1, width = gfx.getTextWidth(text) + 20;
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
    ConfirmSelection: function() {
        this.trashInfo.push({ frame: 0, coinStates: [], x: 4, y: 13, numCoins: Math.min(10, Math.ceil(this.topPrice / 30)) });
        player.AddMonies(this.topPrice);
        this.didConfirm = true;
    },
    click: function(pos) {
        if(this.didConfirm) { return false; }
        if(this.cursor.x === this.inventoryWidth) { return this.ConfirmSelection(); }
        let newidx = -1;
        if(this.cursor.y < 10) {
            const idx = this.cursor.y * this.inventoryWidth + this.cursor.x;
            if(this.actualIndexes[idx] !== undefined) { newidx = this.actualIndexes[idx]; }
        } else if(this.cursor.y > 10) {
            const idx = (this.cursor.y - 12) * this.inventoryWidth + this.cursor.x;
            if(idx < this.topCrops.length) { newidx = idx; }
            newidx += 100;
        } else { return false; }
        if(this.selectedCrop < 0 && (newidx === 99 || newidx === -1)) { return false; } // don't select empty fields
        if(newidx === -1 && this.selectedCrop < 100) { return false; } // don't move from filled inventory space to empty one
        if(newidx === 99 && this.selectedCrop >= 100) { return false; } // don't move from filled tossable space to empty one

        if(this.selectedCrop < 0) {
            this.selectedCrop = newidx;
        } else if(this.selectedCrop === newidx) {
            this.selectedCrop = -1;
        } else {
            if(this.selectedCrop >= 100 && newidx === -1) { // putting tossable into empty inventory space
                const takenCrop = this.topCrops.splice(this.selectedCrop - 100, 1)[0];
                if(!player.increaseItem(takenCrop[0], takenCrop[1])) { this.topCrops.push(takenCrop); }
            } else if(this.selectedCrop < 100 && newidx === 99) { // putting inventory item into empty tossable space
                const takenCrop = player.inventory.splice(this.selectedCrop, 1)[0];
                this.topCrops.push(takenCrop);
            } else if(this.selectedCrop >= 100 && newidx >= 100) { // sorting the tossables for some reason
                newidx -= 100;
                this.selectedCrop -= 100;
                const temp = this.topCrops[newidx];
                this.topCrops[newidx] = this.topCrops[this.selectedCrop];
                this.topCrops[this.selectedCrop] = temp;
            } else if(this.selectedCrop < 100 && newidx < 100) { // sorting inventory for some reason
                const temp = player.inventory[newidx];
                player.inventory[newidx] = player.inventory[this.selectedCrop];
                player.inventory[this.selectedCrop] = temp;
            } else if(this.selectedCrop < 100 && newidx >= 100) { // swapping tossable with inventory
                const temp = this.topCrops[newidx - 100];
                this.topCrops[newidx - 100] = player.inventory[this.selectedCrop];
                player.inventory[this.selectedCrop] = temp;
            } else if(this.selectedCrop >= 100 && newidx < 100) { // swapping inventory with tossable
                const temp = player.inventory[newidx];
                player.inventory[newidx] = this.topCrops[this.selectedCrop - 100];
                this.topCrops[this.selectedCrop - 100] = temp;
            }
            this.selectedCrop = -1;
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
            return this.click();
        } else {
            return this.CursorMove(pos);
        }
    },
    DrawConfirmButton: function() {
        const text = GetText("falconConfirm");
        let y = 13, x = 7, xi = 1;
        let width = gfx.getTextWidth(text) + 20;
        let xiimax = x + Math.ceil(width / 64);
        const isSelected = this.cursor.x === this.inventoryWidth;
        const tilePrefix = isSelected ? "recSel" : "sel";
        while(xiimax > 14) { x -= 1; xiimax = x + Math.ceil(width / 64); }
        gfx.drawTile(tilePrefix + "L", x * 16, 2 + y * 16, "menuA");
        while(width > 128) {
            width -= 64;
            gfx.drawTile(tilePrefix + "M", x * 16 + 16 * xi++, 2 + y * 16, "menuA");
        }
        if(isSelected) { this.cursors.RedimCursor("main", x, y, xi, 0); }
        gfx.drawTile(tilePrefix + "R", x * 16 + 16 * xi, 2 + y * 16, "menuA");
        gfx.drawText(text, 7 + x * 16, 10.5 + y * 16, undefined, undefined, "menutext");
    },
    SetCrops: function() {
        const rowYs = [0.25, 1.5, 2.75, 6.25, 7.5, 8.75];
        const rowTextYs = [16, 0, 0, 113, 0, 0];
        gfx.drawInfobox(12, 4, 0);
        gfx.drawInfobox(12, 4, 6);
        gfx.drawInfobox(11, 2, 12);
        gfx.drawTileToGrid("recycleArrow", 4, 12, "menuA");

        gfx.drawWrappedText(GetText("fullSelect"), 70, 105, 170);
        gfx.drawWrappedText(GetText("fullToss").replace(/\{0\}/g, this.topPrice), 90, 204, 140);
        this.DrawConfirmButton();
 
        let crop = null;
        if(this.cursor.x === 4) { return; }
        if(this.cursor.y < 10) {
            const idx = this.cursor.y * this.inventoryWidth + this.cursor.x;
            const actIdx = this.actualIndexes[idx];
            const item = player.inventory[actIdx];
            if(item !== undefined) { crop = GetCrop(item[0]); }
        } else if(this.cursor.y > 10) {
            const idx = (this.cursor.y - 12) * this.inventoryWidth + this.cursor.x;
            const item = this.topCrops[idx];
            if(item !== undefined) { crop = GetCrop(item[0]); }
        }

        if(crop !== null) { this.DrawCropText(crop, rowYs, rowTextYs, 0); }
    },
    DrawCropText: function(crop, rowYs, rowTextYs, yOffset) {
        const leftMostX = 4.25;
        const rightMostX = 14;
        const leftMostTextX = 88;
        const starStartX = leftMostX + 1, starDx = 1;

        // Row 0
        gfx.drawText(crop.displayname, leftMostTextX, rowTextYs[yOffset], undefined, 32);
        gfx.drawTileToGrid(crop.name, leftMostX, rowYs[yOffset], "menutext");

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
        gfx.drawTileToGrid(cropSprite, leftMostX + 9.25, rowYs[yOffset], "menutext");
        gfx.drawItemNumber(crop.size, leftMostX + 9.5, rowYs[yOffset], "menutext", true);

        // Row 1
        const seasons = ["spring", "summer", "autumn", "winter"];
        for(let i = 0; i < 4; i++) {
            gfx.drawTileToGrid(seasons[i] + crop.seasons[i], leftMostX + 6.75 + i, rowYs[1 + yOffset], "menutext");
        }

        gfx.drawTileToGrid("inv_power", leftMostX, rowYs[1 + yOffset], "menutext");
        const numStars = crop.power / 2;
        if(numStars > 5) {
            for(let i = 0; i < 5; i++) {
                gfx.drawTileToGrid("starMax", starStartX + i * starDx, rowYs[1 + yOffset], "menutext");
            }
        } else {
            for(let i = 0; i < numStars; i++) {
                gfx.drawTileToGrid("starFull", starStartX + i * starDx, rowYs[1 + yOffset], "menutext");
            }
            if(numStars % 1 !== 0) { gfx.drawTileToGrid("starHalf", starStartX + (numStars - 0.5) * starDx, rowYs[1 + yOffset], "menutext"); }
            for(let i = Math.ceil(numStars); i < 5; i++) {
                gfx.drawTileToGrid("starNone", starStartX + i * starDx, rowYs[1 + yOffset], "menutext");
            }
        }

        // Row 2
        gfx.drawTileToGrid("inv_time", leftMostX, rowYs[2 + yOffset], "menutext");
        if(crop.time === 999 || crop.time === -1) { // NOTE: -1 vs 999 what is the diff?
            gfx.drawTileToGrid("bigNum?", leftMostX + 1, rowYs[2 + yOffset], "menutext");
        }  else {
            gfx.drawBigNumber(crop.time, leftMostX + 1, rowYs[2 + yOffset], "menutext");
        }
        if(crop.respawn > 0) {
            gfx.drawTileToGrid("inv_regrow", leftMostX + 2, rowYs[2 + yOffset], "menutext");
            if(crop.respawn === 999 || crop.respawn === -1) {
                gfx.drawTileToGrid("bigNum?", leftMostX + 3, rowYs[2 + yOffset], "menutext");
            }  else {
                gfx.drawBigNumber(crop.respawn, leftMostX + 3, rowYs[2 + yOffset], "menutext");
            }
        }

        const bonusesToPush = [];
        if(crop.waterResist) { bonusesToPush.push("waterIco" + crop.waterResist); }
        if(crop.fireResist) { bonusesToPush.push("fireIco" + crop.fireResist); }
        if(crop.stickChance) { bonusesToPush.push("stunIco" + crop.stickChance); }
        if(crop.saltResist) { bonusesToPush.push("saltIco" + crop.saltResist); }
        if(crop.saltClean) { bonusesToPush.push("saltIcoX"); }
        if(crop.animal) { bonusesToPush.push(animalInfo[crop.animal].invSprite); }
        for(let i = 0; i < bonusesToPush.length; i++) {
            gfx.drawTileToGrid(bonusesToPush[i], rightMostX - 0.25 - i, rowYs[2 + yOffset], "menutext");
        }
    }
};
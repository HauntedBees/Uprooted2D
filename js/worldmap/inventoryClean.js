worldmap.invClean = {
    cursor: { x: 0, y: 0 }, inventoryWidth: 4, 
    topCrops: [], topPrice: 0, didConfirm: false,
    layersToClear: ["menuA", "menucursorA", "menucursorB", "menutext", "tutorial", "menuOverBlack", "menutextOverBlack"],
    actualIndexes: [], selectedCrop: -1, trashInfo: [], trashIdx: 0,
    setup: function(newItems) {
        this.cursor = { x: 0, y: 0 };
        this.selectedCrop = -1;
        this.trashInfo = [];
        this.topCrops = newItems;
        this.topPrice = 0;
        this.didConfirm = false;
        this.trashIdx = setInterval(this.HandleTrashCan, 50);
        this.DrawAll();
    },
    DrawAll: function() {
        gfx.clearSome(this.layersToClear);
        this.actualIndexes = [];
        var j = 0;
        for(var i = 0; i < player.inventory.length; i++) {
            if(player.inventory[i][0][0] === "_" || player.inventory[i][0][0] === "!") { continue; }
            gfx.drawInventoryItem(player.inventory[i], j % this.inventoryWidth, Math.floor(j / this.inventoryWidth), "menuA");
            this.actualIndexes.push(i);
            if(i === this.selectedCrop) { gfx.drawCursor(j % this.inventoryWidth, Math.floor(j / this.inventoryWidth), 0, 0, "xcursor"); }
            j++;
        }
        this.topPrice = 0;
        for(var i = 0; i < this.topCrops.length; i++) {
            gfx.drawInventoryItem(this.topCrops[i], i % this.inventoryWidth, 8 + Math.floor(i / this.inventoryWidth), "menuA");
            if(i === (this.selectedCrop - 100)) { gfx.drawCursor(i % this.inventoryWidth, 8 + Math.floor(i / this.inventoryWidth), 0, 0, "xcursor"); }
            this.topPrice += GetCrop(this.topCrops[i][0]).price * this.topCrops[i][1];
        }
        if(this.cursor.x < this.inventoryWidth) { gfx.drawCursor(this.cursor.x, this.cursor.y, 0, 0); }
        if(this.selectedCrop >= 0) { this.DrawSelectInfo(); }
        this.HandleTrashCan(true);
        this.SetCrops();
    },
    clean: function() { clearInterval(this.trashIdx); gfx.clearSome(this.layersToClear); },
    cancel: function() {
        if(this.selectedCrop < 0) { this.cursor.x = this.inventoryWidth; }
        else { this.selectedCrop = -1; }
        this.DrawAll();
    },
    mouseMove: function(pos) {
        if(pos.x < 0 || pos.y < 0 || pos.y > 9) { return false; }
        if(pos.y === 7) {
            var dy = pos.y - this.cursor.y;
            pos.y += dy;
        }
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
            for(var i = worldmap.invClean.trashInfo.length - 1; i >= 0; i--) {
                var ti = worldmap.invClean.trashInfo[i];
                var trashFrame = ti.frame > 5 ? 0 : ti.frame;
                gfx.drawTileToGrid("animBin" + trashFrame, ti.x, ti.y, "tutorial");
                if(!fromDrawAll) { ti.frame++; }
                if(ti.numCoins > 0 && ti.frame % 3 === 0) {
                    ti.numCoins -= 1;
                    ti.coinStates.push({ frame: 0, x: ti.x, y: ti.y, done: false });
                }
                var allCoinsDone = true;
                for(var j = 0; j < ti.coinStates.length; j++) {
                    var coin = ti.coinStates[j];
                    if(coin.done) { continue; }
                    allCoinsDone = false;
                    var coinFrame = coin.frame > 3 ? 0 : coin.frame;
                    coin.done = (coin.frame > 4);
                    coin.y -= 0.25;
                    coin.frame++;
                    gfx.drawTileToGrid("animCoin" + coinFrame, coin.x, coin.y, "tutorial");
                }
                if(allCoinsDone && ti.frame > 6) { worldmap.invClean.trashInfo.splice(i, 1); }
            }
        } else {
            gfx.drawTileToGrid("animBin0", 4, 9, "tutorial");
            if(worldmap.invClean.didConfirm) {
                clearInterval(worldmap.invClean.trashIdx);
                game.transition(worldmap.invClean, worldmap, { init: worldmap.pos, map: worldmap.mapName, noEntityUpdate: true });
            }
        }
    },
    DrawSelectInfo: function() {
        var idx = this.cursor.y * this.inventoryWidth + this.cursor.x;
        var actIdx = this.actualIndexes[idx];
        var text = "";
        if(actIdx === this.selectedCrop) {
            text = GetText("inv.unselect");
        } else if(this.cursor.x === this.inventoryWidth) {
            text = GetText("inv.drop");
            var invfo = player.inventory[this.selectedCrop];
            var price = Math.ceil(GetCrop(invfo[0]).price * invfo[1] * 0.1);
            text = text.replace(/\{0\}/g, price);
        } else {
            text = GetText("inv.swap");
        }

        var y = this.cursor.y + 0.5, x = 4.5;
        var xi = 1;
        var width = gfx.getTextWidth(text) + 20;
        var xiimax = x + Math.ceil(width / 64);
        while(xiimax > 14) { x -= 1; xiimax = x + Math.ceil(width / 64); }
        gfx.drawSprite("sheet", 41, 15, x * 16, 2 + y * 16, "menuOverBlack");
        while(width > 128) {
            width -= 64;
            gfx.drawSprite("sheet", 42, 15, x * 16 + 16 * xi++, 2 + y * 16, "menuOverBlack");
        }
        gfx.drawSprite("sheet", 43, 15, x * 16 + 16 * xi, 2 + y * 16, "menuOverBlack");
        gfx.drawText(text, 7 + x * 16, 10.5 + y * 16, undefined, undefined, "menutextOverBlack");
    },
    ConfirmSelection: function() {
        this.trashInfo.push({ frame: 0, coinStates: [], x: 4, y: 9, numCoins: Math.ceil(this.topPrice / 20) });
        player.monies += this.topPrice;
        this.didConfirm = true;
    },
    click: function(pos) {
        if(this.didConfirm) { return false; }
        if(this.cursor.x === this.inventoryWidth) { return this.ConfirmSelection(); }
        var newidx = -1;
        if(this.cursor.y < 7) {
            var idx = this.cursor.y * this.inventoryWidth + this.cursor.x;
            if(this.actualIndexes[idx] !== undefined) { newidx = this.actualIndexes[idx]; }
        } else if(this.cursor.y > 7) {
            var idx = (this.cursor.y - 8) * this.inventoryWidth + this.cursor.x;
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
                var takenCrop = this.topCrops.splice(this.selectedCrop - 100, 1)[0];
                if(!player.increaseItem(takenCrop[0], takenCrop[1])) { this.topCrops.push(takenCrop); }
            } else if(this.selectedCrop < 100 && newidx === 99) { // putting inventory item into empty tossable space
                var takenCrop = player.inventory.splice(this.selectedCrop, 1)[0];
                this.topCrops.push(takenCrop);
            } else if(this.selectedCrop >= 100 && newidx >= 100) { // sorting the tossables for some reason
                newidx -= 100;
                this.selectedCrop -= 100;
                var temp = this.topCrops[newidx];
                this.topCrops[newidx] = this.topCrops[this.selectedCrop];
                this.topCrops[this.selectedCrop] = temp;
            } else if(this.selectedCrop < 100 && newidx < 100) { // sorting inventory for some reason
                var temp = player.inventory[newidx];
                player.inventory[newidx] = player.inventory[this.selectedCrop];
                player.inventory[this.selectedCrop] = temp;
            } else if(this.selectedCrop < 100 && newidx >= 100) { // swapping tossable with inventory
                var temp = this.topCrops[newidx - 100];
                this.topCrops[newidx - 100] = player.inventory[this.selectedCrop];
                player.inventory[this.selectedCrop] = temp;
            } else if(this.selectedCrop >= 100 && newidx < 100) { // swapping inventory with tossable
                var temp = player.inventory[newidx];
                player.inventory[newidx] = this.topCrops[this.selectedCrop - 100];
                this.topCrops[this.selectedCrop - 100] = temp;
            }
            this.selectedCrop = -1;
        }
        this.DrawAll();
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
    DrawConfirmButton: function() {
        var text = GetText("falconConfirm");
        var y = 9, x = 7, xi = 1;
        var width = gfx.getTextWidth(text) + 20;
        var xiimax = x + Math.ceil(width / 64);
        var isSelected = this.cursor.x === this.inventoryWidth;
        while(xiimax > 14) { x -= 1; xiimax = x + Math.ceil(width / 64); }
        gfx.drawSprite("sheet", isSelected ? 41 : 39, isSelected ? 15 : 16, x * 16, 2 + y * 16, "menuOverBlack");
        while(width > 128) {
            width -= 64;
            gfx.drawSprite("sheet", isSelected ? 42 : 7, isSelected ? 15 : 11, x * 16 + 16 * xi++, 2 + y * 16, "menuOverBlack");
        }
        if(isSelected) { gfx.drawCursor(x, y, xi, 0); }
        gfx.drawSprite("sheet", isSelected ? 43 : 8, isSelected ? 15 : 11, x * 16 + 16 * xi, 2 + y * 16, "menuOverBlack");
        gfx.drawText(text, 7 + x * 16, 10.5 + y * 16, undefined, undefined, "menutextOverBlack");
    },
    SetCrops: function() {
        var rowYs = [0.25, 1.5, 2.75, 6.25, 7.5, 8.75];
        var rowTextYs = [16, 0, 0, 113, 0, 0];
        gfx.drawInfobox(11, 4, 0);
        gfx.drawInfobox(11, 4, 4);
        gfx.drawInfobox(10, 2, 8);
        gfx.drawTileToGrid("recycleArrow", 4, 8, "menuA");

        gfx.drawWrappedText(GetText("fullSelect"), 70, 75, 160);
        gfx.drawWrappedText(GetText("fullToss").replace(/\{0\}/g, this.topPrice), 90, 140, 130);
        this.DrawConfirmButton();
 
        var crop = null;
        if(this.cursor.y < 7) {
            var idx = this.cursor.y * this.inventoryWidth + this.cursor.x;
            var actIdx = this.actualIndexes[idx];
            var item = player.inventory[actIdx];
            if(item !== undefined) { crop = GetCrop(item[0]); }
        } else if(this.cursor.y > 7) {
            var idx = (this.cursor.y - 8) * this.inventoryWidth + this.cursor.x;
            var item = this.topCrops[idx];
            if(item !== undefined) { crop = GetCrop(item[0]); }
        }

        if(crop !== null) { this.DrawCropText(crop, rowYs, rowTextYs, 0); }
    },
    DrawCropText: function(crop, rowYs, rowTextYs, yOffset) {
        var leftMostX = 4.25;
        var rightMostX = 14;
        var leftMostTextX = 88;
        var starStartX = leftMostX + 1, starDx = 1;

        // Row 0
        gfx.drawText(crop.displayname, leftMostTextX, rowTextYs[yOffset], undefined, 32);
        gfx.drawTileToGrid(crop.name, leftMostX, rowYs[yOffset], "menutext");

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
        gfx.drawTileToGrid(cropSprite, leftMostX + 9.25, rowYs[yOffset], "menutext");
        gfx.drawItemNumber(crop.size, leftMostX + 9.5, rowYs[yOffset], "menutext", true);

        // Row 1
        var seasons = ["spring", "summer", "autumn", "winter"];
        for(var i = 0; i < 4; i++) {
            gfx.drawTileToGrid(seasons[i] + crop.seasons[i], leftMostX + 6.75 + i, rowYs[1 + yOffset], "menutext");
        }

        gfx.drawTileToGrid("inv_power", leftMostX, rowYs[1 + yOffset], "menutext");
        var numStars = crop.power / 2;
        if(numStars > 5) {
            for(var i = 0; i < 5; i++) {
                gfx.drawTileToGrid("starMax", starStartX + i * starDx, rowYs[1 + yOffset], "menutext");
            }
        } else {
            for(var i = 0; i < numStars; i++) {
                gfx.drawTileToGrid("starFull", starStartX + i * starDx, rowYs[1 + yOffset], "menutext");
            }
            if(numStars % 1 !== 0) { gfx.drawTileToGrid("starHalf", starStartX + (numStars - 0.5) * starDx, rowYs[1 + yOffset], "menutext"); }
            for(var i = Math.ceil(numStars); i < 5; i++) {
                gfx.drawTileToGrid("starNone", starStartX + i * starDx, rowYs[1 + yOffset], "menutext");
            }
        }

        // Row 2
        gfx.drawTileToGrid("inv_time", leftMostX, rowYs[2 + yOffset], "menutext");
        var timeNum = crop.time;
        if(crop.time === 999 || crop.time === -1) { // TODO: -1 vs 999 what is the diff?
            gfx.drawTileToGrid("bigNum?", leftMostX + 1, rowYs[2 + yOffset], "menutext");
        }  else {
            gfx.drawBigNumber(crop.time, leftMostX + 1, rowYs[2 + yOffset], "menutext");
        }
        if(crop.respawn > 0) {
            //timeNum = crop.respawn;
            gfx.drawTileToGrid("inv_regrow", leftMostX + 2, rowYs[2 + yOffset], "menutext");
            if(crop.respawn === 999 || crop.respawn === -1) {
                gfx.drawTileToGrid("bigNum?", leftMostX + 3, rowYs[2 + yOffset], "menutext");
            }  else {
                gfx.drawBigNumber(crop.respawn, leftMostX + 3, rowYs[2 + yOffset], "menutext");
            }
        }

        var bonusesToPush = [];
        if(crop.waterResist) { bonusesToPush.push("waterIco" + crop.waterResist); }
        if(crop.fireResist) { bonusesToPush.push("fireIco" + crop.fireResist); }
        if(crop.stickChance) { bonusesToPush.push("stunIco" + crop.stickChance); }
        if(crop.saltResist) { bonusesToPush.push("saltIco" + crop.saltResist); }
        if(crop.saltClean) { bonusesToPush.push("saltIcoX"); }
        if(crop.animal) { bonusesToPush.push("animal" + crop.animal); }
        for(var i = 0; i < bonusesToPush.length; i++) {
            gfx.drawTileToGrid(bonusesToPush[i], rightMostX - 0.25 - i, rowYs[2 + yOffset], "menutext");
        }
    }
};
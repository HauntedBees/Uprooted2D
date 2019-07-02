pausemenu.inventory = {
    cursor: { x: 0, y: 0 }, inventoryWidth: 3, cropDY: 1.5, cropDX: 0.5, animHelper: null, 
    layersToClear: ["menuA", "menutext", "tutorial", "menuOverBlack", "menutextOverBlack"],
    actualIndexes: [], selectedCrop: -1, trashInfo: [], trashIdx: 0, inSort: false, justSorted: -1, 
    backStartX: 0, backButtonW: 0, sortStartX: 0, sortButtonW: 0,  
    setup: function() {
        this.cursor = { x: 0, y: 0 };
        this.cursors = new CursorAnimSet([
            { key: "main", x: this.cursor.x, y: this.cursor.y, w: 0, h: 0, type: "cursor", layer: "menucursorA" },
            { key: "alt", x: -1, y: -1, w: 0, h: 0, type: "xcursor", layer: "menucursorB" }
        ]);
        this.selectedCrop = -1;
        this.inSort = false;
        this.animHelper = new CombatAnimHelper([]);
        this.trashInfo = [];
        this.justSorted = -1;
        this.trashIdx = setInterval(this.HandleTrashCan, 50);
        gfx.TileBackground("invTile");
        this.backStartX = 0.125;
        this.backButtonW = gfx.drawInfoText(GetText("menu.Back"), this.backStartX, -0.0625, false, "menuA", "menutext");
        this.sortStartX = 1.25 + this.backButtonW;
        this.sortButtonW = gfx.drawInfoText(GetText("inv.Sort"), this.sortStartX, -0.0625, false, "menuA", "menutext");
        this.DrawAll();
        this.cursors.Start();
    },
    DrawAll: function() {
        gfx.clearSome(this.layersToClear);
        pausemenu.DrawInnerHeading("inv.Heading");

        this.actualIndexes = [];
        let j = 0;
        if(this.selectedCrop < 0) { this.cursors.MoveCursor("alt", -1, -1); }
        for(let i = 0; i < player.inventory.length; i++) {
            if(player.inventory[i][0][0] === "_" || player.inventory[i][0][0] === "!") { continue; }
            const thisX = j % this.inventoryWidth + this.cropDX;
            const thisY = Math.floor(j / this.inventoryWidth) + this.cropDY;
            gfx.drawTileToGrid("invBox", thisX, thisY, "menuA");
            gfx.drawInventoryItem(player.inventory[i], thisX, thisY, "menuA");
            this.actualIndexes.push(i);
            if(i === this.selectedCrop) {
                this.cursors.MoveCursor("alt", thisX, thisY);
            }
            j++;
        }
        for(let i = j; i < 36; i++) {
            const thisX = i % this.inventoryWidth + this.cropDX;
            const thisY = Math.floor(i / this.inventoryWidth) + this.cropDY;
            gfx.drawTileToGrid("invBox", thisX, thisY, "menuA");
        }
        this.animHelper.DrawWrapper(this.cropDX, this.cropDY, this.inventoryWidth, 36 / this.inventoryWidth);

        if(this.actualIndexes.length === 0) { this.cursor = { x: 0, y: -1 }; }
        
        gfx.drawInfoText(GetText("menu.Back"), this.backStartX, -0.0625, this.cursor.y === -1 && this.cursor.x === 0, "menuA", "menutext");
        gfx.drawInfoText(GetText("inv.Sort"), this.sortStartX, -0.0625, this.cursor.y === -1 && this.cursor.x === 1, "menuA", "menutext");
        if(this.inSort) {
            const vals = [];
            vals.push(gfx.drawInfoText(GetText("inv.sCount"), this.sortStartX, 1, this.cursor.y === 0));
            vals.push(gfx.drawInfoText(GetText("inv.sPower"), this.sortStartX, 2, this.cursor.y === 1));
            vals.push(gfx.drawInfoText(GetText("inv.sTime"), this.sortStartX, 3, this.cursor.y === 2));
            vals.push(gfx.drawInfoText(GetText("inv.sType"), this.sortStartX, 4, this.cursor.y === 3));
            if(this.cursor.y === -1) { this.cursors.RedimCursor("main", this.sortStartX, 0, this.sortButtonW, -0.25); }
            else { this.cursors.RedimCursor("main", -2, -2, 0, 0); }
        }

        if(!this.inSort) {
            if(this.cursor.y === -1) {
                const thisX = this.cursor.x === 0 ? this.backStartX : this.sortStartX;
                const thisW = this.cursor.x === 0 ? this.backButtonW : this.sortButtonW;
                this.cursors.RedimCursor("main", thisX, 0, thisW, -0.25);
            } else if(this.cursor.x < this.inventoryWidth) {
                this.cursors.RedimCursor("main", this.cursor.x + this.cropDX, this.cursor.y + this.cropDY, 0, 0);
            } else {
                this.cursors.RedimCursor("main", this.cursor.x + this.cropDX, this.cursor.y + this.cropDY, 0, 0);
            }
        }
        if(this.selectedCrop >= 0) { this.DrawSelectInfo(); }
        this.HandleTrashCan(true);

        if(this.cursor.y >= 0 && !this.inSort) {
            this.SetCrop();
        } else {
            gfx.drawMinibox(4, this.cropDY - 0.25, 10.75, 11.5);
            const textX = 76, textY = 12 + this.cropDY * 16;
            if(this.cursor.x === 0) {
                gfx.drawWrappedText(GetText("inv.BackInfo"), textX, textY, 170, undefined, undefined, 28);
            } else if(this.cursor.x === 1) {
                gfx.drawWrappedText(GetText("inv.SortInfo"), textX, textY, 170, undefined, undefined, 28);
            }
        }
    },
    clean: function() {
        clearInterval(this.trashIdx);
        this.cursors.Perish();
        gfx.clearAll(true);
    },
    cancel: function() {
        if(this.inSort) {
            this.inSort = false;
            this.cursor = { x: 1, y: - 1 };
            this.DrawAll();
        } else if(this.selectedCrop < 0) { game.innerTransition(this, pausemenu); }
        else { this.selectedCrop = -1; if(this.cursor.x >= this.inventoryWidth) { this.cursor.x = this.inventoryWidth - 1; } this.DrawAll(); }
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
        if(this.inSort) {
            if(pos.y < 0 || pos.y > 3 || pos.x != 1) { return false; }
        } else {
            if((this.cursor.y === 0 && pos.y === -1) || (this.cursor.y === -1 && pos.y === 0)) {
                pos.x = 0;
            }
            if(pos.y < -1 || pos.x < 0) { return false; }
            if(pos.y === -1 && (pos.x > 1 || this.selectedCrop >= 0)) { return false; }
        }
        if(isEnter) { return this.click(); }
        else { return this.CursorMove(pos); }
    },
    mouseMove: function(pos) {
        const dpos = { x: pos.x - this.cropDX, y: pos.y - this.cropDY };
        if(this.inSort) {
            dpos.y += this.cropDY;
            input.FloorPoint(dpos);
            if(dpos.y > 4) { return false; }
            dpos.x = 1;
            dpos.y -= 1;
        } else if(dpos.y < 0) {
            dpos.x += this.cropDX;
            dpos.y = -1;
            if(dpos.x >= this.backStartX && dpos.x < this.sortStartX) {
                dpos.x = 0;
            } else if(dpos.x >= this.sortStartX && dpos.x <= (this.sortStartX + this.sortButtonW + 1)) {
                dpos.x = 1;
            } else { return false; }
        } else {
            input.FloorPoint(dpos);
            if(dpos.y < 0) { return false; }
            if(dpos.x > this.inventoryWidth) { return false; }
        }
        this.CursorMove(dpos);
    },
    CursorMove: function(pos) {
        if(this.inSort) {
            if(pos.y < -1 || pos.y > 3 || pos.x != 1) { return false; }
        } else {
            if(pos.x < 0 || pos.y < -1) { return false; }
            if(this.selectedCrop < 0) {
                if(pos.x >= this.inventoryWidth) { return false; }
                const idx = pos.y * this.inventoryWidth + pos.x;
                if(idx >= this.actualIndexes.length) { return false; }
            } else {
                if(pos.x > this.inventoryWidth || pos.y >= (36 / this.inventoryWidth)) { return false; }
            }
        }
        this.cursor = { x: pos.x, y: pos.y };
        this.DrawAll();
        return true;
    },
    HandleTrashCan: function(fromDrawAll) {
        gfx.clearLayer("tutorial");
        if(pausemenu.inventory.selectedCrop < 0 && pausemenu.inventory.trashInfo.length === 0) { return; }
        if(pausemenu.inventory.selectedCrop >= 0) { gfx.drawTileToGrid("animBin0", 3.5, pausemenu.inventory.cropDY + pausemenu.inventory.cursor.y, "tutorial"); }
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

        const y = this.cropDY + this.cursor.y + 0.5, x = 4.5;
        let xi = 1;
        let width = gfx.getTextWidth(text) + 20;
        let xiimax = x + Math.ceil(width / 64);
        while(xiimax > 14) { x -= 1; xiimax = x + Math.ceil(width / 64); }
        gfx.drawTile("recSelL", x * 16, y * 16 - 5, "menuOverBlack");
        while(width > 128) {
            width -= 64;
            gfx.drawTile("recSelM", x * 16 + 16 * xi++, y * 16 - 5, "menuOverBlack");
        }
        gfx.drawTile("recSelR", x * 16 + 16 * xi, y * 16 - 5, "menuOverBlack");
        gfx.drawText(text, 7 + x * 16, 3.5 + y * 16, undefined, undefined, "menutextOverBlack");
    },
    click: function() {
        if(this.inSort) {
            if(this.cursor.y < -1 || this.cursor.y > 3 || this.cursor.x != 1) { return false; }
            if(this.cursor.y === -1) { this.cancel(); this.DrawAll(); return true; }
            const nonCrops = player.inventory.filter(e => e[0][0] === "_" || e[0][0] === "!");
            const crops = player.inventory.filter(e => e[0][0] !== "_" && e[0][0] !== "!");
            switch(this.cursor.y) {
                case 0: // amount
                    if(this.justSorted === 0) {
                        crops.sort((a, b) => a[1] - b[1]);
                    } else {
                        crops.sort((a, b) => b[1] - a[1]);
                    }
                    break;
                case 1: // power
                    if(this.justSorted === 1) {
                        crops.sort((a, b) => GetCrop(a[0]).power - GetCrop(b[0]).power);
                    } else {
                        crops.sort((a, b) => GetCrop(b[0]).power - GetCrop(a[0]).power);
                    }
                    break;
                case 2: // growth time
                    if(this.justSorted === 2) {
                        crops.sort((a, b) => GetCrop(b[0]).time - GetCrop(a[0]).time);
                    } else {
                        crops.sort((a, b) => GetCrop(a[0]).time - GetCrop(b[0]).time);
                    }
                    break;
                case 3: // type
                    const CropSort = function(a) {
                        switch(a.type) {
                            case "veg": return 0;
                            case "tree": return 1;
                            case "mush": return 2;
                            case "egg": return 3;
                            case "rice": return 4;
                            case "spear": return 5;
                            case "water": return 6;
                            case "rod": return 7;
                            case "food": return 8;
                            case "bee": return 9;
                            case "tech": return 10;
                            case "sickle2": return 11;
                            case "moist": return 12;
                        }
                        return 13;
                    }
                    if(this.justSorted === 3) {
                        crops.sort((a, b) => CropSort(GetCrop(b[0])) - CropSort(GetCrop(a[0])));
                    } else {
                        crops.sort((a, b) => CropSort(GetCrop(a[0])) - CropSort(GetCrop(b[0])));
                    }
                    break;
            }
            player.inventory = [...crops, ...nonCrops];
            this.justSorted = (this.justSorted === this.cursor.y) ? -1 : this.cursor.y;
            this.cancel();
        } else if(this.cursor.y === -1) {
            if(this.cursor.x === 0) {
                game.innerTransition(this, pausemenu);
                return true;
            } else {
                this.inSort = true;
                this.cursor.y = 0;
                this.DrawAll();
                return true;
            }
        } else if(this.cursor.x === this.inventoryWidth) {
            const invfo = player.inventory[this.selectedCrop];
            const price = Math.ceil(GetCrop(invfo[0]).price * invfo[1] * 0.1);
            player.AddMonies(price);
            player.inventory.splice(this.selectedCrop, 1);
            this.trashInfo.push({ frame: 0, coinStates: [], x: 3.5, y: (pausemenu.inventory.cropDY + pausemenu.inventory.cursor.y), numCoins: Math.min(10, Math.ceil(price / 30)) });
            this.selectedCrop = -1;
            this.cursor.x = this.inventoryWidth - 1;
        } else {
            const idx = this.cursor.y * this.inventoryWidth + this.cursor.x;
            const actIdx = this.actualIndexes[idx];
            if(actIdx === undefined) {
                const temp = player.inventory[this.selectedCrop];
                player.inventory.splice(this.selectedCrop, 1);
                player.inventory.push(temp);
                this.selectedCrop = -1;
                const numItems = this.actualIndexes.length - 1;
                this.cursor.x = numItems % this.inventoryWidth;
                this.cursor.y = Math.floor(numItems / this.inventoryWidth);
            } else if(this.selectedCrop < 0) {
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
            this.justSorted = -1;
        }
        this.DrawAll();
        return true;
    },
    SetCrop: function() {
        const rowYs = [0.25, 1.5, 2.75];
        const rowTextYs = [16, 32, 57, 72];
        const leftMostX = 4.75;
        const rightMostX = 14;
        const leftMostTextX = 92;
        rowYs.forEach((e, i) => rowYs[i] = e + pausemenu.inventory.cropDY - 0.25);
        rowTextYs.forEach((e, i) => rowTextYs[i] = e + pausemenu.inventory.cropDY * 16 - 4);
        gfx.drawMinibox(4, this.cropDY - 0.25, 10.75, 11.5);

        const idx = (this.cursor.x === this.inventoryWidth ? this.selectedCrop : (this.cursor.y * this.inventoryWidth + this.cursor.x));
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
        if(crop.time === 999 || crop.time === -1) { // NOTE: -1 vs 999 what is the diff?
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
        if(crop.animal) { bonusesToPush.push(animalInfo[crop.animal].invSprite); }
        for(let i = 0; i < bonusesToPush.length; i++) {
            gfx.drawTileToGrid(bonusesToPush[i], rightMostX - 0.25 - i, rowYs[2], "menutext");
        }
        
        // Row 3
        gfx.drawWrappedText(GetText(crop.name), leftMostTextX - 16, rowTextYs[3], 170, undefined, undefined, 28);
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
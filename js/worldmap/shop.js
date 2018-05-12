me.sellStates = { BUYING: 0, SELLSELECT: 1, SELLING: 2, READING: 3 };
me.sellTypes = {
    CROPS: "", CROPSIDX: 1, 
    EQUIPMENT: "!", EQUIPIDX: 2, 
    FIXTURES: "_", FIXIDX: 3
};
worldmap.shop = {
    details: null, cursorX: 0,
    initx: 1, dx: 2, yPos: 7, cursorInitx: 0,
    sellingState: me.sellStates.BUYING, sellingType: me.sellTypes.CROPS, actualIdxs: [],
    maxSell: 12, sellOffset: 0, numArrows: 0, isUpgradeShop: false,
    bookReading: null, bookState: -1,
    layersToClear: ["characters", "menutext"],
    availableIndexes: [], hasTalk: "", isQuestTalk: true, 
    sleepsyData: null, howManyData: null, 
    blinkIdx: -1, blinkState: 0, 
    setup: function(shopName) {
        this.details = stores[shopName];
        this.sellingState = me.sellStates.BUYING;
        this.sellingType = me.sellTypes.CROPS;
        this.hasTalk = (this.details.talk && player.questsCleared.indexOf(this.details.talk) < 0) ? this.details.talk : "";
        if(this.details.benignTalk && this.hasTalk === "") {
            this.isQuestTalk = false;
            this.hasTalk = this.details.benignTalk;
        } else { this.isQuestTalk = true; }
        this.sellOffset = 0;
        this.numArrows = 0;
        this.bookReading = null;
        this.bookState = -1;
        this.sleepsyData = null;
        this.howManyData = null;
        if(this.details.wares.length > 6 || (this.details.doesSell && this.details.wares.length > 5)) {
            this.dx = 1;
            this.initx = (this.hasTalk || this.details.doesSell) ? 3 : 2;
        } else {
            this.dx = 2;
            this.initx = (this.hasTalk || this.details.doesSell) ? 5 : 3;
        }
        this.cursorInitx = (this.hasTalk || this.details.doesSell) ? 2 : 1;
        this.cursorX = 0;
        this.cursors = new CursorAnimSet([
            { key: "main", x: this.cursorX, y: this.yPos, w: 0, h: 0, type: "cursor", layer: "menucursorA" }
        ]);
        gfx.drawFullImage(this.details.img);
        this.DrawDetails(GetText(this.details.opening), true);
        this.cursors.Start();
        this.blinkIdx = setInterval(this.Blinking, 50);
        this.blinkState = 0;
    },
    Blinking: function() {
        const blinkProb = (worldmap.shop.details.rapid ? 0.3 : 0.98);
        const blinkH = (worldmap.shop.details.big ? 300 : 100);
        if(worldmap.shop.blinkState === -1 || (worldmap.shop.blinkState === 0 && Math.random() >= blinkProb)) {
            worldmap.shop.blinkState = 1;
            gfx.drawImage(gfx.ctx["foreground"], gfx.spritesheets[worldmap.shop.details.eyes], 0, 0, 200, blinkH, worldmap.shop.details.ex, worldmap.shop.details.ey, 200, blinkH);
        } else {
            if(worldmap.shop.blinkState > 2 || (worldmap.shop.blinkState * Math.random()) > 0.45) {
                gfx.clearLayer("foreground");
                worldmap.shop.blinkState = Math.random() < 0.15 ? -1 : 0;
            }
        }
    },
    resetTalk: function() {
        this.hasTalk = "";
        if(this.details.doesSell) { return; }
        if(this.details.wares.length > 6 || (this.details.doesSell && this.details.wares.length > 5)) {
            this.initx = 2;
        } else {
            this.initx = 3;
        }
        this.cursorInitx = 1;
    },
    DrawDetails: function(text, isopening) {
        gfx.clearSome(this.layersToClear);
        switch(this.sellingState) {
            case me.sellStates.SELLING: this.DrawDetailsSelling(); break;
            case me.sellStates.SELLSELECT: this.DrawDetailsSellingSelect(); break;
            case me.sellStates.READING:
            case me.sellStates.BUYING: this.DrawDetailsBuying(); break;
        }
        if(this.isUpgradeShop && this.availableIndexes.length === 0 && isopening) { text = GetText(this.details.empty); }
        gfx.drawText(GetText("s.coins").replace(/\{0\}/g, player.monies), 2, 16 * 9.25 + 1.5, "#FFFFFF");
        if(text === undefined) {
            if(this.sellingState === me.sellStates.BUYING) { this.DrawText(); }
        } else {
             this.WriteWrappedText(text);
        }
    },
    WriteWrappedText: function(text, y) {
        y = y || 159; // 16 * 10 - 1
        gfx.drawWrappedText(text, 4, y, 250, "#FFFFFF");
    },
    isValidSellIdx: function(i) {
        if(this.sellingType === me.sellTypes.CROPS) {
            if(player.inventory[i][0][0] === me.sellTypes.FIXTURES || player.inventory[i][0][0] === me.sellTypes.EQUIPMENT) {
                return false;
            }
        } else if(player.inventory[i][0][0] !== this.sellingType) {
            return false;
        }
        if(this.sellingType === me.sellTypes.EQUIPMENT && player.isEquipped(player.inventory[i][0])) { return false; }
        return true;
    },
    getNthMatchingIdx: function(n) {
        if(n === 0) { return 0; }
        let j = -1;
        for(let i = 0; i < player.inventory.length; i++) {
            if(!this.isValidSellIdx(i)) { continue; }
            if(++j === n) { return i; }
        }
        return 0;
    },
    DrawDetailsSelling: function() {
        let j = 0;
        this.actualIdxs = [];
        this.numArrows = 0;
        const max = this.maxSell;
        if(this.sellOffset > 0) {
            this.numArrows += 1;
            gfx.drawTileToGrid("arrowL", 1, this.yPos, "characters");
        } else {
            gfx.drawTileToGrid("exit", 1, this.yPos, "characters");
        }
        let addArrow = false, lastIdx = 0;
        for(let i = this.getNthMatchingIdx(this.sellOffset); i < player.inventory.length; i++) {
            if(!this.isValidSellIdx(i)) { continue; }
            if((j + 1) === max) {
                addArrow = true;
                lastIdx = i;
                break;
            }
            gfx.drawInventoryItem(player.inventory[i], 2 + j, this.yPos, "characters");
            this.actualIdxs.push(i);
            j++;
        }
        if(addArrow) {
            let isLastItem = true;
            for(let i = lastIdx + 1; i < player.inventory.length; i++) {
                if(this.isValidSellIdx(i)) { isLastItem = false; break; }
            }
            if(isLastItem) {
                gfx.drawInventoryItem(player.inventory[lastIdx], 2 + (this.maxSell - 1), this.yPos, "characters");
                this.actualIdxs.push(lastIdx);
            } else {
                gfx.drawTileToGrid("arrowR", 2 + (this.maxSell - 1), this.yPos, "characters");
                this.numArrows += 2;
            }
        }
        this.cursors.RedimCursor("main", 1 + this.cursorX, this.yPos, 0, 0);
    },
    DrawDetailsSellingSelect: function() {
        gfx.drawTileToGrid("exit", 4, this.yPos, "characters");
        gfx.drawTileToGrid("seeds", 6, this.yPos, "characters");
        gfx.drawTileToGrid("tools", 8, this.yPos, "characters");
        gfx.drawTileToGrid("fixtures", 10, this.yPos, "characters");
        this.cursors.RedimCursor("main", 4 + this.cursorX * 2, this.yPos, 0, 0);
    },
    DrawDetailsBuying: function() {
        gfx.drawTileToGrid("exit", 1, this.yPos, "characters");
        if(this.hasTalk) {
            const talkTile = (this.isQuestTalk ? "helpBox" : "talk");
            gfx.drawTileToGrid(talkTile, (this.details.doesSell ? 2 : 1) + this.dx, this.yPos, "characters");
        } else if(this.details.doesSell) {
            gfx.drawTileToGrid("sell", 1 + this.dx, this.yPos, "characters");
        }
        this.availableIndexes = []; let j = 0;
        this.isUpgradeShop = false;
        let widecursor = false;
        for(let i = 0; i < this.details.wares.length; i++) {
            if(this.details.wares[i].type === "upgrade") {
                this.isUpgradeShop = true;
                const res = sprites[this.details.wares[i].product + "-" + player.gridLevel];
                if(res === undefined) { continue; }
                this.availableIndexes.push(i);
                gfx.drawTileToGrid(this.details.wares[i].product + "-" + player.gridLevel, this.initx + j * this.dx, this.yPos, "characters");
                j++;
            } else {
                if(this.details.wares[i].locked !== undefined && player.questsCleared.indexOf(this.details.wares[i].locked) < 0) { continue; }
                this.availableIndexes.push(i);
                if(this.details.wares[i].type === "equipment") {
                    gfx.drawTileToGrid(this.details.wares[i].product, this.initx + j * this.dx, this.yPos, "characters");
                } else if(this.bookState >= 0 && (this.cursorX - 1) === i) {
                    gfx.drawTileToGrid("bookOpenL", this.initx + j * this.dx - 0.5, this.yPos, "characters");
                    gfx.drawTileToGrid("bookOpenR", this.initx + j * this.dx + 0.5, this.yPos, "characters");
                    widecursor = true;
                    this.cursors.RedimCursor("main", 0.75 + this.cursorX * this.dx, this.yPos, 0.5, 0);
                } else {
                    gfx.drawTileToGrid(this.details.wares[i].product, this.initx + j * this.dx, this.yPos, "characters");
                }
                j++;
            }
        }
        if(!widecursor) { this.cursors.RedimCursor("main", 1 + this.cursorX * this.dx, this.yPos, 0, 0); }
    },
    mouseMove: function(pos) {
        switch(this.sellingState) {
            case me.sellStates.SELLING: return this.mouseMoveSelling(pos);
            case me.sellStates.SELLSELECT: return this.mouseMoveSellSelect(pos);
            case me.sellStates.BUYING: return this.mouseMoveBuying(pos);
        }
    },
    mouseMoveSelling: function(pos) {
        const newCursorX = pos.x - 1;
        if(newCursorX < 0) { return false; }
        if((this.numArrows & 2) === 2) {
            if(newCursorX > (this.actualIdxs.length + 1)) { return false; }
        } else {
            if(newCursorX > this.actualIdxs.length) { return false; }
        }
        this.cursorX = newCursorX;
        let text = "hi im craig";
        if(this.cursorX === 0) {
            if((this.numArrows & 1) === 1) {
                text = GetText("shop.back");
            } else {
                text = GetText(this.details.leaveSell);
            }
        } else if((this.numArrows & 2) === 2 && newCursorX > this.actualIdxs.length) {
            text = GetText("shop.forward");
        } else {
            const actualIdx = this.actualIdxs[this.cursorX - 1];
            const item = player.inventory[actualIdx][0];
            switch(this.sellingType) {
                case me.sellTypes.CROPS: {
                    this.DrawDetails();
                    const itemInfo = GetCrop(item);
                    this.DrawSeedText(undefined, itemInfo, Math.floor(itemInfo.price * this.details.sellMult));
                    return true;
                }
                case me.sellTypes.EQUIPMENT: {
                    const itemInfo = GetEquipment(item);
                    text = itemInfo.displayname + " (" + Math.floor(itemInfo.price * this.details.sellMult) + " coins)\n " + GetEquipmentDesc(itemInfo);
                    break;
                }
                case me.sellTypes.FIXTURES: {
                    const itemInfo = GetFarmInfo(item);
                    text = itemInfo.displayname + " (" + Math.floor(itemInfo.price * this.details.sellMult) + " coins)\n " + itemInfo.desc;
                    break;
                }
            }
        }
        this.DrawDetails(text);
        return true;
    },
    mouseMoveSellSelect: function(pos) {
        const newCursorX = Math.floor((pos.x - 4) / 2);
        if(newCursorX < 0 || newCursorX > 3) { return false; }
        this.cursorX = newCursorX;
        let text = "";
        switch(this.cursorX) {
            case me.sellTypes.CROPSIDX: text = GetText("s.sellseed"); break;
            case me.sellTypes.EQUIPIDX: text = GetText("s.selltool"); break;
            case me.sellTypes.FIXIDX: text = GetText("s.sellfixture");; break;
            default: text = GetText(this.details.leaveSell); break;
        }
        this.DrawDetails(text);
        return true;
    },
    mouseMoveBuying: function(pos) {
        this.bookState = -1;
        const newCursorX = Math.floor((pos.x - 1) / this.dx);
        if(this.howManyData !== null) {
            if(pos.y < this.yPos) { // up
                const newPrice = (this.howManyData.amount + 1) * this.howManyData.price;
                if(newPrice <= player.monies) { this.howManyData.amount += 1; }
            } else if(pos.y > this.yPos) { // down
                this.howManyData.amount = Math.max(1, this.howManyData.amount - 1);
            }
            this.DrawDetails();
            return true;
        }
        if(newCursorX < 0 || newCursorX >= (this.details.wares.length + this.cursorInitx)) { return false; }
        if(newCursorX > ((this.hasTalk || this.details.doesSell ? 1 : 0) + this.availableIndexes.length)) { return false; }
        this.cursorX = newCursorX;
        this.DrawDetails();
        return true;
    },
    DrawText: function() {
        if(this.cursorX == 0) { return this.WriteWrappedText(GetText(this.details.leaving)); }
        if(this.hasTalk && this.cursorX == 1) { return this.WriteWrappedText(GetText(this.hasTalk)); }
        else if(this.details.doesSell && this.cursorX == 1) { return this.WriteWrappedText(GetText(this.details.selling)); }
        const cursor = this.availableIndexes[this.cursorX - this.cursorInitx];
        const productInfo = this.details.wares[cursor];
        if(this.howManyData !== null) { this.DrawHowManyText(); }
        else if(productInfo.type === "seed") { this.DrawSeedText(productInfo); }
        else if(productInfo.type === "farm") { this.DrawFarmText(productInfo); }
        else if(productInfo.type === "equipment") { this.DrawEquipText(productInfo); }
        else if(productInfo.type === "upgrade") { this.DrawUpgradeText(productInfo); }
        else if(productInfo.type === "inn") { this.WriteWrappedText(GetText("s.sleepsy").replace(/\{0\}/g, productInfo.price)); }
        else if(productInfo.type === "book") { this.WriteWrappedText(GetText(productInfo.name)); }
        else if(productInfo.type === "alms") { this.WriteWrappedText(GetText("s.alms").replace(/\{0\}/g, productInfo.price)); }
    },
    DrawUpgradeText: function(productInfo) {
        let size = "???";
        switch(productInfo.product) {
            case "farmupgradeI": size = "4x3"; break;
            case "farmupgradeO": size = "4x4"; break;
            case "farmupgrade_": size = "6x3"; break;
            case "farmupgradeOO": size = "8x6"; break;
            case "farmupgrade__": size = "10x5"; break;
        }
        let str = GetText("s.upgrade").replace(/\{0\}/g, Math.floor(productInfo.price * GetPriceMultiplier())).replace(/\{1\}/g, size) + " \n ";
        if(productInfo.product.slice(-1) === "I") {
            str += GetText("s.fieldI");
        } else if(productInfo.product.slice(-1) === "O") {
            str += GetText("s.fieldO");
        } else if(productInfo.product.slice(-1) === "_") {
            str += GetText("s.field.");
        }
        this.WriteWrappedText(str);
    },
    DrawEquipText: function(productInfo) {
        const equipInfo = GetEquipment(productInfo.product);
        const price = Math.floor(equipInfo.price * (this.details.buyMult || 1) * GetPriceMultiplier());
        this.WriteWrappedText(equipInfo.displayname + " (" + price + " coins) \n " + GetEquipmentDesc(equipInfo));
    },
    DrawFarmText: function(productInfo) {
        const farmInfo = GetFarmInfo(productInfo.product);
        const price = Math.floor(farmInfo.price * (this.details.buyMult || 1) * GetPriceMultiplier());
        let lineOne = farmInfo.displayname + " (" + price + "G)";
        const amt = player.getItemAmount(farmInfo.name);
        if(amt > 0) { lineOne += "     " + GetText("s.youHave").replace(/\{0\}/g, amt); } // 297 TODO: right align this?
        this.WriteWrappedText(lineOne + "\n " + farmInfo.desc);
    },
    DrawSeedText: function(productInfo, crop, price) {
        crop = crop || GetCrop(productInfo.product);
        price = price || Math.floor(crop.price * (this.details.buyMult || 1) * GetPriceMultiplier());
        let str = crop.displayname + " (" + price + "G)";
        const amt = player.getItemAmount(crop.name);
        if(amt > 0) { str += "     " + GetText("s.youHave").replace(/\{0\}/g, amt); } // 297 TODO: right align this?
        this.WriteWrappedText(str);
        pausemenu.inventory.DrawCropPower(crop, 0.5, 10, "menutext");

        const seasons = ["spring", "summer", "autumn", "winter"];
        for(let i = 0; i < 4; i++) {  gfx.drawTileToGrid(seasons[i] + crop.seasons[i], 8.5 + i, 10, "menutext"); }

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
        gfx.drawTileToGrid(cropSprite, 13.5, 10, "menutext");
        gfx.drawItemNumber(crop.size, 13.75, 10, "menutext", true);

        gfx.drawTileToGrid("inv_time", 0.5, 11, "menutext");
        if(crop.time === 999 || crop.time === -1) { // NOTE: -1 vs 999 what is the diff?
            gfx.drawTileToGrid("bigNumW?", 1.5, 11, "menutext");
        } else {
            gfx.drawBigNumber(crop.time, 1.5, 11, "menutext", true);
        }
        let nextx = 3;
        if(crop.respawn > 0) {
            nextx = 5.5;
            gfx.drawTileToGrid("inv_regrow", 3, 11, "menutext");
            if(crop.respawn === 999 || crop.respawn === -1) {
                gfx.drawTileToGrid("bigNumW?", 4, 11, "menutext");
            }  else {
                gfx.drawBigNumber(crop.respawn, 4, 11, "menutext", true);
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
            gfx.drawTileToGrid(bonusesToPush[i], nextx + i, 11, "menutext");
        }
        this.WriteWrappedText(GetText(crop.name), 198);
    },
    DrawHowManyText: function() {
        const productInfo = this.howManyData.product;
        const amount = this.howManyData.amount;
        let topText = "", price = 0;
        if(productInfo.type === "seed") {
            const crop = GetCrop(productInfo.product);
            price = Math.floor(crop.price * (this.details.buyMult || 1) * GetPriceMultiplier());
            topText = crop.displayname + " (" + price + "G)";
            const amt = player.getItemAmount(crop.name);
            topText += "     " + GetText("s.youHave").replace(/\{0\}/g, amt); // 297 TODO: right align this?
        } else if(productInfo.type === "farm") {
            const farmInfo = GetFarmInfo(productInfo.product);
            price = Math.floor(farmInfo.price * (this.details.buyMult || 1) * GetPriceMultiplier());
            topText = farmInfo.displayname + " (" + price + "G)";
            const amt = player.getItemAmount(farmInfo.name);
            topText += "     " + GetText("s.youHave").replace(/\{0\}/g, amt); // 297 TODO: right align this?
        }
        topText += " \n \n " + GetText("s.howMany") + "       " + amount + " (" + (price * amount) + "G)";
        this.WriteWrappedText(topText);
    },
    click: function(pos) {
        if(this.sleepsyData !== null) { return this.clickSleepsy(); }
        if(this.sellingState === me.sellStates.READING) { return this.clickBook(pos); }
        if(this.cursorX == 0) {
            if(this.sellingState === me.sellStates.SELLING && this.sellOffset > 0) {
                this.sellOffset--;
                this.DrawDetails("");
                this.mouseMove({x: this.cursorX, y: this.yPos });
                return true;
            } else {
                return this.cancel();
            }
        }
        switch(this.sellingState) {
            case me.sellStates.SELLING: return this.clickSelling(pos);
            case me.sellStates.SELLSELECT: return this.clickSellSelect(pos);
            case me.sellStates.BUYING: return this.clickBuying(pos);
        }
    },
    clickSelling: function(pos) {
        if(this.cursorX > this.actualIdxs.length) {
            if((this.numArrows & 2) === 2) {
                this.sellOffset++;
                this.DrawDetails("");
                this.mouseMove({x: this.cursorX + 1, y: this.yPos });
                return true;
            } else {
                return false;
            }
        }
        const actualIdx = this.actualIdxs[this.cursorX - 1];
        const actualItem = player.inventory[actualIdx];
        if(actualItem[1] <= 0) { return false; }
        let price = 10;
        switch(this.sellingType) {
            case me.sellTypes.CROPS: price = Math.floor(GetCrop(actualItem[0]).price * this.details.sellMult); break;
            case me.sellTypes.EQUIPMENT: price = Math.floor(GetEquipment(actualItem[0]).price * this.details.sellMult); break;
            case me.sellTypes.FIXTURES: price = Math.floor(GetFarmInfo(actualItem[0]).price * this.details.sellMult); break;
        }
        player.AddMonies(price);
        player.decreaseItem(actualItem[0]);
        this.DrawDetails(GetText(this.details.didSell));
        return true;
    },
    clickSellSelect: function(pos) {
        switch(this.cursorX) {
            case me.sellTypes.CROPSIDX: this.sellingType = me.sellTypes.CROPS; break;
            case me.sellTypes.EQUIPIDX: this.sellingType = me.sellTypes.EQUIPMENT; break;
            case me.sellTypes.FIXIDX: this.sellingType = me.sellTypes.FIXTURES; break;
            default: return false;
        }
        this.sellingState = me.sellStates.SELLING;
        this.cursorX = 1;
        this.DrawDetails("");
        this.mouseMove({x: this.cursorX + 1, y: this.yPos});
        return true;
    },
    clickBook: function(pos) {
        this.bookState++;
        const newText = TryGetText(this.bookReading + this.bookState);
        if(newText === false) {
            this.sellingState = me.sellStates.BUYING;
            this.bookState = -1;
            this.mouseMoveBuying(pos);
        } else {
            this.DrawDetails(newText);
            if(this.bookReading === "bookStun" && this.bookState === 1) {
                gfx.drawTileToGrid("stunIco1", 2, 11, "menutext");
                gfx.drawTileToGrid("stunIco2", 4, 11, "menutext");
                gfx.drawTileToGrid("stunIco3", 6, 11, "menutext");
            } else if(this.bookReading === "bookElem") {
                if(this.bookState === 3) {
                    gfx.drawTileToGrid("fireIco1", 2, 10.5, "menutext");
                    gfx.drawTileToGrid("fireIco2", 4, 10.5, "menutext");
                    gfx.drawTileToGrid("waterIco1", 2, 12, "menutext");
                    gfx.drawTileToGrid("waterIco2", 4, 12, "menutext");
                } else if(this.bookState === 5) {
                    gfx.drawTileToGrid("saltIco1", 2, 10.5, "menutext");
                    gfx.drawTileToGrid("saltIco2", 4, 10.5, "menutext");
                    gfx.drawTileToGrid("saltIcoX", 3, 12, "menutext");
                }
            }
        }
        return true;
    },
    clickBuying: function(pos) {
        if(this.hasTalk && this.cursorX === 1) {
            if(this.isQuestTalk) {
                this.DrawDetails(quests.getQuestText(this.hasTalk));
            } else {
                this.DrawDetails(GetText(this.details.benignTalk));
            }
            return true;
        } else if(this.details.doesSell && this.cursorX === 1) {
            this.sellingState = me.sellStates.SELLSELECT;
            this.DrawDetails(GetText("s.sellseed"));
            return true;
        }
        const cursor = this.availableIndexes[this.cursorX - this.cursorInitx];
        if(this.isUpgradeShop && this.availableIndexes.length === 0) { return false; }
        const productInfo = this.details.wares[cursor];
        if(productInfo.type === "book") {
            this.sellingState = me.sellStates.READING;
            this.bookReading = productInfo.name;
            this.bookState = 0;
            this.DrawDetails(GetText(this.bookReading + this.bookState));
            return true;
        }
        let price = 0;
        const mult = (this.details.buyMult || 1) * GetPriceMultiplier();
        switch(productInfo.type) {
            case "seed": price = GetCrop(productInfo.product).price; break;
            case "farm": price = GetFarmInfo(productInfo.product).price; break;
            case "equipment": price = GetEquipment(productInfo.product).price; break;
            default: price = productInfo.price; break;
        }
        const amt = (this.howManyData === null ? 1 : this.howManyData.amount);
        price = amt * Math.floor(price * mult);
        if(price > player.monies) {
            if(productInfo.type === "alms") { this.DrawDetails(GetText("s.almsNope")); }
            else { this.DrawDetails(GetText(this.details.notEnough)); }
            return true;
        }
        player.monies -= price;

        if(productInfo.type === "alms") {
            player.luck += 0.002;
            this.DrawDetails(GetText("s.almsBuy"));
            return true;
        } else if(productInfo.type === "inn") {
            player.lastInn = this.details.innId;
            player.health = player.maxhealth + 5;
            game.save("auto", false);
            this.sleepsyData = { state: 0, size: 0.5, waitTimer: 80, animIdx: setInterval(worldmap.shop.Sleepsy, 10) };
        } else if(productInfo.type === "upgrade") {
            let dims = {x: 0, y: 0, new: "n"};
            switch(productInfo.product) {
                case "farmupgradeI": dims = { x: 4, y: 3, new: "I" }; break;
                case "farmupgradeO": dims = { x: 4, y: 4, new: "O" }; break;
                case "farmupgrade_": dims = { x: 6, y: 3, new: "_" }; break;
                case "farmupgradeOO": dims = { x: 8, y: 6, new: "OO" }; AddAchievementIfMissing("fullUpgrade"); break;
                case "farmupgrade__": dims = { x: 10, y: 5, new: "__" }; AddAchievementIfMissing("fullUpgrade"); break;
            }
            player.expandGrid(dims.x, dims.y, dims.new);
            this.cursorX = 1;
        } else if(productInfo.type === "equipment" && player.hasItem(productInfo.product)) {
            player.AddMonies(price);
            this.DrawDetails(GetText("s.alreadyown"));
            return true;
        } else if(!player.increaseItem(productInfo.product, amt)) {
            player.AddMonies(price);
            this.DrawDetails(GetText("s.invfull"));
            return true;
        } else if(productInfo.type === "seed" || productInfo.type === "farm") {
            if(this.howManyData === null) {
                this.howManyData = { product: productInfo, amount: 1, price: price };
                player.AddMonies(price); // we already charged!
                player.decreaseItem(productInfo.product, amt); // we already added one!
                if(productInfo.type === "farm" && player.fixtureTutorialState === 0) { player.fixtureTutorialState = 1; }
                this.DrawDetails();
                return true;
            } else {
                this.howManyData = null;
            }
        }
        this.DrawDetails(GetText(this.details.purchased));
        return true;
    },
    cancel: function() {
        if(this.sleepsyData !== null) { return; }
        this.sellOffset = 0; this.numArrows = 0;
        switch(this.sellingState) {
            case me.sellStates.SELLING: 
                this.sellingState = me.sellStates.SELLSELECT;
                switch(this.sellingType) {
                    case me.sellTypes.CROPS: this.cursorX = me.sellTypes.CROPSIDX; break;
                    case me.sellTypes.EQUIPMENT: this.cursorX = me.sellTypes.EQUIPIDX; break;
                    case me.sellTypes.FIXTURES: this.cursorX = me.sellTypes.FIXIDX; break;
                }
                this.DrawDetails("");
                this.mouseMove({ x: 2 * this.cursorX + 4, y: this.yPos });
                break;
            case me.sellStates.SELLSELECT:
                this.sellingState = me.sellStates.BUYING;
                this.cursorX = 1;
                this.DrawDetails(GetText(this.details.selling));
                break;
            case me.sellStates.BUYING:
                if(this.howManyData === null) {
                    clearInterval(this.blinkIdx);
                    game.transition(this, worldmap, {
                        init: worldmap.pos,
                        map: worldmap.mapName,
                        noEntityUpdate: true
                    });
                } else {
                    this.howManyData = null; 
                    this.DrawDetails();
                }
                break;
        }
    },
    keyPress: function(key) {
        const pos = { x: (this.cursorX * this.dx) + 1, y: this.yPos };
        let isEnter = false;
        let actDx = this.dx;
        if(this.sellingState === me.sellStates.SELLSELECT) {
            pos.x = (this.cursorX * 2) + 4;
            actDx = 2;
        } else if(this.sellingState === me.sellStates.SELLING) {
            pos.x = this.cursorX + 1;
            actDx = 1;
        }
        let moveDir = 0, vertMove = false;
        switch(key) {
            case player.controls.left: pos.x -= actDx; moveDir = -1; break;
            case player.controls.right: pos.x += actDx; moveDir = 1; break;
            case player.controls.up: pos.y -= 1; vertMove = true; break;
            case player.controls.down: pos.y += 1; vertMove = true; break;
            case player.controls.confirm:
            case player.controls.pause: isEnter = true; break;
            case player.controls.cancel: return this.cancel();
        }
        if(moveDir !== 0 && this.sellingState === me.sellStates.SELLING) {
            if((moveDir === 1 && this.cursorX > this.actualIdxs.length) || (moveDir === -1 && this.sellOffset > 0 && this.cursorX === 0)) {
                isEnter = true;
            }
        }
        if(!vertMove && moveDir === 0 && !isEnter) { return false; }
        if(moveDir !== 0 && this.sellingState === me.sellStates.READING) { this.sellingState = me.sellStates.BUYING; }
        if(isEnter) { return this.click(pos); }
        else { return this.mouseMove(pos); }
    },
    Sleepsy: function() {
        const sleepInfo = worldmap.shop.sleepsyData;
        if(sleepInfo.state === 0) {
            gfx.clearLayer("tutorial");
            for(let y = 2; y < game.tileh + 4; y += 4) {
                for(let x = 2; x < game.tilew + 4; x += 4) {
                    gfx.DrawTransitionImage("transZzz", x - (y % 4 ? 1 : 0), y + 0.5, sleepInfo.size);
                }
            }
            if(sleepInfo.size < 35) { sleepInfo.size += sleepInfo.size / 90; }
            else if(sleepInfo.waitTimer > 0) { sleepInfo.waitTimer--; }
            else { sleepInfo.state = 1; }
        } else if(sleepInfo.state === 1) {
            const dreamChance = Math.random() > 0.75;
            const textKey = dreamChance ? `innDream${Range(0, 9)}` : "innSleep";
            worldmap.shop.DrawDetails(GetText(worldmap.shop.details.awake));
            gfx.drawFullText(GetText(textKey), 0, "#FFFFFF", true);
            sleepInfo.state = 2;
        } else if(sleepInfo.state === 3) {
            gfx.clearLayer("tutorial");
            gfx.DrawTransitionImage("transWake", game.tilew / 2, game.tileh / 2, sleepInfo.size, true);
            if(sleepInfo.size < 50) { sleepInfo.size += sleepInfo.size / 50; }
            else { worldmap.shop.FinishSleepsy(); }
        }
    },
    clickSleepsy: function() {
        const sleepInfo = worldmap.shop.sleepsyData;
        switch(sleepInfo.state) {
            case 0: sleepInfo.size = 35; sleepInfo.waitTimer = 0; break;
            case 2: sleepInfo.size = 0.25; gfx.clearLayer("menutextOverBlack"); sleepInfo.state = 3; break;
            case 3: worldmap.shop.FinishSleepsy(); break;
        }
        return true;
    },
    FinishSleepsy: function() {
        gfx.clearLayer("tutorial");
        clearInterval(worldmap.shop.sleepsyData.animIdx);
        worldmap.shop.sleepsyData = null;
    }
};
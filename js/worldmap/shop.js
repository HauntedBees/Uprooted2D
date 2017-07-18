worldmap.shop = {
    details: null, cursorX: 0,
    initx: 1, dx: 2, yPos: 5, cursorInitx: 0,
    sellingState: 0, sellingType: "", actualIdxs: [],
    maxSell: 12, sellOffset: 0, numArrows: 0, isUpgradeShop: false,
    layersToClear: ["characters", "menutext", "menucursorA"],
    availableIndexes: [], hasTalk: "",
    setup: function(shopName) {
        this.details = stores[shopName];
        this.sellingState = 0;
        this.sellingType = "";
        this.hasTalk = (this.details.talk && player.questsCleared.indexOf(this.details.talk) < 0) ? this.details.talk : "";
        this.sellOffset = 0;
        this.numArrows = 0;
        if(this.details.wares.length > 6 || (this.details.doesSell && this.details.wares.length > 5)) {
            this.dx = 1;
            this.initx = (this.hasTalk || this.details.doesSell) ? 3 : 2;
        } else {
            this.dx = 2;
            this.initx = (this.hasTalk || this.details.doesSell) ? 5 : 3;
        }
        this.cursorInitx = (this.hasTalk || this.details.doesSell) ? 2 : 1;
        this.cursorX = 0;
        gfx.drawStore(this.details.img);
        this.drawDetails(GetText(this.details.opening), true);
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
    drawDetails: function(text, isopening) {
        gfx.clearSome(this.layersToClear);
        switch(this.sellingState) {
            case 2: this.drawDetailsSelling(); break;
            case 1: this.drawDetailsSellingSelect(); break;
            default: this.drawDetailsBuying(); break;
        }
        if(this.isUpgradeShop && this.availableIndexes.length === 0 && isopening) { text = GetText(this.details.empty); }
        gfx.drawText("Coins: " + player.monies, 2, 16 * 6.75, "#FFFFFF");
        gfx.drawWrappedText(text, 2, 16 * 7.25, 235, "#FFFFFF");
    },
    isValidSellIdx: function(i) {
        if(this.sellingType === "") {
            if(player.inventory[i][0][0] === "_" || player.inventory[i][0][0] === "!") {
                return false;
            }
        } else if(player.inventory[i][0][0] !== this.sellingType) {
            return false;
        }
        if(this.sellingType === "!" && player.isEquipped(player.inventory[i][0])) { return false; }
        return true;
    },
    getNthMatchingIdx: function(n) {
        if(n === 0) { return 0; }
        var j = -1;
        for(var i = 0; i < player.inventory.length; i++) {
            if(!this.isValidSellIdx(i)) { continue; }
            if(++j === n) { return i; }
        }
        return 0;
    },
    drawDetailsSelling: function() {
        var j = 0;
        this.actualIdxs = [];
        this.numArrows = 0;
        var max = this.maxSell;
        if(this.sellOffset > 0) {
            this.numArrows += 1;
            gfx.drawTileToGrid("arrowL", 1, this.yPos, "characters");
        } else {
            gfx.drawTileToGrid("exit", 1, this.yPos, "characters");
        }
        var addArrow = false, lastIdx = 0;
        for(var i = this.getNthMatchingIdx(this.sellOffset); i < player.inventory.length; i++) {
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
            var isLastItem = true;
            for(var i = lastIdx + 1; i < player.inventory.length; i++) {
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
        gfx.drawCursor(1 + this.cursorX, this.yPos, 0, 0);
    },
    drawDetailsSellingSelect: function() {
        gfx.drawTileToGrid("exit", 4, this.yPos, "characters");
        gfx.drawTileToGrid("seeds", 6, this.yPos, "characters");
        gfx.drawTileToGrid("tools", 8, this.yPos, "characters");
        gfx.drawTileToGrid("fixtures", 10, this.yPos, "characters");
        gfx.drawCursor(4 + this.cursorX * 2, this.yPos, 0, 0);
    },
    drawDetailsBuying: function() {
        gfx.drawTileToGrid("exit", 1, this.yPos, "characters");
        if(this.hasTalk) {
            gfx.drawTileToGrid("talk", (this.details.doesSell ? 2 : 1) + this.dx, this.yPos, "characters");
        } else if(this.details.doesSell) {
            gfx.drawTileToGrid("sell", 1 + this.dx, this.yPos, "characters");
        }
        this.availableIndexes = []; var j = 0;
        this.isUpgradeShop = false;
        for(var i = 0; i < this.details.wares.length; i++) {
            if(this.details.wares[i].type === "upgrade") {
                this.isUpgradeShop = true;
                var res = spriteData.names[this.details.wares[i].product + "-" + player.gridLevel];
                if(res === undefined) { continue; }
                this.availableIndexes.push(i);
                gfx.drawTileToGrid(this.details.wares[i].product + "-" + player.gridLevel, this.initx + j * this.dx, this.yPos, "characters");
                j++;
            } else {
                if(this.details.wares[i].locked !== undefined && player.questsCleared.indexOf(this.details.wares[i].locked) < 0) { continue; }
                this.availableIndexes.push(i);
                if(this.details.wares[i].type === "equipment") {
                    gfx.drawTileToGrid(GetEquipment(this.details.wares[i].product).sprite, this.initx + j * this.dx, this.yPos, "characters");
                } else {
                    gfx.drawTileToGrid(this.details.wares[i].product, this.initx + j * this.dx, this.yPos, "characters");
                }
                j++;
            }
        }
        gfx.drawCursor(1 + this.cursorX * this.dx, this.yPos, 0, 0);
    },

    clean: function() { gfx.clearAll(); },
    mouseMove: function(pos) {
        if(pos.y < this.yPos || pos.y > this.yPos) { return false; }
        switch(this.sellingState) {
            case 2: return this.mouseMoveSelling(pos);
            case 1: return this.mouseMoveSellSelect(pos);
            default: return this.mouseMoveBuying(pos);
        }
    },
    mouseMoveSelling: function(pos) {
        var newCursorX = pos.x - 1;
        if(newCursorX < 0) { return false; }
        if((this.numArrows & 2) === 2) {
            if(newCursorX > (this.actualIdxs.length + 1)) { return false; }
        } else {
            if(newCursorX > this.actualIdxs.length) { return false; }
        }
        this.cursorX = newCursorX;
        var text = "hi im craig";
        if(this.cursorX === 0) {
            if((this.numArrows & 1) === 1) {
                text = "Go Back";
            } else {
                text = GetText(this.details.leaveSell);
            }
        } else if((this.numArrows & 2) === 2 && newCursorX > this.actualIdxs.length) {
            text = "Go Forward";
        } else {
            var actualIdx = this.actualIdxs[this.cursorX - 1];
            var item = player.inventory[actualIdx][0];
            switch(this.sellingType) {
                case "":
                    var itemInfo = GetCrop(item);
                    text = itemInfo.displayname + " (" + Math.floor(itemInfo.price * this.details.sellMult) + " coins)\n " + GetCropDesc(itemInfo);
                    break;
                case "!":
                    var itemInfo = GetEquipment(item);
                    text = itemInfo.displayname + " (" + Math.floor(itemInfo.price * this.details.sellMult) + " coins)\n " + GetEquipmentDesc(itemInfo);
                    break;
                case "_":
                    var itemInfo = GetFarmInfo(item);
                    text = itemInfo.displayname + " (" + Math.floor(itemInfo.price * this.details.sellMult) + " coins)\n " + itemInfo.desc;
                    break;
            }
        }
        this.drawDetails(text);
        return true;
    },
    mouseMoveSellSelect: function(pos) {
        var newCursorX = Math.floor((pos.x - 4) / 2);
        if(newCursorX < 0 || newCursorX > 3) { return false; }
        this.cursorX = newCursorX;
        var text = "";
        switch(this.cursorX) {
            case 1: text = GetText("s_sellseed"); break;
            case 2: text = GetText("s_selltool"); break;
            case 3: text = GetText("s_sellfixture");; break;
            default: text = GetText(this.details.leaveSell); break;
        }
        this.drawDetails(text);
        return true;
    },
    mouseMoveBuying: function(pos) {
        var newCursorX = Math.floor((pos.x - 1) / this.dx);
        if(newCursorX < 0 || newCursorX >= (this.details.wares.length + this.cursorInitx)) { return false; }
        if(newCursorX > ((this.hasTalk || this.details.doesSell ? 1 : 0) + this.availableIndexes.length)) { return false; }
        this.cursorX = newCursorX;
        this.drawDetails(this.getText());
        return true;
    },
    getText: function() {
        if(this.cursorX == 0) { return GetText(this.details.leaving); }
        if(this.hasTalk && this.cursorX == 1) { return GetText(this.hasTalk); }
        else if(this.details.doesSell && this.cursorX == 1) { return GetText(this.details.selling); }
        var cursor = this.availableIndexes[this.cursorX - this.cursorInitx];
        var productInfo = this.details.wares[cursor];
        if(productInfo.type == "seed") { return this.getSeedText(productInfo); }
        if(productInfo.type == "farm") { return this.getFarmText(productInfo); }
        if(productInfo.type == "equipment") { return this.getEquipText(productInfo); }
        if(productInfo.type == "upgrade") { return this.getUpgradeText(productInfo); }
        if(productInfo.type == "inn") { return "Take a Sleepsy Nappsy (" + productInfo.price + " coins)\n Recovers all of your health."; }
        return "i don't know what this is";
    },
    getUpgradeText: function(productInfo) {
        var size = "???";
        switch(productInfo.product) {
            case "farmupgradeI": size = "4x3"; break;
            case "farmupgradeO": size = "4x4"; break;
            case "farmupgrade_": size = "6x3"; break;
            case "farmupgradeOO": size = "8x6"; break;
            case "farmupgrade__": size = "10x5"; break;
        }
        var str = size + " Upgrade (" + productInfo.price + " coins)\n ";
        if(productInfo.product.slice(-1) === "I") {
            str += GetText("s_fieldI");
        } else if(productInfo.product.slice(-1) === "O") {
            str += GetText("s_fieldO");
        } else if(productInfo.product.slice(-1) === "_") {
            str += GetText("s_field_");
        }
        return str;
    },
    getEquipText: function(productInfo) {
        var equipInfo = GetEquipment(productInfo.product);
        var price = (productInfo.price === undefined) ? Math.floor(equipInfo.price * (this.details.buyMult || 1)) : productInfo.price;
        return equipInfo.displayname + " (" + price + " coins)\n " + GetEquipmentDesc(equipInfo);
    },
    getFarmText: function(productInfo) {
        var farmInfo = GetFarmInfo(productInfo.product);
        var price = (productInfo.price === undefined) ? Math.floor(farmInfo.price * (this.details.buyMult || 1)) : productInfo.price;
        return farmInfo.displayname + " (" + price + " coins)\n " + farmInfo.desc;
    },
    getSeedText: function(productInfo) {
        var cropInfo = GetCrop(productInfo.product);
        var price = (productInfo.price === undefined) ? Math.floor(cropInfo.price * (this.details.buyMult || 1)) : productInfo.price;
        return cropInfo.displayname + " (" + price + " coins)\n " + GetCropDesc(cropInfo);
    },
    click: function(pos) {
        if(this.cursorX == 0) {
            if(this.sellingState === 2 && this.sellOffset > 0) {
                this.sellOffset--;
                this.drawDetails("");
                this.mouseMove({x: this.cursorX, y: this.yPos });
                return true;
            } else {
                return this.cancel();
            }
        }
        switch(this.sellingState) {
            case 2: return this.clickSelling(pos);
            case 1: return this.clickSellSelect(pos);
            default: return this.clickBuying(pos);
        }
    },
    clickSelling: function(pos) {
        if(this.cursorX > this.actualIdxs.length) {
            if((this.numArrows & 2) === 2) {
                this.sellOffset++;
                this.drawDetails("");
                this.mouseMove({x: this.cursorX + 1, y: this.yPos });
                return true;
            } else {
                return false;
            }
        }
        var actualIdx = this.actualIdxs[this.cursorX - 1];
        var actualItem = player.inventory[actualIdx];
        if(actualItem[1] <= 0) { return false; }
        var price = 10;
        switch(this.sellingType) {
            case "": price = Math.floor(GetCrop(actualItem[0]).price * this.details.sellMult); break;
            case "!": price = Math.floor(GetEquipment(actualItem[0]).price * this.details.sellMult); break;
            case "_": price = Math.floor(GetFarmInfo(actualItem[0]).price * this.details.sellMult); break;
        }
        player.monies += price;
        player.decreaseItem(actualItem[0]);
        this.drawDetails(GetText(this.details.didSell));
        return true;
    },
    clickSellSelect: function(pos) {
        switch(this.cursorX) {
            case 1: this.sellingType = ""; break;
            case 2: this.sellingType = "!"; break;
            case 3: this.sellingType = "_"; break;
            default: return false;
        }
        this.sellingState = 2;
        this.cursorX = 1;
        this.drawDetails("");
        this.mouseMove({x: this.cursorX + 1, y: this.yPos});
        return true;
    },
    clickBuying: function(pos) {
        if(this.hasTalk && this.cursorX === 1) {
            this.drawDetails(quests.getQuestText(this.hasTalk));
            return true;
        } else if(this.details.doesSell && this.cursorX === 1) {
            this.sellingState = 1;
            this.drawDetails(GetText("s_sellseed"));
            return true;
        }
        var cursor = this.availableIndexes[this.cursorX - this.cursorInitx];
        if(this.isUpgradeShop && this.availableIndexes.length === 0) { return false; }
        var productInfo = this.details.wares[cursor];
        var price = 0;
        if(productInfo.price === undefined) {
            switch(productInfo.type) {
                case "seed": price = Math.floor(GetCrop(productInfo.product).price * (this.details.buyMult || 1)); break;
                case "farm": price = Math.floor(GetFarmInfo(productInfo.product).price * (this.details.buyMult || 1)); break;
                case "equipment": price = Math.floor(GetEquipment(productInfo.product).price * (this.details.buyMult || 1)); break;
                default: price = 10; break;
            }
        } else {
            price = productInfo.price;
        }
        
        if(price > player.monies) { this.drawDetails(GetText(this.details.notEnough)); return true; }
        player.monies -= price;

        if(productInfo.type === "inn") {
            player.lastInn = this.details.innId;
            player.health = player.maxhealth;
        } else if(productInfo.type === "upgrade") {
            var dims = {x: 0, y: 0, new: "n"};
            switch(productInfo.product) {
                case "farmupgradeI": dims = {x: 4, y: 3, new: "I"}; break;
                case "farmupgradeO": dims = {x: 4, y: 4, new: "O"}; break;
                case "farmupgrade_": dims = {x: 6, y: 3, new: "_"}; break;
                case "farmupgradeOO": dims = {x: 8, y: 6, new: "OO"}; break;
                case "farmupgrade__": dims = {x: 10, y: 5, new: "__"}; break;
            }
            player.expandGrid(dims.x, dims.y, dims.new);
            this.cursorX = 1;
        } else {
            player.increaseItem(productInfo.product, 1);
        }
        this.drawDetails(GetText(this.details.purchased));
        return true;
    },
    cancel: function() {
        this.sellOffset = 0; this.numArrows = 0;
        switch(this.sellingState) {
            case 2: 
                this.sellingState = 1;
                switch(this.sellingType) {
                    case "": this.cursorX = 1; break;
                    case "!": this.cursorX = 2; break;
                    case "_": this.cursorX = 3; break;
                }
                this.drawDetails("");
                this.mouseMove({ x: 2 * this.cursorX + 4, y: this.yPos });
                break;
            case 1:
                this.sellingState = 0;
                this.cursorX = 1;
                this.drawDetails(GetText(this.details.selling));
                break;
            default: 
                game.transition(this, worldmap, {
                    init: worldmap.pos,
                    map: worldmap.mapName,
                    noEntityUpdate: true
                });
                break;
        }
    },
    keyPress: function(key) {
        var pos = {x: (this.cursorX * this.dx) + 1, y: this.yPos};
        var isEnter = false;
        var actDx = this.dx;
        if(this.sellingState == 1) {
            pos.x = (this.cursorX * 2) + 4;
            actDx = 2;
        } else if(this.sellingState == 2) {
            pos.x = this.cursorX + 1;
            actDx = 1;
        }
        var moveDir = 0;
        switch(key) {
            case "a": pos.x -= actDx; moveDir = -1; break;
            case "d": pos.x += actDx; moveDir = 1; break;
            case " ":
            case "Enter": isEnter = true; break;
            case "q": return this.cancel();
        }
        if(moveDir !== 0 && this.sellingState === 2) {
            if((moveDir === 1 && this.cursorX > this.actualIdxs.length) || (moveDir === -1 && this.sellOffset > 0 && this.cursorX === 0)) {
                isEnter = true;
            }
        }
        if(moveDir === 0 && !isEnter) { return false; }
        if(isEnter) {
            return this.click(pos);
        } else {
            return this.mouseMove(pos);
        }
    }
};
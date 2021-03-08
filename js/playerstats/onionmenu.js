pausemenu.onion = {
    cursor: { x: 0, y: 0 }, inventoryWidth: 3, invDY: 1.5, cropDY: 10, cropDX: 0.5, animHelper: null, 
    layersToClear: ["menuA", "menutext", "tutorial", "menuOverBlack", "menutextOverBlack"],
    actualIndexes: [], selectedCrop: -1, backStartX: 0, backButtonW: 0, lastX: 0, lastY: 0, 
    animIdx: 0, animX: 0, animY: 0, animFrame: false, frameLen: true, currentFrameLen: false, animReset: 0,
    onionX: 125, onionY: 84, hasPoop: false,
    setup: function() {
        this.cursor = { x: 0, y: 0 };
        this.cursors = new CursorAnimSet([
            { key: "main", x: this.cursor.x, y: this.cursor.y, w: 0, h: 0, type: "cursor", layer: "menucursorA" },
            { key: "alt", x: -1, y: -1, w: 0, h: 0, type: "xcursor", layer: "menucursorB" }
        ]);
        this.selectedCrop = -1;
        this.animHelper = new CombatAnimHelper([]);
        this.trashInfo = [];
        this.trashIdx = setInterval(this.HandleTrashCan, 50);
        gfx.TileBackground("invTile");
        this.backStartX = 0.125;
        this.backButtonW = gfx.DrawCombatOption(GetText("menu.Back"), this.backStartX, -0.125, false);
        this.DrawAll();
        this.cursors.Start();
        this.currentFrameLen = 0;
        this.animIdx = setInterval(() => this.OnionAnim(), 200);
        this.hasPoop = player.onion.perks.indexOf("stinky") >= 0;
        this.animX = this.hasPoop ? 2 : 0;
        this.frameLen = this.hasPoop ? 4 : 3;
        this.OnionAnim(true);
    },
    DrawAll: function(customMessage) {
        gfx.clearSome(this.layersToClear);

        this.actualIndexes = [];
        let j = 0;
        if(this.selectedCrop < 0) { this.cursors.MoveCursor("alt", -1, -1); }
        for(let i = 0; i < player.inventory.length; i++) {
            if(player.inventory[i][0][0] === "_" || player.inventory[i][0][0] === "!") { continue; }
            if(["bee", "spear", "rod", "water", "tech", "sickle2", "egg"].indexOf(GetCrop(player.inventory[i][0]).type) >= 0) { continue; }
            
            const thisX = j % this.inventoryWidth + this.cropDX;
            const thisY = Math.floor(j / this.inventoryWidth) + this.invDY;
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
            const thisY = Math.floor(i / this.inventoryWidth) + this.invDY;
            gfx.drawTileToGrid("invBox", thisX, thisY, "menuA");
        }
        this.animHelper.DrawWrapper(this.cropDX, this.invDY, this.inventoryWidth, 36 / this.inventoryWidth);
        this.animHelper.DrawWrapper(this.cropDX + 3.75, this.invDY, 10, 8);
        gfx.drawFullImage("onionbg", "background", 68, 24);

        // gut
        for(let y = -1; y < 7; y++) {
            gfx.drawTileToGrid("gut1", this.cropDX + 14, this.invDY + y, "menuA");
        }
        gfx.drawTileToGrid("gut2", this.cropDX + 14, this.invDY + 7, "menuA");
        gfx.drawTileToGrid("gut3", this.cropDX + 15, this.invDY + 7, "menuA");
        
        for(let y = 0; y < player.onion.stomach.length; y++) {
            const food = player.onion.stomach[y];
            gfx.drawTileToGrid(food[0], this.cropDX + 14, this.invDY + 7 - y, "menuA");
            gfx.drawItemNumber(food[1], this.cropDX + 14, this.invDY + 7 - y, "menuA", true);
        }
        
        pausemenu.DrawInnerHeading("onion.Heading");

        // perks
        for(let x = 0; x < 6; x++) {
            const realx = x === 0 ? 0.5 : x;
            gfx.drawTileToGrid("onbgM", this.cropDX + 4 + realx, this.invDY, "menuA");
        }
        gfx.drawTileToGrid("onbgR", this.cropDX + 10, this.invDY, "menuA");
        for(let i = 0; i < player.onion.perks.length; i++) {
            gfx.drawTileToGrid("o." + player.onion.perks[i], this.cropDX + 5 + i, this.invDY, "menuA");
        }

        // mood
        let moodIco = "onmed";
        if(player.onion.mood >= 7) {
            moodIco = "onhap";
        } else if(player.onion.mood < 3) {
            moodIco = "onsad";
        }
        gfx.DrawHueRotated(gfx.ctx["menuA"], player.onion.hueRotate, () => gfx.drawTileToGrid(moodIco, this.cropDX + 4, this.invDY, "menuA"));

        if(this.actualIndexes.length === 0) { this.cursor = { x: 0, y: -1 }; }
        gfx.DrawCombatOption(GetText("menu.Back"), this.backStartX, -0.125, this.cursor.y < 0 && this.cursor.x === 0);
        
        let fontSize = 28;
        if(this.cursor.y === -1) {
            const thisX = this.backStartX;
            const thisW = this.backButtonW;
            this.cursors.RedimCursor("main", thisX - 0.0625, -0.0625, thisW - 1.125, 0);
        } else if(this.cursor.x < this.inventoryWidth) {
            this.cursors.RedimCursor("main", this.cursor.x + this.cropDX, this.cursor.y + this.invDY, 0, 0);
            const handSprite = this.selectedCrop < 0 ? "onhandopen" : "onhandgrab";
            gfx.drawTileToGrid(handSprite, this.cursor.x + this.cropDX + 0.5, this.cursor.y + this.invDY + 0.25, "tutorial");
        } else if(this.cursor.y === 0 && player.onion.perks.length > 0) {
            const newX = this.cursor.x - this.inventoryWidth;
            this.cursors.RedimCursor("main", this.cropDX + 5 + newX, this.invDY, 0, 0);
            const perk = player.onion.perks[newX];
            this.HighlightRelevantStomachItems(perk);
            customMessage = GetText("perk." + perk + ".n") + " \n " + GetText("perk." + perk + ".d");
            fontSize = 22;
        } else {
            if(player.onion.perks.length === 0 && this.cursor.y === 0) { this.cursor.y = 1; }
            const oxp = this.onionX / 16 + 0.375, oyp = this.onionY / 16 + 1;
            this.cursors.RedimCursor("main", oxp, oyp, 1.5, 0.75);
            const handSprite = this.selectedCrop < 0 ? "onhandpet" : "onhandgrab";
            gfx.drawTileToGrid(handSprite, oxp + 0.75, oyp + 1, "tutorial");
        }
        
        const textX = 73, textY = 10 + this.cropDY * 16;
        gfx.drawMinibox(4, this.cropDY - 0.25, 10.75, 3, "", "FarmInfo");
        if(this.cursor.y >= 0) {
            if(this.cursor.x >= this.inventoryWidth) {
                let text = "";
                if(customMessage) {
                    text = customMessage;
                } else if(this.selectedCrop < 0) {
                    if(this.hasPoop) {
                        text = GetText("onion.clean");
                    } else {
                        text = GetText("onion.pet");
                    }
                } else if(this.hasPoop) {
                    text = GetText("onion.feedpoop");
                } else {
                    const item = player.inventory[this.selectedCrop];
                    if(item === undefined) { return; }
                    const crop = GetCrop(item[0]);
                    text = HandleArticles(GetText("onion.feed").replace(/\{0\}/g, crop.displayname), crop.displayname);
                }
                gfx.drawWrappedText(text, textX, textY, 170, undefined, undefined, fontSize);
            } else {
                this.SetCrop();
            }
        } else {
            gfx.drawWrappedText(GetText("inv.BackInfo"), textX, textY, 170, undefined, undefined, 28);
        }
    },
    HighlightRelevantStomachItems(perk) {
        const relevantItems = [];
        switch(perk) {
            case "gourmand": relevantItems.push("coconut", "gmocorn", "goodfood", "notdrugs", "lotus", "saffron"); break;
            case "spring": relevantItems.push("asparagus", "carrot", "garlic", "radish", "apricot", "avocado", "shortgrain", "lotus", "saffron"); break;
            case "summer": relevantItems.push("corn", "pineapple", "tomato", "avocado", "blackberry", "kiwi", "lemon", "mango", "coconut", "lotus", "saffron"); break;
            case "autumn": relevantItems.push("beet", "bellpepper", "carrot", "ginger", "spinach", "apple", "grapes", "notdrugs", "saffron"); break;
            case "winter": relevantItems.push("beet", "leek", "chestnut", "gmocorn", "saffron"); break;
            case "pungent": relevantItems.push("garlic", "ginger", "asparagus"); break;
            case "veggies": relevantItems.push("asparagus", "beet", "bellpepper", "carrot", "corn", "garlic", "ginger", "leek", "pineapple", "radish", "rhubarb", "spinach", "tomato", "gmocorn", "saffron"); break;
            case "fruits": relevantItems.push("coconut", "apple", "apricot", "avocado", "banana", "blackberry", "grapes", "kiwi", "lemon", "mango"); break;
            case "mush": relevantItems.push("shiitake", "milkcap", "portobello", "greenshroom", "blackshroom", "poisnshroom", "notdrugs"); break;
            case "rice": relevantItems.push("rice", "arborio", "blackrice", "shortgrain", "chestnut", "lotus"); break;
            case "fodder": relevantItems.push("fodder", "goodfood"); break;
            case "wet": relevantItems.push("holywater", "holyjug"); break;
            case "friedrice": relevantItems.push("garlic", "ginger", "rice", "arborio", "blackrice", "shortgrain", "chestnut", "lotus"); break;
            case "spicy": relevantItems.push("bellpepper", "garlic", "rhubarb"); break;
            case "sofrito": relevantItems.push("garlic", "leek", "bellpepper", "tomato"); break;
            case "protein": relevantItems.push("asparagus", "avocado", "spinach"); break;
            case "toxic": relevantItems.push("poisnshroom"); break;
            case "core": relevantItems.push("apricot", "avocado"); break;
            case "italia": relevantItems.push("garlic", "carrot", "tomato", "shiitake", "milkcap", "portobello", "greenshroom", "blackshroom", "poisnshroom", "notdrugs"); break;
            case "allberries": relevantItems.push("tomato", "grapes", "banana", "blackberry", "avocado"); break;
            case "crisis": relevantItems.push("leek"); break;
        }
        if(relevantItems.length === 0) { return; }
        
        for(let y = 0; y < player.onion.stomach.length; y++) {
            const food = player.onion.stomach[y];
            if(relevantItems.indexOf(food[0]) >= 0) {
                gfx.DrawXCursor(this.cropDX + 14, this.invDY + 7 - y, 0, 0, "menuA");
            }
        }
    },
    OnionAnim: function(force) {
        if(!force) {
            if(++this.currentFrameLen < this.frameLen) { return; }
            this.currentFrameLen = 0;
        }
        gfx.clearLayer("menuB");
        
        this.animFrame = !this.animFrame;
        if(this.animReset > 0) {
            if(--this.animReset === 0) {
                this.animX = this.hasPoop ? 2 : 0;
                this.frameLen = this.hasPoop ? 4 : 3;
                this.animY = 0;
            }
        }
        gfx.DrawOnion(this.animX + (this.animFrame ? 1 : 0), this.animY, this.onionX, this.onionY, "menuB");
    },
    clean: function() {
        clearInterval(this.animIdx);
        this.cursors.Perish();
        gfx.clearAll(true);
    },
    cancel: function() {
        const isCalsotting = this.cursor.x >= this.inventoryWidth;
        if(isCalsotting) {
            this.cursor.x = this.lastX;
            this.cursor.y = this.lastY;
            this.lastX = 0;
            this.lastY = 0;
        }
        Sounds.PlaySound("cancel");
        if(this.selectedCrop < 0) {
            if(isCalsotting) {
                this.DrawAll();
            } else {
                game.innerTransition(this, pausemenu, 3);
            }
        } else {
            this.selectedCrop = -1;
            this.DrawAll();
        }
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
        if((this.cursor.y === 0 && pos.y === -1) || (this.cursor.y === -1 && pos.y === 0)) {
            pos.x = 0;
        }
        if(pos.y < -1 || pos.x < 0) { return false; }
        if(pos.y === -1 && (pos.x > 1 || this.selectedCrop >= 0)) { return false; }
        if(pos.y === -1) {
            pos.x = 0;
        }
        if(isEnter) { return this.click(); }
        else { return this.CursorMove(pos); }
    },
    mouseMove: function(pos) {
        const dpos = { x: pos.x - this.cropDX, y: pos.y - this.invDY };
        if(dpos.y < 0) {
            // TODO: do I matter yet
            return false;
        } else {
            input.FloorPoint(dpos);
            if(dpos.y < 0) { return false; }
            if(dpos.x > this.inventoryWidth) { return false; }
        }
        this.CursorMove(dpos);
    },
    CursorMove: function(pos) {
        if(pos.x < 0 || pos.y < -1 || pos.x > (this.inventoryWidth + player.onion.perks.length)) { return false; }
        if(player.onion.perks.length > 0 && pos.x >= (this.inventoryWidth + player.onion.perks.length)) { return false; }
        const idx = pos.y * this.inventoryWidth + pos.x;
        if(idx > this.actualIndexes.length) { return false; }
        if(this.cursor.x >= this.inventoryWidth && pos.x >= this.inventoryWidth) { // on calsotte side
            if(pos.y < this.cursor.y) { // moving to perks
                pos.y = 0;
            } else if(pos.y > this.cursor.y) { // moving from buffs
                pos.y = 1;
                pos.x = this.inventoryWidth;
            }
            if(pos.x > this.cursor.x && this.cursor.y > 0) { // moving past calsotte
                return false;
            }
        }
        if(SamePoints(this.cursor, pos)) { return false; }
        this.cursor = { x: pos.x, y: pos.y };
        Sounds.PlaySound("menuMove");
        this.DrawAll();
        return true;
    },
    click: function() {
        if(this.cursor.y === -1) {
            game.innerTransition(this, pausemenu);
            Sounds.PlaySound("cancel");
            return true;
        } else {
            const idx = this.cursor.y * this.inventoryWidth + this.cursor.x;
            const actIdx = this.actualIndexes[idx];
            if(this.cursor.x >= this.inventoryWidth) {
                if(this.cursor.y === 0) {
                    return false;
                } else if(this.selectedCrop < 0) {
                    return this.Pet();
                } else {
                    return this.Feed();
                }
            } else if(this.selectedCrop === actIdx) { // unselect crop
                Sounds.PlaySound("cancel");
                this.selectedCrop = -1;
                if(this.cursor.x >= this.inventoryWidth) { this.cursor.x = this.inventoryWidth - 1; }
            } else if(actIdx !== undefined) {
                Sounds.PlaySound("confirm");
                this.selectedCrop = actIdx;
                this.lastX = this.cursor.x;
                this.lastY = this.cursor.y;
            }
        }
        this.DrawAll();
        return true;
    },
    SetCrop: function() {
        const rowYs = [0.25, 1.5, 2.75];
        const rowTextYs = [16, 32, 57, 72];
        const leftMostX = 4.5;
        const rightMostX = 13.75;
        const leftMostTextX = 90;
        rowYs.forEach((e, i) => rowYs[i] = e + pausemenu.onion.cropDY - 0.25);
        rowTextYs.forEach((e, i) => rowTextYs[i] = e + pausemenu.onion.cropDY * 16 - 4);

        const idx = (this.cursor.x === this.inventoryWidth ? this.selectedCrop : (this.cursor.y * this.inventoryWidth + this.cursor.x));
        const actIdx = this.actualIndexes[idx];
        const item = player.inventory[actIdx];
        if(item === undefined) { return; }
        const crop = GetCrop(item[0]);

        // Row 0
        gfx.drawText(crop.displayname, leftMostTextX, rowTextYs[0], undefined, 32);
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
    },
    DrawCropPower: function(crop, x, y, layer, ignoreSun, halfStep) {
        if(!ignoreSun) { gfx.drawTileToGrid("inv_power", x, y, layer); }
        const numStars = crop.power / 2, starDx = halfStep ? 0.5 : 1;
        if(numStars > 5) {
            for(let i = 0; i < 5; i++) {
                gfx.drawTileToGrid("starMax", x + starDx + i * starDx, y, layer);
            }
        } else {
            for(let i = 0; i < numStars; i++) {
                gfx.drawTileToGrid("starFull", x + starDx + i * starDx, y, layer);
            }
            if(numStars % 1 !== 0) { gfx.drawTileToGrid("starHalf", x + starDx + (numStars - 0.5) * starDx, y, layer); }
            for(let i = Math.ceil(numStars); i < 5; i++) {
                gfx.drawTileToGrid("starNone", x + starDx + i * starDx, y, layer);
            }
        }
    },

    Pet: function() {
        if(this.hasPoop) {
            this.hasPoop = false;
            player.onion.digestCount = 0;
            OnionFuncs.Update();
            Sounds.PlaySound("heal");
            this.animX = 0;
            this.animY = 1;
            this.animReset = 5;
            this.frameLen = 2;
            this.DrawAll(GetText("onion.cleaned"));
            return;
        }
        player.onion.recentPets++;
        if(player.onion.mood < 8) { player.onion.mood++; } 
        this.animX = 0;
        this.animY = 1;
        this.animReset = 5;
        this.frameLen = 2;
        OnionFuncs.Update();
        Sounds.PlaySound("heal");
        this.DrawAll(GetText("onion.petted"));
        this.OnionAnim(true);
    },
    Feed: function() {
        if(this.hasPoop) {
            Sounds.PlaySound("cancel");
            this.DrawAll(GetText("onion.feedpoop"));
            return false;
        }
        const cropName = player.inventory[this.selectedCrop][0];
        if(player.onion.stomach.length === 8) {
            Sounds.PlaySound("cancel");
            this.DrawAll(GetText("onion.full"));
            return false;
        }
        player.decreaseItem(cropName);
        if(!player.hasItem(cropName)) { this.selectedCrop = -1; }
        const crop = GetCrop(cropName);
        const mult = Math.ceil(8 / crop.power);
        const duration = Math.min(10, Math.ceil(Math.min(15, crop.time) * mult * 0.25));
        player.onion.stomach.push([cropName, (duration <= 0 ? 1 : duration)]);
        if(player.onion.stomach.length < 8) {
            player.onion.mood = Math.min(10, player.onion.mood + 1);
        }
        Sounds.PlaySound("homf");
        OnionFuncs.Update();
        this.DrawAll(GetText("onion.fed"));
        this.animX = 2;
        this.animY = 1;
        this.animReset = 10;
        this.frameLen = 1;
        this.OnionAnim(true);
        return true;
    }
};
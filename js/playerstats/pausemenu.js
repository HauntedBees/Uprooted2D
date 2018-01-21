var pausemenu = {
    options: [], dy: 0, cursorX: 0, cursorY: 0, updateIdx: -1, questItems: [],
    layersToClear: ["menuA", "menucursorA", "menutext", "tutorial", "menuOverBlack"],
    setup: function(sel) {
        this.cursorY = sel || 0;
        this.cursorX = 0;
        this.GetQuestItems();
        this.drawAll();
        //this.drawFarm();
    },
    GetQuestItems: function() {
        this.questItems = [];
        if(true || player.hasQuestState("quest1", 4) || player.hasQuestState("quest1", 2)) { this.questItems.push("goldmushroom"); }
        if(true || player.hasQuestState("seamonkey", "looking")) { this.questItems.push("seamonkkey"); }
        if(true || player.hasQuestState("getHeart", "weirdheart") || player.hasQuestState("getHeart", "heart")) { this.questItems.push("monsterheart"); }
        else if(player.hasQuestState("helpSeaMonster", "gotEgg")) { this.questItems.push("monsteregg"); }
        if(true || player.hasQuest("gotTire")) { this.questItems.push("tire"); } // TODO: double check this one!
        if(true || worldmap.smartphone !== null) { this.questItems.push("smartphone"); }
        if(true || player.completedQuest("keycard")) { this.questItems.push("food2keycard"); }
    },
    drawAll: function() {
        gfx.clearSome(pausemenu.layersToClear);
        var rowYs = [6, 6.75];
        pausemenu.options = [];
        pausemenu.drawOption("menu.Items", 0, pausemenu.cursorY == 0);
        pausemenu.drawOption("menu.Equipment", 1, pausemenu.cursorY == 1);
        pausemenu.drawOption("menu.Farm", 2, pausemenu.cursorY == 2);
        pausemenu.drawOption("menu.Options", 3, pausemenu.cursorY == 3);
        pausemenu.drawOption("menu.Save", 4, pausemenu.cursorY == 4);
        pausemenu.drawOption("menu.Quit", 5, pausemenu.cursorY == 5);
        pausemenu.addFormattedText("menu.level", player.level, 1, rowYs[0], "", 0);
        pausemenu.addFormattedText("menu.HP", player.health + "/" + player.maxhealth, 3.5, rowYs[0], ":", 0);
        pausemenu.addFormattedText("menu.ATK", player.atk, 8.5, rowYs[0], ":", 2);
        pausemenu.addFormattedText("menu.DEF", player.def, 11.5, rowYs[0], ":", 2);

        pausemenu.addFormattedText("menu.coins", player.monies, 1, rowYs[1], ":", 4);
        pausemenu.addFormattedText("menu.nextLevel", (player.level === 50 ? "-/-" : (player.exp + "/" + player.nextExp)), 6.75, rowYs[1], ":", 0);

        if(pausemenu.cursorY < pausemenu.options.length) {
            gfx.drawCursor(0, (pausemenu.dy + pausemenu.cursorY), pausemenu.options[pausemenu.cursorY], 0);
        } else {
            if(pausemenu.cursorX === 0) {
                gfx.drawCursor(2, 7.75, 1, 1);
                var str = GetText("alignment") + ": " + GetText(player.techAxis <= 0 ? "alignnature" : "aligntech") + " " + GetText(player.ethicsAxis >= 0 ? "aligngood" : "alignbad");
                pausemenu.drawInfoText(str, 0, 6.75);
            } else {
                var idx = pausemenu.cursorX - 1;
                var item = pausemenu.questItems[idx];
                gfx.drawCursor(5 + (idx * 1.5), 7.75, 0, 0);
                pausemenu.drawInfoText(GetText("qi." + item), 5 + (idx * 1.5), 6.75);
            }
        }

        gfx.drawTileToGrid("alignment", 2, 7.75, "foreground");
        var centerx = 0.75, centery = 0.75;
        centerx += Math.round(4 * player.ethicsAxis) / 4; centery += Math.round(4 * player.techAxis) / 4;
        gfx.drawTileToGrid("alignmentcursor", 2 + centerx, 7.75 + centery, "foreground");

        for(var i = 0; i < pausemenu.questItems.length; i++) {
            gfx.drawTileToGrid(pausemenu.questItems[i], 5 + (i * 1.5), 7.75, "foreground"); // TODO: limit of 6?
        }

        var equipInfo = "";
        if(player.equipment.weapon !== null) { equipInfo += GetEquipmentDesc(GetEquipment(player.equipment.weapon)); }
        if(player.equipment.compost !== null) { equipInfo += (equipInfo !== "" ? "\n " : "") + GetEquipmentDesc(GetEquipment(player.equipment.compost)); }
        if(player.equipment.gloves !== null) { equipInfo += (equipInfo !== "" ? "\n " : "") + GetEquipmentDesc(GetEquipment(player.equipment.gloves)); }
        if(player.equipment.soil !== null) { equipInfo += (equipInfo !== "" ? "\n " : "") + GetEquipmentDesc(GetEquipment(player.equipment.soil)); }
        gfx.drawWrappedText(equipInfo, 70, 8, 150, undefined, undefined, 12);
    },
    drawFarm: function() {
        var helper = new CombatAnimHelper([]);
        var max_x = 10, min_x = max_x - player.gridWidth; // TODO: center align
        var max_y = 5, min_y = max_y - Math.floor(player.gridHeight * 0.75);
        helper.DrawWrapper(min_x, min_y, player.gridWidth, max_y - min_y);
        for(var x = min_x; x < max_x; x++) {
            for(var y = min_y; y < max_y; y++) {
                gfx.drawTileToGrid("dirt", x, y, "background");
            }
        }
        if(player.itemGrid !== null) {
            for(var y = 0; y < player.gridHeight; y++) {
                for(var x = 0; x < player.gridWidth; x++) {
                    if(player.itemGrid[x][y] === null || player.itemGrid[x][y].coord) { continue; }
                    var item = GetFarmInfo(player.itemGrid[x][y]);
                    if(item.size === 2) {
                        gfx.drawTileToGrid(item.displaySprite, min_x + x, min_y + y * 0.75 - 0.75, "background");
                    } else {
                        gfx.drawTileToGrid(item.name, min_x + x, min_y + y * 0.75 - 0.5, "background");
                    }
                }
            }
        }
        // TODO: make player walkin areund it
    },
    drawInfoText: function(text, x, y) {
        var xi = 1;
        var tile = 7;
        var width = gfx.getTextWidth(text) + 20;
        var xiimax = x + Math.ceil(width / 64);
        while(xiimax > 14) { x -= 1; xiimax = x + Math.ceil(width / 64); }
        gfx.drawSprite("sheet", 39, 16, x * 16, 2 + y * 16, "tutorial");
        while(width > 128) {
            width -= 64;
            gfx.drawSprite("sheet", 7, 11, x * 16 + 16 * xi++, 2 + y * 16, "tutorial");
        }
        gfx.drawSprite("sheet", 8, 11, x * 16 + 16 * xi, 2 + y * 16, "tutorial");
        gfx.drawText(text, 7 + x * 16, 10.5 + y * 16, undefined, undefined, "menuOverBlack");
    },
    addText: function(t, x, y) { gfx.drawText(t, 2 + x * 16, 10.5 + y * 16); },
    addFormattedText: function(key, num, x, y, middle, spaceNum) {
        var str = GetText(key);
        if(middle) { str += middle; }
        if(spaceNum > 0) {
            var len = ("" + num).length;
            var dx = spaceNum - len;
            while(dx-- > 0) { str += " "; }  
        }
        str += num;
        pausemenu.addText(str, x, y);
    },
    clean: function() { gfx.clearAll(); },
    cancel: function() {
        game.transition(this, worldmap, {
            init: worldmap.pos,
            map: worldmap.mapName,
            noEntityUpdate: true
        });
    },
    mouseMove: function(pos) {
        if(pos.y > this.options.length) { return false; }
        if(pos.y < this.options.length && pos.x > 0) { pos.y = this.options.length; pos.x = 0; }
        if(pos.x > this.questItems.length) { return false; }
        this.cursorY = pos.y;
        this.cursorX = pos.x;
        this.drawAll();
        return true;
    },
    click: function(pos) {
        if(pos.x > 0) { return false; }
        switch(pos.y) {
            case 0: game.innerTransition(this, pausemenu.inventory); break;
            case 1: game.innerTransition(this, pausemenu.equipment); break;
            case 2: game.innerTransition(this, pausemenu.farmmod); break;
            case 3: game.innerTransition(this, worldmap.optionsMenu, true); break;
            case 4: game.innerTransition(this, pausemenu.savemenu, { saving: true }); break;
            case 5: console.log("quit!"); break;
            default: return false;
        }
        return true;
    },
    keyPress: function(key) {
        var pos = { x: this.cursorX, y: this.cursorY };
        var isEnter = false;
        switch(key) {
            case player.controls.right: pos.x++; break;
            case player.controls.left: pos.x--; break;
            case player.controls.up: pos.y--; pos.x = 0; break;
            case player.controls.down: pos.y++; break;
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
    drawOption: function(text, y, selected) {
        var xi = 1;
        var tile = 7;
        if(selected) { tile = 9; }
        gfx.drawSprite("sheet", tile, 11, 0, 2 + (this.dy + y) * 16, "menuA");
        text = GetText(text);
        var width = gfx.getTextWidth(text);
        while(width > 128) {
            width -= 64;
            gfx.drawSprite("sheet", tile, 11, 16 * xi++, 2 + (this.dy + y) * 16, "menuA");
        }
        gfx.drawSprite("sheet", tile + 1, 11, 16 * xi, 2 + (this.dy + y) * 16, "menuA");
        gfx.drawText(text, 2, 10.5 + (this.dy + y) * 16);
        this.options.push(xi);
    }
};
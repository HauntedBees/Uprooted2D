var pausemenu = {
    options: [], cursorY: 0, updateIdx: -1, 
    layersToClear: ["menuA", "menucursorA", "menutext"],
    setup: function(sel) {
        this.cursorY = sel || 0;
        this.updateIdx = setInterval(this.drawAll, 1000);
        this.drawAll();
    },
    drawAll: function() {
        gfx.clearSome(pausemenu.layersToClear);
        pausemenu.options = [];
        pausemenu.drawOption("Items", 0, pausemenu.cursorY == 0);
        pausemenu.drawOption("Equipment", 1, pausemenu.cursorY == 1);
        pausemenu.drawOption("Farm", 2, pausemenu.cursorY == 2);
        pausemenu.drawOption("Save", 3, pausemenu.cursorY == 3);
        gfx.drawCursor(0, pausemenu.cursorY, pausemenu.options[pausemenu.cursorY], 0);
        pausemenu.addText("Lv." + player.level, 4, 0);
        pausemenu.addLabeledText("HP", player.health + "/" + player.maxhealth, 6, 0);
        pausemenu.addLabeledText("ATK", player.atk, 4.5, 0.5);
        pausemenu.addLabeledText("DEF", player.def, 7, 0.5);
        pausemenu.addLabeledText("Next Level", player.exp + "/" + player.nextExp, 3.5, 1);
        pausemenu.addLabeledText("Total EXP", player.totalExp, 4, 1.5);
        pausemenu.addLabeledText("Coins", player.monies, 4.5, 2.5);
        pausemenu.addLabeledText("Time Played", player.getPlayTimeString(), 2.5, 3);
    },
    addLabeledText: function(label, val, x, y) { gfx.drawText(label + ": " + val, 2 + x * 16, 10.5 + y * 16); },
    addText: function(t, x, y) { gfx.drawText(t, 2 + x * 16, 10.5 + y * 16); },
    clean: function() { clearInterval(this.updateIdx); gfx.clearAll(); },
    cancel: function() {
        game.transition(this, worldmap, {
            init: worldmap.pos,
            map: worldmap.mapName,
            noEntityUpdate: true
        });
    },
    mouseMove: function(pos) {
        if(pos.y >= this.options.length) { return false; }
        if(pos.x > 4) { return false; }
        this.cursorY = pos.y;
        this.drawAll();
        return true;
    },
    click: function(pos) {
        if(pos.x > 3) { return false; }
        switch(pos.y) {
            case 0: game.transition(this, pausemenu.inventory); break;
            case 1: game.transition(this, pausemenu.equipment); break;
            case 2: game.transition(this, pausemenu.farmmod); break;
            case 3: game.transition(this, pausemenu.savemenu); break;
            default: return false;
        }
        return true;
    },
    keyPress: function(key) {
        var pos = { x: 0, y: this.cursorY };
        var isEnter = false;
        switch(key) {
            case "w": pos.y--; break;
            case "s": pos.y++; break;
            case " ":
            case "Enter": isEnter = true; break;
            case "q": return this.cancel();
        }
        if(pos.y < 0) { return false; }
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
        gfx.drawSprite("sheet", tile, 11, 0, 2 + y * 16, "menuA");
        var width = gfx.getTextWidth(text);
        while(width > 128) {
            width -= 64;
            gfx.drawSprite("sheet", tile, 11, 16 * xi++, 2 + y * 16, "menuA");
        }
        gfx.drawSprite("sheet", tile + 1, 11, 16 * xi, 2 + y * 16, "menuA");
        gfx.drawText(text, 2, 10.5 + y * 16);
        this.options.push(xi);
    }
};
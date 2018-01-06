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
        pausemenu.drawOption("menu.Items", 0, pausemenu.cursorY == 0);
        pausemenu.drawOption("menu.Equipment", 1, pausemenu.cursorY == 1);
        pausemenu.drawOption("menu.Farm", 2, pausemenu.cursorY == 2);
        pausemenu.drawOption("menu.Options", 3, pausemenu.cursorY == 3);
        pausemenu.drawOption("menu.Save", 4, pausemenu.cursorY == 4);
        gfx.drawCursor(0, pausemenu.cursorY, pausemenu.options[pausemenu.cursorY], 0);
        pausemenu.addText(GetText("menu.level") + player.level, 4, 0);
        pausemenu.addLabeledText("menu.HP", player.health + "/" + player.maxhealth, 6, 0);
        pausemenu.addLabeledText("menu.ATK", player.atk, 4.5, 0.5);
        pausemenu.addLabeledText("menu.DEF", player.def, 7, 0.5);
        pausemenu.addLabeledText("menu.nextLevel", player.exp + "/" + player.nextExp, 3.5, 1);
        pausemenu.addLabeledText("menu.totalEXP", player.totalExp, 4, 1.5);
        pausemenu.addLabeledText("menu.coins", player.monies, 4.5, 2.5);
        pausemenu.addLabeledText("menu.timePlayed", player.getPlayTimeString(), 2.5, 3);
    },
    addLabeledText: function(label, val, x, y) { gfx.drawText(GetText(label) + ": " + val, 2 + x * 16, 10.5 + y * 16); },
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
            case 0: game.innerTransition(this, pausemenu.inventory); break;
            case 1: game.innerTransition(this, pausemenu.equipment); break;
            case 2: game.innerTransition(this, pausemenu.farmmod); break;
            case 3: game.innerTransition(this, worldmap.optionsMenu, true); break;
            case 4: game.innerTransition(this, pausemenu.savemenu, { saving: true }); break;
            default: return false;
        }
        return true;
    },
    keyPress: function(key) {
        var pos = { x: 0, y: this.cursorY };
        var isEnter = false;
        switch(key) {
            case player.controls.up: pos.y--; break;
            case player.controls.down: pos.y++; break;
            case player.controls.confirm:
            case player.controls.pause: isEnter = true; break;
            case player.controls.cancel: return this.cancel();
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
        text = GetText(text);
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
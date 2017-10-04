worldmap.title = {
    cursory: 0, showContinue: false, state: 0,
    layersToClear: ["menutext", "menucursorA"],
    menuItems: [],
    setup: function(cursy) {
        this.cursory = cursy || 0; this.state = 0;
        this.showContinue = this.hasSaves();
        gfx.drawFullImage("title");
        this.menuItems = this.getMainMenuItems();
        this.drawMenu();
    },
    getMainMenuItems: function() {
        if(this.state === 1) {
            // another menu
        }
        return (this.hasSaves() ? ["New Game", "Continue", "Options"] : ["New Game", "Options"]);
    },
    hasSaves: function() {
        for(var i = 0; i < 10; i++) {
            if(localStorage.getItem("file" + i) !== null) { return true; }
        }
        return false;
    },
    drawMenu: function() {
        gfx.clearSome(this.layersToClear);
        for(var i = 0; i < this.menuItems.length; i++) {
            var spr = (this.cursory === i ? "titleSelActive" : "titleSel");
            gfx.drawTileToGrid(spr + "0", 6, i + 6, "menutext");
            gfx.drawTileToGrid(spr + "1", 7, i + 6, "menutext");
            gfx.drawTileToGrid(spr + "2", 8, i + 6, "menutext");
            var dx = (176 - gfx.getTextLength(this.menuItems[i])) / 8;
            gfx.drawText(this.menuItems[i], 99.5 + dx, i * 16 + 106);
        }
    },
    mouseMove: function(pos) {
        if(pos.y < 0 || pos.y >= this.menuItems.length) { return false; }
        this.cursory = pos.y;
        this.drawMenu();
        return true;
    },
    click: function(pos) {
        if(this.state === 0) {
            switch(this.cursory) {
                case 0:
                    return game.transition(this, worldmap, {
                        init: { x: 10,  y: 7 },
                        map: "farmersmarket"
                    });
                case 1:
                    return game.transition(this, pausemenu.savemenu, { saving: false });
            }
        }
    },
    clean: function() { gfx.clearAll(); },
    keyPress: function(key) {
        var pos = { x: 0, y: this.cursory };
        var isEnter = false;
        switch(key) {
            case "w": pos.y--; break;
            case "s": pos.y++; break;
            case " ":
            case "Enter": isEnter = true; break;
            //case "q": return this.cancel();
        }
        if(pos.y < 0 || pos.y > 2) { return false; }
        if(isEnter) {
            return this.click(pos);
        } else {
            return this.mouseMove(pos);
        }
    }
};
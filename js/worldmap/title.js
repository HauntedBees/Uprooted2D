var debug = {
    MapTextTest: function(skip) {
        var allText = [];
        var doSkip = (skip !== undefined);
        for(var i in fulltext) { 
            if(fulltext[i].type !== "map") { continue; }
            if(doSkip) { if(i === skip) { doSkip = false; } else { continue; } }
            allText.push(function(x) { return function() { console.log(x); worldmap.writeText(x); }; }(i));
        }
        mapentities["farm"].push({ name: "DebugFriend", pos: { x: 0, y: 0 }, solid: false, autoplay: true, interact: allText });
        game.transition(game.currentInputHandler, worldmap, { init: { x: 1, y: 1 }, map: "farm" });
    }
};
worldmap.title = {
    cursory: 0, showContinue: false,
    layersToClear: ["menutext", "menucursorA"],
    menuItems: [],
    setup: function(cursy) {
        this.cursory = cursy || 0;
        this.showContinue = this.hasSaves();
        gfx.drawFullImage("title");
        this.menuItems = this.getMainMenuItems();
        this.drawMenu();
    },
    getMainMenuItems: function() {
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
            var selected = this.cursory === i;
            var spr = (selected ? "titleSelActive" : "titleSel");
            if(selected) { gfx.drawTileToGrid("carrotSel", 5, i + 6, "menutext"); }
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
        switch(this.cursory) {
            case 0:
                return game.transition(this, worldmap, {
                    //init: { x: 10,  y: 5 }, map: "farmersmarket"
                    init: { x: 17,  y: 9 }, map: "farm_init"
                });
            case 1: return game.transition(this, pausemenu.savemenu, { saving: false });
            case 2: return game.transition(this, worldmap.optionsMenu);
        }
    },
    clean: function() { gfx.clearAll(); },
    keyPress: function(key) {
        var pos = { x: 0, y: this.cursory };
        var isEnter = false;
        switch(key) {
            case player.controls.up: pos.y--; break;
            case player.controls.down: pos.y++; break;
            case player.controls.confirm:
            case player.controls.pause: isEnter = true; break;
            //case player.controls.cancel: return this.cancel();
        }
        if(pos.y < 0 || pos.y > 2) { return false; }
        if(isEnter) {
            return this.click(pos);
        } else {
            return this.mouseMove(pos);
        }
    }
};
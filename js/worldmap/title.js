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
                    init: { x: 17,  y: 9 }, map: "farm_init" // beginning of game
                    //init: { x: 10,  y: 5 }, map: "producestand" // cutscene position
                    //init: { x: 12,  y: 4 }, map: "farm" // by boss
                    //init: { x: 2,  y: 1 }, map: "farm" // by beehive
                    //init: { x: 19, y: 5}, map: "firstvillage" // top of village
                    //init: { x: 44,  y: 49 }, map: "forest" // start of forest
                    //init: { x: 11,  y: 60 }, map: "forest" // by boss turkey
                    //init: { x: 82,  y: 25 }, map: "forest" // by rabbit
                    //init: { x: 103,  y: 65 }, map: "forest" // by lime
                    //init: { x: 25, y: 25}, map: "belowvillage" // by crater
                    //init: { x: 4, y: 37}, map: "belowvillage" // by beehive
                    //init: { x: 20, y: 19}, map: "researchfacilitynew" // by seed shooters
                    //init: { x: 27, y: 8}, map: "researchfacilitynew" // by RAPBATTLE
                    //init: { x: 44, y: 44 }, map: "southcity" // by Skumpy's
                    //init: { x: 15, y: 36 }, map: "southcity" // by mob base
                    //init: { x: 5, y: 5 }, map: "fakefarm"
                    //init: { x: 24.75, y: 35.5 }, map: "fakefarm"
                    //init: { x: 5, y: 3 }, map: "underwaternew"
                    //init: { x: 41, y: 20 }, map: "underwaternew"
                    //init: { x: 27, y: 5 }, map: "bridge"
                    //init: { x: 3, y: 7 }, map: "firstvillage"
                    //init: { x: 103,  y: 65 }, map: "forest"
                });
            case 1: return game.innerTransition(this, pausemenu.savemenu, { saving: false }); // this is probably wrong
            case 2: return game.innerTransition(this, worldmap.optionsMenu);
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
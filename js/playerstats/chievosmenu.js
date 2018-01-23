pausemenu.chievos = {
    cursor: { x: 0, y: 0 },
    achStartX: 1.375, achStartY: 0.5, achDX: 1.25, 
    numPerRow: 10, textStartY: 123, vals: [], yMax: 0, 
    layersToClear: ["menuA", "menucursorA", "menucursorB", "menutext"],
    setup: function() {
        this.cursor = {x: 0, y: 0};
        this.vals = [];
        this.drawAll(true);
    },
    drawAll: function(isFirst) {
        gfx.clearSome(this.layersToClear);
        gfx.drawInfobox(16, 5, 7);
        
        var idx = 0;
        for(var a in achievements) {
            var x = this.achStartX + this.achDX * (idx % this.numPerRow);
            var y = this.achStartY + this.achDX * Math.floor(idx / this.numPerRow);
            gfx.drawTileToGrid("a." + a, x, y, "menuA");
            var playerHasAchievement = player.achievements.indexOf(a) >= 0;
            if(!playerHasAchievement) { gfx.drawTileToGrid("a.donthave", x, y, "menuA"); }
            if(isFirst) { this.vals.push([a, playerHasAchievement]); }
            idx++;
        }
        this.yMax = Math.floor(idx / this.numPerRow);

        gfx.drawCursor(this.achStartX + this.cursor.x * this.achDX, this.achStartY + this.cursor.y * this.achDX, 0, 0);
        this.setText();
    },
    clean: function() { gfx.clearSome(this.layersToClear); },
    cancel: function() { game.innerTransition(this, pausemenu, 4); },
    mouseMove: function(pos) {
        if(pos.x < 0 || pos.y < 0 || pos.y >= this.yMax || pos.x >= this.numPerRow) { return false; }
        this.cursor = { x: pos.x, y: pos.y };
        this.drawAll();
        return true;
    },
    click: function(pos) { return true; },
    keyPress: function(key) {
        var pos = { x: this.cursor.x, y: this.cursor.y };
        var isEnter = false;
        switch(key) {
            case player.controls.up: pos.y--; break;
            case player.controls.left: pos.x--; break;
            case player.controls.down: pos.y++; break;
            case player.controls.right: pos.x++; break;
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
    setText: function() {
        var chievoInfo = this.vals[this.cursor.y * this.numPerRow + this.cursor.x];
        gfx.drawWrappedText(GetText("a." + chievoInfo[0]), 4, this.textStartY, 235);
        gfx.drawWrappedText(GetText("ad." + (chievoInfo[1] ? chievoInfo[0] : "none")), 4, this.textStartY + 10, 235);
    }
};
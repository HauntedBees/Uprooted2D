pausemenu.chievos = {
    cursor: { x: 0, y: 0 },
    achStartX: 1, achStartY: 2, achDX: 1.25, 
    backStartX: 0, backButtonW: 0, 
    numPerRow: 11, textStartY: 157, vals: [], yMax: 0, 
    layersToClear: ["menuA", "menutext"],
    setup: function() {
        this.cursor = { x: 0, y: 0 };
        this.cursors = new CursorAnimSet([
            { key: "main", x: this.cursor.x, y: this.cursor.y, w: 0, h: 0, type: "cursor", layer: "menucursorA" }
        ]);
        this.vals = [];
        gfx.TileBackground("invTile");
        this.backStartX = 0.125;
        this.backButtonW = gfx.drawInfoText(GetText("menu.Back"), this.backStartX, -0.0625, false, "menuA", "menutext");
        this.drawAll(true);
        this.cursors.Start();
    },
    drawAll: function(isFirst) {
        gfx.clearSome(this.layersToClear);
        pausemenu.DrawInnerHeading("a.Heading");
        gfx.drawInfobox(17, 5, 9, "", "FarmInfo");
        for(let idx = 0; idx < achievements.length; idx++) {
            const a = achievements[idx];
            const x = this.achStartX + this.achDX * (idx % this.numPerRow);
            const y = this.achStartY + this.achDX * Math.floor(idx / this.numPerRow);
            gfx.drawTileToGrid("a." + a, x, y, "menuA");
            const playerHasAchievement = player.achievements.indexOf(a) >= 0;
            if(!playerHasAchievement) { gfx.drawTileToGrid("a.donthave", x, y, "menuA"); }
            else if(player.newAchievements.indexOf(a) >= 0) { gfx.drawTileToGrid("a.frame", x, y, "menuA"); }
            if(isFirst) { this.vals.push([a, playerHasAchievement]); }
        }
        this.yMax = Math.floor(achievements.length / this.numPerRow);
        gfx.drawInfoText(GetText("menu.Back"), this.backStartX, -0.0625, this.cursor.y === -1 && this.cursor.x === 0, "menuA", "menutext");
        if(this.cursor.y === -1) {
            this.cursors.RedimCursor("main", this.backStartX, 0, this.backButtonW, -0.25);
            gfx.drawWrappedText(GetText("inv.BackInfo"), 4, this.textStartY, 235);
        } else {
            this.cursors.RedimCursor("main", this.achStartX + this.cursor.x * this.achDX, this.achStartY + this.cursor.y * this.achDX, 0, 0);
            this.setText();
        }
    },
    cancel: function() {
        player.newAchievements = [];
        game.innerTransition(this, pausemenu, player.onion ? 5 : 4);
        Sounds.PlaySound("cancel");
    },
    mouseMove: function(pos) {
        const dpos = { x: (pos.x - this.achStartX) / this.achDX, y: (pos.y - this.achStartY) / this.achDX };
        if(dpos.y < -0.8) {
            dpos.x += this.achStartX;
            dpos.y = -1;
            if(dpos.x >= this.backStartX && dpos.x < (this.backButtonW + 1)) {
                dpos.x = 0;
            } else { return false; }
        } else {
            input.FloorPoint(dpos);
            if(dpos.y < 0 || dpos.x < 0) { return false; }
        }
        this.CursorMove(dpos);
    },
    click: function() {
        if(this.cursor.y === -1) { this.cancel(); }
        return true;
    },
    keyPress: function(key) {
        const pos = { x: this.cursor.x, y: this.cursor.y };
        let isEnter = false;
        switch(key) {
            case player.controls.up: pos.y--; break;
            case player.controls.left: pos.x--; break;
            case player.controls.down: pos.y++; break;
            case player.controls.right: pos.x++; break;
            case player.controls.confirm: isEnter = true; break;
            case player.controls.pause: 
            case player.controls.cancel: return this.cancel();
        }
        if(pos.y < -1 || pos.x < 0) { return false; }
        if(isEnter) { return this.click(); }
        else { return this.CursorMove(pos); }
    },
    CursorMove: function(pos) {
        if(pos.x < 0 || pos.y < -1 || pos.y >= this.yMax || pos.x >= this.numPerRow) { return false; }
        if(pos.y === -1) { pos.x = 0; }
        if(SamePoints(this.cursor, pos)) { return false; }
        Sounds.PlaySound("menuMove");
        this.cursor = { x: pos.x, y: pos.y };
        this.drawAll();
        return true;
    },
    setText: function() {
        const chievoInfo = this.vals[this.cursor.y * this.numPerRow + this.cursor.x];
        console.log(chievoInfo);
        const chievoKey = chievoInfo[0];
        gfx.drawWrappedText(GetText("a." + chievoKey), 4, this.textStartY, 235);
        if(chievoInfo[1]) { // achieved chievo
            gfx.drawWrappedText(GetText("ad." + chievoKey), 4, this.textStartY + 10, 235);
        } else if(hiddenChievos.indexOf(chievoKey) < 0) { // regular unachieved chievo
            gfx.drawWrappedText(GetText("ad.none") + " \n \n " + GetText("ad." + chievoKey), 4, this.textStartY + 10, 235);
        } else { // locked unachieved chievo
            gfx.drawWrappedText(GetText("ad.none") + " \n \n " + GetText("ad.locked"), 4, this.textStartY + 10, 235);
        }
    }
};
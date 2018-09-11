worldmap.pottyCheck = {
    cursory: 0, state: 0, 
    setup: function() {
        this.cursory = 0;
        this.state = 0;
        this.DrawAll();
    },
    DrawAll: function() {
        gfx.clearAll();
        gfx.TileBackground("optTile");
        gfx.drawMinibox(0.5, 4.5, 14, 4, "menuA");
        if(this.state === 0) {
            gfx.drawWrappedText(GetText("pottyWordPanic"), 20, 85, 220);
            gfx.drawInfoText(GetText("pottyNo"), 4.5, 7.25, this.cursory === 0, "menuA", "menutext");
            gfx.drawInfoText(GetText("pottyYes"), 4, 8.25, this.cursory === 1, "menuA", "menutext");
        } else {
            if(this.cursory === 0) {
                gfx.drawWrappedText(GetText("pottyNo2"), 20, 85, 220);
            } else {
                gfx.drawWrappedText(GetText("pottyYes2"), 20, 85, 220);
            }
            gfx.drawInfoText(GetText("pottyOK"), 7, 8, true, "menuA", "menutext");
        }
    },
    mouseMove: function(pos) {
        if(pos.x < 4 || pos.x > 12 || pos.y < 7.25 || pos.y > 9) { return false; }
        return this.CursorMove({ x: 0, y: (pos.y < 8.25 ? 0 : 1) });
    },
    CursorMove: function(pos) {
        if(pos.y < 0 || pos.y > 1 || this.state === 1) { return false; }
        this.cursory = pos.y;
        this.DrawAll();
        return true;
    },
    click: function(isFresh) {
        if(!isFresh) { return false; }
        Sounds.PlaySound("confirm", true);
        if(this.state === 0) {
            this.state = 1;
            player.options.canSayFuck = this.cursory;
            this.DrawAll();
        } else {
            game.transition(this, worldmap, { init: { x: 17,  y: 9 }, map: "farm" });
        }
        return true;
    },
    clean: function() { clearInterval(this.animIdx); gfx.clearAll(); },
    keyPress: function(key) {
        let pos = { x: 0, y: this.cursory }, isEnter = false;
        switch(key) {
            case player.controls.up: pos.y--; break;
            case player.controls.down: pos.y++; break;
            case player.controls.confirm:
            case player.controls.pause: isEnter = true; break;
        }
        if(pos.y < 0 || pos.y > 2) { return false; }
        if(isEnter) { return this.click(input.IsFreshPauseOrConfirmPress()); }
        else { return this.CursorMove(pos); }
    }
};
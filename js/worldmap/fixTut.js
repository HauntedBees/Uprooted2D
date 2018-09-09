const fixTut = {
    mouseReady: true, 
    isTutorial: true, state: 0, currentInputHandler: worldmap,
    start: function() {
        game.currentInputHandler = this;
        this.currentInputHandler = worldmap;
        this.state = 0;
        this.drawTutorial();
    },
    transition: function(from, to, arg) { // 298 TODO: do the fuckin fancy shit
        this.currentInputHandler = to;
        game.CleanHandler(from);
        to.setup(arg);
    },
    clean: () => gfx.clearSome(["menutextOverBlack", "menuOverBlack"]),
    drawTutorial: function() {
        gfx.clearSome(["menutextOverBlack", "menuOverBlack"]);
        if(this.state > 0) {
            gfx.drawTextBox(11, true);
            gfx.drawFullText(GetText("fixTut" + (this.state + 1)), 11 * 16, undefined, true);
        }
    },
    mouseMove: function(pos) {
        const res = fixTut.currentInputHandler.mouseMove(pos);
        this.drawTutorial();
        return res;
    },
    click: () => fixTut.keyPress(player.controls.confirm),
    keyPress: function(key) {
        if(this.state === 0) {
            if(key === player.controls.pause) {
                this.transition(worldmap, pausemenu);
                this.state++;
                this.drawTutorial();
                return true;
            } else {
                return false;
            }
        } else if(this.state === 1) {
            if(key === player.controls.cancel) { return false; } // 295 TODO: should disable pause too, honestly
            if(key === player.controls.confirm || key === player.controls.pause) {
                if(pausemenu.cursorY !== 2) { return false; }
                this.transition(pausemenu, pausemenu.farmmod);
                this.state++;
                this.drawTutorial();
                return true;
            }
            const res = this.currentInputHandler.keyPress(key);
            this.drawTutorial();
            return res;
        } else if(this.state === 2) {
            if(key === player.controls.cancel || pausemenu.farmmod.cursor.y < 0) { return false; } 
            if(key === player.controls.confirm || key === player.controls.pause) {
                const pos = pausemenu.farmmod.cursor;
                if(pos.y >= 4 || pos.x >= pausemenu.farmmod.inventoryWidth) { return false; }
                const idx = pos.y * pausemenu.farmmod.inventoryWidth + pos.x;
                if(idx >= pausemenu.farmmod.actualIndexes.length) { return false; }
                pausemenu.farmmod.click(pos);
                this.state++;
                this.drawTutorial();
                return true;
            }
            const res = this.currentInputHandler.keyPress(key);
            this.drawTutorial();
            return res;
        } else if(this.state === 3) {
            if(key === player.controls.cancel) { return false; } 
            if(key === player.controls.confirm || key === player.controls.pause) {
                const pos = pausemenu.farmmod.cursor;
                if(pos.y < 4) { return false; }
                const didWork = pausemenu.farmmod.click(pos);
                if(!didWork) { return false; }
                this.state++;
                this.drawTutorial();
                return true;
            }
            const res = this.currentInputHandler.keyPress(key);
            this.drawTutorial();
            return res;
        } else if(this.state === 4) {
            if(key === player.controls.cancel || key === player.controls.confirm || key === player.controls.pause) {
                this.state++;
                player.fixtureTutorialState = 2;
                game.currentInputHandler = pausemenu.farmmod;
                game.transition(pausemenu.farmmod, worldmap, {
                    init: worldmap.pos,
                    map: worldmap.mapName,
                    noEntityUpdate: true
                });
                return true;
            }
            return false;
        }
    }
};
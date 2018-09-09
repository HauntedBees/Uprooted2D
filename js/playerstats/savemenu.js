pausemenu.savemenu = {
    options: [], cursorY: 0, confirmCursorY: 0, confirm: false, isSave: false, animHelper: null,
    layersToClear: ["background", "menuA", "menutext"], textX: 72, textY: 30,
    setup: function(args) {
        gfx.clearSome(this.layersToClear);
        this.animHelper = new CombatAnimHelper([]);
        if(args === undefined) { args = {}; }
        this.isSave = args.saving;
        this.hasAuto = !this.isSave && localStorage.getItem("fileImgauto") !== null;
        this.options = [];
        this.cursorY = args.sel || 0;
        this.confirm = args.confirm;
        this.confirmCursorY = 0;
        this.backStartX = 0.125;
        this.backButtonW = gfx.drawInfoText(GetText("menu.Back"), this.backStartX, -0.0625, false, "menuA", "menutext");
        this.cursors = new CursorAnimSet([
            { key: "main", x: 0, y: this.cursorY, w: 0, h: 0, type: "cursor", layer: "menucursorA" }
        ]);
        this.DrawAll();
        this.cursors.Start();
    },
    DrawAll: function() {
        gfx.clearSome(this.layersToClear);
        gfx.TileBackground("invTile");
        pausemenu.DrawInnerHeading(this.isSave ? "saveHeading" : "loadHeading");
        const slotStr = GetText("saveSlotDisp") + " ";
        const dy = this.hasAuto ? 2 : 1;
        this.options = [];
        if(this.hasAuto) { this.drawOption(GetText("autosave"), 1, this.cursorY === 0); }
        for(let i = 0; i < game.numSaveSlots; i++) {
            this.drawOption(slotStr + (i + 1), dy + i, this.cursorY === (dy + i - 1));
        }
        gfx.drawInfoText(GetText("menu.Back"), this.backStartX, -0.0625, this.cursorY === -1, "menuA", "menutext");
        gfx.drawInfobox(12, 2.5, 1.125);
        if(this.confirm) {
            this.drawSaveDataText(GetText("eraseSave"));
            const yw = gfx.drawInfoText(GetText("sYes"), 6, 2.5, this.confirmCursorY === 0, "menuA", "menutext");
            const nw = gfx.drawInfoText(GetText("sNo"), 10, 2.5, this.confirmCursorY === 1, "menuA", "menutext");
            this.cursors.RedimCursor("main", this.confirmCursorY === 1 ? 10 : 6, 2.5, this.confirmCursorY === 1 ? nw : yw, 0);
        } else if(this.cursorY === -1) {
            this.drawSaveDataText(GetText("inv.BackInfo"));
            this.cursors.RedimCursor("main", this.backStartX, 0, this.backButtonW, -0.25);
        } else {
            this.cursors.RedimCursor("main", 0, this.cursorY + 1, this.options[this.cursorY], 0);
            const saveNum = (this.hasAuto && this.cursorY === 0 ? "auto" : (this.cursorY - (dy - 1)));
            this.displaySaveDataInfo(saveNum);
        }
    },
    displaySaveDataInfo: function(savenum) {
        const slotData = localStorage.getItem("player" + savenum);
        if(slotData === null) { return this.drawSaveDataText(GetText("noSave")); }
        const loadedPlayer = game.str2obj(slotData);
        if(loadedPlayer.saveVersion === undefined) {
            return this.drawSaveDataText("This Save is incompatible with this version of the game.");
        }
        const text = GetText("saveInfoStr")
                            .replace(/\{level\}/g, loadedPlayer.level)
                            .replace(/\{monies\}/g, loadedPlayer.monies)
                            .replace(/\{time\}/g, player.getPlayTimeString(loadedPlayer.playTime))
                            .replace(/\{location\}/g, GetText("map." + loadedPlayer.mapName));
        loadedPlayer.hasQuest = q => loadedPlayer.activeQuests[q] !== undefined;
        loadedPlayer.hasQuestState = (q, state) => loadedPlayer.activeQuests[q] !== undefined && state === loadedPlayer.activeQuests[q];
        loadedPlayer.completedQuest = q => loadedPlayer.questsCleared.indexOf(q) >= 0;
        loadedPlayer.hasOrHasHadQuest = q => loadedPlayer.questsCleared.indexOf(q) >= 0 || loadedPlayer.activeQuests[q] !== undefined;
        pausemenu.GetQuestItems(loadedPlayer);
        for(let i = 0; i < pausemenu.questItems.length; i++) {
            gfx.drawTileToGrid(pausemenu.questItems[i], 5 + (i * 1.5), 2.5, "menuA");
        }
        const image = localStorage.getItem("fileImg" + savenum);
        if(image !== null && image !== "null") {
            gfx.drawSaveFileImage(image);
            this.animHelper.DrawWrapper(4, 4.5, 11, 8);
        }
        return this.drawSaveDataText(text);
    },
    drawSaveDataText: t => { gfx.drawWrappedText(t, pausemenu.savemenu.textX, pausemenu.savemenu.textY, 175); return true; },
    drawOption: function (text, y, selected) { this.options.push(gfx.drawOption(text, y, selected)); },
    mouseMove: function(pos) {
        const dpos = { x: pos.x, y: pos.y - 1 };
        input.FloorPoint(dpos);
        if(this.confirm) {
            if(dpos.y != 1 && dpos.y != 2) { return false; }
            if(dpos.x >= 6 && dpos.x < 9) { dpos.x = -1; }
            else if(dpos.x >= 10 && dpos.x < 12) { dpos.x = 1; }
            else { return false; }
        } else {
            if(dpos.y < -1 || dpos.y >= this.options.length) { return false; }
            if(dpos.y === -1) {
                if(dpos.x > (this.backButtonW + 1)) { return false; }
            } else {
                if(dpos.x > this.options[dpos.y]) { return false; }
            }
        }
        this.CursorMove(dpos);
    },
    click: function() {
        const dy = this.hasAuto ? 1 : 0;
        const saveNum = (this.hasAuto && this.cursorY === 0 ? "auto" : (this.cursorY - dy));
        if(this.cursorY === -1) {
            this.cancel();
        } else if(localStorage.getItem("player" + saveNum) === null || (this.confirm && this.confirmCursorY === 0)) {
            if(this.isSave) {
                game.save(this.cursorY);
                this.saving = true;
                this.confirm = false;
                this.DrawAll();
            }
        } else {
            if(this.confirm && this.confirmCursorY === 1) {
                this.cancel();
            } else if(this.isSave) {
                this.saving = true;
                this.confirm = true;
                this.confirmCursorY = 0;
                this.DrawAll();
            } else {
                game.load(saveNum);
            }
        }
        return true;
    },
    cancel: function() {
        if(this.confirm) {
            this.saving = true;
            this.confirm = false;
            this.DrawAll();
        } else if(this.isSave) {
            game.innerTransition(this, pausemenu, 5);
        } else {
            game.innerTransition(this, worldmap.title, 1);
        }
    },
    keyPress: function(key) {
        const pos = { x: 0, y: this.cursorY };
        let isEnter = false;
        switch(key) {
            case player.controls.left: pos.x--; break;
            case player.controls.right: pos.x++; break;
            case player.controls.up: pos.y--; break;
            case player.controls.down: pos.y++; break;
            case player.controls.confirm:
            case player.controls.pause: isEnter = true; break;
            case player.controls.cancel: return this.cancel();
        }
        if(pos.y < -1) { return false; }
        if(isEnter) { return this.click(pos); }
        else { return this.CursorMove(pos); }
    },
    CursorMove: function(pos) {
        if(this.confirm) {
            if(pos.x === 1) { this.confirmCursorY = 1; }
            else if(pos.x === -1) { this.confirmCursorY = 0; }
            this.DrawAll();
            return true;
        }
        if(pos.y >= this.options.length) { return false; }
        this.cursorY = pos.y;
        this.DrawAll();
        return true;
    }
};
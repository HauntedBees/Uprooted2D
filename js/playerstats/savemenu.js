pausemenu.savemenu = {
    options: [], cursorY: 0, confirmCursorY: 0, confirm: false, isSave: false, animHelper: null, clearSavesState: 0, 
    layersToClear: ["background", "menuA", "menutext"], textX: 72, textY: 30,
    setup: function(args) {
        gfx.clearSome(this.layersToClear);
        this.animHelper = new CombatAnimHelper([]);
        if(args === undefined) { args = {}; }
        this.isSave = args.saving;
        this.hasAuto = !this.isSave && localStorage.getItem("fileImgauto") !== null;
        this.options = [];
        this.cursorY = args.sel || player.lastSaveSlot;
        this.confirm = args.confirm;
        this.confirmCursorY = 0;
        this.backStartX = 0.125;
        this.clearSavesState = 0;
        this.backButtonW = gfx.DrawCombatOption(GetText("menu.Back"), this.backStartX, -0.0625, false);
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
        if(!this.isSave) {
            this.drawOption(GetText("clearSaves"), dy + game.numSaveSlots, this.cursorY === (dy + game.numSaveSlots - 1));
        }
        gfx.DrawCombatOption(GetText("menu.Back"), this.backStartX, -0.125, this.cursorY === -1);
        gfx.drawInfobox(12, 2.5, 1.125, "", "FarmInfo");
        if(this.confirm) {
            this.drawSaveDataText(GetText("eraseSave"));
            screenReaderHelper.SayThing(GetText("eraseSave"), "option");
            const yw = gfx.drawInfoText(GetText("sYes"), 6, 2.5, this.confirmCursorY === 0, "menuA", "menutext");
            const nw = gfx.drawInfoText(GetText("sNo"), 10, 2.5, this.confirmCursorY === 1, "menuA", "menutext");
            this.cursors.RedimCursor("main", this.confirmCursorY === 1 ? 10 : 6, 2.5, this.confirmCursorY === 1 ? nw : yw, 0);
        } else if(this.cursorY === -1) {
            this.drawSaveDataText(GetText("inv.BackInfo"));
            this.cursors.RedimCursor("main", this.backStartX - 0.0625, -0.0625, this.backButtonW - 1.0625, 0);
            screenReaderHelper.SayThing(GetText("inv.BackInfo"), "option");
        } else if(this.cursorY === (dy + game.numSaveSlots - 1)) { // clear save data
            let myText = "";
            if(this.clearSavesState === 0) {
                this.cursors.RedimCursor("main", 0, this.cursorY + 1, this.options[this.cursorY], 0);
                myText = GetText("clearSavesInfo");
            } else if(this.clearSavesState === 1) {
                const xi = gfx.drawInfoText(GetText("opNo"), 9, 4, true, "menuA", "menutext");
                gfx.drawInfoText(GetText("opYes"), 9, 5, false, "menuA", "menutext");
                this.cursors.RedimCursor("main", 9, 4, xi, 0);
                myText = GetText("clearSavesConfirm");
            } else if(this.clearSavesState === 2) {
                gfx.drawInfoText(GetText("opNo"), 9, 4, false, "menuA", "menutext");
                const xi = gfx.drawInfoText(GetText("opYes"), 9, 5, true, "menuA", "menutext");
                this.cursors.RedimCursor("main", 9, 5, xi, 0);
                myText = GetText("clearSavesConfirm");
            } else if(this.clearSavesState === 3) {
                myText = GetText("clearSavesCleared");
            }
            this.drawSaveDataText(myText);
            screenReaderHelper.SayThing(myText, "option");
        } else {
            this.cursors.RedimCursor("main", 0, this.cursorY + 1, this.options[this.cursorY], 0);
            const saveNum = (this.hasAuto && this.cursorY === 0 ? "auto" : (this.cursorY - (dy - 1)));
            this.displaySaveDataInfo(saveNum);
        }
    },
    displaySaveDataInfo: function(savenum) {
        const slotData = localStorage.getItem("player" + savenum);
        if(slotData === null) {
            screenReaderHelper.SayThing(GetText("noSave"), "option");
            return this.drawSaveDataText(GetText("noSave"));
        }
        const loadedPlayer = game.str2obj(slotData);
        if(loadedPlayer.saveVersion === undefined) {
            const badSaveText = GetText("incompatibleSave");
            screenReaderHelper.SayThing(badSaveText, "option");
            return this.drawSaveDataText(badSaveText);
        }
        screenReaderHelper.SayThing(`Save Slot ${savenum === "auto" ? savenum : (savenum + 1)}. Level ${loadedPlayer.level}. Location: ${GetText("map." + loadedPlayer.mapName)}`, "option");
        const text = GetText("saveInfoStr")
                            .replace(/\{level\}/g, loadedPlayer.level)
                            .replace(/\{monies\}/g, loadedPlayer.monies)
                            .replace(/\{time\}/g, player.getPlayTimeString(loadedPlayer.playTime))
                            .replace(/\{lastSave\}/g, player.GetLastSaveTime(loadedPlayer.saveTime))
                            .replace(/\{location\}/g, GetText("map." + loadedPlayer.mapName));
        loadedPlayer.hasQuest = q => loadedPlayer.activeQuests[q] !== undefined;
        loadedPlayer.hasQuestState = (q, state) => loadedPlayer.activeQuests[q] !== undefined && state === loadedPlayer.activeQuests[q];
        loadedPlayer.completedQuest = q => loadedPlayer.questsCleared.indexOf(q) >= 0;
        loadedPlayer.hasOrHasHadQuest = q => loadedPlayer.questsCleared.indexOf(q) >= 0 || loadedPlayer.activeQuests[q] !== undefined;
        pausemenu.GetQuestItems(loadedPlayer);
        for(let i = 0; i < pausemenu.questItems.length; i++) {
            gfx.drawTileToGrid(pausemenu.questItems[i], 5 + (i * 1.5), 3, "menuA");
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
        const dpos = { x: pos.x, y: pos.y - 1, isMouse: true };
        input.FloorPoint(dpos);
        if(this.clearSavesState > 0 && this.clearSavesState < 3) {
            if(pos.x < 9 || pos.x > 11 || pos.y < 4 || pos.y > 6) { return false; }
            dpos.y = this.cursorY + (pos.y < 5 ? -1 : 1);
        } else if(this.confirm) {
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
        } else if(!this.isSave && this.cursorY === (dy + game.numSaveSlots)) {
            if(this.clearSavesState === 0) {
                this.clearSavesState = 1;
                Sounds.PlaySound("confirm");
            } else if(this.clearSavesState === 1) {
                this.clearSavesState = 0;
                Sounds.PlaySound("cancel");
            } else if(this.clearSavesState === 2) {
                localStorage.clear();
                this.clearSavesState = 3;
                Sounds.PlaySound("confirm");
            } else if(this.clearSavesState === 3) {
                this.cancel();
                return true;
            }
            this.DrawAll();
            return true;
        } else if(localStorage.getItem("player" + saveNum) === null || (this.confirm && this.confirmCursorY === 0)) {
            if(this.isSave) {
                player.lastSaveSlot = saveNum;
                game.save(this.cursorY);
                this.saving = true;
                this.confirm = false;
                this.DrawAll();
                Sounds.PlaySound("confirm");
            }
        } else {
            if(this.confirm && this.confirmCursorY === 1) {
                this.cancel();
            } else if(this.isSave) {
                this.saving = true;
                this.confirm = true;
                this.confirmCursorY = 0;
                Sounds.PlaySound("confirm");
                this.DrawAll();
            } else {
                game.load(saveNum);
                Sounds.PlaySound("confirm", true);
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
            game.innerTransition(this, worldmap.title, 0);
        }
        Sounds.PlaySound("cancel");
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
        if(this.clearSavesState === 3 && !pos.isMouse) { this.cancel(); return true; }
        if(this.clearSavesState > 0) {
            if(pos.y < this.cursorY) {
                this.clearSavesState = 1;
                Sounds.PlaySound("menuMove");
            } else if(pos.y > this.cursorY) {
                this.clearSavesState = 2;
                Sounds.PlaySound("menuMove");
            }
        } else {
            if(this.confirm) {
                if(pos.x !== this.confirmCursorY) { Sounds.PlaySound("menuMove"); }
                if(pos.x === 1) { this.confirmCursorY = 1; }
                else if(pos.x === -1) { this.confirmCursorY = 0; }
                this.DrawAll();
                return true;
            }
            if(pos.y >= this.options.length) { return false; }
            if(this.cursorY === pos.y) { return false; }
            Sounds.PlaySound("menuMove");
            this.cursorY = pos.y;
        }
        this.DrawAll();
        return true;
    }
};
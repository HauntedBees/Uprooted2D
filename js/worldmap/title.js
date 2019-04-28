worldmap.title = {
    availableCrops: ["asparagus", "beet", "bellpepper", "carrot", "corn", "garlic", "ginger", "leek", "pineapple", "radish", "rhubarb", "spinach", "tomato", "lotus", "soybean"],
    cursory: 0, showContinue: false,
    layersToClear: ["menutext", "menucursorA"],
    menuItems: [], animIdx: 0, animPos: 0, animCrops: [], clouds: [],
    setup: function(cursy) {
        this.cursory = cursy || 0;
        this.showContinue = this.HasSaves();
        if(this.cursory === 2 && ! this.showContinue) { this.cursory = 1; }
        this.animPos = 0; this.animCrops = [];
        this.clouds = [ { x: 0, y: 5 }, { x: 4, y: 0 }, { x: 12, y: 7 } ];
        for(let i = 0; i < 7; i++) { this.AddAnimCrop(true); }
        this.animIdx = setInterval(worldmap.title.Animate, 41.7);
        gfx.drawFullImage("title");
        gfx.drawFullImage("titleTop", "characters");
        this.menuItems = (this.showContinue ? ["title.new", "title.cont", "title.options"] : ["title.new", "title.options"]);
        this.DrawMenu();
        gfx.drawText(String.fromCharCode(169) + " 2019 Haunted Bees Productions (v" + player.saveVersion + ")", 2, 222, undefined, 20, "menutextOverBlack");
    },
    HasSaves: function() {
        for(let i = 0; i < game.numSaveSlots; i++) {
            if(localStorage.getItem("player" + i) !== null) { return true; }
        }
        return false;
    },
    Animate: function() {
        const idx = (worldmap.title.animPos++) % 16;
        gfx.clearLayer("background2");
        gfx.drawJumbo("titleGround", 0, -10, 1024, 256, idx, 0);
        gfx.drawJumbo("titleGround", -16, -10, 1024, 256, idx, 0);

        for(let i = worldmap.title.animCrops.length - 1; i >= 0; i--) {
            let e = worldmap.title.animCrops[i];
            e.x -= 1/16;
            gfx.drawTileToGrid(e.frame, e.x, e.y, "background2");
            if(e.x <= -1) { worldmap.title.animCrops.splice(i, 1); }
        }
        for(let i = 0; i < worldmap.title.clouds.length; i++) {
            let e = worldmap.title.clouds[i];
            e.x += 0.001;
            if(e.x > 17) { e.x = -2; }
            gfx.drawTileToGrid("titlecloud", RoundNear(e.x, 16), e.y, "background2");
        }
        if(Math.random() < 0.05 && worldmap.title.animCrops.length < 30) { worldmap.title.AddAnimCrop(); }
    },
    AddAnimCrop: function(onScreen) {
        const crop = GetCrop(RandomArrayItem(worldmap.title.availableCrops));
        const frame = crop.name + Math.floor(Math.random() * crop.frames);
        const x = onScreen ? RoundNear(Math.random() * 17, 4) : InclusiveRange(17, 20);
        const y = 9.5 + RoundNear(Math.random() * 1, 2);
        worldmap.title.animCrops.push({ frame: frame, x: x, y: y });
        worldmap.title.animCrops.sort((a, b) => b.y - a.y);
    },
    DrawMenu: function() {
        const dy = 7;
        gfx.clearSome(this.layersToClear);
        for(let i = 0; i < this.menuItems.length; i++) {
            const selected = this.cursory === i;
            const spr = (selected ? "titleSelActive" : "titleSel");
            if(selected) { gfx.drawTileToGrid("carrotSel", 5.5, i + dy, "menutext"); }
            gfx.drawTileToGrid(spr + "0", 6.5, i + dy, "menutext");
            gfx.drawTileToGrid(spr + "1", 7.5, i + dy, "menutext");
            gfx.drawTileToGrid(spr + "2", 8.5, i + dy, "menutext");
            const dispText = GetText(this.menuItems[i]);
            const dx = (184 - gfx.getTextLength(dispText)) / 8;
            gfx.drawText(dispText, 106.5 + dx, (i + dy) * 16 + 10);
        }
    },
    mouseMove: function(pos) {
        if(pos.x < 6 || pos.x > 10 || pos.y < 7 || pos.y > 9) { return; }
        return this.CursorMove( { x: 0, y: Math.floor(pos.y - 7) });
    },
    CursorMove: function(pos) {
        if(pos.y < 0 || pos.y >= this.menuItems.length) { return false; }
        this.cursory = pos.y;
        this.DrawMenu();
        return true;
    },
    click: function(isFresh) {
        if(!isFresh) { return false; }
        Sounds.PlaySound("confirm", true);
        switch(this.cursory) {
            case 0: return game.transition(this, worldmap.pottyCheck);
            case 1:
                if(this.showContinue) { return game.innerTransition(this, pausemenu.savemenu, { saving: false }); }
                else { return game.innerTransition(this, worldmap.optionsMenu); }
            case 2: return game.innerTransition(this, worldmap.optionsMenu);
        }
    },
    clean: function() { clearInterval(this.animIdx); gfx.clearAll(); },
    keyPress: function(key) {
        let pos = { x: 0, y: this.cursory }, isEnter = false;
        switch(key) {
            case player.controls.up: pos.y--; break;
            case player.controls.down: pos.y++; break;
            case player.controls.confirm:
            case player.controls.pause: isEnter = true; break;
            //case player.controls.cancel: return this.cancel();
        }
        if(pos.y < 0 || pos.y > 2) { return false; }
        if(isEnter) { return this.click(input.IsFreshPauseOrConfirmPress()); }
        else { return this.CursorMove(pos); }
    }
};
const AnyPress = () => true;
const tutorial = {
    isTutorial: true, attemptingLeave: false, completed: false, 
    state: 0, currentInputHandler: combat.menu,
    startBattle: function() {
        combat.startBattle(["Discussly"]);
        combat.lastPlantedPos.y = 2;
        game.currentInputHandler = this;
        this.attemptingLeave = false;
        this.currentInputHandler = combat.menu;
        this.state = 0;
        this.completed = false;
        player.hadFalcon = player.hasFalcon;
        player.hasFalcon = false;
        player.tempInventory = InventoryCopy(player.inventory);
        player.tempEquipment = player.equipment;
        player.equipment = player.tutorialEquipment;
        player.inventory = InventoryCopy(player.tutorialInventory);
        this.drawTutorial();
    },
    transition: function(from, to, arg) {
        this.currentInputHandler = to;
        from.clean();
        to.setup(arg);
    },
    clean: () => gfx.clearSome(["tutorial", "menutextOverBlack"]),
    drawTutorial: function() {
        gfx.clearSome(["tutorial", "menutextOverBlack"]);
        if(this.state === 39) {
            this.completed = true;
            game.currentInputHandler = tutorial.currentInputHandler;
            return;
        }
        const tutText = GetText("tut" + this.state);
        const textInfo = gfx.getWrappedTextInfo(tutText, 235);
        if(this.state === 999) {
            gfx.drawInfobox(17, 3, -0.5, "tutorial");
        } else {
            gfx.drawInfobox(17, Math.ceil(Math.max(2, textInfo.rows * 0.8)), -0.5, "tutorial");
        }
        if(this.state === 8) {
            this.DrawInformationalGentleman(GetText("tutInfoPower"), 7.75, 10.25);
            this.DrawInformationalGentleman(GetText("tutInfoGrowth"), 7.75, 11.25);
            this.DrawInformationalGentleman(GetText("tutInfoSeasons"), 7.75, 12.5);
        }
        gfx.drawWrappedText(tutText, 2, 8, 235, gfx.GetBlack(), "tutorial");
    },
    DrawInformationalGentleman: function(text, rightx, y) {
        let xi = 1;
        let width = gfx.getTextWidth(text) + 20;
        let xiimax = rightx + Math.ceil(width / 64);
        gfx.drawTile("tutArrow", (rightx + 1) * 16, y * 16 - 5, "tutorial");
        gfx.drawTile("recSelR", rightx * 16, y * 16 - 5, "tutorial");
        while(width > 128) {
            width -= 64;
            gfx.drawTile("recSelM", rightx * 16 - 16 * xi++, y * 16 - 5, "tutorial");
        }
        gfx.drawTile("recSelL", rightx * 16 - 16 * xi, y * 16 - 5, "tutorial");
        gfx.drawText(text, 7 + (rightx * 16 - 16 * xi), 3.5 + y * 16, undefined, undefined, "menutextOverBlack");
    },
    mouseMove: function(pos) { return this.currentInputHandler.mouseMove(pos); },
    click: function(pos) { return this.keyPress(player.controls.confirm, true, pos); },
    keyPress: function(key, isClick, clickPos) {
        if(this.state === 39) { return this.currentInputHandler.keyPress(key); }
        if(key === player.controls.cancel) { return false; }
        const isEnter = (key === player.controls.pause || key === player.controls.confirm);
        if(isEnter) {
            const runCheck = (this.state === 0 && combat.menu.cursorY === 3);
            let success = this.stateDetails[this.state]();
            if(!success && !runCheck) { Sounds.PlaySound("navNok"); return false; }
            if(!runCheck) {
                if(isClick) { success = tutorial.currentInputHandler.click(clickPos, true); }
                else { success = tutorial.currentInputHandler.keyPress(key); }
                if(!success) { return false; }
            }
            this.state++;
            this.drawTutorial();
            if(runCheck) {
                if(this.attemptingLeave) {
                    this.clean();
                    this.state = 100;
                    game.currentInputHandler = tutorial.currentInputHandler;
                    combat.wrapUpCombat();
                    const postCombat = game.target.postBattle;
                    clearInterval(combat.charAnimIdx);
                    game.transition(combat.menu, worldmap, {
                        init: worldmap.pos,
                        map: worldmap.mapName,
                        noEntityUpdate: true,
                        postCombat: postCombat
                    });
                    return true;
                } else {
                    this.attemptingLeave = true;
                    this.state = 999;
                    this.drawTutorial();
                    this.state = 0;
                    return false;
                }
            } else if(this.state < 38) {
                combat.enemies[0].health = 9999;
                player.health = Math.max(5, player.health);
            } else {
                if(combat.enemies.length > 0 && combat.enemies[0].health > 0) { combat.enemies[0].health = 1; }
            }
        } else {
            return this.currentInputHandler.keyPress(key);
        }
    },
    matchCoords: function(pos, x, y) { return pos.x === x && pos.y === y; },
    stateDetails: [ // 296 TODO: heights should be language-dependent probably
        () => combat.menu.cursorY === 0,
        () => tutorial.matchCoords(combat.plant.cursor, 2, 8.5),
        AnyPress,
        AnyPress,
        () => combat.menu.cursorY === 1,
        AnyPress,
        AnyPress,
        () => combat.menu.cursorY === 0,
        () => tutorial.matchCoords(combat.plant.cursor, 0, 8.5),
        AnyPress,
        AnyPress,
        () => combat.menu.cursorY === 1,
        AnyPress,
        AnyPress,
        () => combat.menu.cursorY === 0,
        () => tutorial.matchCoords(combat.plant.cursor, 0, 8.5),
        AnyPress,
        AnyPress,
        () => combat.menu.cursorY === 0,
        () => tutorial.matchCoords(combat.plant.cursor, 1, 8.5),
        AnyPress,
        AnyPress,
        () => combat.menu.cursorY === 1,
        AnyPress,
        AnyPress,
        () => combat.menu.cursorY === 0,
        () => tutorial.matchCoords(combat.plant.cursor, 1, 8.5),
        AnyPress,
        AnyPress,
        () => combat.menu.cursorY === 0,
        AnyPress,
        AnyPress,
        AnyPress,
        () => combat.menu.cursorY === 2,
        function() {
            const gridpos = { x: combat.compost.cursor.x - combat.dx, y: combat.compost.cursor.y - combat.dy };
            if(gridpos.x >= player.gridWidth || gridpos.y >= player.gridHeight || gridpos.x < 0 || gridpos.y < 0) { return false; }
            const tile = combat.grid[Math.floor(gridpos.x)][Math.floor(gridpos.y)];
            return tile != null && tile.name === "beet" && tile.rotten;
        },
        () => combat.compost.cursor.y === (combat.compost.dy + 1),
        AnyPress,
        AnyPress,
        AnyPress
    ]
};
function AnyPress() { return true; };
var tutorial = {
    isTutorial: true, attemptingLeave: false, completed: false, 
    state: 0, currentInputHandler: combat.menu,
    startBattle: function() {
        combat.startBattle(["Discussly"]);
        game.currentInputHandler = this;
        this.attemptingLeave = false;
        this.currentInputHandler = combat.menu;
        this.state = 0;
        this.completed = false;
        player.hadFalcon = player.hasFalcon;
        player.hasFalcon = false;
        player.tempInventory = InventoryCopy(player.inventory);
        player.inventory = InventoryCopy(player.tutorialInventory);
        this.drawTutorial();
    },
    transition: function(from, to, arg) {
        this.currentInputHandler = to;
        from.clean();
        to.setup(arg);
    },
    clean: function() { gfx.clearLayer("tutorial"); },
    drawTutorial: function() {
        gfx.clearLayer("tutorial");
        if(this.state === 39) {
            this.completed = true;
            game.currentInputHandler = tutorial.currentInputHandler;
            return;
        }
        if(this.state === 999) {
            gfx.drawInfobox(16, 3, -0.5, "tutorial");
        } else {
            gfx.drawInfobox(16, this.stateDetails[this.state].height, -0.5, "tutorial");
        }
        gfx.drawWrappedText(GetText("tut" + this.state), 2, 8, 235, "#000000", "tutorial");
    },
    mouseMove: function(pos) { return this.currentInputHandler.mouseMove(pos); },
    click: function(pos) { return true; },
    keyPress: function(key) {
        if(this.state === 39) { return this.currentInputHandler.keyPress(key); }
        if(key === player.controls.cancel) { return false; }
        var isEnter = (key === player.controls.pause || key === player.controls.confirm);
        if(isEnter) {
            var runCheck = (this.state === 0 && combat.menu.cursorY === 3);
            var success = this.stateDetails[this.state].advance();
            if(!success && !runCheck) { return false; }
            if(!runCheck) {
                success = tutorial.currentInputHandler.keyPress(key);
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
                    var postCombat = game.target.postBattle;
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
    stateDetails: [
        { height: 1.8, advance: function() { return (combat.menu.cursorY === 0) } },
        { height: 1.8, advance: function() { return tutorial.matchCoords(combat.plant.cursor, 2, 6); } },
        { height: 1.8, advance: AnyPress },
        { height: 3.5, advance: AnyPress },
        { height: 1.8, advance: function() { return (combat.menu.cursorY === 1); } },
        { height: 2.5, advance: AnyPress },
        { height: 2.5, advance: AnyPress },
        { height: 1.8, advance: function() { return (combat.menu.cursorY === 0) } },
        { height: 1.8, advance: function() { return tutorial.matchCoords(combat.plant.cursor, 0, 6); } },
        { height: 1.8, advance: AnyPress },
        { height: 1.8, advance: AnyPress },
        { height: 1.8, advance: function() { return (combat.menu.cursorY === 1); } },
        { height: 2.5, advance: AnyPress },
        { height: 1.8, advance: AnyPress },
        { height: 1.8, advance: function() { return (combat.menu.cursorY === 0) } },
        { height: 2.5, advance: function() { return tutorial.matchCoords(combat.plant.cursor, 0, 6); } },
        { height: 1.8, advance: AnyPress },
        { height: 1.8, advance: AnyPress },
        { height: 1.8, advance: function() { return (combat.menu.cursorY === 0) } },
        { height: 1.8, advance: function() { return tutorial.matchCoords(combat.plant.cursor, 1, 6); } },
        { height: 1.8, advance: AnyPress },
        { height: 1.8, advance: AnyPress },
        { height: 1.8, advance: function() { return (combat.menu.cursorY === 1); } },
        { height: 1.8, advance: AnyPress },
        { height: 1.8, advance: AnyPress },
        { height: 1.8, advance: function() { return (combat.menu.cursorY === 0) } },
        { height: 1.8, advance: function() { return tutorial.matchCoords(combat.plant.cursor, 1, 6); } },
        { height: 1.8, advance: AnyPress },
        { height: 1.8, advance: AnyPress },
        { height: 1.8, advance: function() { return (combat.menu.cursorY === 0) } },
        { height: 1.8, advance: AnyPress },
        { height: 1.8, advance: AnyPress },
        { height: 1.8, advance: AnyPress },
        { height: 1.8, advance: function() { return (combat.menu.cursorY === 2) } },
        { height: 1.8, advance: function() {
                var gridpos = { x: combat.compost.cursor.x - combat.dx, y: combat.compost.cursor.y - combat.dy };
                var tile = combat.grid[gridpos.x][gridpos.y];
                return tile.name === "beet" && tile.rotten;
            } },
        { height: 1.8, advance: function() { return combat.compost.cursor.y == combat.compost.dy } },
        { height: 3.5, advance: AnyPress },
        { height: 2.5, advance: AnyPress },
        { height: 1.8, advance: AnyPress }
    ]
};
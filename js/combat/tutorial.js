function AnyPress() { return true; };
var tutorial = {
    isTutorial: true,
    state: 0, currentInputHandler: combat.menu,
    startBattle: function() {
        combat.startBattle(["Discussly"]);
        game.currentInputHandler = this;
        this.currentInputHandler = combat.menu;
        this.state = 0;
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
            game.currentInputHandler = tutorial.currentInputHandler;
            return;
        }
        var details = this.stateDetails[this.state];
        gfx.drawInfobox(16, details.height, -0.5, "tutorial");
        gfx.drawWrappedText(GetText("tut" + this.state), 2, 8, 235, "#000000", "tutorial");
    },
    mouseMove: function(pos) { return this.currentInputHandler.mouseMove(pos); },
    click: function(pos) { // TODO: refactor this?
        var success = this.tryAdvance[this.state]();
        if(!success) { return false; }
        this.state++;
        return this.currentInputHandler.click(pos);
    },
    keyPress: function(key) {
        if(this.state === 39) { return this.currentInputHandler.keyPress(key); }
        if(key === player.controls.cancel) { return false; }
        var isEnter = (key === player.controls.pause || key === player.controls.confirm);
        if(isEnter) {
            var success = this.stateDetails[this.state].advance();
            if(!success) { return false; }
            success = this.currentInputHandler.keyPress(key);
            if(!success) { return false; }
            this.state++;
            this.drawTutorial();
            if(this.state < 38) {
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
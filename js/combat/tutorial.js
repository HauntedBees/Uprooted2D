function AnyPress() { return true; };
var tutorial = {
    isTutorial: true,
    state: 0, currentInputHandler: combat.menu,
    startBattle: function() {
        combat.startBattle(["Beckett"]);
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
        gfx.drawWrappedText(details.text, 2, 8, 235, "#000000", "tutorial");
    },
    mouseMove: function(pos) { return this.currentInputHandler.mouseMove(pos); },
    click: function(pos) { // TODO: refactor this
        var success = this.tryAdvance[this.state]();
        if(!success) { return false; }
        this.state++;
        return this.currentInputHandler.click(pos);
    },
    keyPress: function(key) {
        if(this.state === 39) { return this.currentInputHandler.keyPress(key); }
        if(key === "q") { return false; }
        var isEnter = (key === "Enter" || key === " ");
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
        { height: 1.8, text: "Oh shit, it's a throwdown! To start things off, select 'Plant' from the menu below!",
            advance: function() { return (combat.menu.cursorY === 0) } },
        { height: 1.8, text: "Sick. Sick. You did it. Now select the Beet Seeds! Trust me, it's gonna be good.",
            advance: function() { return tutorial.matchCoords(combat.plant.cursor, 2, 6); } },
        { height: 1.8, text: "Next step is planting those Seeds on your Field. Plant them wherever you want!" ,
            advance: AnyPress },
        { height: 3.5, text: "Good job! You Planted a Beet! When something is Planted on your Field, you generally have to wait several turns for it to grow. Now it's the enemy's turn, so just advance when ready.",
            advance: AnyPress },
        { height: 1.8, text: "Your Beet is Ripe! You can now Attack with it. Select 'Attack' from the menu!",
            advance: function() { return (combat.menu.cursorY === 1); } },
        { height: 2.5, text: "When you select 'Attack', any Ripe Crops on your Field will be harvested and launched at your opponent!",
            advance: AnyPress },
        { height: 2.5, text: "Enemy's turn again. It wouldn't be fair if you were the only one who could do anything... :(",
            advance: AnyPress },
        { height: 1.8, text: "Alright! Now time to Plant some more Seeds! Select 'Plant' again.",
            advance: function() { return (combat.menu.cursorY === 0) } },
        { height: 1.8, text: "This time we're gonna plant a tree! Select the Grape+ Seeds.",
            advance: function() { return tutorial.matchCoords(combat.plant.cursor, 0, 6); } },
        { height: 1.8, text: "Trees are big, so they take up more space on your Field! Plant the tree!",
            advance: AnyPress },
        { height: 1.8, text: "Looks like that tree will take four turns to grow. We can wait it out!",
            advance: AnyPress },
        { height: 1.8, text: "While we're waiting, let's try Attacking again. Select 'Attack' from the menu.",
            advance: function() { return (combat.menu.cursorY === 1); } },
        { height: 2.5, text: "You can still Attack with no Ripe Crops available, but it isn't going to be as effective.",
            advance: AnyPress },
        { height: 1.8, text: "Now we're going to try something a little more interesting...",
            advance: AnyPress },
        { height: 1.8, text: "Select 'Plant' from the menu.",
            advance: function() { return (combat.menu.cursorY === 0) } },
        { height: 2.5, text: "Now select the Carrot Seeds. Notice the Time carrots take to grow... and how many turns your Grape Tree has left.",
            advance: function() { return tutorial.matchCoords(combat.plant.cursor, 0, 6); } },
        { height: 1.8, text: "Plant those Carrots!",
            advance: AnyPress },
        { height: 1.8, text: "This dumb son-of-a-fuck doesn't know how just how screwed they are.",
            advance: AnyPress },
        { height: 1.8, text: "One more time now, select 'Plant'!",
            advance: function() { return (combat.menu.cursorY === 0) } },
        { height: 1.8, text: "Now select those Beet Seeds!",
            advance: function() { return tutorial.matchCoords(combat.plant.cursor, 1, 6); } },
        { height: 1.8, text: "Plant those Beet Seeds!",
            advance: AnyPress },
        { height: 1.8, text: "Do you see where this is going?",
            advance: AnyPress },
        { height: 1.8, text: "Everything's ready! THROW SOME FOOD AT THAT FUCKER!!",
            advance: function() { return (combat.menu.cursorY === 1); } },
        { height: 1.8, text: "Fucking ZING! Ha ha ha, that shit is hilarious. Fuck that guy.",
            advance: AnyPress },
        { height: 1.8, text: "Damn. That didn't kill him.",
            advance: AnyPress },
        { height: 1.8, text: "Uhhh. Oh yeah, you can take damage too. Maybe select 'Plant'.",
            advance: function() { return (combat.menu.cursorY === 0) } },
        { height: 1.8, text: "Truust me on this one, but it's time to plant some Beet Seeds.",
            advance: function() { return tutorial.matchCoords(combat.plant.cursor, 1, 6); } },
        { height: 1.8, text: "Just drop 'em anywhere.",
            advance: AnyPress },
        { height: 1.8, text: "Alright so you're gonna have to trust me on this one, okay?",
            advance: AnyPress },
        { height: 1.8, text: "Okay... do NOT attack with this Ripe Beet. Select 'Plant' again.",
            advance: function() { return (combat.menu.cursorY === 0) } },
        { height: 1.8, text: "Just pick something.",
            advance: AnyPress },
        { height: 1.8, text: "Plant it.",
            advance: AnyPress },
        { height: 1.8, text: "Alright, now it's time.",
            advance: AnyPress },
        { height: 1.8, text: "Select 'Compost' from the menu.",
            advance: function() { return (combat.menu.cursorY === 2) } },
        { height: 1.8, text: "Now select your Rotten Beet.",
            advance: function() {
                var gridpos = { x: combat.compost.cursor.x - combat.dx, y: combat.compost.cursor.y - combat.dy };
                var tile = combat.grid[gridpos.x][gridpos.y];
                return tile.name === "beet" && tile.rotten;
            } },
        { height: 1.8, text: "Cool cool, coolcoolcool. Now select HEAL.",
            advance: function() { return combat.compost.cursor.y == combat.compost.dy } },
        { height: 3.5, text: "Bam. You can Compost Rotten Crops to recover health. Crops Rot when they age after becoming Ripe. Trees don't Rot, but their Ripe Fruit will fall off and they'll have to regrow.",
            advance: AnyPress },
        { height: 2.5, text: "With the right Compost Bin you can even Compost Crops that aren't Rotten... or Attack enemies with your compost!",
            advance: AnyPress },
        { height: 1.8, text: "Now let's FINISH THIS FUTHER MUCKER OFF. You're on your own now, kid!",
            advance: AnyPress }
    ]
};
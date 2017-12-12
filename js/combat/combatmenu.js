combat.menu = {
    options: [], cursorY: 0, dy: 5.5,
    layersToClean: ["menuA", "menucursorA", "menucursorB", "menutext"],
    setup: function(sel) {
        gfx.clearSome(this.layersToClean);
        if(player.equipment.weapon !== null && GetEquipment(player.equipment.weapon).tech) {
            var hasCharger = false;
            for(var x = 0; x < player.gridWidth; x++) {
                if(hasCharger) { break; }
                for(var y = 0; y < player.gridHeight; y++) {
                    var item = combat.grid[x][y]
                    if(item !== null && item.type === "sickle2") {
                        hasCharger = true;
                        break;
                    }
                }
            }
            player.equipment.weapon = hasCharger ? "!sickle2" : "!sickle2_weak";
        }
        this.options = [];
        this.cursorY = sel || 0;
        this.drawOption("Plant", 0, this.cursorY === 0);
        this.drawOption("Attack", 1, this.cursorY === 1);
        this.drawOption("Compost", 2, this.cursorY === 2);
        this.drawOption("Run", 3, this.cursorY === 3);
        gfx.drawCursor(0, this.dy + this.cursorY, this.options[this.cursorY], 0);
        var text = "abba is a band";
        var charX = 0, charY = 0;
        switch(this.cursorY) {
            case 0:
                if(combat.numPlantTurns == 0) {
                    text = "You can't plant any more seeds this turn.";
                    charX = 3;
                } else if(combat.numPlantTurns == 1) {
                    text = "Plant a Seed in your Field.";
                    charX = 1;
                } else {
                    text = "Plant up to " + combat.numPlantTurns + " Seeds in your Field.";
                    charX = 1;
                }
                break;
            case 1:
                var count = this.highlightReadyCropsAndReturnCount();
                if(count === 0) {
                    if(player.canMelee(this.getEnemyCropCount())) {
                        text = "Perform a Melee attack.";
                        charX = 2;
                    } else {
                        text = "You need an appropriate weapon to attack.";
                        charX = 3;
                    }
                } else {
                    text = "Attack with Ripe Crops on your Field.";
                    charX = 1; charY = 1;
                }
                break;
            case 2: 
                if(player.equipment.compost === null) {
                    text = "You need a Compost Bin equipped to perform this action.";
                    charX = 3;
                } else {
                    text = "Compost any Crops in your Field to recover Health.";
                    charX = 4;
                }
                break;
            case 3:
                if(combat.isBossBattle) {
                    text = "You can't run away from boss battles!";
                    charX = 3;
                } else {
                    text = "Fuck off and cry to your mum, shitbird.";
                    charX = 5;
                }
                break;
        }
        combat.animHelper.SetPlayerAnimInfo([[charX, charY]]);
        gfx.drawInfobox(11, 2.5, this.dy + 1.5);
        gfx.drawWrappedText(text, 4.5 * 16, 11 + ((1.5 + this.dy) * 16), 170);
        combat.animHelper.DrawBottom();
    },
    getEnemyCropCount: function() {
        var count = 0;
        for(var x = 0; x < combat.enemywidth; x++) {
            for(var y = 0; y < combat.enemyheight; y++) {
                var tile = combat.enemyGrid[x][y];
                if(tile === null || tile.x !== undefined) { continue; }
                count++;
            }
        }
        return count;
    },
    highlightReadyCropsAndReturnCount: function() {
        var count = 0;
        for(var x = 0; x < player.gridWidth; x++) {
            for(var y = 0; y < player.gridHeight; y++) {
                var tile = combat.grid[x][y];
                if(tile === null || tile.x !== undefined) { continue; }
                if(tile.name === "app") { if(tile.activeTime > 2) { continue; } }
                else if(tile.rotten || tile.activeTime > 0) { continue; }
                count++;
                var size = tile.size - 1;
                gfx.drawCursor(x + combat.dx, y + combat.dy, size, size, "xcursor");
            }
        }
        return count;
    },
    clean: function() { gfx.clearSome(this.layersToClean); },
    drawOption: function(text, y, selected) {
        var xi = 1, tile = 7;
        if(selected) { tile = 9; }
        gfx.drawSprite("sheet", tile, 11, 0, 2 + (this.dy + y) * 16, "menuA");
        var width = gfx.getTextWidth(text);
        while(width > 128) {
            width -= 64;
            gfx.drawSprite("sheet", tile, 11, 16 * xi++, 2 + (this.dy + y) * 16, "menuA");
        }
        gfx.drawSprite("sheet", tile + 1, 11, 16 * xi, 2 + (this.dy + y) * 16, "menuA");
        gfx.drawText(text, 2, 10.5 + (this.dy + y) * 16);
        this.options.push(xi);
    },
    mouseMove: function(pos) {
        if(pos.y >= (this.dy + this.options.length) || pos.y < this.dy) { return false; }
        if(pos.x > 4) { return false; }
        this.setup(pos.y - this.dy);
        return true;
    },
    click: function(pos) {
        if(pos.x > 4) { return false; }
        switch(pos.y - this.dy) {
            case 0: if(combat.numPlantTurns > 0) { game.innerTransition(this, combat.plant); } break;
            case 1:
                var count = this.highlightReadyCropsAndReturnCount();
                var theircount = this.getEnemyCropCount();
                if(count === 0 && !player.canMelee(theircount)) { return; }
                var attackCount = 1;
                if(player.equipment.weapon !== null) { attackCount = GetEquipment(player.equipment.weapon).attacks || 1; }
                game.innerTransition(this, combat.selectTarget, {numAttacks: attackCount, isMelee: count === 0, theirCrops: theircount});
                break;
            case 2: if(player.equipment.compost !== null) { game.innerTransition(this, combat.compost); } break;
            case 3: if(!combat.isBossBattle) { this.tryFlee(); } break;
            default: return false;
        }
        return true;
    },
    tryFlee: function() {
        if(Math.random() > (0.45 * player.luck)) {
            combat.animHelper.SetPlayerAnimInfo([[5, 1], [5, 2], [5, 3], [5, 2]]);
            combat.animHelper.SetUpPlayerForRun();
            worldmap.clearTarget();
            game.innerTransition(this, combat.inbetween, {
                next: function() {
                    clearInterval(combat.charAnimIdx);
                    game.transition(combat.inbetween, worldmap, {
                        init: worldmap.pos,
                        map: worldmap.mapName,
                        noEntityUpdate: true
                    });
                },
                text: "You ran away like a baby that runs which is actually pretty impressive for a baby so good job (y)"
            });
        } else {
            combat.animHelper.SetPlayerAnimInfo([[5, 1], [5, 2], [0, 3], [3, 2, true, true]]);
            combat.animHelper.SetUpPlayerForRun();
            game.innerTransition(this, combat.inbetween, {
                next: function() { combat.endTurn(combat.inbetween) },
                text: "You tried to run away, but failed miserably, you stupid idiot. #lmao"
            });
        }
    },
    keyPress: function(key) {
        var pos = { x: 0, y: this.cursorY + this.dy };
        var isEnter = false;
        switch(key) {
            case player.controls.up: pos.y--; break;
            case player.controls.down: pos.y++; break;
            case player.controls.confirm:
            case player.controls.pause: isEnter = true; break;
        }
        if(pos.y < 0) { return false; }
        if(isEnter) {
            return this.click(pos);
        } else {
            return this.mouseMove(pos);
        }
    }
};
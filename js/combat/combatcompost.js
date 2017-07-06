combat.compost = {
    selectedCrops: [], 
    cursor: {x: 1, y: 5}, dy: 7.5,
    healButtonWidth: 0, healButtonSelected: false, 
    attackButtonWidth: 0, attackButtonSelected: false, 
    layersToClean: ["menuA", "menucursorA", "menucursorB", "menutext"],
    setup: function() {
        this.selectedCrops = [];
        this.cursor = {x: combat.dx, y: combat.dy};
        this.healButtonSelected = false;
        this.attackButtonSelected = false;
        this.mouseMove(this.cursor);
        this.drawAll();
    },
    drawAll: function() {
        gfx.clearSome(this.layersToClean);
        gfx.drawInfobox(6.5, 2, this.dy);
        for(var i = 0; i < this.selectedCrops.length; i++) {
            var pos = this.selectedCrops[i];
            if(pos.cow !== undefined) {
                gfx.drawCursor(pos.x, pos.y, 1, 1, "xcursor");
            } else {
                var size = combat.grid[pos.x][pos.y].size - 1;
                gfx.drawCursor(pos.x + combat.dx, pos.y + combat.dy, size, size, "xcursor");
            }
        }
        var xi = 1, tile = 7, text = "Heal";
        if(this.healButtonSelected) { tile = 9; }
        gfx.drawSprite("sheet", tile, 11, 0, 2 + this.dy * 16, "menuA");
        var width = gfx.getTextWidth(text);
        while(width > 128) {
            width -= 64;
            gfx.drawSprite("sheet", tile, 11, 16 * xi++, 2 + this.dy * 16, "menuA");
        }
        gfx.drawSprite("sheet", tile + 1, 11, 16 * xi, 2 + this.dy * 16, "menuA");
        this.healButtonWidth = xi;
        gfx.drawText(text, 2, 10.5 + this.dy * 16, 2);

        if(player.canAttackWithCompost()) {
            xi = 1; tile = 7; text = "Attack";
            if(this.attackButtonSelected) { tile = 9; }
            gfx.drawSprite("sheet", tile, 11, 0, 2 + (this.dy + 1) * 16, "menuA");
            width = gfx.getTextWidth(text);
            while(width > 128) {
                width -= 64;
                gfx.drawSprite("sheet", tile, 11, 16 * xi++, 2 + (this.dy + 1) * 16, "menuA");
            }
            gfx.drawSprite("sheet", tile + 1, 11, 16 * xi, 2 + (this.dy + 1) * 16, "menuA");
            this.attackButtonWidth = xi;
            gfx.drawText(text, 2, 10.5 + (this.dy + 1) * 16);
        }
        if(this.healButtonSelected) {
            gfx.drawCursor(0, this.dy, this.healButtonWidth, 0);
            gfx.drawPlayer(6, 0, 4, 5.75, "menucursorA");
        } else if(this.attackButtonSelected) {
            gfx.drawCursor(0, this.dy + 1, this.attackButtonWidth, 0);
            gfx.drawPlayer(2, 0, 4, 5.75, "menucursorA");
        } else {
            var px = this.cursor.x - combat.dx; var py = this.cursor.y - combat.dy;
            var tile = combat.grid[px][py];
            if(tile !== null) {
                if(tile.x !== undefined) { // part of a tree
                    if(this.isCompostable(combat.grid[tile.x][tile.y])) {
                        gfx.drawCursor(tile.x + combat.dx, tile.y + combat.dy, 1, 1);
                    } else {
                        gfx.drawCursor(tile.x + combat.dx, tile.y + combat.dy, 1, 1, "bcursor");
                    }
                    gfx.drawPlayer(7, 0, tile.x + combat.dx + 0.5, tile.y + combat.dy + 0.25, "menucursorB");
                } else {
                    if(this.isCompostable(tile)) {
                        gfx.drawCursor(this.cursor.x, this.cursor.y, tile.size - 1, tile.size - 1);
                    } else {
                        gfx.drawCursor(this.cursor.x, this.cursor.y, tile.size - 1, tile.size - 1, "bcursor");
                    }
                    if(tile.size === 2) {
                        gfx.drawPlayer(7, 0, this.cursor.x + 0.5, this.cursor.y + 0.25, "menucursorB");
                    } else {
                        gfx.drawPlayer(7, 0, this.cursor.x, this.cursor.y - 0.25, "menucursorB");
                    }
                }
            } else {
                var possibleCow = player.itemGrid[px][py];
                var cowIdx = -1; var cowPos = {x: this.cursor.x, y: this.cursor.y };
                if(possibleCow !== null && possibleCow.x !== undefined && player.itemGrid[possibleCow.x][possibleCow.y] === "_cow") {
                    cowIdx = combat.getCowIndex(possibleCow.x, possibleCow.y);
                    cowPos = { x: possibleCow.x + combat.dx, y: possibleCow.y + combat.dy };
                } else if(possibleCow === "_cow") {
                    cowIdx = combat.getCowIndex(px, py);
                }
                if(cowIdx < 0) {
                    gfx.drawCursor(this.cursor.x, this.cursor.y, 0, 0, "bcursor");
                    gfx.drawPlayer(7, 0, this.cursor.x, this.cursor.y - 0.25, "menucursorB");
                } else {
                    gfx.drawCursor(cowPos.x, cowPos.y, 1, 1);
                    gfx.drawPlayer(7, 0, cowPos.x + 0.5, cowPos.y + 0.25, "menucursorB");
                }
            }
        }
        combat.drawBottom();
    },
    clean: function() { gfx.clearSome(this.layersToClean); },
    cancel: function() { game.transition(this, combat.menu); return true; },
    toggleCrop: function(gridpos) {
        for(var i = 0; i < this.selectedCrops.length; i++) {
            var old = this.selectedCrops[i];
            if(gridpos.x == old.x && gridpos.y == old.y) {
                this.selectedCrops.splice(i, 1);
                return;
            }
        }
        if(this.selectedCrops.length == player.getCompostMax()) { return; }
        this.selectedCrops.push(gridpos);
    },
    isCompostable: function(tile) {
        if(tile.type === "egg" || tile.type === "tech") { return false; }
        return (player.equipment.compost !== null && (player.equipment.compost !== "!weakCompost" || tile.rotten));
    },
    mouseMove: function(pos) {
        this.attackButtonSelected = false;
        this.healButtonSelected = false;
        if(pos.y == this.dy && pos.x < 3) { // heal button
            this.cursor = pos;
            this.healButtonSelected = true;
        } else if(pos.y == (this.dy + 1) && pos.x < 3 && player.canAttackWithCompost()) { // attack button
            this.cursor = pos;
            this.attackButtonSelected = true;
        } else { // compost selection
            if(pos.x < combat.dx || pos.x >= (combat.dx + player.gridWidth)) { return false; }
            if(pos.y < combat.dy || pos.y >= (combat.dy + player.gridHeight)) { return false; }
            this.cursor = pos;
        }
        this.drawAll();
        return true;
    },
    click: function(pos) {
        if(pos.y == this.dy && pos.x < 3) { // heal
            if(this.selectedCrops.length == 0) { return false; }
            var healAmount = 0;
            var thereAreCows = false;
            for(var i = 0; i < this.selectedCrops.length; i++) {
                var pos = this.selectedCrops[i];
                if(pos.cow !== undefined) {
                    healAmount += 1.5 * combat.happyCows[pos.cow].feed;
                    combat.happyCows[pos.cow].removeMe = true;
                    thereAreCows = true;
                } else {
                    var crop = combat.removeCrop(pos);
                    healAmount += (1.1 - (crop.activeTime / crop.time)) * crop.power;
                }
            }
            if(thereAreCows) {
                for(var i = combat.happyCows.length - 1; i >= 0; i--) {
                    if(combat.happyCows[i].removeMe) { combat.happyCows.splice(i, 1); }
                }
                combat.drawMainElements();
            }
            healAmount = Math.ceil(healAmount);
            player.health = Math.min(player.maxhealth, player.health + healAmount);
            game.transition(this, combat.inbetween, {
                next: function() { combat.endTurn(combat.inbetween) },
                text: "You compost your crops, recovering " + healAmount + " health."
            });
            combat.drawCrops();
            return true;
        } else if(pos.y == (this.dy + 1) && pos.x < 3 && player.canAttackWithCompost()) { // attack
            if(this.selectedCrops.length == 0) { return false; }
            var damage = 0;
            for(var i = 0; i < this.selectedCrops.length; i++) {
                var pos = this.selectedCrops[i];
                if(pos.cow !== undefined) {
                    damage += 0.01 * combat.happyCows[pos.cow].feed;
                    combat.happyCows[pos.cow].removeMe = true;
                    thereAreCows = true;
                } else {
                    var crop = combat.removeCrop(pos);
                    damage += (0.1 + (crop.activeTime / crop.time)) * crop.power;
                }
            }
            if(thereAreCows) {
                for(var i = combat.happyCows.length - 1; i >= 0; i--) {
                    if(combat.happyCows[i].removeMe) { combat.happyCows.splice(i, 1); }
                }
                combat.drawMainElements();
            }
            damage = Math.ceil(damage / 3.5);
            for(var i = combat.enemies.length - 1; i >= 0; i--) {
                combat.damageEnemy(i, damage);
            }
            game.transition(this, combat.inbetween, {
                next: function() { combat.endTurn(combat.inbetween) },
                text: "You compost your crops and hurl them forward, dealing " + damage + " damage" + (combat.enemies.length > 1 ? " to everyone." : ".")
            });
            combat.drawCrops();
            return true;
        }
        if(pos.x < combat.dx || pos.x >= (combat.dx + player.gridWidth)) { return false; }
        if(pos.y < combat.dy || pos.y >= (combat.dy + player.gridHeight)) { return false; }
        var gridpos = { x: pos.x - combat.dx, y: pos.y - combat.dy };
        var tile = combat.grid[gridpos.x][gridpos.y];
        var cowIdx = -1; var cowPos = {x: pos.x, y: pos.y };
        if(tile === null) { // check for cows
            var possibleCow = player.itemGrid[gridpos.x][gridpos.y];
            if(possibleCow === null) { return false; }
            if(possibleCow.x !== undefined && player.itemGrid[possibleCow.x][possibleCow.y] === "_cow") {
                cowIdx = combat.getCowIndex(possibleCow.x, possibleCow.y);
                cowPos = { x: possibleCow.x + 1, y: possibleCow.y + 5 };
            } else if(possibleCow === "_cow") {
                cowIdx = combat.getCowIndex(gridpos.x, gridpos.y);
            }
            if(cowIdx < 0) { return false; }
        } else {
            if(tile.x !== undefined) { // tree
                gridpos = { x: tile.x, y: tile.y };
                tile = combat.grid[tile.x][tile.y];
            }
            if(!this.isCompostable(tile)) { return false; }
        }
        if(cowIdx < 0) {
            this.toggleCrop(gridpos);
        } else {
            this.toggleCrop({ x: cowPos.x, y: cowPos.y, cow: cowIdx });
        }
        this.drawAll();
        return true;
    },
    keyPress: function(key) {
        var pos = { x: this.cursor.x, y: this.cursor.y };
        var isEnter = false;
        switch(key) {
            case "w": pos.y--; break;
            case "a": pos.x--; break;
            case "s": pos.y++; break;
            case "d": pos.x++; break;
            case " ":
            case "Enter": isEnter = true; break;
            case "q": return this.cancel();
        }
        if(pos.y === (combat.dy + player.gridHeight) && pos.y > this.cursor.y) { // going from grid to Heal button
            pos.y = this.dy;
            pos.x = 0;
        } else if(pos.y === (this.dy - 1) && this.cursor.y === this.dy) { // going from Heal button to grid
            pos.y = combat.dy + player.gridHeight - 1;
            pos.x = combat.dx;
        }
        if(pos.y < 0 || pos.x < 0) { return false; }
        if(isEnter) {
            return this.click(pos);
        } else {
            return this.mouseMove(pos);
        }
    }
};
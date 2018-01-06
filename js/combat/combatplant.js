combat.plant = {
    activeCrop: null, actualIndexes: [],
    cursor: {x: 0, y: 0}, isValid: true, 
    inventoryWidth: 9, dy: 6, addHalf: true, 
    layersToClean: ["menuA", "menuB", "menucursorA", "menucursorB", "menutext"],
    setup: function() {
        this.cursor = { x: combat.lastSelectedSeed.x, y: combat.lastSelectedSeed.y + this.dy };
        this.actualIndexes = [];
        this.isValid = true;
        for(var i = 0; i < player.inventory.length; i++) {
            if(player.inventory[i][0][0] === "_" || player.inventory[i][0][0] === "!") { continue; }
            this.actualIndexes.push(i);
        }
        this.drawAll();
    },
    clean: function() { gfx.clearSome(this.layersToClean); },
    cancel: function() {
        if(this.activeCrop === null) {
            if(combat.numPlantTurns != player.getPlantingTurns()) {
                if(player.canAttackAfterPlanting()) {
                    game.innerTransition(this, combat.menu);
                } else {
                    combat.endTurn(this);
                }
            } else {
                game.innerTransition(this, combat.menu);
            }
        } else {
            this.activeCrop = null;
            this.cursor = { x: combat.lastSelectedSeed.x, y: combat.lastSelectedSeed.y + this.dy };
            this.drawAll();
        }
        return true;
    },
    isValidPlantingLocation: function(px, py, diff) {
        if(diff == 1) {
            if(combat.grid[px][py] !== null) { return false; }
            if(combat.grid[px + 1][py] !== null) { return false; }
            if(combat.grid[px][py + 1] !== null) { return false; }
            if(combat.grid[px + 1][py + 1] !== null) { return false; }
            return this.isValidLocationForCrop(px, py) && this.isValidLocationForCrop(px + 1, py)
                    && this.isValidLocationForCrop(px, py + 1) && this.isValidLocationForCrop(px + 1, py + 1);
        } else {
            if(combat.grid[px][py] !== null) { return false; }
            return this.isValidLocationForCrop(px, py);
        }
    },
    isValidLocationForCrop: function(x, y) {
        var type = player.itemGrid[x][y];
        if(type === null) { return this.activeCrop.type === "veg" || this.activeCrop.type === "tree"; }
        var parent = (type.x !== undefined ? player.itemGrid[type.x][type.y] : type);
        if(type === "_shooter") { 
            if(["veg", "mush", "rice"].indexOf(this.activeCrop.type) < 0) { return false; }
            if(combat.effectGrid[x][y] !== null && combat.effectGrid[x][y].type === "shocked") { return false; }
            return combat.getUsedShooterIndex(x, y) < 0;
        }
        if(type === "_modulator") {
            if(combat.effectGrid[x][y] !== null && combat.effectGrid[x][y].type === "shocked") { return false; }
            return this.activeCrop.type === "veg";
        }
        if(type === "_strongsoil") { return this.activeCrop.type === "veg" || this.activeCrop.type === "tree"; }
        var isBurned = (combat.effectGrid[x][y] !== null && combat.effectGrid[x][y].type === "burned");
        if(type === "_log") { return this.activeCrop.type === "mush" && !isBurned; }
        if(type === "_beehive") { return this.activeCrop.type === "bee" && !isBurned; }
        if(type === "_coop") { return this.activeCrop.type === "egg" && !isBurned; }
        if(type === "_paddy") { return this.activeCrop.type === "rice"; }
        if(type === "_lake") { return this.activeCrop.type === "water" || this.activeCrop.type === "rod" || this.activeCrop.type === "spear"; }
        if(type === "_hotspot" || parent === "_hotspot") {
            if(combat.effectGrid[x][y] !== null && combat.effectGrid[x][y].type === "shocked") { return false; }
            return this.activeCrop.type === "tech";
        }
        if(parent === "_charger") {
            var okspot = y === (player.itemGrid[x][y].y + 1) && x === player.itemGrid[x][y].x;
            return okspot && this.activeCrop.type == "sickle2";
        }
        if(type.corner === "_cow") { return this.activeCrop.type === "food" || this.activeCrop.type === "veg"; }
    },
    getSprinklerMultiplier: function(x, y, size) {
        var isNearASprinkler = (this.isSprinkler(x - 1, y - 1) || this.isSprinkler(x - 1, y) || this.isSprinkler(x - 1, y + 1)
                                || this.isSprinkler(x, y - 1) || this.isSprinkler(x, y + 1)
                                || this.isSprinkler(x + 1, y - 1) || this.isSprinkler(x + 1, y) || this.isSprinkler(x + 1, y + 1));
        if(isNearASprinkler) { return 0.8; }
        if(size === 1) {
            if(this.getSprinklerMultiplier(x + 1, y) === 0.8) { return 0.8; }
            if(this.getSprinklerMultiplier(x + 1, y + 1) === 0.8) { return 0.8; }
            if(this.getSprinklerMultiplier(x, y + 1) === 0.8) { return 0.8; }
        }
        return 1;
    },
    isSprinkler: function(x, y) {
        if(x < 0 || y < 0 || x >= player.gridWidth || y >= player.gridHeight) { return false; }
        return player.itemGrid[x][y] === "_sprinkler";
    },
    
    keyPress: function(key) {
        var pos = { x: this.cursor.x, y: this.cursor.y };
        var isEnter = false;
        switch(key) {
            case player.controls.up: pos.y--; break;
            case player.controls.left: pos.x--; break;
            case player.controls.down: pos.y++; break;
            case player.controls.right: pos.x++; break;
            case player.controls.confirm:
            case player.controls.pause: isEnter = true; break;
            case player.controls.cancel: return this.cancel();
        }
        if(pos.y < 0 || pos.x < 0) { return false; }
        if(isEnter) {
            return this.click(pos);
        } else {
            return this.mouseMove(pos);
        }
    },
    mouseMove: function(pos) {
        if(pos.x < 0 || pos.y < 0) { return false; }
        if(this.activeCrop === null) { 
            if(pos.x >= this.inventoryWidth) { return false; }
            var idx = (pos.y - this.dy) * this.inventoryWidth + pos.x;
            if(idx < 0 || idx >= this.actualIndexes.length) { return false; }
            this.isValid = true;
            this.cursor = { x: pos.x, y: pos.y };
        } else {
            var diff = this.activeCrop.size - 1;
            if(pos.x < combat.dx || pos.x >= (combat.dx + player.gridWidth - diff)) { return false; }
            if(pos.y < combat.dy || pos.y >= (combat.dy + player.gridHeight - diff)) { return false; }
            var px = pos.x - combat.dx, py = pos.y - combat.dy;
            this.cursor = { x: pos.x, y: pos.y };
            this.isValid = this.isValidPlantingLocation(px, py, diff);
        }
        this.drawAll();
        return true;
    },
    click: function(pos) {
        if(pos.x < 0 || pos.y < 0) { return false; }
        if(this.activeCrop === null) {
            pos.y = (pos.y - this.dy);
            if(pos.x >= this.inventoryWidth) { return false; }
            var idx = pos.y * this.inventoryWidth + pos.x;
            if(idx < 0 || idx >= this.actualIndexes.length) { return false; }
            var actualIdx = this.actualIndexes[idx];
            if(player.inventory[actualIdx][1] === 0) { return false; }
            this.activeCrop = GetCrop(player.inventory[actualIdx][0]);
            combat.lastSelectedSeed = { x: this.cursor.x, y: this.cursor.y - this.dy };
            this.cursor = { x: combat.dx, y: combat.dy };
            this.isValid = this.isValidPlantingLocation(0, 0, this.activeCrop.size - 1);
        } else {
            var diff = this.activeCrop.size - 1;
            if(pos.x < combat.dx || pos.x >= (combat.dx + player.gridWidth - diff)) { return false; }
            if(pos.y < combat.dy || pos.y >= (combat.dy + player.gridHeight - diff)) { return false; }
            var px = pos.x - combat.dx, py = pos.y - combat.dy;
            var ppos = {x: px, y: py};
            if(!this.isValidPlantingLocation(px, py, diff)) { return false; }
            var newCrop = GetCrop(this.activeCrop.name);
            var cropIsKill = false, killType = 0;
            if(player.equipment.gloves !== null && GetEquipment(player.equipment.gloves).tech && !combat.isFalcon) {
                if(["tree", "rice", "veg", "mush"].indexOf(newCrop.type) >= 0 && Math.random() <= 0.1) {
                    cropIsKill = true;
                    killType = 1;
                }
            }
            if(player.equipment.soil !== null && GetEquipment(player.equipment.soil).tech) {
                if(["tree", "rice", "veg", "mush"].indexOf(newCrop.type) >= 0 && (newCrop.power <= 5 || newCrop.time <= 5)) {
                    cropIsKill = true;
                    killType = 2;
                } else if(newCrop.type === "bee") {
                    cropIsKill = true;
                    killType = 3;
                }
            }
            if(diff == 1 && !cropIsKill) {
                combat.grid[px + 1][py] = ppos;
                combat.grid[px][py + 1] = ppos;
                combat.grid[px + 1][py + 1] = ppos;
            }
            if(player.itemGrid[px][py] === "_shooter") {
                if(combat.getUsedShooterIndex(px, py) >= 0) { return false; }
                combat.usedShooters.push({x: px, y: py});
                this.launchSeeds();
                return true;
            } else if(player.itemGrid[px][py] === "_modulator") {
                this.modulate();
                return true;
            } else if(this.activeCrop.type === "spear") {
                this.throwSpear(px, py);
                return true;
            }
            if(player.itemGrid[px][py] !== null && player.itemGrid[px][py].corner === "_cow") {
                cropIsKill = false;
                var cowIdx = combat.getCowIndex(px - 1, py - 1);
                if(cowIdx >= 0) {
                    combat.happyCows[cowIdx].feed += newCrop.power;
                } else {
                    combat.happyCows.push({ x: px - 1, y: py - 1, feed: newCrop.power });
                }
                combat.animHelper.DrawBackground();
            } else {
                newCrop.activeTime = Math.ceil(newCrop.time / player.getCropSpeedMultiplier() * this.getSprinklerMultiplier(px, py, this.activeCrop.size - 1));
                var effects = combat.effectGrid[px][py];
                var divider = (player.itemGrid[px][py] !== null && player.itemGrid[px][py] === "_strongsoil") ? 1.25 : 2;
                if(!cropIsKill) {
                    if(effects !== null) {
                        if(effects.type === "shocked") {
                            newCrop.power = 1;
                        } else if(effects.type === "splashed") {
                            if(newCrop.waterResist) { divider /= 1 + newCrop.waterResist; }
                            newCrop.power = Math.ceil(newCrop.power / divider);
                        } else if(effects.type === "burned") {
                            if(newCrop.fireResist) { divider /= 1 + newCrop.fireResist; }
                            newCrop.power = Math.ceil(newCrop.power / divider);
                        }
                    }
                    combat.grid[px][py] = newCrop;
                }
            }
            this.cursor = { x: 0, y: this.dy };
            player.decreaseItem(this.activeCrop.name);
            this.activeCrop = null;
            combat.animHelper.DrawCrops();
            if(cropIsKill) {
                var next;
                if(--combat.numPlantTurns == 0) {
                    if(player.canAttackAfterPlanting()) {
                        next = function() { game.innerTransition(combat.inbetween, combat.menu); };
                    } else {
                        next = function() { combat.endTurn(combat.inbetween); };
                    }
                } else {
                    next = function() { game.innerTransition(combat.inbetween, combat.plant); }
                }
                var killMsg = GetText("tryPlantStart").replace(/\{0\}/g, newCrop.displayname);
                switch(killType) {
                    case 1: killMsg += GetText("tryPlantGloves"); break;
                    case 2: killMsg += GetText("tryPlantPesticide"); break;
                    case 3: killMsg = GetText("tryPlantBees"); worldmap.angryBees = true; break;
                    default: killMsg += GetText("tryPlantBug"); break;
                }
                game.innerTransition(this, combat.inbetween, { next: next, text: killMsg });
                return true;
            } else {
                if(--combat.numPlantTurns == 0) {
                    if(player.canAttackAfterPlanting() && !combat.isFalcon) {
                        game.innerTransition(this, combat.menu);
                    } else {
                        combat.endTurn(this);
                    }
                    return true;
                } else {
                    this.setup();
                }
            }
        }
        this.drawAll();
        return true;
    },
    throwSpear: function(x, y) {
        var success = (Math.random() * player.luck) < this.activeCrop.req;
        player.decreaseItem(this.activeCrop.name);
        if(!success) { return this.finishTurn("You chuck the spear, but do not catch any fish."); }
        var crop = GetCrop(this.activeCrop.name);
        crop.ready = true;
        crop.activeTime = 0;
        var fishNum = 0;
        while(fishNum < 2 && Math.random() > (crop.catchLuck * player.luck)) { fishNum++; }
        crop.power = 10 + fishNum * 10;
        crop.type = "rod";
        crop.fishNum = fishNum;
        combat.grid[x][y] = crop;
        this.finishTurn("You chuck the spear and catch a fish!");
    },
    launchSeeds: function() {
        var newCrop = GetCrop(this.activeCrop.name);
        var damage = Math.ceil(newCrop.power / 2);
        player.decreaseItem(this.activeCrop.name);
        var initLength = combat.enemies.length;
        for(var i = combat.enemies.length - 1; i >= 0; i--) {
            combat.damageEnemy(i, damage);
        }
        this.finishTurn("You load up the seed shooter and it fires rapidly, dealing " + damage + " damage" + (initLength > 1 ? " to everyone." : "."));
    },
    modulate: function() {
        var newCrop = GetCrop(this.activeCrop.name);
        var seasons = [];
        for(var i = 0; i < 4; i++) {
            if(newCrop.seasons[i] === 1) { seasons.push(i); }
        }
        if(seasons.length === 0) { seasons = [0, 1, 2, 3]; }
        combat.season = seasons[Range(0, seasons.length)];
        var displaySeason = "";
        switch(combat.season) {
            case 0: displaySeason = "Spring"; break;
            case 1: displaySeason = "Summer"; break;
            case 2: displaySeason = "Autumn"; break;
            case 3: displaySeason = "Winter"; break;
        }
        combat.adjustEnemyStatsWeather();
        this.finishTurn("You load some seeds into the modulator, changing the season to " + displaySeason + ".");
    },
    finishTurn: function(t) {
        this.activeCrop = null;
        game.innerTransition(this, combat.inbetween, {
            next: function() {
                if(--combat.numPlantTurns == 0) {
                    if(player.canAttackAfterPlanting()) {
                        game.innerTransition(this, combat.menu);
                    } else {
                        combat.endTurn(this);
                    }
                } else {
                    game.innerTransition(combat.inbetween, combat.plant);
                }
            },
            text: t
        });
        combat.animHelper.DrawBackground();
        combat.animHelper.DrawCrops();
    },
    drawXs: function() {
        var idx = (this.cursor.y - this.dy) * this.inventoryWidth + this.cursor.x;
        var item = player.inventory[this.actualIndexes[idx]];
        if(item === undefined || item === null) { return; }
        var tempCrop = GetCrop(item[0]);
        for(var x = 0; x < player.gridWidth; x++) {
            for(var y = 0; y < player.gridHeight; y++) {
                if(combat.grid[x][y] !== null) { continue; }
                this.activeCrop = tempCrop;
                if(!this.isValidLocationForCrop(x, y)) {
                    gfx.drawTileToGrid("x", combat.dx + x, combat.dy + y, "menucursorB");
                }
                this.activeCrop = null;
            }
        }
    },
    drawAll: function() {
        gfx.clearSome(this.layersToClean);
        var size = 0;
        var cursorX = this.cursor.x, cursorY = this.cursor.y;
        if(this.activeCrop === null) {
            this.setText();
            if(combat.isFalcon) {
                combat.animHelper.SetBirdAnimInfo([[0, 1]]);
                combat.animHelper.SetPlayerAnimInfo([[5, 0]]);
            } else {
                combat.animHelper.SetBirdAnimInfo([[0, 0]]);
                combat.animHelper.SetPlayerAnimInfo([[6, 0]]);
            }
            this.drawXs();
        } else {
            size = this.activeCrop.size - 1;
            if(combat.isFalcon) {
                combat.animHelper.SetPlayerAnimInfo([[0, 0]]);
                if(size == 1) {
                    combat.animHelper.SetBirdAnimInfo([[1, 1]], cursorX + 2, cursorY - 1, true);
                } else {
                    combat.animHelper.SetBirdAnimInfo([[1, 1]], cursorX + 1, cursorY - 0.75, true);
                }
            } else {
                combat.animHelper.SetBirdAnimInfo([[0, 0]]);
                if(size == 1) {
                    combat.animHelper.SetPlayerAnimInfo([[7, 0]], cursorX + 0.5, cursorY + 0.25, true);
                } else {
                    combat.animHelper.SetPlayerAnimInfo([[7, 0]], cursorX, cursorY - 0.25, true);
                }
            }
        }
        gfx.drawInfobox(16, 3, this.dy + 0.5);
        gfx.drawInfobox(6, 3, this.dy + 0.5);
        if(this.activeCrop === null) {
            gfx.drawCursor(cursorX, cursorY + 0.5, size, size);
        } else if(this.isValid) {
            gfx.drawCursor(cursorX, cursorY, size, size);
        } else {
            gfx.drawCursor(cursorX, cursorY, size, size, "bcursor");
        }
        combat.animHelper.DrawBottom();
        for(var i = 0; i < this.actualIndexes.length; i++) {
            var actItem = player.inventory[this.actualIndexes[i]];
            gfx.drawInventoryItem(actItem, i % this.inventoryWidth, this.dy + 0.5 + Math.floor(i / this.inventoryWidth), "menuA");
        }
    },
    setText: function() {
        var idx = (this.cursor.y - this.dy) * this.inventoryWidth + this.cursor.x;
        var item = player.inventory[this.actualIndexes[idx]];
        if(item === null || item === undefined) { return; }
        var iteminfo = GetCrop(item[0]);
        var str = iteminfo.displayname + " (" + item[1] + ")\n";
        str += " Power: " + iteminfo.power + "\n";
        if(iteminfo.time > 0) {
            str += " Time: " + Math.ceil(iteminfo.time / player.getCropSpeedMultiplier()) + "\n";
        }
        if(iteminfo.respawn > 0) { str += " Regrowth: " + iteminfo.respawn + "\n"; }
        if(iteminfo.seasons[0] > 0.5) { str += " SP"; }
        if(iteminfo.seasons[1] > 0.5) { str += " SU"; }
        if(iteminfo.seasons[2] > 0.5) { str += " AU"; }
        if(iteminfo.seasons[3] > 0.5) { str += " WI"; }
        gfx.drawWrappedText(str, 9.5 * 16, 11 + (16 * (this.dy + 0.5)), 85);
    }
};
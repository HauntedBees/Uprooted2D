combat.plant = {
    activeCrop: null, actualIndexes: [],
    cursor: {x: 0, y: 0}, isValid: true, 
    inventoryWidth: 9, dy: 8.5,
    layersToClean: ["menuA", "menuB", "menucursorA", "menucursorB", "menutext"],
    setup: function() {
        this.cursor = { x: combat.lastSelectedSeed.x, y: combat.lastSelectedSeed.y + this.dy };
        this.actualIndexes = [];
        this.activeCrop = null;
        this.isValid = true;
        for(let i = 0; i < player.inventory.length; i++) {
            if(player.inventory[i][0][0] === "_" || player.inventory[i][0][0] === "!") { continue; }
            this.actualIndexes.push(i);
        }
        this.DrawAll();
    },
    clean: function() { gfx.clearSome(this.layersToClean) },
    cancel: function(fromKeyboard) {
        if(game.currentInputHandler.isTutorial) { return false; }
        if(this.activeCrop === null) {
            if(combat.numPlantTurns != player.getPlantingTurns()) {
                if(player.canAttackAfterPlanting()) {
                    game.innerTransition(this, combat.menu, { sel: 0, notFirst: true, canOnlyPlant: combat.menu.plantedAlreadyAndCantAttack });
                } else {
                    game.innerTransition(this, combat.menu, { sel: 0, notFirst: true, canOnlyPlant: true });
                }
            } else {
                game.innerTransition(this, combat.menu, { sel: 0, notFirst: true, canOnlyPlant: combat.menu.plantedAlreadyAndCantAttack });
            }
        } else {
            this.activeCrop = null;
            if(fromKeyboard) { this.cursor = { x: combat.lastSelectedSeed.x, y: combat.lastSelectedSeed.y + this.dy }; }
            this.DrawAll();
        }
        return true;
    },
    isValidPlantingLocation: function(px, py, diff) {
        if(player.gridWidth <= px || player.gridHeight <= py) { return false; }
        if(this.activeCrop.type === "moist") {
            if(diff === 1) {
                return this.isValidLocationForCrop(px, py) || this.isValidLocationForCrop(px + 1, py)
                        || this.isValidLocationForCrop(px, py + 1) || this.isValidLocationForCrop(px + 1, py + 1);
            } else {
                return this.isValidLocationForCrop(px, py);
            }
        }
        if(diff === 1) {
            if(player.itemGrid[px][py] === "_cow") { return this.isValidLocationForCrop(px + 1, py + 1); }
            if(player.gridWidth <= (px + 1) || player.gridHeight <= (py + 1)) { return false; }
            if(combat.grid[px][py] !== null) { return false; }
            if(combat.grid[px + 1][py] !== null) { return false; }
            if(combat.grid[px][py + 1] !== null) { return false; }
            if(combat.grid[px + 1][py + 1] !== null) { return false; }
            return this.isValidLocationForCrop(px, py) && this.isValidLocationForCrop(px + 1, py)
                    && this.isValidLocationForCrop(px, py + 1) && this.isValidLocationForCrop(px + 1, py + 1);
        } else {
            if(combat.grid[px][py] !== null) { return (combat.grid[px][py].name === "salt" && this.activeCrop.saltClean); }
            return this.isValidLocationForCrop(px, py);
        }
    },
    isValidLocationForCrop: function(x, y) {
        if(this.activeCrop.type === "moist") {
            let crop = combat.grid[x][y];
            if(crop === null) { return false; }
            if(crop.x !== undefined) { crop = combat.grid[crop.x][crop.y]; }
            return ["veg", "tree", "rice"].indexOf(crop.type) >= 0;
        }
        const type = player.itemGrid[x][y];
        if(type === null) { return this.activeCrop.type === "veg" || this.activeCrop.type === "tree"; }
        const parent = (type.x !== undefined ? player.itemGrid[type.x][type.y] : type);
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
        const isBurned = (combat.effectGrid[x][y] !== null && combat.effectGrid[x][y].type === "burned");
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
            const okspot = y === (player.itemGrid[x][y].y + 1) && x === player.itemGrid[x][y].x;
            return okspot && this.activeCrop.type == "sickle2";
        }
        if(type.corner === "_cow") { return ["food", "veg", "rice", "mush", "tree"].indexOf(this.activeCrop.type) >= 0; }
    },
    GetGrowthTime: function(crop, x, y, regrow) {
        const baseTime = regrow ? crop.respawn : crop.time;
        if(["spear", "rod", "water", "bee", "egg", "sickle2"].indexOf(crop.type) >= 0) {
            return baseTime;
        } else if(crop.type === "tech") {
            return Math.ceil(baseTime / player.getCropSpeedMultiplier());
        } else {
            const sprinkMult = this.getSprinklerMultiplier(x, y, crop.size - 1);
            if(sprinkMult < 1) { player.miscdata.techFixturesUsed++; }
            return Math.ceil(baseTime / player.getCropSpeedMultiplier() * sprinkMult);
        }
    },
    getSprinklerMultiplier: function(x, y, size) {
        let mult = 1;
        if(this.isSprinkler(x - 1, y - 1)) { mult -= 0.1; }
        if(this.isSprinkler(x - 1, y)) { mult -= 0.2; }
        if(this.isSprinkler(x - 1, y + 1)) { mult -= 0.1; }
        if(this.isSprinkler(x, y - 1)) { mult -= 0.2; }
        if(this.isSprinkler(x, y + 1)) { mult -= 0.2; }
        if(this.isSprinkler(x + 1, y - 1)) { mult -= 0.1; }
        if(this.isSprinkler(x + 1, y)) { mult -= 0.2; }
        if(this.isSprinkler(x + 1, y + 1)) { mult -= 0.1; }
        mult = Math.max(mult, 0.33);
        if(mult < 1) { return mult; }
        if(size === 1) {
            let cornerMult = this.getSprinklerMultiplier(x + 1, y);
            if(cornerMult < 1) { return cornerMult; }
            cornerMult = this.getSprinklerMultiplier(x + 1, y + 1);
            if(cornerMult < 1) { return cornerMult; }
            cornerMult = this.getSprinklerMultiplier(x, y + 1);
            if(cornerMult < 1) { return cornerMult; }
        }
        return 1;
    },
    isSprinkler: function(x, y) {
        if(x < 0 || y < 0 || x >= player.gridWidth || y >= player.gridHeight) { return false; }
        return player.itemGrid[x][y] === "_sprinkler";
    },
    
    keyPress: function(key) {
        const pos = { x: this.cursor.x, y: this.cursor.y };
        let isEnter = false;
        switch(key) {
            case player.controls.up: pos.y--; break;
            case player.controls.left: pos.x--; break;
            case player.controls.down: pos.y++; break;
            case player.controls.right: pos.x++; break;
            case player.controls.confirm:
            case player.controls.pause: isEnter = true; break;
            case player.controls.cancel: return this.cancel(true);
        }
        if(pos.y < 0 || pos.x < 0) { return false; }
        if(isEnter) { return this.click(true); }
        else { return this.CursorMove(pos); }
    },
    mouseMove: function(pos) {
        const me = combat.plant;
        if(me.activeCrop === null) {
            const meY = Math.floor(pos.y - me.dy - 0.5) + me.dy;
            if(meY === (me.dy - 1) && pos.x > 3) { return false; }
            return me.CursorMove({ x: Math.floor(pos.x), y: meY });
        } else {
            me.CursorMove({ x: Math.floor(pos.x - combat.dx) + combat.dx, y: Math.floor(pos.y - combat.dy) + combat.dy });
        }
    },
    CursorMove: function(pos) {
        if(pos.x < 0 || pos.y < 0) { return false; }
        if(this.activeCrop === null) { 
            if(pos.y === (this.dy - 1)) {
                if(pos.x > 3) { return false; }
                pos.x = 0;
            } else {
                if(pos.x >= this.inventoryWidth) { return false; }
                const idx = (pos.y - this.dy) * this.inventoryWidth + pos.x;
                if(idx < 0 || idx >= this.actualIndexes.length) { return false; }
                this.isValid = true;
            }
            if(SamePoints(this.cursor, pos)) { return false; }
            this.cursor = { x: pos.x, y: pos.y };
        } else {
            if(pos.y >= (this.dy - 1)) {
                if(pos.x > 3) { return false; }
                pos.x = 0; pos.y = this.dy - 1;
            } else {
                const diff = this.activeCrop.size - 1;
                if(pos.x < combat.dx || pos.x >= (combat.dx + player.gridWidth - diff)) { return false; }
                if(pos.y < combat.dy) { return false; }
                if(pos.y >= (combat.dy + player.gridHeight - diff)) {
                    pos.x = 0; pos.y = this.dy - 1;
                } else {
                    const px = pos.x - combat.dx, py = pos.y - combat.dy;
                    this.isValid = this.isValidPlantingLocation(px, py, diff);
                }
            }
            if(SamePoints(this.cursor, pos)) { return false; }
            this.cursor = { x: pos.x, y: pos.y };
        }
        this.DrawAll();
        return true;
    },
    click: function(fromKeyboard) {
        let pos = { x: this.cursor.x, y: this.cursor.y };
        if(pos.x < 0 || pos.y < 0) { return false; }
        if(pos.y === (this.dy - 1) && pos.x === 0) { return this.cancel(fromKeyboard || false); }
        if(this.activeCrop === null) {
            pos.y = (pos.y - this.dy);
            if(pos.x >= this.inventoryWidth) { return false; }
            const idx = pos.y * this.inventoryWidth + pos.x;
            if(idx < 0 || idx >= this.actualIndexes.length) { return false; }
            const actualIdx = this.actualIndexes[idx];
            if(player.inventory[actualIdx][1] === 0) { return false; }
            this.activeCrop = GetCrop(player.inventory[actualIdx][0]);
            combat.lastSelectedSeed = { x: this.cursor.x, y: this.cursor.y - this.dy };
            let newx = combat.lastPlantedPos.x, newy = combat.lastPlantedPos.y;
            if(this.activeCrop.size === 2) {
                if((newx + 1) >= player.gridWidth) { newx -= 1; }
                if((newy + 1) >= player.gridHeight) { newy -= 1; }
            }
            this.cursor = { x: combat.dx + newx, y: combat.dy + newy };
            this.isValid = this.isValidPlantingLocation(newx, newy, this.activeCrop.size - 1);
        } else {
            const diff = this.activeCrop.size - 1;
            if(pos.x < combat.dx || pos.x >= (combat.dx + player.gridWidth - diff)) { return false; }
            if(pos.y < combat.dy || pos.y >= (combat.dy + player.gridHeight - diff)) { return false; }
            const px = pos.x - combat.dx, py = pos.y - combat.dy;
            combat.lastPlantedPos = { x: px, y: py };
            const ppos = { x: px, y: py };
            if(!this.isValidPlantingLocation(px, py, diff)) { return false; }
            let newCrop = GetCrop(this.activeCrop.name);
            if(combat.grid[px][py] !== null && combat.grid[px][py].name === "salt") { newCrop.power = Math.ceil(newCrop.power / 2); }
            let cropIsKill = false, killType = 0;
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
            if(newCrop.type === "moist") {
                const watered = [];
                watered.push(this.WaterCrop(px, py, newCrop.power));
                if(newCrop.size === 2) {
                    watered.push(this.WaterCrop(px + 1, py, newCrop.power, watered));
                    watered.push(this.WaterCrop(px, py + 1, newCrop.power, watered));
                    this.WaterCrop(px + 1, py + 1, newCrop.power, watered);
                    this.finishTurn(GetText("plFishFail"));
                }
                this.finishTurn(GetText("waterCrops"));
                return true;
            } if(player.itemGrid[px][py] === "_shooter") {
                if(combat.getUsedShooterIndex(px, py) >= 0) { return false; }
                player.miscdata.techFixturesUsed++;
                combat.usedShooters.push({x: px, y: py});
                this.LaunchSeeds();
                return true;
            } else if(player.itemGrid[px][py] === "_modulator") {
                player.miscdata.techFixturesUsed++;
                this.Modulate();
                return true;
            } else if(this.activeCrop.type === "spear") {
                this.ThrowSpear(px, py);
                return true;
            }
            player.shiftTech(newCrop.type === "tech" ? 0.04 : -0.01);
            if((diff === 0 && player.itemGrid[px][py] !== null && player.itemGrid[px][py].corner === "_cow") ||
                (diff === 1 && player.itemGrid[px + 1][py + 1] !== null && player.itemGrid[px + 1][py + 1].corner === "_cow")) {
                cropIsKill = false;
                const cowDelta = (diff === 1 ? 0 : 1);
                const cowIdx = combat.getCowIndex(px - cowDelta, py - cowDelta);
                player.miscdata.typesPlanted["cow"] += 1;
                if(cowIdx >= 0) {
                    combat.happyCows[cowIdx].feed += newCrop.power;
                } else {
                    combat.happyCows.push({ x: px - cowDelta, y: py - cowDelta, feed: newCrop.power });
                }
                combat.animHelper.DrawBackground();
            } else {
                newCrop.activeTime = this.GetGrowthTime(newCrop, px, py, false);
                const effects = combat.effectGrid[px][py];
                player.miscdata.typesPlanted[newCrop.type] += 1;
                if(!cropIsKill) {
                    if(effects !== null) {
                        const hasStrongSoil = (player.itemGrid[px][py] === "_strongsoil");
                        if(effects.type === "shocked") {
                            newCrop.power = hasStrongSoil ? 2 : 1;
                            newCrop.health = hasStrongSoil ? Math.ceil(newCrop.health * 0.2) : 1;
                        } else if(effects.type === "splashed") {
                            let powMult = hasStrongSoil ? 0.6 : 0.5;
                            switch(newCrop.waterResist) {
                                case 2: powMult += 0.4; break;
                                case 1: powMult += 0.2; break;
                            }
                            newCrop.power = Math.ceil(newCrop.power * powMult);
                            newCrop.health = Math.ceil(newCrop.health * powMult);
                        } else if(effects.type === "burned") {
                            let powMult = hasStrongSoil ? 0.5 : 0.3;
                            switch(newCrop.fireResist) {
                                case 2: powMult += 0.5; break;
                                case 1: powMult += 0.25; break;
                            }
                            newCrop.power = Math.ceil(newCrop.power * powMult);
                            newCrop.health = Math.ceil(newCrop.health * powMult);
                        }
                    }
                    combat.grid[px][py] = newCrop;
                    if(diff === 1) {
                        combat.grid[px + 1][py] = ppos;
                        combat.grid[px][py + 1] = ppos;
                        combat.grid[px + 1][py + 1] = ppos;
                    }
                }
            }
            this.cursor = { x: 0, y: this.dy };
            player.decreaseItem(this.activeCrop.name);
            player.PlantCrop(this.activeCrop.name);
            if(!combat.isBossBattle && ["goldegg", "coconut", "gmocorn", "ultrarod", "goodfood", "notdrugs", "lotus", "hbee"].indexOf(this.activeCrop.name) >= 0) {
                AddAchievementIfMissing("overkill");
            }
            this.activeCrop = null;
            combat.animHelper.DrawCrops();
            if(cropIsKill) {
                let next = () => game.innerTransition(combat.inbetween, combat.plant);
                if(--combat.numPlantTurns == 0) {
                    if(player.canAttackAfterPlanting()) {
                        next = () => game.innerTransition(combat.inbetween, combat.menu, { sel: 0, notFirst: true });
                    } else {
                        next = () => combat.endTurn(combat.inbetween);
                    }
                }
                let killMsg = GetText("tryPlantStart").replace(/\{0\}/g, newCrop.displayname);
                switch(killType) {
                    case 1: killMsg += GetText("tryPlantGloves"); break;
                    case 2: killMsg += GetText("tryPlantPesticide"); break;
                    case 3: killMsg = GetText("tryPlantBees"); worldmap.angryBees = true; player.shiftEthics(-1); break;
                    default: killMsg += GetText("tryPlantBug"); break;
                }
                game.innerTransition(this, combat.inbetween, { next: next, text: killMsg });
                return true;
            } else {
                if(--combat.numPlantTurns == 0) {
                    if(player.canAttackAfterPlanting() && !combat.isFalcon) {
                        game.innerTransition(this, combat.menu, { sel: 0, notFirst: true });
                    } else {
                        combat.endTurn(this);
                    }
                    return true;
                } else {
                    this.setup();
                }
            }
        }
        this.DrawAll();
        return true;
    },
    WaterCrop: function(x, y, power, alreadyWateredCrops) {
        let crop = combat.grid[x][y];
        if(crop === null) { return { ignore: true }; } // this shouldn't even happen anyway
        if(crop.x !== undefined) {
            x = crop.x; y = crop.y;
            crop = combat.grid[crop.x][crop.y];
        }
        if(alreadyWateredCrops !== undefined) {
            for(let i = 0; i < alreadyWateredCrops.length; i++) {
                const wet = alreadyWateredCrops[i];
                if(!wet.ignore && wet.x === x & wet.y === y) { return { ignore: true }; }
            }
        }
        crop.activeTime -= power;
        if(crop.activeTime <= 0) {
            crop.activeTime = 0;
            crop.health = crop.maxhealth;
            if(crop.type === "veg") { crop.rotResistActive = true; }
        }
        if(combat.isFalcon) {
            combat.animHelper.SetBirdAnimState("WON", true);
            combat.animHelper.ResetBirdAnimPos();
        } else {
            combat.animHelper.SetPlayerAnimState("WON", true);
            combat.animHelper.ResetPlayerAnimPos();
        }
        return { x: x, y: y, ignore: false };
    },
    ThrowSpear: function(x, y) {
        const success = (Math.random() * player.luck) > combat.GetCatchChance(this.activeCrop);
        player.miscdata.typesPlanted["water"] += 1;
        player.shiftTech(-0.01);
        player.decreaseItem(this.activeCrop.name);
        if(!success) { return this.finishTurn(GetText("plFishFail")); }
        const crop = GetCrop(this.activeCrop.name);
        crop.ready = true;
        crop.activeTime = 0;
        crop.fishNum = combat.GetFish(crop, player.luck);
        crop.power += crop.fishNum;
        crop.type = "rod";
        combat.grid[x][y] = crop;
        this.finishTurn(GetText("plFishCaught"));
    },
    LaunchSeeds: function() {
        const newCrop = GetCrop(this.activeCrop.name);
        player.shiftTech(0.03);
        const damage = Math.ceil(newCrop.power / 2);
        player.decreaseItem(this.activeCrop.name);
        const numEnemies = combat.enemies.length;
        combat.enemies.forEach((e, i) => combat.damageEnemy(i, damage));
        this.finishTurn(GetText("seedShooterAttack").replace(/\{dmg\}/g, damage).replace(/\{amt\}/g, GetText(numEnemies > 1 ? "cmpatk_pl" : "cmpatk_sing")));
    },
    Modulate: function() {
        const newCrop = GetCrop(this.activeCrop.name);
        player.shiftTech(0.015);
        let seasons = [], seasons2 = [];
        for(let i = 0; i < 4; i++) {
            if(newCrop.seasons[i] === 2) { seasons2.push(i); }
            else if(newCrop.seasons[i] === 1) { seasons.push(i); }
        }
        if(seasons2.length === 0 && seasons.length === 0) { seasons = [0, 1, 2, 3]; }
        combat.season = seasons2.length > 0 ? RandomArrayItem(seasons2) : RandomArrayItem(seasons);
        combat.seasonTime = 0;
        let displaySeason = "";
        switch(combat.season) {
            case 0: displaySeason = "Spring"; break;
            case 1: displaySeason = "Summer"; break;
            case 2: displaySeason = "Autumn"; break;
            case 3: displaySeason = "Winter"; break;
        }
        combat.adjustEnemyStatsWeather();
        this.finishTurn(GetText("plModulate").replace(/\{0\}/g, GetText("season" + combat.season)));
    },
    finishTurn: function(t) {
        this.activeCrop = null;
        game.innerTransition(this, combat.inbetween, {
            next: function() {
                if(--combat.numPlantTurns == 0) {
                    if(player.canAttackAfterPlanting()) {
                        game.innerTransition(this, combat.menu, { sel: 0, notFirst: true });
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
    DrawXs: function() {
        const idx = (this.cursor.y - this.dy) * this.inventoryWidth + this.cursor.x;
        const item = player.inventory[this.actualIndexes[idx]];
        if(item === undefined || item === null) { return; }
        const tempCrop = GetCrop(item[0]);
        for(let x = 0; x < player.gridWidth; x++) {
            for(let y = 0; y < player.gridHeight; y++) {
                if(combat.grid[x][y] !== null) { 
                    if(combat.grid[x][y].name === "salt" && !tempCrop.saltClean) {
                        gfx.drawTileToGrid("x", combat.dx + x, combat.dy + y, "menucursorB");
                    }
                    continue;
                }
                this.activeCrop = tempCrop;
                if(!this.isValidLocationForCrop(x, y)) {
                    gfx.drawTileToGrid("x", combat.dx + x, combat.dy + y, "menucursorB");
                }
                this.activeCrop = null;
            }
        }
    },
    DrawAll: function() {
        gfx.clearSome(this.layersToClean);
        let size = 0;
        const cursorX = this.cursor.x, cursorY = this.cursor.y;
        combat.animHelper.SetPlayerAnimLayer("characters");
        combat.animHelper.SetBirdAnimLayer("characters");
        if(this.activeCrop === null) {
            this.SetText();
            if(combat.isFalcon) {
                combat.animHelper.SetBirdAnimState("THINK", true);            
                combat.animHelper.SetPlayerAnimState("LOOKBACK", true);
            } else {
                combat.animHelper.SetBirdAnimState("STAND", true);  
                combat.animHelper.SetPlayerAnimState("THINK", true);
            }
            this.DrawXs();
        } else {
            this.SetFieldText();
            size = this.activeCrop.size - 1;
            if(combat.isFalcon) {
                combat.animHelper.ResetPlayerAnimState();
                combat.animHelper.SetBirdAnimState("PLANT");
                combat.animHelper.SetBirdAnimLayer("menucursorC");
                if(size === 1) {
                    combat.animHelper.SetBirdAnimPos(cursorX, cursorY + 1.75);
                } else {
                    combat.animHelper.SetBirdAnimPos(cursorX - 0.5, cursorY + 1.375);
                }
            } else {
                combat.animHelper.ResetBirdAnimState();
                combat.animHelper.SetPlayerAnimState("PLANT");
                combat.animHelper.SetPlayerAnimLayer("menucursorC");
                if(size === 1) {
                    combat.animHelper.SetPlayerAnimPos(cursorX, cursorY + 1.25);
                } else {
                    combat.animHelper.SetPlayerAnimPos(cursorX - 0.5, cursorY + 0.75);
                }
            }
        }
        gfx.drawInfobox(17, 5, this.dy + 0.5);
        gfx.drawInfobox(7, 5, this.dy + 0.5);
        const backButtonW = gfx.drawInfoText(GetText("menu.Back"), 0, this.dy - 0.25, cursorY == 7.5, "menuA", "menutext");
        if(this.activeCrop === null) {
            if(cursorY === (this.dy - 1)) {
                combat.cursors.RedimCursor("main", cursorX, cursorY + 0.875, backButtonW, -0.25);
            } else {
                combat.cursors.RedimCursor("main", cursorX, cursorY + 0.5, size, size);
            }
            combat.cursors.ReTypeCursor("main", "cursor");
        } else if(cursorY === (this.dy - 1)) {
            combat.cursors.RedimCursor("main", cursorX, cursorY + 0.875, backButtonW, -0.25);
        } else if(this.isValid) {
            combat.cursors.RedimCursor("main", cursorX, cursorY, size, size);
            combat.cursors.ReTypeCursor("main", "cursor");
        } else {
            combat.cursors.RedimCursor("main", cursorX, cursorY, size, size);
            combat.cursors.ReTypeCursor("main", "bcursor");
        }
        combat.animHelper.DrawBottom();
        for(let i = 0; i < this.actualIndexes.length; i++) {
            const actItem = player.inventory[this.actualIndexes[i]];
            gfx.drawInventoryItem(actItem, i % this.inventoryWidth, this.dy + 0.5 + Math.floor(i / this.inventoryWidth), "menuA");
        }
        
    },
    SetFieldText: function() {
        if(this.cursor.y === (this.dy - 1)) { return; }
        let x = this.cursor.x - combat.dx, y = this.cursor.y - combat.dy;
        let tileInfo = combat.grid[x][y];
        let effectInfo = combat.effectGrid[x][y];
        let itemInfo = player.itemGrid === undefined ? null : player.itemGrid[x][y];
        if(tileInfo === null && effectInfo === null && itemInfo === null) {
            const text = GetText("farmModDirt");
            const speed = Math.round(player.getCropSpeedMultiplier() * (1 / combat.plant.getSprinklerMultiplier(x, y, 1)) * 100);
            gfx.drawWrappedText(text.replace(/\{0\}/g, speed), 9.5 * 16, 11 + (16 * (this.dy + 0.5)), 100);
        } else if(tileInfo !== null) {
            if(tileInfo.x !== undefined) { tileInfo = combat.grid[tileInfo.x][tileInfo.y]; }
            gfx.drawWrappedText(tileInfo.displayname, 9.5 * 16, 11 + (16 * (this.dy + 0.5)), 100);
            pausemenu.inventory.DrawCropPower(tileInfo, 9.5, 9.75, "menutext");
            const row2y = 10.75, leftMostX = 9.5;
            gfx.drawTileToGrid("inv_time", leftMostX, row2y, "menutext");
            if(tileInfo.activeTime > 0 && (tileInfo.time === 999 || tileInfo.time === -1)) {
                gfx.drawTileToGrid("bigNum?", leftMostX + 1, row2y, "menutext");
            }  else {
                gfx.drawBigNumber(tileInfo.activeTime, leftMostX + 1, row2y, "menutext");
            }
            gfx.drawTileToGrid("inv_HP", leftMostX + 3, row2y, "menutext");
            gfx.drawBigNumber(Math.min(99, tileInfo.health), leftMostX + 4, row2y, "menutext");
            const seasons = ["spring", "summer", "autumn", "winter"];
            gfx.drawTileToGrid("curseason" + tileInfo.seasons[combat.season], 9.5, 12, "menutext");
            for(let i = 0; i < 4; i++) {
                gfx.drawTileToGrid(seasons[i] + tileInfo.seasons[i], 10.5 + i, 12, "menutext");
            }
        } else if(itemInfo !== null) {
            if(itemInfo.x !== undefined) {
                x = itemInfo.x; y = itemInfo.y;
                itemInfo = player.itemGrid[x][y];
            }
            const fixture = GetFarmInfo(itemInfo);
            const dispName = (effectInfo !== null ? (GetText("ef." + effectInfo.type) + " ") : "") + fixture.displayname;
            const isBurned = (effectInfo !== null && effectInfo.type === "burned");
            if(itemInfo === "_cow") {
                const text = dispName + "\n " + GetText("cmp_healpow") + ": {0}";
                const mult = 1 + (player.equipment.compost === null ? 0 : (GetEquipment(player.equipment.compost).bonus || 0));
                let amt = 0;
                for(let i = 0; i < combat.happyCows.length; i++) {
                    const cow = combat.happyCows[i];
                    if(cow.x === x && cow.y === y) {
                        amt = Math.ceil(dmgCalcs.CompostFunc(true, combat.season, player.atk, [{ cow: i }], false, true).total * mult);
                        break;
                    }
                }
                gfx.drawWrappedText(text.replace(/\{0\}/g, amt), 9.5 * 16, 11 + (16 * (this.dy + 0.5)), 100);
            } else if(["_log", "_coop", "_paddy", "_strongsoil", "_hotspot"].indexOf(itemInfo) >= 0) {
                const text = dispName + "\n " + GetText("growthSpeed");
                const affectedByBurn = isBurned && ["_log", "_coop"].indexOf(itemInfo) >= 0;
                const speed = affectedByBurn ? "0" : Math.round(player.getCropSpeedMultiplier() * (1 / combat.plant.getSprinklerMultiplier(x, y, 1)) * 100);
                gfx.drawWrappedText(text.replace(/\{0\}/g, speed), 9.5 * 16, 11 + (16 * (this.dy + 0.5)), 100);
            } else {
                gfx.drawWrappedText(dispName, 9.5 * 16, 11 + (16 * (this.dy + 0.5)), 100);
            }
        } else {
            const text = GetText("ef." + effectInfo.type) + " " + GetText("farmModDirt");
            const speed = Math.round(player.getCropSpeedMultiplier() * (1 / combat.plant.getSprinklerMultiplier(x, y, 1)) * 100);
            gfx.drawWrappedText(text.replace(/\{0\}/g, speed), 9.5 * 16, 11 + (16 * (this.dy + 0.5)), 100);
        }
    },
    SetText: function() {
        const idx = (this.cursor.y - this.dy) * this.inventoryWidth + this.cursor.x;
        const item = player.inventory[this.actualIndexes[idx]];
        if(item === null || item === undefined) { return; }
        const crop = GetCrop(item[0]);
        let str = "x" + item[1] + " " + crop.displayname;
        pausemenu.inventory.DrawCropPower(crop, 9.5, 9.75, "menutext");
        const row2y = 10.75;
        let leftMostX = 9.5;
        if(crop.time > 0) {
            gfx.drawTileToGrid("inv_time", leftMostX, row2y, "menutext");
            if(crop.time === 999) { // NOTE: -1 vs 999 what is the diff?
                gfx.drawTileToGrid("bigNum?", leftMostX + 1, row2y, "menutext");
            }  else {
                gfx.drawBigNumber(crop.time, leftMostX + 1, row2y, "menutext");
            }
            leftMostX += 2;
        }
        let maxBonuses = 4;
        if(crop.respawn > 0) {
            gfx.drawTileToGrid("inv_regrow", leftMostX, row2y, "menutext");
            if(crop.respawn === 999 || crop.respawn === -1) {
                gfx.drawTileToGrid("bigNum?", leftMostX + 1, row2y, "menutext");
            }  else {
                gfx.drawBigNumber(crop.respawn, leftMostX + 1, row2y, "menutext");
            }
            leftMostX += 2;
            maxBonuses = 2;
        }
        let bonusesToPush = [];
        if(crop.waterResist) { bonusesToPush.push("waterIco" + crop.waterResist); }
        if(crop.fireResist) { bonusesToPush.push("fireIco" + crop.fireResist); }
        if(crop.stickChance) { bonusesToPush.push("stunIco" + crop.stickChance); }
        if(crop.saltResist) { bonusesToPush.push("saltIco" + crop.saltResist); }
        if(crop.saltClean) { bonusesToPush.push("saltIcoX"); }
        if(crop.animal) { bonusesToPush.push(animalInfo[crop.animal].invSprite); }
        leftMostX += 0.5;
        for(let i = 0; i < Math.min(bonusesToPush.length, maxBonuses); i++) {
            gfx.drawTileToGrid(bonusesToPush[i], leftMostX + i, row2y, "menutext");
        }
        const seasons = ["spring", "summer", "autumn", "winter"];
        gfx.drawTileToGrid("curseason" + crop.seasons[combat.season], 9.5, 12, "menutext");
        for(let i = 0; i < 4; i++) {
            gfx.drawTileToGrid(seasons[i] + crop.seasons[i], 10.5 + i, 12, "menutext");
        }
        gfx.drawWrappedText(str, 9.5 * 16, 11 + (16 * (this.dy + 0.5)), 115);
    }
};
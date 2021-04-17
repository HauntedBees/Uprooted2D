combat.plant = {
    activeCrop: null, actualIndexes: [],
    cursor: {x: 0, y: 0}, isValid: true, 
    inventoryWidth: 12, dy: 10.5,
    layersToClean: ["menuA", "menuB", "menucursorA", "menucursorB", "menutext"],
    setup: function() {
        this.cursor = { x: combat.lastSelectedSeed.x, y: combat.lastSelectedSeed.y + this.dy };
        this.actualIndexes = [];
        this.activeCrop = null;
        this.isValid = true;
        for(let i = 0; i < player.inventory.length; i++) {
            if(player.inventory[i][0][0] === "_" || player.inventory[i][0][0] === "!") { continue; }
            if(combat.isChallenge) {
                const crop = GetCrop(player.inventory[i][0]);
                if(["bee", "spear", "rod", "water", "tech", "sickle2", "moist", "egg"].indexOf(crop.type) >= 0) { continue; }
            }
            
            this.actualIndexes.push(i);
        }
        this.DrawAll();
    },
    clean: function() { gfx.clearSome(this.layersToClean) },
    cancel: function(fromKeyboard) {
        if(game.currentInputHandler.isTutorial) { Sounds.PlaySound("navNok"); return false; }
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
        Sounds.PlaySound("navNok");
        return true;
    },
    isValidPlantingLocation: function(px, py, diff) {
        if(player.gridWidth <= px || player.gridHeight <= py) { return false; }
        if(combat.isChallenge) { return true; }
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
        if(combat.isChallenge) { return 0; }
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
        if(this.isSprinkler(x - 1, y - 1)) { mult -= 0.15; }
        if(this.isSprinkler(x - 1, y)) { mult -= 0.25; }
        if(this.isSprinkler(x - 1, y + 1)) { mult -= 0.15; }
        if(this.isSprinkler(x, y - 1)) { mult -= 0.25; }
        if(this.isSprinkler(x, y + 1)) { mult -= 0.25; }
        if(this.isSprinkler(x + 1, y - 1)) { mult -= 0.15; }
        if(this.isSprinkler(x + 1, y)) { mult -= 0.25; }
        if(this.isSprinkler(x + 1, y + 1)) { mult -= 0.15; }
        mult = Math.max(mult, 0.33);
        if(mult < 1) { return mult * (player.HasWetPerk() ? 0.5 : 1); }
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
        if(player.itemGrid[x] === null || player.itemGrid[x] === undefined) { return false; }
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
        if(this.activeCrop === null) { // picking a crop to plant
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
        } else { // planting said crop
            if(pos.y >= (this.dy - 1)) { // moving from FIELD to BACK
                if(pos.x > 3) { return false; }
                pos.x = 0; pos.y = this.dy - 1;
            } else {
                const diff = this.activeCrop.size - 1;
                const gw = combat.isChallenge ? 3 : player.gridWidth;
                const gh = combat.isChallenge ? 3 : player.gridHeight;
                if(pos.x < combat.dx || pos.x >= (combat.dx + gw - diff)) {
                    if(this.cursor.y === (this.dy - 1) && pos.y === (this.dy - 2)) { // moving from BACK to FIELD
                        pos.x = combat.dx;
                        pos.y = combat.dy + gh - this.activeCrop.size;
                    } else {
                        return false;
                    }
                }
                if(pos.y < combat.dy) { return false; }
                if(pos.y >= (combat.dy + gh - diff)) {
                    pos.x = 0; pos.y = this.dy - 1;
                } else {
                    const px = pos.x - combat.dx, py = pos.y - combat.dy;
                    this.isValid = this.isValidPlantingLocation(px, py, diff);
                }
            }
            if(SamePoints(this.cursor, pos)) { return false; }
            this.cursor = { x: pos.x, y: pos.y };
        }
        Sounds.PlaySound("menuMove");
        this.DrawAll();
        return true;
    },
    click: function(fromKeyboard) {
        let pos = { x: this.cursor.x, y: this.cursor.y };
        if(pos.x < 0 || pos.y < 0) { return false; }
        if(pos.y === (this.dy - 1) && pos.x === 0) { return this.cancel(fromKeyboard || false); } // back
        if(this.activeCrop === null) { // selecting a crop
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
                if(combat.isChallenge) {
                    this.activeCrop.size = 1;
                } else {
                    if((newx + 1) >= player.gridWidth) { newx -= 1; }
                    if((newy + 1) >= player.gridHeight) { newy -= 1; }
                }
            }
            this.cursor = { x: combat.dx + newx, y: combat.dy + newy };
            this.isValid = this.isValidPlantingLocation(newx, newy, this.activeCrop.size - 1);
            Sounds.PlaySound("navOk");
        } else { // placing a crop
            const diff = this.activeCrop.size - 1;
            if(pos.x < combat.dx || pos.x >= (combat.dx + player.gridWidth - diff)) { return false; }
            if(pos.y < combat.dy || pos.y >= (combat.dy + player.gridHeight - diff)) { return false; }
            const px = pos.x - combat.dx, py = pos.y - combat.dy;
            combat.lastPlantedPos = { x: px, y: py };
            const ppos = { x: px, y: py };
            if(!this.isValidPlantingLocation(px, py, diff)) { Sounds.PlaySound("navNok"); return false; }
            const newCrop = GetCrop(this.activeCrop.name);
            if(combat.isChallenge) { newCrop.size = 1; }
            if(combat.grid[px][py] !== null && combat.grid[px][py].name === "salt") { newCrop.power = Math.ceil(newCrop.power / 2); }
            let cropIsKill = false, killType = 0;
            if(player.equipment.gloves !== null && GetEquipment(player.equipment.gloves).tech && !combat.isFalcon) {
                if(["tree", "rice", "veg", "mush"].indexOf(newCrop.type) >= 0 && Math.random() <= 0.1) {
                    cropIsKill = true;
                    killType = 1;
                } // shock gloves can ruin crops
            }
            if(player.equipment.soil !== null && GetEquipment(player.equipment.soil).tech) {
                if(["tree", "rice", "veg", "mush"].indexOf(newCrop.type) >= 0 && (newCrop.power <= 5 || newCrop.time <= 5)) {
                    cropIsKill = true;
                    killType = 2;
                } else if(newCrop.type === "bee") {
                    cropIsKill = true;
                    killType = 3;
                } // pesticide can ruin plants and bees
            }
            if(newCrop.type === "moist") { // water that crop
                const watered = [];
                watered.push(this.WaterCrop(px, py, newCrop.power));
                if(newCrop.size === 2) {
                    watered.push(this.WaterCrop(px + 1, py, newCrop.power, watered));
                    watered.push(this.WaterCrop(px, py + 1, newCrop.power, watered));
                    this.WaterCrop(px + 1, py + 1, newCrop.power, watered);
                    //this.finishTurn(GetText("plFishFail")); // why the fuck was this here
                }
                this.finishTurn(GetText("waterCrops"));
                Sounds.PlaySound("water");
                return true;
            } if(player.itemGrid[px][py] === "_shooter") { // seed shooter
                if(combat.getUsedShooterIndex(px, py) >= 0) { Sounds.PlaySound("navNok"); return false; }
                player.miscdata.techFixturesUsed++;
                combat.usedShooters.push({x: px, y: py});
                this.LaunchSeeds();
                Sounds.PlaySound("hit_gun");
                return true;
            } else if(player.itemGrid[px][py] === "_modulator") { // change season
                player.miscdata.techFixturesUsed++;
                this.Modulate();
                Sounds.PlaySound("bamham");
                return true;
            } else if(this.activeCrop.type === "spear") { // throw spear
                this.ThrowSpear(px, py);
                Sounds.PlaySound("voip");
                return true;
            }
            player.shiftTech(newCrop.type === "tech" ? 0.04 : -0.01);
            let sound = "dismisstext";
            if((diff === 0 && player.itemGrid[px][py] !== null && player.itemGrid[px][py].corner === "_cow") ||
                (diff === 1 && player.itemGrid[px + 1][py + 1] !== null && player.itemGrid[px + 1][py + 1].corner === "_cow")) { // feed cow
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
                sound = "itemget";
            } else { // plant crop
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
            if(cropIsKill) { // crop was damaged
                let next = () => game.innerTransition(combat.inbetween, combat.plant); // but can plant more
                if(--combat.numPlantTurns == 0) {
                    if(player.canAttackAfterPlanting()) { // but can still attack
                        next = () => game.innerTransition(combat.inbetween, combat.menu, { sel: 0, notFirst: true });
                    } else { // and that's the end of it
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
                Sounds.PlaySound("navNok");
                return true;
            } else { // crop was planted
                if(combat.isChallenge) {
                    Sounds.PlaySound(sound);
                    this.setup();
                } else if(--combat.numPlantTurns == 0) {
                    if(player.canAttackAfterPlanting() && !combat.isFalcon) {
                        game.innerTransition(this, combat.menu, { sel: 0, notFirst: true });
                    } else {
                        combat.endTurn(this);
                    }
                    Sounds.PlaySound(sound);
                    return true;
                } else {
                    Sounds.PlaySound(sound);
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
        crop.activeTime -= power * (player.HasWetPerk() ? 2 : 1);
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
        player.decreaseItem(this.activeCrop.name);
        const numEnemies = combat.enemies.length;
        const anim = new ShakeAnim(5, 3.625, 50, "_shooter2", 0.25, 10);
        anim.loop = true;
        combat.animHelper.AddAnim(anim);
        const dmgs = dmgCalcs.CropAttack(true, combat.season, player.atk, [{ crop: newCrop }], combat.enemies.map(e => e.def));
        console.log(dmgs);
        const damage = Math.round(dmgs.attackDatas.reduce((a, c) => c.damage + a, 0) / dmgs.attackDatas.length); // average the damages together
        combat.enemies.forEach((e, i) => {
            combat.animHelper.SetEnemyAnimState(i, "HURT");
            combat.damageEnemy(i, damage);
        });
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
        if(combat.isChallenge) { return; }
        let tempCrop;
        let isUsingActiveCrop = false;
        if(this.activeCrop) {
            tempCrop = this.activeCrop;
            isUsingActiveCrop = true;
        } else {
            const idx = (this.cursor.y - this.dy) * this.inventoryWidth + this.cursor.x;
            const item = player.inventory[this.actualIndexes[idx]];
            if(item === undefined || item === null) { return; }
            tempCrop = GetCrop(item[0]);
        }
        for(let x = 0; x < player.gridWidth; x++) {
            for(let y = 0; y < player.gridHeight; y++) {
                if(combat.grid[x][y] !== null) { 
                    if(combat.grid[x][y].name === "salt" && !tempCrop.saltClean) {
                        gfx.drawTileToGrid("x", combat.dx + x, combat.dy + y, "menuB");
                    }
                    continue;
                }
                if(!isUsingActiveCrop) { this.activeCrop = tempCrop; }
                if(!this.isValidLocationForCrop(x, y)) {
                    gfx.drawTileToGrid("x", combat.dx + x, combat.dy + y, "menuB");
                }
                if(!isUsingActiveCrop) { this.activeCrop = null; }
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
                combat.animHelper.SetOnionAnimState("LOOKBACK");
            } else {
                combat.animHelper.SetBirdAnimState("STAND", true);  
                combat.animHelper.SetPlayerAnimState("THINK", true);
                combat.animHelper.SetOnionAnimState("LOOK");
            }
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
        this.DrawXs();

        // Cursor/Buttons
        const backButtonW = gfx.drawInfoText(GetText("menu.Back"), 0, this.dy - 0.25, cursorY === (this.dy - 1), "menuA", "menutext", true);
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
        
        // Inventory
        gfx.drawInfobox(17, 5, this.dy + 0.5, "", "FarmInfo");
        for(let i = 0; i < this.actualIndexes.length; i++) {
            const actItem = player.inventory[this.actualIndexes[i]];
            gfx.drawInventoryItem(actItem, i % this.inventoryWidth, this.dy + 0.5 + Math.floor(i / this.inventoryWidth), "menuA");
        }

        // Stat Box
        gfx.drawInfobox(4, 7, this.dy - 2, "", "FarmInfo");
        combat.animHelper.DrawSeasonsInfo(13, this.dy - 2.25);
    },
    SetFieldText: function() {
        if(this.cursor.y === (this.dy - 1)) { return; }
        let x = this.cursor.x - combat.dx, y = this.cursor.y - combat.dy;
        let tileInfo = combat.grid[x][y];
        let effectInfo = combat.effectGrid[x][y];
        let itemInfo = player.itemGrid === undefined ? null : player.itemGrid[x][y];
        const leftMostX = 12.375, maxWidth = 64;
        if(tileInfo === null && effectInfo === null && itemInfo === null) {
            const speed = Math.round(player.getCropSpeedMultiplier() * (1 / combat.plant.getSprinklerMultiplier(x, y, 1)) * 100);
            const text = GetText("farmModDirt").replace(/\{0\}/g, speed);
            screenReaderHelper.SayFresh(text, "option");
            gfx.drawWrappedText(text, leftMostX * 16, 16 * (this.dy - 1) - 2, maxWidth, "", "", 16);
        } else if(tileInfo !== null) {
            if(tileInfo.x !== undefined) { tileInfo = combat.grid[tileInfo.x][tileInfo.y]; }
            gfx.drawWrappedText(tileInfo.displayname, leftMostX * 16, 16 * (this.dy - 1) - 2, 64, "", "", 12);
            const text = pausemenu.inventory.DrawCropPower(tileInfo, leftMostX, 9.5, "menutext", false, true);
            screenReaderHelper.SayFresh(tileInfo.displayname + " " + text + ", " + tileInfo.health + " Health", "option");
            const row2y = 10.75, numGap = 0.875;
            gfx.drawTileToGrid("inv_time", leftMostX, row2y, "menutext");
            if(tileInfo.activeTime > 0 && (tileInfo.time === 999 || tileInfo.time === -1)) {
                gfx.drawTileToGrid("bigNum?", leftMostX + numGap, row2y, "menutext");
            }  else {
                gfx.drawBigNumber(tileInfo.activeTime, leftMostX + numGap, row2y, "menutext");
            }
            gfx.drawTileToGrid("inv_HP", leftMostX + 1.75, row2y, "menutext");
            gfx.drawBigNumber(Math.min(99, tileInfo.health), leftMostX + 1.75 + numGap, row2y, "menutext");
            const seasons = ["spring", "summer", "autumn", "winter"];
            for(let i = 0; i < 4; i++) {
                gfx.drawTileToGrid(seasons[i] + tileInfo.seasons[i], leftMostX + i * 0.875, 12, "menutext");
                if(i === combat.season) {
                    gfx.drawTileToGrid("curseason" + tileInfo.seasons[combat.season], leftMostX + i * 0.875, 12, "menutext");
                }
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
                const mult = 1 + (player.equipment.compost === null ? 0 : (GetEquipment(player.equipment.compost).bonus || 0));
                let amt = 0;
                for(let i = 0; i < combat.happyCows.length; i++) {
                    const cow = combat.happyCows[i];
                    if(cow.x === x && cow.y === y) {
                        amt = Math.ceil(dmgCalcs.CompostFunc(true, combat.season, player.GetAttack(false), [{ cow: i }], false, true).total * mult);
                        break;
                    }
                }
                const text = (dispName + "\n " + GetText("cmp_healpow") + ": {0}").replace(/\{0\}/g, amt);
                gfx.drawWrappedText(text, leftMostX * 16, 16 * (this.dy - 1) - 2, maxWidth, "", "", 16);
                screenReaderHelper.SayFresh(text, "info");
            } else if(["_log", "_coop", "_paddy", "_strongsoil", "_hotspot"].indexOf(itemInfo) >= 0) {
                const affectedByBurn = isBurned && ["_log", "_coop"].indexOf(itemInfo) >= 0;
                const speed = affectedByBurn ? "0" : Math.round(player.getCropSpeedMultiplier() * (1 / combat.plant.getSprinklerMultiplier(x, y, 1)) * 100);
                const text = (dispName + "\n " + GetText("growthSpeed")).replace(/\{0\}/g, speed);
                gfx.drawWrappedText(text, leftMostX * 16, 16 * (this.dy - 1) - 2, maxWidth, "", "", 16);
                screenReaderHelper.SayFresh(text, "info");
            } else {
                gfx.drawWrappedText(dispName, leftMostX * 16, 16 * (this.dy - 1) - 2, maxWidth, "", "", 16);
                screenReaderHelper.SayFresh(dispName, "info");
            }
        } else {
            const speed = Math.round(player.getCropSpeedMultiplier() * (1 / combat.plant.getSprinklerMultiplier(x, y, 1)) * 100);
            const text = (GetText("ef." + effectInfo.type) + " " + GetText("farmModDirt")).replace(/\{0\}/g, speed);
            gfx.drawWrappedText(text, leftMostX * 16, 16 * (this.dy - 1) - 2, maxWidth, "", "", 16);
            screenReaderHelper.SayFresh(text, "info");
        }
    },
    SetText: function() {
        const idx = (this.cursor.y - this.dy) * this.inventoryWidth + this.cursor.x;
        const item = player.inventory[this.actualIndexes[idx]];
        if(item === null || item === undefined) { return; }
        const crop = GetCrop(item[0]);
        let leftMostX = 12.375, shiftX = 0;
        let infoText = pausemenu.inventory.DrawCropPower(crop, leftMostX, 9.5, "menutext", false, true);
        const row2y = 10.75, numGap = 0.875;
        if(crop.time > 0) {
            gfx.drawTileToGrid("inv_time", leftMostX, row2y, "menutext");
            if(crop.time === 999) { // NOTE: -1 vs 999 what is the diff?
                gfx.drawTileToGrid("bigNum?", leftMostX + numGap, row2y, "menutext");
            }  else {
                gfx.drawBigNumber(crop.time, leftMostX + numGap, row2y, "menutext");
            }
            infoText += ", Growth Time: " + (crop.time === 999 ? "Random" : `${crop.time} Turn${crop.time === 1 ? "" : "s"}`);
            shiftX += 1.75;
        }
        if(crop.respawn > 0) {
            gfx.drawTileToGrid("inv_regrow", leftMostX + shiftX, row2y, "menutext");
            if(crop.respawn === 999 || crop.respawn === -1) {
                gfx.drawTileToGrid("bigNum?", leftMostX + shiftX + numGap, row2y, "menutext");
            }  else {
                gfx.drawBigNumber(crop.respawn, leftMostX + shiftX + numGap, row2y, "menutext");
            }
            infoText += ", Regrowth Time: " + ((crop.respawn === 999 || crop.respawn < 0) ? "Random" : `${crop.respawn} Turn${crop.respawn === 1 ? "" : "s"}`);
        }
        let bonusesToPush = [];
        if(crop.waterResist) { bonusesToPush.push("waterIco" + crop.waterResist); }
        if(crop.fireResist) { bonusesToPush.push("fireIco" + crop.fireResist); }
        if(crop.stickChance) { bonusesToPush.push("stunIco" + crop.stickChance); }
        if(crop.saltResist) { bonusesToPush.push("saltIco" + crop.saltResist); }
        if(crop.saltClean) { bonusesToPush.push("saltIcoX"); }
        if(crop.animal) { bonusesToPush.push(animalInfo[crop.animal].invSprite); }
        for(let i = 0; i < bonusesToPush.length; i++) {
            gfx.drawTileToGrid(bonusesToPush[i], leftMostX + i * 0.75, 13, "menutext");
        }
        const stepx = 0.875;
        const seasons = ["spring", "summer", "autumn", "winter"];
        for(let i = 0; i < 4; i++) {
            gfx.drawTileToGrid(seasons[i] + crop.seasons[i], leftMostX + i * stepx, 12, "menutext");
            if(combat.season === i) {
                gfx.drawTileToGrid("curseason" + crop.seasons[combat.season], leftMostX + i * stepx, 12, "menutext");
                switch(crop.seasons[combat.season]) {
                    case 2: infoText += ", Grows Great in this Season"; break;
                    case 1: infoText += ", Grows Well in this Season"; break;
                    case 0: infoText += ", Grows Poorly in this Season"; break;
                }
            }
        }
        gfx.drawWrappedText(crop.displayname, leftMostX * 16, 16 * (this.dy - 1) - 2, 64, "", "", 12);
        screenReaderHelper.SayFresh(crop.displayname + " " + infoText, "option");
    }
};
combat.menu = {
    options: [], cursorSel: 0, dy: 9.5, plantedAlreadyAndCantAttack: false, fullyLoaded: false,
    layersToClean: ["menuA", "menucursorB", "menutext"],
    setup: function(args) {
        combat.menu.fullyLoaded = false;
        if(args === undefined && player.health < (player.maxhealth / 4)) { Sounds.PlaySound("dangeresque"); }
        args = args || {};
        this.plantedAlreadyAndCantAttack = args.canOnlyPlant || false;
        if(!args.notFirst) {
            // Pointy Cursor Friend
            const coords = combat.animHelper.GetPlayerTopPos();
            if(combat.isFalcon) {
                combat.animHelper.AddAnim(new SheetAnim(coords.x - 0.75, 2, 700, "pointer", 6, true));
            } else {
                combat.animHelper.AddAnim(new SheetAnim(coords.x + 0.4375, 2, 700, "pointer", 6, true));
            }
        }
        gfx.clearSome(this.layersToClean);
        if(player.equipment.weapon !== null && GetEquipment(player.equipment.weapon).tech) {
            let hasCharger = false;
            for(let x = 0; x < player.gridWidth; x++) {
                if(hasCharger) { break; }
                for(let y = 0; y < player.gridHeight; y++) {
                    const item = combat.grid[x][y]
                    if(item !== null && item.type === "sickle2") {
                        hasCharger = true;
                        break;
                    }
                }
            }
            player.equipment.weapon = hasCharger ? "!sickle2" : "!sickle2_weak";
        }
        this.options = [];
        this.cursorSel = args.sel || 0;
        let plantState = "combatPlant";
        if(!combat.isFalcon && !player.hasSeeds() && !player.canMelee(this.getEnemyCropCount())) { // has no seeds
            if(combat.grid.some(r => r.some(e => e !== null && !e.rotten))) { // at least one crop is growing
                plantState = "combatSkip";
            } else { // no crops are growing
                plantState = "combatSurrender";
            }
        } else if(!this.PlayerHasThingsToPlant() || combat.numPlantTurns === 0) {
            plantState = "combatSkip";
        }
        this.plantState = plantState;
        let text = "abba is a band", charAnim = "STAND", birdAnim = "STAND", onionAnim = "LOOK";
        switch(this.cursorSel) {
            case 0:
                if(combat.isChallenge) {
                    text = GetText("combatAddDesc");
                    charAnim = "WANTPLANT";
                } else if(combat.numPlantTurns === 0) {
                    text = GetText("seeds_none");
                    charAnim = "CANTDO";
                } else if(plantState !== "combatPlant") {
                    if(plantState === "combatSkip") {
                        text = GetText("combatSkipNoSeed");
                        charAnim = "CANTDO";
                    } else {
                        text = GetText("combatSurrenderDesc");
                        charAnim = "CANTDO";
                    }
                } else if(combat.isFalcon) {
                    text = GetText("seeds_one");
                    charAnim = "LOOKBACK";
                    birdAnim = "WANTPLANT";
                    onionAnim = "LOOKBACK";
                } else if(combat.numPlantTurns === 1) {
                    text = GetText("seeds_one");
                    charAnim = "WANTPLANT";
                } else {
                    text = GetText("seeds_many").replace(/\{0\}/g, combat.numPlantTurns);
                    charAnim = "WANTPLANT";
                }
                break;
            case 1:
                const count = this.highlightReadyCropsAndReturnCount();
                if(combat.isChallenge) {
                    text = GetText("combatFinishDesc");
                    charAnim = "WON";
                } else if(combat.isSkunk && count === 0) {
                    text = GetText("kidfightattack");
                    charAnim = "CANTDO";
                } else if(combat.isFalcon) {
                    text = GetText("attack_falcon");
                    charAnim = "LOOKBACK";
                    onionAnim = "LOOKBACK";
                    birdAnim = "WANTATTACK";
                } else if(this.plantedAlreadyAndCantAttack) {
                    text = GetText("attack_planted");
                    charAnim = "CANTDO";
                } else if(count === 0) {
                    if(player.canMelee(this.getEnemyCropCount())) {
                        text = GetText("attack_melee");
                        charAnim = "WANTATTACK";
                    } else {
                        text = GetText("attack_cant");
                        charAnim = "CANTDO";
                    }
                } else {
                    text = GetText("attack_crop");
                    charAnim = "WON";
                }
                break;
            case 2: 
                if(player.equipment.compost === null) {
                    text = GetText("compost_cant");
                    if(combat.isFalcon) { birdAnim = "CANTDO"; }
                    else { charAnim = "CANTDO"; }
                } else if(!this.HasCompostableCrops()) {
                    text = GetText("compost_nocrops");
                    if(combat.isFalcon) { birdAnim = "CANTDO"; }
                    else { charAnim = "CANTDO"; }
                } else {
                    text = GetText("compost_can");
                    if(combat.isFalcon) {
                        charAnim = "LOOKBACK";
                        onionAnim = "LOOKBACK";
                        birdAnim = "WANTCOMPOST";
                    } else {
                        if(this.plantedAlreadyAndCantAttack) {
                            text = GetText("compost_planted");
                            charAnim = "CANTDO";
                        } else {
                            charAnim = "WANTCOMPOST";
                        }
                        
                    }
                }
                break;
            case 3:
                if(combat.isFalcon) {
                    text = GetText("run_falcon");
                    onionAnim = "LOOKBACK";
                    charAnim = "LOOKBACK";
                    birdAnim = "CANTDO";
                } else if(this.plantedAlreadyAndCantAttack) {
                    text = GetText("combatSkipDesc");
                    charAnim = "CANTDO";
                } else if(combat.isBossBattle) {
                    text = GetText("run_cant");
                    charAnim = "CANTDO";
                } else {
                    text = GetText("run_can");
                    onionAnim = "LOOKBACK";
                    charAnim = "LOOKBACK";
                }
                break;
        }

        // Options
        const optiony = gfx.tileHeight - 3;
        let optionx = 4, selText = "";
        if(combat.isChallenge) {
            optionx = this.DrawOption(GetText("combatAdd"), optionx, optiony, this.cursorSel === 0);
            optionx = this.DrawOption(GetText("combatFinish"), optionx, optiony, this.cursorSel === 1);
            switch(this.cursorSel) {
                case 0: selText = GetText("combatAdd"); break;
                case 1: selText = GetText("combatFinish"); break;
            }
        } else {
            optionx = this.DrawOption(GetText(plantState), optionx, optiony, this.cursorSel === 0);
            optionx = this.DrawOption(GetText("combatAttack"), optionx, optiony, this.cursorSel === 1);
            optionx = this.DrawOption(GetText("combatCompost"), optionx, optiony, this.cursorSel === 2);
            optionx = this.DrawOption(GetText(this.plantedAlreadyAndCantAttack ? "combatSkip" : "combatRun"), optionx, optiony, this.cursorSel === 3);
            switch(this.cursorSel) {
                case 0: selText = GetText(plantState); break;
                case 1: selText = GetText("combatAttack"); break;
                case 2: selText = GetText("combatCompost"); break;
                case 3: selText = GetText(this.plantedAlreadyAndCantAttack ? "combatSkip" : "combatRun"); break;
            }
        }
        const cursorwidth = this.options[this.cursorSel], cursorx = this.cursorSel === 0 ? 4 : (this.options[this.cursorSel - 1]);
        combat.cursors.RedimCursor("main", cursorx, optiony, cursorwidth - cursorx - 1, 0);

        // Player Health and Season
        gfx.drawMinibox(0, gfx.tileHeight - 3, 3, 2, "", "FarmInfo");
        gfx.drawText("HP:" + player.health + "/" + player.maxhealth, 32, 12 * 16 - 2, "", 16, "", true);
        
        combat.animHelper.DrawSeasonsInfo(1, 11.875);
        gfx.drawTile("season" + combat.season, 14, 12.75 * 16, "menuA");
        gfx.drawText(GetText("season" + combat.season), 32, 13.4 * 16);

        // Info Text
        gfx.drawMinibox(4, gfx.tileHeight - 2, gfx.tileWidth - 5, 1, "", "FarmInfo");
        gfx.drawWrappedText(text, 4.5 * 16, 12.75 * 16 - 1, 175, "", "", 19);
        
        screenReaderHelper.SayFresh(selText + ". " + text, "option");

        // Ayana and Bird
        combat.animHelper.SetPlayerAnimState(charAnim, true);
        combat.animHelper.SetBirdAnimState(birdAnim, true);
        combat.animHelper.SetOnionAnimState(onionAnim);
        
        // Enemy Health
        for(let i = 0; i < combat.enemies.length; i++) {
            const enemy = combat.enemies[i];
            const pos = combat.animHelper.GetEnemyTopPos(i);
            const healthy = pos.y + (enemy.id === "garfwax" ? 0.5 : -0.5);
            gfx.drawTileToGrid(GetHPFrame(enemy), pos.x, healthy, "menucursorB");
        }
        combat.menu.fullyLoaded = true;
    },
    getEnemyCropCount: function() {
        let count = 0;
        for(let x = 0; x < combat.enemywidth; x++) {
            for(let y = 0; y < combat.enemyheight; y++) {
                const tile = combat.enemyGrid[x][y];
                if(tile === null || tile.x !== undefined) { continue; }
                count++;
            }
        }
        return count;
    },
    HasCompostableCrops: function() {
        if(combat.happyCows.length > 0) { return true; }
        for(let x = 0; x < player.gridWidth; x++) {
            for(let y = 0; y < player.gridHeight; y++) {
                const tile = combat.grid[x][y];
                if(tile === null || tile.x !== undefined) { continue; }
                if(combat.compost.isCompostable(tile)) { return true; }
            }
        }
        return false;
    },
    highlightReadyCropsAndReturnCount: function() {
        if(combat.isFalcon) { return 0; }
        let count = 0;
        for(let x = 0; x < player.gridWidth; x++) {
            for(let y = 0; y < player.gridHeight; y++) {
                const tile = combat.grid[x][y];
                if(tile === null || tile.x !== undefined) { continue; }
                if(tile.name === "app") { if(tile.activeTime > 2) { continue; } }
                else if(tile.rotten || tile.activeTime > 0) { continue; }
                count++;
                const size = tile.size - 1;
                gfx.DrawXCursor(x + combat.dx, y + combat.dy, size, size);
            }
        }
        return count;
    },
    clean: function() { gfx.clearSome(this.layersToClean); },
    DrawOption: function(text, x, y, selected) {
        const newX = gfx.DrawCombatOption(text, x, y, selected);
        this.options.push(newX);
        return newX;
    },
    mouseMove: function(pos) {
        const optiony = gfx.tileHeight - 3;
        if(pos.x < 4 || Math.floor(pos.y) !== optiony) { return false; }
        for(let x = 0; x < this.options.length; x++) {
            if(pos.x < this.options[x]) {
                return combat.menu.CursorMove({ x: x, y: 0 });
            }
        }
    },
    CursorMove: function(pos) {
        if(pos.x < 0 || pos.x > 3) { return false; }
        if(this.cursorSel === pos.x) { return false; }
        Sounds.PlaySound("menuMove");
        this.setup({ sel: pos.x, notFirst: true, canOnlyPlant: combat.menu.plantedAlreadyAndCantAttack });
        return true;
    },
    click: function(pos, isFresh) {
        if(!isFresh || !combat.menu.fullyLoaded) { return false; }
        if(this.cursorSel > 3 || this.cursorSel < 0) { return false; }
        switch(this.cursorSel) {
            case 0:
                if(this.plantState !== "combatPlant") {
                    if(this.plantState === "combatSkip") {
                        combat.endTurn(this);
                    } else {
                        combat.animHelper.SetPlayerAnimState("FATALBLOW");
                        combat.animHelper.SetOnionAnimState("HURT");
                        player.health = 0;
                        game.innerTransition(this, combat.inbetween, {
                            next: function() { combat.endTurn(combat.inbetween) },
                            text: GetText("combatSurrenderDo")
                        });
                    }
                } else if(combat.numPlantTurns > 0) {
                    game.innerTransition(this, combat.plant);
                }
                break;
            case 1:
                if(combat.isChallenge) {
                    this.FinishChallenge();
                } else {
                    if(!combat.isFalcon && this.plantedAlreadyAndCantAttack) { Sounds.PlaySound("navNok"); return false; }
                    const count = this.highlightReadyCropsAndReturnCount();
                    const theircount = this.getEnemyCropCount();
                    if(combat.isSkunk && count === 0) { Sounds.PlaySound("navNok"); return false; }
                    if(!combat.isFalcon && count === 0 && !player.canMelee(theircount)) { Sounds.PlaySound("navNok"); return false; }
                    let attackCount = 1;
                    if(player.equipment.weapon !== null) { attackCount = GetEquipment(player.equipment.weapon).attacks || 1; }
                    game.innerTransition(this, combat.selectTarget, {numAttacks: attackCount, isMelee: count === 0, theirCrops: theircount});
                }
                break;
            case 2:
                if(!combat.isFalcon && this.plantedAlreadyAndCantAttack) { Sounds.PlaySound("navNok"); return false; }
                if(player.equipment.compost !== null && this.HasCompostableCrops()) { game.innerTransition(this, combat.compost); }
                else { Sounds.PlaySound("navNok"); return false; }
                break;
            case 3:
                if(!combat.isFalcon) {
                    if(this.plantedAlreadyAndCantAttack) {
                        combat.endTurn(this);
                    } else if(!combat.isBossBattle) {
                        this.tryFlee();
                    } else {
                        Sounds.PlaySound("navNok");
                        return false;
                    }
                } else {
                    Sounds.PlaySound("navNok");
                    return false;
                }
                break;
            default: Sounds.PlaySound("navNok"); return false;
        }
        Sounds.PlaySound("navOk");
        return true;
    },
    FinishChallenge: function() {
        combat.animHelper.SetPlayerAnimState("LEVELUP");
        combat.animHelper.SetOnionAnimState("WON");
        const key = combat.grid.some(row => row.some(cell => cell !== null)) ? "combatFinishText" : "combatFinishGiveUp";
        game.innerTransition(this, combat.inbetween, {
            text: GetText(key),
            next: function() {
                clearInterval(combat.charAnimIdx);
                combat.wrapUpCombat();
                game.transition(combat.inbetween, worldmap, {
                    init: worldmap.pos,
                    map: worldmap.mapName,
                    noEntityUpdate: true,
                    challenger: combat.challenger,
                    chingredients: combat.grid.reduce((a, c) => [...c, ...a], []).filter(c => c !== null && typeof c !== "number" && c.name !== undefined).map(c => c.name)
                });
            }
        });
    },
    freeFleeEnemies: ["machineA", "machineB", "machineC", "machineD", "botMush", "botRice", "botFruit", "botVeggie"],
    tryFlee: function() {
        if(combat.enemies.some(e => this.freeFleeEnemies.indexOf(e.id) >= 0) || Math.random() < (0.65 * player.luck)) {
            combat.animHelper.SetPlayerAnimState("FLEE", true);
            combat.animHelper.SetOnionAnimState("LOOKBACK");
            if(game.target !== null && !game.target.noRunKill) { worldmap.clearTarget(); }
            game.innerTransition(this, combat.inbetween, {
                next: function() {
                    clearInterval(combat.charAnimIdx);
                    combat.wrapUpCombat();
                    game.transition(combat.inbetween, worldmap, {
                        init: worldmap.pos,
                        map: worldmap.mapName,
                        noEntityUpdate: true
                    });
                },
                text: GetText("flee_success")
            });
        } else {
            combat.animHelper.SetPlayerAnimState("FLEEFAIL", true);
            combat.animHelper.SetOnionAnimState("LOOKBACK");
            game.innerTransition(this, combat.inbetween, {
                next: function() { combat.endTurn(combat.inbetween) },
                text: GetText("flee_fail")
            });
        }
    },
    keyPress: function(key) {
        let pos = { x: this.cursorSel, y: 0 };
        let isEnter = false;
        if(player.options.rightBumperWin === true && key === "Gamepad5") {
            for(let i = 0; i < combat.enemies.length; i++) {
                combat.damageEnemy(i, combat.enemies[i].health);
            }
            combat.endTurn(combat.menu);
            return;
        }
        switch(key) {
            case player.controls.left: pos.x--; break;
            case player.controls.right: pos.x++; break;
            case player.controls.confirm:
            case player.controls.pause: isEnter = true; break;
        }
        if(pos.x < 0 || pos.x > 3 || (combat.isChallenge && pos.x > 1)) { return false; }
        if(isEnter) {
            return this.click(pos, input.IsFreshPauseOrConfirmPress());
        } else {
            return this.CursorMove(pos);
        }
    },
    PlayerHasThingsToPlant: function() {
        const crops = player.inventory.filter(e => e[0][0] !== "!" && e[0][0] !== "_");
        for(let i = 0; i < crops.length; i++) {
            const crop = GetCrop(crops[i][0]);
            for(let x = 0; x < player.gridWidth; x++) {
                for(let y = 0; y < player.gridHeight; y++) {
                    combat.plant.activeCrop = crop;
                    if(combat.plant.isValidPlantingLocation(x, y, crop.size - 1) && combat.plant.isValidLocationForCrop(x, y)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
};
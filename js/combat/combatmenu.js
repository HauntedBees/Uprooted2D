combat.menu = {
    options: [], cursorY: 0, dy: 9.5,
    layersToClean: ["menuA", "menucursorB", "menutext"],
    setup: function(sel, notFirst) {
        if(!notFirst) {
            if(combat.isFalcon) {
                combat.animHelper.AddAnim(new SheetAnim(2, 7, 700, "pointer", 6, true));
            } else {
                combat.animHelper.AddAnim(new SheetAnim(3.4375, 7, 700, "pointer", 6, true));
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
        this.cursorY = sel || 0;
        this.drawOption("Plant", 0, this.cursorY === 0);
        this.drawOption("Attack", 1, this.cursorY === 1);
        this.drawOption("Compost", 2, this.cursorY === 2);
        this.drawOption("Run", 3, this.cursorY === 3);
        combat.cursors.RedimCursor("main", 0, this.dy + this.cursorY, this.options[this.cursorY], 0);
        let text = "abba is a band", charAnim = "STAND", birdAnim = "STAND";
        switch(this.cursorY) {
            case 0:
                if(combat.isFalcon) {
                    text = GetText("seeds_one");
                    charAnim = "LOOKBACK";
                    birdAnim = "WANTPLANT";
                } else if(combat.numPlantTurns == 0) {
                    text = GetText("seeds_none");
                    charAnim = "CANTDO";
                } else if(combat.numPlantTurns == 1) {
                    text = GetText("seeds_one");
                    charAnim = "WANTPLANT";
                } else {
                    text = GetText("seeds_many").replace(/\{0\}/g, combat.numPlantTurns);
                    charAnim = "WANTPLANT";
                }
                break;
            case 1:
                const count = this.highlightReadyCropsAndReturnCount();
                if(combat.isFalcon) {
                    text = GetText("attack_falcon");
                    charAnim = "LOOKBACK";
                    birdAnim = "WANTATTACK";
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
                        birdAnim = "WANTCOMPOST";
                    } else {
                        charAnim = "WANTCOMPOST";
                    }
                }
                break;
            case 3:
                if(combat.isFalcon) {
                    text = GetText("run_falcon");
                    charAnim = "LOOKBACK";
                    birdAnim = "CANTDO";
                } else if(combat.isBossBattle) {
                    text = GetText("run_cant");
                    charAnim = "CANTDO";
                } else {
                    text = GetText("run_can");
                    charAnim = "LOOKBACK";
                }
                break;
        }
        combat.animHelper.SetPlayerAnimState(charAnim, true);
        combat.animHelper.SetBirdAnimState(birdAnim, true);
        gfx.drawInfobox(12, 3, this.dy);
        const topy = 9.25;
        const useLongNames = combat.enemies.length < 3;
        for(let i = 0; i < combat.enemies.length; i++) {
            const enemy = combat.enemies[i];
            const enemyNameInfo = this.GetEnemyNameInfo(enemy, useLongNames);
            gfx.drawText(enemyNameInfo.name, (5.75 + 6 * Math.floor(i / 2)) * 16, (topy + 1 + (i % 2)) * 16);
            gfx.drawTileToGrid(GetHPFrame(enemy), 4.5 + 6 * Math.floor(i / 2), topy + (i % 2), "menucursorB");
        }
        gfx.drawInfobox(12, 2, this.dy + 2);
        gfx.drawWrappedText(text, 4.5 * 16, 11 + ((2 + this.dy) * 16), 170);
        combat.animHelper.DrawBottom();
    },
    GetEnemyNameInfo: function(e, useLong) {
        let name = e.name, len = Math.ceil(gfx.getTextLength(e.name) / 16 / gfx.scale * 2) / 2;
        const maxLen = useLong ? 10 : 4;
        while(len > maxLen) {
            name = name.substring(0, name.length - 4) + "...";
            len = Math.ceil(gfx.getTextLength(name) / 16 / gfx.scale * 2) / 2;
        }
        return { name: name, len: len };
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
    drawOption: function(text, y, selected) {
        let xi = 1, tile = 7;
        if(selected) { tile = 9; }
        gfx.drawSprite("sheet", tile, 11, 0, 2 + (this.dy + y) * 16, "menuA");
        let width = gfx.getTextWidth(text);
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
        this.setup(pos.y - this.dy, true);
        return true;
    },
    click: function(pos, isFresh) {
        if(!isFresh) { return false; }
        if(pos.x > 4) { return false; }
        switch(pos.y - this.dy) {
            case 0: if(combat.numPlantTurns > 0) { game.innerTransition(this, combat.plant); } break;
            case 1:
                const count = this.highlightReadyCropsAndReturnCount();
                const theircount = this.getEnemyCropCount();
                if(count === 0 && !player.canMelee(theircount)) { return; }
                let attackCount = 1;
                if(player.equipment.weapon !== null) { attackCount = GetEquipment(player.equipment.weapon).attacks || 1; }
                game.innerTransition(this, combat.selectTarget, {numAttacks: attackCount, isMelee: count === 0, theirCrops: theircount});
                break;
            case 2: if(player.equipment.compost !== null && this.HasCompostableCrops()) { game.innerTransition(this, combat.compost); } break;
            case 3: if(!combat.isBossBattle && !combat.isFalcon) { this.tryFlee(); } break;
            default: return false;
        }
        return true;
    },
    tryFlee: function() {
        if(Math.random() < (0.65 * player.luck)) {
            combat.animHelper.SetPlayerAnimState("FLEE", true);
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
            game.innerTransition(this, combat.inbetween, {
                next: function() { combat.endTurn(combat.inbetween) },
                text: GetText("flee_fail")
            });
        }
    },
    keyPress: function(key) {
        let pos = { x: 0, y: this.cursorY + this.dy };
        let isEnter = false;
        switch(key) {
            case player.controls.up: pos.y--; break;
            case player.controls.down: pos.y++; break;
            case player.controls.confirm:
            case player.controls.pause: isEnter = true; break;
        }
        if(pos.y < 0) { return false; }
        if(isEnter) {
            return this.click(pos, input.IsFreshPauseOrConfirmPress());
        } else {
            return this.mouseMove(pos);
        }
    }
};
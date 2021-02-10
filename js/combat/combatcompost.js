combat.compost = {
    selectedCrops: [], binSprite: "compost", binx: 3.825, biny: 4,
    cursor: {x: 1, y: 5}, dy: 11, compostMultiplier: 1, 
    backY: 0, healY: 0, attackY: 0, canAttack: false, 
    backButtonWidth: 0, backButtonSelected: false, 
    healButtonWidth: 0, healButtonSelected: false, 
    attackButtonWidth: 0, attackButtonSelected: false, 
    layersToClean: ["menuA", "menucursorB", "menutext"],
    setup: function() {
        this.canAttack = player.canAttackWithCompost();
        this.selectedCrops = [];
        this.backY = 2 + (this.dy + 0.5) * 16;
        this.healY = this.backY + 16;
        this.atkY = this.healY + 16;
        this.binSprite = player.equipment.compost;
        this.cursor = {x: combat.dx, y: combat.dy};
        this.healButtonSelected = false;
        this.attackButtonSelected = false;
        this.backButtonSelected = false;
        if(player.equipment.compost !== null) {
            this.compostMultiplier = 1 + (GetEquipment(player.equipment.compost).bonus || 0);
        } else { this.compostMultiplier = 1; }
        this.mouseMove(this.cursor);
        this.drawAll();
    },
    drawAll: function() {
        gfx.clearSome(this.layersToClean);
        combat.cursors.ReTypeCursor("main", "cursor");
        
        // Selected Crops
        for(let i = 0; i < this.selectedCrops.length; i++) {
            const pos = this.selectedCrops[i];
            if(pos.cow !== undefined) {
                const croppos = combat.happyCows[pos.cow];
                gfx.DrawXCursor(croppos.x + combat.dx, croppos.y + combat.dy, 1, 1);
            } else {
                const size = combat.grid[pos.x][pos.y].size - 1;
                gfx.DrawXCursor(pos.x + combat.dx, pos.y + combat.dy, size, size);
            }
        }

        // Player Health and Season
        gfx.drawMinibox(0, gfx.tileHeight - 3, 3, 2, "", "FarmInfo");
        gfx.drawText("HP:" + player.health + "/" + player.maxhealth, 32, 12 * 16 - 2, "", 16, "", true);
        
        combat.animHelper.DrawSeasonsInfo(1, 11.875);
        gfx.drawTile("season" + combat.season, 14, 12.75 * 16, "menuA");
        gfx.drawText(GetText("season" + combat.season), 32, 13.4 * 16);

        // Player Actions
        let textKey = "cmp_healpow";
        this.backButtonWidth = gfx.DrawCombatOption(GetText("menu.Back"), 4, this.dy, this.backButtonSelected);
        this.healButtonWidth = gfx.DrawCombatOption(GetText("cmp_healsel"), this.backButtonWidth, this.dy, this.healButtonSelected);
        this.canAttack = true; // FOR FUCKING TESTING TODO: REMOVE
        if(this.canAttack) {
            textKey = "cmp_atkpow";
            this.attackButtonWidth = gfx.DrawCombatOption(GetText("cmp_atksel"), this.healButtonWidth, this.dy, this.attackButtonSelected);
        }
        
        // Get Power of Compost
        let hdmg = 0, admg = 0;
        if(this.selectedCrops.length > 0) {
            let results = dmgCalcs.CompostFunc(true, combat.season, player.atk, this.selectedCrops, false, true);
            hdmg = Math.ceil(results.total * this.compostMultiplier);
            if(this.canAttack) {
                results = dmgCalcs.CompostFunc(true, combat.season, player.atk, this.selectedCrops, true, true);
                admg = Math.ceil(this.compostMultiplier * results.total / 3.5);
            }
        }
        
        const textX = 72, textY = (this.dy + 2) * 16 - 2, textW = 180;

        // Information
        gfx.drawMinibox(4, gfx.tileHeight - 2, gfx.tileWidth - 5, 1, "", "FarmInfo");
        if(this.backButtonSelected) {
            gfx.drawWrappedText(GetText(textKey).replace(/\{0\}/g, hdmg).replace(/\{1\}/g, admg), textX, textY, textW);
            
            combat.animHelper.SetPlayerAnimLayer("characters");
            combat.animHelper.SetBirdAnimLayer("characters");
            combat.cursors.RedimCursor("main", 4, this.dy, this.backButtonWidth - 5, 0);
            if(combat.isFalcon) {
                combat.animHelper.SetBirdAnimState("THINK", true);
                combat.animHelper.SetPlayerAnimState("LOOKBACK", true);
            } else {
                combat.animHelper.SetBirdAnimState("STAND", true);
                combat.animHelper.SetPlayerAnimState("THINK", true);
            }
        } else if(this.healButtonSelected) {
            if(this.selectedCrops.length > 0) {
                let str = GetText("cmp_doHeal");
                str = HandlePlurals(str, this.selectedCrops.length);
                str = str.replace(/\{0\}/g, this.selectedCrops.length).replace(/\{1\}/g, hdmg);
                gfx.drawWrappedText(str, textX, textY, textW);
            } else {
                gfx.drawWrappedText(GetText("cmp_needOne"), textX, textY, textW);
            }

            combat.animHelper.SetPlayerAnimLayer("characters");
            combat.animHelper.SetBirdAnimLayer("characters");
            combat.cursors.RedimCursor("main", this.backButtonWidth, this.dy, this.healButtonWidth - this.backButtonWidth - 1, 0);
            if(combat.isFalcon) {
                combat.animHelper.SetBirdAnimState("THINK", true);
                combat.animHelper.SetPlayerAnimState("LOOKBACK", true);
            } else {
                combat.animHelper.SetBirdAnimState("STAND", true);
                combat.animHelper.SetPlayerAnimState("THINK", true);
            }
        } else if(this.attackButtonSelected) {
            if(this.selectedCrops.length > 0) {
                let str = GetText("cmp_doAttack");
                str = HandlePlurals(str, this.selectedCrops.length);
                str = str.replace(/\{0\}/g, this.selectedCrops.length).replace(/\{1\}/g, admg);
                gfx.drawWrappedText(str, textX, textY, textW);
            } else {
                gfx.drawWrappedText(GetText("cmp_needOne"), textX, textY, textW);
            }

            combat.animHelper.SetPlayerAnimLayer("characters");
            combat.cursors.RedimCursor("main", this.healButtonWidth, this.dy, this.attackButtonWidth - this.healButtonWidth - 1, 0);
            if(combat.isFalcon) {
                combat.animHelper.SetBirdAnimState("WANTATTACK", true);
                combat.animHelper.SetPlayerAnimState("LOOKBACK", true);
            } else {
                combat.animHelper.SetBirdAnimState("STAND", true);
                combat.animHelper.SetPlayerAnimState("WANTATTACK", true);
            }
        } else {
            gfx.drawWrappedText(GetText(textKey).replace("{0}", hdmg).replace("{1}", admg), textX, textY, textW);

            if(combat.isFalcon) { combat.animHelper.SetBirdAnimLayer("menucursorC"); }
            else { combat.animHelper.SetPlayerAnimLayer("menucursorC"); }
            const px = this.cursor.x - combat.dx, py = this.cursor.y - combat.dy;
            const tile = combat.grid[px][py];
            if(tile) {
                if(tile.x !== undefined) { // part of a tree
                    this.WriteAboutCrop(combat.grid[tile.x][tile.y]);
                    if(this.isCompostable(combat.grid[tile.x][tile.y])) {
                        combat.cursors.RedimCursor("main", tile.x + combat.dx, tile.y + combat.dy, 1, 1);
                    } else {
                        combat.cursors.ReTypeCursor("main", "bcursor");
                        combat.cursors.RedimCursor("main", tile.x + combat.dx, tile.y + combat.dy, 1, 1);
                    }
                    if(combat.isFalcon) {
                        combat.animHelper.ResetPlayerAnimState();
                        combat.animHelper.SetBirdAnimState("PLANT");
                        combat.animHelper.SetBirdAnimPos(tile.x + combat.dx, tile.y + combat.dy + 1.75);
                    } else {
                        combat.animHelper.ResetBirdAnimState();
                        combat.animHelper.SetPlayerAnimState("PLANT");
                        combat.animHelper.SetPlayerAnimPos(tile.x + combat.dx, tile.y + combat.dy + 1.25);
                    }
                } else {
                    this.WriteAboutCrop(tile);
                    if(this.isCompostable(tile)) {
                        combat.cursors.RedimCursor("main", this.cursor.x, this.cursor.y, tile.size - 1, tile.size - 1);
                    } else {
                        combat.cursors.ReTypeCursor("main", "bcursor");
                        combat.cursors.RedimCursor("main", this.cursor.x, this.cursor.y, tile.size - 1, tile.size - 1);
                    }
                    if(combat.isFalcon) {
                        combat.animHelper.ResetPlayerAnimState();
                        combat.animHelper.SetBirdAnimState("PLANT");
                        if(tile.size === 2) {
                            combat.animHelper.SetBirdAnimPos(this.cursor.x, this.cursor.y + 1.75);
                        } else {
                            combat.animHelper.SetBirdAnimPos(this.cursor.x - 0.5, this.cursor.y + 1.375);
                        }
                    } else {
                        combat.animHelper.ResetBirdAnimState();
                        combat.animHelper.SetPlayerAnimState("PLANT");
                        if(tile.size === 2) {
                            combat.animHelper.SetPlayerAnimPos(this.cursor.x, this.cursor.y + 1.25);
                        } else {
                            combat.animHelper.SetPlayerAnimPos(this.cursor.x - 0.5, this.cursor.y + 0.75);
                        }
                    }
                }
            } else {
                const possibleCow = player.itemGrid[px][py];
                let cowIdx = -1,  cowPos = { x: this.cursor.x, y: this.cursor.y };
                if(possibleCow !== null && possibleCow.x !== undefined && player.itemGrid[possibleCow.x][possibleCow.y] === "_cow") {
                    cowIdx = combat.getCowIndex(possibleCow.x, possibleCow.y);
                    cowPos = { x: possibleCow.x + combat.dx, y: possibleCow.y + combat.dy };
                } else if(possibleCow === "_cow") {
                    cowIdx = combat.getCowIndex(px, py);
                }
                if(cowIdx < 0) {
                    combat.cursors.ReTypeCursor("main", "bcursor");
                    combat.cursors.RedimCursor("main", this.cursor.x, this.cursor.y, 0, 0);
                    if(combat.isFalcon) {
                        combat.animHelper.ResetPlayerAnimState();
                        combat.animHelper.SetBirdAnimState("PLANT");
                        combat.animHelper.SetBirdAnimPos(this.cursor.x - 0.5, this.cursor.y + 1.375);
                    } else {
                        combat.animHelper.ResetBirdAnimState();
                        combat.animHelper.SetPlayerAnimState("PLANT");
                        combat.animHelper.SetPlayerAnimPos(this.cursor.x - 0.5, this.cursor.y + 0.75);
                    }
                } else {
                    combat.cursors.RedimCursor("main", cowPos.x, cowPos.y, 1, 1);
                    this.WriteAboutCrop({
                        displayname: GetText("cmp_cow"),
                        power: Math.min(11, Math.round(Math.log2(Math.max(1.1, combat.happyCows[cowIdx].feed) * 3))),
                        seasons: [2, 2, 2, 2]
                    });
                    if(combat.isFalcon) { 
                        combat.animHelper.ResetPlayerAnimState();
                        combat.animHelper.SetBirdAnimState("PLANT");
                        combat.animHelper.SetBirdAnimPos(cowPos.x + 0.5, cowPos.y + 2.25);
                    } else {
                        combat.animHelper.ResetBirdAnimState();
                        combat.animHelper.SetPlayerAnimState("PLANT");
                        combat.animHelper.SetPlayerAnimPos(cowPos.x + 0.5, cowPos.y + 2);
                    }
                }
            }
        }
        gfx.drawTileToGrid(this.binSprite, this.binx, this.biny, "menucursorB");
    },
    clean: function() { gfx.clearSome(this.layersToClean); },
    cancel: function() {
        if(game.currentInputHandler.isTutorial) { return false; }
        game.innerTransition(this, combat.menu, { sel: 2, notFirst: true });
        Sounds.PlaySound("navNok");
        return true;
    },
    toggleCrop: function(gridpos) {
        for(let i = 0; i < this.selectedCrops.length; i++) {
            const old = this.selectedCrops[i];
            if(gridpos.x == old.x && gridpos.y == old.y) {
                this.selectedCrops.splice(i, 1);
                return;
            }
        }
        if(this.selectedCrops.length == player.getCompostMax()) { Sounds.PlaySound("navNok"); return; }
        this.selectedCrops.push(gridpos);
        Sounds.PlaySound("navOk");
    },
    isCompostable: function(tile) {
        if(tile.name === "coffee" && tile.activeTime === 0) { return true; }
        if(tile.type === "bee") { return tile.activeTime === 0; }
        if(tile.type === "egg" || tile.type === "tech" || tile.type === "rock") { return false; }
        return (player.equipment.compost !== null && (!GetEquipment(player.equipment.compost).rotOnly || tile.rotten));
    },
    mouseMove: function(pos) {
        if(Math.floor(pos.y) === combat.compost.dy) {
            combat.compost.CursorMove({ x: Math.round(pos.x), y: combat.compost.dy });
        } else {
            combat.compost.CursorMove({ 
                x: Math.floor(pos.x - combat.dx) + combat.dx,
                y: Math.floor(pos.y - combat.dy) + combat.dy,
                fromHeal: combat.compost.cursor.y >= combat.compost.dy
            });
        }
    },
    CursorMove: function(pos) {
        if(pos.y === this.dy) {
            if(Between(pos.x, 4, this.backButtonWidth - 1)) { // back button
                this.cursor = pos;
                if(this.backButtonSelected) { console.log("UNGO"); return false; }
                this.attackButtonSelected = false;
                this.healButtonSelected = false;
                this.backButtonSelected = true;
            } else if(Between(pos.x, this.backButtonWidth, this.healButtonWidth - 1)) { // heal button
                this.cursor = pos;
                if(this.healButtonSelected) { return false; }
                this.backButtonSelected = false;
                this.attackButtonSelected = false;
                this.healButtonSelected = true;
            } else if(Between(pos.x, this.healButtonWidth, this.attackButtonWidth - 1)) { // attack button
                this.cursor = pos;
                if(this.attackButtonSelected) { return false; }
                this.backButtonSelected = false;
                this.healButtonSelected = false;
                this.attackButtonSelected = true;
            } else {
                this.backButtonSelected = false;
                this.attackButtonSelected = false;
                this.healButtonSelected = false;
            }
        } else { // compost selection
            this.backButtonSelected = false;
            this.attackButtonSelected = false;
            this.healButtonSelected = false;
            if(pos.x < combat.dx || pos.x >= (combat.dx + player.gridWidth)) { return false; }
            if(pos.y < combat.dy || pos.y >= (combat.dy + player.gridHeight)) { return false; }
            if(pos.fromHeal) {
                this.cursor = pos;
            } else {
                const dx = pos.x - this.cursor.x, dy = pos.y - this.cursor.y;
                const ax = this.cursor.x - combat.dx, ay = this.cursor.y - combat.dy;
                const bx = pos.x - combat.dx, by = pos.y - combat.dy;
                const currentTile = combat.grid[ax][ay];
                const nextTile = combat.grid[bx][by];
                if(this.IsSameTile(ax, ay, currentTile, bx, by, nextTile)) {
                    const dPos = { x: pos.x + dx, y: pos.y + dy };
                    if(dPos.y >= (combat.dy + player.gridHeight)) {
                        this.cursor = { x: 0, y: this.dy };
                        this.backButtonSelected = true;
                    } else if(dPos.x < combat.dx || dPos.x >= (combat.dx + player.gridWidth) || dPos.y < combat.dy) {
                        this.cursor = pos;
                    } else { this.cursor = dPos; }
                } else if(SamePoints(this.cursor, pos)) { return false; }
                else { this.cursor = pos; }
            }
        }
        Sounds.PlaySound("menuMove");
        this.drawAll();
        return true;
    },
    IsSameTile: function(ax, ay, a, bx, by, b) {
        const itemA = player.itemGrid[ax][ay], itemB = player.itemGrid[bx][by];
        if(itemA !== null && itemB !== null) {
            if(itemA.coord === true) {
                if(itemB.coord === true) { // both are coordinates
                    if(itemA.x === itemB.x && itemA.y === itemB.y) { return true; }
                } else { // A is coord, B isn't
                    if(itemB === "_cow" && itemA.x === bx && itemA.y === by) { return true; }
                }
            } else if(itemB.coord === true) { // B is coord, A isn't
                if(itemA === "_cow" && itemB.x === ax && itemB.y === ay) { return true; }
            }
        }
        if(a === null || b === null) { return false; }
        if(a.x !== undefined) {
            if(b.x !== undefined) { return (a.x === b.x && a.y === b.y); }
            else { return (a.x === bx && a.y === by); }
        } else {
            if(b.x !== undefined) { return (b.x === ax && b.y === ay); }
            else { return false; }
        }
    },
    compostFailureCheck: function() {
        if(player.equipment.compost === null) { return false; }
        if(!GetEquipment(player.equipment.compost).tech) { return false; }
        if(Math.random() > 0.5) { return false; }
        dmgCalcs.CompostFunc(true, combat.season, player.atk, this.selectedCrops, true);
        const anim = new NotAnAnim(4, 6, 1000, "compost");
        anim.finish = function() {
            const inneranim = new ShakeAnim(4, 6, 500, "compost", 0.25, 20);
            inneranim.finish = combat.animHelper.GivePlayerAHit;
            combat.animHelper.AddAnim(inneranim);
        };
        combat.animHelper.AddAnim(anim);
        game.innerTransition(this, combat.inbetween, {
            next: function() { combat.endTurn(combat.inbetween) },
            text: "You attempt to compost your crops, but your compost bin backfires!"
        });
        combat.animHelper.SetPlayerAnimState("WON", true);
        combat.animHelper.DrawCrops();
        return true;
    },
    healAction: function() {
        if(this.selectedCrops.length == 0) { Sounds.PlaySound("navNok"); return false; }
        if(this.compostFailureCheck()) { Sounds.PlaySound("navNok"); return false; }
        const res = dmgCalcs.CompostFunc(true, combat.season, player.atk, this.selectedCrops, false);
        let healAmount = res.total, thereAreCows = res.cows;

        const anim = new NotAnAnim(this.binx, this.biny, 1000, this.binSprite);
        anim.finish = function() {
            const shake = new ShakeAnim(combat.compost.binx, combat.compost.biny, 500, combat.compost.binSprite, 0.25, 20);
            shake.finish = function() {
                combat.animHelper.SetPlayerAnimState((res.cows || res.bees || res.coffee) ? "DRINK" : "EAT");
                if(res.coffee) { combat.animHelper.PushPlayerOverlay("COFFEE"); }
                else if(res.cows) { combat.animHelper.PushPlayerOverlay("MILK"); }
                else if(res.bees) { combat.animHelper.PushPlayerOverlay("HONEY"); }
                else {
                    Sounds.PlaySound("homf");
                    combat.animHelper.PushPlayerOverlay("COMPOST"); 
                }
            };
            combat.animHelper.AddAnim(shake);
            Sounds.PlaySound("compost");
        };
        combat.animHelper.AddAnim(anim);
        if(thereAreCows) {
            for(let i = combat.happyCows.length - 1; i >= 0; i--) {
                if(combat.happyCows[i].removeMe) { combat.happyCows.splice(i, 1); }
            }
            combat.animHelper.DrawBackground();
        }
        healAmount = Math.ceil(healAmount * this.compostMultiplier);
        player.health = Math.min(player.maxhealth, player.health + healAmount);
        game.innerTransition(this, combat.inbetween, {
            next: function() { combat.endTurn(combat.inbetween) },
            text: GetText("compost_heal").replace(/\{0\}/g, healAmount)
        });
        combat.animHelper.SetPlayerAnimState("WON", true);
        combat.animHelper.DrawCrops();
        Sounds.PlaySound("pluck");
        return true;
    },
    attackAction: function() {
        if(this.selectedCrops.length == 0) { Sounds.PlaySound("navNok"); return false; }
        if(this.compostFailureCheck()) { Sounds.PlaySound("navNok"); return false; }
        const res = dmgCalcs.CompostFunc(true, combat.season, player.atk, this.selectedCrops, true);
        let damage = res.total, thereAreCows = res.cows;
        const anim = new NotAnAnim(this.binx, this.biny, 1000, this.binSprite);
        anim.finish = function() {
            const shake = new ShakeAnim(combat.compost.binx, combat.compost.biny, 500, combat.compost.binSprite, 0.25, 20);
            shake.finish = function() {
                combat.animHelper.AddPlayerAttackAnim({ animset: "THROW_COMPOST" });
                combat.animHelper.StartPlayerAnimSequence();
            };
            combat.animHelper.AddAnim(shake);
            Sounds.PlaySound("compost");
        };
        combat.animHelper.AddAnim(anim);
        if(thereAreCows) {
            for(let i = combat.happyCows.length - 1; i >= 0; i--) {
                if(combat.happyCows[i].removeMe) { combat.happyCows.splice(i, 1); }
            }
            combat.animHelper.DrawBackground();
        }
        damage = Math.ceil(this.compostMultiplier * damage / 3.5);
        for(let i = combat.enemies.length - 1; i >= 0; i--) {
            combat.damageEnemy(i, damage);
        }
        game.innerTransition(this, combat.inbetween, {
            next: function() { combat.endTurn(combat.inbetween) },
            text: GetText("compost_attack").replace(/\{dmg\}/g, damage).replace(/\{amt\}/g, GetText(combat.enemies.length > 1 ? "cmpatk_pl" : "cmpatk_sing"))
        });
        combat.animHelper.DrawCrops();
        Sounds.PlaySound("pluck");
        return true;
    },
    click: function() {
        let pos = { x: this.cursor.x, y: this.cursor.y };
        if(this.backButtonSelected) {
            this.cancel();
        } else if(this.healButtonSelected) {
            return this.healAction();
        } else if(this.attackButtonSelected) {
            return this.attackAction();
        }
        if(pos.x < combat.dx || pos.x >= (combat.dx + player.gridWidth)) { return false; }
        if(pos.y < combat.dy || pos.y >= (combat.dy + player.gridHeight)) { return false; }
        let gridpos = { x: pos.x - combat.dx, y: pos.y - combat.dy };
        let tile = combat.grid[gridpos.x][gridpos.y];
        let cowIdx = -1,  cowPos = { x: pos.x, y: pos.y };
        if(tile === null) { // check for cows
            const possibleCow = player.itemGrid[gridpos.x][gridpos.y];
            if(possibleCow === null) { return false; }
            if(possibleCow.x !== undefined && player.itemGrid[possibleCow.x][possibleCow.y] === "_cow") {
                cowIdx = combat.getCowIndex(possibleCow.x, possibleCow.y);
                cowPos = { x: possibleCow.x + 1, y: possibleCow.y + 5 };
            } else if(possibleCow === "_cow") {
                cowIdx = combat.getCowIndex(gridpos.x, gridpos.y);
            }
            if(cowIdx < 0) { Sounds.PlaySound("navNok"); return false; }
        } else {
            if(tile.x !== undefined) { // tree
                gridpos = { x: tile.x, y: tile.y };
                tile = combat.grid[tile.x][tile.y];
            }
            if(!this.isCompostable(tile)) { Sounds.PlaySound("navNok"); return false; }
        }
        if(cowIdx < 0) { this.toggleCrop(gridpos); }
        else { this.toggleCrop({ x: cowPos.x, y: cowPos.y, cow: cowIdx }); }
        this.drawAll();
        return true;
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
            case player.controls.cancel: return this.cancel();
        }
        if(pos.y === (combat.dy + player.gridHeight) && pos.y > this.cursor.y) { // going from grid to Back button
            pos.y = this.dy;
            pos.x = 4;
        } else if(pos.y === (this.dy - 1) && this.cursor.y === this.dy) { // going from Back button to grid
            pos.y = combat.dy + player.gridHeight - 1;
            pos.x = combat.dx;
            pos.fromHeal = true;
        } else if(this.backButtonSelected) {
            if(pos.x > this.cursor.x) {
                pos.x = this.backButtonWidth;
            } else if(pos.x < this.cursor.x) {
                return false;
            }
        } else if(this.healButtonSelected) {
            if(pos.x < this.cursor.x) {
                pos.x = 4;
            } else if(pos.x > this.cursor.x) {
                pos.x = this.healButtonWidth;
            }
        } else if(this.attackButtonSelected) {
            if(pos.x < this.cursor.x) {
                pos.x = this.backButtonWidth;                
            } else if(pos.x > this.cursor.x) {
                return false;
            }
        }
        if(pos.y < 0 || pos.x < 0) { return false; }
        if(isEnter) { return this.click(); }
        else { return this.CursorMove(pos); }
    },
    WriteAboutCrop: function(crop) {
        gfx.drawMinibox(1, 0.5, 6, 1.5, "menutext", "FarmInfo");
        gfx.drawWrappedText(crop.displayname, 23, 22, 100);
        pausemenu.inventory.DrawCropPower(crop, 1.5, 1.5, "menutext");
    }
};
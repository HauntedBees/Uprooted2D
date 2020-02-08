const pausemenu = {
    options: [], dy: 0, cursorX: 0, cursorY: 0, updateIdx: -1, questItems: [], inNoFun: false,
    animIdx: 0, anims: [], lastPressWasQuit: false, 
    layersToClear: ["menuA", "menutext", "menutextOverBlack", "menuOverBlack"],
    setup: function(sel) {
        this.cursorY = sel || 0;
        if(this.cursorY !== 5) { player.justSaved = false; }
        this.cursorX = 0;
        this.inNoFun = false;
        this.lastPressWasQuit = false;
        this.cursors = new CursorAnimSet([
            { key: "main", x: this.cursorX, y: this.cursorY, w: 0, h: 0, type: "cursor", layer: "menucursorA" }
        ]);
        this.GetQuestItems();
        this.DrawAll();
        this.cursors.Start();
        gfx.TileBackground("invTile", 10);
        this.DrawFarm();
        this.animIdx = setInterval(this.Animate, 10);
        this.anims = [];
    },
    clean: function() {
        clearInterval(pausemenu.animIdx);
        player.justSaved = false;
        pausemenu.cursors.Perish();
        pausemenu.anims = [];
        gfx.clearAll();
    },
    GetQuestItems: function(p) {
        p = p || player;
        this.questItems = [];
        if(p.completedQuest("badEgg")) { this.questItems.push("bpermit0"); }
        if(p.hasQuestState("quest1", 4) || p.hasQuestState("quest1", 2)) { this.questItems.push("goldmushroom"); }
        if(p.hasQuestState("kelpBoy", "gotMilk")) { this.questItems.push("milk"); }
        if(p.hasQuestState("seamonkey", "looking")) { this.questItems.push("seamonkkey"); }
        if(p.hasQuestState("getHeart", "weirdheart") || p.hasQuestState("getHeart", "heart")) { this.questItems.push("monsterheart"); }
        else if(p.hasQuestState("helpSeaMonster", "gotEgg")) { this.questItems.push("monsteregg"); }
        if(p.hasQuest("truckRepair")) { this.questItems.push("tire"); }
        if(p.completedQuest("gotPhone")) { this.questItems.push("smartphone"); }
        if(p.hasQuestState("catmail", 1)) { this.questItems.push("bpermit1"); }
        if(p.completedQuest("keycard")) { this.questItems.push("food2keycard"); }
    },
    DrawAll: function() {
        gfx.clearSome(pausemenu.layersToClear);
        const rowYs = [10, 10.75];
        pausemenu.options = [];

        pausemenu.drawOption("menu.Items", 0, pausemenu.cursorY === 0 && !pausemenu.inNoFun);
        pausemenu.drawOption("menu.Equipment", 1, pausemenu.cursorY === 1);
        pausemenu.drawOption("menu.Farm", 2, pausemenu.cursorY === 2);
        pausemenu.drawOption("menu.Options", 3, pausemenu.cursorY === 3);
        pausemenu.drawOption("menu.Achievements", 4, pausemenu.cursorY === 4);
        pausemenu.drawOption("menu.Save", 5, pausemenu.cursorY === 5);
        pausemenu.drawOption("menu.Back", 6, pausemenu.cursorY === 6);
        pausemenu.drawOption("menu.Quit", 7, pausemenu.cursorY === 7);
        if(pausemenu.inNoFun) {
            gfx.drawRightOption(GetText("noFunInner"), 0);
        } else {
            gfx.drawRightOption(GetText("noFunPreview"), 0);
        }

        pausemenu.addFormattedText("menu.level", player.level, 1, rowYs[0], "", 0);
        pausemenu.addFormattedText("menu.HP", player.health + "/" + player.maxhealth, 3.5, rowYs[0], ":", 0);
        pausemenu.addFormattedText("menu.ATK", player.atk, 8.5, rowYs[0], ":", 2);
        pausemenu.addFormattedText("menu.DEF", player.def, 11.5, rowYs[0], ":", 2);

        pausemenu.addFormattedText("menu.coins", player.monies, 1, rowYs[1], ":", 4);
        pausemenu.addFormattedText("menu.nextLevel", (player.level === 50 ? "-/-" : (player.exp + "/" + player.nextExp)), 6.75, rowYs[1], ":", 0);

        if(pausemenu.inNoFun) {
            const myText = GetText("noFunInner");
            screenReaderHelper.SayThing(myText, "option");
            const textWidth = gfx.getTextWidth(myText) / (16 * gfx.scale);
            this.cursors.RedimCursor("main", gfx.tileWidth - textWidth - 0.5, 0, textWidth - 0.5, 0);
        } else if(pausemenu.cursorY < pausemenu.options.length) {
            this.cursors.RedimCursor("main", 0, pausemenu.dy + pausemenu.cursorY, pausemenu.options[pausemenu.cursorY], 0);
        } else {
            if(pausemenu.cursorX === 0) {
                this.cursors.RedimCursor("main", 2, 11.75, 1, 1);
                const str = GetText("alignment") + ": " + GetText(player.techAxis <= 0 ? "alignnature" : "aligntech") + " " + GetText(player.ethicsAxis >= 0 ? "aligngood" : "alignbad");
                gfx.drawInfoText(str + " ", 0, 10.75);
                screenReaderHelper.SayThing(str, "pauseInfo");
            } else {
                const idx = pausemenu.cursorX - 1;
                const item = pausemenu.questItems[idx];
                this.cursors.RedimCursor("main", 5 + (idx * 1.5), 11.75, 0, 0);
                const myText = GetText("qi." + item);
                gfx.drawInfoText(myText, 5 + (idx * 1.5), 10.75);
                screenReaderHelper.SayThing(myText, "pauseInfo");
            }
        }

        gfx.drawTileToGrid("alignment", 2, 11.75, "foreground");
        let centerx = 0.75, centery = 0.75;
        centerx += Math.round(4 * player.ethicsAxis / 5) / 4; centery += Math.round(4 * player.techAxis / 5) / 4;
        gfx.drawTileToGrid("alignmentcursor", 2 + centerx, 11.75 + centery, "foreground");

        for(let i = 0; i < pausemenu.questItems.length; i++) {
            gfx.drawTileToGrid(pausemenu.questItems[i], 5 + (i * 1.5), 11.75, "foreground");
        }
    },
    DrawInnerHeading: function(textKey) {
        for(let x = 0; x < gfx.tileWidth; x++) { gfx.drawTileToGrid("infoD", x, 0, "menuA"); }
        const headingText = GetText(textKey);
        const headingX = gfx.getTextRightAlignedX(headingText, 22, gfx.canvasWidth) / gfx.scale - 5;
        gfx.drawText(headingText, headingX, 9);
    },
    Animate: function() {
        gfx.clearLayer("background2");
        if(pausemenu.anims.length < 3 && Math.random() < 0.005) {
            const dir = Math.random() < 0.5 ? 1 : -1;
            const newAnim = {
                type: `${Math.random() < 0.5 ? "butterfly" : "bee"}${dir < 0 ? "L" : "RR"}`,
                x: dir < 0 ? 17 : -1, starty: Range(2, 4), animState: 0, dir: dir, i: 0, 
                a: FloatRange(-1.5, 1.5), b: FloatRange(0, 2), c: FloatRange(-4, 4), speed: FloatRange(0.125, 0.375)
            };
            pausemenu.anims.push(newAnim);
        }
        for(let i = pausemenu.anims.length - 1; i >= 0; i--) {
            const a = pausemenu.anims[i];
            a.i++;
            if(a.i % 12 === 0) {
                a.x += a.speed * a.dir;
                a.y = a.starty + a.a * Math.sin(a.b * a.x + a.c);
            }
            gfx.drawTileToGrid(`${a.type}${a.animState}`, a.x, a.y, "background2");
            if(a.i % 8 === 0) {
                a.animState = a.animState === 1 ? 0 : 1;
            }
            if((a.dir < 0 && a.x < 0) || (a.dir > 0 && a.x > 17)) {
                pausemenu.anims.splice(i, 1);
            }
        }
    },
    DrawFarm: function() {
        const helper = new CombatAnimHelper([]);
        const mid_x = 10, mid_y = 7.5;
        const min_x = mid_x - player.gridWidth / 2, max_x = mid_x + player.gridWidth / 2;
        const adjusted_y = Math.floor(player.gridHeight * 0.75);
        const min_y = mid_y - adjusted_y / 2, max_y = mid_y + adjusted_y / 2;
        gfx.drawMinibox(-1, 10, gfx.tileWidth + 2, 5, "background");
        for(let x = 0; x < gfx.tileWidth; x++) {
            gfx.drawTileToGrid("grassTop", x, 4, "background");
            for(let y = 5; y < 10; y++) {
                gfx.drawTileToGrid("grass", x, y, "background");
            }
        }

        helper.DrawWrapper(min_x + 0.25, min_y, player.gridWidth, max_y - min_y);
        for(let x = min_x; x < max_x; x++) {
            for(let y = min_y; y < max_y; y++) {
                gfx.drawTileToGrid("dirt", x + 0.25, y, "background");
            }
        }
        const randomCrops = ["ginger0", "ginger1", "ginger2", "ginger3", "spinach0", "spinach1", "tomato0", "tomato1", "garlic0", "garlic1", "garlic2", "carrot0", "carrot1", "bellpepper0", "bellpepper1", "bellpepper2", "corn0", "corn1", "corn2", "leek0", "leek1", "leek2", "asparagus0", "asparagus1", "asparagus2", "asparagus3", "beet0", "beet1", "pineapple0", "pineapple1", "pineapple2", "pineapple3", "radish0", "radish1", "rhubarb0", "rhubarb1", "rhubarb2", "rhubarb3"];
        if(player.itemGrid !== null) {
            for(let y = 0; y < player.gridHeight; y++) {
                for(let x = 0; x < player.gridWidth; x++) {
                    if(player.itemGrid[x][y] === null || player.itemGrid[x][y].coord) { continue; }
                    if(player.itemGrid[x][y] === "_strongsoil") {
                        gfx.drawTileToGrid("_strongsoil", min_x + x + 0.25, min_y + y * 0.6, "background");
                    } else if(player.itemGrid[x][y] === "_lake") {
                        pausemenu.farmmod.DrawWaterFrame(x, y, min_x + x + 0.25, min_y + y * 0.6, "background");
                    } else if(player.itemGrid[x][y] === "_paddy") {
                        gfx.drawTileToGrid("_paddy", min_x + x + 0.25, min_y + y * 0.6, "background");
                    }
                }
            }
            for(let y = 0; y < player.gridHeight; y++) {
                for(let x = 0; x < player.gridWidth; x++) {
                    if(player.itemGrid[x][y] === null || player.itemGrid[x][y] === "_strongsoil") {
                        if(Math.random() > 0.15 || (player.itemGrid[x][y] !== null && player.itemGrid[x][y].coord)) { continue; }
                        const randomCrop = RandomArrayItem(randomCrops);
                        gfx.drawTileToGrid(randomCrop, min_x + x + 0.25, min_y + y * 0.75 - 0.75, "characters");
                        continue;
                    }
                    if(player.itemGrid[x][y].coord || player.itemGrid[x][y] === "_lake" || player.itemGrid[x][y] === "_paddy") { continue; }
                    const item = GetFarmInfo(player.itemGrid[x][y]);
                    if(item.size === 2) {
                        gfx.drawTileToGrid(item.displaySprite === "hotspot" ? "hotspotsquat" : item.displaySprite, min_x + x + 0.25, min_y + y * 0.75 - 0.9, "characters");
                    } else {
                        gfx.drawTileToGrid(item.name, min_x + x + 0.25, min_y + y * 0.75 - 0.75, "characters");
                    }
                }
            }
        } else {
            for(let y = 0; y < player.gridHeight; y++) {
                for(let x = 0; x < player.gridWidth; x++) {
                    if(player.itemGrid == null || player.itemGrid[x][y] === null || player.itemGrid[x][y] === "_strongsoil") {
                        if(Math.random() > 0.15) { continue; }
                        const randomCrop = RandomArrayItem(randomCrops);
                        gfx.drawTileToGrid(randomCrop, min_x + x + 0.25, min_y + y * 0.75 - 0.75, "characters");
                    }
                }
            }
        }
        if(player.hasFalcon) {
            gfx.DrawMapCharacter(4, 0, { x: 4.25, y: 6.5 }, { x: 0, y: 0 }, "mapChar", false, "characters");
        }
        gfx.DrawCombatWhatsit("combatPlayer", 5, 6, { w: 32, h: 30, x: 3.5, y: 8.5 }, "characters", 0, 0);
    },
    addText: (t, x, y) => gfx.drawText(t, 2 + x * 16, 10.5 + y * 16),
    addFormattedText: function(key, num, x, y, middle, spaceNum) {
        let str = GetText(key);
        if(middle) { str += middle; }
        if(spaceNum > 0) {
            const len = ("" + num).length;
            let dx = spaceNum - len;
            while(dx-- > 0) { str += " "; }  
        }
        str += num;
        pausemenu.addText(str, x, y);
    },
    cancel: function() {
        Sounds.PlaySound("pauseO", true);
        game.transition(this, worldmap, {
            init: worldmap.pos,
            map: worldmap.mapName,
            noEntityUpdate: true
        });
    },
    CursorMove: function(pos) {
        if(pos.x === this.cursorX && pos.y === this.cursorY) { return false; }
        if(pos.x === 1 && pos.y === 0 && this.cursorY === 0) {
            if(!this.inNoFun) { Sounds.PlaySound("menuMove"); }
            this.inNoFun = true;
        } else {
            if(this.inNoFun) { pos.x = 0; }
            this.inNoFun = false;
            if(pos.y > this.options.length) { return false; }
            if(pos.y < this.options.length && pos.x > 0) { return false; }
            if(pos.x > this.questItems.length) { return false; }
            Sounds.PlaySound("menuMove");
        }
        this.lastPressWasQuit = false;
        this.cursorY = pos.y;
        this.cursorX = pos.x;
        this.DrawAll();
        return true;
    },
    mouseMove: function(pos) {
        if(pos.x >= 9 && pos.y <= 1) { // the "I'm Not Having Fun" menu
            this.cursorX = 0; this.cursorY = 0;
            return this.CursorMove({ x: 1, y: 0 });
        }
        if(pos.y < this.options.length && pos.x < 5) {
            return this.CursorMove({x: 0, y: Math.min(Math.round(pos.y - 0.25), this.options.length - 1)});
        }
        if(pos.y < 11.75 || pos.x < 2) { return false; }
        if(pos.x < 3.75) { return this.CursorMove({x: 0, y: this.options.length}); }
        if(pos.x < 5) { return false; }
        return this.CursorMove({x: Math.floor((pos.x - 5) / 1.5 + 1), y: this.options.length});
    },
    click: function(mousePos) {
        if(this.BeepHour(mousePos)) { return true; }
        const cursorPos = { x: this.cursorX, y: this.cursorY };
        if(cursorPos.x > 0) {
            if(this.inNoFun) { game.innerTransition(this, pausemenu.noFun); Sounds.PlaySound("confirm"); return true; }
            else {
                const item = pausemenu.questItems[pausemenu.cursorX - 1];
                Sounds.PlaySound("confirm");
                pausemenu.ShowInfo("qi." + item + "Info");
                return false;
            }
        }
        switch(cursorPos.y) {
            case 0: game.innerTransition(this, pausemenu.inventory); break;
            case 1: game.innerTransition(this, pausemenu.equipment); break;
            case 2: game.innerTransition(this, pausemenu.farmmod); break;
            case 3: game.innerTransition(this, worldmap.optionsMenu, true); break;
            case 4: game.innerTransition(this, pausemenu.chievos); break;
            case 5: game.innerTransition(this, pausemenu.savemenu, { saving: true }); break;
            case 6: this.cancel(); break;
            case 7: this.TryQuit(); break;
            default:
                Sounds.PlaySound("confirm");
                this.ShowInfo("info" + (player.ethicsAxis >= 0 ? "Good" : "Bad") + (player.techAxis <= 0 ? "Nature" : "Tech"));
                return false;
        }
        if(cursorPos.y !== 6) { Sounds.PlaySound("confirm"); }
        return true;
    },
    ShowInfo: function(key) { 
        gfx.drawInfobox(17, 2.25, 8, "menuA");
        gfx.drawWrappedText(GetText(key), 5, 140, 250);
    },
    TryQuit: function() {
        if(player.justSaved || this.lastPressWasQuit) {
            localStorage.setItem("quit", "true");
            location.reload();
            return;
        }
        this.lastPressWasQuit = true;
        gfx.drawInfobox(17, 1.75, 8, "menuA");
        gfx.drawWrappedText(GetText("quitConfirm"), 5, 140, 250);
    },
    BeepHour: function(pos) {
        if(pos === undefined) { return false; }
        const hasBees = this.anims.some(e => (e.type === "beeL" || e.type === "beeRR") && Math.abs(e.x - pos.x) <= 1.25 && Math.abs(e.y - pos.y) <= 1.25);
        if(hasBees) {
            Sounds.PlaySound("aBee");
            return true;
        }
        return false;
    },
    keyPress: function(key) {
        const pos = { x: this.cursorX, y: this.cursorY };
        let isEnter = false;
        switch(key) {
            case player.controls.right: pos.x++; break;
            case player.controls.left: pos.x--; break;
            case player.controls.up: pos.y--; pos.x = 0; break;
            case player.controls.down: pos.y++; break;
            case player.controls.confirm: isEnter = true; break;
            case player.controls.pause: 
            case player.controls.cancel: return this.cancel();
        }
        if(pos.y < 0 || pos.x < 0) { return false; }
        if(isEnter) {
            return this.click();
        } else {
            return this.CursorMove(pos);
        }
    },
    drawOption: function (text, y, selected) {
        const realText = GetText(text);
        if(selected) { screenReaderHelper.SayThing(realText, "option"); }
        this.options.push(gfx.drawOption(realText, this.dy + y, selected));
    }
};
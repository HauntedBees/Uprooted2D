const pausemenu = {
    options: [], dy: 0, cursorX: 0, cursorY: 0, updateIdx: -1, questItems: [],
    animIdx: 0, anims: [],
    layersToClear: ["menuA", "menutext", "menutextOverBlack", "menuOverBlack"],
    setup: function(sel) {
        this.cursorY = sel || 0;
        this.cursorX = 0;
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
        pausemenu.cursors.Perish();
        pausemenu.anims = [];
        gfx.clearAll();
    },
    GetQuestItems: function(p) {
        p = p || player;
        this.questItems = [];
        if(p.hasQuestState("    ", 4) || p.hasQuestState("quest1", 2)) { this.questItems.push("goldmushroom"); }
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
        pausemenu.drawOption("menu.Items", 0, pausemenu.cursorY == 0);
        pausemenu.drawOption("menu.Equipment", 1, pausemenu.cursorY == 1);
        pausemenu.drawOption("menu.Farm", 2, pausemenu.cursorY == 2);
        pausemenu.drawOption("menu.Options", 3, pausemenu.cursorY == 3);
        pausemenu.drawOption("menu.Achievements", 4, pausemenu.cursorY == 4);
        pausemenu.drawOption("menu.Save", 5, pausemenu.cursorY == 5);
        pausemenu.drawOption("menu.Quit", 6, pausemenu.cursorY == 6);
        
        pausemenu.addFormattedText("menu.level", player.level, 1, rowYs[0], "", 0);
        pausemenu.addFormattedText("menu.HP", player.health + "/" + player.maxhealth, 3.5, rowYs[0], ":", 0);
        pausemenu.addFormattedText("menu.ATK", player.atk, 8.5, rowYs[0], ":", 2);
        pausemenu.addFormattedText("menu.DEF", player.def, 11.5, rowYs[0], ":", 2);

        pausemenu.addFormattedText("menu.coins", player.monies, 1, rowYs[1], ":", 4);
        pausemenu.addFormattedText("menu.nextLevel", (player.level === 50 ? "-/-" : (player.exp + "/" + player.nextExp)), 6.75, rowYs[1], ":", 0);

        if(pausemenu.cursorY < pausemenu.options.length) {
            this.cursors.RedimCursor("main", 0, pausemenu.dy + pausemenu.cursorY, pausemenu.options[pausemenu.cursorY], 0);
        } else {
            if(pausemenu.cursorX === 0) {
                this.cursors.RedimCursor("main", 2, 11.75, 1, 1);
                const str = GetText("alignment") + ": " + GetText(player.techAxis <= 0 ? "alignnature" : "aligntech") + " " + GetText(player.ethicsAxis >= 0 ? "aligngood" : "alignbad");
                gfx.drawInfoText(str, 0, 10.75);
            } else {
                const idx = pausemenu.cursorX - 1;
                const item = pausemenu.questItems[idx];
                this.cursors.RedimCursor("main", 5 + (idx * 1.5), 11.75, 0, 0);
                gfx.drawInfoText(GetText("qi." + item), 5 + (idx * 1.5), 10.75);
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
                type: `${Math.random() < 0.5 ? "butterfly" : "bee"}${dir < 0 ? "L" : "R"}`,
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
                    if(player.itemGrid[x][y].coord || player.itemGrid[x][y] === "_lake") { continue; }
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
        game.transition(this, worldmap, {
            init: worldmap.pos,
            map: worldmap.mapName,
            noEntityUpdate: true
        });
    },
    mouseMove: function(pos) {
        if(pos.y > this.options.length) { return false; }
        if(pos.y < this.options.length && pos.x > 0) { pos.y = this.options.length; pos.x = 0; }
        if(pos.x > this.questItems.length) { return false; }
        this.cursorY = pos.y;
        this.cursorX = pos.x;
        this.DrawAll();
        return true;
    },
    click: function(pos) {
        if(pos.x > 0) { return false; }
        switch(pos.y) {
            case 0: game.innerTransition(this, pausemenu.inventory); break;
            case 1: game.innerTransition(this, pausemenu.equipment); break;
            case 2: game.innerTransition(this, pausemenu.farmmod); break;
            case 3: game.innerTransition(this, worldmap.optionsMenu, true); break;
            case 4: game.innerTransition(this, pausemenu.chievos); break;
            case 5: game.innerTransition(this, pausemenu.savemenu, { saving: true }); break;
            case 6: console.log("quit!"); break;
            default: return false;
        }
        return true;
    },
    keyPress: function(key) {
        var pos = { x: this.cursorX, y: this.cursorY };
        var isEnter = false;
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
            return this.click(pos);
        } else {
            return this.mouseMove(pos);
        }
    },
    drawOption: function (text, y, selected) { this.options.push(gfx.drawOption(GetText(text), this.dy + y, selected)); }
};
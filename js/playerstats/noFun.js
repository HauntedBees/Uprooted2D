pausemenu.noFun = {
    cursor: { x: 0, y: 0 }, state: 0, lastState: 0, maxY: 0, startY: 6.25, 
    backStartX: 0, backButtonW: 0, puzzle: 2, 
    layersToClear: ["menuA", "menutext", "tutorial", "menuOverBlack", "menutextOverBlack"],
    setup: function() {
        this.cursor = { x: 0, y: 0 };
        this.state = 0; this.lastState = -1; this.maxY = 3; this.startY = 6.25;
        this.SetPuzzle();
        this.cursors = new CursorAnimSet([
            { key: "main", x: this.cursor.x, y: this.cursor.y, w: 0, h: 0, type: "cursor", layer: "menucursorA" }
        ]);
        this.backStartX = 0.125;
        this.backButtonW = gfx.drawInfoText(GetText("menu.Back"), this.backStartX, -0.0625, false, "menuA", "menutext");
        gfx.TileBackground("invTile");
        this.DrawAll();
        this.cursors.Start();
    },
    SetPuzzle: function() {
        this.puzzle = 2;
        switch(worldmap.mapName) {
            case "forest": 
                if(player.completedQuest("quest1") || player.activeQuests["quest1"] === 2 || player.activeQuests["quest1"] === 4) {
                    this.puzzle = 24;
                } else {
                    this.puzzle = 21;
                }
                break;
            case "researchfacility": this.puzzle = 22; break;
            case "underwater": this.puzzle = 23; break;
            case "hq_1": this.puzzle = 25; break;
            case "hq_2": this.puzzle = 26; break;
            case "hq_3": this.puzzle = 27; break;
        }
    },
    SolvePuzzle: function() {
        switch(this.puzzle) {
            case 21: // forest TO MUSHROOM
                game.transition(this, worldmap, {
                    init: { x: 36, y: 26 },
                    map: "forest",
                    noEntityUpdate: true
                });
                break;
            case 22: // research lab
            case 25: // HQ 1
                for(let i = 0; i < worldmap.entities.length; i++) {
                    if(worldmap.entities[i].rfd) {
                        const newActive = true;
                        worldmap.entities[i].active = newActive;
                        SetUpFellow(worldmap.entities[i], "Door" + worldmap.entities[i].type + (newActive ? "d" : ""));
                        worldmap.entities[i].solid = !newActive;
                    }
                }
                break;
            case 23: // underwater
                for(let i = worldmap.entities.length - 1; i >= 0; i--) {
                    const e = worldmap.entities[i];
                    if(e.pushDir !== undefined && e.donePushing !== true) {
                        switch(e.pushDir) {
                            case 0: e.pos.y -= 1; break;
                            case 1: e.pos.x -= 1; break;
                            case 2: e.pos.y += 1; break;
                            case 3: e.pos.x += 1; break;
                        }
                        e.donePushing = true;
                    } else if(e.isWaterfall === true || e.isEnd === true) {
                        player.clearedEntities.push(worldmap.entities[i].name);
                        worldmap.entities.splice(i, 1);
                    }
                }
                break;
            case 24: // forest TO EXIT
                game.transition(this, worldmap, {
                    init: { x: 44, y: 49 },
                    map: "forest",
                    noEntityUpdate: true
                });
                break;
            case 26: // HQ 2
                game.transition(this, worldmap, {
                    init: { x: 23, y: 6 },
                    map: "hq_2",
                    noEntityUpdate: true
                });
                break;
            case 27: // HQ 3
                worldmap.horRor.playerRoom = 0;
                game.transition(this, worldmap, {
                    init: { x: 5.5, y: 4 },
                    map: "hq_3",
                    noEntityUpdate: true
                });
                break;
        }
    },
    DrawAll: function() {
        gfx.clearSome(this.layersToClear);
        pausemenu.DrawInnerHeading("noFun.Heading");
        gfx.drawInfoText(GetText("menu.Back"), this.backStartX, -0.0625, this.cursor.y === -1 && this.cursor.x === 0, "menuA", "menutext");
        if(this.cursor.y === -1) {
            this.cursors.RedimCursor("main", this.backStartX, 0, this.backButtonW, -0.25);
            gfx.drawWrappedText(GetText("inv.BackInfo"), 4, this.textStartY, 235);
        } else {
            this.cursors.RedimCursor("main", this.achStartX + this.cursor.x * this.achDX, this.achStartY + this.cursor.y * this.achDX, 0, 0);
        }
        gfx.DrawMapCharacter(3, 10, { x: 7.75, y: 3 }, { x: 0, y: 0 }, "mapChar", false, "menuA");
        this.DrawTextAndOptions(this.state);
    },

    NoFunOptions: {
        0: { text: "noFunStart", options: ["noFunBattle", "noFunPuzzle", "noFunSomething", "noFunNevermind"] }, // Main
        1: { text: "noFunBattleSel", startY: 5.5, options: ["noFunBattle0", "noFunBattle1", "noFunBattle2", "noFunBattle3", "noFunBattle4", "noFunNevermind"] }, // No Battles!
        11: { text: "noFunHardBattle", options: ["sYes", "sNo"] }, // Weaken Foes!
        12: { text: "noFunEasyBattle", options: ["sYes", "sNo"] }, // Strengthen Foes!
        13: { text: "noFunItemsSuck", options: ["sYes", "sNo"] }, // Item Me Up!
        14: { text: "noFunStatsSuck", options: ["sYes", "sNo"] }, // Stat Me Up!
        15: { text: "noFunDontGetBattles", options: ["sYes", "sNo"] }, // Tutorial Me Up!
        2: { text: "noFunPuzzleNone", options: ["noFunDone"] }, // No Puzzles!
        21: { text: "noFunPuzzleForest", startY: 8.5, options: ["sYes", "sNo"] }, // Forest
        24: { text: "noFunPuzzleForest2", startY: 8.5, options: ["sYes", "sNo"] }, // Forest2
        22: { text: "noFunPuzzleBlocks", startY: 8.5, options: ["sYes", "sNo"] }, // Block Puzzles
        25: { text: "noFunPuzzleBlocks", startY: 8.5, options: ["sYes", "sNo"] }, // Block Puzzles
        23: { text: "noFunPuzzleWater", startY: 8.5, options: ["sYes", "sNo"] }, // Water Puzzle
        26: { text: "noFunPuzzleHQ", startY: 8.5, options: ["sYes", "sNo"] }, // Travel Puzzles
        276: { text: "noFunPuzzleHQ", startY: 8.5, options: ["sYes", "sNo"] }, // Travel Puzzles
        3: { text: "noFunSomethingSel", startY: 5.5, options: ["noFunSomething0", "noFunSomething1", "noFunSomething2", "noFunSomething3", "noFunNevermind"] }, // Something Else!
        31: { text: "noFunDontGetIt", startY: 5.5, options: ["noFunTut0", "noFunTut1", "noFunNevermind"] }, // I Don't Get It!
        32: { text: "noFunBees", options: ["sYes", "sNo"] },  // I Want Some Le Fucking Bees!
        33: { text: "noFunNoFun", startY: 7.5, options: ["sYes"] }, // It's No Fun!
        // 34 is handled separately
        50: { text: "noFunComplete", options: ["noFunDone"] } // It has been done!
    },

    DrawTextAndOptions: function(state) {
        const readTitle = state !== this.lastState;
        this.lastState = state;

        if(state === 34) {
            gfx.drawMinibox(0.5, 4.5, 14, 8, "menuA", "FarmInfo");
            let summaryKey = "plotSummaryUhh";
            if(!player.completedQuest("openingCutscene")) {
                summaryKey = "plotSummary0";
            } else if(!player.completedQuest("bigBot")) {
                summaryKey = "plotSummary1";
            } else if(!player.completedQuest("nathanned")) {
                summaryKey = "plotSummary2";
            } else if(!player.completedQuest("researchLab")) {
                summaryKey = "plotSummary3";
            } else if(!player.completedQuest("findFakeFarm")) {
                summaryKey = "plotSummary4";
            } else if(!player.completedQuest("truckRepair")) {
                summaryKey = "plotSummary5";
            } else if(player.clearedEntities.indexOf("IntroSkumpyCutscene") < 0) {
                summaryKey = "plotSummary6";
            } else if(!player.completedQuest("gotPhone")) {
                summaryKey = "plotSummary7";
            } else if(!player.completedQuest("keycard")) {
                summaryKey = "plotSummary8";
            } else if(player.clearedEntities.indexOf("BeckettsReturn") < 0) {
                summaryKey = "plotSummary9";
            } else if(!player.completedQuest("theGame")) {
                summaryKey = "plotSummary10";
            } else {
                if(player.completedQuest("NG")) {
                    summaryKey = "plotSummaryNG";
                } else if(player.completedQuest("NV")) {
                    summaryKey = "plotSummaryNV";
                } else if(player.completedQuest("IG")) {
                    summaryKey = "plotSummaryIG";
                } else if(player.completedQuest("IV")) {
                    summaryKey = "plotSummaryIV";
                }
            }
            gfx.drawWrappedText(GetText(summaryKey), 20, 85, 220);
            gfx.drawInfoText(GetText("noFunDone"), 6.5, 12, true, "menuA", "menutext");
            screenReaderHelper.SayFresh(GetText(summaryKey) + " Current Selection: " + GetText("noFunDone"), "info");
        } else {
            const info = this.NoFunOptions[state];
            gfx.drawMinibox(0.5, 4.5, 14, 8, "menuA", "FarmInfo");
            gfx.drawWrappedText(GetText(info.text), 20, 85, 220);
            let text = readTitle ? (GetText(info.text) + ", Current Selection: ") : "";
            const startY = info.startY || 6.25;
            for(let i = 0; i < info.options.length; i++) {
                gfx.drawInfoText(GetText(info.options[i]), 4.5, startY + i, this.cursor.y === i, "menuA", "menutext");
                if(this.cursor.y === i) { text += GetText(info.options[i]); }
            }
            screenReaderHelper.SayFresh(text, "info");
        }
    },
    clean: function() {
        this.cursors.Perish();
        gfx.clearAll(true);
    },
    cancel: function(force) { 
        if(force || this.state === 0) {
            this.clean();
            game.innerTransition(this, pausemenu, 0);
        } else {
            this.cursor.y = this.maxY;
            this.click();
        }
        Sounds.PlaySound("cancel");
    },
    keyPress: function(key) {
        const pos = { x: this.cursor.x, y: this.cursor.y };
        let isEnter = false;
        switch(key) {
            case player.controls.up: pos.y--; break;
            case player.controls.down: pos.y++; break;
            case player.controls.confirm:
            case player.controls.pause: isEnter = true; break;
            case player.controls.cancel: return this.cancel();
        }
        if(isEnter) { return this.click(); }
        else if(this.state !== 33) { return this.CursorMove(pos); }
    },
    mouseMove: function(pos) {
        const newPos = { x: 0, y: Math.floor(pos.y - 6.25) };
        if(newPos.y > this.maxY) { newPos.y = this.maxY };
        console.log(newPos);
        this.CursorMove(newPos);
    },
    CursorMove: function(pos) {
        if(this.state === 33) { return false; } 
        if(pos.y > this.maxY || pos.y < -1) { return false; }
        if(this.cursor.y === pos.y) { return false; }
        Sounds.PlaySound("menuMove");
        this.cursor = { x: 0, y: pos.y };
        this.DrawAll();
        return true;
    },
    click: function() {
        if(this.cursor.y === -1) { return this.cancel(); }
        switch(this.state) {
            case 0:
                if(this.cursor.y === 0) { this.state = 1; this.maxY = 5; Sounds.PlaySound("confirm"); } // Battles
                else if(this.cursor.y === 1) { this.state = this.puzzle; this.maxY = this.puzzle === 2 ? 0 : 1; Sounds.PlaySound("confirm"); } // Puzzles
                else if(this.cursor.y === 2) { this.state = 3; this.maxY = 4; Sounds.PlaySound("confirm"); } // Other
                else if(this.cursor.y === 3) { return this.cancel(); } // Nevermind
                break;
            case 1:
                if(this.cursor.y === 0) { this.state = 11; this.maxY = 2; Sounds.PlaySound("confirm"); } // Too Hard
                else if(this.cursor.y === 1) { this.state = 12; this.maxY = 2; Sounds.PlaySound("confirm"); } // Too Easy
                else if(this.cursor.y === 2) { this.state = 13; this.maxY = 2; Sounds.PlaySound("confirm"); } // Items Suck
                else if(this.cursor.y === 3) { this.state = 14; this.maxY = 2; Sounds.PlaySound("confirm"); } // Low Stats
                else if(this.cursor.y === 4) { this.state = 15; this.maxY = 2; Sounds.PlaySound("confirm"); } // I Don't Get It
                else if(this.cursor.y === 5) { this.state = 0; this.maxY = 3; Sounds.PlaySound("cancel"); } // Nevermind
                break;
            case 11: 
                if(this.cursor.y === 0) { player.noFunDiffMod--; this.state = 50; this.maxY = 0; Sounds.PlaySound("confirm"); } // Go Easy On Me!
                else if(this.cursor.y === 1) { this.state = 1; this.maxY = 5; Sounds.PlaySound("cancel"); } // No Thanks
                break;
            case 12: 
                if(this.cursor.y === 0) { player.noFunDiffMod++; this.state = 50; this.maxY = 0; Sounds.PlaySound("confirm"); } // Give Me A Hard-On!
                else if(this.cursor.y === 1) { this.state = 1; this.maxY = 5; Sounds.PlaySound("cancel"); } // No Thanks
                break;
            case 13: 
                if(this.cursor.y === 0) { // Give Me Good Shit!
                    debug.ThrustSomeCropsUntoMineLoins();
                    debug.AllWeapons();
                    debug.AllFixtures();
                    this.state = 50;
                    this.maxY = 0;
                    Sounds.PlaySound("confirm");
                } else if(this.cursor.y === 1) { this.state = 1; this.maxY = 5; Sounds.PlaySound("cancel"); } // No Thanks
                break;
            case 14: 
                if(this.cursor.y === 0) { // Flavor-Boost Me!
                    player.levelUp();
                    player.levelUp();
                    player.levelUp();
                    this.state = 50;
                    this.maxY = 0;
                    Sounds.PlaySound("confirm");
                } else if(this.cursor.y === 1) { this.state = 1; this.maxY = 5; Sounds.PlaySound("cancel"); } // No Thanks
                break;
            case 15: 
                if(this.cursor.y === 0) { // Toot-oriole Me!
                    this.clean();
                    game.target = { name: "Bort" };
                    Sounds.PlaySound("confirm", true);
                    tutorial.startBattle();
                    return;
                } else if(this.cursor.y === 1) { this.state = 1; this.maxY = 5; Sounds.PlaySound("cancel"); } // No Thanks
                break;
            case 21: // forest
            case 22: // research lab
            case 23: // underwater
            case 24: // fake farm
            case 25: // hq 1
            case 26: // hq 2
            case 27: // hq 3
                if(this.cursor.y === 0) { this.SolvePuzzle(); this.state = 50; this.maxY = 0;  Sounds.PlaySound("confirm"); } // Do It!
                else if(this.cursor.y === 1) { this.state = 0; this.maxY = 3; Sounds.PlaySound("cancel"); } // Nevermind
                break;
            case 3:
                if(this.cursor.y === 0) { this.state = 31; this.maxY = 2; Sounds.PlaySound("confirm"); } // How Play?
                else if(this.cursor.y === 1) { this.state = 32; this.maxY = 1; Sounds.PlaySound("confirm"); } // Bees!
                else if(this.cursor.y === 2) { this.state = 33; this.maxY = 0; Sounds.PlaySound("confirm"); } // No Fun
                else if(this.cursor.y === 3) { this.state = 34; this.maxY = 0; Sounds.PlaySound("confirm"); } // Story
                else if(this.cursor.y === 4) { this.state = 0; this.maxY = 3; Sounds.PlaySound("cancel"); } // Nevermind
                break;
            case 31: 
                if(this.cursor.y === 0) {  // Battle Tutorial!
                    this.clean();
                    game.target = { name: "Bort" };
                    Sounds.PlaySound("confirm", true);
                    tutorial.startBattle();
                    return;
                } else if(this.cursor.y === 1) { // Fixture Tutorial!
                    player.increaseItem("_coop", 1);
                    this.clean();
                    game.innerTransition(this, pausemenu, 0);
                    fixTut.start(true);
                    Sounds.PlaySound("confirm", true);
                    return;
                } else if(this.cursor.y === 2) { this.state = 3; this.maxY = 4; Sounds.PlaySound("cancel"); } // No Thanks
                break;
            case 32: 
                if(this.cursor.y === 0) { // Bee Me Up, Scotty!
                    player.increaseItem("beeR", 5);
                    player.increaseItem("beeG", 5);
                    player.increaseItem("beeB", 5);
                    if(Math.random() < 0.1) { player.increaseItem("hbee"); }
                    player.increaseItem("_beehive");
                    this.state = 50;
                    this.maxY = 0;
                    Sounds.PlaySound("confirm");
                } else if(this.cursor.y === 1) { this.state = 3; this.maxY = 4; Sounds.PlaySound("cancel"); } // No Thanks
                break;
            case 33: Sounds.PlaySound("confirm", true); return game.transition(this, tobyTern);
            case 2:
            case 34: 
            case 50: this.state = 0; this.maxY = 3; Sounds.PlaySound("cancel"); break;
        }
        this.cursor.y = 0;
        this.DrawAll();
        return true;
    }
};
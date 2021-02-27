pausemenu.recap = {
    setup: function() {
        gfx.TileBackground("invTile");
        this.DrawAll();
    },
    DrawAll: function() {
        pausemenu.DrawInnerHeading("recap.Heading");
        gfx.DrawMapCharacter(3, 10, { x: 7.75, y: 1.5 }, { x: 0, y: 0 }, "mapChar", false, "menuA");
        gfx.drawMinibox(0.5, 2.5, 14, 10, "menuA", "FarmInfo");
        let summaryKey = "Uhh";
        if(!player.completedQuest("openingCutscene")) {
            summaryKey = "0";
        } else if(!player.completedQuest("bigBot")) {
            summaryKey = "1";
        } else if(!player.completedQuest("nathanned")) {
            summaryKey = "2";
        } else if(!player.completedQuest("researchLab")) {
            summaryKey = "3";
        } else if(!player.completedQuest("findFakeFarm")) {
            summaryKey = "4";
        } else if(!player.completedQuest("truckRepair")) {
            summaryKey = "5";
        } else if(player.clearedEntities.indexOf("IntroSkumpyCutscene") < 0) {
            summaryKey = "6";
        } else if(!player.completedQuest("gotPhone")) {
            summaryKey = "7";
        } else if(!player.completedQuest("keycard")) {
            summaryKey = "8";
        } else if(player.clearedEntities.indexOf("BeckettsReturn") < 0) {
            summaryKey = "9";
        } else if(!player.completedQuest("theGame")) {
            summaryKey = "10";
        } else if(player.completedQuest("NG")) {
            summaryKey = "NG";
        } else if(player.completedQuest("NV")) {
            summaryKey = "NV";
        } else if(player.completedQuest("IG")) {
            summaryKey = "IG";
        } else if(player.completedQuest("IV")) {
            summaryKey = "IV";
        }
        gfx.drawWrappedText(GetText("recap.Info") + " " + GetText("plotSummary" + summaryKey) + " " + GetText("recap.Info2"), 20, 55, 220);
    },
    clean: function() { gfx.clearAll(true); },
    keyPress: function(key) {
        switch(key) {
            case player.controls.confirm:
            case player.controls.cancel: 
            case player.controls.pause: return this.click();
        }
    },
    mouseMove: function(pos) { },
    click: function() {
        game.transition(game.currentInputHandler, worldmap, { 
            init: player.mapPos,
            map: player.mapName,
            playerDir: player.mapDir,
            fromLoad: true
        });
    }
};
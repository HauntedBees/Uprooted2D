worldmap.credits = {
    layersToClear: ["menutext", "menucursorA"],
    creditsStr: "", timer: 0, dy: 0, 
    setup: function() {
        this.creditsStr = GetText("cr0");
        this.creditsStr += " \n  \n " + GetText("cr.gd");
        this.creditsStr += " \n " + GetText("cr.sf");
        this.creditsStr += " \n  \n " + GetText("cr.p");
        this.creditsStr += " \n " + GetText("cr.sf");
        this.creditsStr += " \n  \n " + GetText("cr.sw");
        this.creditsStr += " \n " + GetText("cr.sf");
        this.creditsStr += " \n " + GetText("cr.sj");
        this.creditsStr += " \n  \n " + GetText("cr.g");
        this.creditsStr += " \n " + GetText("cr.sf");
        this.creditsStr += " \n  \n " + GetText("cr.m");
        this.creditsStr += " \n " + GetText("cr.sf");
        this.creditsStr += " \n  \n " + GetText("cr.qa");
        this.creditsStr += " \n " + GetText("cr.sf");
        this.creditsStr += " \n " + GetText("cr.sj");
        this.creditsStr += " \n " + GetText("cr.so");
        this.creditsStr += " \n " + GetText("cr.km");
        this.creditsStr += " \n  \n " + GetText("cr.spec");
        this.creditsStr += " \n " + GetText("cr.sj");
        this.creditsStr += " \n " + GetText("cr.bw");
        this.creditsStr += " \n " + GetText("cr.mr");
        this.creditsStr += " \n " + GetText("cr.tr");
        this.creditsStr += " \n " + GetText("cr.mkla");
        this.creditsStr += " \n " + GetText("cr.you");
        this.creditsStr += " \n  \n  \n " + GetText("cr.copy");
        this.timer = setInterval(this.update, 10);
        this.dy = 0;
        gfx.ctx["menutext"].textAlign = "center";
    },
    update: function() {
        gfx.clearSome(worldmap.credits.layersToClear);
        gfx.drawWrappedText(worldmap.credits.creditsStr, 125, 150 - worldmap.credits.dy, 350);
        worldmap.credits.dy += 0.2;
        if(worldmap.credits.dy > 450) { clearInterval(worldmap.credits.timer); worldmap.credits.finish(); }
    },
    clean: function() { gfx.ctx["menutext"].textAlign = "left"; clearInterval(this.timer); gfx.clearAll(); },
    click: function() { this.finish(); return true; },
    finish: function() {
        let map = "northcity";
        if(player.hasAchievement("natureGood")) { map = "northcity_NG"; }
        else if(player.hasAchievement("natureBad")) { map = "northcity_NB"; }
        else if(player.hasAchievement("techGood")) { map = "northcity_IG"; }
        else if(player.hasAchievement("techBad")) { map = "northcity_IB"; }
        game.transition(this, worldmap, { init: { x: 39, y: 10 }, map: map });
        SpecialFunctions["DESTROYBUILDING"]();
    },
    keyPress: function(key) {
        switch(key) {
            case player.controls.confirm:
            case player.controls.pause: 
            case player.controls.cancel: return this.click();
        }
        return null;
    }
};
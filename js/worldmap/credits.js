worldmap.credits = {
    layersToClear: ["menutext", "menucursorA", "menuOverBlack", "menutextOverBlack"],
    creditsStr: "", timer: 0, dy: 0, finalTime: 0, stillCounting: true,
    mouthOpen: false, mouthCounter: 0, delta: 0.15, 
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
        this.mouthCounter = 0;
        this.mouthOpen = false;
        this.dy = 0;
        this.stillCounting = true;
        const secondsUntilCreditsEnd = Math.round(485 / (this.delta * 100));
        this.finalTime = player.getPlayTimeString(player.playTime + secondsUntilCreditsEnd);
        gfx.ctx["menutext"].textAlign = "center";
        gfx.drawFullImage("endcredits", "background");
    },
    update: function() {
        gfx.clearSome(worldmap.credits.layersToClear);
        if(worldmap.credits.dy > 485) {
            gfx.drawFullImage("upnext", "menuOverBlack");
            gfx.drawText(GetText("crEnd4"), 5, 10, "#000000", 26, "menutextOverBlack");
            gfx.drawText(worldmap.credits.finalTime + "/" + worldmap.credits.finalTime, 55, 218, "#A5A5A5", 26, "menutextOverBlack");
        } else {
            gfx.drawFullImage("endcreditscover", "menuOverBlack");
            gfx.drawWrappedText(worldmap.credits.creditsStr, 194, 200 - worldmap.credits.dy, 126);
            const now = player.getPlayTimeString();
            if(worldmap.credits.stillCounting && now === worldmap.credits.finalTime) {
                worldmap.credits.stillCounting = false;
            }
            if(++worldmap.credits.mouthCounter > 20) {
                worldmap.credits.mouthCounter = 0;
                worldmap.credits.mouthOpen = !worldmap.credits.mouthOpen;
            }
            if(worldmap.credits.mouthOpen) {
                gfx.drawFullImage("endcreditsmouth", "menucursorA");
            }
            let choice = "crEnd1";
            if(worldmap.credits.dy > 360) { choice = "crEnd3"; }
            else if(worldmap.credits.dy > 180) { choice = "crEnd2"; }
            const str = GetText(choice), width = 210;
            const info = gfx.getWrappedTextInfo(str, width);
            gfx.DrawBlackRect(18, 178, width + 10, info.height + 10, "menuOverBlack");
            gfx.ctx["menutextOverBlack"].textAlign = "center";
            gfx.drawWrappedText(str, 23 + width / 2, 185, width, "#FFFFFF", "menutextOverBlack");
            gfx.ctx["menutextOverBlack"].textAlign = "left";
            gfx.drawText((worldmap.credits.stillCounting ? now : worldmap.credits.finalTime) + "/" + worldmap.credits.finalTime, 55, 218, "#A5A5A5", 26, "menutextOverBlack");
        }
        worldmap.credits.dy += worldmap.credits.delta;
        if(worldmap.credits.dy > 785) { clearInterval(worldmap.credits.timer); worldmap.credits.finish(); }
    },
    clean: function() { gfx.ctx["menutext"].textAlign = "left"; gfx.ctx["menutextOverBlack"].textAlign = "left"; clearInterval(this.timer); gfx.clearAll(); },
    click: function() { this.finish(); return true; },
    finish: function() { game.transition(this, worldmap, { init: { x: 39, y: 10 }, map: GetPostGameMapName("northcity") }); },
    keyPress: function(key) {
        switch(key) {
            case player.controls.confirm:
            case player.controls.pause: 
            case player.controls.cancel: return this.click();
        }
        return null;
    },
    mouseMove: function() { }
};
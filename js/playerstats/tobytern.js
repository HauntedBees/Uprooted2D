const tobyTern = {
    onTitleScreen: true, peckTimer: 0, tricks: [], lastAdd: 0, score: 0,  
    setup: function() {
        gfx.drawFullImage("tobytern", "menuA");
        screenReaderHelper.SayFresh("Toby Tern's Pro Pigeon - Epic Edition. Press the Start!", "info");
    },
    keyPress: function(key) {
        if(key !== player.controls.confirm && key !== player.controls.pause) { return false; }
        if(this.onTitleScreen) {
            gfx.clearLayer("menuA");
            gfx.FragmentMap("southcity");
            gfx.drawMap("southcity", 35, 23);
            gfx.DrawMapCharacter(17, 13, { x: 8.5, y: 6 }, { x: 0, y: 0 }, "mapChar", false, "characters");
            setInterval(this.AnimTimer, 50);
            this.onTitleScreen = false;
        } else {
            clearTimeout(this.peckTimer);
            gfx.clearLayer("characters");
            gfx.DrawMapCharacter(17, 14, { x: 8.5, y: 6 }, { x: 0, y: 0 }, "mapChar", false, "characters");
            this.peckTimer = setTimeout(this.PeckTimer, 100);
            if(Math.random() < 0.25 && this.lastAdd <= 0) {
                const trickName = "pigeonTrick" + Math.floor(Math.random() * 15);
                const trickText = GetText(trickName, 12);
                this.lastAdd = 4;
                this.tricks.push({ y: gfx.tileHeight - 0.5, trick: trickText });
                this.score += parseInt(trickText.split("+")[1]) || 0;
                screenReaderHelper.SayFresh(trickText, "info");
            } else { this.score++; }
        }
    },
    PeckTimer: function() {
        gfx.clearLayer("characters");
        gfx.DrawMapCharacter(17, 13, { x: 8.5, y: 6 }, { x: 0, y: 0 }, "mapChar", false, "characters");
    },
    AnimTimer: function() {
        gfx.clearLayer("menuA")
        gfx.clearLayer("menutext")
        tobyTern.lastAdd--;
        gfx.ctx["menutext"].textAlign = "right";
        gfx.drawText(GetText("pigeonScore") + " " + tobyTern.score, gfx.tileWidth * 16 - 5, 10);
        gfx.ctx["menutext"].textAlign = "left";
        for(let i = tobyTern.tricks.length - 1; i >= 0; i--) {
            const trick = tobyTern.tricks[i];
            gfx.drawOption(trick.trick, trick.y);
            trick.y -= 0.125;
            if(trick.y < -1) { tobyTern.tricks.splice(i, 1); }
        }
    },
    mouseMove: function() { },
    click: function() { return this.keyPress(player.controls.confirm); }
};
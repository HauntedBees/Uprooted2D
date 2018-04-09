let opening = {
    state: 0, animIdx: 0, 
    setup: function() {
        gfx.drawFullImage("title/logo");
        gfx.drawFullImage("title/lcover0", "background2");
        gfx.drawFullImage("title/lcover1", "characters");
        gfx.drawFullImage("title/lcover2", "foreground");
        gfx.drawFullImage("title/lcover3", "smartphone");
        opening.state = 0;
        opening.animIdx = setInterval(opening.Animate, 10);
    },
    Animate: function() {
        opening.state++;
        switch(opening.state) {
            case 330: gfx.drawFullImage("title/lcover0", "background2"); opening.click(); break;
            case 320: gfx.drawFullImage("title/lcover1", "characters"); break;
            case 310: gfx.drawFullImage("title/lcover2", "foreground"); break;
            case 300: gfx.drawFullImage("title/lcover3", "smartphone"); break;
            case 90: gfx.clearLayer("smartphone"); Sounds.PlaySound("aBee"); break;
            case 80: gfx.clearLayer("foreground"); break;
            case 70: gfx.clearLayer("characters"); break;
            case 60: gfx.clearLayer("background2"); break;
        }
    },
    click: function() { game.transition(opening, worldmap.title); },
    clean: function() { clearInterval(opening.animIdx); gfx.clearAll(); },
    keyPress: function(key) { if(key === player.controls.pause || key === player.controls.confirm) { opening.click(); } }
};
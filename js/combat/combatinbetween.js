combat.inbetween = {
    next: null, dy: 9.5, 
    setup: function(args) {
        this.next = args.next;
        gfx.drawFullbox(this.dy);
        gfx.drawFullText(args.text, this.dy * 16);
        combat.animHelper.DrawBottom();
    },
    clean: function() { gfx.clearSome(["menuA", "menuB", "menucursorA", "menucursorB", "menutext"]); },
    mouseMove: function(pos) { return true; },
    click: function(pos) { if(game.transitioning) { return false; } this.next(); return true; },
    keyPress: function(key) { if(key == player.controls.pause || key == player.controls.confirm) { return this.click(null); } return true; }
};
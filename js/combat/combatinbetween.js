combat.inbetween = {
    next: null, dy: 7, 
    setup: function(args) {
        this.next = args.next;
        gfx.drawFullbox(this.dy);
        gfx.drawFullText(args.text, this.dy * 16);
        combat.drawBottom();
    },
    clean: function() { gfx.clearSome(["menuA", "menuB", "menucursorA", "menucursorB", "menutext"]); },
    mouseMove: function(pos) { return true; },
    click: function(pos) { combat.clearAnimsAndRemoveCorpses(); this.next(); return true; },
    keyPress: function(key) { if(key == "Enter" || key == " ") { return this.click(null); } return true; }
};
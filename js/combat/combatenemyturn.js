combat.enemyTurn = {
    dy: 7, 
    setup: function(enemy) {
        gfx.drawPlayer(0, 0, 4, 5.75, "menuA");
        gfx.drawFullbox(this.dy);
        gfx.drawFullText(this.doAttack(enemy), this.dy * 16);
        combat.drawBottom();
    },
    doAttack: function(enemy) {
        var idx = Math.floor(Math.random() * enemy.attacks.length);
        return enemyAttacks[enemy.attacks[idx]](enemy);
    },
    clean: function() { gfx.clearSome(["menuA", "menutext"]); },
    click: function(pos) { combat.endTurn(this); return true; },
    keyPress: function(key) { if(key == "Enter" || key == " ") { return this.click(null); }  return true; },
    mouseMove: function(pos) { return true; }
};
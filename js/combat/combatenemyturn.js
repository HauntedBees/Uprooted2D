combat.enemyTurn = {
    dy: 7, 
    setup: function(args) {
        var enemy = args.enemy;
        combat.setPlayerAnim();
        gfx.drawFullbox(this.dy);
        var attackData = this.doAttack(enemy);
        combat.setAnim(args.idx, attackData.animData, GetFrameRate(attackData.animFPS));
        gfx.drawFullText(attackData.text, this.dy * 16);
        combat.drawBottom();
    },
    doAttack: function(enemy) {
        var idx = Math.floor(Math.random() * enemy.attacks.length);
        return enemyAttacks[enemy.attacks[idx]](enemy);
    },
    clean: function() { gfx.clearSome(["menuA", "menutext"]); },
    click: function(pos) { combat.clearAnimsAndRemoveCorpses(); combat.endTurn(this); return true; },
    keyPress: function(key) { if(key == "Enter" || key == " ") { return this.click(null); }  return true; },
    mouseMove: function(pos) { return true; }
};
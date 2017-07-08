combat.enemyTurn = {
    dy: 7, 
    setup: function(args) {
        var enemy = args.enemy;
        combat.setPlayerAnim();
        gfx.drawFullbox(this.dy);
        var attackData = this.doAttack(enemy);
        combat.setAnim(args.idx, attackData.animData, GetFrameRate(attackData.animFPS), attackData.throwables);
        gfx.drawFullText(attackData.text, this.dy * 16);
        combat.drawBottom();
    },
    doAttack: function(enemy) {
        var rand = Math.random();
        var attack = null;
        if(enemy.attacks.length > 1) {
            for(var i = 0; i < enemy.attacks.length; i++) {
                if(rand <= enemy.attacks[i][1]) {
                    attack = enemy.attacks[i][0];
                    break;
                }
            }
        } else {
            attack = enemy.attacks[0];
        }
        return enemyAttacks[attack](enemy);
    },
    clean: function() { gfx.clearSome(["menuA", "menutext"]); },
    click: function(pos) { combat.clearAnimsAndRemoveCorpses(); combat.endTurn(this); return true; },
    keyPress: function(key) { if(key == "Enter" || key == " ") { return this.click(null); }  return true; },
    mouseMove: function(pos) { return true; }
};
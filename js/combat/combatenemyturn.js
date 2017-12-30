combat.enemyTurn = {
    dy: 7, 
    setup: function(args) {
        var enemy = args.enemy;
        combat.animHelper.SetPlayerAnimInfo();
        gfx.drawFullbox(this.dy);
        var attackData = EnemyParser.Parse(enemy);
        combat.animHelper.SetEnemyAnimInfo(args.idx, attackData.animData, GetFrameRate(attackData.animFPS), attackData.throwables);
        gfx.drawFullText(attackData.text, this.dy * 16);
        combat.animHelper.DrawBottom();
    },
    clean: function() { gfx.clearSome(["menuA", "menutext"]); },
    click: function(pos) { combat.endTurn(this); return true; },
    keyPress: function(key) { if(key == player.controls.pause || key == player.controls.confirm) { return this.click(null); }  return true; },
    mouseMove: function(pos) { return true; }
};
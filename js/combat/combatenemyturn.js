combat.enemyTurn = {
    dy: 7, lastIdx: -1,
    setup: function(args) {
        var enemy = args.enemy;
        combat.animHelper.SetPlayerAnimInfo();
        combat.animHelper.SetBirdAnimInfo();
        gfx.drawFullbox(this.dy);
        if(enemy.stickTurns > 0) {
            var text = GetText("stuckTurn").replace(/\{0\}/g, enemy.name);
            gfx.drawFullText(text, this.dy * 16);
            combat.animHelper.DrawBottom();
            return;
        }
        var attackData = EnemyParser.Parse(enemy);
        if(attackData.attackAgain && this.lastIdx != args.idx) { combat.state--; }
        this.lastIdx = args.idx;
        if(attackData.skip) {
            combat.endTurn(this);
            return;
        }
        if(attackData.throwables !== undefined && attackData.throwables.length > 0) {
            for(var i = 0; i < attackData.throwables.length; i++) {
                var x = attackData.throwables[i][1];
                var y = attackData.throwables[i][2];
                combat.enemyGrid[x][y].flagged = true;
            }
        }
        combat.animHelper.SetEnemyAnimInfo(args.idx, attackData.animData, GetFrameRate(attackData.animFPS), attackData.throwables);
        gfx.drawFullText(attackData.text, this.dy * 16);
        combat.animHelper.DrawBottom();
    },
    clean: function() { gfx.clearSome(["menuA", "menutext"]); },
    click: function(pos) { combat.endTurn(this); return true; },
    keyPress: function(key) { if(key == player.controls.pause || key == player.controls.confirm) { return this.click(null); }  return true; },
    mouseMove: function(pos) { return true; }
};
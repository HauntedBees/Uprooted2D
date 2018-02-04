combat.enemyTurn = {
    dy: 9.5, lastIdx: -1,
    setup: function(args) {
        var enemy = args.enemy;
        combat.animHelper.ResetPlayerAnimState();
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
        
        var newAnimData = attackData.animData.length > 2 ? "ATTACK" : "PLANT"; // TODO: this is a fucking PLACEHOLDER
        combat.animHelper.SetEnemyAnimState(args.idx, newAnimData);

        if(attackData.throwables !== undefined && attackData.throwables !== null && attackData.throwables.length > 0) {
            for(var i = 0; i < attackData.throwables.length; i++) {
                var x = attackData.throwables[i][1], y = attackData.throwables[i][2];
                combat.animHelper.AddEnemyAttackAnim(args.idx, new CropAttackAnim("_ENEMY", combat.enemyGrid, x, y)); // todo: type shudnt just be _ENEMY
                combat.enemyGrid[x][y].flagged = true;
                combat.animHelper.StartEnemyAnimSequence(args.idx);
            }
        }
        gfx.drawFullText(attackData.text, this.dy * 16);
        combat.animHelper.DrawBottom();
    },
    clean: function() { gfx.clearSome(["menuA", "menutext"]); },
    click: function(pos) { combat.endTurn(this); return true; },
    keyPress: function(key) { if(key == player.controls.pause || key == player.controls.confirm) { return this.click(null); }  return true; },
    mouseMove: function(pos) { return true; }
};
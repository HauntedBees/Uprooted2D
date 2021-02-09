combat.enemyTurn = {
    dy: 10.5, lastIdx: -1,
    setup: function(args) {
        combat.cursors.RedimCursor("main", -1, -1, 0, 0);
        const enemy = args.enemy;
        combat.animHelper.ResetPlayerAnimState();
        combat.animHelper.ResetBirdAnimState();
        gfx.drawFullbox(this.dy);
        const epos = combat.animHelper.GetEnemyTopPos(args.idx);
        combat.animHelper.AddAnim(new SheetAnim(epos.x, epos.y, 700, "pointer", 6, true));
        if(enemy.stickTurns > 0) {
            const text = GetText("stuckTurn").replace(/\{0\}/g, enemy.name);
            gfx.drawFullText(text, this.dy * 16);
            return;
        }
        const attackData = EnemyParser.Parse(enemy);
        if(attackData.attackAgain && this.lastIdx != args.idx) { combat.state--; }
        this.lastIdx = args.idx;
        if(attackData.skip) {
            combat.endTurn(this);
            return;
        }
        combat.animHelper.SetEnemyAnimState(args.idx, attackData.animData);
        combat.animHelper.SetEnemyAnimArg(args.idx, "targets", attackData.targets);
        if(attackData.bonusArgs !== undefined) {
            for(const key in attackData.bonusArgs) {
                combat.animHelper.SetEnemyAnimArg(args.idx, key, attackData.bonusArgs[key]);
            }
        }
        if(attackData.throwables !== undefined && attackData.throwables !== null && attackData.throwables.length > 0) {
            for(let i = 0; i < attackData.throwables.length; i++) {
                const x = attackData.throwables[i][1], y = attackData.throwables[i][2];
                combat.animHelper.AddEnemyAttackAnim(args.idx, new CropAttackAnim("_ENEMY", combat.enemyGrid, x, y, undefined, attackData.animData));
                combat.enemyGrid[x][y].flagged = true;
                combat.animHelper.StartEnemyAnimSequence(args.idx);
            }
        }
        if(enemy.id === "negayana") { attackData.text = attackData.text.replace(/his/g, "her"); } // my bad bruh
        gfx.drawFullText(attackData.text, this.dy * 16);
    },
    clean: () => gfx.clearSome(["menuA", "menutext"]),
    click: function(pos) { combat.endTurn(this); return true; },
    keyPress: function(key) { if(key == player.controls.pause || key == player.controls.confirm) { return this.click(null); }  return true; },
    mouseMove: pos => true
};
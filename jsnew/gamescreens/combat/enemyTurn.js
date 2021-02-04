class CombatEnemyTurn extends CombatSubscreen {
    /**
     * @param {CombatScreen} combat
     * @param {CombatEnemy} enemy
     * @param {number} enemyIdx
     */
    constructor(combat, enemy, enemyIdx) {
        super(combat);
        const player = game2.player;
        combat.playerAnim.SetAnim("STAND");
        if(player.hasFalcon) { combat.falconAnim.SetAnim("STAND"); }

        let dispText = "";
        // add cursor over enemy
        if(enemy.stickTurns > 0) {
            dispText = GetText("stuckTurn").replace(/\{0\}/g, enemy.name);
        } else {
            const parser = new EnemyActionParser(combat, enemy);
            const attackData = parser.outputData;
            // if(res.attackAgain && this.lastIdx != enemyIdx) { combat.state--; } // TODO
            if(attackData.skip) {
                this.combat.EndTurn(); // TODO: is this going to work in a constructor? probably not
            } else {
                combat.enemyAnims[enemyIdx].SetAnim(attackData.animData);
                //combat.animHelper.SetEnemyAnimArg(args.idx, "targets", attackData.targets);.SetEnemyAnimArg(args.idx, "targets", attackData.targets);
                /*if(attackData.bonusArgs !== undefined) {
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
                if(enemy.id === "negayana") { attackData.text = attackData.text.replace(/his/g, "her"); } // my bad bruh */
                dispText = attackData.text;
            }
        }
        const menuContainers = [
            gfx2.DrawBox("FarmInfo", 0, gfx2.tileH - 4, gfx2.tileW - 1, 3, true),
            gfx2.WriteWrappedText(dispText, "std", 0, 0, gfx2.width, "left")
        ];
        this.SetMenuContainer(menuContainers);
    }
}
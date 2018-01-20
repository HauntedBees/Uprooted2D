var combatInitFuncs = {
    "NERND": function() {
        var x = combat.enemywidth - 1;
        for(var y = 1; y < combat.enemyheight; y++) {
            combat.enemyGrid[x][y] = GetCrop("conveyorEnd");
        }
    }
};
var combatEndTurnFuncs = {
    "NERND": function() {
        for(var y = 1; y < combat.enemyheight; y++) {
            if(combat.enemyGrid[0][y] !== null) { continue; }
            for(var x = 0; x < combat.enemywidth - 2; x++) {
                combat.enemyGrid[x][y] = combat.enemyGrid[x + 1][y];
            }
            if(combat.enemyGrid[combat.enemywidth - 1][y] === null) {
                combat.enemyGrid[combat.enemywidth - 2][y] = null;
            } else {
                var crops = ["food2orig", "food2orig", "food2orig", "food2classic", "food2classic", "food2classic", "food2kelp", "food2kelp", "food2coffee", "food2coffee", "food2salsa", "food2salsa", "food2gamer", "food2gamer", "food2gamer", "food2cookie", "food2cookie", "food2black", "food2black", "food2purple", "food2purple", "food2crystal"];
                var crop = crops[Math.floor(Math.random() * crops.length)];
                var newCrop = GetCrop(crop);
                newCrop.activeTime = newCrop.time;
                combat.enemyGrid[combat.enemywidth - 2][y] = newCrop;
            }
        }
    },
    "CONVINCE": function() {
        if(combat.enemies.length < 1 || combat.enemies[0].convinceState < 5) { return; }
        combat.enemies[0] = GetEnemy("discuss2big");
        combat.animHelper.ResetEnemyAnimHelper(combat.enemies);
    }
};
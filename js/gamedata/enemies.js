function EnemyDetail(name, health, atk, def, fieldheight, fieldwidth, spriteidx, boss, seasonDistribution, attacks, drops) {
    this.name = name;
    this.health = health;
    this.atk = atk;
    this.def = def;
    this.fieldheight = fieldheight;
    this.fieldwidth = fieldwidth;
    this.spriteidx = spriteidx;
    this.seasonDistribution = seasonDistribution;
    this.attacks = attacks;
    this.exp = Math.ceil(health/10 + atk + def/2 + attacks.length*2);
    this.drops = drops;
    this.boss = boss;
}
function GetEnemy(name) {
    switch(name) {
        case "Beckett": return new EnemyDetail(name, 10, 1, 1, 3, 2, 0, true, [0, 0, 1, 0], ["babySlap"], [
            { money: true, min: 10, max: 10 },
            { seed: "carrot", min: 2, max: 2 }
        ]);
        case "chode": return new EnemyDetail(name, 1, 1, 1, 3, 2, 1, true, [0, 0, 1, 0], ["dumbbattery"], [
            { money: true, min: 10, max: 10 },
            { seed: "carrot", min: 2, max: 2 }
        ]);
        case "dave": return new EnemyDetail(name, 10, 1, 1, 3, 1, 2, false, [0, 1, 0, 0], ["cry"], [{ money: true, min: 5, max: 10 }]);
        case "robo": return new EnemyDetail(name, 8, 2, 1, 3, 2, 3, false, [0, 0, 1, 0], ["dumbbattery"], [
            { money: true, min: 0, max: 5 },
            { seed: "carrot", min: -1, max: 1 }
        ]);
        case "bigBot":
            var bot = new EnemyDetail(name, 60, 5, 2, 3, 3, 0, true, [0, 0, 1, 0], ["dumbbattery"], [
                { money: true, min: 20, max: 50 },
                { seed: "carrot", min: 8, max: 10 },
                { seed: "beet", min: 8, max: 10 },
                { seed: "pineapple", min: 2, max: 3 },
                { seed: "grapes", min: 2, max: 3 },
                { seed: "ginger", min: 4, max: 6 }
            ]);
            bot.isBig = true;
            return bot;
    }
}
var enemyAttacks = {
    app: function(e) {
        return {
            text: e.name + " is distracted by a hot new App.",
            animFPS: 4, animData: [ [0, 2], [0, 3] ]
        };
    },
    //cry: function(e) { return Capitalize(e.name) + " shat themselves and cried for like 20 minutes." },
    babySlap: function(e) {
        combat.damagePlayer(1);
        return {
            text: e.name + " slaps for 1 damage.",
            animFPS: 4, animData: [ [0, 2], [0, 3] ]
        };
    },
    dumbbattery: function(e) {
        var dmg = 0;
        var hasCrops = 0;
        for(var x = 0; x < combat.enemyGrid.length; x++) {
            for(var y = 0; y < combat.enemyGrid[0].length; y++) {
                var tile = combat.enemyGrid[x][y];
                if(tile === null || tile.x !== undefined) { continue; }
                if(tile.activeTime > 0 || tile.rotten) { continue; }
                dmg += tile.power;
                hasCrops = true;
            }
        }
        dmg += dmg == 0 ? (e.atk / 1.5) : e.atk;
        dmg = Math.max(1, Math.round(dmg - player.def));
        if(!hasCrops) { // no fresh crops
            if(Math.random() < 0.2) { return enemyAttacks.cry(e); }
            var pos = {x: -1, y: -1};
            var newCrop = GetCrop("battery");
            newCrop.activeTime = newCrop.time;
            combat.enemyGrid[pos.x][pos.y] = newCrop;
            combat.drawCrops();
            combat.drawBottom();
            return {
                text: e.name + " started charging a battery.",
                animFPS: 4, animData: [ [0, 2], [0, 3] ]
            };
        } else {
            combat.damagePlayer(dmg);
            combat.removeFreshEnemyCrops();
            return {
                text: e.name + " attacks for " + dmg + " damage.",
                animFPS: 8, animData: [ [0, 2], [0, 3] ]
            };
        }
    }
    /*dumbbattery: function(e) {
        var dmg = 0;
        var hasCrops = 0;
        for(var x = 0; x < combat.enemyGrid.length; x++) {
            for(var y = 0; y < combat.enemyGrid[0].length; y++) {
                var tile = combat.enemyGrid[x][y];
                if(tile === null || tile.x !== undefined) { continue; }
                if(tile.activeTime > 0 || tile.rotten) { continue; }
                dmg += tile.power;
                hasCrops = true;
            }
        }
        dmg += dmg == 0 ? (e.atk / 1.5) : e.atk;
        dmg = Math.max(1, Math.round(dmg - player.def));
        if(!hasCrops) { // no fresh crops
            if(Math.random() < 0.2) { return enemyAttacks.cry(e); }
            var doAttack = false;
            var pos = {x: -1, y: -1};
            var attempts = 5;
            if(Math.random() > 0.75) {
                doAttack = true;
            } else {
                while(attempts-- >= 0 && pos.x < 0) {
                    var x = Math.floor(Math.random() * combat.enemyGrid.length);
                    var y = Math.floor(Math.random() * combat.enemyGrid[0].length);
                    if(combat.enemyGrid[x][y] === null) {
                        pos = { x: x, y: y };
                    }
                }
                if(pos.x < 0) { doAttack = true; }
            }
            if(doAttack) {
                combat.damagePlayer(dmg);
                return Capitalize(e.name) + " slaps weakly for " + e.atk + " damage";
            } else {
                var newCrop = GetCrop("battery");
                newCrop.activeTime = newCrop.time;
                combat.enemyGrid[pos.x][pos.y] = newCrop;
                combat.drawCrops();
                combat.drawBottom();
                return {
                    text: e.name + " started charging a battery.",
                    animFPS: 4, animData: [ [0, 2], [0, 3] ]
                };
            }
        } else {
            combat.damagePlayer(dmg);
            combat.removeFreshEnemyCrops();
            return Capitalize(e.name) + " attacks for " + dmg + " damage";
        }
    }*/
};
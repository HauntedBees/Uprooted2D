function GetSleep(time) {
    return function() {
        worldmap.waitForAnimation = true;
        worldmap.animIdx = setTimeout(FinishAnim, time);
    };
}
function GetBasicPlayerFrame(sx, sy, time) {
    return function() {
        worldmap.waitForAnimation = true;
        worldmap.forcedPlayerInfo = worldmap.animData.forceFrame(worldmap.pos, sx, sy);
        worldmap.refreshMap();
        worldmap.animIdx = setTimeout(FinishAnim, time);
    };
}
function FinishAnim() {
    worldmap.forceMove = false;
    worldmap.forcedPlayerInfo = false;
    worldmap.refreshMap();
    worldmap.finishAnimation();
}
function SwitchMap(name, x, y, row, column, newx, newy, map) {
    return {
        name: name, solid: false, pos: {x: x, y: y}, isColumn: column, isRow: row,
        interact: [ function() { game.transition(game.currentInputHandler, worldmap, { init: { x: newx,  y: newy }, map: map }); } ]
    }
};
function SwitchMapSeamless(name, x, y, requiredDir, newx, newy) {
    return {
        name: name, solid: false, pos: {x: x, y: y}, seamlessMap: true, 
        interact: [ function() {
            if(worldmap.playerDir !== requiredDir) { console.log("y"); return true; }
            console.log(name);
            var dx = worldmap.pos.x - x, dy = worldmap.pos.y - y;
            switch(requiredDir) {
                case 0: dy += 4; break;
                case 2: dy -= 0.25; break;
            }
            worldmap.pos = { x: newx + dx, y: newy + dy };
            //game.transition(game.currentInputHandler, worldmap, { init: { x: newx + dx,  y: newy + dy }, map: map });
        } ]
    }
};
function EnterShop(name, x, y, shop) {
    return { 
        name: name, 
        solid: false, pos: {x: x, y: y}, 
        interact: [ function() { game.transition(game.currentInputHandler, worldmap.shop, shop); return true; } ]
    };
};
function GetInvisibleEntity(name, interact, additional) {
    var res = { name: name, pos: {x: -1, y: -1}, solid: false, interact: interact };
    return Object.assign(res, additional);
};
function GetSign(x, y, text) { return { name: "Sign", pos: {x: x, y: y}, solid: true, visible: false, interact: [ GetSpeak(text) ] }; };
function GetCommonInvisibleSpeakingEntity(name, x, y, textKey) { return GetCommonEntity(name, x, y, 0, 0, undefined, [ GetSpeak(textKey) ], {visible: false}); };
function GetBeehive(hiveId, x, y, beetype) {
    var interactArray = [];    
    if(!HasText(hiveId + "0")) {
        var interactArray = [
            function() {
                worldmap.writeText("hiveGet");
                player.increaseItem("_beehive");
                player.increaseItem((beetype || "beeB"), 5);
                game.target = worldmap.importantEntities[hiveId];
                worldmap.clearTarget();
            }
        ];
    } else {
        var interactArray = [
            function() {
                worldmap.writeText("hiveGet");
                player.increaseItem("_beehive");
                player.increaseItem((beetype || "beeB"), 5);
                game.target = worldmap.importantEntities[hiveId];
                game.target.visible = false;
            }
        ];
        if(["ForestHive"].indexOf(hiveId) < 0) {
            interactArray.push(function() {
                worldmap.writeText(hiveId + "0");
                game.target.visible = true;
                var xshift = 0;
                switch(worldmap.playerDir) {
                    case 0: xshift = 10; break;
                    case 1: xshift = 10; break;
                    case 2: xshift = 12; break;
                    case 3: xshift = 11; break;
                }
                game.target.anim.shiftX(xshift, 4).shiftY(0);
                worldmap.refreshMap();
            });
        } else {
            interactArray.push(GetSpeak(hiveId + "0"));
        }
        var i = 1;
        var skipEnd = false;
        while(HasText(hiveId + i)) {
            var speakie = GetText(hiveId + i);
            if(speakie.indexOf("!!FIGHT:") === 0) {
                speakie = speakie.replace("!!FIGHT:", "");
                interactArray.push(GetFight([speakie]));
                skipEnd = true;
                break;
            } else {
                interactArray.push(GetSpeak(hiveId + i));
                i++;
            }
        }
        if(!skipEnd) {
            interactArray.push(
                function() {
                    worldmap.writeText("beeGoodbye");
                    worldmap.clearTarget();
                }
            );
        }
    }
    return GetCommonEntity(hiveId, x, y, 2, 0, undefined, interactArray, { sy: 4, storageKey: hiveId });
};
function GetCommonEntity(name, x, y, firstx, dir, movement, interact, additional) {
    var big = (additional !== undefined && additional.big);
    var sheet = (additional !== undefined && additional.sheet !== undefined) ? additional.sheet : (big ? "mapcharbig" : "mapchar");
    var len = (additional !== undefined && additional.sheetlen !== undefined) ? additional.sheetlen : 4;
    var res = {
        name: name, visible: true, 
        pos: {x: x, y: y}, solid: true, 
        anim: new MapAnim(sheet, firstx, (additional === undefined ? 0 : (additional.sy || 0)), (big ? 32 : 16), (big ? 40 : 20), dir, len),
        moving: false,
        sx: firstx * (big ? 32 : 16), dir: dir,
        movement: movement, interact: interact
    };
    if(big) { res.anim.big = true; }
    return Object.assign(res, additional);
};
function GetSpeak(t, choices) { return function() { worldmap.writeText(t, choices); }  }
function GetFight(arr) { return function() { combat.startBattle(arr); } }

function CreateCommonInteractArray(name, dialogMax, enemies, min, max) {
    return [
        function() { worldmap.writeText(name + Math.floor(Math.random() * dialogMax)); },
        function() {
            var numEnemies = min + Math.floor(Math.random() * (max - min));
            var actualEnemies = [enemies[0]];
            while(--numEnemies > 0) { actualEnemies.push(enemies[Math.floor(Math.random() * enemies.length)]); }
            combat.startBattle(actualEnemies);
        }
    ];
};
var commonInteractArrays = {
    /*robo: [
        function() { worldmap.writeText("robo" + Math.floor(Math.random() * 5)); },
        function() { combat.startBattle(Math.random() < 0.2 ? ["robo", "robo"] : ["robo"]); }
    ],*/
    robo: CreateCommonInteractArray("robo", 5, ["robo"], 1, 2),
    mouse: CreateCommonInteractArray("mouse", 3, ["mouse"], 2, 4),
    sqorl: CreateCommonInteractArray("sqorl", 4, ["sqorl", "sqorl", "sqorl", "mouse"], 1, 3),
    turky: CreateCommonInteractArray("turky", 3, ["turky"], 1, 1),
    researchRobo: [
        function() { worldmap.writeText("research" + Math.floor(Math.random() * 5)); },
        function() {
            var enemies = ["robo2"];
            if(Math.random() < 0.2) { enemies.push("robo2"); }
            if(Math.random() < 0.1) { enemies.push("robo"); }
            if(Math.random() < 0.1) { enemies.push("robo"); }
            combat.startBattle(enemies);
        }
    ]
};
var commonMovementDatas = {
    robo: function(x, initState) { return { state: (initState || 0), speed: 0.025, loop: true, points: [ { x: x, y: 16, dx: 0, dy: 1 },  { x: x, y: 8, dx: 0, dy: -1 } ] } },
    rectangle: function(x, y, w, h, initState) { return { state: (initState || 0), speed: 0.025, loop: true, 
        points: [ { x: x + w, y: y, dx: 1, dy: 0 }, { x: x + w, y: y + h, dx: 0, dy: 1 }, { x: x, y: y + h, dx: -1, dy: 0 }, { x: x, y: y, dx: 0, dy: -1 } ] } }
};
function GetStdMovement(points) {
    var newPoints = [];
    for(var i = 0; i < points.length; i++) {
        var dir = points[i][2];
        var dx = 0; var dy = 0;
        switch(dir) {
            case 0: dy = -1; break;
            case 1: dx = -1; break;
            case 2: dy = 1; break;
            case 3: dx = 1; break;
        }
        newPoints.push({ x: points[i][0], y: points[i][1], dx: dx, dy: dy });
    }
    return { state: 0, speed: 0.025, loop: true, points: newPoints };
}
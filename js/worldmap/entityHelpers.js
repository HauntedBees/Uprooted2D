var specialtyHelpers = {
    storedLimeChoice: "",
    getLimeItems: function() {
        var items = [];
        if(player.hasItem("lemon")) { items.push("lime_lemon"); }
        if(player.hasItem("banana")) { items.push("lime_banana"); }
        if(player.hasItem("corn")) { items.push("lime_corn"); }
        if(player.hasItem("goldegg")) { items.push("lime_goldegg"); }
        if(items.length > 0) { items.push("lime_nope"); }
        return items;
    },
    storedRapChoice: "",
    getRapItems: function() {
        var items = [];
        if(player.hasItem("garlic")) { items.push("rap_garlic"); }
        if(player.hasItem("rice")) { items.push("rap_rice"); }
        if(player.hasItem("coconut")) { items.push("rap_coconut"); }
        if(items.length > 0) { items.push("lime_nope"); }
        return items;
    },
    storedDowelChoice: "",
    getDowelItems: function() {
        var items = [];
        if(player.hasItem("gmocorn")) { items.push("pirateMonkC5"); }
        if(player.hasItem("rice")) { items.push("rap_rice"); }
        if(player.hasItem("chestnut")) { items.push("pirateMonkC4"); }
        if(player.hasItem("shortgrain")) { items.push("pirateMonkC3"); }
        if(player.hasItem("blackrice")) { items.push("pirateMonkC2"); }
        if(player.hasItem("arborio")) { items.push("pirateMonkC1"); }
        if(items.length > 0) { items.push("lime_nope"); }
        return items;
    },
    storedCroutonChoice: "",
    getCroutonItems: function() {
        var items = [];
        if(player.hasItem("spear")) { items.push("arf_spear"); }
        if(player.hasItem("net")) { items.push("arf_net"); }
        if(player.hasItem("bignet")) { items.push("arf_bignet"); }
        if(player.hasItem("metalrod")) { items.push("arf_metalrod"); }
        if(player.hasItem("ultrarod")) { items.push("arf_ultrarod"); }
        if(items.length > 0) { items.push("lime_nope"); }
        return items;
    },
    seedShotArray: [
        function() {
            if(game.target.hasShot-- > 0) { worldmap.finishDialog(); return; }
            worldmap.writeText("seedshot");
            player.health -= 2;
            game.target.hasShot = 5;
            if(player.health > 0) { worldmap.forceEndDialog = true; return; }
        },
        GetSpeak("seedshotdeath"),
        function() {
            player.health = player.maxhealth;
            for(var i = 0; i < worldmap.entities.length; i++) {
                if(worldmap.entities[i].rfd) {
                    var newActive = worldmap.entities[i].initActive;
                    worldmap.entities[i].active = newActive;
                    worldmap.entities[i].anim.shiftY(newActive ? 3 : 2);
                    worldmap.entities[i].solid = !newActive;
                } else if(worldmap.entities[i].rf) {
                    var newActive = worldmap.entities[i].initActive;
                    worldmap.entities[i].active = newActive;
                    worldmap.entities[i].anim.shiftY(newActive ? 1 : 0);
                }
            }
            game.transition(game.currentInputHandler, worldmap, { init: { x: 7.5,  y: 19 }, map: "belowvillage" });
        }
    ],
    getTruckOptions: function() {
        var options = [];
        if(worldmap.mapName !== "producestand") { options.push("truck_home"); }
        for(var i = 0; i < player.questsCleared.length; i++) {
            switch(player.questsCleared[i]) {
                case "researchLab": if(worldmap.mapName !== "bridge") { options.push("truck_bridge"); } break;
                case "gotTire": if(worldmap.mapName !== "fakefarm") { options.push("truck_fake"); } break;
                case "helpSeaMonster": if(worldmap.mapName !== "outerCity") { options.push("truck_city"); } break;
            }
        }
        options.push("truck_nm");
        return options;
    },
    truckArray: [
        function() {
            var options = specialtyHelpers.getTruckOptions();
            if(options.length === 1) {
                worldmap.writeText("truck_none");
                worldmap.forceEndDialog = true;
                return;
            }
            worldmap.writeText("truck_where", options);
        },
        function(i) {
            var selOption = specialtyHelpers.getTruckOptions()[i];
            switch(selOption) {
                case "truck_fake": game.transition(game.currentInputHandler, worldmap, { init: { x: 24.75,  y: 35.5 }, map: "fakefarm" }); return;
                case "truck_home": game.transition(game.currentInputHandler, worldmap, { init: { x: 16,  y: 6 }, map: "producestand" }); return;
                case "truck_bridge": game.transition(game.currentInputHandler, worldmap, { init: { x: 27,  y: 5 }, map: "bridge" }); return;
                case "truck_city":
                    if(player.completedQuest("gotTire")) { // todo: make this the city
                        game.transition(game.currentInputHandler, worldmap, { init: { x: 27,  y: 5 }, map: "bridge" });
                    } else {
                        game.transition(game.currentInputHandler, worldmap, { init: { x: 24.75,  y: 35.5 }, playerDir: 0, map: "fakefarm", stayBlack: true });
                    }
                    break;
                default: worldmap.finishDialog(); return;
            }
        }
    ]
};
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
function ToggleRFDoors(type) {
    for(var i = 0; i < worldmap.entities.length; i++) {
        if(worldmap.entities[i].rfd && worldmap.entities[i].type === type) {
            var newActive = !worldmap.entities[i].active;
            worldmap.entities[i].active = newActive;
            worldmap.entities[i].anim.shiftY(newActive ? 3 : 2);
            worldmap.entities[i].solid = !newActive;
        }
    }
}
function GetRFDoorButton(name, x, y, type, isDown) {
    return GetCommonEntity(name, x, y, 15 + type, 0, undefined, [ function() { 
        game.target.active = !game.target.active;
        game.target.anim.shiftY(game.target.active ? 1 : 0);
        ToggleRFDoors(game.target.type);
        worldmap.finishDialog();
    } ], { sy: (isDown ? 1 : 0), active: isDown, initActive: isDown, type: type, noChange: true, rf: true });
}
function GetRFDoor(name, x, y, type, isDown) {
    return GetCommonEntity(name, x, y, 15 + type, 0, undefined, undefined, { sy: (isDown ? 3 : 2), active: isDown, initActive: isDown, type: type, solid: !isDown, rfd: true });
}
function GetTreasureChest(name, x, y, contents) {
    return GetCommonEntity(name, x, y, 13, 0, undefined, [function() {
        if(game.target.open) {
            worldmap.writeText("openchest");
        } else {
            game.target.open = true;
            game.target.anim.shiftY(5);
            var conts = game.target.contents;
            var clen = conts.length - 1;
            var contentString = "";
            if(clen === 0) {
                contentString = conts[0][1] + " " + GetItemDisplayName(conts[0][0], conts[0][1] > 1);
                player.increaseItem(conts[0][0], conts[0][1]);
            } else {
                for(var i = clen; i >= 0; i--) {
                    var itdata = conts[i]; // format = [itemname, amount]
                    if(i === 0) {
                        contentString += " and ";
                    } else if(i !== clen) {
                        contentString += ", ";
                    }
                    contentString += itdata[1] + " " + GetItemDisplayName(itdata[0], itdata[1] > 1);
                    player.increaseItem(itdata[0], itdata[1]);
                }
            }
            worldmap.writeText("closedchest", undefined, false, contentString);
        }
    }], { sy: 4, open: false, contents: contents, noChange: true });
}
function GetItemDisplayName(name, plural) {
    var pluralSuf = plural ? "s" : "";
    switch(name[0]) {
        case "_": return GetFarmInfo(name).displayname + pluralSuf; break;
        case "!": return GetEquipment(name).displayname + pluralSuf; break;
        default: 
            var cropInfo = GetCrop(name);
            var nam = cropInfo.displayname;
            if(["veg", "tree", "mush"].indexOf(cropInfo.type) >= 0) { nam += " Seed"; }
            return nam + pluralSuf;
            break;
    }
}
function AdvanceWaterfall() {
    for(var i = 0; i < worldmap.entities.length; i++) {
        var e = worldmap.entities[i];
        if(!e.solid && e.pos.x == Math.round(worldmap.pos.x) && e.pos.y == Math.round(worldmap.pos.y)) {
            game.target = e;
            if(game.target.isEnd) {
                ExitWaterfall();
                return;
            }
            break;
        }
    }
    var x = 0, y = 0;
    switch(game.target.dir) {
        case 0: y--; break;
        case 1: x--; break;
        case 2: y++; break;
        case 3: x++; break;
    }
    worldmap.pos.x += x / 4;
    worldmap.pos.y += y / 4;
    worldmap.playerDir = (worldmap.playerDir + 1) % 3;
    worldmap.refreshMap();
}
function EnterWaterfall() {
    worldmap.inWaterfall = true;
    worldmap.waterfallIdx = setInterval(AdvanceWaterfall, timers.FULLANIM * 4);
}
function ExitWaterfall() {
    clearInterval(worldmap.waterfallIdx);
    worldmap.finishDialog();
    worldmap.inWaterfall = false;
}
function PushRock() {
    if(game.target.donePushing) {
        worldmap.finishDialog();
        return;
    }
    if(worldmap.playerDir !== game.target.pushDir) {
        worldmap.writeText("rockwrong");
        return;
    }
    worldmap.animIdx = setInterval(function() {
        var success = false;
        switch(game.target.pushDir) {
            case 0: game.target.pos.y -= 0.025; success = game.target.pos.y <= (game.target.inity - 1); break;
            case 1: game.target.pos.x -= 0.025; success = game.target.pos.x <= (game.target.initx - 1); break;
            case 2: game.target.pos.y += 0.025; success = game.target.pos.y >= (game.target.inity + 1); break;
            case 3: game.target.pos.x += 0.025; success = game.target.pos.x >= (game.target.initx + 1); break;
        }
        worldmap.refreshMap();
        if(success) {
            game.target.donePushing = true;
            for(var i = worldmap.entities.length - 1; i >= 0; i--) {
                if(worldmap.entities[i].wfid === game.target.killid) {
                    player.clearedEntities.push(worldmap.entities[i].name);
                    worldmap.entities.splice(i, 1);
                } else if(worldmap.entities[i].wfid === (game.target.killid + "X")) {
                    player.clearedEntities.push(worldmap.entities[i].name);
                    worldmap.entities[i].interact = undefined;
                }
            }
            FinishAnim();
        }
    }, 10);
}
function GetRock(name, x, y, dir, wfid) {
    return new GetCommonEntity(name, x, y, 12, 0, undefined, [PushRock], { noChange: true, pushDir: dir, sy: 7, killid: wfid, initx: x, inity: y });
}
function GetWaterfall(name, x, y, dir, wfid) {
    return new GetCommonEntity(name, x, y, 18, dir, undefined, [EnterWaterfall], { moving: true, dontDoThat: true, solid: false, wfid: wfid });
}
function GetWaterfallEnd(name, x, y, dir, wfid) {
    return new GetCommonEntity(name, x, y, 18, dir, undefined, undefined, { sy: 4, sheetlen: 2, moving: true, dontDoThat: true, solid: false, isEnd: true, wfid: wfid });
}
function GetCommonEntity(name, x, y, firstx, dir, movement, interact, additional) {
    var big = (additional !== undefined && additional.big);
    var sheet = (additional !== undefined && additional.sheet !== undefined) ? additional.sheet : (big ? "mapcharbig" : "mapchar");
    var len = (additional !== undefined && additional.sheetlen !== undefined) ? additional.sheetlen : 4;
    var res = {
        name: name, visible: true, 
        pos: {x: x, y: y}, solid: true, 
        anim: new MapAnim(sheet, firstx, (additional === undefined ? 0 : (additional.sy || 0)), (big ? 32 : 16), (big ? 40 : 20), dir, len, additional !== undefined ? additional.dontDoThat : false),
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
    chick: CreateCommonInteractArray("chickbot", 3, ["chickBot"], 1, 3),
    piggn: CreateCommonInteractArray("pig", 1, ["piggun", "piggun", "piggun", "chickBot"], 2, 4),
    golem: CreateCommonInteractArray("golem", 1, ["golem"], 1, 1),
    smonk: CreateCommonInteractArray("seamonk", 8, ["seaMonk", "seaMonk", "seaMonk"], 1, 4),
    fish: CreateCommonInteractArray("fish", 3, ["fishFace", "fishFace", "fishFace", "fishFace", "seaMonk"], 1, 4),
    robo: CreateCommonInteractArray("robo", 5, ["robo"], 1, 2),
    mouse: CreateCommonInteractArray("mouse", 3, ["mouse"], 2, 4),
    sqorl: CreateCommonInteractArray("sqorl", 4, ["sqorl", "sqorl", "sqorl", "mouse"], 1, 3),
    turky: CreateCommonInteractArray("turky", 3, ["turky"], 1, 1),
    mower: [
        function() {
            if(player.hasQuest("fakeFarm") || player.completedQuest("fakeFarm")) {
                worldmap.writeText("mower" + Math.floor(Math.random() * 2));
            } else {
                worldmap.writeText("lawnmower");     
                worldmap.forceEndDialog = true;           
            }
        },
        function() {
            var enemies = ["lawnmower"];
            if(Math.random() < 0.4) { enemies.push("lawnmower"); }
            if(Math.random() < 0.3) { enemies.push("lawnmower"); }
            if(Math.random() < 0.1) { enemies.push("piggun"); }
            combat.startBattle(enemies);
        }
    ],
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
        points: [ { x: x + w, y: y, dx: 1, dy: 0 }, { x: x + w, y: y + h, dx: 0, dy: 1 }, { x: x, y: y + h, dx: -1, dy: 0 }, { x: x, y: y, dx: 0, dy: -1 } ] } },
    downrectangle: function(x, y, w, h, initState) { return { state: (initState || 0), speed: 0.025, loop: true, 
        points: [ { x: x, y: y + h, dx: 0, dy: 1 }, { x: x + w, y: y + h, dx: 1, dy: 0 }, { x: x + w, y: y, dx: 0, dy: -1 }, { x: x, y: y, dx: -1, dy: 0 } ] } }
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
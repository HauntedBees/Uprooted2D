const specialtyHelpers = {
    getLimeItems: function() {
        const items = [];
        if(player.hasItem("lemon")) { items.push("lime.lemon"); }
        if(player.hasItem("banana")) { items.push("lime.banana"); }
        if(player.hasItem("corn")) { items.push("lime.corn"); }
        if(player.hasItem("goldegg")) { items.push("lime.goldegg"); }
        if(items.length > 0) { items.push("lime.nope"); }
        return items;
    },
    getRapItems: function() {
        const items = [];
        if(player.hasItem("garlic")) { items.push("rap.garlic"); }
        if(player.hasItem("rice")) { items.push("rap.rice"); }
        if(player.hasItem("coconut")) { items.push("rap.coconut"); }
        if(items.length > 0) { items.push("lime.nope"); }
        return items;
    },
    getDowelItems: function() {
        const items = [];
        if(player.hasItem("gmocorn")) { items.push("pirateMonkC5"); }
        if(player.hasItem("rice")) { items.push("rap.rice"); }
        if(player.hasItem("chestnut")) { items.push("pirateMonkC4"); }
        if(player.hasItem("shortgrain")) { items.push("pirateMonkC3"); }
        if(player.hasItem("blackrice")) { items.push("pirateMonkC2"); }
        if(player.hasItem("arborio")) { items.push("pirateMonkC1"); }
        if(items.length > 0) { items.push("lime.nope"); }
        return items;
    },
    getCroutonItems: function() {
        const items = [];
        if(player.hasItem("spear")) { items.push("arf.spear"); }
        if(player.hasItem("net")) { items.push("arf.net"); }
        if(player.hasItem("bignet")) { items.push("arf.bignet"); }
        if(player.hasItem("metalrod")) { items.push("arf.metalrod"); }
        if(player.hasItem("ultrarod")) { items.push("arf.ultrarod"); }
        if(items.length > 0) { items.push("lime.nope"); }
        return items;
    },
    getAbuelaItems: function() {
        const items = [];
        if(player.hasItem("fodder")) { items.push("lady.fodder"); }
        if(player.hasItem("corn")) { items.push("lady.corn"); }
        if(player.hasItem("rice")) { items.push("lady.rice"); }
        if(player.hasItem("goodfood")) { items.push("lady.goodfood"); }
        if(items.length > 0) { items.push("lime.nope"); }
        return items;
    },
    getMushItems: function() {
        const items = [];
        if(player.hasItem("milkcap")) { items.push("mushChoice0"); }
        if(player.hasItem("portobello")) { items.push("mushChoice1"); }
        if(player.hasItem("greenshroom")) { items.push("mushChoice2"); }
        if(player.hasItem("poisnshroom")) { items.push("mushChoice3"); }
        if(player.hasItem("notdrugs")) { items.push("mushChoice4"); }
        if(items.length > 0) { items.push("lime.nope"); }
        return items;
    },
    getTruckOptions: function() {
        const options = [];
        if(worldmap.mapName !== "producestand") { options.push("truck.home"); }
        for(let i = 0; i < player.questsCleared.length; i++) {
            switch(player.questsCleared[i]) {
                case "researchLab": if(worldmap.mapName !== "bridge") { options.push("truck.bridge"); } break;
                case "gotTire": if(worldmap.mapName !== "fakefarm") { options.push("truck.fake"); } break;
                case "helpSeaMonster": if(worldmap.mapName !== "outerCity") { options.push("truck.city"); } break;
            }
        }
        options.push("truck.nm");
        return options;
    },
    getHQElevatorOptions: function() {
        const options = [];
        if(player.visitedMaps.indexOf("hq_1") >= 0 && worldmap.mapName !== "hq_1") { options.push("elevator1"); }
        if(player.visitedMaps.indexOf("hq_2") >= 0 && worldmap.mapName !== "hq_2") { options.push("elevator2"); }
        if(player.visitedMaps.indexOf("hq_4") >= 0 && worldmap.mapName !== "hq_4") { options.push("elevator4"); }
        if(options.length < 1) { return null; }
        options.push("elevator0");
        return options;
    }
};

// Standard Entities
const InitFellow = fellow => SetUpFellow(fellow, fellow.animid, false);
function SetUpFellow(fellow, animId, isPlayer) {
    if(animId === "" || animId === null || animId === undefined) {
        fellow.anim = null;
        return;
    }
    if(isPlayer) { worldmap.animData = plAnims[animId]; }
    else {
        fellow.anim = mafs[animId].Get();
        fellow.lastAnim = animId;
    }
};
function GetFellow(name, x, y, dir, animid, interact, movement, additional) {
    const res = {
        name: name, dir: dir, animid: animid, 
        visible: true, moving: false, solid: true,
        pos: { x: x, y: y }, startingpos: { x: x, y: y },
        movement: movement, interact: interact
    };
    return Object.assign(res, additional);
}
const GetNoIMFellow = (name, x, y, animid, additional) => GetFellow(name, x, y, 0, animid, undefined, undefined, additional);
const BoringAssFellow = (name, x, y, anim, big) => GetFellow(name, x, y, 0, anim, undefined, undefined, { big: big, boring: true });
const AutoPlayFellow = (name, interact) => ({ name: name, pos: {x: -1, y: -1}, solid: false, interact: interact, autoplay: true });
const BoringInvisFellow = (name, x, y) => GetFellow(name, x, y, 0, "", undefined, undefined, { visible: false, boring: true });
const InvisFellow = (name, x, y, textKey) => GetFellow(name, x, y, 0, "", OneSpeak(textKey), undefined, { visible: false, boring: true });
const GetSign = (x, y, textKey) => InvisFellow("Sign", x, y, textKey);
const GetTalkie = (name, x, y, anim, intidx, key) => GetFellow(name, x, y, 0, anim, Cutscene(intidx), undefined, { standAnim: anim, talkAnim: anim + "Talk", moving: true, storageKey: key });

// Cutscene Entities
function AutoplayCutscene(cutsceneName) {
    this.boring = true;
    this.name = `cutscene_${cutsceneName}`;
    this.pos = { x: -1, y: -1 };
    this.startingpos = { x: -1, y: -1 };
    this.solid = false;
    this.interact = Cutscene(cutsceneName);
    this.autoplay = true;
}
function CutsceneTrigger(cutsceneName, storageKey, neverClear) {
    this.boring = true;
    this.name = `trigger_${cutsceneName}`;
    this.pos = { x: -1, y: -1 };
    this.startingpos = { x: -1, y: -1 };
    this.solid = false;
    this.interact = Cutscene(cutsceneName);
    this.storageKey = storageKey;
    this.neverClear = neverClear || false;
}
function GetCSFellow(name, x, y, dir, animid, storageKey, additional) {
    if(additional === undefined) { additional = { storageKey: storageKey }; }
    else { additional.storageKey = storageKey; }
    return GetFellow(name, x, y, dir, animid, undefined, undefined, additional);
} 
const BeeFellow = (hiveId, x, y, inside) => GetCSFellow(hiveId, x, y, 0, "Beehive", hiveId, { interact: Cutscene(hiveId), isBeehive: true, inside: inside, visible: !inside });

// Map Switch Entities
const GetStaircase = (name, x, y, newx, newy, map) => SwitchMap(name, x, y, false, false, newx, newy, map, undefined, 2);
function GetPostGameMapName(map) {
    if(map !== "northcity") { return map; }
    if(player.hasAchievement("natureGood")) { map = "northcity_NG"; }
    else if(player.hasAchievement("natureBad")) { map = "northcity_NB"; }
    else if(player.hasAchievement("techGood")) { map = "northcity_IG"; }
    else if(player.hasAchievement("techBad")) { map = "northcity_IB"; }
    return map;
}
function SwitchMap(name, x, y, row, column, newx, newy, map, showIf, newDir) {
    map = GetPostGameMapName(map);
    return {
        name: name, solid: false, pos: {x: x, y: y}, isColumn: column, isRow: row, isMapSwitch: true, destination: map, showIf: showIf, 
        interact: [ function() { game.transition(game.currentInputHandler, worldmap, { init: { x: newx,  y: newy }, map: map, playerDir: newDir }); } ]
    }
};
function SwitchMapSubPartialColumn(name, x, y, newx, newy, map, topy, bottomy) {
    let colswitch = SwitchMap(name, x, y, false, true, newx, newy, map);
    colswitch.topy = topy; colswitch.bottomy = bottomy;
    return colswitch;
}
function SwitchMapSubPartialRow(name, x, y, newx, newy, map, leftx, rightx) {
    let rowswitch = SwitchMap(name, x, y, true, false, newx, newy, map);
    rowswitch.leftx = leftx; rowswitch.rightx = rightx;
    return rowswitch;
}
function SwitchMapSeamless(name, x, y, requiredDir, newx, newy) {
    return {
        name: name, solid: false, pos: {x: x, y: y}, seamlessMap: true, 
        interact: [ function() {
            if(worldmap.playerDir !== requiredDir) { return true; }
            let dx = worldmap.pos.x - x, dy = worldmap.pos.y - y;
            switch(requiredDir) {
                case 0: dy += 4; break;
                case 2: dy -= 0.25; break;
            }
            game.transition(game.currentInputHandler, worldmap, { quickTransition: true, newx: newx + dx, newy: newy + dy });
        } ]
    }
};
function EnterShop(name, x, y, shop, shopDir) {
    shopDir = (shopDir === undefined ? directions.DOWN : shopDir);
    return { 
        name: name, solid: false, pos: { x: x, y: y }, isShop: true, shopName: shop, shopDir: shopDir,
        interact: [ (i, e) => {
            worldmap.savedImage = gfx.getSaveFileImage();
            switch(e.shopDir) {
                case directions.UP: worldmap.pos.y -= 0.5; break;
                case directions.LEFT: worldmap.pos.x -= 0.5; break;
                case directions.DOWN: worldmap.pos.y += 0.5; break;
                case directions.RIGHT: worldmap.pos.x += 0.5; break;
            }
            worldmap.playerDir = e.shopDir;
            game.transition(game.currentInputHandler, worldmap.shop, shop);
            return true;
        }]
    };
};

// Specific Entities
function GetProduceStandBlock(x) {
    const obj = InvisFellow("noPass" + x, x, 23, "farmFirst");
    obj.interact = OneSpeak("farmFirst", () => worldmap.pos.y -= 0.25);
    obj.solid = false;
    obj.showIf = () => !CommonConditions["beatBigBot"]();
    return obj;
}
const GetTruckL = (x, y) => GetFellow("AFuckingTruckL", x, y, 0, "TruckL", Cutscene("truck"), undefined, { big: true });
const GetTruckR = (x, y) => GetFellow("AFuckingTruckR", x, y, 0, "TruckR", Cutscene("truck"), undefined, { big: true });
const GetElevator = (side, x, y) => GetFellow("Elevator" + side, x, y, 0, "", Cutscene("elevator"), undefined, { visible: false, isElevator: true });
const GetSeedShoot = (name, x, y) => GetFellow(name, x, y, 0, "", Cutscene("seedShot"), undefined, { visible: false, hasShot: 0, solid: false });
// RF Doors
function GetRFDoor(name, x, y, type, isDown) {
    return GetFellow(name, x, y, 0, "Door" + type + (isDown ? "d" : ""), undefined, undefined, { active: isDown, initActive: isDown, type: type, solid: !isDown, rfd: true });
}
function GetRFDoorButton(name, x, y, type, isDown) {
    return GetFellow(name, x, y, 0, "Switch" + type + (isDown ? "d" : ""), [ function() { 
        game.target.active = !game.target.active;
        SetUpFellow(game.target, "Switch" + game.target.type + (game.target.active ? "d" : ""));
        ToggleRFDoors(game.target.type);
        worldmap.finishDialog();
    } ], undefined, { sy: (isDown ? 1 : 0), active: isDown, initActive: isDown, type: type, noChange: true, rf: true });
}
function ToggleRFDoors(type) {
    mapStates[worldmap.mapName].rf[type] = !mapStates[worldmap.mapName].rf[type];
    for(let i = 0; i < worldmap.entities.length; i++) {
        if(worldmap.entities[i].rfd && worldmap.entities[i].type === type) {
            const newActive = !worldmap.entities[i].active;
            worldmap.entities[i].active = newActive;
            SetUpFellow(worldmap.entities[i], "Door" + type + (newActive ? "d" : ""));
            worldmap.entities[i].solid = !newActive;
        }
    }
}
// Treasure Chests
function ForceChestOpen(e) { e.open = true; SetUpFellow(e, "Chest1"); }
function GetTreasureChest(name, x, y, contents) {
    return GetFellow(name, x, y, 0, "Chest0", [ function() {
        if(game.target.open) {
            worldmap.writeText("openchest");
        } else {
            const conts = game.target.contents;
            const clen = conts.length - 1;
            let contentString = "";
            let hasRoom = true;
            if(clen === 0) {
                contentString = conts[0][1] + " " + GetItemDisplayName(conts[0][0], conts[0][1] > 1);
                hasRoom = player.increaseItem(conts[0][0], 0);
                
            } else {
                for(let i = clen; i >= 0; i--) {
                    const itdata = conts[i]; // format = [itemname, amount]
                    if(i === 0) {
                        contentString += " and ";
                    } else if(i !== clen) {
                        contentString += ", ";
                    }
                    contentString += itdata[1] + " " + GetItemDisplayName(itdata[0], itdata[1] > 1);
                    hasRoom &= player.increaseItem(itdata[0], 0);
                    if(!hasRoom) { break; }
                }
            }
            if(hasRoom) {
                game.target.open = true;
                SetUpFellow(game.target, "Chest1");
                if(clen === 0) {
                    player.increaseItem(conts[0][0], conts[0][1]);
                } else {
                    for(let i = clen; i >= 0; i--) {
                        const itdata = conts[i];
                        player.increaseItem(itdata[0], itdata[1]);
                    }
                }
                player.openedChests.push(game.target.name);
            } else {
                iHandler.state.texts = ["closedchestinvfull"];
            }
            worldmap.writeText("closedchest", undefined, false, contentString);
        }
    }], undefined, { open: false, contents: contents, isChest: true });
}
function GetIndoorTreasureChest(name, x, y, contents) {
    const chest = GetTreasureChest(name, x, y, contents);
    chest.inside = true; chest.visible = false;
    return chest;
}

// Waterfalls
function GetWaterfall(name, x, y, dir, wfid, tech) {
    const isMoving = (!tech || wfid[1] !== "X");
    const isBoring = (name.replace("waterfall" + wfid, "") !== "0");
    const anim = (tech ? (isMoving ? "RollerBob" : "RollerStart") : "Waterfall");
    return GetFellow(name, x, y, dir, anim, [ EnterWaterfall ], undefined, { moving: isMoving, dontDoThat: true, solid: false, wfid: wfid, isWaterfall: true, boring: isBoring });
}
function GetWaterfallEnd(name, x, y, dir, wfid, tech) {
    return GetFellow(name, x, y, dir, (tech ? "RollerEnd" : "WaterfallEnd"), undefined, undefined, { moving: true, dontDoThat: true, solid: false, isEnd: true, wfid: wfid, boring: true });
}
function EnterWaterfall() {
    if(worldmap.playerDir === directions.RIGHT) {
        worldmap.pos.x += 0.5;
    } else if(worldmap.playerDir === directions.LEFT) {
        worldmap.pos.x -= 0.5;
    }
    worldmap.inWaterfall = true;
    worldmap.waterfallIdx = setInterval(AdvanceWaterfall, timers.FULLANIM * 4);
}
function AdvanceWaterfall() {
    const lastDir = game.target.dir;
    let newDir = -1;
    for(let i = 0; i < worldmap.entities.length; i++) {
        const e = worldmap.entities[i];
        if(!e.solid && e.pos.x === Math.round(worldmap.pos.x) && e.pos.y === Math.round(worldmap.pos.y)) {
            game.target = e;
            if(game.target.isEnd) {
                ExitWaterfall();
                return;
            }
            if(e.dir === lastDir) {
                newDir = lastDir;
                break;
            } else if(newDir != lastDir) {
                newDir = e.dir;
            }
        }
    }
    let x = 0, y = 0;
    switch(newDir) {
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
function ExitWaterfall() {
    clearInterval(worldmap.waterfallIdx);
    worldmap.finishDialog();
    worldmap.inWaterfall = false;
}
function GetRock(name, x, y, dir, wfid) {
    return GetFellow(name, x, y, 0, "Rock", [PushRock], undefined, { pushDir: dir, killid: wfid, initx: x, inity: y, isRock: true });
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
        let success = false;
        switch(game.target.pushDir) {
            case 0: game.target.pos.y -= 0.025; success = game.target.pos.y <= (game.target.inity - 1); break;
            case 1: game.target.pos.x -= 0.025; success = game.target.pos.x <= (game.target.initx - 1); break;
            case 2: game.target.pos.y += 0.025; success = game.target.pos.y >= (game.target.inity + 1); break;
            case 3: game.target.pos.x += 0.025; success = game.target.pos.x >= (game.target.initx + 1); break;
        }
        worldmap.refreshMap();
        if(success) {
            game.target.donePushing = true;
            for(let i = worldmap.entities.length - 1; i >= 0; i--) {
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
function FinishAnim() {
    worldmap.forceMove = false;
    worldmap.refreshMap();
    worldmap.finishAnimation();
}
function GetTechRock(name, x, y, dir, wfid) {
    return GetFellow(name, x, y, dir, "TechRock", [PushTechRock], undefined, { killid: wfid, isRock: true, noChange: true });
}
function PushTechRock() {
    if(game.target.donePushing) { worldmap.finishDialog(); return; }
    game.target.donePushing = true;
    SetUpFellow(game.target, "TechRockPressed");
    for(let i = worldmap.entities.length - 1; i >= 0; i--) {
        if(worldmap.entities[i].wfid === game.target.killid) {
            player.clearedEntities.push(worldmap.entities[i].name);
            worldmap.entities.splice(i, 1);
        } else if(worldmap.entities[i].wfid === (game.target.killid + "X")) {
            player.clearedEntities.push(worldmap.entities[i].name);
            worldmap.entities[i].interact = undefined;
        }
    }
    worldmap.refreshMap();
    worldmap.finishDialog();
}

// Mobsters
function GetMafiaMember(num, x, y, dir, movement) {
    return GetFellow("Mafia" + num, x, y, dir, "Mobsty1", Cutscene("enemy"), movement, requiredEnemyMetadata.mafia);
}
function GetMafiaMember2(num, x, y, dir) {
    return GetFellow("Mafia" + num, x, y, dir, "Mobsty2", Cutscene("enemy"), undefined, requiredEnemyMetadata.mafia2);
}

// HQ3 Ceilings
function GetChungusDoor(num, x, y, chungi, visState) {
    const chungy = { noSave: true, name: "chungusdoor" + num, pos: { x: x, y: y }, solid: false, interact: [ ToggleChungus ], chungi: chungi, boring: true };
    if(visState !== undefined) {
        chungy.noChange = true;
        chungy.animid = "Chungus" + visState;
        InitFellow(chungy);
        chungy.visible = true;
    } else {
        chungy.visible = false;
    }
    return chungy;
}
function GetChungus(id, num, x, y, w, h) {
    return {
        noSave: true,
        name: "chungus" + id + "_" + num, chungus: true, chungusId: id, 
        pos: { x: x, y: y }, width: w, height: h,
        visible: true, boring: true
    };
}
function ToggleChungus(arg, target) {
    const acceptableChungi = target.chungi;
    for(let i = worldmap.entities.length - 1; i >= 0; i--) {
        if(!worldmap.entities[i].chungus) { continue; }
        worldmap.entities[i].visible = (acceptableChungi.indexOf(worldmap.entities[i].chungusId) < 0);
    }
    if(acceptableChungi.length === 1 && acceptableChungi[0] !== undefined) { worldmap.horRor.playerRoom = acceptableChungi[0]; }
    worldmap.finishDialog();
}

// Foreground & Jumbo Covers
function GetForeground(mapname, yoffset, width) {
    return { name: "fg" + mapname, img: "fg/" + mapname, visible: true, yoff: yoffset, width: width, isForeground: true, pos: { x: 0, y: 0 } };
}
function GetJumbo(id, img, x, y, w, h, ox, oy) {
    return { name: id, storageKey: id, jumbo: true, filename: "covers/" + img, visible: true, w: w, h: h, offset: { x: ox, y: oy }, pos: { x: x, y: y }, boring: true };
}
function GetJumboToggle(id, x, y, enter) {
    return GetFellow((enter ? "Enter" : "Exit") + id, x, y, 0, "", [enter ? JumboEntrance : JumboExit], undefined, { visible: false, solid: false, boring: true });
}
function JumboEntrance() { JumboToggle(true); }
function JumboExit() { JumboToggle(false); }
function JumboToggle(inside) {
    worldmap.forceEndDialog = true;
    mapStates[worldmap.mapName].inside = inside;
    for(let i = 0; i < worldmap.entities.length; i++) {
        if(worldmap.entities[i].inside) { worldmap.entities[i].visible = inside; }
        else if(worldmap.entities[i].jumbo) { worldmap.entities[i].visible = !inside; }
    }
    worldmap.finishDialog();
}

// Helpers
const Cutscene = s => [ () => iHandler.Start(s) ];
function OneSpeak(t, extra) {
    return [ (i, e) => {
        iHandler.isFirst = true;
        if(e.moveToTalk) { e.moving = true; }
        worldmap.writeText(t);
        if(extra !== undefined) { extra(); }
    } ];
}

// Enemy and Movement Data
const CommonConditions = {
    "finishedOpening": () => player.completedQuest("openingCutscene"),
    "beatBigBot": () => player.completedQuest("bigBot")
};
const requiredEnemyMetadata = {
    // Farm
    robo: { interactname: "robo", dialogMax: 5, setEnemies: ["robo"], isRobo: true, showIf: CommonConditions["finishedOpening"] },
    roboDouble: { interactname: "robo", dialogMax: 5, setEnemies: ["robo", "robo"], isRobo: true, showIf: CommonConditions["finishedOpening"] },
    // Forest
    turky: { interactname: "turky", dialogMax: 3, setEnemies: ["turky"], moveTalk: true },
    // Below Village & Research Lab
    robo2: { interactname: "research", dialogMax: 5, setEnemies: ["robo2"] },
    // Underwater
    seamonk: { interactname: "seamonk", dialogMax: 8, setEnemies: ["seaMonk"] },
    // Fake Farm
    mower: ct => ({ noChange: true, changeType: ct, visible: false, inside: true }),
    // South City
    mafia2: { mafia: true, interactname: "wildmobsty", dialogMax: 7, setEnemies: ["mobsty2", "mobsty2", "mobsty2"], inside: true, fov: true, visible: false },
    mafia: { mafia: true, interactname: "wildmobsty", dialogMax: 7, setEnemies: ["mobsty1", "mobsty1"], fov: true },
    // HQ 1
    roboGuard: { interactname: "wowNewRobot", dialogMax: 10, setEnemies: ["robo4a", "robo4b", "robo4c"] },
    tinyNerd: { interactname: "tinyNerd", dialogMax: 5, setEnemies: ["tinyNerd"] },
    // HQ 2
    buffNerd: { interactname: "buffNerd", dialogMax: 3, setEnemies: ["buffNerd", "buffNerd", "buffNerd"], moving: true, isBuffNerd: true },    
    // HQ 4
    prophet: type => ({ interactname: "prophet", dialogMax: 4, setEnemies: ["bot" + type], noRunKill: true })
};
const commonMovementDatas = {
    fuckinBottle: function(x, y, w, h, initState) { return { 
            state: (initState || 0), loop: true, 
            points: [ { x: x, y: y + h, dx: 0, dy: 1 }, { x: x + w, y: y + h, dx: 1, dy: 0 }, { x: x + w, y: y, dx: 0, dy: -1 }, { x: x, y: y, dx: -1, dy: 0 } ],
            speed: function(e) {
                switch(e.dir) {
                    case 2: return 0.05;
                    case 1:
                    case 3: return 0.0125;
                    case 0: return Math.random();
                    default: return 0.025;
                }
            }
        } },
    robo: function(x, initState) { return { state: (initState || 0), speed: 0.025, loop: true, points: [ { x: x, y: 16, dx: 0, dy: 1 }, { x: x, y: 8, dx: 0, dy: -1 } ] } },
    line: function(x, y, w, initState) { return { state: (initState || 0), speed: 0.025, loop: true, 
        points: [ { x: x + w, y: y, dx: 1, dy: 0 }, { x: x, y: y, dx: -1, dy: 0 } ] } },
    vertline: function(x, y, h, initState) { return { state: (initState || 0), speed: 0.025, loop: true, 
        points: [ { x: x, y: y + h, dx: 0, dy: 1 }, { x: x, y: y, dx: 0, dy: -1 } ] } },
    rectangle: function(x, y, w, h, initState) { return { state: (initState || 0), speed: 0.025, loop: true, 
        points: [ { x: x + w, y: y, dx: 1, dy: 0 }, { x: x + w, y: y + h, dx: 0, dy: 1 }, { x: x, y: y + h, dx: -1, dy: 0 }, { x: x, y: y, dx: 0, dy: -1 } ] } },
    downrectangle: function(x, y, w, h, initState) {  return { state: (initState || 0), speed: 0.025, loop: true, 
        points: [ { x: x, y: y + h, dx: 0, dy: 1 }, { x: x + w, y: y + h, dx: 1, dy: 0 }, { x: x + w, y: y, dx: 0, dy: -1 }, { x: x, y: y, dx: -1, dy: 0 } ] } },
    fastdownrect: function(x, y, w, h, initState) { var r = commonMovementDatas.downrectangle(x, y, w, h, initState); r.speed *= 3; return r; }
};
function GetStdMovement(points) {
    const newPoints = [];
    for(let i = 0; i < points.length; i++) {
        const dir = points[i][2];
        let dx = 0, dy = 0;
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

function GetItemDisplayName(name, plural) { // 296 TODO: move this fucker to the language parsing shit
    const pluralSuf = plural ? "s" : "";
    switch(name[0]) {
        case "_": return GetFarmInfo(name).displayname + pluralSuf; break;
        case "!": return GetEquipment(name).displayname + pluralSuf; break;
        default: 
            const cropInfo = GetCrop(name);
            let nam = cropInfo.displayname;
            if(["veg", "tree", "mush"].indexOf(cropInfo.type) >= 0) { nam += " Seed"; }
            return nam + pluralSuf;
            break;
    }
}

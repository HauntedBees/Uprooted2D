var iHandler = {
    moveSpeed: 0.025,
    state: { key: "", idx: 0, activeAnim: null, done: false, texts: [], animHandler: null, postItems: [] },
    Start: function(startkey) {
        worldmap.dialogData = {};
        iHandler.state = { key: startkey, idx: 0, activeAnim: null, done: false, texts: [], animHandler: null, postItems: [] };
        iHandler.Advance();
    },
    SpeedUpAnimation: function() {
        clearInterval(worldmap.animIdx);
        while(!iHandler.state.animHandler(true)) {}
    },
    SleepSkip: function() { iHandler.Finish(); return true; },
    Finish: function() {
        if(worldmap.mapName !== "hq_6") {
            worldmap.forceMove = false;
            worldmap.forcedPlayerInfo = false;
        }
        worldmap.waitForAnimation = false;
        worldmap.refreshMap();
        clearInterval(worldmap.animIdx);
        iHandler.Advance();
    },
    Advance: function() {
        worldmap.inDialogue = true;
        if(iHandler.state.texts.length > 0) {
            var newText = iHandler.state.texts.splice(0, 1)[0];
            worldmap.writeText(newText);
            return;
        }
        var curKey = iHandler.state.key + (iHandler.state.idx++);
        var action = scripts[curKey];
        if(action === undefined) { iHandler.state.done = true; }
        if(iHandler.state.done) {
            if(iHandler.state.postItems.length > 0) {
                game.transition(game.currentInputHandler, worldmap.invClean, iHandler.state.postItems);
                iHandler.state.postItems = [];
            }
            return worldmap.finishDialog();
        }
        CommandParser.Parse(action);
    },
    HandleAnim: function(spedUp) {
        iHandler.state.activeAnim.target.pos.x += iHandler.state.activeAnim.dx * iHandler.moveSpeed;
        iHandler.state.activeAnim.target.pos.y += iHandler.state.activeAnim.dy * iHandler.moveSpeed;
        if(!spedUp) { worldmap.refreshMap(); }
        var finished = false;
        switch(iHandler.state.activeAnim.dx * 2 + iHandler.state.activeAnim.dy) {
            case 1: finished = (iHandler.state.activeAnim.target.pos.y >= iHandler.state.activeAnim.dest); break;
            case -1: finished = (iHandler.state.activeAnim.target.pos.y <= iHandler.state.activeAnim.dest); break;
            case 2: finished = (iHandler.state.activeAnim.target.pos.x >= iHandler.state.activeAnim.dest); break;
            case -2: finished = (iHandler.state.activeAnim.target.pos.x <= iHandler.state.activeAnim.dest); break;
        }
        if(finished) {
            if(spedUp) { worldmap.refreshMap(); }
            iHandler.Finish();
        }
        return finished;
    }
};
var CommandParser = {
    ConditionCheck: function(json) {
        var d = worldmap.dialogData === null ? -1 : worldmap.dialogData.idx;
        for(var i = 0; i < json.length; i++) {
            if(!eval(json[i].q)) { continue; }
            iHandler.state.idx = json[i].v;
            iHandler.Advance();
            return;
        }
    },
    Parse: function(s) {
        if(s[0] === "?") {
            if(s[1] === "?") {
                return SpecialFunctions[s.substring(2)](worldmap.dialogData.idx);
            } else {
                return CommandParser.ConditionCheck(JSON.parse(s.substring(1)));
            }
        }
        var actions = s.split("&");
        for(var i = 0; i < actions.length;i++) {
            var splitter = actions[i].split("_");
            var name = splitter[0];
            var action = splitter[1];
            var isPlayer = (name === "pl");
            var isTarget = (name === "targ");
            var target = name === "" ? null : (isPlayer ? worldmap : (isTarget ? game.target : worldmap.importantEntities[name]));
            var actDeets = action.split(":");
            var actSuffix = actDeets[1];
            switch(actDeets[0]) {
                case "CHIEVO": player.achievements.push(actSuffix); break;
                case "ALIGNTECH": player.shiftTech(parseFloat(actSuffix)); break;
                case "ALIGNGOOD": player.shiftEthics(parseFloat(actSuffix)); break;
                case "MOVE": CommandParser.Parse_Movement(target, isPlayer, actSuffix); break;
                case "CUSTOM": CommandParser.Parse_Special(actSuffix); break;
                case "SLEEP": worldmap.waitForAnimation = true; iHandler.state.animHandler = iHandler.SleepSkip; worldmap.animIdx = setTimeout(iHandler.Finish, parseInt(actSuffix)); break;
                case "PLANIM": CommandParser.Parse_BasicPlayerFrame(actSuffix.split(",")); break;
                case "SETDIR": if(isPlayer) { target.playerDir = parseInt(actSuffix); } else { target.dir = parseInt(actSuffix); } break;
                case "TEXT": CommandParser.Parse_Text(actSuffix.split(",")); break;
                case "BLACKTEXT": CommandParser.Parse_BlackText(actSuffix); break;
                case "ANIMSTATE": CommandParser.Parse_ShiftsAndFPS(target, JSON.parse(actSuffix)); break;
                case "ISMOVING": target.moving = (actSuffix === "true"); break;
                case "CLEARTEXT": gfx.clearSome(["menuA", "menutext"]); break;
                case "GO2": CommandParser.Parse_Transition(JSON.parse(actSuffix)); break;
                case "VISIBLE": target.visible = (actSuffix === "true"); break;
                case "SOLID": target.solid = (actSuffix === "true"); break;
                case "CLEARTARGET": worldmap.clearTarget(); break;
                case "PUSHCLEAREDTARGET": player.clearedEntities.push(actSuffix); break;
                case "SETTARGET": game.target = target; break;
                case "END": iHandler.state.done = true; break;
                case "GIVE": CommandParser.Parse_TryGive(actSuffix.split(",")); break;
                case "TAKE": var a = actSuffix.split(","); player.decreaseItem(a[0].replace("~", "_"), parseInt(a[1])); break;
                case "SHIFTY": target.anim.shiftY(parseInt(actSuffix)); break;
                case "COMPLETEQUEST": quests.completeQuest(actSuffix); break;
                case "STARTQUEST": player.activeQuests[actSuffix] = 1; break;
                case "SETQUEST": var args = actSuffix.split(","); player.activeQuests[args[0]] = args[1]; break;
                case "FIGHT": combat.startBattle(actSuffix.split(",")); break;
                case "SETSTATE": iHandler.state.idx = parseInt(actSuffix); break;
                case "MONEY": player.monies += parseInt(actSuffix); break;
                case "LEVELUP": player.addExp(player.nextExp); player.levelUp(); break;
                case "QUIT": iHandler.state.done = true; worldmap.finishDialog(); break;
                case "TRANSITIONANIM": game.startTransitionAnim(-1); break;
                case "CLEARINTERACT": target.interact = undefined; break;
                case "SETTARGETTONOTHING": game.target = null; break;
                case "HIHISPEED": iHandler.moveSpeed = 0.1; break;
                case "HISPEED": iHandler.moveSpeed = 0.05; break;
                case "LOSPEED": iHandler.moveSpeed = 0.025; break;
                case "C2TEXT": CommandParser.Parse_Cash2Text(actSuffix.split(",")); break;
                case "SETPOSX": target.pos.x = parseFloat(actSuffix); break;
            }
        }
    },
    Parse_TryGive: function(itemArr) {
        var itemName = itemArr[0].replace("~", "_");
        var itemAmt = parseInt(itemArr[1]) || 1;
        if(player.increaseItem(itemName, itemAmt)){ return; }
        iHandler.state.postItems.push([itemName, itemAmt]);
    },
    Parse_ShiftsAndFPS: function(target, args) { // [shifty, shiftx, sheetlen, fps, moving]
        target.anim.shiftY(args[0]).shiftX(args[1], args[2]).setFPS(args[3]);
        if(args[4] !== undefined) { target.moving = args[4]; }
    },
    Parse_Transition: function(args) {
        if(args[3] === undefined) {
            game.transition(game.currentInputHandler, worldmap, { init: { x: args[1],  y: args[2] }, map: args[0] });
        } else {
            game.transition(game.currentInputHandler, worldmap, { init: { x: args[1],  y: args[2] }, map: args[0], postCombat: args[3] });
        }
    },
    Parse_BlackText: function(args) { worldmap.writeText(args, undefined, undefined, undefined, true); },
    Parse_Text: function(args) {
        var text = args.splice(0, 1)[0];
        if(text.indexOf("(") >= 0) {
            var rgx = /\((\d*)-(\d*)\)/g;
            var range = text.match(rgx)[0];
            var keyStart = text.replace(range, "");
            var nums = range.substring(1, range.length - 1).split("-");
            iHandler.state.texts = [];
            var start = parseInt(nums[0]);
            var end = parseInt(nums[1]);
            for(var i = (start + 1); i <= end; i++) { iHandler.state.texts.push(keyStart + i); }
            worldmap.writeText(keyStart + nums[0]);
        } else {
            worldmap.writeText(text, args);
        }
    },
    Parse_Cash2Text: function(args) {
        var text = args.splice(0, 1)[0];
        if(args.length > 0) {
            if(player.c2 === 0) {
                player.c2Rate = 500 + Math.floor(Math.random() * 500);
            } else {
                player.c2Rate = RoundNear(player.c2Rate * (0.5 + Math.random() * 0.45), 100);
            }
        }
        var formatting = [
            RoundNear(1000 / player.c2Rate, 100),      // 0 = C2 per 1000G
            player.c2Rate,                              // 1 = G per 1C2
            player.monies, player.c2,                   // 2 = your G, 3 = your C2
            RoundNear(player.c2 * player.c2Rate, 100)  // 4 = how much your C2 is worth, in G
        ];
        worldmap.writeText(text, args, false, formatting);
    },
    Parse_BasicPlayerFrame: function(args) { // sx, sy, time
        worldmap.waitForAnimation = true;
        var sx = parseInt(args[0]);
        var sy = parseInt(args[1]);
        var time = parseInt(args[2]);
        worldmap.forcedPlayerInfo = worldmap.animData.forceFrame(worldmap.pos, sx, sy);
        worldmap.refreshMap();
        worldmap.animIdx = setTimeout(iHandler.Finish, time);
    },
    Parse_Movement: function(target, isPlayer, moveData) {
        var dx = 0; var dy = 0;
        if(moveData[0] === "y") {
            moveData = parseFloat(moveData.substring(1));
            dy = (moveData > target.pos.y) ? 1 : -1;
        } else {
            moveData = parseFloat(moveData.substring(1));
            dx = (moveData > target.pos.x) ? 1 : -1;
        }
        iHandler.state.activeAnim = { target: target, isPlayer: isPlayer, dx: dx, dy: dy, dest: moveData };
        worldmap.waitForAnimation = true;
        if(isPlayer) {
            worldmap.forceMove = true;
            switch(dx * 10 + dy) {
                case 1: worldmap.playerDir = 2; break;
                case -1: worldmap.playerDir = 0; break;
                case 10: worldmap.playerDir = 3; break;
                case -10: worldmap.playerDir = 1; break;
            }
        }
        iHandler.state.animHandler = iHandler.HandleAnim;
        worldmap.animIdx = setInterval(iHandler.HandleAnim, 10);
    },
    Parse_Special: function(id) { SpecialFunctions[id](); }
};

function ClearEntitiesUnderCondition(conditionFunc, refreshMap) {
    for(var i = worldmap.entities.length - 1; i >= 0; i--) {
        var e = worldmap.entities[i];
        if(conditionFunc(e)) { 
            player.clearedEntities.push(e.name);
            worldmap.entities.splice(i, 1);
        }
    }
    if(refreshMap) { worldmap.refreshMap(); }
}

var SpecialFunctions = {
    "WAIT": function() { },
    "GOTOTITLE": function() { game.transition(game.currentInputHandler, worldmap.title); },
    "SETNERDBED": function() { player.lastInn = "nerdBed"; },
    "CATMAIL": function() { player.activeQuests["catmail"] = 1; },
    "CREDITS": function() {
        JustBeatGameChievoCheck();
        return game.transition(game.currentInputHandler, worldmap.credits);
    },
    "WIPEFARMBOTS": function() {
        for(var i = (worldmap.entities.length - 1); i >= 0; i--) {
            var e = worldmap.entities[i];
            if(e.isRobo) {
                player.clearedEntities.push(e.name);
                worldmap.entities.splice(i, 1);
            }
        }
        worldmap.refreshMap();
    },
    "ENTERFARM": function() {
        worldmap.importantEntities["n0"].pos = { x: -1, y: -1 };
        worldmap.importantEntities["n1"].pos = { x: -1, y: -1 };
        worldmap.importantEntities["n2"].pos = { x: -1, y: -1 };
        worldmap.importantEntities["n3"].pos = { x: -1, y: -1 };
        worldmap.importantEntities["n4"].pos = { x: -1, y: -1 };
        worldmap.refreshMap();
        if(!player.completedQuest("nathanned")) { return true; }
        if(player.completedQuest("keycard")) {
            if(!player.hasFalcon) { worldmap.importantEntities["n4"].pos = { x: 13, y: 3 }; }
            worldmap.importantEntities["n3"].pos = { x: 12, y: 2 };
        } else if(player.completedQuest("gotSpareTire")) {
            worldmap.importantEntities["n4"].pos = { x: 13, y: 3 };
            worldmap.importantEntities["n3"].pos = { x: 12, y: 2 };
        } else if(player.completedQuest("helpSeaMonster") || player.completedQuest("getHeart")) {
            worldmap.importantEntities["n4"].pos = { x: 15, y: 8 };
            worldmap.importantEntities["n2"].pos = { x: 16, y: 9 };
        } else if(player.completedQuest("researchLab")) {
            worldmap.importantEntities["n4"].pos = { x: 13, y: 11 };
            worldmap.importantEntities["n1"].pos = { x: 14, y: 12 };
        } else {
            worldmap.importantEntities["n4"].pos = { x: 9, y: 5 };
            worldmap.importantEntities["n0"].pos = { x: 10, y: 6 };
        }
        worldmap.refreshMap();
        return true;
    },
    "THEGIFTOFEGG": function() {
        player.monies -= 250;
        var eggType = "egg";
        if(player.completedQuest("goodEgg") && Math.random() < 0.08) {
            eggType = "goldegg";
        } else {
            eggType = ["egg", "quail", "turkey", "goose", "platypus"][Math.floor(Math.random() * 5)];
        }
        player.increaseItem(eggType, 2);
        worldmap.writeText("eggBoy." + eggType);
    },
    "BEATROBBERS": function() {
        ClearEntitiesUnderCondition(function(e) { return e.robbery === true; }, false);
        worldmap.pos = { x: 6, y: 6 };
        var caughtRobbers = GetCommonEntity("Strobbers", 7, 6, 16, 0, undefined, undefined, { sy: 8, robbery: true });
        worldmap.entities.push(caughtRobbers);
        worldmap.importantEntities["caughtRobbers"] = caughtRobbers;
        for(var i = 0; i < 4; i++) {
            var x = 6 + (i % 2);
            var y = 12 + (i < 2 ? 0 : 2);
            var newCopper = GetCommonEntity("NewCop" + i, x, y, 8, 0, undefined, undefined, { moving: true, sy: 15, robbery: true });
            worldmap.entities.push(newCopper);
            worldmap.importantEntities["NewCop" + i] = newCopper;
        }
        worldmap.refreshMap();

        worldmap.waitForAnimation = true;
        iHandler.state.animHandler = function(spedUp) {
            for(var i = 0; i < 4; i++) {
                worldmap.importantEntities["NewCop" + i].pos.y -= 0.05;
            }
            if(!spedUp) { worldmap.refreshMap(); }
            var finished = worldmap.importantEntities["NewCop0"].pos.y <= 8;
            if(finished) {
                if(spedUp) { worldmap.refreshMap(); }
                iHandler.Finish();
            }
            return finished;
        };
        worldmap.animIdx = setInterval(iHandler.state.animHandler, 10);
    },
    "COPANIM1": function() {
        worldmap.waitForAnimation = true;
        worldmap.importantEntities["NewCop0"].dir = 1;
        worldmap.importantEntities["NewCop1"].dir = 3;
        iHandler.state.animHandler = function(spedUp) {
            for(var i = 0; i < 4; i++) {
                if(i === 0) {
                    worldmap.importantEntities["NewCop" + i].pos.x -= 0.05;
                } else if(i === 1) {
                    worldmap.importantEntities["NewCop" + i].pos.x += 0.05;
                } else {
                    worldmap.importantEntities["NewCop" + i].pos.y -= 0.05;
                }
            }
            if(!spedUp) { worldmap.refreshMap(); }
            var finished = worldmap.importantEntities["NewCop2"].pos.y <= 8;
            if(finished) {
                if(spedUp) { worldmap.refreshMap(); }
                iHandler.Finish();
            }
            return finished;
        };
        worldmap.animIdx = setInterval(iHandler.state.animHandler, 10);
    },
    "COPANIM2": function() {
        worldmap.waitForAnimation = true;
        worldmap.importantEntities["NewCop0"].dir = 0;
        worldmap.importantEntities["NewCop1"].dir = 0;
        worldmap.importantEntities["NewCop2"].dir = 1;
        worldmap.importantEntities["NewCop3"].dir = 3;
        iHandler.state.animHandler = function(spedUp) {
            for(var i = 0; i < 4; i++) {
                if(i === 2) {
                    worldmap.importantEntities["NewCop" + i].pos.x -= 0.05;
                } else if(i === 3) {
                    worldmap.importantEntities["NewCop" + i].pos.x += 0.05;
                } else {
                    worldmap.importantEntities["NewCop" + i].pos.y -= 0.05;
                }
            }
            if(!spedUp) { worldmap.refreshMap(); }
            var finished = worldmap.importantEntities["NewCop0"].pos.y <= 6;
            if(finished) {
                if(spedUp) { worldmap.refreshMap(); }
                iHandler.Finish();
            }
            return finished;
        };
        worldmap.animIdx = setInterval(iHandler.state.animHandler, 10);
    },
    "COPANIM3": function() {
        worldmap.waitForAnimation = true;
        worldmap.importantEntities["NewCop2"].dir = 0;
        worldmap.importantEntities["NewCop3"].dir = 0;
        iHandler.state.animHandler = function(spedUp) {
            for(var i = 0; i < 4; i++) {
                worldmap.importantEntities["NewCop" + i].pos.y -= 0.05;
            }
            if(!spedUp) { worldmap.refreshMap(); }
            var finished = worldmap.importantEntities["NewCop2"].pos.y <= 7;
            if(finished) {
                if(spedUp) { worldmap.refreshMap(); }
                for(var i = 0; i < 4; i++) {
                    worldmap.importantEntities["NewCop" + i].moving = false;
                    worldmap.importantEntities["NewCop" + i].dir = (i % 2 === 0 ? 3 : 1);
                }
                iHandler.Finish();
            }
            return finished;
        };
        worldmap.animIdx = setInterval(iHandler.state.animHandler, 10);
    },
    "COPANIM4": function() {
        worldmap.waitForAnimation = true;
        worldmap.importantEntities["NewCop1"].moving = true;
        worldmap.importantEntities["NewCop2"].moving = true;
        worldmap.importantEntities["NewCop3"].moving = true;
        iHandler.state.animHandler = function(spedUp) {
            for(var i = 1; i < 4; i++) {
                if(i === 2) {
                    worldmap.importantEntities["NewCop" + i].pos.x += 0.025;
                } else {
                    worldmap.importantEntities["NewCop" + i].pos.x -= 0.025;
                }
            }
            if(!spedUp) { worldmap.refreshMap(); }
            var finished = worldmap.importantEntities["NewCop1"].pos.x <= 7;
            if(finished) {
                if(spedUp) { worldmap.refreshMap(); }
                iHandler.Finish();
            }
            return finished;
        };
        worldmap.animIdx = setInterval(iHandler.state.animHandler, 10);
    },
    "COPANIM5": function() {
        worldmap.waitForAnimation = true;
        worldmap.importantEntities["NewCop1"].dir = 2;
        worldmap.importantEntities["NewCop2"].dir = 2;
        worldmap.importantEntities["NewCop3"].dir = 2;
        iHandler.state.animHandler = function(spedUp) {
            for(var i = 1; i < 4; i++) {
                worldmap.importantEntities["NewCop" + i].pos.y += 0.025;
            }
            worldmap.importantEntities["caughtRobbers"].pos.y += 0.025;
            if(!spedUp) { worldmap.refreshMap(); }
            var finished = worldmap.importantEntities["NewCop1"].pos.y >= 12;
            if(finished) {
                if(spedUp) { worldmap.refreshMap(); }
                iHandler.Finish();
            }
            return finished;
        };
        worldmap.animIdx = setInterval(iHandler.state.animHandler, 10);
    },
    "FINISHCOPS": function() { ClearEntitiesUnderCondition(function(e) { return e.robbery === true; }, false); },
    "SWITCHTOFALCON": function() { iHandler.Start("falcon"); },
    "SCREENSHAKE": function() {
        // TODO
    },
    "BIRDSONG.OGG": function() {
        // TODO
    },
    "BEEQUEENMAD": function() {
        game.target = null;
        player.beeQueensFaced++;
        worldmap.angryBees = false;
        var enemy = player.beeQueensFaced < 2 ? "beeQueenA" : (player.beeQueensFaced < 5 ? "beeQueenB" : "beeQueenC");
        combat.startBattle([enemy]);
    },
    "FLIPSHIT": function() {
        worldmap.waitForAnimation = true;
        iHandler.state.animHandler = function(spedUp) {
            var newY = (worldmap.entities[0].anim.getFrame().sy / 20) + 1;
            for(var i = 0; i < worldmap.entities.length; i++) {
                if(worldmap.entities[i].isFlippy !== true) { continue; }
                worldmap.entities[i].anim.shiftY(newY);
            }
            if(!spedUp) { worldmap.refreshMap(); }
            var finished = (newY === 14);
            if(finished) {
                if(spedUp) { worldmap.refreshMap(); }
                iHandler.Finish();
            }
            return finished;
        };
        worldmap.animIdx = setInterval(iHandler.state.animHandler, 250);
    },
    "NERDUP": function() {
        player.hasNerd = true;
        worldmap.clearTarget();
        worldmap.animData = new MapAnim("mapplayer_help", 0, 0, 20, 25, 2);
        worldmap.entities.push(GetCommonEntity("BarricadeL", 23, 2, 6, 0, undefined, [ GetSpeak("blockedOff3F") ], { big: true, noChange: true }));
        worldmap.entities.push(GetCommonEntity("BarricadeR", 25, 2, 6, 0, undefined, [ GetSpeak("blockedOff3F") ], { big: true, sy: true, noChange: true }));
        me.PLAYERMOVESPEED /= 2;
    },
    "NERDDOWN": function() {
        player.hasNerd = false;
        worldmap.clearTarget();
        worldmap.animData = new MapAnim("mapplayer", 0, 0, 16, 20, 2);
        me.PLAYERMOVESPEED *= 2;
        worldmap.importantEntities["trentSafe"].interact = [GetSpeak("sleepingSavedNerd")];
        worldmap.importantEntities["trentSafe"].visible = true;
        worldmap.importantEntities["trentSafe"].solid = true;
    },
    "NEWPHONE" : function() { worldmap.smartphone = new Smartphone(); },
    "PHONEPRESS": function() { worldmap.smartphone.Read(); },
    "THEMONSTER": function() {
        var monster = GetCommonEntity("Monster", worldmap.pos.x - 0.5, worldmap.pos.y - 2.25, 6, 0, undefined, undefined, { big: true, sy: 2, isTheMonster: true });
        monster.anim.other.layer = "foreground";
        worldmap.entities.push(monster);
        worldmap.importantEntities["monster"] = worldmap;
    },
    "BEATMONSTER": function() { ClearEntitiesUnderCondition(function(e) { return e.isTheMonster === true; }, true); },
    "BYEFALCON": function() { player.hasFalcon = false; },
    "GETFALCONTEXT": function() {
        var keyStart = "falconMsg0.";
        var rangeMax = 6;
        switch(worldmap.mapName) {
            case "bridge": keyStart = "falconMsg1."; rangeMax = 5; break;
            case "fakefarm": keyStart = "falconMsg2."; rangeMax = 5; break;
            case "southcity":
                player.increaseItem("goose", 10);
                player.increaseItem("egg", 20);
                keyStart = "falconMsg3.";
                rangeMax = 5;
                break;
            case "northcity": keyStart = "falconMsg4."; rangeMax = 4; break;
            case "hq_1": keyStart = "falconMsg5."; rangeMax = 7; break;
        }
        for(var i = 1; i <= rangeMax; i++) { iHandler.state.texts.push(keyStart + i); }
        worldmap.writeText(keyStart + "0");
    },
    "FALCONSELECT": function() {
        game.currentInputHandler = worldmap.falconSelect;
        for(var i = 0; i < player.nathanSeeds.length; i++) {
            player.increaseItem(player.nathanSeeds[i][0], player.nathanSeeds[i][1]);
        }
        worldmap.falconSelect.setup();
    },
    "PLAYERREAD": function() {
        worldmap.forcedPlayerInfo = worldmap.animData.forceFrame(worldmap.pos, 6, 0);
        worldmap.refreshMap();
    },
    "PLAYERSTOP": function() {
        worldmap.forcedPlayerInfo = worldmap.animData.forceFrame({ x: 8.5, y: 10 }, 0, 0);
        worldmap.forcedY = 10;
        worldmap.refreshMap();
    },
    "PLAYERSHOCK1": function() {
        worldmap.forcedPlayerInfo = worldmap.animData.forceFrame({ x: 8.5, y: 10 }, 7, 0);
        worldmap.refreshMap();
    },
    "PLAYERSHOCK2": function() {
        worldmap.forcedPlayerInfo = worldmap.animData.forceFrame({ x: 8.5, y: 10 }, 7, 1);
        worldmap.refreshMap();
    },
    "ENTERTHEBIRD": function() {
        var bird = GetCommonEntity("Eagle", worldmap.pos.x - 8, worldmap.pos.y - 3.5, 6, 0, undefined, undefined, { sheet: "assistant", sy: 1, sheetlen: 2, moving: true });
        worldmap.entities.push(bird);
        worldmap.importantEntities["bird"] = bird;

        worldmap.waitForAnimation = true;
        iHandler.state.animHandler = function(spedUp) {
            worldmap.importantEntities["bird"].pos.x += 0.05;
            worldmap.importantEntities["bird"].pos.y += 0.025;
            if(!spedUp) { worldmap.refreshMap(); }
            var finished = worldmap.importantEntities["bird"].pos.x >= (worldmap.pos.x - 1);
            if(finished) {
                worldmap.importantEntities["bird"].anim.shiftX(4);
                worldmap.importantEntities["bird"].moving = false;
                if(spedUp) { worldmap.refreshMap(); }
                iHandler.Finish();
            }
            return finished;
        };
        worldmap.animIdx = setInterval(iHandler.state.animHandler, 10);
    },
    "EXITTHEBIRDFINAL": function() {
        worldmap.forcedPlayerInfo = false;
        worldmap.writeText("falconMsg5.8");
        iHandler.state.texts.push("falconMsg5.9");
        player.hasFalcon = true;
    },
    "EXITTHEBIRD1": function() {
        gfx.clearSome(["menuA", "menutext"]);
        worldmap.importantEntities["bird"].anim.shiftX(6);
        worldmap.importantEntities["bird"].moving = true;
        worldmap.waitForAnimation = true;
        worldmap.forcedPlayerInfo = false;
        iHandler.state.animHandler = function(spedUp) {
            worldmap.importantEntities["bird"].pos.y -= 0.01;
            if(!spedUp) { worldmap.refreshMap(); }
            var finished = worldmap.importantEntities["bird"].pos.y <= (worldmap.pos.y - 1.5);
            if(finished) {
                if(spedUp) { worldmap.refreshMap(); }
                iHandler.Finish();
            }
            return finished;
        };
        worldmap.animIdx = setInterval(iHandler.state.animHandler, 10);
    },
    "EXITTHEBIRD2": function() {
        worldmap.waitForAnimation = true;
        iHandler.state.animHandler = function(spedUp) {
            worldmap.importantEntities["bird"].pos.x += 0.05;
            worldmap.importantEntities["bird"].pos.y -= 0.0125;
            if(!spedUp) { worldmap.refreshMap(); }
            var finished = worldmap.importantEntities["bird"].pos.x >= (worldmap.pos.x + 8);
            if(finished) {
                if(spedUp) { worldmap.refreshMap(); }
                game.target = worldmap.importantEntities["bird"];
                worldmap.clearTarget();
                worldmap.importantEntities["bird"] = undefined;
                iHandler.Finish();
            }
            return finished;
        };
        worldmap.animIdx = setInterval(iHandler.state.animHandler, 10);
    },
    "DESTROYBUILDING": function() {
        worldmap.importantEntities["13thStBuildings"].filename = "covers/northcity2_post";
        for(var i = 0; i < worldmap.entities.length; i++) {
            if(worldmap.entities[i].destroyable) {
                player.clearedEntities.push(worldmap.entities[i].name);
                worldmap.entities[i].solid = false;
                worldmap.entities[i].visible = false;
                worldmap.entities[i].inside = false;
            } else if(worldmap.entities[i].name.indexOf("XNerndHaus") > 0) {
                worldmap.entities[i].pos.y += 27;
            }
        }
    },
    "C2BUY": function() { player.monies -= 1000; player.c2 = RoundNear(player.c2 + 1000 / player.c2Rate, 100); },
    "C2SELL": function() { player.monies += Math.round(player.c2Rate); player.c2 = RoundNear(player.c2 - 1, 100); },
    "MOBFLEE": function() { ClearEntitiesUnderCondition(function(e) { return e.mafia === true; }, true); },
    "ENTERSKUMPY": function() {
        worldmap.importantEntities["skumpyCover"].visible = false;
        for(var i = 0; i < worldmap.entities.length; i++) { if(worldmap.entities[i].inside) { worldmap.entities[i].visible = true; } }
        worldmap.importantEntities["skumpy"].visible = true;
        worldmap.importantEntities["skumpy"].pos = { x: 40, y: 39 };
        worldmap.importantEntities["skumpy"].anim.shiftX(10);
        worldmap.refreshMap();
    },
    "SKUMPYTURN": function() {
        worldmap.pos.y = 39.25;
        stores["skumpys"].wares[0].price = 0;
        worldmap.importantEntities["bruno"].dir = 3;
        worldmap.importantEntities["skumpy"].anim.shiftX(9);
    },
    "SKUMPYCLEAN": function() {
        var temp = game.target;
        game.target = worldmap.importantEntities["bruno"];
        worldmap.clearTarget();
        game.target = temp;
    },
    "SKUMPYPOP": function() {
        worldmap.pos.y = 39.25;
        worldmap.playerDir = 1;
    },
    "SKUMPYEXIT": function() {
        worldmap.clearTarget();
        worldmap.importantEntities["skumpyCover"].visible = true;
        for(var i = 0; i < worldmap.entities.length; i++) { if(worldmap.entities[i].inside) { worldmap.entities[i].visible = false; } }
        game.transition(game.currentInputHandler, worldmap, { init: { x: 41, y: 43 }, map: "southcity" });
    },
    "BRUNOBEAT": function() {
        worldmap.importantEntities["bruno"].anim.shiftX(16);
        worldmap.importantEntities["bruno"].anim.shiftY(4);
        worldmap.importantEntities["bruno"].dir = 0;
    },
    "FORCEYZERO": function() { worldmap.forcedY = 0; },
    "UNFORCEYZERO": function() { worldmap.forcedY = -1; },
    "SETUPJEFF": function() {
        worldmap.playerDir = 0;
        worldmap.waitForAnimation = true;
        player.activeQuests["gotTire"] = 1;
        player.lastInn = "fakefarm";
        worldmap.importantEntities["FarmerJeff"].dir = 2;
        worldmap.importantEntities["FarmerJeff"].pos = { x: worldmap.pos.x, y: 25 };
        worldmap.importantEntities["FarmerJeff"].visible = true;
        worldmap.importantEntities["FarmerJeff"].moving = true;
    },
    "ENTERBARN": function() { JumboEntrance(); },
    "EXITBARN": function() { JumboExit(); },
    "FIXTIRE": function() {
        worldmap.writeText("bustedTruck1");
        quests.completeQuest("truckRepair");
        game.target.anim.shiftY(0);
        game.target.interact = Cutscene("truck");
    },
    "MOWER0": function() {
        if(player.hasQuest("fakeFarm") || player.completedQuest("fakeFarm")) { worldmap.writeText("mower" + Math.floor(Math.random() * 2)); }
        else { worldmap.writeText("lawnmower"); iHandler.state.done = true; }
    },
    "HOTBOXBEAT": function() {
        worldmap.importantEntities["MrShocky"].pos = { x: -1, y: -1 };
        worldmap.importantEntities["MrShocky"].moving = false;
        player.clearedEntities.push("MrShocky");
        player.activeQuests["fakeFarm"] = 2;
        worldmap.refreshMap();
        worldmap.writeText("hotbox3");
    },
    "UNPLUGOUTLET": function(fromLoad) {
        if(!fromLoad) {
            worldmap.writeText("farmTVunplug2");
            game.target.anim.shiftY(13);
            player.activeQuests["fakeFarm"] = 1;
            player.questsCleared.push("unpluggedOutlet");
            if(worldmap.importantEntities["MrShocky"] !== undefined) {
                worldmap.importantEntities["MrShocky"].pos = { x: -1, y: -1 };
                worldmap.importantEntities["MrShocky"].moving = false;
                player.clearedEntities.push("MrShocky");
            }
        }
        worldmap.importantEntities["FarmTV"].moving = false;
        worldmap.importantEntities["FarmTV"].anim.shiftY(3);
        worldmap.refreshMap();
    },
    "FARMTVEND": function(fromLoad) {
        if(!fromLoad) {
            worldmap.writeText("farmTV5");
            game.target.pos = { x: -1, y: -1 };
            player.activeQuests["fakeFarm"] = 0;
        }
        for(var i = 0; i < worldmap.entities.length; i++) {
            if(worldmap.entities[i].changeType === undefined) { continue; }
            switch(worldmap.entities[i].changeType) {
                case 0:
                    worldmap.entities[i].interact = undefined;
                    worldmap.entities[i].solid = false;
                    worldmap.entities[i].visible = false;
                    break;
                case 1:
                    var p = worldmap.entities[i].startingpos;
                    worldmap.entities[i].movement = commonMovementDatas.line(p.x, p.y, 9);
                    break;
                case 2:
                    var p = worldmap.entities[i].startingpos;
                    worldmap.entities[i].movement = commonMovementDatas.line(p.x - 4, p.y, 4, 1);
                    break;
                case 3:
                    var p = worldmap.entities[i].startingpos;
                    worldmap.entities[i].movement = commonMovementDatas.line(p.x, p.y, 4);
                    break;
                case 4:
                    var p = worldmap.entities[i].startingpos;
                    worldmap.entities[i].movement = commonMovementDatas.line(p.x - 7, p.y, 7, 1);
                    break;
                case 5:
                    var p = worldmap.entities[i].startingpos;
                    worldmap.entities[i].movement = commonMovementDatas.line(p.x, p.y, 11);
                    break;
                case 6:
                    var p = worldmap.entities[i].startingpos;
                    worldmap.entities[i].movement = commonMovementDatas.line(p.x - 11, p.y, 11, 1);
                    break;
                case 7:
                    worldmap.entities[i].solid = true;
                    worldmap.entities[i].visible = true;
                    break;
            }
        }
    },
    "KELPDEAD": function() {
        player.clearedEntities.push("KelpBoy");
        player.activeQuests["kelpBoy"] = "deadass";
        if(worldmap.importantEntities["KelpBoy"] !== undefined) {
            worldmap.importantEntities["KelpBoy"].solid = false;
            worldmap.importantEntities["KelpBoy"].visible = false;
            worldmap.importantEntities["KelpBoy"].interact = undefined;
        }
        worldmap.refreshMap();
        worldmap.writeText("vaseWon0");
    },
    "SEAHELP0": function() {
        worldmap.playerDir = 0;
        worldmap.importantEntities["slt"].visible = true;
        worldmap.importantEntities["smt"].visible = true;
        worldmap.importantEntities["smt"].pos.y = 3;
        worldmap.importantEntities["srt"].visible = true;
        worldmap.refreshMap();
        worldmap.writeText("smD5");
    },
    "SEAHELP1": function() {
        ClearEntitiesUnderCondition(function(e) { return e.name.indexOf("H_") === 0; }, true);
        worldmap.writeText("smD6");
    },
    "DEADFISH": function() {
        ClearEntitiesUnderCondition(function(e) { return e.name.indexOf("SeaCreature") === 0; }, true);
        if(player.hasQuest("getHeart")) {
            player.activeQuests["getHeart"] = "heart";
        } else {
            player.activeQuests["getHeart"] = "weirdheart";
        }
        player.shiftEthics(-10);
        worldmap.writeText("bworkerA1");
    },
    "CONSTWORKWIN": function() {
        ClearEntitiesUnderCondition(function(e) { return e.name.indexOf("H_") === 0 || e.name.indexOf("Worker") >= 0; }, true);
        quests.completeQuest("helpSeaMonster");
        quests.completeQuest("getHeart");
        worldmap.writeText("bworkerB5");
    },
    "CONSTWORKFIGHT": function() {
        worldmap.writeText("bworkerMad6");
        player.activeQuests["helpSeaMonster"] = "gotEgg";
        ClearEntitiesUnderCondition(function(e) { return e.name.indexOf("Worker") >= 0; }, false);
    },
    "SEEDSHOT": function() { player.health -= 2; game.target.hasShot = 5; },
    "SEEDSHOTKILL": function() {
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
    },
    "ELEVATORSTART": function() {
        var items = specialtyHelpers.getHQElevatorOptions();
        if(items === null) { worldmap.writeText("elevatorNope"); iHandler.state.done = true; }
        else { worldmap.writeText("elevatorNormal", items); }
    },
    "ELEVATORNEXT": function(idx) {
        switch(specialtyHelpers.getHQElevatorOptions()[idx]) {
            case "elevator1": game.transition(game.currentInputHandler, worldmap, { init: { x: 11.5,  y: 3 }, map: "hq_1", playerDir: 2 }); break;
            case "elevator2": game.transition(game.currentInputHandler, worldmap, { init: { x: 11.5,  y: 3 }, map: "hq_2", playerDir: 2 }); break;
            case "elevator4": game.transition(game.currentInputHandler, worldmap, { init: { x: 11.5,  y: 3 }, map: "hq_4", playerDir: 2 }); break;
        }
        iHandler.state.done = true;
        worldmap.finishDialog();
    },
    "TRUCKSTART": function() {
        var items = specialtyHelpers.getTruckOptions();
        if(items.length === 1) { worldmap.writeText("truck.none"); iHandler.state.done = true; }
        else { worldmap.writeText("truck.where", items); }
    },
    "TRUCKNEXT": function(idx) {
        switch(specialtyHelpers.getTruckOptions()[idx]) {
            case "truck.fake": game.transition(game.currentInputHandler, worldmap, { init: { x: 24.75,  y: 35.5 }, map: "fakefarm", playerDir: 2 }); break;
            case "truck.home": game.transition(game.currentInputHandler, worldmap, { init: { x: 16,  y: 7 }, map: "producestand", playerDir: 2 }); break;
            case "truck.bridge": game.transition(game.currentInputHandler, worldmap, { init: { x: 27,  y: 5 }, map: "bridge", playerDir: 2 }); break;
            case "truck.city":
                if(player.completedQuest("gotTire")) {
                    game.transition(game.currentInputHandler, worldmap, { init: { x: 52,  y: 50 }, map: "southcity", playerDir: 2 });
                } else {
                    game.transition(game.currentInputHandler, worldmap, { init: { x: 24.75,  y: 35.5 }, playerDir: 0, map: "fakefarm", stayBlack: true });
                }
                break;
        }
        iHandler.state.done = true;
        worldmap.finishDialog();
    },
    "MUSHSTART": function() {
        var items = specialtyHelpers.getMushItems();
        if(items.length === 0) { worldmap.writeText("mushMan3"); iHandler.state.done = true; }
        else { worldmap.writeText("mushMan2", items); }
    },
    "MUSHNEXT": function(idx) {
        switch(specialtyHelpers.getMushItems()[idx]) {
            case "mushChoice0": player.decreaseItem("milkcap"); worldmap.writeText("mushManGive0"); iHandler.state.idx = 8; break;
            case "mushChoice1": player.decreaseItem("portobello"); worldmap.writeText("mushManGive0"); iHandler.state.idx = 8; break;
            case "mushChoice2": player.decreaseItem("greenshroom"); worldmap.writeText("mushManGive0"); iHandler.state.idx = 8; break;
            case "mushChoice3": player.decreaseItem("poisnshroom"); worldmap.writeText("mushManGive0"); iHandler.state.idx = 12; break;
            case "mushChoice4": player.decreaseItem("notdrugs"); worldmap.writeText("mushManGive0"); iHandler.state.idx = 10; break;
            case "lime.nope": worldmap.writeText("mushManNope"); iHandler.state.done = true; break;
        }
    },
    "ABUELASTART": function() {
        var items = specialtyHelpers.getAbuelaItems();
        if(items.length === 0) { worldmap.writeText("kindLadyX"); iHandler.state.done = true; }
        else { worldmap.writeText("kindLadyQ", items); }
    },
    "ABUELANEXT": function(idx) {
        switch(specialtyHelpers.getAbuelaItems()[idx]) {
            case "lady.fodder": player.decreaseItem("fodder"); worldmap.writeText("kindLadyNorm0"); iHandler.state.idx = 6; break;
            case "lady.corn": player.decreaseItem("corn"); worldmap.writeText("kindLadyNorm0"); iHandler.state.idx = 6; break;
            case "lady.rice": player.decreaseItem("rice"); worldmap.writeText("kindLadyNorm0"); iHandler.state.idx = 6; break;
            case "lady.goodfood": player.decreaseItem("goodfood"); worldmap.writeText("kindLadyGood0"); iHandler.state.idx = 8; break;
            case "lime.nope": worldmap.writeText("kindLadyX"); iHandler.state.done = true; break;
        }
    },
    "CROUTONSTART": function() {
        var items = specialtyHelpers.getCroutonItems();
        if(items.length === 0) { worldmap.writeText("arf3"); iHandler.state.done = true; }
        else { worldmap.writeText("arf4", items); }
    },
    "CROUTONNEXT": function(idx) {
        switch(specialtyHelpers.getCroutonItems()[idx]) {
            case "arf.spear": worldmap.writeText("arf.spear0"); iHandler.state.idx = 6; break;
            case "arf.net": player.decreaseItem("net"); worldmap.writeText("arf.good0"); iHandler.state.idx = 7; break;
            case "arf.bignet": player.decreaseItem("bignet"); worldmap.writeText("arf.good0"); iHandler.state.idx = 7; break;
            case "arf.metalrod": player.decreaseItem("metalrod"); worldmap.writeText("arf.good0"); iHandler.state.idx = 7; break;
            case "arf.ultrarod": player.decreaseItem("ultrarod"); worldmap.writeText("arf.ultra0"); iHandler.state.idx = 9; break;
            case "lime.nope": worldmap.writeText("arf.none"); iHandler.state.done = true; break;
        }
    },
    "PIRATESTART": function() {
        var items = specialtyHelpers.getDowelItems();
        if(items.length === 0) { worldmap.writeText("pirateMonkW"); iHandler.state.done = true; }
        else { worldmap.writeText("pirateMonkH", items); }
    },
    "PIRATENEXT": function(idx) {
        switch(specialtyHelpers.getDowelItems()[idx]) {
            case "pirateMonkC5": worldmap.writeText("pirateMonkG1"); iHandler.state.idx = 10; break; // gmocorn
            case "rap.rice": player.decreaseItem("rice"); worldmap.writeText("pirateMonkR1"); iHandler.state.idx = 8; break;
            case "pirateMonkC4": player.decreaseItem("chestnut"); worldmap.writeText("pirateMonkR1"); iHandler.state.idx = 8; break;
            case "pirateMonkC3": player.decreaseItem("shortgrain"); worldmap.writeText("pirateMonkR1"); iHandler.state.idx = 8; break;
            case "pirateMonkC2": player.decreaseItem("blackrice"); worldmap.writeText("pirateMonkR1"); iHandler.state.idx = 8; break;
            case "pirateMonkC1": player.decreaseItem("arborio"); worldmap.writeText("pirateMonkR1"); iHandler.state.idx = 8; break;
            case "lime.nope": worldmap.writeText("pirateMonkNo"); iHandler.state.done = true; break;
        }
    },
    "PIRATETREASURE": function() {
        game.target.open = true;
        game.target.anim.shiftY(5);
        player.increaseItem("ultrarod", 4);
        quests.completeQuest("seamonkey");
        worldmap.writeText("chestUnlock3");
    },
    "RAPSTART": function() {
        var items = specialtyHelpers.getRapItems();
        if(items.length === 0) { worldmap.writeText("rap4"); iHandler.state.done = true; }
        else { worldmap.writeText("rap5", items); }
    },
    "RAPNEXT": function(idx) {
        switch(specialtyHelpers.getRapItems()[idx]) {
            case "rap.garlic": worldmap.writeText("rap.garlic1"); iHandler.state.idx = 6; break;
            case "rap.rice": worldmap.writeText("rap.rice1"); iHandler.state.idx = 8; break;
            case "rap.coconut": worldmap.writeText("rap.coconut1"); iHandler.state.idx = 10; break;
            case "lime.nope": worldmap.writeText("rap4"); iHandler.state.done = true; break;
        }
    },
    "LIMESTART": function() {
        var items = specialtyHelpers.getLimeItems();
        if(items.length === 0) { worldmap.writeText("lime3"); iHandler.state.done = true; }
        else { worldmap.writeText("lime4", items); }
    },
    "LIMENEXT": function(idx) {
        switch(specialtyHelpers.getLimeItems()[idx]) {
            case "lime.lemon": worldmap.writeText("lime.lemon1"); iHandler.state.idx = 6; break;
            case "lime.banana": worldmap.writeText("lime.banana1"); iHandler.state.idx = 8; break;
            case "lime.corn": worldmap.writeText("lime.corn1"); iHandler.state.idx = 10; break;
            case "lime.goldegg": worldmap.writeText("lime.egg1"); iHandler.state.idx = 12; break;
            case "lime.nope": worldmap.writeText("lime.denied"); iHandler.state.done = true; break;
        }
    },
    "PWIDE": function() { worldmap.animData.width = 32; worldmap.animData.other.forceWide = true; iHandler.Finish(); },
    "PUNWIDE": function() { worldmap.animData.width = 16; worldmap.animData.other.forceWide = false; iHandler.Finish(); },
    "HIPMOV": function() {
        worldmap.waitForAnimation = true;
        iHandler.state.animHandler = function(spedUp) {
            worldmap.importantEntities["hipster"].pos.y += 0.025;
            worldmap.importantEntities["hipster"].pos.x += 0.05;
            if(!spedUp) { worldmap.refreshMap(); }
            var finished = worldmap.importantEntities["hipster"].pos.x >= 8;
            if(finished) {
                if(spedUp) { worldmap.refreshMap(); }
                iHandler.Finish();
            }
            return finished;
        };
        worldmap.animIdx = setInterval(iHandler.state.animHandler, 10);
    },
    "HIPMOV2": function() {
        worldmap.waitForAnimation = true;
        iHandler.state.animHandler = function(spedUp) {
            worldmap.importantEntities["hipster"].pos.y -= 0.025;
            worldmap.importantEntities["hipster"].pos.x -= 0.05;
            if(!spedUp) { worldmap.refreshMap(); }
            var finished = worldmap.importantEntities["hipster"].pos.x <= 6;
            if(finished) {
                if(spedUp) { worldmap.refreshMap(); }
                iHandler.Finish();
            }
            return finished;
        };
        worldmap.animIdx = setInterval(iHandler.state.animHandler, 10);
    },
    "TUTORIAL": function() { tutorial.startBattle(); },
    "LEAVETUTORIAL": function() {
        player.inventory = InventoryCopy(player.tempInventory);
        player.equipment = player.tempEquipment;
        player.hasFalcon = player.hadFalcon;
        player.tempInventory = undefined;
    },
    "FINISHTUTORIALATSTART": function() {
        if(tutorial.completed) {
            game.target = worldmap.importantEntities["convince"];
            worldmap.clearTarget();
        }
    },
    "FINISHTUTORIALSTANDALONE": function() { worldmap.writeText(tutorial.completed ? "finTut" : "quitTut"); },
    "ENEMY0": function() { worldmap.writeText(game.target.interactname + Math.floor(Math.random() * game.target.dialogMax)); },
    "ENEMY1": function() {
        var numEnemies = game.target.min + Math.round(Math.random() * (game.target.max - game.target.min));
        var actualEnemies = [game.target.enemies[0]];
        while(--numEnemies > 0) { actualEnemies.push(game.target.enemies[Math.floor(Math.random() * game.target.enemies.length)]); }
        combat.startBattle(actualEnemies);
    },
    "BEEGUARDIANAPPEAR": function() {
        game.target.visible = true;
        var xshift = 0;
        switch(worldmap.playerDir) {
            case 0: xshift = 12; break;
            case 1: xshift = 12; break;
            case 2: xshift = 13; break;
            case 3: xshift = 12; break;
        }
        game.target.anim.shiftX(xshift, 0).shiftY(0);
    }
};
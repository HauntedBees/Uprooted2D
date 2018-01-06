var iHandler = {
    moveSpeed: 0.025,
    state: { key: "", idx: 0, activeAnim: null, done: false, texts: [], animHandler: null },
    Start: function(startkey) {
        iHandler.state = { key: startkey, idx: 0, activeAnim: null, done: false, texts: [], animHandler: null };
        iHandler.Advance();
    },
    SpeedUpAnimation: function() {
        clearInterval(worldmap.animIdx);
        while(!iHandler.state.animHandler(true)) {}
    },
    SleepSkip: function() { iHandler.Finish(); return true; },
    Finish: function() {
        worldmap.forceMove = false;
        worldmap.forcedPlayerInfo = false;
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
        if(iHandler.state.done) { return worldmap.finishDialog(); }
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
                case "GIVE": var a = actSuffix.split(","); player.increaseItem(a[0].replace("~", "_"), parseInt(a[1])); break;
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
                case "HISPEED": iHandler.moveSpeed = 0.05; break;
                case "LOSPEED": iHandler.moveSpeed = 0.025; break;
                case "C2TEXT": CommandParser.Parse_Cash2Text(actSuffix.split(",")); break;
                case "SETPOSX": target.pos.x = parseFloat(actSuffix); break;
            }
        }
    },
    Parse_ShiftsAndFPS: function(target, args) {
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
    Parse_BasicPlayerFrame: function(args) {
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

var SpecialFunctions = {
    "WAIT": function() { },
    "GOTOTITLE": function() { game.transition(game.currentInputHandler, worldmap.title); },
    "SWITCHTOFALCON": function() { iHandler.Start("falcon"); },
    "SCREENSHAKE": function() {
        // TODO
    },
    "BIRDSONG.OGG": function() {
        // TODO
    },
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
    "MOBFLEE": function() {
        for(var i = worldmap.entities.length - 1; i >= 0; i--) {
            var e = worldmap.entities[i];
            if(e.mafia === true) { 
                player.clearedEntities.push(e.name);
                worldmap.entities.splice(i, 1);
            }
        }
        worldmap.refreshMap();
    },
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
    "UNPLUGOUTLET": function() {
        game.target.anim.shiftY(13);
        worldmap.importantEntities["MrShocky"].pos = { x: -1, y: -1 };
        worldmap.importantEntities["MrShocky"].moving = false;
        player.clearedEntities.push("MrShocky");
        worldmap.importantEntities["FarmTV"].moving = false;
        worldmap.importantEntities["FarmTV"].anim.shiftY(3);
        player.activeQuests["fakeFarm"] = 1;
        worldmap.refreshMap();
        worldmap.writeText("farmTVunplug2");
    },
    "FARMTVEND": function() {
        worldmap.writeText("farmTV5");
        game.target.pos = { x: -1, y: -1 };
        player.activeQuests["fakeFarm"] = 0;
        for(var i = 0; i < worldmap.entities.length; i++) {
            if(worldmap.entities[i].changeType === undefined) { continue; }
            switch(worldmap.entities[i].changeType) {
                case 0:
                    worldmap.entities[i].interact = undefined;
                    worldmap.entities[i].solid = false;
                    worldmap.entities[i].visible = false;
                    break;
                case 1:
                    var p = worldmap.entities[i].pos;
                    worldmap.entities[i].movement = commonMovementDatas.rectangle(p.x, p.y, 9, 0);
                    break;
                case 2:
                    var p = worldmap.entities[i].pos;
                    worldmap.entities[i].movement = commonMovementDatas.rectangle(p.x - 4, p.y, 4, 0, 1);
                    break;
                case 3:
                    var p = worldmap.entities[i].pos;
                    worldmap.entities[i].movement = commonMovementDatas.rectangle(p.x, p.y, 4, 0);
                    break;
                case 4:
                    var p = worldmap.entities[i].pos;
                    worldmap.entities[i].movement = commonMovementDatas.rectangle(p.x - 7, p.y, 7, 0, 1);
                    break;
                case 5:
                    var p = worldmap.entities[i].pos;
                    worldmap.entities[i].movement = commonMovementDatas.rectangle(p.x, p.y, 11, 0);
                    break;
                case 6:
                    var p = worldmap.entities[i].pos;
                    worldmap.entities[i].movement = commonMovementDatas.rectangle(p.x - 11, p.y, 11, 0, 1);
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
        for(var i = worldmap.entities.length - 1; i >= 0; i--) {
            var e = worldmap.entities[i].name;
            if(e.indexOf("H_") === 0) { 
                player.clearedEntities.push(e);
                worldmap.entities.splice(i, 1);
            }
        }
        worldmap.refreshMap();
        worldmap.writeText("smD6");
    },
    "DEADFISH": function() {
        for(var i = worldmap.entities.length - 1; i >= 0; i--) {
            var e = worldmap.entities[i].name;
            if(e.indexOf("SeaCreature") === 0) { 
                player.clearedEntities.push(e);
                worldmap.entities.splice(i, 1);
            }
        }
        worldmap.refreshMap();
        if(player.hasQuest("getHeart")) {
            player.activeQuests["getHeart"] = "heart";
        } else {
            player.activeQuests["getHeart"] = "weirdheart";
        }
        worldmap.writeText("bworkerA1");
    },
    "CONSTWORKWIN": function() {
        for(var i = worldmap.entities.length - 1; i >= 0; i--) {
            var e = worldmap.entities[i].name;
            if(e.indexOf("H_") === 0 || e.indexOf("Worker") >= 0) { 
                player.clearedEntities.push(e);
                worldmap.entities.splice(i, 1);
            }
        }
        worldmap.refreshMap();
        quests.completeQuest("helpSeaMonster");
        quests.completeQuest("getHeart");
        worldmap.writeText("bworkerB5");
    },
    "CONSTWORKFIGHT": function() {
        worldmap.writeText("bworkerMad6");
        player.activeQuests["helpSeaMonster"] = "gotEgg";
        for(var i = worldmap.entities.length - 1; i >= 0; i--) {
            var e = worldmap.entities[i].name;
            if(e.indexOf("Worker") >= 0) { 
                player.clearedEntities.push(e);
                worldmap.entities.splice(i, 1);
            }
        }
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
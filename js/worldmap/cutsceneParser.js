const cutsceneMoveSpeeds = [0.0375, 0.075, 0.1125];
const iHandler = {
    moveSpeed: cutsceneMoveSpeeds[0], isFirst: true,
    state: { key: "", idx: 0, activeAnim: null, done: false, texts: [], animHandler: null, postItems: [] },
    Start: function(startkey) {
        worldmap.dialogData = {};
        iHandler.state = { key: startkey, idx: 0, activeAnim: null, done: false, texts: [], animHandler: null, postItems: [] };
        iHandler.Advance(true);
    },
    SpeedUpAnimation: function() {
        clearInterval(worldmap.animIdx);
        while(!iHandler.state.animHandler(true)) {}
    },
    SleepSkip: function() { iHandler.Finish(); return true; },
    Finish: function() {
        if(worldmap.mapName !== "hq_6") {
            worldmap.forceMove = false;
        }
        worldmap.waitForAnimation = false;
        worldmap.refreshMap();
        clearInterval(worldmap.animIdx);
        iHandler.Advance();
    },
    Advance: function(isFirst) {
        iHandler.isFirst = isFirst || false;
        worldmap.inDialogue = true;
        if(iHandler.state.texts.length > 0) {
            const newText = iHandler.state.texts.splice(0, 1)[0];
            worldmap.writeText(newText);
            return;
        }
        const curKey = iHandler.state.key + (iHandler.state.idx++);
        console.log(curKey);
        const action = scripts[curKey];
        if(action === undefined) { iHandler.state.done = true; }
        if(iHandler.state.done) {
            if(iHandler.state.postItems.length > 0) {
                game.transition(game.currentInputHandler, worldmap.invClean, iHandler.state.postItems);
                iHandler.state.postItems = [];
            }
            if(game.target !== null) {
                if(game.target.moveToTalk) { game.target.moving = false; }
                else if(game.target.standAnim) { SetUpFellow(game.target, game.target.standAnim); }
            }
            return worldmap.finishDialog();
        }
        CommandParser.Parse(action);
    },
    HandleAnim: function(spedUp) {
        iHandler.state.activeAnim.target.pos.x += iHandler.state.activeAnim.dx * iHandler.moveSpeed;
        iHandler.state.activeAnim.target.pos.y += iHandler.state.activeAnim.dy * iHandler.moveSpeed;
        if(!spedUp) { worldmap.refreshMap(); }
        let finished = false, idx = iHandler.state.activeAnim.dx * 2 + iHandler.state.activeAnim.dy;
        switch(idx) {
            case 1: finished = (iHandler.state.activeAnim.target.pos.y >= iHandler.state.activeAnim.dest); break;
            case -1: finished = (iHandler.state.activeAnim.target.pos.y <= iHandler.state.activeAnim.dest); break;
            case 2: finished = (iHandler.state.activeAnim.target.pos.x >= iHandler.state.activeAnim.dest); break;
            case -2: finished = (iHandler.state.activeAnim.target.pos.x <= iHandler.state.activeAnim.dest); break;
        }
        if(finished) {
            switch(Math.abs(idx)) {
                case 1: iHandler.state.activeAnim.target.pos.y = iHandler.state.activeAnim.dest; break;
                case 2: iHandler.state.activeAnim.target.pos.x = iHandler.state.activeAnim.dest; break;
            }
            if(spedUp) { worldmap.refreshMap(); }
            iHandler.Finish();
        }
        return finished;
    }
};
const CommandParser = {
    ConditionCheck: function(json) {
        let d = worldmap.dialogData === null ? -1 : worldmap.dialogData.idx;
        for(let i = 0; i < json.length; i++) {
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
        const actions = s.split("&");
        for(let i = 0; i < actions.length; i++) {
            const splitter = actions[i].split("_");
            const name = splitter[0], action = splitter[1];
            const isPlayer = (name === "pl"), isTarget = (name === "targ");
            const target = name === "" ? null : (isPlayer ? worldmap : (isTarget ? game.target : worldmap.importantEntities[name]));
            const actDeets = action.split(":");
            const actSuffix = actDeets[1];
            switch(actDeets[0]) {
                // Player State Handlers
                case "CHIEVO": player.achievements.push(actSuffix); break;
                case "ALIGNTECH": player.shiftTech(parseFloat(actSuffix)); break;
                case "ALIGNGOOD": player.shiftEthics(parseFloat(actSuffix)); break;
                case "COMPLETEQUEST": quests.completeQuest(actSuffix); break;
                case "STARTQUEST": player.activeQuests[actSuffix] = 1; break;
                case "SETQUEST": var args = actSuffix.split(","); player.activeQuests[args[0]] = args[1]; break;
                case "GIVE": CommandParser.Parse_TryGive(actSuffix.split(",")); break;
                case "TAKE": var a = actSuffix.split(","); player.decreaseItem(a[0].replace("~", "_"), parseInt(a[1])); break;
                case "MONEY": player.AddMonies(parseInt(actSuffix)); break;
                case "LEVELUP": player.addExp(player.nextExp); player.levelUp(); break;
                // Animation Handling
                case "TALK": SetUpFellow(target, target.talkAnim); break;
                case "ANIM": SetUpFellow(target, actSuffix, isPlayer); break;
                case "MOVE": CommandParser.Parse_Movement(target, isPlayer, actSuffix); break;
                case "SETDIR": if(isPlayer) { target.playerDir = parseInt(actSuffix); } else { target.dir = parseInt(actSuffix); } break;
                case "SLEEP": worldmap.waitForAnimation = true; iHandler.state.animHandler = iHandler.SleepSkip; worldmap.animIdx = setTimeout(iHandler.Finish, parseInt(actSuffix)); break;
                case "HIHISPEED": iHandler.moveSpeed = cutsceneMoveSpeeds[2]; break;
                case "HISPEED": iHandler.moveSpeed = cutsceneMoveSpeeds[1]; break;
                case "LOSPEED": iHandler.moveSpeed = cutsceneMoveSpeeds[0]; break;
                case "STARTTRANSITIONANIM": game.startTransitionAnim(1, undefined, undefined, "justAnim"); break;
                case "TRANSITIONANIM": game.startTransitionAnim(-1); break;
                // Text
                case "TEXT": CommandParser.Parse_Text(actSuffix.split(",")); break;
                case "BLACKTEXT": CommandParser.Parse_BlackText(actSuffix); break;
                case "CLEARTEXT": gfx.clearSome(["menuA", "menutext"]); break;
                case "C2TEXT": CommandParser.Parse_Cash2Text(actSuffix.split(",")); break;
                // Target Manipulation
                case "ISMOVING": target.moving = (actSuffix === "true"); break;
                case "VISIBLE": target.visible = (actSuffix === "true"); break;
                case "SOLID": target.solid = (actSuffix === "true"); break;
                case "CLEARINTERACT": target.interact = undefined; break;
                case "SETPOSX": target.pos.x = parseFloat(actSuffix); break;
                case "SETTARGET": game.target = target; break;
                case "SETTARGETTONOTHING": game.target = null; break;
                case "PUSHCLEAREDTARGET": player.clearedEntities.push(actSuffix); break;
                case "CLEARTARGET": worldmap.clearTarget(); break;
                // Cutscene Logic
                case "SETSTATE": iHandler.state.idx = parseInt(actSuffix); break;
                case "QUIT": iHandler.state.done = true; worldmap.finishDialog(); break;
                case "END": iHandler.state.done = true; break;
                // Other
                case "FIGHT": combat.startBattle(actSuffix.split(",")); break;
                case "GO2": CommandParser.Parse_Transition(JSON.parse(actSuffix)); break;
                case "CUSTOM": CommandParser.Parse_Special(actSuffix); break;
            }
        }
    },
    Parse_TryGive: function(itemArr) {
        const itemName = itemArr[0].replace("~", "_");
        const itemAmt = parseInt(itemArr[1]) || 1;
        if(player.increaseItem(itemName, itemAmt)){ return; }
        iHandler.state.postItems.push([itemName, itemAmt]);
    },
    Parse_Transition: function(args) {
        if(args[0] === "same") {
            worldmap.pos = { x: args[1], y: args[2] };
        } else if(args[3] === undefined) {
            game.transition(game.currentInputHandler, worldmap, { init: { x: args[1],  y: args[2] }, map: args[0] });
        } else {
            game.transition(game.currentInputHandler, worldmap, { init: { x: args[1],  y: args[2] }, map: args[0], postCombat: args[3] });
        }
    },
    Parse_BlackText: function(args) { worldmap.writeText(args, undefined, undefined, undefined, true); },
    Parse_Text: function(args) {
        let text = args.splice(0, 1)[0];
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
        const text = args.splice(0, 1)[0];
        if(args.length > 0) {
            if(player.c2 === 0) {
                player.c2Rate = 500 + Math.floor(Math.random() * 500);
                player.c2BuyingRate = player.c2Rate;
            } else {
                player.c2Rate = RoundNear(player.c2BuyingRate * (0.5 + Math.random() * 0.45), 100);
            }
        }
        const formatting = [
            RoundNear(1000 / player.c2Rate, 100),      // 0 = C2 per 1000G
            player.c2Rate,                              // 1 = G per 1C2
            player.monies, player.c2,                   // 2 = your G, 3 = your C2
            RoundNear(player.c2 * player.c2Rate, 100)  // 4 = how much your C2 is worth, in G
        ];
        worldmap.writeText(text, args, false, formatting);
    },
    Parse_Movement: function(target, isPlayer, moveData) {
        let dx = 0, dy = 0;
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
    Parse_Special: id => SpecialFunctions[id]()
};

function ClearEntitiesUnderCondition(conditionFunc, refreshMap) {
    for(let i = worldmap.entities.length - 1; i >= 0; i--) {
        const e = worldmap.entities[i];
        if(conditionFunc(e)) { 
            player.clearedEntities.push(e.name);
            worldmap.entities.splice(i, 1);
        }
    }
    if(refreshMap) { worldmap.refreshMap(); }
}

const SpecialFunctions = {
    // Farm
    "CLEAROPENING": function() {
        worldmap.clearTarget();
        game.target = worldmap.importantEntities["nathanA"];
        worldmap.clearTarget();
    },
    "KABOOMHAUER": () => SpecialFunctions["FUCKINGBOOM"](worldmap.importantEntities["corpseBot"]),
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
        if(worldmap.importantEntities["nathanA"] !== undefined) { worldmap.importantEntities["n4"].pos = { x: 16, y: 9 }; }
        if(!player.completedQuest("openingCutscene")) { player.lastInn = "start"; }
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

    // Forest
    "LIMESTART": function() {
        const items = specialtyHelpers.getLimeItems();
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
    "GIVEGOLDEGG": function() {
        const egg = worldmap.importantEntities["GoldEgg"];
        egg.visible = true; egg.solid = true;
        if(Math.round(worldmap.pos.x) === 102 && Math.round(worldmap.pos.y) === 66) {
            egg.pos = { x: 104, y: 66 };
        } else {
            egg.pos = { x: 102, y: 66 };
        }
    },

    // Research Lab
    "SEEDSHOT": () => { player.health -= 2; game.target.hasShot = 5; },
    "SEEDSHOTKILL": function() {
        player.health = player.maxhealth;
        for(let i = 0; i < worldmap.entities.length; i++) {
            const newActive = worldmap.entities[i].initActive;
            if(worldmap.entities[i].rfd) {
                worldmap.entities[i].active = newActive;
                SetUpFellow(worldmap.entities[i], "Door" + worldmap.entities[i].type + (newActive ? "d" : ""));
                worldmap.entities[i].solid = !newActive;
            } else if(worldmap.entities[i].rf) {
                worldmap.entities[i].active = newActive;
                SetUpFellow(worldmap.entities[i], "Switch" + worldmap.entities[i].type + (newActive ? "d" : ""));
            }
        }
        game.transition(game.currentInputHandler, worldmap, { init: { x: 7.5,  y: 19 }, map: "belowvillage" });
    },
    "DRJEFFDROP": function() {
        worldmap.writeText("Pb2.12");
        SetUpFellow(worldmap.importantEntities["bonkedJeff"], "DrJeff4");
        worldmap.waitForAnimation = true;
        iHandler.state.animHandler = function(spedUp) {
            if(worldmap.importantEntities["bonkedJeff"].done) {
                if(spedUp) { worldmap.refreshMap(); iHandler.Finish(); }
                return true;
            }
            const finished = worldmap.importantEntities["bonkedJeff"].pos.y >= 2;
            if(finished) {
                if(spedUp) { worldmap.refreshMap(); iHandler.Finish(); }
                worldmap.importantEntities["bonkedJeff"].done = true;
            } else {
                worldmap.importantEntities["bonkedJeff"].pos.y += 0.25;
                worldmap.pos.y += 0.25;
                if(!spedUp) { worldmap.refreshMap(); }
            }
            return finished;
        };
        worldmap.animIdx = setInterval(iHandler.state.animHandler, 10);
    },
    "RAPSTART": function() {
        const items = specialtyHelpers.getRapItems();
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
    "GIVECROP": function() {
        const crop = worldmap.importantEntities["RAPSprout"];
        crop.visible = true; crop.solid = true;
        crop.pos = { x: 29, y: 10 };
    },

    // Bridge & Underwater
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
        worldmap.waitForAnimation = true;
        let state = 1;
        iHandler.state.animHandler = function(spedUp) {
            gfx.clearLayer("tutorial");
            const frame = state > 10 ? (20 - state) : state;
            gfx.DrawTransitionImage("bamham", game.tilew / 4, game.tileh / 4, frame);
            state += 0.25;
            const finished = state === 20;
            if(state === 10) { ClearEntitiesUnderCondition(e => e.name.indexOf("H_") === 0, true); }
            if(finished) {
                gfx.clearLayer("tutorial");
                iHandler.Finish();
            }
            return finished;
        };
        worldmap.animIdx = setInterval(iHandler.state.animHandler, 20);
        gfx.clearSome(["menuA", "menutext", "menucursorA"]);
    },
    "DEADFISH": function() {
        worldmap.importantEntities["seaCorpse"].visible = true;
        if(player.hasQuest("getHeart")) {
            player.activeQuests["getHeart"] = "heart";
        } else {
            player.activeQuests["getHeart"] = "weirdheart";
        }
        player.shiftEthics(-10);
        worldmap.writeText("bworkerA1");
    },
    "CONSTWORKWIN": function() {
        game.StartConstructionTransition();
        quests.completeQuest("helpSeaMonster");
        quests.completeQuest("getHeart");
        worldmap.writeText("bworkerB5", undefined, undefined, undefined, true);
    },
    "CONSTWORKFLEE": function() {
        worldmap.writeText("bworkerMad6");
        player.activeQuests["helpSeaMonster"] = "gotEgg";
        
        const fleeingWorkers = worldmap.entities.filter(e => e.name.indexOf("Worker") >= 0);
        fleeingWorkers.forEach(e => {
            e.dir = 1; e.moving = true;
            delete e.movement;
            if(e.pos.y === worldmap.pos.y) { e.pos.y -= 0.25; }
            if(e.name === "BeatWorker") { SetUpFellow(e, "SadConstrRun"); }
            else { SetUpFellow(e, "Worker"); }
        });
        worldmap.waitForAnimation = true;
        iHandler.state.animHandler = function(spedUp) {
            fleeingWorkers.forEach(e => {
                if(Math.floor(e.pos.x) === 5 && e.pos.y > 3.5) {
                    e.dir = 0;
                    e.pos.y -= 0.1125;
                } else { e.dir = 1; e.pos.x -= 0.1125; }
            });
            if(!spedUp) { worldmap.refreshMap(); }
            const finished = !fleeingWorkers.some(e => e.pos.x >= -1);
            if(finished) {
                if(spedUp) { worldmap.refreshMap(); }
                ClearEntitiesUnderCondition(e => e.name.indexOf("Worker") >= 0, false);
                iHandler.Finish();
            }
            return finished;
        };
        worldmap.animIdx = setInterval(iHandler.state.animHandler, 20);
    },
    "PIRATESTART": function() {
        const items = specialtyHelpers.getDowelItems();
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
        SetUpFellow(game.target, "Chest1");
        player.increaseItem("ultrarod", 4);
        quests.completeQuest("seamonkey");
        worldmap.writeText("chestUnlock3");
    },
    "GIVERICE": function() {
        game.target = worldmap.importantEntities["PirateField"];
        worldmap.clearTarget();
        const crop = worldmap.importantEntities["PirateRice"];
        crop.visible = true; crop.solid = true;
        crop.pos = { x: 30, y: 10 };
    },
    "GIVEGMO": function() {
        game.target = worldmap.importantEntities["PirateField"];
        worldmap.clearTarget();
        const crop = worldmap.importantEntities["PirateGMO"];
        crop.visible = true; crop.solid = true;
        crop.pos = { x: 30, y: 10 };
    },

    // Fake Farm
    "ENDTRANSITION": () => game.transitioning = false,
    "SETUPJEFF": function() {
        worldmap.playerDir = 0;
        worldmap.waitForAnimation = true;
        player.activeQuests["gotTire"] = 1;
        worldmap.importantEntities["FarmerJeff"].dir = 2;
        worldmap.importantEntities["FarmerJeff"].pos = { x: worldmap.pos.x, y: 25 };
        worldmap.importantEntities["FarmerJeff"].visible = true;
        worldmap.importantEntities["FarmerJeff"].moving = true;
    },
    "ENTERBARN": JumboEntrance,
    "EXITBARN": JumboExit,
    "FIXTIRE": function() {
        worldmap.writeText("bustedTruck1");
        quests.completeQuest("truckRepair");
        SetUpFellow(game.target, "TruckL");
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
            SetUpFellow(game.target, "Outlet2");
            player.activeQuests["fakeFarm"] = 1;
            player.questsCleared.push("unpluggedOutlet");
            if(worldmap.importantEntities["MrShocky"] !== undefined) {
                worldmap.importantEntities["MrShocky"].pos = { x: -1, y: -1 };
                worldmap.importantEntities["MrShocky"].moving = false;
                player.clearedEntities.push("MrShocky");
            }
        }
        if(worldmap.importantEntities["FarmTV"] !== undefined) {
            worldmap.importantEntities["FarmTV"].moving = false;
            SetUpFellow(worldmap.importantEntities["FarmTV"], "FTVOff");
        }
        worldmap.refreshMap();
    },
    "FARMTVEND": function(fromLoad) {
        if(!fromLoad) {
            worldmap.writeText("farmTV5");
            game.target.pos = { x: -1, y: -1 };
            player.activeQuests["fakeFarm"] = 0;
            player.lastInn = "fakefarm";
        }
        for(let i = 0; i < worldmap.entities.length; i++) {
            if(worldmap.entities[i].changeType === undefined) { continue; }
            const p = worldmap.entities[i].startingpos;
            switch(worldmap.entities[i].changeType) {
                case 0:
                    worldmap.entities[i].interact = undefined;
                    worldmap.entities[i].solid = false;
                    worldmap.entities[i].visible = false;
                    break;
                case 1:
                    worldmap.entities[i].movement = commonMovementDatas.line(p.x, p.y, 9);
                    break;
                case 2:
                    worldmap.entities[i].movement = commonMovementDatas.line(p.x - 4, p.y, 4, 1);
                    break;
                case 3:
                    worldmap.entities[i].movement = commonMovementDatas.line(p.x, p.y, 4);
                    break;
                case 4:
                    worldmap.entities[i].movement = commonMovementDatas.line(p.x - 7, p.y, 7, 1);
                    break;
                case 5:
                    worldmap.entities[i].movement = commonMovementDatas.line(p.x, p.y, 11);
                    break;
                case 6:
                    worldmap.entities[i].movement = commonMovementDatas.line(p.x - 11, p.y, 11, 1);
                    break;
                case 7:
                    worldmap.entities[i].solid = true;
                    worldmap.entities[i].visible = true;
                    break;
            }
        }
    },
    "CROUTONSTART": function() {
        const items = specialtyHelpers.getCroutonItems();
        if(items.length === 0) { worldmap.writeText("arf3"); iHandler.state.idx = 10; }
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

    // South City
    "ENTERSKUMPY": function() {
        worldmap.importantEntities["skumpyCover"].visible = false;
        worldmap.entities.forEach(e => { if(e.inside) { e.visible = true; } });
        worldmap.importantEntities["skumpy"].visible = true;
        worldmap.importantEntities["skumpy"].pos = { x: 40, y: 39 };
        SetUpFellow(worldmap.importantEntities["skumpy"], "Skumpy3");
        worldmap.importantEntities["skumpy"].moving = false;
        worldmap.refreshMap();
    },
    "SKUMPYTURN": function() {
        worldmap.pos.y = 39.25;
        stores["skumpys"].wares[0].price = 0;
        worldmap.importantEntities["bruno"].dir = 3;
        SetUpFellow(worldmap.importantEntities["skumpy"], "Skumpy4");
    },
    "SKUMPYCLEAN": function() {
        const temp = game.target;
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
        worldmap.entities.forEach(e => { if(e.inside) { e.visible = false; } });
        game.transition(game.currentInputHandler, worldmap, { init: { x: 41, y: 43 }, map: "southcity" });
    },
    "BRUNOBEAT": function() {
        worldmap.playerDir = directions.LEFT;
        SetUpFellow(worldmap.importantEntities["bruno"], "MobstyOut");
        SetUpFellow(worldmap.importantEntities["skumpy"], "Skumpy4");
    },
    "FORCEYZERO": () => worldmap.forcedY = 0,
    "UNFORCEYZERO": () => worldmap.forcedY = -1,
    "MOBFLEE": function() { ClearEntitiesUnderCondition(e => e.mafia === true, true); },
    "ABUELASTART": function() {
        const items = specialtyHelpers.getAbuelaItems();
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
    "ABUELADONE": function() {
        const abuela = worldmap.importantEntities["abuela"];
        abuela.moveToTalk = false;
        abuela.moving = true;
        SetUpFellow(abuela, "AbuelitaThrow");
    },

    // North City
    "THEGIFTOFEGG": function() {
        player.monies -= 250;
        let eggType = "egg";
        if(player.completedQuest("goodEgg") && Math.random() < 0.08) {
            eggType = "goldegg";
        } else {
            eggType = ["egg", "quail", "turkey", "goose", "platypus"][Math.floor(Math.random() * 5)];
        }
        player.increaseItem(eggType, 2);
        worldmap.writeText("eggBoy." + eggType);
    },
    "BEATROBBERS": function() {
        ClearEntitiesUnderCondition(e => e.robbery === true, false);
        worldmap.pos = { x: 6, y: 6 };
        const caughtRobbers = GetNoIMFellow("Strobbers", 7, 6, "CaughtRobber", { robbery: true });
        InitFellow(caughtRobbers);
        worldmap.entities.push(caughtRobbers);
        worldmap.importantEntities["caughtRobbers"] = caughtRobbers;
        for(let i = 0; i < 4; i++) {
            const x = 6 + (i % 2), y = 12 + (i < 2 ? 0 : 2);
            const newCopper = GetNoIMFellow("NewCop" + i, x, y, "Cop", { moving: true, robbery: true });
            InitFellow(newCopper);
            worldmap.entities.push(newCopper);
            worldmap.importantEntities["NewCop" + i] = newCopper;
        }
        worldmap.refreshMap();

        worldmap.waitForAnimation = true;
        iHandler.state.animHandler = function(spedUp) {
            for(let i = 0; i < 4; i++) {
                worldmap.importantEntities["NewCop" + i].pos.y -= 0.05;
            }
            if(!spedUp) { worldmap.refreshMap(); }
            const finished = worldmap.importantEntities["NewCop0"].pos.y <= 8;
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
            for(let i = 0; i < 4; i++) {
                if(i === 0) {
                    worldmap.importantEntities["NewCop" + i].pos.x -= 0.05;
                } else if(i === 1) {
                    worldmap.importantEntities["NewCop" + i].pos.x += 0.05;
                } else {
                    worldmap.importantEntities["NewCop" + i].pos.y -= 0.05;
                }
            }
            if(!spedUp) { worldmap.refreshMap(); }
            const finished = worldmap.importantEntities["NewCop2"].pos.y <= 8;
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
            for(let i = 0; i < 4; i++) {
                if(i === 2) {
                    worldmap.importantEntities["NewCop" + i].pos.x -= 0.05;
                } else if(i === 3) {
                    worldmap.importantEntities["NewCop" + i].pos.x += 0.05;
                } else {
                    worldmap.importantEntities["NewCop" + i].pos.y -= 0.05;
                }
            }
            if(!spedUp) { worldmap.refreshMap(); }
            const finished = worldmap.importantEntities["NewCop0"].pos.y <= 6;
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
            for(let i = 0; i < 4; i++) {
                worldmap.importantEntities["NewCop" + i].pos.y -= 0.05;
            }
            if(!spedUp) { worldmap.refreshMap(); }
            const finished = worldmap.importantEntities["NewCop2"].pos.y <= 7;
            if(finished) {
                if(spedUp) { worldmap.refreshMap(); }
                for(let i = 0; i < 4; i++) {
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
            for(let i = 1; i < 4; i++) {
                if(i === 2) {
                    worldmap.importantEntities["NewCop" + i].pos.x += 0.025;
                } else {
                    worldmap.importantEntities["NewCop" + i].pos.x -= 0.025;
                }
            }
            if(!spedUp) { worldmap.refreshMap(); }
            const finished = worldmap.importantEntities["NewCop1"].pos.x <= 7;
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
            for(let i = 1; i < 4; i++) {
                worldmap.importantEntities["NewCop" + i].pos.y += 0.025;
            }
            worldmap.importantEntities["caughtRobbers"].pos.y += 0.025;
            if(!spedUp) { worldmap.refreshMap(); }
            const finished = worldmap.importantEntities["NewCop1"].pos.y >= 16;
            if(finished) {
                if(spedUp) { worldmap.refreshMap(); }
                iHandler.Finish();
            }
            return finished;
        };
        worldmap.animIdx = setInterval(iHandler.state.animHandler, 10);
    },
    "FINISHCOPS": () => ClearEntitiesUnderCondition(e => e.robbery === true, false),
    "CATMAIL": () => player.activeQuests["catmail"] = 1,
    "NEWPHONE" : function() { worldmap.smartphone = new Smartphone(); player.questsCleared.push("gotPhone"); },
    "PHONEPRESS": function() { worldmap.smartphone.Read(); },
    "NERDUP": function() {
        player.hasNerd = true;
        worldmap.clearTarget();
        SetUpFellow(worldmap, "carrywalk", true);
        const HazardL = GetFellow("BarricadeL", 23, 2, 0, "HazardL", OneSpeak("blockedOff3F"), undefined, { big: true });
        const HazardR = GetFellow("BarricadeR", 25, 2, 0, "HazardL", OneSpeak("blockedOff3F"), undefined, { big: true });
        InitFellow(HazardL); InitFellow(HazardR);
        worldmap.entities.push(HazardL); worldmap.entities.push(HazardR);
        me.PLAYERMOVESPEED = me.BASEMOVESPEED / 2;
    },
    "NERDDOWN": function() {
        player.hasNerd = false;
        worldmap.clearTarget();
        SetUpFellow(worldmap, "walk", true);
        me.PLAYERMOVESPEED = me.BASEMOVESPEED;
        worldmap.importantEntities["trentSafe"].interact = OneSpeak("sleepingSavedNerd");
        worldmap.importantEntities["trentSafe"].visible = true;
        worldmap.importantEntities["trentSafe"].solid = true;
    },
    "NERDBOOM": () => SpecialFunctions["FUCKINGBOOM"](worldmap.importantEntities["mech"]),
    "MUSHSTART": function() {
        const items = specialtyHelpers.getMushItems();
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
    "C2BUY": function() { player.monies -= 1000; player.c2 = RoundNear(player.c2 + 1000 / player.c2Rate, 100); },
    "C2SELL": function() { player.AddMonies(Math.round(player.c2Rate)); player.c2 = RoundNear(player.c2 - 1, 100); },
    "DESTROYBUILDING": function() {
        worldmap.importantEntities["13thStBuildings"].filename = "covers/northcity2_post";
        for(let i = 0; i < worldmap.entities.length; i++) {
            if(worldmap.entities[i].destroyable) {
                player.clearedEntities.push(worldmap.entities[i].name);
                worldmap.entities[i].solid = false;
                worldmap.entities[i].visible = false;
                worldmap.entities[i].inside = false;
            } else if(worldmap.entities[i].name.indexOf("XNerndHaus") >= 0) {
                worldmap.entities[i].pos.y += 27;
            }
        }
    },

    // Food2 HQ
    "SETNERDBED": () => player.lastInn = "nerdBed",
    "ELEVATORSTART": function() {
        const items = specialtyHelpers.getHQElevatorOptions();
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
    "THEMONSTER": function() {
        const monster = GetNoIMFellow("Monster", worldmap.pos.x - 0.5, worldmap.pos.y - 2.25, "TheMonster", { big: true, isTheMonster: true });
        InitFellow(monster);
        worldmap.entities.push(monster);
        worldmap.importantEntities["monster"] = worldmap;
    },
    "BEATMONSTER": function() { ClearEntitiesUnderCondition(e => e.isTheMonster === true, true); },
    
    // Final Cutscene
    "PLAYERSTOP": function() {
        worldmap.importantEntities["pl2"].anim = plAnims.walk;
        worldmap.importantEntities["pl2"].visible = true;
        SetUpFellow(worldmap, "hidden", true);
        worldmap.forcedY = 10;
        worldmap.refreshMap();
    },
    "PLAYERSHOCK1": function() {
        worldmap.importantEntities["pl2"].anim = plAnims.shock1;
        worldmap.refreshMap();
    },
    "PLAYERSHOCK2": function() {
        worldmap.importantEntities["pl2"].anim = plAnims.shock2;
        worldmap.refreshMap();
    },
    "GARFIELDMYPEBBLES": function() {
        worldmap.importantEntities["pl2"].visible = false;
        SetUpFellow(worldmap, "walk", true);
        worldmap.entities.filter(e => e.autoplay === true)[0].interact = Cutscene("finalReturn");
    },
    "FLIPSHIT": function() {
        worldmap.waitForAnimation = true;
        iHandler.state.animHandler = function(spedUp) {
            let newY = 0;
            for(let i = 0; i < worldmap.entities.length; i++) {
                if(worldmap.entities[i].isFlippy !== true) { continue; }
                newY = worldmap.entities[i].animState;
                SetUpFellow(worldmap.entities[i], "FloorFlip" + newY);
                worldmap.entities[i].animState += 1;
            }
            if(!spedUp) { worldmap.refreshMap(); }
            const finished = (newY === 14);
            if(finished) {
                if(spedUp) { worldmap.refreshMap(); }
                iHandler.Finish();
            }
            return finished;
        };
        worldmap.animIdx = setInterval(iHandler.state.animHandler, 150);
    },

    // Falcon
    "BYEFALCON": () => player.hasFalcon = false,
    "SWITCHTOFALCON": () => iHandler.Start("falcon"),
    "BIRDSONG.OGG": function() {
        // TODO
    },
    "GETFALCONTEXT": function() {
        let keyStart = "falconMsg0.";
        let rangeMax = 6;
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
        for(let i = 1; i <= rangeMax; i++) { iHandler.state.texts.push(keyStart + i); }
        worldmap.writeText(keyStart + "0");
    },
    "FALCONSELECT": function() {
        game.currentInputHandler = worldmap.falconSelect;
        for(let i = 0; i < player.nathanSeeds.length; i++) {
            player.increaseItem(player.nathanSeeds[i][0], player.nathanSeeds[i][1]);
        }
        worldmap.falconSelect.setup();
    },
    "PLAYERREAD": function() {
        SetUpFellow(worldmap, "read", true);
        worldmap.refreshMap();
    },
    "ENTERTHEBIRD": function() {
        const bird = GetFellow("Eagle", worldmap.pos.x - 8, worldmap.pos.y - 3.5, 0, "Iii4", undefined, undefined, { moving: true });
        InitFellow(bird);
        worldmap.entities.push(bird);
        worldmap.importantEntities["bird"] = bird;

        worldmap.waitForAnimation = true;
        iHandler.state.animHandler = function(spedUp) {
            worldmap.importantEntities["bird"].pos.x += 0.05;
            worldmap.importantEntities["bird"].pos.y += 0.025;
            if(!spedUp) { worldmap.refreshMap(); }
            const finished = worldmap.importantEntities["bird"].pos.x >= (worldmap.pos.x - 1);
            if(finished) {
                SetUpFellow(worldmap.importantEntities["bird"], "Iii2");
                if(spedUp) { worldmap.refreshMap(); }
                iHandler.Finish();
            }
            return finished;
        };
        worldmap.animIdx = setInterval(iHandler.state.animHandler, 10);
    },
    "EXITTHEBIRDFINAL": function() {
        SetUpFellow(worldmap, "walk", true);
        worldmap.writeText("falconMsg5.8");
        iHandler.state.texts.push("falconMsg5.9");
        player.hasFalcon = true;
    },
    "EXITTHEBIRD1": function() {
        gfx.clearSome(["menuA", "menutext"]);
        SetUpFellow(worldmap.importantEntities["bird"], "Iii4");
        worldmap.waitForAnimation = true;
        SetUpFellow(worldmap, "walk", true);
        iHandler.state.animHandler = function(spedUp) {
            worldmap.importantEntities["bird"].pos.y -= 0.01;
            if(!spedUp) { worldmap.refreshMap(); }
            const finished = worldmap.importantEntities["bird"].pos.y <= (worldmap.pos.y - 1.5);
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
            const finished = worldmap.importantEntities["bird"].pos.x >= (worldmap.pos.x + 8);
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

    // Tutorials and Opening Cutscene
    "TUTORIAL": () => tutorial.startBattle(),
    "LEAVETUTORIAL": function() {
        player.inventory = InventoryCopy(player.tempInventory);
        player.equipment = player.tempEquipment;
        player.hasFalcon = player.hadFalcon;
        player.tempInventory = undefined;
        game.target = worldmap.importantEntities["hipster"];
        worldmap.clearTarget();
    },
    "FINISHTUTORIALATSTART": function() {
        if(tutorial.completed) {
            game.target = worldmap.importantEntities["convince"];
            worldmap.clearTarget();
        }
    },
    "FINISHTUTORIALSTANDALONE": () => worldmap.writeText(tutorial.completed ? "finTut" : "quitTut"),
    "STARTFIXTUT": () => fixTut.start(),
    "NOFIXTUT": () => player.fixtureTutorialState = 2,
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

    // Bee Guardian
    "BEEGUARDIANAPPEAR": function() {
        game.target.moving = true;
        game.target.dir = worldmap.InvertDir(worldmap.playerDir);
        SetUpFellow(game.target, "BeeQueen");
        game.target.visible = true;
    },
    "BEEQUEENMAD": function() {
        game.target = null;
        player.beeQueensFaced++;
        worldmap.angryBees = false;
        const enemy = player.beeQueensFaced < 2 ? "beeQueenA" : (player.beeQueensFaced < 5 ? "beeQueenB" : "beeQueenC");
        combat.startBattle([enemy]);
    },

    // Misc.
    "WAIT": function() { },
    "GOTOTITLE": () => game.transition(game.currentInputHandler, worldmap.title),
    "CREDITS": function() {
        JustBeatGameChievoCheck();
        return game.transition(game.currentInputHandler, worldmap.credits);
    },
    "SCREENSHAKE": function() {
        worldmap.waitForAnimation = true;
        iHandler.state.animHandler = function(spedUp) {
            worldmap.hijackedX = RoundNear(worldmap.pos.x - 0.25 + 0.5 * Math.random(), 8);
            worldmap.hijackedY = RoundNear(worldmap.pos.y - 0.25 + 0.5 * Math.random(), 8);
            worldmap.refreshMap();
            if(spedUp) {
                delete worldmap.hijackedX;
                delete worldmap.hijackedY;
                iHandler.Finish();
            }
            return spedUp;
        };
        worldmap.animIdx = setInterval(iHandler.state.animHandler, 125);
    },
    "TRUCKSTART": function() {
        const items = specialtyHelpers.getTruckOptions();
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
    "ENEMY0": function() {
        worldmap.writeText(game.target.interactname + Range(0, game.target.dialogMax));
        if(game.target.moveTalk) { game.target.moving = true; }
        if(game.target.isBuffNerd && game.target.dir === 2) { game.target.dir = 1; } // bad form, I know, I know, but it's 1AM
    },
    "ENEMY1": function() {
        if(game.target.setEnemies === undefined) {
            combat.startBattle(commonEnemyGenInfo[game.target.key]());
        } else {
            combat.startBattle(game.target.setEnemies);
        }
        if(game.target.moveTalk) { game.target.moving = false; }
    },
    "FUCKINGBOOM": function(target) {
        const boomboy = GetNoIMFellow("boom", target.pos.x, target.pos.y, "Kaboom", { moving: true, forcedY: Math.ceil(target.pos.y + 1) });
        InitFellow(boomboy);
        worldmap.entities.push(boomboy);
        let boomState = 0;
        worldmap.waitForAnimation = true;
        iHandler.state.animHandler = function(spedUp) {
            if(!spedUp) { worldmap.refreshMap(); }
            gfx.clearLayer("tutorial");
            if(boomState > 0) {
                let innerBoomy = boomState - 1;
                const key = "boom" + (innerBoomy < 5 ? innerBoomy : Math.min(4, 12 - innerBoomy));
                for(let x = 0; x < game.tilew; x++) {
                    for(let y = 0; y < game.tileh; y++) {
                        gfx.drawTileToGrid(key, x, y, "tutorial");
                    }
                }
            }
            const finished = (++boomState) > 13;
            if(boomState === 4) {
                for(let i = worldmap.entities.length - 1; i >= 0; i--) {
                    if(worldmap.entities[i].name === target.name) {
                        worldmap.entities.splice(i, 1);
                        break;
                    }
                }
                worldmap.entities.pop();
            }
            if(finished) {
                gfx.clearLayer("tutorial");
                let firstTop = InclusiveRange(0, 1);
                for(let i = 0; i < 2; i++) {
                    const smonk = GetNoIMFellow("boom", target.pos.x + i, target.pos.y + (i === 0 ? firstTop : (1 - firstTop)), "Smonk", { debris: true, moving: true, forcedY: target.pos.y + 1 });
                    InitFellow(smonk);
                    worldmap.entities.push(smonk);
                }
                if(spedUp) { worldmap.refreshMap(); }
                iHandler.Finish();
            }
            return finished;
        };
        worldmap.animIdx = setInterval(iHandler.state.animHandler, 50);
    },
    "CLEANBOOM": () => ClearEntitiesUnderCondition(e => e.debris === true, true)
};
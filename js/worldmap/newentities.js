var iHandler = {
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
        iHandler.state.activeAnim.target.pos.x += iHandler.state.activeAnim.dx * 0.025;
        iHandler.state.activeAnim.target.pos.y += iHandler.state.activeAnim.dy * 0.025;
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
                case "ANIMSTATE": CommandParser.Parse_ShiftsAndFPS(target, JSON.parse(actSuffix)); break;
                case "ISMOVING": target.moving = (actSuffix === "true"); break;
                case "CLEARTEXT": gfx.clearSome(["menuA", "menutext"]);break;
                case "GO2": CommandParser.Parse_Transition(JSON.parse(actSuffix)); break;
                case "VISIBLE": target.visible = (actSuffix === "true"); break;
                case "CLEARTARGET": worldmap.clearTarget(); break;
                case "SETTARGET": game.target = target; break;
                case "END": iHandler.state.done = true; break;
                case "GIVE": var a = actSuffix.split(","); player.increaseItem(a[0].replace("~", "_"), parseInt(a[1])); break;
                case "TAKE": var a = actSuffix.split(","); player.decreaseItem(a[0].replace("~", "_"), parseInt(a[1])); break;
                case "SHIFTY": target.anim.shiftY(parseInt(actSuffix)); break;
                case "COMPLETEQUEST": player.questsCleared.push(actSuffix); break;
                case "STARTQUEST": player.activeQuests[actSuffix] = 1; break;
                case "FIGHT": combat.startBattle(actSuffix.split(",")); break;
                case "SETSTATE": iHandler.state.idx = parseInt(actSuffix); break;
                case "MONEY": player.monies += parseInt(actSuffix); break;
                case "QUIT": iHandler.state.done = true; worldmap.finishDialog(); break;
            }
        }
    },
    Parse_ShiftsAndFPS: function(target, args) {
        target.anim.shiftY(args[0]).shiftX(args[1], args[2]).setFPS(args[3]);
        if(args[4] !== undefined) { target.moving = args[4]; }
    },
    Parse_Transition: function(args) {
        game.transition(game.currentInputHandler, worldmap, { init: { x: args[1],  y: args[2] }, map: args[0] });
    },
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
            moveData = parseInt(moveData.substring(1));
            dy = (moveData > target.pos.y) ? 1 : -1;
        } else {
            moveData = parseInt(moveData.substring(1));
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
        else {  worldmap.writeText("lime4", items); }
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
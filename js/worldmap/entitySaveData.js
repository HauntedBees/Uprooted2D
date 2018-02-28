let mapStates = {
    "producestand": {}, "farm": {}, "firstvillage": {}, "forest": {}, "belowvillage": {},
    "researchfacility": { rf: [false, false, false] }, 
    "bridge": {}, "underwater": {}, 
    "fakefarm": { inside: false }, 
    "southcity": { inside: false }, 
    "northcity": { inside: false }, 
    "hq_1": { rf: [false, false, false] }, 
    "hq_2": {}, "hq_3": {}, "hq_4": {}, "hq_5": {}, "hq_6": {}
};
let stateBinders = {
    "storePositions": function(mapName) {
        if(mapStates[mapName] === undefined) { return; }
        mapStates[mapName].ents = {};
        for(let i = 0; i < worldmap.entities.length; i++) {
            const e = worldmap.entities[i];
            if(e.movement === undefined) { continue; }
            if(e.name[0] === "~") {
                mapStates[mapName].ents[e.name] = {
                    pos: e.pos, movement: e.movement, dir: e.dir,
                    key: e.key, fx: e.fx, metadataid: e.metadataid, param: e.param
                };
            } else {
                mapStates[mapName].ents[e.name] = { pos: e.pos, movement: e.movement, dir: e.dir };
            }
        }
    },
    "hq_3": () => { if(worldmap.horRor !== null) { mapStates["hq_3"].room = worldmap.horRor.playerRoom; } }
};
let mapRefreshes = {
    "resetData": function(mapname, fromSave, justStateLoad) {
        const ents = mapStates[mapname].ents;
        const addtlFunc = mapRefreshes[mapname];
        if(fromSave) {
            for(const name in ents) {
                if(name[0] !== "~") { continue; }
                const e = ents[name];
                worldmap.entities.push(GetREnemy(e.key, e.pos.x, e.pos.y, e.fx, e.dir, e.movement, e.metadataid, e.param));
            }
        }
        for(let i = 0; i < worldmap.entities.length; i++) {
            const e = worldmap.entities[i];
            if(addtlFunc !== undefined) { addtlFunc(e, fromSave); }
            if(!justStateLoad) { mapRefreshes.extractPosition(e, ents); }
        }
    },
    "extractPosition": function(e, ents) {
        if(ents !== undefined && ents[e.name] !== undefined) { 
            e.pos = ents[e.name].pos;
            e.movement = ents[e.name].movement;
            e.dir = ents[e.name].dir;
        }
    },
    "insideCheck": function(e, mapName) {
        const inside = mapStates[mapName].inside;
        if(e.inside) { e.visible = inside; }
        else if(e.jumbo) { e.visible = !inside; }
    },
    "switchCheck": function(e, mapName, fromSave) {
        if(!fromSave) { return; }
        const rfinfo = mapStates[mapName].rf;
        if(e.rfd) {
            if(!rfinfo[e.type]) { return; }
            const newActive = !e.active;
            e.active = newActive;
            e.anim.shiftY(newActive ? 3 : 2);
            e.solid = !newActive;
        } else if(e.rf) {
            if(!rfinfo[e.type]) { return; }
            const newActive = !e.active;
            e.active = newActive;
            e.anim.shiftY(newActive ? 1 : 0);
        }
    },
    "producestand": function(e) { if(e.name === "ConvinceATron") { e.visible = true; } },
    "researchfacility": (e, fromSave) => mapRefreshes.switchCheck(e, "researchfacility", fromSave),
    "fakefarm": function(e) {
        const paq = (player.activeQuests["fakeFarm"] === undefined ? -1 : player.activeQuests["fakeFarm"]);
        if(paq >= 0) {
            SpecialFunctions["FARMTVEND"](true);
            worldmap.importantEntities["fuckOffFarmerJeff"].pos = { x: -1, y: -1 };
        }
        if(player.completedQuest("unpluggedOutlet")) {
            SpecialFunctions["UNPLUGOUTLET"](true);
            worldmap.importantEntities["outlet"].anim.shiftY(13);
        }
        if(worldmap.importantEntities["FarmerJeff"] !== undefined) {
            worldmap.importantEntities["FarmerJeff"].interact = undefined;
            worldmap.importantEntities["FarmerJeff"].visible = false;
        }
        if(player.hasOrHasHadQuest("gotTire")) {
            worldmap.importantEntities["tire"].anim.shiftY(9);
            if(player.hasQuestState("gotTire", 1)) {
                worldmap.importantEntities["FarmerJeff"].dir = 0;
                worldmap.importantEntities["FarmerJeff"].pos = { x: 14.5, y: 31.5 };
                worldmap.importantEntities["FarmerJeff"].visible = true;
                worldmap.importantEntities["FarmerJeff"].moving = false;
            }
        }
        if(player.completedQuest("truckRepair")) {
            worldmap.importantEntities["ltruck"].anim.shiftY(0);
            worldmap.importantEntities["ltruck"].interact = Cutscene("truck");
        }
        mapRefreshes.insideCheck(e, "fakefarm");
    },
    "southcity": e => mapRefreshes.insideCheck(e, "southcity"),
    "northcity": function(e) {
        if(e.name === "Mailman" && player.hasOrHasHadQuest("keycard")) { SpecialFunctions["DESTROYBUILDING"](); }
        mapRefreshes.insideCheck(e, "northcity");
    },
    "hq_1": (e, fromSave) => { mapRefreshes.insideCheck(e, "hq_1"); mapRefreshes.switchCheck(e, "hq_1", fromSave); },
    "hq_3": function(e) {
        if(e.name !== "TheMonster") { return; }
        const startingRoom = mapStates["hq_3"].room;
        worldmap.horRor = new HorRor(startingRoom);
        ToggleChungus(true, { chungi: [startingRoom] });
        if(player.hasQuestState("helpNerd", "helping")) {
            SpecialFunctions["NERDUP"]();
        }
    },
    "hq_4": function(e) { if(e.name === "EndOfTheRoad" && player.completedQuest("theBeeQuest")) { e.visible = true; } }
};
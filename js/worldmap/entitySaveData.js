let mapStates = {
    "producestand": {}, "farm": {}, "firstvillage": {}, "forest": {}, "belowvillage": {},
    "researchfacility": { rf: [false, false, false] }, 
    "bridge": {}, "underwater": {}, "molehome": {}, 
    "fakefarm": { inside: false }, 
    "southcity": { inside: false }, 
    "northcity": { inside: false }, 
    "hq_1": { rf: [false, false, false] }, 
    "hq_2": {}, "hq_3": {}, "hq_4": {}, "hq_5": {}, "hq_6": {},
    "northcity_NG": { inside: false },
    "northcity_NB": { inside: false },
    "northcity_IG": { inside: false },
    "northcity_IB": { inside: false }
};
let stateBinders = {
    "storePositions": function(mapName) {
        if(mapStates[mapName] === undefined) { return; }
        mapStates[mapName].ents = {};
        for(let i = 0; i < worldmap.entities.length; i++) {
            const e = worldmap.entities[i];
            if(e.noSave === true) { continue; }
            if(e.name[0] === "~") {
                mapStates[mapName].ents[e.name] = {
                    pos: e.pos, movement: e.movement, dir: e.dir, lastAnim: e.lastAnim,
                    key: e.key, fx: e.fx, metadataid: e.metadataid, param: e.param,
                    visible: e.visible, solid: e.solid
                };
            } else {
                mapStates[mapName].ents[e.name] = {
                    pos: e.pos, movement: e.movement, dir: e.dir, lastAnim: e.lastAnim,
                    visible: e.visible, solid: e.solid
                };
            }
        }
    },
    "hq_3": () => { if(worldmap.horRor !== null) { mapStates["hq_3"].room = worldmap.horRor.playerRoom; } }
};
let mapRefreshes = {
    "resetData": function(mapname, fromSave, justStateLoad) {
        if(mapname === "cave" || mapname === "molehome") { return; }
        const ents = mapStates[mapname].ents || {};
        const addtlFunc = mapRefreshes[mapname];
        if(fromSave) {
            for(const name in ents) {
                if(name[0] !== "~") { continue; }
                const e = ents[name];
                let newEnemy = null;
                if(mapname === "fakefarm") {
                    newEnemy = GetREnemy(e.key, e.pos.x, e.pos.y, e.fx, e.dir, e.movement, e.metadataid, e.param, true);
                } else {
                    newEnemy = GetREnemy(e.key, e.pos.x, e.pos.y, e.fx, e.dir, e.movement, e.metadataid, e.param);
                }
                newEnemy.solid = e.solid; newEnemy.visible = e.visible;
                SetUpFellow(newEnemy, e.lastAnim);
                worldmap.entities.push(newEnemy);
            }
        }
        for(let i = 0; i < worldmap.entities.length; i++) {
            const e = worldmap.entities[i];
            if(addtlFunc !== undefined) { addtlFunc(e, fromSave); }
            if(!justStateLoad) { mapRefreshes.extractPosition(e, ents); }
        }
    },
    "extractPosition": function(e, ents) {
        const saveValue = ents[e.name];
        if(ents !== undefined && saveValue !== undefined) { 
            e.pos = saveValue.pos;
            e.movement = saveValue.movement;
            e.dir = saveValue.dir;
            e.visible = saveValue.visible;
            e.solid = saveValue.solid;
            if(e.name === "BadInfluenceRabbit") {
                if(player.options.canSayFuck) {
                    SetUpFellow(e, "Rabbit");
                } else {
                    SetUpFellow(e, "RabbitClean");
                }
            } else {
                if(e.name === "SeaMidTop") { e.moving = false; }
                SetUpFellow(e, saveValue.lastAnim);
            }
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
            SetUpFellow(e, "Door" + e.type + (newActive ? "d" : ""));
            e.solid = !newActive;
        } else if(e.rf) {
            if(!rfinfo[e.type]) { return; }
            const newActive = !e.active;
            e.active = newActive;
            SetUpFellow(e, "Switch" + e.type + (newActive ? "d" : ""));
        }
    },
    "producestand": function(e) { if(e.name === "ConvinceATron") { e.visible = true; } },
    "researchfacility": (e, fromSave) => mapRefreshes.switchCheck(e, "researchfacility", fromSave),
    "fakefarm": function(e) {
        const paq = (player.activeQuests["fakeFarm"] === undefined ? -1 : player.activeQuests["fakeFarm"]);
        if(paq >= 0) {
            SpecialFunctions["FARMTVEND"](true);
            if(worldmap.importantEntities["fuckOffFarmerJeff"] !== undefined) {
                worldmap.importantEntities["fuckOffFarmerJeff"].pos = { x: -1, y: -1 };
            }
        }
        if(player.completedQuest("unpluggedOutlet")) {
            SpecialFunctions["UNPLUGOUTLET"](true);
            SetUpFellow(worldmap.importantEntities["outlet"], "Outlet2");
        }
        if(worldmap.importantEntities["FarmerJeff"] !== undefined) {
            worldmap.importantEntities["FarmerJeff"].interact = worldmap.entities.filter(e=>e.name==="CS_skunk2")[0].interact;
            worldmap.importantEntities["FarmerJeff"].visible = false;
        }
        if(player.hasOrHasHadQuest("gotTire")) {
            SetUpFellow(worldmap.importantEntities["tire"], "Tire2");
            if(player.hasQuestState("gotTire", 1)) {
                worldmap.importantEntities["FarmerJeff"].dir = 0;
                worldmap.importantEntities["FarmerJeff"].pos = { x: 14.5, y: 31.5 };
                worldmap.importantEntities["FarmerJeff"].visible = true;
                worldmap.importantEntities["FarmerJeff"].moving = false;
            }
        }
        if(player.completedQuest("truckRepair")) {
            SetUpFellow(worldmap.importantEntities["ltruck"], "TruckL");
            worldmap.importantEntities["ltruck"].interact = Cutscene("truck");
        }
        mapRefreshes.insideCheck(e, "fakefarm");
    },
    "southcity": function(e) {
        mapRefreshes.insideCheck(e, "southcity");
        if(e.name === "Abuela" && player.completedQuest("abuelitaBonita")) {
            SpecialFunctions["ABUELADONE"]();
        }
    },
    "northcity": function(e) {
        if(e.name === "Mailman" && player.hasOrHasHadQuest("keycard")) { SpecialFunctions["DESTROYBUILDING"](); }
        mapRefreshes.insideCheck(e, "northcity");
    },
    "northcity_NG": function(e) { mapRefreshes.insideCheck(e, "northcity_NG"); },
    "northcity_NB": function(e) { mapRefreshes.insideCheck(e, "northcity_NB"); },
    "northcity_IG": function(e) { mapRefreshes.insideCheck(e, "northcity_IG"); },
    "northcity_IB": function(e) { mapRefreshes.insideCheck(e, "northcity_IB"); },
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
    "hq_4": function(e) { if(e.name === "SavedWorker" && player.completedQuest("helpNerd")) { e.interact = OneSpeak("sleepingSavedNerd"); e.visible = true; e.solid = true; } },
    "hq_6": function(e) { if(e.name === "cutscene_final" && player.failedEntities.indexOf("ChuddsMakenzie") >= 0) { e.interact = Cutscene("finalReturn"); } }
};
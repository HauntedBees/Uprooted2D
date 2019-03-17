let player = {
    health: 25, maxhealth: 25, atk: 3, def: 2, luck: 0.7, hasFalcon: true, saveVersion: 0.5, 
    c2: 0, c2Rate: 1, beeQueensFaced: 0, nathanSeeds: [["beet", 10], ["carrot", 10], ["ginger", 5]],
    level: 1, exp: 0, nextExp: 4, totalExp: 0, ethicsAxis: 0, techAxis: 0, // 1 = good/tech, -1 = bad/nature
    monies: 1000, playTime: 0, visitedMaps: [], openedChests: [],
    miscdata: { seasonsPlanted: [0, 0, 0, 0], cropsPlanted: {}, techFixturesUsed: 0, 
                typesPlanted: { "veg": 0, "tree": 0, "bee": 0, "rice": 0, "rod": 0, "water": 0, "cow": 0, "mush": 0, "egg": 0, "tech": 0 },
              },
    clearedEntities: [], achievements: [], failedEntities: [], 
    questsCleared: [], activeQuests: {}, fixtureTutorialState: 0, 
    lastInn: "start",
    options: {
        difficulty: 1, 
        music: 10, sound: 10,
        controltype: 0, canSayFuck: 0, 
        stickyMovement: 0, ignoreMouse: 0, virtualController: 0, 
        font: 0, resolution: 1, fullscreen: 0, gfxfilter: 0
    },
    noFunDiffMod: 0, // positive = harder, negative = easier
    controls: { up: "w", left: "a", down: "s", right: "d", confirm: " ", cancel: "q", pause: "Enter" },
    keyboardcontrols: { up: "w", left: "a", down: "s", right: "d", confirm: " ", cancel: "q", pause: "Enter" },
    gamepadcontrols: { up: "Gamepad12", left: "Gamepad14", down: "Gamepad13", right: "Gamepad15", confirm: "Gamepad0", cancel: "Gamepad1", pause: "Gamepad9" },
    equipment: { weapon: "!babySickle", compost: "!weakCompost", gloves: null, soil: null },
    setMapPosition: function() {
        player.mapName = worldmap.mapName;
        player.mapPos = worldmap.pos;
        player.mapDir = worldmap.playerDir;
    },
    getSheetPath: function() {
        switch(player.options.gfxfilter) {
            case 0:
            case 3: return "img";
            case 1: return "imgs4x";
            case 2: return "imghq4x";
        }
    },
    getPlayTimeString: function(time) {
        time = time || this.playTime;
        var hours = Math.floor(time / 3600);
        time -= hours * 3600;
        var minutes = Math.floor(time / 60);
        time -= minutes * 60;
        return (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes + ":" + (time < 10 ? "0" : "") + time;
    },
    tutorialEquipment: { weapon: "!goodSickle", compost: "!weakCompost", gloves: null, soil: null },
    tutorialInventory: [["specialgrapes", 1], ["carrot", 2], ["beet", 3], ["!weakCompost", 1], ["!babySickle", 1]],
    inventory: [["carrot", 6], ["beet", 4], ["garlic", 2], ["banana", 3], ["!weakCompost", 1], ["!babySickle", 1]],
    shiftEthics: function(d) { // + = good, - = bad
        player.ethicsAxis += d;
        if(player.ethicsAxis > 5) { player.ethicsAxis = 5; }
        else if(player.ethicsAxis < -5) { player.ethicsAxis = -5; }
    },
    shiftTech: function(d) { // + = tech, - = nature
        player.techAxis += d;
        if(player.techAxis > 5) { player.techAxis = 5; }
        else if(player.techAxis < -5) { player.techAxis = -5; }
    },
    gridWidth: 3, gridHeight: 3, gridLevel: "n",
    itemGrid: null,
    hasUsedFish: () => (player.miscdata.typesPlanted["rod"] + player.miscdata.typesPlanted["water"]) > 0,
    hasAchievement: a => player.achievements.indexOf(a) >= 0,
    hasQuest: q => player.activeQuests[q] !== undefined,
    hasQuestState: (q, state) => player.activeQuests[q] !== undefined && state === player.activeQuests[q],
    completedQuest: q => player.questsCleared.indexOf(q) >= 0,
    hasOrHasHadQuest: q => player.questsCleared.indexOf(q) >= 0 || player.activeQuests[q] !== undefined,
    hasItem: function(item, amount) {
        amount = amount || 1;
        for(var i = 0; i < player.inventory.length; i++) {
            if(player.inventory[i][0] === item && player.inventory[i][1] >= amount) { return true; }
        }
        return false;
    },
    getItemAmount: function(item) {
        for(var i = 0; i < player.inventory.length; i++) {
            if(player.inventory[i][0] === item) { return player.inventory[i][1]; }
        }
        return 0;
    },
    isEquipped: function(item) {
        return this.equipment.weapon === item || this.equipment.compost === item || this.equipment.gloves === item || this.equipment.soil === item || this.equipment.armor === item;
    },
    expandGrid: function (newwidth, newheight, newLevel) {
        var oldwidth = this.gridWidth, oldheight = this.gridHeight;
        if(this.itemGrid === null) {
            this.itemGrid = [];
            oldwidth = 0; oldheight = 0;
        }
        for(var x = 0; x < newwidth; x++) {
            if(x < oldwidth) {
                for(var y = oldheight; y < newheight; y++) {
                    this.itemGrid[x].push(null);
                }
            } else {
                var row = [];
                for(var y = 0; y < newheight; y++) { row.push(null); }
                this.itemGrid.push(row);
            }
        }
        this.gridWidth = newwidth;
        this.gridHeight = newheight;
        this.gridLevel = newLevel;
    },
    initGridDimensions: function() { if(this.itemGrid === null) { this.itemGrid = combat.getGrid(this.gridWidth, this.gridHeight); } },
    addExp: function(n) { this.totalExp += n; if(this.level < 20) { this.exp += n; } },
    levelUp: function() {
        if(this.level >= 20) { return; }
        this.level++;
        this.exp -= this.nextExp;
        this.maxhealth = levelStats.hp[this.level - 1];
        this.health = this.maxhealth;
        this.atk = levelStats.atk[this.level - 1];
        this.def = levelStats.def[this.level - 1];
        this.luck = 0.7 + (this.level / 100);
        this.nextExp = Math.floor(this.level * this.level * 3.25 * Math.pow(1.02, this.level - 2));
        this.getLevelUpItemBonuses();
    },
    canMelee: function(numEnemyCrops) {
        if(player.equipment.weapon === null) { return false; }
        var weapon = GetEquipment(player.equipment.weapon);
        if(numEnemyCrops === 0) {
            return !weapon.noEnemies;
        } else {
            return weapon.targetCrops || !weapon.noEnemies;
        }
    },
    getLevelUpItemBonuses: function() {
        let items = [];
        if(this.level % 2 === 0) { items.push(["carrot", this.level - 1]); items.push(["beet", this.level - 1]); }
        if(this.level % 3 === 0) { items.push(["ginger", Math.ceil(this.level / 2)]); }
        if(this.level % 4 === 0) { items.push(["corn", Math.ceil(this.level / 3)]); }
        if(this.level % 5 === 0) { items.push(["bellpepper", Math.ceil(this.level / 4)]); }
        if(this.level % 6 === 0) { items.push(["asparagus", Math.ceil(this.level / 2)]); }
        if(this.level % 7 === 0) { items.push(["spinach", 2]); items.push(["tomato", 2]); items.push(["beet", 2]); items.push(["radish", 2]); }
        if(this.level % 8 === 0) { items.push(["pineapple", Math.ceil(this.level / 3)]); }
        if(this.level % 9 === 0) { items.push(["leek", Math.ceil(this.level / 2)]); }
        if(this.level % 10 === 0) { items.push(["garlic", this.level]); }

        if(this.level < 10) { items.push(["banana"]); items.push(["apple"]); }
        else if(this.level < 12) { items.push(["grapes", 2]); items.push(["blackberry", 2]); }
        else if(this.level < 14) { items.push(["avocado"]); items.push(["blackberry", 3]); items.push(["banana", 2]); }
        else if(this.level < 16) { items.push(["avocado", 2]); items.push(["apricot"]); items.push(["blackberry", 2]); }
        else { items.push(["kiwi", 2]); items.push(["avocado", 2]); items.push(["apricot", 2]); }
        
        const isHard = (player.options.difficulty === 2);
        items.forEach(e => player.increaseItem(e[0], isHard ? 1 : e[1]));
    },
    canAttackAfterPlanting: function() {
        if(this.equipment.gloves === null) { return 0; }
        var equipInfo = GetEquipment(this.equipment.gloves);
        return equipInfo.canAttack;
    },
    getCompostMax: function() {
        if(this.equipment.compost === null) { return 0; }
        var equipInfo = GetEquipment(this.equipment.compost);
        return equipInfo.amount;
    },
    getCropSpeedMultiplier: function() {
        if(this.equipment.soil === null) { return 1; }
        var equipInfo = GetEquipment(this.equipment.soil);
        return (equipInfo.speed + 1);
    },
    getPlantingTurns: function() {
        if(this.equipment.gloves === null) { return 1; }
        var equipInfo = GetEquipment(this.equipment.gloves);
        return equipInfo.amount;
    },
    canAttackWithCompost: function() {
        if(this.equipment.compost === null) { return false; }
        var equipInfo = GetEquipment(this.equipment.compost);
        return equipInfo.canAttack;
    },
    canSickleCrops: function() {
        if(this.equipment.weapon === null) { return false; }
        var equipInfo = GetEquipment(this.equipment.weapon);
        return equipInfo.targetCrops;
    },
    canAttackPeople: function() {
        if(this.equipment.weapon === null) { return true; }
        var equipInfo = GetEquipment(this.equipment.weapon);
        return !equipInfo.noEnemies;
    },
    getSickleAttackBonus: function(season) {
        if(this.equipment.weapon === null) { return 0; }
        var equipInfo = GetEquipment(this.equipment.weapon);
        var bonus = equipInfo.power;
        if(season === 0 && equipInfo.sp) { bonus += equipInfo.sp; }
        else if(season === 1 && equipInfo.su) { bonus += equipInfo.su; }
        else if(season === 2 && equipInfo.au) { bonus += equipInfo.au; }
        else if(season === 3 && equipInfo.wi) { bonus += equipInfo.wi; }
        return bonus;
    },
    decreaseItem: function(name, amount) {
        var idx = -1;
        for(var i = 0; i < player.inventory.length; i++) {
            if(player.inventory[i][0] === name) {
                player.inventory[i][1] -= (amount || 1);
                idx = i;
                break;
            }
        }
        if(idx < 0) { return false; }
        if(player.inventory[idx][1] <= 0) {
            player.inventory.splice(idx, 1);
            return false;
        }
        return true;
    },
    clearItemIfEmpty: function(name) {
        for(let i = player.inventory.length - 1; i >= 0; i--) {
            if(player.inventory[i][0] !== name) { continue; }
            if(player.inventory[i][1] <= 0) {
                player.inventory.splice(i, 1);
                return true;
            }
            return false;
        }
        return false;
    },
    increaseItem: function(name, amount) {
        if(name === "_beehive" && player.clearedEntities.indexOf("FarmHive") >= 0
                                && player.clearedEntities.indexOf("BelowHive") >= 0
                                && player.clearedEntities.indexOf("ForestHive") >= 0
                                && player.clearedEntities.indexOf("KelpBeehive") >= 0
                                && player.clearedEntities.indexOf("OfficeHive") >= 0) {
            AddAchievementIfMissing("beeKing");
        }
        if(amount === undefined) { amount = 1; }
        let numOfType = 0;
        const type = name[0] === "!" ? "!" : (name[0] === "_" ? "_" : "C");
        for(var i = 0; i < player.inventory.length; i++) {
            if(player.inventory[i][0] === name) {
                player.inventory[i][1] += amount;
                return true;
            }
            const front = player.inventory[i][0][0];
            if(front !== "!" && front !== "_" && type === "C") { numOfType++; }
        }
        if(numOfType === 36) { return false; }
        if(amount === 0) { return true; }
        player.inventory.push([name, amount]);
        return true;
    },
    AddMonies: function(m) { player.monies = Math.min(9999, player.monies + m); },
    hasSeeds: function() { 
        const hasAnySeeds = player.inventory.some(e => e[0][0] != "_" && e[0][0] != "!" && e[1] > 0);
        if(!hasAnySeeds) { return false; }
        const availableTypes = [];
        if(player.itemGrid === null || player.itemGrid === undefined) {
            availableTypes.push("veg");
            availableTypes.push("tree");
        } else {
            for(let x = 0; x < player.itemGrid.length; x++) {
                for(let y = 0; y < player.itemGrid[0].length; y++) {
                    const item = player.itemGrid[x][y];
                    switch(item) {
                        case "_log": availableTypes.push("mush"); break;
                        case "_coop": availableTypes.push("egg"); break;
                        case "_modulator": availableTypes.push("veg"); break;
                        case "_shooter": availableTypes.push("veg", "mush", "rice"); break;
                        case "_lake": availableTypes.push("water", "rod", "spear"); break;
                        case "_paddy": availableTypes.push("rice"); break;
                        case "_cow": availableTypes.push("food", "veg", "rice", "mush", "tree"); break;
                        case "_strongsoil": availableTypes.push("veg", "tree"); break;
                        case "_hotspot": availableTypes.push("tech"); break;
                        case "_beehive": availableTypes.push("bee"); break;
                        case "_charger": availableTypes.push("sickle2"); break;
                        default: if(item === null) { availableTypes.push("veg", "tree"); } break;
                    }
                }
            }
        }
        return player.inventory.some(e => e[0][0] != "_" && e[0][0] != "!" && e[1] > 0 && availableTypes.indexOf(GetCrop(e[0]).type) >= 0);
    },
    PlantCrop: function(crop) {
        if(player.miscdata.cropsPlanted[crop] === undefined) {
            player.miscdata.cropsPlanted[crop] = 1;
        } else {
            player.miscdata.cropsPlanted[crop]++;
        }
        let hasAll = !debug.AllCrops.some(c => player.miscdata.cropsPlanted[c] === undefined);
        if(hasAll) { AddAchievementIfMissing("allCrop"); }
    }
};
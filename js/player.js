let player = {
    health: 25, maxhealth: 25, atk: 3, def: 2, luck: 0.7, hasFalcon: true,
    c2: 0, c2Rate: 1, beeQueensFaced: 0, nathanSeeds: [["beet", 10], ["carrot", 10], ["ginger", 5]],
    level: 1, exp: 0, nextExp: 4, totalExp: 0, ethicsAxis: 0, techAxis: 0, // 1 = good/tech, -1 = bad/nature
    monies: 1000, playTime: 0, visitedMaps: [], openedChests: [],
    miscdata: { seasonsPlanted: [0, 0, 0, 0], cropsPlanted: {}, techFixturesUsed: 0, 
                typesPlanted: { "veg": 0, "tree": 0, "bee": 0, "rice": 0, "rod": 0, "water": 0, "cow": 0, "mush": 0, "egg": 0, "tech": 0 },
              },
    clearedEntities: [], achievements: [], failedEntities: [], 
    questsCleared: [], activeQuests: {}, 
    lastInn: "start",
    options: {
        difficulty: 1, 
        music: 1, 
        sound: 1,
        font: 0,
        resolution: 1,
        fullscreen: 0
    },
    controls: {
        up: "w",
        left: "a",
        down: "s",
        right: "d",
        confirm: " ",
        cancel: "q", 
        pause: "Enter"
    },
    equipment: { weapon: "!goodSickle", compost: "!weakCompost", gloves: null, soil: null },
    setMapPosition: function() {
        player.mapName = worldmap.mapName;
        player.mapPos = worldmap.pos;
        player.mapDir = worldmap.playerDir;
    },
    getPlayTimeString: function(time) {
        time = time || this.playTime;
        var hours = Math.floor(time / 3600);
        time -= hours * 3600;
        var minutes = Math.floor(time / 60);
        time -= minutes * 60;
        return (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes + ":" + (time < 10 ? "0" : "") + time;
    },
    tutorialInventory: [["specialgrapes", 1], ["carrot", 2], ["beet", 3], ["!weakCompost", 1], ["!babySickle", 1]],
    tutorialEquipment: { weapon: "!goodSickle", compost: "!weakCompost", gloves: null, soil: null },
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
    inventory: [
        ["specialgrapes", 1], ["carrot", 6], ["beet", 4], ["!weakCompost", 1], ["!babySickle", 1] // ACTUAL STARTING INVENTORY
        ["_shooter", 2], ["_hotspot", 1], ["_modulator", 1], ["battery", 4], ["spear", 5], 
        ["!baseSickle", 1], ["!goodSickle", 1], ["!weakCompost", 1], ["!strongCompost", 1], ["!weakGloves", 1], ["!pairGloves", 1],
        ["!weakSoil", 1], ["!fortSoil", 1], ["!balancedGreenhouse", 1], ["!amplifyingGreenhouse", 1]
        ,["shiitake", 1], ["milkcap", 1], ["portobello", 1], ["egg", 3], ["_lake", 9], ["net", 3], ["rod", 5], ["goodrod", 5], ["metalrod", 5], 
        ["_paddy", 6], ["rice", 2], ["arborio", 2], ["blackrice", 2]
        , ["pineapple", 5], ["leek", 2]
        ,["apple", 20], ["lemon", 1], ["rhubarb", 8],  ["grapes", 3]*/
        //["carrot", 69], ["pineapple", 4],["leek", 2],
    ],
    gridWidth: 3, gridHeight: 3, gridLevel: "n",
    itemGrid: null,
    hasQuest: function(q) { return player.activeQuests[q] !== undefined; },
    hasQuestState: function(q, state) { return player.activeQuests[q] !== undefined && state === player.activeQuests[q]; },
    completedQuest: function(q) { return player.questsCleared.indexOf(q) >= 0; },
    hasOrHasHadQuest: function(q) { return player.questsCleared.indexOf(q) >= 0 || player.activeQuests[q] !== undefined; },
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
        this.nextExp = Math.floor(this.level * this.level * 3 * Math.pow(1.005, this.level - 2));
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
        
        for(let i = 0; i < items.length; i++) { this.increaseItem(items[i][0], items[i][1] || 1); }
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
        var idx = -1;
        for(var i = 0; i < player.inventory.length; i++) {
            if(player.inventory[i][0] === name) {
                idx = i;
                break;
            }
        }
        if(idx < 0) { return false; }
        if(player.inventory[idx][1] <= 0) {
            player.inventory.splice(idx, 1);
            return true;
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
var player = {
    health: 25, maxhealth: 25, atk: 3, def: 2, luck: 0.7, hasFalcon: true,
    c2: 0, c2Rate: 1, beeQueensFaced: 0, nathanSeeds: [["beet", 10], ["carrot", 10], ["ginger", 5]],
    level: 1, exp: 0, nextExp: 4, totalExp: 0, ethicsAxis: 0, techAxis: 0, // 1 = good/tech, -1 = bad/nature
    monies: 1000, playTime: 0, visitedMaps: [],
    clearedEntities: [], achievements: [], 
    questsCleared: [], activeQuests: {}, 
    lastInn: "start",
    options: {
        difficulty: 1, 
        music: 1, 
        sound: 1,
        font: 0
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
    hasItem: function(item, amount) {
        amount = amount || 1;
        for(var i = 0; i < player.inventory.length; i++) {
            if(player.inventory[i][0] === item && player.inventory[i][1] >= amount) { return true; }
        }
        return false;
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
    getRandomLuckyNumber: function(inverse) {
        var num = (Math.random() * player.luck);
        if(inverse) { num = 1 - num; }
        return num;
    },
    initGridDimensions: function() { if(this.itemGrid === null) { this.itemGrid = combat.getGrid(this.gridWidth, this.gridHeight); } },
    addExp: function(n) { this.totalExp += n; if(this.level < 50) { this.exp += n; } },
    levelUp: function() {
        this.level++;
        this.exp -= this.nextExp;
        this.maxhealth = Math.floor(this.maxhealth * 1.1);
        this.health = this.maxhealth;
        this.atk = Math.ceil(this.atk + Math.log10(this.level));
        this.def = Math.ceil(this.def + Math.log10(this.level));
        this.luck = 0.7 - (this.level / 400);
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
        switch(this.level) {
            case 2:
                this.increaseItem("carrot", 3);
                this.increaseItem("beet", 3);
                this.increaseItem("banana");
                break;
            case 3:
                this.increaseItem("carrot", 3);
                this.increaseItem("beet", 3);
                this.increaseItem("ginger", 4);
                this.increaseItem("banana");
                break;
            case 4:
                this.increaseItem("carrot", 3);
                this.increaseItem("beet", 3);
                this.increaseItem("ginger", 3);
                this.increaseItem("banana", 2);
                this.increaseItem("pineapple", 2);
                break;
        }
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
        var numOfType = 0;
        var type = name[0] === "!" ? "!" : (name[0] === "_" ? "_" : "C");
        for(var i = 0; i < player.inventory.length; i++) {
            if(player.inventory[i][0] === name) {
                player.inventory[i][1] += (amount || 1);
                return true;
            }
            var front = player.inventory[i][0][0];
            if(front === "!" || front === "_") {
                if(type === front) { numOfType++; }
            } else if(type === "C") {
                numOfType++;
            }
        }   
        if(numOfType === 27) { console.log("NOT ENOUGH ROOM!"); return false; }
        player.inventory.push([name, (amount || 1)]);
    }
};
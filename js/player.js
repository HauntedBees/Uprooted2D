var player = {
    health: 25, maxhealth: 25, 
    atk: 3, def: 2, luck: 0.7,
    level: 1, exp: 0, nextExp: 4, totalExp: 0, 
    eploids: 10, monies: 1000, playTime: 0,
    clearedEntities: [], 
    lastInn: "start",
    equipment: {
        weapon: null, 
        compost: "!weakCompost", 
        gloves: null, 
        soil: null, 
        armor: null, 
    },
    getPlayTimeString: function() {
        var time = this.playTime;
        var hours = Math.floor(time / 3600);
        time -= hours * 3600;
        var minutes = Math.floor(time / 60);
        time -= minutes * 60;
        return (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes + ":" + (time < 10 ? "0" : "") + time;
    },
    inventory: [
        ["specialgrapes", 1], ["carrot", 6], ["beet", 4], ["!weakCompost", 1]/*, ["_log", 1], ["_coop", 2], ["_cow", 54], ["fodder", 5],
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
    skilltree: {
        Sspring: 0,
        Ssummer: 0,
        Sautumn: 1,
        Swinter: 0,
        season: 0
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
        this.eploids += 1;
        this.luck = 0.7 - (this.level / 400);
        this.nextExp = Math.floor(this.level * this.level * 5 * Math.pow(1.02, this.level - 2));
        this.getLevelUpItemBonuses();
    },
    getArmorBalancedMultiplier: function(seasonVal) {
        if(this.equipment.armor === null) { return 1; }
        var equipInfo = GetEquipment(this.equipment.armor);
        if(equipInfo.boost !== undefined) {
            var newVal = 1 - ((1 - seasonVal) * equipInfo.boost);
            return Math.min(newVal, 1);
        } else {
            if(seasonVal > 0.5) {
                return (1 + equipInfo.amplify);
            } else {
                return (1 - equipInfo.amplify);
            }
        }
    },
    getArmorDisplayString: function(equipInfo) {
        if(equipInfo === undefined) {
            if(this.equipment.armor === null) { return ""; }
            equipInfo = GetEquipment(this.equipment.armor);
        }
        if(equipInfo.boost !== undefined) {
            return "Season Resist: " + (equipInfo.boost * 100) + "%";
        } else {
            return "Season Mult.: " + (equipInfo.amplify * 100) + "%";
        }
    },
    getLevelUpItemBonuses: function() {
        switch(this.level) {
            case 2:
                this.increaseItem("carrot", 3);
                this.increaseItem("beet", 3);
                break;
            case 3:
                this.increaseItem("carrot", 4);
                this.increaseItem("beet", 2);
                this.increaseItem("ginger");
                break;
        }
    },
    getRotResist: function() {
        if(this.equipment.soil === null) { return 0; }
        var equipInfo = GetEquipment(this.equipment.soil);
        return (equipInfo.rotResist || 0);
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
        return (equipInfo.boost + 1);
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
    getSickleAttackBonus: function() {
        if(this.equipment.weapon === null) { return 0; }
        var equipInfo = GetEquipment(this.equipment.weapon);
        return equipInfo.power;
    },
    decreaseItem: function(name) {
        var idx = -1;
        for(var i = 0; i < player.inventory.length; i++) {
            if(player.inventory[i][0] === name) {
                player.inventory[i][1] -= 1;
                idx = i;
                break;
            }
        }
        if(player.inventory[idx][1] == 0) {
            player.inventory.splice(idx, 1);
            return false;
        }
        return true;
    },
    increaseItem: function(name, amount) {
        for(var i = 0; i < player.inventory.length; i++) {
            if(player.inventory[i][0] === name) {
                player.inventory[i][1] += (amount || 1);
                return;
            }
        }
        player.inventory.push([name, (amount || 1)]);
    }
};
function AttackData(approximateDamage, isCritical, stunLength, animals, crops, knockback) {
    this.damage = Math.ceil(approximateDamage);
    if(this.damage < 1) { this.damage = 1; }
    this.crit = isCritical;
    this.cropPowerLower = Math.ceil(this.damage / 4);
    this.stunLength = stunLength || 0;
    this.animals = animals || [];
    this.crops = crops || [];
    this.numCrops = this.crops.length;
    this.knockback = Math.ceil(knockback || 0);
}
var dmgCalcs = {
    GetPlayerCombatDefense: function() {
        var d = player.def;
        for(var x = 0; x < player.gridWidth; x++) {
            for(var y = 0; y < player.gridHeight; y++) {
                var tile = combat.grid[x][y]
                if(tile === null || tile.x !== undefined) { continue; }
                d += tile.power / 5;
            }
        }
        return Math.min(Math.round(d), player.def * 3);
    },
    GetNerfs: function() {
        if(combat.enemies[0].id !== "beckett") { return []; }
        var nerfs = [];
        var right = combat.enemywidth - 1, bottom = combat.enemyheight - 1;
        for(var x = right - 1; x <= right; x++) {
            for(var y = bottom - 1; y <= bottom; y++) {
                var nerf = combat.enemyGrid[x][y];
                if(nerf === null) { continue; }
                switch(nerf.id) {
                    case "mushNerf": nerfs.push("mush"); break;
                    case "riceNerf": nerfs.push("rice"); break;
                    case "treeNerf": nerfs.push("tree"); break;
                    case "vegNerf": nerfs.push("veg"); break;
                    case "fishNerf": nerfs.push("spear"); nerfs.push("rod"); nerfs.push("water"); break;
                    case "beeNerf": nerfs.push("bee"); break;
                    case "eggNerf": nerfs.push("egg"); break;
                    case "reNerf": nerfs.push("RE"); break;
                }
            }
        }
        return nerfs;
    },
    GetNerfMultiplier: function(crop, nerfs) { 
        if(combat.enemies[0].id !== "beckett") { return 1; }
        if(nerfs.length === 0) { return 1; }
        var nerfMult = 1;
        for(var i = 0; i < nerfs.length; i++) {
            if(nerfs[i] === "RE") { if(crop.respawn > 0) { nerfMult *= 0.25; } }
            else if(nerfs[i] === crop.type) { nerfMult *= 0.25; }
        }
        return nerfMult;
    },
    CropToDef: function(crop, season, attackElements) {
        var cropDef = crop.defense;
        switch(crop.seasons[season]) {
            case 2: cropDef *= 2; break;
            case 0: cropDef /= 3; break;
        }
        for(var i = 0; i < attackElements; i++) {
            var attackElement = attackElements[i];
            switch(attackElement) { // 0 = water, 1 = fire, salt = 2, -1 = general
                case 0: cropDef *= 1.5 * (crop.waterResist || 0); break;
                case 1: cropDef *= 1.5 * (crop.fireResist || 0); break;
                case 2: cropDef *= 1.5 * (crop.saltResist || 0); break;
            }
        }
        return cropDef;
    },

    MeleeAttack: function(isPlayer, season, myAtk, targets, attackElements) {
        if(attackElements === undefined) { attackElement = [-1]; }
        var formattedDefs = [];
        for(var i = 0; i < targets.length; i++) {
            if(targets[i].name === undefined) { // enemy; value is just an integer for their defense
                formattedDefs.push(targets[i]);
            } else { // crop; value is a crop object
                formattedDefs.push(dmgCalcs.CropToDef(targets[i], season, attackElements));
            }
        }
        return dmgCalcs.MeleeInner(isPlayer, season, myAtk, formattedDefs);
    },
    MeleeInner: function(isPlayer, season, myAtk, theirDef) {
        var isCritical = (Math.random() < (player.luck - 0.69));
        var atkVal = myAtk;
        var hasWeapon = isPlayer && player.equipment.weapon !== null;
        if(hasWeapon) {
            var weapon = GetEquipment(player.equipment.weapon);
            var bonus = weapon.power;
            if(season === 0 && weapon.sp) { bonus += weapon.sp; }
            else if(season === 1 && weapon.su) { bonus += weapon.su; }
            else if(season === 2 && weapon.au) { bonus += weapon.au; }
            else if(season === 3 && weapon.wi) { bonus += weapon.wi; }
            atkVal += bonus / 1.1;
        }
        var attacksArr = [];
        for(var i = 0; i < theirDef.length; i++) {
            var finalDamage = atkVal - (isCritical ? 0 : (theirDef[i] / 2.2));
            if(hasWeapon) { finalDamage -= (isCritical ? 0 : (theirDef[i] / 4)); }
            attacksArr.push(new AttackData(finalDamage, isCritical));
        }
        console.log(attacksArr);
        
        if(isPlayer) { return { isCritical: isCritical, attackDatas: attacksArr, animData: null, recoilInfo: null }; }
        else { return attacksArr; }
    },

    CropAttack: function(isPlayer, season, myAtk, myCrops, targets, attackElements) {
        if(attackElements === undefined) { attackElement = [-1]; }
        var formattedDefs = [];
        for(var i = 0; i < targets.length; i++) {
            if(targets[i].name === undefined) { // enemy; value is just an integer for their defense
                formattedDefs.push(targets[i]);
            } else { // crop; value is a crop object
                formattedDefs.push(dmgCalcs.CropToDef(targets[i], season, attackElements));
            }
        }
        return dmgCalcs.CropInner(isPlayer, season, myAtk, myCrops, formattedDefs);
    },
    CropInner: function(isPlayer, season, myAtk, myCrops, theirDef) {
        var isCritical = isPlayer && (Math.random() < (player.luck - 0.69));
        var hasShockGloves = isPlayer && player.equipment.gloves !== null && GetEquipment(player.equipment.gloves).tech;
        var nerfs = dmgCalcs.GetNerfs(), modAtk = Math.log10(5 + myAtk * myAtk);
        var totalDamage = 0, stunLength = 0, damageToAttacker = 0, animals = [];
        var recoilInfos = [], animInfos = [];

        for(var i = 0; i < myCrops.length; i++) {
            var crop = myCrops[i].crop;
            var seasonVal = crop.seasons[season];
            if(seasonVal === 0) { seasonVal = 0.2; } else if(isPlayer) { player.miscdata.seasonsPlanted[season]++; }

            var pow = crop.power + 1;
            if(isPlayer) {
                if(crop.stickChance !== undefined && stunLength === 0) { // Stickiness
                    switch(crop.stickChance) { // TODO: add enemy resistance to stickiness
                        case 1: stunLength = ((player.luck * Math.random()) > 0.6 ? InclusiveRange(1, 2) : 0); break;
                        case 2: stunLength = ((player.luck * Math.random()) > 0.5 ? InclusiveRange(1, 3) : 0); break;
                        case 3: stunLength = ((player.luck * Math.random()) > 0.45 ? InclusiveRange(2, 5) : 0); break;
                    }
                }
                if(player.equipment.soil !== null) { // Watering Cans
                    var soil = GetEquipment(player.equipment.soil);
                    if(soil.boost !== undefined) {
                        switch(crop.seasons[season]) {
                            case 0: seasonVal += soil.boost; break;
                            case 1: seasonVal += soil.boost / 2; break;
                        }
                    } else if(soil.amp !== undefined) {
                        switch(crop.seasons[season]) { // currently values are 1 and 2
                            case 0: seasonVal -= soil.amp * 0.1; break; // brings from 0.2 to 0.1 or 0 respectively
                            case 2: seasonVal *= soil.amp * 2; break; // brings from 2 to 4 or 8 respectively
                        }
                    }
                }
                if(hasShockGloves && ["water", "rice", "spear", "rod"].indexOf(crop.type) >= 0) { // Shock from Harvesting Water-based Crops
                    damageToAttacker += crop.power * 1.5;
                }
            } else if(crop.type === "tech") { pow -= 1; }
            var dmg = (modAtk * pow * pow  * seasonVal * dmgCalcs.GetNerfMultiplier(crop, nerfs)) / 6;
            if(crop.type === "rice") { dmg *= 1.5; }
            if(crop.name === "app") { dmg *= 2 / (crop.activeTime + 1); }
            if(crop.animal !== undefined && ((1 - player.luck) * Math.random()) < (crop.animalChance / 8)) {
                animals.push({ crop: crop.name, animal: crop.animal });
                dmg *= crop.animalDamageMult;
            }
            var recoilInfo = null;
            if(isPlayer && ["rice", "veg", "tree", "mush", "bee", "egg", "tech"].indexOf(crop.type) >= 0) {
                if(crop.type === "rice" || (myCrops.length > 3 && combat.enemies.length > 1)) {
                    var power = crop.type === "rice" ? 1 : 0;
                    var numCrops = myCrops.length;
                    while((Math.random() * player.luck * numCrops--) > 0.9) {
                        power++;
                    }
                    if(power > 0) { recoilInfo = power * Math.max(3, dmg / 6 / combat.enemies.length); }
                }
            }
            totalDamage += dmg;
            animInfos.push({ x: myCrops[i].x, y: myCrops[i].y, recoil: recoilInfo });
            recoilInfos.push(recoilInfo);
        }
        if(isPlayer) {
            totalDamage *= 1 + (Math.floor(myCrops.length / 3) / 10); // boost by number of crops (launch 10 crops to get 1.3x boost, 20 for 1.6x, 30 for 2x)
        } else {
            totalDamage *= 1 + Math.floor(myCrops.length / 6) / 10; // boost by number of crops (launch 10 crops to get 1.1x boost, 20 for 1.3x, 30 for 1.5x)
        }
        if(totalDamage < myAtk && isPlayer) { totalDamage += myAtk + 1; }
        var attacksArr = [];
        for(var i = 0; i < theirDef.length; i++) {
            var finalDamage = totalDamage;
            if(isPlayer) {
                finalDamage = this.GetDefendedPlayerDamage(finalDamage, isCritical, theirDef[i]);
            } else {
                finalDamage -= theirDef[i] / 1.5;
            }
            attacksArr.push(new AttackData(finalDamage, isCritical, stunLength, animals, myCrops, damageToAttacker));
        }
        if(isPlayer) { return { isCritical: isCritical, attackDatas: attacksArr, animData: animInfos, recoilInfo: recoilInfos }; }
        else { return attacksArr; }
    },
    GetDefendedPlayerDamage: function(initDamage, isCritical, theirDefense) {
        if(isCritical) { return initDamage; }
        return Math.ceil(initDamage - (theirDefense / 4));
    },

    CompostFunc: function(isPlayer, season, myAtk, myCrops, isAttack, noAction) { // isAttack: true = attack, false = heal
        var cowMult = isAttack ? 0.01 : 3, coffeeMult = isAttack ? 0.5 : 3.5, beeMult = isAttack ? 0.5 : 3;
        var baseMult = isAttack ? 0.5 : 1.25, modAtk = Math.log2(myAtk * myAtk * 0.15); // min atk is 3; log2(n) <= 0 where n <= 1; 3 * 3 * 0.15 = 1.35
        noAction = noAction || false;

        var outputAmount = 0, thereAreCows = false, thereAreBees = false, thereIsCoffee = false;
        var nerfs = dmgCalcs.GetNerfs();
        for(var i = 0; i < myCrops.length; i++) {
            var croppos = myCrops[i];
            if(croppos.cow !== undefined) {
                outputAmount += cowMult * combat.happyCows[croppos.cow].feed;
                combat.happyCows[croppos.cow].removeMe = true;
                thereAreCows = true;
                croppos = combat.happyCows[croppos.cow];
                if(!noAction) {
                    combat.animHelper.AddAnim(new SheetAnim(combat.dx + croppos.x + 0.25, combat.dy + croppos.y + 1, 250, "puff", 5));
                    combat.animHelper.AddAnim(new MoveAnim(combat.dx + croppos.x + 0.25, combat.dy + croppos.y + 1, combat.compost.binx, combat.compost.biny, 1000, "milk"));
                }
            } else {
                var crop = noAction ? combat.grid[croppos.x][croppos.y] : combat.ClearAndReturnCrop(croppos);
                var seasonVal = crop.seasons[season];
                if(seasonVal === 0) { seasonVal = 0.2; } else if(isPlayer) { player.miscdata.seasonsPlanted[season]++; }
                var cropPowVal = (modAtk * (crop.power + 1) * (crop.power + 1) * (seasonVal + 1)) / 20;
                if(crop.type === "bee") {
                    thereAreBees = true;
                    outputAmount += beeMult * cropPowVal;
                } else if(crop.name === "coffee") {
                    thereIsCoffee = true;
                    outputAmount += coffeeMult * cropPowVal;
                } else {
                    outputAmount += baseMult * cropPowVal;
                }
                outputAmount *= dmgCalcs.GetNerfMultiplier(crop, nerfs);
                if(!noAction) {
                    var cropSprite = crop.rotten ? "weed" : crop.name; // TODO: replace (i.e. fish don't become weeds) (but we can't compost fish anyway so that doesn't matter probably)
                    combat.animHelper.AddAnim(new SheetAnim(combat.dx + croppos.x, combat.dy + croppos.y, 250, "puff", 5));
                    combat.animHelper.AddAnim(new MoveAnim(combat.dx + croppos.x, combat.dy + croppos.y, combat.compost.binx, combat.compost.biny, 1000, cropSprite));
                }
            }
        }
        outputAmount *= 1 + (myCrops.length / 4);
        return { total: Math.max(1, outputAmount), cows: thereAreCows, bees: thereAreBees, coffee: thereIsCoffee };
    }
};
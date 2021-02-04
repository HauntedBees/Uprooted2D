function AttackCalcData(approximateDamage, isCritical, stunLength, crops, knockback) {
    this.damage = Math.ceil(approximateDamage);
    if(this.damage < 1) { this.damage = 1; }
    this.crit = isCritical;
    this.cropPowerLower = Math.ceil(this.damage / 4);
    this.stunLength = stunLength || 0;
    this.crops = crops || [];
    this.numCrops = this.crops.length;
    this.knockback = Math.ceil(knockback || 0);
}
class CombatCalculations {
    /** @param {CombatScreen} [combat] */
    constructor(combat) {
        this.player = game2.player;
        this.combat = combat;
    }

    /**
     * @param {NewCropDetail} crop
     * @param {number} season
     * @param {number[]} attackElements
     */
    CropToDef(crop, season, attackElements) {
        let cropDef = crop.defense;
        switch(crop.seasons[season]) {
            case 2: cropDef *= 2; break;
            case 0: cropDef /= 3; break;
        }
        for(let i = 0; i < attackElements.length; i++) {
            const attackElement = attackElements[i];
            switch(attackElement) { // 0 = water, 1 = fire, salt = 2, -1 = general
                case 0: cropDef *= 1.5 * (crop.waterResist || 0); break;
                case 1: cropDef *= 1.5 * (crop.fireResist || 0); break;
                case 2: cropDef *= 1.5 * (crop.saltResist || 0); break;
            }
        }
        return cropDef;
    }

    /**
     * @param {boolean} isPlayer
     * @param {any} season
     * @param {number} myAtk
     * @param {any[]} targets
     * @param {number[]} [attackElements]
     */
    MeleeAttack(isPlayer, season, myAtk, targets, attackElements) {
        if(attackElements === undefined) { attackElements = [-1]; }
        const formattedDefs = [];
        for(let i = 0; i < targets.length; i++) {
            if(targets[i].name === undefined) { // enemy; value is just an integer for their defense
                formattedDefs.push(targets[i]);
            } else { // crop; value is a crop object
                formattedDefs.push(this.CropToDef(targets[i], season, attackElements));
            }
        }
        return this.MeleeInner(isPlayer, season, myAtk, formattedDefs);
    }
    /**
     * @param {boolean} isPlayer
     * @param {number} season
     * @param {number} myAtk
     * @param {string | any[]} theirDef
     */
    MeleeInner(isPlayer, season, myAtk, theirDef) {
        const isCritical = (Math.random() < (this.player.luck - 0.69));
        let atkVal = myAtk;
        const hasWeapon = isPlayer && this.player.equipped.weapon !== null;
        if(hasWeapon) {
            const weapon = GetEquipment(this.player.equipped.weapon);
            let bonus = weapon.power;
            if(season === 0 && weapon.sp) { bonus += weapon.sp; }
            else if(season === 1 && weapon.su) { bonus += weapon.su; }
            else if(season === 2 && weapon.au) { bonus += weapon.au; }
            else if(season === 3 && weapon.wi) { bonus += weapon.wi; }
            atkVal += bonus / 1.1;
        }
        const attacksArr = [];
        for(let i = 0; i < theirDef.length; i++) {
            let finalDamage = atkVal - (isCritical ? 0 : (theirDef[i] / 2.2));
            if(hasWeapon) { finalDamage -= (isCritical ? 0 : (theirDef[i] / 4)); }
            finalDamage /= 2;
            attacksArr.push(new AttackCalcData(finalDamage, isCritical));
        }
        console.log(attacksArr);
        
        if(isPlayer) { return { isCritical: isCritical, attackDatas: attacksArr, animData: null, recoilInfo: null }; }
        else { return attacksArr; }
    }
    GetPlayerCombatDefense() {
        let d = this.player.def;
        for(let x = 0; x < this.combat.playerGridInfo.width; x++) {
            for(let y = 0; y < this.combat.playerGridInfo.height; y++) {
                const tile = this.combat.playerGridInfo.gridInfo.grid[x][y]
                if(tile === null || tile.x !== undefined) { continue; }
                d += tile.power / 5;
            }
        }
        return Math.min(Math.round(d), this.player.def * 3);
    }
}
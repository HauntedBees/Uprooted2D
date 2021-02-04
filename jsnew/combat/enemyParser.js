class EnemyActionParser {
    /** @param {CombatScreen} combat, @param {CombatEnemy} enemy */
    constructor(combat, enemy) {
        this.combat = combat;
        this.enemy = enemy;
        this.egi = this.combat.enemyGridInfo;
        this.eg = this.combat.enemyGrid;
        /** @type {enemyNode[]} */
        this.nodes = enemyPatterns[enemy.attackType].nodes;
        this.current = this.GetNode("node0");
        this.done = false;
        
        this.dmgCalcs = new CombatCalculations();
        /** @type {{ text?:string; animData?: string; skip?: boolean; attackAgain?: boolean }} */
        this.outputData = null;
        /** @type {{ x: number; y: number; type: number[]; }[]} */
        this.targets = [];
        if(this.HasRottenCrops() && Math.random() < enemy.rotClearChance) {
            this.RemoveWeeds();
            this.outputData = {
                text: GetText("enemyRemoveWeeds").replace(/\{0\}/g, enemy.name),
                animData: "PLANT"
            };
        } else {
            this.ParseCurrentNode();
        }
    }
    ParseCurrentNode() {
        const nodeContent = this.current.data.message;
        let actionResult = true;
        console.log(this.current);
        if(nodeContent !== undefined && nodeContent !== "") {
            actionResult = this.EvalAction(nodeContent, this.current.data.action);
        }
        const conds = this.current.next;
        if(conds === undefined) { this.done = true; return; }
        let nextNodeId = "";
        if(conds.condition === "random") {
            let rand = Math.random();
            for(let i = 0; i < conds.data.length; i++) {
                const rval = conds.data[i];
                const weight = parseFloat(rval.weight);
                if(rand <= weight) {
                    nextNodeId = rval.next;
                    //console.log("randomly picked " + nextNodeId);
                    break;
                } else { rand -= weight; }
            }
        } else if(conds.data !== undefined) {
            for(let i = 0; i < conds.data.length; i++) {
                const val = conds.data[i];
                const success = this.EvalCondition(val.condition, actionResult);
                if(success) { 
                    //console.log("picked " + nextNodeId + " because it passed the '" + val.condition + "' condition");
                    nextNodeId = val.next;
                    break;
                }
            }
        } else { nextNodeId = conds; }
        this.current = this.GetNode(nextNodeId);
        this.ParseCurrentNode();
    }

    /** @param {string} name */
    GetNode(name) {
        const validNode = this.nodes.filter(e => e.id === name);
        if(validNode.length === 1) { return validNode[0]; }
        console.log("I SHOULDN'T HAPPEN!!!");
        console.log(name);
        console.log(this.nodes);
        return null;
    }

    HasRottenCrops() {
        for(let x = 0; x < this.egi.width; x++) {
            for(let y = 0; y < this.egi.height; y++) {
                const tile = this.eg[x][y];
                if(tile === null || tile.x !== undefined || tile.type === "card") { continue; }
                if(tile.rotten && tile.type !== "water") { return true; }
            }
        }
        return false;
    }
    RemoveWeeds() {
        for(let x = 0; x < this.egi.width; x++) {
            for(let y = 0; y < this.egi.height; y++) {
                const tile = this.eg[x][y];
                if(tile === null || tile.x !== undefined || tile.type === "card") { continue; }
                if(tile.rotten && tile.type !== "water") { this.eg[x][y] = null; }
            }
        }
        return false;
    }
    /**
     * @param {number} x
     * @param {number} y
     * @param {boolean} isLarge
     */
    CanPlantInSpot(x, y, isLarge) {
        if(this.eg[x][y] !== null) { return false; }
        if(!isLarge) { return true; } 
        if(this.egi.width === (x + 1)) { return false; }
        if(this.egi.height === (y + 1)) { return false; }
        if(this.eg[x + 1][y] !== null) { return false; }
        if(this.eg[x][y + 1] !== null) { return false; }
        if(this.eg[x + 1][y + 1] !== null) { return false; }
        return true;
    }

    /**
     * @param {number} dmg
     * @param {string} [secondArg]
     * @param {string} [thirdArg]
     * @param {string} [fourthArg]
     */
    GetAttackData(dmg, secondArg, thirdArg, fourthArg) {
        secondArg = secondArg || "";
        const node = this.current;
        let outputText = GetText(node.data.textID).replace(/\{0\}/g, this.enemy.name).replace(/\{1\}/g, dmg)
                            .replace(/\{2\}/g, secondArg).replace(/\{3\}/g, thirdArg).replace(/\{4\}/g, fourthArg);
        outputText = HandleArticles(outputText, secondArg, false);
        return { text: outputText, animData: node.data.animData };
    }

    /**
     * @param {string} key
     * @param {string} action
     */
    EvalAction(key, action) {
        // --- BASIC
        if(key === "INIT" || key === "END") {
            return true;
        } else if(key === "SKIP") {
            this.outputData = { skip: true };
            return true;
        } else if(key === "IDLE") {
            this.outputData = this.GetAttackData(0);
            return true;
        }
        // --- ATTACKING
        if(key === "WEAK_ATTACK") {
            let damage = this.dmgCalcs.MeleeAttack(false, this.combat.season, this.enemy.atk, [this.dmgCalcs.GetPlayerCombatDefense()])[0].damage;
            damage = this.combat.DamagePlayer(damage);
            this.outputData = this.GetAttackData(damage);
            return true;
        } else if(key === "WEAKEST_ATTACK") {
            const damage = this.combat.DamagePlayer(1);
            this.outputData = this.GetAttackData(damage);
            return true;
        } else if(key === "PIG_GUN") {
            const damage = this.combat.DamagePlayer(300);
            this.outputData = this.GetAttackData(damage);
            return true;
        } else if(key === "LAUNCH_CROPS") {
            // TODO
            return true;
        } else if(key === "FUCKING_MAIM") {
            // TODO
            return true;
        }
        // --- PLANTING
        if(key === "TRY_PLANT_CROP") {
            let crop = action;
            if(crop === "args") {
                crop = this.enemy.GetRandomArg();
            } else if(crop.indexOf(",") >= 0) {
                crop = MathB.RandomArrayItem(crop.split(","));
            }
            
            const newCrop = GetCrop(crop);
            const delta = newCrop.size === 2 ? 1 : 0;
            const pos = this.GetEnemyPlantablePosition(0, this.egi.width, 0, this.egi.height, delta === 1);
            if(pos === null) { return false; }

            newCrop.activeTime = newCrop.time;
            this.eg[pos.x][pos.y] = newCrop;
            if(newCrop.size === 2) {        
                this.eg[pos.x + 1][pos.y] = pos;
                this.eg[pos.x][pos.y + 1] = pos;
                this.eg[pos.x + 1][pos.y + 1] = pos;
            }
            this.outputData = this.GetAttackData(0, GetCropPlantedDisplayName(newCrop.name, newCrop.displayname));
            return true;
        }
    }
    /**
     * @param {number} xmin
     * @param {number} xmax
     * @param {number} ymin
     * @param {number} ymax
     * @param {boolean} isBig
     */
    GetEnemyPlantablePosition(xmin, xmax, ymin, ymax, isBig) {
        let attempts = 5;
        const delta = isBig ? 1 : 0;
        while(attempts-- > 0) { // try picking at random first
            const x = MathB.Range(xmin, xmax - delta);
            const y = MathB.Range(ymin, ymax - delta);
            if(this.CanPlantInSpot(x, y, isBig)) { return { x: x, y: y }; }
        }
        /**
         * @param {number} x
         * @param {number} y
         */
        return this.GetFirstWithMatch(xmin, xmax, ymin, ymax, (x, y) => this.CanPlantInSpot(x, y, isBig));
    }
    /**
     * @param {number} xmin
     * @param {number} xmax
     * @param {number} ymin
     * @param {number} ymax
     * @param {{ (x: any, y: any): boolean; (arg0: any, arg1: any): any; }} func
     */
    GetFirstWithMatch(xmin, xmax, ymin, ymax, func) {
        for(let x = xmin; x < xmax; x++) {
            for(let y = ymin; y < ymax; y++) {
                if(func(x, y)) { return { x: x, y: y }; }
            }
        }
        return null;
    }

    /**
     * @param {string} key
     * @param {boolean} actionResult
     */
    EvalCondition(key, actionResult) {
        if(key === "ELSE") {
            return true;
        } else if(key === "HURT_BEES") {
            //TODO
            return false;
        } else if(key === "HAS_CROPS_READY") {
            return this.GetEnemyFieldData(false, false, false).crops.length > 0;
        } else if(key === "HAS_BABIES_READY") {
            return this.GetEnemyFieldData(true, false, false).crops.length > 0;
        } else if(key === "SUCCESS") {
            return actionResult === true;
        } else if(key === "NOT_SPRING") {
            return this.combat.season !== 0;
        } else if(key === "HAS_LOW_HP") {
            return (this.enemy.health / this.enemy.maxhealth) < 0.5;
        } else if(key === "UNPLUGGED") {
            return this.combat.enemies.some(e => e.unplugged === true);
        } else if(key === "HAS_CLOUD") { // TODO: vet me later
            return this.GetEnemyFieldData(false, true, true).crops.some(crop => crop.type === "cloud");
        } else if(key === "PLAYER_HAS_CROPS") {
            return this.combat.grid.some(arry => arry.some(tile => tile !== null && tile !== undefined && tile.x === undefined && tile.type !== "rock"));
        } else if(key === "WHOPPY_MACHINE_BROKE") { // TODO: vet me later
            for(let y = 1; y < this.egi.height; y++) {
                if(this.eg[this.egi.width - 1][y] === null) { return true; }
            }
            return false;
        } else if(key === "BECKETT_MACHINE_BROKE") { // TODO: vet me later
            for(let y = 0; y < 3; y++) {
                if(this.eg[this.egi.width - 1][y] === null) { return true; }
            }
            return false;
        }
    }
    /**
     * @param {boolean} justBabies
     * @param {boolean} includeInactive
     * @param {boolean} forHealing
     * @returns {{ crops: {name: string, x: number, y: number; type: string; effect: string}[]; damage: number }}
     */
    GetEnemyFieldData(justBabies, includeInactive, forHealing) {
        let dmg = 0, crops = [];
        for(let x = 0; x < this.egi.width; x++) {
            for(let y = 0; y < this.egi.height; y++) {
                const tile = this.eg[x][y];
                if(tile === null || tile.x !== undefined || tile.type === "card") { continue; }
                if(!includeInactive && (tile.activeTime > 0 || tile.rotten)) { continue; }
                if(justBabies) {
                    if(tile.type !== "babby") { continue; }
                } else {
                    if(tile.type === "babby") { continue; }
                    if(forHealing && tile.type === "egg") { continue; }
                }
                dmg += tile.power * Math.max(0.75, Math.log10(this.enemy.atk));
                crops.push({ 
                    name: tile.name, 
                    x: x, 
                    y: y, 
                    type: tile.type, 
                    effect: this.GetSideEffect(tile)
                });
            }
        }
        if(dmg === 0) { dmg = (this.enemy.atk / 1.5); }
        dmg = Math.max(1, Math.round(dmg - game2.player.def));
        return { crops: crops, damage: dmg };
    }
    /**
     * @param {{ saltChance: number; burnChance: number; }} tile
     */
    GetSideEffect(tile) {
        const pgi = game2.player.fixtureGridInfo;
        if(tile.saltChance === undefined && tile.burnChance === undefined) { return ""; }
        if(tile.saltChance !== undefined && tile.saltChance > Math.random()) { 
            const res = this.TryDisturbTile(MathB.Range(0, pgi.width), MathB.Range(0, pgi.height), "salt");
            return res ? "SALT" : "";
        }
        if(tile.burnChance !== undefined && tile.burnChance > Math.random()) { 
            const res = this.BurnTile(MathB.Range(0, pgi.width), MathB.Range(0, pgi.height));
            return res ? "BURN" : "";
        }
    }
    /**
     * @param {number} x
     * @param {number} y
     * @param {string} type
     */
    TryDisturbTile(x, y, type) {
        const player = game2.player;
        const grid = this.combat.grid;
        const fixGrid = player.fixtureGridInfo.grid;
        let itemTile = fixGrid[x][y];
        if(itemTile !== null && itemTile.x !== undefined) { itemTile = fixGrid[itemTile.x][itemTile.y]; }
        if((itemTile !== null && itemTile !== "_hotspot" && itemTile !== "_strongsoil")) { return false; }
        if(grid[x][y] !== null) {
            const crop = grid[x][y];
            if(crop.size === 2 || crop.x !== undefined) { return false; }
            let failChance = player.luck + 0.05; // 0.75 to 0.95 (or 0.83 to 1.03 on easy mode)
            if(type === "salt") {
                const saltResist = crop.saltResist || 0;
                switch(saltResist) {
                    case 0: failChance -= 0.3; break; // at best, 0.95 to 0.65
                    case 1: failChance -= 0.05; break; // at best, 0.95 to 0.9
                    case 2: failChance = 1; break; // will always fail
                }
            } else {
                if(crop.rotten || crop.health === 0) { failChance = 0; }
                else { failChance -= (1 - crop.health / crop.maxhealth) / 2; } // assuming the lowest, 0.75, this ranges from 0.75 to ~0.25 for crops about to die
            }
            if(Math.random() <= failChance) { return false; }
        }
        let newCrop = GetCrop(type);
        newCrop.activeTime = newCrop.time;
        grid[x][y] = newCrop;
        return true;
    }
    /** @param {number} x @param {number} y */
    BurnTile(x, y) {
        const player = game2.player;
        const grid = this.combat.grid;
        const fixGrid = player.fixtureGridInfo.grid;
        let itemTile = fixGrid[x][y];
        let crop = grid[x][y];
        let effect = this.combat.effectGrid[x][y];
        if(effect !== null && effect.type === "splashed") { return { status: false, wet: true }; }
        if(itemTile !== null && itemTile.x !== undefined) { itemTile = fixGrid[itemTile.x][itemTile.y]; }
        if(["_cow", "_lake", "_paddy", "_shooter", "_hotspot", "_modulator", "_sprinkler"].indexOf(itemTile) >= 0) { return { status: false }; }
        if(itemTile === "_strongsoil" && (Math.random() * player.luck) > 0.4) { return { status: false }; }

        let doesBurn = Math.random() > (player.luck / 2.5);
        if(doesBurn) { this.combat.effectGrid[x][y] = { type: "burned", duration: Math.ceil(Math.log2(this.enemy.atk)) }; }
        if(["_log", "_coop", "_beehive"].indexOf(itemTile) >= 0) {
            const hadTile = (crop !== null);
            if(!doesBurn) { doesBurn = Math.random() > (player.luck / 2.5); }
            if(doesBurn && hadTile) { crop.health = 0; crop.flagged = true; }
            return { status: true, crop: hadTile, destroyed: doesBurn && hadTile, special: itemTile, groundAffected: doesBurn };
        }
        if(crop === null) { return { status: true, crop: false, destroyed: false, groundAffected: doesBurn }; }
        let res = this.DoDamageCrop(x, y, [1]);
        if(res.destroyed) {
            //combat.animHelper.DrawCrops();
            return { status: true, crop: true, destroyed: true, special: "", groundAffected: doesBurn };
        } else {
            return { status: true, crop: true, destroyed: false, special: "", groundAffected: doesBurn };
        }
    }
    /**
     * @param {number} x
     * @param {number} y
     * @param {number[]} type
     * @param {number} [useDamage]
     */
    DoDamageCrop(x, y, type, useDamage) { // 0 = water, 1 = fire, 2 = salt, -1 = general
        let crop = this.combat.grid[x][y];
        if(crop === null) { return { status: false }; }
        if(crop.x !== undefined) { crop = this.combat.grid[crop.x][crop.y]; }
        const dmg = this.GetCropDamage(crop, x, y, type, useDamage);
        crop.health -= dmg;
        if(crop.rotten) { crop.health = 0; }
        if(crop.health <= 0) { console.log(`killed ${crop.name} at ${x}, ${y}`); crop.flagged = true; }
        return { status: true, crop: true, destroyed: (crop.health <= 0) };
    }
    /**
     * @param {{ size: number; }} crop
     * @param {number} x
     * @param {number} y
     * @param {number[]} type
     * @param {number} useDamage
     */
    GetCropDamage(crop, x, y, type, useDamage) { // type: 0 = water, 1 = fire, salt = 2, -1 = general
        const isBig = (crop.size === 2);
        const attackInfo = this.dmgCalcs.MeleeAttack(false, this.combat.season, (useDamage === undefined ? this.enemy.atk : useDamage), [crop], type)[0];
        let dmg = attackInfo.damage;
        console.log(dmg);
        if(isBig) { dmg /= 2; }
        const itemTile = game2.player.fixtureGridInfo.grid[x][y];
        if(itemTile === "_strongsoil") { dmg /= 2; }
        const d = isBig ? 1 : 0;
        this.targets.push({ x: x + d, y: y + d, type: type });
        return Math.ceil(dmg);
    }
}
class CombatSubscreen {
    /** @param {CombatScreen} combat */
    constructor(combat) {
        this.combat = combat;
    }
    /** @param {PIXIObj[]} elems */
    SetMenuContainer(elems) {
        if(this.combat.gfxContainers["menu"] !== undefined) {
            gfx2.RemoveContainer(this.combat.gfxContainers["menu"]);
        }
        this.combat.gfxContainers["menu"] = gfx2.CreateContainer(elems);
    }
    /** @param {string} key */
    KeyPress(key) { }
}
class CombatScreen extends GameScreen {
    /** @param {string[]} enemies */
    constructor(enemies) {
        super();
        sound.PlaySound("enterbattle");
        this.state = 0;
        this.isFalcon = false;
        this.doingFinalKill = false;
        this.saveChance = 1;
        this.lastTarget = 0;
        this.lastSelectedSeed = { x: 0, y: 0 };
        this.lastPlantedPos = { x: 0, y: 0 };
        this.expEarned = 0;
        this.moniesEarned = 0;
        this.itemsEarned = [];
        this.happyCows = [];
        this.usedShooters = [];
        this.didHarvest = false;
        this.harvestChain = 0;
        this.animHelper = null;
        // assume all of the above are useless until otherwise used
        
        // constants
        this.turnsInSeason = 30;

        // enemy setup
        let enemyWidth = 0, enemyHeight = 0;
        this.enemyTile = "tech";
        /** @type {CombatEnemy[]} */
        this.enemies = [];
        this.isBossBattle = false;
        const potentialSeasonDist = [0, 0, 0, 0];
        for(let i = 0; i < Math.min(4, enemies.length); i++) {
            const enemy = MonsterFactory.GetEnemy(enemies[i]);
            /*if(worldmap.customMap !== null) {
                const tier = 1 + 0.15 * Math.floor(worldmap.customMap.floor / 5);
                enemy.maxhealth = Math.ceil(enemy.maxhealth * tier);
                enemy.health = enemy.maxhealth;
                enemy.atk = Math.ceil(enemy.atk * tier);
                enemy.baseatk = enemy.atk;
                enemy.def = Math.ceil(enemy.def * tier);
                enemy.basedef = enemy.def;
                enemy.exp = Math.ceil(enemy.exp * tier);
            }*/
            for(let j = 0; j < 4; j++) {
                potentialSeasonDist[j] += enemy.seasonDistribution[j];
            }
            this.isBossBattle = this.isBossBattle || enemy.boss;
            enemyWidth+= enemy.fieldwidth;
            enemyHeight = Math.max(enemyHeight, enemy.fieldheight);
            this.enemyTile = enemy.tile;
            this.enemies.push(enemy);
        }
        const player = game2.player;
        this.grid = this.CreateGrid(player.fixtureGridInfo.width, player.fixtureGridInfo.height);
        this.effectGrid = this.CreateGrid(player.fixtureGridInfo.width, player.fixtureGridInfo.height);
        enemyWidth = Math.min(enemyWidth, 5);

        // seasonal shit
        this.season = 0;
        let seasonChance = Math.random();
        for(let j = 0; j < 4; j++) {
            potentialSeasonDist[j] /= enemies.length;
            if(seasonChance <= potentialSeasonDist[j]) {
                this.season = j;
                break;
            }
            seasonChance -= potentialSeasonDist[j];
        }
        this.seasonTime = 0;
        this.AdjustEnemyStatsToSeason();

        // grid position setup
        let playerGridX = 0, playerGridY = 5.125;
        let startX = 5;
        // TODO: test all positions and enemy positions (also probably just change all of them to be better)
        switch(player.fixtureGridInfo.width) { // 3, 4, 6, 8, 10
            case 4: playerGridX = 2; startX = 6; break;
            case 6: playerGridX = 1; startX = 7; break;
            case 8: playerGridX = 0.25; startX = 8.5; break;
            //case 10: playerGridX = 0.25; startX = 10.25; break;
            default: playerGridX = 2; break;
        }
        switch(player.fixtureGridInfo.height) { // 3, 4, 5, 6
            case 4: playerGridY += 1; break;
            case 5: playerGridY += 0.5; break;
            //case 6: playerGridY += 1; break;
            default: playerGridY += 1.5; break;
        }
        let enemyGridX = 0, enemyGridY = 0;
        this.isGarfwaxBattle = false;
        if(enemies[0] === "garfwax") { 
            enemyGridX = 10.625;
            enemyGridY = 1;
            this.isGarfwaxBattle = true;
        } else {
            enemyGridX = startX + 1 + (gfx2.tileW - startX - enemyWidth) / 2;
            if(enemies[0] === "nathan") { enemyGridX = player.fixtureGridInfo.width === 8 ? 8.75 : 8; }
            if((enemyGridX + enemyWidth) >= gfx2.tileW) { enemyGridX = gfx2.tileW - enemyWidth- 0.25; }
            enemyGridY = playerGridY + (game2.player.fixtureGridInfo.height - enemyHeight) / 2;
            while(enemyGridY <= 0) {
                enemyGridY += 0.25;
                playerGridY += 0.25;
            }
        }

        this.bgContainer = gfx2.CreateContainer([
            gfx2.CreateImg(AnimHelper.GetCombatBackground(game2.previousWorldState.mapName), 0, 0)
        ]);
        this.animEntityContainer = gfx2.CreateContainer([]);

        const entityY = 285;
        const hasFalcon = game2.player.hasFalcon;
        this.playerAnim = new CombatPlayerAnim(this.animEntityContainer, 192, entityY);
        this.falconAnim = hasFalcon ? new CombatFalconAnim(this.animEntityContainer, 100, entityY) : null;
        this.enemyAnims = this.enemies.map(e => new CombatEnemyAnim(this.animEntityContainer, e.size, e.spriteidx[0], e.spriteidx[1], 700, entityY));

        this.animEntities = [ this.playerAnim ];
        if(hasFalcon) { this.animEntities.push(this.falconAnim); }

        this.playerGridInfo = new CombatGridInfo(playerGridX, playerGridY, game2.player.fixtureGridInfo);
        /** @type {CropFieldInfo} */
        let enemyFieldInfo = null;
        if(this.enemies[0].tile === "nathan") {
            enemyFieldInfo = new NathanFieldInfo();
        } else {
            enemyFieldInfo = new CropFieldInfo(enemyWidth, enemyHeight, "");
        }
        this.enemyGridInfo = new CombatGridInfo(enemyGridX, enemyGridY, enemyFieldInfo);
        this.enemyGrid = this.CreateGrid(enemyFieldInfo.width, enemyFieldInfo.height);
        this.gfxContainers = {
            "bg": this.bgContainer,
            "fields": gfx2.CreateContainer([this.playerGridInfo.container, this.enemyGridInfo.container]),
            "entities": this.animEntityContainer
        }

        // misc. setup
        this.numPlantTurns = 0;
        this.playerInDanger = false;
        /** @type {CombatSubscreen} */
        this.subscreen = new CombatPlayerMenuSelection(this, {});

        /*for(let i = 0; i < this.enemies.length; i++) {
            if(this.enemies[i].initFunc === undefined) { continue; }
            combatInitFuncs[this.enemies[i].initFunc]();
        }
        
        if(skipTransition) {
            this.innerStartBattle();
        } else {
           this.transition.Start();
        }*/
        this.StartRound();

        this.animIdx = setInterval(() => this.Animate(), 40);
    }
    Animate() {

    }
    /** @param {string} key */
    KeyPress(key) {
        this.subscreen.KeyPress(key);
    }

    StartRound() {
        this.CleanUpEffects();
        this.isFalcon = false;
        //combat.enemyTurn.lastIdx = -1;
        this.numPlantTurns = game2.player.GetPlantingTurns();
        this.playerInDanger = false;
        for(let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].stickTurns = Math.max(0, this.enemies[i].stickTurns - 1);
        }
        if(this.usedShooters.length > 0) {
            this.usedShooters = [];
            //combat.animHelper.DrawBackground();
        }
        this.AgeCrops();
        this.state = 0;
        this.seasonTime += 1;
        if(this.seasonTime >= this.turnsInSeason) {
            this.season = (this.season + 1) % 4;
            this.seasonTime = 0;
        }
    }
    AdjustEnemyStatsToSeason() {
        this.seasonTime = 0;
        for(let i = 0; i < this.enemies.length; i++) {
            if(this.season === this.enemies[i].weakSeason) {
                this.enemies[i].atk = 0.5;
                this.enemies[i].def = 0.1;
            } else {
                this.enemies[i].atk = this.enemies[i].baseatk;
                this.enemies[i].def = this.enemies[i].basedef;
            }
        }
    }
    EndTurn(caller) {
        //this.clearAnimsAndRemoveCorpses();
        //this.animHelper.DrawBackground();
        //this.animHelper.DrawCrops();
        const player = game2.player;
        if(player.health <= 0) { //  !game.currentInputHandler.isTutorial
            this.animHelper.SetBirdAnimState("MOURN", true);
            this.animHelper.SetPlayerAnimState("CORPSE", true);
            //game.innerTransition(game.currentInputHandler, combat.inbetween, { next: combat.fuckingDead, text: GetText("diedInCombat") });
            return;
        } else if(this.enemies.length == 0) {
            player.AddEXP(this.expEarned);
            this.animHelper.SetBirdAnimState("WON", true);
            this.animHelper.SetPlayerAnimState("WON", true);
            let text = GetText("youDidATheWin");
            let resulties = [this.expEarned + "EXP"];

            player.AddMonies(this.moniesEarned);
            for(let i = 0; i < this.itemsEarned.length; i++) {
                player.IncreaseItem(this.itemsEarned[i][0], this.itemsEarned[i][1]);
            }
            /*if(this.moniesEarned > 0) { resulties.push(this.moniesEarned + "G"); }
            if(this.itemsEarned.length > 2) {
                let count = 0;
                for(let i = 0; i < this.itemsEarned.length; i++) { count += this.itemsEarned[i][1]; }
                resulties.push(count + HandlePlurals(GetText("gift.itemseed") + "{s}", count));
            } else {
                for(let i = 0; i < this.itemsEarned.length; i++) {
                    resulties.push(HandleGifts(this.itemsEarned[i][0], this.itemsEarned[i][1]));
                }
            }*/
            //text = HandleLists(text, "{res}", resulties, "", true, false);
            //game.innerTransition(game.currentInputHandler, combat.inbetween, { next: combat.checkForLevelUp, text: text });
            return;
        }
        if(this.state === 0 && !this.isFalcon) {
            if(this.didHarvest) {
                this.harvestChain++;
            } else {
                this.harvestChain = 0;
            }
        }
        this.didHarvest = false;
        this.state++;
        if(this.state === 1 && player.hasFalcon && !this.isFalcon) {
            this.state = 0;
            this.isFalcon = true;
            this.numPlantTurns = 1;
            this.subscreen = new CombatPlayerMenuSelection(this, {});
            //game.innerTransition(caller, combat.menu);
        } else if(this.state > this.enemies.length) {
            let anotherTurn = false;
            for(let i = 0; i < this.enemies.length; i++) {
                //if(this.enemies[i].turnFunc === undefined) { continue; }
                //anotherTurn |= this.enemies[i].stickTurns === 0 && combatEndTurnFuncs[this.enemies[i].turnFunc](this.enemies[i]);
            }
            if(anotherTurn) {
                this.state--;
                const idx = this.state - 1;
                //game.innerTransition(caller, combat.enemyTurn, { enemy: this.enemies[idx], idx: idx });
            } else {
                this.StartRound();
                //game.innerTransition(caller, combat.menu);
            }
        } else {
            console.log("chuggo is lit");
            const idx = this.state - 1;
            const enemy = this.enemies[idx];
            this.subscreen = new CombatEnemyTurn(this, enemy, idx);
            //game.innerTransition(caller, combat.enemyTurn, { enemy: this.enemies[idx], idx: idx });
        }
    }

    /** @param {number} damage */
    DamagePlayer(damage) {
        const player = game2.player;
        if(player.equipped.gloves !== null) {
            const g = GetEquipment(player.equipped.gloves);
            const mult = (g.def === undefined) ? 1 : (1 - g.def);
            damage = Math.max(1, Math.floor(damage * mult));
        }
        if(this.playerInDanger) {
            damage = 0;
        } else if(damage >= (player.maxhealth / 1.5) && damage >= player.health && Math.random() < this.saveChance && player.options.difficulty < 2) {
            this.playerInDanger = true;
            this.saveChance -= 0.33;
            damage = player.health - 1;
            player.health = 1;
        } else {
            const prevHealth = player.health;
            player.health = player.health - damage;
            if(player.health < 0) { player.health = 0; damage = prevHealth; }
        }
        if(player.health === 0 && player.options.difficulty === 0) {
            player.health = 1;
            damage -= 1;
        }
        return damage;
    }

    /** @param {number} w @param {number} h */
    CreateGrid(w, h) {
        const g = [];
        for(let x = 0; x < w; x++) {
            const row = [];
            for(let y = 0; y < h; y++) { row.push(null); }
            g.push(row);
        }
        return g;
    }
    /* #region Animation */
    CleanUpEffects() {
        const player = game2.player;
        let redraw = false;
        for(let x = 0; x < player.fixtureGridInfo.width; x++) {
            for(let y = 0; y < player.fixtureGridInfo.height; y++) {
                const obj = this.effectGrid[x][y];
                if(obj === null) { continue; }
                if(--obj.duration <= 0) {
                    redraw = true;
                    this.effectGrid[x][y] = null;
                }
            }
        }
        if(redraw) {
            //combat.animHelper.DrawBackground();
        }
    }
    /** @param {(x: number, y: number) => boolean} compareFunc */
    GetNoNoCursorsContainer(compareFunc) {
        const sprites = [];
        for(let x = 0; x < this.playerGridInfo.width; x++) {
            for(let y = 0; y < this.playerGridInfo.height; y++) {
                if(compareFunc(x, y)) {
                    sprites.push(gfx2.CreateSmallSprite("x", this.playerGridInfo.x + x, this.playerGridInfo.y + y, true));
                }
            }
        }
        return gfx2.CreateContainer(sprites, false, true);
    }
    /* #endregion */
    /* #region Crops */

    /** @param {NewCropDetail} activeCrop @param {number} px @param {number} py @param {number} diff */
    IsValidPlantingLocation(activeCrop, px, py, diff) {
        const gridInfo = this.playerGridInfo.gridInfo, grid = gridInfo.grid, fixtureGrid = game2.player.fixtureGridInfo.grid;
        if(gridInfo.width <= px || gridInfo.height <= py) { return false; }
        if(activeCrop.type === "moist") {
            if(diff === 1) {
                return this.IsValidLocationForCrop(activeCrop, grid, fixtureGrid, px, py) || this.IsValidLocationForCrop(activeCrop, grid, fixtureGrid,px + 1, py)
                        || this.IsValidLocationForCrop(activeCrop, grid, fixtureGrid,px, py + 1) || this.IsValidLocationForCrop(activeCrop, grid, fixtureGrid,px + 1, py + 1);
            } else {
                return this.IsValidLocationForCrop(activeCrop, grid, fixtureGrid,px, py);
            }
        }
        if(diff === 1) {
            if(fixtureGrid[px][py] === "_cow") { return this.IsValidLocationForCrop(activeCrop, grid, fixtureGrid,px + 1, py + 1); }
            if(gridInfo.width <= (px + 1) || gridInfo.height <= (py + 1)) { return false; }
            if(grid[px][py] !== null) { return false; }
            if(grid[px + 1][py] !== null) { return false; }
            if(grid[px][py + 1] !== null) { return false; }
            if(grid[px + 1][py + 1] !== null) { return false; }
            return this.IsValidLocationForCrop(activeCrop, grid, fixtureGrid,px, py) && this.IsValidLocationForCrop(activeCrop, grid, fixtureGrid,px + 1, py)
                    && this.IsValidLocationForCrop(activeCrop, grid, fixtureGrid,px, py + 1) && this.IsValidLocationForCrop(activeCrop, grid, fixtureGrid,px + 1, py + 1);
        } else {
            if(grid[px][py] !== null) { return (grid[px][py].name === "salt" && activeCrop.saltClean); }
            return this.IsValidLocationForCrop(activeCrop, grid, fixtureGrid, px, py);
        }
    }
    /**
     * @param {NewCropDetail} activeCrop
     * @param {any[][]} grid
     * @param {any[][]} itemGrid
     * @param {number} x
     * @param {number} y
     */
    IsValidLocationForCrop(activeCrop, grid, itemGrid, x, y) {
        if(activeCrop.type === "moist") {
            let crop = grid[x][y];
            if(crop === null) { return false; }
            if(crop.x !== undefined) { crop = grid[crop.x][crop.y]; }
            return ["veg", "tree", "rice"].indexOf(crop.type) >= 0;
        }
        const type = itemGrid[x][y];
        if(type === null) { return activeCrop.type === "veg" || activeCrop.type === "tree"; }
        const parent = (type.x !== undefined ? itemGrid[type.x][type.y] : type);
        if(type === "_shooter") {
            if(["veg", "mush", "rice"].indexOf(activeCrop.type) < 0) { return false; }
            if(this.effectGrid[x][y] !== null && this.effectGrid[x][y].type === "shocked") { return false; }
            return this.GetUsedShooterIndex(x, y) < 0;
        }
        if(type === "_modulator") {
            if(this.effectGrid[x][y] !== null && this.effectGrid[x][y].type === "shocked") { return false; }
            return activeCrop.type === "veg";
        }
        if(type === "_strongsoil") { return activeCrop.type === "veg" || activeCrop.type === "tree"; }
        const isBurned = (this.effectGrid[x][y] !== null && this.effectGrid[x][y].type === "burned");
        if(type === "_log") { return activeCrop.type === "mush" && !isBurned; }
        if(type === "_beehive") { return activeCrop.type === "bee" && !isBurned; }
        if(type === "_coop") { return activeCrop.type === "egg" && !isBurned; }
        if(type === "_paddy") { return activeCrop.type === "rice"; }
        if(type === "_lake") { return activeCrop.type === "water" || activeCrop.type === "rod" || activeCrop.type === "spear"; }
        if(type === "_hotspot" || parent === "_hotspot") {
            if(this.effectGrid[x][y] !== null && this.effectGrid[x][y].type === "shocked") { return false; }
            return activeCrop.type === "tech";
        }
        if(parent === "_charger") {
            const okspot = y === (itemGrid[x][y].y + 1) && x === itemGrid[x][y].x;
            return okspot && activeCrop.type == "sickle2";
        }
        if(type.corner === "_cow") { return ["food", "veg", "rice", "mush", "tree"].indexOf(activeCrop.type) >= 0; }
    }
    /** @param {number} x @param {number} y */
    GetUsedShooterIndex(x, y)  {
        for(let i = 0; i < this.usedShooters.length; i++) {
            if(this.usedShooters[i].x === x && this.usedShooters[i].y === y) {
                return i;
            }
        }
        return -1;
    }

    GetEnemyCropCount() {
        return this.enemyGridInfo.MatchingCount(tile => (tile === null || tile.x !== undefined));
    }
    AgeCrops() {
        //const player = game2.player;
        for(let x = 0; x < this.playerGridInfo.width; x++) {
            for(let y = 0; y < this.playerGridInfo.height; y++) {
                this.AgeCrop(this.grid, x, y, this.GetCatchChance);
            }
        }
        //if(!conditions["UNPLUGGED"]()) {
            for(let x = 0; x < this.enemyGridInfo.width; x++) {
                for(let y = 0; y < this.enemyGridInfo.height; y++) {
                    this.AgeCrop(this.enemyGrid, x, y, this.GetEnemyCatchChance);
                }
            }
        //}
        //combat.animHelper.DrawCrops();
    }
    /**
     * @param {any[][]} grid
     * @param {number} x
     * @param {number} y
     * @param {{ (crop: { type: string; power: number; }): number; (crop: { type: string; power: number; }): number; (arg0: any): number; }} catchFunc
     */
    AgeCrop(grid, x, y, catchFunc) {
        if(grid[x][y] === null || grid[x][y].name === undefined) { return; }
        const player = game2.player;
        const crop = grid[x][y];
        if(crop.type === "water" || crop.type === "rod") {
            const success = Math.random() <= (this.GetCatchChance(crop) * player.luck);
            if(success) {
                if((crop.name === "net" || crop.name === "bignet") && crop.rotten) {
                    crop.rotten = false;
                    const range = MathB.RangeInclusive(-2, 2);
                    crop.power += range;
                    crop.fishNum = crop.name === "bignet" ? 5 : 3;
                    crop.activeTime = crop.time;
                } else if(crop.type === "rod" && !crop.ready && !crop.rotten) {
                    crop.ready = true;
                    crop.activeTime = 0;
                    crop.fishNum = this.GetFish(crop, player.luck);
                    crop.power += crop.fishNum;
                }
            }
        } else if(crop.type === "bee" && Math.random() <= (catchFunc(crop) * player.luck)) {
            crop.rotten = false;
            crop.activeTime = 0;
        }
        if(crop.activeTime > 0) {
            crop.activeTime -= 1;
            if(crop.activeTime === 0 && (crop.type === "sickle2" || crop.type === "rock" || (crop.type === "rod" && !crop.ready))) { crop.health = 0; this.PurgeCrop(grid, x, y); }
        } else if(crop.activeTime === 0) {
            if(crop.rotResistActive) { crop.rotResistActive = false; }
            else if(crop.respawn > 0 && (crop.type === "veg" || crop.type === "tree")) { crop.activeTime = this.GetGrowthTime(crop, x, y, true); }
            else if(crop.type === "veg") { crop.rotten = true; }
            else if(crop.type === "egg") { crop.power = Math.min(crop.initpower + 3, crop.power + 0.5); }
            else if(crop.type === "rod" && !crop.ready) { crop.health = 0; this.PurgeCrop(grid, x, y); }
        }
    }
    /** @param {any[][]} grid @param {number} x @param {number} y */
    PurgeCrop(grid, x, y) {
        if(grid[x][y] === null || grid[x][y].name === undefined) { return false; }
        const crop = grid[x][y];
        if(crop.respawn > 0 && crop.health > 0) {
            crop.activeTime = this.GetGrowthTime(crop, x, y, true);
            crop.flagged = false;
        } else {
            grid[x][y] = null;
            if(crop.size === 2) {
                grid[x + 1][y] = null;
                grid[x][y + 1] = null;
                grid[x + 1][y + 1] = null;
            }
        }
        //combat.animHelper.DrawCrops();
        return (crop.size === 2);
    }

    /**
     * @param {{ respawn: any; time: any; type: string; size: number; }} crop
     * @param {number} x
     * @param {number} y
     * @param {boolean} regrow
     */
    GetGrowthTime(crop, x, y, regrow) {
        const player = game2.player;
        const baseTime = regrow ? crop.respawn : crop.time;
        if(["spear", "rod", "water", "bee", "egg", "sickle2"].indexOf(crop.type) >= 0) {
            return baseTime;
        } else if(crop.type === "tech") {
            return Math.ceil(baseTime / player.GetCropSpeedMultiplier());
        } else {
            const sprinkMult = this.GetSprinklerMultiplier(x, y, crop.size - 1);
            if(sprinkMult < 1) { player.miscData.techFixturesUsed++; }
            return Math.ceil(baseTime / player.GetCropSpeedMultiplier() * sprinkMult);
        }
    }
    /** @param {number} x @param {number} y @param {number} [size] */
    GetSprinklerMultiplier(x, y, size) {
        let mult = 1;
        if(this.IsSprinkler(x - 1, y - 1)) { mult -= 0.1; }
        if(this.IsSprinkler(x - 1, y)) { mult -= 0.2; }
        if(this.IsSprinkler(x - 1, y + 1)) { mult -= 0.1; }
        if(this.IsSprinkler(x, y - 1)) { mult -= 0.2; }
        if(this.IsSprinkler(x, y + 1)) { mult -= 0.2; }
        if(this.IsSprinkler(x + 1, y - 1)) { mult -= 0.1; }
        if(this.IsSprinkler(x + 1, y)) { mult -= 0.2; }
        if(this.IsSprinkler(x + 1, y + 1)) { mult -= 0.1; }
        mult = Math.max(mult, 0.33);
        if(mult < 1) { return mult; }
        if(size === 1) {
            let cornerMult = this.GetSprinklerMultiplier(x + 1, y);
            if(cornerMult < 1) { return cornerMult; }
            cornerMult = this.GetSprinklerMultiplier(x + 1, y + 1);
            if(cornerMult < 1) { return cornerMult; }
            cornerMult = this.GetSprinklerMultiplier(x, y + 1);
            if(cornerMult < 1) { return cornerMult; }
        }
        return 1;
    }
    /** @param {number} x @param {number} y */
    IsSprinkler(x, y) {
        const player = game2.player;
        if(x < 0 || y < 0 || x >= player.fixtureGridInfo.width || y >= player.fixtureGridInfo.height) { return false; }
        if(player.fixtureGridInfo.grid[x] === null || player.fixtureGridInfo.grid[x] === undefined) { return false; }
        return player.fixtureGridInfo.grid[x][y] === "_sprinkler";
    }

    /** @param {{ type: string; power: number; }} crop */
    GetCatchChance(crop) { // rods, nets, bees, spears
        if(crop.type === "water") { return 0.2; }
        if(crop.type === "spear") { return 0.45; }
        let val = 0.3;
        if(crop.power < 2) { val = 0.15; }
        else if(crop.power < 6) { val = 0.175; }
        else if(crop.power < 10) { val = 0.2; }
        if(crop.type === "bee") { val *= 0.75; }
        return val;
    }
    /** @param {{ type: string; power: number; }} crop */
    GetEnemyCatchChance(crop) {
        if(crop.type === "bee" && ["beeQueenA", "beeQueenB", "beeQueenC"].indexOf(this.enemies[0].id) >= 0) { return 0.65; }
        else { return this.GetCatchChance(crop); }
    }
    /**@param {{ name: string }} crop @param {number} luck */
    GetFish(crop, luck) { // rods & spears
        let fishArr = [0, 1, 2];
        switch(crop.name) {
            case "rod": fishArr = [0, 0, 1]; break;
            case "goodrod": fishArr = [0, 1, 1, 2]; break;
            case "metalrod": fishArr = [1, 1, 1, 2]; break;
            case "ultrarod": fishArr = [2, 4, 4, 4]; break; // 3 = net
        }
        return fishArr[Math.floor(fishArr.length * Math.random() * luck)];
    }
    /* #endregion */
}

class CombatGridInfo {
    /**
     * @param {number} offsetX
     * @param {number} offsetY
     * @param {CropFieldInfo} gridInfo
     */
    constructor(offsetX, offsetY, gridInfo) {
        this.x = offsetX;
        this.y = offsetY;
        this.gridInfo = gridInfo;
        /** @returns {any} */
        this.clickHandler = () => true;
        /** @param {number} x @param {number} y @returns {any} */
        this.hoverHandler = (x, y) => true;
        this.container = gridInfo.GetFarmDisplayContainer(offsetX, offsetY, 1, () => this.clickHandler(), (x, y) => this.hoverHandler(x, y), this);
        this.width = gridInfo.width;
        this.height = gridInfo.height;
    }
    /** @param {{ (tile: any): boolean }} cropFunc */
    MatchingCount(cropFunc) {
        let count = 0;
        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++) {
                const tile = this.gridInfo.grid[x][y];
                if(cropFunc(tile)) { count++; }
            }
        }
        return count;
    }
    SetHandlers(moveHandler, clickHandler) {

    }
}
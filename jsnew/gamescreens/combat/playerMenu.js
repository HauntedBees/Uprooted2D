class CombatMenuOption extends InfoText {
    /**
     * @param {string} nameKey
     * @param {string} descText
     * @param {number} x
     * @param {number} y
     * @param {boolean} selected
     * @param {() => void} clickHandler
     * @param {() => void} hoverHandler
     * @param {boolean} accessible
     */
    constructor(nameKey, descText, x, y, selected, clickHandler, hoverHandler, accessible) {
        super(GetText(nameKey), x, y, selected, clickHandler, hoverHandler, { forceWidth: 1.75 });
        this.key = nameKey;
        this.name = GetText(nameKey);
        this.desc = GetText(descText);
        this.accessible = accessible;
    }
}
class CombatPlayerMenuSelection extends CombatSubscreen {
    /**
     * @param {CombatScreen} combat
     * @param {{ canOnlyPlant?: boolean; notFirst?: boolean; }} args
     */
    constructor(combat, args) {
        super(combat);
        const player = game2.player;

        if(args === undefined && player.health < (player.maxhealth / 4)) { sound.PlaySound("dangeresque"); }

        this.CreateMenu();

        this.plantedAlreadyAndCantAttack = args.canOnlyPlant || false;
        this.IsFalconTurn = false;
        if(!args.notFirst) {
            /*if(combat.isFalcon) {
                combat.animHelper.AddAnim(new SheetAnim(2, 7, 700, "pointer", 6, true));
            } else {
                combat.animHelper.AddAnim(new SheetAnim(3.4375, 7, 700, "pointer", 6, true));
            }*/
        }

        /*if(player.equipped.weapon !== null && GetEquipment(player.equipped.weapon).tech) {
            let hasCharger = false;
            for(let x = 0; x < player.gridInfo.width; x++) {
                if(hasCharger) { break; }
                for(let y = 0; y < player.gridInfo.height; y++) {
                    const item = combat.grid[x][y]
                    if(item !== null && item.type === "sickle2") {
                        hasCharger = true;
                        break;
                    }
                }
            }
            player.equipped.weapon = hasCharger ? "!sickle2" : "!sickle2_weak";
        }*/
    }
    CreateMenu() {
        const player = game2.player;
        const leftX = 310, w = 193, buttonY = 740;

        /** @type {CombatMenuOption[]} */
        this.options = [];

        let plantKey = "combatPlant", plantDesc = "seeds_one", canPlant = true;
        if(!this.IsFalconTurn && !player.HasSeeds() && !player.CanMelee(this.combat.GetEnemyCropCount())) { // has no seeds
            if(this.combat.playerGridInfo.MatchingCount(tile => (tile !== null && !tile.rotten)) > 0) { // at least one crop is growing
                plantKey = "combatSkip";
                plantDesc = "combatSkipDesc";
            } else { // no crops are growing
                plantKey = "combatSurrender";
                plantDesc = "combatSurrenderDesc";
            }
        } else if(!this.PlayerHasThingsToPlant()) {
            plantKey = "combatSkip";
            plantDesc = "combatSkipDesc";
        }
        this.options.push(new CombatMenuOption(plantKey, plantDesc, leftX, buttonY, true, () => this.Select(), () => this.CursorMove(0), canPlant));

        let attackKey = "combatAttack", attackDesc = "attack_melee", canAttack = true;
        this.options.push(new CombatMenuOption(attackKey, attackDesc, leftX + w, buttonY, false, () => this.Select(), () => this.CursorMove(1), canAttack));
        
        let compostKey = "combatCompost", compostDesc = "compost_can", canCompost = true;
        this.options.push(new CombatMenuOption(compostKey, compostDesc, leftX + w * 2, buttonY, false, () => this.Select(), () => this.CursorMove(2), canCompost));

        let runKey = "combatRun", runDesc = "run_can", canRun = true;
        this.options.push(new CombatMenuOption(runKey, runDesc, leftX + w * 3, buttonY, false, () => this.Select(), () => this.CursorMove(3), canRun));

        this.HPText = gfx2.WriteText("HP: " + player.health + "/" + player.maxhealth, "std", 127, 755, "center");
        this.descText = gfx2.WriteWrappedText(GetText(plantDesc), "std", 275, 822, 715, "left");

        const centerX = 127;
        this.seasonIco = gfx2.CreateSmallSprite("seasonico", centerX, 812, false, true);
        this.curSeasonSymbol = gfx2.CreateSmallSprite("season2", centerX - 90, 835, false, false);
        this.curSeasonText = gfx2.WriteText("Autumn", "stdSmall", centerX - 20, 837, "left");
        this.SetSeasonDisplay();

        this.cursor = new SelCursor(254, buttonY, 112, -20, 193, 0, false);

        const menuContainers = [
            gfx2.DrawBox("FarmInfo", 15, 740, 160, 80, false),
            gfx2.DrawBox("FarmInfo", 254, 799, 691, 21, false),
            ...this.options.map(e => e.container),
            this.HPText, this.descText,
            gfx2.CreateSmallSprite("seasonbar0", 95, 812, false, true),
            gfx2.CreateSmallSprite("seasonbar1", 159, 812, false, true),
            this.seasonIco,
            this.curSeasonSymbol,
            this.curSeasonText,
            this.cursor.container
        ];
        this.SetMenuContainer(menuContainers);
    }
    SetSeasonDisplay() {
        const season = this.combat.season;
        const dayPercent = this.combat.seasonTime / this.combat.turnsInSeason;
        this.curSeasonText.text = GetText(`season${season}`);
        this.curSeasonSymbol.texture = gfx2.img.sprites[`season${season}`];
        const leftX = 65, dx = 31;
        this.seasonIco.position.x = leftX + season * dx + dx * dayPercent;
    }

    PlayerHasThingsToPlant() {
        const crops = game2.player.crops;
        if(crops.length === 0) { return false; }
        const gridInfo = this.combat.playerGridInfo.gridInfo;
        for(let i = 0; i < crops.length; i++) {
            const crop = GetCrop(crops[i][0]);
            for(let x = 0; x < gridInfo.width; x++) {
                for(let y = 0; y < gridInfo.height; y++) {
                    if(this.combat.IsValidPlantingLocation(crop, x, y, crop.size - 1) && this.combat.IsValidLocationForCrop(crop, gridInfo.grid, game2.player.fixtureGridInfo.grid, x, y)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    HighlightReadyCropsAndReturnCount() {
        if(this.IsFalconTurn) { return 0; }
        let count = 0;
        const gI = this.combat.playerGridInfo.gridInfo;
        for(let x = 0; x < gI.width; x++) {
            for(let y = 0; y < gI.height; y++) {
                const tile = gI.grid[x][y];
                if(tile === null || tile.x !== undefined) { continue; }
                if(tile.name === "app") { if(tile.activeTime > 2) { continue; } }
                else if(tile.rotten || tile.activeTime > 0) { continue; }
                count++;
                const size = tile.size - 1;
                // TODO: display
                //gfx.DrawXCursor(x + combat.dx, y + combat.dy, size, size);
            }
        }
        return count;
    }

    /** @param {number} pos */
    CursorMove(pos) {
        this.options[this.cursor.posX].Unselect();
        this.cursor.MoveTo(pos, 0);
        this.options[this.cursor.posX].Select();
        this.descText.text = this.options[this.cursor.posX].desc;
        if(!this.options[this.cursor.posX].accessible) {
            this.combat.playerAnim.SetAnim("CANTDO");
        } else {
            let anim = "STAND";
            switch(this.cursor.posX) {
                case 0:
                    anim = "WANTPLANT"; // TODO: check if "PASS"
                    break;
                case 1:
                    anim = "WANTATTACK";
                    break;
                case 2:
                    anim = "WANTCOMPOST";
                    break;
                case 3:
                    anim = "THINK"; // TODO: change to "WANTRUN" check if "PASS" (but probably not anymore actually)
                    break;
            }
            this.combat.playerAnim.SetAnim(anim);
        }
    }
    Select() {
        const selection = this.options[this.cursor.posX];
        if(!selection.accessible) {
            // TODO: a funny sound for the childrens
            return;
        }
        // TODO: a funny sound for the childrens
        if(selection.key === "combatPlant") {
            this.combat.subscreen = new CombatPlayerPlantingSelection(this.combat);
        }
    }

    /** @param {string} key */
    KeyPress(key) {
        const controls = this.combat.controls;
        let pos = this.cursor.posX, isEnter = false;
        switch(key) {
            case controls["left"]: pos--; break;
            case controls["right"]: pos++; break;
            case controls["confirm"]:
            case controls["pause"]: isEnter = true; break;
        }
        if(pos < 0 || pos > 3) { return false; }
        if(isEnter) { return this.Select(); }
        else { return this.CursorMove(pos); }
    }
}
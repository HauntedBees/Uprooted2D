class CombatPlayerPlantingSelection extends CombatSubscreen {
    /**
     * @param {CombatScreen} combat
     */
    constructor(combat) {
        super(combat);
        this.activeCrop = null;
        this.selectedIdx = -1;
        this.menuWidth = 12;
        this.CreateMenu();
    }
    CreateMenu() {
        const player = game2.player;
        this.crops = player.crops;
        const cropIcons = [], offx = 0.125, offy = 10.875, width = this.menuWidth;
        for(let i = 0; i < this.crops.length; i++) {
            const x = i % width, y = Math.floor(i / width), crop = this.crops[i];
            const itemSprite = gfx2.CreateInventoryItem(crop, offx + x, offy + y, true);
            MakeSpriteInteractive(itemSprite, () => this.Select(), () => this.CursorMovePick(x, y));
            cropIcons.push(itemSprite);
        }

        const season = this.combat.season;
        const dayPercent = this.combat.seasonTime / this.combat.turnsInSeason;
        const seasonX = 872, seasonY = 598;
        const dx = 31, seasonIcoX = season * dx + dx * dayPercent - 30;
        this.cursorPick = new SelCursor(offx, offy, 0, 0, 1, 1, true);

        const cropoffx = this.combat.playerGridInfo.x, cropoffy = this.combat.playerGridInfo.y;
        this.cursorPlant = new SelCursor(cropoffx, cropoffy, 0, 0, 1, 1, true);
        this.cursorPlant.Hide();

        const menuContainers = [
            gfx2.DrawBox("FarmInfo", 0, 690, 744, 146, false),
            gfx2.DrawBox("FarmInfo", 783, 594, 177, 242, false),
            ...cropIcons,
            gfx2.CreateSmallSprite("seasonbar0", seasonX, seasonY, false, true),
            gfx2.CreateSmallSprite("seasonbar1", seasonX + 64, seasonY, false, true),
            gfx2.CreateSmallSprite("seasonico", seasonX + seasonIcoX, seasonY, false, true),
            this.cursorPick.container
        ];
        this.SetMenuContainer(menuContainers);
        this.UpdateCropSelectionInfo(true, true);
    }
    /** @param {boolean} isCrop @param {boolean} [isFirst] */
    UpdateCropSelectionInfo(isCrop, isFirst) {
        if(!isFirst) {
            this.combat.gfxContainers["menu"].removeChild(this.cropPowerDisplay);
            this.combat.gfxContainers["menu"].removeChild(this.cropInvalidSpots);
        }
        if(isCrop) {
            const newIdx = this.cursorPick.posY * this.menuWidth + this.cursorPick.posX;
            const crop = game2.player.crops[newIdx];
            const cropObj = GetCrop(crop[0]);
            this.cropPowerDisplay = gfx2.DrawCropInfo(cropObj, "stdSmaller", true, 794, 602, 856, 100, true, true, crop[1], this.combat.season);
            this.combat.gfxContainers["menu"].addChild(this.cropPowerDisplay);
    
            this.cropInvalidSpots = this.combat.GetNoNoCursorsContainer((x, y) => !this.combat.IsValidLocationForCrop(cropObj, this.combat.playerGridInfo.gridInfo.grid, game2.player.fixtureGridInfo.grid, x, y));
            this.combat.gfxContainers["menu"].addChild(this.cropInvalidSpots);
        } else {
            const player = game2.player;
            const x = this.cursorPlant.posX, y = this.cursorPlant.posY;
            const grid = this.combat.playerGridInfo.gridInfo.grid;
            const fixtureGrid = player.fixtureGridInfo.grid;
            let tileInfo = grid[x][y];
            const effectInfo = this.combat.effectGrid[x][y];
            const fixtureInfo = fixtureGrid[x][y];
            
            if(tileInfo === null && effectInfo === null && fixtureInfo === null) {
            } if(tileInfo !== null) {
                if(tileInfo.x !== undefined) { tileInfo = grid[tileInfo.x][tileInfo.y]; }
                // TODO: active crop view
                this.cropPowerDisplay = gfx2.DrawCropInfo(tileInfo, "stdSmaller", true, 794, 602, 856, 100, true, true, 1, this.combat.season);
            } else if(fixtureInfo !== null) {
                // TODO
            } else if(effectInfo !== null) {
                // TODO
            } else {
                const speed = Math.round(player.GetCropSpeedMultiplier() * (1 / player.fixtureGridInfo.GetSprinklerMultiplier(x, y, 1)) * 100);
                const text = GetText("farmModDirt").replace(/\{0\}/g, speed);
                this.cropPowerDisplay = gfx2.WriteWrappedMultiFormatText(text, "stdSmaller", {
                    "h": gfx2.TextStyles["std"]
                }, 800, 608, 222, "left");
            }
            this.combat.gfxContainers["menu"].addChild(this.cropPowerDisplay);
            
            const crop = game2.player.crops[this.selectedIdx];
            const selCrop = GetCrop(crop[0]);
            this.cropInvalidSpots = this.combat.GetNoNoCursorsContainer((x, y) => !this.combat.IsValidLocationForCrop(selCrop, this.combat.playerGridInfo.gridInfo.grid, game2.player.fixtureGridInfo.grid, x, y));
            this.combat.gfxContainers["menu"].addChild(this.cropInvalidSpots);
        }
    }

    /** @param {number} x @param {number} y */
    CursorMovePick(x, y) {
        if(this.selectedIdx >= 0) { return false; }
        this.cursorPick.MoveTo(x, y);
        this.UpdateCropSelectionInfo(true);
    }
    /** @param {number} x @param {number} y */
    CursorMovePlant(x, y) {
        if(this.selectedIdx < 0) { return false; }
        const pgi = this.combat.playerGridInfo;
        if((x + this.activeCrop.size - 1) >= pgi.width || (y + this.activeCrop.size - 1) >= pgi.height) { return false; }
        this.cursorPlant.MoveTo(x, y);
        this.UpdateCropSelectionInfo(false);
    }
    Select() {
        if(this.selectedIdx < 0) {
            this.selectedIdx = this.cursorPick.posY * this.menuWidth + this.cursorPick.posX;
            this.activeCrop = GetCrop(game2.player.crops[this.selectedIdx][0]);
            this.cursorPlant.Show();
            // TODO: set position
            this.cursorPlant.Resize(this.activeCrop.size - 1, this.activeCrop.size - 1, true).Redraw();
            this.combat.playerGridInfo.hoverHandler = (x, y) => this.CursorMovePlant(x, y);
            this.combat.playerGridInfo.clickHandler = () => this.Select();
        } else {
            const player = game2.player, fixGrid = player.fixtureGridInfo.grid, actualGrid = this.combat.playerGridInfo.gridInfo.grid;
            //const px = pos.x - combat.dx, py = pos.y - combat.dy;
            //combat.lastPlantedPos = { x: px, y: py };
            const px = this.cursorPlant.posX, py = this.cursorPlant.posY, diff = this.activeCrop.size - 1;
            if(!this.combat.IsValidPlantingLocation(this.activeCrop, px, py, this.activeCrop.size - 1)) {
                sound.PlaySound("navNok");
                return false;
            }
            let newCrop = GetCrop(this.activeCrop.name);
            //if(combat.grid[px][py] !== null && combat.grid[px][py].name === "salt") { newCrop.power = Math.ceil(newCrop.power / 2); }
            let cropIsKill = false, killType = 0;
            if(player.equipped.gloves !== null && GetEquipment(player.equipped.gloves).tech && !this.combat.isFalcon) {
                if(["tree", "rice", "veg", "mush"].indexOf(newCrop.type) >= 0 && Math.random() <= 0.1) {
                    cropIsKill = true;
                    killType = 1;
                } // shock gloves can ruin crops
            }
            if(player.equipped.soil !== null && GetEquipment(player.equipped.soil).tech) {
                if(["tree", "rice", "veg", "mush"].indexOf(newCrop.type) >= 0 && (newCrop.power <= 5 || newCrop.time <= 5)) {
                    cropIsKill = true;
                    killType = 2;
                } else if(newCrop.type === "bee") {
                    cropIsKill = true;
                    killType = 3;
                } // pesticide can ruin plants and bees
            }
            if(newCrop.type === "moist") { // water that crop
                /*const watered = [];
                watered.push(this.WaterCrop(px, py, newCrop.power));
                if(newCrop.size === 2) {
                    watered.push(this.WaterCrop(px + 1, py, newCrop.power, watered));
                    watered.push(this.WaterCrop(px, py + 1, newCrop.power, watered));
                    this.WaterCrop(px + 1, py + 1, newCrop.power, watered);
                    //this.finishTurn(GetText("plFishFail")); // why the fuck was this here
                }
                this.finishTurn(GetText("waterCrops"));
                Sounds.PlaySound("water");*/
                return true;
            } if(fixGrid[px][py] === "_shooter") { // seed shooter
                /*if(combat.getUsedShooterIndex(px, py) >= 0) { Sounds.PlaySound("navNok"); return false; }
                player.miscdata.techFixturesUsed++;
                combat.usedShooters.push({x: px, y: py});
                this.LaunchSeeds();
                Sounds.PlaySound("hit_gun");*/
                return true;
            } else if(fixGrid[px][py] === "_modulator") { // change season
                /*player.miscdata.techFixturesUsed++;
                this.Modulate();
                Sounds.PlaySound("bamham");*/
                return true;
            } else if(this.activeCrop.type === "spear") { // throw spear
                /*this.ThrowSpear(px, py);
                Sounds.PlaySound("voip");*/
                return true;
            }
            player.ShiftTech(newCrop.type === "tech" ? 0.04 : -0.01);
            let soundText = "dismisstext";
            if((diff === 0 && fixGrid[px][py] !== null && fixGrid[px][py].corner === "_cow") ||
                (diff === 1 && fixGrid[px + 1][py + 1] !== null && fixGrid[px + 1][py + 1].corner === "_cow")) { // feed cow
                /*cropIsKill = false;
                const cowDelta = (diff === 1 ? 0 : 1);
                const cowIdx = combat.getCowIndex(px - cowDelta, py - cowDelta);
                player.miscdata.typesPlanted["cow"] += 1;
                if(cowIdx >= 0) {
                    combat.happyCows[cowIdx].feed += newCrop.power;
                } else {
                    combat.happyCows.push({ x: px - cowDelta, y: py - cowDelta, feed: newCrop.power });
                }*/
                soundText = "itemget";
            } else { // plant crop
                newCrop.activeTime = this.combat.GetGrowthTime(newCrop, px, py, false);
                const effects = this.combat.effectGrid[px][py];
                player.miscData.typesPlanted[newCrop.type] += 1;
                if(!cropIsKill) {
                    if(effects !== null) {
                        const hasStrongSoil = (fixGrid[px][py] === "_strongsoil");
                        if(effects.type === "shocked") {
                            newCrop.power = hasStrongSoil ? 2 : 1;
                            newCrop.health = hasStrongSoil ? Math.ceil(newCrop.health * 0.2) : 1;
                        } else if(effects.type === "splashed") {
                            let powMult = hasStrongSoil ? 0.6 : 0.5;
                            switch(newCrop.waterResist) {
                                case 2: powMult += 0.4; break;
                                case 1: powMult += 0.2; break;
                            }
                            newCrop.power = Math.ceil(newCrop.power * powMult);
                            newCrop.health = Math.ceil(newCrop.health * powMult);
                        } else if(effects.type === "burned") {
                            let powMult = hasStrongSoil ? 0.5 : 0.3;
                            switch(newCrop.fireResist) {
                                case 2: powMult += 0.5; break;
                                case 1: powMult += 0.25; break;
                            }
                            newCrop.power = Math.ceil(newCrop.power * powMult);
                            newCrop.health = Math.ceil(newCrop.health * powMult);
                        }
                    }
                    actualGrid[px][py] = newCrop;
                    if(diff === 1) {
                        const ppos = { x: px, y: py };
                        actualGrid[px + 1][py] = ppos;
                        actualGrid[px][py + 1] = ppos;
                        actualGrid[px + 1][py + 1] = ppos;
                    }
                }
            }
            //this.cursor = { x: 0, y: this.dy };
            player.DecreaseItem(this.activeCrop.name, 1);
            player.PlantCrop(this.activeCrop.name);
            if(!this.combat.isBossBattle && ["goldegg", "coconut", "gmocorn", "ultrarod", "goodfood", "notdrugs", "lotus", "hbee"].indexOf(this.activeCrop.name) >= 0) {
                AddAchievementIfMissing("overkill");
            }
            this.activeCrop = null;
            this.selectedIdx = -1;
            this.cursorPlant.Hide();
            //combat.animHelper.DrawCrops();
            if(cropIsKill) { // crop was damaged
                /*let next = () => game.innerTransition(combat.inbetween, combat.plant); // but can plant more
                if(--combat.numPlantTurns == 0) {
                    if(player.canAttackAfterPlanting()) { // but can still attack
                        next = () => game.innerTransition(combat.inbetween, combat.menu, { sel: 0, notFirst: true });
                    } else { // and that's the end of it
                        next = () => combat.endTurn(combat.inbetween);
                    }
                }
                let killMsg = GetText("tryPlantStart").replace(/\{0\}/g, newCrop.displayname);
                switch(killType) {
                    case 1: killMsg += GetText("tryPlantGloves"); break;
                    case 2: killMsg += GetText("tryPlantPesticide"); break;
                    case 3: killMsg = GetText("tryPlantBees"); worldmap.angryBees = true; player.shiftEthics(-1); break;
                    default: killMsg += GetText("tryPlantBug"); break;
                }
                game.innerTransition(this, combat.inbetween, { next: next, text: killMsg });
                Sounds.PlaySound("navNok");*/
                return true;
            } else { // crop was planted
                if(--this.combat.numPlantTurns === 0) {
                    if(player.CanAttackAfterPlanting() && !this.combat.isFalcon) {
                        console.log("WUGS");
                        //game.innerTransition(this, combat.menu, { sel: 0, notFirst: true });
                    } else {
                        this.combat.EndTurn();
                    }
                    sound.PlaySound(soundText);
                    return true;
                } else {
                    sound.PlaySound(soundText);
                    this.CursorMovePick(this.cursorPick.posX, this.cursorPick.posY);
                }
            }
        }
    }
    /** @param {string} key */
    KeyPress(key) {
        const controls = this.combat.controls;
        let dx = 0, dy = 0, isEnter = false;
        switch(key) {
            case controls["left"]: dx--; break;
            case controls["right"]: dx++; break;
            case controls["up"]: dy--; break;
            case controls["down"]: dy++; break;
            case controls["confirm"]:
            case controls["pause"]: isEnter = true; break;
        }
        if(isEnter) { return this.Select(); }

        if(this.selectedIdx < 0) {
            const posX = this.cursorPick.posX + dx, posY = this.cursorPick.posY + dy;
            if(posX < 0 || posY < 0 || posX >= this.menuWidth) { return false; }
            const newIdx = posY * this.menuWidth + posX;
            if(newIdx >= game2.player.crops.length) { return false; }
            return this.CursorMovePick(posX, posY);
        } else {
            const posX = this.cursorPlant.posX + dx, posY = this.cursorPlant.posY + dy;
            const pgi = this.combat.playerGridInfo;
            if(posX < 0 || posY < 0 || (posX + this.activeCrop.size - 1) >= pgi.width || (posY + this.activeCrop.size - 1) >= pgi.height) { return false; }
            return this.CursorMovePlant(posX, posY);
        }
    }
}
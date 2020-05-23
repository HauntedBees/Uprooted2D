class PauseViewEquipmentScreen extends PauseMenuSubscreen {
    /** @param {PauseMenuScreen} pauseMenu @param {GameInput} controls */
    constructor(pauseMenu, controls) {
        super(pauseMenu, controls);
        this.cursor = new SelCursor(2, 1.5, 0, 0, 1, 1, true);
        this.backButton = new InfoText(GetText("menu.Back"), 64, 4, false, () => this.Select(), () => this.MoveCursor(0, -1));
        this.secondaryCursor = new SelCursor(this.backButton.leftmostX, 4, this.backButton.width, -20, 0, 64, false);
        this.secondaryCursor.container.visible = false;
        
        this.rowData = [[], [], [], []];

        const dx = 2, dy = 1.5;
        const tiles = [];
        for(let x = 0; x <= 11; x++) {
            for(let y = 0; y < 4; y++) {
                tiles.push(gfx2.CreateSmallSprite("toolRack", dx + x, dy + y, true));
            }
        }
        const player = game2.player;
        this.rowData = [[], [], [], []];
        /** @type {SelCursorX[]} */
        this.equippedCursors = [];
        let numItems = 0;
        const equipCursors = [];
        for(let i = 0; i < player.inventory.length; i++) {
            const itemName = player.inventory[i][0];
            if(itemName[0] !== "!") { continue; }
            let y = 0;
            const item = GetEquipment(itemName);
            const details = { actualIndex: i, name: itemName, type: item.type, equipped: player.IsEquipped(itemName) };
            switch(item.type) {
                case "weapon": y = 0; break;
                case "compost": y = 1; break;
                case "gloves": y = 2; break;
                case "soil": y = 3; break;
            }
            const x = this.rowData[y].length
            const itemSprite = gfx2.CreateSmallSprite(itemName, dx + x, dy + y, true);
            MakeSpriteInteractive(itemSprite, () => this.Select(), () => this.MoveCursor(x, y));
            tiles.push(itemSprite);
            if(details.equipped) {
                this.equippedCursors[y] = new SelCursorX(dx + x, dy + y, 0, 0, 1, 0, true);
                equipCursors.push(this.equippedCursors[y].container);
            }
            this.rowData[y].push(details);
            numItems++;
        }
        for(let y = 0; y < this.rowData.length; y++) {
            if(this.equippedCursors[y] === undefined) {
                this.equippedCursors[y] = new SelCursorX(dx, dy + y, 0, 0, 1, 0, true);
                this.equippedCursors[y].container.visible = false;
                equipCursors.push(this.equippedCursors[y].container);
            }
        }
        this.selectedInfo = this.GetSelectedItemInfoObj();

        /** @type {PIXIObj[]} */
        this.equippedItemInfo = [
            this.CreateEquippedInfoSelection(player.equipment.weapon, 16, 672),
            this.CreateEquippedInfoSelection(player.equipment.compost, 272, 672),
            this.CreateEquippedInfoSelection(player.equipment.gloves, 528, 672),
            this.CreateEquippedInfoSelection(player.equipment.soil, 784, 672)
        ];

        this.mainContainer = gfx2.CreateContainer([
            ...tiles,
            gfx2.DrawBox("FarmInfo", -64, -64, gfx2.width + 64, 64, false),
            gfx2.DrawBox("FarmInfo", -64, 368, gfx2.width + 64, 224, false),
            gfx2.DrawBox("FarmInfo", 16, 672, 160, 144, false),
            gfx2.DrawBox("FarmInfo", 272, 672, 160, 144, false),
            gfx2.DrawBox("FarmInfo", 528, 672, 160, 144, false),
            gfx2.DrawBox("FarmInfo", 784, 672, 160, 144, false),
            gfx2.WriteText(GetText("eq.Heading"), "std", gfx2.width - 8, 10, "right"),
            this.backButton.container,
            this.selectedInfo,
            ...this.equippedItemInfo
        ]);
        this.cursorContainer = gfx2.CreateContainer([
            ...equipCursors, 
            this.cursor.container,
            this.secondaryCursor.container
        ]);
        this.containers.push(this.mainContainer);
        this.containers.push(this.cursorContainer);
    }
    /**
     * @param {string} sprite
     * @param {number} x
     * @param {number} y
     * @returns {PIXIObj}
     */
    CreateEquippedInfoSelection(sprite, x, y) {
        const isEmpty = sprite === null;
        const equipment = isEmpty ? null : GetEquipment(sprite);
        const text = isEmpty ? "" : GetEquipmentDesc(equipment, true);
        if(isEmpty) { sprite = "alms"; }
        const container = gfx2.CreateContainer([
            gfx2.CreateSmallSprite(sprite, x + 8, y + 8),
            gfx2.WriteWrappedText(text, "stdSmall", x + 22, y + 72, 180, "left")
        ], false, true);
        if(isEmpty) { container.visible = false; }
        return container;
    }
    /** @param {number} i */
    UpdateEquippedInfoSelection(i) {
        let sprite = "", x = 0;
        switch(i) {
            case 0: x = 16; sprite = game2.player.equipment.weapon; break;
            case 1: x = 272; sprite = game2.player.equipment.compost; break;
            case 2: x = 528; sprite = game2.player.equipment.gloves; break;
            case 3: x = 784; sprite = game2.player.equipment.soil; break;
        }
        if(sprite === "") { return; }
        this.mainContainer.removeChild(this.equippedItemInfo[i]);
        this.equippedItemInfo[i] = this.CreateEquippedInfoSelection(sprite, x, 672);
        this.mainContainer.addChild(this.equippedItemInfo[i]);
    }
    /** @returns {PIXIObj} */
    GetSelectedItemInfoObj() {
        const actIdx = this.rowData[this.cursor.posY][this.cursor.posX].actualIndex;
        const item = game2.player.inventory[actIdx];
        const equipInfo = GetEquipment(item[0]);
        const str = this.GetEquipDescComparedToCurrent(equipInfo);
        const text = gfx2.WriteWrappedMultiFormatText(str, "std", {
            "st": { fontStyle: "italic" },
            "b": {
                fontVariant: "small-caps",
                fontWeight: "bold",
                fontSize: 36
            }
        }, 8, 380, gfx2.width - 16, "left");
        return text;
    }
    /** @param {{ type: string; displayname: any; }} equipInfo */
    GetEquipDescComparedToCurrent(equipInfo) {
        let current = game2.player.equipment[equipInfo.type];
        if(current === null) {
            current = { power: 0, amount: equipInfo.type === "gloves" ? 1 : 0, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0, noEnemies: true };
        } else {
            current = GetEquipment(current);
        }
        let str = `<b>${equipInfo.displayname}</b>`;
        if(equipInfo.type === "weapon") {
            str += this.GetComparison(GetText("eq.power") + " ", equipInfo, current, "power", "number");
            str += this.GetComparison(GetText("eq.hitCrops") + " ", equipInfo, current, "targetCrops", "bool");
            str += this.GetComparison(GetText("eq.hitEnemies") + " ", equipInfo, current, "noEnemies", "!bool");
            str += this.GetComparison(GetText("eq.sp") + " ", equipInfo, current, "sp", "boolnum");
            str += this.GetComparison(GetText("eq.su") + " ", equipInfo, current, "su", "boolnum");
            str += this.GetComparison(GetText("eq.au") + " ", equipInfo, current, "au", "boolnum");
            str += this.GetComparison(GetText("eq.wi") + " ", equipInfo, current, "wi", "boolnum");
            str += this.GetComparison(GetText("eq.sickle2") + " ", equipInfo, current, "tech", "bool");
            str += this.GetComparison("", equipInfo, current, "attacks", "attacks");
        } else if(equipInfo.type === "compost") {
            str += this.GetComparison(GetText("eq.holds") + " ", equipInfo, current, "amount", "number");
            str += this.GetComparison(GetText("eq.compattack") + " ", equipInfo, current, "canAttack", "bool");
            str += this.GetComparison(GetText("eq.rotten") + " ", equipInfo, current, "rotOnly", "bool");
            str += this.GetComparison(GetText("eq.bonus") + " ", equipInfo, current, "bonus", "number", true);
            str += this.GetComparison(GetText("eq.backfire") + " ", equipInfo, current, "tech", "bool");
        } else if(equipInfo.type === "gloves") {
            str += this.GetComparison(GetText("eq.spturn") + " ", equipInfo, current, "amount", "number");
            str += this.GetComparison(GetText("eq.actafter") + " ", equipInfo, current, "canAttack", "bool");
            str += this.GetComparison(GetText("eq.dmgresist") + " ", equipInfo, current, "def", "number", true);
            str += this.GetComparison(GetText("eq.mayshock") + " ", equipInfo, current, "tech", "bool");
        } else if(equipInfo.type === "soil") {
            str += this.GetComparison(GetText("eq.growth") + " ", equipInfo, current, "speed", "number", true);
            str += this.GetComparison(GetText("eq.sres") + " ", equipInfo, current, "boost", "number", true);
            str += this.GetComparison(GetText("eq.sstr") + " ", equipInfo, current, "amplify", "number", true);
            str += this.GetComparison(GetText("eq.willkill") + " ", equipInfo, current, "tech", "bool");
        }
        return str;
    }
    /**
     * @param {string} str
     * @param {{ [x: string]: any; type?: string; displayname?: any; }} newequip
     * @param {{ [x: string]: any; }} oldequip
     * @param {string} column
     * @param {string} compareType
     * @param {boolean} [isPercent]
     */
    GetComparison(str, newequip, oldequip, column, compareType, isPercent) {
        const newVal = newequip[column];
        const oldVal = oldequip[column];
        if(compareType === "number") {
            if(newVal === oldVal) { 
                if(newVal === 0) { return ""; }
                return `\n ${str} ${isPercent ? ((newVal * 100) + "%") : newVal}`;
            }
            return `\n ${str} <st>${isPercent ? ((oldVal * 100) + "%") : oldVal}</st> → ${isPercent ? ((newVal * 100) + "%") : newVal}`;
        } else if(compareType === "bool") {
            if(newVal === oldVal) {
                if(newVal === true) { 
                    return `\n ${str}`;
                } else {
                    return "";
                }
            } else {
                if(newVal === true) {
                    return `\n +${str}`;
                } else {
                    return `\n <st>-${str}</st>`;
                }
            }
        } else if(compareType === "!bool") {
            if(newVal === oldVal) {
                if(!newVal === true) {
                    return `\n ${str}`;
                } else {
                    return "";
                }
            } else {
                if(!newVal === true) {
                    return `\n +${str}`;
                } else {
                    return `\n <st>-${str}</st>`;
                }
            }
        } else if(compareType === "boolnum") {
            if(newVal === oldVal) {
                if(newVal > 0) { 
                    return `\n ${str}`;
                } else {
                    return "";
                }
            } else {
                if(newVal > 0) {
                    return `\n +${str}`;
                } else {
                    return `\n <st>-${str}</st>`;
                }
            }
        } else if(compareType === "attacks") {
            if(newVal === oldVal) {
                if(newVal === 999) {
                    return `\n ${GetText("eq.attackall")}`;
                } else if(newVal > 0) {
                    return `\n ${GetText("eq.attacksome").replace(/\{0\}/g, newVal)}`;
                } else {
                    return "";
                }
            } else {
                if(newVal === undefined || newVal === 0) { // from some value to one
                    let newstr = "";
                    if(oldVal === 999) {
                        newstr = GetText("eq.attackall");
                    } else if(oldVal > 0) {
                        newstr = GetText("eq.attacksome").replace(/\{0\}/g, oldVal);
                    }
                    return `\n <st>-${newstr}</st>`;
                } else if(newVal === 999) { // from some value to ALL
                    if(oldVal > 0) {
                        const newstr = GetText("eq.attacksome").replace(/\{0\}/g, oldVal);
                        return `\n -<st>${newstr}</st>\n → ${GetText("eq.attackall")}`;
                    } else {
                        return `\n +${GetText("eq.attackall")}`;
                    }
                } else { // from some value to some other value
                    if(oldVal === 999) {
                        const newstr = GetText("eq.attackall");
                        return `\n <st>-${newstr}</st>\n →${GetText("eq.attacksome").replace(/\{0\}/g, newVal)}`;
                    } else if(oldVal > 0) {
                        const newstr = GetText("eq.attacksome").replace(/\{0\}/g, oldVal);
                        return `\n <st>-${newstr}</st>\n →${GetText("eq.attacksome").replace(/\{0\}/g, newVal)}`;
                    } else {
                        return `\n +${GetText("eq.attacksome").replace(/\{0\}/g, newVal)}`;
                    }
                }
            }
        }
    }
    /** @param {number} x @param {number} y */
    MoveCursor(x, y) {
        sound.PlaySound("menuMove");
        if(y === -1) {
            this.cursor.container.visible = false;
            this.cursor.MoveTo(0, 0);
            this.secondaryCursor.container.visible = true;
            this.backButton.Select();
        } else {
            this.cursor.container.visible = true;
            this.secondaryCursor.container.visible = false;
            this.backButton.Unselect();
            this.cursor.MoveTo(x, y);
            this.mainContainer.removeChild(this.selectedInfo);
            this.selectedInfo = this.GetSelectedItemInfoObj();
            this.mainContainer.addChild(this.selectedInfo);
        }
    }
    Select() {
        if(this.backButton.selected) { return this.ReturnToMainPauseMenu(); }
        const player = game2.player;
        const item = player.inventory[this.rowData[this.cursor.posY][this.cursor.posX].actualIndex];
        const equipInfo = GetEquipment(item[0]);
        if(player.equipment[equipInfo.type] === item[0]) {
            sound.PlaySound("cancel");
            player.equipment[equipInfo.type] = null;
            this.equippedCursors[this.cursor.posY].container.visible = false;
        } else {
            sound.PlaySound("confirm");
            player.equipment[equipInfo.type] = item[0];
            this.equippedCursors[this.cursor.posY].container.visible = true;
            this.equippedCursors[this.cursor.posY].MoveTo(this.cursor.posX, 0);
        }
        this.UpdateEquippedInfoSelection(this.cursor.posY);
        this.mainContainer.removeChild(this.selectedInfo);
        this.selectedInfo = this.GetSelectedItemInfoObj();
        this.mainContainer.addChild(this.selectedInfo);
        return true;
    }
    Cancel() {
        if(this.backButton.selected) { return; }
        sound.PlaySound("navNok");
        this.MoveCursor(0, -1);
    }
    /** @param {string} key */
    KeyPress(key) {
        let moves = { x: 0, y: 0 }, isEnter = false, doMove = true;
        switch(key) {
            case this.controls["up"]: moves.y--; break;
            case this.controls["down"]: moves.y++; break;
            case this.controls["left"]: moves.x--; break;
            case this.controls["right"]: moves.x++; break;
            case this.controls["confirm"]: isEnter = true; break;
            case this.controls["cancel"]: return this.Cancel();
        }
        let pos = { x: moves.x + this.cursor.posX, y: moves.y + this.cursor.posY };

        if(pos.x < 0 || pos.y < -1 || pos.y >= this.rowData.length || (pos.y === -1 && moves.x !== 0)) { sound.PlaySound("navNok"); return false; }
        if(pos.y >= 0 && pos.x >= this.rowData[pos.y].length) { sound.PlaySound("navNok"); return false; }
        if(this.backButton.selected && moves.y > 0) { pos.y = 0; }

        if(isEnter) { this.Select(); }
        else if(doMove) { this.MoveCursor(pos.x, pos.y); }
    }
}
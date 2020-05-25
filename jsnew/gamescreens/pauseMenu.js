class PauseMenuScreen extends GameScreen {
    constructor() {
        super();
        this.inNoFun = false;
        this.lastPressWasQuit = false;

        this.questItems = game2.player.GetQuestItems();

        /** @type {PauseMenuSubscreen} */
        this.subscreen = null;

        this.menuOptions = [
            new InfoText(GetText("menu.Items"), 0, 16, true, () => this.Select(), () => this.CursorMove(0, 0), { noLeftSide: true, minX: 1 }),
            new InfoText(GetText("menu.Equipment"), 0, 80, false, () => this.Select(), () => this.CursorMove(0, 1), { noLeftSide: true, minX: 1 }),
            new InfoText(GetText("menu.Farm"), 0, 144, false, () => this.Select(), () => this.CursorMove(0, 2), { noLeftSide: true, minX: 1 }),
            new InfoText(GetText("menu.Options"), 0, 208, false, () => this.Select(), () => this.CursorMove(0, 3), { noLeftSide: true, minX: 1 }),
            new InfoText(GetText("menu.Achievements"), 0, 272, false, () => this.Select(), () => this.CursorMove(0, 4), { noLeftSide: true, minX: 1 }),
            new InfoText(GetText("menu.Save"), 0, 336, false, () => this.Select(), () => this.CursorMove(0, 5), { noLeftSide: true, minX: 1 }),
            new InfoText(GetText("menu.Back"), 0, 400, false, () => this.Select(), () => this.CursorMove(0, 6), { noLeftSide: true, minX: 1 }),
            new InfoText(GetText("menu.Quit"), 0, 464, false, () => this.Select(), () => this.CursorMove(0, 7), { noLeftSide: true, minX: 1 }),
            new InfoText(GetText("noFunPreview"), gfx2.width, 16, false, () => this.Select(), () => this.CursorMove(1, 0), { noRightSide: true, minX: 1.5 })
        ];
        this.cursor = new SelCursor(0, 16, this.menuOptions[0].width, -20, 0, 64, false);
        const player = game2.player;
        const pInfoY1 = 640, pInfoY2 = 688;
        this.playerInfo = [
            gfx2.DrawBox("FarmInfo", -64, 620, gfx2.width + 64, 300, false),
            gfx2.WriteText(this.GetFormattedText("menu.level", player.level, "", 0), "std", 64, pInfoY1),
            gfx2.WriteText(this.GetFormattedText("menu.HP", player.health + "/" + player.maxhealth, ": ", 0), "std", 224, pInfoY1),
            gfx2.WriteText(this.GetFormattedText("menu.ATK", player.atk, ": ", 2), "std", 544, pInfoY1),
            gfx2.WriteText(this.GetFormattedText("menu.DEF", player.def, ": ", 2), "std", 736, pInfoY1),
            gfx2.WriteText(this.GetFormattedText("menu.coins", player.monies, ": ", 4), "std", 64, pInfoY2),
            gfx2.WriteText(this.GetFormattedText("menu.nextLevel", (player.level === 50 ? "-/-" : (player.exp + "/" + player.nextExp)), ": ", 0), "std", 432, pInfoY2),
            gfx2.CreateBigSprite("alignment", 128, 752),
            this.cursor.container
        ];
        
        const centerx = 192 + Math.round(62 * player.ethicsAxis);
        const centery = 816 + Math.round(62 * player.techAxis);
        this.playerInfo.push(gfx2.CreateSmallSprite("alignmentcursor", centerx, centery, false, true));

        // TODO: farm
        // TODO: quest items

        this.gfxContainers = {
            "bg": gfx2.CreateTiledSpriteContainer("invTile"),
            "bg2": gfx2.CreateContainer([]),
            "menu": gfx2.CreateContainer([...this.menuOptions.map(m => m.container), ...this.playerInfo])
        }
        this.DrawBGJunk();
    }
    DrawBGJunk() {
        const bgJunk = [];
        for(let x = 0; x < gfx2.tileW; x++) {
            bgJunk.push(gfx2.CreateSmallSprite("grassTop", x, 4, true));
            for(let y = 5; y < 10; y++) {
                bgJunk.push(gfx2.CreateSmallSprite("grass" + MathB.Range(0, 3), x, y, true));
            }
        }
        bgJunk.push(gfx2.CreateBigSprite("ayanaSit", 3, 6, true));
        bgJunk.push(game2.player.gridInfo.GetFarmDisplayContainer(8, 6, 0.75));
        gfx2.EmptyContainer(this.gfxContainers["bg2"]);
        bgJunk.forEach(s => this.gfxContainers["bg2"].addChild(s));
    }
    /** @param {number} x @param {number} y */
    CursorMove(x, y) {
        sound.PlaySound("menuMove");
        if(x === 1) { // no fun, alignment info, quest items

        } else { // menu options
            if(this.cursor.posX === 0) {
                this.menuOptions[this.cursor.posY].Unselect();
            } else { // deselect no fun menu maybe

            }
            const option = this.menuOptions[y];
            this.cursor.Resize(option.width, -20, false).MoveTo(0, y);
            option.Select();
        }
    }
    Select() {
        if(this.subscreen !== null) { return this.subscreen.Select(); }
        if(this.cursor.posX === 0) { // menu options
            switch(this.cursor.posY) {
                case 0:
                    this.Hide();
                    this.subscreen = new PauseViewInventoryScreen(this, this.controls);
                    break;
                case 1:
                    this.Hide();
                    this.subscreen = new PauseViewEquipmentScreen(this, this.controls);
                    break;
                case 2:
                    this.Hide();
                    this.subscreen = new PauseViewFixturesScreen(this, this.controls);
                    break;
                case 6: return this.ReturnToGame();
            }
        } else { // no fun, alignment info, quest items

        }
    }
    ReturnToGame() {
        sound.PlaySound("pauseO");
        game2.Transition(WorldScreen, { returning: true });
        return true;
    }
    Hide() {
        this.gfxContainers["menu"].visible = false;
    }
    Show() {
        this.DrawBGJunk();
        this.gfxContainers["menu"].visible = true;
    }
    /** @param {any} key */
    KeyPress(key) {
        if(this.subscreen !== null) { return this.subscreen.KeyPress(key); }
        let pos = { x: this.cursor.posX, y: this.cursor.posY }, isEnter = false;
        switch(key) {
            case this.controls["up"]: pos.y--; break;
            case this.controls["down"]: pos.y++; break;
            case this.controls["left"]: pos.x--; break;
            case this.controls["right"]: pos.x++; break;
            case this.controls["confirm"]: isEnter = true; break;
            case this.controls["cancel"]: 
            case this.controls["pause"]: return this.ReturnToGame();
        }
        if(pos.y < 0 || pos.x < 0) { return sound.PlaySound("navNok"); }
        if(pos.x === 0 && pos.y >= (this.menuOptions.length - 1)) { return sound.PlaySound("navNok"); }
        // TODO: checks for alignment, fun menu, quest items
        if(isEnter) { return this.Select(); }
        else { return this.CursorMove(pos.x, pos.y); }
    }
    /**
     * @param {string} textKey
     * @param {string | number} value
     * @param {string} middle
     * @param {number} spaceNum
     * @returns {string}
     */
    GetFormattedText(textKey, value, middle, spaceNum) {
        let str = GetText(textKey);
        if(middle !== "") { str += middle; }
        if(spaceNum > 0) {
            const len = ("" + value).length;
            let dx = spaceNum - len;
            while(dx-- > 0) { str += " "; }  
        }
        str += value;
        return str;
    }
}

class PauseMenuSubscreen {
    /** @param {PauseMenuScreen} pauseMenu @param {GameInput} controls */
    constructor(pauseMenu, controls) {
        this.pauseMenu = pauseMenu;
        /** @type {PIXIObj[]} */
        this.containers = [ gfx2.CreateTiledSpriteContainer("invTile") ];
        this.controls = controls;
        this.animIter = 0;
        sound.PlaySound("confirm");
    }
    KeyPress(key) { }
    Select() { }
    ReturnToMainPauseMenu() {
        sound.PlaySound("cancel");
        clearInterval(this.animIter);
        this.pauseMenu.subscreen = null;
        this.pauseMenu.Show();
        this.containers.forEach(c => gfx2.RemoveContainer(c));
    }
}
class PauseViewFixturesScreen extends PauseMenuSubscreen {
    /** @param {PauseMenuScreen} pauseMenu @param {GameInput} controls */
    constructor(pauseMenu, controls) {
        super(pauseMenu, controls);

        this.selectedItemName = null;
        this.selectedItemIdx = -1;
        this.selectedItemSize = 0;

        this.backButton = new InfoText(GetText("menu.Back"), 64, 4, false, () => this.Select(), () => this.MoveSelectionCursor(0, -1));
        this.backCursor = new SelCursor(this.backButton.leftmostX, 4, this.backButton.width, -20, 0, 64, false);
        this.backCursor.Hide();
        
        /** @type {PIXIObj[]} */
        this.fixtureSprites = [];
        this.fixtureContainer = gfx2.CreateContainer([], false, true);
        this.RefreshInventoryDisplay();
        
        const gridInfo = game2.player.gridInfo;
        this.gridDX = ((16 - gridInfo.gridWidth) / 2);
        this.gridDY = 7 + Math.floor((6 - gridInfo.gridHeight) / 2);
        this.grid = gridInfo.grid;
        this.farmContainer = gridInfo.GetFarmDisplayContainer(this.gridDX, this.gridDY, this.Select, this.MovePlacementCursor, this);
        
        this.selectionCursor = new SelCursor(0.5, 1.5, 0, 0, 1, 1, true);
        this.selectedCursor = new SelCursorX(0.5, 1.5, 0, 0, 1, 1, true);
        this.selectedCursor.Hide();
        this.placementCursor = new SelCursor(this.gridDX, this.gridDY, 0, 0, 1, 1, true);
        this.placementCursor.Hide();

        this.fullContainer = gfx2.CreateContainer([
            gfx2.DrawBox("FarmInfo", -64, -64, gfx2.width + 64, 64, false),
            gfx2.WriteText(GetText("fx.Heading"), "std", gfx2.width - 8, 10, "right"),
            gfx2.DrawBox("FarmInfo", 320, 96, 608, 224, false),
            this.farmContainer,
            this.fixtureContainer
        ]);
        this.cursorContainer = gfx2.CreateContainer([
            this.backButton.container,
            this.selectedCursor.container,
            this.selectionCursor.container,
            this.placementCursor.container,
            this.backCursor.container
        ]);
        this.infoText = null;
        this.SetSelectionText();
        this.containers.push(this.fullContainer, this.cursorContainer);
    }
    RefreshInventoryDisplay() {
        gfx2.EmptyContainer(this.fixtureContainer);
        const cropSprites = this.DrawFixtureInventory();
        this.fixtureContainer.addChild(gfx2.CreateContainer(cropSprites, false, true));
    }
    DrawFixtureInventory() {
        const player = game2.player;
        let j = 0;
        this.inventoryWidth = 4;
        const dx = 0.5, dy = 1.5;
        const elements = [];
        /** @type {PIXIObj[]} */
        this.fixtureSprites = [];
        for(let i = 0; i < player.fixtures.length; i++) {
            const thisX = i % this.inventoryWidth + dx;
            const thisY = Math.floor(i / this.inventoryWidth) + dy;
            elements.push(gfx2.CreateSmallSprite("invBox", thisX, thisY, true));
            const itemSprite = gfx2.CreateInventoryItem(player.fixtures[i], thisX, thisY, true);
            MakeSpriteInteractive(itemSprite, () => this.Select(), () => this.MoveSelectionCursor(thisX - dx, thisY - dy));
            this.fixtureSprites.push(itemSprite.children[0]);
            elements.push(itemSprite);
            j++;
        }
        for(let i = j; i < 12; i++) {
            const thisX = i % this.inventoryWidth + dx;
            const thisY = Math.floor(i / this.inventoryWidth) + dy;
            elements.push(gfx2.CreateSmallSprite("invBox", thisX, thisY, true));
        }
        return elements;
    }
    /** @param {number} x @param {number} y */
    MoveSelectionCursor(x, y) {
        this.placementCursor.Hide();
        sound.PlaySound("menuMove");
        if(y === -1) {
            this.selectionCursor.Hide();
            this.selectionCursor.Hide();
            this.backCursor.Show();
            this.backButton.Select();
        } else {
            this.selectionCursor.Show();
            this.backCursor.Hide();
            this.placementCursor.Hide();
            this.backButton.Unselect();
            this.selectionCursor.MoveTo(x, y);
            this.SetSelectionText();
        }
    }
    /** @param {number} x @param {number} y @param {this} [source] */
    MovePlacementCursor(x, y, source) {
        sound.PlaySound("menuMove");
        const me = source || this;
        if(me.selectedItemSize === 1 && !me.CanPlant(x, y)) { return; }
        me.placementCursor.Show();
        me.selectionCursor.Hide();
        me.backCursor.Hide();
        me.backButton.Unselect();
        me.placementCursor.MoveTo(x, y);
        me.SetPlacementText();
    }
    /** @param {this} [source] */
    Select(source) {
        const me = source || this;
        if(me.backButton.selected) {
            me.ReturnToMainPauseMenu();
        } else if(me.placementCursor.IsVisible()) { // item placement
            if(!me.CanPlant()) { sound.PlaySound("navNok"); return false; }
            const posX = me.placementCursor.posX, posY = me.placementCursor.posY;
            const player = game2.player;
            const selItem = player.gridInfo.grid[posX][posY];
            const isSameItem = me.selectedItemName === selItem;
            if(!isSameItem && me.selectedItemSize > 0 && me.selectedItemName !== null) { // adding new big thing
                for(let x = 0; x <= me.selectedItemSize; x++) {
                    for(let y = 0; y <= me.selectedItemSize; y++) {
                        const item = me.RemoveFromField(posX + x, posY + y);
                        if(item !== null) { player.IncreaseItem(item, 1); }
                        player.gridInfo.grid[posX + x][posY + y] = { coord: true, x: posX, y: posY };
                    }
                }
                player.gridInfo.grid[posX][posY] = me.selectedItemName;
                player.gridInfo.grid[posX + me.selectedItemSize][posY + me.selectedItemSize].corner = me.selectedItemName;
                sound.PlaySound("confirm");
            } else {
                const item = me.RemoveFromField(posX, posY);
                if(item !== null) { player.IncreaseItem(item, 1); }
                if(me.selectedItemName === null || isSameItem) {
                    if(selItem !== null) { sound.PlaySound("cancel"); }
                    me.RedrawEverything();
                    return true;
                }
                sound.PlaySound("confirm");
                player.gridInfo.grid[posX][posY] = me.selectedItemName;
            }
            const stillHasAny = player.DecreaseItem(me.selectedItemName, 1);
            console.log(stillHasAny);
            if(!stillHasAny) {
                me.selectedItemName = null;
                me.selectedItemIdx = -1;
                me.selectedItemSize = 0;
            }
            me.RedrawEverything();
        } else { // item selection
            const idx = me.selectionCursor.posY * me.inventoryWidth + me.selectionCursor.posX;
            if(me.selectedItemIdx === idx) {
                sound.PlaySound("cancel");
                me.selectedItemName = null;
                me.selectedItemIdx = -1;
                me.selectedItemSize = 0;
                me.selectedCursor.Hide();
            } else {
                const item = game2.player.fixtures[idx][0];
                sound.PlaySound("confirm");
                me.selectedItemName = item;
                me.selectedItemIdx = idx;
                me.selectedItemSize = (GetFarmInfo(item).size - 1) || 0;
                me.selectedCursor.MoveTo(me.selectionCursor.posX, me.selectionCursor.posY);
                me.selectedCursor.Show();
                me.MovePlacementCursor(0, 0);
            }
            me.placementCursor.Resize(me.selectedItemSize, me.selectedItemSize, true).Redraw();
        }
    }
    RedrawEverything() {
        this.fullContainer.removeChild(this.farmContainer);
        this.farmContainer = game2.player.gridInfo.GetFarmDisplayContainer(this.gridDX, this.gridDY, this.Select, this.MovePlacementCursor, this);
        this.fullContainer.addChild(this.farmContainer);
        this.RefreshInventoryDisplay();
    }
    SetSelectionText() {
        if(this.infoText !== null) { this.fullContainer.removeChild(this.infoText); }
        const idx = this.selectionCursor.posY * this.inventoryWidth + this.selectionCursor.posX;
        let text = "";
        if(idx >= game2.player.fixtures.length) {
            text = GetText("farmModNothing");
        } else {
            const item = GetFarmInfo(game2.player.fixtures[idx][0]);
            text = `<h>${item.displayname}</h>\n${item.desc}`;
        }
        this.infoText = gfx2.WriteWrappedMultiFormatText(text, "std", {
            "h": gfx2.TextStyles["stdHeader"]
        }, 350, 115, 640, "left");
        this.fullContainer.addChild(this.infoText);
    }
    SetPlacementText() {
        if(this.infoText !== null) { this.fullContainer.removeChild(this.infoText); }
        const player = game2.player, gridInfo = player.gridInfo;
        const posX = this.placementCursor.posX, posY = this.placementCursor.posY;
        let speed = 100;
        let text = "";
        if(gridInfo.grid[posX][posY] === null) {
            text = GetText("farmModDirt");
            speed = Math.round(player.GetCropSpeedMultiplier() * (1 / gridInfo.GetSprinklerMultiplier(posX, posY, 1)) * 100);
        } else {
            let item = gridInfo.grid[posX][posY];
            if(item.coord) { item = gridInfo.grid[item.x][item.y]; }
            const itemData = GetFarmInfo(item);
            text = `<h>${itemData.displayname}</h>\n${itemData.shortdesc}`;
            if(itemData.name !== "_hotspot") {
                speed = Math.round(player.GetCropSpeedMultiplier() * (1 / gridInfo.GetSprinklerMultiplier(posX, posY, itemData.size)) * 100);
            } else {
                speed = Math.round(player.GetCropSpeedMultiplier() * 100);
            }
        }
        text = text.replace(/\{0\}/g, speed.toString());
        this.infoText = gfx2.WriteWrappedMultiFormatText(text, "std", {
            "h": gfx2.TextStyles["stdHeader"]
        }, 350, 115, 640, "left");
        this.fullContainer.addChild(this.infoText);
    }
    /** @param {number} [x] @param {number} [y] */
    CanPlant(x, y) {
        x = x || this.placementCursor.posX;
        y = y || this.placementCursor.posY;
        if(this.selectedItemName === "_paddy") {
            return y === (game2.player.gridInfo.gridHeight - 1);
        } else if(this.selectedItemSize === 1) {
            return y <= (game2.player.gridInfo.gridHeight - 2) && x <= (game2.player.gridInfo.gridWidth - 2);
        } else {
            return true;
        }
    }
    /** @param {number} x @param {number} y */
    RemoveFromField(x, y) {
        const player = game2.player;
        let item = player.gridInfo.grid[x][y];
        if(item === null) { return null; }
        if(item.coord) {
            x = item.x; y = item.y;
            item = player.gridInfo.grid[item.x][item.y];
        }
        const size = (GetFarmInfo(item).size) || 1;
        for(let xi = 0; xi < size; xi++) {
            for(let yi = 0; yi < size; yi++) {
                player.gridInfo.grid[x + xi][y + yi] = null;
            }
        }
        return item;
    }
    Cancel() {
        if(this.backButton.selected) { return; }
        sound.PlaySound("navNok");
        if(this.placementCursor.IsVisible()) {
            const position = this.selectedItemIdx >= 0 ? this.selectedItemIdx : game2.player.fixtures.length - 1;
            const y = Math.floor(position / this.inventoryWidth);
            const x = position % this.inventoryWidth;
            this.MoveSelectionCursor(x, y);
        } else {
            this.MoveSelectionCursor(0, -1);
        }
    }
    /** @param {string} key */
    KeyPress(key) {
        const moves = { x: 0, y: 0 };
        switch(key) {
            case this.controls["up"]: moves.y--; break;
            case this.controls["down"]: moves.y++; break;
            case this.controls["left"]: moves.x--; break;
            case this.controls["right"]: moves.x++; break;
            case this.controls["confirm"]: return this.Select();
            case this.controls["cancel"]: return this.Cancel();
        }
        if(this.backButton.selected) {
            if(moves.x !== 0 || moves.y < 0) {
                sound.PlaySound("navNok");
                return false;
            } else {
                return this.MoveSelectionCursor(0, 0);
            }
        } else if(this.placementCursor.IsVisible()) {
            const pos = { x: moves.x + this.placementCursor.posX, y: moves.y + this.placementCursor.posY };
            const gridInfo = game2.player.gridInfo;
            if(pos.x < 0 || pos.x >= gridInfo.gridWidth || pos.y >= gridInfo.gridHeight) {
                sound.PlaySound("navNok");
                return false;
            } else if(pos.y < 0) {
                const len = game2.player.fixtures.length - 1;
                const y = Math.floor(len / this.inventoryWidth);
                const x = len % this.inventoryWidth;
                return this.MoveSelectionCursor(x, y);
            } else {
                return this.MovePlacementCursor(pos.x, pos.y);
            }
        } else {
            const pos = { x: moves.x + this.selectionCursor.posX, y: moves.y + this.selectionCursor.posY }
            if(pos.x < 0 || pos.x >= this.inventoryWidth) {
                sound.PlaySound("navNok");
                return false;
            }
            if(pos.y < 0) { return this.MoveSelectionCursor(0, -1); }
            const idx = pos.y * this.inventoryWidth + pos.x;
            if(idx >= game2.player.fixtures.length) {
                if(moves.y > 0 && moves.x === 0) {
                    return this.MovePlacementCursor(0, 0);
                } else {
                    sound.PlaySound("navNok");
                    return false;
                }
            } else {
                return this.MoveSelectionCursor(pos.x, pos.y);
            }
        }
    }
}
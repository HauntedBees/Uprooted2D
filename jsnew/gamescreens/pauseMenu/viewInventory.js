class PauseViewInventoryScreen extends PauseMenuSubscreen {
    /** @param {PauseMenuScreen} pauseMenu @param {GameInput} controls */
    constructor(pauseMenu, controls) {
        super(pauseMenu, controls);
        this.selectedCropIdx = -1;
        this.inSort = false;
        this.sortY = -1;
        this.lastSortedIdx = -1;
        this.cursor = new SelCursor(0.5, 1.5, 0, 0, 1, 1, true);
        this.secondaryCursor = new SelCursor(0, 16, 1, -20, 0, 64, false);
        this.secondaryCursor.Hide();
        const elements = [
            gfx2.DrawBox("FarmInfo", -64, -64, gfx2.width + 64, 64, false)
        ];

        /** @type {PIXIObj[]} */
        this.cropSprites = [];
        this.cropContainer = gfx2.CreateContainer([], false, true);
        this.RefreshInventoryDisplay();
        elements.push(this.cropContainer);

        this.backButton = new InfoText(GetText("menu.Back"), 64, 4, false, () => this.Select(), () => this.MoveCursor(0, -1));
        this.sortButton = new InfoText(GetText("inv.Sort"), 192, 4, false, () => this.Select(), () => this.MoveCursor(1, -1));
        this.sortElems = [
            new InfoText(GetText("inv.sCount"), 192, 46, false, () => this.Select(), () => this.MoveCursor(0, 0), { minX: 2, forceCenter: true }),
            new InfoText(GetText("inv.sPower"), 192, 87, false, () => this.Select(), () => this.MoveCursor(0, 1), { minX: 2, forceCenter: true }),
            new InfoText(GetText("inv.sTime"), 192, 128, false, () => this.Select(), () => this.MoveCursor(0, 2), { minX: 2, forceCenter: true }),
            new InfoText(GetText("inv.sType"), 192, 169, false, () => this.Select(), () => this.MoveCursor(0, 3), { minX: 2, forceCenter: true })
        ];
        this.sortElemContainer = gfx2.CreateContainer(this.sortElems.map(s => s.container), false, true);
        this.sortElemContainer.visible = false;
        elements.push(this.backButton.container, this.sortButton.container, this.sortElemContainer);
        // TODO: the border

        this.trashCan = gfx2.CreateSmallAnimSprite(["animBin0", "animBin1", "animBin2", "animBin3", "animBin4", "animBin5", "animBin0"], 224, 0, false, false, false, 0.4);
        this.trashCan.visible = false;
        this.trashCan.onComplete = () => this.FinishTrashCanAnimation();
        this.coin = gfx2.CreateSmallAnimSprite(["animCoin0", "animCoin1", "animCoin2", "animCoin3"], 0, 0, false, true, false, 0.75);
        this.coin.visible = false;

        MakeSpriteInteractive(this.trashCan, () => this.Select(), () => this.MoveCursor(this.inventoryWidth, this.cursor.posY));

        this.selectionContainer = null;
        this.selectionCursor = new SelCursorX(0, 0, 0, 0, 1, 1, false);
        this.selectionCursor.Hide();

        this.cropPowerDisplay = gfx2.DrawCropInfo(GetCrop(game2.player.crops[0][0]), "std", false, 285, 100, 640, 720, true);
        elements.push(...[
            gfx2.WriteText(GetText("inv.Heading"), "std", gfx2.width - 8, 10, "right"),
            this.selectionCursor.container,
            this.cursor.container,
            this.secondaryCursor.container,
            this.coin,
            this.trashCan
        ]);

        this.containers.push(gfx2.CreateContainer([gfx2.DrawBox("FarmInfo", 4, 1.25, 10.75, 11.5, true), this.cropPowerDisplay]));
        this.containers.push(gfx2.CreateContainer(elements));
    }
    /** @param {number} x @param {number} y */
    MoveCursor(x, y) {
        if(this.selectedCropIdx >= 0 && y < 0) { return; }
        if(this.selectionContainer !== null) {
            this.selectionContainer.CleanUp();
            this.selectionContainer = null;
        }
        sound.PlaySound("menuMove");
        if(this.inSort) {
            this.sortElems.forEach(e => e.Unselect());
            if(y >= 0) {
                const selected = this.sortElems[y];
                selected.Select();
                this.secondaryCursor.SetInitialPos(selected.leftmostX, selected.y).Resize(selected.width, -20, false).Redraw();
            } else {
                this.secondaryCursor.SetInitialPos(this.sortButton.leftmostX, 4).Resize(this.sortButton.width, -20, false).Redraw();
            }
        } else if(y < 0) {
            this.secondaryCursor.Show();
            this.cursor.Hide();
            if(x === 0) { // back button
                this.secondaryCursor.SetInitialPos(this.backButton.leftmostX, 4).Resize(this.backButton.width, -20, false).Redraw();
                this.backButton.Select();
                this.sortButton.Unselect();
            } else if(x === 1) { // sort button
                this.secondaryCursor.SetInitialPos(this.sortButton.leftmostX, 4).Resize(this.sortButton.width, -20, false).Redraw();
                this.backButton.Unselect();
                this.sortButton.Select();
            }
        } else {
            this.backButton.Unselect();
            this.sortButton.Unselect();
            this.secondaryCursor.Hide();
            this.cursor.Show();
            this.cursor.MoveTo(x, y);
            if(this.selectedCropIdx >= 0) {
                this.DrawSelectionInfo(x, y);
            } else {
                this.containers[1].removeChild(this.cropPowerDisplay);
                const selectedCropIdx = y * this.inventoryWidth + x;
                const selectedCrop = game2.player.crops[selectedCropIdx];
                this.cropPowerDisplay = gfx2.DrawCropInfo(GetCrop(selectedCrop[0]), "std", false, 285, 100, 640, 720, true);
                this.containers[1].addChild(this.cropPowerDisplay);
            }
        }
    }
    /** @param {number} x @param {number} y */
    DrawSelectionInfo(x, y) {
        const idx = this.cursor.posY * this.inventoryWidth + (x === this.inventoryWidth ? 0 : this.cursor.posX);
        const cropSpriteY = this.cropSprites[idx].y;
        const selX = 288, selY = cropSpriteY + 16;
        this.trashCan.y = cropSpriteY;
        if(x === this.inventoryWidth) { // recycle
            const inventoryInfo = game2.player.crops[this.selectedCropIdx];
            const price = Math.ceil(GetCrop(inventoryInfo[0]).price * inventoryInfo[1] * 0.25);
            this.selectionContainer = new InfoText(GetText("inv.drop").replace(/\{0\}/g, price), selX, selY, true, () => {}, () => {}, { leftAlign: true, padText: true });
        } else {
            const hoveredCropIdx = y * this.inventoryWidth + x;
            if(this.selectedCropIdx === hoveredCropIdx) { // unselect
                this.selectionContainer = new InfoText(GetText("inv.unselect"), selX, selY, true, () => {}, () => {}, { leftAlign: true, padText: true });
            } else { // swap
                this.selectionContainer = new InfoText(GetText("inv.swap"), selX, selY, true, () => {}, () => {}, { leftAlign: true, padText: true });
            }
        }
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

        if(this.selectedCropIdx >= 0) {
            if(pos.x === this.inventoryWidth) {
                if(this.cursor.posX === this.inventoryWidth) {
                    if(moves.y !== 0 || moves.x > 0) { sound.PlaySound("navNok"); return false;}
                }
            } else {
                if(this.cursor.posX === this.inventoryWidth) {
                    if(moves.y !== 0 || moves.x > 0) { sound.PlaySound("navNok"); return false; }
                    const newpos = pos.y * this.inventoryWidth + pos.x;
                    if(newpos >= game2.player.crops.length) { pos.x = 0; }
                } else {
                    if(pos.x < 0 || pos.y < 0) { sound.PlaySound("navNok"); return false; }
                    if(pos.x >= 3) { sound.PlaySound("navNok"); return false; }
                    const newpos = pos.y * this.inventoryWidth + pos.x;
                    if(newpos >= game2.player.crops.length) { pos.x = this.inventoryWidth; pos.y = this.cursor.posY }
                }
            }
        } else if(this.inSort) {
            const newY = this.sortY + moves.y;
            if(newY < -1 || newY > 3) { sound.PlaySound("navNok"); return false; }
            this.sortY = newY;
            pos.y = newY;
        } else if(this.secondaryCursor.IsVisible()) {
            if(moves.y > 0) {
                pos.x = 0;
                pos.y = 0;
            } else {
                pos.y = -1;
                if(moves.x === 1 && this.backButton.selected) {
                    pos.x = 1;
                } else if(moves.x === -1 && this.sortButton.selected) {
                    pos.x = 0;
                } else {
                    if(!isEnter) { sound.PlaySound("navNok"); }
                    doMove = false;
                }
            }
        } else if(pos.y === -1) { // moving from item selection up
            pos.x = 0;
        } else {
            if(pos.x < 0 || pos.y < 0) { sound.PlaySound("navNok"); return false; }
            if(pos.x >= 3) { sound.PlaySound("navNok"); return false; }
            const newpos = pos.y * this.inventoryWidth + pos.x;
            if(newpos >= game2.player.crops.length) { sound.PlaySound("navNok"); return false; }
        }
        if(isEnter) { this.Select(); }
        else if(doMove) { this.MoveCursor(pos.x, pos.y); }
    }
    Select() {
        if(this.backButton.selected) {
            this.ReturnToMainPauseMenu();
        } else if(this.sortButton.selected) {
            if(this.inSort) {
                if(this.sortElems[0].selected) { // by amount
                    this.SortCrops(0,
                        (a, b) => a[1] - b[1],
                        (a, b) => b[1] - a[1]
                    );
                } else if(this.sortElems[1].selected) { // by power
                    this.SortCrops(1,
                        (a, b) => GetCrop(a[0]).power - GetCrop(b[0]).power,
                        (a, b) => GetCrop(b[0]).power - GetCrop(a[0]).power
                    );
                } else if(this.sortElems[2].selected) { // by growth time
                    this.SortCrops(2,
                        (a, b) => GetCrop(a[0]).time - GetCrop(b[0]).time,
                        (a, b) => GetCrop(b[0]).time - GetCrop(a[0]).time
                    );
                } else if(this.sortElems[3].selected) { // by type
                    const CropSort = function(a) {
                        const crop = GetCrop(a[0]);
                        switch(crop.type) {
                            case "veg": return 0;
                            case "tree": return 1;
                            case "mush": return 2;
                            case "egg": return 3;
                            case "rice": return 4;
                            case "spear": return 5;
                            case "water": return 6;
                            case "rod": return 7;
                            case "food": return 8;
                            case "bee": return 9;
                            case "tech": return 10;
                            case "sickle2": return 11;
                            case "moist": return 12;
                        }
                        return 13;
                    }
                    this.SortCrops(2,
                        (a, b) => CropSort(b) - CropSort(a),
                        (a, b) => CropSort(a) - CropSort(b)
                    );
                } else { // leave sorting
                    this.ExitSort();
                }
            } else {
                sound.PlaySound("confirm");
                this.inSort = true;
                this.sortY = -1;
                this.sortElemContainer.visible = true;
            }
        } else {
            const cropIdx = this.cursor.posY * this.inventoryWidth + this.cursor.posX;
            if(this.selectedCropIdx >= 0) {
                if(this.cursor.posX === this.inventoryWidth) { // recycle
                    const player = game2.player;
                    const inventoryInfo = game2.player.crops[this.selectedCropIdx];
                    const price = Math.ceil(GetCrop(inventoryInfo[0]).price * inventoryInfo[1] * 0.25);
                    player.AddMonies(price);
                    player.crops.splice(this.selectedCropIdx, 1);
                    sound.PlaySound("purchase");
                    this.cursor.MoveTo(0, this.cursor.posY);
                    this.RefreshInventoryDisplay();
                    this.CleanUpCropSelection();
                    this.StartTrashCanAnimation();
                } else if(this.selectedCropIdx === cropIdx) { // unselecting
                    sound.PlaySound("confirm");
                    this.CleanUpCropSelection();
                } else { // swap
                    sound.PlaySound("confirm");
                    const player = game2.player;
                    const temp = player.crops[cropIdx];
                    player.crops[cropIdx] = player.crops[this.selectedCropIdx];
                    player.crops[this.selectedCropIdx] = temp;
                    this.RefreshInventoryDisplay();
                    this.CleanUpCropSelection();
                }
            } else {
                const selectedCropSprite = this.cropSprites[cropIdx];
                this.selectedCropIdx = cropIdx;
                this.trashCan.visible = true;
                this.selectionCursor.Show();
                this.selectionCursor.MoveTo(selectedCropSprite.x, selectedCropSprite.y);
                this.DrawSelectionInfo(this.cursor.posX, this.cursor.posY);
                sound.PlaySound("confirm");
            }
        }
    }
    Cancel() {
        sound.PlaySound("navNok");
        if(this.inSort) {
            this.ExitSort();
        } else if(this.selectedCropIdx >= 0) {
            if(this.cursor.posX === this.inventoryWidth) {
                this.cursor.MoveTo(0, this.cursor.posY);
            }
            this.CleanUpCropSelection();
        } else {
            this.MoveCursor(0, -1);
        }
    }
    RefreshInventoryDisplay() {
        gfx2.EmptyContainer(this.cropContainer);
        const cropSprites = this.DrawCropInventory();
        this.cropContainer.addChild(gfx2.CreateContainer(cropSprites, false, true));
    }
    StartTrashCanAnimation() {
        this.trashCan.visible = true;
        this.coin.visible = true;
        this.trashCan.gotoAndPlay(0);
        this.coin.play();
        this.coin.x = this.trashCan.x;
        this.coin.y = this.trashCan.y;
        clearInterval(this.animIter);
        this.animIter = window.setInterval(() => this.CoinMove(), 10);
    }
    CoinMove() { this.coin.y -= 3; }
    FinishTrashCanAnimation() {
        this.trashCan.visible = false;
        this.coin.stop();
        clearInterval(this.animIter);
        this.coin.visible = false;
    }
    CleanUpCropSelection() {
        this.selectedCropIdx = -1;
        this.trashCan.visible = false;
        this.selectionCursor.Hide();
        this.selectionContainer.CleanUp();
        this.selectionContainer = null;
    }
    ExitSort() {
        this.inSort = false;
        this.sortElems.forEach(e => e.Unselect());
        this.sortElemContainer.visible = false;
        this.secondaryCursor.SetInitialPos(this.sortButton.leftmostX, 4).Resize(this.sortButton.width, -20, false).Redraw();
    }
    /**
     * @param {number} sortIdx
     * @param {{(a: any, b: any): number}} ascendingSort
     * @param {{(a: any, b: any): number}} descendingSort
     */
    SortCrops(sortIdx, ascendingSort, descendingSort) {
        const player = game2.player;
        const nonCrops = player.crops.filter(e => e[0][0] === "_" || e[0][0] === "!");
        const crops = player.crops.filter(e => e[0][0] !== "_" && e[0][0] !== "!");
        if(sortIdx === this.lastSortedIdx) {
            crops.sort(ascendingSort);
        } else {
            crops.sort(descendingSort);
        }
        sound.PlaySound("confirm");
        player.crops = [...crops, ...nonCrops];
        this.lastSortedIdx = (this.lastSortedIdx === sortIdx) ? -1 : sortIdx;
        this.RefreshInventoryDisplay();
        this.ExitSort();
    }
    DrawCropInventory() {
        const player = game2.player;
        let j = 0;
        this.inventoryWidth = 3;
        const dx = 0.5, dy = 1.5;
        const elements = [];
        /** @type {PIXIObj[]} */
        this.cropSprites = [];
        for(let i = 0; i < player.crops.length; i++) {
            const thisX = i % this.inventoryWidth + dx;
            const thisY = Math.floor(i / this.inventoryWidth) + dy;
            elements.push(gfx2.CreateSmallSprite("invBox", thisX, thisY, true));
            const itemSprite = gfx2.CreateInventoryItem(player.crops[i], thisX, thisY, true);
            MakeSpriteInteractive(itemSprite, () => this.Select(), () => this.MoveCursor(thisX - dx, thisY - dy));
            this.cropSprites.push(itemSprite.children[0]);
            elements.push(itemSprite);
            j++;
        }
        for(let i = j; i < 36; i++) {
            const thisX = i % this.inventoryWidth + dx;
            const thisY = Math.floor(i / this.inventoryWidth) + dy;
            elements.push(gfx2.CreateSmallSprite("invBox", thisX, thisY, true));
        }
        return elements;
    }
}
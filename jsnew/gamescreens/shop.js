class ShopDetails {
    constructor() {
        this.img = "";
        this.innId = "";
        this.eyes = "";
        this.ex = 0;
        this.ey = 0;
        this.buyMult = 1;
        this.openingStr = "";
        this.leavingStr = "";
        this.purchasedStr = "";
        this.wakeUpStr = "";
        this.benignTalkStr = "";
        this.notEnoughStr = "";
        this.talkStr = "";
        /** @type {ShopItem[]} */
        this.wares = [];
    }
}
class ShopItem {
    constructor() {
        this.product = "";
        this.name = "";
        this.price = 0;
        this.type = "";
        this.locked = undefined;
    }
}
class ShopState {
    /**
     * @param {ShopDetails} shopDetails
     * @param {any} costText
     */
    constructor(shopDetails, costText) {
        this.costText = costText;
        this.details = shopDetails;
        this.dx = 2;
        this.isUpgradeShop = this.details.wares[0].type === "upgrade";
        this.hasTalk = (this.details.talkStr && !game2.player.HasCompletedQuest(this.details.talkStr));
        this.talkStr = this.hasTalk ? this.details.talkStr : "";
        this.initX = 1 + this.dx;
        if(this.hasTalk) {
            this.initX = 1 + this.dx; // might be wrong
        }
        if(this.details.benignTalkStr && !this.hasTalk) {
            this.isQuestTalk = false;
            this.hasTalk = true;
            this.talkStr = this.details.benignTalkStr;
        } else { this.isQuestTalk = true; }

        const y = 7;
        const exitSprite = gfx2.CreateSmallSprite("exit", 1, y, true);
        MakeSpriteInteractive(exitSprite, () => this.SelectOption(), () => this.MoveCursor(0, true));
        this.sprites = [ exitSprite ];
        this.text = gfx2.WriteWrappedText(GetText(this.details.openingStr), "stdWhite", 12, 615, gfx2.width - 24, "left");
        this.itemState = new ShopSubState("null", this.details.wares, this);

        if(this.hasTalk) {
            const talkTile = (this.isQuestTalk ? "helpBox" : "talk");
            const sprite = gfx2.CreateSmallSprite(talkTile, this.initX, y, true);
            MakeSpriteInteractive(sprite, () => this.SelectOption(), () => this.MoveCursor(1, true));
            this.sprites.push(sprite);
        }

        /** @type {number[]} */
        this.availableIndexes = [];
        let j = 0;
        // TODO: if upgrade shop
        for(let i = 0; i < this.details.wares.length; i++) {
            const ware = this.details.wares[i];
            if(ware.locked !== undefined && !game2.player.HasCompletedQuest(ware.locked)) { continue; }
            this.availableIndexes.push(i);
            const sprite = gfx2.CreateSmallSprite(ware.product, this.initX + j * this.dx, y, true);
            const idx = j + (this.hasTalk ? 2 : 1);
            MakeSpriteInteractive(sprite, () => this.SelectOption(), () => this.MoveCursor(idx, true));
            this.sprites.push(sprite);
            j++;
        }

        this.cursor = new SelCursor(1, y, 0, 0, this.dx, 0, true);
        this.cursor.MoveTo(0, 0);

        this.container = gfx2.CreateContainer([...this.sprites, this.cursor.container, this.text], false, true);
    }
    /**
     * @param {number} amount
     */
    ChargeMoney(amount) {
        game2.player.monies -= amount;
        this.costText.text = GetText("s.coins").replace(/\{0\}/g, game2.player.monies);
    }
    SelectOption() {
        const cx = this.cursor.posX;
        if(cx === 0) {
            sound.PlaySound("entrance", true);
            game2.Transition(WorldScreen, { returning: true, returnDir: 2 });
        } else if(cx === 1 && this.hasTalk) {
            // TODO: talking
        } else {
            const realIdx = this.cursor.posX - (this.hasTalk ? 2 : 1);
            this.itemState.Select(realIdx, cx);
        }
    }
    GetMaxX() {
        return (this.itemState.maxX > 0 ? this.itemState.maxX : this.sprites.length);
    }
    /**
     * @param {number} i
     * @param {boolean} [fromCrop]
     */
    MoveCursor(i, fromCrop) {
        this.itemState.MoveCursor(i, fromCrop);
    }
    /**
     * @param {number} dir
     */
    MoveY(dir) {
        this.itemState.MoveY(dir);
    }
    Cancel() {
        this.itemState.Cancel();
    }
    UpdateSelectionText() {
        const cx = this.cursor.posX;
        this.itemState.SetInnerContainer(null);
        if(cx === 0) {
            this.text.text = GetText(this.details.leavingStr);
        } else if(cx === 1 && this.hasTalk) {
            this.text.text = GetText(this.talkStr);
        } else {
            const realIdx = cx - (this.hasTalk ? 2 : 1);
            this.itemState.Update(realIdx, cx);
        }
    }
    CleanUp() {
        this.cursor.CleanUp();
    }
}
class ShopSubState {
    /**
     * @param {string} type
     * @param {ShopItem[]} items
     * @param {ShopState} parent
     */
    constructor(type, items, parent) {
        this.type = type;
        this.maxX = 0;
        this.items = items;
        this.parent = parent;
        this.additionalContainer = null;
        this.innerContainer = null;
    }
    MoveY(dir) { }
    Cancel() {
        this.parent.cursor.MoveTo(0, 0);
        sound.PlaySound("menuMove");
        this.parent.UpdateSelectionText();
    }
    /**
     * @param {number} wareIdx
     * @param {number} cursorIdx
     */
    Update(wareIdx, cursorIdx) {
        const selection = this.items[wareIdx];
        switch(selection.type) {
            case "inn":
                this.parent.text.text = GetText("s.sleepsy").replace(/\{0\}/g, selection.price);
                break;
            case "book":
                this.parent.text.text = GetText(selection.name);
                break;
            case "seed":
                this.DrawSeedDetails(selection);
                break;
            default:
                console.log(selection.type);
        }
    }
    SetInnerContainer(elements) {
        if(this.innerContainer !== null) {
            gfx2.RemoveContainer(this.innerContainer);
        }
        if(elements === null) {
            this.parent.text.visible = true;
        } else {
            this.parent.text.visible = false;
            this.innerContainer = gfx2.CreateContainer(elements);
        }
    }
    /**
     * @param {ShopItem} productInfo
     */
    DrawSeedDetails(productInfo) {
        const crop = GetCrop(productInfo.product);
        const price = Math.floor(crop.price * this.parent.details.buyMult * game2.player.GetPriceMultiplier());
        const amt = game2.player.GetItemAmount(crop.name);
        const itemsToRender = [
            gfx2.WriteText(`${crop.displayname} (${price}G)`, "stdWhite", 12, 615, "left"),
            gfx2.WriteText(GetText("s.youHave").replace(/\{0\}/g, amt), "stdWhite", gfx2.width - 12, 615, "right")
        ];
        itemsToRender.push(GetCropPowerDisplay(crop, false, 24, 655));

        const seasons = ["spring", "summer", "autumn", "winter"];
        for(let i = 0; i < 4; i++) { itemsToRender.push(gfx2.CreateSmallSprite(seasons[i] + crop.seasons[i], 544 + 64 * i, 655)); }

        let cropSprite = "dirt";
        switch(crop.type) {
            case "bee": cropSprite = "_beehive"; break;
            case "spear":
            case "water":
            case "rod": cropSprite = "_lake"; break;
            case "mush": cropSprite = "_log"; break;
            case "egg": cropSprite = "_coop"; break;
            case "food": cropSprite = "_cow"; break;
            case "rice": cropSprite = "_paddy"; break;
            case "tech": cropSprite = "_hotspot"; break;
            case "sickle2": cropSprite = "_charger"; break;
        }
        itemsToRender.push(gfx2.CreateSmallSprite(cropSprite, 864, 655));
        itemsToRender.push(gfx2.WriteText(crop.size, "cropNo", 920, 645));

        itemsToRender.push(gfx2.CreateSmallSprite("inv_time", 24, 724));
        itemsToRender.push(GetThinNumber(crop.time, 96, 720));
        let nextx = 192;
        if(crop.respawn > 0) {
            nextx = 352;
            itemsToRender.push(gfx2.CreateSmallSprite("inv_regrow", 192, 724));
            itemsToRender.push(GetThinNumber(crop.respawn, 256, 720));
        }
        
        const bonusesToPush = [];
        if(crop.waterResist) { bonusesToPush.push("waterIco" + crop.waterResist); }
        if(crop.fireResist) { bonusesToPush.push("fireIco" + crop.fireResist); }
        if(crop.stickChance) { bonusesToPush.push("stunIco" + crop.stickChance); }
        if(crop.saltResist) { bonusesToPush.push("saltIco" + crop.saltResist); }
        if(crop.saltClean) { bonusesToPush.push("saltIcoX"); }
        if(crop.animal) { bonusesToPush.push(animalInfo[crop.animal].invSprite); }
        for(let i = 0; i < bonusesToPush.length; i++) {
            itemsToRender.push(gfx2.CreateSmallSprite(bonusesToPush[i], nextx + i * 64, 724));
        }
        itemsToRender.push(gfx2.WriteWrappedText(GetText(crop.name), "stdWhite", 12, 792, gfx2.width - 24, "left"));

        this.SetInnerContainer(itemsToRender);
    }
    /**
     * @param {number} wareIdx
     * @param {number} cursorIdx
     */
    Select(wareIdx, cursorIdx) {
        const selection = this.parent.details.wares[wareIdx];
        if(selection.type === "book") {
            this.parent.itemState = new ShopBookState(this.parent.details.wares, this.parent, selection.name, cursorIdx);
            return;
        }
        let price = 0;
        switch(selection.type) {
            case "seed": price = GetCrop(selection.product).price; break;
            case "farm": price = GetFarmInfo(selection.product).price; break;
            case "equipment": price = GetEquipment(selection.product).price; break;
            default: price = selection.price; break;
        }
        price *= game2.player.GetPriceMultiplier();
        this.SetInnerContainer(null);
        if(price > game2.player.monies) {
            sound.PlaySound("cantafford");
            if(selection.type === "alms") { this.SetText("s.almsNope"); }
            else { this.SetText(this.parent.details.notEnoughStr); }
            return;
        }
        switch(selection.type) {
            case "inn":
                this.parent.ChargeMoney(price);
                this.parent.itemState = new ShopSleepState(this.parent);
                break;
            case "alms":
                break;
            default:
                this.parent.itemState = new ShopHowManyState(this.parent, selection);
                break;
        }
    }
    /**
     * @param {number} i
     * @param {boolean} [fromCrop]
     */
    MoveCursor(i, fromCrop) {
        this.parent.cursor.MoveTo(i, 0);
        sound.PlaySound("menuMove");
        this.parent.UpdateSelectionText();
    }
    /**
     * @param {string} textKey 
     */
    SetText(textKey) {
        this.parent.text.text = GetText(textKey);
    }
    /**
     * @param {number} [idx]
     */
    ReturnToInitialItemState(idx) {
        idx = idx || this.parent.cursor.posX;
        if(this.additionalContainer !== null) {
            gfx2.RemoveContainer(this.additionalContainer);
        }
        this.CleanUp();
        this.parent.itemState = new ShopSubState("null", this.parent.details.wares, this.parent);
        this.parent.itemState.MoveCursor(idx);
    }
    CleanUp() { }
}
class ShopHowManyState extends ShopSubState {
    /**
     * @param {ShopState} parent
     * @param {ShopItem} selectedItem
     */
    constructor(parent, selectedItem) {
        super("howMany", [], parent);
        this.maxX = 999;
        this.y = 0;
        this.selectedItem = selectedItem;
        sound.PlaySound("confirm");
        
        const crop = GetCrop(selectedItem.product);
        const amountPlayerHas = game2.player.GetItemAmount(crop.name);

        this.cost = Math.floor(crop.price * this.parent.details.buyMult * game2.player.GetPriceMultiplier());
        this.amountToBuy = 1;

        this.amountText = gfx2.WriteText("1", "stdWhite", 222, 680, "center");
        this.priceText = gfx2.WriteText(`(${this.cost}G)`, "stdWhite", 340, 680, "center");

        this.leftOk = gfx2.img.sprites["opL"];
        this.leftNOk = gfx2.img.sprites["nopL"];
        this.rightOk = gfx2.img.sprites["opR"];
        this.rightNOk = gfx2.img.sprites["nopR"];

        const initialRightArrowIcon = (this.cost * 2 > game2.player.monies) ? "nopR" : "opR";
        this.leftArrow = gfx2.CreateSmallSprite("nopL", 140, 666, false);
        this.rightArrow = gfx2.CreateSmallSprite(initialRightArrowIcon, 240, 666, false);
        this.leftArrow.interactive = true;
        this.rightArrow.interactive = true;
        this.box = gfx2.CreateRectangle(0x000000, 172, 675, 100, 44, false);
        this.box.interactive = true;
        this.box.on("mouseover", () => this.SwitchY(0));
        this.leftArrow.on("click", () => this.MoveCursor(this.parent.cursor.posX - 1));
        this.rightArrow.on("click", () => this.MoveCursor(this.parent.cursor.posX + 1));

        const elementsToRender = [
            gfx2.WriteText(`${crop.displayname} (${this.cost}G)`, "stdWhite", 12, 615, "left"),
            gfx2.WriteText(GetText("s.youHave").replace(/\{0\}/g, amountPlayerHas), "stdWhite", gfx2.width - 12, 615, "right"),
            gfx2.WriteText(GetText("s.howMany"), "stdWhite", 12, 680, "left"),
            this.box, this.amountText, this.priceText, this.leftArrow, this.rightArrow
        ];

        this.confirmBtn = new InfoText(GetText("ctrlConfirm"), 256, 730, false, () => this.Select(), () => this.SwitchY(1));
        this.cancelBtn = new InfoText(GetText("ctrlCancel"), 256, 790, false, () => this.Select(), () => this.SwitchY(2));

        this.SetInnerContainer(elementsToRender);
    }
    MoveY(dir) {
        if((this.y === 0 && dir < 0) || (this.y === 2 && dir > 0)) {
            sound.PlaySound("navNok");
            return;
        }
        this.SwitchY(this.y + dir);
    }
    /**
     * @param {number} newY
     */
    SwitchY(newY) {
        this.confirmBtn.Unselect();
        this.cancelBtn.Unselect();
        if(newY === this.y) { return; }
        sound.PlaySound("menuMove");
        this.y = newY;
        this.leftArrow.visible = (newY === 0);
        this.rightArrow.visible = (newY === 0);
        if(newY === 1) { this.confirmBtn.Select(); }
        else if(newY === 2) { this.cancelBtn.Select(); }
    }
    Cancel() {
        sound.PlaySound("navNok");
        this.SetInnerContainer(null);
        this.ReturnToInitialItemState(0);
    }
    /**
     * @param {number} i
     * @param {boolean} [fromCrop]
     */
    MoveCursor(i, fromCrop) {
        if(fromCrop) { return; }
        const newBuyAmount = this.amountToBuy + (this.parent.cursor.posX < i ? 1 : -1);
        console.log(newBuyAmount);
        const newPrice = newBuyAmount * this.cost;
        if(newPrice > game2.player.monies || newBuyAmount <= 0) {
            sound.PlaySound("navNok");
            return;
        }
        sound.PlaySound("menuMove");
        this.amountToBuy = newBuyAmount;
        this.leftArrow.texture = (this.amountToBuy === 1) ? this.leftNOk : this.leftOk;
        const newerPrice = (newBuyAmount + 1) * this.cost;
        this.rightArrow.texture = (newerPrice > game2.player.monies) ? this.rightNOk : this.rightOk;
        this.amountText.text = this.amountToBuy;
        this.priceText.text = `(${this.cost * this.amountToBuy}G)`;
    }
    Select() {
        if(this.y === 0) {
            this.SwitchY(1);
        } else if(this.y === 2) {
            this.Cancel();
        } else {
            const price = this.amountToBuy * this.cost;
            if(price > game2.player.monies) {
                sound.PlaySound("navNok");
                return;
            }
            this.parent.ChargeMoney(price);
            sound.PlaySound("purchase");
            this.ReturnToInitialItemState();
            this.SetInnerContainer(null);
            game2.player.IncreaseItem(this.selectedItem.product, this.amountToBuy);
            this.parent.itemState.SetInnerContainer(null);
            this.parent.itemState.SetText(this.parent.details.purchasedStr);
        }
    }
    CleanUp() {
        super.CleanUp();
        this.confirmBtn.CleanUp();
        this.cancelBtn.CleanUp();
    }
}
class ShopSleepState extends ShopSubState {
    /**
     * @param {ShopState} parent
     */
    constructor(parent) {
        super("inn", [], parent);
        this.transitionAnim = new SleepTransition(game2, 50, 5, 60, () => this.MidTransition(), () => this.FinishTransition());
    }
    Cancel() { }
    Update() { }
    MoveCursor() { }
    MidTransition() {
        this.transitionAnim.SwitchToMiddle();
        this.parent.itemState.SetText(this.parent.details.wakeUpStr);
    }
    FinishTransition() {
        this.transitionAnim.CleanUp();
        this.ReturnToInitialItemState();
        this.parent.itemState.SetText(this.parent.details.wakeUpStr);
    }
    /**
     * @param {number} wareIdx
     * @param {number} cursorIdx
     */
    Select(wareIdx, cursorIdx) {
        if(!this.transitionAnim.active) {
            this.transitionAnim.FinishMiddle();
        }
    }
}
class ShopBookState extends ShopSubState {
    /**
     * @param {ShopItem[]} items
     * @param {ShopState} parent
     * @param {string} bookName
     * @param {number} cursorIdx
     */
    constructor(items, parent, bookName, cursorIdx) {
        super("book", items, parent);
        this.page = 0;
        this.bookName = bookName;
        this.book = this.parent.sprites[cursorIdx];
        this.oldTexture = this.book.texture;
        this.book.texture = gfx2.img.sprites["bookOpen"];
        this.book.position.x -= 32;
        this.parent.cursor.Resize(0.75, 0).ShiftInitialPos(-20, 0).Redraw();
        this.Update(0, 0);
    }
    Cancel() {
        this.parent.cursor.MoveTo(0, 0);
        this.MoveCursor(0);
    }
    /**
     * @param {number} wareIdx
     * @param {number} cursorIdx
     */
    Update(wareIdx, cursorIdx) {
        sound.PlaySound("turnpage");
        this.parent.text.text = GetText(this.bookName + this.page);
        if(this.additionalContainer !== null) {
            gfx2.RemoveContainer(this.additionalContainer);
            this.additionalContainer = null;
        }
        if(this.bookName === "bookStun" && this.page === 1) {
            this.additionalContainer = gfx2.CreateContainer([
                gfx2.CreateSmallSprite("stunIco1", 3, 11, true),
                gfx2.CreateSmallSprite("stunIco2", 5, 11, true),
                gfx2.CreateSmallSprite("stunIco3", 7, 11, true)
            ]);
        } /* else if(this.bookReading === "bookElem") {
            if(this.bookState === 3) {
                gfx.drawTileToGrid("fireIco1", 2, 10.5, "menutext");
                gfx.drawTileToGrid("fireIco2", 4, 10.5, "menutext");
                gfx.drawTileToGrid("waterIco1", 2, 12, "menutext");
                gfx.drawTileToGrid("waterIco2", 4, 12, "menutext");
            } else if(this.bookState === 5) {
                gfx.drawTileToGrid("saltIco1", 2, 10.5, "menutext");
                gfx.drawTileToGrid("saltIco2", 4, 10.5, "menutext");
                gfx.drawTileToGrid("saltIcoX", 3, 12, "menutext");
            }
        } */
    }
    /**
     * @param {number} wareIdx
     * @param {number} cursorIdx
     */
    Select(wareIdx, cursorIdx) {
        this.page++;
        const newText = TryGetText(this.bookName + this.page);
        if(newText === false) {
            this.MoveCursor(this.parent.cursor.posX);
        } else {
            this.Update(0, 0);
        }
    }
    /**
     * @param {number} i
     */
    MoveCursor(i) {
        this.parent.cursor.ShiftInitialPos(20, 0).Resize(0, 0).Redraw();
        this.book.position.x += 32;
        this.book.texture = this.oldTexture;
        sound.PlaySound("menuMove");
        this.ReturnToInitialItemState(i);
    }
}

class ShopScreen extends GameScreen {
    /**
     * @param {string} shopName
     */
    constructor(shopName) {
        super();

        /** @type {ShopDetails} */
        this.details = stores[shopName];

        this.blink = gfx2.CreateImg(this.details.eyes, this.details.ex * 4, this.details.ey * 4);
        this.blink.visible = false;
        this.costText = gfx2.WriteText(GetText("s.coins").replace(/\{0\}/g, game2.player.monies), "stdWhite", 12, 570, "left");
        this.state = new ShopState(this.details, this.costText);
        this.gfxContainers = {
            "bg": gfx2.CreateContainer([
                gfx2.CreateImg(this.details.img, 0, 0),
                this.blink,
                this.costText
            ]),
            "items": gfx2.CreateContainer([this.state.container])
        };

        this.SetBlink();
        // TODO: any other necessary tings
    }
    SetBlink() {
        setTimeout(() => this.Blink(), MathB.Range(250, 5000));
    }
    Blink() {
        if(!this.active) { return; }
        this.blink.visible = true;
        setTimeout(() => {
            if(!this.active) { return; }
            this.blink.visible = false;
            this.SetBlink();
        }, 50);
    }
    /**
     * @param {string} key
     */
    KeyPress(key) {
        let posX = this.state.cursor.posX, dirY = 0;
        let isEnter = false, isCancel = false;
        switch(key) {
            case this.controls["left"]: posX--; break;
            case this.controls["right"]: posX++; break;
            case this.controls["up"]: dirY--; break;
            case this.controls["down"]: dirY++; break;
            case this.controls["confirm"]: isEnter = true; break;
            case this.controls["cancel"]: isCancel = true; break;
        }
        if(posX < 0 || posX >= this.state.GetMaxX()) { return false; }
        if(isEnter) { return this.state.SelectOption(); }
        else if(isCancel) { return this.state.Cancel(); }
        else if(dirY !== 0) { return this.state.MoveY(dirY); }
        else { return this.state.MoveCursor(posX); }
    }
    CleanUp() {
        super.CleanUp();
        this.state.CleanUp();
    }
}
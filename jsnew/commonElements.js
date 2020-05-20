/**
 * @param {number} i
 * @param {number} x
 * @param {number} y
 * @returns {PIXIObj}
 */
function GetThinNumber(i, x, y) {
    let dispNum = "";
    if(i === -1 || i === 999) { // NOTE: -1 vs 999 what is the diff?
        dispNum = "??";
    } else if(i < 10) {
        dispNum = " " + i.toString();
    } else {
        dispNum = i.toString();
    }
    const thinNo = gfx2.WriteText(dispNum, "stdWhiteBig", x, y);
    thinNo.width = 64;
    return thinNo;
}
/**
 * @param {{ power: number }} crop
 * @param {boolean} ignoreSun
 * @param {number} x
 * @param {number} y
 * @returns {PIXIObj}
 */
function GetCropPowerDisplay(crop, ignoreSun, x, y) {
    const sprites = [];
    const dx = ignoreSun ? 0 : 64;
    if(!ignoreSun) {
        sprites.push(gfx2.CreateSmallSprite("inv_power", x, y, false));
    }
    const numStars = crop.power / 2, starDx = 64;
    if(numStars > 5) {
        for(let i = 0; i < 5; i++) {
            sprites.push(gfx2.CreateSmallSprite("starMax", dx + x + 1 + i * starDx, y, false));
        }
    } else {
        for(let i = 0; i < numStars; i++) {
            sprites.push(gfx2.CreateSmallSprite("starFull", dx + x + 1 + i * starDx, y, false));
        }
        if(numStars % 1 !== 0) { sprites.push(gfx2.CreateSmallSprite("starHalf", dx + x + 1 + (numStars - 0.5) * starDx, y, false)); }
        for(let i = Math.ceil(numStars); i < 5; i++) {
            sprites.push(gfx2.CreateSmallSprite("starNone", dx + x + 1 + i * starDx, y, false));
        }
    }
    return gfx2.CreateContainer(sprites, false, true);
}
class SelCursor {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {any} [fromGrid]
     */
    constructor(x, y, w, h, dx, dy, fromGrid) {
        this.posX = 0;
        this.posY = 0;
        if(fromGrid) {
            x *= 64; y *= 64;
            w *= 64; h *= 64;
            dx *= 64; dy *= 64;
        }
        this.dx = dx;
        this.dy = dy;
        this.initX = x;
        this.initY = y;
        this.width = w;
        this.height = h;
        this.sprites = [
            gfx2.CreateSmallSprite("cursor0.0", x, y),
            gfx2.CreateSmallSprite("cursor0.1", x + w, y),
            gfx2.CreateSmallSprite("cursor0.2", x, y + h),
            gfx2.CreateSmallSprite("cursor0.3", x + w, y + h)
        ];
        this.container = gfx2.CreateContainer(this.sprites);
        this.animIdx = setInterval(() => this.Update(), 500);
        this.flipped = false;
    }
    Update() {
        this.flipped = !this.flipped;
        const prefix = this.flipped ? "cursor1." : "cursor0.";
        for(let i = 0; i < 4; i++) {
            this.sprites[i].texture = gfx2.img.sprites[prefix + i];
        }
    }
    /**
     * @param {number} w
     * @param {number} h
     */
    Resize(w, h) {
        this.width = w * 64;
        this.height = h * 64;
        return this;
    }
    /**
     * @param {number} x
     * @param {number} y
     */
    ShiftInitialPos(x, y) {
        this.initX += x;
        this.initY += y;
        return this;
    }
    /**
     * @param {number} x
     * @param {number} y
     */
    MoveTo(x, y) {
        this.posX = x;
        this.posY = y;
        this.Redraw();
    }
    Redraw() {
        const dispX = this.posX * this.dx, dispY = this.posY * this.dy;
        [this.sprites[0].position.x, this.sprites[0].position.y] = [this.initX + dispX, this.initY + dispY];
        [this.sprites[1].position.x, this.sprites[1].position.y] = [this.initX + this.width + dispX, this.initY + dispY];
        [this.sprites[2].position.x, this.sprites[2].position.y] = [this.initX + dispX, this.initY + this.height + dispY];
        [this.sprites[3].position.x, this.sprites[3].position.y] = [this.initX + this.width + dispX, this.initY + this.height + dispY];
    }
    CleanUp() {
        clearInterval(this.animIdx);
        /** @type {PIXIObj[]} */
        this.sprites = [];
        this.container = null;
    }
}
class InfoText {
    /**
     * @param {string} text
     * @param {number} x
     * @param {number} y
     * @param {boolean} selected
     * @param {{(): void}} clickHandler
     * @param {{(): void}} hoverHandler
     */
    constructor(text, x, y, selected, clickHandler, hoverHandler) {
        this.selected = selected;
        this.selSprite = "recSel";
        this.stdSprite = "sel";

        const info = gfx2.GetTextInfo(text, "std");
        
        const width = info.width;
        let leftX = Math.floor((x - width / 2) / 64) * 64;
        let rightX = Math.floor((x + width / 2) / 64) * 64;

        if((x - width / 2 - leftX) > 32) {
            leftX += 32;
            rightX -= 32;
        }
        if(leftX === rightX) {
            leftX -= 32;
            rightX += 32;
        }

        const prefix = selected ? this.selSprite : this.stdSprite;
        this.elems = [
            gfx2.CreateSmallSprite(`${prefix}L`, leftX, y),
            gfx2.CreateSmallSprite(`${prefix}R`, rightX, y)
        ];
        for(let x = (leftX + 64); x <= (rightX - 64); x += 64) {
            this.elems.push(gfx2.CreateSmallSprite(`${prefix}M`, x, y));
        }

        this.text = gfx2.WriteText(text, "std", x, y + 6, "center");

        this.container = gfx2.CreateContainer([...this.elems, this.text]);

        this.container.interactive = true;
        this.container.on("click", function() { clickHandler(); });
        this.container.on("mouseover", function() { hoverHandler(); });
    }
    Select() {
        if(this.selected) { return; }
        this.selected = true;
        this.elems[0].texture = gfx2.img.sprites[`${this.selSprite}L`];
        this.elems[1].texture = gfx2.img.sprites[`${this.selSprite}R`];
        for(let i = 2; i < this.elems.length; i++) {
            this.elems[i].texture = gfx2.img.sprites[`${this.selSprite}M`];
        }
    }
    Unselect() {
        if(!this.selected) { return; }
        this.selected = false;
        this.elems[0].texture = gfx2.img.sprites[`${this.stdSprite}L`];
        this.elems[1].texture = gfx2.img.sprites[`${this.stdSprite}R`];
        for(let i = 2; i < this.elems.length; i++) {
            this.elems[i].texture = gfx2.img.sprites[`${this.stdSprite}M`];
        }
    }
    CleanUp() { gfx2.RemoveContainer(this.container); }
}
class TitleSelection {
    constructor(i, selected, y, text, clickHandler, hoverHandler) {
        this.selected = selected;
        const spr = (selected ? "titleSelActive" : "titleSel");
        this.left = gfx2.CreateSmallSprite(spr + "0", 6.5, y, true);
        this.middle = gfx2.CreateSmallSprite(spr + "1", 7.5, y, true);
        this.right = gfx2.CreateSmallSprite(spr + "2", 8.5, y, true);
        this.text = gfx2.WriteText(text, "std", 512, y * 64 + 12, "center");
        this.container = gfx2.CreateContainer([this.left, this.middle, this.right, this.text], false, true);
        this.container.interactive = true;
        this.container.on("click", function() { clickHandler(i); });
        this.container.on("mouseover", function() { hoverHandler(i); });
    }
    Select() {
        if(this.selected) { return; }
        this.selected = true;
        this.left.texture = gfx2.img.sprites["titleSelActive0"];
        this.middle.texture = gfx2.img.sprites["titleSelActive1"];
        this.right.texture = gfx2.img.sprites["titleSelActive2"];
    }
    Unselect() {
        if(!this.selected) { return; }
        this.selected = false;
        this.left.texture = gfx2.img.sprites["titleSel0"];
        this.middle.texture = gfx2.img.sprites["titleSel1"];
        this.right.texture = gfx2.img.sprites["titleSel2"];
    }
}
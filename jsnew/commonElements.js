/**
 * @param {PIXIObj} sprite
 * @param {() => void} clickHandler
 * @param {() => void} mouseoverHandler
 */
function MakeSpriteInteractive(sprite, clickHandler, mouseoverHandler) {
    sprite.interactive = true;
    sprite.on("click", clickHandler);
    sprite.on("mouseover", mouseoverHandler);
}

class SelCursor {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {number} dx
     * @param {number} dy
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
     * @param {boolean} fromGrid
     */
    Resize(w, h, fromGrid) {
        if(fromGrid) { w *= 64; h *= 64; }
        this.width = w;
        this.height = h;
        return this;
    }
    /** @param {number} x @param {number} y */
    SetInitialPos(x, y) {
        this.initX = x;
        this.initY = y;
        return this;
    }
    /** @param {number} x @param {number} y */
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

class SelCursorX extends SelCursor {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {number} dx
     * @param {number} dy
     * @param {any} [fromGrid]
     */
    constructor(x, y, w, h, dx, dy, fromGrid) {
        super(x, y, w, h, dx, dy, fromGrid);
        for(let i = 0; i < 4; i++) {
            this.sprites[i].texture = gfx2.img.sprites["bcursor0." + i];
        }
    }
    Update() { }
}

class InfoText {
    /**
     * @param {string} text
     * @param {number} x
     * @param {number} y
     * @param {boolean} selected
     * @param {{ (): void; }} clickHandler
     * @param {{ (): void; }} hoverHandler
     * @param {{ leftAlign?: boolean; padText?: boolean; noLeftSide?: boolean; noRightSide?: boolean; minX?: number; forceCenter?: boolean }} [options]
     */
    constructor(text, x, y, selected, clickHandler, hoverHandler, options) {
        options = options || {};

        this.selected = selected;
        this.selSprite = "recSel";
        this.stdSprite = "sel";

        if(options.padText === true) {
            text = " " + text + " ";
        }

        const info = gfx2.GetTextInfo(text, "std");
        
        let width = info.width + 8;
        let leftX = Math.floor((x - width / 2) / 64) * 64;
        let rightX = Math.floor((x + width / 2) / 64) * 64;
        if(options.minX !== undefined) {
            if(options.forceCenter === true) {
                const actualWidth = Math.floor(width / 64);
                if(actualWidth < options.minX) {
                    width = options.minX * 64;
                    const diff = (width - actualWidth) / 2;
                    leftX -= diff;
                    rightX += diff;
                }
            } else {
                const calcx = options.minX * 32;
                leftX = Math.min(leftX, Math.floor((x - calcx) / 64) * 64);
                rightX = Math.max(rightX, Math.floor((x + calcx) / 64) * 64);
            }
        }
        while((x - width / 2 - leftX) > 16) {
            leftX += 16;
            rightX -= 16;
        }
        if(leftX === rightX) {
            leftX -= 32;
            rightX += 32;
        }

        if(options.noLeftSide === true || options.leftAlign === true) {
            const dx = rightX - leftX;
            leftX = x;
            rightX = x + dx;
            x += 8;
        } else if(options.noRightSide === true) {
            const dx = rightX - leftX;
            leftX = x - dx;
            rightX = x;
            x -= 8;
        }
        this.width = rightX - leftX;
        this.leftmostX = leftX;
        this.y = y;

        const prefix = selected ? this.selSprite : this.stdSprite;
        this.leftSuffix = options.noLeftSide === true ? "M" : "L";
        this.rightSuffix = options.noRightSide === true ? "M" : "R";
        this.elems = [
            gfx2.CreateSmallSprite(prefix + this.leftSuffix, leftX, y),
            gfx2.CreateSmallSprite(prefix + this.rightSuffix, rightX, y)
        ];
        for(let x = (leftX + 32); x <= (rightX - 32); x += 64) {
            this.elems.push(gfx2.CreateSmallSprite(`${prefix}M`, x, y));
        }

        let alignment = "center";
        if(options.noLeftSide === true || options.leftAlign === true) { alignment = "left"; }
        else if(options.noRightSide === true) { alignment = "right"; }
        this.text = gfx2.WriteText(text, "std", x, y + 6, alignment);

        this.container = gfx2.CreateContainer([...this.elems, this.text]);

        this.container.interactive = true;
        this.container.on("click", function() { clickHandler(); });
        this.container.on("mouseover", function() { hoverHandler(); });
    }
    Select() {
        if(this.selected) { return; }
        this.selected = true;
        this.elems[0].texture = gfx2.img.sprites[`${this.selSprite}${this.leftSuffix}`];
        this.elems[1].texture = gfx2.img.sprites[`${this.selSprite}${this.rightSuffix}`];
        for(let i = 2; i < this.elems.length; i++) {
            this.elems[i].texture = gfx2.img.sprites[`${this.selSprite}M`];
        }
    }
    Unselect() {
        if(!this.selected) { return; }
        this.selected = false;
        this.elems[0].texture = gfx2.img.sprites[`${this.stdSprite}${this.leftSuffix}`];
        this.elems[1].texture = gfx2.img.sprites[`${this.stdSprite}${this.rightSuffix}`];
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
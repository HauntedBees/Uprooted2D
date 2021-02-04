class CropFieldInfo {
    /**
     * @param {number} w
     * @param {number} h
     * @param {string} level
     * @param {string} [imgType]
     * @param {string} [edgeType]
     * @param {string} [textureType]
     */
    constructor(w, h, level, imgType, edgeType, textureType) {
        this.width = w;
        this.height = h;
        this.level = level;
        this.type = imgType || "dirt";
        this.type = "dirt";
        this.edge = edgeType || "edge";
        this.debris = textureType || "dirtTexture";
        /** @type {any[][]} */
        this.grid = [];
        for(let x = 0; x < w; x++) {
            const column = [];
            for(let y = 0; y < h; y++) {
                column.push(null);
            }
            this.grid.push(column);
        }
    }
    /** @param {number} newWidth @param {number} newHeight @param {string} newLevel */
    ExpandGrid(newWidth, newHeight, newLevel) {
        let oldwidth = this.width;
        let oldheight = this.height;
        for(let x = 0; x < newWidth; x++) {
            if(x < oldwidth) {
                for(let y = oldheight; y < newHeight; y++) {
                    this.grid[x].push(null);
                }
            } else {
                const row = [];
                for(var y = 0; y < newHeight; y++) { row.push(null); }
                this.grid.push(row);
            }
        }
        this.width = newWidth;
        this.height = newHeight;
        this.level = newLevel;
    }

    /**
     * @param {number} offsetX
     * @param {number} offsetY
     * @param {number} scaleY
     * @param {{ (x: number, y: number, caller: any): void; }} [clickHandler]
     * @param {{ (x: number, y: number, caller: any): void; }} [hoverHandler]
     * @param {any} [caller]
     * @param {boolean} [staticDirtParts]
     */
    GetFarmDisplayContainer(offsetX, offsetY, scaleY, clickHandler, hoverHandler, caller, staticDirtParts) {
        offsetY += 1;
        /** @param {string} edge @param {number} x @param {number} y @param {number} scaleY */
        const GetEdge = (edge, x, y, scaleY) => {
            const s = gfx2.CreateSmallSprite(edge, x, y, true);
            s.anchor.y = 1;
            s.scale.y = scaleY;
            return s;
        } 
        const dirtContainers = [];
        const saEdge = this.grid[0][this.height - 1] === "_paddy" ? "wedge" : this.edge;
        const sdEdge = this.grid[this.width - 1][this.height - 1] === "_paddy" ? "wedge" : this.edge;
        const itemContainers = [
            GetEdge(this.edge + "WA", offsetX - 1, offsetY + scaleY * -1, scaleY),
            GetEdge(this.edge + "WD", offsetX + this.width, offsetY + scaleY * -1, scaleY),
            GetEdge(saEdge + "SA", offsetX - 1, offsetY + scaleY * this.height, scaleY),
            GetEdge(sdEdge + "SD", offsetX + this.width, offsetY + scaleY * this.height, scaleY)
        ];

        for(let x = 0; x < this.width; x++) {
            itemContainers.push(GetEdge(this.edge + "W", x + offsetX, offsetY + scaleY * -1, scaleY));
            const bottomEdge = this.grid[x][this.height - 1] === "_paddy" ? "wedge" : this.edge;
            itemContainers.push(GetEdge(bottomEdge + "S", x + offsetX, offsetY + scaleY * this.height, scaleY));
            for(let y = 0; y < this.height; y++) {
                const aEdge = this.grid[x][y] === "_paddy" ? "paddy" : this.edge;
                const dEdge = this.grid[x][y] === "_paddy" ? "paddy" : this.edge;
                // TODO: transitioning from paddy to not paddy?
                itemContainers.push(GetEdge(aEdge + "A", offsetX - 1, offsetY + scaleY * y, scaleY));
                itemContainers.push(GetEdge(dEdge + "D", offsetX + this.width, offsetY + scaleY * y, scaleY));
                const sprites = [];
                const dirtParts = [];
                const dirt = gfx2.CreateSmallSprite(this.type, x + offsetX, offsetY + scaleY * y, true);
                dirt.anchor.y = 1;
                dirt.scale.y = scaleY;
                dirtParts.push(dirt);
                if(staticDirtParts) {
                    const idx = (y * this.height + x) % 5;
                    if(idx === 2 || idx === 0) {
                        const amt = (x % 7 === 0) ? (x % 3 + y % 4) : (x % 3 + y % 2);
                        const dirtPart = `${this.debris}${amt}`;
                        const dx = (((x + y) % 36) / 36) * 0.75, dy = (((x + y) % 23) / 23) * 0.75;
                        const dirtPiece = gfx2.CreateSmallSprite(dirtPart, x + offsetX + dx, offsetY + scaleY * (y - dy), true);
                        dirtPiece.anchor.y = 1;
                        dirtPiece.scale.y = scaleY;
                        dirtParts.push(dirtPiece);
                    }
                } else if(Math.random() <= 0.65) {
                    const amt = Math.random() < 0.2 ? MathB.Range(0, 6) : MathB.Range(0, 5);
                    const dirtPart = `${this.debris}${amt}`;
                    const dx = Math.random() * 0.75, dy = Math.random() * 0.75;
                    const dirtPiece = gfx2.CreateSmallSprite(dirtPart, x + offsetX + dx, offsetY + scaleY * (y - dy), true);
                    dirtPiece.anchor.y = 1;
                    dirtPiece.scale.y = scaleY;
                    dirtParts.push(dirtPiece);
                }
                const item = this.grid[x][y];
                if(item !== null && !item.coord) {
                    const iteminfo = GetFarmInfo(item);
                    const isBig = (iteminfo.size === 2);
                    let s = null;
                    if(iteminfo.displaySprite !== undefined) {
                        if(isBig) {
                            s = gfx2.CreateBigSprite(iteminfo.displaySprite, x + offsetX, offsetY + scaleY * y, true);
                        } else {
                            s = gfx2.CreateSmallSprite(iteminfo.displaySprite, x + offsetX, offsetY + scaleY * y, true);
                        }
                    } else if(item === "_lake") {
                        sprites.push(...this.GetWaterFrames(x, y, x + offsetX, offsetY + scaleY * y, scaleY));
                    } else {
                        if(isBig) {
                            s = gfx2.CreateBigSprite(item, x + offsetX, offsetY + scaleY * y, true);
                        } else {
                            s = gfx2.CreateSmallSprite(item, x + offsetX, offsetY + scaleY * y, true);
                            if(item === "_strongsoil" || item === "_paddy") { s.scale.y = scaleY; }
                        }
                    }
                    if(s !== null) {
                        s.anchor.y = 1;
                        sprites.push(s);
                    }
                }
                const dirtContainer = gfx2.CreateContainer(dirtParts, false, true);
                const contentContainer = gfx2.CreateContainer(sprites, false, true);
                if(clickHandler !== undefined) {
                    MakeSpriteInteractive(dirtContainer, () => clickHandler(x, y, caller), () => hoverHandler(x, y, caller));
                    MakeSpriteInteractive(contentContainer, () => clickHandler(x, y, caller), () => hoverHandler(x, y, caller));
                }
                dirtContainers.push(dirtContainer);
                itemContainers.push(contentContainer);
            }
        }
        return gfx2.CreateContainer([...dirtContainers, ...itemContainers], false, true);
    }
    /** @param {number} gridX @param {number} gridY @param {number} displayX @param {number} displayY, @param {number} scaleY */
    GetWaterFrames(gridX, gridY, displayX, displayY, scaleY) {
        const res = this.GetWaterInfo(gridX, gridY);
        let sprite = "_lake";
        switch(res) {
            case 1: sprite = "lakeW"; break;
            case 2: sprite = "lakeA"; break;
            case 3: sprite = "lakeWA"; break;
            case 4: sprite = "lakeS"; break;
            case 5: sprite = "lakeWS"; break;
            case 6: sprite = "lakeAS"; break;
            case 7: sprite = "lakeWAS"; break;
            case 8: sprite = "lakeD"; break;
            case 9: sprite = "lakeWD"; break;
            case 10: sprite = "lakeAD"; break;
            case 11: sprite = "lakeWAD"; break;
            case 12: sprite = "lakeDS"; break;
            case 13: sprite = "lakeWSD"; break;
            case 14: sprite = "lakeASD"; break;
            case 15: sprite = "lakeWASD"; break;
            default: sprite = "_lake"; break;
        }
        const sprites = [ gfx2.CreateSmallSprite(sprite, displayX, displayY, true) ];
        if(this.GetWaterInfo(gridX - 1, gridY - 1) < 0 && this.GetWaterInfo(gridX - 1, gridY) > 0 && this.GetWaterInfo(gridX, gridY - 1) > 0) { sprites.push(gfx2.CreateSmallSprite("clakeWA", displayX, displayY, true)); }
        if(this.GetWaterInfo(gridX + 1, gridY - 1) < 0 && this.GetWaterInfo(gridX + 1, gridY) > 0 && this.GetWaterInfo(gridX, gridY - 1) > 0) { sprites.push(gfx2.CreateSmallSprite("clakeWD", displayX, displayY, true)); }
        if(this.GetWaterInfo(gridX - 1, gridY + 1) < 0 && this.GetWaterInfo(gridX - 1, gridY) > 0 && this.GetWaterInfo(gridX, gridY + 1) > 0) { sprites.push(gfx2.CreateSmallSprite("clakeSA", displayX, displayY, true)); }
        if(this.GetWaterInfo(gridX + 1, gridY + 1) < 0 && this.GetWaterInfo(gridX + 1, gridY) > 0 && this.GetWaterInfo(gridX, gridY + 1) > 0) { sprites.push(gfx2.CreateSmallSprite("clakeSD", displayX, displayY, true)); }
        sprites.forEach(s => {
            s.scale.y = scaleY;
            s.anchor.y = 1;
        });
        return sprites;
    }
    /** @param {number} x @param {number} y */
    GetWaterInfo(x, y) {
        let res = 0;
        if(x < 0 || y < 0 || x >= this.width || y >= this.height) { return 0; }
        if(this.grid[x][y] !== "_lake") { return - 1; }
        if(y > 0 && this.grid[x][y - 1] === "_lake") { res += 1; } // W
        if(x > 0 && this.grid[x - 1][y] === "_lake") { res += 2; } // A
        if(y < (this.height - 1) && this.grid[x][y + 1] === "_lake") { res += 4; } // S
        if(x < (this.width - 1) && this.grid[x + 1][y] === "_lake") { res += 8; } // D
        return res;
    }
    /** @param {number} x @param {number} y @param {number} size */
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
            let cornerMult = this.GetSprinklerMultiplier(x + 1, y, 0);
            if(cornerMult < 1) { return cornerMult; }
            cornerMult = this.GetSprinklerMultiplier(x + 1, y + 1, 0);
            if(cornerMult < 1) { return cornerMult; }
            cornerMult = this.GetSprinklerMultiplier(x, y + 1, 0);
            if(cornerMult < 1) { return cornerMult; }
        }
        return 1;
    }
    /** @param {number} x @param {number} y */
    IsSprinkler(x, y) {
        if(x < 0 || y < 0 || x >= this.width || y >= this.height) { return false; }
        if(this.grid[x] === null || this.grid[x] === undefined) { return false; }
        return this.grid[x][y] === "_sprinkler";
    }
}
class NathanFieldInfo extends CropFieldInfo {
    constructor() {
        super(7, 5, "");
        this.grid[0][0] = "_coop";
        this.grid[1][0] = "_coop";
        this.grid[2][0] = "_coop";
        this.grid[4][0] = "_log";
        this.grid[5][0] = "_log";
        this.grid[6][0] = "_log";
        this.grid[0][1] = "_lake";
        this.grid[1][1] = "_lake";
        this.grid[0][2] = "_lake";
        this.grid[1][2] = "_lake";
        this.grid[5][1] = "_beehive";
        this.grid[6][1] = "_beehive";
        this.grid[5][2] = "_beehive";
        this.grid[6][2] = "_beehive";
        this.grid[0][4] = "_paddy";
        this.grid[1][4] = "_paddy";
        this.grid[2][4] = "_paddy";
        this.grid[3][4] = "_paddy";
        this.grid[4][4] = "_paddy";
        this.grid[5][4] = "_paddy";
        this.grid[6][4] = "_paddy";
    }
}


class NewCropDetail {
    /**
     * @param {string} name
     * @param {number} price
     * @param {string} type
     * @param {number} size
     * @param {number} time
     * @param {number} frames
     * @param {number} power
     * @param {number} re
     * @param {number} sp
     * @param {number} su
     * @param {number} au
     * @param {number} wi
     * @param {{ saltClean?:boolean }} addtl
     */
    constructor(name, price, type, size, time, frames, power, re, sp, su, au, wi, addtl) {
        this.name = name;
        this.type = type;
        this.price = price;
        this.displayname = GetText("nm." + name);
        this.size = size;
        this.time = time;
        this.frames = frames;
        this.power = power;
        this.initpower = power;
        this.health = power * 5;
        this.maxhealth = this.health;
        this.defense = power * power * 0.4;
        this.respawn = re;
        this.seasons = [sp || 0, su || 0, au || 0, wi || 0];
        this.saltClean = false;
        this.waterResist = 0;
        this.fireResist = 0;
        this.saltResist = 0;
        if (addtl !== undefined) {
            for (const key in addtl) {
                this[key] = addtl[key];
            }
        }
    }
}

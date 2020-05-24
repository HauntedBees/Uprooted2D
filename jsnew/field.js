class CropFieldInfo {
    /**
     * @param {number} w
     * @param {number} h
     * @param {string} level
     */
    constructor(w, h, level) {
        this.gridWidth = w;
        this.gridHeight = h;
        this.gridLevel = level;
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
        let oldwidth = this.gridWidth;
        let oldheight = this.gridHeight;
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
        this.gridWidth = newWidth;
        this.gridHeight = newHeight;
        this.gridLevel = newLevel;
    }

    /**
     * @param {number} dx
     * @param {number} dy
     * @param {{ (): boolean; (arg0: any): void; }} [clickHandler]
     * @param {{ (x: number, y: number): void; (arg0: number, arg1: number, arg2: any): void; }} [hoverHandler]
     * @param {any} [caller]
     */
    GetFarmDisplayContainer(dx, dy, clickHandler, hoverHandler, caller) {
        const containers = [];
        for(let x = (this.gridWidth - 1); x >= 0; x--) {
            for(let y = (this.gridHeight - 1); y >= 0; y--) {
                const sprites = [];
                sprites.push(gfx2.CreateSmallSprite("dirt", x + dx, y + dy, true));
                const item = this.grid[x][y];
                if(item !== null && !item.coord) {
                    const iteminfo = GetFarmInfo(item);
                    const isBig = (iteminfo.size === 2);
                    if(iteminfo.displaySprite !== undefined) {
                        if(isBig) {
                            sprites.push(gfx2.CreateBigSprite(iteminfo.displaySprite, x + dx, y + dy, true));
                        } else {
                            sprites.push(gfx2.CreateSmallSprite(iteminfo.displaySprite, x + dx, y + dy, true));
                        }
                    } else if(item === "_lake") {
                        sprites.push(...this.GetWaterFrames(x, y, x + dx, y + dy));
                    } else {
                        if(isBig) {
                            sprites.push(gfx2.CreateBigSprite(item, x + dx, y + dy, true));
                        } else {
                            sprites.push(gfx2.CreateSmallSprite(item, x + dx, y + dy, true));
                        }
                    }
                }
                const container = gfx2.CreateContainer(sprites, false, true);
                if(clickHandler !== undefined) { 
                    MakeSpriteInteractive(container, () => clickHandler(caller), () => hoverHandler(x, y, caller));
                }
                containers.push(container);
            }
        }
        return gfx2.CreateContainer(containers, false, true);
    }
    /** @param {number} gx @param {number} gy @param {number} vx @param {number} vy */
    GetWaterFrames(gx, gy, vx, vy) {
        const res = this.GetWaterInfo(gx, gy);
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
        const sprites = [ gfx2.CreateSmallSprite(sprite, vx, vy, true) ];
        if(this.GetWaterInfo(gx - 1, gy - 1) < 0 && this.GetWaterInfo(gx - 1, gy) > 0 && this.GetWaterInfo(gx, gy - 1) > 0) { sprites.push(gfx2.CreateSmallSprite("clakeWA", vx, vy, true)); }
        if(this.GetWaterInfo(gx + 1, gy - 1) < 0 && this.GetWaterInfo(gx + 1, gy) > 0 && this.GetWaterInfo(gx, gy - 1) > 0) { sprites.push(gfx2.CreateSmallSprite("clakeWD", vx, vy, true)); }
        if(this.GetWaterInfo(gx - 1, gy + 1) < 0 && this.GetWaterInfo(gx - 1, gy) > 0 && this.GetWaterInfo(gx, gy + 1) > 0) { sprites.push(gfx2.CreateSmallSprite("clakeSA", vx, vy, true)); }
        if(this.GetWaterInfo(gx + 1, gy + 1) < 0 && this.GetWaterInfo(gx + 1, gy) > 0 && this.GetWaterInfo(gx, gy + 1) > 0) { sprites.push(gfx2.CreateSmallSprite("clakeSD", vx, vy, true)); }
        return sprites;
    }
    /** @param {number} x @param {number} y */
    GetWaterInfo(x, y) {
        let res = 0;
        if(x < 0 || y < 0 || x >= this.gridWidth || y >= this.gridHeight) { return 0; }
        if(this.grid[x][y] !== "_lake") { return - 1; }
        if(y > 0 && this.grid[x][y - 1] === "_lake") { res += 1; } // W
        if(x > 0 && this.grid[x - 1][y] === "_lake") { res += 2; } // A
        if(y < (this.gridHeight - 1) && this.grid[x][y + 1] === "_lake") { res += 4; } // S
        if(x < (this.gridWidth - 1) && this.grid[x + 1][y] === "_lake") { res += 8; } // D
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
        if(x < 0 || y < 0 || x >= this.gridWidth || y >= this.gridHeight) { return false; }
        if(this.grid[x] === null || this.grid[x] === undefined) { return false; }
        return this.grid[x][y] === "_sprinkler";
    }
}
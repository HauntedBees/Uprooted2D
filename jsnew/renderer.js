class Gfx {
    constructor(toRender, loadedFunc) {
        this.mapSize = 1500;
        this.width = 1024; this.height = 896;
        this.tileW = this.width / 64;
        this.tileH = this.height / 64;
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        this.app = new PIXI.Application({width: this.width, height: this.height});
        document.body.appendChild(this.app.view);
        for(let i = 0; i < toRender.length; i++) {
            const elem = toRender[i];
            if(elem.indexOf(".json") > 0) {
                PIXI.Loader.shared.add(elem);
            } else {
                PIXI.Loader.shared.add(elem, "img2/" + elem + ".png");
            }
        }
        PIXI.Loader.shared.load(() => this.LoadComplete(loadedFunc));
        this.mapFragments = {};
    }
    LoadComplete(callback) {
        this.img = {
            mapJunk: PIXI.Loader.shared.resources["gamedata/spritesheets/mapJunk.json"].spritesheet.textures,
            sprites: PIXI.Loader.shared.resources["gamedata/spritesheets/sprites.json"].spritesheet.textures,
            bigSprites: PIXI.Loader.shared.resources["gamedata/spritesheets/bigSprites.json"].spritesheet.textures
        };
        this.TextStyles = {
            "std": {
                fontFamily: "Nevis",
                fontSize: 25
            },
            "stdWhite": {
                fontFamily: "Nevis",
                fontSize: 25,
                fill: "#FFFFFF"
            },
            "stdWhiteBig": {
                fontFamily: "Nevis",
                fontSize: 64,
                fill: "#FFFFFF"
            },
            "cropNo": {
                fontFamily: "Nevis",
                fontSize: 18,
                fill: "#FFFFFF",
                stroke: "#000000",
                strokeThickness: 4
            }
        };
        this.mainContainer = new PIXI.Container();
        this.transitionContainer = new PIXI.Container();
        this.app.stage.addChild(this.mainContainer);
        this.app.stage.addChild(this.transitionContainer);
        callback();
    }

    CreateNPCCharSprite(sx, sy, dir, x, y) {
        const sheets = this.CreateMapCharSpriteSheet(PIXI.utils.TextureCache["mapChar"], sx, sy, 72, 88);
        let s = new PIXI.AnimatedSprite(sheets.standing[dir]);
        s.animationSpeed = 0.1;
        s.loop = false;
        s.play();
        [s.x, s.y] = [x, y];
        s.zIndex = y;
        return { sprite: s, sheets: sheets };
    }
    CreatePlayerMapCharSprite(dir, x, y) {
        const sheets = this.CreateMapCharSpriteSheet(PIXI.utils.TextureCache["mapPlayer"], 0, 0, 72, 88);
        let s = new PIXI.AnimatedSprite(sheets.standing[dir]);
        s.animationSpeed = 0.1;
        s.loop = false;
        s.play();
        [s.x, s.y] = [x, y];
        s.zIndex = y;
        return { sprite: s, sheets: sheets };
    }
    CreateMapCharSpriteSheet(sheet, sx, sy, w, h) {
        const sheets = {
            "standing": [],
            "moving": []
        };
        for(let i = 0; i < 4; i++) {
            sheets.standing.push([new PIXI.Texture(sheet, new PIXI.Rectangle(sx * w + i * w, sy * h, w, h))]);
            sheets.moving.push([
                new PIXI.Texture(sheet, new PIXI.Rectangle(sx * w + i * w, sy * h + h, w, h)),
                new PIXI.Texture(sheet, new PIXI.Rectangle(sx * w + i * w, sy * h + 2 * h, w, h)),
                new PIXI.Texture(sheet, new PIXI.Rectangle(sx * w + i * w, sy * h + 3 * h, w, h)),
                new PIXI.Texture(sheet, new PIXI.Rectangle(sx * w + i * w, sy * h + 2 * h, w, h))
            ]);
        }
        return sheets;
    }

    CreateImg(key, x, y) {
        let s = new PIXI.Sprite(PIXI.utils.TextureCache[key]);
        [s.x, s.y] = [x, y];
        return s;
    }
    CreateMapJunkSprite(key, x, y) {
        let s = new PIXI.Sprite(this.img.mapJunk[key]);
        [s.x, s.y] = [x, y];
        s.zIndex = y;
        return s;
    }
    CreateSmallSprite(key, x, y, fromGrid) {
        let s = new PIXI.Sprite(this.img.sprites[key]);
        if(fromGrid) { x *= 64; y *= 64; }
        [s.x, s.y] = [x, y];
        s.zIndex = y;
        return s;
    }
    CreateBigSprite(key, x, y) {
        let s = new PIXI.Sprite(this.img.bigSprites[key]);
        [s.x, s.y] = [x, y];
        s.zIndex = y;
        return s;
    }

    DrawBox(infoType, x, y, w, h, fromGrid) {
        const sprites = [];
        sprites.push(this.CreateSmallSprite(`${infoType}UL`, x, y, fromGrid));
        sprites.push(this.CreateSmallSprite(`${infoType}DL`, x, y + h, fromGrid));
        sprites.push(this.CreateSmallSprite(`${infoType}UR`, x + w, y, fromGrid));
        sprites.push(this.CreateSmallSprite(`${infoType}DR`, x + w, y + h, fromGrid));
        for(let x2 = x + 1; x2 < x + w; x2++) {
            sprites.push(this.CreateSmallSprite(`${infoType}U`, x2, y, fromGrid));
            sprites.push(this.CreateSmallSprite(`${infoType}D`, x2, y + h, fromGrid));
        }
        for(let y2 = y + 1; y2 < y + h; y2++) {
            sprites.push(this.CreateSmallSprite(`${infoType}L`, x, y2, fromGrid));
            sprites.push(this.CreateSmallSprite(`${infoType}R`, x + w, y2, fromGrid));
        }
        // TODO: different colors
        sprites.push(this.CreateRectangle(0xA36F00, x + 1, y + 1, w - 1, h - 1, fromGrid));
        return this.CreateContainer(sprites);
    }
    CreateRectangle(color, x, y, w, h, fromGrid) {
        if(fromGrid) {
            x *= 64; y *= 64;
            w *= 64; h *= 64;
        } else if(w === undefined) {
            w = this.width;
            h = this.height;
        }
        const rect = new PIXI.Graphics();
        rect.beginFill(color);
        rect.drawRect(x, y, w, h);
        rect.endFill();
        return rect;
    }

    FragmentMap(mapName) {
        const mapImg = PIXI.utils.TextureCache["maps/" + mapName];
        const w = mapImg.width, h = mapImg.height;
        this.mapFragments[mapName] = [];
        for(let y = 0; y < h; y += this.mapSize) {
            const row = [];
            for(let x = 0; x < w; x += this.mapSize) {
                const cw = Math.min(this.mapSize, w - x);
                const ch = Math.min(this.mapSize, h - y);
                row.push(new PIXI.Texture(mapImg, new PIXI.Rectangle(x, y, cw, ch)));
            }
            this.mapFragments[mapName].push(row);
        }
    }
    CreateMap(mapName) {
        if(this.mapFragments[mapName] === undefined) { this.FragmentMap(mapName); }
        const mapSprites = [];
        const map = this.mapFragments[mapName];
        for(let y = 0; y < map.length; y++) {
            const row = map[y];
            for(let x = 0; x < row.length; x++) {
                const s = new PIXI.Sprite(row[x]);
                [s.x, s.y] = [x * this.mapSize, y * this.mapSize];
                mapSprites.push(s);
            }
        }
        return mapSprites;
    }
    
    GetTextInfo(text, styleName) {
        const style = new PIXI.TextStyle(this.TextStyles[styleName]);
        return PIXI.TextMetrics.measureText(text, style);
    }
    WriteText(text, styleName, x, y, alignment) {
        const t = new PIXI.Text(text, new PIXI.TextStyle(this.TextStyles[styleName]));
        [t.x, t.y] = [x, y];
        switch(alignment) {
            case "right": t.anchor.x = 1; break;
            case "center": t.anchor.x = 0.5; break;
            case "left":
            default: t.anchor.x = 0; break;
        }
        return t;
    }
    WriteWrappedText(text, styleName, x, y, maxwidth, alignment) {
        const newStyle = Object.assign({ wordWrap: true, wordWrapWidth: maxwidth, align: alignment }, this.TextStyles[styleName]);
        const t = new PIXI.Text(text, new PIXI.TextStyle(newStyle));
        [t.x, t.y] = [x, y];
        switch(alignment) {
            case "right": t.anchor.x = 1; break;
            case "center": t.anchor.x = 0.5; break;
            case "left":
            default: t.anchor.x = 0; break;
        }
        return t;
    }

    WriteWorldMapText(container, text, onBottom) {
        // TODO: speaker
        const y = (onBottom ? this.tileH - 4 : 0);
        const rect = this.DrawBox("FarmInfo", 0, y, this.tileW - 1, 3, true);
        const textObj = this.WriteWrappedText(text, "std", 20, 64 * y + 20, this.width - 40, "left");
        const textBox = this.CreateContainer([rect, textObj], false, true);
        container.addChild(textBox);
        return textBox;
    }

    /**
     * @param {PIXIObj[]} sprites
     */
    AddToTransitionContainer(sprites) {
        sprites.forEach(s => this.transitionContainer.addChild(s));
    }
    /**
     * @param {PIXIObj[]} sprites
     * @param {boolean} [sortable]
     * @param {boolean} [dontAddToStage]
     * @returns {PIXIObj}
     */
    CreateContainer(sprites, sortable, dontAddToStage) {
        const c = new PIXI.Container();
        sprites.forEach(s => c.addChild(s));
        if(sortable) { c.sortableChildren = true; }
        if(dontAddToStage !== true) {
            this.mainContainer.addChild(c);
        }
        return c;
    }
    /**
     * @param {PIXIObj} container
     */
    RemoveContainer(container) {
        this.mainContainer.removeChild(container);
    }
    /**
     * @param {PIXIObj} container
     */
    EmptyContainer(container) {
        container.children.forEach(e => container.removeChild(e));
    }

    CleanAllContainers() {
        while(this.mainContainer.children.length > 0) {
            this.mainContainer.removeChildAt(0);
        }
    }
}
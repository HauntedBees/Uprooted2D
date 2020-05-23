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
            "stdSmall": {
                fontFamily: "Nevis",
                fontSize: 20
            },
            "stdHeader": {
                fontFamily: "Nevis",
                fontSize: 36,
                fontVariant: "small-caps",
                fontWeight: "bold"
            },
            "stdWhiteHeaderSm": {
                fontFamily: "Nevis",
                fontSize: 32,
                fontVariant: "small-caps",
                fontWeight: "bold",
                fill: "#FFFFFF"
            },
            "stdMedium": {
                fontFamily: "Nevis",
                fontSize: 32
            },
            "stdWhite": {
                fontFamily: "Nevis",
                fontSize: 25,
                fill: "#FFFFFF"
            },
            "stdBig": {
                fontFamily: "Nevis",
                fontSize: 64
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
    /**
     * @param {string} key
     * @param {number} x
     * @param {number} y
     * @param {boolean} [fromGrid]
     * @param {boolean} [centerAlign]
     * @returns {PIXIObj}
     */
    CreateSmallSprite(key, x, y, fromGrid, centerAlign) {
        let s = new PIXI.Sprite(this.img.sprites[key]);
        if(fromGrid) { x *= 64; y *= 64; }
        [s.x, s.y] = [x, y];
        if(centerAlign) { [s.anchor.x, s.anchor.y] = [0.5, 0.5]; }
        s.zIndex = y;
        return s;
    }

    /**
     * @param {string[]} keys
     * @param {number} x
     * @param {number} y
     * @param {boolean} fromGrid
     * @param {boolean} loop
     * @param {boolean} startByDefault
     * @param {number} animationSpeed
     */
    CreateSmallAnimSprite(keys, x, y, fromGrid, loop, startByDefault, animationSpeed) {
        const textures = keys.map(k => this.img.sprites[k]);
        const s = new PIXI.AnimatedSprite(textures);
        if(fromGrid) { x *= 64; y *= 64; }
        [s.x, s.y] = [x, y];
        s.loop = loop;
        s.animationSpeed = animationSpeed || 1;
        if(startByDefault) { s.play(); }
        return s;
    }

    /**
     * @param {any[]} itemInfo
     * @param {number} x
     * @param {number} y
     * @param {boolean} fromGrid
     */
    CreateInventoryItem(itemInfo, x, y, fromGrid) {
        const item = itemInfo[0];
        let spriteName = itemInfo[0];
        if(item[0] !== "_" && item[0] !== "!") {
            const crop = GetCrop(item);
            if(crop.showSeed) { spriteName += "seed"; }
        }
        const sprite = gfx2.CreateSmallSprite(spriteName, x, y, fromGrid);
        if(fromGrid) { x *= 64; y *= 64; }
        const text = gfx2.WriteText("x" + itemInfo[1], "cropNo", x + 64, y + 38, "right");
        return gfx2.CreateContainer([sprite, text], false, true);
    }
    /**
     * @param {{ power: number; seasons: string[]; type: any; size: string; time: number; displayname: string; respawn: number; waterResist: string; fireResist: string; stickChance: string; saltResist: string; saltClean: any; animal: string | number; name: any; }} crop
     * @param {string} fontStyle
     * @param {boolean} ignoreSun
     * @param {number} x
     * @param {number} y
     * @param {number} rightSide
     * @param {number} maxTextWidth
     * @param {boolean} drawTop
     * @returns {PIXIObj}
     */
    DrawCropInfo(crop, fontStyle, ignoreSun, x, y, rightSide, maxTextWidth, drawTop) {
        const elements = [];

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

        if(drawTop) {
            elements.push(gfx2.CreateSmallSprite(crop.name, x, y, false));
            elements.push(gfx2.WriteText(crop.displayname, fontStyle + "Header", x + 80, y + 12, "left"));
            elements.push(gfx2.CreateSmallSprite(cropSprite, x + rightSide, y, false));
            elements.push(gfx2.WriteText(crop.size, "cropNo", x + rightSide + 56, y - 10));
            y += 80;
        } else {
            elements.push(gfx2.CreateSmallSprite(cropSprite, x + 840, y));
            elements.push(gfx2.WriteText(crop.size, "cropNo", x + 896, y - 10));
        }
        const dx = ignoreSun ? 0 : 64;
        if(!ignoreSun) {
            elements.push(gfx2.CreateSmallSprite("inv_power", x, y, false));
        }
        const numStars = crop.power / 2, starDx = 64;
        if(numStars > 5) {
            for(let i = 0; i < 5; i++) {
                elements.push(gfx2.CreateSmallSprite("starMax", dx + x + 1 + i * starDx, y, false));
            }
        } else {
            for(let i = 0; i < numStars; i++) {
                elements.push(gfx2.CreateSmallSprite("starFull", dx + x + 1 + i * starDx, y, false));
            }
            if(numStars % 1 !== 0) { elements.push(gfx2.CreateSmallSprite("starHalf", dx + x + 1 + (numStars - 0.5) * starDx, y, false)); }
            for(let i = Math.ceil(numStars); i < 5; i++) {
                elements.push(gfx2.CreateSmallSprite("starNone", dx + x + 1 + i * starDx, y, false));
            }
        }

        const seasons = ["winter", "autumn", "summer", "spring"];
        for(let i = 3; i >= 0; i--) { elements.push(gfx2.CreateSmallSprite(seasons[i] + crop.seasons[i], x + rightSide - 64 * i, y)); }

        elements.push(gfx2.CreateSmallSprite("inv_time", x, y + 69));
        elements.push(gfx2.GetThinNumber(crop.time, fontStyle, x + 72, y + 65));
        if(crop.respawn > 0) {
            elements.push(gfx2.CreateSmallSprite("inv_regrow", x + 168, y + 69));
            elements.push(gfx2.GetThinNumber(crop.respawn, fontStyle, x + 232, y + 65));
        }
        
        const bonusesToPush = [];
        if(crop.waterResist) { bonusesToPush.push("waterIco" + crop.waterResist); }
        if(crop.fireResist) { bonusesToPush.push("fireIco" + crop.fireResist); }
        if(crop.stickChance) { bonusesToPush.push("stunIco" + crop.stickChance); }
        if(crop.saltResist) { bonusesToPush.push("saltIco" + crop.saltResist); }
        if(crop.saltClean) { bonusesToPush.push("saltIcoX"); }
        if(crop.animal) { bonusesToPush.push(animalInfo[crop.animal].invSprite); }
        for(let i = 0; i < bonusesToPush.length; i++) {
            elements.push(gfx2.CreateSmallSprite(bonusesToPush[i], x + rightSide - i * 64, y + 69));
        }
        elements.push(gfx2.WriteWrappedText(GetText(crop.name), fontStyle + (drawTop ? "Medium" : ""), x - 12, y + 150, maxTextWidth, "left"));

        return gfx2.CreateContainer(elements, false, true);
    }
    /**
     * @param {number} i
     * @param {string} fontStyle
     * @param {number} x
     * @param {number} y
     * @returns {PIXIObj}
     */
    GetThinNumber(i, fontStyle, x, y) {
        let dispNum = "";
        if(i === -1 || i === 999) { // NOTE: -1 vs 999 what is the diff?
            dispNum = "??";
        } else if(i < 10) {
            dispNum = " " + i.toString();
        } else {
            dispNum = i.toString();
        }
        const thinNo = gfx2.WriteText(dispNum, fontStyle + "Big", x, y);
        thinNo.width = 64;
        return thinNo;
    }

    /**
     * @param {string} key
     * @param {number} x
     * @param {number} y
     * @returns {PIXIObj}
     */
    CreateBigSprite(key, x, y) {
        let s = new PIXI.Sprite(this.img.bigSprites[key]);
        [s.x, s.y] = [x, y];
        s.zIndex = y;
        return s;
    }

    /** @param {string} key */
    CreateTiledSpriteContainer(key) {
        const tiles = [];
        for(let x = 0; x < game2.tilew; x++) {
            for(let y = 0; y < game2.tileh; y++) {
                tiles.push(gfx2.CreateSmallSprite(key, x, y, true));
            }
        }
        return gfx2.CreateContainer(tiles);
    }

    /**
     * @param {string} infoType
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {boolean} fromGrid
     */
    DrawBox(infoType, x, y, w, h, fromGrid) {
        const sprites = [];
        // TODO: different colors
        const delta = fromGrid ? 1 : 64;
        sprites.push(this.CreateRectangle(0xA36F00, x + delta, y + delta, w - delta, h - delta, fromGrid));
        sprites.push(this.CreateSmallSprite(`${infoType}UL`, x, y, fromGrid));
        sprites.push(this.CreateSmallSprite(`${infoType}DL`, x, y + h, fromGrid));
        sprites.push(this.CreateSmallSprite(`${infoType}UR`, x + w, y, fromGrid));
        sprites.push(this.CreateSmallSprite(`${infoType}DR`, x + w, y + h, fromGrid));
        for(let x2 = x + delta; x2 < x + w; x2 += delta) {
            sprites.push(this.CreateSmallSprite(`${infoType}U`, x2, y, fromGrid));
            sprites.push(this.CreateSmallSprite(`${infoType}D`, x2, y + h, fromGrid));
        }
        for(let y2 = y + delta; y2 < y + h; y2 += delta) {
            sprites.push(this.CreateSmallSprite(`${infoType}L`, x, y2, fromGrid));
            sprites.push(this.CreateSmallSprite(`${infoType}R`, x + w, y2, fromGrid));
        }
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
    /**
     * @param {string} text
     * @param {string} styleName
     * @param {number} x
     * @param {number} y
     * @param {string} [alignment]
     * @returns {PIXIObj}
     */
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
    /**
     * @param {string} text
     * @param {string} styleName
     * @param {number} x
     * @param {number} y
     * @param {number} maxwidth
     * @param {string} alignment
     */
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
    WriteWrappedMultiFormatText(text, defaultStyle, formats, x, y, maxwidth, alignment) {
        const newStyle = Object.assign({ wordWrap: true, wordWrapWidth: maxwidth, align: alignment }, this.TextStyles[defaultStyle]);
        formats["default"] = newStyle;
        const t = new MultiStyleText(text, formats);
        [t.x, t.y]  = [x, y];
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
        container.children.forEach(e => { e.visible = false; container.removeChild(e) });
    }

    CleanAllContainers() {
        while(this.mainContainer.children.length > 0) {
            this.mainContainer.removeChildAt(0);
        }
    }
}
class WorldEntityBase {
    /**
     * @param {PIXIObj} container
     * @param {string} prefix
     * @param {{ x: number; y: number; }} pos
     * @param {number} dir
     */
    constructor(container, prefix, pos, dir) {
        this.container = container;
        this.prefix = prefix;
        this.name = "";
        this.neverClear = false;
        this.pos = {
            x: pos.x * 16,
            y: pos.y * 16
        };
        this.importantKey = "";
        this.dir = dir;
        this.moving = false;
        this.currentDir = this.dir;
        this.forceY = false;
        this.forceX = false;
        this.padBottom = false;
        this.noCollision = false;
        this.sprite = {};
        this.sheets = {};
        this.noChange = false;
        this.persist = false;
        this.ignoreZ = false;
        this.passiveInteract = false;
        this.immediateInteract = false;
        /** @type {Interaction} */
        this.interact = undefined;
        this.forcedAnimation = false;
    }
    /**
     * @param {{ x: any; y: any }} pos
     */
    SetPos(pos) {
        this.pos = pos;
        this.sprite.position.set(pos.x, pos.y);
        this.ResetZIndex();
        this.sprite.zIndex = pos.y + (this.ignoreZ ? 0 : this.sprite.height);
    }
    /**
     * @param {PIXIObj} sprite
     */
    SetSprite(sprite) {
        this.sprite = sprite;
        this.ResetZIndex();
        this.container.addChild(sprite);
    }
    ResetZIndex() {
        this.sprite.zIndex = this.pos.y + (this.ignoreZ ? 0 : this.sprite.height);
    }
    Update() {
        if(this.forcedAnimation) { return; }
        if(this.moving) {
            if(this.sprite.playing && this.currentDir === this.dir) { return; }
            this.sprite.textures = this.sheets.moving[this.dir];
            this.sprite.play();
            this.currentDir = this.dir;
        } else {
            this.sprite.textures = this.sheets.standing[this.dir];
        }
    }
    /** @param {string} animName */
    ForceAnimation(animName) {
        this.forcedAnimation = true;
        this.sprite.textures = this.sheets[animName];
        this.sprite.loop = true;
        this.sprite.play();
    }
    UnforceAnimation() {
        this.sprite.loop = false;
        this.forcedAnimation = false;
    }
    PauseAnimation() {
        this.sprite.gotoAndStop(0);
    }
    ResumeAnimation() {
        this.sprite.play();
    }
    /**
     * @param {boolean} [isInteract]
     */
    GetBounds(isInteract) {
        const width = this.sprite.width / ((isInteract || this.forceX) ? 2 : 3);
        const height = this.sprite.height / ((isInteract || this.forceY) ? 2 : 3) - (this.padBottom ? 32 : 0);
        return [width, height];
    }
}
class WorldPlayer extends WorldEntityBase {
    /**
     * @param {PIXIObj} container
     * @param {{ x: number; y: number; }} pos
     * @param {number} dir
     */
    constructor(container, pos, dir) {
        super(container, "", pos, dir);
        const spriteInfo = gfx2.CreatePlayerMapCharSprite(this.dir, this.pos.x, this.pos.y);
        this.sprite = spriteInfo.sprite;
        this.sheets = spriteInfo.sheets;
        this.lastInn = "start";
        this.importantKey = "player";
        this.container.addChild(this.sprite);
        switch(this.dir) {
            case 0: this.moveDir = 1; break;
            case 1: this.moveDir = 2; break;
            case 2: this.moveDir = 4; break;
            case 3: this.moveDir = 8; break;
        }
    }
}
class WorldNotPlayer extends WorldEntityBase {
    /**
     * @param {string} textKey
     * @param {any} [extra]
     */
    CreateOneSpeakInteraction(textKey, extra) {
        this.interact = new SingleInteraction(textKey);
    }
    /**
     * @param {string} cutsceneKey
     */
    CreateSequenceInteraction(cutsceneKey) {
        this.interact = new SequenceInteraction(cutsceneKey);
    }
}
class WorldNPC extends WorldNotPlayer {
    /**
     * @param {PIXIObj} container
     * @param {string} name
     * @param {number} sx
     * @param {number} sy
     * @param {EntityJSONPoint} pos
     * @param {number} dir
     * @param {EntityJSONAdditionalFrames[]} additionalAnimations
     */
    constructor(container, name, sx, sy, pos, dir, additionalAnimations) {
        super(container, "", pos, dir);
        const spriteInfo = gfx2.CreateNPCCharSprite(sx, sy, this.dir, this.pos.x, this.pos.y, additionalAnimations);
        this.name = name;
        this.SetSprite(spriteInfo.sprite);
        this.sheets = spriteInfo.sheets;
        this.moveDir = this.dir;
    }
}
class WorldMapJunk extends WorldNotPlayer {
    /**
     * @param {PIXIObj} container
     * @param {string} name
     * @param {{ x: number; y: number; }} pos
     * @param {string} key
     */
    constructor(container, name, pos, key) {
        super(container, "", pos, 0);
        this.name = name;
        
        this.SetSprite(gfx2.CreateMapJunkSprite(key, this.pos.x, this.pos.y));
        this.persist = this.sprite.width > 100 || this.sprite.height > 100;
    }
    Update() { }
}
class WorldSheetObj extends WorldNotPlayer {
    /**
     * @param {PIXIObj} container
     * @param {string} name
     * @param {{ x: number; y: number; }} pos
     * @param {string} key
     */
    constructor(container, name, pos, key) {
        super(container, "", pos, 0);
        this.name = name;
        this.SetSprite(gfx2.CreateSmallSprite(key, this.pos.x, this.pos.y));
    }
    Update() { }
}
class WorldInvisibleObj extends WorldNotPlayer {
    /**
     * @param {PIXIObj} container
     * @param {string} name
     * @param {{ x: number; y: number; }} pos
     * @param {number} width
     * @param {number} height
     */
    constructor(container, name, pos, width, height) {
        super(container, "", pos, 0);
        this.name = name;
        this.sprite = {
            x: this.pos.x,
            y: this.pos.y,
            width: width,
            height: height
        };
    }
    Update() { }
}
class WorldShopEnter extends WorldInvisibleObj {
    /**
     * @param {PIXIObj} container
     * @param {string} name
     * @param {{ x: number; y: number; }} pos
     * @param {string} shop
     */
    constructor(container, name, pos, shop) {
        super(container, name, pos, 64, 64);
        this.SetSprite(gfx2.CreateSmallSprite("transWake", this.pos.x, this.pos.y));
        this.shopName = shop;
        this.interact = new ShopInteraction(shop);
        this.noCollision = true;
        this.passiveInteract = true;
    }
}
class WorldAutoplay extends WorldInvisibleObj {
    /**
     * @param {PIXIObj} container
     * @param {string} key
     */
    constructor(container, key) {
        super(container, key, { x: -1, y: -1 }, 64, 64);
        this.SetSprite(gfx2.CreateSmallSprite("transWake", this.pos.x, this.pos.y));
        this.key = key;
        this.immediateInteract = true;
        this.interact = new SequenceInteraction(key);
    }
}
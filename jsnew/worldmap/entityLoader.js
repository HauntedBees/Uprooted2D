class EntityJSONPoint {
    constructor() {
        this.x = 0;
        this.y = 0;
    }
}
class EntityJSONAdditionalFrames {
    constructor() {
        this.name = "";
        this.frames = [ new EntityJSONPoint()];
    }
}
class EntityJSON {
    constructor() {
        this.type = "";
        this.name = "";
        this.sx = 0;
        this.sy = 0;
        this.pos = new EntityJSONPoint();
        this.dir = 0;
        this.sprite = "";
        this.forceX = false;
        this.forceY = false;
        this.noCollision = false;
        this.width = 0;
        this.height = 0;
        this.shop = "";
        this.oneSpeak = "";
        this.cutscene = "";
        this.padBottom = false;
        this.noZ = false;
        this.importantKey = "";
        this.additionalAnimations = [new EntityJSONAdditionalFrames()];
        this.destPos = new EntityJSONPoint();
        this.destMap = "";
        this.destDir = 0;
        this.showIf = "";
        this.noChange = false;
        this.hidden = false;
        this.big = false;
    }
}
class EntityLoader {
    /**
     * @param {string} mapName
     * @param {PIXIObj} container
     * @param {(e: WorldNotPlayer[]) => void} callback
     */
    constructor(mapName, container, callback) {
        // TODO: map cache shit
        this.ready = false;
        this.container = container;
        /** @type {any[]} */
        this.data = [];
        const request = new XMLHttpRequest();
        request.open("GET", `gamedata/entities/${mapName}.json`);
        request.responseType = "json";
        request.send();
        request.onload = () => {
            this.ready = true;
            this.data = request.response;
            this.ProcessEntities(request.response, callback);
        };
    }
    /**
     * @param {any[]} entities
     * @param {(e: WorldEntityBase[]) => void} callback
     */
    ProcessEntities(entities, callback) {
        const entitiesToSkip = game2.player.clearedEntities;
        const processedEntities = [];
        for(let i = 0; i < entities.length; i++) {
            /** @type {EntityJSON} */
            const e = entities[i];
            // TODO: save file shit?
            if(entitiesToSkip.indexOf(e.name) >= 0) { continue; }
            if(e.showIf !== undefined) {
                if(!this.CheckConditional(e.showIf)) { continue; }
            }
            let createdEntity = null;
            // TODO: rabbit shit
            if(e.type === "autoplay") {
                createdEntity = new WorldAutoplay(this.container, e.name);
            } else if(e.type === "NPC") {
                // TODO: big logic
                // TODO: move to talk
                createdEntity = new WorldNPC(this.container, e.name, e.sx, e.sy, e.pos, e.dir, e.big, e.additionalAnimations);
            } else if(e.type === "mapJunk") {
                createdEntity = new WorldMapJunk(this.container, e.name, e.pos, e.sprite);
                createdEntity.forceX = e.forceX || false;
                createdEntity.forceY = e.forceY || false;
                createdEntity.noCollision = e.noCollision || false;
            } else if(e.type === "sheetObj") {
                createdEntity = new WorldSheetObj(this.container, e.name, e.pos, e.sprite);
            } else if(e.type === "invisible") {
                createdEntity = new WorldInvisibleObj(this.container, e.name, e.pos, e.width, e.height);
                createdEntity.forceX = e.forceX || false;
                createdEntity.forceY = e.forceY || false;
            } else if(e.type === "shop") {
                createdEntity = new WorldShopEnter(this.container, e.name, e.pos, e.shop);
            } else if(e.type === "changeMap") {
                createdEntity = new WorldTransferMap(this.container, e.name, e.pos, e.width, e.height, e.destMap, e.destPos, e.destDir);
            }
            if(e.hidden) { createdEntity.SetVisibility(true); }
            if(e.oneSpeak !== undefined) {
                createdEntity.CreateOneSpeakInteraction(e.oneSpeak);
            }
            if(e.cutscene !== undefined) {
                createdEntity.CreateSequenceInteraction(e.cutscene);
            }
            createdEntity.padBottom = e.padBottom || false;
            if(e.noZ === true) {
                createdEntity.ignoreZ = true;
                createdEntity.ResetZIndex();
            }
            if(e.noChange === true) { createdEntity.noChange = true; }
            if(e.importantKey !== undefined) {
                createdEntity.importantKey = e.importantKey;
            }
            if(createdEntity !== null) {
                processedEntities.push(createdEntity);
            }
        }
        // TODO: random enemies
        callback(processedEntities);
    }
    /** @param {string} showIfStr */
    CheckConditional(showIfStr) {
        showIfStr = showIfStr.replace(/player\./g, "game2.player.");
        console.log('"use strict"; return (' + showIfStr + ');');
        const val = Function('"use strict"; return (' + showIfStr + ');')();
        return val === true;
    }
}
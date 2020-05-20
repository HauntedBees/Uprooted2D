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
        const processedEntities = [];
        for(let i = 0; i < entities.length; i++) {
            const e = entities[i];
            let createdEntity = null;
            // TODO: rabbit shit
            // TODO: save file shit
            if(e.type === "NPC") {
                // TODO: big logic
                // TODO: move to talk
                createdEntity = new WorldNPC(this.container, e.name, e.sx, e.sy, e.pos, e.dir);
            } else if(e.type === "mapJunk") {
                createdEntity = new WorldMapJunk(this.container, e.name, e.pos, e.sprite);
                createdEntity.forceX = e.forceX || false;
                createdEntity.forceY = e.forceY || false;
                createdEntity.noCollision = e.noCollision || false;
            } else if(e.type === "sheetObj") {
                createdEntity = new WorldSheetObj(this.container, e.name, e.pos, e.sprite);
            } else if(e.type === "invisible") {
                createdEntity = new WorldInvisibleObj(this.container, e.name, e.pos, e.width, e.height);
            } else if(e.type === "shop") {
                createdEntity = new WorldShopEnter(this.container, e.name, e.pos, e.shop);
            }
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
            if(createdEntity !== null) {
                processedEntities.push(createdEntity);
            }
        }
        // TODO: random enemies
        callback(processedEntities);
    }
}
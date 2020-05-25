class PreviousWorldState {
    /**
     * @param {string} mapName
     * @param {PIXIObj[]} map
     * @param {WorldPlayer} player
     * @param {WorldEntityBase[]} animEntities
     * @param {{ map: PIXIObj; characters: PIXIObj; text: PIXIObj; }} gfxContainers
     */
    constructor(mapName, map, player, animEntities, gfxContainers) {
        this.mapName = mapName;
        this.player = player;
        this.animEntities = animEntities;
        this.gfxContainers = gfxContainers;
        this.map = map;
    }
    CleanUp() {
        console.log("CLEANING UP!");
    }
}

class WorldScreen extends GameScreen {
    /** @param {{ init: any; map: string; playerDir?: number; returning?: boolean; returnDir?: number }} args */
    constructor(args) {
        super();
        this.forceMove = false;
        this.forcedY = -1;
        this.runState = 0;
        this.runPressStart = -1;
        this.savedImage = "";
        //this.waitForAnimation = false; // might be useless
        this.freeMovement = true;

        if(args.returning === true) {
            const state = game2.previousWorldState;
            this.mapName = state.mapName;
            this.map = state.map;
            this.gfxContainers = state.gfxContainers;
            this.player = state.player;
            this.player.moving = false;
            if(args.returnDir !== undefined) { this.player.dir = args.returnDir; }
            this.player.Update();
            this.animEntities = state.animEntities;
        } else {
            this.mapName = args.map;
            this.map = gfx2.CreateMap(args.map);
            this.gfxContainers = {
                "map": gfx2.CreateContainer(this.map, true, true),
                "characters":  gfx2.CreateContainer([], true, true),
                "text":  gfx2.CreateContainer([], true, true)
            };
            this.player = new WorldPlayer(this.gfxContainers["characters"], args.init, args.playerDir === undefined ? 2 : args.playerDir);
            /** @type {WorldEntityBase[]} */
            this.animEntities = [ this.player ];
    
            new EntityLoader("farm", this.gfxContainers["characters"], e => { this.EntitiesLoaded(e) });
        }
        this.fullContainer = gfx2.CreateContainer([this.gfxContainers["map"], this.gfxContainers["characters"]]);
        this.textContainer = gfx2.CreateContainer([this.gfxContainers["text"]]);
        this.RefreshMap();

        this.inDialogue = false;
        this.dialogState = 0;
        this.forceEndDialog = false;
        this.dialogData = null;

        this.inWaterfall = false;
        this.importantEntities = {};
        this.allowLateStart = true;
        this.hijackedPos = undefined;

        const me = this;
        this.updateIdx = setInterval(function() { me.Update(); }, 16);

        // TODO: cave shit
        // TODO: autoplay shit
    }
    /**
     * @param {WorldNotPlayer[]} entities
     */
    EntitiesLoaded(entities) {
        this.animEntities.push(...entities);
        const importantEntities = entities.filter(e => e.importantKey !== "");
        importantEntities.forEach(e => { this.importantEntities[e.importantKey] = e; });
        const autoplays = entities.filter(e => e.immediateInteract);
        if(autoplays.length === 0) { return; }
        game2.target = autoplays[0];
        game2.target.interact.Start(this);
    }
    /** @param {WorldEntityBase} [newTarget] */
    ClearTarget(newTarget) {
        if(newTarget !== undefined) { game2.target = newTarget; }
        if(game2.target) {
            if(game2.target.name[0] !== "~" && !game2.target.neverClear) {
                game2.player.clearedEntities.push(game2.target.name);
            }
            const idx = this.animEntities.indexOf(game2.target);
            if(idx >= 0) { this.animEntities.splice(idx, 1); }
        }
        game2.target = null;
    }
    CleanUp() {
        if(game2.previousWorldState !== null && game2.previousWorldState.mapName !== this.mapName) {
            game2.previousWorldState.CleanUp();
        }
        game2.previousWorldState = new PreviousWorldState(this.mapName, this.map, this.player, this.animEntities, this.gfxContainers);
        clearInterval(this.updateIdx);
    }
    /**
     * @param {string} key
     */
    KeyPress(key) {
        /*if(this.inWaterfall || this.fullAnimIdx <= 0 || game.transitioning) { this.ToggleRun(false); return false; }*/
        if(this.inDialogue) {
            if(key === this.controls["confirm"] && this.controls.IsFreshKeyPress("confirm")) {
                game2.target.interact.Advance(this);
            }
            /*this.freeMovement = false;
            this.ToggleRun(false);
            input.clearAllKeys();
            if(this.dialogData === null) { 
                return (key === player.controls.confirm || key === player.controls.pause) ? this.click(null) : false;
            }
            return this.handleMenuChoices(key);*/
            return;
        }
        this.freeMovement = true;
        switch(key) {
            case this.controls["confirm"]:
                if(this.controls.IsFreshKeyPress("confirm")) {
                    this.TryPlayerInteraction();
                }
                //this.ToggleRun(false);
                break;
            case this.controls["pause"]: 
                //this.ToggleRun(false);
                //worldmap.savedImage = gfx.getSaveFileImage();
                sound.PlaySound("pauseI", true);
                game2.Transition(PauseMenuScreen);
                //game.transition(this, pausemenu);
                return;
            case this.controls["cancel"]: 
                //if(this.inDialogue) { return; }
                //if(this.smartphone !== null && this.smartphone.Dismiss() > 0) { return; }
        }
        return true;
    }
    RefreshMap() {
        // Center on Player
        const hx = gfx2.app.screen.width / 2, hy = gfx2.app.screen.height / 2;
        const cx = MathB.Clamp(hx - this.player.sprite.x - this.player.sprite.width / 2, 0, -hx);
        const cy = MathB.Clamp(hy - this.player.sprite.y - this.player.sprite.height / 2, 0, -hy);
        this.fullContainer.position.set(cx, cy);
        // Hide Off-Screen Sprites and show On-Screen Sprites
        const mapSize = gfx2.mapSize / 2;
        const mapPadding = mapSize * 1.5;
        const mapBounds = { left: -mapSize, right: 2 * hx + mapSize, top: -mapSize, bottom: 2 * hy + mapSize };
        const playerBounds = { left: this.player.sprite.x - mapPadding, right: this.player.sprite.x + mapPadding, top: this.player.sprite.y - mapPadding, bottom: this.player.sprite.y + mapPadding };
        const p = new PIXI.Point(0, 0);
        this.map.forEach(map => {
            const pos = map.toGlobal(p);
            map.visible = (pos.x + mapSize) >= mapBounds.left && (pos.x - mapSize) <= mapBounds.right && (pos.y + mapSize) >= mapBounds.top && (pos.y - mapSize) <= mapBounds.bottom;
        });
        this.animEntities.forEach(e => {
            if(e.persist) { return; }
            e.sprite.visible = e.sprite.x >= playerBounds.left && e.sprite.x <= playerBounds.right && e.sprite.y >= playerBounds.top && e.sprite.y <= playerBounds.bottom;
        });
    }
    Update() {
        if(game2.transitionAnim !== null && game2.transitionAnim.active) { return; }
        this.UpdatePlayer();
        this.animEntities.forEach(e => e.Update());
        this.RefreshMap();
    }
    UpdatePlayer() {
        const disallowPlayerMove = false;//(this.inWaterfall || this.fullAnimIdx <= 0 || game.transitioning);
        if(this.inDialogue || this.forceMove || disallowPlayerMove) { return; }

        let newPlayerMoveDir = 0;
        this.player.moveDir = 0;
        if(this.controls.justPressed[this.controls["up"]] >= 0) { newPlayerMoveDir += 1; this.player.dir = 0; }
        if(this.controls.justPressed[this.controls["left"]] >= 0) { newPlayerMoveDir += 2; this.player.dir = 1; }
        if(this.controls.justPressed[this.controls["down"]] >= 0) { newPlayerMoveDir += 4; this.player.dir = 2; }
        if(this.controls.justPressed[this.controls["right"]] >= 0) { newPlayerMoveDir += 8; this.player.dir = 3; }
        if(newPlayerMoveDir !== 0) { this.player.moveDir = newPlayerMoveDir; }

        const PLAYERMOVESPEED = 8;

        let dx = (this.player.moveDir & 2) === 2 ? -PLAYERMOVESPEED : ((this.player.moveDir & 8) === 8 ? PLAYERMOVESPEED : 0);
        let dy = (this.player.moveDir & 1) === 1 ? -PLAYERMOVESPEED : ((this.player.moveDir & 4) === 4 ? PLAYERMOVESPEED : 0);
        if(dx === 0 && dy === 0) {
            this.player.moving = false;
        } else {
            this.player.moving = true;
            if(dx !== 0 && dy !== 0) { dx *= 0.85; dy *= 0.85; }
            const newPos = { x: this.player.pos.x + dx, y: this.player.pos.y + dy, width: this.player.sprite.width, height: this.player.sprite.height };
            let hasCollisions = this.HasAnyCollision(newPos);
            if(typeof hasCollisions === "object") {
                if(hasCollisions.interact.Start(this)) { // some interactions might not actually execute (i.e. walking sideways by a shop entrance)
                    hasCollisions = true; // but if they DO execute, prevent the player from walking into the object
                }
            } else if(hasCollisions === true && dx !== 0 && dy !== 0) { // allow sliding across walls when walking diagonally
                newPos.x = this.player.pos.x;
                if(!this.HasAnyCollision(newPos)) {
                    hasCollisions = false;
                } else {
                    newPos.x = this.player.pos.x + dx;
                    newPos.y = this.player.pos.y;
                    if(!this.HasAnyCollision(newPos)) {
                        hasCollisions = false;
                    }
                }
            }
            if(hasCollisions === true) { return; }
            this.player.SetPos(newPos);
        }
    }
    TryPlayerInteraction() {
        let dx = 0, dy = 0;
        switch(this.player.dir) {
            case 0: dy = -8; break;
            case 1: dx = -8; break;
            case 2: dy = 8; break;
            case 3: dx = 8; break;
        }
        const newPos = { x: this.player.pos.x + dx, y: this.player.pos.y + dy, width: this.player.sprite.width, height: this.player.sprite.height };
        let didInteract = false;
        for(let i = 1; i < this.animEntities.length; i++) {
            const target = this.animEntities[i];
            if(target.interact !== undefined && this.CanInteract(newPos, target)) {
                didInteract = true;
                if(!target.noChange) { target.dir = this.InvertDir(this.player.dir); }
                this.inDialogue = true;
                this.forceEndDialog = false;
                // worldmap.toggleMovement(false);
                this.dialogState = 0;
                game2.target = target;
                target.interact.Start(this);
                /*if(player.failedEntities.indexOf(game.target.name) >= 0 && e.failedInteract !== undefined) {
                    if(e.failedInteract[0](true, e)) { return; }
                } else {
                    if(e.interact[0](true, e)) { return; }
                }*/
            }
        }
        //if(!didInteract && worldmap.smartphone !== null) { return worldmap.smartphone.Read(); }
    }
    /**
     * @param {string} textKey
     * @param {any} [choices]
     * @param {string | string[]} [formatting]
     */
    WriteText(textKey, choices, formatting) {
        gfx2.EmptyContainer(this.textContainer.children[0]);
        let text = GetText(textKey);
        if(text === "") { return; }
        if(formatting) {
            if((typeof formatting) === "string") {
                text = text.replace("{0}", formatting);
            } else {
                //formatArray = true;
                for(let i = 0; i < formatting.length; i++) {
                    text = text.replace(`{${i}}`, formatting[i]);
                }
            }
        } else if(text.indexOf("{seeds}") >= 0) {
            /*let actualSeedCounts = {};
            for(let i = 0; i < player.nathanSeeds.length; i++) {
                const seedInfo = player.nathanSeeds[i];
                if(actualSeedCounts[seedInfo[0]] === undefined) { actualSeedCounts[seedInfo[0]] = 0; }
                actualSeedCounts[seedInfo[0]] += seedInfo[1];
            }
            let seedStrArr = [];
            for(const crop in actualSeedCounts) {
                seedStrArr.push(HandleGifts(crop, actualSeedCounts[crop]));
            }
            actualText = HandleLists(actualText, "{seeds}", seedStrArr, "falconNoGifts", true, true);*/
        }
        //text = text.replace(/\{g\}/g, player.monies);
        if(text.indexOf(":") > 0) {
            const speaker = text.split(":")[0];
            if(speaker.split(" ").length < 5) { // if it's this many, it's probably just a colon in text and not a speaker separator
                //gfx.DrawBackingBox(speaker, 6, 2 + drawY * 16);
            }
        }
        gfx2.WriteWorldMapText(this.gfxContainers["text"], text, this.player.pos.y < 260);
        //document.getElementById("screenRead").innerText = text;
        //document.getElementById("screenRead").focus();
        console.log(text);
        // TODO: choices
    }
    FinishInteraction() { // dontCancelRun
        this.forceEndDialog = false;
        this.inDialogue = false;
        this.freeMovement = true;
        gfx2.EmptyContainer(this.textContainer.children[0]);
        this.forceMove = false;
        // togglemovement shit
        // fixture tutorial shit 
    }

    /**
     * @param {number} dir
     */
    InvertDir(dir) {
        switch(dir) {
            case 0: return 2;
            case 1: return 3;
            case 2: return 0;
            case 3: return 1;
        }
    }
    /**
     * @param {{ x: number; y: number; width: any; height: any; }} newPos
     * @returns {boolean | WorldEntityBase}
     */
    HasAnyCollision(newPos) {
        /** @type {boolean | WorldEntityBase} */
        let response = false;
        for(let i = 1; i < this.animEntities.length; i++) {
            if(this.HasCollision(newPos, this.animEntities[i])) {
                if(this.animEntities[i].passiveInteract) {
                    response = this.animEntities[i];
                } else if(response === false) {
                    response = true;
                }
            }
        }
        return response;
    }
    /**
     * @param {{ x: any; y: any; width: any; height: any; }} player
     * @param {WorldEntityBase} other
     */
    HasCollision(player, other) {
        if(other.noCollision && !other.passiveInteract) { return false; }
        const [ahw, ahh] = [player.width / 3, player.height / 4];
        const [bhw, bhh] = other.GetBounds();
        const [ax, ay] = [player.x + ahw, player.y + ahh];
        const [bx, by] = [other.sprite.x + bhw, other.sprite.y + bhh];

        const [dx, dy] = [ax - bx, ay - by];
        const [sw, sy] = [ahw + bhw, ahh + bhh];
        return Math.abs(dx) < sw && Math.abs(dy) < sy;
    }
    /**
     * @param {{ x: any; y: any; width: any; height: any; }} player
     * @param {WorldEntityBase} other
     */
    CanInteract(player, other) {
        const [ahw, ahh] = [player.width / 3, player.height / 4];
        const [bhw, bhh] = other.GetBounds(true);
        const [ax, ay] = [player.x + ahw, player.y + ahh];
        const [bx, by] = [other.sprite.x + bhw, other.sprite.y + bhh];

        const [dx, dy] = [ax - bx, ay - by];
        const [sw, sy] = [ahw + bhw, ahh + bhh];
        return Math.abs(dx) <= sw && Math.abs(dy) <= sy;
    }
}
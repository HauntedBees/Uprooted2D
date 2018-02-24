const worldmap = {
    freeMovement: true, savedImage: "", angryBees: false, smartphone: null, horRor: null,
    pos: { x: 0, y: 0 }, playerDir: 2, forceMove: false, forcedPlayerInfo: false,
    animData: new MapAnim("mapplayer", 0, 0, 16, 20, 2),
    mapName: "", fullAnimIdx: 0, forcedY: -1, 
    entities: [], importantEntities: {},
    inDialogue: false, dialogState: 0, dialogData: null, forceEndDialog: false,
    waitForAnimation: false, animIdx: 0, inWaterfall: false,
    setup: function(args) {
        this.forceMove = false;
        this.forcedY = -1;
        this.forcedPlayerInfo = false;
        this.savedImage = "";
        this.inDialogue = false;
        this.waitForAnimation = false;
        this.dialogState = 0;
        this.mapName = args.map;
        this.cursors = new CursorAnimSet([ { key: "main", x: -1, y: -1, w: 15, h: -0.25, type: "cursor", layer: "menucursorA" } ], true);

        let justStateLoad = false;
        if(player.visitedMaps.indexOf(args.map) < 0) { player.visitedMaps.push(args.map); }
        else { justStateLoad = !args.fromLoad; }

        this.pos = args.init;
        this.playerDir = (args.playerDir === undefined ? (this.playerDir === undefined ? 2 : this.playerDir) : args.playerDir);
        this.dialogData = null;
        this.forceEndDialog = false;
        this.inWaterfall = false;
        this.importantEntities = {};
        this.allowLateStart = true;

        if(!args.noEntityUpdate) { this.entities = GetEntities(this.mapName, args.fromLoad); }
        else { justStateLoad = false; args.fromLoad = false; }

        if(args.fromLoad || justStateLoad) { mapRefreshes.resetData(this.mapName, args.fromLoad, justStateLoad); }
        else if(args.isInn) { JumboToggle(false); }

        let targetToAutoplay = null;
        for(let i = 0; i < this.entities.length; i++) {
            const e = this.entities[i];
            if(e.storageKey !== undefined) { this.importantEntities[e.storageKey] = e; }
            if(e.autoplay && targetToAutoplay === null) { targetToAutoplay = e; } // always autoplay first one
        }
        this.refreshMap();
        if(args.postCombat !== undefined) { targetToAutoplay = this.importantEntities[args.postCombat]; }
        if(targetToAutoplay !== null) {
            game.target = targetToAutoplay;
            if(game.target !== null && game.target.interact !== undefined) {
                let keepGoing = true;
                if(player.failedEntities.indexOf(game.target.name) >= 0 && game.target.failedInteract !== undefined) {
                    keepGoing = game.target.failedInteract[0](0, game.target);
                } else {
                    keepGoing = game.target.interact[0](0, game.target);
                }
                if(!keepGoing) {
                    worldmap.allowLateStart = false;
                    worldmap.toggleMovement(false);
                    return;
                }
            }
        }
        
        if(worldmap.angryBees) {
            this.dialogState = 0;
            this.inDialogue = true;
            game.target = beeQueen;
            beeQueen.interact[0](0, beeQueen);
        }
        if(args.isInn) {
            JumboToggle(false);
            if(worldmap.entities[0].innCheck) { worldmap.entities[0].action(); }
        }
    },
    latestart: function() {
        if(worldmap.allowLateStart) { worldmap.toggleMovement(true); }
    },
    toggleMovement: function(moving) {
        clearInterval(worldmap.fullAnimIdx);
        this.fullAnimIdx = setInterval((moving ? worldmap.moveEntities : function() { worldmap.refreshMap(); }), timers.FULLANIM);
    },
    moveEntities: function() {
        if(worldmap.horRor !== null) { worldmap.horRor.Pursue(); }
        if(worldmap.smartphone !== null) { worldmap.smartphone.Update(); }
        for(let i = 0; i < worldmap.entities.length; i++) {
            const e = worldmap.entities[i];
            if(e.fov) { worldmap.fovCheck(e); }
            if(e.movement === undefined) { continue; }
            e.moving = true;
            const em = e.movement;
            const pointinfo = em.points[em.state];
            const speed = ((typeof em.speed) === "function" ? em.speed(e) : em.speed);
            const newPos = {
                x: e.pos.x + pointinfo.dx * speed,
                y: e.pos.y + pointinfo.dy * speed
            }
            if(pointinfo.dy > 0) {
                worldmap.entities[i].dir = directions.DOWN;
            } else if(pointinfo.dy < 0) {
                worldmap.entities[i].dir = directions.UP;
            } else if(pointinfo.dx < 0) {
                worldmap.entities[i].dir = directions.LEFT;
            } else if(pointinfo.dx > 0) {
                worldmap.entities[i].dir = directions.RIGHT;
            }
            let isBlocked = false;
            if(worldmap.isTheirCollision(newPos, e.big) && e.interact !== undefined) {
                isBlocked = true;
                if(!e.onlyActiveInteracts) {
                    worldmap.inDialogue = true;
                    worldmap.toggleMovement(false);
                    worldmap.dialogState = 0;
                    game.target = e;
                    if(e.interact[0](0, e)) { worldmap.finishDialog(); }
                }
            }
            if(isBlocked) { continue; }
            worldmap.entities[i].pos = newPos;
            if(Math.round(newPos.x) == pointinfo.x && Math.round(newPos.y) == pointinfo.y) {
                newPos.x = pointinfo.x;
                newPos.y = pointinfo.y;
                worldmap.entities[i].movement.state = (em.state + 1) % em.points.length;
            }
        }
        worldmap.refreshMap();
    },
    refreshMap: function() {
        gfx.clearSome(["background", "background2", "characters", "foreground"]); // TODO: actually put things on the foreground
        const offset = gfx.drawMap(this.mapName, this.pos.x, this.pos.y);
        const layers = [];
        const fov = [];
        const ymax = collisions[this.mapName].length;
        for(let y = 0; y < ymax; y++) { layers.push([]); }

        let animDir = this.playerDir, moving = true;
        if(!worldmap.inDialogue) {
            if(input.mainKey !== undefined) { animDir = input.mainKey; }
            else if(input.keys[player.controls.up] !== undefined) { animDir = directions.UP; }
            else if(input.keys[player.controls.left] !== undefined) { animDir = directions.LEFT; }
            else if(input.keys[player.controls.down] !== undefined) { animDir = directions.DOWN; }
            else if(input.keys[player.controls.right] !== undefined) { animDir = directions.RIGHT; }
            else { moving = this.forceMove; }
        } else { moving = this.forceMove; }
        const playery = this.forcedY < 0 ? Math.round(this.pos.y) : this.forcedY;
        for(let i = 0; i < this.entities.length; i++) {
            const e = this.entities[i];
            if(!e.visible || e.pos.y < 0 || (!e.chungus && e.pos.y >= ymax)) { continue; }
            if(e.jumbo) {
                gfx.drawJumbo(e.filename, (offset.x - e.pos.x), (offset.y - e.pos.y), e.w, e.h, e.offset.x, e.offset.y);
                continue;
            }
            if(e.chungus) {
                gfx.drawChungus(e.pos.x, e.pos.y, e.width, e.height, offset);
                continue;
            }
            if(e.isForeground) {
                const fgy = playery + 1;
                if(fgy >= ymax) { continue; }
                layers[fgy].push({ foreground: true, img: e.img, dy: e.yoff, w: e.width });
                continue;
            }
            if(e.fov) { fov.push({ x: e.pos.x - offset.x, y: e.pos.y - offset.y, dir: e.dir }); }
            let roundedY = e.forcedY ? e.forcedY : Math.round(e.pos.y);
            if(roundedY < 0 || roundedY >= ymax) { continue; }
            if(e.big) { roundedY++; }
            if(layers[roundedY] !== undefined) { // TODO: address new screen size (TODO: I don't know what I meant by this...?)
                layers[roundedY].push(e.anim.getFrame(e.pos, e.dir, e.moving));
            }
        }
        if(this.mapName !== "gameover") {
            layers[playery].push(this.forcedPlayerInfo === false ? this.animData.getFrame(this.pos, animDir, moving) : this.forcedPlayerInfo);
        }
        for(let y = 0; y < ymax; y++) {
            const funcs = layers[y];
            for(let i = 0; i < funcs.length; i++) {
                const e = funcs[i];
                if(e.foreground) {
                    gfx.drawFGCover(e.img, y, e.dy, e.w, offset);
                } else {
                    gfx.drawAnimCharacter(e.sx, e.sy, e.pos, offset, e.sheet, e.big, e.other);
                }
            }
        }
        for(let i = 0; i < fov.length; i++) { gfx.drawFOV(fov[i].x, fov[i].y, fov[i].dir, fov[i].ox, fov[i].oy); }
        if(worldmap.smartphone !== null) { worldmap.smartphone.Draw(); }
        if(worldmap.horRor !== null) { worldmap.horRor.Draw(); }
    },
    earlyclean: function() {
        clearInterval(worldmap.fullAnimIdx);
        clearInterval(worldmap.animIdx);
    },
    clean: function() {
        this.cursors.Perish();
        worldmap.earlyclean();
        gfx.clearAll();
    },
    clearTarget: function() {
        if(game.target) {
            if(game.target.name[0] !== "~") { player.clearedEntities.push(game.target.name); }
            const idx = this.entities.indexOf(game.target);
            if(idx >= 0) { this.entities.splice(idx, 1); }
        }
        game.target = null;
    },
    fovCheck: function(e) {
        if(worldmap.inDialogue) { return false; }
        const dpos = { x: e.pos.x - worldmap.pos.x, y: e.pos.y - worldmap.pos.y };
        let spotted = false;
        switch(e.dir) {
            case 0: spotted = Math.abs(dpos.x) <= 1 && dpos.y >= 0 && dpos.y <= 4; break;
            case 1: spotted = Math.abs(dpos.y) <= 1 && dpos.x >= 0 && dpos.x <= 4; break;
            case 2: spotted = Math.abs(dpos.x) <= 1 && dpos.y <= 0 && dpos.y >= -4; break;
            case 3: spotted = Math.abs(dpos.y) <= 1 && dpos.x <= 0 && dpos.x >= -4; break;
        }
        if(spotted) { e.moving = false; e.movement = undefined; game.target = e; e.interact[0](); }
    },
    writeText: function(t, choices, isRefresh, formatting, overBlack) {
        this.cursors.MoveCursor("main", -1, -1);
        worldmap.currentFormatting = formatting;
        gfx.clearSome(["menuA", "menutext", "menuOverBlack", "menutextOverBlack"]);
        const drawY = (worldmap.pos.y <= 4 || worldmap.mapName === "hq_6") ? 11 : 0;
        gfx.drawTextBox(drawY, overBlack);
        let actualText = GetText(t);
        if(actualText === "") { return; }
        let formatArray = false;
        if(formatting) {
            if((typeof formatting) === "string") {
                actualText = actualText.replace("{0}", formatting);
            } else {
                formatArray = true;
                for(let i = 0; i < formatting.length; i++) {
                    actualText = actualText.replace("{" + i + "}", formatting[i]);
                }
            }
        } else if(actualText.indexOf("{seeds}") >= 0) {
            let actualSeedCounts = {};
            for(let i = 0; i < player.nathanSeeds.length; i++) {
                const seedInfo = player.nathanSeeds[i];
                if(actualSeedCounts[seedInfo[0]] === undefined) { actualSeedCounts[seedInfo[0]] = 0; }
                actualSeedCounts[seedInfo[0]] += seedInfo[1];
            }
            let seedStrArr = [];
            for(const crop in actualSeedCounts) {
                seedStrArr.push(HandleGifts(crop, actualSeedCounts[crop]));
            }
            actualText = HandleLists(actualText, "{seeds}", seedStrArr, "falconNoGifts", true);
        }
        gfx.drawFullText(actualText, drawY * 16, undefined, overBlack);
        if(choices === undefined) {
            worldmap.dialogData = {};
            return;
        }
        const choiceTopY = (drawY === 11) ? (11.5 - choices.length) : 2.5;
        if(!isRefresh) { worldmap.dialogData = { choices: choices, text: t, idx: 0 }; }
        for(let i = 0; i < choices.length; i++) {
            let txt = GetText(choices[i]);
            if(formatArray) {
                for(let j = 0; j < formatting.length; j++) {
                    txt = txt.replace("{" + j + "}", formatting[j]);
                }
            }
            const selected = worldmap.dialogData.idx === i;
            gfx.drawChoice(choiceTopY + i, txt, selected);
            if(selected) { this.cursors.MoveCursor("main", 0, choiceTopY + i - 0.5); }
        }
    },
    mouseMove: pos => true,
    finishAnimation: function() {
        clearInterval(this.animIdx);
        this.waitForAnimation = false;
        this.click(null, true);
    },
    click: function(pos, isFresh) {
        if(!this.inDialogue) { if(worldmap.smartphone !== null) { return worldmap.smartphone.Read(); } return false; }
        if(this.waitForAnimation) { iHandler.SpeedUpAnimation(); }
        else {
            if(!isFresh) {
                if(iHandler.isFirst) { return false; }
                if(worldmap.dialogData.choices !== undefined && worldmap.dialogData.choices.length > 0) { return false; }
            }
            iHandler.Advance();
        }
    },
    finishDialog: function() {
        gfx.clearSome(["menuA", "menutext", "menucursorA"]);
        this.cursors.MoveCursor("main", -1, -1);
        this.forceEndDialog = false;
        this.inDialogue = false;
        this.freeMovement = true;
        worldmap.toggleMovement(true);
    },
    handleMenuChoices: function(key) {
        let dy = 0;
        switch(key) {
            case player.controls.up: dy--; break;
            case player.controls.down: dy++; break;
            case player.controls.confirm:
            case player.controls.pause: return this.click(null, input.IsFreshPauseOrConfirmPress());
        }
        if(worldmap.dialogData.choices === undefined || worldmap.dialogData.choices.length === 0) { return; }
        let newchoice = worldmap.dialogData.idx + dy;
        if(newchoice < 0) { newchoice = 0; }
        if(newchoice >= worldmap.dialogData.choices.length) { newchoice = worldmap.dialogData.choices.length - 1; }
        worldmap.dialogData.idx = newchoice;
        worldmap.writeText(worldmap.dialogData.text, worldmap.dialogData.choices, true, worldmap.currentFormatting);
    },
    keyPress: function(key) {
        if(this.inWaterfall)  { return false; }
        if(this.inDialogue) {
            this.freeMovement = false;
            input.clearAllKeys();
            if(this.dialogData === null) { 
                return (key === player.controls.confirm || key === player.controls.pause) ? this.click(null) : false;
            }
            return this.handleMenuChoices(key);
        }
        this.freeMovement = true;
        const pos = { x: this.pos.x, y: this.pos.y };
        let isEnter = false;
        const moveSpeed = me.PLAYERMOVESPEED;
        switch(key) {
            case player.controls.up: 
                pos.y -= moveSpeed;
                this.playerDir = directions.UP;
                break;
            case player.controls.left:
                pos.x -= moveSpeed;
                this.playerDir = directions.LEFT;
                break;
            case player.controls.down:
                pos.y += moveSpeed;
                this.playerDir = directions.DOWN;
                break;
            case player.controls.right:
                pos.x += moveSpeed;
                this.playerDir = directions.RIGHT;
                break;
            case player.controls.confirm:
            case player.controls.pause: isEnter = true; break;
            case player.controls.cancel: 
                if(this.inDialogue) { return; }
                if(this.smartphone !== null && this.smartphone.Dismiss() > 0) { return; }
                worldmap.savedImage = gfx.getSaveFileImage();
                game.transition(this, pausemenu);
                return;
        }
        const newPos = { x: Math.round(pos.x), y: Math.round(pos.y) }
        if(newPos.x < 0 || newPos.y < 0 || newPos.x >= collisions[this.mapName][0].length || newPos.y >= collisions[this.mapName].length) { return false; }
        if(worldmap.noClip) {
            this.pos = pos;
        } else {
            let hasCollisions = collisions[this.mapName][newPos.y][newPos.x];
            if(!hasCollisions) {
                for(let i = 0; i < this.entities.length; i++) {
                    const e = this.entities[i];
                    if(worldmap.isCollision(e, newPos)) {
                        hasCollisions = true;
                        break;
                    }
                }
            }
            if(!hasCollisions) { this.pos = pos; }
        }
        if(isEnter && input.IsFreshPauseOrConfirmPress()) {
            switch(this.playerDir) {
                case directions.UP: newPos.y--; break;
                case directions.LEFT: newPos.x--; break;
                case directions.DOWN: newPos.y++; break;
                case directions.RIGHT: newPos.x++; break;
            }
            let didInteract = false;
            for(let i = 0; i < this.entities.length; i++) {
                const e = this.entities[i];
                if(worldmap.isCollision(e, newPos) && e.interact !== undefined) {
                    didInteract = true;
                    if(!e.noChange) { e.dir = this.InvertDir(this.playerDir); }
                    this.inDialogue = true;
                    this.forceEndDialog = false;
                    worldmap.toggleMovement(false);
                    this.dialogState = 0;
                    game.target = e;
                    if(player.failedEntities.indexOf(game.target.name) >= 0 && e.failedInteract !== undefined) {
                        if(e.failedInteract[0](true, e)) { return; }
                    } else {
                        if(e.interact[0](true, e)) { return; }
                    }
                    break;
                }
            }
            if(!didInteract && worldmap.smartphone !== null) { return worldmap.smartphone.Read(); }
        } else {
            for(let i = 0; i < this.entities.length; i++) {
                const e = this.entities[i];
                if(!e.solid && (e.pos.x == newPos.x || e.isRow) && (e.pos.y == newPos.y || e.isColumn) && e.interact !== undefined) {
                    if(e.seamlessMap) {
                        e.interact[0](0, e);
                    } else if(e.interact !== undefined) {
                        this.inDialogue = true;
                        this.forceEndDialog = false;
                        this.dialogState = 0;
                        game.target = e;
                        worldmap.toggleMovement(false);
                        if(e.failed && e.failedInteract !== undefined) {
                            if(e.failedInteract[0]()) { return; }
                        } else {
                            if(e.interact[0](0, e)) { return; }
                        }
                    }
                    break;
                }
            }
        }
        this.refreshMap();
        return true;
    },
    InvertDir: function(dir) {
        switch(dir) {
            case directions.UP: return directions.DOWN;
            case directions.LEFT: return directions.RIGHT;
            case directions.DOWN: return directions.UP;
            case directions.RIGHT: return directions.LEFT;
        }
    },
    isCollision: function(e, newPos) {
        if(e.seamlessMap || !e.solid) { return false; }
        if(e.big) {
            return (Math.round(e.pos.x) === newPos.x && Math.round(e.pos.y + 1) === newPos.y) || Math.round(e.pos.x + 1) === newPos.x && Math.round(e.pos.y + 1) === newPos.y;
        } else {
            return Math.round(e.pos.x) === newPos.x && Math.round(e.pos.y) === newPos.y;
        }
    },
    isTheirCollision: function(newPos, big) {
        const wpx = Math.round(worldmap.pos.x), wpy = Math.round(worldmap.pos.y);
        const npx = Math.round(newPos.x), npy = Math.round(newPos.y);
        if(big) {
            return (npx === wpx && (npy + 1) === wpy) || ((npx + 1) === wpx && (npy + 1) === wpy);
        } else {
            return (npx === wpx && npy === wpy);
        }
    }
};
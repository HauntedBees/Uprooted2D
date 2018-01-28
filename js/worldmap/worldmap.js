var worldmap = {
    freeMovement: true, savedImage: "", angryBees: false, smartphone: null, horRor: null,
    pos: {x: 0, y: 0}, playerDir: 2, forceMove: false, forcedPlayerInfo: false,
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
        if(player.visitedMaps.indexOf(args.map) < 0) { player.visitedMaps.push(args.map); }
        this.pos = args.init;
        this.playerDir = (args.playerDir === undefined ? (this.playerDir === undefined ? 2 : this.playerDir) : args.playerDir);
        this.dialogData = null;
        this.forceEndDialog = false;
        this.inWaterfall = false;
        this.importantEntities = {};
        this.allowLateStart = true;
        if(!args.noEntityUpdate) {
            if(mapentities[this.mapName] !== undefined) {
                this.entities = mapentities[this.mapName].slice();
                for(var i = this.entities.length - 1; i >= 0; i--) {
                    if(player.clearedEntities.indexOf(this.entities[i].name) >= 0 || (this.entities[i].showIf && player.questsCleared.indexOf(this.entities[i].showIf) < 0)) {
                        this.entities.splice(i, 1);
                    }
                }
            } else {
                this.entities = [];
            }
        }
        var targetToAutoplay = null;
        for(var i = 0; i < this.entities.length; i++) {
            var e = this.entities[i];
            if(e.storageKey !== undefined) { this.importantEntities[e.storageKey] = e; }
            if(e.autoplay && targetToAutoplay === null) { targetToAutoplay = e; } // always autoplay first one
        }
        if(args.fromLoad) { mapRefreshes.resetData(this.mapName); }
        this.refreshMap();
        if(args.postCombat !== undefined) { targetToAutoplay = this.importantEntities[args.postCombat]; }
        if(targetToAutoplay !== null) {
            game.target = targetToAutoplay;
            if(game.target !== null && game.target.interact !== undefined) {
                var keepGoing = true;
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
        if(args.isInn && worldmap.entities[0].innCheck) {
            worldmap.entities[0].action();
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
        for(var i = 0; i < worldmap.entities.length; i++) {
            var e = worldmap.entities[i];
            if(e.fov) { worldmap.fovCheck(e); }
            if(e.movement === undefined) { continue; }
            e.moving = true;
            var em = e.movement;
            var pointinfo = em.points[em.state];
            var speed = ((typeof em.speed) === "function" ? em.speed(e) : em.speed);
            var newPos = {
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
            var isBlocked = false;
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
        var offset = gfx.drawMap(this.mapName, this.pos.x, this.pos.y);
        var layers = [];
        var fov = [];
        var ymax = collisions[this.mapName].length;
        for(var y = 0; y < ymax; y++) { layers.push([]); }

        var animDir = this.playerDir, moving = true;
        if(input.mainKey !== undefined) { animDir = input.mainKey; }
        else if(input.keys[player.controls.up] !== undefined) { animDir = directions.UP; }
        else if(input.keys[player.controls.left] !== undefined) { animDir = directions.LEFT; }
        else if(input.keys[player.controls.down] !== undefined) { animDir = directions.DOWN; }
        else if(input.keys[player.controls.right] !== undefined) { animDir = directions.RIGHT; }
        else { moving = this.forceMove; }

        var playery = this.forcedY < 0 ? Math.round(this.pos.y) : this.forcedY;

        for(var i = 0; i < this.entities.length; i++) {
            var e = this.entities[i];
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
                var fgy = playery + 1;
                if(fgy >= ymax) { continue; }
                layers[fgy].push({ foreground: true, img: e.img, dy: e.yoff, w: e.width });
                continue;
            }
            if(e.fov) { fov.push({ x: e.pos.x - offset.x, y: e.pos.y - offset.y, dir: e.dir }); }
            var roundedY = e.forcedY ? e.forcedY : Math.round(e.pos.y);
            if(roundedY < 0 || roundedY >= ymax) { continue; }
            layers[roundedY].push(e.anim.getFrame(e.pos, e.dir, e.moving));
        }
        if(this.mapName !== "gameover") {
            layers[playery].push(this.forcedPlayerInfo === false ? this.animData.getFrame(this.pos, animDir, moving) : this.forcedPlayerInfo);
        }
        
        for(var y = 0; y < ymax; y++) {
            var funcs = layers[y];
            for(var i = 0; i < funcs.length; i++) {
                var e = funcs[i];
                if(e.foreground) {
                    gfx.drawFGCover(e.img, y, e.dy, e.w, offset);
                } else {
                    gfx.drawAnimCharacter(e.sx, e.sy, e.pos, offset, e.sheet, e.big, e.other);
                }
            }
        }
        for(var i = 0; i < fov.length; i++) { gfx.drawFOV(fov[i].x, fov[i].y, fov[i].dir, fov[i].ox, fov[i].oy); }
        if(worldmap.smartphone !== null) { worldmap.smartphone.Draw(); }
        if(worldmap.horRor !== null) { worldmap.horRor.Draw(); }
    },
    earlyclean: function() {
        clearInterval(worldmap.fullAnimIdx);
        clearInterval(worldmap.animIdx);
    },
    clean: function() {
        worldmap.earlyclean();
        gfx.clearAll();
    },
    clearTarget: function() {
        if(game.target) {
            player.clearedEntities.push(game.target.name);
            var idx = this.entities.indexOf(game.target);
            if(idx >= 0) { this.entities.splice(idx, 1); }
        }
        game.target = null;
    },
    fovCheck: function(e) {
        if(worldmap.inDialogue) { return false; }
        var dpos = { x: e.pos.x - worldmap.pos.x, y: e.pos.y - worldmap.pos.y };
        var spotted = false;
        switch(e.dir) {
            case 0: spotted = Math.abs(dpos.x) <= 1 && dpos.y >= 0 && dpos.y <= 4; break;
            case 1: spotted = Math.abs(dpos.y) <= 1 && dpos.x >= 0 && dpos.x <= 4; break;
            case 2: spotted = Math.abs(dpos.x) <= 1 && dpos.y <= 0 && dpos.y >= -4; break;
            case 3: spotted = Math.abs(dpos.y) <= 1 && dpos.x <= 0 && dpos.x >= -4; break;
        }
        if(spotted) { e.moving = false; e.movement = undefined; game.target = e; e.interact[0](); }
    },
    writeText: function(t, choices, isRefresh, formatting, overBlack) {
        worldmap.currentFormatting = formatting;
        gfx.clearSome(["menuA", "menutext", "menucursorA", "menuOverBlack", "menutextOverBlack"]);
        var drawY = (worldmap.pos.y <= 3 || worldmap.mapName === "hq_6") ? 7.5 : 0;
        gfx.drawFullbox(drawY, overBlack);
        var actualText = GetText(t);
        if(actualText === "") { return; }
        var formatArray = false;
        if(formatting) {
            if((typeof formatting) === "string") {
                actualText = actualText.replace("{0}", formatting);
            } else {
                formatArray = true;
                for(var i = 0; i < formatting.length; i++) {
                    actualText = actualText.replace("{" + i + "}", formatting[i]);
                }
            }
        } else if(actualText.indexOf("{seeds}") >= 0) {
            var actualSeedCounts = {};
            for(var i = 0; i < player.nathanSeeds.length; i++) {
                var seedInfo = player.nathanSeeds[i];
                if(actualSeedCounts[seedInfo[0]] === undefined) { actualSeedCounts[seedInfo[0]] = 0; }
                actualSeedCounts[seedInfo[0]] += seedInfo[1];
            }
            var seedStrArr = [];
            for(var crop in actualSeedCounts) {
                seedStrArr.push(HandleGifts(crop, actualSeedCounts[crop]));
            }
            actualText = HandleLists(actualText, "{seeds}", seedStrArr, "falconNoGifts", true);
        }
        gfx.drawFullText(actualText, drawY * 16, undefined, overBlack);
        if(choices === undefined) {
            worldmap.dialogData = { };
            return;
        }
        if(!isRefresh) { worldmap.dialogData = { choices: choices, text: t, idx: 0 }; }
        for(var i = 0; i < choices.length; i++) {
            var txt = GetText(choices[i]);
            if(formatArray) {
                for(var j = 0; j < formatting.length; j++) {
                    txt = txt.replace("{" + j + "}", formatting[j]);
                }
            }
            gfx.drawChoice(2.5 + i, txt, worldmap.dialogData.idx === i);
        }
    },
    mouseMove: function(pos) { return true; },
    finishAnimation: function() {
        clearInterval(this.animIdx);
        this.waitForAnimation = false;
        this.click(null);
    },
    click: function(pos) {
        if(!this.inDialogue) { if(worldmap.smartphone !== null) { return worldmap.smartphone.Read(); } return false; }
        if(this.waitForAnimation) { iHandler.SpeedUpAnimation(); }
        else { iHandler.Advance(); }
    },
    finishDialog: function() {
        gfx.clearSome(["menuA", "menutext", "menucursorA"]);
        this.forceEndDialog = false;
        this.inDialogue = false;
        this.freeMovement = true;
        worldmap.toggleMovement(true);
    },
    handleMenuChoices: function(key) {
        var dy = 0;
        switch(key) {
            case player.controls.up: dy--; break;
            case player.controls.down: dy++; break;
            case player.controls.confirm:
            case player.controls.pause: return this.click(null);
        }
        if(worldmap.dialogData.choices === undefined || worldmap.dialogData.choices.length === 0) { return; }
        var newchoice = worldmap.dialogData.idx + dy;
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
        var pos = { x: this.pos.x, y: this.pos.y };
        var isEnter = false;
        var moveSpeed = me.PLAYERMOVESPEED;
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
        var newPos = {
            x: Math.round(pos.x),
            y: Math.round(pos.y)
        }
        if(newPos.x < 0 || newPos.y < 0 || newPos.x >= collisions[this.mapName][0].length || newPos.y >= collisions[this.mapName].length) { return false; }
        if(worldmap.noClip) {
            this.pos = pos;
        } else {
            var hasCollisions = collisions[this.mapName][newPos.y][newPos.x];
            if(!hasCollisions) {
                for(var i = 0; i < this.entities.length; i++) {
                    var e = this.entities[i];
                    if(worldmap.isCollision(e, newPos)) {
                        hasCollisions = true;
                        break;
                    }
                }
            }
            if(!hasCollisions) { this.pos = pos; }
        }
        if(isEnter) {
            switch(this.playerDir) {
                case directions.UP: newPos.y--; break;
                case directions.LEFT: newPos.x--; break;
                case directions.DOWN: newPos.y++; break;
                case directions.RIGHT: newPos.x++; break;
            }
            var didInteract = false;
            for(var i = 0; i < this.entities.length; i++) {
                var e = this.entities[i];
                if(worldmap.isCollision(e, newPos) && e.interact !== undefined) {
                    didInteract = true;
                    if(!e.noChange) { e.dir = this.invertDir(this.playerDir); }
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
            for(var i = 0; i < this.entities.length; i++) {
                var e = this.entities[i];
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
    invertDir: function(dir) {
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
        var wpx = Math.round(worldmap.pos.x), wpy = Math.round(worldmap.pos.y);
        var npx = Math.round(newPos.x), npy = Math.round(newPos.y);
        if(big) {
            return (npx === wpx && (npy + 1) === wpy) || ((npx + 1) === wpx && (npy + 1) === wpy);
        } else {
            return (npx === wpx && npy === wpy);
        }
    }
};
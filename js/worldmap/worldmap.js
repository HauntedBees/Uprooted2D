var worldmap = {
    freeMovement: true, savedImage: "", angryBees: false,
    pos: {x: 0, y: 0}, playerDir: 2, forceMove: false, forcedPlayerInfo: false,
    animData: new MapAnim("mapplayer", 0, 0, 16, 20, 2),
    mapName: "", fullAnimIdx: 0,
    entities: [], importantEntities: {},
    inDialogue: false, dialogState: 0, dialogData: null, forceEndDialog: false,
    waitForAnimation: false, animIdx: 0, inWaterfall: false,
    setup: function(args) {
        this.forceMove = false;
        this.forcedPlayerInfo = false;
        this.savedImage = "";
        this.inDialogue = false;
        this.waitForAnimation = false;
        this.dialogState = 0;
        this.mapName = args.map;
        this.pos = args.init;
        this.playerDir = args.playerDir || this.playerDir || 2;
        this.dialogData = null;
        this.forceEndDialog = false;
        this.inWaterfall = false;
        this.importantEntities = {};
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
        for(var i = 0; i < this.entities.length; i++) {
            var e = this.entities[i];
            if(e.storageKey !== undefined) { this.importantEntities[e.storageKey] = e; }
            if(e.autoplay) {
                this.inDialogue = true;
                game.target = e;
                if(e.interact[0](0, e)) { return; }
            }
        }
        this.refreshMap();
        if(args.postCombat !== undefined) {
            this.inDialogue = true;
            game.target = this.importantEntities[args.postCombat];
            game.target.interact[0](0, game.target);
            return;
        }
        this.fullAnimIdx = setInterval(worldmap.moveEntities, timers.FULLANIM);
        if(worldmap.angryBees) {
            this.dialogState = 0;
            this.inDialogue = true;
            game.target = beeQueen;
            beeQueen.interact[0](0, beeQueen);
        }
    },
    moveEntities: function() {
        for(var i = 0; i < worldmap.entities.length; i++) {
            var e = worldmap.entities[i];
            if(e.movement === undefined) { continue; }
            e.moving = true;
            var em = e.movement;
            var pointinfo = em.points[em.state];
            var newPos = {
                x: e.pos.x + pointinfo.dx * em.speed,
                y: e.pos.y + pointinfo.dy * em.speed
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
            if(Math.round(newPos.x) == Math.round(worldmap.pos.x) && Math.round(newPos.y) == Math.round(worldmap.pos.y) && e.interact !== undefined) {
                worldmap.inDialogue = true;
                clearInterval(worldmap.fullAnimIdx);
                worldmap.dialogState = 0;
                game.target = e;
                if(e.interact[0](0, e)) {
                    worldmap.finishDialog();
                }
                break;
            }
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
        gfx.clearLayer("background");
        gfx.clearLayer("characters");
        gfx.clearLayer("foreground"); // TODO: actually put things on the foreground
        var offset = gfx.drawMap(this.mapName, this.pos.x, this.pos.y);
        var layers = [];
        var ymax = collisions[this.mapName].length;
        for(var y = 0; y < ymax; y++) { layers.push([]); }
        for(var i = 0; i < this.entities.length; i++) {
            var e = this.entities[i];
            if(!e.visible || e.pos.y < 0 || e.pos.y >= ymax) { continue; }
            layers[Math.round(e.pos.y)].push(e.anim.getFrame(e.pos, e.dir, e.moving));
        }
        var animDir = this.playerDir, moving = true;
        if(input.mainKey !== undefined) { animDir = input.mainKey; }
        else if(input.keys[player.controls.up] !== undefined) { animDir = directions.UP; }
        else if(input.keys[player.controls.left] !== undefined) { animDir = directions.LEFT; }
        else if(input.keys[player.controls.down] !== undefined) { animDir = directions.DOWN; }
        else if(input.keys[player.controls.right] !== undefined) { animDir = directions.RIGHT; }
        else { moving = this.forceMove; }
        layers[Math.round(this.pos.y)].push(this.forcedPlayerInfo === false ? this.animData.getFrame(this.pos, animDir, moving) : this.forcedPlayerInfo);
        for(var y = 0; y < ymax; y++) {
            var funcs = layers[y];
            for(var i = 0; i < funcs.length; i++) {
                var e = funcs[i];
                gfx.drawAnimCharacter(e.sx, e.sy, e.pos, offset, e.sheet, e.big, e.other);
            }
        }
    },
    clean: function() {
        clearInterval(worldmap.fullAnimIdx);
        clearInterval(worldmap.animIdx);
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
    writeText: function(t, choices, isRefresh, formatting) {
        gfx.clearSome(["menuA", "menutext", "menucursorA"]);
        var drawY = (worldmap.pos.y <= 2.5) ? 7.5 : 0;
        gfx.drawFullbox(drawY);
        var actualText = GetText(t);
        if(formatting) { actualText = actualText.replace("{0}", formatting); }
        gfx.drawFullText(actualText, drawY * 16);
        if(choices === undefined) {
            worldmap.dialogData = { };
            return;
        }
        if(!isRefresh) { worldmap.dialogData = { choices: choices, text: t, idx: 0 }; }
        for(var i = 0; i < choices.length; i++) {
            gfx.drawChoice(2.5 + i, GetText(choices[i]), worldmap.dialogData.idx === i);
        }
    },
    mouseMove: function(pos) { return true; },
    finishAnimation: function() {
        clearInterval(this.animIdx);
        this.waitForAnimation = false;
        this.click(null);
    },
    click: function(pos) {
        if(!this.inDialogue || this.waitForAnimation) { return false; }
        var idx = (this.dialogData === null ? undefined : this.dialogData.idx);
        if(this.dialogData !== null && this.dialogData.nextDialogState !== undefined) {
            this.dialogState = this.dialogData.nextDialogState;
        } else {
            this.dialogState++;
        }
        if(worldmap.forceEndDialog || game.target == null || this.dialogState >= game.target.interact.length) {
            this.finishDialog();
            return true;
        }
        if(game.target.failed && game.target.failedInteract !== undefined) {
            return game.target.failedInteract[this.dialogState](idx, game.target);
        } else {
            return game.target.interact[this.dialogState](idx, game.target);
        }
    },
    finishDialog: function() {
        gfx.clearSome(["menuA", "menutext", "menucursorA"]);
        this.forceEndDialog = false;
        this.inDialogue = false;
        this.freeMovement = true;
        this.fullAnimIdx = setInterval(worldmap.moveEntities, timers.FULLANIM);
    },
    handleMenuChoices: function(key) {
        var dy = 0;
        switch(key) {
            case player.controls.up: dy--; break;
            case player.controls.down: dy++; break;
            case player.controls.confirm:
            case player.controls.pause: return this.click(null);
        }
        if(worldmap.dialogData.choices === undefined) { return; }
        var newchoice = worldmap.dialogData.idx + dy;
        if(newchoice < 0) { newchoice = 0; }
        if(newchoice >= worldmap.dialogData.choices.length) { newchoice = worldmap.dialogData.choices.length - 1; }
        worldmap.dialogData.idx = newchoice;
        worldmap.writeText(worldmap.dialogData.text, worldmap.dialogData.choices, true);
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
            for(var i = 0; i < this.entities.length; i++) {
                var e = this.entities[i];
                if(worldmap.isCollision(e, newPos) && e.interact !== undefined) {
                    if(!e.noChange) { e.dir = this.invertDir(this.playerDir); }
                    this.inDialogue = true;
                    this.forceEndDialog = false;
                    clearInterval(this.fullAnimIdx);
                    this.dialogState = 0;
                    game.target = e;
                    if(e.failed && e.failedInteract !== undefined) {
                        if(e.failedInteract[0](true, e)) { return; }
                    } else {
                        if(e.interact[0](true, e)) { return; }
                    }
                    break;
                }
            }
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
                        clearInterval(this.fullAnimIdx);
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
        if(Math.round(e.pos.x) === newPos.x && Math.round(e.pos.y) === newPos.y) { return true; }
        return e.big && (
            ((e.pos.x + 1) == newPos.x && e.pos.y == newPos.y)
            || (e.pos.x == newPos.x && (e.pos.y + 1) == newPos.y)
            || ((e.pos.x + 1) == newPos.x && (e.pos.y + 1) == newPos.y)
        );
    }
};
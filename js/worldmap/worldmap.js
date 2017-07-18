var worldmap = {
    freeMovement: true,
    pos: {x: 0, y: 0}, playerDir: 2,
    animData: new MapAnim("mapplayer", 0, 0, 16, 20, 2),
    mapName: "", fullAnimIdx: 0,
    entities: [], importantEntities: {},
    inDialogue: false, dialogState: 0,
    waitForAnimation: false, animIdx: 0, 
    setup: function(args) {
        this.inDialogue = false;
        this.waitForAnimation = false;
        this.dialogState = 0;
        this.mapName = args.map;
        this.pos = args.init;
        this.importantEntities = {};
        if(!args.noEntityUpdate) {
            if(mapentities[this.mapName] !== undefined) {
                this.entities = mapentities[this.mapName].slice();
                for(var i = this.entities.length - 1; i >= 0; i--) {
                    if(player.clearedEntities.indexOf(this.entities[i].name) >= 0) {
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
                if(e.interact[0]()) { return; }
            }
        }
        this.refreshMap();
        if(args.postCombat !== undefined) {
            this.inDialogue = true;
            game.target = this.importantEntities[args.postCombat];
            game.target.interact[0]();
            return;
        }
        this.fullAnimIdx = setInterval(worldmap.moveEntities, 10);
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
                worldmap.entities[i].dir = 2;
            } else if(pointinfo.dy < 0) {
                worldmap.entities[i].dir = 0;
            } else if(pointinfo.dx < 0) {
                worldmap.entities[i].dir = 1;
            } else if(pointinfo.dx > 0) {
                worldmap.entities[i].dir = 3;
            }
            if(Math.round(newPos.x) == Math.round(worldmap.pos.x) && Math.round(newPos.y) == Math.round(worldmap.pos.y)) {
                worldmap.inDialogue = true;
                clearInterval(worldmap.fullAnimIdx);
                worldmap.dialogState = 0;
                game.target = e;
                e.interact[0]();
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
        else if(input.keys["w"] !== undefined) { animDir = 0; }
        else if(input.keys["a"] !== undefined) { animDir = 1; }
        else if(input.keys["s"] !== undefined) { animDir = 2; }
        else if(input.keys["d"] !== undefined) { animDir = 3; }
        else { moving = false; }
        layers[Math.round(this.pos.y)].push(this.animData.getFrame(this.pos, animDir, moving));
        for(var y = 0; y < ymax; y++) {
            var funcs = layers[y];
            for(var i = 0; i < funcs.length; i++) {
                var e = funcs[i];
                gfx.drawAnimCharacter(e.sx, e.sy, e.pos, offset, e.sheet, e.big);
            }
        }
    },
    clean: function() {
        clearInterval(worldmap.fullAnimIdx);
        clearInterval(worldmap.animIdx);
        gfx.clearAll();
    },
    clearTarget: function() {
        player.clearedEntities.push(game.target.name);
        var idx = this.entities.indexOf(game.target);
        if(idx >= 0) { this.entities.splice(idx, 1); }
        game.target = null;
    },
    writeText: function(t) {
        gfx.clearSome(["menuA", "menutext"]);
        gfx.drawFullbox();
        gfx.drawFullText(t);
    },
    mouseMove: function(pos) { return true; },
    finishAnimation: function() {
        clearInterval(this.animIdx);
        this.waitForAnimation = false;
        this.click(null);
    },
    click: function(pos) {
        if(!this.inDialogue || this.waitForAnimation) { return false; }
        this.dialogState++;
        if(game.target == null || this.dialogState >= game.target.interact.length) {
            gfx.clearSome(["menuA", "menutext"]);
            this.inDialogue = false;
            this.fullAnimIdx = setInterval(worldmap.moveEntities, 10);
            return true;
        }
        if(game.target.failed && game.target.failedInteract !== undefined) {
            return game.target.failedInteract[this.dialogState]();
        } else {
            return game.target.interact[this.dialogState]();
        }
    },
    keyPress: function(key) {
        var pos = { x: this.pos.x, y: this.pos.y };
        var isEnter = false;
        var moveSpeed = 0.25;
        switch(key) {
            case "w": 
                pos.y -= moveSpeed;
                this.playerDir = 0;
                break;
            case "a":
                pos.x -= moveSpeed;
                this.playerDir = 1;
                break;
            case "s":
                pos.y += moveSpeed;
                this.playerDir = 2;
                break;
            case "d":
                pos.x += moveSpeed;
                this.playerDir = 3;
                break;
            case " ":
            case "Enter": isEnter = true; break;
            case "q": 
                if(this.inDialogue) { return; }
                game.transition(this, pausemenu);
                return;
        }
        if(this.inDialogue) {
            if(isEnter) {
                return this.click(null);
            } else {
                return false;
            }
        }
        var newPos = {
            x: Math.round(pos.x),
            y: Math.round(pos.y)
        }
        if(newPos.x < 0 || newPos.y < 0 || newPos.x >= collisions[this.mapName][0].length || newPos.y >= collisions[this.mapName].length) { return false; }
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
        if(isEnter) {
            switch(this.playerDir) {
                case 0: newPos.y--; break;
                case 1: newPos.x--; break;
                case 2: newPos.y++; break;
                case 3: newPos.x++; break;
            }
            for(var i = 0; i < this.entities.length; i++) {
                var e = this.entities[i];
                if(e.solid && worldmap.isCollision(e, newPos) && e.interact !== undefined) {
                    e.dir = this.invertDir(this.playerDir);
                    this.inDialogue = true;
                    clearInterval(this.fullAnimIdx);
                    this.dialogState = 0;
                    game.target = e;
                    if(e.failed && e.failedInteract !== undefined) {
                        if(e.failedInteract[0]()) { return; }
                    } else {
                        if(e.interact[0]()) { return; }
                    }
                    break;
                }
            }
        } else {
            for(var i = 0; i < this.entities.length; i++) {
                var e = this.entities[i];
                if(!e.solid && (e.pos.x == newPos.x || e.isRow) && (e.pos.y == newPos.y || e.isColumn) && e.interact !== undefined) {
                    this.inDialogue = true;
                    this.dialogState = 0;
                    game.target = e;
                    if(e.failed && e.failedInteract !== undefined) {
                        if(e.failedInteract[0]()) { return; }
                    } else {
                        if(e.interact[0]()) { return; }
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
            case 0: return 2;
            case 1: return 3;
            case 2: return 0;
            case 3: return 1;
        }
    },
    isCollision: function(e, newPos) {
        if(e.pos.x == newPos.x && e.pos.y == newPos.y) { return true; }
        return e.big && (
            ((e.pos.x + 1) == newPos.x && e.pos.y == newPos.y)
            || (e.pos.x == newPos.x && (e.pos.y + 1) == newPos.y)
            || ((e.pos.x + 1) == newPos.x && (e.pos.y + 1) == newPos.y)
        );
    }
};
function InventoryCopy(arr) {
    let copy = [];
    for (let i = 0; i < arr.length; i++) { copy[i] = (typeof arr[i] === "object") ? InventoryCopy(arr[i]) : arr[i]; }
    return copy;
 }
const game = {
    w: 1024, h: 896, tilew: 16, tileh: 14, //w: 960, h: 640,
    currentInputHandler: worldmap, target: null, language: "en-dm",
    sheetsToLoad: ["sheet", "title", "charsheet", "playersheet", "mapchar", "mapplayer","mapcharbig", "charsheetbig", "hipster", "assistant",
                    "maps/producestand","maps/forest", "maps/farm_init", "maps/farm", "maps/firstvillage", "maps/belowvillage", "maps/researchfacility",
                    "maps/bridge", "maps/underwater", "shops/cock", "shops/dwarf", "shops/dwarf2", "shops/dwarf3", "shops/merm", "shops/home",
                    "maps/fakefarm", "covers/barn", "maps/southcity", "covers/mob", "covers/skumpy", "maps/gameover", "fov", "smartphone", "maps/northcity",
                    "covers/northcity1", "covers/northcity2", "covers/northcity2_post", "covers/northcity3", "maps/hq_1", "maps/hq_2", "maps/hq_3",
                    "maps/hq_4", "maps/hq_5", "maps/hq_6", "horRorTop", "horRorBottom", "ayudame", "mapplayer_help", "shops/vendo",
                    "foregrounds/farm", "combat_player", "combat_equipment", "bgs/outside", "bgs/underwater", "titleGround", "titleTop"],
    canvasLayers: ["background", "background2", "characters", "foreground", "smartphone", "smartphoneText", "menuA", "menuB", "menucursorA", 
                    "menucursorB", "menucursorC", "menutext", "tutorial", "menuOverBlack", "menutextOverBlack", "savegen"], 
    fullInit: function() {
        let canvasObj = {};
        for(let i = 0; i < game.canvasLayers.length; i++) {
            const name = game.canvasLayers[i];
            //game.createCanvas(name) // TODO: why was I doing this??
            canvasObj[name] = document.getElementById(name);
        }
        let contextObj = {};
        for(const key in canvasObj) {
            contextObj[key] = canvasObj[key].getContext("2d");
        }
        game.init(canvasObj, contextObj, game.w, game.h, 16, 14); // 15, 10)
    },
    createCanvas: function(name) {
        let canvas = document.createElement("canvas");
        canvas.id = name; canvas.width = game.w; canvas.height = game.h;
        document.body.appendChild(canvas);
    },
    init: function(canvasObj, ctxObj, width, height, tilewidth, tileheight) {
        gfx.canvas = canvasObj;
        gfx.ctx = ctxObj;
        gfx.canvasWidth = width;
        gfx.canvasHeight = height;
        gfx.tileWidth = tilewidth;
        gfx.tileHeight = tileheight;
        spriteData.populate();
        gfx.loadSpriteSheets(this.sheetsToLoad, this.sheetsLoaded);
    },
    transitioning: false,
    transition: function(from, to, arg) {
        if(game.transitioning) { return false; }
        game.transitioning = true;
        if(from.earlyclean !== undefined) { from.earlyclean(); }
        game.startTransitionAnim(1, from, to, arg);
        return true;
    },
    innerTransition: function(from, to, arg) {
        if(this.currentInputHandler.isTutorial) { return tutorial.transition(from, to, arg); }
        game.currentInputHandler = to;
        from.clean();
        if(!from.freeMovement || !to.freeMovement) { input.clearAllKeys(); }
        to.setup(arg);
    },
    transitionInfo: { crop: "trns0", size: 0.5, time: 0 },
    startTransitionAnim: function(dir, from, to, arg) {
        clearInterval(game.transitionInfo.animIdx);
        game.transitionInfo = {
            crop: "trns" + Math.floor(Math.random() * 20), size: (dir > 0 ? 0.5 : 5), dir: dir,
            from: from, to: to, arg: arg, 
            animIdx: setInterval(game.drawTransitionAnim, 10)
        };
    },
    midTransitionPoint: function() {
        clearInterval(game.transitionInfo.animIdx);
        game.innerTransition(game.transitionInfo.from, game.transitionInfo.to, game.transitionInfo.arg);
        if(game.transitionInfo.arg !== undefined && game.transitionInfo.arg.stayBlack) { return; }
        game.startTransitionAnim(-1);
    },
    finishTransition: function() {
        clearInterval(game.transitionInfo.animIdx);
        game.transitioning = false;
        if(game.currentInputHandler.latestart !== undefined) { game.currentInputHandler.latestart(); }
        gfx.clearLayer("tutorial");
    },
    drawTransitionAnim: function() {
        gfx.clearLayer("tutorial");
        if(game.transitionInfo.size > 0) {
            for(let y = 0; y < game.tileh + 2; y += 2) {
                for(let x = 0; x < game.tilew + 2; x += 2) {
                    gfx.drawTransitionImage(game.transitionInfo.crop, x - (y % 4 ? 1 : 0), y + 0.5, game.transitionInfo.size);
                }
            }
        }
        if(game.transitionInfo.dir === 1) {
            if(game.transitionInfo.size >= 5) {
                game.midTransitionPoint();
            } else {
                game.transitionInfo.size += 0.1;
            }
        } else {
            if(game.transitionInfo.size <= 0) {
                game.finishTransition();
            } else {
                game.transitionInfo.size -= 0.1;
            }
        }
    },
    initListeners: function() {
        //gfx.canvas["menutextOverBlack"].addEventListener("mousemove", input.moveMouse);
        gfx.canvas["menutextOverBlack"].addEventListener("click", input.click);
        document.addEventListener("keypress", input.keyPress);
        document.addEventListener("keydown", input.keyDown);
        document.addEventListener("keyup", input.keyUp);
        setInterval(game.incrementTime, 1000);
    },
    incrementTime: () => player.playTime++,
    sheetsLoaded: function() {
        game.initListeners();
        game.currentInputHandler = worldmap.title;
        worldmap.title.setup();
    },
    obj2str: obj  => LZString.compress(JSON.stringify(obj)),
    str2obj: str => JSON.parse(LZString.decompress(str)),
    SetNonstandardGameOverFlag: function() {
        for(let i = 0; i < 5; i++) {
            if(localStorage.getItem("gameover" + i) === null) {
                localStorage.setItem("gameover" + i, player.SaveID);
                return;
            }
        }
    },
    GetNonstandardGameOverFlag: function(savenum) {
        for(let i = 0; i < 5; i++) {
            const goId = localStorage.getItem("gameover" + i);
            if(goId === player.SaveID) {
                AddAchievementIfMissing("murderedToDeath");
                localStorage.removeItem("gameover" + i);
                game.save(savenum, true);
                return;
            }
        }
    },
    save: function(savenum, justPlayer) {
        if(justPlayer) { 
            localStorage.setItem("player" + savenum, game.obj2str(player));
            return;
        }
        player.setMapPosition();
        player.SaveID = (Math.random() * Number.MAX_SAFE_INTEGER).toString();
        localStorage.setItem("fileImg" + savenum, worldmap.savedImage);
        localStorage.setItem("player" + savenum, game.obj2str(player));
        stateBinders.storePositions(worldmap.mapName);
        for(let i = 0; i < player.visitedMaps.length; i++) {
            const map = player.visitedMaps[i];
            if(stateBinders[map] !== undefined) { stateBinders[map](); }
        }
        if(worldmap.smartphone !== null) { mapStates["northcity"].phoneData = worldmap.smartphone.GetPhoneData(); }
        localStorage.setItem("mapent" + savenum, game.obj2str(mapStates));
    },
    load: function(savenum) {
        let loadedPlayer = game.str2obj(localStorage.getItem("player" + savenum));
        player = Object.assign(player, loadedPlayer);
        game.GetNonstandardGameOverFlag(savenum);
        mapStates = game.str2obj(localStorage.getItem("mapent" + savenum));
        stores["skumpys"].wares[0].price = (player.achievements.indexOf("skumpy") < 0 ? 20 : 0);
        if(mapStates["northcity"].phoneData !== undefined) {
            worldmap.smartphone = new Smartphone();
            worldmap.smartphone.SetPhoneData(mapStates["northcity"].phoneData);
        }
        game.transition(game.currentInputHandler, worldmap, { 
            init: player.mapPos,
            map: player.mapName,
            playerDir: player.mapDir,
            fromLoad: true
        });
    }
};
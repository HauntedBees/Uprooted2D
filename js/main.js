if (typeof Object.assign != 'function') {
    Object.assign = function(target, varArgs) {
        if (target == null) { throw new TypeError('Cannot convert undefined or null to object'); }
        var to = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];
            for (var nextKey in nextSource) {
                if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                    to[nextKey] = nextSource[nextKey];
                }
            }
        }
        return to;
    };
}
function InventoryCopy(arr) {
    var copy = [];
    for (var i = 0; i < arr.length; i++) { copy[i] = (typeof arr[i] === "object") ? InventoryCopy(arr[i]) : arr[i]; }
    return copy;
 }
var game = {
    currentInputHandler: worldmap, target: null, language: "en-dm",
    sheetsToLoad: ["sheet", "title", "charsheet", "playersheet", "mapchar", "mapplayer","mapcharbig", "charsheetbig", "hipster", "assistant",
                    "maps/farmersmarket", "maps/farmpath", "maps/farm_init", "maps/farm", "maps/firstvillage", "maps/belowvillage", "maps/researchfacility",
                    "maps/bridge", "maps/underwater", "shops/cock", "shops/dwarf", "shops/dwarf2", "shops/dwarf3", "shops/merm", "shops/home"],
    canvasLayers: ["background", "characters", "foreground", "menuA", "menuB", "menucursorA", "menucursorB", "menucursorC", "menutext", "tutorial", "savegen"], 
    fullInit: function() {
        var canvasObj = {};
        for(var i = 0; i < game.canvasLayers.length; i++) {
            var name = game.canvasLayers[i];
            game.createCanvas(name)
            canvasObj[name] = document.getElementById(name);
        }
        var contextObj = {};
        for(var key in canvasObj) {
            contextObj[key] = canvasObj[key].getContext("2d");
        }
        game.init(canvasObj, contextObj, 960, 640, 15, 10);
    },
    createCanvas: function(name) {
        var canvas = document.createElement("canvas");
        canvas.id = name; canvas.width = 960; canvas.height = 640;
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
    transition: function(from, to, arg) {
        if(this.currentInputHandler.isTutorial) { return tutorial.transition(from, to, arg); }
        this.currentInputHandler = to;
        from.clean();
        if(!from.freeMovement || !to.freeMovement) { input.clearAllKeys(); }
        to.setup(arg);
        return true;
    },
    initListeners: function() {
        //gfx.canvas["menutext"].addEventListener("mousemove", input.moveMouse);
        gfx.canvas["menutext"].addEventListener("click", input.click);
        document.addEventListener("keypress", input.keyPress);
        document.addEventListener("keydown", input.keyDown);
        document.addEventListener("keyup", input.keyUp);
        setInterval(game.incrementTime, 1000);
    },
    incrementTime: function() { player.playTime++; },
    sheetsLoaded: function() {
        game.initListeners();
        game.currentInputHandler = worldmap.title;
        worldmap.title.setup();
    },
    save: function(savenum) {
        player.setMapPosition();
        localStorage.setItem("file" + savenum, JSON.stringify(player));
        localStorage.setItem("fileImg" + savenum, worldmap.savedImage);
    },
    load: function(savenum) {
        var loadedPlayer = JSON.parse(localStorage.getItem("file" + savenum));
        player = Object.assign(player, loadedPlayer);
        game.transition(game.currentInputHandler, worldmap, { 
            init: player.mapPos,
            map: player.mapName,
            playerDir: player.mapDir
        });
    }
};
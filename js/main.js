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
var game = {
    currentInputHandler: worldmap, target: null,
    init: function(canvasObj, ctxObj, width, height, tilewidth, tileheight) {
        gfx.canvas = canvasObj;
        gfx.ctx = ctxObj;
        gfx.canvasWidth = width;
        gfx.canvasHeight = height;
        gfx.tileWidth = tilewidth;
        gfx.tileHeight = tileheight;
        spriteData.populate();
        gfx.loadSpriteSheets(["sheet", "charsheet", "playersheet", "mapchar", "mapplayer","mapcharbig", "charsheetbig",
                                "maps/farmersmarket", "maps/farmpath", "maps/farm", "maps/firstvillage",
                                "shops/cock"], this.sheetsLoaded);
    },
    transition: function(from, to, arg) {
        if(this.currentInputHandler.isTutorial) { return tutorial.transition(from, to, arg); }
        this.currentInputHandler = to;
        from.clean();
        if(!from.freeMovement || !to.freeMovement) { input.clearAllKeys(); }
        to.setup(arg);
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
        worldmap.setup({
            init: { x: 10,  y: 7 },
            map: "farmersmarket"
        }); 
    },
    save: function(savenum) { localStorage.setItem("file" + savenum, JSON.stringify(player)); },
    load: function(savenum) { var loadedPlayer = JSON.parse(localStorage.getItem("file" + savenum)); player = Object.assign(player, loadedPlayer); }
};
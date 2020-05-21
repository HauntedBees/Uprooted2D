class GameHandler {
    constructor() {
        this.type = 0; // 0 = browser, 1 = nwjs, 2 = cordova
        this.numSaveSlots = 10;
        this.w = 1024; this.h = 896;
        this.tilew = this.w / 64; this.tileh = this.h / 64;
        this.target = null;
        this.language = "en-us";
        this.transitionAnim = null;
        this.player = new Player();
        this.soundHandler = new SoundHandler();
        /** @type {PreviousWorldState} */
        this.previousWorldState = null;
        this.gfx = new Gfx([
            "gamedata/spritesheets/sprites.json",
            "gamedata/spritesheets/bigSprites.json",
            "gamedata/spritesheets/mapJunk.json",
            "mapPlayer", "mapChar",
            //* Opening *//
            "title", "titleGround", "titleTop",
            //* Maps *//
            "maps/farm",
            //* Shops *//
            "shops/home", "shops/cluckfuck",
            "shopblinks/home", "shopblinks/cluckfuck",
            "wakeup"
        ], () => this.Loaded());
    }
    Loaded() {
        //let univSettings = localStorage.getItem("universalSettings");
        //if(univSettings !== null) { universalSettings = game.str2obj(univSettings); }

        if(typeof cordova !== "undefined" || location.href.indexOf("indexmobile") >= 0) {
            this.type = 2; // mobile
            //window.addEventListener("orientationchange", cordovaHelpers.OrientationChange);
            //cordovaHelpers.OrientationChange();
        } else if(typeof require === "function") {
            this.type = 1; // desktop
            //nwHelpers.InitScreenSizeAdjustment();
        } else {
            this.type = 0; // browser
        }

        //document.getElementById("screenRead").innerText = GetText("nowLoading");
        //document.getElementById("canvasContainer").focus();
        
        const lastSave = localStorage.getItem("lastSaved");
        if(lastSave !== null) {
            /*const loadedPlayer = game.str2obj(localStorage.getItem("player" + lastSave));
            player.options = Object.assign(player.options, loadedPlayer.options);
            player.keyboardcontrols = Object.assign(player.keyboardcontrols, loadedPlayer.keyboardcontrols);
            player.gamepadcontrols = Object.assign(player.gamepadcontrols, loadedPlayer.gamepadcontrols);
            game.PatchSaveFile();*/
        }
        if(this.type === 2) {
            /*this.virtualControls = new VirtGamepad(input, ["dpad", "landscapeLeft", "landscapeRight"], [
                new VirtButton("dpad", "dpad", "vgp_img/dpad.png", { eightDirection: true }),
                new VirtButton("confirm", "button", "vgp_img/confirm.png"),
                new VirtButton("cancel", "button", "vgp_img/cancel.png"),
                new VirtButton("pause", "button", "vgp_img/pause.png"),
                new VirtButton("dpadL", "dpad", "vgp_img/dpad.png", { eightDirection: true }),
                new VirtButton("confirmL", "button", "vgp_img/confirm.png"),
                new VirtButton("cancelL", "button", "vgp_img/cancel.png"),
                new VirtButton("pauseL", "button", "vgp_img/pause.png")
            ], [
                new VirtButtonPosition("dpad", "dpad", 45, 45, 1.25, 1.25),
                new VirtButtonPosition("confirm", "dpad", 580, 240, 1.5, 1.5),
                new VirtButtonPosition("cancel", "dpad", 780, 20, 1.5, 1.5),
                new VirtButtonPosition("pause", "dpad", 420, 600),
                new VirtButtonPosition("dpadL", "landscapeLeft", 50, 150, 1.25, 1.25),
                new VirtButtonPosition("pauseL", "landscapeLeft", 225, 750),
                new VirtButtonPosition("cancelL", "landscapeRight", 220, 100, 1.5, 1.5),
                new VirtButtonPosition("confirmL", "landscapeRight", 80, 400, 1.5, 1.5)
            ]);
            virtualControls.Show();*/
        }

        const debug = true;
        const fromQuit = localStorage.getItem("quit");
        this.InitListeners();
        if(debug || fromQuit === "true") {
            localStorage.removeItem("quit");
            this.currentScreen = new WorldScreen({ init: { x: 72, y: 15 }, map: "farm" });//TitleScreen();
        } else {
            //game.currentInputHandler = opening;
            //opening.setup();
        }

    }
    KeyPress(key) {
        if(this.transitionAnim !== null && this.transitionAnim.active) { return; }
        this.currentScreen.KeyPress(key);
    }
    InitListeners() {
        if(this.type !== 2) {
            //gfx.canvas["menutextOverBlack"].addEventListener("mousemove", input.moveMouse);
            //gfx.canvas["menutextOverBlack"].addEventListener("click", input.click);
            this.inputHandler = new InputHandler(this);
            this.inputHandler.SetToDefaultGameInputs(false);
            this.controller = this.inputHandler.controlSets[0];
        }
        //setInterval(this.IncrementTime, 1000);
    }
    //IncrementTime () { player.playTime++ }

    /**
     * @param {any} toClass
     * @param {any} [arg]
     */
    Transition(toClass, arg) {
        const me = this;
        // TODO: tutorial transition
        // TODO: worldmap.ToggleRun(false);
        // TODO: early clean? types of transitions
        this.transitionAnim = new CropTransition(this, 10, 5, 60, function() { me.MidTransition(toClass, arg); }, function() { me.FinishTransition(); });
    }
    MidTransition(toClass, arg) {
        this.currentScreen.CleanUp();
        this.currentScreen = new toClass(arg);
        this.controller.ClearAllKeys();
        //clearInterval(game.transitionInfo.animIdx);
        //if(game.transitionInfo.arg === "justAnim") { return; }
        //game.innerTransition(game.transitionInfo.from, game.transitionInfo.to, game.transitionInfo.arg, true);
        //if(game.transitionInfo.arg !== undefined && game.transitionInfo.arg.stayBlack) { return; }
        //game.startTransitionAnim(-1);
    }
    FinishTransition() {
        this.transitionAnim.CleanUp();
        this.transitionAnim = null;
    }
};

const game2 = new GameHandler();
const gfx2 = game2.gfx;
const sound = game2.soundHandler;
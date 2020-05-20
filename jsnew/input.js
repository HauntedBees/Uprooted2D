class GameInput {
    /** 
     * Keeps track of when a given key or gamepad button has been pressed.
     * Is -1 when the input is not pressed.
     * Is  0 when the input was JUST pressed.
     * Values greater than 0 mean the input is being held down.
     * @type {{[key:string] : number }} */
    justPressed = {};

    /**
     * Normally, key and button presses are registered as single discrete presses (i.e. you press Z once, it registers as one Z press).
     * This is ideal for navigating menus and confirming options, but when controlling a character for example, this may not the desired behavior.
     * When freeMovement is true, holding down movement keys will regularly send keypress events to the Game until they are released.
     * @type {boolean}
     */
    freeMovement = false;
    /**
     * When freeMovement is true, this keeps track of the IDs for the movement intervals
     * @type {{[key:string] : number }}
     */
    freeMovementIntervals = {};
    /**
     * When freeMovement is true, this keeps track of the primary movement direction (i.e. if you press DOWN, then also hold down LEFT, DOWN will be the
     * primary direction until you release it, then it will switch to LEFT, and then when LEFT is released it will go back to undefined)
     * @type {number}
     */
    mainFreeMovementDirectionKey = undefined; 

    /**
     * whether or not the player is currently using a gamepad, as opposed to the keyboard
     * @type {boolean}
     */
    usingGamepad = false;
    /**
     * the index of the gamepad registered to this GameInput
     * @type {number}
     */
    gamepadIndex = 0;
    /**
     * how far down a trigger has to be pressed for the GameInput to register it as a button press
     * @type {number}
     */
    triggerMin = 0.5;
    /**
     * how far a gamepad must be moved in a specific direction for the GameInput to register it as being active
     * @type {number[]}
     */
    deadZones = [0.25, 0.25, 0.25, 0.25];
    /** @type {number} */  buttonDelay = 10;
    /**
     * essentially the gamepad equivalent of the justPressed array
     * @type {number[]}
     */
    gamepadButtons = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // buttons 0 - 15
        0, 0, 0, 0, // negative axes Lx Ly Rx Ry
        0, 0, 0, 0 // positive axes Lx Ly Rx Ry
    ]; 
    /**
     * controllers need to control something, yeah? this is what this controls.
     * @type {GameHandler}
     */
    gameHandler = null;
    /**
     * keeps track of all the keyboard keys or gamepad buttons mapped to inputs for this GameInput.
     * not particularly useful for gamepads, but you've probably only got one keyboard, so if you got
     * one player using WASD for movement and another using the arrow keys, this is a good way to ensure
     * the controls don't intermingle.
     * @type {string[]}
     */
    controlArray = [];

    /** 
     * Ties a set of keyboard keys and/or gamepad buttons to a player, and connects those inputs to a Game 
     * @param {GameHandler} handler
     * @param {number} playerNum
     * @param {{ up: string; left: string; down: string; right: string; confirm: string; cancel: string; pause: string; }} [keyboardDefaults]
     * @param {{ up: string; left: string; down: string; right: string; confirm: string; cancel: string; pause: string; }} [gamepadDefaults] */
    constructor(handler, playerNum, keyboardDefaults, gamepadDefaults) {
        this.gameHandler = handler;
        this.playerNum = playerNum;
        this.keyboardControls = keyboardDefaults || { up: "w", left: "a", down: "s", right: "d", confirm: "z", cancel: "x", pause: "Enter" };
        this.gamepadControls = gamepadDefaults || { up: "Gamepad12", left: "Gamepad14", down: "Gamepad13", right: "Gamepad15", confirm: "Gamepad0", cancel: "Gamepad1", pause: "Gamepad9" };
        this.currentControls = this.keyboardControls;
        this.ResetControlArray();
        return new Proxy(this, {
            get: (obj, key) => {
                if(typeof(key) === "string" && obj.currentControls[key] !== undefined) {
                    return obj.Key(key);
                } else {
                    return obj[key];
                }
            }
        });
    }

    /**
     * Converts an input name to its corresponding key or gamepad button
     * @param {string} key - an input name (like "up" or "confirm")
     * @returns {string}
    */
    Key(key) {
        if(this.usingGamepad) {
            return this.gamepadIndex.toString() + this.currentControls[key];
        } else {
            return this.currentControls[key];
        }
    }

    /**
     * Remaps an input
     * @param {string} key - an input name (like "up" or "confirm")
     * @param {string} value - a gamepad button or keyboard key
     */
    ChangeInputBinding(key, value) {
        (this.usingGamepad ? this.gamepadControls : this.keyboardControls)[key] = value;
        this.ResetControlArray();
    }

    /** resets the controlArray to the currently accepted keys or buttons */
    ResetControlArray() {
        if(this.usingGamepad) { this.controlArray = Object.keys(this.gamepadControls).map(k => this.gamepadControls[k]); }
        else { this.controlArray = Object.keys(this.keyboardControls).map(k => this.keyboardControls[k]); }
    }

    /**
     * Switches to using gamepad controls and sets the index of the gamepad for this GameInput
     * @param {number} idx
     */
    SetGamepad(idx) {
        this.usingGamepad = true;
        this.gamepadIndex = idx;
        this.currentControls = this.gamepadControls;
    }

    /**
     * Toggle between Keyboard or Gamepad controls
     * @param {boolean} isGamepad - "true" for gamepad, "false" for keyboard
     */
    ToggleControlType(isGamepad) {
        this.usingGamepad = isGamepad;
        this.currentControls = isGamepad ? this.gamepadControls : this.keyboardControls;
    }

    /**
     * Returns whether or not the player JUST pressed the key or button in question
     * @param {"up" | "left" | "down" | "right" | "confirm" | "cancel" | "pause" } key
     * @returns {boolean}
     */
    IsFreshKeyPress(key) {
        return this.justPressed[this.currentControls[key]] === 0;
    }

    /** 
     * Sets a primary movement direction.
     * @param {string} [key] - the key or button for up, down, left, or right
     */
    SetMainKey(key) {
        if(key === undefined) {
            if(this.freeMovementIntervals[this.currentControls.up] !== undefined) { this.mainFreeMovementDirectionKey = 0; }
            else if(this.freeMovementIntervals[this.currentControls.left] !== undefined) { this.mainFreeMovementDirectionKey = 1; }
            else if(this.freeMovementIntervals[this.currentControls.down] !== undefined) { this.mainFreeMovementDirectionKey = 2; }
            else if(this.freeMovementIntervals[this.currentControls.right] !== undefined) { this.mainFreeMovementDirectionKey = 3; }
            else { this.mainFreeMovementDirectionKey = undefined; }
        } else if(this.mainFreeMovementDirectionKey === undefined) {
            this.mainFreeMovementDirectionKey = [this.currentControls.up, this.currentControls.left, this.currentControls.down, this.currentControls.right].indexOf(key);
        }
    }

    /** Clears all intervals and keypresses */
    ClearAllKeys() {
        this.mainFreeMovementDirectionKey = undefined;
        for(const key in this.freeMovementIntervals) {
            clearInterval(this.freeMovementIntervals[key]);
            this.freeMovementIntervals[key] = undefined;
        }
    }

    /**
     * Modifier keys and such are only recognized by the browser's keydown and keyup events, but not keypress; this returns if a given key is affected by this
     * @param {string} key - a keyboard key
     * @returns {boolean}
     */
    IsIgnoredByKeyPress(key) {
        if(key.indexOf("Arrow") === 0) { return true; }
        if(key[0] === "F" && key.length > 1) { return true; }
        return ["Alt", "Shift", "Control", "CapsLock", "Tab", "Escape", "Backspace", "NumLock",
                "Delete", "End", "PageDown", "PageUp", "Home", "Insert", "ScrollLock", "Pause"].indexOf(key) >= 0;
    }

    /**
     * Returns the key from a Keyboard Event, converting it to lowercase if it is a single character (ex. "Shift" will remain unchanged, but "E" will be returned as "e")
     * @param {KeyboardEvent} e
     * @returns {string}
     */
    GetKey(e) { return e.key.length === 1 ? e.key.toLowerCase() : e.key; }

    /**
     * Checks if a given keydown event applies to this GameInput; if it does, convert the control type to Keyboard, then perform one of the following actions:
     *  if this key is ignored by keypress events, trigger a key press in the Game
     *  if this key is a movement key and free movement is enabled, set it as the main key and set an interval to trigger the Game's key press until the key is lifted
     * @param {KeyboardEvent} e
     */
    KeyDown(e) {
        const key = this.GetKey(e);
        if(this.controlArray.indexOf(key) < 0) { return; }
        this.ToggleControlType(false);
        this.justPressed[key] = this.justPressed[key] === undefined ? 0 : (this.justPressed[key] + 1);
        if([this.currentControls.up, this.currentControls.left, this.currentControls.down, this.currentControls.right].indexOf(key) >= 0 && this.freeMovement) {
            this.SetMainKey(key);
            if(this.freeMovementIntervals[key] !== undefined) { return; }
            const handler = this.gameHandler;
            this.freeMovementIntervals[key] = setInterval(function() {
                handler.KeyPress(key);
            }, 50);
        } else if(this.IsIgnoredByKeyPress(key)) { this.gameHandler.KeyPress(key); }        
    }

    /**
     * Checks if a given keyup event applies to this GameInput; if it does, mark the key as unpressed, and clear any free movement intervals
     * @param {KeyboardEvent} e
     */
    KeyUp(e) {
        const key = this.GetKey(e);
        if(this.controlArray.indexOf(key) < 0) { return; }
        this.justPressed[key] = -1;
        if([this.currentControls.up, this.currentControls.left, this.currentControls.down, this.currentControls.right].indexOf(key) >= 0 && this.freeMovement) {
            clearInterval(this.freeMovementIntervals[key]);
            this.freeMovementIntervals[key] = undefined;
            this.SetMainKey();
        }
    }

    /**
     * Checks if a given keypress event applies to this GameInput; if it does, trigger the Game's key press event,
     *  unless it is a movement button and free movement is enabled. In that case, the key presses will be sent to the Game by the intervals set in KeyDown
     * @param {KeyboardEvent} e
     */
    KeyPress(e) {
        const key = this.GetKey(e);
        if(this.controlArray.indexOf(key) < 0) { return; }
        if([this.currentControls.up, this.currentControls.left, this.currentControls.down, this.currentControls.right].indexOf(key) >= 0 && this.freeMovement) {
            return;
        }
        this.gameHandler.KeyPress(key);
        this.justPressed[key]++;
    }

    /**
     * Checks if a gamepad belongs to this input and, if it does, handle button presses and releases, triggering Game key presses when appropriate
     * @param {Gamepad} gp
     */
    ParseGamepad(gp) {
        if(gp === null || gp.index !== this.gamepadIndex) { return; }
        const buttonsDown = [];
        gp.buttons.forEach((e, i) => {
            if(e.pressed && e.value >= this.triggerMin && i < 16) { buttonsDown.push(i); }
        });
        gp.axes.forEach((e, i) => {
            if(e <= -this.deadZones[i]) {
                buttonsDown.push(16 + i);
            } else if(e >= this.deadZones[i]) {
                buttonsDown.push(20 + i);
            }
        });
        if(buttonsDown.length > 0) { this.ToggleControlType(true); }
        this.gamepadButtons.forEach((prevState, i) => {
            const btn = (i < 16) ? ("Gamepad" + i) : ("GamepadA" + (i - 16));
            const movements = [this.currentControls.up, this.currentControls.left, this.currentControls.down, this.currentControls.right];
            if(buttonsDown.indexOf(i) < 0 && buttonsDown.indexOf(-i) < 0) { // not pressed
                if(prevState > 0) { // just released
                    this.gamepadButtons[i] = -1;
                    this.justPressed[btn] = -1;
                    if(movements.indexOf(btn) >= 0 && this.freeMovement) {
                        clearInterval(this.freeMovementIntervals[btn]);
                        this.freeMovementIntervals[btn] = undefined;
                        this.SetMainKey();
                    }
                } else { this.gamepadButtons[i] = 0; } // not pressed
            } else { // pressed
                this.gamepadButtons[i]++;
                const btnVal = this.gamepadButtons[i];
                if(btnVal === 1 || (btnVal >= 45 && btnVal % 15 === 0)) {
                    this.justPressed[btn] = this.justPressed[btn] === undefined ? 0 : (this.justPressed[btn] + 1);
                    if(movements.indexOf(btn) >= 0 && this.freeMovement) {
                        this.SetMainKey(btn);
                        if(this.freeMovementIntervals[btn] !== undefined) { return; }
                        const me = this, handler = this.gameHandler;
                        this.freeMovementIntervals[btn] = setInterval(function() {
                            handler.KeyPress(me.gamepadIndex.toString() + btn);
                        }, this.buttonDelay);
                    } else {
                        this.gameHandler.KeyPress(this.gamepadIndex.toString() + btn);
                    }
                }
            }
        });
    }
}
/** Class that handles all gamepad and keyboard events and passes them on to one or more GameInput objects */
class InputHandler {
    /**
     * an array of all active GameInputs. you only need one for each player.
     * @type {GameInput[]}
     */
    controlSets = [];
    /**
     * controllers need to control something, yeah? this is what this controls.
     * @type {GameHandler}
     */
    gameHandler = null;

    /** 
     * when true, no processing will be done and keypresses will be sent directly to the Game
     * @type {boolean}
    */
    forceCleanKeyPress = false;
    /**
     * when true, the next keypress event will be ignored; this value is automatically set back to false after the event is ignored
     * @type {boolean}
     */
    ignoreNextKeyPress = false;
    
    /**
     * keeps track of all gamepads currently connected to the computer that the browser is aware of
     * @type {{[key:string] : Gamepad }} 
     */
    gamepads = {};
    /**
     * the ID for the interval that regularly queries active gamepads for button presses. -1 when not querying.
     * @type {number}
     */
    gamepadQueryIdx = -1;

    /**
     * Sets up an InputHandler, which monitors gamepad connections and disconnections, keyboard events, and gamepad actions,
     * which are all in turn passed on to the Game
     * @param {GameHandler} handler
     */
    constructor(handler) {
        this.gameHandler = handler;
        const me = this;
        window.addEventListener("gamepadconnected", function(e) { me.GamepadConnected(/** @type {GamepadEvent} */ (e)); });
        window.addEventListener("gamepaddisconnected", function(e) { me.GamepadDisconnected(/** @type {GamepadEvent} */ (e)); });
        document.addEventListener("keypress", function(e) { me.KeyPress(e); });
        document.addEventListener("keydown", function(e) { me.KeyDown(e); });
        document.addEventListener("keyup", function(e) { me.KeyUp(e); });
    }

    /**
     * adds a new GameInput object to the control sets and returns its player number (its array position plus one)
     * @param {GameInput} gameInput
     * @returns {number}
    */
    RegisterNewGameInput(gameInput) {
        this.controlSets.push(gameInput);
        return this.controlSets.length;
    }
    /**
     * initializes the controlSets array to a nice default that may only be useful to me, or you if you just want to jump right in and worry about customizing stuff later
     * default player controls are WASD for movement, z to confirm, x to cancel, and Enter to pause.
     * @param {boolean} twoPlayers - if true, a second GameInput will be added, with default controls of arrow keys for movement, o to confirm, u to cancel, and p to pause.
     */
    SetToDefaultGameInputs(twoPlayers) {
        this.controlSets = [new GameInput(this.gameHandler, 1, { up: "w", left: "a", down: "s", right: "d", confirm: "z", cancel: "x", pause: "Enter" })];
        if(twoPlayers) {
            this.controlSets.push(new GameInput(this.gameHandler, 2, { up: "ArrowUp", left: "ArrowLeft", down: "ArrowDown", right: "ArrowRight", confirm: "o", cancel: "u", pause: "p" }));
        }
    }

    /**
     * Registers a new gamepad, starts querying gamepads if querying hasn't already started, and sets a GameInput to use the gamepad
     * @param {GamepadEvent} e
     */
    GamepadConnected(e) {
        this.gamepads[e.gamepad.index] = e.gamepad;
        console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.", e.gamepad.index, e.gamepad.id, e.gamepad.buttons.length, e.gamepad.axes.length);
        if(e.gamepad.index === 0 && this.controlSets.length >= 1) {
            this.controlSets[0].SetGamepad(0);
        } else if(e.gamepad.index === 1 && this.controlSets.length >= 2) {
            this.controlSets[1].SetGamepad(1);
        }
        if(this.gamepadQueryIdx < 0) {
            const me = this;
            this.gamepadQueryIdx = setInterval(function() { me.QueryGamepads(); }, 10);
        }
    }
    /**
     * Disconnects a gamepad and ends gamepad querying if none remain
     * @param {GamepadEvent} e
     */
    GamepadDisconnected(e) {
        delete this.gamepads[e.gamepad.index];
        if(Object.keys(this.gamepads).length === 0) {
            console.log("no gamepads left!");
            clearInterval(this.gamepadQueryIdx);
            this.gamepadQueryIdx = -1;
        }
    }
    /** Polls gamepads and passes on information to the registered GameInputs */
    QueryGamepads() {
        const gamepads = navigator.getGamepads();
        if(gamepads === undefined || gamepads === null || !document.hasFocus()) { return; }
        const numGamepads = gamepads.length;
        for(let i = 0; i < numGamepads; i++) {
            this.controlSets.forEach(c => c.ParseGamepad(gamepads[i]));
        }
    }
    /**
     * Passes on keypress events to the registered GameInputs
     * @param {KeyboardEvent} e
     */
    KeyPress(e) {
        if(this.forceCleanKeyPress) { return; }
        if(this.ignoreNextKeyPress) { // NOTE: is this a hack? yes. does it work? also yes.
            this.ignoreNextKeyPress = false;
            return;
        }
        this.controlSets.forEach(c => c.KeyPress(e));
    }
    /**
     * Passes on keydown events to the registered GameInputs
     * @param {KeyboardEvent} e
     */
    KeyDown(e) {
        if(this.forceCleanKeyPress) { this.gameHandler.KeyPress(e.key); return; }
        this.controlSets.forEach(c => c.KeyDown(e));
    }
    /**
     * Passes on keyup events to the registered GameInputs
     * @param {KeyboardEvent} e
     */
    KeyUp(e) { this.controlSets.forEach(c => c.KeyUp(e)); }
};
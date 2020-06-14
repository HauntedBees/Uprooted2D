class Interaction {
    constructor() {
        this.finished = false;
    }
    /**
     * @param {WorldScreen} worldmap
     * @returns {boolean}
     */
    Start(worldmap) {
        return true;
    }
    /**
     * @param {WorldScreen} worldmap
     */
    Advance(worldmap) {

    }
}
class TransitionInteraction extends Interaction {
    /**
     * @param {typeof GameScreen | typeof ShopScreen | typeof WorldScreen} targetClass
     * @param {any} args
     */
    constructor(targetClass, args) {
        super();
        this.targetClass = targetClass;
        this.args = args;
        this.forceDir = -1;
        this.sound = "";
    }
    /**
     * @param {WorldScreen} worldmap
     * @returns {boolean}
     */
    Start(worldmap) {
        if(this.forceDir >= 0) {
            if(worldmap.player.dir !== this.forceDir) {
                let dirMatch = false;
                switch(this.forceDir) {
                    case 0: dirMatch = (worldmap.player.moveDir & 1) !== 0; break;
                    case 1: dirMatch = (worldmap.player.moveDir & 2) !== 0; break;
                    case 2: dirMatch = (worldmap.player.moveDir & 4) !== 0; break;
                    case 3: dirMatch = (worldmap.player.moveDir & 8) !== 0; break;
                }
                if(!dirMatch) { return false; }
            }
        }
        if(this.sound !== "") { sound.PlaySound(this.sound, true); }
        game2.Transition(this.targetClass, this.args);
        this.finished = true;
        return true;
    }
}
class ShopInteraction extends TransitionInteraction {
    /** @param {string} shopName */
    constructor(shopName) {
        super(ShopScreen, shopName);
        this.sound = "entrance";
        this.forceDir = 0;
    }
}
class MapChangeInteraction extends TransitionInteraction {
    /** @param {string} destMap @param {EntityJSONPoint} destPos @param {number} destDir */
    constructor(destMap, destPos, destDir) {
        super(WorldScreen, {
            map: destMap,
            init: destPos,
            playerDir: destDir
        });
        this.sound = "entrance";
    }
}
class SingleInteraction extends Interaction {
    /** @param {string} key */
    constructor(key) {
        super();
        this.textKey = key;
    }
    /** @param {WorldScreen} worldmap */
    Start(worldmap) {
        worldmap.WriteText(this.textKey);
        this.finished = true;
        return true;
    }
    /** @param {WorldScreen} worldmap */
    Advance(worldmap) {
        worldmap.FinishInteraction();
    }
}
class SequenceInteraction extends Interaction {
    /** @param {string} key  */
    constructor(key) {
        super();
        this.key = key;
    }
    /** @param {WorldScreen} worldmap */
    Start(worldmap) {
        this.worldmap = worldmap;
        this.worldmap.inDialogue = true;

        this.idx = 0;
        this.animIdx = -1;
        /** @type {AnimInfo} */
        this.animInfo = null;
        this.finished = false;
        /** @type {string[]} */
        this.texts = [];
        /** @type {(string | number)[][]} */
        this.postItems = [];
        this.Advance(worldmap, true);
        return true;
    }
    /** @param {WorldScreen} worldmap @param {boolean} [isFirst] */
    Advance(worldmap, isFirst) {
        if(this.animIdx >= 0) { this.AnimFinish(); }
        isFirst = isFirst || false;
        if(this.texts.length > 0) {
            const newText = this.texts.shift();
            worldmap.WriteText(newText);
            return;
        }
        const curKey = this.key + this.idx++;
        console.log(curKey);
        const action = scripts[curKey];
        if(action === undefined) { this.finished = true; }
        if(this.finished) { return this.WrapUp(worldmap); }
        this.Parse(worldmap, action);
    }
    /** @param {WorldScreen} worldmap */
    WrapUp(worldmap) {
        worldmap.FinishInteraction();
        /*
        if(iHandler.state.postItems.length > 0) {
            game.transition(game.currentInputHandler, worldmap.invClean, iHandler.state.postItems);
            iHandler.state.postItems = [];
        }
        if(game.target !== null) {
            if(game.target.moveToTalk) { game.target.moving = false; }
            else if(game.target.standAnim) { SetUpFellow(game.target, game.target.standAnim); }
        }
        return worldmap.finishDialog();*/
    }

    /** @param {WorldScreen} worldmap @param {any[]} [json] */
    ConditionCheck(worldmap, json) {
        for(let i = 0; i < json.length; i++) {
            if(!eval(json[i].q)) { continue; }
            this.idx = json[i].v;
            this.Advance(worldmap);
            return;
        }
    }
    /** @param {WorldScreen} worldmap @param {string} actionsStr */
    Parse(worldmap, actionsStr) {
        if(actionsStr[0] === "?") {
            if(actionsStr[1] === "?") {
                // TODO
                return SpecialFunctions[actionsStr.substring(2)](this.idx);
            } else {
                return this.ConditionCheck(JSON.parse(actionsStr.substring(1)));
            }
        }
        const actions = actionsStr.split("&");
        for(let i = 0; i < actions.length; i++) {
            const splitter = actions[i].split("_");
            const name = splitter[0]
            const action = splitter[1];
            const isPlayer = (name === "pl")
            const isTarget = (name === "targ");
            /** @type {WorldEntityBase} */
            const target = name === "" ? null : (isPlayer ? worldmap.player : (isTarget ? game2.target : worldmap.importantEntities[name]));
            const actDeets = action.split(":");
            const actSuffix = actDeets[1];
            switch(actDeets[0]) {
                // Animation Handling
                case "MOVE": this.Parse_Movement(target, isPlayer, actSuffix); break;
                case "ANIM": this.Parse_ChangeAnim(target, actSuffix); break;
                case "ANIMRESET": this.Parse_ResetAnim(target); break;
                case "ANIMPAUSE": this.Parse_PauseAnim(target); break;
                case "ANIMRESUME": this.Parse_ResumeAnim(target); break;
                case "VISIBLE": target.SetVisibility(actSuffix !== "true"); break;
                case "SETDIR": this.Parse_SetDir(target, parseInt(actSuffix)); break;
                // Player State Handlers
                case "GIVE": this.Parse_TryGive(actSuffix.split(",")); break;
                // Text Display
                case "TEXT": this.Parse_Text(actSuffix.split(",")); break;
                case "CLEARTEXT": this.Parse_ClearText(); break;
                // Target Manipulation
                case "CLEARTARGET": this.worldmap.ClearTarget(); break;
                case "SETTARGET": game2.target = target; break;
                case "CLEARENTITY": this.worldmap.ClearTarget(target); break;
                // Cutscene Logic
                case "QUIT": this.finished = true; this.WrapUp(this.worldmap); break; // QUIT halts immediately
                // Other
                case "SOUND": sound.PlaySound(actSuffix); break;
                case "SLEEP": this.Parse_Sleep(parseInt(actSuffix)); break;
                case "CUSTOM": this.Parse_Custom(actSuffix); break;
            }
        }
    }
    
    /* #region Animation */
    /**
     * @param {WorldEntityBase} target
     * @param {boolean} isPlayer
     * @param {string} moveData
     */
    Parse_Movement(target, isPlayer, moveData) {
        this.WrapUpAnyActiveAnimations();
        let dx = 0, dy = 0;
        const destination = parseFloat(moveData.substring(1));
        if(moveData[0] === "b") {
            dy = (destination > 0) ? 1 : -1;
            dx = (destination > 0) ? 1 : -1;
        } else if(moveData[0] === "y") {
            dy = (destination > 0) ? 1 : -1;
        } else {
            dx = (destination > 0) ? 1 : -1;
        }
        if(isPlayer) {
            this.worldmap.forceMove = true;
            switch(dx * 10 + dy) {
                case 1: this.worldmap.player.dir = 2; break;
                case -1: this.worldmap.player.dir = 0; break;
                case 10: this.worldmap.player.dir = 3; break;
                case -10: this.worldmap.player.dir = 1; break;
            }
        }
        this.animInfo = new SequenceAnimationInfo(target, isPlayer, dx, dy, destination);
        this.animIdx = window.setInterval(() => this.HandleAnim(), 16);
    }
    /** @param {WorldEntityBase} target @param {string} newAnimName */
    Parse_ChangeAnim(target, newAnimName) { target.ForceAnimation(newAnimName); }
    /** @param {WorldEntityBase} target */
    Parse_ResetAnim(target) { target.UnforceAnimation(); }
    /** @param {WorldEntityBase} target */
    Parse_PauseAnim(target) { target.PauseAnimation(); }
    /** @param {WorldEntityBase} target */
    Parse_ResumeAnim(target) { target.ResumeAnimation(); }
    /** @param {WorldEntityBase} target @param {number} direction */
    Parse_SetDir(target, direction) {
        target.dir = direction;
    }
    AnimFinish() {
        this.WrapUpAnyActiveAnimations();
        this.Advance(this.worldmap);
        return true;
    }
    WrapUpAnyActiveAnimations() {
        if(this.animIdx >= 0) {
            clearInterval(this.animIdx);
            this.animIdx = -1;
        }
        if(this.animInfo !== null) {
            this.animInfo.ForceEnd();
            this.animInfo = null;
        }
    }
    HandleAnim() {
        const isFinished = this.animInfo.Advance(2);
        if(isFinished) { return this.AnimFinish(); }
        return false;
    }
    /* #endregion */
    /* #region Player State Handlers */
    /** @param {string[]} itemArr */
    Parse_TryGive(itemArr) {
        const itemName = itemArr[0].replace("~", "_");
        const itemAmt = parseInt(itemArr[1]) || 1;
        if(game2.player.IncreaseItem(itemName, itemAmt)){ return; }
        this.postItems.push([itemName, itemAmt]);
    }
    /* #endregion */
    /* #region Text Display */
    /** @param {string[]} args */
    Parse_Text(args) {
        const text = args.splice(0, 1)[0];
        this.worldmap.inDialogue = true;
        if(text.indexOf("(") >= 0) {
            const rgx = /\((\d*)-(\d*)\)/g;
            const range = text.match(rgx)[0];
            const keyStart = text.replace(range, "");
            const nums = range.substring(1, range.length - 1).split("-");
            /** @type {string[]} */
            this.texts = [];
            const start = parseInt(nums[0]);
            const end = parseInt(nums[1]);
            for(let i = (start + 1); i <= end; i++) {
                this.texts.push(keyStart + i);
            }
            this.worldmap.WriteText(keyStart + nums[0]);
        } else {
            this.worldmap.WriteText(text, args);
        }
    }
    Parse_ClearText() {
        gfx2.EmptyContainer(this.worldmap.textContainer.children[0]);
    }
    /* #endregion */
    /* #region Other */
    /** @param {number} time */
    Parse_Sleep(time) {
        this.WrapUpAnyActiveAnimations();
        this.animInfo = new AnimInfo();
        this.worldmap.inDialogue = true;
        this.animIdx = window.setInterval(() => this.HandleAnim(), time);
    }
    /** @param {string} customName */
    Parse_Custom(customName) {

    }
    /* #endregion */
}

class AnimInfo {
    constructor() { }
    /** @param {number} moveSpeed */
    Advance(moveSpeed) { return true; }
    ForceEnd() { }
}

class SequenceAnimationInfo extends AnimInfo {
    /**
     * @param {WorldEntityBase} target
     * @param {boolean} isPlayer
     * @param {number} dx
     * @param {number} dy
     * @param {number} destination
     */
    constructor(target, isPlayer, dx, dy, destination) {
        super();
        this.target = target;
        this.target.moving = true;
        this.isPlayer = isPlayer;
        this.dx = dx;
        this.dy = dy;
        this.movedX = 0;
        this.movedY = 0;
        this.initX = target.pos.x;
        this.initY = target.pos.y;
        this.destination = destination;
    }
    /** @param {number} moveSpeed */
    Advance(moveSpeed) {
        this.movedX += this.dx * moveSpeed;
        this.movedY += this.dy * moveSpeed;
        this.target.SetPos({ x: this.initX + this.movedX, y: this.initY + this.movedY });
        let finished = false, idx = this.dx * 2 + this.dy;
        switch(idx) {
            case 1: finished = (this.movedY >= this.destination); break;
            case -1: finished = (this.movedY <= this.destination); break;
            case 2: finished = (this.movedX >= this.destination); break;
            case -2: finished = (this.movedX <= this.destination); break;
            case 3: finished = (this.movedX >= this.destination); break;
            case -3: finished = (this.movedX <= this.destination); break;
        }
        if(finished) {
            this.target.moving = false;
            switch(Math.abs(idx)) {
                case 1: this.target.pos.y = this.initY + this.destination; break;
                case 2: this.target.pos.x = this.initX + this.destination; break;
            }
        }
        return finished;
    }
    ForceEnd() {
        let newX = (this.dx !== 0) ? (this.initX + this.destination) : this.initX;
        let newY = (this.dy !== 0) ? (this.initY + this.destination) : this.initY;
        this.target.SetPos({ x: newX, y: newY });
        this.target.moving = false;
    }
}
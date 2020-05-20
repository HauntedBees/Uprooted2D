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
    Advance(worldmap) {

    }
}
class TransitionInteraction extends Interaction {
    /**
     * @param {typeof GameScreen | typeof ShopScreen} targetClass
     * @param {string | any[]} args
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
    /**
     * @param {string} shopName
     */
    constructor(shopName) {
        super(ShopScreen, shopName);
        this.sound = "entrance";
        this.forceDir = 0;
    }
}
class SingleInteraction extends Interaction {
    constructor(key) {
        super();
        this.textKey = key;
    }
    Start(worldmap) {
        worldmap.WriteText(this.textKey);
        this.finished = true;
        return true;
    }
    Advance(worldmap) {
        // if(this.waitForAnimation) { iHandler.SpeedUpAnimation(); }
        worldmap.FinishInteraction();
    }
}
class SequenceInteraction extends Interaction {
    constructor(key) {
        super();
        this.key = key;
    }
    /** @param {WorldScreen} worldmap */
    Start(worldmap) {
        this.worldmap = worldmap;
        this.idx = 0;
        this.finished = false;
        this.texts = [];
        this.postItems = [];
        this.Advance(worldmap, true);
        return true;
    }
    /** @param {WorldScreen} worldmap @param {boolean} [isFirst] */
    Advance(worldmap, isFirst) {
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

    ConditionCheck(worldmap, json) {
        for(let i = 0; i < json.length; i++) {
            if(!eval(json[i].q)) { continue; }
            this.idx = json[i].v;
            this.Advance(worldmap);
            return;
        }
    }
    Parse(worldmap, actions) {
        if(actions[0] === "?") {
            if(actions[1] === "?") {
                // TODO
                return SpecialFunctions[actions.substring(2)](this.idx);
            } else {
                return this.ConditionCheck(JSON.parse(actions.substring(1)));
            }
        }
        actions = actions.split("&");
        for(let i = 0; i < actions.length; i++) {
            const splitter = actions[i].split("_");
            const name = splitter[0]
            const action = splitter[1];
            const isPlayer = (name === "pl")
            const isTarget = (name === "targ");
            const target = name === "" ? null : (isPlayer ? worldmap : (isTarget ? game2.target : worldmap.importantEntities[name]));
            const actDeets = action.split(":");
            const actSuffix = actDeets[1];
            switch(actDeets[0]) {
                // Player State Handlers
                case "GIVE": this.Parse_TryGive(actSuffix.split(",")); break;
                // Text Display
                case "TEXT": this.Parse_Text(actSuffix.split(",")); break;
            }
        }
    }
    
    /* #region Player State Handlers */
    Parse_TryGive(itemArr) {
        const itemName = itemArr[0].replace("~", "_");
        const itemAmt = parseInt(itemArr[1]) || 1;
        if(game2.player.IncreaseItem(itemName, itemAmt)){ return; }
        this.postItems.push([itemName, itemAmt]);
    }
    /* #endregion */
    /* #region Text Display */
    Parse_Text(args) {
        const text = args.splice(0, 1)[0];
        if(text.indexOf("(") >= 0) {
            const rgx = /\((\d*)-(\d*)\)/g;
            const range = text.match(rgx)[0];
            const keyStart = text.replace(range, "");
            const nums = range.substring(1, range.length - 1).split("-");
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
    /* #endregion */
}
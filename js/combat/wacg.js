function ChildrensCardGame(e) {
    this.ForceCardIntoLocation = (x, y, card) => combat.enemyGrid[x][y] = GetCrop(card);
    this.SetAttack = () => this.DEBUG_forcedOption = "attack";
    this.DEBUG_forcedOption = "";
    this.GetStartingDeck = function() {
        return [ "char0", "char1", "char2", "char3", "char4", "char4", "elem0", "elem1", "elem2", "elem3", "elem0", "elem1", "elem2", "elem3", "elem0", 
                 "elem1", "elem2", "elem3", "elem0", "elem1", "elem2", "elem3", "fx0", "fx0", "fx1", "fx1", "fx2", "fx3", "fx3", "fx4", "fx4" ];
    };
    this.DrawCard = function() {
        const card = this.deck.splice(Range(0, this.deck.length), 1)[0];
        if(card === undefined) { return false; }
        this.hand.push(card);
        return true;
    };
    this.HandleStatusEffectsAndReturnIfCanAttackAgain = function() {
        let effectsInPlay = [], charState = 0;
        for(let x = 0; x < combat.enemyGrid.length; x++) {
            for(let y = 0; y < combat.enemyGrid[0].length; y++) {
                const tile = combat.enemyGrid[x][y];
                if(tile === null) { continue; }
                if(tile.name.indexOf("fx") === 0) { effectsInPlay.push(tile.name); }
                if(tile.name.indexOf("char") === 0) { charState = (tile.inDefensePosition ? 2 : 1); }
            }
        }
        const hasDefBoost = (effectsInPlay.indexOf("fx0") >= 0);
        const hasAtkBoost = (effectsInPlay.indexOf("fx1") >= 0);
        switch(charState) {
            case 0:
                cardPlayer.atk = Math.floor(hasAtkBoost ? (cardPlayer.baseatk / 3) : (cardPlayer.baseatk / 4));
                cardPlayer.def = Math.floor(hasDefBoost ? (cardPlayer.basedef / 3) : (cardPlayer.basedef / 4));
                break;
            case 1:
                cardPlayer.atk = Math.floor(hasAtkBoost ? (cardPlayer.baseatk * 1.5) : (cardPlayer.baseatk / 1.25));
                cardPlayer.def = Math.floor(hasDefBoost ? (cardPlayer.basedef * 1.2) : (cardPlayer.basedef * 0.8));
                break;
            case 2:
                cardPlayer.atk = Math.floor(hasAtkBoost ? (cardPlayer.baseatk * 1.2) : (cardPlayer.baseatk * 0.8));
                cardPlayer.def = Math.floor(hasDefBoost ? (cardPlayer.basedef * 1.5) : (cardPlayer.basedef * 1.25));
                break;
        }
        if(effectsInPlay.indexOf("fx4") >= 0) {
            combat.season = 3;
            combat.adjustEnemyStatsWeather();
        }
        return effectsInPlay.indexOf("fx2") >= 0;
    };
    this.MakeMove = function() {
        let cardsOnField = [], effectsInPlay = [];
        let hasCharacter = false, numElems = 0, numFx = 0;
        for(let x = 0; x < combat.enemyGrid.length; x++) {
            for(let y = 0; y < combat.enemyGrid[0].length; y++) {
                const tile = combat.enemyGrid[x][y];
                if(tile === null) { continue; }
                cardsOnField.push([tile.name, x, y]);
                if(tile.name.indexOf("char") === 0) { hasCharacter = true; }
                else if(tile.name.indexOf("elem") === 0) { numElems++; }
                else { numFx++; effectsInPlay.push(tile.name); }
            }
        }
        if(this.hand.length < 5) { // only draw a card if the hand has less than 5 cards in it
            if(!this.DrawCard()) { // if there are no cards left, reshuffle the deck
                this.deck = this.GetStartingDeck();
                for(let i = 0; i < cardsOnField.length; i++) { // remove cards already on the field
                    const idx = this.deck.indexOf(cardsOnField[i]);
                    this.deck.splice(idx, 1);
                }
                for(let i = 0; i < this.hand.length; i++) {  // remove cards already in the hand
                    const idx = this.deck.indexOf(this.hand[i]);
                    this.deck.splice(idx, 1);
                }
                return new CardGameChoice("shuffle");
            }
        }
        if(!hasCharacter) { // gotta have a character card on the field!
            for(let i = 0; i < this.hand.length; i++) {
                if(this.hand[i].indexOf("char") < 0) { continue; }
                let cardCrop = GetCrop(this.hand[i]);
                cardCrop.inDefensePosition = Math.random() < 0.5;
                combat.enemyGrid[1][1] = cardCrop;
                this.hand.splice(i, 1);
                return new CardGameChoice((cardCrop.inDefensePosition ? "placedef" : "placeatk"), cardCrop);
            }
            const discard = this.hand.splice(Math.floor(Math.random() * this.hand.length), 1)[0];
            if(discard === undefined) { console.log("idle 81"); return new CardGameChoice("idle"); } // this shouldn't ever actually happen
            return new CardGameChoice("discard", GetCrop(discard));
        }
        let elemsInHand = 0, fxInHand = 0;
        for(let i = 0; i < this.hand.length; i++) {
            if(this.hand[i].indexOf("elem") === 0) { elemsInHand++; }
            else if(this.hand[i].indexOf("fx") === 0) { fxInHand++; }
        }
        let options = ["switchPosition", "attack", "attack"];
        if((elemsInHand + fxInHand) < Math.ceil(this.hand.length / 2)) { options.push("discardCharacter"); }
        if(numElems < 2 && elemsInHand > 0) { options.push("placeElem"); options.push("placeElem"); }
        if(numElems == 2) { options.push("retractElem"); }
        if(numFx < 3 & fxInHand > 0) { options.push("placeFx"); }
        const chosenOption = this.DEBUG_forcedOption !== "" ? this.DEBUG_forcedOption : RandomArrayItem(options);
        //let chosenOption = options.splice(Math.floor(Math.random() * options.length), 1)[0];
        if(chosenOption === "attack") {
            const charCard = combat.enemyGrid[1][1];
            const elemOne = combat.enemyGrid[1][0];
            const elemTwo = combat.enemyGrid[1][2];
            if(elemOne !== null && elemTwo !== null) { return new CardGameChoice("attack2", charCard, [elemOne, elemTwo], effectsInPlay); }
            else if(elemOne !== null) { return new CardGameChoice("attack1", charCard, [elemOne], effectsInPlay); }
            else if(elemTwo !== null) { new CardGameChoice("attack1", charCard, [elemTwo], effectsInPlay); }
            else { return new CardGameChoice("attack0", charCard, undefined, effectsInPlay); }
        } else if(chosenOption === "switchPosition") {
            const cardCrop = combat.enemyGrid[1][1];
            if(cardCrop === null) { console.log("idle 105"); return new CardGameChoice("idle"); } // this shouldn't ever actually happen
            combat.enemyGrid[1][1].inDefensePosition = !cardCrop.inDefensePosition;
            return new CardGameChoice((cardCrop.inDefensePosition ? "swapdef" : "swapatk"), cardCrop);
        } else if(chosenOption == "discardCharacter") {
            for(let i = 0; i < this.hand.length; i++) {
                if(this.hand[i].indexOf("char") < 0) { continue; }
                const cardCrop = GetCrop(this.hand[i]);
                this.hand.splice(i, 1);
                return new CardGameChoice("discard", cardCrop);
            }
            console.log("idle 115");
            return new CardGameChoice("idle");  // this shouldn't ever actually happen
        } else if(chosenOption === "placeElem") {
            for(let i = 0; i < this.hand.length; i++) {
                if(this.hand[i].indexOf("elem") < 0) { continue; }
                const cardCrop = GetCrop(this.hand[i]);
                if(combat.enemyGrid[1][0] === null) { combat.enemyGrid[1][0] = cardCrop; }
                else if(combat.enemyGrid[1][2] === null) { combat.enemyGrid[1][2] = cardCrop; }
                else { console.log("idle 123"); return new CardGameChoice("idle"); } // this shouldn't ever actually happen
                this.hand.splice(i, 1);
                return new CardGameChoice("placeElem", cardCrop);
            }
            console.log("idle 127");
            return new CardGameChoice("idle");
        } else if(chosenOption === "retractElem") {
            if(combat.enemyGrid[1][2] !== null) {
                const cardCrop = combat.enemyGrid[1][2];
                combat.enemyGrid[1][2] = null;
                return new CardGameChoice("removeElem", cardCrop);
            } else if(combat.enemyGrid[1][0] !== null) {
                const cardCrop = combat.enemyGrid[1][0];
                combat.enemyGrid[1][0] = null;
                return new CardGameChoice("removeElem", cardCrop);
            } else { console.log("idle 138"); return new CardGameChoice("idle"); } // this shouldn't ever actually happen
        } else if(chosenOption === "placeFx") {
            for(let i = 0; i < this.hand.length; i++) {
                if(this.hand[i].indexOf("fx") < 0) { continue; }
                const cardCrop = GetCrop(this.hand[i]);
                if(combat.enemyGrid[0][0] === null) { combat.enemyGrid[0][0] = cardCrop; }
                else if(combat.enemyGrid[0][2] === null) { combat.enemyGrid[0][2] = cardCrop; }
                else if(combat.enemyGrid[0][1] === null) { combat.enemyGrid[0][1] = cardCrop; }
                else { console.log("idle 146"); return new CardGameChoice("idle"); } // this shouldn't ever actually happen
                this.hand.splice(i, 1);
                return new CardGameChoice("placeFx", cardCrop);
            }
            return new CardGameChoice("idle");
        } else { console.log("idle 152"); return new CardGameChoice("idle"); } // this shouldn't ever actually happen
    };
    let cardPlayer = e;
    this.hand = [];
    this.deck = this.GetStartingDeck();
    for(let i = 0; i < 5; i++) { this.DrawCard(); }
};

function CardGameChoice(action, card, secondaryCards, effects) {
    this.textID = "wacg." + action;
    this.isAttack = (action.indexOf("attack") === 0);
    this.action = action;
    if(action !== "idle") {
        this.cardName = card.displayname;
        this.activeEffects = effects;
        if(card.name.indexOf("fx") === 0) { this.arg = GetText("wacg." + card.name); }
        else if(secondaryCards !== undefined) {
            this.arg = secondaryCards[0].displayname;
            this.argval = secondaryCards[0].name;
            if(secondaryCards[1] !== undefined) {
                this.arg2 = secondaryCards[1].displayname;
                this.arg2val = secondaryCards[1].name;
            }
        }
    }
    if(this.isAttack) {
        this.animData = "ATTACK"; // for attack1 and attack2, this will be changed in actions.CARDGAME()
    } else {
        this.animData = action === "idle" ? "STAND" : "PLANT";
    }
}
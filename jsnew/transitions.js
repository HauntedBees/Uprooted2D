class TransitionAnimation {
    /**
     * @param {GameHandler} game - the game
     * @param {number} fadeFrames - how many frames to fade in and out for
     * @param {number} holdFrames - how many frames to hold in the middle for
     * @param {number} framesPerSecond - how many of those frames should happen per second
     * @param {() => void} midpointCallback - callback for when the midpoint has been reached; this is probably where you should actually do your GameScreen swapping out
     * @param {() => void} finishedCallback - callback for when the transition has completed; here you should probably just unset the Game.transitionAnim member
     */
    constructor(game, fadeFrames, holdFrames, framesPerSecond, midpointCallback, finishedCallback) {
        this.game = game;
        
        this.active = true;
        this.state = 0;
        this.currentFrame = 0;

        this.fadeFrames = fadeFrames;
        this.holdFrames = holdFrames;
        this.midpointCallback = midpointCallback;
        this.finishedCallback = finishedCallback;
        const me = this;
        this.animIdx = setInterval(function() { me.Animate(); }, 1000 / framesPerSecond);
    }
    Animate() {
        if(!this.active) { return; }
        if(this.state === 0) {
            if(++this.currentFrame >= this.fadeFrames) {
                this.state = 1;
                this.currentFrame = 0;
                this.midpointCallback();
                this.DrawHold(1);
            } else {
                this.DrawFadeIn(this.currentFrame / this.fadeFrames);
            }
        } else if(this.state === 1) {
            this.DrawHold(1);
            if(++this.currentFrame >= this.holdFrames) {
                this.state = 2;
                this.currentFrame = 0;
            }
        } else if(this.state === 2) {
            if(++this.currentFrame >= this.fadeFrames) {
                this.active = false;
                this.finishedCallback();
                clearInterval(this.animIdx);
            } else {
                this.DrawFadeOut(this.currentFrame / this.fadeFrames);
            }
        }
    }
    /**
     * Draws transition animation frame while the transition is fading in
     * @param {number} percentage - from 0 to 1, how close to completion the fade-in is
     */
    DrawFadeIn(percentage) {
        
    }
    /**
     * Draws transition animation frame while the transition is in the middle
     * @param {number} percentage - from 0 to 1, how close to completion the middle hold is
     */
    DrawHold(percentage) {
        
    }
    /**
     * Draws transition animation frame while the transition is fading out
     * @param {number} percentage - from 0 to 1, how close to completion the fade-out is
     */
    DrawFadeOut(percentage) {
        
    }
    CleanUp() {
        this.active = false;
        clearInterval(this.animIdx);
        const children = gfx2.transitionContainer.children;
        for(let i = children.length - 1; i >= 0; i--) {
            gfx2.transitionContainer.removeChild(children[i]);
        }
    }
}

class CropTransition extends TransitionAnimation {
    /**
     * @param {GameHandler} game
     * @param {number} fadeFrames
     * @param {number} holdFrames
     * @param {number} framesPerSecond
     * @param {() => void} midpointCallback
     * @param {() => void} finishedCallback
     */
    constructor(game, fadeFrames, holdFrames, framesPerSecond, midpointCallback, finishedCallback) {
        super(game, fadeFrames, holdFrames, framesPerSecond, midpointCallback, finishedCallback);
        // @ts-ignore
        this.crop = "trans" + Range(0, 20);
        this.size = 0.5;
        /** @type {PIXIObj[]} */
        this.sprites = [];
        for(let y = 0; y < game.tileh + 2; y += 2) {
            for(let x = 0; x < game.tilew + 2; x += 2) {
                const s = gfx2.CreateSmallSprite(this.crop, x - (y % 4 ? 1 : 0), y + 0.5, true);
                [s.anchor.x, s.anchor.y] = [0.5, 0.5];
                [s.scale.x, s.scale.y] = [0.5, 0.5];
                this.sprites.push(s);
            }
        }
        gfx2.AddToTransitionContainer(this.sprites);
    }
    DrawFadeIn(percentage) {
        this.sprites.forEach(e => {
            const amt = 0.5 + 4.5 * percentage;
            [e.scale.x, e.scale.y] = [amt, amt];
        });
    }
    DrawFadeOut(percentage) {
        this.sprites.forEach(e => {
            const amt = 0.5 + 4.5 * (1 - percentage);
            [e.scale.x, e.scale.y] = [amt, amt];
        });
    }
}

class SleepTransition extends TransitionAnimation {
    /**
     * @param {GameHandler} game
     * @param {number} fadeFrames
     * @param {number} holdFrames
     * @param {number} framesPerSecond
     * @param {() => void} midpointCallback
     * @param {() => void} finishedCallback
     */
    constructor(game, fadeFrames, holdFrames, framesPerSecond, midpointCallback, finishedCallback) {
        super(game, fadeFrames, holdFrames, framesPerSecond, midpointCallback, finishedCallback);
        this.size = 0.25;
        /** @type {PIXIObj[]} */
        this.sprites = [];
        for(let y = 0; y < game.tileh + 2; y += 2) {
            for(let x = 0; x < game.tilew + 2; x += 2) {
                const s = gfx2.CreateSmallSprite("transZzz", x - (y % 4 ? 1 : 0), y + 0.5, true);
                [s.anchor.x, s.anchor.y] = [0.5, 0.5];
                [s.scale.x, s.scale.y] = [0.5, 0.5];
                this.sprites.push(s);
            }
        }
        gfx2.AddToTransitionContainer(this.sprites);
        this.rect = gfx2.CreateRectangle(0x000000, 0, 0);
        this.rect.visible = false;
        this.sunUp = gfx2.CreateImg("wakeup", gfx2.width / 2, gfx2.height / 2);
        [this.sunUp.anchor.x, this.sunUp.anchor.y] = [0.5, 0.5];
        this.sunUp.visible = false;

        const player = game2.player;
        const doDream = (Math.random() + player.dreamBonus) > 0.7;
        player.dreamBonus = doDream ? 0 : (2 * player.dreamBonus + 0.1);
        const textKey = doDream ? `innDream${MathB.Range(0, 10)}` : "innSleep";
        this.text = gfx2.WriteWrappedText(GetText(textKey), "stdWhite", 10, 10, gfx2.width - 20, "left");
        this.text.visible = false;

        gfx2.AddToTransitionContainer([this.rect, this.sunUp, this.text]);
    }
    DrawFadeIn(percentage) {
        this.sprites.forEach(e => {
            const amt = 0.25 + 9.5 * percentage;
            [e.scale.x, e.scale.y] = [amt, amt];
        });
    }
    SwitchToMiddle() {
        this.rect.visible = true;
        this.text.visible = true;
        for(let i = this.sprites.length - 1; i >= 0; i--) {
            gfx2.transitionContainer.removeChild(this.sprites[i]);
        }
        this.active = false;
    }
    FinishMiddle() {
        this.rect.visible = false;
        this.text.visible = false;
        this.sunUp.visible = true;
        this.active = true;
    }
    DrawFadeOut(percentage) {
        this.rect.visible = false;
        const amt = 1 + 50 * percentage;
        [this.sunUp.scale.x, this.sunUp.scale.y] = [amt, amt];
    }
}
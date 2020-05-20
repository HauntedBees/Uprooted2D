class PottyCheckScreen extends GameScreen {
    constructor() {
        super();
        this.cursory = 0;
        this.state = 0;
        //screenReaderHelper.SayThing(GetText("pottyWordPanic"), "other", GetText("pottyNo"));
        this.tiles = [];
        for(let x = 0; x < game2.tilew; x++) {
            for(let y = 0; y < game2.tileh; y++) {
                this.tiles.push(gfx2.CreateSmallSprite("optTile", x, y, true));
            }
        }
        this.gfxContainers = {
            "bg": gfx2.CreateContainer(this.tiles),
            "box": gfx2.CreateContainer([gfx2.DrawBox("FarmInfo", 0.5, 4.5, 14, 4, true)]),
            "text": gfx2.CreateContainer([gfx2.WriteWrappedText(GetText("pottyWordPanic"), "std", 512, 320, 900, "center")])
        }
        const me = this;
        this.menuItemObjs = [
            new InfoText(GetText("pottyNo"), 512, 420, true, function() { me.MenuItemClicked(0); }, function() { me.CursorMove(0); }),
            new InfoText(GetText("pottyYes"), 512, 480, false, function() { me.MenuItemClicked(1); }, function() { me.CursorMove(1); })
        ];
    }
    CleanUp() {
        super.CleanUp();
        this.menuItemObjs.forEach(m => m.CleanUp());
    }
    SwitchToConfirmationText() {
        gfx2.RemoveContainer(this.gfxContainers["text"]);
        if(this.cursory === 0) {
            this.gfxContainers["text"] = gfx2.CreateContainer([
                gfx2.WriteWrappedText(GetText("pottyNo2"), "std", 512, 320, 900, "center")
            ]);
            //screenReaderHelper.SayThing(GetText("pottyNo2"), "other", "", true);
        } else {
            this.gfxContainers["text"] = gfx2.CreateContainer([
                gfx2.WriteWrappedText(GetText("pottyYes2"), "std", 512, 320, 900, "center")
            ]);
            //screenReaderHelper.SayThing(GetText("pottyYes2"), "other", "", true);
        }
        this.cursory = 0;
        this.menuItemObjs.forEach(e => e.CleanUp());
        const me = this;
        this.menuItemObjs = [
            new InfoText(GetText("pottyOK"), 512, 450, true, function() { me.MenuItemClicked(0); }, function() { me.CursorMove(0); })
        ];
    }
    KeyPress(key) {
        let pos = this.cursory, isEnter = false;
        switch(key) {
            case this.controls.up: pos--; break;
            case this.controls.down: pos++; break;
            case this.controls.confirm:
            case this.controls.pause: isEnter = true; break;
        }
        if(pos < 0 || pos > 1) { return false; }
        if(isEnter) { return this.Select(this.controls.IsFreshKeyPress("pause") || this.controls.IsFreshKeyPress("confirm")); }
        else { return this.CursorMove(pos); }
    }
    CursorMove(pos) {
        if(pos < 0 || pos > 1) { return false; }
        if(this.cursory !== pos) { Sounds.PlaySound("menuMove"); }
        this.menuItemObjs[this.cursory].Unselect();
        this.cursory = pos;
        this.menuItemObjs[this.cursory].Select();
        //screenReaderHelper.SayThing(GetText(this.cursory === 1 ? "pottyYes" : "pottyNo"), "option");
        return true;
    }
    MenuItemClicked(i) { this.CursorMove(i); this.Select(true); }
    Select(isFresh) {
        if(!isFresh) { return false; }
        Sounds.PlaySound("confirm", true);
        if(this.state === 0) {
            this.state = 1;
            //player.options.canSayFuck = this.cursory;
            this.SwitchToConfirmationText();
        } else {
            game2.Transition(WorldScreen, { init: { x: 17,  y: 9 }, map: "farm" });
            //game.transition(this, worldmap, { init: { x: 17,  y: 9 }, map: "farm" });
        }
    }
}
class TitleScreen extends GameScreen {
    constructor(cursory) {
        super();
        this.availableCrops = ["asparagus", "beet", "bellpepper", "carrot", "corn", "garlic", "ginger", "leek", "pineapple", "radish", "rhubarb", "spinach", "tomato", "lotus", "soybean"];
        this.cursory = cursory || 0;
        this.showContinue = false;
        for(let i = 0; i < game.numSaveSlots; i++) {
            if(localStorage.getItem("player" + i) !== null) {
                this.showContinue = true;
                break;
            }
        }
        if(this.cursory === 2 && ! this.showContinue) { this.cursory = 1; }
        this.animPos = 0;
        this.animCrops = [];
        this.animIdx = setInterval(() => this.Animate(), 40);
        this.menuItems = (this.showContinue ? ["title.new", "title.cont", "title.options", "menu.Quit"] : ["title.new", "title.options", "menu.Quit"]);
        this.clouds = [
            gfx2.CreateBigSprite("titlecloud", 0, 320),
            gfx2.CreateBigSprite("titlecloud", 256, 0),
            gfx2.CreateBigSprite("titlecloud", 768, 448)
        ];
        this.gfxContainers = {
            "title": gfx2.CreateContainer([
                gfx2.CreateImg("title", 0, 0),
                ...this.clouds,
                gfx2.CreateImg("titleTop", 0, 0)
            ]),
            "ground": gfx2.CreateContainer([
                gfx2.CreateImg("titleGround", 0, 640),
                gfx2.CreateImg("titleGround", 1024, 640)
            ]),
            "crops": gfx2.CreateContainer([], true),
            "menu": gfx2.CreateContainer([])
        };
    
        this.CreateMenu();
        for(let i = 0; i < 7; i++) { this.AddAnimCrop(true); }
        this.animCrops.sort((a, b) => b.y - a.y);
    }
    CreateMenu() {
        const dy = 6, container = this.gfxContainers["menu"];
        const me = this;
        this.menuItemObjs = this.menuItems.map((e, i) => {
            const sel = new TitleSelection(i, this.cursory === i, i + dy, GetText(e), function(i) { me.MenuItemClicked(i); }, function(i) { me.CursorMove(i); });
            container.addChild(sel.container);
            return sel;
        });
        this.cursor = gfx2.CreateSmallSprite("carrotSel", 5.5, (dy + this.cursory), true);
        container.addChild(this.cursor);
    }
    AddAnimCrop(onScreen) {
        const crop = GetCrop(RandomArrayItem(this.availableCrops));
        const frame = crop.name + Math.floor(Math.random() * crop.frames);
        const x = onScreen ? InclusiveRange(0, 1024) : InclusiveRange(1024, 1224);
        const y = InclusiveRange(616, 646);
        const s = gfx2.CreateSmallSprite(frame, x, y);
        this.gfxContainers["crops"].addChild(s);
        this.animCrops.push(s);
    }
    Animate() {
        const speed = 5;
        this.gfxContainers.ground.x -= speed;
        if(this.gfxContainers.ground.x <= -1024) {
            this.gfxContainers.ground.x += 1024;
        }
        for(let i = this.animCrops.length - 1; i >= 0; i--) {
            let e = this.animCrops[i];
            e.x -= speed;
            if(e.x <= -64) {
                this.animCrops.splice(i, 1);
                gfx2.RemoveContainer(e);
            }
        }
        for(let i = 0; i < this.clouds.length; i++) {
            let e = this.clouds[i];
            e.x += 0.1;
            if(e.x > 1024) { e.x = -100; }
        }
        if(Math.random() < 0.05 && this.animCrops.length < 30) { this.AddAnimCrop(); }
    }
    KeyPress(key) {
        let pos = this.cursory, isEnter = false;
        switch(key) {
            case this.controls.up: pos--; break;
            case this.controls.down: pos++; break;
            case this.controls.confirm:
            case this.controls.pause: isEnter = true; break;
        }
        if(pos < 0 || pos > 3) { return false; }
        if(isEnter) { return this.Select(this.controls.IsFreshKeyPress("pause") || this.controls.IsFreshKeyPress("confirm")); }
        else { return this.CursorMove(pos); }
    }
    CursorMove(pos) {
        if(pos < 0 || pos >= this.menuItems.length) { return false; }
        if(this.cursory !== pos) { Sounds.PlaySound("menuMove"); }
        this.menuItemObjs[this.cursory].Unselect();
        this.cursory = pos;
        this.menuItemObjs[this.cursory].Select();
        this.cursor.y = (6 + this.cursory) * 64;
        //screenReaderHelper.SayThing(GetText(this.menuItems[this.cursory]), "option");
        return true;
    }
    MenuItemClicked(i) { this.CursorMove(i); this.Select(true); }
    Select(isFresh) {
        if(!isFresh) { return false; }
        Sounds.PlaySound("confirm", true);
        switch(this.cursory) {
            case 0:
                return game2.Transition(PottyCheckScreen);
                //return game.transition(this, worldmap.pottyCheck);
            case 1:
                //if(this.showContinue) { return game.innerTransition(this, pausemenu.savemenu, { saving: false }); }
                //else { return game.innerTransition(this, worldmap.optionsMenu); }
            case 2: 
                //if(this.showContinue) { return game.innerTransition(this, worldmap.optionsMenu); }
                //else { return nwHelpers.Quit(); }
            case 3: //return nwHelpers.Quit();
        }
    }
}
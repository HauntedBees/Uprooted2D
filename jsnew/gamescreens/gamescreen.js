class GameScreen {
    constructor() {
        this.gfxContainers = {};
        this.active = true;
        this.controls = game2.inputHandler.controlSets[0];
    }
    CleanUp() {
        this.active = false;
        gfx2.CleanAllContainers();
    }
    KeyPress(key) {}
}
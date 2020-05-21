class PauseViewInventoryScreen extends PauseMenuSubscreen {
    constructor() {
        super();
        this.selectedCrop = -1;
        this.inSort = false;
        this.trashInfo = [];
        this.justSorted = -1;
        const elements = [
            gfx2.DrawBox("FarmInfo", -64, -64, gfx2.width + 64, 64, false)
        ];

        const player = game2.player;
        this.actualIndexes = [];
        let j = 0;
        const inventoryWidth = 3, dx = 0.5, dy = 1.5;
        for(let i = 0; i < player.inventory.length; i++) {
            if(player.inventory[i][0][0] === "_" || player.inventory[i][0][0] === "!") { continue; }
            const thisX = j % inventoryWidth + dx;
            const thisY = Math.floor(j / inventoryWidth) + dy;
            elements.push(gfx2.CreateSmallSprite("invBox", thisX, thisY, true));
            elements.push(gfx2.CreateInventoryItem(player.inventory[i], thisX, thisY, true));
            this.actualIndexes.push(i);
            j++;
        }
        for(let i = j; i < 36; i++) {
            const thisX = i % inventoryWidth + dx;
            const thisY = Math.floor(i / inventoryWidth) + dy;
            elements.push(gfx2.CreateSmallSprite("invBox", thisX, thisY, true));
        }
        this.backButton = new InfoText(GetText("menu.Back"), 64, 4, false, () => {}, () => {});
        this.sortButton = new InfoText(GetText("inv.Sort"), 192, 4, false, () => {}, () => {});
        elements.push(this.backButton.container, this.sortButton.container);
        // TODO: the border

        this.cropPowerDisplay = gfx2.DrawCropInfo(GetCrop(player.inventory[this.actualIndexes[0]][0]), "std", false, 285, 100, 640, 720, true);
        elements.push(...[
            gfx2.WriteText(GetText("inv.Heading"), "std", gfx2.width - 8, 8, "right"),
            gfx2.DrawBox("FarmInfo", 4, 1.25, 10.75, 11.5, true),
            this.cropPowerDisplay
        ]);

        this.containers.push(gfx2.CreateContainer(elements));
    }
    KeyPress(key) {

    }
    Select() {

    }
}
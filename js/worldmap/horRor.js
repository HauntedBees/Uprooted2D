function HorRor(playerStartingRoom) {
    let intensity = 64;
    let currentRoom = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11][Math.floor(Math.random() * 5)];
    let timeToNextMove = 20;
    let helpCounter = 0;
    let showHelp = false;
    let stopped = false;
    const neighbors = [
        [1], [7], [7, 9, 3], [9], [11, 5, 12], // 0 - 4
        [11, 4, 12], [9, 12], [1, 9, 8], [7, 9], [8, 6, 3], // 5 - 9
        [3, 4, 11], [4, 5], [6, 4, 5], [6, 12] // 10 - 13
    ];
    const roomSizeMultiplier = [0, 0.5, 0, 1, 0.9, 1.25, 0.85, 0.5, 1, 0.5, 0, 1.5, 0.9, 0];
    this.playerRoom = playerStartingRoom;
    this.Draw = function() {
        if(worldmap.mapName !== "hq_3") { return; }
        gfx.drawHorRor(intensity);
        if(this.playerRoom === 10 || player.completedQuest("helpNerd") || player.hasQuest("helpNerd")) { return; }
        if(showHelp) { gfx.drawHelp(); }
        if(--helpCounter > 0) { return; }
        showHelp = !showHelp;
        helpCounter = 160;
    };
    this.Pursue = function() {
        if(worldmap.mapName !== "hq_3") { return; }
        if(worldmap.inDialogue) { return; }
        if(intensity === 0) {
            stopped = true;
            this.inDialogue = true;
            this.forceEndDialog = false;
            worldmap.toggleMovement(false);
            this.dialogState = 0;
            intensity = 64;
            game.target = worldmap.importantEntities["theMonster"];
            iHandler.Start("ohFuck");
            return;
        }
        if(stopped) { return; }
        let doAdvance = true;
        if(currentRoom === this.playerRoom) {
            intensity = Math.max(0, intensity - (0.15 * roomSizeMultiplier[currentRoom] * (player.hasQuestState("helpNerd", "helping") ? 0.8 : 1)));
            doAdvance = false;
        } else if(neighbors[currentRoom].indexOf(this.playerRoom) >= 0) {
            intensity = Math.max(0, intensity + 0.1);
            timeToNextMove -= 1;
        } else {
            intensity = Math.min(64, intensity + 0.2);
        }
        if(doAdvance && --timeToNextMove <= 0) {
            timeToNextMove = 20 + Math.floor(Math.random() * 180);
            if(neighbors[currentRoom].indexOf(this.playerRoom) >= 0 && Math.random() > 0.35) {
                currentRoom = this.playerRoom;
            } else {
                currentRoom = neighbors[currentRoom][Math.floor(Math.random() * neighbors[currentRoom].length)];
            }
        }
    };
}
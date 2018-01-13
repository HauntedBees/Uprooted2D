function HorRor(playerStartingRoom) {
    var intensity = 64;
    var currentRoom = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11][Math.floor(Math.random() * 5)];
    var timeToNextMove = 20;
    var stopped = false;
    var neighbors = [
        [1], [7], [7, 9, 3], [2, 9, 10], [10, 11, 5, 12], // 0 - 4
        [11, 4, 12], [9, 12], [1, 2, 9, 8], [7, 9], [8, 6, 2, 3], // 5 - 9
        [3, 4, 11], [4, 10, 5], [6, 4, 5], [6, 12] // 10 - 13
    ];
    this.playerRoom = playerStartingRoom;
    this.Draw = function() { gfx.drawHorRor(intensity); };
    this.Pursue = function() {
        if(intensity === 0) {
            stopped = true;
            this.inDialogue = true;
            this.forceEndDialog = false;
            worldmap.toggleMovement(false);
            this.dialogState = 0;
            worldmap.horRor = null;
            iHandler.Start("ohFuck");
            return;
        }
        if(stopped) { return; }
        var doAdvance = true;
        if(currentRoom === this.playerRoom) {
            intensity = Math.max(0, intensity - 0.33);
            doAdvance = false;
        } else if(neighbors[currentRoom].indexOf(this.playerRoom) >= 0) {
            intensity = Math.max(0, intensity + 0.15);
            timeToNextMove -= 1;
        } else {
            intensity = Math.min(64, intensity + 0.3);
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
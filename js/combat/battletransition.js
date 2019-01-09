combat.transition = {
    spriteOffsets: [[1, 0], [1, 1], [0, 0], [1, 1], [3, 2], [1, 1], [2, 1], [1, 1], [1, 1], [1, 0], [0, 0], [1, 0], [1, 1], [1, 1], [0, 0], [1, 1], [2, 2], [2, 1], [1, 1], [0, 0]],
    frame: 0, elems: [], chosenCrop: 0, animIdx: 0, accel: 0.1,
    Start: function() {
        this.frame = 0;
        this.elems = [];
        this.accel = 0.1;
        this.chosenCrop = Range(0, 20);
        let remaining = gfx.tileHeight * 16;
        while(remaining > 0) {
            const crop = Range(0, 20);
            const offsets = this.spriteOffsets[crop];
            remaining -= (16 - offsets[0] - offsets[1]);
            this.elems.push(crop);
        }
        this.animIdx = setInterval(function() { combat.transition.Draw(); combat.transition.frame += 0.5; }, 10);
        this.Draw();
        this.frame += 0.5;
    },
    Draw: function() {
        gfx.clearLayer("menutextOverBlack");
        if(this.frame < 16) {
            let actualY = 16;
            for(let i = 0; i < this.elems.length; i++) {
                const me = this.elems[i];
                const offsets = this.spriteOffsets[me];
                if(i % 2 === 0) {
                    gfx.DrawTransitionImage("trans" + me, 0 + this.frame, (actualY - offsets[0] * 2) / 16, 2, false, "menutextOverBlack");
                    gfx.DrawBlackRect(0, actualY - 16, this.frame * 16 + 2, 2 * (16 - offsets[0] - offsets[1]), "menutextOverBlack");
                } else {
                    gfx.DrawTransitionImage("trans" + me, 16 - this.frame, (actualY - offsets[0] * 2) / 16, 2, false, "menutextOverBlack");
                    gfx.DrawBlackRect((16 - this.frame) * 16 - 2, actualY - 16, 288, 2 * (16 - offsets[0] - offsets[1]), "menutextOverBlack");                
                }
                actualY += 16 - offsets[0] + offsets[1] * 2;
            }
        } else if(this.frame === 16) {
            gfx.DrawBlackRect(0, 0, gfx.tileWidth * 16, gfx.tileHeight * 16, "menutextOverBlack");
            combat.innerStartBattle();
        } else if(this.frame < 32) {
            gfx.DrawBlackRect(0, 0, gfx.tileWidth * 16, gfx.tileHeight * 16, "menutextOverBlack");
            const size = (this.frame - 16) * (1 + this.accel);
            this.accel += 0.1;
            gfx.ctx["menutextOverBlack"].globalCompositeOperation = "destination-out";
            gfx.DrawTransitionImage("trans" + this.chosenCrop, game.tilew / 2, game.tileh / 2, size, false, "menutextOverBlack");
            gfx.ctx["menutextOverBlack"].globalCompositeOperation = "source-over";
        } else {
            clearInterval(this.animIdx);
        }
    }
};
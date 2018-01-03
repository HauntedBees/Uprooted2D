var debug = {
    DoEnemyCursorTest: function() { game.transition(game.currentInputHandler, debug.enemyCursorTest); },
    enemyCursorTest: {
        enemyIdx: 0, enemy: null, 
        mode: 0, animHelp: null,
        setup: function() {
            this.mode = 0;
            this.enemyIdx = 0;
            this.animHelp = new CombatAnimHelper([]);
            this.updateEnemy();
        },
        updateEnemy: function() {
            this.enemy = GetEnemy(debug.AllEnemies[this.enemyIdx]);
            combat.enemies = [this.enemy];
            this.animHelp = new CombatAnimHelper([this.enemy]);
            this.drawShit();
        },
        drawShit: function() {
            gfx.clearAll();
            var y = this.enemy.size == "lg" ? 5 : 5.75;
            var x = 10;
            if(this.enemy.size === "xl") { x = 8; y = 3; }
            gfx.drawCharacter(this.enemy.spriteidx, 0, this.enemy.sheet, this.enemy.size, x, y);
            gfx.drawInfobox(9, 1.5, combat.selectTarget.dy);
            gfx.drawWrappedText(this.enemy.name, me.INFOBOXWIDTH * 16, 11 + (combat.selectTarget.dy * 16), 85);
            var cursorInfo = this.animHelp.GetCursorInfo(0);
            gfx.drawCursor(cursorInfo.x, cursorInfo.y, cursorInfo.w, cursorInfo.h);
            var modeName = "undefined";
            switch(this.mode) {
                case 0: modeName = "Shift DX"; break;
                case 1: modeName = "Shift DY"; break;
                case 2: modeName = "Shift W"; break;
                case 3: modeName = "Shift H"; break;
            }
            gfx.drawWrappedText("Mode: " + modeName, 10, 10, 200);
        },
        keyPress: function(key) {
            var pos = { x: this.enemyIdx, y: 0 };
            var isEnter = false;
            switch(key) {
                case player.controls.up: pos.y -= 0.05; break;
                case player.controls.down: pos.y += 0.05; break;
                case player.controls.left: pos.x--; break;
                case player.controls.right: pos.x++; break;
                case player.controls.confirm:
                case player.controls.pause: isEnter = true; break;
                case player.controls.cancel: return this.cancel();
            }
            if(isEnter) {
                return this.click(pos);
            } else {
                return this.mouseMove(pos);
            }
        },
        mouseMove: function(pos) {
            if(pos.x < 0) { pos.x = debug.AllEnemies.length - 1; }
            else if(pos.x >= debug.AllEnemies.length) { pos.x = 0 ; }
            if(pos.y != 0) {
                switch(this.mode) {
                    case 0: this.enemy.cursorinfo.dx = RoundNear(this.enemy.cursorinfo.dx + pos.y, 100); break;
                    case 1: this.enemy.cursorinfo.dy = RoundNear(this.enemy.cursorinfo.dy + pos.y, 100); break;
                    case 2: this.enemy.cursorinfo.w = RoundNear(this.enemy.cursorinfo.w + pos.y, 100); break;
                    case 3: this.enemy.cursorinfo.h = RoundNear(this.enemy.cursorinfo.h + pos.y, 100); break;
                }
                this.drawShit();
            } else {
                this.enemyIdx = pos.x;
                this.updateEnemy();
            }
            return true;
        },
        click: function(pos) { this.mode = (this.mode + 1) % 4; this.drawShit(); },
        cancel: function() { console.log(this.enemy.cursorinfo); },
        clean: function() { gfx.clearAll(); }
    },
    MapTextTest: function(skip) {
        var allText = [];
        var doSkip = (skip !== undefined);
        for(var i in fulltext) { 
            if(fulltext[i].type !== "map") { continue; }
            if(doSkip) { if(i === skip) { doSkip = false; } else { continue; } }
            allText.push(function(x) { return function() { console.log(x); worldmap.writeText(x); }; }(i));
        }
        mapentities["farm"].push({ name: "DebugFriend", pos: { x: 0, y: 0 }, solid: false, autoplay: true, interact: allText });
        game.innerTransition(game.currentInputHandler, worldmap, { init: { x: 1, y: 1 }, map: "farm" });
    },
    QuickTest: function() { worldmap.noClip = true; me.PLAYERMOVESPEED = 0.5; },
    UndoQuickTest: function() { worldmap.noClip = false; me.PLAYERMOVESPEED = 0.25; },
    UnlockTruck: function(i) { 
        if(i >= 1) { player.questsCleared.push("researchLab"); }
        if(i >= 2) { player.questsCleared.push("helpSeaMonster"); }
        if(i >= 3) { player.questsCleared.push("gotTire"); }
    }
};
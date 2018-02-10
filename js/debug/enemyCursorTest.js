var debug = {
    ThrustSomeCropsUntoMineLoins: function(num) {
        var items = ["asparagus", "beet", "bellpepper", "carrot", "corn", "garlic", "ginger", "leek", "pineapple", "radish", "rhubarb", "spinach", "tomato", "apple", "apricot", "avocado", "banana", "blackberry", "grapes", "specialgrapes", "kiwi", "lemon", "mango", "beeR", "beeG", "beeB", "rice", "arborio", "blackrice", "shortgrain", "chestnut", "spear", "rod", "goodrod", "metalrod", "net", "bignet", "fodder", "shiitake", "milkcap", "portobello", "greenshroom", "blackshroom", "poisnshroom", "egg", "quail", "goose", "turkey", "platypus", "battery", "headphones", "printer", "app", "drone", "frogbot", "coffee"];
        var numItems = num || 40;
        while(numItems-- > 0) {
            player.increaseItem(items[Math.floor(Math.random() * items.length)]);
        }
    },
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
            var y = 9.25;
            var x = 10;
            if(this.enemy.size === "xl") { x = 8; y = 3; }
            this.animHelp.DEBUG_DrawEnemy(0);
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
    DoDamageTest: function() { game.innerTransition(game.currentInputHandler, debug.damageTest); },
    damageTest: {
        atk: 3, weaponidx: 0, season: 0, 
        weapons: [null, "!babySickle", "!baseSickle", "!goodSickle", "!dblSickle", "!hvySickle", "!hoe", "!salthoe", "!sicklerang", "!sunSickle", "!pltSickle", "!sickle2", "!sickle2_weak"],
        setup: function() { this.draw(); },
        draw: function() {
            gfx.clearAll();
            var weapon = this.weaponidx === 0 ? { displayname: "None", power: 0 } : GetEquipment(this.weapons[this.weaponidx]);
            gfx.drawText("Attack Power: " + this.atk, 5, 10);
            gfx.drawText("Weapon: " + weapon.displayname + " (" + weapon.power + ")", 5, 20);
            gfx.drawText("Season: " + this.season, 100, 10);
            gfx.drawText("Def/Damage: ", 5, 30);
            for(var def = 0; def < 100; def++) {
                player.equipment.weapon = this.weapons[this.weaponidx];
                var str = (def + 1) + "/" + dmgCalcs.MeleeAttack(true, this.season, this.atk, def + 1, -1);
                gfx.drawText(str, 5 + Math.floor(def / 21) * 60, 35 + (def % 21) * 6);
            }
        },
        keyPress: function(key) {
            switch(key) {
                case player.controls.up: this.atk++; break;
                case player.controls.down: this.atk--; break;
                case player.controls.left: this.weaponidx--; break;
                case player.controls.right: this.weaponidx++; break;
                case player.controls.confirm: this.season = (this.season + 1) % 4; break;
                case player.controls.pause: this.weaponidx = 0; break;
            }
            if(this.weaponidx < 0) { this.weaponidx = this.weapons.length - 1; } 
            else if(this.weaponidx >= this.weapons.length) { this.weaponidx = 0; }
            this.draw();
        },
        clean: function() { gfx.clearAll(); }
    },
    QuickTest: function() { worldmap.noClip = true; me.PLAYERMOVESPEED = 0.5; },
    UndoQuickTest: function() { worldmap.noClip = false; me.PLAYERMOVESPEED = 0.25; },
    UnlockTruck: function(i) { 
        if(i >= 1) { player.questsCleared.push("researchLab"); }
        if(i >= 2) { player.questsCleared.push("helpSeaMonster"); }
        if(i >= 3) { player.questsCleared.push("gotTire"); }
    },
    GiveAllCrops: function() {
        for(var i = 0; i < debug.AllCrops.length; i++) {
            player.increaseItem(debug.AllCrops[i]);
        }
    }
};
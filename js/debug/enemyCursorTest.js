const debug = {
    SeedsPlanted: function() {
        return Object.keys(player.miscdata.cropsPlanted).reduce((i, e) => i + player.miscdata.cropsPlanted[e], 0);
    },
    WorldMapTextTest: function() {
        const vals = [];
        for(const key in fulltext) {
            const me = fulltext[key];
            if(me.type !== "map") { continue; }
            const numRows = gfx.drawFullText(me["en-us"], 0);
            if(vals[numRows] === undefined) {
                vals[numRows] = [key];
            } else {
                vals[numRows].push(key);
            }
        }
        switch(player.options.fontSize) {
            case 0: console.log("FONT SIZE: NORMAL"); break;
            case 1: console.log("FONT SIZE: BIG"); break;
            case 2: console.log("FONT SIZE: HUGE"); break;
        }
        console.log(vals);
    },
    GlitchItUp: function() {
        game.glitch = {
            offX: InclusiveRange(-4, 4),
            offY: InclusiveRange(-6, 6),
            dx: InclusiveRange(-16, 16),
            dy: InclusiveRange(20, 20)
        };
    },
    Unglitch: function() { delete game.glitch; },
    testEnemyState: "attack",
    DoFuckBattle:  function() {
        player.hasFalcon = false;
        player.equipment.compost = "!jumboCompost";
        combat.startBattle(["yourWorstFuckingNightmare"]);//, "robo", "robo"]);
        return true; 
    },
    GiveQuestItems: function() {
        player.activeQuests["quest1"] = 4;
        player.activeQuests["kelpBoy"] = "gotMilk";
        player.activeQuests["getHeart"] = "heart";
        player.activeQuests["truckRepair"] = "tire";
        player.questsCleared.push("gotPhone");
        player.activeQuests["catmail"] = 1;
        player.questsCleared.push("keycard");
    },
    AllFixtures: function() {
        player.increaseItem("_log", 20);
        player.increaseItem("_coop", 20);
        player.increaseItem("_modulator", 20);
        player.increaseItem("_shooter", 20);
        player.increaseItem("_lake", 20);
        player.increaseItem("_paddy", 20);
        player.increaseItem("_cow", 20);
        player.increaseItem("_strongsoil", 20);
        player.increaseItem("_hotspot", 20);
        player.increaseItem("_sprinkler", 20);
        player.increaseItem("_beehive", 20);
        player.increaseItem("_charger", 20);
    },
    AllWeapons: function() {
        player.increaseItem("!babySickle");
        player.increaseItem("!baseSickle");
        player.increaseItem("!goodSickle");
        player.increaseItem("!dblSickle");
        player.increaseItem("!hvySickle");
        player.increaseItem("!hoe");
        player.increaseItem("!salthoe");
        player.increaseItem("!sicklerang");
        player.increaseItem("!sunSickle");
        player.increaseItem("!pltSickle");
        player.increaseItem("!sickle2");
        player.increaseItem("!weakCompost");
        player.increaseItem("!baseCompost");
        player.increaseItem("!strongCompost");
        player.increaseItem("!sturdyCompost");
        player.increaseItem("!jumboCompost");
        player.increaseItem("!vitaminCompost");
        player.increaseItem("!compost2");
        player.increaseItem("!weakGloves");
        player.increaseItem("!pairGloves");
        player.increaseItem("!gardenGloves");
        player.increaseItem("!sbGloves");
        player.increaseItem("!gloves2");
        player.increaseItem("!weakSoil");
        player.increaseItem("!speedSoil");
        player.increaseItem("!sturdSoil");
        player.increaseItem("!minSoil");
        player.increaseItem("!waterfall");
        player.increaseItem("!immunity");
        player.increaseItem("!seasonal");
        player.increaseItem("!pesticide2");
    },
    ThrustSomeCropsUntoMineLoins: function(num) {
        const items = ["asparagus", "beet", "bellpepper", "carrot", "corn", "garlic", "ginger", "leek", "pineapple", "radish", "rhubarb", "spinach", "tomato", "apple", "apricot", "avocado", "banana", "blackberry", "grapes", "specialgrapes", "kiwi", "lemon", "mango", "beeR", "beeG", "beeB", "rice", "arborio", "blackrice", "shortgrain", "chestnut", "spear", "rod", "goodrod", "metalrod", "net", "bignet", "fodder", "shiitake", "milkcap", "portobello", "greenshroom", "blackshroom", "poisnshroom", "egg", "quail", "goose", "turkey", "platypus", "battery", "headphones", "printer", "app", "drone", "frogbot", "coffee"];
        let numItems = num || 40;
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
            let y = 9.25, x = 10;
            if(this.enemy.size === "xl") { x = 8; y = 3; }
            this.animHelp.DEBUG_DrawEnemy(0);
            gfx.drawInfobox(9, 1.5, combat.selectTarget.dy);
            gfx.drawWrappedText(this.enemy.name, me.INFOBOXWIDTH * 16, 11 + (combat.selectTarget.dy * 16), 85);
            const cursorInfo = this.animHelp.GetCursorInfo(0);
            gfx.DrawCursor(cursorInfo.x, cursorInfo.y, cursorInfo.w, cursorInfo.h, "cursor", 0, "menucursorB");
            let modeName = "undefined";
            switch(this.mode) {
                case 0: modeName = "Shift DX"; break;
                case 1: modeName = "Shift DY"; break;
                case 2: modeName = "Shift W"; break;
                case 3: modeName = "Shift H"; break;
            }
            gfx.drawWrappedText("Mode: " + modeName, 10, 10, 200);
        },
        keyPress: function(key) {
            const pos = { x: this.enemyIdx, y: 0 };
            let isEnter = false;
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
        let allText = [];
        let doSkip = (skip !== undefined);
        let time = 0;
        for(const i in fulltext) { 
            if(fulltext[i].type !== "map") { continue; }
            if(doSkip) { if(i === skip) { doSkip = false; } else { continue; } }
            setTimeout(() => worldmap.writeText(i), 100 * time++);
        }
    },
    DoDamageTest: function() { game.innerTransition(game.currentInputHandler, debug.damageTest); },
    damageTest: {
        atk: 3, weaponidx: 0, season: 0, 
        weapons: [null, "!babySickle", "!baseSickle", "!goodSickle", "!dblSickle", "!hvySickle", "!hoe", "!salthoe", "!sicklerang", "!sunSickle", "!pltSickle", "!sickle2", "!sickle2_weak"],
        setup: function() { this.draw(); },
        draw: function() {
            gfx.clearAll();
            const weapon = this.weaponidx === 0 ? { displayname: "None", power: 0 } : GetEquipment(this.weapons[this.weaponidx]);
            gfx.drawText("Attack Power: " + this.atk, 5, 10);
            gfx.drawText("Weapon: " + weapon.displayname + " (" + weapon.power + ")", 5, 20);
            gfx.drawText("Season: " + this.season, 100, 10);
            gfx.drawText("Def/Damage: ", 5, 30);
            for(let def = 0; def < 100; def++) {
                player.equipment.weapon = this.weapons[this.weaponidx];
                const str = (def + 1) + "/" + dmgCalcs.MeleeAttack(true, this.season, this.atk, def + 1, -1);
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
        for(let i = 0; i < debug.AllCrops.length; i++) {
            player.increaseItem(debug.AllCrops[i]);
        }
    }
};
combat.selectTarget = {
    cursorx: 0, canSickle: false, dy: 8,
    sicklePos: {x: -1, y: -1}, 
    layersToClear: ["menucursorA", "menutext"], 
    setup: function(notfirst) {
        this.cursorx = 0;
        this.sicklePos = {x: -1, y: -1};
        this.canSickle = player.canSickleCrops();
        if(combat.enemies.length === 1 && (!this.canSickle || this.enemyGridIsEmpty())) {
            this.click(null);
        } else {
            this.drawAll();
        }
    },
    enemyGridIsEmpty: function() {
        for(var x = 0; x < combat.enemywidth; x++) {
            for(var y = 0; y < combat.enemyheight; y++) {
                if(combat.enemyGrid[x][y] !== null) { return false; }
            }
        }
        return true;
    },
    drawAll: function() {
        gfx.clearSome(this.layersToClear);
        combat.animHelper.SetPlayerAnimInfo([[2, 0]]);
        if(this.sicklePos.x >= 0) {
            var crop = combat.enemyGrid[this.sicklePos.x - combat.enemydx][this.sicklePos.y - combat.enemydy];
            if(crop === null) {
                gfx.drawCursor(this.sicklePos.x, this.sicklePos.y, 0, 0, "bcursor");
            } else {
                if(crop.x !== undefined) { crop = combat.enemyGrid[crop.x][crop.y]; }
                gfx.drawCursor(this.sicklePos.x, this.sicklePos.y, crop.size - 1, crop.size - 1);
            }
        } else {
            var initx = 11 - combat.enemies.length;
            if(combat.enemies[this.cursorx].isBig) {
                gfx.drawCursor(initx + this.cursorx - 0.5, 4.5, 1, 1.5);
            } else {
                gfx.drawCursor(initx + this.cursorx, 5.25, 0, 0.5);
            }
        }
        combat.menu.highlightReadyCropsAndReturnCount();
        gfx.drawInfobox(9, 1.5, this.dy);
        if(this.sicklePos.x >= 0) {
            var crop = combat.enemyGrid[this.sicklePos.x - combat.enemydx][this.sicklePos.y - combat.enemydy];
            if(crop === null) {
                gfx.drawWrappedText("", 6.5 * 16, 11 + (this.dy * 16), 85);
            } else {
                gfx.drawWrappedText(Capitalize(crop.name), 6.5 * 16, 11 + (this.dy * 16), 85);
            }
        } else {
            gfx.drawWrappedText(combat.enemies[this.cursorx].name, 6.5 * 16, 11 + (this.dy * 16), 85);
        }
        combat.animHelper.DrawBottom();
    },

    clean: function() { gfx.clearSome(this.layersToClear); },
    cancel: function() { game.transition(this, combat.menu); return true; },
    
    keyPress: function(key) {
        var pos = { 
            x: (this.sicklePos.x < 0 ? (this.cursorx + (11 - combat.enemies.length)) : this.sicklePos.x), 
            y: (this.sicklePos.y < 0 ? 8 : this.sicklePos.y)
        };
        var isEnter = false;
        var prevy = pos.y;
        switch(key) {
            case "a": pos.x--; break;
            case "d": pos.x++; break;
            case "w": pos.y--; break;
            case "s": pos.y++; break;
            case " ":
            case "Enter": isEnter = true; break;
            case "q": return this.cancel();
        }
        if(pos.y === 7 && prevy === 8) {
            pos.x = combat.enemydx;
            pos.y = combat.enemyheight - 1 + combat.enemydy;
        }
        if(pos.y == (combat.enemyheight + combat.enemydy)) {
            this.sicklePos = { x: -1, y: -1 };
            pos = { x: (this.cursorx + 11 - combat.enemies.length), y: 8 };
        }
        if(isEnter) {
            return this.click(pos);
        } else {
            return this.mouseMove(pos);
        }
    },
    mouseMove: function(pos) {
        var newx = pos.x - (11 - combat.enemies.length);
        if(pos.y === 8) {
            this.sicklePos = {x: -1, y: -1};
            if(newx < 0) { return false; }
            if(newx >= combat.enemies.length) { return false; }
            if(pos.y < 2) { return false; }
            this.cursorx = newx;
        } else {
            if(!this.canSickle) { return false; }
            var dpos = { x: pos.x - combat.enemydx, y: pos.y - combat.enemydy };
            if(dpos.x < 0 || dpos.y < 0 || dpos.x >= combat.enemywidth || dpos.y >= combat.enemyheight) { return false; }
            this.sicklePos = pos;
        }
        this.drawAll();
        return true;
    },
    click: function(pos) {
        var damage = this.getDamage();
        var damagetext = "";
        var criticalHit = false;
        if(Math.random() * player.luck < 0.05) {
            damage = Math.max(damage + 2, Math.ceil(damage * Math.max(1.5, 1 + Math.random())));
            damagetext = "CRITICAL HIT! ";
            criticalHit = true;
        }
        if(this.sicklePos.x >= 0) {
            var cropPos = {x: this.sicklePos.x - combat.enemydx, y: this.sicklePos.y - combat.enemydy};
            var crop = combat.enemyGrid[cropPos.x][cropPos.y];
            if(crop === null) { return false; }
            if(crop.x !== undefined) {
                cropPos = {x: crop.x, y: crop.y};
                crop = combat.enemyGrid[crop.x][crop.y];
            }
            combat.lastTarget = 0;
            combat.lastTargetCrop = false;
            var damage = Math.ceil(damage / 6);
            damagetext += "You attack the " + crop.displayname + " for like " + damage + " damage";
            if((crop.power - damage) <= 0) {
                damagetext += ", destroying it instantly."
                combat.animHelper.AddAnim(new SheetAnim(combat.enemydx + cropPos.x, combat.enemydy + cropPos.y, 250, "puff", 5));
            } else { damagetext += "."; }
            crop.power -= damage;
            if(crop.power <= 0) {
                if(crop.size == 2) {
                    combat.enemyGrid[cropPos.x + 1][cropPos.y] = null;
                    combat.enemyGrid[cropPos.x][cropPos.y + 1] = null;
                    combat.enemyGrid[cropPos.x + 1][cropPos.y + 1] = null;
                }
                combat.enemyGrid[cropPos.x][cropPos.y] = null;
            }
        } else {
            combat.lastTarget = this.cursorx;
            combat.lastTargetCrop = false;
            var target = combat.enemies[this.cursorx];
            if(!criticalHit) { damage = Math.max(1, damage - target.def); }
            damagetext += "You attack " + target.name + " for like " + damage + " damage";
            if((target.health - damage) <= 0) {
                damagetext += ", killing them instantly."
            } else { damagetext += "."; }
            combat.damageEnemy(this.cursorx, damage);
        }
        combat.animHelper.SetPlayerAnimInfo([[1, 2], [1, 2], [1, 3], [0, 0, true]], undefined, undefined, undefined, GetFrameRate(12));
        combat.flagFreshCrops(true, criticalHit);
        game.transition(this, combat.inbetween, {
            next: function() { combat.endTurn(combat.inbetween) },
            text: damagetext
        });
        return true;
    },
    getDamage: function() {
        var dmg = 0;
        for(var x = 0; x < player.gridWidth; x++) {
            for(var y = 0; y < player.gridHeight; y++) {
                var tile = combat.grid[x][y];
                if(tile === null || tile.x !== undefined) { continue; }
                if(tile.activeTime > 0 || tile.rotten) { continue; }
                var reduction = player.getArmorBalancedMultiplier(tile.seasons[combat.season]);
                if(tile.seasons[combat.season] > 0.5) {
                    if(combat.season == 0 && player.skilltree.Sspring == 1 ||
                        combat.season == 1 && player.skilltree.Ssummer == 1 ||
                        combat.season == 2 && player.skilltree.Sautumn == 1 ||
                        combat.season == 3 && player.skilltree.Swinter == 1) {
                        reduction *= 1.35;
                    }
                }
                dmg += tile.power * reduction;
            }
        }
        dmg += (dmg === 0 ? Math.round((player.atk / 2) + player.getSickleAttackBonus()) : player.atk);
        return Math.floor(dmg);
    }
};
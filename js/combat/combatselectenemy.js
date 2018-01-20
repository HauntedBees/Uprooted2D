combat.selectTarget = {
    cursorx: 0, canSickle: false, canHumans: true, dy: 8, 
    sicklePos: {x: -1, y: -1}, targets: [], maxTargets: 0, 
    layersToClear: ["menucursorA", "menucursorB", "menutext"], 
    setup: function(args) {
        this.cursorx = 0;
        this.sicklePos = {x: -1, y: -1};
        if(combat.isFalcon) {
            this.canSickle = true;
            this.canHumans = true;
        } else {
            this.canSickle = player.canSickleCrops();
            this.canHumans = !args.isMelee || player.canAttackPeople();
        }
        if(!this.canHumans) {
            this.sicklePos = {x: combat.enemydx, y: (combat.enemyheight - 1 + combat.enemydy)};
        }
        this.targets = [];
        var numAttacks = args.numAttacks || 1;
        if(this.canHumans && numAttacks >= combat.enemies.length && (!this.canSickle || this.enemyGridIsEmpty())) {
            for(var i = 0; i < combat.enemies.length; i++) { this.targets.push(i); }
            this.attack();
        } else {
            this.maxTargets = numAttacks;
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
        if(combat.isFalcon) {
            combat.animHelper.SetBirdAnimInfo([[2, 0]]);
            combat.animHelper.SetPlayerAnimInfo([[5, 0]]);
        } else {
            combat.animHelper.SetBirdAnimInfo([[0, 0]]);
            combat.animHelper.SetPlayerAnimInfo([[2, 0]]);
        }
        for(var i = 0; i < this.targets.length; i++) {
            var idx = this.targets[i];
            if(idx.x === undefined) {
                var cursorInfo = combat.animHelper.GetCursorInfo(idx);
                gfx.drawCursor(cursorInfo.x, cursorInfo.y, cursorInfo.w, cursorInfo.h, "xcursor");
            } else {
                gfx.drawCursor(idx.x, idx.y, 0, 0, "xcursor");
            }
        }
        if(this.sicklePos.x >= 0) {
            var crop = combat.enemyGrid[this.sicklePos.x - combat.enemydx][this.sicklePos.y - combat.enemydy];
            if(crop === null) {
                gfx.drawCursor(this.sicklePos.x, this.sicklePos.y, 0, 0, "bcursor");
            } else {
                if(crop.x !== undefined) { crop = combat.enemyGrid[crop.x][crop.y]; }
                gfx.drawCursor(this.sicklePos.x, this.sicklePos.y, crop.size - 1, crop.size - 1);
            }
        } else {
            var cursorInfo = combat.animHelper.GetCursorInfo(this.cursorx);
            gfx.drawCursor(cursorInfo.x, cursorInfo.y, cursorInfo.w, cursorInfo.h);
        }
        combat.menu.highlightReadyCropsAndReturnCount();
        gfx.drawInfobox(9, 1.5, this.dy);
        if(this.sicklePos.x >= 0) {
            var crop = combat.enemyGrid[this.sicklePos.x - combat.enemydx][this.sicklePos.y - combat.enemydy];
            if(crop === null) {
                gfx.drawWrappedText("", me.INFOBOXWIDTH * 16, 11 + (this.dy * 16), 85);
            } else {
                if(crop.x !== undefined) { crop = combat.enemyGrid[crop.x][crop.y]; }
                gfx.drawWrappedText(crop.name, me.INFOBOXWIDTH * 16, 11 + (this.dy * 16), 85);
            }
        } else {
            gfx.drawWrappedText(combat.enemies[this.cursorx].name, me.INFOBOXWIDTH * 16, 11 + (this.dy * 16), 85);
        }
        combat.animHelper.DrawBottom();
    },

    clean: function() { gfx.clearSome(this.layersToClear); },
    cancel: function() { game.innerTransition(this, combat.menu); return true; },
    
    keyPress: function(key) {
        var pos = { 
            x: (this.sicklePos.x < 0 ? (this.cursorx + (11 - combat.enemies.length)) : this.sicklePos.x), 
            y: (this.sicklePos.y < 0 ? 8 : this.sicklePos.y)
        };
        var isEnter = false;
        var prevy = pos.y;
        switch(key) {
            case player.controls.left: pos.x--; break;
            case player.controls.right: pos.x++; break;
            case player.controls.up: pos.y--; break;
            case player.controls.down: pos.y++; break;
            case player.controls.confirm:
            case player.controls.pause: isEnter = true; break;
            case player.controls.cancel: return this.cancel();
        }
        if(pos.y === 7 && prevy === 8) {
            pos.x = combat.enemydx;
            pos.y = combat.enemyheight - 1 + combat.enemydy;
        }
        if(pos.y == (combat.enemyheight + combat.enemydy)) {
            if(!this.canHumans) { return false; }
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
            if(!this.canHumans) { return false; }
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
        var doAttack = false;
        if(this.sicklePos.x >= 0) {
            var cropPos = {x: this.sicklePos.x - combat.enemydx, y: this.sicklePos.y - combat.enemydy};
            var crop = combat.enemyGrid[cropPos.x][cropPos.y];
            if(crop === null) { return false; }
            doAttack = this.toggleTarget(this.sicklePos, true);
        } else {
            doAttack = this.toggleTarget(this.cursorx, false);
        }
        if(doAttack) { this.attack(); }
        else { this.drawAll(); }
    },
    toggleTarget: function(idx, isPoint) {
        for(var i = 0; i < this.targets.length; i++) {
            var sel = this.targets[i];
            var same = false;
            if(isPoint) {
                if(sel.x === undefined) { continue; }
                same = (sel.x === idx.x && sel.y === idx.y);
            } else {
                if(sel.x !== undefined) { continue; }
                same = (sel === idx);
            }
            if(same) {
                this.targets.splice(i, 1);
                return false;
            }
        }
        this.targets.push(idx);
        return (this.targets.length === this.maxTargets);
    },
    attack: function() {
        var attackinfo = this.getAttackDetails();
        var damage = attackinfo.damage;
        var stunTurns = attackinfo.stun;
        var damagetext = "";
        var criticalHit = false;
        var additionalTargets = [];
        if(player.getRandomLuckyNumber() < 0.05) {
            damage = Math.max(damage + 2, Math.ceil(damage * Math.max(1.5, 1 + Math.random())));
            criticalHit = true;
            if(stunTurns > 0) {
                stunTurns = Math.round(stunTurns * 1.5);
            } else if(attackinfo.stunPotential) {
                stunTurns = 2;
            }
        }
        var stunningEnemies = false, hasAnimals = false, hasRecoil = false;
        var hasKills = false, hasDestroys = false;
        var avgDamage = 0, lastTargetName = "";
        var targArr = this.targets.length > 1;
        if(targArr) { combat.lastTarget = []; }
        var postHit = null;
        for(var i = 0; i < this.targets.length; i++) {
            var targetidx = this.targets[i];
            if(targetidx.x !== undefined) { // attacking a crop
                attackinfo.animals = [];
                var cropPos = {x: targetidx.x - combat.enemydx, y: targetidx.y - combat.enemydy};
                var crop = combat.enemyGrid[cropPos.x][cropPos.y];
                if(crop === null) { return false; }
                if(crop.x !== undefined) {
                    cropPos = {x: crop.x, y: crop.y};
                    crop = combat.enemyGrid[crop.x][crop.y];
                }
                if(targArr) {
                    combat.lastTarget.push(targetidx);
                } else {
                    combat.lastTarget = 0;
                }
                combat.lastTargetCrop = false;
                var innerDamage = Math.ceil(damage / 6);
                avgDamage += innerDamage;
                lastTargetName = GetText("cropWithDefArticle").replace(/\{0\}/g, crop.displayname);
                if((crop.power - damage) <= 0) {
                    hasDestroys = true;
                    crop.hidden = true;
                    crop.flagged = true;
                    combat.animHelper.DrawCrops();
                    combat.animHelper.AddAnim(new SheetAnim(combat.enemydx + cropPos.x, combat.enemydy + cropPos.y, 250, "puff", 5));
                }
                crop.power -= innerDamage;
                if(crop.power <= 0) {
                    if(crop.size == 2) {
                        combat.enemyGrid[cropPos.x + 1][cropPos.y] = null;
                        combat.enemyGrid[cropPos.x][cropPos.y + 1] = null;
                        combat.enemyGrid[cropPos.x + 1][cropPos.y + 1] = null;
                    }
                    combat.enemyGrid[cropPos.x][cropPos.y] = null;
                }
            } else { // attacking an enemy
                if(targArr) {
                    combat.lastTarget.push(targetidx);
                } else {
                    combat.lastTarget = targetidx;
                }
                combat.lastTargetCrop = false;
                var target = combat.enemies[targetidx];
                if(attackinfo.numCrops > 3 && combat.enemies.length > 1) {
                    while((player.getRandomLuckyNumber(true) * attackinfo.numCrops--) > 0.9) {
                        var idx = Range(0, combat.enemies.length);
                        if(idx === targetidx) { idx = (idx + 1) % combat.enemies.length; }
                        additionalTargets.push(idx);
                    }
                }
                var innerDamage = damage;
                if(!criticalHit) { innerDamage = Math.max(1, innerDamage - target.def); }
                if(target.addtlHitCheck !== undefined) {
                    innerDamage = addtlHitChecks[target.addtlHitCheck](attackinfo.cropInfo, innerDamage);
                }
                avgDamage += innerDamage;
                if(attackinfo.animals.length > 0) { hasAnimals = true; }
                lastTargetName = target.name;
                if(additionalTargets.length > 0) { hasRecoil = true; }
                if((target.health - innerDamage) <= 0) {
                    hasKills = true;
                }
                combat.damageEnemy(targetidx, innerDamage);
                if(target.postHit !== undefined) { postHit = postHits[target.postHit](target); }

                var recoilDamage = Math.ceil(innerDamage * 0.15);
                for(var j = 0; j < additionalTargets.length; j++) {
                    combat.damageEnemy(additionalTargets[j], recoilDamage);
                }
                if(stunTurns > 0) {
                    stunningEnemies = true;
                    combat.stickEnemy(targetidx, stunTurns);
                }
            }
            avgDamage = Math.floor(avgDamage / this.targets.length);
        }
        
        if((player.health - attackinfo.selfHarm) <= 0) { attackinfo.selfHarm = player.health - 1; }
        if(attackinfo.selfHarm > 0) { player.health -= attackinfo.selfHarm; }

        var damagetext = this.GetDamageText(criticalHit, hasAnimals, hasRecoil, hasKills, hasDestroys, stunningEnemies, combat.isFalcon, 
                                            avgDamage, lastTargetName, this.targets.length > 1, attackinfo.selfHarm);

        if(combat.isFalcon) {
            combat.animHelper.SetBirdAnimInfo([[2, 1], [3, 1], [2, 1], [3, 1, true]], undefined, undefined, undefined, GetFrameRate(12));
        } else {
            combat.animHelper.SetPlayerAnimInfo([[1, 2], [1, 2], [1, 3], [0, 0, true]], undefined, undefined, undefined, GetFrameRate(12));
        }
        combat.flagFreshCrops(true, criticalHit, attackinfo.animals, additionalTargets);

        if(postHit === null) { postHit = function() { combat.endTurn(combat.inbetween); }; }
        game.innerTransition(this, combat.inbetween, { next: postHit, text: damagetext });
        return true;
    },
    GetDamageText: function(criticalHit, hasAnimals, hasRecoil, hasKills, hasDestroys, stunningEnemies, isFalcon, damage, target, multipleTargets, selfHarm) {
        var damagetext = GetText("attackMessageStruct");
        if(criticalHit) { damagetext = damagetext.replace(/\{crit\}/g, GetText("critPrefix")); }
        else { damagetext = damagetext.replace(/\{crit\}/g, ""); }

        if(hasAnimals) { damagetext = damagetext.replace(/\{subject\}/g, GetText("subject_nature")); }
        else if(isFalcon) { damagetext = damagetext.replace(/\{subject\}/g, GetText("subject_falcon")); }
        else { damagetext = damagetext.replace(/\{subject\}/g, GetText("subject_you")); }

        if(isFalcon) { damagetext = damagetext.replace(/\{object\}/g, GetText("obj_thirdperson")); }
        else { damagetext = damagetext.replace(/\{object\}/g, GetText("obj_secondperson")); }

        var suffix = (multipleTargets ? "_pl" : "_sing");
        damagetext = damagetext.replace(/\{objectmult\}/g, GetText("obj" + suffix));
        damagetext = damagetext.replace(/\{amount\}/g, GetText("amount" + suffix));
        
        if(hasRecoil) { damagetext = damagetext.replace(/\{recoil\}/g, GetText("recoil" + suffix)); }
        else { damagetext = damagetext.replace(/\{recoil\}/g, ""); }
        
        var allEnemiesDead = false;
        if(hasKills) {
            allEnemiesDead = true;
            for(var i = 0; i < combat.enemies.length; i++) { if(combat.enemies[i].health > 0) { allEnemiesDead = false; break; } }
        }

        if(multipleTargets) {
            if(allEnemiesDead) { damagetext = damagetext.replace(/\{casualties\}/g, GetText("kill_all_pl")); }
            else if(hasKills || hasDestroys) { damagetext = damagetext.replace(/\{casualties\}/g, GetText("kill_some_pl")); }
            else { damagetext = damagetext.replace(/\{casualties\}/g, GetText("kill_none_pl")); }

            if(stunningEnemies && !allEnemiesDead) { damagetext = damagetext.replace(/\{sticky\}/g, GetText("sticky_some")); }
            else { damagetext = damagetext.replace(/\{sticky\}/g, GetText("sticky_none")); }
        } else {
            if(hasKills) { damagetext = damagetext.replace(/\{casualties\}/g, GetText("kill_defeatthey_sing")); } // TODO: account for unique defeats
            else if(hasDestroys) { damagetext = damagetext.replace(/\{casualties\}/g, GetText("kill_crop_sing")); }
            else { damagetext = damagetext.replace(/\{casualties\}/g, GetText("kill_none_sing")); }

            if(stunningEnemies && !allEnemiesDead) { damagetext = damagetext.replace(/\{sticky\}/g, GetText("sticky_some")); }
            else { damagetext = damagetext.replace(/\{sticky\}/g, GetText("sticky_none")); }
        }
        damagetext = damagetext.replace(/\{dmg\}/g, damage).replace(/\{target\}/g, target);

        if(selfHarm > 0) { damagetext = damagetext.replace(/\{gloves\}/g, GetText("gloves_some")).replace(/\{glovedmg\}/g, selfHarm); }
        else { damagetext = damagetext.replace(/\{gloves\}/g, ""); }
        
        return damagetext;
    },
    GetNerfs: function() {
        if(combat.enemies[0].id !== "beckett") { return []; }
        var nerfs = [];
        var right = combat.enemywidth - 1, bottom = combat.enemyheight - 1;
        for(var x = right - 1; x <= right; x++) {
            for(var y = bottom - 1; y <= bottom; y++) {
                var nerf = combat.enemyGrid[x][y];
                if(nerf === null) { continue; }
                switch(nerf.id) {
                    case "mushNerf": nerfs.push("mush"); break;
                    case "riceNerf": nerfs.push("rice"); break;
                    case "treeNerf": nerfs.push("tree"); break;
                    case "vegNerf": nerfs.push("veg"); break;
                    case "fishNerf": nerfs.push("spear"); nerfs.push("rod"); nerfs.push("water"); break;
                    case "beeNerf": nerfs.push("bee"); break;
                    case "eggNerf": nerfs.push("egg"); break;
                    case "reNerf": nerfs.push("RE"); break;
                }
            }
        }
        return nerfs;
    },
    GetNerfMultiplier: function(crop, nerfs) { 
        if(combat.enemies[0].id !== "beckett") { return 1; }
        if(nerfs.length === 0) { return 1; }
        var nerfMult = 1;
        for(var i = 0; i < nerfs.length; i++) {
            if(nerfs[i] === "RE") {
                if(crop.respawn > 0) { nerfMult *= 0.25; }
            } else if(nerfs[i] === crop.type) {
                nerfMult *= 0.25;
            }
        }
        return nerfMult;
    },
    getAttackDetails: function() {
        var dmg = 0, numCrops = 0;
        var stickAmount = 0, potentialForStun = false;
        var canHurt = (player.equipment.gloves !== null && GetEquipment(player.equipment.gloves).tech);
        var selHurt = 0;
        var animals = [];
        var cropInfo = [];
        var nerfs = this.GetNerfs();
        for(var x = 0; x < player.gridWidth; x++) {
            for(var y = 0; y < player.gridHeight; y++) {
                var tile = combat.grid[x][y];
                if(tile === null || tile.x !== undefined) { continue; }
                if(tile.name === "app") { if(tile.activeTime > 2) { continue; } }
                else if(tile.rotten || tile.activeTime > 0) { continue; }
                cropInfo.push({ type: tile.type, seasons: tile.seasons });
                numCrops++;
                var boost = 1, seasonVal = tile.seasons[combat.season];
                if(seasonVal > 0.5) {
                    boost *= 1 + (seasonVal - 0.5);
                    if(player.equipment.soil !== null) {
                        var equipInfo = GetEquipment(player.equipment.soil);
                        boost *= 1 + (equipInfo.amplify || 0);
                    }
                } else if(seasonVal < 0.5) {
                    boost *= 0.5 + seasonVal;
                    if(player.equipment.soil !== null) {
                        var equipInfo = GetEquipment(player.equipment.soil);
                        boost *= 1 + (equipInfo.boost || 0);
                    }
                }
                if(tile.stickChance !== undefined) {
                    potentialForStun = true;
                    if(stickAmount === 0 && player.getRandomLuckyNumber() < tile.stickChance) {
                        stickAmount = combat.getStickTime(tile);
                    } else {
                        stickAmount = Math.max(stickAmount, 1.2 * combat.getStickTime(tile));
                    }
                }
                if(canHurt && ["water", "rice", "spear", "rod"].indexOf(tile.type) >= 0) {
                    selHurt += tile.power * 0.25;
                }
                var thisCropsDamage = tile.power * boost * this.GetNerfMultiplier(tile, nerfs);
                if(tile.name === "app") { thisCropsDamage *= 2 / (tile.activeTime + 1); }
                if(tile.animal !== undefined && player.getRandomLuckyNumber() <= tile.animalChance) {
                    animals.push({ crop: tile.name, animal: tile.animal });
                    thisCropsDamage *= tile.animalDamageMult;
                }
                dmg += thisCropsDamage * Math.max(1, Math.log10(player.atk));
            }
        }
        dmg += (dmg === 0 ? Math.round((player.atk / 2) + player.getSickleAttackBonus(combat.season)) : player.atk);
        return {
            damage: Math.floor(dmg),
            stun: Math.round(stickAmount),
            stunPotential: potentialForStun,
            animals: animals,
            numCrops: numCrops,
            cropInfo: cropInfo,
            selfHarm: Math.ceil(selHurt)
        };
    }
};
var postHits = {
    "unplug": function(e) {
        if(e.unplugged) {
            return null;
        } else {
            if(e.health > 170) { return null; }
            return function() {
                e.spriteidx = 25;
                e.unplugged = true;
                e.plugTimer = InclusiveRange(2, 3);
                e.health = 50;
                e.def = 5;
                game.innerTransition(this, combat.inbetween, {
                    next: function() { combat.endTurn(combat.inbetween) },
                    text: GetText("outletUnplugged")
                });
            };
        }
    }
};
var addtlHitChecks = {
    "check_SP_SU": function(cropInfo, damage) {
        var hasSpringSummer = false;
        for(var i = 0; i < cropInfo.length; i++) { hasSpringSummer |= (cropInfo[i].seasons[0] === 2 || cropInfo[i].seasons[1] === 2); }
        return hasSpringSummer ? (damage * 50) : 0;
    },
    "check_AU_WI": function(cropInfo, damage) {
        var hasFallWinter = false;
        for(var i = 0; i < cropInfo.length; i++) { hasFallWinter |= (cropInfo[i].seasons[2] === 2 || cropInfo[i].seasons[3] === 2); }
        return hasFallWinter ? (damage * 50) : 0;
    },
    "check_MUSH": function(cropInfo, damage) {
        var hasMushroom = false;
        for(var i = 0; i < cropInfo.length; i++) { hasMushroom |= cropInfo[i].type === "mush"; }
        return hasMushroom ? (damage * 50) : 0;
    },
    "check_FISH": function(cropInfo, damage) {
        var hasFish = false;
        for(var i = 0; i < cropInfo.length; i++) { hasFish |= (cropInfo[i].type === "spear" || cropInfo[i].type === "rod" || cropInfo[i].type === "water"); }
        return hasFish ? (damage * 50) : 0;
    },
    "check_MUSH_w": function(cropInfo, damage) {
        var hasMushroom = false;
        for(var i = 0; i < cropInfo.length; i++) { hasMushroom |= cropInfo[i].type === "mush"; }
        return hasMushroom ? damage : 0;
    },
    "check_RICE": function(cropInfo, damage) {
        var hasRice = false;
        for(var i = 0; i < cropInfo.length; i++) { hasMushroom |= cropInfo[i].type === "rice"; }
        return hasRice ? damage : 0;
    },
    "check_VEG": function(cropInfo, damage) {
        var hasVeg = false;
        for(var i = 0; i < cropInfo.length; i++) { hasVeg |= cropInfo[i].type === "veg"; }
        return hasVeg ? damage : 0;
    },
    "check_FRUIT": function(cropInfo, damage) {
        var hasTree = false;
        for(var i = 0; i < cropInfo.length; i++) { hasTree |= cropInfo[i].type === "tree"; }
        return hasTree ? damage : 0;
    }
};
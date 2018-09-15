combat.selectTarget = {
    cursorx: 0, canSickle: false, canHumans: true, dy: 10, 
    sicklePos: {x: -1, y: -1}, targets: [], maxTargets: 0, 
    layersToClear: ["menucursorA", "menucursorB", "menutext"],
    // Setup/Display Logic
    setup: function(args) {
        const lastTarg = combat.lastTarget.length === undefined ? combat.lastTarget : combat.lastTarget[0];
        if(lastTarg.x === undefined) {
            this.cursorx = lastTarg >= combat.enemies.length ? combat.enemies.length - 1 : lastTarg;
            this.sicklePos = { x: -1, y: -1 };
        } else {
            this.sicklePos = { x: lastTarg.x, y: lastTarg.y };
            this.cursorx = 0;
        }
        if(combat.isFalcon) {
            this.canSickle = true;
            this.canHumans = true;
        } else {
            this.canSickle = player.canSickleCrops();
            this.canHumans = !args.isMelee || player.canAttackPeople();
        }
        if(!this.canHumans) { this.sicklePos = {x: combat.enemydx, y: (combat.enemyheight - 1 + combat.enemydy)}; }
        this.targets = [];
        const numAttacks = args.numAttacks || 1;
        if(this.SetUpAttackTargetsAndReturnIfCanAttackAll(numAttacks)) {
            this.Attack();
        } else {
            this.maxTargets = numAttacks;
            this.drawAll();
        }
    },
    SetUpAttackTargetsAndReturnIfCanAttackAll: function(numAttacks) {
        let enemyCrops = [];
        for(let x = 0; x < combat.enemywidth; x++) {
            for(let y = 0; y < combat.enemyheight; y++) {
                if(combat.enemyGrid[x][y] !== null) { enemyCrops.push({ x: x, y: y }); }
            }
        }
        const canHitCrops = this.canSickle && enemyCrops.length > 0;
        if(this.canHumans) {
            if(canHitCrops) { // can hit enemies AND crops
                const bothCount = combat.enemies.length + enemyCrops.length;
                if(numAttacks < bothCount) { return false; }
                const enemyTargs = combat.enemies.map((e, i) => i);
                const cropTargs = enemyCrops.map((e) => ({x: e.x + combat.enemydx, y: e.y + combat.enemydy}));
                combat.selectTarget.targets = [...enemyTargs, ...cropTargs];
                return true;
            } else { // can hit enemies but not crops
                if(numAttacks < combat.enemies.length) { return false; }
                combat.selectTarget.targets = combat.enemies.map((e, i) => i);
                return true;
            }
        } else if(canHitCrops) { // can hit crops but not enemies
            if(numAttacks < enemyCrops.length) { return false; }
            combat.selectTarget.targets = enemyCrops.map((e) => ({x: e.x + combat.enemydx, y: e.y + combat.enemydy}));
            return true;
        }
        return false; // should never be able to be unable to hit enemies OR crops...
    },
    drawAll: function() {
        gfx.clearSome(this.layersToClear);
        if(combat.isFalcon) {
            combat.animHelper.SetBirdAnimState("WANTATTACK", true);
            combat.animHelper.SetPlayerAnimState("LOOKBACK", true);
        } else {
            combat.animHelper.SetBirdAnimState("STAND", true);
            combat.animHelper.SetPlayerAnimState("WANTATTACK", true);
        }
        for(let i = 0; i < this.targets.length; i++) {
            const idx = this.targets[i];
            if(idx.x === undefined) {
                const cursorInfo = combat.animHelper.GetCursorInfo(idx);
                gfx.DrawXCursor(cursorInfo.x, cursorInfo.y, cursorInfo.w, cursorInfo.h);
            } else {
                gfx.DrawXCursor(idx.x, idx.y, 0, 0);
            }
        }
        const backButtonW = gfx.drawInfoText(GetText("menu.Back"), 2, this.dy + 0.25, this.cursorx === -1, "menuA", "menutext");
        combat.cursors.ReTypeCursor("main", "cursor");
        if(this.sicklePos.x >= 0) {
            const crop = combat.enemyGrid[this.sicklePos.x - combat.enemydx][this.sicklePos.y - combat.enemydy];
            if(crop === null) {
                combat.cursors.ReTypeCursor("main", "bcursor");
                combat.cursors.RedimCursor("main", this.sicklePos.x, this.sicklePos.y, 0, 0);
            } else {
                if(crop.x !== undefined) { crop = combat.enemyGrid[crop.x][crop.y]; }
                combat.cursors.RedimCursor("main", this.sicklePos.x, this.sicklePos.y, crop.size - 1, crop.size - 1);
            }
        } else if(this.cursorx < 0) {
            combat.cursors.RedimCursor("main", 2, this.dy + 0.375, backButtonW, -0.25);
        } else {
            const cursorInfo = combat.animHelper.GetCursorInfo(this.cursorx);
            combat.cursors.RedimCursor("main", cursorInfo.x, cursorInfo.y, cursorInfo.w, cursorInfo.h);
        }
        combat.menu.highlightReadyCropsAndReturnCount();
        gfx.drawInfobox(10, 1.5, this.dy);
        if(this.sicklePos.x >= 0) {
            const crop = combat.enemyGrid[this.sicklePos.x - combat.enemydx][this.sicklePos.y - combat.enemydy];
            if(crop !== null) {
                if(crop.x !== undefined) { crop = combat.enemyGrid[crop.x][crop.y]; }
                gfx.drawTileToGrid(GetHPFrame(crop), me.INFOBOXWIDTH, this.dy, "menucursorB");
                if(crop.name.indexOf("Nerf") > 0) {
                    gfx.drawWrappedText(GetText("sel.nerf").replace(/0/g, crop.displayname), 20 + me.INFOBOXWIDTH * 16, 15 + (this.dy * 16), 115);
                } else {
                    gfx.drawWrappedText(crop.displayname, 20 + me.INFOBOXWIDTH * 16, 15 + (this.dy * 16), 115);
                }
            }
        } else if(this.cursorx >= 0) {
            const enemy = combat.enemies[this.cursorx];
            gfx.drawTileToGrid(GetHPFrame(enemy), me.INFOBOXWIDTH, this.dy, "menucursorB");
            gfx.drawWrappedText(enemy.name, 20 + me.INFOBOXWIDTH * 16, 15 + (this.dy * 16), 95);
        }
        combat.animHelper.DrawBottom();
    },
    clean: () => gfx.clearSome(combat.selectTarget.layersToClear),
    cancel: function() { if(game.currentInputHandler.isTutorial) { return false; } game.innerTransition(this, combat.menu, { sel: 1, notFirst: true }); return true; },
    
    // Selecting Logic
    keyPress: function(key) {
        let pos = { 
            x: (this.sicklePos.x < 0 ? (this.cursorx + (11 - combat.enemies.length)) : this.sicklePos.x), 
            y: (this.sicklePos.y < 0 ? 8 : this.sicklePos.y)
        };
        let isEnter = false;
        const prevy = pos.y;
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
        if(isEnter) { return this.click(); }
        else { return this.CursorMove(pos); }
    },
    mouseMove: function(pos) {
        const me = combat.selectTarget;
        if(pos.y < 8) {
            if(!me.canSickle) { return false; }
            me.CursorMove({x: Math.floor(pos.x - combat.enemydx) + combat.enemydx, y: Math.floor(pos.y - combat.enemydy) + combat.enemydy });
        } else {
            pos.y = 8;
            pos.x = combat.animHelper.GetEnemyPosFromMouseX(pos.x);
            me.CursorMove(pos, true);
        }
    },
    CursorMove: function(pos, fromMouse) {
        if(pos.y === 8) {
            if(!this.canHumans) { return false; }
            const newx = fromMouse ? pos.x : (pos.x - (11 - combat.enemies.length));
            if(newx < -1) { return false; }
            if(newx >= combat.enemies.length) { return false; }
            if(pos.y < 2) { return false; }
            if(this.cursorx === newx && (fromMouse && this.sicklePos.x < 0)) { return false; }
            this.sicklePos = { x: -1, y: -1 };
            this.cursorx = newx;
        } else {
            if(!this.canSickle) { return false; }
            const dpos = { x: pos.x - combat.enemydx, y: pos.y - combat.enemydy };
            if(dpos.x < 0 || dpos.y < 0 || dpos.x >= combat.enemywidth || dpos.y >= combat.enemyheight) { return false; }
            const cropObj = combat.enemyGrid[dpos.x][dpos.y];
            if(cropObj !== null && cropObj.x !== undefined) {
                const newpos = { x: cropObj.x + combat.enemydx, y: cropObj.y + combat.enemydy };
                if(this.sicklePos.x === newpos.x && this.sicklePos.y === newpos.y) {
                    pos.x += (pos.x - this.sicklePos.x);
                    pos.y += (pos.y - this.sicklePos.y);
                    if(pos.y == (combat.enemyheight + combat.enemydy)) {
                        if(!this.canHumans) { return false; }
                        this.sicklePos = { x: -1, y: -1 };
                        pos = { x: (this.cursorx + 11 - combat.enemies.length), y: 8 };
                        return this.mouseMove(pos);
                    }
                    if((pos.x - combat.enemydx) >= combat.enemywidth) { return false; }
                } else { pos.x = newpos.x; pos.y = newpos.y; }
            }
            if(SamePoints(this.sicklePos, pos)) { return false; }
            this.sicklePos = pos;
        }
        this.drawAll();
        return true;
    },
    click: function() {
        let doAttack = false;
        if(this.sicklePos.x >= 0) {
            const cropPos = {x: this.sicklePos.x - combat.enemydx, y: this.sicklePos.y - combat.enemydy};
            const crop = combat.enemyGrid[cropPos.x][cropPos.y];
            if(crop === null) { return false; }
            doAttack = this.toggleTarget(this.sicklePos, true);
        } else if(this.cursorx < 0) {
            return this.cancel();
        } else {
            doAttack = this.toggleTarget(this.cursorx, false);
        }
        if(doAttack) { this.Attack(); }
        else { this.drawAll(); }
    },
    toggleTarget: function(idx, isPoint) {
        for(let i = 0; i < this.targets.length; i++) {
            const sel = this.targets[i];
            let same = false;
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
    GetCropName: function(id, displayname) {
        if(id === "grapes") { return GetText("disp.tree").replace(/0/g, GetText("disp.grapesSing")); } // this is very english-centric oops
        if(id.indexOf("Nerf") > 0) { return GetText("disp.nerf").replace(/0/g, displayname); }
        if(["apple", "apricot", "avocado", "banana", "blackberry", "kiwi", "lemon", "mango"].indexOf(id) >= 0) { return GetText("disp.tree").replace(/0/g, displayname); }
        return GetText("disp.veg").replace(/0/g, displayname);
    },

    // Attacking Logic
    Attack: function() {
        const allAttackInfo = this.GetAttackDetails();
        const allAttacks = allAttackInfo.attackDatas;

        let kills = [], hasDestroys = false;
        const hasRecoil = allAttackInfo.recoilInfo !== null && allAttackInfo.recoilInfo.some(function(e) { return e !== null; });
        let hasStuns = false;
        let avgDamage = 0, lastTargetName = "";
        const targArr = this.targets.length > 1;
        if(targArr) { combat.lastTarget = []; }
        let postHit = null, stickTargets = [];
        for(let i = 0; i < this.targets.length; i++) {
            const targetidx = this.targets[i], attackData = allAttacks[i];
            if(targArr) { combat.lastTarget.push(targetidx); }
            else { combat.lastTarget = targetidx; }
            if(targetidx.x !== undefined) { // crop
                let cropPos = {x: targetidx.x - combat.enemydx, y: targetidx.y - combat.enemydy};
                let crop = combat.enemyGrid[cropPos.x][cropPos.y];
                if(crop === null) { continue; }
                if(crop.x !== undefined) {
                    cropPos = { x: crop.x, y: crop.y };
                    crop = combat.enemyGrid[crop.x][crop.y];
                }
                lastTargetName = this.GetCropName(crop.name, crop.displayname);

                avgDamage += attackData.damage;
                crop.health -= attackData.damage;
                crop.power -= attackData.cropPowerLower;
                if(crop.health <= 0) {
                    hasDestroys = true;
                    crop.flagged = true;
                    combat.animHelper.DrawCrops();
                }
            } else { // enemy
                const target = combat.enemies[targetidx];
                lastTargetName = target.name;

                let finalDamage = attackData.damage;
                if(target.addtlHitCheck !== undefined) { finalDamage = addtlHitChecks[target.addtlHitCheck](attackData.crops, finalDamage); }
                avgDamage += finalDamage;
                combat.damageEnemy(targetidx, finalDamage);
                if(target.health <= 0) { kills.push(targetidx); }

                if(attackData.stunLength > 0) {
                    const stunResistCheck = (Math.random() < combat.enemies[targetidx].stickRes);
                    if(!stunResistCheck) {
                        hasStuns = true;
                        combat.enemies[targetidx].stickRes += 0.025;
                        combat.stickEnemy(targetidx, attackData.stunLength);
                        stickTargets.push(i);
                    }
                }
                if(target.postHit !== undefined) { postHit = postHits[target.postHit](target); }
            }
        }
        if(hasRecoil) {
            const fullRecoilDamage = allAttackInfo.recoilInfo.reduce(function(a, c) { return a + c; }, 0);
            for(let j = 0; j < combat.enemies.length; j++) {
                const dmg = dmgCalcs.GetDefendedPlayerDamage(fullRecoilDamage, allAttackInfo.isCritical, combat.enemies[j].def);
                combat.damageEnemy(j, dmg);
                if(combat.enemies[j].health <= 0) { kills.push(j); }
            }
        }
        avgDamage = Math.floor(avgDamage / this.targets.length);
        
        if(allAttacks[0].knockback > 0) { player.health = Math.max(player.health - allAttacks[0].knockback, 1); }
        const damagetext = this.GetDamageText(allAttackInfo.isCritical, allAttackInfo.hasAnimals, hasRecoil, kills, hasDestroys, hasStuns, 
                                            combat.isFalcon, avgDamage, lastTargetName, this.targets.length > 1, allAttacks[0].knockback);
        const targType = (this.targets[0].x === undefined) ? "_ENEMY" : "_CROP";
        if(combat.isFalcon) {
            combat.animHelper.SetBirdAnimState("ATTACK", true);
            combat.animHelper.SetBirdAnimArg("targets", this.targets);
        } else {
            const attackType = (allAttacks[0].numCrops === 0) ? "MELEE" : "THROW";
            combat.animHelper.SetPlayerAnimState(attackType + targType, true);
            combat.animHelper.SetPlayerAnimArg("targets", this.targets);
            combat.animHelper.SetPlayerAnimArg("recoils", allAttackInfo.recoilInfo);
            if(stickTargets.length > 0) {
                combat.animHelper.SetPlayerAnimArg("stickTargets", stickTargets);
            }
            if(attackType === "MELEE") { combat.animHelper.PushPlayerOverlay(player.equipment.weapon + targType); }
            else {
                combat.didHarvest = true;
                combat.FlagFreshCropsAndGetSeedDrops(true, allAttackInfo.isCritical);
                for(let i = 0; i < allAttackInfo.animData.length; i++) {
                    const info = allAttackInfo.animData[i];
                    combat.animHelper.AddPlayerAttackAnim(new CropAttackAnim(targType, combat.grid, info.x, info.y, i, undefined, info.animal));
                }
                combat.animHelper.StartPlayerAnimSequence();
            }
        }
        if(postHit === null) { postHit = function() { combat.endTurn(combat.inbetween); }; }
        game.innerTransition(this, combat.inbetween, { next: postHit, text: damagetext });
        return true;
    },
    GetAttackDetails: function() {
        let myCrops = [];
        for(let x = 0; x < player.gridWidth; x++) {
            for(let y = 0; y < player.gridHeight; y++) {
                const tile = combat.grid[x][y];
                if(tile === null || tile.x !== undefined) { continue; }
                if(tile.name === "app") { if(tile.activeTime > 2) { continue; } }
                else if(tile.rotten || tile.activeTime > 0) { continue; }
                myCrops.push({ crop: tile, x: x, y: y });
            }
        }
        let targetParams = [];
        for(let i = 0; i < this.targets.length; i++) {
            if(this.targets[i].x === undefined) { // enemy
                targetParams.push(combat.enemies[this.targets[i]].def);
            } else { // crop
                const x = this.targets[i].x - combat.enemydx;
                const y = this.targets[i].y - combat.enemydy;
                targetParams.push(combat.enemyGrid[x][y]);
            }
        }
        if(myCrops.length === 0) { return dmgCalcs.MeleeAttack(true, combat.season, player.atk, targetParams, -1); }
        else {
            if(myCrops.length >= 20) { AddAchievementIfMissing("biglaunch"); }
            return dmgCalcs.CropAttack(true, combat.season, player.atk, myCrops, targetParams, -1);
        }
    },
    GetDamageText: function(criticalHit, hasAnimals, hasRecoil, kills, hasDestroys, stunningEnemies, isFalcon, damage, target, multipleTargets, selfHarm) {
        let damagetext = GetText("attackMessageStruct");
        if(criticalHit) { damagetext = damagetext.replace(/\{crit\}/g, GetText("critPrefix")); }
        else { damagetext = damagetext.replace(/\{crit\}/g, ""); }

        if(hasAnimals) { damagetext = damagetext.replace(/\{subject\}/g, GetText("subject_nature")); }
        else if(isFalcon) { damagetext = damagetext.replace(/\{subject\}/g, GetText("subject_falcon")); }
        else { damagetext = damagetext.replace(/\{subject\}/g, GetText("subject_you")); }

        if(isFalcon) { damagetext = damagetext.replace(/\{object\}/g, GetText("obj_thirdperson")); }
        else { damagetext = damagetext.replace(/\{object\}/g, GetText("obj_secondperson")); }

        const suffix = (multipleTargets ? "_pl" : "_sing");
        damagetext = damagetext.replace(/\{objectmult\}/g, GetText("obj" + suffix));
        damagetext = damagetext.replace(/\{amount\}/g, GetText("amount" + suffix));
        
        if(hasRecoil) { damagetext = damagetext.replace(/\{recoil\}/g, GetText("recoil" + suffix)); }
        else { damagetext = damagetext.replace(/\{recoil\}/g, ""); }
        
        let allEnemiesDead = false;
        if(kills.length > 0) {
            allEnemiesDead = true;
            for(let i = 0; i < combat.enemies.length; i++) { if(combat.enemies[i].health > 0) { allEnemiesDead = false; break; } }
        }

        if(multipleTargets || hasRecoil) {
            if(allEnemiesDead) { damagetext = damagetext.replace(/\{casualties\}/g, GetText("kill_all_pl")); }
            else if(kills.length > 0 || hasDestroys) { damagetext = damagetext.replace(/\{casualties\}/g, GetText("kill_some_pl")); }
            else { damagetext = damagetext.replace(/\{casualties\}/g, GetText("kill_none_pl")); }

            if(stunningEnemies && !allEnemiesDead) { damagetext = damagetext.replace(/\{sticky\}/g, GetText("sticky_some")); }
            else { damagetext = damagetext.replace(/\{sticky\}/g, GetText("sticky_none")); }
        } else {
            if(kills.length > 0) {
                const killKey = combat.enemies[kills[0]].killKey || "kill_defeatthey_sing";
                damagetext = damagetext.replace(/\{casualties\}/g, GetText(killKey));
            }
            else if(hasDestroys) { damagetext = damagetext.replace(/\{casualties\}/g, GetText("kill_crop_sing")); }
            else { damagetext = damagetext.replace(/\{casualties\}/g, GetText("kill_none_sing")); }

            if(stunningEnemies && !allEnemiesDead) { damagetext = damagetext.replace(/\{sticky\}/g, GetText("sticky_some")); }
            else { damagetext = damagetext.replace(/\{sticky\}/g, GetText("sticky_none")); }
        }
        damagetext = damagetext.replace(/\{dmg\}/g, damage).replace(/\{target\}/g, target);

        if(selfHarm > 0) { damagetext = damagetext.replace(/\{gloves\}/g, GetText("gloves_some")).replace(/\{glovedmg\}/g, selfHarm); }
        else { damagetext = damagetext.replace(/\{gloves\}/g, ""); }
        
        return damagetext;
    }
};
const postHits = {
    "unplug": function(e) {
        if(e.unplugged) { return null; } 
        if(e.health > 170 || e.health <= 0) { return null; }
        return function() {
            e.spriteidx = [11, 8];
            e.unplugged = true;
            e.plugTimer = 3;
            e.health = 50;
            e.def = 5;
            game.innerTransition(this, combat.inbetween, {
                next: function() { combat.endTurn(combat.inbetween) },
                text: GetText("outletUnplugged")
            });
        };
    }
};
const addtlHitChecks = {
    "beckett": function(cropInfo, damage) {
        for(let i = 0; i < cropInfo.length; i++) {
            const crop = cropInfo[i];
            if(["carrot", "lemon"].indexOf(crop.name) >= 0 || ["spear", "rod", "water"].indexOf(crop.type) >= 0) { damage *= 1.75; }
        }
        return Math.ceil(damage);
    },
    "check_SP_SU": function(cropInfo, damage) {
        let hasSpringSummer = false;
        for(let i = 0; i < cropInfo.length; i++) { hasSpringSummer |= (cropInfo[i].crop.seasons[0] === 2 || cropInfo[i].crop.seasons[1] === 2); }
        return hasSpringSummer ? (damage * 50) : 0;
    },
    "check_AU_WI": function(cropInfo, damage) {
        let hasFallWinter = false;
        for(let i = 0; i < cropInfo.length; i++) { hasFallWinter |= (cropInfo[i].crop.seasons[2] === 2 || cropInfo[i].crop.seasons[3] === 2); }
        return hasFallWinter ? (damage * 50) : 0;
    },
    "check_MUSH": function(cropInfo, damage) {
        let hasMushroom = false;
        for(let i = 0; i < cropInfo.length; i++) { hasMushroom |= cropInfo[i].crop.type === "mush"; }
        return hasMushroom ? (damage * 50) : 0;
    },
    "check_FISH": function(cropInfo, damage) {
        let hasFish = false;
        for(let i = 0; i < cropInfo.length; i++) { hasFish |= (cropInfo[i].crop.type === "spear" || cropInfo[i].crop.type === "rod" || cropInfo[i].crop.type === "water"); }
        return hasFish ? (damage * 50) : 0;
    },
    "check_MUSH_w": function(cropInfo, damage) {
        let hasMushroom = false;
        for(let i = 0; i < cropInfo.length; i++) { hasMushroom |= cropInfo[i].crop.type === "mush"; }
        return hasMushroom ? damage : 0;
    },
    "check_RICE": function(cropInfo, damage) {
        let hasRice = false;
        for(let i = 0; i < cropInfo.length; i++) { hasRice |= cropInfo[i].crop.type === "rice"; }
        return hasRice ? damage : 0;
    },
    "check_VEG": function(cropInfo, damage) {
        let hasVeg = false;
        for(let i = 0; i < cropInfo.length; i++) { hasVeg |= cropInfo[i].crop.type === "veg"; }
        return hasVeg ? damage : 0;
    },
    "check_FRUIT": function(cropInfo, damage) {
        let hasTree = false;
        for(let i = 0; i < cropInfo.length; i++) { hasTree |= cropInfo[i].crop.type === "tree"; }
        return hasTree ? damage : 0;
    }
};
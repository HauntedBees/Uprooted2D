function AnimSet(anims, loop, fps, options) {
    this.anims = anims;
    this.lastFrame = this.anims.length - 1;
    this.fps = fps || 12;
    this.loop = loop || false;
    if(options !== undefined) { for(let key in options) { this[key] = options[key]; } }
}
function AnimFrame(sx, sy, callback) { this.x = sx; this.y = sy; this.callback = callback; }

function OverlaySet(sheet, frames) { this.sheet = sheet; this.frames = frames; this.length = this.frames.length - 1; }
function OverlayFrame(sx, sy, dx, dy) { this.x = sx; this.y = sy; this.dx = dx || 0; this.dy = dy || 0; }

function JustOne(sx, sy, options) { return new AnimSet([new AnimFrame(sx, sy)], false, 12, options); }
var enemyCombatAnims = {
    "STAND": JustOne(0, 0),
    "HURT": JustOne(0, 1, { doShake: true }),
    "PLANT": new AnimSet([new AnimFrame(0, 4), new AnimFrame(0, 5)], true, 2),
    "ATTACK": new AnimSet([new AnimFrame(0, 2), new AnimFrame(0, 3, "enemy_damagePlayer")], false, 4),
    "THROW_ENEMY": new AnimSet([new AnimFrame(0, 2, "enemy_pullCrop"), new AnimFrame(0, 3, "enemy_throwCropAtEnemy")], false, 4)
}

function GetWeaponAnims() {
    let w = {};
    let weaps = ["!hoe", "!babySickle", "!baseSickle", "!goodSickle", "!dblSickle", "!hvySickle", "!salthoe", "!sicklerang", "!sunSickle"];
    for(let i = 0; i < weaps.length; i++) {
        w[weaps[i] + "_ENEMY"] = new OverlaySet("combat_equipment", [ new OverlayFrame(i, 0), new OverlayFrame(i, 1), new OverlayFrame(i, 2), new OverlayFrame(i, 3), new OverlayFrame(i, 3) ]);
        w[weaps[i] + "_CROP"] = new OverlaySet("combat_equipment", [ new OverlayFrame(i, 0), new OverlayFrame(i, 1), new OverlayFrame(i, 2), new OverlayFrame(i, 4), new OverlayFrame(i, 4) ]);
    }
    weaps = ["!pltSickle", "!sickle2"];
    for(let i = 0; i < weaps.length; i++) {
        let enemy = [ new OverlayFrame(0, 5 + i), new OverlayFrame(1, 5 + i), new OverlayFrame(2, 5 + i), new OverlayFrame(3, 5 + i) ];
        let crop = [ new OverlayFrame(0, 5 + i), new OverlayFrame(1, 5 + i), new OverlayFrame(2, 5 + i) ];
        if(i === 1) {
            enemy.push(new OverlayFrame(4, 6));
            crop.push(new OverlayFrame(5, 6));
            crop.push(new OverlayFrame(6, 6));
        } else {
            enemy.push(new OverlayFrame(3, 5));
            crop.push(new OverlayFrame(4, 5));
            crop.push(new OverlayFrame(4, 5));
        }
        w[weaps[i] + "_ENEMY"] = new OverlaySet("combat_equipment", enemy);
        w[weaps[i] + "_CROP"] = new OverlaySet("combat_equipment", crop);
    }
    w["MILK"] = new OverlaySet("combat_equipment", [new OverlayFrame(5, 7), new OverlayFrame(5, 7)]);
    w["HONEY"] = new OverlaySet("combat_equipment", [new OverlayFrame(6, 7), new OverlayFrame(6, 7)]);
    w["COFFEE"] = new OverlaySet("combat_equipment", [new OverlayFrame(7, 7), new OverlayFrame(7, 7)]);
    w["COMPOST"] = new OverlaySet("combat_equipment", [new OverlayFrame(8, 7), new OverlayFrame(8, 7)]);

    w["FISH0"] = new OverlaySet("combat_equipment", [new OverlayFrame(5, 5, 0, -2), new OverlayFrame(6, 5), new OverlayFrame(6, 5)]);
    w["FISH1"] = new OverlaySet("combat_equipment", [new OverlayFrame(7, 5, 0, -6), new OverlayFrame(8, 5), new OverlayFrame(8, 5)]);
    w["FISH2"] = new OverlaySet("combat_equipment", [new OverlayFrame(7, 6), new OverlayFrame(8, 6, -5), new OverlayFrame(8, 6, -5)]);
    w["FISH3"] = new OverlaySet("combat_equipment", [new OverlayFrame(0, 7, -4), new OverlayFrame(1, 7), new OverlayFrame(1, 7)]);
    return w;
}
var weaponAnims = GetWeaponAnims();

var playerCombatAnims = {
    "STAND": JustOne(0, 0),
    "WANTPLANT": JustOne(1, 0),
    "WANTATTACK": new AnimSet([new AnimFrame(2, 0), new AnimFrame(2, 1)], true, 2),
    "CANTDO": JustOne(3, 0),
    "WANTCOMPOST": JustOne(4, 0),
    "LOOKBACK": JustOne(5, 0),
    "THINK": JustOne(6, 0),
    "PLANT": JustOne(7, 0),
    "WON": JustOne(0, 1),
    "LEVELUP": new AnimSet([new AnimFrame(1, 1), new AnimFrame(1, 2)], true, 4),
    "HURT": JustOne(3, 1, { doShake: true }),
    "MELEE_ENEMY": new AnimSet([new AnimFrame(4, 1), new AnimFrame(4, 2), new AnimFrame(4, 3), 
                                new AnimFrame(4, 4, "player_damageFoesWithAnim"), new AnimFrame(4, 4, "player_damageFoes2"), new AnimFrame(0, 0)], false),
    "MELEE_CROP": new AnimSet([new AnimFrame(4, 1), new AnimFrame(4, 2), new AnimFrame(4, 3), 
                               new AnimFrame(7, 2, "player_damageFoesWithAnim"), new AnimFrame(7, 2, "player_damageFoes2"), new AnimFrame(0, 0)], false),
    "FLEE": new AnimSet([new AnimFrame(5, 1), new AnimFrame(5, 2), new AnimFrame(6, 1), new AnimFrame(5, 2)], true),
    "FLEEFAIL": new AnimSet([new AnimFrame(5, 1), new AnimFrame(5, 2), new AnimFrame(6, 1), new AnimFrame(5, 2), new AnimFrame(5, 1), new AnimFrame(6, 2), new AnimFrame(7, 1)], false),
    "CORPSE": JustOne(2, 2),
    "FATALBLOW": JustOne(3, 2, { doShake: true }),
    "THROW_ENEMY": new AnimSet([new AnimFrame(0, 3, "player_pullCrop"), new AnimFrame(0, 4, "player_throwCropAtEnemy"), new AnimFrame(0, 4), new AnimFrame(0, 4)], false),
    "THROW_COMPOST": new AnimSet([new AnimFrame(0, 3), new AnimFrame(0, 4, "player_throwCompostAtEnemy"), new AnimFrame(0, 4), new AnimFrame(0, 4)], false),
    "THROW_BIRD": new AnimSet([new AnimFrame(0, 3, "player_pullCrop"), new AnimFrame(0, 2, "player_launchBird"), new AnimFrame(0, 2), new AnimFrame(0, 2)], false),
    "THROW_ROBO": new AnimSet([new AnimFrame(6, 3, "player_pullCrop"), new AnimFrame(6, 4, "player_launchBird"), new AnimFrame(6, 4), new AnimFrame(6, 3)], false),
    "FISH_SLAP": new AnimSet([new AnimFrame(1, 3, "player_getFish"), new AnimFrame(1, 4, "player_damageFoes"), new AnimFrame(1, 4)], false, 8),
    "FISH_TOSS": new AnimSet([new AnimFrame(0, 5, "player_getBigFish"), new AnimFrame(0, 5), new AnimFrame(0, 5), 
                              new AnimFrame(0, 4, "player_throwFishAtEnemy"), new AnimFrame(0, 4), new AnimFrame(0, 4)], false),
    "DRINK": new AnimSet([new AnimFrame(2, 3), new AnimFrame(2, 4)], true, 6),
    "EAT": new AnimSet([new AnimFrame(3, 3), new AnimFrame(3, 4)], true, 6),
    "THROW_CROP": new AnimSet([new AnimFrame(5, 3, "player_pullCrop"), new AnimFrame(5, 4, "player_throwCropAtCrop"), new AnimFrame(5, 4), new AnimFrame(5, 4)], false),
    "HURT_CROP": JustOne(7, 3, { doShake: true }),
    "STAND_WEAK": JustOne(7, 4)
};

var animCallbacks = {
    "enemy_damagePlayer": () => animCallbackHelpers.HurtPlayer(),
    "enemy_pullCrop": function(animProcess, animEntity) {
        const resetti = animEntity.animQueue[0];
        if(resetti === undefined) {
            console.log("you probably got some fucker with a THROW_ENEMY where they should have an ATTACK");
            return;
        }
        let anim = new TileAnim(combat.enemydx + resetti.x, combat.enemydy + resetti.y, ["puff0", "puff1", "puff2", "puff3", "puff4"], false, 24, false);
        anim.AddFrameFunc(3, function() { resetti.crop.hidden = true; combat.animHelper.DrawCrops(); });
        animProcess.AddBaby(anim);
    },
    "enemy_throwCropAtEnemy": function(animProcess, animEntity) {
        const resetti = animEntity.animQueue[0];
        const edims = animEntity.dims;
        if(animEntity.bonusArgs.targets.length === 0) {
            animProcess.AddBaby(new ParabolicThrowAnim(resetti.crop.name, { x: edims.x + (edims.w / 16) / 2, y: edims.y - (edims.h / 16) }, 
                combat.animHelper.GetPlayerTopPos(), 24, animCallbackHelpers.HurtPlayer));
        } else {
            const targx = animEntity.bonusArgs.targets[0].x + combat.dx;
            const targy = animEntity.bonusArgs.targets[0].y + combat.dy;
            animProcess.AddBaby(new MovingLinearAnim([ resetti.crop.name ], { x: edims.x + (edims.w / 16) / 2, y: edims.y - (edims.h / 16) }, { x: targx, y: targy }, 
                1, 0, 24, 24, function() { animCallbackHelpers.HurtPlayerCrops(animProcess, animEntity.bonusArgs.targets) } ));
        }
    },
    "player_getFish": function(animProcess, animEntity) {
        const resetti = animEntity.animQueue[0];
        const fish = resetti.crop.fishNum || 0;
        animProcess.AddOverlay(weaponAnims["FISH" + fish]);
        animCallbacks["player_pullCrop"](animProcess, animEntity);
    },
    "player_getBigFish": function(animProcess, animEntity) {
        const resetti = animEntity.animQueue[0];
        const fish = (resetti.crop.fishNum === 4 ? "bigFish" : "bignet1");
        const head = combat.animHelper.GetPlayerTopPos();
        animProcess.AddBaby(new TileAnim(head.x, head.y - 2, [fish], false, 12, true));
        animCallbacks["player_pullCrop"](animProcess, animEntity);
    },
    "player_throwFishAtEnemy": function(animProcess, animEntity) {
        const resetti = animEntity.animQueue[0];
        const fish = (resetti.crop.fishNum === 4 ? "bigFish" : "bignet1");
        animProcess.ClearBabies();
        let pos = combat.animHelper.GetPlayerTopPos();
        pos.y -= 2;
        animProcess.AddBaby(new ParabolicThrowAnim(fish, pos, combat.animHelper.GetEnemyTopPos(animEntity.bonusArgs.targets[0]), 24, 
                            function() { animCallbackHelpers.HurtTargets(animProcess, animEntity.bonusArgs.targets) }));
    },
    "player_pullCrop": function(animProcess, animEntity) {
        const resetti = animEntity.animQueue[0];
        const x = combat.dx + resetti.x, y = combat.dy + resetti.y;
        let anim = new TileAnim(x, y, ["puff0", "puff1", "puff2", "puff3", "puff4"], false, 24, false);
        anim.AddFrameFunc(3, function() { resetti.crop.hidden = true; combat.animHelper.DrawCrops(); });
        animProcess.AddBaby(anim);
        if(resetti.crop.seedDrop === true) {
            animProcess.AddBaby(new MovingLinearAnim([resetti.crop.name + "seed"], { x: x, y: y }, combat.animHelper.GetPlayerTopPos(), 0.25, 0, 24, 24));
        }
    },
    "player_throwCompostAtEnemy": function(animProcess, animEntity) {
        for(let i = 0; i < combat.enemies.length; i++) {
            animProcess.AddBaby(new ParabolicThrowAnim("compostpile", combat.animHelper.GetPlayerTopPos(), combat.animHelper.GetEnemyTopPos(i), 24, 
                function() { animCallbackHelpers.HurtTargets(animProcess, [i]) }));
        }
    },
    "player_launchBird": function(animProcess, animEntity) {
        const resetti = animEntity.animQueue[0];
        const arr = [resetti.crop.name + "Fly0", resetti.crop.name + "Fly1"];
        const isGrounded = ["platypus", "frogbot"].indexOf(resetti.crop.name) >= 0;
        const dy = (isGrounded ? 1 : 1.5);
        const fps = (isGrounded ? 24 : 12);
        let callback = undefined;
        if(animEntity.bonusArgs.recoils[resetti.idx] === null) {
            callback = () => animCallbackHelpers.HurtTargets(animProcess, animEntity.bonusArgs.targets);
        } else {
            callback = function() {
                const allTargs = combat.enemies.map((e, i) => i);
                animCallbackHelpers.HurtTargets(animProcess, animEntity.bonusArgs.targets);
                animCallbackHelpers.HurtTargets(animProcess, allTargs);
            };
        }
        let targetPos = null;
        if(animEntity.bonusArgs.targets[0].x === undefined) {
            targetPos = combat.animHelper.GetEnemyBottomPos(animEntity.bonusArgs.targets[0]);
        } else {
            const origPos = animEntity.bonusArgs.targets[0];
            targetPos = { x: origPos.x, y: origPos.y + 1 };
        }
        animProcess.AddBaby(new MovingLinearAnim(arr, combat.animHelper.GetPlayerBottomPos(), targetPos, 0.25, dy, 24, fps, callback));
    },
    "player_throwCropAtEnemy": function(animProcess, animEntity) {
        const resetti = animEntity.animQueue[0];
        let callback = undefined;
        if(animEntity.bonusArgs.recoils[resetti.idx] === null) {
            callback = () => animCallbackHelpers.HurtTargets(animProcess, animEntity.bonusArgs.targets);
        } else {
            callback = function() {
                for(let i = 0; i < combat.enemies.length; i++) {
                    let f = () => animCallbackHelpers.HurtTargets(animProcess, [i]);
                    animProcess.AddBaby(new ParabolicThrowAnim(resetti.crop.name, combat.animHelper.GetEnemyTopPos(animEntity.bonusArgs.targets[0]),
                                                                combat.animHelper.GetEnemyTopPos(i), 24, f, true));
                }
                animCallbackHelpers.HurtTargets(animProcess, animEntity.bonusArgs.targets);
            };
        }
        animProcess.AddBaby(new ParabolicThrowAnim(resetti.crop.name, combat.animHelper.GetPlayerTopPos(), combat.animHelper.GetEnemyTopPos(animEntity.bonusArgs.targets[0]), 24, callback));
    },
    "player_throwCropAtCrop": function(animProcess, animEntity) {
        var resetti = animEntity.animQueue[0];
        var recoil = animEntity.bonusArgs.recoils[resetti.idx];
        var callback = undefined;
        if(recoil === null || recoil === undefined) {
            callback = () => animCallbackHelpers.HurtTargets(animProcess, animEntity.bonusArgs.targets);
        } else {
            callback = function() {
                for(var i = 0; i < combat.enemies.length; i++) {
                    var f = function(idx) { return function() { animCallbackHelpers.HurtTargets(animProcess, [idx]) }; }(i);
                    animProcess.AddBaby(new MovingLinearAnim([ resetti.crop.name ], animEntity.bonusArgs.targets[0], combat.animHelper.GetEnemyTopPos(i), 1, 0, 24, 24, f));
                }
                animCallbackHelpers.HurtTargets(animProcess, animEntity.bonusArgs.targets);
            };
        }
        animProcess.AddBaby(new MovingLinearAnim([ resetti.crop.name ], combat.animHelper.GetPlayerTopPos(), animEntity.bonusArgs.targets[0], 1, 0, 24, 24, callback));
    },
    "player_damageFoes": function(animProcess, animEntity) { animCallbackHelpers.HurtTargets(animProcess, animEntity.bonusArgs.targets); },
    "player_damageFoesWithAnim": function(animProcess, animEntity) {
        animProcess.SetNewFPS(4);
        animProcess.SetShake(true);
        animCallbackHelpers.HurtTargets(animProcess, animEntity.bonusArgs.targets);
    },
    "player_damageFoes2": function(animProcess) { animProcess.SetNewFPS(10); animProcess.SetShake(false); }
};
var animCallbackHelpers = {
    "HurtPlayer": () => combat.animHelper.GivePlayerAHit(),
    "HurtPlayerCrops": function(animProcess, targets) {
        combat.animHelper.GivePlayerAHit(true);
        for(let i = 0; i < targets.length; i++) {
            const cropPos = targets[i];
            const targ = { x: cropPos.x + combat.dx, y: cropPos.y + combat.dy };
            let crop = combat.grid[cropPos.x][cropPos.y];
            if(crop === null) { continue; }
            if(crop.health <= 0) {
                let anim = new TileAnim(targ.x, targ.y, ["puff0", "puff1", "puff2", "puff3", "puff4"], false, 24, false);
                anim.AddFrameFunc(3, function() { crop.hidden = true; combat.animHelper.DrawCrops(); });
                animProcess.AddBaby(anim);
            } else {
                animProcess.AddBaby(new TileAnim(targ.x, targ.y, ["vein"], true, 12, true));
            }
        }
    },
    "HurtTargets": function(animProcess, targets) {
        for(let i = 0; i < targets.length; i++) {
            const targ = targets[i];
            if(targ.x === undefined) { // enemy
                if(combat.enemies[targ].health <= 0) {
                    combat.animHelper.MakeEnemyACorpse(targ);
                } else {
                    combat.animHelper.SetEnemyAnimState(targ, "HURT");
                }
            } else { // crop
                const cropPos = { x: targ.x - combat.enemydx, y: targ.y - combat.enemydy };
                let crop = combat.enemyGrid[cropPos.x][cropPos.y];
                if(crop === null) { continue; }
                if(crop.health <= 0) {
                    let anim = new TileAnim(targ.x, targ.y, ["puff0", "puff1", "puff2", "puff3", "puff4"], false, 24, false);
                    anim.AddFrameFunc(3, function() { crop.hidden = true; combat.animHelper.DrawCrops(); });
                    animProcess.AddBaby(anim);
                } else {
                    animProcess.AddBaby(new TileAnim(targ.x, targ.y, ["vein"], true, 12, true));
                }
            }
        }
    }
}
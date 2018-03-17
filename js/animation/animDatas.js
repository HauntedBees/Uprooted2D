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

const JustOne = (sx, sy, options) => new AnimSet([new AnimFrame(sx, sy)], false, 12, options);

function GetWeaponAnims() {
    let w = {};
    let weaps = ["!hoe", "!babySickle", "!baseSickle", "!goodSickle", "!dblSickle", "!hvySickle", "!salthoe", "!sicklerang", "!sunSickle"];
    for(let i = 0; i < weaps.length; i++) {
        w[weaps[i] + "_ENEMY"] = new OverlaySet("combatEquipment", [ new OverlayFrame(i, 0), new OverlayFrame(i, 1), new OverlayFrame(i, 2), new OverlayFrame(i, 3), new OverlayFrame(i, 3) ]);
        w[weaps[i] + "_CROP"] = new OverlaySet("combatEquipment", [ new OverlayFrame(i, 0), new OverlayFrame(i, 1), new OverlayFrame(i, 2), new OverlayFrame(i, 4), new OverlayFrame(i, 4) ]);
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
        w[weaps[i] + "_ENEMY"] = new OverlaySet("combatEquipment", enemy);
        w[weaps[i] + "_CROP"] = new OverlaySet("combatEquipment", crop);
    }
    w["MILK"] = new OverlaySet("combatEquipment", [new OverlayFrame(5, 7), new OverlayFrame(5, 7)]);
    w["HONEY"] = new OverlaySet("combatEquipment", [new OverlayFrame(6, 7), new OverlayFrame(6, 7)]);
    w["COFFEE"] = new OverlaySet("combatEquipment", [new OverlayFrame(7, 7), new OverlayFrame(7, 7)]);
    w["COMPOST"] = new OverlaySet("combatEquipment", [new OverlayFrame(8, 7), new OverlayFrame(8, 7)]);

    w["FISH0"] = new OverlaySet("combatEquipment", [new OverlayFrame(5, 5, 0, -2), new OverlayFrame(6, 5), new OverlayFrame(6, 5)]);
    w["FISH1"] = new OverlaySet("combatEquipment", [new OverlayFrame(7, 5, 0, -6), new OverlayFrame(8, 5), new OverlayFrame(8, 5)]);
    w["FISH2"] = new OverlaySet("combatEquipment", [new OverlayFrame(7, 6), new OverlayFrame(8, 6, -5), new OverlayFrame(8, 6, -5)]);
    w["FISH3"] = new OverlaySet("combatEquipment", [new OverlayFrame(0, 7, -4), new OverlayFrame(1, 7), new OverlayFrame(1, 7)]);
    return w;
}
const weaponAnims = GetWeaponAnims();

const enemyCombatAnims = {
    "STAND": JustOne(0, 0),
    "HURT": JustOne(0, 1, { doShake: true }),
    "ATTACK": new AnimSet([new AnimFrame(0, 2), new AnimFrame(0, 3, "enemy_damagePlayer")], false, 4),
    "ATTACK_CROP": new AnimSet([new AnimFrame(0, 2), new AnimFrame(0, 3, "enemy_damageCrop")], false, 4),
    "PLANT": new AnimSet([new AnimFrame(0, 4), new AnimFrame(0, 5)], true, 2),
    "THROW_ENEMY": new AnimSet([new AnimFrame(0, 2, "enemy_pullCrop"), new AnimFrame(0, 3, "enemy_throwCropAtEnemy")], false, 4),
    "THROW_CROP": new AnimSet([new AnimFrame(0, 6, "enemy_pullCrop"), new AnimFrame(0, 7, "enemy_throwCropAtEnemy")], false, 4),
    "HEAL": new AnimSet([new AnimFrame(0, 8), new AnimFrame(0, 9)], true, 2),
    "TURKEY_EGG": new AnimSet([new AnimFrame(0, 4), new AnimFrame(0, 5)], false, 1),
    
    "LAWNMOWER": new AnimSet([new AnimFrame(0, 2), new AnimFrame(0, 3, "enemy_damagePlayer"), new AnimFrame(0, 4), new AnimFrame(0, 5)], false, 12),
    "LAWNMOWER_ROCK": new AnimSet([new AnimFrame(0, 2), new AnimFrame(0, 3, "enemy_rockToss"), new AnimFrame(0, 4), new AnimFrame(0, 5)], false, 12),
    "LAWNMOWER_CROP": new AnimSet([new AnimFrame(0, 2), new AnimFrame(0, 3, "enemy_damageCrop"), new AnimFrame(0, 4), new AnimFrame(0, 5)], false, 12),
    
    "HEAD_ON_SPLASH_ATTACK": new AnimSet([new AnimFrame(0, 2), new AnimFrame(0, 3, "enemy_waterRow")], false, 4),
    "ROCK_TOSS": new AnimSet([new AnimFrame(0, 2), new AnimFrame(0, 3, "enemy_rockToss")], false, 4),
    "SALT_TOSS": new AnimSet([new AnimFrame(0, 2), new AnimFrame(0, 3, "enemy_saltRow")], false, 4),
    "ROW_FIRE": new AnimSet([new AnimFrame(0, 2), new AnimFrame(0, 3, "enemy_fireRow")], false, 4),
    "HULK_PUNCH": new AnimSet([new AnimFrame(0, 2), new AnimFrame(0, 3, "enemy_thanksHulkYouBetKid")], false, 4),
    "FUCKING_MAIM": new AnimSet([new AnimFrame(0, 2), new AnimFrame(0, 3, "enemy_letItFuckingBurn")], false, 4),
    "SLURP_KOMBUCH": new AnimSet([new AnimFrame(0, 8, "enemy_pullCrop"), new AnimFrame(0, 9)], false, 4),
    "SLURP_KOMBUCH_TRUCK": new AnimSet([new AnimFrame(0, 6, "enemy_pullCrop"), new AnimFrame(0, 7)], false, 4),

    "FUCKING_GUN": new AnimSet([new AnimFrame(0, 6, "enemy_damagePlayer"), new AnimFrame(0, 7)], false, 12),
    "FISH_FAIL": new AnimSet([new AnimFrame(0, 6), new AnimFrame(0, 7)], true, 2),
    "REV_ENGINE": new AnimSet([new AnimFrame(0, 6), new AnimFrame(0, 7)], true, 2),
    "GROW_BABY": new AnimSet([new AnimFrame(0, 2, "enemy_pullCrop"), new AnimFrame(0, 3)], false, 4), // TODO: maybe some poof-in for the baby?
    "SHOOT_CROPS": new AnimSet([new AnimFrame(0, 6), new AnimFrame(0, 7, "enemy_damageCrop")], true, 60, { doShake: true }),
    "MAIM": new AnimSet([new AnimFrame(0, 6, "enemy_damagePlayer"), new AnimFrame(0, 7), new AnimFrame(0, 8), new AnimFrame(0, 9), new AnimFrame(0, 10), new AnimFrame(0, 11)], true, 4),
    "REPAIR": new AnimSet([new AnimFrame(0, 10), new AnimFrame(0, 11)], true, 2),
    "THROW_CROP_HUGE": new AnimSet([new AnimFrame(1, 0, "enemy_pullCrop"), new AnimFrame(1, 1, "enemy_throwCropAtEnemy")], false, 4),
    "VINE_SMACK": new AnimSet([new AnimFrame(1, 2), new AnimFrame(1, 3, "enemy_vineSmack")], true, 4),
    
    "SERVER": new AnimSet([new AnimFrame(0, 4), new AnimFrame(0, 5), new AnimFrame(0, 6)], true, 2),
    "BUTTFIX": new AnimSet([new AnimFrame(0, 2), new AnimFrame(0, 3)], true, 2),
    "HOUSEKEEPER_ERROR": new AnimSet([new AnimFrame(0, 0), new AnimFrame(0, 1)], true, 4),
    "HOUSEKEEPER_HARVEST": new AnimSet([new AnimFrame(0, 2), new AnimFrame(0, 6), new AnimFrame(0, 4, "enemy_pullCrop"), new AnimFrame(0, 6, "enemy_throwCropAtEnemy")], true, 4),
    "HOUSEKEEPER_WHAPOW": new AnimSet([new AnimFrame(0, 2), new AnimFrame(0, 6, "enemy_damagePlayer"), new AnimFrame(0, 4), new AnimFrame(0, 6)], true, 4),
    "HOUSEKEEPER_WHAPOWCROP": new AnimSet([new AnimFrame(0, 2), new AnimFrame(0, 6, "enemy_damageCrop"), new AnimFrame(0, 4), new AnimFrame(0, 6)], true, 4),
    "HOUSEKEEPER_ROCK": new AnimSet([new AnimFrame(0, 2), new AnimFrame(0, 6, "enemy_rockToss"), new AnimFrame(0, 4), new AnimFrame(0, 6)], true, 4),
    "HOUSEKEEPER_SPLASH": new AnimSet([new AnimFrame(0, 2), new AnimFrame(0, 6, "enemy_waterRow"), new AnimFrame(0, 4), new AnimFrame(0, 6)], true, 4),
    "HOUSEKEEPER": new AnimSet([new AnimFrame(0, 2), new AnimFrame(0, 3), new AnimFrame(0, 4), new AnimFrame(0, 5)], true, 4),
    "HOUSEKEEPER2": new AnimSet([new AnimFrame(0, 2), new AnimFrame(0, 6), new AnimFrame(0, 4), new AnimFrame(0, 6)], true, 4),
}
const falconAnims = {
    "STAND": JustOne(1, 5),
    "WANTPLANT": JustOne(2, 5),
    "WANTATTACK": JustOne(3, 5),
    "CANTDO": JustOne(5, 5),
    "WANTCOMPOST": JustOne(4, 5),
    "THINK": JustOne(0, 6),
    "PLANT": JustOne(1, 6),
    "ATTACK": new AnimSet([new AnimFrame(2, 6), new AnimFrame(3, 6, "player_damageFoes"), new AnimFrame(2, 6), new AnimFrame(3, 6)], false),
    "MOURN": JustOne(4, 6),
    "WON": new AnimSet([new AnimFrame(6, 5), new AnimFrame(7, 5)], true, 4)
};
const playerCombatAnims = {
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

const animCallbacks = {
    "enemy_thanksHulkYouBetKid": function(animProcess, animEntity) {
        const row = combat.dy + animEntity.bonusArgs.punchRow;
        animProcess.AddBaby(new MovingLinearAnim(["hulkFist0"], { x: gfx.tileWidth, y: row }, { x: combat.dx, y: row }, 1, 0, 24, 24, function() {
            animCallbackHelpers.HurtPlayerCrops(animProcess, animEntity.bonusArgs.crops);
            animProcess.AddBaby(new TileAnim(combat.dx, row, ["hulkFist0"], false, 24, true));
            for(let x = 2; x < gfx.tileWidth; x += 2) {
                animProcess.AddBaby(new TileAnim(combat.dx + x, row, ["hulkFist1"], false, 24, true));
            }
        }));
        for(let x = 2; x < gfx.tileWidth; x += 2) {
            animProcess.AddBaby(new MovingLinearAnim(["hulkFist1"], { x: gfx.tileWidth + x, y: row }, { x: combat.dx + x, y: row }, 1, 0, 24, 24));
        }
    },
    "enemy_vineSmack": function(animProcess, animEntity) {
        const columns = animEntity.bonusArgs.columns.sort();
        const y = combat.dy + player.gridHeight - 1;
        let delay = 0;
        for(let colIdx = columns.length - 1; colIdx >= 0; colIdx--) {
            let callback = undefined;
            if(colIdx === 0) { callback = function() { animCallbackHelpers.HurtPlayerCrops(animProcess, animEntity.bonusArgs.crops); }; }
            animProcess.AddBaby(new VineAnim(combat.dx + columns[colIdx], y, delay, callback));
            delay += 12;
        }
    },
    "enemy_rockToss": function(animProcess, animEntity) {
        const edims = animEntity.dims;
        const crop = animEntity.bonusArgs.type + "0";
        const keepAfterwards = !crop.endsWith("Diag0");
        const targx = animEntity.bonusArgs.x + combat.dx;
        const targy = animEntity.bonusArgs.y + combat.dy;
        animProcess.AddBaby(new MovingLinearAnim([crop], { x: edims.x + (edims.w / 16) / 2, y: edims.y - (edims.h / 16) }, { x: targx, y: targy }, 
                1, 0, 24, 24, function() {
                    if(keepAfterwards) { animProcess.AddBaby(new TileAnim(targx, targy, [crop], false, 12, true)); }
                    animCallbackHelpers.HurtPlayerCrops(animProcess, animEntity.bonusArgs.targets)
                } ));
    },

    "enemy_waterRow": (animProcess, animEntity) => animCallbackHelpers["RowShit"](animProcess, animEntity, ["waterDrop0", "waterDrop1"], "splashed", ["splashed0", "splashed1"]),
    "enemy_fireRow": (animProcess, animEntity) => animCallbackHelpers["RowShit"](animProcess, animEntity, ["fireBall0", "fireBall1"], "burned", ["fireBurn0", "fireBurn1"]),
    "enemy_saltRow": (animProcess, animEntity) => animCallbackHelpers["RowShit"](animProcess, animEntity, ["saltShaker0", "saltShaker1"], "salt", ["salt"]),
    "enemy_letItFuckingBurn": function(animProcess, animEntity) {
        animCallbackHelpers.HurtPlayer();
        for(let y = 0; y < player.gridHeight; y++) {
            const startPos = { x: combat.dx + player.gridWidth, y: combat.dy + y };
            const endPos = { x: -1, y: startPos.y };
            let anim = new MovingLinearAnim(["fireBall0", "fireBall1"], startPos, endPos, 0.25, 0, 24, 12, undefined);
            anim.xFunc = function(x) {
                const arrx = x - combat.dx;
                if(x >= combat.dx) {
                    const arry = y;
                    let crop = combat.grid[arrx][arry];
                    let dispx = arrx, dispy = arry;
                    if(crop !== null) {
                        if(crop.x !== undefined) {
                            dispx = crop.x + combat.dx;
                            dispy = crop.y + combat.dy;
                            crop = combat.grid[crop.x][crop.y];
                        }
                        if(crop.health <= 0) { AddCropDeathAnim(animProcess, dispx, dispy, crop); }
                    }
                    if(player.itemGrid[x][y] === "_beehive") {
                        // don't hurt bees!
                    } else if(crop === null || crop.size === 1) {
                        animProcess.AddBaby(new TileAnim(dispx + combat.dx, dispy + combat.dy, ["fireBurn0", "fireBurn1"], false, 12, true));
                    } else if(crop.size === 2) {
                        animProcess.AddBaby(new TileAnim(dispx, dispy, ["fireBurn0", "fireBurn1"], false, 12, true));
                        animProcess.AddBaby(new TileAnim(dispx + 1, dispy, ["fireBurn0", "fireBurn1"], false, 12, true));
                        animProcess.AddBaby(new TileAnim(dispx, dispy + 1, ["fireBurn0", "fireBurn1"], false, 12, true));
                        animProcess.AddBaby(new TileAnim(dispx + 1, dispy + 1, ["fireBurn0", "fireBurn1"], false, 12, true));
                    }
                }
            };
            animProcess.AddBaby(anim);
        }
    },
    "enemy_damageCrop": (animProcess, animEntity) => animCallbackHelpers.HurtPlayerCrops(animProcess, animEntity.bonusArgs.crop),
    "enemy_damagePlayer": () => animCallbackHelpers.HurtPlayer(),
    "enemy_pullCrop": function(animProcess, animEntity) {
        const resetti = animEntity.animQueue[0];
        if(resetti === undefined) {
            console.log("you probably got some fucker with a THROW_ENEMY where they should have an ATTACK");
            return;
        }
        AddCropDeathAnim(animProcess, combat.enemydx + resetti.x, combat.enemydy + resetti.y, resetti.crop);
    },
    "enemy_throwCropAtEnemy": function(animProcess, animEntity) {
        const resetti = animEntity.animQueue[0];
        const edims = animEntity.dims;
        if(resetti.crop.type === "egg") {
            const arr = [resetti.crop.name + "FlyR0", resetti.crop.name + "FlyR1"];
            const isGrounded = resetti.crop.name === "platypus";
            const dy = (isGrounded ? 1 : 1.5);
            const fps = (isGrounded ? 24 : 12);
            if(animEntity.bonusArgs.targets.length === 0) { // attacking player
                animProcess.AddBaby(new MovingLinearAnim(arr, combat.animHelper.GetEnemyBottomPos(0), combat.animHelper.GetPlayerBottomPos(), 
                                    0.25, dy, 24, fps, animCallbackHelpers.HurtPlayer));
            } else { // attacking crop
                const targx = animEntity.bonusArgs.targets[0].x + combat.dx;
                const targy = animEntity.bonusArgs.targets[0].y + combat.dy;
                animProcess.AddBaby(new MovingLinearAnim(arr, combat.animHelper.GetEnemyBottomPos(0), { x: targx, y: targy }, 
                    0.25, dy, 24, fps, function() { animCallbackHelpers.HurtPlayerCrops(animProcess, animEntity.bonusArgs.targets) }));
            }
        } else {
            let cropSprite = resetti.crop.name;
            if(resetti.crop.fishNum !== undefined) { cropSprite = "fish" + resetti.crop.fishNum; }
            if(animEntity.bonusArgs.targets.length === 0) { // attacking player
                animProcess.AddBaby(new ParabolicThrowAnim(cropSprite, { x: edims.x + (edims.w / 16) / 2, y: edims.y - (edims.h / 16) }, 
                    combat.animHelper.GetPlayerTopPos(), 24, animCallbackHelpers.HurtPlayer));
            } else { // attacking crop
                const targx = animEntity.bonusArgs.targets[0].x + combat.dx;
                const targy = animEntity.bonusArgs.targets[0].y + combat.dy;
                animProcess.AddBaby(new MovingLinearAnim([ cropSprite ], { x: edims.x + (edims.w / 16) / 2, y: edims.y - (edims.h / 16) }, { x: targx, y: targy }, 
                    1, 0, 24, 24, function() { animCallbackHelpers.HurtPlayerCrops(animProcess, animEntity.bonusArgs.targets) } ));
            }
        }
    },
    "player_getFish": function(animProcess, animEntity) {
        const resetti = animEntity.animQueue[0];
        const fish = resetti.crop.fishNum || 0;
        animProcess.AddOverlay(weaponAnims["FISH" + fish]);
        animCallbacks["player_pullCrop"](animProcess, animEntity);
        animCallbackHelpers["ThrowSomeAnimalsAtIt"](animProcess, resetti.animal);
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
        const isLast = animEntity.animQueue.length === 1;
        const fish = (resetti.crop.fishNum === 4 ? "bigFish" : "bignet1");
        animProcess.ClearBabies();
        let pos = combat.animHelper.GetPlayerTopPos();
        pos.y -= 2;
        animProcess.AddBaby(new ParabolicThrowAnim(fish, pos, combat.animHelper.GetEnemyTopPos(animEntity.bonusArgs.targets[0]), 24, 
                            function() { animCallbackHelpers.HurtTargets(animProcess, animEntity.bonusArgs.targets, isLast) }));
        animCallbackHelpers["ThrowSomeAnimalsAtIt"](animProcess, resetti.animal);
    },
    "player_pullCrop": function(animProcess, animEntity) {
        const resetti = animEntity.animQueue[0];
        const x = combat.dx + resetti.x, y = combat.dy + resetti.y;
        AddCropDeathAnim(animProcess, x, y, resetti.crop);
        if(resetti.crop.seedDrop === true) {
            animProcess.AddBaby(new MovingLinearAnim([resetti.crop.name + "seed"], { x: x, y: y }, combat.animHelper.GetPlayerTopPos(), 0.25, 0, 24, 24));
        }
    },
    "player_throwCompostAtEnemy": function(animProcess, animEntity) {
        for(let i = 0; i < combat.enemies.length; i++) {
            animProcess.AddBaby(new ParabolicThrowAnim("compostpile", combat.animHelper.GetPlayerTopPos(), combat.animHelper.GetEnemyTopPos(i), 24, 
                function() { animCallbackHelpers.HurtTargets(animProcess, [i], true) }));
        }
    },
    "player_launchBird": function(animProcess, animEntity) {
        const resetti = animEntity.animQueue[0];
        const isLast = animEntity.animQueue.length === 1;
        const arr = [resetti.crop.name + "Fly0", resetti.crop.name + "Fly1"];
        const isGrounded = ["platypus", "frogbot"].indexOf(resetti.crop.name) >= 0;
        const dy = (isGrounded ? 1 : 1.5);
        const fps = (isGrounded ? 24 : 12);
        let callback = undefined;
        if(animEntity.bonusArgs.recoils[resetti.idx] === null) {
            callback = () => animCallbackHelpers.HurtTargets(animProcess, animEntity.bonusArgs.targets, isLast);
        } else {
            callback = function() {
                const allTargs = combat.enemies.map((e, i) => i);
                animCallbackHelpers.HurtTargets(animProcess, animEntity.bonusArgs.targets, isLast);
                animCallbackHelpers.HurtTargets(animProcess, allTargs, isLast);
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
        animCallbackHelpers["ThrowSomeAnimalsAtIt"](animProcess, resetti.animal);
    },
    "player_throwCropAtEnemy": function(animProcess, animEntity) {
        const resetti = animEntity.animQueue[0];
        const isLast = animEntity.animQueue.length === 1;
        let callback = undefined;
        if(animEntity.bonusArgs.recoils[resetti.idx] === null) {
            callback = () => animCallbackHelpers.HurtTargets(animProcess, animEntity.bonusArgs.targets, isLast);
        } else {
            callback = function() {
                for(let i = 0; i < combat.enemies.length; i++) {
                    let f = () => animCallbackHelpers.HurtTargets(animProcess, [i], isLast);
                    animProcess.AddBaby(new ParabolicThrowAnim(resetti.crop.name, combat.animHelper.GetEnemyTopPos(animEntity.bonusArgs.targets[0]),
                                                                combat.animHelper.GetEnemyTopPos(i), 24, f, true));
                }
                animCallbackHelpers.HurtTargets(animProcess, animEntity.bonusArgs.targets, isLast);
            };
        }
        animProcess.AddBaby(new ParabolicThrowAnim(resetti.crop.name, combat.animHelper.GetPlayerTopPos(), combat.animHelper.GetEnemyTopPos(animEntity.bonusArgs.targets[0]), 24, callback));
        animCallbackHelpers["ThrowSomeAnimalsAtIt"](animProcess, resetti.animal);
    },
    "player_throwCropAtCrop": function(animProcess, animEntity) {
        const resetti = animEntity.animQueue[0];
        const isLast = animEntity.animQueue.length === 1;
        const recoil = animEntity.bonusArgs.recoils[resetti.idx];
        let callback = undefined;
        if(recoil === null || recoil === undefined) {
            callback = () => animCallbackHelpers.HurtTargets(animProcess, animEntity.bonusArgs.targets, isLast);
        } else {
            callback = function() {
                for(let i = 0; i < combat.enemies.length; i++) {
                    const f = function(idx) { return function() { animCallbackHelpers.HurtTargets(animProcess, [idx], isLast) }; }(i);
                    animProcess.AddBaby(new MovingLinearAnim([ resetti.crop.name ], animEntity.bonusArgs.targets[0], combat.animHelper.GetEnemyTopPos(i), 1, 0, 24, 24, f));
                }
                animCallbackHelpers.HurtTargets(animProcess, animEntity.bonusArgs.targets, isLast);
            };
        }
        animProcess.AddBaby(new MovingLinearAnim([ resetti.crop.name ], combat.animHelper.GetPlayerTopPos(), animEntity.bonusArgs.targets[0], 1, 0, 24, 24, callback));
        animCallbackHelpers["ThrowSomeAnimalsAtIt"](animProcess, resetti.animal);
    },
    "player_damageFoes": (animProcess, animEntity) => animCallbackHelpers.HurtTargets(animProcess, animEntity.bonusArgs.targets, true),
    "player_damageFoesWithAnim": function(animProcess, animEntity) {
        animProcess.SetNewFPS(4);
        animProcess.SetShake(true);
        animCallbackHelpers.HurtTargets(animProcess, animEntity.bonusArgs.targets, true);
    },
    "player_damageFoes2": function(animProcess) { animProcess.SetNewFPS(10); animProcess.SetShake(false); }
};
const animCallbackHelpers = {
    "ThrowSomeAnimalsAtIt": function(animProcess, animal) {
        if(animal === undefined) { return; }
        const info = animalInfo[animal];
        if(info === undefined) { return; }
        let numAnimals = InclusiveRange(info.min, info.max);
        while(numAnimals-- > 0) { animProcess.AddBaby(new info.anim(animal, info, animProcess)); }
    },
    "HurtPlayer": () => combat.animHelper.GivePlayerAHit(),
    "HurtPlayerCrops": function(animProcess, targets) {
        combat.animHelper.GivePlayerAHit(true);
        for(let i = 0; i < targets.length; i++) {
            const cropPos = targets[i];
            let targ = { x: cropPos.x + combat.dx, y: cropPos.y + combat.dy };
            let crop = combat.grid[cropPos.x][cropPos.y];
            if(crop === null) { continue; }
            if(crop.x !== undefined) {
                targ = { x: crop.x + combat.dx, y: crop.y + combat.dy };
                crop = combat.grid[crop.x][crop.y];
            }
            if(crop.health <= 0) {
                AddCropDeathAnim(animProcess, targ.x, targ.y, crop);
            } else {
                animProcess.AddBaby(new TileAnim(targ.x, targ.y, ["vein"], true, 12, true));
                if(crop.size === 2) {
                    animProcess.AddBaby(new TileAnim(targ.x + 1, targ.y, ["vein"], true, 12, true));
                    animProcess.AddBaby(new TileAnim(targ.x, targ.y + 1, ["vein"], true, 12, true));
                    animProcess.AddBaby(new TileAnim(targ.x + 1, targ.y + 1, ["vein"], true, 12, true));
                }
            }
            if(cropPos.effect !== undefined) {
                animProcess.AddBaby(new TileAnim(targ.x, targ.y, cropPos.effect, false, 12, true));
                if(crop.size === 2) {
                    animProcess.AddBaby(new TileAnim(targ.x + 1, targ.y, cropPos.effect, false, 12, true));
                    animProcess.AddBaby(new TileAnim(targ.x, targ.y + 1, cropPos.effect, false, 12, true));
                    animProcess.AddBaby(new TileAnim(targ.x + 1, targ.y + 1, cropPos.effect, false, 12, true));
                }
            }
        }
    },
    "HurtTargets": function(animProcess, targets, isLast) {
        for(let i = 0; i < targets.length; i++) {
            const targ = targets[i];
            if(targ.x === undefined) { // enemy
                if(combat.enemies[targ].health <= 0 && isLast) {
                    combat.animHelper.MakeEnemyACorpse(targ);
                } else {
                    combat.animHelper.SetEnemyAnimState(targ, "HURT");
                }
            } else { // crop
                const cropPos = { x: targ.x - combat.enemydx, y: targ.y - combat.enemydy };
                let crop = combat.enemyGrid[cropPos.x][cropPos.y];
                if(crop === null) { continue; }
                if(crop.health <= 0) {
                    AddCropDeathAnim(animProcess, targ.x, targ.y, crop);
                } else {
                    animProcess.AddBaby(new TileAnim(targ.x, targ.y, ["vein"], true, 12, true));
                }
            }
        }
    },
    "RowShit": function(animProcess, animEntity, movingArray, effectTile, effectArray) {
        const y = combat.dy + animEntity.bonusArgs.row;
        const startPos = { x: combat.dx + player.gridWidth, y: y };
        const endPos = { x: -1, y: startPos.y };
        let anim = new MovingLinearAnim(movingArray, startPos, endPos, 0.25, 0, 24, 12, undefined);
        anim.xFunc = function(x) {
            const arrx = x - combat.dx;
            if(x >= combat.dx) {
                const tileData = animEntity.bonusArgs.tiles[arrx];
                const arry = y - combat.dy;
                let crop = combat.grid[arrx][arry];
                let dispx = arrx, dispy = arry;
                if(crop !== null && crop.x !== undefined) {
                    dispx = crop.x + combat.dx;
                    dispy = crop.y + combat.dy;
                    crop = combat.grid[crop.x][crop.y];
                }
                if(tileData.killed) { AddCropDeathAnim(animProcess, dispx, dispy, crop); }
                if(tileData.groundAffected) { animProcess.AddBaby(new TileAnim(x, y, [effectTile], false, 24, true)); }
                if(crop === null || crop.size === 1) {
                    animProcess.AddBaby(new TileAnim(x, y, effectArray, false, 12, true));
                } else if(crop.size === 2) {
                    animProcess.AddBaby(new TileAnim(dispx, dispy, effectArray, false, 12, true));
                    animProcess.AddBaby(new TileAnim(dispx + 1, dispy, effectArray, false, 12, true));
                    animProcess.AddBaby(new TileAnim(dispx, dispy + 1, effectArray, false, 12, true));
                    animProcess.AddBaby(new TileAnim(dispx + 1, dispy + 1, effectArray, false, 12, true));
                }
            }
        };
        animProcess.AddBaby(anim);
    }
}
function AddCropDeathAnim(animProcess, x, y, crop) {
    const puffStart = crop.size === 2 ? "bigpuff" : "puff";
    let anim = new TileAnim(x, y, [puffStart + "0", puffStart + "1", puffStart + "2", puffStart + "3", puffStart + "4"], false, 24, false);
    console.log("AAA");
    if(crop.health <= 0 || crop.respawn === 0) {
        anim.AddFrameFunc(3, () => { crop.hidden = true; combat.animHelper.DrawCrops(); });
    } else if(crop.respawn > 0) {
        anim.AddFrameFunc(3, () => { crop.activeTime = combat.plant.GetGrowthTime(crop, x - combat.dx, y - combat.dy, true); combat.animHelper.DrawCrops(); });
    }
    animProcess.AddBaby(anim);
}
function CombatAnimHelper(enemies) {
    let playerPos = { x: (combat.isChallenge ? 7 : 3), y: 4.625 };
    let playerAnimInfo = new CombatAnimPlayer(playerPos.x, playerPos.y);
    let birdAnimInfo = (player.hasFalcon ? new CombatAnimFalcon(playerPos.x - 1.5, playerPos.y) : null);
    let enemyAnimInfos = [], anims = [];
    const GetDeltaCurrentX = function(e) {
        switch(e.size) {
            case "sm": return 1.5;
            case "md": return 1.75;
            case "lg": return (e.id === "soyStack" ? 1.5 : 2.25);
            case "xl": return 4.5;
        }
        return 1.5;
    };
    this.ResetEnemyAnimHelper = function(enemies) {
        enemyAnimInfos = [];
        let currentx = 11 - enemies.length;
        for(let i = 0; i < enemies.length; i++) {
            const e = enemies[i];
            if(e.size === "xl") { currentx -= 1; }
            enemyAnimInfos.push(GetEnemyCombatAnim(currentx, playerPos.y, e.spriteidx, e.size, e.cursorinfo));
            currentx += GetDeltaCurrentX(e);
        }
    }
    this.ResetEnemyAnimHelper(enemies);
    this.GetCursorInfo = function(x) {
        let currentx = 11 - combat.enemies.length;
        for(let i = 0; i < combat.enemies.length; i++) {
            const e = combat.enemies[i];
            let dy = 0;
            if(e.size === "xl") {
                currentx -= 1;
                dy = 1;
            }
            if(x === i) {
                const info = e.cursorinfo;
                const y = playerPos.y + dy;
                const rawy = y - GetEnemyCombatDims(e.size).h;
                let dx = 0.25;
                if(e.size === "lg") { dx = 0.375; }
                else if(e.size === "xl") { dx = 0.125; }
                return { x: currentx + info.dx + dx, rawX: currentx, y: y + info.dy - 0.0625, rawY: rawy, w: info.w, h: info.h };
            }
            currentx += GetDeltaCurrentX(e);
        }
    };

    this.GetPlayerTopPos = () => ({ x: playerPos.x, y: playerPos.y - 1 });
    this.GetPlayerBottomPos = () => ({ x: playerPos.x + 0.5, y: playerPos.y });
    this.AddPlayerAttackAnim = caa => playerAnimInfo.animQueue.push(caa);
    this.StartPlayerAnimSequence = () => playerAnimInfo.StartAnimQueue();
    this.SetPlayerAnimArg = (key, val) => playerAnimInfo.PushArg(key, val);
    this.SetPlayerAnimPos = function(x, y) { playerAnimInfo.dims.x = x; playerAnimInfo.dims.y = y; };
    this.SetPlayerAnimState = function(name, resetPos) { playerAnimInfo.SetAnim(name); if(resetPos) { this.ResetPlayerAnimPos(); } };
    this.SetPlayerAnimLayer = (layer) => playerAnimInfo.layer = layer;
    this.ResetPlayerAnimPos = () => this.SetPlayerAnimPos(playerPos.x, playerPos.y);
    this.ResetPlayerAnimState = function() {
        if(player.health < (player.maxhealth / 4)) { playerAnimInfo.SetAnim("STAND_WEAK"); }
        else { playerAnimInfo.SetAnim("STAND"); }
        playerAnimInfo.layer = "characters";
        playerAnimInfo.ClearAnimQueue();
        this.ResetPlayerAnimPos();
    };
    this.PushPlayerOverlay = name => playerAnimInfo.PushOverlayAnim(weaponAnims[name]);
    this.GivePlayerAHit = function(isCrop) {
        if(isCrop) {
            Sounds.PlaySound("hit_hollow");
            this.SetPlayerAnimState("HURT_CROP");
        } else if(player.health <= 0) {
            Sounds.PlaySound("door");
            this.SetPlayerAnimState("FATALBLOW");
        } else {
            Sounds.PlaySound("hit_light");
            this.SetPlayerAnimState("HURT");
        }
    };

    this.SetBirdAnimArg = (key, val) => { if(birdAnimInfo !== null) { birdAnimInfo.PushArg(key, val); }};
    this.SetBirdAnimPos = (x, y) => { if(birdAnimInfo !== null) { birdAnimInfo.dims.x = x; birdAnimInfo.dims.y = y; }};
    this.SetBirdAnimState = function(name, resetPos) { if(birdAnimInfo !== null) { birdAnimInfo.SetAnim(name); if(resetPos) { this.ResetBirdAnimPos(); } }};
    this.SetBirdAnimLayer = layer => { if(birdAnimInfo !== null) { birdAnimInfo.layer = layer; }} 
    this.ResetBirdAnimPos = () => { if(birdAnimInfo !== null) {this.SetBirdAnimPos(playerPos.x - 1.5, playerPos.y); }}
    this.ResetBirdAnimState = function() {
        if(birdAnimInfo === null) { return; }
        birdAnimInfo.SetAnim("STAND");
        birdAnimInfo.layer = "characters";
        birdAnimInfo.ClearAnimQueue();
        this.ResetBirdAnimPos();
    };
    this.GetEnemyPosFromMouseX = function(cx) {
        if(cx < 5) { return -1; }
        for(let i = 0; i < enemyAnimInfos.length; i++) {
            const e = enemyAnimInfos[i];
            const ex = e.dims.x + e.dims.w / 16;
            if(ex >= cx) { return i; }
        }
        return 10;
    }
    this.GetEnemyTopPos = function(idx) {
        const edims = enemyAnimInfos[idx].dims, cdims = enemyAnimInfos[idx].cursorinfo;
        const res = { x: edims.x + (edims.w / 16) / 2 - 0.5, y: edims.y - RoundNear(1 + cdims.h, 8) - 1 };
        if(combat.enemies[idx].id === "garfwax") { res.y -= 2; }
        return res;
    };
    this.GetEnemyPos = idx => ({ x: enemyAnimInfos[idx].x, y: enemyAnimInfos[idx].y });
    this.GetEnemyBottomPos = idx => ({ x: enemyAnimInfos[idx].dims.x, y: enemyAnimInfos[idx].dims.y });
    this.AddEnemyAttackAnim = (idx, caa) => enemyAnimInfos[idx].animQueue.push(caa);
    this.StartEnemyAnimSequence = idx => enemyAnimInfos[idx].StartAnimQueue();
    this.SetEnemyAnimArg = (idx, key, val) => enemyAnimInfos[idx].PushArg(key, val);
    this.SetEnemyAnimState = (idx, name) => enemyAnimInfos[idx].SetAnim(name);
    this.MakeEnemyACorpse = idx => { const e = enemyAnimInfos[idx]; if(!e.dead) { e.dead = true; e.deadFrame = 0; } };
    this.RemoveEnemy = idx => enemyAnimInfos.splice(idx, 1);
    this.DEBUG_DrawEnemy = idx => enemyAnimInfos[idx].Animate(idx);

    this.Animate = function() {
        gfx.clearSome(["background2", "characters", "menucursorC"]);
        AnimateEntities();
        AnimateParticles();
    };
    const AnimateEntities = function() {
        if(birdAnimInfo !== null) { birdAnimInfo.Animate(); }
        playerAnimInfo.Animate();
        for(let i = 0; i < enemyAnimInfos.length; i++) {
            const isEnemyStuck = (combat.enemies[i].stickTurns > 0 && !combat.enemies[i].justStuck);
            if(enemyAnimInfos[i].dead) { enemyAnimInfos[i].CorpseItUp(enemyAnimInfos[i].deadFrame++, combat.enemies[i].size); }
            else { enemyAnimInfos[i].Animate(isEnemyStuck); }
        }
    };
    this.CleanEntities = function() {
        this.ResetPlayerAnimState();
        this.ResetBirdAnimState();
        for(let i = 0; i < enemyAnimInfos.length; i++) { enemyAnimInfos[i].SetAnim("STAND"); }
    };
    const AnimateParticles = function() {
        for(let i = anims.length - 1; i >= 0; i--) {
            const t = anims[i];
            if(t.current >= t.time) {
                if(t.loop) {
                    t.current = 0;
                    t.getFrame(timers.CHARANIM);
                } else {
                    t.finish();
                    anims.splice(i, 1);
                }
            } else { t.getFrame(timers.CHARANIM); }
        }
    };
    this.AddAnim = function(a) { anims.push(a); };
    this.CleanAnims = function() { anims = []; };

    const DrawCropGrid = function(grid, dx, dy, drawWeed) {
        const drawLayer = "crops"; // was foreground
        for(let x = 0; x < grid.length; x++) {
            const xdx = x + dx;
            for(let y = 0; y < grid[0].length; y++) {
                if(grid[x][y] === null || grid[x][y].name === undefined || grid[x][y].hidden) { continue; }
                const crop = grid[x][y];
                const ydy = y + dy;
                let newFrame = Math.floor((crop.frames - 1) * ((crop.time - crop.activeTime) / crop.time));
                if(crop.size == 2) {
                    let drawItemNum = !combat.isChallenge;
                    if(crop.name === "bignet") {
                        if(crop.rotten) {
                            gfx.drawTileToGrid(crop.name + "0", xdx, ydy, drawLayer);
                        } else {
                            gfx.drawTileToGrid(crop.name + "1", xdx, ydy, drawLayer);
                            gfx.drawItemNumber(0, xdx + 1, ydy, drawLayer, true);
                        }
                        drawItemNum = false;
                    } else if(crop.type !== "tree") {
                        gfx.drawTileToGrid(crop.name + newFrame, xdx, ydy, drawLayer);
                    } else if(newFrame < 3) {
                        gfx.drawTileToGrid((crop.treeSprite || "tree") + newFrame, xdx, ydy, drawLayer);
                    } else {
                        gfx.drawTileToGrid((crop.treeSprite || "tree") + "2", xdx, ydy, drawLayer);
                        newFrame -= 3;
                        gfx.drawTileToGrid(crop.name + newFrame, xdx, ydy, drawLayer);
                    }
                    if(drawItemNum) { gfx.drawItemNumber(crop.rotten ? "x" : Math.ceil(crop.activeTime), xdx + 1, ydy, drawLayer, true); }
                } else if(crop.type === "water") {
                    if(crop.name === "net") {
                        if(crop.rotten) {
                            gfx.drawTileToGrid(crop.name + "0", xdx, ydy, drawLayer);
                        } else {
                            gfx.drawTileToGrid(crop.name + "1", xdx, ydy, drawLayer);
                            gfx.drawItemNumber(0, xdx, ydy, drawLayer, true);
                        }
                    }
                } else if(crop.type === "card") {
                    gfx.drawTileToGrid((crop.inDefensePosition ? "def" : "") + crop.name, xdx, ydy, drawLayer);
                } else if(crop.type === "bee") {
                    gfx.drawTileToGrid(crop.name + newFrame, xdx, ydy, drawLayer);
                } else if(crop.type === "rod") {
                    gfx.drawTileToGrid(crop.fishNum === undefined ? (crop.name + "0") : ("fish" + crop.fishNum), xdx, ydy, drawLayer);
                    gfx.drawItemNumber(crop.rotten ? "x" : Math.ceil(crop.activeTime), xdx, ydy, drawLayer, true);
                } else {
                    const cropKey = (crop.name === "fodder" && combat.isChallenge) ? "fodder" : (crop.name + newFrame);
                    gfx.drawTileToGrid((crop.rotten && drawWeed) ? "weed" : cropKey, xdx, ydy, drawLayer);
                    if(!combat.isChallenge) {
                        gfx.drawItemNumber(crop.rotten ? "x" : Math.ceil(crop.activeTime), xdx, ydy, drawLayer, true);
                    }
                }
                if(crop.rotResistActive) { gfx.drawTileToGrid("rotSparkle", xdx, ydy, drawLayer); }
            }
        }
    };
    this.DrawCrops = function() {
        gfx.clearLayer("crops");
        DrawCropGrid(combat.grid, combat.dx, combat.dy, true);
        DrawCropGrid(combat.enemyGrid, combat.enemydx, combat.enemydy);
    };
    this.DrawWrapper = function(x, y, w, h, name) {
        name = name || "edge";
        gfx.drawTileToGrid(name + "WA", x - 1, y - 1, "background");
        gfx.drawTileToGrid(name + "WD", x + w, y - 1, "background");
        gfx.drawTileToGrid(name + "SA", x - 1, y + h, "background");
        gfx.drawTileToGrid(name + "SD", x + w, y + h, "background");
        for(let yy = 0; yy < h; yy++) {
            gfx.drawTileToGrid(name + "A", x - 1, y + yy, "background");
            gfx.drawTileToGrid(name + "D", x + w, y + yy, "background");
        }
        for(let xx = 0; xx < w; xx++) {
            gfx.drawTileToGrid(name + "W", x + xx, y - 1, "background");
            gfx.drawTileToGrid(name + "S", x + xx, y + h, "background");
        }
    };  

    this.DrawBackground = function() {
        gfx.clearLayer("background");
        gfx.drawFullImage(mapBattleXref[worldmap.mapName] || "bgs/outside");
        if(combat.isChallenge) {
            gfx.DrawChallengeGrid("challengeBG", combat.enemydx, combat.enemydy, "background");
        } else {
            if(["dirt", "nathan", "_strongsoil"].indexOf(combat.enemyTile) >= 0) { this.DrawWrapper(combat.enemydx, combat.enemydy, combat.enemywidth, combat.enemyheight); }
            else if(combat.enemyTile === "watertile") { this.DrawWrapper(combat.enemydx, combat.enemydy, combat.enemywidth, combat.enemyheight, "wedge"); }
            else if(combat.enemyTile === "tree") { this.DrawWrapper(combat.enemydx, combat.enemydy, combat.enemywidth, combat.enemyheight, "tree"); }
            for(let x = 0; x < combat.enemywidth; x++) { // enemy field
                for(let y = 0; y < combat.enemyheight; y++) {
                    if(combat.enemyTile === "nathan") { gfx.drawTileToGrid("dirt", combat.enemydx + x, y + combat.enemydy, "background"); }
                    gfx.drawTileToGrid(GetActualTile(combat.enemyTile, x, y), combat.enemydx + x, y + combat.enemydy, "background");
                }
            }
            let toDrawAfterwards = [];
            this.DrawWrapper(combat.dx, combat.dy, player.gridWidth, player.gridHeight);
            for(let x = 0; x < player.gridWidth; x++) { // player field
                for(let y = 0; y < player.gridHeight; y++) {
                    gfx.drawTileToGrid("dirt", x + combat.dx, y + combat.dy, "background");
                    const item = player.itemGrid[x][y];
                    let effect = combat.effectGrid[x][y];
                    if(item !== null && !item.coord) { 
                        const iteminfo = GetFarmInfo(item);
                        if(item === "_cow") {
                            if(combat.getCowIndex(x, y) >= 0) {
                                toDrawAfterwards.push({ sprite: "cowready", x: (x + combat.dx), y: (y + combat.dy) });
                            } else {
                                toDrawAfterwards.push({ sprite: "cow", x: (x + combat.dx), y: (y + combat.dy) });
                            }
                        } else if(item === "_charger") {
                            toDrawAfterwards.push({ sprite: "chargerplaced", x: (x + combat.dx), y: (y + combat.dy) });
                        } else if(item === "_modulator") {
                            toDrawAfterwards.push({ sprite: "mod" + combat.season, x: (x + combat.dx), y: (y + combat.dy) });
                        } else if(iteminfo.displaySprite !== undefined) {
                            toDrawAfterwards.push({ sprite: iteminfo.displaySprite, x: (x + combat.dx), y: (y + combat.dy) });
                        } else if(item === "_lake") {
                            pausemenu.farmmod.DrawWaterFrame(x, y, x + combat.dx, y + combat.dy, "background");
                        } else if(item === "_shooter") {
                            if(combat.getUsedShooterIndex(x, y) >= 0) {
                                gfx.drawTileToGrid("_shooterClosed", x + combat.dx, y + combat.dy, "background");
                            } else {
                                gfx.drawTileToGrid(item, x + combat.dx, y + combat.dy, "background");
                            }
                        } else {
                            if(["_log", "_coop", "_beehive"].indexOf(item) >= 0 && (effect !== null && effect.type === "burned")) {
                                effect = null;
                                gfx.drawTileToGrid(item + "Burned", x + combat.dx, y + combat.dy, "background");
                            } else {
                                gfx.drawTileToGrid(item, x + combat.dx, y + combat.dy, "background");
                            }
                        }
                    }
                    if(effect !== null) { toDrawAfterwards.push({ sprite: effect.type, x: (x + combat.dx), y: (y + combat.dy) }); }
                }
            }
            for(let i = 0; i < toDrawAfterwards.length; i++) {
                const item = toDrawAfterwards[i];
                gfx.drawTileToGrid(item.sprite, item.x, item.y, "background");
            }
        }
    };
    const GetActualTile = function(tile, x, y) {
        const rightmost = combat.enemywidth - 1, bottommost = combat.enemyheight - 1;
        switch(tile) {
            case "nathan":
                if(y === 0) {
                    if(x < 3) { return "_coop"; }
                    else { return "_log"; }
                } else if(y === 1) {
                    switch(x) {
                        case 0: return "lakeD";
                        case 1: return "lakeAD";
                        case 2: return "lakeA";
                        default: return "_log";
                    }
                } else if(y >= 2 && y <= 4 && x === 4) {
                    return "_beehive";
                } else if(y === 6) { return "_paddy"; }
                return "dirt";
            case "beckett":
                if(y < 3) {
                    if(x === 0) { return "conveyorL"; }
                    else if(x === rightmost) { return "conveyorR"; }
                    else { return "conveyorM"; }    
                } else {
                    const rightCorner = (x === rightmost), bottomCorner = (y === bottommost);
                    if(rightCorner && bottomCorner) { return "chargingBayLR"; }
                    else if(rightCorner && y === (bottommost - 1)) { return "chargingBayUR"; }
                    else if(bottomCorner && x === (rightmost - 1)) { return "chargingBayLL"; }
                    else if(x === (rightmost - 1) && y === (bottommost - 1)) { return "chargingBayUL"; }
                    else { return "tech"; }
                }
            case "conveyor":
                if(y === 0) { return "tech"; }
                if(x === 0) { return "conveyorL"; }
                else if(x === rightmost) { return "conveyorR"; }
                else { return "conveyorM"; }    
        }
        return tile;
    };
    this.DrawSeasonsInfo = function(x, y) {
        gfx.drawTileToGrid("seasonbar0", x, y, "menuA");
        gfx.drawTileToGrid("seasonbar1", x + 1, y, "menuA");
        const diff = Math.round(combat.seasonTime / me.TURNSINSEASON * gfx.tileWidth) / gfx.tileWidth;
        gfx.drawTileToGrid("seasonico", x - 0.25 + (combat.season + diff) / 2, y, "menuA");
    }
}
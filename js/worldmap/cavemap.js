const CaveTreasure = {
    contents: function() {
        const I = (id, weight) => ({ item: id, weight: weight });
        return [
            [ // Tier 0
                I("bellpepper", 4), I("corn", 5), I("leek", 4), 
                I("rhubarb", 5), I("garlic", 6), I("apricot", 3), 
                I("avocado", 4), I("kiwi", 2), I("lemon", 3),
                I("goldegg", 1), I("coconut", 1), I("gmocorn", 1)
            ], [ // Tier 1
                I("beeB", 5), I("rice", 3), I("arborio", 4),
                I("metalrod", 5), I("bignet", 5), I("fodder", 2),
                I("goose", 4), I("turkey", 4), I("drone", 3),
                I("ultrarod", 1), I("goodfood", 1), I("notdrugs", 1)
            ], [ // Tier 2
                I("coffee", 4), I("sicklebattery", 4), I("chestnut", 6),
                I("holywater", 3), I("goldegg", 2), I("coconut", 2),
                I("gmocorn", 2), I("ultrarod", 2), I("goodfood", 2),
                I("notdrugs", 2), I("lotus", 3), I("hbee", 3)
            ], [ // Tier 3
                I("holywater", 7), I("goldegg", 7), I("coconut", 7),
                I("gmocorn", 7), I("ultrarod", 7), I("goodfood", 7),
                I("notdrugs", 7), I("lotus", 7), I("hbee", 7)
            ], [ // Tier 4
                I("holyjug", 8), I("cacao", 10), I("soybean", 10)
            ], [ // Tier 5
                I("saffron", 8)
            ]
        ];
    }(),
    GetItem: function(floor) {
        const availableItems = [].concat(...CaveTreasure.contents.slice(0, Math.min(6, 1 + Math.floor(floor / 5))));
        const maxWeight = availableItems.reduce((sum, curr) => curr.weight + sum, 0);
        let chosenWeight = Range(0, maxWeight);
        for(let i = 0; i < availableItems.length; i++) {
            const o = availableItems[i];
            if(o.weight <= chosenWeight) {
                chosenWeight -= o.weight;
                continue;
            }
            return o.item;
        }
        return availableItems[Range(0, availableItems.length)].item;
    }
};
const CaveEnemy = {
    contents: function() {
        const I = (id, weight) => ({ item: id, weight: weight });
        return [
            [ // Tier 0
                I("bigBot", 1), I("piggun", 1), I("seaMonk", 1)
            ], [ // Tier 1
                I("golem", 6), I("lawnmower", 3), I("robo4a", 5)
            ], [ // Tier 2
                I("robo4c", 10), I("seaMobster", 10), I("soyChildCave", 8)
            ], [ // Tier 3
                I("shinyBear", 20), I("mrWallFriend", 18), I("caveNerd", 19)
            ], [ // Tier 4
                I("beeQueenB", 30), I("graveRobber", 25)
            ], [ // Tier 5
                I("negayana", 15)
            ]
        ];
    }(),
    GetEnemy: function(floor) {
        const availableItems = [].concat(...CaveEnemy.contents.slice(0, Math.min(6, 1 + Math.floor(floor / 5))));
        const maxWeight = availableItems.reduce((sum, curr) => curr.weight + sum, 0);
        let chosenWeight = Range(0, maxWeight);
        for(let i = 0; i < availableItems.length; i++) {
            const o = availableItems[i];
            if(o.weight <= chosenWeight) {
                chosenWeight -= o.weight;
                continue;
            }
            return o.item;
        }
        return availableItems[Range(0, availableItems.length)].item;
    }
};
function CaveInfo(floor) {
    this.floor = floor;
    this.Draw = function() {
        if(worldmap.mapName !== "cave") { return; }
        gfx.clearSome(["smartphone", "smartphoneText"]);
        gfx.drawInfoText(` -${this.floor}F`, 0, gfx.tileHeight - 1, false, "smartphone", "smartphoneText");
    }
}
function CaveMap(floor, lastFloorTile, lastWallTile) {
    this.floor = floor;
    this.startPos = { x: -1, y: -1 };
    this.endPos = { x: -1, y: -1 };
    this.entities = [];
    const isBoss = (floor % 5) === 4;
    const width = isBoss ? 25 : 6 * InclusiveRange(3, 8) + 3;
    const height = 6 * InclusiveRange(3, 8) + 3;
    this.floorType = (floor % 5 === 0 || lastFloorTile === undefined) ? (Math.random() > 0.1 ? Range(0, 11) : Range(0, 12)) : lastFloorTile;
    this.wallTile = (floor % 5 === 0 || lastWallTile === undefined) ? Range(0, 9) : lastWallTile;
    let myCollisions = [], myDraw = [];
    const ClearChunk = function(me, topx, topy, chunksize) {
        const yPadding = chunksize + 2;
        for(let y = 0; y < yPadding; y++) {
            if((topy + y) >= height) { continue; }
            for(let x = 0; x < chunksize; x++) {
                if((topx + x) >= width) { continue; }
                const myY = topy + y, myX = topx + x;
                myCollisions[myY][myX] = false;
                myDraw[myY][myX] = false;
                for(let i = me.entities.length - 1; i >= 0; i--) {
                    const ep = me.entities[i].pos;
                    if(ep.x === myX && ep.y === myY) {
                        me.entities.splice(i, 1);
                    }
                }
            }
        }
    };
    const MergeCollisionChunk = function(me, chunkidx, topx, topy, chunksize) {
        if((topx + chunksize - 1) >= width || (topy + chunksize - 1) >= height) { return false; }
        let chunk = null;
        if(chunksize === 23) {
            chunk = cavecollisionsBoss[chunkidx];
        } else if(chunksize === 11) {
            chunk = cavecollisionsMed[chunkidx];
        } else {
            chunk = cavecollisions[chunkidx];
        }
        for(let y = 0; y < chunksize; y++) {
            for(let x = 0; x < chunksize; x++) {
                const myY = topy + y, myX = topx + x;
                const tile = chunk[y][x];
                switch(tile) {
                    case 1: // wall
                        myCollisions[myY][myX] = true;
                        myDraw[myY][myX] = true;
                        break;
                    case 2: // treasure
                    case 9: // treasure
                        if((tile === 9 || Math.random() <= 0.4) && !myCollisions[myY][myX]) {
                            const contents = [];
                            const numItems = InclusiveRange(1, 4);
                            for(let i = 1; i <= numItems; i++) {
                                contents.push([CaveTreasure.GetItem(me.floor), InclusiveRange(1, 10)]);
                            }
                            me.entities.push(GetTreasureChest(`Chest${myX}_${myY}`, myX, myY, contents));
                        }
                        break;
                    case 3: // enemy
                    case 4: // enemy
                    case 5: // enemy
                        if((chunksize === 23 || Math.random() <= 0.55) && !myCollisions[myY][myX]) {
                            let myMovement = undefined;
                            const chunkSizeStr = chunksize === 23 ? "lg" : (chunksize === 11 ? "md" : "sm");
                            if(caveEnemyPatterns[`enemy${tile}_${chunkidx}_${chunkSizeStr}`] !== undefined) {
                                const movementDetails = caveEnemyPatterns[`enemy${tile}_${chunkidx}_${chunkSizeStr}`];
                                const myDetails = movementDetails.map(e => [myX + e[0], myY + e[1], e[2]]);
                                myMovement = GetStdMovement(myDetails);
                            }
                            const contents = [];
                            const numEnemies = InclusiveRange(2, 4);
                            for(let i = 1; i <= numEnemies; i++) {
                                contents.push(CaveEnemy.GetEnemy(me.floor));
                            }
                            me.entities.push(GetFellow(`Enemy${myX}_${myY}`, myX, myY, 2, "FOE", Cutscene("enemy"), myMovement, { setEnemies: contents, interactname: "FOE", dialogMax: 0, moving: true }));
                        }
                        break;
                    case 10: // boss
                        const contents = [];
                        switch(Range(0, 6)) {
                            case 0: contents.push("garfwax"); break;
                            case 1: contents.push("trustworthyfriend"); break;
                            case 2: contents.push("doodoobirdhahaha"); break;
                            case 3: contents.push("golf"); break;
                            case 4: contents.push("conqueredscarecrow"); break;
                            case 5: contents.push("fishingsnake"); break;
                        }
                        me.entities.push(GetFellow(`FOE`, myX - 0.5, myY, 2, "FOEbig", Cutscene("enemy"), undefined, { drawLayer: "foreground", setEnemies: contents, interactname: "FOEbig", dialogMax: 10, moving: true }));
                        break;
                    case 11: // hole
                        me.endPos = { x: myX, y: myY };
                        break;
                    case 12: // healing station
                        me.entities.push(GetFellow("HealingStation", myX, myY, 0, "HealingStation", Cutscene("healStation")));    
                        break;
                }
            }
        }
        if(Math.random() <= 0.25) {
            let myMovement = null;
            const contents = [];
            const numEnemies = InclusiveRange(1, 3);
            for(let i = 1; i <= numEnemies; i++) {
                contents.push(CaveEnemy.GetEnemy(me.floor));
            }
            if(contents.indexOf("negayana") >= 0) {
                contents.splice(contents.indexOf("negayana"), 1);
                contents.push("negayana");
            }
            myMovement = commonMovementDatas.rectangle(topx - 1, topy - 1, chunksize + 1, chunksize + 1, 0);
            me.entities.push(GetFellow(`EnemyChunk_${topx}_${topy}`, topx - 1, topy - 1, 2, "FOE", Cutscene("enemy"), myMovement, { setEnemies: contents, interactname: "FOE", dialogMax: 0 }));
        }
        return true;
    }
    const GenerateMap = function(me) {
        myCollisions = []; myDraw = [];
        for(let y = 0; y < height; y++) {
            const collRow = [], drawRow = [];
            for(let x = 0; x < width; x++) {
                if(x < 1 || y < 1 || x > (width - 2) || y > (height - 2)) {
                    collRow.push(true);
                    drawRow.push(true);
                } else {
                    collRow.push(false);
                    drawRow.push(false);
                }
            }
            myCollisions.push(collRow);
            myDraw.push(drawRow);
        }
        const wouldOverlaps = [];
        const WouldOverlap = (x, y) => wouldOverlaps.some(e => y === (e.y + 6) && (e.x - 6) <= x && x <= (e.x + 6));
        const WouldOverlapSmall = (x, y) => wouldOverlaps.some(e => y === (e.y + 6) && (e.x === x || x === (e.x + 6)));
        for(let y = 2; y < height; y += 6) {
            for(let x = 2; x < width; x += 6) {
                let success = false;
                if(Math.random() < 0.4 && !WouldOverlap(x, y)) {
                    success = MergeCollisionChunk(me, Range(0, 12), x, y, 11);
                    wouldOverlaps.push({ x: x, y: y });
                    x += 6;
                }
                if(!success && !WouldOverlapSmall(x, y)) {
                    MergeCollisionChunk(me, Range(0, 56), x, y, 5);                    
                }
            }
        }
        if(isBoss) {
            ClearChunk(me, 1, 1, 23);
            MergeCollisionChunk(me, Range(0, 6), 1, 1, 23);
        }
    }
    GenerateMap(this);
    const GetEmptyCoord = function(me) {
        let numSimpleAttempts = 20;
        while(--numSimpleAttempts > 0) {
            const x = Range(2, width - 2), y = Range(2, height - 2);
            if(me.startPos.x === x && me.startPos.y === y) { continue; }
            if(me.entities.some(e => e.pos.x === x && e.pos.y === y)) { continue; }
            if(!myCollisions[y][x]) { return { x: x, y: y }; }
        }
        const x = Range(2, width - 2), y = Range(2, height - 2); // fine I'll make my own fucking empty tile, asshole
        myCollisions[y][x] = false;
        myDraw[y][x] = false;
        return { x: x, y: y };
    };
    this.startPos = isBoss ? { x: 2, y: height - 3 } : GetEmptyCoord(this);
    if(isBoss) { myCollisions[height - 3][2] = false; myDraw[height - 3][2] = false; }
    if(this.endPos.x < 0) { this.endPos = GetEmptyCoord(this); }
    myCollisions[this.startPos.y][this.startPos.x - 1] = false;
    myDraw[this.startPos.y][this.startPos.x - 1] = false;
    this.entities.push(GetFellow("ExitHole0", this.startPos.x - 1, this.startPos.y, 0, "RopeBottom", undefined, undefined, { solid: false }));
    for(let i = this.entities.length - 1; i >= 0; i--) {
        const ep = this.entities[i].pos;
        if(ep.x === (this.startPos.x - 1) && ep.y === (this.startPos.y - 1)) {
            this.entities.splice(i, 1);
            break;
        }
    }
    this.entities.push(GetFellow("ExitHole1", this.startPos.x - 1, this.startPos.y - 1, 0, "RopeSign", Cutscene("leaveCave"), undefined, { drawLayer: "foreground" }));
    this.entities.push(GetFellow("ExitHole2", this.startPos.x - 1, this.startPos.y - 2, 0, "RopeFade", undefined, undefined, { drawLayer: "foreground", solid: false }));
    for(let y = this.startPos.y - 3; y >= 0; y--) {
        this.entities.push(GetFellow(`ExitHoleY${y}`, this.startPos.x - 1, y, 0, "RopeTop", undefined, undefined, { drawLayer: "foreground", solid: false }));
    }
    if(Math.random() <= 0.25) {
        const healthCoord = GetEmptyCoord(this);
        this.entities.push(GetFellow("HealingStation0", healthCoord.x, healthCoord.y, 0, "HealingStation", Cutscene("healStation")));
    }

    this.entities.push(GetFellow("UndergroundHole", this.endPos.x, this.endPos.y, 0, "Hole", Cutscene("downCave"), undefined));
    const RedrawWalls = function() {
        for(let y = 0; y < height; y++) { // format walls
            for(let x = 0; x < width; x++) {
                if(myDraw[y][x] === false) { continue; }
                let dir = 0;
                if(x === 0 || (x > 0 && myDraw[y][x - 1] !== false)) { dir += 8; }
                if(y === 0 || (y > 0 && myDraw[y - 1][x] !== false)) { dir += 1; }
                if(x === (width - 1) || (x < (width - 1) && myDraw[y][x + 1] !== false)) { dir += 2; }
                if(y === (height - 1)  || (y < (height - 1) && myDraw[y + 1][x] !== false)) { dir += 4; }
                switch(dir) {
                    case 15: myDraw[y][x] = { x: 1, y: 1 }; break;
                    case 14: myDraw[y][x] = { x: 1, y: 0 }; break;
                    case 13: myDraw[y][x] = { x: 2, y: 1 }; break;
                    case 12: myDraw[y][x] = { x: 2, y: 0 }; break;
                    case 11: myDraw[y][x] = { x: 1, y: 2 }; break;
                    case 10: myDraw[y][x] = { x: 1, y: 3 }; break;
                    case 9: myDraw[y][x] = { x: 2, y: 2 }; break;
                    case 8: myDraw[y][x] = { x: 2, y: 3 }; break;
                    case 7: myDraw[y][x] = { x: 0, y: 1 }; break;
                    case 6: myDraw[y][x] = { x: 0, y: 0 }; break;
                    case 5: myDraw[y][x] = { x: 3, y: 1 }; break;
                    case 4: myDraw[y][x] = { x: 3, y: 0 }; break;
                    case 3: myDraw[y][x] = { x: 0, y: 2 }; break;
                    case 2: myDraw[y][x] = { x: 0, y: 3 }; break;
                    case 1: myDraw[y][x] = { x: 3, y: 2 }; break;
                    case 0: myDraw[y][x] = { x: 3, y: 3 }; break;
                }
            }
        }
    }
    RedrawWalls();
    collisions["cave"] = myCollisions;
    const wallOffsetX = 4 * (this.wallTile % 3), wallOffsetY = 1 + 4 * Math.floor(this.wallTile / 3);
    this.Draw = function(centerx, centery) {
        const bounds = {
            x: [Math.floor(worldmap.pos.x - 9), Math.floor(worldmap.pos.x + 9)],
            y: [Math.floor(worldmap.pos.y - 8), Math.floor(worldmap.pos.y + 8)]
        };
        if(bounds.x[0] <= 0) { bounds.x[1] += 8; }
        else if(bounds.x[1] >= width) { bounds.x[0] -= 5; }
        if(bounds.y[0] <= 0) { bounds.y[1] += 6; }
        else if(bounds.y[1] >= height) { bounds.y[0] -= 5; }
        bounds.x[0] = Math.max(0, bounds.x[0]);
        bounds.y[0] = Math.max(0, bounds.y[0]);
        bounds.x[1] = Math.min(width, bounds.x[1]);
        bounds.y[1] = Math.min(height, bounds.y[1]);
        const offset = {
            x: Math.min(width - gfx.tileWidth, Math.max(centerx - (gfx.tileWidth / 2), 0 + 0.5)),
            y: Math.min(height - gfx.tileHeight, Math.max(centery - (gfx.tileHeight / 2), 0))
        };
        for(let y = bounds.y[0]; y < bounds.y[1]; y++) {
            for(let x = bounds.x[0]; x < bounds.x[1]; x++) {
                const realx = x - offset.x;
                const realy = y - offset.y;
                gfx.DrawSprite("cavesheet", this.floorType, 0, realx * 16, realy * 16, "background", false, false); // floor
                if(myDraw[y][x] !== false) {
                    const coord = myDraw[y][x];
                    const layer = y > centery ? "foreground" : "background";
                    gfx.DrawSprite("cavesheet", wallOffsetX + coord.x, wallOffsetY + coord.y, realx * 16, realy * 16, layer, false, false);
                }
            }
        }
        return offset;
    }
}
const caveEnemyPatterns = { // indexes go from left to right, top to bottom, 1 is x1 y0, 8 is x0 y1
    "enemy3_3_sm": [ [0, 0, 2], [2, 0, 3], [2, 2, 2], [4, 2, 3], [4, 0, 0], [2, 0, 1], [2, -2, 0], [0, -2, 1] ],
    "enemy3_8_sm": [ [0, 0, 0], [0, 2, 2], [2, 2, 3], [0, 2, 1] ],
    "enemy3_9_sm": [ [0, 0, 3], [0, -3, 0], [1, -3, 3], [1, 0, 2], [3, 0, 3], [3, 1, 2], [1, 1, 1], [1, 3, 2], [0, 3, 1], [0, 1, 0], [-3, 1, 1], [-3, 0, 0] ],
    "enemy3_13_sm": [ [0, 0, 0], [0, 1, 2], [-1, 1, 1], [0, 1, 3] ],
    "enemy3_32_sm": [ [0, 0, 0], [2, 0, 3], [2, 2, 2], [0, 2, 1] ],
    "enemy3_41_sm": [ [0, 0, 1], [-1, 0, 1], [-1, -1, 0], [1, -1, 3], [1, 0, 2] ],
    "enemy3_52_sm": [ [0, 0, 3], [0, 1, 2], [1, 1, 3], [1, 2, 2], [2, 2, 3], [2, -2, 0], [-2, -2, 1], [-2, -1, 2], [-1, -1, 3], [-1, 0, 2] ],
    "enemy3_5_md": [ [0, 0, 1], [10, 0, 3] ],
    "enemy5_5_md": [ [0, 0, 3], [-10, 0, 1] ],
    "enemy3_7_md": [ [0, 0, 2], [0, -8, 0] ],
    "enemy5_7_md": [ [0, 0, 0], [0, 8, 2] ],
    "enemy3_9_md": [ [0, 0, 2], [0, 3, 2], [-3, 3, 1], [-3, 7, 2], [0, 7, 3], [0, 11, 2], [4, 11, 3], [4, 7, 0], [7, 7, 3], [7, 3, 0], [4, 3, 1], [4, -1, 0], [0, -1, 1] ],
    "enemy5_9_md": [ [0, 0, 0], [0, -2, 0], [-4, -2, 1], [-4, -5, 0], [0, -5, 3], [0, -8, 0], [-4, -8, 1], [-4, -11, 0], [3, -11, 3], [3, 1, 2], [0, 1, 1] ],
    "enemy3_0_lg": [ [0, 0, 0], [4, 0, 3], [4, 4, 2], [0, 4, 1] ],
    "enemy5_0_lg": [ [0, 0, 2], [-4, 0, 1], [-4, -4, 0], [0, -4, 3] ],
    "enemy3_3_lg": [ [0, 0, 0], [2, 0, 3], [2, 2, 2], [0, 2, 1] ],
    "enemy3_4_lg": [ [0, 0, 0], [4, 0, 3], [4, 3, 2], [0, 3, 1] ],
    "enemy4_4_lg": [ [0, 0, 0], [2, 0, 3], [2, 2, 2], [0, 2, 1] ],
    "enemy5_4_lg": [ [0, 0, 2], [-4, 0, 1], [-4, -3, 0], [0, -3, 3] ]
};
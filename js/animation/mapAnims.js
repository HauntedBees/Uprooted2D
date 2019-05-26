function P(x, y) { return { x: x, y: y }; }
function MapAnimFactory(type, args) {
    let func = null, glitched = false, origArgs = [...args];
    switch(type) {
        case "sw": func = StandardWalk; break;
        case "dw": func = DiffWalk; break;
        case "as": func = AnimSeries; break;
        case "ds": func = DirAnimSeries; break;
        case "la": func = LineAnim; break;
        case "ft": func = SoloTile; break;
    }
    this.Get = function() {
        if(game.glitch === undefined && glitched) {
            glitched = false;
            args = [...origArgs];
        } else if(game.glitch && !glitched) {
            glitched = true;
            switch(type) {
                case "sw": {
                    const big = args[2];
                    args[0] = Range(0, big ? 10: 26) - 4;
                    args[1] = Range(0, big ? 9 : 23) - 5;
                    break;
                }
                case "dw": {
                    const big = args[3];
                    args[0] = Range(0, big ? 10: 26) - 4;
                    args[1] = Range(0, big ? 9 : 23) - args[2];
                    break;
                }
                case "as": {
                    const big = args[1];
                    for(let j = 0; j < posArrs[i].length; j++) {
                        args[0][j] = P(Range(0, big ? 10 : 26), Range(0, (big ? 9 : 23)));
                    }
                }
                case "ds": {
                    const big = args[1];
                    for(let i = 0; i < posArrs.length; i++) {
                        for(let j = 0; j < posArrs[i].length; j++) {
                            args[0][i][j] = P(Range(0, big ? 10 : 26), Range(0, (big ? 9 : 23)));
                        }
                    }
                }
                case "la": {
                    const big = args[3];
                    args[0] = Range(0, big ? 10 : 26);
                    args[1] = Range(0, big ? 9 : 23) - args[2];
                    break;
                }
                case "ft": {
                    const big = args[2];
                    args[0] = Range(0, big ? 10: 26);
                    args[1] = Range(0, big ? 9 : 23);
                }
            }
        }
        return new func(...args);
    };
}

function MapAnim(big, fps) {
    fps = fps || 6; big = big || false;
    this.sheet = big ? "mapCharBig" : "mapChar";
    this.width = big ? 32 : 16;
    this.height = big ? 40 : 20;
    this.big = big;
    this.lastRan = +new Date();
    this.frameRate = GetFrameRate(fps);
    this.state = 0;
}
function StandardWalk(topx, topy, big, fps) {
    MapAnim.call(this, big, fps);
    let lastDir = -1;
    this.getFrame = function(pos, dir, moving) {
        let frame = 0;
        const curTime = +new Date();
        const update = (curTime - this.lastRan) >= this.frameRate;
        if(dir === undefined) { dir = lastDir; }
        if(dir !== lastDir) {
            this.state = 0;
            lastDir = dir;
        } else if(moving) {
            if(update) {
                this.state = (this.state + 1) % 4;
                this.lastRan = curTime;
            }
            frame = 1 + (this.state === 3 ? 1 : this.state);
        } else { this.state = 0; }
        return {
            sheet: this.sheet, sx: topx + lastDir, sy: topy + frame, other: this.other,
            pos: pos, dir: dir, big: this.big, w: this.width, h: this.height
        };
    }
}
StandardWalk.prototype = Object.create(MapAnim.prototype);
StandardWalk.prototype.constructor = MapAnim;

function DiffWalk(topx, topy, sheetlen, big, fps) {
    MapAnim.call(this, big, fps);
    let lastDir = -1;
    this.getFrame = function(pos, dir, moving) {
        const curTime = +new Date();
        const update = (curTime - this.lastRan) >= this.frameRate;
        if(dir === undefined) { dir = lastDir; }
        if(dir !== lastDir) {
            this.state = 0;
            lastDir = dir;
        } else if(moving) {
            if(update) {
                this.state = (this.state + 1) % sheetlen;
                this.lastRan = curTime;
            }
        } else { this.state = 0; }
        return {
            sheet: this.sheet, sx: topx + lastDir, sy: topy + this.state,
            pos: pos, dir: dir, big: this.big, w: this.width, h: this.height
        };
    }
}
DiffWalk.prototype = Object.create(MapAnim.prototype);
DiffWalk.prototype.constructor = MapAnim;

function AnimSeries(posArr, big, fps) {
    MapAnim.call(this, big, fps);
    const sheetlen = posArr.length;
    this.getFrame = function(pos, dir, moving) {
        const curTime = +new Date();
        const update = (curTime - this.lastRan) >= this.frameRate;
        if(update) {
            this.state = (this.state + 1) % sheetlen;
            this.lastRan = curTime;
        }
        const frameInfo = posArr[this.state];
        return {
            sheet: this.sheet, sx: frameInfo.x, sy: frameInfo.y,
            pos: pos, dir: dir, big: this.big, w: this.width, h: this.height
        };
    }
}
AnimSeries.prototype = Object.create(MapAnim.prototype);
AnimSeries.prototype.constructor = MapAnim;

function DirAnimSeries(posArrs, big, fps) {
    MapAnim.call(this, big, fps);
    let lastDir = -1;
    const sheetLens = [];
    for(let i = 0; i < posArrs.length; i++) { sheetLens.push(posArrs[i].length); }
    this.getFrame = function(pos, dir, moving) {
        const curTime = +new Date();
        const update = (curTime - this.lastRan) >= this.frameRate;
        if(dir === undefined) { dir = lastDir; }
        if(dir !== lastDir) {
            this.state = 0;
            lastDir = dir;
        } else if(moving) {
            if(update) {
                this.state = (this.state + 1) % sheetLens[lastDir];
                this.lastRan = curTime;
            }
        } else { this.state = 0; }
        const frameInfo = posArrs[lastDir][this.state];
        return {
            sheet: this.sheet, sx: frameInfo.x, sy: frameInfo.y,
            pos: pos, dir: dir, big: this.big, w: this.width, h: this.height
        };
    }
}
DirAnimSeries.prototype = Object.create(MapAnim.prototype);
DirAnimSeries.prototype.constructor = MapAnim;

function LineAnim(topx, topy, sheetlen, big, fps) {
    MapAnim.call(this, big, fps);
    this.getFrame = function(pos, dir, moving) {
        if(moving) {
            const curTime = +new Date();
            const update = (curTime - this.lastRan) >= this.frameRate;
            if(update) {
                this.state = (this.state + 1) % sheetlen;
                this.lastRan = curTime;
            }
        } else { this.state = 0; }
        return {
            sheet: this.sheet, sx: topx, sy: topy + this.state,
            pos: pos, dir: dir, big: this.big, w: this.width, h: this.height
        };
    }
}
LineAnim.prototype = Object.create(MapAnim.prototype);
LineAnim.prototype.constructor = MapAnim;

function SoloTile(topx, topy, big, layer) {
    MapAnim.call(this, big, 1);
    this.getFrame = function(pos, dir) {
        return {
            sheet: this.sheet, sx: topx, sy: topy, layer: layer,
            pos: pos, dir: dir, big: this.big, w: this.width, h: this.height
        };
    }
}
SoloTile.prototype = Object.create(MapAnim.prototype);
SoloTile.prototype.constructor = MapAnim;

function SlightlyWiderSoloTile(topx, topy, big, layer) {
    MapAnim.call(this, big, 1);
    this.getFrame = function(pos, dir) {
        return {
            sheet: this.sheet, sx: topx, sy: topy, layer: layer,
            pos: pos, dir: dir, big: this.big, w: this.width, h: this.height,
            other: { slightlyWider: true }
        };
    }
}
SlightlyWiderSoloTile.prototype = Object.create(MapAnim.prototype);
SlightlyWiderSoloTile.prototype.constructor = MapAnim;

const PlAnim = a => { a.sheet = "mapPlayer"; return a };
const plAnims = {
    "walk": PlAnim(new StandardWalk(0, 0)), "carrywalk": PlAnim(new StandardWalk(0, 0)), "run": PlAnim(new StandardWalk(0, 4)),
    "crouchR": PlAnim(new SoloTile(4, 0)), "crouchL": PlAnim(new SoloTile(6, 1)),
    "water1": PlAnim(new SlightlyWiderSoloTile(4, 1)), "water2": PlAnim(new SlightlyWiderSoloTile(4, 2)),
    "think": PlAnim(new SoloTile(4, 3)), "read": PlAnim(new SoloTile(6, 0)),
    "shock1": PlAnim(new SoloTile(6, 2)), "shock2": PlAnim(new SoloTile(6, 3)),
    "hidden": PlAnim(new SoloTile(5, 0)),
};
plAnims.carrywalk.width = 20; plAnims.carrywalk.height = 25;
plAnims.carrywalk.sheet = "mapPlayerHelp";
plAnims.carrywalk.other = { bigBoy: true };

const Ft = (x, y, big, layer) => new MapAnimFactory("ft", [x, y, big, layer]);
const mafs = {
    // General
    "Beehive": Ft(15, 6),
    "BeeQueen": new MapAnimFactory("as", [[P(12, 4), P(12, 5), P(12, 6), P(12, 7)]]),
    "TruckL": Ft(4, 0, true), "TruckR": Ft(5, 0, true), 
    "Chest0": Ft(14, 11), "Chest1": Ft(15, 11),
    "Kaboom": new MapAnimFactory("as", [[P(5, 8), P(6, 8), P(9, 8), P(10, 8), P(10, 9)], true, 20]),
    "Smonk": new MapAnimFactory("la", [26, 11, 2]),
    // Init Farm
    "Nath1": new MapAnimFactory("sw", [0, 0]),
    "Nath2": new MapAnimFactory("la", [4, 2, 2]),
    "Nath3": new MapAnimFactory("la", [5, 2, 2]),
    "Iii1": Ft(4, 0), 
    "Iii2": Ft(4, 1), 
    "Iii3": new MapAnimFactory("la", [5, 0, 2]),
    "Iii4": new MapAnimFactory("la", [6, 1, 2]),
    "Iii5": Ft(6, 0), 
    // Produce Stand
    "Beck1": new MapAnimFactory("la", [7, 0, 2]),
    "Beck2": new MapAnimFactory("la", [10, 2, 2]),
    "Beck3": new MapAnimFactory("as", [[P(8, 1), P(8, 2), P(8,3), P(8, 2)]]),
    "Beck4": new MapAnimFactory("la", [10, 0, 2]),
    "Beck5": Ft(9, 0),
    "Beck6": new MapAnimFactory("as", [[P(9, 1), P(9, 2), P(9, 3), P(9, 2)]]),
    "Beck7": new MapAnimFactory("as", [[P(11, 1), P(11, 2), P(11, 3), P(11, 2)]]),
    "BeckBike": Ft(7, 2), "BeckTut": Ft(7, 3), 
    "EggF0": Ft(14, 7), "EggF1": Ft(14, 4), "EggF2": Ft(14, 5), "EggF3": Ft(14, 6), 
    // The Farm
    "Robo1": new MapAnimFactory("sw", [12, 0]),
    "Boss1": new MapAnimFactory("sw", [0, 0, true]),
    "Dead1": new MapAnimFactory("la", [10, 6, 2, true, 12]),
    // Nathan on the Farm
    "NOTF0": new MapAnimFactory("la", [9, 0, 7, true]),
    "NOTF1": new MapAnimFactory("la", [10, 0, 3, true]),
    "NOTF2": Ft(10, 3, true),
    // First Village
    "Dean": new MapAnimFactory("dw", [16, 0, 2]),
    "June": new MapAnimFactory("dw", [16, 2, 2]),
    "Aiko": new MapAnimFactory("dw", [16, 4, 2]),
    "Tanner": new MapAnimFactory("dw", [16, 6, 2]),
    // The Forest
    "GoldMush": Ft(15, 4), "CarrotBag": Ft(15, 7), "Fishfriend": new MapAnimFactory("dw", [4, 6, 2]), "HatchedGold": Ft(19, 10),
    "Lime": new MapAnimFactory("dw", [8, 4, 2, false, 2]), "LimeTalk": new MapAnimFactory("dw", [8, 6, 2, false, 6]),
    "Rabbit": new MapAnimFactory("la", [4, 6, 2]), "RabbitTalk": new MapAnimFactory("la", [5, 6, 2]),
    "RabbitClean": Ft(27, 10), "RabbitCleanTalk": new MapAnimFactory("la", [27, 10, 2]),
    "Turky": new MapAnimFactory("dw", [4, 4, 2]), "TurkyEgg": Ft(15, 5), "Bearbo": Ft(0, 2, true),
    "Mowz": new MapAnimFactory("dw", [0, 4, 2]), "Sqorl": new MapAnimFactory("dw", [0, 6, 2]),
    // Below Village
    "Robo2": new MapAnimFactory("sw", [4, 8]),
    // Research Lab
    "RAPBATTLE": new MapAnimFactory("la", [3, 10, 2]), "RAPSprout": Ft(6, 3),
    "Chair1": Ft(3, 8), "Chair2": Ft(3, 9),
    "DrJeff1": new MapAnimFactory("la", [8, 8, 2]), "DrJeff2": new MapAnimFactory("la", [8, 10, 2]),
    "DrJeff3": new MapAnimFactory("la", [26, 0, 2]), "DrJeff4": Ft(26, 2),
    "Switch0": Ft(0, 8), "Switch0d": Ft(0, 9), "Door0": Ft(0, 10), "Door0d": Ft(0, 11),
    "Switch1": Ft(1, 8), "Switch1d": Ft(1, 9), "Door1": Ft(1, 10), "Door1d": Ft(1, 11),
    "Switch2": Ft(2, 8), "Switch2d": Ft(2, 9), "Door2": Ft(2, 10), "Door2d": Ft(2, 11),
    // Bridge
    "Worker": new MapAnimFactory("sw", [9, 8]), "WorkerTalk": new MapAnimFactory("ds", [[[P(9, 8), P(13, 10)], [P(10, 8), P(14, 10)], [P(11, 8), P(15, 10)], [P(12, 8), P(16, 10)]]]),
    "BWorker": new MapAnimFactory("dw", [13, 8, 2]), 
    "Cow1": Ft(10, 4, true), "Cow2": Ft(10, 5, true),
    "HazardVert": Ft(0, 1, true), "LogTop": Ft(4, 1, true), "LogBottom": Ft(4, 2, true),
    "ConstructionShop": Ft(19, 11),
    "SadConstr": new MapAnimFactory("la", [27, 0, 2]),
    "SadConstrRun": new MapAnimFactory("ds", [[[P(27, 5), P(27, 6), P(27, 7), P(27, 6)], [P(27, 2), P(27, 3), P(27, 4), P(27, 3)]]]),
    // Underwater
    "Fishy": new MapAnimFactory("dw", [4, 12, 2]), "Monky": new MapAnimFactory("dw", [4, 14, 2]), 
    "Kelp1": new MapAnimFactory("la", [17, 8, 2]), "Kelp2": new MapAnimFactory("la", [18, 8, 2]),
    "Vase1": Ft(19, 8), "Vase2": Ft(19, 9),
    "PirateMonk": new MapAnimFactory("la", [17, 10, 2]), "ChestX": Ft(13, 11),
    "PirateRice": Ft(18, 10), "PirateGMO": Ft(18, 11),
    "ShipL": Ft(1, 1, true), "ShipM": Ft(2, 1, true), "ShipR": Ft(3, 1, true), "SeaMonCorpse": Ft(2, 8, true),
    "SeaMonL": Ft(1, 2, true), "SeaMonM": new MapAnimFactory("la", [2, 2, 2, true]), "SeaMonR": Ft(3, 2, true),
    "SeaMon2L": Ft(1, 3, true), "SeaMon2M": new MapAnimFactory("la", [1, 8, 2, true]), "SeaMon2R": Ft(3, 3, true),
    "Waterfall": new MapAnimFactory("dw", [0, 12, 4]), "WaterfallEnd": new MapAnimFactory("dw", [0, 16, 4]), "Rock": Ft(16, 11),
    // Fake Farm
    "Jef": new MapAnimFactory("sw", [8, 12]), "JefTalkR": new MapAnimFactory("as", [[P(11, 12), P(12, 12)]]), "JefTalkS": new MapAnimFactory("as", [[P(10, 12), P(12, 13)]]),
    "Chicky": new MapAnimFactory("sw", [13, 12]), "Pig": new MapAnimFactory("dw", [3, 16, 2]), "Mower": new MapAnimFactory("dw", [4, 16, 2]), "Golem": Ft(4, 18),
    "TruckFuck": Ft(4, 3, true), "FTV": new MapAnimFactory("la", [5, 1, 2, true]), "FTVOff": Ft(5, 3, true),
    "Hotbox": Ft(4, 19), "Outlet1": Ft(5, 18), "Outlet2": Ft(5, 19), "FFDoor1": Ft(6, 18), "FFDoor2": Ft(6, 19), "Zap": new MapAnimFactory("la", [7, 18, 2]),
    "HOUSEKEEPER": Ft(16, 16), "Tire1": Ft(12, 14), "Tire2": Ft(12, 15),
    "HOUSEKEEPERTalk": new MapAnimFactory("as", [[P(16, 17), P(16, 18), P(16, 19), P(16, 18)]]),
    "Crouton": Ft(17, 12), "CroutonTalk": new MapAnimFactory("as", [[P(17, 12), P(18, 12), P(19, 12)]]),
    // South City
    "Mobsty1": new MapAnimFactory("sw", [8, 16]), "Mobsty2": new MapAnimFactory("dw", [12, 18, 2]),
    "Skumpy1": new MapAnimFactory("la", [15, 16, 2]), "Skumpy2": new MapAnimFactory("la", [13, 16, 2]),
    "Skumpy3": new MapAnimFactory("la", [14, 16, 2]), "Skumpy4": new MapAnimFactory("la", [12, 16, 2]),
    "BarL": Ft(18, 15), "BarM": Ft(19, 15), "MobstyOut": Ft(17, 15), "MobstyHurt": new MapAnimFactory("la", [26, 3, 2]),
    "Pigeon1": new MapAnimFactory("la", [17, 13, 2]), "Pigeon2": new MapAnimFactory("la", [18, 13, 2]), "DoggyBags": Ft(6, 3, true),
    "Abuelita": new MapAnimFactory("la", [19, 13, 2]), "AbuelitaThrow": new MapAnimFactory("la", [26, 15, 2, false, 1]), "ChurchTip": Ft(8, 0),
    "FountainUL": new MapAnimFactory("as", [[P(3, 8), P(7, 8)], true]), "FountainUR": new MapAnimFactory("as", [[P(4, 8), P(8, 8)], true]),
    "FountainLLL": new MapAnimFactory("as", [[P(2, 9), P(6, 9)], true]), "FountainLML": new MapAnimFactory("as", [[P(3, 9), P(7, 9)], true]),
    "FountainLMR": new MapAnimFactory("as", [[P(4, 9), P(8, 9)], true]), "FountainLRR": new MapAnimFactory("as", [[P(5, 9), P(9, 9)], true]),
    // North City
    "Car1": new MapAnimFactory("dw", [0, 4, 2, true]), "Car2": new MapAnimFactory("dw", [4, 4, 2, true]),
    "Car3": new MapAnimFactory("dw", [0, 6, 2, true]), "Car4": new MapAnimFactory("dw", [4, 6, 2, true]),
    "St12": Ft(7, 0, true), "St13": Ft(7, 1, true), "St14": Ft(7, 2, true),
    "Cop": new MapAnimFactory("sw", [20, 0]), "CopStand": new MapAnimFactory("dw", [20, 4, 1]), "CopTalk": new MapAnimFactory("as", [[P(22, 4), P(23, 4)]]),
    "DelivTruck": new MapAnimFactory("dw", [20, 5, 2]), "Vendo": new MapAnimFactory("dw", [20, 7, 2]), "HoverNernd": new MapAnimFactory("dw", [20, 11, 2]),
    "Stand": new MapAnimFactory("dw", [20, 9, 1]), "Robber": new MapAnimFactory("dw", [20, 10, 1]), "CaughtRobber": Ft(17, 16),
    "NerdMech": Ft(0, 3, true), "Nernd1": new MapAnimFactory("dw", [20, 13, 2]), "Nernd2": new MapAnimFactory("dw", [20, 15, 2]),
    "GirlNernd": new MapAnimFactory("dw", [20, 17, 2]), "FishNernd": new MapAnimFactory("dw", [20, 19, 2]),
    "Mailman": new MapAnimFactory("la", [19, 16, 2]), "GamerCorpse": Ft(19, 18), "ATM": Ft(19, 19),
    "Mush1": new MapAnimFactory("la", [17, 17, 2]), "Mush2": new MapAnimFactory("la", [18, 16, 2]), "Mush3": Ft(18, 18), "Mush4": Ft(18, 19), "Mush5": Ft(17, 19),
    "HHolerGuy": new MapAnimFactory("la", [4, 20, 2]), "Barnt": new MapAnimFactory("la", [3, 21, 2]), "Danny": new MapAnimFactory("la", [0, 22, 2]),
    "Hole": Ft(4, 22), "CoverL": Ft(2, 22), "CoverM": Ft(3, 20), "CoverR": Ft(2, 23), "LavaLamp": new MapAnimFactory("la", [26, 5, 6]),
    "Keycard": Ft(2, 20), "Dweeb1": Ft(1, 22), "Dweeb2": Ft(1, 23), "Dweeb3": Ft(2, 21),
    "PCL": Ft(13, 6), "PCR": Ft(13, 7), "PCRbeef": Ft(11, 0), 
    // HQ 1
    "Newbot": new MapAnimFactory("sw", [5, 20]), "Trendy1": new MapAnimFactory("dw", [10, 20, 2]), "Trendy2": new MapAnimFactory("dw", [10, 22, 2]),
    "Receptionist": new MapAnimFactory("la", [9, 22, 2]), "Fuzuru": new MapAnimFactory("la", [24, 0, 3]), "Hungy": new MapAnimFactory("la", [10, 20, 2]),
    "Food2": Ft(3, 23), "HQChairL": Ft(9, 20), "HQChairR": Ft(9, 21), "RollerBob": new MapAnimFactory("dw", [14, 20, 2]),
    "MacL": Ft(13, 4), "MacR": Ft(13, 5), "FriendPCL": Ft(27, 8), "FriendPCR": Ft(27, 9),
    // HQ 2
    "RollerStart": new MapAnimFactory("sw", [20, 21]), "RollerEnd": new MapAnimFactory("dw", [14, 22, 2]),
    "TechRock": new MapAnimFactory("sw", [18, 20]), "TechRockPressed": new MapAnimFactory("sw", [18, 21]),
    "BuffNerd": new MapAnimFactory("dw", [18, 22, 2]),
    // HQ 3
    "HazardL": Ft(6, 0, true), "HazardR": Ft(6, 1, true),     
    "PodBaby1": new MapAnimFactory("la", [1, 20, 2]), "PodBaby2": new MapAnimFactory("la", [22, 22, 2]), "PodBaby3": new MapAnimFactory("la", [23, 22, 2]),
    "HurtWorker": new MapAnimFactory("la", [0, 20, 2]), "Chungus0": Ft(24, 23), "Chungus1": Ft(24, 22), "TheMonster": Ft(6, 2, true, "foreground"), 
    // HQ 4
    "Prophet1": Ft(24, 6), "Prophet2": Ft(24, 7), "Prophet3": Ft(24, 8), "Prophet4": Ft(24, 9), "Convince2": Ft(24, 5),
    "LotusBees": new MapAnimFactory("la", [24, 3, 2]),
    // HQ 5
    "BeckBack1": Ft(26, 17), "BeckBack2": new MapAnimFactory("la", [26, 18, 2]),
    "BeckBack3": new MapAnimFactory("la", [26, 20, 2]), "BeckBack4": new MapAnimFactory("la", [26, 22, 2]),
    // HQ 6
    "BeckCry1": new MapAnimFactory("la", [25, 15, 2]), "BeckCry2": new MapAnimFactory("la", [25, 17, 2]),
    "FBBack": Ft(24, 10), "FBSide": Ft(24, 11), "FBFront": new MapAnimFactory("la", [24, 12, 2]), "FBLook": new MapAnimFactory("la", [24, 14, 2]),
    "FBMad": new MapAnimFactory("la", [26, 13, 2]), "FBChair": Ft(24, 16), "FBGrab": Ft(24, 17), "FBToss": Ft(24, 18), "FBPush1": Ft(24, 19),
    "FBPush2": Ft(25, 19), "FBStand": new MapAnimFactory("la", [24, 20, 2]),
    "FBTable": Ft(7, 3, true), "FBTableFlip": new MapAnimFactory("la", [8, 0, 8, true, 24]),
    "FBBtn1": Ft(25, 20), "FBBtn2": Ft(25, 21), "FBBtn3": Ft(25, 22), "FBBtn4": Ft(25, 23),
    "FloorFlip0": Ft(25, 0), "FloorFlip1": Ft(25, 1), "FloorFlip2": Ft(25, 2), "FloorFlip3": Ft(25, 3), "FloorFlip4": Ft(25, 4),
    "FloorFlip5": Ft(25, 5), "FloorFlip6": Ft(25, 6),  "FloorFlip7": Ft(25, 7), "FloorFlip8": Ft(25, 8), "FloorFlip9": Ft(25, 9),
    "FloorFlip10": Ft(25, 10), "FloorFlip11": Ft(25, 11), "FloorFlip12": Ft(25, 12), "FloorFlip13": Ft(25, 13), "FloorFlip14": Ft(25, 14),
    // The Cave
    "RopeTop": Ft(27, 12), "RopeFade": Ft(27, 13), "RopeSign": Ft(27, 14), "RopeBottom": Ft(27, 15), "HealingStation": Ft(27, 16),
    "FOE": new MapAnimFactory("la", [27, 17, 4]), "FOEbig": new MapAnimFactory("la", [0, 8, 2, true, 3]),
    // Post-Game
    "Carlos": new MapAnimFactory("dw", [28, 0, 2]), "CoopPainter": new MapAnimFactory("la", [27, 21, 2]),
    "IGGirl1": new MapAnimFactory("dw", [28, 2, 2]), "IGGirl2": new MapAnimFactory("dw", [28, 4, 2]),
    "IGWorker1": new MapAnimFactory("dw", [28, 6, 2]), "IGWorker2": new MapAnimFactory("dw", [28, 8, 2]),
    "IGWorker3": new MapAnimFactory("dw", [28, 10, 2]), "Garlic": Ft(12, 19), "Apple": Ft(15, 19), "Corn": Ft(28, 23)
};
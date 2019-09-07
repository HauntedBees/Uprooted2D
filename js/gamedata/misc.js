const FloatRange = (min, max) => RoundNear(min + Math.random() * (max - min), 8);
const Range = (min, max) => min + Math.floor(Math.random() * (max - min));
const InclusiveRange = (min, max) => Range(min, max + 1);
const RoundNear = (x, num) => Math.round(x * num) / num;
const FloorNear = (x, num) => Math.floor(x * num) / num;
const RandomArrayItem = arr => arr[Math.floor(Math.random() * arr.length)];
const SamePoints = (a, b) => a.x === b.x && a.y === b.y;
const Between = (i, a, b) => a <= i && i <= b;
const NearRound = i => Math.round(i * 10) / 10;
/*const DiffPoints = (p1, p2) => ({ x: p1.x - p2.x, y: p1.y - p2.y });
const AddPoints = (p1, p2) => ({ x: p1.x + p2.x, y: p1.y + p2.y });
const MultPoint = (p, m) => ({ x: p.x * m, y: p.y * m });*/ // NOTE: UNUSED BUT MAYBE USEFUL

const inns = {
    "start": { x: 21, y: 5.25, map: "farm" },
    "inn0": { x : 10, y: 3, map: "farm" },
    "inn1": { x : 16, y: 5, map: "firstvillage" },
    "mermaidinn": { x : 21, y: 11, map: "bridge" },
    "fakefarm": { x: 17, y: 5.5, map: "fakefarm" },
    "skumpys": { x: 41, y: 43, map: "southcity" },
    "bigCity": { x: 34.5, y: 44, map: "northcity" },
    "nerdBed": { x: 13, y: 8, map: "hq_1" },
    "lastInn": { x: 5, y: 6, map: "hq_5" },
    "caveDive": { x: 17, y: 7.5, map: "northcity", inside: true }
};

const mapBattleXref = {
    "underwater": "bgs/underwater",
    "researchfacility": "bgs/researchlab",
    "fakefarm": "bgs/fakefarm",
    "southcity": "bgs/scity",
    "northcity": "bgs/ncity",
    "hq_1": "bgs/hq",
    "hq_2": "bgs/hq",
    "hq_3": "bgs/hq",
    "hq_4": "bgs/hq",
    "hq_5": "bgs/hq",
    "hq_6": "bgs/hq",
    "cave": "bgs/cave"
};
const mapBattleTileXref = {
    "underwater": "seaGrass",
    "researchfacility": "techGrass",
    "northcity": "roadGrass",
    "hq_1": "hqGrass",
    "hq_2": "hqGrass",
    "hq_3": "hqGrass",
    "hq_4": "hqGrass",
    "hq_5": "hqGrass",
    "hq_6": "hqGrass",
    "cave": "caveT"
};

const levelStats = {
    hp: [25, 30, 35, 45, 55, 65, 75, 95, 115, 135, 160, 195, 235, 280, 340, 400, 500, 600, 700, 850],
    atk: [3,  5,  7, 10, 13, 16, 19, 22,  25,  28,  32,  36,  40,  44,  48,  52,  56,  60,  64,  70],
    def: [2,  4,  6,  8, 12, 15, 18, 20,  24,  25,  30,  35,  39,  43,  45,  50,  55,  59,  63,  65]
};

function IsPlayerCrop(x, y) {
    const tile = combat.grid[x][y];
    return (tile !== null && tile.x === undefined && tile.type !== "rock");
}
function GetPlayerCrop() {
    let attempts = 5;
    while(attempts-- > 0) { // try picking at random first
        const x = Range(0, player.gridWidth);
        const y = Range(0, player.gridHeight);
        if(IsPlayerCrop(x, y)) { return { x: x, y: y }; }
    }
    return GetFirstWithMatch(0, player.gridWidth, 0, player.gridHeight, IsPlayerCrop);
}
function GetEnemyPlantablePosition(xmin, xmax, ymin, ymax, isBig) {
    let attempts = 5;
    const delta = isBig ? 1 : 0;
    while(attempts-- > 0) { // try picking at random first
        const x = Range(xmin, xmax - delta);
        const y = Range(ymin, ymax - delta);
        if(enemyHelpers.CanPlantInSpot(x, y, isBig)) { return { x: x, y: y }; }
    }
    return GetFirstWithMatch(xmin, xmax, ymin, ymax, (x, y) => enemyHelpers.CanPlantInSpot(x, y, isBig));
}
function GetFirstWithMatch(xmin, xmax, ymin, ymax, func) {
    for(let x = xmin; x < xmax; x++) {
        for(let y = ymin; y < ymax; y++) {
            if(func(x, y)) { return { x: x, y: y }; }
        }
    }
    return null;
}

function GetEnemyHealthMult(hp) {
    switch(player.options.difficulty) {
        case 0: return Math.ceil(hp * 0.66);
        case 1: return hp;
        case 2: return Math.ceil(hp * 1.25);
    }
    return hp;
}
function GetPriceMultiplier() {
    switch(player.options.difficulty) {
        case 0: return 0.5;
        case 1: return 1;
        case 2: return 1.5;
    }
    return 1;
};

function UpdateStatsForCurrentDifficulty() {
    const idx = player.level - 1;
    const oldmaxhealth = player.maxhealth;
    player.maxhealth = levelStats.hp[idx];
    player.atk = levelStats.atk[idx];
    player.def = levelStats.def[idx];
    player.luck = 0.7 + (player.level / 100);
    switch(player.options.difficulty) {
        case 0: // easy
            player.maxhealth = Math.ceil(player.maxhealth * 1.6);
            player.atk = Math.ceil(player.atk * 1.6);
            player.def = Math.ceil(player.def * 1.6);
            player.luck += 0.08;
            break;
        case 2: // hard
            player.maxhealth = Math.ceil(player.maxhealth * 0.6);
            player.atk = Math.ceil(player.atk * 0.75);
            player.def = Math.ceil(player.def * 0.75);
            player.luck -= 0.1;
            break;
    }
    player.health = Math.round((player.health / oldmaxhealth) * player.maxhealth);    
};
const mapCache = [];
function GetEntities(mapName, fromSave) {
    if(mapentities[mapName] === undefined) { return []; }
    let entities = null;
    for(let i = 0; i < mapCache.length; i++) {
        if(mapCache[i].name !== mapName) { continue; }
        entities = [...mapCache[i].entities]; break;
    }
    if(entities === null) { 
        entities = mapentities[mapName]();
        mapCache.push( {name: mapName, entities: [...entities]} );
        if(mapCache.length > 3) { mapCache.shift(); }
    } //const entities = [...mapentities[mapName]];
    for(let i = entities.length - 1; i >= 0; i--) {
        const e = entities[i];
        //if(typeof e.anim === "string") { console.log("JEEPS ARE TRUCKS"); SetUpFellow(e, e.anim); }
        if(player.clearedEntities.indexOf(e.name) >= 0) {
            entities.splice(i, 1);
        } else if(e.showIf && !e.showIf()) {
            entities.splice(i, 1);
        } else if(player.openedChests.indexOf(e.name) >= 0) {
            ForceChestOpen(e);
        }
    }
    if(!fromSave) { entities.push(...GetRandomEnemies(mapName)); }
    return entities;
}

function GetRandomEnemies(mapName) {
    const enemyInfo = randomEnemyRange[mapName];
    if(enemyInfo === undefined) { return []; }
    let numEnemies = InclusiveRange(enemyInfo[0], enemyInfo[1]);
    const potentialEnemies = randEnemies[mapName].slice();
    const enemies = [];
    while(numEnemies-- > 0 && potentialEnemies.length > 0) {
        const newEnemy = potentialEnemies.splice(Range(0, potentialEnemies.length), 1);
        enemies.push(newEnemy[0]);
    }
    return enemies;
}
const randomEnemyRange = {
    "forest": [8, 9],
    "belowvillage": [4, 5],
    "underwater": [10, 14],
    "fakefarm": [8, 8],
    "northcity": [17, 24],
    "hq_1": [6, 11],
    "hq_2": [8, 10]
};
const commonEnemyInfo = {
    // Forest
    mouse: { interactname: "mouse", dialogMax: 3, anim: "Mowz" },
    sqorl: { interactname: "sqorl", dialogMax: 4, anim: "Sqorl" },
    // Below Village & Research Lab
    robo2: { interactname: "research", dialogMax: 5, anim: "Robo2" },
    // Underwater
    fish: { interactname: "fish", dialogMax: 3, anim: "Fishy" },
    seamonk: { interactname: "seamonk", dialogMax: 8, anim: "Monky" },
    // Fake Farm
    golem: { visible: false, inside: true, interactname: "golem", dialogMax: 1, anim: "Golem" },
    piggn: ct => ({ visible: false, inside: true, interactname: "pig", dialogMax: 1,changeType: ct, noChange: true, anim: "Pig" }),
    chick: ct => ({ interactname: "chickbot", dialogMax: 3, changeType: ct, anim: "Chicky" }),
    // North City
    hoverdweeb: { interactname: "hoverdweeb", dialogMax: 3, enemies: ["hoverdweeb"], min: 1, max: 1, anim: "HoverNernd", moveToTalk: true, moving: false },
    vendo: { interactname: "vendo", dialogMax: 2, anim: "Vendo" },
    vendo2: { interactname: "vendo", dialogMax: 2, anim: "Vendo", inside: true, visible: false },
    delivery: { interactname: "delivTruck", dialogMax: 3, anim: "DelivTruck" },
    car1: { interactname: "carBr", dialogMax: 3, anim: "Car2", big: true },
    car2: { interactname: "carBl", dialogMax: 3, anim: "Car3", big: true },
    car3: { interactname: "carRe", dialogMax: 3, anim: "Car1", big: true },
    car4: { interactname: "foodTruck", dialogMax: 4, anim: "Car4", big: true },
    // HQ 1
    tinyNerd: { interactname: "tinyNerd", dialogMax: 5, anim: "Nernd1" },
    hipNerd: { interactname: "trendyNerd", dialogMax: 5, anim: "Trendy1", moving: true },
    hipNerdUp: { interactname: "trendyNerd", dialogMax: 5, anim: "Trendy2", moving: true },
    roboGuard: { interactname: "wowNewRobot", dialogMax: 10, anim: "Newbot" },
    // HQ 2
    buffNerd: { interactname: "buffNerd", dialogMax: 3, anim: "BuffNerd", moving: true, isBuffNerd: true }
};
const commonEnemyGenInfo = {
    // Forest
    "Rat": EnemyMetadataFunc("mouse", ["mouse"], 1, 3),
    "Sqorl": EnemyMetadataFunc("sqorl", ["sqorl", "mouse"], 1, 2),
    // Below Village & Research Lab
    "BVRobo": EnemyMetadataFunc("robo2", ["robo"], 1, 2),
    // Underwater
    "Fishy": EnemyMetadataFunc("fishFace", ["fishFace", "fishFace", "seaMonk"], 1, 2),
    "SeaMonk": EnemyMetadataFunc("seaMonk", ["seaMonk"], 1, 3),
    // Fake Farm
    "Chicky": EnemyMetadataFunc("chickBot", ["chickBot"], 1, 2),
    "Pig": EnemyMetadataFunc("piggun", ["piggun", "piggun", "chickBot"], 2, 4),
    "Golem": EnemyMetadataFunc("golem", [], 1, 1),
    // North City
    "Car1": EnemyMetadataFunc("brownCar", ["brownCar"], 1, 2),
    "Car2": EnemyMetadataFunc("blueCar", ["blueCar"], 1, 3),
    "Car3": EnemyMetadataFunc("redCar", ["redCar"], 1, 4),
    "Car4": EnemyMetadataFunc("foodTruck", ["foodTruck"], 2, 3),
    "Delivery": EnemyMetadataFunc("delivTruck", ["delivTruck"], 1, 2),
    "Vendo": EnemyMetadataFunc("vendo", ["vendo"], 1, 2),
    "Hoverdweeb": EnemyMetadataFunc("hoverdweeb", ["hoverdweeb", "hoverdweeb", "vendo"], 2, 4),
    // HQ 1
    "HQ1Robo": EnemyMetadataFunc("robo4b", ["robo4a", "robo4b", "robo4c"], 2, 4),
    "HipNerd": EnemyMetadataFunc("trendyNerd", ["trendyNerd", "trendyNerd", "coffeeNerd", "tinyNerd", "theFunnyOne"], 1, 2),
    "RegNerd": EnemyMetadataFunc("tinyNerd", ["tinyNerd", "tinyNerd", "coffeeNerd", "theFunnyOne"], 1, 2),
    // HQ 2    
    "BuffNerd": EnemyMetadataFunc("buffNerd", ["buffNerd", "buffNerd", "coffeeNerd", "theFunnyOne"], 2, 3)
};
const randEnemies = {
    "forest": [
        GetREnemy("Rat", 32, 46, 0, 2, commonMovementDatas.rectangle(32, 46, 4, 3), "mouse"),
        GetREnemy("Rat", 23, 47, 0, 2, commonMovementDatas.rectangle(23, 47, 4, 2), "mouse"),
        GetREnemy("Rat", 100, 71, 0, 2, commonMovementDatas.rectangle(100, 71, 6, 2), "mouse"),
        GetREnemy("Rat", 106, 71, 0, 2, commonMovementDatas.rectangle(100, 71, 6, 2, 1), "mouse"),
        GetREnemy("Rat", 106, 73, 0, 2, commonMovementDatas.rectangle(100, 71, 6, 2, 2), "mouse"),
        GetREnemy("Rat", 100, 73, 0, 2, commonMovementDatas.rectangle(100, 71, 6, 2, 3), "mouse"),
        GetREnemy("Sqorl", 2, 40, 8, 2, commonMovementDatas.rectangle(2, 40, 10, 1), "sqorl"),
        GetREnemy("Sqorl", 110, 65, 8, 2, commonMovementDatas.rectangle(110, 65, 3, 6), "sqorl"),
        GetREnemy("Sqorl", 113, 71, 8, 2, commonMovementDatas.rectangle(110, 65, 3, 6, 2), "sqorl")
    ],
    "belowvillage": [
        GetREnemy("BVRobo", 20, 20, 4, 2, GetStdMovement([ [20, 20, 3], [27, 20, 3], [27, 24, 2], [20, 24, 1], [20, 20, 0] ]), "robo2"),
        GetREnemy("BVRobo", 10, 38, 4, 2, GetStdMovement([ [10, 38, 3], [11, 38, 3], [11, 39, 2], [10, 39, 1], [10, 38, 0] ]), "robo2"),
        GetREnemy("BVRobo", 10, 31, 4, 2, GetStdMovement([ [10, 31, 3], [14, 31, 3], [10, 31, 1] ]), "robo2"),
        GetREnemy("BVRobo", 8, 28, 4, 2, GetStdMovement([ [8, 28, 3], [13, 28, 3], [8, 28, 1] ]), "robo2"),
        GetREnemy("BVRobo", 3, 23, 4, 2, GetStdMovement([ [3, 23, 3], [13, 23, 3], [3, 23, 1] ]), "robo2"),
    ],
    "underwater": [
        GetREnemy("Fishy", 34, 5, 0, 3, commonMovementDatas.rectangle(34, 5, 4, 4), "fish"),
        GetREnemy("Fishy", 38, 24, 0, 2, commonMovementDatas.downrectangle(38, 24, 4, 5), "fish"),
        GetREnemy("Fishy", 39, 25, 0, 2, commonMovementDatas.rectangle(39, 25, 2, 3), "fish"),
        GetREnemy("Fishy", 3, 24, 0, 2, commonMovementDatas.rectangle(3, 24, 8, 1), "fish"),
        GetREnemy("Fishy", 9, 23, 0, 2, commonMovementDatas.downrectangle(9, 23, 2, 3), "fish"),
        GetREnemy("Fishy", 7, 3, 0, 3, commonMovementDatas.rectangle(6, 3, 9, 2, 0), "fish"),
        GetREnemy("Fishy", 9, 3, 0, 3, commonMovementDatas.rectangle(6, 3, 9, 2, 0), "fish"),
        GetREnemy("Fishy", 11, 3, 0, 3, commonMovementDatas.rectangle(6, 3, 9, 2, 0), "fish"),
        GetREnemy("Fishy", 13, 3, 0, 3, commonMovementDatas.rectangle(6, 3, 9, 2, 0), "fish"),
        GetREnemy("Fishy", 15, 3, 0, 3, commonMovementDatas.rectangle(6, 3, 9, 2, 0), "fish"),
        GetREnemy("Fishy", 14, 5, 0, 1, commonMovementDatas.rectangle(6, 3, 9, 2, 2), "fish"),
        GetREnemy("Fishy", 12, 5, 0, 1, commonMovementDatas.rectangle(6, 3, 9, 2, 2), "fish"),
        GetREnemy("Fishy", 10, 5, 0, 1, commonMovementDatas.rectangle(6, 3, 9, 2, 2), "fish"),
        GetREnemy("Fishy", 8, 5, 0, 1, commonMovementDatas.rectangle(6, 3, 9, 2, 2), "fish"),
        GetREnemy("Fishy", 6, 5, 0, 1, commonMovementDatas.rectangle(6, 3, 9, 2, 2), "fish"),
        GetREnemy("SeaMonk", 2, 9, 4, 2, commonMovementDatas.rectangle(2, 9, 1, 14), "seamonk"),
        GetREnemy("SeaMonk", 16, 24, 4, 2, commonMovementDatas.downrectangle(16, 24, 11, 2), "seamonk"),        
    ],
    "fakefarm": [
        GetREnemy("Chicky", 10, 15, 0, 3, undefined, "chick", 1), // 1 = full left to right
        GetREnemy("Chicky", 19, 18, 0, 1, undefined, "chick", 2), // 2 = half right to left
        GetREnemy("Chicky", 10, 21, 0, 3, undefined, "chick", 3), // 3 = half left to right 
        GetREnemy("Pig", 10, 18, 3, 3, undefined, "piggn", 3), 
        GetREnemy("Pig", 19, 24, 3, 1, undefined, "piggn", 4), // 4 = 3/4 right to left
        GetREnemy("Golem", 10, 24, 4, 0, undefined, "golem"),
        GetREnemy("Golem", 9, 24, 4, 0, undefined, "golem"),
        GetREnemy("Golem", 8, 24, 4, 0, undefined, "golem")
    ],
    "northcity": [
        GetREnemy("Car1", 8, 28, 0, 2, commonMovementDatas.fastdownrect(8, 28, 52, 16), "car1"),
        GetREnemy("Car2", 8, 44, 0, 3, commonMovementDatas.fastdownrect(8, 28, 52, 16, 1), "car2"),
        GetREnemy("Car3", 60, 44, 4, 0, commonMovementDatas.fastdownrect(8, 28, 52, 16, 2), "car3"),
        GetREnemy("Car4", 60, 28, 4, 1, commonMovementDatas.fastdownrect(8, 28, 52, 16, 3), "car4"),
        GetREnemy("Car4", 8, 36, 4, 2, commonMovementDatas.fastdownrect(8, 28, 52, 16), "car4"),
        GetREnemy("Car1", 34, 44, 0, 3, commonMovementDatas.fastdownrect(8, 28, 52, 16, 1), "car1"),
        GetREnemy("Car2", 60, 31, 0, 0, commonMovementDatas.fastdownrect(8, 28, 52, 16, 2), "car2"),
        GetREnemy("Car3", 34, 28, 4, 1, commonMovementDatas.fastdownrect(8, 28, 52, 16, 3), "car3"),
        GetREnemy("Car2", -5, 30, 0, 2, commonMovementDatas.fastdownrect(-5, 27, 65, 18), "car2"),
        GetREnemy("Car1", 12, 44, 0, 3, commonMovementDatas.fastdownrect(-5, 27, 65, 18, 1), "car1"),
        GetREnemy("Car4", 60, 38, 4, 0, commonMovementDatas.fastdownrect(-5, 27, 65, 18, 2), "car4"),
        GetREnemy("Car3", 54, 27, 4, 1, commonMovementDatas.fastdownrect(-5, 27, 65, 18, 3), "car3"),
        GetREnemy("Car4", 30, 27, 4, 1, commonMovementDatas.fastdownrect(-5, 27, 65, 18, 3), "car4"),
        GetREnemy("Car4", 47, 27, 4, 1, commonMovementDatas.fastdownrect(-5, 27, 65, 18, 3), "car4"),
        GetREnemy("Car4", 25, 44, 4, 3, commonMovementDatas.fastdownrect(-5, 27, 65, 18, 1), "car4"),
        GetREnemy("Car3", 45, 44, 4, 3, commonMovementDatas.fastdownrect(-5, 27, 65, 18, 3), "car3"),
        GetREnemy("Delivery", 10, 13, 4, 3, commonMovementDatas.rectangle(10, 13, 49, 14, 3), "delivery"),
        GetREnemy("Delivery", 59, 27, 4, 1, commonMovementDatas.rectangle(10, 13, 49, 14, 1), "delivery"),
        GetREnemy("Delivery", -5, 13, 4, 3, commonMovementDatas.rectangle(-5, 13, 12, 14, 3), "delivery"),
        GetREnemy("Delivery", -8, 30, 4, 3, commonMovementDatas.rectangle(-8, 30, 15, 14, 3), "delivery"),
        GetREnemy("Vendo", 7, 23, 12, 1, commonMovementDatas.rectangle(-8, 13, 15, 14, 1), "vendo"),
        GetREnemy("Vendo", 53, 32, 12, 2, undefined, "vendo2"),
        GetREnemy("Vendo", 38, 13, 12, 3, commonMovementDatas.rectangle(10, 13, 49, 14), "vendo"),
        GetREnemy("Hoverdweeb", 31, 11, 12, 2, commonMovementDatas.downrectangle(31, 11, 10, 1), "hoverdweeb"),
        GetREnemy("Hoverdweeb", 8, 15, 12, 2, commonMovementDatas.downrectangle(8, 15, 1, 12), "hoverdweeb"),
        GetREnemy("Hoverdweeb", 60, 11, 12, 2, commonMovementDatas.downrectangle(60, 11, 2, 15), "hoverdweeb")
    ],
    "hq_1": [
        GetREnemy("HQ1Robo", 16, 8, 16, 3, commonMovementDatas.rectangle(16, 8, 3, 2), "roboGuard"),
        GetREnemy("HQ1Robo", 5, 11, 16, 2, commonMovementDatas.downrectangle(5, 11, 4, 2), "roboGuard"),
        GetREnemy("HipNerd", 13, 15, 20, 2, undefined, "hipNerd"),
        GetREnemy("HipNerd", 13, 18, 20, 0, undefined, "hipNerdUp"),
        GetREnemy("HipNerd", 16, 18, 20, 0, undefined, "hipNerdUp"),
        GetREnemy("HipNerd", 12, 18, 20, 0, undefined, "hipNerdUp"),
        GetREnemy("HipNerd", 17, 18, 20, 0, undefined, "hipNerdUp"),
        GetREnemy("RegNerd", 3, 18, 4, 3, undefined, "tinyNerd"),
        GetREnemy("RegNerd", 11, 8, 4, 2, undefined, "tinyNerd"),
        GetREnemy("RegNerd", 9, 19, 4, 1, undefined, "tinyNerd"),
        GetREnemy("RegNerd", 3, 13, 4, 1, undefined, "tinyNerd"),
        GetREnemy("RegNerd", 2, 23, 4, 1, undefined, "tinyNerd")
    ],
    "hq_2": [
        GetREnemy("HQ1Robo", 2, 20, 16, 2, commonMovementDatas.downrectangle(2, 20, 2, 5), "roboGuard"),
        GetREnemy("HQ1Robo", 4, 25, 16, 0, commonMovementDatas.downrectangle(2, 20, 2, 5, 2), "roboGuard"),
        GetREnemy("HQ1Robo", 24, 26, 16, 3, commonMovementDatas.rectangle(24, 26, 5, 2), "roboGuard"),
        GetREnemy("HQ1Robo", 26, 10, 16, 3, commonMovementDatas.downrectangle(26, 10, 3, 2), "roboGuard"),
        GetREnemy("HQ1Robo", 17, 27, 16, 2, commonMovementDatas.downrectangle(17, 27, 6, 1), "roboGuard"),
        GetREnemy("BuffNerd", 15, 22, 8, 2, undefined, "buffNerd"),
        GetREnemy("BuffNerd", 7, 23, 8, 2, undefined, "buffNerd"),
        GetREnemy("BuffNerd", 14, 13, 8, 2, undefined, "buffNerd"),
        GetREnemy("BuffNerd", 21, 13, 8, 2, undefined, "buffNerd"),
        GetREnemy("BuffNerd", 29, 24, 8, 2, undefined, "buffNerd"),
        GetREnemy("BuffNerd", 29, 3, 8, 2, undefined, "buffNerd")
    ]
};
function GetREnemy(key, x, y, firstx, dir, movement, metaDataId, param) {
    let metadata = commonEnemyInfo[metaDataId];
    if(param !== undefined) { metadata = metadata(param); }
    const enemy = GetFellow("~" + key + Range(0, 1000), x, y, dir, metadata.anim, Cutscene("enemy"), movement, metadata);
    enemy.key = key; enemy.metadataid = metaDataId;
    enemy.fx = firstx; enemy.param = param;
    return enemy;
}
function EnemyMetadataFunc(requiredEnemy, potentialEnemies, min, max) {
    return function() {
        const enemies = [ requiredEnemy ];
        let remainingEnemies = Range(min, max) - 1;
        while(remainingEnemies-- > 0) { enemies.push(RandomArrayItem(potentialEnemies)); }
        return enemies;
    }
}
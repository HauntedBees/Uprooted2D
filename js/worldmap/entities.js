var beeQueen = { interact: [
    function() {
        worldmap.writeText("BeeGuard0");
        worldmap.playerDir = 2;
        worldmap.refreshMap();
    },
    function() {
        worldmap.writeText("BeeGuard1");
        worldmap.playerDir = 1;
        worldmap.refreshMap();
    },
    function() {
        worldmap.writeText("BeeGuard2");
        worldmap.playerDir = 0;
        worldmap.refreshMap();
    },
    function() {
        worldmap.writeText("BeeGuard3");
        worldmap.playerDir = 3;
        worldmap.refreshMap();
    },
    function() {
        worldmap.writeText("BeeGuard4");
        worldmap.playerDir = 2;
        worldmap.refreshMap();
    },
    function() {
        game.target = null;
        player.beeQueensFaced++;
        worldmap.angryBees = false;
        var enemy = player.beeQueensFaced < 2 ? "beeQueenA" : (player.beeQueensFaced < 5 ? "beeQueenB" : "beeQueenC");
        combat.startBattle([enemy]);
    }
]};
var mapentities = {
    "farm_init": [
        GetInvisibleEntity("CS_farminit", Cutscene("farminit"), { autoplay: true }),
        GetCommonEntity("Nathan", 24, 11, 0, 1, undefined, undefined, { sheet: "assistant", storageKey: "nathanA" }),
        GetCommonEntity("Eagle", 16, 9, 4, 0, undefined, undefined, { sheet: "assistant" })
    ],
    "producestand": [
        GetInvisibleEntity("CS_produce", Cutscene("pstand"), { autoplay: true }),
        GetInvisibleEntity("PostInitialBattle", Cutscene("finTut"), { storageKey: "PostInitialBattle" }), 
        GetCommonEntity("HipsterBike", 6, 4, 0, 0, undefined, undefined, { sy: 2, sheet: "hipster", storageKey: "bike", visible: false, solid: false }),
        GetCommonEntity("Hipster", 0, 4, 0, 0, undefined, undefined, { sheet: "hipster", moving: true, sheetlen: 2, storageKey: "hipster", postBattle: "PostInitialBattle" }),
        GetCommonEntity("ConvinceATron", 10, 4, 0, 0, undefined, Cutscene("tutBuddy"), { sy: 3, noChange: true, sheet: "hipster", noRunKill: true, storageKey: "convince", visible: false, postBattle: "PostStandaloneTutorial" }),
        GetInvisibleEntity("PostStandaloneTutorial", Cutscene("finStTut"), { storageKey: "PostStandaloneTutorial" }),
        
        SwitchMap("ExitAreaWest", 0, 0, false, true, 22, 12, "farm"),
        { name: "ExitAreaSouth", pos: { x: 0, y: 23}, isRow: true, interact: Cutscene("farmFirst"), solid: false, visible: false },

        GetCommonEntity("AFuckingTruckL", 16, 5, 4, 0, undefined, specialtyHelpers.truckArray, { big: true, noChange: true }),
        GetCommonEntity("AFuckingTruckR", 18, 5, 5, 0, undefined, specialtyHelpers.truckArray, { big: true, noChange: true }),

        GetCommonEntity("EggFairy", 24, 19, 13, 1, undefined, Cutscene("eggfairy"), { visible: false, storageKey: "eggFairy" })
    ],
    "farm": [
        SwitchMap("ExitAreaWest", 23, 0, false, true, 1, 20, "producestand"),

        GetCommonEntity("Fucker", 10, 3, 0, 2, undefined, Cutscene("bigBot"), { big: true, postBattle: "PostBoss", failedInteract: Cutscene("bigBotL") }),
        GetInvisibleEntity("PostBoss", Cutscene("bigBotW"), { storageKey: "PostBoss" }),
        
        GetBeehive("FarmHive", 3, 1),
        EnterShop("ChickenCoop", 18, 3, "coop"),
        EnterShop("Inn", 10, 2, "inn0"),

        GetCommonEntity("Robo1", 20, 8, 4, 2, commonMovementDatas.robo(20), Cutscene("enemy"), enemyMetadata.robo), 
        GetCommonEntity("Robo2", 17, 10, 4, 2, commonMovementDatas.robo(17), Cutscene("enemy"), enemyMetadata.robo), 
        GetCommonEntity("Robo3", 16, 12, 4, 2, commonMovementDatas.robo(16), Cutscene("enemy"), enemyMetadata.robo), 
        GetCommonEntity("Robo4", 13, 14, 4, 2, commonMovementDatas.robo(13), Cutscene("enemy"), enemyMetadata.robo), 
        GetCommonEntity("Robo5", 12, 11, 4, 2, commonMovementDatas.robo(12, 1), Cutscene("enemy"), enemyMetadata.robo), 
        GetCommonEntity("Robo6", 9, 15, 4, 2, commonMovementDatas.robo(9, 1), Cutscene("enemy"), enemyMetadata.robo),

        GetCommonInvisibleSpeakingEntity("MushroomLog", 4, 6, "farmMush"),
        GetCommonInvisibleSpeakingEntity("TreeLL", 6, 8, "farmTree"),
        GetCommonInvisibleSpeakingEntity("TreeLR", 7, 8, "farmTree"),
        GetCommonInvisibleSpeakingEntity("TreeUL", 6, 7, "farmTree"),
        GetCommonInvisibleSpeakingEntity("TreeUR", 7, 7, "farmTree"),
        GetCommonInvisibleSpeakingEntity("Hay", 21, 4, "farmHay"),
        GetCommonInvisibleSpeakingEntity("Bin", 17, 3, "farmBin"),
        GetCommonInvisibleSpeakingEntity("WaterL", 13, 2, "farmWater"),
        GetCommonInvisibleSpeakingEntity("WaterM", 14, 2, "farmWater"),
        GetCommonInvisibleSpeakingEntity("WaterR", 15, 2, "farmWater"),
        GetCommonInvisibleSpeakingEntity("Crop", 10, 8, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("Crop", 11, 8, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("Crop", 14, 8, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("Crop", 15, 8, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("Crop", 18, 8, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("Crop", 19, 8, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("Crop", 10, 9, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("SprinklerPop", 11, 9, "farmSprinkler"),
        GetCommonInvisibleSpeakingEntity("SprinklerPop", 14, 9, "farmSprinkler"),
        GetCommonInvisibleSpeakingEntity("Crop", 15, 9, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("Crop", 18, 9, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("SprinklerPop", 19, 9, "farmSprinkler"),
        GetCommonInvisibleSpeakingEntity("Crop", 10, 10, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("Crop", 11, 10, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("Crop", 14, 10, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("Crop", 15, 10, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("Crop", 18, 10, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("Crop", 19, 10, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("Crop", 10, 11, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("Crop", 11, 11, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("Crop", 14, 11, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("Crop", 15, 11, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("Crop", 18, 11, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("Crop", 19, 11, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("SprinklerPop", 10, 12, "farmSprinkler"),
        GetCommonInvisibleSpeakingEntity("Crop", 11, 12, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("Crop", 14, 12, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("SprinklerPop", 15, 12, "farmSprinkler"),
        GetCommonInvisibleSpeakingEntity("SprinklerPop", 18, 12, "farmSprinkler"),
        GetCommonInvisibleSpeakingEntity("Crop", 19, 12, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("Crop", 10, 13, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("Crop", 11, 13, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("Crop", 14, 13, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("Crop", 15, 13, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("Crop", 18, 13, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("Crop", 19, 13, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("Crop", 10, 14, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("Crop", 11, 14, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("Crop", 14, 14, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("Crop", 15, 14, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("Crop", 18, 14, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("Crop", 19, 14, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("Crop", 10, 15, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("SprinklerPop", 11, 15, "farmSprinkler"),
        GetCommonInvisibleSpeakingEntity("SprinklerPop", 14, 15, "farmSprinkler"),
        GetCommonInvisibleSpeakingEntity("Crop", 15, 15, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("Crop", 18, 15, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("SprinklerPop", 19, 15, "farmSprinkler"),
        GetCommonInvisibleSpeakingEntity("Crop", 10, 16, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("Crop", 11, 16, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("Crop", 14, 16, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("Crop", 15, 16, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("Crop", 18, 16, "farmVeggie"),
        GetCommonInvisibleSpeakingEntity("Crop", 19, 16, "farmVeggie")
    ],
    "firstvillage": [
        SwitchMap("ExitAreaNorth", 0, 0, true, false, 16, 22, "producestand"),
        SwitchMap("ExitAreaWest", 0, 0, false, true, 44, 49, "forest"),
        SwitchMap("ExitAreaSouth", 0, 30, true, false, 21.5, 1, "belowvillage"),
        GetCommonEntity("Dean", 10, 13, 15, 3, undefined, [GetSpeak("villager0")], { sy: 6 }),
        GetCommonEntity("June", 20, 5, 19, 2, undefined, [GetSpeak("villager1")], { sy: 6 }),
        GetCommonEntity("Aiko", 27, 10, 15, 3, undefined, [GetSpeak("villager2")], { sy: 7 }),
        GetCommonEntity("Tanner", 3, 18, 19, 0, undefined, [GetSpeak("villager3")], { sy: 7 }),
        EnterShop("EquipmentShop", 17, 12, "equip1"),
        GetSign(18, 13, "SignWeapon0"),
        EnterShop("UpgradeShop", 18, 20, "upgrade1"),
        GetSign(17, 21, "SignExpand0"),
        EnterShop("FixtureShop", 3, 6, "fixture1"),
        GetSign(4, 7, "SignFixture0"),
        EnterShop("SeedShopL", 5, 17, "seed1"),
        EnterShop("SeedShopR", 6, 17, "seed1"),
        GetSign(7, 18, "SignSeeds0"),
        EnterShop("Inn", 16, 4, "inn1"),
        GetSign(15, 5, "SignInn0"),
        GetSign(1, 24, "SignForest")
    ],
    "forest": [
        SwitchMap("ExitAreaEast", 46, 49, false, false, 1, 22.5, "firstvillage"),
        
        GetCommonEntity("Rat1", 32, 46, 0, 2, commonMovementDatas.rectangle(32, 46, 4, 3), Cutscene("enemy"), enemyMetadata.mouse),
        GetCommonEntity("Rat2", 23, 47, 0, 2, commonMovementDatas.rectangle(23, 47, 4, 2), Cutscene("enemy"), enemyMetadata.mouse),
        GetCommonEntity("Rat3", 100, 71, 0, 2, commonMovementDatas.rectangle(100, 71, 6, 2), Cutscene("enemy"), enemyMetadata.mouse),
        GetCommonEntity("Rat4", 106, 71, 0, 2, commonMovementDatas.rectangle(100, 71, 6, 2, 1), Cutscene("enemy"), enemyMetadata.mouse),
        GetCommonEntity("Rat5", 106, 73, 0, 2, commonMovementDatas.rectangle(100, 71, 6, 2, 2), Cutscene("enemy"), enemyMetadata.mouse),
        GetCommonEntity("Rat6", 100, 73, 0, 2, commonMovementDatas.rectangle(100, 71, 6, 2, 3), Cutscene("enemy"), enemyMetadata.mouse),
        GetCommonEntity("Sqorl1", 2, 40, 8, 2, commonMovementDatas.rectangle(2, 40, 10, 1), Cutscene("enemy"), enemyMetadata.sqorl),
        GetCommonEntity("Sqorl2", 110, 65, 8, 2, commonMovementDatas.rectangle(110, 65, 3, 6), Cutscene("enemy"), enemyMetadata.sqorl),
        GetCommonEntity("Sqorl3", 113, 71, 8, 2, commonMovementDatas.rectangle(110, 65, 3, 6, 2), Cutscene("enemy"), enemyMetadata.sqorl),
        GetCommonEntity("Turkey1", 2, 56, 0, 0, undefined, Cutscene("enemy"), enemyMetadata.turky),
        GetCommonEntity("Turkey2", 7, 57, 0, 0, undefined, Cutscene("enemy"), enemyMetadata.turky),
        GetCommonEntity("Turkey3", 10, 62, 0, 0, undefined, Cutscene("enemy"), enemyMetadata.turky),
        GetCommonEntity("Turkey4", 12, 60, 0, 0, undefined, Cutscene("turky"), { sy: 7 }),
        GetCommonEntity("TurkeyEggs", 12, 59, 9, 0, undefined, [function() { worldmap.writeText("foundTurkey"); player.increaseItem("turkey", 5); worldmap.clearTarget(); }], { noChange: true, sy: 7 }),
        
        GetCommonEntity("GoldenShroom", 36, 24, 8, 0, undefined, [
            function() {
                if(player.hasQuest("quest1")) { worldmap.writeText("foundShroomQ"); player.activeQuests["quest1"] = 2; }
                else { worldmap.writeText("foundShroom"); player.activeQuests["quest1"] = 4; }
                worldmap.clearTarget();
            }
        ], { noChange: true, sy: 7 }),
        GetBeehive("ForestHive", 54, 24),
        GetCommonEntity("Lime", 103, 66, 10, 0, undefined, Cutscene("lime"), { noChange: true, sy: 7 }),

        GetCommonEntity("CarrotSeeds", 83, 25, 3, 0, undefined, [
            function() {
                if(player.hasQuest("freeCarrotSeeds") && player.activeQuests["freeCarrotSeeds"] > 4) { worldmap.writeText("carrotseeds1"); }
                else {
                    worldmap.writeText("carrotseeds0"); player.increaseItem("carrot", 3);
                    if(player.hasQuest("freeCarrotSeeds")) { player.activeQuests["freeCarrotSeeds"] += 1; }
                    else { player.activeQuests["freeCarrotSeeds"] = 1; }
                }
            },
        ], { noChange: true, sy: 4 }),
        GetCommonEntity("BadInfluenceRabbit", 83, 26, 12, 0, undefined, Cutscene("rabbit"), { noChange: true, sy: 4, moving: true, sheetlen: 2 }),

        GetCommonEntity("FishyLeft", 72, 24, 12, 0, undefined, Cutscene("sadfish"), { noChange: true, sy: 6, visible: false }),
        GetCommonEntity("FishyRight", 73, 24, 12, 0, undefined, Cutscene("sadfish"), { noChange: true, sy: 6, visible: false }),
        GetCommonEntity("FishyTop", 73, 23, 12, 0, undefined, Cutscene("sadfish"), { noChange: true, sy: 6, visible: false }),

        SwitchMapSeamless("JoinBlue", 32, 35, 0, 70, 31),
        SwitchMapSeamless("JoinAqua", 74, 36, 2, 111, 58),
        SwitchMapSeamless("JoinMaroon", 111, 57, 0, 36, 31),
        SwitchMapSeamless("JoinLightBlue", 54, 35, 2, 36, 42),
        SwitchMapSeamless("JoinYellow", 17, 24, 1, 83, 33),
        SwitchMapSeamless("JoinYellow2", 17, 25, 1, 83, 34),
        SwitchMapSeamless("JoinGreen", 92, 33, 3, 23, 40), 
        SwitchMapSeamless("JoinGreen2", 92, 34, 3, 23, 41), 
        SwitchMapSeamless("JoinDarkBlue", 31, 59, 2, 74, 17),
        SwitchMapSeamless("JoinDarkBlue2", 32, 59, 2, 75, 17),
        SwitchMapSeamless("JoinGrey", 100, 53, 0, 9, 46),
        SwitchMapSeamless("JoinGrey2", 101, 53, 0, 10, 46)
    ],
    "belowvillage": [
        SwitchMap("ExitAreaNorth", 0, 0, true, false, 21.5, 28, "firstvillage"),
        SwitchMap("EnterFacilitySide", 13, 16, false, false, 30, 2, "researchfacility"),
        SwitchMap("EnterFacilityL", 7, 18, false, false, 12, 36, "researchfacility"),
        SwitchMap("EnterFacilityR", 8, 18, false, false, 13, 36, "researchfacility"),
        GetBeehive("BelowHive", 4, 36),
        
        GetCommonEntity("Rat1", 32, 46, 0, 2, commonMovementDatas.rectangle(32, 46, 4, 3), Cutscene("enemy"), enemyMetadata.mouse),
        GetCommonEntity("Robo1", 20, 20, 4, 2, GetStdMovement([ [20, 20, 3], [27, 20, 3], [27, 24, 2], [20, 24, 1], [20, 20, 0] ]), Cutscene("enemy"), enemyMetadata.robo2),
        GetCommonEntity("Robo2", 10, 38, 4, 2, GetStdMovement([ [10, 38, 3], [11, 38, 3], [11, 39, 2], [10, 39, 1], [10, 38, 0] ]), Cutscene("enemy"), enemyMetadata.robo2),
        GetCommonEntity("Robo3", 10, 31, 4, 2, GetStdMovement([ [10, 31, 3], [14, 31, 3], [10, 31, 1] ]), Cutscene("enemy"), enemyMetadata.robo2),
        GetCommonEntity("Robo4", 8, 28, 4, 2, GetStdMovement([ [8, 28, 3], [13, 28, 3], [8, 28, 1] ]), Cutscene("enemy"), enemyMetadata.robo2),
        GetCommonEntity("Robo5", 3, 23, 4, 2, GetStdMovement([ [3, 23, 3], [13, 23, 3], [3, 23, 1] ]), Cutscene("enemy"), enemyMetadata.robo2),
        GetCommonEntity("Robo6", 22, 36, 4, 3, undefined, Cutscene("enemy"), enemyMetadata.robo2)
    ],
    "researchfacility": function() {
		var x = [
			GetCommonEntity("Robo1", 1, 15, 4, 2, GetStdMovement([ [1, 15, 3], [5, 15, 3], [5, 20, 2], [1, 20, 1], [1, 15, 0] ]), Cutscene("enemy"), enemyMetadata.robo2),
			GetCommonEntity("Robo2", 25, 14, 4, 2, GetStdMovement([ [25, 14, 3], [30, 14, 3], [30, 22, 2], [25, 22, 1], [25, 14, 0] ]), Cutscene("enemy"), enemyMetadata.robo2),
			GetCommonEntity("Robo3", 14, 7, 4, 2, GetStdMovement([ [14, 7, 3], [23, 7, 3], [23, 13, 2], [14, 13, 1], [14, 7, 0] ]), Cutscene("enemy"), enemyMetadata.robo2),
			GetCommonEntity("Robo4", 16, 9, 4, 2, GetStdMovement([ [16, 9, 3], [21, 9, 3], [21, 11, 2], [16, 11, 1], [16, 9, 0] ]), Cutscene("enemy"), enemyMetadata.robo2),
			GetCommonEntity("Robo25", 14, 1, 4, 2, GetStdMovement([ [14, 1, 3], [18, 1, 3], [18, 5, 2], [14, 5, 1], [14, 1, 0] ]), Cutscene("enemy"), enemyMetadata.robo2),
			SwitchMap("ExitAreaSouth", 0, 37, true, false, 7.5, 19, "belowvillage"),
            SwitchMap("ExitAreaEast", 31, 2, false, false, 13, 15, "belowvillage"),
            
			GetInvisibleEntity("SeedShotArea1", Cutscene("seedShot"), { pos: { x: 20, y: 16 }, hasShot: 0 }),
			GetInvisibleEntity("SeedShotArea2", Cutscene("seedShot"), { pos: { x: 21, y: 16 }, hasShot: 0 }),
			GetInvisibleEntity("SeedShotArea3", Cutscene("seedShot"), { pos: { x: 20, y: 17 }, hasShot: 0 }),
			GetInvisibleEntity("SeedShotArea4", Cutscene("seedShot"), { pos: { x: 21, y: 17 }, hasShot: 0 }),

			GetCommonEntity("Chair", 8, 4, 14, 0, undefined, [ function() {
					game.target.swapped = !game.target.swapped;
					game.target.anim.shiftY(game.target.swapped ? 4 : 3);
					worldmap.finishDialog();
                } ], { sy: 3, noChange: true, swapped: false }),
                
            GetCommonEntity("RAPBATTLE", 28, 8, 11, 0, undefined, Cutscene("rap"), { noChange: true, sy: 7 }),

            GetCommonEntity("Jeff", 7, 2, 0, 0, undefined, Cutscene("jeff"), { sy: 4, postBattle: "PostBoss2", noChange: true, failedInteract: Cutscene("jeffL") }),
            GetInvisibleEntity("PostBoss2", Cutscene("jeffW"), { storageKey: "PostBoss2" })
		];
		var doors = [
			[5, 31, 0, false], [5, 32, 0, false], [10, 28, 0, true], [10, 29, 0, true], [6, 17, 0, true], [6, 18, 0, true], [6, 19, 0, true], [6, 20, 0, true],
			[28, 23, 0, false], [29, 23, 0, false], [30, 23, 0, false], [27, 3, 0, false], [28, 3, 0, false], [29, 3, 0, false], [30, 3, 0, false], [13, 11, 0, false],
			[7, 14, 0, false], [20, 35, 1, false], [20, 36, 1, false], [14, 14, 1, false], [15, 14, 1, false], [16, 14, 1, false], [20, 14, 1, true], [21, 14, 1, true],
			[19, 2, 1, true], [19, 3, 1, true], [27, 4, 1, false], [28, 4, 1, false], [29, 4, 1, false], [30, 4, 1, false], [25, 6, 1, true], [13, 28, 2, false],
			[13, 29, 2, false], [13, 9, 2, true], [26, 24, 2, false], [25, 24, 2, false], [25, 13, 2, true], [26, 13, 2, true], [27, 13, 2, true], [27, 5, 2, false],
			[28, 5, 2, false], [29, 5, 2, false], [30, 5, 2, false], [17, 6, 2, false], [18, 6, 2, false]
		];
		for(var i = 0; i < doors.length; i++) { var d = doors[i]; x.push(GetRFDoor("Door" + i, d[0], d[1], d[2], d[3])); }
		
		var buttons = [ [2, 35, 0, false], [12, 7, 0, false], [18, 32, 1, false], [22, 8, 1, false], [4, 13, 2, false], [29, 15, 2, false] ];
		for(var i = 0; i < buttons.length; i++) { var b = buttons[i]; x.push(GetRFDoorButton("Btn" + i, b[0], b[1], b[2], b[3])); }
		
		var invisSpeaks = [
			[28, 9, "growingpeppie"], [28, 11, "growingpeppie"], [29, 11, "rottencrop"], [28, 10, "rottencrop"], [18, 17, "seedshooter"], [18, 16, "seedshooter"], [23, 17, "seedshooter"], 
			[23, 16, "seedshooter"], [12, 16, "seasmod"], [13, 16, "seasmod"], [12, 15, "seasmod"], [13, 15, "seasmod"], [2, 13, "flask"], [2, 11, "sink"], [3, 11, "sink"], [6, 24, "labprinter"],
			[16, 26, "bookshelf_left"], [17, 26, "bookshelf_left"], [18, 26, "bookshelf_mid"], [19, 26, "bookshelf_mid"], [20, 26, "bookshelf_mid"], [21, 26, "bookshelf_mid"],
			[22, 26, "bookshelf_mid"], [23, 26, "bookshelf_right"], [24, 26, "bookshelf_right"], [10, 32, "broken_robot"], [11, 32, "broken_robot"], [12, 32, "broken_robot"], [13, 32, "broken_robot"], 
			[12, 31, "broken_robot"], [13, 31, "broken_robot"], [1, 7, "devbed"], [2, 7, "devbed"], [1, 3, "devmachines"], [2, 3, "devmachines"], [3, 2, "devmachines"], [4, 1, "devmonitor"],
			[5, 1, "devmachines"], [6, 1, "devmachines"], [7, 1, "devmachines"], [8, 1, "devmachines"], [9, 1, "devmachines"], [10, 2, "devmachines"], [11, 3, "devmachines"], [12, 3, "devmachines"]
		];
		for(var i = 0; i < invisSpeaks.length; i++) { var s = invisSpeaks[i]; x.push(GetCommonInvisibleSpeakingEntity("Spk" + i, s[0], s[1], s[2])); }
		
		var chests = [
			[21, 3, [["carrot", 20]]], [21, 2, [["carrot", 20]]], [29, 27, [["carrot", 20]]], [8, 12, [["carrot", 20]]], [9, 12, [["carrot", 20]]],
			[10, 12, [["carrot", 20]]], [11, 12, [["carrot", 20]]], [27, 6, [["carrot", 20]]], [28, 6, [["carrot", 20]]], [29, 6, [["carrot", 20]]], 
			[30, 6, [["carrot", 20]]] 
		];
		for(var i = 0; i < chests.length; i++) { var c = chests[i]; x.push(GetTreasureChest("RLChest" + i, c[0], c[1], c[2])); }
		
		var stationaryRobos = [
			[22, 2], [23, 2], [24, 2], [25, 2], [22, 3], [23, 3], [24, 3], [25, 3], [20, 4], [21, 4],
			[22, 4], [23, 4], [24, 4], [25, 4], [20, 1], [21, 1], [22, 1], [23, 1], [24, 1], [25, 1]
		]
		for(var i = 0; i < stationaryRobos.length; i++) { var r = stationaryRobos[i]; x.push(GetCommonEntity("StRobo" + i, r[0], r[1], 4, 2, undefined, Cutscene("enemy"), enemyMetadata.robo2)); }
		
		return x;
	}(),
    "bridge": [
        SwitchMap("GoUnderwater", 4, 14, false, false, 41, 20, "underwater"),
        GetSign(9, 13, "SignMermaid"),
        GetSign(26, 3, "SignConstWork"),
        GetSign(20, 12, "SignMermaidInn"),
        EnterShop("Mermaid Inn", 20, 11, "mermaidinn"),
        EnterShop("Construction Shoppe", 25, 3, "cworker"),
        GetCommonEntity("ConstructionManShop", 25, 3, 15, 0, undefined, undefined, { sy: 4, solid: false, noChange: true }),
        EnterShop("Mermaid Shoppe", 10, 13, "mermaid"),
        GetCommonEntity("Worker1", 24, 5, 0, 3, undefined, [
            function() {
                if(player.hasQuestState("helpSeaMonster", ["help"])) {
                    worldmap.writeText("constr1_foe");
                } else {
                    worldmap.writeText("constr1_fr1");
                }
            }, function() {
                if(player.hasQuestState("helpSeaMonster", ["help"])) {
                    combat.startBattle(["Worker"]);
                } else {
                    worldmap.writeText("constr1_fr2");
                }
            }
        ]),
        GetCommonEntity("Worker2", 21, 7, 0, 3, GetStdMovement([ [21, 7, 1], [11, 7, 1], [11, 5, 0], [21, 5, 3], [21, 7, 2] ]), [
            function(activePress) {
                if(player.hasQuestState("helpSeaMonster", ["help"])) {
                    worldmap.writeText("w21");
                } else if(activePress) {
                    worldmap.writeText("w22");
                    worldmap.forceEndDialog = true;
                } else {
                    return true;
                }
            },
            function() {
                combat.startBattle(["Worker"]);
            }
        ]),
        GetCommonEntity("Worker3", 18, 6, 0, 3, GetStdMovement([ [18, 6, 1], [7, 6, 1], [7, 4, 0], [18, 4, 3], [18, 6, 2] ]), [
            function(activePress) {
                if(player.hasQuestState("helpSeaMonster", ["help"])) {
                    worldmap.writeText("w21");
                } else if(activePress) {
                    worldmap.writeText("w22");
                    worldmap.forceEndDialog = true;
                } else {
                    return true;
                }
            },
            function() {
                combat.startBattle(["Worker"]);
            }
        ]),
        GetCommonEntity("HeadWorker", 5, 6, 8, 3, undefined, [
            function() { // 0
                if(player.hasQuestState("helpSeaMonster", ["help"])) {
                    worldmap.writeText("bworkerMad1");
                    worldmap.dialogData.nextDialogState = 9;
                } else if(player.hasQuest("getHeart")) {
                    switch(player.activeQuests["getHeart"]) {
                        case "hold":
                            worldmap.writeText("bworkerC5", ["sYes", "sNo"]);
                            worldmap.dialogData.nextDialogState = 15;
                            break;
                        case "heart":
                            worldmap.writeText("bworkerB1");
                            worldmap.dialogData.nextDialogState = 16;
                            break;
                        case "weirdheart":
                            worldmap.writeText("bworkerC1");
                            worldmap.dialogData.nextDialogState = 12;
                            break;
                        case "yep":
                            worldmap.writeText("bworker10");
                            worldmap.forceEndDialog = true;
                            break;
                        case "nope":
                            worldmap.writeText("bworkerMad4");
                            worldmap.dialogData.nextDialogState = 11;
                            break;
                    }
                } else {
                    worldmap.writeText("bworker1");
                }
            }, 
            GetSpeak("bworker2"), // 1
            GetSpeak("bworker3"), // 2
            GetSpeak("bworker4"), // 3
            GetSpeak("bworker5"), // 4
            GetSpeak("bworker6"), // 5
            GetSpeak("bworker7"), // 6
            GetSpeak("bworker8"), // 7
            function() { // 8
                worldmap.writeText("bworker9");
                worldmap.forceEndDialog = true;
                player.activeQuests["getHeart"] = "yep";
            },
            GetSpeak("bworkerMad2"), // 9
            GetSpeak("bworkerMad3"), // 10
            function() { // 11
                player.activeQuests["getHeart"] = "nope";
                combat.startBattle(["Worker", "BossWorker", "Worker"]);
            },
            GetSpeak("bworkerC2"), // 12
            GetSpeak("bworkerC3"), // 13
            GetSpeak("bworkerC4", ["sYes", "sNo"]), // 14
            function(i) { // 15
                if(i === 0) {
                    worldmap.writeText("bworkerCY");
                    worldmap.dialogData.nextDialogState = 18;
                } else {
                    worldmap.writeText("bworkerCN");
                    player.activeQuests["getHeart"] = "hold";
                    worldmap.forceEndDialog = true;
                }
            },
            GetSpeak("bworkerB2"), // 16
            GetSpeak("bworkerB3"), // 17
            GetSpeak("bworkerB4"), // 18
            function() { // 29
                for(var i = worldmap.entities.length - 1; i >= 0; i--) {
                    var e = worldmap.entities[i].name;
                    if(e.indexOf("H_") === 0 || e.indexOf("Worker") >= 0) { 
                        player.clearedEntities.push(e);
                        worldmap.entities.splice(i, 1);
                    }
                }
                worldmap.refreshMap();
                quests.completeQuest("helpSeaMonster");
                quests.completeQuest("getHeart");
                worldmap.writeText("bworkerB5");
            }
        ], { postBattle: "BeatWorkers" }),
        {
            name: "BeatWorkers", storageKey: "BeatWorkers", pos: {x: -1, y: -1}, solid: false,
            interact: [
                GetSpeak("bworkerMad5"),
                function() {
                    worldmap.writeText("bworkerMad6");
                    player.activeQuests["helpSeaMonster"] = "gotEgg";
                    for(var i = worldmap.entities.length - 1; i >= 0; i--) {
                        var e = worldmap.entities[i].name;
                        if(e.indexOf("Worker") >= 0) { 
                            player.clearedEntities.push(e);
                            worldmap.entities.splice(i, 1);
                        }
                    }
                }
            ]
        },
        GetCommonEntity("AFuckingTruckL", 28, 3, 4, 0, undefined, specialtyHelpers.truckArray, { big: true, noChange: true }),
        GetCommonEntity("AFuckingTruckR", 30, 3, 5, 0, undefined, specialtyHelpers.truckArray, { big: true, noChange: true }),
        GetCommonEntity("H_Log1B", 3, 7, 4, 0, undefined, undefined, { big: true, noChange: true, sy: 2 }),
        GetCommonEntity("H_Log1T", 3, 4.5, 4, 0, undefined, undefined, { big: true, noChange: true, sy: 1 }),
        GetCommonEntity("H_Log2B", 2, 7, 4, 0, undefined, undefined, { big: true, noChange: true, sy: 2 }),
        GetCommonEntity("H_Log2T", 2, 4.5, 4, 0, undefined, undefined, { big: true, noChange: true, sy: 1 }),
        GetCommonEntity("H_Log3B", 1, 7, 4, 0, undefined, undefined, { big: true, noChange: true, sy: 2 }),
        GetCommonEntity("H_Log3T", 1, 4.5, 4, 0, undefined, undefined, { big: true, noChange: true, sy: 1 }),
        GetCommonEntity("H_Hazard1", 22, 4, 0, 0, undefined, undefined, { big: true, noChange: true, sy: 1 }),
        GetCommonEntity("H_Hazard2", 22, 7, 0, 0, undefined, undefined, { big: true, noChange: true, sy: 1 }),
        GetCommonEntity("H_Barrier1", 4, 4, 0, 0, undefined, undefined, { visible: false }),
        GetCommonEntity("H_Barrier2", 4, 5, 0, 0, undefined, undefined, { visible: false }),
        GetCommonEntity("H_Barrier3", 4, 6, 0, 0, undefined, undefined, { visible: false }),
        GetCommonEntity("H_Barrier4", 4, 7, 0, 0, undefined, undefined, { visible: false }),
        GetCommonEntity("SeaLeftTop", 6, 3, 1, 0, undefined, undefined, { big: true, sy: 3, visible: false, storageKey: "slt" }),
        GetCommonEntity("SeaMidTop", 8, 3, 1, 1, undefined, [ GetSpeak("smD7") ], { big: true, sy: 3, visible: false, storageKey: "smt", noChange: true }),
        GetCommonEntity("SeaRightTop", 10, 3, 1, 2, undefined, undefined, { big: true, sy: 3, visible: false, storageKey: "srt" }),
        {
            name: "FishMoved", storageKey: "FishMoved", pos: {x: -1, y: -1}, solid: false,
            interact: [
                function() {
                    worldmap.playerDir = 0;
                    worldmap.importantEntities["slt"].visible = true;
                    worldmap.importantEntities["smt"].visible = true;
                    worldmap.importantEntities["srt"].visible = true;
                    worldmap.refreshMap();
                    worldmap.writeText("smD5");
                },
                function() {
                    for(var i = worldmap.entities.length - 1; i >= 0; i--) {
                        var e = worldmap.entities[i].name;
                        if(e.indexOf("H_") === 0) { 
                            player.clearedEntities.push(e);
                            worldmap.entities.splice(i, 1);
                        }
                    }
                    worldmap.refreshMap();
                    worldmap.writeText("smD6");
                },
                function() {
                    quests.completeQuest("helpSeaMonster");
                    quests.completeQuest("getHeart");
                    worldmap.writeText("smD7");
                }
            ]
        }
    ],
    "underwater": function() {
        var x = [
            SwitchMap("GoAboveGround", 42, 20, false, false, 5, 14, "bridge"),
            GetCommonEntity("FishFace1", 34, 5, 0, 3, commonMovementDatas.rectangle(34, 5, 4, 4), commonInteractArrays.fish, { sy: 8, sheetlen: 2 }),
            GetCommonEntity("FishFace2", 38, 24, 0, 2, commonMovementDatas.downrectangle(38, 24, 4, 5), commonInteractArrays.fish, { sy: 8, sheetlen: 2 }),
            GetCommonEntity("FishFace3", 39, 25, 0, 2, commonMovementDatas.rectangle(39, 25, 2, 3), commonInteractArrays.fish, { sy: 8, sheetlen: 2 }),
            GetCommonEntity("FishFace4", 3, 24, 0, 2, commonMovementDatas.rectangle(3, 24, 8, 1), commonInteractArrays.fish, { sy: 8, sheetlen: 2 }),
            GetCommonEntity("FishFace5", 9, 23, 0, 2, commonMovementDatas.downrectangle(9, 23, 2, 3), commonInteractArrays.fish, { sy: 8, sheetlen: 2 }),
            GetCommonEntity("FishFace6", 7, 3, 0, 3, commonMovementDatas.rectangle(6, 3, 9, 2, 0), commonInteractArrays.fish, { sy: 8, sheetlen: 2 }),
            GetCommonEntity("FishFace7", 9, 3, 0, 3, commonMovementDatas.rectangle(6, 3, 9, 2, 0), commonInteractArrays.fish, { sy: 8, sheetlen: 2 }),
            GetCommonEntity("FishFace8", 11, 3, 0, 3, commonMovementDatas.rectangle(6, 3, 9, 2, 0), commonInteractArrays.fish, { sy: 8, sheetlen: 2 }),
            GetCommonEntity("FishFace9", 13, 3, 0, 3, commonMovementDatas.rectangle(6, 3, 9, 2, 0), commonInteractArrays.fish, { sy: 8, sheetlen: 2 }),
            GetCommonEntity("FishFace10", 15, 3, 0, 3, commonMovementDatas.rectangle(6, 3, 9, 2, 0), commonInteractArrays.fish, { sy: 8, sheetlen: 2 }),
            GetCommonEntity("FishFace11", 14, 5, 0, 1, commonMovementDatas.rectangle(6, 3, 9, 2, 2), commonInteractArrays.fish, { sy: 8, sheetlen: 2 }),
            GetCommonEntity("FishFace12", 12, 5, 0, 1, commonMovementDatas.rectangle(6, 3, 9, 2, 2), commonInteractArrays.fish, { sy: 8, sheetlen: 2 }),
            GetCommonEntity("FishFace13", 10, 5, 0, 1, commonMovementDatas.rectangle(6, 3, 9, 2, 2), commonInteractArrays.fish, { sy: 8, sheetlen: 2 }),
            GetCommonEntity("FishFace14", 8, 5, 0, 1, commonMovementDatas.rectangle(6, 3, 9, 2, 2), commonInteractArrays.fish, { sy: 8, sheetlen: 2 }),
            GetCommonEntity("FishFace15", 6, 5, 0, 1, commonMovementDatas.rectangle(6, 3, 9, 2, 2), commonInteractArrays.fish, { sy: 8, sheetlen: 2 }),
            GetCommonEntity("SeaMonk1", 34, 18, 4, 2, commonMovementDatas.rectangle(34, 18, 0, 10), commonInteractArrays.smonk, { sy: 8, sheetlen: 2 }),
            GetCommonEntity("SeaMonk2", 16, 24, 4, 2, commonMovementDatas.downrectangle(16, 24, 11, 2), commonInteractArrays.smonk, { sy: 8, sheetlen: 2 }),
            GetCommonEntity("SeaMonk3", 31, 27, 4, 3, GetStdMovement([[31, 27, 0], [32, 27, 3], [32, 29, 2], [25, 29, 1], [25, 27, 0], [28, 27, 3], [28, 28, 2], [31, 28, 3]]), commonInteractArrays.smonk, { sy: 8, sheetlen: 2 }),
            GetCommonEntity("SeaMonk4", 2, 9, 4, 2, commonMovementDatas.rectangle(2, 9, 1, 14), commonInteractArrays.smonk, { sy: 8, sheetlen: 2 }),
            GetCommonEntity("SeaMonk5", 32, 9, 4, 2, commonMovementDatas.rectangle(32, 9, 0, 10), commonInteractArrays.smonk, { sy: 8, sheetlen: 2 }),
            GetCommonEntity("ShipLeft", 16, 17, 1, 0, undefined, undefined, { big: true, sy: 1 }),
            GetCommonEntity("ShipMiddle", 18, 17, 1, 1, undefined, undefined, { big: true, sy: 1 }),
            GetCommonEntity("ShipRight", 20, 17, 1, 2, undefined, undefined, { big: true, sy: 1 }),
            GetCommonEntity("SeaCreatureLeft", 16, 17, 1, 0, undefined, undefined, { big: true, sy: 2 }),
            GetCommonEntity("SeaCreatureMiddle", 18, 17, 1, 1, undefined, [
                function() { // 0
                    if(player.completedQuest("helpSeaMonster")) {
                        worldmap.writeText("smD7");
                        worldmap.forceEndDialog = true;
                    } else if(player.hasQuest("helpSeaMonster")) {
                        switch(player.activeQuests["helpSeaMonster"]) {
                            case "gotEgg":
                                worldmap.writeText("smD1");
                                worldmap.dialogData.nextDialogState = 6;
                                break;
                            case "help":
                                worldmap.writeText("smA2");
                                worldmap.forceEndDialog = true;
                                break;
                            case "fight":
                                worldmap.writeText("smB2");
                                worldmap.dialogData.nextDialogState = 5;
                                break;
                            case "wait":
                                worldmap.writeText("sm5", ["sm4c1", "sm4c2", "sm4c3"]);
                                worldmap.dialogData.nextDialogState = 4;
                                break;
                        }
                    } else {
                        worldmap.writeText("sm1");
                    }
                },
                GetSpeak("sm2"), // 1
                GetSpeak("sm3"), // 2
                GetSpeak("sm4", ["sm4c1", "sm4c2", "sm4c3"]), // 3
                function(idx) { // 4
                    switch(idx) {
                        case 0:
                            worldmap.writeText("smA1");
                            player.activeQuests["helpSeaMonster"] = "help";
                            worldmap.forceEndDialog = true;
                            break;
                        case 1:
                            worldmap.writeText("smB1");
                            player.activeQuests["helpSeaMonster"] = "fight";
                            break;
                        default:
                            worldmap.writeText("smC1");
                            player.activeQuests["helpSeaMonster"] = "wait";
                            worldmap.forceEndDialog = true;
                            break;
                    }
                }, function() { // 5
                    combat.startBattle(["seaHandR", "seaMan", "seaHandL"]);
                    worldmap.forceEndDialog = true;
                },
                GetSpeak("smD2"), // 6
                GetSpeak("smD3"), // 7
                GetSpeak("smD4"), // 8
                function() { game.transition(game.currentInputHandler, worldmap, { init: { x: 8,  y: 4.5 }, map: "bridge", postCombat: "FishMoved" }); }
            ], { big: true, sy: 2, noChange: true, postBattle: "FishKilled" }),
            {
                name: "FishKilled", storageKey: "FishKilled", pos: {x: -1, y: -1}, solid: false,
                interact: [
                    function() {
                        for(var i = worldmap.entities.length - 1; i >= 0; i--) {
                            var e = worldmap.entities[i].name;
                            if(e.indexOf("SeaCreature") === 0) { 
                                player.clearedEntities.push(e);
                                worldmap.entities.splice(i, 1);
                            }
                        }
                        worldmap.refreshMap();
                        if(player.hasQuest("getHeart")) {
                            player.activeQuests["getHeart"] = "heart";
                        } else {
                            player.activeQuests["getHeart"] = "weirdheart";
                        }
                        worldmap.writeText("bworkerA1");
                    },
                    GetSpeak("bworkerA2"),
                    GetSpeak("bworkerA3")
                ]
            },
            GetCommonEntity("PirateFriend", 30, 11, 14, 0, undefined, [
                function() { // 0
                    if(player.completedQuest("seamonkey") || player.hasQuestState("seamonkey", ["looking"])) {
                        worldmap.writeText("pirateMonkR5");
                        worldmap.forceEndDialog = true;
                    } else if(player.hasQuest("seamonkey")) {
                        var items = specialtyHelpers.getDowelItems();
                        if(items.length === 0) {
                            worldmap.writeText("pirateMonkW");
                            worldmap.forceEndDialog = true;
                        } else {
                            worldmap.writeText("pirateMonkH", items);
                        }
                    } else {
                        worldmap.writeText("pirateMonk1");
                        worldmap.dialogData.nextDialogState = 7;
                    }
                },
                function(i) { // 1
                    specialtyHelpers.storedDowelChoice = specialtyHelpers.getDowelItems()[i];
                    switch(specialtyHelpers.storedDowelChoice) {
                        case "pirateMonkC5": worldmap.writeText("pirateMonkG1"); break;
                        case "lime_nope":
                            worldmap.writeText("pirateMonkNo");
                            worldmap.forceEndDialog = true;
                            break;
                        default: worldmap.writeText("pirateMonkR1"); break;
                    }
                },
                function() { // 2
                    switch(specialtyHelpers.storedDowelChoice) {
                        case "pirateMonkC5": worldmap.writeText("pirateMonkG2"); break;
                        default: worldmap.writeText("pirateMonkR2"); break;
                    }
                },
                function() { // 3
                    switch(specialtyHelpers.storedDowelChoice) {
                        case "pirateMonkC5": worldmap.writeText("pirateMonkG3"); break;
                        default: worldmap.writeText("pirateMonkR3"); break;
                    }
                },
                function() { // 4
                    switch(specialtyHelpers.storedDowelChoice) {
                        case "pirateMonkC5": worldmap.writeText("pirateMonkG4"); break;
                        default: worldmap.writeText("pirateMonkR4"); break;
                    }
                },
                function() { // 5
                    switch(specialtyHelpers.storedDowelChoice) {
                        case "pirateMonkC5": worldmap.writeText("pirateMonkG5"); break;
                        default:
                            worldmap.writeText("pirateMonkR5");
                            player.increaseItem("tomato", 5);
                            player.increaseItem("ginger", 4);
                            player.increaseItem("pineapple", 3);
                            player.increaseItem("bellpepper", 2);
                            player.increaseItem("greenshroom");
                            worldmap.forceEndDialog = true;
                            break;
                    }
                    switch(specialtyHelpers.storedDowelChoice) {
                        case "rap_rice": player.decreaseItem("rice"); break;
                        case "pirateMonkC4": player.decreaseItem("chestnut"); break;
                        case "pirateMonkC3": player.decreaseItem("shortgrain"); break;
                        case "pirateMonkC2": player.decreaseItem("blackrice"); break;
                        case "pirateMonkC1": player.decreaseItem("arborio"); break;
                    }
                },
                function() { // 6
                    worldmap.writeText("pirateMonkG6");
                    player.activeQuests["seamonkey"] = "looking";
                    player.decreaseItem("gmocorn");
                    worldmap.forceEndDialog = true;
                },
                GetSpeak("pirateMonk2"),
                GetSpeak("pirateMonk3"),
                function() {
                    worldmap.writeText("pirateMonk4");
                    player.activeQuests["seamonkey"] = "waitingForItem";
                }
                
            ], { sy: 5, noChange: true } ),
            GetCommonEntity("PiratesTreasure", 45, 13, 13, 0, undefined, [
                function() {
                    if(game.target.open) {
                        worldmap.writeText("openchest");
                        worldmap.forceEndDialog = true;
                    }else if(player.hasQuestState("seamonkey", ["looking"])) {
                        worldmap.writeText("chestUnlock1");
                    } else {
                        worldmap.writeText("chestLocked");
                        worldmap.forceEndDialog = true;
                    }
                },
                GetSpeak("chestUnlock2"),
                function() {
                    game.target.open = true;
                    game.target.anim.shiftY(5);
                    player.increaseItem("ultrarod", 4);
                    worldmap.writeText("chestUnlock3");
                }
            ], { sy: 4, open: false, noChange: true }),
            GetCommonEntity("Vase", 45, 28, 14, 0, undefined, [
                function() {
                    if(player.completedQuest("kelpBoy")) {
                        worldmap.writeText("vaseFoundBee");
                        worldmap.forceEndDialog = true;
                    } else {
                        worldmap.writeText("vaseFound", ["sYes", "sNo"]);
                    }
                },
                function(i) {
                    if(i == 0) {
                        worldmap.writeText("vaseDo0");
                        game.target.anim.shiftY(7);
                        worldmap.importantEntities["KelpBoy"].anim.shiftY(7);
                        game.target.solid = false;
                        player.clearedEntities.push("Vase");
                        player.activeQuests["kelpBoy"] = "fuck";
                        worldmap.refreshMap();
                    } else {
                        worldmap.writeText("vaseDont");
                        worldmap.forceEndDialog = true;
                    }
                },
                GetSpeak("vaseDo1"),
                GetSpeak("vaseDo2"),
                function() { combat.startBattle(["kelpBoy"]); }
            ], { sy: 6, noChange: true, postBattle: "kelpBeat" }),
            GetCommonEntity("KelpBoy", 46, 27, 13, 0, undefined, [
                function() {
                    if(player.hasQuest("kelpBoy")) {
                        worldmap.writeText("vaseDo3");
                    } else {
                        worldmap.writeText("kelpBoy1");
                        worldmap.forceEndDialog = true;
                    }
                },
                function() { combat.startBattle(["kelpBoy"]); }
            ], { sy: 6, noChange: true, storageKey: "KelpBoy", postBattle: "kelpBeat" }),
            {
                name: "kelpBeat", storageKey: "kelpBeat", pos: {x: -1, y: -1}, solid: false,
                interact: [
                    function() {
                        player.clearedEntities.push("KelpBoy");
                        player.activeQuests["kelpBoy"] = "deadass";
                        if(worldmap.importantEntities["KelpBoy"] !== undefined) {
                            worldmap.importantEntities["KelpBoy"].solid = false;
                            worldmap.importantEntities["KelpBoy"].visible = false;
                            worldmap.importantEntities["KelpBoy"].interact = undefined;
                        }
                        worldmap.refreshMap();
                        worldmap.writeText("vaseWon0");
                    }
                ]
            },
            GetCommonEntity("KelpBeehive", 45, 27, 2, 0, undefined, [
                function() {
                    if(player.hasQuest("kelpBoy")) {
                        if(player.activeQuests["kelpBoy"] === "deadass") { // you have killed kelp boy and broken his vase
                            worldmap.writeText("hiveGet");
                            player.increaseItem("_beehive");
                            player.increaseItem("beeB", 5);
                            worldmap.clearTarget();
                            quests.completeQuest("kelpBoy");
                            worldmap.forceEndDialog = true;
                        } else { // you have broken kelp boy's vase, lost in battle to him, and are now trying to just hijack his beehive
                            worldmap.writeText("vaseDo4");
                        }
                    } else { // you are cheating and managed to get to the beehive without breaking kelp boy's vase
                        worldmap.writeText("vaseDo5");
                    }
                }, 
                function() { combat.startBattle(["kelpBoy"]); }
            ], { sy: 4, postBattle: "beeBeat", noChange: true } ),
            {
                name: "beeBeat", storageKey: "beeBeat", pos: {x: -1, y: -1}, solid: false,
                interact: [
                    function() {
                        player.clearedEntities.push("KelpBoy");
                        worldmap.importantEntities["KelpBoy"].solid = false;
                        worldmap.importantEntities["KelpBoy"].visible = false;
                        worldmap.importantEntities["KelpBoy"].interact = undefined;
                        worldmap.refreshMap();
                        worldmap.writeText("vaseWon0");
                    },
                    function() {
                        worldmap.writeText("hiveGet");
                        player.increaseItem("_beehive");
                        player.increaseItem("beeB", 5);
                        worldmap.clearTarget();
                        quests.completeQuest("kelpBoy");
                    }
                ]
            },
            GetCommonEntity("SeaCreatureRight", 20, 17, 1, 2, undefined, undefined, { big: true, sy: 2 }),
            GetWaterfall("waterfallAS", 36, 22, 0, "AX"),
            GetWaterfallEnd("wfendA", 36, 16, 0, "A"),
            GetWaterfall("waterfallBS", 32, 21, 0, "BX"),
            GetWaterfallEnd("wfendB", 32, 8, 0, "B"),
            GetWaterfall("waterfallCS", 13, 16, 2, "CX"),
            GetWaterfallEnd("wfendC", 27, 23, 3, "C"),
            GetWaterfall("waterfallDS", 8, 20, 0, "DX"),
            GetWaterfallEnd("wfendD", 15, 10, 3, "D"),
            GetWaterfall("waterfallES", 26, 14, 1, "EX"),
            GetWaterfallEnd("wfendE", 7, 14, 1, "E"),
            GetWaterfall("waterfallFS", 39, 11, 2, "FX"),
            GetWaterfallEnd("wfendF", 39, 18, 2, "F"),
            GetWaterfall("waterfallGS", 48, 20, 1, "GX"),
            GetWaterfallEnd("wfendG", 43, 20, 1, "G"),
            GetWaterfall("waterfallHS", 34, 3, 1, "HX"),
            GetWaterfallEnd("wfendH", 20, 3, 1, "H"),
            GetWaterfall("waterfallIS", 20, 5, 3, "IX"),
            GetWaterfallEnd("wfendI", 31, 5, 3, "I"),
            GetWaterfall("waterfallJS", 39, 1, 3, "JX"),
            GetWaterfallEnd("wfendJ", 40, 2, 1, "J"),
            GetWaterfall("waterfallKS", 46, 3, 2, "KX"),
            GetWaterfallEnd("wfendK", 46, 6, 2, "K"),
            GetWaterfall("waterfallLS", 46, 10, 0, "LX"),
            GetWaterfallEnd("wfendL", 48, 12, 2, "L"),
            GetWaterfall("waterfallMS", 43, 13, 0, "MX"),
            GetWaterfall("waterfallMSB", 44, 4, 2, "MX"),
            GetWaterfall("waterfallMSB0", 44, 5, 1, "M"),
            GetWaterfall("waterfallMSB1", 43, 5, 2, "M"),
            GetWaterfall("waterfallMSB2", 43, 6, 2, "M"),
            GetWaterfall("waterfallMSB3", 43, 7, 1, "M"),
            GetWaterfall("waterfallMSB4", 42, 7, 0, "M"),
            GetWaterfallEnd("wfendM", 39, 6, 1, "M"),
            GetTreasureChest("UWChestLeftFriend", 10, 12, [["carrot", 20]]),
            GetTreasureChest("UWChestRightFriend", 13, 12, [["carrot", 20]]),
            GetTreasureChest("UWChestByBoat", 21, 18, [["carrot", 20]]),
            GetTreasureChest("UWChestHiddenByCurrent", 34, 13, [["carrot", 20]])
        ];
        for(var i = 0; i < 5; i++) { x.push(GetWaterfall("waterfallA" + i, 36, 21 - i, 0, "A")); }
        x.push(GetRock("rockA", 37, 21, 1, "A"));

        for(var i = 0; i < 13; i++) { x.push(GetWaterfall("waterfallB" + i, 32, 21 - i, 0, "B")); }
        x.push(GetRock("rockB", 31, 20, 3, "B"));
        
        for(var i = 0; i < 6; i++) { x.push(GetWaterfall("waterfallC" + i, 13, 17 + i, 2, "C")); }
        for(var i = 0; i < 14; i++) { x.push(GetWaterfall("waterfallCL" + i, 13 + i, 23, 3, "C")); }
        x.push(GetRock("rockC", 12, 17, 3, "C"));
        
        for(var i = 0; i < 9; i++) { x.push(GetWaterfall("waterfallD" + i, 8, 19 - i, 0, "D")); }
        for(var i = 0; i < 7; i++) { x.push(GetWaterfall("waterfallDR" + i, 8 + i, 10, 3, "D")); }
        x.push(GetRock("rockD", 7, 19, 3, "D"));

        for(var i = 0; i < 18; i++) { x.push(GetWaterfall("waterfallE" + i, 25 - i, 14, 1, "E")); }
        x.push(GetRock("rockE", 25, 15, 0, "E"));

        for(var i = 0; i < 6; i++) { x.push(GetWaterfall("waterfallF" + i, 39, 12 + i, 2, "F")); }
        x.push(GetRock("rockF", 40, 12, 1, "F"));

        for(var i = 0; i < 4; i++) { x.push(GetWaterfall("waterfallG" + i, 47 - i, 20, 1, "G")); }
        x.push(GetRock("rockG", 48, 19, 2, "G"));
        
        for(var i = 0; i < 13; i++) { x.push(GetWaterfall("waterfallH" + i, 33 - i, 3, 1, "H")); }
        for(var i = 0; i < 10; i++) { x.push(GetWaterfall("waterfallI" + i, 21 + i, 5, 3, "I")); }
        
        for(var i = 0; i < 8; i++) { x.push(GetWaterfall("waterfallJ" + i, 40 + i, 1, 3, "I")); }
        for(var i = 0; i < 5; i++) { x.push(GetWaterfall("waterfallJD" + i, 48, 1 + i, 2, "I")); }
        x.push(GetWaterfall("waterfallJLA", 48, 6, 1, "I"));
        for(var i = 0; i < 4; i++) { x.push(GetWaterfall("waterfallJU" + i, 47, 6 - i, 0, "I")); }
        for(var i = 0; i < 7; i++) { x.push(GetWaterfall("waterfallJL" + i, 47 - i, 2, 1, "I")); }
        
        for(var i = 0; i < 2; i++) { x.push(GetWaterfall("waterfallK" + i, 46, 4 + i, 2, "K")); }
        
        x.push(GetWaterfall("waterfallLU", 46, 9, 0, "L"));
        for(var i = 0; i < 2; i++) { x.push(GetWaterfall("waterfallLR" + i, 46 + i, 8, 3, "L")); }
        for(var i = 0; i < 4; i++) { x.push(GetWaterfall("waterfallLD" + i, 48, 8 + i, 2, "L")); }
        
        for(var i = 0; i < 5; i++) { x.push(GetWaterfall("waterfallM" + i, 43, 12 - i, 0, "M")); }
        for(var i = 0; i < 3; i++) { x.push(GetWaterfall("waterfallML" + i, 42 - i, 6, 1, "M")); }

        return x;
    }(),
    "fakefarm": [
        { pos: { x: -1, y: -1 }, innCheck: true, action: function() {
            worldmap.importantEntities["barnCover"].visible = false;
            worldmap.importantEntities["FarmerJeff"].visible = true;
            worldmap.importantEntities["FarmerJeff"].pos = { x: 14.5, y: 31.5 };
            worldmap.importantEntities["FarmerJeff"].dir = 0;
        }},
        GetSign(4, 30, "upgradeBarn"),
        EnterShop("Upgrade Barn", 3, 30, "upgrade2"),
        EnterShop("Fixture Stall", 19, 21, "fixture2"),
        GetCommonEntity("FakeFarmFlatTire", 15, 35.5, 8, 3, undefined, [
            function() {
                worldmap.writeText("fakeFarmS", undefined, undefined, undefined, true);
                return true;
            },
            function() {
                game.startTransitionAnim(-1);
                worldmap.writeText("fakeFarm0");
            },
            function() {
                worldmap.waitForAnimation = true;
                game.target.moving = true;
                worldmap.animIdx = setInterval(function() {
                    game.target.pos.x += 0.025;
                    worldmap.refreshMap();
                    if(game.target.pos.x >= 22) {
                        game.target.moving = false;
                        worldmap.finishAnimation();
                    }
                }, 10);
            },
            function() {
                worldmap.playerDir = 1;
                worldmap.refreshMap();
                worldmap.writeText("fakeFarm1");
            },
            GetSpeak("fakeFarm2"),
            GetSpeak("fakeFarm3"),
            GetSpeak("fakeFarm4"),
            function() {
                worldmap.waitForAnimation = true;
                game.target.moving = true;
                game.target.dir = 1;
                worldmap.animIdx = setInterval(function() {
                    game.target.pos.x -= 0.025;
                    worldmap.refreshMap();
                    if(game.target.pos.x <= 13) {
                        worldmap.finishAnimation();
                        game.target.moving = false;
                        game.target.visible = false;
                        game.target.pos = { x: -1, y: -1 };
                        worldmap.clearTarget();
                    }
                }, 10);
            }
        ], { sy: 10, solid: false, autoplay: false, storageKey: "FarmerJeff" }),
        GetCommonEntity("AFuckingTruckL", 24, 34, 4, 0, undefined, [
            function() {
                if(player.completedQuest("gotTire")) {
                    worldmap.writeText("bustedTruck1");
                    game.target.anim.shiftY(0);
                    game.target.interact = specialtyHelpers.truckArray;
                    worldmap.forceEndDialog = true;
                } else {
                    worldmap.writeText("bustedTruck0");
                }
            }
        ], { sy: 3, big: true, noChange: true }),
        GetCommonEntity("AFuckingTruckR", 26, 34, 5, 0, undefined, undefined, { big: true, noChange: true }),
        { name: "barnCover", storageKey: "barnCover", jumbo: true, filename: "barncover", visible: true, w: 1036, h: 900, offset: { x: 1, y: 0 }, pos: { x: 7, y: 18 } },
        GetCommonEntity("TireRack", 11, 3, 8, 0, undefined, [
            function() {
                if(player.hasQuest("gotTire") || player.completedQuest("gotTire")) {
                    worldmap.finishDialog();
                    return;
                }
                game.target.anim.shiftY(9);
                worldmap.writeText("tireget");
                worldmap.importantEntities["HK"].visible = true;
                worldmap.importantEntities["HK"].solid = true;
                player.activeQuests["gotTire"] = 0;
            }
        ], { sy: 8, noChange: true }),
        GetCommonEntity("EnterBarnL", 14, 30, 0, 0, undefined, [
            function() {
                worldmap.importantEntities["barnCover"].visible = false;
                worldmap.forceEndDialog = true;
                for(var i = 0; i < worldmap.entities.length; i++) { if(worldmap.entities[i].inside) { worldmap.entities[i].visible = true; } }
                worldmap.finishDialog();
            }
        ], { visible: false, solid: false }),
        GetCommonEntity("EnterBarnR", 15, 30, 0, 0, undefined, [
            function() {
                worldmap.importantEntities["barnCover"].visible = false;
                worldmap.forceEndDialog = true;
                for(var i = 0; i < worldmap.entities.length; i++) { if(worldmap.entities[i].inside) { worldmap.entities[i].visible = true; } }
                worldmap.finishDialog();
            }
        ], { visible: false, solid: false }),
        GetCommonEntity("ExitBarnL", 14, 31, 0, 0, undefined, [
            function() {
                if(player.hasQuest("gotTire")) {
                    game.target = worldmap.importantEntities["ExitBarnL"];
                    if(player.hasQuestState("gotTire", [1])) {
                        worldmap.writeText("fakeFarm18");
                        worldmap.dialogData.nextDialogState = 9;
                    } else {
                        worldmap.writeText("fakeFarm5");
                    }
                    return;
                }
                worldmap.importantEntities["barnCover"].visible = true;
                worldmap.forceEndDialog = true;
                for(var i = 0; i < worldmap.entities.length; i++) { if(worldmap.entities[i].inside) { worldmap.entities[i].visible = false; } }
                worldmap.finishDialog();
            },
            function() {
                worldmap.playerDir = 0;
                worldmap.waitForAnimation = true;
                player.activeQuests["gotTire"] = 1;
                player.lastInn = "fakefarm";
                worldmap.importantEntities["FarmerJeff"].dir = 2;
                worldmap.importantEntities["FarmerJeff"].pos = { x: worldmap.pos.x, y: 25 };
                worldmap.importantEntities["FarmerJeff"].visible = true;
                worldmap.importantEntities["FarmerJeff"].moving = true;
                worldmap.animIdx = setInterval(function() {
                    worldmap.importantEntities["FarmerJeff"].pos.y += 0.025;
                    worldmap.refreshMap();
                    if(worldmap.importantEntities["FarmerJeff"].pos.y >= 29) {
                        worldmap.importantEntities["FarmerJeff"].moving = false;
                        worldmap.finishAnimation();
                        worldmap.refreshMap();
                    }
                }, 10);
            },
            GetSpeak("fakeFarm6"),
            GetSpeak("fakeFarm7"),
            function() {
                worldmap.importantEntities["HK"].moving = true;
                worldmap.refreshMap();
                worldmap.writeText("fakeFarm8");
            },
            function() { worldmap.refreshMap(); worldmap.writeText("fakeFarm9"); },
            GetSpeak("fakeFarm10"),
            GetSpeak("fakeFarm11"),
            function() { worldmap.refreshMap(); worldmap.writeText("fakeFarm12"); },
            function() { combat.startBattle(["router", "housekeeper", "outlet", "server"]); } // 9
        ], { visible: false, solid: false, storageKey: "ExitBarnL", postBattle: "beatDweeb" }),
        GetCommonEntity("ExitBarnR", 15, 31, 0, 0, undefined, [
            function() {
                if(player.hasQuest("gotTire")) {
                    game.target = worldmap.importantEntities["ExitBarnL"];
                    if(player.hasQuestState("gotTire", [1])) {
                        worldmap.writeText("fakeFarm18");
                        worldmap.dialogData.nextDialogState = 9;
                    } else {
                        worldmap.writeText("fakeFarm5");
                    }
                    return;
                }
                worldmap.importantEntities["barnCover"].visible = true;
                worldmap.forceEndDialog = true;
                for(var i = 0; i < worldmap.entities.length; i++) { if(worldmap.entities[i].inside) { worldmap.entities[i].visible = false; } }
                worldmap.finishDialog();
            }
        ], { visible: false, solid: false }),
        { name: "beatDweeb", storageKey: "beatDweeb", pos: { x: -1, y: -1 }, solid: false,
        interact: [
            GetSpeak("fakeFarm13"),
            GetSpeak("fakeFarm14"),
            GetSpeak("fakeFarm15"),
            GetSpeak("fakeFarm16"),
            function() {
                worldmap.writeText("fakeFarm17");
                game.target = worldmap.importantEntities["FarmerJeff"];
                worldmap.clearTarget();
                game.target = worldmap.importantEntities["HK"];
                worldmap.clearTarget();
                quests.completeQuest("gotTire");
            }
        ]},
        GetCommonEntity("HOUSEKEEPER", 13, 30, 12, 0, undefined, [
            function() {
                if(player.hasQuestState("gotTire", [1])) {
                    worldmap.writeText("HK_s1");
                } else if(game.target.solid) {
                    worldmap.writeText("HK_s0");
                    worldmap.forceEndDialog = true;
                } else {
                    worldmap.finishDialog();
                }
            },
            GetSpeak("HK_s2")
        ], { visible: false, solid: false, storageKey: "HK", sy: 10, noChange: true } ),
        GetCommonEntity("CoveredDoorL1", 11, 15, 6, 0, undefined, [ GetSpeak("barndoorChick") ], { sy: 12, noChange: true, solid: true, changeType: 0 }), // 0 = open door
        GetCommonEntity("CoveredDoorL2", 11, 18, 6, 0, undefined, [ GetSpeak("barndoorPig") ], { sy: 12, noChange: true, solid: true, changeType: 0 }),
        GetCommonEntity("CoveredDoorL3", 11, 21, 6, 0, undefined, [ GetSpeak("barndoorChick") ], { sy: 12, noChange: true, solid: true, changeType: 0 }),
        GetCommonEntity("CoveredDoorL4", 11, 24, 6, 0, undefined, [ GetSpeak("barndoorCrop") ], { sy: 12, noChange: true, solid: true, changeType: 0 }),
        GetCommonEntity("CoveredDoorR1", 18, 15, 6, 0, undefined, [ GetSpeak("barndoorEmpty") ], { sy: 13, noChange: true, solid: true, changeType: 0 }),
        GetCommonEntity("CoveredDoorR2", 18, 18, 6, 0, undefined, [ GetSpeak("barndoorChick") ], { sy: 13, noChange: true, solid: true, changeType: 0 }),
        GetCommonEntity("CoveredDoorR3", 18, 21, 6, 0, undefined, [ GetSpeak("barndoorShop") ], { sy: 13, noChange: true, solid: true, changeType: 0 }),
        GetCommonEntity("CoveredDoorR4", 18, 24, 6, 0, undefined, [ GetSpeak("barndoorPig") ], { sy: 13, noChange: true, solid: true, changeType: 0 }),
        GetCommonEntity("Chicky1", 10, 15, 0, 3, undefined, commonInteractArrays.chick, { sy: 10, changeType: 1 }), // 1 = full left to right
        GetCommonEntity("Chicky2", 19, 18, 0, 1, undefined, commonInteractArrays.chick, { sy: 10, changeType: 2 }), // 2 = half right to left
        GetCommonEntity("Chicky3", 10, 21, 0, 3, undefined, commonInteractArrays.chick, { sy: 10, changeType: 3 }), // 3 = half left to right 
        GetCommonEntity("Pig1", 10, 18, 3, 3, undefined, commonInteractArrays.piggn, { sy: 10, changeType: 3, sheetlen: 2, noChange: true }), 
        GetCommonEntity("Pig2", 19, 24, 3, 1, undefined, commonInteractArrays.piggn, { sy: 10, changeType: 4, sheetlen: 2, noChange: true }), // 4 = 3/4 right to left
        GetCommonEntity("Golem1", 10, 24, 4, 0, undefined, commonInteractArrays.golem, { sy: 12, noChange: true }),
        GetCommonEntity("Golem2", 9, 24, 4, 0, undefined, commonInteractArrays.golem, { sy: 12, noChange: true }),
        GetCommonEntity("Golem3", 8, 24, 4, 0, undefined, commonInteractArrays.golem, { sy: 12, noChange: true }),
        GetCommonEntity("LawnMower1", 9, 27, 4, 3, undefined, commonInteractArrays.mower, { sy: 10, noChange: true, changeType: 5, sheetlen: 2, visible: false, inside: true }), // 5 = bigger LtR
        GetCommonEntity("LawnMower2", 20, 28, 4, 1, undefined, commonInteractArrays.mower, { sy: 10, noChange: true, changeType: 6, sheetlen: 2, visible: false, inside: true }), // 6 = bigger RtL
        GetCommonEntity("FarmTV", 14, 2, 5, 0, undefined, undefined, { sy: 1, big: true, sheetlen: 2, moving: true, storageKey: "FarmTV" } ),
        GetCommonEntity("MrShocky", 10, 9, 7, 0, undefined, undefined, { sy: 12, sheetlen: 2, moving: true, visible: false, solid: false, storageKey: "MrShocky", changeType: 7 }), // 7 = becomes visible/solid
        GetCommonEntity("Hotbox", 9, 8, 4, 0, undefined, [
            function() {
                if(player.hasQuestState("fakeFarm", [1])) {
                    worldmap.writeText("hotboxX");
                    worldmap.forceEndDialog = true;
                } else if(player.hasQuestState("fakeFarm", [2])) {
                    worldmap.writeText("hotbox2");
                    worldmap.forceEndDialog = true;
                } else {
                    worldmap.writeText("hotbox1");
                }
            },
            function() { combat.startBattle(["machineA", "machineB", "machineC", "machineD"]); }
        ], { sy: 13, noChange: true, noRunKill: true, postBattle: "fucko" }),
        { name: "fucko", storageKey: "fucko", pos: {x: -1, y: -1}, interact: [
            function() {
                worldmap.importantEntities["MrShocky"].pos = { x: -1, y: -1 };
                worldmap.importantEntities["MrShocky"].moving = false;
                player.clearedEntities.push("MrShocky");
                player.activeQuests["fakeFarm"] = 2;
                worldmap.refreshMap();
                worldmap.writeText("hotbox3");
            }
        ] },
        GetCommonEntity("Outlet", 13, 2, 5, 0, undefined, [
            function() {
                if(player.hasQuestState("fakeFarm", [1])) {
                    worldmap.writeText("farmTVunplug3");
                    worldmap.forceEndDialog = true;
                } else {
                    worldmap.writeText("farmTVunplug0");
                }
            },
            GetSpeak("farmTVunplug1"),
            function() {
                game.target.anim.shiftY(13);
                worldmap.importantEntities["MrShocky"].pos = { x: -1, y: -1 };
                worldmap.importantEntities["MrShocky"].moving = false;
                player.clearedEntities.push("MrShocky");
                worldmap.importantEntities["FarmTV"].moving = false;
                worldmap.importantEntities["FarmTV"].anim.shiftY(3);
                player.activeQuests["fakeFarm"] = 1;
                worldmap.refreshMap();
                worldmap.writeText("farmTVunplug2");
            }
        ], { sy: 12, noChange: true } ),
        GetCommonEntity("FarmTVEntrance", 10, 8, 0, 0, undefined, [
            GetSpeak("farmTV0"),
            function() {
                gfx.clearSome(["menuA", "menutext"]);
                worldmap.waitForAnimation = true;
                worldmap.forceMove = true;
                worldmap.animIdx = setInterval(function() {
                    worldmap.pos.y -= 0.025;
                    worldmap.refreshMap();
                    if(worldmap.pos.y <= 6) { FinishAnim(); }
                }, 10); 
            },
            function() {
                worldmap.playerDir = 3;
                worldmap.waitForAnimation = true;
                worldmap.forceMove = true;
                worldmap.animIdx = setInterval(function() {
                    worldmap.pos.x += 0.025;
                    worldmap.refreshMap();
                    if(worldmap.pos.x >= 14.5) { FinishAnim(); }
                }, 10); 
            },
            function() {
                worldmap.playerDir = 0;
                worldmap.waitForAnimation = true;
                worldmap.forceMove = true;
                worldmap.animIdx = setInterval(function() {
                    worldmap.pos.y -= 0.025;
                    worldmap.refreshMap();
                    if(worldmap.pos.y <= 3.75) { FinishAnim(); }
                }, 10); 
            },
            GetSpeak("farmTV1"),
            GetSpeak("farmTV2"),
            GetSpeak("farmTV3"),
            GetSpeak("farmTV4"),
            function() {
                worldmap.writeText("farmTV5");
                game.target.pos = { x: -1, y: -1 };
                player.activeQuests["fakeFarm"] = 0;
                for(var i = 0; i < worldmap.entities.length; i++) {
                    if(worldmap.entities[i].changeType === undefined) { continue; }
                    switch(worldmap.entities[i].changeType) {
                        case 0:
                            worldmap.entities[i].interact = undefined;
                            worldmap.entities[i].solid = false;
                            worldmap.entities[i].visible = false;
                            break;
                        case 1:
                            var p = worldmap.entities[i].pos;
                            worldmap.entities[i].movement = commonMovementDatas.rectangle(p.x, p.y, 9, 0);
                            break;
                        case 2:
                            var p = worldmap.entities[i].pos;
                            worldmap.entities[i].movement = commonMovementDatas.rectangle(p.x - 4, p.y, 4, 0, 1);
                            break;
                        case 3:
                            var p = worldmap.entities[i].pos;
                            worldmap.entities[i].movement = commonMovementDatas.rectangle(p.x, p.y, 4, 0);
                            break;
                        case 4:
                            var p = worldmap.entities[i].pos;
                            worldmap.entities[i].movement = commonMovementDatas.rectangle(p.x - 7, p.y, 7, 0, 1);
                            break;
                        case 5:
                            var p = worldmap.entities[i].pos;
                            worldmap.entities[i].movement = commonMovementDatas.rectangle(p.x, p.y, 11, 0);
                            break;
                        case 6:
                            var p = worldmap.entities[i].pos;
                            worldmap.entities[i].movement = commonMovementDatas.rectangle(p.x - 11, p.y, 11, 0, 1);
                            break;
                        case 7:
                            worldmap.entities[i].solid = true;
                            worldmap.entities[i].visible = true;
                            break;
                    }
                }
            }
        ], { solid: false, visible: false } ),
        GetCommonEntity("Crouton", 26, 30, 0, 0, undefined, [
            function() {
                if(player.completedQuest("croutonsFishingAdventure")) {
                    worldmap.writeText("arf_thanks");
                    worldmap.forceEndDialog = true;
                } else if(player.hasQuest("croutonsFishingAdventure")) {
                    var items = specialtyHelpers.getCroutonItems();
                    if(items.length === 0) {
                        worldmap.writeText("arf3");
                        worldmap.forceEndDialog = true;
                    } else {
                        worldmap.writeText("arf4", items);
                    }
                } else {
                    worldmap.writeText("arf0");
                }
            }, 
            function(i) {
                if(player.hasQuest("croutonsFishingAdventure")) {
                    specialtyHelpers.storedCroutonChoice = specialtyHelpers.getCroutonItems()[i];
                    switch(specialtyHelpers.storedCroutonChoice) {
                        case "arf_spear": worldmap.writeText("arf_spear0"); break;
                        case "arf_net":
                            player.decreaseItem("net");
                            worldmap.writeText("arf_good0");
                            break;
                        case "arf_bignet":
                            player.decreaseItem("bignet");
                            worldmap.writeText("arf_good0");
                            break;
                        case "arf_metalrod":
                            player.decreaseItem("metalrod");
                            worldmap.writeText("arf_good0");
                            break;
                        case "arf_ultrarod":
                            player.decreaseItem("ultrarod");
                            worldmap.writeText("arf_ultra0");
                            break;
                        case "lime_nope":
                            worldmap.writeText("arf_none");
                            worldmap.forceEndDialog = true;
                            break;
                    }
                } else {
                    specialtyHelpers.storedCroutonChoice = "";
                    worldmap.writeText("arf1");
                }
            }, 
            function() {
                switch(specialtyHelpers.storedCroutonChoice) {
                    case "arf_spear":
                        worldmap.writeText("arf_spear1");
                        worldmap.forceEndDialog = true;
                        break;
                    case "arf_net": worldmap.writeText("arf_good1"); break;
                    case "arf_bignet": worldmap.writeText("arf_good1"); break;
                    case "arf_metalrod": worldmap.writeText("arf_good1"); break;
                    case "arf_ultrarod": worldmap.writeText("arf_ultra1"); break;
                    default: worldmap.writeText("arf2"); break;
                }
            }, 
            function() {
                switch(specialtyHelpers.storedCroutonChoice) {
                    case "arf_net": 
                    case "arf_bignet": 
                    case "arf_metalrod":
                        player.increaseItem("fodder", 20);
                        quests.completeQuest("croutonsFishingAdventure");
                        worldmap.writeText("arf_good2");
                        break;
                    case "arf_ultrarod":
                        player.increaseItem("goodfood", 20);
                        quests.completeQuest("croutonsFishingAdventure");
                        worldmap.writeText("arf_good2");
                        break;
                    default:
                        worldmap.writeText("arf3");
                        player.activeQuests["croutonsFishingAdventure"] = 0;
                        break;
                }
            }
        ], { visible: false })
    ],
    "southcity": [
        { name: "mobCover", storageKey: "mobCover", jumbo: true, filename: "mobcover", visible: true, w: 772, h: 512, offset: { x: 0, y: 0 }, pos: { x: 9, y: 27 } },
        { name: "skumpyCover", storageKey: "skumpyCover", jumbo: true, filename: "skumpycover", visible: true, w: 396, h: 256, offset: { x: 1, y: 1 }, pos: { x: 36, y: 39 } },
        GetCommonEntity("EnterMob", 15, 33, 0, 0, undefined, [
            function() {
                worldmap.importantEntities["mobCover"].visible = false;
                worldmap.forceEndDialog = true;
                for(var i = 0; i < worldmap.entities.length; i++) { if(worldmap.entities[i].inside) { worldmap.entities[i].visible = true; } }
                worldmap.finishDialog();
            }
        ], { visible: false, solid: false }),
        GetCommonEntity("ExitMob", 15, 34, 0, 0, undefined, [
            function() {
                worldmap.importantEntities["mobCover"].visible = true;
                worldmap.forceEndDialog = true;
                for(var i = 0; i < worldmap.entities.length; i++) { if(worldmap.entities[i].inside) { worldmap.entities[i].visible = false; } }
                worldmap.finishDialog();
            }
        ], { visible: false, solid: false }),
        GetCommonEntity("IntroSkumpyCutscene", 43, 40, 0, 0, undefined, [
            GetSpeak("entercity0"), // 0
            function() {
                worldmap.playerDir = 2;
                worldmap.writeText("entercity1");
                worldmap.importantEntities["skumpy"].visible = true;
                worldmap.refreshMap();
            },
            function() {
                gfx.clearSome(["menuA", "menutext", "menucursorA"]);
                worldmap.importantEntities["skumpy"].visible = false;
                worldmap.refreshMap();
                worldmap.waitForAnimation = true;
                worldmap.forceMove = true;
                worldmap.animIdx = setInterval(function() {
                    worldmap.pos.y += 0.025;
                    worldmap.refreshMap();
                    if(worldmap.pos.y >= 43) { FinishAnim(); }
                }, 10); 
            },
            function() {
                worldmap.playerDir = 1;
                worldmap.refreshMap();
                worldmap.waitForAnimation = true;
                worldmap.forceMove = true;
                worldmap.animIdx = setInterval(function() {
                    worldmap.pos.x -= 0.025;
                    worldmap.refreshMap();
                    if(worldmap.pos.x <= 41) { FinishAnim(); }
                }, 10); 
            },
            function() {
                worldmap.playerDir = 0;
                worldmap.refreshMap();
                worldmap.waitForAnimation = true;
                worldmap.forceMove = true;
                worldmap.animIdx = setInterval(function() {
                    worldmap.pos.y -= 0.025;
                    worldmap.refreshMap();
                    if(worldmap.pos.y <= 42) { FinishAnim(); }
                }, 10); 
            },
            function() {
                worldmap.importantEntities["skumpyCover"].visible = false;
                for(var i = 0; i < worldmap.entities.length; i++) { if(worldmap.entities[i].inside) { worldmap.entities[i].visible = true; } }
                worldmap.importantEntities["skumpy"].visible = true;
                worldmap.importantEntities["skumpy"].pos = { x: 40, y: 39 };
                worldmap.importantEntities["skumpy"].anim.shiftX(10);
                worldmap.refreshMap();
                worldmap.waitForAnimation = true;
                worldmap.forceMove = true;
                worldmap.animIdx = setInterval(function() {
                    worldmap.pos.y -= 0.025;
                    worldmap.refreshMap();
                    if(worldmap.pos.y <= 40.75) { FinishAnim(); }
                }, 10); 
            }, // 5
            GetSpeak("entercity2"),
            function() {
                gfx.clearSome(["menuA", "menutext", "menucursorA"]);
                worldmap.playerDir = 1;
                worldmap.waitForAnimation = true;
                worldmap.forceMove = true;
                worldmap.animIdx = setInterval(function() {
                    worldmap.pos.x -= 0.025;
                    worldmap.refreshMap();
                    if(worldmap.pos.x <= 38) { FinishAnim(); }
                }, 10); 
            },
            function() {
                worldmap.forcedY = 0;
                worldmap.playerDir = 0;
                worldmap.waitForAnimation = true;
                worldmap.forceMove = true;
                worldmap.animIdx = setInterval(function() {
                    worldmap.pos.y -= 0.025;
                    worldmap.refreshMap();
                    if(worldmap.pos.y <= 39) { FinishAnim(); }
                }, 10); 
            },
            function() {
                worldmap.playerDir = 3;
                worldmap.waitForAnimation = true;
                worldmap.forceMove = true;
                worldmap.animIdx = setInterval(function() {
                    worldmap.pos.x += 0.025;
                    worldmap.refreshMap();
                    if(worldmap.pos.x >= 41) { FinishAnim(); }
                }, 10); 
            },
            function() {
                worldmap.playerDir = 2;
                worldmap.waitForAnimation = true;
                worldmap.forceMove = true;
                worldmap.animIdx = setInterval(function() {
                    worldmap.pos.y += 0.025;
                    worldmap.refreshMap();
                    if(worldmap.pos.y >= 39.75) { FinishAnim(); }
                }, 10);
            }, // 10
            function() {
                worldmap.waitForAnimation = true;
                worldmap.animIdx = setInterval(function() {
                    worldmap.importantEntities["bruno"].pos.y += 0.05;
                    worldmap.refreshMap();
                    if(worldmap.importantEntities["bruno"].pos.y >= 43) { FinishAnim(); }
                }, 10);
            },
            function() {
                worldmap.importantEntities["bruno"].dir = 1;
                worldmap.refreshMap();
                worldmap.waitForAnimation = true;
                worldmap.animIdx = setInterval(function() {
                    worldmap.importantEntities["bruno"].pos.x -= 0.05;
                    worldmap.refreshMap();
                    if(worldmap.importantEntities["bruno"].pos.x <= 41) { FinishAnim(); }
                }, 10); 
            },
            function() {
                worldmap.importantEntities["bruno"].dir = 0;
                worldmap.refreshMap();
                worldmap.waitForAnimation = true;
                worldmap.animIdx = setInterval(function() {
                    worldmap.importantEntities["bruno"].pos.y -= 0.05;
                    worldmap.refreshMap();
                    if(worldmap.importantEntities["bruno"].pos.y <= 40.75) { FinishAnim(); }
                }, 10); 
            },
            function() {
                worldmap.importantEntities["bruno"].dir = 1;
                worldmap.refreshMap();
                worldmap.waitForAnimation = true;
                worldmap.animIdx = setInterval(function() {
                    worldmap.importantEntities["bruno"].pos.x -= 0.05;
                    worldmap.refreshMap();
                    if(worldmap.importantEntities["bruno"].pos.x <= 40) { FinishAnim(); }
                }, 10); 
            }, // 15
            function() {
                worldmap.importantEntities["bruno"].dir = 0;
                worldmap.importantEntities["bruno"].moving = false;
                worldmap.refreshMap();
                worldmap.writeText("entercity3");
            },
            GetSpeak("entercity4"),
            GetSpeak("entercity5"),
            GetSpeak("entercity6"),
            GetSpeak("entercity7"), // 20
            GetSpeak("entercity8"),
            GetSpeak("entercity9"),
            GetSpeak("entercity10"),
            GetSpeak("entercity11"),
            GetSpeak("entercity12"),
            GetSpeak("entercity13"),
            GetSpeak("entercity14"),
            GetSpeak("entercity15"),
            GetSpeak("entercity16"),
            GetSpeak("entercity17"), // 30
            GetSpeak("entercity18"),
            GetSpeak("entercity19"),
            GetSpeak("entercity20"),
            GetSpeak("entercity21", ["mobchoice0", "mobchoice1"]),
            function(i) {
                if(i === 0) {
                    worldmap.pos.y = 39.25;
                    worldmap.importantEntities["bruno"].dir = 3;
                    worldmap.importantEntities["skumpy"].anim.shiftX(9);
                    worldmap.refreshMap();
                    worldmap.writeText("entercity0_0");
                    worldmap.dialogData.nextDialogState = 63;
                } else {
                    worldmap.writeText("entercity1_0");
                }
            }, // 35
            GetSpeak("entercity1_1"),
            GetSpeak("entercity1_2"),
            GetSpeak("entercity1_3"),
            GetSpeak("entercity1_4"),
            GetSpeak("entercity1_5"), // 40
            function() {
                worldmap.importantEntities["bruno"].dir = 3;
                worldmap.importantEntities["bruno"].moving = true;
                worldmap.refreshMap();
                worldmap.waitForAnimation = true;
                worldmap.animIdx = setInterval(function() {
                    worldmap.importantEntities["bruno"].pos.x += 0.025;
                    worldmap.refreshMap();
                    if(worldmap.importantEntities["bruno"].pos.x >= 41) { FinishAnim(); }
                }, 10);
            },
            function() {
                worldmap.importantEntities["bruno"].dir = 2;
                worldmap.refreshMap();
                worldmap.waitForAnimation = true;
                worldmap.animIdx = setInterval(function() {
                    worldmap.importantEntities["bruno"].pos.y += 0.025;
                    worldmap.refreshMap();
                    if(worldmap.importantEntities["bruno"].pos.y >= 42) { FinishAnim(); }
                }, 10); 
            },
            function() {
                worldmap.importantEntities["bruno"].dir = 3;
                worldmap.refreshMap();
                worldmap.waitForAnimation = true;
                worldmap.animIdx = setInterval(function() {
                    worldmap.importantEntities["bruno"].pos.x += 0.025;
                    worldmap.refreshMap();
                    if(worldmap.importantEntities["bruno"].pos.x >= 44) { FinishAnim(); }
                }, 10);
            },
            function() {
                worldmap.importantEntities["bruno"].dir = 0;
                worldmap.refreshMap();
                worldmap.waitForAnimation = true;
                worldmap.animIdx = setInterval(function() {
                    worldmap.importantEntities["bruno"].pos.y -= 0.025;
                    worldmap.refreshMap();
                    if(worldmap.importantEntities["bruno"].pos.y <= 33) { FinishAnim(); }
                }, 10);
            },
            function() {
                var temp = game.target;
                game.target = worldmap.importantEntities["bruno"];
                worldmap.clearTarget();
                game.target = temp;
                worldmap.writeText("entercity1_6");
            }, // 45
            function() {
                worldmap.writeText("entercity1_7");
                worldmap.pos.y = 39.25;
                worldmap.playerDir = 1;
                worldmap.refreshMap();
            },
            GetSpeak("entercity2_0"),
            GetSpeak("entercity2_1"),
            GetSpeak("entercity2_2"),
            GetSpeak("entercity2_3"),
            GetSpeak("entercity2_4"), // 51
            GetSpeak("entercity2_5"),
            GetSpeak("entercity2_6"),
            GetSpeak("entercity2_7"),
            GetSpeak("entercity2_8"),
            GetSpeak("entercity2_9"), // 56
            GetSpeak("entercity2_10"),
            GetSpeak("entercity2_11"),
            GetSpeak("entercity2_12"),
            GetSpeak("entercity2_13"),
            GetSpeak("entercity2_14"), // 61
            GetSpeak("entercity2_15"),
            function() {
                worldmap.forceEndDialog = true;
                worldmap.clearTarget();
                worldmap.importantEntities["skumpyCover"].visible = true;
                for(var i = 0; i < worldmap.entities.length; i++) { if(worldmap.entities[i].inside) { worldmap.entities[i].visible = false; } }
                game.transition(game.currentInputHandler, worldmap, { init: { x: 41, y: 43 }, map: "southcity" });
            },
            GetSpeak("entercity0_1"),
            GetSpeak("entercity0_2"),
            GetSpeak("entercity0_3"),
            GetSpeak("entercity0_4"), // 65
            GetSpeak("entercity0_5"),
            function() { combat.startBattle(["mobsty1"]); }
        ], { visible: false, solid: false, isRow: false, nonStandardGameOver: "brunoKill", postBattle: "beatBruno", storageKey: "introCutscene" }), // TODO: change back to isRow!
        { name: "beatBruno", storageKey: "beatBruno", pos: { x: -1, y: -1}, interact: [
            function() {
                worldmap.writeText("entercity0_pb0");
                worldmap.importantEntities["bruno"].anim.shiftX(16);
                worldmap.importantEntities["bruno"].anim.shiftY(4);
                worldmap.importantEntities["bruno"].dir = 0;
                worldmap.refreshMap();
            },
            GetSpeak("entercity0_pb1"),
            GetSpeak("entercity0_pb2"),
            GetSpeak("entercity0_pb3"),
            GetSpeak("entercity0_pb4"),
            GetSpeak("entercity2_0"),
            GetSpeak("entercity2_1"),
            GetSpeak("entercity2_2"),
            GetSpeak("entercity2_3"),
            GetSpeak("entercity2_4"),
            GetSpeak("entercity2_5"),
            GetSpeak("entercity2_6"),
            GetSpeak("entercity2_7"),
            GetSpeak("entercity2_8"),
            GetSpeak("entercity2_9"),
            function() {
                game.target = worldmap.importantEntities["introCutscene"];
                worldmap.clearTarget();
                worldmap.importantEntities["skumpyCover"].visible = true;
                for(var i = 0; i < worldmap.entities.length; i++) { if(worldmap.entities[i].inside) { worldmap.entities[i].visible = false; } }
                game.transition(game.currentInputHandler, worldmap, { init: { x: 41, y: 43 }, map: "southcity" });
            }
        ]},
        { name: "brunoKill", storageKey: "brunoKill", pos: { x: -1, y: -1}, interact: [
            GetSpeak("entercityBAD0"),
            GetSpeak("entercityBAD1"),
            GetSpeak("entercityBAD2"),
            GetSpeak("entercityBAD3"),
            GetSpeak("entercityBAD4"),
            GetSpeak("entercityBAD5"),
            GetSpeak("entercityBAD6"),
            GetSpeak("entercityBAD7"),
            GetSpeak("entercityBAD8"),
            GetSpeak("entercityBAD9"),
            function() {
                gfx.clearSome(["menuA", "menutext", "menucursorA"]);
                worldmap.waitForAnimation = true;
                worldmap.forceMove = true;
                worldmap.animIdx = setInterval(function() {
                    worldmap.pos.y += 0.025;
                    worldmap.refreshMap();
                    if(worldmap.pos.y >= 21) { FinishAnim(); }
                }, 10); 
            },
            function() { console.log("wait for confirmation"); },
            function() { game.transition(game.currentInputHandler, worldmap.title); }
        ]},
        GetCommonEntity("AFuckingTruckL", 52, 48, 4, 0, undefined, specialtyHelpers.truckArray, { big: true, noChange: true }),
        GetCommonEntity("AFuckingTruckR", 54, 48, 5, 0, undefined, specialtyHelpers.truckArray, { big: true, noChange: true }),
        GetCommonEntity("Skumpy", 41, 42, 12, 0, undefined, undefined, { sy: 8, moving: true, sheetlen: 2, solid: false, storageKey: "skumpy", inside: true, visible: false }),
        GetCommonEntity("Bruno", 44, 33, 13, 2, undefined, undefined, { sy: 10, moving: true, solid: false, storageKey: "bruno", inside: true }),
        GetCommonEntity("BarL", 39, 39.875, 15, 0, undefined, undefined, { sy: 5, inside: true, visible: false }),
        GetCommonEntity("BarM", 40, 39.875, 16, 0, undefined, undefined, { sy: 5, inside: true, visible: false }),
        GetCommonEntity("BarR", 41, 39.875, 16, 0, undefined, undefined, { sy: 5, inside: true, visible: false }),
        GetCommonEntity("Pigeon1", 30, 22, 14, 0, undefined, undefined, { sy: 8, sheetlen: 2, moving: true }),
        GetCommonEntity("Pigeon2", 36, 21, 13, 0, undefined, undefined, { sy: 8, sheetlen: 2, moving: true }),
        GetCommonEntity("Pigeon3", 33, 22, 14, 0, undefined, undefined, { sy: 8, sheetlen: 2, moving: true }),
        GetCommonEntity("Abuela", 34, 20, 17, 0, undefined, [], { sy: 4, noChange: true })
    ]
};
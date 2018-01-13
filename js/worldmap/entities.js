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
        GetInvisibleEntity("CS_produce", Cutscene("pstand"), { autoplay: false }),
        GetInvisibleEntity("PostInitialBattle", Cutscene("finTut"), { storageKey: "PostInitialBattle" }), 
        GetCommonEntity("H_HipsterBike", 6, 4, 0, 0, undefined, undefined, { sy: 2, sheet: "hipster", storageKey: "bike", visible: false, solid: false }),
        GetCommonEntity("H_Hipster", 0, 4, 0, 0, undefined, undefined, { sheet: "hipster", moving: true, sheetlen: 2, storageKey: "hipster", postBattle: "PostInitialBattle" }),
        GetCommonEntity("ConvinceATron", 10, 4, 0, 0, undefined, Cutscene("tutBuddy"), { sy: 3, noChange: true, sheet: "hipster", noRunKill: true, storageKey: "convince", visible: false, postBattle: "PostStandaloneTutorial" }),
        GetInvisibleEntity("PostStandaloneTutorial", Cutscene("finStTut"), { storageKey: "PostStandaloneTutorial" }),
        
        GetCommonEntity("Nathan2", 16, 19, 0, 1, undefined, Cutscene("theHappening"), { boring: true, sheet: "assistant", visible: false, solid: false, autoplay: true, moving: true, storageKey: "nathanB" }),
        GetCommonEntity("Eagle2", 1.5, 19, 4, 0, undefined, undefined, { boring: true, sheet: "assistant", solid: false, visible: false, storageKey: "eaglia" }),

        SwitchMap("ExitAreaWest", 0, 20, false, true, 22, 12, "farm"),
        { name: "ExitAreaSouth", pos: { x: 16, y: 23}, isRow: true, interact: Cutscene("farmFirst"), solid: false, visible: false, isMapSwitch: true, destination: "firstvillage" },

        GetCommonEntity("AFuckingTruckL", 16, 5, 4, 0, undefined, Cutscene("truck"), { big: true, noChange: true }),
        GetCommonEntity("AFuckingTruckR", 18, 5, 5, 0, undefined, Cutscene("truck"), { big: true, noChange: true }),

        GetCommonEntity("EggFairy", 24, 19, 13, 1, undefined, Cutscene("eggfairy"), { visible: false, storageKey: "eggFairy" })
    ],
    "farm": [
        SwitchMap("ExitAreaWest", 23, 12, false, true, 1, 20, "producestand"),

        GetCommonEntity("Fucker", 10, 3, 0, 2, undefined, Cutscene("bigBot"), { boss: true, big: true, postBattle: "PostBoss", failedInteract: Cutscene("bigBotL") }),
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
        SwitchMap("ExitAreaNorth", 21, 0, true, false, 16, 22, "producestand"),
        SwitchMap("ExitAreaWest", 0, 22, false, true, 44, 49, "forest"),
        SwitchMap("ExitAreaSouth", 21, 30, true, false, 21.5, 1, "belowvillage"),
        GetCommonEntity("Dean", 10, 13, 12, 3, undefined, [GetSpeak("villager0")], { sy: 14 }),
        GetCommonEntity("June", 20, 5, 16, 2, undefined, [GetSpeak("villager1")], { sy: 14 }),
        GetCommonEntity("Aiko", 27, 10, 0, 3, undefined, [GetSpeak("villager2")], { sy: 16 }),
        GetCommonEntity("Tanner", 3, 18, 0, 0, undefined, [GetSpeak("villager3")], { sy: 17 }),
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
        SwitchMap("ExitAreaNorth", 21, 0, true, false, 21.5, 28, "firstvillage"),
        SwitchMap("EnterFacilitySide", 13, 16, false, false, 30, 2, "researchfacility"),
        SwitchMap("EnterFacilityL", 7, 18, false, false, 12, 36, "researchfacility"),
        SwitchMap("EnterFacilityR", 8, 18, false, false, 13, 36, "researchfacility"),
        GetBeehive("BelowHive", 4, 36),
        
        { name: "Falcon0", pos: { x: 21, y: 9 }, isRow: true, visible: false, solid: false, interact: Cutscene("falcon") },

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
			SwitchMap("ExitAreaSouth", 12, 37, true, false, 7.5, 19, "belowvillage"),
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

            GetCommonEntity("Jeff", 7, 2, 0, 0, undefined, Cutscene("jeff"), { sy: 4, boss: true, postBattle: "PostBoss2", noChange: true, failedInteract: Cutscene("jeffL") }),
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
        { name: "Falcon1", pos: { x: 27, y: 5 }, isColumn: true, visible: false, solid: false, interact: Cutscene("falcon"), autoplay: true },

        SwitchMap("GoUnderwater", 4, 14, false, false, 41, 20, "underwater"),

        GetSign(9, 13, "SignMermaid"),
        GetSign(26, 3, "SignConstWork"),
        GetSign(20, 12, "SignMermaidInn"),

        EnterShop("MermaidInn", 20, 11, "mermaidinn"),
        EnterShop("MermaidShoppe", 10, 13, "mermaid"),
        EnterShop("ConstructionShoppe", 25, 3, "cworker"),

        GetCommonEntity("ConstructionManShop", 25, 3, 15, 0, undefined, undefined, { sy: 4, solid: false, noChange: true, boring: true }),
        
        GetCommonEntity("Worker1", 24, 5, 0, 3, undefined, Cutscene("workerA")),
        GetCommonEntity("Worker2", 21, 7, 0, 3, commonMovementDatas.rectangle(11, 5, 10, 2, 2), Cutscene("workerB"), { onlyActiveInteracts: true }),
        GetCommonEntity("Worker3", 18, 6, 0, 3, commonMovementDatas.rectangle(7, 4, 11, 2, 2), Cutscene("workerB"), { onlyActiveInteracts: true }),
        GetCommonEntity("HeadWorker", 5, 6, 8, 3, undefined, Cutscene("workerX"), { postBattle: "BeatWorkers" }),
        GetInvisibleEntity("BeatWorkers", Cutscene("workerF"), { storageKey: "BeatWorkers" }),

        GetCommonEntity("AFuckingTruckL", 28, 3, 4, 0, undefined, Cutscene("truck"), { big: true, noChange: true }),
        GetCommonEntity("AFuckingTruckR", 30, 3, 5, 0, undefined, Cutscene("truck"), { big: true, noChange: true }),
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
        GetCommonEntity("SeaLeftTop", 6, 3, 1, 0, undefined, undefined, { big: true, sy: 3, visible: false, storageKey: "slt", solid: false, boring: true }),
        GetCommonEntity("SeaMidTop", 8, 0, 1, 1, undefined, [ GetSpeak("smD7") ], { big: true, sy: 3, visible: false, storageKey: "smt", noChange: true, boring: true }),
        GetCommonEntity("SeaRightTop", 10, 3, 1, 2, undefined, undefined, { big: true, sy: 3, visible: false, storageKey: "srt", solid: false, boring: true }),
        GetInvisibleEntity("FishMoved", Cutscene("seahelp"), { storageKey: "FishMoved" })
    ],
    "underwater": function() {
        var x = [
            SwitchMap("GoAboveGround", 42, 20, false, false, 5, 14, "bridge"),
            GetCommonEntity("FishFace1", 34, 5, 0, 3, commonMovementDatas.rectangle(34, 5, 4, 4), Cutscene("enemy"), enemyMetadata.fish),
            GetCommonEntity("FishFace2", 38, 24, 0, 2, commonMovementDatas.downrectangle(38, 24, 4, 5), Cutscene("enemy"), enemyMetadata.fish),
            GetCommonEntity("FishFace3", 39, 25, 0, 2, commonMovementDatas.rectangle(39, 25, 2, 3), Cutscene("enemy"), enemyMetadata.fish),
            GetCommonEntity("FishFace4", 3, 24, 0, 2, commonMovementDatas.rectangle(3, 24, 8, 1), Cutscene("enemy"), enemyMetadata.fish),
            GetCommonEntity("FishFace5", 9, 23, 0, 2, commonMovementDatas.downrectangle(9, 23, 2, 3), Cutscene("enemy"), enemyMetadata.fish),
            GetCommonEntity("FishFace6", 7, 3, 0, 3, commonMovementDatas.rectangle(6, 3, 9, 2, 0), Cutscene("enemy"), enemyMetadata.fish),
            GetCommonEntity("FishFace7", 9, 3, 0, 3, commonMovementDatas.rectangle(6, 3, 9, 2, 0), Cutscene("enemy"), enemyMetadata.fish),
            GetCommonEntity("FishFace8", 11, 3, 0, 3, commonMovementDatas.rectangle(6, 3, 9, 2, 0), Cutscene("enemy"), enemyMetadata.fish),
            GetCommonEntity("FishFace9", 13, 3, 0, 3, commonMovementDatas.rectangle(6, 3, 9, 2, 0), Cutscene("enemy"), enemyMetadata.fish),
            GetCommonEntity("FishFace10", 15, 3, 0, 3, commonMovementDatas.rectangle(6, 3, 9, 2, 0), Cutscene("enemy"), enemyMetadata.fish),
            GetCommonEntity("FishFace11", 14, 5, 0, 1, commonMovementDatas.rectangle(6, 3, 9, 2, 2), Cutscene("enemy"), enemyMetadata.fish),
            GetCommonEntity("FishFace12", 12, 5, 0, 1, commonMovementDatas.rectangle(6, 3, 9, 2, 2), Cutscene("enemy"), enemyMetadata.fish),
            GetCommonEntity("FishFace13", 10, 5, 0, 1, commonMovementDatas.rectangle(6, 3, 9, 2, 2), Cutscene("enemy"), enemyMetadata.fish),
            GetCommonEntity("FishFace14", 8, 5, 0, 1, commonMovementDatas.rectangle(6, 3, 9, 2, 2), Cutscene("enemy"), enemyMetadata.fish),
            GetCommonEntity("FishFace15", 6, 5, 0, 1, commonMovementDatas.rectangle(6, 3, 9, 2, 2), Cutscene("enemy"), enemyMetadata.fish),
            GetCommonEntity("SeaMonk1", 34, 18, 4, 2, commonMovementDatas.rectangle(34, 18, 0, 10), Cutscene("enemy"), enemyMetadata.seamonk),
            GetCommonEntity("SeaMonk2", 16, 24, 4, 2, commonMovementDatas.downrectangle(16, 24, 11, 2), Cutscene("enemy"), enemyMetadata.seamonk),
            GetCommonEntity("SeaMonk3", 31, 27, 4, 3, GetStdMovement([[31, 27, 0], [32, 27, 3], [32, 29, 2], [25, 29, 1], [25, 27, 0], [28, 27, 3], [28, 28, 2], [31, 28, 3]]), Cutscene("enemy"), enemyMetadata.seamonk),
            GetCommonEntity("SeaMonk4", 2, 9, 4, 2, commonMovementDatas.rectangle(2, 9, 1, 14), Cutscene("enemy"), enemyMetadata.seamonk),
            GetCommonEntity("SeaMonk5", 32, 9, 4, 2, commonMovementDatas.rectangle(32, 9, 0, 10), Cutscene("enemy"), enemyMetadata.seamonk),

            GetCommonEntity("ShipLeft", 16, 17, 1, 0, undefined, undefined, { big: true, sy: 1, boring: true }),
            GetCommonEntity("ShipMiddle", 18, 17, 1, 1, undefined, undefined, { big: true, sy: 1, boring: true }),
            GetCommonEntity("ShipRight", 20, 17, 1, 2, undefined, undefined, { big: true, sy: 1, boring: true }),
            GetCommonEntity("SeaCreatureLeft", 16, 17, 1, 0, undefined, undefined, { big: true, sy: 2, boring: true }),
            GetCommonEntity("SeaCreatureMiddle", 18, 17, 1, 1, undefined, Cutscene("seamon"), { big: true, sy: 2, noChange: true, postBattle: "FishKilled" }),
            GetCommonEntity("SeaCreatureRight", 20, 17, 1, 2, undefined, undefined, { big: true, sy: 2, boring: true }),
            GetInvisibleEntity("FishKilled", Cutscene("deadsea"), { storageKey: "FishKilled" }),
            
            GetCommonEntity("PirateFriend", 30, 11, 14, 0, undefined, Cutscene("piratemonk"), { sy: 5, noChange: true } ),
            GetCommonEntity("PiratesTreasure", 45, 13, 13, 0, undefined, Cutscene("seamonkey"), { sy: 4, open: false, noChange: true }),

            GetCommonEntity("Vase", 45, 28, 14, 0, undefined, Cutscene("kelpVase"), { sy: 6, noChange: true, postBattle: "kelpBeat", boring: true }),
            GetCommonEntity("KelpBoy", 46, 27, 13, 0, undefined, Cutscene("kelpBoy"), { sy: 6, noChange: true, storageKey: "KelpBoy", postBattle: "kelpBeat" }),
            GetInvisibleEntity("kelpBeat", Cutscene("kelpDead"), { storageKey: "kelpBeat" }),
            GetCommonEntity("KelpBeehive", 45, 27, 2, 0, undefined, Cutscene("kelpHive"), { sy: 4, postBattle: "beeBeat", noChange: true, isBeehive: true } ),
            GetInvisibleEntity("beeBeat", Cutscene("kelpDeadBee"), { storageKey: "beeBeat" }),

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
        { name: "Falcon2", pos: { x: 14, y: 32 }, isRow: true, visible: false, solid: false, interact: Cutscene("falcon") },
        { pos: { x: -1, y: -1 }, innCheck: true, action: function() {
            worldmap.importantEntities["barnCover"].visible = false;
            worldmap.importantEntities["FarmerJeff"].visible = true;
            worldmap.importantEntities["FarmerJeff"].pos = { x: 14.5, y: 31.5 };
            worldmap.importantEntities["FarmerJeff"].dir = 0;
        }},
        GetSign(4, 30, "upgradeBarn"),
        EnterShop("UpgradeBarn", 3, 30, "upgrade2"),
        EnterShop("FixtureStall", 19, 21, "fixture2"),
        GetJumbo("barnCover", "barn", 7, 18, 1036, 900, 1, 0),
        
        GetCommonEntity("FarmerJeffOpening", 15, 35.5, 8, 3, undefined, Cutscene("flatTire"), { boring: true, sy: 10, solid: false, autoplay: true, storageKey: "FarmerJeff" }),
        GetCommonEntity("FarmTVEntrance", 10, 8, 0, 0, undefined, Cutscene("farmTV"), { boring: true, solid: false, visible: false } ),

        GetCommonEntity("FarmTV", 14, 2, 5, 0, undefined, undefined, { boring: true, sy: 1, big: true, sheetlen: 2, moving: true, storageKey: "FarmTV" } ),
        GetCommonEntity("Outlet", 13, 2, 5, 0, undefined, Cutscene("outlet"), { sy: 12, noChange: true } ),
        
        GetCommonEntity("MrShocky", 10, 9, 7, 0, undefined, undefined, { boring: true, sy: 12, sheetlen: 2, moving: true, visible: false, solid: false, storageKey: "MrShocky", changeType: 7 }), // 7 = becomes visible/solid
        GetCommonEntity("Hotbox", 9, 8, 4, 0, undefined, Cutscene("hotbox"), { sy: 13, noChange: true, noRunKill: true, postBattle: "HotBoxEnd" }),
        GetInvisibleEntity("HotBoxEnd", Cutscene("hotboxEnd"), { storageKey: "HotBoxEnd" } ),
        GetCommonEntity("TireRack", 11, 3, 8, 0, undefined, [
            function() {
                if(player.hasQuest("gotTire") || player.completedQuest("gotTire")) { worldmap.finishDialog(); return; }
                game.target.anim.shiftY(9);
                worldmap.writeText("tireget");
                worldmap.importantEntities["HK"].visible = true;
                worldmap.importantEntities["HK"].solid = true;
                player.activeQuests["gotTire"] = 0;
            }
        ], { sy: 8, noChange: true }),
        
        GetCommonEntity("AFuckingTruckL", 24, 34, 4, 0, undefined, Cutscene("badTruck"), { sy: 3, big: true, noChange: true }),
        GetCommonEntity("AFuckingTruckR", 26, 34, 5, 0, undefined, undefined, { big: true, noChange: true }),
        GetCommonEntity("Crouton", 26, 30, 0, 0, undefined, Cutscene("crouton"), { visible: false }),
        
        GetJumboToggle("BarnL", 14, 30, true), GetJumboToggle("BarnR", 15, 30, true),
        GetCommonEntity("ExitBarnL", 14, 31, 0, 0, undefined, Cutscene("exitBarn"), { boring: true, visible: false, solid: false, postBattle: "beatDweeb", dontClearTarget: true }),
        GetCommonEntity("ExitBarnR", 15, 31, 0, 0, undefined, Cutscene("exitBarn"), { visible: false, solid: false, postBattle: "beatDweeb", dontClearTarget: true }),
        GetInvisibleEntity("beatDweeb", Cutscene("beatBarn"), { storageKey: "beatDweeb" }),
        GetCommonEntity("HOUSEKEEPER", 13, 30, 17, 0, undefined, Cutscene("housekeeper"), { boss: true, visible: false, inside: true, storageKey: "HK", sy: 5, noChange: true } ),

        GetCommonEntity("CoveredDoorL1", 11, 15, 6, 0, undefined, [ GetSpeak("barndoorChick") ], { sy: 12, noChange: true, solid: true, changeType: 0 }), // 0 = open door
        GetCommonEntity("CoveredDoorL2", 11, 18, 6, 0, undefined, [ GetSpeak("barndoorPig") ], { sy: 12, noChange: true, solid: true, changeType: 0 }),
        GetCommonEntity("CoveredDoorL3", 11, 21, 6, 0, undefined, [ GetSpeak("barndoorChick") ], { sy: 12, noChange: true, solid: true, changeType: 0 }),
        GetCommonEntity("CoveredDoorL4", 11, 24, 6, 0, undefined, [ GetSpeak("barndoorCrop") ], { sy: 12, noChange: true, solid: true, changeType: 0 }),
        GetCommonEntity("CoveredDoorR1", 18, 15, 6, 0, undefined, [ GetSpeak("barndoorEmpty") ], { sy: 13, noChange: true, solid: true, changeType: 0 }),
        GetCommonEntity("CoveredDoorR2", 18, 18, 6, 0, undefined, [ GetSpeak("barndoorChick") ], { sy: 13, noChange: true, solid: true, changeType: 0 }),
        GetCommonEntity("CoveredDoorR3", 18, 21, 6, 0, undefined, [ GetSpeak("barndoorShop") ], { sy: 13, noChange: true, solid: true, changeType: 0 }),
        GetCommonEntity("CoveredDoorR4", 18, 24, 6, 0, undefined, [ GetSpeak("barndoorPig") ], { sy: 13, noChange: true, solid: true, changeType: 0 }),
        GetCommonEntity("Chicky1", 10, 15, 0, 3, undefined, Cutscene("enemy"), enemyMetadata.chick(1)), // 1 = full left to right
        GetCommonEntity("Chicky2", 19, 18, 0, 1, undefined, Cutscene("enemy"), enemyMetadata.chick(2)), // 2 = half right to left
        GetCommonEntity("Chicky3", 10, 21, 0, 3, undefined, Cutscene("enemy"), enemyMetadata.chick(3)), // 3 = half left to right 
        GetCommonEntity("Pig1", 10, 18, 3, 3, undefined, Cutscene("enemy"), enemyMetadata.piggn(3)), 
        GetCommonEntity("Pig2", 19, 24, 3, 1, undefined, Cutscene("enemy"), enemyMetadata.piggn(4)), // 4 = 3/4 right to left
        GetCommonEntity("Golem1", 10, 24, 4, 0, undefined, Cutscene("enemy"), enemyMetadata.golem),
        GetCommonEntity("Golem2", 9, 24, 4, 0, undefined, Cutscene("enemy"), enemyMetadata.golem),
        GetCommonEntity("Golem3", 8, 24, 4, 0, undefined, Cutscene("enemy"), enemyMetadata.golem),
        GetCommonEntity("LawnMower1", 9, 27, 4, 3, undefined, Cutscene("mower"), enemyMetadata.mower(5)), // 5 = bigger LtR
        GetCommonEntity("LawnMower2", 20, 28, 4, 1, undefined, Cutscene("mower"), enemyMetadata.mower(6)) // 6 = bigger RtL
    ],
    "southcity": [
        { name: "Falcon3", pos: { x: 44, y: 46 }, isRow: true, visible: false, solid: false, interact: Cutscene("falcon") },
        SwitchMap("GoNorth", 44, 0, true, false, 8.5, 50, "northcity"),

        GetJumbo("skumpyCover", "skumpy", 36, 39, 396, 256, 1, 1),
        GetJumbo("mobCover", "mob", 9, 27, 772, 512, 0, 0),
        GetJumboToggle("Mob", 15, 33, true), GetJumboToggle("Mob", 15, 34, false),
        
        EnterShop("Skumpys", 41, 42, "skumpys"),
        EnterShop("ManTools", 52, 32, "mantools"),
        EnterShop("SeedShack", 65, 40, "seedshack"),
        EnterShop("Catalinas", 67, 32, "catalinas"),
        EnterShop("TinkerTierra", 50, 12, "tinker"),
        EnterShop("PawnShop", 56, 21, "pawn"),
        EnterShop("Church", 38, 14, "church"),
        GetSign(57, 22, "SignPawn"),

        GetMafiaMember(0, 24, 16, 3, commonMovementDatas.rectangle(24, 16, 20, 18)),
        GetMafiaMember(1, 23, 7, 3, commonMovementDatas.rectangle(23, 7, 22, 9)),
        GetMafiaMember(2, 23, 6, 2, commonMovementDatas.downrectangle(23, 6, 22, 9)),
        GetMafiaMember(3, 45, 17, 2, commonMovementDatas.downrectangle(45, 17, 14, 17)),
        GetMafiaMember(4, 44, 16, 2, commonMovementDatas.rectangle(24, 16, 20, 18, 1)),
        GetMafiaMember(5, 44, 34, 1, commonMovementDatas.rectangle(24, 16, 20, 18, 2)),
        GetMafiaMember(6, 24, 34, 0, commonMovementDatas.rectangle(24, 16, 20, 18, 3)),
        GetMafiaMember(7, 45, 34, 3, commonMovementDatas.downrectangle(45, 17, 14, 17, 1)),
        GetMafiaMember(8, 59, 34, 0, commonMovementDatas.downrectangle(45, 17, 14, 17, 2)),
        GetMafiaMember(9, 59, 17, 1, commonMovementDatas.downrectangle(45, 17, 14, 17, 3)),
        GetMafiaMember(10, 45, 7, 2, commonMovementDatas.rectangle(23, 7, 22, 9, 1)),
        GetMafiaMember(11, 45, 16, 1, commonMovementDatas.rectangle(23, 7, 22, 9, 2)),
        GetMafiaMember(12, 23, 16, 0, commonMovementDatas.rectangle(23, 7, 22, 9, 3)),
        GetMafiaMember(13, 9, 36, 2, commonMovementDatas.downrectangle(9, 36, 15, 6)),
        GetMafiaMember(14, 9, 42, 3, commonMovementDatas.downrectangle(9, 36, 15, 6, 1)),
        GetMafiaMember(15, 24, 42, 0, commonMovementDatas.downrectangle(9, 36, 15, 6, 2)),
        GetMafiaMember(16, 24, 36, 1, commonMovementDatas.downrectangle(9, 36, 15, 6, 3)),
        GetMafiaMember2(17, 11, 31, 3),
        GetMafiaMember2(18, 18, 30, 0),
        GetMafiaMember2(19, 17, 28, 1),
        GetMafiaMember2(20, 20, 33, 1),
        GetMafiaMember(21, 43, 3, 1),
        GetMafiaMember(22, 44.5, 3, 2),
        GetMafiaMember(23, 46, 3, 3),
        GetMafiaMember(24, 43, 2, 2),
        GetMafiaMember(25, 44.5, 2, 2),
        GetMafiaMember(26, 46, 2, 2),
        GetMafiaMember(27, 43, 4, 1),
        GetMafiaMember(28, 44.5, 4, 2),
        GetMafiaMember(29, 46, 4, 3),
        GetCommonEntity("MobBoss", 20, 27, 0, 2, undefined, Cutscene("mobBoss"), { sy: 18, inside: true, visible: false, boss: true, postBattle: "BeatMob", failedInteract: Cutscene("mobLost") }),
        GetInvisibleEntity("BeatMob", Cutscene("mobWon"), { storageKey: "BeatMob" }),

        GetCommonEntity("IntroSkumpyCutscene", 43, 40, 0, 0, undefined, Cutscene("southcity"), { visible: false, solid: false, isRow: true, nonStandardGameOver: "brunoKill", postBattle: "beatBruno", storageKey: "introCutscene", boring: true }),
        GetInvisibleEntity("beatBruno", Cutscene("beatbruno"), { storageKey: "beatBruno" }),
        GetInvisibleEntity("brunoKill", Cutscene("badEnd"), { storageKey: "brunoKill" }),
        GetCommonEntity("Skumpy", 41, 42, 12, 0, undefined, undefined, { sy: 8, moving: true, sheetlen: 2, solid: false, storageKey: "skumpy", inside: true, visible: false, boring: true }),
        GetCommonEntity("Bruno", 44, 33, 13, 2, undefined, undefined, { sy: 10, moving: true, solid: false, storageKey: "bruno", inside: true, boring: true }),
        GetCommonEntity("BarL", 39, 39.875, 15, 0, undefined, undefined, { sy: 5, inside: true, visible: false, boring: true }),
        GetCommonEntity("BarM", 40, 39.875, 16, 0, undefined, undefined, { sy: 5, inside: true, visible: false, boring: true }),
        GetCommonEntity("BarR", 41, 39.875, 16, 0, undefined, undefined, { sy: 5, inside: true, visible: false, boring: true }),
        
        GetCommonEntity("AFuckingTruckL", 52, 48, 4, 0, undefined, Cutscene("truck"), { big: true, noChange: true }),
        GetCommonEntity("AFuckingTruckR", 54, 48, 5, 0, undefined, Cutscene("truck"), { big: true, noChange: true }),
        GetCommonEntity("Pigeon1", 30, 22, 14, 0, undefined, undefined, { sy: 8, sheetlen: 2, moving: true, boring: true }),
        GetCommonEntity("Pigeon2", 36, 21, 13, 0, undefined, undefined, { sy: 8, sheetlen: 2, moving: true, boring: true }),
        GetCommonEntity("Pigeon3", 33, 22, 14, 0, undefined, undefined, { sy: 8, sheetlen: 2, moving: true, boring: true }),
        GetCommonEntity("Abuela", 34, 20, 17, 0, undefined, Cutscene("abuela"), { sy: 4, noChange: true })
    ],
    "northcity": [
        GetInvisibleEntity("CS_newphone", Cutscene("newPhone"), { autoplay: true }),
        { name: "Falcon4", pos: { x: 8, y: 44 }, isRow: true, visible: false, solid: false, interact: Cutscene("falcon") },
        SwitchMap("GoSouth", 8, 52, true, false, 44.5, 1, "southcity"),

        GetCommonEntity("Car1", 8, 28, 0, 2, commonMovementDatas.fastdownrect(8, 28, 52, 16), Cutscene("enemy"), enemyMetadata.car1),
        GetCommonEntity("Car2", 8, 44, 0, 3, commonMovementDatas.fastdownrect(8, 28, 52, 16, 1), Cutscene("enemy"), enemyMetadata.car2),
        GetCommonEntity("Car3", 60, 44, 4, 0, commonMovementDatas.fastdownrect(8, 28, 52, 16, 2), Cutscene("enemy"), enemyMetadata.car3),
        GetCommonEntity("Car4", 60, 28, 4, 1, commonMovementDatas.fastdownrect(8, 28, 52, 16, 3), Cutscene("enemy"), enemyMetadata.car4),
        GetCommonEntity("Car5", 8, 36, 4, 2, commonMovementDatas.fastdownrect(8, 28, 52, 16), Cutscene("enemy"), enemyMetadata.car4),
        GetCommonEntity("Car6", 34, 44, 0, 3, commonMovementDatas.fastdownrect(8, 28, 52, 16, 1), Cutscene("enemy"), enemyMetadata.car1),
        GetCommonEntity("Car7", 60, 31, 0, 0, commonMovementDatas.fastdownrect(8, 28, 52, 16, 2), Cutscene("enemy"), enemyMetadata.car2),
        GetCommonEntity("Car8", 34, 28, 4, 1, commonMovementDatas.fastdownrect(8, 28, 52, 16, 3), Cutscene("enemy"), enemyMetadata.car3),
        GetCommonEntity("Car9", -5, 30, 0, 2, commonMovementDatas.fastdownrect(-5, 27, 65, 18), Cutscene("enemy"), enemyMetadata.car2),
        GetCommonEntity("Car10", 12, 44, 0, 3, commonMovementDatas.fastdownrect(-5, 27, 65, 18, 1), Cutscene("enemy"), enemyMetadata.car1),
        GetCommonEntity("Car11", 60, 38, 4, 0, commonMovementDatas.fastdownrect(-5, 27, 65, 18, 2), Cutscene("enemy"), enemyMetadata.car4),
        GetCommonEntity("Car12", 54, 27, 4, 1, commonMovementDatas.fastdownrect(-5, 27, 65, 18, 3), Cutscene("enemy"), enemyMetadata.car3),
        GetCommonEntity("Car13", 30, 27, 4, 1, commonMovementDatas.fastdownrect(-5, 27, 65, 18, 3), Cutscene("enemy"), enemyMetadata.car4),
        GetCommonEntity("Car14", 47, 27, 4, 1, commonMovementDatas.fastdownrect(-5, 27, 65, 18, 3), Cutscene("enemy"), enemyMetadata.car4),
        GetCommonEntity("Car15", 25, 44, 4, 3, commonMovementDatas.fastdownrect(-5, 27, 65, 18, 1), Cutscene("enemy"), enemyMetadata.car4),
        GetCommonEntity("Car16", 45, 44, 4, 3, commonMovementDatas.fastdownrect(-5, 27, 65, 18, 3), Cutscene("enemy"), enemyMetadata.car3),
        GetCommonEntity("Delivery1", 10, 13, 4, 3, commonMovementDatas.rectangle(10, 13, 49, 14, 3), Cutscene("enemy"), enemyMetadata.delivery),
        GetCommonEntity("Delivery2", 59, 27, 4, 1, commonMovementDatas.rectangle(10, 13, 49, 14, 1), Cutscene("enemy"), enemyMetadata.delivery),
        GetCommonEntity("Delivery3", -5, 13, 4, 3, commonMovementDatas.rectangle(-5, 13, 12, 14, 3), Cutscene("enemy"), enemyMetadata.delivery),
        GetCommonEntity("Delivery4", -8, 30, 4, 3, commonMovementDatas.rectangle(-8, 30, 15, 14, 3), Cutscene("enemy"), enemyMetadata.delivery),
        GetCommonEntity("Vendo1", 7, 23, 12, 1, commonMovementDatas.rectangle(-8, 13, 15, 14, 1), Cutscene("enemy"), enemyMetadata.vendo),
        GetCommonEntity("Vendo2", 53, 32, 12, 2, undefined, Cutscene("enemy"), enemyMetadata.vendo2),
        GetCommonEntity("Vendo3", 38, 13, 12, 3, commonMovementDatas.rectangle(10, 13, 49, 14), Cutscene("enemy"), enemyMetadata.vendo),
        GetCommonEntity("Hoverdweeb1", 31, 11, 12, 2, commonMovementDatas.downrectangle(31, 11, 10, 1), Cutscene("enemy"), enemyMetadata.hoverdweeb),
        GetCommonEntity("Hoverdweeb2", 8, 15, 12, 2, commonMovementDatas.downrectangle(8, 15, 1, 12), Cutscene("enemy"), enemyMetadata.hoverdweeb),
        GetCommonEntity("Hoverdweeb3", 60, 11, 12, 2, commonMovementDatas.downrectangle(60, 11, 2, 15), Cutscene("enemy"), enemyMetadata.hoverdweeb),

        EnterShop("CityFixturesL", 15, 43, "cityFixtures"),
        EnterShop("CityFixturesR", 16, 43, "cityFixtures"),
        EnterShop("HotelL", 34, 43, "cityInn"),
        EnterShop("HotelR", 35, 43, "cityInn"),
        EnterShop("GordonsFarm", 43, 43, "gordonsFarming"),
        EnterShop("CityExpandL", 24, 9, "cityExpansions"),
        EnterShop("CityExpandR", 25, 9, "cityExpansions"),
        EnterShop("CityTech", 55, 9, "cityTech"),

        GetJumbo("12thStBuildings", "northcity3", 21, 31, 2436, 832, 1, 0),
        GetJumboToggle("Cash2", 25, 42, true), GetJumboToggle("Cash2", 25, 43, false),
        GetJumboToggle("OfficeL", 52, 42, true), GetJumboToggle("OfficeL", 52, 43, false),
        GetJumboToggle("OfficeR", 53, 42, true), GetJumboToggle("OfficeR", 53, 43, false),
        GetJumbo("13thStBuildings", "northcity2", 11, 14, 3072, 832, 0, 0),
        GetJumboToggle("Mushman", 15, 25, true), GetJumboToggle("Mushman", 15, 26, false),
        GetJumboToggle("BoringApt", 25, 25, true), GetJumboToggle("BoringApt", 25, 26, false),
        GetJumboToggle("FishApt", 35, 25, true), GetJumboToggle("FishApt", 35, 26, false),
        GetJumboToggle("NerndHaus", 44, 25, true), GetJumboToggle("NerndHaus", 44, 26, false),
        GetJumboToggle("XNerndHausL", 43, -2, true), GetJumboToggle("XNerndHausL", 43, -1, false),
        GetJumboToggle("XNerndHausL2", 42, -2, true), GetJumboToggle("XNerndHausL2", 42, -1, false),
        GetJumboToggle("XNerndHausR", 45, -2, true), GetJumboToggle("XNerndHausR", 45, -1, false),
        GetJumboToggle("SpinachApt", 53, 25, true), GetJumboToggle("SpinachApt", 53, 26, false),
        GetJumbo("14thStBuildings", "northcity1", 0, 0, 1276, 636, -1, -1),
        GetJumboToggle("BankL", 6, 8, true), GetJumboToggle("BankL", 6, 9, false),
        GetJumboToggle("BankR", 7, 8, true), GetJumboToggle("BankR", 7, 9, false),
        GetJumboToggle("StrangeL", 16, 8, true), GetJumboToggle("StrangeL", 16, 9, false),
        GetJumboToggle("StrangeR", 17, 8, true), GetJumboToggle("StrangeR", 17, 9, false),
        
        GetCommonEntity("LavaLamp", 15, 20.25, 22, 0, undefined, undefined, { boring: true, inside: true, sheetlen: 6, visible: false, moving: true }),
        GetCommonEntity("MushMan", 16, 22, 15, 0, undefined, Cutscene("mushman"), { noChange: true, sy: 6, visible: false, inside: true }),

        GetCommonEntity("SomeNerd", 15, 17, 0, 3, undefined, Cutscene("someNerd"), { sy: 15, visible: false, inside: true }),
        GetCommonEntity("SomeNerd2", 22, 15, 0, 2, undefined, [ GetSpeak("bathroomNerd") ], { sy: 15, visible: false, inside: true }),

        GetCommonEntity("crazy4trout", 34, 17, 0, 2, undefined, Cutscene("crazy4trout"), { sy: 14, visible: false, inside: true }),
        GetCommonEntity("brandt", 54, 22, 15, 0, undefined, Cutscene("brandt"), { noChange: true, sy: 8, visible: false, inside: true }),

        GetCommonInvisibleSpeakingEntity("fridge", 18, 21, "mushFridge"),
        GetCommonInvisibleSpeakingEntity("fridge2", 12, 15, "mushFridge"),
        GetCommonInvisibleSpeakingEntity("mushGame", 17, 21, "mushGame"),
        GetCommonInvisibleSpeakingEntity("mushPosterL", 13, 20, "mushPoster"),
        GetCommonInvisibleSpeakingEntity("mushPosterR", 14, 20, "mushPoster"),
        GetCommonInvisibleSpeakingEntity("mushLamp", 15, 20, "mushLamp"),
        GetCommonEntity("freeRadish", 13, 15, 0, 0, undefined, Cutscene("freeRadish"), { visible: false }),
        GetCommonInvisibleSpeakingEntity("billU", 17, 16, "rentBill"),
        GetCommonInvisibleSpeakingEntity("billB", 17, 17, "rentBill"),
        GetCommonInvisibleSpeakingEntity("bed1L", 18, 19, "someonesBed"),
        GetCommonInvisibleSpeakingEntity("bed1R", 19, 19, "someonesBed"),
        GetCommonInvisibleSpeakingEntity("bed2U", 19, 22, "someonesBed"),
        GetCommonInvisibleSpeakingEntity("bed2B", 19, 23, "someonesBed"),

        GetCommonEntity("Hazard", 12, 11, 0, 0, undefined, undefined, { boring: true, big: true, noChange: true, sy: 1, robbery: true }),
        GetCommonEntity("Hazard2", 0, 11, 0, 0, undefined, undefined, { boring: true, big: true, noChange: true, sy: 1, robbery: true }),

        GetCommonEntity("Officer1", 9, 13, 16, 0, undefined, [GetSpeak("officer1")], { noChange: true, sy: 10, robbery: true }),
        GetCommonEntity("Officer2", 7, 10, 8, 0, undefined, [GetSpeak("officer2")], { noChange: true, sy: 15, robbery: true }),
        GetCommonEntity("Officer3", 10, 11, 8, 2, undefined, [GetSpeak("officer4")], { noChange: true, sy: 15, robbery: true }),
        GetCommonEntity("Officer4", 3, 11, 16, 1, undefined, [GetSpeak("officer3")], { noChange: true, sy: 10, robbery: true }),

        GetCommonEntity("ConeThing1L", 2, 7, 16, 0, undefined, undefined, { boring: true, sy: 11, inside: true, visible: false }),
        GetCommonEntity("ConeThing1R", 3, 7, 16, 1, undefined, undefined, { boring: true, sy: 11, inside: true, visible: false }),
        GetCommonEntity("ConeThing2L", 10, 6, 16, 0, undefined, undefined, { boring: true, sy: 12, inside: true, visible: false }),
        GetCommonEntity("ConeThing2R", 11, 6, 16, 1, undefined, undefined, { boring: true, sy: 12, inside: true, visible: false }),
        
        GetCommonEntity("Robber1", 6, 5, 8, 3, undefined, Cutscene("robber"), { sy: 14, inside: true, visible: false, robbery: true, postBattle: "PostRobbers" }),
        GetCommonEntity("Robber2", 9, 3, 8, 0, undefined, Cutscene("robber"), { sy: 14, inside: true, visible: false, robbery: true, postBattle: "PostRobbers" }),
        GetInvisibleEntity("CS_beatRobbers", Cutscene("strobbery"), { storageKey: "PostRobbers" }),

        GetCommonEntity("RealSleepyHoursWhoUp", 43, 15, 23, 0, undefined, undefined, { boring: true, nochange: true, inside: true, visible: false, storageKey: "dweeb" }),
        GetCommonEntity("Keycard", 45, 15, 23, 0, undefined, Cutscene("keycard"), { sy: 2, nochange: true, inside: true, visible: false }),
        GetCommonEntity("KeycardTrap", 44, 20, 0, 0, undefined, Cutscene("keytrap"), { isRow: true, solid: false, visible: false, storageKey: "keytrap", postBattle: "scrungus" }),
        GetCommonEntity("Mabingy", 44, 25.25, 0, 0, undefined, Cutscene("keyfail"), { boring: true, sy: 3, big: true, solid: false, visible: false, storageKey: "mech", postBattle: "scrungus" }),
        GetInvisibleEntity("scrungus", Cutscene("keywin"), { storageKey: "scrungus" }),
        GetCommonEntity("BottomWall1", 42, 26, 23, 0, undefined, undefined, { boring: true, visible: false, inside: true, sy: 6, destroyable: true }),
        GetCommonEntity("BottomWall2", 43, 26, 23, 0, undefined, undefined, { boring: true, visible: false, inside: true, sy: 5, destroyable: true }),
        GetCommonEntity("BottomWall3", 45, 26, 23, 0, undefined, undefined, { boring: true, visible: false, inside: true, sy: 4, destroyable: true }),
        GetCommonEntity("BottomWall4", 46, 26, 23, 0, undefined, undefined, { boring: true, visible: false, inside: true, sy: 6, destroyable: true }),
        GetCommonEntity("BottomWall5", 47, 26, 23, 0, undefined, undefined, { boring: true, visible: false, inside: true, sy: 6, destroyable: true }),

        GetCommonEntity("CompCover1", 50, 33, 22, 0, undefined, undefined, { forcedY: 40, sy: 7, solid: false, boring: true, visible: false, inside: true }),
        GetCommonEntity("CompCover2", 51, 33, 22, 1, undefined, undefined, { forcedY: 40, sy: 7, solid: false, boring: true, visible: false, inside: true }),
        GetCommonEntity("CompCover3", 50, 36, 22, 0, undefined, undefined, { forcedY: 40, sy: 8, solid: false, boring: true, visible: false, inside: true }),
        GetCommonEntity("CompCover4", 51, 36, 22, 1, undefined, undefined, { forcedY: 40, sy: 8, solid: false, boring: true, visible: false, inside: true }),
        GetCommonEntity("CompCover5", 50, 39, 22, 0, undefined, undefined, { forcedY: 40, sy: 8, solid: false, boring: true, visible: false, inside: true }),
        GetCommonEntity("CompCover6", 51, 39, 22, 1, undefined, undefined, { forcedY: 40, sy: 8, solid: false, boring: true, visible: false, inside: true }),
        GetCommonEntity("CompCover7", 55, 36, 22, 0, undefined, undefined, { forcedY: 40, sy: 7, solid: false, boring: true, visible: false, inside: true }),
        GetCommonEntity("CompCover8", 56, 36, 22, 1, undefined, undefined, { forcedY: 40, sy: 7, solid: false, boring: true, visible: false, inside: true }),
        GetCommonEntity("CompCover9", 55, 39, 22, 0, undefined, undefined, { forcedY: 40, sy: 8, solid: false, boring: true, visible: false, inside: true }),
        GetCommonEntity("CompCover0", 56, 39, 22, 0, undefined, undefined, { forcedY: 40, sy: 6, solid: false, boring: true, visible: false, inside: true }),
        GetBeehive("OfficeHive", 55, 32, true),
        GetCommonEntity("OfficeLady", 54, 35, 4, 1, undefined, Cutscene("officeLady"), { sy: 16, visible: false, inside: true }),
        GetCommonEntity("EggBoy", 58, 30, 17, 0, undefined, Cutscene("eggBoy"), { sy: 13, noChange: true }),

        GetCommonEntity("CorpseBuddy", 55, 17, 16, 0, undefined, [ GetSpeak("corpseBuddy") ], { sy: 13, noChange: true, visible: false, inside: true, boring: true }),
        GetCommonEntity("CityMonk", 36, 22, 4, 2, undefined, Cutscene("cityMonk"), { sy: 8, visible: false, inside: true }),
        GetSign(24, 19, "forRentSign"),

        GetCommonEntity("UndergroundMan", 16, 6, 16, 0, undefined, [ GetSpeak("undergroundNotYet") ], { sy: 6, noChange: true, visible: false, inside: true } ),
        GetCommonEntity("UndergroundHole", 17, 6, 16, 0, undefined, undefined, { sy: 7, visible: false, inside: true, boring: true } ),

        GetCommonEntity("12thSt", 4, 43, 7, 0, undefined, undefined, { boring: true, big: true }),
        GetCommonEntity("13thSt", 4, 26, 7, 0, undefined, undefined, { boring: true, big: true, sy: 1 }),
        GetCommonEntity("14thSt", 2, 9, 7, 0, undefined, undefined, { boring: true, big: true, sy: 2 }),

        GetCommonEntity("Food2Entrance", 39, 9, 0, 0, undefined, Cutscene("foodDoor"), { boring: true, visible: false, solid: true }),
        SwitchMap("EnterFood2", 39, 8, false, false, 15, 29, "hq_1"),

        GetCommonEntity("atm0", 22, 34, 15, 0, undefined, Cutscene("atm"), { noChange: true, inside: true, visible: false, sy: 9 }),
        GetCommonEntity("atm1", 23, 34, 15, 0, undefined, Cutscene("atm"), { noChange: true, inside: true, visible: false, sy: 9 }),
        GetCommonEntity("atm2", 24, 34, 15, 0, undefined, Cutscene("atm"), { noChange: true, inside: true, visible: false, sy: 9 }),
        GetCommonEntity("atm3", 25, 34, 15, 0, undefined, Cutscene("atm"), { noChange: true, inside: true, visible: false, sy: 9 }),
        GetCommonEntity("atm4", 26, 34, 15, 0, undefined, Cutscene("atm"), { noChange: true, inside: true, visible: false, sy: 9 }),
        GetCommonEntity("atm5", 27, 34, 15, 0, undefined, Cutscene("atm"), { noChange: true, inside: true, visible: false, sy: 9 }),
        GetCommonEntity("atm6", 28, 34, 15, 0, undefined, Cutscene("atm"), { noChange: true, inside: true, visible: false, sy: 9 }),
        GetCommonEntity("cashboy0", 23, 39, 4, 3, undefined, Cutscene("cashBoy"), { inside: true, visible: false, sy: 15 }),
        GetCommonEntity("cashboy1", 27, 37, 4, 2, undefined, Cutscene("cashBoy"), { inside: true, visible: false, sy: 15 })
    ],
    "hq_1": function() {
        var x = [ 
            { name: "Falcon5", pos: { x: 15, y: 27 }, isRow: true, visible: false, solid: false, interact: Cutscene("falcon") },
            SwitchMap("GoUpstairs", 5.5, 1, true, false, 5, 2, "hq_2"),
            SwitchMap("Leave", 15, 30, false, false, 39, 10, "northcity"),

            GetCommonEntity("HQ1Robo1", 27, 9, 16, 3, undefined, Cutscene("enemy"), enemyMetadata.roboGuard),
            GetCommonEntity("HQ1Robo2", 16, 8, 16, 3, commonMovementDatas.rectangle(16, 8, 3, 2), Cutscene("enemy"), enemyMetadata.roboGuard),
            GetCommonEntity("HQ1Robo3", 5, 11, 16, 2, commonMovementDatas.downrectangle(5, 11, 4, 2), Cutscene("enemy"), enemyMetadata.roboGuard),

            GetCommonEntity("HipNerd1", 13, 15, 20, 2, undefined, Cutscene("enemy"), enemyMetadata.hipNerd),
            GetCommonEntity("HipNerd2", 13, 18, 20, 0, undefined, Cutscene("enemy"), enemyMetadata.hipNerdUp),
            GetCommonEntity("HipNerd3", 16, 18, 20, 0, undefined, Cutscene("enemy"), enemyMetadata.hipNerdUp),
            GetCommonEntity("RegNerd1", 3, 18, 4, 3, undefined, Cutscene("enemy"), enemyMetadata.tinyNerd),
            GetCommonEntity("RegNerd2", 1, 16, 4, 0, undefined, Cutscene("enemy"), enemyMetadata.tinyNerd),
            GetCommonEntity("RegNerd3", 11, 8, 4, 2, undefined, Cutscene("enemy"), enemyMetadata.tinyNerd),

            GetCommonEntity("droppybottle1", 29, -1, 8, 2, commonMovementDatas.fuckinBottle(29, -1, 3, 10), undefined, { solid: false, forcedY: 15, noChange: true, sy: 4, sheetlen: 1 } ),
            GetCommonEntity("droppybottle2", 29, -11, 8, 2, commonMovementDatas.fuckinBottle(29, -11, 3, 21), undefined, { solid: false, forcedY: 15, noChange: true, sy: 4, sheetlen: 1 } ),
            GetCommonEntity("droppybottle3", 29, -6, 8, 2, commonMovementDatas.fuckinBottle(29, -6, 3, 17), undefined, { solid: false, forcedY: 15, noChange: true, sy: 4, sheetlen: 1 } ),

            GetCommonEntity("Chair1", 11, 25, 18, 0, undefined, undefined, { boring: true, sy: 11 }),
            GetCommonEntity("Chair2", 11, 27, 18, 0, undefined, undefined, { boring: true, sy: 11 }),
            GetCommonEntity("Chair3", 19, 25, 19, 0, undefined, undefined, { boring: true, sy: 11 }),
            GetCommonEntity("Chair4", 19, 27, 19, 0, undefined, undefined, { boring: true, sy: 11 }),
            GetCommonEntity("CompyL", 14, 23.375, 20, 0, undefined, undefined, { boring: true, sy: 11 }),
            GetCommonEntity("CompyR", 15, 23.375, 21, 0, undefined, undefined, { boring: true, sy: 11 }),
            GetCommonEntity("Receptionist", 15.25, 23.375, 19, 0, undefined, undefined, { sy: 12 }),
            GetCommonEntity("ReceptionistTalky", 15, 24, 19, 0, undefined, Cutscene("food2Start"), { boring: true, visible: false }),
            GetCommonEntity("rollybaby1", 29, 8, 18, 2, undefined, undefined, { sy: 7, sheetlen: 2, moving: true, boring: true }),
            GetCommonEntity("rollybaby2", 29, 9, 18, 3, undefined, undefined, { sy: 7, sheetlen: 2, moving: true, boring: true }),
            GetCommonEntity("rollybaby3", 29, 10, 18, 3, undefined, undefined, { sy: 7, sheetlen: 2, moving: true, boring: true }),
            GetCommonEntity("rollybaby4", 29, 11, 18, 3, undefined, undefined, { sy: 7, sheetlen: 2, moving: true, boring: true }),
            GetCommonEntity("rollybaby5", 30, 9, 18, 3, undefined, undefined, { sy: 7, sheetlen: 2, moving: true, boring: true }),
            GetCommonEntity("rollybaby6", 30, 10, 18, 3, undefined, undefined, { sy: 7, sheetlen: 2, moving: true, boring: true }),
            GetCommonEntity("rollybaby7", 30, 11, 18, 3, undefined, undefined, { sy: 7, sheetlen: 2, moving: true, boring: true }),
            GetCommonEntity("hqCompCover1", 13, 15, 22, 0, undefined, undefined, { forcedY: 29, sy: 7, solid: false, boring: true }),
            GetCommonEntity("hqCompCover2", 14, 15, 22, 1, undefined, undefined, { forcedY: 29, sy: 7, solid: false, boring: true }),
            GetCommonEntity("hqCompCover3", 17, 16, 22, 0, undefined, undefined, { forcedY: 29, sy: 7, solid: false, boring: true }),
            GetCommonEntity("hqCompCover4", 18, 16, 22, 1, undefined, undefined, { forcedY: 29, sy: 7, solid: false, boring: true }),
            GetCommonEntity("fuzurusenpai", 16.5, 16.25, 8, 0, undefined, undefined, { noChange: true, sy: 1, sheetlen: 3, storageKey: "ed" }),
            GetCommonEntity("fuzuruL", 16, 16, 0, 0, undefined, Cutscene("apuru"), { visible: false, boring: true }),
            GetCommonEntity("fuzuruR", 17, 16, 0, 0, undefined, Cutscene("apuru"), { visible: false, boring: true }),
            GetCommonEntity("hungryboy", 14, 13, 11, 0, undefined, Cutscene("hungy"), { noChange: true, sy: 1, sheetlen: 2, moving: true }),
            GetCommonEntity("hungyBinU", 14, 11, 0, 0, undefined, Cutscene("hungyBin"), { visible: false, boring: true }),
            GetCommonEntity("hungyBinB", 14, 12, 0, 0, undefined, Cutscene("hungyBin"), { visible: false, boring: true })
        ];
        var doors = [ [20, 10, 0, false], [7, 10, 0, true],  [20, 3, 1, false], [25, 7, 1, true], [18, 6, 1, false], [17, 14, 1, true], [15, 8, 1, false],
                 [4, 17, 1, true], [10, 17, 1, false], [4, 8, 2, false], [4, 12, 2, true], [10, 12, 2, false], [7, 14, 2, true] ];
        for(var i = 0; i < doors.length; i++) { var d = doors[i]; x.push(GetRFDoor("Door" + i, d[0], d[1], d[2], d[3])); }
         
        var buttons = [ [24, 4, 0, false], [1, 15, 0, false], [10, 8, 1, false], [26, 4, 1, false], [19, 19, 1, false], [1, 8, 2, false] ];
        for(var i = 0; i < buttons.length; i++) { var b = buttons[i]; x.push(GetRFDoorButton("Btn" + i, b[0], b[1], b[2], b[3])); }
        
        var lookables = [ [3, 24, "smartDesk"], [4, 24, "smartDesk"], [5, 24, "smartDesk"], [6, 24, "smartDesk"], [7, 24, "smartDesk"],
                          [3, 25, "smartDesk"], [3, 26, "smartDesk"], [7, 25, "smartDesk"], [7, 26, "smartDesk"],
                          [3, 27, "smartDesk"], [4, 27, "smartDesk"], [5, 27, "smartDesk"], [6, 27, "smartDesk"], [7, 27, "smartDesk"],
                          [2, 22, "secondMonitor"], [3, 22, "secondMonitor"], [4, 22, "secondMonitor"], [5, 22, "secondMonitor"],
                          [6, 22, "whiteboard"], [7, 22, "whiteboard"], [8, 22, "whiteboard"], [26, 21, "theFirstBottle"],
                          [26, 22, "theFirstBottle"], [27, 22, "theFirstBottle"], [28, 22, "theFirstBottle"], [26, 29, "theFirstBottle"] ];
        for(var i = 0; i < lookables.length; i++) { var l = lookables[i]; x.push(GetCommonInvisibleSpeakingEntity("Invis" + i, l[0], l[1], l[2])); }
        return x;
    }(),
    "hq_2": function() {
        var x = [
            SwitchMap("GoUpstairsL", 24, 1, false, false, 24.5, 2, "hq_3"),
            SwitchMap("GoUpstairsR", 25, 1, false, false, 24.5, 2, "hq_3"),
            SwitchMap("GoDownstairsL", 5, 1, false, false, 5.5, 2, "hq_1"),
            SwitchMap("GoDownstairsR", 6, 1, false, false, 5.5, 2, "hq_1"),
            GetWaterfall("tech_waterfallAS", 4, 10, 2, "AX", true), GetWaterfallEnd("tech_wfendA", 4, 12, 2, "A", true),
            GetWaterfall("tech_waterfallBS", 1, 10, 2, "BX", true), GetWaterfallEnd("tech_wfendB", 1, 17, 2, "B", true),
            GetWaterfall("tech_waterfallCS", 6, 13, 3, "CX", true), GetWaterfallEnd("tech_wfendC", 8, 13, 3, "C", true),
            GetWaterfall("tech_waterfallDS", 8, 12, 1, "DX", true), GetWaterfallEnd("tech_wfendD", 6, 12, 1, "D", true),
            GetWaterfall("tech_waterfallES", 6, 15, 2, "EX", true), GetWaterfallEnd("tech_wfendE", 6, 17, 2, "E", true),
            GetWaterfall("tech_waterfallFS", 1, 19, 3, "FX", true), GetWaterfallEnd("tech_wfendF", 11, 19, 3, "F", true), // rock
            GetWaterfall("tech_waterfallGS", 9, 27, 0, "GX", true), GetWaterfallEnd("tech_wfendG", 9, 15, 0, "G", true),
            GetWaterfall("tech_waterfallHS", 6, 8, 3, "HX", true), GetWaterfallEnd("tech_wfendH", 8, 8, 3, "H", true),
            GetWaterfall("tech_waterfallIS", 8, 6, 0, "IX", true), GetWaterfallEnd("tech_wfendI", 8, 4, 0, "I", true),
            GetWaterfall("tech_waterfallJS", 11, 10, 2, "JX", true), GetWaterfallEnd("tech_wfendJ", 11, 12, 2, "J", true),
            GetWaterfall("tech_waterfallKS", 19, 9, 1, "KX", true), GetWaterfallEnd("tech_wfendK", 13, 9, 1, "K", true),
            GetWaterfall("tech_waterfallLS", 19, 4, 1, "LX", true), GetWaterfallEnd("tech_wfendL", 13, 4, 1, "L", true),
            GetWaterfall("tech_waterfallMS", 26, 6, 1, "MX", true), GetWaterfallEnd("tech_wfendM", 24, 6, 1, "M", true),
            GetWaterfall("tech_waterfallNS", 8, 24, 3, "NX", true), GetWaterfallEnd("tech_wfendN", 11, 24, 3, "N", true),
            GetWaterfall("tech_waterfallOS", 17, 25, 1, "OX", true), GetWaterfallEnd("tech_wfendO", 4, 25, 1, "O", true),
            GetWaterfall("tech_waterfallPS", 18, 23, 0, "PX", true), GetWaterfallEnd("tech_wfendP", 18, 19, 0, "P", true),
            GetWaterfall("tech_waterfallQS", 21, 19, 2, "QX", true), GetWaterfallEnd("tech_wfendQ", 21, 27, 2, "Q", true),
            GetWaterfall("tech_waterfallRS", 15, 21, 3, "RX", true), GetWaterfallEnd("tech_wfendR", 24, 21, 3, "R", true),
            GetWaterfall("tech_waterfallSS", 13, 21, 0, "SX", true), GetWaterfallEnd("tech_wfendS", 13, 15, 0, "S", true),
            GetWaterfall("tech_waterfallTS", 22, 17, 3, "TX", true), GetWaterfallEnd("tech_wfendT", 24, 17, 3, "T", true),
            GetWaterfall("tech_waterfallUS", 26, 15, 2, "UX", true), GetWaterfallEnd("tech_wfendU", 26, 25, 2, "U", true), // rock
            GetWaterfall("tech_waterfallVS", 28, 15, 2, "VX", true), GetWaterfallEnd("tech_wfendV", 28, 25, 2, "V", true),
            GetWaterfall("tech_waterfallWS", 27, 20, 3, "WX", true), GetWaterfallEnd("tech_wfendW", 29, 20, 3, "W", true),
            GetWaterfall("tech_waterfallXS", 29, 20, 0, "XX", true), GetWaterfallEnd("tech_wfendX", 29, 13, 0, "X", true),
            GetTechRock("TechRockF", 1, 20, 0, "F"), GetTechRock("TechRockU", 25, 15, 2, "U"),
            GetWaterfall("tech_waterfallA", 4, 11, 2, "A", true), GetWaterfall("tech_waterfallC", 7, 13, 3, "C", true),
            GetWaterfall("tech_waterfallD", 7, 12, 1, "D", true), GetWaterfall("tech_waterfallE", 6, 16, 2, "E", true),
            GetWaterfall("tech_waterfallH", 7, 8, 3, "H", true), GetWaterfall("tech_waterfallI", 8, 5, 0, "I", true),
            GetWaterfall("tech_waterfallJ", 11, 11, 2, "J", true), GetWaterfall("tech_waterfallM", 25, 6, 1, "M", true),
            GetWaterfall("tech_waterfallN1", 9, 24, 3, "N", true), GetWaterfall("tech_waterfallN2", 10, 24, 3, "N", true),
            GetWaterfall("tech_waterfallT", 23, 17, 3, "T", true),

            GetCommonEntity("HQ2Robo1", 2, 20, 16, 2, commonMovementDatas.downrectangle(2, 20, 2, 5), Cutscene("enemy"), enemyMetadata.roboGuard),
            GetCommonEntity("HQ2Robo2", 4, 25, 16, 0, commonMovementDatas.downrectangle(2, 20, 2, 5, 2), Cutscene("enemy"), enemyMetadata.roboGuard),
            GetCommonEntity("HQ2Robo3", 24, 26, 16, 3, commonMovementDatas.rectangle(24, 26, 5, 2), Cutscene("enemy"), enemyMetadata.roboGuard),
            GetCommonEntity("HQ2Robo4", 26, 10, 16, 3, commonMovementDatas.downrectangle(26, 10, 3, 2), Cutscene("enemy"), enemyMetadata.roboGuard),
            GetCommonEntity("HQ2Robo5", 17, 27, 16, 2, commonMovementDatas.downrectangle(17, 27, 6, 1), Cutscene("enemy"), enemyMetadata.roboGuard),
            GetCommonEntity("HQ2BuffNerd1", 12, 28, 8, 2, undefined, Cutscene("enemy"), enemyMetadata.buffNerd),
            GetCommonEntity("HQ2BuffNerd2", 15, 22, 8, 2, undefined, Cutscene("enemy"), enemyMetadata.buffNerd)
        ];
        
        for(var i = 11; i < 17; i++) { x.push(GetWaterfall("tech_waterfallB" + i, 1, i, 2, "B", true)); }
        for(var i = 2; i < 11; i++) { x.push(GetWaterfall("tech_waterfallF" + i, i, 19, 3, "F", true)); }
        for(var i = 16; i < 27; i++) { x.push(GetWaterfall("tech_waterfallG" + i, 9, i, 0, "G", true)); }
        for(var i = 14; i < 19; i++) { x.push(GetWaterfall("tech_waterfallK" + i, i, 9, 1, "K", true)); }
        for(var i = 14; i < 19; i++) { x.push(GetWaterfall("tech_waterfallL" + i, i, 4, 1, "L", true)); }
        for(var i = 5; i < 17; i++) { x.push(GetWaterfall("tech_waterfallO" + i, i, 25, 1, "O", true)); }
        for(var i = 20; i < 23; i++) { x.push(GetWaterfall("tech_waterfallP" + i, 18, i, 0, "P", true)); }
        for(var i = 20; i < 27; i++) { x.push(GetWaterfall("tech_waterfallQ" + i, 21, i, 2, "Q", true)); }
        for(var i = 16; i < 24; i++) { x.push(GetWaterfall("tech_waterfallR" + i, i, 21, 3, "R", true)); }
        for(var i = 16; i < 21; i++) { x.push(GetWaterfall("tech_waterfallS" + i, 13, i, 0, "S", true)); }
        for(var i = 16; i < 25; i++) { x.push(GetWaterfall("tech_waterfallU" + i, 26, i, 2, "U", true)); }
        for(var i = 16; i < 25; i++) { x.push(GetWaterfall("tech_waterfallV" + i, 28, i, 2, "V", true)); }
        for(var i = 14; i < 20; i++) { x.push(GetWaterfall("tech_waterfallX" + i, 29, i, 0, "X", true)); }
        x.push(GetWaterfall("tech_waterfallW", 28, 20, 3, "W", true));

        var lookables = [ [18, 13, "coffeeBottle"], [18, 14, "coffeeBottle"], [19, 14, "coffeeBottle"], [20, 14, "coffeeBottle"], [20, 13, "coffeeBottle"],
                          [27, 8, "gamerBottle"], [28, 8, "gamerBottle"], [29, 8, "gamerBottle"] ];
        for(var i = 0; i < lookables.length; i++) { var l = lookables[i]; x.push(GetCommonInvisibleSpeakingEntity("Invis" + i, l[0], l[1], l[2])); }
        return x;
    }(),
    "hq_3": function() {
        var x = [
            GetCommonEntity("HurtWorker", 24, 27, 20, 0, undefined, Cutscene("hurtNerd"), { sy: 16, noChange: true, sheetlen: 2, storageKey: "trent" }),

            SwitchMap("GoDownstairsL", 24, 1, false, false, 24.5, 2, "hq_2"),
            SwitchMap("GoDownstairsR", 25, 1, false, false, 24.5, 2, "hq_2"),
            SwitchMap("GoUpstairsL", 5, 1, false, false, 5.5, 2, "hq_4"),
            SwitchMap("GoupstairsR", 6, 1, false, false, 5.5, 2, "hq_4"),

            GetChungus(0, 0, 15, 0, 297, 119), GetChungus(1, 0, 15, 119, 73, 192), GetChungus(2, 0, 15, 311, 185, 154), GetChungus(3, 0, 200, 375, 112, 90), 
            GetChungus(4, 0, 312, 263, 112, 160), GetChungus(5, 0, 424, 263, 57, 96), GetChungus(6, 0, 312, 103, 64, 106), GetChungus(7, 0, 88, 119, 96, 192),
            GetChungus(7, 1, 184, 151, 16, 160), GetChungus(8, 0, 200, 119, 64, 96), GetChungus(8, 1, 184, 119, 16, 32), GetChungus(9, 0, 200, 215, 112, 160),
            GetChungus(9, 1, 264, 119, 48, 96), GetChungus(10, 0, 312, 423, 89, 42), GetChungus(10, 1, 401, 439, 80, 26), GetChungus(11, 0, 424, 359, 57, 58),
            GetChungus(11, 1, 447, 417, 34, 22), GetChungus(12, 0, 376, 167, 105, 96), GetChungus(12, 1, 312, 231, 64, 32), GetChungus(13, 0, 312, 0, 169, 103),
            GetChungus(13, 1, 376, 103, 105, 64),
            { id: "StartChungus", chungi: [13], autoplay: true, interact: [ function() { 
                var startingRoom = 13; // TODO: handle coming from elevator/above
                worldmap.horRor = new HorRor(startingRoom);
                ToggleChungus(true, { chungi: [startingRoom] });
                return true;
            } ], pos: { x: -1, y: -1 } }
        ];
        var doors = [ 
            { x: 21, y: 5, dx: 0, dy: 1, doors: [13, 6] }, { x: 28, y: 9, dx: 0, dy: 1, doors: [13, 12] }, { x: 29, y: 15, dx: 0, dy: 1, doors: [12, 5] },
            { x: 28, y: 21, dx: 0, dy: 1, doors: [5, 11] }, { x: 29, y: 26, dx: 0, dy: 1, doors: [11, 10] }, { x: 21, y: 15, dx: 0, dy: 1, doors: [12, 4] },
            { x: 21, y: 25, dx: 0, dy: 1, doors: [4, 10] }, { x: 1, y: 6, dx: 0, dy: 1, doors: [0, 1] }, { x: 6, y: 18, dx: 0, dy: 1, doors: [7, 2] },
            { x: 13, y: 12, dx: 0, dy: 1, doors: [8, 9] }, { x: 16, y: 22, dx: 0, dy: 1, doors: [9, 3] }, { x: 22, y: 11, dx: 1, dy: 0, doors: [6, 12] },
            { x: 25, y: 17, dx: 1, dy: 0, doors: [4, 5] }, { x: 18, y: 10, dx: 1, dy: 0, doors: [9, 6] }, { x: 15, y: 9, dx: 1, dy: 0, doors: [8, 9] },
            { x: 10, y: 8, dx: 1, dy: 0, doors: [7, 8] }, { x: 4, y: 14, dx: 1, dy: 0, doors: [1, 7] }, { x: 11, y: 15, dx: 1, dy: 0, doors: [7, 9] },
            { x: 11, y: 20, dx: 1, dy: 0, doors: [2, 9] }, { x: 11, y: 26, dx: 1, dy: 0, doors: [2, 3] }, { x: 18, y: 27, dx: 1, dy: 0, doors: [3, 10] },
            { x: 25, y: 25, dx: 1, dy: 0, doors: [4, 11] }
        ];
        for(var i = 0; i < doors.length; i++) { 
            var door = doors[i];
            x.push(GetChungusDoor(i, door.x, door.y, [door.doors[0]]));
            x.push(GetChungusDoor(i, door.x + door.dx, door.y + door.dy, door.doors, (door.dx > 0 ? 1 : 0)));
            x.push(GetChungusDoor(i, door.x + door.dx * 2, door.y + door.dy * 2, [door.doors[1]]));
        }
        return x;
    }()
};
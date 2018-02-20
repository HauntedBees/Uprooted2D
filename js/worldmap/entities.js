const beeQueen = { interact: Cutscene("angryBee") };
const mapentities = {
    "farm_init": [
        // Opening Cutscene
        new AutoplayCutscene("farminit"),
        GetCommonEntity("Nathan", 24, 11, 0, 1, undefined, undefined, { sheet: "assistant", storageKey: "nathanA" }),
        GetCommonEntity("Eagle", 16, 9, 4, 0, undefined, undefined, { sheet: "assistant" })
    ],
    "producestand": [
        // Opening Cutscene
        new AutoplayCutscene("pstand"),
        new CutsceneTrigger("finTut", "PostInitialBattle"),
        new CutsceneTrigger("finStTut", "PostStandaloneTutorial"),
        GetCommonEntity("H_HipsterBike", 6, 4, 0, 0, undefined, undefined, { sy: 2, sheet: "hipster", storageKey: "bike", visible: false, solid: false }),
        GetCommonEntity("H_Hipster", 0, 4, 0, 0, undefined, undefined, { sheet: "hipster", moving: true, sheetlen: 2, storageKey: "hipster", postBattle: "PostInitialBattle" }),
        // Map Switching
        SwitchMap("ExitAreaWest", 0, 20, false, true, 22, 12, "farm"),
        SwitchMap("ExitAreaSouth", 16, 23, true, false, 21, 1, "firstvillage", CommonConditions["beatBigBot"]),
        GetCommonEntity("AFuckingTruckL", 16, 5, 4, 0, undefined, Cutscene("truck"), { big: true, noChange: true }),
        GetCommonEntity("AFuckingTruckR", 18, 5, 5, 0, undefined, Cutscene("truck"), { big: true, noChange: true }),
        // Misc. Entities
        GetCommonEntity("EggFairy", 24, 19, 13, 1, undefined, Cutscene("eggfairy"), { visible: false, storageKey: "eggFairy" }),
        // Only before BeatBigBot:
        GetCommonEntity("ConvinceATron", 10, 4, 0, 0, undefined, Cutscene("tutBuddy"), { sy: 3, noChange: true, sheet: "hipster", noRunKill: true, storageKey: "convince", visible: false, postBattle: "PostStandaloneTutorial" }),        
        GetProduceStandBlock(16), GetProduceStandBlock(17), 
        // Only after BeatBigBot:
        GetCommonEntity("Nathan2", 16, 19, 0, 1, undefined, Cutscene("theHappening"), { showIf: CommonConditions["beatBigBot"], boring: true, sheet: "assistant", autoplay: true, moving: true, storageKey: "nathanB" }),
        GetCommonEntity("Eagle2", 1.5, 19, 4, 0, undefined, undefined, { showIf: CommonConditions["beatBigBot"], boring: true, sheet: "assistant", storageKey: "eaglia" })
    ],
    "farm": function() {
        const entities = [
            // Foreground
            GetForeground("farm", 7, 1536),
            // Opening Trigger
            GetInvisibleEntity("CS_enterfarm", [ SpecialFunctions["ENTERFARM"] ], { autoplay: true }),
            GetCommonEntity("NathanOnTheFarm0", 10, 6, 9, 0, undefined, OneSpeak("yaBoiA"), { big: true, moving: true, sheetlen: 8, storageKey: "n0", noChange: true }),
            GetCommonEntity("NathanOnTheFarm1", 12, 6, 9, 1, undefined, OneSpeak("yaBoiB"), { big: true, moving: true, sheetlen: 3, storageKey: "n1", noChange: true }),
            GetCommonEntity("NathanOnTheFarm2", 14, 6, 9, 1, undefined, OneSpeak("yaBoiC"), { big: true, sy: 3, storageKey: "n2", noChange: true }),
            GetCommonEntity("NathanOnTheFarm3", 12, 2, 6, 0, undefined, OneSpeak("yaBoiD"), { sheet: "assistant", storageKey: "n3", noChange: true }),
            GetCommonEntity("IiiOnTheFarm", 16, 9, 4, 0, undefined, Cutscene("iiiTalk"), { sheet: "assistant", storageKey: "n4", noChange: true }),
            // Map Switching
            SwitchMap("ExitAreaWest", 23, 12, false, true, 1, 20, "producestand"),
            // Shops & Hives
            GetBeehive("FarmHive", 3, 1),
            EnterShop("ChickenCoop", 18, 3, "coop"),
            EnterShop("Inn", 10, 2, "inn0"),
            // Boss
            GetCommonEntity("Fucker", 10, 2, 0, 2, undefined, Cutscene("bigBot"), { boss: true, big: true, postBattle: "PostBoss", failedInteract: Cutscene("bigBotL") }),
            new CutsceneTrigger("bigBotW", "PostBoss"),
            // Mandatory Enemies
            GetCommonEntity("Robo1", 20, 8, 4, 2, commonMovementDatas.robo(20), Cutscene("enemy"), requiredEnemyMetadata.robo), 
            GetCommonEntity("Robo2", 17, 10, 4, 2, commonMovementDatas.robo(17), Cutscene("enemy"), requiredEnemyMetadata.roboDouble), 
            GetCommonEntity("Robo3", 16, 12, 4, 2, commonMovementDatas.robo(16), Cutscene("enemy"), requiredEnemyMetadata.robo), 
            GetCommonEntity("Robo4", 13, 14, 4, 2, commonMovementDatas.robo(13), Cutscene("enemy"), requiredEnemyMetadata.roboDouble), 
            GetCommonEntity("Robo5", 12, 11, 4, 2, commonMovementDatas.robo(12, 1), Cutscene("enemy"), requiredEnemyMetadata.robo), 
            GetCommonEntity("Robo6", 9, 15, 4, 2, commonMovementDatas.robo(9, 1), Cutscene("enemy"), requiredEnemyMetadata.roboDouble)
        ];
        // Misc. Entities
        const veggies = [
            [10, 8], [11, 8], [14, 8], [15, 8], [18, 8], [19, 8], [10, 9], [15, 9], [18, 9], [10, 10], [11, 10], [14, 10], [15, 10], [18, 10], [19, 10], [10, 11], 
            [11, 11], [14, 11], [15, 11], [18, 11], [19, 11], [11, 12], [14, 12], [19, 12], [10, 13], [11, 13], [14, 13], [15, 13], [18, 13], [19, 13], [10, 14], 
            [11, 14], [14, 14], [15, 14], [18, 14], [19, 14], [10, 15], [15, 15], [18, 15], [10, 16], [11, 16], [14, 16], [15, 16], [18, 16], [19, 16]
        ]
        veggies.forEach((e, i) => entities.push(GetCommonInvisibleSpeakingEntity("veggie" + i, e[0], e[1], "farmVeggie")));
        const otherObjs = [
            [4, 6, "farmMush"], [6, 8, "farmTree"], [7, 8, "farmTree"], [6, 7, "farmTree"], [7, 7, "farmTree"], [21, 4, "farmHay"], [17, 3, "farmBin"], [13, 2, "farmWater"], 
            [14, 2, "farmWater"], [15, 2, "farmWater"], [11, 9, "farmSprinkler"], [14, 9, "farmSprinkler"], [19, 9, "farmSprinkler"], [10, 12, "farmSprinkler"], 
            [15, 12, "farmSprinkler"], [18, 12, "farmSprinkler"], [11, 15, "farmSprinkler"], [14, 15, "farmSprinkler"], [19, 15, "farmSprinkler"]
        ];
        otherObjs.forEach((e, i) => entities.push(GetCommonInvisibleSpeakingEntity("other" + i, e[0], e[1], e[2])));
        return entities;
    }(),
    "firstvillage": [
        // Map Switching
        SwitchMap("ExitAreaNorth", 21, 0, true, false, 16, 22, "producestand"),
        SwitchMap("ExitAreaWest", 0, 22, false, true, 44, 49, "forest"),
        SwitchMap("ExitAreaSouth", 21, 30, true, false, 21.5, 1, "belowvillage"),
        // Shops & Hives
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
        // Misc. Entities
        GetCommonEntity("Dean", 10, 13, 12, 3, undefined, OneSpeak("villager0"), { sy: 14 }),
        GetCommonEntity("June", 20, 5, 16, 2, undefined, OneSpeak("villager1"), { sy: 14 }),
        GetCommonEntity("Aiko", 27, 10, 0, 3, undefined, OneSpeak("villager2"), { sy: 16 }),
        GetCommonEntity("Tanner", 3, 18, 0, 0, undefined, OneSpeak("villager3"), { sy: 17 }),
        GetSign(1, 24, "SignForest")
    ],
    "forest": [
        // Map Switching
        SwitchMap("ExitAreaEast", 46, 49, false, false, 1, 22.5, "firstvillage"),
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
        SwitchMapSeamless("JoinGrey2", 101, 53, 0, 10, 46),
        // Hives & Quest Whatsits
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
        // Mandatory Enemies
        GetCommonEntity("Turkey1", 2, 56, 0, 0, undefined, Cutscene("enemy"), requiredEnemyMetadata.turky),
        GetCommonEntity("Turkey2", 7, 57, 0, 0, undefined, Cutscene("enemy"), requiredEnemyMetadata.turky),
        GetCommonEntity("Turkey3", 10, 62, 0, 0, undefined, Cutscene("enemy"), requiredEnemyMetadata.turky),
        GetCommonEntity("Turkey4", 12, 60, 0, 0, undefined, Cutscene("turky"), { sy: 7 }),
        GetCommonEntity("TurkeyEggs", 12, 59, 9, 0, undefined, [function() { worldmap.writeText("foundTurkey"); player.increaseItem("turkey", 5); worldmap.clearTarget(); }], { noChange: true, sy: 7 }),
        // Misc. Entities
        GetCommonEntity("FishyLeft", 72, 24, 12, 0, undefined, Cutscene("sadfish"), { noChange: true, sy: 6, visible: false }),
        GetCommonEntity("FishyRight", 73, 24, 12, 0, undefined, Cutscene("sadfish"), { noChange: true, sy: 6, visible: false }),
        GetCommonEntity("FishyTop", 73, 23, 12, 0, undefined, Cutscene("sadfish"), { noChange: true, sy: 6, visible: false })
    ],
    "belowvillage": [
        // Map Switching
        SwitchMap("ExitAreaNorth", 21, 0, true, false, 21.5, 28, "firstvillage"),
        SwitchMap("EnterFacilitySide", 13, 16, false, false, 30, 2, "researchfacility"),
        SwitchMap("EnterFacilityL", 7, 18, false, false, 12, 36, "researchfacility"),
        SwitchMap("EnterFacilityR", 8, 18, false, false, 13, 36, "researchfacility"),
        // Hives & Falcon
        GetBeehive("BelowHive", 4, 36),
        { name: "Falcon0", pos: { x: 21, y: 9 }, isRow: true, visible: false, solid: false, interact: Cutscene("falcon") },
        // Mandatory Enemies
        GetCommonEntity("BVRobo", 22, 36, 4, 3, undefined, Cutscene("enemy"), requiredEnemyMetadata.robo2)
    ],
    "researchfacility": function() {
		const entities = [
            // Map Switching
            SwitchMap("ExitAreaSouth", 12, 37, true, false, 7.5, 19, "belowvillage"),
            SwitchMap("ExitAreaEast", 31, 2, false, false, 13, 15, "belowvillage"),
            // Quests
            GetCommonEntity("RAPBATTLE", 28, 8, 11, 0, undefined, Cutscene("rap"), { noChange: true, sy: 7 }),
            // Boss
            GetCommonEntity("Jeff", 7, 2, 0, 0, undefined, Cutscene("jeff"), { sy: 4, boss: true, postBattle: "PostBoss2", noChange: true, failedInteract: Cutscene("jeffL") }),
            new CutsceneTrigger("jeffW", "PostBoss2"),
            // Mandatory Enemies
			GetCommonEntity("RFRobo1", 1, 15, 4, 2, GetStdMovement([ [1, 15, 3], [5, 15, 3], [5, 20, 2], [1, 20, 1], [1, 15, 0] ]), Cutscene("enemy"), requiredEnemyMetadata.robo2),
			GetCommonEntity("RFRobo2", 25, 14, 4, 2, GetStdMovement([ [25, 14, 3], [30, 14, 3], [30, 22, 2], [25, 22, 1], [25, 14, 0] ]), Cutscene("enemy"), requiredEnemyMetadata.robo2),
			GetCommonEntity("RFRobo3", 14, 7, 4, 2, GetStdMovement([ [14, 7, 3], [23, 7, 3], [23, 13, 2], [14, 13, 1], [14, 7, 0] ]), Cutscene("enemy"), requiredEnemyMetadata.robo2),
			GetCommonEntity("RFRobo4", 16, 9, 4, 2, GetStdMovement([ [16, 9, 3], [21, 9, 3], [21, 11, 2], [16, 11, 1], [16, 9, 0] ]), Cutscene("enemy"), requiredEnemyMetadata.robo2),
			GetCommonEntity("RFRobo5", 14, 1, 4, 2, GetStdMovement([ [14, 1, 3], [18, 1, 3], [18, 5, 2], [14, 5, 1], [14, 1, 0] ]), Cutscene("enemy"), requiredEnemyMetadata.robo2),
            // Misc. Entities
			GetInvisibleEntity("SeedShotArea1", Cutscene("seedShot"), { pos: { x: 20, y: 16 }, hasShot: 0 }),
			GetInvisibleEntity("SeedShotArea2", Cutscene("seedShot"), { pos: { x: 21, y: 16 }, hasShot: 0 }),
			GetInvisibleEntity("SeedShotArea3", Cutscene("seedShot"), { pos: { x: 20, y: 17 }, hasShot: 0 }),
			GetInvisibleEntity("SeedShotArea4", Cutscene("seedShot"), { pos: { x: 21, y: 17 }, hasShot: 0 }),
			GetCommonEntity("Chair", 8, 4, 14, 0, undefined, [ function() {
					game.target.swapped = !game.target.swapped;
					game.target.anim.shiftY(game.target.swapped ? 4 : 3);
					worldmap.finishDialog();
                } ], { sy: 3, noChange: true, swapped: false })
        ];
        
		const doors = [
			[5, 31, 0, false], [5, 32, 0, false], [10, 28, 0, true], [10, 29, 0, true], [6, 17, 0, true], [6, 18, 0, true], [6, 19, 0, true], [6, 20, 0, true],
			[28, 23, 0, false], [29, 23, 0, false], [30, 23, 0, false], [27, 3, 0, false], [28, 3, 0, false], [29, 3, 0, false], [30, 3, 0, false], [13, 11, 0, false],
			[7, 14, 0, false], [20, 35, 1, false], [20, 36, 1, false], [14, 14, 1, false], [15, 14, 1, false], [16, 14, 1, false], [20, 14, 1, true], [21, 14, 1, true],
			[19, 2, 1, true], [19, 3, 1, true], [27, 4, 1, false], [28, 4, 1, false], [29, 4, 1, false], [30, 4, 1, false], [25, 6, 1, true], [13, 28, 2, false],
			[13, 29, 2, false], [13, 9, 2, true], [26, 24, 2, false], [25, 24, 2, false], [25, 13, 2, true], [26, 13, 2, true], [27, 13, 2, true], [27, 5, 2, false],
			[28, 5, 2, false], [29, 5, 2, false], [30, 5, 2, false], [17, 6, 2, false], [18, 6, 2, false]
        ];
        doors.forEach((d, i) => entities.push(GetRFDoor("Door" + i, d[0], d[1], d[2], d[3])));
		const buttons = [ [2, 35, 0, false], [12, 7, 0, false], [18, 32, 1, false], [22, 8, 1, false], [4, 13, 2, false], [29, 15, 2, false] ];
        buttons.forEach((b, i) => entities.push(GetRFDoorButton("Btn" + i, b[0], b[1], b[2], b[3])));
		const invisSpeaks = [
			[28, 9, "growingpeppie"], [28, 11, "growingpeppie"], [29, 11, "rottencrop"], [28, 10, "rottencrop"], [18, 17, "seedshooter"], [18, 16, "seedshooter"], [23, 17, "seedshooter"], 
			[23, 16, "seedshooter"], [12, 16, "seasmod"], [13, 16, "seasmod"], [12, 15, "seasmod"], [13, 15, "seasmod"], [2, 13, "flask"], [2, 11, "sink"], [3, 11, "sink"], [6, 24, "labprinter"],
			[16, 26, "bookshelf.left"], [17, 26, "bookshelf.left"], [18, 26, "bookshelf.mid"], [19, 26, "bookshelf.mid"], [20, 26, "bookshelf.mid"], [21, 26, "bookshelf.mid"],
			[22, 26, "bookshelf.mid"], [23, 26, "bookshelf.right"], [24, 26, "bookshelf.right"], [10, 32, "broken.robot"], [11, 32, "broken.robot"], [12, 32, "broken.robot"], [13, 32, "broken.robot"], 
			[12, 31, "broken.robot"], [13, 31, "broken.robot"], [1, 7, "devbed"], [2, 7, "devbed"], [1, 3, "devmachines"], [2, 3, "devmachines"], [3, 2, "devmachines"], [4, 1, "devmonitor"],
			[5, 1, "devmachines"], [6, 1, "devmachines"], [7, 1, "devmachines"], [8, 1, "devmachines"], [9, 1, "devmachines"], [10, 2, "devmachines"], [11, 3, "devmachines"], [12, 3, "devmachines"]
		];
        invisSpeaks.forEach((s, i) => entities.push(GetCommonInvisibleSpeakingEntity("Spk" + i, s[0], s[1], s[2])));
		const chests = [
			[21, 3, [["ginger", 10]]], [21, 2, [["lemon", 3]]], [29, 27, [["shiitake", 5]]], [8, 12, [["portobello", 5]]], [9, 12, [["milkcap", 2]]],
			[10, 12, [["egg", 3]]], [11, 12, [["quail", 5]]], [27, 6, [["goose", 1]]], [28, 6, [["leek", 1]]], [29, 6, [["garlic", 1]]], 
			[30, 6, [["headphones", 2]]] 
		];
        chests.forEach((c, i) => entities.push(GetTreasureChest("RLChest" + i, c[0], c[1], c[2])));
        // More Mandatory Enemies
		const stationaryRobos = [
			[22, 2], [23, 2], [24, 2], [25, 2], [22, 3], [23, 3], [24, 3], [25, 3], [20, 4], [21, 4],
			[22, 4], [23, 4], [24, 4], [25, 4], [20, 1], [21, 1], [22, 1], [23, 1], [24, 1], [25, 1]
		]
        stationaryRobos.forEach((r, i) => entities.push(GetCommonEntity("StRobo" + i, r[0], r[1], 4, 2, undefined, Cutscene("enemy"), requiredEnemyMetadata.robo2)));
		return entities;
	}(),
    "bridge": [
        // Map Switching
        SwitchMap("GoUnderwater", 4, 14, false, false, 41, 20, "underwater"),
        GetCommonEntity("AFuckingTruckL", 28, 3, 4, 0, undefined, Cutscene("truck"), { big: true, noChange: true }),
        GetCommonEntity("AFuckingTruckR", 30, 3, 5, 0, undefined, Cutscene("truck"), { big: true, noChange: true }),
        // Shops & Falcon & Quests
        EnterShop("MermaidInn", 20, 11, "mermaidinn", directions.RIGHT),
        EnterShop("MermaidShoppe", 10, 13, "mermaid"),
        EnterShop("ConstructionShoppe", 25, 3, "cworker"),
        GetSign(9, 13, "SignMermaid"),
        GetSign(26, 3, "SignConstWork"),
        GetSign(20, 12, "SignMermaidInn"),
        { name: "Falcon1", pos: { x: 27, y: 5 }, isColumn: true, visible: false, solid: false, interact: Cutscene("falcon"), autoplay: true },
        GetCommonEntity("ConstructionManShop", 25, 3, 15, 0, undefined, undefined, { sy: 4, solid: false, noChange: true, boring: true }),
        GetCommonEntity("KelpCow", 27, 1, 10, 0, undefined, Cutscene("bridgeCow"), { sy: 4, big: true, noChange: true }),
        // Boss
        GetCommonEntity("HeadWorker", 5, 6, 8, 3, undefined, Cutscene("workerX"), { postBattle: "BeatWorkers" }),
        new CutsceneTrigger("workerF", "BeatWorkers"),
        // Mandatory Enemies
        GetCommonEntity("Worker1", 24, 5, 0, 3, undefined, Cutscene("workerA")),
        GetCommonEntity("Worker2", 21, 7, 0, 3, commonMovementDatas.rectangle(11, 5, 10, 2, 2), Cutscene("workerB"), { onlyActiveInteracts: true }),
        GetCommonEntity("Worker3", 18, 6, 0, 3, commonMovementDatas.rectangle(7, 4, 11, 2, 2), Cutscene("workerB"), { onlyActiveInteracts: true }),
        // Misc. Entities
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
        GetCommonEntity("SeaMidTop", 8, 0, 1, 1, undefined, OneSpeak("smD7"), { big: true, sy: 3, visible: false, storageKey: "smt", noChange: true, boring: true }),
        GetCommonEntity("SeaRightTop", 10, 3, 1, 2, undefined, undefined, { big: true, sy: 3, visible: false, storageKey: "srt", solid: false, boring: true }),
        new CutsceneTrigger("seaHelp", "FishMoved")
    ],
    "underwater": function() {
        let entities = [
            // Map Switching
            SwitchMap("GoAboveGround", 42, 20, false, false, 5, 14, "bridge"),
            // Beehives & Quests
            GetCommonEntity("PirateFriend", 30, 11, 14, 0, undefined, Cutscene("piratemonk"), { sy: 5, noChange: true } ),
            GetCommonEntity("PiratesTreasure", 45, 13, 13, 0, undefined, Cutscene("seamonkey"), { sy: 4, open: false, noChange: true }),
            GetCommonEntity("Vase", 45, 28, 14, 0, undefined, Cutscene("kelpVase"), { sy: 6, noChange: true, postBattle: "kelpBeat", boring: true }),
            GetCommonEntity("KelpBoy", 46, 27, 13, 0, undefined, Cutscene("kelpBoy"), { sy: 6, noChange: true, storageKey: "KelpBoy", postBattle: "kelpBeat" }),
            new CutsceneTrigger("kelpDead", "kelpBeat"),
            GetCommonEntity("KelpBeehive", 45, 27, 2, 0, undefined, Cutscene("kelpHive"), { storageKey: "meHive", sy: 4, postBattle: "beeBeat", noChange: true, isBeehive: true } ),
            new CutsceneTrigger("kelpDeadBee", "beeBeat"),
            // Boss
            GetCommonEntity("ShipLeft", 16, 17, 1, 0, undefined, undefined, { big: true, sy: 1, boring: true }),
            GetCommonEntity("ShipMiddle", 18, 17, 1, 1, undefined, undefined, { big: true, sy: 1, boring: true }),
            GetCommonEntity("ShipRight", 20, 17, 1, 2, undefined, undefined, { big: true, sy: 1, boring: true }),
            GetCommonEntity("SeaCreatureLeft", 16, 17, 1, 0, undefined, undefined, { big: true, sy: 2, boring: true }),
            GetCommonEntity("SeaCreatureMiddle", 18, 17, 1, 1, undefined, Cutscene("seamon"), { big: true, sy: 2, noChange: true, postBattle: "FishKilled" }),
            GetCommonEntity("SeaCreatureRight", 20, 17, 1, 2, undefined, undefined, { big: true, sy: 2, boring: true }),
            new CutsceneTrigger("deadsea", "FishKilled"),
            // Mandatory Enemies
            GetCommonEntity("SeaMonk1", 34, 18, 4, 2, commonMovementDatas.vertline(34, 18, 10), Cutscene("enemy"), requiredEnemyMetadata.seamonk),
            GetCommonEntity("SeaMonk3", 31, 27, 4, 3, GetStdMovement([[31, 27, 0], [32, 27, 3], [32, 29, 2], [25, 29, 1], [25, 27, 0], [28, 27, 3], [28, 28, 2], [31, 28, 3]]), Cutscene("enemy"), requiredEnemyMetadata.seamonk),
            GetCommonEntity("SeaMonk5", 32, 9, 4, 2, commonMovementDatas.vertline(32, 9, 10), Cutscene("enemy"), requiredEnemyMetadata.seamonk),
            // Misc. Entities
            GetWaterfall("waterfallAS", 36, 22, 0, "AX"), GetWaterfallEnd("wfendA", 36, 16, 0, "A"),
            GetWaterfall("waterfallBS", 32, 21, 0, "BX"), GetWaterfallEnd("wfendB", 32, 8, 0, "B"),
            GetWaterfall("waterfallCS", 13, 16, 2, "CX"), GetWaterfallEnd("wfendC", 27, 23, 3, "C"),
            GetWaterfall("waterfallDS", 8, 20, 0, "DX"), GetWaterfallEnd("wfendD", 15, 10, 3, "D"),
            GetWaterfall("waterfallES", 26, 14, 1, "EX"), GetWaterfallEnd("wfendE", 7, 14, 1, "E"),
            GetWaterfall("waterfallFS", 39, 11, 2, "FX"), GetWaterfallEnd("wfendF", 39, 18, 2, "F"),
            GetWaterfall("waterfallGS", 48, 20, 1, "GX"), GetWaterfallEnd("wfendG", 43, 20, 1, "G"),
            GetWaterfall("waterfallHS", 34, 3, 1, "HX"), GetWaterfallEnd("wfendH", 20, 3, 1, "H"),
            GetWaterfall("waterfallIS", 20, 5, 3, "IX"), GetWaterfallEnd("wfendI", 31, 5, 3, "I"),
            GetWaterfall("waterfallJS", 39, 1, 3, "JX"), GetWaterfallEnd("wfendJ", 40, 2, 1, "J"),
            GetWaterfall("waterfallKS", 46, 3, 2, "KX"), GetWaterfallEnd("wfendK", 46, 6, 2, "K"),
            GetWaterfall("waterfallLS", 46, 10, 0, "LX"), GetWaterfallEnd("wfendL", 48, 12, 2, "L"),
            GetWaterfall("waterfallMS", 43, 13, 0, "MX"), GetWaterfall("waterfallMSB", 44, 4, 2, "MX"),
            GetWaterfall("waterfallMSB0", 44, 5, 1, "M"), GetWaterfall("waterfallMSB1", 43, 5, 2, "M"),
            GetWaterfall("waterfallMSB2", 43, 6, 2, "M"), GetWaterfall("waterfallMSB3", 43, 7, 1, "M"),
            GetWaterfall("waterfallMSB4", 42, 7, 0, "M"), GetWaterfallEnd("wfendM", 39, 6, 1, "M"),
            GetTreasureChest("UWChestLeftFriend", 10, 12, [["metalrod", 6]]),
            GetTreasureChest("UWChestRightFriend", 13, 12, [["goodrod", 5]]),
            GetTreasureChest("UWChestByBoat", 21, 18, [["chestnut", 3]]),
            GetTreasureChest("UWChestHiddenByCurrent", 34, 13, [["lemon", 6]])
        ];
        for(let i = 0; i < 5; i++) { entities.push(GetWaterfall("waterfallA" + i, 36, 21 - i, 0, "A")); }
        entities.push(GetRock("rockA", 37, 21, 1, "A"));

        for(let i = 0; i < 13; i++) { entities.push(GetWaterfall("waterfallB" + i, 32, 21 - i, 0, "B")); }
        entities.push(GetRock("rockB", 31, 20, 3, "B"));
        
        for(let i = 0; i < 6; i++) { entities.push(GetWaterfall("waterfallC" + i, 13, 17 + i, 2, "C")); }
        for(let i = 0; i < 14; i++) { entities.push(GetWaterfall("waterfallCL" + i, 13 + i, 23, 3, "C")); }
        entities.push(GetRock("rockC", 12, 17, 3, "C"));
        
        for(let i = 0; i < 9; i++) { entities.push(GetWaterfall("waterfallD" + i, 8, 19 - i, 0, "D")); }
        for(let i = 0; i < 7; i++) { entities.push(GetWaterfall("waterfallDR" + i, 8 + i, 10, 3, "D")); }
        entities.push(GetRock("rockD", 7, 19, 3, "D"));

        for(let i = 0; i < 18; i++) { entities.push(GetWaterfall("waterfallE" + i, 25 - i, 14, 1, "E")); }
        entities.push(GetRock("rockE", 25, 15, 0, "E"));

        for(let i = 0; i < 6; i++) { entities.push(GetWaterfall("waterfallF" + i, 39, 12 + i, 2, "F")); }
        entities.push(GetRock("rockF", 40, 12, 1, "F"));

        for(let i = 0; i < 4; i++) { entities.push(GetWaterfall("waterfallG" + i, 47 - i, 20, 1, "G")); }
        entities.push(GetRock("rockG", 48, 19, 2, "G"));
        
        for(let i = 0; i < 13; i++) { entities.push(GetWaterfall("waterfallH" + i, 33 - i, 3, 1, "H")); }
        for(let i = 0; i < 10; i++) { entities.push(GetWaterfall("waterfallI" + i, 21 + i, 5, 3, "I")); }
        
        for(let i = 0; i < 8; i++) { entities.push(GetWaterfall("waterfallJ" + i, 40 + i, 1, 3, "I")); }
        for(let i = 0; i < 5; i++) { entities.push(GetWaterfall("waterfallJD" + i, 48, 1 + i, 2, "I")); }
        entities.push(GetWaterfall("waterfallJLA", 48, 6, 1, "I"));
        for(let i = 0; i < 4; i++) { entities.push(GetWaterfall("waterfallJU" + i, 47, 6 - i, 0, "I")); }
        for(let i = 0; i < 7; i++) { entities.push(GetWaterfall("waterfallJL" + i, 47 - i, 2, 1, "I")); }
        
        for(let i = 0; i < 2; i++) { entities.push(GetWaterfall("waterfallK" + i, 46, 4 + i, 2, "K")); }
        
        entities.push(GetWaterfall("waterfallLU", 46, 9, 0, "L"));
        for(let i = 0; i < 2; i++) { entities.push(GetWaterfall("waterfallLR" + i, 46 + i, 8, 3, "L")); }
        for(let i = 0; i < 4; i++) { entities.push(GetWaterfall("waterfallLD" + i, 48, 8 + i, 2, "L")); }
        
        for(let i = 0; i < 5; i++) { entities.push(GetWaterfall("waterfallM" + i, 43, 12 - i, 0, "M")); }
        for(let i = 0; i < 3; i++) { entities.push(GetWaterfall("waterfallML" + i, 42 - i, 6, 1, "M")); }

        return entities;
    }(),
    "fakefarm": [
        // Map Switching
        GetCommonEntity("AFuckingTruckL", 24, 34, 4, 0, undefined, Cutscene("badTruck"), { sy: 3, big: true, noChange: true, storageKey: "ltruck" }),
        GetCommonEntity("AFuckingTruckR", 26, 34, 5, 0, undefined, undefined, { big: true, noChange: true }),
        // Covers
        GetJumboToggle("BarnL", 14, 30, true), GetJumboToggle("BarnR", 15, 30, true),
        GetCommonEntity("ExitBarnL", 14, 31, 0, 0, undefined, Cutscene("exitBarn"), { boring: true, visible: false, solid: false, postBattle: "beatDweeb", dontClearTarget: true }),
        GetCommonEntity("ExitBarnR", 15, 31, 0, 0, undefined, Cutscene("exitBarn"), { visible: false, solid: false, postBattle: "beatDweeb", dontClearTarget: true }),
        GetJumbo("barnCover", "barn", 7, 18, 1036, 900, 1, 0),
        // Opening Cutscene
        GetCommonEntity("FarmerJeffOpening", 15, 35.5, 8, 3, undefined, Cutscene("flatTire"), { boring: true, sy: 10, solid: false, autoplay: true, storageKey: "FarmerJeff" }),
        GetCommonEntity("FarmTVEntrance", 10, 8, 0, 0, undefined, Cutscene("farmTV"), { boring: true, solid: false, visible: false, storageKey: "fuckOffFarmerJeff" } ),
        { pos: { x: -1, y: -1 }, innCheck: true, action: function() {
            JumboToggle(true);
            worldmap.importantEntities["barnCover"].visible = false;
            worldmap.importantEntities["FarmerJeff"].visible = true;
            worldmap.importantEntities["FarmerJeff"].pos = { x: 14.5, y: 31.5 };
            worldmap.importantEntities["FarmerJeff"].dir = 0;
        }},
        // Shops & Falcon & Quests
        { name: "Falcon2", pos: { x: 14, y: 32 }, isRow: true, visible: false, solid: false, interact: Cutscene("falcon") },
        GetSign(4, 30, "upgradeBarn"),
        EnterShop("UpgradeBarn", 3, 30, "upgrade2"),
        EnterShop("FixtureStall", 19, 21, "fixture2"),
        GetCommonEntity("Crouton", 26, 30, 0, 0, undefined, Cutscene("crouton"), { visible: false }),
        GetCommonEntity("TireRack", 11, 3, 8, 0, undefined, [
            function() {
                if(player.hasQuest("gotTire") || player.completedQuest("gotTire")) { worldmap.finishDialog(); return; }
                game.target.anim.shiftY(9);
                worldmap.writeText("tireget");
                worldmap.importantEntities["HK"].visible = true;
                worldmap.importantEntities["HK"].solid = true;
                player.activeQuests["gotTire"] = 0;
                player.activeQuests["truckRepair"] = 1;
            }
        ], { sy: 8, noChange: true, storageKey: "tire" }),
        // Boss
        GetCommonEntity("FarmTV", 14, 2, 5, 0, undefined, undefined, { boring: true, sy: 1, big: true, sheetlen: 2, moving: true, storageKey: "FarmTV" } ),
        GetCommonEntity("Outlet", 13, 2, 5, 0, undefined, Cutscene("outlet"), { sy: 12, noChange: true, storageKey: "outlet" } ),
        GetCommonEntity("MrShocky", 10, 9, 7, 0, undefined, undefined, { boring: true, sy: 12, sheetlen: 2, moving: true, visible: false, solid: false, storageKey: "MrShocky", changeType: 7 }), // 7 = becomes visible/solid
        GetCommonEntity("Hotbox", 9, 8, 4, 0, undefined, Cutscene("hotbox"), { sy: 13, noChange: true, noRunKill: true, postBattle: "HotBoxEnd" }),
        new CutsceneTrigger("hotBoxEnd", "HotBoxEnd"),
        GetCommonEntity("HOUSEKEEPER", 13, 30, 17, 0, undefined, Cutscene("housekeeper"), { boss: true, visible: false, inside: true, storageKey: "HK", sy: 5, noChange: true } ),
        new CutsceneTrigger("beatBarn", "beatDweeb"),
        // Mandatory Enemies
        GetCommonEntity("LawnMower", 9, 27, 4, 3, undefined, Cutscene("mower"), requiredEnemyMetadata.mower(5)), // 5 = bigger LtR
        GetCommonEntity("LawnMower", 20, 28, 4, 1, undefined, Cutscene("mower"), requiredEnemyMetadata.mower(6)), // 6 = bigger RtL
        // Misc. Entities
        GetCommonEntity("CoveredDoorL1", 11, 15, 6, 0, undefined, OneSpeak("barndoorChick"), { sy: 12, noChange: true, solid: true, changeType: 0 }), // 0 = open door
        GetCommonEntity("CoveredDoorL2", 11, 18, 6, 0, undefined, OneSpeak("barndoorPig"), { sy: 12, noChange: true, solid: true, changeType: 0 }),
        GetCommonEntity("CoveredDoorL3", 11, 21, 6, 0, undefined, OneSpeak("barndoorChick"), { sy: 12, noChange: true, solid: true, changeType: 0 }),
        GetCommonEntity("CoveredDoorL4", 11, 24, 6, 0, undefined, OneSpeak("barndoorCrop"), { visible: false, inside: true, sy: 12, noChange: true, solid: true, changeType: 0 }),
        GetCommonEntity("CoveredDoorR1", 18, 15, 6, 0, undefined, OneSpeak("barndoorEmpty"), { sy: 13, noChange: true, solid: true, changeType: 0 }),
        GetCommonEntity("CoveredDoorR2", 18, 18, 6, 0, undefined, OneSpeak("barndoorChick"), { sy: 13, noChange: true, solid: true, changeType: 0 }),
        GetCommonEntity("CoveredDoorR3", 18, 21, 6, 0, undefined, OneSpeak("barndoorShop"), { sy: 13, noChange: true, solid: true, changeType: 0 }),
        GetCommonEntity("CoveredDoorR4", 18, 24, 6, 0, undefined, OneSpeak("barndoorPig"), { visible: false, inside: true, sy: 13, noChange: true, solid: true, changeType: 0 })
    ],
    "southcity": [
        // Map Switches
        SwitchMap("GoNorth", 44, 0, true, false, 8.5, 50, "northcity"),
        GetCommonEntity("AFuckingTruckL", 52, 48, 4, 0, undefined, Cutscene("truck"), { big: true, noChange: true }),
        GetCommonEntity("AFuckingTruckR", 54, 48, 5, 0, undefined, Cutscene("truck"), { big: true, noChange: true }),
        // Covers
        GetJumbo("skumpyCover", "skumpy", 36, 39, 396, 256, 1, 1),
        GetJumbo("mobCover", "mob", 9, 27, 772, 512, 0, 0),
        GetJumboToggle("Mob", 15, 33, true), GetJumboToggle("Mob", 15, 34, false),
        // Opening Cutscene
        GetCommonEntity("Skumpy", 41, 42, 12, 0, undefined, undefined, { sy: 8, moving: true, sheetlen: 2, solid: false, storageKey: "skumpy", inside: true, visible: false, boring: true }),
        GetCommonEntity("BarL", 39, 39.875, 15, 0, undefined, undefined, { sy: 5, inside: true, visible: false, boring: true }),
        GetCommonEntity("BarM", 40, 39.875, 16, 0, undefined, undefined, { sy: 5, inside: true, visible: false, boring: true }),
        GetCommonEntity("BarR", 41, 39.875, 16, 0, undefined, undefined, { sy: 5, inside: true, visible: false, boring: true }),
        GetCommonEntity("Bruno", 44, 33, 12, 2, undefined, undefined, { sy: 10, moving: true, solid: false, storageKey: "bruno", inside: true, boring: true }),
        GetCommonEntity("IntroSkumpyCutscene", 43, 40, 0, 0, undefined, Cutscene("southcity"), { visible: false, solid: false, isRow: true, nonStandardGameOver: "brunoKill", postBattle: "beatBruno", storageKey: "introCutscene", boring: true }),
        new CutsceneTrigger("beatbruno", "BeatBruno"),
        // Shops & Falcon & Quests
        { name: "Falcon3", pos: { x: 44, y: 46 }, isRow: true, visible: false, solid: false, interact: Cutscene("falcon") },
        EnterShop("Skumpys", 41, 42, "skumpys"),
        EnterShop("ManTools", 52, 32, "mantools"),
        EnterShop("SeedShack", 65, 40, "seedshack"),
        EnterShop("Catalinas", 67, 32, "catalinas"),
        EnterShop("TinkerTierra", 50, 12, "tinker"),
        EnterShop("PawnShop", 56, 21, "pawn"),
        EnterShop("Church", 38, 14, "church"),
        GetSign(57, 22, "SignPawn"),
        GetCommonEntity("Abuela", 34, 20, 17, 0, undefined, Cutscene("abuela"), { sy: 4, noChange: true }),
        // Boss
        GetCommonEntity("MobBoss", 20, 27, 0, 2, undefined, Cutscene("mobBoss"), { sy: 18, inside: true, visible: false, boss: true, postBattle: "BeatMob", failedInteract: Cutscene("mobLost") }),
        new CutsceneTrigger("mobWon", "BeatMob"),
        // Mandatory Enemies
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
        // Misc. Entities        
        GetCommonEntity("Pigeon1", 30, 22, 14, 0, undefined, undefined, { sy: 8, sheetlen: 2, moving: true, boring: true }),
        GetCommonEntity("Pigeon2", 36, 21, 13, 0, undefined, undefined, { sy: 8, sheetlen: 2, moving: true, boring: true }),
        GetCommonEntity("Pigeon3", 33, 22, 14, 0, undefined, undefined, { sy: 8, sheetlen: 2, moving: true, boring: true })
    ],
    "northcity": [
        // Map Switches
        SwitchMap("GoSouth", 8, 52, true, false, 44.5, 1, "southcity"),
        GetCommonEntity("Food2Entrance", 39, 9, 0, 0, undefined, Cutscene("foodDoor"), { boring: true, visible: false, solid: true }),
        SwitchMap("EnterFood2", 39, 8, false, false, 15, 29, "hq_1"),
        // Covers
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
        // Opening Cutscene
        new AutoplayCutscene("newPhone"),
        // Shops
        EnterShop("CityFixturesL", 15, 43, "cityFixtures"),
        EnterShop("CityFixturesR", 16, 43, "cityFixtures"),
        EnterShop("HotelL", 34, 43, "cityInn"),
        EnterShop("HotelR", 35, 43, "cityInn"),
        EnterShop("GordonsFarm", 43, 43, "gordonsFarming"),
        EnterShop("CityExpandL", 24, 9, "cityExpansions"),
        EnterShop("CityExpandR", 25, 9, "cityExpansions"),
        EnterShop("CityTech", 55, 9, "cityTech"),
        GetCommonEntity("crazy4trout", 34, 17, 0, 2, undefined, Cutscene("crazy4trout"), { sy: 14, visible: false, inside: true }),
        GetCommonEntity("EggBoy", 58, 30, 17, 0, undefined, Cutscene("eggBoy"), { sy: 13, noChange: true }),
        // Beehive & Falcon & Quests
        { name: "Falcon4", pos: { x: 8, y: 44 }, isRow: true, visible: false, solid: false, interact: Cutscene("falcon") },
        GetBeehive("OfficeHive", 55, 32, true),
        GetCommonEntity("Mailman", 25, 20, 24, 0, undefined, Cutscene("mailman"), { sy: 15, sheetlen: 2, noChange: true, inside: true, visible: false }),
        GetCommonEntity("MushMan", 16, 22, 15, 0, undefined, Cutscene("mushman"), { noChange: true, sy: 6, visible: false, inside: true }),
        GetCommonEntity("brandt", 54, 22, 15, 0, undefined, Cutscene("brandt"), { noChange: true, sy: 8, visible: false, inside: true }),
        // Treasure
        GetIndoorTreasureChest("NCChest1", 21, 20, [["lemon", 5]]),
        GetIndoorTreasureChest("NCChest2", 37, 22, [["arborio", 5], ["rice", 5]]),
        GetIndoorTreasureChest("NCChest3", 24, 15, [["goose", 6]]),
        GetIndoorTreasureChest("NCChest4", 54, 15, [["coffee", 4]]),
        GetIndoorTreasureChest("NCChest5", 57, 15, [["ginger", 6]]),
        GetCommonEntity("freeRadish", 13, 15, 0, 0, undefined, Cutscene("freeRadish"), { visible: false }),
        // Boss
        GetCommonEntity("BottomWall1", 42, 26, 23, 0, undefined, undefined, { boring: true, visible: false, inside: true, sy: 6, destroyable: true }),
        GetCommonEntity("BottomWall2", 43, 26, 23, 0, undefined, undefined, { boring: true, visible: false, inside: true, sy: 5, destroyable: true }),
        GetCommonEntity("BottomWall3", 45, 26, 23, 0, undefined, undefined, { boring: true, visible: false, inside: true, sy: 4, destroyable: true }),
        GetCommonEntity("BottomWall4", 46, 26, 23, 0, undefined, undefined, { boring: true, visible: false, inside: true, sy: 6, destroyable: true }),
        GetCommonEntity("BottomWall5", 47, 26, 23, 0, undefined, undefined, { boring: true, visible: false, inside: true, sy: 6, destroyable: true }),
        GetCommonEntity("RealSleepyHoursWhoUp", 43, 15, 23, 0, undefined, undefined, { boring: true, nochange: true, inside: true, visible: false, storageKey: "dweeb" }),
        GetCommonEntity("Keycard", 45, 15, 23, 0, undefined, Cutscene("keycard"), { sy: 2, nochange: true, inside: true, visible: false }),
        GetCommonEntity("KeycardTrap", 44, 19, 0, 0, undefined, Cutscene("keytrap"), { isRow: true, solid: false, visible: false, storageKey: "keytrap", postBattle: "scrungus" }),
        GetCommonEntity("Mabingy", 44, 25.25, 0, 0, undefined, Cutscene("keyfail"), { boring: true, sy: 3, big: true, solid: false, visible: false, storageKey: "mech", postBattle: "scrungus" }),
        new CutsceneTrigger("keywin", "scrungus"),
        // Bank Robbery
        GetCommonEntity("Hazard", 12, 11, 0, 0, undefined, undefined, { boring: true, big: true, noChange: true, sy: 1, robbery: true }),
        GetCommonEntity("Hazard2", 0, 11, 0, 0, undefined, undefined, { boring: true, big: true, noChange: true, sy: 1, robbery: true }),
        GetCommonEntity("Officer1", 9, 13, 16, 0, undefined, OneSpeak("officer1"), { noChange: true, sy: 10, robbery: true }),
        GetCommonEntity("Officer2", 7, 10, 8, 0, undefined, OneSpeak("officer2"), { noChange: true, sy: 15, robbery: true }),
        GetCommonEntity("Officer3", 10, 11, 8, 2, undefined, OneSpeak("officer4"), { noChange: true, sy: 15, robbery: true }),
        GetCommonEntity("Officer4", 3, 11, 16, 1, undefined, OneSpeak("officer3"), { noChange: true, sy: 10, robbery: true }),
        GetCommonEntity("ConeThing1L", 2, 7, 16, 0, undefined, undefined, { boring: true, sy: 11, inside: true, visible: false }),
        GetCommonEntity("ConeThing1R", 3, 7, 16, 1, undefined, undefined, { boring: true, sy: 11, inside: true, visible: false }),
        GetCommonEntity("ConeThing2L", 10, 6, 16, 0, undefined, undefined, { boring: true, sy: 12, inside: true, visible: false }),
        GetCommonEntity("ConeThing2R", 11, 6, 16, 1, undefined, undefined, { boring: true, sy: 12, inside: true, visible: false }),
        GetCommonEntity("Robber1", 6, 5, 8, 3, undefined, Cutscene("robber"), { sy: 14, inside: true, visible: false, robbery: true, postBattle: "PostRobbers" }),
        GetCommonEntity("Robber2", 9, 3, 8, 0, undefined, Cutscene("robber"), { sy: 14, inside: true, visible: false, robbery: true, postBattle: "PostRobbers" }),
        new CutsceneTrigger("strobbery", "PostRobbers"),
        // The Underground Man
        GetCommonEntity("UndergroundMan", 16, 6, 16, 0, undefined, OneSpeak("undergroundNotYet"), { sy: 6, noChange: true, visible: false, inside: true } ),
        GetCommonEntity("UndergroundHole", 17, 6, 16, 0, undefined, undefined, { sy: 7, visible: false, inside: true, boring: true } ),
        // Dweeb Bank
        GetCommonEntity("atm0", 22, 34, 15, 0, undefined, Cutscene("atm"), { noChange: true, inside: true, visible: false, sy: 9 }),
        GetCommonEntity("atm1", 23, 34, 15, 0, undefined, Cutscene("atm"), { noChange: true, inside: true, visible: false, sy: 9 }),
        GetCommonEntity("atm2", 24, 34, 15, 0, undefined, Cutscene("atm"), { noChange: true, inside: true, visible: false, sy: 9 }),
        GetCommonEntity("atm3", 25, 34, 15, 0, undefined, Cutscene("atm"), { noChange: true, inside: true, visible: false, sy: 9 }),
        GetCommonEntity("atm4", 26, 34, 15, 0, undefined, Cutscene("atm"), { noChange: true, inside: true, visible: false, sy: 9 }),
        GetCommonEntity("atm5", 27, 34, 15, 0, undefined, Cutscene("atm"), { noChange: true, inside: true, visible: false, sy: 9 }),
        GetCommonEntity("atm6", 28, 34, 15, 0, undefined, Cutscene("atm"), { noChange: true, inside: true, visible: false, sy: 9 }),
        GetCommonEntity("cashboy0", 23, 39, 4, 3, undefined, Cutscene("cashBoy"), { inside: true, visible: false, sy: 15 }),
        GetCommonEntity("cashboy1", 27, 37, 4, 2, undefined, Cutscene("cashBoy"), { inside: true, visible: false, sy: 15 }),
        // People
        GetCommonEntity("SomeNerd", 15, 17, 0, 3, undefined, Cutscene("someNerd"), { sy: 15, visible: false, inside: true }),
        GetCommonEntity("SomeNerd2", 22, 15, 0, 2, undefined, OneSpeak("bathroomNerd"), { sy: 15, visible: false, inside: true }),
        GetCommonEntity("OfficeLady", 54, 35, 4, 1, undefined, Cutscene("officeLady"), { sy: 16, visible: false, inside: true }),
        GetCommonEntity("CorpseBuddy", 55, 17, 16, 0, undefined, OneSpeak("corpseBuddy"), { sy: 13, noChange: true, visible: false, inside: true, boring: true }),
        GetCommonEntity("CityMonk", 36, 22, 4, 2, undefined, Cutscene("cityMonk"), { sy: 8, visible: false, inside: true }),
        // Misc. Entities
        GetCommonEntity("LavaLamp", 15, 20.25, 22, 0, undefined, undefined, { boring: true, inside: true, sheetlen: 6, visible: false, moving: true }),
        GetCommonInvisibleSpeakingEntity("fridge", 18, 21, "mushFridge"),
        GetCommonInvisibleSpeakingEntity("fridge2", 12, 15, "mushFridge"),
        GetCommonInvisibleSpeakingEntity("mushGame", 17, 21, "mushGame"),
        GetCommonInvisibleSpeakingEntity("mushPosterL", 13, 20, "mushPoster"),
        GetCommonInvisibleSpeakingEntity("mushPosterR", 14, 20, "mushPoster"),
        GetCommonInvisibleSpeakingEntity("mushLamp", 15, 20, "mushLamp"),
        GetCommonInvisibleSpeakingEntity("billU", 17, 16, "rentBill"),
        GetCommonInvisibleSpeakingEntity("billB", 17, 17, "rentBill"),
        GetCommonInvisibleSpeakingEntity("bed1L", 18, 19, "someonesBed"),
        GetCommonInvisibleSpeakingEntity("bed1R", 19, 19, "someonesBed"),
        GetCommonInvisibleSpeakingEntity("bed2U", 19, 22, "someonesBed"),
        GetCommonInvisibleSpeakingEntity("bed2B", 19, 23, "someonesBed"),
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
        GetCommonEntity("12thSt", 4, 43, 7, 0, undefined, undefined, { boring: true, big: true }),
        GetCommonEntity("13thSt", 4, 26, 7, 0, undefined, undefined, { boring: true, big: true, sy: 1 }),
        GetCommonEntity("14thSt", 2, 9, 7, 0, undefined, undefined, { boring: true, big: true, sy: 2 }),
        GetSign(24, 19, "forRentSign")
    ],
    "hq_1": function() {
        const entities = [
            // Map Switches
            SwitchMap("GoUpstairs", 5.5, 1, true, false, 5, 2, "hq_2"),
            SwitchMap("Leave", 15, 30, false, false, 39, 10, "northcity"),
            GetCommonEntity("ElevatorL", 11, 2, 0, 0, undefined, Cutscene("elevator"), { visible: false, isElevator: true }),
            GetCommonEntity("ElevatorR", 12, 2, 0, 0, undefined, Cutscene("elevator"), { visible: false, isElevator: true }),
            // Falcon & Treasure
            { name: "Falcon5", pos: { x: 15, y: 27 }, isRow: true, visible: false, solid: false, interact: Cutscene("falcon") },
            GetTreasureChest("HQ1Chest1", 1, 26, [["spear", 20]]),
            GetTreasureChest("HQ1Chest2 ", 17, 3, [["goodrod", 10]]),
            GetTreasureChest("HQ1Chest3", 1, 19, [["metalrod", 10]]),
            GetTreasureChest("HQ1Chest4", 14, 4, [["rod", 12]]),
            // Mandatory Enemies
            GetCommonEntity("RegNerd2", 1, 16, 4, 0, undefined, Cutscene("enemy"), requiredEnemyMetadata.tinyNerd),
            GetCommonEntity("HQ1Robo1", 27, 9, 16, 3, undefined, Cutscene("enemy"), requiredEnemyMetadata.roboGuard),
            // Talky Entities
            GetCommonEntity("Receptionist", 15.25, 23.375, 19, 0, undefined, undefined, { sy: 12 }),
            GetCommonEntity("ReceptionistTalky", 15, 24, 19, 0, undefined, Cutscene("food2Start"), { boring: true, visible: false }),
            GetCommonEntity("fuzurusenpai", 16.5, 16.25, 8, 0, undefined, undefined, { noChange: true, sy: 1, sheetlen: 3, storageKey: "ed" }),
            GetCommonEntity("fuzuruL", 16, 16, 0, 0, undefined, Cutscene("apuru"), { visible: false, boring: true }),
            GetCommonEntity("fuzuruR", 17, 16, 0, 0, undefined, Cutscene("apuru"), { visible: false, boring: true }),
            GetCommonEntity("hungryboy", 14, 13, 11, 0, undefined, Cutscene("hungy"), { noChange: true, sy: 1, sheetlen: 2, moving: true }),
            GetCommonEntity("hungyBinU", 14, 11, 0, 0, undefined, Cutscene("hungyBin"), { visible: false, boring: true }),
            GetCommonEntity("hungyBinB", 14, 12, 0, 0, undefined, Cutscene("hungyBin"), { visible: false, boring: true }),
            // Misc. Entities
            GetCommonEntity("HQBed1", 11, 9, 0, 0, undefined, Cutscene("hqBed"), { visible: false, isInn: true }),
            GetCommonEntity("HQBed2", 12, 9, 0, 0, undefined, Cutscene("hqBed"), { visible: false, isInn: true }),
            GetCommonEntity("HQBed3", 13, 9, 0, 0, undefined, Cutscene("hqBed"), { visible: false, isInn: true }),
            GetCommonEntity("HQBed4", 14, 9, 0, 0, undefined, Cutscene("hqBed"), { visible: false, isInn: true }),
            GetCommonEntity("droppybottle1", 29, -1, 8, 2, commonMovementDatas.fuckinBottle(29, -1, 3, 10), undefined, { solid: false, forcedY: 15, noChange: true, sy: 4, sheetlen: 1 } ),
            GetCommonEntity("droppybottle2", 29, -11, 8, 2, commonMovementDatas.fuckinBottle(29, -11, 3, 21), undefined, { solid: false, forcedY: 15, noChange: true, sy: 4, sheetlen: 1 } ),
            GetCommonEntity("droppybottle3", 29, -6, 8, 2, commonMovementDatas.fuckinBottle(29, -6, 3, 17), undefined, { solid: false, forcedY: 15, noChange: true, sy: 4, sheetlen: 1 } ),
            GetCommonEntity("Chair1", 11, 25, 18, 0, undefined, undefined, { boring: true, sy: 11 }),
            GetCommonEntity("Chair2", 11, 27, 18, 0, undefined, undefined, { boring: true, sy: 11 }),
            GetCommonEntity("Chair3", 19, 25, 19, 0, undefined, undefined, { boring: true, sy: 11 }),
            GetCommonEntity("Chair4", 19, 27, 19, 0, undefined, undefined, { boring: true, sy: 11 }),
            GetCommonEntity("CompyL", 14, 23.375, 20, 0, undefined, undefined, { boring: true, sy: 11 }),
            GetCommonEntity("CompyR", 15, 23.375, 21, 0, undefined, undefined, { boring: true, sy: 11 }),
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
            GetCommonEntity("hqCompCover4", 18, 16, 22, 1, undefined, undefined, { forcedY: 29, sy: 7, solid: false, boring: true })
        ];
        const doors = [ [20, 10, 0, false], [7, 10, 0, true],  [20, 3, 1, false], [25, 7, 1, true], [18, 6, 1, false], [17, 14, 1, true], [15, 8, 1, false],
                 [4, 17, 1, true], [10, 17, 1, false], [4, 8, 2, false], [4, 12, 2, true], [10, 12, 2, false], [7, 14, 2, true] ];
        doors.forEach((d, i) => entities.push(GetRFDoor("Door" + i, d[0], d[1], d[2], d[3])));
        const buttons = [ [24, 4, 0, false], [1, 15, 0, false], [10, 8, 1, false], [26, 4, 1, false], [19, 19, 1, false], [1, 8, 2, false] ];
        buttons.forEach((b, i) => entities.push(GetRFDoorButton("Btn" + i, b[0], b[1], b[2], b[3])));
        const lookables = [ [3, 24, "smartDesk"], [4, 24, "smartDesk"], [5, 24, "smartDesk"], [6, 24, "smartDesk"], [7, 24, "smartDesk"],
                          [3, 25, "smartDesk"], [3, 26, "smartDesk"], [7, 25, "smartDesk"], [7, 26, "smartDesk"],
                          [3, 27, "smartDesk"], [4, 27, "smartDesk"], [5, 27, "smartDesk"], [6, 27, "smartDesk"], [7, 27, "smartDesk"],
                          [2, 22, "secondMonitor"], [3, 22, "secondMonitor"], [4, 22, "secondMonitor"], [5, 22, "secondMonitor"],
                          [6, 22, "whiteboard"], [7, 22, "whiteboard"], [8, 22, "whiteboard"], [26, 21, "theFirstBottle"],
                          [26, 22, "theFirstBottle"], [27, 22, "theFirstBottle"], [28, 22, "theFirstBottle"], [26, 29, "theFirstBottle"] ];
        lookables.forEach((l, i) => entities.push(GetCommonInvisibleSpeakingEntity("Invis" + i, l[0], l[1], l[2])));
        return entities;
    }(),
    "hq_2": function() {
        const entities = [
            // Map Switches
            SwitchMap("GoUpstairsL", 24, 1, false, false, 24.5, 2, "hq_3"),
            SwitchMap("GoUpstairsR", 25, 1, false, false, 24.5, 2, "hq_3"),
            SwitchMap("GoDownstairsL", 5, 1, false, false, 5.5, 2, "hq_1"),
            SwitchMap("GoDownstairsR", 6, 1, false, false, 5.5, 2, "hq_1"),
            GetCommonEntity("ElevatorL", 11, 2, 0, 0, undefined, Cutscene("elevator"), { visible: false, isElevator: true }),
            GetCommonEntity("ElevatorR", 12, 2, 0, 0, undefined, Cutscene("elevator"), { visible: false, isElevator: true }),
            // Treasure
            GetTreasureChest("HQ2Chest1", 9, 6, [["greenshroom", 20]]),
            GetTreasureChest("HQ2Chest2", 15, 27, [["blackshroom", 20]]),
            GetTreasureChest("HQ2Chest3", 15, 28, [["poisnshroom", 20]]),
            GetTreasureChest("HQ2Chest4", 12, 17, [["poisnshroom", 20]]),
            GetTreasureChest("HQ2Chest5", 17, 24, [["blackrice", 20]]),
            GetTreasureChest("HQ2Chest6", 14, 21, [["shortgrain", 20]]),
            // Mandatory Enemies
            GetCommonEntity("HQ2BuffNerd1", 12, 28, 8, 2, undefined, Cutscene("enemy"), requiredEnemyMetadata.buffNerd),
            // Waterfalls
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
            GetWaterfall("tech_waterfallT", 23, 17, 3, "T", true)
        ];
        for(let i = 11; i < 17; i++) { entities.push(GetWaterfall("tech_waterfallB" + i, 1, i, 2, "B", true)); }
        for(let i = 2; i < 11; i++) { entities.push(GetWaterfall("tech_waterfallF" + i, i, 19, 3, "F", true)); }
        for(let i = 16; i < 27; i++) { entities.push(GetWaterfall("tech_waterfallG" + i, 9, i, 0, "G", true)); }
        for(let i = 14; i < 19; i++) { entities.push(GetWaterfall("tech_waterfallK" + i, i, 9, 1, "K", true)); }
        for(let i = 14; i < 19; i++) { entities.push(GetWaterfall("tech_waterfallL" + i, i, 4, 1, "L", true)); }
        for(let i = 5; i < 17; i++) { entities.push(GetWaterfall("tech_waterfallO" + i, i, 25, 1, "O", true)); }
        for(let i = 20; i < 23; i++) { entities.push(GetWaterfall("tech_waterfallP" + i, 18, i, 0, "P", true)); }
        for(let i = 20; i < 27; i++) { entities.push(GetWaterfall("tech_waterfallQ" + i, 21, i, 2, "Q", true)); }
        for(let i = 16; i < 24; i++) { entities.push(GetWaterfall("tech_waterfallR" + i, i, 21, 3, "R", true)); }
        for(let i = 16; i < 21; i++) { entities.push(GetWaterfall("tech_waterfallS" + i, 13, i, 0, "S", true)); }
        for(let i = 16; i < 25; i++) { entities.push(GetWaterfall("tech_waterfallU" + i, 26, i, 2, "U", true)); }
        for(let i = 16; i < 25; i++) { entities.push(GetWaterfall("tech_waterfallV" + i, 28, i, 2, "V", true)); }
        for(let i = 14; i < 20; i++) { entities.push(GetWaterfall("tech_waterfallX" + i, 29, i, 0, "X", true)); }
        entities.push(GetWaterfall("tech_waterfallW", 28, 20, 3, "W", true));

        const lookables = [ [18, 13, "coffeeBottle"], [18, 14, "coffeeBottle"], [19, 14, "coffeeBottle"], [20, 14, "coffeeBottle"], [20, 13, "coffeeBottle"],
                          [27, 8, "gamerBottle"], [28, 8, "gamerBottle"], [29, 8, "gamerBottle"] ];
        lookables.forEach((l, i) => entities.push(GetCommonInvisibleSpeakingEntity("Invis" + i, l[0], l[1], l[2])));
        return entities;
    }(),
    "hq_3": function() {
        const entities = [
            // Map Switches
            SwitchMap("GoDownstairsL", 24, 1, false, false, 24.5, 2, "hq_2"),
            SwitchMap("GoDownstairsR", 25, 1, false, false, 24.5, 2, "hq_2"),
            SwitchMap("GoUpstairsL", 5, 1, false, false, 5.5, 2, "hq_4"),
            SwitchMap("GoupstairsR", 6, 1, false, false, 5.5, 2, "hq_4"),
            GetCommonEntity("ElevatorL", 11, 2, 0, 0, undefined, OneSpeak("elevator3"), { visible: false, isElevator: true }),
            GetCommonEntity("ElevatorR", 12, 2, 0, 0, undefined, OneSpeak("elevator3"), { visible: false, isElevator: true }),
            // Ceiling Whatsits
            GetChungus(0, 0, 15, 0, 297, 119), GetChungus(1, 0, 15, 119, 73, 192), GetChungus(2, 0, 15, 311, 185, 154), GetChungus(3, 0, 200, 375, 112, 90), 
            GetChungus(4, 0, 312, 263, 112, 160), GetChungus(5, 0, 424, 263, 57, 96), GetChungus(6, 0, 312, 103, 64, 106), GetChungus(7, 0, 88, 119, 96, 192),
            GetChungus(7, 1, 184, 151, 16, 160), GetChungus(8, 0, 200, 119, 64, 96), GetChungus(8, 1, 184, 119, 16, 32), GetChungus(9, 0, 200, 215, 112, 160),
            GetChungus(9, 1, 264, 119, 48, 96), GetChungus(10, 0, 312, 423, 89, 42), GetChungus(10, 1, 401, 439, 80, 26), GetChungus(11, 0, 424, 359, 57, 58),
            GetChungus(11, 1, 447, 417, 34, 22), GetChungus(12, 0, 376, 167, 105, 96), GetChungus(12, 1, 312, 231, 64, 32), GetChungus(13, 0, 312, 0, 169, 103),
            GetChungus(13, 1, 376, 103, 105, 64),
            { id: "StartChungus", chungi: [13], autoplay: true, interact: [ function() { 
                if(worldmap.horRor === null) {
                    const startingRoom = worldmap.pos.x < 10 ? 0 : 13;
                    worldmap.horRor = new HorRor(startingRoom);
                    ToggleChungus(true, { chungi: [startingRoom] });
                    Cutscene("food2Third")[0]();
                } else {
                    const startingRoom = worldmap.horRor.playerRoom;
                    ToggleChungus(true, { chungi: [startingRoom] });
                }
                return true;
            } ], pos: { x: -1, y: -1 } },
            // Treasure
            GetTreasureChest("HQ3Chest1", 29, 23, [["apricot", 10]]),
            GetTreasureChest("HQ3Chest2", 20, 17, [["arborio", 10]]),
            GetTreasureChest("HQ3Chest3", 13, 24, [["platypus", 5]]),
            GetTreasureChest("HQ3Chest4", 16, 16, [["goose", 5]]),
            GetTreasureChest("HQ3Chest5", 18, 8, [["frogbot", 8]]),
            GetTreasureChest("HQ3Chest6", 15, 12, [["platypus", 5]]),
            GetTreasureChest("HQ3Chest7", 15, 11, [["kiwi", 2]]),
            GetTreasureChest("HQ3Chest8", 11, 18, [["kiwi", 2]]),
            GetTreasureChest("HQ3Chest9", 5, 28, [["kiwi", 2]]),
            GetTreasureChest("HQ3Chest10", 9, 22, [["platypus", 5]]),
            GetTreasureChest("HQ3Chest11", 9, 23, [["goose", 5]]),
            GetTreasureChest("HQ3Chest12", 18, 6, [["kiwi", 2]]),
            // Boss
            GetCommonEntity("HurtWorker", 24, 27, 20, 0, undefined, Cutscene("hurtNerd"), { sy: 16, noChange: true, sheetlen: 2, storageKey: "trent" }),
            GetCommonEntity("TheMonster", -1, -1, 0, 0, undefined, undefined, { nonStandardGameOver: "lostToMonster", postBattle: "beatTheMonster", storageKey: "theMonster", boring: true }),
            new CutsceneTrigger("monstLost", "beatTheMonster"),
            // Misc. Entities
            GetCommonEntity("PodBaby1", 1.5, 20.75, 20, 1, undefined, undefined, { sy: 16, noChange: true, sheetlen: 2, moving: true }),
            GetCommonEntity("PodBaby2", 1.5, 24.75, 20, 2, undefined, undefined, { sy: 16, noChange: true, sheetlen: 2, moving: true }),
            GetCommonEntity("PodBaby3", 1.5, 27.25, 20, 3, undefined, undefined, { sy: 16, noChange: true, sheetlen: 2, moving: true })
        ];
        const doors = [ 
            { x: 21, y: 5, dx: 0, dy: 1, doors: [13, 6] }, { x: 28, y: 9, dx: 0, dy: 1, doors: [13, 12] }, { x: 29, y: 15, dx: 0, dy: 1, doors: [12, 5] },
            { x: 28, y: 21, dx: 0, dy: 1, doors: [5, 11] }, { x: 29, y: 26, dx: 0, dy: 1, doors: [11, 10] }, { x: 21, y: 15, dx: 0, dy: 1, doors: [12, 4] },
            { x: 21, y: 25, dx: 0, dy: 1, doors: [4, 10] }, { x: 1, y: 6, dx: 0, dy: 1, doors: [0, 1] }, { x: 6, y: 18, dx: 0, dy: 1, doors: [7, 2] },
            { x: 13, y: 12, dx: 0, dy: 1, doors: [8, 9] }, { x: 16, y: 22, dx: 0, dy: 1, doors: [9, 3] }, { x: 22, y: 11, dx: 1, dy: 0, doors: [6, 12] },
            { x: 25, y: 17, dx: 1, dy: 0, doors: [4, 5] }, { x: 18, y: 10, dx: 1, dy: 0, doors: [9, 6] }, { x: 15, y: 9, dx: 1, dy: 0, doors: [8, 9] },
            { x: 10, y: 8, dx: 1, dy: 0, doors: [7, 8] }, { x: 4, y: 14, dx: 1, dy: 0, doors: [1, 7] }, { x: 11, y: 15, dx: 1, dy: 0, doors: [7, 9] },
            { x: 11, y: 20, dx: 1, dy: 0, doors: [2, 9] }, { x: 11, y: 26, dx: 1, dy: 0, doors: [2, 3] }, { x: 18, y: 27, dx: 1, dy: 0, doors: [3, 10] },
            { x: 25, y: 25, dx: 1, dy: 0, doors: [4, 11] }
        ];
        for(let i = 0; i < doors.length; i++) { 
            const door = doors[i];
            entities.push(GetChungusDoor(i, door.x, door.y, [door.doors[0]]));
            entities.push(GetChungusDoor(i, door.x + door.dx, door.y + door.dy, door.doors, (door.dx > 0 ? 1 : 0)));
            entities.push(GetChungusDoor(i, door.x + door.dx * 2, door.y + door.dy * 2, [door.doors[1]]));
        }
        const lookables = [ [2, 20, "soybeanBaby"], [2, 21, "soybeanBaby"], [2, 22, "brokenIncubator"], [2, 23, "brokenIncubator"], [2, 24, "kelpFishBaby"],
                          [2, 25, "kelpFishBaby"], [2, 27, "veggieGolemBaby"], [2, 28, "veggieGolemBaby"], [22, 19, "crispyBottle"], [22, 20, "crispyBottle"],
                          [23, 20, "crispyBottle"], [24, 20, "crispyBottle"], [24, 19, "crispyBottle"], [9, 12, "salsaBottle"], [9, 13, "salsaBottle"], [10, 13, "salsaBottle"],
                          [11, 13, "salsaBottle"], [2, 10, "cookiesBottle"], [2, 11, "cookiesBottle"], [3, 11, "cookiesBottle"], [4, 11, "cookiesBottle"] ];
        lookables.forEach((l, i) => entities.push(GetCommonInvisibleSpeakingEntity("Invis" + i, l[0], l[1], l[2])));
        return entities;
    }(),
    "hq_4": function() {
        const entities = [
            // Map Switches
            SwitchMap("GoDownstairsL", 5, 1, false, false, 5.5, 2, "hq_3"),
            SwitchMap("GoDownstairsR", 6, 1, false, false, 5.5, 2, "hq_3"),
            SwitchMap("GoUpstairsL", 24, 1, false, false, 8, 51, "hq_5"),
            SwitchMap("GoUpstairsM", 25, 1, false, false, 8, 51, "hq_5"),
            SwitchMap("GoUpstairsR", 26, 1, false, false, 8, 51, "hq_5"),
            GetCommonEntity("ElevatorL", 11, 2, 0, 0, undefined, Cutscene("elevator"), { visible: false, isElevator: true }),
            GetCommonEntity("ElevatorR", 12, 2, 0, 0, undefined, Cutscene("elevator"), { visible: false, isElevator: true }),
            // Opening Cutscene
            new AutoplayCutscene("to4F"),
            GetCommonEntity("SavedWorker", 10, 3, 20, 0, undefined, undefined, { sy: 16, noChange: true, visible: false, solid: false, sheetlen: 2, storageKey: "trentSafe", boring: true }),
            // Shops
            EnterShop("VegShop", 15, 3, "vendo_veg"),
            EnterShop("FrtShop", 16, 3, "vendo_tree"),
            EnterShop("LogShop", 17, 3, "vendo_mush"),
            EnterShop("RceShop", 18, 3, "vendo_paddy"),
            EnterShop("EggShop", 19, 3, "vendo_coop"),
            EnterShop("FshShop", 20, 3, "vendo_water"),
            EnterShop("BotShop", 21, 3, "vendo_tech"),
            // Quests & Treasure
            GetCommonEntity("EndOfTheRoad", 2, 5, 20, 0, undefined, Cutscene("lotus"), { noChange: true, sy: 12, sheetlen: 2, moving: true, visible: false, }),
            GetTreasureChest("HQ4Chest1", 10, 8, [["pineapple", 10]]),
            GetTreasureChest("HQ4Chest2", 10, 13, [["avocado", 5]]),
            GetTreasureChest("HQ4Chest3", 14, 13, [["rice", 10]]),
            GetTreasureChest("HQ4Chest4", 14, 8, [["milkcap", 10]]),
            GetTreasureChest("HQ4Chest5", 19, 13, [["rhubarb", 10]]),
            GetTreasureChest("HQ4Chest6", 19, 8, [["drone", 10]]),
            GetTreasureChest("HQ4Chest7", 23, 13, [["leek", 10]]),
            GetTreasureChest("HQ4Chest8", 23, 8, [["spinach", 20]]),
            // Boss
            GetCommonEntity("ReturnOfTheFucker", 26, 7, 19, 0, undefined, Cutscene("tutReturn"), { sy: 13, noChange: true, boss: true, failedInteract: Cutscene("tutLost") }),
            // Mandatory Enemies
            GetCommonEntity("ProphetMush0", 9, 10, 12, 0, undefined, Cutscene("enemy"), requiredEnemyMetadata.prophet("Mush")),
            GetCommonEntity("ProphetRice0", 9, 11, 12, 1, undefined, Cutscene("enemy"), requiredEnemyMetadata.prophet("Rice")),
            GetCommonEntity("ProphetFrut0", 15, 10, 12, 2, undefined, Cutscene("enemy"), requiredEnemyMetadata.prophet("Fruit")),
            GetCommonEntity("ProphetVeji0", 15, 11, 12, 3, undefined, Cutscene("enemy"), requiredEnemyMetadata.prophet("Veggie")),
            GetCommonEntity("ProphetVeji1", 18, 10, 12, 3, undefined, Cutscene("enemy"), requiredEnemyMetadata.prophet("Veggie")),
            GetCommonEntity("ProphetMush1", 18, 11, 12, 0, undefined, Cutscene("enemy"), requiredEnemyMetadata.prophet("Mush")),
            GetCommonEntity("ProphetRice1", 24, 10, 12, 1, undefined, Cutscene("enemy"), requiredEnemyMetadata.prophet("Rice")),
            GetCommonEntity("ProphetFrut1", 24, 11, 12, 2, undefined, Cutscene("enemy"), requiredEnemyMetadata.prophet("Fruit"))
        ];
        const lookables = [ [1, 11, "midniteBottle"], [2, 11, "midniteBottle"], [3, 11, "midniteBottle"], [3, 10, "midniteBottle"],
                          [27, 10, "purpleBottle"], [27, 11, "purpleBottle"], [28, 11, "purpleBottle"], [29, 11, "purpleBottle"], 
                          [27, 3, "crystalBottle"], [27, 4, "crystalBottle"], [28, 4, "crystalBottle"], [4, 11, "crystalBottle"] ];
        lookables.forEach((l, i) => entities.push(GetCommonInvisibleSpeakingEntity("Invis" + i, l[0], l[1], l[2])));
        return entities;
    }(),
    "hq_5": [
        // Map Switches
        SwitchMap("GoDownstairsL", 7, 52, false, false, 25, 2, "hq_4"),
        SwitchMap("GoDownstairsM", 8, 52, false, false, 25, 2, "hq_4"),
        SwitchMap("GoDownstairsR", 9, 52, false, false, 25, 2, "hq_4"),
        SwitchMap("Flee", 11, 5, false, false, 39, 10, "northcity"),
        SwitchMap("GoUpstairs", 8, 0, false, false, 8.5, 15, "hq_6"),
        // Shops
        EnterShop("LastInn", 5, 5, "lastInn"),
        // Boss
        { name: "CS_BeckettStandoff", pos: { x: 8, y: 16 }, boring: true, isRow: true, interact: Cutscene("food2Fifth"), solid: false, visible: false, failedInteract: Cutscene("food2Lost"), postBattle: "iWahn" },
        GetCommonEntity("BeckettsReturn", 8, 15, 5, 0, undefined, undefined, { sheet: "hipster", sy: 1, sheetlen: 2, storageKey: "beckettBack" }),
        new CutsceneTrigger("food2Beat", "iWahn")
    ],
    "hq_6": function() {
        const entities = [
            new AutoplayCutscene("final"),
            new CutsceneTrigger("theEnd", "youWon"),
            GetCommonEntity("CryBeckett", 5, 9, 6, 0, undefined, undefined, { sheet: "hipster", sy: 2, sheetlen: 2, storageKey: "beckettCry" }),
            GetCommonEntity("chair", 8.5, 7, 1, 0, undefined, undefined, { sheet: "assistant", sy: 5, boring: true, visible: false, storageKey: "chair", forcedY: 13 }),
            GetCommonEntity("BigBadNathan", 8.5, 7, 0, 0, undefined, undefined, { sheet: "assistant", sy: 4, sheetlen: 2, storageKey: "endNath", forcedY: 14 }),
            GetCommonEntity("button", 7.75, 7, 5, 2, undefined, undefined, { sheet: "assistant", sy: 5, boring: true, storageKey: "btn", forcedY: 14 }),
            GetCommonEntity("desk", 8, 7, 7, 0, undefined, undefined, { big: true, sy: 3, boring: true, storageKey: "table", forcedY: 14 })
        ];
        for(let x = 6; x < 12; x++) {
            for(let y = 8; y < 10; y++) {
                entities.unshift(GetCommonEntity("flipTile" + x + "." + y, x, y, 24, 0, undefined, undefined, { boring: true, isFlippy: true }));
            }
        }
        return entities;
    }(),
    "gameover": [ new CutsceneTrigger("badEnd", "brunoKill"), new CutsceneTrigger("monstWon", "lostToMonster") ]
};
var mapentities = {
    "farmersmarket": [
        //EnterShop("ChickenCoop", 10, 6, "coop"),
        //EnterShop("UpgradeTest", 10, 5, "farmupgradeFull"),
        GetCommonEntity("HipsterBike", 6, 4, 0, 0, undefined, undefined, { sheet: "hipster", storageKey: "bike", visible: false }),
        GetCommonEntity("Hipster", 0, 4, 0, 0, undefined, undefined, { sheet: "hipster", sheetlen: 2, storageKey: "hipster", postBattle: "PostInitialBattle" }),
        SwitchMap("ExitAreaSouth", 0, 13, true, false, 7, 4, "farmpath"),
        GetInvisibleEntity("PostInitialBattle", [
            GetSpeak("oops I killed a man. i should go kick his boss's ass, too. also his boss's ass,"),
            GetSpeak("so on and so forth, all the way up to the top. I should head to my farm first to get supplies.") 
        ], { storageKey: "PostInitialBattle" }),
        {
            name: "CutscenePrompt",
            pos: {x: 10, y: 5}, // 10
            solid: false,
            //autoplay: true, 
            interact: [
                GetSpeak("it's battle"),
                function() {
                    worldmap.clearTarget();
                    game.target = worldmap.importantEntities["hipster"];
                    //tutorial.startBattle();
                    combat.startBattle(["Beckett"]);
                }
                /*function() {
                    worldmap.waitForAnimation = true;
                    worldmap.importantEntities["hipster"].moving = true;
                    worldmap.animIdx = setInterval(function() {
                        worldmap.importantEntities["hipster"].pos.x += 0.025;//0.2;//0.025;
                        worldmap.refreshMap();
                        if(worldmap.importantEntities["hipster"].pos.x >= 6) {
                            worldmap.finishAnimation();
                        }
                    }, 10);
                },
                function() {
                    worldmap.waitForAnimation = true;
                    worldmap.importantEntities["hipster"].moving = false;
                    worldmap.animIdx = setTimeout(function() {
                        worldmap.finishAnimation();
                    }, 500);
                },
                function() {
                    worldmap.writeText("Beckett: Ah! This must be it! NAME's famous produce stand!");
                    worldmap.importantEntities["hipster"].moving = true;
                    worldmap.importantEntities["hipster"].anim.shiftY(2).shiftX(3, 2).setFPS(8);
                },
                function() {
                    worldmap.waitForAnimation = true;
                    worldmap.importantEntities["hipster"].moving = true;
                    worldmap.importantEntities["hipster"].anim.shiftX(1, 4).shiftY(0).setFPS();
                    worldmap.importantEntities["bike"].anim.shiftY(2);
                    worldmap.importantEntities["bike"].visible = true;
                    worldmap.animIdx = setInterval(function() {
                        worldmap.importantEntities["hipster"].pos.y += 0.025;
                        worldmap.importantEntities["hipster"].pos.x += 0.05;
                        worldmap.refreshMap();
                        if(worldmap.importantEntities["hipster"].pos.x >= 8) {
                            worldmap.finishAnimation();
                        }
                    }, 10);
                },
                function() {
                    worldmap.importantEntities["hipster"].anim.shiftX(3, 2).setFPS(8);
                    worldmap.writeText("Beckett: The guys back at the office were right -- all of this looks amazing!");
                },
                function() {
                    worldmap.importantEntities["hipster"].moving = false;
                    worldmap.importantEntities["hipster"].anim.shiftX(2, 4);
                    worldmap.writeText("Beckett: This carrot looks so nutritious!");
                },
                function() {
                    worldmap.importantEntities["hipster"].moving = true;
                    worldmap.writeText("Beckett: ...");
                },
                GetSpeak("Beckett: And it looks like this analysis confirms that suspicion!"),
                function() {
                    worldmap.importantEntities["hipster"].moving = false;
                    worldmap.writeText("Beckett: Hm?");
                },
                function() {
                    worldmap.importantEntities["hipster"].moving = true;
                    worldmap.importantEntities["hipster"].anim.shiftX(3, 2).setFPS(8);
                    worldmap.writeText("Beckett: Oh. You're probably wondering what that was all about.");
                },
                GetSpeak("Beckett: The startup I work for is going to use this carrot data to help us create PROPRIETARY FOOD SUBSTITUTES."),
                GetSpeak("Beckett: The world will be so much better when people don't have to worry about what to eat!"),
                GetSpeak("Beckett: But for that to work, we also need to make sure Food2 has no competition..."),
                GetSpeak("Beckett: So, I'd like to make you an offer. Ten million coins to retire and never farm again."),
                function() {
                    worldmap.importantEntities["hipster"].moving = false;
                    worldmap.writeText("Beckett: ...");
                },
                function() {
                    worldmap.importantEntities["hipster"].moving = true;
                    worldmap.writeText("Beckett: No? Guess it's time for you to die then!");
                },
                function() {
                    worldmap.clearTarget();
                    game.target = worldmap.importantEntities["hipster"];
                    tutorial.startBattle();
                }*/
            ]
        }
    ],
    "farmpath": [
        SwitchMap("ExitAreaNorth", 0, 3, true, false, 7, 12, "farmersmarket"), 
        SwitchMap("ExitAreaWest", 0, 0, false, true, 22, 12, "farm"),
        SwitchMap("ExitAreaSouth", 0, 15, true, false, 21.5, 1, "firstvillage")
    ],
    "farm": [
        SwitchMap("ExitAreaWest", 23, 0, false, true, 1, 11, "farmpath"),
        GetCommonEntity("Robo1", 20, 8, 4, 2, commonMovementDatas.robo(20), commonInteractArrays.robo), 
        GetCommonEntity("Robo2", 17, 10, 4, 2, commonMovementDatas.robo(17), commonInteractArrays.robo), 
        GetCommonEntity("Robo3", 16, 12, 4, 2, commonMovementDatas.robo(16), commonInteractArrays.robo), 
        GetCommonEntity("Robo4", 13, 14, 4, 2, commonMovementDatas.robo(13), commonInteractArrays.robo), 
        GetCommonEntity("Robo5", 12, 11, 4, 2, commonMovementDatas.robo(12, 1), commonInteractArrays.robo), 
        GetCommonEntity("Robo6", 9, 15, 4, 2, commonMovementDatas.robo(9, 1), commonInteractArrays.robo),
        EnterShop("ChickenCoop", 18, 3, "coop"),
        GetCommonEntity("Fucker", 10, 3, 0, 2, undefined, [
            GetSpeak("hI hEllo yEs i aM a tEchnology rObot sEnt tO rEsearch tHis fArm."),
            GetSpeak("aLso bY \"rEsearch\" i mEan \"lOot aNd pIllage.\""),
            GetSpeak("oH sHit tHis iS yOur fArm? fUck. i mEan... uHhhh... wAnt gIrl sCout cOokies?"),
            GetSpeak("..."),
            GetSpeak("...nOt bUying iT? oKay, fIne. lEt's tHrow dOwn."),
            GetFight(["bigBot"])
        ], { big: true, postBattle: "PostBoss", failedInteract: [
            GetSpeak("bAck fOr mOre, aRe yA? hAhaha. i'Ll gLadly dEfeat yOu aGain!"),
            GetFight(["bigBot"])
        ] }),
        {
            name: "PostBoss",
            pos: {x: -1, y: -1},
            solid: false,
            storageKey: "PostBoss",
            interact: [
                GetSpeak("I bet if that robot was still alive it'd be saying \"aw nuts\" right now, ha ha."),
                GetSpeak("Get it because it exploded and bolts and NUTS flew everywhere. Is very funny joke :3c")
            ]
        }
    ],
    "firstvillage": [
        SwitchMap("ExitAreaNorth", 0, 0, true, false, 14, 14, "farmpath"),
        //ExitAreaWest to forest
        SwitchMap("ExitAreaSouth", 0, 30, true, false, 21.5, 1, "belowvillage"),
        EnterShop("EquipmentShop", 17, 12, "equip1"),
        GetSign(18, 13, "Equipment Shop"),
        EnterShop("UpgradeShop", 18, 20, "upgrade1"),
        GetSign(17, 21, "Farm Expansion Shop"),
        EnterShop("FixtureShop", 3, 6, "fixture1"),
        GetSign(4, 7, "Fixture Shop"),
        EnterShop("SeedShopL", 5, 17, "seed1"),
        EnterShop("SeedShopR", 6, 17, "seed1"),
        GetSign(7, 18, "Seed Shop"),
        EnterShop("Inn", 16, 4, "inn1"),
        GetSign(15, 5, "Inn"),
        GetSign(1, 24, "Shitblossom Forest")
    ],
    "belowvillage": [
        SwitchMap("ExitAreaNorth", 0, 0, true, false, 21.5, 28, "firstvillage"),
        SwitchMap("EnterFacilitySide", 13, 16, false, false, 30, 3, "researchfacility"),
        SwitchMap("EnterFacilityL", 7, 18, false, false, 15.5, 26, "researchfacility"),
        SwitchMap("EnterFacilityR", 8, 18, false, false, 15.5, 26, "researchfacility"),
        GetCommonEntity("Robo1", 20, 20, 4, 2, GetStdMovement([ [20, 20, 3], [27, 20, 3], [27, 24, 2], [20, 24, 1], [20, 20, 0] ]), commonInteractArrays.researchRobo, {sy: 4})
    ],
    "researchfacility": [
        SwitchMap("ExitAreaSouth", 0, 27, true, false, 7.5, 19, "belowvillage"),
        SwitchMap("ExitAreaEast", 31, 3, false, false, 13, 15, "belowvillage"),
        GetCommonEntity("Fucker", 17, 1, 0, 0, undefined, [
            GetSpeak("Don't interfere with my stuff you baka."),
            GetFight(["ScienceMan"])
        ], { sy: 4, postBattle: "PostBoss2", failedInteract: [
            GetSpeak("Fuck off."),
            GetFight(["ScienceMan"])
        ] }),
        {
            name: "PostBoss2",
            pos: {x: -1, y: -1},
            solid: false,
            storageKey: "PostBoss2",
            interact: [
                GetSpeak("I bet if that robot was still alive it'd be saying \"aw nuts\" right now, ha ha."),
                GetSpeak("Get it because it exploded and bolts and NUTS flew everywhere. Is very funny joke :3c")
            ]
        }
    ],
    "bridge": [
        SwitchMap("GoUnderwater", 10, 17, false, false, 41, 20, "underwater"),
        GetSign(15, 16, "Mermaid Shoppe"),
        EnterShop("Mermaid Shoppe", 16, 16, "mermaid"),
        GetCommonEntity("Worker1", 28, 8, 0, 3, undefined, [
            function() {
                if(player.hasQuest("helpSeaMonster")) {
                    worldmap.writeText(GetText("constr1_foe"));
                } else {
                    worldmap.writeText(GetText("constr1_fr1"));
                }
            }, function() {
                if(player.hasQuest("helpSeaMonster")) {
                    combat.startBattle(["Worker"]);
                } else {
                    worldmap.writeText(GetText("constr1_fr2"));
                }
            }
        ])
    ],
    "underwater": [
        SwitchMap("GoAboveGround", 42, 20, false, false, 11, 17, "bridge")
    ]
};
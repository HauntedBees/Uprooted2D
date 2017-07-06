var mapentities = {
    "farmersmarket": [
        //EnterShop("ChickenCoop", 10, 6, "coop"),
        EnterShop("UpgradeTest", 10, 5, "farmupgradeFull"),
        GetCommonEntity("SexFuck6969", 6, 10, 0, 1, 3, undefined, undefined, { storageKey: "craig", postBattle: "PostInitialBattle" }),
        SwitchMap("ExitAreaSouth", 0, 12, true, false, 5, 8, "farmpath"),
        GetCommonEntity("PostInitialBattle", -1, -1, undefined, undefined, undefined, undefined, [
            GetSpeak("oops I killed a man. i should go kick his boss's ass, too. also his boss's ass,"),
            GetSpeak("so on and so forth, all the way up to the top. I should head to my farm first to get supplies.") 
        ], { solid: false, storageKey: "PostInitialBattle" }),
        {
            name: "CutscenePrompt",
            pos: {x: 11, y: 7}, // 10
            solid: false,
            //autoplay: true, 
            interact: [
                GetSpeak("oh shit is that a le fucking farmer's market"),
                function() {
                    worldmap.waitForAnimation = true;
                    worldmap.importantEntities["craig"].dir = 0;
                    worldmap.animIdx = setInterval(function() {
                        worldmap.importantEntities["craig"].pos.y -= 0.2;//0.025;
                        worldmap.refreshMap();
                        if(worldmap.importantEntities["craig"].pos.y <= 8.5) {
                            worldmap.finishAnimation();
                        }
                    }, 10);
                },
                function() {
                    worldmap.waitForAnimation = true;
                    worldmap.importantEntities["craig"].dir = 3;
                    worldmap.animIdx = setInterval(function() {
                        worldmap.importantEntities["craig"].pos.x += 0.2;//0.025;
                        worldmap.refreshMap();
                        if(worldmap.importantEntities["craig"].pos.x >= 10) {
                            worldmap.finishAnimation();
                        }
                    }, 10);
                },
                function() {
                    worldmap.importantEntities["craig"].dir = 0;
                    worldmap.refreshMap();
                    worldmap.writeText("fucking sick dude");
                },
                function() {
                    worldmap.clearTarget();
                    game.target = worldmap.importantEntities["craig"];
                    tutorial.startBattle();
                }
            ]
        }
    ],
    "farmpath": [
        SwitchMap("ExitAreaNorth", 0, 7, true, false, 7, 10, "farmersmarket"), 
        SwitchMap("ExitAreaWest", 0, 0, false, true, 22, 12, "farm"),
        SwitchMap("ExitAreaSouth", 0, 15, true, false, 21.5, 1, "firstvillage")
    ],
    "farm": [
        SwitchMap("ExitAreaWest", 23, 0, false, true, 1, 11, "farmpath"),
        GetCommonEntity("Robo1", 20, 8, 4, 0, 2, commonMovementDatas.robo(20), commonInteractArrays.robo), 
        GetCommonEntity("Robo2", 17, 10, 4, 0, 2, commonMovementDatas.robo(17), commonInteractArrays.robo), 
        GetCommonEntity("Robo3", 16, 12, 4, 0, 2, commonMovementDatas.robo(16), commonInteractArrays.robo), 
        GetCommonEntity("Robo4", 13, 14, 4, 0, 2, commonMovementDatas.robo(13), commonInteractArrays.robo), 
        GetCommonEntity("Robo5", 12, 11, 4, 0, 2, commonMovementDatas.robo(12, 1), commonInteractArrays.robo), 
        GetCommonEntity("Robo6", 9, 15, 4, 0, 2, commonMovementDatas.robo(9, 1), commonInteractArrays.robo),
        EnterShop("ChickenCoop", 18, 3, "coop"),
        GetCommonEntity("Fucker", 10, 3, 0, 0, 2, undefined, [
            GetSpeak("hI hEllo yEs i aM a tEchnology rObot sEnt tO rEsearch tHis fArm."),
            GetSpeak("aLso bY \"rEsearch\" i mEan \"lOot aNd pIllage.\""),
            GetSpeak("oH sHit tHis iS yOur fArm? fUck. i mEan... uHhhh... wAnt gIrl sCout cOokies?"),
            GetSpeak("..."),
            GetSpeak("...nOt bUying iT? oKay, fIne. lEt's tHrow dOwn."),
            GetFight(["bigBot"])
        ], { big: true, postBattle: "PostBoss" }),
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
        SwitchMap("ExitAreaNorth", 0, 0, true, false, 14, 14, "farmpath")
        //ExitAreaWest to forest
        //ExitAreaSouth to river
    ]
};
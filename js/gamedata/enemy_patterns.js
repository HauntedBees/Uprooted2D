const enemyPatterns = {
"basic": {"nodes":[{"id":"node0","data":{"message":"INIT"},"next":{"type":"conditional","data":[{"next":"node1","condition":"HAS_CROPS_READY"},{"next":"node2","condition":"ELSE"}]}},{"id":"node1","data":{"textID":"standardAttack","message":"LAUNCH_CROPS","animData":"THROW_ENEMY"}},{"id":"node2","data":{},"next":{"type":"conditional","data":[{"next":"node3","weight":"0.6"},{"next":"node4","weight":"0.4"}],"condition":"random"}},{"id":"node3","data":{"textID":"plantAttack","message":"TRY_PLANT_CROP","action":"args","animData":"PLANT"},"next":{"type":"conditional","data":[{"next":"node5","condition":"SUCCESS"},{"next":"node4","condition":"ELSE"}]}},{"id":"node4","data":{"textID":"standardAttack","message":"WEAK_ATTACK","animData":"ATTACK"}},{"id":"node5","data":{"message":"END"}}]},
"basicFarm": {"nodes":[{"id":"node0","data":{"message":"INIT"},"next":{"type":"conditional","data":[{"next":"node1","condition":"HAS_CROPS_READY"},{"next":"node2","condition":"ELSE"}]}},{"id":"node1","data":{"textID":"standardAttack","message":"LAUNCH_CROPS","animData":"THROW_ENEMY"}},{"id":"node2","data":{},"next":{"type":"conditional","data":[{"next":"node3","weight":"0.95"},{"next":"node4","weight":"0.05"}],"condition":"random"}},{"id":"node3","data":{"textID":"plantAttack","message":"TRY_PLANT_CROP","action":"args","animData":"PLANT"},"next":{"type":"conditional","data":[{"next":"node5","condition":"SUCCESS"},{"next":"node4","condition":"ELSE"}]}},{"id":"node4","data":{"textID":"standardAttack","message":"WEAK_ATTACK","animData":"ATTACK"}},{"id":"node5","data":{"message":"END"}}]},
"basicMany": {"nodes":[{"id":"node0","data":{"message":"INIT"},"next":{"type":"conditional","data":[{"next":"node1","condition":"HAS_CROPS_READY"},{"next":"node2","condition":"ELSE"}]}},{"id":"node1","data":{"textID":"standardAttack","message":"LAUNCH_CROPS","animData":"THROW_ENEMY"}},{"id":"node2","data":{},"next":{"type":"conditional","data":[{"next":"node3","weight":"0.6"},{"next":"node4","weight":"0.4"}],"condition":"random"}},{"id":"node3","data":{"textID":"plantAttack","message":"TRY_PLANT_THREE_CROPS","action":"args","animData":"PLANT"},"next":{"type":"conditional","data":[{"next":"node5","condition":"SUCCESS"},{"next":"node4","condition":"ELSE"}]}},{"id":"node4","data":{"textID":"standardAttack","message":"WEAK_ATTACK","animData":"ATTACK"}},{"id":"node5","data":{"message":"END"}}]},
"basicRock": {"nodes":[{"id":"node0","data":{"message":"INIT"},"next":{"type":"conditional","data":[{"next":"node1","condition":"HAS_CROPS_READY"},{"next":"node2","condition":"ELSE"}]}},{"id":"node1","data":{"textID":"standardAttack","message":"LAUNCH_CROPS","animData":"THROW_ENEMY"}},{"id":"node2","data":{},"next":{"type":"conditional","data":[{"next":"node3","weight":"0.4"},{"next":"node4","weight":"0.2"},{"next":"node7","weight":"0.4"}],"condition":"random"}},{"id":"node3","data":{"textID":"plantAttack","message":"TRY_PLANT_CROP","action":"args","animData":"PLANT"},"next":{"type":"conditional","data":[{"next":"node5","condition":"SUCCESS"},{"next":"node4","condition":"ELSE"}]}},{"id":"node4","data":{"textID":"standardAttack","message":"WEAK_ATTACK","animData":"ATTACK"}},{"id":"node5","data":{"message":"END"}},{"id":"node8","data":{"textID":"throwRockFail","message":"IDLE","animData":"PLANT"}},{"id":"node7","data":{"textID":"throwRockSucc","message":"TRY_THROW_ROCK","animData":"ROCK_TOSS"},"next":{"type":"conditional","data":[{"next":"node5","condition":"SUCCESS"},{"next":"node8","condition":"ELSE"}]}}]},
"bear": {"nodes":[{"id":"node0","data":{"message":"INIT"},"next":{"type":"conditional","data":[{"next":"node1","condition":"HAS_CROPS_READY"},{"next":"node2","condition":"ELSE"}]}},{"id":"node1","data":{"textID":"standardAttack","message":"LAUNCH_CROPS","animData":"THROW_ENEMY"}},{"id":"node2","data":{},"next":{"type":"conditional","data":[{"next":"node6","weight":"0.4"},{"next":"node3","weight":"0.4"},{"next":"node4","weight":"0.2"}],"condition":"random"}},{"id":"node3","data":{"textID":"plantAttack","message":"TRY_PLANT_CROP","action":"args","animData":"PLANT"},"next":{"type":"conditional","data":[{"next":"node5","condition":"SUCCESS"},{"next":"node7","condition":"ELSE"}]}},{"id":"node4","data":{"textID":"standardAttack","message":"WEAK_ATTACK","animData":"ATTACK"}},{"id":"node5","data":{"message":"END"}},{"id":"node6","data":{},"next":{"type":"conditional","data":[{"next":"node8","weight":"0.75"},{"next":"node9","weight":"0.25"}],"condition":"random"}},{"id":"node7","data":{},"next":{"type":"conditional","data":[{"next":"node6","weight":"0.3"},{"next":"node4","weight":"0.7"}],"condition":"random"}},{"id":"node8","data":{"textID":"fishSuccess","message":"HEAL_RANGE","action":"10,8","animData":"HEAL"}},{"id":"node9","data":{"textID":"fishFail","message":"IDLE","animData":"FISH_FAIL"}}]},
"beckett": {"nodes":[{"id":"node0","data":{"message":"INIT"},"next":{"type":"conditional","data":[{"next":"node8","condition":"HAS_CROPS_READY"},{"next":"node27","condition":"ELSE"}]}},{"id":"node1","data":{"textID":"standardAttack","message":"LAUNCH_CROPS","animData":"THROW_ENEMY"}},{"id":"node30","data":{"textID":"beckettRock","message":"TECH_THROW_ROCK","animData":"ROCK_TOSS"},"next":{"type":"conditional","data":[{"next":"node21","condition":"SUCCESS"},{"next":"node26","condition":"ELSE"}]}},{"id":"node24","data":{"textID":"plantAttack","message":"BECKETT_PLANT","animData":"PLANT"},"next":{"type":"conditional","data":[{"next":"node21","condition":"SUCCESS"},{"next":"node25","condition":"ELSE"}]}},{"id":"node29","data":{"textID":"standardAttack","message":"WEAKEST_ATTACK","animData":"PLANT"}},{"id":"node8","data":{},"next":{"type":"conditional","data":[{"next":"node1","weight":"0.65"},{"next":"node9","weight":"0.45"}],"condition":"random"}},{"id":"node9","data":{"textID":"cropAttack","message":"LAUNCH_CROPS_AT_CROPS","animData":"THROW_CROP"},"next":{"type":"conditional","data":[{"next":"node21","condition":"SUCCESS"},{"next":"node1","condition":"ELSE"}]}},{"id":"node15","data":{"textID":"modulateAttack","message":"MODULATE","action":"0,1,2","animData":"PLANT"}},{"id":"node32","data":{"textID":"burnSucc","message":"BECK_FIRE_ROW","animData":"ROW_FIRE"},"next":{"type":"conditional","data":[{"next":"node21","condition":"SUCCESS"},{"next":"node26","condition":"ELSE"}]}},{"id":"node33","data":{"textID":"splashRow","message":"BECKETT_WATER","animData":"HEAD_ON_SPLASH_ATTACK"},"next":{"type":"conditional","data":[{"next":"node21","condition":"SUCCESS"},{"next":"node26","condition":"ELSE"}]}},{"id":"node26","data":{},"next":{"type":"conditional","data":[{"next":"node15","weight":"0.8"},{"next":"node29","weight":"0.2"}],"condition":"random"}},{"id":"node25","data":{},"next":{"type":"conditional","data":[{"next":"node30","weight":"0.3"},{"next":"node31","weight":"0.3"},{"next":"node32","weight":"0.3"},{"next":"node33","weight":"0.1"}],"condition":"random"}},{"id":"node31","data":{"textID":"beckettSalt","message":"BECK_THROW_SALT","animData":"SALT_TOSS"},"next":{"type":"conditional","data":[{"next":"node21","condition":"SUCCESS"},{"next":"node26","condition":"ELSE"}]}},{"id":"node21","data":{"message":"END"}},{"id":"node22","data":{},"next":{"type":"conditional","data":[{"next":"node23","weight":"0.29"},{"next":"node24","weight":"0.29"},{"next":"node25","weight":"0.25"},{"next":"node26","weight":"0.17"}],"condition":"random"}},{"id":"node23","data":{"textID":"nerfMove","message":"NERF_THIS","animData":"PLANT"},"next":{"type":"conditional","data":[{"next":"node21","condition":"SUCCESS"},{"next":"node24","condition":"ELSE"}]}},{"id":"node28","data":{"textID":"repairMachine","message":"REPAIR_BECK_MACHINE","animData":"HEAL"}},{"id":"node27","data":{},"next":{"type":"conditional","data":[{"next":"node28","condition":"BECKETT_MACHINE_BROKE"},{"next":"node22","condition":"ELSE"}]}}]},
"beepBeep": {"nodes":[{"id":"node0","data":{"message":"INIT"},"next":{"type":"conditional","data":[{"next":"node1","condition":"HAS_CROPS_READY"},{"next":"node2","condition":"ELSE"}]}},{"id":"node1","data":{"textID":"standardAttack","message":"LAUNCH_CROPS","animData":"THROW_ENEMY"}},{"id":"node2","data":{},"next":{"type":"conditional","data":[{"next":"node3","weight":"0.65"},{"next":"node7","weight":"0.2"},{"next":"node6","weight":"0.1"},{"next":"node4","weight":"0.05"}],"condition":"random"}},{"id":"node3","data":{"textID":"carPlantAttack","message":"TRY_PLANT_CROP","action":"args","animData":"PLANT"},"next":{"type":"conditional","data":[{"next":"node5","condition":"SUCCESS"},{"next":"node4","condition":"ELSE"}]}},{"id":"node4","data":{"textID":"standardAttack","message":"WEAK_ATTACK","animData":"ATTACK"}},{"id":"node5","data":{"message":"END"}},{"id":"node6","data":{"textID":"revEngine","message":"REV_ENGINE","animData":"REV_ENGINE"}},{"id":"node7","data":{"textID":"tireChuck","message":"TIRE_CHUCK","animData":"ROCK_TOSS"},"next":{"type":"conditional","data":[{"next":"node5","condition":"SUCCESS"},{"next":"node4","condition":"ELSE"}]}}]},
"beeQueen": {"nodes":[{"id":"node0","data":{"message":"INIT"},"next":{"type":"conditional","data":[{"next":"node6","condition":"HURT_BEES"},{"next":"node1","condition":"HAS_CROPS_READY"},{"next":"node2","condition":"ELSE"}]}},{"id":"node1","data":{"textID":"standardAttack","message":"LAUNCH_CROPS","animData":"THROW_ENEMY"}},{"id":"node2","data":{},"next":{"type":"conditional","data":[{"next":"node3","weight":"0.6"},{"next":"node4","weight":"0.4"}],"condition":"random"}},{"id":"node3","data":{"textID":"plantAttack","message":"TRY_PLANT_THREE_CROPS","action":"args","animData":"PLANT"},"next":{"type":"conditional","data":[{"next":"node5","condition":"SUCCESS"},{"next":"node4","condition":"ELSE"}]}},{"id":"node4","data":{"textID":"standardAttack","message":"WEAK_ATTACK","animData":"ATTACK"}},{"id":"node5","data":{"message":"END"}},{"id":"node6","data":{"textID":"queenMaim","message":"FUCKING_MAIM","animData":"MAIM"}}]},
"boss1": {"nodes":[{"id":"node0","data":{"message":"INIT"},"next":{"type":"conditional","data":[{"next":"node6","condition":"HAS_CROPS_READY"},{"next":"node2","condition":"ELSE"}]}},{"id":"node1","data":{"textID":"standardAttack","message":"LAUNCH_CROPS","animData":"THROW_ENEMY"}},{"id":"node2","data":{},"next":{"type":"conditional","data":[{"next":"node3","weight":"0.6"},{"next":"node4","weight":"0.2"},{"next":"node7","weight":"0.2"}],"condition":"random"}},{"id":"node3","data":{"textID":"plantAttack","message":"TRY_PLANT_CROP","action":"battery","animData":"PLANT"},"next":{"type":"conditional","data":[{"next":"node5","condition":"SUCCESS"},{"next":"node4","condition":"ELSE"}]}},{"id":"node4","data":{"textID":"standardAttack","message":"WEAK_ATTACK","animData":"ATTACK"}},{"id":"node5","data":{"message":"END"}},{"id":"node7","data":{"textID":"modulateAttack","message":"MODULATE","action":"args","animData":"MODULATE"}},{"id":"node6","data":{},"next":{"type":"conditional","data":[{"next":"node1","weight":"0.6"},{"next":"node4","weight":"0.2"},{"next":"node7","weight":"0.2"}],"condition":"random"}}]},
"boss2": {"nodes":[{"id":"node0","data":{"message":"INIT"},"next":{"type":"conditional","data":[{"next":"node8","condition":"HAS_BABIES_READY"},{"next":"node6","condition":"HAS_CROPS_READY"},{"next":"node2","condition":"ELSE"}]}},{"id":"node1","data":{"textID":"standardAttack","message":"LAUNCH_CROPS","animData":"THROW_ENEMY"}},{"id":"node2","data":{},"next":{"type":"conditional","data":[{"next":"node3","weight":"0.6"},{"next":"node4","weight":"0.2"},{"next":"node7","weight":"0.2"}],"condition":"random"}},{"id":"node3","data":{"textID":"plantAttack","message":"TRY_PLANT_CROP","action":"args","animData":"PLANT"},"next":{"type":"conditional","data":[{"next":"node5","condition":"SUCCESS"},{"next":"node4","condition":"ELSE"}]}},{"id":"node4","data":{"textID":"standardAttack","message":"WEAK_ATTACK","animData":"ATTACK"}},{"id":"node5","data":{"message":"END"}},{"id":"node7","data":{"textID":"modulateAttack","message":"MODULATE","action":"0,1,2,3","animData":"PLANT"}},{"id":"node6","data":{},"next":{"type":"conditional","data":[{"next":"node1","weight":"0.6"},{"next":"node4","weight":"0.2"},{"next":"node7","weight":"0.2"}],"condition":"random"}},{"id":"node8","data":{"textID":"babyToss","message":"THROW_BABY","animData":"GROW_BABY"}}]},
"constrboss": {"nodes":[{"id":"node0","data":{"message":"INIT"},"next":{"type":"conditional","data":[{"next":"node1","condition":"HAS_CROPS_READY"},{"next":"node2","condition":"ELSE"}]}},{"id":"node1","data":{"textID":"standardAttack","message":"LAUNCH_CROPS","animData":"THROW_ENEMY"}},{"id":"node2","data":{},"next":{"type":"conditional","data":[{"next":"node3","weight":"0.4"},{"next":"node4","weight":"0.1"},{"next":"node6","weight":"0.1"},{"next":"node7","weight":"0.4"}],"condition":"random"}},{"id":"node3","data":{"textID":"fileBPermit","message":"TRY_PLANT_CROP","action":"bpermit","animData":"PLANT"},"next":{"type":"conditional","data":[{"next":"node5","condition":"SUCCESS"},{"next":"node4","condition":"ELSE"}]}},{"id":"node4","data":{"textID":"standardAttack","message":"WEAK_ATTACK","animData":"ATTACK"}},{"id":"node5","data":{"message":"END"}},{"id":"node6","data":{"textID":"buildHouse","message":"TRY_PLANT_CROP","action":"house","animData":"PLANT"},"next":{"type":"conditional","data":[{"next":"node5","condition":"SUCCESS"},{"next":"node3","condition":"ELSE"}]}},{"id":"node8","data":{"textID":"throwRockFail","message":"IDLE","animData":"PLANT"}},{"id":"node7","data":{"textID":"throwRockSucc","message":"TRY_THROW_ROCK","animData":"ROCK_TOSS"},"next":{"type":"conditional","data":[{"next":"node5","condition":"SUCCESS"},{"next":"node8","condition":"ELSE"}]}}]},
"construction": {"nodes":[{"id":"node0","data":{"message":"INIT"},"next":{"type":"conditional","data":[{"next":"node1","condition":"HAS_CROPS_READY"},{"next":"node2","condition":"ELSE"}]}},{"id":"node1","data":{"textID":"standardAttack","message":"LAUNCH_CROPS","animData":"THROW_ENEMY"}},{"id":"node2","data":{},"next":{"type":"conditional","data":[{"next":"node3","weight":"0.6"},{"next":"node4","weight":"0.3"},{"next":"node6","weight":"0.1"}],"condition":"random"}},{"id":"node3","data":{"textID":"fileBPermit","message":"TRY_PLANT_CROP","action":"bpermit","animData":"PLANT"},"next":{"type":"conditional","data":[{"next":"node5","condition":"SUCCESS"},{"next":"node4","condition":"ELSE"}]}},{"id":"node4","data":{"textID":"standardAttack","message":"WEAK_ATTACK","animData":"ATTACK"}},{"id":"node5","data":{"message":"END"}},{"id":"node6","data":{"textID":"buildHouse","message":"TRY_PLANT_CROP","action":"house","animData":"PLANT"},"next":{"type":"conditional","data":[{"next":"node5","condition":"SUCCESS"},{"next":"node3","condition":"ELSE"}]}}]},
"convince2": {"nodes":[{"id":"node0","data":{"message":"INIT"},"next":"node1"},{"id":"node1","data":{"message":"CONVINCEATRON2"}}]},
"housekeeper": {"nodes":[{"id":"node0","data":{"message":"INIT"},"next":{"type":"conditional","data":[{"next":"node6","condition":"UNPLUGGED"},{"next":"node3","condition":"ELSE"}]}},{"id":"node3","data":{"textID":"eh","message":"HOUSEKEEPER","animData":"HOUSEKEEPER"}},{"id":"node6","data":{"message":"SKIP"}}]},
"hulk": {"nodes":[{"id":"node0","data":{"message":"INIT"},"next":{"type":"conditional","data":[{"next":"node6","weight":"0.3"},{"next":"node7","weight":"0.25"},{"next":"node4","weight":"0.25"},{"next":"node9","weight":"0.2"}],"condition":"random"}},{"id":"node6","data":{"textID":"standardAttack","message":"WEAK_ATTACK","animData":"ATTACK"}},{"id":"node7","data":{"textID":"throwRockSucc","message":"TRY_THROW_ROCK","animData":"ROCK_TOSS"},"next":{"type":"conditional","data":[{"next":"node5","condition":"SUCCESS"},{"next":"node10","condition":"ELSE"}]}},{"id":"node4","data":{"textID":"cropAttack","message":"ATTACK_CROP","animData":"PLANT"},"next":{"type":"conditional","data":[{"next":"node5","condition":"SUCCESS"},{"next":"node6","condition":"ELSE"}]}},{"id":"node5","data":{"message":"END"}},{"id":"node9","data":{"textID":"hulkPunch","message":"HULK_PUNCH","animData":"HULK_PUNCH"}},{"id":"node10","data":{"textID":"throwRockFail","message":"IDLE","animData":"PLANT"}}]},
"lawnmower": {"nodes":[{"id":"node0","data":{"message":"INIT"},"next":{"type":"conditional","data":[{"next":"node16","condition":"PLAYER_HAS_CROPS"},{"next":"node10","condition":"ELSE"}]}},{"id":"node10","data":{},"next":{"type":"conditional","data":[{"next":"node13","weight":"0.4"},{"next":"node14","weight":"0.6"}],"condition":"random"}},{"id":"node11","data":{"textID":"cropAttack","message":"ATTACK_CROP","animData":"LAWNMOWER_CROP"},"next":{"type":"conditional","data":[{"next":"node15","condition":"SUCCESS"},{"next":"node14","condition":"ELSE"}]}},{"id":"node14","data":{"textID":"standardAttack","message":"WEAK_ATTACK","animData":"LAWNMOWER"}},{"id":"node13","data":{"textID":"throwRockSucc","message":"TRY_THROW_ROCK","animData":"LAWNMOWER_ROCK"},"next":{"type":"conditional","data":[{"next":"node15","condition":"SUCCESS"},{"next":"node14","condition":"ELSE"}]}},{"id":"node15","data":{"message":"END"}},{"id":"node16","data":{},"next":{"type":"conditional","data":[{"next":"node11","weight":"0.55"},{"next":"node13","weight":"0.45"}],"condition":"random"}}]},
"mobster": {"nodes":[{"id":"node0","data":{"message":"INIT"},"next":{"type":"conditional","data":[{"next":"node16","condition":"PLAYER_HAS_CROPS"},{"next":"node21","condition":"ELSE"}]}},{"id":"node10","data":{},"next":{"type":"conditional","data":[{"next":"node13","weight":"0.8"},{"next":"node14","weight":"0.2"}],"condition":"random"}},{"id":"node11","data":{"textID":"cropAttack","message":"ATTACK_CROP","animData":"SHOOT_CROPS"},"next":{"type":"conditional","data":[{"next":"node18","condition":"SUCCESS"},{"next":"node21","condition":"ELSE"}]}},{"id":"node14","data":{"textID":"standardAttack","message":"WEAK_ATTACK","animData":"ATTACK"}},{"id":"node13","data":{"textID":"plantAttack","message":"TRY_PLANT_THREE_CROPS","action":"args","animData":"PLANT"},"next":{"type":"conditional","data":[{"next":"node18","condition":"SUCCESS"},{"next":"node14","condition":"ELSE"}]}},{"id":"node16","data":{},"next":{"type":"conditional","data":[{"next":"node11","weight":"0.4"},{"next":"node21","weight":"0.6"}],"condition":"random"}},{"id":"node21","data":{},"next":{"type":"conditional","data":[{"next":"node17","condition":"HAS_CROPS_READY"},{"next":"node10","condition":"ELSE"}]}},{"id":"node17","data":{"textID":"standardAttack","message":"LAUNCH_CROPS","animData":"THROW_ENEMY"}},{"id":"node18","data":{"message":"END"}}]},
"mrGrillerGrillSpirits": {"nodes":[{"id":"node0","data":{"message":"INIT"},"next":{"type":"conditional","data":[{"next":"node1","condition":"HAS_CROPS_READY"},{"next":"node2","condition":"ELSE"}]}},{"id":"node1","data":{"textID":"standardAttack","message":"LAUNCH_CROPS","animData":"THROW_ENEMY"}},{"id":"node2","data":{},"next":{"type":"conditional","data":[{"next":"node3","weight":"0.8"},{"next":"node6","weight":"0.1"},{"next":"node4","weight":"0.1"}],"condition":"random"}},{"id":"node3","data":{"textID":"grillAttack","message":"TRY_PLANT_CROP","action":"args","animData":"PLANT"},"next":{"type":"conditional","data":[{"next":"node5","condition":"SUCCESS"},{"next":"node6","condition":"ELSE"}]}},{"id":"node4","data":{"textID":"standardAttack","message":"WEAK_ATTACK","animData":"ATTACK"}},{"id":"node5","data":{"message":"END"}},{"id":"node6","data":{"textID":"kombuch","message":"MAYBE_TRY_DRINK_KOMBUCHA","animData":"SLURP_KOMBUCH_TRUCK"},"next":{"type":"conditional","data":[{"next":"node5","condition":"SUCCESS"},{"next":"node4","condition":"ELSE"}]}}]},
"nathan": {"nodes":[{"id":"node0","data":{"message":"INIT"},"next":{"type":"conditional","data":[{"next":"node34","condition":"HAS_CROPS_READY"},{"next":"node22","condition":"ELSE"}]}},{"id":"node1","data":{"textID":"standardAttack","message":"LAUNCH_CROPS","animData":"THROW_ENEMY"}},{"id":"node24","data":{"textID":"plantAttack","message":"NATHAN_PLANT","animData":"PLANT"},"next":{"type":"conditional","data":[{"next":"node21","condition":"SUCCESS"},{"next":"node36","condition":"ELSE"}]}},{"id":"node8","data":{},"next":{"type":"conditional","data":[{"next":"node35","weight":"0.1"},{"next":"node1","weight":"0.6"},{"next":"node9","weight":"0.3"}],"condition":"random"}},{"id":"node9","data":{"textID":"cropAttack","message":"LAUNCH_CROPS_AT_CROPS","animData":"THROW_CROP"},"next":{"type":"conditional","data":[{"next":"node21","condition":"SUCCESS"},{"next":"node1","condition":"ELSE"}]}},{"id":"node36","data":{},"next":{"type":"conditional","data":[{"next":"node23","weight":"0.4"},{"next":"node25","weight":"0.6"}],"condition":"random"}},{"id":"node25","data":{"textID":"nathanCompost","message":"RETRACT_CROPS","animData":"SLURP_KOMBUCH"},"next":{"type":"conditional","data":[{"next":"node21","condition":"SUCCESS"},{"next":"node23","condition":"ELSE"}]}},{"id":"node34","data":{},"next":{"type":"conditional","data":[{"next":"node35","condition":"HAS_LOW_HP"},{"next":"node8","condition":"ELSE"}]}},{"id":"node21","data":{"message":"END"}},{"id":"node22","data":{},"next":{"type":"conditional","data":[{"next":"node24","weight":"0.9"},{"next":"node23","weight":"0.06"},{"next":"node25","weight":"0.04"}],"condition":"random"}},{"id":"node23","data":{"textID":"standardAttack","message":"WEAK_ATTACK","animData":"ATTACK"}},{"id":"node35","data":{"textID":"nathanCompost","message":"HEAL_FROM_CROPS","animData":"HEAL"}}]},
"nernd": {"nodes":[{"id":"node0","data":{"message":"INIT"},"next":{"type":"conditional","data":[{"next":"node6","condition":"HAS_CROPS_READY"},{"next":"node8","condition":"WHOPPY_MACHINE_BROKE"},{"next":"node2","condition":"ELSE"}]}},{"id":"node1","data":{"textID":"standardAttack","message":"LAUNCH_CROPS","animData":"THROW_ENEMY"}},{"id":"node2","data":{},"next":{"type":"conditional","data":[{"next":"node3","weight":"0.4"},{"next":"node12","weight":"0.4"},{"next":"node13","weight":"0.2"}],"condition":"random"}},{"id":"node3","data":{"textID":"plantAttack","message":"TRY_PLANT_CROP_NERD","action":"args","animData":"PLANT"},"next":{"type":"conditional","data":[{"next":"node5","condition":"SUCCESS"},{"next":"node14","condition":"ELSE"}]}},{"id":"node4","data":{"textID":"standardAttack","message":"WEAK_ATTACK","animData":"ATTACK"}},{"id":"node5","data":{"message":"END"}},{"id":"node6","data":{},"next":{"type":"conditional","data":[{"next":"node7","weight":"0.4"},{"next":"node1","weight":"0.6"}],"condition":"random"}},{"id":"node7","data":{"textID":"cropAttack","message":"LAUNCH_CROPS_AT_CROPS","animData":"THROW_CROP"},"next":{"type":"conditional","data":[{"next":"node5","condition":"SUCCESS"},{"next":"node1","condition":"ELSE"}]}},{"id":"node8","data":{},"next":{"type":"conditional","data":[{"next":"node9","weight":"0.55"},{"next":"node2","weight":"0.45"}],"condition":"random"}},{"id":"node9","data":{"textID":"repairMachine","message":"REPAIR_MACHINE","animData":"REPAIR"}},{"id":"node13","data":{"textID":"sipSomeFood2","message":"HEAL_RANGE","action":"60,30","animData":"HEAL"}},{"id":"node12","data":{},"next":{"type":"conditional","data":[{"next":"node4","weight":"0.6"},{"next":"node15","weight":"0.4"}],"condition":"random"}},{"id":"node14","data":{},"next":{"type":"conditional","data":[{"next":"node12","weight":"0.6"},{"next":"node13","weight":"0.4"}],"condition":"random"}},{"id":"node15","data":{"textID":"standardAttack","message":"ATTACK_CROP","animData":"ATTACK_CROP"},"next":{"type":"conditional","data":[{"next":"node5","condition":"SUCCESS"},{"next":"node4","condition":"ELSE"}]}}]},
"outlet": {"nodes":[{"id":"node0","data":{"message":"INIT"},"next":{"type":"conditional","data":[{"next":"node6","condition":"UNPLUGGED"},{"next":"node3","condition":"ELSE"}]}},{"id":"node3","data":{"message":"SKIP"}},{"id":"node6","data":{"textID":"plugAttempt","message":"TRY_PLUG","animData":"BUTTFIX"}}]},
"pigGun": {"nodes":[{"id":"node0","data":{"message":"INIT"},"next":{"type":"conditional","data":[{"next":"node8","condition":"HAS_CROPS_READY"},{"next":"node2","condition":"ELSE"}]}},{"id":"node1","data":{"textID":"standardAttack","message":"LAUNCH_CROPS","animData":"THROW_ENEMY"}},{"id":"node2","data":{},"next":{"type":"conditional","data":[{"next":"node3","weight":"0.39"},{"next":"node4","weight":"0.29"},{"next":"node6","weight":"0.39"},{"next":"node7","weight":"0.03"}],"condition":"random"}},{"id":"node3","data":{"textID":"plantAttack","message":"TRY_PLANT_CROP","action":"args","animData":"PLANT"},"next":{"type":"conditional","data":[{"next":"node5","condition":"SUCCESS"},{"next":"node4","condition":"ELSE"}]}},{"id":"node4","data":{"textID":"standardAttack","message":"WEAK_ATTACK","animData":"ATTACK"}},{"id":"node5","data":{"message":"END"}},{"id":"node6","data":{"textID":"splashSucc","message":"SPLASH_TILE","animData":"ROCK_TOSS"}},{"id":"node7","data":{"textID":"pigWithAFuckingGun","message":"PIG_GUN","animData":"FUCKING_GUN"}},{"id":"node8","data":{},"next":{"type":"conditional","data":[{"next":"node1","weight":"0.6"},{"next":"node2","weight":"0.4"}],"condition":"random"}}]},
"router": {"nodes":[{"id":"node0","data":{"message":"INIT"},"next":{"type":"conditional","data":[{"next":"node7","condition":"UNPLUGGED"},{"next":"node1","condition":"HAS_CLOUD"},{"next":"node2","condition":"ELSE"}]}},{"id":"node1","data":{"textID":"cloudShare","message":"BOOST_CLOUD","animData":"ATTACK"}},{"id":"node2","data":{},"next":{"type":"conditional","data":[{"next":"node3","weight":"0.3"},{"next":"node4","weight":"0.7"}],"condition":"random"}},{"id":"node3","data":{"textID":"cloudSucc","message":"TRY_PLANT_CROP","action":"cloud","animData":"PLANT"},"next":{"type":"conditional","data":[{"next":"node5","condition":"SUCCESS"},{"next":"node6","condition":"ELSE"}]}},{"id":"node4","data":{"textID":"routerIdle","message":"IDLE","animData":"STAND"}},{"id":"node5","data":{"message":"END"}},{"id":"node6","data":{"textID":"cloudFail","message":"IDLE","animData":"STAND"}},{"id":"node7","data":{"message":"SKIP"}}]},
"server": {"nodes":[{"id":"node0","data":{"message":"INIT"},"next":{"type":"conditional","data":[{"next":"node6","condition":"UNPLUGGED"},{"next":"node3","condition":"ELSE"}]}},{"id":"node5","data":{"message":"END"}},{"id":"node3","data":{"textID":"initializeAttack","message":"TRY_PLANT_CROP","action":"lightbulb,download,battery,app,printer,headphones,drone","animData":"SERVER"},"next":{"type":"conditional","data":[{"next":"node5","condition":"SUCCESS"},{"next":"node4","condition":"ELSE"}]}},{"id":"node4","data":{"textID":"clearCache","message":"CLEAR_CACHE","animData":"SERVER"}},{"id":"node6","data":{"message":"SKIP"}}]},
"slap": {"nodes":[{"id":"node0","data":{"message":"INIT"},"next":"node4"},{"id":"node4","data":{"textID":"standardAttack","message":"WEAK_ATTACK","animData":"ATTACK"}}]},
"soyMonster": {"nodes":[{"id":"node0","data":{"message":"INIT"},"next":{"type":"conditional","data":[{"next":"node20","condition":"HAS_BABIES_READY"},{"next":"node6","condition":"HAS_CROPS_READY"},{"next":"node10","condition":"ELSE"}]}},{"id":"node1","data":{"textID":"standardAttack","message":"LAUNCH_CROPS","animData":"THROW_ENEMY"}},{"id":"node2","data":{},"next":{"type":"conditional","data":[{"next":"node17","weight":"0.45"},{"next":"node4","weight":"0.3"},{"next":"node16","weight":"0.25"}],"condition":"random"}},{"id":"node3","data":{"textID":"plantAttack","message":"TRY_PLANT_CROP","action":"args","animData":"PLANT"},"next":{"type":"conditional","data":[{"next":"node5","condition":"SUCCESS"},{"next":"node4","condition":"ELSE"}]}},{"id":"node4","data":{"textID":"standardAttack","message":"WEAK_ATTACK","animData":"ATTACK"}},{"id":"node5","data":{"message":"END"}},{"id":"node6","data":{"message":"INIT"},"next":{"type":"conditional","data":[{"next":"node7","condition":"HAS_LOW_HP"},{"next":"node8","condition":"ELSE"}]}},{"id":"node7","data":{"textID":"soyHeal","message":"HEAL_FROM_CROPS","animData":"SLURP_KOMBUCH"}},{"id":"node19","data":{"textID":"plantAttack","message":"TRY_PLANT_THREE_CROPS","action":"args","animData":"PLANT"},"next":{"type":"conditional","data":[{"next":"node5","condition":"SUCCESS"},{"next":"node4","condition":"ELSE"}]}},{"id":"node8","data":{},"next":{"type":"conditional","data":[{"next":"node1","weight":"0.65"},{"next":"node9","weight":"0.45"}],"condition":"random"}},{"id":"node9","data":{"textID":"cropAttack","message":"LAUNCH_CROPS_AT_CROPS","animData":"THROW_CROP_HUGE"},"next":{"type":"conditional","data":[{"next":"node5","condition":"SUCCESS"},{"next":"node1","condition":"ELSE"}]}},{"id":"node10","data":{},"next":{"type":"conditional","data":[{"next":"node13","condition":"HAS_LOW_HP"},{"next":"node12","condition":"ELSE"}]}},{"id":"node11","data":{"textID":"soyHealWeak","message":"HEAL_RANGE","action":"150,50","animData":"HEALSOY"}},{"id":"node12","data":{},"next":{"type":"conditional","data":[{"next":"node14","condition":"NOT_SPRING"},{"next":"node2","condition":"ELSE"}]}},{"id":"node13","data":{},"next":{"type":"conditional","data":[{"next":"node11","weight":"0.4"},{"next":"node12","weight":"0.6"}],"condition":"random"}},{"id":"node14","data":{},"next":{"type":"conditional","data":[{"next":"node15","weight":"0.6"},{"next":"node2","weight":"0.4"}],"condition":"random"}},{"id":"node15","data":{"textID":"modulateAttack","message":"MODULATE","action":"0","animData":"PLANT"}},{"id":"node16","data":{"textID":"vineSmack","message":"VINE_SMACK","animData":"VINE_SMACK"}},{"id":"node17","data":{},"next":{"type":"conditional","data":[{"next":"node3","weight":"0.6"},{"next":"node19","weight":"0.4"}],"condition":"random"}},{"id":"node20","data":{"textID":"babyToss","message":"THROW_BABY","animData":"GROW_BABY"}}]},
"test": {"nodes":[{"id":"node0","data":{"message":"INIT"},"next":"node1"},{"id":"node1","data":{"message":"TESTSKILL"}}]},
"turky": {"nodes":[{"id":"node0","data":{"message":"INIT"},"next":{"type":"conditional","data":[{"next":"node1","condition":"HAS_CROPS_READY"},{"next":"node2","condition":"ELSE"}]}},{"id":"node1","data":{"textID":"standardAttack","message":"LAUNCH_CROPS","animData":"THROW_ENEMY"}},{"id":"node2","data":{},"next":{"type":"conditional","data":[{"next":"node3","weight":"0.6"},{"next":"node4","weight":"0.4"}],"condition":"random"}},{"id":"node3","data":{"textID":"plantAttack","message":"TRY_PLANT_CROP","action":"args","animData":"TURKEY_EGG"},"next":{"type":"conditional","data":[{"next":"node5","condition":"SUCCESS"},{"next":"node4","condition":"ELSE"}]}},{"id":"node4","data":{"textID":"standardAttack","message":"WEAK_ATTACK","animData":"ATTACK"}},{"id":"node5","data":{"message":"END"}}]},
"tutorial": {"nodes":[{"id":"node0","data":{"message":"INIT"},"next":"node1"},{"id":"node1","data":{"message":"CONVINCEATRON"}}]},
"vendo": {"nodes":[{"id":"node0","data":{"message":"INIT"},"next":{"type":"conditional","data":[{"next":"node1","condition":"HAS_CROPS_READY"},{"next":"node2","condition":"ELSE"}]}},{"id":"node1","data":{"textID":"standardAttack","message":"LAUNCH_CROPS","animData":"THROW_ENEMY"}},{"id":"node2","data":{},"next":{"type":"conditional","data":[{"next":"node3","weight":"0.8"},{"next":"node4","weight":"0.2"}],"condition":"random"}},{"id":"node3","data":{"textID":"vendoAttack","message":"TRY_PLANT_CROP","action":"args","animData":"PLANT"},"next":{"type":"conditional","data":[{"next":"node5","condition":"SUCCESS"},{"next":"node4","condition":"ELSE"}]}},{"id":"node4","data":{"textID":"standardAttack","message":"WEAK_ATTACK","animData":"ATTACK"}},{"id":"node5","data":{"message":"END"}}]},
"wacg": {"nodes":[{"id":"node0","data":{"message":"INIT"},"next":"node3"},{"id":"node3","data":{"textID":"eh","message":"CARDGAME","animData":"PLANT"}}]},
"wetboy": {"nodes":[{"id":"node0","data":{"message":"INIT"},"next":{"type":"conditional","data":[{"next":"node1","condition":"HAS_CROPS_READY"},{"next":"node2","condition":"ELSE"}]}},{"id":"node1","data":{"textID":"standardAttack","message":"LAUNCH_CROPS","animData":"THROW_ENEMY"}},{"id":"node2","data":{},"next":{"type":"conditional","data":[{"next":"node3","weight":"0.4"},{"next":"node4","weight":"0.3"},{"next":"node6","weight":"0.4"}],"condition":"random"}},{"id":"node3","data":{"textID":"plantAttack","message":"TRY_PLANT_CROP","action":"args","animData":"PLANT"},"next":{"type":"conditional","data":[{"next":"node5","condition":"SUCCESS"},{"next":"node4","condition":"ELSE"}]}},{"id":"node4","data":{"textID":"standardAttack","message":"WEAK_ATTACK","animData":"ATTACK"}},{"id":"node5","data":{"message":"END"}},{"id":"node6","data":{"textID":"splashSucc","message":"SPLASH_TILE","animData":"ROCK_TOSS"}}]}
};
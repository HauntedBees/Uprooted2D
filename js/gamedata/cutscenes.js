var scripts = {
	// Farm: Opening Cutscene
	"farminit0": "_SLEEP:500",
	"farminit1": "pl_MOVE:y10",
	"farminit2": "_CUSTOM:PWIDE",
	"farminit3": "_SLEEP:500",
	"farminit4": "_PLANIM:2,0,1000",
	"farminit5": "_PLANIM:2,1,500",
	"farminit6": "_PLANIM:2,2,1500",
	"farminit7": "_PLANIM:2,1,250",
	"farminit8": "_CUSTOM:PUNWIDE",
	"farminit9": "pl_MOVE:y11",
	"farminit10": "_PLANIM:4,0,1500&pl_SETDIR:3",
	"farminit11": "_TEXT:intro1",
	"farminit12": "nathanA_ISMOVING:true&nathanA_MOVE:x21",
	"farminit13": "_TEXT:intro2&nathanA_ANIMSTATE:[2,3,2,8,true]",
	"farminit14": "_TEXT:intro3",
	"farminit15": "_CLEARTEXT&nathanA_ANIMSTATE:[2,3,1,0,false]&_SLEEP:1000",
	"farminit16": "pl_SETDIR:2&pl_MOVE:y12",
	"farminit17": "_PLANIM:4,0,1000",
	"farminit18": "pl_SETDIR:3&nathanA_ANIMSTATE:[2,4,2,8,true]&_TEXT:intro4",
	"farminit19": "_TEXT:intro(5-6)",
	"farminit20": "_CLEARTEXT&nathanA_ANIMSTATE:[2,4,1,8,false]&_PLANIM:4,3,1500",
	"farminit21": "pl_SETDIR:3&nathanA_ANIMSTATE:[2,4,2,8,true]&_TEXT:intro(7-8)",
	"farminit22": "_CLEARTEXT&nathanA_ANIMSTATE:[0,2,4,8]&nathanA_MOVE:x24",
	"farminit23": "_GO2:[\"producestand\",10,5]",
	// Produce Stand: Opening Cutscene
	"pstand0": "pl_SETDIR:1&hipster_MOVE:x6",
	"pstand1": "hipster_ISMOVING:false&_SLEEP:500",
	"pstand2": "hipster_ANIMSTATE:[2,3,2,8,true]&_TEXT:intro9",
	"pstand3": "bike_VISIBLE:true&hipster_ANIMSTATE:[0,1,4,-1,true]&_CUSTOM:HIPMOV",
	"pstand4": "hipster_ANIMSTATE:[0,3,2,8]&_TEXT:intro10",
	"pstand5": "hipster_ANIMSTATE:[0,2,4,8,false]&_TEXT:intro11",
	"pstand6": "hipster_ISMOVING:true&_TEXT:intro(12-13)",
	"pstand7": "hipster_ISMOVING:false&_TEXT:intro14",
	"pstand8": "hipster_ANIMSTATE:[0,3,2,8,true]&_TEXT:intro(15-19)",
	"pstand9": "hipster_ISMOVING:false&_TEXT:intro20",
	"pstand10": "hipster_ISMOVING:true&_TEXT:intro(21-22)",
	"pstand11": "_CLEARTEXT&hipster_ANIMSTATE:[0,4,4,-1]&_CUSTOM:HIPMOV2",
	"pstand12": "hipster_ANIMSTATE:[0,0,2,-1]&bike_VISIBLE:false&hipster_MOVE:x10",
	"pstand13": "pl_SETDIR:0&convince_VISIBLE:true&hipster_MOVE:x12",
	"pstand14": "pl_SETDIR:3&hipster_MOVE:x20",
	"pstand15": "pl_SETDIR:0&_TEXT:intro23",
	"pstand16": "_CLEARTARGET&hipster_SETTARGET&_CUSTOM:TUTORIAL",
	// Produce Stand: Completion of Opening Cutscene
	"finTut0": "_CUSTOM:LEAVETUTORIAL&_CLEARTARGET&_CUSTOM:FINISHTUTORIALATSTART&_TEXT:Pb0.0",
	"finTut1": "_TEXT:Pb0.1",
	// Produce Stand: Tutorial
	"tutBuddy0": "_TEXT:wantTut,sYes,sNo",
	"tutBuddy1": "?[{\"q\":\"d==0\",\"v\":3},{\"q\":\"d===1\",\"v\":2}]",
	"tutBuddy2": "_TEXT:noTut&_END",
	"tutBuddy3": "_CUSTOM:TUTORIAL",
	// Produce Stand: Completion of Standalone Tutorial
	"finStTut0": "_CUSTOM:LEAVETUTORIAL&_CUSTOM:FINISHTUTORIALSTANDALONE",
	// Produce Stand: Trying to head to Town before going to Farm
	"farmFirst0": "?[{\"q\":\"player.completedQuest('bigBot')\",\"v\":1},{\"q\":\"true\",\"v\":2}]",
	"farmFirst1": "_GO2:[\"firstvillage\",21,1]",
	"farmFirst2": "_TEXT:farmFirst",
	// Produce Stand: Egg Fairy
	"eggfairy0": "?[{\"q\":\"player.completedQuest('badEgg')\",\"v\":1},{\"q\":\"player.completedQuest('goodEgg')\",\"v\":2},{\"q\":\"player.hasItem('egg')\",\"v\":4},{\"q\":\"true\",\"v\":3}]",
	"eggfairy1": "_TEXT:badEggTry&_END",
	"eggfairy2": "_TEXT:goodEggTry&_END",
	"eggfairy3": "_TEXT:lakenoegg&_END",
	"eggfairy4": "_TEXT:lakeegg,sYes,sNo",
	"eggfairy5": "?[{\"q\":\"d==0\",\"v\":7},{\"q\":\"d===1\",\"v\":6}]",
	"eggfairy6": "_TEXT:lakeegg.reject&_END",
	"eggfairy7": "_TEXT:lakeegg.okay&_TAKE:egg,1",
	"eggfairy8": "_TEXT:dotdotdot",
	"eggfairy9": "eggFairy_VISIBLE:true&_TEXT:lakeegg(1-2)",
	"eggfairy10": "_TEXT:lakeegg3,sYes,sNo",
	"eggfairy11": "?[{\"q\":\"d===0\",\"v\":12},{\"q\":\"d===1\",\"v\":14}]",
	"eggfairy12": "_TEXT:lakeeggLie&eggFairy_SHIFTY:2&_TAKE:egg,999&_TAKE:quail,999&_TAKE:goose,999&_TAKE:turkey,999&_TAKE:platypus,999",
	"eggfairy13": "_TEXT:lakeFinish&eggFairy_VISIBLE:false&_COMPLETEQUEST:badEgg&_END",
	"eggfairy14": "_TEXT:lakeeggTruth&eggFairy_SHIFTY:1&_GIVE:egg,1&_GIVE:goldegg,1",
	"eggfairy15": "_TEXT:lakeFinish&eggFairy_VISIBLE:false&_COMPLETEQUEST:goodEgg",
	// Farm: First Boss (Big Bot)
	"bigBot0": "_TEXT:B1.(0-4)",
	"bigBot1": "_FIGHT:bigBot",
	"bigBotL0": "_TEXT:B1.5",
	"bigBotL1": "_FIGHT:bigBot",
	"bigBotW0": "_COMPLETEQUEST:bigBot&_TEXT:Pb1.(0-1)",
	"bigBotW1": "_TEXT:Pb1.2,Pb1.2a,Pb1.2b",
	"bigBotW2": "?[{\"q\":\"d===0\",\"v\":3},{\"q\":\"d===1\",\"v\":4}]",
	"bigBotW3": "_TEXT:Pb1.2a0&_SETSTATE:5&_GIVE:beet,10&_GIVE:banana,5&_GIVE:spinach,5&_GIVE:rhubarb,2&_GIVE:ginger,10",
	"bigBotW4": "_TEXT:Pb1.2b0&_GIVE:~modulator,1",
	"bigBotW5": "_TEXT:Pb1.(3-5)",
	// Misc.: Standard Enemy
	"enemy0": "_CUSTOM:ENEMY0",
	"enemy1": "_CUSTOM:ENEMY1",
	// Farm: Beehive
	"FarmHive0": "targ_VISIBLE:false&_TEXT:hiveGet&_GIVE:~beehive,1&_GIVE:beeB,5",
	"FarmHive1": "_CUSTOM:BEEGUARDIANAPPEAR&_TEXT:FarmHive(0-3)",
	"FarmHive2": "_TEXT:FarmHive4&_CLEARTARGET",
	// Forest: Optional Boss (Turkey)
	"turky0": "_TEXT:bossturky(0-1)",
	"turky1": "_FIGHT:bossturky,turky,turky",
	// Forest: Beehive
	"ForestHive0": "targ_VISIBLE:false&_TEXT:hiveGet&_GIVE:~beehive,1&_GIVE:beeB,5",
	"ForestHive1": "_TEXT:ForestHive(0-1)",
	"ForestHive2": "pl_SETDIR:2&_TEXT:ForestHive2",
	"ForestHive3": "_FIGHT:bear",
	// Forest: Bad Influence Rabbit
	"rabbit0": "?[{\"q\":\"player.completedQuest('rabbitShit')\",\"v\":1},{\"q\":\"true\",\"v\":2}]",
	"rabbit1": "_TEXT:rabbitOut&_END",
	"rabbit2": "_TEXT:rabbit0",
	"rabbit3": "_TEXT:rabbit1,buyfertilizer,sNo",
	"rabbit4": "?[{\"q\":\"d===1\",\"v\":5},{\"q\":\"player.monies < 500\",\"v\":6},{\"q\":\"d===0\",\"v\":7}]",
	"rabbit5": "_TEXT:rabbit2&_END",
	"rabbit6": "_TEXT:rabbit3&_END",
	"rabbit7": "_MONEY:-500&_GIVE:~strongsoil&_COMPLETEQUEST:rabbitShit&_TEXT:rabbit(4-7)",
	// Forest: Sad Fish
	"sadfish0": "?[{\"q\":\"player.completedQuest('fishyTalk')\",\"v\":3},{\"q\":\"true\",\"v\":1}]",
	"sadfish1": "targ_VISIBLE:true&_TEXT:fishyFriend(0-1)",
	"sadfish2": "_COMPLETEQUEST:fishyTalk&_TEXT:fishyFriend2&_SETSTATE:4",
	"sadfish3": "targ_VISIBLE:true&_TEXT:fishyFriendX",
	"sadfish4": "targ_VISIBLE:false&_QUIT",
	// Forest: Lime
	"lime0": "?[{\"q\":\"player.completedQuest('limeAndTheCoconut')\",\"v\":3},{\"q\":\"player.hasQuest('limeAndTheCoconut')\",\"v\":4},{\"q\":\"true\",\"v\":1}]",
	"lime1": "_STARTQUEST:limeAndTheCoconut&_TEXT:lime(0-2)",
	"lime2": "_TEXT:lime3&_END",
	"lime3": "_TEXT:lime.complete&_END",
	"lime4": "_CUSTOM:LIMESTART",
	"lime5": "??LIMENEXT",
	"lime6": "_TEXT:lime.lemon2",
	"lime7": "_TEXT:lime.lemon3&_END",
	"lime8": "_TEXT:lime.banana2",
	"lime9": "_COMPLETEQUEST:limeAndTheCoconut&_TAKE:banana,1&_GIVE:corn,10&_TEXT:lime.banana3&_END",
	"lime10": "_TEXT:lime.corn2",
	"lime11": "_COMPLETEQUEST:limeAndTheCoconut&_TAKE:corn,1&_GIVE:banana,10&_TEXT:lime.corn3&_END",
	"lime12": "_COMPLETEQUEST:limeAndTheCoconut&_TAKE:goldegg,1&_GIVE:coconut,2&_TEXT:lime.egg(2-3)",
	// Below Village: Beehive
	"BelowHive0": "targ_VISIBLE:false&_TEXT:hiveGet&_GIVE:~beehive,1&_GIVE:beeB,5&_CLEARTARGET",
	// Research Lab: Seed Shooters
	"seedShot0": "?[{\"q\":\"game.target.hasShot-- > 0\",\"v\":1},{\"q\":\"true\",\"v\":2}]",
	"seedShot1": "_QUIT",
	"seedShot2": "_TEXT:seedshot&_CUSTOM:SEEDSHOT",
	"seedShot3": "?[{\"q\":\"player.health > 0\",\"v\":1},{\"q\":\"true\",\"v\":4}]",
	"seedShot4": "_TEXT:seedshotdeath",
	"seedShot5": "_CUSTOM:SEEDSHOTKILL",
	// Research Lab: RAPBATTLE
	"rap0": "?[{\"q\":\"player.completedQuest('rapbattle')\",\"v\":3},{\"q\":\"player.hasQuest('rapbattle')\",\"v\":4},{\"q\":\"true\",\"v\":1}]",
	"rap1": "_STARTQUEST:rapbattle&_TEXT:rap(0-2)",
	"rap2": "_TEXT:rap3&_END",
	"rap3": "_TEXT:rap.thanks&_END",
	"rap4": "_CUSTOM:RAPSTART",
	"rap5": "??RAPNEXT",
	"rap6": "_TAKE:garlic,1&_TEXT:rap.garlic(2-5)",
	"rap7": "_COMPLETEQUEST:rapbattle&_GIVE:battery,10&_TEXT:rap.normalgift&_END",
	"rap8": "_TAKE:rice,1&_TEXT:rap.rice(2-3)",
	"rap9": "_TEXT:rap.rice4&_SETSTATE:7",
	"rap10": "_TEXT:rap.coconut(2-6)",
	"rap11": "_COMPLETEQUEST:rapbattle&_TAKE:coconut,1&_GIVE:gmocorn,2&_TEXT:rap.coconut7&_END",
	// Research Lab: Second Boss (Jeff)
	"jeff0": "_TEXT:B2.(0-11)",
	"jeff1": "_FIGHT:ScienceMan",
	"jeffL0": "_TEXT:B2.12",
	"jeffL1": "_FIGHT:ScienceMan",
	"jeffW0": "_COMPLETEQUEST:researchLab&_TEXT:Pb2.(0-9)",
	"jeffW1": "_TEXT:Pb2.10,Pb2.10a,Pb2.10b,Pb2.10c",
	"jeffW2": "?[{\"q\":\"d===0\",\"v\":3},{\"q\":\"d===1\",\"v\":4},{\"q\":\"d===2\",\"v\":5}]",
	"jeffW3": "_TEXT:Pb2.10a0&_SETSTATE:6&_GIVE:~shooter,1",
	"jeffW4": "_TEXT:Pb2.10b0&_SETSTATE:6&_GIVE:apple,10&_GIVE:apricot,10&_GIVE:kiwi,5&_GIVE:mango,5&_GIVE:lemon,5",
	"jeffW5": "_TEXT:Pb2.10c0&_LEVELUP&_LEVELUP&_LEVELUP",
	"jeffW6": "_TEXT:Pb2.(11-13)",
	// Bridge: First Worker
	"workerA0": "?[{\"q\":\"player.hasQuestState('helpSeaMonster', 'help')\",\"v\":3},{\"q\":\"true\",\"v\":1}]",
	"workerA1": "_TEXT:constr1.fr1",
	"workerA2": "_TEXT:constr1.fr2&_END",
	"workerA3": "_TEXT:constr1.foe1",
	"workerA4": "_FIGHT:Worker",
	// Bridge: Regular Worker
	"workerB0": "?[{\"q\":\"player.hasQuestState('helpSeaMonster', 'help')\",\"v\":2},{\"q\":\"true\",\"v\":1}]",
	"workerB1": "_TEXT:w22&_END",
	"workerB2": "_TEXT:w21",
	"workerB3": "_FIGHT:Worker",
	// Bridge: Third Boss (Worker Chief)
	"workerX0": "?[{\"q\":\"player.hasQuestState('getHeart', 'nope')\",\"v\":11},{\"q\":\"true\",\"v\":1}]",
	"workerX1": "?[{\"q\":\"player.hasQuestState('helpSeaMonster', 'help')\",\"v\":9},{\"q\":\"true\",\"v\":2}]",
	"workerX2": "?[{\"q\":\"player.hasQuestState('getHeart', 'hold')\",\"v\":19},{\"q\":\"true\",\"v\":3}]",
	"workerX3": "?[{\"q\":\"player.hasQuestState('getHeart', 'heart')\",\"v\":21},{\"q\":\"true\",\"v\":4}]",
	"workerX4": "?[{\"q\":\"player.hasQuestState('getHeart', 'weirdheart')\",\"v\":12},{\"q\":\"true\",\"v\":5}]",
	"workerX5": "?[{\"q\":\"player.hasQuestState('getHeart', 'yep')\",\"v\":8},{\"q\":\"true\",\"v\":6}]",
	"workerX6": "_TEXT:bworker(1-8)",
	"workerX7": "_TEXT:bworker9&_SETQUEST:getHeart,yep&_END",
	"workerX8": "_TEXT:bworker10&_END",
	"workerX9": "_SETQUEST:getHeart,nope&_TEXT:bworkerMad(1-3)",
	"workerX10": "_FIGHT:Worker,BossWorker,Worker",
	"workerX11": "_TEXT:bworkerMad4&_SETSTATE:10",
	"workerX12": "_TEXT:bworkerC(1-3)",
	"workerX13": "_TEXT:bworkerC4,sYes,sNo",
	"workerX14": "?[{\"q\":\"d===0\",\"v\":16},{\"q\":\"d===1\",\"v\":15}]",
	"workerX15": "_TEXT:bworkerCN&_SETQUEST:getHeart,hold&_END",
	"workerX16": "_TEXT:bworkerCY",
	"workerX17": "_TEXT:bworkerB4",
	"workerX18": "_CUSTOM:CONSTWORKWIN&_END",
	"workerX19": "_TEXT:bworkerC5,sYes,sNo",
	"workerX20": "?[{\"q\":\"d===0\",\"v\":16},{\"q\":\"d===1\",\"v\":15}]",
	"workerX21": "_TEXT:bworkerB(2-4)&_SETSTATE:18",
	"workerF0": "_TEXT:bworkerMad(5-6)",
	"workerF1": "_CUSTOM:CONSTWORKFIGHT&_QUIT",
	// Underwater: Third Boss (Sea Monster)
	"seamon0": "?[{\"q\":\"player.completedQuest('helpSeaMonster')\",\"v\":1},{\"q\":\"true\",\"v\":2}]",
	"seamon1": "_TEXT:smD7&_END",
	"seamon2": "?[{\"q\":\"player.hasQuestState('helpSeaMonster', 'gotEgg')\",\"v\":14},{\"q\":\"true\",\"v\":3}]",
	"seamon3": "?[{\"q\":\"player.hasQuestState('helpSeaMonster', 'help')\",\"v\":6},{\"q\":\"true\",\"v\":4}]",
	"seamon4": "?[{\"q\":\"player.hasQuestState('helpSeaMonster', 'fight')\",\"v\":16},{\"q\":\"true\",\"v\":5}]",
	"seamon5": "?[{\"q\":\"player.hasQuestState('helpSeaMonster', 'wait')\",\"v\":17},{\"q\":\"true\",\"v\":7}]",
	"seamon6": "_TEXT:smA2&_END",
	"seamon7": "_TEXT:sm(1-3)",
	"seamon8": "_TEXT:sm4,sm4c1,sm4c2,sm4c3",
	"seamon9": "?[{\"q\":\"d===0\",\"v\":10},{\"q\":\"d===1\",\"v\":12},{\"q\":\"d===2\",\"v\":11}]",
	"seamon10": "_SETQUEST:helpSeaMonster,help&_TEXT:smA1&_END",
	"seamon11": "_SETQUEST:helpSeaMonster,wait&_TEXT:smC1&_END",
	"seamon12": "_SETQUEST:helpSeaMonster,fight&_TEXT:smB1",
	"seamon13": "_FIGHT:seaHandR,seaMan,seaHandL&_END",
	"seamon14": "_TEXT:smD(1-4)",
	"seamon15": "_GO2:[\"bridge\",8,4.5,\"FishMoved\"]",
	"seamon16": "_TEXT:smB2&_SETSTATE:13",
	"seamon17": "_TEXT:sm5,sm4c1,sm4c2,sm4c3",
	"seamon18": "?[{\"q\":\"d===0\",\"v\":10},{\"q\":\"d===1\",\"v\":12},{\"q\":\"d===2\",\"v\":11}]",
	"deadsea0": "_CUSTOM:DEADFISH",
	"deadsea1": "_TEXT:bworkerA(2-3)",
	// Bridge: Sea Monster helps you move debris
	"seahelp0": "_CUSTOM:SEAHELP0",
	"seahelp1": "_CUSTOM:SEAHELP1",
	"seahelp2": "_COMPLETEQUEST:helpSeaMonster&_COMPLETEQUEST:getHeart&_TEXT:smD7",
	// Underwater: Pirate Sea Monk
	"piratemonk0": "?[{\"q\":\"player.completedQuest('seamonkey')\",\"v\":2},{\"q\":\"true\",\"v\":1}]",
	"piratemonk1": "?[{\"q\":\"player.hasQuestState('seamonkey', 'looking')\",\"v\":2},{\"q\":\"true\",\"v\":3}]",
	"piratemonk2": "_TEXT:pirateMonkR5&_END",
	"piratemonk3": "?[{\"q\":\"player.hasQuest('seamonkey')\",\"v\":6},{\"q\":\"true\",\"v\":4}]",
	"piratemonk4": "_TEXT:pirateMonk(1-3)",
	"piratemonk5": "_TEXT:pirateMonk4&_SETQUEST:seamonkey,waitingForItem&_END",
	"piratemonk6": "_CUSTOM:PIRATESTART",
	"piratemonk7": "??PIRATENEXT",
	"piratemonk8": "_COMPLETEQUEST:seamonkey&_TEXT:pirateMonkR(2-4)",
	"piratemonk9": "_GIVE:tomato,5&_GIVE:ginger,4&_GIVE:pineapple,3&_GIVE:bellpepper,2&_GIVE:greenshroom,1&_TEXT:pirateMonkR5&_END",
	"piratemonk10": "_TEXT:pirateMonkG(2-5)",
	"piratemonk11": "_TEXT:pirateMonkG6&_TAKE:gmocorn,1&_SETQUEST:seamonkey,looking",
	// Underwater: Pirate Sea Monk's Treasure
	"seamonkey0": "?[{\"q\":\"game.target.open\",\"v\":1},{\"q\":\"player.hasQuestState('seamonkey', 'looking')\",\"v\":3},{\"q\":\"true\",\"v\":2}]",
	"seamonkey1": "_TEXT:openchest&_END",
	"seamonkey2": "_TEXT:chestLocked&_END",
	"seamonkey3": "_TEXT:chestUnlock(1-2)",
	"seamonkey4": "_CUSTOM:PIRATETREASURE",
	// Underwater: Kelp Boy's Vase
	"kelpVase0": "?[{\"q\":\"player.completedQuest('kelpBoy')\",\"v\":1},{\"q\":\"true\",\"v\":2}]",
	"kelpVase1": "_TEXT:vaseFoundBee&_END",
	"kelpVase2": "_TEXT:vaseFound,sYes,sNo",
	"kelpVase3": "?[{\"q\":\"d===0\",\"v\":5},{\"q\":\"d===1\",\"v\":4}]",
	"kelpVase4": "_TEXT:vaseDont&_END",
	"kelpVase5": "_TEXT:vaseDo0&targ_SHIFTY:7&KelpBoy_SHIFTY:7&targ_SOLID:false&_SETQUEST:kelpBoy,fuck&_PUSHCLEAREDTARGET:Vase",
	"kelpVase6": "_TEXT:vaseDo(1-2)",
	"kelpVase7": "_FIGHT:kelpBoy",
	// Underwater: Kelp Boy
	"kelpBoy0": "?[{\"q\":\"player.hasQuest('kelpBoy')\",\"v\":2},{\"q\":\"true\",\"v\":1}]",
	"kelpBoy1": "_TEXT:kelpBoy1&_END",
	"kelpBoy2": "_TEXT:vaseDo3",
	"kelpBoy3": "_FIGHT:kelpBoy",
	// Underwater: Kelp Boy Defeated
	"kelpDead0": "_CUSTOM:KELPDEAD",
	// Underwater: Kelp Boy's Beehive
	"kelpHive0": "?[{\"q\":\"player.hasQuestState('kelpBoy', 'deadass')\",\"v\":4},{\"q\":\"player.hasQuest('kelpBoy')\",\"v\":2},{\"q\":\"true\",\"v\":1}]",
	"kelpHive1": "_TEXT:vaseDo5&_SETSTATE:3",
	"kelpHive2": "_TEXT:vaseDo4",
	"kelpHive3": "_FIGHT:kelpBoy",
	"kelpHive4": "_TEXT:hiveGet&_GIVE:~beehive&_GIVE:beeB,5&_CLEARTARGET&_COMPLETEQUEST:kelpBoy",
	// Underwater: Kelp Boy Defeated At Beehive
	"kelpDeadBee0": "_CUSTOM:KELPDEAD",
	"kelpDeadBee1": "_TEXT:hiveGet&_GIVE:~beehive&_GIVE:beeB,5&_CLEARTARGET&_COMPLETEQUEST:kelpBoy",
	// Fake Farm: Flat Tire Opening Cutscene
	"flatTire0": "_BLACKTEXT:fakeFarmS",
	"flatTire1": "_TRANSITIONANIM&_TEXT:fakeFarm0",
	"flatTire2": "targ_ISMOVING:true&targ_MOVE:x22",
	"flatTire3": "targ_ISMOVING:false&pl_SETDIR:1&_TEXT:fakeFarm(1-4)",
	"flatTire4": "targ_SETDIR:1&targ_ISMOVING:true&targ_MOVE:x13",
	"flatTire5": "targ_VISIBLE:false&targ_CLEARINTERACT&_QUIT",
	// Fake Farm: Farm TV Cutscene
	"farmTV0": "_TEXT:farmTV0",
	"farmTV1": "_CLEARTEXT&pl_MOVE:y6",
	"farmTV2": "pl_MOVE:x14.5",
	"farmTV3": "pl_MOVE:y3.75",
	"farmTV4": "_TEXT:farmTV(1-4)",
	"farmTV5": "_CUSTOM:FARMTVEND",
	// Fake Farm: Control Panel
	"hotbox0": "?[{\"q\":\"player.hasQuestState('fakeFarm', 1)\",\"v\":1},{\"q\":\"player.hasQuestState('fakeFarm', 2)\",\"v\":2},{\"q\":\"true\",\"v\":3}]",
	"hotbox1": "_TEXT:hotboxX&_END",
	"hotbox2": "_TEXT:hotbox2&_END",
	"hotbox3": "_TEXT:hotbox1",
	"hotbox4": "_FIGHT:machineA,machineB,machineC,machineD",
	"hotboxEnd0": "_CUSTOM:HOTBOXBEAT",
	// Fake Farm: Power Outlet
	"outlet0": "?[{\"q\":\"player.hasQuestState('fakeFarm', 1)\",\"v\":1},{\"q\":\"true\",\"v\":2}]",
	"outlet1": "_TEXT:farmTVunplug3&_END",
	"outlet2": "_TEXT:farmTVunplug(0-1)",
	"outlet3": "_CUSTOM:UNPLUGOUTLET",
	// Fake Farm: Lawn Mower
	"mower0": "_CUSTOM:MOWER0",
	"mower1": "_FIGHT:lawnmower",
	// Fake Farm: Busted Truck
	"badTruck0": "?[{\"q\":\"player.completedQuest('gotTire')\",\"v\":2},{\"q\":\"true\",\"v\":1}]",
	"badTruck1": "_TEXT:bustedTruck0&_END",
	"badTruck2": "_CUSTOM:FIXTIRE",
	// Fake Farm: Fourth Boss (HOUSEKEEPER)
	"exitBarn0": "?[{\"q\":\"player.hasQuest('gotTire')\",\"v\":2},{\"q\":\"true\",\"v\":1}]",
	"exitBarn1": "_CUSTOM:EXITBARN&_END",
	"exitBarn2": "?[{\"q\":\"player.hasQuestState('gotTire',1)\",\"v\":9},{\"q\":\"true\",\"v\":3}]",
	"exitBarn3": "_TEXT:fakeFarm5",
	"exitBarn4": "_CLEARTEXT&_CUSTOM:SETUPJEFF&FarmerJeff_MOVE:y29",
	"exitBarn5": "FarmerJeff_ISMOVING:false&_TEXT:fakeFarm(6-7)",
	"exitBarn6": "HK_ISMOVING:true&_TEXT:fakeFarm8",
	"exitBarn7": "_TEXT:fakeFarm(9-12)",
	"exitBarn8": "_FIGHT:router,housekeeper,outlet,server",
	"exitBarn9": "_TEXT:fakeFarm18&_SETSTATE:8",
	// Fake Farm: Beat HOUSEKEEPER
	"beatBarn0": "_TEXT:fakeFarm(13-16)",
	"beatBarn1": "_TEXT:fakeFarm17&FarmerJeff_SETTARGET&_CLEARTARGET&HK_SETTARGET&_CLEARTARGET&_COMPLETEQUEST:gotTire&_CUSTOM:EXITBARN",
	// Fake Farm: Look at HOUSEKEEPER
	"housekeeper0": "?[{\"q\":\"player.hasQuestState('gotTire', 1)\",\"v\":2},{\"q\":\"true\",\"v\":1}]",
	"housekeeper1": "_TEXT:HK.s0&_END",
	"housekeeper2": "_TEXT:HK.s(1-2)",
	// Fake Farm: Crouton
	"crouton0": "?[{\"q\":\"player.completedQuest('croutonsFishingAdventure')\",\"v\":1},{\"q\":\"player.hasQuest('croutonsFishingAdventure')\",\"v\":4},{\"q\":\"true\",\"v\":2}]",
	"crouton1": "_TEXT:arf.thanks&_END",
	"crouton2": "_STARTQUEST:croutonsFishingAdventure&_TEXT:arf(0-2)",
	"crouton3": "_TEXT:arf3&_END",
	"crouton4": "_CUSTOM:CROUTONSTART",
	"crouton5": "??CROUTONNEXT",
	"crouton6": "_TEXT:arf.spear1&_END",
	"crouton7": "_TEXT:arf.good1&_GIVE:fodder,20",
	"crouton8": "_TEXT:arf.good2&_COMPLETEQUEST:croutonsFishingAdventure&_END",
	"crouton9": "_TEXT:arf.ultra1&_GIVE:goodfood,20&_SETSTATE:8",
	// Misc.: Truck
	"truck0": "_CUSTOM:TRUCKSTART",
	"truck1": "??TRUCKNEXT",
	// South City: Entrance
	"southcity0": "_TEXT:entercity0",
	"southcity1": "pl_SETDIR:1&skumpy_VISIBLE:true&_TEXT:entercity1",
	"southcity2": "skumpy_VISIBLE:false&_CLEARTEXT&pl_MOVE:y43",
	"southcity3": "pl_MOVE:x41",
	"southcity4": "pl_MOVE:y42",
	"southcity5": "_CUSTOM:ENTERSKUMPY&pl_MOVE:y40.75",
	"southcity6": "_TEXT:entercity2",
	"southcity7": "_CLEARTEXT&pl_MOVE:x38",
	"southcity8": "_CUSTOM:FORCEYZERO&pl_MOVE:y39",
	"southcity9": "pl_MOVE:x41",
	"southcity10": "pl_MOVE:y39.75",
	"southcity11": "_HISPEED&bruno_MOVE:y43",
	"southcity12": "bruno_SETDIR:1&bruno_MOVE:x41",
	"southcity13": "bruno_SETDIR:0&bruno_MOVE:y40.75",
	"southcity14": "bruno_SETDIR:1&bruno_MOVE:x40",
	"southcity15": "bruno_SETDIR:0&bruno_ISMOVING:false&_TEXT:entercity(3-11)",
	"southcity16": "_LOSPEED&_TEXT:entercity12,mobchoice0,mobchoice1",
	"southcity17": "?[{\"q\":\"d===0\",\"v\":18},{\"q\":\"d===1\",\"v\":22}]",
	"southcity18": "_CUSTOM:SKUMPYTURN&_TEXT:entercity0.(0-3)",
	"southcity19": "bruno_SETDIR:0&_TEXT:entercity0.4",
	"southcity20": "bruno_SETDIR:3&_TEXT:entercity0.5",
	"southcity21": "_FIGHT:mrbruno&_END",
	"southcity22": "_TEXT:entercity1.(0-5)",
	"southcity23": "bruno_SETDIR:3&bruno_ISMOVING:true&bruno_MOVE:x41",
	"southcity24": "bruno_SETDIR:2&bruno_MOVE:y42",
	"southcity25": "bruno_SETDIR:3&bruno_MOVE:x44",
	"southcity26": "bruno_SETDIR:0&bruno_MOVE:y33",
	"southcity27": "_CUSTOM:SKUMPYCLEAN&_TEXT:entercity1.6",
	"southcity28": "_CUSTOM:SKUMPYPOP&_TEXT:entercity1.7",
	"southcity29": "_TEXT:entercity2.(0-9)",
	"southcity30": "_CUSTOM:SKUMPYEXIT",
	// South City: Beat Mobster
	"beatbruno0": "_CUSTOM:BRUNOBEAT&_TEXT:entercity0.pb(0-2)",
	"beatbruno1": "_TEXT:entercity2.(0-9)",
	"beatbruno2": "_CUSTOM:SKUMPYEXIT",
	// South City: BAD END
	"badEnd0": "_TEXT:entercityBAD(0-9)",
	"badEnd1": "_CLEARTEXT&pl_MOVE:y21",
	"badEnd2": "_CUSTOM:WAIT",
	"badEnd3": "_CUSTOM:GOTOTITLE",
	// South City: Abuelita
	"abuela0": "?[{\"q\":\"player.completedQuest('abuelitaBonita')\",\"v\":1},{\"q\":\"player.hasQuest('abuelitaBonita')\",\"v\":4},{\"q\":\"true\",\"v\":2}]",
	"abuela1": "_TEXT:kindLadyThanks&_END",
	"abuela2": "_STARTQUEST:abuelitaBonita&_TEXT:kindLady(0-4)",
	"abuela3": "_TEXT:kindLady5&_END",
	"abuela4": "_CUSTOM:ABUELASTART",
	"abuela5": "??ABUELANEXT",
	"abuela6": "_TEXT:kindLadyNorm(1-2)",
	"abuela7": "_GIVE:asparagus,20&_MONEY:10000&_TEXT:kindLadyNorm3&_COMPLETEQUEST:abuelitaBonita&_END",
	"abuela8": "_TEXT:kindLadyGood(1-2)",
	"abuela9": "_GIVE:notdrugs,6&_MONEY:20000&_TEXT:kindLadyGood3&_COMPLETEQUEST:abuelitaBonita",
	// South City: Fifth Boss (DON VAGANTE)
	"mobBoss0": "_TEXT:mobBoss(0-15)",
	"mobBoss1": "_FIGHT:mobBoss,mobsty2,mobsty2",
	"mobLost0": "_TEXT:mobBack1",
	"mobLost1": "_FIGHT:mobBoss,mobsty2,mobsty2",
	"mobWon0": "_TEXT:beatMob(0-10)",
	"mobWon1": "_CUSTOM:MOBFLEE&_TEXT:beatMob11",
	// North City: Mushroom Man
	"mushman0": "?[{\"q\":\"player.completedQuest('stonehenge')\",\"v\":1},{\"q\":\"player.hasQuest('stonehenge')\",\"v\":5},{\"q\":\"true\",\"v\":4}]",
	"mushman1": "?[{\"q\":\"player.completedQuest('youarebad')\",\"v\":2},{\"q\":\"true\",\"v\":3}]",
	"mushman2": "_TEXT:mushManCorpse&_END",
	"mushman3": "_TEXT:mushManThanks&_END",
	"mushman4": "_TEXT:mushMan0&_END",
	"mushman5": "_TEXT:mushMan1",
	"mushman6": "_CUSTOM:MUSHSTART",
	"mushman7": "??MUSHNEXT",
	"mushman8": "_TEXT:mushManGive1",
	"mushman9": "_GIVE:chestnut,20&_TEXT:mushManNorm(0-2)&_COMPLETEQUEST:stonehenge&_END",
	"mushman10": "_TEXT:mushManGive1",
	"mushman11": "_GIVE:lotus,20&_TEXT:mushManGood(0-2)&_COMPLETEQUEST:stonehenge&_END",
	"mushman12": "_TEXT:mushManGive1",
	"mushman13": "_TEXT:mushManPoison0",
	"mushman14": "targ_SHIFTY:7&_TEXT:mushManPoison1",
	"mushman15": "_TEXT:mushManPoison2&_COMPLETEQUEST:stonehenge&_COMPLETEQUEST:youarebad",
	// North City: Radish on Counter
	"freeRadish0": "?[{\"q\":\"player.completedQuest('freeRadish')\",\"v\":2},{\"q\":\"true\",\"v\":1}]",
	"freeRadish1": "_COMPLETEQUEST:freeRadish&_GIVE:radish,5&_TEXT:foundRadish0&_END",
	"freeRadish2": "_TEXT:foundRadish1",
	// North City: Some Nerd
	"someNerd0": "?[{\"q\":\"Math.random() < 0.4\",\"v\":1},{\"q\":\"Math.random() < 0.5\",\"v\":2},{\"q\":\"true\",\"v\":3}]",
	"someNerd1": "_TEXT:someNerd0&_END",
	"someNerd2": "_TEXT:someNerd1&_END",
	"someNerd3": "_TEXT:someNerd2",
	// North City: Jeromy (crazy4trout)'s Fishing Supplies 
	"crazy4trout0": "_TEXT:troutMan0,troutChoice0,troutChoice1,troutChoice2,troutChoice3,troutChoice4",
	"crazy4trout1": "?[{\"q\":\"d===0\",\"v\":4},{\"q\":\"d===1\",\"v\":6},{\"q\":\"d===2\",\"v\":8},{\"q\":\"d===3\",\"v\":10},{\"q\":\"d===4\",\"v\":2}]",
	"crazy4trout2": "_TEXT:troutManNone&_END",
	"crazy4trout3": "_TEXT:troutManNotEnough&_END",
	"crazy4trout4": "?[{\"q\":\"player.monies<1000\",\"v\":3},{\"q\":\"true\",\"v\":5}]",
	"crazy4trout5": "_MONEY:-1000&_GIVE:metalrod,5&_TEXT:troutManBuy&_END",
	"crazy4trout6": "?[{\"q\":\"player.monies<500\",\"v\":3},{\"q\":\"true\",\"v\":7}]",
	"crazy4trout7": "_MONEY:-500&_GIVE:net,10&_TEXT:troutManBuy&_END",
	"crazy4trout8": "?[{\"q\":\"player.monies<1000\",\"v\":3},{\"q\":\"true\",\"v\":9}]",
	"crazy4trout9": "_MONEY:-1000&_GIVE:bignet,10&_TEXT:troutManBuy&_END",
	"crazy4trout10": "?[{\"q\":\"player.monies<1000\",\"v\":3},{\"q\":\"true\",\"v\":11}]",
	"crazy4trout11": "_MONEY:-1000&_GIVE:spear,5&_TEXT:troutManBuy",
	// North City: Brandt
	"brandt0": "?[{\"q\":\"player.completedQuest('theGoodSpanch')\",\"v\":2},{\"q\":\"true\",\"v\":1}]",
	"brandt1": "_COMPLETEQUEST:theGoodSpanch&_GIVE:spinach,100&_TEXT:bmw(0-1)&_END",
	"brandt2": "_TEXT:bmw2",
	// North City: Cash2 Investor
	"cashBoy0": "_TEXT:cashMan0,sNo,sYes",
	"cashBoy1": "?[{\"q\":\"d===0\",\"v\":2},{\"q\":\"d===1\",\"v\":3}]",
	"cashBoy2": "_TEXT:cashManNo&_END",
	"cashBoy3": "_TEXT:cashManYes(0-8)",
	// North City: Cash2 ATM
	"atm0": "_C2TEXT:atm0,atmc0,atmc1,atmc2",
	"atm1": "?[{\"q\":\"d===0\",\"v\":3},{\"q\":\"d===1\",\"v\":6},{\"q\":\"d===2\",\"v\":2}]",
	"atm2": "_TEXT:atmX&_END",
	"atm3": "?[{\"q\":\"player.monies<1000\",\"v\":4},{\"q\":\"true\",\"v\":5}]",
	"atm4": "_TEXT:atmc0.X&_END",
	"atm5": "_CUSTOM:C2BUY&_C2TEXT:atmc0.0&_END",
	"atm6": "?[{\"q\":\"player.c2<1\",\"v\":7},{\"q\":\"true\",\"v\":8}]",
	"atm7": "_TEXT:atmc1.X&_END",
	"atm8": "_CUSTOM:C2SELL&_C2TEXT:atmc1.0&_END",
	// North City: Bank Robbery
	"robber0": "_TEXT:robber(0-1)",
	"robber1": "_FIGHT:robber,robber",
	// North City: Food2 Entrance
	"foodDoor0": "?[{\"q\":\"player.completedQuest('keycard')\",\"v\":3},{\"q\":\"player.hasQuest('keycard')\",\"v\":2},{\"q\":\"true\",\"v\":1}]",
	"foodDoor1": "_TEXT:foodEnter0&_END",
	"foodDoor2": "_TEXT:foodEnter2&_END",
	"foodDoor3": "_TEXT:foodEnter1&_CLEARTARGET",
	// North City: Sixth Boss (DWEEBLORD)
	"keycard0": "_STARTQUEST:keycard&_TEXT:keycard0",
	"keycard1": "_CLEARTARGET&_QUIT",
	"keytrap0": "?[{\"q\":\"player.hasQuest('keycard')\",\"v\":2},{\"q\":\"true\",\"v\":1}]",
	"keytrap1": "_QUIT",
	"keytrap2": "dweeb_SHIFTY:1&_TEXT:keycard1&_CUSTOM:SCREENSHAKE&_CUSTOM:DESTROYBUILDING",
	"keytrap3": "_CLEARTEXT&mech_VISIBLE:true&pl_MOVE:y22.25",
	"keytrap4": "_HISPEED&dweeb_SHIFTY:3&dweeb_SETPOSX:44.5&_CUSTOM:FORCEYZERO&dweeb_MOVE:y25.25",
	"keytrap5": "_LOSPEED&_TEXT:keycard3",
	"keytrap6": "_FIGHT:dweebLord",
	"keyfail0": "_TEXT:keycard4",
	"keyfail1": "_FIGHT:dweebLord",
	"keywin0": "_COMPLETEQUEST:keycard&_TEXT:keycard5",
	"keywin1": "_HISPEED&_CUSTOM:FORCEYZERO&dweeb_MOVE:y15",
	"keywin2": "_LOSPEED&_CUSTOM:UNFORCEYZERO&dweeb_SETTARGET&_CLEARTARGET&_TEXT:keycard6",
	"keywin3": "mech_SETTARGET&_CLEARTARGET&scrungus_SETTARGET&_CLEARTARGET&keytrap_SETTARGET&_CLEARTARGET&_QUIT",
	// Food2: First Floor
	"food2Start0": "_TEXT:enterHQ(0-3)",
	// Food2: Third Floor
	"food2Third0": "_TEXT:intercom(0-6)",
	// Food2: Seventh Boss (Beckett)
	"food2Fifth0": "_TEXT:confront(0-12)",
	"food2Fifth1": "_FIGHT:beckett",
	"food2Lost0": "_TEXT:beckettBack0",
	"food2Lost1": "_FIGHT:beckett",
	"food2Beat0": "_TEXT:postBeckett(0-2)",
	// Food2: Final Boss (Nathan)
	"final0": "_TEXT:final(0-25)",
	// Misc.: The Fucking Bird
	"falcon0": "_CUSTOM:BIRDSONG.OGG&pl_SETDIR:0&_SLEEP:1000",
	"falcon1": "pl_SETDIR:1&_CUSTOM:ENTERTHEBIRD",
	"falcon2": "_SLEEP:500",
	"falcon3": "_PLANIM:5,0,1000",
	"falcon4": "bird_SHIFTY:0&_CUSTOM:PLAYERREAD&_TEXT:falconMsg0",
	"falcon5": "_CUSTOM:GETFALCONTEXT",
	"falcon6": "?[{\"q\":\"worldmap.mapName === 'hq_1'\",\"v\":7},{\"q\":\"true\",\"v\":9}]",
	"falcon7": "_CUSTOM:EXITTHEBIRDFINAL",
	"falcon8": "_CLEARTARGET&bird_SETTARGET&_CLEARTARGET&_END&_QUIT",
	"falcon9": "_CUSTOM:FALCONSELECT",
	"falcon10": "_PLANIM:5,0,1000",
	"falcon11": "bird_SHIFTY:1&_SLEEP:500",
	"falcon12": "_CUSTOM:EXITTHEBIRD1",
	"falcon13": "pl_SETDIR:3&_CLEARTARGET&_CUSTOM:EXITTHEBIRD2",
	// Produce Stand: Meeting Nathan
	"theHappening0": "?[{\"q\":\"player.completedQuest('bigBot')\",\"v\":2},{\"q\":\"true\",\"v\":1}]",
	"theHappening1": "_QUIT",
	"theHappening2": "nathanB_VISIBLE:true&nathanB_MOVE:x4",
	"theHappening3": "nathanB_ANIMSTATE:[2,3,2,8,true]&_TEXT:theHappening(0-3)",
	"theHappening4": "eaglia_VISIBLE:true&_TEXT:theHappening(4-5)",
	"theHappening5": "nathanB_ANIMSTATE:[2,4,2,8,true]&_TEXT:theHappening6",
	"theHappening6": "nathanB_ISMOVING:false&eaglia_ANIMSTATE:[0,5,2,8,true]&eaglia_MOVE:x4",
	"theHappening7": "eaglia_VISIBLE:false&nathanB_ISMOVING:true&_TEXT:theHappening7",
	"theHappening8": "_GIVE:pineapple,10&_GIVE:garlic,10&_GIVE:apple,10&_TEXT:theHappening8",
	"theHappening9": "nathanB_ISMOVING:false&_TEXT:theHappening9",
	"theHappening10": "nathanB_ISMOVING:true&_TEXT:theHappening10",
	"theHappening11": "_CLEARTEXT&nathanB_ANIMSTATE:[0,0,4,8]&nathanB_MOVE:x-1",
	"theHappening12": "_CLEARTARGET&eaglia_SETTARGET&_CLEARTARGET&_CUSTOM:BYEFALCON&_QUIT",
};
const spriteData = {
    populate: function() {
        for(let i = 0; i < 4; i++) {
            spriteData.names["ginger" + i] = [10 + i, 4];
            spriteData.names["pineapple" + i] = [7 + i, 6];
            spriteData.names["asparagus" + i] = [1 + i, 7];
            spriteData.names["cursor0." + i] = [1 + i, 11];
            spriteData.names["cursor1." + i] = [1 + i, 12];
            spriteData.names["bcursor0." + i] = [5 + i, 12];
            spriteData.names["bcursor1." + i] = [4 + i, 13];
            spriteData.names["xcursor0." + i] = [9 + i, 12];
            spriteData.names["puff" + i] = [i, 15];
            spriteData.names["quail" + i] = [22 + i, 6];
            spriteData.names["goose" + i] = [26 + i, 6];
            spriteData.names["turkey" + i] = [22 + i, 7];
            spriteData.names["platypus" + i] = [26 + i, 7];
            spriteData.names["sicklebattery" + i] = [15 + i, 21];
            spriteData.names["app" + i] = [28 - i, 10];
            spriteData.names["frogbot" + i] = [11 + i, 0, true];
            spriteData.names["coffee" + i] = [11 + i, 1, true];
            spriteData.names["robobabby" + i] = [12, 18 + i];
            spriteData.names["soybean" + i] = [32 + i, 16];
            spriteData.names["soybaby" + i] = [37, 19 + i];
            if(i < 2) {
                spriteData.names["apple" + i] = [3 + i, 0, true];
                spriteData.names["banana" + i] = [5 + i, 0, true];
                spriteData.names["avocado" + i] = [1 + i, 1, true];
                spriteData.names["mango" + i] = [3 + i, 1, true];
                spriteData.names["lemon" + i] = [5 + i, 1, true];
                spriteData.names["apricot" + i] = [1 + i, 2, true];
                spriteData.names["kiwi" + i] = [3 + i, 2, true];
                spriteData.names["coconut" + i] = [13 + i, 2, true];
                spriteData.names["spinach" + i] = [14 + i, 4];
                spriteData.names["tomato" + i] = [10 + i, 5];
                spriteData.names["radish" + i] = [11 + i, 6];
                spriteData.names["beet" + i] = [5 + i, 7];
            }
            if(i < 3) {
                spriteData.names["book" + i] = [32 + i, 8];
                spriteData.names["book" + (i + 3)] = [32 + i, 9];
                spriteData.names["printer" + i] = [25 + i, 9];
                spriteData.names["printer" + (i + 3)] = [28 + i, 9];
                spriteData.names["drone" + i] = [29 + i, 10];
                spriteData.names["headphones" + i] = [25 + i, 8];
                spriteData.names["tree" + i] = [i, 0, true];
                spriteData.names["garlic" + i] = [12 + i, 5];
                spriteData.names["bellpepper" + i] = [1 + i, 6];
                spriteData.names["corn" + i] = [4 + i, 6];
                spriteData.names["rhubarb" + i] = [13 + i, 6];
                spriteData.names["leek" + i] = [7 + i, 7];
                spriteData.names["egg" + i] = [16 + i, 6];
                spriteData.names["shiitake" + i] = [16 + i, 8];
                spriteData.names["milkcap" + i] = [16 + i, 9];
                spriteData.names["portobello" + i] = [16 + i, 10];
                
                spriteData.names["greenshroom" + i] = [22 + i, 8];
                spriteData.names["blackshroom" + i] = [22 + i, 9];
                spriteData.names["poisnshroom" + i] = [22 + i, 10];
                
                spriteData.names["gmocorn" + i] = [7 + i, 20];
            }
        }
        let mush = ["shiitake", "milkcap", "portobello"];
        for(let i = 0; i < mush.length; i++) {
            spriteData.names[mush[i]] = [16 + i, 12];
            spriteData.names[mush[i] + "seed"] = [16 + i, 11];
        }
        mush = ["greenshroom", "blackshroom", "poisnshroom"];
        for(let i = 0; i < mush.length; i++) {
            spriteData.names[mush[i]] = [22 + i, 12];
            spriteData.names[mush[i] + "seed"] = [22 + i, 11];
        }
        
        const bees = ["beeB", "beeR", "beeG"];
        for(let i = 0; i < bees.length; i++) {
            spriteData.names[bees[i] + "seed"] = [11 + i, 13];
            spriteData.names[bees[i] + "0"] = [14, 14];
            spriteData.names[bees[i] + "1"] = [11 + i, 14];
            spriteData.names[bees[i]] = [11 + i, 15];
        }
        const rices = ["arborio", "blackrice", "rice", "shortgrain", "chestnut"];
        for(let i = 0; i < rices.length; i++) {
            const rice = rices[i];
            spriteData.names[rice + "0"] = [15, 20];
            spriteData.names[rice + "1"] = [16, 20];
            spriteData.names[rice + "2"] = [17, 20];
            spriteData.names[rice + "3"] = [(15 + i), 19];
            spriteData.names[rice] = [(15 + i), 18];
            spriteData.names[rice + "seed"] = [(15 + i), 17];
        }
        const veg = ["apple", "banana", "ginger", "grapes", "spinach", "tomato", "garlic", "carrot", "bellpepper", "corn", "avocado", 
                   "mango", "lemon", "blackberry", "pineapple", "apricot", "radish", "kiwi", "rhubarb", "asparagus", "beet", "leek"];
        for(let i = 0; i < veg.length; i++) {
            spriteData.names[veg[i]] = [(10 + i) % 16, 7 + Math.floor((10 + i) / 16)];
            spriteData.names[veg[i] + "seed"] = [i % 16, 9 + Math.floor(i / 16)];
        }
        const items = ["hoe", "can", "sickle", "fertilizer", "glove", "compost", "spring", "summer", "autumn", "winter"];
        for(let i = 0; i < items.length; i++) {
            spriteData.names[items[i]] = [6 + i, 10];
        }

        let food2s = ["orig", "kelp", "coffee", "salsa", "gamer", "cookie", "black", "purple", "crystal"];
        for(let i = 0; i < food2s.length; i++) {
            const myfood = food2s[i];
            spriteData.names["food2" + myfood + "0"] = [30, 18];
            if(i === 0) { spriteData.names["food2classic0"] = [30, 18]; }
            for(let j = 1; j <= 4; j++) {
                spriteData.names["food2" + myfood + j] = [28 + i, 18 + j];
                if(i === 0) { spriteData.names["food2classic" + j] = [28, 18 + j]; }
            }
            spriteData.names["food2" + myfood] = [28 + i, 22];
            if(i === 0) { spriteData.names["food2classic"] = [28, 22]; }
        }

        for(let i = 0; i < 13; i++) {
            spriteData.names["sickle_" + i] = [i, 16];
            if(i < 9) { spriteData.names["compost_" + i] = [i, 17]; }
            if(i < 5) { spriteData.names["glove_" + i] = [i, 18]; }
            if(i < 11) { spriteData.names["can_" + i] = [i, 19]; }
        }
        for(let i = 0; i < 3; i++) {
            spriteData.names["titleSel" + i] = [4 + i, 21];
            spriteData.names["titleSelActive" + i] = [7 + i, 21];
        }
        for(let i = 0; i < 6; i++) {
            if(i < 4) { spriteData.names["animCoin" + i] = [40 + i, 13]; }
            spriteData.names["animBin" + i] = [40 + i, 14];
        }
        for(let i = 0; i < 7; i++) {
            spriteData.names["hp" + (14 - i)] = [41 + i , 10];
            spriteData.names["hp" + (7 - i)] = [41 + i , 11];
        }
    },
    names: {
        "firstButton": [0, 22],
        "GamepadA0": [0, 13], "GamepadA1": [1, 13], "GamepadA2": [2, 13], "GamepadA3": [3, 13],
        "GamepadA4": [0, 14], "GamepadA5": [1, 14], "GamepadA6": [2, 14], "GamepadA7": [3, 14],
        "pointer0": [2, 16], "pointer1": [3, 16], "pointer2": [4, 16], "pointer3": [5, 16], "pointer4": [3, 17], "pointer5": [3, 16],
        "forestTransition0": [11, 17], "forestTransition1": [11, 18], "forestTransition2": [11, 19],
        "forestTransition3": [11, 20], "forestTransition4": [11, 21],
        "holywater": [42, 9], "holyjug": [42, 8], "alms": [42, 7],  "rotSparkle": [42, 6],
        "hulkFist0": [18, 2, true], "hulkFist1": [19, 2, true],
        "vineBottom0": [45, 4], "vineBottom1": [46, 4],
        "vineAnimT.0": [43, 4], "vineAnimT.1": [44, 4],
        "vineAnim0.0": [43, 5], "vineAnim0.1": [44, 5],
        "vineAnim1.0": [43, 6], "vineAnim1.1": [44, 6],
        "vineAnim2.0": [43, 7], "vineAnim2.1": [44, 7],
        "vineAnim3.0": [43, 8], "vineAnim3.1": [44, 8],
        "waterDiag0": [45, 5], "fireDiag0": [46, 5], "saltDiag0": [47, 5],
        "bigpuff0": [21, 0, true],
        "bigpuff1": [22, 0, true],
        "bigpuff2": [23, 0, true],
        "bigpuff3": [21, 1, true],
        "bigpuff4": [22, 1, true],
        "saltShaker0": [46, 14], "saltShaker1": [46, 15],
        "fireBall0": [43, 12], "fireBall1": [44, 12],
        "fireBurn0": [45, 12], "fireBurn1": [46, 12],
        "waterDrop0": [47, 12], "waterDrop1": [47, 13],
        "splashed0": [47, 14], "splashed1": [47, 15],
        "seasonbar0": [44, 9],
        "seasonbar1": [45, 9],
        "seasonbar2": [46, 9],
        "seasonbar3": [47, 9],
        "seasonico": [43, 9],
        "bookOpenL": [40, 12], "bookOpenR": [41, 12],
        "frogbotFly0": [30, 7], "frogbotFly1": [31, 7],
        "eggFly0": [34, 6], "eggFly1": [35, 6],
        "quailFly0": [36, 6], "quailFly1": [37, 6], "quailFlyR0": [40, 5], "quailFlyR1": [41, 5],
        "gooseFly0": [38, 6], "gooseFly1": [39, 6], "gooseFlyR0": [40, 6], "gooseFlyR1": [41, 6],
        "goldeggFly0": [34, 7], "goldeggFly1": [35, 7],
        "turkeyFly0": [36, 7], "turkeyFly1": [37, 7], "turkeyFlyR0": [40, 4], "turkeyFlyR1": [41, 4],
        "platypusFly0": [38, 7], "platypusFly1": [39, 7], "platypusFlyR0": [40, 7], "platypusFlyR1": [41, 7],
        "bigFish": [15, 0, true],
        "wedgeWA": [45, 6],
        "wedgeW": [46, 6],
        "wedgeWD": [47, 6],
        "wedgeA": [45, 7],
        "wedgeD": [47, 7],
        "wedgeSA": [45, 8],
        "wedgeS": [46, 8],
        "wedgeSD": [47, 8],
        "grass": [9, 14], "grassTop": [35, 8], "grassBottom": [35, 9],
        "seaGrass": [37, 8], "seaGrassTop": [36, 8], "seaGrassBottom": [36, 9],
        "techGrass": [37, 9], "techGrassTop": [38, 8], "techGrassBottom": [38, 9],
        "roadGrass": [39, 8], "roadGrassTop": [40, 8], "roadGrassBottom": [40, 9],
        "hqGrass": [39, 9], "hqGrassTop": [41, 8], "hqGrassBottom": [41, 9],
        "curseason2": [44, 13],
        "curseason1": [45, 13],
        "curseason0": [46, 13],
        "vein": [45, 15],
        "recycleArrow": [44, 15],
        "a.boss1": [40, 19], 
        "a.lakeFairy": [41, 19], 
        "a.badrabbit": [42, 19], 
        "a.limeTime": [43, 19], 
        "a.RAPBATTLE": [44, 19], 
        "a.boss2": [45, 19], 
        "a.boss3help": [41, 20], 
        "a.boss3hurt": [40, 20], 
        "a.dowel": [46, 19], 
        "a.kelpBuddy": [47, 19], 
        "a.unplugged": [43, 20], 
        "a.crouton": [42, 20], 
        "a.boss4": [44, 20], 
        "a.abuelita": [46, 20], 
        "a.skumpy": [45, 20], 
        "a.bossMob": [47, 20], 
        "a.stonehenge": [42, 21], 
        "a.boss5": [44, 21], 
        "a.bankStop": [43, 21], 
        "a.helpNerd": [45, 21], 
        "a.abee": [46, 21], 
        "a.techGood": [42, 22], 
        "a.techBad": [43, 22], 
        "a.natureGood": [47, 21], 
        "a.natureBad": [44, 22], 
        "a.vegan": [45, 22], 
        "a.beeKing": [46, 22], 
        "a.luddite": [47, 22], 
        "a.springKing": [40, 18], 
        "a.summerHummer": [41, 18], 
        "a.autumnBottom": [42, 18], 
        "a.winterHinter": [43, 18], 
        "a.vegbuddy": [44, 18], 
        "a.treebuddy": [45, 18], 
        "a.mushbuddy": [46, 18], 
        "a.eggbuddy": [47, 18], 
        "a.ricebuddy": [40, 17], 
        "a.beebuddy": [41, 17], 
        "a.seabuddy": [42, 17], 
        "a.cowbuddy": [43, 17], 
        "a.techbuddy": [44, 17], 
        "a.biglaunch": [45, 17], 
        "a.laila": [46, 17], 
        "a.madeForMe": [47, 17], 
        "a.soybeat": [40, 16], 
        "a.fullUpgrade": [41, 16], 
        "a.allCrop": [42, 16], 
        "a.overkill": [43, 16], 
        "a.murderedToDeath": [44, 16], 
        "a.goldshroom": [45, 16], 
        "a.donthave": [46, 16], 
        "tropictree0": [18, 1, true],
        "tropictree1": [19, 1, true],
        "tropictree2": [20, 1, true],
        "food2keycard": [39, 15],
        "smartphone": [40, 15],
        "monsterheart": [22, 14],
        "monsteregg": [23, 14],
        "seamonkkey": [24, 14],
        "goldmushroom": [39, 20],
        "alignment": [16, 3, true],
        "alignmentcursor": [38, 16],
        "engine0": [39, 19],
        "soybean4": [35, 15],
        "soybaby4": [38, 19],
        "soybean": [35, 14],
        "soybaby": [38, 20],
        "food2bar0": [31, 18],
        "food2bar1": [32, 18],
        "food2bar2": [33, 18],
        "food2bar": [34, 18],
        "food2barChoc0": [32, 17],
        "food2barChoc1": [32, 18],
        "food2barChoc2": [33, 17],
        "food2barChoc": [34, 17],
        "food2powder0": [30, 16],
        "food2powder": [31, 16],
        "chargingBayUL": [32, 4],
        "chargingBayUR": [33, 4],
        "chargingBayLL": [32, 5],
        "chargingBayLR": [33, 5],
        "mushNerf": [38, 21],
        "riceNerf": [39, 21],
        "treeNerf": [40, 21],
        "vegNerf": [41, 21],
        "fishNerf": [38, 22],
        "beeNerf": [39, 22],
        "eggNerf": [40, 22],
        "reNerf": [41, 22],
        "bananaPill0": [31, 15],
        "bananaPill1": [32, 15],
        "bananaPill2": [33, 15],
        "bananaPill3": [34, 15],
        "bananaPill": [31, 14],
        "bigNum?": [38, 15],
        "bigNum1": [38, 10], "bigNum2": [38.5, 10],
        "bigNum3": [38, 11], "bigNum4": [38.5, 11],
        "bigNum5": [38, 12], "bigNum6": [38.5, 12],
        "bigNum7": [38, 13], "bigNum8": [38.5, 13],
        "bigNum9": [38, 14], "bigNum0": [38.5, 14],
        "bigNumW?": [42, 12],
        "bigNumW1": [39, 10], "bigNumW2": [39.5, 10],
        "bigNumW3": [39, 11], "bigNumW4": [39.5, 11],
        "bigNumW5": [39, 12], "bigNumW6": [39.5, 12],
        "bigNumW7": [39, 13], "bigNumW8": [39.5, 13],
        "bigNumW9": [39, 14], "bigNumW0": [39.5, 14],
        "starNone": [36, 10],
        "starHalf": [36, 11],
        "starFull": [36, 12],
        "starMax": [36, 13],
        "stunIco1": [36, 14],
        "stunIco2": [36, 15],
        "stunIco3": [36, 16],
        "waterIco1": [37, 10],
        "waterIco2": [37, 11],
        "fireIco1": [37, 12],
        "fireIco2": [37, 13],
        "saltIco1": [37, 14],
        "saltIco2": [37, 15],
        "saltIcoX": [37, 16],
        "spring0": [36, 17],
        "spring1": [36, 18],
        "spring2": [12, 10],
        "summer0": [37, 17],
        "summer1": [37, 18],
        "summer2": [13, 10],
        "autumn0": [38, 17],
        "autumn1": [38, 18],
        "autumn2": [14, 10],
        "winter0": [39, 17],
        "winter1": [39, 18],
        "winter2": [15, 10],
        "conveyorL": [29, 17],
        "conveyorM": [30, 17],
        "conveyorR": [35, 17],
        "conveyorEnd": [31, 17],
        "fx0": [32, 10],
        "fx1": [32, 11],
        "fx2": [32, 12],
        "fx3": [32, 13],
        "fx4": [32, 14],
        "char0": [33, 10],
        "char1": [33, 11],
        "char2": [33, 12],
        "char3": [33, 13],
        "char4": [33, 14],
        "defchar0": [34, 10],
        "defchar1": [34, 11],
        "defchar2": [34, 12],
        "defchar3": [34, 13],
        "defchar4": [34, 14],
        "elem0": [35, 10],
        "elem1": [35, 11],
        "elem2": [35, 12],
        "elem3": [35, 13],
        "roadtile": [31, 12],
        "gastank0": [20, 22],
        "gastank1": [21, 22],
        "gastank2": [22, 22],
        "gastank3": [23, 22],
        "gastank": [23, 22],
        "airfilter0": [22, 21],
        "airfilter1": [23, 21],
        "airfilter2": [24, 21],
        "airfilter3": [25, 21],
        "airfilter4": [26, 21],
        "airfilter": [26, 21],
        "dipstick0": [24, 22],
        "dipstick1": [25, 22],
        "dipstick2": [26, 22],
        "dipstick": [27, 22],
        "tire": [27, 21],
        "tire0": [27, 21],
        "tire1": [27, 21],
        "cacao": [27, 20],
        "cacao0": [16, 1, true],
        "cacao1": [17, 1, true],
        "burrito0": [20, 17],
        "dango0": [21, 17],
        "taco0": [22, 17],
        "kombucha0": [23, 17],
        "cheese0": [20, 18],
        "burrito": [20, 17],
        "dango": [21, 17],
        "taco": [22, 17],
        "kombucha": [23, 17],
        "cheese": [20, 18],
        "batterysalt0": [21, 18],
        "batterysalt1": [22, 18],
        "batterysalt2": [23, 18],
        "batterysalt": [23, 18],
        "grilltile": [20, 21],
        "shotgun0": [22, 20],
        "shotgun1": [23, 20],
        "shotgun2": [24, 20],
        "shotgun3": [25, 20],
        "shotgun": [26, 20],
        "timebomb0": [24, 19],
        "timebomb1": [25, 19],
        "timebomb2": [26, 19],
        "timebomb3": [27, 19],
        "timebomb": [27, 19],
        "lotus0": [24, 18],
        "lotus1": [25, 18],
        "lotus2": [26, 18],
        "lotus3": [27, 18],
        "lotus4": [28, 18],
        "lotus": [29, 18],
        "lotusseed": [27, 17],
        "porcini0": [22, 16],
        "porcini1": [23, 16],
        "porcini2": [24, 16],
        "porcini": [25, 16],
        "arborioB0": [26, 16],
        "arborioB1": [27, 16],
        "arborioB2": [28, 16],
        "arborioB3": [29, 16],
        "arborioB": [15, 18],
        "titlecloud": [17, 2, true],
        "cloud0": [15, 2, true],
        "lightbulb0": [23, 15],
        "lightbulb1": [24, 15],
        "lightbulb": [24, 15],
        "download": [30, 15],
        "download0": [25, 15],
        "download1": [26, 15],
        "download2": [27, 15],
        "download3": [28, 15],
        "download4": [29, 15],
        "cybertile": [22, 15],
        "bpermit": [30, 14],
        "bpermit0": [27, 14],
        "bpermit1": [28, 14],
        "bpermit2": [29, 14],
        "bpermit3": [30, 14],
        "house": [29, 12],
        "house0": [16, 0, true],
        "house1": [17, 0, true],
        "house2": [18, 0, true],
        "house3": [19, 0, true],
        "house4": [20, 0, true],
        "robobabby": [12, 21],
        "notdrugs": [28, 13],
        "notdrugsseed": [27, 13],
        "notdrugs0": [29, 13],
        "notdrugs1": [30, 13],
        "notdrugs2": [31, 13],
        "gmocorn": [10, 20],
        "gmocornseed": [24, 13],
        "coconut": [23, 13],
        "coconutseed": [22, 13],
        "goldegg": [25, 12],
        "goldeggseed": [25, 12],
        "goldegg0": [25, 12],
        "goldegg1": [26, 12],
        "goldegg2": [27, 12],
        "goldegg3": [28, 12],
        "opL": [18, 20],
        "opR": [19, 20],
        "nopL": [20, 20],
        "nopR": [21, 20],
        "carrotSel": [3, 21], 
        "inv_power": [31, 11],
        "inv_time": [13, 21],
        "inv_HP": [47, 4],
        "inv_regrow": [30, 11],
        "hbeeseed": [25, 11],
        "hbee0": [26, 11],
        "hbee1": [27, 11],
        "hbee": [28, 11],
        "coffee4": [15, 1, true],
        "appseed": [28, 10],
        "app": [30, 8],
        "frogbotseed": [31, 8],
        "frogbot": [31, 8],
        "headphones": [28, 8],
        "headphonesseed": [28, 8],
        "droneseed": [29, 10],
        "drone": [31, 9],
        "printerseed": [25, 9],
        "printer": [29, 8],
        "coffeeseed": [30, 6],
        "coffee": [31, 6],
        "_sprinkler": [9, 17],
        "animalRabbit": [15, 12],
        "animalMonkey": [40, 10],
        "goopdrop": [15, 15],
        "hgoop": [14, 15],
        "_beehive": [14, 12],
        "chargerplaced": [10, 2, true],
        "_charger": [10, 21],
        "x": [7, 15],
        "compostpile": [6, 15],
        "milk": [5, 15],
        "puff4": [4, 15],
        "edgeWA": [8, 13],
        "edgeW": [9, 13],
        "edgeWD": [10, 13],
        "edgeA": [8, 14],
        "edgeD": [10, 14],
        "edgeSA": [8, 15],
        "edgeS": [9, 15],
        "edgeSD": [10, 15],
        "sicklebattery3": [19, 21],
        "sicklebatteryseed": [15, 21],
        "sicklebattery": [15, 21],
        "farmupgradeI-n": [21, 11],
        "farmupgrade_-I": [20, 12],
        "farmupgradeO-I": [21, 12],
        "farmupgrade__-_": [20, 13],
        "farmupgradeOO-O": [21, 13],
        "farmupgrade__-O": [20, 14],
        "farmupgradeOO-_": [21, 14],
        "mod0": [8, 1, true],
        "mod1": [9, 1, true],
        "mod2": [8, 2, true],
        "mod3": [9, 2, true],
        "_modulator": [19, 12],
        "hotspot": [10, 0, true],
        "_hotspot": [13, 17],
        "_shooter": [19, 11],
        "_shooterClosed": [20, 11],
        "_paddy": [21, 6],
        "rod": [19, 8], "rodseed": [19, 8],
        "goodrod": [20, 8], "goodrodseed": [20, 8],
        "metalrod": [21, 8], "metalrodseed": [21, 8],
        "ultrarod": [25, 13], "ultrarodseed": [25, 13],
        "rod0": [19, 9], "goodrod0": [20, 9], "metalrod0": [21, 9], "ultrarod0": [25, 14],
        "fish0": [19, 10], "fish1": [20, 10], "fish2": [21, 10], "fish4": [40, 11],
        "net": [19, 7], "netseed": [19, 7],
        "net0": [20, 7],
        "net1": [21, 7],
        "bignet": [29, 11], "bignetseed": [29, 11],
        "bignet0": [11, 2, true],
        "bignet1": [12, 2, true],
        "cow": [8, 0, true],
        "cowready": [9, 0, true],
        "fodder": [19, 6],
        "fodderseed": [19, 6],
        "goodfood": [26, 14],
        "goodfoodseed": [26, 14],
        "egg": [16, 6],
        "eggseed": [16, 6],
        "egg3": [16, 7],
        "quail": [22, 6],
        "quailseed": [22, 6],
        "goose": [26, 6],
        "gooseseed": [26, 6],
        "turkey": [22, 7],
        "turkeyseed": [22, 7],
        "platypus": [26, 7],
        "platypusseed": [26, 7],
        "_lake": [19, 13],
        "lakeD": [16, 13], 
        "lakeA": [18, 13], 
        "lakeAD": [17, 13], 
        "lakeS": [16, 14], 
        "lakeW": [16, 16], 
        "lakeWS": [16, 15], 
        "lakeWASD": [18, 15], 
        "lakeDS": [17, 14], 
        "lakeASD": [18, 14], 
        "lakeAS": [19, 14], 
        "lakeWSD": [17, 15], 
        "lakeWAS": [19, 15], 
        "lakeWD": [17, 16], 
        "lakeWAD": [18, 16], 
        "lakeWA": [19, 16], 
        "_log": [17, 7], 
        "_coop": [18, 7],
        "_cow": [20, 6],
        "dirt": [0, 11],
        "tech": [13, 17],
        /*"clock0": [13, 18],
        "clock1": [13, 19],
        "clock2": [13, 20],
        "clock3": [13, 21],*/
        "battery": [14, 21],
        "batteryseed": [14, 21],
        "battery0": [14, 17],
        "battery1": [14, 18],
        "battery2": [14, 19],
        "battery3": [14, 20],
        "battery4": [14, 21],
        "carrot0": [15, 5],
        "carrot1": [0, 6],
        "grapes0": [7, 0, true],
        "grapes1": [0, 1, true],
        "acorn": [15, 14],
        "acorn0": [10, 1, true],
        "acorn1": [10, 1, true],
        "specialgrapes0": [7, 0, true],
        "specialgrapes1": [0, 1, true],
        "specialgrapes": [13, 7],
        "specialgrapesseed": [3, 9],
        "blackberry0": [7, 1, true],
        "blackberry1": [0, 2, true],
        "rhubarb3": [0, 7],
        "exit": [13, 12],
        "sell": [20, 15],
        "seeds": [0, 12],
        "tools": [21, 15], 
        "fixtures": [17, 7],
        "arrowR": [15, 13],
        "arrowL": [14, 13],
        "talk": [13, 16],
        "sleep": [12, 17],
        "weed": [14, 16],
        "spear": [20, 16],
        "spearseed": [20, 16],
        "watertile": [0, 21],
        "splashed": [0, 20],
        "shocked": [6, 20],
        "burned": [8, 18],
        "_beehiveBurned": [9, 18],
        "_logBurned": [10, 18],
        "_coopBurned": [10, 17], 
        "algae0": [1, 21],
        "algae1": [2, 21],
        "algae": [2, 21],
        "kelp0": [1, 20],
        "kelp1": [2, 20],
        "kelp2": [3, 20],
        "kelp3": [4, 20],
        "kelp4": [5, 20],
        "kelp": [5, 20],
        "rock": [6, 18],
        "rock0": [6, 18],
        "rock1": [6, 18],
        "salt": [7, 18],
        "salt0": [7, 18],
        "salt1": [7, 18],
        "_strongsoil": [5, 18]
    } 
};

const debugAllMaps = ["farm", "producestand", "firstvillage", "belowvillage", "researchfacility", "bridge", "underwater", "fakefarm", "southcity", "northcity", 
                    "hq_1", "hq_2", "hq_3", "hq_4", "hq_5"]; // TODO: forest is too big
const smallMaps = ["farm"];
const namesToIgnore = ["Sign", "Chair", "SeedShotArea2", "SeedShotArea3", "SeedShotArea4", "IiiOnTheFarm"];
const mapNames = {
    "farm": "Your Farm", "producestand": "Produce Stand", "forest": "Agrios Forest", "firstvillage": "San Ambrosio", "belowvillage": "South of Town",
    "researchfacility": "Mysterious Research Lab", "bridge": "Bridge Crossing", "underwater": "Underwater", "fakefarm": "Jeff's Farm",
    "southcity": "South Las Abejas", "northcity": "Central Las Abejas", "hq_1": "Food2 Headquarters 1F", "hq_2": "Food2 Headquarters 2F",
    "hq_3": "Food2 Headquarters 3F", "hq_4": "Food2 Headquarters 4F", "hq_5": "Food2 Headquarters 5F"
};
const shopNames = {
    "coop": "Chicken Coop", "inn0": "Your House", "equip1": "Dave's Hoes and Sickles", "fixture1": "Fuckster's Fixtures", "seed1": "Seedy Pete's Petey Seeds",
    "upgrade1": "Andrew D's Farm Expansions", "inn1": "Frothybarf Inn", "mermaidinn": "The Mermaid Inn", "mermaid": "Ye Mermaid Shoppe",
    "cworker": "Lazy Construction Worker's Shop", "upgrade2": "The Upgrade Barn", "fixture2": "The Fixture Stall", "skumpys": "Skumpy's Pub", "mantools": "MAN TOOLS",
    "seedshack": "The Seed Shack", "catalinas": "Catalina's Fixtures", "tinker": "Tinker Tierra", "pawn": "Pawn Shop", "church": "Las Abejas Church",
    "trout": "crazy4trout", "cityInn": "Hotel", "cityFixtures": "Fixtures", "gordonsFarming": "Gordon's Farming", "cityTech": "Tech Supplies",
    "cityExpansions": "Farm Expansions", "vendo_veg": "Veggie Vendo", "vendo_tree": "Fruity Vendo", "vendo_mush": "Fungy Vendo", "vendo_paddy": "Paddy Vendo",
    "vendo_coop": "Eggy Vendo", "vendo_water": "Fishy Vendo", "vendo_tech": "Vendy Vendo"
};


function SameSprites(a, b) {
    var aa = spriteData.names[a];
    var bb = spriteData.names[b];
    return (aa[0] === bb[0] && aa[1] === bb[1]);
}
function GetDocumentationAttackPatterns(name) {
    if(patternText[name] !== undefined) { return patternText[name]; }
    var pattern = enemyPatterns[name].nodes;
    var results = [];
    for(var i = 0; i < pattern.length; i++) {
        if(pattern[i].data === undefined || pattern[i].data.message === undefined) { continue; }
        switch(pattern[i].data.message) {
            case "CONVINCEATRON": results.push("Mining for Cryptocurrencies"); break;
            case "WEAK_ATTACK": results.push("Standard Attack"); break;
            case "LAUNCH_CROPS": results.push("Grow Crops"); break;
            case "THROW_BABY": results.push("Summon Allies"); break;
            case "HEAL_RANGE": results.push("Recover Health"); break;
            case "MODULATE": results.push("Season Modulator"); break;
        }
    }
    patternText[name] = results.join(", ");
    return patternText[name];
}

function DoEnemyGen() {
    var $enemies = $("#enemies > .content");
    for(var i = 0; i < debug.AllEnemies.length; i++) {
        const $template = $("#enemyTemplate").clone();
        $template.removeClass("template").removeAttr("id");
        const enemy = GetEnemy(debug.AllEnemies[i]);
        $template.find(".txt_name").html("<a name='" + debug.AllEnemies[i] + "'>" + enemy.name + "</a>");
        
        if(enemy.size === "xl") {
            $template.find(".sp_final").addClass("enemySpriteBig huge").css("background-position", "-" + (enemy.spriteidx * 64) + "px 0");
        } else if(enemy.size === "lg") {
            $template.find(".sp_final").addClass("enemySpriteBig").css("background-position", "-" + (enemy.spriteidx * 64) + "px 0");
        } else {
            $template.find(".sp_final").addClass("enemySprite").css("background-position", "-" + (enemy.spriteidx * 48) + "px 0");
        }
        
        $template.find(".sp_sp").addClass( enemy.seasonDistribution[0] > 0.5 ? "stspring" : "stnoSeason" ).attr("title", "Spring Chance: " + enemy.seasonDistribution[0]);
        $template.find(".sp_su").addClass( enemy.seasonDistribution[1] > 0.5 ? "stsummer" : "stnoSeason" ).attr("title", "Summer Chance: " + enemy.seasonDistribution[1]);
        $template.find(".sp_au").addClass( enemy.seasonDistribution[2] > 0.5 ? "stautumn" : "stnoSeason" ).attr("title", "Autumn Chance: " + enemy.seasonDistribution[2]);
        $template.find(".sp_wi").addClass( enemy.seasonDistribution[3] > 0.5 ? "stwinter" : "stnoSeason" ).attr("title", "Winter Chance: " + enemy.seasonDistribution[3]);
        
        $template.find(".txt_hp").text(enemy.health);
        $template.find(".txt_atk").text(enemy.atk);
        $template.find(".txt_def").text(enemy.def);
        $template.find(".txt_size").text(enemy.fieldwidth + "x" + enemy.fieldheight);
        $template.find(".txt_exp").text(enemy.exp);
        
        var drops = [];
        if(enemy.drops !== undefined) {
            for(var j = 0; j < enemy.drops.length; j++) {
                var drop = enemy.drops[j];
                if(drop.money) {
                    if(drop.min === drop.max) {
                        drops.push(drop.min + "G");
                    } else {
                        drops.push(drop.min + "-" + drop.max + "G");
                    }
                } else {
                    var name = GetCrop(drop.seed).displayname;
                    if(drop.min === drop.max) {
                        drops.push(drop.min + " " + name);
                    } else {
                        drops.push(drop.min + "-" + drop.max + " " + name);
                    }
                }
            }
        }
        $template.find(".txt_attacks").text(GetDocumentationAttackPatterns(enemy.attackType));
        if(drops.length === 0) {
            $template.find(".txt_drops").text("None");
        } else {
            $template.find(".txt_drops").text(drops.join(", "));
        }
        
        $enemies.append($template);
    }
    $(".stnoSeason").remove();
}
function GetBossRecommendedLevel(enemyKey) {
    switch(enemyKey) {
        case "Fucker": return 2;
        case "Jeff": return 4;
        case "HOUSEKEEPER": return 8;
        case "MobBoss": return 9;
        case "ReturnOfTheFucker": return 12;
    }
    return "?";
}
function GetEnemyName(name, justKey) { 
    switch(name) {
        case "Jeff": name = "ScienceMan"; break;
        case "Fucker": name = "bigBot"; break;
        case "research": name = "robo2"; break;
        case "fish": name = "fishFace"; break;
        case "seamonk": name = "seaMonk"; break;
        case "chickbot": name = "chickBot"; break;
        case "pig": name = "piggun"; break;
        case "mobsty1": 
        case "wildmobsty": return "Mobster"; break;
        case "mobsty2": return "Stronger Mobster"; break;
        case "MobBoss": name = "mobBoss"; break;
        case "HOUSEKEEPER": name = "housekeeper"; break;
        case "carBr": name = "brownCar"; break;
        case "carBl": name = "blueCar"; break;
        case "carRe": name = "redCar"; break;
        case "ReturnOfTheFucker": name = "discuss2"; break;
    }
    if(justKey) { return name; }
    return GetText("e." + name + "0");
}
function GetEnemyHTML(enemyKey) {
    let $template = $("#innerEnemyTemplate").clone();
    $template.removeClass("template").removeAttr("id");
    $template.find(".txt_name").html("<a href='#" + enemyKey + "'>" + GetEnemyName(enemyKey) + "</a>");
    if(enemyKey === "research") { enemyKey = "robo2"; }
    if(requiredEnemyMetadata[enemyKey] !== undefined) {
        const enemyData = requiredEnemyMetadata[enemyKey];
        const amt = enemyData.setEnemies.length;
        $template.find(".txt_amount").text(amt);
        let typ = [];
        for(let i = 0; i < enemyData.setEnemies.length; i++) {
            const myName = GetEnemyName(enemyData.enemies[i]);
            if(typ.indexOf(myName) < 0) { typ.push(myName); }
        }
        $template.find(".txt_types").text(typ.join(", "));
    } else { console.log(enemyKey); }
    return $template;
}
function DoCropGen() {
    var $crops = $("#crops > .content");
    for(var i = 0; i < debug.AllCrops.length; i++) {
        if(debug.AllCrops[i] === "specialgrapes") { continue; }
        var $template = $("#cropTemplate").clone();
        $template.removeClass("template").removeAttr("id");
        var crop = GetCrop(debug.AllCrops[i]);
        $template.find(".txt_name").text(crop.displayname);
        $template.find(".txt_info").text(GetText(crop.name));
        var typeName = ""; var typeClass = "";
        switch(crop.type) {
            case "veg": typeName = "Vegetable"; typeClass = "dirt"; break;
            case "tree": typeName = "Fruit"; typeClass = "dirt"; break;
            case "bee": typeName = "Bee"; typeClass = "_beehive"; break;
            case "rice": typeName = "Paddy Crop"; typeClass = "_paddy"; break;
            case "spear":
            case "rod": 
            case "water": typeName = "Water"; typeClass = "_lake"; break;
            case "food": typeName = "Feed"; typeClass = "_cow"; break;
            case "mush": typeName = "Mushroom"; typeClass = "_log"; break;
            case "egg": typeName = "Egg"; typeClass = "_coop"; break;
            case "tech": 
            case "sickle2": typeName = "Technology"; typeClass = "_hotspot"; break;
        }
        $template.find(".txt_type").text(typeName);
        $template.find(".txt_size").text(crop.size === 1 ? "Small" : "Large");
        $template.find(".txt_size").attr("title", crop.size === 1 ? "1x1 tiles" : "2x2 tiles");
        $template.find(".sp_type").addClass("st" + typeClass);
        
        if(spriteData.names[crop.name + "seed"] === undefined || SameSprites(crop.name, crop.name + "seed")) {
            $template.find(".sp_seed").remove();
        } else {
            $template.find(".sp_seed").addClass("s" + crop.name + "seed");
        }
        $template.find(".sp_final").addClass("s" + crop.name);
        
        if(["veg", "tree", "rice", "water", "mush", "egg", "tech"].indexOf(crop.type) >= 0) {
            var $stages = $template.find(".txt_stages");
            if(crop.type === "tree") {
                var treeType = crop.treeSprite || "tree";
                $stages.append($("<span class = 'spriteTiny spriteTinyDouble st" + treeType + "0'></span>"));
                $stages.append($("<span class = 'spriteTiny spriteTinyDouble st" + treeType + "1'></span>"));
                $stages.append($("<span class = 'spriteTiny spriteTinyDouble st" + treeType + "2'></span>"));
                for(var j = 3; j < crop.frames; j++) {
                    $stages.append($("<span class='treeFill'><span class = 'spriteTiny spriteTinyDouble st" + treeType + "2'></span><span class = 'spriteTiny spriteTinyDouble st" + crop.name + (j - 3) + "'></span></span>"));
                }
            } else {
                for(var j = 0; j < crop.frames; j++) {
                    if(crop.size === 2) {
                        $stages.append($("<span class = 'spriteTiny spriteTinyDouble st" + crop.name + j + "'></span>"));
                    } else {
                        $stages.append($("<span class = 'spriteTiny st" + crop.name + j + "'></span>"));
                    }
                }
            }
        }

        $template.find(".sp_sp").addClass( crop.seasons[0] > 0.5 ? "stspring" : "stnoSeason" ).attr("title", "Spring Power: " + crop.seasons[0]);
        $template.find(".sp_su").addClass( crop.seasons[1] > 0.5 ? "stsummer" : "stnoSeason" ).attr("title", "Summer Power: " + crop.seasons[1]);
        $template.find(".sp_au").addClass( crop.seasons[2] > 0.5 ? "stautumn" : "stnoSeason" ).attr("title", "Autumn Power: " + crop.seasons[2]);
        $template.find(".sp_wi").addClass( crop.seasons[3] > 0.5 ? "stwinter" : "stnoSeason" ).attr("title", "Winter Power: " + crop.seasons[3]);

        $template.find(".txt_price").text(crop.price + "G");
        $template.find(".txt_power").text(crop.power);
        $template.find(".txt_time").text(crop.time);
        if(crop.respawn === 0) {
            $template.find(".txt_regrow").parent().remove();
        } else {
            $template.find(".txt_regrow").text(crop.respawn);
        }
            
        var locations = GetNonstandardLocationsForItem(crop.name);
        for(var key in stores) {
            var wares = stores[key].wares;
            for(var j = 0; j < wares.length; j++) {
                if(wares[j].product !== crop.name) { continue; }
                locations.push(shopNames[key]);
                break;
            }
        }
        for(var key in mapentities) {
            var entities = mapentities[key];
            for(var j = 0; j < entities.length; j++) {
                if(entities[j].isChest !== true) { continue; }
                var contents = entities[j].contents;
                for(var k = 0; k < contents.length; k++) {
                    if(contents[k][0] !== crop.name) { continue; }
                    var name = mapNames[key] + " (Chest)";
                    if(locations.indexOf(name) < 0) { locations.push(name); }
                    break;
                }
            }
        }
        for(var k = 2; k <= 50; k++) {
            player.level = k;
            player.inventory = [];
            player.getLevelUpItemBonuses();
            for(var j = 0; j < player.inventory.length; j++) {
                if(player.inventory[j][0] === crop.name) { if(locations.indexOf("Level Up Bonuses") < 0) { locations.push("Level Up Bonuses"); break; } }
            }
        }
        for(var j = 0; j < debug.AllEnemies.length; j++) {
            if(debug.AllEnemies[j].indexOf("beeQueen") === 0 || debug.AllEnemies[j] === "nathan") { continue; }
            var enemy = GetEnemy(debug.AllEnemies[j]);
            var drops = enemy.drops;
            for(var k = 0; k < drops.length; k++) {
                if(drops[k].seed === crop.name) { locations.push("Enemy: " + GetEnemyName(debug.AllEnemies[j])); }
            }
        }
        for(var c in scripts) {
            var vals = scripts[c].split("&");
            for(var j = 0; j < vals.length; j++) {
                if(vals[j].indexOf("_GIVE:") < 0) { continue; }
                var givey = vals[j].replace("_GIVE:", "").split(",")[0];
                if(givey === crop.name) { 
                    var val = GetCutsceneIdentifier(c);
                    if(locations.indexOf(val) < 0) { locations.push(val); }
                }
            }
        }

        var $ul = $template.find(".txt_locations");
        if(locations.length === 0) {
            $ul.append("<li class='warning'>NOWHERE</li>");
        } else {
            for(var j = 0; j < locations.length; j++) { $ul.append("<li>" + locations[j] + "</li>"); }
        }
        $crops.append($template);
    }
}
function GetCutsceneIdentifier(c) {
    if(c.match(/abuela\d+/) !== null) { return "South Las Abejas (Old Lady)"; }
    if(c.match(/bigBotW\d+/) !== null) { return "Your Farm (MegaByte Buddy)"; }
    if(c.match(/piratemonk\d+/) !== null) { return "Underwater (Dowel)"; }
    if(c.match(/lime\d+/) !== null) { return "Agrios Forest (Lime)"; }
    if(c.match(/theHappening\d+/) !== null) { return "Produce Stand (Nathan)"; }
    if(c.match(/freeRadish\d+/) !== null) { return "Central Las Abejas"; }
    if(c.match(/brandt\d+/) !== null) { return "Central Las Abejas (Brandt)"; }
    if(c.match(/jeffW\d+/) !== null) { return "Mysterious Research Lab (Dr. Jeff)"; }
    if(c.match(/OfficeHive\d+/) !== null) { return "Central Las Abejas (Beehive)"; }
    if(c.match(/kelpBoy\d+/) !== null || c.match(/kelpHive\d+/) !== null || c.match(/kelpDeadBee\d+/) !== null) { return "Underwater (Kelp Boy)"; }
    if(c.match(/FarmHive\d+/) !== null) { return "Your Farm (Beehive)"; }
    if(c.match(/ForestHive\d+/) !== null) { return "Agrios Forest (Beehive)"; }
    if(c.match(/BelowHive\d+/) !== null) { return "South of Town (Beehive)"; }
    if(c.match(/lotus\d+/) !== null) { return "Food2 Headquarters 4F"; }
    if(c.match(/mushman\d+/) !== null) { return "Central Las Abejas (Daveothy)"; }
    if(c.match(/crazy4trout\d+/) !== null) { return "Central Las Abejas (Jeromy)"; }
    if(c.match(/crouton\d+/) !== null) { return "Fake Farm (Crouton)"; }
    if(c.match(/rap\d+/) !== null) { return "Mysterious Research Lab (RAPBATTLE)"; }
    if(c.match(/eggfairy\d+/) !== null) { return "Produce Stand (Egg Fairy)"; }
    if(c.match(/hungyBin\d+/) !== null) { return "Food2 Headquarters 1F"; }
    console.log(c);
    return c;
}
function GetNonstandardLocationsForItem(name) {
    switch(name) {
        case "egg":
        case "quail":
        case "goose":
        case "turkey":
        case "platypus":
        case "goldegg": return ["Central Las Abejas (Egg Dealer)"];
        case "ultrarod": return ["Underwater (Dowel)"];
        default: return [];
    }
}

function DoCropTierGen() {
    for(var i = 0; i < debug.AllCrops.length; i++) {
        var crop = GetCrop(debug.AllCrops[i]);
        var $c = $("<span class='sprite s" + crop.name + "' title='" + crop.displayname + "'></span>");
        if(crop.power > 10) {
            $("#tierX").append($c);
        } else {
            $("#tier" + crop.power).append($c);
        }
    }
}

function DoLevelGen() {
    var $maps = $("#maps > .content");
    for(var i = 0; i < debugAllMaps.length; i++) {
        var $template = $("#mapTemplate").clone();
        $template.removeClass("template").removeAttr("id");
        var mapName = debugAllMaps[i];
        var mapData = mapentities[mapName];
        $template.find(".sp_final").attr("src", "guide_assets/map_" + mapName + ".png");
        $template.find(".txt_name").text(mapNames[mapName]);
        var $details = $template.find(".additionalDetails");
        
        var $mapDad = $template.find(".mapContainer");
        var counts = {};
        var existingObjs = {};
        var lastObj = { name: "" };
        var mapObjects = [];
        for(var j = 0; j < mapData.length; j++) {
            var obj = mapData[j];
            if(obj.name === undefined) { continue; }
            if(obj.name.replace("R", "L") === lastObj.name) { continue; }
            lastObj = obj;
            if(obj.name.indexOf("H_") === 0) { continue; }
            if(namesToIgnore.indexOf(obj.name) >= 0) { continue; }
            if(obj.name.indexOf("NathanOnTheFarm") === 0) { continue; }
            if(obj.isForeground === true) { continue; }
            if(obj.pos.x < 0 || obj.pos.y < 0) { continue; }
            if(obj.boring === true || obj.jumbo === true) { continue; }
            if(obj.name.indexOf("waterfall") === 0 && obj.name[obj.name.length - 1] !== "0") { continue; }
            
            var mapObj = GetMapObjData(obj, $details, counts);
            if(mapObj.type === "?") { console.log(obj); continue; }
            
            var count = 1;
            if(counts[mapObj.type] === undefined) {
                if(mapObj.subtype === undefined) {
                    counts[mapObj.type] = 2;
                } else {
                    counts["full"] = 2;
                    counts[mapObj.type] = {};
                    counts[mapObj.type][mapObj.subtype] = 1;
                }
            } else {
                if(mapObj.subtype === undefined) {
                    count = counts[mapObj.type]++;
                    if(mapObj.type === "Treasure") { mapObj.dontShowOnBottom = true; }
                } else if(counts[mapObj.type][mapObj.subtype] === undefined) {
                    count = counts["full"]++;
                    counts[mapObj.type][mapObj.subtype] = count;
                } else {
                    count = counts[mapObj.type][mapObj.subtype];
                    mapObj.dontShowOnBottom = true;
                }
            }
            if(mapObj.dispCount === undefined) { mapObj.dispCount = count; }
            if(mapObj.sortCount === undefined) { mapObj.sortCount = count; }
            if(!mapObj.dontShowOnBottom) { mapObjects.push(mapObj); }
            
            if(mapObj.infoText !== undefined && !mapObj.dontShowOnBottom) {
                var $specialTemplate = $("#specialTemplate").clone();
                $specialTemplate.removeClass("template").removeAttr("id");
                $specialTemplate.find(".txt_name").text(mapObj.text);
                $specialTemplate.find(".txt_info").html(mapObj.infoText);
                $details.append($specialTemplate);
            }
            var $md = $("<div class='badge badge-pill " + mapObj.badgeclass + " mapDetail'>" + mapObj.dispCount + "</div>");
            $md.css("top", (16 * (obj.big ? (obj.pos.y + 1) : obj.pos.y)) + "px").css("left", (16 * obj.pos.x) + "px").attr("title", obj.name);
            $mapDad.append($md);
        }
        mapObjects = mapObjects.sort(function(x, y) {
            if(x.order < y.order) { return -1; }
            if(x.order > y.order) { return 1; }
            if(x.sortCount < y.sortCount) { return -1; }
            if(x.sortCount > y.sortCount) { return 1; }
            return 0;
        });
        
        var numCols = 2;
        //if(smallMaps.indexOf(mapName) >= 0) {
        $template.find(".row.wide").remove();
        /*} else {
        $template.find(".row.narrow").remove();
        numCols = 3;
        }*/
        var breakPoint = mapObjects.length / numCols;
        var $l = $template.find(".left");
        var $m = $template.find(".mid");
        var $r = $template.find(".right");
        for(var j = 0; j < mapObjects.length; j++) {
            var obj = mapObjects[j];
            if(obj.dontShowOnBottom) { continue; }
            if(obj.type === "Treasure") { obj.dispCount = "#"; }
            var $obj = $("<div><label><div class='badge badge-pill " + obj.badgeclass + "'>" + obj.dispCount + "</div></label> <span>" + obj.text + "</span></div>");
            if(j < breakPoint) {
                $l.append($obj);
            } else if(numCols === 3 && j < (breakPoint * 2)) {
                $m.append($obj);
            } else {
                $r.append($obj);
            }
        }
        
        $maps.append($template);
    }
}
function GetMapObjData(e, $details, counts) {
    if(e.name === "hungryboy") {
        return { order: 5, type: "NPC", badgeclass: "badge-info", text: "Hungry Boy", infoText: "He'll share some of his fruits and veggies with you if you keep his secret safe." };
    } else if(e.name === "fuzurusenpai") {
        return { order: 5, type: "NPC", badgeclass: "badge-info", text: "Marty" };
    } else if(e.name === "EggBoy") {
        return { order: 5, type: "NPC", badgeclass: "badge-info", text: "Egg Dealer", infoText: "Sells 2 eggs for 250G. The eggs you get are random, and can be quite rare!" };
    } else if(e.name === "CityMonk") {
        return { order: 5, type: "NPC", badgeclass: "badge-info", text: "Big City Sea Monk" };
    } else if(e.name === "UndergroundMan") {
        return { order: 5, type: "NPC", badgeclass: "badge-warning", text: "???", infoText: "???" };
    } else if(e.name === "OfficeLady") {
        return { order: 5, type: "NPC", badgeclass: "badge-info", text: "Susantha" };
    } else if(e.name === "KeycardTrap") {
        // TODO
        return { order: 4, sortCount: 9999, type: "Boss", badgeclass: "badge-danger", dispCount: "X", text: "Dweeblord",
        infoText: "<span class='font-weight-bold'>Recommended Level:</span> 11<br/>Attempting to take the Food2 Security Card from this apartment will trigger an attack!" };
    } else if(e.name === "Keycard") {
        return { order: 5, type: "NPC", badgeclass: "badge-info", text: "Food2 Keycard", infoText: "You need this to get into the Food2 Building." };
    } else if(e.name.indexOf("Robber") >= 0) {
        return { order: 4, sortCount: 9998, type: "enemy", subtype: "robber", badgeclass: "badge-danger", dispCount: "R", text: "Bank Robber" };
    } else if(e.name === "freeRadish") {
        return { order: 5, type: "NPC", badgeclass: "badge-info", text: "Radish", infoText: "You can harvest some Radish Seeds from this." };
    } else if(e.name === "brandt") {
        return { order: 5, type: "NPC", badgeclass: "badge-info", text: "Brandt", infoText: "This man will give you lots of Spinach Seeds." };
    } else if(e.name.indexOf("crazy4trout") === 0) {
        stores["trout"] = {
            wares: [
                { product: "metalrod", price: 200, type: "seed" },
                { product: "net", price: 50, type: "seed" },
                { product: "bignet", price: 100, type: "seed" },
                { product: "spear", price: 200, type: "seed" }
            ], buyMult: 1
        };
        $details.append(GetShopHTML("trout"));
        return { order: 3, type: "Shop", badgeclass: "badge-success", text: "crazy4trout" };
    } else if(e.name.indexOf("SomeNerd") === 0) {
        return { order: 5, type: "nerd", subtype: "nerd", dispCount: "N", badgeclass: "badge-info", text: "Nerd" };
    } else if(e.name === "MushMan") {
        return { order: 0, type: "NPC", badgeclass: "badge-info", dispCount: "Q", text: "Daveothy",
        infoText: "This man will give you Water Chestnut seeds in exchange for Mushroom Seeds, or Sacred Lotus Seeds in exchange for Funny Mushoom Seeds." };
    } else if(e.name.indexOf("atm") === 0) {
        return { order: 5, type: "atm", subtype: "atm", badgeclass: "badge-warning", dispCount: "A", text: "Cash2 ATM" };
    } else if(e.name.indexOf("cashboy") === 0) {
        return { order: 5, type: "cashboy", subtype: "cashboy", badgeclass: "badge-info", dispCount: "I", text: "Cash2 Investor" };
    } else if(e.name.indexOf("Officer") === 0) {
        return { order: 5, type: "cop", subtype: "cop", badgeclass: "badge-info", dispCount: "C", text: "Police Officer" };
    } else if(e.name === "Abuela") {
        return { order: 0, type: "NPC", badgeclass: "badge-info", dispCount: "Q", text: "Old Lady",
        infoText: "This lady will reward you for giving her bird feed like Fodder, Corn, or Rice. If you give her Delicious Food she will give you Funny Mushroom Seeds." };
    } else if(e.name.indexOf("LawnMower") === 0) {
        // TODO
        return { order: 4, type: "Enemy", subtype: "lawnmower", badgeclass: "badge-danger", text: "Lawnmower" };
    } else if(e.name === "Crouton") {
        return { order: 0, type: "NPC", badgeclass: "badge-info", dispCount: "Q", text: "Crouton",
        infoText: "This dog will give you Fodder in exchange for fishing supplies, or Delicious Food in exchange for Master Bait." };
    } else if(e.name === "Hotbox") {
        return { order: 4, sortCount: 9998, type: "NPC", badgeclass: "badge-danger", dispCount: "H", text: "Insidious Machine",
        infoText: "To power down the gate blocking the staircase, this machine must be defeated in combat." };
    } else if(e.name === "TireRack") {
        return { order: 5, type: "NPC", badgeclass: "badge-info", dispCount: "T", text: "Tire Rack",
        infoText: "This rack contains a spare tire you can use to fix your truck." };
    } else if(e.name === "Outlet") {
        return { order: 5, type: "NPC", badgeclass: "badge-info", dispCount: "O", text: "Power Outlet",
        infoText: "Unplugging this will power down everything in the barn." };
    } else if(e.name.indexOf("CoveredDoor") === 0) {
        return { order: 11, sortCount: 9999, type: "LockedDoor", subtype: "LockedDoor", badgeclass: "badge-info", dispCount: "L", text: "Locked Door",
        infoText: "These doors will be unlocked after Farmer Jeff tells you about his plan." };
    } else if(e.name === "SeaCreatureMiddle") {
        return { order: 4, sortCount: 9999, type: "Boss", badgeclass: "badge-danger", dispCount: "X", text: "Sea Monster",
        infoText: "<span class='font-weight-bold'>Recommended Level:</span> 6<br/>You can choose to help the help the Sea Monster and fight the Construction Workers, or help the Workers and kill the Sea Monster." };
    } else if(e.name === "PirateFriend") {
        return { order: 0, type: "NPC", badgeclass: "badge-info", dispCount: "Q", text: "Dowel",
        infoText: "This pirate will give you seeds in exchange for Paddy Crop Seeds, or the Sea Monk Key in exchange for GMO Corn Seeds." };
    } else if(e.name === "PiratesTreasure") {
        return { order: 11, type: "NPC", badgeclass: "badge-warning", dispCount: "D", text: "Dowel's Treasure",
        infoText: "The Sea Monk Key can be used to unlock this chest, which contains 4 pieces of Master Bait." };
    } else if(e.name === "KelpBoy") {
        return { order: 4, sortCount: 9998, type: "NPC", badgeclass: "badge-danger", dispCount: "KB", text: "Kelp Boy",
        infoText: "You must beat this weird underwater man in combat to get his Beehive." };
    } else if(e.name === "HeadWorker") {
        // TODO
        return { order: 4, sortCount: 9999, type: "Boss", badgeclass: "badge-danger", dispCount: "X", text: "Head Construction Worker",
        infoText: "<span class='font-weight-bold'>Recommended Level:</span> 5<br/>You can choose to help the Construction Workers and kill the Sea Monster, or help the Sea Monster and fight the Workers." };
    } else if(e.name.indexOf("Worker") === 0) {
        // TODO
        return { order: 4, type: "Enemy", subtype: "worker", badgeclass: "badge-danger", text: "Construction Worker" };
    } else if(e.name.indexOf("Falcon") === 0) {
        return { order: 0, type: "Falcon", badgeclass: "badge-warning", dispCount: "F", text: "Falcon" };
    } else if(e.name === "ConvinceATron") {
        return { order: 0, type: "Enemy", badgeclass: "badge-danger", dispCount: "C", text: "Tutorial",
        infoText: "If you run away from the tutorial battle in the opening cutscene, you can come back to it later here." };
    } else if(e.name === "EggFairy") {
        return { order: 0, type: "NPC", badgeclass: "badge-info", dispCount: "Q", text: "Egg Fairy",
        infoText: "Dropping an egg in the lake here will summon the Egg Fairy. Lying to them  will lead to all of your eggs being taken, while telling the truth will give you a Golden Egg." };
    } else if(e.name === "RAPBATTLE") {
        return { order: 0, type: "NPC", badgeclass: "badge-info", dispCount: "Q", text: "RAPBATTLE",
        infoText: "This robot will give you batteries in exchange for Garlic or Rice Seeds, or GMO Corn in exchange for Coconut Seeds." };
    } else if(e.name === "SeedShotArea1") {
        return { order: 4, type: "NPC", sortCount: 9998, badgeclass: "badge-danger", dispCount: "S", text: "Seed Shooter Trap",
        infoText: "Walking into this trap will result in seeds being shot at you, doing 2 damage per seed." };
    } else if(e.rfd) {
        var dC = ["R", "B", "G"][e.type] + (e.initActive ? "O" : "X");
        return { order: 9, type: "RFDoor", subtype: dC, badgeclass: "badge-secondary", dispCount: dC, text: (["Red", "Blue", "Green"][e.type] + " Door (" + (e.initActive ? "Open)" : "Closed)")) };
    } else if(e.rf === true) {
        var dC = ["RB", "BB", "GB"][e.type];
        return { order: 8, type: "RFButton", subtype: dC, badgeclass: "badge-primary", dispCount: dC, text: ["Red", "Blue", "Green"][e.type] + " Switch" };
    } else if(e.isChest) {
        var $template = $("#treasureTemplate").clone();
        $template.removeClass("template");
        $template.find(".txt_num").text(counts["Treasure"] || 1);
        var items = e.contents;
        var $wares = $template.find(".wares");
        for(var ii = 0; ii < items.length; ii++) {
            var item = items[ii];
            $wares.append($("<div class='shopItem'><span class='spriteTiny st" + item[0] + "'></span>" + GetCrop(item[0]).displayname + " x"  + item[1] + "</div>"));
        }
        $details.append($template);
        return { order: 11, type: "Treasure", badgeclass: "badge-warning", text: "Treasure Chest" };
    } else if(e.boss) {
        $details.append(GetBossHTML(e.name));
        return { order: 4, sortCount: 9999, type: "Boss", badgeclass: "badge-danger", dispCount: "X", text: GetEnemyName(e.name) };
    } else if(e.isBeehive) {
        return { order: 0, type: "Beehive", badgeclass: "badge-warning", dispCount: "B", text: "Beehive" };
    } else if(e.setEnemies !== undefined) {
        // TODO
        return { order: 4, type: "Enemy", subtype: e.interactname, badgeclass: "badge-danger", text: GetEnemyName(e.interactname) };
    } else if(e.isMapSwitch) {
        return { order: 2, type: "Move", subtype: e.destination, badgeclass: "badge-dark", text: "To " + mapNames[e.destination] };
    } else if(e.isShop) {
        $details.append(GetShopHTML(e.shopName));
        return { order: 3, type: "Shop", badgeclass: "badge-success", text: shopNames[e.shopName] };
    } else if(e.isWaterfall) {
        return { order: 6, type: "Waterfall", subtype: "WF", badgeclass: "badge-primary", dispCount: "W", text: "Water Current" };
    } else if(e.isRock) {
        return { order: 7, type: "Rock", subtype: "WFR", badgeclass: "badge-info", dispCount: "R", text: "Rock" };
    } else if(e.name === "AFuckingTruckL") {
        return { order: 1, type: "Truck", badgeclass: "badge-dark", dispCount: "T", text: "Truck" };
    } else {
        return { order: 5, type: "NPC", badgeclass: "badge-info", text: e.name };
    }
    return { type: "?" };
}
function GetBossHTML(enemyKey) {
    const $template = $("#bossTemplate").clone();
    $template.removeClass("template").removeAttr("id");
    $template.find(".txt_name").html("Boss: <a href='#" + GetEnemyName(enemyKey, true) + "'>" + GetEnemyName(enemyKey) + "</a>");
    $template.find(".txt_recLvl").text(GetBossRecommendedLevel(enemyKey));
    return $template;
}
function GetShopHTML(shopKey) {
    var $template = $("#shopTemplate").clone();
    $template.removeClass("template").removeAttr("id");
    $template.find(".txt_name").text(shopNames[shopKey]);
    var shopInfo = stores[shopKey];
    if(shopInfo.innId !== undefined) {
        $template.find(".price").text(shopInfo.wares[0].price);
        $template.find(".wares,.sell").remove();
    } else {
        $template.find(".inn").remove();
        var $wares = $template.find(".wares");
        if(shopInfo.doesSell) {
            $template.find(".percent").text(shopInfo.sellMult * 100);
        } else {
            $template.find(".sell").remove();
        }
        for(var i = 0; i < shopInfo.wares.length; i++) {
            var name = "ass";
            var mult = (shopInfo.buyMult || 1);
            var price = 10;
            switch(shopInfo.wares[i].type) {
                case "seed": 
                    var sd = GetCrop(shopInfo.wares[i].product);
                    name = "<span class='spriteTiny st" + shopInfo.wares[i].product + "'></span>" + sd.displayname;
                    price = sd.price * mult;
                    break;
                case "farm": 
                    var finfo = GetFarmInfo(shopInfo.wares[i].product);
                    name = "<span class='spriteTiny st" + shopInfo.wares[i].product + "'></span>" + finfo.displayname;
                    price = finfo.price * mult;
                    break;
                case "equipment": 
                    var eq = GetEquipment(shopInfo.wares[i].product);
                    name = "<span class='spriteTiny st" + eq.sprite + "'></span>" + eq.displayname;
                    price = eq.price * mult;
                    break;
                case "upgrade": 
                    name = "Field Size Upgrade";
                    price = shopInfo.wares[i].price * mult;
                    break;
            }
            $wares.append($("<div class='shopItem'>" + name + " (" + price + "G)</div>"));
        }
    }
    return $template;
}

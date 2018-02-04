var spriteData = {
    populate: function() {
        for(var i = 0; i < 4; i++) {
            spriteData.names["ginger" + i] = [10 + i, 4];
            spriteData.names["pineapple" + i] = [7 + i, 6];
            spriteData.names["asparagus" + i] = [1 + i, 7];
            spriteData.names["cursor" + i] = [1 + i, 11];
            spriteData.names["bcursor" + i] = [5 + i, 12];
            spriteData.names["xcursor" + i] = [9 + i, 12];
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
        var mush = ["shiitake", "milkcap", "portobello"];
        for(var i = 0; i < mush.length; i++) {
            spriteData.names[mush[i]] = [16 + i, 12];
            spriteData.names[mush[i] + "seed"] = [16 + i, 11];
        }
        mush = ["greenshroom", "blackshroom", "poisnshroom"];
        for(var i = 0; i < mush.length; i++) {
            spriteData.names[mush[i]] = [22 + i, 12];
            spriteData.names[mush[i] + "seed"] = [22 + i, 11];
        }
        
        var bees = ["beeB", "beeR", "beeG"];
        for(var i = 0; i < bees.length; i++) {
            spriteData.names[bees[i] + "seed"] = [11 + i, 13];
            spriteData.names[bees[i] + "0"] = [14, 14];
            spriteData.names[bees[i] + "1"] = [11 + i, 14];
            spriteData.names[bees[i]] = [11 + i, 15];
        }
        var rices = ["arborio", "blackrice", "rice", "shortgrain", "chestnut"];
        for(var i = 0; i < rices.length; i++) {
            var rice = rices[i];
            spriteData.names[rice + "0"] = [15, 20];
            spriteData.names[rice + "1"] = [16, 20];
            spriteData.names[rice + "2"] = [17, 20];
            spriteData.names[rice + "3"] = [(15 + i), 19];
            spriteData.names[rice] = [(15 + i), 18];
            spriteData.names[rice + "seed"] = [(15 + i), 17];
        }
        var veg = ["apple", "banana", "ginger", "grapes", "spinach", "tomato", "garlic", "carrot", "bellpepper", "corn", "avocado", 
                   "mango", "lemon", "blackberry", "pineapple", "apricot", "radish", "kiwi", "rhubarb", "asparagus", "beet", "leek"];
        for(var i = 0; i < veg.length; i++) {
            spriteData.names[veg[i]] = [(10 + i) % 16, 7 + Math.floor((10 + i) / 16)];
            spriteData.names[veg[i] + "seed"] = [i % 16, 9 + Math.floor(i / 16)];
        }
        var items = ["hoe", "can", "sickle", "fertilizer", "glove", "compost", "spring", "summer", "autumn", "winter"];
        for(var i = 0; i < items.length; i++) {
            spriteData.names[items[i]] = [6 + i, 10];
        }

        var food2s = ["orig", "kelp", "coffee", "salsa", "gamer", "cookie", "black", "purple", "crystal"];
        for(var i = 0; i < food2s.length; i++) {
            var myfood = food2s[i];
            spriteData.names["food2" + myfood + "0"] = [30, 18];
            if(i === 0) { spriteData.names["food2classic0"] = [30, 18]; }
            for(var j = 1; j <= 4; j++) {
                spriteData.names["food2" + myfood + j] = [28 + i, 18 + j];
                if(i === 0) { spriteData.names["food2classic" + j] = [28, 18 + j]; }
            }
            spriteData.names["food2" + myfood] = [28 + i, 22];
            if(i === 0) { spriteData.names["food2classic"] = [28, 22]; }
        }

        for(var i = 0; i < 13; i++) {
            spriteData.names["sickle_" + i] = [i, 16];
            if(i < 9) { spriteData.names["compost_" + i] = [i, 17]; }
            if(i < 5) { spriteData.names["glove_" + i] = [i, 18]; }
            if(i < 11) { spriteData.names["can_" + i] = [i, 19]; }
        }
        for(var i = 0; i < 3; i++) {
            spriteData.names["titleSel" + i] = [4 + i, 21];
            spriteData.names["titleSelActive" + i] = [7 + i, 21];
        }
        for(var i = 0; i < 20; i++) { spriteData.names["trns" + i] = [i, 22]; }
        for(var i = 0; i < 6; i++) {
            if(i < 4) { spriteData.names["animCoin" + i] = [40 + i, 13]; }
            spriteData.names["animBin" + i] = [40 + i, 14];
        }
        for(var i = 0; i < 7; i++) {
            spriteData.names["hp" + (14 - i)] = [41 + i , 10];
            spriteData.names["hp" + (7 - i)] = [41 + i , 11];
        }
    },
    names: {
        "bigFish": [15, 0, true],
        "wedgeWA": [45, 6],
        "wedgeW": [46, 6],
        "wedgeWD": [47, 6],
        "wedgeA": [45, 7],
        "wedgeD": [47, 7],
        "wedgeSA": [45, 8],
        "wedgeS": [46, 8],
        "wedgeSD": [47, 8],
        "grass": [9, 14],
        "grassTop": [35, 8],
        "grassBottom": [35, 9],
        "seaGrass": [37, 8],
        "seaGrassTop": [36, 8],
        "seaGrassBottom": [36, 9],
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
        "bigNum0": [39, 14],
        "bigNum1": [38, 10],
        "bigNum2": [39, 10],
        "bigNum3": [38, 11],
        "bigNum4": [39, 11],
        "bigNum5": [38, 12],
        "bigNum6": [39, 12],
        "bigNum7": [38, 13],
        "bigNum8": [39, 13],
        "bigNum9": [38, 14],
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
        "cloud0": [15, 2, true],
        "cloud": [30, 12],
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
        "bigbin": [10, 1, true],
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
        "sicklebattery": [12, 16],
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
        "fish0": [19, 10], "fish1": [20, 10], "fish2": [21, 10], "fish3": [40, 11],
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
        "noSeason": [4, 13],
        "dirt": [0, 11],
        "tech": [13, 17],
        "clock0": [13, 18],
        "clock1": [13, 19],
        "clock2": [13, 20],
        "clock3": [13, 21],
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
        "seeds": [3, 12],
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
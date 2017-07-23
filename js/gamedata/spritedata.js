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
            if(i < 2) {
                spriteData.names["apple" + i] = [3 + i, 0, true];
                spriteData.names["banana" + i] = [5 + i, 0, true];
                spriteData.names["avocado" + i] = [1 + i, 1, true];
                spriteData.names["mango" + i] = [3 + i, 1, true];
                spriteData.names["lemon" + i] = [5 + i, 1, true];
                spriteData.names["apricot" + i] = [1 + i, 2, true];
                spriteData.names["kiwi" + i] = [3 + i, 2, true];
                spriteData.names["spinach" + i] = [14 + i, 4];
                spriteData.names["tomato" + i] = [10 + i, 5];
                spriteData.names["radish" + i] = [11 + i, 6];
                spriteData.names["beet" + i] = [5 + i, 7];
            }
            if(i < 3) {
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
            }
        }
        var mush = ["shiitake", "milkcap", "portobello"];
        for(var i = 0; i < mush.length; i++) {
            spriteData.names[mush[i]] = [16 + i, 12];
            spriteData.names[mush[i] + "seed"] = [16 + i, 11];
        }
        
        var bees = ["beeB", "beeR", "beeG"];
        for(var i = 0; i < bees.length; i++) {
            spriteData.names[bees[i] + "seed"] = [11 + i, 13];
            spriteData.names[bees[i] + "0"] = [14, 14];
            spriteData.names[bees[i] + "1"] = [11 + i, 14];
            spriteData.names[bees[i]] = [11 + i, 15];
        }
        var rices = ["arborio", "blackrice", "rice"];
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
        var skills = ["Sspring", "Ssummer", "Sautumn", "Swinter"];
        for(var i = 0; i < skills.length; i++) {
            var item = skills[i];
            for(var j = 0; j < 2; j++) {
                spriteData.names["skill_" + item + j] = [i, 13 + j];
                spriteData.names["skillD_" + item + j] = [4, 13];
            }
        }
        for(var i = 0; i < 13; i++) {
            spriteData.names["sickle_" + i] = [i, 16];
            if(i < 9) { spriteData.names["compost_" + i] = [i, 17]; }
            if(i < 5) { spriteData.names["glove_" + i] = [i, 18]; }
            if(i < 11) { spriteData.names["can_" + i] = [i, 19]; }
        }
    },
    names: {
        "_sprinkler": [9, 17],
        "animalRabbit": [15, 12],
        "goopdrop": [15, 15],
        "hgoop": [14, 15],
        "_beehive": [14, 12],
        "x": [7, 15],
        "compostpile": [6, 15],
        "milk": [5, 15],
        "bigbin": [10, 1, true],
        "puff4": [4, 15],
        "grass": [9, 14],
        "edgeWA": [8, 13],
        "edgeW": [9, 13],
        "edgeWD": [10, 13],
        "edgeA": [8, 14],
        "edgeD": [10, 14],
        "edgeSA": [8, 15],
        "edgeS": [9, 15],
        "edgeSD": [10, 15],
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
        "rod0": [19, 9], "goodrod0": [20, 9], "metalrod0": [21, 9],
        "fish0": [19, 10], "fish1": [20, 10], "fish2": [21, 10],
        "net": [19, 7], "netseed": [19, 7],
        "net0": [20, 7],
        "net1": [21, 7],
        "cow": [8, 0, true],
        "cowready": [9, 0, true],
        "fodder": [19, 6],
        "fodderseed": [19, 6],
        "egg": [16, 6],
        "eggseed": [16, 6],
        "egg3": [16, 7],
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
        "skill_season0": [4, 14],
        "skillD_season0": [4, 13],
        "skill_season10": [5, 13],
        "skillD_season10": [4, 13],
        "skill_season11": [6, 13],
        "skillD_season11": [4, 13],
        "skill_season12": [7, 13],
        "skillD_season12": [4, 13],
        "skill_season20": [5, 14],
        "skillD_season20": [4, 13],
        "skill_season21": [6, 14],
        "skillD_season21": [4, 13],
        "skill_season22": [7, 14],
        "skillD_season22": [4, 13],
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
        "salt1": [7, 18]
    } 
};
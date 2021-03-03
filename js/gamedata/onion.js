const freshOnion = {
    stomach: [],
    perks: [],
    mood: 5,
    recentPets: 0,
    hueRotate: 0
};
const OnionPerks = {
    "loved": [],
    "gourmand": []
};
const OnionFuncs = {
    Update: function() {
        if(!player.onion) { return; }
        player.onion.perks = OnionFuncs.GetCurrentPerks();
        player.onion.hueRotate = OnionFuncs.GetHueRotate();
    },
    GetHueRotate: function() {
        if(!player.onion) { return 0; }
        let total = 0, count = 0;
        
        for(let i = 0; i < player.onion.stomach.length; i++) {
            const food = GetCrop(player.onion.stomach[i][0]);
            if(food.seasons[0] > 1) { count++; total += 330; }
            if(food.seasons[1] > 1) { count++; total += 360; }
            if(food.seasons[2] > 1) { count++; total += 300; }
            if(food.seasons[3] > 0) { count++; total += 120; }
        }
        return Math.floor(total / count);
    },
    GetCurrentPerks: function() {
        const perks = [];
        if(!player.onion) { return perks; }
        
        const gourmand = ["coconut", "gmocorn", "goodfood", "notdrugs", "lotus", "saffron"];
        const pungent = ["garlic", "ginger", "asparagus"];
        const friedrice = ["garlic", "ginger", "leek"]; // plus rice
        const spicy = ["bellpepper", "garlic", "rhubarb"];
        const sofrito = ["garlic", "leek", "bellpepper", "tomato"];
        const protein = ["asparagus", "avocado", "spinach"];
        const hardenedcore = ["apricot", "avocado"];
        const mammamia = ["garlic", "carrot"]; // plus 3 tomatoes and a mushroom

        const Has = (arr, val) => arr.indexOf(val) >= 0;

        const sofritoScore = [false, false, false, false], proteinScore = [false, false, false], coreScore = [false, false], italianScore = [false, false, false, 0];
        let hasGourmand = false, pungentScore = 0, hasFodder = false, friedRiceScore = 0, friedRiceRice = false, spicyScore = 0;
        let springScore = 0, summerScore = 0, fallScore = 0, winterScore = 0, veggieScore = 0, fruitScore = 0, mushScore = 0, riceScore = 0, hasWet = false, hasToxic = false;

        for(let i = 0; i < player.onion.stomach.length; i++) {
            const foodName = player.onion.stomach[i][0];

            if(foodName === "poisnshroom") { hasToxic = true; break; }

            if(Has(gourmand, foodName)) { hasGourmand = true; }
            if(Has(pungent, foodName)) { pungentScore++; }
            if(Has(friedrice, foodName)) { friedRiceScore++; }
            if(Has(spicy, foodName)) { spicyScore++; }

            const sidx = sofrito.indexOf(foodName);
            if(sidx >= 0) { sofritoScore[sidx] = true; }

            const pidx = protein.indexOf(foodName);
            if(pidx >= 0) { proteinScore[pidx] = true; }

            const cidx = hardenedcore.indexOf(foodName);
            if(cidx >= 0) { coreScore[cidx] = true; }
            
            const iidx = mammamia.indexOf(foodName);
            if(iidx >= 0) { italianScore[iidx] = true; }

            if(foodName === "tomato") { italianScore[3]++; }

            const food = GetCrop(foodName);
            switch(food.type) {
                case "veg": veggieScore++; break;
                case "tree": fruitScore++; break;
                case "mush": mushScore++; italianScore[2] = true; break;
                case "rice": riceScore++; friedRiceRice = true; break;
                case "food": hasFodder = true; break;
                case "moist": hasWet = true; break;
            }

            springScore += food.seasons[0];
            summerScore += food.seasons[1];
            fallScore += food.seasons[2];
            winterScore += food.seasons[3];
        }
        if(hasToxic) { return ["toxic"]; }
        
        if(player.onion.stomach.length === 8) { perks.push("stuffed"); }
        else if(player.onion.stomach.length >= 6) { perks.push("wellfed"); }

        if(player.onion.recentPets > 10) { perks.push("loved"); }
        if(hasGourmand) { perks.push("gourmand"); }
        if(proteinScore.every(v => v)) { perks.push("protein"); }
        if(sofritoScore.every(v => v)) { perks.push("sofrito"); }
        if(coreScore.every(v => v)) { perks.push("core"); }
        if(italianScore[0] && italianScore[1] && italianScore[2] && italianScore[3] >= 3) { perks.push("italia"); }

        if(hasFodder) { perks.push("fodder"); }
        if(friedRiceScore >= 3 && friedRiceRice) { perks.push("friedrice"); }
        if(hasWet) { perks.push("wet"); }
        if(pungentScore >= 3) { perks.push("pungent"); }
        if(spicyScore >= 3) { perks.push("spicy"); }

        if(springScore >= 6) { perks.push("spring"); }
        if(summerScore >= 6) { perks.push("summer"); }
        if(fallScore >= 6) { perks.push("autumn"); }
        if(winterScore >= 6) { perks.push("winter"); }

        if(veggieScore >= 5) { perks.push("veggies"); }
        if(fruitScore >= 5) { perks.push("fruits"); }
        if(mushScore >= 5) { perks.push("mush"); }
        if(riceScore >= 5) { perks.push("rice"); }

        return perks.slice(0, 4);
    }
};
const stores = {
    // Debug
    "farmupgradeFull": {
        img: "shops/cluckfuck",
        eyes: "shopblinks/cluckfuck", ex: 137, ey: 23,
        wares: [
            { product: "farmupgradeI", price: 0, type: "upgrade" },
            { product: "farmupgradeO", price: 0, type: "upgrade" },
            { product: "farmupgrade_", price: 0, type: "upgrade" },
            { product: "farmupgradeOO", price: 0, type: "upgrade" },
            { product: "farmupgrade__", price: 0, type: "upgrade" }
        ],
        opening: "s.up1o", empty: "s.upempty", leaving: "s.leave", notEnough: "s.notenough", purchased: "s.up1p"
    },
    // Area 1: Farm
    "coop": {
        img: "shops/cluckfuck",
        eyes: "shopblinks/cluckfuck", ex: 137, ey: 23,
        wares: [
            { product: "carrot", type: "seed" },
            { product: "beet", type: "seed" },
            { product: "pineapple", type: "seed" },
            { product: "grapes", type: "seed" }
        ],
        buyMult: 1, doesSell: false,
        opening: "s.co", leaving: "s.leave0", notEnough: "s.notenough0", purchased: "s.cpurch"
    },
    "inn0": {
        img: "shops/home", innId: "inn0",
        eyes: "shopblinks/home", ex: 118, ey: 43,
        wares: [
            { product: "sleep", price: 0, type: "inn" },
            { product: "book0", name: "bookVeg", price: 0, type: "book" },
            { product: "book3", name: "bookSeasons", price: 0, type: "book" },
            { product: "book1", name: "bookEquip", price: 0, type: "book" },
            { product: "book2", name: "bookShop", price: 0, type: "book" },
            { product: "book4", name: "bookStun", price: 0, type: "book" }
        ],
        opening: "s.home", leaving: "s.homeleave", purchased: "s.homesleep", awake: "s.homewake"
    },
    // Area 1: Town
    "equip1": {
        img: "shops/daveshoes",
        eyes: "shopblinks/daveshoes", ex: 108, ey: 26,
        wares: [
            { product: "!baseSickle", type: "equipment" },
            { product: "!goodSickle", type: "equipment" },
            { product: "!baseCompost", type: "equipment" },
            { product: "!weakGloves", type: "equipment" },
            { product: "!weakSoil", type: "equipment" }
        ],
        opening: "s.eq1o", leaving: "s.leave1o", notEnough: "s.notenough1o", purchased: "s.purchased1o", benignTalk: "s.talk1o"
    },
    "upgrade1": {
        img: "shops/expand1",
        eyes: "shopblinks/expand1", ex: 102, ey: 20,
        wares: [
            { product: "farmupgradeI", price: 1000, type: "upgrade" }
        ],
        opening: "s.up1o", empty: "s.upempty", leaving: "s.up1bye", notEnough: "s.up1not", purchased: "s.up1p", benignTalk: "s.up1talk"
    },
    "fixture1": {
        img: "shops/fixt1",
        eyes: "shopblinks/fixt1", ex: 100, ey: 28,
        wares: [
            { product: "_coop", type: "farm" },
            { product: "egg", type: "seed" },
            { product: "_log", type: "farm", locked: "quest1" },
            { product: "shiitake", type: "seed", locked: "quest1" },
            { product: "milkcap", type: "seed", locked: "quest1" },
            { product: "portobello", type: "seed", locked: "quest1" }
        ],
        opening: "s.fi1o", leaving: "s.chuckLeave", notEnough: "s.chuckNotEnough", purchased: "s.chuckBuy", talk: "quest1", benignTalk: "s.chuckTalk"
    },
    "seed1": {
        img: "shops/seedypete",
        eyes: "shopblinks/seedypete", ex: 106, ey: 23,
        wares: [
            { product: "carrot", type: "seed" },
            { product: "beet", type: "seed" },
            { product: "pineapple", type: "seed" },
            { product: "ginger", type: "seed" },
            { product: "apple", type: "seed" },
            { product: "rhubarb", type: "seed" }
        ],
        buyMult: 1, doesSell: false,
        opening: "s.seed1", leaving: "s.seed1leave", notEnough: "s.seed1not", purchased: "s.seed1buy", benignTalk: "s.seed1casual"
    },
    "inn1": {
        img: "shops/inn1", innId: "inn1",
        eyes: "shopblinks/inn1", ex: 108, ey: 22,
        wares: [
            { product: "sleep", price: 6, type: "inn" },
            { product: "book1", name: "bookForest", price: 0, type: "book" },
            { product: "book4", name: "bookMush", price: 0, type: "book" },
            { product: "book5", name: "bookEgg", price: 0, type: "book" },
            { product: "book3", name: "bookExpand", price: 0, type: "book" },
            { product: "book2", name: "bookRare", price: 0, type: "book" }
        ],
        opening: "s.innEnter1", leaving: "s.innLeave1", notEnough: "s.innNot1", purchased: "s.innPurch1", awake: "s.innAwake1"
    },
    // Area 2: Bridge
    "mermaid": {
        img: "shops/merm2",
        eyes: "shopblinks/merm2", ex: 113, ey: 32,
        wares: [
            { product: "_paddy", type: "farm" },
            { product: "rice", type: "seed" },
            { product: "arborio", type: "seed" },
            { product: "_lake", type: "farm" },
            { product: "rod", type: "seed" },
            { product: "net", type: "seed" }
        ],
        opening: "s.mermhello", leaving: "s.mermleave", notEnough: "s.mermnot", purchased: "s.mermbuy"
    },
    "mermaidinn": {
        img: "shops/merm1", innId: "mermaidinn",
        eyes: "shopblinks/merm1", ex: 107, ey: 28,
        wares: [
            { product: "sleep", price: 8, type: "inn" },
            { product: "book5", name: "bookPaddy", price: 0, type: "book" },
            { product: "book2", name: "bookFish", price: 0, type: "book" },
            { product: "book0", name: "bookBees", price: 0, type: "book" },
            { product: "book4", name: "bookCows", price: 0, type: "book" }
        ],
        opening: "s.merminn", leaving: "s.merminnleave", notEnough: "s.merminnnot", purchased: "s.merminnpurch", awake: "s.merminnawake", benignTalk: "s.merminntalk"
    },
    "cworker": {
        img: "shops/constr",
        eyes: "shopblinks/constr", ex: 105, ey: 33,
        wares: [
            { product: "corn", type: "seed" },
            { product: "bellpepper", type: "seed" },
            { product: "ginger", type: "seed" },
            { product: "!strongCompost", type: "equipment" },
            { product: "!sturdyCompost", type: "equipment" },
            { product: "!dblSickle", type: "equipment" },
            { product: "!hvySickle", type: "equipment" },
            { product: "!hoe", type: "equipment" },
            { product: "!salthoe", type: "equipment" },
            { product: "!speedSoil", type: "equipment" },
            { product: "!sturdSoil", type: "equipment" },
            { product: "!minSoil", type: "equipment" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: true,
        opening: "cwk.co", selling: "cwk.sell", didSell: "cwk.didsell", leaveSell: "cwk.leavesell", leaving: "cwk.leave", notEnough: "cwk.not", purchased: "cwk.purch"
    },
    // Area 3: Fake Farm
    "upgrade2": {
        img: "shops/cheebo",
        eyes: "shopblinks/cheebo", ex: 83, ey: 19, big: true, 
        wares: [
            { product: "farmupgradeI", price: 1000, type: "upgrade" },
            { product: "farmupgradeO", price: 2000, type: "upgrade" },
            { product: "farmupgrade_", price: 2000, type: "upgrade" }
        ],
        opening: "s.up2", empty: "s.up2empty", leaving: "s.up2leave", notEnough: "s.up2not", purchased: "s.up2p"
    },
    "fixture2": {
        img: "shops/piggy",
        eyes: "shopblinks/piggy", ex: 110, ey: 35,
        wares: [
            { product: "_cow", type: "farm" },
            { product: "fodder", type: "seed" },
            { product: "_strongsoil", type: "farm" },
            { product: "_hotspot", type: "farm" }
        ],
        opening: "s.f3open", leaving: "s.f3leave", notEnough: "s.f3not", purchased: "s.f3purch", benignTalk: "s.f3talk"
    },
    // Area 4: South City
    "skumpys": {
        img: "shops/skumpy", innId: "skumpys",
        eyes: "shopblinks/skumpy", ex: 113, ey: 36,
        wares: [
            { product: "sleep", price: 20, type: "inn" },
            { product: "book0", name: "bookElem", price: 0, type: "book" },
            { product: "book1", name: "bookTech", price: 0, type: "book" },
            { product: "book4", name: "bookTechs", price: 0, type: "book" },
            { product: "book5", name: "bookTips", price: 0, type: "book" }
        ],
        opening: "s.skumpO", leaving: "s.skumpL", notEnough: "s.skumpN", purchased: "s.skumpP", awake: "s.skumpA", benignTalk: "s.skumpT"
    },
    "mantools": {
        img: "shops/realactualhuman",
        eyes: "shopblinks/realactualhuman", ex: 124, ey: 28,
        wares: [
            { product: "!sicklerang", type: "equipment" },
            { product: "!sunSickle", type: "equipment" },
            { product: "!jumboCompost", type: "equipment" },
            { product: "!vitaminCompost", type: "equipment" },
            { product: "!pairGloves", type: "equipment" },
            { product: "!gardenGloves", type: "equipment" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: false,
        opening: "s.manO", leaving: "s.manL", notEnough: "s.manN", purchased: "s.manP"
    },
    "seedshack": {
        img: "shops/seedshack",
        eyes: "shopblinks/seedshack", ex: 110, ey: 22,
        wares: [
            { product: "asparagus", type: "seed" },
            { product: "bellpepper", type: "seed" },
            { product: "corn", type: "seed" },
            { product: "radish", type: "seed" },
            { product: "blackberry", type: "seed" },
            { product: "blackrice", type: "seed" },
            { product: "shortgrain", type: "seed" },
            { product: "greenshroom", type: "seed" },
            { product: "blackshroom", type: "seed" },
            { product: "poisnshroom", type: "seed" },
            { product: "beet", type: "seed" },
            { product: "garlic", type: "seed" },
            { product: "apricot", type: "seed" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: false,
        opening: "s.seedsO", leaving: "s.seedsL", notEnough: "s.seedsN", purchased: "s.seedsP"
    },
    "catalinas": {
        img: "shops/catalina",
        eyes: "shopblinks/catalina", ex: 100, ey: 25, big: true, 
        wares: [
            { product: "_sprinkler", type: "farm" },
            { product: "_log", type: "farm" },
            { product: "_coop", type: "farm" },
            { product: "_lake", type: "farm" },
            { product: "_paddy", type: "farm" },
            { product: "_strongsoil", type: "farm" },
            { product: "beeB", type: "seed" },
            { product: "beeR", type: "seed", locked: "catmail" },
            { product: "beeG", type: "seed", locked: "catmail" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: false,
        opening: "s.catO", leaving: "s.catL", notEnough: "s.catN", purchased: "s.catP", talk: "catmail", benignTalk: "s.catT"
    },
    "tinker": {
        img: "shops/tinker",
        eyes: "shopblinks/tinker", ex: 87, ey: 9, rapid: true, 
        wares: [
            { product: "_shooter", type: "farm" },
            { product: "_modulator", type: "farm" },
            { product: "_hotspot", type: "farm" },
            { product: "!compost2", type: "equipment" },
            { product: "headphones", type: "seed" },
            { product: "battery", type: "seed" },
            { product: "frogbot", type: "seed" },
            { product: "coffee", type: "seed" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: false,
        opening: "s.tierraO", leaving: "s.tierraL", notEnough: "s.tierraN", purchased: "s.tierraP", benignTalk: "s.tierraT"
    },
    "pawn": {
        img: "shops/pawn",
        eyes: "shopblinks/pawn", ex: 105, ey: 30,
        wares: [
            { product: "drone", type: "seed" },
            { product: "net", type: "seed" },
            { product: "bignet", type: "seed" },
            { product: "platypus", type: "seed" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: false,
        opening: "s.pawnO", leaving: "s.pawnL", notEnough: "s.pawnN", purchased: "s.pawnP", benignTalk: "s.pawnT"
    },
    "church": {
        img: "shops/church",
        eyes: "shopblinks/none", ex: 0, ey: 0,
        wares: [
            { product: "alms", name: "alms", price: 1000, type: "alms" },
            { product: "book2", name: "bookWater", price: 0, type: "book" },
            { product: "holywater", type: "seed" },
            { product: "holyjug", type: "seed" },
            { product: "book3", name: "bookHits", price: 0, type: "book" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: false,
        opening: "s.chO", leaving: "s.chL", notEnough: "s.chN", purchased: "s.chP", benignTalk: "s.chT"
    },
    // Area 5: North City
    "cityFixtures": {
        img: "shops/cityfixture",
        eyes: "shopblinks/none", ex: 0, ey: 0,
        wares: [
            { product: "_sprinkler", type: "farm" },
            { product: "_hotspot", type: "farm" },
            { product: "_modulator", type: "farm" },
            { product: "_shooter", type: "farm" },
            { product: "_strongsoil", type: "farm" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: false,
        opening: "s.fnO", leaving: "s.fnL", notEnough: "s.fnN", purchased: "s.fnP"
    },
    "cityInn": {
        img: "shops/hotel", innId: "bigCity",
        eyes: "shopblinks/hotel", ex: 113, ey: 24,
        wares: [
            { product: "sleep", price: 500, type: "inn" },
            { product: "book1", name: "bookCard", price: 0, type: "book" },
            { product: "book5", name: "bookMan", price: 0, type: "book" },
            { product: "book0", name: "bookApp", price: 0, type: "book" }
        ],
        opening: "s.hotelO", leaving: "s.hotelL", notEnough: "s.hotelN", purchased: "s.hotelP", awake: "s.hotelA"
    },
    "gordonsFarming": {
        img: "shops/gordon",
        eyes: "shopblinks/gordon", ex: 105, ey: 27,
        wares: [
            { product: "portobello", type: "seed" },
            { product: "milkcap", type: "seed" },
            { product: "blackshroom", type: "seed" },
            { product: "shortgrain", type: "seed" },
            { product: "blackrice", type: "seed" },
            { product: "mango", type: "seed" },
            { product: "lemon", type: "seed" },
            { product: "blackberry", type: "seed" },
            { product: "apricot", type: "seed" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: false,
        opening: "s.gordO", leaving: "s.gordL", notEnough: "s.gordN", purchased: "s.gordP", benignTalk: "s.gordT"
    },
    "cityTech": {
        img: "shops/tech",
        eyes: "shopblinks/tech", ex: 113, ey: 51,
        wares: [
            { product: "!sickle2", type: "equipment" },
            { product: "_charger", type: "farm" },
            { product: "sicklebattery", type: "seed" },
            { product: "!gloves2", type: "equipment" },
            { product: "!pesticide2", type: "equipment" },
            { product: "!pltSickle", type: "equipment" },
            { product: "!sbGloves", type: "equipment" },
            { product: "!waterfall", type: "equipment" },
            { product: "!immunity", type: "equipment" },
            { product: "!seasonal", type: "equipment" },
            { product: "frogbot", type: "seed" },
            { product: "app", type: "seed" },
            { product: "printer", type: "seed" },
            { product: "headphones", type: "seed" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: false,
        opening: "s.epicO", leaving: "s.epicL", notEnough: "s.epicN", purchased: "s.epicP"
    },
    "cityExpansions": {
        img: "shops/epickyle",
        eyes: "shopblinks/epickyle", ex: 114, ey: 24,
        wares: [
            { product: "farmupgradeI", price: 1000, type: "upgrade" },
            { product: "farmupgradeO", price: 2000, type: "upgrade" },
            { product: "farmupgrade_", price: 2000, type: "upgrade" },
            { product: "farmupgradeOO", price: 6000, type: "upgrade" },
            { product: "farmupgrade__", price: 6000, type: "upgrade" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: false,
        opening: "s.kyleO", empty: "s.kyleE", leaving: "s.kyleL", notEnough: "s.kyleN", purchased: "s.kyleP"
    },
    // Final Area: HQ
    "vendo_veg": {
        img: "shops/vendo",
        eyes: "shopblinks/none", ex: 0, ey: 0,
        wares: [
            { product: "asparagus", type: "seed" },
            { product: "beet", type: "seed" },
            { product: "bellpepper", type: "seed" },
            { product: "carrot", type: "seed" },
            { product: "corn", type: "seed" },
            { product: "garlic", type: "seed" },
            { product: "ginger", type: "seed" },
            { product: "leek", type: "seed" },
            { product: "pineapple", type: "seed" },
            { product: "radish", type: "seed" },
            { product: "rhubarb", type: "seed" },
            { product: "spinach", type: "seed" },
            { product: "tomato", type: "seed" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: false,
        opening: "s.vendoEnter", leaving: "s.vendoLeave", notEnough: "s.vendoNotEnough", purchased: "s.vendoBought"
    },
    "vendo_tree": {
        img: "shops/vendo",
        eyes: "shopblinks/none", ex: 0, ey: 0,
        wares: [
            { product: "apple", type: "seed" },
            { product: "apricot", type: "seed" },
            { product: "avocado", type: "seed" },
            { product: "banana", type: "seed" },
            { product: "blackberry", type: "seed" },
            { product: "grapes", type: "seed" },
            { product: "kiwi", type: "seed" },
            { product: "lemon", type: "seed" },
            { product: "mango", type: "seed" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: false,
        opening: "s.vendoEnter", leaving: "s.vendoLeave", notEnough: "s.vendoNotEnough", purchased: "s.vendoBought"
    },
    "vendo_mush": {
        img: "shops/vendo",
        eyes: "shopblinks/none", ex: 0, ey: 0,
        wares: [
            { product: "shiitake", type: "seed" },
            { product: "milkcap", type: "seed" },
            { product: "portobello", type: "seed" },
            { product: "greenshroom", type: "seed" },
            { product: "blackshroom", type: "seed" },
            { product: "poisnshroom", type: "seed" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: false,
        opening: "s.vendoEnter", leaving: "s.vendoLeave", notEnough: "s.vendoNotEnough", purchased: "s.vendoBought"
    },
    "vendo_paddy": {
        img: "shops/vendo",
        eyes: "shopblinks/none", ex: 0, ey: 0,
        wares: [
            { product: "rice", type: "seed" },
            { product: "arborio", type: "seed" },
            { product: "blackrice", type: "seed" },
            { product: "shortgrain", type: "seed" },
            { product: "chestnut", type: "seed" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: false,
        opening: "s.vendoEnter", leaving: "s.vendoLeave", notEnough: "s.vendoNotEnough", purchased: "s.vendoBought"
    },
    "vendo_coop": {
        img: "shops/vendo",
        eyes: "shopblinks/none", ex: 0, ey: 0,
        wares: [
            { product: "egg", type: "seed" },
            { product: "quail", type: "seed" },
            { product: "goose", type: "seed" },
            { product: "turkey", type: "seed" },
            { product: "platypus", type: "seed" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: false,
        opening: "s.vendoEnter", leaving: "s.vendoLeave", notEnough: "s.vendoNotEnough", purchased: "s.vendoBought"
    },
    "vendo_water": {
        img: "shops/vendo",
        eyes: "shopblinks/none", ex: 0, ey: 0,
        wares: [
            { product: "spear", type: "seed" },
            { product: "rod", type: "seed" },
            { product: "goodrod", type: "seed" },
            { product: "metalrod", type: "seed" },
            { product: "net", type: "seed" },
            { product: "bignet", type: "seed" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: false,
        opening: "s.vendoEnter", leaving: "s.vendoLeave", notEnough: "s.vendoNotEnough", purchased: "s.vendoBought"
    },
    "vendo_tech": {
        img: "shops/vendo",
        eyes: "shopblinks/none", ex: 0, ey: 0,
        wares: [
            { product: "battery", type: "seed" },
            { product: "headphones", type: "seed" },
            { product: "printer", type: "seed" },
            { product: "app", type: "seed" },
            { product: "drone", type: "seed" },
            { product: "frogbot", type: "seed" },
            { product: "coffee", type: "seed" },
            { product: "sicklebattery", type: "seed" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: false,
        opening: "s.vendoEnter", leaving: "s.vendoLeave", notEnough: "s.vendoNotEnough", purchased: "s.vendoBought"
    },
    "lastInn": {
        img: "shops/finalInn", innId: "lastInn",
        eyes: "shopblinks/none", ex: 0, ey: 0,
        wares: [
            { product: "sleep", type: "inn", price: 0 },
            { product: "book3", name: "bookEnt", price: 0, type: "book" }
        ],
        opening: "s.innLastO", leaving: "s.leaveEnd", purchased: "s.innPurchLast", awake: "s.lastWake"
    },

    "template": {
        img: "",
        wares: [
            { product: "", type: "" },
            { product: "", type: "" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: false,
        opening: "", leaving: "s.leave", notEnough: "s.notenough", purchased: "s.purchased"
        /*selling: "", didSell: "", leaveSell: "",*/
    }
};
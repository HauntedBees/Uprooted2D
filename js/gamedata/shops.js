var stores = {
    // Debug
    "farmupgradeFull": {
        img: "shops/cock",
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
        img: "shops/cock",
        wares: [
            { product: "_coop", type: "farm" },
            { product: "egg", type: "seed" },
            { product: "carrot", type: "seed" },
            { product: "beet", type: "seed" },
            { product: "pineapple", type: "seed" },
            { product: "grapes", type: "seed" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: true,
        opening: "s.co", selling: "s.sell", didSell: "s.didsell", leaveSell: "s.leavesell", leaving: "s.leave", notEnough: "s.notenough", purchased: "s.cpurch"
    },
    "inn0": {
        img: "shops/home", innId: "inn0",
        wares: [ { product: "sleep", price: 0, type: "inn" } ],
        opening: "s.home", leaving: "s.homeleave", purchased: "s.homesleep"
    },
    // Area 1: Town
    "equip1": {
        img: "shops/dwarf",
        wares: [
            { product: "!baseSickle", type: "equipment" },
            { product: "!goodSickle", type: "equipment" },
            { product: "!baseCompost", type: "equipment" },
            { product: "!weakGloves", type: "equipment" },
            { product: "!weakSoil", type: "equipment" }
        ],
        opening: "s.eq1o", leaving: "s.leave2", notEnough: "s.notenough", purchased: "s.purchased"
    },
    "upgrade1": {
        img: "shops/dwarf2",
        wares: [
            { product: "farmupgradeI", price: 2000, type: "upgrade" }
        ],
        opening: "s.up1o", empty: "s.upempty", leaving: "s.leave", notEnough: "s.notenough", purchased: "s.up1p"
    },
    "fixture1": {
        img: "shops/dwarf3",
        wares: [
            { product: "_coop", type: "farm" },
            { product: "egg", type: "seed" },
            { product: "_log", type: "farm", locked: "quest1" },
            { product: "shiitake", type: "seed", locked: "quest1" },
            { product: "milkcap", type: "seed", locked: "quest1" },
            { product: "portobello", type: "seed", locked: "quest1" }
        ],
        opening: "s.fi1o", leaving: "s.leave2", notEnough: "s.notenough", purchased: "s.purchased", talk: "quest1"
    },
    "seed1": {
        img: "shops/dwarf",
        wares: [
            { product: "carrot", type: "seed" },
            { product: "beet", type: "seed" },
            { product: "pineapple", type: "seed" },
            { product: "ginger", type: "seed" },
            { product: "apple", type: "seed" },
            { product: "rhubarb", type: "seed" }
        ],
        buyMult: 1, doesSell: false,
        opening: "s.seed1", leaving: "s.leave", notEnough: "s.notenough", purchased: "s.purchased"
    },
    "inn1": {
        img: "shops/dwarf2", innId: "inn1",
        wares: [ { product: "sleep", price: 6, type: "inn" } ],
        opening: "s.inn1", leaving: "s.leave", notEnough: "s.notenough", purchased: "s.innpurch"
    },
    // Area 2: Bridge
    "mermaid": {
        img: "shops/merm",
        wares: [
            { product: "_paddy", type: "farm" },
            { product: "rice", type: "seed" },
            { product: "arborio", type: "seed" },
            { product: "_lake", type: "farm" },
            { product: "rod", type: "seed" },
            { product: "net", type: "seed" }
        ],
        opening: "s.mermhello", leaving: "s.leave2", notEnough: "s.notenough", purchased: "s.purchased"
    },
    "mermaidinn": {
        img: "shops/merm", innId: "mermaidinn",
        wares: [ { product: "sleep", price: 8, type: "inn" } ],
        opening: "s.inn1", leaving: "s.leave", notEnough: "s.notenough", purchased: "s.innpurch"
    },
    "cworker": {
        img: "shops/dwarf",
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
        opening: "cwk.co", selling: "s.sell", didSell: "s.didsell", leaveSell: "s.leavesell", leaving: "cwk.leave", notEnough: "s.notenough", purchased: "s.cpurch"
    },
    // Area 3: Fake Farm
    "upgrade2": {
        img: "shops/dwarf2",
        wares: [
            { product: "farmupgradeI", price: 2000, type: "upgrade" },
            { product: "farmupgradeO", price: 4000, type: "upgrade" },
            { product: "farmupgrade_", price: 4000, type: "upgrade" }
        ],
        opening: "s.up2", empty: "s.upempty", leaving: "s.leave", notEnough: "s.notenough", purchased: "s.up2p"
    },
    "fixture2": {
        img: "shops/dwarf2",
        wares: [
            { product: "_cow", type: "farm" },
            { product: "fodder", type: "seed" },
            { product: "_strongsoil", type: "farm" },
            { product: "_hotspot", type: "farm" }
        ],
        opening: "s.fi1o", leaving: "s.leave2", notEnough: "s.notenough", purchased: "s.purchased"
    },
    // Area 4: South City
    "skumpys": {
        img: "shops/dwarf2", innId: "skumpys",
        wares: [ { product: "sleep", price: 20, type: "inn" } ],
        opening: "s.inn1", leaving: "s.leave", notEnough: "s.notenough", purchased: "s.innpurch"
    },
    "mantools": {
        img: "shops/dwarf2",
        wares: [
            { product: "!sicklerang", type: "equipment" },
            { product: "!sunSickle", type: "equipment" },
            { product: "!fortCompost", type: "equipment" },
            { product: "!healthyCompost", type: "equipment" },
            { product: "!jumboCompost", type: "equipment" },
            { product: "!vitaminCompost", type: "equipment" },
            { product: "!pairGloves", type: "equipment" },
            { product: "!gardenGloves", type: "equipment" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: false,
        opening: "", leaving: "s.leave", notEnough: "s.notenough", purchased: "s.purchased"
    },
    "seedshack": {
        img: "shops/dwarf2",
        wares: [
            { product: "carrot", type: "seed" },
            { product: "carrot", type: "seed" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: false,
        opening: "", leaving: "s.leave", notEnough: "s.notenough", purchased: "s.purchased"
    },
    "catalinas": {
        img: "shops/dwarf2",
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
        opening: "s.fi1o", leaving: "s.leave", notEnough: "s.notenough", purchased: "s.purchased", talk: "catmail"
    },
    "tinker": {
        img: "shops/dwarf2",
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
        opening: "", leaving: "s.leave", notEnough: "s.notenough", purchased: "s.purchased"
    },
    "pawn": {
        img: "shops/dwarf2",
        wares: [
            { product: "drone", type: "seed" },
            { product: "net", type: "seed" },
            { product: "bignet", type: "seed" },
            { product: "platypus", type: "seed" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: false,
        opening: "", leaving: "s.leave", notEnough: "s.notenough", purchased: "s.purchased"
    },
    "church": {
        img: "shops/dwarf2",
        wares: [
            { product: "carrot", type: "seed" },
            { product: "carrot", type: "seed" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: false,
        opening: "", leaving: "s.leave", notEnough: "s.notenough", purchased: "s.purchased"
    },
    // Area 5: North City
    "cityFixtures": {
        img: "shops/dwarf2",
        wares: [
            { product: "_sprinkler", type: "farm" },
            { product: "_hotspot", type: "farm" },
            { product: "_modulator", type: "farm" },
            { product: "_shooter", type: "farm" },
            { product: "_strongsoil", type: "farm" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: false,
        opening: "", leaving: "s.leave", notEnough: "s.notenough", purchased: "s.purchased"
    },
    "cityInn": {
        img: "shops/dwarf2", innId: "bigCity",
        wares: [ { product: "sleep", price: 500, type: "inn" } ],
        opening: "s.inn1", leaving: "s.leave", notEnough: "s.notenough", purchased: "s.innpurch"
    },
    "gordonsFarming": {
        img: "shops/dwarf2",
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
        opening: "", leaving: "s.leave", notEnough: "s.notenough", purchased: "s.purchased"
    },
    "cityTech": {
        img: "shops/dwarf2",
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
        opening: "", leaving: "s.leave", notEnough: "s.notenough", purchased: "s.purchased"
    },
    "cityExpansions": {
        img: "shops/dwarf2",
        wares: [
            { product: "farmupgradeI", price: 2000, type: "upgrade" },
            { product: "farmupgradeO", price: 4000, type: "upgrade" },
            { product: "farmupgrade_", price: 4000, type: "upgrade" },
            { product: "farmupgradeOO", price: 8000, type: "upgrade" },
            { product: "farmupgrade__", price: 8000, type: "upgrade" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: false,
        opening: "", leaving: "s.leave", notEnough: "s.notenough", purchased: "s.purchased"
    },
    // Final Area: HQ
    "vendo_veg": {
        img: "shops/vendo",
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
        img: "shops/dwarf2", innId: "lastInn",
        wares: [ { product: "sleep", type: "inn" } ],
        opening: "s.inn1", leaving: "s.leave", notEnough: "s.notenough", purchased: "s.innpurch"
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
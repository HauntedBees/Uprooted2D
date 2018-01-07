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
            { product: "_coop", price: 100, type: "farm" },
            { product: "egg", price: 20, type: "seed" },
            { product: "carrot", price: 5, type: "seed" },
            { product: "beet", price: 6, type: "seed" },
            { product: "pineapple", price: 12, type: "seed" },
            { product: "grapes", price: 10, type: "seed" }//,
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
            { product: "!baseSickle", price: 50, type: "equipment" },
            { product: "!goodSickle", price: 50, type: "equipment" },
            { product: "!baseCompost", price: 50, type: "equipment" },
            { product: "!weakGloves", price: 50, type: "equipment" },
            { product: "!weakSoil", price: 50, type: "equipment" }
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
            { product: "_coop", price: 100, type: "farm" },
            { product: "egg", price: 20, type: "seed" },
            { product: "_log", price: 150, type: "farm", locked: "quest1" },
            { product: "shiitake", price: 20, type: "seed", locked: "quest1" },
            { product: "milkcap", price: 20, type: "seed", locked: "quest1" },
            { product: "portobello", price: 20, type: "seed", locked: "quest1" }
        ],
        opening: "s.fi1o", leaving: "s.leave2", notEnough: "s.notenough", purchased: "s.purchased", talk: "quest1"
    },
    "seed1": {
        img: "shops/dwarf",
        wares: [
            { product: "carrot", price: 5, type: "seed" },
            { product: "beet", price: 6, type: "seed" },
            { product: "pineapple", price: 12, type: "seed" },
            { product: "ginger", price: 10, type: "seed" },
            { product: "apple", price: 10, type: "seed" },
            { product: "rhubarb", price: 10, type: "seed" }
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
            { product: "_paddy", price: 100, type: "farm" },
            { product: "rice", price: 20, type: "seed" },
            { product: "arborio", price: 20, type: "seed" },
            { product: "_lake", price: 100, type: "farm" },
            { product: "rod", price: 20, type: "seed" },
            { product: "net", price: 20, type: "seed" }
        ],
        opening: "s.mermhello", leaving: "s.leave2", notEnough: "s.notenough", purchased: "s.purchased"
    },
    "mermaidinn": {
        img: "shops/merm", innId: "mermaidinn",
        wares: [ { product: "sleep", price: 6, type: "inn" } ],
        opening: "s.inn1", leaving: "s.leave", notEnough: "s.notenough", purchased: "s.innpurch"
    },
    "cworker": {
        img: "shops/dwarf",
        wares: [
            { product: "carrot", price: 5, type: "seed" },
            { product: "beet", price: 6, type: "seed" },
            { product: "pineapple", price: 12, type: "seed" },
            { product: "!strongCompost", price: 50, type: "equipment" },
            { product: "!sturdyCompost", price: 50, type: "equipment" },
            { product: "!dblSickle", price: 50, type: "equipment" },
            { product: "!hvySickle", price: 50, type: "equipment" },
            { product: "!hoe", price: 50, type: "equipment" },
            { product: "!salthoe", price: 50, type: "equipment" },
            { product: "!speedSoil", price: 50, type: "equipment" },
            { product: "!sturdSoil", price: 50, type: "equipment" },
            { product: "!minSoil", price: 50, type: "equipment" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: true,
        opening: "cwk.co", selling: "s.sell", didSell: "s.didsell", leaveSell: "s.leavesell", leaving: "cwk.leave", notEnough: "s.notenough", purchased: "s.cpurch"
    },
    // Area 3: Fake Farm
    "upgrade2": {
        img: "shops/dwarf2",
        wares: [
            { product: "farmupgradeI", price: 2000, type: "upgrade" },
            { product: "farmupgradeO", price: 0, type: "upgrade" },
            { product: "farmupgrade_", price: 0, type: "upgrade" }
        ],
        opening: "s.up2", empty: "s.upempty", leaving: "s.leave", notEnough: "s.notenough", purchased: "s.up2p"
    },
    "fixture2": {
        img: "shops/dwarf2",
        wares: [
            { product: "_cow", price: 100, type: "farm" },
            { product: "fodder", price: 20, type: "seed" },
            { product: "_strongsoil", price: 150, type: "farm" },
            { product: "_hotspot", price: 20, type: "farm" }
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
            { product: "!sicklerang", price: 50, type: "equipment" },
            { product: "!sunSickle", price: 50, type: "equipment" },
            { product: "!fortCompost", price: 50, type: "equipment" },
            { product: "!healthyCompost", price: 50, type: "equipment" },
            { product: "!jumboCompost", price: 50, type: "equipment" },
            { product: "!vitaminCompost", price: 50, type: "equipment" },
            { product: "!pairGloves", price: 50, type: "equipment" },
            { product: "!gardenGloves", price: 50, type: "equipment" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: false,
        opening: "", leaving: "s.leave", notEnough: "s.notenough", purchased: "s.purchased"
    },
    "seedshack": {
        img: "shops/dwarf2",
        wares: [
            { product: "carrot", price: 0, type: "seed" },
            { product: "carrot", price: 0, type: "seed" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: false,
        opening: "", leaving: "s.leave", notEnough: "s.notenough", purchased: "s.purchased"
    },
    "catalinas": {
        img: "shops/dwarf2",
        wares: [
            { product: "_sprinkler", price: 100, type: "farm" },
            { product: "_log", price: 100, type: "farm" },
            { product: "_coop", price: 100, type: "farm" },
            { product: "_lake", price: 100, type: "farm" },
            { product: "_paddy", price: 100, type: "farm" },
            { product: "_strongsoil", price: 100, type: "farm" },
            { product: "beeB", price: 1000, type: "seed" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: false,
        opening: "", leaving: "s.leave", notEnough: "s.notenough", purchased: "s.purchased"
    },
    "tinker": {
        img: "shops/dwarf2",
        wares: [
            { product: "_shooter", price: 1000, type: "farm" },
            { product: "_modulator", price: 1000, type: "farm" },
            { product: "_hotspot", price: 250, type: "farm" },
            { product: "!compost2", price: 5000, type: "equipment" },
            { product: "headphones", price: 20, type: "seed" },
            { product: "battery", price: 20, type: "seed" },
            { product: "frogbot", price: 20, type: "seed" },
            { product: "coffee", price: 20, type: "seed" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: false,
        opening: "", leaving: "s.leave", notEnough: "s.notenough", purchased: "s.purchased"
    },
    "pawn": {
        img: "shops/dwarf2",
        wares: [
            { product: "drone", price: 50, type: "seed" },
            { product: "net", price: 50, type: "seed" },
            { product: "bignet", price: 50, type: "seed" },
            { product: "platypus", price: 150, type: "seed" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: false,
        opening: "", leaving: "s.leave", notEnough: "s.notenough", purchased: "s.purchased"
    },
    "church": {
        img: "shops/dwarf2",
        wares: [
            { product: "carrot", price: 0, type: "seed" },
            { product: "carrot", price: 0, type: "seed" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: false,
        opening: "", leaving: "s.leave", notEnough: "s.notenough", purchased: "s.purchased"
    },

    "cityFixtures": {
        img: "shops/dwarf2",
        wares: [
            { product: "carrot", price: 0, type: "seed" },
            { product: "carrot", price: 0, type: "seed" }
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
            { product: "carrot", price: 0, type: "seed" },
            { product: "carrot", price: 0, type: "seed" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: false,
        opening: "", leaving: "s.leave", notEnough: "s.notenough", purchased: "s.purchased"
    },
    "cityTech": {
        img: "shops/dwarf2",
        wares: [
            { product: "carrot", price: 0, type: "seed" },
            { product: "carrot", price: 0, type: "seed" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: false,
        opening: "", leaving: "s.leave", notEnough: "s.notenough", purchased: "s.purchased"
    },
    "cityExpansions": {
        img: "shops/dwarf2",
        wares: [
            { product: "carrot", price: 0, type: "seed" },
            { product: "carrot", price: 0, type: "seed" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: false,
        opening: "", leaving: "s.leave", notEnough: "s.notenough", purchased: "s.purchased"
    },

    "template": {
        img: "",
        wares: [
            { product: "", price: 0, type: "" },
            { product: "", price: 0, type: "" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: false,
        opening: "", leaving: "s.leave", notEnough: "s.notenough", purchased: "s.purchased"
        /*selling: "", didSell: "", leaveSell: "",*/
    }
};
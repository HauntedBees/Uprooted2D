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
        opening: "s_up1o", empty: "s_upempty", leaving: "s_leave", notEnough: "s_notenough", purchased: "s_up1p"
    },
    // Area 1: Farm
    "coop": {
        img: "shops/cock",
        wares: [
            { product: "_coop", price: 100, type: "farm" },
            { product: "egg", price: 20, type: "seed" },
            { product: "carrot", price: 5, type: "seed" },
            { product: "beet", price: 6, type: "seed" },
            //{ product: "pineapple", price: 12, type: "seed" },
            { product: "grapes", price: 10, type: "seed" }//,
            //{ product: "!baseSickle", price: 50, type: "equipment" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: true,
        opening: "s_co", selling: "s_sell", didSell: "s_didsell", leaveSell: "s_leavesell", leaving: "s_leave", notEnough: "s_notenough", purchased: "s_cpurch"
    },
    "inn0": {
        img: "shops/home", innId: "inn0",
        wares: [ { product: "sleep", price: 0, type: "inn" } ],
        opening: "s_home", leaving: "s_homeleave", purchased: "s_homesleep"
    },
    // Area 1: Town
    "equip1": {
        img: "shops/dwarf",
        wares: [
            { product: "!baseSickle", price: 50, type: "equipment" },
            { product: "!goodSickle", price: 50, type: "equipment" },
            { product: "!baseCompost", price: 50, type: "equipment" }
        ],
        opening: "s_eq1o", leaving: "s_leave2", notEnough: "s_notenough", purchased: "s_purchased"
    },
    "upgrade1": {
        img: "shops/dwarf2",
        wares: [
            { product: "farmupgradeI", price: 2000, type: "upgrade" }
        ],
        opening: "s_up1o", empty: "s_upempty", leaving: "s_leave", notEnough: "s_notenough", purchased: "s_up1p"
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
        opening: "s_fi1o", leaving: "s_leave2", notEnough: "s_notenough", purchased: "s_purchased", talk: "quest1"
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
        opening: "s_seed1", leaving: "s_leave", notEnough: "s_notenough", purchased: "s_purchased"
    },
    "inn1": {
        img: "shops/dwarf2", innId: "inn1",
        wares: [ { product: "sleep", price: 6, type: "inn" } ],
        opening: "s_inn1", leaving: "s_leave", notEnough: "s_notenough", purchased: "s_innpurch"
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
        opening: "s_mermhello", leaving: "s_leave2", notEnough: "s_notenough", purchased: "s_purchased"
    },
    "mermaidinn": {
        img: "shops/merm", innId: "mermaidinn",
        wares: [ { product: "sleep", price: 6, type: "inn" } ],
        opening: "s_inn1", leaving: "s_leave", notEnough: "s_notenough", purchased: "s_innpurch"
    },
    "cworker": {
        img: "shops/dwarf",
        wares: [
            { product: "carrot", price: 5, type: "seed" },
            { product: "beet", price: 6, type: "seed" },
            { product: "pineapple", price: 12, type: "seed" },
            { product: "!weakGloves", price: 50, type: "equipment" },
            { product: "!weakSoil", price: 50, type: "equipment" },
            { product: "!strongCompost", price: 50, type: "equipment" },
            { product: "!sturdyCompost", price: 50, type: "equipment" },
            { product: "!spSickle", price: 50, type: "equipment" },
            { product: "!suSickle", price: 50, type: "equipment" },
            { product: "!auSickle", price: 50, type: "equipment" },
            { product: "!wiSickle", price: 50, type: "equipment" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: true,
        opening: "cwk_co", selling: "s_sell", didSell: "s_didsell", leaveSell: "s_leavesell", leaving: "cwk_leave", notEnough: "s_notenough", purchased: "s_cpurch"
    },
    // Area 3: Fake Farm
    "upgrade2": {
        img: "shops/dwarf2",
        wares: [
            { product: "farmupgradeI", price: 2000, type: "upgrade" },
            { product: "farmupgradeO", price: 0, type: "upgrade" },
            { product: "farmupgrade_", price: 0, type: "upgrade" }
        ],
        opening: "s_up2", empty: "s_upempty", leaving: "s_leave", notEnough: "s_notenough", purchased: "s_up2p"
    },
    "fixture2": {
        img: "shops/dwarf2",
        wares: [
            { product: "_cow", price: 100, type: "farm" },
            { product: "fodder", price: 20, type: "seed" },
            { product: "_strongsoil", price: 150, type: "farm" },
            { product: "_hotspot", price: 20, type: "farm" }
        ],
        opening: "s_fi1o", leaving: "s_leave2", notEnough: "s_notenough", purchased: "s_purchased"
    },
    "template": {
        img: "",
        wares: [
            { product: "", price: 0, type: "" },
            { product: "", price: 0, type: "" }
        ],
        buyMult: 1, sellMult: 0.5, doesSell: false,
        opening: "", leaving: "s_leave", notEnough: "s_notenough", purchased: "s_purchased"
        /*selling: "", didSell: "", leaveSell: "",*/
    }
};
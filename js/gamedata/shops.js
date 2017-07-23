var stores = {
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
    "mermaid": {
        img: "shops/merm",
        wares: [
            { product: "_paddy", price: 100, type: "farm" },
            { product: "rice", price: 20, type: "seed" },
            { product: "_lake", price: 100, type: "farm" },
            { product: "rod", price: 20, type: "seed" },
            { product: "net", price: 20, type: "seed" }
        ],
        opening: "s_mermhello", leaving: "s_leave2", notEnough: "s_notenough", purchased: "s_purchased", talk: "questM"
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
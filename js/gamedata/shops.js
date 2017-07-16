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
        opening: "hi welcome to the farm upgrade shack",
        empty: "welcome. unfortunately i have no other upgrades for you. :(",
        leaving: "bye fucker",
        notEnough: "you can't afford me, baby",
        purchased: "thanks"
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
        buyMult: 1, sellMult: 0.5,
        doesSell: true,
        opening: "s_co",
        selling: "s_sell",
        didSell: "s_didsell",
        leaveSell: "s_leavesell",
        leaving: "s_leave",
        notEnough: "s_notenough",
        purchased: "s_cpurch"
    },
    "equip1": {
        img: "shops/dwarf",
        wares: [
            { product: "!goodSickle", price: 50, type: "equipment" },
            { product: "!strongCompost", price: 50, type: "equipment" }
        ],
        opening: "s_eq1o",
        leaving: "s_leave2",
        notEnough: "s_notenough",
        purchased: "s_purchased"
    },
    "upgrade1": {
        img: "shops/dwarf2",
        wares: [
            { product: "farmupgradeI", price: 2000, type: "upgrade" }
        ],
        opening: "s_up1o",
        empty: "s_upempty",
        leaving: "s_leave",
        notEnough: "s_notenough",
        purchased: "s_up1p"
    },
    "mushhouse": {
        img: "shops/cock",
        wares: [
            { product: "_log", price: 150, type: "farm" },
            { product: "shiitake", price: 10, type: "seed" },
            { product: "milkcap", price: 10, type: "seed" },
            { product: "portobello", price: 10, type: "seed" }
        ],
        opening: "s_co",
        leaving: "s_leave",
        notEnough: "s_notenough",
        purchased: "s_cpurch"
    },
    "template": {
        img: "",
        wares: [
            { product: "", price: 0, type: "" },
            { product: "", price: 0, type: "" }
        ],
        doesSell: false,
        opening: "",
        leaving: "",
        /*selling: "",
        didSell: "",
        leaveSell: "",*/
        notEnough: "",
        purchased: ""
    }
};
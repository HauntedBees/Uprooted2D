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
        opening: "Bu-GAWK! Hi boss! Got some good seeds on sale! What? You want a discount? Cluck off - a girl's gotta make money somehow!",
        selling: "WOT'RE YA SELLIN'???",
        didSell: "Thanks for the shit, fucfkace.",
        leaveSell: "stop giving me THINGS and start giving me MONEY.",
        leaving: "Later, 'gator.",
        notEnough: "Hey fuckface this is a store not charity. Have the money or have a gofuckyourself.",
        purchased: "Bu-GAWK!! Good shit, good shit. Thank you for your patronage!"
    },
    "mushhouse": {
        img: "shops/cock",
        wares: [
            { product: "_log", price: 150, type: "farm" },
            { product: "shiitake", price: 10, type: "seed" },
            { product: "milkcap", price: 10, type: "seed" },
            { product: "portobello", price: 10, type: "seed" }
        ],
        opening: "hello welcome to mushroom house shop",
        leaving: "bye mom",
        notEnough: "this ain't enough dough, yo",
        purchased: "thanks mom"
    },
    "template": {
        img: "",
        wares: [
            { product: "", price: 0, type: "" },
            { product: "", price: 0, type: "" }
        ],
        opening: "",
        leaving: "",
        notEnough: "",
        purchased: ""
    }
};
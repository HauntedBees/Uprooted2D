const achievements = [ 
    "boss1", "lakeFairy", "goldshroom", "badrabbit", "limeTime", "RAPBATTLE", "boss2", "dowel", "kelpBuddy", "boss3help", "boss3hurt",
    "crouton", "unplugged", "boss4", "skumpy", "abuelita", "bossMob", "stonehenge", "laila", "bankStop", "boss5", "helpNerd", "abee",
    "techGood", "techBad", "natureGood", "natureBad", "vegan", "beeKing", "luddite", "springKing", "summerHummer", "autumnBottom", "winterHinter", 
    "vegbuddy", "treebuddy", "mushbuddy", "eggbuddy", "ricebuddy", "beebuddy", "seabuddy", "cowbuddy", "techbuddy", "biglaunch", "soybeat", "fullUpgrade",
    "allCrop", "overkill", "madeForMe", "murderedToDeath"
];
function JustBeatGameChievoCheck() {
    const md = player.miscdata;
    if(player.ethicsAxis >= 0) {
        if(player.techAxis <= 0) { AddAchievementIfMissing("natureGood"); }
        else { AddAchievementIfMissing("techGood"); }
    } else {
        if(player.techAxis <= 0) { AddAchievementIfMissing("natureBad"); }
        else { AddAchievementIfMissing("techBad"); }
    }
    if((md.typesPlanted["egg"] + md.typesPlanted["bee"] + md.typesPlanted["cow"] + md.typesPlanted["rod"] + md.typesPlanted["water"]) === 0) {
        AddAchievementIfMissing("vegan");
    }
    if(md.typesPlanted["tech"] === 0 && md.techFixturesUsed === 0) { AddAchievementIfMissing("luddite"); }
};
function CombatChievoCheck() {
    const md = player.miscdata;
    if(md.seasonsPlanted[0] >= 500) { AddAchievementIfMissing("springKing"); }
    if(md.seasonsPlanted[1] >= 500) { AddAchievementIfMissing("summerHummer"); }
    if(md.seasonsPlanted[2] >= 500) { AddAchievementIfMissing("autumnBottom"); }
    if(md.seasonsPlanted[3] >= 500) { AddAchievementIfMissing("winterHinter"); }
    if(md.typesPlanted["veg"] >= 1000) { AddAchievementIfMissing("vegbuddy"); }
    if(md.typesPlanted["tree"] >= 500) { AddAchievementIfMissing("treebuddy"); }
    if(md.typesPlanted["mush"] >= 500) { AddAchievementIfMissing("mushbuddy"); }
    if(md.typesPlanted["egg"] >= 500) { AddAchievementIfMissing("eggbuddy"); }
    if(md.typesPlanted["rice"] >= 500) { AddAchievementIfMissing("ricebuddy"); }
    if(md.typesPlanted["bee"] >= 500) { AddAchievementIfMissing("beebuddy"); }
    if((md.typesPlanted["rod"] + md.typesPlanted["water"]) >= 500) { AddAchievementIfMissing("seabuddy"); }
    if(md.typesPlanted["cow"] >= 500) { AddAchievementIfMissing("cowbuddy"); }
    if(md.typesPlanted["tech"] >= 500) { AddAchievementIfMissing("techbuddy"); }
};
function AddAchievementIfMissing(chievo) { if(player.achievements.indexOf(chievo) < 0) { player.achievements.push(chievo); } };
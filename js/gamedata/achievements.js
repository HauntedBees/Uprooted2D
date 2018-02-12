const achievements = {
    "boss1": { fromQuest: true },
    "lakeFairy": { fromQuest: true },
    "goldshroom": { fromQuest: false },
    "badrabbit": { fromQuest: true },
    "limeTime": { fromQuest: true },
    "RAPBATTLE": { fromQuest: true },
    "boss2": { fromQuest: true },
    "dowel": { fromQuest: true },
    "kelpBuddy": { fromQuest: true },
    "boss3help": { fromQuest: true },
    "boss3hurt": { fromQuest: true },
    "crouton": { fromQuest: true },
    "unplugged": { fromQuest: true }, // TODO: this should come from beating the boss via unplugging
    "boss4": { fromQuest: true },
    "skumpy": { fromQuest: true },
    "abuelita": { fromQuest: true },
    "bossMob": { fromQuest: true },
    "stonehenge": { fromQuest: true },
    "laila": { fromQuest: false },
    "bankStop": { fromQuest: true },
    "boss5": { fromQuest: true },
    "helpNerd": { fromQuest: true },
    "abee": { fromQuest: true },
    "techGood": { fromQuest: true },
    "techBad": { fromQuest: true },
    "natureGood": { fromQuest: true },
    "natureBad": { fromQuest: true },
    "vegan": { fromQuest: false },
    "beeKing": { fromQuest: false }, // unimplemented
    "luddite": { fromQuest: false }, // TODO: handle using tech fixtures, not just tech items
    "springKing": { fromQuest: false },
    "summerHummer": { fromQuest: false },
    "autumnBottom": { fromQuest: false },
    "winterHinter": { fromQuest: false },
    "vegbuddy": { fromQuest: false },
    "treebuddy": { fromQuest: false },
    "mushbuddy": { fromQuest: false },
    "eggbuddy": { fromQuest: false },
    "ricebuddy": { fromQuest: false },
    "beebuddy": { fromQuest: false },
    "seabuddy": { fromQuest: false },
    "cowbuddy": { fromQuest: false },
    "techbuddy": { fromQuest: false },
    "biglaunch": { fromQuest: false }, // launch 20(?) crops in one turn
    "madeForMe": { fromQuest: false }, // TODO: get to fifth level of the endless cave
    "soybeat": { fromQuest: false }, // beat the soy monster
    "fullUpgrade": { fromQuest: false }, // get the biggest upgrade to your field
    "allCrop": { fromQuest: false }, // use every crop at least once
    "overkill": { fromQuest: false }, // waste a rare item on a non-boss enemy
    "murderedToDeath": { fromQuest: false } // get killed by Mr. Bruno or The Monster (how get this to save?)
};
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
    if(md.typesPlanted["tech"] === 0) { AddAchievementIfMissing("luddite"); }
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
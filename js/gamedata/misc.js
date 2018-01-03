function Range(min, max) { return min + Math.floor(Math.random() * (max - min)); }
function InclusiveRange(min, max) { return min + Math.round(Math.random() * (max - min)); }
function RoundNear(x, num) { return Math.round(x * num) / num; }
var miscText = {
    "skill_season0": "Seasons\n Seasons are determined entirely by opponents.",
    "skill_season10": "Normalizer\n All available seasons are equally likely to appear.\n \n Requires Seasons.",
    "skill_season11": "Normalizer 2\n At least 3 seasons are all equally likely to appear.\n \n Requires Normalizer.",
    "skill_season12": "Normalizer 3\n All four seasons are always equally likely to appear.\n \n Requires Normalizer 2.",
    "skill_season20": "Picker\n Make any one season 5% more likely to be picked.\n \n Requires Seasons.",
    "skill_season21": "Picker 2\n Make any one season 10% more likely to be picked.\n \n Requires Picker.",
    "skill_season22": "Picker 3\n Make any one season 15% more likely to be picked.\n \n Requires Picker 2.",
    "skill_Sspring0": "Spring\n Allows Spring crops to be planted.",
    "skill_Sspring1": "Spring 2\n Makes Spring crops 35% more powerful.\n \n Requires Spring.",
    "skill_Ssummer0": "Summer\n Allows Summer crops to be planted.",
    "skill_Ssummer1": "Summer 2\n Makes Summer crops 35% more powerful.\n \n Requires Summer.",
    "skill_Sautumn0": "Autumn\n Allows Autumn crops to be planted.",
    "skill_Sautumn1": "Autumn 2\n Makes Autumn crops 35% more powerful.\n \n Requires Autumn.",
    "skill_Swinter0": "Winter\n Allows Winter crops to be planted.",
    "skill_Swinter1": "Winter 2\n Makes Winter crops 35% more powerful.\n \n Requires Winter."
};
var inns = {
    "start": { x: 21, y: 5.25, map: "farm" },
    "inn1": { x : 16, y: 5, map: "firstvillage" },
    "mermaidinn": { x : 21, y: 11, map: "bridge" },
    "fakefarm": { x: 17, y: 5.5, map: "fakefarm" }
};
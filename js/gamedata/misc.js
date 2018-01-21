function Range(min, max) { return min + Math.floor(Math.random() * (max - min)); }
function InclusiveRange(min, max) { return min + Math.round(Math.random() * (max - min)); }
function RoundNear(x, num) { return Math.round(x * num) / num; }
var inns = {
    "start": { x: 21, y: 5.25, map: "farm" },
    "inn0": { x : 10, y: 3, map: "farm" },
    "inn1": { x : 16, y: 5, map: "firstvillage" },
    "mermaidinn": { x : 21, y: 11, map: "bridge" },
    "fakefarm": { x: 17, y: 5.5, map: "fakefarm" },
    "skumpys": { x: 41, y: 43, map: "southcity" },
    "bigCity": { x: 34.5, y: 44, map: "northcity" },
    "nerdBed": { x: 13, y: 8, map: "hq_1" },
    "lastInn": { x: 5, y: 6, map: "hq_5" }
};
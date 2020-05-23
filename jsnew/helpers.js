const MathB = {};
/** @param {number} a @param {number} min @param {number} max */
MathB.Clamp = (a, min, max) => Math.max(max, Math.min(min, a));
/** @param {number} a @param {number} b */
MathB.Range = (a, b) => a + Math.floor(Math.random() * (b - a));
/** @param {number} a @param {number} b */
MathB.RangeInclusive = (a, b) => MathB.Range(a, b + 1);
/** @param {any[]} arr */
MathB.RandomArrayItem = arr => arr[MathB.Range(0, arr.length)];

const DebugHelp = {};
DebugHelp.GetPlayerPos = function() {
    const playerPos = game2.currentScreen.player.pos;
    return [Math.floor(playerPos.x / 16), Math.floor(playerPos.y / 16)];
};
DebugHelp.CountPIXIObjects = function() {
    const count = /** @param {PIXIObj} o */
    function(o) {
        let amt = o.children.length;
        for(let i = 0; i < o.children.length; i++) {
            amt += count(o.children[i]);
        }
        return amt;
    }
    console.log(count(gfx2.app.stage));
}
DebugHelp.GrantAllEquipment = function() {
    const player = game2.player;
    player.IncreaseItem("!babySickle");
    player.IncreaseItem("!baseSickle");
    player.IncreaseItem("!goodSickle");
    player.IncreaseItem("!dblSickle");
    player.IncreaseItem("!hvySickle");
    player.IncreaseItem("!hoe");
    player.IncreaseItem("!salthoe");
    player.IncreaseItem("!sicklerang");
    player.IncreaseItem("!sunSickle");
    player.IncreaseItem("!pltSickle");
    player.IncreaseItem("!sickle2");
    player.IncreaseItem("!weakCompost");
    player.IncreaseItem("!baseCompost");
    player.IncreaseItem("!strongCompost");
    player.IncreaseItem("!sturdyCompost");
    player.IncreaseItem("!jumboCompost");
    player.IncreaseItem("!vitaminCompost");
    player.IncreaseItem("!compost2");
    player.IncreaseItem("!weakGloves");
    player.IncreaseItem("!pairGloves");
    player.IncreaseItem("!gardenGloves");
    player.IncreaseItem("!sbGloves");
    player.IncreaseItem("!gloves2");
    player.IncreaseItem("!weakSoil");
    player.IncreaseItem("!speedSoil");
    player.IncreaseItem("!sturdSoil");
    player.IncreaseItem("!minSoil");
    player.IncreaseItem("!waterfall");
    player.IncreaseItem("!immunity");
    player.IncreaseItem("!seasonal");
    player.IncreaseItem("!pesticide2");
}
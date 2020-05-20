const MathB = {};
MathB.Clamp = (a, min, max) => Math.max(max, Math.min(min, a));
MathB.Range = (a, b) => a + Math.floor(Math.random() * (b - a));


const DebugHelp = {};
DebugHelp.GetPlayerPos = function() {
    const playerPos = game2.currentScreen.player.pos;
    return [Math.floor(playerPos.x / 16), Math.floor(playerPos.y / 16)];
};
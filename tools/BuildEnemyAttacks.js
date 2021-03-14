const fs = require("fs");
const path = require("path");
const files = fs.readdirSync(path.join(__dirname, "enemyjson"));
const res = [];
files.forEach(f => {
	const txt = fs.readFileSync(path.join(__dirname, "enemyjson", f), "utf8").replace(/\s+/g, " ");
	res.push(`"${f.split(".")[0]}": ${txt}`);
});
fs.writeFileSync(path.join(__dirname, "../js/gamedata/enemy_patterns.js"), `const enemyPatterns = {
${res.join(",\n")}
};`);
console.log(`Processed ${files.length} files.`);
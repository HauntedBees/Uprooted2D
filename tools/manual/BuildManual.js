const path = require("path");
const fs = require("fs");
const text = require("./parts/text");
const veggies = require("./parts/veggies");
const sprites = require("./parts/spritedata");

const range = i => [...Array(i).keys()];
const GetText = key => text[key] ? text[key]["en-us"] : false;
const SpriteAttrs = (key, addtlClass) => {
	const spriteData = sprites[key];
	const big = spriteData[2] === true;
	const cssclass = (big ? "spriteb" : "sprite") + (addtlClass ? ` ${addtlClass}` : "");
	const size = big ? 32 : 16;
	const sx = spriteData[0], sy = spriteData[1];
	const startX = sx * size + sx * 2 + 1;
	const startY = sy * size + sy * 2 + 1;
	return `class="${cssclass}" style="background-position: -${4 * startX}px -${4 * startY}px"`;
};
function VeggieCard(v) {
	if(!GetText(v.Id) || v.Id === "specialgrapes") { return ""; }
	let vegType, growthSprites = [];
	switch(v.Type) {
		case "veg": vegType = "Vegetable"; break;
		case "tree": vegType = "Tree"; break;
		case "bee": vegType = "Bees"; break;
		case "rice": vegType = "Paddy Crop"; break;
		case "spear":
		case "rod": 
		case "water": vegType = "Fishing Equipment"; break;
		case "food": vegType = "Animal Feed"; break;
		case "mush": vegType = "Mushroom"; break;
		case "egg": vegType = "Egg"; break;
		case "tech": 
		case "sickle2": vegType = "Technology"; break;
		case "moist": vegType = "Water"; break;
	}
	if(v.Type !== "tree" && vegType !== "Fishing Equipment" && v.Type !== "food" && v.Type !== "moist") {
		growthSprites = range(parseInt(v.AnimFrames)).map(i => `<div ${SpriteAttrs(v.Id + i, "sprite--small")}></div>`);
	}
	const size = `${v.Size}x${v.Size}`;
	return `
<div class="col-6 col-md-4 d-flex align-items-stretch mb-2 px-1">
	<div class="card full-width">
		<div class="card-img-top row">
			<div class="col-4">
				<div ${SpriteAttrs(v.Id)}></div>
			</div>
			<div class="col-8">
				${growthSprites.join("")}
			</div>
		</div>
		<div class="card-body">
			<h5 class="card-title">${GetText("nm." + v.Id)}</h5>
			<h6 class="card-subtitle mb-2 text-muted">${size} ${vegType}</h6>
			<p class="card-text">${GetText(v.Id)}</p>
		</div>
	</div>
</div>`
};


const outpath = path.join(__dirname, "out");
if(!fs.existsSync(outpath)) { fs.mkdirSync(outpath); }

const template = fs.readFileSync(path.join(__dirname, "parts/template.html"), "utf8");
const output = template.replace("{@crops}", veggies.map(v => VeggieCard(v)).join("\n"));
fs.writeFileSync(path.join(outpath, "manual.html"), output);

const assetpath = path.join(outpath, "assets");
if(!fs.existsSync(assetpath)) { fs.mkdirSync(assetpath); }
const CopyFile = filename => fs.copyFileSync(path.join(__dirname, "../../img/", filename), path.join(assetpath, filename));
CopyFile("sheet.png");
CopyFile("sheetBig.png");
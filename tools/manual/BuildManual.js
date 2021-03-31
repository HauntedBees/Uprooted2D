const path = require("path");
const fs = require("fs");
const text = require("./parts/text");
const veggies = require("./parts/veggies");
const shops = require("./parts/shops");
const spritedata = require("./parts/spritedata");
const enemies = require("./parts/enemies");

const range = i => [...Array(i).keys()];
const GetText = key => text[key] ? text[key]["en-us"].replace(/(\\n\s?)+/g, "<br><br>") : false;
const Badge = (text, type) => `<span class="badge bg-${type || "primary"}">${text}</span> `;

//#region Veggies
const locations = ["farm", "producestand", "forest", "firstvillage", "belowvillage", "researchfacility", "molehome", "bridge", 
	"underwater", "fakefarm", "southcity", "northcity", "northcity_NG", "northcity_IG", "northcity_NB", "northcity_IB", "hq_1",
	"hq_IG", "hq_NB", "hq_NB_side", "hq_IB", "hq_2", "hq_3", "hq_4", "hq_5"];
const LocBadges = {};
locations.forEach(l => LocBadges[l] = Badge(GetText("map." + l)));

const ShopNames = {
	"coop": LocBadges["farm"] + "Henrietta's Chicken Coop",
	"inn0": LocBadges["farm"] + "Your Home",
	"equip1": LocBadges["firstvillage"] + "Velthur's Hoes and Sickles",
	"upgrade1": LocBadges["firstvillage"] + "Andrew's Farm Expansions",
	"fixture1": LocBadges["firstvillage"] + "Chuck's Fixtures",
	"seed1": LocBadges["firstvillage"] + "Seedy Pete's Questionable Seeds",
	"inn1": LocBadges["firstvillage"] + "Rosa's Inn",
	"mermaid": LocBadges["bridge"] + "Mermaid Shoppe",
	"mermaidinn": LocBadges["bridge"] + "Mermaid Inn",
	"cworker": LocBadges["bridge"] + "Lazy Construction Worker Shoppe",
	"upgrade2": LocBadges["fakefarm"] + "The Good Times Barn For Dirt Rearranging Activities and Farm Expansions",
	"fixture2": LocBadges["fakefarm"] + "Regular Pig Shop",
	"skumpys": LocBadges["southcity"] + "Skumpy's",
	"mantools": LocBadges["southcity"] + "Man Tools",
	"seedshack": LocBadges["southcity"] + "Seed Shack",
	"catalinas": LocBadges["southcity"] + "Catalina's Fixtures",
	"tinker": LocBadges["southcity"] + "Tinker Tierra",
	"pawn": LocBadges["southcity"] + "Las Abejas Pawn Shop",
	"church": LocBadges["southcity"] + "Church of Saint Ambrose",
	"cityFixtures": LocBadges["northcity"] + "Fixtures",
	"cityInn": LocBadges["northcity"] + "Hotel Las Abejas",
	"gordonsFarming": LocBadges["northcity"] + "Gordon's Farming",
	"cityTech": LocBadges["northcity"] + "Tech Supplies",
	"cityExpansions": LocBadges["northcity"] + "Farm Expansions",
	"vendo_veg": LocBadges["hq_4"] + "Vending Machine",
	"vendo_tree": LocBadges["hq_4"] + "Vending Machine",
	"vendo_mush": LocBadges["hq_4"] + "Vending Machine",
	"vendo_paddy": LocBadges["hq_4"] + "Vending Machine",
	"vendo_coop": LocBadges["hq_4"] + "Vending Machine",
	"vendo_water": LocBadges["hq_4"] + "Vending Machine",
	"vendo_tech": LocBadges["hq_4"] + "Vending Machine",
	"lastInn": LocBadges["hq_5"] + "HQ Inn",
	"gordonsFarming3": LocBadges["northcity"] + "Gordon's Farming+",
	"workerscoop": LocBadges["northcity"] + "Worker's Co-op"
};
const CachedVSprites = {};
const VSprite = (key, addtlClass, tooltip) => {
	const cacheKey = key + "/" + addtlClass + "/" + tooltip;
	if(CachedVSprites[cacheKey]) { return CachedVSprites[cacheKey]; }
	const spriteData = spritedata[key];
	if(!spriteData) { return ""; }
	const big = spriteData[2] === true;
	const cssclass = (big ? "spriteb" : "sprite") + (addtlClass ? ` ${addtlClass}` : "");
	const size = big ? 32 : 16;
	const sx = spriteData[0], sy = spriteData[1];
	const startX = sx * size + sx * 2 + 1;
	const startY = sy * size + sy * 2 + 1;
	const attrs = tooltip ? ` data-bs-toggle="tooltip" data-bs-placement="bottom" title="${tooltip}"` : "";
	const html = `<div class="${cssclass}"${attrs}><div class="inner" style="background-position: -${4 * startX}px -${4 * startY}px"></div></div>`;
	CachedVSprites[cacheKey] = html;
	return html;
};
const Log = VSprite("_log", "sprite--small"), Coop = VSprite("_coop", "sprite--small"), Hive = VSprite("_beehive", "sprite--small");
const PowerIco = VSprite("inv_power", "sprite--tiny pt-1");
const TimeIco = VSprite("inv_time", "sprite--tiny pt-1");
const RegrowIco = VSprite("inv_regrow", "sprite--tiny pt-1");
const Seasons = {};
for(let i = 0; i < 3; i++) {
	let quality;
	switch(i) {
		case 0: quality = "Poorly"; break;
		case 1: quality = "Fine"; break;
		case 2: quality = "Great"; break;
	}
	Seasons["0" + i] = VSprite("spring" + i, "sprite--tiny pt-1", `Grows ${quality} in Spring`);
	Seasons["1" + i] = VSprite("summer" + i, "sprite--tiny pt-1", `Grows ${quality} in Summer`);
	Seasons["2" + i] = VSprite("autumn" + i, "sprite--tiny pt-1", `Grows ${quality} in Autumn`);
	Seasons["3" + i] = VSprite("winter" + i, "sprite--tiny pt-1", `Grows ${quality} in Winter`);
}

const PairSprite = (array, back, big) => array.map(s => `<div class="${(big ? "spriteb-pair" : "sprite-pair")}">${back}${s}</div>`)
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
	if(v.Type !== "tree" && v.Type !== "spear" && v.Type !== "food" && v.Type !== "moist") {
		growthSprites = range(parseInt(v.AnimFrames)).map(i => VSprite(v.Id + i, "sprite--small"));
		switch(v.Type) {
			case "mush": growthSprites = PairSprite(growthSprites, Log); break;
			case "egg": growthSprites = PairSprite(growthSprites, Coop); break;
			case "bee": growthSprites = PairSprite(growthSprites, Hive); break;
		}
	} else if(v.Type === "food") {
		growthSprites = [VSprite("cow", "sprite--small"), VSprite("cowready", "sprite--small")];
	} else if(v.Type === "tree") {
		const tree = v.AltTree || "tree";
		const fruits = [VSprite(v.Id + "0", "sprite--small"), VSprite(v.Id + "1", "sprite--small")];
		growthSprites = [VSprite(tree + "0", "sprite--small"), VSprite(tree + "1", "sprite--small"), ...PairSprite(fruits, VSprite(tree + "2", "sprite--small"), true)]
	}
	const size = `${v.Size}x${v.Size}`;
	const time = (v.Time < 0 || v.Time > 100) ? "Random" : v.Time;
	const regrowColumn = v.Re ? `<div class="col"><strong>${[RegrowIco]} Regrow:</strong> ${v.Re}</div>` : "";

	const additional = [];
	if(v.WaterR) { additional.push(VSprite("waterIco" + v.WaterR, "sprite--small", "Flood Resistant")); }
	if(v.FireR) { additional.push(VSprite("fireIco" + v.FireR, "sprite--small", "Fire Resistant")); }
	if(v.SaltR) { additional.push(VSprite("saltIco" + v.SaltR, "sprite--small", "Salt Resistant")); }
	if(v.SaltClean) { additional.push(VSprite("saltIcoX", "sprite--small", "Absorbs Salt")); }
	if(v.Stick) { additional.push(VSprite("stunIco" + v.Stick, "sprite--small", "Can Stun Enemies")); }
	if(v.Animal) { additional.push(VSprite(v.Animal === "Bear" ? "BearIco" : ("animal" + v.Animal + "0"), "sprite--small", "Can Summon Animals")); }

	const shopsFoundAt = [];
	for(const key in shops) {
		if(!ShopNames[key]) { continue; }
		const wares = shops[key].wares;
		if(wares.some(w => w.product === v.Id)) {
			shopsFoundAt.push(`<div>${ShopNames[key]}</div>`);
		}
	}
	if(shopsFoundAt.length === 0) { shopsFoundAt.push(`<div class="text-center">No shops sell this</div>`); }

	const enemiesSet = new Set();
	enemies.forEach(e => {
		for(let i = 0; i < 2; i++) {
			const drop = e["drop" + i].split(",")[0];
			if(drop === v.Id) {
				let name;
				switch(e.Id) {
					case "nathan": name = "Final Boss"; break;
					case "Worker": name = "Construction Worker"; break;
					case "BossWorker": name = "Construction Manager"; break;
					case "mobsty1": name = "Mobster"; break;
					case "mobsty2": name = "Buff Mobster"; break;
					case "negayana": name = "Mysterious Enemy"; break;
					default: name = GetText("e." + e.Id + "0"); break;
				}
				if(name) { enemiesSet.add(`<div>${name}</div>`); }
			}
		}
	});
	const enemiesDropped = [...enemiesSet];
	if(enemiesDropped.length === 0) { enemiesDropped.push(`<div class="text-center">No enemies drop this</div>`); }

	return `
<div class="col-6 col-md-4 d-flex align-items-stretch mb-2 px-1">
	<div class="card text-white bg-secondary full-width">
		<div class="card-img-top row text-center mt-2">
			<div class="col">${VSprite(v.Id + "seed")} ${VSprite(v.Id)}</div>
			${growthSprites.length ? `<div class="col align-self-center">${growthSprites.join("")}</div>` : ""}
		</div>
		<div class="card-body">
			<h5 class="card-title text-center">${GetText("nm." + v.Id)}</h5>
			<h6 class="card-subtitle mb-2 text-light text-center">${size} ${vegType}</h6>
			<p class="card-text">${GetText(v.Id)}</p>
			<div class="row text-center">
				<div class="col"><strong>${[PowerIco]} Power:</strong> ${v.Power}</div>
				<div class="col"><strong>${[TimeIco]} Time:</strong> ${time}</div>
				${regrowColumn}
			</div>
			<div class="row text-center">
				<div class="col"><strong>Seasons:</strong>
					${Seasons["0"+(v.Sp||"0")]}
					${Seasons["1"+(v.Su||"0")]}
					${Seasons["2"+(v.Au||"0")]}
					${Seasons["3"+(v.Wi||"0")]}
				</div>
				<div class="col"><strong>Price:</strong> ${v.Price}G</div>
			</div>
			<div class="row text-center">
				<div class="col">
					${additional.join("") || "&nbsp;"}
				</div>
			</div>
			<div class="row text-center">
				<div class="col">
					<h6>Shops</h6>
					<div class="shop-block">
						${shopsFoundAt.join("")}
					</div>
				</div>
				<div class="col">
					<h6>Drops</h6>
					<div class="enemy-block">
						${enemiesDropped.join("")}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>`
};
//#endregion


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
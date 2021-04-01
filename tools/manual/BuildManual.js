const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const imagemin = require("imagemin");
const imageminPngquant = require("imagemin-pngquant");

const text = require("./parts/text");
const spritedata = require("./parts/spritedata");
const shops = require("./parts/shops");
const veggies = require("./parts/veggies");
const enemies = require("./parts/enemies");
const equipment = require("./parts/equipment");
const fixtures = require("./parts/fixtures");

const veggiesObj = {}, equipObj = {}, fixObj = {};
veggies.forEach(v => { veggiesObj[v.Id] = v });
equipment.forEach(v => { equipObj[v.Id] = v });
fixtures.forEach(v => { fixObj[v.Id] = v });

const copyMaps = process.argv[2] === "maps";

const outpath = path.join(__dirname, "out");
if(!fs.existsSync(outpath)) { fs.mkdirSync(outpath); }
const assetpath = path.join(outpath, "assets");

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
	"coop": "Henrietta's Chicken Coop",
	"inn0": "Your Home",
	"equip1": "Velthur's Hoes and Sickles",
	"upgrade1": "Andrew's Farm Expansions",
	"fixture1": "Chuck's Fixtures",
	"seed1": "Seedy Pete's Questionable Seeds",
	"inn1": "Rosa's Inn",
	"mermaid": "Mermaid Shoppe",
	"mermaidinn": "Mermaid Inn",
	"cworker": "Lazy Construction Worker Shoppe",
	"upgrade2": "The Good Times Barn For Dirt Rearranging Activities and Farm Expansions",
	"fixture2": "Regular Pig Shop",
	"skumpys": "Skumpy's",
	"mantools": "Man Tools",
	"seedshack": "Seed Shack",
	"catalinas": "Catalina's Fixtures",
	"tinker": "Tinker Tierra",
	"pawn": "Las Abejas Pawn Shop",
	"church": "Church of Saint Ambrose",
	"cityFixtures": "Fixtures",
	"cityInn": "Hotel Las Abejas",
	"gordonsFarming": "Gordon's Farming",
	"cityTech": "Tech Supplies",
	"cityExpansions": "Farm Expansions",
	"vendo_veg": "Vending Machine",
	"vendo_tree": "Vending Machine",
	"vendo_mush": "Vending Machine",
	"vendo_paddy": "Vending Machine",
	"vendo_coop": "Vending Machine",
	"vendo_water": "Vending Machine",
	"vendo_tech": "Vending Machine",
	"lastInn": "HQ Inn",
	"gordonsFarming3": "Gordon's Farming+",
	"workerscoop": "Worker's Co-op"
};
const LabeledShopNames = {
	"coop": LocBadges["farm"] + ShopNames["coop"],
	"inn0": LocBadges["farm"] + ShopNames["inn0"],
	"equip1": LocBadges["firstvillage"] + ShopNames["equip1"],
	"upgrade1": LocBadges["firstvillage"] + ShopNames["upgrade1"],
	"fixture1": LocBadges["firstvillage"] + ShopNames["fixture1"],
	"seed1": LocBadges["firstvillage"] + ShopNames["seed1"],
	"inn1": LocBadges["firstvillage"] + ShopNames["inn1"],
	"mermaid": LocBadges["bridge"] + ShopNames["mermaid"],
	"mermaidinn": LocBadges["bridge"] + ShopNames["mermaidinn"],
	"cworker": LocBadges["bridge"] + ShopNames["cworker"],
	"upgrade2": LocBadges["fakefarm"] + ShopNames["upgrade2"],
	"fixture2": LocBadges["fakefarm"] + ShopNames["fixture2"],
	"skumpys": LocBadges["southcity"] + ShopNames["skumpys"],
	"mantools": LocBadges["southcity"] + ShopNames["mantools"],
	"seedshack": LocBadges["southcity"] + ShopNames["seedshack"],
	"catalinas": LocBadges["southcity"] + ShopNames["catalinas"],
	"tinker": LocBadges["southcity"] + ShopNames["tinker"],
	"pawn": LocBadges["southcity"] + ShopNames["pawn"],
	"church": LocBadges["southcity"] + ShopNames["church"],
	"cityFixtures": LocBadges["northcity"] + ShopNames["cityFixtures"],
	"cityInn": LocBadges["northcity"] + ShopNames["cityInn"],
	"gordonsFarming": LocBadges["northcity"] + ShopNames["gordonsFarming"],
	"cityTech": LocBadges["northcity"] + ShopNames["cityTech"],
	"cityExpansions": LocBadges["northcity"] + ShopNames["cityExpansions"],
	"vendo_veg": LocBadges["hq_4"] + ShopNames["vendo_veg"],
	"vendo_tree": LocBadges["hq_4"] + ShopNames["vendo_tree"],
	"vendo_mush": LocBadges["hq_4"] + ShopNames["vendo_mush"],
	"vendo_paddy": LocBadges["hq_4"] + ShopNames["vendo_paddy"],
	"vendo_coop": LocBadges["hq_4"] + ShopNames["vendo_coop"],
	"vendo_water": LocBadges["hq_4"] + ShopNames["vendo_water"],
	"vendo_tech": LocBadges["hq_4"] + ShopNames["vendo_tech"],
	"lastInn": LocBadges["hq_5"] + ShopNames["lastInn"],
	"gordonsFarming3": LocBadges["northcity"] + ShopNames["gordonsFarming3"],
	"workerscoop": LocBadges["northcity"] + ShopNames["workerscoop"]
};
const CachedVSprites = {};
const VSprite = (key, addtlClass, tooltip, link) => {
	const cacheKey = key + "/" + addtlClass + "/" + tooltip + "/" + link;
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
	const innerType = link ? "a" : "div";
	const addtlAttr = link ? ` href="#ref_${link}"` : "";
	const html = `<div class="${cssclass}"${attrs}><${innerType} class="inner"${addtlAttr} style="background-position: -${4 * startX}px -${4 * startY}px"></${innerType}></div>`;
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
	if(i === 2) {
		Seasons["x0" + i] = VSprite("spring" + i, "sprite--tiny pt-1");
		Seasons["x1" + i] = VSprite("summer" + i, "sprite--tiny pt-1");
		Seasons["x2" + i] = VSprite("autumn" + i, "sprite--tiny pt-1");
		Seasons["x3" + i] = VSprite("winter" + i, "sprite--tiny pt-1");
	} else if(i === 0) {
		Seasons["x0" + i] = "";
		Seasons["x1" + i] = "";
		Seasons["x2" + i] = "";
		Seasons["x3" + i] = "";
	}
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
		if(!LabeledShopNames[key]) { continue; }
		const wares = shops[key].wares;
		if(wares.some(w => w.product === v.Id)) {
			shopsFoundAt.push(`<div>${LabeledShopNames[key]}</div>`);
		}
	}
	if(shopsFoundAt.length === 0) { shopsFoundAt.push(`<div class="text-center">No shops sell this</div>`); }

	const enemiesSet = new Set();
	enemies.forEach(e => {
		let skip = false, name;
		switch(e.Id) {
			case "nathan": name = "Final Boss"; break;
			case "Worker": name = "Construction Worker"; break;
			case "BossWorker": name = "Construction Manager"; break;
			case "mobsty1": name = "Mobster"; break;
			case "mobsty2": name = "Buff Mobster"; break;
			case "negayana": name = "Mysterious Enemy"; break;
			case "seaMan": name = "Sea Monster"; break;
			case "kida": name = "Skunk"; break;
			case "beeQueenA":
			case "beeQueenB":
			case "beeQueenC": 
			case "kidb": 
			case "kidc": 
			case "kidd": skip = true; break;
			default: name = GetText("e." + e.Id + "0"); break;
		}
		if(name && !skip) {
			for(let i = 0; i < 2; i++) {
				const drop = e["drop" + i].split(",")[0];
				if(drop === v.Id) {
					enemiesSet.add(`<div><a class="reflink" href="#ref_${e.Id}">${name}</a></div>`);
				}
			}
		}
	});
	const enemiesDropped = [...enemiesSet];
	if(enemiesDropped.length === 0) { enemiesDropped.push(`<div class="text-center">No enemies drop this</div>`); }

	return `
<div class="col-6 col-md-4 d-flex align-items-stretch mb-2 px-1">
	<div class="card text-white bg-secondary full-width">
		<a name="ref_${v.Id}" class="ref"></a>
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
</div>`;
};
//#endregion
//#region Equipment
function EquipmentCard(e) {
	if(e.Id === "nope" || e.Id === "!sickle2_weak") { return ""; }

	const shopsFoundAt = [];
	for(const key in shops) {
		if(!LabeledShopNames[key]) { continue; }
		const wares = shops[key].wares;
		if(wares.some(w => w.product === e.Id)) {
			shopsFoundAt.push(`<div>${LabeledShopNames[key]}</div>`);
		}
	}
	if(shopsFoundAt.length === 0) { shopsFoundAt.push(`<div class="text-center">No shops sell this</div>`); }

	const cardbase = `
<div class="col-6 col-md-4 d-flex align-items-stretch mb-2 px-1">
	<div class="card text-white bg-secondary full-width">
		<a name="ref_${e.Id}" class="ref"></a>
		<div class="card-img-top text-center mt-2">
			${VSprite(e.Id)}
		</div>
		<div class="card-body">
			<h5 class="card-title text-center">${GetText(e.Id)}</h5>
			{@rest}
			<div class="row text-center mt-1">
				<div class="col">
					<h6>Sold at</h6>
					<div class="shop-block" style="display:inline-block">
						${shopsFoundAt.join("")}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>`;
	let content;
	if(e.Type === "weapon") {
		let target, other;
		if(e.Num === "999") {
			target = "All Enemies";
		} else {
			if(!e.Num) {
				target = "One " + (e.Foes && e.Crop ? "Enemy or Crop" : (e.Foes ? "Enemy" : "Crop"));
			} else {
				target = e.Num + " " + (e.Foes && e.Crop ? "Enemies and Crops" : (e.Foes ? "Enemies" : "Crops"));
			}
		}
		if(e.SP) { other = "Stronger in Spring and Summer"; }
		if(e.WI) { other = "Stronger in Winter"; }
		if(e.Id === "!sickle2") { other = "Requires a Sickle2 Charger"; }
		const otherHTML = other ? `<div class="col">${other}</div>` : "";
		content = `
		<div class="row text-center">
			<div class="col">
				<strong>Power: </strong> ${e.Pow}
			</div>
			<div class="col">
				<strong>Can Target: </strong> ${target}
			</div>
		</div>
		<div class="row text-center">
			<div class="col">
				<strong>Cost: </strong> ${parseInt(e.Price).toLocaleString()}G
			</div>
			${otherHTML}
		</div>`;
	} else if(e.Type === "compost") {
		let other = [];
		if(e.Atk) { other.push("Can Attack with Compost"); }
		if(e.Bns) { other.push(`${e.Bns * 100}% Bonus`); }
		if(e.Tech) { other.push("May Backfire"); }
		const otherHTML = other.length ? `<div class="col">${other.join(", ")}</div>` : "";
		content = `
		<div class="row text-center">
			<div class="col">
				<strong>Storage Amount: </strong> ${e.Amt}
			</div>
			<div class="col">
				<strong>Can Compost: </strong> ${e.Rot ? "Dead Crops Only" : "All Crops"}
			</div>
		</div>
		<div class="row text-center">
			<div class="col">
				<strong>Cost: </strong> ${parseInt(e.Price).toLocaleString()}G
			</div>
			${otherHTML}
		</div>`;
	} else if(e.Type === "gloves") {
		let other = [];
		if(e.Atk) { other.push("Can Attack/Compost after Planting"); }
		if(e.Tech) { other.push("May shock plants and tech when planted. Will shock you when touching water."); }
		const otherHTML = other.length ? `<div class="col">${other.join(", ")}</div>` : "";
		content = `
		<div class="row text-center">
			<div class="col">
				<strong>Seeds Per Turn: </strong> ${e.Amt}
			</div>
			<div class="col">
				<strong>Damage Resist: </strong> ${e.Def * 100}%
			</div>
		</div>
		<div class="row text-center">
			<div class="col">
				<strong>Cost: </strong> ${parseInt(e.Price).toLocaleString()}G
			</div>
			${otherHTML}
		</div>`;
	} else if(e.Type === "soil") {
		let other = "";
		if(e.Tech) { other = "Will kill crops that are too weak or grow too quickly. Bees with fly away."; }
		const otherHTML = other ? `<div class="row mb-1"><div class="col">${other}</div></div>` : "";
		content = `
		<div class="row text-center">
			<div class="col">
				<strong>Growth Speed Boost: </strong> ${(e.Spd || 0) * 100}%
			</div>
			<div class="col">
				<strong>Seasonal Resistance: </strong> ${(e.Bst || 0) * 100}%
			</div>
		</div>
		<div class="row text-center">
			<div class="col">
				<strong>Seasonal Multiplier: </strong> ${(e.Amp || 0) * 100}%
			</div>
			<div class="col">
				<strong>Cost: </strong> ${parseInt(e.Price).toLocaleString()}G
			</div>
		</div>
		${otherHTML}`;
	}
	return cardbase.replace("{@rest}", content);
}
//#endregion
//#region Fixtures
function FixtureCard(f) {
	const shopsFoundAt = [];
	for(const key in shops) {
		if(!LabeledShopNames[key]) { continue; }
		const wares = shops[key].wares;
		if(wares.some(w => w.product === f.Id)) {
			shopsFoundAt.push(`<div>${LabeledShopNames[key]}</div>`);
		}
	}
	if(shopsFoundAt.length === 0) { shopsFoundAt.push(`<div class="text-center">No shops sell this</div>`); }

	let size = 1, useWiths = [];
	switch(f.Id) {
		case "_sprinkler": 
		case "_strongsoil":
			useWiths = veggies.filter(v => (v.Type === "tree" || v.Type === "veg")).map(v => VSprite(v.Id, "sprite--tiny", GetText("nm." + v.Id), v.Id)); break;
		case "_shooter": useWiths = veggies.filter(v => ["veg", "mush", "rice"].indexOf(v.Type) >= 0).map(v => VSprite(v.Id, "sprite--tiny", GetText("nm." + v.Id), v.Id)); break;
		case "_log": useWiths = veggies.filter(v => v.Type === "mush").map(v => VSprite(v.Id, "sprite--tiny", GetText("nm." + v.Id), v.Id)); break;
		case "_coop": useWiths = veggies.filter(v => v.Type === "egg").map(v => VSprite(v.Id, "sprite--tiny", GetText("nm." + v.Id), v.Id)); break;
		case "_lake": useWiths = veggies.filter(v => ["water", "rod", "spear"].indexOf(v.Type) >= 0).map(v => VSprite(v.Id, "sprite--tiny", GetText("nm." + v.Id), v.Id)); break;
		case "_paddy": useWiths = veggies.filter(v => v.Type === "rice").map(v => VSprite(v.Id, "sprite--tiny", GetText("nm." + v.Id), v.Id)); break;
		case "_beehive": useWiths = veggies.filter(v => v.Type === "bee").map(v => VSprite(v.Id, "sprite--tiny", GetText("nm." + v.Id), v.Id)); break;
		case "_hotspot": size = 2; useWiths = veggies.filter(v => v.Type === "tech").map(v => VSprite(v.Id, "sprite--tiny", GetText("nm." + v.Id), v.Id)); break;
		case "_cow": size = 2; useWiths = veggies.filter(v => v.Type === "food").map(v => VSprite(v.Id, "sprite--tiny", GetText("nm." + v.Id), v.Id)); break;
		case "_charger": size = 2; useWiths = veggies.filter(v => v.Type === "sickle2").map(v => VSprite(v.Id, "sprite--tiny", GetText("nm." + v.Id), v.Id)); break;
		case "_modulator": size = 2; useWiths = veggies.filter(v => v.Type === "veg").map(v => VSprite(v.Id, "sprite--tiny", GetText("nm." + v.Id), v.Id)); break;
	}
	const useWithHTML = useWiths.length ? `
	<div class="col">
		<h6>Use With</h6>
		<div class="shop-block" style="display:inline-block">
			${useWiths.join("")}
		</div>
	</div>` : "";

	return `
<div class="col-6 col-md-4 d-flex align-items-stretch mb-2 px-1">
	<div class="card text-white bg-secondary full-width">
		<a name="ref_${f.Id}" class="ref"></a>
		<div class="card-img-top text-center mt-2">
			${VSprite(f.Id)}
		</div>
		<div class="card-body">
			<h5 class="card-title text-center">${GetText(f.Id.substring(1))}</h5>
			<div class="row text-center">
				<div class="col">
					<strong>Size: </strong>${size}x${size}
				</div>
				<div class="col">
					<strong>Price: </strong>${parseInt(f.Price).toLocaleString()}G
				</div>
			</div>
			<div class="row">
				<div class="col">
					${GetText(f.Id.substring(1) + ".ldesc")}
				</div>
			</div>
			<div class="row text-center mt-1">
				${useWithHTML}
				<div class="col">
					<h6>Sold at</h6>
					<div class="shop-block" style="display:inline-block">
						${shopsFoundAt.join("")}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>`;
}
//#endregion
//#region Enemies
const skipEnemies = ["machineA", "machineB", "machineC", "machineD", "yourWorstFuckingNightmare"];
const spoilerEnemies = ["housekeeper", "mrbruno", "mobsty1", "mobsty2", "mobBoss", "dweebLord", "discuss2", "discuss2big", "theMonster", "soyChild", "soyStack", 
						"beckett", "nathan", "beeQueenA", "beeQueenB", "beeQueenC", "seaMobster", "soyChildCave", "shinyBear", "mrWallFriend", "caveNerd", "graveRobber", 
						"negayana", "garfwax", "trustworthyfriend", "doodoobirdhaha", "golf", "conqueredscarecrow", "fishingsnake"];
function EnemyCard(e) {
	let name, size, dx, dy;
	if(skipEnemies.indexOf(e.Id) >= 0) { return ""; }
	switch(e.Id) {
		case "Worker": name = "Construction Worker"; break;
		case "BossWorker": name = "Construction Manager"; break;
		case "mobsty1": name = "Mobster"; break;
		case "mobsty2": name = "Buff Mobster"; break;
		case "seaHandR": name = "Sea Monster Hand"; break;
		case "seaMan": name = "Sea Monster Head"; break;
		case "seaHandL": name = "Sea Monster Hand"; break;
		case "beeQueenA": name = "??? (First Encounter)"; break;
		case "beeQueenB": name = "??? (Second Encounter)"; break;
		case "beeQueenC": name = "??? (Third Encounter)"; break;
		case "kida": name = "Skunk (First Encounter)"; break;
		case "kidb": name = "Skunk (Second Encounter)"; break;
		case "kidc": name = "Skunk (Third Encounter)"; break;
		case "kidd": name = "Skunk (Final Encounter)"; break;
		default: name = GetText("e." + e.Id + "0"); break;
	}
	if(!name) { return ""; }
	const spacing = e.sI.split(","), sx = parseInt(spacing[0]), sy = parseInt(spacing[1]);
	switch(e.Size) {
		case "sm":
		case "md": 
			size = "enemysprite";
			dx = sx * 128;
			dy = sy * 148;
			break;
		case "lg":
			size = "enemyspriteb";
			dx = sx * 176;
			dy = sy * 200;
			break;
		case "xl":
			size = "enemyspritex sprite--small";
			dx = sx * 408;
			dy = sy * 344;
			break;
	}
	const exp = Math.ceil(parseInt(e.HP)/10 + parseInt(e.Atk) + parseInt(e.Def)/2);
	const drops = [];
	if(e.money !== "" && e.money !== "0,0") {
		const monies = e.money.split(",");
		monies[0] = parseInt(monies[0]).toLocaleString();
		monies[1] = parseInt(monies[1]).toLocaleString();
		drops.push(VSprite("animCoin0", "sprite--tiny", (monies[0] === monies[1] ? monies[0] : `${monies[0]}-${monies[1]}` ) + "G"));
	}
	for(let i = 0; i < 2; i++) {
		const drop = e["drop" + i].split(",")[0];
		if(drop) {
			drops.push(VSprite(drop, "sprite--tiny", GetText("nm." + drop), drop));
		}
	}
	if(!drops.length) { drops.push("None"); }

	return `
<div class="col-6 col-md-4 d-flex align-items-stretch mb-2 px-1">
	<div class="card text-white bg-secondary full-width${spoilerEnemies.indexOf(e.Id) >= 0 ? " spoiler" : ""}">
		<a name="ref_${e.Id}" class="ref"></a>
		<div class="card-img-top text-center mt-2">
			<div class="${size}"><div class="inner" style="background-position: -${dx}px -${dy}px"></div></div>
		</div>
		<div class="card-body">
			<h5 class="card-title text-center">${name}</h5>
			<div class="row text-center">
				<div class="col"><strong>HP: </strong> ${parseInt(e.HP).toLocaleString()}</div>
				<div class="col"><strong>Atk: </strong> ${e.Atk}</div>
				<div class="col"><strong>Def: </strong> ${e.Def}</div>
			</div>
			<div class="row text-center">
				<div class="col"><strong>Field Size: </strong> ${e.FW}x${e.FH}</div>
				<div class="col"><strong>Seasons:</strong>
					${Seasons["x0"+(e.Sp==="1"?2:0)]}
					${Seasons["x1"+(e.Su==="1"?2:0)]}
					${Seasons["x2"+(e.Au==="1"?2:0)]}
					${Seasons["x3"+(e.Wi==="1"?2:0)]}
				</div>
				<div class="col"><strong>EXP: </strong> ${exp}</div>
			</div>
			<div class="row text-center mt-1">
				<div class="col">
					<strong>Drops: </strong> ${drops.join("")}
				</div>
			</div>
		</div>
	</div>
</div>`;
}

//#endregion
//#region Achievements
const hiddenChievos = ["badrabbit", "kelpBuddy", "boss3help", "boss3hurt", "unplugged", "boss4", "bossMob", "skumpy", "bankStop", "boss5", "helpNerd", "soybeat", "italia"];
const achievements = [ 
    "boss1", "lakeFairy", "goldshroom", "badrabbit", "limeTime", "RAPBATTLE", "boss2", "dowel", "kelpBuddy", "boss3help", "onecook",
    "boss3hurt", "crouton", "unplugged", "boss4", "skumpy", "abuelita", "bossMob", "stonehenge", "laila", "bankStop", "allcook",
    "boss5", "helpNerd", "abee", "techGood", "techBad", "natureGood", "natureBad", "vegan", "beeKing", "luddite", "calsotte",
    "springKing", "summerHummer", "autumnBottom", "winterHinter", "seasons", "vegbuddy", "treebuddy", "mushbuddy", "eggbuddy", "ricebuddy", "beebuddy",
    "seabuddy", "cowbuddy", "techbuddy", "biglaunch", "soybeat", "fullUpgrade", "allCrop", "overkill", "madeForMe", "italia", "murderedToDeath"
];
function AchievementCard(a) {
	return  `
<div class="col-4 col-md-3 d-flex align-items-stretch mb-2 px-1">
	<div class="card text-white bg-secondary full-width${hiddenChievos.indexOf(a) >= 0 ? " spoiler" : ""}">
		<div class="card-img-top text-center mt-2">
			${VSprite("a." + a)}
		</div>
		<div class="card-body">
			<h5 class="card-title text-center">${GetText("a." + a)}</h5>
			<div class="row mt-1">
				<div class="col">${GetText("ad." + a)}</div>
			</div>
		</div>
	</div>
</div>`
}
//#endregion
//#region Calsotte
const nosotte = ["bee", "spear", "rod", "water", "tech", "sickle2", "egg"];
const calsottes = [
	{ id: "crisis", causes: ["leek"], type: "one" },
	{ id: "toxic", causes: ["poisnshroom"], type: "one", desc: "No other buffs except \"Existential Crisis\" can be active while \"Toxic\" is active." },
	{ id: "stinky", desc: "Caused by not cleaning up after Calsotte." },
	{ id: "stuffed", desc: "Have 8 items in Calsotte's tummy" },
	{ id: "wellfed", desc: "Have 6-7 items in Calsotte's tummy" },
	{ id: "allberries", causes: ["tomato", "grapes", "banana", "blackberry", "avocado"], type: "allberries" },
	{ id: "loved", desc: "Pet Calsotte 10 times" },
	{ id: "gourmand", causes: ["coconut", "gmocorn", "goodfood", "notdrugs", "lotus", "saffron"], type: "any" },
	{ id: "protein", causes: ["asparagus", "avocado", "spinach"], type: "all" },
	{ id: "sofrito", causes: ["garlic", "leek", "bellpepper", "tomato"], type: "all" },
	{ id: "core", causes: ["apricot", "avocado"], type: "all" },
	{ id: "italia", causes: ["garlic", "carrot"], type: "all", desc: "Requires any mushroom and 3+ tomatoes plus:" },
	{ id: "fodder", causes: veggies.filter(v => v.Type === "food").map(v => v.Id), type: "any" },
	{ id: "friedrice", causes: ["garlic", "ginger"], type: "all", desc: "Requires any paddy crop plus:" },
	{ id: "wet", causes: veggies.filter(v => v.Type === "moist").map(v => v.Id), type: "any" },
	{ id: "pungent", causes: ["garlic", "ginger", "asparagus"], type: "atl3" },
	{ id: "spicy", causes: ["bellpepper", "garlic", "rhubarb"], type: "atl3" },
	{ id: "veggies", causes: veggies.filter(v => v.Type === "veg").map(v => v.Id), type: "atl5" },
	{ id: "fruits", causes: veggies.filter(v => v.Type === "tree").map(v => v.Id), type: "atl5" },
	{ id: "mush", causes: veggies.filter(v => v.Type === "mush").map(v => v.Id), type: "atl5" },
	{ id: "rice", causes: veggies.filter(v => v.Type === "rice").map(v => v.Id), type: "atl5" },
	{ id: "spring", causes: veggies.filter(v => nosotte.indexOf(v.Type) < 0 && v.Sp === "2").map(v => v.Id), type: "atl4" },
	{ id: "summer", causes: veggies.filter(v => nosotte.indexOf(v.Type) < 0 && v.Su === "2").map(v => v.Id), type: "atl4" },
	{ id: "autumn", causes: veggies.filter(v => nosotte.indexOf(v.Type) < 0 && v.Au === "2").map(v => v.Id), type: "atl4" },
	{ id: "winter", causes: veggies.filter(v => nosotte.indexOf(v.Type) < 0 && v.Wi === "2").map(v => v.Id), type: "atl4" }
];
function CalsotteCard(c) {
	let text;
	switch(c.type) {
		case "one": text = "Feed one or more"; break;
		case "any": text = "Feed at least one of"; break;
		case "all": text = "Feed one or more of each"; break;
		case "allberries": text = "Only Feed"; break;
		case "atl3": text = "Feed at least 3 of"; break;
		case "atl4": text = "Feed at least 4 of"; break;
		case "atl5": text = "Feed at least 5 of"; break;
	}
	const causeHTML = c.causes ? `
		<div class="text-center">
			<strong>${text}: ${c.causes.map(v => VSprite(v, "sprite--tiny", GetText("nm." + v), v)).join("")}</strong>
		</div>`: "";
	return  `
<div class="col-4 col-md-3 d-flex align-items-stretch mb-2 px-1">
	<div class="card text-white bg-secondary full-width">
		<div class="card-img-top text-center mt-2">
			${VSprite("o." + c.id)}
		</div>
		<div class="card-body">
			<h5 class="card-title text-center">${GetText("perk." + c.id + ".n")}</h5>
			<p>${GetText("perk." + c.id + ".d")}</p>
			${c.desc ? `<div class="text-center">${c.desc}</div>` : ""}
			${causeHTML}
		</div>
	</div>
</div>`;
}
//#endregion
//#region Maps
const ResizeAndCopyFile = async function(filename) {
	const destination = path.join(assetpath, filename + ".png");
    const img = sharp(path.join(__dirname, "../../img/maps/", filename + ".png"));
    return img.metadata().then(metadata => {
        img.extend({ top: 0, left: 0, right: 0, bottom: 0, background:"#00000000" })
            .resize({ width: metadata.width * 0.25, kernel: sharp.kernel.nearest }).toFile(destination, () => {
            imagemin([destination], {
                destination: destination,
                plugins: [imageminPngquant()]
            }).then(() => console.log(`Copied/Resized Map ${filename}`));
        });
    });
}

const mapKey = {
	"shop": "bg-success",
	"misc": "bg-info",
	"quest": "bg-primary",
	"enemy": "bg-danger",
	"bees": "bg-warning text-dark",
	"move": "bg-light text-dark",
	"warp": "bg-dark"
};
const maps = ["farm", "producestand", "firstvillage", "forest", "belowvillage", "molehome", "researchfacility", "bridge", "underwater", "fakefarm", "southcity", "northcity",
				"hq_1", "hq_2", "hq_3", "hq_4", "hq_5"];
const mapItems = {
	"farm": [
		{ type: "move", id: "producestand", x: 93, y: 51 },
		{ type: "misc", name: "Mushroom Log", x: 16, y: 23 },
		{ type: "shop", id: "inn0", x: 41, y: 6 },
		{ type: "shop", id: "coop", x: 74, y: 11 },
		{ type: "bees", name: "Beehive", x: 9, y: 4 },
	],
	"producestand": [
		{ type: "move", id: "farm", x: 1, y: 83 },
		{ type: "move", id: "firstvillage", x: 54.5, y: 94 },
		{ type: "misc", name: "Truck", key: "T", x: 57, y: 29, desc: "You'll need to defeat Dr. Jeff at the Research Facility before you can drive your truck." },
		{ type: "quest", name: "Egg Fairy", x: 80, y: 79, desc: `Drop a chicken egg in the lake and a fairy may reward you with a <a class="reflink" href="#ref_goldegg">Golden Egg</a>. if you're honest.` },
		{ type: "enemy", id: "Discussly", x: 32.5, y: 17 }
	],
	"firstvillage": [
		{ type: "move", id: "producestand", x: 66.5, y: 1 },
		{ type: "move", id: "forest", x: 1, y: 72 },
		{ type: "move", id: "belowvillage", x: 66.5, y: 95 },
		{ type: "shop", id: "upgrade1", x: 56, y: 64 },
		{ type: "shop", id: "inn1", x: 49, y: 12 },
		{ type: "shop", id: "fixture1", x: 9, y: 18 },
		{ type: "shop", id: "equip1", x: 53, y: 37 },
		{ type: "shop", id: "seed1", x: 15.5, y: 54 },
		{ type: "enemy", id: "kida", x: 71, y: 6 }
	],
	"forest": [
		{ type: "move", id: "firstvillage", x: 40, y: 57 },
		{ type: "quest", name: "Golden Mushroom", x: 28, y: 27 },
		{ type: "quest", name: "Lime", x: 81.5, y: 77, desc: `Trade him something yellow for a reward. Give him <a class="reflink" href="#ref_goldegg">Golden Egg</a> to get <a class="reflink" href="#ref_coconut">Coconut seeds</a>.` },
		{ type: "misc", name: "Fish", x: 57, y: 27, desc: `This fish wants you to promise never to hurt their friends. If you beat the game without using any fishing equipment, he'll reward you 5000G.` },
		{ type: "misc", name: "Rude Rabbit", x: 65, y: 29, desc: `This rabbit will let you take some of his <a class="reflink" href="#ref_carrot">Carrot seeds</a> and will sell you a piece of <a class="reflink" href="#ref__strongsoil">Strong Soil</a> for 500G.` },
		{ type: "bees", name: "Beehive", x: 42.5, y: 27, desc: `A <a class="reflink" href="#ref_bear">bear</a> will attack you after collecting this beehive.` },
		{ type: "enemy", id: "bossturky", x: 9, y: 69 },
		{ type: "warp", key: "I-1", x: 24, y: 39 }, { type: "warp", key: "O-1", x: 54, y: 41 },
		{ type: "warp", key: "I-2", x: 72, y: 38 }, { type: "warp", key: "O-2", x: 15, y: 47 },
		{ type: "warp", key: "I-3", x: 24, y: 70 }, { type: "warp", key: "O-3", x: 58, y: 16 },
		{ type: "warp", key: "I-4", x: 58, y: 44 }, { type: "warp", key: "O-4", x: 87, y: 69 },
		{ type: "warp", key: "I-5", x: 87, y: 63 }, { type: "warp", key: "O-5", x: 27, y: 36 },
		{ type: "warp", key: "I-6", x: 79, y: 63 }, { type: "warp", key: "O-6", x: 6, y: 59 },
		{ type: "warp", key: "I-7", x: 42.5, y: 37 }, { type: "warp", key: "O-7", x: 27, y: 39 },
		{ type: "warp", key: "I-8", x: 15, y: 28 }, { type: "warp", key: "O-8", x: 65, y: 38 },
		{ type: "full", text: `<p>It's easy to get lost in Agrios Forest, as walking through certain corridors will teleport you to another part of the forest. For example, if you walk into <span class="badge bg-dark">I-1</span>, you will be warped to <span class="badge bg-dark">O-1</span>.</p>
		<p>To reach the golden mushroom and beehive, simply turn right immediately and head north up the rightmost path. To reach Lime, head east past the beehive, then head south through the middle path to <span class="badge bg-dark">I-4</span>.</p>
		<p>If at any time you feel too lost, navigate to the <a class="reflink" href="#nofun">I'm Not Having Fun Menu</a>, and select "It's the puzzles" to be warped to the right place automatically.</p>` }
	],
	"belowvillage": [
		{ type: "move", id: "firstvillage", x: 66.5, y: 1 },
		{ type: "move", id: "molehome", x: 67, y: 62 },
		{ type: "move", id: "researchfacility", x: 22.5, y: 42 },
		{ type: "move", id: "researchfacility", x: 40, y: 37 },
		{ type: "bees", name: "Beehive", x: 11, y: 87 }
	],
	"molehome": [
		{ type: "move", id: "belowvillage", x: 46, y: 1 },
		{ type: "quest", name: "Gunk the Mole", x: 60, y: 21, desc: "If you make him some mushroom soup (anything containing at least one mushroom), he will reward you with several fixtures." }
	],
	"researchfacility": [
		{ type: "move", id: "belowvillage", x: 38, y: 95 },
		{ type: "move", id: "belowvillage", x: 95, y: 5 },
		{ type: "enemy", id: "ScienceMan", x: 21, y: 4 },
		{ type: "quest", name: "RAPBATTLE", x: 88, y: 21, desc: `Trade them a hearty crop (garlic or rice) for a reward. Give them <a class="reflink" href="#ref_coconut">Coconut seeds</a> to get <a class="reflink" href="#ref_gmocorn">GMO Corn seeds</a>.` },
		{ type: "warp", key: "RS1", x: 6, y: 92 },
		{ type: "warp", key: "RS2", x: 36, y: 18 },
		{ type: "warp", key: "GS1", x: 11, y: 34 },
		{ type: "warp", key: "RW", x: 12, y: 83 },
		{ type: "warp", key: "RW", x: 12, y: 83 },
		{ type: "warp", key: "RW", x: 29, y: 75 },
		{ type: "warp", key: "RW", x: 18, y: 48 },
		{ type: "warp", key: "RW", x: 40, y: 28 },
		{ type: "warp", key: "RW", x: 90, y: 60 },
		{ type: "warp", key: "BS1", x: 56, y: 83 },
		{ type: "warp", key: "BS2", x: 68, y: 20 },
		{ type: "warp", key: "BW", x: 62, y: 93 },
		{ type: "warp", key: "BW", x: 59, y: 6 },
		{ type: "warp", key: "BW", x: 78, y: 18 },
		{ type: "warp", key: "GW", x: 40, y: 75 },
		{ type: "warp", key: "GW", x: 79, y: 62 },
		{ type: "warp", key: "GW", x: 40, y: 23 },
		{ type: "warp", key: "GW", x: 81, y: 34 },
		{ type: "warp", key: "GW", x: 54, y: 15 },
		{ type: "warp", key: "GW", x: 88, y: 13 },
		{ type: "warp", key: "BW", x: 88, y: 11 },
		{ type: "warp", key: "RW", x: 88, y: 9 },
		{ type: "full", text: `<p>The Research Facility contains several shaped and colored switches that, when toggled, raise and lower walls of the same shape and color. To reach the boss, toggle switch RS1, then move through the newly opened path and toggle switch GS1. Then head back down and hit RS1 and BS1, head out the right door, head around through the newly opened green and red walls, toggle GS1 one last time then head right, up through the blue walls, and left through the green wall.</p>
		<p>By toggling switches like this, you'll also be able to reach various treasures, and RAPBATTLE in the northeast corner of the facility. Entering the facility from the back will allow you to reach many more treasures if all the walls are down.</p>
		<p>If you don't want to deal with this, navigate to the <a class="reflink" href="#nofun">I'm Not Having Fun Menu</a>, and select "It's the puzzles."</p>` }
	],
	"bridge": [
		{ type: "move", id: "underwater", x: 10, y: 76 },
		{ type: "misc", name: "Truck", key: "T", x: 89, y: 23, desc: "You'll need to clear the path by defeating either the construction workers or sea monster before you can drive past the bridge." },
		{ type: "shop", id: "mermaid", x: 27, y: 71 },
		{ type: "shop", id: "mermaidinn", x: 55, y: 60 },
		{ type: "shop", id: "cworker", x: 69, y: 15 },
		{ type: "quest", name: "Cecilia", x: 87, y: 81, desc: `If you make her a smoothie, she will reward you with several fixtures. The perfect smoothie contains 
		<a class="reflink" href="#ref_coconut">Coconut</a>,
		<a class="reflink" href="#ref_spinach">Spinach</a>,
		<a class="reflink" href="#ref_carrot">Carrot</a>,
		<a class="reflink" href="#ref_ginger">Ginger</a>,
		<a class="reflink" href="#ref_pineapple">Pineapple</a>,
		and <a class="reflink" href="#ref_tomato">Tomato</a>, but just using a few of those ingredients will be enough to score some fixtures, as long as you don't add in negative ingredients like rice, animal feed,
		<a class="reflink" href="#ref_garlic">Garlic</a>,
		<a class="reflink" href="#ref_asparagus">Asparagus</a>,
		<a class="reflink" href="#ref_gmocorn">GMO Corn</a>,
		or <a class="reflink" href="#ref_poisnshroom">Toxic Shroom</a>.` },
		{ type: "quest", name: "Cow", x: 77, y: 9, desc: `After talking to <a class="reflink" href="#ref_kelpboy">Kelp Boy</a>, this cow will give you a carton of milk.` },
		{ type: "enemy", id: "BossWorker", x: 31, y: 3, desc: `You can choose to fight either the Construction Manager or the <a class="reflink" href="#ref_seaMan">Sea Monster</a> to get past the Bridge Crossing.` },
	],
	"underwater": [
		{ type: "move", id: "bridge", x: 84, y: 64 },
		{ type: "quest", name: "Dowel", x: 59, y: 34, desc: `Trade him an underwater crop (any <a class="reflink" href="#ref__paddy">paddy crop</a>) for a reward. Give him <a class="reflink" href="#ref_gmocorn">GMO Corn seeds</a> to get his Sea Monk Key.` },
		{ type: "quest", name: "Locked Chest", x: 89, y: 38, desc: `Acquire the Sea Monk Key from Dowel to unlock this chest and acquire some <a class="reflink" href="#ref_ultrarod">Golden Rods</a>.` },
		{ type: "quest", name: "Kelp Boy", x: 93, y: 86, desc: `If you fetch him a carton of milk from the Cow on the Bridge Crossing, he will reward you with his beehive. If you instead break his vase, you will have to <a class="reflink" href="#ref_kelpBoy">fight him</a>.` },
		{ type: "enemy", id: "seaMan", x: 36, y: 56, desc: `You can choose to fight either the <a class="reflink" href="#ref_BossWorker">Construction Manager</a> or the Sea Monster to get past the Bridge Crossing.` },
		{ type: "bees", name: "Beehive", x: 90, y: 86 },
		{ type: "full", text: `<p>There are several strong currents throughout this area that will carry you across the ground if you walk into them. By pushing rocks over the currents, you will block them off so that you can navigate through the area.</p>
		<p>If you don't want to deal with this, navigate to the <a class="reflink" href="#nofun">I'm Not Having Fun Menu</a>, and select "It's the puzzles."</p>` }
	],
	"fakefarm": [
		{ type: "misc", name: "Truck", key: "T", x: 84, y: 81, desc: "You'll need to change your tire before you can drive again." },
		{ type: "quest", name: "Crouton", x: 83, y: 67, desc: `Trade him some fishing equipment for a reward. Give him a <a class="reflink" href="#ref_ultrarod">Golden Rod</aa> to get some <a class="reflink" href="#ref_goodfood">Delicious Food</a>.` },
		{ type: "quest", name: "Spare Tire", x: 46, y: 8, desc: `After acquiring the spare tire, you will have to defeat some machines to unlock the passageway, or just unplug the machine with the outlet next to the tire rack.` },
		{ type: "shop", id: "upgrade2", x: 9, y: 67 },
		{ type: "shop", id: "fixture2", x: 59, y: 47 },
		{ type: "enemy", id: "housekeeper", x: 46, y: 67 },
		{ type: "enemy", id: "kidb", x: 93, y: 74 }
	],
	"southcity": [
		{ type: "move", id: "northcity", x: 55.5, y: 1 },
		{ type: "misc", name: "Truck", key: "T", x: 61, y: 89 },
		{ type: "quest", name: "Old Lady", x: 43, y: 37, desc: `Trade her some <a class="reflink" href="#ref_fodder">Fodder</a>, <a class="reflink" href="#ref_corn">Corn</a>, or <a class="reflink" href="#ref_rice">Rice</a> for a reward. Give her some <a class="reflink" href="#ref_goodfood">Delicious Food</a> to get some <a class="reflink" href="#ref_notdrugs">Funny Mushrooms</a>.` },
		{ type: "quest", name: "Capo Mangia", x: 48, y: 52, desc: `If you make him a marinara sauce, he will reward you with several fixtures. A proper marinara sauce contains 
		<a class="reflink" href="#ref_tomato">Tomato</a>,
		<a class="reflink" href="#ref_garlic">Garlic</a>,
		<a class="reflink" href="#ref_carrot">Carrot</a>,
		and <a class="reflink" href="#ref__log">any mushroom</a>.` },
		{ type: "enemy", id: "mrbruno", x: 55.5, y: 67, desc: "If you choose to lay low during the cutscene, you will not have to fight him. However, you will gain 1.5 points on the Pacifist Axis by standing up for Skumpy, and lose 1.5 points by staying silent." },
		{ type: "enemy", id: "mobBoss", x: 23, y: 51 },
		{ type: "shop", id: "skumpys", x: 51, y: 76 },
		{ type: "shop", id: "mantools", x: 65, y: 58 },
		{ type: "shop", id: "seedshack", x: 82, y: 73 },
		{ type: "shop", id: "catalinas", x: 84, y: 58 },
		{ type: "shop", id: "tinker", x: 62.1, y: 21 },
		{ type: "shop", id: "pawn", x: 70, y: 38 },
		{ type: "shop", id: "church", x: 47.5, y: 24 },
		{ type: "full", text: `<p>Mobsters patrol this area with yellow cones of vision extending in front of them. If you wind up inside this field, they will attack you.</p>` }
	],
	"northcity": [
		{ type: "move", id: "southcity", x: 13, y: 96 },
		{ type: "move", id: "hq_1", x: 61.6, y: 16 },
		{ type: "quest", name: "Daveothy", x: 24, y: 42, desc: `Trade him some <a class="reflink" href="#ref__log">mushrooms</a> for a reward. Give him a <a class="reflink" href="#ref_notdrugs">Funny Mushroom</a> to get some <a class="reflink" href="#ref_lotus">Sacred Lotus seeds</a>. Give him a <a class="reflink" href="#ref_poisnshroom">Toxic Mushroom</a> to lose a lot of points on the Pacifist Axis due to the attempted murder.` },
		{ type: "quest", name: "Mailman", x: 37, y: 38, desc: `He'll give you some mail, which can be delivered to Catalina in <a class="reflink" href="#ref_southcity">South Las Abejas</a> and she'll start selling bees.` },
		{ type: "misc", name: "Jeromy", x: 55, y: 31, desc: `He sells various fishing supplies.` },
		{ type: "misc", name: "Brandt", x: 85, y: 41, desc: `Talk to him to receive many <a class="reflink" href="#ref_spinach">Spinach seeds</a>.` },
		{ type: "misc", name: "Egg Dealer", x: 90, y: 56, desc: `He will sell you two random <a class="reflink" href="#ref__coop">eggs</a> for 250G, including <a class="reflink" href="#ref_goldegg">Golden Eggs</a>.` },
		{ type: "misc", name: "Cash2 ATMs", x: 39, y: 64, desc: "Cash2 is a ripoff, just like all cryptocurrencies." },
		{ type: "quest", name: "Cavely", x: 26, y: 11, desc: `After beating the Final Boss, you can access Cavely to explore randomly generated dungeons.` },
		{ type: "enemy", id: "dweebLord", x: 70, y: 30, desc: `You will need to pick up Jeff's keycard and defeat him before you can enter the Food2 Headquarters.` },
		{ type: "enemy", id: "robber", x: 13, y: 10 },
		{ type: "shop", id: "cityExpansions", x: 39, y: 16 },
		{ type: "shop", id: "cityTech", x: 87, y: 16 },
		{ type: "shop", id: "gordonsFarming", x: 68, y: 80 },
		{ type: "shop", id: "cityFixtures", x: 24, y: 80 },
		{ type: "shop", id: "cityInn", x: 54.5, y: 80 },
		{ type: "bees", name: "Beehive", x: 88, y: 60 },
		{ type: "enemy", id: "kidc", x: 63, y: 18.5 }
	],
	"hq_1": [
		{ type: "move", id: "hq_2", x: 17, y: 4 },
		{ type: "move", id: "northcity", x: 48, y: 95 },
		{ type: "warp", key: "RS1", x: 75, y: 14 },
		{ type: "warp", key: "RS2", x: 2, y: 48 },
		{ type: "warp", key: "BS1", x: 85, y: 14 },
		{ type: "warp", key: "BS2", x: 60, y: 60 },
		{ type: "warp", key: "BS3", x: 31, y: 25 },
		{ type: "warp", key: "GS1", x: 3, y: 25 },
		{ type: "warp", key: "GW", x: 22, y: 44 },
		{ type: "warp", key: "GW", x: 12, y: 38 },
		{ type: "warp", key: "GW", x: 12, y: 25 },
		{ type: "warp", key: "GW", x: 30, y: 38 },
		{ type: "warp", key: "BW", x: 80, y: 22 },
		{ type: "warp", key: "BW", x: 57, y: 19 },
		{ type: "warp", key: "BW", x: 54, y: 45 },
		{ type: "warp", key: "BW", x: 64, y: 9 },
		{ type: "warp", key: "BW", x: 64, y: 9 },
		{ type: "warp", key: "BW", x: 31, y: 54 },
		{ type: "warp", key: "BW", x: 12, y: 54 },
		{ type: "warp", key: "RW", x: 64, y: 32 },
		{ type: "warp", key: "RW", x: 22, y: 32 },
		{ type: "quest", name: "Hungry Nerd", x: 41, y: 38, desc: `Feed him pretty much anything and he will reward you with several fixtures.` },
		{ type: "full", text: `<p>The first floor of the Food2 Headquarters contains several shaped and colored switches that behave the same as the switches in the <a class="reflink" href="#ref_researchfacility">Research Facility</a>. To reach the stairs, toggle switch RS1, then move through the newly opened path and toggle switch BS2. Toggle switch GS1 to reach the exit.</p>
		<p>By toggling switches like this, you'll also be able to reach various treasures and the hungry nerd. If you don't want to deal with this, navigate to the <a class="reflink" href="#nofun">I'm Not Having Fun Menu</a>, and select "It's the puzzles."</p>` }
	],
	"hq_2": [
		{ type: "move", id: "hq_1", x: 17, y: 4 },
		{ type: "move", id: "hq_3", x: 78, y: 4 },
		{ type: "full", text: `<p>There are several conveyor belts throughout this area that will carry you across the floor if you walk into them. By pressing their power buttons, you can turn them off so that you can navigate through the area.</p>
		<p>If you don't want to deal with this, navigate to the <a class="reflink" href="#nofun">I'm Not Having Fun Menu</a>, and select "It's the puzzles."</p>` }
	],
	"hq_3": [
		{ type: "move", id: "hq_4", x: 17, y: 4 },
		{ type: "move", id: "hq_2", x: 78, y: 4 },
		{ type: "misc", name: "Trent", x: 76, y: 86, desc: "You can choose to help carry him to safety, or leave him to probably die." },
		{ type: "full", text: `<p>A <a class="reflink" href="#ref_theMonster">mysterious and deadly creature</a> roams this floor. You will only be able to see the room you're currently in - other rooms will be obscured until you enter them. Lines will grow across the top and bottom of the screen as the creature gets closer to you; they will fade away if you manage to evade it. The entrance and exit rooms, as well as the research lab in the southwest corner of the floor, are safe areas, and the creature will not find you in them.</p>` }
	],
	"hq_4": [
		{ type: "move", id: "hq_3", x: 17, y: 4 },
		{ type: "move", id: "hq_5", x: 80, y: 4 },
		{ type: "enemy", id: "discuss2", x: 83, y: 43 },
		{ type: "quest", name: "Beehive", x: 24, y: 42, desc: `Plant a <a class="reflink" href="#ref_lotus">Sacred Lotus seed</a> here to get some <a class="reflink" href="#ref_hbee">Haunted Bees</a>.` },
		{ type: "shop", id: "vendo_veg", x: 47.5, y: 15 },
		{ type: "shop", id: "vendo_tree", x: 50.5, y: 15 },
		{ type: "shop", id: "vendo_mush", x: 54, y: 15 },
		{ type: "shop", id: "vendo_paddy", x: 57, y: 15 },
		{ type: "shop", id: "vendo_coop", x: 60.5, y: 15 },
		{ type: "shop", id: "vendo_water", x: 63.5, y: 15 },
		{ type: "shop", id: "vendo_tech", x: 67, y: 15 }
	],
	"hq_5": [
		{ type: "move", id: "hq_6", x: 46, y: 1 },
		{ type: "move", id: "northcity", x: 63, y: 10 },
		{ type: "move", id: "hq_3", x: 46, y: 97 },
		{ type: "shop", id: "lastInn", x: 28, y: 10 },
		{ type: "enemy", id: "beckett", x: 46, y: 50 },
		{ type: "enemy", id: "kidd", x: 49, y: 6 }
	],
};

const expandos = {
	"farmupgradeI": "4x3",
	"farmupgradeO": "4x4",
	"farmupgrade_": "6x3",
	"farmupgradeOO": "8x4",
	"farmupgrade__": "7x5"
};

const mapHTML = [];
maps.forEach(m => {
	if(copyMaps) { ResizeAndCopyFile(m); }
	const itemInfo = mapItems[m];
	const labelsHTML = [], keysHTML = [], typeIndexes = {};
	itemInfo.forEach(i => {
		if(!typeIndexes[i.type]) { typeIndexes[i.type] = 1; }
		const idx = i.key || typeIndexes[i.type]++;
		let addtlInfo = "";
		if(i.type === "shop") {
			i.name = ShopNames[i.id];
			const wares = shops[i.id].wares;
			addtlInfo = `<div class="map-addtlinfo">` + wares.map(w => {
				switch(w.type) {
					case "inn": return `<div>${VSprite("sleep", "vert sprite--tiny")} Sleep (${w.price}G)</div>`;
					case "book": return `<div>${VSprite(w.product, "vert sprite--tiny")} ${GetText(w.name).split("<br>")[0]}</div>`;
					case "seed": return `<div>${VSprite(w.product, "vert sprite--tiny", undefined, w.product)} <a class="reflink" href="#ref_${w.product}">${GetText("nm." + w.product)}</a> (${veggiesObj[w.product].Price}G)</div>`;
					case "equipment": return `<div>${VSprite(w.product, "vert sprite--tiny", undefined, w.product)} <a class="reflink" href="#ref_${w.product}">${GetText(w.product)}</a> (${equipObj[w.product].Price}G)</div>`;
					case "farm": return `<div>${VSprite(w.product, "vert sprite--tiny", undefined, w.product)} <a class="reflink" href="#ref_${w.product}">${GetText(w.product.replace("_", ""))}</a> (${fixObj[w.product].Price}G)</div>`;
					case "upgrade": 
						return `<div>${expandos[w.product]} Farm Expansion (${w.price}G)</div>`;
				}
				return "";
			}).join("\n") + "</div>";
		} else if(i.type === "enemy") {
			let name = "";
			switch(i.id) {
				case "BossWorker": name = "Construction Manager"; break;
				case "robber": name = "Bank Robbers"; break;
				case "seaMan": name = "Sea Monster"; break;
				case "discuss2": name = "Antepenultimate Boss"; break;
				case "beckett": name = "Penultimate Boss"; break;
				case "kida": name = "Skunk (First Encounter)"; break;
				case "kidb": name = "Skunk (Second Encounter)"; break;
				case "kidc": name = "Skunk (Third Encounter)"; break;
				case "kidd": name = "Skunk (Final Encounter)"; break;
				default: name = GetText("e." + i.id + "0"); break;
			}
			i.name = `<a class="reflink" href="#ref_${i.id}">${name}</a>`;
		} else if(i.type === "move") {
			if(i.id === "hq_6") {
				i.name = `to Food2 HQ 6F and <a class="reflink" href="#ref_nathan">the Final Boss</a>`;
			} else {
				i.name = `to <a class="reflink" href="#ref_${i.id}">${GetText("map." + i.id)}</a>`;
			}
		}
		if(i.desc) { addtlInfo = `<div class="map-addtlinfo">${i.desc}</div>`; }
		if(i.type === "full") {
			keysHTML.push(`<div class="col-11 mt-2">${i.text}</div>`);
			return;
		}
		labelsHTML.push(`<span class="map-label badge ${mapKey[i.type]}" style="left: ${i.x}%; top: ${i.y}%">${idx}</span>`);
		if(i.type === "warp") { return; }
		keysHTML.push(`
<div class="col mt-2 map-info">
	<div><span class="badge ${mapKey[i.type]}">${idx}</span> ${i.name}</div>
	${addtlInfo}
</div>`);
	});
	mapHTML.push(`
<div class="col-12 d-flex align-items-stretch mb-2 px-1">
	<div class="card text-white bg-secondary full-width">
	<a name="ref_${m}" class="ref"></a>
		<div class="card-body">
			<h5 class="card-title text-center">${GetText("map." + m)}</h5>
		</div>
		<div class="row">
			<div class="col">
				<div class="card-img-top text-center mb-3">
					<div class="map-img">
						<img class="img-fluid" src="assets/${m}.png" />
						<div class="img-cover">
							${labelsHTML.join("\n")}
						</div>
					</div>
				</div>
			</div>
			<div class="col mb-5">
				<div class="row">
					${keysHTML.join("\n")}
				</div>
			</div>
		</div>
	</div>
</div>`);
});
//#endregion

const template = fs.readFileSync(path.join(__dirname, "parts/template.html"), "utf8");
const output = template
					.replace("{@crops}", veggies.map(v => VeggieCard(v)).join("\n"))
					.replace("{@equipment}", equipment.map(e => EquipmentCard(e)).join("\n"))
					.replace("{@fixtures}", fixtures.map(f => FixtureCard(f)).join("\n"))
					.replace("{@calsottes}", calsottes.map(c => CalsotteCard(c)).join("\n"))
					.replace("{@achievements}", achievements.map(a => AchievementCard(a)).join("\n"))
					.replace("{@enemies}", enemies.map(e => EnemyCard(e)).join("\n"))
					.replace("{@locations}", mapHTML.join("\n"));
fs.writeFileSync(path.join(outpath, "manual.html"), output);

if(!fs.existsSync(assetpath)) { fs.mkdirSync(assetpath); }
const CopyFile = filename => fs.copyFileSync(path.join(__dirname, "../../img/", filename), path.join(assetpath, filename));
CopyFile("sheet.png");
CopyFile("sheetBig.png");
CopyFile("combatSheet.png");
CopyFile("combatSheetBig.png");
CopyFile("combatSheetHuge.png");
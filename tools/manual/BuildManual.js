const path = require("path");
const fs = require("fs");
const text = require("./parts/text");
const spritedata = require("./parts/spritedata");
const shops = require("./parts/shops");
const veggies = require("./parts/veggies");
const enemies = require("./parts/enemies");
const equipment = require("./parts/equipment");
const fixtures = require("./parts/fixtures");

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
		if(!ShopNames[key]) { continue; }
		const wares = shops[key].wares;
		if(wares.some(w => w.product === v.Id)) {
			shopsFoundAt.push(`<div>${ShopNames[key]}</div>`);
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
		if(!ShopNames[key]) { continue; }
		const wares = shops[key].wares;
		if(wares.some(w => w.product === e.Id)) {
			shopsFoundAt.push(`<div>${ShopNames[key]}</div>`);
		}
	}
	if(shopsFoundAt.length === 0) { shopsFoundAt.push(`<div class="text-center">No shops sell this</div>`); }

	const cardbase = `
<div class="col-6 col-md-4 d-flex align-items-stretch mb-2 px-1">
	<div class="card text-white bg-secondary full-width">
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
</div>`
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
		if(!ShopNames[key]) { continue; }
		const wares = shops[key].wares;
		if(wares.some(w => w.product === f.Id)) {
			shopsFoundAt.push(`<div>${ShopNames[key]}</div>`);
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

const outpath = path.join(__dirname, "out");
if(!fs.existsSync(outpath)) { fs.mkdirSync(outpath); }

const template = fs.readFileSync(path.join(__dirname, "parts/template.html"), "utf8");
const output = template
					.replace("{@crops}", veggies.map(v => VeggieCard(v)).join("\n"))
					.replace("{@equipment}", equipment.map(e => EquipmentCard(e)).join("\n"))
					.replace("{@fixtures}", fixtures.map(f => FixtureCard(f)).join("\n"))
					.replace("{@enemies}", enemies.map(e => EnemyCard(e)).join("\n"));
fs.writeFileSync(path.join(outpath, "manual.html"), output);

const assetpath = path.join(outpath, "assets");
if(!fs.existsSync(assetpath)) { fs.mkdirSync(assetpath); }
const CopyFile = filename => fs.copyFileSync(path.join(__dirname, "../../img/", filename), path.join(assetpath, filename));
CopyFile("sheet.png");
CopyFile("sheetBig.png");
CopyFile("combatSheet.png");
CopyFile("combatSheetBig.png");
CopyFile("combatSheetHuge.png");
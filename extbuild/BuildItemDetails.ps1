param ([string]$which="CEF")
function NullOrEmpty($a) { return ($a -ne $null -and $a -ne ""); }
function Coalesce($a, $b) { if (NullOrEmpty $a) { $a } else { $b } }
New-Alias "??" Coalesce;

$rootpath = Resolve-Path ..;
if($which.Contains("C")) {
	Write-Host "Converting Details_Crops.ods to veggies.js";
	& "C:\Program Files (x86)\LibreOffice 5\program\soffice.exe" --headless --convert-to csv --outdir ".\temp" "Details_Crops.ods" | Out-Null;
	$csv = Import-CSV ".\temp\Details_Crops.csv";
	$out = [System.IO.StreamWriter] "$rootpath\js\gamedata\veggies.js";
	$out.WriteLine(@'
function CropDetail(name, displayname, price, type, size, time, frames, power, re, sp, su, au, wi, addtl) {
    this.name = name;
    this.type = type;
    this.price = price;
    this.displayname = displayname;
    this.size = size;
    this.time = time;
    this.frames = frames;
    this.power = power;
    this.respawn = re;
    this.seasons = [sp || 0.2, su || 0.2, au || 0.2, wi || 0.2];
    if(addtl !== undefined) { for(var key in addtl) { this[key] = addtl[key]; } }
}
function GetCropDesc(cropInfo) {
    var text = "Power: " + cropInfo.power;
    if(cropInfo.type === "spear") {
        text += "\n Catch Chance: " + (cropInfo.req * 100) + "%";
        return text;
    }
    if(cropInfo.time > 0) { text += "\n Growth Time: " + Math.ceil(cropInfo.time / player.getCropSpeedMultiplier()); }
    if(cropInfo.respawn > 0) { text += "\n Regrowth Time: " + cropInfo.respawn; }
    text += "\n Seasons:";
    if(cropInfo.seasons[0] > 0.5) { text += " SP"; }
    if(cropInfo.seasons[1] > 0.5) { text += " SU"; }
    if(cropInfo.seasons[2] > 0.5) { text += " AU"; }
    if(cropInfo.seasons[3] > 0.5) { text += " WI"; }
    return text;
}
function GetCrop(name) {
    switch(name) {
'@);
	$formatStr = "		case `"{name}`": return new CropDetail(name, `"{displayname}`", {price}, `"{type}`", {size}, {time}, {frames}, {power}, {re}, {sp}, {su}, {au}, {wi}{addtl});";
	$count = 0;
	ForEach($row in $csv) {
		if($row.Crop -eq "" -or $row.Crop -eq "Crop") { continue; }
		if($row.Id -eq "*") {
			$out.WriteLine("		/* _ */".replace("_", $row.Name));
			continue;
		}
		$endStr = $formatStr.replace("{name}", $row.Id).replace("{displayname}", $row.Name).replace("{price}", $row.Price).replace("{type}", $row.Type).replace("{size}", $row.Size);
		$endStr = $endStr.replace("{time}", $row.Time).replace("{frames}", $row.AnimFrames).replace("{power}", $row.Power).replace("{re}", (?? $row.Re 0));
		$endStr = $endStr.replace("{sp}", (?? $row.Sp 0)).replace("{su}", (?? $row.Su 0)).replace("{au}", (?? $row.Au 0)).replace("{wi}", (?? $row.Wi 0));
		$addtl = @();
		if($row.WaterResist) { $addtl += "waterResist: _".replace("_", $row.WaterResist); }
		if($row.FireResist) { $addtl += "fireResist: _".replace("_", $row.FireResist); }
		if($row.Animal) {
			$anInfo = $row.Animal.split("/");
			$addtl += "animal: `"_`"".replace("_", $anInfo[0]);
			$addtl += "animalChance: _".replace("_", $anInfo[1]);
			$addtl += "animalDamageMult: _".replace("_", $anInfo[2]);
		}
		if($row.Catch) { $addtl += "catchLuck: _".replace("_", $row.Catch); }
		if($row.Rot) { $addtl += "rotten: true"; }
		if($row.Req) { $addtl += "req: _".replace("_", $row.Req); }
		if($row.StkChance) { $addtl += "stickChance: _".replace("_", $row.StkChance); }
		if($row.StkRange) { $addtl += "stickRange: _".replace("_", $row.StkRange); }
		if($addtl.Count -gt 0) {
			$folded = $addtl -join ", ";
			$endStr = $endStr.replace("{addtl}", ", { $folded }");
		} else {
			$endStr = $endStr.replace("{addtl}", "");
		}
		$out.WriteLine($endStr);
		$count++;
	}
	$out.WriteLine("	}");
	$out.Write("}")
	$out.close();
	Write-Host "Converted $count crops";
}

if($which.Contains("E")) {
	Write-Host "Converting Details_Equipment.ods to equipment.js";
	& "C:\Program Files (x86)\LibreOffice 5\program\soffice.exe" --headless --convert-to csv --outdir ".\temp" "Details_Equipment.ods" | Out-Null;
	$csv = Import-CSV ".\temp\Details_Equipment.csv";
	$out = [System.IO.StreamWriter] "$rootpath\js\gamedata\equipment.js";
	$out.WriteLine(@'
function EquipmentDetail(name, displayname, price, sprite, type, addtl) {
    this.name = name;
    this.type = type;
    this.price = price;
    this.displayname = displayname;
    this.sprite = sprite;
    if(addtl !== undefined) { for(var key in addtl) { this[key] = addtl[key]; } }
}
function GetEquipmentDesc(equipInfo) {
    var str = "";
    if(equipInfo.type === "weapon") {
        str += "Power: " + equipInfo.power;
        if(equipInfo.targetCrops) { str += "\n Can target enemy Crops."; }
        if(equipInfo.noEnemies) { str += "\n Cannot target enemies."; }
        if(equipInfo.sp) { str += "\n Stronger in Spring."; }
        if(equipInfo.su) { str += "\n Stronger in Summer."; }
        if(equipInfo.au) { str += "\n Stronger in Autumn."; }
        if(equipInfo.wi) { str += "\n Stronger in Winter."; }
        if(equipInfo.tech) { str += "\n Requires Sickle2 Charger on field."; }
        if(equipInfo.attacks) { 
            if(equipInfo.attacks === 999) { str += "\n Attacks all enemies."; }
            else { str += "\n Attacks "+ equipInfo.attacks + " enemies."; }
        }
    } else if(equipInfo.type === "compost") {
        str += "Holding Amount: " + equipInfo.amount;
        if(equipInfo.canAttack) { str += "\n Can attack enemies with Compost."; }
        if(equipInfo.rotOnly) { str += "\n Can only compost rotten crops."; }
        if(equipInfo.bonus) { str += "\n Bonus Effect: " + (equipInfo.bonus * 100) + "%"; }
        if(equipInfo.tech) { str += "\n May backfire."; }
    } else if(equipInfo.type === "gloves") {
        str += "Seeds Per Turn: " + equipInfo.amount;
        if(equipInfo.canAttack) { str += "\n Can Attack or Compost after planting seeds."; }
        if(equipInfo.def) { str += "\n Damage Resistance: " + (equipInfo.def * 100) + "%"; }
        if(equipInfo.tech) { str += "\n May shock saplings and tech when planted. Will shock you when touching water."; }
    } else if(equipInfo.type === "soil") {
        if(equipInfo.speed) { str += "\n Growth Speed Boost: " + (equipInfo.speed * 100) + "%"; }
        if(equipInfo.boost) { str += "\n Seasonal Resistance: " + (equipInfo.boost * 100) + "%"; }
        if(equipInfo.amplify) { str += "\n Seasonal Strength: " + (equipInfo.amplify * 100) + "%"; }
        if(equipInfo.tech) { str += "\n Will kill crops that are too weak or grow too quickly. Bees will fly away."; }
    }
    return str;
}
function GetEquipment(name) {
    switch(name) {
'@);
	$formatStr = "		case `"{name}`": return new EquipmentDetail(name, `"{displayname}`", {price}, `"{sprite}`", `"{type}`"{addtl});";
	$count = 0;
	ForEach($row in $csv) {
		if($row.Crop -eq "" -or $row.Crop -eq "Crop") { continue; }
		if($row.Id -eq "*") {
			$out.WriteLine("		/* _ */".replace("_", $row.Name));
			continue;
		}
		$endStr = $formatStr.replace("{name}", $row.Id).replace("{displayname}", $row.Name).replace("{price}", $row.Price).replace("{sprite}", $row.Sprite).replace("{type}", $row.Type);
		$addtl = @();
		if($row.Tech) { $addtl += "tech: true"; }
		# Weapons
		if(-not $row.Foes) { $addtl += "noEnemies: true"; }
		if($row.Crops) { $addtl += "targetCrops: true"; }
		if($row.Pow) { $addtl += "power: _".replace("_", $row.Pow); }
		if($row.Num) { $addtl += "attacks: _".replace("_", $row.Num); }
		if($row.SP) { $addtl += "sp: _".replace("_", $row.SP); }
		if($row.SU) { $addtl += "su: _".replace("_", $row.SU); }
		if($row.AU) { $addtl += "au: _".replace("_", $row.AU); }
		if($row.WI) { $addtl += "wi: _".replace("_", $row.WI); }
		# Compost
		if($row.Amt) { $addtl += "amount: _".replace("_", $row.Amt); }
		if($row.Rot) { $addtl += "rotOnly: true"; }
		if($row.Atk) { $addtl += "canAttack: true"; }
		if($row.Bns) { $addtl += "bonus: _".replace("_", $row.Bns); }
		# Gloves
		if($row.Def) { $addtl += "def: _".replace("_", $row.Def); }
		# Watering Cans
		if($row.Spd) { $addtl += "speed: _".replace("_", $row.Spd); }
		if($row.Bst) { $addtl += "boost: _".replace("_", $row.Bst); }
		if($row.Amp) { $addtl += "amplify: _".replace("_", $row.Amp); }
		if($addtl.Count -gt 0) {
			$folded = $addtl -join ", ";
			$endStr = $endStr.replace("{addtl}", ", { $folded }");
		} else {
			$endStr = $endStr.replace("{addtl}", "");
		}
		$out.WriteLine($endStr);
		$count++;
	}
	$out.WriteLine("	}");
	$out.Write("}")
	$out.close();
	Write-Host "Converted $count pieces of equipment";
}
if($which.Contains("F")) {
	Write-Host "Converting Details_Fixtures.ods to fixtures.js";
	& "C:\Program Files (x86)\LibreOffice 5\program\soffice.exe" --headless --convert-to csv --outdir ".\temp" "Details_Fixtures.ods" | Out-Null;
	$csv = Import-CSV ".\temp\Details_Fixtures.csv";
	$out = [System.IO.StreamWriter] "$rootpath\js\gamedata\fixtures.js";
	$out.WriteLine(@'
function FixtureDetail(name, displayname, price, shortdesc, desc, displaySprite) {
    this.name = name;
    this.displayname = displayname;
    this.price = price;
    this.shortdesc = shortdesc;
    this.desc = desc;
    if(displaySprite) {
        this.size = 2;
        this.displaySprite = displaySprite;
    }
}
function GetFarmInfo(name) {
    switch(name) {
'@);
	$formatStr = "		case `"{name}`": return new FixtureDetail(name, `"{displayname}`", {price}, `"{shortdesc}`", `"{desc}`"{addtl});";
	$count = 0;
	ForEach($row in $csv) {
		if($row.Crop -eq "" -or $row.Crop -eq "Crop") { continue; }
		if($row.Id -eq "*") {
			$out.WriteLine("		/* _ */".replace("_", $row.Name));
			continue;
		}
		$endStr = $formatStr.replace("{name}", $row.Id).replace("{displayname}", $row.Name).replace("{price}", $row.Price).replace("{shortdesc}", $row.ShortDesc).replace("{desc}", $row.Desc);
		$addtl = @();
		if($row.DisplaySprite) { 
			$endStr = $endStr.replace("{addtl}", ", `"" + $row.DisplaySprite + "`"");
		} else {
			$endStr = $endStr.replace("{addtl}", "");
		}
		$out.WriteLine($endStr);
		$count++;
	}
	$out.WriteLine("	}");
	$out.Write("}")
	$out.close();
	Write-Host "Converted $count fixtures";
}


Remove-Item .\temp -recurse;
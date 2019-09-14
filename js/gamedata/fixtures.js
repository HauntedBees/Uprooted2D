function FixtureDetail(name, price, displaySprite) {
    this.name = name;
	const textname = name.substring(1);
    this.displayname = GetText(textname);
    this.price = price;
    this.shortdesc = GetText(textname + ".sdesc");
    this.desc = GetText(textname + ".ldesc");
    if(displaySprite) {
        this.size = 2;
        this.displaySprite = displaySprite;
    }
}
function GetFarmInfo(name) {
    switch(name) {
		/* 1. Town */
		case "_log": return new FixtureDetail(name, 50);
		case "_coop": return new FixtureDetail(name, 60);
		/* 1. Big Robot */
		case "_modulator": return new FixtureDetail(name, 500, "mod0");
		/* 2. Scientist */
		case "_shooter": return new FixtureDetail(name, 250);
		/* 3. Bridge */
		case "_lake": return new FixtureDetail(name, 150);
		case "_paddy": return new FixtureDetail(name, 150);
		/* 4. Fake Farm */
		case "_cow": return new FixtureDetail(name, 1000, "cow");
		case "_strongsoil": return new FixtureDetail(name, 800);
		case "_hotspot": return new FixtureDetail(name, 420, "hotspot");
		/* 5. South City */
		case "_sprinkler": return new FixtureDetail(name, 1200);
		/* 6. Other */
		case "_beehive": return new FixtureDetail(name, 100);
		case "_charger": return new FixtureDetail(name, 2222, "chargerplaced");
	}
}
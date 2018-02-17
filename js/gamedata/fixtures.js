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
		/* 1. Town */
		case "_log": return new FixtureDetail(name, "Mshrm Log", 100, "Allows Mushrooms to be grown.", "Allows Mushrooms to be grown. Mushrooms regrow after harvest and do not rot when fully grown.");
		case "_coop": return new FixtureDetail(name, "Incubator", 100, "Allows Eggs to be hatched.", "Allows Eggs to be hatched. Hatched eggs do not rot and do more damage the longer they are left on the Field.");
		/* 1. Big Robot */
		case "_modulator": return new FixtureDetail(name, "S. Modulator", 100, "Changes seasons when fed seeds.", "If vegetable seeds are planted in this, it will return the seeds and change the season based on the seed.", "mod0");
		/* 2. Scientist */
		case "_shooter": return new FixtureDetail(name, "Seed Shooter", 100, "Immediately shoots seeds it is fed.", "If seeds are planted in this, it will immediately shoot seeds, damaging all enemies.");
		/* 3. Bridge */
		case "_lake": return new FixtureDetail(name, "Lake", 100, "Allows fishing tools to be placed.", "Allows sea creatures to be caught with appropriate equipment.");
		case "_paddy": return new FixtureDetail(name, "Rice Paddy", 100, "Allows rice to be grown.", "Allows rice and other paddy crops to be grown. Can only be placed on the bottom row of a Field.");
		/* 4. Fake Farm */
		case "_cow": return new FixtureDetail(name, "Cow", 100, "Produces healing Milk when fed.", "Produces healing Milk when fed fodder or vegetable seeds. Milk can be collected by Composting.", "cow");
		case "_strongsoil": return new FixtureDetail(name, "Strong Soil", 100, "Makes crops more resistant to damage.", "Vegetables and trees planted on Strong Soil will take less damage from fire and water damage as well as standard attacks. The soil itself is also more resistant to burning and flooding.");
		case "_hotspot": return new FixtureDetail(name, "Hotspot", 100, "Allows electronics to be placed.", "Allows electronic devices to be 'planted' on the field, which then behave like any other crop.", "hotspot");
		/* 5. South City */
		case "_sprinkler": return new FixtureDetail(name, "Sprinkler", 100, "Makes crops around it grow faster.", "Vegetables and trees planted in the 8 tiles around a sprinkler will grow 25% faster.");
		/* 6. Other */
		case "_beehive": return new FixtureDetail(name, "Beehive", 100, "Holds bees.", "Allows Bees to be placed. Bees will randomly produce honey, which can recover lots of health when compsted or stun enemies when used in an attack.");
		case "_charger": return new FixtureDetail(name, "Sickle2 Charger", 100, "Charges Sickle2.", "This must be present on your Field and regularly filled with Sickle2 Batteries in order to use your Sickle2 effectively. ", "chargerplaced");
	}
}
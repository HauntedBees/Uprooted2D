function GetText(key) {
    var d = fulltext[key];
    if(d[game.language] !== undefined) { return d[game.language]; }
    return d["en-us"];
}
var fulltext = {
	"s_co": {
		"en-us": "Bu-GAWK! Hi boss! Got some good things on sale!", 
		"en-dm": "Bu-GAWK! Hi boss! Got some good seeds on sale! What? You want a discount? Cluck off - a girl's gotta make money somehow!"
	},
	"s_sell": {
		"en-us": "What're you selling?", 
		"en-dm": "WOT'RE YA SELLIN'???"
	},
	"s_eq1o": {
		"en-us": "Welcome to my Equipment Shop! Please, buy many things.", 
		"en-dm": "Hello I am a public domain dwarf and I sell equipment. You can equip it from the Menu, which is probably a good choice."
	},
	"s_leave": {
		"en-us": "Thank you, come again!", 
		"en-dm": "fuck off"
	},
	"s_leave2": {
		"en-us": "Bye.", 
		"en-dm": "bye fucker"
	},
	"s_notenough": {
		"en-us": "You can't afford that...", 
		"en-dm": "Hey fuckface this is a store not charity. Have the money or have a gofuckyourself."
	},
	"s_purchased": {
		"en-us": "Thank you!", 
		"en-dm": "thanks mom"
	},
	"s_up1p": { "en-us": "Excellent! Now you'll have a 4x3 grid of tiles to plant crops and place fixtures on!" }, 
	"s_didsell": {
		"en-us": "Thank you for the goods!", 
		"en-dm": "Thanks for the shit, fucfkace."
	},
	"s_leavesell": {
		"en-us": "Anything else?", 
		"en-dm": "stop giving me THINGS and start giving me MONEY."
	},
	"s_cpurch": {
		"en-us": "Bu-GAW! Thank you for your patronage!", 
		"en-dm": "Bu-GAWK!! Good shit, good shit. Thank you for your patronage!"
	},
	"s_up1o": { "en-us": "Are you tired of only having 9 tiles to plant crops in? Tire no more! For just 2000 coins I can give you three more tiles to plant on!" }, 
	"s_upempty": { "en-us": "Welcome. Unfortunately, I have no other upgrades for you." }, 
	"s_sellseed": { "en-us": "Seeds & Consumables\n Sell your seeds, eggs, and other consumable supplies." }, 
	"s_selltool": { "en-us": "Tools & Equipment\n Sell your equipment, like sickles, gloves, and compost bins." }, 
	"s_sellfixture": { "en-us": "Field Fixtures\n Sell your Fixtures, like chicken coops and mushroom logs." }, 
	"s_fieldI": { "en-us": "This will expand your Combat Field, allowing you to place more Fixtures and plant more Crops during combat." }, 
	"s_fieldO": { "en-us": "This configuration gives room for more large Fixtures and Trees." }, 
	"s_field_": { "en-us": "This configuration gives additional space, but less room for large Fixtures and Trees." }, 
	"s_fi1o": { "en-us": "Welcome to the my Fixture Shop! Here you can buy Fixtures to add to your farm, allowing you to plant and grow more than just your standard fruits and veggies!" }, 
	"quest1": {
		"en-us": "", 
		"en-dm": "oi u fuck"
	},
	"quest1_a": {
		"en-us": "", 
		"en-dm": "A lovable squirrel ran off with some of my mushroom seeds. Bring them back to me and I'll be happy."
	},
	"quest1_b": {
		"en-us": "", 
		"en-dm": "sick thanks. Have a mushroom log."
	},
	"quest1_c": {
		"en-us": "", 
		"en-dm": "yo lass what i NEED is my SHIITAKE MUSHROOM SEEDS. give the fuck."
	},
	"s_seed1": {
		"en-us": "", 
		"en-dm": "hi I got seeds"
	},
	"s_inn1": {
		"en-us": "", 
		"en-dm": "hey hey hey my inn is in... business. It's in business. That's a thing people say. Fuck off."
	},
	"s_innpurch": {
		"en-us": "", 
		"en-dm": "enjoy your sleep"
	},
	"s_mermhello": {
		"en-us": "", 
		"en-dm": "this is a mermaid... hello!!"
	},
	"questM": {
		"en-us": "", 
		"en-dm": "hey there"
	},
	"questM_a": {
		"en-us": "", 
		"en-dm": "there's some sort of creature underwater that keeps moving my construction equipment with relative ease! Please calm it."
	},
	"questM_b": {
		"en-us": "", 
		"en-dm": "gee thanks friend. Now I can build more underwater drills or something. Fuck I duno."
	},
	"questM_c": {
		"en-us": "", 
		"en-dm": "please take care of the sea creature underwater. Just head west of here."
	},
	"constr1_foe": {
		"en-us": "", 
		"en-dm": "gonna fuck you up"
	},
	"constr1_fr1": {
		"en-us": "", 
		"en-dm": "hey there. We under construction, so you can't drive through here."
	},
	"constr1_fr2": {
		"en-us": "", 
		"en-dm": "talk to the boss-man if you got qustions. He on the bridge."
	},
	"sm1": {
		"en-us": "", 
		"en-dm": "hi do you want to help me"
	},
	"sm1c1": {
		"en-us": "", 
		"en-dm": "sure why the fuck"
	},
	"sm1c2": {
		"en-us": "", 
		"en-dm": "eat shit or die trying, poopslut"
	},
	"sm1c3": {
		"en-us": "", 
		"en-dm": "I'll think about it."
	},
	"sm2": {
		"en-us": "", 
		"en-dm": "sick thanks man"
	},
	"sm3": {
		"en-us": "", 
		"en-dm": "you first asshole"
	},
	"sm4": {
		"en-us": "", 
		"en-dm": "hey thanks for helping me out crombro"
	},
	"sm5": {
		"en-us": "", 
		"en-dm": "yeah that's fair"
	},
	"w21": {
		"en-us": "", 
		"en-dm": "get fucked four eyes"
	},
	"w22": {
		"en-us": "", 
		"en-dm": "hi im paul"
	},
	"Pb2_0": {
		"en-us": "", 
		"en-dm": "ha that guy got killed"
	},
	"Pb2_1": {
		"en-us": "", 
		"en-dm": "because I killed him"
	},
	"B2_0": {
		"en-us": "", 
		"en-dm": "Don't interfere with my stuff you baka."
	},
	"B2_1": {
		"en-us": "", 
		"en-dm": "Fuck off."
	},
	"Pb1_0": {
		"en-us": "", 
		"en-dm": "I bet if that robot was still alive it'd be saying \"aw nuts\" right now, ha ha."
	},
	"Pb1_1": {
		"en-us": "", 
		"en-dm": "Get it because it exploded and bolts and NUTS flew everywhere. Is very funny joke :3c"
	},
	"B1_1": {
		"en-us": "", 
		"en-dm": "hI hEllo yEs i aM a tEchnology rObot sEnt tO rEsearch tHis fArm."
	},
	"B1_2": {
		"en-us": "", 
		"en-dm": "aLso bY \"rEsearch\" i mEan \"lOot aNd pIllage.\""
	},
	"B1_3": {
		"en-us": "", 
		"en-dm": "oH sHit tHis iS yOur fArm? fUck. i mEan... uHhhh... wAnt gIrl sCout cOokies?"
	},
	"B1_4": {
		"en-us": "", 
		"en-dm": "..."
	},
	"B1_5": {
		"en-us": "", 
		"en-dm": "...nOt bUying iT? oKay, fIne. lEt's tHrow dOwn."
	},
	"B1_6": {
		"en-us": "", 
		"en-dm": "bAck fOr mOre, aRe yA? hAhaha. i'Ll gLadly dEfeat yOu aGain!"
	},
	"Pb0_0": {
		"en-us": "", 
		"en-dm": "oops I killed a man. i should go kick his boss's ass, too. also his boss's ass,"
	},
	"Pb0_1": {
		"en-us": "", 
		"en-dm": "so on and so forth, all the way up to the top. I should head to my farm first to get supplies."
	},
	"testA": {
		"en-us": "", 
		"en-dm": "it's battle"
	}
};

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
	},
	"beeB": {
		"en-us": "", 
		"en-dm": "Honey bees are dying at an alarming rate, so do what you can to help save the bees! They are very important to our world!"
	},
	"rice": {
		"en-us": "", 
		"en-dm": "A worldwide staple food, rice is often known as \"the Grain of the East\" among people who are getting paid by the word to write flavor text."
	},
	"arborio": {
		"en-us": "", 
		"en-dm": "Firm, yet chewy. This Italian rice is often used in rice pudding and risotto, a creamy dish cooked in broth."
	},
	"blackrice": {
		"en-us": "", 
		"en-dm": "Popular in South Asia, black rice has lots of nutrients and is used as an ingredient in various desserts. Unlike white rice, it is black."
	},
	"spear": {
		"en-us": "", 
		"en-dm": "Spearfishing is one of the oldest methods of fishing. Sometimes just throwing a pointy stick at something is an effective strategy."
	},
	"rod": {
		"en-us": "", 
		"en-dm": "This fishing rod has a worm on the end to tempt fish to approach it. The early fish gets the worm, and the early fisherman gets the early fish!"
	},
	"goodrod": {
		"en-us": "", 
		"en-dm": "Sturdier than the average fishing rod, this rod is capable of catching big fish without snapping in half."
	},
	"metalrod": {
		"en-us": "", 
		"en-dm": "To catch a tough fish, you need a tough fishing rod. This is a tough fishing rod. So stop reading this and go catch some tough fish!"
	},
	"net": {
		"en-us": "", 
		"en-dm": "If you aren't picky, a good way of catching fish is just throwing a net out and settling for whatever gets caught in it. This also works for finding boyfriends."
	},
	"fodder": {
		"en-us": "", 
		"en-dm": "A plant-based feed for livestock like cows. Cows, much like humans, need food to live. Remember to respect your bovine friends!"
	},
	"beet": {
		"en-us": "", 
		"en-dm": "The compound that makes beets so red is not broken down during digestion, so if you eat enough beets, the red might come out the other end!"
	},
	"apple": {
		"en-us": "", 
		"en-dm": "An apple a day keeps the doctor away, but so does a gun."
	},
	"carrot": {
		"en-us": "", 
		"en-dm": "crunchy"
	},
	"leek": {
		"en-us": "", 
		"en-dm": "Why did the farmer call the plumber? Because her field sprung a leek!"
	},
	"lemon": {
		"en-us": "", 
		"en-dm": "When life gives you lemons, make sure you wash any pesticides off of them first because capitalism poisons us all."
	},
	"rhubarb": {
		"en-us": "", 
		"en-dm": "I don't know that much about rhubarb but when I visited some relatives in Wisconsin when I was a kid they loved this shit, so, there's that, I guess."
	},
	"pineapple": {
		"en-us": "", 
		"en-dm": "When life gives you pineapples, eat one every day to keep the pinedoctor away! That's how the old saying goes, right? Thanks."
	},
	"grapes": {
		"en-us": "", 
		"en-dm": "Tasty little purple eggs that you can smack on loudly in the waiting room of your therapist's office to piss off that guy who took your usual parking spot."
	},
	"ginger": {
		"en-us": "", 
		"en-dm": "Ginger stimulates the production of saliva, so if you ever want to drool or spit a lot for reasons I don't want to know about, just crunch on some ginger first."
	},
	"specialgrapes": {
		"en-us": "", 
		"en-dm": "Tasty little purple eggs that you can smack on loudly in the waiting room of your therapist's office to piss off that guy who took your usual parking spot."
	},
	"battery": {
		"en-us": "", 
		"en-dm": "Batteries are like food for technology. They need it to motivate them to go out and do their jobs. Their jobs like powering video game systems and toys."
	},
	"headphones": {
		"en-us": "", 
		"en-dm": "These fancy headphones are wireless, so you'll never have to untangle them! They will, however, burrow into your ears and install apps in your fucking brain."
	},
	"printer": {
		"en-us": "", 
		"en-dm": "This 3D printer is great for turning expensive prosthetics and equipment into affordable DIY projects! Or you can just make fucking action figures."
	},
	"app": {
		"en-us": "", 
		"en-dm": "This app will do more damage the longer you leave it on your field, as it generates more and more notifications. Clear your damn notifications already!"
	},
	"drone": {
		"en-us": "", 
		"en-dm": "This tiny flying machine is bringing you tomorrow's privacy and air traffic problems, today!"
	},
	"frogbot": {
		"en-us": "", 
		"en-dm": "A wind-up toy that resembles a frog. Not every new piece of technology has to shake up the entire industry, okay?!?"
	},
	"coffee": {
		"en-us": "", 
		"en-dm": "This machine can give you a proper cup of coffee with the press of a button! Too hot to drink, but you're too thirsty to wait!"
	},
	"sicklebattery": {
		"en-us": "", 
		"en-dm": "This battery will charge a Sickle2 Proprietary Charger Bay, allowing you to use your Sickle2 Proprietary Sickle-Type Product to its fullest proprietary potential!"
	},
	"egg": {
		"en-us": "", 
		"en-dm": "Over 50 million tons of chicken eggs are laid each year; that's enough for every person in the world to eat around half an egg a day, every day! Statistics are eggciting!"
	},
	"quail": {
		"en-us": "", 
		"en-dm": "Quail eggs are tiny and considered a delicacy in many parts of the world. In the Phillippines, skewered and battered quail eggs are a popular deep-fried treat!"
	},
	"goose": {
		"en-us": "", 
		"en-dm": "Goose eggs are quite a bit bigger than chicken eggs, which makes them good for people who like eating larger versions of common food items!"
	},
	"turkey": {
		"en-us": "", 
		"en-dm": "Turkeys lay eggs much less frequently than chickens, and it takes them much longer to start laying. This is why chickens beat turkeys in the Great Egg Race."
	},
	"platypus": {
		"en-us": "", 
		"en-dm": "Only two mammals lay eggs: platypi and echidnas. Baby platypi are referred to as \"puggles,\" because ha ha ha ha of course they are that shit's hilarious."
	},
	"shiitake": {
		"en-us": "", 
		"en-dm": "Native to East Asia, these mushrooms have been eaten since at least the 13th century. They are a common ingredient in miso soup."
	},
	"milkcap": {
		"en-us": "", 
		"en-dm": "When cut or bruised, the caps of these mushrooms release a white latex which gives them their name. For the same reason, humans are often called bloodfaces."
	},
	"portobello": {
		"en-us": "", 
		"en-dm": "There is no consensus as to where its name came from, so here's my theory: Megan \"Port\" Obello discovered them in her backyard. You can't prove I'm wrong!"
	},
	"greenshroom": {
		"en-us": "", 
		"en-dm": "It is covered in a sticky substance, but you can probably still eat them! Just don't eat too many at once unless you want some Tummy Troubles."
	},
	"blackshroom": {
		"en-us": "", 
		"en-dm": "Nobody knows how this mushroom got its distinctive black color, but one thing is for certain: this is absolutely a mushroom that is black and can be thrown at enemies!"
	},
	"poisnshroom": {
		"en-us": "", 
		"en-dm": "Some mushrooms are good for you, while others will rapidly kill you. This is why it's a good idea to get your mushrooms from a store and not from your basement."
	},
	"beeR": {
		"en-us": "", 
		"en-dm": "Africanized bees are what happens when mankind tries to play God. While their stings are no different from other honey bees, killer bees are much more defensive."
	},
	"beeG": {
		"en-us": "", 
		"en-dm": "These bees still have stingers, but they are too tiny to be used for stinging. They still have powerful mandibles, though, so their bites can really... sting!"
	},
	"hbee": {
		"en-us": "", 
		"en-dm": "A BEEEE!!"
	},
	"bignet": {
		"en-us": "", 
		"en-dm": "This net can catch much larger fish than a smaller net. It can also catch more fish than a smaller net. Pretty amazing."
	},
	"shortgrain": {
		"en-us": "", 
		"en-dm": "Short-grain rice is often used for rice pudding, a tasty treat that's fun to eat! It rhymes, so it has to be true."
	},
	"chestnut": {
		"en-us": "", 
		"en-dm": "The Chinese water chestnut is a grass-like vegetable with delicious starchy corms. Yep, that's what the edible part is called. The corm."
	},
	"opGameOps": {
		"en-us": "", 
		"en-dm": "Accessibility"
	},
	"opDifficulty": {
		"en-us": "", 
		"en-dm": "Difficulty"
	},
	"diffEasy": {
		"en-us": "", 
		"en-dm": "Easy"
	},
	"diffNormal": {
		"en-us": "", 
		"en-dm": "Normal"
	},
	"diffHard": {
		"en-us": "", 
		"en-dm": "US GAMERS!"
	},
	"opControls": {
		"en-us": "", 
		"en-dm": "Controls"
	},
	"opGameplay": {
		"en-us": "", 
		"en-dm": "Gameplay"
	},
	"opOff": {
		"en-us": "", 
		"en-dm": "Off"
	},
	"opAudio": {
		"en-us": "", 
		"en-dm": "Audio"
	},
	"opGraphics": {
		"en-us": "", 
		"en-dm": "Graphics"
	},
	"opMusic": {
		"en-us": "", 
		"en-dm": "Music"
	},
	"opSound": {
		"en-us": "", 
		"en-dm": "Sound"
	},
	"diffEasy_i": {
		"en-us": "", 
		"en-dm": "You cannot die in combat. Enemies have less health. Items are cheaper."
	},
	"diffNormal_i": {
		"en-us": "", 
		"en-dm": "Everything is balanced for a fair and enjoyable experience for most players."
	},
	"diffHard_i": {
		"en-us": "", 
		"en-dm": "Seeds are much harder to come by. Enemies are JERKS. The RNG is meaner."
	},
	"ctrlUp": {
		"en-us": "", 
		"en-dm": "Up"
	},
	"ctrlDown": {
		"en-us": "", 
		"en-dm": "Down"
	},
	"ctrlLeft": {
		"en-us": "", 
		"en-dm": "Left"
	},
	"ctrlRight": {
		"en-us": "", 
		"en-dm": "Right"
	},
	"ctrlConfirm": {
		"en-us": "", 
		"en-dm": "Confirm"
	},
	"ctrlCancel": {
		"en-us": "", 
		"en-dm": "Cancel"
	},
	"ctrlPause": {
		"en-us": "", 
		"en-dm": "Pause"
	},
	"opOn": {
		"en-us": "", 
		"en-dm": "On"
	},
	"opPlacehold": {
		"en-us": "", 
		"en-dm": "Placeholder"
	},
	"opSaveQuit": {
		"en-us": "", 
		"en-dm": "Save and Return to Title"
	},
	"opQuit": {
		"en-us": "", 
		"en-dm": "Return without Saving"
	}
};
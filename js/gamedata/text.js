function GetText(key) {
	var lang = (game !== undefined) ? game.language : "en-dm";
    var d = fulltext[key];
    if(d[lang] !== undefined) { return d[lang]; }
    return d["en-us"];
}
function HasText(key) { return fulltext[key] !== undefined; }
var fulltext = {
	"s_co": {
		"en-us": "Bu-GAWK! Hi boss! Got some good things on sale!", 
		"en-dm": "Bu-GAWK! Hi boss! Got some good seeds on sale! What? You want a discount? Cluck off - a girl's gotta make money somehow!", 
		"type": "shop"
	},
	"s_sell": {
		"en-us": "What're you selling?", 
		"en-dm": "WOT'RE YA SELLIN'???", 
		"type": "shop"
	},
	"s_eq1o": {
		"en-us": "Welcome to my Equipment Shop! Please, buy many things.", 
		"en-dm": "Hello I am a public domain dwarf and I sell equipment. You can equip it from the Menu, which is probably a good choice.", 
		"type": "shop"
	},
	"s_leave": {
		"en-us": "Thank you, come again!", 
		"en-dm": "fuck off", 
		"type": "shop"
	},
	"s_leave2": {
		"en-us": "Bye.", 
		"en-dm": "bye fucker", 
		"type": "shop"
	},
	"s_notenough": {
		"en-us": "You can't afford that...", 
		"en-dm": "Hey fuckface this is a store not charity. Have the money or have a gofuckyourself.", 
		"type": "shop"
	},
	"s_purchased": {
		"en-us": "Thank you!", 
		"en-dm": "thanks mom", 
		"type": "shop"
	},
	"s_up1p": { "en-us": "Excellent! Now you'll have a 4x3 grid of tiles to plant crops and place fixtures on!" }, 
	"s_didsell": {
		"en-us": "Thank you for the goods!", 
		"en-dm": "Thanks for the shit, fucfkace.", 
		"type": "shop"
	},
	"s_leavesell": {
		"en-us": "Anything else?", 
		"en-dm": "stop giving me THINGS and start giving me MONEY.", 
		"type": "shop"
	},
	"s_cpurch": {
		"en-us": "Bu-GAW! Thank you for your patronage!", 
		"en-dm": "Bu-GAWK!! Good shit, good shit. Thank you for your patronage!", 
		"type": "shop"
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
		"en-dm": "oi u fuck", 
		"type": "shop"
	},
	"quest1_a": {
		"en-us": "", 
		"en-dm": "I heard pray tell quite right what-ho rumors eh wot yes quite that there's a golden mushroom in the forest west of here. Find it for me, and there'll be something in it for you!", 
		"type": "shop"
	},
	"quest1_b": {
		"en-us": "", 
		"en-dm": "sick thanks. Have a mushroom log.", 
		"type": "shop"
	},
	"quest1_c": {
		"en-us": "", 
		"en-dm": "are you daft, lass? Golden mushroom. Forest. West of here. Hop it to it. it.", 
		"type": "shop"
	},
	"s_seed1": {
		"en-us": "", 
		"en-dm": "hi I got seeds", 
		"type": "shop"
	},
	"s_inn1": {
		"en-us": "", 
		"en-dm": "hey hey hey my inn is in... business. It's in business. That's a thing people say. Fuck off.", 
		"type": "shop"
	},
	"s_innpurch": {
		"en-us": "", 
		"en-dm": "enjoy your sleep", 
		"type": "shop"
	},
	"s_mermhello": {
		"en-us": "", 
		"en-dm": "this is a mermaid... hello!!", 
		"type": "shop"
	},
	"questM": {
		"en-us": "", 
		"en-dm": "hey there", 
		"type": "map"
	},
	"questM_a": {
		"en-us": "", 
		"en-dm": "there's some sort of creature underwater that keeps moving my construction equipment with relative ease! Please calm it.", 
		"type": "map"
	},
	"questM_b": {
		"en-us": "", 
		"en-dm": "gee thanks friend. Now I can build more underwater drills or something. Fuck I duno.", 
		"type": "map"
	},
	"questM_c": {
		"en-us": "", 
		"en-dm": "please take care of the sea creature underwater. Just head west of here.", 
		"type": "map"
	},
	"constr1_foe": {
		"en-us": "", 
		"en-dm": "gonna fuck you up", 
		"type": "map"
	},
	"constr1_fr1": {
		"en-us": "", 
		"en-dm": "hey there. We under construction, so you can't drive through here.", 
		"type": "map"
	},
	"constr1_fr2": {
		"en-us": "", 
		"en-dm": "talk to the boss-man if you got qustions. He on the bridge.", 
		"type": "map"
	},
	"sm1": {
		"en-us": "", 
		"en-dm": "hi do you want to help me", 
		"type": "map"
	},
	"sm1c1": {
		"en-us": "", 
		"en-dm": "sure why the fuck", 
		"type": "choice"
	},
	"sm1c2": {
		"en-us": "", 
		"en-dm": "eat shit or die trying, poopslut", 
		"type": "choice"
	},
	"sm1c3": {
		"en-us": "", 
		"en-dm": "I'll think about it.", 
		"type": "choice"
	},
	"sm2": {
		"en-us": "", 
		"en-dm": "sick thanks man", 
		"type": "map"
	},
	"sm3": {
		"en-us": "", 
		"en-dm": "you first asshole", 
		"type": "map"
	},
	"sm4": {
		"en-us": "", 
		"en-dm": "hey thanks for helping me out crombro", 
		"type": "map"
	},
	"sm5": {
		"en-us": "", 
		"en-dm": "yeah that's fair", 
		"type": "map"
	},
	"w21": {
		"en-us": "", 
		"en-dm": "get fucked four eyes", 
		"type": "map"
	},
	"w22": {
		"en-us": "", 
		"en-dm": "hi im paul", 
		"type": "map"
	},
	"Pb2_0": {
		"en-us": "", 
		"en-dm": "ha that guy got killed", 
		"type": "map"
	},
	"Pb2_1": {
		"en-us": "", 
		"en-dm": "because I killed him", 
		"type": "map"
	},
	"B2_0": {
		"en-us": "", 
		"en-dm": "Don't interfere with my stuff you baka.", 
		"type": "map"
	},
	"B2_1": {
		"en-us": "", 
		"en-dm": "Fuck off.", 
		"type": "map"
	},
	"Pb1_0": {
		"en-us": "", 
		"en-dm": "I bet if that robot was still alive it'd be saying \"aw nuts\" right now, ha ha.", 
		"type": "map"
	},
	"Pb1_1": {
		"en-us": "", 
		"en-dm": "Get it because it exploded and bolts and NUTS flew everywhere. Is very funny joke :3c", 
		"type": "map"
	},
	"Pb1_2": {
		"en-us": "", 
		"en-dm": "Either way, he said he came from a research plant down south. I should check that out.", 
		"type": "map"
	},
	"B1_1": {
		"en-us": "", 
		"en-dm": "hI hEllo yEs i aM a tEchnology rObot sEnt tO rEsearch tHis fArm.", 
		"type": "map"
	},
	"B1_2": {
		"en-us": "", 
		"en-dm": "aLso bY \"rEsearch\" i mEan \"lOot aNd pIllage.\"", 
		"type": "map"
	},
	"B1_3": {
		"en-us": "", 
		"en-dm": "oH sHit tHis iS yOur fArm? fUck. i mEan... uHhhh... wAnt gIrl sCout cOokies?", 
		"type": "map"
	},
	"B1_4": {
		"en-us": "", 
		"en-dm": "...", 
		"type": "map"
	},
	"B1_5": {
		"en-us": "", 
		"en-dm": "...nOt bUying iT? oKay, fIne. lEt's tHrow dOwn.", 
		"type": "map"
	},
	"B1_6": {
		"en-us": "", 
		"en-dm": "bAck fOr mOre, aRe yA? hAhaha. i'Ll gLadly dEfeat yOu aGain!", 
		"type": "map"
	},
	"Pb0_0": {
		"en-us": "", 
		"en-dm": "That was a weird situation. I wonder why that guy sucked so much.", 
		"type": "map"
	},
	"Pb0_1": {
		"en-us": "", 
		"en-dm": "Oh well, I should probably head back to my farm now.", 
		"type": "map"
	},
	"testA": {
		"en-us": "", 
		"en-dm": "it's battle", 
		"type": "map"
	},
	"beeB": {
		"en-us": "", 
		"en-dm": "Honey bees are dying at an alarming rate, so do what you can to help save the bees! They are very important to our world!", 
		"type": "item"
	},
	"rice": {
		"en-us": "", 
		"en-dm": "A worldwide staple food, rice is often known as \"the Grain of the East\" among people who are getting paid by the word to write flavor text.", 
		"type": "item"
	},
	"arborio": {
		"en-us": "", 
		"en-dm": "Firm, yet chewy. This Italian rice is often used in rice pudding and risotto, a creamy dish cooked in broth.", 
		"type": "item"
	},
	"blackrice": {
		"en-us": "", 
		"en-dm": "Popular in South Asia, black rice has lots of nutrients and is used as an ingredient in various desserts. Unlike white rice, it is black.", 
		"type": "item"
	},
	"spear": {
		"en-us": "", 
		"en-dm": "Spearfishing is one of the oldest methods of fishing. Sometimes just throwing a pointy stick at something is an effective strategy.", 
		"type": "item"
	},
	"rod": {
		"en-us": "", 
		"en-dm": "This fishing rod has a worm on the end to tempt fish to approach it. The early fish gets the worm, and the early fisherman gets the early fish!", 
		"type": "item"
	},
	"goodrod": {
		"en-us": "", 
		"en-dm": "Sturdier than the average fishing rod, this rod is capable of catching big fish without snapping in half.", 
		"type": "item"
	},
	"metalrod": {
		"en-us": "", 
		"en-dm": "To catch a tough fish, you need a tough fishing rod. This is a tough fishing rod. So stop reading this and go catch some tough fish!", 
		"type": "item"
	},
	"net": {
		"en-us": "", 
		"en-dm": "If you aren't picky, a good way of catching fish is just throwing a net out and settling for whatever gets caught in it. This also works for finding boyfriends.", 
		"type": "item"
	},
	"fodder": {
		"en-us": "", 
		"en-dm": "A plant-based feed for livestock like cows. Cows, much like humans, need food to live. Remember to respect your bovine friends!", 
		"type": "item"
	},
	"beet": {
		"en-us": "", 
		"en-dm": "The compound that makes beets so red is not broken down during digestion, so if you eat enough beets, the red might come out the other end!", 
		"type": "item"
	},
	"apple": {
		"en-us": "", 
		"en-dm": "An apple a day keeps the doctor away, but so does a gun.", 
		"type": "item"
	},
	"carrot": {
		"en-us": "", 
		"en-dm": "crunchy", 
		"type": "item"
	},
	"leek": {
		"en-us": "", 
		"en-dm": "Why did the farmer call the plumber? Because her field sprung a leek!", 
		"type": "item"
	},
	"lemon": {
		"en-us": "", 
		"en-dm": "When life gives you lemons, make sure you wash any pesticides off of them first because capitalism poisons us all.", 
		"type": "item"
	},
	"rhubarb": {
		"en-us": "", 
		"en-dm": "I don't know that much about rhubarb but when I visited some relatives in Wisconsin when I was a kid they loved this shit, so, there's that, I guess.", 
		"type": "item"
	},
	"pineapple": {
		"en-us": "", 
		"en-dm": "When life gives you pineapples, eat one every day to keep the pinedoctor away! That's how the old saying goes, right? Thanks.", 
		"type": "item"
	},
	"grapes": {
		"en-us": "", 
		"en-dm": "Tasty little purple eggs that you can smack on loudly in the waiting room of your therapist's office to piss off that guy who took your usual parking spot.", 
		"type": "item"
	},
	"ginger": {
		"en-us": "", 
		"en-dm": "Ginger stimulates the production of saliva, so if you ever want to drool or spit a lot for reasons I don't want to know about, just crunch on some ginger first.", 
		"type": "item"
	},
	"specialgrapes": {
		"en-us": "", 
		"en-dm": "Tasty little purple eggs that you can smack on loudly in the waiting room of your therapist's office to piss off that guy who took your usual parking spot.", 
		"type": "item"
	},
	"battery": {
		"en-us": "", 
		"en-dm": "Batteries are like food for technology. They need it to motivate them to go out and do their jobs. Their jobs like powering video game systems and toys.", 
		"type": "item"
	},
	"headphones": {
		"en-us": "", 
		"en-dm": "These fancy headphones are wireless, so you'll never have to untangle them! They will, however, burrow into your ears and install apps in your fucking brain.", 
		"type": "item"
	},
	"printer": {
		"en-us": "", 
		"en-dm": "This 3D printer is great for turning expensive prosthetics and equipment into affordable DIY projects! Or you can just make fucking action figures.", 
		"type": "item"
	},
	"app": {
		"en-us": "", 
		"en-dm": "This app will do more damage the longer you leave it on your field, as it generates more and more notifications. Clear your damn notifications already!", 
		"type": "item"
	},
	"drone": {
		"en-us": "", 
		"en-dm": "This tiny flying machine is bringing you tomorrow's privacy and air traffic problems, today!", 
		"type": "item"
	},
	"frogbot": {
		"en-us": "", 
		"en-dm": "A wind-up toy that resembles a frog. Not every new piece of technology has to shake up the entire industry, okay?!?", 
		"type": "item"
	},
	"coffee": {
		"en-us": "", 
		"en-dm": "This machine can give you a proper cup of coffee with the press of a button! Too hot to drink, but you're too thirsty to wait!", 
		"type": "item"
	},
	"sicklebattery": {
		"en-us": "", 
		"en-dm": "This battery will charge a Sickle2 Proprietary Charger Bay, allowing you to use your Sickle2 Proprietary Sickle-Type Product to its fullest proprietary potential!", 
		"type": "item"
	},
	"egg": {
		"en-us": "", 
		"en-dm": "Over 50 million tons of chicken eggs are laid each year; that's enough for every person in the world to eat around half an egg a day, every day! Statistics are eggciting!", 
		"type": "item"
	},
	"quail": {
		"en-us": "", 
		"en-dm": "Quail eggs are tiny and considered a delicacy in many parts of the world. In the Phillippines, skewered and battered quail eggs are a popular deep-fried treat!", 
		"type": "item"
	},
	"goose": {
		"en-us": "", 
		"en-dm": "Goose eggs are quite a bit bigger than chicken eggs, which makes them good for people who like eating larger versions of common food items!", 
		"type": "item"
	},
	"turkey": {
		"en-us": "", 
		"en-dm": "Turkeys lay eggs much less frequently than chickens, and it takes them much longer to start laying. This is why chickens beat turkeys in the Great Egg Race.", 
		"type": "item"
	},
	"platypus": {
		"en-us": "", 
		"en-dm": "Only two mammals lay eggs: platypi and echidnas. Baby platypi are referred to as \"puggles,\" because ha ha ha ha of course they are that shit's hilarious.", 
		"type": "item"
	},
	"shiitake": {
		"en-us": "", 
		"en-dm": "Native to East Asia, these mushrooms have been eaten since at least the 13th century. They are a common ingredient in miso soup.", 
		"type": "item"
	},
	"milkcap": {
		"en-us": "", 
		"en-dm": "When cut or bruised, the caps of these mushrooms release a white latex which gives them their name. For the same reason, humans are often called bloodfaces.", 
		"type": "item"
	},
	"portobello": {
		"en-us": "", 
		"en-dm": "There is no consensus as to where its name came from, so here's my theory: Megan \"Port\" Obello discovered them in her backyard. You can't prove I'm wrong!", 
		"type": "item"
	},
	"greenshroom": {
		"en-us": "", 
		"en-dm": "It is covered in a sticky substance, but you can probably still eat them! Just don't eat too many at once unless you want some Tummy Troubles.", 
		"type": "item"
	},
	"blackshroom": {
		"en-us": "", 
		"en-dm": "Nobody knows how this mushroom got its distinctive black color, but one thing is for certain: this is absolutely a mushroom that is black and can be thrown at enemies!", 
		"type": "item"
	},
	"poisnshroom": {
		"en-us": "", 
		"en-dm": "Some mushrooms are good for you, while others will rapidly kill you. This is why it's a good idea to get your mushrooms from a store and not from your basement.", 
		"type": "item"
	},
	"beeR": {
		"en-us": "", 
		"en-dm": "Africanized bees are what happens when mankind tries to play God. While their stings are no different from other honey bees, killer bees are much more defensive.", 
		"type": "item"
	},
	"beeG": {
		"en-us": "", 
		"en-dm": "These bees still have stingers, but they are too tiny to be used for stinging. They still have powerful mandibles, though, so their bites can really... sting!", 
		"type": "item"
	},
	"hbee": {
		"en-us": "", 
		"en-dm": "A BEEEE!!", 
		"type": "item"
	},
	"bignet": {
		"en-us": "", 
		"en-dm": "This net can catch much larger fish than a smaller net. It can also catch more fish than a smaller net. Pretty amazing.", 
		"type": "item"
	},
	"shortgrain": {
		"en-us": "", 
		"en-dm": "Short-grain rice is often used for rice pudding, a tasty treat that's fun to eat! It rhymes, so it has to be true.", 
		"type": "item"
	},
	"chestnut": {
		"en-us": "", 
		"en-dm": "The Chinese water chestnut is a grass-like vegetable with delicious starchy corms. Yep, that's what the edible part is called. The corm.", 
		"type": "item"
	},
	"opGameOps": {
		"en-us": "", 
		"en-dm": "Accessibility", 
		"type": "opts"
	},
	"opDifficulty": {
		"en-us": "", 
		"en-dm": "Difficulty", 
		"type": "opts"
	},
	"diffEasy": {
		"en-us": "", 
		"en-dm": "Easy", 
		"type": "opts"
	},
	"diffNormal": {
		"en-us": "", 
		"en-dm": "Normal", 
		"type": "opts"
	},
	"diffHard": {
		"en-us": "", 
		"en-dm": "US GAMERS!", 
		"type": "opts"
	},
	"opControls": {
		"en-us": "", 
		"en-dm": "Controls", 
		"type": "opts"
	},
	"opGameplay": {
		"en-us": "", 
		"en-dm": "Gameplay", 
		"type": "opts"
	},
	"opOff": {
		"en-us": "", 
		"en-dm": "Off", 
		"type": "opts"
	},
	"opAudio": {
		"en-us": "", 
		"en-dm": "Audio", 
		"type": "opts"
	},
	"opGraphics": {
		"en-us": "", 
		"en-dm": "Graphics", 
		"type": "opts"
	},
	"opMusic": {
		"en-us": "", 
		"en-dm": "Music", 
		"type": "opts"
	},
	"opSound": {
		"en-us": "", 
		"en-dm": "Sound", 
		"type": "opts"
	},
	"diffEasy_i": {
		"en-us": "", 
		"en-dm": "You cannot die in combat. Enemies have less health. Items are cheaper.", 
		"type": "opts"
	},
	"diffNormal_i": {
		"en-us": "", 
		"en-dm": "Everything is balanced for a fair and enjoyable experience for most players.", 
		"type": "opts"
	},
	"diffHard_i": {
		"en-us": "", 
		"en-dm": "Seeds are much harder to come by. Enemies are JERKS. The RNG is meaner.", 
		"type": "opts"
	},
	"ctrlUp": {
		"en-us": "", 
		"en-dm": "Up", 
		"type": "opts"
	},
	"ctrlDown": {
		"en-us": "", 
		"en-dm": "Down", 
		"type": "opts"
	},
	"ctrlLeft": {
		"en-us": "", 
		"en-dm": "Left", 
		"type": "opts"
	},
	"ctrlRight": {
		"en-us": "", 
		"en-dm": "Right", 
		"type": "opts"
	},
	"ctrlConfirm": {
		"en-us": "", 
		"en-dm": "Confirm", 
		"type": "opts"
	},
	"ctrlCancel": {
		"en-us": "", 
		"en-dm": "Cancel", 
		"type": "opts"
	},
	"ctrlPause": {
		"en-us": "", 
		"en-dm": "Pause", 
		"type": "opts"
	},
	"opOn": {
		"en-us": "", 
		"en-dm": "On", 
		"type": "opts"
	},
	"opPlacehold": {
		"en-us": "", 
		"en-dm": "Placeholder", 
		"type": "opts"
	},
	"opSaveQuit": {
		"en-us": "", 
		"en-dm": "Save and Return", 
		"type": "opts"
	},
	"opQuit": {
		"en-us": "", 
		"en-dm": "Return without Saving", 
		"type": "opts"
	},
	"intro1": {
		"en-us": "", 
		"en-dm": "???: This must be the place!", 
		"type": "map"
	},
	"intro2": {
		"en-us": "", 
		"en-dm": "???: Hello there, are you the owner of this farm? You are? Excellent!", 
		"type": "map"
	},
	"intro3": {
		"en-us": "", 
		"en-dm": "???: My name is Nathan! I'm an apprentice farmer! Do you need an intern?", 
		"type": "map"
	},
	"intro4": {
		"en-us": "", 
		"en-dm": "Nathan: Now hold on a second! I can be a valuable asset to your farm!", 
		"type": "map"
	},
	"intro5": {
		"en-us": "", 
		"en-dm": "Nathan: You're running your produce stand today, right? I can go advertise for it!", 
		"type": "map"
	},
	"intro6": {
		"en-us": "", 
		"en-dm": "Nathan: Or I can run some errands for you while you're busy with that! Come on, what's something you need to get done today?", 
		"type": "map"
	},
	"intro7": {
		"en-us": "", 
		"en-dm": "Nathan: You need some seeds, do you? Well, I know a great bulk supplier! I'll go get them and bring them to you at the market!", 
		"type": "map"
	},
	"intro8": {
		"en-us": "", 
		"en-dm": "Nathan: Be back soon! I won't disappoint you!", 
		"type": "map"
	},
	"intro9": {
		"en-us": "", 
		"en-dm": "???: Ah! This must be it! The famous produce stand!", 
		"type": "map"
	},
	"intro10": {
		"en-us": "", 
		"en-dm": "???: The guys back at the office were right -- all of this looks amazing!", 
		"type": "map"
	},
	"intro11": {
		"en-us": "", 
		"en-dm": "???: This carrot looks so nutritious!", 
		"type": "map"
	},
	"intro12": {
		"en-us": "", 
		"en-dm": "???: ...", 
		"type": "map"
	},
	"intro13": {
		"en-us": "", 
		"en-dm": "???: And it looks like this analysis confirms that it is!", 
		"type": "map"
	},
	"intro14": {
		"en-us": "", 
		"en-dm": "???: Hm?", 
		"type": "map"
	},
	"intro15": {
		"en-us": "", 
		"en-dm": "???: Oh. You're probably wondering what that was all about.", 
		"type": "map"
	},
	"intro16": {
		"en-us": "", 
		"en-dm": "???: I'm Beckett. The startup I work for is going to use this carrot data to help us create PROPRIETARY FOOD SUBSTITUTES.", 
		"type": "map"
	},
	"intro17": {
		"en-us": "", 
		"en-dm": "Beckett: The world will be so much better when people don't have to worry about what to eat!", 
		"type": "map"
	},
	"intro18": {
		"en-us": "", 
		"en-dm": "Beckett: But for that to work, we also need to make sure Food2 has no competition...", 
		"type": "map"
	},
	"intro19": {
		"en-us": "", 
		"en-dm": "Beckett: So, I'd like to make you an offer. Ten million coins to retire and never farm again.", 
		"type": "map"
	},
	"intro20": {
		"en-us": "", 
		"en-dm": "Beckett: ...", 
		"type": "map"
	},
	"intro21": {
		"en-us": "", 
		"en-dm": "Beckett: No? Hmm, I thought you'd be convinced by that amazing sales pitch...", 
		"type": "map"
	},
	"intro22": {
		"en-us": "", 
		"en-dm": "Beckett: Well, I have things I need to do, so I'll let this Convince-a-tron change your mind! Give me a call when you're ready to accept our offer!", 
		"type": "map"
	},
	"intro23": {
		"en-us": "", 
		"en-dm": "Convince-a-tron: Hello! Allow me to play the devil's advocate for a moment... what if that thing you don't want to do is actually a good thing?", 
		"type": "map"
	},
	"tut0": {
		"en-us": "", 
		"en-dm": "Oh shit, it's a throwdown! To start things off, select 'Plant' from the menu below!", 
		"type": "tut"
	},
	"tut1": {
		"en-us": "", 
		"en-dm": "Sick. Sick. You did it. Now select the Beet Seeds! Trust me, it's gonna be good.", 
		"type": "tut"
	},
	"tut2": {
		"en-us": "", 
		"en-dm": "Next step is planting those Seeds on your Field. Plant them wherever you want!", 
		"type": "tut"
	},
	"tut3": {
		"en-us": "", 
		"en-dm": "Good job! You Planted a Beet! When something is Planted on your Field, you generally have to wait several turns for it to grow. Now it's the enemy's turn, so just advance when ready.", 
		"type": "tut"
	},
	"tut4": {
		"en-us": "", 
		"en-dm": "Your Beet is Ripe! You can now Attack with it. Select 'Attack' from the menu!", 
		"type": "tut"
	},
	"tut5": {
		"en-us": "", 
		"en-dm": "When you select 'Attack', any Ripe Crops on your Field will be harvested and launched at your opponent!", 
		"type": "tut"
	},
	"tut6": {
		"en-us": "", 
		"en-dm": "Enemy's turn again. It wouldn't be fair if you were the only one who could do anything... :(", 
		"type": "tut"
	},
	"tut7": {
		"en-us": "", 
		"en-dm": "Alright! Now time to Plant some more Seeds! Select 'Plant' again.", 
		"type": "tut"
	},
	"tut8": {
		"en-us": "", 
		"en-dm": "This time we're gonna plant a tree! Select the Grape+ Seeds.", 
		"type": "tut"
	},
	"tut9": {
		"en-us": "", 
		"en-dm": "Trees are big, so they take up more space on your Field! Plant the tree!", 
		"type": "tut"
	},
	"tut10": {
		"en-us": "", 
		"en-dm": "Looks like that tree will take four turns to grow. We can wait it out!", 
		"type": "tut"
	},
	"tut11": {
		"en-us": "", 
		"en-dm": "While we're waiting, let's try Attacking again. Select 'Attack' from the menu.", 
		"type": "tut"
	},
	"tut12": {
		"en-us": "", 
		"en-dm": "You can still Attack with no Ripe Crops available, but it isn't going to be as effective.", 
		"type": "tut"
	},
	"tut13": {
		"en-us": "", 
		"en-dm": "Now we're going to try something a little more interesting...", 
		"type": "tut"
	},
	"tut14": {
		"en-us": "", 
		"en-dm": "Select 'Plant' from the menu.", 
		"type": "tut"
	},
	"tut15": {
		"en-us": "", 
		"en-dm": "Now select the Carrot Seeds. Notice the Time carrots take to grow... and how many turns your Grape Tree has left.", 
		"type": "tut"
	},
	"tut16": {
		"en-us": "", 
		"en-dm": "Plant those Carrots!", 
		"type": "tut"
	},
	"tut17": {
		"en-us": "", 
		"en-dm": "This dumb son-of-a-fuck doesn't know how just how screwed they are.", 
		"type": "tut"
	},
	"tut18": {
		"en-us": "", 
		"en-dm": "One more time now, select 'Plant'!", 
		"type": "tut"
	},
	"tut19": {
		"en-us": "", 
		"en-dm": "Now select those Beet Seeds!", 
		"type": "tut"
	},
	"tut20": {
		"en-us": "", 
		"en-dm": "Plant those Beet Seeds!", 
		"type": "tut"
	},
	"tut21": {
		"en-us": "", 
		"en-dm": "Do you see where this is going?", 
		"type": "tut"
	},
	"tut22": {
		"en-us": "", 
		"en-dm": "Everything's ready! THROW SOME FOOD AT THAT FUCKER!!", 
		"type": "tut"
	},
	"tut23": {
		"en-us": "", 
		"en-dm": "Fucking ZING! Ha ha ha, that shit is hilarious. Fuck that guy.", 
		"type": "tut"
	},
	"tut24": {
		"en-us": "", 
		"en-dm": "Damn. That didn't kill him.", 
		"type": "tut"
	},
	"tut25": {
		"en-us": "", 
		"en-dm": "Uhhh. Oh yeah, you can take damage too. Maybe select 'Plant'.", 
		"type": "tut"
	},
	"tut26": {
		"en-us": "", 
		"en-dm": "Truust me on this one, but it's time to plant some Beet Seeds.", 
		"type": "tut"
	},
	"tut27": {
		"en-us": "", 
		"en-dm": "Just drop 'em anywhere.", 
		"type": "tut"
	},
	"tut28": {
		"en-us": "", 
		"en-dm": "Alright so you're gonna have to trust me on this one, okay?", 
		"type": "tut"
	},
	"tut29": {
		"en-us": "", 
		"en-dm": "Okay... do NOT attack with this Ripe Beet. Select 'Plant' again.", 
		"type": "tut"
	},
	"tut30": {
		"en-us": "", 
		"en-dm": "Just pick something.", 
		"type": "tut"
	},
	"tut31": {
		"en-us": "", 
		"en-dm": "Plant it.", 
		"type": "tut"
	},
	"tut32": {
		"en-us": "", 
		"en-dm": "Alright, now it's time.", 
		"type": "tut"
	},
	"tut33": {
		"en-us": "", 
		"en-dm": "Select 'Compost' from the menu.", 
		"type": "tut"
	},
	"tut34": {
		"en-us": "", 
		"en-dm": "Now select your Rotten Beet.", 
		"type": "tut"
	},
	"tut35": {
		"en-us": "", 
		"en-dm": "Cool cool, coolcoolcool. Now select HEAL.", 
		"type": "tut"
	},
	"tut36": {
		"en-us": "", 
		"en-dm": "Bam. You can Compost Rotten Crops to recover health. Crops Rot when they age after becoming Ripe. Trees don't Rot, but their Ripe Fruit will fall off and they'll have to regrow.", 
		"type": "tut"
	},
	"tut37": {
		"en-us": "", 
		"en-dm": "With the right Compost Bin you can even Compost Crops that aren't Rotten... or Attack enemies with your compost!", 
		"type": "tut"
	},
	"tut38": {
		"en-us": "", 
		"en-dm": "Now let's FINISH THIS FUTHER MUCKER OFF. You're on your own now, kid!", 
		"type": "tut"
	},
	"tut999": {
		"en-us": "", 
		"en-dm": "If you don't want to do the tutorial, you can run away to ignore this dumb robot! But if you get confused later you can come back and learn!", 
		"type": "tut"
	},
	"wantTut": {
		"en-us": "", 
		"en-dm": "Greetings, would you like to play through the tutorial?", 
		"type": "map"
	},
	"sYes": {
		"en-us": "", 
		"en-dm": "Yes.", 
		"type": "choice"
	},
	"sNo": {
		"en-us": "", 
		"en-dm": "No.", 
		"type": "choice"
	},
	"noTut": {
		"en-us": "", 
		"en-dm": "Okie-dokie!", 
		"type": "map"
	},
	"finTut": {
		"en-us": "", 
		"en-dm": "Congratulations on Tutorialing!", 
		"type": "map"
	},
	"quitTut": {
		"en-us": "", 
		"en-dm": "Don't want to Tutorial after all? Whatevs. Come back later!", 
		"type": "map"
	},
	"robo0": {
		"en-us": "", 
		"en-dm": "beep beep you stupid fuck", 
		"type": "map"
	},
	"robo1": {
		"en-us": "", 
		"en-dm": "hey kid\n i'm a compyoota\n stop all the downloadin'", 
		"type": "map"
	},
	"robo2": {
		"en-us": "", 
		"en-dm": "yo it's time to die motherufcker", 
		"type": "map"
	},
	"robo3": {
		"en-us": "", 
		"en-dm": "beep beep beep beep beep", 
		"type": "map"
	},
	"robo4": {
		"en-us": "", 
		"en-dm": "TODO: give this robot a witty one-liner", 
		"type": "map"
	},
	"research0": {
		"en-us": "", 
		"en-dm": "faculty only here. get the fuck out.", 
		"type": "map"
	},
	"research1": {
		"en-us": "", 
		"en-dm": "this is not your place you normie.", 
		"type": "map"
	},
	"research2": {
		"en-us": "", 
		"en-dm": "yo it's time to die motherufcker", 
		"type": "map"
	},
	"research3": {
		"en-us": "", 
		"en-dm": "beep beep beep beep beep", 
		"type": "map"
	},
	"research4": {
		"en-us": "", 
		"en-dm": "YOU ARE A HUMAN WHO IS NOT MY BOSS SO I MUST DESTROY YOU", 
		"type": "map"
	},
	"farmMush": {
		"en-us": "", 
		"en-dm": "I've been growing mushrooms on this log for years. It's what one might call... a mushroom log.", 
		"type": "map"
	},
	"farmTree": {
		"en-us": "", 
		"en-dm": "bananas tasty mmm yum", 
		"type": "map"
	},
	"farmSprinkler": {
		"en-us": "", 
		"en-dm": "These sprinklers are good, but they don't always get things right.", 
		"type": "map"
	},
	"farmHay": {
		"en-us": "", 
		"en-dm": "This nice soft pile of yellow stuff is great for napping on.", 
		"type": "map"
	},
	"farmBin": {
		"en-us": "", 
		"en-dm": "A bin full of delicious fruits and veggietables.", 
		"type": "map"
	},
	"farmWater": {
		"en-us": "", 
		"en-dm": "Water you doing? Fuck off.", 
		"type": "map"
	},
	"farmVeggie": {
		"en-us": "", 
		"en-dm": "These are looking delicious!", 
		"type": "map"
	},
	"hiveGet": {
		"en-us": "", 
		"en-dm": "You found a beehive! You can now place one more beehive on your farm, and you caught some bees, too!", 
		"type": "map"
	},
	"garlic": {
		"en-us": "", 
		"en-dm": "Garlic is as good as ten mothers... because my mum is great and garlic is great yum yum crunch crunch give me that garlic.", 
		"type": "item"
	},
	"banana": {
		"en-us": "", 
		"en-dm": "A banana in the hand is worth one in the peel. Sure.", 
		"type": "item"
	},
	"s_home": {
		"en-us": "", 
		"en-dm": "Home sweet home... I can hardly believe that all these robot hijinks are happening.", 
		"type": "shop"
	},
	"s_homesleep": {
		"en-us": "", 
		"en-dm": "A bit of rest should clear my mind.", 
		"type": "shop"
	},
	"s_homeleave": {
		"en-us": "", 
		"en-dm": "I should get going. There's apparently a lot I need to do today.", 
		"type": "shop"
	},
	"beeGoodbye": {
		"en-us": "", 
		"en-dm": "???: Goodbye, friend!", 
		"type": "map"
	},
	"FarmHive0": {
		"en-us": "", 
		"en-dm": "???: Hello there!", 
		"type": "map"
	},
	"FarmHive1": {
		"en-us": "", 
		"en-dm": "???: I see you've got some BEES there, am I correct?", 
		"type": "map"
	},
	"FarmHive2": {
		"en-us": "", 
		"en-dm": "???: You can place a beehive on your farm from the Fixtures menu. Once you have a beehive on your farm, you can use bees in combat!", 
		"type": "map"
	},
	"FarmHive3": {
		"en-us": "", 
		"en-dm": "???: Bees produce honey at random intervals, which recovers a lot of health when composted, and can stun some enemies when used as a weapon!", 
		"type": "map"
	},
	"FarmHive4": {
		"en-us": "", 
		"en-dm": "???: Bees are very important, so please take care of them. Don't take more honey than you need, and don't do anything to hurt them!", 
		"type": "map"
	},
	"BeeGuard0": {
		"en-us": "", 
		"en-dm": "???: I saw what you did...", 
		"type": "map"
	},
	"BeeGuard1": {
		"en-us": "", 
		"en-dm": "???: You used pesticide...", 
		"type": "map"
	},
	"BeeGuard2": {
		"en-us": "", 
		"en-dm": "???: And then exposed bees to that pesticide.", 
		"type": "map"
	},
	"BeeGuard3": {
		"en-us": "", 
		"en-dm": "???: DID YOU THINK I WOULDN'T NOTICE???", 
		"type": "map"
	},
	"BeeGuard4": {
		"en-us": "", 
		"en-dm": "???: I CANNOT LET YOU GET AWAY WITH THIS!!", 
		"type": "map"
	},
	"lakenoegg": {
		"en-us": "", 
		"en-dm": "What a beautiful lake.", 
		"type": "map"
	},
	"lakeegg": {
		"en-us": "", 
		"en-dm": "What a beautiful lake. Throw an egg into it?", 
		"type": "map"
	},
	"lakeegg_reject": {
		"en-us": "", 
		"en-dm": "Good call. Why would you throw a perfectly good egg in a lake, anyway?", 
		"type": "map"
	},
	"lakeegg_okay": {
		"en-us": "", 
		"en-dm": "You chuck an egg into the lake.", 
		"type": "map"
	},
	"dotdotdot": {
		"en-us": "", 
		"en-dm": "...", 
		"type": "map"
	},
	"lakeegg1": {
		"en-us": "", 
		"en-dm": "???: DID SOMEONE JUST DROP AN EGGGGGG???", 
		"type": "map"
	},
	"lakeegg2": {
		"en-us": "", 
		"en-dm": "???: You there... you're looking absolutely eggscellent today!", 
		"type": "map"
	},
	"lakeegg3": {
		"en-us": "", 
		"en-dm": "???: Did you, perchance, drop this GOLDEN EGG into my beautiful leggke?", 
		"type": "map"
	},
	"lakeeggLie": {
		"en-us": "", 
		"en-dm": "???: You lying motherfucker son of a bitch how fucking dare you eat shit you jackass you don't get ANY eggs. Give me all your eggs you don't deserve them anymore.", 
		"type": "map"
	},
	"lakeeggTruth": {
		"en-us": "", 
		"en-dm": "???: Your honesty is admirable! Here is the egg you dropped, as well as a BONUS GOLDEN EGG just for being such an honest little cutie! Stay eggscellent, sweetie!", 
		"type": "map"
	},
	"lakeFinish": {
		"en-us": "", 
		"en-dm": "The mysterious lake spirit vanishes as quickly as they came.", 
		"type": "map"
	},
	"badEggTry": {
		"en-us": "", 
		"en-dm": "A mysterious voice from beneath the lake tells you to fuck off.", 
		"type": "map"
	},
	"goldegg": {
		"en-us": "", 
		"en-dm": "A strange fairy from the lake by your farm gave you this egg. It looks like it's pretty one-of-a-kind so you should definitely hold onto it until the final battle and then forget to use it.", 
		"type": "item"
	},
	"goodEggTry": {
		"en-us": "", 
		"en-dm": "What a beautiful lake. Pretty fucked up that there's some weird egg spirit living down there, though. People DRINK from this lake!", 
		"type": "map"
	},
	"SignInn0": {
		"en-us": "", 
		"en-dm": "Frothybarf Inn", 
		"type": "map"
	},
	"SignForest": {
		"en-us": "", 
		"en-dm": "Shitblossom Forest", 
		"type": "map"
	},
	"SignSeeds0": {
		"en-us": "", 
		"en-dm": "Seedy Pete's Questionable Seeds", 
		"type": "map"
	},
	"SignFixture0": {
		"en-us": "", 
		"en-dm": "Fuckster's Fixtures", 
		"type": "map"
	},
	"SignExpand0": {
		"en-us": "", 
		"en-dm": "Andrew D's Farm Expansions", 
		"type": "map"
	},
	"SignWeapon0": {
		"en-us": "", 
		"en-dm": "Dave's Hoes and Sickles", 
		"type": "map"
	},
	"SignMermaid": {
		"en-us": "", 
		"en-dm": "Mermaid Shoppe", 
		"type": "map"
	},
	"foundShroom": {
		"en-us": "", 
		"en-dm": "Oh hey, a golden mushroom! I'm sure somebody would want this!", 
		"type": "map"
	},
	"foundShroomQ": {
		"en-us": "", 
		"en-dm": "Oh hey, a golden mushroom! That shopkeeper was looking for one of these!", 
		"type": "map"
	},
	"foundTurkey": {
		"en-us": "", 
		"en-dm": "You found some turkey eggs! Gobble gobble, you dumb fuck!", 
		"type": "map"
	},
	"carrotseeds0": {
		"en-us": "", 
		"en-dm": "Rabbit: oi you limey fucknugget, yeu want some carrot seeds? Help yourself!", 
		"type": "map"
	},
	"carrotseeds1": {
		"en-us": "", 
		"en-dm": "Rabbit: oi lass I think you've had a bit too many focken seeds. Save some for the rest of the focken forest!", 
		"type": "map"
	},
	"rabbit0": {
		"en-us": "", 
		"en-dm": "Rabbit: Th'fuck you want? Th'fuck you doin' here?", 
		"type": "map"
	},
	"rabbit1": {
		"en-us": "", 
		"en-dm": "Rabbit: Oh oh, a farmer are yae? Well I have some nice FERTILIZER here if you want sumfink special! What do you say?", 
		"type": "map"
	},
	"buyfertilizer": {
		"en-us": "", 
		"en-dm": "Yes (500 coins)", 
		"type": "choice"
	},
	"rabbit2": {
		"en-us": "", 
		"en-dm": "Rabbit: Well fuck off then.", 
		"type": "map"
	},
	"rabbit3": {
		"en-us": "", 
		"en-dm": "Rabbit: What the hell are you tryin' to pull here, lass? You don't have enough money! Feck off!", 
		"type": "map"
	},
	"rabbit4": {
		"en-us": "", 
		"en-dm": "Rabbit: Sick. Sick. Alright, hold out your hands and close your eyes.", 
		"type": "map"
	},
	"rabbit5": {
		"en-us": "", 
		"en-dm": "You feel your hands filling up. When you open your eyes, you find a nice pile of fertilizer.", 
		"type": "map"
	},
	"rabbit6": {
		"en-us": "", 
		"en-dm": "Rabbit: Heh heh. Enjoy. You can replace a tile of regular soil on your farm with Strong Soil now in the Fixtures Menu.", 
		"type": "map"
	},
	"rabbit7": {
		"en-us": "", 
		"en-dm": "Rabbit: Pleasure doing business with you, lass.", 
		"type": "map"
	},
	"rabbitOut": {
		"en-us": "", 
		"en-dm": "Rabbit: I don't have any more fertilizer for you, lady. Come back after I've had another meal.", 
		"type": "map"
	},
	"fishyFriend0": {
		"en-us": "", 
		"en-dm": "Fish: Oh, hello there. You're that farmer going around taking care of business, right?", 
		"type": "map"
	},
	"fishyFriend1": {
		"en-us": "", 
		"en-dm": "Fish: I have one request for you. If you ever find the opportunity to use fish in combat, please don't. I don't want my friends to be hurt.", 
		"type": "map"
	},
	"fishyFriend2": {
		"en-us": "", 
		"en-dm": "Fish: There are plenty of ways to defeat your foes without using animals. Please keep this in mind.", 
		"type": "map"
	},
	"fishyFriendX": {
		"en-us": "", 
		"en-dm": "Fish: Please be nice to my friends.", 
		"type": "map"
	},
	"mouse0": {
		"en-us": "", 
		"en-dm": "Mouse: squeak squeak", 
		"type": "map"
	},
	"mouse1": {
		"en-us": "", 
		"en-dm": "Mouse: squork!", 
		"type": "map"
	},
	"mouse2": {
		"en-us": "", 
		"en-dm": "Mouse: hey kid, you wanna buy some drugs?", 
		"type": "map"
	},
	"sqorl0": {
		"en-us": "", 
		"en-dm": "Squirrel: Oh nuts! A human!", 
		"type": "map"
	},
	"sqorl1": {
		"en-us": "", 
		"en-dm": "Squirrel: blep", 
		"type": "map"
	},
	"sqorl2": {
		"en-us": "", 
		"en-dm": "Squirrel: you tryna fuck with me?", 
		"type": "map"
	},
	"sqorl3": {
		"en-us": "", 
		"en-dm": "Squirrel: hi mom", 
		"type": "map"
	},
	"turky0": {
		"en-us": "", 
		"en-dm": "Turkey: Gobble gobble.", 
		"type": "map"
	},
	"turky1": {
		"en-us": "", 
		"en-dm": "Turkey: GOBBLE GOBBLE GOBBLE.", 
		"type": "map"
	},
	"turky2": {
		"en-us": "", 
		"en-dm": "Turkey: hi", 
		"type": "map"
	},
	"bossturky0": {
		"en-us": "", 
		"en-dm": "Turkey: I see you want to steal my child.", 
		"type": "map"
	},
	"bossturky1": {
		"en-us": "", 
		"en-dm": "Turkey: Over my dead body you fucker.", 
		"type": "map"
	},
	"ForestHive0": {
		"en-us": "", 
		"en-dm": "You hear some rumbling behind you.", 
		"type": "map"
	},
	"ForestHive1": {
		"en-us": "", 
		"en-dm": "A loud roar is heard.", 
		"type": "map"
	},
	"ForestHive2": {
		"en-us": "", 
		"en-dm": "Oh fuck it's a bear.", 
		"type": "map"
	},
	"ForestHive3": {
		"en-us": "", 
		"en-dm": "!!FIGHT:bear", 
		"type": "cmd"
	},
	"quest1_d": {
		"en-us": "", 
		"en-dm": "hly faulk lass is that a fucken golden mushroom? I'll trade you for this log! AND I'll start selling you my special mushroom selection!", 
		"type": "shop"
	},
	"lime0": {
		"en-us": "", 
		"en-dm": "???: hmmmmyessss hello there. My name is Lime.", 
		"type": "map"
	},
	"lime1": {
		"en-us": "", 
		"en-dm": "Lime: I'm looking for something... tasty.", 
		"type": "map"
	},
	"lime2": {
		"en-us": "", 
		"en-dm": "Lime: Something tasty... and yellow.", 
		"type": "map"
	},
	"lime3": {
		"en-us": "", 
		"en-dm": "Lime: Bring me something tasty and yellow, or seeds to grow something tasty and yellow, and I may just reward you!", 
		"type": "map"
	},
	"lime4": {
		"en-us": "", 
		"en-dm": "Lime: Oh oh, you have something for me, I can sense it.", 
		"type": "map"
	},
	"lime_lemon": {
		"en-us": "", 
		"en-dm": "Give Lemon Seeds.", 
		"type": "choice"
	},
	"lime_banana": {
		"en-us": "", 
		"en-dm": "Give Banana Seeds.", 
		"type": "choice"
	},
	"lime_corn": {
		"en-us": "", 
		"en-dm": "Give Corn Seeds.", 
		"type": "choice"
	},
	"lime_goldegg": {
		"en-us": "", 
		"en-dm": "Give Golden Egg.", 
		"type": "choice"
	},
	"lime_lemon1": {
		"en-us": "", 
		"en-dm": "Lime: Lemons? What the fuck?! Who the fuck just EATS LEMONS?!", 
		"type": "map"
	},
	"lime_lemon2": {
		"en-us": "", 
		"en-dm": "Lime: I want a tasty TREAT, not something to squeeze into my fucking aioli!", 
		"type": "map"
	},
	"lime_lemon3": {
		"en-us": "", 
		"en-dm": "Lime: Come back when you learn what TASTY means, asshole!", 
		"type": "map"
	},
	"lime_banana1": {
		"en-us": "", 
		"en-dm": "Lime: Bananas, eh? I mean the peel is yellow, so that counts I guess.", 
		"type": "map"
	},
	"lime_banana2": {
		"en-us": "", 
		"en-dm": "Lime: Bananas ARE pretty tasty, too... so, thank you, mysterious stranger! I will use these banana seeds wisely!", 
		"type": "map"
	},
	"lime_banana3": {
		"en-us": "", 
		"en-dm": "Lime: In exchange, have some other tasty yellow food seeds: corn!", 
		"type": "map"
	},
	"lime_corn1": {
		"en-us": "", 
		"en-dm": "Lime: Corn, eh? Yellow. Crunchy. Tasty. You nailed it!", 
		"type": "map"
	},
	"lime_corn2": {
		"en-us": "", 
		"en-dm": "Lime: Thank you, mysterious stranger! I will use these corn seeds wisely!", 
		"type": "map"
	},
	"lime_corn3": {
		"en-us": "", 
		"en-dm": "Lime: In exchange, have some other tasty yellow food seeds: bananas!", 
		"type": "map"
	},
	"lime_egg1": {
		"en-us": "", 
		"en-dm": "Lime: A golden egg... wow. You found such a rare and valuable item and you're just giving it to me?", 
		"type": "map"
	},
	"lime_egg2": {
		"en-us": "", 
		"en-dm": "Lime: But alas... gold isn't REALLY yellow... and I'm a vegan, so this is definitely not a tasty yellow food.", 
		"type": "map"
	},
	"lime_egg3": {
		"en-us": "", 
		"en-dm": "Lime: But I cannot just dismiss such a generous gift! Here, take these coconut seeds. You won't find these anywhere else around here!", 
		"type": "map"
	},
	"lime_complete": {
		"en-us": "", 
		"en-dm": "Lime: Thank you again for your generosity.", 
		"type": "map"
	},
	"lime_nope": {
		"en-us": "", 
		"en-dm": "Give nothing.", 
		"type": "choice"
	},
	"lime_denied": {
		"en-us": "", 
		"en-dm": "Lime: It seems my senses were wrong! Let me know if you do come across anything!", 
		"type": "map"
	},
	"coconut": {
		"en-us": "", 
		"en-dm": "A strange citrus man from the forest gave you these seeds. They look like they're pretty rare so you should definitely hold onto them until the final battle and then forget to use them.", 
		"type": "item"
	},
	"corn": {
		"en-us": "", 
		"en-dm": "really tasty really crunchy yum yum in my tum tum holy fuck", 
		"type": "item"
	},
	"rap0": {
		"en-us": "", 
		"en-dm": "???: Greetings, human. I am a Research Automaton for Producing Biological Augmentations through Transformation Technology for Life Enhancement.", 
		"type": "map"
	},
	"rap1": {
		"en-us": "", 
		"en-dm": "???: But you can call me RAPBATTLE for short.", 
		"type": "map"
	},
	"rap2": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: I'm currently researching different types of vegetation to find something versatile.", 
		"type": "map"
	},
	"rap3": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: I've already discovered corn, hemp, and soy, but I'm looking for something else. If you find anything, do let me know.", 
		"type": "map"
	},
	"rap4": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: If you have any versatile crops, do share them with me.", 
		"type": "map"
	},
	"rap5": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: Do you have something for me?", 
		"type": "map"
	},
	"rap_garlic": {
		"en-us": "", 
		"en-dm": "Give Garlic Seeds.", 
		"type": "choice"
	},
	"rap_coconut": {
		"en-us": "", 
		"en-dm": "Give Coconut Seeds.", 
		"type": "choice"
	},
	"rap_rice": {
		"en-us": "", 
		"en-dm": "Give Rice Seeds.", 
		"type": "choice"
	},
	"rap_garlic1": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: This is... \"garlic?\"", 
		"type": "map"
	},
	"rap_garlic2": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: Let me see... it appears to have preservative qualities, as well as various health benefits.", 
		"type": "map"
	},
	"rap_garlic3": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: It seems parts of it have insecticide properties, and some of its juices an be used for adhesive purposes.", 
		"type": "map"
	},
	"rap_garlic4": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: It can be stored warm for longer periods than many crops... it has antiseptic qualities... hm, yes, yes, this is all very good.", 
		"type": "map"
	},
	"rap_garlic5": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: I will accept this \"garlic,\" thank you muchly!", 
		"type": "map"
	},
	"rap_normalgift": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: In return for this crop, I will give you some delicious delicious batteries. Enjoy!", 
		"type": "map"
	},
	"rap_thanks": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: Thank you again for your help.", 
		"type": "map"
	},
	"rap_rice1": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: This is... \"rice?\"", 
		"type": "map"
	},
	"rap_rice2": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: This appears to have many interesting properties... this is a good starchy grain.", 
		"type": "map"
	},
	"rap_rice3": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: I predict this can be used to create flour, a milk-like liquid, alcohol, and other useful materials.", 
		"type": "map"
	},
	"rap_rice4": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: I will accept this \"rice,\" thank you muchly!", 
		"type": "map"
	},
	"rap_coconut1": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: This is... \"coconut?\"", 
		"type": "map"
	},
	"rap_coconut2": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: Its fibrous husk looks like it can be used in many ways, as can its hard shell.", 
		"type": "map"
	},
	"rap_coconut3": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: It also appears to produce various useful liquids - coconut water, coconut oil, and coconut milk.", 
		"type": "map"
	},
	"rap_coconut4": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: And its meat, of course, can be used in many different recipes.", 
		"type": "map"
	},
	"rap_coconut5": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: Hmm, yes, yes, this is an excellent crop. This is exactly what I needed, thank you.", 
		"type": "map"
	},
	"rap_coconut6": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: To thank you for this exceptional crop, I will give you these Genetically Modified Corn Seeds.", 
		"type": "map"
	},
	"rap_coconut7": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: They may be a bit... TOO genetically modified for human consumption, but I am sure you can find some use for them.", 
		"type": "map"
	},
	"gmocorn": {
		"en-us": "", 
		"en-dm": "A quirky robot gave you these questionable seeds. They look like they're pretty rare so you should definitely hold onto them until the final battle and then forget to use them.", 
		"type": "item"
	},
	"bookshelf_left": {
		"en-us": "", 
		"en-dm": "This shelf has lots of science textbooks on it, as well as a globe with various regions circled.", 
		"type": "map"
	},
	"bookshelf_mid": {
		"en-us": "", 
		"en-dm": "This shelf contains several volumes of the \"Mr. History and his Time-Travelling Mysteries\" series, as well as many books with woodcut animals on them.", 
		"type": "map"
	},
	"bookshelf_right": {
		"en-us": "", 
		"en-dm": "A mildly broken robot is being repaired on the bottom shelf, while the top shelf holds a replica sword and a figurine of a cartoon character.", 
		"type": "map"
	},
	"broken_robot": {
		"en-us": "", 
		"en-dm": "This big robot looks a lot like the one that was at your farm. Seeing it already broken puts you at ease.", 
		"type": "map"
	},
	"flask": {
		"en-us": "", 
		"en-dm": "You can't get this flask.", 
		"type": "map"
	},
	"sink": {
		"en-us": "", 
		"en-dm": "You wash your hands in the sink. Good for you!", 
		"type": "map"
	},
	"labprinter": {
		"en-us": "", 
		"en-dm": "A pile of papers stick out of the printer. Most of them are dense scientific texts, but you find a few pirated comics in there, too.", 
		"type": "map"
	},
	"seasmod": {
		"en-us": "", 
		"en-dm": "The label on this says it is a \"Season Modulator.\" It doesn't appear to do anything.", 
		"type": "map"
	},
	"seedshooter": {
		"en-us": "", 
		"en-dm": "A seed shooter, like the one you hijacked from that giant robot back at your farm.", 
		"type": "map"
	},
	"seedshot": {
		"en-us": "", 
		"en-dm": "As soon as you step on the tile, the seed shooter smacks you with a seed. Ouch! You take 2 damage.", 
		"type": "map"
	},
	"seedshotdeath": {
		"en-us": "", 
		"en-dm": "You collapse from being pelted by too many seeds.", 
		"type": "map"
	},
	"rottencrop": {
		"en-us": "", 
		"en-dm": "This crop appears to be very dead.", 
		"type": "map"
	},
	"growingpeppie": {
		"en-us": "", 
		"en-dm": "This bell pepper seems to be growing well enough.", 
		"type": "map"
	},
	"devbed": {
		"en-us": "", 
		"en-dm": "You'd be surprised at how well made this bed is, but you suspect that's just because it's never been slept in.", 
		"type": "map"
	},
	"devmachines": {
		"en-us": "", 
		"en-dm": "Lots of complicated machinery fills the room.", 
		"type": "map"
	},
	"devmonitor": {
		"en-us": "", 
		"en-dm": "This monitor is displaying the contents of an online encyclopedia article on water.", 
		"type": "map"
	},
	"openchest": {
		"en-us": "", 
		"en-dm": "This treasure chest is empty.", 
		"type": "map"
	},
	"closedchest": {
		"en-us": "", 
		"en-dm": "You open the chest. Inside you find {0}!", 
		"type": "map"
	},
	"opFont": {
		"en-us": "", 
		"en-dm": "Font", 
		"type": "opts"
	},
	"fontStandard": {
		"en-us": "", 
		"en-dm": "Standard", 
		"type": "opts"
	},
	"fontDyslexic": {
		"en-us": "", 
		"en-dm": "OpenDyslexic", 
		"type": "opts"
	}
};
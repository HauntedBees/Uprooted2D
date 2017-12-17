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
		"en-dm": "Sea Monster: ANOTHER HUMAN!! Was my egg not enough for you!? Are you here to kill me again?!", 
		"type": "map"
	},
	"sm2": {
		"en-us": "", 
		"en-dm": "Sea Monster: Hmm... wait, you are different from the others, aren't you?", 
		"type": "map"
	},
	"sm3": {
		"en-us": "", 
		"en-dm": "Sea Monster: Some humans stole my egg earlier. If you could recover it for me, I would gladly help you with anything you need.", 
		"type": "map"
	},
	"sm4": {
		"en-us": "", 
		"en-dm": "Sea Monster: Will you recover my egg for me?", 
		"type": "map"
	},
	"sm4c1": {
		"en-us": "", 
		"en-dm": "I'll get your egg back!", 
		"type": "choice"
	},
	"sm4c2": {
		"en-us": "", 
		"en-dm": "Prepare to die, you vile beast!", 
		"type": "choice"
	},
	"sm4c3": {
		"en-us": "", 
		"en-dm": "I'll think about it.", 
		"type": "choice"
	},
	"smA1": {
		"en-us": "", 
		"en-dm": "Sea Monster: Thank you! The human with the grey hair on their face is the one who stole it from me. Please bring it back to me!", 
		"type": "map"
	},
	"smA2": {
		"en-us": "", 
		"en-dm": "Sea Monster: Please bring my egg back to me once you have taken it back from the gray haired human.", 
		"type": "map"
	},
	"smB1": {
		"en-us": "", 
		"en-dm": "Sea Monster: So you are with them after all... so be it. Prepare yourself, human!", 
		"type": "map"
	},
	"smB2": {
		"en-us": "", 
		"en-dm": "Sea Monster: Back for more, are you? Feel my wrath, human!", 
		"type": "map"
	},
	"smC1": {
		"en-us": "", 
		"en-dm": "Sea Monster: Yeah okay that's fair.", 
		"type": "map"
	},
	"sm5": {
		"en-us": "", 
		"en-dm": "Sea Monster: Ah, you're back. Have you made your decision?", 
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
	},
	"truck_where": {
		"en-us": "", 
		"en-dm": "Where would you like to drive to?", 
		"type": "map"
	},
	"truck_none": {
		"en-us": "", 
		"en-dm": "You have things to do here before driving off!", 
		"type": "map"
	},
	"truck_nm": {
		"en-us": "", 
		"en-dm": "Stay here for now.", 
		"type": "choice"
	},
	"truck_home": {
		"en-us": "", 
		"en-dm": "Drive home.", 
		"type": "choice"
	},
	"truck_bridge": {
		"en-us": "", 
		"en-dm": "Drive to the bridge.", 
		"type": "choice"
	},
	"truck_city": {
		"en-us": "", 
		"en-dm": "Drive to the city.", 
		"type": "choice"
	},
	"truck_fake": {
		"en-us": "", 
		"en-dm": "Drive to the fake farm.", 
		"type": "choice"
	},
	"bworker1": {
		"en-us": "", 
		"en-dm": "Worker: Sorry lady, but this bridge is under construction... we can't let anyone through.", 
		"type": "map"
	},
	"bworker2": {
		"en-us": "", 
		"en-dm": "Worker: What do you mean \"all we're doing is tossing wood around and walking in circles?\" We're working very hard on... uh... construction.", 
		"type": "map"
	},
	"bworker3": {
		"en-us": "", 
		"en-dm": "Worker: ...Okay, look, lady, we aren't really doing any construction. The bridge is fine. But we've been hired to keep this bridge closed off by a private company.", 
		"type": "map"
	},
	"bworker4": {
		"en-us": "", 
		"en-dm": "Worker: I'd say \"if you got a problem with that, take it up with them\" but I guess you can't, really, because they're on the other side of this bridge.", 
		"type": "map"
	},
	"bworker5": {
		"en-us": "", 
		"en-dm": "Worker: But, uh, I think we might be able to make way for your truck if you're willing to help us out.", 
		"type": "map"
	},
	"bworker6": {
		"en-us": "", 
		"en-dm": "Worker: See, Dr. RealActualDoctor on the TV said that there's a Sea Monster in this river whose heart has healing properties.", 
		"type": "map"
	},
	"bworker7": {
		"en-us": "", 
		"en-dm": "Worker: Some of my boys tried to fight that thing themselves, but we were only able to steal this egg from it.", 
		"type": "map"
	},
	"bworker8": {
		"en-us": "", 
		"en-dm": "Worker: An egg's fine and all, but it's gonna take a while to hatch, and I would prefer a cure for my butt rash sooner than later.", 
		"type": "map"
	},
	"bworker9": {
		"en-us": "", 
		"en-dm": "Worker: So if you can get me a Sea Monster Heart, we'll give you full access to this bridge, no questions asked. Sound good?", 
		"type": "map"
	},
	"bworker10": {
		"en-us": "", 
		"en-dm": "Worker: Let me know when you get that sea monster heart.", 
		"type": "map"
	},
	"rockwrong": {
		"en-us": "", 
		"en-dm": "You can't push the rock from this direction!", 
		"type": "map"
	},
	"bworkerMad1": {
		"en-us": "", 
		"en-dm": "Worker: Hey there, lady--- what? You want the Sea Monster egg back?", 
		"type": "map"
	},
	"bworkerMad2": {
		"en-us": "", 
		"en-dm": "Worker: Don't tell me you're gonna side with that creature!! It's just a dumb fish!!!", 
		"type": "map"
	},
	"bworkerMad3": {
		"en-us": "", 
		"en-dm": "Worker: Well, if you insist, you can have the egg... but I'm not giving it back without a fight!", 
		"type": "map"
	},
	"bworkerMad4": {
		"en-us": "", 
		"en-dm": "Worker: Back for more, are you? You'll never get this egg!", 
		"type": "map"
	},
	"bworkerMad5": {
		"en-us": "", 
		"en-dm": "Worker: Yowza chowza! Come on, boys! Let's get out of here! Dis broad packs a punch!!", 
		"type": "map"
	},
	"bworkerMad6": {
		"en-us": "", 
		"en-dm": "Worker: Here's your stupid egg, but good luck clearing off this bridge all on your own!!", 
		"type": "map"
	},
	"smD1": {
		"en-us": "", 
		"en-dm": "Sea Monster: I smell something eggscellent!", 
		"type": "map"
	},
	"smD2": {
		"en-us": "", 
		"en-dm": "Sea Monster: Ah!! Is that my baby? It is! You got my egg back! Thank you! Thank you!!", 
		"type": "map"
	},
	"smD3": {
		"en-us": "", 
		"en-dm": "Sea Monster: Now that you've held up your end of the bargain, I'll hold up mine! What do you need from me?", 
		"type": "map"
	},
	"smD4": {
		"en-us": "", 
		"en-dm": "Sea Monster: Those workers left a bunch of junk on the bridge, huh? Well, I can take care of that!", 
		"type": "map"
	},
	"smD5": {
		"en-us": "", 
		"en-dm": "Sea Monster: Here we go! GROAAAAAAAAAR!!!!", 
		"type": "map"
	},
	"smD6": {
		"en-us": "", 
		"en-dm": "Sea Monster: There we go! How's that? All clear!", 
		"type": "map"
	},
	"smD7": {
		"en-us": "", 
		"en-dm": "Sea Monster: Good luck on your travels!", 
		"type": "map"
	},
	"bworkerA1": {
		"en-us": "", 
		"en-dm": "The Sea Monster's body slumps over.", 
		"type": "map"
	},
	"bworkerA2": {
		"en-us": "", 
		"en-dm": "*dig dig dig*", 
		"type": "map"
	},
	"bworkerA3": {
		"en-us": "", 
		"en-dm": "You got the Sea Monster's heart! Gross!", 
		"type": "map"
	},
	"bworkerB1": {
		"en-us": "", 
		"en-dm": "Worker: Hey lady! I smell something fishy! And I mean that in the \"it smells like you killed a fish\" way, not in the \"something is suspicious\" way!", 
		"type": "map"
	},
	"bworkerB2": {
		"en-us": "", 
		"en-dm": "Worker: Oh ho ho! The Sea Monster's heart! You really pulled through!", 
		"type": "map"
	},
	"bworkerB3": {
		"en-us": "", 
		"en-dm": "Worker: Well, you held up your end of the bargain, so I guess I'll hold up mine!", 
		"type": "map"
	},
	"bworkerB4": {
		"en-us": "", 
		"en-dm": "Worker: LET'S PACK THINGS UP, BOYS! WE'RE MOVIN' OUT!", 
		"type": "map"
	},
	"bworkerB5": {
		"en-us": "", 
		"en-dm": "Worker: Pleasure doin' business with ya, lady!", 
		"type": "map"
	},
	"bworkerC1": {
		"en-us": "", 
		"en-dm": "Worker: Sorry lady, but this bridge is under constr--oh yeesh what is that SMELL? You ever heard of a shower?!", 
		"type": "map"
	},
	"bworkerC2": {
		"en-us": "", 
		"en-dm": "Worker: Th-that's a... that looks like a Sea Monster Heart! Why do you even have that?!", 
		"type": "map"
	},
	"bworkerC3": {
		"en-us": "", 
		"en-dm": "Worker: I tell ya what, lady. We got paid to sort of meander around this bridge by some fancy white collar boys up north.", 
		"type": "map"
	},
	"bworkerC4": {
		"en-us": "", 
		"en-dm": "Worker: But if you need to get through here, I think we's can work out some sort of deal. Whattaya say? You give me that heart and we'll let you through!", 
		"type": "map"
	},
	"bworkerCY": {
		"en-us": "", 
		"en-dm": "Worker: Beautiful! This heart will definitely cure my butt rash!", 
		"type": "map"
	},
	"bworkerCN": {
		"en-us": "", 
		"en-dm": "Worker: Alright, whatever. But if you ever decide you want to get through this bridge, you know what I want!", 
		"type": "map"
	},
	"bworkerC5": {
		"en-us": "", 
		"en-dm": "Worker: Hey lady, have you changed your mind yet? If you give me that Sea Monster Heart we'll let you through!", 
		"type": "map"
	},
	"pirateMonk1": {
		"en-us": "", 
		"en-dm": "???: Yarr! Shiver me timb--eh, no one actually talks like that. S'up? I'm Dowel the pirate.", 
		"type": "map"
	},
	"pirateMonk2": {
		"en-us": "", 
		"en-dm": "Dowel: It's a bit hard to loot ships when nobody sails down this river, so I'm trying to start a DIY kind of thing.", 
		"type": "map"
	},
	"pirateMonk3": {
		"en-us": "", 
		"en-dm": "Dowel: Unfortunately, it's hard to start my own veggie garden down here under the sea. Nothing grows except algae and kelp!", 
		"type": "map"
	},
	"pirateMonk4": {
		"en-us": "", 
		"en-dm": "Dowel: I'd like something a bit tastier than fish food, so if you can find anything that grows well in water, send it my way and I'll reward you handsomely!", 
		"type": "map"
	},
	"pirateMonkW": {
		"en-us": "", 
		"en-dm": "Dowel: I'm looking for some sort of crop that is durable and can grow in tough conditions - like underwater! If you find anything like that, I'll trade you for it!", 
		"type": "map"
	},
	"pirateMonkH": {
		"en-us": "", 
		"en-dm": "Dowel: Hello again! Do you have any fancy crops I can grow?", 
		"type": "map"
	},
	"pirateMonkC1": {
		"en-us": "", 
		"en-dm": "Give Arborio Rice Seeds.", 
		"type": "choice"
	},
	"pirateMonkC2": {
		"en-us": "", 
		"en-dm": "Give Black Rice Seeds.", 
		"type": "choice"
	},
	"pirateMonkC3": {
		"en-us": "", 
		"en-dm": "Give Short-Grain Rice Seeds.", 
		"type": "choice"
	},
	"pirateMonkC4": {
		"en-us": "", 
		"en-dm": "Give Water Chestnut Seeds.", 
		"type": "choice"
	},
	"pirateMonkC5": {
		"en-us": "", 
		"en-dm": "Give GMO Corn Seeds.", 
		"type": "choice"
	},
	"pirateMonkR1": {
		"en-us": "", 
		"en-dm": "Dowel: Hmm... paddy crops. I can probably set up some sort of paddy around here!", 
		"type": "map"
	},
	"pirateMonkR2": {
		"en-us": "", 
		"en-dm": "Dowel: I think this will do nicely, thank you!", 
		"type": "map"
	},
	"pirateMonkR3": {
		"en-us": "", 
		"en-dm": "Dowel: To thank you, I will give you all these leftover seeds that definitely CANNOT grow underwater!", 
		"type": "map"
	},
	"pirateMonkR4": {
		"en-us": "", 
		"en-dm": "You got 5 Tomato Seeds, 4 Ginger Seeds, 3 Pineapple Seeds, 2 Bell Pepper Seeds, and Parrot Toadstool Seeds.", 
		"type": "map"
	},
	"pirateMonkR5": {
		"en-us": "", 
		"en-dm": "Dowel: Pleasure doing business with you, ma'am! I mean, landlubber!", 
		"type": "map"
	},
	"pirateMonkG1": {
		"en-us": "", 
		"en-dm": "Dowel: What the heckaroonie are these? GMO Corn?? These seeds... don't look natural!", 
		"type": "map"
	},
	"pirateMonkG2": {
		"en-us": "", 
		"en-dm": "Dowel: Hmm... so they were genetically engineered to be incredibly durable, but also mostly inedible to humans.", 
		"type": "map"
	},
	"pirateMonkG3": {
		"en-us": "", 
		"en-dm": "Dowel: Well, I'm sure my razor sharp Sea Monk teeth will be able to give them some good crunching!", 
		"type": "map"
	},
	"pirateMonkG4": {
		"en-us": "", 
		"en-dm": "Dowel: Thank you for these! In exchange, I will give you my Buried Treasure... if you can find it!", 
		"type": "map"
	},
	"pirateMonkG5": {
		"en-us": "", 
		"en-dm": "Dowel: Honestly I don't know where it is - it's somewhere east of here... the currents kind of blew it around.", 
		"type": "map"
	},
	"pirateMonkG6": {
		"en-us": "", 
		"en-dm": "Dowel: But with this Sea Monk Key I'm giving you, you'll be able to open it when you find it!", 
		"type": "map"
	},
	"pirateMonkNo": {
		"en-us": "", 
		"en-dm": "Dowel: Darn. If you find any durable crops that can grow underwater or just in tough conditions in general, let me know!", 
		"type": "map"
	},
	"chestLocked": {
		"en-us": "", 
		"en-dm": "This treasure chest is locked. It doesn't look like you'll be able to open it without a key.", 
		"type": "map"
	},
	"chestUnlock1": {
		"en-us": "", 
		"en-dm": "This treasure chest is locked, but it looks like the Sea Monk Key that Dowel gave you can open it!", 
		"type": "map"
	},
	"chestUnlock2": {
		"en-us": "", 
		"en-dm": "*click*", 
		"type": "map"
	},
	"chestUnlock3": {
		"en-us": "", 
		"en-dm": "Inside you found 4 pieces of Master Bait!", 
		"type": "map"
	},
	"ultrarod": {
		"en-us": "", 
		"en-dm": "This fishing rod has the best bait ever! It looks like it's pretty rare so you should definitely hold onto it until the final battle and then forget to use it.", 
		"type": "item"
	},
	"vaseFound": {
		"en-us": "", 
		"en-dm": "This looks like a pretty nice vase... but you'll need to break it if you want to reach that beehive. Break the vase?", 
		"type": "map"
	},
	"vaseDont": {
		"en-us": "", 
		"en-dm": "Yeah... it's mean to break other people's vases so you can rob them.", 
		"type": "map"
	},
	"vaseDo0": {
		"en-us": "", 
		"en-dm": "You smack the vase, shattering it into several pieces.", 
		"type": "map"
	},
	"vaseDo1": {
		"en-us": "", 
		"en-dm": "Kelp Boy: My vase! My beautiful vase! Why would you do such a cruel thing?!", 
		"type": "map"
	},
	"vaseDo2": {
		"en-us": "", 
		"en-dm": "Kelp Boy: I must react to your destruction of property with VIOLENCE! PREPARE YOURSELF!!!", 
		"type": "map"
	},
	"kelpBoy1": {
		"en-us": "", 
		"en-dm": "Kelp Boy: Hi. I'm Kelp Boy. I like bees and pottery, I guess.", 
		"type": "map"
	},
	"vaseWon0": {
		"en-us": "", 
		"en-dm": "The Kelp Boy scampers off, hooting and hollering like a fool, leaving his beehive unguarded!", 
		"type": "map"
	},
	"vaseDo3": {
		"en-us": "", 
		"en-dm": "Kelp Boy: Do you think I forgot what you did to my beautiful vase!? How dare you show your face here again!!", 
		"type": "map"
	},
	"vaseDo4": {
		"en-us": "", 
		"en-dm": "Kelp Boy: Still after my beehive, are you!? I'll never let you take it!!", 
		"type": "map"
	},
	"vaseDo5": {
		"en-us": "", 
		"en-dm": "Kelp Boy: Huh--what?! How did you get there?! That's my beehive! You can't take it from me!!", 
		"type": "map"
	},
	"vaseFoundBee": {
		"en-us": "", 
		"en-dm": "You already stole Kelp Boy's bees. Somehow. Breaking his vase now would just be salt in the wound.", 
		"type": "map"
	},
	"fish0": {
		"en-us": "", 
		"en-dm": "Fish: Blub.", 
		"type": "map"
	},
	"fish1": {
		"en-us": "", 
		"en-dm": "The fish swims menacingly towards you.", 
		"type": "map"
	},
	"fish2": {
		"en-us": "", 
		"en-dm": "Fish: Bwubwubuwbwubwubwuwb.", 
		"type": "map"
	},
	"seamonk0": {
		"en-us": "", 
		"en-dm": "Sea Monk: it is my duty to fight you.", 
		"type": "map"
	},
	"seamonk1": {
		"en-us": "", 
		"en-dm": "The Sea Monk lunges at you.", 
		"type": "map"
	},
	"seamonk2": {
		"en-us": "", 
		"en-dm": "Sea Monk: hey you wanna buy some smokes?", 
		"type": "map"
	},
	"seamonk3": {
		"en-us": "", 
		"en-dm": "Sea Monk: FIGHT TIME!", 
		"type": "map"
	},
	"seamonk4": {
		"en-us": "", 
		"en-dm": "Sea Monk: This is my turf, landwalker.", 
		"type": "map"
	},
	"seamonk5": {
		"en-us": "", 
		"en-dm": "Sea Monk: aaaaaaaaaa AAAAAAAAAAAA AAAAAAAAAAAA!!!!!!!!", 
		"type": "map"
	},
	"seamonk6": {
		"en-us": "", 
		"en-dm": "Sea Monk: what the fuck is a sea monk", 
		"type": "map"
	},
	"seamonk7": {
		"en-us": "", 
		"en-dm": "Sea Monk: yes let us duel", 
		"type": "map"
	},
	"SignConstWork": {
		"en-us": "", 
		"en-dm": "Lazy Construction Worker Shoppe", 
		"type": "map"
	},
	"cwk_co": {
		"en-us": "", 
		"en-dm": "Hey there. I'm too lazy to do any construction work so I'm just... running a shop. Whatever.", 
		"type": "shop"
	},
	"cwk_leave": {
		"en-us": "", 
		"en-dm": "Thanks for the whatever.", 
		"type": "shop"
	},
	"barndoorChick": {
		"en-us": "", 
		"en-dm": "You can't see too well through the door, but there appears to be some of ridiculously large chicken behind it.", 
		"type": "map"
	},
	"barndoorPig": {
		"en-us": "", 
		"en-dm": "You can't see too well through the door, but it looks like there's a pig with something tied to its back in there.", 
		"type": "map"
	},
	"barndoorCrop": {
		"en-us": "", 
		"en-dm": "You can't see too well through the door, but you can make out a pile of fruits and veggies in it.", 
		"type": "map"
	},
	"barndoorEmpty": {
		"en-us": "", 
		"en-dm": "You can't see too well through the door, but this stall seems to be empty.", 
		"type": "map"
	},
	"barndoorShop": {
		"en-us": "", 
		"en-dm": "You can't see too well through the door, but I think I see a shopkeeper in there.", 
		"type": "map"
	},
	"chickbot0": {
		"en-us": "", 
		"en-dm": "Robot: Yes hello I am a chicken. I mean, uh, \"quack.\"", 
		"type": "map"
	},
	"chickbot1": {
		"en-us": "", 
		"en-dm": "Robot: I'm gonna cluck you up.", 
		"type": "map"
	},
	"chickbot2": {
		"en-us": "", 
		"en-dm": "Robot: ChickenNoise.ogg not found.", 
		"type": "map"
	},
	"pig0": {
		"en-us": "", 
		"en-dm": "That pig has a fucking gun tied to its back.", 
		"type": "map"
	},
	"golem0": {
		"en-us": "", 
		"en-dm": "The pile of fruits and veggies begins shaking as you approach it. It's alive!!!", 
		"type": "map"
	},
	"farmTV0": {
		"en-us": "", 
		"en-dm": "Farmer Jeff: Ha ha haha!!! You fool!!", 
		"type": "map"
	},
	"farmTV1": {
		"en-us": "", 
		"en-dm": "Farmer Jeff: You walked right into my trap!! This whole farm is a fake! A ruse!", 
		"type": "map"
	},
	"farmTV2": {
		"en-us": "", 
		"en-dm": "Farmer Jeff: I'm not even a real farmer! My name is actually just Jeff!", 
		"type": "map"
	},
	"farmTV3": {
		"en-us": "", 
		"en-dm": "Actually Just Jeff: You managed to get past our roadblock at the bridge, but you'll NEVER make it out of HERE alive!!!", 
		"type": "map"
	},
	"farmTV4": {
		"en-us": "", 
		"en-dm": "Actually Just Jeff: This fake farm is full of the most elaborate traps and obstacles that technology can offer us!", 
		"type": "map"
	},
	"farmTV5": {
		"en-us": "", 
		"en-dm": "Actually Just Jeff: Good luck, you imbecile!!", 
		"type": "map"
	},
	"farmTVunplug0": {
		"en-us": "", 
		"en-dm": "Actually Just Jeff: hey wait what are you doing don't touch that", 
		"type": "map"
	},
	"farmTVunplug1": {
		"en-us": "", 
		"en-dm": "Actually Just Jeff: wait NO YOU SON OF A B--", 
		"type": "map"
	},
	"farmTVunplug2": {
		"en-us": "", 
		"en-dm": "You pull the cable out of the outlet, powering down the TV and all of the other elaborate traps in the building.", 
		"type": "map"
	},
	"farmTVunplug3": {
		"en-us": "", 
		"en-dm": "Pretty sweet that just unplugging one cable powered down all of that guy's plans. Geniuses truly are the dumbest people.", 
		"type": "map"
	},
	"lawnmower": {
		"en-us": "", 
		"en-dm": "This lawnmower looks brand new.", 
		"type": "map"
	},
	"mower0": {
		"en-us": "", 
		"en-dm": "Lawnmower: VROOOM-BRBRBRBRBRBRRRRR! I'M GONNA RUN YOU OVER!!!", 
		"type": "map"
	},
	"mower1": {
		"en-us": "", 
		"en-dm": "Lawnmower: YOUR ASS IS GRASS. AND I'M A LAWNMOWER. D-...do you see where I'm going with this?", 
		"type": "map"
	},
	"hotbox3": {
		"en-us": "", 
		"en-dm": "Having solved the machine's puzzle, the energy field blocking the stairs vanishes.", 
		"type": "map"
	},
	"hotboxX": {
		"en-us": "", 
		"en-dm": "The machine is powered off.", 
		"type": "map"
	},
	"hotbox1": {
		"en-us": "", 
		"en-dm": "This machine can disable the energy field blocking off the stairs.", 
		"type": "map"
	},
	"hotbox2": {
		"en-us": "", 
		"en-dm": "You already disabled the energy field.", 
		"type": "map"
	},
	"tireget": {
		"en-us": "", 
		"en-dm": "You got the Spare Tire!", 
		"type": "map"
	},
	"bustedTruck0": {
		"en-us": "", 
		"en-dm": "It looks like there are some nails in the tire... these must have been on the road. Strange...", 
		"type": "map"
	},
	"bustedTruck1": {
		"en-us": "", 
		"en-dm": "You quickly change the tire.", 
		"type": "map"
	},
	"fakeFarmS": {
		"en-us": "", 
		"en-dm": "...*BRBRPRPRPDTTUTTTTTDTT*", 
		"type": "map"
	},
	"fakeFarm0": {
		"en-us": "", 
		"en-dm": "Well this doesn't look good.", 
		"type": "map"
	},
	"fakeFarm1": {
		"en-us": "", 
		"en-dm": "???: Howdy there, buckaroo! Boy howdy, looks like you got a flat tire!", 
		"type": "map"
	},
	"fakeFarm2": {
		"en-us": "", 
		"en-dm": "???: I'm Farmer Jeff! Pleased ta' make your acquaintance!", 
		"type": "map"
	},
	"fakeFarm3": {
		"en-us": "", 
		"en-dm": "Farmer Jeff: I've got a spare tire in the back of my barn! Because I'm a farmer! Who owns a barn! I'll go get it for ya!", 
		"type": "map"
	},
	"fakeFarm4": {
		"en-us": "", 
		"en-dm": "Farmer Jeff: Make yourself comfortable, I'll be back in a jiffy! Yee-haw! Farmin'!", 
		"type": "map"
	},
	"fakeFarm5": {
		"en-us": "", 
		"en-dm": "Actually Just Jeff: NOT SO FAST, YOU GOBLIN!", 
		"type": "map"
	},
	"fakeFarm6": {
		"en-us": "", 
		"en-dm": "Actually Just Jeff: IF YOU THINK I'M GOING TO LET YOU OUT OF HERE WITH THAT TIRE, YOU ARE MISTAKEN!", 
		"type": "map"
	},
	"fakeFarm7": {
		"en-us": "", 
		"en-dm": "Actually Just Jeff: HOUSEKEEPER! TURN ON!", 
		"type": "map"
	},
	"fakeFarm8": {
		"en-us": "", 
		"en-dm": "???: Now calibrating... ... ...", 
		"type": "map"
	},
	"fakeFarm9": {
		"en-us": "", 
		"en-dm": "???: Hello. HOUSEKEEPER is now active. Welcome back, Sexy Jeff.", 
		"type": "map"
	},
	"fakeFarm10": {
		"en-us": "", 
		"en-dm": "Actually Just Jeff: Er, I, uh, I didn't tell it to call me that.", 
		"type": "map"
	},
	"fakeFarm11": {
		"en-us": "", 
		"en-dm": "Actually Just Jeff: ...DON'T LOOK AT ME LIKE THAT! HOUSEKEEPER! Kill this woman!", 
		"type": "map"
	},
	"fakeFarm12": {
		"en-us": "", 
		"en-dm": "HOUSEKEEPER: Understood, Sexy Jeff. Now attacking.", 
		"type": "map"
	},
	"fakeFarm13": {
		"en-us": "", 
		"en-dm": "Actually Just Jeff: Ugh... how did you defeat HOUSEKEEPER??!", 
		"type": "map"
	},
	"fakeFarm14": {
		"en-us": "", 
		"en-dm": "Actually Just Jeff: No matter! You may have beaten me, but you're still stuck here!", 
		"type": "map"
	},
	"fakeFarm15": {
		"en-us": "", 
		"en-dm": "Actually Just Jeff: The nearest tire changing station is dozens of miles away! You'll never make it there just by walking!", 
		"type": "map"
	},
	"fakeFarm16": {
		"en-us": "", 
		"en-dm": "Actually Just Jeff: ...What do you mean you can just change the tire yourself?! That's impossible!! People can't just CHANGE TIRES!!", 
		"type": "map"
	},
	"fakeFarm17": {
		"en-us": "", 
		"en-dm": "Actually Just Jeff: You... bastard...", 
		"type": "map"
	},
	"HK_s0": {
		"en-us": "", 
		"en-dm": "I don't know what this is.", 
		"type": "map"
	},
	"HK_s1": {
		"en-us": "", 
		"en-dm": "This is a \"HOUSEKEEPER\" model smart speaker.", 
		"type": "map"
	},
	"HK_s2": {
		"en-us": "", 
		"en-dm": "You can talk to it and it'll turn on lights in your house, or set the thermostat temperature, or send your personal data to advertisers.", 
		"type": "map"
	},
	"fakeFarm18": {
		"en-us": "", 
		"en-dm": "Actually Just Jeff: I'll never let you out of here!", 
		"type": "map"
	},
	"s_up2": {
		"en-us": "", 
		"en-dm": "Do you wish you had more tiles to plant crops in? Wish no more! I can give you more tiles to work with!", 
		"type": "shop"
	},
	"s_up2p": {
		"en-us": "", 
		"en-dm": "Excellent! Now you'll have more tiles to plant crops and place fixtures on!", 
		"type": "shop"
	},
	"upgradeBarn": {
		"en-us": "", 
		"en-dm": "Bert's Expansion Barn", 
		"type": "map"
	},
	"arf0": {
		"en-us": "", 
		"en-dm": "Crouton: Hey.", 
		"type": "map"
	},
	"arf1": {
		"en-us": "", 
		"en-dm": "Crouton: I have a bit of a \"situation\" here, as it were.", 
		"type": "map"
	},
	"arf2": {
		"en-us": "", 
		"en-dm": "Crouton: I love fish, but, the fish don't love me. Or my bait. They aren't biting, you see.", 
		"type": "map"
	},
	"arf3": {
		"en-us": "", 
		"en-dm": "Crouton: If you have some other way to get fish, or you have some really good bait, let me know.", 
		"type": "map"
	},
	"arf4": {
		"en-us": "", 
		"en-dm": "Crouton: You got anything for me?", 
		"type": "map"
	},
	"arf_none": {
		"en-us": "", 
		"en-dm": "Crouton: Damn. If you have any fishing tools or good bait, holler at me.", 
		"type": "map"
	},
	"arf_spear": {
		"en-us": "", 
		"en-dm": "Give Fish Spear.", 
		"type": "choice"
	},
	"arf_net": {
		"en-us": "", 
		"en-dm": "Give Fish Net.", 
		"type": "choice"
	},
	"arf_bignet": {
		"en-us": "", 
		"en-dm": "Give Big Net.", 
		"type": "choice"
	},
	"arf_metalrod": {
		"en-us": "", 
		"en-dm": "Give Metal Rod.", 
		"type": "choice"
	},
	"arf_ultrarod": {
		"en-us": "", 
		"en-dm": "Give Master Bait.", 
		"type": "choice"
	},
	"arf_spear0": {
		"en-us": "", 
		"en-dm": "Crouton: A spear, eh? I dunno if I'd be able to work that with my tiny doggy paws.", 
		"type": "map"
	},
	"arf_spear1": {
		"en-us": "", 
		"en-dm": "Crouton: I appreciate the sentiment, but I may need something a little more hands-off.", 
		"type": "map"
	},
	"arf_good0": {
		"en-us": "", 
		"en-dm": "Crouton: Bow-WOW! Now THIS could catch me some fishies!", 
		"type": "map"
	},
	"arf_good1": {
		"en-us": "", 
		"en-dm": "Crouton: Thanks, buddy! Here's some fodder as a reward. You can feed it to a cow to get plenty of health-recovering milk!", 
		"type": "map"
	},
	"arf_good2": {
		"en-us": "", 
		"en-dm": "Crouton: Don't have a cow? Don't have a cow! There's a shop in one of the stalls inside this fake-ass barn that sells them!", 
		"type": "map"
	},
	"arf_ultra0": {
		"en-us": "", 
		"en-dm": "Crouton: Oh wow, now THAT is some fish bait! I'll definitely catch some amazing fish with this!", 
		"type": "map"
	},
	"arf_ultra1": {
		"en-us": "", 
		"en-dm": "Crouton: Thanks a million! Here's some premium food as a reward! You can feed it to a cow to get super powerful health-recovering milk!", 
		"type": "map"
	},
	"arf_thanks": {
		"en-us": "", 
		"en-dm": "Crouton: You give a dog a fish, you feed him for a day. You teach a dog to fish, you're gonna win some fucking dog shows.", 
		"type": "map"
	},
	"goodfood": {
		"en-us": "", 
		"en-dm": "A super tasty and healthy feed for animals. Feeding a cow this will lead to milk that recovers LOTS of health, so you should definitely hold onto it until the final battle and then forget to use it.", 
		"type": "item"
	}
};
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
	"Pb1_2": {
		"en-us": "", 
		"en-dm": "Either way, he said he came from a research plant down south. I should check that out."
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
		"en-dm": "That was a weird situation. I wonder why that guy sucked so much."
	},
	"Pb0_1": {
		"en-us": "", 
		"en-dm": "Oh well, I should probably head back to my farm now."
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
		"en-dm": "Save and Return"
	},
	"opQuit": {
		"en-us": "", 
		"en-dm": "Return without Saving"
	},
	"intro1": {
		"en-us": "", 
		"en-dm": "???: This must be the place!"
	},
	"intro2": {
		"en-us": "", 
		"en-dm": "???: Hello there, are you the owner of this farm? You are? Excellent!"
	},
	"intro3": {
		"en-us": "", 
		"en-dm": "???: My name is Nathan! I'm an apprentice farmer! Do you need an intern?"
	},
	"intro4": {
		"en-us": "", 
		"en-dm": "Nathan: Now hold on a second! I can be a valuable asset to your farm!"
	},
	"intro5": {
		"en-us": "", 
		"en-dm": "Nathan: You're running your produce stand today, right? I can go advertise for it!"
	},
	"intro6": {
		"en-us": "", 
		"en-dm": "Nathan: Or I can run some errands for you while you're busy with that! Come on, what's something you need to get done today?"
	},
	"intro7": {
		"en-us": "", 
		"en-dm": "Nathan: You need some seeds, do you? Well, I know a great bulk supplier! I'll go get them and bring them to you at the market!"
	},
	"intro8": {
		"en-us": "", 
		"en-dm": "Nathan: Be back soon! I won't disappoint you!"
	},
	"intro9": {
		"en-us": "", 
		"en-dm": "???: Ah! This must be it! The famous produce stand!"
	},
	"intro10": {
		"en-us": "", 
		"en-dm": "???: The guys back at the office were right -- all of this looks amazing!"
	},
	"intro11": {
		"en-us": "", 
		"en-dm": "???: This carrot looks so nutritious!"
	},
	"intro12": {
		"en-us": "", 
		"en-dm": "???: ..."
	},
	"intro13": {
		"en-us": "", 
		"en-dm": "???: And it looks like this analysis confirms that it is!"
	},
	"intro14": {
		"en-us": "", 
		"en-dm": "???: Hm?"
	},
	"intro15": {
		"en-us": "", 
		"en-dm": "???: Oh. You're probably wondering what that was all about."
	},
	"intro16": {
		"en-us": "", 
		"en-dm": "???: I'm Beckett. The startup I work for is going to use this carrot data to help us create PROPRIETARY FOOD SUBSTITUTES."
	},
	"intro17": {
		"en-us": "", 
		"en-dm": "Beckett: The world will be so much better when people don't have to worry about what to eat!"
	},
	"intro18": {
		"en-us": "", 
		"en-dm": "Beckett: But for that to work, we also need to make sure Food2 has no competition..."
	},
	"intro19": {
		"en-us": "", 
		"en-dm": "Beckett: So, I'd like to make you an offer. Ten million coins to retire and never farm again."
	},
	"intro20": {
		"en-us": "", 
		"en-dm": "Beckett: ..."
	},
	"intro21": {
		"en-us": "", 
		"en-dm": "Beckett: No? Hmm, I thought you'd be convinced by that amazing sales pitch..."
	},
	"intro22": {
		"en-us": "", 
		"en-dm": "Beckett: Well, I have things I need to do, so I'll let this Convince-a-tron change your mind! Give me a call when you're ready to accept our offer!"
	},
	"intro23": {
		"en-us": "", 
		"en-dm": "Convince-a-tron: Hello! Allow me to play the devil's advocate for a moment... what if that thing you don't want to do is actually a good thing?"
	},
	"tut0": {
		"en-us": "", 
		"en-dm": "Oh shit, it's a throwdown! To start things off, select 'Plant' from the menu below!"
	},
	"tut1": {
		"en-us": "", 
		"en-dm": "Sick. Sick. You did it. Now select the Beet Seeds! Trust me, it's gonna be good."
	},
	"tut2": {
		"en-us": "", 
		"en-dm": "Next step is planting those Seeds on your Field. Plant them wherever you want!"
	},
	"tut3": {
		"en-us": "", 
		"en-dm": "Good job! You Planted a Beet! When something is Planted on your Field, you generally have to wait several turns for it to grow. Now it's the enemy's turn, so just advance when ready."
	},
	"tut4": {
		"en-us": "", 
		"en-dm": "Your Beet is Ripe! You can now Attack with it. Select 'Attack' from the menu!"
	},
	"tut5": {
		"en-us": "", 
		"en-dm": "When you select 'Attack', any Ripe Crops on your Field will be harvested and launched at your opponent!"
	},
	"tut6": {
		"en-us": "", 
		"en-dm": "Enemy's turn again. It wouldn't be fair if you were the only one who could do anything... :("
	},
	"tut7": {
		"en-us": "", 
		"en-dm": "Alright! Now time to Plant some more Seeds! Select 'Plant' again."
	},
	"tut8": {
		"en-us": "", 
		"en-dm": "This time we're gonna plant a tree! Select the Grape+ Seeds."
	},
	"tut9": {
		"en-us": "", 
		"en-dm": "Trees are big, so they take up more space on your Field! Plant the tree!"
	},
	"tut10": {
		"en-us": "", 
		"en-dm": "Looks like that tree will take four turns to grow. We can wait it out!"
	},
	"tut11": {
		"en-us": "", 
		"en-dm": "While we're waiting, let's try Attacking again. Select 'Attack' from the menu."
	},
	"tut12": {
		"en-us": "", 
		"en-dm": "You can still Attack with no Ripe Crops available, but it isn't going to be as effective."
	},
	"tut13": {
		"en-us": "", 
		"en-dm": "Now we're going to try something a little more interesting..."
	},
	"tut14": {
		"en-us": "", 
		"en-dm": "Select 'Plant' from the menu."
	},
	"tut15": {
		"en-us": "", 
		"en-dm": "Now select the Carrot Seeds. Notice the Time carrots take to grow... and how many turns your Grape Tree has left."
	},
	"tut16": {
		"en-us": "", 
		"en-dm": "Plant those Carrots!"
	},
	"tut17": {
		"en-us": "", 
		"en-dm": "This dumb son-of-a-fuck doesn't know how just how screwed they are."
	},
	"tut18": {
		"en-us": "", 
		"en-dm": "One more time now, select 'Plant'!"
	},
	"tut19": {
		"en-us": "", 
		"en-dm": "Now select those Beet Seeds!"
	},
	"tut20": {
		"en-us": "", 
		"en-dm": "Plant those Beet Seeds!"
	},
	"tut21": {
		"en-us": "", 
		"en-dm": "Do you see where this is going?"
	},
	"tut22": {
		"en-us": "", 
		"en-dm": "Everything's ready! THROW SOME FOOD AT THAT FUCKER!!"
	},
	"tut23": {
		"en-us": "", 
		"en-dm": "Fucking ZING! Ha ha ha, that shit is hilarious. Fuck that guy."
	},
	"tut24": {
		"en-us": "", 
		"en-dm": "Damn. That didn't kill him."
	},
	"tut25": {
		"en-us": "", 
		"en-dm": "Uhhh. Oh yeah, you can take damage too. Maybe select 'Plant'."
	},
	"tut26": {
		"en-us": "", 
		"en-dm": "Truust me on this one, but it's time to plant some Beet Seeds."
	},
	"tut27": {
		"en-us": "", 
		"en-dm": "Just drop 'em anywhere."
	},
	"tut28": {
		"en-us": "", 
		"en-dm": "Alright so you're gonna have to trust me on this one, okay?"
	},
	"tut29": {
		"en-us": "", 
		"en-dm": "Okay... do NOT attack with this Ripe Beet. Select 'Plant' again."
	},
	"tut30": {
		"en-us": "", 
		"en-dm": "Just pick something."
	},
	"tut31": {
		"en-us": "", 
		"en-dm": "Plant it."
	},
	"tut32": {
		"en-us": "", 
		"en-dm": "Alright, now it's time."
	},
	"tut33": {
		"en-us": "", 
		"en-dm": "Select 'Compost' from the menu."
	},
	"tut34": {
		"en-us": "", 
		"en-dm": "Now select your Rotten Beet."
	},
	"tut35": {
		"en-us": "", 
		"en-dm": "Cool cool, coolcoolcool. Now select HEAL."
	},
	"tut36": {
		"en-us": "", 
		"en-dm": "Bam. You can Compost Rotten Crops to recover health. Crops Rot when they age after becoming Ripe. Trees don't Rot, but their Ripe Fruit will fall off and they'll have to regrow."
	},
	"tut37": {
		"en-us": "", 
		"en-dm": "With the right Compost Bin you can even Compost Crops that aren't Rotten... or Attack enemies with your compost!"
	},
	"tut38": {
		"en-us": "", 
		"en-dm": "Now let's FINISH THIS FUTHER MUCKER OFF. You're on your own now, kid!"
	},
	"tut999": {
		"en-us": "", 
		"en-dm": "If you don't want to do the tutorial, you can run away to ignore this dumb robot! But if you get confused later you can come back and learn!"
	},
	"wantTut": {
		"en-us": "", 
		"en-dm": "Greetings, would you like to play through the tutorial?"
	},
	"sYes": {
		"en-us": "", 
		"en-dm": "Yes."
	},
	"sNo": {
		"en-us": "", 
		"en-dm": "No."
	},
	"noTut": {
		"en-us": "", 
		"en-dm": "Okie-dokie!"
	},
	"finTut": {
		"en-us": "", 
		"en-dm": "Congratulations on Tutorialing!"
	},
	"quitTut": {
		"en-us": "", 
		"en-dm": "Don't want to Tutorial after all? Whatevs. Come back later!"
	},
	"robo0": {
		"en-us": "", 
		"en-dm": "beep beep you stupid fuck"
	},
	"robo1": {
		"en-us": "", 
		"en-dm": "hey kid\n i'm a compyoota\n stop all the downloadin'"
	},
	"robo2": {
		"en-us": "", 
		"en-dm": "yo it's time to die motherufcker"
	},
	"robo3": {
		"en-us": "", 
		"en-dm": "beep beep beep beep beep"
	},
	"robo4": {
		"en-us": "", 
		"en-dm": "TODO: give this robot a witty one-liner"
	},
	"research0": {
		"en-us": "", 
		"en-dm": "faculty only here. get the fuck out."
	},
	"research1": {
		"en-us": "", 
		"en-dm": "this is not your place you normie."
	},
	"research2": {
		"en-us": "", 
		"en-dm": "yo it's time to die motherufcker"
	},
	"research3": {
		"en-us": "", 
		"en-dm": "beep beep beep beep beep"
	},
	"research4": {
		"en-us": "", 
		"en-dm": "YOU ARE A HUMAN WHO IS NOT MY BOSS SO I MUST DESTROY YOU"
	},
	"farmMush": {
		"en-us": "", 
		"en-dm": "I've been growing mushrooms on this log for years. It's what one might call... a mushroom log."
	},
	"farmTree": {
		"en-us": "", 
		"en-dm": "bananas tasty mmm yum"
	},
	"farmSprinkler": {
		"en-us": "", 
		"en-dm": "These sprinklers are good, but they don't always get things right."
	},
	"farmHay": {
		"en-us": "", 
		"en-dm": "This nice soft pile of yellow stuff is great for napping on."
	},
	"farmBin": {
		"en-us": "", 
		"en-dm": "A bin full of delicious fruits and veggietables."
	},
	"farmWater": {
		"en-us": "", 
		"en-dm": "Water you doing? Fuck off."
	},
	"farmVeggie": {
		"en-us": "", 
		"en-dm": "These are looking delicious!"
	},
	"hiveGet": {
		"en-us": "", 
		"en-dm": "You found a beehive! You can now place one more beehive on your farm, and you caught some bees, too!"
	},
	"garlic": {
		"en-us": "", 
		"en-dm": "Garlic is as good as ten mothers... because my mum is great and garlic is great yum yum crunch crunch give me that garlic."
	},
	"banana": {
		"en-us": "", 
		"en-dm": "A banana in the hand is worth one in the peel. Sure."
	},
	"s_home": {
		"en-us": "", 
		"en-dm": "Home sweet home... I can hardly believe that all these robot hijinks are happening."
	},
	"s_homesleep": {
		"en-us": "", 
		"en-dm": "A bit of rest should clear my mind."
	},
	"s_homeleave": {
		"en-us": "", 
		"en-dm": "I should get going. There's apparently a lot I need to do today."
	}
};
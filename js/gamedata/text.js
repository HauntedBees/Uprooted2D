function GetText(key) {
	try {
		var lang = (game !== undefined) ? game.language : "en-dm";
		var d = fulltext[key];
		if(d[lang] !== undefined) { return d[lang]; }
		return d["en-us"];
	} catch(e) {
		console.log("Couldn't find key: " + key);
		return "fucko"; //throw e;
	}
}
function HandleArticles(mainStr, subject) { // this is English-language specific; oops!
	if(subject === undefined || subject === "" || mainStr.indexOf("{an}") < 0) { return mainStr; }
	if(subject[subject.length - 1] === "s") {
		return mainStr.replace(/\{an\}/g, "");
	} else if("aeiou".indexOf(subject[0].toLowerCase()) >= 0) {
		return mainStr.replace(/\{an\}/g, " an");
	} else {
		return mainStr.replace(/\{an\}/g, " a");
	}
}
function HasText(key) { return fulltext[key] !== undefined; }
var fulltext = {
	// Items
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
	"goldegg": {
		"en-us": "", 
		"en-dm": "A strange fairy from the lake by your farm gave you this egg. It looks like it's pretty one-of-a-kind so you should definitely hold onto it until the final battle and then forget to use it.", 
		"type": "item"
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
	"gmocorn": {
		"en-us": "", 
		"en-dm": "A quirky robot gave you these questionable seeds. They look like they're pretty rare so you should definitely hold onto them until the final battle and then forget to use them.", 
		"type": "item"
	},
	"ultrarod": {
		"en-us": "", 
		"en-dm": "This fishing rod has the best bait ever! It looks like it's pretty rare so you should definitely hold onto it until the final battle and then forget to use it.", 
		"type": "item"
	},
	"goodfood": {
		"en-us": "", 
		"en-dm": "A super tasty and healthy feed for animals. Feeding a cow this will lead to milk that recovers LOTS of health, so you should definitely hold onto it until the final battle and then forget to use it.", 
		"type": "item"
	},
	"notdrugs": {
		"en-us": "", 
		"en-dm": "Totally ordinary mushroom seeds. Their spores can stun enemies. They look pretty rare so you should definitely hold onto them until the final battle and then forget to use them.", 
		"type": "item"
	},
	"asparagus": {
		"en-us": "", 
		"en-dm": "When Gus eats a lot of pears, then shits, this is what you get. Ass Pear a'Gus.", 
		"type": "item"
	},
	"bellpepper": {
		"en-us": "", 
		"en-dm": "Bell Peppies are great.", 
		"type": "item"
	},
	"radish": {
		"en-us": "", 
		"en-dm": "Not quite rad.", 
		"type": "item"
	},
	"spinach": {
		"en-us": "", 
		"en-dm": "Is that one cartoon sailor's motto in the public domain yet? I'll play it safe and assume it isn't, so just IMAGINE that it's here.", 
		"type": "item"
	},
	"tomato": {
		"en-us": "", 
		"en-dm": "You say \"tomato,\" I say \"this expression doesn't translate too well to a text-based format.\"", 
		"type": "item"
	},
	"apricot": {
		"en-us": "", 
		"en-dm": "Pretend you know some rude fellow named \"Ott.\" You could say to him, \"ey prick! Ott!\" and if he gets mad you can just pretend you were loudly identifying a fruit, not insulting him.", 
		"type": "item"
	},
	"avocado": {
		"en-us": "", 
		"en-dm": "How dare you. Avocados? Now you'll never be a homeowner, you fucking millenial.", 
		"type": "item"
	},
	"blackberry": {
		"en-us": "", 
		"en-dm": "These sweet and juicy berries taste as good as they look. Unless you think they look bad. In that case, they taste better than they look!", 
		"type": "item"
	},
	"kiwi": {
		"en-us": "", 
		"en-dm": "Not the bird.", 
		"type": "item"
	},
	"mango": {
		"en-us": "", 
		"en-dm": "Man go \"beep beep!\"", 
		"type": "item"
	},
	"lotus": {
		"en-us": "", 
		"en-dm": "Lotus flowers are very beautiful. Lotus fruits, however, are a common cause of trypophobia. That shit's fuckin' creepy, man.", 
		"type": "item"
	},
	// Options
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
	"diffEasy.i": {
		"en-us": "", 
		"en-dm": "You cannot die in combat. Enemies have less health. Items are cheaper.", 
		"type": "opts"
	},
	"diffNormal.i": {
		"en-us": "", 
		"en-dm": "Everything is balanced for a fair and enjoyable experience for most players.", 
		"type": "opts"
	},
	"diffHard.i": {
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
	// Area 0: Opening Cutscene
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
	"Pb0.0": {
		"en-us": "", 
		"en-dm": "That was a weird situation. I wonder why that guy sucked so much.", 
		"type": "map"
	},
	"Pb0.1": {
		"en-us": "", 
		"en-dm": "Oh well, I should probably head back to my farm now.", 
		"type": "map"
	},
	// Area 0: Tutorial
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
	"tutEnemy2": {
		"en-us": "", 
		"en-dm": "{0} is prepared to lecture you on the importance of cryptocurrencies.", 
		"type": "combat"
	},
	"tutEnemy5": {
		"en-us": "", 
		"en-dm": "{0} wants you to know that the future of the world is in the hands of like 4 startups in California.", 
		"type": "combat"
	},
	"tutEnemy9": {
		"en-us": "", 
		"en-dm": "{0} thinks you should listen to its podcast.", 
		"type": "combat"
	},
	"tutEnemy12": {
		"en-us": "", 
		"en-dm": "{0} is just playing Devil's Advocate, it's not that big of a deal.", 
		"type": "combat"
	},
	"tutEnemy16": {
		"en-us": "", 
		"en-dm": "{0} is finding it hard to discuss things with you if you aren't willing to listen.", 
		"type": "combat"
	},
	"tutEnemy20": {
		"en-us": "", 
		"en-dm": "{0} wishes you'd cut that out.", 
		"type": "combat"
	},
	"tutEnemy23": {
		"en-us": "", 
		"en-dm": "{0} headbutts you for {1} damage.", 
		"type": "combat"
	},
	"tutEnemy27": {
		"en-us": "", 
		"en-dm": "{0} is sorry they hurt you.", 
		"type": "combat"
	},
	"tutEnemy31": {
		"en-us": "", 
		"en-dm": "{0} hopes you can see things through their perspective.", 
		"type": "combat"
	},
	"tutEnemy36": {
		"en-us": "", 
		"en-dm": "{0} is prepared to die.", 
		"type": "combat"
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
	// Area 1: Farm
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
	"B1.0": {
		"en-us": "", 
		"en-dm": "Robot: hI hEllo yEs i aM a tEchnology rObot sEnt tO rEsearch tHis fArm.", 
		"type": "map"
	},
	"B1.1": {
		"en-us": "", 
		"en-dm": "Robot: aLso bY \"rEsearch\" i mEan \"lOot aNd pIllage.\"", 
		"type": "map"
	},
	"B1.2": {
		"en-us": "", 
		"en-dm": "Robot: oH sHit tHis iS yOur fArm? fUck. i mEan... uHhhh... wAnt gIrl sCout cOokies?", 
		"type": "map"
	},
	"B1.3": {
		"en-us": "", 
		"en-dm": "Robot: ...", 
		"type": "map"
	},
	"B1.4": {
		"en-us": "", 
		"en-dm": "Robot: ...nOt bUying iT? oKay, fIne. lEt's tHrow dOwn.", 
		"type": "map"
	},
	"B1.5": {
		"en-us": "", 
		"en-dm": "Robot: bAck fOr mOre, aRe yA? hAhaha. i'Ll gLadly dEfeat yOu aGain!", 
		"type": "map"
	},
	"Pb1.0": {
		"en-us": "", 
		"en-dm": "The remains of the robot are ticking, as if they are about to explode.", 
		"type": "map"
	},
	"Pb1.1": {
		"en-us": "", 
		"en-dm": "Inside of it, you can see a large bag of seeds the robot stole from your farm and a \"Season Modulator.\"", 
		"type": "map"
	},
	"Pb1.2": {
		"en-us": "", 
		"en-dm": "You suspect you only have time to grab one of them before it explodes. Which will you grab?", 
		"type": "map"
	},
	"Pb1.2a": {
		"en-us": "", 
		"en-dm": "Grab the bag of seeds.", 
		"type": "choice"
	},
	"Pb1.2b": {
		"en-us": "", 
		"en-dm": "Grab the Season Modulator.", 
		"type": "choice"
	},
	"Pb1.2a0": {
		"en-us": "", 
		"en-dm": "You grab the bag of seeds. Wow, that's a lot of seeds! You can check them out in your inventory!", 
		"type": "map"
	},
	"Pb1.2b0": {
		"en-us": "", 
		"en-dm": "You pry the Season Modulator out of the machine. You can add it to your Field in the Fixtures menu!", 
		"type": "map"
	},
	"Pb1.3": {
		"en-us": "", 
		"en-dm": "As soon as your hands are out, the machine collapses in front of you, letting out a quiet farting noise.", 
		"type": "map"
	},
	"Pb1.4": {
		"en-us": "", 
		"en-dm": "It doesn't look like you'll be able to recover anything else from this pile of junk; it's too heavy to move.", 
		"type": "map"
	},
	"Pb1.5": {
		"en-us": "", 
		"en-dm": "Either way, he said he came from a research plant down south. I should check that out.", 
		"type": "map"
	},
	"s.home": {
		"en-us": "", 
		"en-dm": "Home sweet home... I can hardly believe that all these robot hijinks are happening.", 
		"type": "shop"
	},
	"s.homesleep": {
		"en-us": "", 
		"en-dm": "A bit of rest should clear my mind.", 
		"type": "shop"
	},
	"s.homeleave": {
		"en-us": "", 
		"en-dm": "I should get going. There's apparently a lot I need to do today.", 
		"type": "shop"
	},
	// Area 2: Produce Stand / First Village
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
	"lakeegg.reject": {
		"en-us": "", 
		"en-dm": "Good call. Why would you throw a perfectly good egg in a lake, anyway?", 
		"type": "map"
	},
	"lakeegg.okay": {
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
	"goodEggTry": {
		"en-us": "", 
		"en-dm": "What a beautiful lake. Pretty fucked up that there's some weird egg spirit living down there, though. People DRINK from this lake!", 
		"type": "map"
	},
	"farmFirst": {
		"en-us": "", 
		"en-dm": "I should go to my farm first before I head into town.", 
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
	"villager0": {
		"en-us": "", 
		"en-dm": "Dean: Be careful in the forest west of town; it's way too easy to get lost in there!", 
		"type": "map"
	},
	"villager1": {
		"en-us": "", 
		"en-dm": "June: Rumor has it if you throw a chicken egg in the lake north of here, something amazing will happen!", 
		"type": "map"
	},
	"villager2": {
		"en-us": "", 
		"en-dm": "Aiko: There've been a lot of robots wandering through here since that lab got set up south of here. I wonder what that's all about.", 
		"type": "map"
	},
	"villager3": {
		"en-us": "", 
		"en-dm": "Tanner: How's your truck doin'? Cool, cool. Take care of that bad boy, I feel like you're gonna need it.", 
		"type": "map"
	},
	// Area 3: Forest
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
	"lime.lemon": {
		"en-us": "", 
		"en-dm": "Give Lemon Seeds.", 
		"type": "choice"
	},
	"lime.banana": {
		"en-us": "", 
		"en-dm": "Give Banana Seeds.", 
		"type": "choice"
	},
	"lime.corn": {
		"en-us": "", 
		"en-dm": "Give Corn Seeds.", 
		"type": "choice"
	},
	"lime.goldegg": {
		"en-us": "", 
		"en-dm": "Give Golden Egg.", 
		"type": "choice"
	},
	"lime.lemon1": {
		"en-us": "", 
		"en-dm": "Lime: Lemons? What the fuck?! Who the fuck just EATS LEMONS?!", 
		"type": "map"
	},
	"lime.lemon2": {
		"en-us": "", 
		"en-dm": "Lime: I want a tasty TREAT, not something to squeeze into my fucking aioli!", 
		"type": "map"
	},
	"lime.lemon3": {
		"en-us": "", 
		"en-dm": "Lime: Come back when you learn what TASTY means, asshole!", 
		"type": "map"
	},
	"lime.banana1": {
		"en-us": "", 
		"en-dm": "Lime: Bananas, eh? I mean the peel is yellow, so that counts I guess.", 
		"type": "map"
	},
	"lime.banana2": {
		"en-us": "", 
		"en-dm": "Lime: Bananas ARE pretty tasty, too... so, thank you, mysterious stranger! I will use these banana seeds wisely!", 
		"type": "map"
	},
	"lime.banana3": {
		"en-us": "", 
		"en-dm": "Lime: In exchange, have some other tasty yellow food seeds: corn!", 
		"type": "map"
	},
	"lime.corn1": {
		"en-us": "", 
		"en-dm": "Lime: Corn, eh? Yellow. Crunchy. Tasty. You nailed it!", 
		"type": "map"
	},
	"lime.corn2": {
		"en-us": "", 
		"en-dm": "Lime: Thank you, mysterious stranger! I will use these corn seeds wisely!", 
		"type": "map"
	},
	"lime.corn3": {
		"en-us": "", 
		"en-dm": "Lime: In exchange, have some other tasty yellow food seeds: bananas!", 
		"type": "map"
	},
	"lime.egg1": {
		"en-us": "", 
		"en-dm": "Lime: A golden egg... wow. You found such a rare and valuable item and you're just giving it to me?", 
		"type": "map"
	},
	"lime.egg2": {
		"en-us": "", 
		"en-dm": "Lime: But alas... gold isn't REALLY yellow... and I'm a vegan, so this is definitely not a tasty yellow food.", 
		"type": "map"
	},
	"lime.egg3": {
		"en-us": "", 
		"en-dm": "Lime: But I cannot just dismiss such a generous gift! Here, take these coconut seeds. You won't find these anywhere else around here!", 
		"type": "map"
	},
	"lime.complete": {
		"en-us": "", 
		"en-dm": "Lime: Thank you again for your generosity.", 
		"type": "map"
	},
	"lime.nope": {
		"en-us": "", 
		"en-dm": "Give nothing.", 
		"type": "choice"
	},
	"lime.denied": {
		"en-us": "", 
		"en-dm": "Lime: It seems my senses were wrong! Let me know if you do come across anything!", 
		"type": "map"
	},
	// Area 4: Research Lab
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
	"rap.garlic": {
		"en-us": "", 
		"en-dm": "Give Garlic Seeds.", 
		"type": "choice"
	},
	"rap.coconut": {
		"en-us": "", 
		"en-dm": "Give Coconut Seeds.", 
		"type": "choice"
	},
	"rap.rice": {
		"en-us": "", 
		"en-dm": "Give Rice Seeds.", 
		"type": "choice"
	},
	"rap.garlic1": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: This is... \"garlic?\"", 
		"type": "map"
	},
	"rap.garlic2": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: Let me see... it appears to have preservative qualities, as well as various health benefits.", 
		"type": "map"
	},
	"rap.garlic3": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: It seems parts of it have insecticide properties, and some of its juices an be used for adhesive purposes.", 
		"type": "map"
	},
	"rap.garlic4": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: It can be stored warm for longer periods than many crops... it has antiseptic qualities... hm, yes, yes, this is all very good.", 
		"type": "map"
	},
	"rap.garlic5": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: I will accept this \"garlic,\" thank you muchly!", 
		"type": "map"
	},
	"rap.normalgift": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: In return for this crop, I will give you some delicious delicious batteries. Enjoy!", 
		"type": "map"
	},
	"rap.thanks": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: Thank you again for your help.", 
		"type": "map"
	},
	"rap.rice1": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: This is... \"rice?\"", 
		"type": "map"
	},
	"rap.rice2": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: This appears to have many interesting properties... this is a good starchy grain.", 
		"type": "map"
	},
	"rap.rice3": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: I predict this can be used to create flour, a milk-like liquid, alcohol, and other useful materials.", 
		"type": "map"
	},
	"rap.rice4": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: I will accept this \"rice,\" thank you muchly!", 
		"type": "map"
	},
	"rap.coconut1": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: This is... \"coconut?\"", 
		"type": "map"
	},
	"rap.coconut2": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: Its fibrous husk looks like it can be used in many ways, as can its hard shell.", 
		"type": "map"
	},
	"rap.coconut3": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: It also appears to produce various useful liquids - coconut water, coconut oil, and coconut milk.", 
		"type": "map"
	},
	"rap.coconut4": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: And its meat, of course, can be used in many different recipes.", 
		"type": "map"
	},
	"rap.coconut5": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: Hmm, yes, yes, this is an excellent crop. This is exactly what I needed, thank you.", 
		"type": "map"
	},
	"rap.coconut6": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: To thank you for this exceptional crop, I will give you these Genetically Modified Corn Seeds.", 
		"type": "map"
	},
	"rap.coconut7": {
		"en-us": "", 
		"en-dm": "RAPBATTLE: They may be a bit... TOO genetically modified for human consumption, but I am sure you can find some use for them.", 
		"type": "map"
	},
	"bookshelf.left": {
		"en-us": "", 
		"en-dm": "This shelf has lots of science textbooks on it, as well as a globe with various regions circled.", 
		"type": "map"
	},
	"bookshelf.mid": {
		"en-us": "", 
		"en-dm": "This shelf contains several volumes of the \"Mr. History and his Time-Travelling Mysteries\" series, as well as many books with woodcut animals on them.", 
		"type": "map"
	},
	"bookshelf.right": {
		"en-us": "", 
		"en-dm": "A mildly broken robot is being repaired on the bottom shelf, while the top shelf holds a replica sword and a figurine of a cartoon character.", 
		"type": "map"
	},
	"broken.robot": {
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
	"B2.0": {
		"en-us": "", 
		"en-dm": "???: Yes, yes. Interesting, this is very good data.", 
		"type": "map"
	},
	"B2.1": {
		"en-us": "", 
		"en-dm": "???: You! Get out of my laboratory! I am very busy right now!", 
		"type": "map"
	},
	"B2.2": {
		"en-us": "", 
		"en-dm": "???: Hmmm, wait a minute. Stay. I recognize you. You're the one who destroyed my research robot.", 
		"type": "map"
	},
	"B2.3": {
		"en-us": "", 
		"en-dm": "???: My name is Jeff Smith, Ph.D. One of the smartest minds in the world. Too smart to waste time being humble, mind you.", 
		"type": "map"
	},
	"B2.4": {
		"en-us": "", 
		"en-dm": "Jeff: I am helping--- ahem. That's DOCTOR Jeff, thank you.", 
		"type": "map"
	},
	"B2.5": {
		"en-us": "", 
		"en-dm": "Dr. Jeff: I am helping an old friend by doing some groundbreaking research answering the age old question of \"what is food?\"", 
		"type": "map"
	},
	"B2.6": {
		"en-us": "", 
		"en-dm": "Dr. Jeff: An apple is good for you. Is a baked apple just as good for you? What about apple sauce?", 
		"type": "map"
	},
	"B2.7": {
		"en-us": "", 
		"en-dm": "Dr. Jeff: What about a proprietary mulch made from apple and apple byproducts? Are cars food?", 
		"type": "map"
	},
	"B2.8": {
		"en-us": "", 
		"en-dm": "Dr. Jeff: If the answer to any of those questions is \"no,\" then the followup question is \"why?\" That is what I intend to answer.", 
		"type": "map"
	},
	"B2.9": {
		"en-us": "", 
		"en-dm": "Dr. Jeff: With this knowledge, my friend's startup will be able to create the perfect food substitute, and will change the world forever!", 
		"type": "map"
	},
	"B2.10": {
		"en-us": "", 
		"en-dm": "\"Dr.\" Jeff: And, of course, people who change the world are often rewarded handsomely for it. I would know, I've read a history book before.", 
		"type": "map"
	},
	"B2.11": {
		"en-us": "", 
		"en-dm": "\"Dr.\" Jeff: But it seems you are intent on thwarting the evolution of food. And for that, I must thwart you.", 
		"type": "map"
	},
	"B2.12": {
		"en-us": "", 
		"en-dm": "Jeff: Still not convinced? I will just have to beat some more sense into you! And that's DOCTOR Jeff!!!!", 
		"type": "map"
	},
	"Pb2.0": {
		"en-us": "", 
		"en-dm": "Jeff: Ugh... it seems I underestimated you... do you also have a Ph.D?", 
		"type": "map"
	},
	"Pb2.1": {
		"en-us": "", 
		"en-dm": "Jeff: Wh-what?! I lost to someone... who never even went to college... ugh...", 
		"type": "map"
	},
	"Pb2.2": {
		"en-us": "", 
		"en-dm": "Jeff: Going to college, then being too smart for it and dropping out is one thing... but never going at all? Ugh... insulting.", 
		"type": "map"
	},
	"Pb2.3": {
		"en-us": "", 
		"en-dm": "Jeff: I'm sorry, Beckett... I'm sorry, Food2... I've failed you... all my research... for nothing...", 
		"type": "map"
	},
	"Pb2.4": {
		"en-us": "", 
		"en-dm": "Beckett... that's the man who was at my produce stand earlier. \"Food2\" must be his start-up!", 
		"type": "map"
	},
	"Pb2.5": {
		"en-us": "", 
		"en-dm": "Jeff: You may have beaten me... but you'll never stop Food2... not without grabbing exactly one of those three things over there, at least...", 
		"type": "map"
	},
	"Pb2.6": {
		"en-us": "", 
		"en-dm": "You turn to what Jeff is pointing at. In the corner of the room are three items: a Seed Shooter, a large bag of seeds, and a healthy drink.", 
		"type": "map"
	},
	"Pb2.7": {
		"en-us": "", 
		"en-dm": "The Seed Shooter is a Fixture that can be placed on your Field to instantly damage all enemies.", 
		"type": "map"
	},
	"Pb2.8": {
		"en-us": "", 
		"en-dm": "The large bag of seeds contains lots of fruit tree seeds, some of which you haven't been able to find or grow yourself.", 
		"type": "map"
	},
	"Pb2.9": {
		"en-us": "", 
		"en-dm": "The healthy drink will level you up, giving you more health, attack power, and defense.", 
		"type": "map"
	},
	"Pb2.10": {
		"en-us": "", 
		"en-dm": "Which will you grab?", 
		"type": "map"
	},
	"Pb2.10a": {
		"en-us": "", 
		"en-dm": "Grab the Seed Shooter.", 
		"type": "choice"
	},
	"Pb2.10b": {
		"en-us": "", 
		"en-dm": "Grab the bag of seeds.", 
		"type": "choice"
	},
	"Pb2.10c": {
		"en-us": "", 
		"en-dm": "Grab the healthy drink.", 
		"type": "choice"
	},
	"Pb2.10a0": {
		"en-us": "", 
		"en-dm": "You grab the Seed Shooter. You can add it to your Field from the Fixtures menu in your Inventory.", 
		"type": "map"
	},
	"Pb2.10b0": {
		"en-us": "", 
		"en-dm": "You grab the bag of seeds. You can see your seeds in the Seeds menu in your Inventory.", 
		"type": "map"
	},
	"Pb2.10c0": {
		"en-us": "", 
		"en-dm": "You guzzle down the healthy drink. You gained three levels! *gamer voice* Nice!", 
		"type": "map"
	},
	"Pb2.11": {
		"en-us": "", 
		"en-dm": "Jeff: I'm not sure... why I told you... to do that... ughh.....", 
		"type": "map"
	},
	"Pb2.12": {
		"en-us": "", 
		"en-dm": "Jeff falls to the ground, unconscious.", 
		"type": "map"
	},
	"Pb2.13": {
		"en-us": "", 
		"en-dm": "Looks like it's time to get in my truck and head to the city. These Food2 goons need to be taught a lesson.", 
		"type": "map"
	},
	// Area 5: Bridge / Underwater
	"SignMermaid": {
		"en-us": "", 
		"en-dm": "Mermaid Shoppe", 
		"type": "map"
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
	"SignMermaidInn": {
		"en-us": "", 
		"en-dm": "Mermaid Inn", 
		"type": "map"
	},
	"constr1.foe": {
		"en-us": "", 
		"en-dm": "gonna fuck you up", 
		"type": "map"
	},
	"constr1.fr1": {
		"en-us": "", 
		"en-dm": "hey there. We under construction, so you can't drive through here.", 
		"type": "map"
	},
	"constr1.fr2": {
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
	// Area 6: Fake Farm
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
	"HK.s0": {
		"en-us": "", 
		"en-dm": "I don't know what this is.", 
		"type": "map"
	},
	"HK.s1": {
		"en-us": "", 
		"en-dm": "This is a \"HOUSEKEEPER\" model smart speaker.", 
		"type": "map"
	},
	"HK.s2": {
		"en-us": "", 
		"en-dm": "You can talk to it and it'll turn on lights in your house, or set the thermostat temperature, or send your personal data to advertisers.", 
		"type": "map"
	},
	"fakeFarm18": {
		"en-us": "", 
		"en-dm": "Actually Just Jeff: I'll never let you out of here!", 
		"type": "map"
	},
	"s.up2": {
		"en-us": "", 
		"en-dm": "Do you wish you had more tiles to plant crops in? Wish no more! I can give you more tiles to work with!", 
		"type": "shop"
	},
	"s.up2p": {
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
	"arf.none": {
		"en-us": "", 
		"en-dm": "Crouton: Damn. If you have any fishing tools or good bait, holler at me.", 
		"type": "map"
	},
	"arf.spear": {
		"en-us": "", 
		"en-dm": "Give Fish Spear.", 
		"type": "choice"
	},
	"arf.net": {
		"en-us": "", 
		"en-dm": "Give Fish Net.", 
		"type": "choice"
	},
	"arf.bignet": {
		"en-us": "", 
		"en-dm": "Give Big Net.", 
		"type": "choice"
	},
	"arf.metalrod": {
		"en-us": "", 
		"en-dm": "Give Metal Rod.", 
		"type": "choice"
	},
	"arf.ultrarod": {
		"en-us": "", 
		"en-dm": "Give Master Bait.", 
		"type": "choice"
	},
	"arf.spear0": {
		"en-us": "", 
		"en-dm": "Crouton: A spear, eh? I dunno if I'd be able to work that with my tiny doggy paws.", 
		"type": "map"
	},
	"arf.spear1": {
		"en-us": "", 
		"en-dm": "Crouton: I appreciate the sentiment, but I may need something a little more hands-off.", 
		"type": "map"
	},
	"arf.good0": {
		"en-us": "", 
		"en-dm": "Crouton: Bow-WOW! Now THIS could catch me some fishies!", 
		"type": "map"
	},
	"arf.good1": {
		"en-us": "", 
		"en-dm": "Crouton: Thanks, buddy! Here's some fodder as a reward. You can feed it to a cow to get plenty of health-recovering milk!", 
		"type": "map"
	},
	"arf.good2": {
		"en-us": "", 
		"en-dm": "Crouton: Don't have a cow? Don't have a cow! There's a shop in one of the stalls inside this fake-ass barn that sells them!", 
		"type": "map"
	},
	"arf.ultra0": {
		"en-us": "", 
		"en-dm": "Crouton: Oh wow, now THAT is some fish bait! I'll definitely catch some amazing fish with this!", 
		"type": "map"
	},
	"arf.ultra1": {
		"en-us": "", 
		"en-dm": "Crouton: Thanks a million! Here's some premium food as a reward! You can feed it to a cow to get super powerful health-recovering milk!", 
		"type": "map"
	},
	"arf.thanks": {
		"en-us": "", 
		"en-dm": "Crouton: You give a dog a fish, you feed him for a day. You teach a dog to fish, you're gonna win some fucking dog shows.", 
		"type": "map"
	},
	// Area 7: South City
	"entercity0": {
		"en-us": "", 
		"en-dm": "!!!: Hey! Who's that over there??!", 
		"type": "map"
	},
	"entercity1": {
		"en-us": "", 
		"en-dm": "???: Psst! Over here! Come quick!", 
		"type": "map"
	},
	"entercity2": {
		"en-us": "", 
		"en-dm": "???: Quick, hide behind the bar! I'll explain later!", 
		"type": "map"
	},
	"entercity3": {
		"en-us": "", 
		"en-dm": "???: Ah, ah! Mr. Bruno! Welcome! What can I--", 
		"type": "map"
	},
	"entercity4": {
		"en-us": "", 
		"en-dm": "Bruno: I just saw someone run in here. Who was it? Was it the farmer?", 
		"type": "map"
	},
	"entercity5": {
		"en-us": "", 
		"en-dm": "???: What? No! Don't be silly! That was just me! I was chasing a rat out!", 
		"type": "map"
	},
	"entercity6": {
		"en-us": "", 
		"en-dm": "Bruno: ...you got rats?", 
		"type": "map"
	},
	"entercity7": {
		"en-us": "", 
		"en-dm": "???: Oh, no, no, no! Just one or two from time to time!", 
		"type": "map"
	},
	"entercity8": {
		"en-us": "", 
		"en-dm": "Bruno: ...Alright. I'll have a drink. On the house. No rats.", 
		"type": "map"
	},
	"entercity9": {
		"en-us": "", 
		"en-dm": "???: One drink, coming right up!", 
		"type": "map"
	},
	"entercity10": {
		"en-us": "", 
		"en-dm": "Bruno: You know, if you've got rats, that might be a health code violation. I think I know a, uh, \"health inspector.\"", 
		"type": "map"
	},
	"entercity11": {
		"en-us": "", 
		"en-dm": "Bruno: It'd be unfortunate for your little lemonade stand here to go under because of a few rats, if you know what I'm sayin'.", 
		"type": "map"
	},
	"entercity12": {
		"en-us": "", 
		"en-dm": "It sounds like this mobster is trying to extort this bartender! What will you do?", 
		"type": "map"
	},
	"mobchoice0": {
		"en-us": "", 
		"en-dm": "Stand up for the bartender.", 
		"type": "choice"
	},
	"mobchoice1": {
		"en-us": "", 
		"en-dm": "Stay hidden for now.", 
		"type": "choice"
	},
	"entercity0.0": {
		"en-us": "", 
		"en-dm": "Bruno: Hey, what the--?!", 
		"type": "map"
	},
	"entercity0.1": {
		"en-us": "", 
		"en-dm": "???: I told you to-- I mean, EGADS! THAT'S NOT A RAT! THAT'S A HUMAN WOMAN!", 
		"type": "map"
	},
	"entercity0.2": {
		"en-us": "", 
		"en-dm": "Bruno: THAT'S THE FARMER!!", 
		"type": "map"
	},
	"entercity0.3": {
		"en-us": "", 
		"en-dm": "???: RATS CAN'T BE FARMERS!! THEIR TINY HANDS CAN'T HOLD TOOLS!! THIS IS ALL VERY SURPRISING TO ME!!", 
		"type": "map"
	},
	"entercity0.4": {
		"en-us": "", 
		"en-dm": "Bruno: Shut up! I'll deal with YOU later!", 
		"type": "map"
	},
	"entercity0.5": {
		"en-us": "", 
		"en-dm": "Bruno: You're goin' down, lady!", 
		"type": "map"
	},
	"entercity1.0": {
		"en-us": "", 
		"en-dm": "???: ...I think I understand what you're getting at.", 
		"type": "map"
	},
	"entercity1.1": {
		"en-us": "", 
		"en-dm": "The bartender opens the cash register, pulls out some money, and hands it to the mobster.", 
		"type": "map"
	},
	"entercity1.2": {
		"en-us": "", 
		"en-dm": "Bruno: Hmm, yeah, I think I can forget about those rats now.", 
		"type": "map"
	},
	"entercity1.3": {
		"en-us": "", 
		"en-dm": "Bruno: Keep up the good work, and if you see that farmer, TELL ONE OF US IMMEDIATELY.", 
		"type": "map"
	},
	"entercity1.4": {
		"en-us": "", 
		"en-dm": "???: Of course I will! Absolutely!", 
		"type": "map"
	},
	"entercity1.5": {
		"en-us": "", 
		"en-dm": "???: ... ... ...", 
		"type": "map"
	},
	"entercity1.6": {
		"en-us": "", 
		"en-dm": "???: ...Okay, I think it's safe for you to come out now.", 
		"type": "map"
	},
	"entercity1.7": {
		"en-us": "", 
		"en-dm": "???: I'm sorry you had to see that.", 
		"type": "map"
	},
	"entercity0.pb0": {
		"en-us": "", 
		"en-dm": "???: Wow... we're lucky he's one of the dumber ones. If I tell him he just drank too much and passed out, he'll probably buy it.", 
		"type": "map"
	},
	"entercity0.pb1": {
		"en-us": "", 
		"en-dm": "???: ...Thank you. Thank you very much. You really helped me out just now.", 
		"type": "map"
	},
	"entercity0.pb2": {
		"en-us": "", 
		"en-dm": "???: If you need to stay here, you can stay the night any time. No charge for you.", 
		"type": "map"
	},
	"entercity2.0": {
		"en-us": "", 
		"en-dm": "???: Anyway, I'm Skumpy, the owner of this inn. As you might have guessed, we have a bit of a mob problem.", 
		"type": "map"
	},
	"entercity2.1": {
		"en-us": "", 
		"en-dm": "Skumpy: Apparently some farmer will be coming through here to get to the city, and they're trying to cut her off.", 
		"type": "map"
	},
	"entercity2.2": {
		"en-us": "", 
		"en-dm": "Skumpy: I think it's safe to say that you're the farmer they're looking for.", 
		"type": "map"
	},
	"entercity2.3": {
		"en-us": "", 
		"en-dm": "Skumpy: I can't say I know what they'll do to you if they catch you, or who hired them.", 
		"type": "map"
	},
	"entercity2.4": {
		"en-us": "", 
		"en-dm": "Skumpy: But whoever you pissed off, they're taking it out pretty badly on us. Those mobsters are crawling the streets 24/7.", 
		"type": "map"
	},
	"entercity2.5": {
		"en-us": "", 
		"en-dm": "Skumpy: They haven't hurt anybody, but they make it pretty clear that the best way to keep it that way is by paying their \"fees.\"", 
		"type": "map"
	},
	"entercity2.6": {
		"en-us": "", 
		"en-dm": "Skumpy: Either way, the city is swarming with them, so if you're still determined to get into the city, you'd better be careful.", 
		"type": "map"
	},
	"entercity2.7": {
		"en-us": "", 
		"en-dm": "Skumpy: They've set up a sort of home base just west of here, so if stealth isn't your thing, you can try to deal with them directly.", 
		"type": "map"
	},
	"entercity2.8": {
		"en-us": "", 
		"en-dm": "Skumpy: Otherwise, stay to the east of town. That's where most of the shops are, anyway.", 
		"type": "map"
	},
	"entercity2.9": {
		"en-us": "", 
		"en-dm": "Skumpy: Good luck, stranger.", 
		"type": "map"
	},
	"entercityBAD0": {
		"en-us": "", 
		"en-dm": "Bruno: ... ... Yeah, hey boss. It's me.", 
		"type": "map"
	},
	"entercityBAD1": {
		"en-us": "", 
		"en-dm": "Bruno: Yeah, I found the farmer at Skumpy's. She's been, ah, \"taken care of.\"", 
		"type": "map"
	},
	"entercityBAD2": {
		"en-us": "", 
		"en-dm": "Bruno: ...Yes, by \"taken care of\" I mean she is dead. She is a dead corpse who isn't alive no more because I shot her a lot with bullets.", 
		"type": "map"
	},
	"entercityBAD3": {
		"en-us": "", 
		"en-dm": "Bruno: Yes, bullets from my gun, boss. Gun bullets.", 
		"type": "map"
	},
	"entercityBAD4": {
		"en-us": "", 
		"en-dm": "Bruno: Boss, your complete and utter inability to understand metaphors or read between the lines is really a burden to this mob.", 
		"type": "map"
	},
	"entercityBAD5": {
		"en-us": "", 
		"en-dm": "Bruno: Yes, yes, she is DEAD. NOT ALIVE. SHE HAS CEASED TO BE. SHE IS SOON TO BE BURIED.", 
		"type": "map"
	},
	"entercityBAD6": {
		"en-us": "", 
		"en-dm": "Bruno: ...Yes, I suppose she could also be cremated but I feel like you are missing the point here, boss.", 
		"type": "map"
	},
	"entercityBAD7": {
		"en-us": "", 
		"en-dm": "Bruno: Yes, yes, there are many ways to dispose of a dead body, boss. That's not what is important right now.", 
		"type": "map"
	},
	"entercityBAD8": {
		"en-us": "", 
		"en-dm": "Bruno: Boss... BOSS... Boss I'm hanging up now. Boss-- ah, screw it.", 
		"type": "map"
	},
	"entercityBAD9": {
		"en-us": "", 
		"en-dm": "*click*", 
		"type": "map"
	},
	"kindLady0": {
		"en-us": "", 
		"en-dm": "Old Lady: Oh, hello, dearie! Looks like you're not too afraid of these bad men either, are you?", 
		"type": "map"
	},
	"kindLady1": {
		"en-us": "", 
		"en-dm": "Old Lady: Me? They may be criminals, but even they aren't going to bother an old lady like me.", 
		"type": "map"
	},
	"kindLady2": {
		"en-us": "", 
		"en-dm": "Old Lady: As long as I keep to myself, feeding the birds and not insulting them too much, they leave me alone.", 
		"type": "map"
	},
	"kindLady3": {
		"en-us": "", 
		"en-dm": "Old Lady: But I have run into a bit of a snag there... I've run out of birdseed!", 
		"type": "map"
	},
	"kindLady4": {
		"en-us": "", 
		"en-dm": "Old Lady: Normally I'd just go buy more, but with these mobsters here nobody is delivering any shipments to the stores!", 
		"type": "map"
	},
	"kindLady5": {
		"en-us": "", 
		"en-dm": "Old Lady: So if you could find some food to feed these birds, I'd be ever so grateful!", 
		"type": "map"
	},
	"kindLadyX": {
		"en-us": "", 
		"en-dm": "Old Lady: If you have any food for birds, I'd be ever so grateful if you could share some with me!", 
		"type": "map"
	},
	"kindLadyQ": {
		"en-us": "", 
		"en-dm": "Old Lady: Do you have any bird food for me?", 
		"type": "map"
	},
	"lady.fodder": {
		"en-us": "", 
		"en-dm": "Give Fodder.", 
		"type": "map"
	},
	"lady.corn": {
		"en-us": "", 
		"en-dm": "Give Corn.", 
		"type": "map"
	},
	"lady.rice": {
		"en-us": "", 
		"en-dm": "Give Rice.", 
		"type": "map"
	},
	"lady.goodfood": {
		"en-us": "", 
		"en-dm": "Give Delicious Food.", 
		"type": "map"
	},
	"kindLadyNorm0": {
		"en-us": "", 
		"en-dm": "Old Lady: Oh, oh! This is perfect! Thank you very much, dearie!", 
		"type": "map"
	},
	"kindLadyNorm1": {
		"en-us": "", 
		"en-dm": "Old Lady: I know it's not much, but I can't let this good deed go unrewarded!", 
		"type": "map"
	},
	"kindLadyNorm2": {
		"en-us": "", 
		"en-dm": "Old Lady: Now, now, don't give me that! I'm rewarding you, whether you like it or not!", 
		"type": "map"
	},
	"kindLadyNorm3": {
		"en-us": "", 
		"en-dm": "You got 10,000G and 20 Asparagus Seeds.", 
		"type": "map"
	},
	"kindLadyThanks": {
		"en-us": "", 
		"en-dm": "Old Lady: Thank you again for the food, dearie. The birds are much happier now!", 
		"type": "map"
	},
	"kindLadyGood0": {
		"en-us": "", 
		"en-dm": "Old Lady: Oh dearie dearie me! This is some very fancy animal food! Are you sure you're okay with giving it to me?", 
		"type": "map"
	},
	"kindLadyGood1": {
		"en-us": "", 
		"en-dm": "Old Lady: Well, thank you VERY much, dear! If the birds could talk, they'd be thanking you, too!", 
		"type": "map"
	},
	"kindLadyGood2": {
		"en-us": "", 
		"en-dm": "Old Lady: But I can't accept such a wonderful gift without rewarding you, too! Please, take this! No, no, I insist!", 
		"type": "map"
	},
	"kindLadyGood3": {
		"en-us": "", 
		"en-dm": "You got 20,000G and 6 Funny Mushroom Seeds.", 
		"type": "map"
	},
	"wildmobsty0": {
		"en-us": "", 
		"en-dm": "Mobster: Mamma mia, it's the farmer! Come on boys! Let's get 'er!!!", 
		"type": "map"
	},
	"wildmobsty1": {
		"en-us": "", 
		"en-dm": "Mobster: It's the girl!!", 
		"type": "map"
	},
	"wildmobsty2": {
		"en-us": "", 
		"en-dm": "Mobster: Hey, I'm walkin' here!", 
		"type": "map"
	},
	"wildmobsty3": {
		"en-us": "", 
		"en-dm": "Mobster: Oh man, the boss will give me a very nice calzone if I tell 'im I took YOU down!", 
		"type": "map"
	},
	"wildmobsty4": {
		"en-us": "", 
		"en-dm": "Mobster: Hi, I'm Canadian so I don't really have the accent you'd expect me to have as a mafia-type. Sorrey.", 
		"type": "map"
	},
	"wildmobsty5": {
		"en-us": "", 
		"en-dm": "Mobster: You're goin' down!!", 
		"type": "map"
	},
	"wildmobsty6": {
		"en-us": "", 
		"en-dm": "Mobster: The cars! The cannolis!", 
		"type": "map"
	},
	"SignPawn": {
		"en-us": "", 
		"en-dm": "It's A Fucking Pawn Shop", 
		"type": "map"
	},
	"mobBoss0": {
		"en-us": "", 
		"en-dm": "???: I says many things, but one more thing I will say is this: you got guts, lady.", 
		"type": "map"
	},
	"mobBoss1": {
		"en-us": "", 
		"en-dm": "???: Guts in the literal sense of course, as I have little reason to believe you's a robot or somethin'...", 
		"type": "map"
	},
	"mobBoss2": {
		"en-us": "", 
		"en-dm": "???: But what I really meant was more in the metaphorical sense of having guts. You got balls.", 
		"type": "map"
	},
	"mobBoss3": {
		"en-us": "", 
		"en-dm": "???: Again, I'm not trying to imply anything about literal testicles that you may or may not have.", 
		"type": "map"
	},
	"mobBoss4": {
		"en-us": "", 
		"en-dm": "???: I am speaking of metaphorical balls. What I means is, you are brave for coming here.", 
		"type": "map"
	},
	"mobBoss5": {
		"en-us": "", 
		"en-dm": "???: Not many would come here. Most would not be brave enough to risk doing so...", 
		"type": "map"
	},
	"mobBoss6": {
		"en-us": "", 
		"en-dm": "???: And the few who are would've been killed before they got here, anyway.", 
		"type": "map"
	},
	"mobBoss7": {
		"en-us": "", 
		"en-dm": "???: Guts and or balls and or chutzpah and or bold. That is what you are.", 
		"type": "map"
	},
	"mobBoss8": {
		"en-us": "", 
		"en-dm": "???: Again, not literally. Literally, you are a farmer. A farmer I have been hired to find.", 
		"type": "map"
	},
	"mobBoss9": {
		"en-us": "", 
		"en-dm": "???: I am Don Vagante. A man by the name of Beckett wants you dead.", 
		"type": "map"
	},
	"mobBoss10": {
		"en-us": "", 
		"en-dm": "Vagante: That is to say that he wants you to become dead through actions carried out by me that would cause your death.", 
		"type": "map"
	},
	"mobBoss11": {
		"en-us": "", 
		"en-dm": "Vagante: And by making you dead, what he wants becomes what he has, and then what I want becomes what I have.", 
		"type": "map"
	},
	"mobBoss12": {
		"en-us": "", 
		"en-dm": "Vagante: This is because, in exchange for making you dead, he will give me large amounts of dollar money.", 
		"type": "map"
	},
	"mobBoss13": {
		"en-us": "", 
		"en-dm": "Vagante: I know not what you want - perhaps to survive this encounter - but I can guarantee you one thing.", 
		"type": "map"
	},
	"mobBoss14": {
		"en-us": "", 
		"en-dm": "Vagante: There are many people with many wants in this world. Of which, I can speak certainly of three of them.", 
		"type": "map"
	},
	"mobBoss15": {
		"en-us": "", 
		"en-dm": "Vagante: Two people are about to get a thing they want, and one person is about to get dead.", 
		"type": "map"
	},
	"beatMob0": {
		"en-us": "", 
		"en-dm": "Vagante: Mannaggia... who the hell are you, lady??", 
		"type": "map"
	},
	"beatMob1": {
		"en-us": "", 
		"en-dm": "Vagante: Those rich kids up north are NOT paying us enough for this.", 
		"type": "map"
	},
	"beatMob2": {
		"en-us": "", 
		"en-dm": "Vagante: If word gets out that I, Don Vagante, head of the Las Abejas County Mafia Reenactment Family, lost to you...", 
		"type": "map"
	},
	"beatMob3": {
		"en-us": "", 
		"en-dm": "Vagante: What? You thought we were a real mob? Please, lady, you really thought you just beat the head of a REAL mafia?", 
		"type": "map"
	},
	"beatMob4": {
		"en-us": "", 
		"en-dm": "Vagante: Now I'm not sure if you're really tough or just really really dumb.", 
		"type": "map"
	},
	"beatMob5": {
		"en-us": "", 
		"en-dm": "Vagante: ...What do you mean, \"why would a historical reenactment group try to kill someone?\"", 
		"type": "map"
	},
	"beatMob6": {
		"en-us": "", 
		"en-dm": "Vagante: We may be a fake mob, but the money those nerds were offering us was real!", 
		"type": "map"
	},
	"beatMob7": {
		"en-us": "", 
		"en-dm": "Vagante: Do you know how hard it is to get funding for something like this? After the mayor cut the arts budget last year??", 
		"type": "map"
	},
	"beatMob8": {
		"en-us": "", 
		"en-dm": "Vagante: But I'll tell ya what, lady. We'll clear out of here and leave you and this rinky dink part of the city alone.", 
		"type": "map"
	},
	"beatMob9": {
		"en-us": "", 
		"en-dm": "Vagante: In exchange, you don't tell nobody here that we're not a real mob, and don't leak this to the press up north.", 
		"type": "map"
	},
	"beatMob10": {
		"en-us": "", 
		"en-dm": "Vagante: Capisce? Capisce. Alright, boys! Let's scram!", 
		"type": "map"
	},
	"beatMob11": {
		"en-us": "", 
		"en-dm": "All of the \"mobsters\" quickly flee the area.", 
		"type": "map"
	},
	"mobBack1": {
		"en-us": "", 
		"en-dm": "Vagante: Back again, are you? Accept your fate!", 
		"type": "map"
	},
	// Area 8: North City
	"mushMan0": {
		"en-us": "", 
		"en-dm": "Daveothy: Oh hey, what? Hi.", 
		"type": "map"
	},
	"mushMan1": {
		"en-us": "", 
		"en-dm": "Daveothy: Did you get my Message? Are you here to help me with my pizza?", 
		"type": "map"
	},
	"mushMan2": {
		"en-us": "", 
		"en-dm": "Daveothy: I need some good mushrooms for my pizza. Can you help me out?", 
		"type": "map"
	},
	"mushMan3": {
		"en-us": "", 
		"en-dm": "Daveothy: I need some good mushrooms for my pizza. If you have any, let me know!", 
		"type": "map"
	},
	"mushChoice0": {
		"en-us": "", 
		"en-dm": "Give Milk Cap.", 
		"type": "choice"
	},
	"mushChoice1": {
		"en-us": "", 
		"en-dm": "Give Portobello.", 
		"type": "choice"
	},
	"mushChoice2": {
		"en-us": "", 
		"en-dm": "Give Parrot Toadstool.", 
		"type": "choice"
	},
	"mushChoice3": {
		"en-us": "", 
		"en-dm": "Give Poisonous Mushroom.", 
		"type": "choice"
	},
	"mushChoice4": {
		"en-us": "", 
		"en-dm": "Give Funny Mushroom.", 
		"type": "choice"
	},
	"mushManNope": {
		"en-us": "", 
		"en-dm": "Daveothy: That is unfortunate.", 
		"type": "map"
	},
	"mushManGive0": {
		"en-us": "", 
		"en-dm": "Daveothy: Woah this looks like a tasty treat for me to eat.", 
		"type": "map"
	},
	"mushManGive1": {
		"en-us": "", 
		"en-dm": "Daveothy homfs down the mushroom without hesitation, seemingly forgetting how pizza works.", 
		"type": "map"
	},
	"mushManNorm0": {
		"en-us": "", 
		"en-dm": "Daveothy: Hm, that was a tasty little fungus. Hunger sated, bro. Hunger sated.", 
		"type": "map"
	},
	"mushManNorm1": {
		"en-us": "", 
		"en-dm": "Daveothy: Here's a gift as thanks for hooking me up.", 
		"type": "map"
	},
	"mushManNorm2": {
		"en-us": "", 
		"en-dm": "Daveothy gives you 20 Water Chestnut seeds.", 
		"type": "map"
	},
	"mushManThanks": {
		"en-us": "", 
		"en-dm": "Daveothy: Thanks again dude.", 
		"type": "map"
	},
	"mushManPoison0": {
		"en-us": "", 
		"en-dm": "Daveothy: Hm, that was a tasty little fung--oh, hey, I don't feel very good.", 
		"type": "map"
	},
	"mushManPoison1": {
		"en-us": "", 
		"en-dm": "Daveothy collapses on the ground. It appears that he's still breathing.", 
		"type": "map"
	},
	"mushManPoison2": {
		"en-us": "", 
		"en-dm": "Congrats on the attempted murder!", 
		"type": "map"
	},
	"mushManCorpse": {
		"en-us": "", 
		"en-dm": "He is unconscious. That poison really did a number on him.", 
		"type": "map"
	},
	"mushManGood0": {
		"en-us": "", 
		"en-dm": "Daveothy: Hm woah this is an interesting food I am eating right now. Very interesting indeed.", 
		"type": "map"
	},
	"mushManGood1": {
		"en-us": "", 
		"en-dm": "Daveothy: This is exactly what I was hoping for! Please accept this reward!", 
		"type": "map"
	},
	"mushManGood2": {
		"en-us": "", 
		"en-dm": "Daveothy gives you 20 Sacred Lotus seeds.", 
		"type": "map"
	},
	"mushFridge": {
		"en-us": "", 
		"en-dm": "This fridge is just full of microwaveable pizza pockets.", 
		"type": "map"
	},
	"mushGame": {
		"en-us": "", 
		"en-dm": "This looks like one of those \"video game systems\" that are all the rage these days. Video games suck.", 
		"type": "map"
	},
	"mushPoster": {
		"en-us": "", 
		"en-dm": "This is a poster for the only reggae singer most white people can name.", 
		"type": "map"
	},
	"mushLamp": {
		"en-us": "", 
		"en-dm": "Lava lamps are really cool.", 
		"type": "map"
	},
	"foundRadish0": {
		"en-us": "", 
		"en-dm": "There are some seeds still in this radish! You get 5 radish seeds.", 
		"type": "map"
	},
	"foundRadish1": {
		"en-us": "", 
		"en-dm": "There are no seeds left in this radish.", 
		"type": "map"
	},
	"rentBill": {
		"en-us": "", 
		"en-dm": "Wow, it costs $3000 a month to live in this tiny studio apartment...", 
		"type": "map"
	},
	"someonesBed": {
		"en-us": "", 
		"en-dm": "I probably shouldn't sleep in a stranger's bed.", 
		"type": "map"
	},
	"someNerd0": {
		"en-us": "", 
		"en-dm": "???: Technology is great and all, but what we really need an app for is lowering apartment prices, am I right??", 
		"type": "map"
	},
	"someNerd1": {
		"en-us": "", 
		"en-dm": "???: They say frozen dinners are bad for you, but how could something so convenient be bad?!", 
		"type": "map"
	},
	"someNerd2": {
		"en-us": "", 
		"en-dm": "???: The start-up I work for is very generous, I only have to work a half day on Thanksgiving!!", 
		"type": "map"
	},
	"bathroomNerd": {
		"en-us": "", 
		"en-dm": "???: Can I fucking help you?", 
		"type": "map"
	},
	"troutMan0": {
		"en-us": "", 
		"en-dm": "Jeromy: Hey hey. I'm trying to sell fishing supplies to save money for college. See anything you like?", 
		"type": "map"
	},
	"troutChoice0": {
		"en-us": "", 
		"en-dm": "Buy 5 Metal Rods (1000G).", 
		"type": "choice"
	},
	"troutChoice1": {
		"en-us": "", 
		"en-dm": "Buy 10 Fishing Nets (500G).", 
		"type": "choice"
	},
	"troutChoice2": {
		"en-us": "", 
		"en-dm": "Buy 10 Big Nets (1000G).", 
		"type": "choice"
	},
	"troutChoice3": {
		"en-us": "", 
		"en-dm": "Buy 5 Fishing Spears (1000G).", 
		"type": "choice"
	},
	"troutChoice4": {
		"en-us": "", 
		"en-dm": "Buy nothing.", 
		"type": "choice"
	},
	"troutManNone": {
		"en-us": "", 
		"en-dm": "Jeromy: Your loss, lady.", 
		"type": "map"
	},
	"troutManNotEnough": {
		"en-us": "", 
		"en-dm": "Jeromy: Hey hey, my prices are low, but not THAT low! Come back when you have more money!", 
		"type": "map"
	},
	"troutManBuy": {
		"en-us": "", 
		"en-dm": "Jeromy: Pleasure doing business with ya, ma'am!", 
		"type": "map"
	},
	"bmw0": {
		"en-us": "", 
		"en-dm": "Brandt: Hi yeah please take some of this spinach. I have far too much.", 
		"type": "map"
	},
	"bmw1": {
		"en-us": "", 
		"en-dm": "You received 100 spinach seeds.", 
		"type": "map"
	},
	"bmw2": {
		"en-us": "", 
		"en-dm": "Brandt: Spinach is so tasty... but you know what they say... \"too much of a good thing\" and all that!", 
		"type": "map"
	},
	"cashMan0": {
		"en-us": "", 
		"en-dm": "???: Hello! Are you confused by Cash2? Would you like to know more about it?", 
		"type": "map"
	},
	"cashManNo": {
		"en-us": "", 
		"en-dm": "???: Okay then... you can convert your regular old cash to and from Cash2 at one of the machines in the back if you want.", 
		"type": "map"
	},
	"cashManYes0": {
		"en-us": "", 
		"en-dm": "???: Really? That's a firs--I mean, great! Let's get started, then!", 
		"type": "map"
	},
	"cashManYes1": {
		"en-us": "", 
		"en-dm": "???: So, money - regular money, that is - is just a bunch of paper or whatever. It's not actually worth anything.", 
		"type": "map"
	},
	"cashManYes2": {
		"en-us": "", 
		"en-dm": "???: But the government offers you a promise that, for example, one dollar is worth one dollar.", 
		"type": "map"
	},
	"cashManYes3": {
		"en-us": "", 
		"en-dm": "???: But wouldn't it be great if, instead of the government telling you \"this useless paper is worth something\"...", 
		"type": "map"
	},
	"cashManYes4": {
		"en-us": "", 
		"en-dm": "???: ...instead it was a computer telling you \"this useless data is worth something\"???", 
		"type": "map"
	},
	"cashManYes5": {
		"en-us": "", 
		"en-dm": "???: If you answered yes, then Cash2 is the currency for you!", 
		"type": "map"
	},
	"cashManYes6": {
		"en-us": "", 
		"en-dm": "???: You can convert your regular money to and from Cash2 at one of the machines in the back!", 
		"type": "map"
	},
	"cashManYes7": {
		"en-us": "", 
		"en-dm": "???: Just as a heads-up, though, Cash2 is the future... but not necessarily the present.", 
		"type": "map"
	},
	"cashManYes8": {
		"en-us": "", 
		"en-dm": "???: Currently the value of Cash2 fluctuates pretty rapidly so, uh, just keep that in mind.", 
		"type": "map"
	},
	"atm0": {
		"en-us": "", 
		"en-dm": "ATM: Hello! The current value of Cash2 is {0}C2 per 1000G! What would you like to do?", 
		"type": "map"
	},
	"atmc0": {
		"en-us": "", 
		"en-dm": "Buy {0}C2 for 1000G (you have {2}G).", 
		"type": "choice"
	},
	"atmc1": {
		"en-us": "", 
		"en-dm": "Sell 1C2 for {1}G (you have {3}C2).", 
		"type": "choice"
	},
	"atmc2": {
		"en-us": "", 
		"en-dm": "Nevermind.", 
		"type": "choice"
	},
	"atmc0.0": {
		"en-us": "", 
		"en-dm": "ATM: Thank you! You now have {3}C2, which is worth {4}G!", 
		"type": "map"
	},
	"atmc1.0": {
		"en-us": "", 
		"en-dm": "ATM: Thank you! You now have {2}G!", 
		"type": "map"
	},
	"atmc0.X": {
		"en-us": "", 
		"en-dm": "ATM: Sorry, you don't have enough money to do that!", 
		"type": "map"
	},
	"atmc1.X": {
		"en-us": "", 
		"en-dm": "ATM: Sorry, you don't have enough Cash2 to do that!", 
		"type": "map"
	},
	"atmX": {
		"en-us": "", 
		"en-dm": "ATM: Thank you! Have a nice day!", 
		"type": "map"
	},
	"officer1": {
		"en-us": "", 
		"en-dm": "Officer: This is Officer Ellis, requesting additional backup. There are at least two robbers inside the bank. They are armed.", 
		"type": "map"
	},
	"officer2": {
		"en-us": "", 
		"en-dm": "Officer: Ma'am, this area is off-limits right now. There is a robbery in process.", 
		"type": "map"
	},
	"officer3": {
		"en-us": "", 
		"en-dm": "Officer: This looks like a clue!", 
		"type": "map"
	},
	"officer4": {
		"en-us": "", 
		"en-dm": "Officer: Do we know if there are any hostages?", 
		"type": "map"
	},
	"robber0": {
		"en-us": "", 
		"en-dm": "Robber: Hey, what the hell are you doing in here?!", 
		"type": "map"
	},
	"robber1": {
		"en-us": "", 
		"en-dm": "Robber: Let's get her!!", 
		"type": "map"
	},
	"keycard0": {
		"en-us": "", 
		"en-dm": "You got a Food2 employee keycard! With this you should be able to get into the building!", 
		"type": "map"
	},
	"foodEnter0": {
		"en-us": "", 
		"en-dm": "The door is locked. You need an employee keycard to get in. Maybe someone in one of the 13th St. apartments has one.", 
		"type": "map"
	},
	"foodEnter1": {
		"en-us": "", 
		"en-dm": "You swipe the keycard and the door unlocks. You're in!", 
		"type": "map"
	},
	"foodEnter2": {
		"en-us": "", 
		"en-dm": "You reach into your pocket... only to find the keycard is gone! You must have lost it in the battle!", 
		"type": "map"
	},
	"keycard1": {
		"en-us": "", 
		"en-dm": "?!?!", 
		"type": "map"
	},
	"keycard2": {
		"en-us": "", 
		"en-dm": "???: I hope you like traps, because you just walked into one!", 
		"type": "map"
	},
	"keycard3": {
		"en-us": "", 
		"en-dm": "???: My super cool fighting robot and I will defeat you once and for all!", 
		"type": "map"
	},
	"keycard4": {
		"en-us": "", 
		"en-dm": "???: Heh heh... looking for something? If you want this keycard you'll have to beat me!", 
		"type": "map"
	},
	"keycard5": {
		"en-us": "", 
		"en-dm": "???: Ugh... you win this round...", 
		"type": "map"
	},
	"keycard6": {
		"en-us": "", 
		"en-dm": "fucking kaboom", 
		"type": "map"
	},
	// Area 8: North City Text Messages
	"beckettText0": {
		"en-us": "", 
		"en-dm": "XxXbeckXxX (to you): ur very dumb 4 coming here", 
		"type": "text"
	},
	"beckettText1": {
		"en-us": "", 
		"en-dm": "XxXbeckXxX (to you): u wont make it out of this city alive.", 
		"type": "text"
	},
	"beckettText2": {
		"en-us": "", 
		"en-dm": "XxXbeckXxX (to you): NO 1 mocks me like u have & gets away w/ it!!!", 
		"type": "text"
	},
	"beckettText3": {
		"en-us": "", 
		"en-dm": "XxXbeckXxX (to you): btw u can dismiss texts w/ the pause button", 
		"type": "text"
	},
	"sext0": {
		"en-us": "", 
		"en-dm": "fishoholic (to you): u must b a traffic ticket bc u got FINE written all over u!!", 
		"type": "text"
	},
	"sext1": {
		"en-us": "", 
		"en-dm": "carl289 (to you): Your sexy", 
		"type": "text"
	},
	"sext2": {
		"en-us": "", 
		"en-dm": "mrhuggsy (to you): Bongo BONG...", 
		"type": "text"
	},
	"sext3": {
		"en-us": "", 
		"en-dm": "carl289 (to you): r u single?", 
		"type": "text"
	},
	"sext4": {
		"en-us": "", 
		"en-dm": "luvrboi (to you): have u seen the newest episode of \"Oh No, It's Zombies Again, I Guess!\"? do u want 2?", 
		"type": "text"
	},
	"sext5": {
		"en-us": "", 
		"en-dm": "carl289 (to you): y r u ignoring me", 
		"type": "text"
	},
	"sext6": {
		"en-us": "", 
		"en-dm": "carl289 (to you): r u getting these messages?", 
		"type": "text"
	},
	"sext7": {
		"en-us": "", 
		"en-dm": "carl289 (to you): fuk u", 
		"type": "text"
	},
	"misctext0": {
		"en-us": "", 
		"en-dm": "susang (public): There's a beehive in my office! can some1 come 2 98 12th St & help???", 
		"type": "text"
	},
	"misctext1": {
		"en-us": "", 
		"en-dm": "freethinker310 (public): anyone got any, uh, mushrooms? for cooking? i'm making a pizza. come to 90 13th st.", 
		"type": "text"
	},
	"misctext2": {
		"en-us": "", 
		"en-dm": "GordonsFarming (public): SALE!! Pesticides! Very effective!! Come to 96 12th St!", 
		"type": "text"
	},
	"misctext3": {
		"en-us": "", 
		"en-dm": "LasAbejasLotto (public): Grand prize is now $1.5m! Buy tickets now b4 numbers announced 2nite!!", 
		"type": "text"
	},
	"misctext4": {
		"en-us": "", 
		"en-dm": "chet.bradson (public): Selling quail eggs for cheap. @ 13th St/Corvo Lane intersection.", 
		"type": "text"
	},
	"misctext5": {
		"en-us": "", 
		"en-dm": "XxXbeckXxX (public): if ne1 sees a farmer woman plz call cops on her she tried 2 kill me ty", 
		"type": "text"
	},
	"misctext6": {
		"en-us": "", 
		"en-dm": "craig (to you): im craig", 
		"type": "text"
	},
	"misctext7": {
		"en-us": "", 
		"en-dm": "crazy4trout (public): selling fishing supplies to save up money 4 college. gr8 prices. @ 94 13th St 2nd floor.", 
		"type": "text"
	},
	"misctext8": {
		"en-us": "", 
		"en-dm": "theFutureIsNow (public): looking 4 investors 4 my new startup - cryptocurrency 4 dogs. txt me 4 for more information.", 
		"type": "text"
	},
	"misctext9": {
		"en-us": "", 
		"en-dm": "bmw (public): i ate too much spinach and now i can't stop shitting green. plz come take the rest of this spinach away from me. 98 13th st.", 
		"type": "text"
	},
	"misctext10": {
		"en-us": "", 
		"en-dm": "gamers4Gameing (public): please sign our petition to stop Haunted Bees from making fun of nerds in their game Farming Fantasy.", 
		"type": "text"
	},
	"misctext11": {
		"en-us": "", 
		"en-dm": "Emergency Alerts (public): There is an armed robbery at Las Abejas Bank on west 14th St. Please stay away from the area.", 
		"type": "text"
	},
	"misctext12": {
		"en-us": "", 
		"en-dm": "investment.help (public): Need help understanding Cash2? Talk to one of our representatives at 92 12th St today! Don't let the future leave you behind!", 
		"type": "text"
	},
	"misctext13": {
		"en-us": "", 
		"en-dm": "theFutureIsNow (public): looking 4 developers to program new web app. no pay (yet!) but will offer profit sharing.", 
		"type": "text"
	},
	"misctext14": {
		"en-us": "", 
		"en-dm": "Automated Message (to you): You have reached your texting limit for the month. Please pay $9.95 for more messages or wait until the 25th of the month.", 
		"type": "text"
	},
	"sistext0": {
		"en-us": "", 
		"en-dm": "JM (to you): Hey! Welcome to the 21st century finally! It's ur little sis!", 
		"type": "text"
	},
	"sistext1": {
		"en-us": "", 
		"en-dm": "JM (to you): Got your letter a few days ago. I'd love to visit next month!", 
		"type": "text"
	},
	"sistext2": {
		"en-us": "", 
		"en-dm": "JM (to you): What made you finally decide to get a smart phone? Nevermind, don't tell me! I want to hear it in person!", 
		"type": "text"
	},
	"sistext3": {
		"en-us": "", 
		"en-dm": "JM (to you): Anyway, I'll ttyl (that means \"talk to you later\"), my shift's starting. Love you!! <3 <3 <3 <3", 
		"type": "text"
	},
	// Area 9: Food2 Headquarters
	"theFirstBottle": {
		"en-us": "", 
		"en-dm": "\"When our founder took his first sip of this mixture and only vomited a *little* bit, he knew it was the future of food.\"", 
		"type": "text"
	},
	"smartDesk": {
		"en-us": "", 
		"en-dm": "This desk appears to be covered in a thick layer of glass with a monitor underneath it. Technology can be cool sometimes, I guess.", 
		"type": "text"
	},
	"whiteboard": {
		"en-us": "", 
		"en-dm": "Lots of scribbles and half-messages that probably made sense at the time litter the whiteboard.", 
		"type": "text"
	},
	"secondMonitor": {
		"en-us": "", 
		"en-dm": "Why do they have a giant TV screen if they already have a monitor built into the desk?", 
		"type": "text"
	},
	"elevatorNope": {
		"en-us": "", 
		"en-dm": "Come on, you know how final area video game elevators work... wait until you've gotten to the second floor before using it!", 
		"type": "text"
	},
	"elevatorNormal": {
		"en-us": "", 
		"en-dm": "What floor would you like to go to?", 
		"type": "text"
	},
	"elevator0": {
		"en-us": "", 
		"en-dm": "Nevermind.", 
		"type": "text"
	},
	"elevator1": {
		"en-us": "", 
		"en-dm": "First Floor.", 
		"type": "text"
	},
	"elevator2": {
		"en-us": "", 
		"en-dm": "Second Floor.", 
		"type": "text"
	},
	"elevator3": {
		"en-us": "", 
		"en-dm": "Third Floor.", 
		"type": "text"
	},
	"elevator4": {
		"en-us": "", 
		"en-dm": "Fourth Floor.", 
		"type": "text"
	},
	"enterHQ0": {
		"en-us": "", 
		"en-dm": "Receptionist: Oh, hello! You must be the farmer all the higher-ups have been bickering about!", 
		"type": "text"
	},
	"enterHQ1": {
		"en-us": "", 
		"en-dm": "Receptionist: Welcome to Food2: Where the Future of Food... isn't Food!", 
		"type": "text"
	},
	"enterHQ2": {
		"en-us": "", 
		"en-dm": "Receptionist: I overheard that they're going to fire me because some of our managers are afraid of women, so I don't really care how you got in here!", 
		"type": "text"
	},
	"enterHQ3": {
		"en-us": "", 
		"en-dm": "Receptionist: Just don't do anything that could hurt my severance pay, and have a nice day!", 
		"type": "text"
	},
	"intercom0": {
		"en-us": "", 
		"en-dm": "Intercom: I, uh, attention, employees on the third floor. This is Susanabel from Human Resources.", 
		"type": "text"
	},
	"intercom1": {
		"en-us": "", 
		"en-dm": "Intercom: Please evacuate the third floor immediately. This is an emergency and this is not a drill.", 
		"type": "text"
	},
	"intercom2": {
		"en-us": "", 
		"en-dm": "Intercom: One of our experiments in groundbreaking food technology has gotten loose. I repeat, this is not a drill.", 
		"type": "text"
	},
	"intercom3": {
		"en-us": "", 
		"en-dm": "Intercom: Please remain calm and head to the nearest staircase or elevator immediately.", 
		"type": "text"
	},
	"intercom4": {
		"en-us": "", 
		"en-dm": "Intercom: If you are far from an exit, please navigate with caution. If you enter a room and feel anything is off, please leave that room immediately and try another path.", 
		"type": "text"
	},
	"intercom5": {
		"en-us": "", 
		"en-dm": "Intercom: Should you encounter the experiment, please remain calm. It is attracted to fear, and may spare you if you keep your composure.", 
		"type": "text"
	},
	"intercom6": {
		"en-us": "", 
		"en-dm": "Intercom: Do not, I repeat, do NOT engage with the experiment. Thank you.", 
		"type": "text"
	},
	"confront0": {
		"en-us": "", 
		"en-dm": "???: So... you made it all the way here.", 
		"type": "text"
	},
	"confront1": {
		"en-us": "", 
		"en-dm": "???: Heh heh heh... remember me?", 
		"type": "text"
	},
	"confront2": {
		"en-us": "", 
		"en-dm": "???: ...", 
		"type": "text"
	},
	"confront3": {
		"en-us": "", 
		"en-dm": "???: It's BECKETT.", 
		"type": "text"
	},
	"confront4": {
		"en-us": "", 
		"en-dm": "Beckett, I guess: DON'T GIVE ME THAT SHIT!", 
		"type": "text"
	},
	"confront5": {
		"en-us": "", 
		"en-dm": "Beckett: I have to admit, I underestimated you...", 
		"type": "text"
	},
	"confront6": {
		"en-us": "", 
		"en-dm": "Beckett: Who would have guessed some farmer from hicktown could compete with some of the smartest minds in the world?", 
		"type": "text"
	},
	"confront7": {
		"en-us": "", 
		"en-dm": "Beckett: No one, of course, because you can't. I've just been toying with you. Because... I wanted to see how far you could go!", 
		"type": "text"
	},
	"confront8": {
		"en-us": "", 
		"en-dm": "Beckett: If that doesn't make sense to you, clearly you just can't comprehend my brilliant intellect. It's completely logical!", 
		"type": "text"
	},
	"confront9": {
		"en-us": "", 
		"en-dm": "Beckett: But now, you've come too far. You've caused us too many problems. You... made some of our investors change their minds...", 
		"type": "text"
	},
	"confront10": {
		"en-us": "", 
		"en-dm": "Beckett: You are a bug in the hand of a fucking infant, who will grow up to rule the world.", 
		"type": "text"
	},
	"confront11": {
		"en-us": "", 
		"en-dm": "Beckett: And when the infant grows tired of the bug... he CRUSHES IT.", 
		"type": "text"
	},
	"confront12": {
		"en-us": "", 
		"en-dm": "Beckett: IN THIS METAPHOR YOU ARE THE BUG AND IT IS TIME TO BE CRUSHED!!!", 
		"type": "text"
	},
	"beckettBack0": {
		"en-us": "", 
		"en-dm": "Beckett: Heh heh, back for more, are you? You dumb yokels never know when to quit!", 
		"type": "text"
	},
	"postBeckett0": {
		"en-us": "", 
		"en-dm": "Beckett: Wh-wha... you... YOU BEAT ME?!", 
		"type": "text"
	},
	"postBeckett1": {
		"en-us": "", 
		"en-dm": "Beckett: I'M SMART! YOU'RE DUMB! I'M RICH! YOU'RE POOR! I'M... THIS IS IMPOSSIBLE!", 
		"type": "text"
	},
	"postBeckett2": {
		"en-us": "", 
		"en-dm": "Beckett: Wipe that smug look off your face! Once the boss hears about this you'll be sorry! YOU'LL BE SORRY!!", 
		"type": "text"
	},
	"final0": {
		"en-us": "", 
		"en-dm": "Beckett: There she is, boss! There's the mean old lady who beat the fucking shit out of me!", 
		"type": "text"
	},
	"final1": {
		"en-us": "", 
		"en-dm": "???: ...", 
		"type": "text"
	},
	"final2": {
		"en-us": "", 
		"en-dm": "???: ... ...", 
		"type": "text"
	},
	"final3": {
		"en-us": "", 
		"en-dm": "???: ... ... ...", 
		"type": "text"
	},
	"final4": {
		"en-us": "", 
		"en-dm": "Nathan: Oh, hey boss! What brings you here?", 
		"type": "text"
	},
	"final5": {
		"en-us": "", 
		"en-dm": "Beckett: B--WHAAAT?!?!?!!", 
		"type": "text"
	},
	"final6": {
		"en-us": "", 
		"en-dm": "Nathan: Oh yeah, I guess I forgot to fill the rest of y'all in while I was gone.", 
		"type": "text"
	},
	"final7": {
		"en-us": "", 
		"en-dm": "Nathan: This is that farmer we talked about last week at the board meeting. One of the best farmers in California. Remember?", 
		"type": "text"
	},
	"final8": {
		"en-us": "", 
		"en-dm": "Beckett: Yes... I remember...", 
		"type": "text"
	},
	"final9": {
		"en-us": "", 
		"en-dm": "Nathan: Well anyway, I figured that a good way to figure out her farming secrets was to work as her intern.", 
		"type": "text"
	},
	"final10": {
		"en-us": "", 
		"en-dm": "Beckett: Her... intern...?", 
		"type": "text"
	},
	"final11": {
		"en-us": "", 
		"en-dm": "Nathan: Yeah, she's been busy with some other stuff lately, so I've been working on her farm, helping her out, learning how she works.", 
		"type": "text"
	},
	"final12": {
		"en-us": "", 
		"en-dm": "Nathan: I gotta admit, I never would have thought of some of the things she does.", 
		"type": "text"
	},
	"final13": {
		"en-us": "", 
		"en-dm": "Nathan: But thanks to that research, we can figure out what makes her crops so damn good, so we can do the same thing to Food2!", 
		"type": "text"
	},
	"final14": {
		"en-us": "", 
		"en-dm": "Beckett: ...", 
		"type": "text"
	},
	"final15": {
		"en-us": "", 
		"en-dm": "Nathan: ...Beckett?", 
		"type": "text"
	},
	"final16": {
		"en-us": "", 
		"en-dm": "Beckett: That's... certainly... one strategy...", 
		"type": "text"
	},
	"final17": {
		"en-us": "", 
		"en-dm": "Nathan: What are you talking about?", 
		"type": "text"
	},
	"final18": {
		"en-us": "", 
		"en-dm": "Beckett: Well... after that meeting last week.... after you left... we came up with a... DIFFERENT way... of working with her.", 
		"type": "text"
	},
	"final19": {
		"en-us": "", 
		"en-dm": "Nathan: Oh? Great! What did you guys do?", 
		"type": "text"
	},
	"final20": {
		"en-us": "", 
		"en-dm": "Beckett: ...uh... first we uh, decided that she was someone to compete with, not collaborate with... so...", 
		"type": "text"
	},
	"final21": {
		"en-us": "", 
		"en-dm": "Beckett: We tried bribing her... and then that didn't work... so we tried to kill her.", 
		"type": "text"
	},
	"final22": {
		"en-us": "", 
		"en-dm": "Nathan: What the fuck!? Why the fuck did you think any of that would be a good idea?!", 
		"type": "text"
	},
	"final23": {
		"en-us": "", 
		"en-dm": "Beckett: ...the investors liked it more than your idea.", 
		"type": "text"
	},
	"final24": {
		"en-us": "", 
		"en-dm": "Nathan: Oh, they did? Well why didn't you say so?", 
		"type": "text"
	},
	"final25": {
		"en-us": "", 
		"en-dm": "Nathan: Sorry, boss, but business is business.", 
		"type": "text"
	},
	// Shops
	"s.co": {
		"en-us": "Bu-GAWK! Hi boss! Got some good things on sale!", 
		"en-dm": "Bu-GAWK! Hi boss! Got some good seeds on sale! What? You want a discount? Cluck off - a girl's gotta make money somehow!", 
		"type": "shop"
	},
	"s.sell": {
		"en-us": "What're you selling?", 
		"en-dm": "WOT'RE YA SELLIN'???", 
		"type": "shop"
	},
	"s.eq1o": {
		"en-us": "Welcome to my Equipment Shop! Please, buy many things.", 
		"en-dm": "Hello I am a public domain dwarf and I sell equipment. You can equip it from the Menu, which is probably a good choice.", 
		"type": "shop"
	},
	"s.leave": {
		"en-us": "Thank you, come again!", 
		"en-dm": "fuck off", 
		"type": "shop"
	},
	"s.leave2": {
		"en-us": "Bye.", 
		"en-dm": "bye fucker", 
		"type": "shop"
	},
	"s.notenough": {
		"en-us": "You can't afford that...", 
		"en-dm": "Hey fuckface this is a store not charity. Have the money or have a gofuckyourself.", 
		"type": "shop"
	},
	"s.purchased": {
		"en-us": "Thank you!", 
		"en-dm": "thanks mom", 
		"type": "shop"
	},
	"s.up1p": {
		"en-us": "Excellent! Now you'll have a 4x3 grid of tiles to plant crops and place fixtures on!", 
		"type": "shop"
	},
	"s.didsell": {
		"en-us": "Thank you for the goods!", 
		"en-dm": "Thanks for the shit, fucfkace.", 
		"type": "shop"
	},
	"s.leavesell": {
		"en-us": "Anything else?", 
		"en-dm": "stop giving me THINGS and start giving me MONEY.", 
		"type": "shop"
	},
	"s.cpurch": {
		"en-us": "Bu-GAW! Thank you for your patronage!", 
		"en-dm": "Bu-GAWK!! Good shit, good shit. Thank you for your patronage!", 
		"type": "shop"
	},
	"s.up1o": {
		"en-us": "Are you tired of only having 9 tiles to plant crops in? Tire no more! For just 2000 coins I can give you three more tiles to plant on!", 
		"type": "shop"
	},
	"s.upempty": {
		"en-us": "Welcome. Unfortunately, I have no other upgrades for you.", 
		"type": "shop"
	},
	"s.sellseed": {
		"en-us": "Seeds & Consumables\n Sell your seeds, eggs, and other consumable supplies.", 
		"type": "shop"
	},
	"s.selltool": {
		"en-us": "Tools & Equipment\n Sell your equipment, like sickles, gloves, and compost bins.", 
		"type": "shop"
	},
	"s.sellfixture": {
		"en-us": "Field Fixtures\n Sell your Fixtures, like chicken coops and mushroom logs.", 
		"type": "shop"
	},
	"s.fieldI": {
		"en-us": "This will expand your Combat Field, allowing you to place more Fixtures and plant more Crops during combat.", 
		"type": "shop"
	},
	"s.fieldO": {
		"en-us": "This configuration gives room for more large Fixtures and Trees.", 
		"type": "shop"
	},
	"s.field.": {
		"en-us": "This configuration gives additional space, but less room for large Fixtures and Trees.", 
		"type": "shop"
	},
	"s.fi1o": {
		"en-us": "Welcome to the my Fixture Shop! Here you can buy Fixtures to add to your farm, allowing you to plant and grow more than just your standard fruits and veggies!", 
		"type": "shop"
	},
	"quest1": {
		"en-us": "", 
		"en-dm": "oi u fuck", 
		"type": "shop"
	},
	"quest1.a": {
		"en-us": "", 
		"en-dm": "I heard pray tell quite right what-ho rumors eh wot yes quite that there's a golden mushroom in the forest west of here. Find it for me, and there'll be something in it for you!", 
		"type": "shop"
	},
	"quest1.b": {
		"en-us": "", 
		"en-dm": "sick thanks. Have a mushroom log.", 
		"type": "shop"
	},
	"quest1.c": {
		"en-us": "", 
		"en-dm": "are you daft, lass? Golden mushroom. Forest. West of here. Hop it to it. it.", 
		"type": "shop"
	},
	"s.seed1": {
		"en-us": "", 
		"en-dm": "hi I got seeds", 
		"type": "shop"
	},
	"s.inn1": {
		"en-us": "", 
		"en-dm": "hey hey hey my inn is in... business. It's in business. That's a thing people say. Fuck off.", 
		"type": "shop"
	},
	"s.innpurch": {
		"en-us": "", 
		"en-dm": "enjoy your sleep", 
		"type": "shop"
	},
	"s.mermhello": {
		"en-us": "", 
		"en-dm": "this is a mermaid... hello!!", 
		"type": "shop"
	},
	"cwk.co": {
		"en-us": "", 
		"en-dm": "Hey there. I'm too lazy to do any construction work so I'm just... running a shop. Whatever.", 
		"type": "shop"
	},
	"cwk.leave": {
		"en-us": "", 
		"en-dm": "Thanks for the whatever.", 
		"type": "shop"
	},
	"quest1.d": {
		"en-us": "", 
		"en-dm": "hly faulk lass is that a fucken golden mushroom? I'll trade you for this log! AND I'll start selling you my special mushroom selection!", 
		"type": "shop"
	},
	// Bees
	"hiveGet": {
		"en-us": "", 
		"en-dm": "You found a beehive! You can now place one more beehive on your farm, and you caught some bees, too!", 
		"type": "map"
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
	// Reoccuring
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
	"truck.where": {
		"en-us": "", 
		"en-dm": "Where would you like to drive to?", 
		"type": "map"
	},
	"truck.none": {
		"en-us": "", 
		"en-dm": "You have things to do here before driving off!", 
		"type": "map"
	},
	"truck.nm": {
		"en-us": "", 
		"en-dm": "Stay here for now.", 
		"type": "choice"
	},
	"truck.home": {
		"en-us": "", 
		"en-dm": "Drive home.", 
		"type": "choice"
	},
	"truck.bridge": {
		"en-us": "", 
		"en-dm": "Drive to the bridge.", 
		"type": "choice"
	},
	"truck.city": {
		"en-us": "", 
		"en-dm": "Drive to the city.", 
		"type": "choice"
	},
	"truck.fake": {
		"en-us": "", 
		"en-dm": "Drive to the fake farm.", 
		"type": "choice"
	},
	// Combat
	"standardAttack": {
		"en-us": "", 
		"en-dm": "{0} attacks for {1} damage.", 
		"type": "combat"
	},
	"plantAttack": {
		"en-us": "", 
		"en-dm": "{0} plants {2}.", 
		"type": "combat"
	},
	"plantAttack2": {
		"en-us": "", 
		"en-dm": "{0} plants 2 crops.", 
		"type": "combat"
	},
	"plantAttack3": {
		"en-us": "", 
		"en-dm": "{0} plants 3 crops.", 
		"type": "combat"
	},
	"modulateAttack": {
		"en-us": "", 
		"en-dm": "{0} uses a Season Modulator to change the season to {2}.", 
		"type": "combat"
	},
	"babyToss": {
		"en-us": "", 
		"en-dm": "{0}'s {2} harvest is ready!", 
		"type": "combat"
	},
	"fishSuccess": {
		"en-us": "", 
		"en-dm": "{0} reaches into the river and pulls out a fish, eating it and recovering {1} health.", 
		"type": "combat"
	},
	"fishFail": {
		"en-us": "", 
		"en-dm": "{0} reaches into the river, but fails to catch any fish.", 
		"type": "combat"
	},
	"fileBPermit": {
		"en-us": "", 
		"en-dm": "{0} files for a Building Permit.", 
		"type": "combat"
	},
	"buildHouse": {
		"en-us": "", 
		"en-dm": "{0} begins constructing a house.", 
		"type": "combat"
	},
	"throwRockSucc": {
		"en-us": "", 
		"en-dm": "{0} throws a rock onto your field.", 
		"type": "combat"
	},
	"throwRockFail": {
		"en-us": "", 
		"en-dm": "{0} tried to throw a rock onto your field, but missed.", 
		"type": "combat"
	},
	"splashFail": {
		"en-us": "", 
		"en-dm": "{0} splashes some water, but it does nothing.", 
		"type": "combat"
	},
	"splashSucc": {
		"en-us": "", 
		"en-dm": "{0} splashes some water on your field.", 
		"type": "combat"
	},
	"splashDamage": {
		"en-us": "", 
		"en-dm": "{0} splashes some water on your field, damaging a crop!", 
		"type": "combat"
	},
	"splashKill": {
		"en-us": "", 
		"en-dm": "{0} splashes some water on your field, destroying a crop!", 
		"type": "combat"
	},
	"pigWithAFuckingGun": {
		"en-us": "", 
		"en-dm": "The pig accidentally triggers the gun on her back, firing directly at you and dealing {1} damage!", 
		"type": "combat"
	},
	"cropAttack": {
		"en-us": "", 
		"en-dm": "{0} attacks a crop on your field.", 
		"type": "combat"
	},
	"cropKill": {
		"en-us": "", 
		"en-dm": "{0} attacks a crop on your field, destroying it.", 
		"type": "combat"
	},
	"initializeAttack": {
		"en-us": "", 
		"en-dm": "{0} initializes{an} {2}.", 
		"type": "combat"
	},
	"clearCache": {
		"en-us": "", 
		"en-dm": "{0} clears its cache.", 
		"type": "combat"
	},
	"cloudSucc": {
		"en-us": "", 
		"en-dm": "{0} establishes a connection to The Cloud.", 
		"type": "combat"
	},
	"cloudFail": {
		"en-us": "", 
		"en-dm": "{0} tries to connect to The Cloud, but fails.", 
		"type": "combat"
	},
	"cloudShare": {
		"en-us": "", 
		"en-dm": "{0} shares data with The Cloud.", 
		"type": "combat"
	},
	"routerIdle": {
		"en-us": "", 
		"en-dm": "{0} is doing that \"internet\" thing.", 
		"type": "combat"
	},
	"outletUnplugged": {
		"en-us": "", 
		"en-dm": "The outlet has been unplugged! HOUSEKEEPER has shut down!", 
		"type": "combat"
	},
	"plugAttempt": {
		"en-us": "", 
		"en-dm": "Actually Just Jeff struggles to plug everything back in.", 
		"type": "combat"
	},
	"plugSuccess": {
		"en-us": "", 
		"en-dm": "Actually Just Jeff has plugged HOUSEKEEPER back in and installed a security guard over the outlet!", 
		"type": "combat"
	},
	"hkAtkAttack": {
		"en-us": "", 
		"en-dm": "HOUSEKEEPER: Hello, I'm attacking you for {1} damage now. Thank you!", 
		"type": "combat"
	},
	"hkAtkPlantOne": {
		"en-us": "", 
		"en-dm": "HOUSEKEEPER: Hello, I'm placing a Smart Light Bulb on the field now. Thank you!", 
		"type": "combat"
	},
	"hkAtkCantPlant": {
		"en-us": "", 
		"en-dm": "HOUSEKEEPER: Oh dear, I can't seem to find any room on the field. Please clear the field and try again later!", 
		"type": "combat"
	},
	"hkAtkRock": {
		"en-us": "", 
		"en-dm": "HOUSEKEEPER: Hello, I'm throwing a rock on your field. I hope it makes your life worse! :)", 
		"type": "combat"
	},
	"hkAtkError1": {
		"en-us": "", 
		"en-dm": "HOUSEKEEPER: Oopsies, an error has occurred! Please look up Error Code R0CC on our website for more information!", 
		"type": "combat"
	},
	"hkAtkError2": {
		"en-us": "", 
		"en-dm": "HOUSEKEEPER: Oh darn, there's an error! Please look up Error Code W473R on our website for more information!", 
		"type": "combat"
	},
	"splashRow": {
		"en-us": "", 
		"en-dm": "{0} splashes some water all over your field.", 
		"type": "combat"
	},
	"splashRowDamage": {
		"en-us": "", 
		"en-dm": "{0} splashes some water all over your field, damaging some crops.", 
		"type": "combat"
	},
	"splashRowKill": {
		"en-us": "", 
		"en-dm": "{0} splashes some water all over your field, damaging and destroying some crops.", 
		"type": "combat"
	},
	"hkAtkPlantTwo": {
		"en-us": "", 
		"en-dm": "HOUSEKEEPER: Hello, I'm placing some Smart Light Bulbs on the field now. Thank you!", 
		"type": "combat"
	},
	"hkAtkError3": {
		"en-us": "", 
		"en-dm": "HOUSEKEEPER: Oh darn, there's an error! Please look up Error Code K111 on our website for more information!", 
		"type": "combat"
	},
	"hkCropKill": {
		"en-us": "", 
		"en-dm": "HOUSEKEEPER: Hello, I have removed a crop I have deemed dangerous from your field. You're welcome!", 
		"type": "combat"
	},
	"hkCropAttack": {
		"en-us": "", 
		"en-dm": "HOUSEKEEPER: Hello, I have identified a dangerous crop on your field, so I am now attempting to destroy it. Thank you for understanding!", 
		"type": "combat"
	},
	"hkSeasonChange": {
		"en-us": "", 
		"en-dm": "HOUSEKEEPER: Hello, I have determined that changing the season to {2} would really suck for you, so I am doing that now.", 
		"type": "combat"
	},
	"hkHeal": {
		"en-us": "", 
		"en-dm": "HOUSEKEEPER: Hello, I have determined that {2} is in need of healing, so I am recovering {1} health for them. Enjoy!", 
		"type": "combat"
	},
	"hkCreepy0": {
		"en-us": "", 
		"en-dm": "HOUSEKEEPER: This battle is brought to you by ChefCrate meal kits! Sign up now and get your first box for free!", 
		"type": "combat"
	},
	"hkCreepy1": {
		"en-us": "", 
		"en-dm": "HOUSEKEEPER: This battle is brought to you by Hearybooks! Sign up with promo code \"i'm going to kill you\" to get 25% off your first audiobook!", 
		"type": "combat"
	},
	"hkCreepy2": {
		"en-us": "", 
		"en-dm": "HOUSEKEEPER: I know what you did last summer.", 
		"type": "combat"
	},
	"hkCreepy3": {
		"en-us": "", 
		"en-dm": "HOUSEKEEPER: According to my analysis, your period will begin in approximately 4 hours. Would you like to order some sanitation products?", 
		"type": "combat"
	},
	"hkCreepy4": {
		"en-us": "", 
		"en-dm": "HOUSEKEEPER: The weather tomorrow will be sunny, with a high of 95 degrees Fahrenheit around noon.", 
		"type": "combat"
	},
	"hkCreepy5": {
		"en-us": "", 
		"en-dm": "HOUSEKEEPER: Please rate this app on the Application Store. Any ratings lower than five stars will not be accepted.", 
		"type": "combat"
	},
	// Enemy Names
	"e.robo0": {
		"en-us": "", 
		"en-dm": "Byte Buddy", 
		"type": "enemy"
	},
	"e.Discussly0": {
		"en-us": "", 
		"en-dm": "Convince-a-tron", 
		"type": "enemy"
	},
	"e.bigBot0": {
		"en-us": "", 
		"en-dm": "MegaByte Buddy", 
		"type": "enemy"
	},
	"e.robo20": {
		"en-us": "", 
		"en-dm": "KiloByte Buddy", 
		"type": "enemy"
	},
	"e.robo30": {
		"en-us": "", 
		"en-dm": "Bit Buddy", 
		"type": "enemy"
	},
	"e.ScienceMan0": {
		"en-us": "", 
		"en-dm": "Jeff", 
		"type": "enemy"
	},
	"e.mouse0": {
		"en-us": "", 
		"en-dm": "Mouse", 
		"type": "enemy"
	},
	"e.sqorl0": {
		"en-us": "", 
		"en-dm": "Sqorl", 
		"type": "enemy"
	},
	"e.bear0": {
		"en-us": "", 
		"en-dm": "Bear", 
		"type": "enemy"
	},
	"e.turky0": {
		"en-us": "", 
		"en-dm": "Turkey", 
		"type": "enemy"
	},
	"e.bossturky0": {
		"en-us": "", 
		"en-dm": "Boss Turkey", 
		"type": "enemy"
	},
	"e.Worker0": {
		"en-us": "", 
		"en-dm": "Carl", 
		"type": "enemy"
	},
	"e.Worker1": {
		"en-us": "", 
		"en-dm": "Dave", 
		"type": "enemy"
	},
	"e.Worker2": {
		"en-us": "", 
		"en-dm": "Chunk", 
		"type": "enemy"
	},
	"e.Worker3": {
		"en-us": "", 
		"en-dm": "Brett", 
		"type": "enemy"
	},
	"e.BossWorker0": {
		"en-us": "", 
		"en-dm": "James", 
		"type": "enemy"
	},
	"e.kelpBoy0": {
		"en-us": "", 
		"en-dm": "Kelp Boy", 
		"type": "enemy"
	},
	"e.fishFace0": {
		"en-us": "", 
		"en-dm": "Fish Face", 
		"type": "enemy"
	},
	"e.seaMonk0": {
		"en-us": "", 
		"en-dm": "Sea Monk", 
		"type": "enemy"
	},
	"e.seaHandR0": {
		"en-us": "", 
		"en-dm": "Sea Monster", 
		"type": "enemy"
	},
	"e.seaMan0": {
		"en-us": "", 
		"en-dm": "Sea Monster", 
		"type": "enemy"
	},
	"e.seaHandL0": {
		"en-us": "", 
		"en-dm": "Sea Monster", 
		"type": "enemy"
	},
	"e.chickBot0": {
		"en-us": "", 
		"en-dm": "Totally A Chicken", 
		"type": "enemy"
	},
	"e.piggun0": {
		"en-us": "", 
		"en-dm": "Gun Pig", 
		"type": "enemy"
	},
	"e.golem0": {
		"en-us": "", 
		"en-dm": "Veggie Golem", 
		"type": "enemy"
	},
	"e.lawnmower0": {
		"en-us": "", 
		"en-dm": "Lawn Mower", 
		"type": "enemy"
	},
	"e.machineA0": {
		"en-us": "", 
		"en-dm": "Machine A", 
		"type": "enemy"
	},
	"e.machineB0": {
		"en-us": "", 
		"en-dm": "Machine B", 
		"type": "enemy"
	},
	"e.machineC0": {
		"en-us": "", 
		"en-dm": "Machine C", 
		"type": "enemy"
	},
	"e.machineD0": {
		"en-us": "", 
		"en-dm": "Machine D", 
		"type": "enemy"
	},
	"e.router0": {
		"en-us": "", 
		"en-dm": "Router", 
		"type": "enemy"
	},
	"e.server0": {
		"en-us": "", 
		"en-dm": "Server", 
		"type": "enemy"
	},
	"e.housekeeper0": {
		"en-us": "", 
		"en-dm": "HOUSEKEEPER", 
		"type": "enemy"
	},
	"e.outlet0": {
		"en-us": "", 
		"en-dm": "Outlet", 
		"type": "enemy"
	},
	"e.mrbruno0": {
		"en-us": "", 
		"en-dm": "Mr. Bruno", 
		"type": "enemy"
	},
	"e.mobsty10": {
		"en-us": "", 
		"en-dm": "Mr. Ferrante", 
		"type": "enemy"
	},
	"e.mobsty11": {
		"en-us": "", 
		"en-dm": "Mr. Russo", 
		"type": "enemy"
	},
	"e.mobsty12": {
		"en-us": "", 
		"en-dm": "Mr. Randazzo", 
		"type": "enemy"
	},
	"e.mobsty20": {
		"en-us": "", 
		"en-dm": "Mr. Linetti", 
		"type": "enemy"
	},
	"e.mobsty21": {
		"en-us": "", 
		"en-dm": "Mr. Lucido", 
		"type": "enemy"
	},
	"e.mobsty22": {
		"en-us": "", 
		"en-dm": "Mr. Martinazzi", 
		"type": "enemy"
	},
	"e.mobBoss0": {
		"en-us": "", 
		"en-dm": "Don Vagante", 
		"type": "enemy"
	},
	"e.beeQueenA0": {
		"en-us": "", 
		"en-dm": "???", 
		"type": "enemy"
	},
	"e.beeQueenB0": {
		"en-us": "", 
		"en-dm": "???", 
		"type": "enemy"
	},
	"e.beeQueenC0": {
		"en-us": "", 
		"en-dm": "???", 
		"type": "enemy"
	},
	"e.robber0": {
		"en-us": "", 
		"en-dm": "Bank Robber", 
		"type": "enemy"
	},
	"e.dweebLord0": {
		"en-us": "", 
		"en-dm": "Dweeb Lord", 
		"type": "enemy"
	},
	// Falcon Deliveries
	"falconMsg0": {
		"en-us": "", 
		"en-dm": "It's a message from Nathan.", 
		"type": "text"
	},
	"falconMsg0.0": {
		"en-us": "", 
		"en-dm": "\"Hey, it's me! Your intern! I think I'm starting to get the hang of things here. I finally put out all the fires!\"", 
		"type": "text"
	},
	"falconMsg0.1": {
		"en-us": "", 
		"en-dm": "\"I'm kidding! There were no fires. But some of the crops you were growing were ripe, so I harvested them!\"", 
		"type": "text"
	},
	"falconMsg0.2": {
		"en-us": "", 
		"en-dm": "\"You really are an amazing farmer. Here are some of the seeds from the fresh veggies!\"", 
		"type": "text"
	},
	"falconMsg0.3": {
		"en-us": "", 
		"en-dm": "Attached to the letter are 10 Beet Seeds, 10 Carrot Seeds, and 5 Ginger Seeds.", 
		"type": "text"
	},
	"falconMsg0.4": {
		"en-us": "", 
		"en-dm": "\"I figure you'll probably have a hard time growing anything while out on the road, so here's a cool idea I had:\"", 
		"type": "text"
	},
	"falconMsg0.5": {
		"en-us": "", 
		"en-dm": "\"You give Iii some seeds, and when he gets back to me, I'll plant them for you.\"", 
		"type": "text"
	},
	"falconMsg0.6": {
		"en-us": "", 
		"en-dm": "\"Then the next time I have a message for you, I'll send the seeds from the crops with it!\"", 
		"type": "text"
	},
	"falconSelect": {
		"en-us": "", 
		"en-dm": "Select up to 5 seeds to send to Nathan.", 
		"type": "text"
	},
	"falconConfirm": {
		"en-us": "", 
		"en-dm": "Confirm.", 
		"type": "text"
	},
	"falconSeeds": {
		"en-us": "", 
		"en-dm": "Seeds:", 
		"type": "text"
	},
};
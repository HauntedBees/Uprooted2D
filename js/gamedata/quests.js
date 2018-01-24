/* Cutscene Quest IDs
    badEgg/goodEgg - egg fairy
*** bigBot - first boss
    rabbitShit - rabbit shat in your hands
    fishyTalk - talked to forest fish
    limeAndTheCoconut - got coconut seeds from Lime
    rapbattle - got GMO corn from RAPBATTLE
*** researchLab - second boss
*** helpSeaMonster/getHeart - third boss
    seamonkey - got key from Dowel
    kelpBoy - beat up kelp boy
*** gotSpareTire - fourth boss
    truckRepair - actually holding the tire
    croutonsFishingAdventure - got master bait from Crouton
    abuelaBonita - got funny mushroom from old lady
    // WHERE IS THE MAFIA ONE?
    stonehenge - got lotus from stoner
    youarebad - poisoned stoner
    foundRadish - found a radish
    theGoodSpanch - took Brandt's spinach
*** keycard - fifth boss
    talkedToReceptionist - talked to Food2 receptionist
    officeBeehive - got beehive in office
    fuzuru - talked to Marty several times
    hungryBoy - talked to hungry Food2 worker
    hungybin - took food from his bin
    helpNerd - saved nerd from the Monster
    theBeeQuest - got haunted bees
    ----------------------------------------
    Falcon 0: south of town
    Falcon 1: the bridge
    Falcon 2: fake farm
    Falcon 3: south city
    Falcon 4: north city
    Falcon 5: food2 HQ
*/
var quests = {
    getQuestText: function(name) {
        if(player.activeQuests[name] === undefined) { player.activeQuests[name] = 0; }
        var state = player.activeQuests[name];
        var questInfo = quests[name][state];
        if(questInfo.condition !== undefined) {
            if(questInfo.condition()) {
                questInfo.success();
            } else {
                questInfo.failure();
            }
            return quests.getQuestText(name);
        }
        if(questInfo.next !== undefined) { questInfo.next(); }
        return GetText(questInfo.text);
    },
    completeQuest: function(name) {
        delete player.activeQuests[name];
        player.questsCleared.push(name);
    },
    "quest1": [
        { text: "quest1.a", next: function() { player.activeQuests["quest1"] = 1 } },
        {
            condition: function() { return player.hasItem("shiitake"); },
            success: function() { player.activeQuests["quest1"] = 2 },
            failure: function() { player.activeQuests["quest1"] = 3 }
        },
        {
            text: "quest1.b",
            next: function() {
                worldmap.shop.resetTalk();
                player.achievements.push("goldshroom");
                player.increaseItem("_log", 1);
                player.decreaseItem("shiitake");
                quests.completeQuest("quest1");
            }
        },
        { text: "quest1.c", next: function() { player.activeQuests["quest1"] = 1 } },
        {
            text: "quest1.d", 
            next: function() {
                worldmap.shop.resetTalk();
                player.achievements.push("goldshroom");
                player.increaseItem("_log", 1);
                player.decreaseItem("shiitake");
                quests.completeQuest("quest1");
            }
        }
    ],
    "catmail": [
        { text: "catmail0", next: function() { } },
        {
            text: "catmail1", 
            next: function() {
                worldmap.shop.resetTalk();
                player.achievements.push("laila");
                quests.completeQuest("catmail");
            }
        }
    ]
};
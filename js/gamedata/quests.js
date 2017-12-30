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
                player.increaseItem("_log", 1);
                player.decreaseItem("shiitake");
                quests.completeQuest("quest1");
            }
        }
    ]
};
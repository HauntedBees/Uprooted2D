let Sounds = { // 284 TODO: this probably doesn't support playing the same sound twice at the same time
    SoundTable: {}, PlayingSounds: [], PersistingSounds: [], 
    Init: function() {
        const sounds = ["aBee"];
        sounds.forEach(s => {
            Sounds.SoundTable[s] = new Audio("sound/" + s + ".ogg");
            Sounds.SoundTable[s].onended = function() {
                let i = Sounds.PlayingSounds.indexOf(s);
                if(i >= 0) { Sounds.PlayingSounds.splice(i, 1); return; }
                i = Sounds.PersistingSounds.indexOf(s);
                if(i >= 0) { Sounds.PersistingSounds.splice(i, 1); return; }
            };
        });
    },
    PlaySound: function(name, persist) {
        console.log(`Now Playing: ${name}`);
        if(persist) {
            Sounds.PersistingSounds.push(name);
        } else {
            Sounds.PlayingSounds.push(name);
        }
        Sounds.SoundTable[name].currentTime = 0;
        Sounds.SoundTable[name].volume = player.options.sound / 10;
        Sounds.SoundTable[name].play();
    },
    EndAll: function() {
        Sounds.PlayingSounds.forEach(s => Sounds.SoundTable[s].pause());
        Sounds.PlayingSounds = [];
    }
};
Sounds.Init();
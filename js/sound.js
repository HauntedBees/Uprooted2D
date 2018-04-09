let Sounds = { // TODO: this probably doesn't support playing the same sound twice at the same time
    SoundTable: {}, PlayingSounds: [],
    Init: function() {
        const sounds = ["aBee"];
        sounds.forEach(s => {
            Sounds.SoundTable[s] = new Audio("sound/" + s + ".mp3");
            Sounds.SoundTable[s].onended = function() {
                let i = Sounds.PlayingSounds.indexOf(s);
                if(i >= 0) { Sounds.PlayingSounds.splice(i, 1); }
            };
        });
    },
    PlaySound: function(name) {
        Sounds.PlayingSounds.push(name);
        Sounds.SoundTable[name].currentTime = 0;
        Sounds.SoundTable[name].play();
    },
    EndAll: function() {
        Sounds.PlayingSounds.forEach(s => Sounds.SoundTable[s].pause() );
        Sounds.PlayingSounds = [];
    }
};
Sounds.Init();
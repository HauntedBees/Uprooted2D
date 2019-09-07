let Sounds = { // 284 TODO: this probably doesn't support playing the same sound twice at the same time
    SoundTable: {}, PlayingSounds: [], PersistingSounds: [], 
    Init: function() {
        const sounds = ["aBee",
                        // Bosca Ceoil
                        "confirm", "cancel",
                        "navOk", "navNok",
                        // BFXR
                        "toss", "beepattack", "pemp", "schwomp", "bops",
                        "explode", "crybaby", "squirrel", "destroyed",
                        // 512 boys
                        "pluck", "hit_gun", "hit_hard", "hit_hollow_metal", "hit_hollow", 
                        "hit_light", "hit_squishy", "hit_wet", "level_up"];
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
    PlayPlayerAttackSound: function(targIdx, crop) {
        const enemyType = combat.enemies[targIdx].sound;
        const hitType = crop === undefined ? "hollow" : crop.sound;
        const hitStr = `hit_${hitType}`, fullHitStr = `${hitStr}_${enemyType}`;
        if(Sounds.SoundTable[fullHitStr] !== undefined) {
            Sounds.PlaySound(fullHitStr);
        } else {
            Sounds.PlaySound(hitStr);
        }
    },
    PlaySound: function(name, persist, forcedVolume) {
        console.log(`Now Playing: ${name}`);
        if(persist) {
            Sounds.PersistingSounds.push(name);
        } else {
            Sounds.PlayingSounds.push(name);
        }
        Sounds.SoundTable[name].currentTime = 0;
        Sounds.SoundTable[name].volume = (forcedVolume || player.options.sound) / 10;
        Sounds.SoundTable[name].play();
    },
    EndAll: function() {
        Sounds.PlayingSounds.forEach(s => Sounds.SoundTable[s].pause());
        Sounds.PlayingSounds = [];
    }
};
Sounds.Init();
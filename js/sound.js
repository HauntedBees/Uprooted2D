let Sounds = { // 284 TODO: this probably doesn't support playing the same sound twice at the same time
    SoundTable: {}, PlayingSounds: [], PersistingSounds: [], 
    Init: function() {
        const sounds = ["aBee", "superman", // that one is a joke
                        // BFXR
                        "toss", "beepattack", "pemp", "schwomp", "bops",
                        "explode", "crybaby", "squirrel", "destroyed",
                        // COMBAT SOUNDS
                        "enterbattle",      // sfx_deathscream_alien1
                        "dangeresque",      // sfx_lowhealth_alarmloop4
                        "pluck",            // sfx_movement_jump17
                        "hit_gun",          // sfx_wpn_machinegun_loop8
                        "hit_hard",         // sfx_damage_hit5
                        "hit_hollow_metal", // sfx_menu_move4
                        "hit_hollow",       // sfx_sounds_damage3
                        "hit_light",        // sfx_sounds_impact3
                        "hit_squishy",      // sfx_sounds_interaction24
                        "hit_wet",          // sfx_sounds_button6
                        "levelup",         // sfx_sounds_fanfare3
                        // MENU SOUNDS
                        "confirm",          // made fresh
                        "cancel",           // made fresh
                        "navOk",            // sfx_menu_move4
                        "navNok",           // sfx_sounds_error10
                        // SHOP SOUNDS
                        "naptime",          // sfx_sounds_falling1
                        "wakeup",           // sfx_alarm_loop7
                        "purchase",         // sfx_coin_cluster5
                        "turnpage",         // sfx_movement_ladder4loop
                        "cantafford",       // sfx_sounds_error3
                        // WORLD MAP SOUNDS
                        "bwup",             // sfx_sounds_interaction14
                        "trayjure",         // sfx_movement_dooropen2
                        "biff",             // sfx_movement_jump9_landing
                        "push",             // sfx_movement_stairs1loop
                        "waterfall",        // sfx_vehicle_engineloop
                        "readtext",         // sfx_movement_stairs6loop
                        "dismisstext",      // sfx_sounds_error7
                        "entrance",         // sfx_movement_stairs3loop
                        "door",             // sfx_movement_dooropen2
                        "pauseI",           // sfx_sounds_pause1_in
                        "pauseO",           // sfx_sounds_pause1_out
                        // CUTSCENE SOUNDS
                        "dirtvwoom",        // sfx_sound_mechanicalnoise2
                        "tabletoss",        // sfx_movement_jump8
                        "jeflaf",           // sfx_deathscream_human12
                        "bamham",           // sfx_exp_odd3
                        "stompins",         // sfx_movement_footstepsloop4_fast
                        "nerdfall",         // sfx_sounds_falling7
                        "nerdfall2",        // sfx_sounds_falling7
                        "vibrate",          // sfx_sounds_impact12
                        "repair",           // sfx_sounds_interaction10
                        "voip",             // sfx_sound_neutral8
                        "carstop",          // sfx_vehicle_breaks
                        "soybean",          // sfx_deathscream_alien5 and sfx_deathscream_alien6
                        "driv",             // sfx_vehicle_carloop1
                        "water",            // sfx_movement_footstepsloop3_slow
                        "boom",             // sfx_exp_medium5
                        "bear",             // sfx_deathscream_human11
                        "breakvase",        // sfx_sounds_impact12
                        "itemget",          // sfx_sounds_fanfare2
                        "eee",              // sfx_movement_jump5
                        "eeeflap",          // sfx_movement_ladder6loop
                        "eggdrop"           // sfx_sounds_interaction9
                    ];
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
    EndSpecific: function(name) {
        Sounds.SoundTable[name].pause();
    },
    EndAll: function() {
        Sounds.PlayingSounds.forEach(s => Sounds.SoundTable[s].pause());
        Sounds.PlayingSounds = [];
    }
};
Sounds.Init();
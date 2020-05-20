class SoundHandler {
    constructor() {
        this.soundList = {};
        /** @type {string[]} */
        this.playingSounds = [];
        /** @type {string[]} */
        this.persistingSounds = [];

        const sounds = ["aBee", "superman", // that one is a joke
            // COMBAT SOUNDS
            "enterbattle",      // sfx_deathscream_alien1
            "dangeresque",      // sfx_lowhealth_alarmloop4
            "pluck",            // sfx_movement_jump17
            "hit_gun",          // sfx_wpn_machinegun_loop8
            "hit_hard",         // sfx_damage_hit5
            "hit_hollow_metal", // sfx_menu_move4
            "hit_hollow",       // sfx_sounds_damage3
            "hit_light",        // sfx_sounds_impact3
            "hit_squishy",      // sfx_sounds_impact3
            "hit_wet",          // sfx_sounds_button6
            "levelup",          // sfx_sounds_fanfare3
            "heal",             // sfx_coin_cluster1
            "compost",          // sfx_lowhealth_alarmloop6
            "homf",             // sfx_movement_ladder5loop
            // COMBAT DEATH SOUNDS
            "die_metal",        // sfx_deathscream_android8
            "die_human",        // sfx_deathscream_human14
            // MENU SOUNDS
            "confirm",          // made fresh
            "cancel",           // made fresh
            "navOk",            // sfx_menu_move4
            "navNok",           // sfx_sounds_error10
            "menuMove",         // sfx_menu_move3
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
            "elevator",         // sfx_vehicle_plainloop
            // CUTSCENE SOUNDS
            "fart",             // 241000__dsisstudios__short-fart-01
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
            this.soundList[s] = new Audio(`sound/${s}.ogg`);
            this.soundList[s].onended = () => {
                let i = this.playingSounds.indexOf(s);
                if(i >= 0) { this.playingSounds.splice(i, 1); return; }
                i = this.persistingSounds.indexOf(s);
                if(i >= 0) { this.persistingSounds.splice(i, 1); }
            }
        });
    }
    /**
     * @param {string} name
     * @param {boolean} [persist]
     * @param {number} [forcedVolume]
     */
    PlaySound(name, persist, forcedVolume) {
        console.log(`Now Playing: ${name}`);
        if(this.soundList[name] === undefined) { return; } // placeholder for dev
        if(game2.player.options.sound === 0) { return; }
        if(persist) {
            this.persistingSounds.push(name);
        } else {
            this.playingSounds.push(name);
        }
        this.soundList[name].currentTime = 0;
        this.soundList[name].volume = (forcedVolume || game2.player.options.sound) / 20;
        this.soundList[name].play();
    }
    /**
     * @param {number} name
     */
    EndSpecificSound(name) {
        this.soundList[name].pause();
    }
    EndAllSounds() {
        this.playingSounds.forEach(s => this.soundList[s].pause());
        this.playingSounds = [];
    }
    /**
     * @param {number} targIdx
     * @param {any} crop
     */
    PlayPlayerAttackSound(targIdx, crop) {
        // TODO: this
        const enemyType = 0;//combat.enemies[targIdx].sound;
        const hitType = crop === undefined ? "hollow" : crop.sound;
        const hitStr = `hit_${hitType}`, fullHitStr = `${hitStr}_${enemyType}`;
        if(this.soundList[fullHitStr] !== undefined) {
            this.PlaySound(fullHitStr);
        } else {
            this.PlaySound(hitStr);
        }
    }
}
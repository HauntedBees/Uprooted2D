const animalInfo = {
    "Rabbit": { appearChance: 0.03, damageMult: 4, invSprite: "animalRabbit0", min: 32, max: 64, anim: HoppingAnim },
    "Duck": { appearChance: 0.05, damageMult: 5, invSprite: "animalDuck0", min: 24, max: 48, 
                anim: WalkAnim, minY: 2, maxY: 4, minSpeed: 0.5, maxSpeed: 1.5 },
    "Worm": { appearChance: 0.02, damageMult: 3, invSprite: "animalWorm0", min: 8, max: 12,
                anim: WalkAnim, minY: 3, maxY: 4.25, isWorm: true, minSpeed: 0.25, maxSpeed: 0.5 },
    "Monkey": { appearChance: 0.03, damageMult: 8, invSprite: "animalMonkey0", min: 12, max: 32, anim: HoppingAnim },
    "Frog": { appearChance: 0.1, damageMult: 6, invSprite: "animalFrog0", min: 24, max: 48, anim: HoppingAnim },
    "Bear": { appearChance: 0.05, damageMult: 10, invSprite: "BearIco", min: 3, max: 6, 
                anim: WalkAnim, minY: 1.75, maxY: 3.5, minSpeed: 0.125, maxSpeed: 0.25, offsetY: 2.75 },
    "Slug": { appearChance: 0.01, damageMult: 2, invSprite: "animalSlug0", min: 4, max: 6, 
                anim: WalkAnim, minY: 3, maxY: 4.25, trail: "slugTrail", minSpeed: 0.125, maxSpeed: 0.125, closeStart: true }
};
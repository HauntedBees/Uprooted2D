pausemenu.skilltree = {
    orbs: [],
    animIdx: -1, animAngle: 0, totalRot: 0,
    currIdx: 0, treeY: 0,
    layersToClear: ["menuA", "menuB", "menucursorA", "menutext"],
    setup: function() {
        this.orbs = [];
        this.currIdx = 0;
        this.treeY = -1;
        var skills = ["Sspring", "Ssummer", "Sautumn", "Swinter", "season"];
        for(var i = 0; i < skills.length; i++) {
            var angle = 130 + i * 33;
            var name = "skill_" + skills[i] + player.skilltree[skills[i]];
            this.orbs.push({ name: name, angle: angle, basename: skills[i] });
        }
        this.drawOrbs();
        this.drawTree();
    },
    rotate: function() {
        gfx.clearSome(pausemenu.skilltree.layersToClear);
        for(var i = 0; i < pausemenu.skilltree.orbs.length; i++) {
            var angle = (pausemenu.skilltree.orbs[i].angle + pausemenu.skilltree.animAngle) % 360;
            if(angle < 0) { angle += 360; }
            pausemenu.skilltree.orbs[i].angle = angle;
        }
        pausemenu.skilltree.drawOrbs();
        pausemenu.skilltree.totalRot += Math.abs(pausemenu.skilltree.animAngle);
        gfx.drawInfobox(10, 5, 3.25);
        gfx.drawCursor(2.6, 1.75, 0, 0);
        if(pausemenu.skilltree.orbs[pausemenu.skilltree.currIdx].angle == 130) {
            clearInterval(pausemenu.skilltree.animIdx);
            pausemenu.skilltree.animIdx = -1;
            pausemenu.skilltree.drawTree();
        }
        pausemenu.skilltree.drawPoints();
    },
    drawOrbs: function() {
        for(var i = 0; i < pausemenu.skilltree.orbs.length; i++) {
            var orb = pausemenu.skilltree.orbs[i];
            var pos = pausemenu.skilltree.angleToCircle(orb.angle, 4.5, 1, 3);
            gfx.drawTileToGrid(orb.name, pos.x, pos.y, pos.layer);
        }
    },
    drawPoints: function() { 
        gfx.drawInfobox(16, 1.5, 8.15);
        gfx.drawText("Skill Points: " + player.eploids, 4, 8.85 * 16);
    },
    getSkillInfo: function() {
        gfx.clearSome(["menucursorA", "menutext"]);
        pausemenu.skilltree.drawTree(true);
        var x = this.treeY < 10 ? 2.5 : (this.treeY < 20 ? 2 : 3);
        var y = this.treeY < 10 ? 3 + this.treeY : (5 + this.treeY % 10);
        if(this.orbs[this.currIdx].basename == "season" && this.treeY > 0) { y -= 1; }
        gfx.drawCursor(x, y, 0, 0);
        gfx.drawWrappedText(miscText["skill_" + this.orbs[this.currIdx].basename + this.treeY], 16 * 5.5, 16 * 4, 145);
    },
    drawTree: function(noCursor) {
        var orb = this.orbs[this.currIdx];
        gfx.drawTileToGrid(this.getOrbName(orb.basename, 0), 2.5, 3, "menuA");
        if(orb.basename == "season") {
            gfx.drawTileToGrid(this.getOrbName(orb.basename, 10), 2, 4, "menuA");
            gfx.drawTileToGrid(this.getOrbName(orb.basename, 20), 3, 4, "menuA");
            gfx.drawTileToGrid(this.getOrbName(orb.basename, 11), 2, 5, "menuA");
            gfx.drawTileToGrid(this.getOrbName(orb.basename, 21), 3, 5, "menuA");
            gfx.drawTileToGrid(this.getOrbName(orb.basename, 12), 2, 6, "menuA");
            gfx.drawTileToGrid(this.getOrbName(orb.basename, 22), 3, 6, "menuA");
        } else {
            gfx.drawTileToGrid(this.getOrbName(orb.basename, 1), 2.5, 4, "menuA");
            if(orb.basename.indexOf("S") < 0) {
                gfx.drawTileToGrid(this.getOrbName(orb.basename, 10), 2, 5, "menuA");
                gfx.drawTileToGrid(this.getOrbName(orb.basename, 20), 3, 5, "menuA");
                gfx.drawTileToGrid(this.getOrbName(orb.basename, 11), 2, 6, "menuA");
                gfx.drawTileToGrid(this.getOrbName(orb.basename, 21), 3, 6, "menuA");
            }
        }
        gfx.drawInfobox(10, 5, 3.25);
        this.drawPoints();
        if(!noCursor) { gfx.drawCursor(2.6, 1.75, 0, 0); }
    },
    getOrbName: function(base, idx) {
        var actVal = player.skilltree[base];
        var disabled = "skillD_" + base + idx;
        var active = "skill_" + base + idx;
        if(idx < 10) {
            return actVal >= idx ? active : disabled;
        }
        if(idx >= 10 && idx < 20) {
            if(actVal >= 20) { return disabled; }
            return actVal >= idx ? active : disabled;
        }
        if(idx >= 20) {
            if(actVal < 20) { return disabled; }
            return actVal >= idx ? active : disabled;
        }
        return disabled;
    },
    angleToCircle: function(angle, cx, cy, r) {
        var radians = angle / 180 * Math.PI;
        return {
            x: (cx + r * Math.cos(radians)),
            y: (cy + r * Math.sin(radians) / 3),
            layer: (angle > 180) ? "menuA" : "menuB"
        };
    },
    clean: function() { gfx.clearAll(); },
    mouseMove: function(pos) {
        return true;
    },
    click: function(pos) {
        if(player.eploids == 0) { return false; }
        var skill = this.orbs[this.currIdx].basename;
        var currentLevel = player.skilltree[skill];
        var doUpgrade = false;
        if((currentLevel + 1) == this.treeY) {
            doUpgrade = true;
        } else if(currentLevel >= 20) {
            if((currentLevel + 1) == this.treeY) {
                doUpgrade = true;
            }
        } else if(currentLevel >= 10) {
            if((currentLevel + 1) == this.treeY) {
                doUpgrade = true;
            }
        } else if(currentLevel == 1 && (this.treeY == 10 || this.treeY == 20)) {
            doUpgrade = true;
        } else if(skill == "season" && currentLevel == 0 && (this.treeY == 10 || this.treeY == 20)) {
            doUpgrade = true;
        }
        if(!doUpgrade) { return false; }
        player.eploids--;
        player.skilltree[skill] = this.treeY;
        this.orbs[this.currIdx].name = "skill_" + this.orbs[this.currIdx].basename + player.skilltree[this.orbs[this.currIdx].basename];
        this.drawOrbs();
        this.getSkillInfo();
        return true;
    },
    cancel: function() { game.transition(this, pausemenu, 3); },
    keyPress: function(key) {
        var pos = { x: 0, y: 0 };
        var isEnter = false;
        switch(key) {
            case "w": pos.y--; break;
            case "a": pos.x--; break;
            case "s": pos.y++; break;
            case "d": pos.x++; break;
            case " ":
            case "Enter": isEnter = true; break;
            case "q": return this.cancel();
        }
        if(this.animIdx >= 0) { return false; }
        if(isEnter) {
            if(this.treeY >= 0) {
                return this.click(pos);
            } else {
                pos = { x: 0, y: 1 };
            }
        }
        if(pos.x == 0 && pos.y == 0) { return false; }
        if(this.treeY < 0) {
            if(pos.y <= 0) {
                this.totalRot = 0;
                this.animAngle = pos.x;
                this.currIdx = (this.currIdx - pos.x) % this.orbs.length;
                if(this.currIdx < 0) { this.currIdx = this.orbs.length - 1; }
                this.animIdx = setInterval(this.rotate, 10);
                return;
            } else {
                this.treeY = 0;
            }
        } else {
            if(this.treeY == 0) {
                if(pos.y == 1) {
                    if(this.orbs[this.currIdx].basename == "season") {
                        this.treeY = Math.random() < 0.5 ? 10 : 20;
                    } else {
                        this.treeY = 1;
                    }
                } else if(pos.y == -1) {
                    this.treeY = -1;
                    gfx.clearSome(["menucursorA", "menutext"]);
                    this.drawTree();
                    return;
                }
            } else if(this.treeY == 1) {
                if(pos.y == 1 && this.orbs[this.currIdx].basename[0] != "S") {
                    this.treeY = Math.random() < 0.5 ? 10 : 20;
                } else if(pos.y == -1) {
                    this.treeY = 0;
                }
            } else if(this.treeY == 10 || this.treeY == 20) {
                if(pos.y == 1) {
                    this.treeY++;
                } else if(pos.y == -1) {
                    this.treeY = (this.orbs[this.currIdx].basename == "season") ? 0 : 1;
                } else if(this.treeY == 10 && pos.x == 1) {
                    this.treeY = 20;
                } else if(this.treeY == 20 && pos.x == -1) {
                    this.treeY = 10;
                }
            } else if(this.treeY == 11 || this.treeY == 21) {
                if(pos.y == 1) {
                    if(this.orbs[this.currIdx].basename == "season") {
                        this.treeY++;
                    }
                } else if(pos.y == -1) {
                    this.treeY--;
                } else if(this.treeY == 11 && pos.x == 1) {
                    this.treeY = 21;
                } else if(this.treeY == 21 && pos.x == -1) {
                    this.treeY = 11;
                }
            } else if(this.treeY == 12 || this.treeY == 22) {
                if(pos.y == -1) {
                    this.treeY--;
                } else if(this.treeY == 12 && pos.x == 1) {
                    this.treeY = 22;
                } else if(this.treeY == 22 && pos.x == -1) {
                    this.treeY = 12;
                }
            }
        }
        this.getSkillInfo();
        /*if(isEnter) {
            return this.click(pos);
        } else {
            return this.mouseMove(pos);
        }*/
    }
};
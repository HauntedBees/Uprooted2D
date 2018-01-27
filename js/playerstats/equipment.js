pausemenu.equipment = {
    cursor: { x: 0, y: 0 }, textY: 100, 
    rowData: [], curY: 0,
    layersToClear: ["menuA", "menucursorA", "menucursorB", "menutext"],
    setup: function() {
        this.cursor = {x: 0, y: 0};
        this.drawAll();
    },
    drawAll: function() {
        gfx.clearSome(this.layersToClear);
        this.rowData = [[], [], [], []];
        gfx.drawInfobox(16, 5, 5);
        var numItems = 0;
        for(var i = 0; i < player.inventory.length; i++) {
            var itemName = player.inventory[i][0];
            if(itemName[0] !== "!") { continue; }
            var y = 0;
            var item = GetEquipment(itemName);
            var details = { actualIndex: i, name: itemName, equipped: player.isEquipped(itemName) };
            switch(item.type) {
                case "weapon": y = 0; break;
                case "compost": y = 1; break;
                case "gloves": y = 2; break;
                case "soil": y = 3; break;
            }
            this.rowData[y].push(details); //if(details.equipped) { this.rowData[y].unshift(details); } else { this.rowData[y].push(details); }
            numItems++;
        }
        for(var i = 0; i < this.rowData.length; i++) {
            var items = this.rowData[i];
            for(var j = 0; j < items.length; j++) {
                var item = items[j];
                gfx.drawInventoryItem(player.inventory[item.actualIndex], j, i, "menuA");
                if(item.equipped) {
                    gfx.drawCursor(j, i, 0, 0, "xcursor");
                }
            }
        }
        if(numItems === 0) { return; } // TODO: something nicer than this!
        gfx.drawCursor(this.cursor.x, this.cursor.y, 0, 0);
        this.setText();
    },
    clean: function() { gfx.clearSome(this.layersToClear); },
    cancel: function() { game.innerTransition(this, pausemenu, 1); },
    mouseMove: function(pos) {
        if(pos.x < 0 || pos.y < 0) { return false; }
        var dy = pos.y - this.cursor.y;
        if(pos.y >= this.rowData.length) { return false; }
        if(pos.x >= this.rowData[pos.y].length) {
            pos.x = this.rowData[pos.y].length - 1;
        } 
        while(pos.x < 0 && pos.y < (this.rowData.length - 1)) {
            pos.y += dy;
            pos.x = Math.min(this.cursor.x, this.rowData[pos.y].length - 1);
        }
        this.cursor = { x: pos.x, y: pos.y };
        this.drawAll();
        return true;
    },
    click: function(pos) {
        if(pos.x < 0 || pos.y < 0) { return false; }
        if(pos.y >= this.rowData.length) { return false; }
        if(pos.x >= this.rowData[pos.y].length) { return false; }
        var item = player.inventory[this.rowData[this.cursor.y][this.cursor.x].actualIndex];
        var equipInfo = GetEquipment(item[0]);
        if(player.equipment[equipInfo.type] === item[0]) {
            player.equipment[equipInfo.type] = null;
        } else {
            player.equipment[equipInfo.type] = item[0];
        }
        this.drawAll();
        return true;
    },
    keyPress: function(key) {
        var pos = { x: this.cursor.x, y: this.cursor.y };
        var isEnter = false;
        switch(key) {
            case player.controls.up: pos.y--; break;
            case player.controls.left: pos.x--; break;
            case player.controls.down: pos.y++; break;
            case player.controls.right: pos.x++; break;
            case player.controls.confirm:
            case player.controls.pause: isEnter = true; break;
            case player.controls.cancel: return this.cancel();
        }
        if(pos.y < 0 || pos.x < 0) { return false; }
        if(isEnter) {
            return this.click(pos);
        } else {
            return this.mouseMove(pos);
        }
    },
    setText: function() {
        var actIdx = this.rowData[this.cursor.y][this.cursor.x].actualIndex;
        var item = player.inventory[actIdx];
        var equipInfo = GetEquipment(item[0]);
        var str = this.GetEquipDescComparedToCurrent(equipInfo);
        gfx.drawWrappedText(str, 4, this.textY, 235);
    },
    GetEquipDescComparedToCurrent: function(equipInfo) {
        var current = player.equipment[equipInfo.type];
        if(current === null) {
            current = { power: 0, amount: 0, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0, noEnemies: true };
        } else {
            current = GetEquipment(current);
        }
        var str = equipInfo.displayname;
        this.curY = 0;
        if(equipInfo.type === "weapon") {
            str += this.GetComparison(GetText("eq.power") + " ", equipInfo, current, "power", "number");
            str += this.GetComparison(GetText("eq.hitCrops") + " ", equipInfo, current, "targetCrops", "bool");
            str += this.GetComparison(GetText("eq.hitEnemies") + " ", equipInfo, current, "noEnemies", "!bool");
            str += this.GetComparison(GetText("eq.sp") + " ", equipInfo, current, "sp", "boolnum");
            str += this.GetComparison(GetText("eq.su") + " ", equipInfo, current, "su", "boolnum");
            str += this.GetComparison(GetText("eq.au") + " ", equipInfo, current, "au", "boolnum");
            str += this.GetComparison(GetText("eq.wi") + " ", equipInfo, current, "wi", "boolnum");
            str += this.GetComparison(GetText("eq.sickle2") + " ", equipInfo, current, "tech", "bool");
            str += this.GetComparison("", equipInfo, current, "attacks", "attacks");
        } else if(equipInfo.type === "compost") {
            str += this.GetComparison(GetText("eq.holds") + " ", equipInfo, current, "amount", "number");
            str += this.GetComparison(GetText("eq.compattack") + " ", equipInfo, current, "canAttack", "bool");
            str += this.GetComparison(GetText("eq.rotten") + " ", equipInfo, current, "rotOnly", "bool");
            str += this.GetComparison(GetText("eq.bonus") + " ", equipInfo, current, "bonus", "number", true);
            str += this.GetComparison(GetText("eq.backfire") + " ", equipInfo, current, "tech", "bool");
        } else if(equipInfo.type === "gloves") {
            str += this.GetComparison(GetText("eq.spturn") + " ", equipInfo, current, "amount", "number");
            str += this.GetComparison(GetText("eq.actafter") + " ", equipInfo, current, "canAttack", "bool");
            str += this.GetComparison(GetText("eq.dmgresist") + " ", equipInfo, current, "def", "number", true);
            str += this.GetComparison(GetText("eq.mayshock1") + " ", equipInfo, current, "tech", "bool");
            str += this.GetComparison(GetText("eq.mayshock2") + " ", equipInfo, current, "tech", "bool");
        } else if(equipInfo.type === "soil") {
            str += this.GetComparison(GetText("eq.growth") + " ", equipInfo, current, "speed", "number", true);
            str += this.GetComparison(GetText("eq.sres") + " ", equipInfo, current, "boost", "number", true);
            str += this.GetComparison(GetText("eq.sstr") + " ", equipInfo, current, "amplify", "number", true);
            str += this.GetComparison(GetText("eq.willkill1") + " ", equipInfo, current, "tech", "bool");
            str += this.GetComparison(GetText("eq.willkill2") + " ", equipInfo, current, "tech", "bool");
        }
        return str;
    },
    GetComparison: function(str, newequip, oldequip, column, compareType, isPercent) {
        var y = 416 + (this.curY * 32);
        var newVal = newequip[column];
        var oldVal = oldequip[column];
        if(compareType === "number") {
            if(newVal === oldVal) { 
                if(newVal === 0) { return ""; }
                this.curY++;
                return "\n " + str + (isPercent ? (newVal * 100) + "%" : newVal);
            }
            this.curY++;
            var initW = gfx.getTextWidth(str);
            var nextW = gfx.getTextWidth(str + (isPercent ? (oldVal * 100) + "%" : oldVal));
            gfx.drawStrikeThru(12 + initW, y, nextW - initW + 4);
            return "\n " + str + (isPercent ? (oldVal * 100) + "%" : oldVal) + " " + (isPercent ? (newVal * 100) + "%" : newVal);
        } else if(compareType === "bool") {
            if(newVal === oldVal) {
                if(newVal === true) { this.curY++; return "\n " + str; } else { return ""; }
            } else {
                this.curY++;
                if(newVal === true) { return "\n +" + str; }
                else {
                    gfx.drawStrikeThru(12, y, gfx.getTextWidth(str) - 16);
                    return "\n " + str;
                }
            }
        } else if(compareType === "!bool") {
            if(newVal === oldVal) {
                if(!newVal === true) { this.curY++; return "\n " + str; } else { return ""; }
            } else {
                this.curY++;
                if(!newVal === true) { return "\n +" + str; }
                else {
                    gfx.drawStrikeThru(12, y, gfx.getTextWidth(str) - 16);
                    return "\n " + str;
                }
            }
        } else if(compareType === "boolnum") {
            if(newVal === oldVal) {
                if(newVal > 0) { this.curY++; return "\n " + str; } else { return ""; }
            } else {
                this.curY++;
                if(newVal > 0) { return "\n +" + str; }
                else {
                    gfx.drawStrikeThru(12, y, gfx.getTextWidth(str) - 16);
                    return "\n " + str;
                }
            }
        } else if(compareType === "attacks") {
            if(newVal === oldVal) {
                if(newVal === 999) {
                    this.curY++;
                    return "\n " + GetText("eq.attackall");
                } else if(newVal > 0) {
                    this.curY++;
                    return "\n " + GetText("eq.attacksome").replace(/\{0\}/g, newVal);
                } else { return ""; }
            } else {
                this.curY++;
                if(newVal === undefined || newVal === 0) { // from some value to one
                    var str = "";
                    if(oldVal === 999) {
                        str = GetText("eq.attackall");
                    } else if(oldVal > 0) {
                        str = GetText("eq.attacksome").replace(/\{0\}/g, oldVal);
                    }
                    gfx.drawStrikeThru(12, y, gfx.getTextWidth(str) - 16);
                    return "\n " + str;
                } else if(newVal === 999) { // from some value to ALL
                    if(oldVal > 0) {
                        var str = GetText("eq.attacksome").replace(/\{0\}/g, oldVal);
                        gfx.drawStrikeThru(12, y, gfx.getTextWidth(str) - 16);
                        this.curY += 2;
                        return "\n " + str + "\n " + GetText("eq.attackall");
                    } else {
                        this.curY++;
                        return "\n +" + GetText("eq.attackall");
                    }
                } else { // from some value to some other value
                    if(oldVal === 999) {
                        var str = GetText("eq.attackall");
                        gfx.drawStrikeThru(12, y, gfx.getTextWidth(str) - 16);
                        this.curY += 2;
                        return "\n " + str + "\n " + GetText("eq.attacksome").replace(/\{0\}/g, newVal);
                    } else if(oldVal > 0) {
                        var str = GetText("eq.attacksome").replace(/\{0\}/g, oldVal);
                        gfx.drawStrikeThru(12, y, gfx.getTextWidth(str) - 16);
                        this.curY += 2;
                        return "\n " + str + "\n " + GetText("eq.attacksome").replace(/\{0\}/g, newVal);
                    } else {
                        this.curY++;
                        return "\n +" + GetText("eq.attacksome").replace(/\{0\}/g, newVal);
                    }
                }
            }
        }
    }
};
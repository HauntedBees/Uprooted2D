pausemenu.equipment = {
    mouseReady: true, 
    cursor: { x: 0, y: 0 }, textY: 80, equipTextY: 168, equipFontSize: 16, equipWidth: 55,
    rowData: [], curY: 0, dy: 1.5, dx: 2.5, animHelper: null, backStartX: 0, backButtonW: 0, 
    layersToClear: ["menuA", "menutext"],
    setup: function() {
        this.cursor = { x: 0, y: 0 };
        this.cursors = new CursorAnimSet([
            { key: "main", x: this.cursor.x, y: this.cursor.y, w: 0, h: 0, type: "cursor", layer: "menucursorA" },
            { key: "weapon", x: -1, y: -1, w: 0, h: 0, type: "xcursor", layer: "menucursorB" },
            { key: "compost", x: -1, y: -1, w: 0, h: 0, type: "xcursor", layer: "menucursorB" },
            { key: "gloves", x: -1, y: -1, w: 0, h: 0, type: "xcursor", layer: "menucursorB" },
            { key: "soil", x: -1, y: -1, w: 0, h: 0, type: "xcursor", layer: "menucursorB" }
        ]);
        this.animHelper = new CombatAnimHelper([]);
        gfx.TileBackground("invTile");
        this.drawAll();
        this.cursors.Start();
    },
    drawAll: function() {
        gfx.clearSome(this.layersToClear);
        pausemenu.DrawInnerHeading("eq.Heading");

        this.rowData = [[], [], [], []];
        gfx.drawInfobox(18, 4.5, this.dy + 4.25);
        for(let i = 0; i < 4; i++) {
            gfx.drawMinibox(0.3125 + i * 3.875, this.dy + 8.875, 2.75, 2.5);
        }
        const equipTopY = this.dy + 9.125;
        const equipTextTopY = this.dy * 16 + this.equipTextY;
        if(player.equipment.weapon !== null) {
            const eq = GetEquipment(player.equipment.weapon), x = 0.3125;
            gfx.drawTileToGrid(player.equipment.weapon, x + 0.25, equipTopY, "menuA");
            gfx.drawWrappedText(GetEquipmentDesc(eq, true), x * 16 + 5, equipTextTopY, this.equipWidth, "#000000", "menutext", this.equipFontSize);
        } else { this.cursors.MoveCursor("weapon", -1, -1); }
        if(player.equipment.compost !== null) {
            const eq = GetEquipment(player.equipment.compost), x = 4.1875;
            gfx.drawTileToGrid(player.equipment.compost, x + 0.25, equipTopY, "menuA");
            gfx.drawWrappedText(GetEquipmentDesc(eq, true), x * 16 + 5, equipTextTopY, this.equipWidth, "#000000", "menutext", this.equipFontSize);
        } else { this.cursors.MoveCursor("compost", -1, -1); }
        if(player.equipment.gloves !== null) {
            const eq = GetEquipment(player.equipment.gloves), x = 8.0625;
            gfx.drawTileToGrid(player.equipment.gloves, x + 0.25, equipTopY, "menuA");
            gfx.drawWrappedText(GetEquipmentDesc(eq, true), x * 16 + 5, equipTextTopY, this.equipWidth, "#000000", "menutext", this.equipFontSize);
        } else { this.cursors.MoveCursor("gloves", -1, -1); }
        if(player.equipment.soil !== null) {
            const eq = GetEquipment(player.equipment.soil), x = 11.9375;
            gfx.drawTileToGrid(player.equipment.soil, x + 0.25, equipTopY, "menuA");
            gfx.drawWrappedText(GetEquipmentDesc(eq, true), x * 16 + 5, equipTextTopY, this.equipWidth, "#000000", "menutext", this.equipFontSize);
        } else { this.cursors.MoveCursor("soil", -1, -1); }
        let numItems = 0;
        for(let i = 0; i < player.inventory.length; i++) {
            const itemName = player.inventory[i][0];
            if(itemName[0] !== "!") { continue; }
            let y = 0;
            const item = GetEquipment(itemName);
            const details = { actualIndex: i, name: itemName, type: item.type, equipped: player.isEquipped(itemName) };
            switch(item.type) {
                case "weapon": y = 0; break;
                case "compost": y = 1; break;
                case "gloves": y = 2; break;
                case "soil": y = 3; break;
            }
            this.rowData[y].push(details);
            numItems++;
        }
        for(let i = 0; i < this.rowData.length; i++) {
            const items = this.rowData[i];
            for(let j = 0; j < items.length; j++) {
                const item = items[j];
                gfx.drawTileToGrid("toolRack", this.dx + j, this.dy + i, "menuA");
                gfx.drawInventoryItem(player.inventory[item.actualIndex], this.dx + j, this.dy + i, "menuA");
                if(item.equipped) {
                    this.cursors.MoveCursor(item.type, this.dx + j, this.dy + i);
                }
            }
            for(let j = items.length; j < 11; j++) {
                gfx.drawTileToGrid("toolRack", this.dx + j, this.dy + i, "menuA");
            }
        }
        this.animHelper.DrawWrapper(this.dx, this.dy, 11, 4);

        if(numItems === 0) { this.cursor = { x: 0, y: -1 }; }
        this.backStartX = 0.125;
        this.backButtonW = gfx.drawInfoText(GetText("menu.Back"), this.backStartX, -0.0625, this.cursor.y === -1 && this.cursor.x === 0, "menuA", "menutext");

        if(this.cursor.y === -1) {
            this.cursors.RedimCursor("main", this.backStartX, 0, this.backButtonW, -0.25);
            gfx.drawWrappedText(GetText("inv.BackInfo"), 4, this.dy * 16 + this.textY, 235);
        } else {
            this.cursors.RedimCursor("main", this.dx + this.cursor.x, this.dy + this.cursor.y, 0, 0);
            this.setText();
        }
    },
    cancel: function() { game.innerTransition(this, pausemenu, 1); },
    mouseMove: function(pos) {
        const dpos = { x: pos.x - this.dx, y: pos.y - this.dy };
        if(dpos.y < 0) {
            dpos.x += this.dx;
            dpos.y = -1;
            if(dpos.x >= this.backStartX && dpos.x < (this.backButtonW + 1)) {
                dpos.x = 0;
            } else { return false; }
        } else {
            input.FloorPoint(dpos);
            if(dpos.y < 0 || dpos.x < 0 || dpos.y > 3   ) { return false; }
        }
        this.CursorMove(dpos);
    },
    click: function() {
        if(this.cursor.y === -1) {
            this.cancel();
            return true;
        }
        if(this.cursor.x < 0 || this.cursor.y < 0) { return false; }
        if(this.cursor.y >= this.rowData.length) { return false; }
        if(this.cursor.x >= this.rowData[this.cursor.y].length) { return false; }
        const item = player.inventory[this.rowData[this.cursor.y][this.cursor.x].actualIndex];
        const equipInfo = GetEquipment(item[0]);
        if(player.equipment[equipInfo.type] === item[0]) {
            player.equipment[equipInfo.type] = null;
        } else {
            player.equipment[equipInfo.type] = item[0];
        }
        this.drawAll();
        return true;
    },
    keyPress: function(key) {
        let pos = { x: this.cursor.x, y: this.cursor.y };
        let isEnter = false;
        switch(key) {
            case player.controls.up: pos.y--; break;
            case player.controls.left: pos.x--; break;
            case player.controls.down: pos.y++; break;
            case player.controls.right: pos.x++; break;
            case player.controls.confirm:
            case player.controls.pause: isEnter = true; break;
            case player.controls.cancel: return this.cancel();
        }
        if(pos.y < -1 || pos.x < 0) { return false; }
        if(isEnter) { return this.click(); }
        else { return this.CursorMove(pos); }
    },
    CursorMove: function(pos) {
        if(pos.x < 0 || pos.y < -1) { return false; }
        if(pos.y === -1) {
            pos.x = 0;
        } else {
            const dy = pos.y - this.cursor.y;
            if(pos.y >= this.rowData.length) { return false; }
            if(pos.x >= this.rowData[pos.y].length) {
                pos.x = this.rowData[pos.y].length - 1;
            } 
            if(this.rowData[pos.y] === null || this.rowData[pos.y] === undefined || this.rowData[pos.y].length === 0) { return false; }
            while(pos.x < 0 && pos.y < (this.rowData.length - 1)) {
                pos.y += dy;
                pos.x = Math.min(this.cursor.x, this.rowData[pos.y].length - 1);
            }
            if(pos.y >= this.rowData.length || this.rowData[pos.y].length === 0) { return false; }
        }
        this.cursor = { x: pos.x, y: pos.y };
        this.drawAll();
        return true;
    },
    setText: function() {
        const actIdx = this.rowData[this.cursor.y][this.cursor.x].actualIndex;
        const item = player.inventory[actIdx];
        const equipInfo = GetEquipment(item[0]);
        const str = this.GetEquipDescComparedToCurrent(equipInfo);
        gfx.drawWrappedText(str, 4, this.dy * 16 + this.textY, 235);
    },
    GetEquipDescComparedToCurrent: function(equipInfo) {
        let current = player.equipment[equipInfo.type];
        if(current === null) {
            current = { power: 0, amount: equipInfo.type === "gloves" ? 1 : 0, bonus: 0, def: 0, speed: 0, boost: 0, amplify: 0, noEnemies: true };
        } else {
            current = GetEquipment(current);
        }
        let str = equipInfo.displayname;
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
        const y = 436 + (this.curY * (gfx.GetFont() === "OpenDyslexic" ? 35 : 32));
        const newVal = newequip[column];
        const oldVal = oldequip[column];
        if(compareType === "number") {
            if(newVal === oldVal) { 
                if(newVal === 0) { return ""; }
                this.curY++;
                return "\n " + str + (isPercent ? (newVal * 100) + "%" : newVal);
            }
            this.curY++;
            const initW = gfx.getTextWidth(str);
            const nextW = gfx.getTextWidth(str + (isPercent ? (oldVal * 100) + "%" : oldVal));
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
                    let newstr = "";
                    if(oldVal === 999) {
                        newstr = GetText("eq.attackall");
                    } else if(oldVal > 0) {
                        newstr = GetText("eq.attacksome").replace(/\{0\}/g, oldVal);
                    }
                    gfx.drawStrikeThru(12, y, gfx.getTextWidth(newstr) - 16);
                    return "\n " + newstr;
                } else if(newVal === 999) { // from some value to ALL
                    if(oldVal > 0) {
                        const newstr = GetText("eq.attacksome").replace(/\{0\}/g, oldVal);
                        gfx.drawStrikeThru(12, y, gfx.getTextWidth(newstr) - 16);
                        this.curY += 2;
                        return "\n " + newstr + "\n " + GetText("eq.attackall");
                    } else {
                        this.curY++;
                        return "\n +" + GetText("eq.attackall");
                    }
                } else { // from some value to some other value
                    if(oldVal === 999) {
                        const newstr = GetText("eq.attackall");
                        gfx.drawStrikeThru(12, y, gfx.getTextWidth(newstr) - 16);
                        this.curY += 2;
                        return "\n " + newstr + "\n " + GetText("eq.attacksome").replace(/\{0\}/g, newVal);
                    } else if(oldVal > 0) {
                        const newstr = GetText("eq.attacksome").replace(/\{0\}/g, oldVal);
                        gfx.drawStrikeThru(12, y, gfx.getTextWidth(newstr) - 16);
                        this.curY += 2;
                        return "\n " + newstr + "\n " + GetText("eq.attacksome").replace(/\{0\}/g, newVal);
                    } else {
                        this.curY++;
                        return "\n +" + GetText("eq.attacksome").replace(/\{0\}/g, newVal);
                    }
                }
            }
        }
    }
};
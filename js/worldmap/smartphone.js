function Text(msg) {
    this.id = msg;
    this.message = GetText(msg);
    this.read = false;
    this.active = false;
}
function Smartphone() {
    let texts = [ new Text("beckettText0"), new Text("beckettText1"), new Text("beckettText2"), new Text("beckettText3") ];
    let notifications = texts.length;
    let remainingTexts = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], pushedLimit = false;
    let datingApp = 0, datingAppMax = 7;
    let havePushedSister = false, sisterChance = 0;
    let lastX = 0, lastY = 0;
    this.GetPhoneData = function() {
        return {
            rt: remainingTexts, t: texts,
            hps: havePushedSister, sC: sisterChance,
            dA: datingApp, pL: pushedLimit
        };
    };
    this.SetPhoneData = function(t) { 
        remainingTexts = t.rt;
        texts = t.t; 
        notifications = 0;
        for(let i = 0; i < texts.length; i++) { if(!texts[i].read) { notifications++; } }
        havePushedSister = t.hps;
        sisterChance = t.sC;
        datingApp = t.dA;
        pushedLimit = t.pL;
    };
    this.Update = function() {
        if(worldmap.mapName !== "northcity") { return; }
        if(Math.round(worldmap.pos.x) % 4 !== 0 && Math.round(worldmap.pos.y) % 3 !== 0) { return; }
        if(Math.random() > 0.16) { return; }
        if(worldmap.pos.x === lastX || worldmap.pos.y === lastY) { return; }
        lastX = worldmap.pos.x; lastY = worldmap.pos.y;
        worldmap.smartphone.PushRandomText();
    };
    this.PushRandomText = function() {
        if(!havePushedSister) {
            if(Math.random() >= sisterChance) {
                sisterChance += 0.05;
            } else {
                havePushedSister = true;
                worldmap.smartphone.PushText("sistext0");
                setTimeout(function() { worldmap.smartphone.PushText("sistext1"); }, 1055);
                setTimeout(function() { worldmap.smartphone.PushText("sistext2"); }, 2203);
                setTimeout(function() { worldmap.smartphone.PushText("sistext3"); }, 3527);
                return;
            }
        }
        if(datingApp <= datingAppMax && Math.random() > 0.75) {
            worldmap.smartphone.PushText("sext" + (datingApp++));
        } else {
            const result = remainingTexts.splice(Math.floor(Math.random() * remainingTexts.length), 1)[0];
            if(result !== undefined) { worldmap.smartphone.PushText("misctext" + result); }
            else if(!pushedLimit && datingApp > datingAppMax) { worldmap.smartphone.PushText("misctext14"); pushedLimit = true; }
        }
    };
    this.PushText = function(msg) { notifications++; texts.push(new Text(msg)); };
    this.Read = function() {
        for(let i = 0; i < texts.length; i++) {
            if(texts[i].read || texts[i].active) { continue; }
            texts[i].active = true;
            texts[i].read = true;
            if(texts[i].id === "misctext1") { player.activeQuests["stonehenge"] = 1; }
            Sounds.PlaySound("readtext");
            notifications -= 1;
            return true;
        }
        return false;
    };
    this.Dismiss = function() {
        let count = 0;
        for(let i = 0; i < texts.length; i++) {
            if(texts[i].active) { count++; texts[i].active = false; }
        }
        if(count > 0) { Sounds.PlaySound("dismisstext"); }
        return count;
    };
    this.Draw = function() {
        if(worldmap.mapName !== "northcity") { return; }
        gfx.clearSome(["smartphone", "smartphoneText"]);
        gfx.drawTile("phoneico", 0, 192, "smartphone");
        if(notifications > 0) {
            const phoneNum = (notifications > 3) ? 4 : notifications;
            gfx.drawTile("phone" + phoneNum, 14, 194, "smartphone");
        }
        let yOffset = 0;
        for(let i = texts.length - 1; i >= 0; i--) {
            if(!texts[i].active) { continue; }
            yOffset += DrawText(texts[i].message, 11.5 - yOffset);
        }
    };
    const DrawText = function(text, y) { // maybe this should all be in rendering.js, but it's only used here, so...
        const actWidth = gfx.getTextWidth(text) + 32;
        const maxWidth = 128 * gfx.scale;
        let width = Math.min(actWidth, maxWidth);
        let xi = 1;
        const textInfo = gfx.getWrappedTextInfo(text, 124);
        let rows = textInfo.rows;
        if(rows === 1) {
            console.log("1row");
            gfx.drawWrappedText(text, 2, 10.5 + y * 16, 124, undefined, "smartphoneText");
            gfx.drawTile("selM", 0, 2 + y * 16, "smartphone");
            while(width > 128) {
                width -= 64;
                gfx.drawTile("selM", 16 * xi++, 2 + y * 16, "smartphone");
            }
            gfx.drawTile("selR", 16 * xi, 2 + y * 16, "smartphone");
            return 0.75;
        } else {
            if(rows === 2) { rows = 3; }
            if(rows >= 5) { rows = Math.ceil(textInfo.height / 9); }
            const topy = (y - rows + 1.5);
            gfx.drawWrappedText(text, 2, 12 + topy * 16, 124, undefined, "smartphoneText");
            gfx.drawTile("infoU", 0, 2 + topy * 16, "smartphone");
            gfx.drawTile("infoD", 0, 2 + (rows - 2 + topy) * 16, "smartphone");
            while(width > 128) {
                width -= 64;
                gfx.drawTile("infoU", 16 * xi, 2 + topy * 16, "smartphone");
                gfx.drawTile("infoD", 16 * xi++, 2 + (rows - 2 + topy) * 16, "smartphone");
            }
            gfx.drawTile("infoUR", 16 * xi, 2 + topy * 16, "smartphone");
            gfx.drawTile("infoDR", 16 * xi, 2 + (rows - 2 + topy) * 16, "smartphone");
            if(rows >= 4) {
                const drawRows = rows - 3;
                for(let i = 0; i < drawRows; i++) {
                    gfx.drawTile("infoR", 16 * xi, 2 + (topy + i + 1) * 16, "smartphone");
                }
                let ctx = gfx.ctx["smartphone"];
                ctx.fillStyle = player.IsMonochrome() ? "#E0F8D0" : "#B2B5FF";
                ctx.fillRect(0, 8 + (topy + 1) * 16 * gfx.scale, 112 * gfx.scale, drawRows * 16 * gfx.scale);
            }
            return rows - 0.5;
        }
    }
};
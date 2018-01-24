function Text(msg) {
    this.id = msg;
    this.message = GetText(msg);
    this.read = false;
    this.active = false;
}
function Smartphone() {
    var texts = [ new Text("beckettText0"), new Text("beckettText1"), new Text("beckettText2"), new Text("beckettText3") ];
    var notifications = texts.length;
    var remainingTexts = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], pushedLimit = false;
    var datingApp = 0, datingAppMax = 7;
    var havePushedSister = false, sisterChance = 0;
    var lastX = 0, lastY = 0;
    this.Update = function() {
        if(worldmap.mapName !== "northcity") { return; }
        if(worldmap.pos.x % 4 !== 0 && worldmap.pos.y % 3 !== 0) { return; }
        if(Math.random() > 0.16) { return; }
        if(worldmap.pos.x === lastX || worldmap.pos.y === lastY) { return; }
        lastX = worldmap.pos.x; lastY = worldmap.pos.y;
        worldmap.smartphone.PushRandomText();
    };
    this.PushRandomText = function() {
        if(!havePushedSister) {
            var pushSisterTexts = (Math.random() < sisterChance);
            if(!pushSisterTexts) {
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
            var result = remainingTexts.splice(Math.floor(Math.random() * remainingTexts.length), 1)[0];
            if(result !== undefined) { worldmap.smartphone.PushText("misctext" + result); }
            else if(!pushedLimit && datingApp > datingAppMax) { worldmap.smartphone.PushText("misctext14"); pushedLimit = true; }
        }
    };
    this.PushText = function(msg) { notifications++; texts.push(new Text(msg)); };
    this.Read = function() {
        for(var i = 0; i < texts.length; i++) {
            if(texts[i].read || texts[i].active) { continue; }
            texts[i].active = true;
            texts[i].read = true;
            if(texts[i].id === "misctext1") { player.activeQuests["stonehenge"] = 1; }
            notifications -= 1;
            return true;
        }
        return false;
    };
    this.Dismiss = function() {
        var count = 0;
        for(var i = 0; i < texts.length; i++) {
            if(texts[i].active) { count++; texts[i].active = false; }
        }
        return count;
    };
    this.Draw = function() {
        if(worldmap.mapName !== "northcity") { return; }
        gfx.clearSome(["smartphone", "smartphoneText"]);
        gfx.drawSprite("smartphone", 1, 0, 0, 128, "smartphone", true);
        if(notifications > 0) {
            var sx = 2, sy = 2;
            switch(notifications) {
                case 1: sx = 2; sy = 2; break;
                case 2: sx = 3; sy = 2; break;
                case 3: sx = 2; sy = 3; break;
                default: sx = 3; sy = 3; break;
            }
            gfx.drawSprite("smartphone", sx, sy, 14, 130, "smartphone");
        }
        var yOffset = 0;
        for(var i = texts.length - 1; i >= 0; i--) {
            if(!texts[i].active) { continue; }
            yOffset += DrawText(texts[i].message, 7.5 - yOffset);
        }
    };
    var DrawText = function(text, y) { // maybe this should all be in rendering.js, but it's only used here, so...
        var actWidth = gfx.getTextWidth(text) + 32;
        var maxWidth = 128 * gfx.scale;
        var width = Math.min(actWidth, maxWidth);
        var xi = 1;
        var textInfo = gfx.getWrappedTextInfo(text, 124);
        var rows = textInfo.rows;
        if(rows === 1) {
            gfx.drawWrappedText(text, 2, 10.5 + y * 16, 124, undefined, "smartphoneText");
            gfx.drawSprite("sheet", 7, 11, 0, 2 + y * 16, "smartphone");
            while(width > 128) {
                width -= 64;
                gfx.drawSprite("sheet", 7, 11, 16 * xi++, 2 + y * 16, "smartphone");
            }
            gfx.drawSprite("sheet", 8, 11, 16 * xi, 2 + y * 16, "smartphone");
            return 0.75;
        } else {
            if(rows === 2) { rows = 3; }
            if(rows >= 5) { rows = Math.ceil(textInfo.height / 9); }
            var topy = (y - rows + 1.5);
            gfx.drawWrappedText(text, 2, 12 + topy * 16, 124, undefined, "smartphoneText");
            gfx.drawSprite("sheet", 15, 11, 0, 2 + topy * 16, "smartphone");
            gfx.drawSprite("sheet", 14, 11, 0, 2 + (rows - 2 + topy) * 16, "smartphone");
            while(width > 128) {
                width -= 64;
                gfx.drawSprite("sheet", 15, 11, 16 * xi, 2 + topy * 16, "smartphone");
                gfx.drawSprite("sheet", 14, 11, 16 * xi++, 2 + (rows - 2 + topy) * 16, "smartphone");
            }
            gfx.drawSprite("sheet", 24, 17, 16 * xi, 2 + topy * 16, "smartphone");
            gfx.drawSprite("sheet", 26, 17, 16 * xi, 2 + (rows - 2 + topy) * 16, "smartphone");
            if(rows >= 4) {
                var drawRows = rows - 3;
                for(var i = 0; i < drawRows; i++) {
                    gfx.drawSprite("sheet", 25, 17, 16 * xi, 2 + (topy + i + 1) * 16, "smartphone");
                }
                var ctx = gfx.ctx["smartphone"];
                ctx.fillStyle = "#8B8CDE";
                ctx.fillRect(0, 8 + (topy + 1) * 16 * gfx.scale, 112 * gfx.scale, drawRows * 16 * gfx.scale);
            }
            return rows - 0.5;
        }
    }
};
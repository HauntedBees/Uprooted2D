var gfx = {
    canvas: [],  ctx: [],
    canvasHeight: 0, canvasWidth: 0,
    tileWidth: 0, tileHeight: 0, scale: 4,
    spritesheets: [],
    loadSpriteSheets: function(paths, callback) {
        count = 0;
        paths.forEach(function(path) {
            var f = function(path, len) {
                var img = new Image();
                img.onload = function() {
                    //var splitPath = path.split("/");
                    //var name = splitPath[splitPath.length - 1];
                    //gfx.spritesheets[name] = this;
                    gfx.spritesheets[path] = this;
                    count += 1;
                    if(count == len) { callback(); }
                };
                img.src = "img/" + path + ".png";
            };
            f(path, paths.length);
        });
    },
    GetFont: function() { return player.options.font === 1 ? "OpenDyslexic" : "PressStart2P" },

    clearLayer: function(key) { gfx.ctx[key].clearRect(0, 0, gfx.canvasWidth, gfx.canvasWidth); },
    clearSome: function(keys) { for(var i = 0; i < keys.length; i++) { gfx.clearLayer(keys[i]); } },
    clearAll: function(includingTutorial) {
        for(var key in gfx.ctx) {
            if(key === "tutorial" && !includingTutorial) { continue; } 
            gfx.clearLayer(key);
        }
    },
    getSaveFileImage: function() {
        var mapImg = gfx.spritesheets["maps/" + worldmap.mapName];
        var offset = {
            x: Math.min(collisions[worldmap.mapName][0].length - gfx.tileWidth, Math.max(worldmap.pos.x - (gfx.tileWidth / 2), 0)),
            y: Math.min(collisions[worldmap.mapName].length - gfx.tileHeight, Math.max(worldmap.pos.x - (gfx.tileHeight / 2), 0))
        };
        offset.x = worldmap.pos.x - offset.x + 13;
        offset.y = worldmap.pos.y - offset.y + 10;
        var ctx = gfx.ctx["savegen"],  w = ctx.canvas.width, h = ctx.canvas.height;
        ctx.clearRect(0, 0, w, h);
        var layersToDraw = ["background", "characters", "foreground"];
        for(var i = 0; i < layersToDraw.length; i++) {
            ctx.drawImage(gfx.canvas[layersToDraw[i]], offset.x * 16, offset.y * 16, w * 2, h * 2, 0, 0, w, h);
        }
        try { return ctx.canvas.toDataURL("image/png"); } catch(e) {  return null; } // toDataURL fails when running locally
    },
    drawSaveFileImage: function(encodedImg) {
        var img = new Image();
        img.src = encodedImg;
        img.onload = function() { gfx.ctx["menutext"].drawImage(this, 700, 14, 192, 128); };
    },
    drawTransitionImage: function(spritename, x, y, mult) {
        var data = spriteData.names[spritename];
        var sheet = gfx.spritesheets["sheet"];
        var size = 16;
        var delta = size * mult * 0.5;
        gfx.drawImage(gfx.ctx["tutorial"], sheet, data[0] * size, data[1] * size, size, size, x * size - delta, y * size - delta, size * mult, size * mult);
        //gfx.drawSprite("sheet", data[0], data[1], x * 16, y * 16, "tutorial" data.length ,== 3);
    },
    drawTileToGrid: function(spritename, x, y, layer) {
        var data = spriteData.names[spritename];
        gfx.drawSprite("sheet", data[0], data[1], x * 16, y * 16, layer, data.length == 3);
    },
    drawSprite: function(sheetpath, sx, sy, x, y, layer, big) {
        var sheet = gfx.spritesheets[sheetpath];
        var size = big ? 32 : 16;
        gfx.drawImage(gfx.ctx[layer], sheet, sx * size, sy * size, size, size, x, y, size, size);
    },
    drawBigCharacter: function(sx, sy, x, y) {
        gfx.drawImage(gfx.ctx["characters"], gfx.spritesheets["charsheetbig"], sx * 32, sy * 40, 32, 40, x * 16 - 8, y * 16 - 10, 32, 40);
    },
    drawWidePlayer: function(sx, sy, x, y, layer) {
        layer = layer || "characters";
        gfx.drawImage(gfx.ctx[layer], gfx.spritesheets["playersheet"], sx * 16, sy * 20, 32, 20, x * 16 - 8, y * 16 - 4, 32, 20);
    },
    drawPlayer: function(sx, sy, x, y, layer) {
        layer = layer || "characters";
        gfx.drawImage(gfx.ctx[layer], gfx.spritesheets["playersheet"], sx * 16, sy * 20, 16, 20, x * 16, y * 16 - 4, 16, 20);
    },
    drawCharacter: function(sx, sy, sheet, size, x, y, layer) {
        layer = layer || "characters";
        var srcX, srcY, w, h, dy;
        switch(size) {
            case "sm":
                w = 16; h = 20; dy = 4;
                srcX = sx * 24 + 4;
                srcY = sy * 30 + 10;
                break;
            case "md":
                w = 24; h = 30; dy = 14;
                srcX = sx * 24;
                srcY = sy * 30;
                break;
            case "lg":
                w = 32; h = 40; dy = 8;
                srcX = sx * 32;
                srcY = sy * 40;
                break;
        }
        gfx.drawImage(gfx.ctx[layer], gfx.spritesheets[sheet], srcX, srcY, w, h, x * 16, y * 16 - dy, w, h);
    },
    drawDitheredCharacter: function(sx, sy, sheet, size, x, y, d, layer) {
        if(d === 0) { return gfx.drawCharacter(sx, sy, sheet, size, x, y, layer); }
        var ctx = gfx.ctx[(layer || "characters")];
        var sheet = gfx.spritesheets[sheet];
        if(size === "sm") {
            var ditherAmounts = [d < 3, d < 5, d < 2, d < 4, d < 3, d < 6, false, d < 4, d < 3, d < 5, d < 2, d < 4, d < 3, d < 6, false, d < 4];
            for(var i = 0; i < 16; i++) {
                if(!ditherAmounts[i]) { continue; }
                gfx.drawImage(ctx, sheet, sx * 24 + 4 + i, sy * 30 + 10, 1, 20, x * 16 + i, y * 16 - 4, 1, 20);
            }
        } else if(size === "md") {
            var ditherAmounts = [d < 3, d < 5, d < 2, d < 4, d < 3, d < 6, false, d < 4, d < 3, d < 5, d < 2, d < 4, d < 3, d < 6, false, d < 4, d < 3, d < 5, d < 2, d < 4, d < 3, d < 6, false, d < 4];
            for(var i = 0; i < 24; i++) {
                if(!ditherAmounts[i]) { continue; }
                gfx.drawImage(ctx, sheet, sx * 24 + i, sy * 30, 1, 30, x * 16 + i, y * 16 - 14, 1, 30);
            }
        } else if(size === "lg") {
            var ditherAmounts = [d < 3, d < 5, d < 2, d < 4, d < 3, d < 6, false, d < 4, d < 3, d < 5, d < 2, d < 4, d < 3, d < 6, false, d < 4];
            for(var i = 0; i < 32; i++) {
                if(!ditherAmounts[i % 16]) { continue; }
                gfx.drawImage(ctx, sheet, sx * 32 + i, sy * 40, 1, 40, x * 16 - 8 + i, y * 16 - 10, 1, 40);
            }
        }
    },
    drawAnimCharacter: function(sx, sy, pos, offset, sheet, big, other) {
        sheet = sheet || "mapchar";
        var w = (big ? 32 : 16), h = (big ? 40 : 20);
        if(other !== undefined && other.forceWide) { w = 32; }
        gfx.drawImage(gfx.ctx["characters"], gfx.spritesheets[sheet], sx, sy, w, h, (pos.x - offset.x) * 16, (pos.y - offset.y) * 16 - (big ? 8 : 4), w, h);
    },
    drawCursor: function(x, y, w, h, cursorName) {
        cursorName = cursorName || "cursor";
        var layer = cursorName == "xcursor" ? "menucursorB" : "menucursorA";
        gfx.drawTileToGrid(cursorName + "0", x, y, layer);
        gfx.drawTileToGrid(cursorName + "1", x + w, y, layer);
        gfx.drawTileToGrid(cursorName + "2", x, y + h, layer);
        gfx.drawTileToGrid(cursorName + "3", x + w, y + h, layer);
    },
    drawInventoryItem: function(item, x, y, layer) {
        if(item[0][0] === "_") {
            gfx.drawTileToGrid(item[0], x, y, layer);
        } else if(item[0][0] === "!") {
            var info = GetEquipment(item[0]);
            gfx.drawTileToGrid(info.sprite, x, y, layer);
        } else {
            gfx.drawTileToGrid(item[0] + "seed", x, y, layer);
        }
        gfx.drawItemNumber(item[1], x, y, layer);
    },
    getTextRightAlignedX: function(text, size, x) { return x - gfx.getTextWidth(text, size); },
    getTextFractionX: function(text, size, fraction) { return gfx.getFractionX(gfx.getTextWidth(text, size), (fraction || 0.5)); },
    getFractionX: function(width, fraction) { return ((gfx.canvasWidth * fraction) - (width / 2)) / 4; },
    getTextWidth: function(t, size) {
        gfx.ctx["menutext"].font = (size || 22) + "px " + gfx.GetFont();
        return gfx.ctx["menutext"].measureText(t).width;
    },
    drawChoice: function(y, t, selected) {
        var tile = selected ? 9 : 7;
        for(var x = 0; x < 15; x++) { gfx.drawSprite("sheet", tile, 11, x * 16, y * 16 - 8, "menuA"); }
        if(selected) { gfx.drawCursor(0, y - 0.5, 14, -0.25); }
        gfx.drawText(t, 8, y * 16);
    },
    drawText: function(t, x, y, color, size) {
        gfx.ctx["menutext"].font = (size || 22) + "px " + gfx.GetFont();
        gfx.ctx["menutext"].fillStyle = (color || "#000000");
        gfx.ctx["menutext"].fillText(t, x * gfx.scale - gfx.scale, y * gfx.scale);
    },
    getTextLength: function(t, size) {
        gfx.ctx["menutext"].font = (size || 22) + "px " + gfx.GetFont();
        return gfx.ctx["menutext"].measureText(t).width;
    },
    drawBottomFullText: function(t, color) {  gfx.drawFullText(t, 121, color); },
    drawFullText: function(t, y, color) { gfx.drawWrappedText(t, 4, 11 + (y || 0), 235, color); },
    drawWrappedText: function(t, x, y, maxWidth, color, layer) {
        layer = layer || "menutext";
        maxWidth *= gfx.scale;
        var ctx = gfx.ctx[layer];
        ctx.fillStyle = (color || "#000000");
        ctx.font = "22px " + gfx.GetFont();
        var ts = t.split(" ");
        var row = ts[0];
        var dy = 0;
        for(var i = 1; i < ts.length; i++) {
            if(ctx.measureText(row + " " + ts[i]).width > maxWidth || row.indexOf("\n") >= 0) {
                ctx.fillText(row, x * gfx.scale, (y + dy) * gfx.scale);
                dy += 8;
                row = ts[i];
            } else {
                row += " " + ts[i];
            }
        }
        ctx.fillText(row, x * gfx.scale, (y + dy) * gfx.scale);
    },
    setAlpha: function(layer, value) { gfx.ctx[layer].globalAlpha = value; },
    drawFullbox: function(y) { gfx.drawInfobox(16, 2.5, y || 0); },
    drawInfobox: function(w, h, y, layer) {
        y = (y || 0) * 16;
        layer = layer || "menuA";
        var startx = gfx.tileWidth - w;
        h -= 1;
        gfx.drawSprite("sheet", 11, 11, startx * 16, y, layer);
        gfx.drawSprite("sheet", 13, 11, startx * 16, y + h * 16, layer);
        for(var x = startx + 1; x < gfx.tileWidth; x++) {
            gfx.drawSprite("sheet", 15, 11, x * 16, y, layer);
            gfx.drawSprite("sheet", 14, 11, x * 16, y + h * 16, layer);
        }
        for(var y2 = 1; y2 < h; y2++) {
            gfx.drawSprite("sheet", 12, 11, startx * 16, y + y2 * 16, layer);
        }
        var ctx = gfx.ctx[layer];
        ctx.fillStyle = "#8B8CDE";
        ctx.fillRect((startx + 1) * 16 * gfx.scale, (y + 16) * gfx.scale, (w - 1) * 16 * gfx.scale, (h - 1) * 16 * gfx.scale);
    },
    drawItemNumber: function(number, x, y, layer, top) {
        var digits = ("" + number).split("");
        var sheet = gfx.spritesheets["sheet"];
        var ctx = gfx.ctx[layer];
        var ix = x * 16 + 7 - (digits.length - 1) * 4;
        var ay = y * 16 + (top ? 0 : 9);
        if(number === "x") {
            gfx.drawImage(ctx, sheet, 5 * 16, 11 * 16, 5, 7, ix + 4, ay - 2, 5, 7);
            return;
        } else if(number === 0) {
            gfx.drawImage(ctx, sheet, 5 * 16, 11 * 16 + 7, 5, 7, ix + 4, ay, 5, 7);
            return;
        }
        if(!top) { gfx.drawImage(ctx, sheet, 5 * 16, 11 * 16, 5, 7, ix, ay, 5, 7); }
        for(var i = 0; i < digits.length; i++) {
            var d = gfx.numberDeltas[digits[i]];
            gfx.drawImage(ctx, sheet, 5 * 16 + d[0] * 5, 11 * 16 + d[1] * 7, 5, 7, ix + (i + 1) * 4, ay, 5, 7);
        }
    },
    drawMap: function(map, centerx, centery) {
        var mapImg = gfx.spritesheets["maps/" + map];
        var w = collisions[map][0].length;
        var h = collisions[map].length;
        var offset = {
            x: Math.min(w - gfx.tileWidth, Math.max(centerx - (gfx.tileWidth / 2), 0)),
            y: Math.min(h - gfx.tileHeight, Math.max(centery - (gfx.tileHeight / 2), 0))
        };
        gfx.drawImage(gfx.ctx["background"], mapImg, offset.x * 16, offset.y * 16, gfx.canvasWidth, gfx.canvasHeight, 0, 0, gfx.canvasWidth, gfx.canvasHeight);
        //var midy = (centery - offset.y) * 16 + 12.25;
        //gfx.drawImage(gfx.ctx["background"], gfx.spritesheets["maps/" + map + "_fg"], offset.x * 16, offset.y * 16, gfx.canvasWidth, midy, 0, 0, gfx.canvasWidth, midy);
        //gfx.drawImage(gfx.ctx["foreground"], gfx.spritesheets["maps/" + map + "_fg"], offset.x * 16, midy + offset.y * 16, gfx.canvasWidth, midy, 0, midy, gfx.canvasWidth, midy);
        return offset;
    },
    drawFullImage: function(store) {
        var storeImg = gfx.spritesheets[store];
        gfx.drawImage(gfx.ctx["background"], storeImg, 0, 0, gfx.canvasWidth, gfx.canvasHeight, 0, 0, gfx.canvasWidth, gfx.canvasHeight);
        return true;
    },
    drawImage: function(ctx, image, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH) {
        ctx.drawImage(image, srcX * gfx.scale, srcY * gfx.scale, srcW * gfx.scale, srcH * gfx.scale, dstX * gfx.scale, dstY * gfx.scale, dstW * gfx.scale, dstH * gfx.scale);  
    },
    numberDeltas: {
        "1": [1, 0],
        "2": [2, 0],
        "3": [3, 0],
        "4": [4, 0],
        "5": [5, 0],
        "6": [1, 1],
        "7": [2, 1],
        "8": [3, 1],
        "9": [4, 1],
        "0": [5, 1]
    }
};
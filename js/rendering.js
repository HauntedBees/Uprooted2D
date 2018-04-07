const gfx = {
    canvas: [],  ctx: [],
    canvasHeight: 0, canvasWidth: 0,
    tileWidth: 0, tileHeight: 0, scale: 4,
    spritesheets: [],
    loadSpriteSheets: function(paths, callback) {
        count = 0;
        paths.forEach(function(path) {
            const f = function(path, len) {
                const img = new Image();
                img.onload = function() {
                    gfx.spritesheets[path] = this;
                    count += 1;
                    if(count === len) { callback(); }
                };
                img.src = "img/" + path + ".png";
            };
            f(path, paths.length);
        });
    },
    GetFont: () => player.options.font === 1 ? "OpenDyslexic" : "PressStart2P",

    clearLayer: key => gfx.ctx[key].clearRect(0, 0, gfx.canvasWidth, gfx.canvasWidth),
    clearSome: keys => keys.forEach(e => gfx.clearLayer(e)),
    clearAll: function(includingTutorial) {
        for(const key in gfx.ctx) {
            if(key === "tutorial" && !includingTutorial) { continue; } 
            gfx.clearLayer(key);
        }
    },
    getSaveFileImage: function() {
        const ctx = gfx.ctx["savegen"], w = ctx.canvas.width, h = ctx.canvas.height;
        ctx.clearRect(0, 0, w, h);
        const layersToDraw = ["background", "characters", "foreground"];
        for(let i = 0; i < layersToDraw.length; i++) {
            ctx.drawImage(gfx.canvas[layersToDraw[i]], 0, 0, w * gfx.scale, h * gfx.scale, 0, 0, w * gfx.scale, h * gfx.scale);
        }
        try { return ctx.canvas.toDataURL("image/png"); } catch(e) { return null; } // toDataURL fails when running locally
    },
    drawSaveFileImage: function(encodedImg) {
        const img = new Image();
        img.src = encodedImg;
        const w = (gfx.tileWidth - 5) * 16 * gfx.scale;
        const h = (gfx.tileHeight - 6) * 16 * gfx.scale;
        img.onload = function() { gfx.ctx["menutext"].drawImage(this, 48, 48, w, h, 256, 288, w, h); };
        //img.onload = function() { gfx.ctx["menutext"].drawImage(this, 256, 288, 1024, 896); };
    },
    drawFOV: function(x, y, dir) {
        let topx, topy, width, height, startx, starty;
        switch(dir) {
            case 0: topx = 48; topy = 0; width = 48; height = 80; startx = x - 1; starty = y - 4.5; break;
            case 1: topx = 0; topy = 140; width = 80; height = 60; startx = x - 4.25; starty = y - 1.75; break;
            case 2: topx = 0; topy = 0; width = 48; height = 80; startx = x - 1; starty = y - 0.25; break;
            case 3: topx = 0; topy = 80; width = 80; height = 60; startx = x + 0.25; starty = y - 1.5; break;
        }
        gfx.drawImage(gfx.ctx["characters"], gfx.spritesheets["fov"], topx, topy, width, height, startx * 16, starty * 16, width, height);
    },
    drawFGCover: function(file, y, yoffset, w, offset) {
        const imgy = y - yoffset;
        if(imgy < 0) { return; }
        gfx.drawImage(gfx.ctx["characters"], gfx.spritesheets[file], 0, imgy * 16, w, 16, (-offset.x * 16), (y - offset.y) * 16, w, 16);
    },
    drawJumbo: function(file, x, y, w, h, ox, oy) {
        gfx.drawImage(gfx.ctx["background2"], gfx.spritesheets[file], x * 16 + (ox || 0), y * 16 + (oy || 0), w, h, 0, 0, w, h);
    },
    DrawTransitionImage: function(spritename, x, y, mult, blackEverythingElse) {
        const sheet = gfx.spritesheets["sheet"];
        const size = 16;
        const data = sprites[spritename];
        const startX = data[0] * 16 + data[0] * 2 + 1;
        const startY = data[1] * 16 + data[1] * 2 + 1;
        const delta = size * mult * 0.5;
        if(blackEverythingElse) {
            const ctx = gfx.ctx["tutorial"];
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, gfx.canvasWidth, gfx.canvasWidth);
            ctx.clearRect((x * size - delta) * gfx.scale + 4, (y * size - delta) * gfx.scale + 4, size * mult * gfx.scale - 4, size * mult * gfx.scale - 4);
        }
        gfx.drawImage(gfx.ctx["tutorial"], sheet, startX, startY, size, size, x * size - delta, y * size - delta, size * mult, size * mult);
    },
    DrawYMaskedSprite: function(spritename, x, y, layer, bottomY) {
        const data = sprites[spritename];
        const sx = data[0] * 16 + data[0] * 2 + 1;
        const sy = data[1] * 16 + data[1] * 2 + 1;
        const dy = bottomY - y;
        if(dy <= -1) { return; }
        const size = (y <= bottomY ? 16 : 16 - 16 * (y - bottomY));
        gfx.drawImage(gfx.ctx[layer], gfx.spritesheets["sheet"], sx, sy, 16, size, x * 16, y * 16, 16, size);
    },
    drawInfoText: function(text, x, y, selected, imgLayer, textLayer) {
        imgLayer = imgLayer || "menuOverBlack";
        textLayer = textLayer || "menutextOverBlack";
        let xi = 1;
        let width = gfx.getTextWidth(text) + 20;
        let xiimax = x + Math.ceil(width / 64);
        const prefix = selected ? "recSel" : "sel";
        while(xiimax > 14) { x -= 1; xiimax = x + Math.ceil(width / 64); }
        gfx.drawTile(prefix + "L", x * 16, 2 + y * 16, imgLayer);
        while(width > 128) {
            width -= 64;
            gfx.drawTile(prefix + "M", x * 16 + 16 * xi++, 2 + y * 16, imgLayer);
        }
        gfx.drawTile(prefix + "R", x * 16 + 16 * xi, 2 + y * 16, imgLayer);
        gfx.drawText(text, 7 + x * 16, 10.5 + y * 16, undefined, undefined, textLayer);
        return xi;
    },
    drawOption: function(text, y, selected) {
        let xi = 1;
        const tile = selected ? "Ssel" : "sel";
        gfx.drawTile(tile + "M", 0, 2 + y * 16, "menuA");
        let width = gfx.getTextWidth(text);
        while(width > 128) {
            width -= 64;
            gfx.drawTile(tile + "M", 16 * xi++, 2 + y * 16, "menuA");
        }
        gfx.drawTile(tile + "R", 16 * xi, 2 + y * 16, "menuA");
        gfx.drawText(text, 2, 10.5 + y * 16);
        return xi;
    },
    drawTileToGrid: (spritename, x, y, layer, isHalfTile) => gfx.drawTile(spritename, x * 16, y * 16, layer, isHalfTile),
    drawTile: function(spritename, x, y, layer, isHalfTile) {
        const data = sprites[spritename];
        try {
            const isBig = data.length == 3;
            gfx.DrawSprite(isBig ? "sheetBig" : "sheet", data[0], data[1], x, y, layer, isBig, isHalfTile);
        } catch(e) {
            console.log("couldn't find " + spritename);
        }
    },
    DrawSprite: function(sheetpath, sx, sy, x, y, layer, big, isHalfTile) {
        const sheet = gfx.spritesheets[sheetpath];
        const size = big ? 32 : 16;
        const startX = sx * size + sx * 2 + 1;
        const startY = sy * size + sy * 2 + 1;
        const xmult = (isHalfTile === true ? 0.5 : 1);
        gfx.drawImage(gfx.ctx[layer], sheet, startX, startY, size * xmult, size, x, y, size * xmult, size);
    },
    DrawCombatWhatsit: function(sheet, sx, sy, dims, layer, dx, dy) {
        const pad = sheet === "combatPlayer" ? 0 : 1;
        const pad2 = pad * 2;
        layer = layer || "characters"; dx = dx || 0; dy = dy || 0;
        const adjustedy = (dims.y + dy) * 16 - dims.h;
        gfx.drawImage(gfx.ctx[layer], gfx.spritesheets[sheet], sx * dims.w + pad, sy * dims.h + pad, dims.w - pad2, dims.h - pad2, (dims.x + dx) * 16 + pad, adjustedy + pad, dims.w - pad2, dims.h - pad2);
    },
    DrawDitheredWhatsit: function(sheet, sx, sy, dims, layer, d, size, gelf) {
        layer = layer || "characters";
        const sw = dims.dw || dims.w;
        const adjustedy = dims.y * 16 - dims.h;
        const ctx = gfx.ctx[layer], img = gfx.spritesheets[sheet];
        let ditherAmounts = [], imax = 32, mod = 32;
        switch(size) {
            case "sm":
                imax = 16;
                ditherAmounts = [d < 3, d < 5, d < 2, d < 4, d < 3, d < 6, false, d < 4, d < 3, d < 5, d < 2, d < 4, d < 3, d < 6, false, d < 4];
                break;
            case "md":
                imax = 24;
                ditherAmounts = [d < 3, d < 5, d < 2, d < 4, d < 3, d < 6, false, d < 4, d < 3, d < 5, d < 2, d < 4, d < 3, d < 6, false, d < 4, d < 3, d < 5, d < 2, d < 4, d < 3, d < 6, false, d < 4];
                break;
            case "lg":
                imax = 32; mod = 16;
                ditherAmounts = [d < 3, d < 5, d < 2, d < 4, d < 3, d < 6, false, d < 4, d < 3, d < 5, d < 2, d < 4, d < 3, d < 6, false, d < 4];
                break;
            case "xl":
                imax = 96; mod = 16;
                ditherAmounts = [d < 3, d < 5, d < 2, d < 4, d < 3, d < 6, false, d < 4, d < 3, d < 5, d < 2, d < 4, d < 3, d < 6, false, d < 4];
                break;
        }
        for(let i = 0; i < imax; i++) {
            if(!ditherAmounts[i % mod]) { continue; }
            gfx.drawImage(ctx, img, sx * sw + i, sy * dims.h, 1, dims.h, dims.x * 16 + i, adjustedy, 1, dims.h);
        }
    },
    DrawMapCharacter: function(sx, sy, pos, offset, sheet, big, layer, other) {
        layer = layer || "characters";
        let w = (big ? 34 : 18), h = (big ? 42 : 22), dy = (big ? 8 : 4);
        if(other !== undefined && other.bigBoy === true) { w = 22; h = 27; dy = 8; }
        let leftx = sx * w, topy = sy * h;
        if(game.glitch) { w += game.glitch.offX; h += game.glitch.offY; leftx += game.glitch.dx; topy += game.glitch.dy; }
        if(other !== undefined) {
            if(other.slightlyWider) {
                gfx.drawImage(gfx.ctx[layer], gfx.spritesheets[sheet], leftx + 1, topy + 1, w + 10, h - 2, (pos.x - offset.x) * 16, (pos.y - offset.y) * 16 - dy, w + 10, h - 2);
                return;
            }
        }
        gfx.drawImage(gfx.ctx[layer], gfx.spritesheets[sheet], leftx + 1, topy + 1, w - 2, h - 2, (pos.x - offset.x) * 16, (pos.y - offset.y) * 16 - dy, w - 2, h - 2);
    },
    DrawCursor: function(x, y, w, h, cursorName, frame, layer) {
        cursorName = cursorName || "cursor";
        gfx.drawTileToGrid(cursorName + frame + "." + "0", x, y, layer);
        gfx.drawTileToGrid(cursorName + frame + "." + "1", x + w, y, layer);
        gfx.drawTileToGrid(cursorName + frame + "." + "2", x, y + h, layer);
        gfx.drawTileToGrid(cursorName + frame + "." + "3", x + w, y + h, layer);
    },
    DrawXCursor: function(x, y, w, h) {
        const layer = "menucursorB";
        gfx.drawTileToGrid("xcursor0.0", x, y, layer);
        gfx.drawTileToGrid("xcursor0.1", x + w, y, layer);
        gfx.drawTileToGrid("xcursor0.2", x, y + h, layer);
        gfx.drawTileToGrid("xcursor0.3", x + w, y + h, layer);
    },
    drawInventoryItem: function(itemInfo, x, y, layer) {
        const item = itemInfo[0];
        let spriteName = itemInfo[0];
        if(item[0] !== "_" && item[0] !== "!") {
            const crop = GetCrop(item);
            if(crop.showSeed) { spriteName += "seed"; }
        }
        gfx.drawTileToGrid(spriteName, x, y, layer);
        gfx.drawItemNumber(itemInfo[1], x, y, layer);
    },
    getTextRightAlignedX: (text, size, x) => x - gfx.getTextWidth(text, size),
    getTextFractionX: (text, size, fraction) => gfx.getFractionX(gfx.getTextWidth(text, size), (fraction || 0.5)),
    getFractionX: (width, fraction) => ((gfx.canvasWidth * fraction) - (width / 2)) / 4,
    getTextWidth: function(t, size) {
        gfx.ctx["menutext"].font = gfx.GetFontSize(size) + gfx.GetFont();
        return gfx.ctx["menutext"].measureText(t).width;
    },
    drawStrikeThru: function(x, y, w) { if(player.options.font === 1) { y += 5; } gfx.ctx["menutext"].fillStyle = "#000000"; gfx.ctx["menutext"].fillRect(x, y, w, 5); },
    drawChoice: function(y, t, selected) {
        const tile = selected ? "SselM" : "selM";
        for(let x = 0; x < 16; x++) { gfx.drawTile(tile, x * 16, y * 16 - 8, "menuA"); }
        gfx.drawText(t, 8, y * 16);
    },
    GetFontSize: function(size, justNum) {
        size = size || 22;
        if(gfx.GetFont() === "OpenDyslexic") { size += 2; }
        return justNum === true ? size : size + "px ";
    },
    TileBackground: function(sprite) {
        for(let x = 0; x < gfx.tileWidth; x++) {
            for(let y = 0; y < gfx.tileHeight; y++) {
                gfx.drawTileToGrid(sprite, x, y, "background");
            }
        }
    },

    // Text
    drawText: function(t, x, y, color, size, layer) {
        layer = layer || "menutext";
        gfx.ctx[layer].font = gfx.GetFontSize(size) + gfx.GetFont();
        gfx.ctx[layer].fillStyle = (color || "#000000");
        gfx.ctx[layer].fillText(t, x * gfx.scale - gfx.scale, y * gfx.scale);
    },
    getTextLength: function(t, size) {
        gfx.ctx["menutext"].font = gfx.GetFontSize(size) + gfx.GetFont();
        return gfx.ctx["menutext"].measureText(t).width;
    },
    drawFullText: function(t, y, color, overBlack) { gfx.drawWrappedText(t, 4, 11 + (y || 0), 250, color, (overBlack ? "menutextOverBlack" : undefined)); },
    getWrappedTextInfo: function(t, maxWidth) {
        maxWidth *= gfx.scale;
        const ts = t.split(" ");
        let row = ts[0], numRows = 1, dy = 0;
        const ctx = gfx.ctx["menutext"];
        for(let i = 1; i < ts.length; i++) {
            if(ctx.measureText(row + " " + ts[i]).width > maxWidth || row.indexOf("\n") >= 0) {
                row = ts[i];
                dy += 8;
                numRows++;
            } else {
                row += " " + ts[i];
            }
        }
        return { rows: numRows, height: dy };
    },
    drawWrappedText: function(t, x, y, maxWidth, color, layer, size) {
        layer = layer || "menutext";
        maxWidth *= gfx.scale;
        const ctx = gfx.ctx[layer];
        ctx.fillStyle = (color || "#000000");
        size = gfx.GetFontSize(size, true);
        ctx.font = size + "px " + gfx.GetFont();
        const ddy = size / 2.75, ts = t.split(" ");
        let row = ts[0], dy = 0;
        for(let i = 1; i < ts.length; i++) {
            const textInfo = ctx.measureText(row + " " + ts[i]);
            if(textInfo.width > maxWidth || row.indexOf("\n") >= 0) {
                ctx.fillText(row, x * gfx.scale, (y + dy) * gfx.scale);
                dy += ddy;
                row = ts[i];
            } else {
                row += " " + ts[i];
            }
        }
        ctx.fillText(row, x * gfx.scale, (y + dy) * gfx.scale);
    },
    drawTextBox: (y, overBlack) => gfx.drawInfobox(17, 3, y || 0, (overBlack ? "menuOverBlack" : undefined)),
    drawFullbox: (y, overBlack) => gfx.drawInfobox(17, 4.5, y || 0, (overBlack ? "menuOverBlack" : undefined)),
    drawMinibox: function(x, y, w, h, layer) {
        layer = layer || "menuA";
        gfx.drawTile("infoUL", x * 16, y * 16, layer);
        gfx.drawTile("infoDL", x * 16, (y + h) * 16, layer);
        gfx.drawTile("infoUR", (x + w) * 16, y * 16, layer);
        gfx.drawTile("infoDR", (x + w) * 16, (y + h) * 16, layer);
        for(let x2 = x + 1; x2 < x + w; x2++) {
            gfx.drawTile("infoU", x2 * 16, y * 16, layer);
            gfx.drawTile("infoD", x2 * 16, (y + h) * 16, layer);
        }
        for(let y2 = y + 1; y2 < y + h; y2++) {
            gfx.drawTile("infoL", x * 16, y2 * 16, layer);
            gfx.drawTile("infoR", (x + w) * 16, y2 * 16, layer);
        }
        const ctx = gfx.ctx[layer];
        ctx.fillStyle = "#8B8CDE";
        ctx.fillRect((x + 1) * 16 * gfx.scale, (y + 1) * 16 * gfx.scale, (w - 1) * 16 * gfx.scale, (h - 1) * 16 * gfx.scale);
    },
    drawInfobox: function(w, h, y, layer) {
        y = (y || 0) * 16;
        layer = layer || "menuA";
        const startx = gfx.tileWidth - w;
        h -= 1;
        gfx.drawTile("infoUL", startx * 16, y, layer);
        gfx.drawTile("infoDL", startx * 16, y + h * 16, layer);
        for(let x = startx + 1; x < gfx.tileWidth; x++) {
            gfx.drawTile("infoU", x * 16, y, layer);
            gfx.drawTile("infoD", x * 16, y + h * 16, layer);
        }
        for(let y2 = 1; y2 < h; y2++) {
            gfx.drawTile("infoL", startx * 16, y + y2 * 16, layer);
        }
        const ctx = gfx.ctx[layer];
        ctx.fillStyle = "#8B8CDE";
        ctx.fillRect((startx + 1) * 16 * gfx.scale, (y + 16) * gfx.scale, (w - 1) * 16 * gfx.scale, (h - 1) * 16 * gfx.scale);
    },
    drawBigNumber: function(number, x, y, layer, white) {
        if(number > 100 || number < 0) { return; }
        const digits = ("" + number).split("");
        const ctx = gfx.ctx[layer];
        for(let i = 0; i < digits.length; i++) {
            gfx.drawTileToGrid((white === true ? "bigNumW" : "bigNum") + digits[i], x + 0.5 * i, y, layer, true);
        }
    },
    drawItemNumber: function(number, x, y, layer, top) {
        const digits = ("" + number).split("");
        const sheet = gfx.spritesheets["sheet"];
        const startCoords = sprites["numStart"];
        const startX = startCoords[0] * 16 + startCoords[0] * 2 + 1;
        const startY = startCoords[1] * 16 + startCoords[1] * 2 + 1;
        const ctx = gfx.ctx[layer];
        const ix = x * 16 + 7 - (digits.length - 1) * 4;
        const ay = y * 16 + (top ? 0 : 9);
        if(number === "x") {
            gfx.drawImage(ctx, sheet, startX, startY, 5, 7, ix + 4, ay - 2, 5, 7);
            return;
        } else if(number === 0) {
            gfx.drawImage(ctx, sheet, startX, startY + 9, 5, 7, ix + 4, ay - 2, 5, 7);
            return;
        }
        if(!top) { gfx.drawImage(ctx, sheet, startX, startY, 5, 7, ix, ay, 5, 7); }
        for(let i = 0; i < digits.length; i++) {
            const d = gfx.numberDeltas[digits[i]];
            gfx.drawImage(ctx, sheet, startX + d[0] * 6, startY + d[1] * 9, 5, 7, ix + (i + 1) * 4, ay, 5, 7);
        }
    },
    // Bridge
    DrawBlack: function(x, w) {
        const ctx = gfx.ctx["tutorial"];
        ctx.fillStyle = "#000000";
        ctx.fillRect(x * gfx.scale, 0, w * gfx.scale, game.tileh * 16 * gfx.scale);
    },
    // HQ3 - The Monster
    DrawChungus: function(x, y, w, h, offset) {
        const ctx = gfx.ctx["foreground"];
        ctx.fillStyle = "#64A5FF";
        ctx.fillRect((x - offset.x * 16) * gfx.scale, (y - offset.y * 16) * gfx.scale, w * gfx.scale, h * gfx.scale);
    },
    DrawHelp: () => gfx.drawImage(gfx.ctx["foreground"], gfx.spritesheets["ayudame"], 0, 0, 34, 24, 220, 195, 34, 24),
    DrawHorRor: function(intensity) {
        if(intensity < 0) { intensity = 0; }
        gfx.drawImage(gfx.ctx["foreground"], gfx.spritesheets["horRorTop"], 0, 0, 1024, 252, 0, 0 - intensity, 1024, 252);
        gfx.drawImage(gfx.ctx["foreground"], gfx.spritesheets["horRorBottom"], 0, 0, 1024, 252, 0, 160 + intensity, 1024, 252);
    },
    // Full Drawsies
    drawMap: function(map, centerx, centery) {
        const mapImg = gfx.spritesheets["maps/" + map];
        const w = collisions[map][0].length;
        const h = collisions[map].length;
        const offset = {
            x: Math.min(w - gfx.tileWidth, Math.max(centerx - (gfx.tileWidth / 2), 0)),
            y: Math.min(h - gfx.tileHeight, Math.max(centery - (gfx.tileHeight / 2), 0))
        };
        gfx.drawImage(gfx.ctx["background"], mapImg, offset.x * 16, offset.y * 16, gfx.canvasWidth, gfx.canvasHeight, 0, 0, gfx.canvasWidth, gfx.canvasHeight);
        return offset;
    },
    drawFullImage: function(store, layer) {
        layer = layer || "background";
        const storeImg = gfx.spritesheets[store];
        gfx.drawImage(gfx.ctx[layer], storeImg, 0, 0, gfx.canvasWidth, gfx.canvasHeight, 0, 0, gfx.canvasWidth, gfx.canvasHeight);
        return true;
    },
    drawImage: function(ctx, image, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH) {
        ctx.drawImage(image, srcX * gfx.scale, srcY * gfx.scale, srcW * gfx.scale, srcH * gfx.scale, dstX * gfx.scale, dstY * gfx.scale, dstW * gfx.scale, dstH * gfx.scale);  
    },
    numberDeltas: { "1": [1, 0], "2": [2, 0], "3": [3, 0], "4": [4, 0], "5": [5, 0], "6": [1, 1], "7": [2, 1], "8": [3, 1], "9": [4, 1], "0": [5, 1] }
};
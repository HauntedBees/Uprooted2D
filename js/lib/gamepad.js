class VirtCanvasInfo {
    constructor(name, parent) {
        this.canvas = document.getElementById(name);
        this.rect = this.canvas.getBoundingClientRect();
        this.context = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.mx = this.width / this.rect.width;
        this.my = this.height / this.rect.height;
        this.canvas.addEventListener("touchstart", e => parent.AddTouch(e));
        this.canvas.addEventListener("touchmove", e => parent.MoveTouch(e));
        this.canvas.addEventListener("touchend", e => parent.RemoveTouch(e));
        this.canvas.addEventListener("touchcancel", e => parent.RemoveTouch(e));
        /*this.canvas.addEventListener("click", e => parent.OnClick(e));
        this.canvas.addEventListener("mousedown", e => parent.MouseDown(e));
        this.canvas.addEventListener("mouseup", e => parent.MouseUp(e));
        this.canvas.addEventListener("mousemove", e => parent.MouseMove(e));*/
    }
    GetRealPos(e) { return { clientX: this.mx * (e.clientX - this.rect.left), clientY: this.my * (e.clientY - this.rect.top) }; }
    Clear() { this.context.clearRect(0, 0, this.width, this.height); }
}
class VirtButtonPosition {
    constructor(name, canvas, x, y, width, height) {
        this.name = name;
        this.canvasName = canvas;
        this.x = x;
        this.y = y;
        this.w = width || 1;
        this.h = height || 1;
    }
}
class VirtButton {
    constructor(name, type, imgPath, options) {
        options = options || {};
        this.name = name;
        this.type = type;
        this.visible = true;
        const f = function(me, img) {
            const imgElem = new Image();
            imgElem.onload = function() { me.imgElem = this; };
            imgElem.src = img;
        };
        f(this, imgPath);
        this.opacity = (options.opacity === undefined ? 1 : options.opacity);
        if (type === "config") {
            this.command = (options.command === undefined ? "exit" : options.command);
            if(options.startInvisible) { this.visible = false; }
        } else if (type === "button") {
            // sure
        } else if (type === "joystick") {
            this.numDirections = (options.numDirections === undefined ? 4 : options.numDirections);
            this.deadZone = (options.deadZone === undefined ? 0.25 : options.deadZone);
            this.magnitude = 0;
            this.angle = 0;
            this.maxDisplayMagnitude = 1;
            this.maxMagnitude = 1.5;
            if(options.top === undefined) { throw "Joysticks must have tops."; }
            const g = function(me, img) {
                const imgElem = new Image();
                imgElem.onload = function() { me.imgElemTop = this; };
                imgElem.src = img;
            };
            g(this, options.top);
        } else if (type === "dpad") {
            this.eightDirection = (options.eightDirection === undefined ? false : options.eightDirection);
            this.deadZone = (options.deadZone === undefined ? 0.25 : options.deadZone);
        } else { throw "Only valid types are button, joystick, and dpad."; }
    }
    Draw(ctx, pos, isSelected, isResize, resizeLR, resizeUD) {
        if(!this.visible) { return; }
        ctx.drawImage(this.imgElem, 0, 0, this.imgElem.width, this.imgElem.height, pos.x, pos.y, this.imgElem.width * pos.w, this.imgElem.height * pos.h);
        if(this.command) { return; }
        if(isSelected) {
            ctx.beginPath();
            ctx.lineWidth = 5;
            ctx.strokeStyle = "red";
            ctx.rect(pos.x, pos.y, this.imgElem.width * pos.w, this.imgElem.height * pos.h);
            ctx.stroke();
        }
        if(isResize) {
            ctx.drawImage(resizeLR, 0, 0, 128, 128, pos.x + this.imgElem.width * pos.w - 64, pos.y + (this.imgElem.height * pos.h * 0.5) - 64, 128, 128);
            ctx.drawImage(resizeUD, 0, 0, 128, 128, pos.x + (this.imgElem.width * pos.w * 0.5) - 64, pos.y + this.imgElem.height * pos.h - 64, 128, 128);
        }
        if(this.imgElemTop) {
            let x = (this.imgElemTop.width / 2) * Math.cos(this.angle) * this.magnitude / this.maxDisplayMagnitude;
            let y = (this.imgElemTop.width / 2) * Math.sin(this.angle) * this.magnitude / this.maxDisplayMagnitude;
            const cx = (this.imgElem.width / 2) - (this.imgElemTop.width / 2);
            const cy = (this.imgElem.height / 2) - (this.imgElemTop.height / 2);
            ctx.drawImage(this.imgElemTop, 0, 0, this.imgElemTop.width, this.imgElemTop.height, pos.x + cx + x, pos.y + cy + y, this.imgElemTop.width * pos.w, this.imgElemTop.height * pos.h);
        }
    }
}
class VirtPress {
    constructor(buttonName, type, addtl) {
        this.btn = buttonName;
        this.action = type;
        if(addtl !== undefined) {
            for(const name in addtl) {
                this[name] = addtl[name];
            }
        }
    }
}
class VirtGamepad {
    constructor(inputReceiver, canvasArray, buttonArray, buttonPositions, options) {
        options = options || {};
        if(buttonPositions.length !== buttonArray.length) { throw "Button Positions and Buttons must match."; }
        this.cs = {}; this.bs = {}; this.bps = {};
        this.input = inputReceiver;
        this.inEditMode = false;
        this.inResizeMode = false;
        this.resizeHoriz = true;
        this.selected = null;
        this.visible = true;
        this.touches = [];
        this.toAngle = 180 / Math.PI;
        this.primaryCanvas = null;
        const f = function(me, img, varName) {
            const imgElem = new Image();
            imgElem.onload = function() { me[varName] = this; };
            imgElem.src = img;
        };
        f(this, "vgp_img/resize_lr.png", "imgLR");
        f(this, "vgp_img/resize_ud.png", "imgUD");
        for(let i = 0; i < canvasArray.length; i++) {
            const canvName = canvasArray[i];
            this.cs[canvName] = new VirtCanvasInfo(canvName, this);
            if(i === 0) { this.primaryCanvas = this.cs[canvName]; }
        }
        if(this.primaryCanvas === null) { throw "AH FUCK!" }
        for(let i = 0; i < buttonArray.length; i++) {
            const button = buttonArray[i];
            this.bs[button.name] = button;
        }
        for(let i = 0; i < buttonPositions.length; i++) {
            const buttonPos = buttonPositions[i];
            this.bps[buttonPos.name] = buttonPos;
            if(this.bs[buttonPos.name] === undefined) {
                throw `Button Positions and Buttons must match: ${buttonPos.name} is in buttonPositions but not buttonArray.`;
            }
        }
        for(const btnName in this.bs) {
            if(this.bps[btnName] == undefined) {
                throw `Button Positions and Buttons must match: ${buttonPos.name} is in buttonArray but not buttonPositions.`;
            }
        }
    }
    Draw() {
        for(const cnvName in this.cs) {
            this.cs[cnvName].Clear();
            this.cs[cnvName].context.font="20px Georgia";
            this.cs[cnvName].context.strokeStyle = "black";
        }
        if(!this.visible) { return; }
        for(const btnName in this.bs) {
            const pos = this.bps[btnName];
            const ctx = this.cs[pos.canvasName].context;
            this.bs[btnName].Draw(ctx, pos, this.selected === btnName, this.inResizeMode, this.imgLR, this.imgUD);
        }
    }
    Show() { this.visible = true; this.Draw(); }
    Hide() { this.visible = false; this.Draw(); }
    Between(i, a, b) { return a <= i && i <= b; }
    Distance(x1, x2, y1, y2) { return Math.hypot(x2 - x1, y2 - y1); }
    GetPos(e) {
        const canvas = e.target;
        const rect = canvas.getBoundingClientRect();
        const mx = canvas.width / rect.width, my = canvas.height / rect.height;
        return { x: mx * (e.clientX - rect.left), y: my * (e.clientY - rect.top) };
    }
    GetButton(e) {
        const padding = 30;
        const clickedPos = this.GetPos(e);
        for(const name in this.bps) {
            const b = this.bs[name], bp = this.bps[name];
            if(!b.visible) { continue; }
            const bx = bp.x + b.imgElem.width * bp.w;
            const by = bp.y + b.imgElem.height * bp.h;
            if(this.Between(clickedPos.x, bp.x - padding, bx + padding) && this.Between(clickedPos.y, bp.y - padding, by + padding)) {
                return b;
            }
        }
        return null;
    }
    GetPositionInButton(e) {
        const padding = 30;
        const clickedPos = this.GetPos(e);
        for(const name in this.bps) {
            const b = this.bs[name], bp = this.bps[name];
            if(!b.visible) { continue; }
            const bx = bp.x + b.imgElem.width * bp.w;
            const by = bp.y + b.imgElem.height * bp.h;
            const bcx = bp.x + b.imgElem.width * bp.w / 2;
            const bcy = bp.y + b.imgElem.height * bp.h / 2;
            if(this.Between(clickedPos.x, bp.x - padding, bx + padding) && this.Between(clickedPos.y, bp.y - padding, by + padding)) {
                return { x: (clickedPos.x - bcx) / (b.imgElem.width * bp.w / 2), y: (clickedPos.y - bcy) / (b.imgElem.height * bp.h / 2) };
            }
        }
        return { x: 0, y: 0 };
    }
    AddTouch(e) {
        if(!this.visible) { return; }
        if(this.inEditMode && this.touches.length > 1) { return; } // only two touches when in edit mode
        for(let i = 0; i < e.changedTouches.length; i++) {
            const t = e.changedTouches[i];
            const et = this.primaryCanvas.GetRealPos(t);
            const btn = this.GetButton(t);
            if(btn === null) { continue; }
                const tid = t.identifier;
                if(this.touches.filter(e => e.id === tid).length > 0) { continue; } // this mapping already exists (probably shouldn't happen?)
                let startx = et.clientX, starty = et.clientY;
                if(!this.inEditMode && btn.type === "dpad") {
                    const bp = this.bps[btn.name];
                    startx = bp.x + btn.imgElem.width * bp.w * 0.5;
                    starty = bp.y + btn.imgElem.height * bp.h * 0.5;
                }
                this.touches.push({ id: tid, btn: btn.name, x: startx, y: starty, ix: startx, iy: starty });
            //}
            if(this.inEditMode) {
                if(this.touches.length === 0) { continue; }
                if(btn.command !== undefined) {
                    this.touches = [];
                    this.CommandButton(btn.command);
                } else if(this.inResizeMode) {
                    this.selected = btn.name;
                    const quadrantCheck = this.GetPositionInButton(t);
                    if(quadrantCheck.y < 0) {
                        this.resizeHoriz = (quadrantCheck.x > -0.66);
                    } else {
                        this.resizeHoriz = (quadrantCheck.x >= 0.5);
                    }
                } else {
                    this.selected = btn.name;
                }
                break;
            } else {
                this.input.ButtonPress(new VirtPress(btn.name, "PRESS"));
                if(btn.type === "dpad") {
                    this.MoveTouch(e);
                }
            }
        }
        this.Draw();
    }
    CommandButton(type) {
        if(!this.inEditMode) { return; }
        if(type === "resize") {
            if(this.inResizeMode) { return; } // this shouldn't happen
            this.inResizeMode = true;
            for(const name in this.bs) {
                const b = this.bs[name];
                if(b.command === undefined) { continue; }
                if(b.name === "opt_resize") { b.visible = false; }
                else if(b.name === "opt_move") { b.visible = true; }
            }
        } else if(type === "move") {
            if(!this.inResizeMode) { return; } // this shouldn't happen
            this.inResizeMode = false;
            for(const name in this.bs) {
                const b = this.bs[name];
                if(b.command === undefined) { continue; }
                if(b.name === "opt_resize") { b.visible = true; }
                else if(b.name === "opt_move") { b.visible = false; }
            }
        } else if(type === "default") {
            for(const name in this.bps) {
                const b = this.bps[name];
                switch(name) {
                    case "cancel": b.x = 830; b.y = 20; b.w = 1; b.h = 1; break;
                    case "pause": b.x = 420; b.y = 40; b.w = 1; b.h = 1; break;
                    case "confirm": b.x = 700; b.y = 180; b.w = 1; b.h = 1; break;
                    case "dpad": b.x = 25; b.y = 25; b.w = 1; b.h = 1; break;
                }
            }
        } else if(type === "save") {
            this.inEditMode = false;
            for(const name in this.bs) {
                const b = this.bs[name];
                if(b.command !== undefined) { b.visible = false; }
            }
        } else if(type === "exit") { // TODO: account for this
            this.inEditMode = false;
            for(const name in this.bs) {
                const b = this.bs[name];
                if(b.command !== undefined) { b.visible = false; }
            }
        }
        console.log("BY JUMMINT YOU JUST DONE PREST A BUTIN!");
    }
    Edit_Move(t, ct) {
        const tid = t.identifier;
        const existingPressIdx = this.touches.findIndex(e => e.id === tid);
        if(existingPressIdx < 0) { return; }
        const pInfo = this.touches[existingPressIdx];
        const dx = ct.clientX - pInfo.x, dy = ct.clientY - pInfo.y;
        this.bps[pInfo.btn].x += dx;
        this.bps[pInfo.btn].y += dy;
        pInfo.x += dx; pInfo.y += dy;
    }
    Edit_Resize(delta) {
        if(this.resizeHoriz) {
            this.bps[this.selected].w = Math.max(0.25, this.bps[this.selected].w + delta);
        } else {
            this.bps[this.selected].h = Math.max(0.25, this.bps[this.selected].h + delta);
        }
    }

    MoveTouch(e) {
        if(!this.visible) { return; }
        if(this.inEditMode) {
            const ct = this.primaryCanvas.GetRealPos(e.changedTouches[0]);
            if(this.inResizeMode) {
                if(this.touches.length !== 1) { return; }
                let t0x = this.touches[0].x, t0y = this.touches[0].y;
                if(this.resizeHoriz) {
                    this.Edit_Resize((ct.clientX - t0x) / 300);
                    this.touches[0].x = ct.clientX;
                } else {
                    this.Edit_Resize((ct.clientY - t0y) / 300);
                    this.touches[0].y = ct.clientY;
                }
            } else {
                this.Edit_Move(e.changedTouches[0], ct);
            }
        } else {
            for(let i = 0; i < e.changedTouches.length; i++) {
                const ct = this.primaryCanvas.GetRealPos(e.changedTouches[i]);
                const tid = e.changedTouches[i].identifier;
                if(this.touches.filter(e => e.id === tid).length != 1) { continue; } // it ain't even!
                const it = this.touches.filter(e => e.id === tid)[0];
                const bp = this.bps[it.btn], b = this.bs[it.btn];
                const dx = (ct.clientX - it.ix) / (b.imgElem.width * bp.w / 2), dy = (ct.clientY - it.iy)  / (b.imgElem.height * bp.h / 2);
                if(b.type === "dpad") {
                    let x = 0, y = 0;
                    if(dx >= b.deadZone) {
                        x = 1;
                        if(b.eightDirection) {
                            if(dy >= b.deadZone) { y = 1; }
                            else if(dy <= -b.deadZone) { y = -1; }
                        }
                    } else if(dx <= -b.deadZone) {
                        x = -1;
                        if(b.eightDirection) {
                            if(dy >= b.deadZone) { y = 1; }
                            else if(dy <= -b.deadZone) { y = -1; }
                        }
                    } else if(dy >= b.deadZone) { y = 1;
                    } else if(dy <= -b.deadZone) { y = -1; }
                    this.input.ButtonMove(new VirtPress(it.btn, "MOVE", { x: x, y: y }));
                } else if(b.type === "joystick") {
                    const distance = this.Distance(it.ix, ct.clientX, it.iy, ct.clientY);
                    const magnitude = Math.min(b.maxMagnitude, distance / (b.imgElem.width * bp.w / 2)); // TODO: this doesn't account for asymmetric analog sticks
                    const rawangle = Math.atan2(ct.clientY - it.iy, ct.clientX - it.ix) * this.toAngle;
                    const roundToAngle = 360 / b.numDirections;
                    const angle = Math.ceil(rawangle / roundToAngle) * roundToAngle;
                    b.magnitude = magnitude;
                    b.angle = angle / this.toAngle;
                    this.input.ButtonMove(new VirtPress(it.btn, "MOVE", { magnitude: magnitude, angle: angle }));
                }
            }
        }
        this.Draw();
    }
    RemoveTouch(e) {
        if(!this.visible) { return; }
        for(let i = 0; i < e.changedTouches.length; i++) {
            const tid = e.changedTouches[i].identifier;
            const tidx = this.touches.findIndex(e => e.id === tid);
            if(tidx < 0) { continue; }
            if(!this.inEditMode) {
                const btn = this.bs[this.touches[tidx].btn];
                if(btn !== undefined && btn.type === "joystick") {
                    btn.angle = 0;
                    btn.magnitude = 0;
                }
                this.input.ButtonRelease(new VirtPress(this.touches[tidx].btn, "RELEASE"));
            }
            this.touches.splice(tidx, 1);
        }
        if(this.inEditMode) { this.selected = ""; }
        this.Draw();
    }
    /*OnClick(e) {
        const btn = this.GetButton(e);
        console.log(btn);
    }
    MouseDown(e) {
        const btn = this.GetButton(e);
        if(this.inEditMode) {
            this.selected = btn.name;
            this.Draw();
        }
    }
    MouseUp(e) {
        if(this.inEditMode) {
            this.selected = null;
            this.Draw();
        }
    }
    MouseMove(e) {

    }*/
}
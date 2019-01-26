class Game {
    constructor() {
        this.canvas = document.getElementById("secondCanvas");
        this.context = this.canvas.getContext("2d");
        this.player = { x: 0, y: 0 };
        this.cursor = { x: 200, y: 0 };
        this.charging = false;
        this.chargetime = 0;
        this.pewpews = [];
        this.cursorInfo = { angle: 0, magnitude: 0 };
        this.isCursorMoving = false;
        this.playerInfo = { x: 0, y: 0 };
        this.isPlayerMoving = false;
        const f = function(me, img, varName) {
            const imgElem = new Image();
            imgElem.onload = function() { me[varName] = this; };
            imgElem.src = img;
        };
        f(this, "vgp_test_img/crosshair.png", "crosshair");
        f(this, "vgp_test_img/garf.png", "garf");
        f(this, "vgp_test_img/pew.png", "pew");
        const me = this;
        this.timer = setInterval(function() { me.Draw(me); }, 10);
        this.update = setInterval(function() { me.Update(me); }, 10);
        document.addEventListener('contextmenu', event => event.preventDefault());
    }
    Draw(me) {
        me.context.clearRect(0, 0, 1024, 896);
        for(let i = me.pewpews.length - 1; i >= 0; i--) {
            me.context.drawImage(me.pew, 0, 0, 100, 100, me.pewpews[i].x, me.pewpews[i].y, 80 + me.pewpews[i].power, 80 + me.pewpews[i].power);
            me.pewpews[i].y += 10;
            if(me.pewpews[i].y >= 900) {
                me.pewpews.splice(i, 1);
            }
        }
        me.context.drawImage(me.crosshair, 0, 0, 200, 200, me.cursor.x, me.cursor.y, 200, 200);
        me.context.drawImage(me.garf, 0, 0, 200, 200, me.player.x, me.player.y, 200, 200);
    }
    Update(me) {
        if(me.charging) { me.chargetime++; }
        if(me.isCursorMoving) {
            const b = me.cursorInfo;
            me.cursor.x += (2 * b.magnitude) * Math.cos(b.angle * Math.PI / 180);
            me.cursor.y += (2 * b.magnitude) * Math.sin(b.angle * Math.PI / 180);
        }
        if(me.isPlayerMoving) {
            const b = me.playerInfo;
            this.player.x += 2 * b.x;
            this.player.y += 2 * b.y;
        }
    }
    ButtonPress(b) {
        if(b.btn === "confirm") {
            this.charging = true;
            this.chargetime = 0;
        } else if(b.btn === "dpad") {
            this.isPlayerMoving = true;
        } else if(b.btn === "joystick") {
            this.isCursorMoving = true;
        }
    }
    ButtonRelease(b) {
        if(b.btn === "confirm") {
            this.charging = false;
            this.pewpews.push({ x: this.cursor.x + 65, y: this.cursor.y + 50, power: this.chargetime });
            this.chargetime = 0;
        } else if(b.btn === "dpad") {
            this.isPlayerMoving = false;
        } else if(b.btn === "joystick") {
            this.isCursorMoving = false;
        }
    }
    ButtonMove(b) {
        if(b.btn === "dpad") {
            console.log(b);
            this.playerInfo = b;
        } else if(b.btn === "joystick") {
            this.cursorInfo = b;
        }
    }
};
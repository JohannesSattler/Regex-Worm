
const regexes = ['[a-zA-Z]', '[a-z]', './w', '[what?]'];

class Worm {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.bodyParts = [];
        this.incX = 2;
        this.incY = 0;

        const randIndex = Math.floor(Math.random() * regexes.length) 
        this.regex = regexes[randIndex]
    }

    getWidth() {
        return this.regex.split('').length * 50;
    }
    getHeight() {
        return this.size;
    }

    updateWorm(x, y) {
        this.x = x;
        this.bodyParts.forEach(bodyPart => {
            bodyPart.updatePosition(x, y)
        })
    }

    buildWorm() {
        let startPosX = -200;

        for(let i = 0; i < this.regex.length; i++) {
            const body = new BodyPart(this.x+startPosX, this.y, this.size)
            body.buildBody();
            body.letter = this.regex[i];
            body.xGab = startPosX;
            body.yGab = 1;
            startPosX += 50;
            this.bodyParts.push(body)
        }

        // Create Head
        const head = new Head(this.x+startPosX, this.y, this.size, this.regex);
        head.buildBody();
        head.xGab = startPosX;
        this.bodyParts.push(head)
    }

    getCollision() {
        return this.collisionBody;
    }
}

class ReversedWorm extends Worm {
    constructor(x, y, size) {
        super(x, y, size)
        this.incX = -2;
    }

    buildWorm() {
        let startPosX = -200;

        // Create Head
        const head = new Head(this.x + startPosX, this.y, this.size, this.regex);
        head.buildBody();
        head.xGab = startPosX;
        this.bodyParts.push(head)

        for(let i = 5; i > 0; i--) {
            const body = new BodyPart(this.x+startPosX, this.y, this.size)
            body.buildBody();
            body.xGab = startPosX;
            body.yGab = 1;
            startPosX += 50;
            this.bodyParts.push(body)
        }
    }
}

class BodyPart {
    constructor(x, y, size, xGab, yGab) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.xGab = xGab;
        this.yGab = yGab;
        this.letter = '';
    }

    updatePosition(x, y) {
        this.x = x + this.xGab;
        this.y = y;
        this.buildBody()
    }

    drawImage(image, x , y, size) {
        ctx.beginPath();
        ctx.drawImage(image, x, y, size, size);
        ctx.closePath();
    }
    
    buildBody() {
        ctx.beginPath();
        const leg1 = Math.random() > 0.5 ? images.leg11 : images.leg13;
        const leg2 = Math.random() > 0.5 ? images.leg21 : images.leg23;
        ctx.drawImage(leg2, this.x, this.y, this.size, this.size);
        ctx.drawImage(images.body, this.x, this.y, this.size, this.size);
        ctx.drawImage(leg1, this.x, this.y, this.size, this.size);
        ctx.font = "bold 30px Verdana";
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.textAlign = "center";

        ctx.fillText(this.letter, this.x + (this.size/2), this.y + (this.size/2) + 10);
        ctx.closePath();
    }
}

class Head extends BodyPart {
    constructor(x, y, size, regex, xGab, yGab) {
        super(x, y, size, xGab, yGab);
        this.regex = regex
    }

    buildBody() {
        ctx.beginPath();
        ctx.drawImage(images.head, this.x, this.y, this.size, this.size);
        ctx.closePath();
    }
}
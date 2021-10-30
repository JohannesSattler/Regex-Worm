
class Worm {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.bodyParts = [];
        this.incX = 2;
    }

    updateWorm(x, y) {
        this.x = x;
        this.bodyParts.forEach(bodyPart => {
            bodyPart.updatePosition(x, y)
        })
    }

    buildWorm() {
        let startPosX = -200;

        for(let i = 0; i < 5; i++) {
            const body = new BodyPart(this.x+startPosX, this.y, this.size)
            body.buildBody();
            body.xGab = startPosX;
            body.yGab = 1;
            startPosX+=50;
            this.bodyParts.push(body)
        }

        // Create Head
        const head = new Head(this.x+startPosX, this.y, this.size);
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
        const head = new Head(this.x + startPosX, this.y, this.size);
        head.buildBody();
        head.xGab = startPosX;
        this.bodyParts.push(head)

        for(let i = 5; i > 0; i--) {
            const body = new BodyPart(this.x+startPosX, this.y, this.size)
            body.buildBody();
            body.xGab = startPosX;
            body.yGab = 1;
            startPosX+=50;
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
        ctx.drawImage(images.body, this.x, this.y, this.size, this.size);
        ctx.drawImage(images.leg1, this.x, this.y, this.size, this.size);
        ctx.drawImage(images.leg2, this.x, this.y, this.size, this.size);
        ctx.closePath();
    }
}

class Head extends BodyPart {
    constructor(x, y, size, xGab, yGab) {
        super(x, y, size, xGab, yGab);
    }

    buildBody() {
        ctx.beginPath();
        ctx.drawImage(images.head, this.x, this.y, this.size, this.size);
        ctx.closePath();
    }
}
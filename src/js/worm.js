
class Worm {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.targetY = 0;
        this.startX = 0;

        this.bodyParts = [];
        this.collisionBody = null;
    }

    getSize() {
        // startposX -200 + endPosX -200 + (5 * 50) 
        return (5 * 50)
    }

    updateNewWorm(x, y) {
        this.x = x;
        this.bodyParts.forEach(bodyPart => {
            bodyPart.updatePosition(x, y)
        })
    }

    buildWormNew() {
        let startPosX = -200;

        for(let i = 0; i < 5; i++) {
            const body = new BodyPart(this.x+startPosX, this.y, this.size)
            body.buildBody();
            body.xGab = startPosX;
            body.yGab = 1;
            startPosX+=50;
            this.bodyParts.push(body)
        }

        // Create Collision Body
        startPosX+=50;
        const colBody = new BodyPart(this.x+startPosX, this.y, this.size)
        colBody.buildBody();
        colBody.xGab = startPosX;
        colBody.yGab = 1;
        this.bodyParts.push(colBody)
        this.collisionBody = colBody;
    }
    
    goDown(x, y, amount, startX) {
        this.x = x;

        this.bodyParts.forEach((bodyPart, index) => {
            bodyPart.goDown(x, amount, startX)

            if(index === 0 && bodyPart.y === amount) {
                this.y = amount
            }
        })
    }

    goUp(x, y, amount, startX) {
        this.x = x;

        this.bodyParts.forEach((bodyPart, index) => {
            bodyPart.goUp(x, amount, startX)

            if(index === 0 && bodyPart.y === amount) {
                this.y = amount
            }
        })
    }

    getCollision() {
        return this.collisionBody;
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

    goDown(x, target, startX) {
        if(this.x + this.xGab > startX && this.y < target) {
            this.y += this.yGab;
            this.x = x + this.xGab;
            this.buildBody(); 
        } 
        else {
            this.x = x + this.xGab;
            this.buildBody(); 
        } 
    }

    goUp(x, target, startX) {
        if(this.x + this.xGab > startX && this.y > target) {
            this.y -= this.yGab;
            this.x = x + this.xGab;
            this.buildBody(); 
        } 
        else {
            this.x = x + this.xGab;
            this.buildBody(); 
        } 
    }
}
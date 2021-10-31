
const regexes = ['[a-zA-Z]', '[a-z]', '[0-9]', '[what?]'];

class Worm {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.bodyParts = [];
        this.incX = 2;
        this.incY = 0;
        this.animStop = false;
        this.isRight = null;

        const randIndex = Math.floor(Math.random() * regexes.length) 
        this.regex = regexes[randIndex]
    }

    getWidth() {
        return (this.regex.split('').length * 50) + this.size;
    }
    getHeight() {
        return this.size;
    }

    updateWorm(x, y) {
        this.x = x;
        this.bodyParts.forEach(bodyPart => {
            bodyPart.animStop = this.animStop;
            bodyPart.updatePosition(x, y)
        })
    }

    buildWorm() {
        let startPosX = 0;

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

        this.lastLeg = 1;
        this.animCount = 0;
        this.leg2 = images.leg12
        this.leg1 = images.leg22
        this.animStop = false;
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
    
    getLeg(first = true) {
        if(this.animStop) {
            if(first) return images.leg12;
            return images.leg22
        }

        if(this.lastLeg == 1) {
            this.lastLeg = 2
            if(first) return images.leg13;
            return images.leg23
        }
        if(this.lastLeg == 2) {
            this.lastLeg = 3
            if(first) return images.leg12;
            return images.leg22
        }
         if(this.lastLeg == 3) {
            this.lastLeg = 1
            if(first) return images.leg11;
            return images.leg21
        } 
    }

    buildBody() {
        ctx.beginPath();
        ctx.drawImage(this.leg2, this.x, this.y, this.size, this.size);
        ctx.drawImage(images.body, this.x, this.y, this.size, this.size);
        ctx.drawImage(this.leg1, this.x, this.y, this.size, this.size);

        ctx.font = "bold 30px Verdana";
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.textAlign = "center";
        ctx.fillText(this.letter, this.x + (this.size/2)+5, this.y + (this.size/2));
        ctx.closePath()

        this.animCount++;

        if(this.animCount == 10) {
            this.leg2 = this.getLeg(false);
            this.leg1 = this.getLeg();
            this.animCount = 0;
        }
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
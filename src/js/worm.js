// -------------------------------------
//              WORM
// -------------------------------------

class Worm {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.bodyParts = [];
        this.incX = 2;
        this.incY = 0;
        this.animStop = false;
        this.regex = null

        this.imgPrefix = '';
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

        for (let i = 0; i < this.regex.length; i++) {
            const body = new BodyPart(this.x + startPosX, this.y, this.size)

            if(i == 0) {
                body.isLast = true;
            }

            body.updateSprites(this.imgPrefix);
            body.buildBody();
            body.letter = this.regex[i];
            body.xGab = startPosX;
            body.yGab = 1;
            startPosX += 50;
            this.bodyParts.push(body)
        }

        // Create Head
        const head = new Head(this.x + startPosX, this.y, this.size, this.regex);
        head.updateSprites(this.imgPrefix);
        head.buildBody();
        head.xGab = startPosX;
        this.bodyParts.push(head)
    }
}

// -------------------------------------
//              BODY
// -------------------------------------

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
        this.animStop = false;

        this.body = images.body;
        this.head = images.head;
        this.leg2 = images.leg11
        this.leg1 = images.leg22
        this.tail = images.tail1
        this.isLast = false;
    }

    updateSprites(prefix) {
        this.body = images[prefix + 'body'];
        this.head = images[prefix + 'head'];
        this.leg2 = images[prefix + 'leg11']
        this.leg1 = images[prefix + 'leg22']
        this.tail = images[prefix + 'tail1']
    }

    updatePosition(x, y) {
        this.x = x + this.xGab;
        this.y = y;
        this.buildBody()
    }

    drawImage(image, x, y, size) {
        ctx.beginPath();
        ctx.drawImage(image, x, y, size, size);
        ctx.closePath();
    }

    // gets the next image of a sequence between 1 - 3
    getNextImage(image) {
        const splitted = image.src.split('/')
        const lastImage = splitted[splitted.length-1].split('.png')[0]
        let lastIndex = Number(lastImage[lastImage.length-1])

        if(this.animStop) {
            return lastImage.slice(0, lastImage.length-1) + 2
        }

        if(lastIndex + 1 === 4) {
            return lastImage.slice(0, lastImage.length-1) + 1
        }

        return lastImage.slice(0, lastImage.length-1) + (lastIndex + 1);
    }

    buildBody() {
        ctx.beginPath();
        ctx.drawImage(this.body, this.x, this.y, this.size, this.size);
        ctx.drawImage(this.leg2, this.x, this.y, this.size, this.size);
        ctx.drawImage(this.leg1, this.x, this.y, this.size, this.size);

        if(this.isLast) {
            ctx.drawImage(this.tail, this.x, this.y, this.size, this.size);
        }

        ctx.font = "bold 30px Verdana";
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.textAlign = "center";
        ctx.fillText(this.letter, this.x + (this.size / 2) + 5, this.y + (this.size / 2));
        ctx.closePath()

        this.animCount++;

        if (this.animCount == 10) {
            this.leg1 = images[this.getNextImage(this.leg1)]
            this.leg2 = images[this.getNextImage(this.leg2)]
            this.tail = images[this.getNextImage(this.tail)]
            this.animCount = 0;
        }
    }
}

// -------------------------------------
//              HEAD
// -------------------------------------

class Head extends BodyPart {
    constructor(x, y, size, regex, xGab, yGab) {
        super(x, y, size, xGab, yGab);
        this.regex = regex
    }

    buildBody() {
        ctx.beginPath();
        ctx.drawImage(this.head, this.x, this.y, this.size, this.size);
        ctx.closePath(); 
        this.animCount++;
    }
}
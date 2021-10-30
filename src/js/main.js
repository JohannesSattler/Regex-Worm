const canvas = document.getElementById('canvas');
const canvasParent = document.getElementById('canvas-container');

canvas.width = window.innerWidth;
canvas.height = canvasParent.clientHeight;

const ctx = canvas.getContext('2d');

const imageSources = ['./assets/body.png', './assets/head.png', './assets/leg1.png', './assets/leg2.png']
const images = {};

function loadAllImages() {
    imageSources.forEach((source, index) => {
        const image = new Image(); 
        image.src = source;
        image.onload = () => {
            if(index === imageSources.length-1) {
                start();
            }
        }

        const getName = source.split('/')[2].split('.png')[0];
        console.log(getName)
        images[getName] = image;
    })
}

loadAllImages();


function start() {
    moveTheWorm()
}


function createPark() {
    const worms = [];
    let xPositions = [400, 900, 1400]

    const amount = Math.floor(canvas.width / 100)
    const height = Math.floor(canvas.height / 100)
    console.log(amount, height)

    for(let u = 0; u < xPositions.length; u++) {
        for(let i = 0; i < amount; i++) {
            let thisMyYY = i * 210;
            
            const wormCollision1 = new Worm(xPositions[u], thisMyYY+(-xPositions[u]/2), 120);
            wormCollision1.buildWormNew();
            worms.push(wormCollision1)
        }
    }

    return worms
}

function getNextFreeSpace(x, y, allWorms) {
    const positions = []
    for(let i = 0; i < allWorms.length; i++) {
        const positionItem = {
            valueX: allWorms[i].x,
            y: allWorms[i].y,
            width: allWorms[i].getSize()
        }

        positions.push(positionItem)
    }

    let targetPosition = 0
    positions.forEach(pos => {
        if((y + 100) < pos.y+100 && (y + 100) > pos.y - 100) {
            targetPosition = y + 100
        }
        else {
            targetPosition = y - 100
        }
    })
    console.log(y, targetPosition)
    return targetPosition;
}

const allWormsMoving = [];
function createWorms(amount) {
    for(let i = 0; i < amount; i++) {
        const worm1 = new Worm(0, 100+(i*100), 120);
        worm1.buildWormNew();
        allWormsMoving.push(worm1)
    }
}

createWorms(3);


let incX = 1;
let y = 100;

function moveTheWorm() {

    let intervallID = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        const worms = createPark();

        allWormsMoving.forEach(worm => {
            let coliding = false;
            let collisionX = 0;
    
            for(let i = 0; i < worms.length; i++) {
                const col1 = worms[i].collisionBody;
                const col2 = worm.collisionBody;
                [coliding, collisionX] = checkForCollision(col1, col2);

                if(coliding == true) {
                    break;
                };
            }

            if(coliding && !worm.animationPlaying) {
                worm.startX = collisionX;
                worm.target = getNextFreeSpace(worm.x, worm.y, worms)

                if(worm.y < worm.target) {
                    worm.goUpOrDown = 'down'
                }
                else {
                    worm.goUpOrDown = 'up'
                }

                worm.animationPlaying = true;
            } 
    
            if(worm.goUpOrDown === 'down') {
                worm.goDown(worm.x+=incX, worm.y, worm.target, worm.startX);
                worm.startX -= 5;
            } 
            else if (worm.goUpOrDown === 'up') {
                worm.goUp(worm.x+=incX, worm.y, worm.target, worm.startX);
                worm.startX -= 5;
            }
            else {
                worm.updateNewWorm(worm.x+=incX, worm.y);
            }
    
    
            if(worm.y == worm.target) {
                worm.animationPlaying = false;
            } 
        })

    }, 10);
}


function checkForCollision(col1, col2) {
    if(col1.x > col2.x && col1.x < col2.x + 100 && col1.y > col2.y && col1.y < col2.y + 100) {
        return [true, col2.x];
    }
    else {
        return [false, 0];
    }
}





/* let size = 120;

function upOrDown() {

    let target = 200;
    let startX = 400;

    let intervallID = setInterval(() => {

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        worm1.goDown(x+=incX, y, target, startX);
        startX -= 5;

        if(worm1.y == 200) {
            console.log('animation finished');
            clearInterval(intervallID)

            upOrDown();
        }
    }, 10);
} */











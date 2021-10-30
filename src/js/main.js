const canvas = document.getElementById('canvas');
const canvasParent = document.getElementById('canvas-container');

canvas.width = window.innerWidth;
canvas.height = canvasParent.clientHeight;

const ctx = canvas.getContext('2d');

const imageSources = ['./assets/body.png', './assets/head.png', './assets/leg1.png', './assets/leg2.png', 
'./assets/leg11.png', './assets/leg12.png', './assets/leg13.png', './assets/leg21.png', './assets/leg22.png', './assets/leg23.png']
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

let worms = [];
function createWorms(amount) {
    for(let i = 0; i < amount; i++) {
        if(i % 2 === 1) {
            const worm = new ReversedWorm(canvas.width+250, 100 + (i * 50), 120);
            worm.buildWorm();
            worms.push(worm)
        }
        else {
            const worm = new Worm(-250, 100 + (i * 50), 120);
            worm.buildWorm();
            worms.push(worm)
        }
    }
}

// Got @getCursorPosition from: https://stackoverflow.com/a/18053642/14548868
function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    console.log(x, y)

    const selectedWorm = getClickedWorm(x, y);
}

function getClickedWorm(x, y) {
    let selectedWorm = undefined;

    worms.forEach(worm => {
        const halfWidth = Math.floor((worm.getWidth() + worm.size) / 2);
        const height = worm.getHeight();

        // reminde as x is supposed to start in the middle
        // x -/+ half of worm width
        // worm.size gets added or substracted beceause of the head?
        if(x > worm.x - halfWidth + (worm.size / 2) && x < worm.x + halfWidth + (worm.size / 2) && y > worm.y && y < worm.y+height) {
            console.log(worm.getWidth(), worm.getHeight())
            worm.incX *= 2;
            selectedWorm = worm;
        }
    })

    if(!selectedWorm) return;
    console.log(selectedWorm.regex)
    return selectedWorm;
}

canvas.addEventListener('mousedown', (e) => {
    getCursorPosition(canvas, e)
})

function moveTheWorm() {
    createWorms(7);

    let intervallID = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        worms.forEach((worm, index) => {
            if(index === 0) {
                if(worm.x > canvas.width+250) {
                    worms = []
                    clearInterval(intervallID)
                    moveTheWorm();
                    return;
                }
            }

            worm.updateWorm(worm.x+=worm.incX, worm.y+=worm.incY);

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




/* 
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
    // get free spaces
    let ranges = [];

    ranges.push(Math.round((0 + positions[0].y)/2)) // start Canvas

    for(let i = 0; positions.length; i++) {
        if(!positions[i+1]) break;
        const middle = Math.round((positions[i].y + positions[i+1].y)/2)

        ranges.push(middle)
    }

    ranges.push(Math.round((positions[positions.length-1].y + canvas.height)/2)) // end Canvas

    const closest = ranges.reduce((a, b) => {
        return Math.abs(b - y) < Math.abs(a - y) ? b : a;
    });

    const randomPosY = ranges[Math.floor(Math.random() * ranges.length)]

    console.log({y, closest, randomPosY});
    return closest;
} */

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











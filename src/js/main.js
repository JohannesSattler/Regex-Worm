
const matchList = document.querySelector('#match > ul');
const dontMatchList = document.querySelector('#no-match > ul');

const canvas = document.getElementById('canvas');
const canvasParent = document.getElementById('canvas-container');

canvas.width = window.innerWidth;
canvas.height = canvasParent.clientHeight;

const minHeight = 100;
const maxHeight = canvas.height-100

const ctx = canvas.getContext('2d');

const grayFilter = 'hue-rotate(0deg) grayscale(100%) brightness(100%)'
const greenFilter = 'hue-rotate(0deg) grayscale(0%) brightness(100%)'
const redFilter = 'hue-rotate(250deg) grayscale(0%) brightness(100%)'

ctx.filter = grayFilter;

const imageSources = 
['./assets/body.png', './assets/head.png', './assets/leg1.png', './assets/leg2.png', 
'./assets/leg11.png', './assets/leg12.png', './assets/leg13.png', './assets/leg21.png', './assets/leg22.png', 
'./assets/leg23.png']
const images = {};

// Load all the images before starting the Game
// Can be used like this: images.imageName
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
let currentLevel = null;

function start() {
    currentLevel = selectLevel();
    updateMatchList();
    const wormCount = currentLevel.regex.length
    createWorms(wormCount);
    moveTheWorm()
}

function selectLevel() {
    return levels[Math.floor(Math.random() * levels.length)]
}

function updateMatchList() {
    currentLevel.match.forEach(match => {
        const item = document.createElement('li');
        item.innerText = match;
        matchList.insertAdjacentElement('beforeend', item)
    })

    currentLevel.dontMatch.forEach(dontMatch => {
        const item = document.createElement('li');
        item.innerText = dontMatch;
        dontMatchList.insertAdjacentElement('beforeend', item)
    })
}

let worms = [];
function createWorms(amount) {
    sortWormsYposition(worms)

    for(let i = 0; i < amount; i++) {
        let xOffset = Math.floor(Math.random() * (500 - 100) + 100)
        if(i === 0) xOffset = 100;
        console.log({xOffset})

        const worm = new Worm(0, getNextYposition(worms), 120);

        const regex = currentLevel.regex;
        const getRandom = regex[Math.floor(Math.random() * regex.length)]
        worm.isRight = true;


        worm.x = worm.x - worm.getWidth() - xOffset
        worm.regex = getRandom;
        worm.buildWorm();
        worms.push(worm)
    }
}

function sortWormsYposition(worms) {
    worms.sort((worm1, worm2) => {
        if(worm1.y < worm1.y) return -1;
        else if(worm1.y > worm2.y) return 1;
        else return 0;
    })
}

function getNextYposition(worms) {
    if(!worms.length) return 100;

    // 0.1 - 0.5
    const max = maxHeight / 1000
    const min = minHeight / 1000

    // random number range: 100 - 500 in 100 steps
    const rand = Math.random() * (max - min) + min
    let position = Number(rand.toFixed(1)) * 1000 

    // object of used positions
    let positions = {}
    worms.forEach(worm => {
        positions[worm.y] = positions[worm.y] || worm.y;
    })

    let step = 100;
    // Im scared of infinite loops
    while(positions[position] !== undefined) {
        if(position+step > maxHeight) position -= step
        if(position-step < minHeight) position += step

        position += Math.random() > 0.5 ? step : -step;
        console.log(position, positions[position] !== undefined);
    } 

    return position;
}


let intervallID = null;

function moveTheWorm() {
    intervallID = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        drawCurrentTask()
        
        worms.forEach((worm, index) => {
            if(worm.x > canvas.width + 250) {
                worms.splice(index, 1);
                createWorms(1);
            }
            
            worm.updateWorm(worm.x+=worm.incX, worm.y+=worm.incY);
        })

    }, 10);
}


// Got @getCursorPosition from: https://stackoverflow.com/a/18053642/14548868
function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    console.log(x, y)

    const [selectedWorm, index] = getClickedWorm(x, y);
    if(!selectedWorm) return;
    const win = regexValidate(selectedWorm.regex);
    winingScreen(selectedWorm, index, win)
}

function getClickedWorm(x, y) {
    let selectedWorm = undefined;
    let index = 0;

    worms.forEach((worm, i) => {
        const width = worm.getWidth();
        const height = worm.getHeight();

        if(x > worm.x && x < worm.x + width && y > worm.y && y < worm.y + height) {
            worm.incX *= 2;
            selectedWorm = worm;
            index = i;
        }
    })

    if(!selectedWorm) return;
    console.log(selectedWorm.regex)
    return [selectedWorm, index];
}

function regexValidate(regex) {
    const match = Array.from(matchList.children);
    const dontMatch = Array.from(dontMatchList.children);

    const allMatch = match.map(li => {
        const string = li.innerText;

        const check = checkRegex(regex, string);
        if(check) {
            li.style.color = 'green'
            return true;
        }
        else {
            li.style.color = 'red'
            return false;
        }
    });

    const allDontMatch = dontMatch.map(li => {
        const string = li.innerText;

        const check = checkRegex(regex, string);
        if(check) {
            li.style.color = 'red'
            return false;
        }
        else {
            li.style.color = 'green'
            return true;
        }
    });

    const allTest = allMatch.concat(allDontMatch);
    const win = allTest.every(item => item === true);
    console.log('Win1', win)
    return win;
}

function checkRegex(regex, string) {
    let re = null;

    try {
        re = new RegExp(regex, "g");
    }
    catch (e){
        console.log(e.message, ' oh no')
    }

    if(re) {
        console.log(re.test(string))
        return re.test(string)
    } 
    else {
        return false;
    }
}

function winingScreen(winningWorm, index, win) {
    clearInterval(intervallID);

    moveToXPosition(worms, winningWorm, index, win)
    winningWorm.incX = 0;
}

function moveToXPosition(worms, winningWorm, index, win) {
    worms.splice(index, 1)
    console.log({win});

    const filter = win ? greenFilter : redFilter;

    let myIntervall = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        drawCurrentTask() 

        worms.forEach(worm => {
            worm.updateWorm(worm.x+=(worm.incX*4), worm.y+=worm.incY);
        })

        let allWorms = worms.every(worm => worm.x > canvas.width + worm.getWidth())

        const middleWorm = winningWorm.x + winningWorm.getWidth() / 2;
        const isMiddle = middleWorm <= (canvas.width / 2) - 10 || middleWorm >= (canvas.width / 2) + 10;

        const isRight = middleWorm <= (canvas.width / 2)
        const isLeft = middleWorm >= (canvas.width / 2)

        if(isMiddle) {
            if(isLeft) {
                let inc = -2;
                winningWorm.updateWorm(winningWorm.x+=inc, winningWorm.y)
            }
            else if(isRight) {
                let inc = 2;
                winningWorm.updateWorm(winningWorm.x+=inc, winningWorm.y)
            }

            allWorms = false;
        } 
        else {
            winningWorm.animStop = true;
            winningWorm.updateWorm(winningWorm.x, winningWorm.y)
            if(allWorms) {
                ctx.filter = filter;
            };
        }
    }, 10);
}

canvas.addEventListener('mousedown', (e) => {
    getCursorPosition(canvas, e)
})

function checkForCollision(col1, col2) {
    if(col1.x > col2.x && col1.x < col2.x + 100 && col1.y > col2.y && col1.y < col2.y + 100) {
        return [true, col2.x];
    }
    else {
        return [false, 0];
    }
}

function drawCurrentTask() {
    ctx.beginPath();
    ctx.font = "40px Impact";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.textAlign = "center";
    ctx.fillText(currentLevel.mission, (canvas.width / 2), 50);
    ctx.closePath();
    ctx.beginPath();
    ctx.font = "15px Arial";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.textAlign = "center";
    ctx.fillText('Click on the worm with the best Regex', (canvas.width / 2), 90);
    ctx.closePath();
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











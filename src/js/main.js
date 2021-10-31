
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
'./assets/leg23.png', './assets/play.png']
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

let count = 0;

function start() {
    currentLevel = selectLevel();
    updateMatchList();
    moveTheWorm()
}

function selectLevel() {
    return levels[Math.floor(Math.random() * levels.length)]
}

function updateMatchList() {
    matchList.innerText = ''
    dontMatchList.innerText = ''

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
        let xOffset = Math.floor(Math.random() * (300 - 100) + 100)
        
        const worm = new Worm(-100, 0, 120);

        const regex = currentLevel.regex;
        const getRandom = regex[Math.floor(Math.random() * regex.length)]
        worm.isRight = true;

        worm.x = worm.x - (getRandom.length * 50 + 120);
        worm.y = getNextYposition(worms, getRandom.length * 50 + 120)

        worm.regex = getRandom;
        worm.buildWorm();
        worms.push(worm)
    }
}

function sortWormsYposition(worms) {
    worms.sort((worm1, worm2) => {
        if(worm1.y < worm2.y) return -1;
        else if(worm1.y > worm2.y) return 1;
        else return 0;
    })
    worms.forEach(worm => console.log(worm.y))
}

function getNextYposition(worms, width) {
    if(!worms.length) return 100;

    // 0.1 - 0.5
    const max = maxHeight / 1000
    const min = minHeight / 1000

    // random number range: 100 - 500 in 100 steps
    const rand = Math.random() * (max - min) + min
    let position = Number(rand.toFixed(1)) * 1000 

    // object of used Y positions that are at the start of the map
    let positions = []

    worms.forEach(worm => {
        if(worm.x < -100 ){
            console.log('this is x and its smaller', worm.x);
            positions[worm.y] = 1;
        } 
        else {
            console.log('this is x ', worm.x);
        }
    })

    let step = 100;

    // Oh man this is dangerous :O
    while(positions[position] !== undefined) {
        if(position+step > maxHeight) position -= step
        if(position-step < minHeight) position += step
 
        position += Math.random() > 0.5 ? step : -step;
    }  

    return position;
}


let intervallID = null;
let spawningIntervallID = null;

function moveTheWorm() {

    // spawning worms
    spawningIntervallID = setInterval(() => {
        createWorms(1);
    }, 1000);

    // moving all worms
    intervallID = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        drawCurrentTask()
        
        worms.forEach((worm, index) => {
            if(worm.x > canvas.width + 250) {
                worms.splice(index, 1);
            }
            
            worm.updateWorm(worm.x+=worm.incX, worm.y+=worm.incY);
        })

    }, 10);
}

function regexValidate(regex) {
    const match = Array.from(matchList.children);
    const dontMatch = Array.from(dontMatchList.children);

    const allMatch = match.map(li => {
        const string = li.innerText;

        const check = checkRegex(regex, string);
        if(check) {
            li.style.color = '#66e35f'
            return true;
        }
        else {
            li.style.color = '#e35f5f'
            return false;
        }
    });

    const allDontMatch = dontMatch.map(li => {
        const string = li.innerText;

        const check = checkRegex(regex, string);
        if(check) {
            li.style.color = '#e35f5f'
            return false;
        }
        else {
            li.style.color = '#66e35f'
            return true;
        }
    });

    const allTest = allMatch.concat(allDontMatch);
    const win = allTest.every(item => item === true);
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

function winingScreen(winningWorm, index) {
    clearInterval(intervallID);
    clearInterval(spawningIntervallID);

    moveToXPosition(worms, winningWorm, index)
    winningWorm.incX = 0;
}

let finishIntervalID = null;

function moveToXPosition(worms, winningWorm, index) {
    worms.splice(index, 1)
    let win, filter = null;
    let onlyOnce = true;

    let targetYPos = winningWorm.y + 50
    let incY = 1;

    finishIntervalID = setInterval(() => {
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

        if(winningWorm.y === targetYPos) {
            incY = 0;
        }

        if(isMiddle) {
            if(isLeft) {
                let inc = -2;
                winningWorm.updateWorm(winningWorm.x+=inc, winningWorm.y+=incY)
            }
            else if(isRight) {
                let inc = 2;
                winningWorm.updateWorm(winningWorm.x+=inc, winningWorm.y+=incY)
            }

            allWorms = false;
        } 
        else {
            winningWorm.animStop = true;
            winningWorm.updateWorm(winningWorm.x, winningWorm.y)
            if(allWorms) {
                replay(winningWorm.x, winningWorm.y, winningWorm.getWidth())
                if(onlyOnce) {
                    win = regexValidate(winningWorm.regex);
                    filter = win ? greenFilter : redFilter;
                    ctx.filter = filter;
                    onlyOnce = false;
                }
            };
        }
    }, 10);
}

// Got @getCursorPosition() from: https://stackoverflow.com/a/18053642/14548868
function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    console.log(x, y)

    const [selectedWorm, index] = getClickedWorm(x, y);
    if(!selectedWorm) return;
    winingScreen(selectedWorm, index)
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
    return [selectedWorm, index];
}

function getCursorPosition2(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    return {x, y}
}

let replayState = false;
let replyButton = {};

function replay(x, y, width) {
    replayState = true;
    ctx.beginPath()
    ctx.drawImage(images.play, x+(width/2)-45, y-50, 70, 70);
    ctx.closePath();

    replyBut = {
        x: x+(width/2)-45,
        y: y-50,
        w: 70
    }
}

canvas.addEventListener('mousedown', (e) => {
    if(replayState) {
        const cursor = getCursorPosition2(canvas, e) 

        if(cursor.x > replyBut.x && cursor.x < replyBut.x + replyBut.w) {
            if(cursor.y > replyBut.y - replyBut.w && cursor.y < replyBut.y + replyBut.w) {
                console.log('reeeeply');
                playNextLevel();
            }
        }

        return;
    }
    getCursorPosition(canvas, e)
})

function clearLevel() {
    clearInterval(finishIntervalID)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.filter = grayFilter;
    worms = []
    replayState = false
    replyButton = {};
    currentLevel = null;
    count = 0;
    intervallID = null;
    spawningIntervallID = null;
    finishIntervalID = null;
}

function playNextLevel() {
    clearLevel()
    start()
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












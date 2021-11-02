// -------------------------------------
//          START - PARAMETERS
// -------------------------------------

const matchList = document.querySelector('#match > ul');
const dontMatchList = document.querySelector('#no-match > ul');

const canvas = document.getElementById('canvas');
const canvasParent = document.getElementById('canvas-container');

canvas.width = window.innerWidth;
canvas.height = canvasParent.clientHeight;

const minHeight = 100;
const maxHeight = canvas.height - 100

const ctx = canvas.getContext('2d');

// -------------------------------------
//       Start - PRELOAD IMAGES
// -------------------------------------

const imageSources = [
    './assets/heart.png', './assets/play.png',

    './assets/gray-worm/body.png', './assets/gray-worm/head.png',
    './assets/gray-worm/leg11.png', './assets/gray-worm/leg12.png', './assets/gray-worm/leg13.png', './assets/gray-worm/leg21.png', './assets/gray-worm/leg22.png',
    './assets/gray-worm/leg23.png', './assets/gray-worm/tail1.png', './assets/gray-worm/tail2.png','./assets/gray-worm/tail3.png',
    
    './assets/green-worm/gbody.png', './assets/green-worm/ghead.png',
    './assets/green-worm/gleg11.png', './assets/green-worm/gleg12.png', './assets/green-worm/gleg13.png', './assets/green-worm/gleg21.png', './assets/green-worm/gleg22.png',
    './assets/green-worm/gleg23.png', './assets/green-worm/gtail1.png', './assets/green-worm/gtail2.png','./assets/green-worm/gtail3.png',

    './assets/red-worm/rbody.png', './assets/red-worm/rhead.png',
    './assets/red-worm/rleg11.png', './assets/red-worm/rleg12.png', './assets/red-worm/rleg13.png', './assets/red-worm/rleg21.png', './assets/red-worm/rleg22.png',
    './assets/red-worm/rleg23.png', './assets/red-worm/rtail1.png', './assets/red-worm/rtail2.png','./assets/red-worm/rtail3.png',
]
const images = {};

// Load all the images before starting the Game 
// Can be used like this: images.imageName
// inside window load event
function loadAllImages() {
    imageSources.forEach((source, index) => {
        const image = new Image();
        image.src = source;
        image.onload = () => {
            if (index === imageSources.length - 1) {
                start();
            }
        }
        const splitted = source.split('/');
        const getName = splitted[splitted.length-1].split('.png')[0];
        console.log(getName)
        images[getName] = image;
    })
}

// -------------------------------------
//       GAME - Parameters
// -------------------------------------

let imagePrefix = ''; // '': gray | 'g': green | 'r': red worm

const spawnIntervall = 1000;
const movementIntervall = 10;
let pause = false;

let worms = [];
let currentLevel = null;

let replayState = false;
let replyBut = {};

let intervallID = null;
let spawningIntervallID = null;
let finishIntervalID = null;

let timeForLvl = 1.5 * 60 * 1000;
const incTimer = 20;
let lives = 3;
let score = 0;
const incScore = 10;

// -------------------------------------
//           LEVEL HANDLER
// -------------------------------------

// starts a random level
function start() {
    currentLevel = selectLevel();
    updateMatchList();
    moveTheWorm()
}

// selects random level
function selectLevel() {
    return levels[Math.floor(Math.random() * levels.length)]
}

// initialize winning or loosing screen
function winingScreen(winningWorm, index) {
    clearInterval(intervallID);
    clearInterval(spawningIntervallID);

    moveToXPosition(worms, winningWorm, index)
    winningWorm.incX = 0;
}

// draws the replay button on top of worm
// saves coordinates to @replyBut
function replay(x, y, width, size = 70) {
    ctx.beginPath()
    ctx.drawImage(images.play, x + (width / 2) - 45, y - 50, size, size);
    ctx.closePath();

    replyBut = {
        x: x + (width / 2) - 45,
        y: y - 50,
        w: size
    }
}

// clears everything in the vanvas
function clearLevel() {
    clearInterval(intervallID)
    clearInterval(spawningIntervallID)
    clearInterval(finishIntervalID)

    worms = []
    replayState = false
    replyBut = {};
    currentLevel = selectLevel();
    intervallID = null;
    spawningIntervallID = null;
    finishIntervalID = null;

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    imagePrefix = '';
}

// handles click event on Play button
function playNextLevel() {
    clearLevel()
    start()
}

// clear level and reset full game after lose
function lostGame() {
    timeForLvl = 1.5 * 60 * 1000;
    lives = 3;
    currentLevel = selectLevel();
    clearLevel()
    drawLooseScreen(score)
}
// won game. add + 20 seceonds
function wonGame() {
    drawAddTimerSeconds(incTimer)
}

// Sets the test Cases
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

function checkForLose() {
    if (timeForLvl <= 0 || lives <= 0) {
        lostGame()
    }
}

// -------------------------------------
//         DRAW MOVEMENT & LEVEL
// -------------------------------------

// moves and spawns worms
function moveTheWorm() {
    // spawning worms
    spawningIntervallID = setInterval(() => {
        if (!pause) {
            createWorms(1);
        }
    }, 1000);

    // moving all worms
    intervallID = setInterval(() => {
        if (!pause) { 
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            timeForLvl -= 10

            drawLevelAdditionals()
    
            worms.forEach((worm, index) => {
                if (worm.x > canvas.width + 250) {
                    worms.splice(index, 1);
                }

                worm.updateWorm(worm.x += worm.incX, worm.y += worm.incY);
            })
    
            checkForLose();
        }
    }, 10);
}

// moves all worms that are not selected outside
// & the selected in the middle
function moveToXPosition(worms, winningWorm, index) {
    worms.splice(index, 1)
    let win, filter = null;
    let onlyOnce = true;

    // move worm down
    let targetYPos = winningWorm.y + 50
    let incY = 1;

    // check if worm.y + 50 is outsid of canvas & move worm up
    if (winningWorm.y + 50 > maxHeight) {
        targetYPos = winningWorm.y - 50;
        incY = -1;
    }

    finishIntervalID = setInterval(() => {
        if(!pause) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            drawLevelAdditionals()
            
            worms.forEach(worm => {
                worm.updateWorm(worm.x += (worm.incX * 4), worm.y += worm.incY);
            })
    
            // checl if all worms are outside the
            let allWorms = worms.every(worm => worm.x > canvas.width + worm.getWidth())
    
            const middleWorm = winningWorm.x + winningWorm.getWidth() / 2;
            const isMiddle = middleWorm <= (canvas.width / 2) - 10 || middleWorm >= (canvas.width / 2) + 10;
    
            const isRight = middleWorm <= (canvas.width / 2)
            const isLeft = middleWorm >= (canvas.width / 2)
    
            if (winningWorm.y === targetYPos) {
                incY = 0;
            }
    
            if (isMiddle) {
                if (isLeft) {
                    let inc = -2;
                    winningWorm.updateWorm(winningWorm.x += inc, winningWorm.y += incY)
                } else if (isRight) {
                    let inc = 2;
                    winningWorm.updateWorm(winningWorm.x += inc, winningWorm.y += incY)
                }
                allWorms = false;
            } else {
                winningWorm.animStop = true;
                winningWorm.updateWorm(winningWorm.x, winningWorm.y)

                if (allWorms) {
                    if (onlyOnce) {
                        win = regexValidate(winningWorm.regex);
    
                        if (win) {
                            timeForLvl += incTimer * 1000; // add n seconds
                            score += incScore;
                        } else {
                            lives--;
                        }
                        
                        let imagePrefix = win ? 'g' : 'r';
                        winningWorm.imgPrefix = imagePrefix;
                        winningWorm.buildWorm();
                        console.log(winningWorm.imgPrefix);

                        replayState = true;
                        onlyOnce = false;
                    }
    
                    replay(winningWorm.x, winningWorm.y, winningWorm.getWidth())
                    if (win) wonGame()
                };
            }
            checkForLose();
        }
    }, 10);
}

function drawLevelAdditionals() {
    drawClock(timeForLvl)
    drawHearts(lives);
    drawCurrentTask()
    drawScoreBoard(score);
}

// -------------------------------------
//              REGEX
// -------------------------------------

let regexIndex = 0;

function getNextRegex() {
    const regexes = currentLevel.regex;

    if (regexIndex > regexes.length - 1) {
        regexes.sort(() => .5 - Math.random()); // shuffle regexes
        regexIndex = 0;
        return regexes[regexIndex];
    }

    return regexes[regexIndex++]
}

// Validates all test cases by regex
function regexValidate(regex) {
    const match = Array.from(matchList.children);
    const dontMatch = Array.from(dontMatchList.children);

    const allMatch = match.map(li => {
        const string = li.innerText;

        const check = checkRegex(regex, string);
        if (check) {
            li.style.color = '#66e35f'
            return true;
        } else {
            li.style.color = '#e35f5f'
            return false;
        }
    });

    const allDontMatch = dontMatch.map(li => {
        const string = li.innerText;

        const check = checkRegex(regex, string);
        if (check) {
            li.style.color = '#e35f5f'
            return false;
        } else {
            li.style.color = '#66e35f'
            return true;
        }
    });

    const allTest = allMatch.concat(allDontMatch);
    const win = allTest.every(item => item === true);
    return win;
}

// checks regex on a given string
function checkRegex(regex, string) {
    let re = null;

    try {
        re = new RegExp(regex, "g");
    } catch (e) {
        console.log(e.message, ' oh no')
    }

    if (re) {
        console.log(re.test(string))
        return re.test(string)
    } else {
        return false;
    }
}

// -------------------------------------
//              EVENTS
// -------------------------------------

// add all event handlers
window.addEventListener('load', () => {
    // Load all images on start
    loadAllImages()

    // Pause 
    window.addEventListener('visibilitychange', () => {
        if(!replayState) {
            pause = true;
            canvas.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'
            drawLevelAdditionals()
            replay((canvas.width / 2) - 100 + 45, (canvas.height / 2), 0, 200)
        }
    });

    // get click on play button
    canvas.addEventListener('mousedown', (e) => {
        if(replayState || pause) {
            const cursor = getCursorPosition2(canvas, e)

            if (cursor.x > replyBut.x && cursor.x < replyBut.x + replyBut.w) {
                if (cursor.y > replyBut.y - replyBut.w && cursor.y < replyBut.y + replyBut.w) {
                    console.log('reeeeplay');
                    if(pause) {
                        canvas.style = null
                        pause = false;
                        return;
                    }
                    replayState = false
                    playNextLevel();
                }
            }

            return;
        }

        getCursorPosition(canvas, e)
    })
})
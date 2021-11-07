// -------------------------------------
//          START - PARAMETERS
// -------------------------------------

const matchList = document.querySelector('#match > ul');
const dontMatchList = document.querySelector('#no-match > ul');

const leftBottomContainer = document.querySelector('.bottom-left');
const rightBottomContainer = document.querySelector('.bottom-right');

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
    './assets/heart.png', './assets/play.png','./assets/correct.png', './assets/wrong.png',

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
        images[getName] = image;
    })
}

// -------------------------------------
//       GAME - Parameters
// -------------------------------------

// worm.buildWorm() should be called afterwards
// '': gray worm | 'g': green worm | 'r': red worm
let imagePrefix = '';
let pause = false;

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

const colorSelector = {
    easy: "#60BF78",
    normal: "#60ACBF",
    hard: "#BF6060",
    'very hard': "#8760B7" 
}

let worms = [];
let levelIndex = 0;
let currentLevel = selectLevel();

let wormSelected = false;
// -------------------------------------
//           LEVEL HANDLER
// -------------------------------------

// starts a random level
function start() {
    //currentLevel = selectLevel();
    updateMatchList();
    moveTheWorm()
}

// selects random level with hardness based on score
function selectLevel() {
    const hardness = getHardness(score);
    const color = colorSelector[hardness]
    leftBottomContainer.style.borderTop = '4px solid ' + color
    rightBottomContainer.style.borderTop = '4px solid ' + color
    
    // Change Visibility of cheat sheet
    if( hardness === 'hard'|| hardness === 'very hard') {
        cheatSheetVisibility(false) 
    } 
    else {
        cheatSheetVisibility(true) 
    }

    const index = Math.floor(Math.random() * levels[hardness].length)
    
    return levels[hardness][index]

/*     if(levelIndex >= levels[hardness].length) {
        levelIndex = 0;
        return levels[hardness][0]
    }

    return levels[hardness][levelIndex++] */
}

function cheatSheetVisibility(visible) {
    const cheatSheet = document.querySelector('#regex-cheat');
    const listItem = cheatSheet.querySelectorAll('li');
    const listItemVisible = listItem[0].classList.contains('hide-this');

    if(visible) {
        if(listItemVisible) {
            listItem.forEach(item => item.classList.remove('hide-this'))
        }
    } else {
        if(!listItemVisible) {
            listItem.forEach(item => item.classList.add('hide-this'))
        }
    }
}

//hardness based on score
function getHardness(score) {
    if(score < 20) return 'easy'
    else if(score >= 20 && score < 30) return 'normal'
    else if(score >= 30 && score < 40) return 'hard'
    else return 'very hard'
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
    clearLevel()
    timeForLvl = 1.5 * 60 * 1000;
    lives = 3;
    currentLevel = selectLevel();
    replayState = true;
    drawLooseScreen(score)
}

function checkForLose() {
    if (timeForLvl <= 0 || lives <= 0) {
        lostGame()
    }
}

// won game. add + 20 seceonds
function wonGame() {
    drawAddTimerSeconds(incTimer)
}


/* if(Math.random() > 0.5) {
    span.classList.add('match-correct')
} else {
    span.classList.remove('match-wrong')
    span.classList.add('match-wrong')
} */


// Sets the test Cases
function updateMatchList() {
    matchList.innerText = ''
    dontMatchList.innerText = ''

    currentLevel.match.forEach(match => {
        const item = document.createElement('li');
        //item.innerText = match;
        const wrong = document.createElement('img');
        wrong.src = './assets/wrong.png'
        item.insertAdjacentElement('afterbegin', wrong)

        match.split('').forEach(char => {
            const span = document.createElement('span');
            span.classList.add('match-item')
            span.innerText = char;
            item.insertAdjacentElement('beforeend', span)
        })

        matchList.insertAdjacentElement('beforeend', item)
    })

    currentLevel.dontMatch.forEach(dontMatch => {
        const item = document.createElement('li');
        //item.innerText = dontMatch;
        const wrong = document.createElement('img');
        wrong.src = './assets/wrong.png'
        item.insertAdjacentElement('afterbegin', wrong)

        dontMatch.split('').forEach(char => {
            const span = document.createElement('span');
            span.classList.add('match-item')
/*             if(Math.random() > 0.5) {
                span.classList.add('match-correct')
            } else {
                span.classList.remove('match-wrong')
                span.classList.add('match-wrong')
            } */
            span.innerText = char;
            item.insertAdjacentElement('beforeend', span)
        })

        dontMatchList.insertAdjacentElement('beforeend', item)
    })
}

// -------------------------------------
//         DRAW MOVEMENT & LEVEL
// -------------------------------------

// moves and spawns worms
function moveTheWorm() {
    // spawns worms
    spawningIntervallID = setInterval(() => {
        if (!pause) {
            createWorms(1);
        }
    }, 1000);

    // moves all worms
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
    let win = null;
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
    drawCurrentTask(getHardness(score))
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

// refractor this please in the future
function regexValidate(regex) {
    const match = Array.from(matchList.children);
    const dontMatch = Array.from(dontMatchList.children);

    const allListItemsMatch = [];
    const isExactMatch = currentLevel.isExactMatch;

    match.forEach(li => {
        const allSpans = li.querySelectorAll('span');
        const string = li.innerText.replaceAll('\n', '');

        if(isExactMatch) {
            const check = checkRegex(regex, string);

            if(check) {
                li.querySelector('img').src = './assets/correct.png'
                allSpans.forEach(span => {
                    span.classList.remove('match-wrong')
                    span.classList.add('match-correct')
                })
                allListItemsMatch.push(true)
            } else {
                li.querySelector('img').src = './assets/wrong.png'
                allSpans.forEach(span => {
                    span.classList.remove('match-correct')
                    span.classList.add('match-wrong')
                })
                allListItemsMatch.push(false)
            }
        }
        else {
            const allCorrect = []

            allSpans.forEach(span => {
                const check = checkRegex(regex, span.innerText);
    
                if(check) {
                    span.classList.remove('match-wrong')
                    span.classList.add('match-correct')
                    allCorrect.push(true)
                } else {
                    span.classList.remove('match-correct')
                    span.classList.add('match-wrong')
                    allCorrect.push(false)
                }
            })
            const isCorrect = allCorrect.every(item => item == true)
            allListItemsMatch.push(isCorrect)
    
            if (isCorrect) {
                li.querySelector('img').src = './assets/correct.png'
            } else {
                li.querySelector('img').src = './assets/wrong.png'
            }
        }
    })

    dontMatch.forEach(li => {
        const allSpans = li.querySelectorAll('span');
        const string = li.innerText.replaceAll('\n', '');

        if(isExactMatch) {
            const check = checkRegex(regex, string);

            if(!check) {
                li.querySelector('img').src = './assets/correct.png'
                allSpans.forEach(span => {
                    span.classList.remove('match-wrong')
                    span.classList.add('match-correct')
                })
                allListItemsMatch.push(true)
            } else {
                li.querySelector('img').src = './assets/wrong.png'
                allSpans.forEach(span => {
                    span.classList.remove('match-correct')
                    span.classList.add('match-wrong')
                })
                allListItemsMatch.push(false)
            }
        }
        else {
            const allCorrect = []

            allSpans.forEach(span => {
                const check = checkRegex(regex, span.innerText);
    
                if(!check) {
                    span.classList.remove('match-wrong')
                    span.classList.add('match-correct')
                    allCorrect.push(true)
                } else {
                    span.classList.remove('match-correct')
                    span.classList.add('match-wrong')
                    allCorrect.push(false)
                }
            })
            const isCorrect = allCorrect.every(item => item == true)
            allListItemsMatch.push(isCorrect)
            
            if (isCorrect) {
                li.querySelector('img').src = './assets/correct.png'
            } else {
                li.querySelector('img').src = './assets/wrong.png'
            }
        }
    }) 

    return allListItemsMatch.every(testCase => testCase == true)
}

// Validates all test cases by regex
function regexValidate2(regex) {
    const match = Array.from(matchList.children);
    const dontMatch = Array.from(dontMatchList.children);

    const allMatch = match.map(li => {
        const string = li.innerText.replaceAll('\n', '');

        const check = checkRegex(regex, string);
        if (check) {
            li.querySelector('img').src = './assets/correct.png'
            return true;
        } else {
            li.querySelector('img').src = './assets/wrong.png'
            return false;
        }
    });

    const allDontMatch = dontMatch.map(li => {
        const string = li.innerText;

        const check = checkRegex(regex, string);
        if (check) {
            li.querySelector('img').src = './assets/wrong.png'
            return false;
        } else {
            li.querySelector('img').src = './assets/correct.png'
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
        const checker = re.test(string)
        return checker
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
                    wormSelected = false; // put worm selected to false
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
// -------------------------------------
//           WORM SPAWNING
// -------------------------------------

function createWorms(amount) {
    sortWormsYposition(worms)

    for (let i = 0; i < amount; i++) {
        const worm = new Worm(-100, 0, 120);

        const nextRegex = getNextRegex();
        worm.isRight = true;

        // set worm heigt & width for spawning
        worm.x = worm.x - (nextRegex.length * 50 + 120);
        const nextY = getNextYposition(worms, nextRegex.length * 50 + 120)
        worm.y = nextY;

        // not a valid position found
        if(nextY == -1) {
            console.log('oh no there is no position')
            return;
        }

        worm.regex = nextRegex;
        worm.buildWorm();
        worms.push(worm)
    }
}

function sortWormsYposition(worms) {
    worms.sort((worm1, worm2) => {
        if (worm1.y < worm2.y) return -1;
        else if (worm1.y > worm2.y) return 1;
        else return 0;
    })
    //worms.forEach(worm => console.log(worm.y))
}

function getNextYposition(worms, nextWidth) {
    if (!worms.length) return 100;

    // 0.1 - 0.5
    const max = maxHeight / 1000
    const min = minHeight / 1000

    // random number range: 100 - 500 in 100 steps
    const rand = Math.random() * (max - min) + min
    let position = Number(rand.toFixed(1)) * 1000

    // object of used Y positions that are at the start of the map
    let positions = []

    // start: worm.x (-100) - width of worm
    worms.forEach(worm => {
        if (-100 - nextWidth > worm.x - worm.getWidth()) {
            positions[worm.y] = 1;
        }
    })

    let step = 100;
    const maxTrys = 2;
    let trys = 0;

    // Oh man this is dangerous :O | hmm not so dangerous anymore?
    // didnt calculated x range correctly | does it work now? :(
    while (trys <= maxTrys && positions[position] !== undefined) {
        if (position + step > maxHeight) position -= step
        if (position - step < minHeight) position += step

        position += Math.random() > 0.5 ? step : -step;
        trys++;
    }
    
    if(trys >= maxTrys) return -1;
    return position;
}

// -------------------------------------
//        SELECTED WORM HANDLE
// -------------------------------------

// Got @getCursorPosition() from: https://stackoverflow.com/a/18053642/14548868
function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    console.log(x, y)

    const [selectedWorm, index] = getClickedWorm(x, y);
    if (!selectedWorm || wormSelected) return;
    wormSelected = true;
    winingScreen(selectedWorm, index)
}

// current click position
function getCursorPosition2(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    return {
        x,
        y
    }
}

// compares click position and worms position
// return selectedWorm & index if found
function getClickedWorm(x, y) {
    let selectedWorm = undefined;
    let index = 0;

    worms.forEach((worm, i) => {
        const width = worm.getWidth();
        const height = worm.getHeight();

        if (x > worm.x && x < worm.x + width && y > worm.y && y < worm.y + height) {
            worm.incX *= 2;
            selectedWorm = worm;
            index = i;
        }
    })

    if (!selectedWorm) return [0, 0];
    return [selectedWorm, index];
}

// -------------------------------------
//          OTHER DRAWINGS
// -------------------------------------

function drawClock(time) {
    const minutes = Math.floor(time / 1000 / 60)
    const seconds = Math.floor(time / 1000) % 60;
    
    const makeTwoDigits = number => {
        if(number < 10) {
            return '0' + number
        }
        return number
    }

    const text = makeTwoDigits(minutes) + ':' + makeTwoDigits(seconds)

    ctx.beginPath();
    ctx.font = "30px Impact";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.textAlign = "center";
    ctx.fillText(text, 90, 50);
    ctx.closePath();
}

function drawAddTimerSeconds(seconds) {
    ctx.beginPath();
    ctx.font = "20px Impact";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(79, 227, 106, 0.7)";
    ctx.textAlign = "center";
    ctx.fillText('+' + seconds, 155, 50);
    ctx.closePath();
}

function drawHearts(amount) {
    let xGab = 0;

    ctx.beginPath();
    for (let i = 1; i <= amount; i++) {
        ctx.drawImage(images.heart, 180 + xGab, 35, 30, 30);
        xGab += 38;
    }
    ctx.closePath()
}

function drawScoreBoard(score) {
    ctx.beginPath();
    ctx.font = "25px Arial";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.textAlign = "right";

/*     const answer = "Do I understand regex?".replace(/[?]/g, '?: No!')
    console.log(answer) */
    
    ctx.fillText('Score: ' + score, 450, 50);
    ctx.closePath();
}

function drawCurrentTask(hardness='easy') {
    // level hardness    
    const color = colorSelector[hardness] 

    ctx.beginPath();
    ctx.font = "20px Impact";
    ctx.textBaseline = "middle";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(hardness, (canvas.width / 2), 15);
    ctx.closePath();
    // mission
    ctx.beginPath();
    ctx.font = "40px Impact";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.textAlign = "center";
    ctx.fillText(currentLevel.mission, (canvas.width / 2), 50);
    ctx.closePath();
    // click on worm text
    ctx.beginPath();
    ctx.font = "15px Arial";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.textAlign = "center";
    ctx.fillText('Click on the worm with the best Regex', (canvas.width / 2), 90);
    ctx.closePath();
}

function drawLooseScreen(score) {
    ctx.beginPath();
    ctx.font = "40px Impact";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.textAlign = "center";
    ctx.fillText("You Lost!", (canvas.width / 2), (canvas.height / 2));
    ctx.closePath();
    ctx.beginPath();
    ctx.font = "20px Arial";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.textAlign = "center";
    ctx.fillText('Score: '+ score, (canvas.width / 2), (canvas.height / 2) + 40);
    ctx.closePath();

    replay((canvas.width / 2) + 10, (canvas.height / 2) + 110, 0)
}

function createPauseMenu() {
    ctx.beginPath();
    ctx.drawImage(images.play, (canvas.width / 2)-100, (canvas.height / 2)-100, 200, 200);
    ctx.closePath()
}
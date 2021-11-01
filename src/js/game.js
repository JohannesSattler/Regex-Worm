// -------------------------------------
//           WORM SPAWNING
// -------------------------------------

function createWorms(amount) {
    sortWormsYposition(worms)

    for (let i = 0; i < amount; i++) {
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
        if (worm1.y < worm2.y) return -1;
        else if (worm1.y > worm2.y) return 1;
        else return 0;
    })
    //worms.forEach(worm => console.log(worm.y))
}

function getNextYposition(worms) {
    if (!worms.length) return 100;

    // 0.1 - 0.5
    const max = maxHeight / 1000
    const min = minHeight / 1000

    // random number range: 100 - 500 in 100 steps
    const rand = Math.random() * (max - min) + min
    let position = Number(rand.toFixed(1)) * 1000

    // object of used Y positions that are at the start of the map
    let positions = []

    worms.forEach(worm => {
        if (worm.x < -100) {
            positions[worm.y] = 1;
        }
    })

    let step = 100;

    // Oh man this is dangerous :O
    while (positions[position] !== undefined) {
        if (position + step > maxHeight) position -= step
        if (position - step < minHeight) position += step

        position += Math.random() > 0.5 ? step : -step;
    }

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
    if (!selectedWorm) return;
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
    ctx.fillText(text, 100, 50);
    ctx.closePath();
}

function drawHearts(amount) {
    let xGab = 20;

    ctx.beginPath();
    for (let i = 1; i <= amount; i++) {
        ctx.drawImage(images.heart, 150 + xGab, 35, 30, 30);
        xGab += 30;
    }
    ctx.closePath()
}

function drawScoreBoard(score) {
    ctx.beginPath();
    ctx.font = "25px Arial";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.textAlign = "center";
    ctx.fillText('Score: ' + score, 350, 50);
    ctx.closePath();
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
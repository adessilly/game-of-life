var canvas = document.getElementById('ui');

const GRID_PIXEL_WIDTH = canvas.width;
const GRID_PIXEL_HEIGHT = canvas.height;

const GRID_WIDTH = 50;
const GRID_HEIGHT = 50;

const ctx = canvas.getContext("2d");
var matrix = initMatrix();

drawUI();

playing = false;
iteration = 0;

function togglePlay() {
    playing = !playing;
    if(playing) {
        play();
    }
}

function stop() {
    playing = false;
    document.getElementById('playpause').innerHTML="PLAY";
}

function play() {
    playing = true;
    setTimeout(() => {
        next();
        iteration++;
        document.getElementById('iteration').innerHTML= ' (' + iteration + ')';
        if(playing) {
            document.getElementById('playpause').innerHTML="STOP";
            play();
        } else {
            document.getElementById('playpause').innerHTML="PLAY";
        }
    }, 500);
    
}

function next() {
    matrixNew = initMatrix();
    matrix.forEach( (col, x) => {
        col.forEach( (rowcell, y) => {
            const nbNeighbours = countNeighbours({x, y});
            if(rowcell) {
                matrixNew[x][y] = shouldStay(nbNeighbours) && !shouldDie(nbNeighbours);
            }
            else {
                matrixNew[x][y] = shouldBorn(nbNeighbours);
            }
        })
    });
    matrix = matrixNew;
    drawUI();
}

function canvasClicked(event) {
    console.log(event);
    const pixel = { x: event.offsetX, y: event.offsetY };
    const cell = toCell(pixel);
    matrix[cell.x][cell.y] = !matrix[cell.x][cell.y];
    drawUI();
}

function shouldBorn(nbNeighbours) {
    return nbNeighbours === 3;
}
function shouldStay(nbNeighbours) {
    return nbNeighbours === 2 || nbNeighbours === 3;
}
function shouldDie(nbNeighbours) {
    return nbNeighbours > 3;
}

function countNeighbours(cell) {
    var result = 0;
    var minX = cell.x === 0 ? 0 : cell.x - 1;
    var maxX = cell.x === GRID_WIDTH-1 ? GRID_WIDTH-1 : cell.x + 1;
    var minY = cell.y === 0 ? 0 : cell.y - 1;
    var maxY = cell.x === GRID_HEIGHT-1 ? GRID_HEIGHT-1 : cell.y + 1;

    for (var x=minX; x<=maxX; x++) {
        for (var y=minY; y<=maxY; y++) {
            if(x == cell.x && y == cell.y) continue;
            result += matrix[x][y] ? 1 : 0;
        }
    }
    return result 
}

function initMatrix() {
    const matrix = [];
    for(var i=0; i<GRID_WIDTH; i++) {
        matrix.push( new Array(GRID_HEIGHT) );
        matrix[i].fill(false);
    } 
    return matrix;
}

function drawUI() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, GRID_PIXEL_WIDTH, GRID_PIXEL_HEIGHT);
    matrix.forEach( (col, x) => {
        col.forEach( (cell, y) => {
            if(cell) {
                drawCell({x, y});
            }
        })
    });
}

function getMousePos(event) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
}

function drawCell(cell) {
    const pixel = toPixel(cell);
    const w = transformPixel(1, GRID_WIDTH, GRID_PIXEL_WIDTH); 
    const h = transformPixel(1, GRID_HEIGHT, GRID_PIXEL_HEIGHT); 
    ctx.fillStyle = 'black';
    ctx.fillRect(pixel.x, pixel.y, w, h);
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.rect(pixel.x, pixel.y, w, h);
    ctx.stroke();
}

function toPixel(cell) {
    return { 
        x: transformPixel(cell.x, GRID_WIDTH, GRID_PIXEL_WIDTH), 
        y: transformPixel(cell.y, GRID_HEIGHT, GRID_PIXEL_HEIGHT) 
    };
}

function toCell(pixel) {
    return { 
        x: Math.floor(transformPixel(pixel.x, GRID_PIXEL_WIDTH, GRID_WIDTH)),
        y: Math.floor(transformPixel(pixel.y, GRID_PIXEL_HEIGHT, GRID_HEIGHT))
    };
}

function transformPixel(relativeVal, relMax, realMax) {
    return relativeVal / relMax * realMax;
}

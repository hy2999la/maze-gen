let row = 41, col = 41;
let block = 10;
let grid = Array(row).fill(0).map(() => Array(col).fill(1));
let queue = [];
let lastRequestId = null;
console.table(grid);

let board = document.getElementById("board");
/** @type {CanvasRenderingContext2D} */
let context = board.getContext("2d");

board.width = row * block;
board.height = col * block;
context.scale(block, block);

function drawBoard() {
    for (let i = 0; i < col; i++) {
        for (let j = 0; j < row; j++) {
            if (grid[i][j] === 1) {
                context.fillStyle = "black";
                context.fillRect(i, j, 1, 1);
            } else {
                context.fillStyle = "white";
                context.fillRect(i, j, 1, 1);
            }
        }
    }
}

function drawPath(x, y) {
    context.fillStyle = "white";
    context.fillRect(x, y, 1, 1);
}

function gen() {
    if (lastRequestId != null) {
        cancelAnimationFrame(lastRequestId);
        queue = [];
        lastRequestId = null;
    }
    grid = Array(row).fill(0).map(() => Array(col).fill(1));
    drawBoard();
    grid[1][0] = 0;
    var but = document.getElementById("genButton");
    but.value = "Regenerate";
    createPath(1, 1);
    lastRequestId = window.requestAnimationFrame(frame);
}

//Recursive Backtracking
function createPath(x, y) {
    let direction = shuffle([[-1,0], [0,1], [1,0], [0,-1]]); //[dx, dy], each representing a movement in the x or y direction 
    for (let d in direction) {
        let dx = direction[d][0];
        let dy = direction[d][1];
        let newX = x + dx;
        let newY = y + dy;
        if (newX + dx > 0 && newX + dx < col - 1 && newY + dy > 0 && newY + dy < row - 1) {
            if (grid[newX + dx][newY + dy] != 0) {
                queue.push([newX, newY]);
                queue.push([newX+dx, newY+dy]);
                grid[newX][newY] = 0; //wall
                grid[newX + dx][newY + dy] = 0; 
                createPath(newX + dx, newY + dy);
            }
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

function shuffle(arr) {
    let temp;
    let index = arr.length;
    while (index !== 0) {
        let dir = Math.floor(Math.random() * index);
        index -= 1;
        temp = arr[index];
        arr[index] = arr[dir];
        arr[dir] = temp;
    }

    return arr;
}

let start = null;
let speed = 2;
function frame(timestamp) {
    if (!start) start = timestamp;
    var passed = timestamp - start;
    if (passed > speed) {
        start = timestamp;
        if (queue.length > 0) {
            let newCell = queue.shift();
            drawPath(newCell[0], newCell[1]);
        }
    }
    lastRequestId = window.requestAnimationFrame(frame);
}

window.onload = drawBoard();


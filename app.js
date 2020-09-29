const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const resolution = 20;
canvas.width = canvas.height = 400;

const COLS = canvas.width / resolution;
const ROWS = canvas.height / resolution;

let play = false;
var status;

function buildGrid() {
  return new Array(COLS).fill(null)
    .map(() => new Array(ROWS).fill(0));
      //.map(() => Math.floor(Math.random() * 2)));
}

let grid = buildGrid();

function loop () {
    if (play === true) {
        requestAnimationFrame(update);
    }
    //requestAnimationFrame(loop);
    if (play === false) {
        status = 'Stopped ';
    } else if (play === true) {
        status = 'Running';
    }
    render(grid);
}

setInterval(() => {
  requestAnimationFrame(loop);
}, 1000 / 10);

function update() {
  grid = nextGen(grid);
  render(grid);
}

canvas.addEventListener('click', function (event) {
    const mouse = {
        pos: { x: Math.floor((event.x - 8) / resolution), y: Math.floor((event.y - 8) / resolution) }
    }
 
    if (grid[mouse.pos.x][mouse.pos.y] === 1) {
     grid[mouse.pos.x][mouse.pos.y] = 0;
	
    } else if (grid[mouse.pos.x][mouse.pos.y] === 0) {
     grid[mouse.pos.x][mouse.pos.y] = 1;
	}
    render(grid);
});

document.addEventListener('keydown', function (e) {
    if (e.keyCode === 32) {
        if (play === true) {
            play = false;  
		} else if (play === false) {
            play = true;
		}
    } else if (e.keyCode === 39) {
        update();
    }
});

function nextGen(grid) {
  const nextGen = grid.map(arr => [...arr]);

  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      const cell = grid[col][row];
      let numNeighbours = 0;
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          if (i === 0 && j === 0) {
            continue;
          }
          const x_cell = col + i;
          const y_cell = row + j;

          if (x_cell >= 0 && y_cell >= 0 && x_cell < COLS && y_cell < ROWS) {
            const currentNeighbour = grid[col + i][row + j];
            numNeighbours += currentNeighbour;
          }
        }
      }
      if (cell === 1 && numNeighbours < 2) {
        nextGen[col][row] = 0;
      } else if (cell === 1 && numNeighbours > 3) {
        nextGen[col][row] = 0;
      } else if (cell === 0 && numNeighbours === 3) {
        nextGen[col][row] = 1;
      }
    }
  }
  return nextGen;
}

function render(grid) {
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      const cell = grid[col][row];

      ctx.beginPath();
      ctx.rect(col * resolution, row * resolution, resolution, resolution);
      ctx.fillStyle = cell ? 'black' : 'white';
      ctx.fill();
      ctx.stroke();
    }
  }
  ctx.fillStyle = '#454545';
  ctx.font = '20px Arial';
  ctx.fillText('Status: ' + status, 8, 397);
}
render(grid);
loop();
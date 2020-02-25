//https://en.wikipedia.org/wiki/A*_search_algorithm
var firstClick = true;
var secondClick = false;
function reconstruct_path (cameFrom, current, id) {
  const total_path = [current]
  while(cameFrom.has(id(current))) {
    current = cameFrom.get(id(current))
    total_path.unshift(current)
  }
  return total_path
}

// keyword astar
// A* finds a path from start to goal.
// h is the heuristic function. h(n) estimates the cost to reach goal from node n.
function A_Star(start, goal, h, neighbours, id = x=>x, d=(a,b)=>1) {
  // The set of discovered nodes that may need to be (re-)expanded.
  // Initially, only the start node is known.
  const openSet = new Map([[id(start), start]])
  // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from start to n currently known.
  const cameFrom = new Map()

  // For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
  const gScore = new Map()
  gScore.set(id(start), 0)

  // For node n, fScore[n] := gScore[n] + h(n).
  const fScore = new Map()
  fScore.set(id(start), h(start))
  let count = 0
  while (openSet.size) {
    //current := the node in openSet having the lowest fScore[] value
    let current
    let bestScore = Number.MAX_SAFE_INTEGER
    for (let [nodeId, node] of openSet) {
      const score = fScore.get(nodeId)
      if (score < bestScore) {
        bestScore = score
        current = node
      }
    }
    
    if (id(current) == id(goal)) {
      return reconstruct_path(cameFrom, current, id)
    }
    openSet.delete(id(current))
    neighbours(current).forEach(neighbor => {
      const neighborId = id(neighbor)
      // d(current,neighbor) is the weight of the edge from current to neighbor
      // tentative_gScore is the distance from start to the neighbor through current
      const tentative_gScore = gScore.get(id(current)) + d(current, neighbor)
      if (!gScore.has(neighborId) || tentative_gScore < gScore.get(neighborId)) {
        // This path to neighbor is better than any previous one. Record it!
        cameFrom.set(neighborId, current)
        gScore.set(neighborId, tentative_gScore)
        fScore.set(neighborId, gScore.get(neighborId) + h(neighbor))
        if (!openSet.has(neighborId)){
          openSet.set(neighborId, neighbor)
        }
      }
    })
  }
  // Open set is empty but goal was never reached
  return false
}

// ---- end of AStar ---
//rows and width N*N
const N = 60;



//graph
var width=N;
var height=N;
var visited = [];

const indexToPositionX = (index) => index % width;
const indexToPositionY = (index) => Math.floor(index / width);

const posToIndex = (x, y) => (y * width) + x;

function heuristic(a,b){
  let x = indexToPosition(a);
  let y = indexToPosition(b);
  return Math.abs(x.x - y.x) + Math.abs(x.y - y.y);
}

class Cell{
  constructor(index){
    this.index = index;
    this.y = indexToPositionY(index);
    this.x = indexToPositionX(index);
  }
}
var blocks = new Array(N);
const indexToPosition = (index) => ({
  x: index % width,
  y: Math.floor(index / width)
})


// Initialize
for (var i = 0; i < width*height; i++) {
  const position = indexToPosition(i)
  blocks[i] = new Cell(position.x, position.y)
}

// When cell is clicked

const container = document.getElementById("container");


function makeRows(rows, cols) {
  container.style.setProperty('--grid-rows', rows);
  container.style.setProperty('--grid-cols', cols);
  for (c = 0; c < (rows * cols); c++) {
    let cell = document.createElement("div");
     //cell.innerText = (c);
    cell.setAttribute("id",c);
    container.appendChild(cell).className = "grid-item";
 
  }
}

var nodes = [256];

function init(){
  for(let i=0; i<N*N; i++){
    nodes[i] = new Cell(i);
  } 
  
}
var obstacles = new Set();

function findDistance(a,b){
  let x1 = nodes[a].x;
  let x2 = nodes[b].x;

  let y1 = nodes[a].y;
  let y2 = nodes[b].y;

  let first = x2-x1;
  let second = y2-y1;

  let d = Math.sqrt( Math.pow(first,2) + Math.pow(second,2));
  return d;
}

makeRows(N, N);
init();

var cell = document.querySelectorAll('.grid-item');
// +++
[...obstacles].forEach(id => {
  cell[id].style.backgroundColor = 'pink'
})
function myFunction(e) {
  var elems = document.querySelector(".active");
  if(elems !==null){
   elems.classList.remove("active");
  }
}

var start = 0;
var end = 0;
var hasStart = false;
var hasEnd = false;


function checkClick(i){
  if(btnStart){
    //click starting node
    start = new Cell(i);
    hasStart = true;
    cell[start.index].style.backgroundColor = "blue";
    btnStart = false;
    myFunction();
  }
  else if(btnEnd){
    //click end goal node
    end = new Cell(i);
    hasEnd = true;
    cell[end.index].style.backgroundColor = "red";
   
    btnEnd = false;
     myFunction();
    
}else if(btnObstacles){
 
  var integer = parseInt(i,10);
  obstacles.add(integer);

  cell[i].style.backgroundColor = "black";
  myFunction();
}

}
const isOnMap = (x,y) => x >= 0 && y >= 0 && x < width && y < height;
// +++
function findNeighbors(index){
  let x = nodes[index].x;
  let y = nodes[index].y;

  let neighbors = [];
    for (let xx = -1; xx <= 1; xx++) {
    for (let yy = -1; yy <= 1; yy++) {
        if (xx == 0 && yy == 0) {
          continue; // You are not neighbor to yourself
        }
        if (Math.abs(xx) + Math.abs(yy) > 1) {
          continue;
        }
        // +++
        
        if (obstacles.has(posToIndex(x + xx, y + yy))) {
          continue
        }
        if (isOnMap(x + xx, y + yy)) {
          neighbors.push(new Cell(posToIndex(x + xx, y + yy)));
        }
      }
    }
    return neighbors;
}

var btnStart = false;
var btnObstacles = false;
var btnEnd = false;
var btnSearch = false;

function buttonStart(){
  myFunction();
   btnStart = true;
   btnObstacles = false;
   btnEnd = false;
   btnSearch = false;
   document.getElementById("start").classList.add("active");
}

function buttonEnd(){
   myFunction();
   btnStart = false;
   btnObstacles = false;
   btnEnd = true;
   btnSearch = false;
   document.getElementById("end").classList.add("active");
}

function buttonSearch(){
   myFunction();
   btnStart = false;
   btnObstacles = false;
   btnEnd = false;
   btnSearch = true;
   if(!start){
    $('#myAlertStart').show('fade');
    return;
   }else if(!end){
    $('#myAlertEnd').show('fade');
    return;
   }

   
   document.getElementById("search").classList.add("active");
   let came_from = A_Star(start, end, function (cell) {
  return heuristic(cell.index, end.index)
}, function(cell) {
  return findNeighbors(cell.index)
}, cell => cell.index)
came_from.slice(1, -1).forEach(c => {
  cell[c.index].style.backgroundColor = 'green'
})
  //remove active class search has finished
    var elems = document.querySelector(".active");
  if(elems !==null){
   elems.classList.remove("active");
  }
   
}

function buttonReset(){
  
 
  location.reload();
return false;

}


function buttonObstacles(){
  document.getElementById("obstacles").classList.add("active");
   btnStart = false;
   btnObstacles = true;
   btnEnd = false;
   btnSearch = false;

}

var cell = document.querySelectorAll('.grid-item');
for(let i=0; i<N*N; i++){
  cell[i].onclick = function(){let y = indexToPositionY(this.id); 
    let x = indexToPositionX(this.id);
    console.log(x,y);
    checkClick(this.id);

}
}


$('.grid-item').mousedown(function() {
  $('.grid-item').bind('mouseover', function(){
    if(btnObstacles){
    $(this).css({background:"black"});
    console.log(this.id);
    var integer = parseInt(this.id,10);
    obstacles.add(integer);
  }
  });
})


.mouseup(function() {
    $(".grid-item").unbind('mouseover');
  });

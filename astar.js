//rows and width N*N
const N = 16;
class PriorityQueue {
   constructor(maxSize) {
      // Set default max size if not provided
      if (isNaN(maxSize)) {
         maxSize = N*N*N*N;
       }
      this.maxSize = maxSize;
      // Init an array that'll contain the queue values.
      this.container = [];
   }
   // Helper function to display all values while developing
   display() {
      console.log(this.container);
   }
   // Checks if queue is empty
   isEmpty() {
      return this.container.length === 0;
   }
   // checks if queue is full
   isFull() {
      return this.container.length >= this.maxSize;
   }
   enqueue(data, priority) {
      // Check if Queue is full
      if (this.isFull()) {
         console.log("Queue Overflow!");
         return;
      }
      let currElem = new this.Element(data, priority);
      let addedFlag = false;
      // Since we want to add elements to end, we'll just push them.
      for (let i = 0; i < this.container.length; i++) {
         if (currElem.priority > this.container[i].priority) {
            this.container.splice(i, 0, currElem);
            addedFlag = true; break;
         }
      }
      if (!addedFlag) {
         this.container.push(currElem);
      }
   }
   dequeue() {
   // Check if empty
   if (this.isEmpty()) {
      console.log("Queue Underflow!");
      return;
   }
   return this.container.pop();
	}
	peek() {
   if (this.isEmpty()) {
      console.log("Queue Underflow!");
      return;
   }
   return this.container[this.container.length - 1];
	}
	clear() {
   this.container = [];
   }
}
// Create an inner class that we'll use to create new nodes in the queue
// Each element has some data and a priority
PriorityQueue.prototype.Element = class {
   constructor(data, priority) {
      this.data = data;
      this.priority = priority;
   }
};
//priority queue



//graph
var width=N;
var height=N;
var start = 0;
var end = 0;
var visited = [];
var obstacles = [];

const indexToPositionX = (index) => index % width;
const indexToPositionY = (index) => Math.floor(index / width);

const posToIndex = (x, y) => (y * width) + x;

const removeDuplicates = (array) => array.filter((a, b) => array.indexOf(a) === b);


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
		this.isActive = false;
		this.isStart = false;
		this.isEnd = false;
		this.isFree = true;
	}
}
var firstClick = true;
var secondClick = false;

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
    cell.innerText = (c);
    cell.setAttribute("id",c);
    container.appendChild(cell).className = "grid-item";
  }
}





function greedy(){

	frontier =  new PriorityQueue();
	frontier.enqueue(nodes[start],0);
	
	let came_from = [];
	let came_from_counter = 0;

	while(!frontier.isEmpty()){
		let current = frontier.peek();
		frontier.dequeue();
		//console.log('current ',current.data.index);

		if(current.data.index == nodes[end].index){
			//console.log('break');
			came_from[came_from_counter] = current.data.index;
			return came_from;
		}
			let neighbors = findNeighbors(current.data.index);
			for(let i=0; i< findNeighbors(current.data.index).length; i++){
				let next = neighbors.pop();
				
				
				if(!(next in came_from)){
					came_from_counter++;
					//console.log(nodes[end]);
					let priority = heuristic(nodes[end].index, next.index);
					visited.push(next.index);
				
					frontier.enqueue(next, priority);
					//console.log('next ',next);
					//console.log(i);
					came_from[came_from_counter] = current.data.index;
					
					//console.log(current);
				}
			}
			
		
	}
	return came_from;
}
var nodes = [256];
function init(){

	for(let i=0; i<N*N; i++){
		nodes[i] = new Cell(i);
	}	
	
}
const isOnMap = (x,y) => x >= 0 && y >= 0 && x < width && y < height;

//function isOnMap(x, y) {
    //return x >= 0 && y >= 0 && x < width && y < height;
//}

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
            if (isOnMap(x + xx, y + yy)) {
                neighbors.push(new Cell(posToIndex(x + xx, y + yy)));
            }
        }
    }
    return neighbors;
}
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

function checkClick(i){
	if(firstClick){
		//click starting node
		nodes[i].isStart = true;
		nodes[i].isActive = true;
		start = i;
		cell[i].style.backgroundColor = "blue";
		firstClick = false;
		secondClick = true;
	}else if(secondClick){
		//click obstacle node
		secondClick = false;
		nodes[i].isFree = false;
		obstacles.push(nodes[i]);
		var obstacle = document.getElementById(i).style.backgroundColor = 'black';
	}else{
		//click end goal node
		nodes[i].isEnd = true;
		end = i;
		nodes[i].isActive = true;
		cell[i].style.backgroundColor = "red";
		let came_from = greedy();
		came_from = removeDuplicates(came_from);
      	console.log('came_from ',came_from);		
	}
}

function timeout(i, id_list) {
  console.log("Next loop: " + i);

  document.getElementById(id_list[i]).style.backgroundColor = '#98bcf9';
  document.getElementById(end).style.backgroundColor = 'red';
  document.getElementById(start).style.backgroundColor = 'blue';

  i++;
  if (i == id_list.length) {
    console.log("End");

    return;
  } else {
    setTimeout(function(){
      return timeout(i, id_list);
    },500)
  }
}

function timeoutvisited(i, id_list) {
  console.log("Next loop: " + i);

  document.getElementById(id_list[i]).style.backgroundColor = 'yellow';
  document.getElementById(end).style.backgroundColor = 'red';
  document.getElementById(start).style.backgroundColor = 'blue';

  i++;
  if (i == id_list.length) {
    console.log("End");

    return;
  } else {
    setTimeout(function(){
      return timeoutvisited(i, id_list);
    },100)
  }
}

function animatevisited(idlist){
	setTimeout(timeoutvisited(0,idlist),100);
}
function animation(idlist){

	setTimeout(timeout(0,idlist),5000);
	
}

makeRows(N, N);
init();
var cell = document.querySelectorAll('.grid-item');
for(let i=0; i<N*N; i++){
	cell[i].onclick = function(){let y = indexToPositionY(this.id); 
		let x = indexToPositionX(this.id);
		console.log(x,y);
		checkClick(this.id);
	}
}


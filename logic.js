let board;
let score = 0;
let rows = 4;
let columns = 4;

// create function so set the gameboard
function setGame(){
	//Initialize the 4x4 game board with all tiles set to 0
	board = [
			[0,0,0,0],
			[0,0,0,0],
			[0,0,0,0],
			[0,0,0,0]
		]

	// Create the game board on the HTML
	//the first loop is to create the rows, the second loop is to create the columns
	// this is for the row
	for(let r = 0; r< rows; r++){
		// this will be the column for each row
		for(let c = 0; c < columns; c++){

			// Create a div element representiong tiles
			// Think of this as making small box for each cell on the board.
			let tile = document.createElement("div");

			tile.id = r.toString() + "-" + c.toString();

			let num = board[r][c]

			updateTile(tile, num);

			// Append the tile to the game board container
			//This means placing the tile inside the grid, in the right column and right row
			//document.getElementById("board") - is targetting the div from the HTML file
			document.getElementById("board").append(tile);
		}
	}

	// To randomly add 2 tiles at the start of the game
	setTwo();
	setTwo();
}

// Function to update the appearnce of the tile based on its number/value
function updateTile(tile, num){
	// clear the tile
	tile.innerText = "";

	tile.classList.value = "";

	// CSS class named tile is added to the classlist of the time, this will be for styling the tiles
	tile.classList.value = "tile";

	if(num > 0){
		// set the tile's text to the number based on the num value
		tile.innerText = num.toString();

		if(num <= 4096){
			tile.classList.add("x"+num.toString());
		}else{
			tile.classList.add("x8192");
		}

	}
}

// Event that triggers when the web page finishes loading.
window.onload = function(){
	setGame();
}


//function that handle the user's keyboard input when they are press certain arrowkeys
// e represents the event object, which contains information about the event occured
function handleSlide(e){
	/*console.log(e.code);*/

	if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "KeyW", "KeyA", "KeyS", "KeyD"].includes(e.code)){
		// prevents default behavior on keydown
		e.preventDefault();

		if(e.code == "ArrowLeft" && canMoveLeft()){
			slideLeft();
			setTwo();
		}else if(e.code == "ArrowRight" && canMoveRight()){
			slideRight();
			setTwo();
		}else if(e.code == "ArrowUp" && canMoveUp()){
			slideUp();
			setTwo();
			
		}else if(e.code == "ArrowDown" && canMoveDown()){
			slideDown();
			setTwo();
			
		}

		// Update score
		document.getElementById("score").innerText = score;

		checkWin();

		if(hasLost()){
			// setTimeout to delay alert
			setTimeout(()=>{
				alert("Game Over! You have lost the game. Game will restart!");
				alert("Click any arrow key to restart.")
				restartGame();
			}, 50)
		}

	}



}

// when any key is pressed, the handleslide function is called to handle the key press
document.addEventListener("keydown", handleSlide);

function slideLeft(){
	// console.log("You pressed Left!");
	// Iterate through each row
	for(let r=0 ; r < rows; r++){
		let row = board[r]

		let originalRow = row.slice() //store the original row contents in a new variable.

		row = slide(row); //calling the slide function



		board[r] = row; //update the value in the array

		// Update the id of the tile
		// For each tile in the row, the code finds the corresponding HTML element by Its

		for(let c = 0; c< columns; c++){
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile, num);

			// Line for the animation
			if(originalRow[c] !== num && num !== 0){
				tile.style.animation = "slide-from-right 0.3s"

				setTimeout(()=> {
					tile.style.animation = "";
				}, 300)
			}

		}
	}
}

function slideRight(){
	// Iterate through each row
	for(let r = 0; r < rows; r++){
		// [4, 0, 4, 0] => [0, 0, 0, 8]
		let row = board[r];

		let originalRow = row.slice()
		// reverses the order of elements in the row, effectively making the tiles slide to the right as if the board was mirrored
		// [0, 4, 0, 4]
		row.reverse() //reverse the array

		//[8, 0, 0, 0]
		row = slide(row);

		//[0, 0, 0, 8]
		row.reverse();
		board[r] = row;

		for(let c = 0; c< columns; c++){
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile, num);

			// Line for animation
			if(originalRow[c] !== num && num !==0){
				tile.style.animation = "slide-from-left 0.3s"
				setTimeout(()=>{
					tile.style.animation = "";
				}, 300)
			}
		}
	}
}

function slideUp(){
	for(let c = 0; c < columns; c++){
		// [2,2,8,0];
		let column = [board[0][c], board[1][c], board[2][c], board[3][c]];

		let originalColumn = column.slice();
		// First iteration
		// column = [board[0][0], board[1][0], board[2][0], board[3][0]];
		// Second iteration
		//column = [board[0][1], board[1][1], board[2][1], board[3][1]];

		// [4,8,0,0]
		column = slide(column);

		let changedIndices = [];
		for(let r = 0 ; r < rows ; r++){
			if(originalColumn[r] !== column[r]){
				changedIndices.push(r);
			}
		}

		// Update the id of the tile
		for(let r = 0; r< rows; r++){
			board[r][c] = column[r];

			// 1st iteration:
			// board[0][0] = column[0] = 4
			// 2nd iteration:
			// board[1][0] = column[1] = 8
			let tile = document.getElementById(r.toString()+ "-"+c.toString());
			let num = board[r][c];
			updateTile(tile, num);

			// Line for animation
			if(changedIndices.includes(r) && num !== 0){
				tile.style.animation = "slide-from-bottom 0.3s";
				setTimeout(() =>{
					tile.style.animation = "";
				}, 300)
			}
		}

	}
}

function slideDown(){
	for(let c = 0; c < columns; c++){
		let column = [board[0][c], board[1][c], board[2][c], board[3][c]];

		let originalColumn = column.slice(); //we contaion the original array in a new variable.


		column.reverse();
		column = slide(column);
		column.reverse();

		let changedIndices = [];
		for(let r = 0; r< rows ; r++){
			if(originalColumn[r] !==column[r]){
				changedIndices.push(r);
			}
		}

		// Update the id of the tile
		for(let r = 0; r< rows; r++){
			board[r][c] = column[r];

			// 1st iteration:
			// board[0][0] = column[0] = 4
			// 2nd iteration:
			// board[1][0] = column[1] = 8
			let tile = document.getElementById(r.toString()+ "-"+c.toString());
			let num = board[r][c];
			updateTile(tile, num);

			// Line animation
			if(changedIndices.includes(r) && num !== 0){
				tile.style.animation = "slide-from-top 0.3s";
				setTimeout(()=>{
					tile.style.animation = "";
				}, 300)
			}
		}

	}
}

// [2,0,0,2] => [2,2]
//[4,2,0,2] => [4,2,2]

function filterZero(row){
	return row.filter(num => num != 0);
}

// [2, 0, 0, 2] => [2,2]  => [4, 0, 0, 0]
//[4,2, 0, 2] => [4, 2, 2] =>[4, 4, 0, 0]

// [2, 2, 4, 0]
function slide(row){
	row = filterZero(row); //[2, 2, 4] = 3, 2
	// Iterate through the row to check for adjacent equal numbers
	for(let i = 0; i < row.length -1 ; i ++){
		
		if(row[i] == row[i+1]){
			row[i] *= 2;

			row[i+1] = 0;
			// [4,0,4];

			// for the monitoring of the score
			score += row[i]
		}
	}
	row = filterZero(row); //[4,4] => [4,4,0,0]
	// adding the zeroes back
	while(row.length < columns){
		row.push(0)
	}//[4, 4, 0, 0]

	return row;
}

// this function will check whether the board has empty tile or none
// boolean value
function hasEmptyTile(){
	for(let r = 0; r < rows; r++){
		for(let c = 0; c < columns; c++){
			if(board[r][c] == 0){
				return true;
			}
		}
	}

	//return false if no tile == 0;
	return false;
}

function setTwo(){
	// Check the hasEmptyTile boolean result, if hasEmptyTile == False, the setTwo will not proceed.
	if(!hasEmptyTile()){
		return;
	}

	let found = false;

	while(!found){
		let r = Math.floor(Math.random() * rows);
		let c = Math.floor(Math.random() * columns);

		if(board[r][c] == 0){
			board[r][c] = 2;

			let tile = document.getElementById(r.toString()+ "-" +c.toString());
			tile.innerText = 2;

			tile.classList.add("x2");

			// Set the found variable to true to break the loop
			found = true;

		}

	}
}


let is2048Exist = false;
let is4096Exist = false;
let is8192Exist =false;

// Create a function to check if the user has the 2048 tile
function checkWin(){
	for(let r=0; r < rows; r++){
		for( let c = 0; c < columns; c++){

			if(board[r][c] == 2048 && is2048Exist == false){
				alert('You win! You got the 2048!')
				is2048Exist = true;
			}else if(board[r][c] == 4096 && is4096Exist ==false){
				alert("You are unstoppable at 4096! You are fanstastically unstopable!");
				is4096Exist = true;
			}else if(board[r][c] == 8192 && is8192Exist ==false){
				alert("Victory! You have reached 8192! You are incredibly awesome!")
				is8192Exist = true;
			}

		}
	}
}

// Create a function to check if the user lost the game
// boolean value
function hasLost(){
	for(let r = 0; r< rows; r++){
		for(let c = 0; c< columns; c++){
			if(board[r][c] === 0){
				return false;
			}

			const currentTile = board[r][c];

			// Check adjacent cells (up, down, left, right) for possible merging

			if( r > 0 && currentTile === board[r-1][c] || 
				r < rows -1 && currentTile === board[r+1][c] || 
				c > 0 && currentTile === board[r][c-1] || 
				c < columns - 1 && currentTile === board[r][c+1]){

				return false;
			}

		}
	}

	// No possible moves left or empty tile, user has lost
	return true;
}

// create a function that will restart the game

function restartGame(){
	for(let r = 0; r < rows; r++){
		for(let c = 0; c < columns; c++){
			board[r][c] = 0;
		}
	}

	score = 0; //to reset the score to 0
	setTwo(); //new tile
}

// function that will check if we can move going to the left
function canMoveLeft(){
	// It goes through each row of the grid, one by one it checks whether there is a possible move left.
	for(let r = 0; r < rows ; r++){
		for( let c= 0; c < columns; c++){
			if(board[r][c]!==0){
				if(board[r][c-1] === 0 || board[r][c-1] === board[r][c]){
					return true;
				}
			}
		}
	}

	return false;
}

// Check if there are available merging moves or empty tile in the right direction
function canMoveRight(){
	for(let r = 0; r < rows ; r++){
		for( let c= columns -2 ; c >= 0; c--){
			if(board[r][c]!==0){
				if(board[r][c+1] === 0 || board[r][c+1] === board[r][c]){
					return true;
				}
			}
		}
	}

	return false;
}

//check if there are avaible merging moves or empty tile in the upward direction
function canMoveUp(){
	for(let c = 0; c < columns ; c++){
		for(let r = 1; r < rows; r++){
			if(board[r][c] !== 0){
				if(board[r-1][c] === 0 || board[r-1][c] === board[r][c]){
					return true;
				}
			}
		}
	}
	return false;
}

// Check if there are available merging moves in the downward direction
function canMoveDown(){
	for(let c=0 ; c < columns ; c++){
		for( let r = rows -2 ; r >= 0; r--){
			if(board[r][c] !== 0){
				if(board[r+1][c] === 0 || board[r+1][c] === board[r][c]){
					return true;
				}
			}
		}
	}
	return false;
}

// Declaring variable used for touch input
let startX = 0;
let startY = 0;

document.addEventListener('touchstart', (e) => {
	startX = e.touches[0].clientX;
	startY = e.touches[0].clientY;
})

document.addEventListener('touchmove', (e) => {
	if(!e.target.className.includes("tile")){
		return
	}

	e.preventDefault();
}, {passive: false});

document.addEventListener('touchend', (e) => {
	if(!e.target.className.includes("tile")){
		return;
	}

	let diffX = startX - e.changedTouches[0].clientX;
	let diffY = startY - e.changedTouches[0].clientY;

	// We are going to check the direction whether it is in respect of x-axis or y-axis
	if(Math.abs(diffX) > Math.abs(diffY)){
		// Horizontal Swipe
		if(diffX > 0 && canMoveLeft()){
			slideLeft();
			setTwo();
		} else if(diffX < 0 && canMoveRight()){
			slideRight();
			setTwo();
		}
	} else {
		if(diffY > 0 && canMoveUp()){
			slideUp();
			setTwo();
		} else if(diffY < 0 && canMoveDown()){
			slideDown();
			setTwo();
		}
	}

	document.getElementById("score").innerText = score;

	checkWin();

	if(hasLost()){
		setTimeout(() => {
			alert("Game Over! You have lost the game. Game will restart");
			restartGame();
			alert("Click any key to restart");
		}, 100); 
	}
})
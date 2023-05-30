//-------------------------------------------------* Global Variables *---------------------------------------------------------//

// Start/Reset Game Button.
const $startButton = $('#start');
// Jeopardy Gameboard.
const $jeopardyBoard = $('#jeopardy');
// Spinning Icon Below Start Button Beofore Gameboard Appears.
const $spinnerContainer = $('#spin-container');
// Empty Array. Category Id's Pushed Here From "getRandomCategoryIds" Function.
let categories = [];

//------------------------------------------/* Create Jepardy Gameboard With API Data. */-------------------------------------------------//

// "Click" Event listener On "Start!" / "Restart Game!" Button.
$startButton.on('click', async function setupAndStart (event) {
  event.preventDefault();
  const getCategories = await axios.get('http://jservice.io/api/categories?count=6');

  for (let data of getCategories.data) {
    const getQuestions = await axios.get('https://jservice.io/api/clues?count=5'); //+ categoryId
    //const categoryId = data.id 
    //console.log(getQuestions);
    categories.push(getQuestions);
  }
  
  randomCategoryIds(categories);
  hideLoadingView();
  console.log(categories);
});

//---------------------------------------------/* Shuffle Category Id Numbers */--------------------------------------------------//
//-------------------------------------------/* (Fisher-Yates Shuffle Algorithm) */----------------------------------------------//

// Function Shuffling Category Id Numbers. 
function randomCategoryIds(categories) {
  let currentIndex = categories.length,  randomIndex;
  // While More Than One Category Id Number Exists In Array, Do The Following...
  while (currentIndex != 0) {
    // Generate Random Number Between 0 and 1, and Then Multiply It By Current Index.
    randomIndex = Math.floor(Math.random() * currentIndex);
    // Decrement Current Index One Position With Each Pass Of While Loop. 
    currentIndex--;
    // Take Current Category Index Value and Swap It With Random Category Index Value.
    [categories[currentIndex], categories[randomIndex]] = [
      categories[randomIndex], categories[currentIndex]];
  }
  // Return Category Array With Shuffled Values.
  return categories;
}

//-------------------------------------------------/* Get Category Id */-----------------------------------------------------------------//


function getCategory(categoryId) {

}

//-----------------------------------------/* Fill The Jeopardy Gameboard Table */-------------------------------------------------------//

async function fillTable() {

    //$jeopardyBoard.append(firstSixCategoryTitles);
    //$jeopardyBoard.append(firstFiveQuestions);

}

//----------------------------------------/* Clicking On Jeopardy Gameboard Cell */------------------------------------------------------//
/*

.on('click', function handleClick(event) {
  //Conditional Statement to Check If Question Mark, Question, or Question Answer Are Present In Gameboard Cell.
  if (event.target === null) {
    // Show Question Mark Only. Hide Question Answer and Question.
    questionMark.show();
    question.hide();
    questionAnswer.hide();
  } else if (event.target === questionMark) {
    // Show Question Only. Hide Question Answer and Question Mark.
    question.show();
    questionMark.hide();
    questionAnswer.hide();
    // Show Question Answer Only. Hide Question and Question Mark.
  } else {
    questionAnswer.show();
    question.hide();
    questionMark.hide();
  }

}); 

*/
//------------------------------------------------/* Show Game Loading View */------------------------------------------------------------//


// Add Loading Spinner. Update Start/Reset Button. Reset Jeopardy Game Data.
function showLoadingView() {
  // Empty Data Contents From Jeopardy Board.
  $jeopardyBoard.empty()
  // Show Spinning Wheel.
  $spinnerContainer.show();
  // Change Button Text to "Start!".
  $startButton.html("Start!");
  // "Click" Event Listener to Start New Jeopardy Game.
  $startButton.on('click', function (event) {
    event.preventDefault();
    setupAndStart();
  });

}

//------------------------------------------------/* Hide Game Loading View */------------------------------------------------------------//


// Remove Loading Spinner. Update Start/Reset Button. Reset Jeopardy Game Data.
function hideLoadingView() {
  // Hide Spinning Wheel.
  $spinnerContainer.hide();
  // Change Button Text to "Restart Game!".
  $startButton.html("Restart Game!");
  // "Click" Event Listener to Restart New Jeopardy Game.
  $startButton.on('click', function (event) {
    event.preventDefault();
    setupAndStart();
  });

}

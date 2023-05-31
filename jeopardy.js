//-------------------------------------------------* Global Variables *---------------------------------------------------------//

// Start/Reset Game Button.
const $startButton = $('#start');
// Jeopardy Gameboard.
const $jeopardyBoard = $('#jeopardy');
// Spinning Icon Below Start Button Beofore Gameboard Appears.
const $spinnerContainer = $('#spin-container');
// Empty Array. Category Id's Pushed Here From "getRandomCategoryIds" Function.
let categoriesGlobal = [];
//Shuffle Function.
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i


    [array[i], array[j]] = [array[j], array[i]];
  }
}


//let questions = { title: [{ answer: 42, question: 'What are you?' }] };
let questions = {};

async function getCategory(id) {
  const response = await axios.get('http://jservice.io/api/category?id=' + id);
  return {
    title: response.data.title,
    questions: getFiveQuestions(response.data.clues.map(clue => ({ text: clue.question, answer: clue.answer })))
  }
}

function getFiveQuestions(array) {
  let arrayCopy = [...array];
  shuffle(arrayCopy);
  return arrayCopy.slice(0, 5);
}

//------------------------------------------/* Create Jepardy Gameboard With API Data. */-------------------------------------------------//
function selectSixRandomCategories(array) {
  let arrayCopy = [...array];
  shuffle(arrayCopy);
  return arrayCopy.slice(0, 6);
}

// "Click" Event listener On "Start!" / "Restart Game!" Button.
async function setupJeopardyGame (event) {
  //Get Categories from API.
  // cleanup
  $('#jeopardy thead').html('')
  $('#jeopardy tbody').html('')
  categoriesGlobal = []
  questions = {}

  const getCategories = await axios.get('http://jservice.io/api/categories?count=100');
  console.log('getCategories',getCategories);
  let categories = selectSixRandomCategories(getCategories.data);
  //Loop Over "getCategories" Data Retrieved from API To Get Five Questions For Each Category. 
  /*for (let data of getCategories.data) {
    //Get Questions from API.
    const getQuestions = await axios.get('https://jservice.io/api/clues?count=5'); //+ categoryId
    console.log(getQuestions);
    //const categoryId = data.id
    categories.push(getCategories);
  }*/
  //randomCategoryIds(categories);
  
  for (let cat of categories) {
    let category = await getCategory(cat.id);
    console.log(category);
    questions[category.title] = category.questions
  }
  fillTable(categories);
  hideLoadingView();

}
$startButton.on('click', setupJeopardyGame);

//---------------------------------------------/* Shuffle Category Id Numbers */--------------------------------------------------//
//-------------------------------------------/* (Fisher-Yates Shuffle Algorithm) */----------------------------------------------//

// Function Shuffling Category Id Numbers. 
function randomCategoryIds(categories) {
  let currentIndex = categories.length, randomIndex;
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


//function getCategory(categoryId) {

//}

//-----------------------------------------/* Fill The Jeopardy Gameboard Table */-------------------------------------------------------//

function createCategories(categories) {
  let trEL = $('<tr>').html(`
  <th>${categories[0].title}</th>
  <th>${categories[1].title}</th>
  <th>${categories[2].title}</th>
  <th>${categories[3].title}</th>
  <th>${categories[4].title}</th>
  <th>${categories[5].title}</th>
  `);
  $('#jeopardy thead').append(trEL);
}
// '?' 'Q' 'A'
const NUMBER_OF_QUESTIONS = 5
const NUMBER_OF_CATEGORIES = 6

function createQuestions() {
  for (let questionIndex = 0; questionIndex < NUMBER_OF_QUESTIONS; questionIndex++) {
    let row = $('<tr>');
    for (let categoryIndex = 0; categoryIndex < NUMBER_OF_CATEGORIES; categoryIndex++) {
      let box = $('<td>').attr('id', `?`).text('?');
      $(box).on('click', function () {
     
       
        // ? - not open, Q = we see the question, A = we see the answer
        let boxState = $(box).attr('id')

        let category = categoriesGlobal[categoryIndex].title
        let question = questions[category][questionIndex]
        
        if (boxState === "?") {
          $(box).html(question.text)
          let oldId = $(box).attr('id')
          let newId = oldId.slice(0, -1)
          newId = newId + "Q"
          $(box).attr('id',newId)
        } else if (boxState === "Q") {
          $(box).html(question.answer)
          let oldId = $(box).attr('id')
          let newId = oldId.slice(0, -1)
          newId = newId + "A"
          $(box).attr('id',newId)
        } else if (boxState === "A") {
          return
        }

      })
      row.append(box);
    }
    $('#jeopardy tbody').append(row);
  }
}

function fillTable(categories) {

  createCategories(categories);
  createQuestions();


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
  
}

//------------------------------------------------/* Hide Game Loading View */------------------------------------------------------------//


// Remove Loading Spinner. Update Start/Reset Button. Reset Jeopardy Game Data.
function hideLoadingView() {
  // Hide Spinning Wheel.
  $spinnerContainer.hide();
  // Change Button Text to "Restart Game!".
  $startButton.html("Restart Game!");
  // "Click" Event Listener to Restart New Jeopardy Game.
  // $startButton.on('click', function (event) {
  //   event.preventDefault();
  //   setupJeopardyGame();
  // });

}

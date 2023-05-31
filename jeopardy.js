//-------------------------------------------------* Global Items *---------------------------------------------------------//

// Start/Reset Game Button.
const $startButton = $('#start');
// Jeopardy Gameboard.
const $jeopardyBoard = $('#jeopardy');
// Spinning Icon Below Start Button Beofore Gameboard Appears.
const $spinnerContainer = $('#spin-container');
// Empty Array. Categories put here. 
let categoriesGlobal = [];
// Empty Object. Questions put here.
let questions = {};
//Shuffle Array Function.
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    [array[i], array[j]] = [array[j], array[i]];
  }
}
// Get Category Information From API. 
async function getCategory(id) {
  const response = await axios.get('http://jservice.io/api/category?id=' + id);
  return {
    title: response.data.title,
    questions: getFiveQuestions(response.data.clues.map(clue => ({ text: clue.question, answer: clue.answer })))
  }
}
// Get Five Questions Function.
function getFiveQuestions(array) {
  let arrayCopy = [...array];
  shuffle(arrayCopy);
  return arrayCopy.slice(0, 5);
}
// Get Six Categories Function.
function selectSixRandomCategories(array) {
  let arrayCopy = [...array];
  shuffle(arrayCopy);
  return arrayCopy.slice(0, 6);
}

//--------------------------------------------/* Create Jeopardy Gameboard */-------------------------------------------------------------//

// Setup Jeopardy Game Function.
async function setupJeopardyGame (event) {
  // Clear Old Jeopardy Game Prior to Setting Up New Game.
  // Clear Table Head.
  $('#jeopardy thead').html('')
  // Clear Table Body. 
  $('#jeopardy tbody').html('')
  // Empty "categoriesGlobal" Array
  categoriesGlobal = []
  // Empty "questions" Object.
  questions = {}

  //Get Categories from API.
  const getCategories = await axios.get('http://jservice.io/api/categories?count=100');
  let categories = selectSixRandomCategories(getCategories.data);
  categoriesGlobal = categories
  for (let cat of categories) {
    let category = await getCategory(cat.id);
    questions[category.title] = category.questions
  }
  fillTable(categories);
  //Hide Loading View: Remove Spinner and Change Start Button Text. 
  hideLoadingView();
}
//'Click' Event listener On 'Start!' Button.
$startButton.on('click', setupJeopardyGame);

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

const NUMBER_OF_QUESTIONS = 5
const NUMBER_OF_CATEGORIES = 6

function createQuestions() {
  for (let questionIndex = 0; questionIndex < NUMBER_OF_QUESTIONS; questionIndex++) {
    let row = $('<tr>');
    for (let categoryIndex = 0; categoryIndex < NUMBER_OF_CATEGORIES; categoryIndex++) {
      let box = $('<td>').attr('id', `?`).text('?');
      //'Click' Event Listener On Game Squares.
      $(box).on('click', function () {
        let boxState = $(box).attr('id')
        let category = categoriesGlobal[categoryIndex].title
        let question = questions[category][questionIndex]
        //If Game Box Not Clicked On It Will Show Question Mark.
        if (boxState === "?") {
          $(box).html(question.text)
          let oldId = $(box).attr('id')
          let newId = oldId.slice(0, -1)
          newId = newId + "Q"
          $(box).attr('id',newId)
        //If Game Box Clicked On It Will Show Question.
        } else if (boxState === "Q") {
          $(box).html(question.answer)
          let oldId = $(box).attr('id')
          let newId = oldId.slice(0, -1)
          newId = newId + "A"
          $(box).attr('id',newId)
        //If Game Box Clicked On Second Time It Will Show Question Answer.
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

//------------------------------------------------/* Show Game Loading View */------------------------------------------------------------//

// Add Loading Spinner. Update Start/Reset Button. Reset Jeopardy Game Data.
function showLoadingView() {
  // Empty Data Contents From Jeopardy Board.
  $jeopardyBoard.empty()
  // Show Spinning Wheel.
  $spinnerContainer.show();
  // Change Button Text to "Start!".
  $startButton.html("Start!");
}

//------------------------------------------------/* Hide Game Loading View */------------------------------------------------------------//

// Remove Loading Spinner. Update Start/Reset Button. Reset Jeopardy Game Data.
function hideLoadingView() {
  // Hide Spinning Wheel.
  $spinnerContainer.hide();
  // Change Button Text to "Restart Game!".
  $startButton.html("Restart Game!");
}
// Variables
var sentenceCont = document.querySelector("#sentence-container");
var gradeOptions = [
  document.querySelector("#option1"),
  document.querySelector("#option2"),
  document.querySelector("#option3"),
];
var playButton = document.querySelector("#play");
var timer = document.querySelector("#timer");
var typer = document.querySelector("#typer");
var time = 60;
var sentenceGrade;
var sentence;
var scoreCont = document.querySelector("#score");

// Initially load grade 1 text
get_text(1);

// Generate text depending on grade selected
gradeOptions[0].addEventListener("click", () => get_text(1));
gradeOptions[1].addEventListener("click", () => get_text(2));
gradeOptions[2].addEventListener("click", () => get_text(3));

// Game function
playButton.addEventListener("click", (e) => {
  if (e.target.disabled == true) {
    return;
  }
  // Disable button when playing, enable text area and focus on it
  e.target.disabled = true;
  e.target.className = "btn btn-secondary mt-3 btn-block";
  e.target.textContent = "Playing ...";
  sentenceCont.classList.remove("blur");
  scoreCont.textConent = "";
  typer.value = "";
  typer.disabled = false;
  typer.focus();

  // Matching user typing with sentence
  typer.addEventListener("input", (e) => {
    var checkedText = "";
    var current = e.target.value;
    for (var i = 0; i < current.length; i++) {
      if (current[i] == sentence[i]) {
        checkedText += `<span class="correct">${sentence[i]}</span>`;
      } else {
        checkedText += `<span class="wrong">${sentence[i]}</span>`;
      }
    }
    checkedText += sentence.substring(current.length, sentence.length);
    sentenceCont.innerHTML = checkedText;
  });

  var timerFunc = setInterval(() => {
    time -= 1;
    timer.textContent = time;

    if (time == 0) {
      clearInterval(timerFunc);
      // Count the score
      sentenceScore = get_score(typer.value, sentence, sentenceGrade);
      scoreCont.textContent = `Score: ${sentenceScore}`;

      // Send the score to server
      let csrftoken = getCookie("csrftoken");
      fetch("/submit/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify({
          score: sentenceScore,
          grade: sentenceGrade,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        });

      // Enable button when done, disable textarea and reset variables
      e.target.disabled = false;
      e.target.className = "btn btn-primary mt-3 btn-block";
      e.target.textContent = "Play";
      get_text(sentenceGrade);
      sentenceCont.classList.add("blur");
      typer.disabled = true;
      time = 60;
      timer.textContent = 60;
    }
  }, 1000);
});

// If admin
if (document.querySelector("#new-sentence")) {
  var new_textarea = document.querySelector("#new-sentence");
  var new_charcount = document.querySelector("#new-char-count");
  var new_grade = document.querySelector("#new-sentence-level");
  var new_submit = document.querySelector("#new-submit");
  var new_value = document.querySelector("#new-level-value");

  var charcount;
  new_textarea.addEventListener("input", (e) => {
    charcount = e.target.value.length;
    new_charcount.textContent = charcount;
    if (charcount >= 200) {
      e.target.classList.add("valid");
      new_submit.disabled = false;
      let gradeLevel = grade(e.target.value);
      new_grade.textContent = gradeLevel;
      new_value.value = gradeLevel;
    } else {
      e.target.classList.remove("valid");
      new_submit.disabled = true;
      new_grade.textContent = "?";
      new_value.value = "";
    }
  });
}

// Function for grading a text
function grade(text) {
  // Formula: 0.0588 * L - 0.296 * S - 15.8
  // L is the average number of letters per 100 words in the text
  // S is the average number of sentences per 100 words in the text

  // Count letter
  var letter_count = text.replace(/[^A-Z0-9]/gi, "").length;

  // Count word
  var word_count = text.split(" ").length;

  // Count sentence
  var sentence = text.replace(/[&!?]/g, ".");
  while (sentence[sentence.length - 1] == ".") {
    sentence = sentence.slice(0, -1);
  }
  var sentence_count = sentence.split(".").length;

  var L = (letter_count / word_count) * 100;
  var S = (sentence_count / word_count) * 100;
  index = Math.round(0.0588 * L - 0.296 * S - 15.8);

  if (index <= 6) {
    return 1;
  } else if (index <= 10) {
    return 2;
  } else {
    return 3;
  }
}

// Function for getting text

function get_text(grade) {
  fetch(`/generate_text/${grade}/`, {
    headers: {
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      sentenceCont.textContent = data.sentence;
      sentence = data.sentence;
      sentenceGrade = grade;
    });
}

// Function for determining user's score
function get_score(text, ref, grade) {
  // Speed of typing (char per minute) is equal to the length
  var cpm = text.length;

  // Accuracy of typed text
  var correct = text.length;
  for (var i = 0; i < cpm; i++) {
    if (ref[i] != text[i]) {
      correct--;
    }
  }
  var accuracy = correct / text.length;

  // Calculate score (grade * cpm * accuracy)
  var score = Math.round(parseInt(grade) * cpm * accuracy);

  return score;
}

// Funtion to get csrf token for post request
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

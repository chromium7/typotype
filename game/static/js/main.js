// If admin
console.log("sanity check");

// Initially load grade 1 text
get_text(1);

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

function get_text(grade) {
  fetch(`/generate_text/${grade}/`, {
    headers: {
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      document.querySelector("#sentence-container").textContent = data.sentence;
    });
}

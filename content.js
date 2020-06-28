// regex to look for in the logs
const playCard = new RegExp("(plays|discards)\\s*(?:a|their)?\\s*([a-zA-Z]*)");
const resetMessage = "new round begins";

// Listen for messages
chrome.runtime.onMessage.addListener(generateCount);

var isExpansion = document
  .getElementById("ll_background")
  .classList.contains("expansion");

if (isExpansion) {
  // expansion cards
  roles = [
    { name: "Jester", global: 1, current: 1, value: 0 },
    { name: "Assassin", global: 1, current: 1, value: 0 },
    { name: "Guard", global: 8, current: 8, value: 1 },
    { name: "Priest", global: 2, current: 2, value: 2 },
    { name: "Cardinal", global: 2, current: 2, value: 2 },
    { name: "Baron", global: 2, current: 2, value: 3 },
    { name: "Baroness", global: 2, current: 2, value: 3 },
    { name: "Handmaid", global: 2, current: 2, value: 4 },
    { name: "Sycophant", global: 2, current: 2, value: 4 },
    { name: "Prince", global: 2, current: 2, value: 5 },
    { name: "Count", global: 2, current: 2, value: 5 },
    { name: "King", global: 1, current: 1, value: 6 },
    { name: "Constable", global: 1, current: 1, value: 6 },
    { name: "Countess", global: 1, current: 1, value: 7 },
    { name: "Dowager", global: 1, current: 1, value: 7 },
    { name: "Princess", global: 1, current: 1, value: 8 },
    { name: "Bishop", global: 1, current: 1, value: 9 }
  ];
} else {
  roles = [
    { name: "Guard", global: 5, current: 5, value: 1 },
    { name: "Priest", global: 2, current: 2, value: 2 },
    { name: "Baron", global: 2, current: 2, value: 3 },
    { name: "Handmaid", global: 2, current: 2, value: 4 },
    { name: "Prince", global: 2, current: 2, value: 5 },
    { name: "King", global: 1, current: 1, value: 6 },
    { name: "Countess", global: 1, current: 1, value: 7 },
    { name: "Princess", global: 1, current: 1, value: 8 },
  ];
}

/**
 * Find the current count of each role by reading the logs and display the result
 */
function generateCount(request) {
  if (request.message === "generate count") {
    let logs = document.getElementById("logs");
    if (logs != null) {
      var innerDivs = logs.getElementsByClassName("roundedbox");
      for (var i = innerDivs.length - 1; i >= 0; i--) {
        var log = innerDivs[i].textContent;
        if (log.indexOf(resetMessage) != -1) {
          // saw the reset message (a new round has begun)
          console.log("resetting");
          reset();
          continue;
        }
        var matches = log.match(playCard);
        if (matches != null) {
          // a card was played, remove it from the count
          removeCard(matches[2]);
        }
      }
      display();
      reset();
    }
  }
}

/**
 * The round has finished, reset all the counts
 */
function reset() {
  roles.map((element) => {
    element.current = element.global;
  });
}

/**
 * The card that is passed in has been played so reduce its count
 */
function removeCard(card) {
  var element = roles.find((elem) => elem.name === card);
  if (element != null) {
    element.current--;
  }
}

/**
 * Show how many of each character is left in an alert
 */
function display() {
  var results = roles.map(
    (element) => "(" + element.value + ") " + element.name + ": " + element.current + "\n"
  );
  alert(results.join(""));
}

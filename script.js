const RANDOM_SENTENCE_URL_API = "https://api.quotable.io/random";
const typeDisplayElement = document.getElementById("typeDisplay");
const typeInputElement = document.getElementById("typeInput");
const timer = document.getElementById("timer");

const typeSound = new Audio("./audio/typing-sound.mp3");
const wrongSound = new Audio("./audio/wrong.mp3");
const correctSound = new Audio("./audio/correct.mp3");

typeInputElement.addEventListener("input", () => {
  typeSound.play();
  typeSound.currentTime = 0;

  const sentence = typeDisplayElement.querySelectorAll("span");
  const arrayValue = typeInputElement.value.split("");
  let correct = true;
  sentence.forEach((characterSpan, index) => {
    if (arrayValue[index] == null) {
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      correct = false;
    } else if (characterSpan.innerText == arrayValue[index]) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
    } else {
      characterSpan.classList.add("incorrect");
      characterSpan.classList.remove("correct");
      correct = false;
      wrongSound.volume = 0.3;
      wrongSound.play();
      wrongSound.currentTime = 0;
    }
  });

  if (correct) {
    correctSound.play();
    correctSound.currentTime = 0;
    RenderNextSentence();
  }
});

function GetRandomSentence() {
  return fetch(RANDOM_SENTENCE_URL_API)
    .then((response) => response.json())
    .then(
      (data) =>
        data.content
    );
}

async function RenderNextSentence() {
  const sentence = await GetRandomSentence();
  console.log(sentence);

  typeDisplayElement.innerText = "";
  sentence.split("").forEach((character) => {
    const characterSpan = document.createElement("span");
    characterSpan.innerText = character;
    typeDisplayElement.appendChild(characterSpan);
    console.log(characterSpan);
  });
  typeInputElement.value = null;

  StartTimer();
}

let startTime;
let originTime = 30;
function StartTimer() {
  timer.innerText = originTime;
  startTime = new Date();
  console.log(startTime);
  setInterval(() => {
    timer.innerText = originTime - getTimerTime();
    if (timer.innerText <= 0) TimeUp();
  }, 1000);
}

function getTimerTime() {
  return Math.floor(
    (new Date() - startTime) / 1000
  );
}

function TimeUp() {
  console.log("next sentence");
  RenderNextSentence();
}

RenderNextSentence();
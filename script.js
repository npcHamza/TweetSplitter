function copyToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
}

function createMessageElement() {
  var messageDiv = document.createElement("div");
  messageDiv.id = "message";
  messageDiv.className = "message";
  return messageDiv;
}

function showMessage(message, event) {
  var messageElement = createMessageElement();
  messageElement.textContent = message;

  messageElement.style.position = "absolute";
  messageElement.style.left = event.clientX + "px";
  messageElement.style.top = event.clientY + 20 + "px";

  document.body.appendChild(messageElement);

  setTimeout(function () {
    document.body.removeChild(messageElement);
  }, 2000);
}

function updateTweetOutput(tweetInput) {
  var tweetChunks = splitTextByLimit(tweetInput, 280);

  var tweetOutput = document.getElementById("tweet-output");
  tweetOutput.innerHTML = "";

  if (tweetChunks.length === 0) {
    return;
  }

  tweetChunks.forEach(function (chunk, index) {
    var tweetDiv = document.createElement("div");
    tweetDiv.className = "tweet";
    tweetDiv.textContent = chunk;

    tweetDiv.addEventListener("click", function (event) {
      copyToClipboard(chunk);
    });

    tweetOutput.appendChild(tweetDiv);
  });

  var statsOutput = document.getElementById("stats-output");
  statsOutput.innerHTML = "";

  var charCount = tweetInput.length;
  var wordCount = tweetInput.split(/\s+/).length;
  var paragraphCount = tweetInput.split(/\n+/).length;
  var sentenceCount = tweetInput.split(/[.?!]+/).length;

  var statsText = "Character Count: " + charCount + " - " +
    "Word Count: " + wordCount + " - " +
    "Paragraph Count: " + paragraphCount + " - " +
    "Sentence Count: " + sentenceCount;

  statsOutput.innerHTML = statsText;
}

function splitTextByLimit(text, limit) {
  const sentences = text.split('.').map(sentence => sentence.trim());

  let tweetChunks = [];
  let currentChunk = '';

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];

    if ((currentChunk.length + sentence.length + 1) <= limit) {
      currentChunk += sentence + '. ';
    } else {
      tweetChunks.push(currentChunk);
      currentChunk = sentence + '. ';
    }
  }

  if (currentChunk.length > 0) {
    tweetChunks.push(currentChunk);
  }

  return tweetChunks;
}

window.addEventListener("load", function () {
  var tweetInput = localStorage.getItem("tweetInput");
  if (tweetInput) {
    document.getElementById("tweet-input").value = tweetInput;
    updateTweetOutput(tweetInput);
  }
});

document.getElementById("split-button").addEventListener("click", function () {
  var tweetInput = document.getElementById("tweet-input").value;

  if (!tweetInput.trim()) {
    showMessage("Tweet text cannot be empty", event);
    return;
  }

  updateTweetOutput(tweetInput);

  localStorage.setItem("tweetInput", tweetInput);
});

document.getElementById("clear-button").addEventListener("click", function () {
  localStorage.removeItem("tweetInput");
  document.getElementById("tweet-input").value = "";
  document.getElementById("tweet-output").innerHTML = "";
  document.getElementById("stats-output").innerHTML = "";
});

function toggleAccordion() {
  const accordion = document.querySelector('.howtouse');
  accordion.classList.toggle('active');
}

const accordionHeading = document.querySelector('.toggle');
accordionHeading.addEventListener('click', toggleAccordion);

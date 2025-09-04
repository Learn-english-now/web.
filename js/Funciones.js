function checkAnswers() {
    let correct = 0;
    let total = 3;

    for (let i = 1; i <= total; i++) {
      const radios = document.getElementsByName(`q${i}`);
      let answered = false;

      for (let radio of radios) {
        if (radio.checked) {
          answered = true;
          if (radio.value === "correct") correct++;
          break;
        }
      }
    }

    let resultMsg = `✅ Correct: ${correct} / ❌ Incorrect: ${total - correct}`;
    document.getElementById("result").textContent = resultMsg;
  }


  function downloadTranscript(elementId, filename) {
    const content = document.getElementById(elementId).value;
    if (content.trim() === "") {
        alert("There is no text to download. Please write your answer first.");
        return;
    }
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link); 
    link.click();
    document.body.removeChild(link); 
  }

  
  const phrase = "Hello! My name is [Your name], and today I will practice speaking in the test.";
  const phraseKeywords = ["hello", "my", "name", "today", "practice", "speaking", "test"]; 

  function playPhrase() {
    const utterance = new SpeechSynthesisUtterance(phrase.replace("[Your name]", "Juan")); 
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  }

  function startRecognitionPhrase() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    const resultText = document.getElementById("resultText");
    resultText.textContent = "[Listening...]";
    resultText.className = "result"; 

    recognition.start();

    recognition.onresult = function(event) {
      const spoken = event.results[0][0].transcript.toLowerCase();
      const targetPhraseLower = phrase.toLowerCase();
      
      let matches = 0;
      phraseKeywords.forEach(word => {
        if (spoken.includes(word)) {
          matches++;
        }
      });
      const percentageMatch = (matches / phraseKeywords.length) * 100;

      if (percentageMatch >= 75) { 
        resultText.textContent = `✅ Great job! You said: "${spoken}"`;
        resultText.classList.add("correct");
      } else if (percentageMatch >= 40) { 
        resultText.textContent = `🟡 Almost there. You said: "${spoken}". Try to include more of the key words.`;
        resultText.classList.add("partial");
      } else {
        resultText.textContent = `❌ You said: "${spoken}". Try saying: "${phrase}"`;
        resultText.classList.add("incorrect");
      }
    };

    recognition.onerror = function(event) {
      resultText.textContent = "Error: " + event.error + ". Please try again.";
      resultText.classList.add("incorrect");
    };

    recognition.onspeechend = function() {
      recognition.stop();
    };
  }

  let currentRole = '';
  let dialogStep = 0;

  const dialog = [
    {
      assistant: "Hello! Can I help you?",
      customer: "Yes, I’m looking for a T-shirt."
    },
    {
      assistant: "What color would you like?",
      customer: "Blue, please."
    },
    {
      assistant: "Here you are.",
      customer: "Thank you!"
    },
    {
        assistant: "Is there anything else I can help you with?",
        customer: "No, thank you. That's all."
    }
  ];

  function startDialog(role) {
    currentRole = role;
    dialogStep = 0;
    document.getElementById("dialogBox").style.display = "block";
    document.getElementById("spokenResult").textContent = ""; 
  }

  function showNextLine() {
    const dialogLineElem = document.getElementById("dialogLine");
    const userLineElem = document.getElementById("userLine");
    const spokenResultElem = document.getElementById("spokenResult");

    spokenResultElem.textContent = ""; 

    if (dialogStep >= dialog.length) {
      dialogLineElem.textContent = "✅ Dialogue complete! You did a great job!";
      userLineElem.textContent = "";
      document.querySelector("#dialogBox button").style.display = "none"; 
      return;
    }

   
    const interlocutorRole = currentRole === 'customer' ? 'assistant' : 'customer';
    const interlocutorLine = dialog[dialogStep][interlocutorRole];
    
    
    if (interlocutorLine) {
      speak(interlocutorLine);
      dialogLineElem.textContent = `${interlocutorRole === 'assistant' ? '🛒 Seller says:' : '🧍 Customer says:'} "${interlocutorLine}"`;
    } else {
        dialogLineElem.textContent = ""; 
    }

    
    const userExpectedLine = dialog[dialogStep][currentRole];
    if (userExpectedLine) {
      userLineElem.textContent = `"${userExpectedLine}"`;
    } else {
        
        userLineElem.textContent = "Great job! Ready for the next line?";
    }
  } 

  function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  }

  function startRecognitionDialog() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    const spokenResultElem = document.getElementById("spokenResult");
    spokenResultElem.textContent = "[Listening...]";
    spokenResultElem.className = "result"; 
    recognition.start();

    recognition.onresult = function(event) {
      const spoken = event.results[0][0].transcript;
      const userExpectedLine = dialog[dialogStep][currentRole]; 
      
      spokenResultElem.textContent = `🗣️ You said: "${spoken}"`;

     
      if (spoken.toLowerCase().includes(userExpectedLine.toLowerCase().substring(0, Math.min(userExpectedLine.length, 10)))) { // Check first 10 chars
        spokenResultElem.classList.add("correct");
        spokenResultElem.textContent += " ✅";
      } else {
        spokenResultElem.classList.add("incorrect");
        spokenResultElem.textContent += " ❌ (Expected: \"" + userExpectedLine + "\")";
      }

      dialogStep++;
      setTimeout(() => {
        showNextLine();
      }, 2000); 
    };

    recognition.onerror = function(event) {
      spokenResultElem.textContent = "Error: " + event.error + ". Please try again.";
      spokenResultElem.classList.add("incorrect");
    };

    recognition.onspeechend = function() {
      recognition.stop();
    };
  }


 let startTime = Date.now();

function updateTimer() {
  const now = Date.now();
  const elapsed = Math.floor((now - startTime) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  document.getElementById("timer").textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

setInterval(updateTimer, 1000);

function finalizarTest() {
  const now = Date.now();
  const totalTime = Math.floor((now - startTime) / 1000);
  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;

  document.getElementById("tiempoTotal").textContent = `${minutes} minuto(s) y ${seconds} segundo(s)`;
  document.getElementById("popupModal").style.display = "block";
}

function cerrarModal() {
  document.getElementById("popupModal").style.display = "none";
}

  
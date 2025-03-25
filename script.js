document.getElementById("send-btn").addEventListener("click", sendMessage);
document.getElementById("speech-btn").addEventListener("click", startSpeechRecognition);

function sendMessage() {
    let userInput = document.getElementById("user-input").value;
    if (userInput.trim() === "") return;

    appendMessage("You", userInput);
    document.getElementById("user-input").value = "";

    // Send message to chatbot (You can replace this with actual API)
    setTimeout(() => {
        appendMessage("Bot", "This is a response.");
    }, 1000);
}

function appendMessage(sender, message) {
    let chatBox = document.getElementById("chat-box");
    let messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Speech-to-Text
function startSpeechRecognition() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = function(event) {
        document.getElementById("user-input").value = event.results[0][0].transcript;
    };
}


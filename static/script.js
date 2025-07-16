const chatbotBtn = document.getElementById('chatbot-btn');
const chatPopup = document.getElementById('chat-popup');
const closeBtn = document.getElementById('close-btn');
const sendBtn = document.getElementById('send-btn');
const chatInput = document.getElementById('chat-input');
const chatBody = document.getElementById('chat-body');

// Open chatbot
chatbotBtn.addEventListener('click', () => {
  chatPopup.style.display = 'block';
});

// Close chatbot
closeBtn.addEventListener('click', () => {
  chatPopup.style.display = 'none';
});

// Send message
sendBtn.addEventListener('click', sendMessage);

// Allow "Enter" key to send message
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault(); // Prevent form submit if wrapped in a form
    sendMessage();
  }
});

function sendMessage() {
  const userMessage = chatInput.value.trim();
  if (userMessage !== '') {
    displayMessage(userMessage, 'user-message');

    // Send message to backend (relative path for same port)
    fetch('http://127.0.0.1:50001/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: userMessage })
    })
    .then(response => response.json())
    .then(data => {
      // Log the backend response to inspect the data structure
      console.log("Backend response:", data);

      if (data && data.response) {
        displayBotResponse(data.response);
      } else {
        displayMessage("Sorry, something went wrong with the response format.", 'bot-message', true);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      displayMessage("Sorry, I couldn't process your request.", 'bot-message', true);
    });

    chatInput.value = '';
    chatBody.scrollTop = chatBody.scrollHeight;
  }
}

function displayMessage(message, type, isBot = false) {
  const messageElement = document.createElement('div');
  messageElement.classList.add(type);

  if (isBot) {
    messageElement.innerHTML = message;
  } else {
    messageElement.innerText = message;
  }

  chatBody.appendChild(messageElement);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function displayBotResponse(response) {
  if (response) {
    const points = response.split('\n');
    const botResponseContainer = document.createElement('div');
    botResponseContainer.classList.add('bot-message');

    points.forEach(point => {
      if (point.trim() !== '') {
        const pointElement = document.createElement('div');
        const formattedText = point.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        pointElement.innerHTML = `• ${formattedText}`;
        botResponseContainer.appendChild(pointElement);
      }
    });

    chatBody.appendChild(botResponseContainer);
    chatBody.scrollTop = chatBody.scrollHeight;
  } else {
    displayMessage("Sorry, I couldn't get a valid response.", 'bot-message', true);
  }
}

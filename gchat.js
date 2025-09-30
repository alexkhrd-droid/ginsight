import { firebaseApp } from 'https://cdn.jsdelivr.net/gh/alexkhrd-droid/ginsight@main/gconfig.js';
import { getAI, getGenerativeModel, GoogleAIBackend } from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-ai-compat.js';
// Initialize AI Logic
let ai, model;
try {
  ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });
  model = getGenerativeModel(ai, {
    model: "gemini-2.5-flash",
    safetySettings: [
      { category: 1, threshold: 3 }, // HARM_CATEGORY_HARASSMENT
      { category: 2, threshold: 3 }, // HARM_CATEGORY_HATE_SPEECH
      { category: 3, threshold: 3 }, // HARM_CATEGORY_SEXUALLY_EXPLICIT
      { category: 4, threshold: 3 } // HARM_CATEGORY_DANGEROUS_CONTENT
    ]
  });
  console.log('Gemini AI model initialized');
} catch (error) {
  console.error('Gemini AI initialization error:', {
    message: error.message,
    code: error.code,
    details: error.details || 'No details'
  });
}
// System instruction
const SYSTEM_INSTRUCTION = "You are a legal assistant. Respond only to questions related to legal topics, including laws, rights, obligations, contracts, taxes, and other legal matters. Answer professionally, accurately, and in Russian. If the question is outside the scope of legal topics, politely state that you can only respond to legal questions.";
// Function to send message
async function sendMessage() {
  console.log('sendMessage called');
  const userInput = document.getElementById('userInput');
  if (!userInput) {
    console.error('userInput element not found');
    appendMessage('Assistant', 'Error: Input field not found.');
    return;
  }
  const inputValue = userInput.value.trim();
  if (!inputValue) {
    console.error('Empty input');
    appendMessage('Assistant', 'Error: Please enter a message.');
    return;
  }
  if (!model) {
    console.error('AI model not initialized');
    appendMessage('Assistant', 'Error: AI is not available. Check the browser console.');
    return;
  }
  appendMessage('You', inputValue);
  userInput.value = '';
  try {
    const fullPrompt = `${SYSTEM_INSTRUCTION}\n\nUser query: ${inputValue}`;
    console.log('Sending request to Gemini:', fullPrompt.substring(0, 100) + '...');
    const result = await model.generateContentStream(fullPrompt);
    let fullResponse = '';
    const responseElement = document.createElement('div');
    responseElement.className = 'assistant-message';
    responseElement.innerHTML = '<strong>Assistant:</strong> ';
    document.getElementById('chatBox').appendChild(responseElement);
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullResponse += chunkText;
      responseElement.innerHTML = `<strong>Assistant:</strong> ${fullResponse.replace(/\n/g, '<br>')}`;
      document.getElementById('chatBox').scrollTop = document.getElementById('chatBox').scrollHeight;
    }
    console.log('Streaming completed, response length:', fullResponse.length);
  } catch (error) {
    console.error('Error during response streaming:', {
      message: error.message,
      code: error.code,
      details: error.details || 'No details',
      stack: error.stack
    });
    appendMessage('Assistant', `Error: ${error.message || 'Unknown error'}. Check the console for details.`);
  }
}
// Function to append messages
function appendMessage(sender, message) {
  const chatBox = document.getElementById('chatBox');
  if (!chatBox) {
    console.error('chatBox element not found');
    return;
  }
  const messageElement = document.createElement('div');
  messageElement.className = sender === 'You' ? 'user-message' : 'assistant-message';
  messageElement.innerHTML = `<strong>${sender}:</strong> ${message.replace(/\n/g, '<br>')}`;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}
// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded triggered');
  const sendButton = document.getElementById('sendButton');
  const userInput = document.getElementById('userInput');
  if (sendButton && userInput) {
    sendButton.addEventListener('click', () => {
      console.log('sendButton clicked');
      sendMessage();
    });
    userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        console.log('Enter pressed');
        sendMessage();
      }
    });
    console.log('Event listeners set');
  } else {
    console.error('Elements not found:', { sendButton: !!sendButton, userInput: !!userInput });
  }
});

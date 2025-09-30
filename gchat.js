import { firebaseApp } from './gconfig.js';
import { getAI, getGenerativeModel, GoogleAIBackend } from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-ai.js';

// Initialize AI Logic with Gemini backend
const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });

// Initialize the model
const model = getGenerativeModel(ai, {
  model: "gemini-2.5-flash", // Fast model for streaming (can be replaced with gemini-2.5-pro)
  safetySettings: [
    { category: 1, threshold: 3 }, // HARM_CATEGORY_HARASSMENT: BLOCK_MEDIUM_AND_ABOVE
    { category: 2, threshold: 3 }, // HARM_CATEGORY_HATE_SPEECH
    { category: 3, threshold: 3 }, // HARM_CATEGORY_SEXUALLY_EXPLICIT
    { category: 4, threshold: 3 }  // HARM_CATEGORY_DANGEROUS_CONTENT
  ]
});

// System instruction for legal topics
const SYSTEM_INSTRUCTION = "You are a legal assistant. Respond only to questions related to legal topics, including laws, rights, obligations, contracts, taxes, and other legal matters. Provide responses in a professional and accurate manner in English. If a question falls outside the scope of legal topics, politely inform the user that you can only respond to legal questions.";

// Function to send a message with streaming support
async function sendMessage() {
  const userInput = document.getElementById('userInput').value.trim();
  if (!userInput) {
    alert('Error: Please enter a message.');
    return;
  }

  // Display the user's message
  appendMessage('You', userInput);
  document.getElementById('userInput').value = '';

  try {
    const fullPrompt = `${SYSTEM_INSTRUCTION}\n\nUser query: ${userInput}`;
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
  } catch (error) {
    console.error('Streaming error:', error);
    appendMessage('Assistant', 'Error processing the request. Please try again.');
  }
}

// Function to append messages to the chat
function appendMessage(sender, message) {
  const chatBox = document.getElementById('chatBox');
  const messageElement = document.createElement('div');
  messageElement.className = sender === 'You' ? 'user-message' : 'assistant-message';
  messageElement.innerHTML = `<strong>${sender}:</strong> ${message.replace(/\n/g, '<br>')}`;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  const sendButton = document.getElementById('sendButton');
  const userInput = document.getElementById('userInput');
  if (sendButton && userInput) {
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  } else {
    console.error('Elements sendButton or userInput not found.');
  }
});

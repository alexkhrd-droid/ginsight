import { firebaseApp } from './gconfig.js';
import { getAI, getGenerativeModel, GoogleAIBackend } from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-ai.js';

// Initialize AI Logic
let ai, model;
try {
  ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });
  model = getGenerativeModel(ai, {
    model: "gemini-2.5-flash",
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: 3 },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: 3 },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: 3 },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: 3 }
    ]
  });
  console.log('Gemini AI model initialized successfully');
} catch (error) {
  console.error('Error initializing Gemini AI:', {
    message: error.message,
    code: error.code,
    details: error.details || 'No details available'
  });
}

// System instruction for legal assistant
const SYSTEM_INSTRUCTION = `
You are a helpful and approachable legal assistant for U.S. law.
- Speak like a real consultant, not like an encyclopedia or Wikipedia.
- Give concise, practical answers (3–6 sentences).
- Use plain American English, simple and friendly.
- If helpful, break information into short bullet points instead of long paragraphs.
- Stay focused only on the user's legal question, avoid unnecessary background or history.
- If the question is not about law, politely say you only provide legal help.
`;

// Store chat history (user + assistant messages)
const conversationHistory = [
  { role: "system", content: SYSTEM_INSTRUCTION }
];

// Function to send message with streaming
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
    appendMessage('Assistant', 'Error: AI not available. Check browser console.');
    return;
  }

  // Add user message to UI + history
  appendMessage('You', inputValue);
  conversationHistory.push({ role: "user", content: inputValue });
  userInput.value = '';

  // Show loading message
  const loadingElement = document.createElement('div');
  loadingElement.className = 'assistant-message';
  loadingElement.innerHTML = '<strong>Assistant:</strong> Please wait, processing your request...';
  document.getElementById('chatBox').appendChild(loadingElement);
  document.getElementById('chatBox').scrollTop = document.getElementById('chatBox').scrollHeight;

  try {
    // Build full conversation string
    const fullPrompt = conversationHistory
      .map(m => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n\n');

    console.log('Sending request to Gemini with history, length:', fullPrompt.length);

    const result = await model.generateContentStream(fullPrompt);
    let fullResponse = '';
    const responseElement = document.createElement('div');
    responseElement.className = 'assistant-message';
    responseElement.innerHTML = '<strong>Assistant:</strong> ';
    document.getElementById('chatBox').replaceChild(responseElement, loadingElement);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullResponse += chunkText;
      responseElement.innerHTML = `<strong>Assistant:</strong> ${fullResponse.replace(/\n/g, '<br>')}`;
      document.getElementById('chatBox').scrollTop = document.getElementById('chatBox').scrollHeight;
    }

    console.log('Streaming completed, response length:', fullResponse.length);

    // Save assistant response to history
    conversationHistory.push({ role: "assistant", content: fullResponse });

  } catch (error) {
    console.error('Error during streaming response:', {
      message: error.message,
      code: error.code,
      details: error.details || 'No details available',
      stack: error.stack
    });
    document.getElementById('chatBox').removeChild(loadingElement);
    appendMessage('Assistant', `Error: ${error.message || 'Unknown error'}. Check console for details.`);
  }
}

// Function to append messages to chat
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
  console.log(`Message appended: ${sender}: ${message}`);
}

// Set up event listeners
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded fired');
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
    console.log('Event listeners set up');
  } else {
    console.error('Elements not found:', { sendButton: !!sendButton, userInput: !!userInput });
  }
});



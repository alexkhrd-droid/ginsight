import { firebaseApp } from 'https://cdn.jsdelivr.net/gh/alexkhrd-droid/ginsight@main/gconfig.js';
import { getAI, getGenerativeModel, GoogleAIBackend } from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-ai-compat.js';

// Инициализация AI Logic
let ai, model;
try {
  ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });
  model = getGenerativeModel(ai, {
    model: "gemini-2.5-flash",
    safetySettings: [
      { category: 1, threshold: 3 }, // HARM_CATEGORY_HARASSMENT
      { category: 2, threshold: 3 }, // HARM_CATEGORY_HATE_SPEECH
      { category: 3, threshold: 3 }, // HARM_CATEGORY_SEXUALLY_EXPLICIT
      { category: 4, threshold: 3 }  // HARM_CATEGORY_DANGEROUS_CONTENT
    ]
  });
  console.log('Gemini AI модель инициализирована');
} catch (error) {
  console.error('Ошибка инициализации Gemini AI:', error.message, error);
}

// Системная инструкция
const SYSTEM_INSTRUCTION = "Вы юридический ассистент. Отвечайте только на вопросы, связанные с юридическими темами, включая законы, права, обязанности, контракты, налоги и другие правовые вопросы. Отвечайте профессионально, точно и на русском языке. Если вопрос выходит за рамки юридической тематики, вежливо сообщите, что вы можете ответить только на юридические вопросы.";

// Функция отправки сообщения
async function sendMessage() {
  const userInput = document.getElementById('userInput')?.value.trim();
  if (!userInput) {
    appendMessage('Ассистент', 'Ошибка: Введите сообщение.');
    return;
  }
  if (!model) {
    appendMessage('Ассистент', 'Ошибка: Модель AI не инициализирована. Проверьте консоль браузера.');
    console.error('Модель AI не доступна');
    return;
  }

  appendMessage('Вы', userInput);
  document.getElementById('userInput').value = '';

  try {
    const fullPrompt = `${SYSTEM_INSTRUCTION}\n\nПользовательский запрос: ${userInput}`;
    console.log('Отправка запроса к Gemini:', fullPrompt.substring(0, 100) + '...');
    const result = await model.generateContentStream(fullPrompt);
    let fullResponse = '';
    const responseElement = document.createElement('div');
    responseElement.className = 'assistant-message';
    responseElement.innerHTML = '<strong>Ассистент:</strong> ';
    document.getElementById('chatBox').appendChild(responseElement);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullResponse += chunkText;
      responseElement.innerHTML = `<strong>Ассистент:</strong> ${fullResponse.replace(/\n/g, '<br>')}`;
      document.getElementById('chatBox').scrollTop = document.getElementById('chatBox').scrollHeight;
    }
    console.log('Стриминг завершен, длина ответа:', fullResponse.length);
  } catch (error) {
    console.error('Ошибка при стриминге ответа:', {
      message: error.message,
      code: error.code,
      details: error.details || 'Нет деталей',
      stack: error.stack
    });
    appendMessage('Ассистент', `Ошибка: ${error.message || 'Неизвестная ошибка'}. Проверьте консоль браузера для деталей.`);
  }
}

// Функция для добавления сообщений
function appendMessage(sender, message) {
  const chatBox = document.getElementById('chatBox');
  if (!chatBox) {
    console.error('Элемент chatBox не найден');
    return;
  }
  const messageElement = document.createElement('div');
  messageElement.className = sender === 'Вы' ? 'user-message' : 'assistant-message';
  messageElement.innerHTML = `<strong>${sender}:</strong> ${message.replace(/\n/g, '<br>')}`;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Обработчики событий
document.addEventListener('DOMContentLoaded', () => {
  const sendButton = document.getElementById('sendButton');
  const userInput = document.getElementById('userInput');
  if (sendButton && userInput) {
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
    console.log('Обработчики событий установлены');
  } else {
    console.error('Не найдены элементы:', { sendButton: !!sendButton, userInput: !!userInput });
  }
});

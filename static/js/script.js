async function handleCamera() {
    try {
        // First check if camera is available
        const statusResponse = await fetch('/camera-status');
        if (!statusResponse.ok) {
            throw new Error('Camera is not available');
        }

        // Show loading state
        const cameraBtn = document.getElementById('cameraBtn');
        const originalText = cameraBtn.textContent;
        cameraBtn.textContent = 'Capturing...';
        cameraBtn.disabled = true;

        // Capture image
        const response = await fetch('/capture', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to capture image');
        }

        const data = await response.json();

        // Create preview modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Preview Image</h3>
                <img src="${data.url}" alt="Captured image" style="max-width: 100%; margin: 10px 0;">
                <div class="button-group">
                    <button onclick="retakePhoto()" class="btn btn-secondary">Retake</button>
                    <button onclick="savePhoto('${data.filename}')" class="btn btn-primary">Save</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Reset button state
        cameraBtn.textContent = originalText;
        cameraBtn.disabled = false;

    } catch (error) {
        console.error('Camera error:', error);
        alert('Failed to capture image: ' + error.message);
        
        // Reset button state
        const cameraBtn = document.getElementById('cameraBtn');
        cameraBtn.textContent = originalText;
        cameraBtn.disabled = false;
    }
}

function retakePhoto() {
    // Remove the modal
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
    // Call handleCamera again
    handleCamera();
}

function savePhoto(filename) {
    // Here you can add code to save the photo to your database or perform other actions
    alert('Photo saved successfully!');
    
    // Remove the modal
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const aiChatBotBtn = document.getElementById('aiChatBotBtn');
    const aiAssistant = document.getElementById('aiAssistant');
    const menuDropdown = document.getElementById('menuDropdown');
    
    if (aiChatBotBtn && aiAssistant) {
        aiChatBotBtn.addEventListener('click', function(e) {
            e.preventDefault();
            aiAssistant.classList.toggle('hidden');
            if (menuDropdown) {
                menuDropdown.classList.add('hidden');
            }
        });
    }
});

// AI Chatbot Functionality
document.addEventListener('DOMContentLoaded', function() {
    const aiChatBotBtn = document.getElementById('aiChatBotBtn');
    const aiChatbotSection = document.getElementById('ai-chatbot-section');
    const toggleHistoryBtn = document.getElementById('toggleHistoryBtn');
    const toggleGraphsBtn = document.getElementById('toggleGraphsBtn');
    const historyTab = document.getElementById('historyTab');
    const graphsTab = document.getElementById('graphsTab');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const micBtn = document.getElementById('micBtn');
    const voiceStatus = document.getElementById('voiceStatus');
    const chatMessages = document.getElementById('chatMessages');
    const transactionHistory = document.getElementById('transactionHistory');
    const recommendations = document.getElementById('recommendations');
    let expenseChart = null;

    // Toggle AI Chatbot Section
    if (aiChatBotBtn && aiChatbotSection) {
        aiChatBotBtn.addEventListener('click', function(e) {
            e.preventDefault();
            aiChatbotSection.classList.toggle('hidden');
            const menuDropdown = document.getElementById('menuDropdown');
            if (menuDropdown) {
                menuDropdown.classList.add('hidden');
            }
        });
    }

    // Toggle History and Graphs
    if (toggleHistoryBtn && toggleGraphsBtn) {
        toggleHistoryBtn.addEventListener('click', function() {
            historyTab.classList.remove('hidden');
            graphsTab.classList.add('hidden');
            toggleHistoryBtn.classList.add('bg-indigo-600');
            toggleGraphsBtn.classList.remove('bg-indigo-600');
        });

        toggleGraphsBtn.addEventListener('click', function() {
            historyTab.classList.add('hidden');
            graphsTab.classList.remove('hidden');
            toggleHistoryBtn.classList.remove('bg-indigo-600');
            toggleGraphsBtn.classList.add('bg-indigo-600');
            if (!expenseChart) {
                initializeCharts();
            }
        });
    }

    // Handle Send Message
    if (sendBtn && userInput) {
        sendBtn.addEventListener('click', handleSendMessage);
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSendMessage();
            }
        });
    }

    // Handle Voice Input
    if (micBtn) {
        let recognition = null;
        if ('webkitSpeechRecognition' in window) {
            recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = function() {
                voiceStatus.classList.remove('hidden');
                micBtn.classList.add('bg-red-500');
            };

            recognition.onend = function() {
                voiceStatus.classList.add('hidden');
                micBtn.classList.remove('bg-red-500');
            };

            recognition.onresult = function(event) {
                const transcript = event.results[0][0].transcript;
                userInput.value = transcript;
                handleSendMessage();
            };
        }

        micBtn.addEventListener('click', function() {
            if (recognition) {
                recognition.start();
            } else {
                alert('Speech recognition is not supported in your browser.');
            }
        });
    }

    // Send Message Function
    function handleSendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // Add user message to chat
        addMessageToChat(message, 'user');
        userInput.value = '';

        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'chat-message ai-message typing';
        typingIndicator.innerHTML = `
            <div class="avatar ai-avatar">
                <i class="fas fa-robot text-white"></i>
            </div>
            <div class="message-bubble ai-bubble">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Send message to backend
        fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        })
        .then(response => response.json())
        .then(data => {
            // Remove typing indicator
            typingIndicator.remove();

            // Add AI response to chat
            addMessageToChat(data.response, 'ai');

            // Update transaction history if provided
            if (data.transactions) {
                updateTransactionHistory(data.transactions);
            }

            // Update recommendations if provided
            if (data.recommendations) {
                updateRecommendations(data.recommendations);
            }

            // Update charts if needed
            if (data.chartData) {
                updateCharts(data.chartData);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            typingIndicator.remove();
            addMessageToChat('Sorry, I encountered an error. Please try again.', 'ai');
        });
    }

    // Add Message to Chat
    function addMessageToChat(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}-message`;
        messageDiv.innerHTML = `
            <div class="avatar ${type}-avatar">
                <i class="fas fa-${type === 'user' ? 'user' : 'robot'} text-white"></i>
            </div>
            <div class="message-bubble ${type}-bubble">
                <p>${message}</p>
                <div class="message-time">${new Date().toLocaleTimeString()}</div>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Update Transaction History
    function updateTransactionHistory(transactions) {
        transactionHistory.innerHTML = transactions.map(t => `
            <div class="flex justify-between items-center p-3 bg-white rounded-lg shadow">
                <div>
                    <div class="font-medium">${t.description}</div>
                    <div class="text-sm text-gray-500">${t.category}</div>
                </div>
                <div class="text-right">
                    <div class="font-medium ${t.type === 'expense' ? 'text-red-600' : 'text-green-600'}">
                        ${t.type === 'expense' ? '-' : '+'}$${t.amount}
                    </div>
                    <div class="text-sm text-gray-500">${new Date(t.date).toLocaleDateString()}</div>
                </div>
            </div>
        `).join('');
    }

    // Update Recommendations
    function updateRecommendations(recommendations) {
        recommendations.innerHTML = recommendations.map(r => `
            <div class="p-3 bg-white rounded-lg shadow">
                <div class="font-medium text-indigo-600">${r.title}</div>
                <p class="text-sm text-gray-600 mt-1">${r.description}</p>
            </div>
        `).join('');
    }

    // Initialize Charts
    function initializeCharts() {
        const ctx = document.getElementById('expenseChart').getContext('2d');
        expenseChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#4F46E5',
                        '#7C3AED',
                        '#EC4899',
                        '#F59E0B',
                        '#10B981',
                        '#3B82F6'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Update Charts
    function updateCharts(chartData) {
        if (expenseChart) {
            expenseChart.data.labels = chartData.labels;
            expenseChart.data.datasets[0].data = chartData.data;
            expenseChart.update();
        }
    }
}); 
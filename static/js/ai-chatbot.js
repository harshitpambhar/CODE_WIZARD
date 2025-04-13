// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const micBtn = document.getElementById('micBtn');
const voiceStatus = document.getElementById('voiceStatus');
const toggleHistoryBtn = document.getElementById('toggleHistoryBtn');
const toggleGraphsBtn = document.getElementById('toggleGraphsBtn');
const historyTab = document.getElementById('historyTab');
const graphsTab = document.getElementById('graphsTab');
const transactionHistory = document.getElementById('transactionHistory');
const recommendations = document.getElementById('recommendations');
const expenseChart = document.getElementById('expenseChart');

// Chart instances
let categoryChart = null;
let trendChart = null;
let chart = null;

// Speech recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        userInput.value = transcript;
        voiceStatus.classList.add('hidden');
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        voiceStatus.classList.add('hidden');
    };

    recognition.onend = () => {
        voiceStatus.classList.add('hidden');
    };
}

// Event Listeners
sendBtn.addEventListener('click', handleSendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSendMessage();
});

micBtn.addEventListener('click', () => {
    if (recognition) {
        recognition.start();
        voiceStatus.classList.remove('hidden');
    } else {
        alert('Speech recognition is not supported in your browser.');
    }
});

toggleHistoryBtn.addEventListener('click', () => {
    historyTab.classList.remove('hidden');
    graphsTab.classList.add('hidden');
});

toggleGraphsBtn.addEventListener('click', () => {
    historyTab.classList.add('hidden');
    graphsTab.classList.remove('hidden');
    initializeCharts();
});

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadTransactionHistory();
    loadRecommendations();
});

// Functions
async function handleSendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessageToChat('user', message);
    userInput.value = '';

    try {
        // Send message to backend
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        const data = await response.json();
        
        // Add AI response to chat
        addMessageToChat('ai', data.response);

        // Update recommendations if needed
        if (data.recommendations) {
            updateRecommendations(data.recommendations);
        }

        // Update transaction history
        updateTransactionHistory(data.transactions);

        // Update expense chart
        updateExpenseChart(data.transactions);

    } catch (error) {
        console.error('Error sending message:', error);
        addMessageToChat('ai', 'Sorry, I encountered an error. Please try again.');
    }
}

function addMessageToChat(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`;
    
    const messageContent = document.createElement('div');
    messageContent.className = `max-w-[70%] p-3 rounded-lg ${
        sender === 'user' 
            ? 'bg-blue-500 text-white rounded-br-none' 
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
    }`;
    messageContent.textContent = message;
    
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function loadTransactionHistory() {
    try {
        const response = await fetch('/api/transactions');
        const transactions = await response.json();
        
        transactionHistory.innerHTML = transactions.map(transaction => `
            <div class="bg-indigo-800/30 rounded-lg p-3">
                <div class="flex justify-between items-center">
                    <span class="font-medium">${transaction.description}</span>
                    <span class="text-${transaction.type === 'expense' ? 'red' : 'green'}-400">
                        ${transaction.type === 'expense' ? '-' : '+'}$${transaction.amount}
                    </span>
                </div>
                <div class="text-sm text-indigo-300">
                    ${transaction.category} • ${new Date(transaction.date).toLocaleDateString()}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading transactions:', error);
        transactionHistory.innerHTML = '<p class="text-red-400">Error loading transactions</p>';
    }
}

function initializeCharts() {
    // Category Chart
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    if (categoryChart) categoryChart.destroy();
    
    categoryChart = new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
            labels: ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Other'],
            datasets: [{
                data: [30, 20, 15, 25, 10, 5],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: 'white'
                    }
                }
            }
        }
    });

    // Trend Chart
    const trendCtx = document.getElementById('trendChart').getContext('2d');
    if (trendChart) trendChart.destroy();
    
    trendChart = new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Expenses',
                data: [1200, 1900, 1500, 1800, 1600, 1400],
                borderColor: '#FF6384',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: 'white'
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}

async function loadRecommendations() {
    try {
        const response = await fetch('/api/recommendations');
        const data = await response.json();
        updateRecommendations(data);
    } catch (error) {
        console.error('Error loading recommendations:', error);
        recommendations.innerHTML = '<p class="text-red-400">Error loading recommendations</p>';
    }
}

function updateRecommendations(recommendations) {
    recommendations.innerHTML = recommendations.map(rec => `
        <div class="bg-indigo-800/30 rounded-lg p-4">
            <div class="flex items-center mb-2">
                <i class="fas ${rec.icon} text-xl mr-2 text-${rec.color}-400"></i>
                <h3 class="font-medium">${rec.title}</h3>
            </div>
            <p class="text-indigo-300 text-sm">${rec.description}</p>
            ${rec.action ? `
                <button class="mt-3 text-sm text-${rec.color}-400 hover:text-${rec.color}-300 transition-colors">
                    ${rec.action}
                </button>
            ` : ''}
        </div>
    `).join('');
}

function updateTransactionHistory(transactions) {
    transactionHistory.innerHTML = '';
    
    transactions.forEach(transaction => {
        const [type, amount, category, description, date] = transaction;
        const transactionDiv = document.createElement('div');
        transactionDiv.className = 'bg-white p-4 rounded-lg shadow mb-2';
        transactionDiv.innerHTML = `
            <div class="flex justify-between items-center">
                <div>
                    <h3 class="font-semibold">${category}</h3>
                    <p class="text-sm text-gray-600">${description}</p>
                </div>
                <div class="text-right">
                    <p class="font-bold ${type === 'expense' ? 'text-red-500' : 'text-green-500'}">
                        ${type === 'expense' ? '-' : '+'}₹${amount}
                    </p>
                    <p class="text-sm text-gray-500">${new Date(date).toLocaleDateString()}</p>
                </div>
            </div>
        `;
        transactionHistory.appendChild(transactionDiv);
    });
}

function updateExpenseChart(transactions) {
    // Group transactions by category
    const categories = {};
    transactions.forEach(transaction => {
        const [type, amount, category] = transaction;
        if (type === 'expense') {
            categories[category] = (categories[category] || 0) + amount;
        }
    });

    // Prepare chart data
    const labels = Object.keys(categories);
    const data = Object.values(categories);

    // Destroy existing chart if it exists
    if (chart) {
        chart.destroy();
    }

    // Create new chart
    const ctx = expenseChart.getContext('2d');
    chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                },
                title: {
                    display: true,
                    text: 'Expense Distribution by Category'
                }
            }
        }
    });
}

function startVoiceRecognition() {
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            micBtn.classList.add('text-red-500');
        };

        recognition.onresult = (event) => {
            const message = event.results[0][0].transcript;
            userInput.value = message;
            handleSendMessage();
        };

        recognition.onend = () => {
            micBtn.classList.remove('text-red-500');
        };

        recognition.start();
    } else {
        alert('Voice recognition is not supported in your browser.');
    }
} 
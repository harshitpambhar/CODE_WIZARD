// DOM Elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const dashboard = document.getElementById('dashboard');
const menuBtn = document.querySelector('.menu-btn');
const menuDropdown = document.querySelector('.menu-dropdown');
const contentSections = document.querySelectorAll('.tab-content');
const menuItems = document.querySelectorAll('.menu-item');
const transactionForm = document.getElementById('transactionForm');
const transactionList = document.getElementById('transactionList');
const categoryChart = document.getElementById('categoryChart');
const trendChart = document.getElementById('trendChart');
const loginTabBtn = document.getElementById('loginTabBtn');
const signupTabBtn = document.getElementById('signupTabBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginSpinner = document.getElementById('loginSpinner');
const signupSpinner = document.getElementById('signupSpinner');
const totalSpentElement = document.getElementById('totalSpent');
const totalReceivedElement = document.getElementById('totalReceived');
const monthlyBudgetElement = document.getElementById('monthlyBudget');
const balanceElement = document.getElementById('balance');

// Group expense elements
const groupForm = document.getElementById('groupForm');
const groupExpenseForm = document.getElementById('groupExpenseForm');
const groupList = document.getElementById('groupList');
const groupExpenseList = document.getElementById('groupExpenseList');
const groupSettlementList = document.getElementById('groupSettlementList');

// Profile elements
const profileBtn = document.getElementById('profileBtn');
const profileForm = document.getElementById('profileForm');
const bankDetailsForm = document.getElementById('bankDetailsForm');
const notificationForm = document.getElementById('notificationForm');
const verifyMobileBtn = document.getElementById('verifyMobileBtn');
const mobileVerificationStatus = document.getElementById('mobileVerificationStatus');

// Trip planning elements
const tripPlanningForm = document.getElementById('tripPlanningForm');
const tripDetails = document.getElementById('tripDetails');
const noTripSelected = document.getElementById('noTripSelected');
const tripSummary = document.getElementById('tripSummary');
const noTripSummary = document.getElementById('noTripSummary');
const exportTripBtn = document.getElementById('exportTripBtn');

// Initialize charts
let categoryChartInstance;
let trendChartInstance;
let tripCostChartInstance;

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    // Initialize all necessary components
    setupEventListeners();
    createInitialParticles();

    // Load groups and update UI
    loadGroups();
    updateGroupDropdown();

    // Show login form by default
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
    loginTabBtn.classList.add('active');
    signupTabBtn.classList.remove('active');

    // Load profile data
    loadProfileData();

    // Add mobile verification button event listener
    if (verifyMobileBtn) {
        verifyMobileBtn.addEventListener('click', handleMobileVerification);
    }

    // Add forgot password link event listener
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', handleForgotPassword);
    }

    // Setup enhanced background
    setupBackground();
    addFloatingElementStyles();

    // Add back button to AI assistant section
    const aiAssistant = document.getElementById('aiAssistant');
    if (aiAssistant) {
        const backButton = document.createElement('button');
        backButton.className = 'btn-magic bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg mb-4';
        backButton.innerHTML = '<i class="fas fa-arrow-left mr-2"></i>Back to Dashboard';
        backButton.onclick = goBackToMain;
        aiAssistant.insertBefore(backButton, aiAssistant.firstChild);
    }

    // Trip planning form
    if (tripPlanningForm) {
        tripPlanningForm.addEventListener('submit', handleTripPlanningSubmit);
    }

    // Cost edit buttons
    const editButtons = {
        accommodation: document.getElementById('editAccommodationBtn'),
        transportation: document.getElementById('editTransportationBtn'),
        food: document.getElementById('editFoodBtn'),
        activities: document.getElementById('editActivitiesBtn'),
        shopping: document.getElementById('editShoppingBtn'),
        misc: document.getElementById('editMiscBtn')
    };

    Object.entries(editButtons).forEach(([category, button]) => {
        if (button) {
            button.addEventListener('click', () => handleCostEdit(category));
        }
    });

    // Export button
    if (exportTripBtn) {
        exportTripBtn.addEventListener('click', exportTripPlan);
    }

    // Load most recent trip if exists
    const trips = JSON.parse(localStorage.getItem('trips') || '[]');
    if (trips.length > 0) {
        const currentTrip = trips[trips.length - 1];
        updateTripDetails(currentTrip);
        updateCostBreakdown(currentTrip);
        updateTripSummary(currentTrip);
    }

    // Initialize camera functionality
    document.addEventListener('DOMContentLoaded', function () {
        console.log('Initializing camera functionality...');

        // Get camera button element
        const cameraBtn = document.getElementById('cameraBtn');
        if (!cameraBtn) {
            console.error('Camera button not found!');
            return;
        }

        // Add event listener for camera button
        cameraBtn.addEventListener('click', async function () {
            console.log('Camera button clicked');
            await handleCamera();
        });
    });
});

// Replace the bubble creation functions with a more engaging particle system
function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Random size between 10px and 30px
    const size = Math.random() * 20 + 10;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    // Position at mouse coordinates
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;

    // Random animation delay
    particle.style.animationDelay = `${Math.random() * 2}s`;

    // Random finance icon
    const icons = [
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>',
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/></svg>',
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>',
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>',
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/><path d="M7 12h2v5H7zm4-7h2v12h-2zm4 4h2v8h-2z"/></svg>',
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>'
    ];

    // Random color from a finance-themed palette
    const colors = [
        'rgba(79, 70, 229, 0.6)', // Indigo
        'rgba(124, 58, 237, 0.6)', // Purple
        'rgba(16, 185, 129, 0.6)', // Green
        'rgba(245, 158, 11, 0.6)', // Amber
        'rgba(239, 68, 68, 0.6)', // Red
        'rgba(59, 130, 246, 0.6)'  // Blue
    ];

    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.color = randomColor;

    // Add a random finance icon
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    particle.innerHTML = randomIcon;

    // Add to the background container
    document.querySelector('.bg-container').appendChild(particle);

    // Remove after animation completes
    setTimeout(() => {
        particle.style.opacity = '0';
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }, 8000);
}

// Create a trail effect when mouse moves
function createParticleTrail(e) {
    // Create multiple particles for a trail effect
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            createParticle(e.clientX, e.clientY);
        }, i * 100);
    }
}

// Create initial particles
function createInitialParticles() {
    const container = document.querySelector('.bg-container');
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    // Create 20 initial particles at random positions
    for (let i = 0; i < 20; i++) {
        const x = Math.random() * containerWidth;
        const y = Math.random() * containerHeight;
        createParticle(x, y);
    }
}

// Create a connection line between particles
function createConnectionLines() {
    const particles = document.querySelectorAll('.particle');
    const container = document.querySelector('.bg-container');

    // Clear existing lines
    const existingLines = document.querySelectorAll('.connection-line');
    existingLines.forEach(line => line.remove());

    // Create lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const p1 = particles[i];
            const p2 = particles[j];

            const rect1 = p1.getBoundingClientRect();
            const rect2 = p2.getBoundingClientRect();

            const x1 = rect1.left + rect1.width / 2;
            const y1 = rect1.top + rect1.height / 2;
            const x2 = rect2.left + rect2.width / 2;
            const y2 = rect2.top + rect2.height / 2;

            // Calculate distance
            const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

            // Only connect particles that are close to each other
            if (distance < 200) {
                const line = document.createElement('div');
                line.className = 'connection-line';

                // Calculate line position and rotation
                const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
                const centerX = (x1 + x2) / 2;
                const centerY = (y1 + y2) / 2;

                line.style.width = `${distance}px`;
                line.style.left = `${centerX - distance / 2}px`;
                line.style.top = `${centerY}px`;
                line.style.transform = `rotate(${angle}deg)`;

                // Add to container
                container.appendChild(line);
            }
        }
    }
}

// Setup event listeners
function setupEventListeners() {
    console.log('Setting up event listeners');

    // Login form submission
    if (loginForm) {
        console.log('Adding login form event listener');
        loginForm.addEventListener('submit', handleLogin);
    } else {
        console.error('Login form not found');
    }

    // Signup form submission
    signupForm.addEventListener('submit', handleSignup);

    // Tab switching
    loginTabBtn.addEventListener('click', () => switchAuthTab('login'));
    signupTabBtn.addEventListener('click', () => switchAuthTab('signup'));

    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Voice assistant button
    const startVoiceBtn = document.getElementById('startVoice');
    if (startVoiceBtn) {
        console.log('Adding voice button event listener');
        startVoiceBtn.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Voice button clicked');
            startListening();
        });
    } else {
        console.error('Voice button not found');
    }

    // Menu button click
    const menuBtn = document.getElementById('menuBtn');
    if (menuBtn) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const menuDropdown = document.getElementById('menuDropdown');
            menuDropdown.classList.toggle('show');
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const menuBtn = document.getElementById('menuBtn');
        const menuDropdown = document.getElementById('menuDropdown');

        if (menuBtn && menuDropdown && !menuBtn.contains(e.target) && !menuDropdown.contains(e.target)) {
            menuDropdown.classList.remove('show');
        }
    });

    // Menu item clicks
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = item.getAttribute('data-tab');
            switchTab(target);
            const menuDropdown = document.getElementById('menuDropdown');
            menuDropdown.classList.remove('show');
        });
    });

    // Transaction form submission
    if (transactionForm) {
        transactionForm.addEventListener('submit', handleTransactionSubmit);
    }

    // Group form submission
    if (groupForm) {
        groupForm.addEventListener('submit', handleGroupSubmit);
    }

    // Group expense form submission
    if (groupExpenseForm) {
        groupExpenseForm.addEventListener('submit', handleGroupExpenseSubmit);
    }

    // Group selection change
    const expenseGroupSelect = document.getElementById('expenseGroup');
    if (expenseGroupSelect) {
        expenseGroupSelect.addEventListener('change', function (e) {
            const groupId = parseInt(e.target.value);
            updateGroupExpenseForm(groupId);
        });
    }

    // Profile button click
    if (profileBtn) {
        profileBtn.addEventListener('click', () => switchTab('profile'));
    }

    // Profile form submission
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileSubmit);
    }

    // Bank details form submission
    if (bankDetailsForm) {
        bankDetailsForm.addEventListener('submit', handleBankDetailsSubmit);
    }

    // Notification form submission
    if (notificationForm) {
        notificationForm.addEventListener('submit', handleNotificationSubmit);
    }

    // Mobile verification button
    if (verifyMobileBtn) {
        verifyMobileBtn.addEventListener('click', handleMobileVerification);
    }

    // Add event listeners for transaction history filtering and sorting
    const historyFilter = document.getElementById('historyFilter');
    const historySort = document.getElementById('historySort');

    if (historyFilter) {
        historyFilter.addEventListener('change', () => updateTransactionList());
    }

    if (historySort) {
        historySort.addEventListener('change', () => updateTransactionList());
    }

    // Add event listeners for social login buttons
    const googleLoginBtn = document.querySelector('.social-btn:nth-child(1)');
    const facebookLoginBtn = document.querySelector('.social-btn:nth-child(2)');
    const appleLoginBtn = document.querySelector('.social-btn:nth-child(3)');
    const githubLoginBtn = document.querySelector('.social-btn:nth-child(4)');

    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', handleGoogleLogin);
    }

    if (facebookLoginBtn) {
        facebookLoginBtn.addEventListener('click', handleFacebookLogin);
    }

    if (appleLoginBtn) {
        appleLoginBtn.addEventListener('click', handleAppleLogin);
    }

    if (githubLoginBtn) {
        githubLoginBtn.addEventListener('click', handleGithubLogin);
    }

    // Add mouse move event for particle creation
    document.addEventListener('mousemove', createParticleTrail);

    // Create initial particles
    createInitialParticles();

    // Create connection lines periodically
    setInterval(createConnectionLines, 1000);
}

// Switch between login and signup tabs
function switchAuthTab(tab) {
    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
        loginTabBtn.classList.add('active');
        signupTabBtn.classList.remove('active');
    } else {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        loginTabBtn.classList.remove('active');
        signupTabBtn.classList.add('active');
    }
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();

    // Show loading spinner
    const loginSpinner = document.getElementById('loginSpinner');
    loginSpinner.classList.remove('hidden');

    // Simulate API call delay
    setTimeout(() => {
        // Hide spinner
        loginSpinner.classList.add('hidden');

        // Get the main container and dashboard
        const mainContainer = document.querySelector('.max-w-md');
        const dashboard = document.getElementById('dashboard');

        // Add slide-out animation to login container
        mainContainer.classList.add('animate-slide-out');

        // After animation completes, hide login and show dashboard
        setTimeout(() => {
            mainContainer.classList.add('hidden');
            mainContainer.style.display = 'none';

            // Show and animate dashboard entrance
            dashboard.classList.remove('hidden');
            dashboard.style.display = 'block';
            dashboard.classList.add('animate-slide-in');

            // Initialize dashboard components
            initializeCharts();
            loadTransactions();
            updateSummaryCards();
        }, 500); // Match this with the animation duration in CSS

    }, 1000); // Simulate API delay
}

// Handle logout
function handleLogout() {
    // Make a request to the server's logout endpoint
    fetch('/logout')
        .then(response => {
            if (response.ok) {
                // Hide dashboard and show login container
                dashboard.classList.add('hidden');
                document.querySelector('.max-w-md').classList.remove('hidden');

                // Reset to login tab
                switchAuthTab('login');

                // Clear any stored user data
                localStorage.removeItem('user');
            } else {
                console.error('Logout failed');
            }
        })
        .catch(error => {
            console.error('Error during logout:', error);
        });
}

// Handle signup form submission
function handleSignup(e) {
    e.preventDefault();
    const submitBtn = signupForm.querySelector('button[type="submit"]');

    // Show loading state
    submitBtn.disabled = true;
    if (signupSpinner) {
        signupSpinner.classList.remove('hidden');
    }

    // Simulate form submission
    setTimeout(() => {
        // Switch back to login form
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        loginTabBtn.classList.add('active');
        signupTabBtn.classList.remove('active');

        // Reset form
        signupForm.reset();
        submitBtn.disabled = false;
        if (signupSpinner) {
            signupSpinner.classList.add('hidden');
        }
    }, 1500);
}

// Toggle menu dropdown
function toggleMenu() {
    const menuDropdown = document.getElementById('menuDropdown');
    menuDropdown.classList.toggle('show');
}

// Switch between content sections
function switchTab(target) {
    // Hide all sections
    document.querySelectorAll('.tab-content').forEach(section => {
        section.classList.add('hidden');
    });

    // Show target section
    const targetSection = document.getElementById(`${target}-tab`);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }

    // Update active menu item
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-tab') === target) {
            item.classList.add('active');
        }
    });

    // Hide menu dropdown
    const menuDropdown = document.getElementById('menuDropdown');
    if (menuDropdown) {
        menuDropdown.classList.add('hidden');
    }
}

// Initialize charts
function initializeCharts() {
    // Get actual transaction data
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');

    // Expense by Category Chart
    if (categoryChart) {
        const categoryCtx = categoryChart.getContext('2d');

        // Calculate category data from actual transactions
        const categoryData = {};
        transactions.forEach(transaction => {
            if (transaction.type === 'expense') {
                categoryData[transaction.category] = (categoryData[transaction.category] || 0) + transaction.amount;
            }
        });

        // If no categories found, use default categories with zero values
        const labels = Object.keys(categoryData).length > 0 ?
            Object.keys(categoryData) :
            ['Food & Dining', 'Transportation', 'Shopping', 'Bills', 'Entertainment'];
        const data = Object.keys(categoryData).length > 0 ?
            Object.values(categoryData) :
            [0, 0, 0, 0, 0];

        categoryChartInstance = new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        '#6366f1',
                        '#8b5cf6',
                        '#ec4899',
                        '#f59e0b',
                        '#10b981'
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

        // Set default period to "All Time"
        const categoryPeriodSelect = document.getElementById('categoryChartPeriod');
        if (categoryPeriodSelect) {
            categoryPeriodSelect.value = 'all';
        }

        // Add event listener for period change
        categoryPeriodSelect.addEventListener('change', function () {
            updateCharts();
        });
    }

    // Income vs Expenses Chart
    if (trendChart) {
        const trendCtx = trendChart.getContext('2d');

        // Calculate monthly data from actual transactions
        const monthlyData = {};
        transactions.forEach(transaction => {
            const date = new Date(transaction.date);
            const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });

            if (!monthlyData[monthYear]) {
                monthlyData[monthYear] = { income: 0, expense: 0 };
            }

            if (transaction.type === 'income') {
                monthlyData[monthYear].income += transaction.amount;
            } else {
                monthlyData[monthYear].expense += transaction.amount;
            }
        });

        // Sort months chronologically
        const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
            const [monthA, yearA] = a.split(' ');
            const [monthB, yearB] = b.split(' ');
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const monthIndexA = months.indexOf(monthA);
            const monthIndexB = months.indexOf(monthB);

            if (yearA !== yearB) {
                return parseInt(yearA) - parseInt(yearB);
            }
            return monthIndexA - monthIndexB;
        });

        // If no data found, use last 6 months with zero values
        const labels = sortedMonths.length > 0 ? sortedMonths : getLastSixMonths();
        const incomeData = sortedMonths.map(month => monthlyData[month].income);
        const expenseData = sortedMonths.map(month => monthlyData[month].expense);

        trendChartInstance = new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Income',
                        data: incomeData,
                        borderColor: '#10b981',
                        tension: 0.4
                    },
                    {
                        label: 'Expenses',
                        data: expenseData,
                        borderColor: '#ef4444',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Set default period to "All Time"
        const trendPeriodSelect = document.getElementById('trendChartPeriod');
        if (trendPeriodSelect) {
            trendPeriodSelect.value = 'all';
        }

        // Add event listener for period change
        trendPeriodSelect.addEventListener('change', function () {
            updateCharts();
        });
    }
}

// Helper function to get last 6 months labels
function getLastSixMonths() {
    const months = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        months.push(date.toLocaleString('default', { month: 'short', year: 'numeric' }));
    }
    return months;
}

// Handle transaction form submission
function handleTransactionSubmit(e) {
    e.preventDefault();

    // Get form values
    const type = document.getElementById('transactionType').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;

    const transaction = {
        id: Date.now(),
        type: type,
        amount: amount,
        category: category,
        date: date,
        description: description
    };

    // Save transaction
    saveTransaction(transaction);

    // Update UI
    updateTransactionList();
    updateCharts();
    updateSummaryCards();

    // Reset form
    transactionForm.reset();
}

// Save transaction to localStorage
function saveTransaction(transaction) {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Load transactions from localStorage
function loadTransactions() {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    updateTransactionList(transactions);
    updateSummaryCards();
}

// Update summary cards
function updateSummaryCards() {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');

    // Calculate totals
    let totalSpent = 0;
    let totalReceived = 0;

    transactions.forEach(transaction => {
        if (transaction.type === 'expense') {
            totalSpent += transaction.amount;
        } else {
            totalReceived += transaction.amount;
        }
    });

    // Calculate monthly budget (example: 30% of total income)
    const monthlyBudget = totalReceived * 0.3;

    // Calculate balance
    const balance = totalReceived - totalSpent;

    // Update UI
    if (totalSpentElement) {
        totalSpentElement.textContent = `₹${totalSpent.toFixed(2)}`;
    }

    if (totalReceivedElement) {
        totalReceivedElement.textContent = `₹${totalReceived.toFixed(2)}`;
    }

    if (monthlyBudgetElement) {
        monthlyBudgetElement.textContent = `₹${monthlyBudget.toFixed(2)}`;
    }

    if (balanceElement) {
        balanceElement.textContent = `₹${balance.toFixed(2)}`;
    }
}

// Update transaction list
function updateTransactionList(transactions = null) {
    if (!transactions) {
        transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    }

    if (!transactionList) return;

    // Get filter and sort values
    const filterValue = document.getElementById('historyFilter').value;
    const sortValue = document.getElementById('historySort').value;

    // Filter transactions
    let filteredTransactions = [...transactions];
    if (filterValue !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => t.type === filterValue);
    }

    // Sort transactions
    filteredTransactions.sort((a, b) => {
        switch (sortValue) {
            case 'date_desc':
                return new Date(b.date) - new Date(a.date);
            case 'date_asc':
                return new Date(a.date) - new Date(b.date);
            case 'amount_desc':
                return b.amount - a.amount;
            case 'amount_asc':
                return a.amount - b.amount;
            default:
                return 0;
        }
    });

    // Clear existing transactions
    transactionList.innerHTML = '';

    // Add transactions to the list
    filteredTransactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.className = 'border-t border-gray-200';

        // Format date
        const date = new Date(transaction.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        // Set row content
        row.innerHTML = `
            <td class="py-3">${formattedDate}</td>
            <td class="py-3">
                <span class="px-2 py-1 rounded-full text-xs ${transaction.type === 'expense' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}">
                    ${transaction.type === 'expense' ? 'Expense' : 'Income'}
                </span>
            </td>
            <td class="py-3">${transaction.category}</td>
            <td class="py-3">${transaction.description}</td>
            <td class="py-3 font-medium ${transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'}">
                ${transaction.type === 'expense' ? '-' : '+'}₹${transaction.amount.toFixed(2)}
            </td>
            <td class="py-3">
                <button class="text-red-500 hover:text-red-700" onclick="deleteTransaction(${transaction.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        transactionList.appendChild(row);
    });

    // Show message if no transactions
    if (filteredTransactions.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="6" class="py-4 text-center text-gray-500">
                No transactions found
            </td>
        `;
        transactionList.appendChild(emptyRow);
    }
}

// Delete transaction
function deleteTransaction(id) {
    let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    transactions = transactions.filter(t => t.id !== id);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    updateTransactionList();
    updateCharts();
    updateSummaryCards();
}

// Update charts with latest data
function updateCharts() {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');

    // Get selected time periods
    const categoryPeriod = document.getElementById('categoryChartPeriod').value;
    const trendPeriod = document.getElementById('trendChartPeriod').value;

    // Filter transactions by period for category chart
    const categoryFilteredTransactions = filterTransactionsByPeriod(transactions, categoryPeriod);

    // Update expense chart
    if (categoryChartInstance) {
        const expenseData = {};
        categoryFilteredTransactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                expenseData[t.category] = (expenseData[t.category] || 0) + t.amount;
            });

        categoryChartInstance.data.datasets[0].data = Object.values(expenseData);
        categoryChartInstance.data.labels = Object.keys(expenseData);
        categoryChartInstance.update();
    }

    // Filter transactions by period for trend chart
    const trendFilteredTransactions = filterTransactionsByPeriod(transactions, trendPeriod);

    // Update income vs expenses chart
    if (trendChartInstance) {
        const monthlyData = {};

        // Group data by appropriate time unit based on selected period
        trendFilteredTransactions.forEach(t => {
            let timeKey;
            const date = new Date(t.date);

            switch (trendPeriod) {
                case 'day':
                    // Group by hour for daily view
                    timeKey = date.getHours() + ':00';
                    break;
                case 'week':
                    // Group by day of week
                    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    timeKey = days[date.getDay()];
                    break;
                case 'month':
                    // Group by day of month
                    timeKey = date.getDate();
                    break;
                case 'year':
                    // Group by month
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    timeKey = months[date.getMonth()];
                    break;
                default:
                    // For 'all' or any other value, group by month
                    const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    timeKey = allMonths[date.getMonth()] + ' ' + date.getFullYear();
            }

            if (!monthlyData[timeKey]) {
                monthlyData[timeKey] = { income: 0, expense: 0 };
            }

            if (t.type === 'income') {
                monthlyData[timeKey].income += t.amount;
            } else {
                monthlyData[timeKey].expense += t.amount;
            }
        });

        // Sort time keys based on period
        const timeKeys = Object.keys(monthlyData).sort((a, b) => {
            if (trendPeriod === 'day') {
                // Sort hours numerically
                return parseInt(a) - parseInt(b);
            } else if (trendPeriod === 'week') {
                // Sort days of week
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                return days.indexOf(a) - days.indexOf(b);
            } else if (trendPeriod === 'month') {
                // Sort days numerically
                return parseInt(a) - parseInt(b);
            } else if (trendPeriod === 'year') {
                // Sort months
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return months.indexOf(a) - months.indexOf(b);
            } else {
                // For 'all', try to sort by date
                try {
                    const [monthA, yearA] = a.split(' ');
                    const [monthB, yearB] = b.split(' ');
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const monthIndexA = months.indexOf(monthA);
                    const monthIndexB = months.indexOf(monthB);

                    if (yearA !== yearB) {
                        return parseInt(yearA) - parseInt(yearB);
                    } else {
                        return monthIndexA - monthIndexB;
                    }
                } catch (e) {
                    // If parsing fails, use string comparison
                    return a.localeCompare(b);
                }
            }
        });

        trendChartInstance.data.labels = timeKeys;
        trendChartInstance.data.datasets[0].data = timeKeys.map(key => monthlyData[key].income);
        trendChartInstance.data.datasets[1].data = timeKeys.map(key => monthlyData[key].expense);
        trendChartInstance.update();
    }
}

// Filter transactions by time period
function filterTransactionsByPeriod(transactions, period) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);

        switch (period) {
            case 'day':
                // Today only
                return transactionDate >= today;
            case 'week':
                // This week (last 7 days)
                const weekAgo = new Date(today);
                weekAgo.setDate(today.getDate() - 7);
                return transactionDate >= weekAgo;
            case 'month':
                // This month
                const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                return transactionDate >= firstDayOfMonth;
            case 'year':
                // This year
                const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
                return transactionDate >= firstDayOfYear;
            case 'all':
                // All transactions
                return true;
            default:
                return true;
        }
    });
}

// Group Expense Functions

// Handle group form submission
function handleGroupSubmit(e) {
    e.preventDefault();

    // Get form values
    const groupName = document.getElementById('groupName').value;
    const membersInput = document.getElementById('groupMembers').value;

    // Split members by comma and trim whitespace
    const members = membersInput.split(',').map(member => member.trim());

    // Create group object
    const group = {
        id: Date.now(),
        name: groupName,
        members: members,
        expenses: []
    };

    // Save group
    saveGroup(group);

    // Update UI
    updateGroupList();
    updateGroupDropdown();

    // Reset form
    groupForm.reset();

    // Show success message
    alert('Group created successfully!');
}

// Save group to localStorage
function saveGroup(group) {
    const groups = JSON.parse(localStorage.getItem('groups') || '[]');
    groups.push(group);
    localStorage.setItem('groups', JSON.stringify(groups));
}

// Load groups from localStorage
function loadGroups() {
    const groups = JSON.parse(localStorage.getItem('groups') || '[]');
    updateGroupList(groups);
}

// Update group list
function updateGroupList(groups = null) {
    if (!groups) {
        groups = JSON.parse(localStorage.getItem('groups') || '[]');
    }

    if (!groupList) return;

    groupList.innerHTML = '';

    if (groups.length === 0) {
        groupList.innerHTML = '<p class="text-gray-500 text-center py-4">No groups created yet. Create a group to get started!</p>';
        return;
    }

    groups.forEach(group => {
        const groupCard = document.createElement('div');
        groupCard.className = 'glass-card p-4 rounded-xl mb-4';
        groupCard.innerHTML = `
            <div class="flex justify-between items-center">
                <h3 class="text-lg font-semibold">${group.name}</h3>
                <div class="flex space-x-2">
                    <button onclick="viewGroupExpenses(${group.id})" class="text-indigo-600 hover:text-indigo-800">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button onclick="deleteGroup(${group.id})" class="text-red-600 hover:text-red-800">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
            <div class="mt-2">
                <p class="text-sm text-gray-600">Members: ${group.members.join(', ')}</p>
                <p class="text-sm text-gray-600">Expenses: ${group.expenses.length}</p>
            </div>
        `;
        groupList.appendChild(groupCard);
    });
}

// Delete group
function deleteGroup(id) {
    let groups = JSON.parse(localStorage.getItem('groups') || '[]');
    groups = groups.filter(g => g.id !== id);
    localStorage.setItem('groups', JSON.stringify(groups));
    updateGroupList();
}

// View group expenses
function viewGroupExpenses(groupId) {
    const groups = JSON.parse(localStorage.getItem('groups') || '[]');
    const group = groups.find(g => g.id === groupId);

    if (!group) return;

    // Update group expense form
    const groupSelect = document.getElementById('expenseGroup');
    if (groupSelect) {
        groupSelect.value = groupId;
        updateGroupExpenseForm(groupId);
    }

    // Update group expense list
    updateGroupExpenseList(group);

    // Update settlement list
    updateSettlementList(group);

    // Switch to groups tab
    switchTab('groups');
}

// Handle group expense form submission
function handleGroupExpenseSubmit(e) {
    e.preventDefault();

    // Get form values
    const groupId = parseInt(document.getElementById('expenseGroup').value);
    const paidBy = document.getElementById('paidBy').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const description = document.getElementById('expenseDescription').value;
    const date = document.getElementById('expenseDate').value;

    // Get group
    const groups = JSON.parse(localStorage.getItem('groups') || '[]');
    const groupIndex = groups.findIndex(g => g.id === groupId);

    if (groupIndex === -1) {
        alert('Please select a valid group');
        return;
    }

    // Create expense object
    const expense = {
        id: Date.now(),
        paidBy: paidBy,
        amount: amount,
        description: description,
        date: date
    };

    // Add expense to group
    groups[groupIndex].expenses.push(expense);

    // Save updated group
    localStorage.setItem('groups', JSON.stringify(groups));

    // Update UI
    updateGroupExpenseList(groups[groupIndex]);
    updateSettlementList(groups[groupIndex]);

    // Reset form
    groupExpenseForm.reset();

    // Show success message
    alert('Group expense added successfully!');
}

// Update group expense form when group is selected
function updateGroupExpenseForm(groupId) {
    const groups = JSON.parse(localStorage.getItem('groups') || '[]');
    const group = groups.find(g => g.id === groupId);

    if (!group) return;

    // Update paid by dropdown
    const paidBySelect = document.getElementById('paidBy');
    paidBySelect.innerHTML = '<option value="">Select a member</option>';

    group.members.forEach(member => {
        const option = document.createElement('option');
        option.value = member;
        option.textContent = member;
        paidBySelect.appendChild(option);
    });
}

// Update group expense list
function updateGroupExpenseList(group) {
    if (!groupExpenseList) return;

    groupExpenseList.innerHTML = '';

    if (!group || group.expenses.length === 0) {
        groupExpenseList.innerHTML = '<p class="text-gray-500 text-center py-4">No expenses added yet.</p>';
        return;
    }

    group.expenses.forEach(expense => {
        const expenseCard = document.createElement('div');
        expenseCard.className = 'glass-card p-4 rounded-xl mb-4';
        expenseCard.innerHTML = `
            <div class="flex justify-between items-center">
                <h3 class="text-lg font-semibold">${expense.description}</h3>
                <div class="flex space-x-2">
                    <button onclick="deleteGroupExpense(${group.id}, ${expense.id})" class="text-red-600 hover:text-red-800">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
            <div class="mt-2 grid grid-cols-2 gap-2">
                <p class="text-sm text-gray-600">Paid by: <span class="font-medium">${expense.paidBy}</span></p>
                <p class="text-sm text-gray-600">Amount: <span class="font-medium">₹${expense.amount.toFixed(2)}</span></p>
                <p class="text-sm text-gray-600">Date: <span class="font-medium">${expense.date}</span></p>
            </div>
        `;
        groupExpenseList.appendChild(expenseCard);
    });
}

// Delete group expense
function deleteGroupExpense(groupId, expenseId) {
    const groups = JSON.parse(localStorage.getItem('groups') || '[]');
    const groupIndex = groups.findIndex(g => g.id === groupId);

    if (groupIndex === -1) return;

    // Remove expense
    groups[groupIndex].expenses = groups[groupIndex].expenses.filter(e => e.id !== expenseId);

    // Save updated group
    localStorage.setItem('groups', JSON.stringify(groups));

    // Update UI
    updateGroupExpenseList(groups[groupIndex]);
    updateSettlementList(groups[groupIndex]);
}

// Update settlement list
function updateSettlementList(group) {
    if (!groupSettlementList) return;

    groupSettlementList.innerHTML = '';

    if (!group || group.expenses.length === 0) {
        groupSettlementList.innerHTML = '<p class="text-gray-500 text-center py-4">No expenses to settle.</p>';
        return;
    }

    // Calculate settlements
    const settlements = calculateSettlements(group);

    // Display settlements
    const settlementCard = document.createElement('div');
    settlementCard.className = 'glass-card p-4 rounded-xl mb-4';

    let settlementHTML = '<h3 class="text-lg font-semibold mb-4">Settlement Summary</h3>';

    if (settlements.length === 0) {
        settlementHTML += '<p class="text-green-600 text-center py-2">All expenses are settled!</p>';
    } else {
        settlementHTML += '<div class="space-y-2">';
        settlements.forEach(settlement => {
            settlementHTML += `
                <div class="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <span class="font-medium">${settlement.from}</span>
                    <span class="text-gray-500">pays</span>
                    <span class="font-medium">${settlement.to}</span>
                    <span class="text-indigo-600 font-bold">₹${settlement.amount.toFixed(2)}</span>
                </div>
            `;
        });
        settlementHTML += '</div>';
    }

    settlementCard.innerHTML = settlementHTML;
    groupSettlementList.appendChild(settlementCard);
}

// Calculate settlements
function calculateSettlements(group) {
    // Initialize balances for each member
    const balances = {};
    group.members.forEach(member => {
        balances[member] = 0;
    });

    // Calculate how much each person paid
    group.expenses.forEach(expense => {
        balances[expense.paidBy] += expense.amount;
    });

    // Calculate how much each person should pay (equal split)
    const totalExpenses = group.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const perPersonShare = totalExpenses / group.members.length;

    // Calculate net balance for each person
    group.members.forEach(member => {
        balances[member] -= perPersonShare;
    });

    // Create settlements
    const settlements = [];
    const debtors = [];
    const creditors = [];

    // Separate debtors and creditors
    group.members.forEach(member => {
        if (balances[member] < 0) {
            debtors.push({ name: member, amount: Math.abs(balances[member]) });
        } else if (balances[member] > 0) {
            creditors.push({ name: member, amount: balances[member] });
        }
    });

    // Sort by amount (highest first)
    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    // Create settlements
    let debtorIndex = 0;
    let creditorIndex = 0;

    while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
        const debtor = debtors[debtorIndex];
        const creditor = creditors[creditorIndex];

        const amount = Math.min(debtor.amount, creditor.amount);

        if (amount > 0) {
            settlements.push({
                from: debtor.name,
                to: creditor.name,
                amount: amount
            });

            debtor.amount -= amount;
            creditor.amount -= amount;

            if (debtor.amount === 0) {
                debtorIndex++;
            }

            if (creditor.amount === 0) {
                creditorIndex++;
            }
        }
    }

    return settlements;
}

// Update group dropdown with available groups
function updateGroupDropdown() {
    const groups = JSON.parse(localStorage.getItem('groups') || '[]');
    const groupSelect = document.getElementById('expenseGroup');

    if (!groupSelect) return;

    // Clear existing options except the first one
    groupSelect.innerHTML = '<option value="">Select a group</option>';

    // Add groups to dropdown
    groups.forEach(group => {
        const option = document.createElement('option');
        option.value = group.id;
        option.textContent = group.name;
        groupSelect.appendChild(option);
    });
}

// Handle profile form submission
function handleProfileSubmit(e) {
    e.preventDefault();

    // Get form values
    const userName = document.getElementById('userName').value;
    const userEmail = document.getElementById('userEmail').value;
    const userMobile = document.getElementById('userMobile').value;
    const userAddress = document.getElementById('userAddress').value;

    // Create profile object
    const profile = {
        userName: userName,
        userEmail: userEmail,
        userMobile: userMobile,
        userAddress: userAddress,
        lastUpdated: new Date().toISOString()
    };

    // Save profile to localStorage
    localStorage.setItem('userProfile', JSON.stringify(profile));

    // Show success message
    alert('Profile saved successfully!');
}

// Handle bank details form submission
function handleBankDetailsSubmit(e) {
    e.preventDefault();

    // Get form values
    const bankName = document.getElementById('bankName').value;
    const accountNumber = document.getElementById('accountNumber').value;
    const ifscCode = document.getElementById('ifscCode').value;
    const accountType = document.getElementById('accountType').value;
    const autoSync = document.getElementById('autoSync').checked;

    // Create bank details object
    const bankDetails = {
        bankName: bankName,
        accountNumber: accountNumber,
        ifscCode: ifscCode,
        accountType: accountType,
        autoSync: autoSync,
        lastUpdated: new Date().toISOString()
    };

    // Save bank details to localStorage
    localStorage.setItem('bankDetails', JSON.stringify(bankDetails));

    // Show success message
    alert('Bank details saved successfully!');
}

// Handle notification form submission
function handleNotificationSubmit(e) {
    e.preventDefault();

    // Get form values
    const smsAlerts = document.getElementById('smsAlerts').checked;
    const emailAlerts = document.getElementById('emailAlerts').checked;
    const budgetAlerts = document.getElementById('budgetAlerts').checked;
    const groupExpenseAlerts = document.getElementById('groupExpenseAlerts').checked;

    // Create notification preferences object
    const notificationPreferences = {
        smsAlerts: smsAlerts,
        emailAlerts: emailAlerts,
        budgetAlerts: budgetAlerts,
        groupExpenseAlerts: groupExpenseAlerts,
        lastUpdated: new Date().toISOString()
    };

    // Save notification preferences to localStorage
    localStorage.setItem('notificationPreferences', JSON.stringify(notificationPreferences));

    // Show success message
    alert('Notification preferences saved successfully!');
}

// Handle mobile verification
function handleMobileVerification() {
    const countryCode = document.getElementById('countryCode').value;
    const mobileNumber = document.getElementById('userMobile').value;

    if (!mobileNumber) {
        alert('Please enter a mobile number');
        return;
    }

    // Show verification status
    mobileVerificationStatus.innerHTML = '<p class="text-yellow-500">Sending verification code...</p>';

    // Generate a random 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    // Store the verification code temporarily
    sessionStorage.setItem('verificationCode', verificationCode);
    sessionStorage.setItem('verificationMobile', `${countryCode}${mobileNumber}`);
    sessionStorage.setItem('verificationTimestamp', Date.now());

    // Simulate sending verification code (for demo purposes)
    setTimeout(() => {
        // Show verification input field
        mobileVerificationStatus.innerHTML = `
            <div class="mt-2">
                <p class="text-green-500">Verification code sent!</p>
                <p class="text-sm text-gray-500">Demo code: ${verificationCode}</p>
                <div class="flex space-x-2 mt-2">
                    <input type="text" id="verificationCodeInput" 
                        class="input-glow w-full px-3 py-2 border rounded-lg" 
                        placeholder="Enter 6-digit code">
                    <button id="verifyCodeBtn" class="btn-magic bg-indigo-500 text-white px-4 py-2 rounded-lg">
                        Verify
                    </button>
                </div>
            </div>
        `;

        // Add event listener to the verify button
        document.getElementById('verifyCodeBtn').addEventListener('click', verifyCode);
    }, 1500);
}

// Function to verify the code entered by the user
function verifyCode() {
    const enteredCode = document.getElementById('verificationCodeInput').value;
    const storedCode = sessionStorage.getItem('verificationCode');
    const storedMobile = sessionStorage.getItem('verificationMobile');
    const timestamp = parseInt(sessionStorage.getItem('verificationTimestamp'));

    // Check if code is expired (10 minutes)
    const now = Date.now();
    const isExpired = now - timestamp > 10 * 60 * 1000;

    if (isExpired) {
        mobileVerificationStatus.innerHTML = '<p class="text-red-500">Verification code expired. Please request a new one.</p>';
        return;
    }

    if (enteredCode === storedCode) {
        mobileVerificationStatus.innerHTML = '<p class="text-green-500">Mobile number verified successfully!</p>';

        // Save verification status
        const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
        profile.mobileVerified = true;
        profile.verifiedMobile = storedMobile;
        localStorage.setItem('userProfile', JSON.stringify(profile));

        // Clear session storage
        sessionStorage.removeItem('verificationCode');
        sessionStorage.removeItem('verificationMobile');
        sessionStorage.removeItem('verificationTimestamp');
    } else {
        mobileVerificationStatus.innerHTML = '<p class="text-red-500">Invalid verification code. Please try again.</p>';
    }
}

// Load profile data
function loadProfileData() {
    // Load user profile
    const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    if (profile.userName) {
        document.getElementById('userName').value = profile.userName;
    }
    if (profile.userEmail) {
        document.getElementById('userEmail').value = profile.userEmail;
    }
    if (profile.userMobile) {
        document.getElementById('userMobile').value = profile.userMobile;
    }
    if (profile.userAddress) {
        document.getElementById('userAddress').value = profile.userAddress;
    }
    if (profile.mobileVerified) {
        mobileVerificationStatus.innerHTML = '<p class="text-green-500">Mobile number verified!</p>';
    }

    // Load bank details
    const bankDetails = JSON.parse(localStorage.getItem('bankDetails') || '{}');
    if (bankDetails.bankName) {
        document.getElementById('bankName').value = bankDetails.bankName;
    }
    if (bankDetails.accountNumber) {
        document.getElementById('accountNumber').value = bankDetails.accountNumber;
    }
    if (bankDetails.ifscCode) {
        document.getElementById('ifscCode').value = bankDetails.ifscCode;
    }
    if (bankDetails.accountType) {
        document.getElementById('accountType').value = bankDetails.accountType;
    }
    if (bankDetails.autoSync !== undefined) {
        document.getElementById('autoSync').checked = bankDetails.autoSync;
    }

    // Load notification preferences
    const notificationPreferences = JSON.parse(localStorage.getItem('notificationPreferences') || '{}');
    if (notificationPreferences.smsAlerts !== undefined) {
        document.getElementById('smsAlerts').checked = notificationPreferences.smsAlerts;
    }
    if (notificationPreferences.emailAlerts !== undefined) {
        document.getElementById('emailAlerts').checked = notificationPreferences.emailAlerts;
    }
    if (notificationPreferences.budgetAlerts !== undefined) {
        document.getElementById('budgetAlerts').checked = notificationPreferences.budgetAlerts;
    }
    if (notificationPreferences.groupExpenseAlerts !== undefined) {
        document.getElementById('groupExpenseAlerts').checked = notificationPreferences.groupExpenseAlerts;
    }
}

// Handle Google login
function handleGoogleLogin() {
    // Show loading state
    const googleBtn = document.querySelector('.social-btn:nth-child(1)');
    const originalContent = googleBtn.innerHTML;
    googleBtn.innerHTML = `
        <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Connecting...
    `;

    // Try to get device credentials with fallback
    getDeviceCredentialsWithFallback('Google')
        .then(credentials => {
            // Show account selection modal with credentials
            showSocialAccountModal('Google', credentials, () => {
                // Hide login container and show dashboard
                document.querySelector('.max-w-md').classList.add('hidden');
                dashboard.classList.remove('hidden');

                // Initialize dashboard data
                initializeCharts();
                loadTransactions();
                updateSummaryCards();
                loadGroups();
            });
        })
        .catch(error => {
            console.error('Error accessing credentials:', error);
            alert('Unable to access device credentials. Please try again or use email/password login.');
        })
        .finally(() => {
            // Reset button
            googleBtn.innerHTML = originalContent;
        });
}

// Handle Facebook login
function handleFacebookLogin() {
    // Show loading state
    const facebookBtn = document.querySelector('.social-btn:nth-child(2)');
    const originalContent = facebookBtn.innerHTML;
    facebookBtn.innerHTML = `
        <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Connecting...
    `;

    // Try to get device credentials with fallback
    getDeviceCredentialsWithFallback('Facebook')
        .then(credentials => {
            // Show account selection modal with credentials
            showSocialAccountModal('Facebook', credentials, () => {
                // Hide login container and show dashboard
                document.querySelector('.max-w-md').classList.add('hidden');
                dashboard.classList.remove('hidden');

                // Initialize dashboard data
                initializeCharts();
                loadTransactions();
                updateSummaryCards();
                loadGroups();
            });
        })
        .catch(error => {
            console.error('Error accessing credentials:', error);
            alert('Unable to access device credentials. Please try again or use email/password login.');
        })
        .finally(() => {
            // Reset button
            facebookBtn.innerHTML = originalContent;
        });
}

// Handle Apple login
function handleAppleLogin() {
    // Show loading state
    const appleBtn = document.querySelector('.social-btn:nth-child(3)');
    const originalContent = appleBtn.innerHTML;
    appleBtn.innerHTML = `
        <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Connecting...
    `;

    // Try to get device credentials with fallback
    getDeviceCredentialsWithFallback('Apple')
        .then(credentials => {
            // Show account selection modal with credentials
            showSocialAccountModal('Apple', credentials, () => {
                // Hide login container and show dashboard
                document.querySelector('.max-w-md').classList.add('hidden');
                dashboard.classList.remove('hidden');

                // Initialize dashboard data
                initializeCharts();
                loadTransactions();
                updateSummaryCards();
                loadGroups();
            });
        })
        .catch(error => {
            console.error('Error accessing credentials:', error);
            alert('Unable to access device credentials. Please try again or use email/password login.');
        })
        .finally(() => {
            // Reset button
            appleBtn.innerHTML = originalContent;
        });
}

// Handle GitHub login
function handleGithubLogin() {
    // Show loading state
    const githubBtn = document.querySelector('.social-btn:nth-child(4)');
    const originalContent = githubBtn.innerHTML;
    githubBtn.innerHTML = `
        <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Connecting...
    `;

    // Try to get device credentials with fallback
    getDeviceCredentialsWithFallback('GitHub')
        .then(credentials => {
            // Show account selection modal with credentials
            showSocialAccountModal('GitHub', credentials, () => {
                // Hide login container and show dashboard
                document.querySelector('.max-w-md').classList.add('hidden');
                dashboard.classList.remove('hidden');

                // Initialize dashboard data
                initializeCharts();
                loadTransactions();
                updateSummaryCards();
                loadGroups();
            });
        })
        .catch(error => {
            console.error('Error accessing credentials:', error);
            alert('Unable to access device credentials. Please try again or use email/password login.');
        })
        .finally(() => {
            // Reset button
            githubBtn.innerHTML = originalContent;
        });
}

// Function to get device credentials with fallback
function getDeviceCredentialsWithFallback(provider) {
    return new Promise((resolve, reject) => {
        // First try to get credentials from localStorage
        const storedCredentials = getStoredCredentials(provider);
        if (storedCredentials && storedCredentials.length > 0) {
            resolve(storedCredentials);
            return;
        }

        // If no stored credentials, try to get from browser
        try {
            // Check if the browser supports the Credential Management API
            if (navigator.credentials && navigator.credentials.get) {
                navigator.credentials.get({
                    password: true,
                    mediation: 'optional'
                })
                    .then(credential => {
                        if (credential) {
                            // Create account object from credential
                            const account = {
                                name: credential.name || 'User',
                                email: credential.id || `${provider.toLowerCase()}_user@example.com`,
                                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(credential.name || 'User')}&background=${getProviderColor(provider)}&color=fff`
                            };

                            // Store the credential for future use
                            storeCredential(provider, account);

                            resolve([account]);
                        } else {
                            // No credentials found, use fallback
                            resolve(getFallbackCredentials(provider));
                        }
                    })
                    .catch(error => {
                        console.warn('Error getting credentials:', error);
                        // Use fallback on error
                        resolve(getFallbackCredentials(provider));
                    });
            } else {
                // Browser doesn't support Credential Management API, use fallback
                resolve(getFallbackCredentials(provider));
            }
        } catch (error) {
            console.warn('Error in credential retrieval:', error);
            // Use fallback on error
            resolve(getFallbackCredentials(provider));
        }
    });
}

// Function to get stored credentials from localStorage
function getStoredCredentials(provider) {
    try {
        const storedData = localStorage.getItem(`${provider.toLowerCase()}_credentials`);
        if (storedData) {
            return JSON.parse(storedData);
        }
    } catch (error) {
        console.warn('Error retrieving stored credentials:', error);
    }
    return null;
}

// Function to store credentials in localStorage
function storeCredential(provider, account) {
    try {
        const storedData = localStorage.getItem(`${provider.toLowerCase()}_credentials`);
        let credentials = [];

        if (storedData) {
            credentials = JSON.parse(storedData);
        }

        // Check if account already exists
        const existingIndex = credentials.findIndex(acc => acc.email === account.email);
        if (existingIndex === -1) {
            credentials.push(account);
            localStorage.setItem(`${provider.toLowerCase()}_credentials`, JSON.stringify(credentials));
        }
    } catch (error) {
        console.warn('Error storing credentials:', error);
    }
}

// Function to get fallback credentials
function getFallbackCredentials(provider) {
    // Get device info for more personalized fallback
    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const deviceType = isMobile ? 'Mobile' : 'Desktop';

    // Create a device-specific account
    const account = {
        name: `${deviceType} User`,
        email: `${deviceType.toLowerCase()}_user@${provider.toLowerCase()}.com`,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(`${deviceType} User`)}&background=${getProviderColor(provider)}&color=fff`
    };

    // Store the fallback credential
    storeCredential(provider, account);

    return [account];
}

// Function to get provider-specific color
function getProviderColor(provider) {
    switch (provider) {
        case 'Google':
            return '4285F4';
        case 'Facebook':
            return '1877F2';
        case 'Apple':
            return '000000';
        case 'GitHub':
            return '24292e';
        default:
            return '6366f1';
    }
}

// Function to show social account selection modal
function showSocialAccountModal(provider, accounts, onSelect) {
    // Create modal container
    const modalContainer = document.createElement('div');
    modalContainer.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in';
    modalContainer.id = 'socialAccountModal';
    modalContainer.setAttribute('data-provider', provider);

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-in';

    // Create modal header
    const modalHeader = document.createElement('div');
    modalHeader.className = 'p-4 border-b border-gray-200 flex justify-between items-center';

    const headerTitle = document.createElement('h3');
    headerTitle.className = 'text-lg font-semibold text-gray-800 header-title';
    headerTitle.textContent = `Sign in with ${provider}`;

    const closeButton = document.createElement('button');
    closeButton.className = 'text-gray-500 hover:text-gray-700 close-button';
    closeButton.innerHTML = '<i class="fas fa-times"></i>';
    closeButton.onclick = () => {
        document.body.removeChild(modalContainer);
    };

    modalHeader.appendChild(headerTitle);
    modalHeader.appendChild(closeButton);

    // Create modal body
    const modalBody = document.createElement('div');
    modalBody.className = 'p-4 max-h-96 overflow-y-auto modal-body';

    // Add accounts
    accounts.forEach(account => {
        const accountItem = document.createElement('div');
        accountItem.className = 'flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors account-item';

        accountItem.innerHTML = `
            <img src="${account.avatar}" alt="${account.name}" class="w-10 h-10 rounded-full mr-3 account-avatar">
            <div>
                <div class="font-medium text-gray-800">${account.name}</div>
                <div class="text-sm text-gray-500">${account.email}</div>
            </div>
        `;

        accountItem.onclick = () => {
            // Close modal and proceed with login
            document.body.removeChild(modalContainer);
            onSelect();
        };

        modalBody.appendChild(accountItem);
    });

    // Add "Add another account" button
    const addAccountButton = document.createElement('div');
    addAccountButton.className = 'flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors add-account-button border-t border-gray-200 mt-2 pt-3';
    addAccountButton.innerHTML = `
        <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
            <i class="fas fa-plus text-gray-500"></i>
        </div>
        <span class="text-gray-700">Add another account</span>
    `;

    addAccountButton.onclick = () => {
        // Show a message that this is a demo
        alert('This is a demo application. In a real app, this would open a new login window.');
    };

    modalBody.appendChild(addAccountButton);

    // Assemble modal
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContainer.appendChild(modalContent);

    // Add to document
    document.body.appendChild(modalContainer);

    // Add animation classes
    setTimeout(() => {
        modalContainer.classList.add('opacity-100');
        modalContent.classList.add('translate-y-0');
    }, 10);
}

// Handle forgot password
function handleForgotPassword(e) {
    e.preventDefault();

    // Create forgot password modal
    const modalContainer = document.createElement('div');
    modalContainer.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in';
    modalContainer.id = 'forgotPasswordModal';

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-in';

    // Create modal header
    const modalHeader = document.createElement('div');
    modalHeader.className = 'p-4 border-b border-gray-200 flex justify-between items-center';

    const headerTitle = document.createElement('h3');
    headerTitle.className = 'text-lg font-semibold text-gray-800';
    headerTitle.textContent = 'Reset Password';

    const closeButton = document.createElement('button');
    closeButton.className = 'text-gray-500 hover:text-gray-700';
    closeButton.innerHTML = '<i class="fas fa-times"></i>';
    closeButton.onclick = () => {
        document.body.removeChild(modalContainer);
    };

    modalHeader.appendChild(headerTitle);
    modalHeader.appendChild(closeButton);

    // Create modal body
    const modalBody = document.createElement('div');
    modalBody.className = 'p-4';

    // Create form
    const form = document.createElement('form');
    form.id = 'forgotPasswordForm';
    form.className = 'space-y-4';

    // Email input
    const emailInput = document.createElement('div');
    emailInput.className = 'space-y-1';

    const emailLabel = document.createElement('label');
    emailLabel.className = 'block text-sm font-medium text-gray-700';
    emailLabel.htmlFor = 'resetEmail';
    emailLabel.textContent = 'Email Address';

    const emailField = document.createElement('input');
    emailField.type = 'email';
    emailField.id = 'resetEmail';
    emailField.name = 'email';
    emailField.className = 'input-glow w-full px-3 py-2 border rounded-lg';
    emailField.placeholder = 'Enter your email address';
    emailField.required = true;

    emailInput.appendChild(emailLabel);
    emailInput.appendChild(emailField);

    // Submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'btn-magic w-full bg-indigo-500 text-white py-2 rounded-lg';
    submitButton.innerHTML = 'Send Reset Link';

    // Add form elements
    form.appendChild(emailInput);
    form.appendChild(submitButton);

    // Add form to modal body
    modalBody.appendChild(form);

    // Assemble modal
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContainer.appendChild(modalContent);

    // Add to document
    document.body.appendChild(modalContainer);

    // Add animation classes
    setTimeout(() => {
        modalContainer.classList.add('opacity-100');
        modalContent.classList.add('translate-y-0');
    }, 10);

    // Handle form submission
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = emailField.value;

        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <svg class="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        `;

        // Simulate sending reset link
        setTimeout(() => {
            // Create success message
            modalBody.innerHTML = `
                <div class="text-center py-6">
                    <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                        <i class="fas fa-check text-green-600 text-xl"></i>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Reset Link Sent!</h3>
                    <p class="text-sm text-gray-500 mb-4">
                        We've sent a password reset link to <strong>${email}</strong>. 
                        Please check your email and follow the instructions to reset your password.
                    </p>
                    <p class="text-xs text-gray-400">
                        Note: In a real application, this would send an actual email. 
                        For this demo, we're simulating the process.
                    </p>
                    <button id="closeForgotPasswordModal" class="mt-4 btn-magic bg-indigo-500 text-white px-4 py-2 rounded-lg">
                        Close
                    </button>
                </div>
            `;

            // Add event listener to close button
            document.getElementById('closeForgotPasswordModal').addEventListener('click', () => {
                document.body.removeChild(modalContainer);
            });
        }, 1500);
    });
}

// Enhanced Background System
function setupBackground() {
    const bgContainer = document.querySelector('.bg-container');
    if (!bgContainer) return;

    // Clear existing background elements
    bgContainer.innerHTML = '';

    // Create canvas for dynamic background
    const canvas = document.createElement('canvas');
    canvas.id = 'backgroundCanvas';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    bgContainer.appendChild(canvas);

    // Create floating financial elements
    createFloatingElements(bgContainer);

    // Initialize canvas animation
    initCanvasAnimation();
}

function createFloatingElements(container) {
    // Create floating financial icons
    const icons = [
        { icon: 'fa-chart-line', color: '#4f46e5' },
        { icon: 'fa-coins', color: '#f59e0b' },
        { icon: 'fa-wallet', color: '#10b981' },
        { icon: 'fa-piggy-bank', color: '#ec4899' },
        { icon: 'fa-credit-card', color: '#3b82f6' },
        { icon: 'fa-hand-holding-usd', color: '#8b5cf6' },
        { icon: 'fa-chart-bar', color: '#ef4444' },
        { icon: 'fa-chart-pie', color: '#06b6d4' }
    ];

    // Create 15 floating elements
    for (let i = 0; i < 15; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element';

        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;

        // Random size
        const size = Math.random() * 30 + 20;

        // Random icon
        const iconIndex = Math.floor(Math.random() * icons.length);
        const icon = icons[iconIndex];

        // Random animation duration and delay
        const duration = Math.random() * 20 + 15;
        const delay = Math.random() * 5;

        // Set styles
        element.style.position = 'absolute';
        element.style.left = `${x}%`;
        element.style.top = `${y}%`;
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        element.style.display = 'flex';
        element.style.alignItems = 'center';
        element.style.justifyContent = 'center';
        element.style.borderRadius = '50%';
        element.style.background = `rgba(255, 255, 255, 0.1)`;
        element.style.backdropFilter = 'blur(5px)';
        element.style.boxShadow = `0 8px 32px rgba(0, 0, 0, 0.1)`;
        element.style.animation = `floatElement ${duration}s ease-in-out infinite`;
        element.style.animationDelay = `${delay}s`;
        element.style.zIndex = '1';

        // Add icon
        const iconElement = document.createElement('i');
        iconElement.className = `fas ${icon.icon}`;
        iconElement.style.color = icon.color;
        iconElement.style.fontSize = `${size * 0.6}px`;
        iconElement.style.filter = 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))';

        element.appendChild(iconElement);
        container.appendChild(element);
    }
}

function initCanvasAnimation() {
    const canvas = document.getElementById('backgroundCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouseX = 0, mouseY = 0;
    let mouseRadius = 100;

    // Resize canvas
    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    // Create particles
    function createParticles() {
        particles = [];
        const numberOfParticles = Math.floor((width * height) / 15000);

        for (let i = 0; i < numberOfParticles; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 2 + 1,
                color: `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, ${Math.random() * 0.5 + 0.1})`,
                velocityX: Math.random() * 0.5 - 0.25,
                velocityY: Math.random() * 0.5 - 0.25
            });
        }
    }

    // Draw particles
    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw particles
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
            ctx.fill();

            // Update position
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;

            // Wrap around screen
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;

            // Connect particles with lines
            particles.forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.stroke();
                }
            });

            // Mouse interaction
            if (mouseActive) {
                const dx = mouseX - particle.x;
                const dy = mouseY - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouseRadius) {
                    const force = (mouseRadius - distance) / mouseRadius;
                    const angle = Math.atan2(dy, dx);
                    particle.x -= Math.cos(angle) * force * 2;
                    particle.y -= Math.sin(angle) * force * 2;
                }
            }
        });

        requestAnimationFrame(drawParticles);
    }

    // Initialize
    resizeCanvas();
    createParticles();
    drawParticles();

    // Event listeners
    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });

    window.addEventListener('mousemove', handleMouseMove);
}

// Add CSS for floating elements
function addFloatingElementStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatElement {
            0% { transform: translateY(0) translateX(0) rotate(0deg); }
            25% { transform: translateY(-30px) translateX(15px) rotate(5deg); }
            50% { transform: translateY(-60px) translateX(-15px) rotate(-5deg); }
            75% { transform: translateY(-30px) translateX(15px) rotate(5deg); }
            100% { transform: translateY(0) translateX(0) rotate(0deg); }
        }
        
        .floating-element {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .floating-element:hover {
            transform: scale(1.2) !important;
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.3) !important;
        }
    `;
    document.head.appendChild(style);
}
async function sendCommand() {
    const commandInput = document.getElementById('commandInput');
    const responseText = document.getElementById('responseText');
    const command = commandInput.value.trim();

    if (!command) {
        responseText.innerHTML = '<div class="text-red-500">Please enter a command</div>';
        return;
    }

    // Show processing state
    responseText.innerHTML = '<div class="text-indigo-600">Processing your command...</div>';

    try {
        // Process the command (your existing command processing logic here)
        // ...

        // After successful command processing
        responseText.innerHTML = '<div class="text-green-500">Command processed successfully!</div>';

        // Wait for 1.5 seconds to show the success message
        setTimeout(() => {
            goBackToMain();
        }, 1500);

    } catch (error) {
        responseText.innerHTML = `<div class="text-red-500">Error: ${error.message}</div>`;

        // Wait for 2 seconds to show the error message before going back
        setTimeout(() => {
            goBackToMain();
        }, 2000);
    }
}

function startListening() {
    console.log('Starting listening...');

    // Store current state for restoration
    window.previousState = {
        mainContainerVisible: !document.querySelector('.max-w-md')?.classList.contains('hidden'),
        dashboardVisible: !document.getElementById('dashboard')?.classList.contains('hidden')
    };

    // Show AI Assistant section
    const aiAssistant = document.getElementById('aiAssistant');
    if (aiAssistant) {
        aiAssistant.classList.remove('hidden');
        aiAssistant.style.display = 'flex';
        aiAssistant.style.flexDirection = 'column';
        aiAssistant.style.alignItems = 'center';
        aiAssistant.style.justifyContent = 'center';
    }

    // Hide main container and dashboard
    const mainContainer = document.querySelector('.max-w-md');
    const dashboard = document.getElementById('dashboard');

    if (mainContainer) {
        mainContainer.classList.add('hidden');
        mainContainer.style.display = 'none';
    }

    if (dashboard) {
        dashboard.classList.add('hidden');
        dashboard.style.display = 'none';
    }

    // Show and update voice status
    const voiceStatus = document.getElementById('voiceStatus');
    if (voiceStatus) {
        voiceStatus.classList.remove('hidden');
        voiceStatus.style.display = 'flex';
        voiceStatus.innerHTML = `
            <div class="flex items-center space-x-2 text-indigo-600 p-4 rounded-lg bg-white shadow-md">
                <div class="animate-pulse">
                    <i class="fas fa-microphone text-xl"></i>
                </div>
                <span class="font-medium">Voice Assistant Active</span>
            </div>
        `;
    }

    // Update mic button and response text
    const micButton = document.getElementById('micButton');
    const responseText = document.getElementById('responseText');

    if (micButton) {
        micButton.classList.add('mic-active', 'pulse-animation');
        micButton.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-microphone text-white"></i>
                <span class="text-white">Listening...</span>
            </div>
        `;
    }

    if (responseText) {
        responseText.innerHTML = `
            <div class="flex items-center justify-center space-x-2 text-indigo-600 mt-4">
                <div class="animate-pulse">
                    <i class="fas fa-microphone-alt text-xl"></i>
                </div>
                <span class="font-medium">Listening... Please speak your command.</span>
            </div>
        `;
    }

    // Initialize speech recognition
    try {
        // Check if SpeechRecognition is available
        if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
            throw new Error('Speech recognition not supported in this browser');
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        window.recognition = recognition;  // Store for later access

        recognition.lang = "en-US";
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = function () {
            console.log('Speech recognition started');
        };

        recognition.onend = function () {
            console.log('Speech recognition ended');
            if (!window.keepListening) {
                goBackToMain();
            }
        };

        recognition.onerror = function (event) {
            console.error('Speech recognition error:', event.error);
            handleRecognitionError(event.error);
        };

        recognition.onresult = function (event) {
            const result = event.results[event.results.length - 1][0].transcript;
            console.log('Speech recognition result:', result);

            // Update the command input with the recognized text
            const commandInput = document.getElementById('commandInput');
            if (commandInput) {
                commandInput.value = result;
            }

            // Process the command
            const success = processVoiceCommand(result);

            // Update response text based on processing result
            const responseText = document.getElementById('responseText');
            if (responseText && !success) {
                responseText.innerHTML = `
                    <div class="flex items-center justify-center space-x-2 text-gray-600 mt-4">
                        <i class="fas fa-info-circle text-xl"></i>
                        <span class="font-medium">Processing: "${result}"</span>
                    </div>
                `;
            }

            // Reset UI state
            const micButton = document.getElementById('micButton');
            if (micButton) {
                micButton.classList.remove('mic-active');
                micButton.innerHTML = '<i class="fas fa-microphone"></i> Start Voice';
            }

            const voiceStatus = document.getElementById('voiceStatus');
            if (voiceStatus) {
                voiceStatus.classList.add('hidden');
            }
        };

        // Start recognition
        recognition.start();
    } catch (error) {
        console.error('Error initializing speech recognition:', error);
        handleRecognitionError('initialization-error', 'Speech recognition is not supported in your browser. Please try using Chrome, Edge, or Safari.');
    }
}

function handleRecognitionError(errorType, customMessage = '') {
    const micButton = document.getElementById('micButton');
    const responseText = document.getElementById('responseText');
    const voiceStatus = document.getElementById('voiceStatus');

    let errorMessage = customMessage;
    let errorIcon = '❌';
    let errorClass = 'text-red-600';

    // Set specific error messages based on error type
    if (!customMessage) {
        switch (errorType) {
            case 'no-speech':
                errorMessage = 'No speech was detected. Please try again.';
                break;
            case 'aborted':
                errorMessage = 'Speech recognition was aborted.';
                break;
            case 'audio-capture':
                errorMessage = 'No microphone was found. Please check your microphone settings.';
                break;
            case 'network':
                errorMessage = 'Network error occurred. Please check your internet connection.';
                break;
            case 'not-allowed':
                errorMessage = 'Microphone access was denied. Please allow microphone access in your browser settings.';
                break;
            case 'service-not-allowed':
                errorMessage = 'Speech recognition service not allowed.';
                break;
            case 'bad-grammar':
                errorMessage = 'Speech recognition grammar error.';
                break;
            case 'language-not-supported':
                errorMessage = 'Language not supported.';
                break;
            case 'initialization-error':
                errorMessage = 'Failed to initialize speech recognition. Please try using a different browser.';
                break;
            default:
                errorMessage = 'An error occurred with speech recognition. Please try again.';
        }
    }

    // Update UI with error message
    if (responseText) {
        responseText.innerHTML = `
            <div class="flex items-center justify-center space-x-2 ${errorClass} mt-4">
                <i class="fas fa-exclamation-circle text-xl"></i>
                <span class="font-medium">${errorMessage}</span>
            </div>
        `;
    }

    // Reset mic button
    if (micButton) {
        micButton.classList.remove('mic-active', 'pulse-animation');
        micButton.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-microphone"></i>
                <span>Start Voice</span>
            </div>
        `;
    }

    // Hide voice status
    if (voiceStatus) {
        voiceStatus.classList.add('hidden');
    }

    // Speak the error message
    speakOut(errorMessage);

    // Return to main interface after a delay
    setTimeout(() => {
        goBackToMain();
    }, 3000);
}

function speakOut(text) {
    console.log('Speaking:', text);

    // Cancel any ongoing speech
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();

        // Create a new speech utterance
        const utterance = new SpeechSynthesisUtterance(text);

        // Set properties
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Speak the text
        window.speechSynthesis.speak(utterance);
    } else {
        console.error('Speech synthesis not supported');
    }
}

function goBackToMain() {
    console.log('Going back to main...');

    // Hide AI Assistant section
    const aiAssistant = document.getElementById('aiAssistant');
    if (aiAssistant) {
        aiAssistant.classList.add('hidden');
        aiAssistant.style.display = 'none';
    }

    // Restore previous state
    if (window.previousState) {
        // Show main container if it was visible before
        const mainContainer = document.querySelector('.max-w-md');
        if (mainContainer) {
            if (window.previousState.mainContainerVisible) {
                mainContainer.classList.remove('hidden');
                mainContainer.style.display = 'block';
            } else {
                mainContainer.classList.add('hidden');
                mainContainer.style.display = 'none';
            }
        }

        // Show dashboard if it was visible before
        const dashboard = document.getElementById('dashboard');
        if (dashboard) {
            if (window.previousState.dashboardVisible) {
                dashboard.classList.remove('hidden');
                dashboard.style.display = 'block';
            } else {
                dashboard.classList.add('hidden');
                dashboard.style.display = 'none';
            }
        }
    } else {
        // Fallback if previous state is not available
        const mainContainer = document.querySelector('.max-w-md');
        const dashboard = document.getElementById('dashboard');

        if (mainContainer) {
            mainContainer.classList.remove('hidden');
            mainContainer.style.display = 'block';
        }

        if (dashboard) {
            dashboard.classList.add('hidden');
            dashboard.style.display = 'none';
        }
    }

    // Reset voice status
    const voiceStatus = document.getElementById('voiceStatus');
    if (voiceStatus) {
        voiceStatus.classList.add('hidden');
        voiceStatus.innerHTML = '';
    }

    // Reset mic button
    const micButton = document.getElementById('micButton');
    if (micButton) {
        micButton.classList.remove('mic-active', 'pulse-animation');
        micButton.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-microphone"></i>
                <span>Start Voice</span>
            </div>
        `;
    }

    // Clear response text
    const responseText = document.getElementById('responseText');
    if (responseText) {
        responseText.innerHTML = '';
    }

    // Stop any ongoing speech recognition
    if (window.recognition) {
        window.recognition.stop();
    }

    // Stop any ongoing speech synthesis
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }

    // Re-attach login form event listener
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

function processVoiceCommand(command) {
    console.log('Processing voice command:', command);

    // Convert command to lowercase for easier matching
    command = command.toLowerCase();

    // Define patterns for different types of commands
    const expensePattern = /(?:spent|paid|used|bought|purchased)\s+(\d+(?:\.\d+)?)\s+(?:on|for|in)\s+([a-zA-Z\s]+)/i;
    const incomePattern = /(?:received|got|earned|made)\s+(\d+(?:\.\d+)?)\s+(?:from|as|for|in|money)\s*([a-zA-Z\s]*)?/i;

    // Try to match the command against different patterns
    let match;

    // Check for income first
    match = command.match(incomePattern);
    if (match) {
        const amount = parseFloat(match[1]);
        // If no category is specified, default to 'Salary'
        const category = match[2] ? match[2].trim().toLowerCase() : 'salary';

        // Map common voice categories to actual categories
        const categoryMap = {
            // Income categories
            'salary': 'Salary',
            'wage': 'Salary',
            'payment': 'Salary',
            'work': 'Salary',
            'job': 'Salary',
            'business': 'Business',
            'freelance': 'Business',
            'investment': 'Investment',
            'stocks': 'Investment',
            'gift': 'Gift',
            'gifts': 'Gift',
            'present': 'Gift',
            'refund': 'Refund',
            'return': 'Refund',
            'bonus': 'Salary',
            'commission': 'Salary',
            'other': 'Other Income',
            'money': 'Other Income'
        };

        // Create transaction object
        const transaction = {
            id: Date.now().toString(),
            type: 'income',
            amount: amount,
            category: categoryMap[category] || 'Other Income',
            description: `${category} income`,
            date: new Date().toISOString()
        };

        console.log('Creating income transaction:', transaction);

        // Save transaction
        saveTransaction(transaction);

        // Update UI
        updateSummaryCards();
        updateTransactionList();
        updateCharts();

        // Show success message
        const responseText = document.getElementById('responseText');
        if (responseText) {
            responseText.innerHTML = `
                <div class="flex items-center justify-center space-x-2 text-green-600 mt-4">
                    <i class="fas fa-check-circle text-xl"></i>
                    <span class="font-medium">Income recorded: ${amount} from ${transaction.category}</span>
                </div>
            `;
        }

        // Speak confirmation
        speakMessage(`Income recorded: ${amount} from ${transaction.category}`);
        return true;
    }

    // Check for expense
    match = command.match(expensePattern);
    if (match) {
        const amount = parseFloat(match[1]);
        const category = match[2].trim().toLowerCase();

        // Map common voice categories to actual categories
        const categoryMap = {
            // Expense categories
            'food': 'Food & Dining',
            'foods': 'Food & Dining',
            'eating': 'Food & Dining',
            'groceries': 'Food & Dining',
            'restaurant': 'Food & Dining',
            'transport': 'Transportation',
            'travel': 'Transportation',
            'uber': 'Transportation',
            'taxi': 'Transportation',
            'shopping': 'Shopping',
            'clothes': 'Shopping',
            'clothing': 'Shopping',
            'entertainment': 'Entertainment',
            'movies': 'Entertainment',
            'games': 'Entertainment',
            'bills': 'Bills & Utilities',
            'utilities': 'Bills & Utilities',
            'health': 'Healthcare',
            'medical': 'Healthcare',
            'education': 'Education',
            'study': 'Education',
            'books': 'Education',
            'other': 'Other Expenses'
        };

        // Create transaction object
        const transaction = {
            id: Date.now().toString(),
            type: 'expense',
            amount: amount,
            category: categoryMap[category] || category,
            description: `${category} expense`,
            date: new Date().toISOString()
        };

        console.log('Creating expense transaction:', transaction);

        // Save transaction
        saveTransaction(transaction);

        // Update UI
        updateSummaryCards();
        updateTransactionList();
        updateCharts();

        // Show success message
        const responseText = document.getElementById('responseText');
        if (responseText) {
            responseText.innerHTML = `
                <div class="flex items-center justify-center space-x-2 text-green-600 mt-4">
                    <i class="fas fa-check-circle text-xl"></i>
                    <span class="font-medium">Expense recorded: ${amount} for ${transaction.category}</span>
                </div>
            `;
        }

        // Speak confirmation
        speakMessage(`Expense recorded: ${amount} for ${transaction.category}`);
        return true;
    }

    // If no pattern matches, show error
    const responseText = document.getElementById('responseText');
    if (responseText) {
        responseText.innerHTML = `
            <div class="flex items-center justify-center space-x-2 text-red-600 mt-4">
                <i class="fas fa-exclamation-circle text-xl"></i>
                <span class="font-medium">Sorry, I couldn't understand that command. Try saying something like:</span>
            </div>
            <div class="mt-2 text-gray-600">
                <ul class="list-disc list-inside">
                    <li>"spent 200 on food"</li>
                    <li>"received 5000 from salary"</li>
                    <li>"got 2000 from freelance"</li>
                    <li>"earned 1000 from business"</li>
                </ul>
            </div>
        `;
    }

    // Speak error message
    speakMessage("Sorry, I couldn't understand that command. Please try again with a valid command format.");
    return false;
}

// Trip Planning Functions
function handleTripPlanningSubmit(e) {
    e.preventDefault();

    // Get form values
    const destination = document.getElementById('destination').value;
    const tripType = document.getElementById('tripType').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const travelers = parseInt(document.getElementById('travelers').value);
    const budget = parseFloat(document.getElementById('budget').value);

    // Create trip object
    const trip = {
        id: Date.now(),
        destination,
        tripType,
        startDate,
        endDate,
        travelers,
        budget,
        costs: {
            accommodation: 0,
            transportation: 0,
            food: 0,
            activities: 0,
            shopping: 0,
            misc: 0
        }
    };

    // Save trip
    saveTrip(trip);

    // Update UI
    updateTripDetails(trip);
    updateCostBreakdown(trip);
    updateTripSummary(trip);

    // Reset form
    tripPlanningForm.reset();

    // Show success message
    showSuccessMessage('Trip planned successfully!');
}

function saveTrip(trip) {
    const trips = JSON.parse(localStorage.getItem('trips') || '[]');
    trips.push(trip);
    localStorage.setItem('trips', JSON.stringify(trips));
}

function updateTripDetails(trip) {
    // Show trip details section
    tripDetails.classList.remove('hidden');
    noTripSelected.classList.add('hidden');

    // Update trip information
    document.getElementById('tripDestination').textContent = trip.destination;

    // Calculate duration
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    document.getElementById('tripDuration').textContent = `${duration} days`;

    document.getElementById('tripTravelers').textContent = trip.travelers;
    document.getElementById('tripBudget').textContent = `₹${trip.budget.toFixed(2)}`;
}

function updateCostBreakdown(trip) {
    // Update cost breakdown values
    document.getElementById('accommodationCost').textContent = `₹${trip.costs.accommodation.toFixed(2)}`;
    document.getElementById('transportationCost').textContent = `₹${trip.costs.transportation.toFixed(2)}`;
    document.getElementById('foodCost').textContent = `₹${trip.costs.food.toFixed(2)}`;
    document.getElementById('activitiesCost').textContent = `₹${trip.costs.activities.toFixed(2)}`;
    document.getElementById('shoppingCost').textContent = `₹${trip.costs.shopping.toFixed(2)}`;
    document.getElementById('miscCost').textContent = `₹${trip.costs.misc.toFixed(2)}`;

    // Calculate total cost
    const totalCost = Object.values(trip.costs).reduce((sum, cost) => sum + cost, 0);
    document.getElementById('totalTripCost').textContent = `₹${totalCost.toFixed(2)}`;

    // Calculate remaining budget
    const remainingBudget = trip.budget - totalCost;
    document.getElementById('remainingBudget').textContent = `₹${remainingBudget.toFixed(2)}`;

    // Update cost distribution chart
    updateTripCostChart(trip);
}

function updateTripCostChart(trip) {
    const ctx = document.getElementById('tripCostChart').getContext('2d');

    // Destroy existing chart if it exists
    if (tripCostChartInstance) {
        tripCostChartInstance.destroy();
    }

    // Create new chart
    tripCostChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Accommodation', 'Transportation', 'Food & Dining', 'Activities', 'Shopping', 'Miscellaneous'],
            datasets: [{
                data: [
                    trip.costs.accommodation,
                    trip.costs.transportation,
                    trip.costs.food,
                    trip.costs.activities,
                    trip.costs.shopping,
                    trip.costs.misc
                ],
                backgroundColor: [
                    '#4F46E5', // Indigo
                    '#7C3AED', // Purple
                    '#EC4899', // Pink
                    '#F59E0B', // Amber
                    '#10B981', // Emerald
                    '#6B7280'  // Gray
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

function updateTripSummary(trip) {
    // Show trip summary section
    tripSummary.classList.remove('hidden');
    noTripSummary.classList.add('hidden');

    // Update summary values
    document.getElementById('summaryAccommodation').textContent = `₹${trip.costs.accommodation.toFixed(2)}`;
    document.getElementById('summaryTransportation').textContent = `₹${trip.costs.transportation.toFixed(2)}`;
    document.getElementById('summaryFood').textContent = `₹${trip.costs.food.toFixed(2)}`;
    document.getElementById('summaryActivities').textContent = `₹${trip.costs.activities.toFixed(2)}`;
    document.getElementById('summaryShopping').textContent = `₹${trip.costs.shopping.toFixed(2)}`;
    document.getElementById('summaryMisc').textContent = `₹${trip.costs.misc.toFixed(2)}`;

    // Calculate total cost
    const totalCost = Object.values(trip.costs).reduce((sum, cost) => sum + cost, 0);
    document.getElementById('summaryTotal').textContent = `₹${totalCost.toFixed(2)}`;

    // Calculate remaining budget
    const remainingBudget = trip.budget - totalCost;
    document.getElementById('summaryRemaining').textContent = `₹${remainingBudget.toFixed(2)}`;
}

function handleCostEdit(category) {
    const trips = JSON.parse(localStorage.getItem('trips') || '[]');
    const currentTrip = trips[trips.length - 1]; // Get most recent trip

    if (!currentTrip) return;

    const newCost = parseFloat(prompt(`Enter new cost for ${category}:`, currentTrip.costs[category]));

    if (isNaN(newCost) || newCost < 0) {
        showErrorMessage('Please enter a valid cost amount');
        return;
    }

    // Update cost
    currentTrip.costs[category] = newCost;

    // Save updated trip
    localStorage.setItem('trips', JSON.stringify(trips));

    // Update UI
    updateCostBreakdown(currentTrip);
    updateTripSummary(currentTrip);
}

function exportTripPlan() {
    const trips = JSON.parse(localStorage.getItem('trips') || '[]');
    const currentTrip = trips[trips.length - 1]; // Get most recent trip

    if (!currentTrip) {
        showErrorMessage('No trip to export');
        return;
    }

    // Create export data
    const csvContent = `Trip Plan for ${currentTrip.destination}\n\n` +
        `Destination,${currentTrip.destination}\n` +
        `Trip Type,${currentTrip.tripType}\n` +
        `Start Date,${currentTrip.startDate}\n` +
        `End Date,${currentTrip.endDate}\n` +
        `Travelers,${currentTrip.travelers}\n` +
        `Budget,₹${currentTrip.budget}\n\n` +
        'Cost Breakdown\n' +
        `Accommodation,₹${currentTrip.costs.accommodation}\n` +
        `Transportation,₹${currentTrip.costs.transportation}\n` +
        `Food & Dining,₹${currentTrip.costs.food}\n` +
        `Activities,₹${currentTrip.costs.activities}\n` +
        `Shopping,₹${currentTrip.costs.shopping}\n` +
        `Miscellaneous,₹${currentTrip.costs.misc}\n`;

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trip_plan_${currentTrip.destination.toLowerCase().replace(/\s+/g, '_')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Global variables for camera handling
let cameraStream = null;
let videoElement = null;
let currentCamera = 'environment'; // Default to back camera
let currentView = 'back'; // Track which side we're scanning

async function startCamera() {
    try {
        console.log('Starting camera...');

        // Create status indicator
        const statusDiv = document.createElement('div');
        statusDiv.id = 'cameraStatus';
        statusDiv.style.textAlign = 'center';
        statusDiv.style.margin = '10px';
        statusDiv.style.padding = '10px';
        statusDiv.style.backgroundColor = '#f0f0f0';
        statusDiv.style.borderRadius = '5px';
        statusDiv.innerHTML = `Currently scanning: <strong>${currentView.toUpperCase()} SIDE</strong>`;
        document.body.appendChild(statusDiv);

        // Create video element
        videoElement = document.createElement('video');
        videoElement.id = 'cameraPreview';
        videoElement.autoplay = true;
        videoElement.playsInline = true;
        videoElement.style.width = '100%';
        videoElement.style.maxWidth = '500px';
        videoElement.style.margin = '20px auto';
        videoElement.style.display = 'block';
        videoElement.style.transform = currentCamera === 'user' ? 'scaleX(-1)' : 'none';
        document.body.appendChild(videoElement);

        // Request camera access
        const constraints = {
            video: {
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: currentCamera
            }
        };

        console.log('Requesting camera access...');
        cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('Camera access granted');
        videoElement.srcObject = cameraStream;

        // Create controls
        const controls = document.createElement('div');
        controls.className = 'camera-controls';
        controls.style.display = 'flex';
        controls.style.justifyContent = 'center';
        controls.style.gap = '10px';
        controls.style.margin = '10px auto';

        // Switch camera button
        const switchBtn = document.createElement('button');
        switchBtn.id = 'switchCameraBtn';
        switchBtn.className = 'btn-secondary';
        switchBtn.innerHTML = `<i class="fas fa-sync-alt"></i> Switch to ${currentCamera === 'environment' ? 'FRONT' : 'BACK'} Camera`;
        switchBtn.onclick = switchCamera;
        controls.appendChild(switchBtn);

        // Capture button
        const captureBtn = document.createElement('button');
        captureBtn.id = 'captureBtn';
        captureBtn.className = 'btn-primary';
        captureBtn.innerHTML = `<i class="fas fa-camera"></i> Capture ${currentView.toUpperCase()} Side`;
        captureBtn.onclick = captureDocument;
        controls.appendChild(captureBtn);

        document.body.appendChild(controls);

    } catch (error) {
        console.error('Camera error:', error);
        alert(`Camera Error: ${error.message}\n\nPlease make sure:\n1. Your camera is not being used by another app\n2. You've granted camera permissions\n3. Your device has both front and back cameras`);
    }
}

async function switchCamera() {
    try {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
        }

        currentCamera = currentCamera === 'environment' ? 'user' : 'environment';
        currentView = currentCamera === 'environment' ? 'back' : 'front';

        // Update status
        const statusDiv = document.getElementById('cameraStatus');
        if (statusDiv) {
            statusDiv.innerHTML = `Currently scanning: <strong>${currentView.toUpperCase()} SIDE</strong>`;
        }

        // Update buttons
        const captureBtn = document.getElementById('captureBtn');
        if (captureBtn) {
            captureBtn.innerHTML = `<i class="fas fa-camera"></i> Capture ${currentView.toUpperCase()} Side`;
        }

        const switchBtn = document.getElementById('switchCameraBtn');
        if (switchBtn) {
            switchBtn.innerHTML = `<i class="fas fa-sync-alt"></i> Switch to ${currentCamera === 'environment' ? 'FRONT' : 'BACK'} Camera`;
        }

        // Get new camera stream
        const constraints = {
            video: {
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: currentCamera
            }
        };

        cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
        videoElement.srcObject = cameraStream;
        videoElement.style.transform = currentCamera === 'user' ? 'scaleX(-1)' : 'none';

    } catch (error) {
        console.error('Error switching camera:', error);
        alert(`Failed to switch camera: ${error.message}\nPlease make sure your device has both front and back cameras.`);
    }
}

function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }

    if (videoElement) {
        videoElement.remove();
        videoElement = null;
    }

    const controlsContainer = document.querySelector('.camera-controls');
    if (controlsContainer) {
        controlsContainer.remove();
    }

    // Reset camera button
    const cameraBtn = document.getElementById('cameraBtn');
    if (cameraBtn) {
        cameraBtn.innerHTML = '<i class="fas fa-camera text-xl"></i>';
        cameraBtn.onclick = startCamera;
    }
}

async function captureDocument() {
    try {
        if (!videoElement || !cameraStream) {
            throw new Error('Camera not initialized');
        }

        // Create canvas to capture the image
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const ctx = canvas.getContext('2d');

        // Draw the current video frame
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        // Convert to blob with lower quality for faster processing
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.7));

        // Create preview modal
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Document Preview</h3>
                <img src="${URL.createObjectURL(blob)}" alt="Captured document" style="max-width: 100%; margin: 10px 0;">
                <div class="button-group">
                    <button onclick="retakePhoto()" class="btn-secondary">Retake</button>
                    <button onclick="saveDocument()" class="btn-primary">Save Document</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Store the blob for saving later
        window.capturedImageBlob = blob;

    } catch (error) {
        console.error('Capture error:', error);
        alert('Failed to capture document: ' + error.message);
    }
}

function retakePhoto() {
    // Remove the modal
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

async function saveDocument() {
    if (!window.capturedImageBlob) {
        alert('No document to save!');
        return;
    }

    try {
        // Create FormData to send the image
        const formData = new FormData();
        formData.append('image', window.capturedImageBlob, 'document.jpg');

        // Show loading state
        const saveBtn = document.querySelector('.modal .btn-primary');
        if (saveBtn) {
            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            saveBtn.disabled = true;
        }

        // Send to server
        const response = await fetch('/upload-image', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to upload document');
        }

        const data = await response.json();
        alert('Document saved successfully!');

        // Remove the modal
        const modal = document.querySelector('.modal');
        if (modal) {
            modal.remove();
        }

        // Stop camera
        stopCamera();

    } catch (error) {
        console.error('Save error:', error);
        alert('Failed to save document: ' + error.message);

        // Reset save button
        const saveBtn = document.querySelector('.modal .btn-primary');
        if (saveBtn) {
            saveBtn.innerHTML = 'Save Document';
            saveBtn.disabled = false;
        }
    }
}

// Initialize camera button
document.addEventListener('DOMContentLoaded', function () {
    const cameraBtn = document.getElementById('cameraBtn');
    if (cameraBtn) {
        cameraBtn.onclick = startCamera;
    }
});


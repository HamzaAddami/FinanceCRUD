// import api from './api.js';
// import charts from './charts.js';
// import { exportToCsv, exportToPdf, formatCurrency } from './utils.js';
// import { getText } from './lang.js';

// class Dashboard {
//     constructor() {
//         this.initialize();
//     }

//     async initialize() {
//         await this.loadKPIs();
//         await this.loadCharts();
//         this.setupEventListeners();
//     }

//     async loadKPIs() {
//         try {
//             const [orders, products, users] = await Promise.all([
//                 api.getOrders(),
//                 api.getProducts(),
//                 api.getUsers()
//             ]);

//             // Calculate KPIs
//             const totalRevenue = orders.reduce((sum, order) => 
//                 sum + (order.quantity * order.price), 0);
//             const pendingOrders = orders.filter(order => 
//                 order.status === 'pending').length;

//             // Update KPI displays
//             document.getElementById('totalRevenue').textContent = 
//                 formatCurrency(totalRevenue);
//             document.getElementById('totalOrders').textContent = 
//                 orders.length;
//             document.getElementById('totalProducts').textContent = 
//                 products.length;
//             document.getElementById('totalUsers').textContent = 
//                 users.length;
//             document.getElementById('pendingOrders').textContent = 
//                 pendingOrders;

//         } catch (error) {
//             console.error('Error loading KPIs:', error);
//         }
//     }

//     async loadCharts() {
//         try {
//             const orders = await api.getOrders();
//             charts.createOrdersChart('ordersChart', orders);
//         } catch (error) {
//             console.error('Error loading charts:', error);
//         }
//     }

//     setupEventListeners() {
//         // Date range selector
//         document.getElementById('dateRange').addEventListener('change', 
//             async (e) => {
//                 const days = parseInt(e.target.value);
//                 const orders = await api.getOrders();
//                 const filteredOrders = this.filterOrdersByDate(orders, days);
//                 charts.updateChart('ordersChart', filteredOrders);
//             }
//         );

//         // Export buttons
//         document.getElementById('exportCsv').addEventListener('click', 
//             async () => {
//                 const orders = await api.getOrders();
//                 exportToCsv(orders, 'orders.csv');
//             }
//         );

//         document.getElementById('exportPdf').addEventListener('click',
//             async () => {
//                 exportToPdf('dashboardContent', 'dashboard-report.pdf');
//             }
//         );
//     }

//     filterOrdersByDate(orders, days) {
//         const cutoffDate = new Date();
//         cutoffDate.setDate(cutoffDate.getDate() - days);
        
//         return orders.filter(order => 
//             new Date(order.order_date) >= cutoffDate
//         );
//     }

//     async refresh() {
//         await this.loadKPIs();
//         await this.loadCharts();
//     }
// }

// export default new Dashboard();



// dashboard.js
import {apiService} from './api.js';
import {crudOperations} from './crud.js';
import {initializeCharts} from './charts.js';

document.addEventListener('DOMContentLoaded', () => {
    // Handle login form submission
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const result = await apiService.login(username, password);
            if (result.success) {
                document.getElementById('loginPage').classList.add('hidden');
                document.getElementById('dashboardPage').classList.remove('hidden');
                document.getElementById('userInfo').textContent = `Welcome, ${result.user.name}`;
                loadDashboard();
            }
        } catch (error) {
            alert('Invalid credentials');
        }
    });

    // Handle navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.currentTarget.dataset.page;
            navigateToPage(page);
        });
    });

    // Handle URL changes
    window.addEventListener('hashchange', handleRouting);
});

async function loadDashboard() {
    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h3 class="text-lg font-semibold mb-2">Total Users</h3>
                <p class="text-3xl font-bold text-blue-600" id="totalUsers">Loading...</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h3 class="text-lg font-semibold mb-2">Total Products</h3>
                <p class="text-3xl font-bold text-green-600" id="totalProducts">Loading...</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h3 class="text-lg font-semibold mb-2">Total Clients</h3>
                <p class="text-3xl font-bold text-purple-600" id="totalClients">Loading...</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h3 class="text-lg font-semibold mb-2">Total Orders</h3>
                <p class="text-3xl font-bold text-orange-600" id="totalOrders">Loading...</p>
            </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h3 class="text-lg font-semibold mb-4">Orders Over Time</h3>
                <canvas id="ordersChart"></canvas>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h3 class="text-lg font-semibold mb-4">Top Products</h3>
                <canvas id="productsChart"></canvas>
            </div>
        </div>
    `;

    // Load statistics
    loadStatistics();
    // Initialize charts
    initializeCharts();
}

async function loadStatistics() {
    try {
        const [users, products, clients, orders] = await Promise.all([
            apiService.users.getAll(),
            apiService.products.getAll(),
            apiService.clients.getAll(),
            apiService.orders.getAll()
        ]);

        document.getElementById('totalUsers').textContent = users.data.length;
        document.getElementById('totalProducts').textContent = products.data.length;
        document.getElementById('totalClients').textContent = clients.data.length;
        document.getElementById('totalOrders').textContent = orders.data.length;
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

async function navigateToPage(page) {
    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = '<div class="text-center">Loading...</div>';

    try {
        if (page === 'dashboard') {
            loadDashboard();
            return;
        }

        const response = await apiService[page].getAll();
        const listView = crudOperations.createListView(page, response.data);
        contentArea.innerHTML = '';
        contentArea.appendChild(listView);
    } catch (error) {
        console.error('Error:', error);
        contentArea.innerHTML = '<div class="text-red-600">Error loading content</div>';
    }
}

function handleRouting() {
    const hash = window.location.hash.slice(1);
    if (!hash) {
        navigateToPage('dashboard');
        return;
    }

    const [page, action, id] = hash.split('/');
    if (action === 'add') {
        crudOperations.showAddForm(page);
    } else if (action === 'edit' && id) {
        crudOperations.showEditForm(page, id);
    } else {
        navigateToPage(page);
    }
}
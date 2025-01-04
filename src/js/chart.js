// class DashboardCharts {
//     constructor() {
//         this.charts = {};
//     }

//     createOrdersChart(canvasId, data) {
//         const ctx = document.getElementById(canvasId).getContext('2d');
        
//         // Destroy existing chart if it exists
//         if (this.charts[canvasId]) {
//             this.charts[canvasId].destroy();
//         }

//         // Process data for chart
//         const processedData = this.processOrderData(data);

//         // Create new chart
//         this.charts[canvasId] = new Chart(ctx, {
//             type: 'line',
//             data: {
//                 labels: processedData.labels,
//                 datasets: [{
//                     label: 'Orders Over Time',
//                     data: processedData.values,
//                     borderColor: '#3B82F6',
//                     tension: 0.4,
//                     fill: false
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 plugins: {
//                     legend: {
//                         position: 'top',
//                     },
//                     tooltip: {
//                         mode: 'index',
//                         intersect: false,
//                     }
//                 },
//                 scales: {
//                     y: {
//                         beginAtZero: true,
//                         ticks: {
//                             stepSize: 1
//                         }
//                     }
//                 }
//             }
//         });
//     }

//     processOrderData(orders) {
//         // Group orders by date
//         const groupedData = orders.reduce((acc, order) => {
//             const date = new Date(order.order_date).toISOString().split('T')[0];
//             acc[date] = (acc[date] || 0) + 1;
//             return acc;
//         }, {});

//         // Sort dates and prepare data for chart
//         const sortedDates = Object.keys(groupedData).sort();
        
//         return {
//             labels: sortedDates,
//             values: sortedDates.map(date => groupedData[date])
//         };
//     }

//     updateChart(canvasId, newData) {
//         if (this.charts[canvasId]) {
//             const processedData = this.processOrderData(newData);
//             this.charts[canvasId].data.labels = processedData.labels;
//             this.charts[canvasId].data.datasets[0].data = processedData.values;
//             this.charts[canvasId].update();
//         }
//     }
// }

// export default new DashboardCharts();



// charts.js
import { apiService } from './api.js';
import Chart from 'chart.js/auto';
export async function initializeCharts() {
    try {
        const orders = await apiService.orders.getAll();
        createOrdersTimeChart(orders.data);
        createTopProductsChart(orders.data);
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

function createOrdersTimeChart(orders) {
    // Group orders by date
    const ordersByDate = orders.reduce((acc, order) => {
        const date = new Date(order.order_date).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    const ctx = document.getElementById('ordersChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Object.keys(ordersByDate),
            datasets: [{
                label: 'Orders per Day',
                data: Object.values(ordersByDate),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Daily Orders'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function createTopProductsChart(orders) {
    // Group orders by product and count quantities
    const productQuantities = orders.reduce((acc, order) => {
        acc[order.product_name] = (acc[order.product_name] || 0) + order.quantity;
        return acc;
    }, {});

    // Sort and get top 5 products
    const topProducts = Object.entries(productQuantities)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);

    const ctx = document.getElementById('productsChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topProducts.map(([name]) => name),
            datasets: [{
                label: 'Units Sold',
                data: topProducts.map(([,qty]) => qty),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(251, 146, 60, 0.8)',
                    'rgba(236, 72, 153, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Top 5 Products by Sales'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
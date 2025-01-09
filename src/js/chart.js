
import { apiService } from './api.js';
import Chart from 'chart.js/auto';

export async function initializeCharts() {
    try {
        const orders = await apiService.orders.getAll();
        console.log('Fetched orders:', orders.data);
        createRevenueOverTimeChart(orders.data);
        createTopProductsChart(orders.data);
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

function createRevenueOverTimeChart(orders) {
    // Fetch all products to get product prices
    apiService.products.getAll().then(productsResponse => {
        const products = productsResponse.data;
        const productPriceMap = new Map();
        products.forEach(product => {
            productPriceMap.set(product.id, product.price);
        });

        // Create a mapping of revenue by month-year
        const revenueByMonth = orders.reduce((acc, order) => {
            const date = new Date(order.order_date);  // Parse the date
            const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });  // Format as "Jan 2025"
            const productId = order.product_id;
            const productPrice = productPriceMap.get(productId) || 0;  // Get product price, default to 0 if not found
            const revenue = order.quantity * productPrice;  // Calculate revenue

            // Accumulate revenue by month-year
            acc[monthYear] = (acc[monthYear] || 0) + revenue;
            return acc;
        }, {});

        // Get the labels and data for the chart
        const labels = Object.keys(revenueByMonth);
        const data = Object.values(revenueByMonth);

        // If no data, show a message or avoid rendering
        if (labels.length === 0) {
            console.error('No revenue data available for the chart');
            return;
        }

        // Get the context of the canvas and render the chart
        const ctx = document.getElementById('ordersChart').getContext('2d');
        new Chart(ctx, {
            type: 'line', // Changed to line chart
            data: {
                labels: labels,
                datasets: [{
                    label: 'Monthly Revenue',
                    data: data,
                    borderColor: 'rgb(59, 130, 246)',  // Line color
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',  // Background color for hover
                    fill: true,  // Optional: area under the line
                    tension: 0.3  // Optional: curvature of the line
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
                        text: 'Monthly Revenue Distribution'
                    }
                },
                scales: {
                    x: {
                        type: 'category',  // Treat x-axis as categorical
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();  // Format y-axis as currency
                            }
                        }
                    }
                }
            }
        });
    }).catch(error => {
        console.error('Error fetching products:', error);
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
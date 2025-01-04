// const axios = require('axios');


// const API_BASE_URL = 'http://localhost:3000';

// const api = {
//     // Generic request handler
//     async makeRequest(endpoint, method = 'GET', data = null) {
//         try {
//             const config = {
//                 method,
//                 url: `${API_BASE_URL}/${endpoint}`,
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 data: data ? JSON.stringify(data) : null
//             };

//             const response = await axios(config);
//             return response.data;
//         } catch (error) {
//             console.error(`API Error (${endpoint}):`, error);
//             throw error;
//         }
//     },

//     // Orders
//     getOrders: () => api.makeRequest('orders'),
//     getOrderById: (id) => api.makeRequest(`orders/${id}`),
//     createOrder: (data) => api.makeRequest('orders', 'POST', data),
//     updateOrder: (id, data) => api.makeRequest(`orders/${id}`, 'PUT', data),
//     deleteOrder: (id) => api.makeRequest(`orders/${id}`, 'DELETE'),

//     // Products
//     getProducts: () => api.makeRequest('products'),
//     getProductById: (id) => api.makeRequest(`products/${id}`),
//     createProduct: (data) => api.makeRequest('products', 'POST', data),
//     updateProduct: (id, data) => api.makeRequest(`products/${id}`, 'PUT', data),
//     deleteProduct: (id) => api.makeRequest(`products/${id}`, 'DELETE'),

//     // Categories
//     getCategories: () => api.makeRequest('categories'),
//     getCategoryById: (id) => api.makeRequest(`categories/${id}`),
//     createCategory: (data) => api.makeRequest('categories', 'POST', data),
//     updateCategory: (id, data) => api.makeRequest(`categories/${id}`, 'PUT', data),
//     deleteCategory: (id) => api.makeRequest(`categories/${id}`, 'DELETE'),

    
//     // Users
//     getUsers: () => api.makeRequest('users'),
//     getUserById: (id) => api.makeRequest(`users/${id}`),
//     createUser: (data) => api.makeRequest('users', 'POST', data),
//     updateUser: (id, data) => api.makeRequest(`users/${id}`, 'PUT', data),
//     deleteUser: (id) => api.makeRequest(`users/${id}`, 'DELETE'),

//     // Clients
//     getClients: () => api.makeRequest('clients'),
//     getClientById: (id) => api.makeRequest(`clients/${id}`),
//     createClient: (data) => api.makeRequest('clients', 'POST', data),
//     updateClient: (id, data) => api.makeRequest(`clients/${id}`, 'PUT', data),
//     deleteClient: (id) => api.makeRequest(`clients/${id}`, 'DELETE'),

// };

// module.exports = api;
 


// api.js



// import axios from './node_modules/axios/dist/axios.min.js';
const API_URL = 'http://localhost:3000';

// const api = axios.create({
//     baseURL: API_URL
// });

export const apiService = {
    // Authentication
    login: async (username, password) => {
        // Mock login for now
        if (username === 'admin' && password === 'admin') {
            return { success: true, user: { id: 1, name: 'Admin User' } };
        }
        throw new Error('Invalid credentials');
    },

    // CRUD operations for each entity
    products: {
        getAll: () => api.get('/products'),
        getById: (id) => api.get(`/products/${id}`),
        create: (data) => api.post('/products', data),
        update: (id, data) => api.put(`/products/${id}`, data),
        delete: (id) => api.delete(`/products/${id}`)
    },

    clients: {
        getAll: () => api.get('/clients'),
        getById: (id) => api.get(`/clients/${id}`),
        create: (data) => api.post('/clients', data),
        update: (id, data) => api.put(`/clients/${id}`, data),
        delete: (id) => api.delete(`/clients/${id}`)
    },

    users: {
        getAll: () => api.get('/users'),
        getById: (id) => api.get(`/users/${id}`),
        create: (data) => api.post('/users', data),
        update: (id, data) => api.put(`/users/${id}`, data),
        delete: (id) => api.delete(`/users/${id}`)
    },

    orders: {
        getAll: () => api.get('/orders'),
        getById: (id) => api.get(`/orders/${id}`),
        create: (data) => api.post('/orders', data),
        update: (id, data) => api.put(`/orders/${id}`, data),
        delete: (id) => api.delete(`/orders/${id}`)
    }
};


import axios from 'axios';
const API_URL = 'http://localhost:3000';

const api = axios.create({
    baseURL: API_URL
});

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

    catgorie: {
        getAll: () => api.get('/categories'),
        getById: (id) => api.get(`/categories/${id}`),
        create: (data) => api.post('/categories', data),
        update: (id, data) => api.put(`/categories/${id}`, data),
        delete: (id) => api.delete(`/categories/${id}`)
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


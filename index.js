



const axios = require('axios');
const { response } = require('express');

const API_URL = 'http://localhost:3000';

const response = axios.get(`${API_URL}/products`);
console.log(response.data);

import { apiService } from "./api.js";

export const crudOperations = {
    createListView: (entity, data) => {
        const container = document.createElement('div');
        container.className = 'space-y-4';

        // Header with Add button
        const header = document.createElement('div');
        header.className = 'flex justify-between items-center mb-6';
        header.innerHTML = `
            <h2 class="text-2xl font-bold text-gray-800">${entity.charAt(0).toUpperCase() + entity.slice(1)}</h2>
            <button onclick="crudOperations.showAddForm('${entity}')" 
                    class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                Add ${entity.slice(0, -1)}
            </button>
        `;
        container.appendChild(header);

        // Table
        const table = document.createElement('div');
        table.className = 'bg-white shadow-md rounded-lg overflow-hidden';
        table.innerHTML = `
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        ${Object.keys(data[0]).map(key => 
                            `<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ${key}
                            </th>`
                        ).join('')}
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${data.map(item => `
                        <tr>
                            ${Object.values(item).map(value => 
                                `<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ${value}
                                </td>`
                            ).join('')}
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onclick="crudOperations.showEditForm('${entity}', ${item.id})" 
                                        class="text-indigo-600 hover:text-indigo-900 mr-4">
                                    Modifier
                                </button>
                                <button onclick="crudOperations.deleteItem('${entity}', ${item.id})" 
                                        class="text-red-600 hover:text-red-900">
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        container.appendChild(table);

        return container;
    },

    showAddForm: async (entity) => {
        window.location.hash = `#${entity}/add`;
        const fields = await crudOperations.getEntityFields(entity);
        const form = crudOperations.createForm(entity, fields);
        document.getElementById('contentArea').innerHTML = '';
        document.getElementById('contentArea').appendChild(form);
    },

    showEditForm: async (entity, id) => {
        window.location.hash = `#${entity}/edit/${id}`;
        const item = await apiService[entity].getById(id);
        const fields = await crudOperations.getEntityFields(entity);
        const form = crudOperations.createForm(entity, fields, item);
        document.getElementById('contentArea').innerHTML = '';
        document.getElementById('contentArea').appendChild(form);
    },

    createForm: (entity, fields, item = null) => {
        const form = document.createElement('form');
        form.className = 'max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md';
        form.innerHTML = `
            <h3 class="text-xl font-bold mb-6">${item ? 'Edit' : 'Add'} ${entity.slice(0, -1)}</h3>
            ${fields.map(field => `
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">${field}</label>
                    <input type="text" name="${field}" 
                           value="${item ? item[field] || '' : ''}"
                           class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
            `).join('')}
            <div class="flex justify-end space-x-4">
                <button type="button" onclick="history.back()" 
                        class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors">
                    Cancel
                </button>
                <button type="submit" 
                        class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                    ${item ? 'Update' : 'Create'}
                </button>
            </div>
        `;

        form.onsubmit = async (e) => {
            e.preventDefault();
            const formData = Object.fromEntries(new FormData(form));
            try {
                if (item) {
                    await apiService[entity].update(item.id, formData);
                } else {
                    await apiService[entity].create(formData);
                }
                window.location.hash = `#${entity}`;
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred');
            }
        };

        return form;
    },

    deleteItem: async (entity, id) => {
        if (confirm('Are you sure you want to delete this item?')) {
            try {
                await apiService[entity].delete(id);
                window.location.hash = `#${entity}`;
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred');
            }
        }
    },

    getEntityFields: async (entity) => {
        // Mock field definitions
        const fields = {
            products: ['name', 'price', 'category_id'],
            clients: ['name', 'email', 'phone', 'address'],
            users: ['name', 'email'],
            orders: ['client_id', 'product_id', 'quantity', 'order_date']
        };
        return fields[entity] || [];
    }
};
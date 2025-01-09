import { apiService } from "./api.js";

export const crudOperations = {
    createListView: (entity, data) => {
        const container = document.createElement('div');
        container.className = 'space-y-4';
        window.crudOperations = crudOperations;

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
        try {
            console.log(`Fetching ${entity} with ID:`, id);
            const response = await apiService[entity].getById(id);
            const item = response.data; // Extract data from axios response
            console.log('Fetched Item:', item);
            
            if (!item) {
                alert('Item data not found!');
                return;
            }
            
            const fields = await crudOperations.getEntityFields(entity);
            const form = crudOperations.createForm(entity, fields, item);
            document.getElementById('contentArea').innerHTML = '';
            document.getElementById('contentArea').appendChild(form);
        } catch (error) {
            console.error('Error fetching item:', error);
            alert(`Error fetching ${entity}: ${error.message}`);
        }
    },

    createForm: (entity, fields, item = null) => {
        const form = document.createElement('form');
        form.className = 'max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md';
        
        // If it's an edit form, add a hidden input for ID
        const idField = item ? `<input type="hidden" name="id" value="${item.id}">` : '';
        
        form.innerHTML = `
            <h3 class="text-xl font-bold mb-6">${item ? 'Edit' : 'Add'} ${entity.slice(0, -1)}</h3>
            ${idField}
            ${fields.map(field => {
                // Handle different input types based on field name
                let inputType = 'text';
                if (field.includes('date')) inputType = 'date';
                if (field.includes('price') || field.includes('quantity')) inputType = 'number';
                if (field.includes('email')) inputType = 'email';
                
                let value = '';
                if (item && item[field] !== undefined) {
                    // Format date fields
                    if (inputType === 'date' && item[field]) {
                        value = new Date(item[field]).toISOString().split('T')[0];
                    } else {
                        value = item[field];
                    }
                }
                
                return `
                    <div class="mb-4">
                        <label for="${field}" class="block text-gray-700 text-sm font-bold mb-2">
                            ${field.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </label>
                        <input type="${inputType}" 
                               id="${field}" 
                               name="${field}" 
                               value="${value}"
                               ${inputType === 'number' ? 'step="0.01"' : ''}
                               class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                `;
            }).join('')}
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
            
            // Clean up the data before sending
            Object.keys(formData).forEach(key => {
                // Convert empty strings to null
                if (formData[key] === '') {
                    formData[key] = null;
                }
                // Convert numeric strings to numbers
                if (!isNaN(formData[key]) && formData[key] !== '') {
                    formData[key] = Number(formData[key]);
                }
            });
            
            try {
                console.log('Submitting data:', formData);
                if (item) {
                    const id = formData.id;
                    delete formData.id; 
                    await apiService[entity].update(id, formData);
                } else {
                    await apiService[entity].create(formData);
                }
                window.location.hash = `#${entity}`;
            } catch (error) {
                console.error('Error submitting form:', error);
                alert(`Error: ${error.response?.data?.message || error.message}`);
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
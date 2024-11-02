document.addEventListener("DOMContentLoaded", function () {
    // load items button
    const loadItemsButton = document.getElementById('load-items');
    loadItemsButton.addEventListener('click', loadItems);

    // Toggle Table button
    const toggleTableButton = document.getElementById('toggle-table');
    toggleTableButton.addEventListener('click', function () {
        const itemTable = document.getElementById('item-table');
        if (itemTable.style.display === 'none') {
            itemTable.style.display = 'table';
            toggleTableButton.textContent = 'Hide Table';
        } else {
            itemTable.style.display = 'none';
            toggleTableButton.textContent = 'Show Table';
        }
    });

    // Add Item button
    const addItemButton = document.getElementById('add-item');
    addItemButton.addEventListener('click', addItem);

    loadItems(); // Load items on page load

    // Load Items Function
    function loadItems() {
        fetch("https://m3kv7ya2q4.execute-api.us-east-2.amazonaws.com/items")
            .then(response => response.json())
            .then(data => {
                const table = document.getElementById('item-table');
                const tableBody = document.getElementById('table-body');
                const toggleTableButton = document.getElementById('toggle-table');
                tableBody.innerHTML = '';

                if (data.length > 0) {
                    // Show the table and toggle button
                    table.style.display = 'table';
                    toggleTableButton.style.display = 'inline-block';
                    toggleTableButton.textContent = 'Hide Table';

                    data.forEach(row => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${row.id}</td>
                            <td>${row.name}</td>
                            <td>${row.price}</td>
                            <td><button class="delete-btn" data-id="${row.id}">Delete</button></td>
                        `;
                        tableBody.appendChild(tr);
                    });

                    // Add event listeners to the new Delete buttons
                    const deleteButtons = document.querySelectorAll('.delete-btn');
                    deleteButtons.forEach(button => {
                        button.addEventListener('click', () => deleteItem(button.dataset.id));
                    });

                } else {
                    // Hide the table and toggle button if no items
                    table.style.display = 'none';
                    toggleTableButton.style.display = 'none';
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    // Delete Item Function
    function deleteItem(id) {
        fetch(`https://m3kv7ya2q4.execute-api.us-east-2.amazonaws.com/items/${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                console.log('Item with ID ${id} deleted successfully');
                loadItems(); // reload items
            } else {
                console.error('Error deleting item:', response.statusText);
            }
        })
        .catch(error => console.error('Error deleting item:', error));
    }

    // Add Item Function
    function addItem() {
        const id = document.getElementById('item-id').value;
        const name = document.getElementById('item-name').value;
        const price = document.getElementById('item-price').value;
    
        if (!id || !name || !price) {
            alert('All fields are required');
            return;
        }
    
        // Fetch existing items to verify if ID is unique
        fetch('https://m3kv7ya2q4.execute-api.us-east-2.amazonaws.com/items')
            .then(response => response.json())
            .then(data => {
                // Check if the ID already exists
                const idExists = data.some(item => item.id === id);
                if (idExists) {
                    alert('The ID already exists. Please use a unique ID.');
                    return;
                }
    
                // Proceed to add the item if the ID is unique
                const newItem = {
                    id: id,
                    name: name,
                    price: price
                };
    
                fetch('https://m3kv7ya2q4.execute-api.us-east-2.amazonaws.com/items', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newItem)
                })
                .then(response => {
                    if (response.ok) {
                        console.log('Item added successfully');
                        loadItems(); // Reload the items after adding a new one

                        // Clear the input fields
                        document.getElementById('item-id').value = '';
                        document.getElementById('item-name').value = '';
                        document.getElementById('item-price').value = '';
                    } else {
                        return response.text().then(text => {
                            throw new Error(`Error adding item: ${text}`);
                        });
                    }
                })
                .catch(error => console.error('Error:', error));
            })
            .catch(error => console.error('Error fetching existing items:', error));
    }
    
});

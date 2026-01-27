let inventory = JSON.parse(localStorage.getItem('stockflow_v1')) || [];

function addItem() {
    const name = document.getElementById('itemName').value;
    const qty = document.getElementById('itemQty').value;
    const price = document.getElementById('itemPrice').value;
    const status = document.getElementById('itemStatus').value;

    if(!name || !qty || !price) return alert("Fill logistics data");

    const item = {
        id: 'SKU-' + Math.floor(1000 + Math.random() * 9000),
        name,
        qty,
        valuation: (qty * price).toLocaleString(),
        status
    };

    inventory.push(item);
    localStorage.setItem('stockflow_v1', JSON.stringify(inventory));
    renderStock();
    
    // Reset Form
    document.getElementById('itemName').value = "";
    document.getElementById('itemQty').value = "";
    document.getElementById('itemPrice').value = "";
}

function renderStock() {
    const container = document.getElementById('inventoryList');
    container.innerHTML = inventory.map(i => `
        <tr>
            <td><strong>${i.id}</strong></td>
            <td>${i.name}</td>
            <td>${i.qty} units</td>
            <td>PKR ${i.valuation}</td>
            <td><span class="status-tag in-stock">${i.status}</span></td>
        </tr>
    `).reverse().join('');
}

window.onload = renderStock;
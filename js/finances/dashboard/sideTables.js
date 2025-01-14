async function renderFinancesSideTables(totalByRut) {

    const clientTable = document.getElementById('financeDashClients').querySelector('tbody');
    const providersTable = document.getElementById('financeDashProviders').querySelector('tbody');

    const {clients, providers} = totalByRut;

    
    renderSideTable(clientTable, clients);
    renderSideTable(providersTable, providers);
}

async function renderSideTable(tableElement, data) {
    // Clear existing table rows
    tableElement.innerHTML = '';

    // Create table rows based on data
    data.forEach(item => {
        const row = document.createElement('tr');
        row.classList.add('bodyRow');
        // Assuming item has properties 'name' and 'amount'
        row.innerHTML = `<td>${item.name}</td>
                        <td>${item.bills_amount}</td>
                        <td>${getChileanCurrency(Number(item.total))}</td>`;
        tableElement.appendChild(row);
    });
}


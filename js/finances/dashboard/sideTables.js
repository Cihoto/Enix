const clientSideYearSelector = document.getElementById('clientSideYearSelector');
const providerSideYearSelector = document.getElementById('providerSideYearSelector');

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


function getTotalByRut(documents, selectedClientYear = moment().year(), selectedProviderYear = moment().year()){
    const result = {
        clients: {},
        providers: {}
    };  
    console.log('documents',documents);
    console.log('clientSideYearSelector',clientSideYearSelector);
    console.log('providerSideYearSelector',providerSideYearSelector);

    documents.forEach(doc => {
        const { rut, total, issued, business_name,issue_date } = doc;
        const category = issued ? 'clients' : 'providers';


        if(issued && moment(issue_date).year() != selectedClientYear){
            return;
        }

        if(!issued && moment(issue_date).year() != selectedProviderYear){
            return;
        }

        if (!result[category][rut]) {
            result[category][rut] = {
                name: business_name,
                bills_amount: 0,
                total: 0
            };
        }

        result[category][rut].bills_amount += 1;
        result[category][rut].total += total;
    });

    // Convert objects to arrays and sort by total
    result.clients = Object.values(result.clients).sort((a, b) => b.total - a.total);
    result.providers = Object.values(result.providers).sort((a, b) => b.total - a.total);

    return result;
}


clientSideYearSelector.addEventListener('change', async () => {
    const selectedClientYear = clientSideYearSelector.value;
    const selectedProviderYear = providerSideYearSelector.value;

    const totalByRut = getTotalByRut(initialTributarieDocuments['documents'], selectedClientYear, selectedProviderYear);
    renderFinancesSideTables(totalByRut);
});

providerSideYearSelector.addEventListener('change', async () => {
    const selectedClientYear = clientSideYearSelector.value;
    const selectedProviderYear = providerSideYearSelector.value;

    const totalByRut = getTotalByRut(initialTributarieDocuments['documents'], selectedClientYear, selectedProviderYear);
    renderFinancesSideTables(totalByRut);
});


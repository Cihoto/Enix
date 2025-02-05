const clientSideYearSelector = document.getElementById('clientSideYearSelector');
const providerSideYearSelector = document.getElementById('providerSideYearSelector');




async function renderFinancesSideTables(totalByRut) {

    const clientTable = document.getElementById('financeDashClients');
    const providersTable = document.getElementById('financeDashProviders');

    const {clients, providers} = totalByRut;

    console.log('clients',clients);
    console.log('providers',providers);
    
    renderSideTable(clientTable, clients);
    renderSideTable(providersTable, providers);
}

async function renderSideTable(tableElement, data) {

    const tbody = tableElement.querySelector('tbody');
    const tfoot = tableElement.querySelector('tfoot');

    // Clear existing table rows
    tbody.innerHTML = '';
    tfoot.innerHTML = '';

    // Create table rows based on data
    data.forEach(item => {
        const row = document.createElement('tr');
        row.classList.add('bodyRow');
        // Assuming item has properties 'name' and 'amount'
        row.innerHTML = `<td>${item.name}</td>
                        <td>${item.bills_amount}</td>
                        <td>${getChileanCurrency(Number(item.total))}</td>`;
        tbody.appendChild(row);
    });

    tfoot.innerHTML = `<tr class="footerRow">
        <td><strong>Total</strong></td>
        <td><strong>${data.length}</strong></td>
        <td><strong>${getChileanCurrency(data.reduce((acc, curr) => acc + curr.total, 0))}</strong></td>
    </tr>`;
}


function getTotalByRut(data){
    const result = {
        clients: {},
        providers: {}
    };

    const {documents, selectedClientYear, selectedProviderYear} = data;
    const {year: clientYear, month: clientMonth, value: clientValue} = selectedClientYear;
    const {year: providerYear, month: providerMonth, value: providerValue} = selectedProviderYear;

    console.log('documents',documents);
    console.log('clientSideYearSelector',clientSideYearSelector);
    console.log('providerSideYearSelector',providerSideYearSelector);

    documents.forEach(doc => {
        const { rut, total, issued, business_name,issue_date } = doc;
        const category = issued ? 'clients' : 'providers';

        // , selectedProviderYear
        const clientDate= moment(issue_date).format('YYYY-MM') == moment(clientValue).format('YYYY-MM'); ;
        const providerDate = moment(issue_date).format('YYYY-MM') == moment(providerValue).format('YYYY-MM'); ;

        if (issued && !clientDate) return;
        if (!issued && !providerDate) return;

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
    const totalByRut = getTotalByRut(dataForTotalByRut());
    renderFinancesSideTables(totalByRut);
});

providerSideYearSelector.addEventListener('change', async () => {
    const totalByRut = getTotalByRut(dataForTotalByRut());
    renderFinancesSideTables(totalByRut);
});

function dataForTotalByRut(){
    const clientDate = document.getElementById('clientSideYearSelector').value;
    const providerDate = document.getElementById('providerSideYearSelector').value;

    return {
        documents: initialTributarieDocuments['documents'],
        selectedClientYear: {
            value: clientDate,
            month: moment(clientDate).month(),
            year: moment(clientDate).year()
        },
        selectedProviderYear: {
            value: providerDate,
            month: moment(providerDate).month(),
            year: moment(providerDate).year()
        }
    }
}
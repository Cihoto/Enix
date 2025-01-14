let renderDaily = true;
let selectedDasnMonth = moment().format('MM');


document.getElementsByClassName('dashTableRange').forEach((element) => {
    element.addEventListener('click', async (event) => {
        const { target } = event;
        const { value } = target;
        console.log('value', value);
        if(value === 'daily'){
            renderDaily = true;
            financialStatusData = await financialStatusChartData_range();
            renderDashBoardTable(financialStatusData);
            renderDashboardChart(financialStatusData);
        }
        if(value === 'monthly'){
            renderDaily = false;
            financialStatusData = await monthlyFinancialStatusChartData_range();
            renderDashBoardTable(financialStatusData);
            renderDashboardChart(financialStatusData);
        }
    }
    );
});
document.getElementById('monthPickerDashBoard').addEventListener('change', async (event) => {
        const monthlyRange = document.getElementById('monthly');
        if (monthlyRange.checked) {
            renderDaily = false;
            financialStatusData = await monthlyFinancialStatusChartData_range();
        } else {
            renderDaily = true;
            financialStatusData = await financialStatusChartData_range();
        }
        renderDashBoardTable(financialStatusData);
        renderDashboardChart(financialStatusData);
    }
);

async function financialStatusChartData_range(){
    const monthPicker = document.getElementById('monthPickerDashBoard');
    // first day of the month selected
    const dateFrom = moment(monthPicker.value).startOf('month').format('YYYY-MM-DD');
    // last day of the month selected
    const dateTo = moment(monthPicker.value).endOf('month').format('YYYY-MM-DD');
    console.log('dateFrom', dateFrom);
    console.log('dateTo', dateTo);

    const financialStatusData = await getFinancialStatus_range(dateFrom,dateTo);
    return financialStatusData
}
async function monthlyFinancialStatusChartData_range(){
    const monthPicker = document.getElementById('monthPickerDashBoard');
    // first day of the month selected
    const isCurrentMonth = moment(monthPicker.value).isSame(moment(), 'month') && moment(monthPicker.value).isSame(moment(), 'year');
    const dateTo = isCurrentMonth ? moment().format('YYYY-MM-DD') : moment(monthPicker.value).endOf('month').format('YYYY-MM-DD');
    console.log('|| dateTo || ', dateTo);
    // const dateFrom = moment(monthPicker.value)
    // last day of the month selected
    const dateFrom = moment(dateTo).subtract(5, 'weeks').format('YYYY-MM-DD');
    console.log('|| dateFrom || ', dateFrom);

    const financialStatusData = await getFinancialStatus_range(dateFrom,dateTo);
    return financialStatusData
}

function renderDashBoardTable(financialStatus){
    const table = document.getElementById('financialDashBoardTable');
    
    const headerRow = table.querySelector('#financialHeaderRow');
    const incomeRow = table.querySelector('#financialIncomeRow');
    const outflowRow = table.querySelector('#financialOutFlow');
    const avitRow = table.querySelector('#financialAvit');

    console.log('headerRow', headerRow);
    console.log('headerRow', headerRow.querySelectorAll('th')[1]);
    console.log('incomeRow', incomeRow);
    console.log('outflowRow', outflowRow);
    console.log('avitRow', avitRow);

    console.log('+@!#_!+#_+!_@#+!_@#+!_@#+!_@#', financialStatus);




    let index = 1;
    const length = headerRow.querySelectorAll('th').length;
    financialStatus.forEach((financial) => {

        if(index >= length){
            return;
        }

        const { issued, received, total, avit, date,bank_balance } = financial;
        // set moment in spanish
        const dayName = moment(date).locale('es').format('dddd');

        headerRow.querySelectorAll('th')[index].innerHTML = `<p class="headerDate">${dayName}</p> <p class="headerDate">${moment(date).format('DD-MM-YYYY')}</p>`;
        incomeRow.querySelectorAll('td')[index].innerHTML = `<p class="bodyNumber">${getChileanCurrency(Number(issued))}</p>`;
        outflowRow.querySelectorAll('td')[index].innerHTML = `<p class="bodyNumber">${getChileanCurrency(Number(received))}</p>`;
        avitRow.querySelectorAll('td')[index].innerHTML = `<p class="avitNumber">${getChileanCurrency(Number(avit))}</p>`;
        index ++;
    });
}
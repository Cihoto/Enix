let renderDaily = true;
let selectedDasnMonth = moment().format('MM');

const financeDashRangeBack = document.getElementById('financeDashRangeBack');
const financeDashRangeForth = document.getElementById('financeDashRangeForth');
const dashTableRangeButtons = document.getElementsByClassName('dashTableRangeBtn');


dashTableRangeButtons.forEach((element) => {
    element.addEventListener('click', async (event) => {
        dashTableRangeButtons.forEach((btn) => btn.classList.remove('active'));
        event.target.classList.add('active');
        const { target } = event;
        const { value } = target;
        console.log('value || =>', value);
        if(value === 'daily'){
            renderDaily = true;
            const dateFrom = moment().subtract(5, 'days').format('YYYY-MM-DD');
            financialStatusData = await financialStatusChartData_range(dateFrom, moment().format('YYYY-MM-DD'));
            renderDashBoardTable(financialStatusData);
            renderDashboardChart(financialStatusData);
        }
        if(value === 'weekly'){
            renderDaily = false;
            financialStatusData = await monthlyFinancialStatusChartData_range();
            renderDashBoardTable(financialStatusData);
            renderDashboardChart(financialStatusData);
        }

    });
});

document.getElementsByClassName('dashTableRange').forEach((element) => {
    element.addEventListener('click', async (event) => {
        console.log('OTRO EVENTO CLICK');
        const { target } = event;
        const { value } = target;
        console.log('value || =>', value);
        if(value === 'daily'){
            renderDaily = true;
            const dateFrom = moment().subtract(5, 'days').format('YYYY-MM-DD');
            financialStatusData = await financialStatusChartData_range(dateFrom, moment().format('YYYY-MM-DD'));
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
             
            const dateFrom = moment(event.target.value).startOf('month').format('YYYY-MM-DD');
            const dateTo = moment(event.target.value).add(5,'days').format('YYYY-MM-DD');
            financialStatusData = await financialStatusChartData_range(dateFrom,dateTo);
        }
        renderDashBoardTable(financialStatusData);
        renderDashboardChart(financialStatusData);
    }
);


financeDashRangeBack.addEventListener('click', async (event) => {
    console.log("HACIENDO CLICK EN ESTE BOTON")
    financialData.searchDate.dateFrom = moment(financialData.searchDate.dateFrom).subtract(1, 'days').format('YYYY-MM-DD');
    financialData.searchDate.dateTo = moment(financialData.searchDate.dateTo).subtract(1, 'days').format('YYYY-MM-DD');
    console.log('financialData.searchDate.dateFrom', financialData.searchDate.dateFrom);
    console.log('financialData.searchDate.dateTo', financialData.searchDate.dateTo);

    const financialStatusData = await financialStatusChartData_range(financialData.searchDate.dateFrom, financialData.searchDate.dateTo);
    console.log('financialStatusData', financialStatusData);
    renderDashBoardTable(financialStatusData);
    renderDashboardChart(financialStatusData);
});
    

financeDashRangeForth.addEventListener('click', async (event) => {
    console.log("HACIENDO CLICK EN ESTE BOTON")
    financialData.searchDate.dateFrom = moment(financialData.searchDate.dateFrom).add(1, 'days').format('YYYY-MM-DD');
    financialData.searchDate.dateTo = moment(financialData.searchDate.dateTo).add(1, 'days').format('YYYY-MM-DD');
    console.log('financialData.searchDate.dateFrom', financialData.searchDate.dateFrom);
    console.log('financialData.searchDate.dateTo', financialData.searchDate.dateTo);


    const financialStatusData = await financialStatusChartData_range(financialData.searchDate.dateFrom, financialData.searchDate.dateTo);
    console.log('financialStatusData', financialStatusData);
    renderDashBoardTable(financialStatusData);
    renderDashboardChart(financialStatusData);
});



let financialData = {
    maxDate: null,
    minDate: null,
    searchDate: {
        dateFrom: moment().subtract(5, 'days').format('YYYY-MM-DD'),
        dateTo: moment().subtract(1,'days').format('YYYY-MM-DD')
    },
    data: []
} 
async function financialStatusChartData_range(dateFrom,dateTo){

    financialData.searchDate.dateFrom = dateFrom;
    financialData.searchDate.dateTo = dateTo;

    console.log("______________________________________________________________________________________");
    console.log({...financialData})
    const monthPicker = document.getElementById('monthPickerDashBoard');

    

    console.log(...dateFrom,"            ",...dateTo)
    // first day of the month selected
    // const dateFrom = moment(monthPicker.value).startOf('month').format('YYYY-MM-DD');
    // last day of the month selected
    // const dateTo = moment(monthPicker.value).endOf('month').format('YYYY-MM-DD');
    console.log("1")
    dateTo = moment(dateTo).format('YYYY-MM-DD') > moment().format('YYYY-MM-DD') ? moment().format('YYYY-MM-DD') : moment(dateTo).format('YYYY-MM-DD');
    console.log('dateTo', dateTo);
    const firstDateFromDateFrom = moment(dateFrom).startOf('month').format('YYYY-MM-DD');
    if(financialData.data.length === 0){
        console.log("modificacion 1 ")
        const financialStatusData = await getFinancialStatus_range(firstDateFromDateFrom,dateTo);
        financialData.data = financialStatusData;
        financialData.maxDate = dateTo;
        financialData.minDate = firstDateFromDateFrom;
    }
    
    console.log("2");
    console.log(...dateFrom,"            ",...dateTo);
    console.log("  ");

    if(moment(dateTo).isAfter(financialData.maxDate)){
        console.log("modificacion 2")
        const financialStatusData = await getFinancialStatus_range(financialData.maxDate,dateTo);
        financialData.data = financialData.data.concat(financialStatusData);
        financialData.maxDate = dateTo;
    }

    console.log("3");
    console.log(...dateFrom,"            ",...dateTo);
    console.log("  ");

    if(moment(dateFrom).isBefore(financialData.minDate)){
        // console.log("modificacion 3",dateFrom,dateTo)
        const financialStatusData = await getFinancialStatus_range(firstDateFromDateFrom,financialData.minDate);
        financialData.data = financialStatusData.concat(financialData.data);
        financialData.minDate = firstDateFromDateFrom;
    }
    
    
    
    console.log("4")
    console.log("4")
    console.log('dateFrom', dateFrom);
    console.log('dateTo', dateTo);
    
    
    const diffDays = moment(dateTo).diff(moment(dateFrom), 'days');
    console.log('dateTo', dateTo);
    console.log('dateFrom', dateFrom);
    console.log(financialData);
    
    console.log("5")
    
    let days = [];
    for (let m = moment(dateFrom); m.isBefore(financialData.searchDate.dateTo); m.add(1, 'days')) {
        const date = m.format('YYYY-MM-DD');
        const financial = financialData.data.find((financial) => financial.date === date);
        console.log("financial",financial, date);
        if (!financial) {
            days.push({
                date,
                issued: 0,
                received: 0,
                total: 0,
                bank_balance: 0,
                avit: 0
            });
        }else{
            days.push(financial);
        }
    }
    console.log("6")
    
    days.sort((a, b) => moment(a.date).diff(moment(b.date)));

    console.log('days', days);
    return days
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

    console.log('TABLE RENDERING DATA', financialStatus);
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
        incomeRow.querySelectorAll('td')[index].innerHTML = `<p class="bodyNumber">${getChileanCurrency(Number(issued) + Number(bank_balance))}</p>`;
        outflowRow.querySelectorAll('td')[index].innerHTML = `<p class="bodyNumber">${getChileanCurrency(Number(received))}</p>`;
        avitRow.querySelectorAll('td')[index].innerHTML = `<p class="avitNumber">${getChileanCurrency(Number(avit))}</p>`;
        index ++;
    });
}
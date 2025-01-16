const OPTION_BUTTONS = document.querySelectorAll('.btnOpt');
const monthButton = document.querySelectorAll('.monthPicker');
const months = document.querySelectorAll('.mnth');
const monthName = document.getElementById('monthName');
const yearButton = document.querySelectorAll('.yearPicker');
const years = document.querySelectorAll('.yr');
const yearname = document.getElementById('yearName');
const btnRangeSelector = document.getElementsByClassName('btnRangeSelector');

let activePage = {
    dash: true,
    cashFlow: false,
    payments: false,
    charges: false,
    paid: false,
    common: false
};

const selectedPeriod = ()=>{
    const selected = document.querySelector('.btnRangeSelector.active');
    return selected ? selected.getAttribute('period') : 'daily';
}

let selectedMonth = parseInt(moment().format('M'));
let selectedYear = parseInt(moment().format('YYYY'));

OPTION_BUTTONS.forEach(button => {
    button.addEventListener('click', handleOptionButtonClick);
});

monthButton.forEach(button => {
    button.addEventListener('click', openMonthsPicker);
});

months.forEach(month => {
    month.addEventListener('click', handleMonthClick);
});

yearButton.forEach(button => {
    button.addEventListener('click', openYearPicker);
});

years.forEach(year => {
    year.addEventListener('click', handleYearClick);
});

btnRangeSelector.forEach(button => {
    button.addEventListener('click', handleRangeSelectorClick);
});

function handleOptionButtonClick(e) {
    if(!initialDataComplete){
        return
    }
    OPTION_BUTTONS.forEach(button => button.classList.remove('active'));
    let optbtn = e.target.closest('.btnOpt');
    optbtn.classList.add('active');
    let contentToPrint = optbtn.getAttribute('contentToPrint');
    printContent(contentToPrint);
    let opt = optbtn.getAttribute('menuName');
    changeValueHeaderMenu(opt);
}

function changeValueHeaderMenu(value) {
    document.getElementById('contentHeader').innerHTML = value.replaceAll('_', ' ');
}

function removeActivePages() {
    Object.keys(activePage).forEach(key => activePage[key] = false);
}

function removeAllTableClasses() {
    table.className = "";
}

function openMonthsPicker() {
    document.querySelectorAll('.months').forEach(month => month.classList.toggle('active'));
}

function handleMonthClick(e) {
    let month = e.target;
    const monthNumber = parseInt(month.getAttribute('monthnumber'));
    selectedMonth = monthNumber;
    monthName.innerText = monthNumber === parseInt(moment().format('M')) ? 'Mes en curso' : month.innerText;
    renderMyChasFlowTable(selectedMonth, selectedYear);
}

function openYearPicker(e) {
    const { top, left } = e.target.closest('.yearPicker').getBoundingClientRect();
    document.querySelectorAll('.years').forEach(year => {
        year.style.top = `${top + 20}px`;
        year.style.left = `${left}px`;
        year.classList.toggle('active');
    });
}

function handleYearClick(e) {
    let year = e.target;
    selectedYear = parseInt(year.getAttribute('yearNumber'));
    yearname.innerText = year.innerText;
    // renderMyChasFlowTable(selectedMonth, selectedYear);
    const view = Object.keys(activePage).find(key => activePage[key]);
    console.log('view', view);
    handleTableRendering(undefined, selectedYear);
}

async function printContent(content) {

    if(!initialDataComplete){
        return
    }
    document.querySelectorAll('.dinamycFloatingButton').forEach(button => button.remove());
    removeActivePages();
    removeAllTableClasses();
    showView(content)
    
}

function handleTableRendering(month = moment().format("MM"), year = moment().format('YYYY')){
    console.log('handleTableRendering');
    let activePageName = Object.keys(activePage).find(key => activePage[key]);

    // get activePage object and get the key that is true
    activePageName = Object.keys(activePage).find(key => {
        console.log('+++++activePage[key]+++++', activePage[key]);
        return activePage[key]
    });
    
    
    console.log('activePageName', activePageName);

    switch (activePageName) {
        case 'dash':


            prepareDataForDashBoard();
            if(initialDataComplete){
                renderDashCards();
            }
            break;

        case 'cashFlow':
            if(selectedPeriod() == 'daily') {
                console.log('selectedPeriod() DAILY', selectedPeriod());
                renderMyChasFlowTable(month, year).then(() => {
                    renderCashFlowTable();
                });
            }
            if(selectedPeriod() == 'monthly') {
                console.log('selectedPeriod() MONTHLY', selectedPeriod());
                resumeCshFlowMonthly(year);
            }
            break;
        case 'payments':
            renderPaymentsCards();
            renderPaymentsTable(cardFilterAllPaymentsDocuments());
            // renderPaymentsTable(cardFilterAllPaymentsDocuments());
            break;
        case 'charges':
            renderChargesCards();
            renderChargesTable(cardFilterAllChargesDocuments());
            break;
        case 'paid':
            renderPaidDocuments(getPaidDocuments(), false);
            break;
        case 'common':
            renderCommonMovementsTable();
            break;
    }
}

function showView(view) {
    // $('#bankMovementsTableHorizontal tr').remove();

    thead.innerHTML = '';
    tbody.innerHTML = '';
    tfoot.innerHTML = '';
    const dashTableMenu = document.getElementById('dashTableMenu');
    const dashTable = document.getElementById('financialDashBoardTable');
    const financialDashChart = document.getElementById('financialDashChart');
    const mainContent = document.getElementById('mainContent-dash');

    console.log('dashTable', dashTable);

    if(view === 'dash') {
        document.getElementById('optionsMenu').style.display = 'none';
        document.getElementById('cardHeaderTopMenu').style.display = 'none';
        document.getElementById('periodSelectors').style.display = 'none';
        // document.getElementById('doughtnutChart').style.display = 'flex'; 
        document.getElementById('sideTableContainer').style.display = 'flex'; 
        document.getElementById('financesCardTableContainer').classList.add('dash');
        mainContent.style.display = 'flex';
        dashTableMenu.style.display = 'flex';
        dashTable.style.display = 'flex';
        financialDashChart.style.display = 'block';
    }else{
        document.getElementById('optionsMenu').style.display = 'flex';
        // document.getElementById('cardHeaderTopMenu').style.display = 'flex';
        document.getElementById('periodSelectors').style.display = 'flex';
        document.getElementById('sideTableContainer').style.display = 'none';
        document.getElementById('financesCardTableContainer').classList.remove('dash');
        mainContent.style.display = 'block';

        dashTableMenu.style.display = 'none';
        dashTable.style.display = 'none';
        financialDashChart.style.display = 'none';
    }



    switch (view) {
        case 'dash':
            activePage.dash = true;
            handleTableRendering();
            break;
        case 'flj':
            setCashFlowControls();
            activePage.cashFlow = true;
            table.classList.add('horizontal', 'cashFlowTable');
            handleTableRendering(selectedMonth, selectedYear)
            break;
        case 'pag':
            // CONFIG PAGE
            setCharges_Payments_Controls();
            activePage.payments = true;
            resetHidePaidDocumentsButton();
            paymentsIsActive = true;
            table.classList.add('vertical');
            sortedByDate = 0;
            // RENDER TABLE
            handleTableRendering()
            break;
        case 'cob':
            setCharges_Payments_Controls();
            activePage.charges = true;
            actualNotPaidFilter = false;
            resetHidePaidDocumentsButton();
            chargesIsActive = true;
            table.classList.add('vertical');
            sortedByDate = 0;
            handleTableRendering()
            break;
        case 'paid':
            setCharges_PaidControls();
            activePage.paid = true;
            actualNotPaidFilter = false;
            table.classList.add('vertical');
            sortedByDate = 0;
            handleTableRendering()
            break;
        case 'common':
            setCommonMovementsControls();
            activePage.common = true;
            table.classList.add('vertical', 'commonMovementsTable');
            handleTableRendering()
            break;
    }
}

function hideDateSelectors() {
    document.getElementById('datePicker').style.display = 'none';
}

function showDateSelectors() {
    document.getElementById('datePicker').style.display = 'flex';
}

function hideFolioFilter() {
    document.getElementById('filterByFolio').style.display = 'none';
}

function showFolioFilter() {
    document.getElementById('filterByFolio').style.display = 'flex';
}

function hideIssued_RecievedButtons() {
    document.getElementById('utilityBtns').style.display = 'none';
}

function showIssued_RecievedButtons() {
    document.getElementById('utilityBtns').style.display = 'flex';
}

function showPeriodButtons() {
    document.getElementById('periodSelectors').style.display = 'flex';
}

function hidePeriodButtons() {
    document.getElementById('periodSelectors').style.display = 'none';
}

function setCashFlowControls() {
    showDateSelectors();
    hideFolioFilter();
    hideIssued_RecievedButtons();
    showPeriodButtons();
}

function setCharges_Payments_Controls() {
    hidePeriodButtons();
    hideDateSelectors();
    showFolioFilter();
    hideIssued_RecievedButtons();
}

function setCharges_PaidControls() {
    hidePeriodButtons();
    hideDateSelectors();
    showFolioFilter();
    showIssued_RecievedButtons();
}

function setCommonMovementsControls() {
    hidePeriodButtons();
    hideDateSelectors();
    hideFolioFilter();
    hideIssued_RecievedButtons();
}

function handleRangeSelectorClick(e) {
    btnRangeSelector.forEach(button => button.classList.remove('active'));
    e.target.closest('.btnRangeSelector').classList.add('active');
    const period = selectedPeriod();

    if(period == 'monthly') {
        monthButton[0].style.display = 'none';
    }
    if(period == 'daily') {
        monthButton[0].style.display = 'flex';
    }
    
    handleTableRendering(undefined, selectedYear);
}










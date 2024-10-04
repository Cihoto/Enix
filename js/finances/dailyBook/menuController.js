const OPTION_BUTTONS = document.querySelectorAll('.btnOpt');
const monthButton = document.querySelectorAll('.monthPicker');
const months = document.querySelectorAll('.mnth');
const monthName = document.getElementById('monthName');

let activePage = {
    cashFlow : false,
    payments : false,
    charges : false,
    paid: false,
    common : false
}
OPTION_BUTTONS.forEach((button) => {
    button.addEventListener('click', (e) => {
        OPTION_BUTTONS.forEach((button) => {
            button.classList.remove('active');
        });

        let optbtn = e.target;
        console.log(optbtn);
        if(!optbtn.classList.contains('btnOpt')) {
            // find the parent of the button
            optbtn = e.target.parentElement;

            while(!optbtn.classList.contains('btnOpt')) {
                optbtn = optbtn.parentElement;
            }
        }
        console.log(optbtn);
        
        let contentToPrint = optbtn.getAttribute('contentToPrint');
        printContent(contentToPrint)
        optbtn.classList.add('active');
        // get name atttribute of the button
        let opt = optbtn.getAttribute('menuName');
        changeValueHeaderMenu(opt);
        // get the content to print

    });

});

function changeValueHeaderMenu(value) {
    let header = document.getElementById('contentHeader');


    header.innerHTML = value.replaceAll('_', ' ');
}

async function printContent(content) {

    // remove all active pages
    removeActivePages();
    //remove all tr on thead

    console.log('THEAD',thead);
    console.log('THEAD ROWS',table.rows);

    // CONST FROM tributrarieTableHandlers.js
    // RESET VARIABLES
    paymentsIsActive = false;
    chargesIsActive = false;
    removeAllTableClasses();
    
    // remove tr from table
    $('#bankMovementsTableHorizontal tr').remove();

    // redirect to the correct content
    if(content === 'dash') {
        // printDash();
    }   
    if(content === 'flj') {

        activePage.cashFlow = true;
        table.classList.add('horizontal');
        table.classList.add('cashFlowTable');
        
        renderMyChasFlowTable(selectedMonth);
        return 
        await getTotalOutCome();
        renderMyHorizontalView([selectedMonth]);
        printDailyBookTable(tbody,
            allDaysOnYear,
            getDocumentOutPaymentDate,
            incomeAccountRows,
            accountData_IncomeNoDocumentWithFolio, 
            accountData_OutcomeNoDocumentWithFolio,
            outRows,
            futureDocuments,
            totalDailyBalance);

        setTimeout(() => {

            console.log(table.rows)
        }, 3000);

    }   
    if(content === 'pag') {
        activePage.payments = true;
        resetHidePaidDocumentsButton();
        paymentsIsActive = true;
        table.classList.add('vertical');
        // change value to msort futureDocuments by date 
        // set on -1 to sort by date
        // sortedByDate = -1;
        sortedByDate = 0;
        // renderPendingPayments();
        renderPaymentsCards();
        renderPaymentsTable(cardFilterAllPaymentsDocuments());
    }   
    if(content === 'cob') {
        activePage.charges = true;
        actualNotPaidFilter = false;

        resetHidePaidDocumentsButton();
        chargesIsActive = true;
        table.classList.add('vertical');
        // change value to msort futureDocuments by date 
        // set on -1 to sort by date
        // sortedByDate = -1;
        sortedByDate = 0;
        renderChargesCards();
        renderChargesTable(cardFilterAllChargesDocuments());
    }   
    if(content === 'paid') {

        activePage.paid = true; 
        actualNotPaidFilter = false;

        table.classList.add('vertical');
        sortedByDate = 0;

        renderPaidDocuments(getPaidDocuments(),false);

        return
        actualNotPaidFilter = false;
        resetHidePaidDocumentsButton();
        chargesIsActive = true;
        // change value to msort futureDocuments by date 
        // set on -1 to sort by date
        // sortedByDate = -1;
    }   
    if(content === 'common') {

        console.log('common');
        console.log('common');

        activePage.common = true;
        table.classList.add('vertical');
        table.classList.add('commonMovementsTable');
        renderCommonMovementsTable();
    }
};
function removeActivePages() {
    activePage.cashFlow = false;
    activePage.payments = false;
    activePage.charges = false;
    activePage.paid = false;
    activePage.common = false;
}

function removeAllTableClasses(){
    table.classList = "";
}

monthButton.forEach((button) => {
    button.addEventListener('click', (e) => {
        openMonthsPicker();
    });
});

function openMonthsPicker() {
    document.querySelectorAll('.months').forEach(month => {
        month.classList.toggle('active');
    });
}

let selectedMonth = parseInt(moment().format('M'));
months.forEach((month) => {
    const currentMonthNumber = parseInt(moment().format('M'));
    month.addEventListener('click', (e) => {
        let month = e.target;
        console.log(month);
        const monthNumber = parseInt(month.getAttribute('monthnumber'));

        if(monthNumber === currentMonthNumber) {
            monthName.innerText = 'Mes en curso';
            // return;
        }
        selectedMonth = monthNumber;
        monthName.innerText = month.innerText;
        console.log(monthNumber);

        renderMyChasFlowTable(selectedMonth)
        // getandSetDatafromClay(monthNumber);
    })
});





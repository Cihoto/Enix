const currentBankBalance = document.getElementById('currentBankBalance');
const pendingPayments = document.getElementById('pendingDocuments');
const totalPendingPayments = document.getElementById('totalPendingPayments');
const pendingCharges = document.getElementById('pendingCharges');
const totalPendingCharges = document.getElementById('totalPendingCharges');

function setBankResumeData(data) {
    setCurrentBankBalance(data.currentBankBalance);
    setPendingPayments(data.pendingPayments);
    setPendingCharges(data.pendingCharges);
}
function setCurrentBankBalance(balance) {
    currentBankBalance.innerHTML = getChileanCurrency(balance);
}
function setPendingPayments(payments) {
    pendingPayments.innerHTML = getChileanCurrency(payments.total);
}
function setPendingCharges(charges) {
    pendingCharges.innerHTML = getChileanCurrency(charges.total);
}


async function renderCashFlowTable() {

    cardsContainer.innerHTML = setCashFlowCards();
    return

}

function setCashFlowCards() {
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
    const charges = tributarieCardsData.charges;
    const payments = tributarieCardsData.payments;
    const todayIndex = allMyDates.findIndex((myDate) => myDate == moment().format('YYYY-MM-DD'));
    const dayOfTheYear = moment().dayOfYear();
    const todayAllDates = allMyDates[todayIndex];
    console.log('charges',charges)
    console.log('payments',payments)
    console.log('todayIndex',todayIndex)
    console.log('dayOfTheYear',dayOfTheYear)
    console.log('todayAllDates',todayAllDates)
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
    const selectedMonthDays = cashFlowTotals.totals.find((date)=>{
        return todayAllDates == date.date;
    });
    if(!selectedMonthDays){
        return
    }
        

    console.log('todayIndex', todayIndex);
    console.log('todayAllDates', todayAllDates);
    console.log('todayAllDates.previousAccountBalance', todayAllDates.bankBalance);
    console.log('charges.totalDocuments.total', charges.totalDocuments.total);
    console.log('payments.totalDocuments.total', payments.totalDocuments.total);

    const accountBalance = selectedMonthDays.bankBalance;


    const avitDef = accountBalance + Number(charges.totalUnpaid.total) - Number(payments.totalUnpaid.total);
    return `
                <div class="card yellow"  onClick="renderChargesTable()">
                    <div class="content">
                        <div class="titles">
                            <p>Saldo en Cuenta</p>
                            <div class="sub-txt">
                                <p id="totalPendingPayments" class="sub-amount"></p>
                                <p id="currentBankBalance">${getChileanCurrency(accountBalance)}</p>
                            </div>
                        </div>
                        <div class="info">
                            <img src="./assets/css/financessvg/cardInfo.svg" alt="">
                        </div>
                    </div>
                </div>
                <div class="card cyan" onClick="">
                    <div class="content">
                        <div class="titles">
                            <p>Facturas por cobrar</p>
                            <div class="sub-txt">
                                <p>${charges.totalUnpaid.amount}</p>
                                <p id="pendingCharges">${getChileanCurrency(charges.totalUnpaid.total)}</p>

                            </div>
                        </div>
                        <div class="info">
                            <img src="./assets/css/financessvg/cardInfo.svg" alt="">
                        </div>
                    </div>
                </div>
                <div class="card orange" onClick="">
                    <div class="content">
                        <div class="titles">
                            <p>Facturas por pagar</p>
                            <div class="sub-txt">
                                <p id="totalPendingCharges" class="sub-amount">${payments.totalUnpaid.amount}</p>
                                <p id="pendingCharges">${getChileanCurrency(payments.totalUnpaid.total)}</p>
                            </div>
                        </div>
                        <div class="info">
                            <img src="./assets/css/financessvg/cardInfo.svg" alt="">
                        </div>
                    </div>
                </div>
                <div class="card purple" onClick="renderChargesTable()">
                    <div class="content">
                        <div class="titles">
                            <p>Superávit / Déficit</p>
                            <div class="sub-txt">
                                <p id="totalPendingPayments" class="sub-amount"></p>
                                <p id="pendingDocuments">${getChileanCurrency(avitDef)}</p>
                            </div>
                        </div>
                        <div class="info">
                            <img src="./assets/css/financessvg/cardInfo.svg" alt="">
                        </div>
                    </div>
                </div>`
}


async function  renderDashCards(){
    cardsContainer.innerHTML = await setDashCards();
}

async function setDashCards() {   
    await prepareCashFlowData()
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
    const charges = tributarieCardsData.charges;
    const payments = tributarieCardsData.payments;
    const todayIndex = allMyDates.findIndex((myDate) => myDate == moment().format('YYYY-MM-DD'));
    const dayOfTheYear = moment().dayOfYear();
    const todayAllDates = allMyDates[todayIndex];
    console.log('charges',charges)
    console.log('payments',payments)
    console.log('todayIndex',todayIndex)
    console.log('dayOfTheYear',dayOfTheYear)
    console.log('todayAllDates',todayAllDates)
    console.log('cashFlowTotals',cashFlowTotals.totals)
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
    const selectedMonthDays = cashFlowTotals.totals.find((date)=>{
        
        return todayAllDates == date.date;
    });

    console.log('selectedMonthDays',selectedMonthDays)

    if(!selectedMonthDays){
        return
    }
        

    console.log('todayIndex', todayIndex);
    console.log('todayAllDates', todayAllDates);
    console.log('todayAllDates.previousAccountBalance', todayAllDates.bankBalance);
    console.log('charges.totalDocuments.total', charges.totalDocuments.total);
    console.log('payments.totalDocuments.total', payments.totalDocuments.total);

    const accountBalance = selectedMonthDays.bankBalance;


    const abitDef = accountBalance + Number(charges.totalUnpaid.total) - Number(payments.totalUnpaid.total);
    return `
    <div class="card yellow">
        <div class="content">
            <div class="titles">
                <p>Saldo en Cuenta</p>
                <div class="sub-txt">
                    <p id="totalPendingPayments" class="sub-amount"></p>
                    <p id="currentBankBalance">${getChileanCurrency(accountBalance)}</p>
                </div>
            </div>
            <div class="info">
                <img src="./assets/css/financessvg/cardInfo.svg" alt="">
            </div>
        </div>
    </div>
    <div class="card cyan" onClick="">
        <div class="content">
            <div class="titles">
                <p>Facturas por cobrar</p>
                <div class="sub-txt">
                    <p>${charges.totalUnpaid.amount}</p>
                    <p id="pendingCharges">${getChileanCurrency(charges.totalUnpaid.total)}</p>

                </div>
            </div>
            <div class="info">
                <img src="./assets/css/financessvg/cardInfo.svg" alt="">
            </div>
        </div>
    </div>
    <div class="card orange" onClick="">
        <div class="content">
            <div class="titles">
                <p>Facturas por pagar</p>
                <div class="sub-txt">
                    <p id="totalPendingCharges" class="sub-amount">${payments.totalUnpaid.amount}</p>
                    <p id="pendingCharges">${getChileanCurrency(payments.totalUnpaid.total)}</p>
                </div>
            </div>
            <div class="info">
                <img src="./assets/css/financessvg/cardInfo.svg" alt="">
            </div>
        </div>
    </div>
    <div class="card purple">
        <div class="content">
            <div class="titles">
                <p>Superávit / Déficit</p>
                <div class="sub-txt">
                    <p id="totalPendingPayments" class="sub-amount"></p>
                    <p id="pendingDocuments">${getChileanCurrency(abitDef)}</p>
                </div>
            </div>
            <div class="info">
                <img src="./assets/css/financessvg/cardInfo.svg" alt="">
            </div>
        </div>
    </div>`
}








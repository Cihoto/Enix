    let totalPaymentsObj = {
        totalPayments : 0,
        pendingBH:{
            total:0,
            totalDocuments:0
        },
        pendingBills : {
            total:0,
            totalDocuments:0
        },
        pendingDocuments : {
            total:0,
            totalDocuments:0
        }
    }
function renderPaymentsCards(){ 

    cardsContainer.innerHTML = setMyPaymentsCards();


    return 
    const futurePayments = futureDocuments.filter(({recibida,}) => recibida);
    futurePayments.forEach(({tipo,pagada,saldo_isoluto,total}) => {
        // if(pagada){
        //     return;
        // }
        const totalDocument = saldo_isoluto == null ? total.total : parseInt(total.total) - parseInt(saldo_isoluto);
        const documentType = tipo.split(' ');
        // format the document type and set on lowercase
        const documentTypeFormatted = documentType.map((word) => word.toLowerCase());
        console.log('documentTypeFormatted',documentTypeFormatted);
        if(documentTypeFormatted.includes('factura')){
            totalPaymentsObj.pendingBills.totalDocuments++;
            totalPaymentsObj.pendingBills.total += totalDocument;
        }
        if(tipo.toLowerCase() == "boleta de honorarios"){
            totalPaymentsObj.pendingBH.totalDocuments++;
            totalPaymentsObj.pendingBH.total += totalDocument;
        }
    });
    console.log('totalPaymentsObj',totalPaymentsObj);
}


function setMyPaymentsCards(){
    const payments = tributarieCardsData.payments;
    console.log('payments',payments);
    return `
        <div class="card yellow" id="payYellowCard" onClick="renderPaymentsTable(cardFilterAllPaymentsDocuments('yellow'))">
            <div class="content">
                <div class="titles">
                    <p>Total obligaciones</p>
                    <div class="sub-txt">
                        <p id="currentBankBalance">${payments.totalDocuments.amount}</p>
                        <p id="currentBankBalance">${getChileanCurrency(payments.totalDocuments.total)}</p>
                    </div>
                </div>
                <div class="info">
                    <img src="./assets/css/financessvg/cardInfo.svg" alt="">
                </div>
            </div>
        </div>
        <div class="card orange" id="payOrangeCard" onClick="renderPaymentsTable(cardFilterBhePaymentsDocuments())">
            <div class="content">
                <div class="titles">
                    <p>BBHH por pagar</p>
                    <div class="sub-txt">
                        <p id="totalPendingPayments" class="sub-amount">${payments.bhe.amount}</p>
                        <p id="pendingDocuments">${getChileanCurrency(payments.bhe.total)}</p>
                    </div>
                </div>
                <div class="info">
                    <img src="./assets/css/financessvg/cardInfo.svg" alt="">
                </div>
            </div>
        </div>
        <div class="card cyan" id="payCyanCard" onClick="renderPaymentsTable(cardFilterPendingBillsPaymentsDocuments())">
            <div class="content">
                <div class="titles">
                    <p>Facturas por pagar</p>
                    <div class="sub-txt">
                        <p id="totalPendingCharges" class="sub-amount">${payments.bills.amount}</p>
                        <p id="pendingCharges">${getChileanCurrency(payments.bills.total)}</p>
                    </div>
                </div>
                <div class="info">
                    <img src="./assets/css/financessvg/cardInfo.svg" alt="">
                </div>
            </div>
        </div>
        <div class="card purple" id="payPurpleCard" onClick="renderPaymentsTable(cardFilterDuePaymentsDocuments())">
            <div class="content">
                <div class="titles">
                    <p>Documentos atrasados</p>
                    <div class="sub-txt">
                        <p id="totalPendingCharges" class="sub-amount">${payments.pendingDocuments.amount}</p>
                        <p>${getChileanCurrency(payments.pendingDocuments.total)}</p>
                    </div>
                </div>
                <div class="info">
                    <img src="./assets/css/financessvg/cardInfo.svg" alt="">
                </div>
            </div>
        </div>`
}
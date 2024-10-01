// Objective: set the charges cards
//
// 1. Create a function called 'renderChargesCards' that takes no parameters.
// 2. Inside the function, set the innerHTML of the 'cardsContainer' to the value returned by the function 'setChargesCards'.
// 3. Export the function 'renderChargesCards'.
// 4. Create a function called 'setChargesCards' that takes no parameters.
// 5. Inside the function, return the following template literal.



function renderChargesCards(){ 

    cardsContainer.innerHTML = setChargesCards();

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

function setChargesCards(){
    const charges = tributarieCardsData.charges;
    return `
                <div class="card yellow"  onClick="renderChargesTable(cardFilterAllChargesDocuments())">
                    <div class="content">
                        <div class="titles">
                            <p>Facturación anual</p>
                            <div class="sub-txt">
                                <p id="totalPendingPayments" class="sub-amount">${charges.totalDocuments.amount}</p>
                                <p id="currentBankBalance">${getChileanCurrency(charges.totalDocuments.total)}</p>
                            </div>
                        </div>
                        <div class="info">
                            <img src="./assets/css/financessvg/cardInfo.svg" alt="">
                        </div>
                    </div>
                </div>
                <div class="card orange" onClick="renderChargesTable(cardFilterPendingChargesDocuments())">
                    <div class="content">
                        <div class="titles">
                            <p>Pendientes de pago</p>
                            <div class="sub-txt">
                                <p id="totalPendingCharges" class="sub-amount">${charges.upToDateDocuments.amount}</p>
                                <p id="pendingCharges">${getChileanCurrency(charges.upToDateDocuments.total)}</p>
                            </div>
                        </div>
                        <div class="info">
                            <img src="./assets/css/financessvg/cardInfo.svg" alt="">
                        </div>
                    </div>
                </div>
                <div class="card cyan" onClick="renderChargesTable(cardFilterDueChargesDocuments())">
                    <div class="content">
                        <div class="titles">
                            <p>Facturas Atrasados 30 dias</p>
                            <div class="sub-txt">
                                <p>${charges.dueDocuments.amount}</p>
                                <p id="pendingCharges">${getChileanCurrency(charges.dueDocuments.total)}</p>

                            </div>
                        </div>
                        <div class="info">
                            <img src="./assets/css/financessvg/cardInfo.svg" alt="">
                        </div>
                    </div>
                </div>
                <div class="card purple" onClick="renderChargesTable(cardFilterExpiredChargesDocuments())">
                    <div class="content">
                        <div class="titles">
                            <p>Facturas vencidas 60 dias</p>
                            <div class="sub-txt">
                                <p id="totalPendingPayments" class="sub-amount">${charges.outdatedDocuments.amount}</p>
                                <p id="pendingDocuments">${getChileanCurrency(charges.outdatedDocuments.total)}</p>
                            </div>
                        </div>
                        <div class="info">
                            <img src="./assets/css/financessvg/cardInfo.svg" alt="">
                        </div>
                    </div>
                </div>`
}



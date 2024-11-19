// BORDER COLOR ARRAYS 
const cardBorderColor = {
    yellow: '10px solid #FFD700',
    orange: '10px solid #FD7202',
    cyan:   '10px solid #00C7D4',
    purple: '12px solid #326',
}


function setNewActiveCard(cardId){
    // remove active class from all cards
    const allcards = document.querySelectorAll('.card');
    allcards.forEach(card => {
        card.classList.remove('active');
    });

    const card = document.getElementById(cardId);
    card.classList.add('active');
}


// HANDLE CARDS RENDERING


// SECTION START - HANDLE PAYMENTS CARDS RENDERING
function getPaymentsDocuments(){
    return sortTributarieDocumentsByDate('payments');
}

function cardFilterAllPaymentsDocuments(color = 'yellow'){
    const futurePayments = getPaymentsDocuments();

    setNewActiveCard('payYellowCard')
    document.getElementById('financesCardTableContainer').style.borderLeft = `${cardBorderColor[color]}`;

    return futurePayments;
}
function cardFilterBhePaymentsDocuments(color = 'orange'){
    const futurePayments = getPaymentsDocuments();
    const bhePayments = futurePayments.filter(({tipo_documento}) => tipo_documento === 'bhe');
    setNewActiveCard('payOrangeCard')
    // document.getElementById('payOrangeCard').classList.add('active');
    document.getElementById('financesCardTableContainer').style.borderLeft = `${cardBorderColor[color]}`;

    return bhePayments;
}
function cardFilterPendingBillsPaymentsDocuments(color = 'cyan'){
    const futurePayments = getPaymentsDocuments();
    const pendingBillsPayments = futurePayments.filter(({tipo_documento,paid}) => tipo_documento === 'factura' && !paid);
    setNewActiveCard('payCyanCard')
    // document.getElementById('payCyanCard').classList.add('active');
    document.getElementById('financesCardTableContainer').style.borderLeft = `${cardBorderColor[color]}`;

    return pendingBillsPayments;
}
function cardFilterDuePaymentsDocuments(color = 'purple'){
    const futurePayments = getPaymentsDocuments();
    const duePayments = futurePayments.filter(({vencido,paid,vencida_por}) => vencido && !paid && vencida_por > 30);
    setNewActiveCard('payPurpleCard')
    // document.getElementById('payPurpleCard').classList.add('active');
    document.getElementById('financesCardTableContainer').style.borderLeft = `${cardBorderColor[color]}`;
    return duePayments;
}


// END SECTION - HANDLE PAYMENTS CARDS RENDERING

// SECTION START - HANDLE CHARGES CARDS RENDERING
function getChargesDocuments(){
    return sortTributarieDocumentsByDate('charges');
}

function cardFilterAllChargesDocuments(){
    const futurePayments = getChargesDocuments();

    
    return futurePayments;
}

function cardFilterAllChargesDocuments(){
    const futureCharges = getChargesDocuments();
    return futureCharges;
} 
function cardFilterPendingChargesDocuments(){
    const futureCharges = getChargesDocuments();
    const pendingCharges = futureCharges.filter(({paid}) =>{return !paid})   
    return pendingCharges;
}
function cardFilterDueChargesDocuments(){
    const futureCharges = getChargesDocuments();
    const dueCharges = futureCharges.filter(({paid,vencida_por}) =>{return !paid && vencida_por > 30 && vencida_por < 60})   
    return dueCharges;
}
function cardFilterExpiredChargesDocuments(){
    const futureCharges = getChargesDocuments();
    const expiredCharges = futureCharges.filter(({paid,vencida_por}) =>{return !paid && vencida_por > 60})   
    return expiredCharges;
}


// END SECTION - HANDLE CHARGES CARDS RENDERING


// SECTION START - HANDLE PADI DOCUMENTS CARDS RENDERING
function getPaidDocuments(){
    const paidDocuments = sortAllPaidDocuments();
    return paidDocuments;
}

function sortIssuedDocuments(){
    const paidDocuments = getPaidDocuments();
    const issuedDocuments = paidDocuments.filter(({emitida}) => emitida);
    return issuedDocuments;
}
function sortReceivedDocuments(){
    const paidDocuments = getPaidDocuments();
    const issuedDocuments = paidDocuments.filter(({emitida}) => !emitida);
    return issuedDocuments;
}




























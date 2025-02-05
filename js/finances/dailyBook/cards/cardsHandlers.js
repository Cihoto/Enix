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
function cardFilterAllPaymentsDocuments_ascDate(color = 'yellow'){
    const futurePayments = getPaymentsDocuments();

    // roder by fecha_emision_timestamp asc

    futurePayments.sort((a,b) => {
        if(a.fecha_emision_timestamp < b.fecha_emision_timestamp){
            return -1;
        }
        if(a.fecha_emision_timestamp > b.fecha_emision_timestamp){
            return 1;
        }
        return 0;
    });
    

    setNewActiveCard('payYellowCard')
    document.getElementById('financesCardTableContainer').style.borderLeft = `${cardBorderColor[color]}`;

    return futurePayments;
}
function cardFilterAllPaymentsDocuments_descDate(color = 'yellow'){
    const futurePayments = getPaymentsDocuments();

    // roder by fecha_emision_timestamp asc

    futurePayments.sort((a,b) => {
        if(a.fecha_emision_timestamp < b.fecha_emision_timestamp){
            return 1;
        }
        if(a.fecha_emision_timestamp > b.fecha_emision_timestamp){
            return -1;
        }
        return 0;
    });

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
    const duePayments = futurePayments.filter(({paid,vencida_por}) => !paid && vencida_por > 0);
    console.log('futurePayments',futurePayments);
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

function cardFilterAllChargesDocuments(color = 'yellow'){
    const futurePayments = getChargesDocuments();
    document.getElementById('financesCardTableContainer').style.borderLeft = `${cardBorderColor[color]}`;
    
    return futurePayments;
}

function cardFilterAllChargesDocuments_ascDate(){
    const futurePayments = getChargesDocuments();

    // roder by fecha_emision_timestamp asc


    futurePayments.sort((a,b) => {
        if(a.fecha_emision_timestamp < b.fecha_emision_timestamp){
            return -1;
        }
        if(a.fecha_emision_timestamp > b.fecha_emision_timestamp){
            return 1;
        }
        return 0;
    });
    
    return futurePayments;
}
function cardFilterAllChargesDocuments_descDate(){
    const futurePayments = getChargesDocuments();

    // roder by fecha_emision_timestamp asc


    futurePayments.sort((a,b) => {
        if(a.fecha_emision_timestamp < b.fecha_emision_timestamp){
            return 1;
        }
        if(a.fecha_emision_timestamp > b.fecha_emision_timestamp){
            return -1;
        }
        return 0;
    });
    
    return futurePayments;
}

function cardFilterAllChargesDocuments(){
    const futureCharges = getChargesDocuments();
    return futureCharges;
} 
function cardFilterPendingChargesDocuments(color = 'orange'){
    const futureCharges = getChargesDocuments();
    const pendingCharges = futureCharges.filter(({paid}) =>{return !paid})   
    document.getElementById('financesCardTableContainer').style.borderLeft = `${cardBorderColor[color]}`;

    return pendingCharges;
}
function cardFilterDueChargesDocuments(color = 'cyan'){
    const futureCharges = getChargesDocuments();
    const dueCharges = futureCharges.filter(({paid,vencida_por}) =>{return !paid && vencida_por > 30 && vencida_por < 60})   
    document.getElementById('financesCardTableContainer').style.borderLeft = `${cardBorderColor[color]}`;

    return dueCharges;
}
function cardFilterExpiredChargesDocuments(color = 'purple'){
    const futureCharges = getChargesDocuments();
    const expiredCharges = futureCharges.filter(({paid,vencida_por}) =>{return !paid && vencida_por > 60})   
    document.getElementById('financesCardTableContainer').style.borderLeft = `${cardBorderColor[color]}`;

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




























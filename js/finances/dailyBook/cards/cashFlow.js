const currentBankBalance = document.getElementById('currentBankBalance');
const pendingPayments = document.getElementById('pendingDocuments');
const totalPendingPayments = document.getElementById('totalPendingPayments');
const pendingCharges = document.getElementById('pendingCharges');
const totalPendingCharges = document.getElementById('totalPendingCharges');

function setBankResumeData(data){
    setCurrentBankBalance(data.currentBankBalance);
    setPendingPayments(data.pendingPayments);
    setPendingCharges(data.pendingCharges);
}
function setCurrentBankBalance(balance){
    currentBankBalance.innerHTML = getChileanCurrency(balance);
}
function setPendingPayments(payments){
    pendingPayments.innerHTML = getChileanCurrency(payments.total) ;
}
function setPendingCharges(charges){
    pendingCharges.innerHTML = getChileanCurrency(charges.total) ;
}





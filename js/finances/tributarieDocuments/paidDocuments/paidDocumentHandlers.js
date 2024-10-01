const showIssuedBtn = document.getElementById('showIssued');
const showReceivedBtn = document.getElementById('showReceived');
const showAllBtn = document.getElementById('showAll');

showIssuedBtn.addEventListener('click', () => {
    renderPaidDocuments(sortIssuedDocuments(),false)
});
showReceivedBtn.addEventListener('click', () => {
    renderPaidDocuments(sortReceivedDocuments(),false)
});
showAllBtn.addEventListener('click', () => {
    renderPaidDocuments(getPaidDocuments(),false);
});
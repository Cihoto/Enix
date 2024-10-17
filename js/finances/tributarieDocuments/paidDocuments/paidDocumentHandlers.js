const showIssuedBtn = document.getElementById('showIssued');
const showReceivedBtn = document.getElementById('showReceived');
const showAllBtn = document.getElementById('showAll');
const utilityButtons = document.getElementsByClassName('utilityButtons');

showIssuedBtn.addEventListener('click', () => {
    renderPaidDocuments(sortIssuedDocuments(),false)
});
showReceivedBtn.addEventListener('click', () => {
    renderPaidDocuments(sortReceivedDocuments(),false)
});
showAllBtn.addEventListener('click', () => {
    renderPaidDocuments(getPaidDocuments(),false);
});


// utilityButton onclick add active class and remove from others
for (let index = 0; index < utilityButtons.length; index++) {
    const button = utilityButtons[index];
    button.addEventListener('click', (e) => {
        for (let index = 0; index < utilityButtons.length; index++) {
            const button = utilityButtons[index];
            button.classList.remove('active');
        }
        button.classList.add('active');
    });
}
const hidePaidDocumentsButton = document.getElementById('hidePaidDocuments');
const tributarieDocumentsTable = document.querySelector('#bankMovementsTableHorizontal');
const folioFilter = document.getElementById('filterByFolio');
let paymentsIsActive = false;
let chargesIsActive = false;
let actualNotPaidFilter = false;

hidePaidDocumentsButton.addEventListener('click', () => {
    // remove tr from table
    $('#bankMovementsTableHorizontal tr').remove();
    if(paymentsIsActive){

        if(actualNotPaidFilter){
            renderPaymentsTable(false);
            actualNotPaidFilter = false;
            hidePaidDocumentsButton.innerText = 'Ocultar Pagadas';
            return;
        }
        renderPaymentsTable(true);
        actualNotPaidFilter = true;
        hidePaidDocumentsButton.innerText = 'Mostrar Pagadas';
        return;
    }
    if(chargesIsActive){

        if(actualNotPaidFilter){
            renderChargesTable(false);
            actualNotPaidFilter = false;
            hidePaidDocumentsButton.innerText = 'Ocultar Pagadas';
            return;
        }
        renderChargesTable(true);
        actualNotPaidFilter = true;
        hidePaidDocumentsButton.innerText = 'Mostrar Pagadas';
        return;
    }
});

function resetHidePaidDocumentsButton(){
    hidePaidDocumentsButton.innerText = 'Mostrar Pagadas';
}

tributarieDocumentsTable.addEventListener('click', (e) => {
    const row = e.target.closest('tr');

    if(!row.classList.contains('tributarierRow')){
        return;
    }
    const tds = row.children;
    console.log(e.target);

    const inOut = row.classList.contains('payRow') ? 'payments' : 'charges';

    // if(e.target.classList.contains('expDate')){

    //     Swal.fire({
    //         title: 'Date picker',
    //         html: '<input type="date" id="datePicker">',
    //         showCancelButton: true,
    //         confirmButtonText: 'Submit',
    //         cancelButtonText: 'Cancel',
    //     }).then((result) => {
    //         const date = document.getElementById('datePicker').value;
    //         if(result){
    //             console.log('date',date);
    //             if(date){
    //                 const rowId = row.getAttribute('rowId');
    //                 // console.log('rowId',rowId);
    //                 const dataFromId = {
    //                     folio: rowId.split('_')[0],
    //                     idRut: rowId.split('_')[1],
    //                     idRutDV: rowId.split('_')[2],
    //                     total: rowId.split('_')[3]
    //                 }
    //                 // console.log('dataFromId',dataFromId);
    //                 // console.log('tributarieDocuments',tributarieDocuments);
    //                 const documentData = tributarieDocuments[inOut].find((document) => {
    //                     // console.log('document',document);
    //                     const {folio,rut,total,id} = document;
    //                     const documentRut = rut.split('-')[0];
    //                     const documentRutDV = rut.split('-')[1];
    //                     return id == rowId;
    //                 });
    //                 // console.log('documentData',documentData);
    //                 documentData.fecha_expiracion = moment(date).format('DD-MM-YYYY');
    //                 documentData.fecha_expiracion_timestamp = moment(date).format('X');
    //                 moveDocumentToFuture(documentData);
    //                 renderChargesTable(cardFilterAllChargesDocuments());
    //             }
    //         }
    //     });
    //     return
    // }

    console.log(e.target.closest('td'))
    console.log(e.target)
    if(e.target.closest('td').classList.contains('markAsPaid')){
        const rowId = row.getAttribute('rowId');
        console.log('rowId',rowId);
        // id:`${FOLIO}_${idRut}_${idRutDV}_${TOTAL}`
        const dataFromId = {
            folio: rowId.split('_')[0],
            idRut: rowId.split('_')[1],
            idRutDV: rowId.split('_')[2],
            total: rowId.split('_')[3]
        }
        console.log('dataFromId',dataFromId);

        const documentData = tributarieDocuments[inOut].find((document) => {
            const {folio,rut,total} = document;
            const documentRut = rut.split('-')[0];
            const documentRutDV = rut.split('-')[1];
            return folio == dataFromId.folio && documentRut == dataFromId.idRut && documentRutDV == dataFromId.idRutDV && total == dataFromId.total;
        });
        const documentDVRUT = documentData.rut.split('-')[1];
        console.log('documentDVRUT',documentDVRUT);
        console.log('documentData',documentData);
        documentData.paid = true;
        console.log('documentData',documentData);

        // setFutureDocumentsOnBankMovements();
        discountDocument(documentData);

        // 
        modifiedDocuments.push(documentData);

        // save document as paid on server
        saveModifiedDocuments();

        if(inOut === 'payments'){
            renderPaymentsCards();
            renderPaymentsTable(cardFilterAllPaymentsDocuments());
        }
        if(inOut === 'charges'){
            renderChargesCards()
            renderChargesTable(cardFilterAllChargesDocuments());
        }
    }
})


function moveDocumentToFuture(documentData){
    const {emitida} = documentData;

    // 'charges','payments'
    const egresoIngreso = emitida ? 'charges' : 'payments';

    const testConstante = tributarieDocuments[egresoIngreso].indexOf(documentData);
    const test2 = tributarieDocuments[egresoIngreso];
    console.log('testConstante',testConstante);
    console.log('test2',test2);
    console.log('DOCDATA',documentData);
    console.log('egresoIngreso',egresoIngreso);
    bankMovementsData[egresoIngreso].forEach((day) => {
        // console.log('day',day);
        const documentIndex = day.lvlCodes.findIndex((document) => {
            return document.id == documentData.id;
        });
        
        if(documentIndex > -1){
            console.log('documentIndex',documentIndex);
            // remove from day
            day.lvlCodes.splice(documentIndex,1);
            
        }
        // if(documentIndex > -1){
        //     day.lvlCodes.splice(documentIndex,1);
        //     day.total -= documentData.total;
        // }
    })   
}



async function saveModifiedDocuments(){
    
    const requestModified = await fetch('./controller/finance/commonMovements/writeModifiedDocuments.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'modifiedDocuments' : modifiedDocuments
        })
    });
    
    const response =  await requestModified.json();
}


folioFilter.addEventListener('input', () => {
    const currentValue = folioFilter.value;

    if(currentValue === ''){
        // show all rows
        const rows = document.querySelectorAll('.tributarierRow');
        rows.forEach((row) => {
            row.style.display = 'flex';
        }
        );
        return 
    }
    console.log('currentValue',currentValue);

    // hide all rows that don't match the folio
    const rows = document.querySelectorAll('.tributarierRow');
    rows.forEach((row) => {
        const rowId = row.getAttribute('folio');
        if(!rowId.includes(currentValue)){
            row.style.display = 'none';
        }
    });
    
})
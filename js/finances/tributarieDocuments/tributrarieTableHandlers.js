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

tributarieDocumentsTable.addEventListener('click', async (e) => {
    console.log("ASDasdasd")
    console.log(tributarieDocumentsTable.classList)
    let classToFind ;
    if(paymentsIsActive){
        classToFind = 'paymentsLayout';
    }
    if(chargesIsActive){
        classToFind = 'chargesLayout';
    }
    console.log("!1",tributarieDocumentsTable.classList.contains(classToFind))
    if(!tributarieDocumentsTable.classList.contains(classToFind)){
        return;
    }
    console.log
    const row = e.target.closest('tr');
    console.log("!2",row.classList.contains('tributarierRow'))
    if(!row.classList.contains('tributarierRow')){
        return;
    }
    const tds = row.children;
    

    const inOut = row.classList.contains('payRow') ? 'payments' : 'charges';
    // console.log("e.target.classList",e.target.classList)
    // return 

    if(e.target.classList.contains('expDate')){
        
        modifyDocumentDate(row,inOut,e);

        return
    }

    if(e.target.closest('td').classList.contains('markAsPaid')){
        console.log("3",row)
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


        const documentData = tributarieDocuments[inOut].find(document => document.id == rowId);
        discountDocument(documentData);


        const responseMarkAsPaid = await markAsPaid(rowId);

        if(!responseMarkAsPaid.success){
            Toastify({
                text: "Error al marcar como pagado",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "#f44336",
                stopOnFocus: true
            }).showToast();
            return;
        }

        // const documentData = tributarieDocuments[inOut].find((document) => {
        //     const {folio,rut,total} = document;
        //     const documentRut = rut.split('-')[0];
        //     const documentRutDV = rut.split('-')[1];
        //     return folio == dataFromId.folio && documentRut == dataFromId.idRut && documentRutDV == dataFromId.idRutDV && total == dataFromId.total;
        // });
        // const documentDVRUT = documentData.rut.split('-')[1];
        // console.log('documentDVRUT',documentDVRUT);
        // console.log('documentData',documentData);
        // documentData.paid = true;
        // console.log('documentData',documentData);

        // // setFutureDocumentsOnBankMovements();
        // discountDocument(documentData);

        // // 
        // modifiedDocuments.push(documentData);

        // save document as paid on server
        // saveModifiedDocuments();

        if(inOut === 'payments'){
            renderPaymentsCards();
            renderPaymentsTable(cardFilterAllPaymentsDocuments());
        }
        if(inOut === 'charges'){
            renderChargesCards()
            renderChargesTable(cardFilterAllChargesDocuments());
        }
    }

    // if(e.target.closest('td').classList.contains('markAsUnPaid')){
    //     const rowId = row.getAttribute('rowId');

    //     // id:`${FOLIO}_${idRut}_${idRutDV}_${TOTAL}`

    //     const dataFromId = {
    //         folio: rowId.split('_')[0],
    //         idRut: rowId.split('_')[1],
    //         idRutDV: rowId.split('_')[2],
    //         total: rowId.split('_')[3]
    //     }

    //     console.log('dataFromId',dataFromId);

    //     const documentData = tributarieDocuments[inOut].find((document) => {
    //         const {folio,rut,total} = document;
    //         const documentRut = rut.split('-')[0];
    //         const documentRutDV = rut.split('-')[1];
    //         return folio == dataFromId.folio && documentRut == dataFromId.idRut && documentRutDV == dataFromId.idRutDV && total == dataFromId.total;
    //     });

    //     const documentDVRUT = documentData.rut.split('-')[1];
    //     console.log('documentDVRUT',documentDVRUT);
    //     console.log('documentData',documentData);
    //     documentData.paid = false;
    //     console.log('documentData',documentData);


    //     // 

    //     // setFutureDocumentsOnBankMovements();
    //     discountDocument(documentData);
    //     // 
    //     modifiedDocuments.push(documentData);

    //     // save document as paid on server
    //     saveModifiedDocuments();

    //     if(inOut === 'payments'){
    //         renderPaymentsCards();
    //         renderPaymentsTable(cardFilterAllPaymentsDocuments());
    //     }
    //     if(inOut === 'charges'){
    //         renderChargesCards()
    //         renderChargesTable(cardFilterAllChargesDocuments());
    //     }
    // }
});




function moveDocumentToFuture(documentId,emitida,newDateTimeStamp){
    // const {emitida} = documentData;

    // 'charges','payments'
    const egresoIngreso = emitida ? 'charges' : 'payments';

    const tributarieDocument = tributarieDocuments[egresoIngreso].find((document) => {
        return document.id == documentId;
    });
    console.log('tributarieDocument',tributarieDocument);
    // const tributarieDocumentModified = modifiedDocuments.find((document) => {
    //     return document.id == documentId;
    // });

    if(!tributarieDocument && !tributarieDocumentModified){
        return false;
    }
    const tributarieDocumentCopy = {...tributarieDocument};

    // console.log('tributarieDocument',tributarieDocument.fecha_expiracion);
    // console.log('tributarieDocumentCopy',tributarieDocumentCopy);
    

    // console.log('tributarieDocumentCopy.fecha_expiracion_timestamp',tributarieDocumentCopy.fecha_expiracion_timestamp);
    // console.log("allMydates",allMyDates);

    // get fechaexpiracion time format 

    const dateFormat = getDateFormat(tributarieDocumentCopy.fecha_expiracion);
    const formattedDate = moment(tributarieDocumentCopy.fecha_expiracion,dateFormat).format('YYYY-MM-DD');
    const formattedDateTimestamp = moment(formattedDate).format('X');
    const bankMovementDateIndex = allMyDates.findIndex((date) => {
        // if(date == '2024-11-07'){
        //     console.log('date',date);
        //     console.log('formattedDate',formattedDate);
        //     console.log('formattedDateTimestamp',formattedDateTimestamp);
        //     console.log('moment(date).format(X)',moment(date).format('X'));

        // }
        return moment(date).format('X') == formattedDateTimestamp
    });
    // console.log('newDateTimeStamp',newDateTimeStamp);
    const newDateIndex = allMyDates.findIndex((date) => {
        
        return moment(date).format('X') == newDateTimeStamp
    });
    // console.log('bankMovementDateIndex',bankMovementDateIndex);
    // console.log('newDateIndex',newDateIndex);

    if(bankMovementDateIndex == -1 || newDateIndex == -1){
        return false;
    }
    const bankMovementEgresoIngreso = emitida ? 'projectedIncome' : 'projectedOutcome';
    // remove document from old date
    bankMovementsData[bankMovementEgresoIngreso][bankMovementDateIndex].lvlCodes.splice(
        bankMovementsData[bankMovementEgresoIngreso][bankMovementDateIndex].lvlCodes.indexOf(tributarieDocumentCopy),1
    );

    // const total = bankMovementsData[bankMovementEgresoIngreso][bankMovementDateIndex].total - tributarieDocumentCopy.saldo;
    bankMovementsData[bankMovementEgresoIngreso][bankMovementDateIndex].total -= tributarieDocumentCopy.saldo;
    // console.log('PREVIUS LVLCODES',bankMovementsData[bankMovementEgresoIngreso][bankMovementDateIndex]);
    // console.log('PREVIUS TOTAL',bankMovementsData[bankMovementEgresoIngreso][bankMovementDateIndex].total);
    // console.log('PREVIUS SALDO',tributarieDocumentCopy.saldo);
    // add document to new date
    bankMovementsData[bankMovementEgresoIngreso][newDateIndex].lvlCodes.push(tributarieDocumentCopy);
    bankMovementsData[bankMovementEgresoIngreso][newDateIndex].total += tributarieDocumentCopy.saldo;
    console.log('NEW LVLCODES',bankMovementsData[bankMovementEgresoIngreso][newDateIndex]);

    tributarieDocument.fecha_expiracion = moment(newDateTimeStamp,'X').format('DD-MM-YYYY');
    tributarieDocument.fecha_expiracion_timestamp = newDateTimeStamp;
    // console.log("got it ")
    return true;
}


function getDateFormat(dateString) {
    const formats = ['YYYY-MM-DD', 'DD-MM-YYYY'];
    for (let format of formats) {
        if (moment(dateString, format, true).isValid()) {
            return format;
        }
    }
    return null; // Return null if no valid format is found
}


function modifyDocumentDate(row,inOut,e){
    Swal.fire({
        title: 'Nueva fecha de pago',
        html: '<input type="date" id="modDocumentDate">',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Cambiar fecha',
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            console.log('datePicker',document.getElementById('modDocumentDate'));
            console.log('modDocumentDate',document.getElementById('modDocumentDate'));
            return new Promise((resolve) => {
                resolve({
                    date: document.getElementById('modDocumentDate').value
                });
            });
        }
    }).then(async (result) => {
        if(result){
            const {value} = result;
            if(value.date){
                const {date} = value;
                const rowId = row.getAttribute('rowId');
                const modDoc = modifiedDocuments.find((document) => {
                    return document.id == rowId;
                });
                
                const responseChangeExpirationDate = await changeExpirationDate(rowId,date);
                if(!responseChangeExpirationDate.success){
                    Toastify({
                        text: "Error al cambiar la fecha de expiración",
                        duration: 3000,
                        gravity: "top",
                        position: "right",
                        backgroundColor: "#f44336",
                        stopOnFocus: true
                    }).showToast();
                    return;
                }

                let emitida;
                if(!modDoc){
                    const documentData = tributarieDocuments[inOut].find((document) => {
                        const {id} = document;
                        return id == rowId;
                    });
                    const documentDataCopy = {...documentData};
                    emitida = documentDataCopy.emitida;
                    documentDataCopy.fecha_expiracion = moment(date).format('DD-MM-YYYY');
                    documentDataCopy.fecha_expiracion_timestamp = moment(date).format('X');
                    modifiedDocuments.push(documentDataCopy);
                }else{
                    emitida = modDoc.emitida;
                    modDoc.fecha_expiracion = moment(date).format('DD-MM-YYYY');
                    modDoc.fecha_expiracion_timestamp = moment(date).format('X');
                }


                const newDateTimeStamp = moment(date).format('X');
                console.log("send date TIMESTAMP",newDateTimeStamp);
                console.log("send date",date);

                const modifyDocument = moveDocumentToFuture(rowId,emitida,newDateTimeStamp);
                if(!modifyDocument){
                    Toastify({
                        text: "Error al mover el documento a la fecha seleccionada",
                        duration: 3000,
                        gravity: "top",
                        position: "right",
                        backgroundColor: "#f44336",
                        stopOnFocus: true
                    }).showToast();
                    return;
                }
                e.target.innerText = moment(date).format('DD-MM-YYYY');
                saveModifiedDocuments();

                // const documentData = tributarieDocuments[inOut].find((document) => {
                //     // console.log('document',document);
                //     const {folio,rut,total,id} = document;
                //     const documentRut = rut.split('-')[0];
                //     const documentRutDV = rut.split('-')[1];
                //     return id == rowId;
                // });
                // // console.log('documentData',documentData);
                // documentData.fecha_expiracion = moment(date).format('DD-MM-YYYY');
                // documentData.fecha_expiracion_timestamp = moment(date).format('X');
                // moveDocumentToFuture(documentData);
                // renderChargesTable(cardFilterAllChargesDocuments());
            }
        }
    });
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
        // loop td and find any value to match input value
        const tds = row.children;
        let found = false;
        tds.forEach((td) => {
            if(td.textContent.toLowerCase().includes(currentValue.toLowerCase())){
            found = true;
            }
        });

        if(!found){
            row.style.display = 'none';
        }

        



        // const rowId = row.getAttribute('folio');
        // if(!rowId.includes(currentValue)){
        //     row.style.display = 'none';
        // }
    });
    
})
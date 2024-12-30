const hidePaidDocumentsButton = document.getElementById('hidePaidDocuments');
const tributarieDocumentsTable = document.querySelector('#bankMovementsTableHorizontal');
const filterButton = document.getElementById('filterButton');
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
    console.log(tributarieDocumentsTable.classList)
    let classToFind ;
    if(activePage.payments){
        classToFind = 'paymentsLayout';
    }
    if(activePage.charges){
        classToFind = 'chargesLayout';
    }
    console.log("!1",tributarieDocumentsTable.classList.contains(classToFind))
    console.log("classToFind",classToFind)
    if(!tributarieDocumentsTable.classList.contains(classToFind)){
        return;
    }
    const row = e.target.closest('tr');
    console.log("!2!",row.classList.contains('tributarierRow'))
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

    if(e.target.closest('td').classList.contains('pendingBalance')){
        changeBalance(row,inOut,e);
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

        // get document data from tributarieDocuments

        const documentData = tributarieDocuments[inOut].find(document => document.id == rowId);
        const tributarieDocumentCopy = {...documentData};
        tributarieDocumentCopy.paid = true;
        
        console.log('documentData',documentData);
         
        // discountDocument(documentData);

        const updateTributarieDocumentResponse = await updateTributarieDocument(tributarieDocumentCopy);

        const isAlreadyModified = modifiedDocuments.find((document) => {
            return document.folio == documentData.folio && document.rut == documentData.rut && document.total == documentData.total;
        });

        if(!isAlreadyModified){
            const transformedDocument = {
                id: tributarieDocumentCopy.id,
                issue_date: moment(tributarieDocumentCopy.fecha_emision, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                expiration_date: moment(tributarieDocumentCopy.fecha_expiracion, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                folio: tributarieDocumentCopy.folio,
                total: tributarieDocumentCopy.total,
                balance: tributarieDocumentCopy.saldo,
                paid: tributarieDocumentCopy.pagado,
                type: tributarieDocumentCopy.tipo_documento,
                item: tributarieDocumentCopy.item,
                rut: tributarieDocumentCopy.rut,
                issued: tributarieDocumentCopy.emitida ? '1' : '0',
                sii_code: '1', // Assuming this is a static value
                business_name: tributarieDocumentCopy.proveedor,
                tax: tributarieDocumentCopy.impuesto,
                exempt_amount: tributarieDocumentCopy.exento,
                taxable_amount: tributarieDocumentCopy.afecto,
                net_amount: tributarieDocumentCopy.neto,
                business_id: 1, // Assuming this is a static value
                cancelled: tributarieDocumentCopy.cancelled ? 1 : 0,
                is_paid: 1
            };
            modifiedDocuments.push(transformedDocument);
        }else{
            console.log('modifiedDocuments',modifiedDocuments);
            isAlreadyModified.is_paid = 1;
        }

        console.log('initialTributarieDocuments',initialTributarieDocuments);   
        const initialDocument = initialTributarieDocuments.documents.find((document) => {
            return document.rut == documentData.rut && document.folio == documentData.folio && document.total == documentData.total;
        });
        console.log('initialDocument',initialDocument);
        initialDocument.is_paid = 1;

        tributarieDataDbMap(initialTributarieDocuments.documents);
        removeFromFuture(documentData);

        if(!updateTributarieDocumentResponse.success){
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
        
        // documentData.paid = true;
        // modifiedDocuments.push(documentData);

        Toastify({
            text: "Documento marcado como pagado",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#28a745",
            stopOnFocus: true
        }).showToast();


        if(inOut === 'payments'){
            renderPaymentsCards();
            renderPaymentsTable(cardFilterAllPaymentsDocuments());
        }
        if(inOut === 'charges'){
            renderChargesCards()
            renderChargesTable(cardFilterAllChargesDocuments());
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

function moveDocumentToFuture(documentData,emitida,newDateTimeStamp){
    // const {emitida} = documentData;

    // 'charges','payments'
    // const egresoIngreso = emitida ? 'charges' : 'payments';

    // if(!tributarieDocument ){
    //     return false;
    // }
    console.log("PASO 0",documentData)
    const tributarieDocumentCopy = {...documentData};

    // get fechaexpiracion time format 
    const dateFormat = getDateFormat(tributarieDocumentCopy.fecha_expiracion);
    console.log("FORMATO DE LA FECHA Y LA FECHA ",dateFormat,tributarieDocumentCopy.fecha_expiracion)
    const formattedDate = moment(tributarieDocumentCopy.fecha_expiracion,dateFormat).format('YYYY-MM-DD');
    console.log("PASO 0.0",formattedDate)
    const formattedDateTimestamp = moment(formattedDate).format('X');
    console.log("PASO 0.1",formattedDateTimestamp)
    console.log("PASO 0.2",formattedDate)
    console.log("PASO 0.3",tributarieDocumentCopy)


    const bankMovementDateIndex = allMyDates.findIndex((date) => {
        if(date == '2024-12-20' || date == '20-12-2024'){
            console.log("PASO INTERMEDIO",date)
            console.log("PASO INTERMEDIO",moment(date).format('X'))
            console.log("PASO INTERMEDIO",formattedDateTimestamp)
        }
        return moment(date).format('X') == formattedDateTimestamp
    });
    console.log("PASO 1 ",bankMovementDateIndex)
    console.log("PASO 1 ",allMyDates)
    // console.log('newDateTimeStamp',newDateTimeStamp);
    const newDateIndex = allMyDates.findIndex((date) => {
        return moment(date).format('X') == newDateTimeStamp
    });
    console.log("PASO 2 ",newDateIndex)

    if(bankMovementDateIndex == -1 || newDateIndex == -1){
        return false;
    }

    console.log("PASO 3 ",newDateIndex, bankMovementDateIndex);

    const bankMovementEgresoIngreso = emitida ? 'projectedIncome' : 'projectedOutcome';

    // remove document from old date

    for(let i = bankMovementDateIndex; i < allMyDates.length; i++){
        const indexOfDocument = bankMovementsData[bankMovementEgresoIngreso][i].lvlCodes.findIndex((document) => {
            return document.folio == tributarieDocumentCopy.folio && document.rut == tributarieDocumentCopy.rut && document.total == tributarieDocumentCopy.total;
        });
        if(indexOfDocument == -1){
            continue;
        }


        bankMovementsData[bankMovementEgresoIngreso][i].lvlCodes.splice(indexOfDocument,1);
        console.log("PASO 4 ",bankMovementsData[bankMovementEgresoIngreso][i])
    
    

        bankMovementsData[bankMovementEgresoIngreso][i].total -= tributarieDocumentCopy.total;

        bankMovementsData[bankMovementEgresoIngreso][newDateIndex].lvlCodes.push(tributarieDocumentCopy);

        bankMovementsData[bankMovementEgresoIngreso][newDateIndex].total += tributarieDocumentCopy.saldo;

        return true;
       
    }

    // const indexOfDocument = bankMovementsData[bankMovementEgresoIngreso][bankMovementDateIndex].lvlCodes.findIndex((document) => {
    //     return document.folio == tributarieDocumentCopy.folio && document.rut == tributarieDocumentCopy.rut && document.total == tributarieDocumentCopy.total;
    // });

}
function updateDocumentBalance(documentData,emitida,balance){
    const tributarieDocumentCopy = {...documentData};

    // get fechaexpiracion time format 
    const dateFormat = getDateFormat(tributarieDocumentCopy.fecha_expiracion);
    console.log("documento a modificar",tributarieDocumentCopy)
    console.log("FORMATO DE LA FECHA Y LA FECHA ",dateFormat,tributarieDocumentCopy.fecha_expiracion)

    const formattedDate = moment(tributarieDocumentCopy.fecha_expiracion,dateFormat).format('YYYY-MM-DD');

    console.log("PASO 0.0",formattedDate)

    const formattedDateTimestamp = moment(formattedDate).format('X');

    console.log("PASO 0.1",formattedDateTimestamp)
    console.log("PASO 0.2",formattedDate)
    console.log("PASO 0.3",tributarieDocumentCopy)

    const bankMovementDateIndex = allMyDates.findIndex((date) => {
        return moment(date).format('X') == formattedDateTimestamp
    });
    console.log("PASO 1 ",bankMovementDateIndex)

    if(bankMovementDateIndex == -1){
        return false;
    }

    console.log("PASO 3 ", bankMovementDateIndex);

    const bankMovementEgresoIngreso = emitida ? 'projectedIncome' : 'projectedOutcome';

    console.log("PASO 3 ",bankMovementsData)
    console.log("PASO 3 ",bankMovementsData)
    // remove document from old date

    for(let i = bankMovementDateIndex; i < allMyDates.length; i++){
        const indexOfDocument = bankMovementsData[bankMovementEgresoIngreso][i].lvlCodes.findIndex((document) => {
            return document.folio == tributarieDocumentCopy.folio && document.rut == tributarieDocumentCopy.rut && document.total == tributarieDocumentCopy.total;
        });
        if(indexOfDocument == -1){
            continue;
        }

        const previusBalance = bankMovementsData[bankMovementEgresoIngreso][i].lvlCodes[indexOfDocument].saldo;
        const newBalance = Number(previusBalance) - Number(balance);
        const total = Number(bankMovementsData[bankMovementEgresoIngreso][i].total) - Number(newBalance);
        bankMovementsData[bankMovementEgresoIngreso][i].lvlCodes[indexOfDocument].saldo = Number(balance);
        bankMovementsData[bankMovementEgresoIngreso][i].total = total;
        return true;
    }

    // const indexOfDocument = bankMovementsData[bankMovementEgresoIngreso][bankMovementDateIndex].lvlCodes.findIndex((document) => {
    //     return document.folio == tributarieDocumentCopy.folio && document.rut == tributarieDocumentCopy.rut && document.total == tributarieDocumentCopy.total;
    // });
    // console.log("PASO 4 ",indexOfDocument)
    // console.log("PASO 4 ",bankMovementsData[bankMovementEgresoIngreso][bankMovementDateIndex].lvlCodes[indexOfDocument])
    // const previusBalance = bankMovementsData[bankMovementEgresoIngreso][bankMovementDateIndex].lvlCodes[indexOfDocument].saldo;
    // const newBalance = Number(previusBalance) - Number(balance);

    // const total = Number(bankMovementsData[bankMovementEgresoIngreso][bankMovementDateIndex].total) - Number(newBalance);
    // bankMovementsData[bankMovementEgresoIngreso][bankMovementDateIndex].lvlCodes[indexOfDocument].saldo = Number(balance);
    // bankMovementsData[bankMovementEgresoIngreso][bankMovementDateIndex].total = total;

    // return true;
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
                console.log('date',date);
                const rowId = row.getAttribute('rowId');

                // const modCopy = {...modDoc};
                // modCopy.fecha_expiracion = moment(date).format('DD-MM-YYYY');

                const documentData = tributarieDocuments[inOut].find(document => document.id == rowId);
                const tributarieDocumentCopy = {...documentData};
                tributarieDocumentCopy.fecha_expiracion = moment(date).format('DD-MM-YYYY');

                console.log('tributarieDocumentCopy',tributarieDocumentCopy);
                // return 
                
                // const responseChangeExpirationDate = await changeExpirationDate(rowId,date);

                const updateTributarieDocumentResponse = await updateTributarieDocument(tributarieDocumentCopy);

                const isAlreadyModified = modifiedDocuments.find((document) => {
                    return document.folio == documentData.folio && document.rut == documentData.rut && document.total == documentData.total;
                });

                if(!isAlreadyModified){
                    const { fecha_emision} = tributarieDocumentCopy;
                    const transformedDocument = {
                        id: tributarieDocumentCopy.id,
                        issue_date: moment(fecha_emision, getDateFormat(fecha_emision)).format('YYYY-MM-DD'),
                        expiration_date: moment(date, getDateFormat(date)).format('YYYY-MM-DD'),
                        folio: tributarieDocumentCopy.folio,
                        total: tributarieDocumentCopy.total,
                        balance: tributarieDocumentCopy.saldo,
                        paid: tributarieDocumentCopy.pagado,
                        type: tributarieDocumentCopy.tipo_documento,
                        item: tributarieDocumentCopy.item,
                        rut: tributarieDocumentCopy.rut,
                        issued: tributarieDocumentCopy.emitida ? '1' : '0',
                        sii_code: '1', // Assuming this is a static value
                        business_name: tributarieDocumentCopy.proveedor,
                        tax: tributarieDocumentCopy.impuesto,
                        exempt_amount: tributarieDocumentCopy.exento,
                        taxable_amount: tributarieDocumentCopy.afecto,
                        net_amount: tributarieDocumentCopy.neto,
                        cancelled: tributarieDocumentCopy.cancelled ? 1 : 0,
                        is_paid: tributarieDocumentCopy.paid
                    };
                    modifiedDocuments.push(transformedDocument);
                }else{
                    console.log('modifiedDocuments',modifiedDocuments);
                    isAlreadyModified.expiration_date = moment(date,getDateFormat(date)).format('DD-MM-YYYY');
                }

                console.log("PREVIO 0, MODIFIED DOCUMENT NEW DATA", modifiedDocuments.find(doc => doc.folio == '23616515'))
                // return


                console.log('initialTributarieDocuments',initialTributarieDocuments);   
                const initialDocument = initialTributarieDocuments.documents.find((document) => {
                    return document.rut == documentData.rut && document.folio == documentData.folio && document.total == documentData.total;
                });
                console.log('initialDocument',initialDocument);
                initialDocument.expiration_date = moment(date,getDateFormat(date)).format('DD-MM-YYYY');
        
                tributarieDataDbMap(initialTributarieDocuments.documents);
                // removeFromFuture(documentData);

                console.log("previo 1",updateTributarieDocumentResponse)
        
                if(!updateTributarieDocumentResponse.success){
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

                const newDateTimeStamp = moment(date).format('X');
                console.log("send date",date);
                console.log("send date TIMESTAMP",newDateTimeStamp);

                const modifyDocument = moveDocumentToFuture(documentData,tributarieDocumentCopy.emitida,newDateTimeStamp);
                console.log("POST 1",modifyDocument)
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
                // saveModifiedDocuments();

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


function changeBalance(row,inOut,e){

    Swal.fire({
        title: 'Ingresa el saldo pendiente de este documento',
        html: '<input type="number" id="balance">',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Modificar saldo pendiente',
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            console.log('balanceChanger',document.getElementById('balance'));
            console.log('balance',document.getElementById('balance'));
            return new Promise((resolve) => {
                resolve({
                    balance: document.getElementById('balance').value
                });
            });
        }
    }).then(async (result) => {
        console.log(result)
        if(result){
            const {value} = result;
            if(value.balance){

                
                const {balance} = value;
                // check if balance is a valid number
                if(isNaN(balance)){
                    Toastify({
                        text: "El saldo debe ser un número",
                        duration: 3000,
                        gravity: "top",
                        position: "right",
                        backgroundColor: "#f44336",
                        stopOnFocus: true
                    }).showToast();
                    changeBalance(row,inOut,e)
                    return;
                }
                const {date} = value;
                console.log('balance',balance);
                const rowId = row.getAttribute('rowId');

                const documentData = tributarieDocuments[inOut].find(document => document.id == rowId);
                const tributarieDocumentCopy = {...documentData};

                if(balance > tributarieDocumentCopy.total){
                    Toastify({
                        text: "El saldo no puede ser mayor al total del documento",
                        duration: 3000,
                        gravity: "top",
                        position: "right",
                        backgroundColor: "#f44336",
                        stopOnFocus: true
                    }).showToast();
                    changeBalance(row,inOut,e)
                    return;
                }

                if(balance == 0){
                    Toastify({
                        text: "El saldo no puede ser 0",
                        duration: 3000,
                        gravity: "top",
                        position: "right",
                        backgroundColor: "#f44336",
                        stopOnFocus: true
                    }).showToast();
                    changeBalance(row,inOut,e)
                    return;
                }
                // console.log('tributarieDocumentCopy',tributarieDocumentCopy);
                // return 
                tributarieDocumentCopy.saldo = balance;

                console.log('tributarieDocumentCopy',tributarieDocumentCopy);
                // return 
                
                // const responseChangeExpirationDate = await changeExpirationDate(rowId,date);

                const updateTributarieDocumentResponse = await updateTributarieDocument(tributarieDocumentCopy);

                const isAlreadyModified = modifiedDocuments.find((document) => {
                    return document.folio == documentData.folio && document.rut == documentData.rut && document.total == documentData.total;
                });

                if(!isAlreadyModified){
                    const { id,fecha_emision,fecha_expiracion,folio,total,saldo,pagado,tipo_documento,item,rut,emitida,proveedor,impuesto,exento,afecto,neto,cancelled,paid} = tributarieDocumentCopy;
                   
                    const transformedDocument = {
                        id: id,
                        issue_date: moment(fecha_emision, getDateFormat(fecha_emision)).format('YYYY-MM-DD'),
                        expiration_date: moment(fecha_expiracion, getDateFormat(fecha_expiracion)).format('YYYY-MM-DD'),
                        folio: folio,
                        total: total,
                        balance: Number(balance),
                        paid: pagado,
                        type: tipo_documento,
                        item: item,
                        rut: rut,
                        issued: emitida ? '1' : '0',
                        sii_code: '1', // Assuming this is a static value
                        business_name: proveedor,
                        tax: impuesto,
                        exempt_amount: exento,
                        taxable_amount: afecto,
                        net_amount: neto,
                        cancelled: cancelled ? 1 : 0,
                        is_paid: paid
                    };

                    modifiedDocuments.push(transformedDocument);

                }else{
                    console.log('modifiedDocuments',modifiedDocuments);
                    isAlreadyModified.balance = Number(balance);
                }

                console.log("PREVIO 0, MODIFIED DOCUMENT NEW DATA", modifiedDocuments.find(doc => doc.folio == '23616515'))
                // return


                console.log('initialTributarieDocuments',initialTributarieDocuments);   
                const initialDocument = initialTributarieDocuments.documents.find((document) => {
                    return document.rut == documentData.rut && document.folio == documentData.folio && document.total == documentData.total;
                });

                console.log('initialDocument',initialDocument);
                initialDocument.balance = Number(balance);
        
                tributarieDataDbMap(initialTributarieDocuments.documents);
                // removeFromFuture(documentData);

                console.log("previo 1",updateTributarieDocumentResponse)
        
                if(!updateTributarieDocumentResponse.success){
                    Toastify({
                        text: "Error al cambiar saldo del documento",
                        duration: 3000,
                        gravity: "top",
                        position: "right",
                        backgroundColor: "#f44336",
                        stopOnFocus: true
                    }).showToast();
                    return;
                }

                const newDateTimeStamp = moment(date).format('X');
                console.log("send date",date);
                console.log("send date TIMESTAMP",newDateTimeStamp);

                // const modifyDocument = moveDocumentToFuture(documentData,tributarieDocumentCopy.emitida,newDateTimeStamp);
                const modifyDocumentBalance = updateDocumentBalance(documentData,tributarieDocumentCopy.emitida,balance);
                console.log("POST 1",modifyDocumentBalance)
                if(!modifyDocumentBalance){
                    Toastify({
                        text: "No se ha podido cambiar el saldo del documento",
                        duration: 3000,
                        gravity: "top",
                        position: "right",
                        backgroundColor: "#f44336",
                        stopOnFocus: true
                    }).showToast();
                    return;
                }

                
                renderPaymentsCards();
                renderPaymentsTable(cardFilterAllPaymentsDocuments_ascDate());

                Toastify({
                    text: "Saldo modificado exitosamente",
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    backgroundColor: "#28a745",
                    stopOnFocus: true
                }).showToast();

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


// capture filter button click and open a menu with two options
// 1. Filter by fecha ascendent
// 2. Filter by fecha descendent
let ascendentFilter = false;
filterButton.addEventListener('click', () => {

    if(!ascendentFilter){
        // filter by fecha ascendent
        console.log('filterByFechaAscendent');
        if(activePage.payments){
            // render payments table
            renderPaymentsCards();
            renderPaymentsTable(cardFilterAllPaymentsDocuments_ascDate());
        }

        if(activePage.charges){
            // render charges table
            renderChargesCards();
            renderChargesTable(cardFilterAllChargesDocuments_ascDate());
        }
    }

    if(ascendentFilter){
        // filter by fecha descendent
        console.log('filterByFechaDescendent');
        if(activePage.payments){
            // render payments table
            renderPaymentsCards();
            renderPaymentsTable(cardFilterAllPaymentsDocuments_descDate());
        }

        if(activePage.charges){
            // render charges table
            renderChargesCards();
            renderChargesTable(cardFilterAllChargesDocuments_descDate());
        }
        
    }

    ascendentFilter = !ascendentFilter;
    return 

    // if filterMenu already exists remove it
    const filterMenuE = document.querySelector('.filterMenu');
    if(filterMenuE){
        filterMenuE.remove();
        return;
    }
    // crete a div and append two buttons
    const filterMenu = document.createElement('div');
    filterMenu.classList.add('filterMenu');
    const filterByFechaAscendent = document.createElement('button');
    filterByFechaAscendent.innerText = 'Ordenar por fecha ascendente';
    filterByFechaAscendent.classList.add('filterByFechaAscendent');
    filterMenu.appendChild(filterByFechaAscendent);
    const filterByFechaDescendent = document.createElement('button');
    filterByFechaDescendent.innerText = 'Ordenar por fecha descendente';
    filterByFechaDescendent.classList.add('filterByFechaDescendent');
    filterMenu.appendChild(filterByFechaDescendent);
    document.body.appendChild(filterMenu);

    filterMenu.style.position = 'absolute';
    filterMenu.style.top = `${filterButton.getBoundingClientRect().bottom}px`;
    filterMenu.style.left = `${filterButton.getBoundingClientRect().left}px`;
    filterMenu.style.zIndex = '1000';
    filterMenu.style.backgroundColor = 'white';
    filterMenu.style.border = '1px solid black';
    filterMenu.style.borderRadius = '5px';
    filterMenu.style.padding = '10px';
    filterMenu.style.display = 'flex';
    filterMenu.style.flexDirection = 'column';
    filterMenu.style.alignItems = 'center';
    filterMenu.style.justifyContent = 'center';



    if(filterMenu){




    }
});


// capture filterByFechaDescendent and filterByFechaAscendent click

document.body.addEventListener('click', (e) => {
    const filterMenu = document.querySelector('.filterMenu');
    
});





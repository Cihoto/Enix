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


document.getElementById('bankMovementsTableHorizontal').addEventListener('click', async (e) => {
    const isPaidTable = e.target.closest('table').classList.contains('paidDocumentsLayout');

    if(!isPaidTable){
        return;
    }

    const target = e.target;

    if(!target.closest('td').classList.contains('markAsPaid')){
        return;
    }

    console.log('UNDO');

    const row = target.closest('tr');
    const rowId = row.getAttribute('rowId');
    const inOut = row.getAttribute('inOut');
    const documentData = getDocumentData(rowId,inOut);

    if(!documentData){
        Toastify({
            text: "Documento no encontrado",
            duration: 3000,
            backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
        }).showToast();
    }
    
    const documentCopy = {...documentData};
    documentCopy.paid = false;

    
    const response = await  updateTributarieDocument(documentCopy);

    if(!response.success){
        Toastify({
            text: "Error al marcar documento como pagado",
            duration: 3000,
            backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
        }).showToast();
        return 
    }

    Toastify({
        text: "Documento marcado como pagado",
        duration: 3000,
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
    }).showToast();

    const isAlreadyModified = modifiedDocuments.find((document) => {
        return document.folio == documentData.folio && document.rut == documentData.rut && document.total == documentData.total;
    });

    if(!isAlreadyModified){
        const transformedDocument = {
            id: documentCopy.id,
            issue_date: moment(documentCopy.fecha_emision, 'DD-MM-YYYY').format('YYYY-MM-DD'),
            expiration_date: moment(documentCopy.fecha_expiracion, 'DD-MM-YYYY').format('YYYY-MM-DD'),
            folio: documentCopy.folio,
            total: documentCopy.total,
            balance: documentCopy.saldo,
            paid: documentCopy.pagado,
            type: documentCopy.tipo_documento,
            item: documentCopy.item,
            rut: documentCopy.rut,
            issued: documentCopy.emitida ? '1' : '0',
            sii_code: '1', // Assuming this is a static value
            business_name: documentCopy.proveedor,
            tax: documentCopy.impuesto,
            exempt_amount: documentCopy.exento,
            taxable_amount: documentCopy.afecto,
            net_amount: documentCopy.neto,
            business_id: 1, // Assuming this is a static value
            cancelled: documentCopy.cancelled ? 1 : 0,
            is_paid: 0
        };
        modifiedDocuments.push(transformedDocument);
    }else{
        console.log('modifiedDocuments',modifiedDocuments);
        isAlreadyModified.is_paid = 0;
    }

    console.log('initialTributarieDocuments',initialTributarieDocuments);   
    const initialDocument = initialTributarieDocuments.documents.find((document) => {
        return document.rut == documentData.rut && document.folio == documentData.folio && document.total == documentData.total;
    });
    console.log('initialDocument',initialDocument);
    initialDocument.is_paid = 0;

    tributarieDataDbMap(initialTributarieDocuments.documents);
    addFromFuture(documentData);

    // documentData.paid = false;

    renderPaidDocuments(getPaidDocuments(),false);
});


function getDocumentData(documentId,inOut){
    console.log('tributarieDocuments',tributarieDocuments);
    console.log('documentId',documentId);
    console.log('inOut',inOut);

    const document = tributarieDocuments[inOut].find((document) => {
        return document.id == documentId;
    });

    if(!document){
        return false;
    }

    console.log('document',document);
    return document;
}


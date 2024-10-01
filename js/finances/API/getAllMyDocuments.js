// async function getAllMyDocuments() {
//     try {
//         // const responseMatchesBankMovements = await fetch('allDocuments.json');
//         let responseMatchesBankMovements = await fetch('allDoucments.json')
//             .then((response) => response.json())
//             .then((data) => {
//                 return data
//             })
//         const dataMatchesBankMovements = responseMatchesBankMovements;
//         console.log('dataMatchesBankMovements', dataMatchesBankMovements);
//         console.log('dataMatchesBankMovements.items', dataMatchesBankMovements.data.items);
//         getUniqueDocumentsType(dataMatchesBankMovements.data.items)
//         return dataMatchesBankMovements;
//     } catch (e) {
//         console.log(e);
//     }
// }

let tributarieDocuments_ = { 
    charges : [],
    payments : [],
    notaCredito : []
}
let tributarieCardsData_ = {
    charges:{
        totalDocuments : {
            amount: 0,
            total: 0
        },
        bhe:{
            amount: 0,
            total: 0
        },
        bills:{
            amount: 0,
            total: 0
        },
        pendingDocuments:{
            amount: 0,
            total: 0
        }
    },
    payments:{
        totalDocuments : {
            amount: 0,
            total: 0
        },
        bhe:{
            amount: 0,
            total: 0
        },
        bills:{
            amount: 0,
            total: 0
        },
        pendingDocuments:{
            amount: 0,
            total: 0
        }
    }
}

async function getAllMyDocuments(){

    try{
        const responseMatchesBankMovements = await fetch('ws/Clay/getAllMyDocuments.php',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "initDate": firstDayOfMonth,
                "bussId": busData.busId,
                'bankAcocuntId': busData.bankAcocuntId,
            })
        });

        if(!responseMatchesBankMovements.ok){
            throw new Error('Network response was not ok');
        }

        const dataMatchesBankMovements = await responseMatchesBankMovements.json();
        console.log('dataMatchesBankMovements',dataMatchesBankMovements);
        console.log('dataMatchesBankMovements.items',dataMatchesBankMovements.data.items);
        getUniqueDocumentsType(dataMatchesBankMovements.data.items)
        return dataMatchesBankMovements;
    }catch(e){
        console.log(e);
    }
}




function getUniqueDocumentsType(documents) {
    const uniqueDocumentsType = [];
    // const notPaidDocuments = documents.filter(({ pagado }) => !pagado || pagado );
    
    const notPaidDocuments = documents;
    console.log('notPaidDocuments', notPaidDocuments);

    const fitleredCredito = documents.filter(({ tipo }) => tipo.toLowerCase() === 'nota de crédito');
    console.log('fitleredCredito', fitleredCredito);

    let anuladas = [];
    fitleredCredito.forEach((credito) => {
        const {emisor,receptor} = credito;
        const rutEmisorCredito = credito.recibida === true ? `${parseInt(emisor.rut)}${parseInt(emisor.dv)}` : `${parseInt(receptor.rut)}${parseInt(receptor.dv)}`;
        const ami_recepCredito = credito.recibida === true ? `emisor` : `receptor`;
        const totalCredito = credito.total.total;
        // BUSCAR FACTURA QUE CONCUERDE CON LA NOTA DE CREDITO
        const facturaAnulada = documents.filter((document) => {
            // const {emisor,receptor} = document;
            const rutEmisor = document.recibida === true ? `${parseInt(document.emisor.rut)}${parseInt(document.emisor.dv)}` : `${parseInt(document.receptor.rut)}${parseInt(document.receptor.dv)}`;
            const emi_recep = document.recibida === true ? `emisor` : `receptor`;
            const totalDocumento = document.total.total;
            return totalCredito === totalDocumento && rutEmisorCredito === rutEmisor;
        });
        // console.log('facturaAnulada', facturaAnulada);

        if(facturaAnulada.length > 0){

            const DTE = facturaAnulada.find((factura) => {
                const {tipo} = factura;
                const tipoDocumento = tipo.toLowerCase().split(' ');

                if(tipoDocumento.includes('factura')){
                    return factura;
                }
                // console.log('tipoDocumento',tipoDocumento);
            });

            if(!DTE){
                return
            }

            console.log('DTE', DTE);
            notPaidDocuments.splice(
                notPaidDocuments.findIndex((document) => document === DTE),
                1
            )
            
            return
            anuladas.push(DTE);
        }
    });
    let sumaTodo = 0;
    let sumaTODOARR = [];
    notPaidDocuments.forEach((document) => {
        const {emisor,receptor,numero} = document;
        // GET ALL MY DOCUMENTS TYPE
        if (!uniqueDocumentsType.includes(document.tipo)) {
            uniqueDocumentsType.push(document.tipo);
        }

        const {tipo} = document;
        const documentType = tipo.toLowerCase().split(' ');

        // get difference in day between today and document emission date
        const emissionDate = moment(document.fecha_emision, 'X');
        const today = moment();
        const differenceInDays = today.diff(emissionDate, 'days');
        const isOutDated = differenceInDays > 30;

        if(!document.recibida){

            const exists = tributarieDocuments.charges.find((charge) => { 
                return charge.numero === numero && receptor.rut === charge.receptor.rut;
            });
            if(exists){
                return
            }

            tributarieDocuments.charges.push(document);

            // LOAD CARD DATA
            tributarieCardsData.charges.totalDocuments.amount += 1;
            tributarieCardsData.charges.totalDocuments.total += parseInt(document.total.total);
            sumaTodo += parseInt(document.total.total);

            if(isOutDated){
                console.log('isOutDated',isOutDated);
                console.log('isOutDated',document.fecha_emision);
                console.log('isOutDated',document.fecha_humana_emision);
                console.log('total',document.total.total)
                tributarieCardsData.charges.pendingDocuments.amount += 1;
                tributarieCardsData.charges.pendingDocuments.total += parseInt(document.total.total);
                return;
            }

            if(documentType.includes('bhe')){
                tributarieCardsData.charges.bhe.amount += 1;
                tributarieCardsData.charges.bhe.total += parseInt(document.total.total);
                return
            }
            if(documentType.includes('factura')){
                tributarieCardsData.charges.bills.amount += 1;
                tributarieCardsData.charges.bills.total += parseInt(document.total.total);
                return
            }
            sumaTODOARR.push(document);

        }else{

            const exists = tributarieDocuments.payments.find((payment) => { 
                return payment.numero === numero && emisor.rut === payment.emisor.rut;
            });
            if(exists){
                return
            }
            tributarieDocuments.payments.push(document);

            // LOAD CARD DATA
            tributarieCardsData.payments.totalDocuments.amount += 1;
            tributarieCardsData.payments.totalDocuments.total += parseInt(document.total.total);
            console.log("ADDING")

            if(isOutDated){
                // console.log('isOutDated',isOutDated);
                // console.log('isOutDated',document.fecha_emision);
                // console.log('isOutDated',document.fecha_humana_emision);

                tributarieCardsData.payments.pendingDocuments.amount += 1;
                tributarieCardsData.payments.pendingDocuments.total += parseInt(document.total.total);
                return;
            }
            if(documentType.includes('bhe')){
                tributarieCardsData.payments.bhe.amount += 1;
                tributarieCardsData.payments.bhe.total += parseInt(document.total.total);

            }
            if(documentType.includes('factura')){
                tributarieCardsData.payments.bills.amount += 1;
                tributarieCardsData.payments.bills.total += parseInt(document.total.total);
            }
        }
    });
    console.log('sumaTodo', sumaTodo);
    console.log('sumaTODOARR', sumaTODOARR);
    console.log('anuladas', anuladas);
    console.log('uniqueDocumentsType', uniqueDocumentsType);
    console.log('tributarieDocuments', tributarieDocuments);
    console.log('tributarieCardsData', tributarieCardsData);
}
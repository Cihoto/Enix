const DOCUMENT_TYPES = [
{
    name: 'Factura Electrónica de Venta',
    type: 'factura',
    contable:true
},
{
    name: 'Factura de Venta',
    type: 'factura',
    contable:true
},
{
    name: 'Factura Electrónica Exenta',
    type: 'factura',
    contable:true
},
{
    name: 'Factura Exenta',
    type: 'factura',
    contable:true
},
{
    name: "Retención Boleta Honorarios",
    type: "R_bhe",
    contable:false
},
{
    name: "Boleta de Honorarios",
    type: "bhe",
    contable:true
},
{
    name: "Boleta de Venta Electrónica",
    type: "bev",
    contable:true
},
{
    name: "Guía de Despacho Electrónica",
    type: "despacho",
    contable: false
},
{
    name: "Guía de Despacho",
    type: "despacho",
    contable: false
},
{
    name: "Nota de Crédito Electrónica",
    type: "nota",
    contable:true
},
{
    name: "Nota de Débito Electrónica",
    type: "notaD",
    contable:true
},
{
    name: "Nota de Crédito",
    type: "nota",
    contable:true
},
{
    name: "Retención Boleta Honorarios de Terceros",
    type: "R_bhe",
    contable:false
},
{
    name: "Retención Boleta de Servicios de Terceros",
    type: "R_bhe",
    contable:false
},
{
    name: "Boleta de Servicios de Terceros",
    type: "boleta",
    contable:true
},
];

let businessDocuments = [];
let modifiedDocuments = [];
let tributarieExcelData = [];
const initialTributarieDocuments = {
    documents : []
}

async function readTributarieDocuments(){
    const renewDataFromAPI = await getTributarieDocumentFromAPI();
    const responseTributarieDocuments = await getTributarieDocuments();
    console.log('tributarieDocuments',responseTributarieDocuments);
    if(!responseTributarieDocuments.success){
        return [];
    }

    modifiedDocuments = await getModifiedDocuments();

    const tributarieDocumentsData = tributarieDataDbMap(responseTributarieDocuments.data);
    initialTributarieDocuments['documents'] = responseTributarieDocuments.data;
    setFutureDocumentsOnBankMovements();
    // tributarieDocuments = tributarieDocumentsData;
    return true;

    // const tributarieExcelMovements = await readExcelFile_tributarieDocuments();

    // tributarieExcelData = tributarieExcelMovements;

    // // getModifiedDocuments
    // const modifiedDocumentsR = await fetch('./controller/finance/commonMovements/readModifiedDocuments.php');
    // const modifiedDocumentsData = await modifiedDocumentsR.json();
    // console.log('modifiedDocumentsData',modifiedDocumentsData);
    // if(modifiedDocumentsData.data){
    //     const {data} = modifiedDocumentsData;
    //     modifiedDocuments = data;

    //     // quitar elementos duplicados de modifiedDocuments
    //     modifiedDocuments = modifiedDocuments.filter((document, index, self) =>
    //         index === self.findIndex((t) => (
    //             t.id === document.id
    //         ))
    //     )
    //     console.log('modifiedDocuments',modifiedDocuments);
    // }
    // await readAllDocumentsFromExcel();
    // setFutureDocumentsOnBankMovements();
    // return true;
}


async function tributarieDataDbMap(tributarieDocuments){
    let allMyDocuments = tributarieDocuments.map((movements) => {
        const {
            id,
            issue_date,
            expiration_date,
            folio,
            total,
            balance,
            paid,
            type,
            item: ITEM,
            rut,
            issued,
            sii_code,
            business_name,
            tax,
            exempt_amount,
            taxable_amount,
            net_amount,
            business_id,
            cancelled,
            is_paid : isPaid
        } = movements;

        if(type === "Guía de Despacho" || type === "Guía de Despacho Electrónica"){
            return false;
        }
        const documentType = DOCUMENT_TYPES.find(({name}) => {return name === type} );
        if(!documentType) {
            return false
        }
        // const expirationDate = moment(issue_date,"YYYY-MM-DD").add(30, 'days').format('DD-MM-YYYY');
        // difference between today and expirationdate in days 
        const diffOnDaysFromEmission = moment().diff(moment(expiration_date,"YYYY-MM-DD"), 'days');
        const atrasado = diffOnDaysFromEmission >= 30 && diffOnDaysFromEmission <= 60 ? true : false;
        const outdated = diffOnDaysFromEmission >= 60 ? true : false;
        const item = ITEM.replaceAll("<br/>", ' ');

        const paidComplete = isPaid === 1 ? true : false;

        const idRut = rut != ''?rut.split('-')[0] : '000';
        const idRutDV = rut != ''?rut.split('-')[1] : '111';

        return {
            'id': id,
            'folio': folio,
            'emitida' : issued === 1 ? true : false,
            'paid': paidComplete,
            'fecha_emision': moment(issue_date,"YYYY-MM-DD").format('DD-MM-YYYY'),
            'fecha_emision_timestamp': moment(moment(issue_date,"YYYY-MM-DD").format('DD-MM-YYYY')).format('X'),
            'fecha_expiracion': moment(expiration_date,"YYYY-MM-DD").format('DD-MM-YYYY'),
            'fecha_expiracion_timestamp': moment(moment(expiration_date,"YYYY-MM-DD").format('DD-MM-YYYY')).format('X'),
            'atrasado': paidComplete ? false : atrasado,
            'vencido': paidComplete ? false : outdated,
            'afecto': taxable_amount,
            'exento': exempt_amount,
            'neto': net_amount,
            'impuesto': tax,
            'total': total,
            'saldo': balance,
            'pagado': paid,
            'tipo_documento': documentType ? documentType.type : 'unknown',
            'contable': documentType ? documentType.contable : false,
            'desc_tipo_documento': documentType ? documentType.name : 'unknown',
            'item' : item.trim(),
            'proveedor' : business_name,
            'rut' : rut,
            'vencida_por': diffOnDaysFromEmission,
        }
    }).filter((doc) => doc !== false);

    console.log('allMyDocuments',allMyDocuments);

    modifiedDocuments.forEach((modDoc) => {

        const document = allMyDocuments.find((doc) => { 
            return doc.folio === modDoc.folio && doc.rut === modDoc.rut && doc.total === modDoc.total
        });
        console.log('ALKSDJLAKSDJLAKSDJLAKSDJALSKDJLAKSDJLAKSDLAKSDJLAKSJDLAKSJDLAKSDJLAKSDJLAKSJDLAKSJDLAKSJD',modDoc);
        console.log('ALKSDJLAKSDJLAKSDJLAKSDJALSKDJLAKSDJLAKSDLAKSDJLAKSJDLAKSJDLAKSDJLAKSDJLAKSJDLAKSJDLAKSJD  ',document);
        console.log('ALKSDJLAKSDJLAKSDJLAKSDJALSKDJLAKSDJLAKSDLAKSDJLAKSJDLAKSJDLAKSDJLAKSDJLAKSJDLAKSJDLAKSJD  ',document);
        console.log('ALKSDJLAKSDJLAKSDJLAKSDJALSKDJLAKSDJLAKSDLAKSDJLAKSJDLAKSJDLAKSDJLAKSDJLAKSJDLAKSJDLAKSJD  ',document);
        console.log('________________________________________________________________________________________________________')
        if(document){
            document.paid = modDoc.is_paid;
            // document.paid = modDoc.is_paid == 1 ? true : false;
            // document.fecha_expiracion = modDoc.expiration_date;
            // document.fecha_expiracion_timestamp = moment(modDoc.fecha_expiracion_timestamp,"YYYY-MM-DD").format('X');
        }
    });

    businessDocuments = allMyDocuments;



    // modifiedDocuments.forEach((modDoc) => {
    //     const document = allMyDocuments.find((doc) => doc.id === modDoc.id);
    //     if(document){
    //         document.paid = modDoc.paid;
    //         document.fecha_expiracion = modDoc.fecha_expiracion;
    //         document.fecha_expiracion_timestamp = modDoc.fecha_expiracion_timestamp;
    //     }
    // });





    classifyTributarieDocuments(allMyDocuments,true);

    // return allMyDocuments;
}

async function readAllDocumentsFromExcel() {
    
    let allMyDocuments = tributarieExcelData.bodyRows.map((movements) => {
        const {
            FOLIO,
            TOTAL,
            SALDO,
            PAGADO,
            FECHA_EMISION,
            TIPO,
            ITEM,
            RUT,
            EMITIDO_RECIBIDO,
            RAZON_SOCIAL,
            IMPUESTO,
            MONTO_EXENTO,
            MONTO_AFECTO,
            MONTO_NETO
        } = movements;

        if(TIPO === "Guía de Despacho" || TIPO === "Guía de Despacho Electrónica"){
            return false;
        }
        const documentType = DOCUMENT_TYPES.find(({name}) => {return name === TIPO} );
        if(!documentType) {
            console.log('Document type not found',movements);
            return false
        }
        const issued = EMITIDO_RECIBIDO === 'EMITIDO' ? true : false;
        let paid = false;
        if(documentType.type === 'R_bhe'){
            paid = IMPUESTO === PAGADO;
        }else{
            paid = SALDO == 0;
        }
        
        const expirationDate = moment(FECHA_EMISION,"DD-MM-YYYY").add(30, 'days').format('DD-MM-YYYY');
        // difference between today and expirationdate in days 
        const diffOnDaysFromEmission = moment().diff(moment(expirationDate,"DD-MM-YYYY"), 'days');
        const atrasado = diffOnDaysFromEmission >= 30 && diffOnDaysFromEmission <= 60 ? true : false;
        const outdated = diffOnDaysFromEmission >= 60 ? true : false;
        const item = ITEM.replaceAll("<br/>", ' ');

        const idRut = RUT != ''?RUT.split('-')[0] : '000';
        const idRutDV = RUT != ''?RUT.split('-')[1] : '111';

        return {
            id:`${FOLIO}_${idRut}_${idRutDV}_${TOTAL}`,
            folio : FOLIO,
            emitida : issued,
            paid: paid,
            fecha_emision: FECHA_EMISION,
            fecha_emision_timestamp: moment(FECHA_EMISION,"DD-MM-YYYY").format('X'),
            fecha_expiracion: expirationDate,
            fecha_expiracion_timestamp: moment(expirationDate,"DD-MM-YYYY").format('X'),
            atrasado: paid ? false : atrasado,
            vencido: paid ? false : outdated,
            afecto: MONTO_AFECTO,
            exento: MONTO_EXENTO,
            neto: MONTO_NETO,
            impuesto: IMPUESTO,
            total: TOTAL,
            saldo: SALDO,
            pagado: PAGADO,
            tipo_documento: documentType ? documentType.type : 'unknown',
            contable: documentType ? documentType.contable : false,
            desc_tipo_documento: documentType ? documentType.name : 'unknown',
            item : item.trim(),
            proveedor : RAZON_SOCIAL,
            rut : RUT,
            vencida_por: diffOnDaysFromEmission,
        }
    }).filter((doc) => doc !== false);

    // mark as paid === true modified documents from allMyDocuments match by id
    // allMyDocuments.forEach((document) => {
    //     const modifiedDocument = modifiedDocuments.find((modDoc) => modDoc.id === document.id);
    //     if(modifiedDocument){
    //         document.paid = true;
    //     }
    // });

    // console.log('allMyDocuments',allMyDocuments)
    // console.log('allMyDocuments',allMyDocuments)
    // console.log('allMyDocuments',allMyDocuments)
    // console.log('allMyDocuments',allMyDocuments)
    // console.log('allMyDocuments',allMyDocuments)
    // console.log('allMyDocuments',allMyDocuments)
    // modifiedDocuments.forEach((modDoc) => {
    //     const document = allMyDocuments.find((doc) => doc.id === modDoc.id);
    //     if(document){
    //         document.paid = modDoc.paid;
    //         document.fecha_expiracion = modDoc.fecha_expiracion;
    //         document.fecha_expiracion_timestamp = modDoc.fecha_expiracion_timestamp;
    //     }
    // });

    businessDocuments = allMyDocuments;

    console.log('allMyDocuments',allMyDocuments);

    classifyTributarieDocuments(allMyDocuments,true);
};

function setFutureDocumentsOnBankMovements(){


    tributarieDocumentsCategories.forEach((category) => {
        const documents = tributarieDocuments[category].filter(({contable,paid}) => contable && !paid);
        documents.forEach((document) => {

            const {emitida,fecha_expiracion,saldo} = document;
            const egresoIngreso = emitida ? 'projectedIncome' : 'projectedOutcome';
            // console.log('egresoIngreso',egresoIngreso);
            const formatDate = moment(fecha_expiracion,"DD-MM-YYYY").format('X'); 
            // const printDateTimeStamp = moment(formatDate,'YYYY-MM-DD').format('X');
             
            let printDate = formatDate;
            //get difference in days between today and expiration date
            const diffOnDaysFromEmission = moment().diff(moment(formatDate,"X"), 'days');
            if(diffOnDaysFromEmission > 0){
                // get amount of weeks between today and expiration date
                const weeks = Math.ceil(diffOnDaysFromEmission / 7);
                // add weeks to expiration date
                printDate = moment(formatDate,"X").add(weeks * 7, 'days').format('X');
            }
            const dayOnArray = bankMovementsData[egresoIngreso].find(({timestamp}) => {
                return moment(timestamp,'X').format('YYYY-MM-DD') == moment(printDate,'X').format('YYYY-MM-DD');
            });
            if(!dayOnArray){
                return
            }
            dayOnArray.lvlCodes.push(document);
            dayOnArray.total += saldo;
        });
    });
}


function removeFromFuture(documentToFind){


    tributarieDocumentsCategories.forEach((category) => {
        const documents = tributarieDocuments[category].filter(({contable,paid}) => contable && !paid);
        documents.forEach((document) => {

            const {emitida,fecha_expiracion,saldo} = document;
            const egresoIngreso = emitida ? 'projectedIncome' : 'projectedOutcome';
            // console.log('egresoIngreso',egresoIngreso);
            const formatDate = moment(fecha_expiracion,"DD-MM-YYYY").format('X'); 
            // const printDateTimeStamp = moment(formatDate,'YYYY-MM-DD').format('X');
             
            let printDate = formatDate;
            //get difference in days between today and expiration date
            const diffOnDaysFromEmission = moment().diff(moment(formatDate,"X"), 'days');
            if(diffOnDaysFromEmission > 0){
                // get amount of weeks between today and expiration date
                const weeks = Math.ceil(diffOnDaysFromEmission / 7);
                // add weeks to expiration date
                printDate = moment(formatDate,"X").add(weeks * 7, 'days').format('X');
            }
            const dayOnArray = bankMovementsData[egresoIngreso].find(({timestamp}) => {
                return moment(timestamp,'X').format('YYYY-MM-DD') == moment(printDate,'X').format('YYYY-MM-DD');
            });
            if(!dayOnArray){
                return
            }
            dayOnArray.lvlCodes.forEach((lvlCode,index) => {
                if(lvlCode.folio === documentToFind.folio && lvlCode.rut === documentToFind.rut && lvlCode.total === documentToFind.total){
                    dayOnArray.lvlCodes.splice(index,1);
                    dayOnArray.total -= saldo;
                }
            });
            // dayOnArray.total += saldo;
        });
    });
}
function addFromFuture(documentToFind){

    console.log('documentToFind',documentToFind);

    let insert = false;
    let dayOnArr = null;
    tributarieDocumentsCategories.forEach((category) => {
        const documents = tributarieDocuments[category].filter(({contable,paid}) => contable && !paid);
        documents.forEach((document) => {

            const {emitida,fecha_expiracion,saldo} = document;
            const egresoIngreso = emitida ? 'projectedIncome' : 'projectedOutcome';
            // console.log('egresoIngreso',egresoIngreso);
            const formatDate = moment(fecha_expiracion,"DD-MM-YYYY").format('X'); 
            // const printDateTimeStamp = moment(formatDate,'YYYY-MM-DD').format('X');
             
            let printDate = formatDate;
            //get difference in days between today and expiration date
            const diffOnDaysFromEmission = moment().diff(moment(formatDate,"X"), 'days');
            if(diffOnDaysFromEmission > 0){
                // get amount of weeks between today and expiration date
                const weeks = Math.ceil(diffOnDaysFromEmission / 7);
                // add weeks to expiration date
                printDate = moment(formatDate,"X").add(weeks * 7, 'days').format('X');
            }
            const dayOnArray = bankMovementsData[egresoIngreso].find(({timestamp}) => {
                return moment(timestamp,'X').format('YYYY-MM-DD') == moment(printDate,'X').format('YYYY-MM-DD');
            });

            if(!dayOnArray){
                return
            }else{
                dayOnArr = dayOnArray;
                insert = true;
            }
            // dayOnArray.total += saldo;
        });
    });

    if(insert && dayOnArr != null){
        dayOnArr.lvlCodes.push(documentToFind);
        dayOnArr.total += documentToFind.total;
    }
}
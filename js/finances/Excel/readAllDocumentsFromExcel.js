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

async function readAllDocumentsFromExcel() {
    const excelResponse = await fetch('/test6.php');
    const excelData = await excelResponse.json(); 
    const allMyDocuments = excelData.bodyRows.map((movements) => {
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
    businessDocuments = allMyDocuments;

    console.log('allMyDocuments',allMyDocuments);

    classifyTributarieDocuments(allMyDocuments,true);
};




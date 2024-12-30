
async function filterDocumentsFromAPI() {
  // GET DATA FROM LOCAL FILE
  const documentosProducto = await fetch('/CLAYAPIDATA/Intec/docProducto.json').then(response => response.json());
  // const documentosProducto = await getDocumentosProducto();
  const DOCUMENTS_A = documentosProducto.data.items;
  console.log('DOCUMENTS_A', DOCUMENTS_A);
  let UNIQUE_A = [...new Set(DOCUMENTS_A.map(item => item.tipo))];
  const documentosTributarios = await fetch('/CLAYAPIDATA/Intec/docTributario.json').then(response => response.json());
  // const documentosTributarios = await getDocumentosTributarios();
  console.log('documentosTributarios', documentosTributarios);
  const DOCUMENTS_B = documentosTributarios.data.items;
  let UNIQUE_B = [...new Set(DOCUMENTS_B.map(item => item.tipo))];

  // const DOCUMENTS_A = DATA_A.data.items;
  // let UNIQUE_A = [...new Set(DOCUMENTS_A.map(item => item.tipo))];
  // const DOCUMENTS_B = data_B.data.items;
  // let UNIQUE_B = [...new Set(DOCUMENTS_B.map(item => item.tipo))];

  console.log('UNIQUE_A', UNIQUE_A);
  console.log('UNIQUE_B', UNIQUE_B);
  const billsOnDatab = DOCUMENTS_B.filter((document) => { return document.tipo === 'Factura de Venta' || document.tipo === 'Factura Exenta' });
  const billsOnDataA = DOCUMENTS_A.filter((document) => { return document.tipo === 'Factura de Venta' || document.tipo === 'Factura Exenta' });
  let rejectedBills = 0;
  console.log('billsOnDatab', billsOnDatab);
  console.log('billsOnDataA', billsOnDataA);
  let contable = 0;
  const allMyBills = DOCUMENTS_B.map(({
    numero,
    tipo,
    fecha_emision,
    fecha_humana_emision,
    saldo_insoluto,
    pagado,
    recibida,
    total,
    descripcion,
    emisor,
    receptor,
    doc_relacionados,
    codigo,
    recepcion,
    cesion
  }) => {
    // console.log('recepcion', recepcion);
    if(recepcion != null){
      if( recepcion.estado === "R"){
        rejectedBills ++;
        return false;
      }
    }

    // VER SI NOTAS DE CREDITOANULAN LA TOTALIDAD DE LA FACTURA
    if(doc_relacionados != null){
      if(doc_relacionados.length > 0){
        const hasCrediteNote = doc_relacionados.filter(({tipo_doc}) => { return tipo_doc === 'Nota de Crédito' });
        if(hasCrediteNote.length > 0){
          let totalNotaCredito = 0;
          hasCrediteNote.forEach(({monto_vinculado}) => {
            totalNotaCredito += monto_vinculado;
          });

          if(totalNotaCredito === total.total){
            return false;
          }
          total.total -= totalNotaCredito;
          saldo_insoluto = total.total - totalNotaCredito;
        }
      }
    }
    const documentType = DOCUMENT_TYPES.find(({ name }) => { return name === tipo });
    // console.log('documentType', documentType);

    const provider = recibida ? emisor.razon_social : receptor.razon_social;
    const provider_rut = recibida ? emisor.rut : receptor.rut;
    if (!documentType) {
      return false
    }
    if(documentType.contable){
      contable ++;
    }
    const issued = !recibida ? true : false;
    let paid = pagado;
    const expirationDate = moment(fecha_emision, "X").add(30, 'days').format('DD-MM-YYYY');
    
    // difference between today and expirationdate in days 
    const diffOnDays = moment().diff(moment(expirationDate, "DD-MM-YYYY"), 'days');
    const diffOnDaysFromEmission = moment().diff(moment(fecha_emision, "X"), 'days');
    const atrasado = diffOnDaysFromEmission >= 30 && diffOnDaysFromEmission <= 60 ? true : false;
    const outdated = diffOnDaysFromEmission >= 60 ? true : false;
    const saldo = saldo_insoluto == null ? !pagado ? total.total : 0 : saldo_insoluto; 

    let item = "";
    if(descripcion){
      item = descripcion[0].item.replaceAll("<br/>", ' ');
    }

    // 'fecha_expiracion_timestamp': ,
    return {
      'folio': numero,
      'emitida': issued,
      'paid': paid,
      'fecha_emision': moment(fecha_humana_emision, "YYYY-MM-DD").format('DD-MM-YYYY'),
      'fecha_emision_timestamp': fecha_emision,
      'fecha_expiracion': expirationDate,
      'fecha_expiracion_timestamp': moment(expirationDate, "DD-MM-YYYY").format('X'),
      'atrasado': paid ? false : atrasado,
      'vencido': paid ? false : outdated,
      'afecto': total.neto,
      'exento': total.exento,
      'neto': total.neto,
      'impuesto': total.impuesto,
      'total': total.total,
      'saldo': saldo,
      'pagado': total.total - saldo,
      'tipo_documento': documentType ? documentType.type : 'unknown',
      'contable': documentType ? documentType.contable : false,
      'desc_tipo_documento': documentType ? documentType.name : 'unknown',
      'item': item.trim(),
      'proveedor': provider,
      'rut': provider_rut,
      'vencida_por': diffOnDaysFromEmission
    }
  }).filter((document) => { return document });

  const uniqueTypeBills = [...new Set(allMyBills.map(item => item.desc_tipo_documento))];
  console.log('uniqueTypeBills', uniqueTypeBills);

  const uniqueTypeBillsNotPaid = [...new Set(allMyBills.filter(({paid}) => { return !paid }).map(item => item.desc_tipo_documento))];
  console.log('uniqueTypeBillsNotPaid', uniqueTypeBillsNotPaid);

  const issuedBills = allMyBills.filter(({emitida, paid,tipo_documento}) => { return emitida && tipo_documento === 'factura' });
  console.log('issuedBills', issuedBills);

  const sortedByFolio = issuedBills.sort((a, b) => { return a.folio - b.folio });
  console.log('sortedByFolio', sortedByFolio);

  let allFoliosConcatWithComa = "";
  sortedByFolio.forEach(({folio}) => {
    allFoliosConcatWithComa += folio + ",";
  });
  console.log('allFoliosConcatWithComa', allFoliosConcatWithComa);
  console.log('rejectedBills', rejectedBills);

  // quitar facturas duplicadas
  const uniqueBills = allMyBills.filter((document, index, self) =>
    index === self.findIndex((t) => (
      t.folio === document.folio
    ))
  );
  
  const allOtherDocuments = DOCUMENTS_A.map(({
    fecha_emision,
    fecha_humana_emision,
    numero,
    tipo,
    codigo,
    pagado,
    recibida,
    emisor,
    receptor,
    total,
    producto,
    recepcion,
    cesion
  },index)=>{
    if(tipo === 'Factura de Venta' || tipo === 'Factura Exenta' || tipo === "Guía de Despacho" || tipo === 'Nota de Crédito'){
      return;
    }
    const documentType = DOCUMENT_TYPES.find(({ name }) => { return name === tipo });
    if (!documentType) {
      console.log(DOCUMENTS_A[index]);
      console.log('Document type not found');
      return false;
    }
    if(documentType.contable){
      contable ++;
    }
    const provider = recibida ? emisor.razon_social : receptor.razon_social;
    const provider_rut = recibida ? emisor.rut : receptor.rut;
    const issued = !recibida ? true : false;
    let paid = pagado;

    const expirationDate = moment(fecha_emision, "X").add(30, 'days').format('DD-MM-YYYY');
    // difference between today and expirationdate in days 
    const diffOnDays = moment().diff(moment(expirationDate, "DD-MM-YYYY"), 'days');
    const diffOnDaysFromEmission = moment().diff(moment(fecha_emision, "X"), 'days');
    const atrasado = diffOnDaysFromEmission >= 30 && diffOnDaysFromEmission <= 60 ? true : false;
    const outdated = diffOnDaysFromEmission >= 60 ? true : false;

    let item = "";
    if(producto){
      item = producto.name.replaceAll("<br/>", ' ');
    }

    
    const idRut = provider_rut != ''?provider_rut.split('-')[0] : '000';
    const idRutDV = provider_rut != ''?provider_rut.split('-')[1] : '111';

    return {
      'id':`${numero}_${idRut}_${idRutDV}_${total.total}`,
      'folio': numero,
      'emitida': issued,
      'paid': paid,
      'fecha_emision': moment(fecha_humana_emision, "YYYY-MM-DD").format('DD-MM-YYYY'),
      'fecha_emision_timestamp': fecha_emision,
      'fecha_expiracion': expirationDate,
      'fecha_expiracion_timestamp': moment(expirationDate, "DD-MM-YYYY").format('X'),
      'atrasado': paid ? false : atrasado,
      'vencido': paid ? false : outdated,
      'afecto': total.neto,
      'exento': total.exento,
      'neto': total.neto,
      'impuesto': total.impuesto,
      'total': total.total,
      'saldo': !paid ? total.total : 0,
      'pagado': paid ? total.total : 0,
      'tipo_documento': documentType ? documentType.type : 'unknown',
      'contable': documentType ? documentType.contable : false,
      'desc_tipo_documento': documentType ? documentType.name : 'unknown',
      'item': item.trim(),
      'proveedor': provider,
      'rut': provider_rut,
      'vencida_por': diffOnDaysFromEmission
    }

  }).filter((document) => { return document });

  const allMyDocuments = [...allMyBills, ...allOtherDocuments];


  getAllMyNotPaidDocuments(allMyDocuments);
  classifyTributarieDocuments(allMyDocuments,false);
}

function getAllMyNotPaidDocuments(allMyDocuments){
  // get all documents types
  const uniqueType = [...new Set(allMyDocuments.map(item => item.desc_tipo_documento))];
  console.log('uniqueType', uniqueType);


  const notPaid = allMyDocuments.filter(({paid,contable}) => {return contable && !paid});
  console.log('notPaid',notPaid);
  // get all documents type on notPaid
  const uniqueTypeNotPaid = [...new Set(notPaid.map(item => item.desc_tipo_documento))];
  console.log('uniqueTypeNotPaid', uniqueTypeNotPaid);
}

async function getDocumentosProducto(){
  const response = await fetch('ws/Clay/documentoProducto.php',{
    method: 'POST',
    headers: {
      Token: '9NVElUwIrrQPXFU0VSVD9zfeP5i2PWAbrONlc0lQM-0TfHj0a6AQ2wbI-eg01mTj_ZnZLV6q4d2hLU86AXntfY'
    },
    body: JSON.stringify({
      initDate : '2024-01-01',
      busId : '77604901',
      bankAcocuntId : '63741369',
    })
  });
  console.log('response', response);
  const data = await response.json();
  console.log('data', data);

  return  data;
}
async function getDocumentosTributarios(){
  const response = await fetch('ws/Clay/documentosTributarios.php',{
    method: 'POST',
    headers: {
      Token: '9NVElUwIrrQPXFU0VSVD9zfeP5i2PWAbrONlc0lQM-0TfHj0a6AQ2wbI-eg01mTj_ZnZLV6q4d2hLU86AXntfY'
    },
    body: JSON.stringify({
      initDate : '2024-01-01',
      busId : '77604901',
      bankAcocuntId : '63741369',
    })
  });
  console.log('response', response);
  const data = await response.json();
  console.log('data', data);

  return  data;
}
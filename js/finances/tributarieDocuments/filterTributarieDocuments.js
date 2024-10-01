let tributarieCardsData = {
  charges: {
    totalDocuments: {
      amount: 0,
      total: 0
    },
    upToDateDocuments: {
      amount: 0,
      total: 0
    },
    dueDocuments: {//atrasadas
      amount: 0,
      total: 0
    },
    outdatedDocuments: {//vencidas
      amount: 0,
      total: 0
    }
  },
  payments: {
    totalDocuments: {
      amount: 0,
      total: 0
    },
    bhe: {
      amount: 0,
      total: 0
    },
    bills: {
      amount: 0,
      total: 0
    },
    pendingDocuments: {
      amount: 0,
      total: 0
    }
  },
  bankBalance: {
    todayBankBalance: 4999394,
    totalPayments: 0,
    totalCharges: 0
  }
}

let tributarieDocuments = {
  charges: [],
  payments: [],
  notaCredito: [],
  notaDebito: []
}

function classifyTributarieDocuments(trDocuments, subtractCreditNote) {

  // console.log('subtractCreditNote',subtractCreditNote)
  // console.log('trDocuments', trDocuments);

  const notPaidBhe = trDocuments.filter((document) => {
    return document.tipo_documento === 'bhe' && !document.paid;
  });

  const sortedNotPaidBhe = notPaidBhe.sort((a, b) => {
    return a.folio - b.folio;
  });

  let update = [];
  let boletasTotal = [];
  let totalDocumentos = [];

  trDocuments.forEach((document) => {

    sortDocumentOnDate(document);
    return;
    if (!document.contable) { return; };
    if (document.tipo_documento === 'nota') {
      // boletasTotal.push(document);
      tributarieDocuments.notaCredito.push(document);
      return;
    }
    if (document.tipo_documento === 'notaD') {
      // boletasTotal.push(document);
      tributarieDocuments.notaDebito.push(document);
      return;
    }
    // true = charges, false = payments
    const classy = document.emitida;
    const documentType = document.emitida ? 'charges' : 'payments';
    const needToPay = document.emitida ? true : false;

    // push document to its respective array
    tributarieDocuments[documentType].push(document);




    if (!document.emitida) {

      tributarieCardsData.payments.totalDocuments.amount++;
      tributarieCardsData.payments.totalDocuments.total += document.total;

      if (document.tipo_documento === 'bhe' && !document.paid) {
        tributarieCardsData.payments.bhe.amount++;
        tributarieCardsData.payments.bhe.total += document.saldo;
      }
      // checkIfBillHasCreditNote(bill);
      if ((document.tipo_documento === 'factura' || document.tipo_documento === 'bev') && !document.paid) {
        tributarieCardsData.payments.bills.amount++;
        tributarieCardsData.payments.bills.total += document.saldo;
      }
      if (document.vencida_por > 30 && !document.paid) {
        tributarieCardsData.payments.pendingDocuments.amount++;
        tributarieCardsData.payments.pendingDocuments.total += document.saldo;
      }
      if (needToPay) {
        tributarieCardsData.bankBalance.totalCharges += document.total;
      } else {
        tributarieCardsData.bankBalance.totalPayments += document.total;
      }

    } else {
      totalDocumentos.push(document);
      tributarieCardsData.charges.totalDocuments.amount++;
      tributarieCardsData.charges.totalDocuments.total += document.total;

      if (!document.paid) {
        tributarieCardsData.charges.upToDateDocuments.amount++;
        tributarieCardsData.charges.upToDateDocuments.total += document.saldo;
        if (document.vencida_por > 60) {
          tributarieCardsData.charges.outdatedDocuments.amount++;
          tributarieCardsData.charges.outdatedDocuments.total += document.saldo;
        }
        if (document.vencida_por > 30 && document.vencida_por <= 60) {
          tributarieCardsData.charges.dueDocuments.amount++;
          tributarieCardsData.charges.dueDocuments.total += document.saldo;
        }
      }
    }

  });





  const recuentoEmitidas = tributarieDocuments.charges.filter((document) => { return document.emitida });
  console.log('recuentoEmitidas', recuentoEmitidas);
  console.log('NOTAS DE CREDITO', tributarieDocuments.notaCredito);

  const creditoEmitida = tributarieDocuments.notaCredito.filter((document) => { return document.emitida });

  console.log('creditoEmitida', creditoEmitida);
  let totalNotasRecibidas = 0;

  if (subtractCreditNote) {
    tributarieDocuments.notaCredito.forEach((nota) => {
      if (nota.emitida) {
        // boletasTotal.push(nota);
        tributarieCardsData.charges.totalDocuments.total -= nota.total;
        tributarieCardsData.charges.totalDocuments.amount--;
      } else {
        boletasTotal.push(nota);

        totalNotasRecibidas += nota.total;
        tributarieCardsData.payments.totalDocuments.total -= nota.total;
        tributarieCardsData.payments.totalDocuments.amount--;
      }
      const { rut, total } = nota;
      const hasCreditNote = trDocuments.filter((bill) => {
        return bill.rut === rut && bill.total === total && (bill.tipo_documento === 'factura' || bill.tipo_documento === 'bev');
      });
      if (!hasCreditNote) {
        return
      }
      console.log('hasCreditNote', "hasCreditNote");
      console.log('nota de credito', nota);
      console.log('factura', hasCreditNote);
      console.log('------------------------');
      console.log(' ');
      console.log(' ');
    });
    console.log('totalNotasRecibidas', totalNotasRecibidas);
    tributarieDocuments.notaDebito.forEach((nota) => {
      if (nota.emitida) {
        tributarieCardsData.charges.totalDocuments.total += nota.total;
        tributarieCardsData.charges.totalDocuments.amount++;
      } else {
        tributarieCardsData.payments.totalDocuments.total += nota.total;
        tributarieCardsData.payments.totalDocuments.amount++;
        // tributarieCardsData.payments.pendingDocuments.total += nota.total;
      }

      // LOCATE THE BILL THAT HAS THE SAME FOLIO AND RUT
      const { rut, total } = nota;
      const hasCreditNote = trDocuments.find((bill) => {
        return bill.rut === rut && bill.total === total && (bill.tipo_documento === 'factura' || bill.tipo_documento === 'bev');
      });
      if (!hasCreditNote) {
      }
    });
  } else {

  }
  console.log('tributarieCardsData', tributarieCardsData);
  // console.log('tributarieDocuments', tributarieDocuments);
  // console.log('update', JSON.stringify(update));
  // console.log(tributarieCardsData.bankBalance.todayBankBalance - tributarieCardsData.bankBalance.totalPayments + tributarieCardsData.bankBalance.totalCharges);
  console.log('boletasTotal', boletasTotal);
  // console.log('totalDocumentos',totalDocumentos)


}

function sortDocumentOnDate(document) {

  if (!document.contable) { return; };
  if (document.tipo_documento === 'nota') {
    // boletasTotal.push(document);
    tributarieDocuments.notaCredito.push(document);
    return;
  }
  if (document.tipo_documento === 'notaD') {
    // boletasTotal.push(document);
    tributarieDocuments.notaDebito.push(document);
    return;
  }
  // true = charges, false = payments
  const classy = document.emitida;
  const documentType = document.emitida ? 'charges' : 'payments';
  const needToPay = document.emitida ? true : false;

  // push document to its respective array
  tributarieDocuments[documentType].push(document);


  if (!document.emitida) {

    tributarieCardsData.payments.totalDocuments.amount++;
    tributarieCardsData.payments.totalDocuments.total += document.total;

    if (document.tipo_documento === 'bhe' && !document.paid) {
      tributarieCardsData.payments.bhe.amount++;
      tributarieCardsData.payments.bhe.total += document.saldo;
    }
    // checkIfBillHasCreditNote(bill);
    if ((document.tipo_documento === 'factura' || document.tipo_documento === 'bev') && !document.paid) {
      tributarieCardsData.payments.bills.amount++;
      tributarieCardsData.payments.bills.total += document.saldo;
    }
    if (document.vencida_por > 0 && !document.paid) {
      tributarieCardsData.payments.pendingDocuments.amount++;
      tributarieCardsData.payments.pendingDocuments.total += document.saldo;
    }
    if (needToPay) {
      tributarieCardsData.bankBalance.totalCharges += document.total;
    } else {
      tributarieCardsData.bankBalance.totalPayments += document.total;
    }

  } else {
    // totalDocumentos.push(document);
    tributarieCardsData.charges.totalDocuments.amount++;
    tributarieCardsData.charges.totalDocuments.total += document.total;

    if (!document.paid) {
      tributarieCardsData.charges.upToDateDocuments.amount++;
      tributarieCardsData.charges.upToDateDocuments.total += document.saldo;
      if (document.vencida_por > 59) {
        tributarieCardsData.charges.outdatedDocuments.amount++;
        tributarieCardsData.charges.outdatedDocuments.total += document.saldo;
      }
      if (document.vencida_por > 0 && document.vencida_por <= 30) {
        tributarieCardsData.charges.dueDocuments.amount++;
        tributarieCardsData.charges.dueDocuments.total += document.saldo;
      }
    }
  }
}


function discountDocument(document) {

  console.log('document', document);
  console.log('document', document);
  console.log('document', document);
  console.log('document', document);
  console.log('document', document);


  const { folio: folioDocumentDiscount, rut: rutDocumentDiscount, total: totalDocumentDiscount } = document;
  const rutDiscount = rutDocumentDiscount.split('-')[0];
  const dvDiscount = rutDocumentDiscount.split('-')[1];

  console.log('folio', folioDocumentDiscount);


  if (!document.contable) { return; };
  if (document.tipo_documento === 'nota') {
    // boletasTotal.push(document);
    return;
  }
  if (document.tipo_documento === 'notaD') {
    // boletasTotal.push(document);
    return;
  }
  // true = charges, false = payments
  const needToPay = document.emitida ? true : false;

  // push document to its respective array
  const indexOfDocument = tributarieDocuments[document.emitida ? 'charges' : 'payments'].findIndex((doc) => {
    return doc.folio === document.folio && doc.rut === document.rut;
  });

  const document1 = tributarieDocuments[document.emitida ? 'charges' : 'payments'][indexOfDocument];

  if (!document.emitida) {
    console.log("+++++");
    console.log("DOCUMENTO", document);
    console.log("+++++");
    tributarieCardsData.payments.totalDocuments.amount--;
    tributarieCardsData.payments.totalDocuments.total -= document.total;
    if (document.tipo_documento === 'bhe' && document.paid) {
      tributarieCardsData.payments.bhe.amount--;
      tributarieCardsData.payments.bhe.total -= document.saldo;
    }
    // checkIfBillHasCreditNote(bill);
    if ((document.tipo_documento === 'factura' || document.tipo_documento === 'bev') && document.paid) {
      tributarieCardsData.payments.bills.amount--;
      tributarieCardsData.payments.bills.total -= document.saldo;
    }
    if (document.vencida_por > 30 && document.paid) {
      tributarieCardsData.payments.pendingDocuments.amount--;
      tributarieCardsData.payments.pendingDocuments.total -= document.saldo;
    }
    if (needToPay) {
      tributarieCardsData.bankBalance.totalCharges -= document.total;
    } else {
      tributarieCardsData.bankBalance.totalPayments -= document.total;
    }

  } else {
    // totalDocumentos.push(document);
    tributarieCardsData.charges.totalDocuments.amount--;
    tributarieCardsData.charges.totalDocuments.total -= document.total;

    if (document.paid) {
      tributarieCardsData.charges.upToDateDocuments.amount--;
      tributarieCardsData.charges.upToDateDocuments.total -= document.saldo;
      if (document.vencida_por > 60) {
        tributarieCardsData.charges.outdatedDocuments.amount--;
        tributarieCardsData.charges.outdatedDocuments.total -= document.saldo;
      }
      if (document.vencida_por > 30 && document.vencida_por <= 60) {
        tributarieCardsData.charges.dueDocuments.amount--;
        tributarieCardsData.charges.dueDocuments.total -= document.saldo;
      }
    }
  }
  // tributarieDocuments[documentType].push(document);

  tributarieDocumentsCategories.forEach((category) => {
    console.log('category', category);
    console.log(folioDocumentDiscount);
    const documents = tributarieDocuments[category].filter(({ contable, paid }) => contable);
    const discountedDocument = documents.find((document) => {
      const { folio, rut, total } = document;
      const rutD = rut.split('-')[0];
      const dvD = rut.split('-')[1];
      // return folio == folioDocumentDiscount;
      return folio == folioDocumentDiscount && rutD == rutDiscount && dvD == dvDiscount && total == totalDocumentDiscount;
    });
    if (!discountedDocument) {
      return;
    }
    const { emitida, fecha_expiracion, saldo } = discountedDocument;
    const documentType = emitida ? 'projectedIncome' : 'projectedOutcome';
    const formatDate = moment(fecha_expiracion, "DD-MM-YYYY").format('X');
    let printDate = formatDate;
    const diffOnDaysFromEmission = moment().diff(moment(formatDate, "X"), 'days');
    if (diffOnDaysFromEmission > 0) {
      const weeks = Math.ceil(diffOnDaysFromEmission / 7);
      printDate = moment(formatDate, "X").add(weeks * 7, 'days').format('X');
    }
    const dayOnArray = bankMovementsData[documentType].find(({ timestamp }) => {
      return moment(timestamp, 'X').format('YYYY-MM-DD') == moment(printDate, 'X').format('YYYY-MM-DD');
    });
    if (!dayOnArray) {
      return
    }
    dayOnArray.total -= saldo;
  });
}

function checkIfBillHasCreditNote(bill) {
  const creditNotes = tributarieDocuments.notaCredito;
  const hasCreditNote = creditNotes.some((creditNote) => {
    const emisor = bill.rut;
    return creditNote.folio === bill.folio && creditNote.rut === emisor;
  });
  
  return hasCreditNote;
}

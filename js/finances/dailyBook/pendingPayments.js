const dateColumn = document.getElementsByClassName('dateColumn');
// sorted value by date 0 = default, 1 = asc, 2 = desc


function renderPendingPayments(){
    console.log('futureDocuments',futureDocuments)


    const futurePayments = sortDocumentsByDate('charges');

    // const filteredPaid = futureDocuments.filter(({pagado}) => pagado);
    // console.log('filteredPaid',filteredPaid)
    
    let tr = document.createElement('tr');
    let theadTr = `
        <tr>
            <th class="dateColumn">Fecha emisión</th>
            <th class="dateColumn">Fecha Pago</th>
            <th>Proveedor</th>
            <th>N° Factura</th>
            <th>Glosa/Detalle</th>
            <th>Total Neto</th>
            <th>IVA</th>
            <th>Total</th>
            <th>Saldo</th>
            <th>Estado</th>
        </tr>`
    tr.innerHTML = theadTr;
    thead.appendChild(tr);
    // const futurePayments = futureDocuments.filter(({pagada,recibida}) => recibida);
    // const futurePayments =  tributarieDocuments.charges;
    // const sortedByDate = futurePayments.sort((a,b) => a.fecha_emision - b.fecha_emision);

   
    futurePayments.forEach((futurePayment) => {
        // ADD ONE MONTH TO FUTURE PAYMENT DATE
        let tr = document.createElement('tr');
        const futurePaymentDate = moment(futurePayment.fecha_emision,'X').add(1,'months').format('DD-MM-YYYY');
        const emissionDate = moment(futurePayment.fecha_emision,'X').format('DD-MM-YYYY');
        const saldo = futurePayment.saldo_insoluto == null ? 0 : futurePayment.saldo_insoluto; 
        const paid = !futurePayment.pagado ? 'Pendiente' : 'Pagado';
        if(futurePayment.pagado){
            console.log('pagada',futurePayment)
        }else{
            console.log('NO pagada',futurePayment)
            
        }
        const paidClass = !futurePayment.pagado ? 'pending' : 'paid';
        let provider ;
        if(futurePayment.recibida){
            provider = futurePayment.emisor.razon_social;
        }else{
            provider = futurePayment.receptor.razon_social;

        }
        let comments = futurePayment.descripcion == null ? '' : futurePayment.descripcion[0].descripcion
        let rowHTML = `
        <tr>
            <td>${emissionDate}</td>
            <td>${futurePaymentDate}</td>
            <td>${provider}</td>
            <td>${futurePayment.numero}</td>
            <td>${comments}</td>
            <td>${getChileanCurrency(parseInt(futurePayment.total.neto))}</td>
            <td>${getChileanCurrency(parseInt(futurePayment.total.impuesto))}</td>
            <td>${getChileanCurrency(parseInt(futurePayment.total.total))}</td>
            <td>${getChileanCurrency(saldo)}</td>
            <td><p class="paymentStatus ${paidClass}">${paid}</p></td>
        </tr>`
        
        tr.innerHTML = rowHTML;
        tbody.appendChild(tr);
    })  
}


console.log('dateColumn',dateColumn);







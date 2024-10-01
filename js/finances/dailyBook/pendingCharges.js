
function renderPendingCharges(){
    let tr = document.createElement('tr');
    let theadTr = `
        <tr>
            <th>Fecha emisión</th>
            <th>Fecha Pago</th>
            <th>Proveedor</th>
            <th>N° Factura</th>
            <th>Glosa/Detalle</th>
            <th>Total Neto</th>
            <th>IVA</th>
            <th>Total</th>
            <th>Saldo</th>
            <th>Estado</th>
        </tr>`;
    tr.innerHTML = theadTr;
    thead.appendChild(tr);
    // const futureCharges = futureDocuments.filter(({pagada,recibida}) =>!recibida);
    // const futureCharges = tributarieDocuments.payments;

    const futureCharges = sortDocumentsByDate('payments');

    futureCharges.forEach((futureCharge) => {
        // ADD ONE MONTH TO FUTURE PAYMENT DATE
        let tr = document.createElement('tr');
        const futureChargeDate = moment(futureCharge.fecha_emision,'X').add(1,'months').format('DD-MM-YYYY');
        const emissionDate = moment(futureCharge.fecha_emision,'X').format('DD-MM-YYYY');
        const saldo = futureCharge.saldo_insoluto == null ? 0 : futureCharge.saldo_insoluto; 
        const paid = futureCharge.pagada == false ? 'Pendiente' : 'Pagada';
        const paidClass = futureCharge.pagada == false ? 'pending' : 'paid';
        let provider ;
        if(futureCharge.recibida){
            provider = futureCharge.emisor.razon_social;
        }else{
            provider = futureCharge.receptor.razon_social;

        }
        let comments = futureCharge.descripcion == null ? '' : futureCharge.descripcion[0].descripcion
        let rowHTML = `
        <tr>
            <td>${emissionDate}</td>
            <td>${futureChargeDate}</td>
            <td>${provider}</td>
            <td>${futureCharge.numero}</td>
            <td>${comments}</td>
            <td>${getChileanCurrency(parseInt(futureCharge.total.neto))}</td>
            <td>${getChileanCurrency(parseInt(futureCharge.total.impuesto))}</td>
            <td>${getChileanCurrency(parseInt(futureCharge.total.total))}</td>
            <td>${getChileanCurrency(saldo)}</td>
            <td>  <p class="paymentStatus ${paidClass}">${paid}</p></td>
        </tr>`
        
        tr.innerHTML = rowHTML;
        tbody.appendChild(tr);
    })  
}


async function getPendingCharges(){
    const pendingCharges = await get();
}
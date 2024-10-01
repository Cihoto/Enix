

function renderChargesTable(sortFunction, hidePaid = true) {

    // rmeove all Existing Rows
    $('#bankMovementsTableHorizontal tr').remove();

    document.getElementById('financeTableContainer').classList.add('verticalMode');
    console.log('futureDocuments',futureDocuments);
    const futurePayments = sortFunction;

    let tr = document.createElement('tr');
    let theadTr = `
        <tr>
            <th class="dateColumn">Fecha emisión</th>
            <th class="dateColumn">Fecha pago</th>
            <th>N° Factura</th>
            <th>Glosa/Detalle</th>
            <th>Proveedor</th>
            <th>Total Neto</th>
            <th>IVA</th>
            <th>Total</th>
            <th>Saldo</th>
            <th>Estado</th>
        </tr>`
    tr.innerHTML = theadTr;
    tr.classList.add('headerRow');
    thead.appendChild(tr);
    // const futurePayments = futureDocuments.filter(({pagada,recibida}) => recibida);
    // const futurePayments =  tributarieDocuments.charges;
    // const sortedByDate = futurePayments.sort((a,b) => a.fecha_emision - b.fecha_emision);

    console.log('futurePayments',futurePayments);

    let totales = {
        neto: 0,
        iva: 0,
        total: 0,
        saldo: 0
    }

    futurePayments.forEach((futurePayment) => {
        // ADD ONE MONTH TO FUTURE PAYMENT DATE
        let tr = document.createElement('tr');
        // add custom properties rowId  = futurePayment.id
        tr.setAttribute('rowId',futurePayment.id);
        tr.classList.add('tributarierRow');
        if(hidePaid && futurePayment.paid){
            return;
        }
        const {
            folio,
            emitida,
            paid,
            fecha_emision,
            fecha_emision_timestamp,
            fecha_expiracion,
            fecha_expiracion_timestamp,
            vencido,
            total,
            saldo,
            pagado,
            tipo_documento,
            contable,
            desc_tipo_documento,
            item,
            rut,
            proveedor,
            afecto,
            exento,
            neto,
            impuesto
        } = futurePayment;

        totales.neto += parseInt(neto);
        totales.iva += parseInt(impuesto);
        totales.total += parseInt(total);
        totales.saldo += saldo;


        const paidPercentage = calculatePaidPercentage(total,saldo)
        const  remaining = 100 - paidPercentage;

        let color = 'red';
        if(paidPercentage > 40){
            color = '#FFE248';
        }
        if(paidPercentage > 80){
            color = '#10AB5F';
        }

        let percentageBarStyle = "";
        if(paidPercentage === 0){
            percentageBarStyle = `style="background-color:#BCBCC8"`;
        }else{
            percentageBarStyle = `style="background: linear-gradient(to right, ${color} ${paidPercentage}%, #BCBCC8 ${paidPercentage}%);"`;
        }
        let rowHTML = `
        <tr>
            <td>${fecha_emision}</td>
            <td class="expDate">${fecha_expiracion}</td>
            <td>${folio}</td>
            <td>${item}</td>
            <td>${proveedor}</td>
            <td>${getChileanCurrency(parseInt(neto))}</td>
            <td>${getChileanCurrency(parseInt(impuesto))}</td>
            <td>${getChileanCurrency(parseInt(total))}</td>
            <td>${getChileanCurrency(saldo)}</td>
            <td><div class="paidPercentage" ${percentageBarStyle}></div></td>
        </tr>`
        
        tr.innerHTML = rowHTML;
        tbody.appendChild(tr);
    });

    let trFoot = document.createElement('tr');
    let tfootTr = `
        <tr class="headerRow">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="ta-end"><span class="headerRowTitle">Totales</span></td>
            <td>${getChileanCurrency(totales.neto)}</td>
            <td>${getChileanCurrency(totales.iva)}</td>
            <td>${getChileanCurrency(totales.total)}</td>
            <td>${getChileanCurrency(totales.saldo)}</td>
            <td></td>
        </tr>`
    trFoot.innerHTML = tfootTr;
    trFoot.classList.add('headerRow');
    tfoot.appendChild(trFoot);
}

            // <td><p class="paymentStatus ${paidClass}">${isPaid}</p></td>

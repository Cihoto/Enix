

function renderChargesTable(sortFunction, hidePaid = true) {

    if(!activePage.charges){
        return;
    }

    tbody.innerHTML = '';
    thead.innerHTML = '';
    tfoot.innerHTML = '';

    // rmeove all Existing Rows
    $('#bankMovementsTableHorizontal tr').remove();
    tributarieDocumentsTable.classList.add('chargesLayout');
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
            <th>Neto</th>
            <th>IVA</th>
            <th>Total</th>
            <th>Saldo</th>
            <th>Estado</th>
            <th></th>
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
    let movements = [];
        
    if(ascendentFilter){
        movements = futurePayments.sort((a,b) => b.fecha_emision_timestamp - a.fecha_emision_timestamp);

    }else{
        movements = futurePayments.sort((a,b) => a.fecha_emision_timestamp - b.fecha_emision_timestamp);
    }

    movements.forEach((futurePayment) => {
        // ADD ONE MONTH TO FUTURE PAYMENT DATE
        let tr = document.createElement('tr');
        // add custom properties rowId  = futurePayment.id
        tr.setAttribute('rowId',futurePayment.id);
        tr.setAttribute('folio',futurePayment.folio);
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
            <td class="markAsPaid">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" 
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
                    stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-square">
                    <polyline points="9 11 12 14 22 4"></polyline>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
            </td>
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
            <td></td>
        </tr>`
    trFoot.innerHTML = tfootTr;
    trFoot.classList.add('headerRow');
    tfoot.appendChild(trFoot);
}

            // <td><p class="paymentStatus ${paidClass}">${isPaid}</p></td>

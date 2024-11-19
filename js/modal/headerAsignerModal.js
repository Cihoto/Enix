const saveHeadersAssignment = document.getElementById('saveHeadersAssignment');

document.getElementById('closeModal').addEventListener('click', function () {
    document.getElementById('headersAssigmentModal').style.display = 'none';
});

function addExcelRHeaderAssigment(columnData) {
    const tableBody = document.getElementById('headersTable').querySelector('tbody');
    const row = document.createElement('tr');
    row.setAttribute('columnValue', columnData.value);
    const columnCell = document.createElement('td');
    columnCell.textContent = columnData.obligatory ? `${columnData.name} (*)` : columnData.name;
    const assignCell = document.createElement('td');
    const select = createSelect();
    assignCell.appendChild(select);
    row.appendChild(columnCell);
    row.appendChild(assignCell);
    tableBody.appendChild(row);
}

function createSelect() {
    const select = document.createElement('select');
    select.classList.add('header-mod-select');
    select.append(new Option('Seleccionar...', ''));
    const options = headers.headers.map(header => {
        const option = document.createElement('option');
        option.value = header.id;
        option.textContent = header.name;
        return option;
    });
    select.append(...options);
    return select;
}

document.addEventListener('change', function (event) {
    if (event.target.classList.contains('header-mod-select')) {
        const selectedValue = event.target.value;
        const columnKey = event.target.closest('tr').getAttribute('columnValue');
        const selectedColumn = headers.headers.find(({ id }) => id == Number(selectedValue));
        selectedColumn.key = columnKey;
        const allChangedHeaders = new Set(headers.headers.filter(header => header.key !== null).map(header => header.id));
        document.querySelectorAll('.header-mod-select').forEach(select => {
            if (select !== event.target) {
                select.querySelectorAll('option').forEach(option => {
                    if (allChangedHeaders.has(Number(option.value)) || option.value == selectedValue) {
                        option.disabled = true;
                        option.style.backgroundColor = 'lightgray';
                    } else {
                        option.disabled = false;
                        option.style.backgroundColor = 'white';
                    }
                });
            }
        });
    }
});

saveHeadersAssignment.addEventListener('click', async function () {
    const selectedHeaders = headers.headers.filter(header => header.key != null).map(({ key, id, name }) => ({ key, id, name }));
    const noSelectedHeaders = headersTitles[schema_type].filter(header => !selectedHeaders.some(({ key }) => key === header.value));
    const obligatoryHeaders = headersTitles[schema_type].filter(header => header.obligatory);
    const selectedObligatoryHeaders = obligatoryHeaders.filter(header => !selectedHeaders.some(({ key }) => key === header.value));

    if (selectedObligatoryHeaders.length > 0) {
        alert('Por favor seleccione todos los campos obligatorios');
        return;
    }

    const excelData = headers.body.map(row => {
        const newRow = {};
        selectedHeaders.forEach(({ key, id }) => newRow[key] = row[id]);
        noSelectedHeaders.forEach(({ value }) => newRow[value] = "");
        return newRow;
    });

    const newExcelHeaders = Object.keys(excelData[0]);
    const newExcelBody = excelData.map(row => Object.values(row)).filter(row => row.some(value => value !== ""));
    const newExcelData = { newExcelHeaders, newExcelBody, schema_type };


    createBatchMovements(newExcelData,schema_type);
    return 
    const writeNewExcel = await fetch('/controller/ExcelManager/writeNewExcel.php', {
        method: 'POST',
        body: JSON.stringify(newExcelData)
    });
    const response = await writeNewExcel.json();
    document.getElementById('headersAssigmentModal').style.display = 'none';
    Toastify({
        text: response.success ? "Excel file created successfully!" : "Error creating Excel file!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: response.success ? "#4CAF50" : "#f44336",
    }).showToast();
});

async function createBatchMovements(excelData,schema_type){
    if(schema_type === 'bankMovements'){
        bankBatchMovements(excelData);
    }

    if(schema_type === 'tributarieDocuments'){
        tributarieDocumentsBatch(excelData);
    }
}

async function bankBatchMovements(excelData){

    // combine headers and data to preapre the data to be sent to the server
    // using this example data
    /*
        {
            key : value,
        }
            using (folio, amount, date, income, comment, `desc`, bank, account_number, counterparty, rut_counterparty, business_id)
    */ 
    console.log('excelData', excelData);
    const headersKeys = excelData.newExcelHeaders;
    const bankMovements = excelData.newExcelBody.map(movement => {
    
        const movementData = movement.map((data, index) => {
            return [headersKeys[index], data];
        });

        const movementObject = movementData.reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});

        return movementObject;
    });

    console.log('bankMovements', bankMovements);

    const demo = {
        "#": 1,
        "banco": "Banco BCI",
        "cuenta": "63741369",
        "moneda": "CLP",
        "fecha": {
            "date": "2024-01-02 20:59:15.000000",
            "timezone_type": 3,
            "timezone": "Europe/Berlin"
        },
        "sucursal": "",
        "descripcion": "Transferencia enviada a llaira Reyes",
        "folioMovimiento": "",
        "contraparteCartola": "",
        "descripcionCartola": "",
        "Banco Origen Cartola Transf.": "",
        "cargo": 275000,
        "abono": 0,
        "comentario": "HONORARIOS ENIX (josetomas@intec.cl)",
        "tipoMatch": "Sin Match",
        "contraparte": "",
        "nombreContraparte": "",
        "fechaEmision": "",
        "folio": "",
        "montoMatch": "",
        "comentarioMatch": "",
        "fechaMatch": "",
        "matchCreador": ""
    }
    // using (folio, amount, date, income, comment, `desc`, bank, account_number, counterparty, rut_counterparty, business_id)

    console.log('bankMovements', bankMovements);
    const reqBody = bankMovements.map(movement => {
        const {
            folio : folio,
            cargo,
            abono,
            fecha,
            comentario : comment,
            descripcion : desc,
            banco : bank,
            cuenta : account_number,
            contraparte : counterparty,
        } = movement;

        const amount = cargo + abono;
        const income= abono > 0 ? 1 : 0;
        const date = typeof fecha === 'object' ? moment(fecha.date, 'YYYY-MM-DD HH:mm:ss.SSSSSS').format('YYYY-MM-DD') : moment(fecha).format('YYYY-MM-DD')

        return {
            folio,
            amount,
            date,
            income,
            comment,
            desc,
            bank,
            account_number,
            counterparty,
            rut_counterparty: ''
        }
    });
    console.log('reqBody', reqBody);
    // return 
    const response = insertBatchBankMovements(reqBody)

    if(response.success){
        Toastify({
            text: "Batch movements created successfully!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "#4CAF50",
        }).showToast();
    }else{
        Toastify({
            text: "Ha ocurrido un error!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "#f44336",
        }).showToast();
    }
    
}
async function tributarieDocumentsBatch(excelData){
    console.log('excelData', excelData);
    const headersKeys = excelData.newExcelHeaders;
    const tributarieDocument = excelData.newExcelBody.map(movement => {
    
        const movementData = movement.map((data, index) => {
            return [headersKeys[index], data];
        });

        const movementObject = movementData.reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});

        return movementObject;
    });
    console.log('tributarieDocument', tributarieDocument);

    const demo = {
        "FECHA_EMISION": "10-04-2024",
        "TIPO": "Factura Electrónica de Venta",
        "CÓDIGO SII": "33",
        "EMITIDO_RECIBIDO": "RECIBIDO",
        "FOLIO": "48973237",
        "ITEM": "",
        "RAZON_SOCIAL": "Entel PCS Telecomunicaciones S.A.",
        "RUT": "96806980-2",
        "MONTO_EXENTO": 0,
        "MONTO_AFECTO": 72897,
        "MONTO_NETO": 72897,
        "IMPUESTO": 13850,
        "OTROS_IMPUESTOS": 0,
        "TOTAL": 86747,
        "SALDO": 86747,
        "PAGADO": 0,
        "COMENTARIOS": ""
    }
    const reqBody = tributarieDocument.map(movement => {
        const {
            FOLIO: folio,
            TOTAL: total,
            SALDO: balance,
            PAGADO: paid,
            TIPO: type,
            ITEM: item,
            RUT: rut,
            EMITIDO_RECIBIDO: issued_received,
            CÓDIGO_SII: sii_code,
            RAZON_SOCIAL: business_name,
            IMPUESTO: tax,
            MONTO_EXENTO: exempt_amount,
            MONTO_AFECTO: taxable_amount,
            MONTO_NETO: net_amount,
        } = movement;

        return {
            issue_date: moment(movement.FECHA_EMISION, 'DD-MM-YYYY').format('YYYY-MM-DD'),
            expiration_date: moment(movement.FECHA_EMISION, 'DD-MM-YYYY').add(30, 'days').format('YYYY-MM-DD'),
            folio,
            total,
            balance,
            paid,
            type,
            item,
            rut,
            issued_received : issued_received.toLowerCase() == 'emitido' ? 1 : 0,
            business_name,
            tax,
            exempt_amount,
            taxable_amount,
            net_amount,
            is_paid: paid >= total ? 1 : 0
        }
    });

    console.log('reqBody', reqBody);

    const response = await insertBatchTributarieDocuments(reqBody);

    if(response.success){
        Toastify({
            text: "Documentos tributarios ingresados exitosamente!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "#4CAF50",
        }).showToast();
    }else{
        Toastify({
            text: "Ha ocurrido un error!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "#f44336",
        }).showToast();
    }

    console.log('response',response);

}
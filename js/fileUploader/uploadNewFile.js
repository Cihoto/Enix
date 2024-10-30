const headersAssigmentModal = document.getElementById('headersAssigmentModal');
const schemaSelect = document.getElementById('schemaSelect');
const headersTitles = {
    "bankMovements": [
        {
            name: 'Cargo',
            value: "cargo",
            obligatory: true
        },
        {
            name: 'Abono',
            value: "abono",
            obligatory: true
        },
        {
            name: 'Fecha',
            value: "fecha",
            obligatory: true
        },
        {
            name: 'Descripción',
            value: "descripcion",
            obligatory: true
        },
        {
            name: 'Identificador',
            value: "#",
            obligatory: false
        },
        {
            name: 'Banco',
            value: "banco",
            obligatory: false
        },
        {
            name: 'Número de cuenta',
            value: "cuenta",
            obligatory: false
        },
        {
            name: 'Moneda',
            value: "moneda",
            obligatory: false
        },
        {
            name: 'Sucursal',
            value: "sucursal",
            obligatory: false
        },
        {
            name: 'Folio de operación',
            value: "folioMovimiento",
            obligatory: false
        },
        {
            name: 'Contraparte ',
            value: "contraparteCartola",
            obligatory: false
        },
        {
            name: 'Descripción del movimiento',
            value: "descripcionCartola",
            obligatory: false
        },
        {
            name: 'Banco contraparte',
            value: "Banco Origen Cartola Transf.",
            obligatory: false
        },
        {
            name: 'Comentario',
            value: "comentario",
            obligatory: false
        },
        {
            name: 'Tipo de match',
            value: "tipoMatch",
            obligatory: false
        },
        {
            name: 'Rut contraparte',
            value: "contraparte",
            obligatory: false
        },
        {
            name: 'Nombre contraparte',
            value: "nombreContraparte",
            obligatory: false
        },
        {
            name: 'Fecha emisión',
            value: "fechaEmision",
            obligatory: false
        },
        {
            name: 'Folio',
            value: "folio",
            obligatory: false
        },
        {
            name: 'Monto Match',
            value: "montoMatch",
            obligatory: false
        },
        {
            name: 'Comentario match',
            value: "comentarioMatch",
            obligatory: false
        },
        {
            name: 'Fecha match',
            value: "fechaMatch",
            obligatory: false
        },
        {
            name: "creador del match",
            value: "matchCreador",
            obligatory: false
        }
    ],
    "tributarieDocuments": [
        {
            name: 'Fecha de emisión',
            value: "FECHA_EMISION",
            obligatory: true
        },
        {
            name: 'Folio',
            value: "FOLIO",
            obligatory: true
        },
        {
            name: 'Total',
            value: "TOTAL",
            obligatory: true
        },
        {
            name: 'Saldo',
            value: "SALDO",
            obligatory: true
        },
        {
            name: 'Pagado',
            value: "PAGADO",
            obligatory: true
        },
        {
            name: 'Tipo',
            value: "TIPO",
            obligatory: true
        },
        {
            name: 'Item',
            value: "ITEM",
            obligatory: true
        },
        {
            name: 'RUT',
            value: "RUT",
            obligatory: true
        },
        {
            name: 'Emitido/Recibido',
            value: "EMITIDO_RECIBIDO",
            obligatory: true
        },
        {
            name: 'Código SII',
            value: "CÓDIGO SII",
            obligatory: true
        },
        {
            name: 'Razón Social',
            value: "RAZON_SOCIAL",
            obligatory: true
        },
        {
            name: 'Impuesto',
            value: "IMPUESTO",
            obligatory: true
        },
        {
            name: 'Monto Exento',
            value: "MONTO_EXENTO",
            obligatory: true
        },
        {
            name: 'Monto Afecto',
            value: "MONTO_AFECTO",
            obligatory: true
        },
        {
            name: 'Monto Neto',
            value: "MONTO_NETO",
            obligatory: true
        },
        {
            name: 'Otros Impuestos',
            value: "OTROS_IMPUESTOS",
            obligatory: false
        },
        {
            name: 'Comentarios',
            value: "COMENTARIOS",
            obligatory: false
        }
    ]
};
let schemas = [];
let headers = [];
let schema_type;

document.getElementById('bankFile').addEventListener('change', async () => {
    await handleFileChange('bankFile', 'bankMovements');
});

document.getElementById('tributarieFile').addEventListener('change', async () => {
    await handleFileChange('tributarieFile', 'tributarieDocuments');
});

async function handleFileChange(fileInputId, schemaType) {
    const file = document.getElementById(fileInputId).files[0];
    const excelData = await readExcelAndGetData(file);
    if (!excelData) return;

    headers = excelData;
    headersAssigmentModal.style.display = 'block';
    schema_type = schemaType;
    printSchemas();
    updateTableBody(headersTitles[schemaType]);
}

async function readExcelAndGetData(file) {
    const formData = new FormData();
    formData.append('file', file);
    const getHeaders = await fetch('./controller/ExcelManager/readFileAndGetHeaders.php', {
        method: 'POST',
        body: formData
    });
    const headers = await getHeaders.json();

    if (!headers.success) {
        showToast("Archivo no válido o vacío", "#ff5f6d", "#ffc371");
        return;
    }
    return headers;
}

function showToast(message, color1, color2) {
    Toastify({
        text: message,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        background: `linear-gradient(to right, ${color1}, ${color2})`,
    }).showToast();
}

document.getElementById('schemaForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const schemaData = getSchemaData(new FormData(e.target));
    const response = await fetch('./controller/excelHeadersSchema/createNewSchema.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schemaData),
    }).then(res => res.json());

    if (!response.success) {
        alert('Error al crear esquema');
    } else if (response.status === 'success') {
        handleSchemaCreation(schemaData.schema_name);
    }
});

function getSchemaData(formData) {
    const schema = Object.fromEntries(formData.entries());
    return {
        'schema_name': schema.schema_name,
        'headersSchema': headers.headers,
        'schema_type': schema_type
    };
}

function handleSchemaCreation(schemaName) {
    createNewSchemaOption(schemaName);
    pushSchema({ [schemaName]: { data: headers.headers, type: schema_type } });
    showToast("This is a toast", "#00b09b", "#96c93d");
}

async function printSchemas() {
    const allSchemas = await fetch('./controller/excelHeadersSchema/getSch.php',{
        method: 'POST'
    }).then(res => res.json());
    console.log('allSchemas',allSchemas);
    console.log('allSchemas',allSchemas);
    console.log('allSchemas',allSchemas);
    console.log('allSchemas',allSchemas);
    console.log('allSchemas',allSchemas);
    console.log('allSchemas',allSchemas);
    console.log('allSchemas',allSchemas);
    schemaSelect.innerHTML = '';
    schemaSelect.appendChild(createOption('', 'Seleccione un esquema'));

    schemas = allSchemas.filter(schema => schema.schema_type === schema_type).map(schema => {
        createNewSchemaOption(schema.schema_name);
        return { [schema.schema_name]: { data: JSON.parse(schema.schema), type: schema.schema_type } };
    });
}

function createOption(value, text) {
    const option = document.createElement('option');
    option.value = value;
    option.innerText = text;
    return option;
}

function createNewSchemaOption(schemaName) {
    schemaSelect.appendChild(createOption(schemaName, schemaName));
}

schemaSelect.addEventListener('change', () => {
    const schemaName = schemaSelect.value;
    const schema = schemas.find(schema => schema[schemaName]);
    updateTableBody(headersTitles[schema[schemaName].type]);
    setHeaders(schema[schemaName].data);
    selectOptions();
});

function updateTableBody(headers) {
    const tableBody = document.getElementById('headersTable').querySelector('tbody');
    tableBody.innerHTML = '';
    headers.forEach(header => addExcelRHeaderAssigment(header));
}

function setHeaders(schema) {
    headers.headers = schema;
}

function selectOptions() {
    const allChangedHeaders = headers.headers.filter(header => header.key !== null);
    allChangedHeaders.forEach(header => {
        const tr = document.querySelector(`tr[columnvalue="${header.key}"]`);
        if (tr) {
            const select = tr.querySelector('select');
            if (select) {
                select.value = header.id;
            }
        }
    });
    document.querySelectorAll('.header-mod-select').forEach(select => {
        select.querySelectorAll('option').forEach(option => {
            if (allChangedHeaders.map(header => header.id).includes(Number(option.value))) {
                option.disabled = true;
                option.style.backgroundColor = 'lightgray';
            } else {
                option.disabled = false;
                option.style.backgroundColor = 'white';
            }
        });
    });
}


const headersAssigmentModal = document.getElementById('headersAssigmentModal');
const headersTitles = {
    bankMovements : [
        {
            name: 'Cargo',
            value: "cargo",
            obligatory:true
        },
        {
            name: 'Abono',
            value: "abono",
            obligatory:true
        },
        {
            name: 'Fecha',
            value: "fecha",
            obligatory:true
        },
        {
            name: 'Descripción',
            value: "descripcion",
            obligatory:true
        },
        {
            name: 'Identificador',
            value: "#",
            obligatory:false
        },
        {
            name: 'Banco',
            value: "banco",
            obligatory:false
        },
        {
            name: 'Número de cuenta',
            value: "cuenta",
            obligatory:false
        },
        {
            name: 'Moneda',
            value: "moneda",
            obligatory:false
        },
        {
            name: 'Sucursal',
            value: "sucursal",
            obligatory:false
        },
        {
            name: 'Folio de operación',
            value: "folioMovimiento",
            obligatory:false
        },
        {
            name: 'Contraparte ',
            value: "contraparteCartola",
            obligatory:false
        },
        {
            name: 'Descripción del movimiento',
            value: "descripcionCartola",
            obligatory:false
        },
        {
            name: 'Banco contraparte',
            value: "Banco Origen Cartola Transf.",
            obligatory:false
        },
        {
            name: 'Comentario',
            value: "comentario",
            obligatory:false
        },
        {
            name: 'Tipo de match',
            value: "tipoMatch",
            obligatory:false
        },
        {
            name: 'Rut contraparte',
            value: "contraparte",
            obligatory:false
        },
        {
            name: 'Nombre contraparte',
            value: "nombreContraparte",
            obligatory:false
        },
        {
            name: 'Fecha emisión',
            value: "fechaEmision",
            obligatory:false
        },
        {
            name: 'Folio',
            value: "folio",
            obligatory:false
        },
        {
            name: 'Monto Match',
            value: "montoMatch",
            obligatory:false
        },
        {
            name: 'Comentario match',
            value: "comentarioMatch",
            obligatory:false
        },
        {
            name: 'Fecha match',
            value: "fechaMatch",
            obligatory:false
        },
        {
            name: "creador del match",
            value: "matchCreador",
            obligatory:false
        }
    ]
}

let headers = [];
document.getElementById('bankFile').addEventListener('change', async function(){
    return
    // get file 
    let file = document.getElementById('bankFile').files[0];
    // create form data
    let formData = new FormData();
    // append file to form data
    formData.append('file', file);
    // fetch

    const getHeaders = await fetch ('./controller/ExcelManager/readFileAndGetHeaders.php', {
        method: 'POST',
        body: formData
    });
    headers = await getHeaders.json();
    console.log(headers);
    document.getElementById('headersAssigmentModal').style.display = 'block';

    // create headers rows in modal 

    headersTitles.bankMovements.forEach((header, index) => {
        addExcelRHeaderAssigment(header)
    })
    
    


});

function openAssigmnetModal(){
   
}
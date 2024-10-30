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

    const writeNewExcel = await fetch('/controller/ExcelManager/writeNewExcel.php', {
        method: 'POST',
        body: JSON.stringify(newExcelData)
    });
    const response = await writeNewExcel.json();

    Toastify({
        text: response.success ? "Excel file created successfully!" : "Error creating Excel file!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: response.success ? "#4CAF50" : "#f44336",
    }).showToast();
});
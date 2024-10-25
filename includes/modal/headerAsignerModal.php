<style>
    #headersAssigmentModal {
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background-color: rgba(0, 0, 0, 0.5);
    }

    .modal-content {
        background-color: #fefefe;
        margin: 20px auto;
        padding: 20px;
        border: 1px solid #888;
        width: 80%;
        max-width: 600px;
        min-height: fit-content;
        max-height: calc(100% - 80px);
        border-radius: 10px;
        overflow: hidden;
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #ddd;
        padding-bottom: 10px;
    }
    
    .modal-header h2 {
        margin: 0;
    }

    .closeModal {
        background: none;
        border: none;
        font-size: 1.5em;
        cursor: pointer;
    }

    .modal-body {
        margin-top: 20px;
        display: flex;
        width: 100%;
    }

    .modal-body-content-header p {
        font-weight: bold;
    }

    .modal-body-content{
        width: 100%;
    }
    .modal-body-content-body{
        display: flex;
        max-height: 60%;
        overflow: scroll;
    }

    #headersTable {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
    }

    #headersTable th, #headersTable td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }

    #headersTable th {
        background-color: #f2f2f2;
    }

    .modal-body-content-footer {
        text-align: right;
        margin-top: 20px;
    }

    #saveHeadersAssignment {
        background-color: #4CAF50;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    #saveHeadersAssignment:hover {
        background-color: #45a049;
    }
</style>
<div id="headersAssigmentModal">
    <div class="modal-content">
        <div class="modal-header">
            <h2>Asignación de columnas</h2>
            <button id="closeModal" class="closeModal">X</button>
        </div>
        <div class="modal-body">
            <div class="modal-body-content">
                <div class="modal-body-content-header">
                    <p>Columnas del archivo</p>
                </div>
                <div class="modal-body-content-body">
                    <table id="headersTable">
                        <thead>
                            <tr>
                                <th>Columna Tipo</th>
                                <th>Asignar a</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Rows will be dynamically added here -->
                        </tbody>
                    </table>
                </div>
                <div class="modal-body-content-footer">
                    <button id="saveHeadersAssignment">Guardar</button>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    const saveHeadersAssignment = document.getElementById('saveHeadersAssignment');
    document.getElementById('closeModal').addEventListener('click', function() {
        document.getElementById('headersAssigmentModal').style.display = 'none';
    });

    document.getElementById('saveHeadersAssignment').addEventListener('click', function() {
        // Logic to save the headers assignment
        alert('Headers assignment saved!');
    });

    // Example function to dynamically add rows to the table
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

    function createSelect(){
        const select = document.createElement('select');
        select.classList.add('header-mod-select');
        select.append(new Option('Seleccionar...', ''));
        // Add options to the select element
        console.log("headers",headers);
        const options = headers.headers.map(header => {
            const option = document.createElement('option');
            option.value = header.id;
            option.textContent = header.name;
            return option;
        });
        select.append(...options);
        return select;
    }

    document.addEventListener('change', function(event) {
        if (event.target.classList.contains('header-mod-select')) {
            const selectedValue = event.target.value;
            const selects = document.querySelectorAll('.header-mod-select');
            selects.forEach(select => {
                if (select !== event.target) {
                    const options = select.querySelectorAll('option');
                    options.forEach(option => {
                        if (option.value === selectedValue) {
                            option.disabled = true;
                        } else {
                            option.disabled = false;
                        }
                    });
                }
            });

            // Logic to save the selected value
            console.log('Selected value:', selectedValue);
            const columnKey = event.target.closest('tr').getAttribute('columnValue');
            console.log('Column key:', columnKey);

            const selectedColumn = headers.headers.find(({id}) => {
                console.log("ID: ",id);
                return id == Number(selectedValue)  
            });
            console.log('Selected column:', selectedColumn);
            selectedColumn.key = columnKey;
        }
    });

    saveHeadersAssignment.addEventListener('click', function() {
        const selectedHeaders = headers.headers.map(header => {
            const {key,id} = header;
            if(key != null) {
                return {
                    key,
                    id,
                    name: header.name
                }
            }
        }).filter((header) => header !== undefined);
        // const noSelectedHeaders = headers.headers.filter(header => header.key === null);
       
        const noSelectedHeaders = headersTitles.bankMovements.filter(header => {
            return selectedHeaders.find(({key}) => key === header.value) === undefined;
        });

        console.log('NO SELECTED HEADERS:', noSelectedHeaders);


        console.log('SELECTED HEADERS:', selectedHeaders);

        const excelData = headers.body.map(row => {
            const newRow = {};
            for (let i = 0; i < selectedHeaders.length; i++) {
                newRow[selectedHeaders[i].key] = row[selectedHeaders[i].id];
            }
            for (let i= 0; i < noSelectedHeaders.length; i++) {
                newRow[noSelectedHeaders[i].value] = "";
            }
            return newRow;
        });
        // WRITE excelData oin new excel using php function 
        console.log('EXCEL DATA:', excelData);
        console.log('HEADERS:', headers.headers);
        console.log('BODY:', headers.body);
        const newExcelHeaders = Object.keys(excelData[0]);
        const newExcelBody = excelData.map(row => Object.values(row));
        const newExcelFileName = 'newExcel.xlsx';
        const newExcelData = {
            newExcelHeaders,
            newExcelBody,
            newExcelFileName
        };
        console.log('DATA:', newExcelData);
        fetch('/controller/ExcelManager/writeNewExcel.php', {
            method: 'POST',
            body: JSON.stringify(newExcelData)
        })
    });




</script>
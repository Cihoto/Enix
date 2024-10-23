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
        const select = createSelect(headers);
        assignCell.appendChild(select);
        row.appendChild(columnCell);
        row.appendChild(assignCell);
        tableBody.appendChild(row);
    }   
    function createSelect(headers){
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
        }
    });


</script>
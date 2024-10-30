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
                <form id="schemaForm">
                    <input type="text" name="schema_name" id="schema_name">
                    <input type="submit" value="Guardar">
                </form>
                <select id="schemaSelect">
                    
                </select>
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
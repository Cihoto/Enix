<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enix - Empresas</title>
</head>
<body>
    <form action="create_business.php" method="post">
        <label for="rut">RUT:</label>
        <input type="text" id="rut" name="rut" required><br><br>
        
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" name="nombre" required><br><br>
        
        <label for="banco">Banco:</label>
        <select id="banco" name="banco" required>
            <option value="banco1">Banco 1</option>
            <option value="banco2">Banco 2</option>
            <option value="banco3">Banco 3</option>
        </select><br><br>

        <label for="numero_cuenta">Número de Cuenta:</label>
        <input type="text" id="numero_cuenta" name="numero_cuenta" required><br><br>
        
        <input type="submit" value="Crear Empresa">
    </form>
</body>
</html>
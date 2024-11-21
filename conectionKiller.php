<?php


// public function __construct() {
//     $this->servidor = 'srv994.hstgr.io';
//     $this->usuario = 'u136839350_EnixAdm';
//     $this->password = 'Enix2024.';
//     // $this->password = 'Intec2023.';
//     $this->database = 'u136839350_EnixProd';
//     $this->port ='3306';
// }

$servername = "srv994.hstgr.io";
$username = "u136839350_EnixAdm";
$password = "Enix2024.";
$dbname = "u136839350_EnixProd";

$conn = new mysqli($servername, $username, $password);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SHOW PROCESSLIST";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        if ($row['db'] == $dbname && $row['Command'] == 'Sleep') {
            $killSql = "KILL " . $row['Id'];
            $conn->query($killSql);
        }
    }
}

$conn->close();

echo "algo";

?>
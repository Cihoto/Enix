
<?php
require_once $_SERVER['DOCUMENT_ROOT'].'/vendor/autoload.php';
use Box\Spout\Reader\Common\Creator\ReaderEntityFactory;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
    $filePath = $_FILES['file']['tmp_name'];
    
    $reader = ReaderEntityFactory::createXLSXReader();
    $reader->open($filePath);

    $headers = [];
    foreach ($reader->getSheetIterator() as $sheet) {
        foreach ($sheet->getRowIterator() as $key => $row) {

            $cells = $row->getCells();
            $headers = array_map(fn($cell,$index) => 
                [
                    "id" => $index,
                    "name" => $cell->getValue(),
                    "key" => ""
                ], $cells, array_keys($cells)
            );
            // echo json_encode($headers);
            break; // Only read the first row
        }
        break; // Only read the first sheet
    }

    $reader->close();
    echo json_encode(['headers' => $headers]);
} else {
    echo json_encode(['error' => 'Invalid request',"method"=>$_SERVER['REQUEST_METHOD'], "files"=>$_FILES['file']]);
}



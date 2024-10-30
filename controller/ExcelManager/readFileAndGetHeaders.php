
<?php
require_once $_SERVER['DOCUMENT_ROOT'].'/vendor/autoload.php';
use Box\Spout\Reader\Common\Creator\ReaderEntityFactory;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
    $filePath = $_FILES['file']['tmp_name'];
    
    $reader = ReaderEntityFactory::createXLSXReader();
    $reader->open($filePath);

    $headers = [];
    $body = [];
    foreach ($reader->getSheetIterator() as $sheet) {
        foreach ($sheet->getRowIterator() as $key => $row) {
            $cells = $row->getCells();
            if($key === 1){
                $headers = array_map(fn($cell,$index) => 
                    [
                        "id" => $index,
                        "name" => $cell->getValue() ,
                        "key" => null
                    ], $cells, array_keys($cells)
                );
            }else{
                // echo $key;
                // echo "<br>";    
                // echo "<br>";    
                // echo json_encode($cells);
                // echo "<br>";
                // echo "<br>";
                // for($i = 0; $i < count($cells); $i++){
                //     echo $cells[$i]->getValue();
                //     echo "<br>";
                //     echo $headers[$i]["name"];
                //     echo "<br>";
                // }
                $body[] = array_map(fn($cell,) => 
                $cell->getValue()
                , $cells);
                // echo "<br>";
                // echo "<br>";
                // // echo json_encode($cells);
                // echo "<br>";
                // echo "<br>";
                // $body[] = array_map(fn($cell,$header) => [
                //     "header" => $header["name"],
                //     "value" => $cell->getValue()? $cell->getValue() : $header["name"]."_".$header["id"],
                // ], $cells,$headers);
                // break; // Only read the first row
            }

            // echo json_encode($headers);
        }
        break; // Only read the first sheet
    }

    if(count($body) === 0 ){
        echo json_encode(['success'=>false,'message' => 'No data found in the file']);
        exit();
    }

    $reader->close();
    echo json_encode(['success'=>true,'headers' => $headers,"body"=>$body,"header0"=>$headers[0]]);
} else {
    echo json_encode(['success'=>false,'error' => 'Invalid request',"method"=>$_SERVER['REQUEST_METHOD'], "files"=>$_FILES['file']]);
}



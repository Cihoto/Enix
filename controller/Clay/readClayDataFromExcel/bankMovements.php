<?php
require_once __DIR__ . '/../../../vendor/autoload.php';
use Box\Spout\Reader\Common\Creator\ReaderEntityFactory;
$path = 'C:\Users\CoteL\Desktop\masivas finanzas Enix\Movimientos Bancarios\BancariosIntec2024-01-01-09-23.xlsx';
// $path = 'C:\Users\CoteL\Desktop\masivas finanzas Enix\Movimientos Bancarios\BancariosCaboDeHornos.xlsx';

# open the file
$reader = ReaderEntityFactory::createXLSXReader();
$reader->open($path);
$data = [
    "headers"=>[],
    "bodyRows"=>[]
];

# read each cell of each row of each sheet
foreach ($reader->getSheetIterator() as $sheetIndex=>$sheet) {
    foreach ($sheet->getRowIterator() as $rowIndex => $row) {
        $newRow = [];
        $newObj = new stdClass();
        foreach ($row->getCells() as $cellIndex => $cell) {
            if ($rowIndex == "1" && $sheetIndex == 1) {
                $newRow[] = $cell->getValue();
            }else{
                $newObj->{$data["headers"][$cellIndex]} = $cell->getValue();
            }
        }
        if ($rowIndex == "1" && $sheetIndex == 1) {
            $data["headers"] = $newRow;
        } else { 
            $data["bodyRows"][] = $newObj;
        }
    }
}
$reader->close();
echo json_encode($data);
?>
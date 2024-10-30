<?php 

require_once $_SERVER['DOCUMENT_ROOT'].'/controller/ExcelManager/ExcelManager.php';
require_once $_SERVER['DOCUMENT_ROOT'].'/vendor/autoload.php';

use Box\Spout\Common\Entity\Style\CellAlignment;
use Box\Spout\Writer\Common\Creator\WriterEntityFactory;
use Box\Spout\Writer\Common\Creator\Style\StyleBuilder;

if ($_SERVER['REQUEST_METHOD'] === "POST") {
    $data = json_decode(file_get_contents("php://input"));
    $headers = $data->newExcelHeaders;
    $bodyRows = $data->newExcelBody;
    $schema_type = $data->schema_type;

    $excelManager = new ExcelManager($schema_type);
    $writer = WriterEntityFactory::createXLSXWriter();
    $folder_type = $schema_type === "bankMovements" ? "bank_movements" : ($schema_type === "tributarieDocuments" ? "tributarie_documents" : null);
    if (!$folder_type) {
        echo json_encode(["success" => false, "error" => "Invalid schema type"]);
        exit();
    }

    $fileName = $schema_type === "bankMovements" ? $excelManager->getBankMovementFileName() : $excelManager->getTributarieDocumentsFileName();
    $path = $_SERVER['DOCUMENT_ROOT']."/BS_FILES/".$folder_type."/".$fileName;

    if (!file_exists(dirname($path))) {
        mkdir(dirname($path), 0777, true);
    }

    $writer->openToFile($path);

    $headerStyle = (new StyleBuilder())
        ->setFontBold()
        ->setFontSize(12)
        ->setFontColor('FFFFFF')
        ->setBackgroundColor('4F81BD')
        ->setShouldWrapText(false)
        ->setCellAlignment(CellAlignment::CENTER)
        ->build();

    $cellRowStyle = (new StyleBuilder())
        ->setFontSize(12)
        ->setShouldWrapText(false)
        ->build();

    $writer->addRow(WriterEntityFactory::createRowFromArray($headers, $headerStyle));

    $rows = array_map(function($bRow) use ($cellRowStyle) {
        return WriterEntityFactory::createRow(array_map(function($cell) use ($cellRowStyle) {
            if (is_object($cell) && isset($cell->date)) {
                $cell = (new DateTime($cell->date))->format('Y-m-d');
            }
            return WriterEntityFactory::createCell($cell ?? "", $cellRowStyle);
        }, $bRow));
    }, $bodyRows);

    $writer->addRows($rows);
    $writer->close();

    echo json_encode(["success" => true, "message" => "Excel file created successfully"]);
}
?>

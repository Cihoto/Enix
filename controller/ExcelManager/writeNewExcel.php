<?php 
    require_once $_SERVER['DOCUMENT_ROOT'].'/vendor/autoload.php';
    use Box\Spout\Writer\Common\Creator\WriterEntityFactory;
    if($_SERVER['REQUEST_METHOD'] === "POST"){
        $data = json_decode(file_get_contents("php://input"));
        $headers = $data->newExcelHeaders;
        $body = $data->newExcelBody;
        $fileName = $data->newExcelFileName;
        
        $writer = WriterEntityFactory::createXLSXWriter();
        $writer->openToFile($_SERVER['DOCUMENT_ROOT'].'/BS_FILES/bank_movements/'.$fileName);
        
        $headerRow = WriterEntityFactory::createRowFromArray($headers);
        $writer->addRow($headerRow);
        
        foreach($body as $row){
            $bodyRow = WriterEntityFactory::createRowFromArray($row);
            $writer->addRow($bodyRow);
        }
        
        $writer->close();
    }
?>
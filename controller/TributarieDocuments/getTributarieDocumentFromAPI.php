<?php
    require_once $_SERVER['DOCUMENT_ROOT'].'/vendor/autoload.php';
    use Ramsey\Uuid\Uuid;
    header("Content-Type: application/json; charset=UTF-8");
    if($_SERVER['REQUEST_METHOD'] == 'GET'){
        require_once $_SERVER['DOCUMENT_ROOT'].'/controller/TributarieDocuments/TributarieDocuments.php';
        require_once $_SERVER['DOCUMENT_ROOT'].'/controller/Business/Bussiness.php';
        

        $dateFrom = '2024-01-01';

        $tributarieDocuments = new TributarieDocuments();
        $business = new Business();
        $businessId = $business->getDatabaseBusinessId();
        // echo json_encode($businessId);
        // exit();
        $business_rut_data = $business->getBusiness_Rut_DV();
        // $docProd_BHE = $tributarieDocuments->getDocumentoProductoBHE($business_rut, $dateFrom);
        $docProd_BHE = $tributarieDocuments->getBHE($business_rut_data['rut'], $business_rut_data['dv'] , $dateFrom);

        // echo json_encode($docProd_BHE);
        // exit();

        $tributarieDocuments = $tributarieDocuments->getTributarieDocuments_API($business_rut_data['rut'],$dateFrom);
        
        // echo json_encode($tributarieDocuments);
        // exit();

        $merged = array_merge($docProd_BHE, $tributarieDocuments);
        

        
        // $insoluto = array_filter($merged, function($item) {
        //     return $item['saldo'] > 0;
        // });
        // echo json_encode($mmermerm);
        // exit();
        

        // echo json_encode($merged);
        // exit();


        $insertionData = prepareArrayForDb($merged);

        // $paid = array_filter($insertionData, function($item) {
        //     return $item['paid'] > 0 && $item['is_paid'] == 0;
        // });
        // echo json_encode($paid);
        // exit();
        $insertionQuery = tributarieDocumentBatchInsert($insertionData, $businessId);

        echo json_encode($insertionQuery);


    }else{
        echo json_encode(['success'=>false,'message' => 'Método no permitido']);
    }



    function prepareArrayForDb($array){
        $preparedArray = array_map(function ($item) {
            return [
                'issue_date' => $item['fecha_emision'],
                'expiration_date' => $item['fecha_expiracion'],
                'folio' => $item['folio'],
                'total' => (int)$item['total'],
                'balance' => (int)$item['saldo'],
                'paid' => (int)$item['pagado'],
                'type' => $item['desc_tipo_documento'],
                'item' => $item['item'],
                'rut' => $item['rut'],
                'issued_received' => $item['emitida'],
                'business_name' => $item['proveedor'],
                'tax' => $item['impuesto'],
                'exempt_amount' => $item['exento'],
                'taxable_amount' => $item['afecto'],
                'net_amount' => $item['neto'],
                'is_paid' => $item['paid'] == true ? 1 : 0
            ];
        }, $array);
    
        return $preparedArray;
    }

    function tributarieDocumentBatchInsert($array, $businessId){

        $conn = new bd();
        $conn->conectar();
    
        $query = "INSERT INTO `tributarie_document`(`id`, `issue_date`, `expiration_date`, `folio`, `total`, `balance`, `paid`, `type`, `item`, `rut`, `issued`, `sii_code`, `business_name`, `tax`, `exempt_amount`, `taxable_amount`, `net_amount`, `business_id`, `cancelled`, `is_paid`) VALUES";
    
        $values = array_map(function($item) use ($businessId) {
            $uuid = Uuid::uuid4();
            $issued_received = $item['issued_received'] ? 1 : 0;
    
            //format from d-m-Y to Y-m-d 
            $item['issue_date'] = date('Y-m-d', strtotime($item['issue_date']));
            $item['expiration_date'] = date('Y-m-d', strtotime($item['expiration_date'])); 
    
            return "('$uuid', '$item[issue_date]', '$item[expiration_date]', '$item[folio]', $item[total], $item[balance], $item[paid], '$item[type]', '$item[item]', '$item[rut]', $issued_received, 0, '$item[business_name]', $item[tax], $item[exempt_amount], $item[taxable_amount], $item[net_amount], $businessId, 0, $item[is_paid])";
        }, $array);
    
        $query .= implode(',', $values);
    
        $deleteQuery = "DELETE FROM tributarie_document WHERE business_id = $businessId";
        $stmtDelete = mysqli_prepare($conn->mysqli, $deleteQuery);
        mysqli_stmt_execute($stmtDelete);
    
        $stmt = mysqli_prepare($conn->mysqli, $query);
        mysqli_stmt_execute($stmt);
    
        // get affectedRows 
        $affectedRows = mysqli_stmt_affected_rows($stmt);
    
        $conn->desconectar();
        return ['success' => true, 'message' => 'Documentos tributarios insertados correctamente', 'affectedRows' => $affectedRows];
     
    }
?>
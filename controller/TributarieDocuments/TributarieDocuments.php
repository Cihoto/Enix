<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/controller/database/bd.php';
require_once $_SERVER['DOCUMENT_ROOT'].'/vendor/autoload.php';
class TributarieDocuments
{
    public $id;
    public $issue_date;
    public $expiration_date;
    public $folio;
    public $total;
    public $balance;
    public $paid;
    public $type;
    public $item;
    public $rut;
    public $issued_received;
    public $sii_code;
    public $business_name;
    public $tax;
    public $exempt_amount;
    public $taxable_amount;
    public $net_amount;
    public $business_id;
    public $cancelled;
    public $is_paid;

    public function __construct(
        $id = null,
        $issue_date = null,
        $expiration_date = null,
        $folio = null,
        $total = null,
        $balance = null,
        $paid = null,
        $type = null,
        $item = null,
        $rut = null,
        $issued_received = null,
        $sii_code = null,
        $business_name = null,
        $tax = null,
        $exempt_amount = null,
        $taxable_amount = null,
        $net_amount = null,
        $business_id = null,
        $cancelled = null,
        $is_paid = null
    ) {
        $this->id = $id;
        $this->issue_date = $issue_date;
        $this->expiration_date = $expiration_date;
        $this->folio = $folio;
        $this->total = $total;
        $this->balance = $balance;
        $this->paid = $paid;
        $this->type = $type;
        $this->item = $item;
        $this->rut = $rut;
        $this->issued_received = $issued_received;
        $this->sii_code = $sii_code;
        $this->business_name = $business_name;
        $this->tax = $tax;
        $this->exempt_amount = $exempt_amount;
        $this->taxable_amount = $taxable_amount;
        $this->net_amount = $net_amount;
        $this->business_id = $business_id;
        $this->cancelled = $cancelled;
        $this->is_paid = $is_paid;
    }

    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        $this->id = $id;
    }

    public function getIssueDate()
    {
        return $this->issue_date;
    }

    public function setIssueDate($issue_date)
    {
        $this->issue_date = $issue_date;
    }

    public function getExpirationDate()
    {
        return $this->expiration_date;
    }

    public function setExpirationDate($expiration_date)
    {
        $this->expiration_date = $expiration_date;
    }

    public function getFolio()
    {
        return $this->folio;
    }

    public function setFolio($folio)
    {
        $this->folio = $folio;
    }

    public function getTotal()
    {
        return $this->total;
    }

    public function setTotal($total)
    {
        $this->total = $total;
    }

    public function getBalance()
    {
        return $this->balance;
    }

    public function setBalance($balance)
    {
        $this->balance = $balance;
    }

    public function getPaid()
    {
        return $this->paid;
    }

    public function setPaid($paid)
    {
        $this->paid = $paid;
    }

    public function getType()
    {
        return $this->type;
    }

    public function setType($type)
    {
        $this->type = $type;
    }

    public function getItem()
    {
        return $this->item;
    }

    public function setItem($item)
    {
        $this->item = $item;
    }

    public function getRut()
    {
        return $this->rut;
    }

    public function setRut($rut)
    {
        $this->rut = $rut;
    }

    public function getIssuedReceived()
    {
        return $this->issued_received;
    }

    public function setIssuedReceived($issued_received)
    {
        $this->issued_received = $issued_received;
    }

    public function getSiiCode()
    {
        return $this->sii_code;
    }

    public function setSiiCode($sii_code)
    {
        $this->sii_code = $sii_code;
    }

    public function getBusinessName()
    {
        return $this->business_name;
    }

    public function setBusinessName($business_name) {}

    public function getTax()
    {
        return $this->tax;
    }

    public function setTax($tax)
    {
        $this->tax = $tax;
    }

    public function getExemptAmount()
    {
        return $this->exempt_amount;
    }

    public function setExemptAmount($exempt_amount)
    {
        $this->exempt_amount = $exempt_amount;
    }

    public function getTaxableAmount()
    {
        return $this->taxable_amount;
    }

    public function setTaxableAmount($taxable_amount)
    {
        $this->taxable_amount = $taxable_amount;
    }

    public function getNetAmount()
    {
        return $this->net_amount;
    }

    public function setNetAmount($net_amount)
    {
        $this->net_amount = $net_amount;
    }

    public function getBusinessId()
    {
        return $this->business_id;
    }

    public function setBusinessId($business_id)
    {
        $this->business_id = $business_id;
    }

    public function getCancelled()
    {
        return $this->cancelled;
    }

    public function setCancelled($cancelled)
    {
        $this->cancelled = $cancelled;
    }

    public function getIsPaid()
    {
        return $this->is_paid;
    }

    public function setIsPaid($is_paid)
    {
        $this->is_paid = $is_paid;
    }

    public function insertBatchTributarieDocuments($tributarieDocuments)
    {

        // return $this->business_id;

        // return ["success" => false, "message" => "Error creating bank movements"];
        $conn = new bd();
        $conn->conectar();

        $query = "INSERT INTO `tributarie_document`(`id`, `issue_date`, `expiration_date`, `folio`, `total`, `balance`, `paid`, `type`, `item`, `rut`, `issued`, `business_name`, `tax`, `exempt_amount`, `taxable_amount`, `net_amount`, `is_paid`, `business_id`) VALUES";
        $values = [];
        $types = '';

        foreach ($tributarieDocuments as $tributarie) {
            $values[] = "(?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $types .= 'sssiiiisssissiiiii';
        }
        $query .= implode(', ', $values);
        $stmt = mysqli_prepare($conn->mysqli, $query);
        $params = [];

        foreach ($tributarieDocuments as $tributarie) {

            $id = \Ramsey\Uuid\Uuid::uuid4();
            $tributarie = array_merge(['id' => $id], $tributarie);
            $tributarie = array_merge($tributarie, ['business_id' => $this->business_id]);
            $params = array_merge($params, array_values($tributarie));
        }

        // return $params;?

        mysqli_stmt_bind_param($stmt, $types, ...$params);
        mysqli_stmt_execute($stmt);

        if ($stmt->affected_rows === 0) {
            $stmt->close();
            $conn->desconectar();
            return ["success" => false, "message" => "Error creating tributarie documents"];
        }

        $stmt->close();
        $conn->desconectar();
        return ["success" => true, "message" => "Batch tributarie documents created successfully"];
    }

    function getTributarieDocuments(){
        try {
            $conn = new bd();
            $conn->conectar();
            $query = "SELECT * FROM tributarie_document WHERE business_id = ?";
            $stmt = mysqli_prepare($conn->mysqli, $query);
            mysqli_stmt_bind_param($stmt, 's', $this->business_id);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            $tributarieDocuments = [];
            while ($row = mysqli_fetch_assoc($result)) {
                $tributarieDocuments[] = $row;
            }
            $stmt->close();
            $conn->desconectar();
            return ["success" => true, "message" => "Tributarie documents found", "data" => $tributarieDocuments];
        } catch (\Throwable $th) {
            return ["success" => false, "message" => "Error finding tributarie documents"];
        }
    }


    function deleteTributarieDocument(){
        try {
            $conn = new bd();
            $conn->conectar();
            $query = "DELETE FROM tributarie_document WHERE business_id = ?";
            $stmt = mysqli_prepare($conn->mysqli, $query);
            mysqli_stmt_bind_param($stmt, 'i', $this->business_id);
            mysqli_stmt_execute($stmt);
            $stmt->close();
            $conn->desconectar();
            return ["success" => true, "message" => "Tributarie document deleted"];
        } catch (\Throwable $th) {
            return ["success" => false, "message" => "Error deleting tributarie document"];
        }
    }


    function TESTDELETE(){
        try {
            $conn = new bd();
            $conn->conectar();
            $query = "DELETE FROM tributarie_document WHERE business_id = 1";
            $stmt = mysqli_prepare($conn->mysqli, $query);
            mysqli_stmt_bind_param($stmt, 'i', $this->business_id);
            mysqli_stmt_execute($stmt);
            $stmt->close();
            $conn->desconectar();
            return ["success" => true, "message" => "Tributarie document deleted"];
        } catch (\Throwable $th) {
            return ["success" => false, "message" => "Error deleting tributarie document"];
        }
    }

    function markAsPaid(){

        return ["success" => false, "message" => "PREVIUS CONTROLED ERROR"];

        try {
            $conn = new bd();
            $conn->conectar();

            $query = "UPDATE tributarie_document SET is_paid = 1 WHERE id = ? AND business_id = ?";
            $stmt = mysqli_prepare($conn->mysqli, $query);
            mysqli_stmt_bind_param($stmt, 'ss', $this->id,$this->business_id);
            mysqli_stmt_execute($stmt);
        
            $stmt->close();
            $conn->desconectar();
            return ["success" => true, "message" => "Tributarie documents marked as paid"];
        } catch (Error $e) {
            return ["success" => false, "message" => "Error marking tributarie documents as paid"];
        }
    }

    function insertModifiedDocument($document){
        // example of $document
        // {
        //     "id": "d7fe9983-7744-427f-ad94-0521943db36f",
        //     "folio": 95,
        //     "emitida": false,
        //     "paid": false,
        //     "fecha_emision": "02-05-2024",
        //     "fecha_emision_timestamp": "1707102000",
        //     "fecha_expiracion": "02-06-2024",
        //     "fecha_expiracion_timestamp": "1707188400",
        //     "atrasado": false,
        //     "vencido": true,
        //     "afecto": 50000,
        //     "exento": 0,
        //     "neto": 50000,
        //     "impuesto": 7971,
        //     "total": 50000,
        //     "saldo": 50000,
        //     "pagado": 0,
        //     "tipo_documento": "bhe",
        //     "contable": true,
        //     "desc_tipo_documento": "Boleta de Honorarios",
        //     "item": "MONTAJE BUNKER MODIFICACION 29/04/24",
        //     "proveedor": "OXALC CHRISTHIAN CESAR AUGUSTO",
        //     "rut": "23911107-6",
        //     "vencida_por": 191
        // }

        // INSERT QUERY EXAMPLE

        // INSERT INTO u136839350_EnixProd.modified_tributarie_documents (id, issue_date, expiration_date, folio, total, balance, paid, `type`, item, rut, issued, sii_code, business_name, tax, exempt_amount, taxable_amount, net_amount, business_id, cancelled, is_paid) VALUES('', '', NULL, 0, 0, 0, 0, '', '', '', '', '', '', 0, 0, 0, 0, 0, 0, 0);
        $conn = new bd();

        try{
            $conn->conectar();
            
            // Check if the document with the given id already exists
            $checkQuery = "SELECT id FROM modified_tributarie_documents WHERE folio = ?  AND total = ? AND rut = ?";
            $checkStmt = mysqli_prepare($conn->mysqli, $checkQuery);
            mysqli_stmt_bind_param($checkStmt, 'sis', $document['folio'],$document['total'], $document['rut']);
            mysqli_stmt_execute($checkStmt);
            mysqli_stmt_store_result($checkStmt);

            if (mysqli_stmt_num_rows($checkStmt) > 0) {
                // If the document exists, update the existing row
                $query = "UPDATE modified_tributarie_documents SET issue_date = ?, expiration_date = ?, folio = ?, total = ?, balance = ?, paid = ?, `type` = ?, item = ?, rut = ?, issued = ?, sii_code = ?, business_name = ?, tax = ?, exempt_amount = ?, taxable_amount = ?, net_amount = ?, business_id = ?, cancelled = ?, is_paid = ? WHERE folio = ?  AND total = ? AND rut = ?";
                $stmt = mysqli_prepare($conn->mysqli, $query);
                mysqli_stmt_bind_param($stmt, 'sssiiiisssissiiiiiisis', $issue_date, $expiration_date, $folio, $total, $balance, $paid, $type, $item, $rut, $issued, $sii_code, $business_name, $tax, $exempt_amount, $taxable_amount, $net_amount, $business_id, $cancelled, $is_paid, $document['folio'],$document['total'], $document['rut']);
            } else {
                // If the document does not exist, insert a new row
                $query = "INSERT INTO modified_tributarie_documents (id, issue_date, expiration_date, folio, total, balance, paid, `type`, item, rut, issued, sii_code, business_name, tax, exempt_amount, taxable_amount, net_amount, business_id, cancelled, is_paid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                $stmt = mysqli_prepare($conn->mysqli, $query);
                mysqli_stmt_bind_param($stmt, 'sssiiiisssissiiiiiii', $document['id'], $issue_date, $expiration_date, $folio, $total, $balance, $paid, $type, $item, $rut, $issued, $sii_code, $business_name, $tax, $exempt_amount, $taxable_amount, $net_amount, $business_id, $cancelled, $is_paid);
            }

            $id = $document['id'];
            $issue_date = date('Y-m-d', strtotime($document['fecha_emision']));
            $expiration_date = date('Y-m-d', strtotime($document['fecha_expiracion']));
            $folio = $document['folio'];
            $total = $document['total'];
            $balance = $document['saldo'];
            $paid = $document['pagado'];
            $type = $document['tipo_documento'];
            $item = $document['item'];
            $rut = $document['rut'];
            $issued = $document['emitida'];
            $sii_code = 1; // Assuming sii_code is not provided in the document
            $business_name = $document['proveedor'];
            $tax = $document['impuesto'];
            $exempt_amount = $document['exento'];
            $taxable_amount = $document['afecto'];
            $net_amount = $document['neto'];
            $business_id = $this->business_id;
            $cancelled = 0; // Assuming cancelled is not provided in the document
            $is_paid = $document['paid'] == true ? 1 : 0;

            mysqli_stmt_execute($stmt);

            if ($stmt->affected_rows === 0) {
                $stmt->close();
                $conn->desconectar();
                return ["success" => false, "message" => "Error inserting or updating modified document"];
            }

            $stmt->close();
            $conn->desconectar();
            return ["success" => true, "message" => "Modified document inserted or updated successfully"];
        }catch(Error $e){
            return ["success" => false, "message" => "Error inserting modified document","e"=>$e->getMessage()];
        }

    }

    function updateExpirationDate($id, $expirationDate){
        try {
            $conn = new bd();
            $conn->conectar();

            $query = "UPDATE tributarie_document SET expiration_date = ? WHERE id = ? AND business_id = ?";
            $stmt = mysqli_prepare($conn->mysqli, $query);
            mysqli_stmt_bind_param($stmt, 'sss', $expirationDate, $id, $this->business_id);
            mysqli_stmt_execute($stmt);
        
            $stmt->close();
            $conn->desconectar();
            return ["success" => true, "message" => "Expiration date updated"];
        } catch (\Throwable $th) {
            return ["success" => false, "message" => "Error updating expiration date"];
        }
    }


    public function getDocumentoProductoBHE($business_rut,$dateFrom){

        $url = "https://api.clay.cl/v1/obligaciones/documentos_productos/?rut_empresa=$business_rut&fecha_desde=$dateFrom&initialize_until=true&limit=200&offset=0";
    
        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'GET',
            CURLOPT_HTTPHEADER => array(
                'accept: application/json',
                'Token: 9NVElUwIrrQPXFU0VSVD9zfeP5i2PWAbrONlc0lQM-0TfHj0a6AQ2wbI-eg01mTj_ZnZLV6q4d2hLU86AXntfY'
            ),
        ));
        $curl_response = curl_exec($curl);
        $totalRecords = 0;
        $totalLoop = 0;
        if (isset(json_decode($curl_response, true)['data']['records'])) {
            // echo "No hay datos";
            $totalRecords = json_decode($curl_response, true)['data']['records']['total_records'];
            $totalLoop = ceil($totalRecords / 200);
            // PUSH CLAY API TO LOCAL RESPONSE 
            $response = json_decode($curl_response, true);
        } else {
            return ["success" => false, "message" => "No data found"];
            exit();
        }
        for ($i = 1; $i < $totalLoop; $i++) {
            $offset = $i * 200;
            $url = "https://api.clay.cl/v1/obligaciones/documentos_productos/?rut_empresa=$business_rut&fecha_desde=$dateFrom&initialize_until=true&limit=200&offset=$offset";
            $curl = curl_init();
            curl_setopt_array($curl, array(
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'GET',
                CURLOPT_HTTPHEADER => array(
                    'accept: application/json',
                    'Token: 9NVElUwIrrQPXFU0VSVD9zfeP5i2PWAbrONlc0lQM-0TfHj0a6AQ2wbI-eg01mTj_ZnZLV6q4d2hLU86AXntfY'
                ),
            ));
            $curl_response = curl_exec($curl);
            // echo json_encode(json_decode($curl_response, true)['data']['items']);
            if (!isset(json_decode($curl_response, true)['data']['items'])) {
                // echo "No hay datos";
                break;
            }
            $newItems = json_decode($curl_response, true)['data']['items'];
            // ['data']['items'];
            $response['data']['items'] = array_merge($response['data']['items'], $newItems);
            curl_close($curl);
        }

        // get all boletas de honorarios electronicas from docProd
        $filtered_bhe = array_filter($response['data']['items'], function($doc) {
            return $doc['tipo'] === 'Boleta de Honorarios';
        });

        // $filtered_bhe = array_values($filtered_bhe);
        // return $filtered_bhe;
    
        $BHEProduct = $this->mapBHEDocumentoProducto($filtered_bhe);
        return $BHEProduct;
    }
    public function getBHE($business_rut,$dv,$dateFrom){

        $url = "https://api.clay.cl/v1/obligaciones/boletas_honorarios/?rut_receptor=$business_rut&dv_receptor=$dv&fecha_desde=$dateFrom&initialize_until=true&limit=200&offset=0";
    
        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'GET',
            CURLOPT_HTTPHEADER => array(
                'accept: application/json',
                'Token: 9NVElUwIrrQPXFU0VSVD9zfeP5i2PWAbrONlc0lQM-0TfHj0a6AQ2wbI-eg01mTj_ZnZLV6q4d2hLU86AXntfY'
            ),
        ));
        $curl_response = curl_exec($curl);
        $totalRecords = 0;
        $totalLoop = 0;
        if (isset(json_decode($curl_response, true)['data']['records'])) {
            // echo "No hay datos";
            $totalRecords = json_decode($curl_response, true)['data']['records']['total_records'];
            $totalLoop = ceil($totalRecords / 200);
            // PUSH CLAY API TO LOCAL RESPONSE 
            $response = json_decode($curl_response, true);
        } else {
            return ["success" => false, "message" => "No data found"];
            exit();
        }
        for ($i = 1; $i < $totalLoop; $i++) {
            $offset = $i * 200;
            $url = "https://api.clay.cl/v1/obligaciones/boletas_honorarios/?rut_receptor=$business_rut&dv_receptor=$dv&fecha_desde=$dateFrom&initialize_until=true&limit=200&offset=$offset";
            $curl = curl_init();
            curl_setopt_array($curl, array(
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'GET',
                CURLOPT_HTTPHEADER => array(
                    'accept: application/json',
                    'Token: 9NVElUwIrrQPXFU0VSVD9zfeP5i2PWAbrONlc0lQM-0TfHj0a6AQ2wbI-eg01mTj_ZnZLV6q4d2hLU86AXntfY'
                ),
            ));
            $curl_response = curl_exec($curl);
            // echo json_encode(json_decode($curl_response, true)['data']['items']);
            if (!isset(json_decode($curl_response, true)['data']['items'])) {
                // echo "No hay datos";
                break;
            }
            $newItems = json_decode($curl_response, true)['data']['items'];
            // ['data']['items'];
            $response['data']['items'] = array_merge($response['data']['items'], $newItems);
            curl_close($curl);
        }

    
        // $BHEProduct = $this->mapBHEDocumentoProducto($response['data']['items']);
        return $this->mapBHE($response['data']['items']);
    }





    private function mapBHEDocumentoProducto($docProd){

        $processedData = array_values($docProd);
        
        $mappedDocumentoProducto = array_map(function ($movement) {
    
            $DOCUMENT_TYPES = [
                [
                    'name' => 'Factura Electrónica de Venta',
                    'type' => 'factura',
                    'contable' => true
                ],
                [
                    'name' => 'Factura de Venta',
                    'type' => 'factura',
                    'contable' => true
                ],
                [
                    'name' => 'Factura Electrónica Exenta',
                    'type' => 'factura',
                    'contable' => true
                ],
                [
                    'name' => 'Factura Exenta',
                    'type' => 'factura',
                    'contable' => true
                ],
                [
                    'name' => "Retención Boleta Honorarios",
                    'type' => "R_bhe",
                    'contable' => false
                ],
                [
                    'name' => "Boleta de Honorarios",
                    'type' => "bhe",
                    'contable' => true
                ],
                [
                    'name' => "Boleta de Venta Electrónica",
                    'type' => "bev",
                    'contable' => true
                ],
                [
                    'name' => "Boleta de Venta",
                    'type' => "bev",
                    'contable' => true
                ],
                [
                    'name' => "Comprobante de Pago Electrónico",
                    'type' => "bev",
                    'contable' => true
                ],
                [
                    'name' => "Guía de Despacho Electrónica",
                    'type' => "despacho",
                    'contable' => false
                ],
                [
                    'name' => "Guía de Despacho",
                    'type' => "despacho",
                    'contable' => false
                ],
                [
                    'name' => "Nota de Crédito Electrónica",
                    'type' => "nota",
                    'contable' => true
                ],
                [
                    'name' => "Nota de Débito Electrónica",
                    'type' => "notaD",
                    'contable' => true
                ],
                [
                    'name' => "Nota de Crédito",
                    'type' => "nota",
                    'contable' => true
                ],
                [
                    'name' => "Retención Boleta Honorarios de Terceros",
                    'type' => "R_bhe",
                    'contable' => false
                ],
                [
                    'name' => "Retención Boleta de Servicios de Terceros",
                    'type' => "R_bhe",
                    'contable' => false
                ],
                [
                    'name' => "Boleta de Servicios de Terceros",
                    'type' => "boleta",
                    'contable' => true
                ],
            ];
            $numero = $movement['numero'];
            $tipo = $movement['tipo'];
            $fecha_emision = $movement['fecha_emision'];
            $fecha_humana_emision = $movement['fecha_humana_emision'];
            $recibida = $movement['recibida'];
            $issued = $recibida ? false : true;
            $pagado = $movement['pagado'];
            $total = $movement['total'];
            $emisor = $movement['emisor'];
            $receptor = $movement['receptor'];
            $descripcion = $movement['producto'];
    
    
    
            $expirationDate = date('d-m-Y', strtotime($fecha_humana_emision . ' +1 month'));
    
            $diffOnDaysFromEmission = (new DateTime())->diff(new DateTime("@$fecha_emision"))->days;
            $atrasado = !$pagado && $diffOnDaysFromEmission >= 30 && $diffOnDaysFromEmission <= 60;
            $outdated = !$pagado && $diffOnDaysFromEmission > 60;
    
            $documentType = array_filter($DOCUMENT_TYPES, function ($docType) use ($tipo, $DOCUMENT_TYPES) {
                return $docType['name'] === $tipo;
            });
            $documentType = reset($documentType);
    
            $itemDescription = $descripcion != null ? str_replace("<br/>", ' ', $descripcion['name']) : 'No description';
            
            $provider = $recibida ? $emisor['razon_social'] : $receptor['razon_social'];
            $provider_rut = $recibida ? $emisor['rut'] . '-' . $emisor['dv'] : $receptor['rut'] . '-' . $receptor['dv'];
    
            return [
                'folio' => $numero,
                'emitida' => $issued,
                'paid' => $pagado,
                'fecha_emision' => date('d-m-Y', strtotime($fecha_humana_emision)),
                'fecha_emision_timestamp' => $fecha_emision,
                'fecha_expiracion' => $expirationDate,
                'fecha_expiracion_timestamp' => strtotime($expirationDate),
                'atrasado' => $atrasado,
                'vencido' => $outdated,
                'afecto' => $total['neto'],
                'exento' => $total['exento'],
                'neto' => $total['neto'],
                'impuesto' => $total['impuesto'],
                'total' => $total['total'],
                'saldo' => 0,
                'pagado' => 0,
                'tipo_documento' => $documentType['type'],
                'contable' => $documentType['contable'],
                'desc_tipo_documento' => $documentType['name'],
                'item' => trim($itemDescription),
                'proveedor' => $provider,
                'rut' => $provider_rut,
                'vencida_por' => $diffOnDaysFromEmission
            ];
        }, $processedData);

    
        return $mappedDocumentoProducto;
    }

    private function mapBHE($docProd){

        $processedData = array_values($docProd);
        
        $mappedDocumentoProducto = array_map(function ($movement) {
    
            $DOCUMENT_TYPES = [
                [
                    'name' => 'Factura Electrónica de Venta',
                    'type' => 'factura',
                    'contable' => true
                ],
                [
                    'name' => 'Factura de Venta',
                    'type' => 'factura',
                    'contable' => true
                ],
                [
                    'name' => 'Factura Electrónica Exenta',
                    'type' => 'factura',
                    'contable' => true
                ],
                [
                    'name' => 'Factura Exenta',
                    'type' => 'factura',
                    'contable' => true
                ],
                [
                    'name' => "Retención Boleta Honorarios",
                    'type' => "R_bhe",
                    'contable' => false
                ],
                [
                    'name' => "Boleta de Honorarios",
                    'type' => "bhe",
                    'contable' => true
                ],
                [
                    'name' => "Boleta de Venta Electrónica",
                    'type' => "bev",
                    'contable' => true
                ],
                [
                    'name' => "Boleta de Venta",
                    'type' => "bev",
                    'contable' => true
                ],
                [
                    'name' => "Comprobante de Pago Electrónico",
                    'type' => "bev",
                    'contable' => true
                ],
                [
                    'name' => "Guía de Despacho Electrónica",
                    'type' => "despacho",
                    'contable' => false
                ],
                [
                    'name' => "Guía de Despacho",
                    'type' => "despacho",
                    'contable' => false
                ],
                [
                    'name' => "Nota de Crédito Electrónica",
                    'type' => "nota",
                    'contable' => true
                ],
                [
                    'name' => "Nota de Débito Electrónica",
                    'type' => "notaD",
                    'contable' => true
                ],
                [
                    'name' => "Nota de Crédito",
                    'type' => "nota",
                    'contable' => true
                ],
                [
                    'name' => "Retención Boleta Honorarios de Terceros",
                    'type' => "R_bhe",
                    'contable' => false
                ],
                [
                    'name' => "Retención Boleta de Servicios de Terceros",
                    'type' => "R_bhe",
                    'contable' => false
                ],
                [
                    'name' => "Boleta de Servicios de Terceros",
                    'type' => "boleta",
                    'contable' => true
                ],
            ];
            $numero = $movement['numero'];
            $tipo = $movement['tipo'];
            $fecha_emision = $movement['fecha'];
            $fecha_humana_emision = $movement['fecha_humana'];
            $recibida = true;
            $issued = $recibida ? false : true;
            $pagado = $movement['pagada'];
            $total = $movement['total'];
            $emisor = $movement['emisor'];
            $receptor = $movement['receptor'];
            $descripcion = $movement['descripcion'];

            
            if (isset($movement['status']) && strtolower($movement['status']) == "nula") {
                // echo "Documento nulo: "  . $numero;
                // echo "<br>";
                return null;
            }
    
            $expirationDate = date('d-m-Y', strtotime($fecha_humana_emision . ' +1 month'));
    
            $diffOnDaysFromEmission = (new DateTime())->diff(new DateTime("@$fecha_emision"))->days;
            $atrasado = !$pagado && $diffOnDaysFromEmission >= 30 && $diffOnDaysFromEmission <= 60;
            $outdated = !$pagado && $diffOnDaysFromEmission > 60;
    
            $documentType = array_filter($DOCUMENT_TYPES, function ($docType) use ($tipo, $DOCUMENT_TYPES) {
                return $docType['name'] === $tipo;
            });
            $documentType = reset($documentType);
    
            $itemDescription = $descripcion != null ? str_replace("<br/>", ' ', $descripcion) : 'No description';
            
            $provider = $recibida ? $emisor['razon_social'] : $receptor['razon_social'];
            $provider_rut = $recibida ? $emisor['rut'] . '-' . $emisor['dv'] : $receptor['rut'] . '-' . $receptor['dv'];
            // print_r($total);
            return [
                'folio' => $numero,
                'emitida' => $issued,
                'paid' => $pagado,
                'fecha_emision' => date('d-m-Y', strtotime($fecha_humana_emision)),
                'fecha_emision_timestamp' => $fecha_emision,
                'fecha_expiracion' => $expirationDate,
                'fecha_expiracion_timestamp' => strtotime($expirationDate),
                'atrasado' => $atrasado,
                'vencido' => $outdated,
                'afecto' => $total['total_honorario'] + $total['impuesto'],
                'exento' => $total['total_honorario'],
                'neto' =>  $total['total_honorario'] + $total['impuesto'],
                'impuesto' => $total['impuesto'],
                'total' => $total['total_honorario'],
                'saldo' => $total['total_honorario'],
                'pagado' => 0,
                'tipo_documento' => $documentType['type'],
                'contable' => $documentType['contable'],
                'desc_tipo_documento' => $documentType['name'],
                'item' => trim($itemDescription),
                'proveedor' => $provider,
                'rut' => $provider_rut,
                'vencida_por' => $diffOnDaysFromEmission
            ];
        }, $processedData);

        // get array values 
        $mappedDocumentoProducto = array_values($mappedDocumentoProducto);


        // remove null values from mapped boject 
        $mappedDocumentoProducto = array_filter($mappedDocumentoProducto, function($doc) {
            return $doc != null;
        });

    
        return $mappedDocumentoProducto;
    }

    function getModifiedDocuments(){

        $conn = new bd();

        try{
            $conn->conectar();
            $query = "SELECT * FROM modified_tributarie_documents WHERE business_id = ?";
            $stmt = mysqli_prepare($conn->mysqli, $query);
            mysqli_stmt_bind_param($stmt, 'i', $this->business_id);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            $modifiedDocuments = [];
            while ($row = mysqli_fetch_assoc($result)) {
                $modifiedDocuments[] = $row;
            }
            $stmt->close();
            $conn->desconectar();
            return ["success" => true, "message" => "Modified documents found", "data" => $modifiedDocuments];
        }catch(Error $e){
            return ["success" => false, "message" => "Error finding modified documents","e"=>$e->getMessage()];

        }
    }

    function getTributarieDocuments_API($busId, $initDate){

    $url = "https://api.clay.cl/v1/obligaciones/documentos_tributarios/?guia_despacho=false&rut_empresa=$busId&fecha_desde=$initDate&initialize_until=true&limit=200&offset=0";

    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'GET',
        CURLOPT_HTTPHEADER => array(
            'accept: application/json',
            'Token: 9NVElUwIrrQPXFU0VSVD9zfeP5i2PWAbrONlc0lQM-0TfHj0a6AQ2wbI-eg01mTj_ZnZLV6q4d2hLU86AXntfY'
        ),
    ));
    $curl_response = curl_exec($curl);
    $totalRecords = 0;
    $totalLoop = 0;
    if (isset(json_decode($curl_response, true)['data']['records'])) {
        // echo "No hay datos";
        $totalRecords = json_decode($curl_response, true)['data']['records']['total_records'];
        $totalLoop = ceil($totalRecords / 200);
        // PUSH CLAY API TO LOCAL RESPONSE 
        $response = json_decode($curl_response, true);
    } else {
        echo "No hay datos";
        exit();
    }
    for ($i = 1; $i < $totalLoop; $i++) {
        $offset = $i * 200;
        $url = "https://api.clay.cl/v1/obligaciones/documentos_tributarios/?guia_despacho=false&rut_empresa=$busId&fecha_desde=$initDate&initialize_until=true&offset=$offset";
        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'GET',
            CURLOPT_HTTPHEADER => array(
                'accept: application/json',
                'Token: 9NVElUwIrrQPXFU0VSVD9zfeP5i2PWAbrONlc0lQM-0TfHj0a6AQ2wbI-eg01mTj_ZnZLV6q4d2hLU86AXntfY'
            ),
        ));
        $curl_response = curl_exec($curl);
        // echo json_encode(json_decode($curl_response, true)['data']['items']);
        if (!isset(json_decode($curl_response, true)['data']['items'])) {
            // echo "No hay datos";
            break;
        }
        $newItems = json_decode($curl_response, true)['data']['items'];
        // ['data']['items'];
        $response['data']['items'] = array_merge($response['data']['items'], $newItems);
        curl_close($curl);
    }
    // return  $response['data']['items'];
    $tributarieDocuments = $this->mapTributarieDocuments($response['data']['items']);
    return $tributarieDocuments;
    // exit();
}

private function mapTributarieDocuments($tributarieDocs_items)
{

    $contable = 0;
    $rejectedBills = 0;
    $anuladas = [];
    $mappedTributarieDocs = array_reduce($tributarieDocs_items, function ($acc, $item) use (&$contable, &$rejectedBills, &$anuladas) {
        $DOCUMENT_TYPES = [
            [
                'name' => 'Factura Electrónica de Venta',
                'type' => 'factura',
                'contable' => true
            ],
            [
                'name' => 'Factura de Venta',
                'type' => 'factura',
                'contable' => true
            ],
            [
                'name' => 'Factura Electrónica Exenta',
                'type' => 'factura',
                'contable' => true
            ],
            [
                'name' => 'Factura Exenta',
                'type' => 'factura',
                'contable' => true
            ],
            [
                'name' => "Retención Boleta Honorarios",
                'type' => "R_bhe",
                'contable' => false
            ],
            [
                'name' => "Boleta de Honorarios",
                'type' => "bhe",
                'contable' => true
            ],
            [
                'name' => "Boleta de Venta Electrónica",
                'type' => "bev",
                'contable' => true
            ],
            [
                'name' => "Boleta de Venta",
                'type' => "bev",
                'contable' => true
            ],
            [
                'name' => "Comprobante de Pago Electrónico",
                'type' => "bev",
                'contable' => true
            ],
            [
                'name' => "Guía de Despacho Electrónica",
                'type' => "despacho",
                'contable' => false
            ],
            [
                'name' => "Guía de Despacho",
                'type' => "despacho",
                'contable' => false
            ],
            [
                'name' => "Nota de Crédito Electrónica",
                'type' => "nota",
                'contable' => true
            ],
            [
                'name' => "Nota de Débito Electrónica",
                'type' => "notaD",
                'contable' => true
            ],
            [
                'name' => "Nota de Crédito",
                'type' => "nota",
                'contable' => true
            ],
            [
                'name' => "Retención Boleta Honorarios de Terceros",
                'type' => "R_bhe",
                'contable' => false
            ],
            [
                'name' => "Retención Boleta de Servicios de Terceros",
                'type' => "R_bhe",
                'contable' => false
            ],
            [
                'name' => "Boleta de Servicios de Terceros",
                'type' => "boleta",
                'contable' => true
            ],
        ];

        $numero = $item['numero'];
        $tipo = $item['tipo'];
        $fecha_emision = $item['fecha_emision'];
        $fecha_humana_emision = $item['fecha_humana_emision'];
        $saldo = $item['saldo_insoluto'];
        $pagado = $item['pagado'];
        $recibida = $item['recibida'];
        $total = $item['total'];
        $descripcion = $item['descripcion'];
        $emisor = $item['emisor'];
        $receptor = $item['receptor'];
        $doc_relacionados = $item['doc_relacionados'];
        $recepcion = $item['recepcion'];

        if (isset($recepcion['estado']) && $recepcion['estado'] === "R") {
            $rejectedBills++;
            return $acc;
        }

        if (isset($doc_relacionados) && array_reduce($doc_relacionados, function ($carry, $doc) use ($total, $doc_relacionados) {
            return $carry || ($doc['tipo_doc'] === 'Nota de Crédito' && array_reduce($doc_relacionados, function ($sum, $doc) {
                return $sum + $doc['monto_vinculado'];
            }, 0) === $total['total']);
        }, false)) {
            $anuladas[] = $item;
            return $acc;
        }

        $documentType = array_filter($DOCUMENT_TYPES, function ($docType) use ($tipo) {
            return $docType['name'] === $tipo;
        });
        $documentType = reset($documentType);

        if (!$documentType || $documentType['type'] === 'bhe' || $documentType['type'] === 'R_bhe') {
            return $acc;
        }

        $provider = $recibida ? $emisor['razon_social'] : $receptor['razon_social'];
        $provider_rut = $recibida ? $emisor['rut'] . '-' . $emisor['dv'] : $receptor['rut'] . '-' . $receptor['dv'];
        if ($documentType['contable']) {
            $contable++;
        }

        $issued = !$recibida;
        $expirationDate = date('d-m-Y', strtotime($fecha_humana_emision . ' +1 month'));
        $diffOnDaysFromEmission = (new DateTime())->diff(new DateTime("@$fecha_emision"))->days;
        $atrasado = !$pagado && $diffOnDaysFromEmission >= 30 && $diffOnDaysFromEmission <= 60;
        $outdated = !$pagado && $diffOnDaysFromEmission > 60;
        // $saldo = $saldo_insoluto ?? (!$pagado ? $total['total'] : 0);
        $itemDescription = $descripcion != null ? str_replace("<br/>", ' ', $descripcion[0]['descripcion']) : 'No description';
        
        $saldo_insoluto = $saldo == null ? $total['total'] : $item['saldo_insoluto'];
        $abonado = $total['total'] - $saldo_insoluto;

        $acc[] = [
            'folio' => $numero,
            'emitida' => $issued,
            'paid' => $pagado,
            'fecha_emision' => date('d-m-Y', strtotime($fecha_humana_emision)),
            'fecha_emision_timestamp' => $fecha_emision,
            'fecha_expiracion' => $expirationDate,
            'fecha_expiracion_timestamp' => strtotime($expirationDate),
            'atrasado' => $atrasado,
            'vencido' => $outdated,
            'afecto' => $total['neto'],
            'exento' => $total['exento'],
            'neto' => $total['neto'],
            'impuesto' => $total['impuesto'],
            'total' => $total['total'],
            'saldo' => $saldo_insoluto,
            'pagado' => $abonado,
            'tipo_documento' => $documentType['type'],
            'contable' => $documentType['contable'],
            'desc_tipo_documento' => $documentType['name'],
            'item' => trim($itemDescription),
            'proveedor' => $provider,
            'rut' => $provider_rut,
            'vencida_por' => $diffOnDaysFromEmission
        ];

        return $acc;
    }, []);

    return $mappedTributarieDocs;
}

}

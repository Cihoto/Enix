<?php 
    header('Content-Type: application/json; charset=utf-8');

    $conn = new db();
    $conn->conectar();
    echo json_encode(['success'=>true,'message' => 'Conexión exitosa']);
    try{

        $sql = "SELECT b.id, b.rut, bk.account_number FROM business b 
        INNER JOIN bank_account bk ON bk.business_id = b.id;";

        $result = $conn->mysqli->query($sql);

        // iterate over all business
        while($business = $result->fetch_assoc()){

            print_r($business); 

            $business_rut = $business['rut'];
            $business_id = $business['id'];
            $account_number = $business['account_number'];

            $today = date('Y-m-d',strtotime("-1 days"));
            $financial_status = getUnpaidDocumentsOnDate($business_rut,'2024-01-01',$today);
            $bankBalance = getBankBalance($account_number, $business_rut, $today,$today);
            $avit = $bankBalance + $financial_status['total'];
            $financial_status['bankBalance'] = $bankBalance;
            $financial_status['avit'] = $avit;
            
            // save all data in database
            // in table financial_status
            // prepare and bind query

            $query = "INSERT INTO `financial_status`(`issued`, `received`, `total`, `date`, `bank_balance`, `avit`, `business_id`) VALUES (?,?,?,?,?,?,?)";
            $stmt = $conn->mysqli->prepare($query);
            $stmt->bind_param("iiisiii", $financial_status['issued'], $financial_status['received'], $financial_status['total'], $financial_status['date'], $financial_status['bankBalance'], $financial_status['avit'], $business_id);
            $stmt->execute();
            $stmt->close();

        }

        $conn->desconectar();

    }catch(Exception $e){
        echo json_encode(['success'=>false,'message' => $e->getMessage()]);
        $conn->desconectar();
        exit();
    }

    exit();

    function getUnpaidDocumentsOnDate($business_rut,$dateFrom,$dateTo){
        
    
        $url = "https://api.clay.cl/v1/obligaciones/documentos_tributarios/?pagada=false&guia_despacho=false&rut_empresa=$business_rut&fecha_desde=$dateFrom&initialize_until=true&limit=200&offset=0";
    
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
            // $url = "https://api.clay.cl/v1/obligaciones/boletas_honorarios/?rut_receptor=$business_rut&dv_receptor=$dv&fecha_desde=$dateFrom&initialize_until=true&limit=200&offset=$offset";
            $url = "https://api.clay.cl/v1/obligaciones/documentos_tributarios/?pagada=false&guia_despacho=false&rut_empresa=$business_rut&fecha_desde=$dateFrom&initialize_until=true&limit=200&offset=$offset";

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

        $addIssuedAndReceived = addIssuedAndReceived($response['data']['items']);

       return $addIssuedAndReceived;
    }

    function addIssuedAndReceived($data){
        
        $issued = 0;
        $received = 0;

        foreach ($data as $key => $value) {
            if($value['recibida']){
                $received += $value['saldo_insoluto'] == null ? 0 : $value['saldo_insoluto'];
            }else{
                $issued += $value['saldo_insoluto'] == null ? 0 : $value['saldo_insoluto'];
            }
        };

        $yesterday = date('Y-m-d',strtotime("-1 days"));
        return [
            'issued' => $issued,
            'received' => $received,
            'total' => $issued - $received,
            'date' => $yesterday
        ];
    }

    function getBankBalance($account_number, $business_rut, $dateFrom,$dateTo){

        $url = "https://api.clay.cl/v1/cuentas_bancarias/saldos/?numero_cuenta=$account_number&rut_empresa=$business_rut&limit=200&offset=0&fecha_desde=$dateFrom&fecha_hasta=$dateTo&initialize_until=true";
        
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
        $response = json_decode($curl_response, true);
        $balance = $response['data']['items'][0]['saldo_disponible'];
        // $balance = $response['data']['items'];

        return $balance;
    }


    class db{
        protected $servidor;
        protected $usuario;
        protected $password;
        protected $database;
        protected $port;
        public $mysqli;

        public function __construct() {
            $this->servidor = 'srv994.hstgr.io';
            $this->usuario = 'u136839350_EnixAdm';
            $this->password = 'Enix2024.';
            // $this->password = 'Intec2023.';
            $this->database = 'u136839350_EnixProd';
            $this->port ='3306';
        }
    
        public function conectar() {
            $this->mysqli = new mysqli($this->servidor, $this->usuario, $this->password, $this->database, $this->port);
            if (mysqli_connect_errno()) {
                echo 'Error en base de datos: '. mysqli_connect_error();
                exit();
            }
            $this->mysqli->set_charset("utf8");
            $this->mysqli->query("SET NAMES 'utf8'");
            $this->mysqli->query("SET CHARACTER SET utf8");
        }
    
        public function desconectar() {
            mysqli_close($this->mysqli);
        }
    }
?>
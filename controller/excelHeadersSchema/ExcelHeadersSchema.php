<?php 
    require_once $_SERVER['DOCUMENT_ROOT'].'/controller/database/bd.php';
    class ExcelHeadersSchema{
        public $schema_name, $schema,$schema_type, $business_id;

        public function __construct($schema_name = null, $schema = null,$schema_type = null, $business_id = null) {
            $this->schema_name = $schema_name;
            $this->schema = $schema;
            $this->schema_type = $schema_type;
            $this->business_id = $business_id;
        }

        public function getSchemaName() {
            return $this->schema_name;
        }

        public function setSchemaName($schema_name) {
            $this->schema_name = $schema_name;
        }

        public function getSchema() {
            return $this->schema;
        }

        public function setSchema($schema) {
            $this->schema = $schema;
        }

        public function getSchemaType() {
            return $this->schema_type;
        }

        public function setSchemaType($schema_type) {
            $this->schema_type = $schema_type;
        }

        public function getBusinessId() {
            return $this->business_id;
        }

        public function setBusinessId($business_id) {
            $this->business_id = $business_id;
        }

        public function newSchema(){
            $conn = new bd();
            $conn->conectar();
            
            $query = mysqli_prepare($conn->mysqli,"INSERT INTO excel_headers_schema (schema_name, `schema`,schema_type, business_id) VALUES (?, ?, ?, ?)");
            $query->bind_param("sssi", $this->schema_name, $this->schema,$this->schema_type, $this->business_id);

           

            if ($query->execute()) {
                $conn->desconectar();
                return true;
            } else {
                $conn->desconectar();
                return false;
            }
        }

        public function getSchemas(){
            $conn = new bd();
            $conn->conectar();
            $query = mysqli_prepare($conn->mysqli, "SELECT * FROM excel_headers_schema WHERE business_id = ?");
            $query->bind_param("i", $this->business_id);
            $query->execute();
            $result = $query->get_result();
            $rows = [];
            while($row = mysqli_fetch_assoc($result)){
                $rows[] = $row;
            }
            $conn->desconectar();
            return $rows;
        }
    }
?>
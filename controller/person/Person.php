<?php
    require_once '../database/bd.php';
    require_once '../Business/Bussiness.php';
    class Person extends Business{
        private $name;
        private $lastName;
        private $businessId;
        private $userId;
        private $rut;
        private $dv;

        public function __construct($name, $lastName, $businessId, $userId, $rut, $dv) {
            $this->name = $name;
            $this->lastName = $lastName;
            $this->businessId = $businessId;
            $this->userId = $userId;
            $this->rut = $rut;
            $this->dv = $dv;
        }
        
        // getter and setter for every property
        public function getName() {
            return $this->name;
        }

        public function setName($name) {
            $this->name = $name;
        }

        public function getLastName() {
            return $this->lastName;
        }

        public function setLastName($lastName) {
            $this->lastName = $lastName;
        }

        public function getbusinessId() {
            return $this->businessId;
        }

        public function setbusinessId($businessId) {
            $this->businessId = $businessId;
        }

        public function getUserId() {
            return $this->userId;
        }

        public function setUserId($userId) {
            $this->userId = $userId;
        }

        public function getRut() {
            return $this->rut;
        }

        public function setRut($rut) {
            $this->rut = $rut;
        }

        public function getDv() {
            return $this->dv;
        }

        public function setDv($dv) {
            $this->dv = $dv;
        }

        // Get the person data
        

        public function setPerson(){
            $conn = new bd();
            $conn->conectar();
            $query = mysqli_prepare($conn->mysqli, "SELECT p.*, u.superAdmin from person p 
            INNER JOIN user u on u.id = p.user_id 
            WHERE p.business_id = ? AND p.user_id = ?;");

            // legacy QUERY
                // $query = mysqli_prepare($conn->mysqli, "SELECT * from person WHERE business_id = ? AND user_id = ?");
            // legacy QUERY

            mysqli_stmt_bind_param($query, 'ii', $this->businessId, $this->userId);
            mysqli_stmt_execute($query);
            $result = mysqli_stmt_get_result($query);
            $row = mysqli_fetch_assoc($result);
            $conn->desconectar();
            // return [$busId,$this->userId];
            if($row){
                $this->setName($row['name']);
                $this->setLastName($row['last_name']);
                $this->setRut($row['rut']);
                $this->setDv($row['dv']);
                return true;
            }else{
                return false;
            }
        }
    }
?>
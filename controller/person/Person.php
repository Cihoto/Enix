<?php
    require_once '../database/bd.php';
    require_once '../Business/Bussiness.php';
    class Person extends Business{
        private $name;
        private $lastName;
        private $bussinessId;
        private $userId;
        private $rut;
        private $dv;

        public function __construct($name, $lastName, $bussinessId, $userId, $rut, $dv) {
            $this->name = $name;
            $this->lastName = $lastName;
            $this->bussinessId = $bussinessId;
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

        public function getBussinessId() {
            return $this->bussinessId;
        }

        public function setBussinessId($bussinessId) {
            $this->bussinessId = $bussinessId;
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
        

        public function setPerson(){
            $conn = new bd();
            $conn->conectar();
            $query = mysqli_prepare($conn->mysqli, "SELECT * FROM person WHERE business_id = ? AND user_id = ?");
            mysqli_stmt_bind_param($query, 'ii', $this->bussinessId, $this->userId);
            mysqli_stmt_execute($query);
            $result = mysqli_stmt_get_result($query);
            $row = mysqli_fetch_assoc($result);
            $conn->desconectar();
            if($row){

                $this->setName($row['name']);
                $this->setLastName($row['last_name']);
                $this->setRut($row['rut']);
                $this->setDv($row['dv']);
                $this->setBussinessId($row['business_id']);
                $this->setUserId($row['user_id']);


                return true;
            }else{
                return false;
            }
        }
    }
?>
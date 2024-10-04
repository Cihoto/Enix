<?php
require_once '../database/bd.php';

class Business { 
    private $businessId,
    $businessRut,
    $businessDv,
    $businessName,
    $businessBankAccountId;


    public function __construct($businessId, $businessRut, $businessDv, $businessName, $businessBankAccountId) {
        $this->businessId = $businessId;
        $this->businessRut = $businessRut;
        $this->businessDv = $businessDv;
        $this->businessName = $businessName;
        $this->businessBankAccountId = $businessBankAccountId;
    }

    public function getBusinessId() {
        return $this->businessId;
    }

    public function setBusinessId($businessId) {
        $this->businessId = $businessId;
    }

    public function getBusinessRut() {
        return $this->businessRut;
    }

    public function setBusinessRut($businessRut) {
        $this->businessRut = $businessRut;
    }

    public function getBusinessDv() {
        return $this->businessDv;
    }

    public function setBusinessDv($businessDv) {
        $this->businessDv = $businessDv;
    }

    public function getBusinessName() {
        return $this->businessName;
    }

    public function setBusinessName($businessName) {
        $this->businessName = $businessName;
    }

    public function getBusinessBankAccountId() {
        return $this->businessBankAccountId;
    }

    public function setBusinessBankAccountId($businessBankAccountId) {
        $this->businessBankAccountId = $businessBankAccountId;
    }


    public function setBusiness(){
        // return $this->getBusinessId();
        $conn = new bd();
        $conn->conectar();
        $query = mysqli_prepare($conn->mysqli, "SELECT * FROM business WHERE id = ?");
        mysqli_stmt_bind_param($query, 's', $this->businessId);
        mysqli_stmt_execute($query);
        $result = mysqli_stmt_get_result($query);
        if(!$result){
            return false;
        }
        $row = mysqli_fetch_assoc($result);

        // return $row;

        $this->setBusinessId($row['id']);
        $this->setBusinessRut($row['rut']);
        $this->setBusinessDv($row['dv']);
        $this->setBusinessName($row['name']);
        $this->setBusinessBankAccountId($row['bank_account_id']);

        return true;

        // return [
        //     "businessId" => $this->getBusinessId(),
        //     "businessRut" => $this->getBusinessRut(),
        //     "businessDv" => $this->getBusinessDv(),
        //     "businessName" => $this->getBusinessName(),
        //     "businessBankAccountId" => $this->getBusinessBankAccountId()
        // ];
    }
    
    public function getAllBusinesses(){
        $conn = new bd();
        $conn->conectar();
        $query = mysqli_prepare($conn->mysqli, "SELECT * FROM business");
        mysqli_stmt_execute($query);
        $result = mysqli_stmt_get_result($query);
        $rows = [];
        while($row = mysqli_fetch_assoc($result)){
            $rows[] = $row;
        }
        return $rows;
    }
}

?>
<?php
require_once '../database/bd.php';
require_once '../Bank/Bank.php';

class Business { 
    private $businessId,
    $businessRut,
    $businessDv,
    $businessName,
    $businessBankAccountId,
    $businessBankAccounts;


    public function __construct($businessId = null ,
     $businessRut = null ,
     $businessDv = null ,
     $businessName = null ,
     $businessBankAccountId = null ,
     $businessBankAccounts = null)
    {
        $this->businessId = $businessId;
        $this->businessRut = $businessRut;
        $this->businessDv = $businessDv;
        $this->businessName = $businessName;
        $this->businessBankAccountId = $businessBankAccountId;
        $this->businessBankAccounts = $businessBankAccounts;
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

    public function getBusinessBankAccounts() {
        return $this->businessBankAccounts;
    }

    public function setBusinessBankAccounts($businessBankAccounts) {
        $this->businessBankAccounts = $businessBankAccounts;
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

        // $businessBankAccounts = $this->getBusinessBankAccounts();

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


    public function getBankByBusinessId() {
        $conn = new bd();
        $conn->conectar();
        $query = "SELECT ba.account_number, bat.name, i.name as bank FROM business_has_bank_account bhba 
            INNER JOIN bank_account ba on ba.id = bhba.bank_account_id
            INNER JOIN bank_account_type bat on bat.id = ba.account_type_id 
            INNER JOIN institutions i on i.id = ba.bank_id 
            INNER JOIN business b on b.id = bhba.business_id 
            where b.id = ?";
        $businessId =  $this->businessId;
        $stmt = mysqli_prepare($conn->mysqli, $query);
        $stmt->bind_param("i", $businessId);
        $stmt->execute();
        $result = $stmt->get_result();
        $bankAccounts = [];

        // return $businessId;

        if($result->num_rows > 0){
            while($row = $result->fetch_assoc()){
                $bankAccounts[] = $row;
            }
            $this->setBusinessBankAccounts($bankAccounts);
            return true;

        }else{
            return false;
        }

    }

}

?>
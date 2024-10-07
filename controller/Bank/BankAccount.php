<?php
    require_once '../database/bd.php';

    class BankAccount extends Business{
        private $bankAccountId;
        private $bankAccountNumber;
        private $bankAccountbusinessId;
        private $bankId;

        public function __construct($bankAccountbusinessId) {
            $this->bankAccountbusinessId = $bankAccountbusinessId;
        }

        public function getbankAccountBusinessId() {
            return $this->bankAccountbusinessId;
        }
        
        public function setbankAccountBusinessId($bankAccountbusinessId) {
            $this->bankAccountbusinessId = $bankAccountbusinessId;
        }

        public function getBankAccountId() {
            return $this->bankAccountId;
        }

        public function setBankAccountId($bankAccountId) {
            $this->bankAccountId = $bankAccountId;
        }

        public function getBankaccounts() {
            return $this->bankAccountNumber;
        }

        public function setBankAccountNumber($bankAccountNumber) {
            $this->bankAccountNumber = $bankAccountNumber;
        }

        public function getBankId() {
            return $this->bankId;
        }

        public function setBankId($bankId) {
            $this->bankId = $bankId;
        }


        public function getBankAccountData() {
            $conn = new bd();
            $conn->conectar();
            $query = mysqli_prepare($conn->mysqli, "SELECT * FROM bank_account WHERE business_id = ?");
            $businessId = $this->getbankAccountBusinessId();
            mysqli_stmt_bind_param($query, 'i', $businessId);
            mysqli_stmt_execute($query);
            $result = mysqli_stmt_get_result($query);
            $row = mysqli_fetch_assoc($result);
            if($row){
                $this->setBankAccountId($row['id']);
                $this->setBankAccountNumber($row['account_number']);
                $this->setBankId($row['bank_id']);
                return true;
            }else{
                return false;
            }
        }

        public function setBankAccount($bankData) {
            $conn = new bd();
            $conn->conectar();
        }


    }
?>
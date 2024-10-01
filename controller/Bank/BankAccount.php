<?php
    require_once '../database/bd.php';

    class BankAccount extends Business{
        private $bankAccountId;
        private $bankAccountNumber;
        private $bankId;

        public function __construct($bankAccountId, $bankAccountNumber, $bankId) {
            $this->bankAccountId = $bankAccountId;
            $this->bankAccountNumber = $bankAccountNumber;
            $this->bankId = $bankId;
        }

        public function getBankAccountId() {
            return $this->bankAccountId;
        }

        public function setBankAccountId($bankAccountId) {
            $this->bankAccountId = $bankAccountId;
        }

        public function getBankAccountNumber() {
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


        public function getBankAccountData($bankAccountId) {
            $conn = new bd();
            $conn->conectar();
            $sql = "SELECT * FROM bank_account WHERE bank_account_id = $bankAccountId";
            $result = mysqli_query($conn->mysqli, $sql);
            $row = mysqli_fetch_array($result);
        }
    }
?>
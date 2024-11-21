<?php
    require_once '../database/bd.php';

    class BankAccount extends Business{
        private $bankAccountId;
        private $bankAccountNumber;
        private $bankAccountbusinessId;
        private $bankId;
        private $initialBalance;
        private $firstUpdate;
        private $lastUpdate;

        public function __construct($bankAccountId = null, $bankAccountNumber = null, $bankAccountbusinessId = null, $bankId = null, $initialBalance = null, $firstUpdate = null, $lastUpdate = null) {
            $this->bankAccountId = $bankAccountId;
            $this->bankAccountNumber = $bankAccountNumber;
            $this->bankAccountbusinessId = $bankAccountbusinessId;
            $this->bankId = $bankId;
            $this->initialBalance = $initialBalance;
            $this->firstUpdate = $firstUpdate;
            $this->lastUpdate = $lastUpdate;
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

        public function getInitialBalance() {
            return $this->initialBalance;
        }

        public function setInitialBalance($initialBalance) {
            $this->initialBalance = $initialBalance;
        }

        public function getFirstUpdate() {
            return $this->firstUpdate;
        }

        public function setFirstUpdate($firstUpdate) {
            $this->firstUpdate = $firstUpdate;
        }

        public function getLastUpdate() {
            return $this->lastUpdate;
        }

        public function setLastUpdate($lastUpdate) {
            $this->lastUpdate = $lastUpdate;
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
                $this->setInitialBalance($row['initial_balance']);
                return true;
            }else{
                return false;
            }
        }

        public function setBankAccount($bankData) {
            $conn = new bd();
            $conn->conectar();
        }

        public function updateLastUpdate() {
            $conn = new bd();
            $conn->conectar();
            $query = mysqli_prepare($conn->mysqli, "UPDATE bank_account SET last_register_date = ? WHERE account_number = ? AND business_id = ?");
            $lastUpdate = $this->getLastUpdate();
            $accountNumber = $this->getBankaccounts();
            $businessId = $this->getbankAccountBusinessId();
            mysqli_stmt_bind_param($query, 'ssi', $lastUpdate, $accountNumber,$businessId);
            mysqli_stmt_execute($query);
            $result = mysqli_stmt_get_result($query);
            if($result){
                return true;
            }else{
                return false;
            }
        }

        function getLastInsertion() {
            date_default_timezone_set('America/Santiago');
            $conn = new bd();
            try{
                $conn->conectar();
                $query = mysqli_prepare($conn->mysqli, "SELECT * FROM bank_account WHERE account_number = ? and business_id = ?");
                $accountNumber = $this->getBankaccounts();
                $businessId = $this->getbankAccountBusinessId();
                mysqli_stmt_bind_param($query, 'si', $accountNumber, $businessId);
                mysqli_stmt_execute($query);
                $result = mysqli_stmt_get_result($query);
                $row = mysqli_fetch_assoc($result);
                if($row){
                    $conn->desconectar();
                    // return $row;
                    if($row['last_register_date'] == null){
                        return ['success'=>true, 'message'=>'Update needed first time'];
                    }

                    $this->setLastUpdate($row['last_register_date']);

                    // get diference in minutes between last update and now
                    // if diference is greater than 15 minutes, return true to update

                    $lastUpdate = new DateTime($this->getLastUpdate());
                    // get difference in minutes between two dates 
                    $now = new DateTime();
                    $interval = $now->diff($lastUpdate);

                    // return ["now"=>$now, "lastUpdate"=>$lastUpdate, "interval"=>$interval];

                    if($interval->i > 15 || $interval->h > 0 ||$interval->d > 0 ||  $interval->y > 0){
                        return ['success'=>true, 'message'=>'Update needed'];
                    }

                    return ['success'=>false, 'message'=>'No update needed'];
                }else{
                    return ['success'=>false, 'message'=>'Error obtaining data'];
                }
            }catch(Exception $e){
                $conn->desconectar();
                return ['success'=>false, 'message'=>'Not able to get last update'];
            }
        }

        function setLastInsertion(){
            try{
                $conn = new bd();
                $conn->conectar();
                $query = mysqli_prepare($conn->mysqli, "UPDATE bank_account SET last_register_date = ? WHERE account_number = ? and business_id = ?");
                date_default_timezone_set('America/Santiago');
                $lastUpdate = date('Y-m-d H:i:s');
                $accountNumber = $this->getBankaccounts();
                $businessId = $this->getbankAccountBusinessId();
                mysqli_stmt_bind_param($query, 'ssi', $lastUpdate, $accountNumber, $businessId);
                mysqli_stmt_execute($query);
                 

                // return $result;
                if(mysqli_stmt_affected_rows($query) > 0){
                    return true;
                }else{
                    return false;
                }
            }catch(Exception $e){
                return false;
            }        
        }
    }

     
?>
<?php
    require_once  $_SERVER['DOCUMENT_ROOT'].'/controller/database/bd.php';

    class Bank extends Business {
        private $bankId;
        private $bankType;
        private $sbif_code;
        private $bankName;

        public function __construct($bankId = null, $bankType = null, $sbif_code = null, $bankName = null) {
            $this->bankId = $bankId;
            $this->bankType = $bankType;
            $this->sbif_code = $sbif_code;
            $this->bankName = $bankName;
        }

        public function getBankId() {
            return $this->bankId;
        }

        public function setBankId($bankId) {
            $this->bankId = $bankId;
        }

        public function getBankType() {
            return $this->bankType;
        }

        public function setBankType($bankType) {
            $this->bankType = $bankType;
        }

        public function getSbifCode() {
            return $this->sbif_code;
        }

        public function setSbifCode($sbif_code) {
            $this->sbif_code = $sbif_code;
        }

        public function getBankName() {
            return $this->bankName;
        }

        public function setBankName($bankName) {
            $this->bankName = $bankName;
        }


    }
?>
<?php
session_start();

class SessionManager  {

    // properties
    private $sessionData = [];
    // public $businessName;
    // public $businessId;
    // public $businessBankAccount;
    // public $userId;

    public $businessName,$businessId,$businessBankAccounts,$userId,$superAdmin,$bdId;


    // constructor
    public function __construct() {
        $this->sessionData = $_SESSION;     
    }

    // Set session data
    public static function set($key, $value) {
        $_SESSION[$key] = $value;
    }

    // Get session data
    public static function get($key) {
        return isset($_SESSION[$key]) ? $_SESSION[$key] : null;
    }

    // Unset session data
    public static function unset($key) {
        if (isset($_SESSION[$key])) {
            unset($_SESSION[$key]);
        }
    }

    // Destroy the session
    public static function destroy() {
        session_destroy();
    }

    // getter and setter for every property
    public function setBusinessName($businessName) {
        $this->businessName = $businessName;
    }

    public function getBusinessName() {
        return $this->businessName;
    }

    public function setBusinessId($businessId) {
        $this->businessId = $businessId;
    }

    public function getBusinessId() {
        return $this->businessId;
    }

    public function setBusinessBankAccounts($businessBankAccounts) {
        $this->businessBankAccounts = $businessBankAccounts;
    }

    public function getBusinessBankAccounts() {
        return $this->businessBankAccounts;
    }

    public function setUserId($userId) {
        $this->userId = $userId;
    }

    public function getUserId() {
        return $this->userId;
    }

    public function setSuperAdmin($superAdmin) {
        $this->superAdmin = $superAdmin;
    }

    public function getSuperAdmin() {
        return $this->superAdmin;
    }

    public function setBdId($bdId) {
        $this->bdId = $bdId;
    }

    public function getBdId() {
        return $this->bdId;
    }

    // get all session data
    public function getAllSessionData() {
        return $_SESSION;
    }

    public function setSession() {

        $this->set('businessName', $this->getBusinessName());
        $this->set('businessId', $this->getBusinessId());
        $this->set('businessBankAccounts', $this->getBusinessBankAccounts());
        $this->set('userId', $this->getUserId());
        $this->set('superAdmin', $this->getSuperAdmin());
        $this->set('busBdId', $this->getBdId());
        
    }

    public function setLoginSession() {
        return $this->set('loggedin', true);
    }

    public function closeSession() {
        session_destroy();
    }   


}

// Example usage
// SessionManager::set('username', 'JohnDoe');
// echo SessionManager::get('username'); // Outputs: JohnDoe
// SessionManager::unset('username');
// SessionManager::destroy();
?>
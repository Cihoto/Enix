<?php
session_start();

class SessionManager  {

    // properties
    private $sessionData = [];
    // public $businessName;
    // public $businessId;
    // public $businessBankAccount;
    // public $userId;

    public $businessName,$businessId,$businessBankAccount,$userId,$superAdmin;


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

    public function setBusinessBankAccount($businessBankAccount) {
        $this->businessBankAccount = $businessBankAccount;
    }

    public function getBusinessBankAccount() {
        return $this->businessBankAccount;
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

    // get all session data
    public function getAllSessionData() {
        return $_SESSION;
    }

    public function setSession() {

        $this->set('businessName', $this->getBusinessName());
        $this->set('businessId', $this->getBusinessId());
        $this->set('businessBankAccount', $this->getBusinessBankAccount());
        $this->set('userId', $this->getUserId());
        $this->set('superAdmin', $this->getSuperAdmin());
        
    }

    public function setLoginSession() {
        return $this->set('loggedin', true);
    }


}

// Example usage
// SessionManager::set('username', 'JohnDoe');
// echo SessionManager::get('username'); // Outputs: JohnDoe
// SessionManager::unset('username');
// SessionManager::destroy();
?>
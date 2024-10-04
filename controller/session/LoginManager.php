<?php
require_once '../database/bd.php';
require_once '../person/Person.php';
require_once '../session/sessionManager.php';
require_once '../Bank/BankAccount.php';
require_once '../User/User.php';
require_once '../Business/Bussiness.php';

class LoginManager{
    private $email;
    private $password;

    public function __construct($email, $password) {
        $this->email = $email;
        $this->password = $password;
    }

    public function login() {

        $user = new User($this->password, $this->email);
       
        if ( $user->checkUser()) {

            $person = new Person(null, null,$user->getBusinessId(), $user->getId(), null, null);
            $personData = $person->setPerson();
            // return $user->getBusinessId();
            // return $personData;
            if(!$personData){
                return ['false' => 'no person found'];
            }
            // return "ASdasd";
            $business = new Business($user->getBusinessId(), null, null, null, null);
            $businessData = $business->setBusiness();
            if(!$businessData){
                return false;
            }

            $businessId = $business->getBusinessId();
            $bankAccount = new BankAccount($businessId);

            $bankAccountData = $bankAccount->getBankAccountData();
            if(!$bankAccountData){
                return false;
            }
            // return $bankAccountData;

            if(!$bankAccountData){
                return false;
            }

            $sessionManager = new sessionManager();
            $sessionManager->setUserId($user->getId());
            $sessionManager->setBusinessId($business->getBusinessRut());
            $sessionManager->setBusinessName($business->getBusinessName());
            $sessionManager->setBusinessBankAccount($bankAccount->getBankAccountNumber());
            $sessionManager->setSuperAdmin($user->isSuperAdmin());

            $sessionManager->setSession(); 
            $sessionManager->setLoginSession();
            
            return ["success"=>true, 'message' => 'Login successful!'];
        } else {
            return "no user found";
        }
    }

    public function logout() {
        unset($_SESSION['loggedin']);
    }

    public function isLoggedIn() {
        return isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true;
    }
}
?>
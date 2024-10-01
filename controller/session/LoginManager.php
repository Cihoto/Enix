<?php
require_once '../database/bd.php';
require_once '../person/Person.php';
require_once '../session/sessionManager.php';
require_once '../Bank/BankAccount.php';

class LoginManager extends Person{
    private $email;
    private $password;

    public function __construct($email, $password) {
        $this->email = $email;
        $this->password = $password;
    }

    public function login() {
        
        $conn = new bd();
        $conn->conectar();
        $query = mysqli_prepare($conn->mysqli, "SELECT * FROM user WHERE LOWER(email) = ? AND `password` = ?");
        $email = strtolower($this->email);
        mysqli_stmt_bind_param($query, 'ss', $email, $this->password);
        mysqli_stmt_execute($query);
        $result = mysqli_stmt_get_result($query);
        $row = mysqli_fetch_assoc($result);

        // return json_encode("SELECT * FROM user WHERE LOWER(email) = $email AND `password` = $this->password");
        // return $row;
        if ($row) {
            // get userData from user table
            
            $this->setBusinessId($row['business_id']);
            $this->setUserId($row['id']);
            $personData = $this->setPerson();
            if($personData){
                return false;
            }
            // return $this->setBusiness();
            $businessData = $this->setBusiness();
            if($businessData){
                return false;
            }
            // $bankAccount = new BankAccount();
            // $bankAccountData = $this->setBankAccount();


            return ["success" => "business", "businessId" => $this->getBusinessId()];
                
            return true;
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
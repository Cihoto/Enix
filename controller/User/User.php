<?php

class User {
    private $id;
    private $business_id;
    private $password;
    private $email;
    private $superAdmin;

    // Constructor
    public function __construct($password, $email) {
        $this->password = $password;
        $this->email = $email;
    }

    // Getters and Setters
    public function getId() {
        return $this->id;
    }

    public function setId($id) {
        $this->id = $id;
    }

    public function getBusinessId() {
        return $this->business_id;
    }

    public function setBusinessId($business_id) {
        $this->business_id = $business_id;
    }

    public function getPassword() {
        return $this->password;
    }

    public function setPassword($password) {
        $this->password = $password;
    }

    public function getEmail() {
        return $this->email;
    }

    public function setEmail($email) {
        $this->email = $email;
    }

    public function isSuperAdmin() {
        return $this->superAdmin;
    }

    public function setSuperAdmin($superAdmin) {
        $isSuperAdmin = $superAdmin == 1 ? true : false;
        $this->superAdmin = $isSuperAdmin;
    }


    // Check if the user exists
    public function checkUser() {
        $conn = new bd();
        $conn->conectar();
        $query = mysqli_prepare($conn->mysqli, "SELECT * FROM user WHERE LOWER(email) = ? AND `password` = ?");
        $email = strtolower($this->email);
        mysqli_stmt_bind_param($query, 'ss', $email, $this->password);
        mysqli_stmt_execute($query);
        $result = mysqli_stmt_get_result($query);
        $row = mysqli_fetch_assoc($result);

        if ($row) {
            $this->setBusinessId($row['business_id']);
            $this->setId($row['id']);
            $this->setSuperAdmin($row['superAdmin']);
            return true;
        } else {
            return false;
        }
    }
}
?>
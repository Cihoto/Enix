<?php

if($_SERVER['REQUEST_METHOD'] === 'POST'){
    require_once '../session/LoginManager.php';

    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['userEmail'];
    $password = $data['password'];

    if(empty($email) || empty($password)){
        echo json_encode(['error' => 'email and password are required.']);
        exit;
    }
    // check if the email and password are correct
    $loginManager = new LoginManager($email, $password);

    echo json_encode($loginManager->login());
    exit;
    if ($loginManager->login()) {
        echo json_encode(["success"=>true, 'message' => 'Login successful!']);
    } else {
        echo json_encode(['error' => 'Invalid email or password.']);
    }

}else{
    echo json_encode(['error' => 'Método no permitido']);
}

    

?>
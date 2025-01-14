<?php 
    require_once  $_SERVER['DOCUMENT_ROOT'].'/controller/database/bd.php';

    class CommonMovements {
        
        public $id, $date_from, $date_to, $name, $income, $amount, $active, $business_id;

        public function __construct($id = null, $date_from = null, $date_to = null, $name = null, $income = null, $amount = null, $active = null, $business_id = null) {
            $this->id = $id;
            $this->date_from = $date_from;
            $this->date_to = $date_to;
            $this->name = $name;
            $this->income = $income;
            $this->amount = $amount;
            $this->active = $active;
            $this->business_id = $business_id;
        }

        public function getId() {
            return $this->id;
        }

        public function setId($id) {
            $this->id = $id;
        }

        public function getDateFrom() {
            return $this->date_from;
        }

        public function setDateFrom($date_from) {
            $this->date_from = $date_from;
        }

        public function getDateTo() {
            return $this->date_to;
        }

        public function setDateTo($date_to) {
            $this->date_to = $date_to;
        }

        public function getName() {
            return $this->name;
        }

        public function setName($name) {
            $this->name = $name;
        }

        public function getIncome() {
            return $this->income;
        }

        public function setIncome($income) {
            $this->income = $income;
        }

        public function getAmount() {
            return $this->amount;
        }

        public function setAmount($amount) {
            $this->amount = $amount;
        }

        public function getActive() {
            return $this->active;
        }

        public function setActive($active) {
            $this->active = $active;
        }

        public function getBusinessId() {
            return $this->business_id;
        }

        public function setBusinessId($business_id) {
            $this->business_id = $business_id;
        }

        //  CREATE TABLE common_movement (
        //     id UUID PRIMARY KEY,
        //     date_from DATE NOT NULL,
        //     date_to DATE NOT NULL,
        //     name VARCHAR(255) NOT NULL,
        //     income BOOLEAN NOT NULL,
        //     amount INT NOT NULL,
        //     active BOOLEAN NOT NULL,
        //     business_id INT NOT NULL,
        //     FOREIGN KEY (business_id) REFERENCES business(id)
        // ); 

        public function insertCommonMovement($conn = null) {
            $closeConnection = false;
            if ($conn === null) {
                $conn = new bd();
                $conn->conectar();
                $closeConnection = true;
            }

            $query = mysqli_prepare($conn->mysqli, "INSERT INTO common_movement 
                (id,date_from, date_to, name, income, amount, business_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?)");

            // get SELECT UUID FROM MYSQL
            $uuidQuery = mysqli_prepare($conn->mysqli, "SELECT UUID()");
            mysqli_stmt_execute($uuidQuery);
            mysqli_stmt_bind_result($uuidQuery, $uuid);
            mysqli_stmt_fetch($uuidQuery);
            mysqli_stmt_close($uuidQuery);

            mysqli_stmt_bind_param($query, 'ssssiii', $uuid, $this->date_from, $this->date_to, $this->name, $this->income, $this->amount, $this->business_id);
            mysqli_stmt_execute($query);

            if (mysqli_stmt_affected_rows($query) > 0) {
                
                mysqli_stmt_close($query);
                if ($closeConnection) {
                    $conn->desconectar();
                }
                $this->setId($uuid);
                return ["sucess" => true];
            } else {
                mysqli_stmt_close($query);
                if ($closeConnection) {
                    $conn->desconectar();
                }
                return ["sucess" => false, "error" => "Error inserting common movement"];
            }
        }

        public function softDeleteCommonMovement() {
            try{
                $conn = new bd();
                $conn->conectar();
                $query = mysqli_prepare($conn->mysqli, "UPDATE common_movement SET active = 0 WHERE id = ? AND business_id = ?");
    
                mysqli_stmt_bind_param($query, 'si', $this->id, $this->business_id);
                mysqli_stmt_execute($query);
    
                if (mysqli_stmt_affected_rows($query) > 0) {
                    mysqli_stmt_close($query);
                    $conn->desconectar();

                    return ["success" => true, "message"=> "Common movement deleted"];
                } else {
                    mysqli_stmt_close($query);
                    $conn->desconectar();
                    return ["success" => false, "message" => "Common movement not found"];
                }
            }catch(Exception $e) {
                return ["success" => false,"message" => $e->getMessage()];
            }
        }

        public function getCommonMovements() {
            $conn = new bd();
            $conn->conectar();
            $query = mysqli_prepare($conn->mysqli, "
                SELECT cm.*, mcm.id as movement_id, mcm.printDate, mcm.printDateTimestamp, mcm.total, mcm.name as movement_name, mcm.desc 
                FROM common_movement cm 
                LEFT JOIN movement_common_movement mcm ON cm.id = mcm.common_movement_id 
                WHERE cm.active = 1 AND cm.business_id = ? AND (mcm.active = 1 OR mcm.active IS NULL)");
            mysqli_stmt_bind_param($query, 'i', $this->business_id);
            mysqli_stmt_execute($query);
            $result = mysqli_stmt_get_result($query);
            $rows = [];
            $movements = [];

            while($row = mysqli_fetch_assoc($result)){
                if (!isset($rows[$row['id']])) {
                    $rows[$row['id']] = [
                        'id' => $row['id'],
                        'dateFrom' => $row['date_from'],
                        'dateTo' => $row['date_to'],
                        'name' => $row['name'],
                        'income' => $row['income'],
                        'amount' => $row['amount'],
                        'active' => $row['active'],
                        'business_id' => $row['business_id'],
                        'movements' => []
                    ];
                }
                if ($row['movement_id']) {
                    $rows[$row['id']]['movements'][] = [
                        'id' => $row['movement_id'],
                        'printDate' => $row['printDate'],
                        'printDateTimestamp' => $row['printDateTimestamp'],
                        'total' => $row['total'],
                        'name' => $row['movement_name'],
                        'desc' => $row['desc']
                    ];
                }
            }
            return array_values($rows);
        }
        public function getCommonMovements_range($date_from, $date_to) {
            $conn = new bd();
            $conn->conectar();
            $query = mysqli_prepare($conn->mysqli, "SELECT cm.*, mcm.id as movement_id, mcm.printDate, mcm.printDateTimestamp, mcm.total, mcm.name as movement_name, mcm.desc 
                FROM common_movement cm 
                LEFT JOIN movement_common_movement mcm ON cm.id = mcm.common_movement_id 
                WHERE cm.active = 1 AND cm.business_id = ? 
                AND (mcm.active = 1 OR mcm.active IS NULL)
                AND cm.date_from >= ?
                AND cm.date_to <= ?");
            mysqli_stmt_bind_param($query, 'iss', $this->business_id, $date_from, $date_to);
            mysqli_stmt_execute($query);
            $result = mysqli_stmt_get_result($query);
            $rows = [];
            $movements = [];

            while($row = mysqli_fetch_assoc($result)){
                if (!isset($rows[$row['id']])) {
                    $rows[$row['id']] = [
                        'id' => $row['id'],
                        'dateFrom' => $row['date_from'],
                        'dateTo' => $row['date_to'],
                        'name' => $row['name'],
                        'income' => $row['income'],
                        'amount' => $row['amount'],
                        'active' => $row['active'],
                        'business_id' => $row['business_id'],
                        'movements' => []
                    ];
                }
                if ($row['movement_id']) {
                    $rows[$row['id']]['movements'][] = [
                        'id' => $row['movement_id'],
                        'printDate' => $row['printDate'],
                        'printDateTimestamp' => $row['printDateTimestamp'],
                        'total' => $row['total'],
                        'name' => $row['movement_name'],
                        'desc' => $row['desc']
                    ];
                }
            }
            return array_values($rows);
        }
    }

    class movement_common_movement extends CommonMovements {
        public $id,$printDate, $printDateTimestamp, $total, $name, $desc, $common_movement_id, $active;

        public function __construct($id = null, $printDate = null, $printDateTimestamp = null, $total = null, $name = null, $desc = null, $common_movement_id = null, $active = null) {
            $this->id = $id;
            $this->printDate = $printDate;
            $this->printDateTimestamp = $printDateTimestamp;
            $this->total = $total;
            $this->name = $name;
            $this->desc = $desc;
            $this->common_movement_id = $common_movement_id;
            $this->active = $active;
        }

        public function getId() {
            return $this->id;
        }

        public function setId($id) {
            $this->id = $id;
        }

        public function getPrintDate() {
            return $this->printDate;
        }

        public function setPrintDate($printDate) {
            $this->printDate = $printDate;
        }

        public function getPrintDateTimestamp() {
            return $this->printDateTimestamp;
        }

        public function setPrintDateTimestamp($printDateTimestamp) {
            $this->printDateTimestamp = $printDateTimestamp;
        }

        public function getTotal() {
            return $this->total;
        }

        public function setTotal($total) {
            $this->total = $total;
        }

        public function getName() {
            return $this->name;
        }

        public function setName($name) {
            $this->name = $name;
        }

        public function getDesc() {
            return $this->desc;
        }

        public function setDesc($desc) {
            $this->desc = $desc;
        }

        public function getCommonMovementId() {
            return $this->common_movement_id;
        }

        public function setCommonMovementId($common_movement_id) {
            $this->common_movement_id = $common_movement_id;
        }

        public function getActive() {
            return $this->active;
        }

        public function setActive($active) {
            $this->active = $active;
        }

        public function insertMovementCommonMovement($conn = null) {
            $closeConnection = false;
            if ($conn === null) {
                $conn = new bd();
                $conn->conectar();  
                $closeConnection = true;
            }

            $query = mysqli_prepare($conn->mysqli, "INSERT INTO movement_common_movement 
                (printDate, printDateTimestamp, total, name, common_movement_id, active) 
                VALUES (?, ?, ?, ?, ?, ?)");
            

            // return $this->common_movement_id;
            $active = 1;
            mysqli_stmt_bind_param($query, 'siisii', $this->printDate, $this->printDateTimestamp, $this->total, $this->name, $this->common_movement_id, $active);
            mysqli_stmt_execute($query);
            

            if (mysqli_stmt_affected_rows($query) > 0) {
                $inserted_id = mysqli_insert_id($conn->mysqli);
                mysqli_stmt_close($query);
                if ($closeConnection) {
                    $conn->desconectar();
                }
                return ["sucess" => true];
            } else {
                mysqli_stmt_close($query);
                if ($closeConnection) {
                    $conn->desconectar();
                }
                return ["sucess" => false];
            }
        }

        public function insertBatchMovementCommonMovement($conn, $movements) {
            $closeConnection = false;
            if ($conn === null) {
                $conn = new bd();
                $conn->conectar();
                $closeConnection = true;
            }

            $query = "INSERT INTO movement_common_movement (printDate, printDateTimestamp, total, name, `desc`, common_movement_id, active) VALUES ";
            $values = [];
            $types = '';
            foreach ($movements as $movement) {
                $values[] = "(?, ?, ?, ?, ?, ?, ?)";
                $types .= 'siisisi';
            }
            $query .= implode(', ', $values);

            $stmt = mysqli_prepare($conn->mysqli, $query);
            $params = [];
            foreach ($movements as $movement) {
                $params = array_merge($params, array_values($movement));
            }
            mysqli_stmt_bind_param($stmt, $types, ...$params);
            mysqli_stmt_execute($stmt);

            if (mysqli_stmt_affected_rows($stmt) > 0) {
                mysqli_stmt_close($stmt);
                if ($closeConnection) {
                    $conn->desconectar();
                }
                return ["sucess" => true];
            } else {
                mysqli_stmt_close($stmt);
                if ($closeConnection) {
                    $conn->desconectar();
                }
                return ["sucess" => false];
            }
        }

        public function softDeleteMovementCommonMovement() {
            try{
                $conn = new bd();
                $conn->conectar();
                $query = mysqli_prepare($conn->mysqli, "UPDATE movement_common_movement SET active = 0 WHERE id = ?");
    
                mysqli_stmt_bind_param($query, 'i', $this->id);
                mysqli_stmt_execute($query);
    
                if (mysqli_stmt_affected_rows($query) > 0) {
                    mysqli_stmt_close($query);
                    $conn->desconectar();
                    return ["sucess" => true];
                } else {
                    mysqli_stmt_close($query);
                    $conn->desconectar();
                    return ["sucess" => false];
                }
            }catch(Exception $e) {
                return ["sucess" => false];
            }
        }

        public function updateSingleMovement() {
            try{
                $conn = new bd();
                $conn->conectar();
                $query = mysqli_prepare($conn->mysqli, "UPDATE movement_common_movement SET  total = ?, `desc` = ? WHERE id = ?");
    
                mysqli_stmt_bind_param($query, 'isi', $this->total, $this->desc, $this->id);
                mysqli_stmt_execute($query);
    
                if (mysqli_stmt_affected_rows($query) > 0) {
                    mysqli_stmt_close($query);
                    $conn->desconectar();
                    return ["success" => true];
                } else {
                    mysqli_stmt_close($query);
                    $conn->desconectar();
                    return ["success" => false];
                }
            }catch(Exception $e) {
                return ["success" => false];
            }
        }
    }
?>



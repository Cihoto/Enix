<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/controller/database/bd.php';
require_once $_SERVER['DOCUMENT_ROOT'].'/vendor/autoload.php';
class TributarieDocuments
{
    public $id;
    public $issue_date;
    public $expiration_date;
    public $folio;
    public $total;
    public $balance;
    public $paid;
    public $type;
    public $item;
    public $rut;
    public $issued_received;
    public $sii_code;
    public $business_name;
    public $tax;
    public $exempt_amount;
    public $taxable_amount;
    public $net_amount;
    public $business_id;
    public $cancelled;
    public $is_paid;

    public function __construct(
        $id = null,
        $issue_date = null,
        $expiration_date = null,
        $folio = null,
        $total = null,
        $balance = null,
        $paid = null,
        $type = null,
        $item = null,
        $rut = null,
        $issued_received = null,
        $sii_code = null,
        $business_name = null,
        $tax = null,
        $exempt_amount = null,
        $taxable_amount = null,
        $net_amount = null,
        $business_id = null,
        $cancelled = null,
        $is_paid = null
    ) {
        $this->id = $id;
        $this->issue_date = $issue_date;
        $this->expiration_date = $expiration_date;
        $this->folio = $folio;
        $this->total = $total;
        $this->balance = $balance;
        $this->paid = $paid;
        $this->type = $type;
        $this->item = $item;
        $this->rut = $rut;
        $this->issued_received = $issued_received;
        $this->sii_code = $sii_code;
        $this->business_name = $business_name;
        $this->tax = $tax;
        $this->exempt_amount = $exempt_amount;
        $this->taxable_amount = $taxable_amount;
        $this->net_amount = $net_amount;
        $this->business_id = $business_id;
        $this->cancelled = $cancelled;
        $this->is_paid = $is_paid;
    }

    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        $this->id = $id;
    }

    public function getIssueDate()
    {
        return $this->issue_date;
    }

    public function setIssueDate($issue_date)
    {
        $this->issue_date = $issue_date;
    }

    public function getExpirationDate()
    {
        return $this->expiration_date;
    }

    public function setExpirationDate($expiration_date)
    {
        $this->expiration_date = $expiration_date;
    }

    public function getFolio()
    {
        return $this->folio;
    }

    public function setFolio($folio)
    {
        $this->folio = $folio;
    }

    public function getTotal()
    {
        return $this->total;
    }

    public function setTotal($total)
    {
        $this->total = $total;
    }

    public function getBalance()
    {
        return $this->balance;
    }

    public function setBalance($balance)
    {
        $this->balance = $balance;
    }

    public function getPaid()
    {
        return $this->paid;
    }

    public function setPaid($paid)
    {
        $this->paid = $paid;
    }

    public function getType()
    {
        return $this->type;
    }

    public function setType($type)
    {
        $this->type = $type;
    }

    public function getItem()
    {
        return $this->item;
    }

    public function setItem($item)
    {
        $this->item = $item;
    }

    public function getRut()
    {
        return $this->rut;
    }

    public function setRut($rut)
    {
        $this->rut = $rut;
    }

    public function getIssuedReceived()
    {
        return $this->issued_received;
    }

    public function setIssuedReceived($issued_received)
    {
        $this->issued_received = $issued_received;
    }

    public function getSiiCode()
    {
        return $this->sii_code;
    }

    public function setSiiCode($sii_code)
    {
        $this->sii_code = $sii_code;
    }

    public function getBusinessName()
    {
        return $this->business_name;
    }

    public function setBusinessName($business_name) {}

    public function getTax()
    {
        return $this->tax;
    }

    public function setTax($tax)
    {
        $this->tax = $tax;
    }

    public function getExemptAmount()
    {
        return $this->exempt_amount;
    }

    public function setExemptAmount($exempt_amount)
    {
        $this->exempt_amount = $exempt_amount;
    }

    public function getTaxableAmount()
    {
        return $this->taxable_amount;
    }

    public function setTaxableAmount($taxable_amount)
    {
        $this->taxable_amount = $taxable_amount;
    }

    public function getNetAmount()
    {
        return $this->net_amount;
    }

    public function setNetAmount($net_amount)
    {
        $this->net_amount = $net_amount;
    }

    public function getBusinessId()
    {
        return $this->business_id;
    }

    public function setBusinessId($business_id)
    {
        $this->business_id = $business_id;
    }

    public function getCancelled()
    {
        return $this->cancelled;
    }

    public function setCancelled($cancelled)
    {
        $this->cancelled = $cancelled;
    }

    public function getIsPaid()
    {
        return $this->is_paid;
    }

    public function setIsPaid($is_paid)
    {
        $this->is_paid = $is_paid;
    }

    public function insertBatchTributarieDocuments($tributarieDocuments)
    {

        // return $this->business_id;

        // return ["success" => false, "message" => "Error creating bank movements"];
        $conn = new bd();
        $conn->conectar();

        $query = "INSERT INTO `tributarie_document`(`id`, `issue_date`, `expiration_date`, `folio`, `total`, `balance`, `paid`, `type`, `item`, `rut`, `issued`, `business_name`, `tax`, `exempt_amount`, `taxable_amount`, `net_amount`, `is_paid`, `business_id`) VALUES";
        $values = [];
        $types = '';

        foreach ($tributarieDocuments as $tributarie) {
            $values[] = "(?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $types .= 'sssiiiisssissiiiii';
        }
        $query .= implode(', ', $values);
        $stmt = mysqli_prepare($conn->mysqli, $query);
        $params = [];

        foreach ($tributarieDocuments as $tributarie) {

            $id = \Ramsey\Uuid\Uuid::uuid4();
            $tributarie = array_merge(['id' => $id], $tributarie);
            $tributarie = array_merge($tributarie, ['business_id' => $this->business_id]);
            $params = array_merge($params, array_values($tributarie));
        }

        // return $params;?

        mysqli_stmt_bind_param($stmt, $types, ...$params);
        mysqli_stmt_execute($stmt);

        if ($stmt->affected_rows === 0) {
            $stmt->close();
            $conn->desconectar();
            return ["success" => false, "message" => "Error creating tributarie documents"];
        }

        $stmt->close();
        $conn->desconectar();
        return ["success" => true, "message" => "Batch tributarie documents created successfully"];
    }

    function getTributarieDocuments(){
        try {
            $conn = new bd();
            $conn->conectar();
            $query = "SELECT * FROM tributarie_document WHERE business_id = ?";
            $stmt = mysqli_prepare($conn->mysqli, $query);
            mysqli_stmt_bind_param($stmt, 's', $this->business_id);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            $tributarieDocuments = [];
            while ($row = mysqli_fetch_assoc($result)) {
                $tributarieDocuments[] = $row;
            }
            $stmt->close();
            $conn->desconectar();
            return ["success" => true, "message" => "Tributarie documents found", "data" => $tributarieDocuments];
        } catch (\Throwable $th) {
            return ["success" => false, "message" => "Error finding tributarie documents"];
        }
    }


    function deleteTributarieDocument(){
        try {
            $conn = new bd();
            $conn->conectar();
            $query = "DELETE FROM tributarie_document WHERE business_id = ?";
            $stmt = mysqli_prepare($conn->mysqli, $query);
            mysqli_stmt_bind_param($stmt, 'i', $this->business_id);
            mysqli_stmt_execute($stmt);
            $stmt->close();
            $conn->desconectar();
            return ["success" => true, "message" => "Tributarie document deleted"];
        } catch (\Throwable $th) {
            return ["success" => false, "message" => "Error deleting tributarie document"];
        }
    }

    function markAsPaid(){
        try {
            $conn = new bd();
            $conn->conectar();

            $query = "UPDATE tributarie_document SET is_paid = 1 WHERE id = ? AND business_id = ?";
            $stmt = mysqli_prepare($conn->mysqli, $query);
            mysqli_stmt_bind_param($stmt, 'ss', $this->id,$this->business_id);
            mysqli_stmt_execute($stmt);
        
            $stmt->close();
            $conn->desconectar();
            return ["success" => true, "message" => "Tributarie documents marked as paid"];
        } catch (\Throwable $th) {
            return ["success" => false, "message" => "Error marking tributarie documents as paid"];
        }
    }

    function updateExpirationDate($id, $expirationDate){
        try {
            $conn = new bd();
            $conn->conectar();

            $query = "UPDATE tributarie_document SET expiration_date = ? WHERE id = ? AND business_id = ?";
            $stmt = mysqli_prepare($conn->mysqli, $query);
            mysqli_stmt_bind_param($stmt, 'sss', $expirationDate, $id, $this->business_id);
            mysqli_stmt_execute($stmt);
        
            $stmt->close();
            $conn->desconectar();
            return ["success" => true, "message" => "Expiration date updated"];
        } catch (\Throwable $th) {
            return ["success" => false, "message" => "Error updating expiration date"];
        }
    }
}

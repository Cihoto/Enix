<?php
require_once $_SERVER['DOCUMENT_ROOT'].'/controller/database/bd.php';
class FinancialStatus
{
    public $issued, $received, $total, $date, $bank_balance, $avit, $business_id;

    public function __construct($issued = null, $received = null, $total = null, $date = null, $bank_balance = null, $avit = null, $business_id = null)
    {
        $this->issued = $issued;
        $this->received = $received;
        $this->total = $total;
        $this->date = $date;
        $this->bank_balance = $bank_balance;
        $this->avit = $avit;
        $this->business_id = $business_id;
    }

    public function getIssued()
    {
        return $this->issued;
    }

    public function setIssued($issued)
    {
        $this->issued = $issued;
    }

    public function getReceived()
    {
        return $this->received;
    }

    public function setReceived($received)
    {
        $this->received = $received;
    }

    public function getTotal()
    {
        return $this->total;
    }

    public function setTotal($total)
    {
        $this->total = $total;
    }

    public function getDate()
    {
        return $this->date;
    }

    public function setDate($date)
    {
        $this->date = $date;
    }

    public function getBankBalance()
    {
        return $this->bank_balance;
    }

    public function setBankBalance($bank_balance)
    {
        $this->bank_balance = $bank_balance;
    }

    public function getAvit()
    {
        return $this->avit;
    }

    public function setAvit($avit)
    {
        $this->avit = $avit;
    }

    public function getBusinessId()
    {
        return $this->business_id;
    }

    public function setBusinessId($business_id)
    {
        $this->business_id = $business_id;
    }

    public function getFinancialStatus (){
        $conn = new bd();
        $conn->conectar();

        try{

            $sql = "SELECT `issued`, `received`, `total`, `date`, `bank_balance`, `avit` FROM financial_status where business_id = ?"; 
            $stmt = $conn->mysqli->prepare($sql);
            $stmt->bind_param("i", $this->business_id);

            $stmt->execute();
            $result = $stmt->get_result();
            $stmt->close();

            $conn->desconectar();

            $financialStatus = [];
            while($row = $result->fetch_assoc()){
                $financialStatus[] = $row;
            }

            return ['success'=>true,'data' =>$financialStatus];
        }catch(Exception $e){
            $conn->desconectar();
            return ['success'=>false,'data' =>[]];
            exit();
        }


        $conn->desconectar();
    }
    public function getFinancialStatus_range ($dateFrom, $dateTo){
        $conn = new bd();
        $conn->conectar();

        try{

            $sql = "SELECT `issued`, `received`, `total`, `date`, `bank_balance`, `avit` 
            FROM financial_status 
            where business_id = ?
            AND date >= ? 
            AND date <= ?"; 
            $stmt = $conn->mysqli->prepare($sql);
            $stmt->bind_param("iss", $this->business_id,$dateFrom,$dateTo);

            $stmt->execute();
            $result = $stmt->get_result();
            $stmt->close();

            $conn->desconectar();

            $financialStatus = [];
            while($row = $result->fetch_assoc()){
                $financialStatus[] = $row;
            }

            return ['success'=>true,'data' =>$financialStatus];
        }catch(Exception $e){
            $conn->desconectar();
            return ['success'=>false,'data' =>[]];
            exit();
        }


        $conn->desconectar();
    }

}

async function insertBatchBankMovements(reqBody) {
    const response = await fetch('./controller/BankMovements/createBatchBankMovements.php',{
        method: 'POST',
        body: JSON.stringify({
            movements : reqBody
        })
    });
    const data = await response.json();
    console.log(data);
}

async function getBankMovementsFromDB() {
    const response = await fetch('./controller/BankMovements/getBankMovements.php',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const bankMovements = await response.json();
    if(!bankMovements.success){
        return [];
    }
    return bankMovements.data;
}   
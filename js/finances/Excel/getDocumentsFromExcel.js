async function readExcelFile_bankMovements(){
    const bankAccountNumber = await getBankAccountNumber();
    console.log('bankAccountNumber',bankAccountNumber);
    const file = await fetch('./controller/ExcelManager/readExcelFile.php', {
        method: 'POST',
        body: JSON.stringify({
            fileType: 'bankMovements',
            bankAccountNumber : bankAccountNumber
        }),
    });
    const data = await file.json();

    if(data.success){
        return data.data;

    }else{
        return {
            "headers":[],
            "bodyRows":[]
        }
    }
}

async function readExcelFile_tributarieDocuments(){
    const excelResponse = await fetch('./controller/ExcelManager/readExcelFile.php', {
        method: 'POST',
        body: JSON.stringify({
            fileType: 'tributarie',
        }),
    });
    const data = await excelResponse.json(); 

    if(data.success){
        return data.data;

    }else{
        return {
            "headers":[],
            "bodyRows":[]
        }
    }
}


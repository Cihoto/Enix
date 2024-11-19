async function insertBatchTributarieDocuments(reqBody) {
    const response = await fetch('./controller/TributarieDocuments/createBatchTributarieDocuments.php',{
        method: 'POST',
        body: JSON.stringify({
            documents : reqBody
        })
    });
    const data = await response.json();
    console.log(data);
}


async function getTributarieDocuments() {
    const response = await fetch('./controller/TributarieDocuments/getTributarieDocuments.php',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
}


async function markAsPaid(rowId) {
    const response = await fetch('./controller/TributarieDocuments/markAsPaid.php',{
        method: 'PATCH',
        body: JSON.stringify({
            rowId : rowId
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
}

async function changeExpirationDate(rowId,date) {
    const response = await fetch('./controller/TributarieDocuments/changeExpirationDate.php',{
        method: 'PATCH',
        body: JSON.stringify({
            rowId : rowId,
            date : date
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
}
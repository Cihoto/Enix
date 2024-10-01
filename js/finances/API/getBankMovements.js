

async function getBankMovements(){
    console.log('firstDayOfMonth',firstDayOfMonth);
    console.log('firstDayOfMonth',firstDayOfMonth);
    try {
        const response = await fetch('ws/Clay/getBankMovements.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "initDate": firstDayOfMonth,
                "bussId": busData.busId,
                'bankAcocuntId': busData.bankAcocuntId,
            })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('data', data);
        return data;
    } catch (error) {
        console.log(error);
    }

    console.log('bankMov', bankMov);
}
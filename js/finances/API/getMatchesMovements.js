async function getMatchesMovements(){

    try{
        const responseMatchesBankMovements = await fetch('ws/Clay/getAllMatchesBankMovements.php',{
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

        if(!responseMatchesBankMovements.ok){
            throw new Error('Network response was not ok');
        }

        const dataMatchesBankMovements = await responseMatchesBankMovements.json();
        console.log('dataMatchesBankMovements',dataMatchesBankMovements);

        return dataMatchesBankMovements;
    }catch(e){
        console.log(e);
    }
}
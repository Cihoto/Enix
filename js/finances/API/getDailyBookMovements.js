async function getDailyBookMovements() {
    // get the content to print
    try{
        const responseLibroDiario = await fetch('ws/Clay/getDailyBookMovements.php',{
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
        
        if(!responseLibroDiario.ok){
            throw new Error('Network response was not ok');
        }
        const dataLibroDiario = await responseLibroDiario.json();
        return dataLibroDiario;
    }catch(e){
        console.log(e);
    }
    console.log('libroDiario',libroDiario);
}
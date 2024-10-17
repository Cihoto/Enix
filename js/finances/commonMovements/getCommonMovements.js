async function getCommonMovements(){
    const commonMovsResponse = await getAllCommonMovements();
    COMMON_MOVEMENTS = commonMovsResponse.data;
    // const commonMovements = [];
    // const commonMovements = commonMovsResponse.data;
    // console.log('commonMovements',commonMovements);
    setCommonMovementsInBankMovements();
    console.log(bankMovementsData);
    return true;
}


function setCommonMovementsInBankMovements(){
    COMMON_MOVEMENTS.forEach((movements) => {
        const {movements : commonMovements, income: income, id:id } = movements;
        commonMovements.forEach((movement) => {
            const { printDateTimestamp, total,index} = movement;
            if(printDateTimestamp <= moment().format('X')){
                return
            }
            const egresoIngreso = income ? 'commonIncomeMovements' : 'commonOutcomeMovements';
            const dayOnArray = bankMovementsData[egresoIngreso].find(({timestamp}) => {
                return timestamp == printDateTimestamp;
            });
            if(!dayOnArray){
                return
            }
            const commonMov = {
                id: `${id}_${index}`,
                income: income,
                ...movement,
            }
            dayOnArray.lvlCodes.push(commonMov);
            dayOnArray.total += parseInt(total);
        });
    });
}
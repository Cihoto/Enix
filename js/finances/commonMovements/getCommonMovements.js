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
    console.log(bankMovementsData)
    COMMON_MOVEMENTS.forEach((movements) => {
        const {movements : commonMovements, income: income, id:id } = movements;
        commonMovements.forEach((movement) => {
            const { printDateTimestamp,printDate, total,index} = movement;
            let printDateFixed = printDate;

            if (moment(printDate, 'DD-MM-YYYY').month() === 1) { // February is month 1 (0-indexed)
                const day = moment(printDate, 'DD-MM-YYYY').date();
                console.log('day',day);
                if (day > 28) {
                    const isLeapYear = moment(printDate, 'DD-MM-YYYY').isLeapYear();
                    if (!isLeapYear && day > 28) {
                        printDateFixed = moment(printDate, 'DD-MM-YYYY').date(28).format('DD-MM-YYYY');
                    } else if (isLeapYear && day > 29) {
                        printDateFixed = moment(printDate, 'DD-MM-YYYY').date(29).format('DD-MM-YYYY');
                    }
                }
                    console.log('printDateFixed',printDateFixed,"printdate",printDate);
                    console.log('printDateFixed',printDateFixed,"printdate",printDate);
                    console.log('printDateFixed',printDateFixed,"printdate",printDate);
                    console.log('printDateFixed',printDateFixed,"printdate",printDate);
                    console.log('_________________________________________________________');
            }


            const timestampPrDate = moment(moment(printDate,'DD-MM-YYYY').format('YYYY-MM-DD'),'YYYY-MM-DD').format('X');
            if(timestampPrDate <= moment().format('X')){
                return
            }
            const egresoIngreso = income ? 'commonIncomeMovements' : 'commonOutcomeMovements';
            const dayOnArray = bankMovementsData[egresoIngreso].find(({timestamp}) => {
                return timestamp == timestampPrDate;
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
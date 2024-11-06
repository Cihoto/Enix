async function getCommonMovements(){
    const commonMovsResponse = await getCommonMovementsFromDb();
    console
    // const commonMovsResponse = await getAllCommonMovements();
    console.log("commonMovsResponse",commonMovsResponse);
    COMMON_MOVEMENTS = commonMovsResponse.data;

    // const commonMovements = [];
    // const commonMovements = commonMovsResponse.data;
    // console.log('commonMovements',commonMovements);
    setCommonMovementsInBankMovements();
    console.log(bankMovementsData);
    return true;
}


function setCommonMovementsInBankMovements(){
    // console.log(bankMovementsData)
    console.log("COMMON_MOVEMENTS",COMMON_MOVEMENTS);
    COMMON_MOVEMENTS.forEach((movements) => {
        const {movements : commonMovements, income: income, id:id } = movements;`1`
        commonMovements.forEach((movement) => {
            const { printDateTimestamp,printDate, total,index} = movement;
            let printDateFixed = printDate;

            if (moment(printDate, 'DD-MM-YYYY').month() === 1) { // February is month 1 (0-indexed)
                const day = moment(printDate, 'DD-MM-YYYY').date();
                if (day > 28) {
                    const isLeapYear = moment(printDate, 'DD-MM-YYYY').isLeapYear();
                    if (!isLeapYear && day > 28) {
                        printDateFixed = moment(printDate, 'DD-MM-YYYY').date(28).format('DD-MM-YYYY');
                    } else if (isLeapYear && day > 29) {
                        printDateFixed = moment(printDate, 'DD-MM-YYYY').date(29).format('DD-MM-YYYY');
                    }
                }
            }

            const timestampPrDate = moment(printDate,'YYYY-MM-DD').format('X');
            if(timestampPrDate <= moment().format('X')){
                return
            }
            const egresoIngreso = income ? 'commonIncomeMovements' : 'commonOutcomeMovements';
            const dayOnArray = bankMovementsData[egresoIngreso].find(({timestamp}) => {
                return timestamp == timestampPrDate;
            });
            if(!dayOnArray){
                // console.log("No matching day found for movement",timestampPrDate,printDate);
                return
            }
            const commonMov = {
                id: `${id}_${index}`,
                income: income,
                ...movement,
            }
            // console.log("found",dayOnArray);
            dayOnArray.lvlCodes.push(commonMov);
            dayOnArray.total += parseInt(total);
            
        });
    });

    console.log("bankMovementsData.commonIncomeMovements",bankMovementsData.commonIncomeMovements);
    console.log("bankMovementsData.commonOutcomeMovements",bankMovementsData.commonOutcomeMovements);
}
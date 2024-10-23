// Objetive: get bank movements from excel file and return it as an array of objects
let bankMovementsData = [];
let tributarieDocumentsCategories = ['charges','payments'];
// BANKMOVEMENTS EXCEL FILE
let bankExcelData = [];

// getAllMyDocuments


async function getBankAccountNumber(){
    const bankData = await fetch('./controller/Bank/getBankAccountNumber.php', {
        method: 'POST'
    });

    const data = await bankData.json();
    return data;
}

async function getBankAndTributarieDataFromExcel(){
    await Promise.all([readExcelFile_bankMovements(),readTributarieDocumentsFromExcel()]);
    getBankMovementsFromExcel();
}


async function prepareDataForFinance(){
    console.log("1")
    getAllDaysOnMonth([1,2,3,4,5,6,7,8,9,10,11,12]);
    bankMovementsData = setAllDaysOnYear();
    console.log("2");
    
    const tributarieDocuments = await readTributarieDocumentsFromExcel();
    const bankMovements = await getBankMovements();
    const commonMovements = await getCommonMovements();
}


async function getBankMovements(){
    console.log("3")
    // bankExcelData = data;
    const bankMovementsFromExcel = await readExcelFile_bankMovements();
    console.log('bankMovementsFromExcel',bankMovementsFromExcel);
    bankExcelData = bankMovementsFromExcel;
    setBankMovementsInBankMovementsData();
}

async function setBankMovementsInBankMovementsData(){
    console.log("4")
    const bankData = bankExcelData.bodyRows.map((movement) => {
        if(movement.cuenta.trim() == ""){
            return ;
        }   
        const chargeOrPayment = movement.abono > 0 ? "abono" : "cargo";
        const abono = movement.abono > 0 ? true : false;
        const fecha = moment(movement.fecha.date, 'YYYY-MM-DD HH:mm:ss.SSSSSS').format('DD-MM-YYYY');
        const fechaTimeStamp = moment(fecha,'DD-MM-YYYY').format('X');
        return {
            fecha: fecha,
            fechaTimeStamp: fechaTimeStamp,
            desc: movement.descripcion,
            monto: movement[chargeOrPayment],
            abono: abono,
        }
    }).filter((movement) => movement != undefined);

    console.log("5")
    
    // loop through all bank movements and add them to the corresponding day
    let counter = 1;
    bankData.forEach((movement) => {
        

        const { fechaTimeStamp, monto, abono } = movement;

        const egresoIngreso = abono ? 'ingresos' : 'egresos';

        const bankMovementDateIndex = bankMovementsData[egresoIngreso].findIndex(({ timestamp }) => {
            return timestamp == fechaTimeStamp;
        });

        if (bankMovementDateIndex == -1) {
            console.log("No matching day found for movement");
            return;
        }

        bankMovementsData[egresoIngreso][bankMovementDateIndex].lvlCodes.push(movement);
        bankMovementsData[egresoIngreso][bankMovementDateIndex].total += monto;

            // Merge all movements on the same day


            // console.log("6")
            // console.log('movement',movement);
            // const { fechaTimeStamp, monto, abono } = movement;
            // const egresoIngreso = abono ? 'ingresos' : 'egresos';
            // const dayOnArray = bankMovementsData[egresoIngreso].find(({ timestamp }) => {
            //     return timestamp == fechaTimeStamp;
            // });

            // if (!dayOnArray) {
            //     console.log("No matching day found for movement");
            //     return;
            // }

            // // Merge all movements on the same day
            // dayOnArray.lvlCodes.push(movement);
            // dayOnArray.total += monto;
            // counter++;
    });
    console.log('bankMovementsData_!@+_!@+_!@+_',bankMovementsData.ingresos[652]);
    console.log('bankMovementsData_!@+_!@+_!@+_',bankMovementsData.egresos[652]);

    // console.log('bankMovementsData',bankMovementsData);

    console.log('tributarieDocumentsCategories',tributarieDocumentsCategories); 
    // Get and Set all tributarie documents on future movements
    console.log('tributarieDocuments',tributarieDocuments);

    // setFutureDocumentsOnBankMovements();

    // // data for INTEC business
    // const data = {
    //     businessName: 'INTEC',
    //     businessId: 77604901,
    //     businessAccount: 63741369
    // }

}



function setAllDaysOnYear (){
    const bankMovementsData = setAllDaysOnCurrentYearTemplate();
    return bankMovementsData;
}

function setAllDaysOnCurrentYearTemplate(){
    let movementsByDate = {
        ingresos: [],
        egresos: [],
        projectedIncome : [],
        projectedOutcome : [],
        commonIncomeMovements : [],
        commonOutcomeMovements : []
    };

    const allCategories = ['ingresos','egresos','projectedIncome','projectedOutcome','commonIncomeMovements','commonOutcomeMovements'];

    allMyDates.forEach((date, index) => {
        const predate = moment(date,'YYYY-MM-DD').format('DD-MM-YYYY');
        const timeStampDate = moment(predate,'DD-MM-YYYY').format('X');
        
        const dayOfYear = moment(predate,'DD-MM-YYYY').dayOfYear();
        allCategories.forEach((category)=>{
            movementsByDate[category].push({
                humanDate: date,
                dateIndex: dayOfYear,
                timestamp: timeStampDate,
                lvlCodes: [

                ],
                total: 0
            });
        }); 
    });
    return movementsByDate;
}


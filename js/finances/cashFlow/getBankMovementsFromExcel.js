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
    getAllDaysOnMonth([1,2,3,4,5,6,7,8,9,10,11,12]);
    bankMovementsData = setAllDaysOnYear();

    

    const [tributarieDocuments, bankMovements, commonMovements] = await Promise.all([
        readTributarieDocuments(),
        getBankMovements(),
        getCommonMovements()
    ]);
}


async function getBankMovements(){
    // bankExcelData = data;
    // console.log('bankMovementsFromExcel_!@#+!_@#+!@_#+!_@#',bankMovementsFromExcel);
    // bankExcelData = bankMovementsFromExcel;

    // GET NEW DATA FROM API
    // const newBankMovements = await getBankMovementsFromAPI();
    // const bankDataAPI = getBankDataFromAPI(newBankMovements);
    const apiData = await getBankMovementsFromAPI();

    // GET DATA FROM DATABASE
    const bankMovements = await getBankMovementsFromDB();
    const bankData = getBankDataFromDB(bankMovements);
    setBankMovements_In_BankMovementsData(bankData);


    // const bankMovementsFromExcel = await readExcelFile_bankMovements();
    // bankExcelData = bankMovementsFromExcel;
    // getBankDataFromExcel(bankMovementsFromExcel)
    // setBankMovements_In_BankMovementsData(bankExcelData.bodyRows);
}

async function setBankMovements_In_BankMovementsData(bankData){

    
    // loop through all bank movements and add them to the corresponding day
    bankData.forEach((movement) => {
        
        const { fechaTimeStamp, monto, abono } = movement;
        const egresoIngreso = abono ? 'ingresos' : 'egresos';

        const bankMovementDateIndex = bankMovementsData[egresoIngreso].findIndex(({ timestamp }) => {
            return timestamp == fechaTimeStamp;
        });

        if (bankMovementDateIndex == -1) {
            // console.log("No matching day found for movement");
            return;
        }

        bankMovementsData[egresoIngreso][bankMovementDateIndex].lvlCodes.push(movement);
        bankMovementsData[egresoIngreso][bankMovementDateIndex].total += monto;
    });

    console.log("bankData",bankData);
    // console.log('bankMovementsData',bankMovementsData);
    console.log('tributarieDocumentsCategories',tributarieDocumentsCategories); 
    // Get and Set all tributarie documents on future movements
    console.log('tributarieDocuments',tributarieDocuments);
}


function getBankDataFromExcel(bankMovementsFromExcel){
    console.log('bankExcelData',bankExcelData.bodyRows);
    // const bankData = bankExcelData.bodyRows.map((movement) => {
    const bankData = bankMovementsFromExcel.bodyRows.map((movement) => {
        const {fecha: checkDate } = movement;

        let fecha; 
        if(!(checkDate instanceof Object)){
            console.log('checkDate',checkDate);
            if(movement.fecha.trim() == ""){
                return ;
            }   
            fecha = moment(movement.fecha, 'YYYY-MM-DD').format('DD-MM-YYYY');
        }else{
            fecha = moment(movement.fecha.date, 'YYYY-MM-DD HH:mm:ss.SSSSSS').format('DD-MM-YYYY');
        }

        const chargeOrPayment = movement.abono > 0 ? "abono" : "cargo";
        const abono = movement.abono > 0 ? true : false;
        const fechaTimeStamp = moment(fecha,'DD-MM-YYYY').format('X');

        return {
            fecha: fecha,
            fechaTimeStamp: fechaTimeStamp,
            desc: movement.descripcion,
            monto: movement[chargeOrPayment],
            abono: abono,
        }
    }).filter((movement) => movement != undefined);
    

    return bankData;
}

function getBankDataFromDB(bankMovements){
    console.log('bankExcelData',bankExcelData.bodyRows);
    // const bankData = bankExcelData.bodyRows.map((movement) => {
    const bankData = bankMovements.map((movement) => {
        const {date: movementDate, income, amount, desc } = movement;
        const fecha = moment(movementDate, 'YYYY-MM-DD').format('DD-MM-YYYY');
        const abono = income == 1 ? true : false;
        const fechaTimeStamp = moment(fecha,'DD-MM-YYYY').format('X');
        return {
            fecha: fecha,
            fechaTimeStamp: fechaTimeStamp,
            desc: desc,
            monto: Number(amount) || 0,
            abono: abono,
        }
    }).filter((movement) => movement != undefined);
    console.log('bankData',bankData);
    console.log('bankData',bankData);
    console.log('bankData',bankData);
    return bankData;
}

function getBankDataFromAPI(bankMovements){
    // const bankData = bankExcelData.bodyRows.map((movement) => {
    const bankData = bankMovements.map((movement) => {
        const {date: movementDate, income, amount, desc } = movement;
        const fecha = moment(movementDate, 'YYYY-MM-DD').format('DD-MM-YYYY');
        const abono = income == 1 ? true : false;
        const fechaTimeStamp = moment(fecha,'DD-MM-YYYY').format('X');
        return {
            fecha: fecha,
            fechaTimeStamp: fechaTimeStamp,
            desc: desc,
            monto: Number(amount) || 0,
            abono: abono,
        }
    }).filter((movement) => movement != undefined);
    console.log('bankData',bankData);
    console.log('bankData',bankData);
    console.log('bankData',bankData);
    return bankData;
}


async function getBankMovementsFromAPI(){

    const clayBankMovements = await fetch ('./controller/BankMovements/getBankMovementsFromClay.php',{
        request: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const clayBankMovementsData = await clayBankMovements.json();

    console.log('clayBankMovementsData',clayBankMovementsData);

    if(!clayBankMovementsData.success){
        return [];
    }
    return clayBankMovementsData.data.data.items;
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


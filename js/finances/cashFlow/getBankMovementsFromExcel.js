// Objetive: get bank movements from excel file and return it as an array of objects
let bankMovementsData = [];
let tributarieDocumentsCategories = ['charges','payments'];

// BANKMOVEMENTS EXCEL FILE
let bankExcelData = [];2

// getAllMyDocuments
async function readExcelFile(){
    const file = await fetch('./controller/ExcelManager/readExcelFile.php', {
        method: 'POST',
        body: JSON.stringify({
            fileType: 'bankMovements',
        }),
    });
    const data = await file.json();
    bankExcelData = data;
    return true;
}

async function getBankAndTributarieDataFromExcel(){
    await Promise.all([readExcelFile(),readTributarieDocumentsFromExcel()]);
    getBankMovementsFromExcel();
}

async function getBankMovementsFromExcel(){
    // const bankMovements = await readExcelFile(); 

    // search all days in year
    getAllDaysOnMonth([1,2,3,4,5,6,7,8,9,10,11,12]);
    bankMovementsData = setAllDaysOnYear();
    console.log('bankMovementsData',bankMovementsData);

    const bankData = bankExcelData.bodyRows.map((movement) => {
        if(movement.cuenta.trim() == ""){
            return ;
        }   
        let chargeOrPayment = movement.abono > 0 ? "abono" : "cargo";
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
    
    // loop through all bank movements and add them to the corresponding day
    console.log(bankMovementsData['egresos']);

    bankData.forEach((movement) => {
        const { fechaTimeStamp, monto, abono } = movement;
        const egresoIngreso = abono ? 'ingresos' : 'egresos';
        const dayOnArray = bankMovementsData[egresoIngreso].find(({timestamp}) => {
            return timestamp == fechaTimeStamp;
        });
        if(!dayOnArray){
            return
        }
        dayOnArray.lvlCodes.push(movement);
        dayOnArray.total += monto;
    });

    console.log('tributarieDocumentsCategories',tributarieDocumentsCategories); 

    // Get and Set all tributarie documents on future movements

    console.log('tributarieDocuments',tributarieDocuments);

    setFutureDocumentsOnBankMovements();

    // data for INTEC business
    const data = {
        businessName: 'INTEC',
        businessId: 77604901,
        businessAccount: 63741369
    }

    const commonMovsResponse = await getAllCommonMovements(data);

    COMMON_MOVEMENTS = commonMovsResponse.data;
    // const commonMovements = [];
    const commonMovements = commonMovsResponse.data;
    console.log('commonMovements',commonMovements);


    commonMovements.forEach((movements) => {
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


function setFutureDocumentsOnBankMovements(){

    tributarieDocumentsCategories.forEach((category) => {
        const documents = tributarieDocuments[category].filter(({contable,paid}) => contable && !paid);
        documents.forEach((document) => {

            const {emitida,fecha_expiracion,saldo} = document;
            const egresoIngreso = emitida ? 'projectedIncome' : 'projectedOutcome';
            // console.log('egresoIngreso',egresoIngreso);
            const formatDate = moment(fecha_expiracion,"DD-MM-YYYY").format('X'); 
            // const printDateTimeStamp = moment(formatDate,'YYYY-MM-DD').format('X');
             
            let printDate = formatDate;
            //get difference in days between today and expiration date
            const diffOnDaysFromEmission = moment().diff(moment(formatDate,"X"), 'days');
            if(diffOnDaysFromEmission > 0){
                // get amount of weeks between today and expiration date
                const weeks = Math.ceil(diffOnDaysFromEmission / 7);
                // add weeks to expiration date
                printDate = moment(formatDate,"X").add(weeks * 7, 'days').format('X');
            }
            const dayOnArray = bankMovementsData[egresoIngreso].find(({timestamp}) => {
                return moment(timestamp,'X').format('YYYY-MM-DD') == moment(printDate,'X').format('YYYY-MM-DD');
            });
            if(!dayOnArray){
                return
            }
            dayOnArray.lvlCodes.push(document);
            dayOnArray.total += saldo;
        });
    });
}



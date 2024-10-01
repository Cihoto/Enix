function printDailyBookTable(tbody,allDaysOnYear,
    getDocumentOutPaymentDate,
    incomeAccountRows,
    accountData_IncomeNoDocumentWithFolio, 
    accountData_OutcomeNoDocumentWithFolio,
    outRows,
    futureDocuments,
    totalDailyBalance){

    // renderMyHorizontalView();

    console.log('allDaysOnYear',allDaysOnYear);

    // INCOME   
    const incomeTr = setIncomeResumeRow();
    tbody.appendChild(incomeTr);
    // INCOME ACCOUNTS
    // console.log('incomeAccountRows',incomeAccountRows);
    incomeAccountRows.forEach((row)=>{
        tbody.appendChild(row);
    });
    // INCOME NO DOCUMENT
    const incomeNoDocumentTr = setIncomeNoDocumentRow(accountData_IncomeNoDocumentWithFolio);
    tbody.appendChild(incomeNoDocumentTr);
    // Projected Documents
    const projectedDocumentsTr = setProjectedDocumentsRow();
    tbody.appendChild(projectedDocumentsTr);

    // emptyRow

    let emptyRow1 = setEmptyRow();
    tbody.appendChild(emptyRow1); 


    // OUT
    const outComeTr = setOutcomeResumeRow();
    tbody.appendChild(outComeTr);
    // OUTA ACCOUNTS
    outRows.forEach((row)=>{
        tbody.appendChild(row);
    });
    // OUT NO DOCUMENT
    const outComeNoDocumentTr = setOutNoDocumentRow(accountData_OutcomeNoDocumentWithFolio);
    tbody.appendChild(outComeNoDocumentTr);
    // OUT PROJECTED DOCUMENTS
    const outComeProjectedDocumentsTr = setOutComeProjectedDocumentsRow();
    tbody.appendChild(outComeProjectedDocumentsTr);

    renderDailyTotalRow(allDaysOnYear);

    // emptyRow
    let emptyRow2 = setEmptyRow();
    tbody.appendChild(emptyRow2); 

    const totalTr = setTotalRow();
    tbody.appendChild(totalTr);

    createDailyBalance();
    const balanceTr = document.querySelectorAll('tbody .resumeRowBalance')[0];

    // GET ALL TR TYPES
    const incomeTrResume = document.querySelectorAll('tbody .--incomeRow');
    const outcomeTrResume = document.querySelectorAll('tbody .--outcomeRow');
    // alldays on year is an array with 365 objects
    // console.log('allDaysOnYear',allDaysOnYear);

    allDaysOnYear.ingresos.forEach((day,index)=>{
        console.log('INCOME_DAY',day);
        const dayOfYear = day.dateIndex;
        if(dayOfYear == 32){
            console.log('dayofTheYear',index,dayOfYear,day);
        }
        const total = day.total;
        day.lvlCodes.forEach((lvlCode)=>{
            let trIndex = 0;
            let totalMovements = 0;
            let objToAdd = 'debito';
            let codes = lvlCode.lvl4.split('.');
            if(codes[0] == '00' && codes[1] == '00' && codes[2] == '00' && codes[3] == '44'){
                objToAdd = 'monto';
            }

            lvlCode.movements.forEach((movement)=>{
                totalMovements += parseInt(movement[objToAdd]);
                
                incomeTrResume.forEach((element, index) => {
                    const accCode = element.querySelectorAll('td')[0].getAttribute('lvlCode') == lvlCode.lvl4;
                    if (accCode) {
                        // console.log('accCode',accCode);
                        // console.log('movement',movement);
                        trIndex = dayOfTheYear(movement.fecha_contabilizacion_humana);
                        trIndex = index;
                    }
                });
            });
            const dateIndex = getDateIndex(dayOfYear);
            if(!dateIndex){
                return;
            }
            console.log(dateIndex);

            incomeTrResume[trIndex].querySelectorAll('td')[dateIndex].innerText = getChileanCurrency(totalMovements);
        })
    });
    // return
    allDaysOnYear.egresos.forEach((day,index)=>{
        const dayOfYear = day.dateIndex;
        const total = day.total;
        day.lvlCodes.forEach((lvlCode)=>{
            let trIndex = 0;
            let totalMovements = 0;
            let objToAdd = 'credito';
            let codes = lvlCode.lvl4.split('.');
            if(codes[0] == '00' && codes[1] == '00' && codes[2] == '00' && codes[3] == '33'){
                objToAdd = 'monto';
            }

            lvlCode.movements.forEach((movement)=>{
                totalMovements += parseInt(movement[objToAdd]);
                outcomeTrResume.forEach((element, index) => {
                    const accCode = element.querySelectorAll('td')[0].getAttribute('lvlCode') == lvlCode.lvl4;
                    if (accCode) {
                        trIndex = index;
                    }
                });
            });
            const dateIndex = getDateIndex(dayOfYear);
            if(!dateIndex){
                return;
            }
            outcomeTrResume[trIndex].querySelectorAll('td')[dateIndex].innerText = getChileanCurrency(totalMovements);
        })
    });
    console.log('totalDailyBalance',totalDailyBalance);
    totalDailyBalance.forEach(({ date, totalIncome, totalOutCome, total, previousAccountBalance }, index) => {
        const dayOfYear = dayOfTheYear(date);
        const dateIndex = getDateIndex(dayOfYear);
        if(!dateIndex){
            return;
        }
        totalTr.querySelectorAll('td')[dateIndex].innerText = getChileanCurrency(total);
        balanceTr.querySelectorAll('td')[dateIndex].innerText = getChileanCurrency(previousAccountBalance);
    });
    
    getDocumentOutPaymentDate.forEach((notPaidDocument)=>{
        const dayOfYear = dayOfTheYear(notPaidDocument.fecha_humana_emision);
        let today = moment().format('YYYY-MM-DD');
        let documentDate = moment(notPaidDocument.fecha_emision,'X').format('YYYY-MM-DD');
        const expirationDate = moment(documentDate).add(1, 'months').format('YYYY-MM-DD');
        // get difference in days between today and document date
        const diffFromExpiration = moment(today).diff(expirationDate, 'days');
        const diff = moment(today).diff(documentDate, 'days');
        // if(diffFromEmissionDate < 0){}
        const weeksToMove = Math.round(diffFromExpiration / 7);
        const weeksFromEmition = Math.round(diff / 7);
        // ADD DIFF days to document date
        // ADD WEEKS TO DOCUMENT DATE
        const newDate = moment(documentDate).add(weeksFromEmition, 'weeks').format('YYYY-MM-DD');
        const newDayOfYear = dayOfTheYear(newDate);
        const newDayIndex = getDateIndex(newDayOfYear);
        if(!newDayIndex){
            return;
        }
        if(weeksToMove > 1){
            projectedDocumentsTr.querySelectorAll('td')[newDayIndex].classList.add('red');
        }else{
            projectedDocumentsTr.querySelectorAll('td')[newDayIndex].classList.add('yellow');
        }
        projectedDocumentsTr.querySelectorAll('td')[newDayIndex].innerText = getChileanCurrency(notPaidDocument.total.total);
    });

    futureDocuments.forEach((futureDocument)=>{ 
        const dayOfYear = dayOfTheYear(moment(futureDocument.futureDate,'X').format('YYYY-MM-DD'));
        const dateIndex = getDateIndex(dayOfYear);
        if(!dateIndex){
            return;
        }
        if(futureDocument.recibida == true){
            // outComeProjectedDocumentsTr.querySelectorAll('td')[dayOfYear].classList.add('yellow');
            outComeProjectedDocumentsTr.querySelectorAll('td')[dateIndex].innerText = getChileanCurrency(futureDocument.total.total);
        }else{
            // projectedDocumentsTr.querySelectorAll('td')[dayOfYear].classList.add('yellow');
            projectedDocumentsTr.querySelectorAll('td')[dateIndex].innerText = getChileanCurrency(futureDocument.total.total);
        }
    });
    console.log('totalDailyBalance',totalDailyBalance);
    console.log('totalDailyBalance',totalDailyBalance);
    console.log('future',futureDocuments);
    console.log('future',futureDocuments);
    const CARD_DATA = getMyCardsData(totalDailyBalance,futureDocuments);
    console.log('CARD_DATA',CARD_DATA);
    console.log('CARD_DATA',CARD_DATA);
    console.log('CARD_DATA',CARD_DATA);
    console.log('CARD_DATA',CARD_DATA);
    setBankResumeData(CARD_DATA);
}


function renderDailyTotalRow(alldaysOnYear){
    const incomeTrResume = document.querySelectorAll('tbody .resumeRowIncome');
    const outComeTrResume = document.querySelectorAll('tbody .resumeRowOutCome');
    const ingresos = alldaysOnYear.ingresos;
    const egresos = alldaysOnYear.egresos;

    console.log('ingresos',ingresos);

    

    ingresos.forEach((day)=>{
        const dayOfYear = dayOfTheYear(day.humanDate);
        const dateIndex = getDateIndex(dayOfYear);
        console.log('dateIndex',dateIndex);
        if(!dateIndex){
            return;
        }
        // console.log('alldaysOnYear.ingresos[dayOfYear - 1]',alldaysOnYear.ingresos[dateIndex - 1])
        if(!alldaysOnYear.ingresos[dateIndex - 1]){
            return;
        }
        console.log(`incomeTrResume[0].querySelectorAll('td')[dateIndex]`,incomeTrResume[0].querySelectorAll('td')[dateIndex]);
        if(!incomeTrResume[0].querySelectorAll('td')[dateIndex]){
            return;
        }
        console.log('alldaysOnYear.ingresos[dateIndex].total',alldaysOnYear.ingresos);
        const dateIndexTotals = alldaysOnYear.ingresos.find((day)=>{return day.dateIndex == dayOfYear});
        if(!dateIndexTotals){return};
        console.log('dateIndexTotals',dateIndexTotals);
        console.log('dateIndexTotals',dateIndexTotals);
        console.log('dateIndexTotals',dateIndexTotals);
        console.log(`incomeTrResume[0].querySelectorAll('td')[dateIndex]`,incomeTrResume[0].querySelectorAll('td')[dateIndex])
        console.log(`dateIndexTotals.total_+!@+_!+_!+_!+_+!_+!_+!_+!_+!_+!_+_!`,dateIndexTotals.total)
        incomeTrResume[0]
            .querySelectorAll('td')[dateIndex]
            .innerText = getChileanCurrency(dateIndexTotals.total);
    });

    egresos.forEach((day)=>{
        const dayOfYear = dayOfTheYear(day.humanDate);
        const dateIndex = getDateIndex(dayOfYear);
        if(!dateIndex){
            return;
        }
        if(!alldaysOnYear.egresos[dateIndex - 1]){
            return;
        }
        if(!outComeTrResume[0].querySelectorAll('td')[dateIndex]){
            return;
        }
        const dateIndexTotals = alldaysOnYear.ingresos.find((day)=>{return day.dateIndex == dayOfYear});
        if(!dateIndexTotals){return};

        outComeTrResume[0]
            .querySelectorAll('td')[dateIndex]
            .innerText = getChileanCurrency(dateIndexTotals.total);
    });
}

function getDateIndex(dayOfTheYear){

    let dateIndex;
    let found = false;

    // find all th on allMyDatesTr  
    const allMyDatesTr = document.querySelectorAll('.allDates')[0];
    // console.log('allMyDatesTr',allMyDatesTr);
    allMyDatesTr.querySelectorAll('th').forEach((date,index)=>{
        if(date.getAttribute('doty') == dayOfTheYear){
            // console.log('date',date);
            // console.log('DAYOFTHEYEAR',dayOfTheYear);
            found = true;
            dateIndex = index;
        }
    });
    console.log('found',found);
    if(!found){
        return false
    }
    return dateIndex;
}



function getMyCardsData(totalDailyBalance,futureDocuments){
    console.log('totalDailyBalance',totalDailyBalance);

    const data = {
        currentBankBalance: 0,
        pendingPayments: {
            total: 0,
            pendingDocuments: 0,
        },
        pendingCharges: {
            total: 0,
            pendingDocuments: 0,
        }
    };

    const today = moment().format('YYYY-MM-DD');
    const todayIndex = dayOfTheYear(today);

    console.log('totalDailyBalance',totalDailyBalance);
    console.log('totalDailyBalance.length',totalDailyBalance.length);
    const lastIndex = totalDailyBalance.length - 1;
    console.log('totalDailyBalance',totalDailyBalance[lastIndex]);
    if(!totalDailyBalance[lastIndex]){return}
    const todayBalance = totalDailyBalance[lastIndex].previousAccountBalance;

    // const todayBalance = totalDailyBalance[todayIndex - 1].previousAccountBalance;
    data.currentBankBalance = todayBalance;
    let totalPendingPayments = 0;
    let totalPendingCharges = 0;
    futureDocuments.forEach((futureDocument)=>{

        if(futureDocument.pagada == true){
            return;
        }  
        const totalDocument = futureDocument.total.total;
        if(futureDocument.recibida == true){
            data.pendingCharges.total += parseInt(totalDocument);
            data.pendingCharges.pendingDocuments++;
        }else{
            data.pendingPayments.total += parseInt(totalDocument);
            data.pendingPayments.pendingDocuments++;
        }
    });
    return data;
}
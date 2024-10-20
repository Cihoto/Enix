

// CABO DE HORNOS

// RUT 76275907
// CUENTA 4449398
let cashFlowTotals = {
    initialBankAccount: 0,
    currentBankBalance: 0,
    totals: []
}
// INTEC
// RUT 77604901
// CUENTA 63741369
// let cashFlowTotals = {
//     initialBankAccount: 18895572,
//     currentBankBalance: 0,
//     totals: []
// }

let bankMovementsCatergories = ['ingresos', 'egresos', 'projectedIncome', 'projectedOutcome', 'commonIncomeMovements', 'commonOutcomeMovements'];

async function renderMyChasFlowTable(pickedMonth,selectedYear) {

    if(!activePage.cashFlow){
        return;
    }
    await getInitialBankAccountBalance();
    console.log('cashFlowTotals',cashFlowTotals);
    // get all days on current year
    const allDaysOnYear = getAllDaysBetweenYears([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],selectedYear);
    // console.log('allDaysOnYear',allDaysOnYear);
    let previousAccountBalance = cashFlowTotals.initialBankAccount;
    
    console.log('bankMovementsData.ingresos',bankMovementsData.ingresos);


    console.log("allmydates,",allMyDates);

    const hoyIndex = allMyDates.findIndex((myDate) => myDate == moment().format('YYYY-MM-DD'));
    const totalDailyBalance = allDaysOnYear.map((date, index) => {
        // console.log(bankMovementsData.ingresos[index]);
        // console.log('indewx',index);
        // console.log('date',date);
        const indexOnAllMydates = allMyDates.findIndex((myDate) => myDate == date);

        const totalIncome = bankMovementsData.ingresos[indexOnAllMydates].total;
        const totalOutCome = bankMovementsData.egresos[indexOnAllMydates].total;
        const totalProjectedIncome = bankMovementsData.projectedIncome[indexOnAllMydates].total;
        const totalProjectedOutcome = bankMovementsData.projectedOutcome[indexOnAllMydates].total;
        let totalProjected = 0;
        if(moment(date, 'YYYY-MM-DD').dayOfYear() >= moment().dayOfYear()){
            totalProjected = totalProjectedIncome - totalProjectedOutcome
        }

        const totalCommonIncomeMovements = bankMovementsData.commonIncomeMovements[indexOnAllMydates].total;
        const totalCommonOutcomeMovements = bankMovementsData.commonOutcomeMovements[indexOnAllMydates].total;
        const total = totalIncome + totalCommonIncomeMovements  - totalOutCome - totalCommonOutcomeMovements + totalProjected;
        previousAccountBalance += total;
        return {
            date,
            timestamp: moment(date).format('X'),
            dayOfYear: moment(date).dayOfYear(),
            totalIncome,
            totalOutCome,
            total,
            previousAccountBalance,
        }
    });
    cashFlowTotals.totals = totalDailyBalance;
    console.log('totalDailyBalance', totalDailyBalance);
    console.log('totalDailyBalance', totalDailyBalance);
    console.log('totalDailyBalance', totalDailyBalance);
    
    // remove All table trs
    removeAllTableRows();
    // Create thead and add all dates associated to the selected month
    renderMyHorizontalView([pickedMonth],selectedYear);
    // TOTAL income tr
    const totalIncomeTr = setTotalIncomeResumeRow();
    tbody.appendChild(totalIncomeTr);

    // income tr
    const incomeTr = setNewincomeRow('Ingresos', 'ingresos');
    tbody.appendChild(incomeTr);
    // Projected Documents INCOME
    const projectedDocumentsTr = setNewincomeRow('Ingresos futuros', 'projectedIncome');
    tbody.appendChild(projectedDocumentsTr);

    // Projected Documents INCOME
    const projectedOutDatedDocumentsTr = setNewincomeRow('Ingresos atrasados', 'projectedOutdatedIncomeRow');
    tbody.appendChild(projectedOutDatedDocumentsTr);

    // Projected Documents INCOME
    const frecuentIncomeRow = setNewincomeRow('Ingresos frecuentes', 'commonIncomeMovements');
    tbody.appendChild(frecuentIncomeRow);
    // empty row
    let emptyRow1 = setEmptyRow();
    tbody.appendChild(emptyRow1);
    // OUT
    const totalOutComeTr = setOutcomeResumeRow();
    tbody.appendChild(totalOutComeTr);
    // otucomerow
    const outcomTr = setNewincomeRow('Egresos', 'egresos');
    tbody.appendChild(outcomTr);
    //Future outcome
    const outComeProjectedDocumentsTr = setNewincomeRow('Egresos futuros', 'projectedOutcome');
    tbody.appendChild(outComeProjectedDocumentsTr);
    // Projected Documents outcome outdated
    const projectedOutDatedDocumentsTrOut = setNewincomeRow('Egresos atrasados', 'projectedOutdatedOutcomeRow');
    tbody.appendChild(projectedOutDatedDocumentsTrOut);
    // common outcomes
    const frecuentOutcomeRow = setNewincomeRow('Egresos recurrentes', 'commonOutcomeMovements');
    tbody.appendChild(frecuentOutcomeRow);
    // emptyRow
    let emptyRow2 = setEmptyRow();
    tbody.appendChild(emptyRow2);
    // CREATE TOTAL ROW 
    const totalTr = setTotalRow();
    tbody.appendChild(totalTr);
    // CREATE BALANCE ROW
    createDailyBalance();

    // get first and last day of selected month with his day of the year
    const firstDay = moment(pickedMonth, 'M').startOf('month').dayOfYear();
    const lastDay = moment(pickedMonth, 'M').endOf('month').dayOfYear();

    // const bankMovementsOnSelectedMonth = totalDailyBalance.filter(({ dayOfYear }) => {
    //     return dayOfYear >= firstDay && dayOfYear <= lastDay;
    // });

    // filter all days on selected month
    const selectedMonthDays = totalDailyBalance.filter(({ dayOfYear,date }) => {
        return dayOfYear >= firstDay && dayOfYear <= lastDay  && moment(date).year() == selectedYear;
    });
    console.log('selectedMonthDays__', selectedMonthDays);
    const totalRow = document.getElementsByClassName('resumeRowTotal')[0];
    const balanceRow = document.getElementsByClassName('resumeRowBalance')[0];

    // console.log('selectedMonthDays', selectedMonthDays);
    // add all totals to corresponding day
    selectedMonthDays.forEach((day) => {
        const { date, totalIncome, totalOutCome, total, previousAccountBalance, dayOfYear } = day;
        console.log('day', day);
        
        // const tr = document.createElement('tr');
        const dateIndex = getDateHeaderIndex(dayOfYear - 1,selectedYear);
        if (!dateIndex) {
            return;
        }

        totalRow.children[dateIndex].innerHTML = getChileanCurrency(total);
        balanceRow.children[dateIndex].innerHTML = getChileanCurrency(previousAccountBalance);
    });
    const ingresosTr = document.getElementsByClassName('resumeRowIncome')[0];
    const egresosTr = document.getElementsByClassName('resumeRowOutCome')[0];

    // income rows
    const incomeRow = document.querySelectorAll('tr[lvlcode="ingresos"]')[0];
    const projectedIncomeRow = document.querySelectorAll('tr[lvlcode="projectedIncome"]')[0];
    const projectedOutdatedIncomeRow = document.querySelectorAll('tr[lvlcode="projectedOutdatedIncomeRow"]')[0];
    const commonIncomeMovements = document.querySelectorAll('tr[lvlcode="commonIncomeMovements"]')[0];
    // outcome rows
    const outcomeRow = document.querySelectorAll('tr[lvlcode="egresos"]')[0];
    const projectedOutcomeRow = document.querySelectorAll('tr[lvlcode="projectedOutcome"]')[0];
    const projectedOutdatedOutcomeRow = document.querySelectorAll('tr[lvlcode="projectedOutdatedOutcomeRow"]')[0];
    const commonOutcomeMovements = document.querySelectorAll('tr[lvlcode="commonOutcomeMovements"]')[0];

    // get last day of current year  and get current day of the year
    // const lastDayOfYear = moment().endOf('year').dayOfYear();

    // get amount of days on x year 
    const firstDayOfSelectedYear  = moment(selectedYear,'YYYY').startOf('year').dayOfYear();
    const lastDayOfYear  = moment(selectedYear,'YYYY').endOf('year').dayOfYear();

    // find  firstDayOfSelectedYear and lastDayOfYear on allMyDates
    const firstDayOfSelectedYearIndex = allMyDates.findIndex((myDate) => myDate == moment(`${selectedYear}-${firstDayOfSelectedYear}`, 'YYYY-DDD').format('YYYY-MM-DD'));
    console.log('firstDayOfSelectedYearIndex',firstDayOfSelectedYearIndex);
    console.log(bankMovementsData.ingresos[firstDayOfSelectedYearIndex]);

    const lastDayOfYearIndex = allMyDates.findIndex((myDate) => myDate == moment(`${selectedYear}-${lastDayOfYear}`, 'YYYY-DDD').format('YYYY-MM-DD'));
    const todayIndex = allMyDates.findIndex((myDate) => myDate == moment().format('YYYY-MM-DD'));

    console.log(firstDayOfSelectedYearIndex,lastDayOfYearIndex,todayIndex)
    console.log(firstDayOfSelectedYearIndex,lastDayOfYearIndex,todayIndex)
    console.log(firstDayOfSelectedYearIndex,lastDayOfYearIndex,todayIndex)
    console.log(firstDayOfSelectedYearIndex,lastDayOfYearIndex,todayIndex)

    console.log('________________________________________________________________________________________________________');
    console.log('________________________________________________________________________________________________________');
    console.log('________________________________________________________________________________________________________');



    // ingresos
    // projectedIncome
    // commonIncomeMovements

    // egresos
    // projectedOutcome
    // commonOutcomeMovements
    for (let index = firstDayOfSelectedYearIndex; index <= lastDayOfYearIndex; index++) {
       
        const indexOnAllMydates = index;
        // console.log(index);
        // console.log(index);
        // console.log(index);
        // console.log(index);
        // console.log(index);


        if(index <= todayIndex){
            console.log('index',index);
            console.log(bankMovementsData.ingresos[indexOnAllMydates]);

            const totalIncome = bankMovementsData.ingresos[indexOnAllMydates].total;
            const totalOutcome = bankMovementsData.egresos[indexOnAllMydates].total;
            let projectedIncome = 0;
            let projectedOutcome = 0;
            
            if(todayIndex == index){
                projectedIncome = bankMovementsData.projectedIncome[indexOnAllMydates].total;
                projectedOutcome = bankMovementsData.projectedOutcome[indexOnAllMydates].total;
            }

            // PUT VALUES ON TABLE
            const doty = getDateHeaderIndex(index,selectedYear);
            if (!doty) {
                // skip one loop
                continue;
            }
            // INCOME
            console.log(ingresosTr.children[doty]);
            // INCOME   
            ingresosTr.children[doty].innerHTML = getChileanCurrency(totalIncome);
            incomeRow.children[doty].innerHTML = getChileanCurrency(totalIncome);
            // OUTCOME  
            egresosTr.children[doty].innerHTML = getChileanCurrency(totalOutcome);
            outcomeRow.children[doty].innerHTML = getChileanCurrency(totalOutcome);
            // activate or deactivate projected income row
            projectedIncomeRow.children[doty].innerHTML = getChileanCurrency(projectedIncome);
            projectedOutdatedIncomeRow.children[doty].innerHTML = getChileanCurrency(0);
            commonIncomeMovements.children[doty].innerHTML = getChileanCurrency(0);
            projectedOutcomeRow.children[doty].innerHTML = getChileanCurrency(projectedOutcome);
            projectedOutdatedOutcomeRow.children[doty].innerHTML = getChileanCurrency(0);
            commonOutcomeMovements.children[doty].innerHTML = getChileanCurrency(0);

        
            continue
        }
        

        // PUT VALUES ON TABLE
        const doty = getDateHeaderIndex(index,selectedYear);
        // console.log('doty',doty);
        // console.log(allMyDates[index]);

        if (!doty) {
            // skip one loop
            continue;
        }
        // console.log('POST 3123123123',index); 
        const totals = {
            income:{
                total:0,
                projected: 0,
                outdated: 0,
                common: 0,
            },
            outcome:{
                total:0,
                projected: 0,
                outdated: 0,
                common: 0,
            }
        }
        console.log(index)
        console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++")
        console.log(`+++++++++++++++++++++++++++++++++++++++++++++++++++ ${index} +++++++++++++++++++++++++++++++++++++++++++++++++++`)
        console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++" ,bankMovementsData.projectedIncome[index])
        console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++")
        bankMovementsData.projectedIncome[index].lvlCodes.forEach((lvlCode) => {
            const { vencida_por, saldo } = lvlCode;
            if(lvlCode.folio == 264 || lvlCode.folio == 277){
                console.log('lvlCode|_|_|_|_|_|_|_|_|_|_|_|_|_|_||_|_|_|_|_|_|_|_|_|||_||_||_',lvlCode);
                console.log('lvlCode|_|_|_|_|_|_|_|_|_|_|_|_|_|_||_|_|_|_|_|_|_|_|_|||_||_||_',lvlCode);
                console.log('lvlCode|_|_|_|_|_|_|_|_|_|_|_|_|_|_||_|_|_|_|_|_|_|_|_|||_||_||_',lvlCode);
                console.log('lvlCode|_|_|_|_|_|_|_|_|_|_|_|_|_|_||_|_|_|_|_|_|_|_|_|||_||_||_',lvlCode);
            }
            if(index != todayIndex){
                totals.income.total += saldo;
            }
            if (vencida_por <= 0) {
                totals.income.projected += saldo;
            } else {

                totals.income.outdated += saldo;
            }
        });
        // get outdated outcome
        bankMovementsData.projectedOutcome[index].lvlCodes.forEach((lvlCode) => {
            const { vencida_por, saldo } = lvlCode;
            if(index != todayIndex){
                totals.outcome.total += saldo;
            }
            if (vencida_por <= 0) {
                totals.outcome.projected += saldo;
            } else {
                totals.outcome.outdated += saldo;
            }
        });
        bankMovementsData.commonIncomeMovements[index].lvlCodes.forEach((lvlCode) => {
            const { total } = lvlCode;
            if(index != todayIndex){
                totals.income.total += total;
            }
            totals.income.common += total;

        });
        bankMovementsData.commonOutcomeMovements[index].lvlCodes.forEach((lvlCode) => {
            const { total } = lvlCode;

            if(index > 272 && index < 280){
                console.log('index',index);
                
                console.log('bankMovementsData.commonOutcomeMovements[index]',bankMovementsData.commonOutcomeMovements[index])
            }
            if(index != todayIndex){
                totals.outcome.total += total;
            }
            totals.outcome.common += total;
        });


        // console.log(totals)
       
        // INCOME   
        ingresosTr.children[doty].innerHTML = getChileanCurrency(totals.income.total);
        incomeRow.children[doty].innerHTML = getChileanCurrency(0);
        // OUTCOME  
        egresosTr.children[doty].innerHTML = getChileanCurrency(totals.outcome.total);
        outcomeRow.children[doty].innerHTML = getChileanCurrency(0);
        // activate or deactivate projected income row
        projectedIncomeRow.children[doty].innerHTML = getChileanCurrency(totals.income.projected);
        projectedOutdatedIncomeRow.children[doty].innerHTML = getChileanCurrency(totals.income.outdated);
        commonIncomeMovements.children[doty].innerHTML = getChileanCurrency(totals.income.common);
        projectedOutcomeRow.children[doty].innerHTML = getChileanCurrency(totals.outcome.projected);
        projectedOutdatedOutcomeRow.children[doty].innerHTML = getChileanCurrency(totals.outcome.outdated);
        commonOutcomeMovements.children[doty].innerHTML = getChileanCurrency(totals.outcome.common);


        if(totals.income.projected > 0 && index == todayIndex){
            projectedIncomeRow.children[doty].classList.add('noContableTotal')
        }

        if(totals.income.outdated > 0 && index == todayIndex){
            projectedOutdatedIncomeRow.children[doty].classList.add('noContableTotal')
        }

        if(totals.outcome.projected > 0 && index == todayIndex){
            projectedOutcomeRow.children[doty].classList.add('noContableTotal')
        }

        if(totals.outcome.outdated > 0 && index == todayIndex){
            projectedOutdatedOutcomeRow.children[doty].classList.add('noContableTotal')
        }



        continue

        // console.log("++++_+_+_+_+_+_+_+_+_+_+_+_+_+_+_")
        // if(index == 652 || index == 653){
        //     console.log('index',index);
        //     console.log('indexOnAllMydates',indexOnAllMydates);
        //     console.log('bankMovementsData.ingresos[indexOnAllMydates]',bankMovementsData.ingresos[indexOnAllMydates]);
        //     console.log('bankMovementsData.egresos[indexOnAllMydates]',bankMovementsData.egresos[indexOnAllMydates]);

        //     const dotyy = getDateHeaderIndex(index,selectedYear);
        //     console.log('dotyy',dotyy);
        //     console.log('dotyy',dotyy);
        //     console.log('dotyy',dotyy);
        //     console.log('dotyy',dotyy);
        //     console.log('dotyy',dotyy);
        //     console.log('ingresosTr.children[doty]',ingresosTr.children[doty])
        //     console.log('incomeRow.children[doty]',incomeRow.children[doty])
        // }

        if (index <= todayIndex) {

            const totalIncome = bankMovementsData.ingresos[indexOnAllMydates - 1].total;
            // console.log('bankMovementsData.ingresos[indexOnAllMydates - 1]',bankMovementsData.ingresos[indexOnAllMydates - 1]);
            const totalOutcome = bankMovementsData.egresos[indexOnAllMydates - 1].total;

            // console.log('bankMovementsData.ingresos[indexOnAllMydates - 1]',bankMovementsData.ingresos[indexOnAllMydates - 1]);
            // console.log('bankMovementsData.egresos[indexOnAllMydates - 1]',bankMovementsData.egresos[indexOnAllMydates - 1]);


            // PUT VALUES ON TABLE
            const doty = getDateHeaderIndex(index,selectedYear);
            if (!doty) {
                // skip one loop
                continue;
            }
            // INCOME   
            ingresosTr.children[doty].innerHTML = getChileanCurrency(totalIncome);
            incomeRow.children[doty].innerHTML = getChileanCurrency(totalIncome);
            // OUTCOME  
            egresosTr.children[doty].innerHTML = getChileanCurrency(totalOutcome);
            outcomeRow.children[doty].innerHTML = getChileanCurrency(totalOutcome);
            // activate or deactivate projected income row
            projectedIncomeRow.children[doty].innerHTML = getChileanCurrency(0);
            projectedOutdatedIncomeRow.children[doty].innerHTML = getChileanCurrency(0);
            commonIncomeMovements.children[doty].innerHTML = getChileanCurrency(0);
            projectedOutcomeRow.children[doty].innerHTML = getChileanCurrency(0);
            projectedOutdatedOutcomeRow.children[doty].innerHTML = getChileanCurrency(0);
            commonOutcomeMovements.children[doty].innerHTML = getChileanCurrency(0);
            continue;
        }

        continue;
        


        
        // console.log(bankMovementsData.projectedIncome)
        // console.log('bankMovementsData.INCOME_COMMON',bankMovementsData.commonIncomeMovements);
        // console.log('bankMovementsData.OUTCOME_COMMON',bankMovementsData.commonOutcomeMovements);
        // get outdated income
        // console.log('index',index)
        // console.log('indexOnAllMydates',indexOnAllMydates)
        // console.log('bankMovementsData.projectedIncome[index - 1]',bankMovementsData.projectedIncome[index - 1])
        // console.log('bankMovementsData.projectedIncome[index - 1]',bankMovementsData.projectedIncome[indexOnAllMydates])

    }


    // const dayOfTheYear = getDateHeaderIndex(moment().dayOfYear(),selectedYear);
    const cashFlowT = document.querySelectorAll('#bankMovementsTableHorizontal.cashFlowTable')[0];
    const trs = cashFlowT.getElementsByTagName('tr');
    
    // trs.forEach((tr) => {
    //     const tds = tr.getElementsByTagName('td');
    //     tds.forEach((td, index) => {
    //         if (index == dayOfTheYear) {
    //             td.style.backgroundColor = '#f0ffff';
    //         }
    //     });
    //     const th = tr.getElementsByTagName('th');
    //     th.forEach((td, index) => {
    //         if (index == dayOfTheYear) {
    //             td.style.backgroundColor = '#f0ffff ';
    //         }
    //     });        
    // });
}

function getDateHeaderIndex(date,selectedYear = 2024) {
    const dateHeaderRow = document.querySelectorAll('.allDates')[0];
    const theadData = dateHeaderRow.getElementsByClassName('dateHeader');

    const dotyOnAllMyDates = moment(allMyDates[date], 'YYYY-MM-DD').dayOfYear();
    // console.log('date',date);
    // console.log('dotyOnAllMyDates',dotyOnAllMyDates);
    // console.log('dotyOnAllMyDates',allMyDates[date]);
    // console.log('dotyOnAllMyDates -1 ',allMyDates[date - 1]);
    // console.log('dotyOnAllMyDates',allMyDates[date]);
    // console.log('dotyOnAllMyDates',dotyOnAllMyDates);

    for (let index = 0; index < theadData.length; index++) {
        const dateIndex = theadData[index].getAttribute('doty');
        const year = theadData[index].getAttribute('yr');
        if (dateIndex == dotyOnAllMyDates && year == selectedYear) {
            return index + 1;
        }
    }
}
function removeAllTableRows() {
    $('#bankMovementsTableHorizontal tr').remove();
}
function setNewHeaderIncomeRow() {
    const tr = document.createElement('tr');
    tr.classList.add('resumeRowIncome', '--headerRow');
    let firstTd = `<td id="resumeRowIncome">Total ingresos</td>`;
    let contentTd = ''
    for (let i = 1; i <= allDaysInMonth.length; i++) {
        contentTd += '<td></td>';
    }
    tr.innerHTML = `${firstTd}${contentTd}`;
    return tr;
}

function setNewincomeRow(rowName, code) {
    const tr = document.createElement('tr');
    tr.classList.add('codeAccountRow', '--selectableRow', '--incomeRow');
    tr.setAttribute('lvlCode', code);
    let firstTd = `<td lvlCode='${code}'>${rowName}</td>`;
    let contentTd = ''
    for (let i = 1; i <= allDaysInMonth.length; i++) {
        contentTd += '<td></td>';
    }
    tr.innerHTML = `${firstTd}${contentTd}`;
    return tr;
}

async function getInitialBankAccountBalance(){
    const bankAccountData = await fetch ('./controller/session/getInitialBankAccountBalance.php',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
    const bankAccount = await bankAccountData.json();
    cashFlowTotals.initialBankAccount = bankAccount.bankAccount.initial_balance;
    return true;
}
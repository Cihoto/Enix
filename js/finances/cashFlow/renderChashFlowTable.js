let cashFlowTotals = {
    initialBankAccount: 18895572,
    currentBankBalance: 0,
    totals: []
}

let bankMovementsCatergories = ['ingresos', 'egresos', 'projectedIncome', 'projectedOutcome', 'commonIncomeMovements', 'commonOutcomeMovements'];

function renderMyChasFlowTable(pickedMonth) {
    // get all days on current year
    const allDaysOnYear = getAllDaysOnMonth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    let previousAccountBalance = cashFlowTotals.initialBankAccount;
    const totalDailyBalance = allDaysOnYear.map((date, index) => {
        const totalIncome = bankMovementsData.ingresos[index].total;
        const totalOutCome = bankMovementsData.egresos[index].total;
        const totalProjectedIncome = bankMovementsData.projectedIncome[index].total;
        const totalProjectedOutcome = bankMovementsData.projectedOutcome[index].total;
        const totalCommonIncomeMovements = bankMovementsData.commonIncomeMovements[index].total;
        const totalCommonOutcomeMovements = bankMovementsData.commonOutcomeMovements[index].total;
        const total = totalIncome + totalProjectedIncome + totalCommonIncomeMovements - totalProjectedOutcome - totalOutCome - totalCommonOutcomeMovements;
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
    // remove All table trs
    removeAllTableRows();
    // Create thead and add all dates associated to the selected month
    renderMyHorizontalView([pickedMonth]);
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

    const bankMovementsOnSelectedMonth = totalDailyBalance.filter(({ dayOfYear }) => {
        return dayOfYear >= firstDay && dayOfYear <= lastDay;
    });
    // filter all days on selected month
    const selectedMonthDays = totalDailyBalance.filter(({ dayOfYear }) => {
        return dayOfYear >= firstDay && dayOfYear <= lastDay;
    });
    const totalRow = document.getElementsByClassName('resumeRowTotal')[0];
    const balanceRow = document.getElementsByClassName('resumeRowBalance')[0];

    console.log('selectedMonthDays', selectedMonthDays);
    // add all totals to corresponding day
    selectedMonthDays.forEach((day) => {
        const { date, totalIncome, totalOutCome, total, previousAccountBalance, dayOfYear } = day;
        const tr = document.createElement('tr');
        const dateIndex = getDateHeaderIndex(dayOfYear);
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
    const lastDayOfYear = moment().endOf('year').dayOfYear();

    // ingresos
    // projectedIncome
    // commonIncomeMovements

    // egresos
    // projectedOutcome
    // commonOutcomeMovements
    for (let index = 1; index <= lastDayOfYear; index++) {
        const todayIndex = moment().dayOfYear();
        if (index <= todayIndex) {
            const totalIncome = bankMovementsData.ingresos[index - 1].total;
            const totalOutcome = bankMovementsData.egresos[index - 1].total;

            // PUT VALUES ON TABLE
            const doty = getDateHeaderIndex(index);
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

        // PUT VALUES ON TABLE
        const doty = getDateHeaderIndex(index);
        if (!doty) {
            // skip one loop
            continue;
        }
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

        console.log(bankMovementsData.projectedIncome[index - 1].lvlCodes)
        // get outdated income
        bankMovementsData.projectedIncome[index - 1].lvlCodes.forEach((lvlCode) => {
            const { vencida_por, saldo } = lvlCode;
            totals.income.total += saldo;
            if (vencida_por <= 0) {
                totals.income.projected += saldo;
            } else {
                totals.income.outdated += saldo;
            }
        });
        // get outdated outcome
        bankMovementsData.projectedOutcome[index - 1].lvlCodes.forEach((lvlCode) => {
            const { vencida_por, saldo } = lvlCode;
            totals.outcome.total += saldo;
            if (vencida_por <= 0) {
                totals.outcome.projected += saldo;
            } else {
                totals.outcome.outdated += saldo;
            }
        });
        bankMovementsData.commonIncomeMovements[index - 1].lvlCodes.forEach((lvlCode) => {
            const { total } = lvlCode;
            totals.income.total += total;
            totals.income.common += total;

        });
        bankMovementsData.commonOutcomeMovements[index - 1].lvlCodes.forEach((lvlCode) => {
            const { total } = lvlCode;
            totals.outcome.total += total;
            totals.outcome.common += total;
        });
       
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
    }
}

function getDateHeaderIndex(date) {
    const dateHeaderRow = document.querySelectorAll('.allDates')[0];
    const theadData = dateHeaderRow.getElementsByClassName('dateHeader');

    for (let index = 0; index < theadData.length; index++) {
        const dateIndex = theadData[index].getAttribute('doty');
        if (dateIndex == date) {
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
    for (let i = 1; i <= allMyDates.length; i++) {
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
    for (let i = 1; i <= allMyDates.length; i++) {
        contentTd += '<td></td>';
    }
    tr.innerHTML = `${firstTd}${contentTd}`;
    return tr;
}

function headerOutComeRow() {

}

function outcomeRow() {

}
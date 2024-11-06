// Dependencies: js/finances/cashFlow/getInitialBankAccountBalance.js
// const table = document.getElementById("bankMovementsTableHorizontal");
// const thead = table.getElementsByTagName("thead")[0];
// const tbody = table.getElementsByTagName("tbody")[0];
// const tfoot = table.getElementsByTagName("tfoot")[0];

async function resumeCshFlowMonthly(selectedYear = moment().format('YYYY')) {
    console.log('resumeCshFlowMonthly');
    console.log('selectedYear',selectedYear);
    await getInitialBankAccountBalance();
    const allDaysOnYear = getAllDaysBetweenYears([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], selectedYear);
    let previousAccountBalance = cashFlowTotals.initialBankAccount;

    console.log('selectedYear',selectedYear);
    console.log('allDaysOnYear',allDaysOnYear);

    const totalDailyBalance = allDaysOnYear.map((date) => {

        const indexOnAllMydates = allMyDates.findIndex((myDate) => myDate == date);

        let totalIncome = bankMovementsData.ingresos[indexOnAllMydates].total;
        let totalOutCome = bankMovementsData.egresos[indexOnAllMydates].total;
        const totalProjectedIncome = bankMovementsData.projectedIncome[indexOnAllMydates].total;
        const totalProjectedOutcome = bankMovementsData.projectedOutcome[indexOnAllMydates].total;
        const totalCommonIncomeMovements = bankMovementsData.commonIncomeMovements[indexOnAllMydates].total;
        const totalCommonOutcomeMovements = bankMovementsData.commonOutcomeMovements[indexOnAllMydates].total;

        let totalProjected = 0;
        if ((selectedYear == moment().format('YYYY')) && (moment(date).dayOfYear() > moment().dayOfYear())) {
            totalProjected = totalProjectedIncome - totalProjectedOutcome;
            totalIncome += totalCommonIncomeMovements;
            totalOutCome += totalCommonOutcomeMovements;
        }else if(selectedYear != moment().format('YYYY')){
            totalProjected = totalProjectedIncome - totalProjectedOutcome;
            totalIncome += totalCommonIncomeMovements;
            totalOutCome += totalCommonOutcomeMovements;
        }

        const total = totalIncome  - totalOutCome  + totalProjected;
        previousAccountBalance += total;
        return {
            date,
            timestamp: moment(date).format('X'),
            dayOfYear: moment(date).dayOfYear(),
            totalIncome,
            totalOutCome,
            total,
            previousAccountBalance,
        };
    });

    const monthlyBalance = totalDailyBalance.reduce((acc, day) => {
        const month = moment(day.date).format('MMMM');
        const year = moment(day.date).format('YYYY');
        if (!acc[year]) {
            acc[year] ={}
        }

        if(!acc[year][month]){
            acc[year][month] = {
                totalIncome: 0,
                totalOutCome: 0,
                total: 0,
                previousAccountBalance: 0,
                projectedIncome: 0,
                projectedOutcome: 0,
            };
        }

        acc[year][month].totalIncome += day.totalIncome;
        acc[year][month].totalOutCome += day.totalOutCome;
        acc[year][month].total += day.total;
        acc[year][month].previousAccountBalance = day.previousAccountBalance;

        // if day greater than today, add to projectedIncome and projectedOutcome
        if (day.dayOfYear > moment().dayOfYear()) {
            acc[year][month].projectedIncome += bankMovementsData.projectedIncome[allMyDates.findIndex((myDate) => myDate == day.date)].total;
            acc[year][month].projectedOutcome += bankMovementsData.projectedOutcome[allMyDates.findIndex((myDate) => myDate == day.date)].total;
        }
        return acc;
    }, {});

    console.log('monthlyBalance', monthlyBalance);

    // GET AMOUNT OF OBJECTS IN MONTHLYBALANCE (WILL BE THE AMOUNT OF COLUMNS IN THE TABLE)
    const length = Object.keys(monthlyBalance[selectedYear]).length;

    removeAllTableRows();
    renderMyHorizontalViewMonthly(monthlyBalance[selectedYear]);

    const totalIncomeTr = setTotalIncomeResumeRowMonthly(length);
    tbody.appendChild(totalIncomeTr);

    // const incomeTr = setNewincomeRowMonthly(length,'Ingresos', 'ingresos');
    // tbody.appendChild(incomeTr);
    // const projectedDocumentsTr = setNewincomeRowMonthly(length,'Ingresos futuros', 'projectedIncome');
    // tbody.appendChild(projectedDocumentsTr);
    // const projectedOutDatedDocumentsTr = setNewincomeRowMonthly(length,'Ingresos atrasados', 'projectedOutdatedIncomeRow');
    // tbody.appendChild(projectedOutDatedDocumentsTr);
    // const frecuentIncomeRow = setNewincomeRowMonthly(length,'Ingresos frecuentes', 'commonIncomeMovements');
    // tbody.appendChild(frecuentIncomeRow);

    tbody.appendChild(setEmptyRowMonthly(length));

    const totalOutComeTr = setOutcomeResumeRowMonthly(length);
    tbody.appendChild(totalOutComeTr);

    // const outcomTr = setNewincomeRowMonthly(length,'Egresos', 'egresos');
    // tbody.appendChild(outcomTr);
    // const outComeProjectedDocumentsTr = setNewincomeRowMonthly(length,'Egresos futuros', 'projectedOutcome');
    // tbody.appendChild(outComeProjectedDocumentsTr);
    // const projectedOutDatedDocumentsTrOut = setNewincomeRowMonthly(length,'Egresos atrasados', 'projectedOutdatedOutcomeRow');
    // tbody.appendChild(projectedOutDatedDocumentsTrOut);
    // const frecuentOutcomeRow = setNewincomeRowMonthly(length,'Egresos recurrentes', 'commonOutcomeMovements');
    // tbody.appendChild(frecuentOutcomeRow);

    tbody.appendChild(setEmptyRowMonthly(length));

    const totalTr = setTotalRowMonthly(length);
    tbody.appendChild(totalTr);

    const balanceTr = setDailyBalanceRowMonthly(length);
    tbody.appendChild(balanceTr);

    // get .allDates row and find th[month=""] and locate totals in the same column
    const allDatesRow = document.querySelector('.allDates');

    // loop through monthlyBalance and set totals in the same column
    Object.keys(monthlyBalance[selectedYear]).forEach((month, index) => {
        const th = allDatesRow.querySelector(`th[month="${month}"]`);
        const columnIndex = th.cellIndex;
        
        // get totalIncomeTr and set totalIncome
        const totalIncomeTd = totalIncomeTr.children[columnIndex];
        totalIncomeTd.innerHTML = getChileanCurrency(monthlyBalance[selectedYear][month].totalIncome + monthlyBalance[selectedYear][month].projectedIncome)

        // get totalOutComeTr and set totalOutCome
        const totalOutComeTd = totalOutComeTr.children[columnIndex];
        totalOutComeTd.innerHTML = getChileanCurrency(monthlyBalance[selectedYear][month].totalOutCome + monthlyBalance[selectedYear][month].projectedOutcome);

        // get totalTr and set total
        const totalTd = totalTr.children[columnIndex];
        totalTd.innerHTML = getChileanCurrency(monthlyBalance[selectedYear][month].total);

        // get balanceTr and set balance
        const balanceTd = balanceTr.children[columnIndex];
        balanceTd.innerHTML = getChileanCurrency(monthlyBalance[selectedYear][month].previousAccountBalance);
    });
}

function setNewincomeRowMonthly(length, rowName, code) {
    const tr = document.createElement('tr');
    tr.classList.add('codeAccountRow', '--selectableRow', '--incomeRow');
    tr.setAttribute('lvlCode', code);
    let firstTd = `<td lvlCode='${code}'>${rowName}</td>`;
    let contentTd = ''
    for (let i = 1; i <= length; i++) {
        contentTd += '<td></td>';
    }
    tr.innerHTML = `${firstTd}${contentTd}`;
    return tr;
}

const setTotalIncomeResumeRowMonthly = (length) => {
    const tr = document.createElement('tr');
    tr.classList.add('resumeRowIncome', '--headerRow');
    let firstTd = `<td id="resumeRowIncome">Total ingresos</td>`;
    let contentTd = ''
    for (let i = 1; i <= length; i++) {
        contentTd += '<td></td>';
    }
    tr.innerHTML = `${firstTd}${contentTd}`;
    return tr;
}

const setEmptyRowMonthly = (length) => {
    const tr = document.createElement('tr');
    tr.classList.add('emptyRow', '--headerRow');
    let firstTd = `<td></td>`;
    let contentTd = '';
    for (let i = 1; i <= length; i++) {
        contentTd += '<td></td>';
    }
    tr.innerHTML = `${firstTd}${contentTd}`;
    return tr;
}

const setOutcomeResumeRowMonthly = (length) => {
    const tr = document.createElement('tr');
    tr.classList.add('resumeRowOutCome', '--headerRow');
    let firstTd = `<td id="resumeRowOutcome">Total egresos</td>`;
    let contentTd = ''
    for (let i = 1; i <= length; i++) {
        contentTd += '<td></td>';
    }
    tr.innerHTML = `${firstTd}${contentTd}`;
    return tr;
}

const setTotalRowMonthly = (length) => {
    const tr = document.createElement('tr');
    tr.classList.add('resumeRowTotal', '--headerRow');
    let firstTd = `<td id="resumeTotalRow">Total</td>`;
    // console.log('allMydates', allMyDates);
    let contentTd = ''
    for (let i = 1; i <= length; i++) {
        contentTd += '<td></td>';
    }
    tr.innerHTML = `${firstTd}${contentTd}`;
    return tr;
}

const setDailyBalanceRowMonthly = (length) => {
    const tr = document.createElement('tr');
    tr.classList.add('resumeRowBalance', '--headerRow');
    let firstTd = `<td>Saldo</td>`;
    let contentTd = ''
    for (let i = 1; i <= length; i++) {
        contentTd += '<td></td>';
    }
    tr.innerHTML = `${firstTd}${contentTd}`;
    return tr;

}
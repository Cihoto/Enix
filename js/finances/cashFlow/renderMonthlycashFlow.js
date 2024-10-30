const monthlyCashFlow = document.getElementById('monthlyView');

monthlyCashFlow.addEventListener('click', async  () => {
    resumeCshFlowMonthly();
});


// const table = document.getElementById("bankMovementsTableHorizontal");
// const thead = table.getElementsByTagName("thead")[0];
// const tbody = table.getElementsByTagName("tbody")[0];
// const tfoot = table.getElementsByTagName("tfoot")[0];

async function resumeCshFlowMonthly() {
    console.log('resumeCshFlowMonthly');
    await getInitialBankAccountBalance();
    const allDaysOnYear = getAllDaysBetweenYears([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], selectedYear);
    let previousAccountBalance = cashFlowTotals.initialBankAccount;
    const totalDailyBalance = allDaysOnYear.map((date, index) => {
        const indexOnAllMydates = allMyDates.findIndex((myDate) => myDate == date);
        const totalIncome = bankMovementsData.ingresos[indexOnAllMydates].total;
        const totalOutCome = bankMovementsData.egresos[indexOnAllMydates].total;
        const totalProjectedIncome = bankMovementsData.projectedIncome[indexOnAllMydates].total;
        const totalProjectedOutcome = bankMovementsData.projectedOutcome[indexOnAllMydates].total;
        let totalProjected = 0;
        if (moment(date, 'YYYY-MM-DD').dayOfYear() > moment().dayOfYear()) {
            totalProjected = totalProjectedIncome - totalProjectedOutcome;
        }
        const totalCommonIncomeMovements = bankMovementsData.commonIncomeMovements[indexOnAllMydates].total;
        const totalCommonOutcomeMovements = bankMovementsData.commonOutcomeMovements[indexOnAllMydates].total;
        const total = totalIncome + totalCommonIncomeMovements - totalOutCome - totalCommonOutcomeMovements + totalProjected;
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
        if (!acc[month]) {
            acc[month] = {
                totalIncome: 0,
                totalOutCome: 0,
                total: 0,
                previousAccountBalance: 0,
            };
        }
        acc[month].totalIncome += day.totalIncome;
        acc[month].totalOutCome += day.totalOutCome;
        acc[month].total += day.total;
        acc[month].previousAccountBalance = day.previousAccountBalance;

        // if day greater than today, add to projectedIncome and projectedOutcome
        if (day.dayOfYear > moment().dayOfYear()) {
            acc[month].projectedIncome = acc[month].projectedIncome ? acc[month].projectedIncome + day.totalIncome : day.totalIncome;
            acc[month].projectedOutcome = acc[month].projectedOutcome ? acc[month].projectedOutcome + day.totalOutCome : day.totalOutCome;
        }
        return acc;
    }, {});

    console.log('monthlyBalance', monthlyBalance);

    // get amount of objects in monthlyBalance
    const length = Object.keys(monthlyBalance).length;

    


    removeAllTableRows();
    renderMyHorizontalViewMonthly(monthlyBalance);
    const totalIncomeTr = setTotalIncomeResumeRowMonthly(length);
    tbody.appendChild(totalIncomeTr);
    const incomeTr = setNewincomeRowMonthly(length,'Ingresos', 'ingresos');
    tbody.appendChild(incomeTr);
    const projectedDocumentsTr = setNewincomeRowMonthly(length,'Ingresos futuros', 'projectedIncome');
    tbody.appendChild(projectedDocumentsTr);
    const projectedOutDatedDocumentsTr = setNewincomeRowMonthly(length,'Ingresos atrasados', 'projectedOutdatedIncomeRow');
    tbody.appendChild(projectedOutDatedDocumentsTr);
    const frecuentIncomeRow = setNewincomeRowMonthly(length,'Ingresos frecuentes', 'commonIncomeMovements');
    tbody.appendChild(frecuentIncomeRow);

    tbody.appendChild(setEmptyRowMonthly(length));

    const totalOutComeTr = setOutcomeResumeRowMonthly(length);
    tbody.appendChild(totalOutComeTr);
    const outcomTr = setNewincomeRowMonthly(length,'Egresos', 'egresos');
    tbody.appendChild(outcomTr);
    const outComeProjectedDocumentsTr = setNewincomeRowMonthly(length,'Egresos futuros', 'projectedOutcome');
    tbody.appendChild(outComeProjectedDocumentsTr);
    const projectedOutDatedDocumentsTrOut = setNewincomeRowMonthly(length,'Egresos atrasados', 'projectedOutdatedOutcomeRow');
    tbody.appendChild(projectedOutDatedDocumentsTrOut);
    const frecuentOutcomeRow = setNewincomeRowMonthly(length,'Egresos recurrentes', 'commonOutcomeMovements');
    tbody.appendChild(frecuentOutcomeRow);

    tbody.appendChild(setEmptyRowMonthly(length));

    const totalTr = setTotalRowMonthly(length);
    tbody.appendChild(totalTr);
    const balanceTr = setDailyBalanceRowMonthly(length);
    tbody.appendChild(balanceTr);



    // get .allDates row and find th[month=""] and locate totals in the same column
    const allDatesRow = document.querySelector('.allDates');

    // loop through monthlyBalance and set totals in the same column
    Object.keys(monthlyBalance).forEach((month, index) => {
        const th = allDatesRow.querySelector(`th[month="${month}"]`);
        const columnIndex = th.cellIndex;
        
        // get totalIncomeTr and set totalIncome
        const totalIncomeTd = totalIncomeTr.children[columnIndex];
        totalIncomeTd.innerHTML = monthlyBalance[month].totalIncome;

        // get totalOutComeTr and set totalOutCome
        const totalOutComeTd = totalOutComeTr.children[columnIndex];
        totalOutComeTd.innerHTML = monthlyBalance[month].totalOutCome;

        // get totalTr and set total
        const totalTd = totalTr.children[columnIndex];
        totalTd.innerHTML = monthlyBalance[month].total;

        // get balanceTr and set balance
        const balanceTd = balanceTr.children[columnIndex];
        balanceTd.innerHTML = monthlyBalance[month].previousAccountBalance;

        // if month is greater than actual month, add projected income or outcome
        if (moment(month, 'MMMM').month() > moment().month()) {
            if (monthlyBalance[month].projectedIncome) {
                totalIncomeTd.innerHTML += ` (Projected: ${monthlyBalance[month].projectedIncome})`;
            }
            if (monthlyBalance[month].projectedOutcome) {
                totalOutComeTd.innerHTML += ` (Projected: ${monthlyBalance[month].projectedOutcome})`;
            }
        }
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
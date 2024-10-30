const monthlyCashFlow = document.getElementById('monthlyView');

monthlyCashFlow.addEventListener('click', async  () => {
    resumeCshFlowMonthly();
});

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
        return acc;
    }, {});

    console.log('monthlyBalance', monthlyBalance);




    
    removeAllTableRows();
    renderMyHorizontalView([pickedMonth], selectedYear);
    const totalIncomeTr = setTotalIncomeResumeRow();
    tbody.appendChild(totalIncomeTr);
    const incomeTr = setNewincomeRow('Ingresos', 'ingresos');
    tbody.appendChild(incomeTr);
    const projectedDocumentsTr = setNewincomeRow('Ingresos futuros', 'projectedIncome');
    tbody.appendChild(projectedDocumentsTr);
    const projectedOutDatedDocumentsTr = setNewincomeRow('Ingresos atrasados', 'projectedOutdatedIncomeRow');
    tbody.appendChild(projectedOutDatedDocumentsTr);
    const frecuentIncomeRow = setNewincomeRow('Ingresos frecuentes', 'commonIncomeMovements');
    tbody.appendChild(frecuentIncomeRow);
    tbody.appendChild(setEmptyRow());
    const totalOutComeTr = setOutcomeResumeRow();
    tbody.appendChild(totalOutComeTr);
    const outcomTr = setNewincomeRow('Egresos', 'egresos');
    tbody.appendChild(outcomTr);
    const outComeProjectedDocumentsTr = setNewincomeRow('Egresos futuros', 'projectedOutcome');
    tbody.appendChild(outComeProjectedDocumentsTr);
    const projectedOutDatedDocumentsTrOut = setNewincomeRow('Egresos atrasados', 'projectedOutdatedOutcomeRow');
    tbody.appendChild(projectedOutDatedDocumentsTrOut);
    const frecuentOutcomeRow = setNewincomeRow('Egresos recurrentes', 'commonOutcomeMovements');
    tbody.appendChild(frecuentOutcomeRow);
    tbody.appendChild(setEmptyRow());
    const totalTr = setTotalRow();
    tbody.appendChild(totalTr);
    createDailyBalance();



    console.log('totalDailyBalance', totalDailyBalance);

    // render tablew with monthly balance
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const headerRow = document.createElement('tr');
    ['Month', 'Total Income', 'Total Outcome', 'Net Total', 'Previous Account Balance'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    Object.keys(monthlyBalance).forEach(month => {
        const row = document.createElement('tr');
        const data = monthlyBalance[month];
        [month, data.totalIncome, data.totalOutCome, data.total, data.previousAccountBalance].forEach(text => {
            const td = document.createElement('td');
            td.textContent = text;
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    document.body.appendChild(table);

    console.log('allDaysOnYear', allDaysOnYear);
}
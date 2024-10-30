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


    console.log('allDaysOnYear', allDaysOnYear);
}
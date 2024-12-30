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

async function renderMyChasFlowTable(pickedMonth, selectedYear) {
    if (!activePage.cashFlow) {
        return;
    }
    console.log("SELECTEDYEAR", selectedYear,"ACIVE PAGE CASHFLOW",activePage.cashFlow);
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
        if (moment(date, 'YYYY-MM-DD').dayOfYear() >= moment().dayOfYear()) {
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
    cashFlowTotals.totals = totalDailyBalance;

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

    const firstDay = moment(pickedMonth, 'M').startOf('month').dayOfYear();
    const lastDay = moment(pickedMonth, 'M').endOf('month').dayOfYear();
    const selectedMonthDays = totalDailyBalance.filter(({ dayOfYear, date }) => {
        return dayOfYear >= firstDay && dayOfYear <= lastDay && moment(date).year() == selectedYear;
    });

    const totalRow = document.getElementsByClassName('resumeRowTotal')[0];
    const balanceRow = document.getElementsByClassName('resumeRowBalance')[0];

    selectedMonthDays.forEach((day) => {

        const { date, total, previousAccountBalance, dayOfYear } = day;

        const findIndexOnAllMyDates = allMyDates.findIndex((myDate) => myDate == date);
        console.log('findIndexOnAllMyDates',findIndexOnAllMyDates);
        const dateIndex = getDateHeaderIndex(findIndexOnAllMyDates, selectedYear);


        if(date == '2024-12-31'){
            console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
            console.log('dateIndex',selectedMonthDays);
            console.log('dateIndex',dateIndex);
            console.log('dateIndex',date);
            console.log('dateIndex',previousAccountBalance);
            console.log('dateIndex',dayOfYear);
            console.log('dateIndex',total);
            console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
        }
        if (!dateIndex) {
            return;
        }
        totalRow.children[dateIndex].innerHTML = getChileanCurrency(total);
        balanceRow.children[dateIndex].innerHTML = getChileanCurrency(previousAccountBalance);
    });

    const ingresosTr = document.getElementsByClassName('resumeRowIncome')[0];
    const egresosTr = document.getElementsByClassName('resumeRowOutCome')[0];
    const incomeRow = document.querySelectorAll('tr[lvlcode="ingresos"]')[0];
    const projectedIncomeRow = document.querySelectorAll('tr[lvlcode="projectedIncome"]')[0];
    const projectedOutdatedIncomeRow = document.querySelectorAll('tr[lvlcode="projectedOutdatedIncomeRow"]')[0];
    const commonIncomeMovements = document.querySelectorAll('tr[lvlcode="commonIncomeMovements"]')[0];
    const outcomeRow = document.querySelectorAll('tr[lvlcode="egresos"]')[0];
    const projectedOutcomeRow = document.querySelectorAll('tr[lvlcode="projectedOutcome"]')[0];
    const projectedOutdatedOutcomeRow = document.querySelectorAll('tr[lvlcode="projectedOutdatedOutcomeRow"]')[0];
    const commonOutcomeMovements = document.querySelectorAll('tr[lvlcode="commonOutcomeMovements"]')[0];

    const firstDayOfSelectedYearIndex = allMyDates.findIndex((myDate) => myDate == moment(`${selectedYear}-01-01`, 'YYYY-MM-DD').format('YYYY-MM-DD'));
    const lastDayOfYearIndex = allMyDates.findIndex((myDate) => myDate == moment(`${selectedYear}-12-31`, 'YYYY-MM-DD').format('YYYY-MM-DD'));
    const todayIndex = allMyDates.findIndex((myDate) => myDate == moment().format('YYYY-MM-DD'));

    for (let index = firstDayOfSelectedYearIndex; index <= lastDayOfYearIndex; index++) {
        const indexOnAllMydates = index;
        if (index <= todayIndex) {
  
            const totalIncome = bankMovementsData.ingresos[indexOnAllMydates].total;
            const totalOutcome = bankMovementsData.egresos[indexOnAllMydates].total;
            let projectedIncome = 0;
            let projectedOutcome = 0;

            let projectedIncomeOutDated = 0;
            let projectedOutcomeOutDated = 0;
            if (todayIndex == index) {

                const projectedIncomeDocuments = bankMovementsData.projectedIncome[indexOnAllMydates].lvlCodes;
                const projectedOutcomeDocuments = bankMovementsData.projectedOutcome[indexOnAllMydates].lvlCodes;
                console.log('projectedOutcomeDocuments',projectedOutcomeDocuments);
                
                const projectedIncomeTotals = projectedIncomeDocuments.reduce((acc, doc) => {
                    if (doc.vencida_por <= 0) {
                        acc.projectedIncomeTotal += doc.saldo;
                    } else {
                        acc.projectedOutdatedIncomeTotal += doc.saldo;
                    }
                    return acc;
                }, { projectedIncomeTotal: 0, projectedOutdatedIncomeTotal: 0 });
                const { projectedIncomeTotal, projectedOutdatedIncomeTotal } = projectedIncomeTotals;
                console.log('projectedIncomeTotals',projectedIncomeTotals);

                const projectedOutcomeTotals = projectedOutcomeDocuments.reduce((acc, doc) => {
                    if (doc.vencida_por <= 0) {
                        acc.projectedOutcomeTotal += doc.saldo;
                    } else {
                        acc.projectedOutdatedOutcomeTotal += doc.saldo;
                    }
                    return acc;
                }, { projectedOutcomeTotal: 0, projectedOutdatedOutcomeTotal: 0 });

                console.log('projectedOutcomeTotals',projectedOutcomeTotals);

                const { projectedOutcomeTotal, projectedOutdatedOutcomeTotal } = projectedOutcomeTotals;


                projectedIncome = projectedIncomeTotal;
                projectedIncomeOutDated = projectedOutdatedIncomeTotal;

                projectedOutcome = projectedOutcomeTotal;
                projectedOutcomeOutDated = projectedOutdatedOutcomeTotal;

                 
                // projectedIncome = bankMovementsData.projectedIncome[indexOnAllMydates].total;
                // projectedOutcome = bankMovementsData.projectedOutcome[indexOnAllMydates].total;
            }

            const doty = getDateHeaderIndex(index, selectedYear);
            if (!doty) {
                continue;
            }
            if(index == todayIndex){
                console.log('index: ',index, 'TodayIndex: ',todayIndex);
                console.log('doty: ',doty);
                console.log('bankMovementsData.projectedIncome[indexOnAllMydates]',bankMovementsData.projectedIncome[indexOnAllMydates])
                console.log('bankMovementsData.projectedOutcome[indexOnAllMydates]',bankMovementsData.projectedOutcome[indexOnAllMydates])

            }
            ingresosTr.children[doty].innerHTML = totalIncome > 0 ? getChileanCurrency(totalIncome) : 0;
            incomeRow.children[doty].innerHTML = totalIncome > 0 ? getChileanCurrency(totalIncome) : 0;
            egresosTr.children[doty].innerHTML = totalOutcome > 0 ? getChileanCurrency(totalOutcome) : 0;
            outcomeRow.children[doty].innerHTML = totalOutcome > 0 ? getChileanCurrency(totalOutcome) : 0;
            projectedIncomeRow.children[doty].innerHTML = projectedIncome > 0 ? getChileanCurrency(projectedIncome) : 0;
            projectedOutdatedIncomeRow.children[doty].innerHTML = projectedIncomeOutDated > 0 ? getChileanCurrency(projectedIncomeOutDated) : 0;
            commonIncomeMovements.children[doty].innerHTML = 0;
            projectedOutcomeRow.children[doty].innerHTML = projectedOutcome > 0 ? getChileanCurrency(projectedOutcome) : 0;
            projectedOutdatedOutcomeRow.children[doty].innerHTML = projectedOutcomeOutDated > 0 ? getChileanCurrency(projectedOutcomeOutDated) : 0;
            commonOutcomeMovements.children[doty].innerHTML = 0;
            continue;
        }

        const doty = getDateHeaderIndex(index, selectedYear);
        if (!doty) {
            continue;
        }
        const totals = {
            income: {
                total: 0,
                projected: 0,
                outdated: 0,
                common: 0,
            },
            outcome: {
                total: 0,
                projected: 0,
                outdated: 0,
                common: 0,
            }
        };
        bankMovementsData.projectedIncome[index].lvlCodes.forEach((lvlCode) => {
            const { vencida_por, saldo } = lvlCode;
            if (index != todayIndex) {
                totals.income.total += saldo;
            }
            if (vencida_por <= 0) {
                totals.income.projected += saldo;
            } else {
                totals.income.outdated += saldo;
            }
        });
        bankMovementsData.projectedOutcome[index].lvlCodes.forEach((lvlCode) => {
            const { vencida_por, saldo } = lvlCode;
            if (index != todayIndex) {
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
            if (index != todayIndex) {
                totals.income.total += total;
            }
            totals.income.common += total;
        });
        bankMovementsData.commonOutcomeMovements[index].lvlCodes.forEach((lvlCode) => {
            const { total } = lvlCode;
            if (index != todayIndex) {
                totals.outcome.total += total;
            }
            totals.outcome.common += total;
        });

        ingresosTr.children[doty].innerHTML = totals.income.total > 0 ?getChileanCurrency(totals.income.total) : 0;
        incomeRow.children[doty].innerHTML = 0
        egresosTr.children[doty].innerHTML = totals.outcome.total > 0 ?getChileanCurrency(totals.outcome.total) : 0;
        outcomeRow.children[doty].innerHTML = 0
        projectedIncomeRow.children[doty].innerHTML = totals.income.projected > 0 ?getChileanCurrency(totals.income.projected) : 0;
        projectedOutdatedIncomeRow.children[doty].innerHTML = totals.income.outdated > 0 ?getChileanCurrency(totals.income.outdated) : 0;
        commonIncomeMovements.children[doty].innerHTML = totals.income.common > 0 ?getChileanCurrency(totals.income.common) : 0;
        projectedOutcomeRow.children[doty].innerHTML = totals.outcome.projected > 0 ?getChileanCurrency(totals.outcome.projected) : 0;
        projectedOutdatedOutcomeRow.children[doty].innerHTML = totals.outcome.outdated > 0 ?getChileanCurrency(totals.outcome.outdated) : 0;
        commonOutcomeMovements.children[doty].innerHTML = totals.outcome.common > 0 ?getChileanCurrency(totals.outcome.common) : 0;

        if (totals.income.projected > 0 && index == todayIndex) {
            projectedIncomeRow.children[doty].classList.add('noContableTotal');
        }
        if (totals.income.outdated > 0 && index == todayIndex) {
            projectedOutdatedIncomeRow.children[doty].classList.add('noContableTotal');
        }
        if (totals.outcome.projected > 0 && index == todayIndex) {
            projectedOutcomeRow.children[doty].classList.add('noContableTotal');
        }
        if (totals.outcome.outdated > 0 && index == todayIndex) {
            projectedOutdatedOutcomeRow.children[doty].classList.add('noContableTotal');
        }
    }
}

function getDateHeaderIndex(date, selectedYear = 2024) {

    const dateHeaderRow = document.querySelectorAll('.allDates')[0];
    const theadData = dateHeaderRow.getElementsByClassName('dateHeader');
    const dotyOnAllMyDates = moment(allMyDates[date], 'YYYY-MM-DD').dayOfYear();

    if(date == 365 || date == 366){
        console.log('date', date);
        console.log('allMyDates', allMyDates);
        console.log('allMyDates', allMyDates[date]);
        console.log('dotyOnAllMyDates', dotyOnAllMyDates);
        console.log('theadData', theadData);
        console.log('dotyOnAllMyDates', selectedYear);
        console.log('dotyOnAllMyDates', dotyOnAllMyDates);
        console.log('dotyOnAllMyDates', dotyOnAllMyDates);
    }
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
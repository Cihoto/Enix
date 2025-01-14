
function renderDashboardChart_deprecated(tributarieDocuments) {
    const ctx = document.getElementById('myChart');

    const DATA_COUNT = 12;
    const labels = [];
    for (let i = 0; i < DATA_COUNT; ++i) {
        labels.push(moment().month(i).locale('es').format('MMMM'));
    }
    // get amount of keys in tributarieDocuments and loop each key to get the total amount of each month
    // loop through each key and get the total amount of each month

    console.log('tributarieDocuments', tributarieDocuments);

    const tributarieData = Object.keys(tributarieDocuments).map((key) => {
        return {
            month: key,
            ingreso: tributarieDocuments[key].total.ingreso,
            egreso: tributarieDocuments[key].total.egreso
        };
    });

    const ingreso = tributarieData.map((data) => data.ingreso);
    const egreso = tributarieData.map((data) => data.egreso);

    console.log('tributarieData', tributarieData);
    console.log('labels', labels);

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Ingresos',
                data: ingreso,
                borderColor: 'rgba(51, 34, 102, 1)',
                fill: false,
                cubicInterpolationMode: 'monotone',
                tension: 0.1,
                
            },
            {
                label: 'Egresos',
                data: egreso,
                borderColor: "blue",
                fill: false,
                cubicInterpolationMode: 'monotone',
                tension: 0.8
            },
            // {
            //   label: 'Linear interpolation (default)',
            //   data: datapoints,
            //   borderColor: "green",
            //   fill: false
            // }
        ]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                },
            },
            interaction: {
                intersect: false,
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Mes'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Total'
                    }
                }
            }
        },
    };


    new Chart(ctx, config);
}




function chartTributarieDocuments() {
    const tributarieDocuments = initialTributarieDocuments.documents;

    const monthlyData = {};

    const currentYear = new Date().getFullYear();

    tributarieDocuments.forEach(doc => {
        const date = new Date(doc.issue_date);
        const month = date.getMonth() + 1; // getMonth() is zero-based
        // const key = `${year}-${month.toString().padStart(2, '0')}`;
        const key = moment(date).locale('es').format('MMMM');

        if(currentYear != date.getFullYear()){
            return;
        }

        if (!monthlyData[key]) {
            monthlyData[key] = { count: 0, total: {
                ingreso: 0,
                egreso: 0,
            } };
        }
        monthlyData[key].count += 1; // Count the number of documents per month
        monthlyData[key].total[doc.issued == 1 ? 'ingreso' : 'egreso'] += doc.total;
    });

    console.log('monthlyData', monthlyData);
    return monthlyData
}


async function financialStatusChartData(){
    const financialStatusData = await getFinancialStatus();
    return financialStatusData
}

async function getCommonMovementsChartData(){
    const commonMovementsData = await getCommonMovementsFromDb();

    if(!commonMovementsData.success){
        return[];
    }
    return commonMovementsData.data;
}





let tributarieDocumentsChart = [];
let financialStatusData = [];
// let commonMovements = [];

async function prepareDataForDashBoard() {
    // tributarieDocumentsChart = chartTributarieDocuments();
    financialStatusData = await financialStatusChartData_range();
    // commonMovements = await getCommonMovementsChartData();
    
    renderDashBoardTable(financialStatusData);
    renderDashboardChart(financialStatusData);
    // renderDoughtnutChart(commonMovements);

}


function renderDashboardChart(financialStatus) {

    
    const ctx = document.getElementById('myChart');

    if (Chart.getChart(ctx)) {
        Chart.getChart(ctx).destroy();
    }

    const DATA_COUNT = financialStatus.length;
    const labels = [];
    for (let i = 0; i < DATA_COUNT; ++i) {
        // labels.push(moment().month(i).locale('es').format('MMMM'));
        labels.push(financialStatus[i].date);
    }
    // get amount of keys in financialStatus and loop each key to get the total amount of each month
    // loop through each key and get the total amount of each month

    console.log('financialStatus', financialStatus);

    const tributarieData = financialStatus.map((financial) => {

        const { issued, received, total, avit, date,bank_balance } = financial;

        return {
            income : Number(issued) +Number(bank_balance),
            outflow : Number(received),
            date: date,
            avit: avit
        };
    });

    const income = tributarieData.map((data) => data.income);
    const outflow = tributarieData.map((data) => data.outflow);
    const avit = tributarieData.map((data) => data.avit);

    console.log('tributarieData', tributarieData);
    console.log('labels', labels);

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Ingresos',
                data: income,
                borderColor: 'rgba(51, 34, 102, 1)',
                fill: false,
                cubicInterpolationMode: 'monotone',
                tension: 0.1,
                
            },
            {
                label: 'Egresos',
                data: outflow,
                borderColor: "rgb(253, 114, 2)",
                fill: false,
                cubicInterpolationMode: 'monotone',
                tension: 0.8
            },
            {
                label: 'Avit',
                data: avit,
                borderColor: "rgb(0, 199, 212)",
                fill: false,
                cubicInterpolationMode: 'monotone',
                tension: 0.8
            }
        ]
    };
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                },
            },
            interaction: {
                intersect: false,
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Mes'
                    },
                    grid: {
                        display: false
                    },
                    offset: true // This will move the first point to the right
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Total'
                    },
                    grid: {
                        display: true
                    }
                }
            }
        },
    };


    new Chart(ctx, config);
}






function renderDoughtnutChart(commonMovements) {
    const ctx = document.getElementById('doughnutFinance');

    const labels = commonMovements.map((movement) => movement.name);
    // const data = commonMovements.map((movement) => movement.total);

    console.log('commonMovements', commonMovements);

    const allFutureMovements = commonMovements.filter(({dateTo,active}) => moment(dateTo).isAfter(moment()) && active == 1);

    console.log('allFutureMovements', allFutureMovements);

    const outflow = allFutureMovements.filter(({income}) => income == 0)
    .map(({movements})=> movements);
    // merge all arrays
    const mergedOutflow = [].concat.apply([], outflow)
    .filter(({printDate}) => moment(printDate).isAfter(moment()) && moment(printDate).isBefore(moment().add(1,'month')))
    .reduce((acc, {total}) => acc + Number(total),0);

    console.log('mergedOutflow', mergedOutflow);

    const income = allFutureMovements.filter(({income}) => income == 1)
    .map(({movements})=> movements);
    // merge all arrays
    const mergedIncome = [].concat.apply([], income)
    .filter(({printDate}) => moment(printDate).isAfter(moment()) && moment(printDate).isBefore(moment().add(1,'month')))
    .reduce((acc, {total}) => acc + Number(total),0);

    console.log(mergedIncome)


    const doughnutData = {
        labels: ["Ingresos","Egresos"],
        datasets: [
            {
                label: 'Gastos fijos',
                data: [mergedIncome, mergedOutflow],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1
            }
        ]
    };

    const doughnutConfig = {
        type: 'doughnut',
        data: doughnutData,
        options: {
            responsive: true,
            elements:{
                pointStyle: 'circle'
            },
            plugins: {
                legend: {
                    position: 'right'
                },
                title: {
                    display: true,
                    text: 'Movimientos Comunes'
                }
            }
        },
    };

    new Chart(ctx, doughnutConfig);

    


}





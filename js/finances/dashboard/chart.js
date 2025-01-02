


function renderDashboardChart(tributarieDocuments) {
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

let tributarieDocumentsChart = [];

function prepareDataForDashBoard() {
    tributarieDocumentsChart = chartTributarieDocuments()

    renderDashboardChart(tributarieDocumentsChart);

}
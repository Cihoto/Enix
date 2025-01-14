let allMyDates = [];
function getAllDaysOnMonth(monthsToSearch,selectedYear = moment().year()){
    let datesOnCurrentMonth = [];
    // get years between current year and 6 years in future
    // get actual year and subtract it one year

    // software let consult from current year minus one year to 6 years in future
    let initialYear = moment().year() - 1;
    let finalYear = moment().year() + 6;

    let years = [];
    for (let i = initialYear; i <= finalYear; i++) {
        years.push(i);
    }

    // console.log('years',years);
    
    years.forEach(year => {
        monthsToSearch.forEach(monthToSearch => {
            const months = moment.months();
            const monthNumber = moment(`${months[monthToSearch - 1]}`, 'MMMM').format('MM');
            // const year = moment(2025,'YYYY').format('YYYY');
            let allDaysOnCurrentMonth = moment(`${year}-${monthNumber}`,'YYYY-MM').daysInMonth();
            // console.log('allDaysOnCurrentMonth',allDaysOnCurrentMonth,`${year}-${monthNumber}`);
            for (let i = 1; i <= allDaysOnCurrentMonth; i++) {
                let date = moment(`${year}-${monthNumber}`).date(i).format('YYYY-MM-DD');
                datesOnCurrentMonth.push(date);
            }
        });
    });    

    allMyDates = datesOnCurrentMonth;
    // console.log('allMyDates',allMyDates);
    return datesOnCurrentMonth;
}

function getAllDaysBetweenYears(monthsToSearch,selectedYear){
    let datesOnCurrentMonth = [];

    // GET ALL YEARS BETWEEN current year and selected year
    let years = [];
    let currentYear = moment().year();

    if(currentYear <= selectedYear){
        for (let i = currentYear ; i <= selectedYear  ; i++) {
            years.push(i);
        } 
    }

    if(currentYear > selectedYear){
        for (let i = selectedYear; i <= currentYear ; i++) {
            years.push(i);
        }
    }


    console.log('years',years);

    years.forEach(year => {
        monthsToSearch.forEach(monthToSearch => {
            const months = moment.months();
    
            const monthNumber = moment(`${months[monthToSearch - 1]}`, 'MMMM').format('MM');
            // const year = moment(2025,'YYYY').format('YYYY');
            let allDaysOnCurrentMonth = moment(`${year}-${monthNumber}`,'YYYY-MM').daysInMonth();
            for (let i = 1; i <= allDaysOnCurrentMonth; i++) {
                let date = moment(`${year}-${monthNumber}`).date(i).format('YYYY-MM-DD');
                datesOnCurrentMonth.push(date);
            }
        });
    });

    return datesOnCurrentMonth;
}


function getDaysOnSelectedMonth(monthsToSearch,selectedYear){
    let datesOnCurrentMonth = [];
    
    monthsToSearch.forEach(monthToSearch => {   
        const months = moment.months();
        const monthNumber = moment(`${months[monthToSearch - 1]}`, 'MMMM').format('MM');
        // const year = moment(2025,'YYYY').format('YYYY');
        let allDaysOnCurrentMonth = moment(`${selectedYear}-${monthNumber}`,'YYYY-MM').daysInMonth();
        // console.log('allDaysOnCurrentMonth',allDaysOnCurrentMonth,`${selectedYear}-${monthNumber}`);
        for (let i = 1; i <= allDaysOnCurrentMonth; i++) {
            let date = moment(`${selectedYear}-${monthNumber}`).date(i).format('YYYY-MM-DD');
            datesOnCurrentMonth.push(date);
        }
    });

    // console.log('dates on month',datesOnCurrentMonth);
    return datesOnCurrentMonth;
}



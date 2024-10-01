let allMyDates = [];
function getAllDaysOnMonth(monthsToSearch){
    let datesOnCurrentMonth = [];
    monthsToSearch.forEach(monthToSearch => {
        const months = moment.months();
        const monthNumber = moment(`${months[monthToSearch - 1]}`, 'MMMM').format('MM');
        const year = moment().format('YYYY');
        let allDaysOnCurrentMonth = moment(`${year}-${monthNumber}`,'YYYY-MM').daysInMonth();
        for (let i = 1; i <= allDaysOnCurrentMonth; i++) {
            let date = moment(`${year}-${monthNumber}`).date(i).format('YYYY-MM-DD');
            datesOnCurrentMonth.push(date);
        }
    });
    allMyDates = datesOnCurrentMonth;
    return datesOnCurrentMonth;
}



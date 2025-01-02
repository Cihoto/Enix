
const closeCommonMovementsSideMenu = document.getElementById('closeCommonMovementsSideMenu');
const commonMovementsSideMenu = document.getElementById('commonMovementsSideMenu');
const commonEventsForm = document.getElementById('commonEventsForm');
const typeSelector = document.getElementById('commonMovementsType');
const daySelector = document.getElementById('commonMovementDay');
const dateFrom = document.getElementById('commonMovementFrom');
const dateTo = document.getElementById('commonMovementTo');

function openCommonMovementsSideMenu() {
    commonMovementsSideMenu.classList.add('active');
}

function closeSideMenuCommonMovements() {
    console.log('close');
    commonMovementsSideMenu.classList.remove('active');
}

dateFrom.addEventListener('change', (e) => {
    limitselectableDays();
});

// get formData
commonEventsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const entries = Object.fromEntries(formData.entries());
    let commonMovements = [];
    const income = entries.inOut == 'income' ? true : false;

    if (entries.movementType == 2) {

        const dateFrom = moment(entries.dateFrom, 'YYYY-MM');
        const dateTo = moment(entries.dateTo, 'YYYY-MM');
        const diff = dateTo.diff(dateFrom, 'months');

        if (diff < 0) {
            throw new Error('La fecha de inicio no puede ser mayor a la fecha final');
        }
        let periodos = diff;
        if (diff == 0) {
            periodos = 1;
        } else {
            periodos = diff + 1;
        }


        if (diff > 0) {
            const monthFrom = moment(entries.dateFrom, 'YYYY-MM').format('MM');
            const yearFrom = moment(entries.dateFrom, 'YYYY-MM').format('YYYY');
            let dayFrom = getFixedDate(parseInt(entries.dayNumber), monthFrom,yearFrom);

            let printDate = moment(`${dayFrom}-${moment(entries.dateFrom, 'YYYY-MM').add(0, 'months').format('MM-YYYY')}`, 'DD-MM-YYYY').format('DD-MM-YYYY');
            const dateToFormatted = moment(`${dayFrom}-${moment(entries.dateTo, 'YYYY-MM').add(0, 'months').format('MM-YYYY')}`, 'DD-MM-YYYY').format('DD-MM-YYYY');
            const uniqueId = btoa(`${new Date().getMilliseconds()}${printDate}${entries.movementTotal}${entries.name}${0}`);
            const commonObject = {
                id: uniqueId,
                dateFrom: printDate,
                dateTo: dateToFormatted,
                name: entries.name,
                income: income,
                movements:[]
            }
            for (let index = 0; index < periodos; index++) {
                
                const fixedDay = getFixedDate(parseInt(entries.dayNumber), moment(entries.dateFrom, 'YYYY-MM').add(index, 'months').format('MM'),moment(entries.dateFrom, 'YYYY-MM').add(index, 'months').format('YYYY'));
                // if(moment(entries.dateFrom, 'YYYY-MM').add(index, 'months').format('MM') == 2){
                //     console.log(moment(entries.dateFrom, 'YYYY-MM').add(index, 'months').format('YYYY'))
                //     console.log('parseInt(entries.dayNumber)',parseInt(entries.dayNumber))
                //     console.log()
                //     console.log('fixedDay',fixedDay);
                //     const printDate = moment(`${fixedDay}-${moment(entries.dateFrom, 'YYYY-MM').add(index, 'months').format('MM-YYYY')}`, 'DD-MM-YYYY').format('DD-MM-YYYY');
                //     console.log("1",moment(`${fixedDay}`))
                //     console.log("2",moment(`${fixedDay}-${moment(entries.dateFrom, 'YYYY-MM').add(index, 'months').format('MM-YYYY')}`, 'DD-MM-YYYY'))
                //     console.log("2",moment(`${fixedDay}-${moment(entries.dateFrom, 'YYYY-MM').add(index, 'months').format('MM-YYYY')}`, 'DD-MM-YYYY').format('DD-MM-YYYY'))

                //     console.log('printDate',printDate);
                // }
                const printDate = moment(`${fixedDay}-${moment(entries.dateFrom, 'YYYY-MM').add(index, 'months').format('MM-YYYY')}`, 'DD-MM-YYYY').format('DD-MM-YYYY');
                // const uniqueId = btoa(`${new Date().getMilliseconds()}${printDate}${entries.movementTotal}${entries.name}${index}`);
                const commonMovement = {
                    index: index,
                    printDate: printDate,
                    printDateTimestamp: moment(printDate, 'DD-MM-YYYY').format('X'),
                    total: entries.movementTotal == '' ? 0 : parseInt(entries.movementTotal),
                    name: entries.name,
                    desc : ''
                }
                commonObject.movements.push(commonMovement);
            }
            commonMovements.push(commonObject);
        }
        console.log('COMMON MOVEMENTS', commonMovements);


    }

    if(entries.movementType == 1){
        const printDate = moment(entries.dateFrom, 'YYYY-MM-DD').format('DD-MM-YYYY');
        const uniqueId = btoa(`${new Date().getMilliseconds()}${printDate}${entries.movementTotal}${entries.name}`);
        // commonMovements.push({
        //     id: uniqueId,
        //     printDate: printDate,
        //     printDateTimestamp: moment(printDate, 'DD-MM-YYYY').format('X'),
        //     total: entries.movementTotal == '' ? 0 : parseInt(entries.movementTotal),
        //     nombre: entries.name,
        //     income: income,
        // });

        const commonObject = {
            id: uniqueId,
            dateFrom: printDate,
            dateTo: printDate,
            name : entries.name,
            income: income,
            movements:[
                {
                    index: 0,
                    printDate: printDate,
                    printDateTimestamp: moment(printDate, 'DD-MM-YYYY').format('X'),
                    total: entries.movementTotal == '' ? 0 : parseInt(entries.movementTotal),
                    name : entries.name,
                    desc:''
                }
            ]
        }
        commonMovements.push(commonObject);
    }

    const insertCommonMovement = await fetch('controller/common_movements/insertCommonMovement.php', {
        method: 'POST',
        body: JSON.stringify({
            data: commonMovements
        }),
        headers: {
            'Content-Type': 'application/json'
        }

    });

    const responseCommonMovements = await insertCommonMovement.json();
    console.log(responseCommonMovements);
    if(responseCommonMovements.status == 'success'){
        closeSideMenuCommonMovements();
        showDateSelectors.fire({
            title: 'Movimientos comunes guardados',
            type: 'success',
            showConfirmButton: false,
            timer: 1500
        });
    }
    return 

    // FETCH SERVICE TO SAVE COMMON MOVEMENTS
    const saveCommonMovements = await fetch('controller/finance/commonMovements/writeNewCommonMovements.php', {
        method: 'POST',
        body: JSON.stringify({
            commonMovements: commonMovements,
            // businessName: 'INTEC',
            // businessId: 77604901,
            // businessAccount: 63741369
        }),
        headers: {
            'Content-Type': 'application/json'
        }

    });
    const response = await saveCommonMovements.json();
    console.log(response);
    if (response.status === "success") {
        console.log('Movimientos comunes guardados');
        closeSideMenuCommonMovements();
        await getBankMovementsFromExcel();
        console.log('Movimientos comunes guardados');
        renderMyChasFlowTable(selectedMonth);
    }
});

typeSelector.addEventListener('change', (e) => {


    if (e.target.value == 1) {
        limitselectableDays();

        daySelector.closest('.form-group').style.display = 'none';
        daySelector.required = false;

        dateFrom.value = '';
        dateFrom.type = 'date';
        dateFrom.value = moment().format('DD-MM-YYYY');
        dateFrom.closest('.form-group').querySelector('label').innerText = 'Fecha del movimiento';

        dateTo.disabled = true;
        dateTo.required = false;
        dateTo.value = '';
        dateTo.closest('.form-group').style.display = 'none';
        // dateTo.style.display = 'none';
        return;
    }

    if (e.target.value == 2) {
        daySelector.closest('.form-group').style.display = 'flex';
        daySelector.required = true;

        dateFrom.value = '';
        dateFrom.type = 'month';
        dateFrom.value = moment().format('YYYY-MM');
        dateFrom.closest('.form-group').querySelector('label').innerText = 'Desde';

        dateTo.disabled.disabled = false;
        dateTo.required = true;
        dateTo.value = '';
        dateTo.closest('.form-group').style.display = 'flex';

        // dateTo.style.display = 'flex';
        limitselectableDays(true);
    }

    dateTo.disabled = false;
});

function limitselectableDays(multiple = false) {
    const monthFrom = document.getElementById('commonMovementFrom').value;
    console.log(monthFrom);
    const currentMonth = moment().format('YYYY-MM');

    let currentDay = moment().format('DD');
    if (multiple) {
        currentDay = 0;
    }
    if (monthFrom != currentMonth) {
        currentDay = 0;
    }
    const maxDayOnMonth = moment(monthFrom).endOf('month').format('DD');
    daySelector.innerHTML = '';
    for (let index = parseInt(currentDay) + 1; index <= maxDayOnMonth; index++) {
        const option = document.createElement('option');
        option.value = index;
        option.innerText = index;
        daySelector.appendChild(option);
    }
}


function getFixedDate(day, month,year){
    const daysOnMonth = moment(`${month}-${year}`, 'MM-YYYY').daysInMonth();
    if (day > daysOnMonth) {
        return daysOnMonth;
    }
    return day;
}
// const table = document.getElementById("balanceTableHorizontal");
const table = document.getElementById("bankMovementsTableHorizontal");
const thead = table.getElementsByTagName("thead")[0];
const tbody = table.getElementsByTagName("tbody")[0];
const tfoot = table.getElementsByTagName("tfoot")[0];
const allMyDatesTr = document.querySelectorAll('.allDates');
let allReceptors = [];


function renderMyHorizontalView(monthsToSearch){

    // set all dates on month in thead using moment.js
    let allDaysOnCurrentMonth = getAllDaysOnMonth(monthsToSearch);
    console.log('allDaysOnCurrentMonth',allDaysOnCurrentMonth);
    createHorizontalTableHead(table,allDaysOnCurrentMonth);
}


function createHorizontalTableHead(table,allDaysOnCurrentMonth){
    let tr = document.createElement("tr");
    let th = document.createElement("th");

    th.innerHTML = "Fecha";
    tr.appendChild(th);
    tr.classList.add('table-primary-tr');
    tr.classList.add('allDates');

    allDaysOnCurrentMonth.forEach(date => {
        // console.log(date)
        let th = document.createElement("th");
        th.classList.add('dateHeader');
        // doty = DAY OF THE YEAR
        const dayOfYear = moment(date).dayOfYear();
        th.dataset.date = dayOfYear
        th.setAttribute('doty',dayOfYear)
        // th.dataset.date = moment(date).format('X');
        th.innerHTML = moment(date).format('DD-MM-YYYY');
        tr.appendChild(th);
    });

    thead.appendChild(tr);
}

function getMovementsOnMonth(monthNumber = 6){

    const firstDayOfTheMonth_timestamp = parseInt(moment().date(1).month(monthNumber - 1).format('X'));
    const firstDayOfTheMonth = moment().date(1).month(monthNumber - 1).format('YYYY-MM-DD');
    const filteredBankMovement = bankMovements.items.filter(({fecha_creacion})=>{

        return fecha_creacion >= firstDayOfTheMonth_timestamp;
    });
    
    const paymentMovements = filteredBankMovement.filter(({abono}) => !abono );
    const chargeMovements = filteredBankMovement.filter(({abono}) => abono );


    const paymentReceptors = paymentMovements.map((movement) => {
        if(movement.mas_info != null){
            return {
                receptor: movement.mas_info.receptor,
                amount: movement.monto
            }
        }else{
            return {
                receptor: 'Sin receptor',
                amount: movement.monto
            }
        }
    });
    // const chargeReceptors = paymentMovements.map(({mas_info}) => {
    //     if(){

    //     }
    // });


    filteredBankMovement.sort((a,b) => a.fecha_creacion - b.fecha_creacion);
    console.log('filteredBankMovement',filteredBankMovement);
    console.log('paymentMovements',paymentMovements);
    console.log('chargeMovements',chargeMovements);
    console.log('paymentReceptors',paymentReceptors);
    console.log('chargeReceptors',chargeReceptors);

}
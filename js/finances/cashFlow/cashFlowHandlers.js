const cashFlowTable = document.querySelector('#bankMovementsTableHorizontal');
const cashFlowTableHead = cashFlowTable.getElementsByTagName('thead')[0];
const cashFlowTbody = cashFlowTable.getElementsByTagName('tbody')[0];
const infoMenu = document.getElementById('infoMenu');
const infoContent = document.getElementById('infoContent');
const infoMenuTable = document.getElementById('resumeCashFlowTable');
const infoMenuTableThead = document.getElementsByTagName('thead')[0];
const infoMenuTableTbody = document.getElementsByTagName('tbody')[0]; 
// capture clicks on cashFlowtable

cashFlowTable.addEventListener('click', (e) => {

    //get closest table to e
    const tableIsCashFlow = e.target.closest('table').classList.contains('cashFlowTable'); 
    if(!tableIsCashFlow) return;
    
    const target = e.target;
    console.log('target',target);
    console.log('target',target.tagName);

    const allDatesTr = document.getElementsByClassName('allDates');

    // get index of clicked cell in his tr 
    const cellIndex = target.cellIndex;
    console.log('cellIndex',cellIndex);
    // get closest tr to target
    const isIncomeRow = target.closest('tr').classList.contains('--incomeRow');
    console.log('isIncomeRow',isIncomeRow);
    // find cellIndex On allDatesTr
    const clickedDate = parseInt(allDatesTr[0].children[cellIndex].getAttribute('doty')) - 1;
    console.log(clickedDate);

    // get selectedRowData
    const selectedRowData = target.closest('tr');
    console.log('selectedRowData',selectedRowData);

    const accCode = selectedRowData.getAttribute('lvlcode');

    const data = getMovementsByCode(accCode, clickedDate);
    console.log('RETURNED MOVEMENTS TO PRINT ON TABLE',data);

    // remove all rows from table
    console.log('infoMenuTable',infoMenuTable.getElementsByTagName('tr'));

    const tableTr = infoMenuTable.getElementsByTagName('tr');
    // tableTr.forEach((tr) => {   
    //     tr.remove(); 
    // });
        // get cursor position
        const cursorPosition = {
            x: e.clientX,
            y: e.clientY
        }
        console.log(cursorPosition);
    

    // const theadTr = infoMenuTableThead.getElementsByTagName('tr');
    // theadTr.forEach((tr) => {
    //     tr.remove();
    // });
    // const tbodyTr = infoMenuTableTbody.getElementsByTagName('tr');
    // tbodyTr.forEach((tr) => {
    //     tr.remove();
    // });



    // thead and tbody and remove all rows from table
    infoMenuTableThead.innerHTML = '';
    infoMenuTableTbody.innerHTML = '';
    // infoMenuTableThead.remove();
    // infoMenuTableTbody.remove();


    // return;
    if(accCode === 'projectedIncome' || accCode === 'projectedOutcome' || accCode === 'projectedOutdatedIncomeRow' || accCode === 'projectedOutdatedOutcomeRow'){
        console.log('data.lvlCodes',data.lvlCodes);

        // create thead with titles
        const theadTr = document.createElement('tr');
        theadTr.innerHTML = `<th>Folio</th>
                            <th>Contraparte</th>
                            <th>Total</th>`;
        infoMenuTableThead.append(theadTr);
        // create table with movements
        data.lvlCodes.forEach((movement) => {
            const tr = document.createElement('tr');
            const {folio, proveedor, total} = movement;
            tr.innerHTML = `<td>${folio}</td>
                            <td>${proveedor}<td>
                            <td>${getChileanCurrency(total)}</td>`;
            infoMenuTableTbody.append(tr);
        })
    }
    if(accCode === 'ingresos' || accCode === 'egresos' ){

        console.log(data.lvlCodes)
        // create thead with titles
        const theadTr = document.createElement('tr');
        theadTr.innerHTML = `<th>Nombre</th>
                             <th>Total</th>`;

        // infoMenuTableThead
        // infoMenuTableTbody
        infoMenuTableThead.append(theadTr);

        // create table with movements
        data.lvlCodes.forEach((movement) => {
            console.log('movement',movement);
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${movement.desc}</td>
                            <td>${getChileanCurrency(movement.monto)}</td>`;
            infoMenuTableTbody.append(tr);
        });
    }
    if(accCode === 'commonIncomeMovements' || accCode === 'commonOutcomeMovements'){
        // create thead with titles
        const theadTr = document.createElement('tr');
        theadTr.innerHTML = `
            <th>Nombre</th>
            <th>Total</th>`;

        infoMenuTableThead.append(theadTr);

        data.lvlCodes.forEach((movement) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${movement.nombre}</td>
                            <td>${getChileanCurrency(movement.total)}</td>`;
            infoMenuTableTbody.appendChild(tr);
        })
    }
    cashFlowDocumentsDisplay(e);
});

function cashFlowDocumentsDisplay(event){

    if ((event.target.closest('tr').classList.contains('--incomeRow') || event.target.closest('tr').classList.contains('--outcomeRow'))) {
        console.log('income');
        const rect = event.target.getBoundingClientRect();
        infoMenu.style.top = `${rect.bottom + window.scrollY}px`;
        infoMenu.style.left = `${rect.left + window.scrollX}px`;
        // infoContent.textContent = event.target.getAttribute('data-info');
        infoMenu.style.display = 'block';
        // detect if menu is out of screen
        if (infoMenu.getBoundingClientRect().bottom > window.innerHeight) {
            infoMenu.style.top = `${rect.top - infoMenu.getBoundingClientRect().height + window.scrollY}px`;
        }
        if(infoMenu.getBoundingClientRect().right > window.innerWidth){
            infoMenu.style.left = `${rect.right - infoMenu.getBoundingClientRect().width + window.scrollX}px`;
        }
        if(infoMenu.getBoundingClientRect().left < 0){
            infoMenu.style.left = `${rect.left + window.scrollX}px`;
        }
        if(infoMenu.getBoundingClientRect().top < 0){
            infoMenu.style.top = `${rect.bottom + window.scrollY}px`;
        }

    } else {
        infoMenu.style.display = 'none';
    }
}

infoContent.addEventListener('click', (e) => {
    console.log('click');
    infoMenu.style.display = 'none';
})


function getMovementsByCode(accCode, clickedDate){
    const outdatedAccount = accCode === 'projectedOutdatedIncomeRow' ? 'projectedIncome' : 'projectedOutcome';

    if(accCode === 'projectedOutdatedIncomeRow' || accCode === 'projectedOutdatedOutcomeRow'){
        console.log('bankMovementsData[outdatedAccount][clickedDate]',bankMovementsData[outdatedAccount][clickedDate]);
        const dataOnDay = bankMovementsData[outdatedAccount][clickedDate];
        const outdatedMovements = dataOnDay.lvlCodes.filter((movement) => {
            const {vencida_por} = movement;
            return vencida_por > 0;
        });
        console.log('dataOnDay',dataOnDay);
        console.log('outdatedMovements',outdatedMovements);

        return {lvlCodes: outdatedMovements};
    }else if(accCode === 'projectedIncome' || accCode === 'projectedOutcome'){
        console.log('bankMovementsData[outdatedAccount][clickedDate]',bankMovementsData[outdatedAccount][clickedDate]);
        const dataOnDay = bankMovementsData[accCode][clickedDate];
        const projectedMovement = dataOnDay.lvlCodes.filter((movement) => {
            console.log('movement____________',movement);
            const {vencida_por} = movement;
            return vencida_por <= 0;
        });

        return {lvlCodes: projectedMovement};
    }else if(accCode === 'ingresos' || accCode === 'egresos'){

        console.log('bankMovementsData[accCode][clickedDate]',bankMovementsData[accCode][clickedDate]);

        return bankMovementsData[accCode][clickedDate];
    }

    if(accCode === 'commonIncomeMovements' || accCode === 'commonOutcomeMovements'){
        const commonMovementsData = bankMovementsData[accCode][clickedDate];
        console.log('commonMovementsData',commonMovementsData);

        return commonMovementsData;
    }
}

const cashFlowTable = document.querySelector('#bankMovementsTableHorizontal');
const cashFlowTableHead = cashFlowTable.getElementsByTagName('thead')[0];
const cashFlowTbody = cashFlowTable.getElementsByTagName('tbody')[0];
const infoMenu = document.getElementById('infoMenu');
const infoContent = document.getElementById('infoContent');
const infoMenuTable = document.getElementById('resumeCashFlowTable');
const infoMenuTableThead = document.getElementsByTagName('thead')[0];
const infoMenuTableTbody = document.getElementsByTagName('tbody')[0]; 
const infoMessage = document.getElementById('infoCashFlowMessage');
const noContableTotals = document.querySelectorAll('.noContableTotal');
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
    const clickedDate = parseInt(allDatesTr[0].children[cellIndex].getAttribute('doty'));
    const clickedYear = parseInt(allDatesTr[0].children[cellIndex].getAttribute('yr'));
    console.log('clickedDate',clickedDate);
    // get selectedRowData
    const selectedRowData = target.closest('tr');
    const accCode = selectedRowData.getAttribute('lvlcode');
    const data = getMovementsByCode(accCode, clickedDate,clickedYear);
    // remove all rows from table
    console.log('infoMenuTable',infoMenuTable.getElementsByTagName('tr'));


    // get cursor position
    const cursorPosition = {
        x: e.clientX,
        y: e.clientY
    }
    console.log(cursorPosition);



    // thead and tbody and remove all rows from table
    infoMenuTableThead.innerHTML = '';
    infoMenuTableTbody.innerHTML = '';

    infoMessage.style.display = 'none';



    infoMenuTable.classList.remove('thrCols');
    infoMenuTable.classList.remove('twCols');

    // return;
    if(accCode === 'projectedIncome' || accCode === 'projectedOutcome' || accCode === 'projectedOutdatedIncomeRow' || accCode === 'projectedOutdatedOutcomeRow'){

        if(accCode === 'projectedIncome' || accCode === 'projectedOutcome'){
            infoMessage.style.display = 'block';
        }
        console.log('data.lvlCodes',data.lvlCodes);

        infoMenuTable.classList.add('thrCols');

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
                            <td>${proveedor}</td>
                            <td>${getChileanCurrency(total)}</td>`;
            infoMenuTableTbody.append(tr);
        })
    }
    if(accCode === 'ingresos' || accCode === 'egresos' ){

        infoMenuTable.classList.add('twCols');

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
        infoMenuTable.classList.add('twCols');
        // create thead with titles
        const theadTr = document.createElement('tr');
        theadTr.innerHTML = `
            <th>Nombre</th>
            <th>Total</th>`;
            
        infoMenuTableThead.append(theadTr);

        data.lvlCodes.forEach((movement) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${movement.name}</td>
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
    // console.log('click');
    infoMenu.style.display = 'none';
});





function getMovementsByCode(accCode, clickedDate,clickedYear){
    const dateToSearch = moment(`${clickedYear}-${clickedDate}`,'YYYY-DDD').format('YYYY-MM-DD');
    const indexToFind = allMyDates.findIndex((date) => {
       return moment(dateToSearch).isSame(date);
    });

    const outdatedAccount = accCode === 'projectedOutdatedIncomeRow' ? 'projectedIncome' : 'projectedOutcome';
   

    if(accCode === 'projectedOutdatedIncomeRow' || accCode === 'projectedOutdatedOutcomeRow'){
        // console.log('bankMovementsData[outdatedAccount][clickedDate]',bankMovementsData[outdatedAccount][clickedDate]);
        const dataOnDay = bankMovementsData[outdatedAccount][indexToFind];
        const outdatedMovements = dataOnDay.lvlCodes.filter((movement) => {
            const {vencida_por} = movement;
            return vencida_por > 0;
        });
        // console.log('dataOnDay',dataOnDay);
        // console.log('outdatedMovements',outdatedMovements);

        return {lvlCodes: outdatedMovements};
    }else if(accCode === 'projectedIncome' || accCode === 'projectedOutcome'){
        // console.log('bankMovementsData[outdatedAccount][clickedDate]',bankMovementsData[outdatedAccount][clickedDate]);
        const dataOnDay = bankMovementsData[accCode][indexToFind];
        const projectedMovement = dataOnDay.lvlCodes.filter((movement) => {
            // console.log('movement____________',movement);
            const {vencida_por} = movement;
            return vencida_por <= 0;
        });

        return {lvlCodes: projectedMovement};
    }else if(accCode === 'ingresos' || accCode === 'egresos'){

        // console.log('bankMovementsData[accCode][clickedDate]',bankMovementsData[accCode][clickedDate]);

        return bankMovementsData[accCode][indexToFind];
    }

    if(accCode === 'commonIncomeMovements' || accCode === 'commonOutcomeMovements'){
        const commonMovementsData = bankMovementsData[accCode][indexToFind];
        // console.log('commonMovementsData',commonMovementsData);

        return commonMovementsData;
    }
}




document.addEventListener('mouseover', (e) => {
    if (e.target.classList.contains('noContableTotal')) {
        // create a tooltip
        const tooltip = document.createElement('div');
        tooltip.classList.add('tooltip');
        tooltip.textContent = 'Total no contable';
        tooltip.style.opacity = 0;
        document.body.appendChild(tooltip);

        // get the position of target element
        const rect = e.target.getBoundingClientRect();
        tooltip.style.top = `${rect.bottom + window.scrollY - 60}px`;
        tooltip.style.left = `${rect.left + window.scrollX - 43}px`;

        // detect if menu is out of screen
        if (tooltip.getBoundingClientRect().bottom > window.innerHeight) {
            tooltip.style.top = `${rect.top - tooltip.getBoundingClientRect().height + window.scrollY}px`;
        }
        if (tooltip.getBoundingClientRect().right > window.innerWidth) {
            tooltip.style.left = `${rect.right - tooltip.getBoundingClientRect().width + window.scrollX}px`;
        }
        if (tooltip.getBoundingClientRect().left < 0) {
            tooltip.style.left = `${rect.left + window.scrollX}px`;
        }
        if (tooltip.getBoundingClientRect().top < 0) {
            tooltip.style.top = `${rect.bottom + window.scrollY}px`;
        }

        // animate tooltip
        
        tooltip.style.transition = 'opacity 0.3s ease-in-out';
        requestAnimationFrame(() => {
            tooltip.style.opacity = 1;
        });

        

    }
});

document.addEventListener('mouseout', (e) => {
    if (e.target.classList.contains('noContableTotal')) {
        // remove the tooltip
        const tooltip = document.querySelectorAll('.tooltip');
        if (tooltip) {
            tooltip.forEach((tip) => {
                tip.style.transition = 'opacity 0.3s ease-in-out';
                tip.style.opacity = 0;
                setTimeout(() => {
                    tip.remove();
                }, 300);
            });
            // tooltip.style.transition = 'opacity 0.3s ease-in-out';
            // tooltip.style.opacity = 0;
            // setTimeout(() => {
            //     tooltip.remove();
            // }, 300);
        }
    }
});




// SCROLL TOP BUTTONS 

const scrollableElement = document.getElementById('financeTableContainer');

        scrollableElement.addEventListener('scroll', async () => {
            if(!activePage.cashFlow){
                return;
            }
            const {
                scrollLeft,
                scrollWidth,
                clientWidth
            } = scrollableElement;

            // Remove buttons if scroll is in the middle
            const nextMonthButton = document.getElementById('nextMonthButton');
            const prevMonthButton = document.getElementById('prevMonthButton');

            if (scrollLeft > 0) {
                // && scrollLeft + clientWidth < scrollWidth
                if (nextMonthButton) nextMonthButton.remove();
                // if (prevMonthButton) prevMonthButton.remove();
            }

            if (scrollLeft > 0) {
                if (prevMonthButton) prevMonthButton.remove();
            }

            // Check if scroll is complete at the right
            if (scrollLeft + clientWidth >= scrollWidth) {
                const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
                const nextMonthButton = document.createElement('button');
                nextMonthButton.id = 'nextMonthButton';
                nextMonthButton.classList.add('dinamycFloatingButton');
                const containerRect = document.getElementById('financesCardTableContainer').getBoundingClientRect();
                nextMonthButton.style.position = 'absolute';
                nextMonthButton.style.bottom = `${10}px`;
                nextMonthButton.style.right = '20px';
                let monthPicked = selectedMonth;
                if (selectedMonth === 12) {
                    monthPicked = 0;
                }
                nextMonthButton.innerText = `Mostrar ${monthNames[(monthPicked)]}`;
                document.getElementById('financesCardTableContainer').appendChild(nextMonthButton);


                nextMonthButton.style.backgroundColor = '#4CAF50';
                nextMonthButton.style.color = 'white';
                nextMonthButton.style.border = 'none';
                nextMonthButton.style.padding = '10px 20px';
                nextMonthButton.style.textAlign = 'center';
                nextMonthButton.style.textDecoration = 'none';
                nextMonthButton.style.display = 'inline-block';
                nextMonthButton.style.fontSize = '16px';
                nextMonthButton.style.margin = '4px 2px';
                nextMonthButton.style.cursor = 'pointer';
                nextMonthButton.style.borderRadius = '12px';

                nextMonthButton.addEventListener('click', async () => {
                    console.log('NEXT MONTH');
                    console.log(selectedMonth, selectedYear);
                    selectedMonth++;

                    if (selectedMonth > 12) {
                        selectedMonth = 1;
                        selectedYear++;
                    }
                    // document.getElementsByClassName('monthPicker')[0].innerHTML = monthNames[(monthPicked)];
                    document.querySelector(`#monthName`).innerText = monthNames[(monthPicked)];
                    document.querySelector(`#yearName`).innerText = selectedYear;
                    // document.getElementsByClassName('yearPicker')[0].innerHTML = selectedYear;

                    renderMyChasFlowTable(selectedMonth, selectedYear);
                    nextMonthButton.remove();
                    scrollableElement.scrollLeft = 0;
                });
            }

            if (scrollLeft === 0) {
                const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
                const prevMonthButton = document.createElement('button');
                prevMonthButton.id = 'prevMonthButton';
                prevMonthButton.classList.add('dinamycFloatingButton');

                const containerRect = document.getElementById('financesCardTableContainer').getBoundingClientRect();
                prevMonthButton.style.position = 'absolute';
                prevMonthButton.style.bottom = `${10}px`;
                prevMonthButton.style.left = `${containerRect.left}px`;
                let monthPicked = selectedMonth - 2;
                if (monthPicked < 0) {
                    monthPicked = 11;
                }
                prevMonthButton.innerText = `Mostrar ${monthNames[monthPicked]}`;
                document.getElementById('financesCardTableContainer').appendChild(prevMonthButton);

                prevMonthButton.style.backgroundColor = '#4CAF50';
                prevMonthButton.style.color = 'white';
                prevMonthButton.style.border = 'none';
                prevMonthButton.style.padding = '10px 20px';
                prevMonthButton.style.textAlign = 'center';
                prevMonthButton.style.textDecoration = 'none';
                prevMonthButton.style.display = 'inline-block';
                prevMonthButton.style.fontSize = '16px';
                prevMonthButton.style.margin = '4px 2px';
                prevMonthButton.style.cursor = 'pointer';
                prevMonthButton.style.borderRadius = '12px';

                prevMonthButton.addEventListener('click', async () => {
                    console.log('PREVIOUS MONTH');
                    console.log(selectedMonth, selectedYear);
                    selectedMonth--;

                    if (selectedMonth < 1) {
                        selectedMonth = 12;
                        selectedYear--;
                    }

                    document.querySelector(`#monthName`).innerText = monthNames[(monthPicked)];
                    document.querySelector(`#yearName`).innerText = selectedYear;
                    
                    renderMyChasFlowTable(selectedMonth, selectedYear);

                    prevMonthButton.remove();
                    scrollableElement.scrollLeft = scrollWidth;
                });
            }
        });

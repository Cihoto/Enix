const commonMovementsListTable = document.getElementById('commonMovementsListTable');
console.log('commonMovementsListTable',commonMovementsListTable);
const commonMovementsListTableTbody = commonMovementsListTable.getElementsByTagName('tbody')[0];
console.log('commonMovementsListTableTbody',commonMovementsListTableTbody);
const commonListTitle = document.getElementById('commonListTitle');
const commonListType = document.getElementById('commonListType');

function renderCommonMovementsListTable(movementsToList){
    // remove all rows from table 
    commonMovementsListTableTbody.innerHTML = '';
    console.log('commonMovementsListTable',commonMovementsListTable);
    console.log('commonMovementsListTableTbody',commonMovementsListTableTbody);
    console.log('movementsToList',movementsToList);
    const {movements, name,income,id} = movementsToList;
    commonListTitle.innerText = commonListTitle.innerText.replace('__$movementsName$__',name);
    commonListType.innerText = commonListType.innerText.replace('_$income$_',income ? 'Ingresos' : 'Egresos');
    movements.forEach((movement) => {
        const {printDate,total,desc,index} = movement;
        const tr = document.createElement('tr');
        console.log('printDate',printDate);
        tr.innerHTML = `
            <td>${name}</td>
            <td>${printDate}</td>
            <td class="cmmTotalChg">${getChileanCurrency(total)}</td>
            <td class="cmmDescChg">${desc}</td>`;
            tr.id = `${id}${index}`
        commonMovementsListTableTbody.append(tr);
    })
}
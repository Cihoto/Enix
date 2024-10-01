let COMMON_MOVEMENTS = [];
const GLOBAL_COMMON_ROWS = document.querySelectorAll('.globalCommonRow');
const COMMON_MOVEMENTS_TABLE = document.querySelector('#bankMovementsTableHorizontal');



// capture click event on global common row

COMMON_MOVEMENTS_TABLE.addEventListener('click', (e) => {
    const tableIsCashFlow = e.target.closest('table').classList.contains('commonMovementsTable'); 
    if(!tableIsCashFlow) return;

    const target = e.target;
    console.log('target',target);

    const closestRow = target.closest('tr').id;
    console.log('closestRow',closestRow);
    
    const selectedRow = COMMON_MOVEMENTS.find((row) => row.id === closestRow);
    console.log('selectedRow',selectedRow);
    const movements = selectedRow;
    console.log('movements',movements);

    // open side menu with movements
    openSideMenuCommonMovementsList();

    // render movements on side menu
    renderCommonMovementsListTable(movements);



})

GLOBAL_COMMON_ROWS.forEach((row) => {
    row.addEventListener('click', (e) => {
        const rowId = e.target.parentElement.id;
        console.log('rowId',rowId);
    });
});


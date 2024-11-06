let COMMON_MOVEMENTS = [];
const GLOBAL_COMMON_ROWS = document.querySelectorAll('.globalCommonRow');
const COMMON_MOVEMENTS_TABLE = document.querySelector('#bankMovementsTableHorizontal');



// capture click event on global common row

COMMON_MOVEMENTS_TABLE.addEventListener('click', async (e) => {
    const tableIsCashFlow = e.target.closest('table').classList.contains('commonMovementsTable'); 
    if(!tableIsCashFlow) return;

    if(e.target.classList.contains('deleteCommonMovement')){
        const commonMovementId = e.target.closest('tr').id; 
        const tr = e.target.closest('tr');
        console.log('commonMovementId',commonMovementId);

        if(confirm('¿Estás seguro que deseas borrar este movimiento?')){
            const responseSoftDelete = await softDeleteCommonMovement(commonMovementId);
            if(responseSoftDelete.success){
                Toastify({
                    text: "Movimiento borrado exitosamente",
                    duration: 3000,
                    close: true,
                    gravity: "top",
                    position: "right",
                    backgroundColor: "#4CAF50",
                }).showToast(); 
                // remove row from table
                tr.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
                tr.style.opacity = '0';
                tr.style.transform = 'translateX(-100%)';
                setTimeout(() => {
                    tr.remove();
                }, 500);

                removeMovementFromBankData (commonMovementId);
               
            }else{
                Toastify({
                    text: "Error al borrar el movimiento",
                    duration: 3000,
                    close: true,
                    gravity: "top",
                    position: "right",
                    backgroundColor: "#FF0000"
                }).showToast();
            }
        }
        return;
    }

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


// document get deleteCommonMovement button and add event listener (dinamyc created)

document.addEventListener('click', (e) => {

});


function removeMovementFromBankData (commonMovementId){
                        
    const deletedMovement = COMMON_MOVEMENTS.find((movement) => movement.id === commonMovementId);
    const { movements } = deletedMovement;
    movements.forEach((movement) => {
        const { printDateTimestamp, total, income } = movement;
        const egresoIngreso = income ? 'commonIncomeMovements' : 'commonOutcomeMovements';
        const dayOnArray = bankMovementsData[egresoIngreso].find(({ timestamp }) => {
            return timestamp == printDateTimestamp;
        });
        if (!dayOnArray) {
            return
        }
        const index = dayOnArray.lvlCodes.findIndex((lvlCode) => lvlCode.id === commonMovementId);
        dayOnArray.lvlCodes.splice(index, 1);
        dayOnArray.total -= parseInt(total);
    });

    // REMOVE TR FROM TABLE

    // UPDATE CURRENT ARRAY
    const indexToUpdate = COMMON_MOVEMENTS.indexOf(deletedMovement);
    COMMON_MOVEMENTS.splice(indexToUpdate,1);
}




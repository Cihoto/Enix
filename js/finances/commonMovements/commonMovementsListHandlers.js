let commonLastValue = ''
commonMovementsListTable.addEventListener('click', (e) => { 
    const target = e.target;
    const classListTarget = target.classList;   
    if(classListTarget.contains('cmmTotalChg') || classListTarget.contains('cmmDescChg')){
        commonLastValue = target.textContent;
        console.log(classListTarget)
        e.target.contentEditable = true;
        e.target.focus();
        e.target.innerText = '';
    }
    
});

commonMovementsListTable.addEventListener('focusout', async (e) => {
    const target = e.target;
    const classListTarget = target.classList;
    if(classListTarget.contains('cmmTotalChg') || classListTarget.contains('cmmDescChg')){

        const objToChange = classListTarget.contains('cmmTotalChg') ? 'total' : 'desc';
        const currentValue = target.innerText
        target.contentEditable = false;
        if(currentValue === "" || currentValue === commonLastValue){
            target.innerText = commonLastValue; 
            return;
        }

        if(!isNumeric(currentValue) && objToChange === 'total'){
            target.innerText = commonLastValue; 
            return;
        }

        const value = objToChange === 'total' ? getChileanCurrency(parseInt(currentValue)) : currentValue;
        target.innerText = value;

        console.log('currentValue',currentValue);
        console.log('objToChange',objToChange);
        console.log('commonLastValue',commonLastValue);
        
        const movementId = target.closest('tr').getAttribute('childId');
        // const {id, index} = getMovementId(movementId);

        // const commonMovment_movementId = target.closest('tr').id;

        // console.log('id',id);
        // console.log('index',index);

        // const movement = COMMON_MOVEMENTS.find((movement) => movement.id === id);

        // movement.movements[index][objToChange] = currentValue;

        const movementObj = getCmmMovementObj(movementId);

        console.log(movementObj);

        const commonMov = {
            ... movementObj ,
            id: movementId
        };

        const responseUpdateMovement = await updateSingleMovement(commonMov);

        if(responseUpdateMovement.success){

            removeCommonMovementSingleFromFlow(commonMov)
            Toastify({
            text: "Movimiento actualizado con éxito",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#4CAF50",
            }).showToast();
        }else{
            Toastify({
            text: "Error al actualizar el movimiento",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#FF0000",
            }).showToast();
        }


        

        // // call Fetch function to update movement

        // fetch('./controller/finance/commonMovements/updateCommonMovement.php', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         id: id,
        //         index: index,
        //         objToChange: objToChange,
        //         value: objToChange === 'total' ? parseInt(currentValue) : currentValue
        //     })
        // })
        // .then(response => response.json())
        // .then(data => {
        //     console.log('Success:', data);
        // })
        // .catch((error) => {
        //     console.error('Error:', error);
        // });
    }
})

function getMovementId(movementId){
    const id = movementId.slice(0, movementId.length - 1);  
    const index = movementId.slice(-1);
    return {id, index};
}

function getCmmMovementObj(id){
    const movement = document.querySelector(`#commonMovementsListTable tr[id="${id}"]`);
    // get all prop called name on td elements and build an array
    const name = Array.from(movement.querySelectorAll('td[name]')).map((td) => {

        if(td.getAttribute('name') === 'printDate'){
            return {
                [td.getAttribute('name')]: moment(td.textContent, 'DD-MM-YYYY').format('X')
            }
        }
        if(td.getAttribute('name') === 'total'){
            
            return {
                [td.getAttribute('name')]: parseInt(td.textContent.replaceAll('.','').replaceAll('$',''))
            }
        }
        return {
            [td.getAttribute('name')]: td.textContent
        }
    });
    // merge all objects in the array into one object
    const movementObject = name.reduce((acc, curr) => {
        return {...acc, ...curr}
    }, {});
    return movementObject;
}

function isNumeric(value) {
    return !isNaN(value - parseFloat(value));
}



function removeCommonMovementSingleFromFlow(objToChange){
    const {id,total,desc} = objToChange;
    const modifiedTr = document.querySelector(`#commonMovementsListTable tr[id="${id}"]`);

    console.log(`#commonMovementsListTable tr[id="${id}"]`)
    console.log('modifiedTr',modifiedTr);

    const parentId = modifiedTr.getAttribute('parentId');

    // find parentId in COMMON_MOVEMENTS
    const parent = COMMON_MOVEMENTS.find((parent) => parent.id === parentId);
    // find movement in parent
    const {movements, income} = parent;
    console.log('movements',movements);
    const movement = movements.find((movement) => movement.id == id);
    // update movement
    console.log('movement',objToChange);
    console.log(id)
    console.log(total);
    console.log(desc);
    console.log('movement',movement);
    movement.total = total;
    movement.desc = desc;
    // update BankData array with new total
    const bankData = bankMovementsData[income ? 'commonIncomeMovements' : 'commonOutcomeMovements'];
    const day = bankData.find((day) => day.timestamp == movement.printDateTimestamp);
    // replace total
    day.lvlCodes.forEach((lvlCode) => {
        if(lvlCode.id == id){
            lvlCode.total = total;
            lvlCode.desc = desc;
        }
    });
}

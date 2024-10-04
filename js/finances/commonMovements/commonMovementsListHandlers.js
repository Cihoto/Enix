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

commonMovementsListTable.addEventListener('focusout', (e) => {
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
        
        const movementId = target.closest('tr').id;
        const {id, index} = getMovementId(movementId);

        console.log('id',id);
        console.log('index',index);

        const movement = COMMON_MOVEMENTS.find((movement) => movement.id === id);

        movement.movements[index][objToChange] = currentValue;
        

        // call Fetch function to update movement

        fetch('./controller/finance/commonMovements/updateCommonMovement.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
                index: index,
                objToChange: objToChange,
                value: objToChange === 'total' ? parseInt(currentValue) : currentValue
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
})

function getMovementId(movementId){
    const id = movementId.slice(0, movementId.length - 1);  
    const index = movementId.slice(-1);
    return {id, index};
}


function isNumeric(value) {
    return !isNaN(value - parseFloat(value));
}
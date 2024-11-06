async function softDeleteCommonMovement(id) {
    const commonMovements = await fetch('controller/common_movements/softDeleteCommonMovement.php',
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                commonMovementId: id
            })
        }
    );
    const response = await commonMovements.json();
    return response;
}
async function updateSingleMovement(commonMov){
    const commonMovements = await fetch('controller/common_movements/updateSingleMovement.php',
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: commonMov
            })
        }
    );
    const response = await commonMovements.json();
    return response;
}
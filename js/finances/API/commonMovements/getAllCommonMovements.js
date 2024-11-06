// get all common movements
// body example: { businessName: 'INTEC', businessId: 77604901, businessAccount: 63741369 }
// body: JSON.stringify({
//     businessName: 'INTEC',
//     businessId: 77604901,
//     businessAccount: 63741369
// })
async function getAllCommonMovements() {
    const commonMovements = await fetch('controller/finance/commonMovements/getCommonMovementsData.php',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
    const response = await commonMovements.json();
    console.log('response', response);
    return response;
}


async function getCommonMovementsFromDb() {
    const commonMovements = await fetch('controller/common_movements/getCommonMovements.php',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
    const response = await commonMovements.json();
    console.log('response', response);

    
    return response;
}

async function insertCommonMovementsFromJson() {
    const commonMovements = await fetch('controller/common_movements/insertCommonMovementsFromJson.php',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
    const response = await commonMovements.json();
    console.log('response', response);
    return response;
}
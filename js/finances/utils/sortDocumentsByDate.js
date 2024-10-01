let sortedByDate = 0
function sortDocumentsByDate(docType){
    sortedByDate++;
    console.log('sortedByDate',sortedByDate)

    let futureDocuments = tributarieDocuments[docType];
    let sortedArray = [];
    if(sortedByDate > 2){
        sortedByDate = 0;
    }

    if(sortedByDate === 0){
        console.log('sortedByDate',sortedByDate);
        sortedArray = futureDocuments;
    }
    if(sortedByDate === 1){
        console.log('sortedByDate',sortedByDate)
        sortedArray = futureDocuments.sort((a,b) => a.fecha_emision - b.fecha_emision);
    }
    if(sortedByDate === 2){
        console.log('sortedByDate',sortedByDate)
        sortedArray = futureDocuments.sort((a,b) => b.fecha_emision + a.fecha_emision);
    }
    return sortedArray;
}

function sortTributarieDocumentsByDate(docType){
    sortedByDate++;
    console.log('sortedByDate',sortedByDate);

    

    // subtract 2 months to current date
    let currentDate_2mthAgo = moment().subtract(12,'months').format('X');

    let futureDocuments = tributarieDocuments[docType].filter(({fecha_emision_timestamp}) =>{
        return fecha_emision_timestamp > currentDate_2mthAgo;
    });
    let sortedArray = [];
    if(sortedByDate > 2){
        sortedByDate = 0;
    }

    if(sortedByDate === 0){
        console.log('sortedByDate',sortedByDate);
        sortedArray = futureDocuments;
    }
    if(sortedByDate === 1){
        console.log('sortedByDate',sortedByDate)
        sortedArray = futureDocuments.sort((a,b) => a.fecha_emision_timestamp - b.fecha_emision_timestamp);
    }
    if(sortedByDate === 2){
        console.log('sortedByDate',sortedByDate)
        sortedArray = futureDocuments.sort((a,b) => b.fecha_emision_timestamp + a.fecha_emision_timestamp);
    }

    const folio4 = sortedArray.filter(({folio}) => folio == 4);
    console.log('folio4',folio4);
    return sortedArray;
}


function sortAllPaidDocuments(){
    sortedByDate++;
    console.log('sortedByDate',sortedByDate);
    
    // subtract 2 months to current date
    let currentDate_2mthAgo = moment().subtract(12,'months').format('X');
    let payments = tributarieDocuments['payments'].filter(({fecha_emision_timestamp,paid}) =>{
        return fecha_emision_timestamp > currentDate_2mthAgo && paid;
    });
    let charges = tributarieDocuments['charges'].filter(({fecha_emision_timestamp,paid}) =>{
        return fecha_emision_timestamp > currentDate_2mthAgo && paid;
    });
    const futureDocuments = [...payments,...charges];
    let sortedArray = [];
    if(sortedByDate > 2){
        sortedByDate = 0;
    }

    if(sortedByDate === 0){
        console.log('sortedByDate',sortedByDate);
        sortedArray = futureDocuments;
    }
    if(sortedByDate === 1){
        console.log('sortedByDate',sortedByDate)
        sortedArray = futureDocuments.sort((a,b) => a.fecha_emision_timestamp - b.fecha_emision_timestamp);
    }
    if(sortedByDate === 2){
        console.log('sortedByDate',sortedByDate)
        sortedArray = futureDocuments.sort((a,b) => b.fecha_emision_timestamp + a.fecha_emision_timestamp);
    }

    const folio4 = sortedArray.filter(({folio}) => folio == 4);
    console.log('folio4',folio4);
    return sortedArray;
}
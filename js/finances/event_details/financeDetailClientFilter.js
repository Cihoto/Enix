let allMyCustomers = [];



function setAllMyCustomers(events){
    
    let customers = []
    events.forEach((ev)=>{
        if(!allMyCustomers.includes(ev.client_name)){
            if(ev.client_name === "" || ev.client_name === null || ev.client_name === undefined){

            }else{
                customers.push([ev.client_name,ev.df_client_name])
            }
        }
    });
    allMyCustomers = customers;

    renderMyCustomers(customers);
}

function renderMyCustomers(customers){

    $('#financeCustomerFilter').append(new Option('Todos',''));

    customers.forEach((customer)=>{
        $('#financeCustomerFilter').append(new Option(`${customer[0]} - ${customer[1]}`,`${customer[0]},${customer[1]}`));
    })
}
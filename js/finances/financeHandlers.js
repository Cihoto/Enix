$(document).on('click', '.redirectToEvent', function () {

console.log(this)
let evId = $(this).closest('tr').attr('event_id');

// alert(evId)
window.location = `./miEvento.php?event_id=${evId}`;

});
  
  
$(document).on('click', '.--data-details-fnc', function () {


let event_id = $(this).closest('tr').attr('event_id');

const EVENT_DATA = EVENT_TABLE_DATA.find((ev)=>{
    return ev.eventId == event_id
});


if(!EVENT_DATA){
    return;
}
// resetAllArrows();

if($(this).find('svg').hasClass('--show-data')){
    removeEventDetails(event_id);
    $(this).find('svg').removeClass('--show-data');
    $(this).closest('tr').removeClass('--act-show-data');
    return
}

setRowSelected($(this));

const SVG_ARROW = $(this).find('svg').addClass('--show-data');
$(SVG_ARROW).closest('tr').after(createNewEventDetail(EVENT_DATA));


});


function openFinancesEventsDetails(){
    window.location = './financeEventDetails.php';
}


function filterFinanceEventList(value){

    console.log(value);
    console.log(EVENT_TABLE_DATA);

    if(value === ''){       
        
        renderFinancialEventDetails(EVENT_TABLE_DATA)
        return;
    }

    const FILTERED_EVENTS = EVENT_TABLE_DATA.filter((ev)=>{
        return ev.event_type == value;
    });
    if(!FILTERED_EVENTS){
        return;
    }

    console.log('FILTERED_EVENTS',FILTERED_EVENTS);

    renderFinancialEventDetails(FILTERED_EVENTS)
}


function filterFinanceTableByCustomer(value){

    console.log(value);
    console.log(EVENT_TABLE_DATA);

    if(value === ''){       
        
        renderFinancialEventDetails(EVENT_TABLE_DATA)
        return;
    }


    let valueArr = value.split(',');
    console.log(valueArr)

    const FILTERED_EVENTS = EVENT_TABLE_DATA.filter((ev)=>{
        return ev.client_name == valueArr[0] && ev.df_client_name == valueArr[1] ;
    });
    if(!FILTERED_EVENTS){
        return;
    }

    console.log('FILTERED_EVENTS',FILTERED_EVENTS);

    renderFinancialEventDetails(FILTERED_EVENTS)
}
function filterFinanceTableByMonth(value){

    console.log(value);
    console.log(EVENT_TABLE_DATA);

    if(value === ''){       
        
        renderFinancialEventDetails(EVENT_TABLE_DATA)
        return;
    }

    const FILTERED_EVENTS = EVENT_TABLE_DATA.filter((ev)=>{
        let date = moment(ev.event_init_date);
        let month = date.month();
        return month + 1 === parseInt(value)
    });
    
    if(!FILTERED_EVENTS){
        return;
    }


    renderFinancialEventDetails(FILTERED_EVENTS)
}












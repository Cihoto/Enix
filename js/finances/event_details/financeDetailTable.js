const FINANCE_EVENT_DETAIL_TABLE_BODY = document.querySelector('#financeEventDetail tbody');
const TOTAL_INCOME = document.getElementById('totalEvents');
let EVENT_TABLE_DATA = [];
let total_income = 0;

// COPY FROM RESUME PROJECT
const PERCENTAJE_COLORS = {
  'red': {
    background: '#ffcccc',
    progressBar: '#ff0000'
  },
  'yellow': {
    background: '#fbf0d0',
    progressBar: '#F2C94C'
  },
  'green': {
    background: '#b3ffb3',
    progressBar: '#00cc00'
  }
}


function renderFinancialEventDetails(eventDetails) {

  while (FINANCE_EVENT_DETAIL_TABLE_BODY.firstChild) {
    FINANCE_EVENT_DETAIL_TABLE_BODY.removeChild(FINANCE_EVENT_DETAIL_TABLE_BODY.firstChild);
  }

  eventDetails.forEach((eventRow) => {
    let newRow = document.createElement('tr');
    newRow.innerHTML = createNewRow(eventRow);
    newRow.setAttribute('event_id', eventRow.eventId);
    FINANCE_EVENT_DETAIL_TABLE_BODY.appendChild(newRow);
  });

  calculateTotalIncome(eventDetails)

}

function createNewRow(eventRow) {

  const nuevaFilaHtml = `
    <tr>
      <td>
        <button class="--data-details-fnc">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M6.75 13.5L11.25 9L6.75 4.5" stroke="#8B8D97" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <button>
          <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
            <path d="M14.75 3H4.25C3.42157 3 2.75 3.67157 2.75 4.5V15C2.75 15.8284 3.42157 16.5 4.25 16.5H14.75C15.5784 16.5 16.25 15.8284 16.25 15V4.5C16.25 3.67157 15.5784 3 14.75 3Z" stroke="#8B8D97" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M2.75 7.5H16.25" stroke="#8B8D97" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12.5 1.5V4.5" stroke="#8B8D97" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M6.5 1.5V4.5" stroke="#8B8D97" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <p>${eventRow.event_name}</p>
        <button>
          ${getifEventHasDocuments(eventRow.creditedBalance)}
        </button>
        <button class="redirectToEvent">
          <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
            <path d="M14 9.75V14.25C14 14.6478 13.842 15.0294 13.5607 15.3107C13.2794 15.592 12.8978 15.75 12.5 15.75H4.25C3.85218 15.75 3.47064 15.592 3.18934 15.3107C2.90804 15.0294 2.75 14.6478 2.75 14.25V6C2.75 5.60218 2.90804 5.22064 3.18934 4.93934C3.47064 4.65804 3.85218 4.5 4.25 4.5H8.75" stroke="#8B8D97" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M11.75 2.25H16.25V6.75" stroke="#8B8D97" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M8 10.5L16.25 2.25" stroke="#8B8D97" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </td>
      <td>${getDateFormatted(eventRow.event_init_date)}</td>
      <td>${CLPFormatter(eventRow.event_income)}</td>
      <td>${CLPFormatter(eventRow.event_cost)}</td>
      <td>${getWorth(eventRow.event_income, eventRow.event_cost)}</td>
      <td>${createProgressBar(eventRow.creditedBalance)}</td>
    </tr>`;


  return nuevaFilaHtml;
}


function calculateTotalIncome(events) {

  let income = 0;
  events.forEach((ev) => {
    if (ev.event_income === "" || ev.event_income === null || ev.event_income === undefined) {
      income += 0;
    } else {
      income += parseInt(ev.event_income);
    }
  });

  total_income = income;


  TOTAL_INCOME.textContent = CLPFormatter(income);
}

function getWorth(totalIncome, costs) {
  return CLPFormatter(totalIncome - costs);
}

function createProgressBar(eventData) {


  const CREDITED_BALANCE = eventData;

  if (CREDITED_BALANCE === '' || CREDITED_BALANCE === null || CREDITED_BALANCE === 'null') {

    return `<div class="--finance-perc-container" >
          <div class="--finance-perc-view">
          </div>
      </div>`;
  }

  eventData = JSON.parse(eventData);

  let progressColor = [];
  if (eventData.currentPercentage < 33) {
    progressColor = PERCENTAJE_COLORS.red;
  }

  if (eventData.currentPercentage >= 33 && eventData.currentPercentage <= 66) {
    progressColor = PERCENTAJE_COLORS.yellow;
  }

  if (eventData.currentPercentage >= 66) {
    progressColor = PERCENTAJE_COLORS.green;
  }

  let backgroundColor = `background-color:${progressColor.background};`;
  let barColor = `background-color:${progressColor.progressBar};width:${eventData.currentPercentage}%;`;

  return `<div class="--finance-perc-container" style="${backgroundColor}">
    <div style="${barColor} class="--finance-perc-view" style="${barColor}">
    </div>
  </div>`;

}

function resetAllArrows() {

  $('.--show-data').each((index, arrow) => {
    // $('.--show-data').css('tranform', 'rotate(-90deg)');
    $('.--show-data').removeClass('.--show-data')
  })

}


function createNewEventDetail(event_data) {


  const CREDITED_AMOUNTS = setCreditedAmountsAndData(event_data.creditedBalance);
  const COSTS = setEventCosts(event_data.otherCost_json, event_data.selectedPersonal_json, event_data.selectedVehicles_json, event_data.selected_prods_json, event_data.subRent_json);

  return `<tr class="-event-data-info" evId_dt="${event_data.eventId}">
  <td colspan="6">
    <div class="--ev-detailsOnTable">

      <div class="--ev-det-icon-ctn">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M11.25 7.5L15 11.25L11.25 15" stroke="#069B99" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M3 3V8.25C3 9.04565 3.31607 9.80871 3.87868 10.3713C4.44129 10.9339 5.20435 11.25 6 11.25H15" stroke="#069B99" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>

      <div class="--ev-det-info-ctn">

        <div class="ev-det-info-general">
          <div class="--ev-det-group">
            <p class="--ev-det-title --py">Cliente</p>
            <p class="--ev-det-desc">${setClientNameOnEventDetail(event_data.client_name, event_data.df_client_name)}</p>
          </div>

          <div class="--ev-det-group">
            <p class="--ev-det-title">DTE</p>
            <p class="--ev-det-desc">${CREDITED_AMOUNTS.dte}</p>
          </div>

          <div class="--ev-det-group">
            <p class="--ev-det-title">Ingresado/Facturado</p>
            <p class="--ev-det-desc">${CREDITED_AMOUNTS.billed}</p>
          </div>

          <div class="--ev-det-group">
            <p class="--ev-det-title">Estado de pago</p>
            <p class="--ev-det-desc">${CREDITED_AMOUNTS.paymentStatus}</p>
          </div>

          <div class="--ev-det-group">
            <p class="--ev-det-title">Abono</p>
            <p class="--ev-det-desc">${CREDITED_AMOUNTS.creditedAmount}</p>
          </div>

        </div>

        <div class="ev-det-info-general ">
          <div class="--ev-det-group">
            <p class="--ev-det-title --py">Total Costos:</p>
            <p class="--ev-det-desc">${CLPFormatter(COSTS.total)}</p>
          </div>
          <div class="--ev-det-group">
            <p class="--ev-det-title">Vehículos</p>
            <p class="--ev-det-desc">${CLPFormatter(COSTS.vehicle)}</p>
          </div>

          <div class="--ev-det-group">
            <p class="--ev-det-title">Sub Arriendos</p>
            <p class="--ev-det-desc">${CLPFormatter(COSTS.subRent)}</p>
          </div>

          <div class="--ev-det-group">
            <p class="--ev-det-title">Otros</p>
            <p class="--ev-det-desc">${CLPFormatter(COSTS.otherProds)}</p>
          </div>

          <div class="--ev-det-group">
            <p class="--ev-det-title">Personas</p>
            <p class="--ev-det-desc">${CLPFormatter(COSTS.personal)}</</p>
          </div>

        </div>
      </div>
    </div>
  </td>
</tr>`;
}


function setClientNameOnEventDetail(client_name, df_client_name) {

  if (client_name === "" || client_name === null) {
    return ''
  }

  if (df_client_name == "" || df_client_name === null) {
    return client_name
  }

  return `${client_name} - ${df_client_name}`

}

function setCreditedAmountsAndData(creditedData) {


  let CREDITED_BALANCE_ARRAY = {
    'dte': 'No',
    'billed': 'No',
    'paymentStatus': '',
    'creditedAmount': '$0'
  }

  if (creditedData === '' || creditedData === null || creditedData === 'null') {

    return CREDITED_BALANCE_ARRAY;
  }

  creditedData = JSON.parse(creditedData);

  if (creditedData.hasDocument) {
    CREDITED_BALANCE_ARRAY.dte = 'Sí';
  }

  if (creditedData.isBilled) {
    CREDITED_BALANCE_ARRAY.billed = 'Sí';
  }

  if (creditedData.isPaid) {
    CREDITED_BALANCE_ARRAY.paymentStatus = 'Pagado';
    CREDITED_BALANCE_ARRAY.creditedAmount = CLPFormatter(creditedData.totalIncomeToCredit);
  } else {
    CREDITED_BALANCE_ARRAY.paymentStatus = 'Abonado';
    CREDITED_BALANCE_ARRAY.creditedAmount = CLPFormatter(creditedData.creditedTotal);
  }

  return CREDITED_BALANCE_ARRAY;
}


function setEventCosts(others, personal, vehicles, prod, subRent) {

  let costData = {
    'otherProds': getOtherProdsCost(others),
    'personal': getPersonalCost(personal),
    'subRent': getSubRentCost(subRent),
    'vehicle': getVehiclesCost(vehicles),
    'total': 0
  }

  costData.total = setTotalCosts(costData);

  return costData
}

function setTotalCosts(costs) {

  return costs.otherProds + costs.personal + costs.subRent + costs.vehicle;
}

function getVehiclesCost(vehicleInfo) {
  let vehicleData = JSONisValid(vehicleInfo);
  if (!vehicleData) {
    return 0;
  }

  const TOTAL_VEHICLES = vehicleData.map((vehicle) => {
    return parseInt(vehicle.cantidadViajes) * parseInt(vehicle.tripValue);
  });

  return addNumberArray(TOTAL_VEHICLES);


}

function getSubRentCost(subRentObj) {
  let subRentData = JSONisValid(subRentObj);
  if (!subRentData) {
    return 0;
  }


  const TOTAL_SUBRENT = subRentData.map((subRent) => {
    return parseInt(subRent.valor);
  });

  return addNumberArray(TOTAL_SUBRENT);


}

function getPersonalCost(personalObj) {
  let personalData = JSONisValid(personalObj);

  if (!personalData) {
    return 0;
  }


  const TOTAL_PERSONAL = personalData.map((personal) => {

    if (personal.contrato.toUpperCase() === 'FREELANCE') {
      return parseInt(personal.neto)
    } else {

      return parseInt(personal.neto) * parseInt(personal.horasTrabajadas);
    }
  });

  return addNumberArray(TOTAL_PERSONAL);


}

function getOtherProdsCost(othersObj) {
  let othersData = JSONisValid(othersObj);

  if (!othersData) {
    return 0;
  }
  const TOTAL_OTHERS = othersData.map((other) => {
    return parseInt(other.monto);
  });

  return addNumberArray(TOTAL_OTHERS);
}

function JSONisValid(strJSON) {

  if (strJSON === '' || strJSON === null || strJSON === 'null' || strJSON === '[]') {
    return false;
  }
  console.log("!");
  strJSON = JSON.parse(strJSON);
  console.log(strJSON)
  for (let index = 0; index < 10; index++) {
    // console.log('index',index);

    if (!Array.isArray(strJSON)) {
      strJSON = JSON.parse(strJSON);
    } else {
      break
    }
  }

  if (!Array.isArray(strJSON)) {
    return false;
  }
  return strJSON;
}

function addNumberArray(numArr) {
  let total = 0;

  numArr.forEach((num) => {
    total += num;
  })

  return total;
}

function removeEventDetails(event_id) {

  console.log($(`.-event-data-info[evId_dt="${event_id}"]`));
  $(`.-event-data-info[evId_dt="${event_id}"]`).remove();
}

function setRowSelected(row) {

  console.log(row)
  $(row).closest('tr').addClass('--act-show-data')
}


function getifEventHasDocuments(str_financeObj) {

  console.log('str_financeObj', str_financeObj);


  // let creditedBalance = JSONisValid(str_financeObj);

  if (str_financeObj === '' || str_financeObj === null || str_financeObj === 'null') {

    return ``;
  }

  str_financeObj = JSON.parse(str_financeObj);

  console.log('str_financeObj 102938019380193801923801928301928301', str_financeObj);

  if(str_financeObj.hasDocument === ''){
    return '';
  }
  if (str_financeObj.hasDocument) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
    <path d="M11 1.5H5C4.60218 1.5 4.22064 1.65804 3.93934 1.93934C3.65804 2.22064 3.5 2.60218 3.5 3V15C3.5 15.3978 3.65804 15.7794 3.93934 16.0607C4.22064 16.342 4.60218 16.5 5 16.5H14C14.3978 16.5 14.7794 16.342 15.0607 16.0607C15.342 15.7794 15.5 15.3978 15.5 15V6L11 1.5Z" stroke="#8B8D97" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M12.5 12.75H6.5" stroke="#8B8D97" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M12.5 9.75H6.5" stroke="#8B8D97" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"  />
    <path d="M8 6.75H7.25H6.5" stroke="#8B8D97" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M11 1.5V6H15.5" stroke="#8B8D97" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"  />
    </svg>`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
  <g clip-path="url(#clip0_2089_28414)">
    <path d="M9.54004 16.5C13.6822 16.5 17.04 13.1421 17.04 9C17.04 4.85786 13.6822 1.5 9.54004 1.5C5.3979 1.5 2.04004 4.85786 2.04004 9C2.04004 13.1421 5.3979 16.5 9.54004 16.5Z" stroke="#8B8D97" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M6.54004 9H12.54" stroke="#8B8D97" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <defs>
    <clipPath id="clip0_2089_28414">
      <rect width="18" height="18" fill="white" transform="translate(0.540039)"/>
    </clipPath>
  </defs>
</svg>`;


  // if(){}

}
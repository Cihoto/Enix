function getFinanceEventDetail(empresa_id) {

  fetch('ws/finance/getFinancialEventDetails.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      request: {
        'empresa_id': empresa_id
      }
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error en la solicitud 1');
    }
    return response.json();
  })
  .then(data => {
    
    // Manejar la respuesta exitosa aquí

    console.log(data);
    EVENT_TABLE_DATA = data.eventDetails;
    renderFinancialEventDetails(data.eventDetails);
    setAllMyCustomers(data.eventDetails);

  })
  .catch(error => {
    // Manejar errores aquí
    console.error('Error en la solicitud:', error);
  });
}
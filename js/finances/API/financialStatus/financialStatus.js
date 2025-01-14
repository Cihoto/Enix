async function getFinancialStatus() {
  const responseData = await fetch(`controller/financialStatus/getFinancialStatus.php`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  const response = await responseData.json();

  if (!response.success) {
    return []
  }
  return response.data;
}
async function getFinancialStatus_range(dateFrom, dateTo) {
  const responseData = await fetch(`controller/financialStatus/getFinancialStatus_range.php`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dateFrom,
        dateTo
      })
    }
  );
  const response = await responseData.json();

  if (!response.success) {
    return []
  }

  let financialStatus = response.data;
  console.log('financialStatus', financialStatus);
  if (renderDaily) {

    // order by date asc and get last 5 elements
    financialStatus = financialStatus.sort((a, b) => {
      return moment(a.date).diff(moment(b.date));
    });
    financialStatus = financialStatus.slice(-5);

  } else {

    // Get the current date
    const currentDate = moment(dateTo);

    // Get the last 4 weeks plus the current week
    financialStatus = [];
    for (let i = 0; i < 5; i++) {
      const weekStart = currentDate.clone().subtract(i, 'weeks')
      console.log(i);
      console.log('weekStart', currentDate.format('YYYY-MM-DD'));
      console.log('weekStart', weekStart.format('YYYY-MM-DD'));

      const weeklyData = response.data.find(item => {
        const { date } = item;
        return date == weekStart.format('YYYY-MM-DD');
      });
      console.log('weeklyData', weeklyData);

      if (!weeklyData) {
        financialStatus.push(
          {
            "issued": 0,
            "received": 0,
            "total": 0,
            "date": weekStart.format('YYYY-MM-DD'),
            "bank_balance": 0,
            "avit": 0
          }
        );
      }else{
        financialStatus.push(weeklyData);
      }


    }

    // Sort by date ascending
    financialStatus = financialStatus.sort((a, b) => moment(a.date, 'YYYY-MM-DD').diff(moment(b.date, 'YYYY-MM-DD')));

  }
  console.log('financialStatus', financialStatus);
  return financialStatus
}
async function getFinancialStatus() {
  const responseData = await fetch(`controller/financialStatus/getFinancialStatus.php`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  const response = await responseData.json();

  if (!response.success) {
    return []
  }
  return response.data;
}
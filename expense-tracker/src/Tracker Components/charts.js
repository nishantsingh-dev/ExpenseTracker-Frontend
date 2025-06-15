const ctx = document.getElementById('myChart');

  new Chart(ctx, {
    type: 'polarArea',
    data: {
      labels: ['Expense', 'Income', 'Balance'],
      datasets: [{
        label: '# of Votes',
        data: [35000, 150000, 125000],
        backgroundColor:[
            'rgba(255,99,132,1)',
            'rgba(54,162,235,1)',
            'rgba(255,206,86,1)',
        ],
      }]
    },
    options: {
      responsive: true,
    }
  });
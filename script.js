let chart;

function getStockData() {
  const symbol = document.getElementById('symbolInput').value.toUpperCase();
  if (!symbol) return alert("Please enter a stock symbol");

  const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1min&outputsize=10&apikey=88a8682639ff45bdb7bd28d49cc9aeab`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.status === "error") {
        alert(data.message || "Stock not found");
        return;
      }

      const timeSeries = data.values.reverse();
      const labels = timeSeries.map(point => point.datetime.split(" ")[1]);
      const prices = timeSeries.map(point => parseFloat(point.close));

      updateChart(labels, prices);

      const latest = timeSeries[timeSeries.length - 1];
      document.getElementById('price').textContent = latest.close;
      document.getElementById('high').textContent = latest.high;
      document.getElementById('low').textContent = latest.low;
    })
    .catch(err => {
      alert("Error fetching stock data");
      console.error(err);
    });
}

function updateChart(labels, prices) {
  const ctx = document.getElementById('stockChart').getContext('2d');

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Price ($)',
        data: prices,
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { display: true, title: { display: true, text: 'Time' } },
        y: { display: true, title: { display: true, text: 'Price ($)' } }
      }
    }
  });
}

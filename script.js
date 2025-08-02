let chart;


function getStockData() {
  const symbol = document.getElementById('symbolInput').value.toUpperCase();
  if (!symbol) return alert("Please enter a stock symbol");

  // Chart Data (time series)
  

  const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1min&outputsize=10&apikey=88a8682639ff45bdb7bd28d49cc9aeab`;
  // Key Metrics Data
  const metricsUrl = `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=88a8682639ff45bdb7bd28d49cc9aeab`;

  // Fetch chart data
  fetch(chartUrl)
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
    });

  // Fetch metrics data
  fetch(metricsUrl)
    .then(res => res.json())
    .then(info => {
      document.getElementById('price').textContent = info.price;
      document.getElementById('high').textContent = info.high;
      document.getElementById('low').textContent = info.low;
      document.getElementById('change').textContent = info.percent_change;
      document.getElementById('volume').textContent = info.volume;
    })
    .catch(err => {
      alert("Error fetching stock metrics");
      console.error(err);
    });
}

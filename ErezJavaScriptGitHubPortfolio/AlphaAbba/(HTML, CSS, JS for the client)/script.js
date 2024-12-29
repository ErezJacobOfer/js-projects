document.getElementById('filter-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const timeRange = document.getElementById('timeRange').value;
    const minPrice = document.getElementById('minPrice').value || 0;
    const maxPrice = document.getElementById('maxPrice').value || Infinity;
  
    //const response = await fetch(`/stocks?timeRange=${timeRange}&minPrice=${minPrice}&maxPrice=${maxPrice}`);
    const response = await fetch(`http://localhost:3000/stocks?timeRange=${timeRange}&minPrice=${minPrice}&maxPrice=${maxPrice}`);

    const data = await response.json();
  
    const resultsTable = document.querySelector('#results tbody');
    resultsTable.innerHTML = '';
    data.forEach(stock => {
      const row = `<tr>
        <td>${stock.symbol}</td>
        <td>$${stock.currentPrice}</td>
        <td>${stock.trend}</td>
        <td>$${stock.ath}</td>
      </tr>`;
      resultsTable.innerHTML += row;
    });
  });
  
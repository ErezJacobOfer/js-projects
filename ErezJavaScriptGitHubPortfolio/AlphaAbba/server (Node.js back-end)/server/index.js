const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Serve static files from the public folder
app.use(express.static('public'));

// API route to get stock data
app.get('/stocks', async (req, res) => {
  const { timeRange, minPrice, maxPrice } = req.query;

  try {
    // Fetch NASDAQ stock data (replace with a real API)
    const response = await axios.get('https://api.example.com/nasdaq/stocks', {
        headers: {
            Authorization: `Bearer ${process.env.API_KEY}`, // Use API key from .env
          },
          params: {
            timeRange,
            minPrice,
            maxPrice,
          },
        });

    const stocks = response.data;

    // Filter stocks
    const filteredStocks = stocks
      .filter(stock => stock.price >= minPrice && stock.price <= maxPrice)
      .filter(stock => stock.athDate >= Date.now() - timeRange * 24 * 60 * 60 * 1000)
      .map(stock => ({
        symbol: stock.symbol,
        currentPrice: stock.price,
        ath: stock.ath,
        trend: stock.price > stock.movingAverage ? 'Upward' : 'Neutral/Downward',
      }));

    res.json(filteredStocks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));


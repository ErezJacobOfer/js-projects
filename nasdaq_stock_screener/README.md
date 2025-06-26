# NASDAQ Stock Screener

A React-based stock screening dashboard that automatically scans NASDAQ stocks under $5 and identifies trending opportunities across multiple timeframes.

## Features

- **Real-time NASDAQ Stock Scanning**: Automatically fetches and analyzes NASDAQ stocks
- **Price Filtering**: Focus on stocks under $5 (configurable)
- **Trend Analysis**: Identifies trending stocks across daily, 3-day, and weekly timeframes
- **Advanced Filtering**: Filter by price range, volume, sector, and search terms
- **Export Capabilities**: Export results to CSV, JSON, or PDF
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Data**: Uses Polygon.io API for accurate market data

## Prerequisites

Before running this application, you need:

1. **Node.js** (version 16 or higher)
2. **Polygon.io API Key** (free tier available)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd nasdaq-stock-screener
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Get Your Polygon.io API Key

1. Visit [polygon.io](https://polygon.io/dashboard/api-keys)
2. Sign up for a free account
3. Navigate to your dashboard and copy your API key
4. Free tier includes:
   - 5 API requests per minute
   - Real-time and historical stock data
   - NASDAQ, NYSE, and other exchanges

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```env
# Polygon API Configuration
VITE_POLYGON_API_KEY=your_actual_api_key_here
```

**Important**: Replace `your_actual_api_key_here` with your actual Polygon.io API key.

### 5. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## API Key Troubleshooting

If you encounter a 401 error or "Authentication failed" message:

1. **Check your .env file**: Ensure `VITE_POLYGON_API_KEY` is set correctly
2. **Verify your API key**: Log into [Polygon.io dashboard](https://polygon.io/dashboard/api-keys) and confirm your key
3. **Restart the server**: After updating the .env file, restart your development server
4. **Check the browser console**: Look for detailed error messages

### Common Error Messages:

- **401 Unauthorized**: Invalid or missing API key
- **403 Forbidden**: API key doesn't have required permissions
- **429 Rate Limited**: Too many requests (free tier: 5/minute)

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
│   └── stock-screening-dashboard/
├── utils/              # API utilities and helpers
├── constants/          # Configuration constants
└── styles/            # Global styles
```

## Key Technologies

- **React 18** with functional components and hooks
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Axios** for API requests
- **Polygon.io API** for real-time stock data
- **Date-fns** for date manipulation
- **Lucide React** for icons

## Usage

1. **Initial Scan**: The app automatically scans NASDAQ stocks on load
2. **Timeframe Selection**: Switch between daily, 3-day, and weekly trends
3. **Filtering**: Use the sidebar to filter by price, volume, and sector
4. **Search**: Find specific stocks by symbol or company name
5. **Sorting**: Click column headers to sort results
6. **Export**: Use the export panel to download results

## Rate Limiting

The application includes built-in rate limiting to comply with Polygon.io's free tier limits:

- Maximum 5 requests per minute
- Automatic retry with exponential backoff
- Batch processing for efficient API usage
- Progress indicators during scans

## Upgrading Your API Plan

For production use or higher rate limits, consider upgrading your Polygon.io plan:

- **Basic Plan**: 100 requests/minute
- **Starter Plan**: 1,000 requests/minute
- **Developer Plan**: 10,000 requests/minute

Visit [Polygon.io pricing](https://polygon.io/pricing) for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues related to:
- **API errors**: Check your Polygon.io API key and subscription
- **Application bugs**: Open an issue on GitHub
- **Feature requests**: Open an issue with the "enhancement" label

## Disclaimer

This application is for educational and informational purposes only. It is not intended as financial advice. Always conduct your own research before making investment decisions.
import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const ExportPanel = ({ stocks }) => {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const exportFormats = [
    {
      id: 'csv',
      label: 'CSV File',
      description: 'Comma-separated values',
      icon: 'FileSpreadsheet'
    },
    {
      id: 'json',
      label: 'JSON File',
      description: 'JavaScript Object Notation',
      icon: 'FileCode'
    },
    {
      id: 'pdf',
      label: 'PDF Report',
      description: 'Formatted report document',
      icon: 'FileText'
    }
  ];

  const handleExport = async (format) => {
    setIsExporting(true);
    setIsExportMenuOpen(false);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      switch (format) {
        case 'csv':
          exportToCSV();
          break;
        case 'json':
          exportToJSON();
          break;
        case 'pdf':
          exportToPDF();
          break;
        default:
          console.log('Unknown export format');
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Symbol', 'Company Name', 'Current Price', 'Change %', 'Volume', 'Market Cap', 'Sector', 'Trend'];
    const csvContent = [
      headers.join(','),
      ...stocks.map(stock => [
        stock.symbol,
        `"${stock.companyName}"`,
        stock.currentPrice,
        stock.changePercent,
        stock.volume,
        stock.marketCap,
        `"${stock.sector}"`,
        stock.trend
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `nasdaq-stocks-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify({
      exportDate: new Date().toISOString(),
      totalStocks: stocks.length,
      stocks: stocks
    }, null, 2);

    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `nasdaq-stocks-${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    // In a real application, you would use a PDF library like jsPDF
    console.log('PDF export would be implemented with a PDF library');
    alert('PDF export functionality would be implemented with a PDF library like jsPDF');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
        disabled={isExporting || stocks.length === 0}
        className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExporting ? (
          <>
            <Icon name="Loader2" size={16} className="animate-spin" />
            <span className="text-sm font-body font-medium">Exporting...</span>
          </>
        ) : (
          <>
            <Icon name="Download" size={16} />
            <span className="text-sm font-body font-medium">Export</span>
            <Icon name="ChevronDown" size={14} />
          </>
        )}
      </button>

      {/* Export Menu Dropdown */}
      {isExportMenuOpen && !isExporting && (
        <div className="absolute right-0 mt-2 w-64 bg-surface border border-border rounded-lg shadow-medium z-50 animate-fade-in">
          <div className="p-2">
            <div className="px-3 py-2 border-b border-border">
              <h4 className="text-sm font-heading font-medium text-text-primary">
                Export Options
              </h4>
              <p className="text-xs text-text-secondary mt-1">
                {stocks.length} stocks will be exported
              </p>
            </div>
            
            <div className="py-2 space-y-1">
              {exportFormats.map((format) => (
                <button
                  key={format.id}
                  onClick={() => handleExport(format.id)}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-background rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <div className="p-1 bg-background rounded">
                    <Icon name={format.icon} size={16} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-body font-medium text-text-primary">
                      {format.label}
                    </div>
                    <div className="text-xs text-text-secondary">
                      {format.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="px-3 py-2 border-t border-border">
              <p className="text-xs text-text-secondary">
                Files will be downloaded to your default download folder
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isExportMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsExportMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default ExportPanel;
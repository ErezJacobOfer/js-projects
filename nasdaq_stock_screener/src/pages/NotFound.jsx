import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="AlertTriangle" size={48} className="text-primary" />
          </div>
          <h1 className="text-6xl font-heading font-bold text-text-primary mb-4">404</h1>
          <h2 className="text-2xl font-heading font-semibold text-text-primary mb-4">
            Page Not Found
          </h2>
          <p className="text-text-secondary mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/stock-screening-dashboard"
            className="inline-flex items-center space-x-2 btn-primary px-6 py-3 rounded-lg font-body-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <Icon name="Home" size={20} />
            <span>Go to Dashboard</span>
          </Link>
          
          <div className="text-sm text-text-secondary">
            <button
              onClick={() => window.history.back()}
              className="text-primary hover:text-primary/80 transition-colors duration-150"
            >
              ← Go back to previous page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
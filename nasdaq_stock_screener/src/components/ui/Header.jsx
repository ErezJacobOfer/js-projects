import React, { useState } from 'react';
import Icon from '../AppIcon';

const Header = ({ onMenuToggle }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Search query:', searchQuery);
    }
  };

  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    setIsUserMenuOpen(false);
  };

  const handleProfile = () => {
    console.log('Profile clicked');
    setIsUserMenuOpen(false);
  };

  const handleSettings = () => {
    console.log('Settings clicked');
    setIsUserMenuOpen(false);
  };

  return (
    <header className="nav-header">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Section - Logo and Mobile Menu */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-md hover:bg-background transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Toggle navigation menu"
          >
            <Icon name="Menu" size={20} />
          </button>

          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={20} color="white" />
            </div>
            <span className="text-xl font-heading-semibold text-text-primary hidden sm:block">
              StockScreener
            </span>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative">
              <Icon
                name="Search"
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Search stocks, symbols..."
                className={`w-full pl-10 pr-4 py-2 border rounded-lg bg-background text-text-primary placeholder-text-secondary transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                  isSearchFocused ? 'border-primary' : 'border-border'
                }`}
              />
            </div>
          </form>
        </div>

        {/* Right Section - User Menu */}
        <div className="flex items-center space-x-4">
          {/* Mobile Search Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-background transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Search"
          >
            <Icon name="Search" size={20} />
          </button>

          {/* Notifications */}
          <button
            className="p-2 rounded-md hover:bg-background transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/20 relative"
            aria-label="Notifications"
          >
            <Icon name="Bell" size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={handleUserMenuToggle}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-background transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-label="User menu"
            >
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <Icon name="ChevronDown" size={16} className="text-text-secondary" />
            </button>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-medium z-[1001] animate-fade-in">
                <div className="py-2">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-body-medium text-text-primary">John Investor</p>
                    <p className="text-xs text-text-secondary">john@example.com</p>
                  </div>
                  
                  <button
                    onClick={handleProfile}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-text-primary hover:bg-background transition-colors duration-150"
                  >
                    <Icon name="User" size={16} />
                    <span>Profile</span>
                  </button>
                  
                  <button
                    onClick={handleSettings}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-text-primary hover:bg-background transition-colors duration-150"
                  >
                    <Icon name="Settings" size={16} />
                    <span>Settings</span>
                  </button>
                  
                  <div className="border-t border-border mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-error hover:bg-background transition-colors duration-150"
                    >
                      <Icon name="LogOut" size={16} />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <div className="md:hidden border-t border-border bg-surface px-6 py-3">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Icon
            name="Search"
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stocks, symbols..."
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </form>
      </div>
    </header>
  );
};

export default Header;
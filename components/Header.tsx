import React from 'react';
import { Page } from '../types';

interface HeaderProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ activePage, setActivePage }) => {
  const navItems: { id: Page; label: string }[] = [
    { id: 'builder', label: 'Resume Builder' },
    { id: 'checker', label: 'ATS Checker' },
  ];

  const baseTabClass = "px-3 sm:px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75";
  const activeTabClass = "bg-white/20 text-white shadow";
  const inactiveTabClass = "text-indigo-100 hover:bg-white/10 hover:text-white";

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <h1 className="text-2xl font-bold">ATS Resume Toolkit</h1>
            <p className="text-sm text-indigo-200">AI-Powered Resume Assistant</p>
          </div>
          <nav className="bg-white/10 p-1 rounded-lg flex space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`${baseTabClass} ${activePage === item.id ? activeTabClass : inactiveTabClass}`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

import React, { useState } from 'react';
import Header from './components/Header';
import ResumeBuilder from './components/ResumeBuilder';
import AtsChecker from './components/AtsChecker';
import { Page } from './types';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('builder');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <Header activePage={activePage} setActivePage={setActivePage} />
      <main className="p-4 sm:p-6 md:p-8">
        {activePage === 'builder' && <ResumeBuilder />}
        {activePage === 'checker' && <AtsChecker />}
      </main>
      <footer className="text-center p-4 text-xs text-gray-500">
        <p>&copy; 2024 ATS Resume Toolkit. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;

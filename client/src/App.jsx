import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import GreedyView from './components/greedy/GreedyView';
import FlowShopView from './components/flowshop/FlowShopView';
import { checkServerHealth } from './api/schedulerApi';
import { Factory } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('greedy');
  const [serverOnline, setServerOnline] = useState(false);

  const verifyHealth = async () => {
    const health = await checkServerHealth();
    setServerOnline(!!health);
  };

  useEffect(() => {
    verifyHealth();
    const timer = setInterval(verifyHealth, 15000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-stone-900 factory-grid">
      {/* Top Application Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        serverOnline={serverOnline}
        onRefreshHealth={verifyHealth}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'greedy' && <GreedyView />}
        {activeTab === 'flowshop' && <FlowShopView />}
      </main>

      {/* Clean Industrial Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center space-x-2">
            <Factory className="w-4 h-4 text-amber-600" />
            <span className="font-semibold text-stone-700">FactoryFlow Engine</span>
            <span>&bull;</span>
            <span>Automated Production Job Sequencing &amp; Flow Shop Scheduler</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Express API :5000</span>
            </span>
            <span>&bull;</span>
            <span className="font-mono">React (Vite)</span>
            <span>&bull;</span>
            <span className="font-mono">Tailwind CSS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

import React from 'react';
import { Factory, Cpu, GitMerge, AlertCircle, RefreshCw } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, serverOnline, onRefreshHealth }) {
  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and App Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Factory className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-stone-900">
                  FactoryFlow
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                  Production Job Optimizer
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                Production Job Sequencing &amp; Assembly Line Flow Shop Scheduling
              </p>
            </div>
          </div>

          {/* Navigation Tabs - Only the two core scheduling modules */}
          <nav className="hidden sm:flex items-center space-x-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              onClick={() => setActiveTab('greedy')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'greedy'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <Cpu className="w-4 h-4 text-emerald-600" />
              <span>Urgent Orders (Greedy)</span>
            </button>

            <button
              onClick={() => setActiveTab('flowshop')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'flowshop'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <GitMerge className="w-4 h-4 text-amber-600" />
              <span>Assembly Line (Flow Shop)</span>
            </button>
          </nav>

          {/* Server Connection Status */}
          <div className="flex items-center space-x-3">
            <div 
              title={serverOnline ? "Backend connected on port 5000" : "Server offline. Ensure Node server is running on port 5000"}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                serverOnline
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              {serverOnline ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>API :5000 Active</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                  <span>API Offline</span>
                </>
              )}
            </div>

            <button
              onClick={onRefreshHealth}
              title="Refresh connection"
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-md transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation tab bar */}
      <div className="sm:hidden flex border-t border-stone-200 bg-stone-50 px-2 py-1.5 overflow-x-auto space-x-1">
        <button
          onClick={() => setActiveTab('greedy')}
          className={`flex-1 flex items-center justify-center space-x-1 py-1.5 text-xs font-medium rounded-md ${
            activeTab === 'greedy' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
          }`}
        >
          <Cpu className="w-3.5 h-3.5 text-emerald-600" />
          <span>Urgent Orders (Greedy)</span>
        </button>
        <button
          onClick={() => setActiveTab('flowshop')}
          className={`flex-1 flex items-center justify-center space-x-1 py-1.5 text-xs font-medium rounded-md ${
            activeTab === 'flowshop' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
          }`}
        >
          <GitMerge className="w-3.5 h-3.5 text-amber-600" />
          <span>Assembly Line (Flow Shop)</span>
        </button>
      </div>
    </header>
  );
}

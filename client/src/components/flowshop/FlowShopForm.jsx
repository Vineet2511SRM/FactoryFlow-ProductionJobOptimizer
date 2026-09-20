import React, { useState } from 'react';
import { PlusCircle, Database, Trash2, AlertCircle } from 'lucide-react';
import { FLOWSHOP_DATASETS } from '../../data/sampleData';

export default function FlowShopForm({ onAddJob, onLoadDataset, onClearJobs, jobCount }) {
  const [name, setName] = useState('');
  const [timeM1, setTimeM1] = useState('');
  const [timeM2, setTimeM2] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Job name cannot be empty.');
      return;
    }

    const m1 = parseInt(timeM1, 10);
    const m2 = parseInt(timeM2, 10);

    if (isNaN(m1) || m1 <= 0) {
      setError('Machine A processing time must be a positive integer.');
      return;
    }

    if (isNaN(m2) || m2 <= 0) {
      setError('Machine B processing time must be a positive integer.');
      return;
    }

    onAddJob({
      name: name.trim(),
      timeM1: m1,
      timeM2: m2
    });

    setName('');
    setTimeM1('');
    setTimeM2('');
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <h3 className="font-semibold text-stone-900 text-sm flex items-center space-x-2">
          <span>Add 2-Stage Assembly Job</span>
        </h3>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
          {jobCount} In Queue
        </span>
      </div>

      {error && (
        <div className="mt-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <div>
          <label className="block text-xs font-medium text-stone-700 mb-1">
            Job / Assembly Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., CNC Stamping & Paint"
            className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Time on Machine A (hrs)
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={timeM1}
              onChange={(e) => setTimeM1(e.target.value)}
              placeholder="e.g., 3"
              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            />
            <span className="text-[10px] text-stone-400 mt-0.5 block">
              Stage 1: Fabrication
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Time on Machine B (hrs)
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={timeM2}
              onChange={(e) => setTimeM2(e.target.value)}
              placeholder="e.g., 6"
              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
            />
            <span className="text-[10px] text-stone-400 mt-0.5 block">
              Stage 2: Assembly
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-stone-900 text-white hover:bg-stone-800 text-sm font-medium transition cursor-pointer shadow-xs"
        >
          <PlusCircle className="w-4 h-4 text-amber-400" />
          <span>Add to Assembly Pipeline</span>
        </button>
      </form>

      {/* Preset Academic Flow Shop Benchmarks */}
      <div className="mt-5 pt-4 border-t border-stone-100">
        <label className="block text-xs font-semibold text-stone-600 mb-2 uppercase tracking-wider flex items-center space-x-1.5">
          <Database className="w-3.5 h-3.5 text-stone-400" />
          <span>Load Assembly Line Scenarios</span>
        </label>
        <div className="space-y-1.5">
          {FLOWSHOP_DATASETS.map((ds, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onLoadDataset(ds.jobs)}
              className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-stone-100 border border-stone-200/80 text-xs text-stone-700 transition flex items-center justify-between group cursor-pointer"
            >
              <div className="truncate pr-2">
                <span className="font-medium text-stone-900 group-hover:text-amber-700">
                  {ds.name}
                </span>
                <span className="block text-[11px] text-stone-500 truncate">
                  {ds.description}
                </span>
              </div>
              <span className="text-[10px] shrink-0 font-mono bg-stone-100 group-hover:bg-amber-100 text-stone-600 group-hover:text-amber-800 px-1.5 py-0.5 rounded">
                {ds.jobs.length} jobs
              </span>
            </button>
          ))}
        </div>

        {jobCount > 0 && (
          <button
            type="button"
            onClick={onClearJobs}
            className="mt-3 w-full flex items-center justify-center space-x-1.5 px-3 py-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Queue</span>
          </button>
        )}
      </div>
    </div>
  );
}

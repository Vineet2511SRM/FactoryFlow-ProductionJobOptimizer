import React from 'react';
import { X, Layers, Clock, DollarSign } from 'lucide-react';

export default function JobQueueTable({ jobs, onRemoveJob }) {
  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-stone-200 p-8 text-center shadow-xs">
        <Layers className="w-10 h-10 text-stone-300 mx-auto mb-2" />
        <p className="text-sm font-medium text-stone-600">
          No Urgent Orders in Queue
        </p>
        <p className="text-xs text-stone-400 mt-1">
          Add jobs using the form above or load an academic benchmark dataset.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
      <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-stone-500" />
          <h4 className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
            Job Candidate Pool ({jobs.length})
          </h4>
        </div>
        <span className="text-[11px] text-stone-400 font-mono">
          Each unit duration = 1 Day
        </span>
      </div>

      <div className="overflow-x-auto max-h-[320px] overflow-y-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 sticky top-0">
            <tr>
              <th className="px-3.5 py-2 font-semibold">ID</th>
              <th className="px-3.5 py-2 font-semibold">Order / Job Name</th>
              <th className="px-3.5 py-2 font-semibold text-right">Profit ($)</th>
              <th className="px-3.5 py-2 font-semibold text-right">Deadline</th>
              <th className="px-3.5 py-2 font-semibold text-center w-12">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {jobs.map((job, idx) => (
              <tr key={job.id || idx} className="hover:bg-stone-50/80 transition-colors">
                <td className="px-3.5 py-2 font-mono font-medium text-stone-900">
                  <span className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                    {job.id || `J${idx + 1}`}
                  </span>
                </td>
                <td className="px-3.5 py-2 font-medium text-stone-800">
                  {job.name}
                </td>
                <td className="px-3.5 py-2 text-right font-mono font-semibold text-emerald-700">
                  ${job.profit}
                </td>
                <td className="px-3.5 py-2 text-right font-mono text-stone-700">
                  <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200/80">
                    <Clock className="w-3 h-3 text-amber-600" />
                    <span>Day {job.deadline}</span>
                  </span>
                </td>
                <td className="px-3.5 py-2 text-center">
                  <button
                    type="button"
                    onClick={() => onRemoveJob(idx)}
                    title="Remove job"
                    className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

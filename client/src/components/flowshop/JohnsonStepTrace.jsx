import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Code2, ArrowDownRight, ArrowUpLeft, Info } from 'lucide-react';

export default function JohnsonStepTrace({ stepTrace = [], complexity }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!stepTrace || stepTrace.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-left hover:bg-stone-100/70 transition cursor-pointer"
      >
        <div className="flex items-center space-x-2">
          <Code2 className="w-4 h-4 text-amber-600" />
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            Execution Trace: Johnson's Rule Partition Logic
          </h4>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
            {stepTrace.length} Steps
          </span>
        </div>
        <div className="flex items-center space-x-3 text-stone-500 text-xs">
          {complexity && (
            <span className="font-mono text-[11px] text-stone-500 hidden sm:inline">
              Time: {complexity.time} | Space: {complexity.space}
            </span>
          )}
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-4">
          <div className="mb-3 text-xs text-stone-600 bg-amber-50/50 p-2.5 rounded-lg border border-amber-200 flex items-start space-x-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Johnson's Theorem:</strong> Find the minimum processing time min(A_i, B_i) over unscheduled jobs. If the minimum is on Machine 1, schedule that job as early as possible (at the front). If the minimum is on Machine 2, schedule that job as late as possible (at the rear).
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 border-b border-stone-200">
                <tr>
                  <th className="px-3 py-2 font-semibold text-center w-12">Step</th>
                  <th className="px-3 py-2 font-semibold">Selected Job</th>
                  <th className="px-3 py-2 font-semibold text-right">Min Time</th>
                  <th className="px-3 py-2 font-semibold text-center">Occurs On</th>
                  <th className="px-3 py-2 font-semibold text-center">Placement Decision</th>
                  <th className="px-3 py-2 font-semibold">Algorithmic Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {stepTrace.map((step) => {
                  const isFront = step.placedAt.startsWith('Front');
                  return (
                    <tr key={step.step} className="hover:bg-stone-50/60 transition-colors">
                      <td className="px-3 py-2.5 text-center font-mono text-stone-400 font-medium">
                        #{step.step}
                      </td>
                      <td className="px-3 py-2.5 font-medium text-stone-900">
                        <span className="font-mono px-1.5 py-0.5 rounded bg-stone-100 border border-stone-200 mr-1.5">
                          {step.jobId}
                        </span>
                        <span>{step.name}</span>
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono font-bold text-amber-700">
                        {step.minTime} hrs
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <span className={`px-2 py-0.5 rounded font-mono font-semibold text-[11px] ${
                          step.machine.includes('Machine 1')
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'bg-violet-50 text-violet-700 border border-violet-200'
                        }`}>
                          {step.machine}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          isFront
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {isFront ? (
                            <ArrowDownRight className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <ArrowUpLeft className="w-3 h-3 text-purple-600" />
                          )}
                          <span>{step.placedAt}</span>
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-stone-600">
                        {step.rationale}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

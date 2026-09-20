import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Code2, Check, X, Info } from 'lucide-react';

export default function GreedyStepTrace({ stepTrace = [], complexity }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!stepTrace || stepTrace.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-left hover:bg-stone-100/70 transition cursor-pointer"
      >
        <div className="flex items-center space-x-2">
          <Code2 className="w-4 h-4 text-emerald-600" />
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            Execution Trace: Step-by-Step Greedy Decisions
          </h4>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
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
          <div className="mb-3 text-xs text-stone-600 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100 flex items-start space-x-2">
            <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>Greedy Rule:</strong> Jobs are inspected in descending order of profit. For each job, we search backwards from min(deadline, maxDeadline) down to slot 1 to occupy the latest available slot.
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 border-b border-stone-200">
                <tr>
                  <th className="px-3 py-2 font-semibold text-center w-12">Step</th>
                  <th className="px-3 py-2 font-semibold">Job Inspected</th>
                  <th className="px-3 py-2 font-semibold text-right">Profit</th>
                  <th className="px-3 py-2 font-semibold text-right">Deadline</th>
                  <th className="px-3 py-2 font-semibold text-center">Decision</th>
                  <th className="px-3 py-2 font-semibold text-center">Assigned Slot</th>
                  <th className="px-3 py-2 font-semibold">Algorithmic Rationale</th>
                  <th className="px-3 py-2 font-semibold text-right">Cumulative Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {stepTrace.map((step) => {
                  const isAccepted = step.action === 'ACCEPTED';
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
                      <td className="px-3 py-2.5 text-right font-mono font-semibold text-emerald-700">
                        ${step.profit}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono text-stone-600">
                        Day {step.deadline}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        {isAccepted ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                            <Check className="w-3 h-3" />
                            <span>Accepted</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800">
                            <X className="w-3 h-3" />
                            <span>Rejected</span>
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-center font-mono">
                        {step.assignedSlot ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                            Slot {step.assignedSlot}
                          </span>
                        ) : (
                          <span className="text-stone-400 italic">None</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-stone-600 max-w-xs">
                        {step.rationale}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono font-bold text-stone-900">
                        ${step.currentTotalProfit}
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

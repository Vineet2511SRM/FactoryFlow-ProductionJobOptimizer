import React, { useState } from 'react';
import { ArrowRight, Clock, AlertTriangle, CheckCircle, PauseCircle, Layers } from 'lucide-react';

export default function DualTimelineChart({ flowShopResult }) {
  const [hoveredBlock, setHoveredBlock] = useState(null);

  if (!flowShopResult) return null;

  const {
    optimalSequence = [],
    machine1Timeline = [],
    machine2Timeline = [],
    totalMakespan = 0,
    totalIdleTimeM2 = 0,
    m1FinishTime = 0,
    m1IdleAtEnd = 0,
    totalM1WorkTime = 0,
    totalM2WorkTime = 0,
    efficiencyPercent = 0
  } = flowShopResult;

  // Harmonious, high-contrast industrial palette for jobs
  const jobColorPalette = [
    { 
      bg: 'bg-blue-50 hover:bg-blue-100', 
      border: 'border-blue-300', 
      text: 'text-blue-900', 
      subtext: 'text-blue-700',
      badge: 'bg-blue-600 text-white' 
    },
    { 
      bg: 'bg-emerald-50 hover:bg-emerald-100', 
      border: 'border-emerald-300', 
      text: 'text-emerald-900', 
      subtext: 'text-emerald-700',
      badge: 'bg-emerald-600 text-white' 
    },
    { 
      bg: 'bg-purple-50 hover:bg-purple-100', 
      border: 'border-purple-300', 
      text: 'text-purple-900', 
      subtext: 'text-purple-700',
      badge: 'bg-purple-600 text-white' 
    },
    { 
      bg: 'bg-amber-50 hover:bg-amber-100', 
      border: 'border-amber-300', 
      text: 'text-amber-900', 
      subtext: 'text-amber-700',
      badge: 'bg-amber-600 text-white' 
    },
    { 
      bg: 'bg-teal-50 hover:bg-teal-100', 
      border: 'border-teal-300', 
      text: 'text-teal-900', 
      subtext: 'text-teal-700',
      badge: 'bg-teal-600 text-white' 
    },
    { 
      bg: 'bg-orange-50 hover:bg-orange-100', 
      border: 'border-orange-300', 
      text: 'text-orange-900', 
      subtext: 'text-orange-700',
      badge: 'bg-orange-600 text-white' 
    },
    { 
      bg: 'bg-indigo-50 hover:bg-indigo-100', 
      border: 'border-indigo-300', 
      text: 'text-indigo-900', 
      subtext: 'text-indigo-700',
      badge: 'bg-indigo-600 text-white' 
    },
    { 
      bg: 'bg-rose-50 hover:bg-rose-100', 
      border: 'border-rose-300', 
      text: 'text-rose-900', 
      subtext: 'text-rose-700',
      badge: 'bg-rose-600 text-white' 
    },
  ];

  const getJobColor = (jobId) => {
    const idx = optimalSequence.findIndex(j => j.id === jobId);
    if (idx === -1) return jobColorPalette[0];
    return jobColorPalette[idx % jobColorPalette.length];
  };

  // Generate graduated ticks for the shared X-axis
  const tickStep = totalMakespan <= 15 ? 1 : totalMakespan <= 30 ? 2 : totalMakespan <= 60 ? 5 : 10;
  const ticks = [];
  for (let t = 0; t <= totalMakespan; t += tickStep) {
    ticks.push(t);
  }
  if (ticks[ticks.length - 1] !== totalMakespan) {
    ticks.push(totalMakespan);
  }

  return (
    <div className="space-y-6">
      {/* Optimal Sequence Banner */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div>
            <h3 className="text-sm font-bold text-stone-900 flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Optimal Johnson's Production Sequence</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Jobs enter Machine 1 in this exact order and advance directly to Machine 2 upon completion.
            </p>
          </div>

          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 border border-stone-200 self-start sm:self-auto">
            {optimalSequence.length} Operations Sequenced
          </span>
        </div>

        {/* Sequence Flow Pills */}
        <div className="mt-3.5 flex items-center flex-wrap gap-2">
          {optimalSequence.map((job, idx) => {
            const colors = getJobColor(job.id);
            return (
              <div key={job.id} className="flex items-center">
                <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border ${colors.border} ${colors.bg} shadow-2xs`}>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${colors.badge}`}>
                    #{idx + 1}
                  </span>
                  <div className="leading-tight">
                    <span className={`text-xs font-bold ${colors.text}`}>
                      {job.id}
                    </span>
                    <span className="text-[11px] text-stone-600 ml-1.5 hidden sm:inline font-medium">
                      {job.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-stone-500 pl-1">
                    (M1: {job.timeM1}h | M2: {job.timeM2}h)
                  </span>
                </div>

                {idx < optimalSequence.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-stone-400 mx-1 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dual Synchronized Timeline Gantt */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-2">
          <div>
            <h3 className="text-sm font-bold text-stone-900 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Dual-Machine Synchronized Timeline</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Stage 1 (Fabrication) &rarr; Stage 2 (Assembly). Shared proportional X-axis (Total Makespan: {totalMakespan} hrs).
            </p>
          </div>

          {/* Clean Legend */}
          <div className="flex items-center space-x-3 text-xs flex-wrap gap-y-1">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-xs bg-indigo-500"></span>
              <span className="text-stone-600 font-medium">Machine A</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-xs bg-violet-500"></span>
              <span className="text-stone-600 font-medium">Machine B</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-xs idle-striped-pattern border border-rose-300"></span>
              <span className="text-rose-700 font-semibold">Idle Bottleneck Gap</span>
            </div>
          </div>
        </div>

        {/* Live Hover Inspector Bar */}
        <div className="my-3 min-h-[32px] flex items-center">
          {hoveredBlock ? (
            <div className={`text-xs px-3.5 py-1.5 rounded-lg border flex items-center space-x-2 w-full transition ${
              hoveredBlock.isIdle 
                ? 'bg-rose-50 border-rose-200 text-rose-800' 
                : 'bg-stone-50 border-stone-200 text-stone-800'
            }`}>
              <span className="font-bold">{hoveredBlock.machine}:</span>
              <span className="font-semibold">{hoveredBlock.name}</span>
              <span className="font-mono text-stone-500">
                [T: {hoveredBlock.startTime}h &rarr; {hoveredBlock.endTime}h]
              </span>
              <span className="font-mono font-bold">
                Duration: {hoveredBlock.duration} hr{hoveredBlock.duration > 1 ? 's' : ''}
              </span>
              {hoveredBlock.isIdle && (
                <span className="ml-auto font-semibold text-rose-700 flex items-center space-x-1 bg-rose-100 px-2 py-0.5 rounded text-[11px]">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Awaiting Machine A output</span>
                </span>
              )}
            </div>
          ) : (
            <div className="text-xs text-stone-400 italic flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Hover over any timeline segment to inspect exact start, finish, and idle bottleneck durations.</span>
            </div>
          )}
        </div>

        {/* Timeline Visualization with Safe Container Padding */}
        <div className="overflow-x-auto pb-3">
          <div className="min-w-[760px] px-3 space-y-4">
            {/* --- MACHINE 1 TIMELINE --- */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600"></span>
                  <span className="text-xs font-bold text-indigo-900 tracking-wide uppercase">
                    Machine A (Stage 1: Fabrication / Milling)
                  </span>
                </div>
                <span className="text-[11px] font-mono text-stone-500">
                  Active: {totalM1WorkTime} hrs &bull; Finishes at T = {m1FinishTime} hrs
                </span>
              </div>

              {/* M1 Bar */}
              <div className="w-full h-16 bg-stone-100 rounded-lg border border-stone-200 flex overflow-hidden shadow-2xs">
                {machine1Timeline.map((block) => {
                  const widthPercent = (block.duration / totalMakespan) * 100;
                  const isNarrow = widthPercent < 6;
                  const colors = getJobColor(block.jobId);
                  return (
                    <div
                      key={block.sequenceOrder}
                      style={{ width: `${widthPercent}%` }}
                      onMouseEnter={() => setHoveredBlock({ ...block, machine: 'Machine A (Stage 1)' })}
                      onMouseLeave={() => setHoveredBlock(null)}
                      className={`h-full border-r border-stone-300 ${colors.bg} p-1.5 flex flex-col justify-between overflow-hidden transition cursor-pointer select-none`}
                    >
                      <div className="flex items-center justify-between overflow-hidden">
                        <span className={`text-[10px] font-mono font-bold px-1 rounded shrink-0 ${colors.badge}`}>
                          {block.jobId}
                        </span>
                        {!isNarrow && (
                          <span className="text-[10px] font-mono font-semibold text-stone-600 truncate ml-1">
                            {block.duration}h
                          </span>
                        )}
                      </div>
                      
                      {!isNarrow ? (
                        <span className="text-[10px] font-semibold text-stone-800 truncate leading-tight">
                          {block.name}
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono text-stone-500 text-center truncate">
                          {block.duration}h
                        </span>
                      )}
                    </div>
                  );
                })}

                {/* If M1 finishes before total makespan */}
                {m1IdleAtEnd > 0 && (
                  <div
                    style={{ width: `${(m1IdleAtEnd / totalMakespan) * 100}%` }}
                    onMouseEnter={() => setHoveredBlock({
                      name: 'M1 Work Completed (Waiting for Line Discharge)',
                      startTime: m1FinishTime,
                      endTime: totalMakespan,
                      duration: m1IdleAtEnd,
                      isIdle: false,
                      machine: 'Machine A'
                    })}
                    onMouseLeave={() => setHoveredBlock(null)}
                    className="h-full bg-stone-50/80 border-dashed border-stone-200 p-1 flex items-center justify-center text-stone-400 text-[10px] font-mono overflow-hidden cursor-default"
                  >
                    <span className="truncate">Done ({m1IdleAtEnd}h)</span>
                  </div>
                )}
              </div>
            </div>

            {/* --- MACHINE 2 TIMELINE (WITH CLEAN HIGHLIGHTED IDLE GAPS) --- */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-xs bg-violet-600"></span>
                  <span className="text-xs font-bold text-violet-900 tracking-wide uppercase">
                    Machine B (Stage 2: Assembly / Finishing)
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-[11px] font-mono">
                  <span className="text-stone-500">Active: {totalM2WorkTime} hrs</span>
                  <span className="text-rose-700 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                    Total Idle: {totalIdleTimeM2} hrs
                  </span>
                </div>
              </div>

              {/* M2 Bar */}
              <div className="w-full h-16 bg-stone-100 rounded-lg border border-stone-200 flex overflow-hidden shadow-2xs">
                {machine2Timeline.map((block, idx) => {
                  const widthPercent = (block.duration / totalMakespan) * 100;
                  const isNarrow = widthPercent < 7;
                  const isUltraNarrow = widthPercent < 4;

                  if (block.isIdle) {
                    return (
                      <div
                        key={`idle-${idx}`}
                        style={{ width: `${widthPercent}%` }}
                        onMouseEnter={() => setHoveredBlock({ ...block, machine: 'Machine B (Stage 2)' })}
                        onMouseLeave={() => setHoveredBlock(null)}
                        className="h-full idle-striped-pattern border-y border-dashed border-r border-rose-300 p-1 flex flex-col items-center justify-center text-center overflow-hidden transition hover:brightness-95 cursor-pointer select-none"
                      >
                        {isUltraNarrow ? (
                          <div className="text-[10px] font-bold text-rose-700 font-mono">
                            {block.duration}h
                          </div>
                        ) : isNarrow ? (
                          <div className="flex items-center justify-center space-x-0.5 text-rose-700 font-bold text-[10px] leading-tight">
                            <span className="font-mono">{block.duration}h</span>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center space-x-1 text-rose-700 font-bold text-[10px] leading-tight">
                              <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                              <span className="truncate">IDLE {block.duration}h</span>
                            </div>
                            <span className="text-[8px] text-rose-600 font-medium truncate mt-0.5">
                              Waiting M1
                            </span>
                          </>
                        )}
                      </div>
                    );
                  }

                  const colors = getJobColor(block.jobId);
                  return (
                    <div
                      key={`job-${block.sequenceOrder}-${idx}`}
                      style={{ width: `${widthPercent}%` }}
                      onMouseEnter={() => setHoveredBlock({ ...block, machine: 'Machine B (Stage 2)' })}
                      onMouseLeave={() => setHoveredBlock(null)}
                      className={`h-full border-r border-stone-300 ${colors.bg} p-1.5 flex flex-col justify-between overflow-hidden transition cursor-pointer select-none`}
                    >
                      <div className="flex items-center justify-between overflow-hidden">
                        <span className={`text-[10px] font-mono font-bold px-1 rounded shrink-0 ${colors.badge}`}>
                          {block.jobId}
                        </span>
                        {!isNarrow && (
                          <span className="text-[10px] font-mono font-semibold text-stone-600 truncate ml-1">
                            {block.duration}h
                          </span>
                        )}
                      </div>
                      
                      {!isNarrow ? (
                        <span className="text-[10px] font-semibold text-stone-800 truncate leading-tight">
                          {block.name}
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono text-stone-500 text-center truncate">
                          {block.duration}h
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shared X-Axis Time Ruler - Fixed alignment without clipping */}
            <div className="pt-2">
              <div className="relative w-full h-7 border-t border-stone-300">
                {ticks.map((t, i) => {
                  const leftPercent = (t / totalMakespan) * 100;
                  const isFirst = i === 0;
                  const isLast = i === ticks.length - 1;

                  return (
                    <div
                      key={t}
                      style={{ left: `${leftPercent}%` }}
                      className={`absolute top-0 flex flex-col ${
                        isFirst 
                          ? 'items-start translate-x-0' 
                          : isLast 
                            ? 'items-end -translate-x-full' 
                            : 'items-center -translate-x-1/2'
                      }`}
                    >
                      <div className="w-px h-2 bg-stone-400"></div>
                      <span className="text-[10px] font-mono font-medium text-stone-600 mt-0.5">
                        {t}h
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="text-center text-[10px] font-mono text-stone-400 mt-0.5">
                Continuous Time Scale (Hours) &bull; Makespan: 0 to {totalMakespan} hrs
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Insights Footer */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between text-xs text-stone-600 gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-stone-900">Total Makespan:</span>
            <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {totalMakespan} Hours
            </span>
            <span className="text-stone-300">|</span>
            <span className="font-semibold text-stone-900">Machine B Idle Waiting:</span>
            <span className="font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              {totalIdleTimeM2} Hours ({totalMakespan > 0 ? Math.round((totalIdleTimeM2 / totalMakespan) * 100) : 0}%)
            </span>
          </div>

          <div className="font-mono text-stone-500">
            Assembly Line Efficiency: <strong className="text-emerald-700">{efficiencyPercent}%</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

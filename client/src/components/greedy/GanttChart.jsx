import React from 'react';
import { Calendar, AlertTriangle, CheckCircle, Ban, ArrowRight, DollarSign } from 'lucide-react';

export default function GanttChart({ scheduleResult }) {
  if (!scheduleResult) return null;

  const {
    schedule = [],
    acceptedCount = 0,
    rejectedCount = 0,
    idleSlotCount = 0,
    totalProfit = 0,
    rejectedJobs = [],
    totalSlots = 0
  } = scheduleResult;

  return (
    <div className="space-y-6">
      {/* Visual Gantt Chart Block Row */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-2">
          <div>
            <h3 className="text-sm font-bold text-stone-900 flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>Production Schedule Gantt (Days 1 to {totalSlots})</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Single-machine timeline with 1-day discrete allocation slots (T: t-1 to t).
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-xs bg-emerald-500"></span>
              <span className="text-stone-600 font-medium">Scheduled Order</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-xs idle-amber-pattern border border-amber-300"></span>
              <span className="text-stone-600 font-medium">Idle Slot</span>
            </div>
          </div>
        </div>

        {/* Horizontal Timeline Container */}
        <div className="mt-5 overflow-x-auto pb-3">
          <div className="min-w-[640px]">
            {/* Day Header Ruler */}
            <div className="grid gap-2 mb-2" style={{ gridTemplateColumns: `repeat(${schedule.length}, minmax(110px, 1fr))` }}>
              {schedule.map((slot) => (
                <div key={slot.slotNumber} className="text-center">
                  <span className="text-[11px] font-mono font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-sm">
                    Day {slot.slotNumber}
                  </span>
                  <div className="text-[9px] text-stone-400 font-mono mt-0.5">
                    T: {slot.slotNumber - 1} - {slot.slotNumber}
                  </div>
                </div>
              ))}
            </div>

            {/* Gantt Schedule Slots */}
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${schedule.length}, minmax(110px, 1fr))` }}>
              {schedule.map((slot) => {
                if (slot.isIdle) {
                  return (
                    <div
                      key={slot.slotNumber}
                      className="h-28 rounded-lg border-2 border-dashed border-amber-300 idle-amber-pattern p-2.5 flex flex-col justify-between items-center text-center transition hover:border-amber-400"
                    >
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-amber-200/80 text-amber-900 border border-amber-300">
                        IDLE / NO ORDER
                      </span>
                      <div className="text-stone-400 my-auto">
                        <AlertTriangle className="w-5 h-5 text-amber-500/70 mx-auto" />
                      </div>
                      <span className="text-[10px] text-stone-500 font-mono">
                        Machine Dormant
                      </span>
                    </div>
                  );
                }

                const job = slot.job;
                return (
                  <div
                    key={slot.slotNumber}
                    className="h-28 rounded-lg border border-emerald-300 bg-gradient-to-b from-emerald-50/70 to-white p-2.5 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-emerald-500 transition group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-emerald-600 text-white shadow-2xs">
                        {job.id}
                      </span>
                      <span className="text-[10px] font-mono font-semibold text-stone-500">
                        dl: Day {job.deadline}
                      </span>
                    </div>

                    <div className="my-auto py-1">
                      <p className="text-xs font-semibold text-stone-900 line-clamp-2 leading-tight group-hover:text-emerald-800 transition">
                        {job.name}
                      </p>
                    </div>

                    <div className="pt-1 border-t border-emerald-100 flex items-center justify-between">
                      <span className="text-[10px] text-stone-500">Yield</span>
                      <span className="text-xs font-mono font-bold text-emerald-700 flex items-center">
                        +${job.profit}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Schedule Insights Footer */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between text-xs text-stone-600 gap-2">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>
              <strong>{acceptedCount}</strong> of <strong>{acceptedCount + rejectedCount}</strong> candidate orders scheduled within deadline constraints.
            </span>
          </div>
          <span className="font-mono text-stone-500">
            Total Machine Slots: {totalSlots} Days ({idleSlotCount} Idle)
          </span>
        </div>
      </div>

      {/* Rejected / Dropped Jobs Panel (Vital for DAA examination) */}
      {rejectedJobs.length > 0 && (
        <div className="bg-white rounded-xl border border-rose-200 p-4 shadow-xs">
          <div className="flex items-center space-x-2 mb-3">
            <Ban className="w-4 h-4 text-rose-500" />
            <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider">
              Unscheduled / Dropped Orders ({rejectedJobs.length})
            </h4>
          </div>
          <p className="text-xs text-stone-500 mb-3">
            The greedy strategy dropped these orders because all eligible time slots prior to their deadlines were claimed by higher-profit jobs.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {rejectedJobs.map((rj, idx) => (
              <div
                key={rj.id || idx}
                className="p-2.5 rounded-lg border border-stone-200 bg-stone-50 flex items-center justify-between"
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono text-xs font-medium text-stone-500">
                      {rj.id}
                    </span>
                    <span className="text-xs font-medium text-stone-800 truncate">
                      {rj.name}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    Deadline: Day {rj.deadline} • Missed Profit: ${rj.profit}
                  </div>
                </div>
                <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-100 text-rose-700">
                  Dropped
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

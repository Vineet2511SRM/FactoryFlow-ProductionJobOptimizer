import React, { useState, useEffect } from 'react';
import { Play, DollarSign, CheckCircle2, Ban, Gauge, AlertCircle, RefreshCw } from 'lucide-react';
import JobForm from './JobForm';
import JobQueueTable from './JobQueueTable';
import GanttChart from './GanttChart';
import GreedyStepTrace from './GreedyStepTrace';
import MetricCard from '../MetricCard';
import { runGreedySequencing } from '../../api/schedulerApi';
import { GREEDY_DATASETS } from '../../data/sampleData';

export default function GreedyView() {
  const [jobs, setJobs] = useState(GREEDY_DATASETS[0].jobs);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto-run once on initial load for instant demonstration
  useEffect(() => {
    executeGreedyOptimization(jobs);
  }, []);

  const executeGreedyOptimization = async (jobList) => {
    if (!jobList || jobList.length === 0) {
      setError('Please add at least one job order to sequence.');
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await runGreedySequencing(jobList);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to calculate greedy schedule.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddJob = (newJob) => {
    const jobWithId = {
      ...newJob,
      id: `J${jobs.length + 1}`
    };
    const updated = [...jobs, jobWithId];
    setJobs(updated);
    executeGreedyOptimization(updated);
  };

  const handleRemoveJob = (index) => {
    const updated = jobs.filter((_, idx) => idx !== index);
    setJobs(updated);
    if (updated.length > 0) {
      executeGreedyOptimization(updated);
    } else {
      setResult(null);
    }
  };

  const handleLoadDataset = (datasetJobs) => {
    setJobs(datasetJobs);
    executeGreedyOptimization(datasetJobs);
  };

  const handleClearJobs = () => {
    setJobs([]);
    setResult(null);
    setError(null);
  };

  // Calculate quick metrics
  const totalCandidateProfit = jobs.reduce((acc, j) => acc + Number(j.profit || 0), 0);
  const utilization = result && result.totalSlots > 0
    ? Math.round((result.acceptedCount / result.totalSlots) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Strategy Description Banner */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
              Greedy Strategy
            </span>
            <span className="text-xs text-stone-500 font-mono">
              O(N log N + N &middot; D_max)
            </span>
          </div>
          <h2 className="text-lg font-bold text-stone-900 mt-1">
            Job Sequencing with Deadlines (Urgent Single-Machine Orders)
          </h2>
          <p className="text-xs text-stone-600 mt-1 max-w-3xl">
            Solves the classical deadline scheduling problem. Each unit job takes 1 day (time window T: t-1 to t). The greedy criterion sorts jobs by maximum profit, then places each into the latest possible empty slot prior to its deadline.
          </p>
        </div>

        <button
          onClick={() => executeGreedyOptimization(jobs)}
          disabled={loading || jobs.length === 0}
          className="shrink-0 flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Optimizing...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Recalculate Schedule</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center space-x-2 shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main 2-Column Industrial Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Control Column (Width 4 of 12) */}
        <div className="lg:col-span-4 space-y-6">
          <JobForm
            onAddJob={handleAddJob}
            onLoadDataset={handleLoadDataset}
            onClearJobs={handleClearJobs}
            jobCount={jobs.length}
          />

          <JobQueueTable
            jobs={jobs}
            onRemoveJob={handleRemoveJob}
          />
        </div>

        {/* Right Output & Visualization Column (Width 8 of 12) */}
        <div className="lg:col-span-8 space-y-6">
          {/* KPI Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <MetricCard
              title="Total Realized Profit"
              value={result ? `$${result.totalProfit}` : '$0'}
              subtitle={result ? `Of $${totalCandidateProfit} pool` : 'Pending'}
              icon={DollarSign}
              color="emerald"
              badge="Maximized"
            />

            <MetricCard
              title="Jobs Accepted"
              value={result ? result.acceptedCount : 0}
              unit={`/ ${jobs.length}`}
              subtitle="Scheduled in slots"
              icon={CheckCircle2}
              color="emerald"
            />

            <MetricCard
              title="Orders Dropped"
              value={result ? result.rejectedCount : 0}
              unit="jobs"
              subtitle="Missed deadline"
              icon={Ban}
              color="rose"
            />

            <MetricCard
              title="Slot Utilization"
              value={`${utilization}%`}
              subtitle={result ? `${result.totalSlots - result.idleSlotCount} of ${result.totalSlots} slots` : '0%'}
              icon={Gauge}
              color="amber"
            />
          </div>

          {/* Gantt Chart Component */}
          {result && (
            <GanttChart scheduleResult={result} />
          )}

          {/* DAA Step-by-Step Decision Trace */}
          {result && (
            <GreedyStepTrace
              stepTrace={result.stepTrace}
              complexity={result.complexity}
            />
          )}
        </div>
      </div>
    </div>
  );
}

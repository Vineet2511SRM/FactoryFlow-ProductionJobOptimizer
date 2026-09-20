import React, { useState, useEffect } from 'react';
import { Play, Clock, Hourglass, Gauge, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import FlowShopForm from './FlowShopForm';
import FlowShopTable from './FlowShopTable';
import DualTimelineChart from './DualTimelineChart';
import JohnsonStepTrace from './JohnsonStepTrace';
import MetricCard from '../MetricCard';
import { runFlowShopScheduling } from '../../api/schedulerApi';
import { FLOWSHOP_DATASETS } from '../../data/sampleData';

export default function FlowShopView() {
  const [jobs, setJobs] = useState(FLOWSHOP_DATASETS[0].jobs);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto-run once on initial load for instant demonstration
  useEffect(() => {
    executeFlowShopOptimization(jobs);
  }, []);

  const executeFlowShopOptimization = async (jobList) => {
    if (!jobList || jobList.length === 0) {
      setError('Please add at least one job to the assembly line queue.');
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await runFlowShopScheduling(jobList);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to calculate flow shop schedule.');
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
    executeFlowShopOptimization(updated);
  };

  const handleRemoveJob = (index) => {
    const updated = jobs.filter((_, idx) => idx !== index);
    setJobs(updated);
    if (updated.length > 0) {
      executeFlowShopOptimization(updated);
    } else {
      setResult(null);
    }
  };

  const handleLoadDataset = (datasetJobs) => {
    setJobs(datasetJobs);
    executeFlowShopOptimization(datasetJobs);
  };

  const handleClearJobs = () => {
    setJobs([]);
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Strategy Description Banner */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
              Johnson's Flow Shop Algorithm
            </span>
            <span className="text-xs text-stone-500 font-mono">
              $O(N \log N)$ Flow Shop
            </span>
          </div>
          <h2 className="text-lg font-bold text-stone-900 mt-1">
            2-Machine Flow Shop Scheduling (Makespan & Idle-Time Minimization)
          </h2>
          <p className="text-xs text-stone-600 mt-1 max-w-3xl">
            Optimizes n jobs processed sequentially through Machine 1 (Stage 1 Fabrication) then Machine 2 (Stage 2 Assembly). Johnson's Rule guarantees minimum total makespan (C_max) and minimum cumulative idle time on Machine 2.
          </p>
        </div>

        <button
          onClick={() => executeFlowShopOptimization(jobs)}
          disabled={loading || jobs.length === 0}
          className="shrink-0 flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm transition shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
              <span>Sequencing...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>Optimize Assembly Flow</span>
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
          <FlowShopForm
            onAddJob={handleAddJob}
            onLoadDataset={handleLoadDataset}
            onClearJobs={handleClearJobs}
            jobCount={jobs.length}
          />

          <FlowShopTable
            jobs={jobs}
            onRemoveJob={handleRemoveJob}
          />
        </div>

        {/* Right Output & Visualization Column (Width 8 of 12) */}
        <div className="lg:col-span-8 space-y-6">
          {/* KPI Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <MetricCard
              title="Total Makespan"
              value={result ? result.totalMakespan : 0}
              unit="hours"
              subtitle="Completion time"
              icon={Clock}
              color="amber"
              badge="Minimized"
            />

            <MetricCard
              title="Machine B Idle Time"
              value={result ? result.totalIdleTimeM2 : 0}
              unit="hours"
              subtitle="Waiting for Stage 1"
              icon={Hourglass}
              color="rose"
              badge={result && result.totalIdleTimeM2 > 0 ? "Bottleneck" : "Optimal"}
            />

            <MetricCard
              title="Operations Sequenced"
              value={jobs.length}
              unit="jobs"
              subtitle="100% throughput"
              icon={Layers}
              color="indigo"
            />

            <MetricCard
              title="Line Efficiency"
              value={result ? `${result.efficiencyPercent}%` : '0%'}
              subtitle={result ? `M1+M2 work vs 2*Makespan` : 'Pending'}
              icon={Gauge}
              color="emerald"
            />
          </div>

          {/* Dual Timeline Chart Component */}
          {result && (
            <DualTimelineChart flowShopResult={result} />
          )}

          {/* DAA Step-by-Step Decision Trace */}
          {result && (
            <JohnsonStepTrace
              stepTrace={result.stepTrace}
              complexity={result.complexity}
            />
          )}
        </div>
      </div>
    </div>
  );
}

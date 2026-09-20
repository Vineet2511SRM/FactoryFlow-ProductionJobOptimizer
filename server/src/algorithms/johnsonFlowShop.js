/**
 * Flow Shop Scheduling: Johnson's Rule (2-Machine Assembly Line)
 * 
 * Design & Analysis of Algorithms (DAA) Implementation
 * Objective: Minimize total makespan (total completion time) and idle time
 * for n jobs being processed across two machines in fixed technological order:
 * Machine 1 (Stage 1 / Fabrication) -> Machine 2 (Stage 2 / Assembly).
 * 
 * Time Complexity:
 * - Johnson's Rule Sequencing: O(N log N) using sorting/priority search
 * - Timeline Generation: O(N)
 * - Overall Time Complexity: O(N log N)
 * - Space Complexity: O(N)
 */

export function solveFlowShop(rawJobs) {
  if (!Array.isArray(rawJobs) || rawJobs.length === 0) {
    throw new Error('Input must be a non-empty array of jobs.');
  }

  // 1. Sanitize, normalize and validate job inputs
  const jobs = rawJobs.map((job, index) => {
    const timeM1 = Number(job.timeM1);
    const timeM2 = Number(job.timeM2);

    if (isNaN(timeM1) || timeM1 <= 0 || !Number.isInteger(timeM1)) {
      throw new Error(`Job "${job.name || job.id || index + 1}" has invalid Time on Machine 1: ${job.timeM1}. Must be a positive integer.`);
    }
    if (isNaN(timeM2) || timeM2 <= 0 || !Number.isInteger(timeM2)) {
      throw new Error(`Job "${job.name || job.id || index + 1}" has invalid Time on Machine 2: ${job.timeM2}. Must be a positive integer.`);
    }

    return {
      id: job.id || `J${index + 1}`,
      name: job.name?.trim() || `Job ${index + 1}`,
      timeM1,
      timeM2,
      originalIndex: index
    };
  });

  const n = jobs.length;
  const optimalSequence = new Array(n);
  let left = 0;
  let right = n - 1;

  // Remaining pool of jobs to schedule
  const remaining = [...jobs];
  const stepTrace = [];
  let stepNumber = 1;

  // 2. Execute Johnson's Rule partition algorithm
  while (remaining.length > 0) {
    // Find the global minimum processing time across both machines among remaining jobs
    let minTime = Infinity;
    let selectedIndex = -1;
    let selectedMachine = null;

    for (let i = 0; i < remaining.length; i++) {
      const candidate = remaining[i];
      if (candidate.timeM1 < minTime) {
        minTime = candidate.timeM1;
        selectedIndex = i;
        selectedMachine = 'M1';
      }
      if (candidate.timeM2 < minTime) {
        minTime = candidate.timeM2;
        selectedIndex = i;
        selectedMachine = 'M2';
      }
    }

    const chosenJob = remaining[selectedIndex];

    // Johnson's Rule condition:
    // If min time is on Machine 1, place at earliest available position (front)
    // If min time is on Machine 2, place at latest available position (rear)
    if (selectedMachine === 'M1') {
      optimalSequence[left] = chosenJob;
      stepTrace.push({
        step: stepNumber++,
        jobId: chosenJob.id,
        name: chosenJob.name,
        minTime,
        machine: 'Machine 1 (Stage 1)',
        placedAt: `Front (Position ${left + 1})`,
        rationale: `Min time ${minTime} is on Machine 1. Scheduled as early as possible.`
      });
      left++;
    } else {
      optimalSequence[right] = chosenJob;
      stepTrace.push({
        step: stepNumber++,
        jobId: chosenJob.id,
        name: chosenJob.name,
        minTime,
        machine: 'Machine 2 (Stage 2)',
        placedAt: `Rear (Position ${right + 1})`,
        rationale: `Min time ${minTime} is on Machine 2. Scheduled as late as possible.`
      });
      right--;
    }

    // Remove chosen job from remaining list
    remaining.splice(selectedIndex, 1);
  }

  // 3. Construct exact start and end timelines for Machine 1 and Machine 2
  const machine1Timeline = [];
  const machine2Timeline = [];

  let currentM1Time = 0;
  let currentM2Time = 0;
  let totalIdleTimeM2 = 0;
  let totalM1WorkTime = 0;
  let totalM2WorkTime = 0;

  // Machine 1 executes the optimal sequence contiguously from t=0
  for (let i = 0; i < optimalSequence.length; i++) {
    const job = optimalSequence[i];
    const startM1 = currentM1Time;
    const endM1 = startM1 + job.timeM1;
    currentM1Time = endM1;
    totalM1WorkTime += job.timeM1;

    machine1Timeline.push({
      sequenceOrder: i + 1,
      jobId: job.id,
      name: job.name,
      startTime: startM1,
      endTime: endM1,
      duration: job.timeM1,
      isIdle: false
    });
  }

  // Machine 2 processes each job in optimal sequence after:
  // 1. Job completes on Machine 1
  // 2. Machine 2 completes its previous job
  for (let i = 0; i < optimalSequence.length; i++) {
    const job = optimalSequence[i];
    const correspondingM1 = machine1Timeline[i];
    const m1CompletionTime = correspondingM1.endTime;

    // Check if Machine 2 experiences an idle gap before starting this job
    if (m1CompletionTime > currentM2Time) {
      const idleDuration = m1CompletionTime - currentM2Time;
      totalIdleTimeM2 += idleDuration;

      machine2Timeline.push({
        sequenceOrder: null,
        jobId: 'IDLE',
        name: 'Idle (Awaiting M1)',
        startTime: currentM2Time,
        endTime: m1CompletionTime,
        duration: idleDuration,
        isIdle: true
      });

      currentM2Time = m1CompletionTime;
    }

    const startM2 = currentM2Time;
    const endM2 = startM2 + job.timeM2;
    currentM2Time = endM2;
    totalM2WorkTime += job.timeM2;

    machine2Timeline.push({
      sequenceOrder: i + 1,
      jobId: job.id,
      name: job.name,
      startTime: startM2,
      endTime: endM2,
      duration: job.timeM2,
      isIdle: false
    });
  }

  const totalMakespan = currentM2Time;
  const m1IdleAtEnd = totalMakespan - currentM1Time;
  const efficiency = totalMakespan > 0 
    ? Number((((totalM1WorkTime + totalM2WorkTime) / (2 * totalMakespan)) * 100).toFixed(1)) 
    : 100;

  return {
    algorithm: "Flow Shop Scheduling: Johnson's Rule (2 Machines)",
    jobCount: n,
    optimalSequence: optimalSequence.map((job, idx) => ({
      position: idx + 1,
      id: job.id,
      name: job.name,
      timeM1: job.timeM1,
      timeM2: job.timeM2
    })),
    machine1Timeline,
    machine2Timeline,
    totalMakespan,
    totalIdleTimeM2,
    m1FinishTime: currentM1Time,
    m1IdleAtEnd,
    totalM1WorkTime,
    totalM2WorkTime,
    efficiencyPercent: efficiency,
    stepTrace,
    complexity: {
      time: "O(N log N)",
      space: "O(N)"
    }
  };
}

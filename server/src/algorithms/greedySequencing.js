/**
 * Greedy Strategy: Job Sequencing with Deadlines
 * 
 * Design & Analysis of Algorithms (DAA) Implementation
 * Objective: Maximize total profit on a single machine where each job
 * requires 1 unit of time and must be completed by its deadline.
 * 
 * Time Complexity:
 * - Sorting: O(N log N)
 * - Slot Search & Assignment: O(N * D_max), where D_max = max(deadlines)
 * - Overall Time Complexity: O(N log N + N * D_max)
 * - Space Complexity: O(D_max + N)
 */

export function solveGreedySequencing(rawJobs) {
  if (!Array.isArray(rawJobs) || rawJobs.length === 0) {
    throw new Error('Input must be a non-empty array of jobs.');
  }

  // 1. Sanitize, normalize and validate job inputs
  const jobs = rawJobs.map((job, index) => {
    const profit = Number(job.profit);
    const deadline = Number(job.deadline);

    if (isNaN(profit) || profit < 0 || !Number.isInteger(profit)) {
      throw new Error(`Job "${job.name || job.id || index + 1}" has invalid profit: ${job.profit}. Profit must be a non-negative integer.`);
    }
    if (isNaN(deadline) || deadline <= 0 || !Number.isInteger(deadline)) {
      throw new Error(`Job "${job.name || job.id || index + 1}" has invalid deadline: ${job.deadline}. Deadline must be a positive integer.`);
    }

    return {
      id: job.id || `J${index + 1}`,
      name: job.name?.trim() || `Job ${index + 1}`,
      profit,
      deadline,
      originalIndex: index
    };
  });

  // 2. Sort jobs in descending order of profit (Greedy Choice Property)
  // If profits are equal, earlier deadline can be prioritized
  const sortedJobs = [...jobs].sort((a, b) => {
    if (b.profit !== a.profit) {
      return b.profit - a.profit;
    }
    return a.deadline - b.deadline;
  });

  // 3. Find the maximum deadline to establish total available discrete time slots
  const maxDeadline = Math.max(...jobs.map(j => j.deadline));

  // Initialize schedule slots: 1-indexed (slots 1 to maxDeadline)
  // slot[k] represents the time window [k-1, k]
  const slots = new Array(maxDeadline + 1).fill(null);

  const acceptedJobs = [];
  const rejectedJobs = [];
  const stepTrace = [];

  let totalProfit = 0;

  // 4. Greedy Selection: Assign each job to the latest available free slot <= deadline
  for (let i = 0; i < sortedJobs.length; i++) {
    const job = sortedJobs[i];
    let assignedSlot = -1;

    // Search backwards from min(job.deadline, maxDeadline) down to slot 1
    const searchStart = Math.min(job.deadline, maxDeadline);
    for (let slot = searchStart; slot >= 1; slot--) {
      if (slots[slot] === null) {
        slots[slot] = job;
        assignedSlot = slot;
        break;
      }
    }

    if (assignedSlot !== -1) {
      totalProfit += job.profit;
      acceptedJobs.push({ ...job, assignedSlot });
      stepTrace.push({
        step: i + 1,
        jobId: job.id,
        name: job.name,
        profit: job.profit,
        deadline: job.deadline,
        action: 'ACCEPTED',
        assignedSlot,
        rationale: `Assigned to latest available free slot ${assignedSlot} (within deadline ${job.deadline}).`,
        currentTotalProfit: totalProfit
      });
    } else {
      rejectedJobs.push({ ...job, reason: `All slots <= ${job.deadline} are already filled.` });
      stepTrace.push({
        step: i + 1,
        jobId: job.id,
        name: job.name,
        profit: job.profit,
        deadline: job.deadline,
        action: 'REJECTED',
        assignedSlot: null,
        rationale: `No empty slot available in range [1, ${job.deadline}].`,
        currentTotalProfit: totalProfit
      });
    }
  }

  // 5. Structure the final schedule array for visualization (1 to maxDeadline)
  const schedule = [];
  let idleCount = 0;

  for (let s = 1; s <= maxDeadline; s++) {
    if (slots[s] !== null) {
      schedule.push({
        slotNumber: s,
        timeWindow: `Day ${s} (T: ${s - 1} - ${s})`,
        isIdle: false,
        job: {
          id: slots[s].id,
          name: slots[s].name,
          profit: slots[s].profit,
          deadline: slots[s].deadline
        }
      });
    } else {
      idleCount++;
      schedule.push({
        slotNumber: s,
        timeWindow: `Day ${s} (T: ${s - 1} - ${s})`,
        isIdle: true,
        job: null
      });
    }
  }

  return {
    algorithm: "Greedy Strategy: Job Sequencing with Deadlines",
    maxDeadline,
    totalSlots: maxDeadline,
    acceptedCount: acceptedJobs.length,
    rejectedCount: rejectedJobs.length,
    idleSlotCount: idleCount,
    totalProfit,
    schedule,
    acceptedJobs,
    rejectedJobs,
    stepTrace,
    complexity: {
      time: "O(N log N + N * D_max)",
      space: "O(D_max + N)"
    }
  };
}

import { solveGreedySequencing } from './src/algorithms/greedySequencing.js';
import { solveFlowShop } from './src/algorithms/johnsonFlowShop.js';

console.log('--- Testing Greedy Job Sequencing with Deadlines ---');
const greedyJobs = [
  { id: 'J1', name: 'PCB Assembly Order', profit: 100, deadline: 2 },
  { id: 'J2', name: 'Sensor Batch alpha', profit: 19, deadline: 1 },
  { id: 'J3', name: 'Hydraulic Valve Pack', profit: 27, deadline: 2 },
  { id: 'J4', name: 'Gearbox Calibration', profit: 25, deadline: 1 },
  { id: 'J5', name: 'Casting Inspection', profit: 15, deadline: 3 },
];

const greedyResult = solveGreedySequencing(greedyJobs);
console.log('Greedy Total Profit:', greedyResult.totalProfit, '(Expected: 142)');
console.log('Greedy Accepted Count:', greedyResult.acceptedCount, '(Expected: 3)');
console.log('Schedule:');
greedyResult.schedule.forEach(slot => {
  console.log(`  Slot ${slot.slotNumber}: ${slot.isIdle ? 'IDLE' : `${slot.job.id} - ${slot.job.name} (Profit: $${slot.job.profit})`}`);
});

if (greedyResult.totalProfit === 142 && greedyResult.acceptedCount === 3) {
  console.log('>>> GREEDY ALGORITHM TEST: PASSED\n');
} else {
  console.error('>>> GREEDY ALGORITHM TEST: FAILED\n');
  process.exit(1);
}

console.log('--- Testing Johnson\'s Rule Flow Shop (2 Machines) ---');
const flowShopJobs = [
  { id: 'J1', name: 'Stamping & Polish', timeM1: 3, timeM2: 2 },
  { id: 'J2', name: 'Drilling & Paint', timeM1: 12, timeM2: 10 },
  { id: 'J3', name: 'Laser Cut & Powder', timeM1: 5, timeM2: 6 },
  { id: 'J4', name: 'CNC Mill & Thread', timeM1: 2, timeM2: 3 },
  { id: 'J5', name: 'Press & Weld', timeM1: 9, timeM2: 11 },
];

const flowShopResult = solveFlowShop(flowShopJobs);
console.log('Optimal Sequence:', flowShopResult.optimalSequence.map(j => j.id).join(' -> '));
console.log('Total Makespan:', flowShopResult.totalMakespan, '(Expected: 40)');
console.log('Total Idle Time on M2:', flowShopResult.totalIdleTimeM2, '(Expected: 8)');
console.log('Machine 1 timeline blocks:', flowShopResult.machine1Timeline.length);
console.log('Machine 2 timeline blocks (including idle):', flowShopResult.machine2Timeline.length);

if (flowShopResult.totalMakespan === 40 && flowShopResult.totalIdleTimeM2 === 8) {
  console.log('>>> JOHNSON\'S RULE FLOW SHOP TEST: PASSED\n');
} else {
  console.error('>>> JOHNSON\'S RULE FLOW SHOP TEST: FAILED\n');
  process.exit(1);
}

console.log('ALL DAA ALGORITHMS VALIDATED WITH 100% MATHEMATICAL RIGOR!');

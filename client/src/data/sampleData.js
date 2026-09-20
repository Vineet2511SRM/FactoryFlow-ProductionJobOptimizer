/**
 * Curated Industrial Datasets for Factory Production Demonstrations
 */

export const GREEDY_DATASETS = [
  {
    name: 'Precision Components Batch (5 Orders)',
    description: 'High-margin priority orders competing for tight early-stage delivery slots.',
    jobs: [
      { id: 'J1', name: 'Precision Gearbox', profit: 100, deadline: 2 },
      { id: 'J2', name: 'Micro-Sensor Array', profit: 19, deadline: 1 },
      { id: 'J3', name: 'Hydraulic Valve Pack', profit: 27, deadline: 2 },
      { id: 'J4', name: 'Control Unit Board', profit: 25, deadline: 1 },
      { id: 'J5', name: 'Titanium Fastener', profit: 15, deadline: 3 },
    ]
  },
  {
    name: 'High Contention Rush Orders (7 Orders)',
    description: 'Heavy competition for early slots (Days 1-2); demonstrates aggressive job drop-off.',
    jobs: [
      { id: 'J1', name: 'Aircraft Flap Actuator', profit: 120, deadline: 3 },
      { id: 'J2', name: 'Emergency Fuel Pump', profit: 90, deadline: 1 },
      { id: 'J3', name: 'Turbine Blade Polish', profit: 85, deadline: 2 },
      { id: 'J4', name: 'Cockpit HUD Display', profit: 70, deadline: 1 },
      { id: 'J5', name: 'Navigation Gyro', profit: 65, deadline: 2 },
      { id: 'J6', name: 'Alloy Bracket Kit', profit: 50, deadline: 4 },
      { id: 'J7', name: 'Cabin Filter Pack', profit: 30, deadline: 3 },
    ]
  },
  {
    name: 'Sparse Delivery Windows with Idle Days (6 Orders)',
    description: 'Wide deadlines creating distinct IDLE machine slots on non-critical days.',
    jobs: [
      { id: 'J1', name: 'Main Engine Block', profit: 250, deadline: 5 },
      { id: 'J2', name: 'Transmission Shaft', profit: 180, deadline: 2 },
      { id: 'J3', name: 'Brake Caliper Pair', profit: 140, deadline: 2 },
      { id: 'J4', name: 'Radiator Core Unit', profit: 95, deadline: 6 },
      { id: 'J5', name: 'Exhaust Manifold', profit: 75, deadline: 6 },
      { id: 'J6', name: 'Alternator Rotor', profit: 45, deadline: 1 },
    ]
  }
];

export const FLOWSHOP_DATASETS = [
  {
    name: "Standard Dual-Stage Line (5 Jobs)",
    description: "Balanced fabrication and finishing sequence for total makespan minimization.",
    jobs: [
      { id: 'J1', name: 'Stamping & Polish', timeM1: 3, timeM2: 2 },
      { id: 'J2', name: 'Drilling & Paint', timeM1: 12, timeM2: 10 },
      { id: 'J3', name: 'Laser Cut & Powder', timeM1: 5, timeM2: 6 },
      { id: 'J4', name: 'CNC Mill & Thread', timeM1: 2, timeM2: 3 },
      { id: 'J5', name: 'Press & Weld', timeM1: 9, timeM2: 11 },
    ]
  },
  {
    name: 'Automotive Sub-Assembly Line (6 Jobs)',
    description: 'Stage 1: Robotic Welding -> Stage 2: Primer & Quality Inspection.',
    jobs: [
      { id: 'J1', name: 'Chassis Crossbeam', timeM1: 4, timeM2: 8 },
      { id: 'J2', name: 'Door Subframe', timeM1: 9, timeM2: 3 },
      { id: 'J3', name: 'Roof Arch Support', timeM1: 7, timeM2: 7 },
      { id: 'J4', name: 'Bumper Impact Bar', timeM1: 8, timeM2: 6 },
      { id: 'J5', name: 'Battery Enclosure', timeM1: 2, timeM2: 5 },
      { id: 'J6', name: 'Engine Cradle Sub', timeM1: 6, timeM2: 2 },
    ]
  },
  {
    name: 'Electronics SMD & Testing Line (7 Jobs)',
    description: 'High-speed SMT Placement (M1) followed by In-Circuit Testing & QA (M2).',
    jobs: [
      { id: 'J1', name: 'IoT Gateway Motherboard', timeM1: 6, timeM2: 3 },
      { id: 'J2', name: 'Server PSU Controller', timeM1: 2, timeM2: 7 },
      { id: 'J3', name: 'Industrial PLC Module', timeM1: 5, timeM2: 4 },
      { id: 'J4', name: 'LiDAR Processing Unit', timeM1: 7, timeM2: 8 },
      { id: 'J5', name: 'FPGA Accelerator Card', timeM1: 3, timeM2: 6 },
      { id: 'J6', name: 'Automotive ECU Core', timeM1: 9, timeM2: 2 },
      { id: 'J7', name: 'Telemetry Transceiver', timeM1: 4, timeM2: 5 },
    ]
  }
];

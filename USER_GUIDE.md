# FactoryFlow: User Guide & Operational Manual

> **Production Job Sequencing & Flow Shop Assembly Optimizer**  
> Complete interactive guide for operating, configuring, and demonstrating the FactoryFlow web application.

---

## Table of Contents
1. [Quick Start & Launching the App](#1-quick-start--launching-the-app)
2. [User Interface Overview](#2-user-interface-overview)
3. [Module 1: Urgent Orders (Greedy Job Sequencing)](#3-module-1-urgent-orders-greedy-job-sequencing)
   - [Overview & Industrial Context](#31-overview--industrial-context)
   - [How to Load Scenarios or Add Custom Jobs](#32-how-to-load-scenarios-or-add-custom-jobs)
   - [Interpreting the Visual Gantt Chart & KPIs](#33-interpreting-the-visual-gantt-chart--kpis)
   - [Analyzing Dropped Orders & Execution Trace](#34-analyzing-dropped-orders--execution-trace)
4. [Module 2: Assembly Line (Johnson's Flow Shop)](#4-module-2-assembly-line-johnsons-flow-shop)
   - [Overview & Industrial Context](#41-overview--industrial-context)
   - [How to Load Scenarios or Add Assembly Jobs](#42-how-to-load-scenarios-or-add-assembly-jobs)
   - [Interpreting the Dual-Machine Synchronized Timeline](#43-interpreting-the-dual-machine-synchronized-timeline)
   - [Understanding Machine B Idle Bottleneck Gaps](#44-understanding-machine-b-idle-bottleneck-gaps)
   - [Inspecting Johnson's Partitioning Decision Trace](#45-inspecting-johnsons-partitioning-decision-trace)
5. [Troubleshooting & FAQ](#5-troubleshooting--faq)
6. [Demonstration & Viva Tips](#6-demonstration--viva-tips)

---

## 1. Quick Start & Launching the App

### Prerequisites
- **Node.js** (v18.0.0 or later installed on your system)
- **npm** (v9.0.0 or later)
- Web Browser (Google Chrome, Microsoft Edge, Firefox, etc.)

### Step-by-Step Launch:
1. Open your terminal in the project directory:
   ```bash
   cd "d:\AoA project"
   ```
2. *(First-time setup only)* Install all root, server, and client dependencies:
   ```bash
   npm run install:all
   ```
3. Launch both the backend API and frontend client with a single command:
   ```bash
   npm run dev
   ```
   - **Express Backend API**: Starts on `http://localhost:5000`
   - **Vite React Frontend**: Starts on `http://localhost:5173`
4. Open your browser and navigate to:  
   👉 **[http://localhost:5173/](http://localhost:5173/)**
5. Check the top-right header badge:
   - When active, a green pill badge indicates **`● API :5000 Active`**.
   - If the backend is disconnected, it displays **`API Offline`** with a refresh button.

---

## 2. User Interface Overview

The interface is designed with a **light industrial control room theme**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [FactoryFlow Icon] FactoryFlow  Production Job Optimizer     [● API :5000] │
│ ─────────────────────────────────────────────────────────────────────────── │
│  [  Urgent Orders (Greedy)  ]     [  Assembly Line (Flow Shop)  ]          │
└─────────────────────────────────────────────────────────────────────────────┘
```

- **Header**: Displays system status, branding, and the two main optimization modules.
- **Left Panel (Control Column)**: Order entry forms, input validation, candidate pool queue, and preset scenario loaders.
- **Right Panel (Visualization Column)**: Real-time KPI summary cards, interactive horizontal Gantt charts / dual synchronized timelines, and step-by-step decision traces.

---

## 3. Module 1: Urgent Orders (Greedy Job Sequencing)

### 3.1 Overview & Industrial Context
- **Manufacturing Scenario**: A high-precision manufacturing workshop processes custom rush orders on a single machine.
- **Constraints**:
  - Each job takes exactly **1 calendar day** (time window $[t-1, t]$).
  - Each job has a deadline $d_i$ in days and a profit value $p_i$ in dollars.
  - If completed on or before day $d_i$, the company earns profit $p_i$; otherwise, the order is dropped.
- **Objective**: Maximize total realized profit without any accepted order missing its deadline.

### 3.2 How to Load Scenarios or Add Custom Jobs

#### Option A: Load Production Scenarios (One-Click)
In the left panel under **"Load Production Scenarios"**, choose any of the curated factory benchmarks:
1. **Precision Components Batch (5 Orders)**: Standard benchmark showing competition between high-profit and tight-deadline orders.
2. **High Contention Rush Orders (7 Orders)**: Overloaded queue with 7 rush jobs competing for 4 available slots, demonstrating aggressive profit-based job drop-off.
3. **Sparse Delivery Windows with Idle Days (6 Orders)**: Orders spread across a 6-day horizon, illustrating how empty calendar slots are designated as `IDLE`.

#### Option B: Add Custom Orders Manually
1. Enter the **Job / Order Name** (e.g., `Titanium Aircraft Flap`).
2. Enter the **Profit Value ($)** (e.g., `150`). Must be a positive whole number.
3. Enter the **Deadline (Day)** (e.g., `2` for Day 2). Must be a positive integer $\ge 1$.
4. Click **"Add Job to Factory Queue"**.
   - The queue updates instantly and triggers the Greedy calculation engine.

#### Option C: Modify the Queue
- Click the **✕** button on any row in the **Job Candidate Pool** to remove an order.
- Click **"Clear Queue"** to wipe the candidate pool and start from scratch.

### 3.3 Interpreting the Visual Gantt Chart & KPIs

#### KPI Cards:
- **Total Realized Profit**: The maximum cumulative profit earned from all scheduled orders.
- **Jobs Accepted**: Number of orders successfully slotted before their deadlines.
- **Orders Dropped**: Number of candidate orders that could not be scheduled.
- **Slot Utilization**: Percentage of days actively executing orders vs. dormant days.

#### Visual Gantt Chart (Days 1 to $D_{\max}$):
- **Green Blocks**: Scheduled orders showing:
  - Job ID badge (e.g., `J1`, `J3`)
  - Deadline window (e.g., `dl: Day 2`)
  - Full order name
  - Yield indicator (e.g., `+$100`)
- **Dashed Yellow Striped Blocks (`IDLE / NO ORDER`)**:
  - Highlights calendar days where the machine is dormant because no candidate job had a valid deadline permitting placement in that slot.

### 3.4 Analyzing Dropped Orders & Execution Trace

- **Unscheduled / Dropped Orders Box**:
  - Displays all orders that missed scheduling, showing their deadline and lost profit opportunity.
- **Execution Trace: Step-by-Step Greedy Decisions**:
  - Click to expand the trace table.
  - Reviews each job in descending order of profit.
  - Explains the algorithmic reasoning (e.g., *"Assigned to latest available free slot 2 (within deadline 2)"* or *"No empty slot available in range [1, 1]"*).
  - Displays cumulative profit progression.

---

## 4. Module 2: Assembly Line (Johnson's Flow Shop)

### 4.1 Overview & Industrial Context
- **Manufacturing Scenario**: A two-stage production line where every component must undergo:
  - **Stage 1 (Machine A)**: Fabrication / CNC Milling / Stamping
  - **Stage 2 (Machine B)**: Assembly / Surface Coating / QA Testing
- **Constraints**:
  - Strict technological sequence: Machine 1 must completely finish an item before Machine 2 can touch it.
  - No preemption: Once a stage begins on a machine, it runs to completion.
- **Objective**: Find the optimal job sequence to **minimize total completion time (Makespan $C_{\max}$)** and **minimize Machine B idle waiting delays**.

### 4.2 How to Load Scenarios or Add Assembly Jobs

#### Option A: Load Assembly Line Scenarios
Under **"Load Assembly Line Scenarios"**, choose a benchmark:
1. **Standard Dual-Stage Line (5 Jobs)**: The canonical 5-job benchmark with alternating machine bottlenecks.
2. **Automotive Sub-Assembly Line (6 Jobs)**: Stage 1 Welding $\to$ Stage 2 Painting.
3. **Electronics SMD & Testing Line (7 Jobs)**: High-speed SMT placement $\to$ Automated Optical & Functional QA.

#### Option B: Add Custom Multi-Stage Jobs
1. Enter the **Job / Assembly Name** (e.g., `Lithium Battery Casing`).
2. Enter **Time on Machine A (hrs)** (Stage 1 duration).
3. Enter **Time on Machine B (hrs)** (Stage 2 duration).
4. Click **"Add to Assembly Pipeline"**.
5. Click **"Optimize Assembly Flow"** to recalculate.

### 4.3 Interpreting the Dual-Machine Synchronized Timeline

#### Top Summary Cards:
- **Total Makespan**: Total duration (in continuous hours) from $t = 0$ until the last job exits Machine B.
- **Machine B Idle Waiting**: Cumulative hours Machine B must wait for Machine A output.
- **Operations Sequenced**: Count of jobs scheduled (100% throughput).
- **Assembly Line Efficiency %**: Work ratio calculated as:
  $$\text{Efficiency} = \frac{\sum A_i + \sum B_i}{2 \times C_{\max}} \times 100\%$$

#### Optimal Sequence Flow:
- Displays the ordered execution chain:
  $$J_4 \to J_3 \to J_5 \to J_2 \to J_1$$
- Operations must be fed into Machine 1 in this exact sequence to achieve minimal makespan.

### 4.4 Understanding Machine B Idle Bottleneck Gaps

In the dual timeline visualization:
- **Top Row (Machine A - Stage 1)**: Runs continuously from $t = 0$ with zero internal gaps.
- **Bottom Row (Machine B - Stage 2)**: Visualizes assembly work with **highlighted red/pink striped Idle Bottleneck gaps**:
  - `IDLE 2h`: Machine 2 waits from $t = 0 \to 2$ for the first job ($J_4$) to finish on Machine 1.
  - `IDLE 2h`: Machine 2 waits from $t = 5 \to 7$ because $J_3$ takes 5 hours on Machine 1 but only 3 hours on Machine 2.
  - `IDLE 3h`: Machine 2 waits from $t = 13 \to 16$ while Machine 1 processes the 9-hour job $J_5$.
  - `IDLE 1h`: Machine 2 waits from $t = 27 \to 28$ while Machine 1 finishes $J_2$.

#### Live Hover Inspector:
- Hover your mouse over any segment on either timeline.
- A live info bar above the timeline displays:
  - Machine stage name
  - Operation name & Job ID
  - Start & Finish time: `[T: 13h → 16h]`
  - Exact duration: `3 hrs`
  - Warning tag: `Awaiting Machine A output` (for idle gaps).

#### Shared Continuous Time Scale:
- Both Machine A and Machine B share the exact same graduated X-axis ruler (from `0h` to `Total Makespan`).
- This allows direct vertical comparison of where Machine 1 completes and when Machine 2 picks up each job.

### 4.5 Inspecting Johnson's Partitioning Decision Trace

Click **"Execution Trace: Johnson's Rule Partition Logic"** to view the mathematical step-by-step breakdown:
1. Identifies the global minimum processing time across both machines among remaining jobs.
2. Explains the placement decision:
   - **Front (Left Pointer)**: If the minimum time occurs on Machine 1 (fast Stage 1 jobs are done first to pass work to Machine 2 immediately).
   - **Rear (Right Pointer)**: If the minimum time occurs on Machine 2 (short Stage 2 jobs are deferred to the end to clear the line quickly).

---

## 5. Troubleshooting & FAQ

### Q1: The header displays "API Offline". How do I reconnect?
- **Cause**: The Node.js Express backend is not running on port 5000.
- **Fix**: Open a terminal in the root folder and run:
  ```bash
  npm run server
  ```
  Then click the refresh icon next to the API status pill in the website header.

### Q2: Can I run both backend and frontend in a single terminal?
- **Yes**: Simply run `npm run dev` from the root directory. It utilizes `concurrently` to run both services together.

### Q3: Why does adding an order not increase total profit in Urgent Orders?
- **Reason**: If all slots prior to the new order's deadline are already occupied by jobs with higher profit, the greedy algorithm correctly rejects the new order to protect maximum earnings.

### Q4: Why is there always an idle gap at the start of Machine B?
- **Reason**: Machine 2 cannot start processing until Machine 1 has finished at least one item. The first job ($J_{\pi_1}$) must complete Stage 1 before Stage 2 can begin.

---

## 6. Demonstration & Viva Tips

When presenting FactoryFlow for evaluations or project showcases:
1. **Highlight Native Algorithms**: Emphasize that all sorting and sequencing algorithms are implemented from scratch in pure JavaScript (`server/src/algorithms/`) without external solver packages.
2. **Demonstrate Greedy Contention**: Load the *High Contention Rush Orders* scenario to show how the greedy matroid strategy handles overbooked time slots.
3. **Demonstrate Flow Shop Optimization**: Load *Johnson's Classic 5-Job Benchmark* and use the hover inspector on the timeline to show examiners the exact makespan (40 hrs) and idle delay (8 hrs).
4. **Refer to the README**: Point evaluators to the root `README.md` for formal mathematical formulations, proof sketches, and algorithmic complexity tables ($O(N \log N)$).

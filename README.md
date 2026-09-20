# FactoryFlow: Production Job Sequencing Optimizer

> **Industrial Production Scheduling Engine**  
> An interactive full-stack web application demonstrating two classical combinatorial optimization algorithms applied to modern manufacturing workflows:
> 1. **Greedy Strategy**: Job Sequencing with Deadlines (maximizing single-machine profit within strict delivery windows).
> 2. **Flow Shop Scheduling**: Johnson's Rule (minimizing total makespan and bottleneck idle delays for a 2-stage assembly line).

---

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Theoretical Foundations & Mathematical Formulations](#theoretical-foundations--mathematical-formulations)
   - [Module 1: Job Sequencing with Deadlines (Greedy Method)](#module-1-job-sequencing-with-deadlines-greedy-method)
   - [Module 2: Flow Shop Scheduling (Johnson's Rule)](#module-2-flow-shop-scheduling-johnsons-rule)
3. [Algorithmic Comparison Matrix](#algorithmic-comparison-matrix)
4. [Step-by-Step Numerical Walkthroughs](#step-by-step-numerical-walkthroughs)
5. [REST API Documentation](#rest-api-documentation)
6. [Tech Stack & Architecture](#tech-stack--architecture)
7. [Installation & Quick Start](#installation--quick-start)
8. [Project File Structure](#project-file-structure)

---

## System Architecture

FactoryFlow is built on a clean, decoupled client-server architecture:
- **Backend (Node.js & Express)**: Dedicated REST API running on port `5000`. Houses pure, native algorithmic engines without any external solver dependencies.
- **Frontend (React & Vite & Tailwind CSS)**: Single-page application running on port `5173`. Features an industrial control room interface, visual single-machine slot Gantt charts, dual synchronized timelines with highlighted idle bottleneck gaps, and live step-by-step trace tables.

```
┌──────────────────────────────────────────────┐
│           React (Vite) Frontend             │
│        (Port 5173 - Industrial UI)           │
└──────────────────────┬───────────────────────┘
                       │ HTTP REST (JSON)
                       ▼
┌──────────────────────────────────────────────┐
│            Express.js Backend                │
│                 (Port 5000)                  │
├──────────────────────┬───────────────────────┤
│  solveGreedySequence │    solveFlowShop      │
│     (Greedy Engine)  │   (Johnson Engine)    │
└──────────────────────┴───────────────────────┘
```

---

## Theoretical Foundations & Mathematical Formulations

### Module 1: Job Sequencing with Deadlines (Greedy Method)

#### 1. Problem Formulation
Consider a factory workstation that processes urgent customer orders on a single machine.
- We are given a set of $n$ candidate jobs: $J = \{J_1, J_2, \dots, J_n\}$.
- Each job $J_i$ requires **1 unit of time** (slot $[t-1, t]$ for day $t$).
- Each job $J_i$ yields an integer profit $p_i > 0$ if and only if it is completed **on or before its integer deadline** $d_i \ge 1$.
- Only one job can be executed on the machine during any single time slot.
- **Objective**: Select a subset of jobs $S \subseteq J$ and assign them to time slots $1, 2, \dots, D_{\max}$ (where $D_{\max} = \max_{i}(d_i)$) to **maximize total profit**:
  $$\max \sum_{J_k \in S} p_k$$
  subject to:
  $$\forall J_k \in S, \quad \text{assigned\_slot}(J_k) \le d_k$$
  $$\forall J_j, J_k \in S \; (j \neq k), \quad \text{assigned\_slot}(J_j) \neq \text{assigned\_slot}(J_k)$$

#### 2. Greedy Choice Property & Matroid Theory
Job sequencing with deadlines satisfies the properties of an **independent system (matroid)**:
- **Greedy Criterion**: Sort jobs in descending order of profit:
  $$p_{(1)} \ge p_{(2)} \ge \dots \ge p_{(n)}$$
- **Latest Feasible Slot Principle**: For each job $J_i$ in descending profit order, search backwards from $\min(d_i, D_{\max})$ down to slot 1:
  - If an empty slot $k$ is found, schedule $J_i$ in slot $k$.
  - If all slots $1 \dots \min(d_i, D_{\max})$ are already occupied, reject $J_i$.
- **Why assign the latest feasible slot?**  
  Placing job $J_i$ as late as possible (closest to its deadline $d_i$) leaves earlier slots open for subsequent jobs that have more restrictive, earlier deadlines. This exchange argument guarantees an optimal total profit.

#### 3. Complexity Analysis
- **Sorting Phase**: $O(N \log N)$ using standard comparison sorting.
- **Slot Allocation Phase**: For each of the $N$ jobs, we perform a linear backward search over at most $D_{\max}$ slots:
  $$O(N \cdot D_{\max})$$
- **Total Time Complexity**:
  $$\mathcal{O}(N \log N + N \cdot D_{\max})$$
- **Space Complexity**: $\mathcal{O}(D_{\max} + N)$ for slot storage and job tracking.
- *(Note: With a Disjoint Set Union / DSU Find-Union tree, slot allocation can be optimized to $\mathcal{O}(N \cdot \alpha(D_{\max}))$, where $\alpha$ is the inverse Ackermann function).*

---

### Module 2: Flow Shop Scheduling (Johnson's Rule)

#### 1. Problem Formulation
Consider a two-stage manufacturing pipeline (e.g., Stage 1: CNC Milling $\to$ Stage 2: Quality Inspection / Coating).
- We have $n$ jobs $J = \{J_1, J_2, \dots, J_n\}$.
- Every job must pass through **Machine 1 ($M_1$) first**, and upon completion on $M_1$, move to **Machine 2 ($M_2$)**.
- Job $J_i$ requires processing time $A_i$ on $M_1$ and $B_i$ on $M_2$ ($A_i, B_i > 0$).
- No job can start on Machine 2 until it finishes on Machine 1:
  $$S_{2, i} \ge C_{1, i}$$
- **Objective**: Find a permutation schedule $\pi = (\pi_1, \pi_2, \dots, \pi_n)$ that minimizes the **total completion time (Makespan $C_{\max}$)** and **total idle time on Machine 2**.

#### 2. The Idle Time Phenomenon
Machine 1 begins at time $t = 0$ and runs continuously with zero idle gaps:
$$C_{1, k} = C_{1, k-1} + A_{\pi_k} \quad (\text{with } C_{1, 0} = 0)$$

Machine 2 can only start job $\pi_k$ once both conditions are satisfied:
1. Machine 2 has finished the previous job $\pi_{k-1}$ ($t \ge C_{2, k-1}$).
2. Job $\pi_k$ has finished processing on Machine 1 ($t \ge C_{1, k}$).

Therefore, the start time on Machine 2 is:
$$S_{2, k} = \max(C_{2, k-1}, C_{1, k})$$
The completion time on Machine 2 is:
$$C_{2, k} = S_{2, k} + B_{\pi_k}$$

If $C_{1, k} > C_{2, k-1}$, **Machine 2 must remain idle** waiting for Machine 1 to finish:
$$\text{IdleGap}_{2, k} = C_{1, k} - C_{2, k-1}$$
Total Idle Time on Machine 2:
$$I_2 = \sum_{k=1}^n \max(0, C_{1, k} - C_{2, k-1})$$
Makespan $C_{\max} = C_{2, n}$.

#### 3. Johnson's Rule (1954 Theorem)
S.M. Johnson proved that job $J_i$ should precede job $J_j$ in the optimal sequence if:
$$\min(A_i, B_j) < \min(A_j, B_i)$$

**Constructive Procedure:**
1. Initialize two boundary pointers: `left = 0`, `right = n - 1`.
2. Find the smallest processing time among all currently unscheduled jobs:
   $$t^* = \min_{J_k \in \text{remaining}} (\min(A_k, B_k))$$
3. If the minimum time $t^*$ is on **Machine 1** ($A_k \le B_k$):
   - Place $J_k$ at the earliest available position (`sequence[left++]`).
   *(Intuition: Doing fast Machine 1 jobs early gets work over to Machine 2 as quickly as possible, avoiding early idle time on Machine 2).*
4. If the minimum time $t^*$ is on **Machine 2** ($B_k < A_k$):
   - Place $J_k$ at the latest available position (`sequence[right--]`).
   *(Intuition: Jobs with short Stage 2 times should be deferred to the end so that Machine 2 can be cleared quickly at the end of the production run).*
5. Remove $J_k$ from the pool and repeat until all jobs are placed.

#### 4. Complexity Analysis
- **Partitioning Algorithm**: Finding minimums and placing in front/rear takes $\mathcal{O}(N \log N)$ using priority queues or sorted lists.
- **Timeline Computation**: Linear pass over the sequence takes $\mathcal{O}(N)$.
- **Overall Time Complexity**:
  $$\mathcal{O}(N \log N)$$
- **Space Complexity**: $\mathcal{O}(N)$ to store optimal sequence and timeline intervals.

---

## Algorithmic Comparison Matrix

| Attribute | Greedy Job Sequencing with Deadlines | Johnson's 2-Machine Flow Shop |
| :--- | :--- | :--- |
| **Algorithmic Paradigm** | Greedy Strategy (Matroid Independence) | Constructive Permutation (Exchange Theorem) |
| **Primary Goal** | Maximize total realized profit ($\sum p_i$) | Minimize total makespan ($C_{\max}$) & idle delay |
| **Machine Layout** | Single machine, discrete 1-day slots | 2 machines in pipeline sequence ($M_1 \to M_2$) |
| **Input Parameters** | Job ID, Profit ($p_i$), Deadline ($d_i$) | Job ID, Machine 1 Time ($A_i$), Machine 2 Time ($B_i$) |
| **Constraint** | Job must finish by its deadline $d_i$ | Strict technological order ($M_1$ must precede $M_2$) |
| **Time Complexity** | $\mathcal{O}(N \log N + N \cdot D_{\max})$ | $\mathcal{O}(N \log N)$ |
| **Space Complexity** | $\mathcal{O}(D_{\max} + N)$ | $\mathcal{O}(N)$ |
| **Nature of Idle Time** | Empty calendar days with no active order | Bottleneck waiting periods on Stage 2 awaiting Stage 1 |
| **Industrial Use Case** | Custom fabrication bidding, urgent SLA delivery | Multi-stage manufacturing, PCB assembly lines |

---

## Step-by-Step Numerical Walkthroughs

### Example 1: Greedy Job Sequencing Walkthrough

**Input Jobs:**
| Job ID | Order Name | Profit ($) | Deadline (Day) |
| :---: | :--- | :---: | :---: |
| $J_1$ | PCB Assembly Order | 100 | 2 |
| $J_2$ | Sensor Batch Alpha | 19 | 1 |
| $J_3$ | Hydraulic Valve Pack | 27 | 2 |
| $J_4$ | Gearbox Calibration | 25 | 1 |
| $J_5$ | Casting Inspection | 15 | 3 |

**Step 1: Sort by Profit Descending**
$$J_1 (100, d=2) \to J_3 (27, d=2) \to J_4 (25, d=1) \to J_2 (19, d=1) \to J_5 (15, d=3)$$
Maximum Deadline $D_{\max} = 3$. Total available slots: `[Slot 1, Slot 2, Slot 3]`.

**Step 2: Slot Allocation Trace**
1. **$J_1$ (Profit: 100, Deadline: 2)**:
   - Check Slot 2 $\to$ Empty $\to$ **Assign $J_1$ to Slot 2**.
   - Slots: `[Empty, J1, Empty]`. Cumulative Profit: **$100**.
2. **$J_3$ (Profit: 27, Deadline: 2)**:
   - Check Slot 2 $\to$ Occupied by $J_1$.
   - Check Slot 1 $\to$ Empty $\to$ **Assign $J_3$ to Slot 1**.
   - Slots: `[J3, J1, Empty]`. Cumulative Profit: **$127**.
3. **$J_4$ (Profit: 25, Deadline: 1)**:
   - Check Slot 1 $\to$ Occupied by $J_3$.
   - No earlier slots $\to$ **Rejected (Missed Deadline)**.
4. **$J_2$ (Profit: 19, Deadline: 1)**:
   - Check Slot 1 $\to$ Occupied $\to$ **Rejected (Missed Deadline)**.
5. **$J_5$ (Profit: 15, Deadline: 3)**:
   - Check Slot 3 $\to$ Empty $\to$ **Assign $J_5$ to Slot 3**.
   - Slots: `[J3, J1, J5]`. Cumulative Profit: **$142**.

**Final Result:**
- **Optimal Schedule**: Day 1: $J_3$, Day 2: $J_1$, Day 3: $J_5$.
- **Total Profit**: **$142**.
- **Accepted**: 3 jobs, **Rejected**: 2 jobs ($J_4, J_2$).

---

### Example 2: Johnson's Rule Flow Shop Walkthrough

**Input Jobs:**
| Job ID | Assembly Job Name | Time on M1 ($A_i$) | Time on M2 ($B_i$) |
| :---: | :--- | :---: | :---: |
| $J_1$ | Stamping & Polish | 3 hrs | 2 hrs |
| $J_2$ | Drilling & Paint | 12 hrs | 10 hrs |
| $J_3$ | Laser Cut & Powder | 5 hrs | 6 hrs |
| $J_4$ | CNC Mill & Thread | 2 hrs | 3 hrs |
| $J_5$ | Press & Weld | 9 hrs | 11 hrs |

**Step 1: Partitioning Sequence**
1. Global minimum among all jobs is **2** on $J_4 (M_1=2)$ and $J_1 (M_2=2)$.
   - $J_4$: Min is on $M_1 \to$ Schedule at the **front** $\to$ Position 1: `[J4, _, _, _, _]`.
   - $J_1$: Min is on $M_2 \to$ Schedule at the **rear** $\to$ Position 5: `[J4, _, _, _, J1]`.
2. Remaining: $\{J_2, J_3, J_5\}$.
   - Minimum is **5** on $J_3 (M_1=5) \to$ Min on $M_1 \to$ Schedule at next front $\to$ Position 2: `[J4, J3, _, _, J1]`.
3. Remaining: $\{J_2, J_5\}$.
   - Minimum is **9** on $J_5 (M_1=9) \to$ Min on $M_1 \to$ Schedule at next front $\to$ Position 3: `[J4, J3, J5, _, J1]`.
4. Remaining: $\{J_2\}$.
   - Assign $J_2$ to only remaining slot $\to$ Position 4: `[J4, J3, J5, J2, J1]`.

**Optimal Sequence**: **$J_4 \to J_3 \to J_5 \to J_2 \to J_1$**.

**Step 2: Timeline Generation**
| Sequence Pos | Job | M1 Start | M1 End | M2 Start | M2 End | M2 Idle Gap |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| #1 | $J_4$ | 0 | 2 | 2 | 5 | **2 hrs** (t: 0-2) |
| #2 | $J_3$ | 2 | 7 | 7 | 13 | **2 hrs** (t: 5-7) |
| #3 | $J_5$ | 7 | 16 | 16 | 27 | **3 hrs** (t: 13-16) |
| #4 | $J_2$ | 16 | 28 | 28 | 38 | **1 hr** (t: 27-28) |
| #5 | $J_1$ | 28 | 31 | 38 | 40 | **0 hrs** |

**Final Results:**
- **Total Makespan ($C_{\max}$)**: **40 Hours**.
- **Total Idle Time on Machine 2**: **8 Hours** (2h + 2h + 3h + 1h).
- **Line Efficiency**: **78.8%**.

---

## REST API Documentation

Base URL: `http://localhost:5000/api`

### 1. Health Check
- **Endpoint**: `GET /api/health`
- **Response**:
```json
{
  "status": "online",
  "system": "FactoryFlow Engine API",
  "algorithms": [
    "Greedy Job Sequencing with Deadlines",
    "Johnson's 2-Machine Flow Shop"
  ],
  "timestamp": "2026-09-20T17:08:22.117Z"
}
```

### 2. Solve Greedy Job Sequencing
- **Endpoint**: `POST /api/greedy-sequence`
- **Request Body**:
```json
{
  "jobs": [
    { "id": "J1", "name": "PCB Assembly Order", "profit": 100, "deadline": 2 },
    { "id": "J2", "name": "Sensor Batch Alpha", "profit": 19, "deadline": 1 },
    { "id": "J3", "name": "Hydraulic Valve Pack", "profit": 27, "deadline": 2 }
  ]
}
```
- **Response Structure**:
```json
{
  "success": true,
  "data": {
    "algorithm": "Greedy Strategy: Job Sequencing with Deadlines",
    "totalSlots": 2,
    "acceptedCount": 2,
    "rejectedCount": 1,
    "idleSlotCount": 0,
    "totalProfit": 127,
    "schedule": [
      {
        "slotNumber": 1,
        "timeWindow": "Day 1 (T: 0 - 1)",
        "isIdle": false,
        "job": { "id": "J3", "name": "Hydraulic Valve Pack", "profit": 27, "deadline": 2 }
      },
      {
        "slotNumber": 2,
        "timeWindow": "Day 2 (T: 1 - 2)",
        "isIdle": false,
        "job": { "id": "J1", "name": "PCB Assembly Order", "profit": 100, "deadline": 2 }
      }
    ],
    "stepTrace": [ ... ],
    "complexity": { "time": "O(N log N + N * D_max)", "space": "O(D_max + N)" }
  }
}
```

### 3. Solve Flow Shop Scheduling
- **Endpoint**: `POST /api/flow-shop`
- **Request Body**:
```json
{
  "jobs": [
    { "id": "J1", "name": "Stamping & Polish", "timeM1": 3, "timeM2": 2 },
    { "id": "J2", "name": "Drilling & Paint", "timeM1": 12, "timeM2": 10 },
    { "id": "J3", "name": "Laser Cut & Powder", "timeM1": 5, "timeM2": 6 }
  ]
}
```
- **Response Structure**:
```json
{
  "success": true,
  "data": {
    "algorithm": "Flow Shop Scheduling: Johnson's Rule (2 Machines)",
    "jobCount": 3,
    "optimalSequence": [ ... ],
    "machine1Timeline": [ ... ],
    "machine2Timeline": [ ... ],
    "totalMakespan": 23,
    "totalIdleTimeM2": 3,
    "efficiencyPercent": 84.8,
    "stepTrace": [ ... ]
  }
}
```

---

## Installation & Quick Start

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)

### 1. Install All Dependencies
From the root workspace directory, run:
```bash
npm run install:all
```
*(Or install root dependencies with `npm install`, then client & server).*

### 2. Run Both Backend & Frontend Concurrently
Start both the Express API and Vite React client with one command:
```bash
npm run dev
```

### 3. Access the Web Dashboard
- Frontend: [http://localhost:5173/](http://localhost:5173/)
- Backend API: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### 4. Running Backend or Frontend Individually
- **Run Backend only**:
  ```bash
  npm run server
  # Or with automatic file watcher:
  npm run server:dev
  ```
- **Run Frontend only**:
  ```bash
  npm run client
  ```
- **Run Algorithm Verification Tests**:
  ```bash
  npm run test:server
  ```

---

## Project File Structure

```
d:\AoA project\
├── package.json                   # Root orchestrator (concurrently, test scripts)
├── README.md                      # Comprehensive algorithmic guide & documentation
│
├── server/                        # Express Backend (Port 5000)
│   ├── package.json
│   ├── test_algorithms.js         # Automated test suite for academic benchmark verification
│   └── src/
│       ├── index.js               # Express application entry, CORS, JSON parsing
│       ├── routes/
│       │   └── schedulerRoutes.js # /api/greedy-sequence & /api/flow-shop endpoints
│       └── algorithms/
│           ├── greedySequencing.js # Pure native Greedy Job Sequencing engine
│           └── johnsonFlowShop.js  # Pure native Johnson's Rule Flow Shop engine
│
└── client/                        # React + Vite Frontend (Port 5173)
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx                # Tab navigation (Urgent Orders & Assembly Line)
        ├── index.css              # Industrial CSS tokens & layer architecture
        ├── api/
        │   └── schedulerApi.js    # Client-side API integration & health verification
        ├── data/
        │   └── sampleData.js      # Realistic factory production scenarios & benchmarks
        └── components/
            ├── Header.jsx         # FactoryFlow navigation header & API status pill
            ├── MetricCard.jsx     # Reusable KPI counter with industrial color tokens
            ├── greedy/
            │   ├── GreedyView.jsx       # Urgent orders container
            │   ├── JobForm.jsx          # Input form with validation
            │   ├── JobQueueTable.jsx    # Candidate order pool table
            │   ├── GanttChart.jsx       # Visual Day 1..N slots (with IDLE blocks)
            │   └── GreedyStepTrace.jsx  # Step-by-step selection decision trace
            └── flowshop/
                ├── FlowShopView.jsx     # Assembly line container
                ├── FlowShopForm.jsx     # 2-Machine multi-stage input form
                ├── FlowShopTable.jsx    # Pipeline operations queue table
                ├── DualTimelineChart.jsx# Dual-Machine synchronized timeline with idle gaps
                └── JohnsonStepTrace.jsx # Johnson's partition step-by-step trace
```

---

## Academic Integrity & Standards Notice
All algorithms in this project are authored from scratch without external linear programming, constraint programming, or heuristic solver packages. The sorting and partition algorithms directly represent the textbook definitions of the Greedy Strategy and Johnson's Rule for discrete production optimization.

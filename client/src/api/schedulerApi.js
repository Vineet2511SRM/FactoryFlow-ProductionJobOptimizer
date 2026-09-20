/**
 * API client to communicate with FactoryFlow Express Backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Health check to verify backend server is reachable
 */
export async function checkServerHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend server not reachable:', err.message);
    return null;
  }
}

/**
 * Request Greedy Job Sequencing with Deadlines
 * @param {Array} jobs - [{ id, name, profit, deadline }]
 */
export async function runGreedySequencing(jobs) {
  const response = await fetch(`${API_BASE_URL}/greedy-sequence`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ jobs })
  });

  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.error || `Server responded with status ${response.status}`);
  }

  return json.data;
}

/**
 * Request Johnson's Rule Flow Shop Sequencing
 * @param {Array} jobs - [{ id, name, timeM1, timeM2 }]
 */
export async function runFlowShopScheduling(jobs) {
  const response = await fetch(`${API_BASE_URL}/flow-shop`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ jobs })
  });

  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.error || `Server responded with status ${response.status}`);
  }

  return json.data;
}

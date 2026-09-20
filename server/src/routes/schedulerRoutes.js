import { Router } from 'express';
import { solveGreedySequencing } from '../algorithms/greedySequencing.js';
import { solveFlowShop } from '../algorithms/johnsonFlowShop.js';

const router = Router();

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'FactoryFlow Engine API',
    algorithms: ['Greedy Job Sequencing with Deadlines', "Johnson's 2-Machine Flow Shop"],
    timestamp: new Date().toISOString()
  });
});

/**
 * POST /api/greedy-sequence
 * Body: { jobs: [{ id, name, profit, deadline }] }
 */
router.post('/greedy-sequence', (req, res) => {
  try {
    const { jobs } = req.body;

    if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payload: "jobs" array is required and must not be empty.'
      });
    }

    const result = solveGreedySequencing(jobs);
    return res.json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message || 'Error executing Greedy Job Sequencing algorithm.'
    });
  }
});

/**
 * POST /api/flow-shop
 * Body: { jobs: [{ id, name, timeM1, timeM2 }] }
 */
router.post('/flow-shop', (req, res) => {
  try {
    const { jobs } = req.body;

    if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payload: "jobs" array is required and must not be empty.'
      });
    }

    const result = solveFlowShop(jobs);
    return res.json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message || 'Error executing Flow Shop Johnson Rule algorithm.'
    });
  }
});

export default router;

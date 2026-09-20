import express from 'express';
import cors from 'cors';
import schedulerRoutes from './routes/schedulerRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all frontend origins (development & production)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON request bodies
app.use(express.json());

// Mount scheduler API routes
app.use('/api', schedulerRoutes);

// Root informative endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'FactoryFlow: Production Job Sequencing Optimizer API',
    status: 'Running',
    endpoints: {
      health: 'GET /api/health',
      greedySequence: 'POST /api/greedy-sequence',
      flowShop: 'POST /api/flow-shop'
    }
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  FactoryFlow Engine Server active on port ${PORT}  `);
  console.log(`  REST API ready at http://localhost:${PORT}/api     `);
  console.log(`====================================================`);
});

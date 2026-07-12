const app = require('./src/app');
const connectDB = require('./src/config/db');
const env = require('./src/config/env');

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  // Start Express
  app.listen(env.PORT, () => {
    console.log(`\n🚀  AssetFlow API running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    console.log(`   Health: http://localhost:${env.PORT}/api/v1/health\n`);
  });
};

startServer();

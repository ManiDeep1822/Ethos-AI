const mongoose = require('mongoose');
const seedDemoUser = require('./seed');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai_comm_trainer';
  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedDemoUser();
  } catch (error) {
    console.warn(`Primary MongoDB connection failed (${error.message}). Attempting local fallback...`);
    try {
      const fallbackConn = await mongoose.connect('mongodb://127.0.0.1:27017/ai_comm_trainer');
      console.log(`MongoDB Connected (Local Fallback): ${fallbackConn.connection.host}`);
      await seedDemoUser();
    } catch (fallbackError) {
      console.error(`❌ [MongoDB Fatal]: ${fallbackError.message}`);
      console.warn('⚠️ [Render Guidance]: Ensure MONGO_URI is configured in Render Environment Variables and MongoDB Atlas Network Access permits connections (allow 0.0.0.0/0).');
      console.warn('⚠️ [Server Status]: Web server remains operational for health checks, but DB operations will fail until MONGO_URI is verified.');
    }
  }
};

module.exports = connectDB;

const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('\n❌ DEPLOYMENT ERROR: MONGODB_URI is undefined!');
    console.error('👉 You MUST add the "MONGODB_URI" environment variable in your Render / Vercel dashboard settings.');
    console.error('👉 In the Render dashboard, go to Settings -> Environment -> Add Environment Variable -> MONGODB_URI = <your_mongodb_atlas_connection_string>\n');
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

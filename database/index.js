import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URL; 

const connection = { isConnected: false };

const connectToDb = async () => {

  if (connection.isConnected) {
    // Use existing database connection
    return;
  }
  try {
    const db = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    connection.isConnected = db.connections[0].readyState === 1 || db.connections[0].readyState === 2;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error(`Error connecting to database: ${error}`);
   
  }
  mongoose.connection.on('disconnected', () => {
    console.log('Lost MongoDB connection...');
    connection.isConnected = false;
  });
  
  mongoose.connection.on('reconnected', () => {
    console.log('Reconnected to MongoDB');
    connection.isConnected = true;
  });
};

export default connectToDb;

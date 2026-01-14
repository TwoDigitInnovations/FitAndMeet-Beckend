const mongoose = require('mongoose');
require('dotenv').config();

async function fixConversationIndex() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/devlopement');
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('conversations');

    // Get existing indexes
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes);

    // Drop the problematic participants_1 index
    try {
      await collection.dropIndex('participants_1');
      console.log('Successfully dropped participants_1 index');
    } catch (error) {
      console.log('Index might not exist or already dropped:', error.message);
    }

    console.log('Index fix completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing index:', error);
    process.exit(1);
  }
}

fixConversationIndex();

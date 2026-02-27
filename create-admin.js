const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./src/models/User');

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dating-app');
    
    console.log('Connected to MongoDB');

    const adminPhone = '1234567890';
    
    let admin = await User.findOne({ phoneNumber: adminPhone });
    
    if (admin) {
      admin.isAdmin = true;
      admin.isPhoneVerified = true;
      admin.profileCompleted = true;
      admin.currentStep = 11;
      await admin.save();
      console.log('✅ Existing user updated to admin');
    } else {
      admin = new User({
        phoneNumber: adminPhone,
        countryCode: '+91',
        isAdmin: true,
        isPhoneVerified: true,
        profileCompleted: true,
        currentStep: 11,
      });
      await admin.save();
      console.log('✅ New admin user created');
    }

    console.log('Admin Details:');
    console.log('Phone: +91-1234567890');
    console.log('OTP: 1807');
    console.log('User ID:', admin._id);

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdminUser();

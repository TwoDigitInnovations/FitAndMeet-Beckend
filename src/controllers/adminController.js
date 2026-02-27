const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ 
      isDeleted: { $ne: true },
      profileCompleted: true,
      $or: [
        { isAdmin: false },
        { isAdmin: { $exists: false } }
      ]
    })
    .select('firstName phoneNumber age gender gymName photos createdAt profileCompleted')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users,
      count: users.length
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch users', 
      error: error.message 
    });
  }
};

exports.softDeleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        isDeleted: true,
        deletedAt: new Date()
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      user
    });
  } catch (error) {
    console.error('Soft delete user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete user', 
      error: error.message 
    });
  }
};

exports.getDeletedUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: true })
    .select('firstName phoneNumber age gender gymName photos deletedAt')
    .sort({ deletedAt: -1 });

    res.status(200).json({
      success: true,
      users,
      count: users.length
    });
  } catch (error) {
    console.error('Get deleted users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch deleted users', 
      error: error.message 
    });
  }
};

exports.restoreUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        isDeleted: false,
        deletedAt: null
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'User restored successfully',
      user
    });
  } catch (error) {
    console.error('Restore user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to restore user', 
      error: error.message 
    });
  }
};

exports.permanentDeleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'User permanently deleted'
    });
  } catch (error) {
    console.error('Permanent delete user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to permanently delete user', 
      error: error.message 
    });
  }
};

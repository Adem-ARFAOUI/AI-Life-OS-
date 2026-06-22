const User = require("../models/User");

const getProfile = async (req, res) => {
  const user = await User.findById(req.user).select("-password");

  res.json({
    success: true,
    user,
  });
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    Object.assign(user, req.body);
    await user.save();
    res.json({
      success: true,
      message: "Profile updated",
      user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};

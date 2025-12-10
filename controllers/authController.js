const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'your-secret-key-change-this', {
    expiresIn: '30d'
  });
};

// @desc    Register user
// @route   POST /api/auth/signup
exports.signup = async (req, res) => {
  console.log('Signup request received');
  try {
    const { email, password, userType, name, companyName } = req.body;

    // Validation
    if (!email || !password || !userType || !name) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields'
      });
    }

    console.log('Validation passed');

    // Check if user exists
    const existingUser = await User.findOne({ email });
    console.log('Existing user:', existingUser);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email'
      });
    }

    console.log('User does not exist');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const userData = {
      email,
      password: hashedPassword,
      userType,
      name
    };

    if (userType === 'startup' && companyName) {
      userData.companyName = companyName;
    }

    console.log('Creating user...');

    const user = await User.create(userData);

    console.log('User created:', user);

    // Generate token
    const token = generateToken(user._id);

    console.log('User created:11', user);

    res.status(201).json({
      success: true,
      token,
      userType: user.userType,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        userType: user.userType,
        plan: user.plan,
        companyName: user.companyName,
        profileViewsRemaining: user.profileViewsRemaining,
        bio: user.bio,
        followersCount: user.followersCount,
        category: user.category,
        applicationsRemaining: user.applicationsRemaining
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  console.log('Login request received');
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      });
    }

    // Check user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      userType: user.userType,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        userType: user.userType,
        plan: user.plan,
        companyName: user.companyName,
        profileViewsRemaining: user.profileViewsRemaining,
        bio: user.bio,
        followersCount: user.followersCount,
        category: user.category,
        applicationsRemaining: user.applicationsRemaining
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      userType: user.userType,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        userType: user.userType,
        plan: user.plan,
        companyName: user.companyName,
        profileViewsRemaining: user.profileViewsRemaining,
        bio: user.bio,
        followersCount: user.followersCount,
        category: user.category,
        applicationsRemaining: user.applicationsRemaining,
        instagramUsername: user.instagramUsername,
        instagramEmbedLinks: user.instagramEmbedLinks,
        linkedinEmbedLinks: user.linkedinEmbedLinks
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


/**
 * Elevana / MindCareAI Backend Server
 * 
 * Provides:
 * - MongoDB Connection via Mongoose (reading MONGODB_URI from .env)
 * - User Signup & Login (Authentication)
 * - User-Isolated Chat History & Storage
 * - Health Check & Diagnostics
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5003;
const JWT_SECRET = process.env.JWT_SECRET || 'elevana_secure_jwt_secret_key_2026';
const MONGODB_URI = process.env.MONGODB_URI;

// ==========================================
// 1. MIDDLEWARE SETUP
// ==========================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for development
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ==========================================
// 2. MONGODB CONNECTION
// ==========================================
if (!MONGODB_URI) {
  console.error('❌ [MongoDB Error]: MONGODB_URI is not defined in the .env file!');
} else {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log('✅ [MongoDB Connected]: Successfully connected to MongoDB Atlas database.');
    })
    .catch((err) => {
      console.error('❌ [MongoDB Error]: Connection failed:', err.message);
    });
}

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ [MongoDB Disconnected]: Lost connection to MongoDB.');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 [MongoDB Reconnected]: Reconnected to MongoDB.');
});

// ==========================================
// 3. DATABASE SCHEMAS & MODELS
// ==========================================

// User Schema (for Sign up, Login, & Profile)
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    preferredLanguage: {
      type: String,
      default: 'en',
    },
    emergencyContact: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
      relationship: { type: String, default: '' },
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password helper method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', UserSchema);

// Chat / Message Schema (Per-user private AI chat storage)
const ChatMessageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sender: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: 'Default - General Trauma & Crisis Support',
    },
    language: {
      type: String,
      default: 'English',
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema);

// DASS-21 Response Schema
const Dass21ResponseSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
      lowercase: true,
    },
    responses: {
      type: [Number], // Array of 21 integers (0-3)
      required: true,
      validate: [v => v.length === 21, 'DASS-21 requires exactly 21 responses']
    },
    scores: {
      depression: { type: Number, required: true },
      anxiety: { type: Number, required: true },
      stress: { type: Number, required: true },
    }
  },
  {
    timestamps: true,
  }
);

const Dass21Response = mongoose.model('Dass21Response', Dass21ResponseSchema);

// ==========================================
// 4. AUTHENTICATION MIDDLEWARE
// ==========================================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Invalid or expired token' });
    }
    req.user = decodedUser;
    next();
  });
};

// ==========================================
// 5. API ROUTES
// ==========================================

// Health Check Endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'Elevana MindCareAI API Server',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  const dbStatus = ['disconnected', 'connected', 'connecting', 'disconnecting'][
    mongoose.connection.readyState
  ] || 'unknown';

  res.json({
    success: true,
    server: 'healthy',
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// --- AUTH ROUTES ---

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user and store in MongoDB
 */
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, preferredLanguage } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, email, and password',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'An account with this email already exists',
      });
    }

    // Create user
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password,
      preferredLanguage: preferredLanguage || 'en',
    });

    await newUser.save();

    // Generate JWT Token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        preferredLanguage: newUser.preferredLanguage,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error('Error in /api/auth/signup:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error during signup',
    });
  }
});

/**
 * @route   POST /api/auth/admin-signup
 * @desc    Register a new admin (Requires secret code)
 */
app.post('/api/auth/admin-signup', async (req, res) => {
  try {
    const { name, email, password, adminCode } = req.body;

    if (!name || !email || !password || !adminCode) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, email, password, and adminCode',
      });
    }

    // Hardcoded secret for hackathon purposes (in real world use env var)
    if (adminCode !== 'ELEVANA_ADMIN_2026') {
      return res.status(403).json({
        success: false,
        error: 'Invalid admin code',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'An account with this email already exists',
      });
    }

    const newAdmin = new User({
      name,
      email: email.toLowerCase(),
      password,
      role: 'admin',
    });

    await newAdmin.save();

    const token = jwt.sign(
      { id: newAdmin._id, email: newAdmin.email, name: newAdmin.name, role: newAdmin.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      token,
      user: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        createdAt: newAdmin.createdAt,
      },
    });
  } catch (error) {
    console.error('Error in /api/auth/admin-signup:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error during admin signup',
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & return JWT token
 */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    // Check if user has already completed DASS-21
    const dassResponse = await Dass21Response.findOne({ email: user.email });
    const hasCompletedDass = !!dassResponse;

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      hasCompletedDass,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferredLanguage: user.preferredLanguage,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Error in /api/auth/login:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error during login',
    });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile (Protected)
 */
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve user profile' });
  }
});

// --- CHAT ROUTES (User-Isolated Chat History) ---

/**
 * @route   POST /api/chats
 * @desc    Save a new chat message for a user
 */
app.post('/api/chats', authenticateToken, async (req, res) => {
  try {
    const { text, sender, category, language, metadata } = req.body;
    const userId = req.user.id;

    if (!text || !sender) {
      return res.status(400).json({
        success: false,
        error: 'Message text and sender (user/assistant) are required',
      });
    }

    const message = new ChatMessage({
      userId,
      sender,
      text,
      category: category || 'Default - General Trauma & Crisis Support',
      language: language || 'English',
      metadata: metadata || {},
    });

    await message.save();

    res.status(201).json({
      success: true,
      message: 'Message saved successfully',
      chat: message,
    });
  } catch (error) {
    console.error('Error saving chat message:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to save chat message',
    });
  }
});

/**
 * @route   GET /api/chats
 * @desc    Get all chat messages strictly for the authenticated user
 */
app.get('/api/chats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { category, limit = 100, skip = 0 } = req.query;

    const query = { userId };
    if (category) {
      query.category = category;
    }

    const messages = await ChatMessage.find(query)
      .sort({ createdAt: 1 })
      .skip(Number(skip))
      .limit(Number(limit));

    res.json({
      success: true,
      count: messages.length,
      chats: messages,
    });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch chat history',
    });
  }
});

/**
 * @route   DELETE /api/chats
 * @desc    Clear chat history for authenticated user
 */
app.delete('/api/chats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { category } = req.query;

    const filter = { userId };
    if (category) {
      filter.category = category;
    }

    const result = await ChatMessage.deleteMany(filter);

    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} chat messages`,
    });
  } catch (error) {
    console.error('Error deleting chat history:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete chat history',
    });
  }
});

// --- DASS-21 ASSESSMENT ROUTES ---

/**
 * @route   POST /api/dass21
 * @desc    Save a DASS-21 assessment result for a user
 */
app.post('/api/dass21', authenticateToken, async (req, res) => {
  try {
    const { responses, scores } = req.body;
    const email = req.user.email; // From JWT

    if (!responses || responses.length !== 21 || !scores) {
      return res.status(400).json({
        success: false,
        error: 'Invalid assessment data format. Require 21 responses and scores.',
      });
    }

    const assessment = new Dass21Response({
      email,
      responses,
      scores,
    });

    await assessment.save();

    res.status(201).json({
      success: true,
      message: 'Assessment saved successfully',
      assessment,
    });
  } catch (error) {
    console.error('Error saving DASS-21 response:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to save DASS-21 assessment',
    });
  }
});

// ==========================================
// 6. 404 & GLOBAL ERROR HANDLING
// ==========================================
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ==========================================
// 7. START SERVER & GRACEFUL SHUTDOWN
// ==========================================
const server = app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 Elevana MindCareAI Server running on port ${PORT}`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`==================================================\n`);
});

const gracefulShutdown = async () => {
  console.log('\n🛑 Shutting down server gracefully...');
  server.close(async () => {
    try {
      await mongoose.connection.close();
      console.log('🔒 MongoDB connection closed.');
      process.exit(0);
    } catch (err) {
      console.error('Error closing MongoDB connection:', err);
      process.exit(1);
    }
  });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

module.exports = app;

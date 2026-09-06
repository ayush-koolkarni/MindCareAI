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
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
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
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferredLanguage: user.preferredLanguage,
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

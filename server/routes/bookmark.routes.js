const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'forgeai-admin-secret-change-me';

// Inline middleware to check if user is admin
function requireAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1] || authHeader;
    if (!token) {
      return res.status(401).json({ error: 'Access denied. Invalid authorization format.' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Failed to authenticate token.' });
      }
      
      // Ensure the decoded payload matches admin expectations
      if (decoded && (decoded.isAdmin || decoded.role === 'admin')) {
        req.user = decoded;
        return next();
      } else {
        return res.status(403).json({ error: 'Access denied. Admin role required.' });
      }
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/bookmarks - PUBLIC (list all bookmarks or filter by userId)
router.get('/', async (req, res, next) => {
  try {
    const { userId } = req.query;
    const filter = {};
    if (userId) {
      filter.userId = userId;
    }
    const bookmarks = await Bookmark.find(filter).sort({ createdAt: -1 });
    res.json(bookmarks);
  } catch (err) {
    next(err);
  }
});

// GET /api/bookmarks/:id - PUBLIC
router.get('/:id', async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }
    res.json(bookmark);
  } catch (err) {
    next(err);
  }
});

// POST /api/bookmarks - PUBLIC (anyone can create bookmarks or register readings)
router.post('/', async (req, res, next) => {
  try {
    const { userId, surahNumber, ayahNumber, note } = req.body;

    // Simple validation
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    if (surahNumber === undefined || surahNumber === null) {
      return res.status(400).json({ error: 'surahNumber is required' });
    }
    if (ayahNumber === undefined || ayahNumber === null) {
      return res.status(400).json({ error: 'ayahNumber is required' });
    }

    const newBookmark = new Bookmark({
      userId,
      surahNumber: Number(surahNumber),
      ayahNumber: Number(ayahNumber),
      note: note || '',
      createdAt: new Date()
    });

    const savedBookmark = await newBookmark.save();
    res.status(201).json(savedBookmark);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

// PUT /api/bookmarks/:id - Require Admin Only
router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const { userId, surahNumber, ayahNumber, note } = req.body;
    
    const bookmark = await Bookmark.findById(req.params.id);
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    if (userId !== undefined) bookmark.userId = userId;
    if (surahNumber !== undefined) bookmark.surahNumber = Number(surahNumber);
    if (ayahNumber !== undefined) bookmark.ayahNumber = Number(ayahNumber);
    if (note !== undefined) bookmark.note = note;

    const updatedBookmark = await bookmark.save();
    res.json(updatedBookmark);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

// DELETE /api/bookmarks/:id - Require Admin Only
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const deletedBookmark = await Bookmark.findByIdAndDelete(req.params.id);
    if (!deletedBookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }
    res.json({ message: 'Bookmark deleted successfully', id: req.params.id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
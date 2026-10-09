const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Surah = require('../models/Surah');

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'forgeai-admin-secret-change-me';

function requireAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: missing token' });
    }
    const decoded = jwt.verify(token, ADMIN_JWT_SECRET);
    if (!decoded || decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: admin access required' });
    }
    req.admin = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized: invalid or expired token' });
  }
}

// GET / → list all surahs (public)
router.get('/', async (req, res, next) => {
  try {
    const surahs = await Surah.find().sort({ number: 1 });
    res.json(surahs);
  } catch (e) {
    next(e);
  }
});

// GET /:id → get single surah (public)
router.get('/:id', async (req, res, next) => {
  try {
    const surah = await Surah.findById(req.params.id);
    if (!surah) {
      return res.status(404).json({ error: 'Surah not found' });
    }
    res.json(surah);
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(404).json({ error: 'Surah not found' });
    }
    next(e);
  }
});

// POST / → create surah (public)
router.post('/', async (req, res, next) => {
  try {
    const { number, nameArabic, nameEnglish, ayahCount, revelationType } = req.body;

    if (!nameArabic || !nameEnglish) {
      return res.status(400).json({ error: 'nameArabic and nameEnglish are required' });
    }
    if (number === undefined || number === null || isNaN(Number(number))) {
      return res.status(400).json({ error: 'number is required and must be numeric' });
    }

    const surah = new Surah({
      number,
      nameArabic,
      nameEnglish,
      ayahCount,
      revelationType
    });

    const saved = await surah.save();
    res.status(201).json(saved);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return res.status(400).json({ error: e.message });
    }
    next(e);
  }
});

// PUT /:id → update surah (admin only)
router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const { number, nameArabic, nameEnglish, ayahCount, revelationType } = req.body;

    const updateData = {};
    if (number !== undefined) updateData.number = number;
    if (nameArabic !== undefined) updateData.nameArabic = nameArabic;
    if (nameEnglish !== undefined) updateData.nameEnglish = nameEnglish;
    if (ayahCount !== undefined) updateData.ayahCount = ayahCount;
    if (revelationType !== undefined) updateData.revelationType = revelationType;

    const updated = await Surah.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Surah not found' });
    }

    res.json(updated);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return res.status(400).json({ error: e.message });
    }
    if (e.name === 'CastError') {
      return res.status(404).json({ error: 'Surah not found' });
    }
    next(e);
  }
});

// DELETE /:id → delete surah (admin only)
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const deleted = await Surah.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Surah not found' });
    }
    res.json({ message: 'Surah deleted successfully', surah: deleted });
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(404).json({ error: 'Surah not found' });
    }
    next(e);
  }
});

module.exports = router;
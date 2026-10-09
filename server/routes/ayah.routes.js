const express = require('express');
const router = express.Router();
const Ayah = require('../models/Ayah');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'forgeai-admin-secret-change-me';

// Inline admin middleware
const requireAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Access denied. Malformed token.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden. Admin privileges required.' });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired authorization token.' });
  }
};

// GET / - List all ayahs, support filtering by surahNumber
router.get('/', async (req, res, next) => {
  try {
    const { surahNumber, limit, skip } = req.query;
    const filter = {};
    
    if (surahNumber !== undefined) {
      filter.surahNumber = Number(surahNumber);
    }

    const queryLimit = limit ? parseInt(limit, 10) : 300; // default large limit to fit a surah's verses
    const querySkip = skip ? parseInt(skip, 10) : 0;

    const ayahs = await Ayah.find(filter)
      .sort({ surahNumber: 1, ayahNumber: 1 })
      .skip(querySkip)
      .limit(queryLimit);

    res.json(ayahs);
  } catch (err) {
    next(err);
  }
});

// GET /:id - Retrieve single Ayah
router.get('/:id', async (req, res, next) => {
  try {
    const ayah = await Ayah.findById(req.params.id);
    if (!ayah) {
      return res.status(404).json({ error: 'Ayah not found' });
    }
    res.json(ayah);
  } catch (err) {
    next(err);
  }
});

// POST / - Publicly create a new Ayah (e.g. initial setup, custom reflections, admin populate tool)
router.post('/', async (req, res, next) => {
  try {
    const { surahNumber, ayahNumber, textArabic, translationEnglish, transliteration, audioUrl } = req.body;

    if (!surahNumber || !ayahNumber || !textArabic || !translationEnglish) {
      return res.status(400).json({ error: 'Missing required fields: surahNumber, ayahNumber, textArabic, translationEnglish' });
    }

    const newAyah = new Ayah({
      surahNumber: Number(surahNumber),
      ayahNumber: Number(ayahNumber),
      textArabic,
      translationEnglish,
      transliteration: transliteration || '',
      audioUrl: audioUrl || ''
    });

    const savedAyah = await newAyah.save();
    res.status(201).json(savedAyah);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

// PUT /:id - Admin only update of an Ayah
router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const { surahNumber, ayahNumber, textArabic, translationEnglish, transliteration, audioUrl } = req.body;

    const updatedData = {};
    if (surahNumber !== undefined) updatedData.surahNumber = Number(surahNumber);
    if (ayahNumber !== undefined) updatedData.ayahNumber = Number(ayahNumber);
    if (textArabic !== undefined) updatedData.textArabic = textArabic;
    if (translationEnglish !== undefined) updatedData.translationEnglish = translationEnglish;
    if (transliteration !== undefined) updatedData.transliteration = transliteration;
    if (audioUrl !== undefined) updatedData.audioUrl = audioUrl;

    const updatedAyah = await Ayah.findByIdAndUpdate(
      req.params.id,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!updatedAyah) {
      return res.status(404).json({ error: 'Ayah not found to update' });
    }

    res.json(updatedAyah);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

// DELETE /:id - Admin only delete of an Ayah
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const deletedAyah = await Ayah.findByIdAndDelete(req.params.id);
    if (!deletedAyah) {
      return res.status(404).json({ error: 'Ayah not found to delete' });
    }
    res.json({ message: 'Ayah deleted successfully', id: deletedAyah._id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
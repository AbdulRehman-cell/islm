const mongoose = require('mongoose');

const ayahSchema = new mongoose.Schema(
  {
    surahNumber: {
      type: Number,
      required: true,
      index: true
    },
    ayahNumber: {
      type: Number,
      required: true,
      index: true
    },
    textArabic: {
      type: String,
      required: true,
      trim: true
    },
    translationEnglish: {
      type: String,
      required: true,
      trim: true
    },
    transliteration: {
      type: String,
      trim: true,
      default: ''
    },
    audioUrl: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Ensure unique compound index so we don't have duplicate ayahs for the same surah
ayahSchema.index({ surahNumber: 1, ayahNumber: 1 }, { unique: true });

module.exports = mongoose.model('Ayah', ayahSchema);
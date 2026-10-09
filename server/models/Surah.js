const mongoose = require('mongoose');

const surahSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
      max: 114
    },
    nameArabic: {
      type: String,
      required: true,
      trim: true
    },
    nameEnglish: {
      type: String,
      required: true,
      trim: true
    },
    ayahCount: {
      type: Number,
      required: true,
      min: 1
    },
    revelationType: {
      type: String,
      required: true,
      enum: ['Meccan', 'Medinan', 'meccan', 'medinan'],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Surah', surahSchema);
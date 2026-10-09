const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'User identifier is required'],
      default: 'guest-user',
      trim: true,
      index: true
    },
    surahNumber: {
      type: Number,
      required: [true, 'Surah number is required'],
      min: [1, 'Surah number must be at least 1'],
      max: [114, 'Surah number cannot exceed 114']
    },
    ayahNumber: {
      type: Number,
      required: [true, 'Ayah number is required'],
      min: [1, 'Ayah number must be at least 1']
    },
    note: {
      type: String,
      trim: true,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Compound index to quickly look up or prevent duplicate bookmarks for the same verse by a single user
bookmarkSchema.index({ userId: 1, surahNumber: 1, ayahNumber: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
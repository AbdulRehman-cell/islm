const mongoose = require('mongoose');

// Require models locally from the server directory
const Surah = require('./models/Surah');
const Ayah = require('./models/Ayah');
const Bookmark = require('./models/Bookmark');

// Seed logic designed to run within the active server connection lifecycle
async function seedDatabase() {
  try {
    console.log('Checking database collections for seeding...');

    // 1. Seed Surahs if empty
    const surahCount = await Surah.countDocuments();
    if (surahCount === 0) {
      console.log('Seeding Surahs...');
      const surahsToSeed = [
        {
          number: 1,
          nameArabic: "الفاتحة",
          nameEnglish: "Al-Fatihah",
          ayahCount: 7,
          revelationType: "Meccan"
        },
        {
          number: 2,
          nameArabic: "البقرة",
          nameEnglish: "Al-Baqarah",
          ayahCount: 286,
          revelationType: "Medinan"
        },
        {
          number: 18,
          nameArabic: "الكهف",
          nameEnglish: "Al-Kahf",
          ayahCount: 110,
          revelationType: "Meccan"
        },
        {
          number: 36,
          nameArabic: "يس",
          nameEnglish: "Yaseen",
          ayahCount: 83,
          revelationType: "Meccan"
        },
        {
          number: 55,
          nameArabic: "الرحمن",
          nameEnglish: "Ar-Rahman",
          ayahCount: 78,
          revelationType: "Medinan"
        },
        {
          number: 67,
          nameArabic: "الملك",
          nameEnglish: "Al-Mulk",
          ayahCount: 30,
          revelationType: "Meccan"
        }
      ];
      await Surah.insertMany(surahsToSeed);
      console.log(`Successfully seeded ${surahsToSeed.length} Surahs.`);
    } else {
      console.log('Surahs collection is already seeded.');
    }

    // 2. Seed Ayahs if empty
    const ayahCount = await Ayah.countDocuments();
    if (ayahCount === 0) {
      console.log('Seeding sample Ayahs...');
      const ayahsToSeed = [
        // Al-Fatihah Ayahs
        {
          surahNumber: 1,
          ayahNumber: 1,
          textArabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
          translationEnglish: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
          transliteration: "Bismillaahir Rahmaanir Raheem",
          audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_afaasee/001.mp3"
        },
        {
          surahNumber: 1,
          ayahNumber: 2,
          textArabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
          translationEnglish: "[All] praise is [due] to Allah, Lord of the worlds -",
          transliteration: "Alhamdu lillaahi Rabbil 'aalameen",
          audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_afaasee/001.mp3"
        },
        {
          surahNumber: 1,
          ayahNumber: 3,
          textArabic: "الرَّحْمَٰنِ الرَّحِيمِ",
          translationEnglish: "The Entirely Merciful, the Especially Merciful,",
          transliteration: "Ar-Rahmaanir Raheem",
          audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_afaasee/001.mp3"
        },
        {
          surahNumber: 1,
          ayahNumber: 4,
          textArabic: "مَالِكِ يَوْمِ الدِّينِ",
          translationEnglish: "Sovereign of the Day of Recompense.",
          transliteration: "Maaliki Yawmid Deen",
          audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_afaasee/001.mp3"
        },
        {
          surahNumber: 1,
          ayahNumber: 5,
          textArabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
          translationEnglish: "It is You we worship and You we ask for help.",
          transliteration: "Iyyaaka na'budu wa iyyaaka nasta'een",
          audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_afaasee/001.mp3"
        },
        // Al-Baqarah Ayahs (Selected Samples)
        {
          surahNumber: 2,
          ayahNumber: 1,
          textArabic: "الم",
          translationEnglish: "Alif, Lam, Meem.",
          transliteration: "Alif-Laam-Meem",
          audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_afaasee/002.mp3"
        },
        {
          surahNumber: 2,
          ayahNumber: 2,
          textArabic: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ",
          translationEnglish: "This is the Book about which there is no doubt, a guidance for those conscious of Allah -",
          transliteration: "Zaalikal Kitaabu laa rayba feeh; hudal lilmuttaqeen",
          audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_afaasee/002.mp3"
        },
        // Al-Mulk Ayahs (Selected Samples)
        {
          surahNumber: 67,
          ayahNumber: 1,
          textArabic: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
          translationEnglish: "Blessed is He in whose hand is dominion, and He is over all things competent -",
          transliteration: "Tabaarakal lazee biyadihil mulku wa huwa 'alaa kulli shai'in Qadeer",
          audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_afaasee/067.mp3"
        }
      ];
      await Ayah.insertMany(ayahsToSeed);
      console.log(`Successfully seeded ${ayahsToSeed.length} Ayahs.`);
    } else {
      console.log('Ayahs collection is already seeded.');
    }

    // 3. Seed sample Bookmarks if empty
    const bookmarkCount = await Bookmark.countDocuments();
    if (bookmarkCount === 0) {
      console.log('Seeding sample Bookmarks...');
      const bookmarksToSeed = [
        {
          userId: "guest-user",
          surahNumber: 1,
          ayahNumber: 1,
          note: "Beautiful opening to start every study session with mindfulness."
        },
        {
          userId: "guest-user",
          surahNumber: 2,
          ayahNumber: 2,
          note: "A fundamental reminder of certainty and divine guidance."
        }
      ];
      await Bookmark.insertMany(bookmarksToSeed);
      console.log(`Successfully seeded ${bookmarksToSeed.length} Bookmarks.`);
    } else {
      console.log('Bookmarks collection is already seeded.');
    }

    console.log('Database seeding checks completed successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Execute immediately without overriding connections
(async () => {
  // Relying on active mongoose connection from server boot
  if (mongoose.connection.readyState === 1) {
    await seedDatabase();
  } else {
    mongoose.connection.once('open', async () => {
      await seedDatabase();
    });
  }
})();

module.exports = seedDatabase;
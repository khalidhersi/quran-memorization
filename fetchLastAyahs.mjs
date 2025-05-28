import fs from 'fs';
import fetch from 'node-fetch';

const totalPages = 604;
const edition = 'quran-simple';

const getLastAyahs = async () => {
  const results  = {};

  for (let page = 1; page <= totalPages; page++) {
    const url = `https://api.alquran.cloud/v1/page/${page}/${edition}`;
    try {
      const res = await fetch(url);
      const json = await res.json();

      if (json.data && json.data.ayahs && json.data.ayahs.length > 0) {
        const lastAyah = json.data.ayahs[json.data.ayahs.length - 1];
        results[page] = {
          surah: lastAyah.surah.number,
          ayah: lastAyah.numberInSurah,
        };
        console.log(`Page ${page}: Surah ${lastAyah.surah.number}, Ayah ${lastAyah.numberInSurah}`);
      } else {
        console.error(`Page ${page}: No ayah data`);
      }

      // Delay to avoid rate limit
      await new Promise(r => setTimeout(r, 300));
    } catch (err) {
      console.error(`Page ${page}: Failed to fetch`, err.message);
    }
  }

  fs.writeFileSync('lastAyahsPerPage.json', JSON.stringify(results, null, 2));
};

getLastAyahs();

import requests
import json
import time

def get_last_ayahs_per_page():
    total_pages = 604
    edition = "quran-simple"
    last_ayahs = {}
    max_retries = 3
    delay = 0.5  # seconds between requests

    for page in range(1, total_pages + 1):
        success = False
        for attempt in range(max_retries):
            try:
                url = f"https://api.alquran.cloud/v1/page/{page}:{edition}"
                response = requests.get(url, timeout=10)
                if response.status_code == 200:
                    data = response.json().get("data", {})
                    ayahs = data.get("ayahs", [])
                    if ayahs:
                        last_ayah = ayahs[-1]
                        last_ayahs[page] = {
                            "surah": last_ayah["surah"]["number"],
                            "ayah": last_ayah["numberInSurah"]
                        }
                        success = True
                        break
                else:
                    time.sleep(delay)
            except Exception as e:
                print(f"Error on page {page}, attempt {attempt + 1}: {e}")
                time.sleep(delay)

        if not success:
            last_ayahs[page] = {"error": f"Failed to fetch page {page} after {max_retries} attempts"}

        time.sleep(delay)

    return last_ayahs

# Run and save
last_ayahs_per_page = get_last_ayahs_per_page()

with open("last_ayahs_per_page.json", "w", encoding="utf-8") as f:
    json.dump(last_ayahs_per_page, f, ensure_ascii=False, indent=2)

print("Saved to lastAyahPage.json")

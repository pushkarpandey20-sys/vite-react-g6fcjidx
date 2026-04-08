from duckduckgo_search import DDGS
import urllib.request
import time

queries = {
  "banana": "ripe yellow banana bunch isolated transparent background png",
  "havan": "copper havan kund isolated transparent background png",
  "supari": "betel nut isolated transparent background png",
  "ghee": "ghee in glass bowl isolated transparent background png",
  "aggarbatti": "incense sticks agarbatti isolated transparent background png",
  "camphor": "camphor tablets kapur isolated transparent png"
}

with DDGS() as ddgs:
    for name, query in queries.items():
        try:
            results = ddgs.images(query, max_results=3)
            found = False
            for r in results:
                url = r['image']
                try:
                    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
                    with urllib.request.urlopen(req, timeout=10) as response, open(f"public/samagri/{name}.png", 'wb') as out_file:
                        data = response.read()
                        out_file.write(data)
                    print(f"Downloaded {name}.png")
                    found = True
                    break
                except:
                    pass
            if not found:
                print(f"Failed to download {name}")
        except Exception as e:
            print(f"Failed {name}: {e}")
        time.sleep(1)

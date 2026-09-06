import urllib.request

images = ['thathera.jpg', 'toda.jpg', 'chhau.jpg', 'warli.jpg']
urls = [f"http://localhost:5173/heritage-images/{img}" for img in images] + [f"http://127.0.0.1:8000/heritage-images/{img}" for img in images]


for url in urls:
    try:
        with urllib.request.urlopen(url, timeout=3) as resp:
            data = resp.read()
            print(f"OK {resp.status} {len(data)} bytes -> {url}")
    except Exception as e:
        print(f"ERR {e} -> {url}")

import urllib.request, json

BASE_URL = "http://localhost:8080"

print("--- Testing Index Slider ---")
with urllib.request.urlopen(f"{BASE_URL}/index.html") as resp:
    html = resp.read().decode('utf-8')
    assert "heroSliderSection" in html, "Missing heroSliderSection"
    assert "heroBannerVideo" in html, "Missing heroBannerVideo"
    assert "slider-arrow-btn" not in html, "slider-arrow-btn should be removed"
    assert "hero-dot" not in html, "hero-dot indicators should be removed"
    assert "prevHeroSlide" in html, "Missing prevHeroSlide"
    assert "nextHeroSlide" in html, "Missing nextHeroSlide"
    print("✓ index.html slider markup verified: No arrow buttons, no dots, video element & edge tap zones present.")

print("\n--- Testing Admin Panel Slider Manager ---")
with urllib.request.urlopen(f"{BASE_URL}/admin.html") as resp:
    admin_html = resp.read().decode('utf-8')
    assert "nav-slider" in admin_html, "Missing nav-slider in admin"
    assert "view-slider" in admin_html, "Missing view-slider in admin"
    assert "slideModal" in admin_html, "Missing slideModal in admin"
    assert "loadAdminSlides" in admin_html, "Missing loadAdminSlides in admin"
    print("✓ admin.html verified: Hero Slider nav item, management view, edit modal, and JS handlers present.")

print("\n--- Testing Video Asset & MIME Type ---")
req = urllib.request.Request(f"{BASE_URL}/assets/videos/wok-cooking-flame.webm", method='HEAD')
with urllib.request.urlopen(req) as resp:
    content_type = resp.headers.get('Content-Type')
    assert 'video/webm' in content_type, f"Unexpected content-type: {content_type}"
    print(f"✓ Video asset served with correct MIME: {content_type}, Length: {resp.headers.get('Content-Length')} bytes")

print("\n--- Testing POST /api/slides ---")
test_payload = [
    {
        "id": "slide-test",
        "type": "video",
        "media": "assets/videos/wok-cooking-flame.webm",
        "tag": "1000°F FLAME CRAFT",
        "title": "Real Wok Hei. Sizzling Fresh.",
        "desc": "Witness the intense high-heat wok tossing that seals in authentic smoky aroma.",
        "playToEnd": True,
        "duration": 0,
        "primaryCta": { "text": "Explore Full Menu", "link": "menu.html" },
        "secondaryCta": { "text": "Order Online", "action": "openOrderModal()" },
        "active": True
    }
]
req_post = urllib.request.Request(
    f"{BASE_URL}/api/slides",
    data=json.dumps(test_payload).encode('utf-8'),
    headers={'Content-Type': 'application/json'},
    method='POST'
)
with urllib.request.urlopen(req_post) as resp:
    res_data = json.loads(resp.read().decode('utf-8'))
    assert res_data.get('status') == 'ok', f"Save failed: {res_data}"
    print(f"✓ POST /api/slides succeeded: {res_data}")

# Restore data/slides.json to full 6 slides
with open('data/slides.json', 'r', encoding='utf-8') as f:
    orig = json.load(f)
req_restore = urllib.request.Request(
    f"{BASE_URL}/api/slides",
    data=json.dumps(orig).encode('utf-8'),
    headers={'Content-Type': 'application/json'},
    method='POST'
)
with urllib.request.urlopen(req_restore) as resp:
    print(f"✓ Restored full 6 slides: status {resp.status}")

print("\nALL AUTOMATED TESTS PASSED!")

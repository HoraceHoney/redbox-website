with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('prevHeroSlide')
if pos != -1:
    start = text.rfind('<section', 0, pos)
    end = text.find('</section>', pos) + len('</section>')
    print("=== HERO SLIDER SECTION IN INDEX.HTML ===")
    print(text[start:end])

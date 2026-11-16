with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('prevHeroSlide')
if pos != -1:
    print(text[max(0, pos-400):min(len(text), pos+1500)])

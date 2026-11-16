with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('<!-- HERO BANNER CAROUSEL -->')
if start == -1:
    start = text.find('heroBannerImg')
    start = text.rfind('<section', 0, start)

end = text.find('</section>', start) + len('</section>')
print(text[start:end])

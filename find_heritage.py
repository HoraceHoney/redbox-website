with open('about.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('Our Heritage')
if pos == -1:
    pos = text.find('11-Year')
if pos == -1:
    pos = text.find('Timeline')
if pos != -1:
    print(text[pos-100:pos+800])

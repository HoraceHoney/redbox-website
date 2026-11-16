with open('about.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('id="the-box"')
if pos != -1:
    print(text[pos:pos+1500])

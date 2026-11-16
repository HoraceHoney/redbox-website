with open('admin.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('id="view-branches"')
print(text[pos-250:pos+50])

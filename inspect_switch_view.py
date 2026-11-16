with open('admin.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('function switchView')
if pos != -1:
    print(text[pos:pos+800])

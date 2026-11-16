with open('admin.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('async function initAdmin()')
print("Found initAdmin at:", pos)
print(text[pos+1000:pos+2500])

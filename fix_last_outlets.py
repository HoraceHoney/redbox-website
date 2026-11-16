with open('about.html', 'r', encoding='utf-8') as f:
    text = f.read().replace('LOCATE NEAREST 57 OUTLETS', 'LOCATE 57 GLOBAL BRANCHES')
with open('about.html', 'w', encoding='utf-8') as f:
    f.write(text)

with open('story.html', 'r', encoding='utf-8') as f:
    text = f.read().replace('LOCATE NEAREST 57 OUTLETS', 'LOCATE 57 GLOBAL BRANCHES')
with open('story.html', 'w', encoding='utf-8') as f:
    f.write(text)

with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()
text = text.replace('operates 57+ outlets', 'operates 57+ branches')
text = text.replace("stat1: '57+ Outlets'", "stat1: '57+ Branches'")
with open('app.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed perfectly!")

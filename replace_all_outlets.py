import re

replacements = {
    'index.html': [
        ('57+ Outlets nationwide', '57+ Branches worldwide'),
        ('Outlets Nationwide', 'Branches Worldwide'),
        ('Fast delivery from nearest outlet', 'Fast delivery from nearest branch'),
        ('57 Outlets', '57 Branches'),
        ('Outlets', 'Branches')
    ],
    'about.html': [
        ('57 outlets born from passion', '57 branches born from passion'),
        ('MASTER OUTLETS', 'GLOBAL BRANCHES'),
        ('across 57 outlets', 'across 57 branches'),
        ('57 Outlets · Family Warmth', '57 Branches · Family Warmth'),
        ('57 NATIONAL OUTLETS', '57 GLOBAL BRANCHES'),
        ('57 Outlets Across', '57 Branches Across'),
        ('outlets', 'branches'),
        ('Outlets', 'Branches'),
        ('Outlet', 'Branch'),
        ('outlet', 'branch')
    ],
    'menu.html': [
        ('Helpline & Outlets', 'Helpline & Branches'),
        ('outlets', 'branches'),
        ('Outlets', 'Branches')
    ],
    'catering.html': [
        ('Find Outlets', 'Find Branches'),
        ('outlets', 'branches'),
        ('Outlets', 'Branches')
    ],
    'franchise.html': [
        ('Find Outlets', 'Find Branches'),
        ('outlets', 'branches'),
        ('Outlets', 'Branches')
    ],
    'thebox.html': [
        ('Find Outlets', 'Find Branches'),
        ('outlets', 'branches'),
        ('Outlets', 'Branches')
    ],
    'story.html': [
        ('57 outlets born from passion', '57 branches born from passion'),
        ('MASTER OUTLETS', 'GLOBAL BRANCHES'),
        ('across 57 outlets', 'across 57 branches'),
        ('57 Outlets · Family Warmth', '57 Branches · Family Warmth'),
        ('57 NATIONAL OUTLETS', '57 GLOBAL BRANCHES'),
        ('outlets', 'branches'),
        ('Outlets', 'Branches')
    ],
    'app.js': [
        ("title: '57+ Outlets Across 17 Regional Hubs'", "title: '57+ Branches Across Global Hubs'"),
        ("stat1: '8 Outlets'", "stat1: '8 Branches'"),
        ("stat1: '22 Outlets'", "stat1: '22 Branches'"),
        ("stat1: '40 Outlets'", "stat1: '40 Branches'"),
        ("title: '57 Outlets Nationwide & Institutional Scale'", "title: '57 Branches Worldwide & Institutional Scale'"),
        ("57 Outlets", "57 Branches"),
        ("nearest outlet", "nearest branch"),
        ("Select Outlet", "Select Branch")
    ]
}

for fn, pairs in replacements.items():
    with open(fn, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old_str, new_str in pairs:
        content = content.replace(old_str, new_str)
        
    with open(fn, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {fn}")

print("All replacements done.")

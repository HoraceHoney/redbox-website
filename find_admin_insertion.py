with open('admin.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Find sidebar navigation section
pos_nav = text.find('id="nav-dashboard"')
print("Found nav-dashboard at:", pos_nav)
print(text[pos_nav-50:pos_nav+600])

# Find views container
pos_views = text.find('id="view-content"')
print("\nFound view-content at:", pos_views)
print(text[pos_views:pos_views+300])

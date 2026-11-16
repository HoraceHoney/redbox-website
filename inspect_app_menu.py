with open('app.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"app.js total lines: {len(lines)}")
for i, line in enumerate(lines):
    if any(k in line for k in ['categoryPillsContainer', 'menuItemsGrid', 'setFoodTypeFilter', 'loadMoreMenuItems', 'renderMenuCategoryPills', 'filterMenuItems', 'menuState']):
        print(f"{i+1}: {line.strip()[:100]}")

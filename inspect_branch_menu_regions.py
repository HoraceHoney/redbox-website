import json

with open('data/branches.json', 'r', encoding='utf-8') as f:
    branches = json.load(f)

menu_regions = set()
country_regions = {}
for b in branches:
    mr = b.get('menuRegion')
    if mr: menu_regions.add(mr)
    c = b.get('country')
    if c not in country_regions: country_regions[c] = set()
    if mr: country_regions[c].add(mr)

print("menuRegions in branches:", menu_regions)
print("country_regions:", country_regions)

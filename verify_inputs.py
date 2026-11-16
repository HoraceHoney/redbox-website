with open('admin.html', 'r', encoding='utf-8') as f:
    text = f.read()

print('Has id="slideModal":', 'id="slideModal"' in text)
inputs = ['editSlideIndex', 'slideMediaUrl', 'slideTag', 'slideTitle', 'slideDesc', 'slideDuration', 'slidePrimaryText', 'slideSecondaryText', 'modalPreviewImg', 'modalPreviewVid']
for input_id in inputs:
    print(f'Has id="{input_id}":', f'id="{input_id}"' in text)

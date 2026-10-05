import os

replacements = {
    'VayuDrishti': 'VayuDrishti',
    'VAYUDRISHTI': 'VAYUDRISHTI',
    'vayudrishti': 'vayudrishti'
}

def replace_in_dir(directory):
    for root, dirs, files in os.walk(directory):
        if 'node_modules' in root or 'venv' in root or '.git' in root or '__pycache__' in root:
            continue
        for file in files:
            if not file.endswith(('.tsx', '.ts', '.js', '.jsx', '.html', '.css', '.md', '.py', '.json', '.yml', '.txt', '.ini')):
                continue
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r') as f:
                    content = f.read()
            except Exception:
                continue
            
            modified = False
            for k, v in replacements.items():
                if k in content:
                    content = content.replace(k, v)
                    modified = True
            
            if modified:
                with open(filepath, 'w') as f:
                    f.write(content)
                print(f"Updated {filepath}")

replace_in_dir('/Users/akhilsathwik/Desktop/project')

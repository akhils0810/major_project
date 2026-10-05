import os
import glob

# Mapping of hardcoded hex to Tailwind semantic variables
replacements = {
    'bg-[#f2efeb]': 'bg-background',
    'text-[#132532]': 'text-foreground',
    'text-[#64748b]': 'text-muted-foreground',
    'text-[#3b4c59]': 'text-muted-foreground',
    'border-[#cfcbc5]': 'border-border',
    'border-[#d8d3cd]': 'border-border',
    'bg-white': 'bg-card',
    'bg-[#fcfbfa]': 'bg-card',
    'bg-gray-50': 'bg-muted/50',
    'bg-gray-100': 'bg-muted',
    'text-gray-400': 'text-muted-foreground',
    'text-gray-500': 'text-muted-foreground',
    'text-[#0f766e]': 'text-accent',
    'bg-[#0f766e]': 'bg-accent',
    'bg-[#10212e]': 'bg-primary',
    'text-white': 'text-primary-foreground',
    'hover:bg-[#1a3346]': 'hover:bg-primary/90',
}

files = glob.glob('src/**/*.tsx', recursive=True)

for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()
    
    new_content = content
    for old, new in replacements.items():
        new_content = new_content.replace(old, new)
        
    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

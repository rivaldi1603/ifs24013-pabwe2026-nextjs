import re

files = [
    r'src\features\auth\pages\LoginPage.tsx',
    r'src\features\auth\pages\RegisterPage.tsx',
    r'src\features\users\pages\ProfilePage.tsx'
]

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Step 1: Change <div className="space-y-1"> \n <label htmlFor="something" className="...">Text</label>
    # to <label className="space-y-1 block"> \n <span className="... block">Text</span>
    
    # We will use regex to find:
    # <div className="space-y-1">\s*<label htmlFor="[^"]+" className="([^"]+)">([^<]+)</label>
    # Replace with:
    # <label className="space-y-1 block">\n<span className="\1 block">\2</span>
    
    pattern1 = r'<div className="space-y-1">\s*<label htmlFor="[^"]+" className="([^"]+)">([^<]+)</label>'
    content = re.sub(pattern1, r'<label className="space-y-1 block">\n          <span className="\1 block">\2</span>', content)

    # Note: in ProfilePage.tsx, it might not be space-y-1. Let's check ProfilePage structure first.
    
    # Remove id="..." from inputs if they match the ones we removed
    # Actually, we can just remove all id="login-... or id="register-... or id="profile-...
    content = re.sub(r'\s*id="(login|register|profile)-[^"]+"', '', content)
    
    # Also change the closing </div> to </label> for those blocks
    # This is trickier with regex because there are many </div>.
    pass


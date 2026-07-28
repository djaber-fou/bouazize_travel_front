import os
import glob
import re

search_dir = r"c:\Users\boukt\Downloads\bouazize-travel\bouazize-travel-web-dev\bouazize-travel-web-dev"

old_pattern = re.compile(r"""const getFullImageUrl = \(url\) => \{
  if \(!url\) return null;
  if \(url\.startsWith\('http'\)\) return url;
  
  const baseUrl = import\.meta\.env\.VITE_BASE_URL \|\| 'http://127\.0\.0\.1:8000/api';
  const rootUrl = baseUrl\.replace\('/api', ''\);
  
  return `\$\{rootUrl\}\$\{url\.startsWith\('/'\) \? '' : '/'\}\$\{url\}`;
\}""", re.MULTILINE)

new_content = """const getFullImageUrl = (url) => {
  if (!url) return null;
  let path = url;
  try {
    if (url.startsWith('http')) {
      path = new URL(url).pathname;
    }
  } catch(e) {}
  
  const baseUrl = import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:8000/api';
  const rootUrl = baseUrl.replace('/api', '');
  
  return `${rootUrl}${path.startsWith('/') ? '' : '/'}${path}`;
}"""

count = 0
for filepath in glob.glob(os.path.join(search_dir, "**/*.vue"), recursive=True):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    if old_pattern.search(content):
        new_text = old_pattern.sub(new_content, content)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_text)
        print(f"Updated {filepath}")
        count += 1

print(f"Done! Updated {count} files.")

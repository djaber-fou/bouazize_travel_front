const fs = require('fs');
const glob = require('glob');

const oldPattern = `const getFullImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  
  const baseUrl = import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:8000/api';
  const rootUrl = baseUrl.replace('/api', '');
  
  return \`\${rootUrl}\${url.startsWith('/') ? '' : '/'}\${url}\`;
}`;

const newContent = `const getFullImageUrl = (url) => {
  if (!url) return null;
  let path = url;
  try {
    if (url.startsWith('http')) {
      path = new URL(url).pathname;
    }
  } catch(e) {}
  
  const baseUrl = import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:8000/api';
  const rootUrl = baseUrl.replace('/api', '');
  
  return \`\${rootUrl}\${path.startsWith('/') ? '' : '/'}\${path}\`;
}`;

glob('**/*.vue', { ignore: 'node_modules/**' }, (err, files) => {
    let count = 0;
    files.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        if (content.includes(oldPattern)) {
            content = content.replace(oldPattern, newContent);
            fs.writeFileSync(file, content, 'utf8');
            console.log('Updated ' + file);
            count++;
        }
    });
    console.log('Done! Updated ' + count + ' files.');
});

const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (
      fullPath.endsWith('.json') ||
      fullPath.endsWith('.astro') ||
      fullPath.endsWith('.ts') ||
      fullPath.endsWith('.tsx')
    ) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let updated = false;

      // Replace "/assets/" with "/src/assets/"
      if (content.includes('"/assets/')) {
        content = content.replace(/"\/assets\//g, '"/src/assets/');
        updated = true;
      }

      // Replace `/assets/` with `/src/assets/`
      if (content.includes('`/assets/')) {
        content = content.replace(/`\/assets\//g, '`/src/assets/');
        updated = true;
      }

      // Replace "assets/" (no leading slash) if it starts a string
      // This is mostly for affinities.json. Be careful not to replace it when it's part of a word.
      const noSlashRegex = /"assets\//g;
      if (noSlashRegex.test(content)) {
        content = content.replace(noSlashRegex, '"/src/assets/');
        updated = true;
      }

      if (updated) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDir(path.join(__dirname, 'src'));

const fs = require('fs');
const path = require('path');

const auraFolder = path.join(__dirname, 'src', 'data', 'auras');
const iconsFolder = 'src/assets/icons/auras';

// English to Spanish Mapping and Slug
const aurasMap = {
  'Accuracy.png': { name: 'Puntería', slug: 'punt' },
  'Attack.png': { name: 'Ataque', slug: 'atk' },
  'CriticalChance.png': { name: 'Probabilidad Crítica', slug: 'pcrit' },
  'Defence.png': { name: 'Defensa', slug: 'def' },
  'Health.png': { name: 'Vida', slug: 'hp' },
  'Resistance.png': { name: 'Resistencia', slug: 'res' },
  'Speed.png': { name: 'Velocidad', slug: 'vel' }
};

// Create auras folder if it doesn't exist
if (!fs.existsSync(auraFolder)) {
  fs.mkdirSync(auraFolder, { recursive: true });
}

Object.keys(aurasMap).forEach(file => {
  const data = aurasMap[file];
  const jsonContent = {
    name: data.name,
    slug: data.slug,
    icon: `/${iconsFolder}/${file}`,
    image: `/${iconsFolder}/large/${file}`
  };

  const jsonFilePath = path.join(auraFolder, `${data.slug}.json`);
  fs.writeFileSync(jsonFilePath, JSON.stringify(jsonContent, null, 2), 'utf8');
  console.log(`Created: ${jsonFilePath}`);
});

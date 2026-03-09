const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../src/data/champions.json.bak');
const targetDir = path.join(__dirname, '../src/data/champions');

// Ensure target directory exists
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// Read the new data
const rawData = fs.readFileSync(sourcePath, 'utf8');
const champions = JSON.parse(rawData);

console.log(`Processing ${champions.length} champions...`);

champions.forEach(champ => {
    // 1. Remove unwanted fields
    delete champ.id;
    delete champ.data;
    delete champ.is_published;
    delete champ.video_preview; // Assuming we don't need this or keeping it if user wants

    // 2. Transform Image
    // "https://.../Abadesa.webp" -> "/assets/champions/abadesa.webp"
    if (champ.image_url) {
        champ.image = `/assets/champions/${champ.slug}.webp`;
        delete champ.image_url;
    } else {
        champ.image = `/assets/champions/${champ.slug}.webp`; // Fallback
    }

    // 3. Transform Gear (Array of strings -> Array of objects for CMS)
    // ["letal"] -> [{ "set_name": "letal" }]
    if (Array.isArray(champ.gear)) {
        champ.gear = champ.gear.map(g => (typeof g === 'string' ? { set_name: g } : g));
    } else {
        champ.gear = [];
    }

    // 4. Transform Skills
    if (Array.isArray(champ.skills)) {
        champ.skills = champ.skills.map(skill => {
            // Levels: ["Desc"] -> [{ "level_desc": "Desc" }]
            if (Array.isArray(skill.levels)) {
                skill.levels = skill.levels.map(l => (typeof l === 'string' ? { level_desc: l } : l));
            } else {
                skill.levels = [];
            }

            // BuffDebuff: ["key"] -> [{ "key_name": "key" }]
            if (Array.isArray(skill.buffDebuff)) {
                skill.buffDebuff = skill.buffDebuff.map(b => (typeof b === 'string' ? { key_name: b } : b));
            } else {
                skill.buffDebuff = [];
            }
            return skill;
        });
    } else {
        champ.skills = [];
    }

    // 5. Ensure Masteries is array (it was missing in some)
    if (!champ.masteries) {
        champ.masteries = [];
    }

    // Write individual file
    const filePath = path.join(targetDir, `${champ.slug}.json`);
    fs.writeFileSync(filePath, JSON.stringify(champ, null, 2));
});

console.log('Done!');

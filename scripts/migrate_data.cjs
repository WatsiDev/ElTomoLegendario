const fs = require('fs');
const path = require('path');

const championsPath = path.join(__dirname, '../src/data/champions.json');

try {
    const rawData = fs.readFileSync(championsPath, 'utf8');
    const data = JSON.parse(rawData);
    const champions = data.champions;

    console.log(`Processing ${champions.length} champions...`);

    const updatedChampions = champions.map(champ => {
        // 1. Transform 'gear' (root level)
        if (!champ.gear) champ.gear = [];
        if (Array.isArray(champ.gear)) {
            champ.gear = champ.gear.map(item => {
                return (typeof item === 'string') ? { set_name: item } : item;
            });
        }

        // 2. Transform 'masteries' (root level)
        if (!champ.masteries) champ.masteries = [];
        if (Array.isArray(champ.masteries)) {
            champ.masteries = champ.masteries.map(item => {
                return (typeof item === 'string') ? { mastery_name: item } : item;
            });
        }

        // 3. Transform 'skills' (root level list of objects)
        if (!champ.skills) champ.skills = [];
        if (Array.isArray(champ.skills)) {
            champ.skills = champ.skills.map(skill => {
                // 3a. Transform 'levels' (inside skill)
                if (!skill.levels) skill.levels = [];
                if (Array.isArray(skill.levels)) {
                    skill.levels = skill.levels.map(level => {
                        return (typeof level === 'string') ? { level_desc: level } : level;
                    });
                }

                // 3b. Transform 'buffDebuff' (inside skill)
                // Check if existing data uses 'buffDebuff' key. Sometimes keys vary.
                if (!skill.buffDebuff) skill.buffDebuff = [];
                if (typeof skill.buffDebuff === 'string') {
                    skill.buffDebuff = [{ key_name: skill.buffDebuff }];
                }
                if (Array.isArray(skill.buffDebuff)) {
                    skill.buffDebuff = skill.buffDebuff.map(buff => {
                        return (typeof buff === 'string') ? { key_name: buff } : buff;
                    });
                }

                return skill;
            });
        }

        return champ;
    });

    const newData = { champions: updatedChampions };
    fs.writeFileSync(championsPath, JSON.stringify(newData, null, 2), 'utf8');
    console.log('Migration completed successfully.');

} catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
}

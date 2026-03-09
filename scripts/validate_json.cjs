const fs = require('fs');
const path = require('path');

const championsPath = path.join(__dirname, '../src/data/champions.json');

try {
    const rawData = fs.readFileSync(championsPath, 'utf8');
    const data = JSON.parse(rawData);
    const champions = data.champions;

    console.log(`Scanning ${champions.length} champions for invalid list fields...`);

    let errorCount = 0;

    champions.forEach((champ, index) => {
        // Check root fields
        if (champ.gear !== undefined && !Array.isArray(champ.gear)) {
            console.log(`[${index}] ${champ.name}: 'gear' is not an array (Type: ${typeof champ.gear})`);
            errorCount++;
        }
        if (champ.masteries !== undefined && !Array.isArray(champ.masteries)) {
            console.log(`[${index}] ${champ.name}: 'masteries' is not an array (Type: ${typeof champ.masteries})`);
            errorCount++;
        }
        if (champ.skills !== undefined && !Array.isArray(champ.skills)) {
            console.log(`[${index}] ${champ.name}: 'skills' is not an array (Type: ${typeof champ.skills})`);
            errorCount++;
        }

        // Check nested fields in skills
        if (Array.isArray(champ.skills)) {
            champ.skills.forEach((skill, sIndex) => {
                if (skill.levels !== undefined && !Array.isArray(skill.levels)) {
                    console.log(`[${index}] ${champ.name} - Skill ${sIndex}: 'levels' is not an array (Type: ${typeof skill.levels})`);
                    errorCount++;
                }
                if (skill.buffDebuff !== undefined && !Array.isArray(skill.buffDebuff)) {
                    console.log(`[${index}] ${champ.name} - Skill ${sIndex}: 'buffDebuff' is not an array (Type: ${typeof skill.buffDebuff})`);
                    errorCount++;
                }
            });
        }
    });

    if (errorCount === 0) {
        console.log("Validation Passed: All list fields are arrays or undefined.");
    } else {
        console.log(`Validation Failed: Found ${errorCount} errors.`);
    }

} catch (err) {
    console.error('Validation failed:', err);
    process.exit(1);
}

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de rutas
const CHAMPIONS_DIR = path.resolve(__dirname, '../src/data/champions-info/champions');
const IMAGES_DIR = path.resolve(__dirname, '../src/assets/champions');
const ENV_FILE = path.resolve(__dirname, '../.env');

// Diccionarios de corrección (puedes ir añadiendo más según detectes errores)
const DICTIONARIES = {
  gear: {
    "letal": "letal",
    "piel-de-piedra": "piel-de-piedra",
    // Ejemplo de corrección de error tipográfico:
    // "piel_de_piedra": "piel-de-piedra"
  },
  relics: {
    "garra-malefica": "garra_malefica",
    "luna-de-sangre": "luna_de_sangre",
    "corona-de-ireth": "corona_de_ireth",
    "vial-del-sombrerero": "vial_del_sombrerero",
    "mascara-de-zozobra": "mascara_de_zozobra",
    "varita-de-sumision": "varita_de_sumision",
    "corona-corrompida": "corona_corrompida",
    "mirada-condenadora": "mirada_condenadora",
    "apagador-de-esencia": "apagador_de_esencia",
    "repartemuerte": "repartemuerte",
    "aspecto-de-siroth": "aspecto_de_siroth",
    "lente-intangible": "lente_intangible",
    "malleos-de-fuego": "malleos_de_fuego",
    "martillo-del-fin": "martillo_del_fin",
    "invocatormentas": "invocatormentas",
    "mirada-del-gato": "mirada_del_gato"
  },
  blessings: {
    "toque-fantasmal": "toque-fantasmal",
    "segar-almas": "segar-almas",
    "crueldad": "crueldad",
    "ira-de-la-naturaleza": "ira-de-la-naturaleza"
  }
};

// Función para cargar el .env manualmente
function loadEnv() {
  if (fs.existsSync(ENV_FILE)) {
    const envContent = fs.readFileSync(ENV_FILE, 'utf-8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        let key = match[1];
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    });
  }
}

// Limpiar valores usando el diccionario
function applyDictionary(type, valuesArray) {
  if (!Array.isArray(valuesArray)) return valuesArray;
  
  return valuesArray.map(val => {
    // Si existe en el diccionario, usar el valor corregido
    if (DICTIONARIES[type] && DICTIONARIES[type][val]) {
      return DICTIONARIES[type][val];
    }
    // Si no existe, podemos normalizar por defecto: quitar guiones/espacios si es relics
    if (type === 'relics') {
      return val.replace(/-/g, '_');
    }
    return val;
  });
}

// Descargar imagen
async function downloadImage(url, destPath) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Status Code: ${response.status}`);
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(destPath, Buffer.from(buffer));
    return true;
  } catch (error) {
    console.error(`Error descargando imagen de ${url}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('Iniciando sincronización de campeones...');
  
  // 1. Cargar Variables de Entorno
  loadEnv();
  const API_TOKEN = process.env.API_TOKEN;
  if (!API_TOKEN) {
    console.error('❌ No se encontró API_TOKEN en el archivo .env');
    process.exit(1);
  }

  const API_URL = 'https://eurpwtwjvybdlfytbjmk.supabase.co/rest/v1/champions?select=*&order=name.asc';

  // 2. Escaneo Local
  let localSlugs = new Set();
  if (fs.existsSync(CHAMPIONS_DIR)) {
    const files = fs.readdirSync(CHAMPIONS_DIR).filter(file => file.endsWith('.json'));
    files.forEach(file => {
      localSlugs.add(file.replace('.json', ''));
    });
  }
  console.log(`✅ ${localSlugs.size} campeones encontrados localmente.`);

  // 3. Fetch a la API
  console.log(`Haciendo fetch a la API...`);
  let apiChampions = [];
  try {
    const res = await fetch(API_URL, {
      headers: {
        'apikey': API_TOKEN,
        'Authorization': `Bearer ${API_TOKEN}`
      }
    });
    if (!res.ok) throw new Error(`API respondió con status ${res.status}`);
    apiChampions = await res.json();
  } catch (error) {
    console.error('❌ Error contactando a la API:', error.message);
    process.exit(1);
  }

  // 4. Filtrar los nuevos
  const newChampions = apiChampions.filter(champ => !localSlugs.has(champ.slug));
  
  if (newChampions.length === 0) {
    console.log('🎉 No hay campeones nuevos para actualizar. Todo está al día.');
    return;
  }
  
  console.log(`🔥 Se han encontrado ${newChampions.length} campeones nuevos!`);

  // 5. Transformación y Guardado
  for (const champ of newChampions) {
    console.log(`Procesando: ${champ.name} (${champ.slug})...`);
    
    // Aplicar diccionarios
    const relics = applyDictionary('relics', champ.relics);
    const gear = applyDictionary('gear', champ.gear);
    const blessings = applyDictionary('blessings', champ.blessings);

    // Transformar estructura al formato local
    const transformedChamp = {
      slug: champ.slug,
      name: champ.name,
      faction: champ.faction,
      rarity: champ.rarity,
      role: champ.role,
      type: champ.type,
      affinity: champ.affinity,
      youtube_link: champ.youtube_link,
      blessings: blessings,
      relics: relics,
      gear: gear,
      uses: champ.uses,
      stats: champ.stats,
      skills: champ.skills,
      aura: champ.aura,
      lore: champ.lore,
      forms: champ.forms,
      
      // Construir la ruta de la imagen local
      image: `/src/assets/champions/${champ.slug}.webp`,
      
      // Inicializar campos exclusivos locales
      masteries: [],
      artworks: [],
      pros: [],
      contras: [],
      pve_stats: [],
      pvp_stats: [],
      game_modes: [],
      sinergias: []
    };

    // Descargar la imagen
    if (champ.image_url) {
      const imgPath = path.join(IMAGES_DIR, `${champ.slug}.webp`);
      console.log(`   Descargando imagen...`);
      await downloadImage(champ.image_url, imgPath);
    } else {
      console.warn(`   ⚠️ ${champ.name} no tiene image_url en la API.`);
    }

    // Escribir a disco
    const jsonPath = path.join(CHAMPIONS_DIR, `${champ.slug}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(transformedChamp, null, 2), 'utf-8');
    
    console.log(`   ✅ Guardado: ${champ.slug}.json`);
  }

  console.log('✨ Actualización completada exitosamente.');
}

main();

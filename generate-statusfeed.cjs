#!/usr/bin/env node
/**
 * generate-statusfeed.cjs
 * Descarga los statuses de status.cafe y genera statusfeed.json
 *
 * Añade al package.json "build":
 *   "node starmoon.nekoweb.org/generate-statusfeed.cjs && ..."
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const USERNAME   = 'gvpv12';
const OUTPUT_DIR = path.join(__dirname); // misma carpeta que el script
const OUT_FILE   = path.join(OUTPUT_DIR, 'statusfeed.json');

// ── Fetch helper ──
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    https.get({
      hostname: u.hostname,
      path:     u.pathname + u.search,
      headers: {
        'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection':      'keep-alive',
        'Referer':         'https://status.cafe/',
      }
    }, res => {
      // follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      let data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// ── Parse HTML: extraer statuses ──
function parseStatuses(html) {
  const entries = [];

  // status.cafe renderiza cada status en un <article> o <li> con clases específicas
  // La estructura es: cada post tiene texto + emoji + fecha
  // Buscamos bloques que contengan el texto del status

  // Patron 1: <p class="status-text">...</p> con fecha en <time datetime="...">
  const statusBlocks = html.match(/<article[^>]*>[\s\S]*?<\/article>/gi) || [];

  if (statusBlocks.length > 0) {
    for (const block of statusBlocks) {
      // emoji al inicio del texto
      const emojiMatch = block.match(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}]/u);
      const emoji = emojiMatch ? emojiMatch[0] : '★';

      // texto del status (quitar HTML)
      const textMatch = block.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
      const rawText = textMatch ? textMatch[1].replace(/<[^>]+>/g, '').trim() : '';

      // fecha
      const dateMatch = block.match(/datetime="([^"]+)"/i);
      const date = dateMatch ? dateMatch[1].slice(0, 10) : '';

      if (rawText) {
        entries.push({ text: rawText, mood: emoji, date });
      }
    }
  } else {
    // Patron 2: buscar el contenido de otra forma
    // status.cafe muestra: <span class="e">EMOJI</span> texto <time>
    const lineRegex = /<span[^>]*class="[^"]*e[^"]*"[^>]*>(.*?)<\/span>\s*([\s\S]*?)<time[^>]*datetime="([^"]+)"/gi;
    let m;
    while ((m = lineRegex.exec(html)) !== null) {
      const emoji   = m[1].replace(/<[^>]+>/g, '').trim();
      const rawText = m[2].replace(/<[^>]+>/g, '').trim();
      const date    = m[3].slice(0, 10);
      if (rawText) entries.push({ text: rawText, mood: emoji, date });
    }
  }

  // Patron 3: fallback — buscar todos los <time> con texto cercano
  if (entries.length === 0) {
    console.log('  Intentando parser alternativo...');
    // Buscar párrafos con contenido entre <time> tags
    const timeRegex = /<time[^>]*datetime="([^"]+)"[^>]*>/gi;
    const times = [...html.matchAll(/<time[^>]*datetime="([^"]+)"/gi)];

    // Buscar bloques de texto que parecen statuses (líneas cortas con emojis)
    const textRegex = />\s*([\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE00}-\u{FEFF}][\s\S]{5,280}?)\s*</giu;
    const texts = [...html.matchAll(textRegex)]
      .map(m => m[1].replace(/<[^>]+>/g, '').trim())
      .filter(t => t.length > 3 && t.length < 300 && !t.includes('<'));

    // combinar con fechas disponibles
    texts.slice(0, 20).forEach((text, i) => {
      const date = times[i] ? times[i][1].slice(0, 10) : '';
      const emojiMatch = text.match(/^([\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}])/u);
      const mood = emojiMatch ? emojiMatch[1] : '★';
      entries.push({ text, mood, date });
    });
  }

  return entries;
}

// ── Main ──
async function main() {
  console.log('📡 Fetching status.cafe...');

  try {
    const html = await fetchUrl(`https://status.cafe/users/${USERNAME}`);
    console.log(`  ✓ Descargado (${html.length} chars)`);

    const entries = parseStatuses(html);
    console.log(`  ✓ ${entries.length} statuses encontrados`);

    if (entries.length === 0) {
      // Guardar HTML para debug
      fs.writeFileSync(path.join(OUTPUT_DIR, 'statusfeed_debug.html'), html, 'utf8');
      console.log('  ⚠ 0 statuses. Guardado statusfeed_debug.html para inspección.');
      console.log('  Abre ese archivo y busca la estructura HTML de los statuses.');
    }

    fs.writeFileSync(OUT_FILE, JSON.stringify(entries, null, 2), 'utf8');
    console.log(`  💾 Guardado: ${OUT_FILE}`);

  } catch (err) {
    console.error('  ✗ Error:', err.message);

    // Si falla, crear JSON vacío para que el sitio no rompa
    if (!fs.existsSync(OUT_FILE)) {
      fs.writeFileSync(OUT_FILE, '[]', 'utf8');
      console.log('  📄 Creado statusfeed.json vacío como fallback');
    }
    process.exit(0); // no fallar el build completo
  }
}

main();

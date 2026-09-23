import { readFile, mkdir, copyFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import JSZip from 'jszip';

const output = path.resolve('dist');
await mkdir(output, { recursive: true });
for (const name of ['index.html', 'styles.css', 'theme.css', 'contrast.css', 'app.js', 'game-library.js', 'upload.html', 'upload-ui.js']) {
  await copyFile(name, path.join(output, name));
}
const archive = await JSZip.loadAsync(await readFile('games-bundle.zip'));
let count = 0;
for (const entry of Object.values(archive.files)) {
  if (entry.dir) continue;
  const name = entry.name.replaceAll('\\', '/');
  const target = path.resolve(output, name);
  if (!name.startsWith('games/') || !target.startsWith(output + path.sep)) throw new Error('Invalid game archive path');
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, await entry.async('nodebuffer'));
  count++;
}
for (const slug of ['pool', 'street-fighter']) await readFile(path.join(output, 'games', slug, 'index.html'));
console.log(`Built website with ${count} game files.`);

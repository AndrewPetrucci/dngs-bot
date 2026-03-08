import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function loadCommands(client) {
  const commandsPath = join(__dirname);
  const files = readdirSync(commandsPath).filter((f) => f.endsWith('.js') && f !== 'load-commands.js');

  for (const file of files) {
    const filePath = pathToFileURL(join(commandsPath, file)).href;
    const module = await import(filePath);
    const command = module.default ?? module;

    if (!command?.data?.name) {
      console.warn(`Skipping ${file}: missing data.name`);
      continue;
    }
    client.commands.set(command.data.name, command);
  }

  return Array.from(client.commands.values());
}

const http = require('http');
const fs = require('fs').promises; // Використовуємо проміси для асинхронного читання
const path = require('path');
const { program } = require('commander');
const xml2js = require('xml2js');

// Налаштування Commander.js для обробки аргументів командного рядка
program
  .requiredOption('-h, --host <host>', 'Server host address')
  .requiredOption('-p, --port <port>', 'Server port number')
  .requiredOption('-i, --input <path>', 'Path to input JSON file');

program.parse(process.argv);

const options = program.opts();

// Функція для асинхронного читання та парсингу JSON
async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error('Cannot find input file');
    }
    throw new Error(`Error reading or parsing JSON: ${err.message}`);
  }
}

// Функція для перетворення JSON у XML
function convertToXml(jsonData) {
  const builder = new xml2js.Builder({
    rootName: 'reserves', // Встановлюємо кореневий елемент XML
    xmldec: { version: '1.0', encoding: 'UTF-8' },
  });
  return builder.buildObject(jsonData);
}

// Створення сервера
const server = http.createServer(async (req, res) => {
  try {
    // Читання JSON файлу
    const jsonData = await readJsonFile(path.join(__dirname, options.input));

    // Перетворення JSON у XML
    const xmlData = convertToXml(jsonData);

    // Налаштування заголовків відповіді
    res.writeHead(200, { 'Content-Type': 'application/xml' });
    res.end(xmlData);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(err.message);
  }
});

// Запуск сервера
server.listen(options.port, options.host, () => {
  console.log(`Server running at http://${options.host}:${options.port}`);
});
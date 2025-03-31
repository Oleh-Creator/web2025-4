const xml2js = require('xml2js');

async function jsonToXml(jsonData) {
    const builder = new xml2js.Builder();
    return builder.buildObject(jsonData);
}

const server = http.createServer(async (req, res) => {
    const data = await readJSON(options.input);
    const xml = await jsonToXml({ exchangeRates: data });

    res.writeHead(200, { 'Content-Type': 'application/xml' });
    res.end(xml);
});

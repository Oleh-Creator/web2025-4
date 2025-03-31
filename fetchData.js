const fs = require('fs').promises;
const axios = require('axios');

async function fetchData() {
    try {
        const response = await axios.get('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json');
        await fs.writeFile('data.json', JSON.stringify(response.data, null, 2));
        console.log("Data saved to data.json");
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

fetchData();

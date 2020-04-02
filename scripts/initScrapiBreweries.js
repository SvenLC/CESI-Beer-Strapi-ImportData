const path = require('path');
const fsPromises = require('fs').promises;
const fetch = require('node-fetch');
const neatCsv = require('neat-csv');

const csvDataFolder = path.resolve(__filename, '../../data/openbeerdb');

const baseUrl = 'http://localhost:1338';

async function loadBreweries() {
  console.log('Reading and cleaning breweries.csv');
  const breweriesData = await fsPromises.readFile(
    `${csvDataFolder}/breweries.csv`,
    'utf8'
  );
  const cleanBreweriesData = breweriesData
    .replace(/^\n/gm, '')
    .replace(/^(.*[^"])\n/gm, '$1 ');
  const breweries = await neatCsv(cleanBreweriesData);
  console.log(`Read and cleaned ${breweries.length} breweries`);

  console.log('Sending breweries to Scrapi');

  for (let i = 0; i < breweries.length; i++) {
    const brewery = breweries[i];
    brewery.ref_id = brewery.id;
    brewery.description = brewery.descript;
    delete brewery.id



    try {
      let response = await fetch(`${baseUrl}/breweries/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(brewery)
      });
      console.log(`Sent brewery ${brewery.name}, status ${response.status}`);
    } catch (err) {
      console.log(err);
    }
  }
}

async function main() {
  await loadBreweries();
}

main();

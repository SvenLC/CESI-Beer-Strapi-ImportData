const path = require('path');
const fsPromises = require('fs').promises;
const fetch = require('node-fetch');
const neatCsv = require('neat-csv');

const csvDataFolder = path.resolve(__filename, '../../data/openbeerdb');

const baseUrl = 'http://localhost:1338';

async function loadCategories() {
  console.log('Reading and cleaning categories.csv');
  const categoriesData = await fsPromises.readFile(
    `${csvDataFolder}/categories.csv`,
    'utf8'
  );
  const cleanCategoriesData = categoriesData.replace('cat_name', 'name');
  const categories = await neatCsv(cleanCategoriesData);
  console.log(`Read and cleaned ${categories.length} categories`);

  console.log('Sending categories to Scrapi');

  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    category.ref_id = category.id;
    delete category.id;
    try {
      let response = await fetch(`${baseUrl}/categories/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(category)
      });
      console.log(`Sent category ${category.name}, status ${response.status}`);
    } catch (err) {
      console.log(err);
    }
  }
}

async function main() {
  await loadCategories();
}

main();

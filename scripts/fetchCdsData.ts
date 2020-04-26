/* eslint-disable no-console */
import fs from 'fs';
import fetch from 'node-fetch';

import { DATA_FILE } from './constants';
import { CdsData } from './types';

const dataPath = `./static/${DATA_FILE}`;

console.log('Fetching Corona Data Scraper data.');
fetch(`https://coronadatascraper.com/${DATA_FILE}`)
  .then(res => res.json())
  .then((data: CdsData) => {
    fs.writeFileSync(dataPath, JSON.stringify(data));
    console.log(`Wrote Corona Data Scraper data to ${dataPath}.`);
  });

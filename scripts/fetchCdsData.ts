import fs from 'fs';
import fetch from 'node-fetch';

import { DATA_FILE, DATA_PATH } from './constants';
import { CdsData } from './types';

const fetchCdsData = async (): Promise<void> => {
  console.log('Fetching Corona Data Scraper data.');
  const res = await fetch(`https://coronadatascraper.com/${DATA_FILE}`);
  const data: CdsData = await res.json();
  fs.writeFileSync(DATA_PATH, JSON.stringify(data));
  console.log(`Wrote Corona Data Scraper data to ${DATA_PATH}.`);
};
export default fetchCdsData;

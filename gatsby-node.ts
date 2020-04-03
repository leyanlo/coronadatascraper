/* eslint-disable no-console */
import { differenceInDays } from 'date-fns';
import fs from 'fs';
import { GatsbyNode } from 'gatsby';
import fetch from 'node-fetch';

type DateDatum = {
  cases?: number;
  deaths?: number;
  recovered?: number;
  active?: number;
  tested?: number;
  growthFactor?: number | null;
};

type Maintainer = {
  name: string;
  email: string;
  twitter: string;
  github: string;
  country: string;
  state: string;
  county: string;
  city: string;
  flag: string;
};

type Curator = {
  name: string;
  url: string;
  twitter: string;
  github: string;
};

type Source = {
  url: string;
  name: string;
  description: string;
};

type Datum = {
  dates: {
    [isoDate: string]: DateDatum;
  };
  maintainers: Maintainer[];
  url: string;
  curators?: Curator[];
  aggregate: 'state' | 'county';
  country: string;
  coordinates: [number, number];
  state?: string;
  rating: number;
  sources?: Source[];
  tz: string[];
  featureId: number;
  population: number;
};

type Data = {
  [stateOrCounty: string]: Datum;
};

const filterDates = (dates: Datum['dates']): Datum['dates'] =>
  Object.keys(dates).reduce((acc, k) => {
    const { cases, deaths } = dates[k];
    acc[k] = {
      cases,
      deaths,
    };
    return acc;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }, {} as any);

const filterData = (data: Data): Data =>
  Object.keys(data).reduce((acc, k) => {
    const { dates, aggregate, coordinates, population } = data[k];
    const filteredDates = filterDates(dates);
    acc[k] = {
      dates: filteredDates,
      aggregate,
      coordinates,
      population,
    };
    return acc;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }, {} as any);

// eslint-disable-next-line import/prefer-default-export
export const onPreInit: GatsbyNode['onPreInit'] = async () => {
  try {
    const data: Data = JSON.parse(
      (fs.readFileSync(
        './static/timeseries-byLocation-filtered.json',
      ) as unknown) as string,
    );

    const maxDate = Object.keys(data).reduce((acc, k) => {
      const { dates } = data[k];
      return Math.max(
        acc,
        ...Object.keys(dates).map<number>(d => new Date(d).valueOf()),
      );
    }, 0);

    if (differenceInDays(new Date(), maxDate) > 1) {
      // noinspection ExceptionCaughtLocallyJS
      throw new Error('Corona Data Scraper data more than one day old.');
    }
    console.log(
      'Corona Data Scraper data present and current.\nSkipping fetch.',
    );
  } catch (err) {
    console.log(err.message, '\nFetching new Corona Data Scraper data.');
    await fetch('https://coronadatascraper.com/timeseries-byLocation.json')
      .then(res => res.json())
      .then((data: Data) => {
        const dataPath = './static/timeseries-byLocation.json';
        fs.writeFileSync(dataPath, JSON.stringify(data));
        console.log(`Wrote Corona Data Scraper data to ${dataPath}.`);

        const filteredDataPath = './static/timeseries-byLocation-filtered.json';
        fs.writeFileSync(filteredDataPath, JSON.stringify(filterData(data)));
        console.log(
          `Wrote filtered Corona Data Scraper data to ${filteredDataPath}.`,
        );
      });
  }
};

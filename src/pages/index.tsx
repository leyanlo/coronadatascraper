import DeckGL from '@deck.gl/react';
import { css } from '@emotion/core';
import React, { useEffect, useState } from 'react';
import { StaticMap } from 'react-map-gl';
import { useUID } from 'react-uid';

import { Layout } from '../components/Layout';

const MAPBOX_ACCESS_TOKEN = process.env.GATSBY_MAPBOX_ACCESS_TOKEN;

const initialViewState = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
  pitch: 0,
  bearing: 0,
};

type Country = {
  Country: string;
  Slug: string;
  Provinces: string[];
};

const US: Country = {
  Country: 'US',
  Slug: 'us',
  Provinces: ['California'],
};

export default function IndexPage(): JSX.Element {
  const [countries, setCountries] = useState<{ [Slug: string]: Country }>({
    us: US,
  });
  const [country, setCountry] = useState<Country>(US);
  const countrySelectUid = useUID();

  useEffect(() => {
    fetch('https://api.covid19api.com/countries')
      .then(res => res.json())
      .then((data: Country[]) => {
        const dataMap = data.reduce((acc, c) => {
          acc[c.Slug] = c;
          return acc;
        }, {} as { [Slug: string]: Country });
        setCountries(dataMap);
        setCountry(dataMap.us);
      });
  }, []);

  return (
    <Layout>
      <DeckGL initialViewState={initialViewState} controller>
        <StaticMap
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
          width="100%"
          height="100%"
        />
      </DeckGL>
      <article
        css={css`
          position: absolute;
          margin: 16px;
          padding: 16px;
          background-color: #fffc;
        `}
      >
        <h2
          css={css`
            margin-top: 0;
          `}
        >
          <a
            href="https://covid19api.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            covid19api
          </a>{' '}
          demo
        </h2>
        <label htmlFor={countrySelectUid}>
          Select country:{' '}
          <select
            id={countrySelectUid}
            value={country.Slug}
            css={css`
              min-width: 256px;
            `}
          >
            {Object.keys(countries).map(k => (
              <option value={k}>{countries[k].Country}</option>
            ))}
          </select>
        </label>
      </article>
    </Layout>
  );
}

import { ScatterplotLayer } from '@deck.gl/layers';
import DeckGL from '@deck.gl/react';
import { css } from '@emotion/core';
import React, { useEffect, useMemo, useReducer, useState } from 'react';
import { StaticMap } from 'react-map-gl';
import { useUID } from 'react-uid';

import Logo from '../assets/logo.svg';
import { Layout } from '../components/Layout';

const MAPBOX_ACCESS_TOKEN = process.env.GATSBY_MAPBOX_ACCESS_TOKEN;

const INITIAL_VIEW_STATE = {
  longitude: -97,
  latitude: 39,
  zoom: 3.8,
};

type Status = 'confirmed' | 'deaths' | 'recovered';
const STATUSES: Status[] = ['confirmed', 'deaths', 'recovered'];

type ApiDatum = {
  Country: string;
  Province: string;
  Lat: number;
  Lon: number;
  Date: string;
  Cases: number;
  Status: Status;
};

type SelectedProvince = {
  province: Province;
  x: number;
  y: number;
};

type Country = {
  Country: string;
  Slug: string;
  Provinces: string[];
};

const US: Country = {
  Country: 'US',
  Slug: 'us',
  Provinces: [],
};

const ProvinceTooltip = ({
  selectedProvince: { province, x, y },
}: {
  selectedProvince: SelectedProvince;
}): JSX.Element | null =>
  !province ? null : (
    <section
      css={css`
        position: absolute;
        transform: translate(${x}px, ${y}px);
        background: #fffc;
        padding: 8px 16px;
      `}
    >
      <h1
        css={css`
          font-size: 16px;
          margin: 0 0 4px;
        `}
      >
        {province.name}
      </h1>
      <ul
        css={css`
          margin: 0;
          padding: 0;
          list-style: none;
          font-size: 14px;
        `}
      >
        {STATUSES.map(
          (status): JSX.Element => (
            <li key={status}>
              {(province.maxDates[status] &&
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                province.data[province.maxDates[status]!][status]) ||
                0}{' '}
              {status}
            </li>
          ),
        )}
      </ul>
    </section>
  );

type Province = {
  name: string;
  coordinates: [number, number];
  minDates: {
    confirmed?: number;
    deaths?: number;
    recovered?: number;
  };
  maxDates: {
    confirmed?: number;
    deaths?: number;
    recovered?: number;
  };
  data: {
    [date: number]: {
      confirmed?: number;
      deaths?: number;
      recovered?: number;
    };
  };
};

type Covid19Data = {
  [Slug: string]: {
    [Province: string]: Province;
  };
};

enum Covid19DataActionType {
  Add,
}

const addCovid19Data = ({
  covid19Data,
  slug,
  data,
}: {
  covid19Data: Covid19Data;
  slug: string;
  data: ApiDatum[];
}): Covid19Data => ({
  ...covid19Data,
  [slug]: data.reduce((acc, datum) => {
    const date = new Date(datum.Date).valueOf();

    // initialize nextProvince
    acc[datum.Province] = acc[datum.Province] || {
      name: datum.Province,
      coordinates: [datum.Lon, datum.Lat],
      minDates: {},
      maxDates: {},
      data: {},
    };
    const nextProvince = acc[datum.Province];

    // update nextProvince
    nextProvince.minDates[datum.Status] = !nextProvince.minDates[datum.Status]
      ? date
      : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        Math.min(nextProvince.minDates[datum.Status]!, date);
    nextProvince.maxDates[datum.Status] = !nextProvince.maxDates[datum.Status]
      ? date
      : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        Math.max(nextProvince.maxDates[datum.Status]!, date);

    // initialize nextData
    nextProvince.data[date] = nextProvince.data[date] || {};
    const nextData = nextProvince.data[date];

    // update nextData
    nextData[datum.Status] = datum.Cases;

    return acc;
  }, covid19Data[slug] || {}),
});

type Covid19DataAction = {
  type: Covid19DataActionType.Add;
  slug: string;
  data: ApiDatum[];
};

const covid19DataReducer = (
  covid19Data: Covid19Data,
  { type, slug, data }: Covid19DataAction,
): Covid19Data => {
  if (type === Covid19DataActionType.Add) {
    return addCovid19Data({ covid19Data, slug, data });
  }
  return { ...covid19Data };
};

export default function IndexPage(): JSX.Element {
  const [countries, setCountries] = useState<{ [Slug: string]: Country }>({
    us: US,
  });
  const [country, setCountry] = useState<Country>(US);
  const [covid19Data, dispatchCovid19Data] = useReducer(covid19DataReducer, {});
  const [
    selectedProvince,
    setSelectedProvince,
  ] = useState<SelectedProvince | null>(null);

  const countrySelectUid = useUID();
  const confirmedLayerUid = useUID();
  const deathsLayerUid = useUID();

  useEffect(() => {
    fetch('https://api.covid19api.com/countries')
      .then(res => res.json())
      .then((data: Country[]) => {
        if (!data) {
          return;
        }
        const dataMap = data.reduce((acc, c) => {
          acc[c.Slug] = c;
          return acc;
        }, {} as { [Slug: string]: Country });
        setCountries(dataMap);
        setCountry(dataMap.us);
      });
  }, []);

  useEffect(() => {
    if (covid19Data[country.Slug]) {
      // already fetched data
      return;
    }

    STATUSES.forEach(status => {
      fetch(
        `https://api.covid19api.com/dayone/country/${country.Slug}/status/${status}`,
      )
        .then(res => res.json())
        .then(data => {
          if (!data) {
            return;
          }
          dispatchCovid19Data({
            type: Covid19DataActionType.Add,
            slug: country.Slug,
            data,
          });
        });
    });
  }, [covid19Data, country]);

  const confirmedLayer = useMemo(
    () =>
      !covid19Data[country.Slug]
        ? null
        : new ScatterplotLayer({
            id: confirmedLayerUid,
            data: Object.keys(covid19Data[country.Slug])
              .map<Province>(k => covid19Data[country.Slug][k])
              .filter(province => province.maxDates.confirmed),
            pickable: true,
            opacity: 0.8,
            filled: true,
            radiusScale: 2000,
            radiusMinPixels: 2,
            radiusMaxPixels: 100,
            getPosition: (d: Province) => d.coordinates,
            getRadius: (d: Province) =>
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              Math.sqrt(d.data[d.maxDates.confirmed!].confirmed!),
            getFillColor: (d: Province) => [0, 124, 254],
            onHover: ({
              object: province,
              x,
              y,
            }: {
              object: Province;
              x: number;
              y: number;
            }) => {
              setSelectedProvince({
                province,
                x,
                y,
              });
            },
          }),
    [covid19Data, country, confirmedLayerUid],
  );

  const deathsLayer = useMemo(
    () =>
      !covid19Data[country.Slug]
        ? null
        : new ScatterplotLayer({
            id: deathsLayerUid,
            data: Object.keys(covid19Data[country.Slug])
              .map<Province>(k => covid19Data[country.Slug][k])
              .filter(province => province.maxDates.deaths),
            pickable: true,
            opacity: 0.8,
            filled: true,
            radiusScale: 2000,
            radiusMinPixels: 2,
            radiusMaxPixels: 100,
            getPosition: (d: Province) => d.coordinates,
            getRadius: (d: Province) =>
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              Math.sqrt(d.data[d.maxDates.deaths!].deaths!),
            getFillColor: (d: Province) => [255, 79, 122],
            onHover: ({
              object: province,
              x,
              y,
            }: {
              object: Province;
              x: number;
              y: number;
            }) => {
              setSelectedProvince({
                province,
                x,
                y,
              });
            },
          }),
    [covid19Data, country, deathsLayerUid],
  );

  return (
    <Layout>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller
        layers={[confirmedLayer, deathsLayer]}
      >
        <StaticMap
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
          width="100%"
          height="100%"
        />
        {selectedProvince && (
          <ProvinceTooltip selectedProvince={selectedProvince} />
        )}
      </DeckGL>
      <section
        css={css`
          position: absolute;
          margin: 16px;
          padding: 16px;
          background: #fffc;
        `}
      >
        <h2
          css={css`
            margin-top: 0;
          `}
        >
          <img
            src={Logo}
            alt="covid19api logo"
            css={css`
              width: 1em;
              height: 1em;
            `}
          />{' '}
          <a
            href="https://covid19api.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            covid19api
          </a>{' '}
          map
        </h2>
        <label htmlFor={countrySelectUid}>
          Select country:{' '}
          <select
            id={countrySelectUid}
            defaultValue={country.Slug}
            css={css`
              max-width: 200px;
            `}
            onChange={({ target: { value } }) => {
              setCountry(countries[value]);
            }}
          >
            {Object.keys(countries).map(k => (
              <option value={k} key={k}>
                {countries[k].Country}
              </option>
            ))}
          </select>
        </label>
      </section>
    </Layout>
  );
}

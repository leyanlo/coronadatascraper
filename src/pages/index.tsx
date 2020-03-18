import { ScatterplotLayer } from '@deck.gl/layers';
import DeckGL from '@deck.gl/react';
import { css } from '@emotion/core';
import React, { useEffect, useMemo, useState } from 'react';
import { StaticMap } from 'react-map-gl';
import { useUID } from 'react-uid';

import Logo from '../assets/logo.svg';
import { Layout } from '../components/Layout';

const MAPBOX_ACCESS_TOKEN = process.env.GATSBY_MAPBOX_ACCESS_TOKEN;

const initialViewState = {
  longitude: -97,
  latitude: 39,
  zoom: 3.8,
};

type Country = {
  Country: string;
  Slug: string;
  Provinces: string[];
};

type Status = {
  Country: string;
  Province: string;
  Lat: number;
  Lon: number;
  Date: string;
  Cases: number;
  Status: 'confirmed' | 'deaths' | 'recovered';
};

type SelectedStatus = {
  status: Status;
  x: number;
  y: number;
};

const US: Country = {
  Country: 'US',
  Slug: 'us',
  Provinces: ['California'],
};

const StatusTooltip = ({
  selectedStatus: { status, x, y },
}: {
  selectedStatus: SelectedStatus;
}): JSX.Element | null =>
  !status ? null : (
    <section
      css={css`
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        background-color: #fffc;
        padding: 4px 8px;
      `}
    >
      <h5
        css={css`
          margin: 0;
        `}
      >
        {status.Province}
      </h5>
      <small>
        {status.Cases} {status.Status}
      </small>
    </section>
  );

export default function IndexPage(): JSX.Element {
  const [countries, setCountries] = useState<{ [Slug: string]: Country }>({
    us: US,
  });
  const [country, setCountry] = useState<Country>(US);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<SelectedStatus | null>(
    null,
  );
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

  useEffect(() => {
    fetch(
      `https://api.covid19api.com/dayone/country/${country.Slug}/status/confirmed`,
    )
      .then(res => res.json())
      .then((data: Status[]) => {
        setStatuses(data);
      });
  }, [country]);

  const layer = useMemo(
    () =>
      new ScatterplotLayer({
        id: 'scatterplot-layer',
        data: statuses,
        pickable: true,
        opacity: 0.8,
        filled: true,
        radiusScale: 1000,
        radiusMinPixels: 1,
        radiusMaxPixels: 100,
        getPosition: (d: Status) => [d.Lon, d.Lat],
        getRadius: (d: Status) => Math.sqrt(d.Cases),
        getFillColor: (d: Status) => [0, 124, 254],
        onHover: ({
          object: status,
          x,
          y,
        }: {
          object: Status;
          x: number;
          y: number;
        }) => {
          setSelectedStatus({
            status,
            x,
            y,
          });
        },
      }),
    [statuses],
  );

  return (
    <Layout>
      <DeckGL initialViewState={initialViewState} controller layers={[layer]}>
        <StaticMap
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
          width="100%"
          height="100%"
        />
        {selectedStatus && <StatusTooltip selectedStatus={selectedStatus} />}
      </DeckGL>
      <section
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
          demo
        </h2>
        <label htmlFor={countrySelectUid}>
          Select country:{' '}
          <select
            id={countrySelectUid}
            defaultValue={country.Slug}
            css={css`
              min-width: 256px;
            `}
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

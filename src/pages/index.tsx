import DeckGL from '@deck.gl/react';
import React from 'react';
import { StaticMap } from 'react-map-gl';

import { Layout } from '../components/Layout';

const MAPBOX_ACCESS_TOKEN = process.env.GATSBY_MAPBOX_ACCESS_TOKEN;

const initialViewState = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
  pitch: 0,
  bearing: 0,
};

export default function IndexPage(): JSX.Element {
  return (
    <Layout>
      <DeckGL initialViewState={initialViewState} controller>
        <StaticMap
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
          width="100%"
          height="100%"
        />
      </DeckGL>
    </Layout>
  );
}

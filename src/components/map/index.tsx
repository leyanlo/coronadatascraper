import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { GeoJsonLayer, ScatterplotLayer } from '@deck.gl/layers';
import DeckGL from '@deck.gl/react';
import { css } from '@emotion/core';
import { Feature } from 'geojson';
import throttle from 'just-throttle';
import React, { useEffect, useMemo, useState } from 'react';
import { StaticMap } from 'react-map-gl';
import { useUID } from 'react-uid';

import { FilteredCdsData } from '../../../scripts/types';
import Logo from '../../assets/logo.svg';
import Octicon from '../../assets/octicon.svg';
import { COLOR_RANGE, COUNTRIES } from './constants';
import countriesGeoJson from './countries.geo.json';
import { linkCss, linkIconCss } from './css';
import LocationTooltip, { Location, SelectedLocation } from './LocationTooltip';
import { getColor, getLastDateDatum } from './utils';

const MAPBOX_ACCESS_TOKEN = process.env.GATSBY_MAPBOX_ACCESS_TOKEN;

const INITIAL_VIEW_STATE = {
  longitude: -97,
  latitude: 39,
  zoom: 3.8,
};

const Map = (): JSX.Element | null => {
  const [
    selectedLocation,
    setSelectedLocation,
  ] = useState<SelectedLocation | null>(null);
  const [isHovered, setHovered] = useState<boolean>(false);
  const [isClicked, setClicked] = useState<boolean>(false);
  const [cdsData, setCdsData] = useState<FilteredCdsData | null>(null);
  const filteredCdsData = useMemo(
    () =>
      cdsData &&
      Object.keys(cdsData)
        // filter out countries and large states
        .filter(k => {
          const nCommas = k.split(', ').length - 1;
          return k.endsWith('United States') || k.endsWith('United Kingdom')
            ? nCommas > 1
            : nCommas > 0;
        })
        .map<Location>(k => ({
          name: k
            .split(', ')
            .slice(0, -1)
            .join(', '),
          data: cdsData[k],
        })),
    [cdsData],
  );

  const countriesLayerUid = useUID();
  const heatmapLayerUid = useUID();
  const locationLayerUid = useUID();

  useEffect(() => {
    fetch('/timeseries-byLocation-filtered.json')
      .then(res => res.json())
      .then((data: FilteredCdsData) => {
        if (!data) {
          return;
        }
        setCdsData(data);
      });
  }, []);

  const countriesLayer = useMemo(
    () =>
      cdsData &&
      new GeoJsonLayer({
        id: countriesLayerUid,
        data: countriesGeoJson,
        pickable: true,
        opacity: 0.1,
        stroked: true,
        lineWidthUnits: 'pixels',
        getFillColor: (d: Feature<null, { name: string }>) => {
          const countryCode = d.id as keyof typeof COUNTRIES;
          const countryName = COUNTRIES[countryCode];
          const countryData = cdsData[countryName];
          const lastDateDatum = getLastDateDatum(countryData);
          return getColor(lastDateDatum?.cases || lastDateDatum?.deaths);
        },
        onHover: ({
          object: d,
          x,
          y,
        }: {
          object: Feature<null, { name: string }>;
          x: number;
          y: number;
        }) => {
          if (isClicked || !d) {
            setHovered(false);
            return;
          }

          const countryCode = d.id as keyof typeof COUNTRIES;
          const countryName = COUNTRIES[countryCode];
          setSelectedLocation({
            name: countryName || countryCode,
            data: cdsData[countryName],
            x,
            y,
          });
          setHovered(true);
        },
        onClick: ({
          object: d,
          x,
          y,
        }: {
          object: Feature<null, { name: string }>;
          x: number;
          y: number;
        }) => {
          const countryCode = d.id as keyof typeof COUNTRIES;
          const countryName = COUNTRIES[countryCode];
          setSelectedLocation({
            name: countryName || countryCode,
            data: cdsData[countryName],
            x,
            y,
          });
          setClicked(true);
          return true;
        },
        updateTriggers: {
          onHover: [isClicked],
        },
      }),
    [cdsData, countriesLayerUid, isClicked],
  );

  const heatmapLayer = useMemo(
    () =>
      filteredCdsData &&
      new HeatmapLayer({
        id: heatmapLayerUid,
        data: filteredCdsData,
        colorRange: COLOR_RANGE,
        colorDomain: [0.01, 1],
        getPosition: ({ data }: Location) => data.coordinates,
        getWeight: ({ data }: Location) => {
          const lastDateDatum = getLastDateDatum(data);
          return Math.log10(
            lastDateDatum?.cases || lastDateDatum?.deaths || 0.1,
          );
        },
      }),
    [filteredCdsData, heatmapLayerUid],
  );

  const locationLayer = useMemo(
    () =>
      filteredCdsData &&
      new ScatterplotLayer({
        id: locationLayerUid,
        data: filteredCdsData,
        pickable: true,
        radiusMinPixels: 2,
        radiusMaxPixels: 32,
        getPosition: ({ data }: Location) => data.coordinates,
        getRadius: 10000,
        getFillColor: ({ name }: Location) => [
          ...COLOR_RANGE[5],
          name === selectedLocation?.name ? 196 : 64,
        ],
        onHover: ({
          object: location,
          x,
          y,
        }: {
          object: Location;
          x: number;
          y: number;
        }) => {
          if (isClicked || !location) {
            setHovered(false);
            return;
          }

          setSelectedLocation({
            ...location,
            x,
            y,
          });
          setHovered(true);
        },
        onClick: ({
          object: location,
          x,
          y,
        }: {
          object: Location;
          x: number;
          y: number;
        }) => {
          setSelectedLocation({
            ...location,
            x,
            y,
          });
          setClicked(true);
          return true;
        },
        updateTriggers: {
          getFillColor: [selectedLocation],
          onHover: [isClicked],
        },
      }),
    [filteredCdsData, locationLayerUid, isClicked, selectedLocation],
  );

  return (
    <>
      <DeckGL
        getCursor={() => (isHovered ? 'pointer' : 'grab')}
        initialViewState={INITIAL_VIEW_STATE}
        controller
        onViewStateChange={throttle(({ interactionState: { isZooming } }) => {
          if (isZooming) {
            setClicked(false);
            setHovered(false);
          }
        }, 20)}
        layers={[countriesLayer, heatmapLayer, locationLayer]}
        onClick={() => {
          setClicked(false);
          setSelectedLocation(null);
        }}
        onDrag={throttle((
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          info: any,
          event: {
            deltaX: number;
            deltaY: number;
          },
        ) => {
          if (selectedLocation) {
            setSelectedLocation({
              ...selectedLocation,
              deltaX: event.deltaX,
              deltaY: event.deltaY,
            });
          }
        }, 20)}
      >
        <StaticMap
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
          width="100%"
          height="100%"
        />
      </DeckGL>
      {(isHovered || isClicked) && selectedLocation && (
        <LocationTooltip selectedLocation={selectedLocation} />
      )}
      <section
        css={css`
          position: absolute;
          margin: 16px;
          padding: 16px;
          background: #fffc;
        `}
      >
        <h1
          css={css`
            font-size: 20px;
            margin: 0;
          `}
        >
          Corona Data Scraper Map
          <div
            css={css`
              float: right;
              margin-left: 16px;
            `}
          >
            <a
              href="https://coronadatascraper.com/"
              target="_blank"
              rel="noopener noreferrer"
              css={linkCss}
              title="Data"
            >
              <img
                src={Logo}
                alt="Corona Data Scraper logo"
                css={linkIconCss}
              />
            </a>
            <a
              href="https://github.com/leyanlo/coronadatascraper"
              target="_blank"
              rel="noopener noreferrer"
              css={linkCss}
              title="Code"
            >
              <img src={Octicon} alt="GitHub logo" css={linkIconCss} />
            </a>
          </div>
        </h1>
      </section>
    </>
  );
};
export default Map;

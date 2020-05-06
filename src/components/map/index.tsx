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
import { COLORS, COUNTRIES } from './constants';
import countriesGeoJson from './countries.geo.json';
import CountryTooltip, { SelectedCountry } from './CountryTooltip';
import { linkCss, linkIconCss } from './css';
import LocationTooltip, { Location, SelectedLocation } from './LocationTooltip';
import { getLastDateDatum, lerp } from './utils';

const MAPBOX_ACCESS_TOKEN = process.env.GATSBY_MAPBOX_ACCESS_TOKEN;

const INITIAL_VIEW_STATE = {
  longitude: -97,
  latitude: 39,
  zoom: 3.8,
};

const LINE_WIDTH_MAX_PIXELS = 100;

const Map = (): JSX.Element | null => {
  const [
    selectedLocation,
    setSelectedLocation,
  ] = useState<SelectedLocation | null>(null);
  const [
    selectedCountry,
    setSelectedCountry,
  ] = useState<SelectedCountry | null>(null);
  const [isHovered, setHovered] = useState<boolean>(false);
  const [isClicked, setClicked] = useState<boolean>(false);
  const [isCountryHovered, setCountryHovered] = useState<boolean>(false);
  const [cdsData, setCdsData] = useState<FilteredCdsData | null>(null);

  const countriesLayerUid = useUID();
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
        stroked: true,
        lineWidthUnits: 'pixels',
        getFillColor: (d: Feature<null, { name: string }>) => {
          const countryCode = d.id as keyof typeof COUNTRIES;
          const countryName = COUNTRIES[countryCode];
          const countryData = cdsData[countryName];
          const lastDateDatum = getLastDateDatum(countryData);
          const alpha = !lastDateDatum?.cases
            ? 0
            : ~~(Math.log10(lastDateDatum.cases) * 20);
          return [...COLORS.olive, alpha];
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
          if (!d) {
            setCountryHovered(false);
            return;
          }
          const countryCode = d.id as keyof typeof COUNTRIES;
          const countryName = COUNTRIES[countryCode];
          setSelectedCountry({
            countryName,
            countryData: cdsData[countryName],
            x,
            y,
          });
          setCountryHovered(true);
        },
        updateTriggers: {
          getFillColor: [cdsData, countriesLayerUid, selectedCountry],
        },
      }),
    [cdsData, countriesLayerUid, selectedCountry],
  );

  const locationLayer = useMemo(
    () =>
      cdsData &&
      new ScatterplotLayer({
        id: locationLayerUid,
        data: Object.keys(cdsData)
          // filter out countries and large states
          .filter(k => {
            const nCommas = k.split(', ').length - 1;
            return k.endsWith('United States') || k.endsWith('United Kingdom')
              ? nCommas > 1
              : nCommas > 0;
          })
          .map<Location>(k => ({
            ...cdsData[k],
            name: k
              .split(', ')
              .slice(0, -1)
              .join(', '),
          })),
        pickable: true,
        filled: true,
        radiusScale: 2000,
        radiusMinPixels: 4,
        radiusMaxPixels: 100,
        getPosition: (d: Location) => d.coordinates,
        getRadius: (d: Location) => {
          const lastDateDatum = getLastDateDatum(d);
          return Math.sqrt(lastDateDatum?.cases || 0);
        },
        getFillColor: (d: Location) => {
          const lastDateDatum = getLastDateDatum(d);
          return lerp(
            [...COLORS.forest, 200],
            [...COLORS.blue, 200],
            Math.min(1, Math.log10(lastDateDatum?.cases || 1) / 10),
          );
        },
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
            location,
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
            location,
            x,
            y,
          });
          setClicked(true);
          return true;
        },
      }),
    [cdsData, locationLayerUid, isClicked],
  );

  return (
    <>
      <DeckGL
        getCursor={() => (isHovered || isCountryHovered ? 'pointer' : 'grab')}
        initialViewState={INITIAL_VIEW_STATE}
        controller
        onViewStateChange={throttle(({ interactionState: { isZooming } }) => {
          if (isZooming) {
            setClicked(false);
            setHovered(false);
            setCountryHovered(false);
          }
        }, 20)}
        layers={[countriesLayer, locationLayer]}
        onClick={() => {
          setClicked(false);
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
              location: selectedLocation.location,
              x: selectedLocation.x,
              y: selectedLocation.y,
              deltaX: event.deltaX,
              deltaY: event.deltaY,
            });
          }
          if (selectedCountry) {
            setSelectedCountry({
              countryName: selectedCountry.countryName,
              countryData: selectedCountry.countryData,
              x: selectedCountry.x,
              y: selectedCountry.y,
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
      {isCountryHovered && selectedCountry && (
        <CountryTooltip selectedCountry={selectedCountry} />
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

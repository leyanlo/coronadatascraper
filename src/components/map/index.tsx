import { GeoJsonLayer, ScatterplotLayer } from '@deck.gl/layers';
import DeckGL from '@deck.gl/react';
import { css } from '@emotion/core';
import { Feature } from 'geojson';
import throttle from 'just-throttle';
import React, { useEffect, useMemo, useReducer, useState } from 'react';
import { StaticMap } from 'react-map-gl';
import { useUID } from 'react-uid';

import { FilteredCdsData, Level } from '../../../scripts/types';
import Logo from '../../assets/logo.svg';
import Octicon from '../../assets/octicon.svg';
import { COUNTRIES, STATUSES } from './constants';
import countriesGeoJson from './countries.geo.json';
import CountryTooltip, { SelectedCountry } from './CountryTooltip';
import { linkCss, linkIconCss } from './css';
import LocationTooltip, { Location, SelectedLocation } from './LocationTooltip';
import { ApiDatum, Covid19Data, Province } from './types';
import { getLastDateDatum } from './utils';

const MAPBOX_ACCESS_TOKEN = process.env.GATSBY_MAPBOX_ACCESS_TOKEN;

const INITIAL_VIEW_STATE = {
  longitude: -97,
  latitude: 39,
  zoom: 3.8,
};

const LINE_WIDTH_MAX_PIXELS = 100;

const addCovid19Data = ({
  covid19Data,
  country,
  data,
}: {
  covid19Data: Covid19Data;
  country: string;
  data: ApiDatum[];
}): Covid19Data => ({
  ...covid19Data,
  [country]: data.reduce((acc, datum) => {
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
  }, covid19Data[country] || {}),
});

enum Covid19DataActionType {
  Add,
}

type Covid19DataAction = {
  type: Covid19DataActionType.Add;
  country: string;
  data: ApiDatum[];
};

const covid19DataReducer = (
  covid19Data: Covid19Data,
  { type, country, data }: Covid19DataAction,
): Covid19Data => {
  if (type === Covid19DataActionType.Add) {
    return addCovid19Data({ covid19Data, country, data });
  }
  return { ...covid19Data };
};

const Map = (): JSX.Element | null => {
  const [country, setCountry] = useState<string>('us');
  const [covid19Data, dispatchCovid19Data] = useReducer(covid19DataReducer, {});
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
  const deathsLayerUid = useUID();

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

  useEffect(() => {
    if (covid19Data[country]) {
      // already fetched data
      return;
    }

    STATUSES.forEach(status => {
      fetch(
        `https://api.covid19api.com/dayone/country/${country}/status/${status}/live`,
      )
        .then(res => res.json())
        .then((data: ApiDatum[] | null | {}) => {
          if (!Array.isArray(data)) {
            return;
          }
          dispatchCovid19Data({
            type: Covid19DataActionType.Add,
            country,
            data,
          });
        });
    });
  }, [covid19Data, country]);

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
          return [130, 152, 0, alpha];
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
          getFillColor: [cdsData, countriesLayerUid, country, selectedCountry],
        },
      }),
    [cdsData, countriesLayerUid, country, selectedCountry],
  );

  const locationLayer = useMemo(
    () =>
      cdsData &&
      new ScatterplotLayer({
        id: locationLayerUid,
        data: Object.keys(cdsData)
          .map<Location>(k => ({
            ...cdsData[k],
            name: k
              .split(', ')
              .slice(0, -1)
              .join(', '),
          }))
          .filter(datum => datum.level !== Level.Country),
        pickable: true,
        stroked: true,
        filled: false,
        lineWidthUnits: 'pixels',
        lineWidthMinPixels: 8,
        lineWidthMaxPixels: LINE_WIDTH_MAX_PIXELS,
        getPosition: (d: Location) => d.coordinates,
        getRadius: 0,
        getLineWidth: (d: Location) => {
          const lastDateDatum = getLastDateDatum(d);
          return (
            (!lastDateDatum?.deaths ? 0 : Math.sqrt(lastDateDatum.deaths)) +
            Math.sqrt(lastDateDatum?.cases || 0)
          );
        },
        getLineColor: [0, 126, 96, 200],
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

  const deathsLayer = useMemo(
    () =>
      covid19Data[country] &&
      new ScatterplotLayer({
        id: deathsLayerUid,
        data: Object.keys(covid19Data[country])
          .map<Province>(k => covid19Data[country][k])
          .filter(province => province.maxDates.deaths),
        stroked: true,
        filled: false,
        lineWidthUnits: 'pixels',
        lineWidthMinPixels: 4,
        getPosition: (d: Province) => d.coordinates,
        getRadius: 0,
        getLineWidth: (d: Province) => {
          const deathsLineWidth = Math.sqrt(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            d.data[d.maxDates.deaths!].deaths!,
          );

          const confirmedLineWidth =
            deathsLineWidth +
            (!d.maxDates.confirmed
              ? 0
              : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                Math.sqrt(d.data[d.maxDates.confirmed!].confirmed!));

          const clampedRatio =
            LINE_WIDTH_MAX_PIXELS /
            Math.max(LINE_WIDTH_MAX_PIXELS, confirmedLineWidth);

          return (
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            clampedRatio * Math.sqrt(d.data[d.maxDates.deaths!].deaths!)
          );
        },
        getLineColor: [33, 56, 94, 200],
      }),
    [covid19Data, country, deathsLayerUid],
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
        layers={[countriesLayer, locationLayer, deathsLayer]}
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

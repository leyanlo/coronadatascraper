import { css } from '@emotion/core';
import React, { useMemo } from 'react';

import { FilteredCdsDateDatum, FilteredCdsDatum } from '../../../types';
import useWindowSize from '../../hooks/useWindowSize';
import { TOOLTIP_OFFSET } from './constants';
import { getLastDateDatum } from './utils';

export type SelectedCountry = {
  countryName: string;
  countryData: FilteredCdsDatum;
  x: number;
  y: number;
  deltaX?: number;
  deltaY?: number;
};

const CountryTooltip = ({
  selectedCountry: { countryName, countryData, x, y, deltaX = 0, deltaY = 0 },
}: {
  selectedCountry: SelectedCountry;
}): JSX.Element | null => {
  const { width, height } = useWindowSize();

  const nextX = x + deltaX;
  const nextY = y + deltaY;

  const isRight = useMemo(() => !width || nextX < width / 2, [nextX, width]);
  const isBottom = useMemo(() => !height || nextY < height / 2, [
    nextY,
    height,
  ]);

  return (
    <section
      css={css`
        position: absolute;
        transform: translate(
            ${isRight ? nextX + TOOLTIP_OFFSET : nextX - TOOLTIP_OFFSET}px,
            ${isBottom ? nextY + TOOLTIP_OFFSET : nextY - TOOLTIP_OFFSET}px
          )
          translate(${isRight ? 0 : '-100%'}, ${isBottom ? 0 : '-100%'});
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
        {countryName}
      </h1>
      <ul
        css={css`
          margin: 0;
          padding: 0;
          list-style: none;
          font-size: 14px;
        `}
      >
        {countryData
          ? (['cases', 'deaths'] as (keyof FilteredCdsDateDatum)[]).map(
              (status): JSX.Element => {
                const lastDateDatum = getLastDateDatum(countryData);
                return (
                  <li key={status}>
                    {lastDateDatum ? lastDateDatum[status] : 0} {status}
                  </li>
                );
              },
            )
          : 'No data'}
      </ul>
    </section>
  );
};
export default CountryTooltip;

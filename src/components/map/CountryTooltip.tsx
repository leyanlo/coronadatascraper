import { css } from '@emotion/core';
import React, { useMemo } from 'react';

import useWindowSize from '../../hooks/useWindowSize';
import { STATUS_TO_SUMMARY, STATUSES,TOOLTIP_OFFSET } from './constants';
import { ApiSummaryCountry } from './types';

export type SelectedCountry = {
  summaryCountry: ApiSummaryCountry;
  x: number;
  y: number;
  deltaX?: number;
  deltaY?: number;
};

const CountryTooltip = ({
  selectedCountry: { summaryCountry, x, y, deltaX = 0, deltaY = 0 },
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
        {summaryCountry.Country}
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
              {summaryCountry[STATUS_TO_SUMMARY[status].total]} (+
              {summaryCountry[STATUS_TO_SUMMARY[status].new]}) {status}
            </li>
          ),
        )}
      </ul>
    </section>
  );
};
export default CountryTooltip;

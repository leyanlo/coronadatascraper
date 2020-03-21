import { css } from '@emotion/core';
import React, { useMemo } from 'react';

import useWindowSize from '../../hooks/useWindowSize';
import { STATUSES } from './constants';
import { Province } from './types';

export type SelectedProvince = {
  province: Province;
  x: number;
  y: number;
};

export const ProvinceTooltip = ({
  selectedProvince: { province, x, y },
}: {
  selectedProvince: SelectedProvince;
}): JSX.Element | null => {
  const { width, height } = useWindowSize();
  const translateX = useMemo(() => (!width || x < width / 2 ? 0 : '-100%'), [
    x,
    width,
  ]);
  const translateY = useMemo(() => (!height || y < height / 2 ? 0 : '-100%'), [
    y,
    height,
  ]);

  if (!province) {
    return null;
  }

  return (
    <section
      css={css`
        position: absolute;
        transform: translate(${x}px, ${y}px)
          translate(${translateX}, ${translateY});
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
};

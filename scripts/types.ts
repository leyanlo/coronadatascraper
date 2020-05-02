type CdsDateDatum = {
  cases?: number;
  deaths?: number;
  recovered?: number;
  active?: number;
  growthFactor?: number | null;
  tested?: number;
};

type Maintainer = {
  name: string;
  email?: string;
  twitter?: string;
  github: string;
  country?: string;
  state?: string;
  county?: string;
  city?: string;
  flag?: string;
  url?: string;
};

type Curator = {
  name: string;
  url?: string;
  twitter?: string;
  github?: string;
};

export enum Level {
  Country = 'country',
  State = 'state',
  County = 'county',
  City = 'city',
}

type Source = {
  url?: string;
  name: string;
  description?: string;
};

export type CdsDatum = {
  dates: {
    [isoDate: string]: CdsDateDatum;
  };
  maintainers?: Maintainer[];
  url: string;
  country: string;
  curators?: Curator[];
  aggregate?: Level;
  coordinates?: [number, number];
  rating: number;
  name: string;
  level: Level;
  tz?: string[];
  featureId?: number;
  population?: number;
  state?: string;
  sources?: Source[];
  stateId?: string;
  hospitalized?: number;
  countryId?: string;
  county?: string;
  countyId?: string;
  city?: string;
};

export type CdsData = {
  [stateOrCounty: string]: CdsDatum;
};

export enum DatumKind {
  Cases = 'cases',
  Deaths = 'deaths',
}

export type FilteredCdsDateDatum = {
  [kind in DatumKind]?: number;
};

export type FilteredCdsDatum = {
  dates: {
    [isoDate: string]: FilteredCdsDateDatum;
  };
  coordinates?: [number, number];
  level: Level;
  population?: number;
};

export type FilteredCdsData = {
  [stateOrCounty: string]: FilteredCdsDatum;
};

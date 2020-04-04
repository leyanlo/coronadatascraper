type CdsDateDatum = {
  cases?: number;
  deaths?: number;
  recovered?: number;
  active?: number;
  tested?: number;
  growthFactor?: number | null;
};

type Maintainer = {
  name: string;
  email: string;
  twitter: string;
  github: string;
  country: string;
  state: string;
  county: string;
  city: string;
  flag: string;
};

type Curator = {
  name: string;
  url: string;
  twitter: string;
  github: string;
};

type Source = {
  url: string;
  name: string;
  description: string;
};

export type CdsDatum = {
  dates: {
    [isoDate: string]: CdsDateDatum;
  };
  maintainers: Maintainer[];
  url: string;
  curators?: Curator[];
  aggregate: 'state' | 'county';
  country: string;
  coordinates: [number, number];
  state?: string;
  rating: number;
  sources?: Source[];
  tz: string[];
  featureId: number;
  population: number;
};

export type CdsData = {
  [stateOrCounty: string]: CdsDatum;
};

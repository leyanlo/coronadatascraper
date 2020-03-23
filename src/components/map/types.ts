export type ApiStatus = 'confirmed' | 'deaths' | 'recovered';

export type ApiDatum = {
  Country: string;
  Province: string;
  Lat: number;
  Lon: number;
  Date: string;
  Cases: number;
  Status: ApiStatus;
};

export type ApiSummaryCountry = {
  Country: string;
  NewConfirmed: number;
  TotalConfirmed: number;
  NewDeaths: number;
  TotalDeaths: number;
  NewRecovered: number;
  TotalRecovered: number;
};

export type ApiSummary = {
  Countries: ApiSummaryCountry[];
  Date: string;
};

export type Summary = {
  Countries: {
    [country: string]: ApiSummaryCountry;
  };
  Date: string | null;
};

export type Province = {
  name: string;
  coordinates: [number, number];
  minDates: {
    confirmed?: number;
    deaths?: number;
    recovered?: number;
  };
  maxDates: {
    confirmed?: number;
    deaths?: number;
    recovered?: number;
  };
  data: {
    [date: number]: {
      confirmed?: number;
      deaths?: number;
      recovered?: number;
    };
  };
};

export type Covid19Data = {
  [country: string]: {
    [province: string]: Province;
  };
};

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

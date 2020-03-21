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

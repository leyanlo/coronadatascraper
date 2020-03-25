import { ApiStatus, ApiSummaryCountry } from './types';

// eslint-disable-next-line import/prefer-default-export
export const STATUSES: ApiStatus[] = ['confirmed', 'deaths', 'recovered'];

export const STATUS_TO_SUMMARY: {
  [status in ApiStatus]: {
    total: keyof ApiSummaryCountry;
    new: keyof ApiSummaryCountry;
  };
} = {
  confirmed: { total: 'TotalConfirmed', new: 'NewConfirmed' },
  deaths: { total: 'TotalDeaths', new: 'NewDeaths' },
  recovered: { total: 'TotalRecovered', new: 'NewRecovered' },
};

// // Generate COUNTRIES with:
// const countries = require('./src/components/map/countries.geo.json');
// const apiCountries = require('./static/test-api/countries.json');
//
// const apiNameToApiId = apiCountries.reduce((acc, apiCountry) => {
//   acc[apiCountry.Country] = apiCountry.Slug;
//   return acc;
// }, {});
//
// const idToApi = {
//   MKD: { apiId: 'north-macedonia', apiName: 'North Macedonia' },
//   SRB: { apiId: 'serbia', apiName: 'Serbia' },
//   TZA: { apiId: 'tanzania', apiName: 'Tanzania' },
//   USA: { apiId: 'us', apiName: 'US' },
// };
//
// const COUNTRIES = countries.features.reduce(
//   (acc, { id, properties: { name } }) => {
//     const apiId = apiNameToApiId[name] || (idToApi[id] && idToApi[id].apiId);
//     const apiName = idToApi[id] && idToApi[id].apiName;
//     acc[id] = {
//       name,
//       ...(apiId ? { apiId } : {}),
//       ...(apiName ? { apiName } : {}),
//     };
//     return acc;
//   },
//   {},
// );
//
// const missingCountries = Object.keys(COUNTRIES).reduce(
//   (acc, id) => {
//     if (acc[id].apiId) {
//       delete acc[id];
//     }
//     return acc;
//   },
//   { ...COUNTRIES },
// );
//
// const missingApiNameToApiId = Object.keys(COUNTRIES).reduce(
//   (acc, id) => {
//     delete acc[COUNTRIES[id].name];
//     delete acc[COUNTRIES[id].apiName];
//     return acc;
//   },
//   {
//     ...apiNameToApiId,
//   },
// );

export const COUNTRIES: {
  [id: string]:
    | {
        name: string;
      }
    | {
        name: string;
        apiId: string;
      }
    | {
        name: string;
        apiId: string;
        apiName: string;
      };
} = {
  AFG: { name: 'Afghanistan', apiId: 'afghanistan' },
  AGO: { name: 'Angola', apiId: 'angola' },
  ALB: { name: 'Albania', apiId: 'albania' },
  ARE: { name: 'United Arab Emirates', apiId: 'united-arab-emirates' },
  ARG: { name: 'Argentina', apiId: 'argentina' },
  ARM: { name: 'Armenia', apiId: 'armenia' },
  ATA: { name: 'Antarctica' },
  ATF: { name: 'French Southern and Antarctic Lands' },
  AUS: { name: 'Australia', apiId: 'australia' },
  AUT: { name: 'Austria', apiId: 'austria' },
  AZE: { name: 'Azerbaijan', apiId: 'azerbaijan' },
  BDI: { name: 'Burundi' },
  BEL: { name: 'Belgium', apiId: 'belgium' },
  BEN: { name: 'Benin', apiId: 'benin' },
  BFA: { name: 'Burkina Faso', apiId: 'burkina-faso' },
  BGD: { name: 'Bangladesh', apiId: 'bangladesh' },
  BGR: { name: 'Bulgaria', apiId: 'bulgaria' },
  BHS: { name: 'The Bahamas', apiId: 'the-bahamas' },
  BIH: { name: 'Bosnia and Herzegovina', apiId: 'bosnia-and-herzegovina' },
  BLR: { name: 'Belarus', apiId: 'belarus' },
  BLZ: { name: 'Belize', apiId: 'belize' },
  BMU: { name: 'Bermuda' },
  BOL: { name: 'Bolivia', apiId: 'bolivia' },
  BRA: { name: 'Brazil', apiId: 'brazil' },
  BRN: { name: 'Brunei', apiId: 'brunei' },
  BTN: { name: 'Bhutan', apiId: 'bhutan' },
  BWA: { name: 'Botswana' },
  CAF: { name: 'Central African Republic', apiId: 'central-african-republic' },
  CAN: { name: 'Canada', apiId: 'canada' },
  CHE: { name: 'Switzerland', apiId: 'switzerland' },
  CHL: { name: 'Chile', apiId: 'chile' },
  CHN: { name: 'China', apiId: 'china' },
  CIV: { name: 'Ivory Coast', apiId: 'ivory-coast' },
  CMR: { name: 'Cameroon', apiId: 'cameroon' },
  COD: { name: 'Democratic Republic of the Congo' },
  COG: { name: 'Republic of the Congo', apiId: 'republic-of-the-congo' },
  COL: { name: 'Colombia', apiId: 'colombia' },
  CRI: { name: 'Costa Rica', apiId: 'costa-rica' },
  CUB: { name: 'Cuba', apiId: 'cuba' },
  '-99': { name: 'Somaliland' },
  CYP: { name: 'Cyprus', apiId: 'cyprus' },
  CZE: { name: 'Czech Republic', apiId: 'czech-republic' },
  DEU: { name: 'Germany', apiId: 'germany' },
  DJI: { name: 'Djibouti', apiId: 'djibouti' },
  DNK: { name: 'Denmark', apiId: 'denmark' },
  DOM: { name: 'Dominican Republic', apiId: 'dominican-republic' },
  DZA: { name: 'Algeria', apiId: 'algeria' },
  ECU: { name: 'Ecuador', apiId: 'ecuador' },
  EGY: { name: 'Egypt', apiId: 'egypt' },
  ERI: { name: 'Eritrea', apiId: 'eritrea' },
  ESP: { name: 'Spain', apiId: 'spain' },
  EST: { name: 'Estonia', apiId: 'estonia' },
  ETH: { name: 'Ethiopia', apiId: 'ethiopia' },
  FIN: { name: 'Finland', apiId: 'finland' },
  FJI: { name: 'Fiji', apiId: 'fiji' },
  FLK: { name: 'Falkland Islands' },
  FRA: { name: 'France', apiId: 'france' },
  GAB: { name: 'Gabon', apiId: 'gabon' },
  GBR: { name: 'United Kingdom', apiId: 'united-kingdom' },
  GEO: { name: 'Georgia', apiId: 'georgia' },
  GHA: { name: 'Ghana', apiId: 'ghana' },
  GIN: { name: 'Guinea', apiId: 'guinea' },
  GMB: { name: 'Gambia', apiId: 'gambia' },
  GNB: { name: 'Guinea Bissau' },
  GNQ: { name: 'Equatorial Guinea', apiId: 'equatorial-guinea' },
  GRC: { name: 'Greece', apiId: 'greece' },
  GRL: { name: 'Greenland', apiId: 'greenland' },
  GTM: { name: 'Guatemala', apiId: 'guatemala' },
  GUF: { name: 'French Guiana', apiId: 'french-guiana' },
  GUY: { name: 'Guyana', apiId: 'guyana' },
  HND: { name: 'Honduras', apiId: 'honduras' },
  HRV: { name: 'Croatia', apiId: 'croatia' },
  HTI: { name: 'Haiti', apiId: 'haiti' },
  HUN: { name: 'Hungary', apiId: 'hungary' },
  IDN: { name: 'Indonesia', apiId: 'indonesia' },
  IND: { name: 'India', apiId: 'india' },
  IRL: { name: 'Ireland', apiId: 'ireland' },
  IRN: { name: 'Iran', apiId: 'iran' },
  IRQ: { name: 'Iraq', apiId: 'iraq' },
  ISL: { name: 'Iceland', apiId: 'iceland' },
  ISR: { name: 'Israel', apiId: 'israel' },
  ITA: { name: 'Italy', apiId: 'italy' },
  JAM: { name: 'Jamaica', apiId: 'jamaica' },
  JOR: { name: 'Jordan', apiId: 'jordan' },
  JPN: { name: 'Japan', apiId: 'japan' },
  KAZ: { name: 'Kazakhstan', apiId: 'kazakhstan' },
  KEN: { name: 'Kenya', apiId: 'kenya' },
  KGZ: { name: 'Kyrgyzstan', apiId: 'kyrgyzstan' },
  KHM: { name: 'Cambodia', apiId: 'cambodia' },
  KOR: { name: 'South Korea', apiId: 'south-korea' },
  'CS-KM': { name: 'Kosovo', apiId: 'kosovo' },
  KWT: { name: 'Kuwait', apiId: 'kuwait' },
  LAO: { name: 'Laos', apiId: 'laos' },
  LBN: { name: 'Lebanon', apiId: 'lebanon' },
  LBR: { name: 'Liberia', apiId: 'liberia' },
  LBY: { name: 'Libya', apiId: 'libya' },
  LKA: { name: 'Sri Lanka', apiId: 'sri-lanka' },
  LSO: { name: 'Lesotho' },
  LTU: { name: 'Lithuania', apiId: 'lithuania' },
  LUX: { name: 'Luxembourg', apiId: 'luxembourg' },
  LVA: { name: 'Latvia', apiId: 'latvia' },
  MAR: { name: 'Morocco', apiId: 'morocco' },
  MDA: { name: 'Moldova', apiId: 'moldova' },
  MDG: { name: 'Madagascar', apiId: 'madagascar' },
  MEX: { name: 'Mexico', apiId: 'mexico' },
  MKD: {
    name: 'Macedonia',
    apiId: 'north-macedonia',
    apiName: 'North Macedonia',
  },
  MLI: { name: 'Mali' },
  MLT: { name: 'Malta', apiId: 'malta' },
  MMR: { name: 'Myanmar' },
  MNE: { name: 'Montenegro', apiId: 'montenegro' },
  MNG: { name: 'Mongolia', apiId: 'mongolia' },
  MOZ: { name: 'Mozambique', apiId: 'mozambique' },
  MRT: { name: 'Mauritania', apiId: 'mauritania' },
  MWI: { name: 'Malawi' },
  MYS: { name: 'Malaysia', apiId: 'malaysia' },
  NAM: { name: 'Namibia', apiId: 'namibia' },
  NCL: { name: 'New Caledonia' },
  NER: { name: 'Niger', apiId: 'niger' },
  NGA: { name: 'Nigeria', apiId: 'nigeria' },
  NIC: { name: 'Nicaragua', apiId: 'nicaragua' },
  NLD: { name: 'Netherlands', apiId: 'netherlands' },
  NOR: { name: 'Norway', apiId: 'norway' },
  NPL: { name: 'Nepal', apiId: 'nepal' },
  NZL: { name: 'New Zealand', apiId: 'new-zealand' },
  OMN: { name: 'Oman', apiId: 'oman' },
  PAK: { name: 'Pakistan', apiId: 'pakistan' },
  PAN: { name: 'Panama', apiId: 'panama' },
  PER: { name: 'Peru', apiId: 'peru' },
  PHL: { name: 'Philippines', apiId: 'philippines' },
  PNG: { name: 'Papua New Guinea', apiId: 'papua-new-guinea' },
  POL: { name: 'Poland', apiId: 'poland' },
  PRI: { name: 'Puerto Rico', apiId: 'puerto-rico' },
  PRK: { name: 'North Korea' },
  PRT: { name: 'Portugal', apiId: 'portugal' },
  PRY: { name: 'Paraguay', apiId: 'paraguay' },
  QAT: { name: 'Qatar', apiId: 'qatar' },
  ROU: { name: 'Romania', apiId: 'romania' },
  RUS: { name: 'Russia', apiId: 'russia' },
  RWA: { name: 'Rwanda', apiId: 'rwanda' },
  ESH: { name: 'Western Sahara' },
  SAU: { name: 'Saudi Arabia', apiId: 'saudi-arabia' },
  SDN: { name: 'Sudan', apiId: 'sudan' },
  SSD: { name: 'South Sudan' },
  SEN: { name: 'Senegal', apiId: 'senegal' },
  SLB: { name: 'Solomon Islands' },
  SLE: { name: 'Sierra Leone' },
  SLV: { name: 'El Salvador', apiId: 'el-salvador' },
  SOM: { name: 'Somalia', apiId: 'somalia' },
  SRB: { name: 'Republic of Serbia', apiId: 'serbia', apiName: 'Serbia' },
  SUR: { name: 'Suriname', apiId: 'suriname' },
  SVK: { name: 'Slovakia', apiId: 'slovakia' },
  SVN: { name: 'Slovenia', apiId: 'slovenia' },
  SWE: { name: 'Sweden', apiId: 'sweden' },
  SWZ: { name: 'Swaziland' },
  SYR: { name: 'Syria', apiId: 'syria' },
  TCD: { name: 'Chad', apiId: 'chad' },
  TGO: { name: 'Togo', apiId: 'togo' },
  THA: { name: 'Thailand', apiId: 'thailand' },
  TJK: { name: 'Tajikistan' },
  TKM: { name: 'Turkmenistan' },
  TLS: { name: 'East Timor', apiId: 'east-timor' },
  TTO: { name: 'Trinidad and Tobago', apiId: 'trinidad-and-tobago' },
  TUN: { name: 'Tunisia', apiId: 'tunisia' },
  TUR: { name: 'Turkey', apiId: 'turkey' },
  TWN: { name: 'Taiwan', apiId: 'taiwan' },
  TZA: {
    name: 'United Republic of Tanzania',
    apiId: 'tanzania',
    apiName: 'Tanzania',
  },
  UGA: { name: 'Uganda', apiId: 'uganda' },
  UKR: { name: 'Ukraine', apiId: 'ukraine' },
  URY: { name: 'Uruguay', apiId: 'uruguay' },
  USA: { name: 'United States of America', apiId: 'us', apiName: 'US' },
  UZB: { name: 'Uzbekistan', apiId: 'uzbekistan' },
  VEN: { name: 'Venezuela', apiId: 'venezuela' },
  VNM: { name: 'Vietnam', apiId: 'vietnam' },
  VUT: { name: 'Vanuatu' },
  PSE: { name: 'West Bank' },
  YEM: { name: 'Yemen' },
  ZAF: { name: 'South Africa', apiId: 'south-africa' },
  ZMB: { name: 'Zambia', apiId: 'zambia' },
  ZWE: { name: 'Zimbabwe', apiId: 'zimbabwe' },
};

export const API_NAME_TO_API_ID = (Object.keys(
  COUNTRIES,
) as (keyof typeof COUNTRIES)[]).reduce((acc, k) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { name, apiId, apiName } = COUNTRIES[k] as any;
  if (apiId) {
    acc[apiName || name] = apiId;
  }
  return acc;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}, {} as any);

// avoid cursor touching tooltip
export const TOOLTIP_OFFSET = 4;

export const siteMetadata = {
  name: 'CDS Map',
  description: 'Map created using Corona Data Scraper.',
};

export const plugins = [
  'gatsby-plugin-emotion',
  {
    resolve: 'gatsby-plugin-manifest',
    options: {
      ...siteMetadata,
      display: 'minimal-ui',
      theme_color: '#ff4f7a',
      background_color: 'white',
      icon: 'src/assets/logo.svg',
      lang: 'en-US',
      start_url: '/',
    },
  },
  'gatsby-plugin-react-helmet',
  'gatsby-plugin-typescript',
  'gatsby-plugin-offline',
  {
    resolve: `gatsby-plugin-google-analytics`,
    options: {
      trackingId: 'UA-126651057-3',
      head: true,
      respectDNT: true,
    },
  },
];
